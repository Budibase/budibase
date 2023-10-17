import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Readable} from 'stream';
interface Blob {}
declare class LakeFormation extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: LakeFormation.Types.ClientConfiguration)
  config: Config & LakeFormation.Types.ClientConfiguration;
  /**
   * Attaches one or more LF-tags to an existing resource.
   */
  addLFTagsToResource(params: LakeFormation.Types.AddLFTagsToResourceRequest, callback?: (err: AWSError, data: LakeFormation.Types.AddLFTagsToResourceResponse) => void): Request<LakeFormation.Types.AddLFTagsToResourceResponse, AWSError>;
  /**
   * Attaches one or more LF-tags to an existing resource.
   */
  addLFTagsToResource(callback?: (err: AWSError, data: LakeFormation.Types.AddLFTagsToResourceResponse) => void): Request<LakeFormation.Types.AddLFTagsToResourceResponse, AWSError>;
  /**
   * Allows a caller to assume an IAM role decorated as the SAML user specified in the SAML assertion included in the request. This decoration allows Lake Formation to enforce access policies against the SAML users and groups. This API operation requires SAML federation setup in the caller’s account as it can only be called with valid SAML assertions. Lake Formation does not scope down the permission of the assumed role. All permissions attached to the role via the SAML federation setup will be included in the role session.   This decorated role is expected to access data in Amazon S3 by getting temporary access from Lake Formation which is authorized via the virtual API GetDataAccess. Therefore, all SAML roles that can be assumed via AssumeDecoratedRoleWithSAML must at a minimum include lakeformation:GetDataAccess in their role policies. A typical IAM policy attached to such a role would look as follows: 
   */
  assumeDecoratedRoleWithSAML(params: LakeFormation.Types.AssumeDecoratedRoleWithSAMLRequest, callback?: (err: AWSError, data: LakeFormation.Types.AssumeDecoratedRoleWithSAMLResponse) => void): Request<LakeFormation.Types.AssumeDecoratedRoleWithSAMLResponse, AWSError>;
  /**
   * Allows a caller to assume an IAM role decorated as the SAML user specified in the SAML assertion included in the request. This decoration allows Lake Formation to enforce access policies against the SAML users and groups. This API operation requires SAML federation setup in the caller’s account as it can only be called with valid SAML assertions. Lake Formation does not scope down the permission of the assumed role. All permissions attached to the role via the SAML federation setup will be included in the role session.   This decorated role is expected to access data in Amazon S3 by getting temporary access from Lake Formation which is authorized via the virtual API GetDataAccess. Therefore, all SAML roles that can be assumed via AssumeDecoratedRoleWithSAML must at a minimum include lakeformation:GetDataAccess in their role policies. A typical IAM policy attached to such a role would look as follows: 
   */
  assumeDecoratedRoleWithSAML(callback?: (err: AWSError, data: LakeFormation.Types.AssumeDecoratedRoleWithSAMLResponse) => void): Request<LakeFormation.Types.AssumeDecoratedRoleWithSAMLResponse, AWSError>;
  /**
   * Batch operation to grant permissions to the principal.
   */
  batchGrantPermissions(params: LakeFormation.Types.BatchGrantPermissionsRequest, callback?: (err: AWSError, data: LakeFormation.Types.BatchGrantPermissionsResponse) => void): Request<LakeFormation.Types.BatchGrantPermissionsResponse, AWSError>;
  /**
   * Batch operation to grant permissions to the principal.
   */
  batchGrantPermissions(callback?: (err: AWSError, data: LakeFormation.Types.BatchGrantPermissionsResponse) => void): Request<LakeFormation.Types.BatchGrantPermissionsResponse, AWSError>;
  /**
   * Batch operation to revoke permissions from the principal.
   */
  batchRevokePermissions(params: LakeFormation.Types.BatchRevokePermissionsRequest, callback?: (err: AWSError, data: LakeFormation.Types.BatchRevokePermissionsResponse) => void): Request<LakeFormation.Types.BatchRevokePermissionsResponse, AWSError>;
  /**
   * Batch operation to revoke permissions from the principal.
   */
  batchRevokePermissions(callback?: (err: AWSError, data: LakeFormation.Types.BatchRevokePermissionsResponse) => void): Request<LakeFormation.Types.BatchRevokePermissionsResponse, AWSError>;
  /**
   * Attempts to cancel the specified transaction. Returns an exception if the transaction was previously committed.
   */
  cancelTransaction(params: LakeFormation.Types.CancelTransactionRequest, callback?: (err: AWSError, data: LakeFormation.Types.CancelTransactionResponse) => void): Request<LakeFormation.Types.CancelTransactionResponse, AWSError>;
  /**
   * Attempts to cancel the specified transaction. Returns an exception if the transaction was previously committed.
   */
  cancelTransaction(callback?: (err: AWSError, data: LakeFormation.Types.CancelTransactionResponse) => void): Request<LakeFormation.Types.CancelTransactionResponse, AWSError>;
  /**
   * Attempts to commit the specified transaction. Returns an exception if the transaction was previously aborted. This API action is idempotent if called multiple times for the same transaction.
   */
  commitTransaction(params: LakeFormation.Types.CommitTransactionRequest, callback?: (err: AWSError, data: LakeFormation.Types.CommitTransactionResponse) => void): Request<LakeFormation.Types.CommitTransactionResponse, AWSError>;
  /**
   * Attempts to commit the specified transaction. Returns an exception if the transaction was previously aborted. This API action is idempotent if called multiple times for the same transaction.
   */
  commitTransaction(callback?: (err: AWSError, data: LakeFormation.Types.CommitTransactionResponse) => void): Request<LakeFormation.Types.CommitTransactionResponse, AWSError>;
  /**
   * Creates a data cell filter to allow one to grant access to certain columns on certain rows.
   */
  createDataCellsFilter(params: LakeFormation.Types.CreateDataCellsFilterRequest, callback?: (err: AWSError, data: LakeFormation.Types.CreateDataCellsFilterResponse) => void): Request<LakeFormation.Types.CreateDataCellsFilterResponse, AWSError>;
  /**
   * Creates a data cell filter to allow one to grant access to certain columns on certain rows.
   */
  createDataCellsFilter(callback?: (err: AWSError, data: LakeFormation.Types.CreateDataCellsFilterResponse) => void): Request<LakeFormation.Types.CreateDataCellsFilterResponse, AWSError>;
  /**
   * Creates an LF-tag with the specified name and values.
   */
  createLFTag(params: LakeFormation.Types.CreateLFTagRequest, callback?: (err: AWSError, data: LakeFormation.Types.CreateLFTagResponse) => void): Request<LakeFormation.Types.CreateLFTagResponse, AWSError>;
  /**
   * Creates an LF-tag with the specified name and values.
   */
  createLFTag(callback?: (err: AWSError, data: LakeFormation.Types.CreateLFTagResponse) => void): Request<LakeFormation.Types.CreateLFTagResponse, AWSError>;
  /**
   * Enforce Lake Formation permissions for the given databases, tables, and principals.
   */
  createLakeFormationOptIn(params: LakeFormation.Types.CreateLakeFormationOptInRequest, callback?: (err: AWSError, data: LakeFormation.Types.CreateLakeFormationOptInResponse) => void): Request<LakeFormation.Types.CreateLakeFormationOptInResponse, AWSError>;
  /**
   * Enforce Lake Formation permissions for the given databases, tables, and principals.
   */
  createLakeFormationOptIn(callback?: (err: AWSError, data: LakeFormation.Types.CreateLakeFormationOptInResponse) => void): Request<LakeFormation.Types.CreateLakeFormationOptInResponse, AWSError>;
  /**
   * Deletes a data cell filter.
   */
  deleteDataCellsFilter(params: LakeFormation.Types.DeleteDataCellsFilterRequest, callback?: (err: AWSError, data: LakeFormation.Types.DeleteDataCellsFilterResponse) => void): Request<LakeFormation.Types.DeleteDataCellsFilterResponse, AWSError>;
  /**
   * Deletes a data cell filter.
   */
  deleteDataCellsFilter(callback?: (err: AWSError, data: LakeFormation.Types.DeleteDataCellsFilterResponse) => void): Request<LakeFormation.Types.DeleteDataCellsFilterResponse, AWSError>;
  /**
   * Deletes the specified LF-tag given a key name. If the input parameter tag key was not found, then the operation will throw an exception. When you delete an LF-tag, the LFTagPolicy attached to the LF-tag becomes invalid. If the deleted LF-tag was still assigned to any resource, the tag policy attach to the deleted LF-tag will no longer be applied to the resource.
   */
  deleteLFTag(params: LakeFormation.Types.DeleteLFTagRequest, callback?: (err: AWSError, data: LakeFormation.Types.DeleteLFTagResponse) => void): Request<LakeFormation.Types.DeleteLFTagResponse, AWSError>;
  /**
   * Deletes the specified LF-tag given a key name. If the input parameter tag key was not found, then the operation will throw an exception. When you delete an LF-tag, the LFTagPolicy attached to the LF-tag becomes invalid. If the deleted LF-tag was still assigned to any resource, the tag policy attach to the deleted LF-tag will no longer be applied to the resource.
   */
  deleteLFTag(callback?: (err: AWSError, data: LakeFormation.Types.DeleteLFTagResponse) => void): Request<LakeFormation.Types.DeleteLFTagResponse, AWSError>;
  /**
   * Remove the Lake Formation permissions enforcement of the given databases, tables, and principals.
   */
  deleteLakeFormationOptIn(params: LakeFormation.Types.DeleteLakeFormationOptInRequest, callback?: (err: AWSError, data: LakeFormation.Types.DeleteLakeFormationOptInResponse) => void): Request<LakeFormation.Types.DeleteLakeFormationOptInResponse, AWSError>;
  /**
   * Remove the Lake Formation permissions enforcement of the given databases, tables, and principals.
   */
  deleteLakeFormationOptIn(callback?: (err: AWSError, data: LakeFormation.Types.DeleteLakeFormationOptInResponse) => void): Request<LakeFormation.Types.DeleteLakeFormationOptInResponse, AWSError>;
  /**
   * For a specific governed table, provides a list of Amazon S3 objects that will be written during the current transaction and that can be automatically deleted if the transaction is canceled. Without this call, no Amazon S3 objects are automatically deleted when a transaction cancels.   The Glue ETL library function write_dynamic_frame.from_catalog() includes an option to automatically call DeleteObjectsOnCancel before writes. For more information, see Rolling Back Amazon S3 Writes. 
   */
  deleteObjectsOnCancel(params: LakeFormation.Types.DeleteObjectsOnCancelRequest, callback?: (err: AWSError, data: LakeFormation.Types.DeleteObjectsOnCancelResponse) => void): Request<LakeFormation.Types.DeleteObjectsOnCancelResponse, AWSError>;
  /**
   * For a specific governed table, provides a list of Amazon S3 objects that will be written during the current transaction and that can be automatically deleted if the transaction is canceled. Without this call, no Amazon S3 objects are automatically deleted when a transaction cancels.   The Glue ETL library function write_dynamic_frame.from_catalog() includes an option to automatically call DeleteObjectsOnCancel before writes. For more information, see Rolling Back Amazon S3 Writes. 
   */
  deleteObjectsOnCancel(callback?: (err: AWSError, data: LakeFormation.Types.DeleteObjectsOnCancelResponse) => void): Request<LakeFormation.Types.DeleteObjectsOnCancelResponse, AWSError>;
  /**
   * Deregisters the resource as managed by the Data Catalog. When you deregister a path, Lake Formation removes the path from the inline policy attached to your service-linked role.
   */
  deregisterResource(params: LakeFormation.Types.DeregisterResourceRequest, callback?: (err: AWSError, data: LakeFormation.Types.DeregisterResourceResponse) => void): Request<LakeFormation.Types.DeregisterResourceResponse, AWSError>;
  /**
   * Deregisters the resource as managed by the Data Catalog. When you deregister a path, Lake Formation removes the path from the inline policy attached to your service-linked role.
   */
  deregisterResource(callback?: (err: AWSError, data: LakeFormation.Types.DeregisterResourceResponse) => void): Request<LakeFormation.Types.DeregisterResourceResponse, AWSError>;
  /**
   * Retrieves the current data access role for the given resource registered in Lake Formation.
   */
  describeResource(params: LakeFormation.Types.DescribeResourceRequest, callback?: (err: AWSError, data: LakeFormation.Types.DescribeResourceResponse) => void): Request<LakeFormation.Types.DescribeResourceResponse, AWSError>;
  /**
   * Retrieves the current data access role for the given resource registered in Lake Formation.
   */
  describeResource(callback?: (err: AWSError, data: LakeFormation.Types.DescribeResourceResponse) => void): Request<LakeFormation.Types.DescribeResourceResponse, AWSError>;
  /**
   * Returns the details of a single transaction.
   */
  describeTransaction(params: LakeFormation.Types.DescribeTransactionRequest, callback?: (err: AWSError, data: LakeFormation.Types.DescribeTransactionResponse) => void): Request<LakeFormation.Types.DescribeTransactionResponse, AWSError>;
  /**
   * Returns the details of a single transaction.
   */
  describeTransaction(callback?: (err: AWSError, data: LakeFormation.Types.DescribeTransactionResponse) => void): Request<LakeFormation.Types.DescribeTransactionResponse, AWSError>;
  /**
   * Indicates to the service that the specified transaction is still active and should not be treated as idle and aborted. Write transactions that remain idle for a long period are automatically aborted unless explicitly extended.
   */
  extendTransaction(params: LakeFormation.Types.ExtendTransactionRequest, callback?: (err: AWSError, data: LakeFormation.Types.ExtendTransactionResponse) => void): Request<LakeFormation.Types.ExtendTransactionResponse, AWSError>;
  /**
   * Indicates to the service that the specified transaction is still active and should not be treated as idle and aborted. Write transactions that remain idle for a long period are automatically aborted unless explicitly extended.
   */
  extendTransaction(callback?: (err: AWSError, data: LakeFormation.Types.ExtendTransactionResponse) => void): Request<LakeFormation.Types.ExtendTransactionResponse, AWSError>;
  /**
   * Returns a data cells filter.
   */
  getDataCellsFilter(params: LakeFormation.Types.GetDataCellsFilterRequest, callback?: (err: AWSError, data: LakeFormation.Types.GetDataCellsFilterResponse) => void): Request<LakeFormation.Types.GetDataCellsFilterResponse, AWSError>;
  /**
   * Returns a data cells filter.
   */
  getDataCellsFilter(callback?: (err: AWSError, data: LakeFormation.Types.GetDataCellsFilterResponse) => void): Request<LakeFormation.Types.GetDataCellsFilterResponse, AWSError>;
  /**
   * Retrieves the list of the data lake administrators of a Lake Formation-managed data lake. 
   */
  getDataLakeSettings(params: LakeFormation.Types.GetDataLakeSettingsRequest, callback?: (err: AWSError, data: LakeFormation.Types.GetDataLakeSettingsResponse) => void): Request<LakeFormation.Types.GetDataLakeSettingsResponse, AWSError>;
  /**
   * Retrieves the list of the data lake administrators of a Lake Formation-managed data lake. 
   */
  getDataLakeSettings(callback?: (err: AWSError, data: LakeFormation.Types.GetDataLakeSettingsResponse) => void): Request<LakeFormation.Types.GetDataLakeSettingsResponse, AWSError>;
  /**
   * Returns the Lake Formation permissions for a specified table or database resource located at a path in Amazon S3. GetEffectivePermissionsForPath will not return databases and tables if the catalog is encrypted.
   */
  getEffectivePermissionsForPath(params: LakeFormation.Types.GetEffectivePermissionsForPathRequest, callback?: (err: AWSError, data: LakeFormation.Types.GetEffectivePermissionsForPathResponse) => void): Request<LakeFormation.Types.GetEffectivePermissionsForPathResponse, AWSError>;
  /**
   * Returns the Lake Formation permissions for a specified table or database resource located at a path in Amazon S3. GetEffectivePermissionsForPath will not return databases and tables if the catalog is encrypted.
   */
  getEffectivePermissionsForPath(callback?: (err: AWSError, data: LakeFormation.Types.GetEffectivePermissionsForPathResponse) => void): Request<LakeFormation.Types.GetEffectivePermissionsForPathResponse, AWSError>;
  /**
   * Returns an LF-tag definition.
   */
  getLFTag(params: LakeFormation.Types.GetLFTagRequest, callback?: (err: AWSError, data: LakeFormation.Types.GetLFTagResponse) => void): Request<LakeFormation.Types.GetLFTagResponse, AWSError>;
  /**
   * Returns an LF-tag definition.
   */
  getLFTag(callback?: (err: AWSError, data: LakeFormation.Types.GetLFTagResponse) => void): Request<LakeFormation.Types.GetLFTagResponse, AWSError>;
  /**
   * Returns the state of a query previously submitted. Clients are expected to poll GetQueryState to monitor the current state of the planning before retrieving the work units. A query state is only visible to the principal that made the initial call to StartQueryPlanning.
   */
  getQueryState(params: LakeFormation.Types.GetQueryStateRequest, callback?: (err: AWSError, data: LakeFormation.Types.GetQueryStateResponse) => void): Request<LakeFormation.Types.GetQueryStateResponse, AWSError>;
  /**
   * Returns the state of a query previously submitted. Clients are expected to poll GetQueryState to monitor the current state of the planning before retrieving the work units. A query state is only visible to the principal that made the initial call to StartQueryPlanning.
   */
  getQueryState(callback?: (err: AWSError, data: LakeFormation.Types.GetQueryStateResponse) => void): Request<LakeFormation.Types.GetQueryStateResponse, AWSError>;
  /**
   * Retrieves statistics on the planning and execution of a query.
   */
  getQueryStatistics(params: LakeFormation.Types.GetQueryStatisticsRequest, callback?: (err: AWSError, data: LakeFormation.Types.GetQueryStatisticsResponse) => void): Request<LakeFormation.Types.GetQueryStatisticsResponse, AWSError>;
  /**
   * Retrieves statistics on the planning and execution of a query.
   */
  getQueryStatistics(callback?: (err: AWSError, data: LakeFormation.Types.GetQueryStatisticsResponse) => void): Request<LakeFormation.Types.GetQueryStatisticsResponse, AWSError>;
  /**
   * Returns the LF-tags applied to a resource.
   */
  getResourceLFTags(params: LakeFormation.Types.GetResourceLFTagsRequest, callback?: (err: AWSError, data: LakeFormation.Types.GetResourceLFTagsResponse) => void): Request<LakeFormation.Types.GetResourceLFTagsResponse, AWSError>;
  /**
   * Returns the LF-tags applied to a resource.
   */
  getResourceLFTags(callback?: (err: AWSError, data: LakeFormation.Types.GetResourceLFTagsResponse) => void): Request<LakeFormation.Types.GetResourceLFTagsResponse, AWSError>;
  /**
   * Returns the set of Amazon S3 objects that make up the specified governed table. A transaction ID or timestamp can be specified for time-travel queries.
   */
  getTableObjects(params: LakeFormation.Types.GetTableObjectsRequest, callback?: (err: AWSError, data: LakeFormation.Types.GetTableObjectsResponse) => void): Request<LakeFormation.Types.GetTableObjectsResponse, AWSError>;
  /**
   * Returns the set of Amazon S3 objects that make up the specified governed table. A transaction ID or timestamp can be specified for time-travel queries.
   */
  getTableObjects(callback?: (err: AWSError, data: LakeFormation.Types.GetTableObjectsResponse) => void): Request<LakeFormation.Types.GetTableObjectsResponse, AWSError>;
  /**
   * This API is identical to GetTemporaryTableCredentials except that this is used when the target Data Catalog resource is of type Partition. Lake Formation restricts the permission of the vended credentials with the same scope down policy which restricts access to a single Amazon S3 prefix.
   */
  getTemporaryGluePartitionCredentials(params: LakeFormation.Types.GetTemporaryGluePartitionCredentialsRequest, callback?: (err: AWSError, data: LakeFormation.Types.GetTemporaryGluePartitionCredentialsResponse) => void): Request<LakeFormation.Types.GetTemporaryGluePartitionCredentialsResponse, AWSError>;
  /**
   * This API is identical to GetTemporaryTableCredentials except that this is used when the target Data Catalog resource is of type Partition. Lake Formation restricts the permission of the vended credentials with the same scope down policy which restricts access to a single Amazon S3 prefix.
   */
  getTemporaryGluePartitionCredentials(callback?: (err: AWSError, data: LakeFormation.Types.GetTemporaryGluePartitionCredentialsResponse) => void): Request<LakeFormation.Types.GetTemporaryGluePartitionCredentialsResponse, AWSError>;
  /**
   * Allows a caller in a secure environment to assume a role with permission to access Amazon S3. In order to vend such credentials, Lake Formation assumes the role associated with a registered location, for example an Amazon S3 bucket, with a scope down policy which restricts the access to a single prefix.
   */
  getTemporaryGlueTableCredentials(params: LakeFormation.Types.GetTemporaryGlueTableCredentialsRequest, callback?: (err: AWSError, data: LakeFormation.Types.GetTemporaryGlueTableCredentialsResponse) => void): Request<LakeFormation.Types.GetTemporaryGlueTableCredentialsResponse, AWSError>;
  /**
   * Allows a caller in a secure environment to assume a role with permission to access Amazon S3. In order to vend such credentials, Lake Formation assumes the role associated with a registered location, for example an Amazon S3 bucket, with a scope down policy which restricts the access to a single prefix.
   */
  getTemporaryGlueTableCredentials(callback?: (err: AWSError, data: LakeFormation.Types.GetTemporaryGlueTableCredentialsResponse) => void): Request<LakeFormation.Types.GetTemporaryGlueTableCredentialsResponse, AWSError>;
  /**
   * Returns the work units resulting from the query. Work units can be executed in any order and in parallel. 
   */
  getWorkUnitResults(params: LakeFormation.Types.GetWorkUnitResultsRequest, callback?: (err: AWSError, data: LakeFormation.Types.GetWorkUnitResultsResponse) => void): Request<LakeFormation.Types.GetWorkUnitResultsResponse, AWSError>;
  /**
   * Returns the work units resulting from the query. Work units can be executed in any order and in parallel. 
   */
  getWorkUnitResults(callback?: (err: AWSError, data: LakeFormation.Types.GetWorkUnitResultsResponse) => void): Request<LakeFormation.Types.GetWorkUnitResultsResponse, AWSError>;
  /**
   * Retrieves the work units generated by the StartQueryPlanning operation.
   */
  getWorkUnits(params: LakeFormation.Types.GetWorkUnitsRequest, callback?: (err: AWSError, data: LakeFormation.Types.GetWorkUnitsResponse) => void): Request<LakeFormation.Types.GetWorkUnitsResponse, AWSError>;
  /**
   * Retrieves the work units generated by the StartQueryPlanning operation.
   */
  getWorkUnits(callback?: (err: AWSError, data: LakeFormation.Types.GetWorkUnitsResponse) => void): Request<LakeFormation.Types.GetWorkUnitsResponse, AWSError>;
  /**
   * Grants permissions to the principal to access metadata in the Data Catalog and data organized in underlying data storage such as Amazon S3. For information about permissions, see Security and Access Control to Metadata and Data.
   */
  grantPermissions(params: LakeFormation.Types.GrantPermissionsRequest, callback?: (err: AWSError, data: LakeFormation.Types.GrantPermissionsResponse) => void): Request<LakeFormation.Types.GrantPermissionsResponse, AWSError>;
  /**
   * Grants permissions to the principal to access metadata in the Data Catalog and data organized in underlying data storage such as Amazon S3. For information about permissions, see Security and Access Control to Metadata and Data.
   */
  grantPermissions(callback?: (err: AWSError, data: LakeFormation.Types.GrantPermissionsResponse) => void): Request<LakeFormation.Types.GrantPermissionsResponse, AWSError>;
  /**
   * Lists all the data cell filters on a table.
   */
  listDataCellsFilter(params: LakeFormation.Types.ListDataCellsFilterRequest, callback?: (err: AWSError, data: LakeFormation.Types.ListDataCellsFilterResponse) => void): Request<LakeFormation.Types.ListDataCellsFilterResponse, AWSError>;
  /**
   * Lists all the data cell filters on a table.
   */
  listDataCellsFilter(callback?: (err: AWSError, data: LakeFormation.Types.ListDataCellsFilterResponse) => void): Request<LakeFormation.Types.ListDataCellsFilterResponse, AWSError>;
  /**
   * Lists LF-tags that the requester has permission to view. 
   */
  listLFTags(params: LakeFormation.Types.ListLFTagsRequest, callback?: (err: AWSError, data: LakeFormation.Types.ListLFTagsResponse) => void): Request<LakeFormation.Types.ListLFTagsResponse, AWSError>;
  /**
   * Lists LF-tags that the requester has permission to view. 
   */
  listLFTags(callback?: (err: AWSError, data: LakeFormation.Types.ListLFTagsResponse) => void): Request<LakeFormation.Types.ListLFTagsResponse, AWSError>;
  /**
   * Retrieve the current list of resources and principals that are opt in to enforce Lake Formation permissions.
   */
  listLakeFormationOptIns(params: LakeFormation.Types.ListLakeFormationOptInsRequest, callback?: (err: AWSError, data: LakeFormation.Types.ListLakeFormationOptInsResponse) => void): Request<LakeFormation.Types.ListLakeFormationOptInsResponse, AWSError>;
  /**
   * Retrieve the current list of resources and principals that are opt in to enforce Lake Formation permissions.
   */
  listLakeFormationOptIns(callback?: (err: AWSError, data: LakeFormation.Types.ListLakeFormationOptInsResponse) => void): Request<LakeFormation.Types.ListLakeFormationOptInsResponse, AWSError>;
  /**
   * Returns a list of the principal permissions on the resource, filtered by the permissions of the caller. For example, if you are granted an ALTER permission, you are able to see only the principal permissions for ALTER. This operation returns only those permissions that have been explicitly granted. For information about permissions, see Security and Access Control to Metadata and Data.
   */
  listPermissions(params: LakeFormation.Types.ListPermissionsRequest, callback?: (err: AWSError, data: LakeFormation.Types.ListPermissionsResponse) => void): Request<LakeFormation.Types.ListPermissionsResponse, AWSError>;
  /**
   * Returns a list of the principal permissions on the resource, filtered by the permissions of the caller. For example, if you are granted an ALTER permission, you are able to see only the principal permissions for ALTER. This operation returns only those permissions that have been explicitly granted. For information about permissions, see Security and Access Control to Metadata and Data.
   */
  listPermissions(callback?: (err: AWSError, data: LakeFormation.Types.ListPermissionsResponse) => void): Request<LakeFormation.Types.ListPermissionsResponse, AWSError>;
  /**
   * Lists the resources registered to be managed by the Data Catalog.
   */
  listResources(params: LakeFormation.Types.ListResourcesRequest, callback?: (err: AWSError, data: LakeFormation.Types.ListResourcesResponse) => void): Request<LakeFormation.Types.ListResourcesResponse, AWSError>;
  /**
   * Lists the resources registered to be managed by the Data Catalog.
   */
  listResources(callback?: (err: AWSError, data: LakeFormation.Types.ListResourcesResponse) => void): Request<LakeFormation.Types.ListResourcesResponse, AWSError>;
  /**
   * Returns the configuration of all storage optimizers associated with a specified table.
   */
  listTableStorageOptimizers(params: LakeFormation.Types.ListTableStorageOptimizersRequest, callback?: (err: AWSError, data: LakeFormation.Types.ListTableStorageOptimizersResponse) => void): Request<LakeFormation.Types.ListTableStorageOptimizersResponse, AWSError>;
  /**
   * Returns the configuration of all storage optimizers associated with a specified table.
   */
  listTableStorageOptimizers(callback?: (err: AWSError, data: LakeFormation.Types.ListTableStorageOptimizersResponse) => void): Request<LakeFormation.Types.ListTableStorageOptimizersResponse, AWSError>;
  /**
   * Returns metadata about transactions and their status. To prevent the response from growing indefinitely, only uncommitted transactions and those available for time-travel queries are returned. This operation can help you identify uncommitted transactions or to get information about transactions.
   */
  listTransactions(params: LakeFormation.Types.ListTransactionsRequest, callback?: (err: AWSError, data: LakeFormation.Types.ListTransactionsResponse) => void): Request<LakeFormation.Types.ListTransactionsResponse, AWSError>;
  /**
   * Returns metadata about transactions and their status. To prevent the response from growing indefinitely, only uncommitted transactions and those available for time-travel queries are returned. This operation can help you identify uncommitted transactions or to get information about transactions.
   */
  listTransactions(callback?: (err: AWSError, data: LakeFormation.Types.ListTransactionsResponse) => void): Request<LakeFormation.Types.ListTransactionsResponse, AWSError>;
  /**
   * Sets the list of data lake administrators who have admin privileges on all resources managed by Lake Formation. For more information on admin privileges, see Granting Lake Formation Permissions. This API replaces the current list of data lake admins with the new list being passed. To add an admin, fetch the current list and add the new admin to that list and pass that list in this API.
   */
  putDataLakeSettings(params: LakeFormation.Types.PutDataLakeSettingsRequest, callback?: (err: AWSError, data: LakeFormation.Types.PutDataLakeSettingsResponse) => void): Request<LakeFormation.Types.PutDataLakeSettingsResponse, AWSError>;
  /**
   * Sets the list of data lake administrators who have admin privileges on all resources managed by Lake Formation. For more information on admin privileges, see Granting Lake Formation Permissions. This API replaces the current list of data lake admins with the new list being passed. To add an admin, fetch the current list and add the new admin to that list and pass that list in this API.
   */
  putDataLakeSettings(callback?: (err: AWSError, data: LakeFormation.Types.PutDataLakeSettingsResponse) => void): Request<LakeFormation.Types.PutDataLakeSettingsResponse, AWSError>;
  /**
   * Registers the resource as managed by the Data Catalog. To add or update data, Lake Formation needs read/write access to the chosen Amazon S3 path. Choose a role that you know has permission to do this, or choose the AWSServiceRoleForLakeFormationDataAccess service-linked role. When you register the first Amazon S3 path, the service-linked role and a new inline policy are created on your behalf. Lake Formation adds the first path to the inline policy and attaches it to the service-linked role. When you register subsequent paths, Lake Formation adds the path to the existing policy. The following request registers a new location and gives Lake Formation permission to use the service-linked role to access that location.  ResourceArn = arn:aws:s3:::my-bucket UseServiceLinkedRole = true  If UseServiceLinkedRole is not set to true, you must provide or set the RoleArn:  arn:aws:iam::12345:role/my-data-access-role 
   */
  registerResource(params: LakeFormation.Types.RegisterResourceRequest, callback?: (err: AWSError, data: LakeFormation.Types.RegisterResourceResponse) => void): Request<LakeFormation.Types.RegisterResourceResponse, AWSError>;
  /**
   * Registers the resource as managed by the Data Catalog. To add or update data, Lake Formation needs read/write access to the chosen Amazon S3 path. Choose a role that you know has permission to do this, or choose the AWSServiceRoleForLakeFormationDataAccess service-linked role. When you register the first Amazon S3 path, the service-linked role and a new inline policy are created on your behalf. Lake Formation adds the first path to the inline policy and attaches it to the service-linked role. When you register subsequent paths, Lake Formation adds the path to the existing policy. The following request registers a new location and gives Lake Formation permission to use the service-linked role to access that location.  ResourceArn = arn:aws:s3:::my-bucket UseServiceLinkedRole = true  If UseServiceLinkedRole is not set to true, you must provide or set the RoleArn:  arn:aws:iam::12345:role/my-data-access-role 
   */
  registerResource(callback?: (err: AWSError, data: LakeFormation.Types.RegisterResourceResponse) => void): Request<LakeFormation.Types.RegisterResourceResponse, AWSError>;
  /**
   * Removes an LF-tag from the resource. Only database, table, or tableWithColumns resource are allowed. To tag columns, use the column inclusion list in tableWithColumns to specify column input.
   */
  removeLFTagsFromResource(params: LakeFormation.Types.RemoveLFTagsFromResourceRequest, callback?: (err: AWSError, data: LakeFormation.Types.RemoveLFTagsFromResourceResponse) => void): Request<LakeFormation.Types.RemoveLFTagsFromResourceResponse, AWSError>;
  /**
   * Removes an LF-tag from the resource. Only database, table, or tableWithColumns resource are allowed. To tag columns, use the column inclusion list in tableWithColumns to specify column input.
   */
  removeLFTagsFromResource(callback?: (err: AWSError, data: LakeFormation.Types.RemoveLFTagsFromResourceResponse) => void): Request<LakeFormation.Types.RemoveLFTagsFromResourceResponse, AWSError>;
  /**
   * Revokes permissions to the principal to access metadata in the Data Catalog and data organized in underlying data storage such as Amazon S3.
   */
  revokePermissions(params: LakeFormation.Types.RevokePermissionsRequest, callback?: (err: AWSError, data: LakeFormation.Types.RevokePermissionsResponse) => void): Request<LakeFormation.Types.RevokePermissionsResponse, AWSError>;
  /**
   * Revokes permissions to the principal to access metadata in the Data Catalog and data organized in underlying data storage such as Amazon S3.
   */
  revokePermissions(callback?: (err: AWSError, data: LakeFormation.Types.RevokePermissionsResponse) => void): Request<LakeFormation.Types.RevokePermissionsResponse, AWSError>;
  /**
   * This operation allows a search on DATABASE resources by TagCondition. This operation is used by admins who want to grant user permissions on certain TagConditions. Before making a grant, the admin can use SearchDatabasesByTags to find all resources where the given TagConditions are valid to verify whether the returned resources can be shared.
   */
  searchDatabasesByLFTags(params: LakeFormation.Types.SearchDatabasesByLFTagsRequest, callback?: (err: AWSError, data: LakeFormation.Types.SearchDatabasesByLFTagsResponse) => void): Request<LakeFormation.Types.SearchDatabasesByLFTagsResponse, AWSError>;
  /**
   * This operation allows a search on DATABASE resources by TagCondition. This operation is used by admins who want to grant user permissions on certain TagConditions. Before making a grant, the admin can use SearchDatabasesByTags to find all resources where the given TagConditions are valid to verify whether the returned resources can be shared.
   */
  searchDatabasesByLFTags(callback?: (err: AWSError, data: LakeFormation.Types.SearchDatabasesByLFTagsResponse) => void): Request<LakeFormation.Types.SearchDatabasesByLFTagsResponse, AWSError>;
  /**
   * This operation allows a search on TABLE resources by LFTags. This will be used by admins who want to grant user permissions on certain LF-tags. Before making a grant, the admin can use SearchTablesByLFTags to find all resources where the given LFTags are valid to verify whether the returned resources can be shared.
   */
  searchTablesByLFTags(params: LakeFormation.Types.SearchTablesByLFTagsRequest, callback?: (err: AWSError, data: LakeFormation.Types.SearchTablesByLFTagsResponse) => void): Request<LakeFormation.Types.SearchTablesByLFTagsResponse, AWSError>;
  /**
   * This operation allows a search on TABLE resources by LFTags. This will be used by admins who want to grant user permissions on certain LF-tags. Before making a grant, the admin can use SearchTablesByLFTags to find all resources where the given LFTags are valid to verify whether the returned resources can be shared.
   */
  searchTablesByLFTags(callback?: (err: AWSError, data: LakeFormation.Types.SearchTablesByLFTagsResponse) => void): Request<LakeFormation.Types.SearchTablesByLFTagsResponse, AWSError>;
  /**
   * Submits a request to process a query statement. This operation generates work units that can be retrieved with the GetWorkUnits operation as soon as the query state is WORKUNITS_AVAILABLE or FINISHED.
   */
  startQueryPlanning(params: LakeFormation.Types.StartQueryPlanningRequest, callback?: (err: AWSError, data: LakeFormation.Types.StartQueryPlanningResponse) => void): Request<LakeFormation.Types.StartQueryPlanningResponse, AWSError>;
  /**
   * Submits a request to process a query statement. This operation generates work units that can be retrieved with the GetWorkUnits operation as soon as the query state is WORKUNITS_AVAILABLE or FINISHED.
   */
  startQueryPlanning(callback?: (err: AWSError, data: LakeFormation.Types.StartQueryPlanningResponse) => void): Request<LakeFormation.Types.StartQueryPlanningResponse, AWSError>;
  /**
   * Starts a new transaction and returns its transaction ID. Transaction IDs are opaque objects that you can use to identify a transaction.
   */
  startTransaction(params: LakeFormation.Types.StartTransactionRequest, callback?: (err: AWSError, data: LakeFormation.Types.StartTransactionResponse) => void): Request<LakeFormation.Types.StartTransactionResponse, AWSError>;
  /**
   * Starts a new transaction and returns its transaction ID. Transaction IDs are opaque objects that you can use to identify a transaction.
   */
  startTransaction(callback?: (err: AWSError, data: LakeFormation.Types.StartTransactionResponse) => void): Request<LakeFormation.Types.StartTransactionResponse, AWSError>;
  /**
   * Updates a data cell filter.
   */
  updateDataCellsFilter(params: LakeFormation.Types.UpdateDataCellsFilterRequest, callback?: (err: AWSError, data: LakeFormation.Types.UpdateDataCellsFilterResponse) => void): Request<LakeFormation.Types.UpdateDataCellsFilterResponse, AWSError>;
  /**
   * Updates a data cell filter.
   */
  updateDataCellsFilter(callback?: (err: AWSError, data: LakeFormation.Types.UpdateDataCellsFilterResponse) => void): Request<LakeFormation.Types.UpdateDataCellsFilterResponse, AWSError>;
  /**
   * Updates the list of possible values for the specified LF-tag key. If the LF-tag does not exist, the operation throws an EntityNotFoundException. The values in the delete key values will be deleted from list of possible values. If any value in the delete key values is attached to a resource, then API errors out with a 400 Exception - "Update not allowed". Untag the attribute before deleting the LF-tag key's value. 
   */
  updateLFTag(params: LakeFormation.Types.UpdateLFTagRequest, callback?: (err: AWSError, data: LakeFormation.Types.UpdateLFTagResponse) => void): Request<LakeFormation.Types.UpdateLFTagResponse, AWSError>;
  /**
   * Updates the list of possible values for the specified LF-tag key. If the LF-tag does not exist, the operation throws an EntityNotFoundException. The values in the delete key values will be deleted from list of possible values. If any value in the delete key values is attached to a resource, then API errors out with a 400 Exception - "Update not allowed". Untag the attribute before deleting the LF-tag key's value. 
   */
  updateLFTag(callback?: (err: AWSError, data: LakeFormation.Types.UpdateLFTagResponse) => void): Request<LakeFormation.Types.UpdateLFTagResponse, AWSError>;
  /**
   * Updates the data access role used for vending access to the given (registered) resource in Lake Formation. 
   */
  updateResource(params: LakeFormation.Types.UpdateResourceRequest, callback?: (err: AWSError, data: LakeFormation.Types.UpdateResourceResponse) => void): Request<LakeFormation.Types.UpdateResourceResponse, AWSError>;
  /**
   * Updates the data access role used for vending access to the given (registered) resource in Lake Formation. 
   */
  updateResource(callback?: (err: AWSError, data: LakeFormation.Types.UpdateResourceResponse) => void): Request<LakeFormation.Types.UpdateResourceResponse, AWSError>;
  /**
   * Updates the manifest of Amazon S3 objects that make up the specified governed table.
   */
  updateTableObjects(params: LakeFormation.Types.UpdateTableObjectsRequest, callback?: (err: AWSError, data: LakeFormation.Types.UpdateTableObjectsResponse) => void): Request<LakeFormation.Types.UpdateTableObjectsResponse, AWSError>;
  /**
   * Updates the manifest of Amazon S3 objects that make up the specified governed table.
   */
  updateTableObjects(callback?: (err: AWSError, data: LakeFormation.Types.UpdateTableObjectsResponse) => void): Request<LakeFormation.Types.UpdateTableObjectsResponse, AWSError>;
  /**
   * Updates the configuration of the storage optimizers for a table.
   */
  updateTableStorageOptimizer(params: LakeFormation.Types.UpdateTableStorageOptimizerRequest, callback?: (err: AWSError, data: LakeFormation.Types.UpdateTableStorageOptimizerResponse) => void): Request<LakeFormation.Types.UpdateTableStorageOptimizerResponse, AWSError>;
  /**
   * Updates the configuration of the storage optimizers for a table.
   */
  updateTableStorageOptimizer(callback?: (err: AWSError, data: LakeFormation.Types.UpdateTableStorageOptimizerResponse) => void): Request<LakeFormation.Types.UpdateTableStorageOptimizerResponse, AWSError>;
}
declare namespace LakeFormation {
  export type AccessKeyIdString = string;
  export interface AddLFTagsToResourceRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * The database, table, or column resource to which to attach an LF-tag.
     */
    Resource: Resource;
    /**
     * The LF-tags to attach to the resource.
     */
    LFTags: LFTagsList;
  }
  export interface AddLFTagsToResourceResponse {
    /**
     * A list of failures to tag the resource.
     */
    Failures?: LFTagErrors;
  }
  export interface AddObjectInput {
    /**
     * The Amazon S3 location of the object.
     */
    Uri: URI;
    /**
     * The Amazon S3 ETag of the object. Returned by GetTableObjects for validation and used to identify changes to the underlying data.
     */
    ETag: ETagString;
    /**
     * The size of the Amazon S3 object in bytes.
     */
    Size: ObjectSize;
    /**
     * A list of partition values for the object. A value must be specified for each partition key associated with the table. The supported data types are integer, long, date(yyyy-MM-dd), timestamp(yyyy-MM-dd HH:mm:ssXXX or yyyy-MM-dd HH:mm:ss"), string and decimal.
     */
    PartitionValues?: PartitionValuesList;
  }
  export interface AllRowsWildcard {
  }
  export interface AssumeDecoratedRoleWithSAMLRequest {
    /**
     * A SAML assertion consisting of an assertion statement for the user who needs temporary credentials. This must match the SAML assertion that was issued to IAM. This must be Base64 encoded.
     */
    SAMLAssertion: SAMLAssertionString;
    /**
     * The role that represents an IAM principal whose scope down policy allows it to call credential vending APIs such as GetTemporaryTableCredentials. The caller must also have iam:PassRole permission on this role. 
     */
    RoleArn: IAMRoleArn;
    /**
     * The Amazon Resource Name (ARN) of the SAML provider in IAM that describes the IdP.
     */
    PrincipalArn: IAMSAMLProviderArn;
    /**
     * The time period, between 900 and 43,200 seconds, for the timeout of the temporary credentials.
     */
    DurationSeconds?: CredentialTimeoutDurationSecondInteger;
  }
  export interface AssumeDecoratedRoleWithSAMLResponse {
    /**
     * The access key ID for the temporary credentials. (The access key consists of an access key ID and a secret key).
     */
    AccessKeyId?: AccessKeyIdString;
    /**
     * The secret key for the temporary credentials. (The access key consists of an access key ID and a secret key).
     */
    SecretAccessKey?: SecretAccessKeyString;
    /**
     * The session token for the temporary credentials.
     */
    SessionToken?: SessionTokenString;
    /**
     * The date and time when the temporary credentials expire.
     */
    Expiration?: ExpirationTimestamp;
  }
  export interface AuditContext {
    /**
     * The filter engine can populate the 'AdditionalAuditContext' information with the request ID for you to track. This information will be displayed in CloudTrail log in your account.
     */
    AdditionalAuditContext?: AuditContextString;
  }
  export type AuditContextString = string;
  export type AuthorizedSessionTagValueList = NameString[];
  export interface BatchGrantPermissionsRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * A list of up to 20 entries for resource permissions to be granted by batch operation to the principal.
     */
    Entries: BatchPermissionsRequestEntryList;
  }
  export interface BatchGrantPermissionsResponse {
    /**
     * A list of failures to grant permissions to the resources.
     */
    Failures?: BatchPermissionsFailureList;
  }
  export interface BatchPermissionsFailureEntry {
    /**
     * An identifier for an entry of the batch request.
     */
    RequestEntry?: BatchPermissionsRequestEntry;
    /**
     * An error message that applies to the failure of the entry.
     */
    Error?: ErrorDetail;
  }
  export type BatchPermissionsFailureList = BatchPermissionsFailureEntry[];
  export interface BatchPermissionsRequestEntry {
    /**
     * A unique identifier for the batch permissions request entry.
     */
    Id: Identifier;
    /**
     * The principal to be granted a permission.
     */
    Principal?: DataLakePrincipal;
    /**
     * The resource to which the principal is to be granted a permission.
     */
    Resource?: Resource;
    /**
     * The permissions to be granted.
     */
    Permissions?: PermissionList;
    /**
     * Indicates if the option to pass permissions is granted.
     */
    PermissionsWithGrantOption?: PermissionList;
  }
  export type BatchPermissionsRequestEntryList = BatchPermissionsRequestEntry[];
  export interface BatchRevokePermissionsRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * A list of up to 20 entries for resource permissions to be revoked by batch operation to the principal.
     */
    Entries: BatchPermissionsRequestEntryList;
  }
  export interface BatchRevokePermissionsResponse {
    /**
     * A list of failures to revoke permissions to the resources.
     */
    Failures?: BatchPermissionsFailureList;
  }
  export type BooleanNullable = boolean;
  export interface CancelTransactionRequest {
    /**
     * The transaction to cancel.
     */
    TransactionId: TransactionIdString;
  }
  export interface CancelTransactionResponse {
  }
  export type CatalogIdString = string;
  export interface CatalogResource {
  }
  export interface ColumnLFTag {
    /**
     * The name of a column resource.
     */
    Name?: NameString;
    /**
     * The LF-tags attached to a column resource.
     */
    LFTags?: LFTagsList;
  }
  export type ColumnLFTagsList = ColumnLFTag[];
  export type ColumnNames = NameString[];
  export interface ColumnWildcard {
    /**
     * Excludes column names. Any column with this name will be excluded.
     */
    ExcludedColumnNames?: ColumnNames;
  }
  export interface CommitTransactionRequest {
    /**
     * The transaction to commit.
     */
    TransactionId: TransactionIdString;
  }
  export interface CommitTransactionResponse {
    /**
     * The status of the transaction.
     */
    TransactionStatus?: TransactionStatus;
  }
  export type ComparisonOperator = "EQ"|"NE"|"LE"|"LT"|"GE"|"GT"|"CONTAINS"|"NOT_CONTAINS"|"BEGINS_WITH"|"IN"|"BETWEEN"|string;
  export interface CreateDataCellsFilterRequest {
    /**
     * A DataCellsFilter structure containing information about the data cells filter.
     */
    TableData: DataCellsFilter;
  }
  export interface CreateDataCellsFilterResponse {
  }
  export interface CreateLFTagRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * The key-name for the LF-tag.
     */
    TagKey: LFTagKey;
    /**
     * A list of possible values an attribute can take.
     */
    TagValues: TagValueList;
  }
  export interface CreateLFTagResponse {
  }
  export interface CreateLakeFormationOptInRequest {
    Principal: DataLakePrincipal;
    Resource: Resource;
  }
  export interface CreateLakeFormationOptInResponse {
  }
  export type CredentialTimeoutDurationSecondInteger = number;
  export interface DataCellsFilter {
    /**
     * The ID of the catalog to which the table belongs.
     */
    TableCatalogId: CatalogIdString;
    /**
     * A database in the Glue Data Catalog.
     */
    DatabaseName: NameString;
    /**
     * A table in the database.
     */
    TableName: NameString;
    /**
     * The name given by the user to the data filter cell.
     */
    Name: NameString;
    /**
     * A PartiQL predicate.
     */
    RowFilter?: RowFilter;
    /**
     * A list of column names and/or nested column attributes. When specifying nested attributes, use a qualified dot (.) delimited format such as "address"."zip". Nested attributes within this list may not exceed a depth of 5.
     */
    ColumnNames?: ColumnNames;
    /**
     * A wildcard with exclusions. You must specify either a ColumnNames list or the ColumnWildCard. 
     */
    ColumnWildcard?: ColumnWildcard;
    /**
     * The ID of the data cells filter version.
     */
    VersionId?: VersionString;
  }
  export type DataCellsFilterList = DataCellsFilter[];
  export interface DataCellsFilterResource {
    /**
     * The ID of the catalog to which the table belongs.
     */
    TableCatalogId?: CatalogIdString;
    /**
     * A database in the Glue Data Catalog.
     */
    DatabaseName?: NameString;
    /**
     * The name of the table.
     */
    TableName?: NameString;
    /**
     * The name of the data cells filter. 
     */
    Name?: NameString;
  }
  export interface DataLakePrincipal {
    /**
     * An identifier for the Lake Formation principal.
     */
    DataLakePrincipalIdentifier?: DataLakePrincipalString;
  }
  export type DataLakePrincipalList = DataLakePrincipal[];
  export type DataLakePrincipalString = string;
  export type DataLakeResourceType = "CATALOG"|"DATABASE"|"TABLE"|"DATA_LOCATION"|"LF_TAG"|"LF_TAG_POLICY"|"LF_TAG_POLICY_DATABASE"|"LF_TAG_POLICY_TABLE"|string;
  export interface DataLakeSettings {
    /**
     * A list of Lake Formation principals. Supported principals are IAM users or IAM roles.
     */
    DataLakeAdmins?: DataLakePrincipalList;
    /**
     * A list of Lake Formation principals with only view access to the resources, without the ability to make changes. Supported principals are IAM users or IAM roles.
     */
    ReadOnlyAdmins?: DataLakePrincipalList;
    /**
     * Specifies whether access control on newly created database is managed by Lake Formation permissions or exclusively by IAM permissions. A null value indicates access control by Lake Formation permissions. A value that assigns ALL to IAM_ALLOWED_PRINCIPALS indicates access control by IAM permissions. This is referred to as the setting "Use only IAM access control," and is for backward compatibility with the Glue permission model implemented by IAM permissions. The only permitted values are an empty array or an array that contains a single JSON object that grants ALL to IAM_ALLOWED_PRINCIPALS. For more information, see Changing the Default Security Settings for Your Data Lake.
     */
    CreateDatabaseDefaultPermissions?: PrincipalPermissionsList;
    /**
     * Specifies whether access control on newly created table is managed by Lake Formation permissions or exclusively by IAM permissions. A null value indicates access control by Lake Formation permissions. A value that assigns ALL to IAM_ALLOWED_PRINCIPALS indicates access control by IAM permissions. This is referred to as the setting "Use only IAM access control," and is for backward compatibility with the Glue permission model implemented by IAM permissions. The only permitted values are an empty array or an array that contains a single JSON object that grants ALL to IAM_ALLOWED_PRINCIPALS. For more information, see Changing the Default Security Settings for Your Data Lake.
     */
    CreateTableDefaultPermissions?: PrincipalPermissionsList;
    /**
     * A key-value map that provides an additional configuration on your data lake. CrossAccountVersion is the key you can configure in the Parameters field. Accepted values for the CrossAccountVersion key are 1, 2, and 3.
     */
    Parameters?: ParametersMap;
    /**
     * A list of the resource-owning account IDs that the caller's account can use to share their user access details (user ARNs). The user ARNs can be logged in the resource owner's CloudTrail log. You may want to specify this property when you are in a high-trust boundary, such as the same team or company. 
     */
    TrustedResourceOwners?: TrustedResourceOwners;
    /**
     * Whether to allow Amazon EMR clusters to access data managed by Lake Formation.  If true, you allow Amazon EMR clusters to access data in Amazon S3 locations that are registered with Lake Formation. If false or null, no Amazon EMR clusters will be able to access data in Amazon S3 locations that are registered with Lake Formation. For more information, see (Optional) Allow external data filtering.
     */
    AllowExternalDataFiltering?: NullableBoolean;
    /**
     * Whether to allow a third-party query engine to get data access credentials without session tags when a caller has full data access permissions.
     */
    AllowFullTableExternalDataAccess?: NullableBoolean;
    /**
     * A list of the account IDs of Amazon Web Services accounts with Amazon EMR clusters that are to perform data filtering.&gt;
     */
    ExternalDataFilteringAllowList?: DataLakePrincipalList;
    /**
     * Lake Formation relies on a privileged process secured by Amazon EMR or the third party integrator to tag the user's role while assuming it. Lake Formation will publish the acceptable key-value pair, for example key = "LakeFormationTrustedCaller" and value = "TRUE" and the third party integrator must properly tag the temporary security credentials that will be used to call Lake Formation's administrative APIs.
     */
    AuthorizedSessionTagValueList?: AuthorizedSessionTagValueList;
  }
  export interface DataLocationResource {
    /**
     * The identifier for the Data Catalog where the location is registered with Lake Formation. By default, it is the account ID of the caller.
     */
    CatalogId?: CatalogIdString;
    /**
     * The Amazon Resource Name (ARN) that uniquely identifies the data location resource.
     */
    ResourceArn: ResourceArnString;
  }
  export type DatabaseLFTagsList = TaggedDatabase[];
  export interface DatabaseResource {
    /**
     * The identifier for the Data Catalog. By default, it is the account ID of the caller.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the database resource. Unique to the Data Catalog.
     */
    Name: NameString;
  }
  export type DateTime = Date;
  export interface DeleteDataCellsFilterRequest {
    /**
     * The ID of the catalog to which the table belongs.
     */
    TableCatalogId?: CatalogIdString;
    /**
     * A database in the Glue Data Catalog.
     */
    DatabaseName?: NameString;
    /**
     * A table in the database.
     */
    TableName?: NameString;
    /**
     * The name given by the user to the data filter cell.
     */
    Name?: NameString;
  }
  export interface DeleteDataCellsFilterResponse {
  }
  export interface DeleteLFTagRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * The key-name for the LF-tag to delete.
     */
    TagKey: LFTagKey;
  }
  export interface DeleteLFTagResponse {
  }
  export interface DeleteLakeFormationOptInRequest {
    Principal: DataLakePrincipal;
    Resource: Resource;
  }
  export interface DeleteLakeFormationOptInResponse {
  }
  export interface DeleteObjectInput {
    /**
     * The Amazon S3 location of the object to delete.
     */
    Uri: URI;
    /**
     * The Amazon S3 ETag of the object. Returned by GetTableObjects for validation and used to identify changes to the underlying data.
     */
    ETag?: ETagString;
    /**
     * A list of partition values for the object. A value must be specified for each partition key associated with the governed table.
     */
    PartitionValues?: PartitionValuesList;
  }
  export interface DeleteObjectsOnCancelRequest {
    /**
     * The Glue data catalog that contains the governed table. Defaults to the current account ID.
     */
    CatalogId?: CatalogIdString;
    /**
     * The database that contains the governed table.
     */
    DatabaseName: NameString;
    /**
     * The name of the governed table.
     */
    TableName: NameString;
    /**
     * ID of the transaction that the writes occur in.
     */
    TransactionId: TransactionIdString;
    /**
     * A list of VirtualObject structures, which indicates the Amazon S3 objects to be deleted if the transaction cancels.
     */
    Objects: VirtualObjectList;
  }
  export interface DeleteObjectsOnCancelResponse {
  }
  export interface DeregisterResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to deregister.
     */
    ResourceArn: ResourceArnString;
  }
  export interface DeregisterResourceResponse {
  }
  export interface DescribeResourceRequest {
    /**
     * The resource ARN.
     */
    ResourceArn: ResourceArnString;
  }
  export interface DescribeResourceResponse {
    /**
     * A structure containing information about an Lake Formation resource.
     */
    ResourceInfo?: ResourceInfo;
  }
  export interface DescribeTransactionRequest {
    /**
     * The transaction for which to return status.
     */
    TransactionId: TransactionIdString;
  }
  export interface DescribeTransactionResponse {
    /**
     * Returns a TransactionDescription object containing information about the transaction.
     */
    TransactionDescription?: TransactionDescription;
  }
  export type DescriptionString = string;
  export interface DetailsMap {
    /**
     * A resource share ARN for a catalog resource shared through RAM.
     */
    ResourceShare?: ResourceShareList;
  }
  export type ETagString = string;
  export interface ErrorDetail {
    /**
     * The code associated with this error.
     */
    ErrorCode?: NameString;
    /**
     * A message describing the error.
     */
    ErrorMessage?: DescriptionString;
  }
  export type ErrorMessageString = string;
  export interface ExecutionStatistics {
    /**
     * The average time the request took to be executed.
     */
    AverageExecutionTimeMillis?: NumberOfMilliseconds;
    /**
     * The amount of data that was scanned in bytes.
     */
    DataScannedBytes?: NumberOfBytes;
    /**
     * The number of work units executed.
     */
    WorkUnitsExecutedCount?: NumberOfItems;
  }
  export type ExpirationTimestamp = Date;
  export type Expression = LFTag[];
  export interface ExtendTransactionRequest {
    /**
     * The transaction to extend.
     */
    TransactionId?: TransactionIdString;
  }
  export interface ExtendTransactionResponse {
  }
  export type FieldNameString = "RESOURCE_ARN"|"ROLE_ARN"|"LAST_MODIFIED"|string;
  export interface FilterCondition {
    /**
     * The field to filter in the filter condition.
     */
    Field?: FieldNameString;
    /**
     * The comparison operator used in the filter condition.
     */
    ComparisonOperator?: ComparisonOperator;
    /**
     * A string with values used in evaluating the filter condition.
     */
    StringValueList?: StringValueList;
  }
  export type FilterConditionList = FilterCondition[];
  export interface GetDataCellsFilterRequest {
    /**
     * The ID of the catalog to which the table belongs.
     */
    TableCatalogId: CatalogIdString;
    /**
     * A database in the Glue Data Catalog.
     */
    DatabaseName: NameString;
    /**
     * A table in the database.
     */
    TableName: NameString;
    /**
     * The name given by the user to the data filter cell.
     */
    Name: NameString;
  }
  export interface GetDataCellsFilterResponse {
    /**
     * A structure that describes certain columns on certain rows.
     */
    DataCellsFilter?: DataCellsFilter;
  }
  export interface GetDataLakeSettingsRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
  }
  export interface GetDataLakeSettingsResponse {
    /**
     * A structure representing a list of Lake Formation principals designated as data lake administrators.
     */
    DataLakeSettings?: DataLakeSettings;
  }
  export interface GetEffectivePermissionsForPathRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * The Amazon Resource Name (ARN) of the resource for which you want to get permissions.
     */
    ResourceArn: ResourceArnString;
    /**
     * A continuation token, if this is not the first call to retrieve this list.
     */
    NextToken?: Token;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: PageSize;
  }
  export interface GetEffectivePermissionsForPathResponse {
    /**
     * A list of the permissions for the specified table or database resource located at the path in Amazon S3.
     */
    Permissions?: PrincipalResourcePermissionsList;
    /**
     * A continuation token, if this is not the first call to retrieve this list.
     */
    NextToken?: Token;
  }
  export interface GetLFTagRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * The key-name for the LF-tag.
     */
    TagKey: LFTagKey;
  }
  export interface GetLFTagResponse {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * The key-name for the LF-tag.
     */
    TagKey?: LFTagKey;
    /**
     * A list of possible values an attribute can take.
     */
    TagValues?: TagValueList;
  }
  export interface GetQueryStateRequest {
    /**
     * The ID of the plan query operation.
     */
    QueryId: GetQueryStateRequestQueryIdString;
  }
  export type GetQueryStateRequestQueryIdString = string;
  export interface GetQueryStateResponse {
    /**
     * An error message when the operation fails.
     */
    Error?: ErrorMessageString;
    /**
     * The state of a query previously submitted. The possible states are:   PENDING: the query is pending.   WORKUNITS_AVAILABLE: some work units are ready for retrieval and execution.   FINISHED: the query planning finished successfully, and all work units are ready for retrieval and execution.   ERROR: an error occurred with the query, such as an invalid query ID or a backend error.  
     */
    State: QueryStateString;
  }
  export interface GetQueryStatisticsRequest {
    /**
     * The ID of the plan query operation.
     */
    QueryId: GetQueryStatisticsRequestQueryIdString;
  }
  export type GetQueryStatisticsRequestQueryIdString = string;
  export interface GetQueryStatisticsResponse {
    /**
     * An ExecutionStatistics structure containing execution statistics.
     */
    ExecutionStatistics?: ExecutionStatistics;
    /**
     * A PlanningStatistics structure containing query planning statistics.
     */
    PlanningStatistics?: PlanningStatistics;
    /**
     * The time that the query was submitted.
     */
    QuerySubmissionTime?: DateTime;
  }
  export interface GetResourceLFTagsRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * The database, table, or column resource for which you want to return LF-tags.
     */
    Resource: Resource;
    /**
     * Indicates whether to show the assigned LF-tags.
     */
    ShowAssignedLFTags?: BooleanNullable;
  }
  export interface GetResourceLFTagsResponse {
    /**
     * A list of LF-tags applied to a database resource.
     */
    LFTagOnDatabase?: LFTagsList;
    /**
     * A list of LF-tags applied to a table resource.
     */
    LFTagsOnTable?: LFTagsList;
    /**
     * A list of LF-tags applied to a column resource.
     */
    LFTagsOnColumns?: ColumnLFTagsList;
  }
  export interface GetTableObjectsRequest {
    /**
     * The catalog containing the governed table. Defaults to the caller’s account.
     */
    CatalogId?: CatalogIdString;
    /**
     * The database containing the governed table.
     */
    DatabaseName: NameString;
    /**
     * The governed table for which to retrieve objects.
     */
    TableName: NameString;
    /**
     * The transaction ID at which to read the governed table contents. If this transaction has aborted, an error is returned. If not set, defaults to the most recent committed transaction. Cannot be specified along with QueryAsOfTime.
     */
    TransactionId?: TransactionIdString;
    /**
     * The time as of when to read the governed table contents. If not set, the most recent transaction commit time is used. Cannot be specified along with TransactionId.
     */
    QueryAsOfTime?: Timestamp;
    /**
     * A predicate to filter the objects returned based on the partition keys defined in the governed table.   The comparison operators supported are: =, &gt;, &lt;, &gt;=, &lt;=   The logical operators supported are: AND   The data types supported are integer, long, date(yyyy-MM-dd), timestamp(yyyy-MM-dd HH:mm:ssXXX or yyyy-MM-dd HH:mm:ss"), string and decimal.  
     */
    PartitionPredicate?: PredicateString;
    /**
     * Specifies how many values to return in a page.
     */
    MaxResults?: PageSize;
    /**
     * A continuation token if this is not the first call to retrieve these objects.
     */
    NextToken?: TokenString;
  }
  export interface GetTableObjectsResponse {
    /**
     * A list of objects organized by partition keys.
     */
    Objects?: PartitionedTableObjectsList;
    /**
     * A continuation token indicating whether additional data is available.
     */
    NextToken?: TokenString;
  }
  export interface GetTemporaryGluePartitionCredentialsRequest {
    /**
     * The ARN of the partitions' table.
     */
    TableArn: ResourceArnString;
    /**
     * A list of partition values identifying a single partition.
     */
    Partition: PartitionValueList;
    /**
     * Filters the request based on the user having been granted a list of specified permissions on the requested resource(s).
     */
    Permissions?: PermissionList;
    /**
     * The time period, between 900 and 21,600 seconds, for the timeout of the temporary credentials.
     */
    DurationSeconds?: CredentialTimeoutDurationSecondInteger;
    /**
     * A structure representing context to access a resource (column names, query ID, etc).
     */
    AuditContext?: AuditContext;
    /**
     * A list of supported permission types for the partition. Valid values are COLUMN_PERMISSION and CELL_FILTER_PERMISSION.
     */
    SupportedPermissionTypes?: PermissionTypeList;
  }
  export interface GetTemporaryGluePartitionCredentialsResponse {
    /**
     * The access key ID for the temporary credentials.
     */
    AccessKeyId?: AccessKeyIdString;
    /**
     * The secret key for the temporary credentials.
     */
    SecretAccessKey?: SecretAccessKeyString;
    /**
     * The session token for the temporary credentials.
     */
    SessionToken?: SessionTokenString;
    /**
     * The date and time when the temporary credentials expire.
     */
    Expiration?: ExpirationTimestamp;
  }
  export interface GetTemporaryGlueTableCredentialsRequest {
    /**
     * The ARN identifying a table in the Data Catalog for the temporary credentials request.
     */
    TableArn: ResourceArnString;
    /**
     * Filters the request based on the user having been granted a list of specified permissions on the requested resource(s).
     */
    Permissions?: PermissionList;
    /**
     * The time period, between 900 and 21,600 seconds, for the timeout of the temporary credentials.
     */
    DurationSeconds?: CredentialTimeoutDurationSecondInteger;
    /**
     * A structure representing context to access a resource (column names, query ID, etc).
     */
    AuditContext?: AuditContext;
    /**
     * A list of supported permission types for the table. Valid values are COLUMN_PERMISSION and CELL_FILTER_PERMISSION.
     */
    SupportedPermissionTypes?: PermissionTypeList;
  }
  export interface GetTemporaryGlueTableCredentialsResponse {
    /**
     * The access key ID for the temporary credentials.
     */
    AccessKeyId?: AccessKeyIdString;
    /**
     * The secret key for the temporary credentials.
     */
    SecretAccessKey?: SecretAccessKeyString;
    /**
     * The session token for the temporary credentials.
     */
    SessionToken?: SessionTokenString;
    /**
     * The date and time when the temporary credentials expire.
     */
    Expiration?: ExpirationTimestamp;
  }
  export interface GetWorkUnitResultsRequest {
    /**
     * The ID of the plan query operation for which to get results.
     */
    QueryId: GetWorkUnitResultsRequestQueryIdString;
    /**
     * The work unit ID for which to get results. Value generated by enumerating WorkUnitIdMin to WorkUnitIdMax (inclusive) from the WorkUnitRange in the output of GetWorkUnits.
     */
    WorkUnitId: GetWorkUnitResultsRequestWorkUnitIdLong;
    /**
     * A work token used to query the execution service. Token output from GetWorkUnits.
     */
    WorkUnitToken: SyntheticGetWorkUnitResultsRequestWorkUnitTokenString;
  }
  export type GetWorkUnitResultsRequestQueryIdString = string;
  export type GetWorkUnitResultsRequestWorkUnitIdLong = number;
  export interface GetWorkUnitResultsResponse {
    /**
     * Rows returned from the GetWorkUnitResults operation as a stream of Apache Arrow v1.0 messages.
     */
    ResultStream?: ResultStream;
  }
  export interface GetWorkUnitsRequest {
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: Token;
    /**
     * The size of each page to get in the Amazon Web Services service call. This does not affect the number of items returned in the command's output. Setting a smaller page size results in more calls to the Amazon Web Services service, retrieving fewer items in each call. This can help prevent the Amazon Web Services service calls from timing out.
     */
    PageSize?: Integer;
    /**
     * The ID of the plan query operation.
     */
    QueryId: GetWorkUnitsRequestQueryIdString;
  }
  export type GetWorkUnitsRequestQueryIdString = string;
  export interface GetWorkUnitsResponse {
    /**
     * A continuation token for paginating the returned list of tokens, returned if the current segment of the list is not the last.
     */
    NextToken?: Token;
    /**
     * The ID of the plan query operation.
     */
    QueryId: QueryIdString;
    /**
     * A WorkUnitRangeList object that specifies the valid range of work unit IDs for querying the execution service.
     */
    WorkUnitRanges: WorkUnitRangeList;
  }
  export interface GrantPermissionsRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * The principal to be granted the permissions on the resource. Supported principals are IAM users or IAM roles, and they are defined by their principal type and their ARN. Note that if you define a resource with a particular ARN, then later delete, and recreate a resource with that same ARN, the resource maintains the permissions already granted. 
     */
    Principal: DataLakePrincipal;
    /**
     * The resource to which permissions are to be granted. Resources in Lake Formation are the Data Catalog, databases, and tables.
     */
    Resource: Resource;
    /**
     * The permissions granted to the principal on the resource. Lake Formation defines privileges to grant and revoke access to metadata in the Data Catalog and data organized in underlying data storage such as Amazon S3. Lake Formation requires that each principal be authorized to perform a specific task on Lake Formation resources. 
     */
    Permissions: PermissionList;
    /**
     * Indicates a list of the granted permissions that the principal may pass to other users. These permissions may only be a subset of the permissions granted in the Privileges.
     */
    PermissionsWithGrantOption?: PermissionList;
  }
  export interface GrantPermissionsResponse {
  }
  export type IAMRoleArn = string;
  export type IAMSAMLProviderArn = string;
  export type Identifier = string;
  export type Integer = number;
  export type KeyString = string;
  export interface LFTag {
    /**
     * The key-name for the LF-tag.
     */
    TagKey: LFTagKey;
    /**
     * A list of possible values an attribute can take. The maximum number of values that can be defined for a LF-Tag is 1000. A single API call supports 50 values. You can use multiple API calls to add more values.
     */
    TagValues: TagValueList;
  }
  export interface LFTagError {
    /**
     * The key-name of the LF-tag.
     */
    LFTag?: LFTagPair;
    /**
     * An error that occurred with the attachment or detachment of the LF-tag.
     */
    Error?: ErrorDetail;
  }
  export type LFTagErrors = LFTagError[];
  export type LFTagKey = string;
  export interface LFTagKeyResource {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * The key-name for the LF-tag.
     */
    TagKey: NameString;
    /**
     * A list of possible values an attribute can take.
     */
    TagValues: TagValueList;
  }
  export interface LFTagPair {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * The key-name for the LF-tag.
     */
    TagKey: LFTagKey;
    /**
     * A list of possible values an attribute can take.
     */
    TagValues: TagValueList;
  }
  export interface LFTagPolicyResource {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * The resource type for which the LF-tag policy applies.
     */
    ResourceType: ResourceType;
    /**
     * A list of LF-tag conditions that apply to the resource's LF-tag policy.
     */
    Expression: Expression;
  }
  export type LFTagValue = string;
  export type LFTagsList = LFTagPair[];
  export interface LakeFormationOptInsInfo {
    Resource?: Resource;
    Principal?: DataLakePrincipal;
    /**
     * The last modified date and time of the record.
     */
    LastModified?: LastModifiedTimestamp;
    /**
     * The user who updated the record.
     */
    LastUpdatedBy?: NameString;
  }
  export type LakeFormationOptInsInfoList = LakeFormationOptInsInfo[];
  export type LastModifiedTimestamp = Date;
  export interface ListDataCellsFilterRequest {
    /**
     * A table in the Glue Data Catalog.
     */
    Table?: TableResource;
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: Token;
    /**
     * The maximum size of the response.
     */
    MaxResults?: PageSize;
  }
  export interface ListDataCellsFilterResponse {
    /**
     * A list of DataCellFilter structures.
     */
    DataCellsFilters?: DataCellsFilterList;
    /**
     * A continuation token, if not all requested data cell filters have been returned.
     */
    NextToken?: Token;
  }
  export interface ListLFTagsRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * If resource share type is ALL, returns both in-account LF-tags and shared LF-tags that the requester has permission to view. If resource share type is FOREIGN, returns all share LF-tags that the requester can view. If no resource share type is passed, lists LF-tags in the given catalog ID that the requester has permission to view.
     */
    ResourceShareType?: ResourceShareType;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: PageSize;
    /**
     * A continuation token, if this is not the first call to retrieve this list.
     */
    NextToken?: Token;
  }
  export interface ListLFTagsResponse {
    /**
     * A list of LF-tags that the requested has permission to view.
     */
    LFTags?: LFTagsList;
    /**
     * A continuation token, present if the current list segment is not the last.
     */
    NextToken?: Token;
  }
  export interface ListLakeFormationOptInsRequest {
    Principal?: DataLakePrincipal;
    /**
     * A structure for the resource.
     */
    Resource?: Resource;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: PageSize;
    /**
     * A continuation token, if this is not the first call to retrieve this list.
     */
    NextToken?: Token;
  }
  export interface ListLakeFormationOptInsResponse {
    /**
     * A list of principal-resource pairs that have Lake Formation permissins enforced.
     */
    LakeFormationOptInsInfoList?: LakeFormationOptInsInfoList;
    /**
     * A continuation token, if this is not the first call to retrieve this list.
     */
    NextToken?: Token;
  }
  export interface ListPermissionsRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * Specifies a principal to filter the permissions returned.
     */
    Principal?: DataLakePrincipal;
    /**
     * Specifies a resource type to filter the permissions returned.
     */
    ResourceType?: DataLakeResourceType;
    /**
     * A resource where you will get a list of the principal permissions. This operation does not support getting privileges on a table with columns. Instead, call this operation on the table, and the operation returns the table and the table w columns.
     */
    Resource?: Resource;
    /**
     * A continuation token, if this is not the first call to retrieve this list.
     */
    NextToken?: Token;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: PageSize;
    /**
     * Indicates that related permissions should be included in the results.
     */
    IncludeRelated?: TrueFalseString;
  }
  export interface ListPermissionsResponse {
    /**
     * A list of principals and their permissions on the resource for the specified principal and resource types.
     */
    PrincipalResourcePermissions?: PrincipalResourcePermissionsList;
    /**
     * A continuation token, if this is not the first call to retrieve this list.
     */
    NextToken?: Token;
  }
  export interface ListResourcesRequest {
    /**
     * Any applicable row-level and/or column-level filtering conditions for the resources.
     */
    FilterConditionList?: FilterConditionList;
    /**
     * The maximum number of resource results.
     */
    MaxResults?: PageSize;
    /**
     * A continuation token, if this is not the first call to retrieve these resources.
     */
    NextToken?: Token;
  }
  export interface ListResourcesResponse {
    /**
     * A summary of the data lake resources.
     */
    ResourceInfoList?: ResourceInfoList;
    /**
     * A continuation token, if this is not the first call to retrieve these resources.
     */
    NextToken?: Token;
  }
  export interface ListTableStorageOptimizersRequest {
    /**
     * The Catalog ID of the table.
     */
    CatalogId?: CatalogIdString;
    /**
     * Name of the database where the table is present.
     */
    DatabaseName: NameString;
    /**
     * Name of the table.
     */
    TableName: NameString;
    /**
     * The specific type of storage optimizers to list. The supported value is compaction.
     */
    StorageOptimizerType?: OptimizerType;
    /**
     * The number of storage optimizers to return on each call.
     */
    MaxResults?: PageSize;
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: Token;
  }
  export interface ListTableStorageOptimizersResponse {
    /**
     * A list of the storage optimizers associated with a table.
     */
    StorageOptimizerList?: StorageOptimizerList;
    /**
     * A continuation token for paginating the returned list of tokens, returned if the current segment of the list is not the last.
     */
    NextToken?: Token;
  }
  export interface ListTransactionsRequest {
    /**
     * The catalog for which to list transactions. Defaults to the account ID of the caller.
     */
    CatalogId?: CatalogIdString;
    /**
     *  A filter indicating the status of transactions to return. Options are ALL | COMPLETED | COMMITTED | ABORTED | ACTIVE. The default is ALL.
     */
    StatusFilter?: TransactionStatusFilter;
    /**
     * The maximum number of transactions to return in a single call.
     */
    MaxResults?: PageSize;
    /**
     * A continuation token if this is not the first call to retrieve transactions.
     */
    NextToken?: TokenString;
  }
  export interface ListTransactionsResponse {
    /**
     * A list of transactions. The record for each transaction is a TransactionDescription object.
     */
    Transactions?: TransactionDescriptionList;
    /**
     * A continuation token indicating whether additional data is available.
     */
    NextToken?: TokenString;
  }
  export type MessageString = string;
  export type NameString = string;
  export type NullableBoolean = boolean;
  export type NumberOfBytes = number;
  export type NumberOfItems = number;
  export type NumberOfMilliseconds = number;
  export type ObjectSize = number;
  export type OptimizerType = "COMPACTION"|"GARBAGE_COLLECTION"|"ALL"|string;
  export type PageSize = number;
  export type ParametersMap = {[key: string]: ParametersMapValue};
  export type ParametersMapValue = string;
  export interface PartitionObjects {
    /**
     * A list of partition values.
     */
    PartitionValues?: PartitionValuesList;
    /**
     * A list of table objects
     */
    Objects?: TableObjectList;
  }
  export interface PartitionValueList {
    /**
     * The list of partition values.
     */
    Values: ValueStringList;
  }
  export type PartitionValueString = string;
  export type PartitionValuesList = PartitionValueString[];
  export type PartitionedTableObjectsList = PartitionObjects[];
  export type Permission = "ALL"|"SELECT"|"ALTER"|"DROP"|"DELETE"|"INSERT"|"DESCRIBE"|"CREATE_DATABASE"|"CREATE_TABLE"|"DATA_LOCATION_ACCESS"|"CREATE_LF_TAG"|"ASSOCIATE"|"GRANT_WITH_LF_TAG_EXPRESSION"|string;
  export type PermissionList = Permission[];
  export type PermissionType = "COLUMN_PERMISSION"|"CELL_FILTER_PERMISSION"|"NESTED_PERMISSION"|"NESTED_CELL_PERMISSION"|string;
  export type PermissionTypeList = PermissionType[];
  export interface PlanningStatistics {
    /**
     * An estimate of the data that was scanned in bytes.
     */
    EstimatedDataToScanBytes?: NumberOfBytes;
    /**
     * The time that it took to process the request.
     */
    PlanningTimeMillis?: NumberOfMilliseconds;
    /**
     * The time the request was in queue to be processed.
     */
    QueueTimeMillis?: NumberOfMilliseconds;
    /**
     * The number of work units generated.
     */
    WorkUnitsGeneratedCount?: NumberOfItems;
  }
  export type PredicateString = string;
  export interface PrincipalPermissions {
    /**
     * The principal who is granted permissions.
     */
    Principal?: DataLakePrincipal;
    /**
     * The permissions that are granted to the principal.
     */
    Permissions?: PermissionList;
  }
  export type PrincipalPermissionsList = PrincipalPermissions[];
  export interface PrincipalResourcePermissions {
    /**
     * The Data Lake principal to be granted or revoked permissions.
     */
    Principal?: DataLakePrincipal;
    /**
     * The resource where permissions are to be granted or revoked.
     */
    Resource?: Resource;
    /**
     * The permissions to be granted or revoked on the resource.
     */
    Permissions?: PermissionList;
    /**
     * Indicates whether to grant the ability to grant permissions (as a subset of permissions granted).
     */
    PermissionsWithGrantOption?: PermissionList;
    /**
     * This attribute can be used to return any additional details of PrincipalResourcePermissions. Currently returns only as a RAM resource share ARN.
     */
    AdditionalDetails?: DetailsMap;
    /**
     * The date and time when the resource was last updated.
     */
    LastUpdated?: LastModifiedTimestamp;
    /**
     * The user who updated the record.
     */
    LastUpdatedBy?: NameString;
  }
  export type PrincipalResourcePermissionsList = PrincipalResourcePermissions[];
  export interface PutDataLakeSettingsRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * A structure representing a list of Lake Formation principals designated as data lake administrators.
     */
    DataLakeSettings: DataLakeSettings;
  }
  export interface PutDataLakeSettingsResponse {
  }
  export type QueryIdString = string;
  export type QueryParameterMap = {[key: string]: String};
  export interface QueryPlanningContext {
    /**
     * The ID of the Data Catalog where the partition in question resides. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The database containing the table.
     */
    DatabaseName: QueryPlanningContextDatabaseNameString;
    /**
     * The time as of when to read the table contents. If not set, the most recent transaction commit time will be used. Cannot be specified along with TransactionId.
     */
    QueryAsOfTime?: Timestamp;
    /**
     * A map consisting of key-value pairs.
     */
    QueryParameters?: QueryParameterMap;
    /**
     * The transaction ID at which to read the table contents. If this transaction is not committed, the read will be treated as part of that transaction and will see its writes. If this transaction has aborted, an error will be returned. If not set, defaults to the most recent committed transaction. Cannot be specified along with QueryAsOfTime.
     */
    TransactionId?: TransactionIdString;
  }
  export type QueryPlanningContextDatabaseNameString = string;
  export type QueryStateString = "PENDING"|"WORKUNITS_AVAILABLE"|"ERROR"|"FINISHED"|"EXPIRED"|string;
  export type RAMResourceShareArn = string;
  export interface RegisterResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to register.
     */
    ResourceArn: ResourceArnString;
    /**
     * Designates an Identity and Access Management (IAM) service-linked role by registering this role with the Data Catalog. A service-linked role is a unique type of IAM role that is linked directly to Lake Formation. For more information, see Using Service-Linked Roles for Lake Formation.
     */
    UseServiceLinkedRole?: NullableBoolean;
    /**
     * The identifier for the role that registers the resource.
     */
    RoleArn?: IAMRoleArn;
    /**
     * Whether or not the resource is a federated resource.
     */
    WithFederation?: NullableBoolean;
    /**
     *  Specifies whether the data access of tables pointing to the location can be managed by both Lake Formation permissions as well as Amazon S3 bucket policies. 
     */
    HybridAccessEnabled?: NullableBoolean;
  }
  export interface RegisterResourceResponse {
  }
  export interface RemoveLFTagsFromResourceRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * The database, table, or column resource where you want to remove an LF-tag.
     */
    Resource: Resource;
    /**
     * The LF-tags to be removed from the resource.
     */
    LFTags: LFTagsList;
  }
  export interface RemoveLFTagsFromResourceResponse {
    /**
     * A list of failures to untag a resource.
     */
    Failures?: LFTagErrors;
  }
  export interface Resource {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    Catalog?: CatalogResource;
    /**
     * The database for the resource. Unique to the Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database permissions to a principal. 
     */
    Database?: DatabaseResource;
    /**
     * The table for the resource. A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal. 
     */
    Table?: TableResource;
    /**
     * The table with columns for the resource. A principal with permissions to this resource can select metadata from the columns of a table in the Data Catalog and the underlying data in Amazon S3.
     */
    TableWithColumns?: TableWithColumnsResource;
    /**
     * The location of an Amazon S3 path where permissions are granted or revoked. 
     */
    DataLocation?: DataLocationResource;
    /**
     * A data cell filter.
     */
    DataCellsFilter?: DataCellsFilterResource;
    /**
     * The LF-tag key and values attached to a resource.
     */
    LFTag?: LFTagKeyResource;
    /**
     * A list of LF-tag conditions that define a resource's LF-tag policy.
     */
    LFTagPolicy?: LFTagPolicyResource;
  }
  export type ResourceArnString = string;
  export interface ResourceInfo {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn?: ResourceArnString;
    /**
     * The IAM role that registered a resource.
     */
    RoleArn?: IAMRoleArn;
    /**
     * The date and time the resource was last modified.
     */
    LastModified?: LastModifiedTimestamp;
    /**
     * Whether or not the resource is a federated resource.
     */
    WithFederation?: NullableBoolean;
    /**
     *  Indicates whether the data access of tables pointing to the location can be managed by both Lake Formation permissions as well as Amazon S3 bucket policies. 
     */
    HybridAccessEnabled?: NullableBoolean;
  }
  export type ResourceInfoList = ResourceInfo[];
  export type ResourceShareList = RAMResourceShareArn[];
  export type ResourceShareType = "FOREIGN"|"ALL"|string;
  export type ResourceType = "DATABASE"|"TABLE"|string;
  export type Result = string;
  export type ResultStream = Buffer|Uint8Array|Blob|string|Readable;
  export interface RevokePermissionsRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * The principal to be revoked permissions on the resource.
     */
    Principal: DataLakePrincipal;
    /**
     * The resource to which permissions are to be revoked.
     */
    Resource: Resource;
    /**
     * The permissions revoked to the principal on the resource. For information about permissions, see Security and Access Control to Metadata and Data.
     */
    Permissions: PermissionList;
    /**
     * Indicates a list of permissions for which to revoke the grant option allowing the principal to pass permissions to other principals.
     */
    PermissionsWithGrantOption?: PermissionList;
  }
  export interface RevokePermissionsResponse {
  }
  export interface RowFilter {
    /**
     * A filter expression.
     */
    FilterExpression?: PredicateString;
    /**
     * A wildcard for all rows.
     */
    AllRowsWildcard?: AllRowsWildcard;
  }
  export type SAMLAssertionString = string;
  export interface SearchDatabasesByLFTagsRequest {
    /**
     * A continuation token, if this is not the first call to retrieve this list.
     */
    NextToken?: Token;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: SearchPageSize;
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * A list of conditions (LFTag structures) to search for in database resources.
     */
    Expression: Expression;
  }
  export interface SearchDatabasesByLFTagsResponse {
    /**
     * A continuation token, present if the current list segment is not the last.
     */
    NextToken?: Token;
    /**
     * A list of databases that meet the LF-tag conditions.
     */
    DatabaseList?: DatabaseLFTagsList;
  }
  export type SearchPageSize = number;
  export interface SearchTablesByLFTagsRequest {
    /**
     * A continuation token, if this is not the first call to retrieve this list.
     */
    NextToken?: Token;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: SearchPageSize;
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * A list of conditions (LFTag structures) to search for in table resources.
     */
    Expression: Expression;
  }
  export interface SearchTablesByLFTagsResponse {
    /**
     * A continuation token, present if the current list segment is not the last.
     */
    NextToken?: Token;
    /**
     * A list of tables that meet the LF-tag conditions.
     */
    TableList?: TableLFTagsList;
  }
  export type SecretAccessKeyString = string;
  export type SessionTokenString = string;
  export interface StartQueryPlanningRequest {
    /**
     * A structure containing information about the query plan.
     */
    QueryPlanningContext: QueryPlanningContext;
    /**
     * A PartiQL query statement used as an input to the planner service.
     */
    QueryString: SyntheticStartQueryPlanningRequestQueryString;
  }
  export interface StartQueryPlanningResponse {
    /**
     * The ID of the plan query operation can be used to fetch the actual work unit descriptors that are produced as the result of the operation. The ID is also used to get the query state and as an input to the Execute operation.
     */
    QueryId: QueryIdString;
  }
  export interface StartTransactionRequest {
    /**
     * Indicates whether this transaction should be read only or read and write. Writes made using a read-only transaction ID will be rejected. Read-only transactions do not need to be committed. 
     */
    TransactionType?: TransactionType;
  }
  export interface StartTransactionResponse {
    /**
     * An opaque identifier for the transaction.
     */
    TransactionId?: TransactionIdString;
  }
  export interface StorageOptimizer {
    /**
     * The specific type of storage optimizer. The supported value is compaction.
     */
    StorageOptimizerType?: OptimizerType;
    /**
     * A map of the storage optimizer configuration. Currently contains only one key-value pair: is_enabled indicates true or false for acceleration.
     */
    Config?: StorageOptimizerConfig;
    /**
     * A message that contains information about any error (if present). When an acceleration result has an enabled status, the error message is empty. When an acceleration result has a disabled status, the message describes an error or simply indicates "disabled by the user".
     */
    ErrorMessage?: MessageString;
    /**
     * A message that contains information about any warnings (if present).
     */
    Warnings?: MessageString;
    /**
     * When an acceleration result has an enabled status, contains the details of the last job run.
     */
    LastRunDetails?: MessageString;
  }
  export type StorageOptimizerConfig = {[key: string]: StorageOptimizerConfigValue};
  export type StorageOptimizerConfigKey = string;
  export type StorageOptimizerConfigMap = {[key: string]: StorageOptimizerConfig};
  export type StorageOptimizerConfigValue = string;
  export type StorageOptimizerList = StorageOptimizer[];
  export type String = string;
  export type StringValue = string;
  export type StringValueList = StringValue[];
  export type SyntheticGetWorkUnitResultsRequestWorkUnitTokenString = string;
  export type SyntheticStartQueryPlanningRequestQueryString = string;
  export type TableLFTagsList = TaggedTable[];
  export interface TableObject {
    /**
     * The Amazon S3 location of the object.
     */
    Uri?: URI;
    /**
     * The Amazon S3 ETag of the object. Returned by GetTableObjects for validation and used to identify changes to the underlying data.
     */
    ETag?: ETagString;
    /**
     * The size of the Amazon S3 object in bytes.
     */
    Size?: ObjectSize;
  }
  export type TableObjectList = TableObject[];
  export interface TableResource {
    /**
     * The identifier for the Data Catalog. By default, it is the account ID of the caller.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the database for the table. Unique to a Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database privileges to a principal. 
     */
    DatabaseName: NameString;
    /**
     * The name of the table.
     */
    Name?: NameString;
    /**
     * A wildcard object representing every table under a database. At least one of TableResource$Name or TableResource$TableWildcard is required.
     */
    TableWildcard?: TableWildcard;
  }
  export interface TableWildcard {
  }
  export interface TableWithColumnsResource {
    /**
     * The identifier for the Data Catalog. By default, it is the account ID of the caller.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the database for the table with columns resource. Unique to the Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database privileges to a principal. 
     */
    DatabaseName: NameString;
    /**
     * The name of the table resource. A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal. 
     */
    Name: NameString;
    /**
     * The list of column names for the table. At least one of ColumnNames or ColumnWildcard is required.
     */
    ColumnNames?: ColumnNames;
    /**
     * A wildcard specified by a ColumnWildcard object. At least one of ColumnNames or ColumnWildcard is required.
     */
    ColumnWildcard?: ColumnWildcard;
  }
  export type TagValueList = LFTagValue[];
  export interface TaggedDatabase {
    /**
     * A database that has LF-tags attached to it.
     */
    Database?: DatabaseResource;
    /**
     * A list of LF-tags attached to the database.
     */
    LFTags?: LFTagsList;
  }
  export interface TaggedTable {
    /**
     * A table that has LF-tags attached to it.
     */
    Table?: TableResource;
    /**
     * A list of LF-tags attached to the database where the table resides.
     */
    LFTagOnDatabase?: LFTagsList;
    /**
     * A list of LF-tags attached to the table.
     */
    LFTagsOnTable?: LFTagsList;
    /**
     * A list of LF-tags attached to columns in the table.
     */
    LFTagsOnColumns?: ColumnLFTagsList;
  }
  export type Timestamp = Date;
  export type Token = string;
  export type TokenString = string;
  export interface TransactionDescription {
    /**
     * The ID of the transaction.
     */
    TransactionId?: TransactionIdString;
    /**
     * A status of ACTIVE, COMMITTED, or ABORTED.
     */
    TransactionStatus?: TransactionStatus;
    /**
     * The time when the transaction started.
     */
    TransactionStartTime?: Timestamp;
    /**
     * The time when the transaction committed or aborted, if it is not currently active.
     */
    TransactionEndTime?: Timestamp;
  }
  export type TransactionDescriptionList = TransactionDescription[];
  export type TransactionIdString = string;
  export type TransactionStatus = "ACTIVE"|"COMMITTED"|"ABORTED"|"COMMIT_IN_PROGRESS"|string;
  export type TransactionStatusFilter = "ALL"|"COMPLETED"|"ACTIVE"|"COMMITTED"|"ABORTED"|string;
  export type TransactionType = "READ_AND_WRITE"|"READ_ONLY"|string;
  export type TrueFalseString = string;
  export type TrustedResourceOwners = CatalogIdString[];
  export type URI = string;
  export interface UpdateDataCellsFilterRequest {
    /**
     * A DataCellsFilter structure containing information about the data cells filter.
     */
    TableData: DataCellsFilter;
  }
  export interface UpdateDataCellsFilterResponse {
  }
  export interface UpdateLFTagRequest {
    /**
     * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment. 
     */
    CatalogId?: CatalogIdString;
    /**
     * The key-name for the LF-tag for which to add or delete values.
     */
    TagKey: LFTagKey;
    /**
     * A list of LF-tag values to delete from the LF-tag.
     */
    TagValuesToDelete?: TagValueList;
    /**
     * A list of LF-tag values to add from the LF-tag.
     */
    TagValuesToAdd?: TagValueList;
  }
  export interface UpdateLFTagResponse {
  }
  export interface UpdateResourceRequest {
    /**
     * The new role to use for the given resource registered in Lake Formation.
     */
    RoleArn: IAMRoleArn;
    /**
     * The resource ARN.
     */
    ResourceArn: ResourceArnString;
    /**
     * Whether or not the resource is a federated resource.
     */
    WithFederation?: NullableBoolean;
    /**
     *  Specifies whether the data access of tables pointing to the location can be managed by both Lake Formation permissions as well as Amazon S3 bucket policies. 
     */
    HybridAccessEnabled?: NullableBoolean;
  }
  export interface UpdateResourceResponse {
  }
  export interface UpdateTableObjectsRequest {
    /**
     * The catalog containing the governed table to update. Defaults to the caller’s account ID.
     */
    CatalogId?: CatalogIdString;
    /**
     * The database containing the governed table to update.
     */
    DatabaseName: NameString;
    /**
     * The governed table to update.
     */
    TableName: NameString;
    /**
     * The transaction at which to do the write.
     */
    TransactionId?: TransactionIdString;
    /**
     * A list of WriteOperation objects that define an object to add to or delete from the manifest for a governed table.
     */
    WriteOperations: WriteOperationList;
  }
  export interface UpdateTableObjectsResponse {
  }
  export interface UpdateTableStorageOptimizerRequest {
    /**
     * The Catalog ID of the table.
     */
    CatalogId?: CatalogIdString;
    /**
     * Name of the database where the table is present.
     */
    DatabaseName: NameString;
    /**
     * Name of the table for which to enable the storage optimizer.
     */
    TableName: NameString;
    /**
     * Name of the table for which to enable the storage optimizer.
     */
    StorageOptimizerConfig: StorageOptimizerConfigMap;
  }
  export interface UpdateTableStorageOptimizerResponse {
    /**
     * A response indicating the success of failure of the operation.
     */
    Result?: Result;
  }
  export type ValueString = string;
  export type ValueStringList = ValueString[];
  export type VersionString = string;
  export interface VirtualObject {
    /**
     * The path to the Amazon S3 object. Must start with s3://
     */
    Uri: URI;
    /**
     * The ETag of the Amazon S3 object.
     */
    ETag?: ETagString;
  }
  export type VirtualObjectList = VirtualObject[];
  export type WorkUnitIdLong = number;
  export interface WorkUnitRange {
    /**
     * Defines the maximum work unit ID in the range. The maximum value is inclusive.
     */
    WorkUnitIdMax: WorkUnitIdLong;
    /**
     * Defines the minimum work unit ID in the range.
     */
    WorkUnitIdMin: WorkUnitIdLong;
    /**
     * A work token used to query the execution service.
     */
    WorkUnitToken: WorkUnitTokenString;
  }
  export type WorkUnitRangeList = WorkUnitRange[];
  export type WorkUnitTokenString = string;
  export interface WriteOperation {
    /**
     * A new object to add to the governed table.
     */
    AddObject?: AddObjectInput;
    /**
     * An object to delete from the governed table.
     */
    DeleteObject?: DeleteObjectInput;
  }
  export type WriteOperationList = WriteOperation[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-03-31"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the LakeFormation client.
   */
  export import Types = LakeFormation;
}
export = LakeFormation;
