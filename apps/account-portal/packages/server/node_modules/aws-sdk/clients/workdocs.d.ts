import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class WorkDocs extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: WorkDocs.Types.ClientConfiguration)
  config: Config & WorkDocs.Types.ClientConfiguration;
  /**
   * Aborts the upload of the specified document version that was previously initiated by InitiateDocumentVersionUpload. The client should make this call only when it no longer intends to upload the document version, or fails to do so.
   */
  abortDocumentVersionUpload(params: WorkDocs.Types.AbortDocumentVersionUploadRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Aborts the upload of the specified document version that was previously initiated by InitiateDocumentVersionUpload. The client should make this call only when it no longer intends to upload the document version, or fails to do so.
   */
  abortDocumentVersionUpload(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Activates the specified user. Only active users can access Amazon WorkDocs.
   */
  activateUser(params: WorkDocs.Types.ActivateUserRequest, callback?: (err: AWSError, data: WorkDocs.Types.ActivateUserResponse) => void): Request<WorkDocs.Types.ActivateUserResponse, AWSError>;
  /**
   * Activates the specified user. Only active users can access Amazon WorkDocs.
   */
  activateUser(callback?: (err: AWSError, data: WorkDocs.Types.ActivateUserResponse) => void): Request<WorkDocs.Types.ActivateUserResponse, AWSError>;
  /**
   * Creates a set of permissions for the specified folder or document. The resource permissions are overwritten if the principals already have different permissions.
   */
  addResourcePermissions(params: WorkDocs.Types.AddResourcePermissionsRequest, callback?: (err: AWSError, data: WorkDocs.Types.AddResourcePermissionsResponse) => void): Request<WorkDocs.Types.AddResourcePermissionsResponse, AWSError>;
  /**
   * Creates a set of permissions for the specified folder or document. The resource permissions are overwritten if the principals already have different permissions.
   */
  addResourcePermissions(callback?: (err: AWSError, data: WorkDocs.Types.AddResourcePermissionsResponse) => void): Request<WorkDocs.Types.AddResourcePermissionsResponse, AWSError>;
  /**
   * Adds a new comment to the specified document version.
   */
  createComment(params: WorkDocs.Types.CreateCommentRequest, callback?: (err: AWSError, data: WorkDocs.Types.CreateCommentResponse) => void): Request<WorkDocs.Types.CreateCommentResponse, AWSError>;
  /**
   * Adds a new comment to the specified document version.
   */
  createComment(callback?: (err: AWSError, data: WorkDocs.Types.CreateCommentResponse) => void): Request<WorkDocs.Types.CreateCommentResponse, AWSError>;
  /**
   * Adds one or more custom properties to the specified resource (a folder, document, or version).
   */
  createCustomMetadata(params: WorkDocs.Types.CreateCustomMetadataRequest, callback?: (err: AWSError, data: WorkDocs.Types.CreateCustomMetadataResponse) => void): Request<WorkDocs.Types.CreateCustomMetadataResponse, AWSError>;
  /**
   * Adds one or more custom properties to the specified resource (a folder, document, or version).
   */
  createCustomMetadata(callback?: (err: AWSError, data: WorkDocs.Types.CreateCustomMetadataResponse) => void): Request<WorkDocs.Types.CreateCustomMetadataResponse, AWSError>;
  /**
   * Creates a folder with the specified name and parent folder.
   */
  createFolder(params: WorkDocs.Types.CreateFolderRequest, callback?: (err: AWSError, data: WorkDocs.Types.CreateFolderResponse) => void): Request<WorkDocs.Types.CreateFolderResponse, AWSError>;
  /**
   * Creates a folder with the specified name and parent folder.
   */
  createFolder(callback?: (err: AWSError, data: WorkDocs.Types.CreateFolderResponse) => void): Request<WorkDocs.Types.CreateFolderResponse, AWSError>;
  /**
   * Adds the specified list of labels to the given resource (a document or folder)
   */
  createLabels(params: WorkDocs.Types.CreateLabelsRequest, callback?: (err: AWSError, data: WorkDocs.Types.CreateLabelsResponse) => void): Request<WorkDocs.Types.CreateLabelsResponse, AWSError>;
  /**
   * Adds the specified list of labels to the given resource (a document or folder)
   */
  createLabels(callback?: (err: AWSError, data: WorkDocs.Types.CreateLabelsResponse) => void): Request<WorkDocs.Types.CreateLabelsResponse, AWSError>;
  /**
   * Configure Amazon WorkDocs to use Amazon SNS notifications. The endpoint receives a confirmation message, and must confirm the subscription. For more information, see Setting up notifications for an IAM user or role in the Amazon WorkDocs Developer Guide.
   */
  createNotificationSubscription(params: WorkDocs.Types.CreateNotificationSubscriptionRequest, callback?: (err: AWSError, data: WorkDocs.Types.CreateNotificationSubscriptionResponse) => void): Request<WorkDocs.Types.CreateNotificationSubscriptionResponse, AWSError>;
  /**
   * Configure Amazon WorkDocs to use Amazon SNS notifications. The endpoint receives a confirmation message, and must confirm the subscription. For more information, see Setting up notifications for an IAM user or role in the Amazon WorkDocs Developer Guide.
   */
  createNotificationSubscription(callback?: (err: AWSError, data: WorkDocs.Types.CreateNotificationSubscriptionResponse) => void): Request<WorkDocs.Types.CreateNotificationSubscriptionResponse, AWSError>;
  /**
   * Creates a user in a Simple AD or Microsoft AD directory. The status of a newly created user is "ACTIVE". New users can access Amazon WorkDocs.
   */
  createUser(params: WorkDocs.Types.CreateUserRequest, callback?: (err: AWSError, data: WorkDocs.Types.CreateUserResponse) => void): Request<WorkDocs.Types.CreateUserResponse, AWSError>;
  /**
   * Creates a user in a Simple AD or Microsoft AD directory. The status of a newly created user is "ACTIVE". New users can access Amazon WorkDocs.
   */
  createUser(callback?: (err: AWSError, data: WorkDocs.Types.CreateUserResponse) => void): Request<WorkDocs.Types.CreateUserResponse, AWSError>;
  /**
   * Deactivates the specified user, which revokes the user's access to Amazon WorkDocs.
   */
  deactivateUser(params: WorkDocs.Types.DeactivateUserRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deactivates the specified user, which revokes the user's access to Amazon WorkDocs.
   */
  deactivateUser(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified comment from the document version.
   */
  deleteComment(params: WorkDocs.Types.DeleteCommentRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified comment from the document version.
   */
  deleteComment(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes custom metadata from the specified resource.
   */
  deleteCustomMetadata(params: WorkDocs.Types.DeleteCustomMetadataRequest, callback?: (err: AWSError, data: WorkDocs.Types.DeleteCustomMetadataResponse) => void): Request<WorkDocs.Types.DeleteCustomMetadataResponse, AWSError>;
  /**
   * Deletes custom metadata from the specified resource.
   */
  deleteCustomMetadata(callback?: (err: AWSError, data: WorkDocs.Types.DeleteCustomMetadataResponse) => void): Request<WorkDocs.Types.DeleteCustomMetadataResponse, AWSError>;
  /**
   * Permanently deletes the specified document and its associated metadata.
   */
  deleteDocument(params: WorkDocs.Types.DeleteDocumentRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Permanently deletes the specified document and its associated metadata.
   */
  deleteDocument(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a specific version of a document.
   */
  deleteDocumentVersion(params: WorkDocs.Types.DeleteDocumentVersionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a specific version of a document.
   */
  deleteDocumentVersion(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Permanently deletes the specified folder and its contents.
   */
  deleteFolder(params: WorkDocs.Types.DeleteFolderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Permanently deletes the specified folder and its contents.
   */
  deleteFolder(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the contents of the specified folder.
   */
  deleteFolderContents(params: WorkDocs.Types.DeleteFolderContentsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the contents of the specified folder.
   */
  deleteFolderContents(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified list of labels from a resource.
   */
  deleteLabels(params: WorkDocs.Types.DeleteLabelsRequest, callback?: (err: AWSError, data: WorkDocs.Types.DeleteLabelsResponse) => void): Request<WorkDocs.Types.DeleteLabelsResponse, AWSError>;
  /**
   * Deletes the specified list of labels from a resource.
   */
  deleteLabels(callback?: (err: AWSError, data: WorkDocs.Types.DeleteLabelsResponse) => void): Request<WorkDocs.Types.DeleteLabelsResponse, AWSError>;
  /**
   * Deletes the specified subscription from the specified organization.
   */
  deleteNotificationSubscription(params: WorkDocs.Types.DeleteNotificationSubscriptionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified subscription from the specified organization.
   */
  deleteNotificationSubscription(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified user from a Simple AD or Microsoft AD directory.  Deleting a user immediately and permanently deletes all content in that user's folder structure. Site retention policies do NOT apply to this type of deletion. 
   */
  deleteUser(params: WorkDocs.Types.DeleteUserRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified user from a Simple AD or Microsoft AD directory.  Deleting a user immediately and permanently deletes all content in that user's folder structure. Site retention policies do NOT apply to this type of deletion. 
   */
  deleteUser(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Describes the user activities in a specified time period.
   */
  describeActivities(params: WorkDocs.Types.DescribeActivitiesRequest, callback?: (err: AWSError, data: WorkDocs.Types.DescribeActivitiesResponse) => void): Request<WorkDocs.Types.DescribeActivitiesResponse, AWSError>;
  /**
   * Describes the user activities in a specified time period.
   */
  describeActivities(callback?: (err: AWSError, data: WorkDocs.Types.DescribeActivitiesResponse) => void): Request<WorkDocs.Types.DescribeActivitiesResponse, AWSError>;
  /**
   * List all the comments for the specified document version.
   */
  describeComments(params: WorkDocs.Types.DescribeCommentsRequest, callback?: (err: AWSError, data: WorkDocs.Types.DescribeCommentsResponse) => void): Request<WorkDocs.Types.DescribeCommentsResponse, AWSError>;
  /**
   * List all the comments for the specified document version.
   */
  describeComments(callback?: (err: AWSError, data: WorkDocs.Types.DescribeCommentsResponse) => void): Request<WorkDocs.Types.DescribeCommentsResponse, AWSError>;
  /**
   * Retrieves the document versions for the specified document. By default, only active versions are returned.
   */
  describeDocumentVersions(params: WorkDocs.Types.DescribeDocumentVersionsRequest, callback?: (err: AWSError, data: WorkDocs.Types.DescribeDocumentVersionsResponse) => void): Request<WorkDocs.Types.DescribeDocumentVersionsResponse, AWSError>;
  /**
   * Retrieves the document versions for the specified document. By default, only active versions are returned.
   */
  describeDocumentVersions(callback?: (err: AWSError, data: WorkDocs.Types.DescribeDocumentVersionsResponse) => void): Request<WorkDocs.Types.DescribeDocumentVersionsResponse, AWSError>;
  /**
   * Describes the contents of the specified folder, including its documents and subfolders. By default, Amazon WorkDocs returns the first 100 active document and folder metadata items. If there are more results, the response includes a marker that you can use to request the next set of results. You can also request initialized documents.
   */
  describeFolderContents(params: WorkDocs.Types.DescribeFolderContentsRequest, callback?: (err: AWSError, data: WorkDocs.Types.DescribeFolderContentsResponse) => void): Request<WorkDocs.Types.DescribeFolderContentsResponse, AWSError>;
  /**
   * Describes the contents of the specified folder, including its documents and subfolders. By default, Amazon WorkDocs returns the first 100 active document and folder metadata items. If there are more results, the response includes a marker that you can use to request the next set of results. You can also request initialized documents.
   */
  describeFolderContents(callback?: (err: AWSError, data: WorkDocs.Types.DescribeFolderContentsResponse) => void): Request<WorkDocs.Types.DescribeFolderContentsResponse, AWSError>;
  /**
   * Describes the groups specified by the query. Groups are defined by the underlying Active Directory.
   */
  describeGroups(params: WorkDocs.Types.DescribeGroupsRequest, callback?: (err: AWSError, data: WorkDocs.Types.DescribeGroupsResponse) => void): Request<WorkDocs.Types.DescribeGroupsResponse, AWSError>;
  /**
   * Describes the groups specified by the query. Groups are defined by the underlying Active Directory.
   */
  describeGroups(callback?: (err: AWSError, data: WorkDocs.Types.DescribeGroupsResponse) => void): Request<WorkDocs.Types.DescribeGroupsResponse, AWSError>;
  /**
   * Lists the specified notification subscriptions.
   */
  describeNotificationSubscriptions(params: WorkDocs.Types.DescribeNotificationSubscriptionsRequest, callback?: (err: AWSError, data: WorkDocs.Types.DescribeNotificationSubscriptionsResponse) => void): Request<WorkDocs.Types.DescribeNotificationSubscriptionsResponse, AWSError>;
  /**
   * Lists the specified notification subscriptions.
   */
  describeNotificationSubscriptions(callback?: (err: AWSError, data: WorkDocs.Types.DescribeNotificationSubscriptionsResponse) => void): Request<WorkDocs.Types.DescribeNotificationSubscriptionsResponse, AWSError>;
  /**
   * Describes the permissions of a specified resource.
   */
  describeResourcePermissions(params: WorkDocs.Types.DescribeResourcePermissionsRequest, callback?: (err: AWSError, data: WorkDocs.Types.DescribeResourcePermissionsResponse) => void): Request<WorkDocs.Types.DescribeResourcePermissionsResponse, AWSError>;
  /**
   * Describes the permissions of a specified resource.
   */
  describeResourcePermissions(callback?: (err: AWSError, data: WorkDocs.Types.DescribeResourcePermissionsResponse) => void): Request<WorkDocs.Types.DescribeResourcePermissionsResponse, AWSError>;
  /**
   * Describes the current user's special folders; the RootFolder and the RecycleBin. RootFolder is the root of user's files and folders and RecycleBin is the root of recycled items. This is not a valid action for SigV4 (administrative API) clients. This action requires an authentication token. To get an authentication token, register an application with Amazon WorkDocs. For more information, see Authentication and Access Control for User Applications in the Amazon WorkDocs Developer Guide.
   */
  describeRootFolders(params: WorkDocs.Types.DescribeRootFoldersRequest, callback?: (err: AWSError, data: WorkDocs.Types.DescribeRootFoldersResponse) => void): Request<WorkDocs.Types.DescribeRootFoldersResponse, AWSError>;
  /**
   * Describes the current user's special folders; the RootFolder and the RecycleBin. RootFolder is the root of user's files and folders and RecycleBin is the root of recycled items. This is not a valid action for SigV4 (administrative API) clients. This action requires an authentication token. To get an authentication token, register an application with Amazon WorkDocs. For more information, see Authentication and Access Control for User Applications in the Amazon WorkDocs Developer Guide.
   */
  describeRootFolders(callback?: (err: AWSError, data: WorkDocs.Types.DescribeRootFoldersResponse) => void): Request<WorkDocs.Types.DescribeRootFoldersResponse, AWSError>;
  /**
   * Describes the specified users. You can describe all users or filter the results (for example, by status or organization). By default, Amazon WorkDocs returns the first 24 active or pending users. If there are more results, the response includes a marker that you can use to request the next set of results.
   */
  describeUsers(params: WorkDocs.Types.DescribeUsersRequest, callback?: (err: AWSError, data: WorkDocs.Types.DescribeUsersResponse) => void): Request<WorkDocs.Types.DescribeUsersResponse, AWSError>;
  /**
   * Describes the specified users. You can describe all users or filter the results (for example, by status or organization). By default, Amazon WorkDocs returns the first 24 active or pending users. If there are more results, the response includes a marker that you can use to request the next set of results.
   */
  describeUsers(callback?: (err: AWSError, data: WorkDocs.Types.DescribeUsersResponse) => void): Request<WorkDocs.Types.DescribeUsersResponse, AWSError>;
  /**
   * Retrieves details of the current user for whom the authentication token was generated. This is not a valid action for SigV4 (administrative API) clients. This action requires an authentication token. To get an authentication token, register an application with Amazon WorkDocs. For more information, see Authentication and Access Control for User Applications in the Amazon WorkDocs Developer Guide.
   */
  getCurrentUser(params: WorkDocs.Types.GetCurrentUserRequest, callback?: (err: AWSError, data: WorkDocs.Types.GetCurrentUserResponse) => void): Request<WorkDocs.Types.GetCurrentUserResponse, AWSError>;
  /**
   * Retrieves details of the current user for whom the authentication token was generated. This is not a valid action for SigV4 (administrative API) clients. This action requires an authentication token. To get an authentication token, register an application with Amazon WorkDocs. For more information, see Authentication and Access Control for User Applications in the Amazon WorkDocs Developer Guide.
   */
  getCurrentUser(callback?: (err: AWSError, data: WorkDocs.Types.GetCurrentUserResponse) => void): Request<WorkDocs.Types.GetCurrentUserResponse, AWSError>;
  /**
   * Retrieves details of a document.
   */
  getDocument(params: WorkDocs.Types.GetDocumentRequest, callback?: (err: AWSError, data: WorkDocs.Types.GetDocumentResponse) => void): Request<WorkDocs.Types.GetDocumentResponse, AWSError>;
  /**
   * Retrieves details of a document.
   */
  getDocument(callback?: (err: AWSError, data: WorkDocs.Types.GetDocumentResponse) => void): Request<WorkDocs.Types.GetDocumentResponse, AWSError>;
  /**
   * Retrieves the path information (the hierarchy from the root folder) for the requested document. By default, Amazon WorkDocs returns a maximum of 100 levels upwards from the requested document and only includes the IDs of the parent folders in the path. You can limit the maximum number of levels. You can also request the names of the parent folders.
   */
  getDocumentPath(params: WorkDocs.Types.GetDocumentPathRequest, callback?: (err: AWSError, data: WorkDocs.Types.GetDocumentPathResponse) => void): Request<WorkDocs.Types.GetDocumentPathResponse, AWSError>;
  /**
   * Retrieves the path information (the hierarchy from the root folder) for the requested document. By default, Amazon WorkDocs returns a maximum of 100 levels upwards from the requested document and only includes the IDs of the parent folders in the path. You can limit the maximum number of levels. You can also request the names of the parent folders.
   */
  getDocumentPath(callback?: (err: AWSError, data: WorkDocs.Types.GetDocumentPathResponse) => void): Request<WorkDocs.Types.GetDocumentPathResponse, AWSError>;
  /**
   * Retrieves version metadata for the specified document.
   */
  getDocumentVersion(params: WorkDocs.Types.GetDocumentVersionRequest, callback?: (err: AWSError, data: WorkDocs.Types.GetDocumentVersionResponse) => void): Request<WorkDocs.Types.GetDocumentVersionResponse, AWSError>;
  /**
   * Retrieves version metadata for the specified document.
   */
  getDocumentVersion(callback?: (err: AWSError, data: WorkDocs.Types.GetDocumentVersionResponse) => void): Request<WorkDocs.Types.GetDocumentVersionResponse, AWSError>;
  /**
   * Retrieves the metadata of the specified folder.
   */
  getFolder(params: WorkDocs.Types.GetFolderRequest, callback?: (err: AWSError, data: WorkDocs.Types.GetFolderResponse) => void): Request<WorkDocs.Types.GetFolderResponse, AWSError>;
  /**
   * Retrieves the metadata of the specified folder.
   */
  getFolder(callback?: (err: AWSError, data: WorkDocs.Types.GetFolderResponse) => void): Request<WorkDocs.Types.GetFolderResponse, AWSError>;
  /**
   * Retrieves the path information (the hierarchy from the root folder) for the specified folder. By default, Amazon WorkDocs returns a maximum of 100 levels upwards from the requested folder and only includes the IDs of the parent folders in the path. You can limit the maximum number of levels. You can also request the parent folder names.
   */
  getFolderPath(params: WorkDocs.Types.GetFolderPathRequest, callback?: (err: AWSError, data: WorkDocs.Types.GetFolderPathResponse) => void): Request<WorkDocs.Types.GetFolderPathResponse, AWSError>;
  /**
   * Retrieves the path information (the hierarchy from the root folder) for the specified folder. By default, Amazon WorkDocs returns a maximum of 100 levels upwards from the requested folder and only includes the IDs of the parent folders in the path. You can limit the maximum number of levels. You can also request the parent folder names.
   */
  getFolderPath(callback?: (err: AWSError, data: WorkDocs.Types.GetFolderPathResponse) => void): Request<WorkDocs.Types.GetFolderPathResponse, AWSError>;
  /**
   * Retrieves a collection of resources, including folders and documents. The only CollectionType supported is SHARED_WITH_ME.
   */
  getResources(params: WorkDocs.Types.GetResourcesRequest, callback?: (err: AWSError, data: WorkDocs.Types.GetResourcesResponse) => void): Request<WorkDocs.Types.GetResourcesResponse, AWSError>;
  /**
   * Retrieves a collection of resources, including folders and documents. The only CollectionType supported is SHARED_WITH_ME.
   */
  getResources(callback?: (err: AWSError, data: WorkDocs.Types.GetResourcesResponse) => void): Request<WorkDocs.Types.GetResourcesResponse, AWSError>;
  /**
   * Creates a new document object and version object. The client specifies the parent folder ID and name of the document to upload. The ID is optionally specified when creating a new version of an existing document. This is the first step to upload a document. Next, upload the document to the URL returned from the call, and then call UpdateDocumentVersion. To cancel the document upload, call AbortDocumentVersionUpload.
   */
  initiateDocumentVersionUpload(params: WorkDocs.Types.InitiateDocumentVersionUploadRequest, callback?: (err: AWSError, data: WorkDocs.Types.InitiateDocumentVersionUploadResponse) => void): Request<WorkDocs.Types.InitiateDocumentVersionUploadResponse, AWSError>;
  /**
   * Creates a new document object and version object. The client specifies the parent folder ID and name of the document to upload. The ID is optionally specified when creating a new version of an existing document. This is the first step to upload a document. Next, upload the document to the URL returned from the call, and then call UpdateDocumentVersion. To cancel the document upload, call AbortDocumentVersionUpload.
   */
  initiateDocumentVersionUpload(callback?: (err: AWSError, data: WorkDocs.Types.InitiateDocumentVersionUploadResponse) => void): Request<WorkDocs.Types.InitiateDocumentVersionUploadResponse, AWSError>;
  /**
   * Removes all the permissions from the specified resource.
   */
  removeAllResourcePermissions(params: WorkDocs.Types.RemoveAllResourcePermissionsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes all the permissions from the specified resource.
   */
  removeAllResourcePermissions(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the permission for the specified principal from the specified resource.
   */
  removeResourcePermission(params: WorkDocs.Types.RemoveResourcePermissionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the permission for the specified principal from the specified resource.
   */
  removeResourcePermission(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Recovers a deleted version of an Amazon WorkDocs document.
   */
  restoreDocumentVersions(params: WorkDocs.Types.RestoreDocumentVersionsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Recovers a deleted version of an Amazon WorkDocs document.
   */
  restoreDocumentVersions(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Searches metadata and the content of folders, documents, document versions, and comments.
   */
  searchResources(params: WorkDocs.Types.SearchResourcesRequest, callback?: (err: AWSError, data: WorkDocs.Types.SearchResourcesResponse) => void): Request<WorkDocs.Types.SearchResourcesResponse, AWSError>;
  /**
   * Searches metadata and the content of folders, documents, document versions, and comments.
   */
  searchResources(callback?: (err: AWSError, data: WorkDocs.Types.SearchResourcesResponse) => void): Request<WorkDocs.Types.SearchResourcesResponse, AWSError>;
  /**
   * Updates the specified attributes of a document. The user must have access to both the document and its parent folder, if applicable.
   */
  updateDocument(params: WorkDocs.Types.UpdateDocumentRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the specified attributes of a document. The user must have access to both the document and its parent folder, if applicable.
   */
  updateDocument(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the status of the document version to ACTIVE.  Amazon WorkDocs also sets its document container to ACTIVE. This is the last step in a document upload, after the client uploads the document to an S3-presigned URL returned by InitiateDocumentVersionUpload. 
   */
  updateDocumentVersion(params: WorkDocs.Types.UpdateDocumentVersionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the status of the document version to ACTIVE.  Amazon WorkDocs also sets its document container to ACTIVE. This is the last step in a document upload, after the client uploads the document to an S3-presigned URL returned by InitiateDocumentVersionUpload. 
   */
  updateDocumentVersion(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the specified attributes of the specified folder. The user must have access to both the folder and its parent folder, if applicable.
   */
  updateFolder(params: WorkDocs.Types.UpdateFolderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the specified attributes of the specified folder. The user must have access to both the folder and its parent folder, if applicable.
   */
  updateFolder(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the specified attributes of the specified user, and grants or revokes administrative privileges to the Amazon WorkDocs site.
   */
  updateUser(params: WorkDocs.Types.UpdateUserRequest, callback?: (err: AWSError, data: WorkDocs.Types.UpdateUserResponse) => void): Request<WorkDocs.Types.UpdateUserResponse, AWSError>;
  /**
   * Updates the specified attributes of the specified user, and grants or revokes administrative privileges to the Amazon WorkDocs site.
   */
  updateUser(callback?: (err: AWSError, data: WorkDocs.Types.UpdateUserResponse) => void): Request<WorkDocs.Types.UpdateUserResponse, AWSError>;
}
declare namespace WorkDocs {
  export interface AbortDocumentVersionUploadRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the document.
     */
    DocumentId: ResourceIdType;
    /**
     * The ID of the version.
     */
    VersionId: DocumentVersionIdType;
  }
  export interface ActivateUserRequest {
    /**
     * The ID of the user.
     */
    UserId: IdType;
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
  }
  export interface ActivateUserResponse {
    /**
     * The user information.
     */
    User?: User;
  }
  export interface Activity {
    /**
     * The activity type.
     */
    Type?: ActivityType;
    /**
     * The timestamp when the action was performed.
     */
    TimeStamp?: TimestampType;
    /**
     * Indicates whether an activity is indirect or direct. An indirect activity results from a direct activity performed on a parent resource. For example, sharing a parent folder (the direct activity) shares all of the subfolders and documents within the parent folder (the indirect activity).
     */
    IsIndirectActivity?: BooleanType;
    /**
     * The ID of the organization.
     */
    OrganizationId?: IdType;
    /**
     * The user who performed the action.
     */
    Initiator?: UserMetadata;
    /**
     * The list of users or groups impacted by this action. This is an optional field and is filled for the following sharing activities: DOCUMENT_SHARED, DOCUMENT_SHARED, DOCUMENT_UNSHARED, FOLDER_SHARED, FOLDER_UNSHARED.
     */
    Participants?: Participants;
    /**
     * The metadata of the resource involved in the user action.
     */
    ResourceMetadata?: ResourceMetadata;
    /**
     * The original parent of the resource. This is an optional field and is filled for move activities.
     */
    OriginalParent?: ResourceMetadata;
    /**
     * Metadata of the commenting activity. This is an optional field and is filled for commenting activities.
     */
    CommentMetadata?: CommentMetadata;
  }
  export type ActivityNamesFilterType = string;
  export type ActivityType = "DOCUMENT_CHECKED_IN"|"DOCUMENT_CHECKED_OUT"|"DOCUMENT_RENAMED"|"DOCUMENT_VERSION_UPLOADED"|"DOCUMENT_VERSION_DELETED"|"DOCUMENT_VERSION_VIEWED"|"DOCUMENT_VERSION_DOWNLOADED"|"DOCUMENT_RECYCLED"|"DOCUMENT_RESTORED"|"DOCUMENT_REVERTED"|"DOCUMENT_SHARED"|"DOCUMENT_UNSHARED"|"DOCUMENT_SHARE_PERMISSION_CHANGED"|"DOCUMENT_SHAREABLE_LINK_CREATED"|"DOCUMENT_SHAREABLE_LINK_REMOVED"|"DOCUMENT_SHAREABLE_LINK_PERMISSION_CHANGED"|"DOCUMENT_MOVED"|"DOCUMENT_COMMENT_ADDED"|"DOCUMENT_COMMENT_DELETED"|"DOCUMENT_ANNOTATION_ADDED"|"DOCUMENT_ANNOTATION_DELETED"|"FOLDER_CREATED"|"FOLDER_DELETED"|"FOLDER_RENAMED"|"FOLDER_RECYCLED"|"FOLDER_RESTORED"|"FOLDER_SHARED"|"FOLDER_UNSHARED"|"FOLDER_SHARE_PERMISSION_CHANGED"|"FOLDER_SHAREABLE_LINK_CREATED"|"FOLDER_SHAREABLE_LINK_REMOVED"|"FOLDER_SHAREABLE_LINK_PERMISSION_CHANGED"|"FOLDER_MOVED"|string;
  export interface AddResourcePermissionsRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the resource.
     */
    ResourceId: ResourceIdType;
    /**
     * The users, groups, or organization being granted permission.
     */
    Principals: SharePrincipalList;
    /**
     * The notification options.
     */
    NotificationOptions?: NotificationOptions;
  }
  export interface AddResourcePermissionsResponse {
    /**
     * The share results.
     */
    ShareResults?: ShareResultsList;
  }
  export type AdditionalResponseFieldType = "WEBURL"|string;
  export type AdditionalResponseFieldsList = AdditionalResponseFieldType[];
  export type AuthenticationHeaderType = string;
  export type BooleanEnumType = "TRUE"|"FALSE"|string;
  export type BooleanType = boolean;
  export interface Comment {
    /**
     * The ID of the comment.
     */
    CommentId: CommentIdType;
    /**
     * The ID of the parent comment.
     */
    ParentId?: CommentIdType;
    /**
     * The ID of the root comment in the thread.
     */
    ThreadId?: CommentIdType;
    /**
     * The text of the comment.
     */
    Text?: CommentTextType;
    /**
     * The details of the user who made the comment.
     */
    Contributor?: User;
    /**
     * The time that the comment was created.
     */
    CreatedTimestamp?: TimestampType;
    /**
     * The status of the comment.
     */
    Status?: CommentStatusType;
    /**
     * The visibility of the comment. Options are either PRIVATE, where the comment is visible only to the comment author and document owner and co-owners, or PUBLIC, where the comment is visible to document owners, co-owners, and contributors.
     */
    Visibility?: CommentVisibilityType;
    /**
     * If the comment is a reply to another user's comment, this field contains the user ID of the user being replied to.
     */
    RecipientId?: IdType;
  }
  export type CommentIdType = string;
  export type CommentList = Comment[];
  export interface CommentMetadata {
    /**
     * The ID of the comment.
     */
    CommentId?: CommentIdType;
    /**
     * The user who made the comment.
     */
    Contributor?: User;
    /**
     * The timestamp that the comment was created.
     */
    CreatedTimestamp?: TimestampType;
    /**
     * The status of the comment.
     */
    CommentStatus?: CommentStatusType;
    /**
     * The ID of the user being replied to.
     */
    RecipientId?: IdType;
    /**
     * The ID of the user who made the comment.
     */
    ContributorId?: IdType;
  }
  export type CommentStatusType = "DRAFT"|"PUBLISHED"|"DELETED"|string;
  export type CommentTextType = string;
  export type CommentVisibilityType = "PUBLIC"|"PRIVATE"|string;
  export type ContentCategoryType = "IMAGE"|"DOCUMENT"|"PDF"|"SPREADSHEET"|"PRESENTATION"|"AUDIO"|"VIDEO"|"SOURCE_CODE"|"OTHER"|string;
  export interface CreateCommentRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the document.
     */
    DocumentId: ResourceIdType;
    /**
     * The ID of the document version.
     */
    VersionId: DocumentVersionIdType;
    /**
     * The ID of the parent comment.
     */
    ParentId?: CommentIdType;
    /**
     * The ID of the root comment in the thread.
     */
    ThreadId?: CommentIdType;
    /**
     * The text of the comment.
     */
    Text: CommentTextType;
    /**
     * The visibility of the comment. Options are either PRIVATE, where the comment is visible only to the comment author and document owner and co-owners, or PUBLIC, where the comment is visible to document owners, co-owners, and contributors.
     */
    Visibility?: CommentVisibilityType;
    /**
     * Set this parameter to TRUE to send an email out to the document collaborators after the comment is created.
     */
    NotifyCollaborators?: BooleanType;
  }
  export interface CreateCommentResponse {
    /**
     * The comment that has been created.
     */
    Comment?: Comment;
  }
  export interface CreateCustomMetadataRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the resource.
     */
    ResourceId: ResourceIdType;
    /**
     * The ID of the version, if the custom metadata is being added to a document version.
     */
    VersionId?: DocumentVersionIdType;
    /**
     * Custom metadata in the form of name-value pairs.
     */
    CustomMetadata: CustomMetadataMap;
  }
  export interface CreateCustomMetadataResponse {
  }
  export interface CreateFolderRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The name of the new folder.
     */
    Name?: ResourceNameType;
    /**
     * The ID of the parent folder.
     */
    ParentFolderId: ResourceIdType;
  }
  export interface CreateFolderResponse {
    /**
     * The metadata of the folder.
     */
    Metadata?: FolderMetadata;
  }
  export interface CreateLabelsRequest {
    /**
     * The ID of the resource.
     */
    ResourceId: ResourceIdType;
    /**
     * List of labels to add to the resource.
     */
    Labels: SharedLabels;
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
  }
  export interface CreateLabelsResponse {
  }
  export interface CreateNotificationSubscriptionRequest {
    /**
     * The ID of the organization.
     */
    OrganizationId: IdType;
    /**
     * The endpoint to receive the notifications. If the protocol is HTTPS, the endpoint is a URL that begins with https.
     */
    Endpoint: SubscriptionEndPointType;
    /**
     * The protocol to use. The supported value is https, which delivers JSON-encoded messages using HTTPS POST.
     */
    Protocol: SubscriptionProtocolType;
    /**
     * The notification type.
     */
    SubscriptionType: SubscriptionType;
  }
  export interface CreateNotificationSubscriptionResponse {
    /**
     * The subscription.
     */
    Subscription?: Subscription;
  }
  export interface CreateUserRequest {
    /**
     * The ID of the organization.
     */
    OrganizationId?: IdType;
    /**
     * The login name of the user.
     */
    Username: UsernameType;
    /**
     * The email address of the user.
     */
    EmailAddress?: EmailAddressType;
    /**
     * The given name of the user.
     */
    GivenName: UserAttributeValueType;
    /**
     * The surname of the user.
     */
    Surname: UserAttributeValueType;
    /**
     * The password of the user.
     */
    Password: PasswordType;
    /**
     * The time zone ID of the user.
     */
    TimeZoneId?: TimeZoneIdType;
    /**
     * The amount of storage for the user.
     */
    StorageRule?: StorageRuleType;
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
  }
  export interface CreateUserResponse {
    /**
     * The user information.
     */
    User?: User;
  }
  export type CustomMetadataKeyList = CustomMetadataKeyType[];
  export type CustomMetadataKeyType = string;
  export type CustomMetadataMap = {[key: string]: CustomMetadataValueType};
  export type CustomMetadataValueType = string;
  export interface DateRangeType {
    /**
     * Timestamp range start value (in epochs)
     */
    StartValue?: TimestampType;
    /**
     * Timestamp range end value (in epochs).
     */
    EndValue?: TimestampType;
  }
  export interface DeactivateUserRequest {
    /**
     * The ID of the user.
     */
    UserId: IdType;
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
  }
  export interface DeleteCommentRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the document.
     */
    DocumentId: ResourceIdType;
    /**
     * The ID of the document version.
     */
    VersionId: DocumentVersionIdType;
    /**
     * The ID of the comment.
     */
    CommentId: CommentIdType;
  }
  export interface DeleteCustomMetadataRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the resource, either a document or folder.
     */
    ResourceId: ResourceIdType;
    /**
     * The ID of the version, if the custom metadata is being deleted from a document version.
     */
    VersionId?: DocumentVersionIdType;
    /**
     * List of properties to remove.
     */
    Keys?: CustomMetadataKeyList;
    /**
     * Flag to indicate removal of all custom metadata properties from the specified resource.
     */
    DeleteAll?: BooleanType;
  }
  export interface DeleteCustomMetadataResponse {
  }
  export interface DeleteDocumentRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the document.
     */
    DocumentId: ResourceIdType;
  }
  export interface DeleteDocumentVersionRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the document associated with the version being deleted.
     */
    DocumentId: ResourceIdType;
    /**
     * The ID of the version being deleted.
     */
    VersionId: DocumentVersionIdType;
    /**
     * Deletes all versions of a document prior to the current version.
     */
    DeletePriorVersions: BooleanType;
  }
  export interface DeleteFolderContentsRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the folder.
     */
    FolderId: ResourceIdType;
  }
  export interface DeleteFolderRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the folder.
     */
    FolderId: ResourceIdType;
  }
  export interface DeleteLabelsRequest {
    /**
     * The ID of the resource.
     */
    ResourceId: ResourceIdType;
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * List of labels to delete from the resource.
     */
    Labels?: SharedLabels;
    /**
     * Flag to request removal of all labels from the specified resource.
     */
    DeleteAll?: BooleanType;
  }
  export interface DeleteLabelsResponse {
  }
  export interface DeleteNotificationSubscriptionRequest {
    /**
     * The ID of the subscription.
     */
    SubscriptionId: IdType;
    /**
     * The ID of the organization.
     */
    OrganizationId: IdType;
  }
  export interface DeleteUserRequest {
    /**
     * Amazon WorkDocs authentication token. Do not set this field when using administrative API actions, as in accessing the API using Amazon Web Services credentials.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the user.
     */
    UserId: IdType;
  }
  export interface DescribeActivitiesRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The timestamp that determines the starting time of the activities. The response includes the activities performed after the specified timestamp.
     */
    StartTime?: TimestampType;
    /**
     * The timestamp that determines the end time of the activities. The response includes the activities performed before the specified timestamp.
     */
    EndTime?: TimestampType;
    /**
     * The ID of the organization. This is a mandatory parameter when using administrative API (SigV4) requests.
     */
    OrganizationId?: IdType;
    /**
     * Specifies which activity types to include in the response. If this field is left empty, all activity types are returned.
     */
    ActivityTypes?: ActivityNamesFilterType;
    /**
     * The document or folder ID for which to describe activity types.
     */
    ResourceId?: IdType;
    /**
     * The ID of the user who performed the action. The response includes activities pertaining to this user. This is an optional parameter and is only applicable for administrative API (SigV4) requests.
     */
    UserId?: IdType;
    /**
     * Includes indirect activities. An indirect activity results from a direct activity performed on a parent resource. For example, sharing a parent folder (the direct activity) shares all of the subfolders and documents within the parent folder (the indirect activity).
     */
    IncludeIndirectActivities?: BooleanType;
    /**
     * The maximum number of items to return.
     */
    Limit?: LimitType;
    /**
     * The marker for the next set of results.
     */
    Marker?: SearchMarkerType;
  }
  export interface DescribeActivitiesResponse {
    /**
     * The list of activities for the specified user and time period.
     */
    UserActivities?: UserActivities;
    /**
     * The marker for the next set of results.
     */
    Marker?: SearchMarkerType;
  }
  export interface DescribeCommentsRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the document.
     */
    DocumentId: ResourceIdType;
    /**
     * The ID of the document version.
     */
    VersionId: DocumentVersionIdType;
    /**
     * The maximum number of items to return.
     */
    Limit?: LimitType;
    /**
     * The marker for the next set of results. This marker was received from a previous call.
     */
    Marker?: MarkerType;
  }
  export interface DescribeCommentsResponse {
    /**
     * The list of comments for the specified document version.
     */
    Comments?: CommentList;
    /**
     * The marker for the next set of results. This marker was received from a previous call.
     */
    Marker?: MarkerType;
  }
  export interface DescribeDocumentVersionsRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the document.
     */
    DocumentId: ResourceIdType;
    /**
     * The marker for the next set of results. (You received this marker from a previous call.)
     */
    Marker?: PageMarkerType;
    /**
     * The maximum number of versions to return with this call.
     */
    Limit?: LimitType;
    /**
     * A comma-separated list of values. Specify "INITIALIZED" to include incomplete versions.
     */
    Include?: FieldNamesType;
    /**
     * Specify "SOURCE" to include initialized versions and a URL for the source document.
     */
    Fields?: FieldNamesType;
  }
  export interface DescribeDocumentVersionsResponse {
    /**
     * The document versions.
     */
    DocumentVersions?: DocumentVersionMetadataList;
    /**
     * The marker to use when requesting the next set of results. If there are no additional results, the string is empty.
     */
    Marker?: PageMarkerType;
  }
  export interface DescribeFolderContentsRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the folder.
     */
    FolderId: ResourceIdType;
    /**
     * The sorting criteria.
     */
    Sort?: ResourceSortType;
    /**
     * The order for the contents of the folder.
     */
    Order?: OrderType;
    /**
     * The maximum number of items to return with this call.
     */
    Limit?: LimitType;
    /**
     * The marker for the next set of results. This marker was received from a previous call.
     */
    Marker?: PageMarkerType;
    /**
     * The type of items.
     */
    Type?: FolderContentType;
    /**
     * The contents to include. Specify "INITIALIZED" to include initialized documents.
     */
    Include?: FieldNamesType;
  }
  export interface DescribeFolderContentsResponse {
    /**
     * The subfolders in the specified folder.
     */
    Folders?: FolderMetadataList;
    /**
     * The documents in the specified folder.
     */
    Documents?: DocumentMetadataList;
    /**
     * The marker to use when requesting the next set of results. If there are no additional results, the string is empty.
     */
    Marker?: PageMarkerType;
  }
  export interface DescribeGroupsRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * A query to describe groups by group name.
     */
    SearchQuery: SearchQueryType;
    /**
     * The ID of the organization.
     */
    OrganizationId?: IdType;
    /**
     * The marker for the next set of results. (You received this marker from a previous call.)
     */
    Marker?: MarkerType;
    /**
     * The maximum number of items to return with this call.
     */
    Limit?: PositiveIntegerType;
  }
  export interface DescribeGroupsResponse {
    /**
     * The list of groups.
     */
    Groups?: GroupMetadataList;
    /**
     * The marker to use when requesting the next set of results. If there are no additional results, the string is empty.
     */
    Marker?: MarkerType;
  }
  export interface DescribeNotificationSubscriptionsRequest {
    /**
     * The ID of the organization.
     */
    OrganizationId: IdType;
    /**
     * The marker for the next set of results. (You received this marker from a previous call.)
     */
    Marker?: PageMarkerType;
    /**
     * The maximum number of items to return with this call.
     */
    Limit?: LimitType;
  }
  export interface DescribeNotificationSubscriptionsResponse {
    /**
     * The subscriptions.
     */
    Subscriptions?: SubscriptionList;
    /**
     * The marker to use when requesting the next set of results. If there are no additional results, the string is empty.
     */
    Marker?: PageMarkerType;
  }
  export interface DescribeResourcePermissionsRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the resource.
     */
    ResourceId: ResourceIdType;
    /**
     * The ID of the principal to filter permissions by.
     */
    PrincipalId?: IdType;
    /**
     * The maximum number of items to return with this call.
     */
    Limit?: LimitType;
    /**
     * The marker for the next set of results. (You received this marker from a previous call)
     */
    Marker?: PageMarkerType;
  }
  export interface DescribeResourcePermissionsResponse {
    /**
     * The principals.
     */
    Principals?: PrincipalList;
    /**
     * The marker to use when requesting the next set of results. If there are no additional results, the string is empty.
     */
    Marker?: PageMarkerType;
  }
  export interface DescribeRootFoldersRequest {
    /**
     * Amazon WorkDocs authentication token.
     */
    AuthenticationToken: AuthenticationHeaderType;
    /**
     * The maximum number of items to return.
     */
    Limit?: LimitType;
    /**
     * The marker for the next set of results. (You received this marker from a previous call.)
     */
    Marker?: PageMarkerType;
  }
  export interface DescribeRootFoldersResponse {
    /**
     * The user's special folders.
     */
    Folders?: FolderMetadataList;
    /**
     * The marker for the next set of results.
     */
    Marker?: PageMarkerType;
  }
  export interface DescribeUsersRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the organization.
     */
    OrganizationId?: IdType;
    /**
     * The IDs of the users.
     */
    UserIds?: UserIdsType;
    /**
     * A query to filter users by user name. Remember the following about the Userids and Query parameters:   If you don't use either parameter, the API returns a paginated list of all users on the site.   If you use both parameters, the API ignores the Query parameter.   The Userid parameter only returns user names that match a corresponding user ID.   The Query parameter runs a "prefix" search for users by the GivenName, SurName, or UserName fields included in a CreateUser API call. For example, querying on Ma returns Márcia Oliveira, María García, and Mateo Jackson. If you use multiple characters, the API only returns data that matches all characters. For example, querying on Ma J only returns Mateo Jackson.  
     */
    Query?: SearchQueryType;
    /**
     * The state of the users. Specify "ALL" to include inactive users.
     */
    Include?: UserFilterType;
    /**
     * The order for the results.
     */
    Order?: OrderType;
    /**
     * The sorting criteria.
     */
    Sort?: UserSortType;
    /**
     * The marker for the next set of results. (You received this marker from a previous call.)
     */
    Marker?: PageMarkerType;
    /**
     * The maximum number of items to return.
     */
    Limit?: LimitType;
    /**
     * A comma-separated list of values. Specify "STORAGE_METADATA" to include the user storage quota and utilization information.
     */
    Fields?: FieldNamesType;
  }
  export interface DescribeUsersResponse {
    /**
     * The users.
     */
    Users?: OrganizationUserList;
    /**
     * The total number of users included in the results.
     */
    TotalNumberOfUsers?: SizeType;
    /**
     * The marker to use when requesting the next set of results. If there are no additional results, the string is empty.
     */
    Marker?: PageMarkerType;
  }
  export type DocumentContentType = string;
  export interface DocumentMetadata {
    /**
     * The ID of the document.
     */
    Id?: ResourceIdType;
    /**
     * The ID of the creator.
     */
    CreatorId?: IdType;
    /**
     * The ID of the parent folder.
     */
    ParentFolderId?: ResourceIdType;
    /**
     * The time when the document was created.
     */
    CreatedTimestamp?: TimestampType;
    /**
     * The time when the document was updated.
     */
    ModifiedTimestamp?: TimestampType;
    /**
     * The latest version of the document.
     */
    LatestVersionMetadata?: DocumentVersionMetadata;
    /**
     * The resource state.
     */
    ResourceState?: ResourceStateType;
    /**
     * List of labels on the document.
     */
    Labels?: SharedLabels;
  }
  export type DocumentMetadataList = DocumentMetadata[];
  export type DocumentSourceType = "ORIGINAL"|"WITH_COMMENTS"|string;
  export type DocumentSourceUrlMap = {[key: string]: UrlType};
  export type DocumentStatusType = "INITIALIZED"|"ACTIVE"|string;
  export type DocumentThumbnailType = "SMALL"|"SMALL_HQ"|"LARGE"|string;
  export type DocumentThumbnailUrlMap = {[key: string]: UrlType};
  export type DocumentVersionIdType = string;
  export interface DocumentVersionMetadata {
    /**
     * The ID of the version.
     */
    Id?: DocumentVersionIdType;
    /**
     * The name of the version.
     */
    Name?: ResourceNameType;
    /**
     * The content type of the document.
     */
    ContentType?: DocumentContentType;
    /**
     * The size of the document, in bytes.
     */
    Size?: SizeType;
    /**
     * The signature of the document.
     */
    Signature?: HashType;
    /**
     * The status of the document.
     */
    Status?: DocumentStatusType;
    /**
     * The timestamp when the document was first uploaded.
     */
    CreatedTimestamp?: TimestampType;
    /**
     * The timestamp when the document was last uploaded.
     */
    ModifiedTimestamp?: TimestampType;
    /**
     * The timestamp when the content of the document was originally created.
     */
    ContentCreatedTimestamp?: TimestampType;
    /**
     * The timestamp when the content of the document was modified.
     */
    ContentModifiedTimestamp?: TimestampType;
    /**
     * The ID of the creator.
     */
    CreatorId?: IdType;
    /**
     * The thumbnail of the document.
     */
    Thumbnail?: DocumentThumbnailUrlMap;
    /**
     * The source of the document.
     */
    Source?: DocumentSourceUrlMap;
  }
  export type DocumentVersionMetadataList = DocumentVersionMetadata[];
  export type DocumentVersionStatus = "ACTIVE"|string;
  export type EmailAddressType = string;
  export type FieldNamesType = string;
  export interface Filters {
    /**
     * Filters by the locale of the content or comment.
     */
    TextLocales?: TextLocaleTypeList;
    /**
     * Filters by content category.
     */
    ContentCategories?: SearchContentCategoryTypeList;
    /**
     * Filters based on entity type.
     */
    ResourceTypes?: SearchResourceTypeList;
    /**
     * Filter by labels using exact match.
     */
    Labels?: SearchLabelList;
    /**
     * Filter based on UserIds or GroupIds.
     */
    Principals?: SearchPrincipalTypeList;
    /**
     * Filter based on resource’s path.
     */
    AncestorIds?: SearchAncestorIdList;
    /**
     * Filter based on file groupings.
     */
    SearchCollectionTypes?: SearchCollectionTypeList;
    /**
     * Filter based on size (in bytes).
     */
    SizeRange?: LongRangeType;
    /**
     * Filter based on resource’s creation timestamp.
     */
    CreatedRange?: DateRangeType;
    /**
     * Filter based on resource’s modified timestamp.
     */
    ModifiedRange?: DateRangeType;
  }
  export type FolderContentType = "ALL"|"DOCUMENT"|"FOLDER"|string;
  export interface FolderMetadata {
    /**
     * The ID of the folder.
     */
    Id?: ResourceIdType;
    /**
     * The name of the folder.
     */
    Name?: ResourceNameType;
    /**
     * The ID of the creator.
     */
    CreatorId?: IdType;
    /**
     * The ID of the parent folder.
     */
    ParentFolderId?: ResourceIdType;
    /**
     * The time when the folder was created.
     */
    CreatedTimestamp?: TimestampType;
    /**
     * The time when the folder was updated.
     */
    ModifiedTimestamp?: TimestampType;
    /**
     * The resource state of the folder.
     */
    ResourceState?: ResourceStateType;
    /**
     * The unique identifier created from the subfolders and documents of the folder.
     */
    Signature?: HashType;
    /**
     * List of labels on the folder.
     */
    Labels?: SharedLabels;
    /**
     * The size of the folder metadata.
     */
    Size?: SizeType;
    /**
     * The size of the latest version of the folder metadata.
     */
    LatestVersionSize?: SizeType;
  }
  export type FolderMetadataList = FolderMetadata[];
  export interface GetCurrentUserRequest {
    /**
     * Amazon WorkDocs authentication token.
     */
    AuthenticationToken: AuthenticationHeaderType;
  }
  export interface GetCurrentUserResponse {
    /**
     * Metadata of the user.
     */
    User?: User;
  }
  export interface GetDocumentPathRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the document.
     */
    DocumentId: IdType;
    /**
     * The maximum number of levels in the hierarchy to return.
     */
    Limit?: LimitType;
    /**
     * A comma-separated list of values. Specify NAME to include the names of the parent folders.
     */
    Fields?: FieldNamesType;
    /**
     * This value is not supported.
     */
    Marker?: PageMarkerType;
  }
  export interface GetDocumentPathResponse {
    /**
     * The path information.
     */
    Path?: ResourcePath;
  }
  export interface GetDocumentRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the document.
     */
    DocumentId: ResourceIdType;
    /**
     * Set this to TRUE to include custom metadata in the response.
     */
    IncludeCustomMetadata?: BooleanType;
  }
  export interface GetDocumentResponse {
    /**
     * The metadata details of the document.
     */
    Metadata?: DocumentMetadata;
    /**
     * The custom metadata on the document.
     */
    CustomMetadata?: CustomMetadataMap;
  }
  export interface GetDocumentVersionRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the document.
     */
    DocumentId: ResourceIdType;
    /**
     * The version ID of the document.
     */
    VersionId: DocumentVersionIdType;
    /**
     * A comma-separated list of values. Specify "SOURCE" to include a URL for the source document.
     */
    Fields?: FieldNamesType;
    /**
     * Set this to TRUE to include custom metadata in the response.
     */
    IncludeCustomMetadata?: BooleanType;
  }
  export interface GetDocumentVersionResponse {
    /**
     * The version metadata.
     */
    Metadata?: DocumentVersionMetadata;
    /**
     * The custom metadata on the document version.
     */
    CustomMetadata?: CustomMetadataMap;
  }
  export interface GetFolderPathRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the folder.
     */
    FolderId: IdType;
    /**
     * The maximum number of levels in the hierarchy to return.
     */
    Limit?: LimitType;
    /**
     * A comma-separated list of values. Specify "NAME" to include the names of the parent folders.
     */
    Fields?: FieldNamesType;
    /**
     * This value is not supported.
     */
    Marker?: PageMarkerType;
  }
  export interface GetFolderPathResponse {
    /**
     * The path information.
     */
    Path?: ResourcePath;
  }
  export interface GetFolderRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the folder.
     */
    FolderId: ResourceIdType;
    /**
     * Set to TRUE to include custom metadata in the response.
     */
    IncludeCustomMetadata?: BooleanType;
  }
  export interface GetFolderResponse {
    /**
     * The metadata of the folder.
     */
    Metadata?: FolderMetadata;
    /**
     * The custom metadata on the folder.
     */
    CustomMetadata?: CustomMetadataMap;
  }
  export interface GetResourcesRequest {
    /**
     * The Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The user ID for the resource collection. This is a required field for accessing the API operation using IAM credentials.
     */
    UserId?: IdType;
    /**
     * The collection type.
     */
    CollectionType?: ResourceCollectionType;
    /**
     * The maximum number of resources to return.
     */
    Limit?: LimitType;
    /**
     * The marker for the next set of results. This marker was received from a previous call.
     */
    Marker?: PageMarkerType;
  }
  export interface GetResourcesResponse {
    /**
     * The folders in the specified folder.
     */
    Folders?: FolderMetadataList;
    /**
     * The documents in the specified collection.
     */
    Documents?: DocumentMetadataList;
    /**
     * The marker to use when requesting the next set of results. If there are no additional results, the string is empty.
     */
    Marker?: PageMarkerType;
  }
  export interface GroupMetadata {
    /**
     * The ID of the user group.
     */
    Id?: IdType;
    /**
     * The name of the group.
     */
    Name?: GroupNameType;
  }
  export type GroupMetadataList = GroupMetadata[];
  export type GroupNameType = string;
  export type HashType = string;
  export type HeaderNameType = string;
  export type HeaderValueType = string;
  export type IdType = string;
  export interface InitiateDocumentVersionUploadRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the document.
     */
    Id?: ResourceIdType;
    /**
     * The name of the document.
     */
    Name?: ResourceNameType;
    /**
     * The timestamp when the content of the document was originally created.
     */
    ContentCreatedTimestamp?: TimestampType;
    /**
     * The timestamp when the content of the document was modified.
     */
    ContentModifiedTimestamp?: TimestampType;
    /**
     * The content type of the document.
     */
    ContentType?: DocumentContentType;
    /**
     * The size of the document, in bytes.
     */
    DocumentSizeInBytes?: SizeType;
    /**
     * The ID of the parent folder.
     */
    ParentFolderId?: ResourceIdType;
  }
  export interface InitiateDocumentVersionUploadResponse {
    /**
     * The document metadata.
     */
    Metadata?: DocumentMetadata;
    /**
     * The upload metadata.
     */
    UploadMetadata?: UploadMetadata;
  }
  export type LanguageCodeType = "AR"|"BG"|"BN"|"DA"|"DE"|"CS"|"EL"|"EN"|"ES"|"FA"|"FI"|"FR"|"HI"|"HU"|"ID"|"IT"|"JA"|"KO"|"LT"|"LV"|"NL"|"NO"|"PT"|"RO"|"RU"|"SV"|"SW"|"TH"|"TR"|"ZH"|"DEFAULT"|string;
  export type LimitType = number;
  export type LocaleType = "en"|"fr"|"ko"|"de"|"es"|"ja"|"ru"|"zh_CN"|"zh_TW"|"pt_BR"|"default"|string;
  export interface LongRangeType {
    /**
     * The size start range (in bytes).
     */
    StartValue?: LongType;
    /**
     * The size end range (in bytes).
     */
    EndValue?: LongType;
  }
  export type LongType = number;
  export type MarkerType = string;
  export type MessageType = string;
  export type NextMarkerType = string;
  export interface NotificationOptions {
    /**
     * Boolean value to indicate an email notification should be sent to the recipients.
     */
    SendEmail?: BooleanType;
    /**
     * Text value to be included in the email body.
     */
    EmailMessage?: MessageType;
  }
  export type OrderByFieldType = "RELEVANCE"|"NAME"|"SIZE"|"CREATED_TIMESTAMP"|"MODIFIED_TIMESTAMP"|string;
  export type OrderType = "ASCENDING"|"DESCENDING"|string;
  export type OrganizationUserList = User[];
  export type PageMarkerType = string;
  export interface Participants {
    /**
     * The list of users.
     */
    Users?: UserMetadataList;
    /**
     * The list of user groups.
     */
    Groups?: GroupMetadataList;
  }
  export type PasswordType = string;
  export interface PermissionInfo {
    /**
     * The role of the user.
     */
    Role?: RoleType;
    /**
     * The type of permissions.
     */
    Type?: RolePermissionType;
  }
  export type PermissionInfoList = PermissionInfo[];
  export type PositiveIntegerType = number;
  export type PositiveSizeType = number;
  export interface Principal {
    /**
     * The ID of the resource.
     */
    Id?: IdType;
    /**
     * The type of resource.
     */
    Type?: PrincipalType;
    /**
     * The permission information for the resource.
     */
    Roles?: PermissionInfoList;
  }
  export type PrincipalList = Principal[];
  export type PrincipalRoleType = "VIEWER"|"CONTRIBUTOR"|"OWNER"|"COOWNER"|string;
  export type PrincipalType = "USER"|"GROUP"|"INVITE"|"ANONYMOUS"|"ORGANIZATION"|string;
  export interface RemoveAllResourcePermissionsRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the resource.
     */
    ResourceId: ResourceIdType;
  }
  export interface RemoveResourcePermissionRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the resource.
     */
    ResourceId: ResourceIdType;
    /**
     * The principal ID of the resource.
     */
    PrincipalId: IdType;
    /**
     * The principal type of the resource.
     */
    PrincipalType?: PrincipalType;
  }
  export type ResourceCollectionType = "SHARED_WITH_ME"|string;
  export type ResourceIdType = string;
  export interface ResourceMetadata {
    /**
     * The type of resource.
     */
    Type?: ResourceType;
    /**
     * The name of the resource.
     */
    Name?: ResourceNameType;
    /**
     * The original name of the resource before a rename operation.
     */
    OriginalName?: ResourceNameType;
    /**
     * The ID of the resource.
     */
    Id?: ResourceIdType;
    /**
     * The version ID of the resource. This is an optional field and is filled for action on document version.
     */
    VersionId?: DocumentVersionIdType;
    /**
     * The owner of the resource.
     */
    Owner?: UserMetadata;
    /**
     * The parent ID of the resource before a rename operation.
     */
    ParentId?: ResourceIdType;
  }
  export type ResourceNameType = string;
  export interface ResourcePath {
    /**
     * The components of the resource path.
     */
    Components?: ResourcePathComponentList;
  }
  export interface ResourcePathComponent {
    /**
     * The ID of the resource path.
     */
    Id?: IdType;
    /**
     * The name of the resource path.
     */
    Name?: ResourceNameType;
  }
  export type ResourcePathComponentList = ResourcePathComponent[];
  export type ResourceSortType = "DATE"|"NAME"|string;
  export type ResourceStateType = "ACTIVE"|"RESTORING"|"RECYCLING"|"RECYCLED"|string;
  export type ResourceType = "FOLDER"|"DOCUMENT"|string;
  export interface ResponseItem {
    /**
     * The type of item being returned.
     */
    ResourceType?: ResponseItemType;
    /**
     * The webUrl of the item being returned.
     */
    WebUrl?: ResponseItemWebUrl;
    /**
     * The document that matches the query.
     */
    DocumentMetadata?: DocumentMetadata;
    /**
     * The folder that matches the query.
     */
    FolderMetadata?: FolderMetadata;
    /**
     * The comment that matches the query.
     */
    CommentMetadata?: CommentMetadata;
    /**
     * The document version that matches the metadata.
     */
    DocumentVersionMetadata?: DocumentVersionMetadata;
  }
  export type ResponseItemType = "DOCUMENT"|"FOLDER"|"COMMENT"|"DOCUMENT_VERSION"|string;
  export type ResponseItemWebUrl = string;
  export type ResponseItemsList = ResponseItem[];
  export interface RestoreDocumentVersionsRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the document.
     */
    DocumentId: ResourceIdType;
  }
  export type RolePermissionType = "DIRECT"|"INHERITED"|string;
  export type RoleType = "VIEWER"|"CONTRIBUTOR"|"OWNER"|"COOWNER"|string;
  export type SearchAncestorId = string;
  export type SearchAncestorIdList = SearchAncestorId[];
  export type SearchCollectionType = "OWNED"|"SHARED_WITH_ME"|string;
  export type SearchCollectionTypeList = SearchCollectionType[];
  export type SearchContentCategoryTypeList = ContentCategoryType[];
  export type SearchLabel = string;
  export type SearchLabelList = SearchLabel[];
  export type SearchMarkerType = string;
  export type SearchPrincipalRoleList = PrincipalRoleType[];
  export interface SearchPrincipalType {
    /**
     * UserIds or GroupIds.
     */
    Id: IdType;
    /**
     * The Role of a User or Group.
     */
    Roles?: SearchPrincipalRoleList;
  }
  export type SearchPrincipalTypeList = SearchPrincipalType[];
  export type SearchQueryScopeType = "NAME"|"CONTENT"|string;
  export type SearchQueryScopeTypeList = SearchQueryScopeType[];
  export type SearchQueryType = string;
  export type SearchResourceType = "FOLDER"|"DOCUMENT"|"COMMENT"|"DOCUMENT_VERSION"|string;
  export type SearchResourceTypeList = SearchResourceType[];
  export interface SearchResourcesRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The String to search for. Searches across different text fields based on request parameters. Use double quotes around the query string for exact phrase matches.
     */
    QueryText?: SearchQueryType;
    /**
     * Filter based on the text field type. A Folder has only a name and no content. A Comment has only content and no name. A Document or Document Version has a name and content
     */
    QueryScopes?: SearchQueryScopeTypeList;
    /**
     * Filters based on the resource owner OrgId. This is a mandatory parameter when using Admin SigV4 credentials.
     */
    OrganizationId?: IdType;
    /**
     * A list of attributes to include in the response. Used to request fields that are not normally returned in a standard response.
     */
    AdditionalResponseFields?: AdditionalResponseFieldsList;
    /**
     * Filters results based on entity metadata.
     */
    Filters?: Filters;
    /**
     * Order by results in one or more categories.
     */
    OrderBy?: SearchResultSortList;
    /**
     * Max results count per page.
     */
    Limit?: SearchResultsLimitType;
    /**
     * The marker for the next set of results.
     */
    Marker?: NextMarkerType;
  }
  export interface SearchResourcesResponse {
    /**
     * List of Documents, Folders, Comments, and Document Versions matching the query.
     */
    Items?: ResponseItemsList;
    /**
     * The marker to use when requesting the next set of results. If there are no additional results, the string is empty.
     */
    Marker?: NextMarkerType;
  }
  export type SearchResultSortList = SearchSortResult[];
  export type SearchResultsLimitType = number;
  export interface SearchSortResult {
    /**
     * Sort search results based on this field name.
     */
    Field?: OrderByFieldType;
    /**
     * Sort direction.
     */
    Order?: SortOrder;
  }
  export interface SharePrincipal {
    /**
     * The ID of the recipient.
     */
    Id: IdType;
    /**
     * The type of the recipient.
     */
    Type: PrincipalType;
    /**
     * The role of the recipient.
     */
    Role: RoleType;
  }
  export type SharePrincipalList = SharePrincipal[];
  export interface ShareResult {
    /**
     * The ID of the principal.
     */
    PrincipalId?: IdType;
    /**
     * The ID of the invited user.
     */
    InviteePrincipalId?: IdType;
    /**
     * The role.
     */
    Role?: RoleType;
    /**
     * The status.
     */
    Status?: ShareStatusType;
    /**
     * The ID of the resource that was shared.
     */
    ShareId?: ResourceIdType;
    /**
     * The status message.
     */
    StatusMessage?: MessageType;
  }
  export type ShareResultsList = ShareResult[];
  export type ShareStatusType = "SUCCESS"|"FAILURE"|string;
  export type SharedLabel = string;
  export type SharedLabels = SharedLabel[];
  export type SignedHeaderMap = {[key: string]: HeaderValueType};
  export type SizeType = number;
  export type SortOrder = "ASC"|"DESC"|string;
  export interface StorageRuleType {
    /**
     * The amount of storage allocated, in bytes.
     */
    StorageAllocatedInBytes?: PositiveSizeType;
    /**
     * The type of storage.
     */
    StorageType?: StorageType;
  }
  export type StorageType = "UNLIMITED"|"QUOTA"|string;
  export interface Subscription {
    /**
     * The ID of the subscription.
     */
    SubscriptionId?: IdType;
    /**
     * The endpoint of the subscription.
     */
    EndPoint?: SubscriptionEndPointType;
    /**
     * The protocol of the subscription.
     */
    Protocol?: SubscriptionProtocolType;
  }
  export type SubscriptionEndPointType = string;
  export type SubscriptionList = Subscription[];
  export type SubscriptionProtocolType = "HTTPS"|"SQS"|string;
  export type SubscriptionType = "ALL"|string;
  export type TextLocaleTypeList = LanguageCodeType[];
  export type TimeZoneIdType = string;
  export type TimestampType = Date;
  export interface UpdateDocumentRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the document.
     */
    DocumentId: ResourceIdType;
    /**
     * The name of the document.
     */
    Name?: ResourceNameType;
    /**
     * The ID of the parent folder.
     */
    ParentFolderId?: ResourceIdType;
    /**
     * The resource state of the document. Only ACTIVE and RECYCLED are supported.
     */
    ResourceState?: ResourceStateType;
  }
  export interface UpdateDocumentVersionRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the document.
     */
    DocumentId: ResourceIdType;
    /**
     * The version ID of the document.
     */
    VersionId: DocumentVersionIdType;
    /**
     * The status of the version.
     */
    VersionStatus?: DocumentVersionStatus;
  }
  export interface UpdateFolderRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the folder.
     */
    FolderId: ResourceIdType;
    /**
     * The name of the folder.
     */
    Name?: ResourceNameType;
    /**
     * The ID of the parent folder.
     */
    ParentFolderId?: ResourceIdType;
    /**
     * The resource state of the folder. Only ACTIVE and RECYCLED are accepted values from the API.
     */
    ResourceState?: ResourceStateType;
  }
  export interface UpdateUserRequest {
    /**
     * Amazon WorkDocs authentication token. Not required when using Amazon Web Services administrator credentials to access the API.
     */
    AuthenticationToken?: AuthenticationHeaderType;
    /**
     * The ID of the user.
     */
    UserId: IdType;
    /**
     * The given name of the user.
     */
    GivenName?: UserAttributeValueType;
    /**
     * The surname of the user.
     */
    Surname?: UserAttributeValueType;
    /**
     * The type of the user.
     */
    Type?: UserType;
    /**
     * The amount of storage for the user.
     */
    StorageRule?: StorageRuleType;
    /**
     * The time zone ID of the user.
     */
    TimeZoneId?: TimeZoneIdType;
    /**
     * The locale of the user.
     */
    Locale?: LocaleType;
    /**
     * Boolean value to determine whether the user is granted Power user privileges.
     */
    GrantPoweruserPrivileges?: BooleanEnumType;
  }
  export interface UpdateUserResponse {
    /**
     * The user information.
     */
    User?: User;
  }
  export interface UploadMetadata {
    /**
     * The URL of the upload.
     */
    UploadUrl?: UrlType;
    /**
     * The signed headers.
     */
    SignedHeaders?: SignedHeaderMap;
  }
  export type UrlType = string;
  export interface User {
    /**
     * The ID of the user.
     */
    Id?: IdType;
    /**
     * The login name of the user.
     */
    Username?: UsernameType;
    /**
     * The email address of the user.
     */
    EmailAddress?: EmailAddressType;
    /**
     * The given name of the user.
     */
    GivenName?: UserAttributeValueType;
    /**
     * The surname of the user.
     */
    Surname?: UserAttributeValueType;
    /**
     * The ID of the organization.
     */
    OrganizationId?: IdType;
    /**
     * The ID of the root folder.
     */
    RootFolderId?: ResourceIdType;
    /**
     * The ID of the recycle bin folder.
     */
    RecycleBinFolderId?: ResourceIdType;
    /**
     * The status of the user.
     */
    Status?: UserStatusType;
    /**
     * The type of user.
     */
    Type?: UserType;
    /**
     * The time when the user was created.
     */
    CreatedTimestamp?: TimestampType;
    /**
     * The time when the user was modified.
     */
    ModifiedTimestamp?: TimestampType;
    /**
     * The time zone ID of the user.
     */
    TimeZoneId?: TimeZoneIdType;
    /**
     * The locale of the user.
     */
    Locale?: LocaleType;
    /**
     * The storage for the user.
     */
    Storage?: UserStorageMetadata;
  }
  export type UserActivities = Activity[];
  export type UserAttributeValueType = string;
  export type UserFilterType = "ALL"|"ACTIVE_PENDING"|string;
  export type UserIdsType = string;
  export interface UserMetadata {
    /**
     * The ID of the user.
     */
    Id?: IdType;
    /**
     * The name of the user.
     */
    Username?: UsernameType;
    /**
     * The given name of the user before a rename operation.
     */
    GivenName?: UserAttributeValueType;
    /**
     * The surname of the user.
     */
    Surname?: UserAttributeValueType;
    /**
     * The email address of the user.
     */
    EmailAddress?: EmailAddressType;
  }
  export type UserMetadataList = UserMetadata[];
  export type UserSortType = "USER_NAME"|"FULL_NAME"|"STORAGE_LIMIT"|"USER_STATUS"|"STORAGE_USED"|string;
  export type UserStatusType = "ACTIVE"|"INACTIVE"|"PENDING"|string;
  export interface UserStorageMetadata {
    /**
     * The amount of storage used, in bytes.
     */
    StorageUtilizedInBytes?: SizeType;
    /**
     * The storage for a user.
     */
    StorageRule?: StorageRuleType;
  }
  export type UserType = "USER"|"ADMIN"|"POWERUSER"|"MINIMALUSER"|"WORKSPACESUSER"|string;
  export type UsernameType = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-05-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the WorkDocs client.
   */
  export import Types = WorkDocs;
}
export = WorkDocs;
