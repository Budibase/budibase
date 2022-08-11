import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class AuditManager extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: AuditManager.Types.ClientConfiguration)
  config: Config & AuditManager.Types.ClientConfiguration;
  /**
   *  Associates an evidence folder to an assessment report in a Audit Manager assessment. 
   */
  associateAssessmentReportEvidenceFolder(params: AuditManager.Types.AssociateAssessmentReportEvidenceFolderRequest, callback?: (err: AWSError, data: AuditManager.Types.AssociateAssessmentReportEvidenceFolderResponse) => void): Request<AuditManager.Types.AssociateAssessmentReportEvidenceFolderResponse, AWSError>;
  /**
   *  Associates an evidence folder to an assessment report in a Audit Manager assessment. 
   */
  associateAssessmentReportEvidenceFolder(callback?: (err: AWSError, data: AuditManager.Types.AssociateAssessmentReportEvidenceFolderResponse) => void): Request<AuditManager.Types.AssociateAssessmentReportEvidenceFolderResponse, AWSError>;
  /**
   *  Associates a list of evidence to an assessment report in an Audit Manager assessment. 
   */
  batchAssociateAssessmentReportEvidence(params: AuditManager.Types.BatchAssociateAssessmentReportEvidenceRequest, callback?: (err: AWSError, data: AuditManager.Types.BatchAssociateAssessmentReportEvidenceResponse) => void): Request<AuditManager.Types.BatchAssociateAssessmentReportEvidenceResponse, AWSError>;
  /**
   *  Associates a list of evidence to an assessment report in an Audit Manager assessment. 
   */
  batchAssociateAssessmentReportEvidence(callback?: (err: AWSError, data: AuditManager.Types.BatchAssociateAssessmentReportEvidenceResponse) => void): Request<AuditManager.Types.BatchAssociateAssessmentReportEvidenceResponse, AWSError>;
  /**
   *  Creates a batch of delegations for an assessment in Audit Manager. 
   */
  batchCreateDelegationByAssessment(params: AuditManager.Types.BatchCreateDelegationByAssessmentRequest, callback?: (err: AWSError, data: AuditManager.Types.BatchCreateDelegationByAssessmentResponse) => void): Request<AuditManager.Types.BatchCreateDelegationByAssessmentResponse, AWSError>;
  /**
   *  Creates a batch of delegations for an assessment in Audit Manager. 
   */
  batchCreateDelegationByAssessment(callback?: (err: AWSError, data: AuditManager.Types.BatchCreateDelegationByAssessmentResponse) => void): Request<AuditManager.Types.BatchCreateDelegationByAssessmentResponse, AWSError>;
  /**
   *  Deletes a batch of delegations for an assessment in Audit Manager. 
   */
  batchDeleteDelegationByAssessment(params: AuditManager.Types.BatchDeleteDelegationByAssessmentRequest, callback?: (err: AWSError, data: AuditManager.Types.BatchDeleteDelegationByAssessmentResponse) => void): Request<AuditManager.Types.BatchDeleteDelegationByAssessmentResponse, AWSError>;
  /**
   *  Deletes a batch of delegations for an assessment in Audit Manager. 
   */
  batchDeleteDelegationByAssessment(callback?: (err: AWSError, data: AuditManager.Types.BatchDeleteDelegationByAssessmentResponse) => void): Request<AuditManager.Types.BatchDeleteDelegationByAssessmentResponse, AWSError>;
  /**
   *  Disassociates a list of evidence from an assessment report in Audit Manager. 
   */
  batchDisassociateAssessmentReportEvidence(params: AuditManager.Types.BatchDisassociateAssessmentReportEvidenceRequest, callback?: (err: AWSError, data: AuditManager.Types.BatchDisassociateAssessmentReportEvidenceResponse) => void): Request<AuditManager.Types.BatchDisassociateAssessmentReportEvidenceResponse, AWSError>;
  /**
   *  Disassociates a list of evidence from an assessment report in Audit Manager. 
   */
  batchDisassociateAssessmentReportEvidence(callback?: (err: AWSError, data: AuditManager.Types.BatchDisassociateAssessmentReportEvidenceResponse) => void): Request<AuditManager.Types.BatchDisassociateAssessmentReportEvidenceResponse, AWSError>;
  /**
   *  Uploads one or more pieces of evidence to a control in an Audit Manager assessment. 
   */
  batchImportEvidenceToAssessmentControl(params: AuditManager.Types.BatchImportEvidenceToAssessmentControlRequest, callback?: (err: AWSError, data: AuditManager.Types.BatchImportEvidenceToAssessmentControlResponse) => void): Request<AuditManager.Types.BatchImportEvidenceToAssessmentControlResponse, AWSError>;
  /**
   *  Uploads one or more pieces of evidence to a control in an Audit Manager assessment. 
   */
  batchImportEvidenceToAssessmentControl(callback?: (err: AWSError, data: AuditManager.Types.BatchImportEvidenceToAssessmentControlResponse) => void): Request<AuditManager.Types.BatchImportEvidenceToAssessmentControlResponse, AWSError>;
  /**
   *  Creates an assessment in Audit Manager. 
   */
  createAssessment(params: AuditManager.Types.CreateAssessmentRequest, callback?: (err: AWSError, data: AuditManager.Types.CreateAssessmentResponse) => void): Request<AuditManager.Types.CreateAssessmentResponse, AWSError>;
  /**
   *  Creates an assessment in Audit Manager. 
   */
  createAssessment(callback?: (err: AWSError, data: AuditManager.Types.CreateAssessmentResponse) => void): Request<AuditManager.Types.CreateAssessmentResponse, AWSError>;
  /**
   *  Creates a custom framework in Audit Manager. 
   */
  createAssessmentFramework(params: AuditManager.Types.CreateAssessmentFrameworkRequest, callback?: (err: AWSError, data: AuditManager.Types.CreateAssessmentFrameworkResponse) => void): Request<AuditManager.Types.CreateAssessmentFrameworkResponse, AWSError>;
  /**
   *  Creates a custom framework in Audit Manager. 
   */
  createAssessmentFramework(callback?: (err: AWSError, data: AuditManager.Types.CreateAssessmentFrameworkResponse) => void): Request<AuditManager.Types.CreateAssessmentFrameworkResponse, AWSError>;
  /**
   *  Creates an assessment report for the specified assessment. 
   */
  createAssessmentReport(params: AuditManager.Types.CreateAssessmentReportRequest, callback?: (err: AWSError, data: AuditManager.Types.CreateAssessmentReportResponse) => void): Request<AuditManager.Types.CreateAssessmentReportResponse, AWSError>;
  /**
   *  Creates an assessment report for the specified assessment. 
   */
  createAssessmentReport(callback?: (err: AWSError, data: AuditManager.Types.CreateAssessmentReportResponse) => void): Request<AuditManager.Types.CreateAssessmentReportResponse, AWSError>;
  /**
   *  Creates a new custom control in Audit Manager. 
   */
  createControl(params: AuditManager.Types.CreateControlRequest, callback?: (err: AWSError, data: AuditManager.Types.CreateControlResponse) => void): Request<AuditManager.Types.CreateControlResponse, AWSError>;
  /**
   *  Creates a new custom control in Audit Manager. 
   */
  createControl(callback?: (err: AWSError, data: AuditManager.Types.CreateControlResponse) => void): Request<AuditManager.Types.CreateControlResponse, AWSError>;
  /**
   *  Deletes an assessment in Audit Manager. 
   */
  deleteAssessment(params: AuditManager.Types.DeleteAssessmentRequest, callback?: (err: AWSError, data: AuditManager.Types.DeleteAssessmentResponse) => void): Request<AuditManager.Types.DeleteAssessmentResponse, AWSError>;
  /**
   *  Deletes an assessment in Audit Manager. 
   */
  deleteAssessment(callback?: (err: AWSError, data: AuditManager.Types.DeleteAssessmentResponse) => void): Request<AuditManager.Types.DeleteAssessmentResponse, AWSError>;
  /**
   *  Deletes a custom framework in Audit Manager. 
   */
  deleteAssessmentFramework(params: AuditManager.Types.DeleteAssessmentFrameworkRequest, callback?: (err: AWSError, data: AuditManager.Types.DeleteAssessmentFrameworkResponse) => void): Request<AuditManager.Types.DeleteAssessmentFrameworkResponse, AWSError>;
  /**
   *  Deletes a custom framework in Audit Manager. 
   */
  deleteAssessmentFramework(callback?: (err: AWSError, data: AuditManager.Types.DeleteAssessmentFrameworkResponse) => void): Request<AuditManager.Types.DeleteAssessmentFrameworkResponse, AWSError>;
  /**
   *  Deletes a share request for a custom framework in Audit Manager. 
   */
  deleteAssessmentFrameworkShare(params: AuditManager.Types.DeleteAssessmentFrameworkShareRequest, callback?: (err: AWSError, data: AuditManager.Types.DeleteAssessmentFrameworkShareResponse) => void): Request<AuditManager.Types.DeleteAssessmentFrameworkShareResponse, AWSError>;
  /**
   *  Deletes a share request for a custom framework in Audit Manager. 
   */
  deleteAssessmentFrameworkShare(callback?: (err: AWSError, data: AuditManager.Types.DeleteAssessmentFrameworkShareResponse) => void): Request<AuditManager.Types.DeleteAssessmentFrameworkShareResponse, AWSError>;
  /**
   *  Deletes an assessment report from an assessment in Audit Manager. 
   */
  deleteAssessmentReport(params: AuditManager.Types.DeleteAssessmentReportRequest, callback?: (err: AWSError, data: AuditManager.Types.DeleteAssessmentReportResponse) => void): Request<AuditManager.Types.DeleteAssessmentReportResponse, AWSError>;
  /**
   *  Deletes an assessment report from an assessment in Audit Manager. 
   */
  deleteAssessmentReport(callback?: (err: AWSError, data: AuditManager.Types.DeleteAssessmentReportResponse) => void): Request<AuditManager.Types.DeleteAssessmentReportResponse, AWSError>;
  /**
   *  Deletes a custom control in Audit Manager. 
   */
  deleteControl(params: AuditManager.Types.DeleteControlRequest, callback?: (err: AWSError, data: AuditManager.Types.DeleteControlResponse) => void): Request<AuditManager.Types.DeleteControlResponse, AWSError>;
  /**
   *  Deletes a custom control in Audit Manager. 
   */
  deleteControl(callback?: (err: AWSError, data: AuditManager.Types.DeleteControlResponse) => void): Request<AuditManager.Types.DeleteControlResponse, AWSError>;
  /**
   *  Deregisters an account in Audit Manager. 
   */
  deregisterAccount(params: AuditManager.Types.DeregisterAccountRequest, callback?: (err: AWSError, data: AuditManager.Types.DeregisterAccountResponse) => void): Request<AuditManager.Types.DeregisterAccountResponse, AWSError>;
  /**
   *  Deregisters an account in Audit Manager. 
   */
  deregisterAccount(callback?: (err: AWSError, data: AuditManager.Types.DeregisterAccountResponse) => void): Request<AuditManager.Types.DeregisterAccountResponse, AWSError>;
  /**
   * Removes the specified member Amazon Web Services account as a delegated administrator for Audit Manager.   When you remove a delegated administrator from your Audit Manager settings, you continue to have access to the evidence that you previously collected under that account. This is also the case when you deregister a delegated administrator from Audit Manager. However, Audit Manager will stop collecting and attaching evidence to that delegated administrator account moving forward. 
   */
  deregisterOrganizationAdminAccount(params: AuditManager.Types.DeregisterOrganizationAdminAccountRequest, callback?: (err: AWSError, data: AuditManager.Types.DeregisterOrganizationAdminAccountResponse) => void): Request<AuditManager.Types.DeregisterOrganizationAdminAccountResponse, AWSError>;
  /**
   * Removes the specified member Amazon Web Services account as a delegated administrator for Audit Manager.   When you remove a delegated administrator from your Audit Manager settings, you continue to have access to the evidence that you previously collected under that account. This is also the case when you deregister a delegated administrator from Audit Manager. However, Audit Manager will stop collecting and attaching evidence to that delegated administrator account moving forward. 
   */
  deregisterOrganizationAdminAccount(callback?: (err: AWSError, data: AuditManager.Types.DeregisterOrganizationAdminAccountResponse) => void): Request<AuditManager.Types.DeregisterOrganizationAdminAccountResponse, AWSError>;
  /**
   *  Disassociates an evidence folder from the specified assessment report in Audit Manager. 
   */
  disassociateAssessmentReportEvidenceFolder(params: AuditManager.Types.DisassociateAssessmentReportEvidenceFolderRequest, callback?: (err: AWSError, data: AuditManager.Types.DisassociateAssessmentReportEvidenceFolderResponse) => void): Request<AuditManager.Types.DisassociateAssessmentReportEvidenceFolderResponse, AWSError>;
  /**
   *  Disassociates an evidence folder from the specified assessment report in Audit Manager. 
   */
  disassociateAssessmentReportEvidenceFolder(callback?: (err: AWSError, data: AuditManager.Types.DisassociateAssessmentReportEvidenceFolderResponse) => void): Request<AuditManager.Types.DisassociateAssessmentReportEvidenceFolderResponse, AWSError>;
  /**
   *  Returns the registration status of an account in Audit Manager. 
   */
  getAccountStatus(params: AuditManager.Types.GetAccountStatusRequest, callback?: (err: AWSError, data: AuditManager.Types.GetAccountStatusResponse) => void): Request<AuditManager.Types.GetAccountStatusResponse, AWSError>;
  /**
   *  Returns the registration status of an account in Audit Manager. 
   */
  getAccountStatus(callback?: (err: AWSError, data: AuditManager.Types.GetAccountStatusResponse) => void): Request<AuditManager.Types.GetAccountStatusResponse, AWSError>;
  /**
   *  Returns an assessment from Audit Manager. 
   */
  getAssessment(params: AuditManager.Types.GetAssessmentRequest, callback?: (err: AWSError, data: AuditManager.Types.GetAssessmentResponse) => void): Request<AuditManager.Types.GetAssessmentResponse, AWSError>;
  /**
   *  Returns an assessment from Audit Manager. 
   */
  getAssessment(callback?: (err: AWSError, data: AuditManager.Types.GetAssessmentResponse) => void): Request<AuditManager.Types.GetAssessmentResponse, AWSError>;
  /**
   *  Returns a framework from Audit Manager. 
   */
  getAssessmentFramework(params: AuditManager.Types.GetAssessmentFrameworkRequest, callback?: (err: AWSError, data: AuditManager.Types.GetAssessmentFrameworkResponse) => void): Request<AuditManager.Types.GetAssessmentFrameworkResponse, AWSError>;
  /**
   *  Returns a framework from Audit Manager. 
   */
  getAssessmentFramework(callback?: (err: AWSError, data: AuditManager.Types.GetAssessmentFrameworkResponse) => void): Request<AuditManager.Types.GetAssessmentFrameworkResponse, AWSError>;
  /**
   *  Returns the URL of an assessment report in Audit Manager. 
   */
  getAssessmentReportUrl(params: AuditManager.Types.GetAssessmentReportUrlRequest, callback?: (err: AWSError, data: AuditManager.Types.GetAssessmentReportUrlResponse) => void): Request<AuditManager.Types.GetAssessmentReportUrlResponse, AWSError>;
  /**
   *  Returns the URL of an assessment report in Audit Manager. 
   */
  getAssessmentReportUrl(callback?: (err: AWSError, data: AuditManager.Types.GetAssessmentReportUrlResponse) => void): Request<AuditManager.Types.GetAssessmentReportUrlResponse, AWSError>;
  /**
   *  Returns a list of changelogs from Audit Manager. 
   */
  getChangeLogs(params: AuditManager.Types.GetChangeLogsRequest, callback?: (err: AWSError, data: AuditManager.Types.GetChangeLogsResponse) => void): Request<AuditManager.Types.GetChangeLogsResponse, AWSError>;
  /**
   *  Returns a list of changelogs from Audit Manager. 
   */
  getChangeLogs(callback?: (err: AWSError, data: AuditManager.Types.GetChangeLogsResponse) => void): Request<AuditManager.Types.GetChangeLogsResponse, AWSError>;
  /**
   *  Returns a control from Audit Manager. 
   */
  getControl(params: AuditManager.Types.GetControlRequest, callback?: (err: AWSError, data: AuditManager.Types.GetControlResponse) => void): Request<AuditManager.Types.GetControlResponse, AWSError>;
  /**
   *  Returns a control from Audit Manager. 
   */
  getControl(callback?: (err: AWSError, data: AuditManager.Types.GetControlResponse) => void): Request<AuditManager.Types.GetControlResponse, AWSError>;
  /**
   *  Returns a list of delegations from an audit owner to a delegate. 
   */
  getDelegations(params: AuditManager.Types.GetDelegationsRequest, callback?: (err: AWSError, data: AuditManager.Types.GetDelegationsResponse) => void): Request<AuditManager.Types.GetDelegationsResponse, AWSError>;
  /**
   *  Returns a list of delegations from an audit owner to a delegate. 
   */
  getDelegations(callback?: (err: AWSError, data: AuditManager.Types.GetDelegationsResponse) => void): Request<AuditManager.Types.GetDelegationsResponse, AWSError>;
  /**
   *  Returns evidence from Audit Manager. 
   */
  getEvidence(params: AuditManager.Types.GetEvidenceRequest, callback?: (err: AWSError, data: AuditManager.Types.GetEvidenceResponse) => void): Request<AuditManager.Types.GetEvidenceResponse, AWSError>;
  /**
   *  Returns evidence from Audit Manager. 
   */
  getEvidence(callback?: (err: AWSError, data: AuditManager.Types.GetEvidenceResponse) => void): Request<AuditManager.Types.GetEvidenceResponse, AWSError>;
  /**
   *  Returns all evidence from a specified evidence folder in Audit Manager. 
   */
  getEvidenceByEvidenceFolder(params: AuditManager.Types.GetEvidenceByEvidenceFolderRequest, callback?: (err: AWSError, data: AuditManager.Types.GetEvidenceByEvidenceFolderResponse) => void): Request<AuditManager.Types.GetEvidenceByEvidenceFolderResponse, AWSError>;
  /**
   *  Returns all evidence from a specified evidence folder in Audit Manager. 
   */
  getEvidenceByEvidenceFolder(callback?: (err: AWSError, data: AuditManager.Types.GetEvidenceByEvidenceFolderResponse) => void): Request<AuditManager.Types.GetEvidenceByEvidenceFolderResponse, AWSError>;
  /**
   *  Returns an evidence folder from the specified assessment in Audit Manager. 
   */
  getEvidenceFolder(params: AuditManager.Types.GetEvidenceFolderRequest, callback?: (err: AWSError, data: AuditManager.Types.GetEvidenceFolderResponse) => void): Request<AuditManager.Types.GetEvidenceFolderResponse, AWSError>;
  /**
   *  Returns an evidence folder from the specified assessment in Audit Manager. 
   */
  getEvidenceFolder(callback?: (err: AWSError, data: AuditManager.Types.GetEvidenceFolderResponse) => void): Request<AuditManager.Types.GetEvidenceFolderResponse, AWSError>;
  /**
   *  Returns the evidence folders from a specified assessment in Audit Manager. 
   */
  getEvidenceFoldersByAssessment(params: AuditManager.Types.GetEvidenceFoldersByAssessmentRequest, callback?: (err: AWSError, data: AuditManager.Types.GetEvidenceFoldersByAssessmentResponse) => void): Request<AuditManager.Types.GetEvidenceFoldersByAssessmentResponse, AWSError>;
  /**
   *  Returns the evidence folders from a specified assessment in Audit Manager. 
   */
  getEvidenceFoldersByAssessment(callback?: (err: AWSError, data: AuditManager.Types.GetEvidenceFoldersByAssessmentResponse) => void): Request<AuditManager.Types.GetEvidenceFoldersByAssessmentResponse, AWSError>;
  /**
   *  Returns a list of evidence folders that are associated with a specified control of an assessment in Audit Manager. 
   */
  getEvidenceFoldersByAssessmentControl(params: AuditManager.Types.GetEvidenceFoldersByAssessmentControlRequest, callback?: (err: AWSError, data: AuditManager.Types.GetEvidenceFoldersByAssessmentControlResponse) => void): Request<AuditManager.Types.GetEvidenceFoldersByAssessmentControlResponse, AWSError>;
  /**
   *  Returns a list of evidence folders that are associated with a specified control of an assessment in Audit Manager. 
   */
  getEvidenceFoldersByAssessmentControl(callback?: (err: AWSError, data: AuditManager.Types.GetEvidenceFoldersByAssessmentControlResponse) => void): Request<AuditManager.Types.GetEvidenceFoldersByAssessmentControlResponse, AWSError>;
  /**
   *  Returns the name of the delegated Amazon Web Services administrator account for the organization. 
   */
  getOrganizationAdminAccount(params: AuditManager.Types.GetOrganizationAdminAccountRequest, callback?: (err: AWSError, data: AuditManager.Types.GetOrganizationAdminAccountResponse) => void): Request<AuditManager.Types.GetOrganizationAdminAccountResponse, AWSError>;
  /**
   *  Returns the name of the delegated Amazon Web Services administrator account for the organization. 
   */
  getOrganizationAdminAccount(callback?: (err: AWSError, data: AuditManager.Types.GetOrganizationAdminAccountResponse) => void): Request<AuditManager.Types.GetOrganizationAdminAccountResponse, AWSError>;
  /**
   *  Returns a list of the in-scope Amazon Web Services services for the specified assessment. 
   */
  getServicesInScope(params: AuditManager.Types.GetServicesInScopeRequest, callback?: (err: AWSError, data: AuditManager.Types.GetServicesInScopeResponse) => void): Request<AuditManager.Types.GetServicesInScopeResponse, AWSError>;
  /**
   *  Returns a list of the in-scope Amazon Web Services services for the specified assessment. 
   */
  getServicesInScope(callback?: (err: AWSError, data: AuditManager.Types.GetServicesInScopeResponse) => void): Request<AuditManager.Types.GetServicesInScopeResponse, AWSError>;
  /**
   *  Returns the settings for the specified Amazon Web Services account. 
   */
  getSettings(params: AuditManager.Types.GetSettingsRequest, callback?: (err: AWSError, data: AuditManager.Types.GetSettingsResponse) => void): Request<AuditManager.Types.GetSettingsResponse, AWSError>;
  /**
   *  Returns the settings for the specified Amazon Web Services account. 
   */
  getSettings(callback?: (err: AWSError, data: AuditManager.Types.GetSettingsResponse) => void): Request<AuditManager.Types.GetSettingsResponse, AWSError>;
  /**
   *  Returns a list of sent or received share requests for custom frameworks in Audit Manager. 
   */
  listAssessmentFrameworkShareRequests(params: AuditManager.Types.ListAssessmentFrameworkShareRequestsRequest, callback?: (err: AWSError, data: AuditManager.Types.ListAssessmentFrameworkShareRequestsResponse) => void): Request<AuditManager.Types.ListAssessmentFrameworkShareRequestsResponse, AWSError>;
  /**
   *  Returns a list of sent or received share requests for custom frameworks in Audit Manager. 
   */
  listAssessmentFrameworkShareRequests(callback?: (err: AWSError, data: AuditManager.Types.ListAssessmentFrameworkShareRequestsResponse) => void): Request<AuditManager.Types.ListAssessmentFrameworkShareRequestsResponse, AWSError>;
  /**
   *  Returns a list of the frameworks that are available in the Audit Manager framework library. 
   */
  listAssessmentFrameworks(params: AuditManager.Types.ListAssessmentFrameworksRequest, callback?: (err: AWSError, data: AuditManager.Types.ListAssessmentFrameworksResponse) => void): Request<AuditManager.Types.ListAssessmentFrameworksResponse, AWSError>;
  /**
   *  Returns a list of the frameworks that are available in the Audit Manager framework library. 
   */
  listAssessmentFrameworks(callback?: (err: AWSError, data: AuditManager.Types.ListAssessmentFrameworksResponse) => void): Request<AuditManager.Types.ListAssessmentFrameworksResponse, AWSError>;
  /**
   *  Returns a list of assessment reports created in Audit Manager. 
   */
  listAssessmentReports(params: AuditManager.Types.ListAssessmentReportsRequest, callback?: (err: AWSError, data: AuditManager.Types.ListAssessmentReportsResponse) => void): Request<AuditManager.Types.ListAssessmentReportsResponse, AWSError>;
  /**
   *  Returns a list of assessment reports created in Audit Manager. 
   */
  listAssessmentReports(callback?: (err: AWSError, data: AuditManager.Types.ListAssessmentReportsResponse) => void): Request<AuditManager.Types.ListAssessmentReportsResponse, AWSError>;
  /**
   *  Returns a list of current and past assessments from Audit Manager. 
   */
  listAssessments(params: AuditManager.Types.ListAssessmentsRequest, callback?: (err: AWSError, data: AuditManager.Types.ListAssessmentsResponse) => void): Request<AuditManager.Types.ListAssessmentsResponse, AWSError>;
  /**
   *  Returns a list of current and past assessments from Audit Manager. 
   */
  listAssessments(callback?: (err: AWSError, data: AuditManager.Types.ListAssessmentsResponse) => void): Request<AuditManager.Types.ListAssessmentsResponse, AWSError>;
  /**
   *  Returns a list of controls from Audit Manager. 
   */
  listControls(params: AuditManager.Types.ListControlsRequest, callback?: (err: AWSError, data: AuditManager.Types.ListControlsResponse) => void): Request<AuditManager.Types.ListControlsResponse, AWSError>;
  /**
   *  Returns a list of controls from Audit Manager. 
   */
  listControls(callback?: (err: AWSError, data: AuditManager.Types.ListControlsResponse) => void): Request<AuditManager.Types.ListControlsResponse, AWSError>;
  /**
   *  Returns a list of keywords that are pre-mapped to the specified control data source. 
   */
  listKeywordsForDataSource(params: AuditManager.Types.ListKeywordsForDataSourceRequest, callback?: (err: AWSError, data: AuditManager.Types.ListKeywordsForDataSourceResponse) => void): Request<AuditManager.Types.ListKeywordsForDataSourceResponse, AWSError>;
  /**
   *  Returns a list of keywords that are pre-mapped to the specified control data source. 
   */
  listKeywordsForDataSource(callback?: (err: AWSError, data: AuditManager.Types.ListKeywordsForDataSourceResponse) => void): Request<AuditManager.Types.ListKeywordsForDataSourceResponse, AWSError>;
  /**
   *  Returns a list of all Audit Manager notifications. 
   */
  listNotifications(params: AuditManager.Types.ListNotificationsRequest, callback?: (err: AWSError, data: AuditManager.Types.ListNotificationsResponse) => void): Request<AuditManager.Types.ListNotificationsResponse, AWSError>;
  /**
   *  Returns a list of all Audit Manager notifications. 
   */
  listNotifications(callback?: (err: AWSError, data: AuditManager.Types.ListNotificationsResponse) => void): Request<AuditManager.Types.ListNotificationsResponse, AWSError>;
  /**
   *  Returns a list of tags for the specified resource in Audit Manager. 
   */
  listTagsForResource(params: AuditManager.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: AuditManager.Types.ListTagsForResourceResponse) => void): Request<AuditManager.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Returns a list of tags for the specified resource in Audit Manager. 
   */
  listTagsForResource(callback?: (err: AWSError, data: AuditManager.Types.ListTagsForResourceResponse) => void): Request<AuditManager.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Enables Audit Manager for the specified Amazon Web Services account. 
   */
  registerAccount(params: AuditManager.Types.RegisterAccountRequest, callback?: (err: AWSError, data: AuditManager.Types.RegisterAccountResponse) => void): Request<AuditManager.Types.RegisterAccountResponse, AWSError>;
  /**
   *  Enables Audit Manager for the specified Amazon Web Services account. 
   */
  registerAccount(callback?: (err: AWSError, data: AuditManager.Types.RegisterAccountResponse) => void): Request<AuditManager.Types.RegisterAccountResponse, AWSError>;
  /**
   *  Enables an Amazon Web Services account within the organization as the delegated administrator for Audit Manager. 
   */
  registerOrganizationAdminAccount(params: AuditManager.Types.RegisterOrganizationAdminAccountRequest, callback?: (err: AWSError, data: AuditManager.Types.RegisterOrganizationAdminAccountResponse) => void): Request<AuditManager.Types.RegisterOrganizationAdminAccountResponse, AWSError>;
  /**
   *  Enables an Amazon Web Services account within the organization as the delegated administrator for Audit Manager. 
   */
  registerOrganizationAdminAccount(callback?: (err: AWSError, data: AuditManager.Types.RegisterOrganizationAdminAccountResponse) => void): Request<AuditManager.Types.RegisterOrganizationAdminAccountResponse, AWSError>;
  /**
   *  Creates a share request for a custom framework in Audit Manager.  The share request specifies a recipient and notifies them that a custom framework is available. Recipients have 120 days to accept or decline the request. If no action is taken, the share request expires.  When you invoke the StartAssessmentFrameworkShare API, you are about to share a custom framework with another Amazon Web Services account. You may not share a custom framework that is derived from a standard framework if the standard framework is designated as not eligible for sharing by Amazon Web Services, unless you have obtained permission to do so from the owner of the standard framework. To learn more about which standard frameworks are eligible for sharing, see Framework sharing eligibility in the Audit Manager User Guide. 
   */
  startAssessmentFrameworkShare(params: AuditManager.Types.StartAssessmentFrameworkShareRequest, callback?: (err: AWSError, data: AuditManager.Types.StartAssessmentFrameworkShareResponse) => void): Request<AuditManager.Types.StartAssessmentFrameworkShareResponse, AWSError>;
  /**
   *  Creates a share request for a custom framework in Audit Manager.  The share request specifies a recipient and notifies them that a custom framework is available. Recipients have 120 days to accept or decline the request. If no action is taken, the share request expires.  When you invoke the StartAssessmentFrameworkShare API, you are about to share a custom framework with another Amazon Web Services account. You may not share a custom framework that is derived from a standard framework if the standard framework is designated as not eligible for sharing by Amazon Web Services, unless you have obtained permission to do so from the owner of the standard framework. To learn more about which standard frameworks are eligible for sharing, see Framework sharing eligibility in the Audit Manager User Guide. 
   */
  startAssessmentFrameworkShare(callback?: (err: AWSError, data: AuditManager.Types.StartAssessmentFrameworkShareResponse) => void): Request<AuditManager.Types.StartAssessmentFrameworkShareResponse, AWSError>;
  /**
   *  Tags the specified resource in Audit Manager. 
   */
  tagResource(params: AuditManager.Types.TagResourceRequest, callback?: (err: AWSError, data: AuditManager.Types.TagResourceResponse) => void): Request<AuditManager.Types.TagResourceResponse, AWSError>;
  /**
   *  Tags the specified resource in Audit Manager. 
   */
  tagResource(callback?: (err: AWSError, data: AuditManager.Types.TagResourceResponse) => void): Request<AuditManager.Types.TagResourceResponse, AWSError>;
  /**
   *  Removes a tag from a resource in Audit Manager. 
   */
  untagResource(params: AuditManager.Types.UntagResourceRequest, callback?: (err: AWSError, data: AuditManager.Types.UntagResourceResponse) => void): Request<AuditManager.Types.UntagResourceResponse, AWSError>;
  /**
   *  Removes a tag from a resource in Audit Manager. 
   */
  untagResource(callback?: (err: AWSError, data: AuditManager.Types.UntagResourceResponse) => void): Request<AuditManager.Types.UntagResourceResponse, AWSError>;
  /**
   *  Edits an Audit Manager assessment. 
   */
  updateAssessment(params: AuditManager.Types.UpdateAssessmentRequest, callback?: (err: AWSError, data: AuditManager.Types.UpdateAssessmentResponse) => void): Request<AuditManager.Types.UpdateAssessmentResponse, AWSError>;
  /**
   *  Edits an Audit Manager assessment. 
   */
  updateAssessment(callback?: (err: AWSError, data: AuditManager.Types.UpdateAssessmentResponse) => void): Request<AuditManager.Types.UpdateAssessmentResponse, AWSError>;
  /**
   *  Updates a control within an assessment in Audit Manager. 
   */
  updateAssessmentControl(params: AuditManager.Types.UpdateAssessmentControlRequest, callback?: (err: AWSError, data: AuditManager.Types.UpdateAssessmentControlResponse) => void): Request<AuditManager.Types.UpdateAssessmentControlResponse, AWSError>;
  /**
   *  Updates a control within an assessment in Audit Manager. 
   */
  updateAssessmentControl(callback?: (err: AWSError, data: AuditManager.Types.UpdateAssessmentControlResponse) => void): Request<AuditManager.Types.UpdateAssessmentControlResponse, AWSError>;
  /**
   *  Updates the status of a control set in an Audit Manager assessment. 
   */
  updateAssessmentControlSetStatus(params: AuditManager.Types.UpdateAssessmentControlSetStatusRequest, callback?: (err: AWSError, data: AuditManager.Types.UpdateAssessmentControlSetStatusResponse) => void): Request<AuditManager.Types.UpdateAssessmentControlSetStatusResponse, AWSError>;
  /**
   *  Updates the status of a control set in an Audit Manager assessment. 
   */
  updateAssessmentControlSetStatus(callback?: (err: AWSError, data: AuditManager.Types.UpdateAssessmentControlSetStatusResponse) => void): Request<AuditManager.Types.UpdateAssessmentControlSetStatusResponse, AWSError>;
  /**
   *  Updates a custom framework in Audit Manager. 
   */
  updateAssessmentFramework(params: AuditManager.Types.UpdateAssessmentFrameworkRequest, callback?: (err: AWSError, data: AuditManager.Types.UpdateAssessmentFrameworkResponse) => void): Request<AuditManager.Types.UpdateAssessmentFrameworkResponse, AWSError>;
  /**
   *  Updates a custom framework in Audit Manager. 
   */
  updateAssessmentFramework(callback?: (err: AWSError, data: AuditManager.Types.UpdateAssessmentFrameworkResponse) => void): Request<AuditManager.Types.UpdateAssessmentFrameworkResponse, AWSError>;
  /**
   *  Updates a share request for a custom framework in Audit Manager. 
   */
  updateAssessmentFrameworkShare(params: AuditManager.Types.UpdateAssessmentFrameworkShareRequest, callback?: (err: AWSError, data: AuditManager.Types.UpdateAssessmentFrameworkShareResponse) => void): Request<AuditManager.Types.UpdateAssessmentFrameworkShareResponse, AWSError>;
  /**
   *  Updates a share request for a custom framework in Audit Manager. 
   */
  updateAssessmentFrameworkShare(callback?: (err: AWSError, data: AuditManager.Types.UpdateAssessmentFrameworkShareResponse) => void): Request<AuditManager.Types.UpdateAssessmentFrameworkShareResponse, AWSError>;
  /**
   *  Updates the status of an assessment in Audit Manager. 
   */
  updateAssessmentStatus(params: AuditManager.Types.UpdateAssessmentStatusRequest, callback?: (err: AWSError, data: AuditManager.Types.UpdateAssessmentStatusResponse) => void): Request<AuditManager.Types.UpdateAssessmentStatusResponse, AWSError>;
  /**
   *  Updates the status of an assessment in Audit Manager. 
   */
  updateAssessmentStatus(callback?: (err: AWSError, data: AuditManager.Types.UpdateAssessmentStatusResponse) => void): Request<AuditManager.Types.UpdateAssessmentStatusResponse, AWSError>;
  /**
   *  Updates a custom control in Audit Manager. 
   */
  updateControl(params: AuditManager.Types.UpdateControlRequest, callback?: (err: AWSError, data: AuditManager.Types.UpdateControlResponse) => void): Request<AuditManager.Types.UpdateControlResponse, AWSError>;
  /**
   *  Updates a custom control in Audit Manager. 
   */
  updateControl(callback?: (err: AWSError, data: AuditManager.Types.UpdateControlResponse) => void): Request<AuditManager.Types.UpdateControlResponse, AWSError>;
  /**
   *  Updates Audit Manager settings for the current user account. 
   */
  updateSettings(params: AuditManager.Types.UpdateSettingsRequest, callback?: (err: AWSError, data: AuditManager.Types.UpdateSettingsResponse) => void): Request<AuditManager.Types.UpdateSettingsResponse, AWSError>;
  /**
   *  Updates Audit Manager settings for the current user account. 
   */
  updateSettings(callback?: (err: AWSError, data: AuditManager.Types.UpdateSettingsResponse) => void): Request<AuditManager.Types.UpdateSettingsResponse, AWSError>;
  /**
   *  Validates the integrity of an assessment report in Audit Manager. 
   */
  validateAssessmentReportIntegrity(params: AuditManager.Types.ValidateAssessmentReportIntegrityRequest, callback?: (err: AWSError, data: AuditManager.Types.ValidateAssessmentReportIntegrityResponse) => void): Request<AuditManager.Types.ValidateAssessmentReportIntegrityResponse, AWSError>;
  /**
   *  Validates the integrity of an assessment report in Audit Manager. 
   */
  validateAssessmentReportIntegrity(callback?: (err: AWSError, data: AuditManager.Types.ValidateAssessmentReportIntegrityResponse) => void): Request<AuditManager.Types.ValidateAssessmentReportIntegrityResponse, AWSError>;
}
declare namespace AuditManager {
  export interface AWSAccount {
    /**
     *  The identifier for the Amazon Web Services account. 
     */
    id?: AccountId;
    /**
     *  The email address that's associated with the Amazon Web Services account. 
     */
    emailAddress?: EmailAddress;
    /**
     *  The name of the Amazon Web Services account. 
     */
    name?: AccountName;
  }
  export type AWSAccounts = AWSAccount[];
  export interface AWSService {
    /**
     *  The name of the Amazon Web Service. 
     */
    serviceName?: AWSServiceName;
  }
  export type AWSServiceName = string;
  export type AWSServices = AWSService[];
  export type AccountId = string;
  export type AccountName = string;
  export type AccountStatus = "ACTIVE"|"INACTIVE"|"PENDING_ACTIVATION"|string;
  export type ActionEnum = "CREATE"|"UPDATE_METADATA"|"ACTIVE"|"INACTIVE"|"DELETE"|"UNDER_REVIEW"|"REVIEWED"|"IMPORT_EVIDENCE"|string;
  export type ActionPlanInstructions = string;
  export type ActionPlanTitle = string;
  export interface Assessment {
    /**
     *  The Amazon Resource Name (ARN) of the assessment. 
     */
    arn?: AuditManagerArn;
    /**
     *  The Amazon Web Services account that's associated with the assessment. 
     */
    awsAccount?: AWSAccount;
    /**
     *  The metadata for the assessment. 
     */
    metadata?: AssessmentMetadata;
    /**
     *  The framework that the assessment was created from. 
     */
    framework?: AssessmentFramework;
    /**
     *  The tags that are associated with the assessment. 
     */
    tags?: TagMap;
  }
  export interface AssessmentControl {
    /**
     *  The identifier for the control. 
     */
    id?: UUID;
    /**
     *  The name of the control. 
     */
    name?: ControlName;
    /**
     *  The description of the control. 
     */
    description?: ControlDescription;
    /**
     *  The status of the control. 
     */
    status?: ControlStatus;
    /**
     *  The response of the control. 
     */
    response?: ControlResponse;
    /**
     *  The list of comments that's attached to the control. 
     */
    comments?: ControlComments;
    /**
     *  The list of data sources for the evidence. 
     */
    evidenceSources?: EvidenceSources;
    /**
     *  The amount of evidence that's generated for the control. 
     */
    evidenceCount?: Integer;
    /**
     *  The amount of evidence in the assessment report. 
     */
    assessmentReportEvidenceCount?: Integer;
  }
  export interface AssessmentControlSet {
    /**
     *  The identifier of the control set in the assessment. This is the control set name in a plain string format. 
     */
    id?: ControlSetId;
    /**
     *  The description for the control set. 
     */
    description?: NonEmptyString;
    /**
     *  Specifies the current status of the control set. 
     */
    status?: ControlSetStatus;
    /**
     *  The roles that are associated with the control set. 
     */
    roles?: Roles;
    /**
     *  The list of controls that's contained with the control set. 
     */
    controls?: AssessmentControls;
    /**
     *  The delegations that are associated with the control set. 
     */
    delegations?: Delegations;
    /**
     *  The total number of evidence objects that are retrieved automatically for the control set. 
     */
    systemEvidenceCount?: Integer;
    /**
     *  The total number of evidence objects that are uploaded manually to the control set. 
     */
    manualEvidenceCount?: Integer;
  }
  export type AssessmentControlSets = AssessmentControlSet[];
  export type AssessmentControls = AssessmentControl[];
  export type AssessmentDescription = string;
  export interface AssessmentEvidenceFolder {
    /**
     *  The name of the evidence folder. 
     */
    name?: AssessmentEvidenceFolderName;
    /**
     *  The date when the first evidence was added to the evidence folder. 
     */
    date?: Timestamp;
    /**
     *  The identifier for the assessment. 
     */
    assessmentId?: UUID;
    /**
     *  The identifier for the control set. 
     */
    controlSetId?: ControlSetId;
    /**
     *  The unique identifier for the control. 
     */
    controlId?: UUID;
    /**
     *  The identifier for the folder that the evidence is stored in. 
     */
    id?: UUID;
    /**
     *  The Amazon Web Service that the evidence was collected from. 
     */
    dataSource?: String;
    /**
     *  The name of the user who created the evidence folder. 
     */
    author?: String;
    /**
     *  The total amount of evidence in the evidence folder. 
     */
    totalEvidence?: Integer;
    /**
     *  The total count of evidence that's included in the assessment report. 
     */
    assessmentReportSelectionCount?: Integer;
    /**
     *  The name of the control. 
     */
    controlName?: ControlName;
    /**
     *  The amount of evidence that's included in the evidence folder. 
     */
    evidenceResourcesIncludedCount?: Integer;
    /**
     *  The number of evidence that falls under the configuration data category. This evidence is collected from configuration snapshots of other Amazon Web Services services such as Amazon EC2, Amazon S3, or IAM. 
     */
    evidenceByTypeConfigurationDataCount?: Integer;
    /**
     *  The number of evidence that falls under the manual category. This evidence is imported manually. 
     */
    evidenceByTypeManualCount?: Integer;
    /**
     *  The number of evidence that falls under the compliance check category. This evidence is collected from Config or Security Hub. 
     */
    evidenceByTypeComplianceCheckCount?: Integer;
    /**
     *  The total number of issues that were reported directly from Security Hub, Config, or both. 
     */
    evidenceByTypeComplianceCheckIssuesCount?: Integer;
    /**
     *  The number of evidence that falls under the user activity category. This evidence is collected from CloudTrail logs. 
     */
    evidenceByTypeUserActivityCount?: Integer;
    /**
     *  The total number of Amazon Web Services resources that were assessed to generate the evidence. 
     */
    evidenceAwsServiceSourceCount?: Integer;
  }
  export type AssessmentEvidenceFolderName = string;
  export type AssessmentEvidenceFolders = AssessmentEvidenceFolder[];
  export interface AssessmentFramework {
    /**
     *  The unique identifier for the framework. 
     */
    id?: UUID;
    /**
     *  The Amazon Resource Name (ARN) of the framework. 
     */
    arn?: AuditManagerArn;
    metadata?: FrameworkMetadata;
    /**
     *  The control sets that are associated with the framework. 
     */
    controlSets?: AssessmentControlSets;
  }
  export type AssessmentFrameworkDescription = string;
  export interface AssessmentFrameworkMetadata {
    /**
     *  The Amazon Resource Name (ARN) of the framework. 
     */
    arn?: AuditManagerArn;
    /**
     *  The unique identifier for the framework. 
     */
    id?: UUID;
    /**
     *  The framework type, such as a standard framework or a custom framework. 
     */
    type?: FrameworkType;
    /**
     *  The name of the framework. 
     */
    name?: FrameworkName;
    /**
     *  The description of the framework. 
     */
    description?: FrameworkDescription;
    /**
     *  The logo that's associated with the framework. 
     */
    logo?: Filename;
    /**
     *  The compliance type that the new custom framework supports, such as CIS or HIPAA. 
     */
    complianceType?: ComplianceType;
    /**
     *  The number of controls that are associated with the framework. 
     */
    controlsCount?: ControlsCount;
    /**
     *  The number of control sets that are associated with the framework. 
     */
    controlSetsCount?: ControlSetsCount;
    /**
     *  Specifies when the framework was created. 
     */
    createdAt?: Timestamp;
    /**
     *  Specifies when the framework was most recently updated. 
     */
    lastUpdatedAt?: Timestamp;
  }
  export interface AssessmentFrameworkShareRequest {
    /**
     *  The unique identifier for the share request. 
     */
    id?: UUID;
    /**
     * The unique identifier for the shared custom framework. 
     */
    frameworkId?: UUID;
    /**
     *  The name of the custom framework that the share request is for. 
     */
    frameworkName?: FrameworkName;
    /**
     * The description of the shared custom framework.
     */
    frameworkDescription?: FrameworkDescription;
    /**
     *  The status of the share request. 
     */
    status?: ShareRequestStatus;
    /**
     *  The Amazon Web Services account of the sender. 
     */
    sourceAccount?: AccountId;
    /**
     *  The Amazon Web Services account of the recipient. 
     */
    destinationAccount?: AccountId;
    /**
     *  The Amazon Web Services Region of the recipient. 
     */
    destinationRegion?: Region;
    /**
     *  The time when the share request expires. 
     */
    expirationTime?: Timestamp;
    /**
     *  The time when the share request was created. 
     */
    creationTime?: Timestamp;
    /**
     *  Specifies when the share request was last updated. 
     */
    lastUpdated?: Timestamp;
    /**
     *  An optional comment from the sender about the share request. 
     */
    comment?: ShareRequestComment;
    /**
     * The number of standard controls that are part of the shared custom framework. 
     */
    standardControlsCount?: NullableInteger;
    /**
     * The number of custom controls that are part of the shared custom framework.
     */
    customControlsCount?: NullableInteger;
    /**
     * The compliance type that the shared custom framework supports, such as CIS or HIPAA.
     */
    complianceType?: ComplianceType;
  }
  export type AssessmentFrameworkShareRequestList = AssessmentFrameworkShareRequest[];
  export interface AssessmentMetadata {
    /**
     *  The name of the assessment. 
     */
    name?: AssessmentName;
    /**
     *  The unique identifier for the assessment. 
     */
    id?: UUID;
    /**
     *  The description of the assessment. 
     */
    description?: AssessmentDescription;
    /**
     *  The name of the compliance standard that's related to the assessment, such as PCI-DSS. 
     */
    complianceType?: ComplianceType;
    /**
     *  The overall status of the assessment. 
     */
    status?: AssessmentStatus;
    /**
     *  The destination that evidence reports are stored in for the assessment. 
     */
    assessmentReportsDestination?: AssessmentReportsDestination;
    /**
     *  The wrapper of Amazon Web Services accounts and services that are in scope for the assessment. 
     */
    scope?: Scope;
    /**
     *  The roles that are associated with the assessment. 
     */
    roles?: Roles;
    /**
     *  The delegations that are associated with the assessment. 
     */
    delegations?: Delegations;
    /**
     *  Specifies when the assessment was created. 
     */
    creationTime?: Timestamp;
    /**
     *  The time of the most recent update. 
     */
    lastUpdated?: Timestamp;
  }
  export interface AssessmentMetadataItem {
    /**
     *  The name of the assessment. 
     */
    name?: AssessmentName;
    /**
     *  The unique identifier for the assessment. 
     */
    id?: UUID;
    /**
     *  The name of the compliance standard that's related to the assessment, such as PCI-DSS. 
     */
    complianceType?: ComplianceType;
    /**
     *  The current status of the assessment. 
     */
    status?: AssessmentStatus;
    /**
     *  The roles that are associated with the assessment. 
     */
    roles?: Roles;
    /**
     *  The delegations that are associated with the assessment. 
     */
    delegations?: Delegations;
    /**
     *  Specifies when the assessment was created. 
     */
    creationTime?: Timestamp;
    /**
     *  The time of the most recent update. 
     */
    lastUpdated?: Timestamp;
  }
  export type AssessmentName = string;
  export interface AssessmentReport {
    /**
     *  The unique identifier for the assessment report. 
     */
    id?: UUID;
    /**
     *  The name that's given to the assessment report. 
     */
    name?: AssessmentReportName;
    /**
     *  The description of the specified assessment report. 
     */
    description?: AssessmentReportDescription;
    /**
     *  The identifier for the specified Amazon Web Services account. 
     */
    awsAccountId?: AccountId;
    /**
     *  The identifier for the specified assessment. 
     */
    assessmentId?: UUID;
    /**
     *  The name of the associated assessment. 
     */
    assessmentName?: AssessmentName;
    /**
     *  The name of the user who created the assessment report. 
     */
    author?: Username;
    /**
     *  The current status of the specified assessment report. 
     */
    status?: AssessmentReportStatus;
    /**
     *  Specifies when the assessment report was created. 
     */
    creationTime?: Timestamp;
  }
  export type AssessmentReportDescription = string;
  export type AssessmentReportDestinationType = "S3"|string;
  export interface AssessmentReportEvidenceError {
    /**
     *  The identifier for the evidence. 
     */
    evidenceId?: UUID;
    /**
     *  The error code that the AssessmentReportEvidence API returned. 
     */
    errorCode?: ErrorCode;
    /**
     *  The error message that the AssessmentReportEvidence API returned. 
     */
    errorMessage?: ErrorMessage;
  }
  export type AssessmentReportEvidenceErrors = AssessmentReportEvidenceError[];
  export interface AssessmentReportMetadata {
    /**
     *  The unique identifier for the assessment report. 
     */
    id?: UUID;
    /**
     *  The name of the assessment report. 
     */
    name?: AssessmentReportName;
    /**
     *  The description of the assessment report. 
     */
    description?: AssessmentReportDescription;
    /**
     *  The unique identifier for the associated assessment. 
     */
    assessmentId?: UUID;
    /**
     * The name of the associated assessment. 
     */
    assessmentName?: AssessmentName;
    /**
     *  The name of the user who created the assessment report. 
     */
    author?: Username;
    /**
     *  The current status of the assessment report. 
     */
    status?: AssessmentReportStatus;
    /**
     *  Specifies when the assessment report was created. 
     */
    creationTime?: Timestamp;
  }
  export type AssessmentReportName = string;
  export type AssessmentReportStatus = "COMPLETE"|"IN_PROGRESS"|"FAILED"|string;
  export interface AssessmentReportsDestination {
    /**
     *  The destination type, such as Amazon S3. 
     */
    destinationType?: AssessmentReportDestinationType;
    /**
     *  The destination of the assessment report. 
     */
    destination?: S3Url;
  }
  export type AssessmentReportsMetadata = AssessmentReportMetadata[];
  export type AssessmentStatus = "ACTIVE"|"INACTIVE"|string;
  export interface AssociateAssessmentReportEvidenceFolderRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The identifier for the folder that the evidence is stored in. 
     */
    evidenceFolderId: UUID;
  }
  export interface AssociateAssessmentReportEvidenceFolderResponse {
  }
  export type AuditManagerArn = string;
  export interface BatchAssociateAssessmentReportEvidenceRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The identifier for the folder that the evidence is stored in. 
     */
    evidenceFolderId: UUID;
    /**
     *  The list of evidence identifiers. 
     */
    evidenceIds: EvidenceIds;
  }
  export interface BatchAssociateAssessmentReportEvidenceResponse {
    /**
     *  The list of evidence identifiers. 
     */
    evidenceIds?: EvidenceIds;
    /**
     *  A list of errors that the BatchAssociateAssessmentReportEvidence API returned. 
     */
    errors?: AssessmentReportEvidenceErrors;
  }
  export interface BatchCreateDelegationByAssessmentError {
    /**
     *  The API request to batch create delegations in Audit Manager. 
     */
    createDelegationRequest?: CreateDelegationRequest;
    /**
     *  The error code that the BatchCreateDelegationByAssessment API returned. 
     */
    errorCode?: ErrorCode;
    /**
     *  The error message that the BatchCreateDelegationByAssessment API returned. 
     */
    errorMessage?: ErrorMessage;
  }
  export type BatchCreateDelegationByAssessmentErrors = BatchCreateDelegationByAssessmentError[];
  export interface BatchCreateDelegationByAssessmentRequest {
    /**
     *  The API request to batch create delegations in Audit Manager. 
     */
    createDelegationRequests: CreateDelegationRequests;
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
  }
  export interface BatchCreateDelegationByAssessmentResponse {
    /**
     *  The delegations that are associated with the assessment. 
     */
    delegations?: Delegations;
    /**
     *  A list of errors that the BatchCreateDelegationByAssessment API returned. 
     */
    errors?: BatchCreateDelegationByAssessmentErrors;
  }
  export interface BatchDeleteDelegationByAssessmentError {
    /**
     *  The identifier for the delegation. 
     */
    delegationId?: UUID;
    /**
     *  The error code that the BatchDeleteDelegationByAssessment API returned. 
     */
    errorCode?: ErrorCode;
    /**
     *  The error message that the BatchDeleteDelegationByAssessment API returned. 
     */
    errorMessage?: ErrorMessage;
  }
  export type BatchDeleteDelegationByAssessmentErrors = BatchDeleteDelegationByAssessmentError[];
  export interface BatchDeleteDelegationByAssessmentRequest {
    /**
     *  The identifiers for the delegations. 
     */
    delegationIds: DelegationIds;
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
  }
  export interface BatchDeleteDelegationByAssessmentResponse {
    /**
     *  A list of errors that the BatchDeleteDelegationByAssessment API returned. 
     */
    errors?: BatchDeleteDelegationByAssessmentErrors;
  }
  export interface BatchDisassociateAssessmentReportEvidenceRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The identifier for the folder that the evidence is stored in. 
     */
    evidenceFolderId: UUID;
    /**
     *  The list of evidence identifiers. 
     */
    evidenceIds: EvidenceIds;
  }
  export interface BatchDisassociateAssessmentReportEvidenceResponse {
    /**
     *  The identifier for the evidence. 
     */
    evidenceIds?: EvidenceIds;
    /**
     *  A list of errors that the BatchDisassociateAssessmentReportEvidence API returned. 
     */
    errors?: AssessmentReportEvidenceErrors;
  }
  export interface BatchImportEvidenceToAssessmentControlError {
    /**
     *  Manual evidence that can't be collected automatically by Audit Manager. 
     */
    manualEvidence?: ManualEvidence;
    /**
     *  The error code that the BatchImportEvidenceToAssessmentControl API returned. 
     */
    errorCode?: ErrorCode;
    /**
     *  The error message that the BatchImportEvidenceToAssessmentControl API returned. 
     */
    errorMessage?: ErrorMessage;
  }
  export type BatchImportEvidenceToAssessmentControlErrors = BatchImportEvidenceToAssessmentControlError[];
  export interface BatchImportEvidenceToAssessmentControlRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The identifier for the control set. 
     */
    controlSetId: ControlSetId;
    /**
     *  The identifier for the control. 
     */
    controlId: UUID;
    /**
     *  The list of manual evidence objects. 
     */
    manualEvidence: ManualEvidenceList;
  }
  export interface BatchImportEvidenceToAssessmentControlResponse {
    /**
     *  A list of errors that the BatchImportEvidenceToAssessmentControl API returned. 
     */
    errors?: BatchImportEvidenceToAssessmentControlErrors;
  }
  export type Boolean = boolean;
  export interface ChangeLog {
    /**
     *  The object that was changed, such as an assessment, control, or control set. 
     */
    objectType?: ObjectTypeEnum;
    /**
     *  The name of the object that changed. This could be the name of an assessment, control, or control set.
     */
    objectName?: NonEmptyString;
    /**
     *  The action that was performed. 
     */
    action?: ActionEnum;
    /**
     *  The time when the action was performed and the changelog record was created. 
     */
    createdAt?: Timestamp;
    /**
     *  The IAM user or role that performed the action. 
     */
    createdBy?: IamArn;
  }
  export type ChangeLogs = ChangeLog[];
  export type ComplianceType = string;
  export interface Control {
    /**
     *  The Amazon Resource Name (ARN) of the control. 
     */
    arn?: AuditManagerArn;
    /**
     *  The unique identifier for the control. 
     */
    id?: UUID;
    /**
     *  The type of control, such as a custom control or a standard control. 
     */
    type?: ControlType;
    /**
     *  The name of the control. 
     */
    name?: ControlName;
    /**
     *  The description of the control. 
     */
    description?: ControlDescription;
    /**
     *  The steps that you should follow to determine if the control has been satisfied. 
     */
    testingInformation?: TestingInformation;
    /**
     *  The title of the action plan for remediating the control. 
     */
    actionPlanTitle?: ActionPlanTitle;
    /**
     *  The recommended actions to carry out if the control isn't fulfilled. 
     */
    actionPlanInstructions?: ActionPlanInstructions;
    /**
     *  The data source that determines where Audit Manager collects evidence from for the control. 
     */
    controlSources?: ControlSources;
    /**
     *  The data mapping sources for the control. 
     */
    controlMappingSources?: ControlMappingSources;
    /**
     *  Specifies when the control was created. 
     */
    createdAt?: Timestamp;
    /**
     *  Specifies when the control was most recently updated. 
     */
    lastUpdatedAt?: Timestamp;
    /**
     *  The IAM user or role that created the control. 
     */
    createdBy?: CreatedBy;
    /**
     *  The IAM user or role that most recently updated the control. 
     */
    lastUpdatedBy?: LastUpdatedBy;
    /**
     *  The tags associated with the control. 
     */
    tags?: TagMap;
  }
  export interface ControlComment {
    /**
     *  The name of the user who authored the comment. 
     */
    authorName?: Username;
    /**
     *  The body text of a control comment. 
     */
    commentBody?: ControlCommentBody;
    /**
     *  The time when the comment was posted. 
     */
    postedDate?: Timestamp;
  }
  export type ControlCommentBody = string;
  export type ControlComments = ControlComment[];
  export type ControlDescription = string;
  export interface ControlMappingSource {
    /**
     *  The unique identifier for the source. 
     */
    sourceId?: UUID;
    /**
     *  The name of the source. 
     */
    sourceName?: SourceName;
    /**
     *  The description of the source. 
     */
    sourceDescription?: SourceDescription;
    /**
     *  The setup option for the data source. This option reflects if the evidence collection is automated or manual. 
     */
    sourceSetUpOption?: SourceSetUpOption;
    /**
     *  Specifies one of the five types of data sources for evidence collection. 
     */
    sourceType?: SourceType;
    sourceKeyword?: SourceKeyword;
    /**
     *  The frequency of evidence collection for the control mapping source. 
     */
    sourceFrequency?: SourceFrequency;
    /**
     *  The instructions for troubleshooting the control. 
     */
    troubleshootingText?: TroubleshootingText;
  }
  export type ControlMappingSources = ControlMappingSource[];
  export interface ControlMetadata {
    /**
     *  The Amazon Resource Name (ARN) of the control. 
     */
    arn?: AuditManagerArn;
    /**
     *  The unique identifier for the control. 
     */
    id?: UUID;
    /**
     *  The name of the control. 
     */
    name?: ControlName;
    /**
     *  The data source that determines where Audit Manager collects evidence from for the control. 
     */
    controlSources?: ControlSources;
    /**
     *  Specifies when the control was created. 
     */
    createdAt?: Timestamp;
    /**
     *  Specifies when the control was most recently updated. 
     */
    lastUpdatedAt?: Timestamp;
  }
  export type ControlMetadataList = ControlMetadata[];
  export type ControlName = string;
  export type ControlResponse = "MANUAL"|"AUTOMATE"|"DEFER"|"IGNORE"|string;
  export interface ControlSet {
    /**
     *  The identifier of the control set in the assessment. This is the control set name in a plain string format. 
     */
    id?: UUID;
    /**
     *  The name of the control set. 
     */
    name?: ControlSetName;
    /**
     *  The list of controls within the control set. 
     */
    controls?: Controls;
  }
  export type ControlSetId = string;
  export type ControlSetName = string;
  export type ControlSetStatus = "ACTIVE"|"UNDER_REVIEW"|"REVIEWED"|string;
  export type ControlSets = ControlSet[];
  export type ControlSetsCount = number;
  export type ControlSources = string;
  export type ControlStatus = "UNDER_REVIEW"|"REVIEWED"|"INACTIVE"|string;
  export type ControlType = "Standard"|"Custom"|string;
  export type Controls = Control[];
  export type ControlsCount = number;
  export interface CreateAssessmentFrameworkControl {
    /**
     *  The unique identifier of the control. 
     */
    id?: UUID;
  }
  export interface CreateAssessmentFrameworkControlSet {
    /**
     *  The name of the control set. 
     */
    name: ControlSetName;
    /**
     *  The list of controls within the control set. This doesn't contain the control set ID. 
     */
    controls?: CreateAssessmentFrameworkControls;
  }
  export type CreateAssessmentFrameworkControlSets = CreateAssessmentFrameworkControlSet[];
  export type CreateAssessmentFrameworkControls = CreateAssessmentFrameworkControl[];
  export interface CreateAssessmentFrameworkRequest {
    /**
     *  The name of the new custom framework. 
     */
    name: FrameworkName;
    /**
     *  An optional description for the new custom framework. 
     */
    description?: FrameworkDescription;
    /**
     *  The compliance type that the new custom framework supports, such as CIS or HIPAA. 
     */
    complianceType?: ComplianceType;
    /**
     *  The control sets that are associated with the framework. 
     */
    controlSets: CreateAssessmentFrameworkControlSets;
    /**
     *  The tags that are associated with the framework. 
     */
    tags?: TagMap;
  }
  export interface CreateAssessmentFrameworkResponse {
    /**
     *  The name of the new framework that the CreateAssessmentFramework API returned. 
     */
    framework?: Framework;
  }
  export interface CreateAssessmentReportRequest {
    /**
     *  The name of the new assessment report. 
     */
    name: AssessmentReportName;
    /**
     *  The description of the assessment report. 
     */
    description?: AssessmentReportDescription;
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
  }
  export interface CreateAssessmentReportResponse {
    /**
     *  The new assessment report that the CreateAssessmentReport API returned. 
     */
    assessmentReport?: AssessmentReport;
  }
  export interface CreateAssessmentRequest {
    /**
     *  The name of the assessment to be created. 
     */
    name: AssessmentName;
    /**
     *  The optional description of the assessment to be created. 
     */
    description?: AssessmentDescription;
    /**
     *  The assessment report storage destination for the assessment that's being created. 
     */
    assessmentReportsDestination: AssessmentReportsDestination;
    scope: Scope;
    /**
     *  The list of roles for the assessment. 
     */
    roles: Roles;
    /**
     *  The identifier for the framework that the assessment will be created from. 
     */
    frameworkId: UUID;
    /**
     *  The tags that are associated with the assessment. 
     */
    tags?: TagMap;
  }
  export interface CreateAssessmentResponse {
    assessment?: Assessment;
  }
  export interface CreateControlMappingSource {
    /**
     *  The name of the control mapping data source. 
     */
    sourceName?: SourceName;
    /**
     *  The description of the data source that determines where Audit Manager collects evidence from for the control. 
     */
    sourceDescription?: SourceDescription;
    /**
     *  The setup option for the data source, which reflects if the evidence collection is automated or manual. 
     */
    sourceSetUpOption?: SourceSetUpOption;
    /**
     *  Specifies one of the five types of data sources for evidence collection. 
     */
    sourceType?: SourceType;
    sourceKeyword?: SourceKeyword;
    /**
     *  The frequency of evidence collection for the control mapping source. 
     */
    sourceFrequency?: SourceFrequency;
    /**
     *  The instructions for troubleshooting the control. 
     */
    troubleshootingText?: TroubleshootingText;
  }
  export type CreateControlMappingSources = CreateControlMappingSource[];
  export interface CreateControlRequest {
    /**
     *  The name of the control. 
     */
    name: ControlName;
    /**
     *  The description of the control. 
     */
    description?: ControlDescription;
    /**
     *  The steps to follow to determine if the control is satisfied. 
     */
    testingInformation?: TestingInformation;
    /**
     *  The title of the action plan for remediating the control. 
     */
    actionPlanTitle?: ActionPlanTitle;
    /**
     *  The recommended actions to carry out if the control isn't fulfilled. 
     */
    actionPlanInstructions?: ActionPlanInstructions;
    /**
     *  The data mapping sources for the control. 
     */
    controlMappingSources: CreateControlMappingSources;
    /**
     *  The tags that are associated with the control. 
     */
    tags?: TagMap;
  }
  export interface CreateControlResponse {
    /**
     *  The new control that the CreateControl API returned. 
     */
    control?: Control;
  }
  export interface CreateDelegationRequest {
    /**
     *  A comment that's related to the delegation request. 
     */
    comment?: DelegationComment;
    /**
     *  The unique identifier for the control set. 
     */
    controlSetId?: ControlSetId;
    /**
     *  The Amazon Resource Name (ARN) of the IAM role. 
     */
    roleArn?: IamArn;
    /**
     *  The type of customer persona.   In CreateAssessment, roleType can only be PROCESS_OWNER.  In UpdateSettings, roleType can only be PROCESS_OWNER. In BatchCreateDelegationByAssessment, roleType can only be RESOURCE_OWNER. 
     */
    roleType?: RoleType;
  }
  export type CreateDelegationRequests = CreateDelegationRequest[];
  export type CreatedBy = string;
  export interface Delegation {
    /**
     *  The unique identifier for the delegation. 
     */
    id?: UUID;
    /**
     *  The name of the assessment that's associated with the delegation. 
     */
    assessmentName?: AssessmentName;
    /**
     *  The identifier for the assessment that's associated with the delegation. 
     */
    assessmentId?: UUID;
    /**
     *  The status of the delegation. 
     */
    status?: DelegationStatus;
    /**
     *  The Amazon Resource Name (ARN) of the IAM role. 
     */
    roleArn?: IamArn;
    /**
     *  The type of customer persona.   In CreateAssessment, roleType can only be PROCESS_OWNER.  In UpdateSettings, roleType can only be PROCESS_OWNER. In BatchCreateDelegationByAssessment, roleType can only be RESOURCE_OWNER. 
     */
    roleType?: RoleType;
    /**
     *  Specifies when the delegation was created. 
     */
    creationTime?: Timestamp;
    /**
     *  Specifies when the delegation was last updated. 
     */
    lastUpdated?: Timestamp;
    /**
     *  The identifier for the control set that's associated with the delegation. 
     */
    controlSetId?: ControlSetId;
    /**
     *  The comment that's related to the delegation. 
     */
    comment?: DelegationComment;
    /**
     *  The IAM user or role that created the delegation. 
     */
    createdBy?: CreatedBy;
  }
  export type DelegationComment = string;
  export type DelegationIds = UUID[];
  export interface DelegationMetadata {
    /**
     *  The unique identifier for the delegation. 
     */
    id?: UUID;
    /**
     *  The name of the associated assessment. 
     */
    assessmentName?: AssessmentName;
    /**
     *  The unique identifier for the assessment. 
     */
    assessmentId?: UUID;
    /**
     *  The current status of the delegation. 
     */
    status?: DelegationStatus;
    /**
     *  The Amazon Resource Name (ARN) of the IAM role. 
     */
    roleArn?: IamArn;
    /**
     *  Specifies when the delegation was created. 
     */
    creationTime?: Timestamp;
    /**
     *  Specifies the name of the control set that was delegated for review. 
     */
    controlSetName?: NonEmptyString;
  }
  export type DelegationMetadataList = DelegationMetadata[];
  export type DelegationStatus = "IN_PROGRESS"|"UNDER_REVIEW"|"COMPLETE"|string;
  export type Delegations = Delegation[];
  export interface DeleteAssessmentFrameworkRequest {
    /**
     *  The identifier for the framework. 
     */
    frameworkId: UUID;
  }
  export interface DeleteAssessmentFrameworkResponse {
  }
  export interface DeleteAssessmentFrameworkShareRequest {
    /**
     * The unique identifier for the share request to be deleted.
     */
    requestId: UUID;
    /**
     * Specifies whether the share request is a sent request or a received request.
     */
    requestType: ShareRequestType;
  }
  export interface DeleteAssessmentFrameworkShareResponse {
  }
  export interface DeleteAssessmentReportRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The unique identifier for the assessment report. 
     */
    assessmentReportId: UUID;
  }
  export interface DeleteAssessmentReportResponse {
  }
  export interface DeleteAssessmentRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
  }
  export interface DeleteAssessmentResponse {
  }
  export interface DeleteControlRequest {
    /**
     *  The identifier for the control. 
     */
    controlId: UUID;
  }
  export interface DeleteControlResponse {
  }
  export interface DeregisterAccountRequest {
  }
  export interface DeregisterAccountResponse {
    /**
     *  The registration status of the account. 
     */
    status?: AccountStatus;
  }
  export interface DeregisterOrganizationAdminAccountRequest {
    /**
     *  The identifier for the administrator account. 
     */
    adminAccountId?: AccountId;
  }
  export interface DeregisterOrganizationAdminAccountResponse {
  }
  export interface DisassociateAssessmentReportEvidenceFolderRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The identifier for the folder in which evidence is stored. 
     */
    evidenceFolderId: UUID;
  }
  export interface DisassociateAssessmentReportEvidenceFolderResponse {
  }
  export type EmailAddress = string;
  export type ErrorCode = string;
  export type ErrorMessage = string;
  export type EventName = string;
  export interface Evidence {
    /**
     *  The data source where the evidence was collected from. 
     */
    dataSource?: String;
    /**
     *  The identifier for the Amazon Web Services account. 
     */
    evidenceAwsAccountId?: AccountId;
    /**
     *  The timestamp that represents when the evidence was collected. 
     */
    time?: Timestamp;
    /**
     *  The Amazon Web Service that the evidence is collected from. 
     */
    eventSource?: AWSServiceName;
    /**
     *  The name of the evidence event. 
     */
    eventName?: EventName;
    /**
     *  The type of automated evidence. 
     */
    evidenceByType?: String;
    /**
     *  The list of resources that are assessed to generate the evidence. 
     */
    resourcesIncluded?: Resources;
    /**
     *  The names and values that are used by the evidence event. This includes an attribute name (such as allowUsersToChangePassword) and value (such as true or false). 
     */
    attributes?: EvidenceAttributes;
    /**
     *  The unique identifier for the IAM user or role that's associated with the evidence. 
     */
    iamId?: IamArn;
    /**
     *  The evaluation status for evidence that falls under the compliance check category. For evidence collected from Security Hub, a Pass or Fail result is shown. For evidence collected from Config, a Compliant or Noncompliant result is shown. 
     */
    complianceCheck?: String;
    /**
     *  The Amazon Web Services account that the evidence is collected from, and its organization path. 
     */
    awsOrganization?: String;
    /**
     *  The identifier for the Amazon Web Services account. 
     */
    awsAccountId?: AccountId;
    /**
     *  The identifier for the folder that the evidence is stored in. 
     */
    evidenceFolderId?: UUID;
    /**
     *  The identifier for the evidence. 
     */
    id?: UUID;
    /**
     *  Specifies whether the evidence is included in the assessment report. 
     */
    assessmentReportSelection?: String;
  }
  export type EvidenceAttributeKey = string;
  export type EvidenceAttributeValue = string;
  export type EvidenceAttributes = {[key: string]: EvidenceAttributeValue};
  export type EvidenceIds = UUID[];
  export type EvidenceList = Evidence[];
  export type EvidenceSources = NonEmptyString[];
  export type Filename = string;
  export interface Framework {
    /**
     *  The Amazon Resource Name (ARN) of the framework. 
     */
    arn?: AuditManagerArn;
    /**
     *  The unique identifier for the framework. 
     */
    id?: UUID;
    /**
     *  The name of the framework. 
     */
    name?: FrameworkName;
    /**
     *  The framework type, such as a custom framework or a standard framework. 
     */
    type?: FrameworkType;
    /**
     *  The compliance type that the new custom framework supports, such as CIS or HIPAA. 
     */
    complianceType?: ComplianceType;
    /**
     *  The description of the framework. 
     */
    description?: FrameworkDescription;
    /**
     *  The logo that's associated with the framework. 
     */
    logo?: Filename;
    /**
     *  The sources that Audit Manager collects evidence from for the control. 
     */
    controlSources?: ControlSources;
    /**
     *  The control sets that are associated with the framework. 
     */
    controlSets?: ControlSets;
    /**
     *  Specifies when the framework was created. 
     */
    createdAt?: Timestamp;
    /**
     *  Specifies when the framework was most recently updated. 
     */
    lastUpdatedAt?: Timestamp;
    /**
     *  The IAM user or role that created the framework. 
     */
    createdBy?: CreatedBy;
    /**
     *  The IAM user or role that most recently updated the framework. 
     */
    lastUpdatedBy?: LastUpdatedBy;
    /**
     *  The tags that are associated with the framework. 
     */
    tags?: TagMap;
  }
  export type FrameworkDescription = string;
  export interface FrameworkMetadata {
    /**
     *  The name of the framework. 
     */
    name?: AssessmentName;
    /**
     *  The description of the framework. 
     */
    description?: AssessmentFrameworkDescription;
    /**
     *  The logo that's associated with the framework. 
     */
    logo?: Filename;
    /**
     *  The compliance standard that's associated with the framework. For example, this could be PCI DSS or HIPAA. 
     */
    complianceType?: ComplianceType;
  }
  export type FrameworkMetadataList = AssessmentFrameworkMetadata[];
  export type FrameworkName = string;
  export type FrameworkType = "Standard"|"Custom"|string;
  export type GenericArn = string;
  export interface GetAccountStatusRequest {
  }
  export interface GetAccountStatusResponse {
    /**
     *  The status of the Amazon Web Services account. 
     */
    status?: AccountStatus;
  }
  export interface GetAssessmentFrameworkRequest {
    /**
     *  The identifier for the framework. 
     */
    frameworkId: UUID;
  }
  export interface GetAssessmentFrameworkResponse {
    /**
     *  The framework that the GetAssessmentFramework API returned. 
     */
    framework?: Framework;
  }
  export interface GetAssessmentReportUrlRequest {
    /**
     *  The identifier for the assessment report. 
     */
    assessmentReportId: UUID;
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
  }
  export interface GetAssessmentReportUrlResponse {
    preSignedUrl?: URL;
  }
  export interface GetAssessmentRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
  }
  export interface GetAssessmentResponse {
    assessment?: Assessment;
    userRole?: Role;
  }
  export interface GetChangeLogsRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The identifier for the control set. 
     */
    controlSetId?: ControlSetId;
    /**
     *  The identifier for the control. 
     */
    controlId?: UUID;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
    /**
     *  Represents the maximum number of results on a page or for an API request call. 
     */
    maxResults?: MaxResults;
  }
  export interface GetChangeLogsResponse {
    /**
     *  The list of user activity for the control. 
     */
    changeLogs?: ChangeLogs;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
  }
  export interface GetControlRequest {
    /**
     *  The identifier for the control. 
     */
    controlId: UUID;
  }
  export interface GetControlResponse {
    /**
     *  The name of the control that the GetControl API returned. 
     */
    control?: Control;
  }
  export interface GetDelegationsRequest {
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
    /**
     *  Represents the maximum number of results on a page or for an API request call. 
     */
    maxResults?: MaxResults;
  }
  export interface GetDelegationsResponse {
    /**
     *  The list of delegations that the GetDelegations API returned. 
     */
    delegations?: DelegationMetadataList;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
  }
  export interface GetEvidenceByEvidenceFolderRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The identifier for the control set. 
     */
    controlSetId: ControlSetId;
    /**
     *  The unique identifier for the folder that the evidence is stored in. 
     */
    evidenceFolderId: UUID;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
    /**
     *  Represents the maximum number of results on a page or for an API request call. 
     */
    maxResults?: MaxResults;
  }
  export interface GetEvidenceByEvidenceFolderResponse {
    /**
     *  The list of evidence that the GetEvidenceByEvidenceFolder API returned. 
     */
    evidence?: EvidenceList;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
  }
  export interface GetEvidenceFolderRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The identifier for the control set. 
     */
    controlSetId: ControlSetId;
    /**
     *  The identifier for the folder that the evidence is stored in. 
     */
    evidenceFolderId: UUID;
  }
  export interface GetEvidenceFolderResponse {
    /**
     *  The folder that the evidence is stored in. 
     */
    evidenceFolder?: AssessmentEvidenceFolder;
  }
  export interface GetEvidenceFoldersByAssessmentControlRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The identifier for the control set. 
     */
    controlSetId: ControlSetId;
    /**
     *  The identifier for the control. 
     */
    controlId: UUID;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
    /**
     *  Represents the maximum number of results on a page or for an API request call. 
     */
    maxResults?: MaxResults;
  }
  export interface GetEvidenceFoldersByAssessmentControlResponse {
    /**
     *  The list of evidence folders that the GetEvidenceFoldersByAssessmentControl API returned. 
     */
    evidenceFolders?: AssessmentEvidenceFolders;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
  }
  export interface GetEvidenceFoldersByAssessmentRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
    /**
     *  Represents the maximum number of results on a page or for an API request call. 
     */
    maxResults?: MaxResults;
  }
  export interface GetEvidenceFoldersByAssessmentResponse {
    /**
     *  The list of evidence folders that the GetEvidenceFoldersByAssessment API returned. 
     */
    evidenceFolders?: AssessmentEvidenceFolders;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
  }
  export interface GetEvidenceRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The identifier for the control set. 
     */
    controlSetId: ControlSetId;
    /**
     *  The identifier for the folder that the evidence is stored in. 
     */
    evidenceFolderId: UUID;
    /**
     *  The identifier for the evidence. 
     */
    evidenceId: UUID;
  }
  export interface GetEvidenceResponse {
    /**
     *  The evidence that the GetEvidenceResponse API returned. 
     */
    evidence?: Evidence;
  }
  export interface GetOrganizationAdminAccountRequest {
  }
  export interface GetOrganizationAdminAccountResponse {
    /**
     *  The identifier for the administrator account. 
     */
    adminAccountId?: AccountId;
    /**
     *  The identifier for the organization. 
     */
    organizationId?: organizationId;
  }
  export interface GetServicesInScopeRequest {
  }
  export interface GetServicesInScopeResponse {
    /**
     *  The metadata that's associated with the Amazon Web Service. 
     */
    serviceMetadata?: ServiceMetadataList;
  }
  export interface GetSettingsRequest {
    /**
     *  The list of SettingAttribute enum values. 
     */
    attribute: SettingAttribute;
  }
  export interface GetSettingsResponse {
    /**
     *  The settings object that holds all supported Audit Manager settings. 
     */
    settings?: Settings;
  }
  export type HyperlinkName = string;
  export type IamArn = string;
  export type Integer = number;
  export type KeywordInputType = "SELECT_FROM_LIST"|string;
  export type KeywordValue = string;
  export type Keywords = KeywordValue[];
  export type KmsKey = string;
  export type LastUpdatedBy = string;
  export interface ListAssessmentFrameworkShareRequestsRequest {
    /**
     *  Specifies whether the share request is a sent request or a received request.
     */
    requestType: ShareRequestType;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
    /**
     *  Represents the maximum number of results on a page or for an API request call. 
     */
    maxResults?: MaxResults;
  }
  export interface ListAssessmentFrameworkShareRequestsResponse {
    /**
     *  The list of share requests that the ListAssessmentFrameworkShareRequests API returned. 
     */
    assessmentFrameworkShareRequests?: AssessmentFrameworkShareRequestList;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
  }
  export interface ListAssessmentFrameworksRequest {
    /**
     *  The type of framework, such as a standard framework or a custom framework. 
     */
    frameworkType: FrameworkType;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
    /**
     *  Represents the maximum number of results on a page or for an API request call. 
     */
    maxResults?: MaxResults;
  }
  export interface ListAssessmentFrameworksResponse {
    /**
     *  The list of metadata objects for the framework. 
     */
    frameworkMetadataList?: FrameworkMetadataList;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
  }
  export type ListAssessmentMetadata = AssessmentMetadataItem[];
  export interface ListAssessmentReportsRequest {
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
    /**
     *  Represents the maximum number of results on a page or for an API request call. 
     */
    maxResults?: MaxResults;
  }
  export interface ListAssessmentReportsResponse {
    /**
     *  The list of assessment reports that the ListAssessmentReports API returned. 
     */
    assessmentReports?: AssessmentReportsMetadata;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
  }
  export interface ListAssessmentsRequest {
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
    /**
     *  Represents the maximum number of results on a page or for an API request call. 
     */
    maxResults?: MaxResults;
  }
  export interface ListAssessmentsResponse {
    /**
     *  The metadata that's associated with the assessment. 
     */
    assessmentMetadata?: ListAssessmentMetadata;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
  }
  export interface ListControlsRequest {
    /**
     *  The type of control, such as a standard control or a custom control. 
     */
    controlType: ControlType;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
    /**
     *  Represents the maximum number of results on a page or for an API request call. 
     */
    maxResults?: MaxResults;
  }
  export interface ListControlsResponse {
    /**
     *  The list of control metadata objects that the ListControls API returned. 
     */
    controlMetadataList?: ControlMetadataList;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
  }
  export interface ListKeywordsForDataSourceRequest {
    /**
     *  The control mapping data source that the keywords apply to. 
     */
    source: SourceType;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
    /**
     *  Represents the maximum number of results on a page or for an API request call. 
     */
    maxResults?: MaxResults;
  }
  export interface ListKeywordsForDataSourceResponse {
    /**
     *  The list of keywords for the event mapping source. 
     */
    keywords?: Keywords;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
  }
  export interface ListNotificationsRequest {
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
    /**
     *  Represents the maximum number of results on a page or for an API request call. 
     */
    maxResults?: MaxResults;
  }
  export interface ListNotificationsResponse {
    /**
     *  The returned list of notifications. 
     */
    notifications?: Notifications;
    /**
     *  The pagination token that's used to fetch the next set of results. 
     */
    nextToken?: Token;
  }
  export interface ListTagsForResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the resource. 
     */
    resourceArn: AuditManagerArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     *  The list of tags that the ListTagsForResource API returned. 
     */
    tags?: TagMap;
  }
  export interface ManualEvidence {
    /**
     *  The Amazon S3 URL that points to a manual evidence object. 
     */
    s3ResourcePath?: S3Url;
  }
  export type ManualEvidenceList = ManualEvidence[];
  export type MaxResults = number;
  export type NonEmptyString = string;
  export interface Notification {
    /**
     *  The unique identifier for the notification. 
     */
    id?: TimestampUUID;
    /**
     *  The identifier for the assessment. 
     */
    assessmentId?: UUID;
    /**
     *  The name of the related assessment. 
     */
    assessmentName?: AssessmentName;
    /**
     *  The identifier for the control set. 
     */
    controlSetId?: ControlSetId;
    /**
     *  Specifies the name of the control set that the notification is about. 
     */
    controlSetName?: NonEmptyString;
    /**
     *  The description of the notification. 
     */
    description?: NonEmptyString;
    /**
     *  The time when the notification was sent. 
     */
    eventTime?: Timestamp;
    /**
     *  The sender of the notification. 
     */
    source?: NonEmptyString;
  }
  export type Notifications = Notification[];
  export type NullableInteger = number;
  export type ObjectTypeEnum = "ASSESSMENT"|"CONTROL_SET"|"CONTROL"|"DELEGATION"|"ASSESSMENT_REPORT"|string;
  export type Region = string;
  export interface RegisterAccountRequest {
    /**
     *  The KMS key details. 
     */
    kmsKey?: KmsKey;
    /**
     *  The delegated administrator account for Audit Manager. 
     */
    delegatedAdminAccount?: AccountId;
  }
  export interface RegisterAccountResponse {
    /**
     *  The status of the account registration request. 
     */
    status?: AccountStatus;
  }
  export interface RegisterOrganizationAdminAccountRequest {
    /**
     *  The identifier for the delegated administrator account. 
     */
    adminAccountId: AccountId;
  }
  export interface RegisterOrganizationAdminAccountResponse {
    /**
     *  The identifier for the delegated administrator account. 
     */
    adminAccountId?: AccountId;
    /**
     *  The identifier for the organization. 
     */
    organizationId?: organizationId;
  }
  export interface Resource {
    /**
     *  The Amazon Resource Name (ARN) for the resource. 
     */
    arn?: GenericArn;
    /**
     *  The value of the resource. 
     */
    value?: String;
  }
  export type Resources = Resource[];
  export interface Role {
    /**
     *  The type of customer persona.   In CreateAssessment, roleType can only be PROCESS_OWNER.  In UpdateSettings, roleType can only be PROCESS_OWNER. In BatchCreateDelegationByAssessment, roleType can only be RESOURCE_OWNER. 
     */
    roleType?: RoleType;
    /**
     *  The Amazon Resource Name (ARN) of the IAM role. 
     */
    roleArn?: IamArn;
  }
  export type RoleType = "PROCESS_OWNER"|"RESOURCE_OWNER"|string;
  export type Roles = Role[];
  export type S3Url = string;
  export type SNSTopic = string;
  export interface Scope {
    /**
     *  The Amazon Web Services accounts that are included in the scope of the assessment. 
     */
    awsAccounts?: AWSAccounts;
    /**
     *  The Amazon Web Services services that are included in the scope of the assessment. 
     */
    awsServices?: AWSServices;
  }
  export interface ServiceMetadata {
    /**
     *  The name of the Amazon Web Service. 
     */
    name?: AWSServiceName;
    /**
     *  The display name of the Amazon Web Service. 
     */
    displayName?: NonEmptyString;
    /**
     *  The description of the Amazon Web Service. 
     */
    description?: NonEmptyString;
    /**
     *  The category that the Amazon Web Service belongs to, such as compute, storage, or database. 
     */
    category?: NonEmptyString;
  }
  export type ServiceMetadataList = ServiceMetadata[];
  export type SettingAttribute = "ALL"|"IS_AWS_ORG_ENABLED"|"SNS_TOPIC"|"DEFAULT_ASSESSMENT_REPORTS_DESTINATION"|"DEFAULT_PROCESS_OWNERS"|string;
  export interface Settings {
    /**
     *  Specifies whether Organizations is enabled. 
     */
    isAwsOrgEnabled?: Boolean;
    /**
     *  The designated Amazon Simple Notification Service (Amazon SNS) topic. 
     */
    snsTopic?: SNSTopic;
    /**
     *  The default storage destination for assessment reports. 
     */
    defaultAssessmentReportsDestination?: AssessmentReportsDestination;
    /**
     *  The designated default audit owners. 
     */
    defaultProcessOwners?: Roles;
    /**
     *  The KMS key details. 
     */
    kmsKey?: KmsKey;
  }
  export type ShareRequestAction = "ACCEPT"|"DECLINE"|"REVOKE"|string;
  export type ShareRequestComment = string;
  export type ShareRequestStatus = "ACTIVE"|"REPLICATING"|"SHARED"|"EXPIRING"|"FAILED"|"EXPIRED"|"DECLINED"|"REVOKED"|string;
  export type ShareRequestType = "SENT"|"RECEIVED"|string;
  export type SnsArn = string;
  export type SourceDescription = string;
  export type SourceFrequency = "DAILY"|"WEEKLY"|"MONTHLY"|string;
  export interface SourceKeyword {
    /**
     *  The method of input for the keyword. 
     */
    keywordInputType?: KeywordInputType;
    /**
     *  The value of the keyword that's used to search CloudTrail logs, Config rules, Security Hub checks, and Amazon Web Services API names when mapping a control data source. 
     */
    keywordValue?: KeywordValue;
  }
  export type SourceName = string;
  export type SourceSetUpOption = "System_Controls_Mapping"|"Procedural_Controls_Mapping"|string;
  export type SourceType = "AWS_Cloudtrail"|"AWS_Config"|"AWS_Security_Hub"|"AWS_API_Call"|"MANUAL"|string;
  export interface StartAssessmentFrameworkShareRequest {
    /**
     *  The unique identifier for the custom framework to be shared. 
     */
    frameworkId: UUID;
    /**
     *  The Amazon Web Services account of the recipient. 
     */
    destinationAccount: AccountId;
    /**
     *  The Amazon Web Services Region of the recipient. 
     */
    destinationRegion: Region;
    /**
     *  An optional comment from the sender about the share request. 
     */
    comment?: ShareRequestComment;
  }
  export interface StartAssessmentFrameworkShareResponse {
    /**
     *  The share request that's created by the StartAssessmentFrameworkShare API. 
     */
    assessmentFrameworkShareRequest?: AssessmentFrameworkShareRequest;
  }
  export type String = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the resource. 
     */
    resourceArn: AuditManagerArn;
    /**
     *  The tags that are associated with the resource. 
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TestingInformation = string;
  export type Timestamp = Date;
  export type TimestampUUID = string;
  export type Token = string;
  export type TroubleshootingText = string;
  export interface URL {
    /**
     *  The name or word that's used as a hyperlink to the URL. 
     */
    hyperlinkName?: HyperlinkName;
    /**
     *  The unique identifier for the internet resource. 
     */
    link?: UrlLink;
  }
  export type UUID = string;
  export interface UntagResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the specified resource. 
     */
    resourceArn: AuditManagerArn;
    /**
     *  The name or key of the tag. 
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAssessmentControlRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The identifier for the control set. 
     */
    controlSetId: ControlSetId;
    /**
     *  The identifier for the control. 
     */
    controlId: UUID;
    /**
     *  The status of the control. 
     */
    controlStatus?: ControlStatus;
    /**
     *  The comment body text for the control. 
     */
    commentBody?: ControlCommentBody;
  }
  export interface UpdateAssessmentControlResponse {
    /**
     *  The name of the updated control set that the UpdateAssessmentControl API returned. 
     */
    control?: AssessmentControl;
  }
  export interface UpdateAssessmentControlSetStatusRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The identifier for the control set. 
     */
    controlSetId: String;
    /**
     *  The status of the control set that's being updated. 
     */
    status: ControlSetStatus;
    /**
     *  The comment that's related to the status update. 
     */
    comment: DelegationComment;
  }
  export interface UpdateAssessmentControlSetStatusResponse {
    /**
     *  The name of the updated control set that the UpdateAssessmentControlSetStatus API returned. 
     */
    controlSet?: AssessmentControlSet;
  }
  export interface UpdateAssessmentFrameworkControlSet {
    /**
     *  The unique identifier for the control set. 
     */
    id?: ControlSetName;
    /**
     *  The name of the control set. 
     */
    name: ControlSetName;
    /**
     *  The list of controls that are contained within the control set. 
     */
    controls?: CreateAssessmentFrameworkControls;
  }
  export type UpdateAssessmentFrameworkControlSets = UpdateAssessmentFrameworkControlSet[];
  export interface UpdateAssessmentFrameworkRequest {
    /**
     *  The identifier for the framework. 
     */
    frameworkId: UUID;
    /**
     *  The name of the framework to be updated. 
     */
    name: FrameworkName;
    /**
     *  The description of the updated framework. 
     */
    description?: FrameworkDescription;
    /**
     *  The compliance type that the new custom framework supports, such as CIS or HIPAA. 
     */
    complianceType?: ComplianceType;
    /**
     *  The control sets that are associated with the framework. 
     */
    controlSets: UpdateAssessmentFrameworkControlSets;
  }
  export interface UpdateAssessmentFrameworkResponse {
    /**
     *  The name of the framework. 
     */
    framework?: Framework;
  }
  export interface UpdateAssessmentFrameworkShareRequest {
    /**
     *  The unique identifier for the share request. 
     */
    requestId: UUID;
    /**
     * Specifies whether the share request is a sent request or a received request.
     */
    requestType: ShareRequestType;
    /**
     * Specifies the update action for the share request.
     */
    action: ShareRequestAction;
  }
  export interface UpdateAssessmentFrameworkShareResponse {
    /**
     *  The updated share request that's returned by the UpdateAssessmentFrameworkShare operation. 
     */
    assessmentFrameworkShareRequest?: AssessmentFrameworkShareRequest;
  }
  export interface UpdateAssessmentRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The name of the assessment to be updated. 
     */
    assessmentName?: AssessmentName;
    /**
     *  The description of the assessment. 
     */
    assessmentDescription?: AssessmentDescription;
    /**
     *  The scope of the assessment. 
     */
    scope: Scope;
    /**
     *  The assessment report storage destination for the assessment that's being updated. 
     */
    assessmentReportsDestination?: AssessmentReportsDestination;
    /**
     *  The list of roles for the assessment. 
     */
    roles?: Roles;
  }
  export interface UpdateAssessmentResponse {
    /**
     *  The response object for the UpdateAssessmentRequest API. This is the name of the updated assessment.
     */
    assessment?: Assessment;
  }
  export interface UpdateAssessmentStatusRequest {
    /**
     *  The identifier for the assessment. 
     */
    assessmentId: UUID;
    /**
     *  The current status of the assessment. 
     */
    status: AssessmentStatus;
  }
  export interface UpdateAssessmentStatusResponse {
    /**
     *  The name of the updated assessment that the UpdateAssessmentStatus API returned. 
     */
    assessment?: Assessment;
  }
  export interface UpdateControlRequest {
    /**
     *  The identifier for the control. 
     */
    controlId: UUID;
    /**
     *  The name of the updated control. 
     */
    name: ControlName;
    /**
     *  The optional description of the control. 
     */
    description?: ControlDescription;
    /**
     *  The steps that you should follow to determine if the control is met. 
     */
    testingInformation?: TestingInformation;
    /**
     *  The title of the action plan for remediating the control. 
     */
    actionPlanTitle?: ActionPlanTitle;
    /**
     *  The recommended actions to carry out if the control isn't fulfilled. 
     */
    actionPlanInstructions?: ActionPlanInstructions;
    /**
     *  The data mapping sources for the control. 
     */
    controlMappingSources: ControlMappingSources;
  }
  export interface UpdateControlResponse {
    /**
     *  The name of the updated control set that the UpdateControl API returned. 
     */
    control?: Control;
  }
  export interface UpdateSettingsRequest {
    /**
     *  The Amazon Simple Notification Service (Amazon SNS) topic that Audit Manager sends notifications to. 
     */
    snsTopic?: SnsArn;
    /**
     *  The default storage destination for assessment reports. 
     */
    defaultAssessmentReportsDestination?: AssessmentReportsDestination;
    /**
     *  A list of the default audit owners. 
     */
    defaultProcessOwners?: Roles;
    /**
     *  The KMS key details. 
     */
    kmsKey?: KmsKey;
  }
  export interface UpdateSettingsResponse {
    /**
     *  The current list of settings. 
     */
    settings?: Settings;
  }
  export type UrlLink = string;
  export type Username = string;
  export interface ValidateAssessmentReportIntegrityRequest {
    /**
     *  The relative path of the Amazon S3 bucket that the assessment report is stored in. 
     */
    s3RelativePath: S3Url;
  }
  export interface ValidateAssessmentReportIntegrityResponse {
    /**
     *  Specifies whether the signature key is valid. 
     */
    signatureValid?: Boolean;
    /**
     *  The signature algorithm that's used to code sign the assessment report file. 
     */
    signatureAlgorithm?: String;
    /**
     *  The date and time signature that specifies when the assessment report was created. 
     */
    signatureDateTime?: String;
    /**
     *  The unique identifier for the validation signature key. 
     */
    signatureKeyId?: String;
    /**
     *  Represents any errors that occurred when validating the assessment report. 
     */
    validationErrors?: ValidationErrors;
  }
  export type ValidationErrors = NonEmptyString[];
  export type organizationId = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-07-25"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the AuditManager client.
   */
  export import Types = AuditManager;
}
export = AuditManager;
