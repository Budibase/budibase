import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CodeGuruReviewer extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CodeGuruReviewer.Types.ClientConfiguration)
  config: Config & CodeGuruReviewer.Types.ClientConfiguration;
  /**
   *  Use to associate an Amazon Web Services CodeCommit repository or a repostory managed by Amazon Web Services CodeStar Connections with Amazon CodeGuru Reviewer. When you associate a repository, CodeGuru Reviewer reviews source code changes in the repository's pull requests and provides automatic recommendations. You can view recommendations using the CodeGuru Reviewer console. For more information, see Recommendations in Amazon CodeGuru Reviewer in the Amazon CodeGuru Reviewer User Guide.  If you associate a CodeCommit or S3 repository, it must be in the same Amazon Web Services Region and Amazon Web Services account where its CodeGuru Reviewer code reviews are configured. Bitbucket and GitHub Enterprise Server repositories are managed by Amazon Web Services CodeStar Connections to connect to CodeGuru Reviewer. For more information, see Associate a repository in the Amazon CodeGuru Reviewer User Guide.    You cannot use the CodeGuru Reviewer SDK or the Amazon Web Services CLI to associate a GitHub repository with Amazon CodeGuru Reviewer. To associate a GitHub repository, use the console. For more information, see Getting started with CodeGuru Reviewer in the CodeGuru Reviewer User Guide.  
   */
  associateRepository(params: CodeGuruReviewer.Types.AssociateRepositoryRequest, callback?: (err: AWSError, data: CodeGuruReviewer.Types.AssociateRepositoryResponse) => void): Request<CodeGuruReviewer.Types.AssociateRepositoryResponse, AWSError>;
  /**
   *  Use to associate an Amazon Web Services CodeCommit repository or a repostory managed by Amazon Web Services CodeStar Connections with Amazon CodeGuru Reviewer. When you associate a repository, CodeGuru Reviewer reviews source code changes in the repository's pull requests and provides automatic recommendations. You can view recommendations using the CodeGuru Reviewer console. For more information, see Recommendations in Amazon CodeGuru Reviewer in the Amazon CodeGuru Reviewer User Guide.  If you associate a CodeCommit or S3 repository, it must be in the same Amazon Web Services Region and Amazon Web Services account where its CodeGuru Reviewer code reviews are configured. Bitbucket and GitHub Enterprise Server repositories are managed by Amazon Web Services CodeStar Connections to connect to CodeGuru Reviewer. For more information, see Associate a repository in the Amazon CodeGuru Reviewer User Guide.    You cannot use the CodeGuru Reviewer SDK or the Amazon Web Services CLI to associate a GitHub repository with Amazon CodeGuru Reviewer. To associate a GitHub repository, use the console. For more information, see Getting started with CodeGuru Reviewer in the CodeGuru Reviewer User Guide.  
   */
  associateRepository(callback?: (err: AWSError, data: CodeGuruReviewer.Types.AssociateRepositoryResponse) => void): Request<CodeGuruReviewer.Types.AssociateRepositoryResponse, AWSError>;
  /**
   *  Use to create a code review with a  CodeReviewType  of RepositoryAnalysis. This type of code review analyzes all code under a specified branch in an associated repository. PullRequest code reviews are automatically triggered by a pull request. 
   */
  createCodeReview(params: CodeGuruReviewer.Types.CreateCodeReviewRequest, callback?: (err: AWSError, data: CodeGuruReviewer.Types.CreateCodeReviewResponse) => void): Request<CodeGuruReviewer.Types.CreateCodeReviewResponse, AWSError>;
  /**
   *  Use to create a code review with a  CodeReviewType  of RepositoryAnalysis. This type of code review analyzes all code under a specified branch in an associated repository. PullRequest code reviews are automatically triggered by a pull request. 
   */
  createCodeReview(callback?: (err: AWSError, data: CodeGuruReviewer.Types.CreateCodeReviewResponse) => void): Request<CodeGuruReviewer.Types.CreateCodeReviewResponse, AWSError>;
  /**
   *  Returns the metadata associated with the code review along with its status.
   */
  describeCodeReview(params: CodeGuruReviewer.Types.DescribeCodeReviewRequest, callback?: (err: AWSError, data: CodeGuruReviewer.Types.DescribeCodeReviewResponse) => void): Request<CodeGuruReviewer.Types.DescribeCodeReviewResponse, AWSError>;
  /**
   *  Returns the metadata associated with the code review along with its status.
   */
  describeCodeReview(callback?: (err: AWSError, data: CodeGuruReviewer.Types.DescribeCodeReviewResponse) => void): Request<CodeGuruReviewer.Types.DescribeCodeReviewResponse, AWSError>;
  /**
   *  Describes the customer feedback for a CodeGuru Reviewer recommendation. 
   */
  describeRecommendationFeedback(params: CodeGuruReviewer.Types.DescribeRecommendationFeedbackRequest, callback?: (err: AWSError, data: CodeGuruReviewer.Types.DescribeRecommendationFeedbackResponse) => void): Request<CodeGuruReviewer.Types.DescribeRecommendationFeedbackResponse, AWSError>;
  /**
   *  Describes the customer feedback for a CodeGuru Reviewer recommendation. 
   */
  describeRecommendationFeedback(callback?: (err: AWSError, data: CodeGuruReviewer.Types.DescribeRecommendationFeedbackResponse) => void): Request<CodeGuruReviewer.Types.DescribeRecommendationFeedbackResponse, AWSError>;
  /**
   *  Returns a  RepositoryAssociation  object that contains information about the requested repository association. 
   */
  describeRepositoryAssociation(params: CodeGuruReviewer.Types.DescribeRepositoryAssociationRequest, callback?: (err: AWSError, data: CodeGuruReviewer.Types.DescribeRepositoryAssociationResponse) => void): Request<CodeGuruReviewer.Types.DescribeRepositoryAssociationResponse, AWSError>;
  /**
   *  Returns a  RepositoryAssociation  object that contains information about the requested repository association. 
   */
  describeRepositoryAssociation(callback?: (err: AWSError, data: CodeGuruReviewer.Types.DescribeRepositoryAssociationResponse) => void): Request<CodeGuruReviewer.Types.DescribeRepositoryAssociationResponse, AWSError>;
  /**
   * Removes the association between Amazon CodeGuru Reviewer and a repository.
   */
  disassociateRepository(params: CodeGuruReviewer.Types.DisassociateRepositoryRequest, callback?: (err: AWSError, data: CodeGuruReviewer.Types.DisassociateRepositoryResponse) => void): Request<CodeGuruReviewer.Types.DisassociateRepositoryResponse, AWSError>;
  /**
   * Removes the association between Amazon CodeGuru Reviewer and a repository.
   */
  disassociateRepository(callback?: (err: AWSError, data: CodeGuruReviewer.Types.DisassociateRepositoryResponse) => void): Request<CodeGuruReviewer.Types.DisassociateRepositoryResponse, AWSError>;
  /**
   *  Lists all the code reviews that the customer has created in the past 90 days. 
   */
  listCodeReviews(params: CodeGuruReviewer.Types.ListCodeReviewsRequest, callback?: (err: AWSError, data: CodeGuruReviewer.Types.ListCodeReviewsResponse) => void): Request<CodeGuruReviewer.Types.ListCodeReviewsResponse, AWSError>;
  /**
   *  Lists all the code reviews that the customer has created in the past 90 days. 
   */
  listCodeReviews(callback?: (err: AWSError, data: CodeGuruReviewer.Types.ListCodeReviewsResponse) => void): Request<CodeGuruReviewer.Types.ListCodeReviewsResponse, AWSError>;
  /**
   *  Returns a list of  RecommendationFeedbackSummary  objects that contain customer recommendation feedback for all CodeGuru Reviewer users. 
   */
  listRecommendationFeedback(params: CodeGuruReviewer.Types.ListRecommendationFeedbackRequest, callback?: (err: AWSError, data: CodeGuruReviewer.Types.ListRecommendationFeedbackResponse) => void): Request<CodeGuruReviewer.Types.ListRecommendationFeedbackResponse, AWSError>;
  /**
   *  Returns a list of  RecommendationFeedbackSummary  objects that contain customer recommendation feedback for all CodeGuru Reviewer users. 
   */
  listRecommendationFeedback(callback?: (err: AWSError, data: CodeGuruReviewer.Types.ListRecommendationFeedbackResponse) => void): Request<CodeGuruReviewer.Types.ListRecommendationFeedbackResponse, AWSError>;
  /**
   *  Returns the list of all recommendations for a completed code review. 
   */
  listRecommendations(params: CodeGuruReviewer.Types.ListRecommendationsRequest, callback?: (err: AWSError, data: CodeGuruReviewer.Types.ListRecommendationsResponse) => void): Request<CodeGuruReviewer.Types.ListRecommendationsResponse, AWSError>;
  /**
   *  Returns the list of all recommendations for a completed code review. 
   */
  listRecommendations(callback?: (err: AWSError, data: CodeGuruReviewer.Types.ListRecommendationsResponse) => void): Request<CodeGuruReviewer.Types.ListRecommendationsResponse, AWSError>;
  /**
   *  Returns a list of  RepositoryAssociationSummary  objects that contain summary information about a repository association. You can filter the returned list by  ProviderType ,  Name ,  State , and  Owner . 
   */
  listRepositoryAssociations(params: CodeGuruReviewer.Types.ListRepositoryAssociationsRequest, callback?: (err: AWSError, data: CodeGuruReviewer.Types.ListRepositoryAssociationsResponse) => void): Request<CodeGuruReviewer.Types.ListRepositoryAssociationsResponse, AWSError>;
  /**
   *  Returns a list of  RepositoryAssociationSummary  objects that contain summary information about a repository association. You can filter the returned list by  ProviderType ,  Name ,  State , and  Owner . 
   */
  listRepositoryAssociations(callback?: (err: AWSError, data: CodeGuruReviewer.Types.ListRepositoryAssociationsResponse) => void): Request<CodeGuruReviewer.Types.ListRepositoryAssociationsResponse, AWSError>;
  /**
   * Returns the list of tags associated with an associated repository resource.
   */
  listTagsForResource(params: CodeGuruReviewer.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: CodeGuruReviewer.Types.ListTagsForResourceResponse) => void): Request<CodeGuruReviewer.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns the list of tags associated with an associated repository resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: CodeGuruReviewer.Types.ListTagsForResourceResponse) => void): Request<CodeGuruReviewer.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Stores customer feedback for a CodeGuru Reviewer recommendation. When this API is called again with different reactions the previous feedback is overwritten. 
   */
  putRecommendationFeedback(params: CodeGuruReviewer.Types.PutRecommendationFeedbackRequest, callback?: (err: AWSError, data: CodeGuruReviewer.Types.PutRecommendationFeedbackResponse) => void): Request<CodeGuruReviewer.Types.PutRecommendationFeedbackResponse, AWSError>;
  /**
   *  Stores customer feedback for a CodeGuru Reviewer recommendation. When this API is called again with different reactions the previous feedback is overwritten. 
   */
  putRecommendationFeedback(callback?: (err: AWSError, data: CodeGuruReviewer.Types.PutRecommendationFeedbackResponse) => void): Request<CodeGuruReviewer.Types.PutRecommendationFeedbackResponse, AWSError>;
  /**
   * Adds one or more tags to an associated repository.
   */
  tagResource(params: CodeGuruReviewer.Types.TagResourceRequest, callback?: (err: AWSError, data: CodeGuruReviewer.Types.TagResourceResponse) => void): Request<CodeGuruReviewer.Types.TagResourceResponse, AWSError>;
  /**
   * Adds one or more tags to an associated repository.
   */
  tagResource(callback?: (err: AWSError, data: CodeGuruReviewer.Types.TagResourceResponse) => void): Request<CodeGuruReviewer.Types.TagResourceResponse, AWSError>;
  /**
   * Removes a tag from an associated repository.
   */
  untagResource(params: CodeGuruReviewer.Types.UntagResourceRequest, callback?: (err: AWSError, data: CodeGuruReviewer.Types.UntagResourceResponse) => void): Request<CodeGuruReviewer.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes a tag from an associated repository.
   */
  untagResource(callback?: (err: AWSError, data: CodeGuruReviewer.Types.UntagResourceResponse) => void): Request<CodeGuruReviewer.Types.UntagResourceResponse, AWSError>;
  /**
   * Waits for the repositoryAssociationSucceeded state by periodically calling the underlying CodeGuruReviewer.describeRepositoryAssociationoperation every 10 seconds (at most 20 times). Wait until a repository association is complete.
   */
  waitFor(state: "repositoryAssociationSucceeded", params: CodeGuruReviewer.Types.DescribeRepositoryAssociationRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: CodeGuruReviewer.Types.DescribeRepositoryAssociationResponse) => void): Request<CodeGuruReviewer.Types.DescribeRepositoryAssociationResponse, AWSError>;
  /**
   * Waits for the repositoryAssociationSucceeded state by periodically calling the underlying CodeGuruReviewer.describeRepositoryAssociationoperation every 10 seconds (at most 20 times). Wait until a repository association is complete.
   */
  waitFor(state: "repositoryAssociationSucceeded", callback?: (err: AWSError, data: CodeGuruReviewer.Types.DescribeRepositoryAssociationResponse) => void): Request<CodeGuruReviewer.Types.DescribeRepositoryAssociationResponse, AWSError>;
  /**
   * Waits for the codeReviewCompleted state by periodically calling the underlying CodeGuruReviewer.describeCodeReviewoperation every 10 seconds (at most 60 times). Wait until a code review is complete.
   */
  waitFor(state: "codeReviewCompleted", params: CodeGuruReviewer.Types.DescribeCodeReviewRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: CodeGuruReviewer.Types.DescribeCodeReviewResponse) => void): Request<CodeGuruReviewer.Types.DescribeCodeReviewResponse, AWSError>;
  /**
   * Waits for the codeReviewCompleted state by periodically calling the underlying CodeGuruReviewer.describeCodeReviewoperation every 10 seconds (at most 60 times). Wait until a code review is complete.
   */
  waitFor(state: "codeReviewCompleted", callback?: (err: AWSError, data: CodeGuruReviewer.Types.DescribeCodeReviewResponse) => void): Request<CodeGuruReviewer.Types.DescribeCodeReviewResponse, AWSError>;
}
declare namespace CodeGuruReviewer {
  export type AnalysisType = "Security"|"CodeQuality"|string;
  export type AnalysisTypes = AnalysisType[];
  export type Arn = string;
  export interface AssociateRepositoryRequest {
    /**
     * The repository to associate.
     */
    Repository: Repository;
    /**
     * Amazon CodeGuru Reviewer uses this value to prevent the accidental creation of duplicate repository associations if there are failures and retries. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     *  An array of key-value pairs used to tag an associated repository. A tag is a custom attribute label with two parts:    A tag key (for example, CostCenter, Environment, Project, or Secret). Tag keys are case sensitive.   An optional field known as a tag value (for example, 111122223333, Production, or a team name). Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case sensitive.  
     */
    Tags?: TagMap;
    /**
     * A KMSKeyDetails object that contains:   The encryption option for this repository association. It is either owned by Amazon Web Services Key Management Service (KMS) (AWS_OWNED_CMK) or customer managed (CUSTOMER_MANAGED_CMK).   The ID of the Amazon Web Services KMS key that is associated with this respository association.  
     */
    KMSKeyDetails?: KMSKeyDetails;
  }
  export interface AssociateRepositoryResponse {
    /**
     * Information about the repository association.
     */
    RepositoryAssociation?: RepositoryAssociation;
    /**
     *  An array of key-value pairs used to tag an associated repository. A tag is a custom attribute label with two parts:    A tag key (for example, CostCenter, Environment, Project, or Secret). Tag keys are case sensitive.   An optional field known as a tag value (for example, 111122223333, Production, or a team name). Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case sensitive.  
     */
    Tags?: TagMap;
  }
  export type AssociationArn = string;
  export type AssociationId = string;
  export interface BranchDiffSourceCodeType {
    /**
     * The source branch for a diff in an associated repository.
     */
    SourceBranchName: BranchName;
    /**
     * The destination branch for a diff in an associated repository.
     */
    DestinationBranchName: BranchName;
  }
  export type BranchName = string;
  export type BuildArtifactsObjectKey = string;
  export type ClientRequestToken = string;
  export interface CodeArtifacts {
    /**
     * The S3 object key for a source code .zip file. This is required for all code reviews.
     */
    SourceCodeArtifactsObjectKey: SourceCodeArtifactsObjectKey;
    /**
     * The S3 object key for a build artifacts .zip file that contains .jar or .class files. This is required for a code review with security analysis. For more information, see Create code reviews with security analysis in the Amazon CodeGuru Reviewer User Guide.
     */
    BuildArtifactsObjectKey?: BuildArtifactsObjectKey;
  }
  export interface CodeCommitRepository {
    /**
     * The name of the Amazon Web Services CodeCommit repository. For more information, see repositoryName in the Amazon Web Services CodeCommit API Reference.
     */
    Name: Name;
  }
  export interface CodeReview {
    /**
     *  The name of the code review. 
     */
    Name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the  CodeReview  object. 
     */
    CodeReviewArn?: Arn;
    /**
     *  The name of the repository. 
     */
    RepositoryName?: Name;
    /**
     * The owner of the repository. For an Amazon Web Services CodeCommit repository, this is the Amazon Web Services account ID of the account that owns the repository. For a GitHub, GitHub Enterprise Server, or Bitbucket repository, this is the username for the account that owns the repository. For an S3 repository, it can be the username or Amazon Web Services account ID.
     */
    Owner?: Owner;
    /**
     *  The type of repository that contains the reviewed code (for example, GitHub or Bitbucket). 
     */
    ProviderType?: ProviderType;
    /**
     * The valid code review states are:    Completed: The code review is complete.     Pending: The code review started and has not completed or failed.     Failed: The code review failed.     Deleting: The code review is being deleted.   
     */
    State?: JobState;
    /**
     *  The reason for the state of the code review. 
     */
    StateReason?: StateReason;
    /**
     *  The time, in milliseconds since the epoch, when the code review was created. 
     */
    CreatedTimeStamp?: TimeStamp;
    /**
     *  The time, in milliseconds since the epoch, when the code review was last updated. 
     */
    LastUpdatedTimeStamp?: TimeStamp;
    /**
     *  The type of code review. 
     */
    Type?: Type;
    /**
     *  The pull request ID for the code review. 
     */
    PullRequestId?: PullRequestId;
    /**
     *  The type of the source code for the code review. 
     */
    SourceCodeType?: SourceCodeType;
    /**
     *  The Amazon Resource Name (ARN) of the  RepositoryAssociation  that contains the reviewed source code. You can retrieve associated repository ARNs by calling  ListRepositoryAssociations . 
     */
    AssociationArn?: AssociationArn;
    /**
     *  The statistics from the code review. 
     */
    Metrics?: Metrics;
    /**
     * They types of analysis performed during a repository analysis or a pull request review. You can specify either Security, CodeQuality, or both.
     */
    AnalysisTypes?: AnalysisTypes;
  }
  export type CodeReviewName = string;
  export type CodeReviewSummaries = CodeReviewSummary[];
  export interface CodeReviewSummary {
    /**
     *  The name of the code review. 
     */
    Name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the  CodeReview  object. 
     */
    CodeReviewArn?: Arn;
    /**
     *  The name of the repository. 
     */
    RepositoryName?: Name;
    /**
     * The owner of the repository. For an Amazon Web Services CodeCommit repository, this is the Amazon Web Services account ID of the account that owns the repository. For a GitHub, GitHub Enterprise Server, or Bitbucket repository, this is the username for the account that owns the repository. For an S3 repository, it can be the username or Amazon Web Services account ID.
     */
    Owner?: Owner;
    /**
     *  The provider type of the repository association. 
     */
    ProviderType?: ProviderType;
    /**
     *  The state of the code review.  The valid code review states are:    Completed: The code review is complete.     Pending: The code review started and has not completed or failed.     Failed: The code review failed.     Deleting: The code review is being deleted.   
     */
    State?: JobState;
    /**
     *  The time, in milliseconds since the epoch, when the code review was created. 
     */
    CreatedTimeStamp?: TimeStamp;
    /**
     *  The time, in milliseconds since the epoch, when the code review was last updated. 
     */
    LastUpdatedTimeStamp?: TimeStamp;
    /**
     *  The type of the code review. 
     */
    Type?: Type;
    /**
     *  The pull request ID for the code review. 
     */
    PullRequestId?: PullRequestId;
    /**
     *  The statistics from the code review. 
     */
    MetricsSummary?: MetricsSummary;
    SourceCodeType?: SourceCodeType;
  }
  export interface CodeReviewType {
    /**
     *  A code review that analyzes all code under a specified branch in an associated repository. The associated repository is specified using its ARN in  CreateCodeReview . 
     */
    RepositoryAnalysis: RepositoryAnalysis;
    /**
     * They types of analysis performed during a repository analysis or a pull request review. You can specify either Security, CodeQuality, or both.
     */
    AnalysisTypes?: AnalysisTypes;
  }
  export interface CommitDiffSourceCodeType {
    /**
     *  The SHA of the source commit used to generate a commit diff. This field is required for a pull request code review. 
     */
    SourceCommit?: CommitId;
    /**
     *  The SHA of the destination commit used to generate a commit diff. This field is required for a pull request code review. 
     */
    DestinationCommit?: CommitId;
    /**
     * The SHA of the merge base of a commit.
     */
    MergeBaseCommit?: CommitId;
  }
  export type CommitId = string;
  export type ConnectionArn = string;
  export interface CreateCodeReviewRequest {
    /**
     *  The name of the code review. The name of each code review in your Amazon Web Services account must be unique. 
     */
    Name: CodeReviewName;
    /**
     *  The Amazon Resource Name (ARN) of the  RepositoryAssociation  object. You can retrieve this ARN by calling  ListRepositoryAssociations .   A code review can only be created on an associated repository. This is the ARN of the associated repository. 
     */
    RepositoryAssociationArn: AssociationArn;
    /**
     *  The type of code review to create. This is specified using a  CodeReviewType  object. You can create a code review only of type RepositoryAnalysis. 
     */
    Type: CodeReviewType;
    /**
     *  Amazon CodeGuru Reviewer uses this value to prevent the accidental creation of duplicate code reviews if there are failures and retries. 
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface CreateCodeReviewResponse {
    CodeReview?: CodeReview;
  }
  export interface DescribeCodeReviewRequest {
    /**
     * The Amazon Resource Name (ARN) of the  CodeReview  object. 
     */
    CodeReviewArn: Arn;
  }
  export interface DescribeCodeReviewResponse {
    /**
     *  Information about the code review. 
     */
    CodeReview?: CodeReview;
  }
  export interface DescribeRecommendationFeedbackRequest {
    /**
     * The Amazon Resource Name (ARN) of the  CodeReview  object. 
     */
    CodeReviewArn: Arn;
    /**
     *  The recommendation ID that can be used to track the provided recommendations and then to collect the feedback. 
     */
    RecommendationId: RecommendationId;
    /**
     *  Optional parameter to describe the feedback for a given user. If this is not supplied, it defaults to the user making the request.   The UserId is an IAM principal that can be specified as an Amazon Web Services account ID or an Amazon Resource Name (ARN). For more information, see  Specifying a Principal in the Amazon Web Services Identity and Access Management User Guide. 
     */
    UserId?: UserId;
  }
  export interface DescribeRecommendationFeedbackResponse {
    /**
     *  The recommendation feedback given by the user. 
     */
    RecommendationFeedback?: RecommendationFeedback;
  }
  export interface DescribeRepositoryAssociationRequest {
    /**
     *  The Amazon Resource Name (ARN) of the  RepositoryAssociation  object. You can retrieve this ARN by calling  ListRepositoryAssociations . 
     */
    AssociationArn: AssociationArn;
  }
  export interface DescribeRepositoryAssociationResponse {
    /**
     * Information about the repository association.
     */
    RepositoryAssociation?: RepositoryAssociation;
    /**
     *  An array of key-value pairs used to tag an associated repository. A tag is a custom attribute label with two parts:    A tag key (for example, CostCenter, Environment, Project, or Secret). Tag keys are case sensitive.   An optional field known as a tag value (for example, 111122223333, Production, or a team name). Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case sensitive.  
     */
    Tags?: TagMap;
  }
  export interface DisassociateRepositoryRequest {
    /**
     *  The Amazon Resource Name (ARN) of the  RepositoryAssociation  object. You can retrieve this ARN by calling  ListRepositoryAssociations . 
     */
    AssociationArn: AssociationArn;
  }
  export interface DisassociateRepositoryResponse {
    /**
     * Information about the disassociated repository.
     */
    RepositoryAssociation?: RepositoryAssociation;
    /**
     *  An array of key-value pairs used to tag an associated repository. A tag is a custom attribute label with two parts:    A tag key (for example, CostCenter, Environment, Project, or Secret). Tag keys are case sensitive.   An optional field known as a tag value (for example, 111122223333, Production, or a team name). Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case sensitive.  
     */
    Tags?: TagMap;
  }
  export type EncryptionOption = "AWS_OWNED_CMK"|"CUSTOMER_MANAGED_CMK"|string;
  export interface EventInfo {
    /**
     * The name of the event. The possible names are pull_request, workflow_dispatch, schedule, and push 
     */
    Name?: EventName;
    /**
     * The state of an event. The state might be open, closed, or another state.
     */
    State?: EventState;
  }
  export type EventName = string;
  export type EventState = string;
  export type FilePath = string;
  export type FindingsCount = number;
  export type JobState = "Completed"|"Pending"|"Failed"|"Deleting"|string;
  export type JobStates = JobState[];
  export interface KMSKeyDetails {
    /**
     * The ID of the Amazon Web Services KMS key that is associated with a respository association.
     */
    KMSKeyId?: KMSKeyId;
    /**
     * The encryption option for a repository association. It is either owned by Amazon Web Services Key Management Service (KMS) (AWS_OWNED_CMK) or customer managed (CUSTOMER_MANAGED_CMK).
     */
    EncryptionOption?: EncryptionOption;
  }
  export type KMSKeyId = string;
  export type LineNumber = number;
  export type ListCodeReviewsMaxResults = number;
  export interface ListCodeReviewsRequest {
    /**
     *  List of provider types for filtering that needs to be applied before displaying the result. For example, providerTypes=[GitHub] lists code reviews from GitHub. 
     */
    ProviderTypes?: ProviderTypes;
    /**
     *  List of states for filtering that needs to be applied before displaying the result. For example, states=[Pending] lists code reviews in the Pending state.  The valid code review states are:    Completed: The code review is complete.     Pending: The code review started and has not completed or failed.     Failed: The code review failed.     Deleting: The code review is being deleted.   
     */
    States?: JobStates;
    /**
     *  List of repository names for filtering that needs to be applied before displaying the result. 
     */
    RepositoryNames?: RepositoryNames;
    /**
     *  The type of code reviews to list in the response. 
     */
    Type: Type;
    /**
     *  The maximum number of results that are returned per call. The default is 100. 
     */
    MaxResults?: ListCodeReviewsMaxResults;
    /**
     *  If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: NextToken;
  }
  export interface ListCodeReviewsResponse {
    /**
     *  A list of code reviews that meet the criteria of the request. 
     */
    CodeReviewSummaries?: CodeReviewSummaries;
    /**
     *  Pagination token. 
     */
    NextToken?: NextToken;
  }
  export interface ListRecommendationFeedbackRequest {
    /**
     *  If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: NextToken;
    /**
     *  The maximum number of results that are returned per call. The default is 100. 
     */
    MaxResults?: MaxResults;
    /**
     * The Amazon Resource Name (ARN) of the  CodeReview  object. 
     */
    CodeReviewArn: Arn;
    /**
     *  An Amazon Web Services user's account ID or Amazon Resource Name (ARN). Use this ID to query the recommendation feedback for a code review from that user.   The UserId is an IAM principal that can be specified as an Amazon Web Services account ID or an Amazon Resource Name (ARN). For more information, see  Specifying a Principal in the Amazon Web Services Identity and Access Management User Guide. 
     */
    UserIds?: UserIds;
    /**
     *  Used to query the recommendation feedback for a given recommendation. 
     */
    RecommendationIds?: RecommendationIds;
  }
  export interface ListRecommendationFeedbackResponse {
    /**
     *  Recommendation feedback summaries corresponding to the code review ARN. 
     */
    RecommendationFeedbackSummaries?: RecommendationFeedbackSummaries;
    /**
     *  If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: NextToken;
  }
  export interface ListRecommendationsRequest {
    /**
     *  Pagination token. 
     */
    NextToken?: NextToken;
    /**
     *  The maximum number of results that are returned per call. The default is 100. 
     */
    MaxResults?: MaxResults;
    /**
     * The Amazon Resource Name (ARN) of the  CodeReview  object. 
     */
    CodeReviewArn: Arn;
  }
  export interface ListRecommendationsResponse {
    /**
     *  List of recommendations for the requested code review. 
     */
    RecommendationSummaries?: RecommendationSummaries;
    /**
     *  Pagination token. 
     */
    NextToken?: NextToken;
  }
  export interface ListRepositoryAssociationsRequest {
    /**
     * List of provider types to use as a filter.
     */
    ProviderTypes?: ProviderTypes;
    /**
     * List of repository association states to use as a filter. The valid repository association states are:    Associated: The repository association is complete.     Associating: CodeGuru Reviewer is:     Setting up pull request notifications. This is required for pull requests to trigger a CodeGuru Reviewer review.    If your repository ProviderType is GitHub, GitHub Enterprise Server, or Bitbucket, CodeGuru Reviewer creates webhooks in your repository to trigger CodeGuru Reviewer reviews. If you delete these webhooks, reviews of code in your repository cannot be triggered.      Setting up source code access. This is required for CodeGuru Reviewer to securely clone code in your repository.       Failed: The repository failed to associate or disassociate.     Disassociating: CodeGuru Reviewer is removing the repository's pull request notifications and source code access.     Disassociated: CodeGuru Reviewer successfully disassociated the repository. You can create a new association with this repository if you want to review source code in it later. You can control access to code reviews created in an associated repository with tags after it has been disassociated. For more information, see Using tags to control access to associated repositories in the Amazon CodeGuru Reviewer User Guide.   
     */
    States?: RepositoryAssociationStates;
    /**
     * List of repository names to use as a filter.
     */
    Names?: Names;
    /**
     * List of owners to use as a filter. For Amazon Web Services CodeCommit, it is the name of the CodeCommit account that was used to associate the repository. For other repository source providers, such as Bitbucket and GitHub Enterprise Server, this is name of the account that was used to associate the repository. 
     */
    Owners?: Owners;
    /**
     * The maximum number of repository association results returned by ListRepositoryAssociations in paginated output. When this parameter is used, ListRepositoryAssociations only returns maxResults results in a single page with a nextToken response element. The remaining results of the initial request can be seen by sending another ListRepositoryAssociations request with the returned nextToken value. This value can be between 1 and 100. If this parameter is not used, ListRepositoryAssociations returns up to 100 results and a nextToken value if applicable. 
     */
    MaxResults?: MaxResults;
    /**
     * The nextToken value returned from a previous paginated ListRepositoryAssociations request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value.   Treat this token as an opaque identifier that is only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    NextToken?: NextToken;
  }
  export interface ListRepositoryAssociationsResponse {
    /**
     * A list of repository associations that meet the criteria of the request.
     */
    RepositoryAssociationSummaries?: RepositoryAssociationSummaries;
    /**
     * The nextToken value to include in a future ListRecommendations request. When the results of a ListRecommendations request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the  RepositoryAssociation  object. You can retrieve this ARN by calling  ListRepositoryAssociations . 
     */
    resourceArn: AssociationArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     *  An array of key-value pairs used to tag an associated repository. A tag is a custom attribute label with two parts:    A tag key (for example, CostCenter, Environment, Project, or Secret). Tag keys are case sensitive.   An optional field known as a tag value (for example, 111122223333, Production, or a team name). Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case sensitive.  
     */
    Tags?: TagMap;
  }
  export type LongDescription = string;
  export type MaxResults = number;
  export type MeteredLinesOfCodeCount = number;
  export interface Metrics {
    /**
     *  MeteredLinesOfCode is the number of lines of code in the repository where the code review happened. This does not include non-code lines such as comments and blank lines. 
     */
    MeteredLinesOfCodeCount?: MeteredLinesOfCodeCount;
    /**
     *  Total number of recommendations found in the code review. 
     */
    FindingsCount?: FindingsCount;
  }
  export interface MetricsSummary {
    /**
     *  Lines of code metered in the code review. For the initial code review pull request and all subsequent revisions, this includes all lines of code in the files added to the pull request. In subsequent revisions, for files that already existed in the pull request, this includes only the changed lines of code. In both cases, this does not include non-code lines such as comments and import statements. For example, if you submit a pull request containing 5 files, each with 500 lines of code, and in a subsequent revision you added a new file with 200 lines of code, and also modified a total of 25 lines across the initial 5 files, MeteredLinesOfCodeCount includes the first 5 files (5 * 500 = 2,500 lines), the new file (200 lines) and the 25 changed lines of code for a total of 2,725 lines of code. 
     */
    MeteredLinesOfCodeCount?: MeteredLinesOfCodeCount;
    /**
     *  Total number of recommendations found in the code review. 
     */
    FindingsCount?: FindingsCount;
  }
  export type Name = string;
  export type Names = Name[];
  export type NextToken = string;
  export type Owner = string;
  export type Owners = Owner[];
  export type ProviderType = "CodeCommit"|"GitHub"|"Bitbucket"|"GitHubEnterpriseServer"|"S3Bucket"|string;
  export type ProviderTypes = ProviderType[];
  export type PullRequestId = string;
  export interface PutRecommendationFeedbackRequest {
    /**
     * The Amazon Resource Name (ARN) of the  CodeReview  object. 
     */
    CodeReviewArn: Arn;
    /**
     *  The recommendation ID that can be used to track the provided recommendations and then to collect the feedback. 
     */
    RecommendationId: RecommendationId;
    /**
     *  List for storing reactions. Reactions are utf-8 text code for emojis. If you send an empty list it clears all your feedback. 
     */
    Reactions: Reactions;
  }
  export interface PutRecommendationFeedbackResponse {
  }
  export type Reaction = "ThumbsUp"|"ThumbsDown"|string;
  export type Reactions = Reaction[];
  export type RecommendationCategory = "AWSBestPractices"|"AWSCloudFormationIssues"|"DuplicateCode"|"CodeMaintenanceIssues"|"ConcurrencyIssues"|"InputValidations"|"PythonBestPractices"|"JavaBestPractices"|"ResourceLeaks"|"SecurityIssues"|"CodeInconsistencies"|string;
  export interface RecommendationFeedback {
    /**
     * The Amazon Resource Name (ARN) of the  CodeReview  object. 
     */
    CodeReviewArn?: Arn;
    /**
     *  The recommendation ID that can be used to track the provided recommendations. Later on it can be used to collect the feedback. 
     */
    RecommendationId?: RecommendationId;
    /**
     *  List for storing reactions. Reactions are utf-8 text code for emojis. You can send an empty list to clear off all your feedback. 
     */
    Reactions?: Reactions;
    /**
     *  The ID of the user that made the API call.   The UserId is an IAM principal that can be specified as an Amazon Web Services account ID or an Amazon Resource Name (ARN). For more information, see  Specifying a Principal in the Amazon Web Services Identity and Access Management User Guide. 
     */
    UserId?: UserId;
    /**
     *  The time at which the feedback was created. 
     */
    CreatedTimeStamp?: TimeStamp;
    /**
     *  The time at which the feedback was last updated. 
     */
    LastUpdatedTimeStamp?: TimeStamp;
  }
  export type RecommendationFeedbackSummaries = RecommendationFeedbackSummary[];
  export interface RecommendationFeedbackSummary {
    /**
     *  The recommendation ID that can be used to track the provided recommendations. Later on it can be used to collect the feedback. 
     */
    RecommendationId?: RecommendationId;
    /**
     *  List for storing reactions. Reactions are utf-8 text code for emojis. 
     */
    Reactions?: Reactions;
    /**
     *  The ID of the user that gave the feedback.   The UserId is an IAM principal that can be specified as an Amazon Web Services account ID or an Amazon Resource Name (ARN). For more information, see  Specifying a Principal in the Amazon Web Services Identity and Access Management User Guide. 
     */
    UserId?: UserId;
  }
  export type RecommendationId = string;
  export type RecommendationIds = RecommendationId[];
  export type RecommendationSummaries = RecommendationSummary[];
  export interface RecommendationSummary {
    /**
     * Name of the file on which a recommendation is provided.
     */
    FilePath?: FilePath;
    /**
     *  The recommendation ID that can be used to track the provided recommendations. Later on it can be used to collect the feedback. 
     */
    RecommendationId?: RecommendationId;
    /**
     *  Start line from where the recommendation is applicable in the source commit or source branch. 
     */
    StartLine?: LineNumber;
    /**
     *  Last line where the recommendation is applicable in the source commit or source branch. For a single line comment the start line and end line values are the same. 
     */
    EndLine?: LineNumber;
    /**
     *  A description of the recommendation generated by CodeGuru Reviewer for the lines of code between the start line and the end line. 
     */
    Description?: Text;
    /**
     * The type of a recommendation.
     */
    RecommendationCategory?: RecommendationCategory;
    /**
     * Metadata about a rule. Rule metadata includes an ID, a name, a list of tags, and a short and long description. CodeGuru Reviewer uses rules to analyze code. A rule's recommendation is included in analysis results if code is detected that violates the rule.
     */
    RuleMetadata?: RuleMetadata;
    /**
     * The severity of the issue in the code that generated this recommendation.
     */
    Severity?: Severity;
  }
  export interface Repository {
    /**
     * Information about an Amazon Web Services CodeCommit repository.
     */
    CodeCommit?: CodeCommitRepository;
    /**
     *  Information about a Bitbucket repository. 
     */
    Bitbucket?: ThirdPartySourceRepository;
    /**
     *  Information about a GitHub Enterprise Server repository. 
     */
    GitHubEnterpriseServer?: ThirdPartySourceRepository;
    S3Bucket?: S3Repository;
  }
  export interface RepositoryAnalysis {
    /**
     *  A  SourceCodeType  that specifies the tip of a branch in an associated repository. 
     */
    RepositoryHead?: RepositoryHeadSourceCodeType;
    SourceCodeType?: SourceCodeType;
  }
  export interface RepositoryAssociation {
    /**
     * The ID of the repository association.
     */
    AssociationId?: AssociationId;
    /**
     * The Amazon Resource Name (ARN) identifying the repository association.
     */
    AssociationArn?: Arn;
    /**
     *  The Amazon Resource Name (ARN) of an Amazon Web Services CodeStar Connections connection. Its format is arn:aws:codestar-connections:region-id:aws-account_id:connection/connection-id. For more information, see  Connection  in the Amazon Web Services CodeStar Connections API Reference. 
     */
    ConnectionArn?: ConnectionArn;
    /**
     * The name of the repository.
     */
    Name?: Name;
    /**
     * The owner of the repository. For an Amazon Web Services CodeCommit repository, this is the Amazon Web Services account ID of the account that owns the repository. For a GitHub, GitHub Enterprise Server, or Bitbucket repository, this is the username for the account that owns the repository. For an S3 repository, it can be the username or Amazon Web Services account ID.
     */
    Owner?: Owner;
    /**
     * The provider type of the repository association.
     */
    ProviderType?: ProviderType;
    /**
     * The state of the repository association. The valid repository association states are:    Associated: The repository association is complete.     Associating: CodeGuru Reviewer is:     Setting up pull request notifications. This is required for pull requests to trigger a CodeGuru Reviewer review.    If your repository ProviderType is GitHub, GitHub Enterprise Server, or Bitbucket, CodeGuru Reviewer creates webhooks in your repository to trigger CodeGuru Reviewer reviews. If you delete these webhooks, reviews of code in your repository cannot be triggered.      Setting up source code access. This is required for CodeGuru Reviewer to securely clone code in your repository.       Failed: The repository failed to associate or disassociate.     Disassociating: CodeGuru Reviewer is removing the repository's pull request notifications and source code access.     Disassociated: CodeGuru Reviewer successfully disassociated the repository. You can create a new association with this repository if you want to review source code in it later. You can control access to code reviews created in an associated repository with tags after it has been disassociated. For more information, see Using tags to control access to associated repositories in the Amazon CodeGuru Reviewer User Guide.   
     */
    State?: RepositoryAssociationState;
    /**
     * A description of why the repository association is in the current state.
     */
    StateReason?: StateReason;
    /**
     * The time, in milliseconds since the epoch, when the repository association was last updated.
     */
    LastUpdatedTimeStamp?: TimeStamp;
    /**
     * The time, in milliseconds since the epoch, when the repository association was created.
     */
    CreatedTimeStamp?: TimeStamp;
    /**
     * A KMSKeyDetails object that contains:   The encryption option for this repository association. It is either owned by Amazon Web Services Key Management Service (KMS) (AWS_OWNED_CMK) or customer managed (CUSTOMER_MANAGED_CMK).   The ID of the Amazon Web Services KMS key that is associated with this respository association.  
     */
    KMSKeyDetails?: KMSKeyDetails;
    S3RepositoryDetails?: S3RepositoryDetails;
  }
  export type RepositoryAssociationState = "Associated"|"Associating"|"Failed"|"Disassociating"|"Disassociated"|string;
  export type RepositoryAssociationStates = RepositoryAssociationState[];
  export type RepositoryAssociationSummaries = RepositoryAssociationSummary[];
  export interface RepositoryAssociationSummary {
    /**
     *  The Amazon Resource Name (ARN) of the  RepositoryAssociation  object. You can retrieve this ARN by calling  ListRepositoryAssociations . 
     */
    AssociationArn?: Arn;
    /**
     *  The Amazon Resource Name (ARN) of an Amazon Web Services CodeStar Connections connection. Its format is arn:aws:codestar-connections:region-id:aws-account_id:connection/connection-id. For more information, see  Connection  in the Amazon Web Services CodeStar Connections API Reference. 
     */
    ConnectionArn?: ConnectionArn;
    /**
     * The time, in milliseconds since the epoch, since the repository association was last updated. 
     */
    LastUpdatedTimeStamp?: TimeStamp;
    /**
     *  The repository association ID. 
     */
    AssociationId?: AssociationId;
    /**
     * The name of the repository association.
     */
    Name?: Name;
    /**
     * The owner of the repository. For an Amazon Web Services CodeCommit repository, this is the Amazon Web Services account ID of the account that owns the repository. For a GitHub, GitHub Enterprise Server, or Bitbucket repository, this is the username for the account that owns the repository. For an S3 repository, it can be the username or Amazon Web Services account ID.
     */
    Owner?: Owner;
    /**
     * The provider type of the repository association.
     */
    ProviderType?: ProviderType;
    /**
     * The state of the repository association. The valid repository association states are:    Associated: The repository association is complete.     Associating: CodeGuru Reviewer is:     Setting up pull request notifications. This is required for pull requests to trigger a CodeGuru Reviewer review.    If your repository ProviderType is GitHub, GitHub Enterprise Server, or Bitbucket, CodeGuru Reviewer creates webhooks in your repository to trigger CodeGuru Reviewer reviews. If you delete these webhooks, reviews of code in your repository cannot be triggered.      Setting up source code access. This is required for CodeGuru Reviewer to securely clone code in your repository.       Failed: The repository failed to associate or disassociate.     Disassociating: CodeGuru Reviewer is removing the repository's pull request notifications and source code access.     Disassociated: CodeGuru Reviewer successfully disassociated the repository. You can create a new association with this repository if you want to review source code in it later. You can control access to code reviews created in an associated repository with tags after it has been disassociated. For more information, see Using tags to control access to associated repositories in the Amazon CodeGuru Reviewer User Guide.   
     */
    State?: RepositoryAssociationState;
  }
  export interface RepositoryHeadSourceCodeType {
    /**
     *  The name of the branch in an associated repository. The RepositoryHeadSourceCodeType specifies the tip of this branch. 
     */
    BranchName: BranchName;
  }
  export type RepositoryNames = Name[];
  export type RequestId = string;
  export interface RequestMetadata {
    /**
     * The ID of the request. This is required for a pull request code review.
     */
    RequestId?: RequestId;
    /**
     * An identifier, such as a name or account ID, that is associated with the requester. The Requester is used to capture the author/actor name of the event request.
     */
    Requester?: Requester;
    /**
     * Information about the event associated with a code review.
     */
    EventInfo?: EventInfo;
    /**
     * The name of the repository vendor used to upload code to an S3 bucket for a CI/CD code review. For example, if code and artifacts are uploaded to an S3 bucket for a CI/CD code review by GitHub scripts from a GitHub repository, then the repository association's ProviderType is S3Bucket and the CI/CD repository vendor name is GitHub. For more information, see the definition for ProviderType in RepositoryAssociation. 
     */
    VendorName?: VendorName;
  }
  export type Requester = string;
  export type RuleId = string;
  export interface RuleMetadata {
    /**
     * The ID of the rule.
     */
    RuleId?: RuleId;
    /**
     * The name of the rule.
     */
    RuleName?: RuleName;
    /**
     * A short description of the rule.
     */
    ShortDescription?: ShortDescription;
    /**
     * A long description of the rule.
     */
    LongDescription?: LongDescription;
    /**
     * Tags that are associated with the rule.
     */
    RuleTags?: RuleTags;
  }
  export type RuleName = string;
  export type RuleTag = string;
  export type RuleTags = RuleTag[];
  export type S3BucketName = string;
  export interface S3BucketRepository {
    /**
     *  The name of the repository when the ProviderType is S3Bucket. 
     */
    Name: Name;
    /**
     *  An S3RepositoryDetails object that specifies the name of an S3 bucket and a CodeArtifacts object. The CodeArtifacts object includes the S3 object keys for a source code .zip file and for a build artifacts .zip file. 
     */
    Details?: S3RepositoryDetails;
  }
  export interface S3Repository {
    /**
     *  The name of the repository in the S3 bucket. 
     */
    Name: Name;
    /**
     * The name of the S3 bucket used for associating a new S3 repository. It must begin with codeguru-reviewer-. 
     */
    BucketName: S3BucketName;
  }
  export interface S3RepositoryDetails {
    /**
     * The name of the S3 bucket used for associating a new S3 repository. It must begin with codeguru-reviewer-. 
     */
    BucketName?: S3BucketName;
    /**
     *  A CodeArtifacts object. The CodeArtifacts object includes the S3 object key for a source code .zip file and for a build artifacts .zip file that contains .jar or .class files. 
     */
    CodeArtifacts?: CodeArtifacts;
  }
  export type Severity = "Info"|"Low"|"Medium"|"High"|"Critical"|string;
  export type ShortDescription = string;
  export type SourceCodeArtifactsObjectKey = string;
  export interface SourceCodeType {
    /**
     *  A  SourceCodeType  that specifies a commit diff created by a pull request on an associated repository. 
     */
    CommitDiff?: CommitDiffSourceCodeType;
    RepositoryHead?: RepositoryHeadSourceCodeType;
    /**
     *  A type of  SourceCodeType  that specifies a source branch name and a destination branch name in an associated repository. 
     */
    BranchDiff?: BranchDiffSourceCodeType;
    /**
     *  Information about an associated repository in an S3 bucket that includes its name and an S3RepositoryDetails object. The S3RepositoryDetails object includes the name of an S3 bucket, an S3 key for a source code .zip file, and an S3 key for a build artifacts .zip file. S3BucketRepository is required in  SourceCodeType  for S3BucketRepository based code reviews. 
     */
    S3BucketRepository?: S3BucketRepository;
    /**
     * Metadata that is associated with a code review. This applies to any type of code review supported by CodeGuru Reviewer. The RequestMetadaa field captures any event metadata. For example, it might capture metadata associated with an event trigger, such as a push or a pull request. 
     */
    RequestMetadata?: RequestMetadata;
  }
  export type StateReason = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the  RepositoryAssociation  object. You can retrieve this ARN by calling  ListRepositoryAssociations . 
     */
    resourceArn: AssociationArn;
    /**
     *  An array of key-value pairs used to tag an associated repository. A tag is a custom attribute label with two parts:    A tag key (for example, CostCenter, Environment, Project, or Secret). Tag keys are case sensitive.   An optional field known as a tag value (for example, 111122223333, Production, or a team name). Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case sensitive.  
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Text = string;
  export interface ThirdPartySourceRepository {
    /**
     *  The name of the third party source repository. 
     */
    Name: Name;
    /**
     *  The Amazon Resource Name (ARN) of an Amazon Web Services CodeStar Connections connection. Its format is arn:aws:codestar-connections:region-id:aws-account_id:connection/connection-id. For more information, see  Connection  in the Amazon Web Services CodeStar Connections API Reference. 
     */
    ConnectionArn: ConnectionArn;
    /**
     *  The owner of the repository. For a GitHub, GitHub Enterprise, or Bitbucket repository, this is the username for the account that owns the repository. For an S3 repository, this can be the username or Amazon Web Services account ID. 
     */
    Owner: Owner;
  }
  export type TimeStamp = Date;
  export type Type = "PullRequest"|"RepositoryAnalysis"|string;
  export interface UntagResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the  RepositoryAssociation  object. You can retrieve this ARN by calling  ListRepositoryAssociations . 
     */
    resourceArn: AssociationArn;
    /**
     * A list of the keys for each tag you want to remove from an associated repository.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export type UserId = string;
  export type UserIds = UserId[];
  export type VendorName = "GitHub"|"GitLab"|"NativeS3"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-09-19"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CodeGuruReviewer client.
   */
  export import Types = CodeGuruReviewer;
}
export = CodeGuruReviewer;
