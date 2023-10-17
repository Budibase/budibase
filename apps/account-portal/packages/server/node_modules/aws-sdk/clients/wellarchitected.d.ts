import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class WellArchitected extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: WellArchitected.Types.ClientConfiguration)
  config: Config & WellArchitected.Types.ClientConfiguration;
  /**
   * Associate a lens to a workload. Up to 10 lenses can be associated with a workload in a single API operation. A maximum of 20 lenses can be associated with a workload.   Disclaimer  By accessing and/or applying custom lenses created by another Amazon Web Services user or account, you acknowledge that custom lenses created by other users and shared with you are Third Party Content as defined in the Amazon Web Services Customer Agreement.  
   */
  associateLenses(params: WellArchitected.Types.AssociateLensesInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associate a lens to a workload. Up to 10 lenses can be associated with a workload in a single API operation. A maximum of 20 lenses can be associated with a workload.   Disclaimer  By accessing and/or applying custom lenses created by another Amazon Web Services user or account, you acknowledge that custom lenses created by other users and shared with you are Third Party Content as defined in the Amazon Web Services Customer Agreement.  
   */
  associateLenses(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associate a profile with a workload.
   */
  associateProfiles(params: WellArchitected.Types.AssociateProfilesInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associate a profile with a workload.
   */
  associateProfiles(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Create a lens share. The owner of a lens can share it with other Amazon Web Services accounts, users, an organization, and organizational units (OUs) in the same Amazon Web Services Region. Lenses provided by Amazon Web Services (Amazon Web Services Official Content) cannot be shared.  Shared access to a lens is not removed until the lens invitation is deleted. If you share a lens with an organization or OU, all accounts in the organization or OU are granted access to the lens. For more information, see Sharing a custom lens in the Well-Architected Tool User Guide.   Disclaimer  By sharing your custom lenses with other Amazon Web Services accounts, you acknowledge that Amazon Web Services will make your custom lenses available to those other accounts. Those other accounts may continue to access and use your shared custom lenses even if you delete the custom lenses from your own Amazon Web Services account or terminate your Amazon Web Services account. 
   */
  createLensShare(params: WellArchitected.Types.CreateLensShareInput, callback?: (err: AWSError, data: WellArchitected.Types.CreateLensShareOutput) => void): Request<WellArchitected.Types.CreateLensShareOutput, AWSError>;
  /**
   * Create a lens share. The owner of a lens can share it with other Amazon Web Services accounts, users, an organization, and organizational units (OUs) in the same Amazon Web Services Region. Lenses provided by Amazon Web Services (Amazon Web Services Official Content) cannot be shared.  Shared access to a lens is not removed until the lens invitation is deleted. If you share a lens with an organization or OU, all accounts in the organization or OU are granted access to the lens. For more information, see Sharing a custom lens in the Well-Architected Tool User Guide.   Disclaimer  By sharing your custom lenses with other Amazon Web Services accounts, you acknowledge that Amazon Web Services will make your custom lenses available to those other accounts. Those other accounts may continue to access and use your shared custom lenses even if you delete the custom lenses from your own Amazon Web Services account or terminate your Amazon Web Services account. 
   */
  createLensShare(callback?: (err: AWSError, data: WellArchitected.Types.CreateLensShareOutput) => void): Request<WellArchitected.Types.CreateLensShareOutput, AWSError>;
  /**
   * Create a new lens version. A lens can have up to 100 versions. Use this operation to publish a new lens version after you have imported a lens. The LensAlias is used to identify the lens to be published. The owner of a lens can share the lens with other Amazon Web Services accounts and users in the same Amazon Web Services Region. Only the owner of a lens can delete it. 
   */
  createLensVersion(params: WellArchitected.Types.CreateLensVersionInput, callback?: (err: AWSError, data: WellArchitected.Types.CreateLensVersionOutput) => void): Request<WellArchitected.Types.CreateLensVersionOutput, AWSError>;
  /**
   * Create a new lens version. A lens can have up to 100 versions. Use this operation to publish a new lens version after you have imported a lens. The LensAlias is used to identify the lens to be published. The owner of a lens can share the lens with other Amazon Web Services accounts and users in the same Amazon Web Services Region. Only the owner of a lens can delete it. 
   */
  createLensVersion(callback?: (err: AWSError, data: WellArchitected.Types.CreateLensVersionOutput) => void): Request<WellArchitected.Types.CreateLensVersionOutput, AWSError>;
  /**
   * Create a milestone for an existing workload.
   */
  createMilestone(params: WellArchitected.Types.CreateMilestoneInput, callback?: (err: AWSError, data: WellArchitected.Types.CreateMilestoneOutput) => void): Request<WellArchitected.Types.CreateMilestoneOutput, AWSError>;
  /**
   * Create a milestone for an existing workload.
   */
  createMilestone(callback?: (err: AWSError, data: WellArchitected.Types.CreateMilestoneOutput) => void): Request<WellArchitected.Types.CreateMilestoneOutput, AWSError>;
  /**
   * Create a profile.
   */
  createProfile(params: WellArchitected.Types.CreateProfileInput, callback?: (err: AWSError, data: WellArchitected.Types.CreateProfileOutput) => void): Request<WellArchitected.Types.CreateProfileOutput, AWSError>;
  /**
   * Create a profile.
   */
  createProfile(callback?: (err: AWSError, data: WellArchitected.Types.CreateProfileOutput) => void): Request<WellArchitected.Types.CreateProfileOutput, AWSError>;
  /**
   * Create a profile share.
   */
  createProfileShare(params: WellArchitected.Types.CreateProfileShareInput, callback?: (err: AWSError, data: WellArchitected.Types.CreateProfileShareOutput) => void): Request<WellArchitected.Types.CreateProfileShareOutput, AWSError>;
  /**
   * Create a profile share.
   */
  createProfileShare(callback?: (err: AWSError, data: WellArchitected.Types.CreateProfileShareOutput) => void): Request<WellArchitected.Types.CreateProfileShareOutput, AWSError>;
  /**
   * Create a review template.   Disclaimer  Do not include or gather personal identifiable information (PII) of end users or other identifiable individuals in or via your review templates. If your review template or those shared with you and used in your account do include or collect PII you are responsible for: ensuring that the included PII is processed in accordance with applicable law, providing adequate privacy notices, and obtaining necessary consents for processing such data. 
   */
  createReviewTemplate(params: WellArchitected.Types.CreateReviewTemplateInput, callback?: (err: AWSError, data: WellArchitected.Types.CreateReviewTemplateOutput) => void): Request<WellArchitected.Types.CreateReviewTemplateOutput, AWSError>;
  /**
   * Create a review template.   Disclaimer  Do not include or gather personal identifiable information (PII) of end users or other identifiable individuals in or via your review templates. If your review template or those shared with you and used in your account do include or collect PII you are responsible for: ensuring that the included PII is processed in accordance with applicable law, providing adequate privacy notices, and obtaining necessary consents for processing such data. 
   */
  createReviewTemplate(callback?: (err: AWSError, data: WellArchitected.Types.CreateReviewTemplateOutput) => void): Request<WellArchitected.Types.CreateReviewTemplateOutput, AWSError>;
  /**
   * Create a review template share. The owner of a review template can share it with other Amazon Web Services accounts, users, an organization, and organizational units (OUs) in the same Amazon Web Services Region.   Shared access to a review template is not removed until the review template share invitation is deleted. If you share a review template with an organization or OU, all accounts in the organization or OU are granted access to the review template.   Disclaimer  By sharing your review template with other Amazon Web Services accounts, you acknowledge that Amazon Web Services will make your review template available to those other accounts. 
   */
  createTemplateShare(params: WellArchitected.Types.CreateTemplateShareInput, callback?: (err: AWSError, data: WellArchitected.Types.CreateTemplateShareOutput) => void): Request<WellArchitected.Types.CreateTemplateShareOutput, AWSError>;
  /**
   * Create a review template share. The owner of a review template can share it with other Amazon Web Services accounts, users, an organization, and organizational units (OUs) in the same Amazon Web Services Region.   Shared access to a review template is not removed until the review template share invitation is deleted. If you share a review template with an organization or OU, all accounts in the organization or OU are granted access to the review template.   Disclaimer  By sharing your review template with other Amazon Web Services accounts, you acknowledge that Amazon Web Services will make your review template available to those other accounts. 
   */
  createTemplateShare(callback?: (err: AWSError, data: WellArchitected.Types.CreateTemplateShareOutput) => void): Request<WellArchitected.Types.CreateTemplateShareOutput, AWSError>;
  /**
   * Create a new workload. The owner of a workload can share the workload with other Amazon Web Services accounts, users, an organization, and organizational units (OUs) in the same Amazon Web Services Region. Only the owner of a workload can delete it. For more information, see Defining a Workload in the Well-Architected Tool User Guide.  Either AwsRegions, NonAwsRegions, or both must be specified when creating a workload. You also must specify ReviewOwner, even though the parameter is listed as not being required in the following section.   When creating a workload using a review template, you must have the following IAM permissions:    wellarchitected:GetReviewTemplate     wellarchitected:GetReviewTemplateAnswer     wellarchitected:ListReviewTemplateAnswers     wellarchitected:GetReviewTemplateLensReview   
   */
  createWorkload(params: WellArchitected.Types.CreateWorkloadInput, callback?: (err: AWSError, data: WellArchitected.Types.CreateWorkloadOutput) => void): Request<WellArchitected.Types.CreateWorkloadOutput, AWSError>;
  /**
   * Create a new workload. The owner of a workload can share the workload with other Amazon Web Services accounts, users, an organization, and organizational units (OUs) in the same Amazon Web Services Region. Only the owner of a workload can delete it. For more information, see Defining a Workload in the Well-Architected Tool User Guide.  Either AwsRegions, NonAwsRegions, or both must be specified when creating a workload. You also must specify ReviewOwner, even though the parameter is listed as not being required in the following section.   When creating a workload using a review template, you must have the following IAM permissions:    wellarchitected:GetReviewTemplate     wellarchitected:GetReviewTemplateAnswer     wellarchitected:ListReviewTemplateAnswers     wellarchitected:GetReviewTemplateLensReview   
   */
  createWorkload(callback?: (err: AWSError, data: WellArchitected.Types.CreateWorkloadOutput) => void): Request<WellArchitected.Types.CreateWorkloadOutput, AWSError>;
  /**
   * Create a workload share. The owner of a workload can share it with other Amazon Web Services accounts and users in the same Amazon Web Services Region. Shared access to a workload is not removed until the workload invitation is deleted. If you share a workload with an organization or OU, all accounts in the organization or OU are granted access to the workload. For more information, see Sharing a workload in the Well-Architected Tool User Guide.
   */
  createWorkloadShare(params: WellArchitected.Types.CreateWorkloadShareInput, callback?: (err: AWSError, data: WellArchitected.Types.CreateWorkloadShareOutput) => void): Request<WellArchitected.Types.CreateWorkloadShareOutput, AWSError>;
  /**
   * Create a workload share. The owner of a workload can share it with other Amazon Web Services accounts and users in the same Amazon Web Services Region. Shared access to a workload is not removed until the workload invitation is deleted. If you share a workload with an organization or OU, all accounts in the organization or OU are granted access to the workload. For more information, see Sharing a workload in the Well-Architected Tool User Guide.
   */
  createWorkloadShare(callback?: (err: AWSError, data: WellArchitected.Types.CreateWorkloadShareOutput) => void): Request<WellArchitected.Types.CreateWorkloadShareOutput, AWSError>;
  /**
   * Delete an existing lens. Only the owner of a lens can delete it. After the lens is deleted, Amazon Web Services accounts and users that you shared the lens with can continue to use it, but they will no longer be able to apply it to new workloads.    Disclaimer  By sharing your custom lenses with other Amazon Web Services accounts, you acknowledge that Amazon Web Services will make your custom lenses available to those other accounts. Those other accounts may continue to access and use your shared custom lenses even if you delete the custom lenses from your own Amazon Web Services account or terminate your Amazon Web Services account. 
   */
  deleteLens(params: WellArchitected.Types.DeleteLensInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete an existing lens. Only the owner of a lens can delete it. After the lens is deleted, Amazon Web Services accounts and users that you shared the lens with can continue to use it, but they will no longer be able to apply it to new workloads.    Disclaimer  By sharing your custom lenses with other Amazon Web Services accounts, you acknowledge that Amazon Web Services will make your custom lenses available to those other accounts. Those other accounts may continue to access and use your shared custom lenses even if you delete the custom lenses from your own Amazon Web Services account or terminate your Amazon Web Services account. 
   */
  deleteLens(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a lens share. After the lens share is deleted, Amazon Web Services accounts, users, organizations, and organizational units (OUs) that you shared the lens with can continue to use it, but they will no longer be able to apply it to new workloads.   Disclaimer  By sharing your custom lenses with other Amazon Web Services accounts, you acknowledge that Amazon Web Services will make your custom lenses available to those other accounts. Those other accounts may continue to access and use your shared custom lenses even if you delete the custom lenses from your own Amazon Web Services account or terminate your Amazon Web Services account. 
   */
  deleteLensShare(params: WellArchitected.Types.DeleteLensShareInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a lens share. After the lens share is deleted, Amazon Web Services accounts, users, organizations, and organizational units (OUs) that you shared the lens with can continue to use it, but they will no longer be able to apply it to new workloads.   Disclaimer  By sharing your custom lenses with other Amazon Web Services accounts, you acknowledge that Amazon Web Services will make your custom lenses available to those other accounts. Those other accounts may continue to access and use your shared custom lenses even if you delete the custom lenses from your own Amazon Web Services account or terminate your Amazon Web Services account. 
   */
  deleteLensShare(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a profile.   Disclaimer  By sharing your profile with other Amazon Web Services accounts, you acknowledge that Amazon Web Services will make your profile available to those other accounts. Those other accounts may continue to access and use your shared profile even if you delete the profile from your own Amazon Web Services account or terminate your Amazon Web Services account. 
   */
  deleteProfile(params: WellArchitected.Types.DeleteProfileInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a profile.   Disclaimer  By sharing your profile with other Amazon Web Services accounts, you acknowledge that Amazon Web Services will make your profile available to those other accounts. Those other accounts may continue to access and use your shared profile even if you delete the profile from your own Amazon Web Services account or terminate your Amazon Web Services account. 
   */
  deleteProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a profile share.
   */
  deleteProfileShare(params: WellArchitected.Types.DeleteProfileShareInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a profile share.
   */
  deleteProfileShare(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a review template. Only the owner of a review template can delete it. After the review template is deleted, Amazon Web Services accounts, users, organizations, and organizational units (OUs) that you shared the review template with will no longer be able to apply it to new workloads.
   */
  deleteReviewTemplate(params: WellArchitected.Types.DeleteReviewTemplateInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a review template. Only the owner of a review template can delete it. After the review template is deleted, Amazon Web Services accounts, users, organizations, and organizational units (OUs) that you shared the review template with will no longer be able to apply it to new workloads.
   */
  deleteReviewTemplate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a review template share. After the review template share is deleted, Amazon Web Services accounts, users, organizations, and organizational units (OUs) that you shared the review template with will no longer be able to apply it to new workloads.
   */
  deleteTemplateShare(params: WellArchitected.Types.DeleteTemplateShareInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a review template share. After the review template share is deleted, Amazon Web Services accounts, users, organizations, and organizational units (OUs) that you shared the review template with will no longer be able to apply it to new workloads.
   */
  deleteTemplateShare(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete an existing workload.
   */
  deleteWorkload(params: WellArchitected.Types.DeleteWorkloadInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete an existing workload.
   */
  deleteWorkload(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a workload share.
   */
  deleteWorkloadShare(params: WellArchitected.Types.DeleteWorkloadShareInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a workload share.
   */
  deleteWorkloadShare(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociate a lens from a workload. Up to 10 lenses can be disassociated from a workload in a single API operation.  The Amazon Web Services Well-Architected Framework lens (wellarchitected) cannot be removed from a workload. 
   */
  disassociateLenses(params: WellArchitected.Types.DisassociateLensesInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociate a lens from a workload. Up to 10 lenses can be disassociated from a workload in a single API operation.  The Amazon Web Services Well-Architected Framework lens (wellarchitected) cannot be removed from a workload. 
   */
  disassociateLenses(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociate a profile from a workload.
   */
  disassociateProfiles(params: WellArchitected.Types.DisassociateProfilesInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociate a profile from a workload.
   */
  disassociateProfiles(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Export an existing lens. Only the owner of a lens can export it. Lenses provided by Amazon Web Services (Amazon Web Services Official Content) cannot be exported. Lenses are defined in JSON. For more information, see JSON format specification in the Well-Architected Tool User Guide.   Disclaimer  Do not include or gather personal identifiable information (PII) of end users or other identifiable individuals in or via your custom lenses. If your custom lens or those shared with you and used in your account do include or collect PII you are responsible for: ensuring that the included PII is processed in accordance with applicable law, providing adequate privacy notices, and obtaining necessary consents for processing such data. 
   */
  exportLens(params: WellArchitected.Types.ExportLensInput, callback?: (err: AWSError, data: WellArchitected.Types.ExportLensOutput) => void): Request<WellArchitected.Types.ExportLensOutput, AWSError>;
  /**
   * Export an existing lens. Only the owner of a lens can export it. Lenses provided by Amazon Web Services (Amazon Web Services Official Content) cannot be exported. Lenses are defined in JSON. For more information, see JSON format specification in the Well-Architected Tool User Guide.   Disclaimer  Do not include or gather personal identifiable information (PII) of end users or other identifiable individuals in or via your custom lenses. If your custom lens or those shared with you and used in your account do include or collect PII you are responsible for: ensuring that the included PII is processed in accordance with applicable law, providing adequate privacy notices, and obtaining necessary consents for processing such data. 
   */
  exportLens(callback?: (err: AWSError, data: WellArchitected.Types.ExportLensOutput) => void): Request<WellArchitected.Types.ExportLensOutput, AWSError>;
  /**
   * Get the answer to a specific question in a workload review.
   */
  getAnswer(params: WellArchitected.Types.GetAnswerInput, callback?: (err: AWSError, data: WellArchitected.Types.GetAnswerOutput) => void): Request<WellArchitected.Types.GetAnswerOutput, AWSError>;
  /**
   * Get the answer to a specific question in a workload review.
   */
  getAnswer(callback?: (err: AWSError, data: WellArchitected.Types.GetAnswerOutput) => void): Request<WellArchitected.Types.GetAnswerOutput, AWSError>;
  /**
   * Get a consolidated report of your workloads. You can optionally choose to include workloads that have been shared with you.
   */
  getConsolidatedReport(params: WellArchitected.Types.GetConsolidatedReportInput, callback?: (err: AWSError, data: WellArchitected.Types.GetConsolidatedReportOutput) => void): Request<WellArchitected.Types.GetConsolidatedReportOutput, AWSError>;
  /**
   * Get a consolidated report of your workloads. You can optionally choose to include workloads that have been shared with you.
   */
  getConsolidatedReport(callback?: (err: AWSError, data: WellArchitected.Types.GetConsolidatedReportOutput) => void): Request<WellArchitected.Types.GetConsolidatedReportOutput, AWSError>;
  /**
   * Get an existing lens.
   */
  getLens(params: WellArchitected.Types.GetLensInput, callback?: (err: AWSError, data: WellArchitected.Types.GetLensOutput) => void): Request<WellArchitected.Types.GetLensOutput, AWSError>;
  /**
   * Get an existing lens.
   */
  getLens(callback?: (err: AWSError, data: WellArchitected.Types.GetLensOutput) => void): Request<WellArchitected.Types.GetLensOutput, AWSError>;
  /**
   * Get lens review.
   */
  getLensReview(params: WellArchitected.Types.GetLensReviewInput, callback?: (err: AWSError, data: WellArchitected.Types.GetLensReviewOutput) => void): Request<WellArchitected.Types.GetLensReviewOutput, AWSError>;
  /**
   * Get lens review.
   */
  getLensReview(callback?: (err: AWSError, data: WellArchitected.Types.GetLensReviewOutput) => void): Request<WellArchitected.Types.GetLensReviewOutput, AWSError>;
  /**
   * Get lens review report.
   */
  getLensReviewReport(params: WellArchitected.Types.GetLensReviewReportInput, callback?: (err: AWSError, data: WellArchitected.Types.GetLensReviewReportOutput) => void): Request<WellArchitected.Types.GetLensReviewReportOutput, AWSError>;
  /**
   * Get lens review report.
   */
  getLensReviewReport(callback?: (err: AWSError, data: WellArchitected.Types.GetLensReviewReportOutput) => void): Request<WellArchitected.Types.GetLensReviewReportOutput, AWSError>;
  /**
   * Get lens version differences.
   */
  getLensVersionDifference(params: WellArchitected.Types.GetLensVersionDifferenceInput, callback?: (err: AWSError, data: WellArchitected.Types.GetLensVersionDifferenceOutput) => void): Request<WellArchitected.Types.GetLensVersionDifferenceOutput, AWSError>;
  /**
   * Get lens version differences.
   */
  getLensVersionDifference(callback?: (err: AWSError, data: WellArchitected.Types.GetLensVersionDifferenceOutput) => void): Request<WellArchitected.Types.GetLensVersionDifferenceOutput, AWSError>;
  /**
   * Get a milestone for an existing workload.
   */
  getMilestone(params: WellArchitected.Types.GetMilestoneInput, callback?: (err: AWSError, data: WellArchitected.Types.GetMilestoneOutput) => void): Request<WellArchitected.Types.GetMilestoneOutput, AWSError>;
  /**
   * Get a milestone for an existing workload.
   */
  getMilestone(callback?: (err: AWSError, data: WellArchitected.Types.GetMilestoneOutput) => void): Request<WellArchitected.Types.GetMilestoneOutput, AWSError>;
  /**
   * Get profile information.
   */
  getProfile(params: WellArchitected.Types.GetProfileInput, callback?: (err: AWSError, data: WellArchitected.Types.GetProfileOutput) => void): Request<WellArchitected.Types.GetProfileOutput, AWSError>;
  /**
   * Get profile information.
   */
  getProfile(callback?: (err: AWSError, data: WellArchitected.Types.GetProfileOutput) => void): Request<WellArchitected.Types.GetProfileOutput, AWSError>;
  /**
   * Get profile template.
   */
  getProfileTemplate(params: WellArchitected.Types.GetProfileTemplateInput, callback?: (err: AWSError, data: WellArchitected.Types.GetProfileTemplateOutput) => void): Request<WellArchitected.Types.GetProfileTemplateOutput, AWSError>;
  /**
   * Get profile template.
   */
  getProfileTemplate(callback?: (err: AWSError, data: WellArchitected.Types.GetProfileTemplateOutput) => void): Request<WellArchitected.Types.GetProfileTemplateOutput, AWSError>;
  /**
   * Get review template.
   */
  getReviewTemplate(params: WellArchitected.Types.GetReviewTemplateInput, callback?: (err: AWSError, data: WellArchitected.Types.GetReviewTemplateOutput) => void): Request<WellArchitected.Types.GetReviewTemplateOutput, AWSError>;
  /**
   * Get review template.
   */
  getReviewTemplate(callback?: (err: AWSError, data: WellArchitected.Types.GetReviewTemplateOutput) => void): Request<WellArchitected.Types.GetReviewTemplateOutput, AWSError>;
  /**
   * Get review template answer.
   */
  getReviewTemplateAnswer(params: WellArchitected.Types.GetReviewTemplateAnswerInput, callback?: (err: AWSError, data: WellArchitected.Types.GetReviewTemplateAnswerOutput) => void): Request<WellArchitected.Types.GetReviewTemplateAnswerOutput, AWSError>;
  /**
   * Get review template answer.
   */
  getReviewTemplateAnswer(callback?: (err: AWSError, data: WellArchitected.Types.GetReviewTemplateAnswerOutput) => void): Request<WellArchitected.Types.GetReviewTemplateAnswerOutput, AWSError>;
  /**
   * Get a lens review associated with a review template.
   */
  getReviewTemplateLensReview(params: WellArchitected.Types.GetReviewTemplateLensReviewInput, callback?: (err: AWSError, data: WellArchitected.Types.GetReviewTemplateLensReviewOutput) => void): Request<WellArchitected.Types.GetReviewTemplateLensReviewOutput, AWSError>;
  /**
   * Get a lens review associated with a review template.
   */
  getReviewTemplateLensReview(callback?: (err: AWSError, data: WellArchitected.Types.GetReviewTemplateLensReviewOutput) => void): Request<WellArchitected.Types.GetReviewTemplateLensReviewOutput, AWSError>;
  /**
   * Get an existing workload.
   */
  getWorkload(params: WellArchitected.Types.GetWorkloadInput, callback?: (err: AWSError, data: WellArchitected.Types.GetWorkloadOutput) => void): Request<WellArchitected.Types.GetWorkloadOutput, AWSError>;
  /**
   * Get an existing workload.
   */
  getWorkload(callback?: (err: AWSError, data: WellArchitected.Types.GetWorkloadOutput) => void): Request<WellArchitected.Types.GetWorkloadOutput, AWSError>;
  /**
   * Import a new custom lens or update an existing custom lens. To update an existing custom lens, specify its ARN as the LensAlias. If no ARN is specified, a new custom lens is created. The new or updated lens will have a status of DRAFT. The lens cannot be applied to workloads or shared with other Amazon Web Services accounts until it's published with CreateLensVersion. Lenses are defined in JSON. For more information, see JSON format specification in the Well-Architected Tool User Guide. A custom lens cannot exceed 500 KB in size.   Disclaimer  Do not include or gather personal identifiable information (PII) of end users or other identifiable individuals in or via your custom lenses. If your custom lens or those shared with you and used in your account do include or collect PII you are responsible for: ensuring that the included PII is processed in accordance with applicable law, providing adequate privacy notices, and obtaining necessary consents for processing such data. 
   */
  importLens(params: WellArchitected.Types.ImportLensInput, callback?: (err: AWSError, data: WellArchitected.Types.ImportLensOutput) => void): Request<WellArchitected.Types.ImportLensOutput, AWSError>;
  /**
   * Import a new custom lens or update an existing custom lens. To update an existing custom lens, specify its ARN as the LensAlias. If no ARN is specified, a new custom lens is created. The new or updated lens will have a status of DRAFT. The lens cannot be applied to workloads or shared with other Amazon Web Services accounts until it's published with CreateLensVersion. Lenses are defined in JSON. For more information, see JSON format specification in the Well-Architected Tool User Guide. A custom lens cannot exceed 500 KB in size.   Disclaimer  Do not include or gather personal identifiable information (PII) of end users or other identifiable individuals in or via your custom lenses. If your custom lens or those shared with you and used in your account do include or collect PII you are responsible for: ensuring that the included PII is processed in accordance with applicable law, providing adequate privacy notices, and obtaining necessary consents for processing such data. 
   */
  importLens(callback?: (err: AWSError, data: WellArchitected.Types.ImportLensOutput) => void): Request<WellArchitected.Types.ImportLensOutput, AWSError>;
  /**
   * List of answers for a particular workload and lens.
   */
  listAnswers(params: WellArchitected.Types.ListAnswersInput, callback?: (err: AWSError, data: WellArchitected.Types.ListAnswersOutput) => void): Request<WellArchitected.Types.ListAnswersOutput, AWSError>;
  /**
   * List of answers for a particular workload and lens.
   */
  listAnswers(callback?: (err: AWSError, data: WellArchitected.Types.ListAnswersOutput) => void): Request<WellArchitected.Types.ListAnswersOutput, AWSError>;
  /**
   * List of Trusted Advisor check details by account related to the workload.
   */
  listCheckDetails(params: WellArchitected.Types.ListCheckDetailsInput, callback?: (err: AWSError, data: WellArchitected.Types.ListCheckDetailsOutput) => void): Request<WellArchitected.Types.ListCheckDetailsOutput, AWSError>;
  /**
   * List of Trusted Advisor check details by account related to the workload.
   */
  listCheckDetails(callback?: (err: AWSError, data: WellArchitected.Types.ListCheckDetailsOutput) => void): Request<WellArchitected.Types.ListCheckDetailsOutput, AWSError>;
  /**
   * List of Trusted Advisor checks summarized for all accounts related to the workload.
   */
  listCheckSummaries(params: WellArchitected.Types.ListCheckSummariesInput, callback?: (err: AWSError, data: WellArchitected.Types.ListCheckSummariesOutput) => void): Request<WellArchitected.Types.ListCheckSummariesOutput, AWSError>;
  /**
   * List of Trusted Advisor checks summarized for all accounts related to the workload.
   */
  listCheckSummaries(callback?: (err: AWSError, data: WellArchitected.Types.ListCheckSummariesOutput) => void): Request<WellArchitected.Types.ListCheckSummariesOutput, AWSError>;
  /**
   * List lens review improvements.
   */
  listLensReviewImprovements(params: WellArchitected.Types.ListLensReviewImprovementsInput, callback?: (err: AWSError, data: WellArchitected.Types.ListLensReviewImprovementsOutput) => void): Request<WellArchitected.Types.ListLensReviewImprovementsOutput, AWSError>;
  /**
   * List lens review improvements.
   */
  listLensReviewImprovements(callback?: (err: AWSError, data: WellArchitected.Types.ListLensReviewImprovementsOutput) => void): Request<WellArchitected.Types.ListLensReviewImprovementsOutput, AWSError>;
  /**
   * List lens reviews for a particular workload.
   */
  listLensReviews(params: WellArchitected.Types.ListLensReviewsInput, callback?: (err: AWSError, data: WellArchitected.Types.ListLensReviewsOutput) => void): Request<WellArchitected.Types.ListLensReviewsOutput, AWSError>;
  /**
   * List lens reviews for a particular workload.
   */
  listLensReviews(callback?: (err: AWSError, data: WellArchitected.Types.ListLensReviewsOutput) => void): Request<WellArchitected.Types.ListLensReviewsOutput, AWSError>;
  /**
   * List the lens shares associated with the lens.
   */
  listLensShares(params: WellArchitected.Types.ListLensSharesInput, callback?: (err: AWSError, data: WellArchitected.Types.ListLensSharesOutput) => void): Request<WellArchitected.Types.ListLensSharesOutput, AWSError>;
  /**
   * List the lens shares associated with the lens.
   */
  listLensShares(callback?: (err: AWSError, data: WellArchitected.Types.ListLensSharesOutput) => void): Request<WellArchitected.Types.ListLensSharesOutput, AWSError>;
  /**
   * List the available lenses.
   */
  listLenses(params: WellArchitected.Types.ListLensesInput, callback?: (err: AWSError, data: WellArchitected.Types.ListLensesOutput) => void): Request<WellArchitected.Types.ListLensesOutput, AWSError>;
  /**
   * List the available lenses.
   */
  listLenses(callback?: (err: AWSError, data: WellArchitected.Types.ListLensesOutput) => void): Request<WellArchitected.Types.ListLensesOutput, AWSError>;
  /**
   * List all milestones for an existing workload.
   */
  listMilestones(params: WellArchitected.Types.ListMilestonesInput, callback?: (err: AWSError, data: WellArchitected.Types.ListMilestonesOutput) => void): Request<WellArchitected.Types.ListMilestonesOutput, AWSError>;
  /**
   * List all milestones for an existing workload.
   */
  listMilestones(callback?: (err: AWSError, data: WellArchitected.Types.ListMilestonesOutput) => void): Request<WellArchitected.Types.ListMilestonesOutput, AWSError>;
  /**
   * List lens notifications.
   */
  listNotifications(params: WellArchitected.Types.ListNotificationsInput, callback?: (err: AWSError, data: WellArchitected.Types.ListNotificationsOutput) => void): Request<WellArchitected.Types.ListNotificationsOutput, AWSError>;
  /**
   * List lens notifications.
   */
  listNotifications(callback?: (err: AWSError, data: WellArchitected.Types.ListNotificationsOutput) => void): Request<WellArchitected.Types.ListNotificationsOutput, AWSError>;
  /**
   * List profile notifications.
   */
  listProfileNotifications(params: WellArchitected.Types.ListProfileNotificationsInput, callback?: (err: AWSError, data: WellArchitected.Types.ListProfileNotificationsOutput) => void): Request<WellArchitected.Types.ListProfileNotificationsOutput, AWSError>;
  /**
   * List profile notifications.
   */
  listProfileNotifications(callback?: (err: AWSError, data: WellArchitected.Types.ListProfileNotificationsOutput) => void): Request<WellArchitected.Types.ListProfileNotificationsOutput, AWSError>;
  /**
   * List profile shares.
   */
  listProfileShares(params: WellArchitected.Types.ListProfileSharesInput, callback?: (err: AWSError, data: WellArchitected.Types.ListProfileSharesOutput) => void): Request<WellArchitected.Types.ListProfileSharesOutput, AWSError>;
  /**
   * List profile shares.
   */
  listProfileShares(callback?: (err: AWSError, data: WellArchitected.Types.ListProfileSharesOutput) => void): Request<WellArchitected.Types.ListProfileSharesOutput, AWSError>;
  /**
   * List profiles.
   */
  listProfiles(params: WellArchitected.Types.ListProfilesInput, callback?: (err: AWSError, data: WellArchitected.Types.ListProfilesOutput) => void): Request<WellArchitected.Types.ListProfilesOutput, AWSError>;
  /**
   * List profiles.
   */
  listProfiles(callback?: (err: AWSError, data: WellArchitected.Types.ListProfilesOutput) => void): Request<WellArchitected.Types.ListProfilesOutput, AWSError>;
  /**
   * List the answers of a review template.
   */
  listReviewTemplateAnswers(params: WellArchitected.Types.ListReviewTemplateAnswersInput, callback?: (err: AWSError, data: WellArchitected.Types.ListReviewTemplateAnswersOutput) => void): Request<WellArchitected.Types.ListReviewTemplateAnswersOutput, AWSError>;
  /**
   * List the answers of a review template.
   */
  listReviewTemplateAnswers(callback?: (err: AWSError, data: WellArchitected.Types.ListReviewTemplateAnswersOutput) => void): Request<WellArchitected.Types.ListReviewTemplateAnswersOutput, AWSError>;
  /**
   * List review templates.
   */
  listReviewTemplates(params: WellArchitected.Types.ListReviewTemplatesInput, callback?: (err: AWSError, data: WellArchitected.Types.ListReviewTemplatesOutput) => void): Request<WellArchitected.Types.ListReviewTemplatesOutput, AWSError>;
  /**
   * List review templates.
   */
  listReviewTemplates(callback?: (err: AWSError, data: WellArchitected.Types.ListReviewTemplatesOutput) => void): Request<WellArchitected.Types.ListReviewTemplatesOutput, AWSError>;
  /**
   * List the share invitations.  WorkloadNamePrefix, LensNamePrefix, ProfileNamePrefix, and TemplateNamePrefix are mutually exclusive. Use the parameter that matches your ShareResourceType.
   */
  listShareInvitations(params: WellArchitected.Types.ListShareInvitationsInput, callback?: (err: AWSError, data: WellArchitected.Types.ListShareInvitationsOutput) => void): Request<WellArchitected.Types.ListShareInvitationsOutput, AWSError>;
  /**
   * List the share invitations.  WorkloadNamePrefix, LensNamePrefix, ProfileNamePrefix, and TemplateNamePrefix are mutually exclusive. Use the parameter that matches your ShareResourceType.
   */
  listShareInvitations(callback?: (err: AWSError, data: WellArchitected.Types.ListShareInvitationsOutput) => void): Request<WellArchitected.Types.ListShareInvitationsOutput, AWSError>;
  /**
   * List the tags for a resource.  The WorkloadArn parameter can be a workload ARN, a custom lens ARN, a profile ARN, or review template ARN. 
   */
  listTagsForResource(params: WellArchitected.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: WellArchitected.Types.ListTagsForResourceOutput) => void): Request<WellArchitected.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * List the tags for a resource.  The WorkloadArn parameter can be a workload ARN, a custom lens ARN, a profile ARN, or review template ARN. 
   */
  listTagsForResource(callback?: (err: AWSError, data: WellArchitected.Types.ListTagsForResourceOutput) => void): Request<WellArchitected.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * List review template shares.
   */
  listTemplateShares(params: WellArchitected.Types.ListTemplateSharesInput, callback?: (err: AWSError, data: WellArchitected.Types.ListTemplateSharesOutput) => void): Request<WellArchitected.Types.ListTemplateSharesOutput, AWSError>;
  /**
   * List review template shares.
   */
  listTemplateShares(callback?: (err: AWSError, data: WellArchitected.Types.ListTemplateSharesOutput) => void): Request<WellArchitected.Types.ListTemplateSharesOutput, AWSError>;
  /**
   * List the workload shares associated with the workload.
   */
  listWorkloadShares(params: WellArchitected.Types.ListWorkloadSharesInput, callback?: (err: AWSError, data: WellArchitected.Types.ListWorkloadSharesOutput) => void): Request<WellArchitected.Types.ListWorkloadSharesOutput, AWSError>;
  /**
   * List the workload shares associated with the workload.
   */
  listWorkloadShares(callback?: (err: AWSError, data: WellArchitected.Types.ListWorkloadSharesOutput) => void): Request<WellArchitected.Types.ListWorkloadSharesOutput, AWSError>;
  /**
   * Paginated list of workloads.
   */
  listWorkloads(params: WellArchitected.Types.ListWorkloadsInput, callback?: (err: AWSError, data: WellArchitected.Types.ListWorkloadsOutput) => void): Request<WellArchitected.Types.ListWorkloadsOutput, AWSError>;
  /**
   * Paginated list of workloads.
   */
  listWorkloads(callback?: (err: AWSError, data: WellArchitected.Types.ListWorkloadsOutput) => void): Request<WellArchitected.Types.ListWorkloadsOutput, AWSError>;
  /**
   * Adds one or more tags to the specified resource.  The WorkloadArn parameter can be a workload ARN, a custom lens ARN, a profile ARN, or review template ARN. 
   */
  tagResource(params: WellArchitected.Types.TagResourceInput, callback?: (err: AWSError, data: WellArchitected.Types.TagResourceOutput) => void): Request<WellArchitected.Types.TagResourceOutput, AWSError>;
  /**
   * Adds one or more tags to the specified resource.  The WorkloadArn parameter can be a workload ARN, a custom lens ARN, a profile ARN, or review template ARN. 
   */
  tagResource(callback?: (err: AWSError, data: WellArchitected.Types.TagResourceOutput) => void): Request<WellArchitected.Types.TagResourceOutput, AWSError>;
  /**
   * Deletes specified tags from a resource.  The WorkloadArn parameter can be a workload ARN, a custom lens ARN, a profile ARN, or review template ARN.  To specify multiple tags, use separate tagKeys parameters, for example:  DELETE /tags/WorkloadArn?tagKeys=key1&amp;tagKeys=key2 
   */
  untagResource(params: WellArchitected.Types.UntagResourceInput, callback?: (err: AWSError, data: WellArchitected.Types.UntagResourceOutput) => void): Request<WellArchitected.Types.UntagResourceOutput, AWSError>;
  /**
   * Deletes specified tags from a resource.  The WorkloadArn parameter can be a workload ARN, a custom lens ARN, a profile ARN, or review template ARN.  To specify multiple tags, use separate tagKeys parameters, for example:  DELETE /tags/WorkloadArn?tagKeys=key1&amp;tagKeys=key2 
   */
  untagResource(callback?: (err: AWSError, data: WellArchitected.Types.UntagResourceOutput) => void): Request<WellArchitected.Types.UntagResourceOutput, AWSError>;
  /**
   * Update the answer to a specific question in a workload review.
   */
  updateAnswer(params: WellArchitected.Types.UpdateAnswerInput, callback?: (err: AWSError, data: WellArchitected.Types.UpdateAnswerOutput) => void): Request<WellArchitected.Types.UpdateAnswerOutput, AWSError>;
  /**
   * Update the answer to a specific question in a workload review.
   */
  updateAnswer(callback?: (err: AWSError, data: WellArchitected.Types.UpdateAnswerOutput) => void): Request<WellArchitected.Types.UpdateAnswerOutput, AWSError>;
  /**
   * Updates whether the Amazon Web Services account is opted into organization sharing and discovery integration features.
   */
  updateGlobalSettings(params: WellArchitected.Types.UpdateGlobalSettingsInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates whether the Amazon Web Services account is opted into organization sharing and discovery integration features.
   */
  updateGlobalSettings(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Update lens review for a particular workload.
   */
  updateLensReview(params: WellArchitected.Types.UpdateLensReviewInput, callback?: (err: AWSError, data: WellArchitected.Types.UpdateLensReviewOutput) => void): Request<WellArchitected.Types.UpdateLensReviewOutput, AWSError>;
  /**
   * Update lens review for a particular workload.
   */
  updateLensReview(callback?: (err: AWSError, data: WellArchitected.Types.UpdateLensReviewOutput) => void): Request<WellArchitected.Types.UpdateLensReviewOutput, AWSError>;
  /**
   * Update a profile.
   */
  updateProfile(params: WellArchitected.Types.UpdateProfileInput, callback?: (err: AWSError, data: WellArchitected.Types.UpdateProfileOutput) => void): Request<WellArchitected.Types.UpdateProfileOutput, AWSError>;
  /**
   * Update a profile.
   */
  updateProfile(callback?: (err: AWSError, data: WellArchitected.Types.UpdateProfileOutput) => void): Request<WellArchitected.Types.UpdateProfileOutput, AWSError>;
  /**
   * Update a review template.
   */
  updateReviewTemplate(params: WellArchitected.Types.UpdateReviewTemplateInput, callback?: (err: AWSError, data: WellArchitected.Types.UpdateReviewTemplateOutput) => void): Request<WellArchitected.Types.UpdateReviewTemplateOutput, AWSError>;
  /**
   * Update a review template.
   */
  updateReviewTemplate(callback?: (err: AWSError, data: WellArchitected.Types.UpdateReviewTemplateOutput) => void): Request<WellArchitected.Types.UpdateReviewTemplateOutput, AWSError>;
  /**
   * Update a review template answer.
   */
  updateReviewTemplateAnswer(params: WellArchitected.Types.UpdateReviewTemplateAnswerInput, callback?: (err: AWSError, data: WellArchitected.Types.UpdateReviewTemplateAnswerOutput) => void): Request<WellArchitected.Types.UpdateReviewTemplateAnswerOutput, AWSError>;
  /**
   * Update a review template answer.
   */
  updateReviewTemplateAnswer(callback?: (err: AWSError, data: WellArchitected.Types.UpdateReviewTemplateAnswerOutput) => void): Request<WellArchitected.Types.UpdateReviewTemplateAnswerOutput, AWSError>;
  /**
   * Update a lens review associated with a review template.
   */
  updateReviewTemplateLensReview(params: WellArchitected.Types.UpdateReviewTemplateLensReviewInput, callback?: (err: AWSError, data: WellArchitected.Types.UpdateReviewTemplateLensReviewOutput) => void): Request<WellArchitected.Types.UpdateReviewTemplateLensReviewOutput, AWSError>;
  /**
   * Update a lens review associated with a review template.
   */
  updateReviewTemplateLensReview(callback?: (err: AWSError, data: WellArchitected.Types.UpdateReviewTemplateLensReviewOutput) => void): Request<WellArchitected.Types.UpdateReviewTemplateLensReviewOutput, AWSError>;
  /**
   * Update a workload or custom lens share invitation.  This API operation can be called independently of any resource. Previous documentation implied that a workload ARN must be specified. 
   */
  updateShareInvitation(params: WellArchitected.Types.UpdateShareInvitationInput, callback?: (err: AWSError, data: WellArchitected.Types.UpdateShareInvitationOutput) => void): Request<WellArchitected.Types.UpdateShareInvitationOutput, AWSError>;
  /**
   * Update a workload or custom lens share invitation.  This API operation can be called independently of any resource. Previous documentation implied that a workload ARN must be specified. 
   */
  updateShareInvitation(callback?: (err: AWSError, data: WellArchitected.Types.UpdateShareInvitationOutput) => void): Request<WellArchitected.Types.UpdateShareInvitationOutput, AWSError>;
  /**
   * Update an existing workload.
   */
  updateWorkload(params: WellArchitected.Types.UpdateWorkloadInput, callback?: (err: AWSError, data: WellArchitected.Types.UpdateWorkloadOutput) => void): Request<WellArchitected.Types.UpdateWorkloadOutput, AWSError>;
  /**
   * Update an existing workload.
   */
  updateWorkload(callback?: (err: AWSError, data: WellArchitected.Types.UpdateWorkloadOutput) => void): Request<WellArchitected.Types.UpdateWorkloadOutput, AWSError>;
  /**
   * Update a workload share.
   */
  updateWorkloadShare(params: WellArchitected.Types.UpdateWorkloadShareInput, callback?: (err: AWSError, data: WellArchitected.Types.UpdateWorkloadShareOutput) => void): Request<WellArchitected.Types.UpdateWorkloadShareOutput, AWSError>;
  /**
   * Update a workload share.
   */
  updateWorkloadShare(callback?: (err: AWSError, data: WellArchitected.Types.UpdateWorkloadShareOutput) => void): Request<WellArchitected.Types.UpdateWorkloadShareOutput, AWSError>;
  /**
   * Upgrade lens review for a particular workload.
   */
  upgradeLensReview(params: WellArchitected.Types.UpgradeLensReviewInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Upgrade lens review for a particular workload.
   */
  upgradeLensReview(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Upgrade a profile.
   */
  upgradeProfileVersion(params: WellArchitected.Types.UpgradeProfileVersionInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Upgrade a profile.
   */
  upgradeProfileVersion(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Upgrade the lens review of a review template.
   */
  upgradeReviewTemplateLensReview(params: WellArchitected.Types.UpgradeReviewTemplateLensReviewInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Upgrade the lens review of a review template.
   */
  upgradeReviewTemplateLensReview(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace WellArchitected {
  export type AccountSummary = {[key: string]: CheckStatusCount};
  export type AdditionalResourceType = "HELPFUL_RESOURCE"|"IMPROVEMENT_PLAN"|string;
  export interface AdditionalResources {
    /**
     * Type of additional resource for a custom lens.
     */
    Type?: AdditionalResourceType;
    /**
     * The URLs for additional resources, either helpful resources or improvement plans, for a custom lens. Up to five additional URLs can be specified.
     */
    Content?: Urls;
  }
  export type AdditionalResourcesList = AdditionalResources[];
  export interface Answer {
    QuestionId?: QuestionId;
    PillarId?: PillarId;
    QuestionTitle?: QuestionTitle;
    QuestionDescription?: QuestionDescription;
    ImprovementPlanUrl?: ImprovementPlanUrl;
    HelpfulResourceUrl?: HelpfulResourceUrl;
    /**
     * The helpful resource text to be displayed for a custom lens. This field does not apply to Amazon Web Services official lenses.
     */
    HelpfulResourceDisplayText?: DisplayText;
    Choices?: Choices;
    SelectedChoices?: SelectedChoices;
    /**
     * A list of selected choices to a question in your workload.
     */
    ChoiceAnswers?: ChoiceAnswers;
    IsApplicable?: IsApplicable;
    Risk?: Risk;
    Notes?: Notes;
    /**
     * The reason why the question is not applicable to your workload.
     */
    Reason?: AnswerReason;
  }
  export type AnswerReason = "OUT_OF_SCOPE"|"BUSINESS_PRIORITIES"|"ARCHITECTURE_CONSTRAINTS"|"OTHER"|"NONE"|string;
  export type AnswerSummaries = AnswerSummary[];
  export interface AnswerSummary {
    QuestionId?: QuestionId;
    PillarId?: PillarId;
    QuestionTitle?: QuestionTitle;
    Choices?: Choices;
    SelectedChoices?: SelectedChoices;
    /**
     * A list of selected choices to a question in your workload.
     */
    ChoiceAnswerSummaries?: ChoiceAnswerSummaries;
    IsApplicable?: IsApplicable;
    Risk?: Risk;
    /**
     * The reason why a choice is non-applicable to a question in your workload.
     */
    Reason?: AnswerReason;
    /**
     * The type of the question.
     */
    QuestionType?: QuestionType;
  }
  export type ApplicationArn = string;
  export interface AssociateLensesInput {
    WorkloadId: WorkloadId;
    LensAliases: LensAliases;
  }
  export interface AssociateProfilesInput {
    WorkloadId: WorkloadId;
    /**
     * The list of profile ARNs to associate with the workload.
     */
    ProfileArns: ProfileArns;
  }
  export type AwsAccountId = string;
  export type AwsRegion = string;
  export type Base64String = string;
  export interface BestPractice {
    ChoiceId?: ChoiceId;
    ChoiceTitle?: ChoiceTitle;
  }
  export type BestPractices = BestPractice[];
  export type CheckDescription = string;
  export interface CheckDetail {
    /**
     * Trusted Advisor check ID.
     */
    Id?: CheckId;
    /**
     * Trusted Advisor check name.
     */
    Name?: CheckName;
    /**
     * Trusted Advisor check description.
     */
    Description?: CheckDescription;
    /**
     * Provider of the check related to the best practice.
     */
    Provider?: CheckProvider;
    /**
     * Well-Architected Lens ARN associated to the check.
     */
    LensArn?: LensArn;
    PillarId?: PillarId;
    QuestionId?: QuestionId;
    ChoiceId?: ChoiceId;
    /**
     * Status associated to the check.
     */
    Status?: CheckStatus;
    AccountId?: AwsAccountId;
    /**
     * Count of flagged resources associated to the check.
     */
    FlaggedResources?: FlaggedResources;
    /**
     * Reason associated to the check.
     */
    Reason?: CheckFailureReason;
    UpdatedAt?: Timestamp;
  }
  export type CheckDetails = CheckDetail[];
  export type CheckFailureReason = "ASSUME_ROLE_ERROR"|"ACCESS_DENIED"|"UNKNOWN_ERROR"|"PREMIUM_SUPPORT_REQUIRED"|string;
  export type CheckId = string;
  export type CheckName = string;
  export type CheckProvider = "TRUSTED_ADVISOR"|string;
  export type CheckStatus = "OKAY"|"WARNING"|"ERROR"|"NOT_AVAILABLE"|"FETCH_FAILED"|string;
  export type CheckStatusCount = number;
  export type CheckSummaries = CheckSummary[];
  export interface CheckSummary {
    /**
     * Trusted Advisor check ID.
     */
    Id?: CheckId;
    /**
     * Trusted Advisor check name.
     */
    Name?: CheckName;
    /**
     * Provider of the check related to the best practice.
     */
    Provider?: CheckProvider;
    /**
     * Trusted Advisor check description.
     */
    Description?: CheckDescription;
    UpdatedAt?: Timestamp;
    /**
     * Well-Architected Lens ARN associated to the check.
     */
    LensArn?: LensArn;
    PillarId?: PillarId;
    QuestionId?: QuestionId;
    ChoiceId?: ChoiceId;
    /**
     * Status associated to the check.
     */
    Status?: CheckStatus;
    /**
     * Account summary associated to the check.
     */
    AccountSummary?: AccountSummary;
  }
  export interface Choice {
    ChoiceId?: ChoiceId;
    Title?: ChoiceTitle;
    Description?: ChoiceDescription;
    /**
     * The helpful resource (both text and URL) for a particular choice. This field only applies to custom lenses. Each choice can have only one helpful resource.
     */
    HelpfulResource?: ChoiceContent;
    /**
     * The improvement plan (both text and URL) for a particular choice. This field only applies to custom lenses. Each choice can have only one improvement plan.
     */
    ImprovementPlan?: ChoiceContent;
    /**
     * The additional resources for a choice in a custom lens. A choice can have up to two additional resources: one of type HELPFUL_RESOURCE, one of type IMPROVEMENT_PLAN, or both.
     */
    AdditionalResources?: AdditionalResourcesList;
  }
  export interface ChoiceAnswer {
    ChoiceId?: ChoiceId;
    /**
     * The status of a choice.
     */
    Status?: ChoiceStatus;
    /**
     * The reason why a choice is non-applicable to a question in your workload.
     */
    Reason?: ChoiceReason;
    /**
     * The notes associated with a choice.
     */
    Notes?: ChoiceNotes;
  }
  export type ChoiceAnswerSummaries = ChoiceAnswerSummary[];
  export interface ChoiceAnswerSummary {
    ChoiceId?: ChoiceId;
    /**
     * The status of a choice.
     */
    Status?: ChoiceStatus;
    /**
     * The reason why a choice is non-applicable to a question in your workload.
     */
    Reason?: ChoiceReason;
  }
  export type ChoiceAnswers = ChoiceAnswer[];
  export interface ChoiceContent {
    /**
     * The display text for the choice content.
     */
    DisplayText?: ChoiceContentDisplayText;
    /**
     * The URL for the choice content.
     */
    Url?: ChoiceContentUrl;
  }
  export type ChoiceContentDisplayText = string;
  export type ChoiceContentUrl = string;
  export type ChoiceDescription = string;
  export type ChoiceId = string;
  export interface ChoiceImprovementPlan {
    ChoiceId?: ChoiceId;
    /**
     * The display text for the improvement plan.
     */
    DisplayText?: DisplayText;
    ImprovementPlanUrl?: ImprovementPlanUrl;
  }
  export type ChoiceImprovementPlans = ChoiceImprovementPlan[];
  export type ChoiceNotes = string;
  export type ChoiceReason = "OUT_OF_SCOPE"|"BUSINESS_PRIORITIES"|"ARCHITECTURE_CONSTRAINTS"|"OTHER"|"NONE"|string;
  export type ChoiceStatus = "SELECTED"|"NOT_APPLICABLE"|"UNSELECTED"|string;
  export type ChoiceTitle = string;
  export interface ChoiceUpdate {
    /**
     * The status of a choice.
     */
    Status: ChoiceStatus;
    /**
     * The reason why a choice is non-applicable to a question in your workload.
     */
    Reason?: ChoiceReason;
    /**
     * The notes associated with a choice.
     */
    Notes?: ChoiceNotes;
  }
  export type ChoiceUpdates = {[key: string]: ChoiceUpdate};
  export type Choices = Choice[];
  export type ClientRequestToken = string;
  export interface ConsolidatedReportMetric {
    /**
     * The metric type of a metric in the consolidated report. Currently only WORKLOAD metric types are supported.
     */
    MetricType?: MetricType;
    RiskCounts?: RiskCounts;
    WorkloadId?: WorkloadId;
    WorkloadName?: WorkloadName;
    WorkloadArn?: WorkloadArn;
    UpdatedAt?: Timestamp;
    /**
     * The metrics for the lenses in the workload.
     */
    Lenses?: LensMetrics;
    /**
     * The total number of lenses applied to the workload.
     */
    LensesAppliedCount?: LensesAppliedCount;
  }
  export type ConsolidatedReportMetrics = ConsolidatedReportMetric[];
  export type Count = number;
  export interface CreateLensShareInput {
    LensAlias: LensAlias;
    SharedWith: SharedWith;
    ClientRequestToken: ClientRequestToken;
  }
  export interface CreateLensShareOutput {
    ShareId?: ShareId;
  }
  export interface CreateLensVersionInput {
    LensAlias: LensAlias;
    /**
     * The version of the lens being created.
     */
    LensVersion: LensVersion;
    /**
     * Set to true if this new major lens version.
     */
    IsMajorVersion?: IsMajorVersion;
    ClientRequestToken: ClientRequestToken;
  }
  export interface CreateLensVersionOutput {
    /**
     * The ARN for the lens.
     */
    LensArn?: LensArn;
    /**
     * The version of the lens.
     */
    LensVersion?: LensVersion;
  }
  export interface CreateMilestoneInput {
    WorkloadId: WorkloadId;
    MilestoneName: MilestoneName;
    ClientRequestToken: ClientRequestToken;
  }
  export interface CreateMilestoneOutput {
    WorkloadId?: WorkloadId;
    MilestoneNumber?: MilestoneNumber;
  }
  export interface CreateProfileInput {
    /**
     * Name of the profile.
     */
    ProfileName: ProfileName;
    /**
     * The profile description.
     */
    ProfileDescription: ProfileDescription;
    /**
     * The profile questions.
     */
    ProfileQuestions: ProfileQuestionUpdates;
    ClientRequestToken: ClientRequestToken;
    /**
     * The tags assigned to the profile.
     */
    Tags?: TagMap;
  }
  export interface CreateProfileOutput {
    /**
     * The profile ARN.
     */
    ProfileArn?: ProfileArn;
    /**
     * Version of the profile.
     */
    ProfileVersion?: ProfileVersion;
  }
  export interface CreateProfileShareInput {
    /**
     * The profile ARN.
     */
    ProfileArn: ProfileArn;
    SharedWith: SharedWith;
    ClientRequestToken: ClientRequestToken;
  }
  export interface CreateProfileShareOutput {
    ShareId?: ShareId;
    /**
     * The profile ARN.
     */
    ProfileArn?: ProfileArn;
  }
  export interface CreateReviewTemplateInput {
    /**
     * Name of the review template.
     */
    TemplateName: TemplateName;
    /**
     * The review template description.
     */
    Description: TemplateDescription;
    /**
     * Lenses applied to the review template.
     */
    Lenses: ReviewTemplateLenses;
    Notes?: Notes;
    /**
     * The tags assigned to the review template.
     */
    Tags?: TagMap;
    ClientRequestToken: ClientRequestToken;
  }
  export interface CreateReviewTemplateOutput {
    /**
     * The review template ARN.
     */
    TemplateArn?: TemplateArn;
  }
  export interface CreateTemplateShareInput {
    /**
     * The review template ARN.
     */
    TemplateArn: TemplateArn;
    SharedWith: SharedWith;
    ClientRequestToken: ClientRequestToken;
  }
  export interface CreateTemplateShareOutput {
    /**
     * The review template ARN.
     */
    TemplateArn?: TemplateArn;
    ShareId?: ShareId;
  }
  export interface CreateWorkloadInput {
    WorkloadName: WorkloadName;
    Description: WorkloadDescription;
    Environment: WorkloadEnvironment;
    AccountIds?: WorkloadAccountIds;
    AwsRegions?: WorkloadAwsRegions;
    NonAwsRegions?: WorkloadNonAwsRegions;
    PillarPriorities?: WorkloadPillarPriorities;
    ArchitecturalDesign?: WorkloadArchitecturalDesign;
    ReviewOwner?: WorkloadReviewOwner;
    IndustryType?: WorkloadIndustryType;
    Industry?: WorkloadIndustry;
    Lenses: WorkloadLenses;
    Notes?: Notes;
    ClientRequestToken: ClientRequestToken;
    /**
     * The tags to be associated with the workload.
     */
    Tags?: TagMap;
    /**
     * Well-Architected discovery configuration settings associated to the workload.
     */
    DiscoveryConfig?: WorkloadDiscoveryConfig;
    /**
     * List of AppRegistry application ARNs associated to the workload.
     */
    Applications?: WorkloadApplications;
    /**
     * The list of profile ARNs associated with the workload.
     */
    ProfileArns?: WorkloadProfileArns;
    /**
     * The list of review template ARNs to associate with the workload.
     */
    ReviewTemplateArns?: ReviewTemplateArns;
  }
  export interface CreateWorkloadOutput {
    WorkloadId?: WorkloadId;
    WorkloadArn?: WorkloadArn;
  }
  export interface CreateWorkloadShareInput {
    WorkloadId: WorkloadId;
    SharedWith: SharedWith;
    PermissionType: PermissionType;
    ClientRequestToken: ClientRequestToken;
  }
  export interface CreateWorkloadShareOutput {
    WorkloadId?: WorkloadId;
    ShareId?: ShareId;
  }
  export type DefinitionType = "WORKLOAD_METADATA"|"APP_REGISTRY"|string;
  export interface DeleteLensInput {
    LensAlias: LensAlias;
    ClientRequestToken: ClientRequestToken;
    /**
     * The status of the lens to be deleted.
     */
    LensStatus: LensStatusType;
  }
  export interface DeleteLensShareInput {
    ShareId: ShareId;
    LensAlias: LensAlias;
    ClientRequestToken: ClientRequestToken;
  }
  export interface DeleteProfileInput {
    /**
     * The profile ARN.
     */
    ProfileArn: ProfileArn;
    ClientRequestToken: ClientRequestToken;
  }
  export interface DeleteProfileShareInput {
    ShareId: ShareId;
    /**
     * The profile ARN.
     */
    ProfileArn: ProfileArn;
    ClientRequestToken: ClientRequestToken;
  }
  export interface DeleteReviewTemplateInput {
    /**
     * The review template ARN.
     */
    TemplateArn: TemplateArn;
    ClientRequestToken: ClientRequestToken;
  }
  export interface DeleteTemplateShareInput {
    ShareId: ShareId;
    /**
     * The review template ARN.
     */
    TemplateArn: TemplateArn;
    ClientRequestToken: ClientRequestToken;
  }
  export interface DeleteWorkloadInput {
    WorkloadId: WorkloadId;
    ClientRequestToken: ClientRequestToken;
  }
  export interface DeleteWorkloadShareInput {
    ShareId: ShareId;
    WorkloadId: WorkloadId;
    ClientRequestToken: ClientRequestToken;
  }
  export type DifferenceStatus = "UPDATED"|"NEW"|"DELETED"|string;
  export interface DisassociateLensesInput {
    WorkloadId: WorkloadId;
    LensAliases: LensAliases;
  }
  export interface DisassociateProfilesInput {
    WorkloadId: WorkloadId;
    /**
     * The list of profile ARNs to disassociate from the workload.
     */
    ProfileArns: ProfileArns;
  }
  export type DiscoveryIntegrationStatus = "ENABLED"|"DISABLED"|string;
  export type DisplayText = string;
  export interface ExportLensInput {
    LensAlias: LensAlias;
    /**
     * The lens version to be exported.
     */
    LensVersion?: LensVersion;
  }
  export interface ExportLensOutput {
    /**
     * The JSON representation of a lens.
     */
    LensJSON?: LensJSON;
  }
  export type FlaggedResources = number;
  export interface GetAnswerInput {
    WorkloadId: WorkloadId;
    LensAlias: LensAlias;
    QuestionId: QuestionId;
    MilestoneNumber?: MilestoneNumber;
  }
  export interface GetAnswerOutput {
    WorkloadId?: WorkloadId;
    MilestoneNumber?: MilestoneNumber;
    LensAlias?: LensAlias;
    /**
     * The ARN for the lens.
     */
    LensArn?: LensArn;
    Answer?: Answer;
  }
  export interface GetConsolidatedReportInput {
    /**
     * The format of the consolidated report. For PDF, Base64String is returned. For JSON, Metrics is returned.
     */
    Format: ReportFormat;
    /**
     * Set to true to have shared resources included in the report.
     */
    IncludeSharedResources?: IncludeSharedResources;
    NextToken?: NextToken;
    /**
     * The maximum number of results to return for this request.
     */
    MaxResults?: GetConsolidatedReportMaxResults;
  }
  export type GetConsolidatedReportMaxResults = number;
  export interface GetConsolidatedReportOutput {
    /**
     * The metrics that make up the consolidated report. Only returned when JSON format is requested.
     */
    Metrics?: ConsolidatedReportMetrics;
    NextToken?: NextToken;
    Base64String?: Base64String;
  }
  export interface GetLensInput {
    LensAlias: LensAlias;
    /**
     * The lens version to be retrieved.
     */
    LensVersion?: LensVersion;
  }
  export interface GetLensOutput {
    /**
     * A lens return object.
     */
    Lens?: Lens;
  }
  export interface GetLensReviewInput {
    WorkloadId: WorkloadId;
    LensAlias: LensAlias;
    MilestoneNumber?: MilestoneNumber;
  }
  export interface GetLensReviewOutput {
    WorkloadId?: WorkloadId;
    MilestoneNumber?: MilestoneNumber;
    LensReview?: LensReview;
  }
  export interface GetLensReviewReportInput {
    WorkloadId: WorkloadId;
    LensAlias: LensAlias;
    MilestoneNumber?: MilestoneNumber;
  }
  export interface GetLensReviewReportOutput {
    WorkloadId?: WorkloadId;
    MilestoneNumber?: MilestoneNumber;
    LensReviewReport?: LensReviewReport;
  }
  export interface GetLensVersionDifferenceInput {
    LensAlias: LensAlias;
    /**
     * The base version of the lens.
     */
    BaseLensVersion?: LensVersion;
    /**
     * The lens version to target a difference for.
     */
    TargetLensVersion?: LensVersion;
  }
  export interface GetLensVersionDifferenceOutput {
    LensAlias?: LensAlias;
    /**
     * The ARN for the lens.
     */
    LensArn?: LensArn;
    /**
     * The base version of the lens.
     */
    BaseLensVersion?: LensVersion;
    /**
     * The target lens version for the lens.
     */
    TargetLensVersion?: LensVersion;
    /**
     * The latest version of the lens.
     */
    LatestLensVersion?: LensVersion;
    VersionDifferences?: VersionDifferences;
  }
  export interface GetMilestoneInput {
    WorkloadId: WorkloadId;
    MilestoneNumber: MilestoneNumber;
  }
  export interface GetMilestoneOutput {
    WorkloadId?: WorkloadId;
    Milestone?: Milestone;
  }
  export interface GetProfileInput {
    /**
     * The profile ARN.
     */
    ProfileArn: ProfileArn;
    /**
     * The profile version.
     */
    ProfileVersion?: ProfileVersion;
  }
  export interface GetProfileOutput {
    /**
     * The profile.
     */
    Profile?: Profile;
  }
  export interface GetProfileTemplateInput {
  }
  export interface GetProfileTemplateOutput {
    /**
     * The profile template.
     */
    ProfileTemplate?: ProfileTemplate;
  }
  export interface GetReviewTemplateAnswerInput {
    /**
     * The review template ARN.
     */
    TemplateArn: TemplateArn;
    LensAlias: LensAlias;
    QuestionId: QuestionId;
  }
  export interface GetReviewTemplateAnswerOutput {
    /**
     * The review template ARN.
     */
    TemplateArn?: TemplateArn;
    LensAlias?: LensAlias;
    /**
     * An answer of the question.
     */
    Answer?: ReviewTemplateAnswer;
  }
  export interface GetReviewTemplateInput {
    /**
     * The review template ARN.
     */
    TemplateArn: TemplateArn;
  }
  export interface GetReviewTemplateLensReviewInput {
    /**
     * The review template ARN.
     */
    TemplateArn: TemplateArn;
    LensAlias: LensAlias;
  }
  export interface GetReviewTemplateLensReviewOutput {
    /**
     * The review template ARN.
     */
    TemplateArn?: TemplateArn;
    /**
     * A lens review of a question.
     */
    LensReview?: ReviewTemplateLensReview;
  }
  export interface GetReviewTemplateOutput {
    /**
     * The review template.
     */
    ReviewTemplate?: ReviewTemplate;
  }
  export interface GetWorkloadInput {
    WorkloadId: WorkloadId;
  }
  export interface GetWorkloadOutput {
    Workload?: Workload;
  }
  export type HelpfulResourceUrl = string;
  export interface ImportLensInput {
    LensAlias?: LensAlias;
    /**
     * The JSON representation of a lens.
     */
    JSONString: LensJSON;
    ClientRequestToken: ClientRequestToken;
    /**
     * Tags to associate to a lens.
     */
    Tags?: TagMap;
  }
  export interface ImportLensOutput {
    /**
     * The ARN for the lens that was created or updated.
     */
    LensArn?: LensArn;
    /**
     * The status of the imported lens.
     */
    Status?: ImportLensStatus;
  }
  export type ImportLensStatus = "IN_PROGRESS"|"COMPLETE"|"ERROR"|string;
  export type ImprovementPlanUrl = string;
  export type ImprovementSummaries = ImprovementSummary[];
  export interface ImprovementSummary {
    QuestionId?: QuestionId;
    PillarId?: PillarId;
    QuestionTitle?: QuestionTitle;
    Risk?: Risk;
    ImprovementPlanUrl?: ImprovementPlanUrl;
    /**
     * The improvement plan details.
     */
    ImprovementPlans?: ChoiceImprovementPlans;
  }
  export type IncludeSharedResources = boolean;
  export type IsApplicable = boolean;
  export type IsMajorVersion = boolean;
  export type IsReviewOwnerUpdateAcknowledged = boolean;
  export interface Lens {
    /**
     * The ARN of a lens.
     */
    LensArn?: LensArn;
    /**
     * The version of a lens.
     */
    LensVersion?: LensVersion;
    Name?: LensName;
    Description?: LensDescription;
    /**
     * The Amazon Web Services account ID that owns the lens.
     */
    Owner?: LensOwner;
    /**
     * The ID assigned to the share invitation.
     */
    ShareInvitationId?: ShareInvitationId;
    /**
     * The tags assigned to the lens.
     */
    Tags?: TagMap;
  }
  export type LensAlias = string;
  export type LensAliases = LensAlias[];
  export type LensArn = string;
  export type LensDescription = string;
  export type LensJSON = string;
  export interface LensMetric {
    /**
     * The lens ARN.
     */
    LensArn?: LensArn;
    /**
     * The metrics for the pillars in a lens.
     */
    Pillars?: PillarMetrics;
    RiskCounts?: RiskCounts;
  }
  export type LensMetrics = LensMetric[];
  export type LensName = string;
  export type LensNamePrefix = string;
  export type LensOwner = string;
  export interface LensReview {
    LensAlias?: LensAlias;
    /**
     * The ARN for the lens.
     */
    LensArn?: LensArn;
    /**
     * The version of the lens.
     */
    LensVersion?: LensVersion;
    LensName?: LensName;
    /**
     * The status of the lens.
     */
    LensStatus?: LensStatus;
    PillarReviewSummaries?: PillarReviewSummaries;
    UpdatedAt?: Timestamp;
    Notes?: Notes;
    RiskCounts?: RiskCounts;
    NextToken?: NextToken;
    /**
     * The profiles associated with the workload.
     */
    Profiles?: WorkloadProfiles;
    PrioritizedRiskCounts?: RiskCounts;
  }
  export interface LensReviewReport {
    LensAlias?: LensAlias;
    /**
     * The ARN for the lens.
     */
    LensArn?: LensArn;
    Base64String?: Base64String;
  }
  export type LensReviewSummaries = LensReviewSummary[];
  export interface LensReviewSummary {
    LensAlias?: LensAlias;
    /**
     * The ARN for the lens.
     */
    LensArn?: LensArn;
    /**
     * The version of the lens.
     */
    LensVersion?: LensVersion;
    LensName?: LensName;
    /**
     * The status of the lens.
     */
    LensStatus?: LensStatus;
    UpdatedAt?: Timestamp;
    RiskCounts?: RiskCounts;
    /**
     * The profiles associated with the workload.
     */
    Profiles?: WorkloadProfiles;
    PrioritizedRiskCounts?: RiskCounts;
  }
  export type LensShareSummaries = LensShareSummary[];
  export interface LensShareSummary {
    ShareId?: ShareId;
    SharedWith?: SharedWith;
    Status?: ShareStatus;
    /**
     * Optional message to compliment the Status field.
     */
    StatusMessage?: StatusMessage;
  }
  export type LensStatus = "CURRENT"|"NOT_CURRENT"|"DEPRECATED"|"DELETED"|"UNSHARED"|string;
  export type LensStatusType = "ALL"|"DRAFT"|"PUBLISHED"|string;
  export type LensSummaries = LensSummary[];
  export interface LensSummary {
    /**
     * The ARN of the lens.
     */
    LensArn?: LensArn;
    LensAlias?: LensAlias;
    LensName?: LensName;
    /**
     * The type of the lens.
     */
    LensType?: LensType;
    Description?: LensDescription;
    CreatedAt?: Timestamp;
    UpdatedAt?: Timestamp;
    /**
     * The version of the lens.
     */
    LensVersion?: LensVersion;
    Owner?: AwsAccountId;
    /**
     * The status of the lens.
     */
    LensStatus?: LensStatus;
  }
  export type LensType = "AWS_OFFICIAL"|"CUSTOM_SHARED"|"CUSTOM_SELF"|string;
  export interface LensUpgradeSummary {
    WorkloadId?: WorkloadId;
    WorkloadName?: WorkloadName;
    LensAlias?: LensAlias;
    /**
     * The ARN for the lens.
     */
    LensArn?: LensArn;
    /**
     * The current version of the lens.
     */
    CurrentLensVersion?: LensVersion;
    /**
     * The latest version of the lens.
     */
    LatestLensVersion?: LensVersion;
    /**
     *  ResourceArn of the lens being upgraded
     */
    ResourceArn?: ResourceArn;
    ResourceName?: WorkloadName;
  }
  export type LensVersion = string;
  export type LensesAppliedCount = number;
  export interface ListAnswersInput {
    WorkloadId: WorkloadId;
    LensAlias: LensAlias;
    PillarId?: PillarId;
    MilestoneNumber?: MilestoneNumber;
    NextToken?: NextToken;
    /**
     * The maximum number of results to return for this request.
     */
    MaxResults?: ListAnswersMaxResults;
    /**
     * The priority of the question.
     */
    QuestionPriority?: QuestionPriority;
  }
  export type ListAnswersMaxResults = number;
  export interface ListAnswersOutput {
    WorkloadId?: WorkloadId;
    MilestoneNumber?: MilestoneNumber;
    LensAlias?: LensAlias;
    /**
     * The ARN for the lens.
     */
    LensArn?: LensArn;
    AnswerSummaries?: AnswerSummaries;
    NextToken?: NextToken;
  }
  export interface ListCheckDetailsInput {
    WorkloadId: WorkloadId;
    NextToken?: NextToken;
    MaxResults?: MaxResults;
    /**
     * Well-Architected Lens ARN.
     */
    LensArn: LensArn;
    PillarId: PillarId;
    QuestionId: QuestionId;
    ChoiceId: ChoiceId;
  }
  export interface ListCheckDetailsOutput {
    /**
     * The details about the Trusted Advisor checks related to the Well-Architected best practice.
     */
    CheckDetails?: CheckDetails;
    NextToken?: NextToken;
  }
  export interface ListCheckSummariesInput {
    WorkloadId: WorkloadId;
    NextToken?: NextToken;
    MaxResults?: MaxResults;
    /**
     * Well-Architected Lens ARN.
     */
    LensArn: LensArn;
    PillarId: PillarId;
    QuestionId: QuestionId;
    ChoiceId: ChoiceId;
  }
  export interface ListCheckSummariesOutput {
    /**
     * List of Trusted Advisor summaries related to the Well-Architected best practice.
     */
    CheckSummaries?: CheckSummaries;
    NextToken?: NextToken;
  }
  export interface ListLensReviewImprovementsInput {
    WorkloadId: WorkloadId;
    LensAlias: LensAlias;
    PillarId?: PillarId;
    MilestoneNumber?: MilestoneNumber;
    NextToken?: NextToken;
    /**
     * The maximum number of results to return for this request.
     */
    MaxResults?: ListLensReviewImprovementsMaxResults;
    /**
     * The priority of the question.
     */
    QuestionPriority?: QuestionPriority;
  }
  export type ListLensReviewImprovementsMaxResults = number;
  export interface ListLensReviewImprovementsOutput {
    WorkloadId?: WorkloadId;
    MilestoneNumber?: MilestoneNumber;
    LensAlias?: LensAlias;
    /**
     * The ARN for the lens.
     */
    LensArn?: LensArn;
    ImprovementSummaries?: ImprovementSummaries;
    NextToken?: NextToken;
  }
  export interface ListLensReviewsInput {
    WorkloadId: WorkloadId;
    MilestoneNumber?: MilestoneNumber;
    NextToken?: NextToken;
    MaxResults?: MaxResults;
  }
  export interface ListLensReviewsOutput {
    WorkloadId?: WorkloadId;
    MilestoneNumber?: MilestoneNumber;
    LensReviewSummaries?: LensReviewSummaries;
    NextToken?: NextToken;
  }
  export interface ListLensSharesInput {
    LensAlias: LensAlias;
    /**
     * The Amazon Web Services account ID, organization ID, or organizational unit (OU) ID with which the lens is shared.
     */
    SharedWithPrefix?: SharedWithPrefix;
    NextToken?: NextToken;
    /**
     * The maximum number of results to return for this request.
     */
    MaxResults?: ListWorkloadSharesMaxResults;
    Status?: ShareStatus;
  }
  export interface ListLensSharesOutput {
    /**
     * A list of lens share summaries.
     */
    LensShareSummaries?: LensShareSummaries;
    NextToken?: NextToken;
  }
  export interface ListLensesInput {
    NextToken?: NextToken;
    MaxResults?: MaxResults;
    /**
     * The type of lenses to be returned.
     */
    LensType?: LensType;
    /**
     * The status of lenses to be returned.
     */
    LensStatus?: LensStatusType;
    LensName?: LensName;
  }
  export interface ListLensesOutput {
    LensSummaries?: LensSummaries;
    NextToken?: NextToken;
  }
  export interface ListMilestonesInput {
    WorkloadId: WorkloadId;
    NextToken?: NextToken;
    MaxResults?: MaxResults;
  }
  export interface ListMilestonesOutput {
    WorkloadId?: WorkloadId;
    MilestoneSummaries?: MilestoneSummaries;
    NextToken?: NextToken;
  }
  export interface ListNotificationsInput {
    WorkloadId?: WorkloadId;
    NextToken?: NextToken;
    /**
     * The maximum number of results to return for this request.
     */
    MaxResults?: ListNotificationsMaxResults;
    /**
     * The ARN for the related resource for the notification.  Only one of WorkloadID or ResourceARN should be specified. 
     */
    ResourceArn?: ResourceArn;
  }
  export type ListNotificationsMaxResults = number;
  export interface ListNotificationsOutput {
    /**
     * List of lens notification summaries in a workload.
     */
    NotificationSummaries?: NotificationSummaries;
    NextToken?: NextToken;
  }
  export interface ListProfileNotificationsInput {
    WorkloadId?: WorkloadId;
    NextToken?: NextToken;
    MaxResults?: MaxResults;
  }
  export interface ListProfileNotificationsOutput {
    /**
     * Notification summaries.
     */
    NotificationSummaries?: ProfileNotificationSummaries;
    NextToken?: NextToken;
  }
  export interface ListProfileSharesInput {
    /**
     * The profile ARN.
     */
    ProfileArn: ProfileArn;
    /**
     * The Amazon Web Services account ID, organization ID, or organizational unit (OU) ID with which the profile is shared.
     */
    SharedWithPrefix?: SharedWithPrefix;
    NextToken?: NextToken;
    /**
     * The maximum number of results to return for this request.
     */
    MaxResults?: ListProfileSharesMaxResults;
    Status?: ShareStatus;
  }
  export type ListProfileSharesMaxResults = number;
  export interface ListProfileSharesOutput {
    /**
     * Profile share summaries.
     */
    ProfileShareSummaries?: ProfileShareSummaries;
    NextToken?: NextToken;
  }
  export interface ListProfilesInput {
    /**
     * An optional string added to the beginning of each profile name returned in the results.
     */
    ProfileNamePrefix?: ProfileNamePrefix;
    /**
     * Profile owner type.
     */
    ProfileOwnerType?: ProfileOwnerType;
    NextToken?: NextToken;
    MaxResults?: MaxResults;
  }
  export interface ListProfilesOutput {
    /**
     * Profile summaries.
     */
    ProfileSummaries?: ProfileSummaries;
    NextToken?: NextToken;
  }
  export interface ListReviewTemplateAnswersInput {
    /**
     * The ARN of the review template.
     */
    TemplateArn: TemplateArn;
    LensAlias: LensAlias;
    PillarId?: PillarId;
    NextToken?: NextToken;
    /**
     * The maximum number of results to return for this request.
     */
    MaxResults?: ListReviewTemplateAnswersMaxResults;
  }
  export type ListReviewTemplateAnswersMaxResults = number;
  export interface ListReviewTemplateAnswersOutput {
    /**
     * The ARN of the review template.
     */
    TemplateArn?: TemplateArn;
    LensAlias?: LensAlias;
    /**
     * List of answer summaries of a lens review in a review template.
     */
    AnswerSummaries?: ReviewTemplateAnswerSummaries;
    NextToken?: NextToken;
  }
  export interface ListReviewTemplatesInput {
    NextToken?: NextToken;
    MaxResults?: MaxResults;
  }
  export interface ListReviewTemplatesOutput {
    /**
     * List of review templates.
     */
    ReviewTemplates?: ReviewTemplates;
    NextToken?: NextToken;
  }
  export interface ListShareInvitationsInput {
    WorkloadNamePrefix?: WorkloadNamePrefix;
    /**
     * An optional string added to the beginning of each lens name returned in the results.
     */
    LensNamePrefix?: LensNamePrefix;
    /**
     * The type of share invitations to be returned.
     */
    ShareResourceType?: ShareResourceType;
    NextToken?: NextToken;
    /**
     * The maximum number of results to return for this request.
     */
    MaxResults?: ListShareInvitationsMaxResults;
    /**
     * An optional string added to the beginning of each profile name returned in the results.
     */
    ProfileNamePrefix?: ProfileNamePrefix;
    /**
     * An optional string added to the beginning of each review template name returned in the results.
     */
    TemplateNamePrefix?: TemplateNamePrefix;
  }
  export type ListShareInvitationsMaxResults = number;
  export interface ListShareInvitationsOutput {
    /**
     * List of share invitation summaries in a workload.
     */
    ShareInvitationSummaries?: ShareInvitationSummaries;
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceInput {
    WorkloadArn: WorkloadArn;
  }
  export interface ListTagsForResourceOutput {
    /**
     * The tags for the resource.
     */
    Tags?: TagMap;
  }
  export interface ListTemplateSharesInput {
    /**
     * The review template ARN.
     */
    TemplateArn: TemplateArn;
    /**
     * The Amazon Web Services account ID, organization ID, or organizational unit (OU) ID with which the profile is shared.
     */
    SharedWithPrefix?: SharedWithPrefix;
    NextToken?: NextToken;
    /**
     * The maximum number of results to return for this request.
     */
    MaxResults?: ListTemplateSharesMaxResults;
    Status?: ShareStatus;
  }
  export type ListTemplateSharesMaxResults = number;
  export interface ListTemplateSharesOutput {
    /**
     * The review template ARN.
     */
    TemplateArn?: TemplateArn;
    /**
     * A review template share summary return object.
     */
    TemplateShareSummaries?: TemplateShareSummaries;
    NextToken?: NextToken;
  }
  export interface ListWorkloadSharesInput {
    WorkloadId: WorkloadId;
    /**
     * The Amazon Web Services account ID, organization ID, or organizational unit (OU) ID with which the workload is shared.
     */
    SharedWithPrefix?: SharedWithPrefix;
    NextToken?: NextToken;
    /**
     * The maximum number of results to return for this request.
     */
    MaxResults?: ListWorkloadSharesMaxResults;
    Status?: ShareStatus;
  }
  export type ListWorkloadSharesMaxResults = number;
  export interface ListWorkloadSharesOutput {
    WorkloadId?: WorkloadId;
    WorkloadShareSummaries?: WorkloadShareSummaries;
    NextToken?: NextToken;
  }
  export interface ListWorkloadsInput {
    WorkloadNamePrefix?: WorkloadNamePrefix;
    NextToken?: NextToken;
    /**
     * The maximum number of results to return for this request.
     */
    MaxResults?: ListWorkloadsMaxResults;
  }
  export type ListWorkloadsMaxResults = number;
  export interface ListWorkloadsOutput {
    WorkloadSummaries?: WorkloadSummaries;
    NextToken?: NextToken;
  }
  export type MaxResults = number;
  export type MaxSelectedProfileChoices = number;
  export type MetricType = "WORKLOAD"|string;
  export interface Milestone {
    MilestoneNumber?: MilestoneNumber;
    MilestoneName?: MilestoneName;
    RecordedAt?: Timestamp;
    Workload?: Workload;
  }
  export type MilestoneName = string;
  export type MilestoneNumber = number;
  export type MilestoneSummaries = MilestoneSummary[];
  export interface MilestoneSummary {
    MilestoneNumber?: MilestoneNumber;
    MilestoneName?: MilestoneName;
    RecordedAt?: Timestamp;
    WorkloadSummary?: WorkloadSummary;
  }
  export type MinSelectedProfileChoices = number;
  export type NextToken = string;
  export type Notes = string;
  export type NotificationSummaries = NotificationSummary[];
  export interface NotificationSummary {
    /**
     * The type of notification.
     */
    Type?: NotificationType;
    /**
     * Summary of lens upgrade.
     */
    LensUpgradeSummary?: LensUpgradeSummary;
  }
  export type NotificationType = "LENS_VERSION_UPGRADED"|"LENS_VERSION_DEPRECATED"|string;
  export type OrganizationSharingStatus = "ENABLED"|"DISABLED"|string;
  export type PermissionType = "READONLY"|"CONTRIBUTOR"|string;
  export interface PillarDifference {
    PillarId?: PillarId;
    PillarName?: PillarName;
    /**
     * Indicates the type of change to the pillar.
     */
    DifferenceStatus?: DifferenceStatus;
    /**
     * List of question differences.
     */
    QuestionDifferences?: QuestionDifferences;
  }
  export type PillarDifferences = PillarDifference[];
  export type PillarId = string;
  export interface PillarMetric {
    PillarId?: PillarId;
    RiskCounts?: RiskCounts;
    /**
     * The questions that have been identified as risks in the pillar.
     */
    Questions?: QuestionMetrics;
  }
  export type PillarMetrics = PillarMetric[];
  export type PillarName = string;
  export type PillarNotes = {[key: string]: Notes};
  export type PillarReviewSummaries = PillarReviewSummary[];
  export interface PillarReviewSummary {
    PillarId?: PillarId;
    PillarName?: PillarName;
    Notes?: Notes;
    RiskCounts?: RiskCounts;
    PrioritizedRiskCounts?: RiskCounts;
  }
  export interface Profile {
    /**
     * The profile ARN.
     */
    ProfileArn?: ProfileArn;
    /**
     * The profile version.
     */
    ProfileVersion?: ProfileVersion;
    /**
     * The profile name.
     */
    ProfileName?: ProfileName;
    /**
     * The profile description.
     */
    ProfileDescription?: ProfileDescription;
    /**
     * Profile questions.
     */
    ProfileQuestions?: ProfileQuestions;
    Owner?: AwsAccountId;
    CreatedAt?: Timestamp;
    UpdatedAt?: Timestamp;
    /**
     * The ID assigned to the share invitation.
     */
    ShareInvitationId?: ShareInvitationId;
    /**
     * The tags assigned to the profile.
     */
    Tags?: TagMap;
  }
  export type ProfileArn = string;
  export type ProfileArns = ProfileArn[];
  export interface ProfileChoice {
    ChoiceId?: ChoiceId;
    ChoiceTitle?: ChoiceTitle;
    ChoiceDescription?: ChoiceDescription;
  }
  export type ProfileDescription = string;
  export type ProfileName = string;
  export type ProfileNamePrefix = string;
  export type ProfileNotificationSummaries = ProfileNotificationSummary[];
  export interface ProfileNotificationSummary {
    /**
     * The current profile version.
     */
    CurrentProfileVersion?: ProfileVersion;
    /**
     * The latest profile version.
     */
    LatestProfileVersion?: ProfileVersion;
    /**
     * Type of notification.
     */
    Type?: ProfileNotificationType;
    /**
     * The profile ARN.
     */
    ProfileArn?: ProfileArn;
    /**
     * The profile name.
     */
    ProfileName?: ProfileName;
    WorkloadId?: WorkloadId;
    WorkloadName?: WorkloadName;
  }
  export type ProfileNotificationType = "PROFILE_ANSWERS_UPDATED"|"PROFILE_DELETED"|string;
  export type ProfileOwnerType = "SELF"|"SHARED"|string;
  export interface ProfileQuestion {
    QuestionId?: QuestionId;
    QuestionTitle?: QuestionTitle;
    QuestionDescription?: QuestionDescription;
    /**
     * The question choices.
     */
    QuestionChoices?: ProfileQuestionChoices;
    /**
     * The selected choices.
     */
    SelectedChoiceIds?: SelectedChoiceIds;
    /**
     * The minimum number of selected choices.
     */
    MinSelectedChoices?: MinSelectedProfileChoices;
    /**
     * The maximum number of selected choices.
     */
    MaxSelectedChoices?: MaxSelectedProfileChoices;
  }
  export type ProfileQuestionChoices = ProfileChoice[];
  export interface ProfileQuestionUpdate {
    QuestionId?: QuestionId;
    /**
     * The selected choices.
     */
    SelectedChoiceIds?: SelectedProfileChoiceIds;
  }
  export type ProfileQuestionUpdates = ProfileQuestionUpdate[];
  export type ProfileQuestions = ProfileQuestion[];
  export type ProfileShareSummaries = ProfileShareSummary[];
  export interface ProfileShareSummary {
    ShareId?: ShareId;
    SharedWith?: SharedWith;
    Status?: ShareStatus;
    /**
     * Profile share invitation status message.
     */
    StatusMessage?: StatusMessage;
  }
  export type ProfileSummaries = ProfileSummary[];
  export interface ProfileSummary {
    /**
     * The profile ARN.
     */
    ProfileArn?: ProfileArn;
    /**
     * The profile version.
     */
    ProfileVersion?: ProfileVersion;
    /**
     * The profile name.
     */
    ProfileName?: ProfileName;
    /**
     * The profile description.
     */
    ProfileDescription?: ProfileDescription;
    Owner?: AwsAccountId;
    CreatedAt?: Timestamp;
    UpdatedAt?: Timestamp;
  }
  export interface ProfileTemplate {
    /**
     * The name of the profile template.
     */
    TemplateName?: ProfileName;
    /**
     * Profile template questions.
     */
    TemplateQuestions?: TemplateQuestions;
    CreatedAt?: Timestamp;
    UpdatedAt?: Timestamp;
  }
  export interface ProfileTemplateChoice {
    ChoiceId?: ChoiceId;
    ChoiceTitle?: ChoiceTitle;
    ChoiceDescription?: ChoiceDescription;
  }
  export interface ProfileTemplateQuestion {
    QuestionId?: QuestionId;
    QuestionTitle?: QuestionTitle;
    QuestionDescription?: QuestionDescription;
    /**
     * The question choices.
     */
    QuestionChoices?: ProfileTemplateQuestionChoices;
    /**
     * The minimum number of choices selected.
     */
    MinSelectedChoices?: MinSelectedProfileChoices;
    /**
     * The maximum number of choices selected.
     */
    MaxSelectedChoices?: MaxSelectedProfileChoices;
  }
  export type ProfileTemplateQuestionChoices = ProfileTemplateChoice[];
  export type ProfileVersion = string;
  export type Question = "UNANSWERED"|"ANSWERED"|string;
  export type QuestionCounts = {[key: string]: Count};
  export type QuestionDescription = string;
  export interface QuestionDifference {
    QuestionId?: QuestionId;
    QuestionTitle?: QuestionTitle;
    /**
     * Indicates the type of change to the question.
     */
    DifferenceStatus?: DifferenceStatus;
  }
  export type QuestionDifferences = QuestionDifference[];
  export type QuestionId = string;
  export interface QuestionMetric {
    QuestionId?: QuestionId;
    Risk?: Risk;
    /**
     * The best practices, or choices, that have been identified as contributing to risk in a question.
     */
    BestPractices?: BestPractices;
  }
  export type QuestionMetrics = QuestionMetric[];
  export type QuestionPriority = "PRIORITIZED"|"NONE"|string;
  export type QuestionTitle = string;
  export type QuestionType = "PRIORITIZED"|"NON_PRIORITIZED"|string;
  export type ReportFormat = "PDF"|"JSON"|string;
  export type ResourceArn = string;
  export interface ReviewTemplate {
    /**
     * The review template description.
     */
    Description?: TemplateDescription;
    /**
     * The lenses applied to the review template.
     */
    Lenses?: ReviewTemplateLenses;
    Notes?: Notes;
    /**
     * A count of how many total questions are answered and unanswered in the review template.
     */
    QuestionCounts?: QuestionCounts;
    Owner?: AwsAccountId;
    UpdatedAt?: Timestamp;
    /**
     * The review template ARN.
     */
    TemplateArn?: TemplateArn;
    /**
     * The name of the review template.
     */
    TemplateName?: TemplateName;
    /**
     * The tags assigned to the review template.
     */
    Tags?: TagMap;
    /**
     * The latest status of a review template.
     */
    UpdateStatus?: ReviewTemplateUpdateStatus;
    /**
     * The ID assigned to the template share invitation.
     */
    ShareInvitationId?: ShareInvitationId;
  }
  export interface ReviewTemplateAnswer {
    QuestionId?: QuestionId;
    PillarId?: PillarId;
    QuestionTitle?: QuestionTitle;
    QuestionDescription?: QuestionDescription;
    ImprovementPlanUrl?: ImprovementPlanUrl;
    HelpfulResourceUrl?: HelpfulResourceUrl;
    /**
     * The helpful resource text to be displayed for a custom lens.  This field does not apply to Amazon Web Services official lenses. 
     */
    HelpfulResourceDisplayText?: DisplayText;
    Choices?: Choices;
    SelectedChoices?: SelectedChoices;
    /**
     * A list of selected choices to a question in your review template.
     */
    ChoiceAnswers?: ChoiceAnswers;
    IsApplicable?: IsApplicable;
    /**
     * The status of whether or not this question has been answered.
     */
    AnswerStatus?: ReviewTemplateAnswerStatus;
    Notes?: Notes;
    /**
     * The reason why the question is not applicable to your review template.
     */
    Reason?: AnswerReason;
  }
  export type ReviewTemplateAnswerStatus = "UNANSWERED"|"ANSWERED"|string;
  export type ReviewTemplateAnswerSummaries = ReviewTemplateAnswerSummary[];
  export interface ReviewTemplateAnswerSummary {
    QuestionId?: QuestionId;
    PillarId?: PillarId;
    QuestionTitle?: QuestionTitle;
    Choices?: Choices;
    SelectedChoices?: SelectedChoices;
    /**
     * A list of selected choices to a question in the review template.
     */
    ChoiceAnswerSummaries?: ChoiceAnswerSummaries;
    IsApplicable?: IsApplicable;
    /**
     * The status of whether or not this question has been answered.
     */
    AnswerStatus?: ReviewTemplateAnswerStatus;
    /**
     * The reason why a choice is not-applicable to a question in the review template.
     */
    Reason?: AnswerReason;
    /**
     * The type of question.
     */
    QuestionType?: QuestionType;
  }
  export type ReviewTemplateArns = TemplateArn[];
  export type ReviewTemplateLensAliases = LensAlias[];
  export interface ReviewTemplateLensReview {
    LensAlias?: LensAlias;
    /**
     * The lens ARN.
     */
    LensArn?: LensArn;
    /**
     * The version of the lens.
     */
    LensVersion?: LensVersion;
    LensName?: LensName;
    /**
     * The status of the lens.
     */
    LensStatus?: LensStatus;
    /**
     * Pillar review summaries of a lens review.
     */
    PillarReviewSummaries?: ReviewTemplatePillarReviewSummaries;
    UpdatedAt?: Timestamp;
    Notes?: Notes;
    /**
     * A count of how many questions are answered and unanswered in the lens review.
     */
    QuestionCounts?: QuestionCounts;
    NextToken?: NextToken;
  }
  export type ReviewTemplateLenses = LensAlias[];
  export type ReviewTemplatePillarReviewSummaries = ReviewTemplatePillarReviewSummary[];
  export interface ReviewTemplatePillarReviewSummary {
    PillarId?: PillarId;
    PillarName?: PillarName;
    Notes?: Notes;
    /**
     * A count of how many questions are answered and unanswered in the requested pillar of the lens review.
     */
    QuestionCounts?: QuestionCounts;
  }
  export interface ReviewTemplateSummary {
    /**
     * Description of the review template.
     */
    Description?: TemplateDescription;
    /**
     * Lenses associated with the review template.
     */
    Lenses?: ReviewTemplateLenses;
    Owner?: AwsAccountId;
    UpdatedAt?: Timestamp;
    /**
     * The review template ARN.
     */
    TemplateArn?: TemplateArn;
    /**
     * The name of the review template.
     */
    TemplateName?: TemplateName;
    /**
     * The latest status of a review template.
     */
    UpdateStatus?: ReviewTemplateUpdateStatus;
  }
  export type ReviewTemplateUpdateStatus = "CURRENT"|"LENS_NOT_CURRENT"|string;
  export type ReviewTemplates = ReviewTemplateSummary[];
  export type Risk = "UNANSWERED"|"HIGH"|"MEDIUM"|"NONE"|"NOT_APPLICABLE"|string;
  export type RiskCounts = {[key: string]: Count};
  export type SelectedChoiceIds = ChoiceId[];
  export type SelectedChoices = ChoiceId[];
  export type SelectedProfileChoiceIds = ChoiceId[];
  export type ShareId = string;
  export interface ShareInvitation {
    /**
     * The ID assigned to the share invitation.
     */
    ShareInvitationId?: ShareInvitationId;
    /**
     * The resource type of the share invitation.
     */
    ShareResourceType?: ShareResourceType;
    WorkloadId?: WorkloadId;
    LensAlias?: LensAlias;
    /**
     * The ARN for the lens.
     */
    LensArn?: LensArn;
    /**
     * The profile ARN.
     */
    ProfileArn?: ProfileArn;
    /**
     * The review template ARN.
     */
    TemplateArn?: TemplateArn;
  }
  export type ShareInvitationAction = "ACCEPT"|"REJECT"|string;
  export type ShareInvitationId = string;
  export type ShareInvitationSummaries = ShareInvitationSummary[];
  export interface ShareInvitationSummary {
    /**
     * The ID assigned to the share invitation.
     */
    ShareInvitationId?: ShareInvitationId;
    SharedBy?: AwsAccountId;
    SharedWith?: SharedWith;
    PermissionType?: PermissionType;
    /**
     * The resource type of the share invitation.
     */
    ShareResourceType?: ShareResourceType;
    WorkloadName?: WorkloadName;
    WorkloadId?: WorkloadId;
    LensName?: LensName;
    /**
     * The ARN for the lens.
     */
    LensArn?: LensArn;
    /**
     * The profile name.
     */
    ProfileName?: ProfileName;
    /**
     * The profile ARN.
     */
    ProfileArn?: ProfileArn;
    /**
     * The name of the review template.
     */
    TemplateName?: TemplateName;
    /**
     * The review template ARN.
     */
    TemplateArn?: TemplateArn;
  }
  export type ShareResourceType = "WORKLOAD"|"LENS"|"PROFILE"|"TEMPLATE"|string;
  export type ShareStatus = "ACCEPTED"|"REJECTED"|"PENDING"|"REVOKED"|"EXPIRED"|"ASSOCIATING"|"ASSOCIATED"|"FAILED"|string;
  export type SharedWith = string;
  export type SharedWithPrefix = string;
  export type StatusMessage = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceInput {
    WorkloadArn: WorkloadArn;
    /**
     * The tags for the resource.
     */
    Tags: TagMap;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
  export type TemplateArn = string;
  export type TemplateDescription = string;
  export type TemplateName = string;
  export type TemplateNamePrefix = string;
  export type TemplateQuestions = ProfileTemplateQuestion[];
  export type TemplateShareSummaries = TemplateShareSummary[];
  export interface TemplateShareSummary {
    ShareId?: ShareId;
    SharedWith?: SharedWith;
    Status?: ShareStatus;
    /**
     * Review template share invitation status message. 
     */
    StatusMessage?: StatusMessage;
  }
  export type Timestamp = Date;
  export type TrustedAdvisorIntegrationStatus = "ENABLED"|"DISABLED"|string;
  export interface UntagResourceInput {
    WorkloadArn: WorkloadArn;
    /**
     * A list of tag keys. Existing tags of the resource whose keys are members of this list are removed from the resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceOutput {
  }
  export interface UpdateAnswerInput {
    WorkloadId: WorkloadId;
    LensAlias: LensAlias;
    QuestionId: QuestionId;
    SelectedChoices?: SelectedChoices;
    /**
     * A list of choices to update on a question in your workload. The String key corresponds to the choice ID to be updated.
     */
    ChoiceUpdates?: ChoiceUpdates;
    Notes?: Notes;
    IsApplicable?: IsApplicable;
    /**
     * The reason why a question is not applicable to your workload.
     */
    Reason?: AnswerReason;
  }
  export interface UpdateAnswerOutput {
    WorkloadId?: WorkloadId;
    LensAlias?: LensAlias;
    /**
     * The ARN for the lens.
     */
    LensArn?: LensArn;
    Answer?: Answer;
  }
  export interface UpdateGlobalSettingsInput {
    /**
     * The status of organization sharing settings.
     */
    OrganizationSharingStatus?: OrganizationSharingStatus;
    /**
     * The status of discovery support settings.
     */
    DiscoveryIntegrationStatus?: DiscoveryIntegrationStatus;
  }
  export interface UpdateLensReviewInput {
    WorkloadId: WorkloadId;
    LensAlias: LensAlias;
    LensNotes?: Notes;
    PillarNotes?: PillarNotes;
  }
  export interface UpdateLensReviewOutput {
    WorkloadId?: WorkloadId;
    LensReview?: LensReview;
  }
  export interface UpdateProfileInput {
    /**
     * The profile ARN.
     */
    ProfileArn: ProfileArn;
    /**
     * The profile description.
     */
    ProfileDescription?: ProfileDescription;
    /**
     * Profile questions.
     */
    ProfileQuestions?: ProfileQuestionUpdates;
  }
  export interface UpdateProfileOutput {
    /**
     * The profile.
     */
    Profile?: Profile;
  }
  export interface UpdateReviewTemplateAnswerInput {
    /**
     * The review template ARN.
     */
    TemplateArn: TemplateArn;
    LensAlias: LensAlias;
    QuestionId: QuestionId;
    SelectedChoices?: SelectedChoices;
    /**
     * A list of choices to be updated.
     */
    ChoiceUpdates?: ChoiceUpdates;
    Notes?: Notes;
    IsApplicable?: IsApplicable;
    /**
     * The update reason.
     */
    Reason?: AnswerReason;
  }
  export interface UpdateReviewTemplateAnswerOutput {
    /**
     * The review template ARN.
     */
    TemplateArn?: TemplateArn;
    LensAlias?: LensAlias;
    /**
     * An answer of the question.
     */
    Answer?: ReviewTemplateAnswer;
  }
  export interface UpdateReviewTemplateInput {
    /**
     * The review template ARN.
     */
    TemplateArn: TemplateArn;
    /**
     * The review template name.
     */
    TemplateName?: TemplateName;
    /**
     * The review template description.
     */
    Description?: TemplateDescription;
    Notes?: Notes;
    /**
     * A list of lens aliases or ARNs to apply to the review template.
     */
    LensesToAssociate?: ReviewTemplateLensAliases;
    /**
     * A list of lens aliases or ARNs to unapply to the review template. The wellarchitected lens cannot be unapplied.
     */
    LensesToDisassociate?: ReviewTemplateLensAliases;
  }
  export interface UpdateReviewTemplateLensReviewInput {
    /**
     * The review template ARN.
     */
    TemplateArn: TemplateArn;
    LensAlias: LensAlias;
    LensNotes?: Notes;
    PillarNotes?: PillarNotes;
  }
  export interface UpdateReviewTemplateLensReviewOutput {
    /**
     * The review template ARN.
     */
    TemplateArn?: TemplateArn;
    /**
     * A lens review of a question.
     */
    LensReview?: ReviewTemplateLensReview;
  }
  export interface UpdateReviewTemplateOutput {
    /**
     * A review template.
     */
    ReviewTemplate?: ReviewTemplate;
  }
  export interface UpdateShareInvitationInput {
    /**
     * The ID assigned to the share invitation.
     */
    ShareInvitationId: ShareInvitationId;
    ShareInvitationAction: ShareInvitationAction;
  }
  export interface UpdateShareInvitationOutput {
    /**
     * The updated workload or custom lens share invitation.
     */
    ShareInvitation?: ShareInvitation;
  }
  export interface UpdateWorkloadInput {
    WorkloadId: WorkloadId;
    WorkloadName?: WorkloadName;
    Description?: WorkloadDescription;
    Environment?: WorkloadEnvironment;
    AccountIds?: WorkloadAccountIds;
    AwsRegions?: WorkloadAwsRegions;
    NonAwsRegions?: WorkloadNonAwsRegions;
    PillarPriorities?: WorkloadPillarPriorities;
    ArchitecturalDesign?: WorkloadArchitecturalDesign;
    ReviewOwner?: WorkloadReviewOwner;
    /**
     * Flag indicating whether the workload owner has acknowledged that the Review owner field is required. If a Review owner is not added to the workload within 60 days of acknowledgement, access to the workload is restricted until an owner is added.
     */
    IsReviewOwnerUpdateAcknowledged?: IsReviewOwnerUpdateAcknowledged;
    IndustryType?: WorkloadIndustryType;
    Industry?: WorkloadIndustry;
    Notes?: Notes;
    ImprovementStatus?: WorkloadImprovementStatus;
    /**
     * Well-Architected discovery configuration settings to associate to the workload.
     */
    DiscoveryConfig?: WorkloadDiscoveryConfig;
    /**
     * List of AppRegistry application ARNs to associate to the workload.
     */
    Applications?: WorkloadApplications;
  }
  export interface UpdateWorkloadOutput {
    Workload?: Workload;
  }
  export interface UpdateWorkloadShareInput {
    ShareId: ShareId;
    WorkloadId: WorkloadId;
    PermissionType: PermissionType;
  }
  export interface UpdateWorkloadShareOutput {
    WorkloadId?: WorkloadId;
    WorkloadShare?: WorkloadShare;
  }
  export interface UpgradeLensReviewInput {
    WorkloadId: WorkloadId;
    LensAlias: LensAlias;
    MilestoneName: MilestoneName;
    ClientRequestToken?: ClientRequestToken;
  }
  export interface UpgradeProfileVersionInput {
    WorkloadId: WorkloadId;
    /**
     * The profile ARN.
     */
    ProfileArn: ProfileArn;
    MilestoneName?: MilestoneName;
    ClientRequestToken?: ClientRequestToken;
  }
  export interface UpgradeReviewTemplateLensReviewInput {
    /**
     * The ARN of the review template.
     */
    TemplateArn: TemplateArn;
    LensAlias: LensAlias;
    ClientRequestToken?: ClientRequestToken;
  }
  export type Urls = ChoiceContent[];
  export interface VersionDifferences {
    /**
     * The differences between the base and latest versions of the lens.
     */
    PillarDifferences?: PillarDifferences;
  }
  export interface Workload {
    WorkloadId?: WorkloadId;
    WorkloadArn?: WorkloadArn;
    WorkloadName?: WorkloadName;
    Description?: WorkloadDescription;
    Environment?: WorkloadEnvironment;
    UpdatedAt?: Timestamp;
    AccountIds?: WorkloadAccountIds;
    AwsRegions?: WorkloadAwsRegions;
    NonAwsRegions?: WorkloadNonAwsRegions;
    ArchitecturalDesign?: WorkloadArchitecturalDesign;
    ReviewOwner?: WorkloadReviewOwner;
    ReviewRestrictionDate?: Timestamp;
    /**
     * Flag indicating whether the workload owner has acknowledged that the Review owner field is required. If a Review owner is not added to the workload within 60 days of acknowledgement, access to the workload is restricted until an owner is added.
     */
    IsReviewOwnerUpdateAcknowledged?: IsReviewOwnerUpdateAcknowledged;
    IndustryType?: WorkloadIndustryType;
    Industry?: WorkloadIndustry;
    Notes?: Notes;
    ImprovementStatus?: WorkloadImprovementStatus;
    RiskCounts?: RiskCounts;
    PillarPriorities?: WorkloadPillarPriorities;
    Lenses?: WorkloadLenses;
    Owner?: AwsAccountId;
    /**
     * The ID assigned to the share invitation.
     */
    ShareInvitationId?: ShareInvitationId;
    /**
     * The tags associated with the workload.
     */
    Tags?: TagMap;
    /**
     * Discovery configuration associated to the workload.
     */
    DiscoveryConfig?: WorkloadDiscoveryConfig;
    /**
     * List of AppRegistry application ARNs associated to the workload.
     */
    Applications?: WorkloadApplications;
    /**
     * Profile associated with a workload.
     */
    Profiles?: WorkloadProfiles;
    PrioritizedRiskCounts?: RiskCounts;
  }
  export type WorkloadAccountIds = AwsAccountId[];
  export type WorkloadApplications = ApplicationArn[];
  export type WorkloadArchitecturalDesign = string;
  export type WorkloadArn = string;
  export type WorkloadAwsRegions = AwsRegion[];
  export type WorkloadDescription = string;
  export interface WorkloadDiscoveryConfig {
    /**
     * Discovery integration status in respect to Trusted Advisor for the workload.
     */
    TrustedAdvisorIntegrationStatus?: TrustedAdvisorIntegrationStatus;
    /**
     * The mode to use for identifying resources associated with the workload. You can specify WORKLOAD_METADATA, APP_REGISTRY, or both.
     */
    WorkloadResourceDefinition?: WorkloadResourceDefinition;
  }
  export type WorkloadEnvironment = "PRODUCTION"|"PREPRODUCTION"|string;
  export type WorkloadId = string;
  export type WorkloadImprovementStatus = "NOT_APPLICABLE"|"NOT_STARTED"|"IN_PROGRESS"|"COMPLETE"|"RISK_ACKNOWLEDGED"|string;
  export type WorkloadIndustry = string;
  export type WorkloadIndustryType = string;
  export type WorkloadLenses = LensAlias[];
  export type WorkloadName = string;
  export type WorkloadNamePrefix = string;
  export type WorkloadNonAwsRegion = string;
  export type WorkloadNonAwsRegions = WorkloadNonAwsRegion[];
  export type WorkloadPillarPriorities = PillarId[];
  export interface WorkloadProfile {
    /**
     * The profile ARN.
     */
    ProfileArn?: ProfileArn;
    /**
     * The profile version.
     */
    ProfileVersion?: ProfileVersion;
  }
  export type WorkloadProfileArns = ProfileArn[];
  export type WorkloadProfiles = WorkloadProfile[];
  export type WorkloadResourceDefinition = DefinitionType[];
  export type WorkloadReviewOwner = string;
  export interface WorkloadShare {
    ShareId?: ShareId;
    SharedBy?: AwsAccountId;
    SharedWith?: SharedWith;
    PermissionType?: PermissionType;
    Status?: ShareStatus;
    WorkloadName?: WorkloadName;
    WorkloadId?: WorkloadId;
  }
  export type WorkloadShareSummaries = WorkloadShareSummary[];
  export interface WorkloadShareSummary {
    ShareId?: ShareId;
    SharedWith?: SharedWith;
    PermissionType?: PermissionType;
    Status?: ShareStatus;
    /**
     * Optional message to compliment the Status field.
     */
    StatusMessage?: StatusMessage;
  }
  export type WorkloadSummaries = WorkloadSummary[];
  export interface WorkloadSummary {
    WorkloadId?: WorkloadId;
    WorkloadArn?: WorkloadArn;
    WorkloadName?: WorkloadName;
    Owner?: AwsAccountId;
    UpdatedAt?: Timestamp;
    Lenses?: WorkloadLenses;
    RiskCounts?: RiskCounts;
    ImprovementStatus?: WorkloadImprovementStatus;
    /**
     * Profile associated with a workload.
     */
    Profiles?: WorkloadProfiles;
    PrioritizedRiskCounts?: RiskCounts;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-03-31"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the WellArchitected client.
   */
  export import Types = WellArchitected;
}
export = WellArchitected;
