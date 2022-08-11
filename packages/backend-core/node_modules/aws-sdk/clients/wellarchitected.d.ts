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
   * Associate a lens to a workload.
   */
  associateLenses(params: WellArchitected.Types.AssociateLensesInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associate a lens to a workload.
   */
  associateLenses(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Create a milestone for an existing workload.
   */
  createMilestone(params: WellArchitected.Types.CreateMilestoneInput, callback?: (err: AWSError, data: WellArchitected.Types.CreateMilestoneOutput) => void): Request<WellArchitected.Types.CreateMilestoneOutput, AWSError>;
  /**
   * Create a milestone for an existing workload.
   */
  createMilestone(callback?: (err: AWSError, data: WellArchitected.Types.CreateMilestoneOutput) => void): Request<WellArchitected.Types.CreateMilestoneOutput, AWSError>;
  /**
   * Create a new workload. The owner of a workload can share the workload with other AWS accounts and IAM users in the same AWS Region. Only the owner of a workload can delete it. For more information, see Defining a Workload in the AWS Well-Architected Tool User Guide.
   */
  createWorkload(params: WellArchitected.Types.CreateWorkloadInput, callback?: (err: AWSError, data: WellArchitected.Types.CreateWorkloadOutput) => void): Request<WellArchitected.Types.CreateWorkloadOutput, AWSError>;
  /**
   * Create a new workload. The owner of a workload can share the workload with other AWS accounts and IAM users in the same AWS Region. Only the owner of a workload can delete it. For more information, see Defining a Workload in the AWS Well-Architected Tool User Guide.
   */
  createWorkload(callback?: (err: AWSError, data: WellArchitected.Types.CreateWorkloadOutput) => void): Request<WellArchitected.Types.CreateWorkloadOutput, AWSError>;
  /**
   * Create a workload share. The owner of a workload can share it with other AWS accounts and IAM users in the same AWS Region. Shared access to a workload is not removed until the workload invitation is deleted. For more information, see Sharing a Workload in the AWS Well-Architected Tool User Guide.
   */
  createWorkloadShare(params: WellArchitected.Types.CreateWorkloadShareInput, callback?: (err: AWSError, data: WellArchitected.Types.CreateWorkloadShareOutput) => void): Request<WellArchitected.Types.CreateWorkloadShareOutput, AWSError>;
  /**
   * Create a workload share. The owner of a workload can share it with other AWS accounts and IAM users in the same AWS Region. Shared access to a workload is not removed until the workload invitation is deleted. For more information, see Sharing a Workload in the AWS Well-Architected Tool User Guide.
   */
  createWorkloadShare(callback?: (err: AWSError, data: WellArchitected.Types.CreateWorkloadShareOutput) => void): Request<WellArchitected.Types.CreateWorkloadShareOutput, AWSError>;
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
   * Disassociate a lens from a workload.  The AWS Well-Architected Framework lens (wellarchitected) cannot be removed from a workload. 
   */
  disassociateLenses(params: WellArchitected.Types.DisassociateLensesInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociate a lens from a workload.  The AWS Well-Architected Framework lens (wellarchitected) cannot be removed from a workload. 
   */
  disassociateLenses(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Get the answer to a specific question in a workload review.
   */
  getAnswer(params: WellArchitected.Types.GetAnswerInput, callback?: (err: AWSError, data: WellArchitected.Types.GetAnswerOutput) => void): Request<WellArchitected.Types.GetAnswerOutput, AWSError>;
  /**
   * Get the answer to a specific question in a workload review.
   */
  getAnswer(callback?: (err: AWSError, data: WellArchitected.Types.GetAnswerOutput) => void): Request<WellArchitected.Types.GetAnswerOutput, AWSError>;
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
   * Get an existing workload.
   */
  getWorkload(params: WellArchitected.Types.GetWorkloadInput, callback?: (err: AWSError, data: WellArchitected.Types.GetWorkloadOutput) => void): Request<WellArchitected.Types.GetWorkloadOutput, AWSError>;
  /**
   * Get an existing workload.
   */
  getWorkload(callback?: (err: AWSError, data: WellArchitected.Types.GetWorkloadOutput) => void): Request<WellArchitected.Types.GetWorkloadOutput, AWSError>;
  /**
   * List of answers.
   */
  listAnswers(params: WellArchitected.Types.ListAnswersInput, callback?: (err: AWSError, data: WellArchitected.Types.ListAnswersOutput) => void): Request<WellArchitected.Types.ListAnswersOutput, AWSError>;
  /**
   * List of answers.
   */
  listAnswers(callback?: (err: AWSError, data: WellArchitected.Types.ListAnswersOutput) => void): Request<WellArchitected.Types.ListAnswersOutput, AWSError>;
  /**
   * List lens review improvements.
   */
  listLensReviewImprovements(params: WellArchitected.Types.ListLensReviewImprovementsInput, callback?: (err: AWSError, data: WellArchitected.Types.ListLensReviewImprovementsOutput) => void): Request<WellArchitected.Types.ListLensReviewImprovementsOutput, AWSError>;
  /**
   * List lens review improvements.
   */
  listLensReviewImprovements(callback?: (err: AWSError, data: WellArchitected.Types.ListLensReviewImprovementsOutput) => void): Request<WellArchitected.Types.ListLensReviewImprovementsOutput, AWSError>;
  /**
   * List lens reviews.
   */
  listLensReviews(params: WellArchitected.Types.ListLensReviewsInput, callback?: (err: AWSError, data: WellArchitected.Types.ListLensReviewsOutput) => void): Request<WellArchitected.Types.ListLensReviewsOutput, AWSError>;
  /**
   * List lens reviews.
   */
  listLensReviews(callback?: (err: AWSError, data: WellArchitected.Types.ListLensReviewsOutput) => void): Request<WellArchitected.Types.ListLensReviewsOutput, AWSError>;
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
   * List the workload invitations.
   */
  listShareInvitations(params: WellArchitected.Types.ListShareInvitationsInput, callback?: (err: AWSError, data: WellArchitected.Types.ListShareInvitationsOutput) => void): Request<WellArchitected.Types.ListShareInvitationsOutput, AWSError>;
  /**
   * List the workload invitations.
   */
  listShareInvitations(callback?: (err: AWSError, data: WellArchitected.Types.ListShareInvitationsOutput) => void): Request<WellArchitected.Types.ListShareInvitationsOutput, AWSError>;
  /**
   * List the tags for a resource.
   */
  listTagsForResource(params: WellArchitected.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: WellArchitected.Types.ListTagsForResourceOutput) => void): Request<WellArchitected.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * List the tags for a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: WellArchitected.Types.ListTagsForResourceOutput) => void): Request<WellArchitected.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * List the workload shares associated with the workload.
   */
  listWorkloadShares(params: WellArchitected.Types.ListWorkloadSharesInput, callback?: (err: AWSError, data: WellArchitected.Types.ListWorkloadSharesOutput) => void): Request<WellArchitected.Types.ListWorkloadSharesOutput, AWSError>;
  /**
   * List the workload shares associated with the workload.
   */
  listWorkloadShares(callback?: (err: AWSError, data: WellArchitected.Types.ListWorkloadSharesOutput) => void): Request<WellArchitected.Types.ListWorkloadSharesOutput, AWSError>;
  /**
   * List workloads. Paginated.
   */
  listWorkloads(params: WellArchitected.Types.ListWorkloadsInput, callback?: (err: AWSError, data: WellArchitected.Types.ListWorkloadsOutput) => void): Request<WellArchitected.Types.ListWorkloadsOutput, AWSError>;
  /**
   * List workloads. Paginated.
   */
  listWorkloads(callback?: (err: AWSError, data: WellArchitected.Types.ListWorkloadsOutput) => void): Request<WellArchitected.Types.ListWorkloadsOutput, AWSError>;
  /**
   * Adds one or more tags to the specified resource.
   */
  tagResource(params: WellArchitected.Types.TagResourceInput, callback?: (err: AWSError, data: WellArchitected.Types.TagResourceOutput) => void): Request<WellArchitected.Types.TagResourceOutput, AWSError>;
  /**
   * Adds one or more tags to the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: WellArchitected.Types.TagResourceOutput) => void): Request<WellArchitected.Types.TagResourceOutput, AWSError>;
  /**
   * Deletes specified tags from a resource. To specify multiple tags, use separate tagKeys parameters, for example:  DELETE /tags/WorkloadArn?tagKeys=key1&amp;tagKeys=key2 
   */
  untagResource(params: WellArchitected.Types.UntagResourceInput, callback?: (err: AWSError, data: WellArchitected.Types.UntagResourceOutput) => void): Request<WellArchitected.Types.UntagResourceOutput, AWSError>;
  /**
   * Deletes specified tags from a resource. To specify multiple tags, use separate tagKeys parameters, for example:  DELETE /tags/WorkloadArn?tagKeys=key1&amp;tagKeys=key2 
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
   * Update lens review.
   */
  updateLensReview(params: WellArchitected.Types.UpdateLensReviewInput, callback?: (err: AWSError, data: WellArchitected.Types.UpdateLensReviewOutput) => void): Request<WellArchitected.Types.UpdateLensReviewOutput, AWSError>;
  /**
   * Update lens review.
   */
  updateLensReview(callback?: (err: AWSError, data: WellArchitected.Types.UpdateLensReviewOutput) => void): Request<WellArchitected.Types.UpdateLensReviewOutput, AWSError>;
  /**
   * Update a workload invitation.
   */
  updateShareInvitation(params: WellArchitected.Types.UpdateShareInvitationInput, callback?: (err: AWSError, data: WellArchitected.Types.UpdateShareInvitationOutput) => void): Request<WellArchitected.Types.UpdateShareInvitationOutput, AWSError>;
  /**
   * Update a workload invitation.
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
   * Upgrade lens review.
   */
  upgradeLensReview(params: WellArchitected.Types.UpgradeLensReviewInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Upgrade lens review.
   */
  upgradeLensReview(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace WellArchitected {
  export interface Answer {
    QuestionId?: QuestionId;
    PillarId?: PillarId;
    QuestionTitle?: QuestionTitle;
    QuestionDescription?: QuestionDescription;
    ImprovementPlanUrl?: ImprovementPlanUrl;
    HelpfulResourceUrl?: HelpfulResourceUrl;
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
  }
  export interface AssociateLensesInput {
    WorkloadId: WorkloadId;
    LensAliases: LensAliases;
  }
  export type AwsAccountId = string;
  export type AwsRegion = string;
  export type Base64String = string;
  export interface Choice {
    ChoiceId?: ChoiceId;
    Title?: ChoiceTitle;
    Description?: ChoiceDescription;
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
  export type ChoiceDescription = string;
  export type ChoiceId = string;
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
  export type Count = number;
  export interface CreateMilestoneInput {
    WorkloadId: WorkloadId;
    MilestoneName: MilestoneName;
    ClientRequestToken: ClientRequestToken;
  }
  export interface CreateMilestoneOutput {
    WorkloadId?: WorkloadId;
    MilestoneNumber?: MilestoneNumber;
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
    ReviewOwner: WorkloadReviewOwner;
    IndustryType?: WorkloadIndustryType;
    Industry?: WorkloadIndustry;
    Lenses: WorkloadLenses;
    Notes?: Notes;
    ClientRequestToken: ClientRequestToken;
    /**
     * The tags to be associated with the workload.
     */
    Tags?: TagMap;
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
    Answer?: Answer;
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
    BaseLensVersion: LensVersion;
  }
  export interface GetLensVersionDifferenceOutput {
    LensAlias?: LensAlias;
    /**
     * The base version of the lens.
     */
    BaseLensVersion?: LensVersion;
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
  export interface GetWorkloadInput {
    WorkloadId: WorkloadId;
  }
  export interface GetWorkloadOutput {
    Workload?: Workload;
  }
  export type HelpfulResourceUrl = string;
  export type ImprovementPlanUrl = string;
  export type ImprovementSummaries = ImprovementSummary[];
  export interface ImprovementSummary {
    QuestionId?: QuestionId;
    PillarId?: PillarId;
    QuestionTitle?: QuestionTitle;
    Risk?: Risk;
    ImprovementPlanUrl?: ImprovementPlanUrl;
  }
  export type IsApplicable = boolean;
  export type IsReviewOwnerUpdateAcknowledged = boolean;
  export type LensAlias = string;
  export type LensAliases = LensAlias[];
  export type LensDescription = string;
  export type LensName = string;
  export interface LensReview {
    LensAlias?: LensAlias;
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
  }
  export interface LensReviewReport {
    LensAlias?: LensAlias;
    Base64String?: Base64String;
  }
  export type LensReviewSummaries = LensReviewSummary[];
  export interface LensReviewSummary {
    LensAlias?: LensAlias;
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
  }
  export type LensStatus = "CURRENT"|"NOT_CURRENT"|"DEPRECATED"|string;
  export type LensSummaries = LensSummary[];
  export interface LensSummary {
    LensAlias?: LensAlias;
    /**
     * The version of the lens.
     */
    LensVersion?: LensVersion;
    LensName?: LensName;
    Description?: LensDescription;
  }
  export interface LensUpgradeSummary {
    WorkloadId?: WorkloadId;
    WorkloadName?: WorkloadName;
    LensAlias?: LensAlias;
    /**
     * The current version of the lens.
     */
    CurrentLensVersion?: LensVersion;
    /**
     * The latest version of the lens.
     */
    LatestLensVersion?: LensVersion;
  }
  export type LensVersion = string;
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
  }
  export type ListAnswersMaxResults = number;
  export interface ListAnswersOutput {
    WorkloadId?: WorkloadId;
    MilestoneNumber?: MilestoneNumber;
    LensAlias?: LensAlias;
    AnswerSummaries?: AnswerSummaries;
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
  }
  export type ListLensReviewImprovementsMaxResults = number;
  export interface ListLensReviewImprovementsOutput {
    WorkloadId?: WorkloadId;
    MilestoneNumber?: MilestoneNumber;
    LensAlias?: LensAlias;
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
  export interface ListLensesInput {
    NextToken?: NextToken;
    MaxResults?: MaxResults;
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
  }
  export type ListNotificationsMaxResults = number;
  export interface ListNotificationsOutput {
    /**
     * List of lens notification summaries in a workload.
     */
    NotificationSummaries?: NotificationSummaries;
    NextToken?: NextToken;
  }
  export interface ListShareInvitationsInput {
    WorkloadNamePrefix?: WorkloadNamePrefix;
    NextToken?: NextToken;
    /**
     * The maximum number of results to return for this request.
     */
    MaxResults?: ListShareInvitationsMaxResults;
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
  export interface ListWorkloadSharesInput {
    WorkloadId: WorkloadId;
    /**
     * The AWS account ID or IAM role with which the workload is shared.
     */
    SharedWithPrefix?: SharedWithPrefix;
    NextToken?: NextToken;
    /**
     * The maximum number of results to return for this request.
     */
    MaxResults?: ListWorkloadSharesMaxResults;
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
  export type PermissionType = "READONLY"|"CONTRIBUTOR"|string;
  export interface PillarDifference {
    PillarId?: PillarId;
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
  export type PillarName = string;
  export type PillarNotes = {[key: string]: Notes};
  export type PillarReviewSummaries = PillarReviewSummary[];
  export interface PillarReviewSummary {
    PillarId?: PillarId;
    PillarName?: PillarName;
    Notes?: Notes;
    RiskCounts?: RiskCounts;
  }
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
  export type QuestionTitle = string;
  export type Risk = "UNANSWERED"|"HIGH"|"MEDIUM"|"NONE"|"NOT_APPLICABLE"|string;
  export type RiskCounts = {[key: string]: Count};
  export type SelectedChoices = ChoiceId[];
  export type ShareId = string;
  export interface ShareInvitation {
    /**
     * The ID assigned to the share invitation.
     */
    ShareInvitationId?: ShareInvitationId;
    WorkloadId?: WorkloadId;
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
    WorkloadName?: WorkloadName;
    WorkloadId?: WorkloadId;
  }
  export type ShareStatus = "ACCEPTED"|"REJECTED"|"PENDING"|"REVOKED"|"EXPIRED"|string;
  export type SharedWith = string;
  export type SharedWithPrefix = string;
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
  export type Timestamp = Date;
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
    Answer?: Answer;
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
  export interface UpdateShareInvitationInput {
    /**
     * The ID assigned to the share invitation.
     */
    ShareInvitationId: ShareInvitationId;
    ShareInvitationAction: ShareInvitationAction;
  }
  export interface UpdateShareInvitationOutput {
    /**
     * The updated workload share invitation.
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
  }
  export type WorkloadAccountIds = AwsAccountId[];
  export type WorkloadArchitecturalDesign = string;
  export type WorkloadArn = string;
  export type WorkloadAwsRegions = AwsRegion[];
  export type WorkloadDescription = string;
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
