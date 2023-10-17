import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Backup extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Backup.Types.ClientConfiguration)
  config: Config & Backup.Types.ClientConfiguration;
  /**
   * This action removes the specified legal hold on a recovery point. This action can only be performed by a user with sufficient permissions.
   */
  cancelLegalHold(params: Backup.Types.CancelLegalHoldInput, callback?: (err: AWSError, data: Backup.Types.CancelLegalHoldOutput) => void): Request<Backup.Types.CancelLegalHoldOutput, AWSError>;
  /**
   * This action removes the specified legal hold on a recovery point. This action can only be performed by a user with sufficient permissions.
   */
  cancelLegalHold(callback?: (err: AWSError, data: Backup.Types.CancelLegalHoldOutput) => void): Request<Backup.Types.CancelLegalHoldOutput, AWSError>;
  /**
   * Creates a backup plan using a backup plan name and backup rules. A backup plan is a document that contains information that Backup uses to schedule tasks that create recovery points for resources. If you call CreateBackupPlan with a plan that already exists, you receive an AlreadyExistsException exception.
   */
  createBackupPlan(params: Backup.Types.CreateBackupPlanInput, callback?: (err: AWSError, data: Backup.Types.CreateBackupPlanOutput) => void): Request<Backup.Types.CreateBackupPlanOutput, AWSError>;
  /**
   * Creates a backup plan using a backup plan name and backup rules. A backup plan is a document that contains information that Backup uses to schedule tasks that create recovery points for resources. If you call CreateBackupPlan with a plan that already exists, you receive an AlreadyExistsException exception.
   */
  createBackupPlan(callback?: (err: AWSError, data: Backup.Types.CreateBackupPlanOutput) => void): Request<Backup.Types.CreateBackupPlanOutput, AWSError>;
  /**
   * Creates a JSON document that specifies a set of resources to assign to a backup plan. For examples, see Assigning resources programmatically. 
   */
  createBackupSelection(params: Backup.Types.CreateBackupSelectionInput, callback?: (err: AWSError, data: Backup.Types.CreateBackupSelectionOutput) => void): Request<Backup.Types.CreateBackupSelectionOutput, AWSError>;
  /**
   * Creates a JSON document that specifies a set of resources to assign to a backup plan. For examples, see Assigning resources programmatically. 
   */
  createBackupSelection(callback?: (err: AWSError, data: Backup.Types.CreateBackupSelectionOutput) => void): Request<Backup.Types.CreateBackupSelectionOutput, AWSError>;
  /**
   * Creates a logical container where backups are stored. A CreateBackupVault request includes a name, optionally one or more resource tags, an encryption key, and a request ID.  Do not include sensitive data, such as passport numbers, in the name of a backup vault. 
   */
  createBackupVault(params: Backup.Types.CreateBackupVaultInput, callback?: (err: AWSError, data: Backup.Types.CreateBackupVaultOutput) => void): Request<Backup.Types.CreateBackupVaultOutput, AWSError>;
  /**
   * Creates a logical container where backups are stored. A CreateBackupVault request includes a name, optionally one or more resource tags, an encryption key, and a request ID.  Do not include sensitive data, such as passport numbers, in the name of a backup vault. 
   */
  createBackupVault(callback?: (err: AWSError, data: Backup.Types.CreateBackupVaultOutput) => void): Request<Backup.Types.CreateBackupVaultOutput, AWSError>;
  /**
   * Creates a framework with one or more controls. A framework is a collection of controls that you can use to evaluate your backup practices. By using pre-built customizable controls to define your policies, you can evaluate whether your backup practices comply with your policies and which resources are not yet in compliance.
   */
  createFramework(params: Backup.Types.CreateFrameworkInput, callback?: (err: AWSError, data: Backup.Types.CreateFrameworkOutput) => void): Request<Backup.Types.CreateFrameworkOutput, AWSError>;
  /**
   * Creates a framework with one or more controls. A framework is a collection of controls that you can use to evaluate your backup practices. By using pre-built customizable controls to define your policies, you can evaluate whether your backup practices comply with your policies and which resources are not yet in compliance.
   */
  createFramework(callback?: (err: AWSError, data: Backup.Types.CreateFrameworkOutput) => void): Request<Backup.Types.CreateFrameworkOutput, AWSError>;
  /**
   * This action creates a legal hold on a recovery point (backup). A legal hold is a restraint on altering or deleting a backup until an authorized user cancels the legal hold. Any actions to delete or disassociate a recovery point will fail with an error if one or more active legal holds are on the recovery point.
   */
  createLegalHold(params: Backup.Types.CreateLegalHoldInput, callback?: (err: AWSError, data: Backup.Types.CreateLegalHoldOutput) => void): Request<Backup.Types.CreateLegalHoldOutput, AWSError>;
  /**
   * This action creates a legal hold on a recovery point (backup). A legal hold is a restraint on altering or deleting a backup until an authorized user cancels the legal hold. Any actions to delete or disassociate a recovery point will fail with an error if one or more active legal holds are on the recovery point.
   */
  createLegalHold(callback?: (err: AWSError, data: Backup.Types.CreateLegalHoldOutput) => void): Request<Backup.Types.CreateLegalHoldOutput, AWSError>;
  /**
   * This request creates a logical container to where backups may be copied. This request includes a name, the Region, the maximum number of retention days, the minimum number of retention days, and optionally can include tags and a creator request ID.  Do not include sensitive data, such as passport numbers, in the name of a backup vault. 
   */
  createLogicallyAirGappedBackupVault(params: Backup.Types.CreateLogicallyAirGappedBackupVaultInput, callback?: (err: AWSError, data: Backup.Types.CreateLogicallyAirGappedBackupVaultOutput) => void): Request<Backup.Types.CreateLogicallyAirGappedBackupVaultOutput, AWSError>;
  /**
   * This request creates a logical container to where backups may be copied. This request includes a name, the Region, the maximum number of retention days, the minimum number of retention days, and optionally can include tags and a creator request ID.  Do not include sensitive data, such as passport numbers, in the name of a backup vault. 
   */
  createLogicallyAirGappedBackupVault(callback?: (err: AWSError, data: Backup.Types.CreateLogicallyAirGappedBackupVaultOutput) => void): Request<Backup.Types.CreateLogicallyAirGappedBackupVaultOutput, AWSError>;
  /**
   * Creates a report plan. A report plan is a document that contains information about the contents of the report and where Backup will deliver it. If you call CreateReportPlan with a plan that already exists, you receive an AlreadyExistsException exception.
   */
  createReportPlan(params: Backup.Types.CreateReportPlanInput, callback?: (err: AWSError, data: Backup.Types.CreateReportPlanOutput) => void): Request<Backup.Types.CreateReportPlanOutput, AWSError>;
  /**
   * Creates a report plan. A report plan is a document that contains information about the contents of the report and where Backup will deliver it. If you call CreateReportPlan with a plan that already exists, you receive an AlreadyExistsException exception.
   */
  createReportPlan(callback?: (err: AWSError, data: Backup.Types.CreateReportPlanOutput) => void): Request<Backup.Types.CreateReportPlanOutput, AWSError>;
  /**
   * Deletes a backup plan. A backup plan can only be deleted after all associated selections of resources have been deleted. Deleting a backup plan deletes the current version of a backup plan. Previous versions, if any, will still exist.
   */
  deleteBackupPlan(params: Backup.Types.DeleteBackupPlanInput, callback?: (err: AWSError, data: Backup.Types.DeleteBackupPlanOutput) => void): Request<Backup.Types.DeleteBackupPlanOutput, AWSError>;
  /**
   * Deletes a backup plan. A backup plan can only be deleted after all associated selections of resources have been deleted. Deleting a backup plan deletes the current version of a backup plan. Previous versions, if any, will still exist.
   */
  deleteBackupPlan(callback?: (err: AWSError, data: Backup.Types.DeleteBackupPlanOutput) => void): Request<Backup.Types.DeleteBackupPlanOutput, AWSError>;
  /**
   * Deletes the resource selection associated with a backup plan that is specified by the SelectionId.
   */
  deleteBackupSelection(params: Backup.Types.DeleteBackupSelectionInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the resource selection associated with a backup plan that is specified by the SelectionId.
   */
  deleteBackupSelection(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the backup vault identified by its name. A vault can be deleted only if it is empty.
   */
  deleteBackupVault(params: Backup.Types.DeleteBackupVaultInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the backup vault identified by its name. A vault can be deleted only if it is empty.
   */
  deleteBackupVault(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the policy document that manages permissions on a backup vault.
   */
  deleteBackupVaultAccessPolicy(params: Backup.Types.DeleteBackupVaultAccessPolicyInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the policy document that manages permissions on a backup vault.
   */
  deleteBackupVaultAccessPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes Backup Vault Lock from a backup vault specified by a backup vault name. If the Vault Lock configuration is immutable, then you cannot delete Vault Lock using API operations, and you will receive an InvalidRequestException if you attempt to do so. For more information, see Vault Lock in the Backup Developer Guide.
   */
  deleteBackupVaultLockConfiguration(params: Backup.Types.DeleteBackupVaultLockConfigurationInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes Backup Vault Lock from a backup vault specified by a backup vault name. If the Vault Lock configuration is immutable, then you cannot delete Vault Lock using API operations, and you will receive an InvalidRequestException if you attempt to do so. For more information, see Vault Lock in the Backup Developer Guide.
   */
  deleteBackupVaultLockConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes event notifications for the specified backup vault.
   */
  deleteBackupVaultNotifications(params: Backup.Types.DeleteBackupVaultNotificationsInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes event notifications for the specified backup vault.
   */
  deleteBackupVaultNotifications(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the framework specified by a framework name.
   */
  deleteFramework(params: Backup.Types.DeleteFrameworkInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the framework specified by a framework name.
   */
  deleteFramework(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the recovery point specified by a recovery point ID. If the recovery point ID belongs to a continuous backup, calling this endpoint deletes the existing continuous backup and stops future continuous backup. When an IAM role's permissions are insufficient to call this API, the service sends back an HTTP 200 response with an empty HTTP body, but the recovery point is not deleted. Instead, it enters an EXPIRED state.  EXPIRED recovery points can be deleted with this API once the IAM role has the iam:CreateServiceLinkedRole action. To learn more about adding this role, see  Troubleshooting manual deletions. If the user or role is deleted or the permission within the role is removed, the deletion will not be successful and will enter an EXPIRED state.
   */
  deleteRecoveryPoint(params: Backup.Types.DeleteRecoveryPointInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the recovery point specified by a recovery point ID. If the recovery point ID belongs to a continuous backup, calling this endpoint deletes the existing continuous backup and stops future continuous backup. When an IAM role's permissions are insufficient to call this API, the service sends back an HTTP 200 response with an empty HTTP body, but the recovery point is not deleted. Instead, it enters an EXPIRED state.  EXPIRED recovery points can be deleted with this API once the IAM role has the iam:CreateServiceLinkedRole action. To learn more about adding this role, see  Troubleshooting manual deletions. If the user or role is deleted or the permission within the role is removed, the deletion will not be successful and will enter an EXPIRED state.
   */
  deleteRecoveryPoint(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the report plan specified by a report plan name.
   */
  deleteReportPlan(params: Backup.Types.DeleteReportPlanInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the report plan specified by a report plan name.
   */
  deleteReportPlan(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Returns backup job details for the specified BackupJobId.
   */
  describeBackupJob(params: Backup.Types.DescribeBackupJobInput, callback?: (err: AWSError, data: Backup.Types.DescribeBackupJobOutput) => void): Request<Backup.Types.DescribeBackupJobOutput, AWSError>;
  /**
   * Returns backup job details for the specified BackupJobId.
   */
  describeBackupJob(callback?: (err: AWSError, data: Backup.Types.DescribeBackupJobOutput) => void): Request<Backup.Types.DescribeBackupJobOutput, AWSError>;
  /**
   * Returns metadata about a backup vault specified by its name.
   */
  describeBackupVault(params: Backup.Types.DescribeBackupVaultInput, callback?: (err: AWSError, data: Backup.Types.DescribeBackupVaultOutput) => void): Request<Backup.Types.DescribeBackupVaultOutput, AWSError>;
  /**
   * Returns metadata about a backup vault specified by its name.
   */
  describeBackupVault(callback?: (err: AWSError, data: Backup.Types.DescribeBackupVaultOutput) => void): Request<Backup.Types.DescribeBackupVaultOutput, AWSError>;
  /**
   * Returns metadata associated with creating a copy of a resource.
   */
  describeCopyJob(params: Backup.Types.DescribeCopyJobInput, callback?: (err: AWSError, data: Backup.Types.DescribeCopyJobOutput) => void): Request<Backup.Types.DescribeCopyJobOutput, AWSError>;
  /**
   * Returns metadata associated with creating a copy of a resource.
   */
  describeCopyJob(callback?: (err: AWSError, data: Backup.Types.DescribeCopyJobOutput) => void): Request<Backup.Types.DescribeCopyJobOutput, AWSError>;
  /**
   * Returns the framework details for the specified FrameworkName.
   */
  describeFramework(params: Backup.Types.DescribeFrameworkInput, callback?: (err: AWSError, data: Backup.Types.DescribeFrameworkOutput) => void): Request<Backup.Types.DescribeFrameworkOutput, AWSError>;
  /**
   * Returns the framework details for the specified FrameworkName.
   */
  describeFramework(callback?: (err: AWSError, data: Backup.Types.DescribeFrameworkOutput) => void): Request<Backup.Types.DescribeFrameworkOutput, AWSError>;
  /**
   * Describes whether the Amazon Web Services account is opted in to cross-account backup. Returns an error if the account is not a member of an Organizations organization. Example: describe-global-settings --region us-west-2 
   */
  describeGlobalSettings(params: Backup.Types.DescribeGlobalSettingsInput, callback?: (err: AWSError, data: Backup.Types.DescribeGlobalSettingsOutput) => void): Request<Backup.Types.DescribeGlobalSettingsOutput, AWSError>;
  /**
   * Describes whether the Amazon Web Services account is opted in to cross-account backup. Returns an error if the account is not a member of an Organizations organization. Example: describe-global-settings --region us-west-2 
   */
  describeGlobalSettings(callback?: (err: AWSError, data: Backup.Types.DescribeGlobalSettingsOutput) => void): Request<Backup.Types.DescribeGlobalSettingsOutput, AWSError>;
  /**
   * Returns information about a saved resource, including the last time it was backed up, its Amazon Resource Name (ARN), and the Amazon Web Services service type of the saved resource.
   */
  describeProtectedResource(params: Backup.Types.DescribeProtectedResourceInput, callback?: (err: AWSError, data: Backup.Types.DescribeProtectedResourceOutput) => void): Request<Backup.Types.DescribeProtectedResourceOutput, AWSError>;
  /**
   * Returns information about a saved resource, including the last time it was backed up, its Amazon Resource Name (ARN), and the Amazon Web Services service type of the saved resource.
   */
  describeProtectedResource(callback?: (err: AWSError, data: Backup.Types.DescribeProtectedResourceOutput) => void): Request<Backup.Types.DescribeProtectedResourceOutput, AWSError>;
  /**
   * Returns metadata associated with a recovery point, including ID, status, encryption, and lifecycle.
   */
  describeRecoveryPoint(params: Backup.Types.DescribeRecoveryPointInput, callback?: (err: AWSError, data: Backup.Types.DescribeRecoveryPointOutput) => void): Request<Backup.Types.DescribeRecoveryPointOutput, AWSError>;
  /**
   * Returns metadata associated with a recovery point, including ID, status, encryption, and lifecycle.
   */
  describeRecoveryPoint(callback?: (err: AWSError, data: Backup.Types.DescribeRecoveryPointOutput) => void): Request<Backup.Types.DescribeRecoveryPointOutput, AWSError>;
  /**
   * Returns the current service opt-in settings for the Region. If service opt-in is enabled for a service, Backup tries to protect that service's resources in this Region, when the resource is included in an on-demand backup or scheduled backup plan. Otherwise, Backup does not try to protect that service's resources in this Region.
   */
  describeRegionSettings(params: Backup.Types.DescribeRegionSettingsInput, callback?: (err: AWSError, data: Backup.Types.DescribeRegionSettingsOutput) => void): Request<Backup.Types.DescribeRegionSettingsOutput, AWSError>;
  /**
   * Returns the current service opt-in settings for the Region. If service opt-in is enabled for a service, Backup tries to protect that service's resources in this Region, when the resource is included in an on-demand backup or scheduled backup plan. Otherwise, Backup does not try to protect that service's resources in this Region.
   */
  describeRegionSettings(callback?: (err: AWSError, data: Backup.Types.DescribeRegionSettingsOutput) => void): Request<Backup.Types.DescribeRegionSettingsOutput, AWSError>;
  /**
   * Returns the details associated with creating a report as specified by its ReportJobId.
   */
  describeReportJob(params: Backup.Types.DescribeReportJobInput, callback?: (err: AWSError, data: Backup.Types.DescribeReportJobOutput) => void): Request<Backup.Types.DescribeReportJobOutput, AWSError>;
  /**
   * Returns the details associated with creating a report as specified by its ReportJobId.
   */
  describeReportJob(callback?: (err: AWSError, data: Backup.Types.DescribeReportJobOutput) => void): Request<Backup.Types.DescribeReportJobOutput, AWSError>;
  /**
   * Returns a list of all report plans for an Amazon Web Services account and Amazon Web Services Region.
   */
  describeReportPlan(params: Backup.Types.DescribeReportPlanInput, callback?: (err: AWSError, data: Backup.Types.DescribeReportPlanOutput) => void): Request<Backup.Types.DescribeReportPlanOutput, AWSError>;
  /**
   * Returns a list of all report plans for an Amazon Web Services account and Amazon Web Services Region.
   */
  describeReportPlan(callback?: (err: AWSError, data: Backup.Types.DescribeReportPlanOutput) => void): Request<Backup.Types.DescribeReportPlanOutput, AWSError>;
  /**
   * Returns metadata associated with a restore job that is specified by a job ID.
   */
  describeRestoreJob(params: Backup.Types.DescribeRestoreJobInput, callback?: (err: AWSError, data: Backup.Types.DescribeRestoreJobOutput) => void): Request<Backup.Types.DescribeRestoreJobOutput, AWSError>;
  /**
   * Returns metadata associated with a restore job that is specified by a job ID.
   */
  describeRestoreJob(callback?: (err: AWSError, data: Backup.Types.DescribeRestoreJobOutput) => void): Request<Backup.Types.DescribeRestoreJobOutput, AWSError>;
  /**
   * Deletes the specified continuous backup recovery point from Backup and releases control of that continuous backup to the source service, such as Amazon RDS. The source service will continue to create and retain continuous backups using the lifecycle that you specified in your original backup plan. Does not support snapshot backup recovery points.
   */
  disassociateRecoveryPoint(params: Backup.Types.DisassociateRecoveryPointInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified continuous backup recovery point from Backup and releases control of that continuous backup to the source service, such as Amazon RDS. The source service will continue to create and retain continuous backups using the lifecycle that you specified in your original backup plan. Does not support snapshot backup recovery points.
   */
  disassociateRecoveryPoint(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This action to a specific child (nested) recovery point removes the relationship between the specified recovery point and its parent (composite) recovery point.
   */
  disassociateRecoveryPointFromParent(params: Backup.Types.DisassociateRecoveryPointFromParentInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This action to a specific child (nested) recovery point removes the relationship between the specified recovery point and its parent (composite) recovery point.
   */
  disassociateRecoveryPointFromParent(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Returns the backup plan that is specified by the plan ID as a backup template.
   */
  exportBackupPlanTemplate(params: Backup.Types.ExportBackupPlanTemplateInput, callback?: (err: AWSError, data: Backup.Types.ExportBackupPlanTemplateOutput) => void): Request<Backup.Types.ExportBackupPlanTemplateOutput, AWSError>;
  /**
   * Returns the backup plan that is specified by the plan ID as a backup template.
   */
  exportBackupPlanTemplate(callback?: (err: AWSError, data: Backup.Types.ExportBackupPlanTemplateOutput) => void): Request<Backup.Types.ExportBackupPlanTemplateOutput, AWSError>;
  /**
   * Returns BackupPlan details for the specified BackupPlanId. The details are the body of a backup plan in JSON format, in addition to plan metadata.
   */
  getBackupPlan(params: Backup.Types.GetBackupPlanInput, callback?: (err: AWSError, data: Backup.Types.GetBackupPlanOutput) => void): Request<Backup.Types.GetBackupPlanOutput, AWSError>;
  /**
   * Returns BackupPlan details for the specified BackupPlanId. The details are the body of a backup plan in JSON format, in addition to plan metadata.
   */
  getBackupPlan(callback?: (err: AWSError, data: Backup.Types.GetBackupPlanOutput) => void): Request<Backup.Types.GetBackupPlanOutput, AWSError>;
  /**
   * Returns a valid JSON document specifying a backup plan or an error.
   */
  getBackupPlanFromJSON(params: Backup.Types.GetBackupPlanFromJSONInput, callback?: (err: AWSError, data: Backup.Types.GetBackupPlanFromJSONOutput) => void): Request<Backup.Types.GetBackupPlanFromJSONOutput, AWSError>;
  /**
   * Returns a valid JSON document specifying a backup plan or an error.
   */
  getBackupPlanFromJSON(callback?: (err: AWSError, data: Backup.Types.GetBackupPlanFromJSONOutput) => void): Request<Backup.Types.GetBackupPlanFromJSONOutput, AWSError>;
  /**
   * Returns the template specified by its templateId as a backup plan.
   */
  getBackupPlanFromTemplate(params: Backup.Types.GetBackupPlanFromTemplateInput, callback?: (err: AWSError, data: Backup.Types.GetBackupPlanFromTemplateOutput) => void): Request<Backup.Types.GetBackupPlanFromTemplateOutput, AWSError>;
  /**
   * Returns the template specified by its templateId as a backup plan.
   */
  getBackupPlanFromTemplate(callback?: (err: AWSError, data: Backup.Types.GetBackupPlanFromTemplateOutput) => void): Request<Backup.Types.GetBackupPlanFromTemplateOutput, AWSError>;
  /**
   * Returns selection metadata and a document in JSON format that specifies a list of resources that are associated with a backup plan.
   */
  getBackupSelection(params: Backup.Types.GetBackupSelectionInput, callback?: (err: AWSError, data: Backup.Types.GetBackupSelectionOutput) => void): Request<Backup.Types.GetBackupSelectionOutput, AWSError>;
  /**
   * Returns selection metadata and a document in JSON format that specifies a list of resources that are associated with a backup plan.
   */
  getBackupSelection(callback?: (err: AWSError, data: Backup.Types.GetBackupSelectionOutput) => void): Request<Backup.Types.GetBackupSelectionOutput, AWSError>;
  /**
   * Returns the access policy document that is associated with the named backup vault.
   */
  getBackupVaultAccessPolicy(params: Backup.Types.GetBackupVaultAccessPolicyInput, callback?: (err: AWSError, data: Backup.Types.GetBackupVaultAccessPolicyOutput) => void): Request<Backup.Types.GetBackupVaultAccessPolicyOutput, AWSError>;
  /**
   * Returns the access policy document that is associated with the named backup vault.
   */
  getBackupVaultAccessPolicy(callback?: (err: AWSError, data: Backup.Types.GetBackupVaultAccessPolicyOutput) => void): Request<Backup.Types.GetBackupVaultAccessPolicyOutput, AWSError>;
  /**
   * Returns event notifications for the specified backup vault.
   */
  getBackupVaultNotifications(params: Backup.Types.GetBackupVaultNotificationsInput, callback?: (err: AWSError, data: Backup.Types.GetBackupVaultNotificationsOutput) => void): Request<Backup.Types.GetBackupVaultNotificationsOutput, AWSError>;
  /**
   * Returns event notifications for the specified backup vault.
   */
  getBackupVaultNotifications(callback?: (err: AWSError, data: Backup.Types.GetBackupVaultNotificationsOutput) => void): Request<Backup.Types.GetBackupVaultNotificationsOutput, AWSError>;
  /**
   * This action returns details for a specified legal hold. The details are the body of a legal hold in JSON format, in addition to metadata.
   */
  getLegalHold(params: Backup.Types.GetLegalHoldInput, callback?: (err: AWSError, data: Backup.Types.GetLegalHoldOutput) => void): Request<Backup.Types.GetLegalHoldOutput, AWSError>;
  /**
   * This action returns details for a specified legal hold. The details are the body of a legal hold in JSON format, in addition to metadata.
   */
  getLegalHold(callback?: (err: AWSError, data: Backup.Types.GetLegalHoldOutput) => void): Request<Backup.Types.GetLegalHoldOutput, AWSError>;
  /**
   * Returns a set of metadata key-value pairs that were used to create the backup.
   */
  getRecoveryPointRestoreMetadata(params: Backup.Types.GetRecoveryPointRestoreMetadataInput, callback?: (err: AWSError, data: Backup.Types.GetRecoveryPointRestoreMetadataOutput) => void): Request<Backup.Types.GetRecoveryPointRestoreMetadataOutput, AWSError>;
  /**
   * Returns a set of metadata key-value pairs that were used to create the backup.
   */
  getRecoveryPointRestoreMetadata(callback?: (err: AWSError, data: Backup.Types.GetRecoveryPointRestoreMetadataOutput) => void): Request<Backup.Types.GetRecoveryPointRestoreMetadataOutput, AWSError>;
  /**
   * Returns the Amazon Web Services resource types supported by Backup.
   */
  getSupportedResourceTypes(callback?: (err: AWSError, data: Backup.Types.GetSupportedResourceTypesOutput) => void): Request<Backup.Types.GetSupportedResourceTypesOutput, AWSError>;
  /**
   * Returns a list of existing backup jobs for an authenticated account for the last 30 days. For a longer period of time, consider using these monitoring tools.
   */
  listBackupJobs(params: Backup.Types.ListBackupJobsInput, callback?: (err: AWSError, data: Backup.Types.ListBackupJobsOutput) => void): Request<Backup.Types.ListBackupJobsOutput, AWSError>;
  /**
   * Returns a list of existing backup jobs for an authenticated account for the last 30 days. For a longer period of time, consider using these monitoring tools.
   */
  listBackupJobs(callback?: (err: AWSError, data: Backup.Types.ListBackupJobsOutput) => void): Request<Backup.Types.ListBackupJobsOutput, AWSError>;
  /**
   * Returns metadata of your saved backup plan templates, including the template ID, name, and the creation and deletion dates.
   */
  listBackupPlanTemplates(params: Backup.Types.ListBackupPlanTemplatesInput, callback?: (err: AWSError, data: Backup.Types.ListBackupPlanTemplatesOutput) => void): Request<Backup.Types.ListBackupPlanTemplatesOutput, AWSError>;
  /**
   * Returns metadata of your saved backup plan templates, including the template ID, name, and the creation and deletion dates.
   */
  listBackupPlanTemplates(callback?: (err: AWSError, data: Backup.Types.ListBackupPlanTemplatesOutput) => void): Request<Backup.Types.ListBackupPlanTemplatesOutput, AWSError>;
  /**
   * Returns version metadata of your backup plans, including Amazon Resource Names (ARNs), backup plan IDs, creation and deletion dates, plan names, and version IDs.
   */
  listBackupPlanVersions(params: Backup.Types.ListBackupPlanVersionsInput, callback?: (err: AWSError, data: Backup.Types.ListBackupPlanVersionsOutput) => void): Request<Backup.Types.ListBackupPlanVersionsOutput, AWSError>;
  /**
   * Returns version metadata of your backup plans, including Amazon Resource Names (ARNs), backup plan IDs, creation and deletion dates, plan names, and version IDs.
   */
  listBackupPlanVersions(callback?: (err: AWSError, data: Backup.Types.ListBackupPlanVersionsOutput) => void): Request<Backup.Types.ListBackupPlanVersionsOutput, AWSError>;
  /**
   * Returns a list of all active backup plans for an authenticated account. The list contains information such as Amazon Resource Names (ARNs), plan IDs, creation and deletion dates, version IDs, plan names, and creator request IDs.
   */
  listBackupPlans(params: Backup.Types.ListBackupPlansInput, callback?: (err: AWSError, data: Backup.Types.ListBackupPlansOutput) => void): Request<Backup.Types.ListBackupPlansOutput, AWSError>;
  /**
   * Returns a list of all active backup plans for an authenticated account. The list contains information such as Amazon Resource Names (ARNs), plan IDs, creation and deletion dates, version IDs, plan names, and creator request IDs.
   */
  listBackupPlans(callback?: (err: AWSError, data: Backup.Types.ListBackupPlansOutput) => void): Request<Backup.Types.ListBackupPlansOutput, AWSError>;
  /**
   * Returns an array containing metadata of the resources associated with the target backup plan.
   */
  listBackupSelections(params: Backup.Types.ListBackupSelectionsInput, callback?: (err: AWSError, data: Backup.Types.ListBackupSelectionsOutput) => void): Request<Backup.Types.ListBackupSelectionsOutput, AWSError>;
  /**
   * Returns an array containing metadata of the resources associated with the target backup plan.
   */
  listBackupSelections(callback?: (err: AWSError, data: Backup.Types.ListBackupSelectionsOutput) => void): Request<Backup.Types.ListBackupSelectionsOutput, AWSError>;
  /**
   * Returns a list of recovery point storage containers along with information about them.
   */
  listBackupVaults(params: Backup.Types.ListBackupVaultsInput, callback?: (err: AWSError, data: Backup.Types.ListBackupVaultsOutput) => void): Request<Backup.Types.ListBackupVaultsOutput, AWSError>;
  /**
   * Returns a list of recovery point storage containers along with information about them.
   */
  listBackupVaults(callback?: (err: AWSError, data: Backup.Types.ListBackupVaultsOutput) => void): Request<Backup.Types.ListBackupVaultsOutput, AWSError>;
  /**
   * Returns metadata about your copy jobs.
   */
  listCopyJobs(params: Backup.Types.ListCopyJobsInput, callback?: (err: AWSError, data: Backup.Types.ListCopyJobsOutput) => void): Request<Backup.Types.ListCopyJobsOutput, AWSError>;
  /**
   * Returns metadata about your copy jobs.
   */
  listCopyJobs(callback?: (err: AWSError, data: Backup.Types.ListCopyJobsOutput) => void): Request<Backup.Types.ListCopyJobsOutput, AWSError>;
  /**
   * Returns a list of all frameworks for an Amazon Web Services account and Amazon Web Services Region.
   */
  listFrameworks(params: Backup.Types.ListFrameworksInput, callback?: (err: AWSError, data: Backup.Types.ListFrameworksOutput) => void): Request<Backup.Types.ListFrameworksOutput, AWSError>;
  /**
   * Returns a list of all frameworks for an Amazon Web Services account and Amazon Web Services Region.
   */
  listFrameworks(callback?: (err: AWSError, data: Backup.Types.ListFrameworksOutput) => void): Request<Backup.Types.ListFrameworksOutput, AWSError>;
  /**
   * This action returns metadata about active and previous legal holds.
   */
  listLegalHolds(params: Backup.Types.ListLegalHoldsInput, callback?: (err: AWSError, data: Backup.Types.ListLegalHoldsOutput) => void): Request<Backup.Types.ListLegalHoldsOutput, AWSError>;
  /**
   * This action returns metadata about active and previous legal holds.
   */
  listLegalHolds(callback?: (err: AWSError, data: Backup.Types.ListLegalHoldsOutput) => void): Request<Backup.Types.ListLegalHoldsOutput, AWSError>;
  /**
   * Returns an array of resources successfully backed up by Backup, including the time the resource was saved, an Amazon Resource Name (ARN) of the resource, and a resource type.
   */
  listProtectedResources(params: Backup.Types.ListProtectedResourcesInput, callback?: (err: AWSError, data: Backup.Types.ListProtectedResourcesOutput) => void): Request<Backup.Types.ListProtectedResourcesOutput, AWSError>;
  /**
   * Returns an array of resources successfully backed up by Backup, including the time the resource was saved, an Amazon Resource Name (ARN) of the resource, and a resource type.
   */
  listProtectedResources(callback?: (err: AWSError, data: Backup.Types.ListProtectedResourcesOutput) => void): Request<Backup.Types.ListProtectedResourcesOutput, AWSError>;
  /**
   * This request lists the protected resources corresponding to each backup vault.
   */
  listProtectedResourcesByBackupVault(params: Backup.Types.ListProtectedResourcesByBackupVaultInput, callback?: (err: AWSError, data: Backup.Types.ListProtectedResourcesByBackupVaultOutput) => void): Request<Backup.Types.ListProtectedResourcesByBackupVaultOutput, AWSError>;
  /**
   * This request lists the protected resources corresponding to each backup vault.
   */
  listProtectedResourcesByBackupVault(callback?: (err: AWSError, data: Backup.Types.ListProtectedResourcesByBackupVaultOutput) => void): Request<Backup.Types.ListProtectedResourcesByBackupVaultOutput, AWSError>;
  /**
   * Returns detailed information about the recovery points stored in a backup vault.
   */
  listRecoveryPointsByBackupVault(params: Backup.Types.ListRecoveryPointsByBackupVaultInput, callback?: (err: AWSError, data: Backup.Types.ListRecoveryPointsByBackupVaultOutput) => void): Request<Backup.Types.ListRecoveryPointsByBackupVaultOutput, AWSError>;
  /**
   * Returns detailed information about the recovery points stored in a backup vault.
   */
  listRecoveryPointsByBackupVault(callback?: (err: AWSError, data: Backup.Types.ListRecoveryPointsByBackupVaultOutput) => void): Request<Backup.Types.ListRecoveryPointsByBackupVaultOutput, AWSError>;
  /**
   * This action returns recovery point ARNs (Amazon Resource Names) of the specified legal hold.
   */
  listRecoveryPointsByLegalHold(params: Backup.Types.ListRecoveryPointsByLegalHoldInput, callback?: (err: AWSError, data: Backup.Types.ListRecoveryPointsByLegalHoldOutput) => void): Request<Backup.Types.ListRecoveryPointsByLegalHoldOutput, AWSError>;
  /**
   * This action returns recovery point ARNs (Amazon Resource Names) of the specified legal hold.
   */
  listRecoveryPointsByLegalHold(callback?: (err: AWSError, data: Backup.Types.ListRecoveryPointsByLegalHoldOutput) => void): Request<Backup.Types.ListRecoveryPointsByLegalHoldOutput, AWSError>;
  /**
   * Returns detailed information about all the recovery points of the type specified by a resource Amazon Resource Name (ARN).  For Amazon EFS and Amazon EC2, this action only lists recovery points created by Backup. 
   */
  listRecoveryPointsByResource(params: Backup.Types.ListRecoveryPointsByResourceInput, callback?: (err: AWSError, data: Backup.Types.ListRecoveryPointsByResourceOutput) => void): Request<Backup.Types.ListRecoveryPointsByResourceOutput, AWSError>;
  /**
   * Returns detailed information about all the recovery points of the type specified by a resource Amazon Resource Name (ARN).  For Amazon EFS and Amazon EC2, this action only lists recovery points created by Backup. 
   */
  listRecoveryPointsByResource(callback?: (err: AWSError, data: Backup.Types.ListRecoveryPointsByResourceOutput) => void): Request<Backup.Types.ListRecoveryPointsByResourceOutput, AWSError>;
  /**
   * Returns details about your report jobs.
   */
  listReportJobs(params: Backup.Types.ListReportJobsInput, callback?: (err: AWSError, data: Backup.Types.ListReportJobsOutput) => void): Request<Backup.Types.ListReportJobsOutput, AWSError>;
  /**
   * Returns details about your report jobs.
   */
  listReportJobs(callback?: (err: AWSError, data: Backup.Types.ListReportJobsOutput) => void): Request<Backup.Types.ListReportJobsOutput, AWSError>;
  /**
   * Returns a list of your report plans. For detailed information about a single report plan, use DescribeReportPlan.
   */
  listReportPlans(params: Backup.Types.ListReportPlansInput, callback?: (err: AWSError, data: Backup.Types.ListReportPlansOutput) => void): Request<Backup.Types.ListReportPlansOutput, AWSError>;
  /**
   * Returns a list of your report plans. For detailed information about a single report plan, use DescribeReportPlan.
   */
  listReportPlans(callback?: (err: AWSError, data: Backup.Types.ListReportPlansOutput) => void): Request<Backup.Types.ListReportPlansOutput, AWSError>;
  /**
   * Returns a list of jobs that Backup initiated to restore a saved resource, including details about the recovery process.
   */
  listRestoreJobs(params: Backup.Types.ListRestoreJobsInput, callback?: (err: AWSError, data: Backup.Types.ListRestoreJobsOutput) => void): Request<Backup.Types.ListRestoreJobsOutput, AWSError>;
  /**
   * Returns a list of jobs that Backup initiated to restore a saved resource, including details about the recovery process.
   */
  listRestoreJobs(callback?: (err: AWSError, data: Backup.Types.ListRestoreJobsOutput) => void): Request<Backup.Types.ListRestoreJobsOutput, AWSError>;
  /**
   * Returns a list of key-value pairs assigned to a target recovery point, backup plan, or backup vault.  ListTags only works for resource types that support full Backup management of their backups. Those resource types are listed in the "Full Backup management" section of the  Feature availability by resource table.
   */
  listTags(params: Backup.Types.ListTagsInput, callback?: (err: AWSError, data: Backup.Types.ListTagsOutput) => void): Request<Backup.Types.ListTagsOutput, AWSError>;
  /**
   * Returns a list of key-value pairs assigned to a target recovery point, backup plan, or backup vault.  ListTags only works for resource types that support full Backup management of their backups. Those resource types are listed in the "Full Backup management" section of the  Feature availability by resource table.
   */
  listTags(callback?: (err: AWSError, data: Backup.Types.ListTagsOutput) => void): Request<Backup.Types.ListTagsOutput, AWSError>;
  /**
   * Sets a resource-based policy that is used to manage access permissions on the target backup vault. Requires a backup vault name and an access policy document in JSON format.
   */
  putBackupVaultAccessPolicy(params: Backup.Types.PutBackupVaultAccessPolicyInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets a resource-based policy that is used to manage access permissions on the target backup vault. Requires a backup vault name and an access policy document in JSON format.
   */
  putBackupVaultAccessPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Applies Backup Vault Lock to a backup vault, preventing attempts to delete any recovery point stored in or created in a backup vault. Vault Lock also prevents attempts to update the lifecycle policy that controls the retention period of any recovery point currently stored in a backup vault. If specified, Vault Lock enforces a minimum and maximum retention period for future backup and copy jobs that target a backup vault.  Backup Vault Lock has been assessed by Cohasset Associates for use in environments that are subject to SEC 17a-4, CFTC, and FINRA regulations. For more information about how Backup Vault Lock relates to these regulations, see the Cohasset Associates Compliance Assessment.  
   */
  putBackupVaultLockConfiguration(params: Backup.Types.PutBackupVaultLockConfigurationInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Applies Backup Vault Lock to a backup vault, preventing attempts to delete any recovery point stored in or created in a backup vault. Vault Lock also prevents attempts to update the lifecycle policy that controls the retention period of any recovery point currently stored in a backup vault. If specified, Vault Lock enforces a minimum and maximum retention period for future backup and copy jobs that target a backup vault.  Backup Vault Lock has been assessed by Cohasset Associates for use in environments that are subject to SEC 17a-4, CFTC, and FINRA regulations. For more information about how Backup Vault Lock relates to these regulations, see the Cohasset Associates Compliance Assessment.  
   */
  putBackupVaultLockConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Turns on notifications on a backup vault for the specified topic and events.
   */
  putBackupVaultNotifications(params: Backup.Types.PutBackupVaultNotificationsInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Turns on notifications on a backup vault for the specified topic and events.
   */
  putBackupVaultNotifications(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Starts an on-demand backup job for the specified resource.
   */
  startBackupJob(params: Backup.Types.StartBackupJobInput, callback?: (err: AWSError, data: Backup.Types.StartBackupJobOutput) => void): Request<Backup.Types.StartBackupJobOutput, AWSError>;
  /**
   * Starts an on-demand backup job for the specified resource.
   */
  startBackupJob(callback?: (err: AWSError, data: Backup.Types.StartBackupJobOutput) => void): Request<Backup.Types.StartBackupJobOutput, AWSError>;
  /**
   * Starts a job to create a one-time copy of the specified resource. Does not support continuous backups.
   */
  startCopyJob(params: Backup.Types.StartCopyJobInput, callback?: (err: AWSError, data: Backup.Types.StartCopyJobOutput) => void): Request<Backup.Types.StartCopyJobOutput, AWSError>;
  /**
   * Starts a job to create a one-time copy of the specified resource. Does not support continuous backups.
   */
  startCopyJob(callback?: (err: AWSError, data: Backup.Types.StartCopyJobOutput) => void): Request<Backup.Types.StartCopyJobOutput, AWSError>;
  /**
   * Starts an on-demand report job for the specified report plan.
   */
  startReportJob(params: Backup.Types.StartReportJobInput, callback?: (err: AWSError, data: Backup.Types.StartReportJobOutput) => void): Request<Backup.Types.StartReportJobOutput, AWSError>;
  /**
   * Starts an on-demand report job for the specified report plan.
   */
  startReportJob(callback?: (err: AWSError, data: Backup.Types.StartReportJobOutput) => void): Request<Backup.Types.StartReportJobOutput, AWSError>;
  /**
   * Recovers the saved resource identified by an Amazon Resource Name (ARN).
   */
  startRestoreJob(params: Backup.Types.StartRestoreJobInput, callback?: (err: AWSError, data: Backup.Types.StartRestoreJobOutput) => void): Request<Backup.Types.StartRestoreJobOutput, AWSError>;
  /**
   * Recovers the saved resource identified by an Amazon Resource Name (ARN).
   */
  startRestoreJob(callback?: (err: AWSError, data: Backup.Types.StartRestoreJobOutput) => void): Request<Backup.Types.StartRestoreJobOutput, AWSError>;
  /**
   * Attempts to cancel a job to create a one-time backup of a resource. This action is not supported for the following services: Amazon FSx for Windows File Server, Amazon FSx for Lustre, FSx for ONTAP , Amazon FSx for OpenZFS, Amazon DocumentDB (with MongoDB compatibility), Amazon RDS, Amazon Aurora, and Amazon Neptune.
   */
  stopBackupJob(params: Backup.Types.StopBackupJobInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attempts to cancel a job to create a one-time backup of a resource. This action is not supported for the following services: Amazon FSx for Windows File Server, Amazon FSx for Lustre, FSx for ONTAP , Amazon FSx for OpenZFS, Amazon DocumentDB (with MongoDB compatibility), Amazon RDS, Amazon Aurora, and Amazon Neptune.
   */
  stopBackupJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Assigns a set of key-value pairs to a recovery point, backup plan, or backup vault identified by an Amazon Resource Name (ARN).
   */
  tagResource(params: Backup.Types.TagResourceInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Assigns a set of key-value pairs to a recovery point, backup plan, or backup vault identified by an Amazon Resource Name (ARN).
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a set of key-value pairs from a recovery point, backup plan, or backup vault identified by an Amazon Resource Name (ARN)
   */
  untagResource(params: Backup.Types.UntagResourceInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a set of key-value pairs from a recovery point, backup plan, or backup vault identified by an Amazon Resource Name (ARN)
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates an existing backup plan identified by its backupPlanId with the input document in JSON format. The new version is uniquely identified by a VersionId.
   */
  updateBackupPlan(params: Backup.Types.UpdateBackupPlanInput, callback?: (err: AWSError, data: Backup.Types.UpdateBackupPlanOutput) => void): Request<Backup.Types.UpdateBackupPlanOutput, AWSError>;
  /**
   * Updates an existing backup plan identified by its backupPlanId with the input document in JSON format. The new version is uniquely identified by a VersionId.
   */
  updateBackupPlan(callback?: (err: AWSError, data: Backup.Types.UpdateBackupPlanOutput) => void): Request<Backup.Types.UpdateBackupPlanOutput, AWSError>;
  /**
   * Updates an existing framework identified by its FrameworkName with the input document in JSON format.
   */
  updateFramework(params: Backup.Types.UpdateFrameworkInput, callback?: (err: AWSError, data: Backup.Types.UpdateFrameworkOutput) => void): Request<Backup.Types.UpdateFrameworkOutput, AWSError>;
  /**
   * Updates an existing framework identified by its FrameworkName with the input document in JSON format.
   */
  updateFramework(callback?: (err: AWSError, data: Backup.Types.UpdateFrameworkOutput) => void): Request<Backup.Types.UpdateFrameworkOutput, AWSError>;
  /**
   * Updates whether the Amazon Web Services account is opted in to cross-account backup. Returns an error if the account is not an Organizations management account. Use the DescribeGlobalSettings API to determine the current settings.
   */
  updateGlobalSettings(params: Backup.Types.UpdateGlobalSettingsInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates whether the Amazon Web Services account is opted in to cross-account backup. Returns an error if the account is not an Organizations management account. Use the DescribeGlobalSettings API to determine the current settings.
   */
  updateGlobalSettings(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the transition lifecycle of a recovery point. The lifecycle defines when a protected resource is transitioned to cold storage and when it expires. Backup transitions and expires backups automatically according to the lifecycle that you define. Backups transitioned to cold storage must be stored in cold storage for a minimum of 90 days. Therefore, the “retention” setting must be 90 days greater than the “transition to cold after days” setting. The “transition to cold after days” setting cannot be changed after a backup has been transitioned to cold. Resource types that are able to be transitioned to cold storage are listed in the "Lifecycle to cold storage" section of the  Feature availability by resource table. Backup ignores this expression for other resource types. This operation does not support continuous backups.
   */
  updateRecoveryPointLifecycle(params: Backup.Types.UpdateRecoveryPointLifecycleInput, callback?: (err: AWSError, data: Backup.Types.UpdateRecoveryPointLifecycleOutput) => void): Request<Backup.Types.UpdateRecoveryPointLifecycleOutput, AWSError>;
  /**
   * Sets the transition lifecycle of a recovery point. The lifecycle defines when a protected resource is transitioned to cold storage and when it expires. Backup transitions and expires backups automatically according to the lifecycle that you define. Backups transitioned to cold storage must be stored in cold storage for a minimum of 90 days. Therefore, the “retention” setting must be 90 days greater than the “transition to cold after days” setting. The “transition to cold after days” setting cannot be changed after a backup has been transitioned to cold. Resource types that are able to be transitioned to cold storage are listed in the "Lifecycle to cold storage" section of the  Feature availability by resource table. Backup ignores this expression for other resource types. This operation does not support continuous backups.
   */
  updateRecoveryPointLifecycle(callback?: (err: AWSError, data: Backup.Types.UpdateRecoveryPointLifecycleOutput) => void): Request<Backup.Types.UpdateRecoveryPointLifecycleOutput, AWSError>;
  /**
   * Updates the current service opt-in settings for the Region. If service-opt-in is enabled for a service, Backup tries to protect that service's resources in this Region, when the resource is included in an on-demand backup or scheduled backup plan. Otherwise, Backup does not try to protect that service's resources in this Region. Use the DescribeRegionSettings API to determine the resource types that are supported.
   */
  updateRegionSettings(params: Backup.Types.UpdateRegionSettingsInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the current service opt-in settings for the Region. If service-opt-in is enabled for a service, Backup tries to protect that service's resources in this Region, when the resource is included in an on-demand backup or scheduled backup plan. Otherwise, Backup does not try to protect that service's resources in this Region. Use the DescribeRegionSettings API to determine the resource types that are supported.
   */
  updateRegionSettings(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates an existing report plan identified by its ReportPlanName with the input document in JSON format.
   */
  updateReportPlan(params: Backup.Types.UpdateReportPlanInput, callback?: (err: AWSError, data: Backup.Types.UpdateReportPlanOutput) => void): Request<Backup.Types.UpdateReportPlanOutput, AWSError>;
  /**
   * Updates an existing report plan identified by its ReportPlanName with the input document in JSON format.
   */
  updateReportPlan(callback?: (err: AWSError, data: Backup.Types.UpdateReportPlanOutput) => void): Request<Backup.Types.UpdateReportPlanOutput, AWSError>;
}
declare namespace Backup {
  export type ARN = string;
  export type AccountId = string;
  export interface AdvancedBackupSetting {
    /**
     * Specifies an object containing resource type and backup options. The only supported resource type is Amazon EC2 instances with Windows Volume Shadow Copy Service (VSS). For a CloudFormation example, see the sample CloudFormation template to enable Windows VSS in the Backup User Guide. Valid values: EC2.
     */
    ResourceType?: ResourceType;
    /**
     * Specifies the backup option for a selected resource. This option is only available for Windows VSS backup jobs. Valid values:  Set to "WindowsVSS":"enabled" to enable the WindowsVSS backup option and create a Windows VSS backup.  Set to "WindowsVSS":"disabled" to create a regular backup. The WindowsVSS option is not enabled by default. If you specify an invalid option, you get an InvalidParameterValueException exception. For more information about Windows VSS backups, see Creating a VSS-Enabled Windows Backup.
     */
    BackupOptions?: BackupOptions;
  }
  export type AdvancedBackupSettings = AdvancedBackupSetting[];
  export interface BackupJob {
    /**
     * The account ID that owns the backup job.
     */
    AccountId?: AccountId;
    /**
     * Uniquely identifies a request to Backup to back up a resource.
     */
    BackupJobId?: string;
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName?: BackupVaultName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a backup vault; for example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.
     */
    BackupVaultArn?: ARN;
    /**
     * An ARN that uniquely identifies a recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    RecoveryPointArn?: ARN;
    /**
     * An ARN that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    ResourceArn?: ARN;
    /**
     * The date and time a backup job is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * The date and time a job to create a backup job is completed, in Unix format and Coordinated Universal Time (UTC). The value of CompletionDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CompletionDate?: timestamp;
    /**
     * The current state of a backup job.
     */
    State?: BackupJobState;
    /**
     * A detailed message explaining the status of the job to back up a resource.
     */
    StatusMessage?: string;
    /**
     * Contains an estimated percentage complete of a job at the time the job status was queried.
     */
    PercentDone?: string;
    /**
     * The size, in bytes, of a backup.
     */
    BackupSizeInBytes?: Long;
    /**
     * Specifies the IAM role ARN used to create the target recovery point. IAM roles other than the default role must include either AWSBackup or AwsBackup in the role name. For example, arn:aws:iam::123456789012:role/AWSBackupRDSAccess. Role names without those strings lack permissions to perform backup jobs.
     */
    IamRoleArn?: IAMRoleArn;
    /**
     * Contains identifying information about the creation of a backup job, including the BackupPlanArn, BackupPlanId, BackupPlanVersion, and BackupRuleId of the backup plan used to create it.
     */
    CreatedBy?: RecoveryPointCreator;
    /**
     * The date and time a job to back up resources is expected to be completed, in Unix format and Coordinated Universal Time (UTC). The value of ExpectedCompletionDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    ExpectedCompletionDate?: timestamp;
    /**
     * Specifies the time in Unix format and Coordinated Universal Time (UTC) when a backup job must be started before it is canceled. The value is calculated by adding the start window to the scheduled time. So if the scheduled time were 6:00 PM and the start window is 2 hours, the StartBy time would be 8:00 PM on the date specified. The value of StartBy is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    StartBy?: timestamp;
    /**
     * The type of Amazon Web Services resource to be backed up; for example, an Amazon Elastic Block Store (Amazon EBS) volume or an Amazon Relational Database Service (Amazon RDS) database. For Windows Volume Shadow Copy Service (VSS) backups, the only supported resource type is Amazon EC2.
     */
    ResourceType?: ResourceType;
    /**
     * The size in bytes transferred to a backup vault at the time that the job status was queried.
     */
    BytesTransferred?: Long;
    /**
     * Specifies the backup option for a selected resource. This option is only available for Windows Volume Shadow Copy Service (VSS) backup jobs. Valid values: Set to "WindowsVSS":"enabled" to enable the WindowsVSS backup option and create a Windows VSS backup. Set to "WindowsVSS":"disabled" to create a regular backup. If you specify an invalid option, you get an InvalidParameterValueException exception.
     */
    BackupOptions?: BackupOptions;
    /**
     * Represents the type of backup for a backup job.
     */
    BackupType?: string;
    /**
     * This uniquely identifies a request to Backup to back up a resource. The return will be the parent (composite) job ID.
     */
    ParentJobId?: string;
    /**
     * This is a boolean value indicating this is a parent (composite) backup job.
     */
    IsParent?: boolean;
    /**
     * This is the non-unique name of the resource that belongs to the specified backup.
     */
    ResourceName?: string;
  }
  export type BackupJobChildJobsInState = {[key: string]: Long};
  export type BackupJobState = "CREATED"|"PENDING"|"RUNNING"|"ABORTING"|"ABORTED"|"COMPLETED"|"FAILED"|"EXPIRED"|"PARTIAL"|string;
  export type BackupJobsList = BackupJob[];
  export type BackupOptionKey = string;
  export type BackupOptionValue = string;
  export type BackupOptions = {[key: string]: BackupOptionValue};
  export interface BackupPlan {
    /**
     * The display name of a backup plan. Must contain 1 to 50 alphanumeric or '-_.' characters.
     */
    BackupPlanName: BackupPlanName;
    /**
     * An array of BackupRule objects, each of which specifies a scheduled task that is used to back up a selection of resources. 
     */
    Rules: BackupRules;
    /**
     * Contains a list of BackupOptions for each resource type.
     */
    AdvancedBackupSettings?: AdvancedBackupSettings;
  }
  export interface BackupPlanInput {
    /**
     * The display name of a backup plan. Must contain 1 to 50 alphanumeric or '-_.' characters.
     */
    BackupPlanName: BackupPlanName;
    /**
     * An array of BackupRule objects, each of which specifies a scheduled task that is used to back up a selection of resources.
     */
    Rules: BackupRulesInput;
    /**
     * Specifies a list of BackupOptions for each resource type. These settings are only available for Windows Volume Shadow Copy Service (VSS) backup jobs.
     */
    AdvancedBackupSettings?: AdvancedBackupSettings;
  }
  export type BackupPlanName = string;
  export type BackupPlanTemplatesList = BackupPlanTemplatesListMember[];
  export interface BackupPlanTemplatesListMember {
    /**
     * Uniquely identifies a stored backup plan template.
     */
    BackupPlanTemplateId?: string;
    /**
     * The optional display name of a backup plan template.
     */
    BackupPlanTemplateName?: string;
  }
  export type BackupPlanVersionsList = BackupPlansListMember[];
  export type BackupPlansList = BackupPlansListMember[];
  export interface BackupPlansListMember {
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a backup plan; for example, arn:aws:backup:us-east-1:123456789012:plan:8F81F553-3A74-4A3F-B93D-B3360DC80C50.
     */
    BackupPlanArn?: ARN;
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId?: string;
    /**
     * The date and time a resource backup plan is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * The date and time a backup plan is deleted, in Unix format and Coordinated Universal Time (UTC). The value of DeletionDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    DeletionDate?: timestamp;
    /**
     * Unique, randomly generated, Unicode, UTF-8 encoded strings that are at most 1,024 bytes long. Version IDs cannot be edited.
     */
    VersionId?: string;
    /**
     * The display name of a saved backup plan.
     */
    BackupPlanName?: BackupPlanName;
    /**
     * A unique string that identifies the request and allows failed requests to be retried without the risk of running the operation twice. This parameter is optional. If used, this parameter must contain 1 to 50 alphanumeric or '-_.' characters.
     */
    CreatorRequestId?: string;
    /**
     * The last time a job to back up resources was run with this rule. A date and time, in Unix format and Coordinated Universal Time (UTC). The value of LastExecutionDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    LastExecutionDate?: timestamp;
    /**
     * Contains a list of BackupOptions for a resource type.
     */
    AdvancedBackupSettings?: AdvancedBackupSettings;
  }
  export interface BackupRule {
    /**
     * A display name for a backup rule. Must contain 1 to 50 alphanumeric or '-_.' characters.
     */
    RuleName: BackupRuleName;
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    TargetBackupVaultName: BackupVaultName;
    /**
     * A cron expression in UTC specifying when Backup initiates a backup job. For more information about Amazon Web Services cron expressions, see Schedule Expressions for Rules in the Amazon CloudWatch Events User Guide.. Two examples of Amazon Web Services cron expressions are  15 * ? * * * (take a backup every hour at 15 minutes past the hour) and 0 12 * * ? * (take a backup every day at 12 noon UTC). For a table of examples, click the preceding link and scroll down the page.
     */
    ScheduleExpression?: CronExpression;
    /**
     * A value in minutes after a backup is scheduled before a job will be canceled if it doesn't start successfully. This value is optional. If this value is included, it must be at least 60 minutes to avoid errors. During the start window, the backup job status remains in CREATED status until it has successfully begun or until the start window time has run out. If within the start window time Backup receives an error that allows the job to be retried, Backup will automatically retry to begin the job at least every 10 minutes until the backup successfully begins (the job status changes to RUNNING) or until the job status changes to EXPIRED (which is expected to occur when the start window time is over).
     */
    StartWindowMinutes?: WindowMinutes;
    /**
     * A value in minutes after a backup job is successfully started before it must be completed or it will be canceled by Backup. This value is optional.
     */
    CompletionWindowMinutes?: WindowMinutes;
    /**
     * The lifecycle defines when a protected resource is transitioned to cold storage and when it expires. Backup transitions and expires backups automatically according to the lifecycle that you define.  Backups transitioned to cold storage must be stored in cold storage for a minimum of 90 days. Therefore, the “retention” setting must be 90 days greater than the “transition to cold after days” setting. The “transition to cold after days” setting cannot be changed after a backup has been transitioned to cold.  Resource types that are able to be transitioned to cold storage are listed in the "Lifecycle to cold storage" section of the  Feature availability by resource table. Backup ignores this expression for other resource types.
     */
    Lifecycle?: Lifecycle;
    /**
     * An array of key-value pair strings that are assigned to resources that are associated with this rule when restored from backup.
     */
    RecoveryPointTags?: Tags;
    /**
     * Uniquely identifies a rule that is used to schedule the backup of a selection of resources.
     */
    RuleId?: string;
    /**
     * An array of CopyAction objects, which contains the details of the copy operation.
     */
    CopyActions?: CopyActions;
    /**
     * Specifies whether Backup creates continuous backups. True causes Backup to create continuous backups capable of point-in-time restore (PITR). False (or not specified) causes Backup to create snapshot backups.
     */
    EnableContinuousBackup?: Boolean;
    /**
     * This is the timezone in which the schedule expression is set. By default, ScheduleExpressions are in UTC. You can modify this to a specified timezone.
     */
    ScheduleExpressionTimezone?: Timezone;
  }
  export interface BackupRuleInput {
    /**
     * A display name for a backup rule. Must contain 1 to 50 alphanumeric or '-_.' characters.
     */
    RuleName: BackupRuleName;
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    TargetBackupVaultName: BackupVaultName;
    /**
     * A CRON expression in UTC specifying when Backup initiates a backup job.
     */
    ScheduleExpression?: CronExpression;
    /**
     * A value in minutes after a backup is scheduled before a job will be canceled if it doesn't start successfully. This value is optional. If this value is included, it must be at least 60 minutes to avoid errors. This parameter has a maximum value of 100 years (52,560,000 minutes). During the start window, the backup job status remains in CREATED status until it has successfully begun or until the start window time has run out. If within the start window time Backup receives an error that allows the job to be retried, Backup will automatically retry to begin the job at least every 10 minutes until the backup successfully begins (the job status changes to RUNNING) or until the job status changes to EXPIRED (which is expected to occur when the start window time is over).
     */
    StartWindowMinutes?: WindowMinutes;
    /**
     * A value in minutes after a backup job is successfully started before it must be completed or it will be canceled by Backup. This value is optional.
     */
    CompletionWindowMinutes?: WindowMinutes;
    /**
     * The lifecycle defines when a protected resource is transitioned to cold storage and when it expires. Backup will transition and expire backups automatically according to the lifecycle that you define.  Backups transitioned to cold storage must be stored in cold storage for a minimum of 90 days. Therefore, the “retention” setting must be 90 days greater than the “transition to cold after days” setting. The “transition to cold after days” setting cannot be changed after a backup has been transitioned to cold. Resource types that are able to be transitioned to cold storage are listed in the "Lifecycle to cold storage" section of the  Feature availability by resource table. Backup ignores this expression for other resource types. This parameter has a maximum value of 100 years (36,500 days).
     */
    Lifecycle?: Lifecycle;
    /**
     * To help organize your resources, you can assign your own metadata to the resources that you create. Each tag is a key-value pair.
     */
    RecoveryPointTags?: Tags;
    /**
     * An array of CopyAction objects, which contains the details of the copy operation.
     */
    CopyActions?: CopyActions;
    /**
     * Specifies whether Backup creates continuous backups. True causes Backup to create continuous backups capable of point-in-time restore (PITR). False (or not specified) causes Backup to create snapshot backups.
     */
    EnableContinuousBackup?: Boolean;
    /**
     * This is the timezone in which the schedule expression is set. By default, ScheduleExpressions are in UTC. You can modify this to a specified timezone.
     */
    ScheduleExpressionTimezone?: Timezone;
  }
  export type BackupRuleName = string;
  export type BackupRules = BackupRule[];
  export type BackupRulesInput = BackupRuleInput[];
  export interface BackupSelection {
    /**
     * The display name of a resource selection document. Must contain 1 to 50 alphanumeric or '-_.' characters.
     */
    SelectionName: BackupSelectionName;
    /**
     * The ARN of the IAM role that Backup uses to authenticate when backing up the target resource; for example, arn:aws:iam::123456789012:role/S3Access.
     */
    IamRoleArn: IAMRoleArn;
    /**
     * A list of Amazon Resource Names (ARNs) to assign to a backup plan. The maximum number of ARNs is 500 without wildcards, or 30 ARNs with wildcards. If you need to assign many resources to a backup plan, consider a different resource selection strategy, such as assigning all resources of a resource type or refining your resource selection using tags.
     */
    Resources?: ResourceArns;
    /**
     * A list of conditions that you define to assign resources to your backup plans using tags. For example, "StringEquals": { "ConditionKey": "aws:ResourceTag/CreatedByCryo", "ConditionValue": "true" },. Condition operators are case sensitive.  ListOfTags differs from Conditions as follows:   When you specify more than one condition, you assign all resources that match AT LEAST ONE condition (using OR logic).    ListOfTags only supports StringEquals. Conditions supports StringEquals, StringLike, StringNotEquals, and StringNotLike.   
     */
    ListOfTags?: ListOfTags;
    /**
     * A list of Amazon Resource Names (ARNs) to exclude from a backup plan. The maximum number of ARNs is 500 without wildcards, or 30 ARNs with wildcards. If you need to exclude many resources from a backup plan, consider a different resource selection strategy, such as assigning only one or a few resource types or refining your resource selection using tags.
     */
    NotResources?: ResourceArns;
    /**
     * A list of conditions that you define to assign resources to your backup plans using tags. For example, "StringEquals": { "ConditionKey": "aws:ResourceTag/CreatedByCryo", "ConditionValue": "true" },. Condition operators are case sensitive.  Conditions differs from ListOfTags as follows:   When you specify more than one condition, you only assign the resources that match ALL conditions (using AND logic).    Conditions supports StringEquals, StringLike, StringNotEquals, and StringNotLike. ListOfTags only supports StringEquals.  
     */
    Conditions?: Conditions;
  }
  export type BackupSelectionName = string;
  export type BackupSelectionsList = BackupSelectionsListMember[];
  export interface BackupSelectionsListMember {
    /**
     * Uniquely identifies a request to assign a set of resources to a backup plan.
     */
    SelectionId?: string;
    /**
     * The display name of a resource selection document.
     */
    SelectionName?: BackupSelectionName;
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId?: string;
    /**
     * The date and time a backup plan is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * A unique string that identifies the request and allows failed requests to be retried without the risk of running the operation twice. This parameter is optional. If used, this parameter must contain 1 to 50 alphanumeric or '-_.' characters.
     */
    CreatorRequestId?: string;
    /**
     * Specifies the IAM role Amazon Resource Name (ARN) to create the target recovery point; for example, arn:aws:iam::123456789012:role/S3Access.
     */
    IamRoleArn?: IAMRoleArn;
  }
  export type BackupVaultEvent = "BACKUP_JOB_STARTED"|"BACKUP_JOB_COMPLETED"|"BACKUP_JOB_SUCCESSFUL"|"BACKUP_JOB_FAILED"|"BACKUP_JOB_EXPIRED"|"RESTORE_JOB_STARTED"|"RESTORE_JOB_COMPLETED"|"RESTORE_JOB_SUCCESSFUL"|"RESTORE_JOB_FAILED"|"COPY_JOB_STARTED"|"COPY_JOB_SUCCESSFUL"|"COPY_JOB_FAILED"|"RECOVERY_POINT_MODIFIED"|"BACKUP_PLAN_CREATED"|"BACKUP_PLAN_MODIFIED"|"S3_BACKUP_OBJECT_FAILED"|"S3_RESTORE_OBJECT_FAILED"|string;
  export type BackupVaultEvents = BackupVaultEvent[];
  export type BackupVaultList = BackupVaultListMember[];
  export interface BackupVaultListMember {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName?: BackupVaultName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a backup vault; for example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.
     */
    BackupVaultArn?: ARN;
    /**
     * The date and time a resource backup is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * A server-side encryption key you can specify to encrypt your backups from services that support full Backup management; for example, arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab. If you specify a key, you must specify its ARN, not its alias. If you do not specify a key, Backup creates a KMS key for you by default. To learn which Backup services support full Backup management and how Backup handles encryption for backups from services that do not yet support full Backup, see  Encryption for backups in Backup 
     */
    EncryptionKeyArn?: ARN;
    /**
     * A unique string that identifies the request and allows failed requests to be retried without the risk of running the operation twice. This parameter is optional. If used, this parameter must contain 1 to 50 alphanumeric or '-_.' characters.
     */
    CreatorRequestId?: string;
    /**
     * The number of recovery points that are stored in a backup vault.
     */
    NumberOfRecoveryPoints?: long;
    /**
     * A Boolean value that indicates whether Backup Vault Lock applies to the selected backup vault. If true, Vault Lock prevents delete and update operations on the recovery points in the selected vault.
     */
    Locked?: Boolean;
    /**
     * The Backup Vault Lock setting that specifies the minimum retention period that the vault retains its recovery points. If this parameter is not specified, Vault Lock does not enforce a minimum retention period. If specified, any backup or copy job to the vault must have a lifecycle policy with a retention period equal to or longer than the minimum retention period. If the job's retention period is shorter than that minimum retention period, then the vault fails the backup or copy job, and you should either modify your lifecycle settings or use a different vault. Recovery points already stored in the vault prior to Vault Lock are not affected.
     */
    MinRetentionDays?: Long;
    /**
     * The Backup Vault Lock setting that specifies the maximum retention period that the vault retains its recovery points. If this parameter is not specified, Vault Lock does not enforce a maximum retention period on the recovery points in the vault (allowing indefinite storage). If specified, any backup or copy job to the vault must have a lifecycle policy with a retention period equal to or shorter than the maximum retention period. If the job's retention period is longer than that maximum retention period, then the vault fails the backup or copy job, and you should either modify your lifecycle settings or use a different vault. Recovery points already stored in the vault prior to Vault Lock are not affected.
     */
    MaxRetentionDays?: Long;
    /**
     * The date and time when Backup Vault Lock configuration becomes immutable, meaning it cannot be changed or deleted. If you applied Vault Lock to your vault without specifying a lock date, you can change your Vault Lock settings, or delete Vault Lock from the vault entirely, at any time. This value is in Unix format, Coordinated Universal Time (UTC), and accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    LockDate?: timestamp;
  }
  export type BackupVaultName = string;
  export type Boolean = boolean;
  export interface CalculatedLifecycle {
    /**
     * A timestamp that specifies when to transition a recovery point to cold storage.
     */
    MoveToColdStorageAt?: timestamp;
    /**
     * A timestamp that specifies when to delete a recovery point.
     */
    DeleteAt?: timestamp;
  }
  export interface CancelLegalHoldInput {
    /**
     * Legal hold ID required to remove the specified legal hold on a recovery point.
     */
    LegalHoldId: string;
    /**
     * String describing the reason for removing the legal hold.
     */
    CancelDescription: string;
    /**
     * The integer amount in days specifying amount of days after this API operation to remove legal hold.
     */
    RetainRecordInDays?: Long;
  }
  export interface CancelLegalHoldOutput {
  }
  export type ComplianceResourceIdList = string[];
  export interface Condition {
    /**
     * An operation applied to a key-value pair used to assign resources to your backup plan. Condition only supports StringEquals. For more flexible assignment options, including StringLike and the ability to exclude resources from your backup plan, use Conditions (with an "s" on the end) for your  BackupSelection .
     */
    ConditionType: ConditionType;
    /**
     * The key in a key-value pair. For example, in the tag Department: Accounting, Department is the key.
     */
    ConditionKey: ConditionKey;
    /**
     * The value in a key-value pair. For example, in the tag Department: Accounting, Accounting is the value.
     */
    ConditionValue: ConditionValue;
  }
  export type ConditionKey = string;
  export interface ConditionParameter {
    /**
     * The key in a key-value pair. For example, in the tag Department: Accounting, Department is the key.
     */
    ConditionKey?: ConditionKey;
    /**
     * The value in a key-value pair. For example, in the tag Department: Accounting, Accounting is the value.
     */
    ConditionValue?: ConditionValue;
  }
  export type ConditionParameters = ConditionParameter[];
  export type ConditionType = "STRINGEQUALS"|string;
  export type ConditionValue = string;
  export interface Conditions {
    /**
     * Filters the values of your tagged resources for only those resources that you tagged with the same value. Also called "exact matching."
     */
    StringEquals?: ConditionParameters;
    /**
     * Filters the values of your tagged resources for only those resources that you tagged that do not have the same value. Also called "negated matching."
     */
    StringNotEquals?: ConditionParameters;
    /**
     * Filters the values of your tagged resources for matching tag values with the use of a wildcard character (*) anywhere in the string. For example, "prod*" or "*rod*" matches the tag value "production".
     */
    StringLike?: ConditionParameters;
    /**
     * Filters the values of your tagged resources for non-matching tag values with the use of a wildcard character (*) anywhere in the string.
     */
    StringNotLike?: ConditionParameters;
  }
  export interface ControlInputParameter {
    /**
     * The name of a parameter, for example, BackupPlanFrequency.
     */
    ParameterName?: ParameterName;
    /**
     * The value of parameter, for example, hourly.
     */
    ParameterValue?: ParameterValue;
  }
  export type ControlInputParameters = ControlInputParameter[];
  export type ControlName = string;
  export interface ControlScope {
    /**
     * The ID of the only Amazon Web Services resource that you want your control scope to contain.
     */
    ComplianceResourceIds?: ComplianceResourceIdList;
    /**
     * Describes whether the control scope includes one or more types of resources, such as EFS or RDS.
     */
    ComplianceResourceTypes?: ResourceTypeList;
    /**
     * The tag key-value pair applied to those Amazon Web Services resources that you want to trigger an evaluation for a rule. A maximum of one key-value pair can be provided. The tag value is optional, but it cannot be an empty string. The structure to assign a tag is: [{"Key":"string","Value":"string"}].
     */
    Tags?: stringMap;
  }
  export interface CopyAction {
    Lifecycle?: Lifecycle;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies the destination backup vault for the copied backup. For example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.
     */
    DestinationBackupVaultArn: ARN;
  }
  export type CopyActions = CopyAction[];
  export interface CopyJob {
    /**
     * The account ID that owns the copy job.
     */
    AccountId?: AccountId;
    /**
     * Uniquely identifies a copy job.
     */
    CopyJobId?: string;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a source copy vault; for example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault. 
     */
    SourceBackupVaultArn?: ARN;
    /**
     * An ARN that uniquely identifies a source recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    SourceRecoveryPointArn?: ARN;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a destination copy vault; for example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.
     */
    DestinationBackupVaultArn?: ARN;
    /**
     * An ARN that uniquely identifies a destination recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    DestinationRecoveryPointArn?: ARN;
    /**
     * The Amazon Web Services resource to be copied; for example, an Amazon Elastic Block Store (Amazon EBS) volume or an Amazon Relational Database Service (Amazon RDS) database.
     */
    ResourceArn?: ARN;
    /**
     * The date and time a copy job is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * The date and time a copy job is completed, in Unix format and Coordinated Universal Time (UTC). The value of CompletionDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CompletionDate?: timestamp;
    /**
     * The current state of a copy job.
     */
    State?: CopyJobState;
    /**
     * A detailed message explaining the status of the job to copy a resource.
     */
    StatusMessage?: string;
    /**
     * The size, in bytes, of a copy job.
     */
    BackupSizeInBytes?: Long;
    /**
     * Specifies the IAM role ARN used to copy the target recovery point; for example, arn:aws:iam::123456789012:role/S3Access.
     */
    IamRoleArn?: IAMRoleArn;
    CreatedBy?: RecoveryPointCreator;
    /**
     * The type of Amazon Web Services resource to be copied; for example, an Amazon Elastic Block Store (Amazon EBS) volume or an Amazon Relational Database Service (Amazon RDS) database.
     */
    ResourceType?: ResourceType;
    /**
     * This uniquely identifies a request to Backup to copy a resource. The return will be the parent (composite) job ID.
     */
    ParentJobId?: string;
    /**
     * This is a boolean value indicating this is a parent (composite) copy job.
     */
    IsParent?: boolean;
    /**
     * This is the identifier of a resource within a composite group, such as nested (child) recovery point belonging to a composite (parent) stack. The ID is transferred from the  logical ID within a stack.
     */
    CompositeMemberIdentifier?: string;
    /**
     * This is the number of child (nested) copy jobs.
     */
    NumberOfChildJobs?: Long;
    /**
     * This returns the statistics of the included child (nested) copy jobs.
     */
    ChildJobsInState?: CopyJobChildJobsInState;
    /**
     * This is the non-unique name of the resource that belongs to the specified backup.
     */
    ResourceName?: string;
  }
  export type CopyJobChildJobsInState = {[key: string]: Long};
  export type CopyJobState = "CREATED"|"RUNNING"|"COMPLETED"|"FAILED"|"PARTIAL"|string;
  export type CopyJobsList = CopyJob[];
  export interface CreateBackupPlanInput {
    /**
     * Specifies the body of a backup plan. Includes a BackupPlanName and one or more sets of Rules.
     */
    BackupPlan: BackupPlanInput;
    /**
     * To help organize your resources, you can assign your own metadata to the resources that you create. Each tag is a key-value pair. The specified tags are assigned to all backups created with this plan.
     */
    BackupPlanTags?: Tags;
    /**
     * Identifies the request and allows failed requests to be retried without the risk of running the operation twice. If the request includes a CreatorRequestId that matches an existing backup plan, that plan is returned. This parameter is optional. If used, this parameter must contain 1 to 50 alphanumeric or '-_.' characters.
     */
    CreatorRequestId?: string;
  }
  export interface CreateBackupPlanOutput {
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId?: string;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a backup plan; for example, arn:aws:backup:us-east-1:123456789012:plan:8F81F553-3A74-4A3F-B93D-B3360DC80C50.
     */
    BackupPlanArn?: ARN;
    /**
     * The date and time that a backup plan is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * Unique, randomly generated, Unicode, UTF-8 encoded strings that are at most 1,024 bytes long. They cannot be edited.
     */
    VersionId?: string;
    /**
     * A list of BackupOptions settings for a resource type. This option is only available for Windows Volume Shadow Copy Service (VSS) backup jobs.
     */
    AdvancedBackupSettings?: AdvancedBackupSettings;
  }
  export interface CreateBackupSelectionInput {
    /**
     * Uniquely identifies the backup plan to be associated with the selection of resources.
     */
    BackupPlanId: string;
    /**
     * Specifies the body of a request to assign a set of resources to a backup plan.
     */
    BackupSelection: BackupSelection;
    /**
     * A unique string that identifies the request and allows failed requests to be retried without the risk of running the operation twice. This parameter is optional. If used, this parameter must contain 1 to 50 alphanumeric or '-_.' characters.
     */
    CreatorRequestId?: string;
  }
  export interface CreateBackupSelectionOutput {
    /**
     * Uniquely identifies the body of a request to assign a set of resources to a backup plan.
     */
    SelectionId?: string;
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId?: string;
    /**
     * The date and time a backup selection is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
  }
  export interface CreateBackupVaultInput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of letters, numbers, and hyphens.
     */
    BackupVaultName: BackupVaultName;
    /**
     * Metadata that you can assign to help organize the resources that you create. Each tag is a key-value pair.
     */
    BackupVaultTags?: Tags;
    /**
     * The server-side encryption key that is used to protect your backups; for example, arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab.
     */
    EncryptionKeyArn?: ARN;
    /**
     * A unique string that identifies the request and allows failed requests to be retried without the risk of running the operation twice. This parameter is optional. If used, this parameter must contain 1 to 50 alphanumeric or '-_.' characters.
     */
    CreatorRequestId?: string;
  }
  export interface CreateBackupVaultOutput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName?: BackupVaultName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a backup vault; for example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.
     */
    BackupVaultArn?: ARN;
    /**
     * The date and time a backup vault is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
  }
  export interface CreateFrameworkInput {
    /**
     * The unique name of the framework. The name must be between 1 and 256 characters, starting with a letter, and consisting of letters (a-z, A-Z), numbers (0-9), and underscores (_).
     */
    FrameworkName: FrameworkName;
    /**
     * An optional description of the framework with a maximum of 1,024 characters.
     */
    FrameworkDescription?: FrameworkDescription;
    /**
     * A list of the controls that make up the framework. Each control in the list has a name, input parameters, and scope.
     */
    FrameworkControls: FrameworkControls;
    /**
     * A customer-chosen string that you can use to distinguish between otherwise identical calls to CreateFrameworkInput. Retrying a successful request with the same idempotency token results in a success message with no action taken.
     */
    IdempotencyToken?: string;
    /**
     * Metadata that you can assign to help organize the frameworks that you create. Each tag is a key-value pair.
     */
    FrameworkTags?: stringMap;
  }
  export interface CreateFrameworkOutput {
    /**
     * The unique name of the framework. The name must be between 1 and 256 characters, starting with a letter, and consisting of letters (a-z, A-Z), numbers (0-9), and underscores (_).
     */
    FrameworkName?: FrameworkName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    FrameworkArn?: ARN;
  }
  export interface CreateLegalHoldInput {
    /**
     * This is the string title of the legal hold.
     */
    Title: string;
    /**
     * This is the string description of the legal hold.
     */
    Description: string;
    /**
     * This is a user-chosen string used to distinguish between otherwise identical calls. Retrying a successful request with the same idempotency token results in a success message with no action taken.
     */
    IdempotencyToken?: string;
    /**
     * This specifies criteria to assign a set of resources, such as resource types or backup vaults.
     */
    RecoveryPointSelection?: RecoveryPointSelection;
    /**
     * Optional tags to include. A tag is a key-value pair you can use to manage, filter, and search for your resources. Allowed characters include UTF-8 letters, numbers, spaces, and the following characters: + - = . _ : /. 
     */
    Tags?: Tags;
  }
  export interface CreateLegalHoldOutput {
    /**
     * This is the string title of the legal hold returned after creating the legal hold.
     */
    Title?: string;
    /**
     * This displays the status of the legal hold returned after creating the legal hold. Statuses can be ACTIVE, PENDING, CANCELED, CANCELING, or FAILED.
     */
    Status?: LegalHoldStatus;
    /**
     * This is the returned string description of the legal hold.
     */
    Description?: string;
    /**
     * Legal hold ID returned for the specified legal hold on a recovery point.
     */
    LegalHoldId?: string;
    /**
     * This is the ARN (Amazon Resource Number) of the created legal hold.
     */
    LegalHoldArn?: ARN;
    /**
     * Time in number format when legal hold was created.
     */
    CreationDate?: timestamp;
    /**
     * This specifies criteria to assign a set of resources, such as resource types or backup vaults.
     */
    RecoveryPointSelection?: RecoveryPointSelection;
  }
  export interface CreateLogicallyAirGappedBackupVaultInput {
    /**
     * This is the name of the vault that is being created.
     */
    BackupVaultName: BackupVaultName;
    /**
     * These are the tags that will be included in the newly-created vault.
     */
    BackupVaultTags?: Tags;
    /**
     * This is the ID of the creation request.
     */
    CreatorRequestId?: string;
    /**
     * This setting specifies the minimum retention period that the vault retains its recovery points. If this parameter is not specified, no minimum retention period is enforced. If specified, any backup or copy job to the vault must have a lifecycle policy with a retention period equal to or longer than the minimum retention period. If a job retention period is shorter than that minimum retention period, then the vault fails the backup or copy job, and you should either modify your lifecycle settings or use a different vault.
     */
    MinRetentionDays: Long;
    /**
     * This is the setting that specifies the maximum retention period that the vault retains its recovery points. If this parameter is not specified, Backup does not enforce a maximum retention period on the recovery points in the vault (allowing indefinite storage). If specified, any backup or copy job to the vault must have a lifecycle policy with a retention period equal to or shorter than the maximum retention period. If the job retention period is longer than that maximum retention period, then the vault fails the backup or copy job, and you should either modify your lifecycle settings or use a different vault.
     */
    MaxRetentionDays: Long;
  }
  export interface CreateLogicallyAirGappedBackupVaultOutput {
    /**
     * The name of a logical container where backups are stored. Logically air-gapped backup vaults are identified by names that are unique to the account used to create them and the Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName?: BackupVaultName;
    /**
     * This is the ARN (Amazon Resource Name) of the vault being created.
     */
    BackupVaultArn?: ARN;
    /**
     * The date and time when the vault was created. This value is in Unix format, Coordinated Universal Time (UTC), and accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * This is the current state of the vault.
     */
    VaultState?: VaultState;
  }
  export interface CreateReportPlanInput {
    /**
     * The unique name of the report plan. The name must be between 1 and 256 characters, starting with a letter, and consisting of letters (a-z, A-Z), numbers (0-9), and underscores (_).
     */
    ReportPlanName: ReportPlanName;
    /**
     * An optional description of the report plan with a maximum of 1,024 characters.
     */
    ReportPlanDescription?: ReportPlanDescription;
    /**
     * A structure that contains information about where and how to deliver your reports, specifically your Amazon S3 bucket name, S3 key prefix, and the formats of your reports.
     */
    ReportDeliveryChannel: ReportDeliveryChannel;
    /**
     * Identifies the report template for the report. Reports are built using a report template. The report templates are:  RESOURCE_COMPLIANCE_REPORT | CONTROL_COMPLIANCE_REPORT | BACKUP_JOB_REPORT | COPY_JOB_REPORT | RESTORE_JOB_REPORT  If the report template is RESOURCE_COMPLIANCE_REPORT or CONTROL_COMPLIANCE_REPORT, this API resource also describes the report coverage by Amazon Web Services Regions and frameworks.
     */
    ReportSetting: ReportSetting;
    /**
     * Metadata that you can assign to help organize the report plans that you create. Each tag is a key-value pair.
     */
    ReportPlanTags?: stringMap;
    /**
     * A customer-chosen string that you can use to distinguish between otherwise identical calls to CreateReportPlanInput. Retrying a successful request with the same idempotency token results in a success message with no action taken.
     */
    IdempotencyToken?: string;
  }
  export interface CreateReportPlanOutput {
    /**
     * The unique name of the report plan.
     */
    ReportPlanName?: ReportPlanName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    ReportPlanArn?: ARN;
    /**
     * The date and time a backup vault is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationTime is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationTime?: timestamp;
  }
  export type CronExpression = string;
  export interface DateRange {
    /**
     * This value is the beginning date, inclusive. The date and time are in Unix format and Coordinated Universal Time (UTC), and it is accurate to milliseconds (milliseconds are optional).
     */
    FromDate: timestamp;
    /**
     * This value is the end date, inclusive. The date and time are in Unix format and Coordinated Universal Time (UTC), and it is accurate to milliseconds (milliseconds are optional).
     */
    ToDate: timestamp;
  }
  export interface DeleteBackupPlanInput {
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId: string;
  }
  export interface DeleteBackupPlanOutput {
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId?: string;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a backup plan; for example, arn:aws:backup:us-east-1:123456789012:plan:8F81F553-3A74-4A3F-B93D-B3360DC80C50.
     */
    BackupPlanArn?: ARN;
    /**
     * The date and time a backup plan is deleted, in Unix format and Coordinated Universal Time (UTC). The value of DeletionDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    DeletionDate?: timestamp;
    /**
     * Unique, randomly generated, Unicode, UTF-8 encoded strings that are at most 1,024 bytes long. Version IDs cannot be edited.
     */
    VersionId?: string;
  }
  export interface DeleteBackupSelectionInput {
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId: string;
    /**
     * Uniquely identifies the body of a request to assign a set of resources to a backup plan.
     */
    SelectionId: string;
  }
  export interface DeleteBackupVaultAccessPolicyInput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName: BackupVaultName;
  }
  export interface DeleteBackupVaultInput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName: string;
  }
  export interface DeleteBackupVaultLockConfigurationInput {
    /**
     * The name of the backup vault from which to delete Backup Vault Lock.
     */
    BackupVaultName: BackupVaultName;
  }
  export interface DeleteBackupVaultNotificationsInput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName: BackupVaultName;
  }
  export interface DeleteFrameworkInput {
    /**
     * The unique name of a framework.
     */
    FrameworkName: FrameworkName;
  }
  export interface DeleteRecoveryPointInput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName: BackupVaultName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    RecoveryPointArn: ARN;
  }
  export interface DeleteReportPlanInput {
    /**
     * The unique name of a report plan.
     */
    ReportPlanName: ReportPlanName;
  }
  export interface DescribeBackupJobInput {
    /**
     * Uniquely identifies a request to Backup to back up a resource.
     */
    BackupJobId: string;
  }
  export interface DescribeBackupJobOutput {
    /**
     * Returns the account ID that owns the backup job.
     */
    AccountId?: AccountId;
    /**
     * Uniquely identifies a request to Backup to back up a resource.
     */
    BackupJobId?: string;
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName?: BackupVaultName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a backup vault; for example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.
     */
    BackupVaultArn?: ARN;
    /**
     * An ARN that uniquely identifies a recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    RecoveryPointArn?: ARN;
    /**
     * An ARN that uniquely identifies a saved resource. The format of the ARN depends on the resource type.
     */
    ResourceArn?: ARN;
    /**
     * The date and time that a backup job is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * The date and time that a job to create a backup job is completed, in Unix format and Coordinated Universal Time (UTC). The value of CompletionDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CompletionDate?: timestamp;
    /**
     * The current state of a backup job.
     */
    State?: BackupJobState;
    /**
     * A detailed message explaining the status of the job to back up a resource.
     */
    StatusMessage?: string;
    /**
     * Contains an estimated percentage that is complete of a job at the time the job status was queried.
     */
    PercentDone?: string;
    /**
     * The size, in bytes, of a backup.
     */
    BackupSizeInBytes?: Long;
    /**
     * Specifies the IAM role ARN used to create the target recovery point; for example, arn:aws:iam::123456789012:role/S3Access.
     */
    IamRoleArn?: IAMRoleArn;
    /**
     * Contains identifying information about the creation of a backup job, including the BackupPlanArn, BackupPlanId, BackupPlanVersion, and BackupRuleId of the backup plan that is used to create it.
     */
    CreatedBy?: RecoveryPointCreator;
    /**
     * The type of Amazon Web Services resource to be backed up; for example, an Amazon Elastic Block Store (Amazon EBS) volume or an Amazon Relational Database Service (Amazon RDS) database.
     */
    ResourceType?: ResourceType;
    /**
     * The size in bytes transferred to a backup vault at the time that the job status was queried.
     */
    BytesTransferred?: Long;
    /**
     * The date and time that a job to back up resources is expected to be completed, in Unix format and Coordinated Universal Time (UTC). The value of ExpectedCompletionDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    ExpectedCompletionDate?: timestamp;
    /**
     * Specifies the time in Unix format and Coordinated Universal Time (UTC) when a backup job must be started before it is canceled. The value is calculated by adding the start window to the scheduled time. So if the scheduled time were 6:00 PM and the start window is 2 hours, the StartBy time would be 8:00 PM on the date specified. The value of StartBy is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    StartBy?: timestamp;
    /**
     * Represents the options specified as part of backup plan or on-demand backup job.
     */
    BackupOptions?: BackupOptions;
    /**
     * Represents the actual backup type selected for a backup job. For example, if a successful Windows Volume Shadow Copy Service (VSS) backup was taken, BackupType returns "WindowsVSS". If BackupType is empty, then the backup type was a regular backup.
     */
    BackupType?: string;
    /**
     * This returns the parent (composite) resource backup job ID.
     */
    ParentJobId?: string;
    /**
     * This returns the boolean value that a backup job is a parent (composite) job.
     */
    IsParent?: boolean;
    /**
     * This returns the number of child (nested) backup jobs.
     */
    NumberOfChildJobs?: Long;
    /**
     * This returns the statistics of the included child (nested) backup jobs.
     */
    ChildJobsInState?: BackupJobChildJobsInState;
    /**
     * This is the non-unique name of the resource that belongs to the specified backup.
     */
    ResourceName?: string;
  }
  export interface DescribeBackupVaultInput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName: string;
    /**
     * This is the account ID of the specified backup vault.
     */
    BackupVaultAccountId?: string;
  }
  export interface DescribeBackupVaultOutput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName?: string;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a backup vault; for example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.
     */
    BackupVaultArn?: ARN;
    /**
     * This is the type of vault described.
     */
    VaultType?: VaultType;
    /**
     * The server-side encryption key that is used to protect your backups; for example, arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab.
     */
    EncryptionKeyArn?: ARN;
    /**
     * The date and time that a backup vault is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * A unique string that identifies the request and allows failed requests to be retried without the risk of running the operation twice.
     */
    CreatorRequestId?: string;
    /**
     * The number of recovery points that are stored in a backup vault.
     */
    NumberOfRecoveryPoints?: long;
    /**
     * A Boolean that indicates whether Backup Vault Lock is currently protecting the backup vault. True means that Vault Lock causes delete or update operations on the recovery points stored in the vault to fail.
     */
    Locked?: Boolean;
    /**
     * The Backup Vault Lock setting that specifies the minimum retention period that the vault retains its recovery points. If this parameter is not specified, Vault Lock does not enforce a minimum retention period. If specified, any backup or copy job to the vault must have a lifecycle policy with a retention period equal to or longer than the minimum retention period. If the job's retention period is shorter than that minimum retention period, then the vault fails the backup or copy job, and you should either modify your lifecycle settings or use a different vault. Recovery points already stored in the vault prior to Vault Lock are not affected.
     */
    MinRetentionDays?: Long;
    /**
     * The Backup Vault Lock setting that specifies the maximum retention period that the vault retains its recovery points. If this parameter is not specified, Vault Lock does not enforce a maximum retention period on the recovery points in the vault (allowing indefinite storage). If specified, any backup or copy job to the vault must have a lifecycle policy with a retention period equal to or shorter than the maximum retention period. If the job's retention period is longer than that maximum retention period, then the vault fails the backup or copy job, and you should either modify your lifecycle settings or use a different vault. Recovery points already stored in the vault prior to Vault Lock are not affected.
     */
    MaxRetentionDays?: Long;
    /**
     * The date and time when Backup Vault Lock configuration cannot be changed or deleted. If you applied Vault Lock to your vault without specifying a lock date, you can change any of your Vault Lock settings, or delete Vault Lock from the vault entirely, at any time. This value is in Unix format, Coordinated Universal Time (UTC), and accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    LockDate?: timestamp;
  }
  export interface DescribeCopyJobInput {
    /**
     * Uniquely identifies a copy job.
     */
    CopyJobId: string;
  }
  export interface DescribeCopyJobOutput {
    /**
     * Contains detailed information about a copy job.
     */
    CopyJob?: CopyJob;
  }
  export interface DescribeFrameworkInput {
    /**
     * The unique name of a framework.
     */
    FrameworkName: FrameworkName;
  }
  export interface DescribeFrameworkOutput {
    /**
     * The unique name of a framework.
     */
    FrameworkName?: FrameworkName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    FrameworkArn?: ARN;
    /**
     * An optional description of the framework.
     */
    FrameworkDescription?: FrameworkDescription;
    /**
     * A list of the controls that make up the framework. Each control in the list has a name, input parameters, and scope.
     */
    FrameworkControls?: FrameworkControls;
    /**
     * The date and time that a framework is created, in ISO 8601 representation. The value of CreationTime is accurate to milliseconds. For example, 2020-07-10T15:00:00.000-08:00 represents the 10th of July 2020 at 3:00 PM 8 hours behind UTC.
     */
    CreationTime?: timestamp;
    /**
     * The deployment status of a framework. The statuses are:  CREATE_IN_PROGRESS | UPDATE_IN_PROGRESS | DELETE_IN_PROGRESS | COMPLETED | FAILED 
     */
    DeploymentStatus?: string;
    /**
     * A framework consists of one or more controls. Each control governs a resource, such as backup plans, backup selections, backup vaults, or recovery points. You can also turn Config recording on or off for each resource. The statuses are:    ACTIVE when recording is turned on for all resources governed by the framework.    PARTIALLY_ACTIVE when recording is turned off for at least one resource governed by the framework.    INACTIVE when recording is turned off for all resources governed by the framework.    UNAVAILABLE when Backup is unable to validate recording status at this time.  
     */
    FrameworkStatus?: string;
    /**
     * A customer-chosen string that you can use to distinguish between otherwise identical calls to DescribeFrameworkOutput. Retrying a successful request with the same idempotency token results in a success message with no action taken.
     */
    IdempotencyToken?: string;
  }
  export interface DescribeGlobalSettingsInput {
  }
  export interface DescribeGlobalSettingsOutput {
    /**
     * The status of the flag isCrossAccountBackupEnabled.
     */
    GlobalSettings?: GlobalSettings;
    /**
     * The date and time that the flag isCrossAccountBackupEnabled was last updated. This update is in Unix format and Coordinated Universal Time (UTC). The value of LastUpdateTime is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    LastUpdateTime?: timestamp;
  }
  export interface DescribeProtectedResourceInput {
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    ResourceArn: ARN;
  }
  export interface DescribeProtectedResourceOutput {
    /**
     * An ARN that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    ResourceArn?: ARN;
    /**
     * The type of Amazon Web Services resource saved as a recovery point; for example, an Amazon EBS volume or an Amazon RDS database.
     */
    ResourceType?: ResourceType;
    /**
     * The date and time that a resource was last backed up, in Unix format and Coordinated Universal Time (UTC). The value of LastBackupTime is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    LastBackupTime?: timestamp;
    /**
     * This is the non-unique name of the resource that belongs to the specified backup.
     */
    ResourceName?: string;
  }
  export interface DescribeRecoveryPointInput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName: BackupVaultName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    RecoveryPointArn: ARN;
    /**
     * This is the account ID of the specified backup vault.
     */
    BackupVaultAccountId?: AccountId;
  }
  export interface DescribeRecoveryPointOutput {
    /**
     * An ARN that uniquely identifies a recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    RecoveryPointArn?: ARN;
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName?: BackupVaultName;
    /**
     * An ARN that uniquely identifies a backup vault; for example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.
     */
    BackupVaultArn?: ARN;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies the source vault where the resource was originally backed up in; for example, arn:aws:backup:us-east-1:123456789012:vault:BackupVault. If the recovery is restored to the same Amazon Web Services account or Region, this value will be null.
     */
    SourceBackupVaultArn?: ARN;
    /**
     * An ARN that uniquely identifies a saved resource. The format of the ARN depends on the resource type.
     */
    ResourceArn?: ARN;
    /**
     * The type of Amazon Web Services resource to save as a recovery point; for example, an Amazon Elastic Block Store (Amazon EBS) volume or an Amazon Relational Database Service (Amazon RDS) database.
     */
    ResourceType?: ResourceType;
    /**
     * Contains identifying information about the creation of a recovery point, including the BackupPlanArn, BackupPlanId, BackupPlanVersion, and BackupRuleId of the backup plan used to create it.
     */
    CreatedBy?: RecoveryPointCreator;
    /**
     * Specifies the IAM role ARN used to create the target recovery point; for example, arn:aws:iam::123456789012:role/S3Access.
     */
    IamRoleArn?: IAMRoleArn;
    /**
     * A status code specifying the state of the recovery point.  PARTIAL status indicates Backup could not create the recovery point before the backup window closed. To increase your backup plan window using the API, see UpdateBackupPlan. You can also increase your backup plan window using the Console by choosing and editing your backup plan.  EXPIRED status indicates that the recovery point has exceeded its retention period, but Backup lacks permission or is otherwise unable to delete it. To manually delete these recovery points, see  Step 3: Delete the recovery points in the Clean up resources section of Getting started.  STOPPED status occurs on a continuous backup where a user has taken some action that causes the continuous backup to be disabled. This can be caused by the removal of permissions, turning off versioning, turning off events being sent to EventBridge, or disabling the EventBridge rules that are put in place by Backup. To resolve STOPPED status, ensure that all requested permissions are in place and that versioning is enabled on the S3 bucket. Once these conditions are met, the next instance of a backup rule running will result in a new continuous recovery point being created. The recovery points with STOPPED status do not need to be deleted. For SAP HANA on Amazon EC2 STOPPED status occurs due to user action, application misconfiguration, or backup failure. To ensure that future continuous backups succeed, refer to the recovery point status and check SAP HANA for details.
     */
    Status?: RecoveryPointStatus;
    /**
     * A status message explaining the status of the recovery point.
     */
    StatusMessage?: string;
    /**
     * The date and time that a recovery point is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * The date and time that a job to create a recovery point is completed, in Unix format and Coordinated Universal Time (UTC). The value of CompletionDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CompletionDate?: timestamp;
    /**
     * The size, in bytes, of a backup.
     */
    BackupSizeInBytes?: Long;
    /**
     * A CalculatedLifecycle object containing DeleteAt and MoveToColdStorageAt timestamps.
     */
    CalculatedLifecycle?: CalculatedLifecycle;
    /**
     * The lifecycle defines when a protected resource is transitioned to cold storage and when it expires. Backup transitions and expires backups automatically according to the lifecycle that you define. Backups that are transitioned to cold storage must be stored in cold storage for a minimum of 90 days. Therefore, the “retention” setting must be 90 days greater than the “transition to cold after days” setting. The “transition to cold after days” setting cannot be changed after a backup has been transitioned to cold.  Resource types that are able to be transitioned to cold storage are listed in the "Lifecycle to cold storage" section of the  Feature availability by resource table. Backup ignores this expression for other resource types.
     */
    Lifecycle?: Lifecycle;
    /**
     * The server-side encryption key used to protect your backups; for example, arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab.
     */
    EncryptionKeyArn?: ARN;
    /**
     * A Boolean value that is returned as TRUE if the specified recovery point is encrypted, or FALSE if the recovery point is not encrypted.
     */
    IsEncrypted?: boolean;
    /**
     * Specifies the storage class of the recovery point. Valid values are WARM or COLD.
     */
    StorageClass?: StorageClass;
    /**
     * The date and time that a recovery point was last restored, in Unix format and Coordinated Universal Time (UTC). The value of LastRestoreTime is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    LastRestoreTime?: timestamp;
    /**
     * This is an ARN that uniquely identifies a parent (composite) recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    ParentRecoveryPointArn?: ARN;
    /**
     * This is the identifier of a resource within a composite group, such as nested (child) recovery point belonging to a composite (parent) stack. The ID is transferred from the  logical ID within a stack.
     */
    CompositeMemberIdentifier?: string;
    /**
     * This returns the boolean value that a recovery point is a parent (composite) job.
     */
    IsParent?: boolean;
    /**
     * This is the non-unique name of the resource that belongs to the specified backup.
     */
    ResourceName?: string;
  }
  export interface DescribeRegionSettingsInput {
  }
  export interface DescribeRegionSettingsOutput {
    /**
     * Returns a list of all services along with the opt-in preferences in the Region.
     */
    ResourceTypeOptInPreference?: ResourceTypeOptInPreference;
    /**
     * Returns whether Backup fully manages the backups for a resource type. For the benefits of full Backup management, see  Full Backup management. For a list of resource types and whether each supports full Backup management, see the  Feature availability by resource table. If "DynamoDB":false, you can enable full Backup management for DynamoDB backup by enabling  Backup's advanced DynamoDB backup features.
     */
    ResourceTypeManagementPreference?: ResourceTypeManagementPreference;
  }
  export interface DescribeReportJobInput {
    /**
     * The identifier of the report job. A unique, randomly generated, Unicode, UTF-8 encoded string that is at most 1,024 bytes long. The report job ID cannot be edited.
     */
    ReportJobId: ReportJobId;
  }
  export interface DescribeReportJobOutput {
    /**
     * A list of information about a report job, including its completion and creation times, report destination, unique report job ID, Amazon Resource Name (ARN), report template, status, and status message.
     */
    ReportJob?: ReportJob;
  }
  export interface DescribeReportPlanInput {
    /**
     * The unique name of a report plan.
     */
    ReportPlanName: ReportPlanName;
  }
  export interface DescribeReportPlanOutput {
    /**
     * Returns details about the report plan that is specified by its name. These details include the report plan's Amazon Resource Name (ARN), description, settings, delivery channel, deployment status, creation time, and last attempted and successful run times.
     */
    ReportPlan?: ReportPlan;
  }
  export interface DescribeRestoreJobInput {
    /**
     * Uniquely identifies the job that restores a recovery point.
     */
    RestoreJobId: RestoreJobId;
  }
  export interface DescribeRestoreJobOutput {
    /**
     * Returns the account ID that owns the restore job.
     */
    AccountId?: AccountId;
    /**
     * Uniquely identifies the job that restores a recovery point.
     */
    RestoreJobId?: string;
    /**
     * An ARN that uniquely identifies a recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    RecoveryPointArn?: ARN;
    /**
     * The date and time that a restore job is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * The date and time that a job to restore a recovery point is completed, in Unix format and Coordinated Universal Time (UTC). The value of CompletionDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CompletionDate?: timestamp;
    /**
     * Status code specifying the state of the job that is initiated by Backup to restore a recovery point.
     */
    Status?: RestoreJobStatus;
    /**
     * A message showing the status of a job to restore a recovery point.
     */
    StatusMessage?: string;
    /**
     * Contains an estimated percentage that is complete of a job at the time the job status was queried.
     */
    PercentDone?: string;
    /**
     * The size, in bytes, of the restored resource.
     */
    BackupSizeInBytes?: Long;
    /**
     * Specifies the IAM role ARN used to create the target recovery point; for example, arn:aws:iam::123456789012:role/S3Access.
     */
    IamRoleArn?: IAMRoleArn;
    /**
     * The amount of time in minutes that a job restoring a recovery point is expected to take.
     */
    ExpectedCompletionTimeMinutes?: Long;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a resource whose recovery point is being restored. The format of the ARN depends on the resource type of the backed-up resource.
     */
    CreatedResourceArn?: ARN;
    /**
     * Returns metadata associated with a restore job listed by resource type.
     */
    ResourceType?: ResourceType;
  }
  export interface DisassociateRecoveryPointFromParentInput {
    /**
     * This is the name of a logical container where the child (nested) recovery point is stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName: BackupVaultName;
    /**
     * This is the Amazon Resource Name (ARN) that uniquely identifies the child (nested) recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45. 
     */
    RecoveryPointArn: ARN;
  }
  export interface DisassociateRecoveryPointInput {
    /**
     * The unique name of an Backup vault.
     */
    BackupVaultName: BackupVaultName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies an Backup recovery point.
     */
    RecoveryPointArn: ARN;
  }
  export interface ExportBackupPlanTemplateInput {
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId: string;
  }
  export interface ExportBackupPlanTemplateOutput {
    /**
     * The body of a backup plan template in JSON format.  This is a signed JSON document that cannot be modified before being passed to GetBackupPlanFromJSON.  
     */
    BackupPlanTemplateJson?: string;
  }
  export type FormatList = string[];
  export interface Framework {
    /**
     * The unique name of a framework. This name is between 1 and 256 characters, starting with a letter, and consisting of letters (a-z, A-Z), numbers (0-9), and underscores (_).
     */
    FrameworkName?: FrameworkName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    FrameworkArn?: ARN;
    /**
     * An optional description of the framework with a maximum 1,024 characters.
     */
    FrameworkDescription?: FrameworkDescription;
    /**
     * The number of controls contained by the framework.
     */
    NumberOfControls?: integer;
    /**
     * The date and time that a framework is created, in ISO 8601 representation. The value of CreationTime is accurate to milliseconds. For example, 2020-07-10T15:00:00.000-08:00 represents the 10th of July 2020 at 3:00 PM 8 hours behind UTC.
     */
    CreationTime?: timestamp;
    /**
     * The deployment status of a framework. The statuses are:  CREATE_IN_PROGRESS | UPDATE_IN_PROGRESS | DELETE_IN_PROGRESS | COMPLETED | FAILED 
     */
    DeploymentStatus?: string;
  }
  export interface FrameworkControl {
    /**
     * The name of a control. This name is between 1 and 256 characters.
     */
    ControlName: ControlName;
    /**
     * A list of ParameterName and ParameterValue pairs.
     */
    ControlInputParameters?: ControlInputParameters;
    /**
     * The scope of a control. The control scope defines what the control will evaluate. Three examples of control scopes are: a specific backup plan, all backup plans with a specific tag, or all backup plans.
     */
    ControlScope?: ControlScope;
  }
  export type FrameworkControls = FrameworkControl[];
  export type FrameworkDescription = string;
  export type FrameworkList = Framework[];
  export type FrameworkName = string;
  export interface GetBackupPlanFromJSONInput {
    /**
     * A customer-supplied backup plan document in JSON format.
     */
    BackupPlanTemplateJson: string;
  }
  export interface GetBackupPlanFromJSONOutput {
    /**
     * Specifies the body of a backup plan. Includes a BackupPlanName and one or more sets of Rules.
     */
    BackupPlan?: BackupPlan;
  }
  export interface GetBackupPlanFromTemplateInput {
    /**
     * Uniquely identifies a stored backup plan template.
     */
    BackupPlanTemplateId: string;
  }
  export interface GetBackupPlanFromTemplateOutput {
    /**
     * Returns the body of a backup plan based on the target template, including the name, rules, and backup vault of the plan.
     */
    BackupPlanDocument?: BackupPlan;
  }
  export interface GetBackupPlanInput {
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId: string;
    /**
     * Unique, randomly generated, Unicode, UTF-8 encoded strings that are at most 1,024 bytes long. Version IDs cannot be edited.
     */
    VersionId?: string;
  }
  export interface GetBackupPlanOutput {
    /**
     * Specifies the body of a backup plan. Includes a BackupPlanName and one or more sets of Rules.
     */
    BackupPlan?: BackupPlan;
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId?: string;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a backup plan; for example, arn:aws:backup:us-east-1:123456789012:plan:8F81F553-3A74-4A3F-B93D-B3360DC80C50.
     */
    BackupPlanArn?: ARN;
    /**
     * Unique, randomly generated, Unicode, UTF-8 encoded strings that are at most 1,024 bytes long. Version IDs cannot be edited.
     */
    VersionId?: string;
    /**
     * A unique string that identifies the request and allows failed requests to be retried without the risk of running the operation twice.
     */
    CreatorRequestId?: string;
    /**
     * The date and time that a backup plan is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * The date and time that a backup plan is deleted, in Unix format and Coordinated Universal Time (UTC). The value of DeletionDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    DeletionDate?: timestamp;
    /**
     * The last time a job to back up resources was run with this backup plan. A date and time, in Unix format and Coordinated Universal Time (UTC). The value of LastExecutionDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    LastExecutionDate?: timestamp;
    /**
     * Contains a list of BackupOptions for each resource type. The list is populated only if the advanced option is set for the backup plan.
     */
    AdvancedBackupSettings?: AdvancedBackupSettings;
  }
  export interface GetBackupSelectionInput {
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId: string;
    /**
     * Uniquely identifies the body of a request to assign a set of resources to a backup plan.
     */
    SelectionId: string;
  }
  export interface GetBackupSelectionOutput {
    /**
     * Specifies the body of a request to assign a set of resources to a backup plan.
     */
    BackupSelection?: BackupSelection;
    /**
     * Uniquely identifies the body of a request to assign a set of resources to a backup plan.
     */
    SelectionId?: string;
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId?: string;
    /**
     * The date and time a backup selection is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * A unique string that identifies the request and allows failed requests to be retried without the risk of running the operation twice.
     */
    CreatorRequestId?: string;
  }
  export interface GetBackupVaultAccessPolicyInput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName: BackupVaultName;
  }
  export interface GetBackupVaultAccessPolicyOutput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName?: BackupVaultName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a backup vault; for example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.
     */
    BackupVaultArn?: ARN;
    /**
     * The backup vault access policy document in JSON format.
     */
    Policy?: IAMPolicy;
  }
  export interface GetBackupVaultNotificationsInput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName: BackupVaultName;
  }
  export interface GetBackupVaultNotificationsOutput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName?: BackupVaultName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a backup vault; for example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.
     */
    BackupVaultArn?: ARN;
    /**
     * An ARN that uniquely identifies an Amazon Simple Notification Service (Amazon SNS) topic; for example, arn:aws:sns:us-west-2:111122223333:MyTopic.
     */
    SNSTopicArn?: ARN;
    /**
     * An array of events that indicate the status of jobs to back up resources to the backup vault.
     */
    BackupVaultEvents?: BackupVaultEvents;
  }
  export interface GetLegalHoldInput {
    /**
     * This is the ID required to use GetLegalHold. This unique ID is associated with a specific legal hold.
     */
    LegalHoldId: string;
  }
  export interface GetLegalHoldOutput {
    /**
     * This is the string title of the legal hold.
     */
    Title?: string;
    /**
     * This is the status of the legal hold. Statuses can be ACTIVE, CREATING, CANCELED, and CANCELING.
     */
    Status?: LegalHoldStatus;
    /**
     * This is the returned string description of the legal hold.
     */
    Description?: string;
    /**
     * String describing the reason for removing the legal hold.
     */
    CancelDescription?: string;
    /**
     * This is the returned ID associated with a specified legal hold.
     */
    LegalHoldId?: string;
    /**
     * This is the returned framework ARN for the specified legal hold. An Amazon Resource Name (ARN) uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    LegalHoldArn?: ARN;
    /**
     * Time in number format when legal hold was created.
     */
    CreationDate?: timestamp;
    /**
     * Time in number when legal hold was cancelled.
     */
    CancellationDate?: timestamp;
    /**
     * This is the date and time until which the legal hold record will be retained.
     */
    RetainRecordUntil?: timestamp;
    /**
     * This specifies criteria to assign a set of resources, such as resource types or backup vaults.
     */
    RecoveryPointSelection?: RecoveryPointSelection;
  }
  export interface GetRecoveryPointRestoreMetadataInput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName: BackupVaultName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    RecoveryPointArn: ARN;
    /**
     * This is the account ID of the specified backup vault.
     */
    BackupVaultAccountId?: AccountId;
  }
  export interface GetRecoveryPointRestoreMetadataOutput {
    /**
     * An ARN that uniquely identifies a backup vault; for example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.
     */
    BackupVaultArn?: ARN;
    /**
     * An ARN that uniquely identifies a recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    RecoveryPointArn?: ARN;
    /**
     * The set of metadata key-value pairs that describe the original configuration of the backed-up resource. These values vary depending on the service that is being restored.
     */
    RestoreMetadata?: Metadata;
  }
  export interface GetSupportedResourceTypesOutput {
    /**
     * Contains a string with the supported Amazon Web Services resource types:    Aurora for Amazon Aurora    DynamoDB for Amazon DynamoDB    EBS for Amazon Elastic Block Store    EC2 for Amazon Elastic Compute Cloud    EFS for Amazon Elastic File System    FSX for Amazon FSx    RDS for Amazon Relational Database Service    Storage Gateway for Storage Gateway    DocDB for Amazon DocumentDB (with MongoDB compatibility)    Neptune for Amazon Neptune  
     */
    ResourceTypes?: ResourceTypes;
  }
  export type GlobalSettings = {[key: string]: GlobalSettingsValue};
  export type GlobalSettingsName = string;
  export type GlobalSettingsValue = string;
  export type IAMPolicy = string;
  export type IAMRoleArn = string;
  export type IsEnabled = boolean;
  export interface LegalHold {
    /**
     * This is the title of a legal hold.
     */
    Title?: string;
    /**
     * This is the status of the legal hold. Statuses can be ACTIVE, CREATING, CANCELED, and CANCELING.
     */
    Status?: LegalHoldStatus;
    /**
     * This is the description of a legal hold.
     */
    Description?: string;
    /**
     * ID of specific legal hold on one or more recovery points.
     */
    LegalHoldId?: string;
    /**
     * This is an Amazon Resource Number (ARN) that uniquely identifies the legal hold; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    LegalHoldArn?: ARN;
    /**
     * This is the time in number format when legal hold was created.
     */
    CreationDate?: timestamp;
    /**
     * This is the time in number format when legal hold was cancelled.
     */
    CancellationDate?: timestamp;
  }
  export type LegalHoldStatus = "CREATING"|"ACTIVE"|"CANCELING"|"CANCELED"|string;
  export type LegalHoldsList = LegalHold[];
  export interface Lifecycle {
    /**
     * Specifies the number of days after creation that a recovery point is moved to cold storage.
     */
    MoveToColdStorageAfterDays?: Long;
    /**
     * Specifies the number of days after creation that a recovery point is deleted. Must be greater than 90 days plus MoveToColdStorageAfterDays.
     */
    DeleteAfterDays?: Long;
  }
  export interface ListBackupJobsInput {
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * The maximum number of items to be returned.
     */
    MaxResults?: MaxResults;
    /**
     * Returns only backup jobs that match the specified resource Amazon Resource Name (ARN).
     */
    ByResourceArn?: ARN;
    /**
     * Returns only backup jobs that are in the specified state.
     */
    ByState?: BackupJobState;
    /**
     * Returns only backup jobs that will be stored in the specified backup vault. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    ByBackupVaultName?: BackupVaultName;
    /**
     * Returns only backup jobs that were created before the specified date.
     */
    ByCreatedBefore?: timestamp;
    /**
     * Returns only backup jobs that were created after the specified date.
     */
    ByCreatedAfter?: timestamp;
    /**
     * Returns only backup jobs for the specified resources:    Aurora for Amazon Aurora    DocumentDB for Amazon DocumentDB (with MongoDB compatibility)    DynamoDB for Amazon DynamoDB    EBS for Amazon Elastic Block Store    EC2 for Amazon Elastic Compute Cloud    EFS for Amazon Elastic File System    FSx for Amazon FSx    Neptune for Amazon Neptune    RDS for Amazon Relational Database Service    Storage Gateway for Storage Gateway    S3 for Amazon S3    VirtualMachine for virtual machines  
     */
    ByResourceType?: ResourceType;
    /**
     * The account ID to list the jobs from. Returns only backup jobs associated with the specified account ID. If used from an Organizations management account, passing * returns all jobs across the organization.
     */
    ByAccountId?: AccountId;
    /**
     * Returns only backup jobs completed after a date expressed in Unix format and Coordinated Universal Time (UTC).
     */
    ByCompleteAfter?: timestamp;
    /**
     * Returns only backup jobs completed before a date expressed in Unix format and Coordinated Universal Time (UTC).
     */
    ByCompleteBefore?: timestamp;
    /**
     * This is a filter to list child (nested) jobs based on parent job ID.
     */
    ByParentJobId?: string;
  }
  export interface ListBackupJobsOutput {
    /**
     * An array of structures containing metadata about your backup jobs returned in JSON format.
     */
    BackupJobs?: BackupJobsList;
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
  }
  export interface ListBackupPlanTemplatesInput {
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * The maximum number of items to be returned.
     */
    MaxResults?: MaxResults;
  }
  export interface ListBackupPlanTemplatesOutput {
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * An array of template list items containing metadata about your saved templates.
     */
    BackupPlanTemplatesList?: BackupPlanTemplatesList;
  }
  export interface ListBackupPlanVersionsInput {
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId: string;
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * The maximum number of items to be returned.
     */
    MaxResults?: MaxResults;
  }
  export interface ListBackupPlanVersionsOutput {
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * An array of version list items containing metadata about your backup plans.
     */
    BackupPlanVersionsList?: BackupPlanVersionsList;
  }
  export interface ListBackupPlansInput {
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * The maximum number of items to be returned.
     */
    MaxResults?: MaxResults;
    /**
     * A Boolean value with a default value of FALSE that returns deleted backup plans when set to TRUE.
     */
    IncludeDeleted?: Boolean;
  }
  export interface ListBackupPlansOutput {
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * An array of backup plan list items containing metadata about your saved backup plans.
     */
    BackupPlansList?: BackupPlansList;
  }
  export interface ListBackupSelectionsInput {
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId: string;
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * The maximum number of items to be returned.
     */
    MaxResults?: MaxResults;
  }
  export interface ListBackupSelectionsOutput {
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * An array of backup selection list items containing metadata about each resource in the list.
     */
    BackupSelectionsList?: BackupSelectionsList;
  }
  export interface ListBackupVaultsInput {
    /**
     * This parameter will sort the list of vaults by vault type.
     */
    ByVaultType?: VaultType;
    /**
     * This parameter will sort the list of vaults by shared vaults.
     */
    ByShared?: boolean;
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * The maximum number of items to be returned.
     */
    MaxResults?: MaxResults;
  }
  export interface ListBackupVaultsOutput {
    /**
     * An array of backup vault list members containing vault metadata, including Amazon Resource Name (ARN), display name, creation date, number of saved recovery points, and encryption information if the resources saved in the backup vault are encrypted.
     */
    BackupVaultList?: BackupVaultList;
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
  }
  export interface ListCopyJobsInput {
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token. 
     */
    NextToken?: string;
    /**
     * The maximum number of items to be returned.
     */
    MaxResults?: MaxResults;
    /**
     * Returns only copy jobs that match the specified resource Amazon Resource Name (ARN). 
     */
    ByResourceArn?: ARN;
    /**
     * Returns only copy jobs that are in the specified state.
     */
    ByState?: CopyJobState;
    /**
     * Returns only copy jobs that were created before the specified date.
     */
    ByCreatedBefore?: timestamp;
    /**
     * Returns only copy jobs that were created after the specified date.
     */
    ByCreatedAfter?: timestamp;
    /**
     * Returns only backup jobs for the specified resources:    Aurora for Amazon Aurora    DocumentDB for Amazon DocumentDB (with MongoDB compatibility)    DynamoDB for Amazon DynamoDB    EBS for Amazon Elastic Block Store    EC2 for Amazon Elastic Compute Cloud    EFS for Amazon Elastic File System    FSx for Amazon FSx    Neptune for Amazon Neptune    RDS for Amazon Relational Database Service    Storage Gateway for Storage Gateway    S3 for Amazon S3    VirtualMachine for virtual machines  
     */
    ByResourceType?: ResourceType;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a source backup vault to copy from; for example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault. 
     */
    ByDestinationVaultArn?: string;
    /**
     * The account ID to list the jobs from. Returns only copy jobs associated with the specified account ID.
     */
    ByAccountId?: AccountId;
    /**
     * Returns only copy jobs completed before a date expressed in Unix format and Coordinated Universal Time (UTC).
     */
    ByCompleteBefore?: timestamp;
    /**
     * Returns only copy jobs completed after a date expressed in Unix format and Coordinated Universal Time (UTC).
     */
    ByCompleteAfter?: timestamp;
    /**
     * This is a filter to list child (nested) jobs based on parent job ID.
     */
    ByParentJobId?: string;
  }
  export interface ListCopyJobsOutput {
    /**
     * An array of structures containing metadata about your copy jobs returned in JSON format. 
     */
    CopyJobs?: CopyJobsList;
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token. 
     */
    NextToken?: string;
  }
  export interface ListFrameworksInput {
    /**
     * The number of desired results from 1 to 1000. Optional. If unspecified, the query will return 1 MB of data.
     */
    MaxResults?: MaxFrameworkInputs;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: string;
  }
  export interface ListFrameworksOutput {
    /**
     * A list of frameworks with details for each framework, including the framework name, Amazon Resource Name (ARN), description, number of controls, creation time, and deployment status.
     */
    Frameworks?: FrameworkList;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: string;
  }
  export interface ListLegalHoldsInput {
    /**
     * The next item following a partial list of returned resources. For example, if a request is made to return maxResults number of resources, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * The maximum number of resource list items to be returned.
     */
    MaxResults?: MaxResults;
  }
  export interface ListLegalHoldsOutput {
    /**
     * The next item following a partial list of returned resources. For example, if a request is made to return maxResults number of resources, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * This is an array of returned legal holds, both active and previous.
     */
    LegalHolds?: LegalHoldsList;
  }
  export type ListOfTags = Condition[];
  export interface ListProtectedResourcesByBackupVaultInput {
    /**
     * This is the list of protected resources by backup vault within the vault(s) you specify by name.
     */
    BackupVaultName: BackupVaultName;
    /**
     * This is the list of protected resources by backup vault within the vault(s) you specify by account ID.
     */
    BackupVaultAccountId?: AccountId;
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * The maximum number of items to be returned.
     */
    MaxResults?: MaxResults;
  }
  export interface ListProtectedResourcesByBackupVaultOutput {
    /**
     * These are the results returned for the request ListProtectedResourcesByBackupVault.
     */
    Results?: ProtectedResourcesList;
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
  }
  export interface ListProtectedResourcesInput {
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * The maximum number of items to be returned.
     */
    MaxResults?: MaxResults;
  }
  export interface ListProtectedResourcesOutput {
    /**
     * An array of resources successfully backed up by Backup including the time the resource was saved, an Amazon Resource Name (ARN) of the resource, and a resource type.
     */
    Results?: ProtectedResourcesList;
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
  }
  export interface ListRecoveryPointsByBackupVaultInput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.  Backup vault name might not be available when a supported service creates the backup. 
     */
    BackupVaultName: BackupVaultName;
    /**
     * This parameter will sort the list of recovery points by account ID.
     */
    BackupVaultAccountId?: AccountId;
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * The maximum number of items to be returned.
     */
    MaxResults?: MaxResults;
    /**
     * Returns only recovery points that match the specified resource Amazon Resource Name (ARN).
     */
    ByResourceArn?: ARN;
    /**
     * Returns only recovery points that match the specified resource type.
     */
    ByResourceType?: ResourceType;
    /**
     * Returns only recovery points that match the specified backup plan ID.
     */
    ByBackupPlanId?: string;
    /**
     * Returns only recovery points that were created before the specified timestamp.
     */
    ByCreatedBefore?: timestamp;
    /**
     * Returns only recovery points that were created after the specified timestamp.
     */
    ByCreatedAfter?: timestamp;
    /**
     * This returns only recovery points that match the specified parent (composite) recovery point Amazon Resource Name (ARN).
     */
    ByParentRecoveryPointArn?: ARN;
  }
  export interface ListRecoveryPointsByBackupVaultOutput {
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * An array of objects that contain detailed information about recovery points saved in a backup vault.
     */
    RecoveryPoints?: RecoveryPointByBackupVaultList;
  }
  export interface ListRecoveryPointsByLegalHoldInput {
    /**
     * This is the ID of the legal hold.
     */
    LegalHoldId: string;
    /**
     * This is the next item following a partial list of returned resources. For example, if a request is made to return maxResults number of resources, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * This is the maximum number of resource list items to be returned.
     */
    MaxResults?: MaxResults;
  }
  export interface ListRecoveryPointsByLegalHoldOutput {
    /**
     * This is a list of the recovery points returned by ListRecoveryPointsByLegalHold.
     */
    RecoveryPoints?: RecoveryPointsList;
    /**
     * This return is the next item following a partial list of returned resources.
     */
    NextToken?: string;
  }
  export interface ListRecoveryPointsByResourceInput {
    /**
     * An ARN that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    ResourceArn: ARN;
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * The maximum number of items to be returned.  Amazon RDS requires a value of at least 20. 
     */
    MaxResults?: MaxResults;
  }
  export interface ListRecoveryPointsByResourceOutput {
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * An array of objects that contain detailed information about recovery points of the specified resource type.  Only Amazon EFS and Amazon EC2 recovery points return BackupVaultName. 
     */
    RecoveryPoints?: RecoveryPointByResourceList;
  }
  export interface ListReportJobsInput {
    /**
     * Returns only report jobs with the specified report plan name.
     */
    ByReportPlanName?: ReportPlanName;
    /**
     * Returns only report jobs that were created before the date and time specified in Unix format and Coordinated Universal Time (UTC). For example, the value 1516925490 represents Friday, January 26, 2018 12:11:30 AM.
     */
    ByCreationBefore?: timestamp;
    /**
     * Returns only report jobs that were created after the date and time specified in Unix format and Coordinated Universal Time (UTC). For example, the value 1516925490 represents Friday, January 26, 2018 12:11:30 AM.
     */
    ByCreationAfter?: timestamp;
    /**
     * Returns only report jobs that are in the specified status. The statuses are:  CREATED | RUNNING | COMPLETED | FAILED 
     */
    ByStatus?: string;
    /**
     * The number of desired results from 1 to 1000. Optional. If unspecified, the query will return 1 MB of data.
     */
    MaxResults?: MaxResults;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: string;
  }
  export interface ListReportJobsOutput {
    /**
     * Details about your report jobs in JSON format.
     */
    ReportJobs?: ReportJobList;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: string;
  }
  export interface ListReportPlansInput {
    /**
     * The number of desired results from 1 to 1000. Optional. If unspecified, the query will return 1 MB of data.
     */
    MaxResults?: MaxResults;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: string;
  }
  export interface ListReportPlansOutput {
    /**
     * A list of your report plans with detailed information for each plan. This information includes the Amazon Resource Name (ARN), report plan name, description, settings, delivery channel, deployment status, creation time, and last times the report plan attempted to and successfully ran.
     */
    ReportPlans?: ReportPlanList;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: string;
  }
  export interface ListRestoreJobsInput {
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * The maximum number of items to be returned.
     */
    MaxResults?: MaxResults;
    /**
     * The account ID to list the jobs from. Returns only restore jobs associated with the specified account ID.
     */
    ByAccountId?: AccountId;
    /**
     * Returns only restore jobs that were created before the specified date.
     */
    ByCreatedBefore?: timestamp;
    /**
     * Returns only restore jobs that were created after the specified date.
     */
    ByCreatedAfter?: timestamp;
    /**
     * Returns only restore jobs associated with the specified job status.
     */
    ByStatus?: RestoreJobStatus;
    /**
     * Returns only copy jobs completed before a date expressed in Unix format and Coordinated Universal Time (UTC).
     */
    ByCompleteBefore?: timestamp;
    /**
     * Returns only copy jobs completed after a date expressed in Unix format and Coordinated Universal Time (UTC).
     */
    ByCompleteAfter?: timestamp;
  }
  export interface ListRestoreJobsOutput {
    /**
     * An array of objects that contain detailed information about jobs to restore saved resources.
     */
    RestoreJobs?: RestoreJobsList;
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
  }
  export interface ListTagsInput {
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a resource. The format of the ARN depends on the type of resource. Valid targets for ListTags are recovery points, backup plans, and backup vaults.
     */
    ResourceArn: ARN;
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * The maximum number of items to be returned.
     */
    MaxResults?: MaxResults;
  }
  export interface ListTagsOutput {
    /**
     * The next item following a partial list of returned items. For example, if a request is made to return maxResults number of items, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: string;
    /**
     * To help organize your resources, you can assign your own metadata to the resources you create. Each tag is a key-value pair.
     */
    Tags?: Tags;
  }
  export type Long = number;
  export type MaxFrameworkInputs = number;
  export type MaxResults = number;
  export type Metadata = {[key: string]: MetadataValue};
  export type MetadataKey = string;
  export type MetadataValue = string;
  export type ParameterName = string;
  export type ParameterValue = string;
  export interface ProtectedResource {
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    ResourceArn?: ARN;
    /**
     * The type of Amazon Web Services resource; for example, an Amazon Elastic Block Store (Amazon EBS) volume or an Amazon Relational Database Service (Amazon RDS) database. For Windows Volume Shadow Copy Service (VSS) backups, the only supported resource type is Amazon EC2.
     */
    ResourceType?: ResourceType;
    /**
     * The date and time a resource was last backed up, in Unix format and Coordinated Universal Time (UTC). The value of LastBackupTime is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    LastBackupTime?: timestamp;
    /**
     * This is the non-unique name of the resource that belongs to the specified backup.
     */
    ResourceName?: string;
  }
  export type ProtectedResourcesList = ProtectedResource[];
  export interface PutBackupVaultAccessPolicyInput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName: BackupVaultName;
    /**
     * The backup vault access policy document in JSON format.
     */
    Policy?: IAMPolicy;
  }
  export interface PutBackupVaultLockConfigurationInput {
    /**
     * The Backup Vault Lock configuration that specifies the name of the backup vault it protects.
     */
    BackupVaultName: BackupVaultName;
    /**
     * The Backup Vault Lock configuration that specifies the minimum retention period that the vault retains its recovery points. This setting can be useful if, for example, your organization's policies require you to retain certain data for at least seven years (2555 days). If this parameter is not specified, Vault Lock will not enforce a minimum retention period. If this parameter is specified, any backup or copy job to the vault must have a lifecycle policy with a retention period equal to or longer than the minimum retention period. If the job's retention period is shorter than that minimum retention period, then the vault fails that backup or copy job, and you should either modify your lifecycle settings or use a different vault. The shortest minimum retention period you can specify is 1 day. Recovery points already saved in the vault prior to Vault Lock are not affected.
     */
    MinRetentionDays?: Long;
    /**
     * The Backup Vault Lock configuration that specifies the maximum retention period that the vault retains its recovery points. This setting can be useful if, for example, your organization's policies require you to destroy certain data after retaining it for four years (1460 days). If this parameter is not included, Vault Lock does not enforce a maximum retention period on the recovery points in the vault. If this parameter is included without a value, Vault Lock will not enforce a maximum retention period. If this parameter is specified, any backup or copy job to the vault must have a lifecycle policy with a retention period equal to or shorter than the maximum retention period. If the job's retention period is longer than that maximum retention period, then the vault fails the backup or copy job, and you should either modify your lifecycle settings or use a different vault. The longest maximum retention period you can specify is 36500 days (approximately 100 years). Recovery points already saved in the vault prior to Vault Lock are not affected.
     */
    MaxRetentionDays?: Long;
    /**
     * The Backup Vault Lock configuration that specifies the number of days before the lock date. For example, setting ChangeableForDays to 30 on Jan. 1, 2022 at 8pm UTC will set the lock date to Jan. 31, 2022 at 8pm UTC. Backup enforces a 72-hour cooling-off period before Vault Lock takes effect and becomes immutable. Therefore, you must set ChangeableForDays to 3 or greater. Before the lock date, you can delete Vault Lock from the vault using DeleteBackupVaultLockConfiguration or change the Vault Lock configuration using PutBackupVaultLockConfiguration. On and after the lock date, the Vault Lock becomes immutable and cannot be changed or deleted. If this parameter is not specified, you can delete Vault Lock from the vault using DeleteBackupVaultLockConfiguration or change the Vault Lock configuration using PutBackupVaultLockConfiguration at any time.
     */
    ChangeableForDays?: Long;
  }
  export interface PutBackupVaultNotificationsInput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName: BackupVaultName;
    /**
     * The Amazon Resource Name (ARN) that specifies the topic for a backup vault’s events; for example, arn:aws:sns:us-west-2:111122223333:MyVaultTopic.
     */
    SNSTopicArn: ARN;
    /**
     * An array of events that indicate the status of jobs to back up resources to the backup vault. For common use cases and code samples, see Using Amazon SNS to track Backup events. The following events are supported:    BACKUP_JOB_STARTED | BACKUP_JOB_COMPLETED     COPY_JOB_STARTED | COPY_JOB_SUCCESSFUL | COPY_JOB_FAILED     RESTORE_JOB_STARTED | RESTORE_JOB_COMPLETED | RECOVERY_POINT_MODIFIED     S3_BACKUP_OBJECT_FAILED | S3_RESTORE_OBJECT_FAILED     The list below shows items that are deprecated events (for reference) and are no longer in use. They are no longer supported and will not return statuses or notifications. Refer to the list above for current supported events. 
     */
    BackupVaultEvents: BackupVaultEvents;
  }
  export interface RecoveryPointByBackupVault {
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    RecoveryPointArn?: ARN;
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName?: BackupVaultName;
    /**
     * An ARN that uniquely identifies a backup vault; for example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.
     */
    BackupVaultArn?: ARN;
    /**
     * The backup vault where the recovery point was originally copied from. If the recovery point is restored to the same account this value will be null.
     */
    SourceBackupVaultArn?: ARN;
    /**
     * An ARN that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    ResourceArn?: ARN;
    /**
     * The type of Amazon Web Services resource saved as a recovery point; for example, an Amazon Elastic Block Store (Amazon EBS) volume or an Amazon Relational Database Service (Amazon RDS) database. For Windows Volume Shadow Copy Service (VSS) backups, the only supported resource type is Amazon EC2.
     */
    ResourceType?: ResourceType;
    /**
     * Contains identifying information about the creation of a recovery point, including the BackupPlanArn, BackupPlanId, BackupPlanVersion, and BackupRuleId of the backup plan that is used to create it.
     */
    CreatedBy?: RecoveryPointCreator;
    /**
     * Specifies the IAM role ARN used to create the target recovery point; for example, arn:aws:iam::123456789012:role/S3Access.
     */
    IamRoleArn?: IAMRoleArn;
    /**
     * A status code specifying the state of the recovery point.
     */
    Status?: RecoveryPointStatus;
    /**
     * A message explaining the reason of the recovery point deletion failure.
     */
    StatusMessage?: string;
    /**
     * The date and time a recovery point is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * The date and time a job to restore a recovery point is completed, in Unix format and Coordinated Universal Time (UTC). The value of CompletionDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CompletionDate?: timestamp;
    /**
     * The size, in bytes, of a backup.
     */
    BackupSizeInBytes?: Long;
    /**
     * A CalculatedLifecycle object containing DeleteAt and MoveToColdStorageAt timestamps.
     */
    CalculatedLifecycle?: CalculatedLifecycle;
    /**
     * The lifecycle defines when a protected resource is transitioned to cold storage and when it expires. Backup transitions and expires backups automatically according to the lifecycle that you define.  Backups transitioned to cold storage must be stored in cold storage for a minimum of 90 days. Therefore, the “retention” setting must be 90 days greater than the “transition to cold after days” setting. The “transition to cold after days” setting cannot be changed after a backup has been transitioned to cold.  Resource types that are able to be transitioned to cold storage are listed in the "Lifecycle to cold storage" section of the  Feature availability by resource table. Backup ignores this expression for other resource types.
     */
    Lifecycle?: Lifecycle;
    /**
     * The server-side encryption key that is used to protect your backups; for example, arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab.
     */
    EncryptionKeyArn?: ARN;
    /**
     * A Boolean value that is returned as TRUE if the specified recovery point is encrypted, or FALSE if the recovery point is not encrypted.
     */
    IsEncrypted?: boolean;
    /**
     * The date and time a recovery point was last restored, in Unix format and Coordinated Universal Time (UTC). The value of LastRestoreTime is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    LastRestoreTime?: timestamp;
    /**
     * This is the Amazon Resource Name (ARN) of the parent (composite) recovery point.
     */
    ParentRecoveryPointArn?: ARN;
    /**
     * This is the identifier of a resource within a composite group, such as nested (child) recovery point belonging to a composite (parent) stack. The ID is transferred from the  logical ID within a stack.
     */
    CompositeMemberIdentifier?: string;
    /**
     * This is a boolean value indicating this is a parent (composite) recovery point.
     */
    IsParent?: boolean;
    /**
     * This is the non-unique name of the resource that belongs to the specified backup.
     */
    ResourceName?: string;
  }
  export type RecoveryPointByBackupVaultList = RecoveryPointByBackupVault[];
  export interface RecoveryPointByResource {
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    RecoveryPointArn?: ARN;
    /**
     * The date and time a recovery point is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * A status code specifying the state of the recovery point.
     */
    Status?: RecoveryPointStatus;
    /**
     * A message explaining the reason of the recovery point deletion failure.
     */
    StatusMessage?: string;
    /**
     * The server-side encryption key that is used to protect your backups; for example, arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab.
     */
    EncryptionKeyArn?: ARN;
    /**
     * The size, in bytes, of a backup.
     */
    BackupSizeBytes?: Long;
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName?: BackupVaultName;
    /**
     * This is a boolean value indicating this is a parent (composite) recovery point.
     */
    IsParent?: boolean;
    /**
     * This is the Amazon Resource Name (ARN) of the parent (composite) recovery point.
     */
    ParentRecoveryPointArn?: ARN;
    /**
     * This is the non-unique name of the resource that belongs to the specified backup.
     */
    ResourceName?: string;
  }
  export type RecoveryPointByResourceList = RecoveryPointByResource[];
  export interface RecoveryPointCreator {
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId?: string;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a backup plan; for example, arn:aws:backup:us-east-1:123456789012:plan:8F81F553-3A74-4A3F-B93D-B3360DC80C50.
     */
    BackupPlanArn?: ARN;
    /**
     * Version IDs are unique, randomly generated, Unicode, UTF-8 encoded strings that are at most 1,024 bytes long. They cannot be edited.
     */
    BackupPlanVersion?: string;
    /**
     * Uniquely identifies a rule used to schedule the backup of a selection of resources.
     */
    BackupRuleId?: string;
  }
  export interface RecoveryPointMember {
    /**
     * This is the Amazon Resource Name (ARN) of the parent (composite) recovery point.
     */
    RecoveryPointArn?: ARN;
    /**
     * This is the Amazon Resource Name (ARN) that uniquely identifies a saved resource.
     */
    ResourceArn?: ARN;
    /**
     * This is the Amazon Web Services resource type that is saved as a recovery point.
     */
    ResourceType?: ResourceType;
    /**
     * This is the name of the backup vault (the logical container in which backups are stored).
     */
    BackupVaultName?: BackupVaultName;
  }
  export interface RecoveryPointSelection {
    /**
     * These are the names of the vaults in which the selected recovery points are contained.
     */
    VaultNames?: VaultNames;
    /**
     * These are the resources included in the resource selection (including type of resources and vaults).
     */
    ResourceIdentifiers?: ResourceIdentifiers;
    DateRange?: DateRange;
  }
  export type RecoveryPointStatus = "COMPLETED"|"PARTIAL"|"DELETING"|"EXPIRED"|string;
  export type RecoveryPointsList = RecoveryPointMember[];
  export interface ReportDeliveryChannel {
    /**
     * The unique name of the S3 bucket that receives your reports.
     */
    S3BucketName: string;
    /**
     * The prefix for where Backup Audit Manager delivers your reports to Amazon S3. The prefix is this part of the following path: s3://your-bucket-name/prefix/Backup/us-west-2/year/month/day/report-name. If not specified, there is no prefix.
     */
    S3KeyPrefix?: string;
    /**
     * A list of the format of your reports: CSV, JSON, or both. If not specified, the default format is CSV.
     */
    Formats?: FormatList;
  }
  export interface ReportDestination {
    /**
     * The unique name of the Amazon S3 bucket that receives your reports.
     */
    S3BucketName?: string;
    /**
     * The object key that uniquely identifies your reports in your S3 bucket.
     */
    S3Keys?: stringList;
  }
  export interface ReportJob {
    /**
     * The identifier for a report job. A unique, randomly generated, Unicode, UTF-8 encoded string that is at most 1,024 bytes long. Report job IDs cannot be edited.
     */
    ReportJobId?: ReportJobId;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    ReportPlanArn?: ARN;
    /**
     * Identifies the report template for the report. Reports are built using a report template. The report templates are:   RESOURCE_COMPLIANCE_REPORT | CONTROL_COMPLIANCE_REPORT | BACKUP_JOB_REPORT | COPY_JOB_REPORT | RESTORE_JOB_REPORT 
     */
    ReportTemplate?: string;
    /**
     * The date and time that a report job is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationTime is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationTime?: timestamp;
    /**
     * The date and time that a report job is completed, in Unix format and Coordinated Universal Time (UTC). The value of CompletionTime is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CompletionTime?: timestamp;
    /**
     * The status of a report job. The statuses are:  CREATED | RUNNING | COMPLETED | FAILED   COMPLETED means that the report is available for your review at your designated destination. If the status is FAILED, review the StatusMessage for the reason.
     */
    Status?: string;
    /**
     * A message explaining the status of the report job.
     */
    StatusMessage?: string;
    /**
     * The S3 bucket name and S3 keys for the destination where the report job publishes the report.
     */
    ReportDestination?: ReportDestination;
  }
  export type ReportJobId = string;
  export type ReportJobList = ReportJob[];
  export interface ReportPlan {
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    ReportPlanArn?: ARN;
    /**
     * The unique name of the report plan. This name is between 1 and 256 characters starting with a letter, and consisting of letters (a-z, A-Z), numbers (0-9), and underscores (_).
     */
    ReportPlanName?: ReportPlanName;
    /**
     * An optional description of the report plan with a maximum 1,024 characters.
     */
    ReportPlanDescription?: ReportPlanDescription;
    /**
     * Identifies the report template for the report. Reports are built using a report template. The report templates are:  RESOURCE_COMPLIANCE_REPORT | CONTROL_COMPLIANCE_REPORT | BACKUP_JOB_REPORT | COPY_JOB_REPORT | RESTORE_JOB_REPORT  If the report template is RESOURCE_COMPLIANCE_REPORT or CONTROL_COMPLIANCE_REPORT, this API resource also describes the report coverage by Amazon Web Services Regions and frameworks.
     */
    ReportSetting?: ReportSetting;
    /**
     * Contains information about where and how to deliver your reports, specifically your Amazon S3 bucket name, S3 key prefix, and the formats of your reports.
     */
    ReportDeliveryChannel?: ReportDeliveryChannel;
    /**
     * The deployment status of a report plan. The statuses are:  CREATE_IN_PROGRESS | UPDATE_IN_PROGRESS | DELETE_IN_PROGRESS | COMPLETED 
     */
    DeploymentStatus?: string;
    /**
     * The date and time that a report plan is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationTime is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationTime?: timestamp;
    /**
     * The date and time that a report job associated with this report plan last attempted to run, in Unix format and Coordinated Universal Time (UTC). The value of LastAttemptedExecutionTime is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    LastAttemptedExecutionTime?: timestamp;
    /**
     * The date and time that a report job associated with this report plan last successfully ran, in Unix format and Coordinated Universal Time (UTC). The value of LastSuccessfulExecutionTime is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    LastSuccessfulExecutionTime?: timestamp;
  }
  export type ReportPlanDescription = string;
  export type ReportPlanList = ReportPlan[];
  export type ReportPlanName = string;
  export interface ReportSetting {
    /**
     * Identifies the report template for the report. Reports are built using a report template. The report templates are:  RESOURCE_COMPLIANCE_REPORT | CONTROL_COMPLIANCE_REPORT | BACKUP_JOB_REPORT | COPY_JOB_REPORT | RESTORE_JOB_REPORT 
     */
    ReportTemplate: string;
    /**
     * The Amazon Resource Names (ARNs) of the frameworks a report covers.
     */
    FrameworkArns?: stringList;
    /**
     * The number of frameworks a report covers.
     */
    NumberOfFrameworks?: integer;
    /**
     * These are the accounts to be included in the report.
     */
    Accounts?: stringList;
    /**
     * These are the Organizational Units to be included in the report.
     */
    OrganizationUnits?: stringList;
    /**
     * These are the Regions to be included in the report.
     */
    Regions?: stringList;
  }
  export type ResourceArns = ARN[];
  export type ResourceIdentifiers = string[];
  export type ResourceType = string;
  export type ResourceTypeList = ARN[];
  export type ResourceTypeManagementPreference = {[key: string]: IsEnabled};
  export type ResourceTypeOptInPreference = {[key: string]: IsEnabled};
  export type ResourceTypes = ResourceType[];
  export type RestoreJobId = string;
  export type RestoreJobStatus = "PENDING"|"RUNNING"|"COMPLETED"|"ABORTED"|"FAILED"|string;
  export type RestoreJobsList = RestoreJobsListMember[];
  export interface RestoreJobsListMember {
    /**
     * The account ID that owns the restore job.
     */
    AccountId?: AccountId;
    /**
     * Uniquely identifies the job that restores a recovery point.
     */
    RestoreJobId?: string;
    /**
     * An ARN that uniquely identifies a recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    RecoveryPointArn?: ARN;
    /**
     * The date and time a restore job is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * The date and time a job to restore a recovery point is completed, in Unix format and Coordinated Universal Time (UTC). The value of CompletionDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CompletionDate?: timestamp;
    /**
     * A status code specifying the state of the job initiated by Backup to restore a recovery point.
     */
    Status?: RestoreJobStatus;
    /**
     * A detailed message explaining the status of the job to restore a recovery point.
     */
    StatusMessage?: string;
    /**
     * Contains an estimated percentage complete of a job at the time the job status was queried.
     */
    PercentDone?: string;
    /**
     * The size, in bytes, of the restored resource.
     */
    BackupSizeInBytes?: Long;
    /**
     * Specifies the IAM role ARN used to create the target recovery point; for example, arn:aws:iam::123456789012:role/S3Access.
     */
    IamRoleArn?: IAMRoleArn;
    /**
     * The amount of time in minutes that a job restoring a recovery point is expected to take.
     */
    ExpectedCompletionTimeMinutes?: Long;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    CreatedResourceArn?: ARN;
    /**
     * The resource type of the listed restore jobs; for example, an Amazon Elastic Block Store (Amazon EBS) volume or an Amazon Relational Database Service (Amazon RDS) database. For Windows Volume Shadow Copy Service (VSS) backups, the only supported resource type is Amazon EC2.
     */
    ResourceType?: ResourceType;
  }
  export interface StartBackupJobInput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName: BackupVaultName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    ResourceArn: ARN;
    /**
     * Specifies the IAM role ARN used to create the target recovery point; for example, arn:aws:iam::123456789012:role/S3Access.
     */
    IamRoleArn: IAMRoleArn;
    /**
     * A customer-chosen string that you can use to distinguish between otherwise identical calls to StartBackupJob. Retrying a successful request with the same idempotency token results in a success message with no action taken.
     */
    IdempotencyToken?: string;
    /**
     * A value in minutes after a backup is scheduled before a job will be canceled if it doesn't start successfully. This value is optional, and the default is 8 hours. If this value is included, it must be at least 60 minutes to avoid errors. This parameter has a maximum value of 100 years (52,560,000 minutes). During the start window, the backup job status remains in CREATED status until it has successfully begun or until the start window time has run out. If within the start window time Backup receives an error that allows the job to be retried, Backup will automatically retry to begin the job at least every 10 minutes until the backup successfully begins (the job status changes to RUNNING) or until the job status changes to EXPIRED (which is expected to occur when the start window time is over).
     */
    StartWindowMinutes?: WindowMinutes;
    /**
     * A value in minutes during which a successfully started backup must complete, or else Backup will cancel the job. This value is optional. This value begins counting down from when the backup was scheduled. It does not add additional time for StartWindowMinutes, or if the backup started later than scheduled. Like StartWindowMinutes, this parameter has a maximum value of 100 years (52,560,000 minutes).
     */
    CompleteWindowMinutes?: WindowMinutes;
    /**
     * The lifecycle defines when a protected resource is transitioned to cold storage and when it expires. Backup will transition and expire backups automatically according to the lifecycle that you define.  Backups transitioned to cold storage must be stored in cold storage for a minimum of 90 days. Therefore, the “retention” setting must be 90 days greater than the “transition to cold after days” setting. The “transition to cold after days” setting cannot be changed after a backup has been transitioned to cold.  Resource types that are able to be transitioned to cold storage are listed in the "Lifecycle to cold storage" section of the  Feature availability by resource table. Backup ignores this expression for other resource types. This parameter has a maximum value of 100 years (36,500 days).
     */
    Lifecycle?: Lifecycle;
    /**
     * To help organize your resources, you can assign your own metadata to the resources that you create. Each tag is a key-value pair.
     */
    RecoveryPointTags?: Tags;
    /**
     * Specifies the backup option for a selected resource. This option is only available for Windows Volume Shadow Copy Service (VSS) backup jobs. Valid values: Set to "WindowsVSS":"enabled" to enable the WindowsVSS backup option and create a Windows VSS backup. Set to "WindowsVSS""disabled" to create a regular backup. The WindowsVSS option is not enabled by default.
     */
    BackupOptions?: BackupOptions;
  }
  export interface StartBackupJobOutput {
    /**
     * Uniquely identifies a request to Backup to back up a resource.
     */
    BackupJobId?: string;
    /**
     *  Note: This field is only returned for Amazon EFS and Advanced DynamoDB resources.  An ARN that uniquely identifies a recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    RecoveryPointArn?: ARN;
    /**
     * The date and time that a backup job is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * This is a returned boolean value indicating this is a parent (composite) backup job.
     */
    IsParent?: boolean;
  }
  export interface StartCopyJobInput {
    /**
     * An ARN that uniquely identifies a recovery point to use for the copy job; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45. 
     */
    RecoveryPointArn: ARN;
    /**
     * The name of a logical source container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    SourceBackupVaultName: BackupVaultName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a destination backup vault to copy to; for example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.
     */
    DestinationBackupVaultArn: ARN;
    /**
     * Specifies the IAM role ARN used to copy the target recovery point; for example, arn:aws:iam::123456789012:role/S3Access.
     */
    IamRoleArn: IAMRoleArn;
    /**
     * A customer-chosen string that you can use to distinguish between otherwise identical calls to StartCopyJob. Retrying a successful request with the same idempotency token results in a success message with no action taken.
     */
    IdempotencyToken?: string;
    Lifecycle?: Lifecycle;
  }
  export interface StartCopyJobOutput {
    /**
     * Uniquely identifies a copy job.
     */
    CopyJobId?: string;
    /**
     * The date and time that a copy job is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * This is a returned boolean value indicating this is a parent (composite) copy job.
     */
    IsParent?: boolean;
  }
  export interface StartReportJobInput {
    /**
     * The unique name of a report plan.
     */
    ReportPlanName: ReportPlanName;
    /**
     * A customer-chosen string that you can use to distinguish between otherwise identical calls to StartReportJobInput. Retrying a successful request with the same idempotency token results in a success message with no action taken.
     */
    IdempotencyToken?: string;
  }
  export interface StartReportJobOutput {
    /**
     * The identifier of the report job. A unique, randomly generated, Unicode, UTF-8 encoded string that is at most 1,024 bytes long. The report job ID cannot be edited.
     */
    ReportJobId?: ReportJobId;
  }
  export interface StartRestoreJobInput {
    /**
     * An ARN that uniquely identifies a recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    RecoveryPointArn: ARN;
    /**
     * A set of metadata key-value pairs. Contains information, such as a resource name, required to restore a recovery point.  You can get configuration metadata about a resource at the time it was backed up by calling GetRecoveryPointRestoreMetadata. However, values in addition to those provided by GetRecoveryPointRestoreMetadata might be required to restore a resource. For example, you might need to provide a new resource name if the original already exists. You need to specify specific metadata to restore an Amazon Elastic File System (Amazon EFS) instance:    file-system-id: The ID of the Amazon EFS file system that is backed up by Backup. Returned in GetRecoveryPointRestoreMetadata.    Encrypted: A Boolean value that, if true, specifies that the file system is encrypted. If KmsKeyId is specified, Encrypted must be set to true.    KmsKeyId: Specifies the Amazon Web Services KMS key that is used to encrypt the restored file system. You can specify a key from another Amazon Web Services account provided that key it is properly shared with your account via Amazon Web Services KMS.    PerformanceMode: Specifies the throughput mode of the file system.    CreationToken: A user-supplied value that ensures the uniqueness (idempotency) of the request.    newFileSystem: A Boolean value that, if true, specifies that the recovery point is restored to a new Amazon EFS file system.    ItemsToRestore: An array of one to five strings where each string is a file path. Use ItemsToRestore to restore specific files or directories rather than the entire file system. This parameter is optional. For example, "itemsToRestore":"[\"/my.test\"]".  
     */
    Metadata: Metadata;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that Backup uses to create the target resource; for example: arn:aws:iam::123456789012:role/S3Access.
     */
    IamRoleArn?: IAMRoleArn;
    /**
     * A customer-chosen string that you can use to distinguish between otherwise identical calls to StartRestoreJob. Retrying a successful request with the same idempotency token results in a success message with no action taken.
     */
    IdempotencyToken?: string;
    /**
     * Starts a job to restore a recovery point for one of the following resources:    Aurora for Amazon Aurora    DocumentDB for Amazon DocumentDB (with MongoDB compatibility)    CloudFormation for CloudFormation    DynamoDB for Amazon DynamoDB    EBS for Amazon Elastic Block Store    EC2 for Amazon Elastic Compute Cloud    EFS for Amazon Elastic File System    FSx for Amazon FSx    Neptune for Amazon Neptune    RDS for Amazon Relational Database Service    Redshift for Amazon Redshift    Storage Gateway for Storage Gateway    S3 for Amazon S3    Timestream for Amazon Timestream    VirtualMachine for virtual machines  
     */
    ResourceType?: ResourceType;
    /**
     * This is an optional parameter. If this equals True, tags included in the backup will be copied to the restored resource. This can only be applied to backups created through Backup.
     */
    CopySourceTagsToRestoredResource?: boolean;
  }
  export interface StartRestoreJobOutput {
    /**
     * Uniquely identifies the job that restores a recovery point.
     */
    RestoreJobId?: RestoreJobId;
  }
  export interface StopBackupJobInput {
    /**
     * Uniquely identifies a request to Backup to back up a resource.
     */
    BackupJobId: string;
  }
  export type StorageClass = "WARM"|"COLD"|"DELETED"|string;
  export type TagKey = string;
  export type TagKeyList = string[];
  export interface TagResourceInput {
    /**
     * An ARN that uniquely identifies a resource. The format of the ARN depends on the type of the tagged resource.
     */
    ResourceArn: ARN;
    /**
     * Key-value pairs that are used to help organize your resources. You can assign your own metadata to the resources you create. For clarity, this is the structure to assign tags: [{"Key":"string","Value":"string"}].
     */
    Tags: Tags;
  }
  export type TagValue = string;
  export type Tags = {[key: string]: TagValue};
  export type Timezone = string;
  export interface UntagResourceInput {
    /**
     * An ARN that uniquely identifies a resource. The format of the ARN depends on the type of the tagged resource.
     */
    ResourceArn: ARN;
    /**
     * A list of keys to identify which key-value tags to remove from a resource.
     */
    TagKeyList: TagKeyList;
  }
  export interface UpdateBackupPlanInput {
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId: string;
    /**
     * Specifies the body of a backup plan. Includes a BackupPlanName and one or more sets of Rules.
     */
    BackupPlan: BackupPlanInput;
  }
  export interface UpdateBackupPlanOutput {
    /**
     * Uniquely identifies a backup plan.
     */
    BackupPlanId?: string;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a backup plan; for example, arn:aws:backup:us-east-1:123456789012:plan:8F81F553-3A74-4A3F-B93D-B3360DC80C50.
     */
    BackupPlanArn?: ARN;
    /**
     * The date and time a backup plan is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationDate is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationDate?: timestamp;
    /**
     * Unique, randomly generated, Unicode, UTF-8 encoded strings that are at most 1,024 bytes long. Version Ids cannot be edited.
     */
    VersionId?: string;
    /**
     * Contains a list of BackupOptions for each resource type.
     */
    AdvancedBackupSettings?: AdvancedBackupSettings;
  }
  export interface UpdateFrameworkInput {
    /**
     * The unique name of a framework. This name is between 1 and 256 characters, starting with a letter, and consisting of letters (a-z, A-Z), numbers (0-9), and underscores (_).
     */
    FrameworkName: FrameworkName;
    /**
     * An optional description of the framework with a maximum 1,024 characters.
     */
    FrameworkDescription?: FrameworkDescription;
    /**
     * A list of the controls that make up the framework. Each control in the list has a name, input parameters, and scope.
     */
    FrameworkControls?: FrameworkControls;
    /**
     * A customer-chosen string that you can use to distinguish between otherwise identical calls to UpdateFrameworkInput. Retrying a successful request with the same idempotency token results in a success message with no action taken.
     */
    IdempotencyToken?: string;
  }
  export interface UpdateFrameworkOutput {
    /**
     * The unique name of a framework. This name is between 1 and 256 characters, starting with a letter, and consisting of letters (a-z, A-Z), numbers (0-9), and underscores (_).
     */
    FrameworkName?: FrameworkName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    FrameworkArn?: ARN;
    /**
     * The date and time that a framework is created, in ISO 8601 representation. The value of CreationTime is accurate to milliseconds. For example, 2020-07-10T15:00:00.000-08:00 represents the 10th of July 2020 at 3:00 PM 8 hours behind UTC.
     */
    CreationTime?: timestamp;
  }
  export interface UpdateGlobalSettingsInput {
    /**
     * A value for isCrossAccountBackupEnabled and a Region. Example: update-global-settings --global-settings isCrossAccountBackupEnabled=false --region us-west-2.
     */
    GlobalSettings?: GlobalSettings;
  }
  export interface UpdateRecoveryPointLifecycleInput {
    /**
     * The name of a logical container where backups are stored. Backup vaults are identified by names that are unique to the account used to create them and the Amazon Web Services Region where they are created. They consist of lowercase letters, numbers, and hyphens.
     */
    BackupVaultName: BackupVaultName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    RecoveryPointArn: ARN;
    /**
     * The lifecycle defines when a protected resource is transitioned to cold storage and when it expires. Backup transitions and expires backups automatically according to the lifecycle that you define.  Backups transitioned to cold storage must be stored in cold storage for a minimum of 90 days. Therefore, the “retention” setting must be 90 days greater than the “transition to cold after days” setting. The “transition to cold after days” setting cannot be changed after a backup has been transitioned to cold. 
     */
    Lifecycle?: Lifecycle;
  }
  export interface UpdateRecoveryPointLifecycleOutput {
    /**
     * An ARN that uniquely identifies a backup vault; for example, arn:aws:backup:us-east-1:123456789012:vault:aBackupVault.
     */
    BackupVaultArn?: ARN;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a recovery point; for example, arn:aws:backup:us-east-1:123456789012:recovery-point:1EB3B5E7-9EB0-435A-A80B-108B488B0D45.
     */
    RecoveryPointArn?: ARN;
    /**
     * The lifecycle defines when a protected resource is transitioned to cold storage and when it expires. Backup transitions and expires backups automatically according to the lifecycle that you define. Backups transitioned to cold storage must be stored in cold storage for a minimum of 90 days. Therefore, the “retention” setting must be 90 days greater than the “transition to cold after days” setting. The “transition to cold after days” setting cannot be changed after a backup has been transitioned to cold. Resource types that are able to be transitioned to cold storage are listed in the "Lifecycle to cold storage" section of the  Feature availability by resource table. Backup ignores this expression for other resource types.
     */
    Lifecycle?: Lifecycle;
    /**
     * A CalculatedLifecycle object containing DeleteAt and MoveToColdStorageAt timestamps.
     */
    CalculatedLifecycle?: CalculatedLifecycle;
  }
  export interface UpdateRegionSettingsInput {
    /**
     * Updates the list of services along with the opt-in preferences for the Region.
     */
    ResourceTypeOptInPreference?: ResourceTypeOptInPreference;
    /**
     * Enables or disables full Backup management of backups for a resource type. To enable full Backup management for DynamoDB along with  Backup's advanced DynamoDB backup features, follow the procedure to  enable advanced DynamoDB backup programmatically.
     */
    ResourceTypeManagementPreference?: ResourceTypeManagementPreference;
  }
  export interface UpdateReportPlanInput {
    /**
     * The unique name of the report plan. This name is between 1 and 256 characters, starting with a letter, and consisting of letters (a-z, A-Z), numbers (0-9), and underscores (_).
     */
    ReportPlanName: ReportPlanName;
    /**
     * An optional description of the report plan with a maximum 1,024 characters.
     */
    ReportPlanDescription?: ReportPlanDescription;
    /**
     * A structure that contains information about where to deliver your reports, specifically your Amazon S3 bucket name, S3 key prefix, and the formats of your reports.
     */
    ReportDeliveryChannel?: ReportDeliveryChannel;
    /**
     * Identifies the report template for the report. Reports are built using a report template. The report templates are:  RESOURCE_COMPLIANCE_REPORT | CONTROL_COMPLIANCE_REPORT | BACKUP_JOB_REPORT | COPY_JOB_REPORT | RESTORE_JOB_REPORT  If the report template is RESOURCE_COMPLIANCE_REPORT or CONTROL_COMPLIANCE_REPORT, this API resource also describes the report coverage by Amazon Web Services Regions and frameworks.
     */
    ReportSetting?: ReportSetting;
    /**
     * A customer-chosen string that you can use to distinguish between otherwise identical calls to UpdateReportPlanInput. Retrying a successful request with the same idempotency token results in a success message with no action taken.
     */
    IdempotencyToken?: string;
  }
  export interface UpdateReportPlanOutput {
    /**
     * The unique name of the report plan.
     */
    ReportPlanName?: ReportPlanName;
    /**
     * An Amazon Resource Name (ARN) that uniquely identifies a resource. The format of the ARN depends on the resource type.
     */
    ReportPlanArn?: ARN;
    /**
     * The date and time that a report plan is created, in Unix format and Coordinated Universal Time (UTC). The value of CreationTime is accurate to milliseconds. For example, the value 1516925490.087 represents Friday, January 26, 2018 12:11:30.087 AM.
     */
    CreationTime?: timestamp;
  }
  export type VaultNames = string[];
  export type VaultState = "CREATING"|"AVAILABLE"|"FAILED"|string;
  export type VaultType = "BACKUP_VAULT"|"LOGICALLY_AIR_GAPPED_BACKUP_VAULT"|string;
  export type WindowMinutes = number;
  export type integer = number;
  export type long = number;
  export type stringList = string[];
  export type stringMap = {[key: string]: string};
  export type timestamp = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-11-15"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Backup client.
   */
  export import Types = Backup;
}
export = Backup;
