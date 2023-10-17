import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Finspacedata extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Finspacedata.Types.ClientConfiguration)
  config: Config & Finspacedata.Types.ClientConfiguration;
  /**
   * Adds a user to a permission group to grant permissions for actions a user can perform in FinSpace.
   */
  associateUserToPermissionGroup(params: Finspacedata.Types.AssociateUserToPermissionGroupRequest, callback?: (err: AWSError, data: Finspacedata.Types.AssociateUserToPermissionGroupResponse) => void): Request<Finspacedata.Types.AssociateUserToPermissionGroupResponse, AWSError>;
  /**
   * Adds a user to a permission group to grant permissions for actions a user can perform in FinSpace.
   */
  associateUserToPermissionGroup(callback?: (err: AWSError, data: Finspacedata.Types.AssociateUserToPermissionGroupResponse) => void): Request<Finspacedata.Types.AssociateUserToPermissionGroupResponse, AWSError>;
  /**
   * Creates a new Changeset in a FinSpace Dataset.
   */
  createChangeset(params: Finspacedata.Types.CreateChangesetRequest, callback?: (err: AWSError, data: Finspacedata.Types.CreateChangesetResponse) => void): Request<Finspacedata.Types.CreateChangesetResponse, AWSError>;
  /**
   * Creates a new Changeset in a FinSpace Dataset.
   */
  createChangeset(callback?: (err: AWSError, data: Finspacedata.Types.CreateChangesetResponse) => void): Request<Finspacedata.Types.CreateChangesetResponse, AWSError>;
  /**
   * Creates a Dataview for a Dataset.
   */
  createDataView(params: Finspacedata.Types.CreateDataViewRequest, callback?: (err: AWSError, data: Finspacedata.Types.CreateDataViewResponse) => void): Request<Finspacedata.Types.CreateDataViewResponse, AWSError>;
  /**
   * Creates a Dataview for a Dataset.
   */
  createDataView(callback?: (err: AWSError, data: Finspacedata.Types.CreateDataViewResponse) => void): Request<Finspacedata.Types.CreateDataViewResponse, AWSError>;
  /**
   * Creates a new FinSpace Dataset.
   */
  createDataset(params: Finspacedata.Types.CreateDatasetRequest, callback?: (err: AWSError, data: Finspacedata.Types.CreateDatasetResponse) => void): Request<Finspacedata.Types.CreateDatasetResponse, AWSError>;
  /**
   * Creates a new FinSpace Dataset.
   */
  createDataset(callback?: (err: AWSError, data: Finspacedata.Types.CreateDatasetResponse) => void): Request<Finspacedata.Types.CreateDatasetResponse, AWSError>;
  /**
   * Creates a group of permissions for various actions that a user can perform in FinSpace.
   */
  createPermissionGroup(params: Finspacedata.Types.CreatePermissionGroupRequest, callback?: (err: AWSError, data: Finspacedata.Types.CreatePermissionGroupResponse) => void): Request<Finspacedata.Types.CreatePermissionGroupResponse, AWSError>;
  /**
   * Creates a group of permissions for various actions that a user can perform in FinSpace.
   */
  createPermissionGroup(callback?: (err: AWSError, data: Finspacedata.Types.CreatePermissionGroupResponse) => void): Request<Finspacedata.Types.CreatePermissionGroupResponse, AWSError>;
  /**
   * Creates a new user in FinSpace.
   */
  createUser(params: Finspacedata.Types.CreateUserRequest, callback?: (err: AWSError, data: Finspacedata.Types.CreateUserResponse) => void): Request<Finspacedata.Types.CreateUserResponse, AWSError>;
  /**
   * Creates a new user in FinSpace.
   */
  createUser(callback?: (err: AWSError, data: Finspacedata.Types.CreateUserResponse) => void): Request<Finspacedata.Types.CreateUserResponse, AWSError>;
  /**
   * Deletes a FinSpace Dataset.
   */
  deleteDataset(params: Finspacedata.Types.DeleteDatasetRequest, callback?: (err: AWSError, data: Finspacedata.Types.DeleteDatasetResponse) => void): Request<Finspacedata.Types.DeleteDatasetResponse, AWSError>;
  /**
   * Deletes a FinSpace Dataset.
   */
  deleteDataset(callback?: (err: AWSError, data: Finspacedata.Types.DeleteDatasetResponse) => void): Request<Finspacedata.Types.DeleteDatasetResponse, AWSError>;
  /**
   * Deletes a permission group. This action is irreversible.
   */
  deletePermissionGroup(params: Finspacedata.Types.DeletePermissionGroupRequest, callback?: (err: AWSError, data: Finspacedata.Types.DeletePermissionGroupResponse) => void): Request<Finspacedata.Types.DeletePermissionGroupResponse, AWSError>;
  /**
   * Deletes a permission group. This action is irreversible.
   */
  deletePermissionGroup(callback?: (err: AWSError, data: Finspacedata.Types.DeletePermissionGroupResponse) => void): Request<Finspacedata.Types.DeletePermissionGroupResponse, AWSError>;
  /**
   * Denies access to the FinSpace web application and API for the specified user.
   */
  disableUser(params: Finspacedata.Types.DisableUserRequest, callback?: (err: AWSError, data: Finspacedata.Types.DisableUserResponse) => void): Request<Finspacedata.Types.DisableUserResponse, AWSError>;
  /**
   * Denies access to the FinSpace web application and API for the specified user.
   */
  disableUser(callback?: (err: AWSError, data: Finspacedata.Types.DisableUserResponse) => void): Request<Finspacedata.Types.DisableUserResponse, AWSError>;
  /**
   * Removes a user from a permission group.
   */
  disassociateUserFromPermissionGroup(params: Finspacedata.Types.DisassociateUserFromPermissionGroupRequest, callback?: (err: AWSError, data: Finspacedata.Types.DisassociateUserFromPermissionGroupResponse) => void): Request<Finspacedata.Types.DisassociateUserFromPermissionGroupResponse, AWSError>;
  /**
   * Removes a user from a permission group.
   */
  disassociateUserFromPermissionGroup(callback?: (err: AWSError, data: Finspacedata.Types.DisassociateUserFromPermissionGroupResponse) => void): Request<Finspacedata.Types.DisassociateUserFromPermissionGroupResponse, AWSError>;
  /**
   *  Allows the specified user to access the FinSpace web application and API.
   */
  enableUser(params: Finspacedata.Types.EnableUserRequest, callback?: (err: AWSError, data: Finspacedata.Types.EnableUserResponse) => void): Request<Finspacedata.Types.EnableUserResponse, AWSError>;
  /**
   *  Allows the specified user to access the FinSpace web application and API.
   */
  enableUser(callback?: (err: AWSError, data: Finspacedata.Types.EnableUserResponse) => void): Request<Finspacedata.Types.EnableUserResponse, AWSError>;
  /**
   * Get information about a Changeset.
   */
  getChangeset(params: Finspacedata.Types.GetChangesetRequest, callback?: (err: AWSError, data: Finspacedata.Types.GetChangesetResponse) => void): Request<Finspacedata.Types.GetChangesetResponse, AWSError>;
  /**
   * Get information about a Changeset.
   */
  getChangeset(callback?: (err: AWSError, data: Finspacedata.Types.GetChangesetResponse) => void): Request<Finspacedata.Types.GetChangesetResponse, AWSError>;
  /**
   * Gets information about a Dataview.
   */
  getDataView(params: Finspacedata.Types.GetDataViewRequest, callback?: (err: AWSError, data: Finspacedata.Types.GetDataViewResponse) => void): Request<Finspacedata.Types.GetDataViewResponse, AWSError>;
  /**
   * Gets information about a Dataview.
   */
  getDataView(callback?: (err: AWSError, data: Finspacedata.Types.GetDataViewResponse) => void): Request<Finspacedata.Types.GetDataViewResponse, AWSError>;
  /**
   * Returns information about a Dataset.
   */
  getDataset(params: Finspacedata.Types.GetDatasetRequest, callback?: (err: AWSError, data: Finspacedata.Types.GetDatasetResponse) => void): Request<Finspacedata.Types.GetDatasetResponse, AWSError>;
  /**
   * Returns information about a Dataset.
   */
  getDataset(callback?: (err: AWSError, data: Finspacedata.Types.GetDatasetResponse) => void): Request<Finspacedata.Types.GetDatasetResponse, AWSError>;
  /**
   * Returns the credentials to access the external Dataview from an S3 location. To call this API:   You must retrieve the programmatic credentials.   You must be a member of a FinSpace user group, where the dataset that you want to access has Read Dataset Data permissions.  
   */
  getExternalDataViewAccessDetails(params: Finspacedata.Types.GetExternalDataViewAccessDetailsRequest, callback?: (err: AWSError, data: Finspacedata.Types.GetExternalDataViewAccessDetailsResponse) => void): Request<Finspacedata.Types.GetExternalDataViewAccessDetailsResponse, AWSError>;
  /**
   * Returns the credentials to access the external Dataview from an S3 location. To call this API:   You must retrieve the programmatic credentials.   You must be a member of a FinSpace user group, where the dataset that you want to access has Read Dataset Data permissions.  
   */
  getExternalDataViewAccessDetails(callback?: (err: AWSError, data: Finspacedata.Types.GetExternalDataViewAccessDetailsResponse) => void): Request<Finspacedata.Types.GetExternalDataViewAccessDetailsResponse, AWSError>;
  /**
   * Retrieves the details of a specific permission group.
   */
  getPermissionGroup(params: Finspacedata.Types.GetPermissionGroupRequest, callback?: (err: AWSError, data: Finspacedata.Types.GetPermissionGroupResponse) => void): Request<Finspacedata.Types.GetPermissionGroupResponse, AWSError>;
  /**
   * Retrieves the details of a specific permission group.
   */
  getPermissionGroup(callback?: (err: AWSError, data: Finspacedata.Types.GetPermissionGroupResponse) => void): Request<Finspacedata.Types.GetPermissionGroupResponse, AWSError>;
  /**
   * Request programmatic credentials to use with FinSpace SDK. For more information, see Step 2. Access credentials programmatically using IAM access key id and secret access key.
   */
  getProgrammaticAccessCredentials(params: Finspacedata.Types.GetProgrammaticAccessCredentialsRequest, callback?: (err: AWSError, data: Finspacedata.Types.GetProgrammaticAccessCredentialsResponse) => void): Request<Finspacedata.Types.GetProgrammaticAccessCredentialsResponse, AWSError>;
  /**
   * Request programmatic credentials to use with FinSpace SDK. For more information, see Step 2. Access credentials programmatically using IAM access key id and secret access key.
   */
  getProgrammaticAccessCredentials(callback?: (err: AWSError, data: Finspacedata.Types.GetProgrammaticAccessCredentialsResponse) => void): Request<Finspacedata.Types.GetProgrammaticAccessCredentialsResponse, AWSError>;
  /**
   * Retrieves details for a specific user.
   */
  getUser(params: Finspacedata.Types.GetUserRequest, callback?: (err: AWSError, data: Finspacedata.Types.GetUserResponse) => void): Request<Finspacedata.Types.GetUserResponse, AWSError>;
  /**
   * Retrieves details for a specific user.
   */
  getUser(callback?: (err: AWSError, data: Finspacedata.Types.GetUserResponse) => void): Request<Finspacedata.Types.GetUserResponse, AWSError>;
  /**
   * A temporary Amazon S3 location, where you can copy your files from a source location to stage or use as a scratch space in FinSpace notebook.
   */
  getWorkingLocation(params: Finspacedata.Types.GetWorkingLocationRequest, callback?: (err: AWSError, data: Finspacedata.Types.GetWorkingLocationResponse) => void): Request<Finspacedata.Types.GetWorkingLocationResponse, AWSError>;
  /**
   * A temporary Amazon S3 location, where you can copy your files from a source location to stage or use as a scratch space in FinSpace notebook.
   */
  getWorkingLocation(callback?: (err: AWSError, data: Finspacedata.Types.GetWorkingLocationResponse) => void): Request<Finspacedata.Types.GetWorkingLocationResponse, AWSError>;
  /**
   * Lists the FinSpace Changesets for a Dataset.
   */
  listChangesets(params: Finspacedata.Types.ListChangesetsRequest, callback?: (err: AWSError, data: Finspacedata.Types.ListChangesetsResponse) => void): Request<Finspacedata.Types.ListChangesetsResponse, AWSError>;
  /**
   * Lists the FinSpace Changesets for a Dataset.
   */
  listChangesets(callback?: (err: AWSError, data: Finspacedata.Types.ListChangesetsResponse) => void): Request<Finspacedata.Types.ListChangesetsResponse, AWSError>;
  /**
   * Lists all available Dataviews for a Dataset.
   */
  listDataViews(params: Finspacedata.Types.ListDataViewsRequest, callback?: (err: AWSError, data: Finspacedata.Types.ListDataViewsResponse) => void): Request<Finspacedata.Types.ListDataViewsResponse, AWSError>;
  /**
   * Lists all available Dataviews for a Dataset.
   */
  listDataViews(callback?: (err: AWSError, data: Finspacedata.Types.ListDataViewsResponse) => void): Request<Finspacedata.Types.ListDataViewsResponse, AWSError>;
  /**
   * Lists all of the active Datasets that a user has access to.
   */
  listDatasets(params: Finspacedata.Types.ListDatasetsRequest, callback?: (err: AWSError, data: Finspacedata.Types.ListDatasetsResponse) => void): Request<Finspacedata.Types.ListDatasetsResponse, AWSError>;
  /**
   * Lists all of the active Datasets that a user has access to.
   */
  listDatasets(callback?: (err: AWSError, data: Finspacedata.Types.ListDatasetsResponse) => void): Request<Finspacedata.Types.ListDatasetsResponse, AWSError>;
  /**
   * Lists all available permission groups in FinSpace.
   */
  listPermissionGroups(params: Finspacedata.Types.ListPermissionGroupsRequest, callback?: (err: AWSError, data: Finspacedata.Types.ListPermissionGroupsResponse) => void): Request<Finspacedata.Types.ListPermissionGroupsResponse, AWSError>;
  /**
   * Lists all available permission groups in FinSpace.
   */
  listPermissionGroups(callback?: (err: AWSError, data: Finspacedata.Types.ListPermissionGroupsResponse) => void): Request<Finspacedata.Types.ListPermissionGroupsResponse, AWSError>;
  /**
   * Lists all the permission groups that are associated with a specific user.
   */
  listPermissionGroupsByUser(params: Finspacedata.Types.ListPermissionGroupsByUserRequest, callback?: (err: AWSError, data: Finspacedata.Types.ListPermissionGroupsByUserResponse) => void): Request<Finspacedata.Types.ListPermissionGroupsByUserResponse, AWSError>;
  /**
   * Lists all the permission groups that are associated with a specific user.
   */
  listPermissionGroupsByUser(callback?: (err: AWSError, data: Finspacedata.Types.ListPermissionGroupsByUserResponse) => void): Request<Finspacedata.Types.ListPermissionGroupsByUserResponse, AWSError>;
  /**
   * Lists all available users in FinSpace.
   */
  listUsers(params: Finspacedata.Types.ListUsersRequest, callback?: (err: AWSError, data: Finspacedata.Types.ListUsersResponse) => void): Request<Finspacedata.Types.ListUsersResponse, AWSError>;
  /**
   * Lists all available users in FinSpace.
   */
  listUsers(callback?: (err: AWSError, data: Finspacedata.Types.ListUsersResponse) => void): Request<Finspacedata.Types.ListUsersResponse, AWSError>;
  /**
   * Lists details of all the users in a specific permission group.
   */
  listUsersByPermissionGroup(params: Finspacedata.Types.ListUsersByPermissionGroupRequest, callback?: (err: AWSError, data: Finspacedata.Types.ListUsersByPermissionGroupResponse) => void): Request<Finspacedata.Types.ListUsersByPermissionGroupResponse, AWSError>;
  /**
   * Lists details of all the users in a specific permission group.
   */
  listUsersByPermissionGroup(callback?: (err: AWSError, data: Finspacedata.Types.ListUsersByPermissionGroupResponse) => void): Request<Finspacedata.Types.ListUsersByPermissionGroupResponse, AWSError>;
  /**
   * Resets the password for a specified user ID and generates a temporary one. Only a superuser can reset password for other users. Resetting the password immediately invalidates the previous password associated with the user.
   */
  resetUserPassword(params: Finspacedata.Types.ResetUserPasswordRequest, callback?: (err: AWSError, data: Finspacedata.Types.ResetUserPasswordResponse) => void): Request<Finspacedata.Types.ResetUserPasswordResponse, AWSError>;
  /**
   * Resets the password for a specified user ID and generates a temporary one. Only a superuser can reset password for other users. Resetting the password immediately invalidates the previous password associated with the user.
   */
  resetUserPassword(callback?: (err: AWSError, data: Finspacedata.Types.ResetUserPasswordResponse) => void): Request<Finspacedata.Types.ResetUserPasswordResponse, AWSError>;
  /**
   * Updates a FinSpace Changeset.
   */
  updateChangeset(params: Finspacedata.Types.UpdateChangesetRequest, callback?: (err: AWSError, data: Finspacedata.Types.UpdateChangesetResponse) => void): Request<Finspacedata.Types.UpdateChangesetResponse, AWSError>;
  /**
   * Updates a FinSpace Changeset.
   */
  updateChangeset(callback?: (err: AWSError, data: Finspacedata.Types.UpdateChangesetResponse) => void): Request<Finspacedata.Types.UpdateChangesetResponse, AWSError>;
  /**
   * Updates a FinSpace Dataset.
   */
  updateDataset(params: Finspacedata.Types.UpdateDatasetRequest, callback?: (err: AWSError, data: Finspacedata.Types.UpdateDatasetResponse) => void): Request<Finspacedata.Types.UpdateDatasetResponse, AWSError>;
  /**
   * Updates a FinSpace Dataset.
   */
  updateDataset(callback?: (err: AWSError, data: Finspacedata.Types.UpdateDatasetResponse) => void): Request<Finspacedata.Types.UpdateDatasetResponse, AWSError>;
  /**
   * Modifies the details of a permission group. You cannot modify a permissionGroupID.
   */
  updatePermissionGroup(params: Finspacedata.Types.UpdatePermissionGroupRequest, callback?: (err: AWSError, data: Finspacedata.Types.UpdatePermissionGroupResponse) => void): Request<Finspacedata.Types.UpdatePermissionGroupResponse, AWSError>;
  /**
   * Modifies the details of a permission group. You cannot modify a permissionGroupID.
   */
  updatePermissionGroup(callback?: (err: AWSError, data: Finspacedata.Types.UpdatePermissionGroupResponse) => void): Request<Finspacedata.Types.UpdatePermissionGroupResponse, AWSError>;
  /**
   * Modifies the details of the specified user. You cannot update the userId for a user.
   */
  updateUser(params: Finspacedata.Types.UpdateUserRequest, callback?: (err: AWSError, data: Finspacedata.Types.UpdateUserResponse) => void): Request<Finspacedata.Types.UpdateUserResponse, AWSError>;
  /**
   * Modifies the details of the specified user. You cannot update the userId for a user.
   */
  updateUser(callback?: (err: AWSError, data: Finspacedata.Types.UpdateUserResponse) => void): Request<Finspacedata.Types.UpdateUserResponse, AWSError>;
}
declare namespace Finspacedata {
  export type AccessKeyId = string;
  export type AliasString = string;
  export type ApiAccess = "ENABLED"|"DISABLED"|string;
  export type ApplicationPermission = "CreateDataset"|"ManageClusters"|"ManageUsersAndGroups"|"ManageAttributeSets"|"ViewAuditData"|"AccessNotebooks"|"GetTemporaryCredentials"|string;
  export type ApplicationPermissionList = ApplicationPermission[];
  export interface AssociateUserToPermissionGroupRequest {
    /**
     * The unique identifier for the permission group.
     */
    permissionGroupId: PermissionGroupId;
    /**
     * The unique identifier for the user.
     */
    userId: UserId;
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
  }
  export interface AssociateUserToPermissionGroupResponse {
    /**
     * The returned status code of the response.
     */
    statusCode?: StatusCode;
  }
  export interface AwsCredentials {
    /**
     *  The unique identifier for the security credentials.
     */
    accessKeyId?: AccessKeyId;
    /**
     *  The secret access key that can be used to sign requests.
     */
    secretAccessKey?: SecretAccessKey;
    /**
     *  The token that users must pass to use the credentials.
     */
    sessionToken?: SessionToken;
    /**
     *  The Epoch time when the current credentials expire.
     */
    expiration?: TimestampEpoch;
  }
  export type Boolean = boolean;
  export type ChangeType = "REPLACE"|"APPEND"|"MODIFY"|string;
  export type ChangesetArn = string;
  export interface ChangesetErrorInfo {
    /**
     * The text of the error message.
     */
    errorMessage?: ErrorMessage;
    /**
     * The category of the error.    VALIDATION – The inputs to this request are invalid.    SERVICE_QUOTA_EXCEEDED – Service quotas have been exceeded. Please contact AWS support to increase quotas.    ACCESS_DENIED – Missing required permission to perform this request.    RESOURCE_NOT_FOUND – One or more inputs to this request were not found.    THROTTLING – The system temporarily lacks sufficient resources to process the request.    INTERNAL_SERVICE_EXCEPTION – An internal service error has occurred.    CANCELLED – Cancelled.    USER_RECOVERABLE – A user recoverable error has occurred.  
     */
    errorCategory?: ErrorCategory;
  }
  export type ChangesetId = string;
  export type ChangesetList = ChangesetSummary[];
  export interface ChangesetSummary {
    /**
     * The unique identifier for a Changeset.
     */
    changesetId?: ChangesetId;
    /**
     * The ARN identifier of the Changeset.
     */
    changesetArn?: ChangesetArn;
    /**
     * The unique identifier for the FinSpace Dataset in which the Changeset is created.
     */
    datasetId?: DatasetId;
    /**
     * Type that indicates how a Changeset is applied to a Dataset.    REPLACE – Changeset is considered as a replacement to all prior loaded Changesets.    APPEND – Changeset is considered as an addition to the end of all prior loaded Changesets.    MODIFY – Changeset is considered as a replacement to a specific prior ingested Changeset.  
     */
    changeType?: ChangeType;
    /**
     * Options that define the location of the data being ingested.
     */
    sourceParams?: SourceParams;
    /**
     * Options that define the structure of the source file(s).
     */
    formatParams?: FormatParams;
    /**
     * The timestamp at which the Changeset was created in FinSpace. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    createTime?: TimestampEpoch;
    /**
     * Status of the Changeset ingestion.    PENDING – Changeset is pending creation.    FAILED – Changeset creation has failed.    SUCCESS – Changeset creation has succeeded.    RUNNING – Changeset creation is running.    STOP_REQUESTED – User requested Changeset creation to stop.  
     */
    status?: IngestionStatus;
    /**
     * The structure with error messages.
     */
    errorInfo?: ChangesetErrorInfo;
    /**
     * Time until which the Changeset is active. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    activeUntilTimestamp?: TimestampEpoch;
    /**
     * Beginning time from which the Changeset is active. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    activeFromTimestamp?: TimestampEpoch;
    /**
     * The unique identifier of the Changeset that is updated.
     */
    updatesChangesetId?: ChangesetId;
    /**
     * The unique identifier of the updated Changeset.
     */
    updatedByChangesetId?: ChangesetId;
  }
  export type ClientToken = string;
  export type ColumnDataType = "STRING"|"CHAR"|"INTEGER"|"TINYINT"|"SMALLINT"|"BIGINT"|"FLOAT"|"DOUBLE"|"DATE"|"DATETIME"|"BOOLEAN"|"BINARY"|string;
  export interface ColumnDefinition {
    /**
     * Data type of a column.    STRING – A String data type.  CHAR – A char data type.  INTEGER – An integer data type.  TINYINT – A tinyint data type.  SMALLINT – A smallint data type.  BIGINT – A bigint data type.  FLOAT – A float data type.  DOUBLE – A double data type.  DATE – A date data type.  DATETIME – A datetime data type.  BOOLEAN – A boolean data type.  BINARY – A binary data type.  
     */
    dataType?: ColumnDataType;
    /**
     * The name of a column.
     */
    columnName?: ColumnName;
    /**
     * Description for a column.
     */
    columnDescription?: ColumnDescription;
  }
  export type ColumnDescription = string;
  export type ColumnList = ColumnDefinition[];
  export type ColumnName = string;
  export type ColumnNameList = ColumnName[];
  export interface CreateChangesetRequest {
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
    /**
     * The unique identifier for the FinSpace Dataset where the Changeset will be created. 
     */
    datasetId: DatasetId;
    /**
     * The option to indicate how a Changeset will be applied to a Dataset.    REPLACE – Changeset will be considered as a replacement to all prior loaded Changesets.    APPEND – Changeset will be considered as an addition to the end of all prior loaded Changesets.    MODIFY – Changeset is considered as a replacement to a specific prior ingested Changeset.  
     */
    changeType: ChangeType;
    /**
     * Options that define the location of the data being ingested (s3SourcePath) and the source of the changeset (sourceType). Both s3SourcePath and sourceType are required attributes. Here is an example of how you could specify the sourceParams:   "sourceParams": { "s3SourcePath": "s3://finspace-landing-us-east-2-bk7gcfvitndqa6ebnvys4d/scratch/wr5hh8pwkpqqkxa4sxrmcw/ingestion/equity.csv", "sourceType": "S3" }   The S3 path that you specify must allow the FinSpace role access. To do that, you first need to configure the IAM policy on S3 bucket. For more information, see Loading data from an Amazon S3 Bucket using the FinSpace API section.
     */
    sourceParams: SourceParams;
    /**
     * Options that define the structure of the source file(s) including the format type (formatType), header row (withHeader), data separation character (separator) and the type of compression (compression).   formatType is a required attribute and can have the following values:     PARQUET – Parquet source file format.    CSV – CSV source file format.    JSON – JSON source file format.    XML – XML source file format.   Here is an example of how you could specify the formatParams:   "formatParams": { "formatType": "CSV", "withHeader": "true", "separator": ",", "compression":"None" }   Note that if you only provide formatType as CSV, the rest of the attributes will automatically default to CSV values as following:   { "withHeader": "true", "separator": "," }    For more information about supported file formats, see Supported Data Types and File Formats in the FinSpace User Guide.
     */
    formatParams: FormatParams;
  }
  export interface CreateChangesetResponse {
    /**
     * The unique identifier for the FinSpace Dataset where the Changeset is created.
     */
    datasetId?: DatasetId;
    /**
     * The unique identifier of the Changeset that is created.
     */
    changesetId?: ChangesetId;
  }
  export interface CreateDataViewRequest {
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
    /**
     * The unique Dataset identifier that is used to create a Dataview.
     */
    datasetId: DatasetId;
    /**
     * Flag to indicate Dataview should be updated automatically.
     */
    autoUpdate?: Boolean;
    /**
     * Columns to be used for sorting the data.
     */
    sortColumns?: SortColumnList;
    /**
     * Ordered set of column names used to partition data.
     */
    partitionColumns?: PartitionColumnList;
    /**
     * Beginning time to use for the Dataview. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    asOfTimestamp?: TimestampEpoch;
    /**
     * Options that define the destination type for the Dataview.
     */
    destinationTypeParams: DataViewDestinationTypeParams;
  }
  export interface CreateDataViewResponse {
    /**
     * The unique identifier of the Dataset used for the Dataview.
     */
    datasetId?: DatasetId;
    /**
     * The unique identifier for the created Dataview.
     */
    dataViewId?: DataViewId;
  }
  export interface CreateDatasetRequest {
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
    /**
     * Display title for a FinSpace Dataset.
     */
    datasetTitle: DatasetTitle;
    /**
     * The format in which Dataset data is structured.    TABULAR – Data is structured in a tabular format.    NON_TABULAR – Data is structured in a non-tabular format.  
     */
    kind: DatasetKind;
    /**
     * Description of a Dataset.
     */
    datasetDescription?: DatasetDescription;
    /**
     * Contact information for a Dataset owner.
     */
    ownerInfo?: DatasetOwnerInfo;
    /**
     * Permission group parameters for Dataset permissions.
     */
    permissionGroupParams: PermissionGroupParams;
    /**
     * The unique resource identifier for a Dataset.
     */
    alias?: AliasString;
    /**
     * Definition for a schema on a tabular Dataset.
     */
    schemaDefinition?: SchemaUnion;
  }
  export interface CreateDatasetResponse {
    /**
     * The unique identifier for the created Dataset.
     */
    datasetId?: DatasetId;
  }
  export interface CreatePermissionGroupRequest {
    /**
     * The name of the permission group.
     */
    name: PermissionGroupName;
    /**
     * A brief description for the permission group.
     */
    description?: PermissionGroupDescription;
    /**
     * The option to indicate FinSpace application permissions that are granted to a specific group.  When assigning application permissions, be aware that the permission ManageUsersAndGroups allows users to grant themselves or others access to any functionality in their FinSpace environment's application. It should only be granted to trusted users.     CreateDataset – Group members can create new datasets.    ManageClusters – Group members can manage Apache Spark clusters from FinSpace notebooks.    ManageUsersAndGroups – Group members can manage users and permission groups. This is a privileged permission that allows users to grant themselves or others access to any functionality in the application. It should only be granted to trusted users.    ManageAttributeSets – Group members can manage attribute sets.    ViewAuditData – Group members can view audit data.    AccessNotebooks – Group members will have access to FinSpace notebooks.    GetTemporaryCredentials – Group members can get temporary API credentials.  
     */
    applicationPermissions: ApplicationPermissionList;
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
  }
  export interface CreatePermissionGroupResponse {
    /**
     * The unique identifier for the permission group.
     */
    permissionGroupId?: PermissionGroupId;
  }
  export interface CreateUserRequest {
    /**
     * The email address of the user that you want to register. The email address serves as a uniquer identifier for each user and cannot be changed after it's created.
     */
    emailAddress: Email;
    /**
     * The option to indicate the type of user. Use one of the following options to specify this parameter:    SUPER_USER – A user with permission to all the functionality and data in FinSpace.    APP_USER – A user with specific permissions in FinSpace. The users are assigned permissions by adding them to a permission group.  
     */
    type: UserType;
    /**
     * The first name of the user that you want to register.
     */
    firstName?: FirstName;
    /**
     * The last name of the user that you want to register.
     */
    lastName?: LastName;
    /**
     * The option to indicate whether the user can use the GetProgrammaticAccessCredentials API to obtain credentials that can then be used to access other FinSpace Data API operations.    ENABLED – The user has permissions to use the APIs.    DISABLED – The user does not have permissions to use any APIs.  
     */
    apiAccess?: ApiAccess;
    /**
     * The ARN identifier of an AWS user or role that is allowed to call the GetProgrammaticAccessCredentials API to obtain a credentials token for a specific FinSpace user. This must be an IAM role within your FinSpace account.
     */
    apiAccessPrincipalArn?: RoleArn;
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
  }
  export interface CreateUserResponse {
    /**
     * The unique identifier for the user.
     */
    userId?: UserId;
  }
  export interface Credentials {
    /**
     * The access key identifier.
     */
    accessKeyId?: stringValueLength1to255;
    /**
     * The access key.
     */
    secretAccessKey?: stringValueMaxLength1000;
    /**
     * The session token.
     */
    sessionToken?: stringValueMaxLength1000;
  }
  export type DataViewArn = string;
  export type DataViewDestinationType = string;
  export interface DataViewDestinationTypeParams {
    /**
     * Destination type for a Dataview.    GLUE_TABLE – Glue table destination type.    S3 – S3 destination type.  
     */
    destinationType: DataViewDestinationType;
    /**
     * Dataview export file format.    PARQUET – Parquet export file format.    DELIMITED_TEXT – Delimited text export file format.  
     */
    s3DestinationExportFileFormat?: ExportFileFormat;
    /**
     * Format Options for S3 Destination type. Here is an example of how you could specify the s3DestinationExportFileFormatOptions    { "header": "true", "delimiter": ",", "compression": "gzip" } 
     */
    s3DestinationExportFileFormatOptions?: S3DestinationFormatOptions;
  }
  export interface DataViewErrorInfo {
    /**
     * The text of the error message.
     */
    errorMessage?: ErrorMessage;
    /**
     * The category of the error.    VALIDATION – The inputs to this request are invalid.    SERVICE_QUOTA_EXCEEDED – Service quotas have been exceeded. Please contact AWS support to increase quotas.    ACCESS_DENIED – Missing required permission to perform this request.    RESOURCE_NOT_FOUND – One or more inputs to this request were not found.    THROTTLING – The system temporarily lacks sufficient resources to process the request.    INTERNAL_SERVICE_EXCEPTION – An internal service error has occurred.    CANCELLED – Cancelled.    USER_RECOVERABLE – A user recoverable error has occurred.  
     */
    errorCategory?: ErrorCategory;
  }
  export type DataViewId = string;
  export type DataViewList = DataViewSummary[];
  export type DataViewStatus = "RUNNING"|"STARTING"|"FAILED"|"CANCELLED"|"TIMEOUT"|"SUCCESS"|"PENDING"|"FAILED_CLEANUP_FAILED"|string;
  export interface DataViewSummary {
    /**
     * The unique identifier for the Dataview.
     */
    dataViewId?: DataViewId;
    /**
     * The ARN identifier of the Dataview.
     */
    dataViewArn?: DataViewArn;
    /**
     * Th unique identifier for the Dataview Dataset.
     */
    datasetId?: DatasetId;
    /**
     * Time range to use for the Dataview. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    asOfTimestamp?: TimestampEpoch;
    /**
     * Ordered set of column names used to partition data.
     */
    partitionColumns?: PartitionColumnList;
    /**
     * Columns to be used for sorting the data.
     */
    sortColumns?: SortColumnList;
    /**
     * The status of a Dataview creation.    RUNNING – Dataview creation is running.    STARTING – Dataview creation is starting.    FAILED – Dataview creation has failed.    CANCELLED – Dataview creation has been cancelled.    TIMEOUT – Dataview creation has timed out.    SUCCESS – Dataview creation has succeeded.    PENDING – Dataview creation is pending.    FAILED_CLEANUP_FAILED – Dataview creation failed and resource cleanup failed.  
     */
    status?: DataViewStatus;
    /**
     * The structure with error messages.
     */
    errorInfo?: DataViewErrorInfo;
    /**
     * Information about the Dataview destination.
     */
    destinationTypeProperties?: DataViewDestinationTypeParams;
    /**
     * The flag to indicate Dataview should be updated automatically.
     */
    autoUpdate?: Boolean;
    /**
     * The timestamp at which the Dataview was created in FinSpace. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    createTime?: TimestampEpoch;
    /**
     * The last time that a Dataview was modified. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    lastModifiedTime?: TimestampEpoch;
  }
  export interface Dataset {
    /**
     * An identifier for a Dataset.
     */
    datasetId?: DatasetId;
    /**
     * The ARN identifier of the Dataset.
     */
    datasetArn?: DatasetArn;
    /**
     * Display title for a Dataset.
     */
    datasetTitle?: DatasetTitle;
    /**
     * The format in which Dataset data is structured.    TABULAR – Data is structured in a tabular format.    NON_TABULAR – Data is structured in a non-tabular format.  
     */
    kind?: DatasetKind;
    /**
     * Description for a Dataset.
     */
    datasetDescription?: DatasetDescription;
    /**
     * Contact information for a Dataset owner.
     */
    ownerInfo?: DatasetOwnerInfo;
    /**
     * The timestamp at which the Dataset was created in FinSpace. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    createTime?: TimestampEpoch;
    /**
     * The last time that the Dataset was modified. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    lastModifiedTime?: TimestampEpoch;
    /**
     * Definition for a schema on a tabular Dataset.
     */
    schemaDefinition?: SchemaUnion;
    /**
     * The unique resource identifier for a Dataset.
     */
    alias?: AliasString;
  }
  export type DatasetArn = string;
  export type DatasetDescription = string;
  export type DatasetId = string;
  export type DatasetKind = "TABULAR"|"NON_TABULAR"|string;
  export type DatasetList = Dataset[];
  export interface DatasetOwnerInfo {
    /**
     * The name of the Dataset owner.
     */
    name?: OwnerName;
    /**
     * Phone number for the Dataset owner.
     */
    phoneNumber?: PhoneNumber;
    /**
     * Email address for the Dataset owner.
     */
    email?: Email;
  }
  export type DatasetStatus = "PENDING"|"FAILED"|"SUCCESS"|"RUNNING"|string;
  export type DatasetTitle = string;
  export interface DeleteDatasetRequest {
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
    /**
     * The unique identifier of the Dataset to be deleted.
     */
    datasetId: DatasetId;
  }
  export interface DeleteDatasetResponse {
    /**
     * The unique identifier for the deleted Dataset.
     */
    datasetId?: DatasetId;
  }
  export interface DeletePermissionGroupRequest {
    /**
     * The unique identifier for the permission group that you want to delete.
     */
    permissionGroupId: PermissionGroupId;
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
  }
  export interface DeletePermissionGroupResponse {
    /**
     * The unique identifier for the deleted permission group.
     */
    permissionGroupId?: PermissionGroupId;
  }
  export interface DisableUserRequest {
    /**
     * The unique identifier for the user that you want to deactivate.
     */
    userId: UserId;
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
  }
  export interface DisableUserResponse {
    /**
     * The unique identifier for the deactivated user.
     */
    userId?: UserId;
  }
  export interface DisassociateUserFromPermissionGroupRequest {
    /**
     * The unique identifier for the permission group.
     */
    permissionGroupId: PermissionGroupId;
    /**
     * The unique identifier for the user.
     */
    userId: UserId;
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
  }
  export interface DisassociateUserFromPermissionGroupResponse {
    /**
     * The returned status code of the response.
     */
    statusCode?: StatusCode;
  }
  export type Email = string;
  export interface EnableUserRequest {
    /**
     * The unique identifier for the user that you want to activate.
     */
    userId: UserId;
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
  }
  export interface EnableUserResponse {
    /**
     * The unique identifier for the active user.
     */
    userId?: UserId;
  }
  export type ErrorCategory = "VALIDATION"|"SERVICE_QUOTA_EXCEEDED"|"ACCESS_DENIED"|"RESOURCE_NOT_FOUND"|"THROTTLING"|"INTERNAL_SERVICE_EXCEPTION"|"CANCELLED"|"USER_RECOVERABLE"|string;
  export type ErrorMessage = string;
  export type ExportFileFormat = "PARQUET"|"DELIMITED_TEXT"|string;
  export type FirstName = string;
  export type FormatParams = {[key: string]: StringMapValue};
  export interface GetChangesetRequest {
    /**
     * The unique identifier for the FinSpace Dataset where the Changeset is created.
     */
    datasetId: DatasetId;
    /**
     * The unique identifier of the Changeset for which to get data.
     */
    changesetId: ChangesetId;
  }
  export interface GetChangesetResponse {
    /**
     * The unique identifier for a Changeset.
     */
    changesetId?: ChangesetId;
    /**
     * The ARN identifier of the Changeset.
     */
    changesetArn?: ChangesetArn;
    /**
     * The unique identifier for the FinSpace Dataset where the Changeset is created.
     */
    datasetId?: DatasetId;
    /**
     * Type that indicates how a Changeset is applied to a Dataset.    REPLACE – Changeset is considered as a replacement to all prior loaded Changesets.    APPEND – Changeset is considered as an addition to the end of all prior loaded Changesets.    MODIFY – Changeset is considered as a replacement to a specific prior ingested Changeset.  
     */
    changeType?: ChangeType;
    /**
     * Options that define the location of the data being ingested.
     */
    sourceParams?: SourceParams;
    /**
     * Structure of the source file(s).
     */
    formatParams?: FormatParams;
    /**
     * The timestamp at which the Changeset was created in FinSpace. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    createTime?: TimestampEpoch;
    /**
     * The status of Changeset creation operation.
     */
    status?: IngestionStatus;
    /**
     * The structure with error messages.
     */
    errorInfo?: ChangesetErrorInfo;
    /**
     * Time until which the Changeset is active. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    activeUntilTimestamp?: TimestampEpoch;
    /**
     * Beginning time from which the Changeset is active. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    activeFromTimestamp?: TimestampEpoch;
    /**
     * The unique identifier of the Changeset that is being updated.
     */
    updatesChangesetId?: ChangesetId;
    /**
     * The unique identifier of the updated Changeset.
     */
    updatedByChangesetId?: ChangesetId;
  }
  export interface GetDataViewRequest {
    /**
     * The unique identifier for the Dataview.
     */
    dataViewId: DataViewId;
    /**
     * The unique identifier for the Dataset used in the Dataview.
     */
    datasetId: DatasetId;
  }
  export interface GetDataViewResponse {
    /**
     * Flag to indicate Dataview should be updated automatically.
     */
    autoUpdate?: Boolean;
    /**
     * Ordered set of column names used to partition data.
     */
    partitionColumns?: PartitionColumnList;
    /**
     * The unique identifier for the Dataset used in the Dataview.
     */
    datasetId?: DatasetId;
    /**
     * Time range to use for the Dataview. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    asOfTimestamp?: TimestampEpoch;
    /**
     * Information about an error that occurred for the Dataview.
     */
    errorInfo?: DataViewErrorInfo;
    /**
     * The last time that a Dataview was modified. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    lastModifiedTime?: TimestampEpoch;
    /**
     * The timestamp at which the Dataview was created in FinSpace. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    createTime?: TimestampEpoch;
    /**
     * Columns to be used for sorting the data.
     */
    sortColumns?: SortColumnList;
    /**
     * The unique identifier for the Dataview.
     */
    dataViewId?: DataViewId;
    /**
     * The ARN identifier of the Dataview.
     */
    dataViewArn?: DataViewArn;
    /**
     * Options that define the destination type for the Dataview.
     */
    destinationTypeParams?: DataViewDestinationTypeParams;
    /**
     * The status of a Dataview creation.    RUNNING – Dataview creation is running.    STARTING – Dataview creation is starting.    FAILED – Dataview creation has failed.    CANCELLED – Dataview creation has been cancelled.    TIMEOUT – Dataview creation has timed out.    SUCCESS – Dataview creation has succeeded.    PENDING – Dataview creation is pending.    FAILED_CLEANUP_FAILED – Dataview creation failed and resource cleanup failed.  
     */
    status?: DataViewStatus;
  }
  export interface GetDatasetRequest {
    /**
     * The unique identifier for a Dataset.
     */
    datasetId: StringValueLength1to255;
  }
  export interface GetDatasetResponse {
    /**
     * The unique identifier for a Dataset.
     */
    datasetId?: DatasetId;
    /**
     * The ARN identifier of the Dataset.
     */
    datasetArn?: DatasetArn;
    /**
     * Display title for a Dataset.
     */
    datasetTitle?: DatasetTitle;
    /**
     * The format in which Dataset data is structured.    TABULAR – Data is structured in a tabular format.    NON_TABULAR – Data is structured in a non-tabular format.  
     */
    kind?: DatasetKind;
    /**
     * A description of the Dataset.
     */
    datasetDescription?: DatasetDescription;
    /**
     * The timestamp at which the Dataset was created in FinSpace. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    createTime?: TimestampEpoch;
    /**
     * The last time that the Dataset was modified. The value is determined as epoch time in milliseconds. For example, the value for Monday, November 1, 2021 12:00:00 PM UTC is specified as 1635768000000.
     */
    lastModifiedTime?: TimestampEpoch;
    /**
     * Definition for a schema on a tabular Dataset.
     */
    schemaDefinition?: SchemaUnion;
    /**
     * The unique resource identifier for a Dataset.
     */
    alias?: AliasString;
    /**
     * Status of the Dataset creation.    PENDING – Dataset is pending creation.    FAILED – Dataset creation has failed.    SUCCESS – Dataset creation has succeeded.    RUNNING – Dataset creation is running.  
     */
    status?: DatasetStatus;
  }
  export interface GetExternalDataViewAccessDetailsRequest {
    /**
     * The unique identifier for the Dataview that you want to access.
     */
    dataViewId: DataViewId;
    /**
     * The unique identifier for the Dataset.
     */
    datasetId: DatasetId;
  }
  export interface GetExternalDataViewAccessDetailsResponse {
    /**
     * The credentials required to access the external Dataview from the S3 location.
     */
    credentials?: AwsCredentials;
    /**
     * The location where the external Dataview is stored.
     */
    s3Location?: S3Location;
  }
  export interface GetPermissionGroupRequest {
    /**
     * The unique identifier for the permission group.
     */
    permissionGroupId: PermissionGroupId;
  }
  export interface GetPermissionGroupResponse {
    permissionGroup?: PermissionGroup;
  }
  export interface GetProgrammaticAccessCredentialsRequest {
    /**
     * The time duration in which the credentials remain valid. 
     */
    durationInMinutes?: SessionDuration;
    /**
     * The FinSpace environment identifier.
     */
    environmentId: IdType;
  }
  export interface GetProgrammaticAccessCredentialsResponse {
    /**
     * Returns the programmatic credentials.
     */
    credentials?: Credentials;
    /**
     * Returns the duration in which the credentials will remain valid.
     */
    durationInMinutes?: SessionDuration;
  }
  export interface GetUserRequest {
    /**
     * The unique identifier of the user to get data for.
     */
    userId: UserId;
  }
  export interface GetUserResponse {
    /**
     * The unique identifier for the user that is retrieved.
     */
    userId?: UserId;
    /**
     * The current status of the user.     CREATING – The creation is in progress.    ENABLED – The user is created and is currently active.    DISABLED – The user is currently inactive.  
     */
    status?: UserStatus;
    /**
     * The first name of the user.
     */
    firstName?: FirstName;
    /**
     * The last name of the user.
     */
    lastName?: LastName;
    /**
     * The email address that is associated with the user.
     */
    emailAddress?: Email;
    /**
     * Indicates the type of user.     SUPER_USER – A user with permission to all the functionality and data in FinSpace.      APP_USER – A user with specific permissions in FinSpace. The users are assigned permissions by adding them to a permission group.  
     */
    type?: UserType;
    /**
     * Indicates whether the user can use the GetProgrammaticAccessCredentials API to obtain credentials that can then be used to access other FinSpace Data API operations.     ENABLED – The user has permissions to use the APIs.    DISABLED – The user does not have permissions to use any APIs.  
     */
    apiAccess?: ApiAccess;
    /**
     * The ARN identifier of an AWS user or role that is allowed to call the GetProgrammaticAccessCredentials API to obtain a credentials token for a specific FinSpace user. This must be an IAM role within your FinSpace account.
     */
    apiAccessPrincipalArn?: RoleArn;
    /**
     * The timestamp at which the user was created in FinSpace. The value is determined as epoch time in milliseconds. 
     */
    createTime?: TimestampEpoch;
    /**
     * Describes the last time the user was activated. The value is determined as epoch time in milliseconds.
     */
    lastEnabledTime?: TimestampEpoch;
    /**
     * Describes the last time the user was deactivated. The value is determined as epoch time in milliseconds.
     */
    lastDisabledTime?: TimestampEpoch;
    /**
     * Describes the last time the user details were updated. The value is determined as epoch time in milliseconds.
     */
    lastModifiedTime?: TimestampEpoch;
    /**
     * Describes the last time that the user logged into their account. The value is determined as epoch time in milliseconds.
     */
    lastLoginTime?: TimestampEpoch;
  }
  export interface GetWorkingLocationRequest {
    /**
     * Specify the type of the working location.    SAGEMAKER – Use the Amazon S3 location as a temporary location to store data content when working with FinSpace Notebooks that run on SageMaker studio.    INGESTION – Use the Amazon S3 location as a staging location to copy your data content and then use the location with the Changeset creation operation.  
     */
    locationType?: locationType;
  }
  export interface GetWorkingLocationResponse {
    /**
     * Returns the Amazon S3 URI for the working location.
     */
    s3Uri?: stringValueLength1to1024;
    /**
     * Returns the Amazon S3 Path for the working location.
     */
    s3Path?: stringValueLength1to1024;
    /**
     * Returns the Amazon S3 bucket name for the working location.
     */
    s3Bucket?: stringValueLength1to63;
  }
  export type IdType = string;
  export type IngestionStatus = "PENDING"|"FAILED"|"SUCCESS"|"RUNNING"|"STOP_REQUESTED"|string;
  export type LastName = string;
  export interface ListChangesetsRequest {
    /**
     * The unique identifier for the FinSpace Dataset to which the Changeset belongs.
     */
    datasetId: DatasetId;
    /**
     * The maximum number of results per page.
     */
    maxResults?: ResultLimit;
    /**
     * A token that indicates where a results page should begin.
     */
    nextToken?: PaginationToken;
  }
  export interface ListChangesetsResponse {
    /**
     * List of Changesets found.
     */
    changesets?: ChangesetList;
    /**
     * A token that indicates where a results page should begin.
     */
    nextToken?: PaginationToken;
  }
  export interface ListDataViewsRequest {
    /**
     * The unique identifier of the Dataset for which to retrieve Dataviews.
     */
    datasetId: DatasetId;
    /**
     * A token that indicates where a results page should begin.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results per page.
     */
    maxResults?: ResultLimit;
  }
  export interface ListDataViewsResponse {
    /**
     * A token that indicates where a results page should begin.
     */
    nextToken?: PaginationToken;
    /**
     * A list of Dataviews.
     */
    dataViews?: DataViewList;
  }
  export interface ListDatasetsRequest {
    /**
     * A token that indicates where a results page should begin.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results per page.
     */
    maxResults?: ResultLimit;
  }
  export interface ListDatasetsResponse {
    /**
     * List of Datasets.
     */
    datasets?: DatasetList;
    /**
     * A token that indicates where a results page should begin.
     */
    nextToken?: PaginationToken;
  }
  export interface ListPermissionGroupsByUserRequest {
    /**
     * The unique identifier for the user.
     */
    userId: UserId;
    /**
     * A token that indicates where a results page should begin.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results per page.
     */
    maxResults: ResultLimit;
  }
  export interface ListPermissionGroupsByUserResponse {
    /**
     * A list of returned permission groups.
     */
    permissionGroups?: PermissionGroupByUserList;
    /**
     * A token that indicates where a results page should begin.
     */
    nextToken?: PaginationToken;
  }
  export interface ListPermissionGroupsRequest {
    /**
     * A token that indicates where a results page should begin.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results per page.
     */
    maxResults: ResultLimit;
  }
  export interface ListPermissionGroupsResponse {
    /**
     * A list of all the permission groups.
     */
    permissionGroups?: PermissionGroupList;
    /**
     * A token that indicates where a results page should begin.
     */
    nextToken?: PaginationToken;
  }
  export interface ListUsersByPermissionGroupRequest {
    /**
     * The unique identifier for the permission group.
     */
    permissionGroupId: PermissionGroupId;
    /**
     * A token that indicates where a results page should begin.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results per page.
     */
    maxResults: ResultLimit;
  }
  export interface ListUsersByPermissionGroupResponse {
    /**
     * Lists details of all users in a specific permission group.
     */
    users?: UserByPermissionGroupList;
    /**
     * A token that indicates where a results page should begin.
     */
    nextToken?: PaginationToken;
  }
  export interface ListUsersRequest {
    /**
     * A token that indicates where a results page should begin.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results per page.
     */
    maxResults: ResultLimit;
  }
  export interface ListUsersResponse {
    /**
     * A list of all the users.
     */
    users?: UserList;
    /**
     * A token that indicates where a results page should begin.
     */
    nextToken?: PaginationToken;
  }
  export type OwnerName = string;
  export type PaginationToken = string;
  export type PartitionColumnList = StringValueLength1to255[];
  export type Password = string;
  export interface PermissionGroup {
    /**
     *  The unique identifier for the permission group.
     */
    permissionGroupId?: PermissionGroupId;
    /**
     * The name of the permission group.
     */
    name?: PermissionGroupName;
    /**
     *  A brief description for the permission group.
     */
    description?: PermissionGroupDescription;
    /**
     * Indicates the permissions that are granted to a specific group for accessing the FinSpace application.  When assigning application permissions, be aware that the permission ManageUsersAndGroups allows users to grant themselves or others access to any functionality in their FinSpace environment's application. It should only be granted to trusted users.     CreateDataset – Group members can create new datasets.    ManageClusters – Group members can manage Apache Spark clusters from FinSpace notebooks.    ManageUsersAndGroups – Group members can manage users and permission groups. This is a privileged permission that allows users to grant themselves or others access to any functionality in the application. It should only be granted to trusted users.    ManageAttributeSets – Group members can manage attribute sets.    ViewAuditData – Group members can view audit data.    AccessNotebooks – Group members will have access to FinSpace notebooks.    GetTemporaryCredentials – Group members can get temporary API credentials.  
     */
    applicationPermissions?: ApplicationPermissionList;
    /**
     * The timestamp at which the group was created in FinSpace. The value is determined as epoch time in milliseconds. 
     */
    createTime?: TimestampEpoch;
    /**
     * Describes the last time the permission group was updated. The value is determined as epoch time in milliseconds. 
     */
    lastModifiedTime?: TimestampEpoch;
    /**
     * Indicates the status of the user within a permission group.    ADDITION_IN_PROGRESS – The user is currently being added to the permission group.    ADDITION_SUCCESS – The user is successfully added to the permission group.    REMOVAL_IN_PROGRESS – The user is currently being removed from the permission group.  
     */
    membershipStatus?: PermissionGroupMembershipStatus;
  }
  export interface PermissionGroupByUser {
    /**
     * The unique identifier for the permission group.
     */
    permissionGroupId?: PermissionGroupId;
    /**
     * The name of the permission group.
     */
    name?: PermissionGroupName;
    /**
     * Indicates the status of the user within a permission group.    ADDITION_IN_PROGRESS – The user is currently being added to the permission group.    ADDITION_SUCCESS – The user is successfully added to the permission group.    REMOVAL_IN_PROGRESS – The user is currently being removed from the permission group.  
     */
    membershipStatus?: PermissionGroupMembershipStatus;
  }
  export type PermissionGroupByUserList = PermissionGroupByUser[];
  export type PermissionGroupDescription = string;
  export type PermissionGroupId = string;
  export type PermissionGroupList = PermissionGroup[];
  export type PermissionGroupMembershipStatus = "ADDITION_IN_PROGRESS"|"ADDITION_SUCCESS"|"REMOVAL_IN_PROGRESS"|string;
  export type PermissionGroupName = string;
  export interface PermissionGroupParams {
    /**
     * The unique identifier for the PermissionGroup.
     */
    permissionGroupId?: PermissionGroupId;
    /**
     * List of resource permissions.
     */
    datasetPermissions?: ResourcePermissionsList;
  }
  export type PhoneNumber = string;
  export interface ResetUserPasswordRequest {
    /**
     * The unique identifier of the user that a temporary password is requested for.
     */
    userId: UserId;
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
  }
  export interface ResetUserPasswordResponse {
    /**
     * The unique identifier of the user that a new password is generated for.
     */
    userId?: UserId;
    /**
     * A randomly generated temporary password for the requested user. This password expires in 7 days.
     */
    temporaryPassword?: Password;
  }
  export interface ResourcePermission {
    /**
     * Permission for a resource.
     */
    permission?: StringValueLength1to250;
  }
  export type ResourcePermissionsList = ResourcePermission[];
  export type ResultLimit = number;
  export type RoleArn = string;
  export type S3BucketName = string;
  export type S3DestinationFormatOptions = {[key: string]: StringMapValue};
  export type S3Key = string;
  export interface S3Location {
    /**
     *  The name of the S3 bucket.
     */
    bucket: S3BucketName;
    /**
     *  The path of the folder, within the S3 bucket that contains the Dataset.
     */
    key: S3Key;
  }
  export interface SchemaDefinition {
    /**
     * List of column definitions.
     */
    columns?: ColumnList;
    /**
     * List of column names used for primary key.
     */
    primaryKeyColumns?: ColumnNameList;
  }
  export interface SchemaUnion {
    /**
     * The configuration for a schema on a tabular Dataset.
     */
    tabularSchemaConfig?: SchemaDefinition;
  }
  export type SecretAccessKey = string;
  export type SessionDuration = number;
  export type SessionToken = string;
  export type SortColumnList = StringValueLength1to255[];
  export type SourceParams = {[key: string]: StringMapValue};
  export type StatusCode = number;
  export type StringMapKey = string;
  export type StringMapValue = string;
  export type StringValueLength1to250 = string;
  export type StringValueLength1to255 = string;
  export type TimestampEpoch = number;
  export interface UpdateChangesetRequest {
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
    /**
     * The unique identifier for the FinSpace Dataset in which the Changeset is created.
     */
    datasetId: DatasetId;
    /**
     * The unique identifier for the Changeset to update.
     */
    changesetId: ChangesetId;
    /**
     * Options that define the location of the data being ingested (s3SourcePath) and the source of the changeset (sourceType). Both s3SourcePath and sourceType are required attributes. Here is an example of how you could specify the sourceParams:   "sourceParams": { "s3SourcePath": "s3://finspace-landing-us-east-2-bk7gcfvitndqa6ebnvys4d/scratch/wr5hh8pwkpqqkxa4sxrmcw/ingestion/equity.csv", "sourceType": "S3" }   The S3 path that you specify must allow the FinSpace role access. To do that, you first need to configure the IAM policy on S3 bucket. For more information, see Loading data from an Amazon S3 Bucket using the FinSpace APIsection.
     */
    sourceParams: SourceParams;
    /**
     * Options that define the structure of the source file(s) including the format type (formatType), header row (withHeader), data separation character (separator) and the type of compression (compression).   formatType is a required attribute and can have the following values:     PARQUET – Parquet source file format.    CSV – CSV source file format.    JSON – JSON source file format.    XML – XML source file format.   Here is an example of how you could specify the formatParams:   "formatParams": { "formatType": "CSV", "withHeader": "true", "separator": ",", "compression":"None" }   Note that if you only provide formatType as CSV, the rest of the attributes will automatically default to CSV values as following:   { "withHeader": "true", "separator": "," }    For more information about supported file formats, see Supported Data Types and File Formats in the FinSpace User Guide.
     */
    formatParams: FormatParams;
  }
  export interface UpdateChangesetResponse {
    /**
     * The unique identifier for the Changeset to update.
     */
    changesetId?: ChangesetId;
    /**
     * The unique identifier for the FinSpace Dataset in which the Changeset is created.
     */
    datasetId?: DatasetId;
  }
  export interface UpdateDatasetRequest {
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
    /**
     * The unique identifier for the Dataset to update.
     */
    datasetId: DatasetId;
    /**
     * A display title for the Dataset.
     */
    datasetTitle: DatasetTitle;
    /**
     * The format in which the Dataset data is structured.    TABULAR – Data is structured in a tabular format.    NON_TABULAR – Data is structured in a non-tabular format.  
     */
    kind: DatasetKind;
    /**
     * A description for the Dataset.
     */
    datasetDescription?: DatasetDescription;
    /**
     * The unique resource identifier for a Dataset.
     */
    alias?: AliasString;
    /**
     * Definition for a schema on a tabular Dataset.
     */
    schemaDefinition?: SchemaUnion;
  }
  export interface UpdateDatasetResponse {
    /**
     * The unique identifier for updated Dataset.
     */
    datasetId?: DatasetId;
  }
  export interface UpdatePermissionGroupRequest {
    /**
     * The unique identifier for the permission group to update.
     */
    permissionGroupId: PermissionGroupId;
    /**
     * The name of the permission group.
     */
    name?: PermissionGroupName;
    /**
     * A brief description for the permission group.
     */
    description?: PermissionGroupDescription;
    /**
     * The permissions that are granted to a specific group for accessing the FinSpace application.  When assigning application permissions, be aware that the permission ManageUsersAndGroups allows users to grant themselves or others access to any functionality in their FinSpace environment's application. It should only be granted to trusted users.     CreateDataset – Group members can create new datasets.    ManageClusters – Group members can manage Apache Spark clusters from FinSpace notebooks.    ManageUsersAndGroups – Group members can manage users and permission groups. This is a privileged permission that allows users to grant themselves or others access to any functionality in the application. It should only be granted to trusted users.    ManageAttributeSets – Group members can manage attribute sets.    ViewAuditData – Group members can view audit data.    AccessNotebooks – Group members will have access to FinSpace notebooks.    GetTemporaryCredentials – Group members can get temporary API credentials.  
     */
    applicationPermissions?: ApplicationPermissionList;
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
  }
  export interface UpdatePermissionGroupResponse {
    /**
     * The unique identifier for the updated permission group.
     */
    permissionGroupId?: PermissionGroupId;
  }
  export interface UpdateUserRequest {
    /**
     * The unique identifier for the user that you want to update.
     */
    userId: UserId;
    /**
     * The option to indicate the type of user.    SUPER_USER– A user with permission to all the functionality and data in FinSpace.    APP_USER – A user with specific permissions in FinSpace. The users are assigned permissions by adding them to a permission group.  
     */
    type?: UserType;
    /**
     * The first name of the user.
     */
    firstName?: FirstName;
    /**
     * The last name of the user.
     */
    lastName?: LastName;
    /**
     * The option to indicate whether the user can use the GetProgrammaticAccessCredentials API to obtain credentials that can then be used to access other FinSpace Data API operations.    ENABLED – The user has permissions to use the APIs.    DISABLED – The user does not have permissions to use any APIs.  
     */
    apiAccess?: ApiAccess;
    /**
     * The ARN identifier of an AWS user or role that is allowed to call the GetProgrammaticAccessCredentials API to obtain a credentials token for a specific FinSpace user. This must be an IAM role within your FinSpace account.
     */
    apiAccessPrincipalArn?: RoleArn;
    /**
     * A token that ensures idempotency. This token expires in 10 minutes.
     */
    clientToken?: ClientToken;
  }
  export interface UpdateUserResponse {
    /**
     * The unique identifier of the updated user.
     */
    userId?: UserId;
  }
  export interface User {
    /**
     * The unique identifier for the user.
     */
    userId?: UserId;
    /**
     * The current status of the user.     CREATING – The user creation is in progress.    ENABLED – The user is created and is currently active.    DISABLED – The user is currently inactive.  
     */
    status?: UserStatus;
    /**
     * The first name of the user.
     */
    firstName?: FirstName;
    /**
     *  The last name of the user.
     */
    lastName?: LastName;
    /**
     * The email address of the user. The email address serves as a uniquer identifier for each user and cannot be changed after it's created.
     */
    emailAddress?: Email;
    /**
     *  Indicates the type of user.    SUPER_USER – A user with permission to all the functionality and data in FinSpace.    APP_USER – A user with specific permissions in FinSpace. The users are assigned permissions by adding them to a permission group.  
     */
    type?: UserType;
    /**
     * Indicates whether the user can use the GetProgrammaticAccessCredentials API to obtain credentials that can then be used to access other FinSpace Data API operations.    ENABLED – The user has permissions to use the APIs.    DISABLED – The user does not have permissions to use any APIs.  
     */
    apiAccess?: ApiAccess;
    /**
     * The ARN identifier of an AWS user or role that is allowed to call the GetProgrammaticAccessCredentials API to obtain a credentials token for a specific FinSpace user. This must be an IAM role within your FinSpace account.
     */
    apiAccessPrincipalArn?: RoleArn;
    /**
     * The timestamp at which the user was created in FinSpace. The value is determined as epoch time in milliseconds. 
     */
    createTime?: TimestampEpoch;
    /**
     *  Describes the last time the user was activated. The value is determined as epoch time in milliseconds. 
     */
    lastEnabledTime?: TimestampEpoch;
    /**
     * Describes the last time the user was deactivated. The value is determined as epoch time in milliseconds.
     */
    lastDisabledTime?: TimestampEpoch;
    /**
     * Describes the last time the user was updated. The value is determined as epoch time in milliseconds. 
     */
    lastModifiedTime?: TimestampEpoch;
    /**
     * Describes the last time that the user logged into their account. The value is determined as epoch time in milliseconds. 
     */
    lastLoginTime?: TimestampEpoch;
  }
  export interface UserByPermissionGroup {
    /**
     * The unique identifier for the user.
     */
    userId?: UserId;
    /**
     * The current status of the user.     CREATING – The user creation is in progress.    ENABLED – The user is created and is currently active.    DISABLED – The user is currently inactive.  
     */
    status?: UserStatus;
    /**
     * The first name of the user.
     */
    firstName?: FirstName;
    /**
     * The last name of the user.
     */
    lastName?: LastName;
    /**
     * The email address of the user. The email address serves as a unique identifier for each user and cannot be changed after it's created.
     */
    emailAddress?: Email;
    /**
     *  Indicates the type of user.    SUPER_USER – A user with permission to all the functionality and data in FinSpace.    APP_USER – A user with specific permissions in FinSpace. The users are assigned permissions by adding them to a permission group.  
     */
    type?: UserType;
    /**
     * Indicates whether the user can access FinSpace API operations.    ENABLED – The user has permissions to use the API operations.    DISABLED – The user does not have permissions to use any API operations.  
     */
    apiAccess?: ApiAccess;
    /**
     * The IAM ARN identifier that is attached to FinSpace API calls.
     */
    apiAccessPrincipalArn?: RoleArn;
    /**
     * Indicates the status of the user within a permission group.    ADDITION_IN_PROGRESS – The user is currently being added to the permission group.    ADDITION_SUCCESS – The user is successfully added to the permission group.    REMOVAL_IN_PROGRESS – The user is currently being removed from the permission group.  
     */
    membershipStatus?: PermissionGroupMembershipStatus;
  }
  export type UserByPermissionGroupList = UserByPermissionGroup[];
  export type UserId = string;
  export type UserList = User[];
  export type UserStatus = "CREATING"|"ENABLED"|"DISABLED"|string;
  export type UserType = "SUPER_USER"|"APP_USER"|string;
  export type locationType = "INGESTION"|"SAGEMAKER"|string;
  export type stringValueLength1to1024 = string;
  export type stringValueLength1to255 = string;
  export type stringValueLength1to63 = string;
  export type stringValueMaxLength1000 = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-07-13"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Finspacedata client.
   */
  export import Types = Finspacedata;
}
export = Finspacedata;
