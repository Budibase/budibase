import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CodeCommit extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CodeCommit.Types.ClientConfiguration)
  config: Config & CodeCommit.Types.ClientConfiguration;
  /**
   * Creates an association between an approval rule template and a specified repository. Then, the next time a pull request is created in the repository where the destination reference (if specified) matches the destination reference (branch) for the pull request, an approval rule that matches the template conditions is automatically created for that pull request. If no destination references are specified in the template, an approval rule that matches the template contents is created for all pull requests in that repository.
   */
  associateApprovalRuleTemplateWithRepository(params: CodeCommit.Types.AssociateApprovalRuleTemplateWithRepositoryInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates an association between an approval rule template and a specified repository. Then, the next time a pull request is created in the repository where the destination reference (if specified) matches the destination reference (branch) for the pull request, an approval rule that matches the template conditions is automatically created for that pull request. If no destination references are specified in the template, an approval rule that matches the template contents is created for all pull requests in that repository.
   */
  associateApprovalRuleTemplateWithRepository(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates an association between an approval rule template and one or more specified repositories. 
   */
  batchAssociateApprovalRuleTemplateWithRepositories(params: CodeCommit.Types.BatchAssociateApprovalRuleTemplateWithRepositoriesInput, callback?: (err: AWSError, data: CodeCommit.Types.BatchAssociateApprovalRuleTemplateWithRepositoriesOutput) => void): Request<CodeCommit.Types.BatchAssociateApprovalRuleTemplateWithRepositoriesOutput, AWSError>;
  /**
   * Creates an association between an approval rule template and one or more specified repositories. 
   */
  batchAssociateApprovalRuleTemplateWithRepositories(callback?: (err: AWSError, data: CodeCommit.Types.BatchAssociateApprovalRuleTemplateWithRepositoriesOutput) => void): Request<CodeCommit.Types.BatchAssociateApprovalRuleTemplateWithRepositoriesOutput, AWSError>;
  /**
   * Returns information about one or more merge conflicts in the attempted merge of two commit specifiers using the squash or three-way merge strategy.
   */
  batchDescribeMergeConflicts(params: CodeCommit.Types.BatchDescribeMergeConflictsInput, callback?: (err: AWSError, data: CodeCommit.Types.BatchDescribeMergeConflictsOutput) => void): Request<CodeCommit.Types.BatchDescribeMergeConflictsOutput, AWSError>;
  /**
   * Returns information about one or more merge conflicts in the attempted merge of two commit specifiers using the squash or three-way merge strategy.
   */
  batchDescribeMergeConflicts(callback?: (err: AWSError, data: CodeCommit.Types.BatchDescribeMergeConflictsOutput) => void): Request<CodeCommit.Types.BatchDescribeMergeConflictsOutput, AWSError>;
  /**
   * Removes the association between an approval rule template and one or more specified repositories. 
   */
  batchDisassociateApprovalRuleTemplateFromRepositories(params: CodeCommit.Types.BatchDisassociateApprovalRuleTemplateFromRepositoriesInput, callback?: (err: AWSError, data: CodeCommit.Types.BatchDisassociateApprovalRuleTemplateFromRepositoriesOutput) => void): Request<CodeCommit.Types.BatchDisassociateApprovalRuleTemplateFromRepositoriesOutput, AWSError>;
  /**
   * Removes the association between an approval rule template and one or more specified repositories. 
   */
  batchDisassociateApprovalRuleTemplateFromRepositories(callback?: (err: AWSError, data: CodeCommit.Types.BatchDisassociateApprovalRuleTemplateFromRepositoriesOutput) => void): Request<CodeCommit.Types.BatchDisassociateApprovalRuleTemplateFromRepositoriesOutput, AWSError>;
  /**
   * Returns information about the contents of one or more commits in a repository.
   */
  batchGetCommits(params: CodeCommit.Types.BatchGetCommitsInput, callback?: (err: AWSError, data: CodeCommit.Types.BatchGetCommitsOutput) => void): Request<CodeCommit.Types.BatchGetCommitsOutput, AWSError>;
  /**
   * Returns information about the contents of one or more commits in a repository.
   */
  batchGetCommits(callback?: (err: AWSError, data: CodeCommit.Types.BatchGetCommitsOutput) => void): Request<CodeCommit.Types.BatchGetCommitsOutput, AWSError>;
  /**
   * Returns information about one or more repositories.  The description field for a repository accepts all HTML characters and all valid Unicode characters. Applications that do not HTML-encode the description and display it in a webpage can expose users to potentially malicious code. Make sure that you HTML-encode the description field in any application that uses this API to display the repository description on a webpage. 
   */
  batchGetRepositories(params: CodeCommit.Types.BatchGetRepositoriesInput, callback?: (err: AWSError, data: CodeCommit.Types.BatchGetRepositoriesOutput) => void): Request<CodeCommit.Types.BatchGetRepositoriesOutput, AWSError>;
  /**
   * Returns information about one or more repositories.  The description field for a repository accepts all HTML characters and all valid Unicode characters. Applications that do not HTML-encode the description and display it in a webpage can expose users to potentially malicious code. Make sure that you HTML-encode the description field in any application that uses this API to display the repository description on a webpage. 
   */
  batchGetRepositories(callback?: (err: AWSError, data: CodeCommit.Types.BatchGetRepositoriesOutput) => void): Request<CodeCommit.Types.BatchGetRepositoriesOutput, AWSError>;
  /**
   * Creates a template for approval rules that can then be associated with one or more repositories in your AWS account. When you associate a template with a repository, AWS CodeCommit creates an approval rule that matches the conditions of the template for all pull requests that meet the conditions of the template. For more information, see AssociateApprovalRuleTemplateWithRepository.
   */
  createApprovalRuleTemplate(params: CodeCommit.Types.CreateApprovalRuleTemplateInput, callback?: (err: AWSError, data: CodeCommit.Types.CreateApprovalRuleTemplateOutput) => void): Request<CodeCommit.Types.CreateApprovalRuleTemplateOutput, AWSError>;
  /**
   * Creates a template for approval rules that can then be associated with one or more repositories in your AWS account. When you associate a template with a repository, AWS CodeCommit creates an approval rule that matches the conditions of the template for all pull requests that meet the conditions of the template. For more information, see AssociateApprovalRuleTemplateWithRepository.
   */
  createApprovalRuleTemplate(callback?: (err: AWSError, data: CodeCommit.Types.CreateApprovalRuleTemplateOutput) => void): Request<CodeCommit.Types.CreateApprovalRuleTemplateOutput, AWSError>;
  /**
   * Creates a branch in a repository and points the branch to a commit.  Calling the create branch operation does not set a repository's default branch. To do this, call the update default branch operation. 
   */
  createBranch(params: CodeCommit.Types.CreateBranchInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a branch in a repository and points the branch to a commit.  Calling the create branch operation does not set a repository's default branch. To do this, call the update default branch operation. 
   */
  createBranch(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a commit for a repository on the tip of a specified branch.
   */
  createCommit(params: CodeCommit.Types.CreateCommitInput, callback?: (err: AWSError, data: CodeCommit.Types.CreateCommitOutput) => void): Request<CodeCommit.Types.CreateCommitOutput, AWSError>;
  /**
   * Creates a commit for a repository on the tip of a specified branch.
   */
  createCommit(callback?: (err: AWSError, data: CodeCommit.Types.CreateCommitOutput) => void): Request<CodeCommit.Types.CreateCommitOutput, AWSError>;
  /**
   * Creates a pull request in the specified repository.
   */
  createPullRequest(params: CodeCommit.Types.CreatePullRequestInput, callback?: (err: AWSError, data: CodeCommit.Types.CreatePullRequestOutput) => void): Request<CodeCommit.Types.CreatePullRequestOutput, AWSError>;
  /**
   * Creates a pull request in the specified repository.
   */
  createPullRequest(callback?: (err: AWSError, data: CodeCommit.Types.CreatePullRequestOutput) => void): Request<CodeCommit.Types.CreatePullRequestOutput, AWSError>;
  /**
   * Creates an approval rule for a pull request.
   */
  createPullRequestApprovalRule(params: CodeCommit.Types.CreatePullRequestApprovalRuleInput, callback?: (err: AWSError, data: CodeCommit.Types.CreatePullRequestApprovalRuleOutput) => void): Request<CodeCommit.Types.CreatePullRequestApprovalRuleOutput, AWSError>;
  /**
   * Creates an approval rule for a pull request.
   */
  createPullRequestApprovalRule(callback?: (err: AWSError, data: CodeCommit.Types.CreatePullRequestApprovalRuleOutput) => void): Request<CodeCommit.Types.CreatePullRequestApprovalRuleOutput, AWSError>;
  /**
   * Creates a new, empty repository.
   */
  createRepository(params: CodeCommit.Types.CreateRepositoryInput, callback?: (err: AWSError, data: CodeCommit.Types.CreateRepositoryOutput) => void): Request<CodeCommit.Types.CreateRepositoryOutput, AWSError>;
  /**
   * Creates a new, empty repository.
   */
  createRepository(callback?: (err: AWSError, data: CodeCommit.Types.CreateRepositoryOutput) => void): Request<CodeCommit.Types.CreateRepositoryOutput, AWSError>;
  /**
   * Creates an unreferenced commit that represents the result of merging two branches using a specified merge strategy. This can help you determine the outcome of a potential merge. This API cannot be used with the fast-forward merge strategy because that strategy does not create a merge commit.  This unreferenced merge commit can only be accessed using the GetCommit API or through git commands such as git fetch. To retrieve this commit, you must specify its commit ID or otherwise reference it. 
   */
  createUnreferencedMergeCommit(params: CodeCommit.Types.CreateUnreferencedMergeCommitInput, callback?: (err: AWSError, data: CodeCommit.Types.CreateUnreferencedMergeCommitOutput) => void): Request<CodeCommit.Types.CreateUnreferencedMergeCommitOutput, AWSError>;
  /**
   * Creates an unreferenced commit that represents the result of merging two branches using a specified merge strategy. This can help you determine the outcome of a potential merge. This API cannot be used with the fast-forward merge strategy because that strategy does not create a merge commit.  This unreferenced merge commit can only be accessed using the GetCommit API or through git commands such as git fetch. To retrieve this commit, you must specify its commit ID or otherwise reference it. 
   */
  createUnreferencedMergeCommit(callback?: (err: AWSError, data: CodeCommit.Types.CreateUnreferencedMergeCommitOutput) => void): Request<CodeCommit.Types.CreateUnreferencedMergeCommitOutput, AWSError>;
  /**
   * Deletes a specified approval rule template. Deleting a template does not remove approval rules on pull requests already created with the template.
   */
  deleteApprovalRuleTemplate(params: CodeCommit.Types.DeleteApprovalRuleTemplateInput, callback?: (err: AWSError, data: CodeCommit.Types.DeleteApprovalRuleTemplateOutput) => void): Request<CodeCommit.Types.DeleteApprovalRuleTemplateOutput, AWSError>;
  /**
   * Deletes a specified approval rule template. Deleting a template does not remove approval rules on pull requests already created with the template.
   */
  deleteApprovalRuleTemplate(callback?: (err: AWSError, data: CodeCommit.Types.DeleteApprovalRuleTemplateOutput) => void): Request<CodeCommit.Types.DeleteApprovalRuleTemplateOutput, AWSError>;
  /**
   * Deletes a branch from a repository, unless that branch is the default branch for the repository. 
   */
  deleteBranch(params: CodeCommit.Types.DeleteBranchInput, callback?: (err: AWSError, data: CodeCommit.Types.DeleteBranchOutput) => void): Request<CodeCommit.Types.DeleteBranchOutput, AWSError>;
  /**
   * Deletes a branch from a repository, unless that branch is the default branch for the repository. 
   */
  deleteBranch(callback?: (err: AWSError, data: CodeCommit.Types.DeleteBranchOutput) => void): Request<CodeCommit.Types.DeleteBranchOutput, AWSError>;
  /**
   * Deletes the content of a comment made on a change, file, or commit in a repository.
   */
  deleteCommentContent(params: CodeCommit.Types.DeleteCommentContentInput, callback?: (err: AWSError, data: CodeCommit.Types.DeleteCommentContentOutput) => void): Request<CodeCommit.Types.DeleteCommentContentOutput, AWSError>;
  /**
   * Deletes the content of a comment made on a change, file, or commit in a repository.
   */
  deleteCommentContent(callback?: (err: AWSError, data: CodeCommit.Types.DeleteCommentContentOutput) => void): Request<CodeCommit.Types.DeleteCommentContentOutput, AWSError>;
  /**
   * Deletes a specified file from a specified branch. A commit is created on the branch that contains the revision. The file still exists in the commits earlier to the commit that contains the deletion.
   */
  deleteFile(params: CodeCommit.Types.DeleteFileInput, callback?: (err: AWSError, data: CodeCommit.Types.DeleteFileOutput) => void): Request<CodeCommit.Types.DeleteFileOutput, AWSError>;
  /**
   * Deletes a specified file from a specified branch. A commit is created on the branch that contains the revision. The file still exists in the commits earlier to the commit that contains the deletion.
   */
  deleteFile(callback?: (err: AWSError, data: CodeCommit.Types.DeleteFileOutput) => void): Request<CodeCommit.Types.DeleteFileOutput, AWSError>;
  /**
   * Deletes an approval rule from a specified pull request. Approval rules can be deleted from a pull request only if the pull request is open, and if the approval rule was created specifically for a pull request and not generated from an approval rule template associated with the repository where the pull request was created. You cannot delete an approval rule from a merged or closed pull request.
   */
  deletePullRequestApprovalRule(params: CodeCommit.Types.DeletePullRequestApprovalRuleInput, callback?: (err: AWSError, data: CodeCommit.Types.DeletePullRequestApprovalRuleOutput) => void): Request<CodeCommit.Types.DeletePullRequestApprovalRuleOutput, AWSError>;
  /**
   * Deletes an approval rule from a specified pull request. Approval rules can be deleted from a pull request only if the pull request is open, and if the approval rule was created specifically for a pull request and not generated from an approval rule template associated with the repository where the pull request was created. You cannot delete an approval rule from a merged or closed pull request.
   */
  deletePullRequestApprovalRule(callback?: (err: AWSError, data: CodeCommit.Types.DeletePullRequestApprovalRuleOutput) => void): Request<CodeCommit.Types.DeletePullRequestApprovalRuleOutput, AWSError>;
  /**
   * Deletes a repository. If a specified repository was already deleted, a null repository ID is returned.  Deleting a repository also deletes all associated objects and metadata. After a repository is deleted, all future push calls to the deleted repository fail. 
   */
  deleteRepository(params: CodeCommit.Types.DeleteRepositoryInput, callback?: (err: AWSError, data: CodeCommit.Types.DeleteRepositoryOutput) => void): Request<CodeCommit.Types.DeleteRepositoryOutput, AWSError>;
  /**
   * Deletes a repository. If a specified repository was already deleted, a null repository ID is returned.  Deleting a repository also deletes all associated objects and metadata. After a repository is deleted, all future push calls to the deleted repository fail. 
   */
  deleteRepository(callback?: (err: AWSError, data: CodeCommit.Types.DeleteRepositoryOutput) => void): Request<CodeCommit.Types.DeleteRepositoryOutput, AWSError>;
  /**
   * Returns information about one or more merge conflicts in the attempted merge of two commit specifiers using the squash or three-way merge strategy. If the merge option for the attempted merge is specified as FAST_FORWARD_MERGE, an exception is thrown.
   */
  describeMergeConflicts(params: CodeCommit.Types.DescribeMergeConflictsInput, callback?: (err: AWSError, data: CodeCommit.Types.DescribeMergeConflictsOutput) => void): Request<CodeCommit.Types.DescribeMergeConflictsOutput, AWSError>;
  /**
   * Returns information about one or more merge conflicts in the attempted merge of two commit specifiers using the squash or three-way merge strategy. If the merge option for the attempted merge is specified as FAST_FORWARD_MERGE, an exception is thrown.
   */
  describeMergeConflicts(callback?: (err: AWSError, data: CodeCommit.Types.DescribeMergeConflictsOutput) => void): Request<CodeCommit.Types.DescribeMergeConflictsOutput, AWSError>;
  /**
   * Returns information about one or more pull request events.
   */
  describePullRequestEvents(params: CodeCommit.Types.DescribePullRequestEventsInput, callback?: (err: AWSError, data: CodeCommit.Types.DescribePullRequestEventsOutput) => void): Request<CodeCommit.Types.DescribePullRequestEventsOutput, AWSError>;
  /**
   * Returns information about one or more pull request events.
   */
  describePullRequestEvents(callback?: (err: AWSError, data: CodeCommit.Types.DescribePullRequestEventsOutput) => void): Request<CodeCommit.Types.DescribePullRequestEventsOutput, AWSError>;
  /**
   * Removes the association between a template and a repository so that approval rules based on the template are not automatically created when pull requests are created in the specified repository. This does not delete any approval rules previously created for pull requests through the template association.
   */
  disassociateApprovalRuleTemplateFromRepository(params: CodeCommit.Types.DisassociateApprovalRuleTemplateFromRepositoryInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the association between a template and a repository so that approval rules based on the template are not automatically created when pull requests are created in the specified repository. This does not delete any approval rules previously created for pull requests through the template association.
   */
  disassociateApprovalRuleTemplateFromRepository(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Evaluates whether a pull request has met all the conditions specified in its associated approval rules.
   */
  evaluatePullRequestApprovalRules(params: CodeCommit.Types.EvaluatePullRequestApprovalRulesInput, callback?: (err: AWSError, data: CodeCommit.Types.EvaluatePullRequestApprovalRulesOutput) => void): Request<CodeCommit.Types.EvaluatePullRequestApprovalRulesOutput, AWSError>;
  /**
   * Evaluates whether a pull request has met all the conditions specified in its associated approval rules.
   */
  evaluatePullRequestApprovalRules(callback?: (err: AWSError, data: CodeCommit.Types.EvaluatePullRequestApprovalRulesOutput) => void): Request<CodeCommit.Types.EvaluatePullRequestApprovalRulesOutput, AWSError>;
  /**
   * Returns information about a specified approval rule template.
   */
  getApprovalRuleTemplate(params: CodeCommit.Types.GetApprovalRuleTemplateInput, callback?: (err: AWSError, data: CodeCommit.Types.GetApprovalRuleTemplateOutput) => void): Request<CodeCommit.Types.GetApprovalRuleTemplateOutput, AWSError>;
  /**
   * Returns information about a specified approval rule template.
   */
  getApprovalRuleTemplate(callback?: (err: AWSError, data: CodeCommit.Types.GetApprovalRuleTemplateOutput) => void): Request<CodeCommit.Types.GetApprovalRuleTemplateOutput, AWSError>;
  /**
   * Returns the base-64 encoded content of an individual blob in a repository.
   */
  getBlob(params: CodeCommit.Types.GetBlobInput, callback?: (err: AWSError, data: CodeCommit.Types.GetBlobOutput) => void): Request<CodeCommit.Types.GetBlobOutput, AWSError>;
  /**
   * Returns the base-64 encoded content of an individual blob in a repository.
   */
  getBlob(callback?: (err: AWSError, data: CodeCommit.Types.GetBlobOutput) => void): Request<CodeCommit.Types.GetBlobOutput, AWSError>;
  /**
   * Returns information about a repository branch, including its name and the last commit ID.
   */
  getBranch(params: CodeCommit.Types.GetBranchInput, callback?: (err: AWSError, data: CodeCommit.Types.GetBranchOutput) => void): Request<CodeCommit.Types.GetBranchOutput, AWSError>;
  /**
   * Returns information about a repository branch, including its name and the last commit ID.
   */
  getBranch(callback?: (err: AWSError, data: CodeCommit.Types.GetBranchOutput) => void): Request<CodeCommit.Types.GetBranchOutput, AWSError>;
  /**
   * Returns the content of a comment made on a change, file, or commit in a repository.   Reaction counts might include numbers from user identities who were deleted after the reaction was made. For a count of reactions from active identities, use GetCommentReactions. 
   */
  getComment(params: CodeCommit.Types.GetCommentInput, callback?: (err: AWSError, data: CodeCommit.Types.GetCommentOutput) => void): Request<CodeCommit.Types.GetCommentOutput, AWSError>;
  /**
   * Returns the content of a comment made on a change, file, or commit in a repository.   Reaction counts might include numbers from user identities who were deleted after the reaction was made. For a count of reactions from active identities, use GetCommentReactions. 
   */
  getComment(callback?: (err: AWSError, data: CodeCommit.Types.GetCommentOutput) => void): Request<CodeCommit.Types.GetCommentOutput, AWSError>;
  /**
   * Returns information about reactions to a specified comment ID. Reactions from users who have been deleted will not be included in the count.
   */
  getCommentReactions(params: CodeCommit.Types.GetCommentReactionsInput, callback?: (err: AWSError, data: CodeCommit.Types.GetCommentReactionsOutput) => void): Request<CodeCommit.Types.GetCommentReactionsOutput, AWSError>;
  /**
   * Returns information about reactions to a specified comment ID. Reactions from users who have been deleted will not be included in the count.
   */
  getCommentReactions(callback?: (err: AWSError, data: CodeCommit.Types.GetCommentReactionsOutput) => void): Request<CodeCommit.Types.GetCommentReactionsOutput, AWSError>;
  /**
   * Returns information about comments made on the comparison between two commits.  Reaction counts might include numbers from user identities who were deleted after the reaction was made. For a count of reactions from active identities, use GetCommentReactions. 
   */
  getCommentsForComparedCommit(params: CodeCommit.Types.GetCommentsForComparedCommitInput, callback?: (err: AWSError, data: CodeCommit.Types.GetCommentsForComparedCommitOutput) => void): Request<CodeCommit.Types.GetCommentsForComparedCommitOutput, AWSError>;
  /**
   * Returns information about comments made on the comparison between two commits.  Reaction counts might include numbers from user identities who were deleted after the reaction was made. For a count of reactions from active identities, use GetCommentReactions. 
   */
  getCommentsForComparedCommit(callback?: (err: AWSError, data: CodeCommit.Types.GetCommentsForComparedCommitOutput) => void): Request<CodeCommit.Types.GetCommentsForComparedCommitOutput, AWSError>;
  /**
   * Returns comments made on a pull request.  Reaction counts might include numbers from user identities who were deleted after the reaction was made. For a count of reactions from active identities, use GetCommentReactions. 
   */
  getCommentsForPullRequest(params: CodeCommit.Types.GetCommentsForPullRequestInput, callback?: (err: AWSError, data: CodeCommit.Types.GetCommentsForPullRequestOutput) => void): Request<CodeCommit.Types.GetCommentsForPullRequestOutput, AWSError>;
  /**
   * Returns comments made on a pull request.  Reaction counts might include numbers from user identities who were deleted after the reaction was made. For a count of reactions from active identities, use GetCommentReactions. 
   */
  getCommentsForPullRequest(callback?: (err: AWSError, data: CodeCommit.Types.GetCommentsForPullRequestOutput) => void): Request<CodeCommit.Types.GetCommentsForPullRequestOutput, AWSError>;
  /**
   * Returns information about a commit, including commit message and committer information.
   */
  getCommit(params: CodeCommit.Types.GetCommitInput, callback?: (err: AWSError, data: CodeCommit.Types.GetCommitOutput) => void): Request<CodeCommit.Types.GetCommitOutput, AWSError>;
  /**
   * Returns information about a commit, including commit message and committer information.
   */
  getCommit(callback?: (err: AWSError, data: CodeCommit.Types.GetCommitOutput) => void): Request<CodeCommit.Types.GetCommitOutput, AWSError>;
  /**
   * Returns information about the differences in a valid commit specifier (such as a branch, tag, HEAD, commit ID, or other fully qualified reference). Results can be limited to a specified path.
   */
  getDifferences(params: CodeCommit.Types.GetDifferencesInput, callback?: (err: AWSError, data: CodeCommit.Types.GetDifferencesOutput) => void): Request<CodeCommit.Types.GetDifferencesOutput, AWSError>;
  /**
   * Returns information about the differences in a valid commit specifier (such as a branch, tag, HEAD, commit ID, or other fully qualified reference). Results can be limited to a specified path.
   */
  getDifferences(callback?: (err: AWSError, data: CodeCommit.Types.GetDifferencesOutput) => void): Request<CodeCommit.Types.GetDifferencesOutput, AWSError>;
  /**
   * Returns the base-64 encoded contents of a specified file and its metadata.
   */
  getFile(params: CodeCommit.Types.GetFileInput, callback?: (err: AWSError, data: CodeCommit.Types.GetFileOutput) => void): Request<CodeCommit.Types.GetFileOutput, AWSError>;
  /**
   * Returns the base-64 encoded contents of a specified file and its metadata.
   */
  getFile(callback?: (err: AWSError, data: CodeCommit.Types.GetFileOutput) => void): Request<CodeCommit.Types.GetFileOutput, AWSError>;
  /**
   * Returns the contents of a specified folder in a repository.
   */
  getFolder(params: CodeCommit.Types.GetFolderInput, callback?: (err: AWSError, data: CodeCommit.Types.GetFolderOutput) => void): Request<CodeCommit.Types.GetFolderOutput, AWSError>;
  /**
   * Returns the contents of a specified folder in a repository.
   */
  getFolder(callback?: (err: AWSError, data: CodeCommit.Types.GetFolderOutput) => void): Request<CodeCommit.Types.GetFolderOutput, AWSError>;
  /**
   * Returns information about a specified merge commit.
   */
  getMergeCommit(params: CodeCommit.Types.GetMergeCommitInput, callback?: (err: AWSError, data: CodeCommit.Types.GetMergeCommitOutput) => void): Request<CodeCommit.Types.GetMergeCommitOutput, AWSError>;
  /**
   * Returns information about a specified merge commit.
   */
  getMergeCommit(callback?: (err: AWSError, data: CodeCommit.Types.GetMergeCommitOutput) => void): Request<CodeCommit.Types.GetMergeCommitOutput, AWSError>;
  /**
   * Returns information about merge conflicts between the before and after commit IDs for a pull request in a repository.
   */
  getMergeConflicts(params: CodeCommit.Types.GetMergeConflictsInput, callback?: (err: AWSError, data: CodeCommit.Types.GetMergeConflictsOutput) => void): Request<CodeCommit.Types.GetMergeConflictsOutput, AWSError>;
  /**
   * Returns information about merge conflicts between the before and after commit IDs for a pull request in a repository.
   */
  getMergeConflicts(callback?: (err: AWSError, data: CodeCommit.Types.GetMergeConflictsOutput) => void): Request<CodeCommit.Types.GetMergeConflictsOutput, AWSError>;
  /**
   * Returns information about the merge options available for merging two specified branches. For details about why a merge option is not available, use GetMergeConflicts or DescribeMergeConflicts.
   */
  getMergeOptions(params: CodeCommit.Types.GetMergeOptionsInput, callback?: (err: AWSError, data: CodeCommit.Types.GetMergeOptionsOutput) => void): Request<CodeCommit.Types.GetMergeOptionsOutput, AWSError>;
  /**
   * Returns information about the merge options available for merging two specified branches. For details about why a merge option is not available, use GetMergeConflicts or DescribeMergeConflicts.
   */
  getMergeOptions(callback?: (err: AWSError, data: CodeCommit.Types.GetMergeOptionsOutput) => void): Request<CodeCommit.Types.GetMergeOptionsOutput, AWSError>;
  /**
   * Gets information about a pull request in a specified repository.
   */
  getPullRequest(params: CodeCommit.Types.GetPullRequestInput, callback?: (err: AWSError, data: CodeCommit.Types.GetPullRequestOutput) => void): Request<CodeCommit.Types.GetPullRequestOutput, AWSError>;
  /**
   * Gets information about a pull request in a specified repository.
   */
  getPullRequest(callback?: (err: AWSError, data: CodeCommit.Types.GetPullRequestOutput) => void): Request<CodeCommit.Types.GetPullRequestOutput, AWSError>;
  /**
   * Gets information about the approval states for a specified pull request. Approval states only apply to pull requests that have one or more approval rules applied to them.
   */
  getPullRequestApprovalStates(params: CodeCommit.Types.GetPullRequestApprovalStatesInput, callback?: (err: AWSError, data: CodeCommit.Types.GetPullRequestApprovalStatesOutput) => void): Request<CodeCommit.Types.GetPullRequestApprovalStatesOutput, AWSError>;
  /**
   * Gets information about the approval states for a specified pull request. Approval states only apply to pull requests that have one or more approval rules applied to them.
   */
  getPullRequestApprovalStates(callback?: (err: AWSError, data: CodeCommit.Types.GetPullRequestApprovalStatesOutput) => void): Request<CodeCommit.Types.GetPullRequestApprovalStatesOutput, AWSError>;
  /**
   * Returns information about whether approval rules have been set aside (overridden) for a pull request, and if so, the Amazon Resource Name (ARN) of the user or identity that overrode the rules and their requirements for the pull request.
   */
  getPullRequestOverrideState(params: CodeCommit.Types.GetPullRequestOverrideStateInput, callback?: (err: AWSError, data: CodeCommit.Types.GetPullRequestOverrideStateOutput) => void): Request<CodeCommit.Types.GetPullRequestOverrideStateOutput, AWSError>;
  /**
   * Returns information about whether approval rules have been set aside (overridden) for a pull request, and if so, the Amazon Resource Name (ARN) of the user or identity that overrode the rules and their requirements for the pull request.
   */
  getPullRequestOverrideState(callback?: (err: AWSError, data: CodeCommit.Types.GetPullRequestOverrideStateOutput) => void): Request<CodeCommit.Types.GetPullRequestOverrideStateOutput, AWSError>;
  /**
   * Returns information about a repository.  The description field for a repository accepts all HTML characters and all valid Unicode characters. Applications that do not HTML-encode the description and display it in a webpage can expose users to potentially malicious code. Make sure that you HTML-encode the description field in any application that uses this API to display the repository description on a webpage. 
   */
  getRepository(params: CodeCommit.Types.GetRepositoryInput, callback?: (err: AWSError, data: CodeCommit.Types.GetRepositoryOutput) => void): Request<CodeCommit.Types.GetRepositoryOutput, AWSError>;
  /**
   * Returns information about a repository.  The description field for a repository accepts all HTML characters and all valid Unicode characters. Applications that do not HTML-encode the description and display it in a webpage can expose users to potentially malicious code. Make sure that you HTML-encode the description field in any application that uses this API to display the repository description on a webpage. 
   */
  getRepository(callback?: (err: AWSError, data: CodeCommit.Types.GetRepositoryOutput) => void): Request<CodeCommit.Types.GetRepositoryOutput, AWSError>;
  /**
   * Gets information about triggers configured for a repository.
   */
  getRepositoryTriggers(params: CodeCommit.Types.GetRepositoryTriggersInput, callback?: (err: AWSError, data: CodeCommit.Types.GetRepositoryTriggersOutput) => void): Request<CodeCommit.Types.GetRepositoryTriggersOutput, AWSError>;
  /**
   * Gets information about triggers configured for a repository.
   */
  getRepositoryTriggers(callback?: (err: AWSError, data: CodeCommit.Types.GetRepositoryTriggersOutput) => void): Request<CodeCommit.Types.GetRepositoryTriggersOutput, AWSError>;
  /**
   * Lists all approval rule templates in the specified AWS Region in your AWS account. If an AWS Region is not specified, the AWS Region where you are signed in is used.
   */
  listApprovalRuleTemplates(params: CodeCommit.Types.ListApprovalRuleTemplatesInput, callback?: (err: AWSError, data: CodeCommit.Types.ListApprovalRuleTemplatesOutput) => void): Request<CodeCommit.Types.ListApprovalRuleTemplatesOutput, AWSError>;
  /**
   * Lists all approval rule templates in the specified AWS Region in your AWS account. If an AWS Region is not specified, the AWS Region where you are signed in is used.
   */
  listApprovalRuleTemplates(callback?: (err: AWSError, data: CodeCommit.Types.ListApprovalRuleTemplatesOutput) => void): Request<CodeCommit.Types.ListApprovalRuleTemplatesOutput, AWSError>;
  /**
   * Lists all approval rule templates that are associated with a specified repository.
   */
  listAssociatedApprovalRuleTemplatesForRepository(params: CodeCommit.Types.ListAssociatedApprovalRuleTemplatesForRepositoryInput, callback?: (err: AWSError, data: CodeCommit.Types.ListAssociatedApprovalRuleTemplatesForRepositoryOutput) => void): Request<CodeCommit.Types.ListAssociatedApprovalRuleTemplatesForRepositoryOutput, AWSError>;
  /**
   * Lists all approval rule templates that are associated with a specified repository.
   */
  listAssociatedApprovalRuleTemplatesForRepository(callback?: (err: AWSError, data: CodeCommit.Types.ListAssociatedApprovalRuleTemplatesForRepositoryOutput) => void): Request<CodeCommit.Types.ListAssociatedApprovalRuleTemplatesForRepositoryOutput, AWSError>;
  /**
   * Gets information about one or more branches in a repository.
   */
  listBranches(params: CodeCommit.Types.ListBranchesInput, callback?: (err: AWSError, data: CodeCommit.Types.ListBranchesOutput) => void): Request<CodeCommit.Types.ListBranchesOutput, AWSError>;
  /**
   * Gets information about one or more branches in a repository.
   */
  listBranches(callback?: (err: AWSError, data: CodeCommit.Types.ListBranchesOutput) => void): Request<CodeCommit.Types.ListBranchesOutput, AWSError>;
  /**
   * Returns a list of pull requests for a specified repository. The return list can be refined by pull request status or pull request author ARN.
   */
  listPullRequests(params: CodeCommit.Types.ListPullRequestsInput, callback?: (err: AWSError, data: CodeCommit.Types.ListPullRequestsOutput) => void): Request<CodeCommit.Types.ListPullRequestsOutput, AWSError>;
  /**
   * Returns a list of pull requests for a specified repository. The return list can be refined by pull request status or pull request author ARN.
   */
  listPullRequests(callback?: (err: AWSError, data: CodeCommit.Types.ListPullRequestsOutput) => void): Request<CodeCommit.Types.ListPullRequestsOutput, AWSError>;
  /**
   * Gets information about one or more repositories.
   */
  listRepositories(params: CodeCommit.Types.ListRepositoriesInput, callback?: (err: AWSError, data: CodeCommit.Types.ListRepositoriesOutput) => void): Request<CodeCommit.Types.ListRepositoriesOutput, AWSError>;
  /**
   * Gets information about one or more repositories.
   */
  listRepositories(callback?: (err: AWSError, data: CodeCommit.Types.ListRepositoriesOutput) => void): Request<CodeCommit.Types.ListRepositoriesOutput, AWSError>;
  /**
   * Lists all repositories associated with the specified approval rule template.
   */
  listRepositoriesForApprovalRuleTemplate(params: CodeCommit.Types.ListRepositoriesForApprovalRuleTemplateInput, callback?: (err: AWSError, data: CodeCommit.Types.ListRepositoriesForApprovalRuleTemplateOutput) => void): Request<CodeCommit.Types.ListRepositoriesForApprovalRuleTemplateOutput, AWSError>;
  /**
   * Lists all repositories associated with the specified approval rule template.
   */
  listRepositoriesForApprovalRuleTemplate(callback?: (err: AWSError, data: CodeCommit.Types.ListRepositoriesForApprovalRuleTemplateOutput) => void): Request<CodeCommit.Types.ListRepositoriesForApprovalRuleTemplateOutput, AWSError>;
  /**
   * Gets information about AWS tags for a specified Amazon Resource Name (ARN) in AWS CodeCommit. For a list of valid resources in AWS CodeCommit, see CodeCommit Resources and Operations in the AWS CodeCommit User Guide.
   */
  listTagsForResource(params: CodeCommit.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: CodeCommit.Types.ListTagsForResourceOutput) => void): Request<CodeCommit.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Gets information about AWS tags for a specified Amazon Resource Name (ARN) in AWS CodeCommit. For a list of valid resources in AWS CodeCommit, see CodeCommit Resources and Operations in the AWS CodeCommit User Guide.
   */
  listTagsForResource(callback?: (err: AWSError, data: CodeCommit.Types.ListTagsForResourceOutput) => void): Request<CodeCommit.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Merges two branches using the fast-forward merge strategy.
   */
  mergeBranchesByFastForward(params: CodeCommit.Types.MergeBranchesByFastForwardInput, callback?: (err: AWSError, data: CodeCommit.Types.MergeBranchesByFastForwardOutput) => void): Request<CodeCommit.Types.MergeBranchesByFastForwardOutput, AWSError>;
  /**
   * Merges two branches using the fast-forward merge strategy.
   */
  mergeBranchesByFastForward(callback?: (err: AWSError, data: CodeCommit.Types.MergeBranchesByFastForwardOutput) => void): Request<CodeCommit.Types.MergeBranchesByFastForwardOutput, AWSError>;
  /**
   * Merges two branches using the squash merge strategy.
   */
  mergeBranchesBySquash(params: CodeCommit.Types.MergeBranchesBySquashInput, callback?: (err: AWSError, data: CodeCommit.Types.MergeBranchesBySquashOutput) => void): Request<CodeCommit.Types.MergeBranchesBySquashOutput, AWSError>;
  /**
   * Merges two branches using the squash merge strategy.
   */
  mergeBranchesBySquash(callback?: (err: AWSError, data: CodeCommit.Types.MergeBranchesBySquashOutput) => void): Request<CodeCommit.Types.MergeBranchesBySquashOutput, AWSError>;
  /**
   * Merges two specified branches using the three-way merge strategy.
   */
  mergeBranchesByThreeWay(params: CodeCommit.Types.MergeBranchesByThreeWayInput, callback?: (err: AWSError, data: CodeCommit.Types.MergeBranchesByThreeWayOutput) => void): Request<CodeCommit.Types.MergeBranchesByThreeWayOutput, AWSError>;
  /**
   * Merges two specified branches using the three-way merge strategy.
   */
  mergeBranchesByThreeWay(callback?: (err: AWSError, data: CodeCommit.Types.MergeBranchesByThreeWayOutput) => void): Request<CodeCommit.Types.MergeBranchesByThreeWayOutput, AWSError>;
  /**
   * Attempts to merge the source commit of a pull request into the specified destination branch for that pull request at the specified commit using the fast-forward merge strategy. If the merge is successful, it closes the pull request.
   */
  mergePullRequestByFastForward(params: CodeCommit.Types.MergePullRequestByFastForwardInput, callback?: (err: AWSError, data: CodeCommit.Types.MergePullRequestByFastForwardOutput) => void): Request<CodeCommit.Types.MergePullRequestByFastForwardOutput, AWSError>;
  /**
   * Attempts to merge the source commit of a pull request into the specified destination branch for that pull request at the specified commit using the fast-forward merge strategy. If the merge is successful, it closes the pull request.
   */
  mergePullRequestByFastForward(callback?: (err: AWSError, data: CodeCommit.Types.MergePullRequestByFastForwardOutput) => void): Request<CodeCommit.Types.MergePullRequestByFastForwardOutput, AWSError>;
  /**
   * Attempts to merge the source commit of a pull request into the specified destination branch for that pull request at the specified commit using the squash merge strategy. If the merge is successful, it closes the pull request.
   */
  mergePullRequestBySquash(params: CodeCommit.Types.MergePullRequestBySquashInput, callback?: (err: AWSError, data: CodeCommit.Types.MergePullRequestBySquashOutput) => void): Request<CodeCommit.Types.MergePullRequestBySquashOutput, AWSError>;
  /**
   * Attempts to merge the source commit of a pull request into the specified destination branch for that pull request at the specified commit using the squash merge strategy. If the merge is successful, it closes the pull request.
   */
  mergePullRequestBySquash(callback?: (err: AWSError, data: CodeCommit.Types.MergePullRequestBySquashOutput) => void): Request<CodeCommit.Types.MergePullRequestBySquashOutput, AWSError>;
  /**
   * Attempts to merge the source commit of a pull request into the specified destination branch for that pull request at the specified commit using the three-way merge strategy. If the merge is successful, it closes the pull request.
   */
  mergePullRequestByThreeWay(params: CodeCommit.Types.MergePullRequestByThreeWayInput, callback?: (err: AWSError, data: CodeCommit.Types.MergePullRequestByThreeWayOutput) => void): Request<CodeCommit.Types.MergePullRequestByThreeWayOutput, AWSError>;
  /**
   * Attempts to merge the source commit of a pull request into the specified destination branch for that pull request at the specified commit using the three-way merge strategy. If the merge is successful, it closes the pull request.
   */
  mergePullRequestByThreeWay(callback?: (err: AWSError, data: CodeCommit.Types.MergePullRequestByThreeWayOutput) => void): Request<CodeCommit.Types.MergePullRequestByThreeWayOutput, AWSError>;
  /**
   * Sets aside (overrides) all approval rule requirements for a specified pull request.
   */
  overridePullRequestApprovalRules(params: CodeCommit.Types.OverridePullRequestApprovalRulesInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets aside (overrides) all approval rule requirements for a specified pull request.
   */
  overridePullRequestApprovalRules(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Posts a comment on the comparison between two commits.
   */
  postCommentForComparedCommit(params: CodeCommit.Types.PostCommentForComparedCommitInput, callback?: (err: AWSError, data: CodeCommit.Types.PostCommentForComparedCommitOutput) => void): Request<CodeCommit.Types.PostCommentForComparedCommitOutput, AWSError>;
  /**
   * Posts a comment on the comparison between two commits.
   */
  postCommentForComparedCommit(callback?: (err: AWSError, data: CodeCommit.Types.PostCommentForComparedCommitOutput) => void): Request<CodeCommit.Types.PostCommentForComparedCommitOutput, AWSError>;
  /**
   * Posts a comment on a pull request.
   */
  postCommentForPullRequest(params: CodeCommit.Types.PostCommentForPullRequestInput, callback?: (err: AWSError, data: CodeCommit.Types.PostCommentForPullRequestOutput) => void): Request<CodeCommit.Types.PostCommentForPullRequestOutput, AWSError>;
  /**
   * Posts a comment on a pull request.
   */
  postCommentForPullRequest(callback?: (err: AWSError, data: CodeCommit.Types.PostCommentForPullRequestOutput) => void): Request<CodeCommit.Types.PostCommentForPullRequestOutput, AWSError>;
  /**
   * Posts a comment in reply to an existing comment on a comparison between commits or a pull request.
   */
  postCommentReply(params: CodeCommit.Types.PostCommentReplyInput, callback?: (err: AWSError, data: CodeCommit.Types.PostCommentReplyOutput) => void): Request<CodeCommit.Types.PostCommentReplyOutput, AWSError>;
  /**
   * Posts a comment in reply to an existing comment on a comparison between commits or a pull request.
   */
  postCommentReply(callback?: (err: AWSError, data: CodeCommit.Types.PostCommentReplyOutput) => void): Request<CodeCommit.Types.PostCommentReplyOutput, AWSError>;
  /**
   * Adds or updates a reaction to a specified comment for the user whose identity is used to make the request. You can only add or update a reaction for yourself. You cannot add, modify, or delete a reaction for another user.
   */
  putCommentReaction(params: CodeCommit.Types.PutCommentReactionInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates a reaction to a specified comment for the user whose identity is used to make the request. You can only add or update a reaction for yourself. You cannot add, modify, or delete a reaction for another user.
   */
  putCommentReaction(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates a file in a branch in an AWS CodeCommit repository, and generates a commit for the addition in the specified branch.
   */
  putFile(params: CodeCommit.Types.PutFileInput, callback?: (err: AWSError, data: CodeCommit.Types.PutFileOutput) => void): Request<CodeCommit.Types.PutFileOutput, AWSError>;
  /**
   * Adds or updates a file in a branch in an AWS CodeCommit repository, and generates a commit for the addition in the specified branch.
   */
  putFile(callback?: (err: AWSError, data: CodeCommit.Types.PutFileOutput) => void): Request<CodeCommit.Types.PutFileOutput, AWSError>;
  /**
   * Replaces all triggers for a repository. Used to create or delete triggers.
   */
  putRepositoryTriggers(params: CodeCommit.Types.PutRepositoryTriggersInput, callback?: (err: AWSError, data: CodeCommit.Types.PutRepositoryTriggersOutput) => void): Request<CodeCommit.Types.PutRepositoryTriggersOutput, AWSError>;
  /**
   * Replaces all triggers for a repository. Used to create or delete triggers.
   */
  putRepositoryTriggers(callback?: (err: AWSError, data: CodeCommit.Types.PutRepositoryTriggersOutput) => void): Request<CodeCommit.Types.PutRepositoryTriggersOutput, AWSError>;
  /**
   * Adds or updates tags for a resource in AWS CodeCommit. For a list of valid resources in AWS CodeCommit, see CodeCommit Resources and Operations in the AWS CodeCommit User Guide.
   */
  tagResource(params: CodeCommit.Types.TagResourceInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates tags for a resource in AWS CodeCommit. For a list of valid resources in AWS CodeCommit, see CodeCommit Resources and Operations in the AWS CodeCommit User Guide.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Tests the functionality of repository triggers by sending information to the trigger target. If real data is available in the repository, the test sends data from the last commit. If no data is available, sample data is generated.
   */
  testRepositoryTriggers(params: CodeCommit.Types.TestRepositoryTriggersInput, callback?: (err: AWSError, data: CodeCommit.Types.TestRepositoryTriggersOutput) => void): Request<CodeCommit.Types.TestRepositoryTriggersOutput, AWSError>;
  /**
   * Tests the functionality of repository triggers by sending information to the trigger target. If real data is available in the repository, the test sends data from the last commit. If no data is available, sample data is generated.
   */
  testRepositoryTriggers(callback?: (err: AWSError, data: CodeCommit.Types.TestRepositoryTriggersOutput) => void): Request<CodeCommit.Types.TestRepositoryTriggersOutput, AWSError>;
  /**
   * Removes tags for a resource in AWS CodeCommit. For a list of valid resources in AWS CodeCommit, see CodeCommit Resources and Operations in the AWS CodeCommit User Guide.
   */
  untagResource(params: CodeCommit.Types.UntagResourceInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes tags for a resource in AWS CodeCommit. For a list of valid resources in AWS CodeCommit, see CodeCommit Resources and Operations in the AWS CodeCommit User Guide.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the content of an approval rule template. You can change the number of required approvals, the membership of the approval rule, and whether an approval pool is defined.
   */
  updateApprovalRuleTemplateContent(params: CodeCommit.Types.UpdateApprovalRuleTemplateContentInput, callback?: (err: AWSError, data: CodeCommit.Types.UpdateApprovalRuleTemplateContentOutput) => void): Request<CodeCommit.Types.UpdateApprovalRuleTemplateContentOutput, AWSError>;
  /**
   * Updates the content of an approval rule template. You can change the number of required approvals, the membership of the approval rule, and whether an approval pool is defined.
   */
  updateApprovalRuleTemplateContent(callback?: (err: AWSError, data: CodeCommit.Types.UpdateApprovalRuleTemplateContentOutput) => void): Request<CodeCommit.Types.UpdateApprovalRuleTemplateContentOutput, AWSError>;
  /**
   * Updates the description for a specified approval rule template.
   */
  updateApprovalRuleTemplateDescription(params: CodeCommit.Types.UpdateApprovalRuleTemplateDescriptionInput, callback?: (err: AWSError, data: CodeCommit.Types.UpdateApprovalRuleTemplateDescriptionOutput) => void): Request<CodeCommit.Types.UpdateApprovalRuleTemplateDescriptionOutput, AWSError>;
  /**
   * Updates the description for a specified approval rule template.
   */
  updateApprovalRuleTemplateDescription(callback?: (err: AWSError, data: CodeCommit.Types.UpdateApprovalRuleTemplateDescriptionOutput) => void): Request<CodeCommit.Types.UpdateApprovalRuleTemplateDescriptionOutput, AWSError>;
  /**
   * Updates the name of a specified approval rule template.
   */
  updateApprovalRuleTemplateName(params: CodeCommit.Types.UpdateApprovalRuleTemplateNameInput, callback?: (err: AWSError, data: CodeCommit.Types.UpdateApprovalRuleTemplateNameOutput) => void): Request<CodeCommit.Types.UpdateApprovalRuleTemplateNameOutput, AWSError>;
  /**
   * Updates the name of a specified approval rule template.
   */
  updateApprovalRuleTemplateName(callback?: (err: AWSError, data: CodeCommit.Types.UpdateApprovalRuleTemplateNameOutput) => void): Request<CodeCommit.Types.UpdateApprovalRuleTemplateNameOutput, AWSError>;
  /**
   * Replaces the contents of a comment.
   */
  updateComment(params: CodeCommit.Types.UpdateCommentInput, callback?: (err: AWSError, data: CodeCommit.Types.UpdateCommentOutput) => void): Request<CodeCommit.Types.UpdateCommentOutput, AWSError>;
  /**
   * Replaces the contents of a comment.
   */
  updateComment(callback?: (err: AWSError, data: CodeCommit.Types.UpdateCommentOutput) => void): Request<CodeCommit.Types.UpdateCommentOutput, AWSError>;
  /**
   * Sets or changes the default branch name for the specified repository.  If you use this operation to change the default branch name to the current default branch name, a success message is returned even though the default branch did not change. 
   */
  updateDefaultBranch(params: CodeCommit.Types.UpdateDefaultBranchInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets or changes the default branch name for the specified repository.  If you use this operation to change the default branch name to the current default branch name, a success message is returned even though the default branch did not change. 
   */
  updateDefaultBranch(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the structure of an approval rule created specifically for a pull request. For example, you can change the number of required approvers and the approval pool for approvers. 
   */
  updatePullRequestApprovalRuleContent(params: CodeCommit.Types.UpdatePullRequestApprovalRuleContentInput, callback?: (err: AWSError, data: CodeCommit.Types.UpdatePullRequestApprovalRuleContentOutput) => void): Request<CodeCommit.Types.UpdatePullRequestApprovalRuleContentOutput, AWSError>;
  /**
   * Updates the structure of an approval rule created specifically for a pull request. For example, you can change the number of required approvers and the approval pool for approvers. 
   */
  updatePullRequestApprovalRuleContent(callback?: (err: AWSError, data: CodeCommit.Types.UpdatePullRequestApprovalRuleContentOutput) => void): Request<CodeCommit.Types.UpdatePullRequestApprovalRuleContentOutput, AWSError>;
  /**
   * Updates the state of a user's approval on a pull request. The user is derived from the signed-in account when the request is made.
   */
  updatePullRequestApprovalState(params: CodeCommit.Types.UpdatePullRequestApprovalStateInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the state of a user's approval on a pull request. The user is derived from the signed-in account when the request is made.
   */
  updatePullRequestApprovalState(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Replaces the contents of the description of a pull request.
   */
  updatePullRequestDescription(params: CodeCommit.Types.UpdatePullRequestDescriptionInput, callback?: (err: AWSError, data: CodeCommit.Types.UpdatePullRequestDescriptionOutput) => void): Request<CodeCommit.Types.UpdatePullRequestDescriptionOutput, AWSError>;
  /**
   * Replaces the contents of the description of a pull request.
   */
  updatePullRequestDescription(callback?: (err: AWSError, data: CodeCommit.Types.UpdatePullRequestDescriptionOutput) => void): Request<CodeCommit.Types.UpdatePullRequestDescriptionOutput, AWSError>;
  /**
   * Updates the status of a pull request. 
   */
  updatePullRequestStatus(params: CodeCommit.Types.UpdatePullRequestStatusInput, callback?: (err: AWSError, data: CodeCommit.Types.UpdatePullRequestStatusOutput) => void): Request<CodeCommit.Types.UpdatePullRequestStatusOutput, AWSError>;
  /**
   * Updates the status of a pull request. 
   */
  updatePullRequestStatus(callback?: (err: AWSError, data: CodeCommit.Types.UpdatePullRequestStatusOutput) => void): Request<CodeCommit.Types.UpdatePullRequestStatusOutput, AWSError>;
  /**
   * Replaces the title of a pull request.
   */
  updatePullRequestTitle(params: CodeCommit.Types.UpdatePullRequestTitleInput, callback?: (err: AWSError, data: CodeCommit.Types.UpdatePullRequestTitleOutput) => void): Request<CodeCommit.Types.UpdatePullRequestTitleOutput, AWSError>;
  /**
   * Replaces the title of a pull request.
   */
  updatePullRequestTitle(callback?: (err: AWSError, data: CodeCommit.Types.UpdatePullRequestTitleOutput) => void): Request<CodeCommit.Types.UpdatePullRequestTitleOutput, AWSError>;
  /**
   * Sets or changes the comment or description for a repository.  The description field for a repository accepts all HTML characters and all valid Unicode characters. Applications that do not HTML-encode the description and display it in a webpage can expose users to potentially malicious code. Make sure that you HTML-encode the description field in any application that uses this API to display the repository description on a webpage. 
   */
  updateRepositoryDescription(params: CodeCommit.Types.UpdateRepositoryDescriptionInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets or changes the comment or description for a repository.  The description field for a repository accepts all HTML characters and all valid Unicode characters. Applications that do not HTML-encode the description and display it in a webpage can expose users to potentially malicious code. Make sure that you HTML-encode the description field in any application that uses this API to display the repository description on a webpage. 
   */
  updateRepositoryDescription(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Renames a repository. The repository name must be unique across the calling AWS account. Repository names are limited to 100 alphanumeric, dash, and underscore characters, and cannot include certain characters. The suffix .git is prohibited. For more information about the limits on repository names, see Limits in the AWS CodeCommit User Guide.
   */
  updateRepositoryName(params: CodeCommit.Types.UpdateRepositoryNameInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Renames a repository. The repository name must be unique across the calling AWS account. Repository names are limited to 100 alphanumeric, dash, and underscore characters, and cannot include certain characters. The suffix .git is prohibited. For more information about the limits on repository names, see Limits in the AWS CodeCommit User Guide.
   */
  updateRepositoryName(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace CodeCommit {
  export type AccountId = string;
  export type AdditionalData = string;
  export interface Approval {
    /**
     * The Amazon Resource Name (ARN) of the user.
     */
    userArn?: Arn;
    /**
     * The state of the approval, APPROVE or REVOKE. REVOKE states are not stored.
     */
    approvalState?: ApprovalState;
  }
  export type ApprovalList = Approval[];
  export interface ApprovalRule {
    /**
     * The system-generated ID of the approval rule.
     */
    approvalRuleId?: ApprovalRuleId;
    /**
     * The name of the approval rule.
     */
    approvalRuleName?: ApprovalRuleName;
    /**
     * The content of the approval rule.
     */
    approvalRuleContent?: ApprovalRuleContent;
    /**
     * The SHA-256 hash signature for the content of the approval rule.
     */
    ruleContentSha256?: RuleContentSha256;
    /**
     * The date the approval rule was most recently changed, in timestamp format.
     */
    lastModifiedDate?: LastModifiedDate;
    /**
     * The date the approval rule was created, in timestamp format.
     */
    creationDate?: CreationDate;
    /**
     * The Amazon Resource Name (ARN) of the user who made the most recent changes to the approval rule.
     */
    lastModifiedUser?: Arn;
    /**
     * The approval rule template used to create the rule.
     */
    originApprovalRuleTemplate?: OriginApprovalRuleTemplate;
  }
  export type ApprovalRuleContent = string;
  export interface ApprovalRuleEventMetadata {
    /**
     * The name of the approval rule.
     */
    approvalRuleName?: ApprovalRuleName;
    /**
     * The system-generated ID of the approval rule.
     */
    approvalRuleId?: ApprovalRuleId;
    /**
     * The content of the approval rule.
     */
    approvalRuleContent?: ApprovalRuleContent;
  }
  export type ApprovalRuleId = string;
  export type ApprovalRuleName = string;
  export interface ApprovalRuleOverriddenEventMetadata {
    /**
     * The revision ID of the pull request when the override event occurred.
     */
    revisionId?: RevisionId;
    /**
     * The status of the override event.
     */
    overrideStatus?: OverrideStatus;
  }
  export interface ApprovalRuleTemplate {
    /**
     * The system-generated ID of the approval rule template.
     */
    approvalRuleTemplateId?: ApprovalRuleTemplateId;
    /**
     * The name of the approval rule template.
     */
    approvalRuleTemplateName?: ApprovalRuleTemplateName;
    /**
     * The description of the approval rule template.
     */
    approvalRuleTemplateDescription?: ApprovalRuleTemplateDescription;
    /**
     * The content of the approval rule template.
     */
    approvalRuleTemplateContent?: ApprovalRuleTemplateContent;
    /**
     * The SHA-256 hash signature for the content of the approval rule template.
     */
    ruleContentSha256?: RuleContentSha256;
    /**
     * The date the approval rule template was most recently changed, in timestamp format.
     */
    lastModifiedDate?: LastModifiedDate;
    /**
     * The date the approval rule template was created, in timestamp format.
     */
    creationDate?: CreationDate;
    /**
     * The Amazon Resource Name (ARN) of the user who made the most recent changes to the approval rule template.
     */
    lastModifiedUser?: Arn;
  }
  export type ApprovalRuleTemplateContent = string;
  export type ApprovalRuleTemplateDescription = string;
  export type ApprovalRuleTemplateId = string;
  export type ApprovalRuleTemplateName = string;
  export type ApprovalRuleTemplateNameList = ApprovalRuleTemplateName[];
  export type ApprovalRulesList = ApprovalRule[];
  export type ApprovalRulesNotSatisfiedList = ApprovalRuleName[];
  export type ApprovalRulesSatisfiedList = ApprovalRuleName[];
  export type ApprovalState = "APPROVE"|"REVOKE"|string;
  export interface ApprovalStateChangedEventMetadata {
    /**
     * The revision ID of the pull request when the approval state changed.
     */
    revisionId?: RevisionId;
    /**
     * The approval status for the pull request.
     */
    approvalStatus?: ApprovalState;
  }
  export type Approved = boolean;
  export type Arn = string;
  export interface AssociateApprovalRuleTemplateWithRepositoryInput {
    /**
     * The name for the approval rule template. 
     */
    approvalRuleTemplateName: ApprovalRuleTemplateName;
    /**
     * The name of the repository that you want to associate with the template.
     */
    repositoryName: RepositoryName;
  }
  export interface BatchAssociateApprovalRuleTemplateWithRepositoriesError {
    /**
     * The name of the repository where the association was not made.
     */
    repositoryName?: RepositoryName;
    /**
     * An error code that specifies whether the repository name was not valid or not found.
     */
    errorCode?: ErrorCode;
    /**
     * An error message that provides details about why the repository name was not found or not valid.
     */
    errorMessage?: ErrorMessage;
  }
  export type BatchAssociateApprovalRuleTemplateWithRepositoriesErrorsList = BatchAssociateApprovalRuleTemplateWithRepositoriesError[];
  export interface BatchAssociateApprovalRuleTemplateWithRepositoriesInput {
    /**
     * The name of the template you want to associate with one or more repositories.
     */
    approvalRuleTemplateName: ApprovalRuleTemplateName;
    /**
     * The names of the repositories you want to associate with the template.  The length constraint limit is for each string in the array. The array itself can be empty. 
     */
    repositoryNames: RepositoryNameList;
  }
  export interface BatchAssociateApprovalRuleTemplateWithRepositoriesOutput {
    /**
     * A list of names of the repositories that have been associated with the template.
     */
    associatedRepositoryNames: RepositoryNameList;
    /**
     * A list of any errors that might have occurred while attempting to create the association between the template and the repositories.
     */
    errors: BatchAssociateApprovalRuleTemplateWithRepositoriesErrorsList;
  }
  export interface BatchDescribeMergeConflictsError {
    /**
     * The path to the file.
     */
    filePath: Path;
    /**
     * The name of the exception.
     */
    exceptionName: ExceptionName;
    /**
     * The message provided by the exception.
     */
    message: Message;
  }
  export type BatchDescribeMergeConflictsErrors = BatchDescribeMergeConflictsError[];
  export interface BatchDescribeMergeConflictsInput {
    /**
     * The name of the repository that contains the merge conflicts you want to review.
     */
    repositoryName: RepositoryName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    destinationCommitSpecifier: CommitName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    sourceCommitSpecifier: CommitName;
    /**
     * The merge option or strategy you want to use to merge the code.
     */
    mergeOption: MergeOptionTypeEnum;
    /**
     * The maximum number of merge hunks to include in the output.
     */
    maxMergeHunks?: MaxResults;
    /**
     * The maximum number of files to include in the output.
     */
    maxConflictFiles?: MaxResults;
    /**
     * The path of the target files used to describe the conflicts. If not specified, the default is all conflict files.
     */
    filePaths?: FilePaths;
    /**
     * The level of conflict detail to use. If unspecified, the default FILE_LEVEL is used, which returns a not-mergeable result if the same file has differences in both branches. If LINE_LEVEL is specified, a conflict is considered not mergeable if the same file in both branches has differences on the same line.
     */
    conflictDetailLevel?: ConflictDetailLevelTypeEnum;
    /**
     * Specifies which branch to use when resolving conflicts, or whether to attempt automatically merging two versions of a file. The default is NONE, which requires any conflicts to be resolved manually before the merge operation is successful.
     */
    conflictResolutionStrategy?: ConflictResolutionStrategyTypeEnum;
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results.
     */
    nextToken?: NextToken;
  }
  export interface BatchDescribeMergeConflictsOutput {
    /**
     * A list of conflicts for each file, including the conflict metadata and the hunks of the differences between the files.
     */
    conflicts: Conflicts;
    /**
     * An enumeration token that can be used in a request to return the next batch of the results.
     */
    nextToken?: NextToken;
    /**
     * A list of any errors returned while describing the merge conflicts for each file.
     */
    errors?: BatchDescribeMergeConflictsErrors;
    /**
     * The commit ID of the destination commit specifier that was used in the merge evaluation.
     */
    destinationCommitId: ObjectId;
    /**
     * The commit ID of the source commit specifier that was used in the merge evaluation.
     */
    sourceCommitId: ObjectId;
    /**
     * The commit ID of the merge base.
     */
    baseCommitId?: ObjectId;
  }
  export interface BatchDisassociateApprovalRuleTemplateFromRepositoriesError {
    /**
     * The name of the repository where the association with the template was not able to be removed.
     */
    repositoryName?: RepositoryName;
    /**
     * An error code that specifies whether the repository name was not valid or not found.
     */
    errorCode?: ErrorCode;
    /**
     * An error message that provides details about why the repository name was either not found or not valid.
     */
    errorMessage?: ErrorMessage;
  }
  export type BatchDisassociateApprovalRuleTemplateFromRepositoriesErrorsList = BatchDisassociateApprovalRuleTemplateFromRepositoriesError[];
  export interface BatchDisassociateApprovalRuleTemplateFromRepositoriesInput {
    /**
     * The name of the template that you want to disassociate from one or more repositories.
     */
    approvalRuleTemplateName: ApprovalRuleTemplateName;
    /**
     * The repository names that you want to disassociate from the approval rule template.  The length constraint limit is for each string in the array. The array itself can be empty. 
     */
    repositoryNames: RepositoryNameList;
  }
  export interface BatchDisassociateApprovalRuleTemplateFromRepositoriesOutput {
    /**
     * A list of repository names that have had their association with the template removed.
     */
    disassociatedRepositoryNames: RepositoryNameList;
    /**
     * A list of any errors that might have occurred while attempting to remove the association between the template and the repositories.
     */
    errors: BatchDisassociateApprovalRuleTemplateFromRepositoriesErrorsList;
  }
  export interface BatchGetCommitsError {
    /**
     * A commit ID that either could not be found or was not in a valid format.
     */
    commitId?: ObjectId;
    /**
     * An error code that specifies whether the commit ID was not valid or not found.
     */
    errorCode?: ErrorCode;
    /**
     * An error message that provides detail about why the commit ID either was not found or was not valid.
     */
    errorMessage?: ErrorMessage;
  }
  export type BatchGetCommitsErrorsList = BatchGetCommitsError[];
  export interface BatchGetCommitsInput {
    /**
     * The full commit IDs of the commits to get information about.  You must supply the full SHA IDs of each commit. You cannot use shortened SHA IDs. 
     */
    commitIds: CommitIdsInputList;
    /**
     * The name of the repository that contains the commits.
     */
    repositoryName: RepositoryName;
  }
  export interface BatchGetCommitsOutput {
    /**
     * An array of commit data type objects, each of which contains information about a specified commit.
     */
    commits?: CommitObjectsList;
    /**
     * Returns any commit IDs for which information could not be found. For example, if one of the commit IDs was a shortened SHA ID or that commit was not found in the specified repository, the ID returns an error object with more information.
     */
    errors?: BatchGetCommitsErrorsList;
  }
  export interface BatchGetRepositoriesInput {
    /**
     * The names of the repositories to get information about.  The length constraint limit is for each string in the array. The array itself can be empty. 
     */
    repositoryNames: RepositoryNameList;
  }
  export interface BatchGetRepositoriesOutput {
    /**
     * A list of repositories returned by the batch get repositories operation.
     */
    repositories?: RepositoryMetadataList;
    /**
     * Returns a list of repository names for which information could not be found.
     */
    repositoriesNotFound?: RepositoryNotFoundList;
  }
  export interface BlobMetadata {
    /**
     * The full ID of the blob.
     */
    blobId?: ObjectId;
    /**
     * The path to the blob and associated file name, if any.
     */
    path?: Path;
    /**
     * The file mode permissions of the blob. File mode permission codes include:    100644 indicates read/write    100755 indicates read/write/execute    160000 indicates a submodule    120000 indicates a symlink  
     */
    mode?: Mode;
  }
  export interface BranchInfo {
    /**
     * The name of the branch.
     */
    branchName?: BranchName;
    /**
     * The ID of the last commit made to the branch.
     */
    commitId?: CommitId;
  }
  export type BranchName = string;
  export type BranchNameList = BranchName[];
  export type CallerReactions = ReactionValue[];
  export type CapitalBoolean = boolean;
  export type ChangeTypeEnum = "A"|"M"|"D"|string;
  export type ClientRequestToken = string;
  export type CloneUrlHttp = string;
  export type CloneUrlSsh = string;
  export interface Comment {
    /**
     * The system-generated comment ID.
     */
    commentId?: CommentId;
    /**
     * The content of the comment.
     */
    content?: Content;
    /**
     * The ID of the comment for which this comment is a reply, if any.
     */
    inReplyTo?: CommentId;
    /**
     * The date and time the comment was created, in timestamp format.
     */
    creationDate?: CreationDate;
    /**
     * The date and time the comment was most recently modified, in timestamp format.
     */
    lastModifiedDate?: LastModifiedDate;
    /**
     * The Amazon Resource Name (ARN) of the person who posted the comment.
     */
    authorArn?: Arn;
    /**
     * A Boolean value indicating whether the comment has been deleted.
     */
    deleted?: IsCommentDeleted;
    /**
     * A unique, client-generated idempotency token that, when provided in a request, ensures the request cannot be repeated with a changed parameter. If a request is received with the same parameters and a token is included, the request returns information about the initial request that used that token.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * The emoji reactions to a comment, if any, submitted by the user whose credentials are associated with the call to the API.
     */
    callerReactions?: CallerReactions;
    /**
     * A string to integer map that represents the number of individual users who have responded to a comment with the specified reactions.
     */
    reactionCounts?: ReactionCountsMap;
  }
  export type CommentId = string;
  export type Comments = Comment[];
  export interface CommentsForComparedCommit {
    /**
     * The name of the repository that contains the compared commits.
     */
    repositoryName?: RepositoryName;
    /**
     * The full commit ID of the commit used to establish the before of the comparison.
     */
    beforeCommitId?: CommitId;
    /**
     * The full commit ID of the commit used to establish the after of the comparison.
     */
    afterCommitId?: CommitId;
    /**
     * The full blob ID of the commit used to establish the before of the comparison.
     */
    beforeBlobId?: ObjectId;
    /**
     * The full blob ID of the commit used to establish the after of the comparison.
     */
    afterBlobId?: ObjectId;
    /**
     * Location information about the comment on the comparison, including the file name, line number, and whether the version of the file where the comment was made is BEFORE or AFTER.
     */
    location?: Location;
    /**
     * An array of comment objects. Each comment object contains information about a comment on the comparison between commits.
     */
    comments?: Comments;
  }
  export type CommentsForComparedCommitData = CommentsForComparedCommit[];
  export interface CommentsForPullRequest {
    /**
     * The system-generated ID of the pull request.
     */
    pullRequestId?: PullRequestId;
    /**
     * The name of the repository that contains the pull request.
     */
    repositoryName?: RepositoryName;
    /**
     * The full commit ID of the commit that was the tip of the destination branch when the pull request was created. This commit is superceded by the after commit in the source branch when and if you merge the source branch into the destination branch.
     */
    beforeCommitId?: CommitId;
    /**
     * The full commit ID of the commit that was the tip of the source branch at the time the comment was made. 
     */
    afterCommitId?: CommitId;
    /**
     * The full blob ID of the file on which you want to comment on the destination commit.
     */
    beforeBlobId?: ObjectId;
    /**
     * The full blob ID of the file on which you want to comment on the source commit.
     */
    afterBlobId?: ObjectId;
    /**
     * Location information about the comment on the pull request, including the file name, line number, and whether the version of the file where the comment was made is BEFORE (destination branch) or AFTER (source branch).
     */
    location?: Location;
    /**
     * An array of comment objects. Each comment object contains information about a comment on the pull request.
     */
    comments?: Comments;
  }
  export type CommentsForPullRequestData = CommentsForPullRequest[];
  export interface Commit {
    /**
     * The full SHA ID of the specified commit. 
     */
    commitId?: ObjectId;
    /**
     * Tree information for the specified commit.
     */
    treeId?: ObjectId;
    /**
     * A list of parent commits for the specified commit. Each parent commit ID is the full commit ID.
     */
    parents?: ParentList;
    /**
     * The commit message associated with the specified commit.
     */
    message?: Message;
    /**
     * Information about the author of the specified commit. Information includes the date in timestamp format with GMT offset, the name of the author, and the email address for the author, as configured in Git.
     */
    author?: UserInfo;
    /**
     * Information about the person who committed the specified commit, also known as the committer. Information includes the date in timestamp format with GMT offset, the name of the committer, and the email address for the committer, as configured in Git. For more information about the difference between an author and a committer in Git, see Viewing the Commit History in Pro Git by Scott Chacon and Ben Straub.
     */
    committer?: UserInfo;
    /**
     * Any other data associated with the specified commit.
     */
    additionalData?: AdditionalData;
  }
  export type CommitId = string;
  export type CommitIdsInputList = ObjectId[];
  export type CommitName = string;
  export type CommitObjectsList = Commit[];
  export interface Conflict {
    /**
     * Metadata about a conflict in a merge operation.
     */
    conflictMetadata?: ConflictMetadata;
    /**
     * A list of hunks that contain the differences between files or lines causing the conflict.
     */
    mergeHunks?: MergeHunks;
  }
  export type ConflictDetailLevelTypeEnum = "FILE_LEVEL"|"LINE_LEVEL"|string;
  export interface ConflictMetadata {
    /**
     * The path of the file that contains conflicts.
     */
    filePath?: Path;
    /**
     * The file sizes of the file in the source, destination, and base of the merge.
     */
    fileSizes?: FileSizes;
    /**
     * The file modes of the file in the source, destination, and base of the merge.
     */
    fileModes?: FileModes;
    /**
     * Information about any object type conflicts in a merge operation.
     */
    objectTypes?: ObjectTypes;
    /**
     * The number of conflicts, including both hunk conflicts and metadata conflicts.
     */
    numberOfConflicts?: NumberOfConflicts;
    /**
     * A boolean value (true or false) indicating whether the file is binary or textual in the source, destination, and base of the merge.
     */
    isBinaryFile?: IsBinaryFile;
    /**
     * A boolean value indicating whether there are conflicts in the content of a file.
     */
    contentConflict?: IsContentConflict;
    /**
     * A boolean value indicating whether there are conflicts in the file mode of a file.
     */
    fileModeConflict?: IsFileModeConflict;
    /**
     * A boolean value (true or false) indicating whether there are conflicts between the branches in the object type of a file, folder, or submodule.
     */
    objectTypeConflict?: IsObjectTypeConflict;
    /**
     * Whether an add, modify, or delete operation caused the conflict between the source and destination of the merge.
     */
    mergeOperations?: MergeOperations;
  }
  export type ConflictMetadataList = ConflictMetadata[];
  export interface ConflictResolution {
    /**
     * Files to have content replaced as part of the merge conflict resolution.
     */
    replaceContents?: ReplaceContentEntries;
    /**
     * Files to be deleted as part of the merge conflict resolution.
     */
    deleteFiles?: DeleteFileEntries;
    /**
     * File modes that are set as part of the merge conflict resolution.
     */
    setFileModes?: SetFileModeEntries;
  }
  export type ConflictResolutionStrategyTypeEnum = "NONE"|"ACCEPT_SOURCE"|"ACCEPT_DESTINATION"|"AUTOMERGE"|string;
  export type Conflicts = Conflict[];
  export type Content = string;
  export type Count = number;
  export interface CreateApprovalRuleTemplateInput {
    /**
     * The name of the approval rule template. Provide descriptive names, because this name is applied to the approval rules created automatically in associated repositories.
     */
    approvalRuleTemplateName: ApprovalRuleTemplateName;
    /**
     * The content of the approval rule that is created on pull requests in associated repositories. If you specify one or more destination references (branches), approval rules are created in an associated repository only if their destination references (branches) match those specified in the template.  When you create the content of the approval rule template, you can specify approvers in an approval pool in one of two ways:    CodeCommitApprovers: This option only requires an AWS account and a resource. It can be used for both IAM users and federated access users whose name matches the provided resource name. This is a very powerful option that offers a great deal of flexibility. For example, if you specify the AWS account 123456789012 and Mary_Major, all of the following are counted as approvals coming from that user:   An IAM user in the account (arn:aws:iam::123456789012:user/Mary_Major)   A federated user identified in IAM as Mary_Major (arn:aws:sts::123456789012:federated-user/Mary_Major)   This option does not recognize an active session of someone assuming the role of CodeCommitReview with a role session name of Mary_Major (arn:aws:sts::123456789012:assumed-role/CodeCommitReview/Mary_Major) unless you include a wildcard (*Mary_Major).    Fully qualified ARN: This option allows you to specify the fully qualified Amazon Resource Name (ARN) of the IAM user or role.    For more information about IAM ARNs, wildcards, and formats, see IAM Identifiers in the IAM User Guide. 
     */
    approvalRuleTemplateContent: ApprovalRuleTemplateContent;
    /**
     * The description of the approval rule template. Consider providing a description that explains what this template does and when it might be appropriate to associate it with repositories.
     */
    approvalRuleTemplateDescription?: ApprovalRuleTemplateDescription;
  }
  export interface CreateApprovalRuleTemplateOutput {
    /**
     * The content and structure of the created approval rule template.
     */
    approvalRuleTemplate: ApprovalRuleTemplate;
  }
  export interface CreateBranchInput {
    /**
     * The name of the repository in which you want to create the new branch.
     */
    repositoryName: RepositoryName;
    /**
     * The name of the new branch to create.
     */
    branchName: BranchName;
    /**
     * The ID of the commit to point the new branch to.
     */
    commitId: CommitId;
  }
  export interface CreateCommitInput {
    /**
     * The name of the repository where you create the commit.
     */
    repositoryName: RepositoryName;
    /**
     * The name of the branch where you create the commit.
     */
    branchName: BranchName;
    /**
     * The ID of the commit that is the parent of the commit you create. Not required if this is an empty repository.
     */
    parentCommitId?: CommitId;
    /**
     * The name of the author who created the commit. This information is used as both the author and committer for the commit.
     */
    authorName?: Name;
    /**
     * The email address of the person who created the commit.
     */
    email?: Email;
    /**
     * The commit message you want to include in the commit. Commit messages are limited to 256 KB. If no message is specified, a default message is used.
     */
    commitMessage?: Message;
    /**
     * If the commit contains deletions, whether to keep a folder or folder structure if the changes leave the folders empty. If true, a ..gitkeep file is created for empty folders. The default is false.
     */
    keepEmptyFolders?: KeepEmptyFolders;
    /**
     * The files to add or update in this commit.
     */
    putFiles?: PutFileEntries;
    /**
     * The files to delete in this commit. These files still exist in earlier commits.
     */
    deleteFiles?: DeleteFileEntries;
    /**
     * The file modes to update for files in this commit.
     */
    setFileModes?: SetFileModeEntries;
  }
  export interface CreateCommitOutput {
    /**
     * The full commit ID of the commit that contains your committed file changes.
     */
    commitId?: ObjectId;
    /**
     * The full SHA-1 pointer of the tree information for the commit that contains the commited file changes.
     */
    treeId?: ObjectId;
    /**
     * The files added as part of the committed file changes.
     */
    filesAdded?: FilesMetadata;
    /**
     * The files updated as part of the commited file changes.
     */
    filesUpdated?: FilesMetadata;
    /**
     * The files deleted as part of the committed file changes.
     */
    filesDeleted?: FilesMetadata;
  }
  export interface CreatePullRequestApprovalRuleInput {
    /**
     * The system-generated ID of the pull request for which you want to create the approval rule.
     */
    pullRequestId: PullRequestId;
    /**
     * The name for the approval rule.
     */
    approvalRuleName: ApprovalRuleName;
    /**
     * The content of the approval rule, including the number of approvals needed and the structure of an approval pool defined for approvals, if any. For more information about approval pools, see the AWS CodeCommit User Guide.  When you create the content of the approval rule, you can specify approvers in an approval pool in one of two ways:    CodeCommitApprovers: This option only requires an AWS account and a resource. It can be used for both IAM users and federated access users whose name matches the provided resource name. This is a very powerful option that offers a great deal of flexibility. For example, if you specify the AWS account 123456789012 and Mary_Major, all of the following would be counted as approvals coming from that user:   An IAM user in the account (arn:aws:iam::123456789012:user/Mary_Major)   A federated user identified in IAM as Mary_Major (arn:aws:sts::123456789012:federated-user/Mary_Major)   This option does not recognize an active session of someone assuming the role of CodeCommitReview with a role session name of Mary_Major (arn:aws:sts::123456789012:assumed-role/CodeCommitReview/Mary_Major) unless you include a wildcard (*Mary_Major).    Fully qualified ARN: This option allows you to specify the fully qualified Amazon Resource Name (ARN) of the IAM user or role.    For more information about IAM ARNs, wildcards, and formats, see IAM Identifiers in the IAM User Guide. 
     */
    approvalRuleContent: ApprovalRuleContent;
  }
  export interface CreatePullRequestApprovalRuleOutput {
    /**
     * Information about the created approval rule.
     */
    approvalRule: ApprovalRule;
  }
  export interface CreatePullRequestInput {
    /**
     * The title of the pull request. This title is used to identify the pull request to other users in the repository.
     */
    title: Title;
    /**
     * A description of the pull request.
     */
    description?: Description;
    /**
     * The targets for the pull request, including the source of the code to be reviewed (the source branch) and the destination where the creator of the pull request intends the code to be merged after the pull request is closed (the destination branch).
     */
    targets: TargetList;
    /**
     * A unique, client-generated idempotency token that, when provided in a request, ensures the request cannot be repeated with a changed parameter. If a request is received with the same parameters and a token is included, the request returns information about the initial request that used that token.  The AWS SDKs prepopulate client request tokens. If you are using an AWS SDK, an idempotency token is created for you. 
     */
    clientRequestToken?: ClientRequestToken;
  }
  export interface CreatePullRequestOutput {
    /**
     * Information about the newly created pull request.
     */
    pullRequest: PullRequest;
  }
  export interface CreateRepositoryInput {
    /**
     * The name of the new repository to be created.  The repository name must be unique across the calling AWS account. Repository names are limited to 100 alphanumeric, dash, and underscore characters, and cannot include certain characters. For more information about the limits on repository names, see Limits in the AWS CodeCommit User Guide. The suffix .git is prohibited. 
     */
    repositoryName: RepositoryName;
    /**
     * A comment or description about the new repository.  The description field for a repository accepts all HTML characters and all valid Unicode characters. Applications that do not HTML-encode the description and display it in a webpage can expose users to potentially malicious code. Make sure that you HTML-encode the description field in any application that uses this API to display the repository description on a webpage. 
     */
    repositoryDescription?: RepositoryDescription;
    /**
     * One or more tag key-value pairs to use when tagging this repository.
     */
    tags?: TagsMap;
  }
  export interface CreateRepositoryOutput {
    /**
     * Information about the newly created repository.
     */
    repositoryMetadata?: RepositoryMetadata;
  }
  export interface CreateUnreferencedMergeCommitInput {
    /**
     * The name of the repository where you want to create the unreferenced merge commit.
     */
    repositoryName: RepositoryName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    sourceCommitSpecifier: CommitName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    destinationCommitSpecifier: CommitName;
    /**
     * The merge option or strategy you want to use to merge the code.
     */
    mergeOption: MergeOptionTypeEnum;
    /**
     * The level of conflict detail to use. If unspecified, the default FILE_LEVEL is used, which returns a not-mergeable result if the same file has differences in both branches. If LINE_LEVEL is specified, a conflict is considered not mergeable if the same file in both branches has differences on the same line.
     */
    conflictDetailLevel?: ConflictDetailLevelTypeEnum;
    /**
     * Specifies which branch to use when resolving conflicts, or whether to attempt automatically merging two versions of a file. The default is NONE, which requires any conflicts to be resolved manually before the merge operation is successful.
     */
    conflictResolutionStrategy?: ConflictResolutionStrategyTypeEnum;
    /**
     * The name of the author who created the unreferenced commit. This information is used as both the author and committer for the commit.
     */
    authorName?: Name;
    /**
     * The email address for the person who created the unreferenced commit.
     */
    email?: Email;
    /**
     * The commit message for the unreferenced commit.
     */
    commitMessage?: Message;
    /**
     * If the commit contains deletions, whether to keep a folder or folder structure if the changes leave the folders empty. If this is specified as true, a .gitkeep file is created for empty folders. The default is false.
     */
    keepEmptyFolders?: KeepEmptyFolders;
    /**
     * If AUTOMERGE is the conflict resolution strategy, a list of inputs to use when resolving conflicts during a merge.
     */
    conflictResolution?: ConflictResolution;
  }
  export interface CreateUnreferencedMergeCommitOutput {
    /**
     * The full commit ID of the commit that contains your merge results.
     */
    commitId?: ObjectId;
    /**
     * The full SHA-1 pointer of the tree information for the commit that contains the merge results.
     */
    treeId?: ObjectId;
  }
  export type CreationDate = Date;
  export type _Date = string;
  export interface DeleteApprovalRuleTemplateInput {
    /**
     * The name of the approval rule template to delete.
     */
    approvalRuleTemplateName: ApprovalRuleTemplateName;
  }
  export interface DeleteApprovalRuleTemplateOutput {
    /**
     * The system-generated ID of the deleted approval rule template. If the template has been previously deleted, the only response is a 200 OK.
     */
    approvalRuleTemplateId: ApprovalRuleTemplateId;
  }
  export interface DeleteBranchInput {
    /**
     * The name of the repository that contains the branch to be deleted.
     */
    repositoryName: RepositoryName;
    /**
     * The name of the branch to delete.
     */
    branchName: BranchName;
  }
  export interface DeleteBranchOutput {
    /**
     * Information about the branch deleted by the operation, including the branch name and the commit ID that was the tip of the branch.
     */
    deletedBranch?: BranchInfo;
  }
  export interface DeleteCommentContentInput {
    /**
     * The unique, system-generated ID of the comment. To get this ID, use GetCommentsForComparedCommit or GetCommentsForPullRequest.
     */
    commentId: CommentId;
  }
  export interface DeleteCommentContentOutput {
    /**
     * Information about the comment you just deleted.
     */
    comment?: Comment;
  }
  export type DeleteFileEntries = DeleteFileEntry[];
  export interface DeleteFileEntry {
    /**
     * The full path of the file to be deleted, including the name of the file.
     */
    filePath: Path;
  }
  export interface DeleteFileInput {
    /**
     * The name of the repository that contains the file to delete.
     */
    repositoryName: RepositoryName;
    /**
     * The name of the branch where the commit that deletes the file is made.
     */
    branchName: BranchName;
    /**
     * The fully qualified path to the file that to be deleted, including the full name and extension of that file. For example, /examples/file.md is a fully qualified path to a file named file.md in a folder named examples.
     */
    filePath: Path;
    /**
     * The ID of the commit that is the tip of the branch where you want to create the commit that deletes the file. This must be the HEAD commit for the branch. The commit that deletes the file is created from this commit ID.
     */
    parentCommitId: CommitId;
    /**
     * If a file is the only object in the folder or directory, specifies whether to delete the folder or directory that contains the file. By default, empty folders are deleted. This includes empty folders that are part of the directory structure. For example, if the path to a file is dir1/dir2/dir3/dir4, and dir2 and dir3 are empty, deleting the last file in dir4 also deletes the empty folders dir4, dir3, and dir2.
     */
    keepEmptyFolders?: KeepEmptyFolders;
    /**
     * The commit message you want to include as part of deleting the file. Commit messages are limited to 256 KB. If no message is specified, a default message is used.
     */
    commitMessage?: Message;
    /**
     * The name of the author of the commit that deletes the file. If no name is specified, the user's ARN is used as the author name and committer name.
     */
    name?: Name;
    /**
     * The email address for the commit that deletes the file. If no email address is specified, the email address is left blank.
     */
    email?: Email;
  }
  export interface DeleteFileOutput {
    /**
     * The full commit ID of the commit that contains the change that deletes the file.
     */
    commitId: ObjectId;
    /**
     * The blob ID removed from the tree as part of deleting the file.
     */
    blobId: ObjectId;
    /**
     * The full SHA-1 pointer of the tree information for the commit that contains the delete file change.
     */
    treeId: ObjectId;
    /**
     * The fully qualified path to the file to be deleted, including the full name and extension of that file.
     */
    filePath: Path;
  }
  export interface DeletePullRequestApprovalRuleInput {
    /**
     * The system-generated ID of the pull request that contains the approval rule you want to delete.
     */
    pullRequestId: PullRequestId;
    /**
     * The name of the approval rule you want to delete.
     */
    approvalRuleName: ApprovalRuleName;
  }
  export interface DeletePullRequestApprovalRuleOutput {
    /**
     * The ID of the deleted approval rule.   If the approval rule was deleted in an earlier API call, the response is 200 OK without content. 
     */
    approvalRuleId: ApprovalRuleId;
  }
  export interface DeleteRepositoryInput {
    /**
     * The name of the repository to delete.
     */
    repositoryName: RepositoryName;
  }
  export interface DeleteRepositoryOutput {
    /**
     * The ID of the repository that was deleted.
     */
    repositoryId?: RepositoryId;
  }
  export interface DescribeMergeConflictsInput {
    /**
     * The name of the repository where you want to get information about a merge conflict.
     */
    repositoryName: RepositoryName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    destinationCommitSpecifier: CommitName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    sourceCommitSpecifier: CommitName;
    /**
     * The merge option or strategy you want to use to merge the code.
     */
    mergeOption: MergeOptionTypeEnum;
    /**
     * The maximum number of merge hunks to include in the output.
     */
    maxMergeHunks?: MaxResults;
    /**
     * The path of the target files used to describe the conflicts. 
     */
    filePath: Path;
    /**
     * The level of conflict detail to use. If unspecified, the default FILE_LEVEL is used, which returns a not-mergeable result if the same file has differences in both branches. If LINE_LEVEL is specified, a conflict is considered not mergeable if the same file in both branches has differences on the same line.
     */
    conflictDetailLevel?: ConflictDetailLevelTypeEnum;
    /**
     * Specifies which branch to use when resolving conflicts, or whether to attempt automatically merging two versions of a file. The default is NONE, which requires any conflicts to be resolved manually before the merge operation is successful.
     */
    conflictResolutionStrategy?: ConflictResolutionStrategyTypeEnum;
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results.
     */
    nextToken?: NextToken;
  }
  export interface DescribeMergeConflictsOutput {
    /**
     * Contains metadata about the conflicts found in the merge.
     */
    conflictMetadata: ConflictMetadata;
    /**
     * A list of merge hunks of the differences between the files or lines.
     */
    mergeHunks: MergeHunks;
    /**
     * An enumeration token that can be used in a request to return the next batch of the results.
     */
    nextToken?: NextToken;
    /**
     * The commit ID of the destination commit specifier that was used in the merge evaluation.
     */
    destinationCommitId: ObjectId;
    /**
     * The commit ID of the source commit specifier that was used in the merge evaluation.
     */
    sourceCommitId: ObjectId;
    /**
     * The commit ID of the merge base.
     */
    baseCommitId?: ObjectId;
  }
  export interface DescribePullRequestEventsInput {
    /**
     * The system-generated ID of the pull request. To get this ID, use ListPullRequests.
     */
    pullRequestId: PullRequestId;
    /**
     * Optional. The pull request event type about which you want to return information.
     */
    pullRequestEventType?: PullRequestEventType;
    /**
     * The Amazon Resource Name (ARN) of the user whose actions resulted in the event. Examples include updating the pull request with more commits or changing the status of a pull request.
     */
    actorArn?: Arn;
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results.
     */
    nextToken?: NextToken;
    /**
     * A non-zero, non-negative integer used to limit the number of returned results. The default is 100 events, which is also the maximum number of events that can be returned in a result.
     */
    maxResults?: MaxResults;
  }
  export interface DescribePullRequestEventsOutput {
    /**
     * Information about the pull request events.
     */
    pullRequestEvents: PullRequestEventList;
    /**
     * An enumeration token that can be used in a request to return the next batch of the results.
     */
    nextToken?: NextToken;
  }
  export type Description = string;
  export interface Difference {
    /**
     * Information about a beforeBlob data type object, including the ID, the file mode permission code, and the path.
     */
    beforeBlob?: BlobMetadata;
    /**
     * Information about an afterBlob data type object, including the ID, the file mode permission code, and the path.
     */
    afterBlob?: BlobMetadata;
    /**
     * Whether the change type of the difference is an addition (A), deletion (D), or modification (M).
     */
    changeType?: ChangeTypeEnum;
  }
  export type DifferenceList = Difference[];
  export interface DisassociateApprovalRuleTemplateFromRepositoryInput {
    /**
     * The name of the approval rule template to disassociate from a specified repository.
     */
    approvalRuleTemplateName: ApprovalRuleTemplateName;
    /**
     * The name of the repository you want to disassociate from the template.
     */
    repositoryName: RepositoryName;
  }
  export type Email = string;
  export type ErrorCode = string;
  export type ErrorMessage = string;
  export interface EvaluatePullRequestApprovalRulesInput {
    /**
     * The system-generated ID of the pull request you want to evaluate.
     */
    pullRequestId: PullRequestId;
    /**
     * The system-generated ID for the pull request revision. To retrieve the most recent revision ID for a pull request, use GetPullRequest.
     */
    revisionId: RevisionId;
  }
  export interface EvaluatePullRequestApprovalRulesOutput {
    /**
     * The result of the evaluation, including the names of the rules whose conditions have been met (if any), the names of the rules whose conditions have not been met (if any), whether the pull request is in the approved state, and whether the pull request approval rule has been set aside by an override. 
     */
    evaluation: Evaluation;
  }
  export interface Evaluation {
    /**
     * Whether the state of the pull request is approved.
     */
    approved?: Approved;
    /**
     * Whether the approval rule requirements for the pull request have been overridden and no longer need to be met.
     */
    overridden?: Overridden;
    /**
     * The names of the approval rules that have had their conditions met.
     */
    approvalRulesSatisfied?: ApprovalRulesSatisfiedList;
    /**
     * The names of the approval rules that have not had their conditions met.
     */
    approvalRulesNotSatisfied?: ApprovalRulesNotSatisfiedList;
  }
  export type EventDate = Date;
  export type ExceptionName = string;
  export interface File {
    /**
     * The blob ID that contains the file information.
     */
    blobId?: ObjectId;
    /**
     * The fully qualified path to the file in the repository.
     */
    absolutePath?: Path;
    /**
     * The relative path of the file from the folder where the query originated.
     */
    relativePath?: Path;
    /**
     * The extrapolated file mode permissions for the file. Valid values include EXECUTABLE and NORMAL.
     */
    fileMode?: FileModeTypeEnum;
  }
  export type FileContent = Buffer|Uint8Array|Blob|string;
  export type FileList = File[];
  export interface FileMetadata {
    /**
     * The full path to the file to be added or updated, including the name of the file.
     */
    absolutePath?: Path;
    /**
     * The blob ID that contains the file information.
     */
    blobId?: ObjectId;
    /**
     * The extrapolated file mode permissions for the file. Valid values include EXECUTABLE and NORMAL.
     */
    fileMode?: FileModeTypeEnum;
  }
  export type FileModeTypeEnum = "EXECUTABLE"|"NORMAL"|"SYMLINK"|string;
  export interface FileModes {
    /**
     * The file mode of a file in the source of a merge or pull request.
     */
    source?: FileModeTypeEnum;
    /**
     * The file mode of a file in the destination of a merge or pull request.
     */
    destination?: FileModeTypeEnum;
    /**
     * The file mode of a file in the base of a merge or pull request.
     */
    base?: FileModeTypeEnum;
  }
  export type FilePaths = Path[];
  export type FileSize = number;
  export interface FileSizes {
    /**
     * The size of a file in the source of a merge or pull request.
     */
    source?: FileSize;
    /**
     * The size of a file in the destination of a merge or pull request.
     */
    destination?: FileSize;
    /**
     * The size of a file in the base of a merge or pull request.
     */
    base?: FileSize;
  }
  export type FilesMetadata = FileMetadata[];
  export interface Folder {
    /**
     * The full SHA-1 pointer of the tree information for the commit that contains the folder.
     */
    treeId?: ObjectId;
    /**
     * The fully qualified path of the folder in the repository.
     */
    absolutePath?: Path;
    /**
     * The relative path of the specified folder from the folder where the query originated.
     */
    relativePath?: Path;
  }
  export type FolderList = Folder[];
  export interface GetApprovalRuleTemplateInput {
    /**
     * The name of the approval rule template for which you want to get information.
     */
    approvalRuleTemplateName: ApprovalRuleTemplateName;
  }
  export interface GetApprovalRuleTemplateOutput {
    /**
     * The content and structure of the approval rule template.
     */
    approvalRuleTemplate: ApprovalRuleTemplate;
  }
  export interface GetBlobInput {
    /**
     * The name of the repository that contains the blob.
     */
    repositoryName: RepositoryName;
    /**
     * The ID of the blob, which is its SHA-1 pointer.
     */
    blobId: ObjectId;
  }
  export interface GetBlobOutput {
    /**
     * The content of the blob, usually a file.
     */
    content: blob;
  }
  export interface GetBranchInput {
    /**
     * The name of the repository that contains the branch for which you want to retrieve information.
     */
    repositoryName?: RepositoryName;
    /**
     * The name of the branch for which you want to retrieve information.
     */
    branchName?: BranchName;
  }
  export interface GetBranchOutput {
    /**
     * The name of the branch.
     */
    branch?: BranchInfo;
  }
  export interface GetCommentInput {
    /**
     * The unique, system-generated ID of the comment. To get this ID, use GetCommentsForComparedCommit or GetCommentsForPullRequest.
     */
    commentId: CommentId;
  }
  export interface GetCommentOutput {
    /**
     * The contents of the comment.
     */
    comment?: Comment;
  }
  export interface GetCommentReactionsInput {
    /**
     * The ID of the comment for which you want to get reactions information.
     */
    commentId: CommentId;
    /**
     * Optional. The Amazon Resource Name (ARN) of the user or identity for which you want to get reaction information.
     */
    reactionUserArn?: Arn;
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results. 
     */
    nextToken?: NextToken;
    /**
     * A non-zero, non-negative integer used to limit the number of returned results. The default is the same as the allowed maximum, 1,000.
     */
    maxResults?: MaxResults;
  }
  export interface GetCommentReactionsOutput {
    /**
     * An array of reactions to the specified comment.
     */
    reactionsForComment: ReactionsForCommentList;
    /**
     * An enumeration token that can be used in a request to return the next batch of the results.
     */
    nextToken?: NextToken;
  }
  export interface GetCommentsForComparedCommitInput {
    /**
     * The name of the repository where you want to compare commits.
     */
    repositoryName: RepositoryName;
    /**
     * To establish the directionality of the comparison, the full commit ID of the before commit.
     */
    beforeCommitId?: CommitId;
    /**
     * To establish the directionality of the comparison, the full commit ID of the after commit.
     */
    afterCommitId: CommitId;
    /**
     * An enumeration token that when provided in a request, returns the next batch of the results. 
     */
    nextToken?: NextToken;
    /**
     * A non-zero, non-negative integer used to limit the number of returned results. The default is 100 comments, but you can configure up to 500.
     */
    maxResults?: MaxResults;
  }
  export interface GetCommentsForComparedCommitOutput {
    /**
     * A list of comment objects on the compared commit.
     */
    commentsForComparedCommitData?: CommentsForComparedCommitData;
    /**
     * An enumeration token that can be used in a request to return the next batch of the results.
     */
    nextToken?: NextToken;
  }
  export interface GetCommentsForPullRequestInput {
    /**
     * The system-generated ID of the pull request. To get this ID, use ListPullRequests.
     */
    pullRequestId: PullRequestId;
    /**
     * The name of the repository that contains the pull request.
     */
    repositoryName?: RepositoryName;
    /**
     * The full commit ID of the commit in the destination branch that was the tip of the branch at the time the pull request was created.
     */
    beforeCommitId?: CommitId;
    /**
     * The full commit ID of the commit in the source branch that was the tip of the branch at the time the comment was made.
     */
    afterCommitId?: CommitId;
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results.
     */
    nextToken?: NextToken;
    /**
     * A non-zero, non-negative integer used to limit the number of returned results. The default is 100 comments. You can return up to 500 comments with a single request.
     */
    maxResults?: MaxResults;
  }
  export interface GetCommentsForPullRequestOutput {
    /**
     * An array of comment objects on the pull request.
     */
    commentsForPullRequestData?: CommentsForPullRequestData;
    /**
     * An enumeration token that can be used in a request to return the next batch of the results.
     */
    nextToken?: NextToken;
  }
  export interface GetCommitInput {
    /**
     * The name of the repository to which the commit was made.
     */
    repositoryName: RepositoryName;
    /**
     * The commit ID. Commit IDs are the full SHA ID of the commit.
     */
    commitId: ObjectId;
  }
  export interface GetCommitOutput {
    /**
     * A commit data type object that contains information about the specified commit.
     */
    commit: Commit;
  }
  export interface GetDifferencesInput {
    /**
     * The name of the repository where you want to get differences.
     */
    repositoryName: RepositoryName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, the full commit ID). Optional. If not specified, all changes before the afterCommitSpecifier value are shown. If you do not use beforeCommitSpecifier in your request, consider limiting the results with maxResults.
     */
    beforeCommitSpecifier?: CommitName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit.
     */
    afterCommitSpecifier: CommitName;
    /**
     * The file path in which to check for differences. Limits the results to this path. Can also be used to specify the previous name of a directory or folder. If beforePath and afterPath are not specified, differences are shown for all paths.
     */
    beforePath?: Path;
    /**
     * The file path in which to check differences. Limits the results to this path. Can also be used to specify the changed name of a directory or folder, if it has changed. If not specified, differences are shown for all paths.
     */
    afterPath?: Path;
    /**
     * A non-zero, non-negative integer used to limit the number of returned results.
     */
    MaxResults?: Limit;
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results.
     */
    NextToken?: NextToken;
  }
  export interface GetDifferencesOutput {
    /**
     * A data type object that contains information about the differences, including whether the difference is added, modified, or deleted (A, D, M).
     */
    differences?: DifferenceList;
    /**
     * An enumeration token that can be used in a request to return the next batch of the results.
     */
    NextToken?: NextToken;
  }
  export interface GetFileInput {
    /**
     * The name of the repository that contains the file.
     */
    repositoryName: RepositoryName;
    /**
     * The fully quaified reference that identifies the commit that contains the file. For example, you can specify a full commit ID, a tag, a branch name, or a reference such as refs/heads/master. If none is provided, the head commit is used.
     */
    commitSpecifier?: CommitName;
    /**
     * The fully qualified path to the file, including the full name and extension of the file. For example, /examples/file.md is the fully qualified path to a file named file.md in a folder named examples.
     */
    filePath: Path;
  }
  export interface GetFileOutput {
    /**
     * The full commit ID of the commit that contains the content returned by GetFile.
     */
    commitId: ObjectId;
    /**
     * The blob ID of the object that represents the file content.
     */
    blobId: ObjectId;
    /**
     * The fully qualified path to the specified file. Returns the name and extension of the file.
     */
    filePath: Path;
    /**
     * The extrapolated file mode permissions of the blob. Valid values include strings such as EXECUTABLE and not numeric values.  The file mode permissions returned by this API are not the standard file mode permission values, such as 100644, but rather extrapolated values. See the supported return values. 
     */
    fileMode: FileModeTypeEnum;
    /**
     * The size of the contents of the file, in bytes.
     */
    fileSize: ObjectSize;
    /**
     * The base-64 encoded binary data object that represents the content of the file.
     */
    fileContent: FileContent;
  }
  export interface GetFolderInput {
    /**
     * The name of the repository.
     */
    repositoryName: RepositoryName;
    /**
     * A fully qualified reference used to identify a commit that contains the version of the folder's content to return. A fully qualified reference can be a commit ID, branch name, tag, or reference such as HEAD. If no specifier is provided, the folder content is returned as it exists in the HEAD commit.
     */
    commitSpecifier?: CommitName;
    /**
     * The fully qualified path to the folder whose contents are returned, including the folder name. For example, /examples is a fully-qualified path to a folder named examples that was created off of the root directory (/) of a repository. 
     */
    folderPath: Path;
  }
  export interface GetFolderOutput {
    /**
     * The full commit ID used as a reference for the returned version of the folder content.
     */
    commitId: ObjectId;
    /**
     * The fully qualified path of the folder whose contents are returned.
     */
    folderPath: Path;
    /**
     * The full SHA-1 pointer of the tree information for the commit that contains the folder.
     */
    treeId?: ObjectId;
    /**
     * The list of folders that exist under the specified folder, if any.
     */
    subFolders?: FolderList;
    /**
     * The list of files in the specified folder, if any.
     */
    files?: FileList;
    /**
     * The list of symbolic links to other files and folders in the specified folder, if any.
     */
    symbolicLinks?: SymbolicLinkList;
    /**
     * The list of submodules in the specified folder, if any.
     */
    subModules?: SubModuleList;
  }
  export interface GetMergeCommitInput {
    /**
     * The name of the repository that contains the merge commit about which you want to get information.
     */
    repositoryName: RepositoryName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    sourceCommitSpecifier: CommitName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    destinationCommitSpecifier: CommitName;
    /**
     * The level of conflict detail to use. If unspecified, the default FILE_LEVEL is used, which returns a not-mergeable result if the same file has differences in both branches. If LINE_LEVEL is specified, a conflict is considered not mergeable if the same file in both branches has differences on the same line.
     */
    conflictDetailLevel?: ConflictDetailLevelTypeEnum;
    /**
     * Specifies which branch to use when resolving conflicts, or whether to attempt automatically merging two versions of a file. The default is NONE, which requires any conflicts to be resolved manually before the merge operation is successful.
     */
    conflictResolutionStrategy?: ConflictResolutionStrategyTypeEnum;
  }
  export interface GetMergeCommitOutput {
    /**
     * The commit ID of the source commit specifier that was used in the merge evaluation.
     */
    sourceCommitId?: ObjectId;
    /**
     * The commit ID of the destination commit specifier that was used in the merge evaluation.
     */
    destinationCommitId?: ObjectId;
    /**
     * The commit ID of the merge base.
     */
    baseCommitId?: ObjectId;
    /**
     * The commit ID for the merge commit created when the source branch was merged into the destination branch. If the fast-forward merge strategy was used, there is no merge commit.
     */
    mergedCommitId?: ObjectId;
  }
  export interface GetMergeConflictsInput {
    /**
     * The name of the repository where the pull request was created.
     */
    repositoryName: RepositoryName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    destinationCommitSpecifier: CommitName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    sourceCommitSpecifier: CommitName;
    /**
     * The merge option or strategy you want to use to merge the code. 
     */
    mergeOption: MergeOptionTypeEnum;
    /**
     * The level of conflict detail to use. If unspecified, the default FILE_LEVEL is used, which returns a not-mergeable result if the same file has differences in both branches. If LINE_LEVEL is specified, a conflict is considered not mergeable if the same file in both branches has differences on the same line.
     */
    conflictDetailLevel?: ConflictDetailLevelTypeEnum;
    /**
     * The maximum number of files to include in the output.
     */
    maxConflictFiles?: MaxResults;
    /**
     * Specifies which branch to use when resolving conflicts, or whether to attempt automatically merging two versions of a file. The default is NONE, which requires any conflicts to be resolved manually before the merge operation is successful.
     */
    conflictResolutionStrategy?: ConflictResolutionStrategyTypeEnum;
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results.
     */
    nextToken?: NextToken;
  }
  export interface GetMergeConflictsOutput {
    /**
     * A Boolean value that indicates whether the code is mergeable by the specified merge option.
     */
    mergeable: IsMergeable;
    /**
     * The commit ID of the destination commit specifier that was used in the merge evaluation.
     */
    destinationCommitId: ObjectId;
    /**
     * The commit ID of the source commit specifier that was used in the merge evaluation.
     */
    sourceCommitId: ObjectId;
    /**
     * The commit ID of the merge base.
     */
    baseCommitId?: ObjectId;
    /**
     * A list of metadata for any conflicting files. If the specified merge strategy is FAST_FORWARD_MERGE, this list is always empty.
     */
    conflictMetadataList: ConflictMetadataList;
    /**
     * An enumeration token that can be used in a request to return the next batch of the results.
     */
    nextToken?: NextToken;
  }
  export interface GetMergeOptionsInput {
    /**
     * The name of the repository that contains the commits about which you want to get merge options.
     */
    repositoryName: RepositoryName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    sourceCommitSpecifier: CommitName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    destinationCommitSpecifier: CommitName;
    /**
     * The level of conflict detail to use. If unspecified, the default FILE_LEVEL is used, which returns a not-mergeable result if the same file has differences in both branches. If LINE_LEVEL is specified, a conflict is considered not mergeable if the same file in both branches has differences on the same line.
     */
    conflictDetailLevel?: ConflictDetailLevelTypeEnum;
    /**
     * Specifies which branch to use when resolving conflicts, or whether to attempt automatically merging two versions of a file. The default is NONE, which requires any conflicts to be resolved manually before the merge operation is successful.
     */
    conflictResolutionStrategy?: ConflictResolutionStrategyTypeEnum;
  }
  export interface GetMergeOptionsOutput {
    /**
     * The merge option or strategy used to merge the code.
     */
    mergeOptions: MergeOptions;
    /**
     * The commit ID of the source commit specifier that was used in the merge evaluation.
     */
    sourceCommitId: ObjectId;
    /**
     * The commit ID of the destination commit specifier that was used in the merge evaluation.
     */
    destinationCommitId: ObjectId;
    /**
     * The commit ID of the merge base.
     */
    baseCommitId: ObjectId;
  }
  export interface GetPullRequestApprovalStatesInput {
    /**
     * The system-generated ID for the pull request.
     */
    pullRequestId: PullRequestId;
    /**
     * The system-generated ID for the pull request revision.
     */
    revisionId: RevisionId;
  }
  export interface GetPullRequestApprovalStatesOutput {
    /**
     * Information about users who have approved the pull request.
     */
    approvals?: ApprovalList;
  }
  export interface GetPullRequestInput {
    /**
     * The system-generated ID of the pull request. To get this ID, use ListPullRequests.
     */
    pullRequestId: PullRequestId;
  }
  export interface GetPullRequestOutput {
    /**
     * Information about the specified pull request.
     */
    pullRequest: PullRequest;
  }
  export interface GetPullRequestOverrideStateInput {
    /**
     * The ID of the pull request for which you want to get information about whether approval rules have been set aside (overridden).
     */
    pullRequestId: PullRequestId;
    /**
     * The system-generated ID of the revision for the pull request. To retrieve the most recent revision ID, use GetPullRequest.
     */
    revisionId: RevisionId;
  }
  export interface GetPullRequestOverrideStateOutput {
    /**
     * A Boolean value that indicates whether a pull request has had its rules set aside (TRUE) or whether all approval rules still apply (FALSE).
     */
    overridden?: Overridden;
    /**
     * The Amazon Resource Name (ARN) of the user or identity that overrode the rules and their requirements for the pull request.
     */
    overrider?: Arn;
  }
  export interface GetRepositoryInput {
    /**
     * The name of the repository to get information about.
     */
    repositoryName: RepositoryName;
  }
  export interface GetRepositoryOutput {
    /**
     * Information about the repository.
     */
    repositoryMetadata?: RepositoryMetadata;
  }
  export interface GetRepositoryTriggersInput {
    /**
     * The name of the repository for which the trigger is configured.
     */
    repositoryName: RepositoryName;
  }
  export interface GetRepositoryTriggersOutput {
    /**
     * The system-generated unique ID for the trigger.
     */
    configurationId?: RepositoryTriggersConfigurationId;
    /**
     * The JSON block of configuration information for each trigger.
     */
    triggers?: RepositoryTriggersList;
  }
  export type HunkContent = string;
  export interface IsBinaryFile {
    /**
     * The binary or non-binary status of file in the source of a merge or pull request.
     */
    source?: CapitalBoolean;
    /**
     * The binary or non-binary status of a file in the destination of a merge or pull request.
     */
    destination?: CapitalBoolean;
    /**
     * The binary or non-binary status of a file in the base of a merge or pull request.
     */
    base?: CapitalBoolean;
  }
  export type IsCommentDeleted = boolean;
  export type IsContentConflict = boolean;
  export type IsFileModeConflict = boolean;
  export type IsHunkConflict = boolean;
  export type IsMergeable = boolean;
  export type IsMerged = boolean;
  export type IsMove = boolean;
  export type IsObjectTypeConflict = boolean;
  export type KeepEmptyFolders = boolean;
  export type LastModifiedDate = Date;
  export type Limit = number;
  export type LineNumber = number;
  export interface ListApprovalRuleTemplatesInput {
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results.
     */
    nextToken?: NextToken;
    /**
     * A non-zero, non-negative integer used to limit the number of returned results.
     */
    maxResults?: MaxResults;
  }
  export interface ListApprovalRuleTemplatesOutput {
    /**
     * The names of all the approval rule templates found in the AWS Region for your AWS account.
     */
    approvalRuleTemplateNames?: ApprovalRuleTemplateNameList;
    /**
     * An enumeration token that allows the operation to batch the next results of the operation.
     */
    nextToken?: NextToken;
  }
  export interface ListAssociatedApprovalRuleTemplatesForRepositoryInput {
    /**
     * The name of the repository for which you want to list all associated approval rule templates.
     */
    repositoryName: RepositoryName;
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results.
     */
    nextToken?: NextToken;
    /**
     * A non-zero, non-negative integer used to limit the number of returned results.
     */
    maxResults?: MaxResults;
  }
  export interface ListAssociatedApprovalRuleTemplatesForRepositoryOutput {
    /**
     * The names of all approval rule templates associated with the repository.
     */
    approvalRuleTemplateNames?: ApprovalRuleTemplateNameList;
    /**
     * An enumeration token that allows the operation to batch the next results of the operation.
     */
    nextToken?: NextToken;
  }
  export interface ListBranchesInput {
    /**
     * The name of the repository that contains the branches.
     */
    repositoryName: RepositoryName;
    /**
     * An enumeration token that allows the operation to batch the results.
     */
    nextToken?: NextToken;
  }
  export interface ListBranchesOutput {
    /**
     * The list of branch names.
     */
    branches?: BranchNameList;
    /**
     * An enumeration token that returns the batch of the results.
     */
    nextToken?: NextToken;
  }
  export interface ListPullRequestsInput {
    /**
     * The name of the repository for which you want to list pull requests.
     */
    repositoryName: RepositoryName;
    /**
     * Optional. The Amazon Resource Name (ARN) of the user who created the pull request. If used, this filters the results to pull requests created by that user.
     */
    authorArn?: Arn;
    /**
     * Optional. The status of the pull request. If used, this refines the results to the pull requests that match the specified status.
     */
    pullRequestStatus?: PullRequestStatusEnum;
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results.
     */
    nextToken?: NextToken;
    /**
     * A non-zero, non-negative integer used to limit the number of returned results.
     */
    maxResults?: MaxResults;
  }
  export interface ListPullRequestsOutput {
    /**
     * The system-generated IDs of the pull requests.
     */
    pullRequestIds: PullRequestIdList;
    /**
     * An enumeration token that allows the operation to batch the next results of the operation.
     */
    nextToken?: NextToken;
  }
  export interface ListRepositoriesForApprovalRuleTemplateInput {
    /**
     * The name of the approval rule template for which you want to list repositories that are associated with that template.
     */
    approvalRuleTemplateName: ApprovalRuleTemplateName;
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results.
     */
    nextToken?: NextToken;
    /**
     * A non-zero, non-negative integer used to limit the number of returned results.
     */
    maxResults?: MaxResults;
  }
  export interface ListRepositoriesForApprovalRuleTemplateOutput {
    /**
     * A list of repository names that are associated with the specified approval rule template.
     */
    repositoryNames?: RepositoryNameList;
    /**
     * An enumeration token that allows the operation to batch the next results of the operation.
     */
    nextToken?: NextToken;
  }
  export interface ListRepositoriesInput {
    /**
     * An enumeration token that allows the operation to batch the results of the operation. Batch sizes are 1,000 for list repository operations. When the client sends the token back to AWS CodeCommit, another page of 1,000 records is retrieved.
     */
    nextToken?: NextToken;
    /**
     * The criteria used to sort the results of a list repositories operation.
     */
    sortBy?: SortByEnum;
    /**
     * The order in which to sort the results of a list repositories operation.
     */
    order?: OrderEnum;
  }
  export interface ListRepositoriesOutput {
    /**
     * Lists the repositories called by the list repositories operation.
     */
    repositories?: RepositoryNameIdPairList;
    /**
     * An enumeration token that allows the operation to batch the results of the operation. Batch sizes are 1,000 for list repository operations. When the client sends the token back to AWS CodeCommit, another page of 1,000 records is retrieved.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the resource for which you want to get information about tags, if any.
     */
    resourceArn: ResourceArn;
    /**
     * An enumeration token that, when provided in a request, returns the next batch of the results.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceOutput {
    /**
     * A list of tag key and value pairs associated with the specified resource.
     */
    tags?: TagsMap;
    /**
     * An enumeration token that allows the operation to batch the next results of the operation.
     */
    nextToken?: NextToken;
  }
  export interface Location {
    /**
     * The name of the file being compared, including its extension and subdirectory, if any.
     */
    filePath?: Path;
    /**
     * The position of a change in a compared file, in line number format.
     */
    filePosition?: Position;
    /**
     * In a comparison of commits or a pull request, whether the change is in the before or after of that comparison.
     */
    relativeFileVersion?: RelativeFileVersionEnum;
  }
  export type MaxResults = number;
  export interface MergeBranchesByFastForwardInput {
    /**
     * The name of the repository where you want to merge two branches.
     */
    repositoryName: RepositoryName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    sourceCommitSpecifier: CommitName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    destinationCommitSpecifier: CommitName;
    /**
     * The branch where the merge is applied.
     */
    targetBranch?: BranchName;
  }
  export interface MergeBranchesByFastForwardOutput {
    /**
     * The commit ID of the merge in the destination or target branch.
     */
    commitId?: ObjectId;
    /**
     * The tree ID of the merge in the destination or target branch.
     */
    treeId?: ObjectId;
  }
  export interface MergeBranchesBySquashInput {
    /**
     * The name of the repository where you want to merge two branches.
     */
    repositoryName: RepositoryName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    sourceCommitSpecifier: CommitName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    destinationCommitSpecifier: CommitName;
    /**
     * The branch where the merge is applied. 
     */
    targetBranch?: BranchName;
    /**
     * The level of conflict detail to use. If unspecified, the default FILE_LEVEL is used, which returns a not-mergeable result if the same file has differences in both branches. If LINE_LEVEL is specified, a conflict is considered not mergeable if the same file in both branches has differences on the same line.
     */
    conflictDetailLevel?: ConflictDetailLevelTypeEnum;
    /**
     * Specifies which branch to use when resolving conflicts, or whether to attempt automatically merging two versions of a file. The default is NONE, which requires any conflicts to be resolved manually before the merge operation is successful.
     */
    conflictResolutionStrategy?: ConflictResolutionStrategyTypeEnum;
    /**
     * The name of the author who created the commit. This information is used as both the author and committer for the commit.
     */
    authorName?: Name;
    /**
     * The email address of the person merging the branches. This information is used in the commit information for the merge.
     */
    email?: Email;
    /**
     * The commit message for the merge.
     */
    commitMessage?: Message;
    /**
     * If the commit contains deletions, whether to keep a folder or folder structure if the changes leave the folders empty. If this is specified as true, a .gitkeep file is created for empty folders. The default is false.
     */
    keepEmptyFolders?: KeepEmptyFolders;
    /**
     * If AUTOMERGE is the conflict resolution strategy, a list of inputs to use when resolving conflicts during a merge.
     */
    conflictResolution?: ConflictResolution;
  }
  export interface MergeBranchesBySquashOutput {
    /**
     * The commit ID of the merge in the destination or target branch.
     */
    commitId?: ObjectId;
    /**
     * The tree ID of the merge in the destination or target branch.
     */
    treeId?: ObjectId;
  }
  export interface MergeBranchesByThreeWayInput {
    /**
     * The name of the repository where you want to merge two branches.
     */
    repositoryName: RepositoryName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    sourceCommitSpecifier: CommitName;
    /**
     * The branch, tag, HEAD, or other fully qualified reference used to identify a commit (for example, a branch name or a full commit ID).
     */
    destinationCommitSpecifier: CommitName;
    /**
     * The branch where the merge is applied. 
     */
    targetBranch?: BranchName;
    /**
     * The level of conflict detail to use. If unspecified, the default FILE_LEVEL is used, which returns a not-mergeable result if the same file has differences in both branches. If LINE_LEVEL is specified, a conflict is considered not mergeable if the same file in both branches has differences on the same line.
     */
    conflictDetailLevel?: ConflictDetailLevelTypeEnum;
    /**
     * Specifies which branch to use when resolving conflicts, or whether to attempt automatically merging two versions of a file. The default is NONE, which requires any conflicts to be resolved manually before the merge operation is successful.
     */
    conflictResolutionStrategy?: ConflictResolutionStrategyTypeEnum;
    /**
     * The name of the author who created the commit. This information is used as both the author and committer for the commit.
     */
    authorName?: Name;
    /**
     * The email address of the person merging the branches. This information is used in the commit information for the merge.
     */
    email?: Email;
    /**
     * The commit message to include in the commit information for the merge.
     */
    commitMessage?: Message;
    /**
     * If the commit contains deletions, whether to keep a folder or folder structure if the changes leave the folders empty. If true, a .gitkeep file is created for empty folders. The default is false.
     */
    keepEmptyFolders?: KeepEmptyFolders;
    /**
     * If AUTOMERGE is the conflict resolution strategy, a list of inputs to use when resolving conflicts during a merge.
     */
    conflictResolution?: ConflictResolution;
  }
  export interface MergeBranchesByThreeWayOutput {
    /**
     * The commit ID of the merge in the destination or target branch.
     */
    commitId?: ObjectId;
    /**
     * The tree ID of the merge in the destination or target branch.
     */
    treeId?: ObjectId;
  }
  export interface MergeHunk {
    /**
     * A Boolean value indicating whether a combination of hunks contains a conflict. Conflicts occur when the same file or the same lines in a file were modified in both the source and destination of a merge or pull request. Valid values include true, false, and null. True when the hunk represents a conflict and one or more files contains a line conflict. File mode conflicts in a merge do not set this to true.
     */
    isConflict?: IsHunkConflict;
    /**
     * Information about the merge hunk in the source of a merge or pull request.
     */
    source?: MergeHunkDetail;
    /**
     * Information about the merge hunk in the destination of a merge or pull request.
     */
    destination?: MergeHunkDetail;
    /**
     * Information about the merge hunk in the base of a merge or pull request.
     */
    base?: MergeHunkDetail;
  }
  export interface MergeHunkDetail {
    /**
     * The start position of the hunk in the merge result.
     */
    startLine?: LineNumber;
    /**
     * The end position of the hunk in the merge result.
     */
    endLine?: LineNumber;
    /**
     * The base-64 encoded content of the hunk merged region that might contain a conflict.
     */
    hunkContent?: HunkContent;
  }
  export type MergeHunks = MergeHunk[];
  export interface MergeMetadata {
    /**
     * A Boolean value indicating whether the merge has been made.
     */
    isMerged?: IsMerged;
    /**
     * The Amazon Resource Name (ARN) of the user who merged the branches.
     */
    mergedBy?: Arn;
    /**
     * The commit ID for the merge commit, if any.
     */
    mergeCommitId?: CommitId;
    /**
     * The merge strategy used in the merge.
     */
    mergeOption?: MergeOptionTypeEnum;
  }
  export interface MergeOperations {
    /**
     * The operation (add, modify, or delete) on a file in the source of a merge or pull request.
     */
    source?: ChangeTypeEnum;
    /**
     * The operation on a file in the destination of a merge or pull request.
     */
    destination?: ChangeTypeEnum;
  }
  export type MergeOptionTypeEnum = "FAST_FORWARD_MERGE"|"SQUASH_MERGE"|"THREE_WAY_MERGE"|string;
  export type MergeOptions = MergeOptionTypeEnum[];
  export interface MergePullRequestByFastForwardInput {
    /**
     * The system-generated ID of the pull request. To get this ID, use ListPullRequests.
     */
    pullRequestId: PullRequestId;
    /**
     * The name of the repository where the pull request was created.
     */
    repositoryName: RepositoryName;
    /**
     * The full commit ID of the original or updated commit in the pull request source branch. Pass this value if you want an exception thrown if the current commit ID of the tip of the source branch does not match this commit ID.
     */
    sourceCommitId?: ObjectId;
  }
  export interface MergePullRequestByFastForwardOutput {
    /**
     * Information about the specified pull request, including the merge.
     */
    pullRequest?: PullRequest;
  }
  export interface MergePullRequestBySquashInput {
    /**
     * The system-generated ID of the pull request. To get this ID, use ListPullRequests.
     */
    pullRequestId: PullRequestId;
    /**
     * The name of the repository where the pull request was created.
     */
    repositoryName: RepositoryName;
    /**
     * The full commit ID of the original or updated commit in the pull request source branch. Pass this value if you want an exception thrown if the current commit ID of the tip of the source branch does not match this commit ID.
     */
    sourceCommitId?: ObjectId;
    /**
     * The level of conflict detail to use. If unspecified, the default FILE_LEVEL is used, which returns a not-mergeable result if the same file has differences in both branches. If LINE_LEVEL is specified, a conflict is considered not mergeable if the same file in both branches has differences on the same line.
     */
    conflictDetailLevel?: ConflictDetailLevelTypeEnum;
    /**
     * Specifies which branch to use when resolving conflicts, or whether to attempt automatically merging two versions of a file. The default is NONE, which requires any conflicts to be resolved manually before the merge operation is successful.
     */
    conflictResolutionStrategy?: ConflictResolutionStrategyTypeEnum;
    /**
     * The commit message to include in the commit information for the merge.
     */
    commitMessage?: Message;
    /**
     * The name of the author who created the commit. This information is used as both the author and committer for the commit.
     */
    authorName?: Name;
    /**
     * The email address of the person merging the branches. This information is used in the commit information for the merge.
     */
    email?: Email;
    /**
     * If the commit contains deletions, whether to keep a folder or folder structure if the changes leave the folders empty. If true, a .gitkeep file is created for empty folders. The default is false.
     */
    keepEmptyFolders?: KeepEmptyFolders;
    /**
     * If AUTOMERGE is the conflict resolution strategy, a list of inputs to use when resolving conflicts during a merge.
     */
    conflictResolution?: ConflictResolution;
  }
  export interface MergePullRequestBySquashOutput {
    pullRequest?: PullRequest;
  }
  export interface MergePullRequestByThreeWayInput {
    /**
     * The system-generated ID of the pull request. To get this ID, use ListPullRequests.
     */
    pullRequestId: PullRequestId;
    /**
     * The name of the repository where the pull request was created.
     */
    repositoryName: RepositoryName;
    /**
     * The full commit ID of the original or updated commit in the pull request source branch. Pass this value if you want an exception thrown if the current commit ID of the tip of the source branch does not match this commit ID.
     */
    sourceCommitId?: ObjectId;
    /**
     * The level of conflict detail to use. If unspecified, the default FILE_LEVEL is used, which returns a not-mergeable result if the same file has differences in both branches. If LINE_LEVEL is specified, a conflict is considered not mergeable if the same file in both branches has differences on the same line.
     */
    conflictDetailLevel?: ConflictDetailLevelTypeEnum;
    /**
     * Specifies which branch to use when resolving conflicts, or whether to attempt automatically merging two versions of a file. The default is NONE, which requires any conflicts to be resolved manually before the merge operation is successful.
     */
    conflictResolutionStrategy?: ConflictResolutionStrategyTypeEnum;
    /**
     * The commit message to include in the commit information for the merge.
     */
    commitMessage?: Message;
    /**
     * The name of the author who created the commit. This information is used as both the author and committer for the commit.
     */
    authorName?: Name;
    /**
     * The email address of the person merging the branches. This information is used in the commit information for the merge.
     */
    email?: Email;
    /**
     * If the commit contains deletions, whether to keep a folder or folder structure if the changes leave the folders empty. If true, a .gitkeep file is created for empty folders. The default is false.
     */
    keepEmptyFolders?: KeepEmptyFolders;
    /**
     * If AUTOMERGE is the conflict resolution strategy, a list of inputs to use when resolving conflicts during a merge.
     */
    conflictResolution?: ConflictResolution;
  }
  export interface MergePullRequestByThreeWayOutput {
    pullRequest?: PullRequest;
  }
  export type Message = string;
  export type Mode = string;
  export type Name = string;
  export type NextToken = string;
  export type NumberOfConflicts = number;
  export type ObjectId = string;
  export type ObjectSize = number;
  export type ObjectTypeEnum = "FILE"|"DIRECTORY"|"GIT_LINK"|"SYMBOLIC_LINK"|string;
  export interface ObjectTypes {
    /**
     * The type of the object in the source branch.
     */
    source?: ObjectTypeEnum;
    /**
     * The type of the object in the destination branch.
     */
    destination?: ObjectTypeEnum;
    /**
     * The type of the object in the base commit of the merge.
     */
    base?: ObjectTypeEnum;
  }
  export type OrderEnum = "ascending"|"descending"|string;
  export interface OriginApprovalRuleTemplate {
    /**
     * The ID of the template that created the approval rule.
     */
    approvalRuleTemplateId?: ApprovalRuleTemplateId;
    /**
     * The name of the template that created the approval rule.
     */
    approvalRuleTemplateName?: ApprovalRuleTemplateName;
  }
  export type Overridden = boolean;
  export interface OverridePullRequestApprovalRulesInput {
    /**
     * The system-generated ID of the pull request for which you want to override all approval rule requirements. To get this information, use GetPullRequest.
     */
    pullRequestId: PullRequestId;
    /**
     * The system-generated ID of the most recent revision of the pull request. You cannot override approval rules for anything but the most recent revision of a pull request. To get the revision ID, use GetPullRequest.
     */
    revisionId: RevisionId;
    /**
     * Whether you want to set aside approval rule requirements for the pull request (OVERRIDE) or revoke a previous override and apply approval rule requirements (REVOKE). REVOKE status is not stored.
     */
    overrideStatus: OverrideStatus;
  }
  export type OverrideStatus = "OVERRIDE"|"REVOKE"|string;
  export type ParentList = ObjectId[];
  export type Path = string;
  export type Position = number;
  export interface PostCommentForComparedCommitInput {
    /**
     * The name of the repository where you want to post a comment on the comparison between commits.
     */
    repositoryName: RepositoryName;
    /**
     * To establish the directionality of the comparison, the full commit ID of the before commit. Required for commenting on any commit unless that commit is the initial commit.
     */
    beforeCommitId?: CommitId;
    /**
     * To establish the directionality of the comparison, the full commit ID of the after commit.
     */
    afterCommitId: CommitId;
    /**
     * The location of the comparison where you want to comment.
     */
    location?: Location;
    /**
     * The content of the comment you want to make.
     */
    content: Content;
    /**
     * A unique, client-generated idempotency token that, when provided in a request, ensures the request cannot be repeated with a changed parameter. If a request is received with the same parameters and a token is included, the request returns information about the initial request that used that token.
     */
    clientRequestToken?: ClientRequestToken;
  }
  export interface PostCommentForComparedCommitOutput {
    /**
     * The name of the repository where you posted a comment on the comparison between commits.
     */
    repositoryName?: RepositoryName;
    /**
     * In the directionality you established, the full commit ID of the before commit.
     */
    beforeCommitId?: CommitId;
    /**
     * In the directionality you established, the full commit ID of the after commit.
     */
    afterCommitId?: CommitId;
    /**
     * In the directionality you established, the blob ID of the before blob.
     */
    beforeBlobId?: ObjectId;
    /**
     * In the directionality you established, the blob ID of the after blob.
     */
    afterBlobId?: ObjectId;
    /**
     * The location of the comment in the comparison between the two commits.
     */
    location?: Location;
    /**
     * The content of the comment you posted.
     */
    comment?: Comment;
  }
  export interface PostCommentForPullRequestInput {
    /**
     * The system-generated ID of the pull request. To get this ID, use ListPullRequests.
     */
    pullRequestId: PullRequestId;
    /**
     * The name of the repository where you want to post a comment on a pull request.
     */
    repositoryName: RepositoryName;
    /**
     * The full commit ID of the commit in the destination branch that was the tip of the branch at the time the pull request was created.
     */
    beforeCommitId: CommitId;
    /**
     * The full commit ID of the commit in the source branch that is the current tip of the branch for the pull request when you post the comment.
     */
    afterCommitId: CommitId;
    /**
     * The location of the change where you want to post your comment. If no location is provided, the comment is posted as a general comment on the pull request difference between the before commit ID and the after commit ID.
     */
    location?: Location;
    /**
     * The content of your comment on the change.
     */
    content: Content;
    /**
     * A unique, client-generated idempotency token that, when provided in a request, ensures the request cannot be repeated with a changed parameter. If a request is received with the same parameters and a token is included, the request returns information about the initial request that used that token.
     */
    clientRequestToken?: ClientRequestToken;
  }
  export interface PostCommentForPullRequestOutput {
    /**
     * The name of the repository where you posted a comment on a pull request.
     */
    repositoryName?: RepositoryName;
    /**
     * The system-generated ID of the pull request. 
     */
    pullRequestId?: PullRequestId;
    /**
     * The full commit ID of the commit in the source branch used to create the pull request, or in the case of an updated pull request, the full commit ID of the commit used to update the pull request.
     */
    beforeCommitId?: CommitId;
    /**
     * The full commit ID of the commit in the destination branch where the pull request is merged.
     */
    afterCommitId?: CommitId;
    /**
     * In the directionality of the pull request, the blob ID of the before blob.
     */
    beforeBlobId?: ObjectId;
    /**
     * In the directionality of the pull request, the blob ID of the after blob.
     */
    afterBlobId?: ObjectId;
    /**
     * The location of the change where you posted your comment.
     */
    location?: Location;
    /**
     * The content of the comment you posted.
     */
    comment?: Comment;
  }
  export interface PostCommentReplyInput {
    /**
     * The system-generated ID of the comment to which you want to reply. To get this ID, use GetCommentsForComparedCommit or GetCommentsForPullRequest.
     */
    inReplyTo: CommentId;
    /**
     * A unique, client-generated idempotency token that, when provided in a request, ensures the request cannot be repeated with a changed parameter. If a request is received with the same parameters and a token is included, the request returns information about the initial request that used that token.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * The contents of your reply to a comment.
     */
    content: Content;
  }
  export interface PostCommentReplyOutput {
    /**
     * Information about the reply to a comment.
     */
    comment?: Comment;
  }
  export interface PullRequest {
    /**
     * The system-generated ID of the pull request. 
     */
    pullRequestId?: PullRequestId;
    /**
     * The user-defined title of the pull request. This title is displayed in the list of pull requests to other repository users.
     */
    title?: Title;
    /**
     * The user-defined description of the pull request. This description can be used to clarify what should be reviewed and other details of the request.
     */
    description?: Description;
    /**
     * The day and time of the last user or system activity on the pull request, in timestamp format.
     */
    lastActivityDate?: LastModifiedDate;
    /**
     * The date and time the pull request was originally created, in timestamp format.
     */
    creationDate?: CreationDate;
    /**
     * The status of the pull request. Pull request status can only change from OPEN to CLOSED.
     */
    pullRequestStatus?: PullRequestStatusEnum;
    /**
     * The Amazon Resource Name (ARN) of the user who created the pull request.
     */
    authorArn?: Arn;
    /**
     * The targets of the pull request, including the source branch and destination branch for the pull request.
     */
    pullRequestTargets?: PullRequestTargetList;
    /**
     * A unique, client-generated idempotency token that, when provided in a request, ensures the request cannot be repeated with a changed parameter. If a request is received with the same parameters and a token is included, the request returns information about the initial request that used that token.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * The system-generated revision ID for the pull request.
     */
    revisionId?: RevisionId;
    /**
     * The approval rules applied to the pull request.
     */
    approvalRules?: ApprovalRulesList;
  }
  export interface PullRequestCreatedEventMetadata {
    /**
     * The name of the repository where the pull request was created.
     */
    repositoryName?: RepositoryName;
    /**
     * The commit ID on the source branch used when the pull request was created.
     */
    sourceCommitId?: CommitId;
    /**
     * The commit ID of the tip of the branch specified as the destination branch when the pull request was created.
     */
    destinationCommitId?: CommitId;
    /**
     * The commit ID of the most recent commit that the source branch and the destination branch have in common.
     */
    mergeBase?: CommitId;
  }
  export interface PullRequestEvent {
    /**
     * The system-generated ID of the pull request.
     */
    pullRequestId?: PullRequestId;
    /**
     * The day and time of the pull request event, in timestamp format.
     */
    eventDate?: EventDate;
    /**
     * The type of the pull request event (for example, a status change event (PULL_REQUEST_STATUS_CHANGED) or update event (PULL_REQUEST_SOURCE_REFERENCE_UPDATED)).
     */
    pullRequestEventType?: PullRequestEventType;
    /**
     * The Amazon Resource Name (ARN) of the user whose actions resulted in the event. Examples include updating the pull request with more commits or changing the status of a pull request.
     */
    actorArn?: Arn;
    /**
     * Information about the source and destination branches for the pull request.
     */
    pullRequestCreatedEventMetadata?: PullRequestCreatedEventMetadata;
    /**
     * Information about the change in status for the pull request event.
     */
    pullRequestStatusChangedEventMetadata?: PullRequestStatusChangedEventMetadata;
    /**
     * Information about the updated source branch for the pull request event. 
     */
    pullRequestSourceReferenceUpdatedEventMetadata?: PullRequestSourceReferenceUpdatedEventMetadata;
    /**
     * Information about the change in mergability state for the pull request event.
     */
    pullRequestMergedStateChangedEventMetadata?: PullRequestMergedStateChangedEventMetadata;
    /**
     * Information about a pull request event.
     */
    approvalRuleEventMetadata?: ApprovalRuleEventMetadata;
    /**
     * Information about an approval state change for a pull request.
     */
    approvalStateChangedEventMetadata?: ApprovalStateChangedEventMetadata;
    /**
     * Information about an approval rule override event for a pull request.
     */
    approvalRuleOverriddenEventMetadata?: ApprovalRuleOverriddenEventMetadata;
  }
  export type PullRequestEventList = PullRequestEvent[];
  export type PullRequestEventType = "PULL_REQUEST_CREATED"|"PULL_REQUEST_STATUS_CHANGED"|"PULL_REQUEST_SOURCE_REFERENCE_UPDATED"|"PULL_REQUEST_MERGE_STATE_CHANGED"|"PULL_REQUEST_APPROVAL_RULE_CREATED"|"PULL_REQUEST_APPROVAL_RULE_UPDATED"|"PULL_REQUEST_APPROVAL_RULE_DELETED"|"PULL_REQUEST_APPROVAL_RULE_OVERRIDDEN"|"PULL_REQUEST_APPROVAL_STATE_CHANGED"|string;
  export type PullRequestId = string;
  export type PullRequestIdList = PullRequestId[];
  export interface PullRequestMergedStateChangedEventMetadata {
    /**
     * The name of the repository where the pull request was created.
     */
    repositoryName?: RepositoryName;
    /**
     * The name of the branch that the pull request is merged into.
     */
    destinationReference?: ReferenceName;
    /**
     * Information about the merge state change event.
     */
    mergeMetadata?: MergeMetadata;
  }
  export interface PullRequestSourceReferenceUpdatedEventMetadata {
    /**
     * The name of the repository where the pull request was updated.
     */
    repositoryName?: RepositoryName;
    /**
     * The full commit ID of the commit in the destination branch that was the tip of the branch at the time the pull request was updated.
     */
    beforeCommitId?: CommitId;
    /**
     * The full commit ID of the commit in the source branch that was the tip of the branch at the time the pull request was updated.
     */
    afterCommitId?: CommitId;
    /**
     * The commit ID of the most recent commit that the source branch and the destination branch have in common.
     */
    mergeBase?: CommitId;
  }
  export interface PullRequestStatusChangedEventMetadata {
    /**
     * The changed status of the pull request.
     */
    pullRequestStatus?: PullRequestStatusEnum;
  }
  export type PullRequestStatusEnum = "OPEN"|"CLOSED"|string;
  export interface PullRequestTarget {
    /**
     * The name of the repository that contains the pull request source and destination branches.
     */
    repositoryName?: RepositoryName;
    /**
     * The branch of the repository that contains the changes for the pull request. Also known as the source branch.
     */
    sourceReference?: ReferenceName;
    /**
     * The branch of the repository where the pull request changes are merged. Also known as the destination branch. 
     */
    destinationReference?: ReferenceName;
    /**
     * The full commit ID that is the tip of the destination branch. This is the commit where the pull request was or will be merged.
     */
    destinationCommit?: CommitId;
    /**
     * The full commit ID of the tip of the source branch used to create the pull request. If the pull request branch is updated by a push while the pull request is open, the commit ID changes to reflect the new tip of the branch.
     */
    sourceCommit?: CommitId;
    /**
     * The commit ID of the most recent commit that the source branch and the destination branch have in common.
     */
    mergeBase?: CommitId;
    /**
     * Returns metadata about the state of the merge, including whether the merge has been made.
     */
    mergeMetadata?: MergeMetadata;
  }
  export type PullRequestTargetList = PullRequestTarget[];
  export interface PutCommentReactionInput {
    /**
     * The ID of the comment to which you want to add or update a reaction.
     */
    commentId: CommentId;
    /**
     * The emoji reaction you want to add or update. To remove a reaction, provide a value of blank or null. You can also provide the value of none. For information about emoji reaction values supported in AWS CodeCommit, see the AWS CodeCommit User Guide.
     */
    reactionValue: ReactionValue;
  }
  export type PutFileEntries = PutFileEntry[];
  export interface PutFileEntry {
    /**
     * The full path to the file in the repository, including the name of the file.
     */
    filePath: Path;
    /**
     * The extrapolated file mode permissions for the file. Valid values include EXECUTABLE and NORMAL.
     */
    fileMode?: FileModeTypeEnum;
    /**
     * The content of the file, if a source file is not specified.
     */
    fileContent?: FileContent;
    /**
     * The name and full path of the file that contains the changes you want to make as part of the commit, if you are not providing the file content directly.
     */
    sourceFile?: SourceFileSpecifier;
  }
  export interface PutFileInput {
    /**
     * The name of the repository where you want to add or update the file.
     */
    repositoryName: RepositoryName;
    /**
     * The name of the branch where you want to add or update the file. If this is an empty repository, this branch is created.
     */
    branchName: BranchName;
    /**
     * The content of the file, in binary object format. 
     */
    fileContent: FileContent;
    /**
     * The name of the file you want to add or update, including the relative path to the file in the repository.  If the path does not currently exist in the repository, the path is created as part of adding the file. 
     */
    filePath: Path;
    /**
     * The file mode permissions of the blob. Valid file mode permissions are listed here.
     */
    fileMode?: FileModeTypeEnum;
    /**
     * The full commit ID of the head commit in the branch where you want to add or update the file. If this is an empty repository, no commit ID is required. If this is not an empty repository, a commit ID is required.  The commit ID must match the ID of the head commit at the time of the operation. Otherwise, an error occurs, and the file is not added or updated.
     */
    parentCommitId?: CommitId;
    /**
     * A message about why this file was added or updated. Although it is optional, a message makes the commit history for your repository more useful.
     */
    commitMessage?: Message;
    /**
     * The name of the person adding or updating the file. Although it is optional, a name makes the commit history for your repository more useful.
     */
    name?: Name;
    /**
     * An email address for the person adding or updating the file.
     */
    email?: Email;
  }
  export interface PutFileOutput {
    /**
     * The full SHA ID of the commit that contains this file change.
     */
    commitId: ObjectId;
    /**
     * The ID of the blob, which is its SHA-1 pointer.
     */
    blobId: ObjectId;
    /**
     * The full SHA-1 pointer of the tree information for the commit that contains this file change.
     */
    treeId: ObjectId;
  }
  export interface PutRepositoryTriggersInput {
    /**
     * The name of the repository where you want to create or update the trigger.
     */
    repositoryName: RepositoryName;
    /**
     * The JSON block of configuration information for each trigger.
     */
    triggers: RepositoryTriggersList;
  }
  export interface PutRepositoryTriggersOutput {
    /**
     * The system-generated unique ID for the create or update operation.
     */
    configurationId?: RepositoryTriggersConfigurationId;
  }
  export type ReactionCountsMap = {[key: string]: Count};
  export type ReactionEmoji = string;
  export interface ReactionForComment {
    /**
     * The reaction for a specified comment.
     */
    reaction?: ReactionValueFormats;
    /**
     * The Amazon Resource Names (ARNs) of users who have provided reactions to the comment.
     */
    reactionUsers?: ReactionUsersList;
    /**
     * A numerical count of users who reacted with the specified emoji whose identities have been subsequently deleted from IAM. While these IAM users or roles no longer exist, the reactions might still appear in total reaction counts.
     */
    reactionsFromDeletedUsersCount?: Count;
  }
  export type ReactionShortCode = string;
  export type ReactionUnicode = string;
  export type ReactionUsersList = Arn[];
  export type ReactionValue = string;
  export interface ReactionValueFormats {
    /**
     * The Emoji Version 1.0 graphic of the reaction. These graphics are interpreted slightly differently on different operating systems.
     */
    emoji?: ReactionEmoji;
    /**
     * The emoji short code for the reaction. Short codes are interpreted slightly differently on different operating systems. 
     */
    shortCode?: ReactionShortCode;
    /**
     * The Unicode codepoint for the reaction.
     */
    unicode?: ReactionUnicode;
  }
  export type ReactionsForCommentList = ReactionForComment[];
  export type ReferenceName = string;
  export type RelativeFileVersionEnum = "BEFORE"|"AFTER"|string;
  export type ReplaceContentEntries = ReplaceContentEntry[];
  export interface ReplaceContentEntry {
    /**
     * The path of the conflicting file.
     */
    filePath: Path;
    /**
     * The replacement type to use when determining how to resolve the conflict.
     */
    replacementType: ReplacementTypeEnum;
    /**
     * The base-64 encoded content to use when the replacement type is USE_NEW_CONTENT.
     */
    content?: FileContent;
    /**
     * The file mode to apply during conflict resoltion.
     */
    fileMode?: FileModeTypeEnum;
  }
  export type ReplacementTypeEnum = "KEEP_BASE"|"KEEP_SOURCE"|"KEEP_DESTINATION"|"USE_NEW_CONTENT"|string;
  export type RepositoryDescription = string;
  export type RepositoryId = string;
  export interface RepositoryMetadata {
    /**
     * The ID of the AWS account associated with the repository.
     */
    accountId?: AccountId;
    /**
     * The ID of the repository.
     */
    repositoryId?: RepositoryId;
    /**
     * The repository's name.
     */
    repositoryName?: RepositoryName;
    /**
     * A comment or description about the repository.
     */
    repositoryDescription?: RepositoryDescription;
    /**
     * The repository's default branch name.
     */
    defaultBranch?: BranchName;
    /**
     * The date and time the repository was last modified, in timestamp format.
     */
    lastModifiedDate?: LastModifiedDate;
    /**
     * The date and time the repository was created, in timestamp format.
     */
    creationDate?: CreationDate;
    /**
     * The URL to use for cloning the repository over HTTPS.
     */
    cloneUrlHttp?: CloneUrlHttp;
    /**
     * The URL to use for cloning the repository over SSH.
     */
    cloneUrlSsh?: CloneUrlSsh;
    /**
     * The Amazon Resource Name (ARN) of the repository.
     */
    Arn?: Arn;
  }
  export type RepositoryMetadataList = RepositoryMetadata[];
  export type RepositoryName = string;
  export interface RepositoryNameIdPair {
    /**
     * The name associated with the repository.
     */
    repositoryName?: RepositoryName;
    /**
     * The ID associated with the repository.
     */
    repositoryId?: RepositoryId;
  }
  export type RepositoryNameIdPairList = RepositoryNameIdPair[];
  export type RepositoryNameList = RepositoryName[];
  export type RepositoryNotFoundList = RepositoryName[];
  export interface RepositoryTrigger {
    /**
     * The name of the trigger.
     */
    name: RepositoryTriggerName;
    /**
     * The ARN of the resource that is the target for a trigger (for example, the ARN of a topic in Amazon SNS).
     */
    destinationArn: Arn;
    /**
     * Any custom data associated with the trigger to be included in the information sent to the target of the trigger.
     */
    customData?: RepositoryTriggerCustomData;
    /**
     * The branches to be included in the trigger configuration. If you specify an empty array, the trigger applies to all branches.  Although no content is required in the array, you must include the array itself. 
     */
    branches?: BranchNameList;
    /**
     * The repository events that cause the trigger to run actions in another service, such as sending a notification through Amazon SNS.   The valid value "all" cannot be used with any other values. 
     */
    events: RepositoryTriggerEventList;
  }
  export type RepositoryTriggerCustomData = string;
  export type RepositoryTriggerEventEnum = "all"|"updateReference"|"createReference"|"deleteReference"|string;
  export type RepositoryTriggerEventList = RepositoryTriggerEventEnum[];
  export interface RepositoryTriggerExecutionFailure {
    /**
     * The name of the trigger that did not run.
     */
    trigger?: RepositoryTriggerName;
    /**
     * Message information about the trigger that did not run.
     */
    failureMessage?: RepositoryTriggerExecutionFailureMessage;
  }
  export type RepositoryTriggerExecutionFailureList = RepositoryTriggerExecutionFailure[];
  export type RepositoryTriggerExecutionFailureMessage = string;
  export type RepositoryTriggerName = string;
  export type RepositoryTriggerNameList = RepositoryTriggerName[];
  export type RepositoryTriggersConfigurationId = string;
  export type RepositoryTriggersList = RepositoryTrigger[];
  export type ResourceArn = string;
  export type RevisionId = string;
  export type RuleContentSha256 = string;
  export type SetFileModeEntries = SetFileModeEntry[];
  export interface SetFileModeEntry {
    /**
     * The full path to the file, including the name of the file.
     */
    filePath: Path;
    /**
     * The file mode for the file.
     */
    fileMode: FileModeTypeEnum;
  }
  export type SortByEnum = "repositoryName"|"lastModifiedDate"|string;
  export interface SourceFileSpecifier {
    /**
     * The full path to the file, including the name of the file.
     */
    filePath: Path;
    /**
     * Whether to remove the source file from the parent commit.
     */
    isMove?: IsMove;
  }
  export interface SubModule {
    /**
     * The commit ID that contains the reference to the submodule.
     */
    commitId?: ObjectId;
    /**
     * The fully qualified path to the folder that contains the reference to the submodule.
     */
    absolutePath?: Path;
    /**
     * The relative path of the submodule from the folder where the query originated.
     */
    relativePath?: Path;
  }
  export type SubModuleList = SubModule[];
  export interface SymbolicLink {
    /**
     * The blob ID that contains the information about the symbolic link.
     */
    blobId?: ObjectId;
    /**
     * The fully qualified path to the folder that contains the symbolic link.
     */
    absolutePath?: Path;
    /**
     * The relative path of the symbolic link from the folder where the query originated.
     */
    relativePath?: Path;
    /**
     * The file mode permissions of the blob that cotains information about the symbolic link.
     */
    fileMode?: FileModeTypeEnum;
  }
  export type SymbolicLinkList = SymbolicLink[];
  export type TagKey = string;
  export type TagKeysList = TagKey[];
  export interface TagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the resource to which you want to add or update tags.
     */
    resourceArn: ResourceArn;
    /**
     * The key-value pair to use when tagging this repository.
     */
    tags: TagsMap;
  }
  export type TagValue = string;
  export type TagsMap = {[key: string]: TagValue};
  export interface Target {
    /**
     * The name of the repository that contains the pull request.
     */
    repositoryName: RepositoryName;
    /**
     * The branch of the repository that contains the changes for the pull request. Also known as the source branch.
     */
    sourceReference: ReferenceName;
    /**
     * The branch of the repository where the pull request changes are merged. Also known as the destination branch.
     */
    destinationReference?: ReferenceName;
  }
  export type TargetList = Target[];
  export interface TestRepositoryTriggersInput {
    /**
     * The name of the repository in which to test the triggers.
     */
    repositoryName: RepositoryName;
    /**
     * The list of triggers to test.
     */
    triggers: RepositoryTriggersList;
  }
  export interface TestRepositoryTriggersOutput {
    /**
     * The list of triggers that were successfully tested. This list provides the names of the triggers that were successfully tested, separated by commas.
     */
    successfulExecutions?: RepositoryTriggerNameList;
    /**
     * The list of triggers that were not tested. This list provides the names of the triggers that could not be tested, separated by commas.
     */
    failedExecutions?: RepositoryTriggerExecutionFailureList;
  }
  export type Title = string;
  export interface UntagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the resource to which you want to remove tags.
     */
    resourceArn: ResourceArn;
    /**
     * The tag key for each tag that you want to remove from the resource.
     */
    tagKeys: TagKeysList;
  }
  export interface UpdateApprovalRuleTemplateContentInput {
    /**
     * The name of the approval rule template where you want to update the content of the rule. 
     */
    approvalRuleTemplateName: ApprovalRuleTemplateName;
    /**
     * The content that replaces the existing content of the rule. Content statements must be complete. You cannot provide only the changes.
     */
    newRuleContent: ApprovalRuleTemplateContent;
    /**
     * The SHA-256 hash signature for the content of the approval rule. You can retrieve this information by using GetPullRequest.
     */
    existingRuleContentSha256?: RuleContentSha256;
  }
  export interface UpdateApprovalRuleTemplateContentOutput {
    approvalRuleTemplate: ApprovalRuleTemplate;
  }
  export interface UpdateApprovalRuleTemplateDescriptionInput {
    /**
     * The name of the template for which you want to update the description.
     */
    approvalRuleTemplateName: ApprovalRuleTemplateName;
    /**
     * The updated description of the approval rule template.
     */
    approvalRuleTemplateDescription: ApprovalRuleTemplateDescription;
  }
  export interface UpdateApprovalRuleTemplateDescriptionOutput {
    /**
     * The structure and content of the updated approval rule template.
     */
    approvalRuleTemplate: ApprovalRuleTemplate;
  }
  export interface UpdateApprovalRuleTemplateNameInput {
    /**
     * The current name of the approval rule template.
     */
    oldApprovalRuleTemplateName: ApprovalRuleTemplateName;
    /**
     * The new name you want to apply to the approval rule template.
     */
    newApprovalRuleTemplateName: ApprovalRuleTemplateName;
  }
  export interface UpdateApprovalRuleTemplateNameOutput {
    /**
     * The structure and content of the updated approval rule template.
     */
    approvalRuleTemplate: ApprovalRuleTemplate;
  }
  export interface UpdateCommentInput {
    /**
     * The system-generated ID of the comment you want to update. To get this ID, use GetCommentsForComparedCommit or GetCommentsForPullRequest.
     */
    commentId: CommentId;
    /**
     * The updated content to replace the existing content of the comment.
     */
    content: Content;
  }
  export interface UpdateCommentOutput {
    /**
     * Information about the updated comment.
     */
    comment?: Comment;
  }
  export interface UpdateDefaultBranchInput {
    /**
     * The name of the repository to set or change the default branch for.
     */
    repositoryName: RepositoryName;
    /**
     * The name of the branch to set as the default.
     */
    defaultBranchName: BranchName;
  }
  export interface UpdatePullRequestApprovalRuleContentInput {
    /**
     * The system-generated ID of the pull request.
     */
    pullRequestId: PullRequestId;
    /**
     * The name of the approval rule you want to update.
     */
    approvalRuleName: ApprovalRuleName;
    /**
     * The SHA-256 hash signature for the content of the approval rule. You can retrieve this information by using GetPullRequest.
     */
    existingRuleContentSha256?: RuleContentSha256;
    /**
     * The updated content for the approval rule.  When you update the content of the approval rule, you can specify approvers in an approval pool in one of two ways:    CodeCommitApprovers: This option only requires an AWS account and a resource. It can be used for both IAM users and federated access users whose name matches the provided resource name. This is a very powerful option that offers a great deal of flexibility. For example, if you specify the AWS account 123456789012 and Mary_Major, all of the following are counted as approvals coming from that user:   An IAM user in the account (arn:aws:iam::123456789012:user/Mary_Major)   A federated user identified in IAM as Mary_Major (arn:aws:sts::123456789012:federated-user/Mary_Major)   This option does not recognize an active session of someone assuming the role of CodeCommitReview with a role session name of Mary_Major (arn:aws:sts::123456789012:assumed-role/CodeCommitReview/Mary_Major) unless you include a wildcard (*Mary_Major).    Fully qualified ARN: This option allows you to specify the fully qualified Amazon Resource Name (ARN) of the IAM user or role.    For more information about IAM ARNs, wildcards, and formats, see IAM Identifiers in the IAM User Guide. 
     */
    newRuleContent: ApprovalRuleContent;
  }
  export interface UpdatePullRequestApprovalRuleContentOutput {
    /**
     * Information about the updated approval rule.
     */
    approvalRule: ApprovalRule;
  }
  export interface UpdatePullRequestApprovalStateInput {
    /**
     * The system-generated ID of the pull request.
     */
    pullRequestId: PullRequestId;
    /**
     * The system-generated ID of the revision.
     */
    revisionId: RevisionId;
    /**
     * The approval state to associate with the user on the pull request.
     */
    approvalState: ApprovalState;
  }
  export interface UpdatePullRequestDescriptionInput {
    /**
     * The system-generated ID of the pull request. To get this ID, use ListPullRequests.
     */
    pullRequestId: PullRequestId;
    /**
     * The updated content of the description for the pull request. This content replaces the existing description.
     */
    description: Description;
  }
  export interface UpdatePullRequestDescriptionOutput {
    /**
     * Information about the updated pull request.
     */
    pullRequest: PullRequest;
  }
  export interface UpdatePullRequestStatusInput {
    /**
     * The system-generated ID of the pull request. To get this ID, use ListPullRequests.
     */
    pullRequestId: PullRequestId;
    /**
     * The status of the pull request. The only valid operations are to update the status from OPEN to OPEN, OPEN to CLOSED or from CLOSED to CLOSED.
     */
    pullRequestStatus: PullRequestStatusEnum;
  }
  export interface UpdatePullRequestStatusOutput {
    /**
     * Information about the pull request.
     */
    pullRequest: PullRequest;
  }
  export interface UpdatePullRequestTitleInput {
    /**
     * The system-generated ID of the pull request. To get this ID, use ListPullRequests.
     */
    pullRequestId: PullRequestId;
    /**
     * The updated title of the pull request. This replaces the existing title.
     */
    title: Title;
  }
  export interface UpdatePullRequestTitleOutput {
    /**
     * Information about the updated pull request.
     */
    pullRequest: PullRequest;
  }
  export interface UpdateRepositoryDescriptionInput {
    /**
     * The name of the repository to set or change the comment or description for.
     */
    repositoryName: RepositoryName;
    /**
     * The new comment or description for the specified repository. Repository descriptions are limited to 1,000 characters.
     */
    repositoryDescription?: RepositoryDescription;
  }
  export interface UpdateRepositoryNameInput {
    /**
     * The current name of the repository.
     */
    oldName: RepositoryName;
    /**
     * The new name for the repository.
     */
    newName: RepositoryName;
  }
  export interface UserInfo {
    /**
     * The name of the user who made the specified commit.
     */
    name?: Name;
    /**
     * The email address associated with the user who made the commit, if any.
     */
    email?: Email;
    /**
     * The date when the specified commit was commited, in timestamp format with GMT offset.
     */
    date?: _Date;
  }
  export type blob = Buffer|Uint8Array|Blob|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2015-04-13"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CodeCommit client.
   */
  export import Types = CodeCommit;
}
export = CodeCommit;
