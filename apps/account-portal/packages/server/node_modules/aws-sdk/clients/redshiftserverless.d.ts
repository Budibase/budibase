import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class RedshiftServerless extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: RedshiftServerless.Types.ClientConfiguration)
  config: Config & RedshiftServerless.Types.ClientConfiguration;
  /**
   * Converts a recovery point to a snapshot. For more information about recovery points and snapshots, see Working with snapshots and recovery points.
   */
  convertRecoveryPointToSnapshot(params: RedshiftServerless.Types.ConvertRecoveryPointToSnapshotRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.ConvertRecoveryPointToSnapshotResponse) => void): Request<RedshiftServerless.Types.ConvertRecoveryPointToSnapshotResponse, AWSError>;
  /**
   * Converts a recovery point to a snapshot. For more information about recovery points and snapshots, see Working with snapshots and recovery points.
   */
  convertRecoveryPointToSnapshot(callback?: (err: AWSError, data: RedshiftServerless.Types.ConvertRecoveryPointToSnapshotResponse) => void): Request<RedshiftServerless.Types.ConvertRecoveryPointToSnapshotResponse, AWSError>;
  /**
   * Creates an Amazon Redshift Serverless managed VPC endpoint.
   */
  createEndpointAccess(params: RedshiftServerless.Types.CreateEndpointAccessRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.CreateEndpointAccessResponse) => void): Request<RedshiftServerless.Types.CreateEndpointAccessResponse, AWSError>;
  /**
   * Creates an Amazon Redshift Serverless managed VPC endpoint.
   */
  createEndpointAccess(callback?: (err: AWSError, data: RedshiftServerless.Types.CreateEndpointAccessResponse) => void): Request<RedshiftServerless.Types.CreateEndpointAccessResponse, AWSError>;
  /**
   * Creates a namespace in Amazon Redshift Serverless.
   */
  createNamespace(params: RedshiftServerless.Types.CreateNamespaceRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.CreateNamespaceResponse) => void): Request<RedshiftServerless.Types.CreateNamespaceResponse, AWSError>;
  /**
   * Creates a namespace in Amazon Redshift Serverless.
   */
  createNamespace(callback?: (err: AWSError, data: RedshiftServerless.Types.CreateNamespaceResponse) => void): Request<RedshiftServerless.Types.CreateNamespaceResponse, AWSError>;
  /**
   * Creates a snapshot of all databases in a namespace. For more information about snapshots, see  Working with snapshots and recovery points.
   */
  createSnapshot(params: RedshiftServerless.Types.CreateSnapshotRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.CreateSnapshotResponse) => void): Request<RedshiftServerless.Types.CreateSnapshotResponse, AWSError>;
  /**
   * Creates a snapshot of all databases in a namespace. For more information about snapshots, see  Working with snapshots and recovery points.
   */
  createSnapshot(callback?: (err: AWSError, data: RedshiftServerless.Types.CreateSnapshotResponse) => void): Request<RedshiftServerless.Types.CreateSnapshotResponse, AWSError>;
  /**
   * Creates a usage limit for a specified Amazon Redshift Serverless usage type. The usage limit is identified by the returned usage limit identifier. 
   */
  createUsageLimit(params: RedshiftServerless.Types.CreateUsageLimitRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.CreateUsageLimitResponse) => void): Request<RedshiftServerless.Types.CreateUsageLimitResponse, AWSError>;
  /**
   * Creates a usage limit for a specified Amazon Redshift Serverless usage type. The usage limit is identified by the returned usage limit identifier. 
   */
  createUsageLimit(callback?: (err: AWSError, data: RedshiftServerless.Types.CreateUsageLimitResponse) => void): Request<RedshiftServerless.Types.CreateUsageLimitResponse, AWSError>;
  /**
   * Creates an workgroup in Amazon Redshift Serverless.
   */
  createWorkgroup(params: RedshiftServerless.Types.CreateWorkgroupRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.CreateWorkgroupResponse) => void): Request<RedshiftServerless.Types.CreateWorkgroupResponse, AWSError>;
  /**
   * Creates an workgroup in Amazon Redshift Serverless.
   */
  createWorkgroup(callback?: (err: AWSError, data: RedshiftServerless.Types.CreateWorkgroupResponse) => void): Request<RedshiftServerless.Types.CreateWorkgroupResponse, AWSError>;
  /**
   * Deletes an Amazon Redshift Serverless managed VPC endpoint.
   */
  deleteEndpointAccess(params: RedshiftServerless.Types.DeleteEndpointAccessRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.DeleteEndpointAccessResponse) => void): Request<RedshiftServerless.Types.DeleteEndpointAccessResponse, AWSError>;
  /**
   * Deletes an Amazon Redshift Serverless managed VPC endpoint.
   */
  deleteEndpointAccess(callback?: (err: AWSError, data: RedshiftServerless.Types.DeleteEndpointAccessResponse) => void): Request<RedshiftServerless.Types.DeleteEndpointAccessResponse, AWSError>;
  /**
   * Deletes a namespace from Amazon Redshift Serverless. Before you delete the namespace, you can create a final snapshot that has all of the data within the namespace.
   */
  deleteNamespace(params: RedshiftServerless.Types.DeleteNamespaceRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.DeleteNamespaceResponse) => void): Request<RedshiftServerless.Types.DeleteNamespaceResponse, AWSError>;
  /**
   * Deletes a namespace from Amazon Redshift Serverless. Before you delete the namespace, you can create a final snapshot that has all of the data within the namespace.
   */
  deleteNamespace(callback?: (err: AWSError, data: RedshiftServerless.Types.DeleteNamespaceResponse) => void): Request<RedshiftServerless.Types.DeleteNamespaceResponse, AWSError>;
  /**
   * Deletes the specified resource policy.
   */
  deleteResourcePolicy(params: RedshiftServerless.Types.DeleteResourcePolicyRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.DeleteResourcePolicyResponse) => void): Request<RedshiftServerless.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes the specified resource policy.
   */
  deleteResourcePolicy(callback?: (err: AWSError, data: RedshiftServerless.Types.DeleteResourcePolicyResponse) => void): Request<RedshiftServerless.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes a snapshot from Amazon Redshift Serverless.
   */
  deleteSnapshot(params: RedshiftServerless.Types.DeleteSnapshotRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.DeleteSnapshotResponse) => void): Request<RedshiftServerless.Types.DeleteSnapshotResponse, AWSError>;
  /**
   * Deletes a snapshot from Amazon Redshift Serverless.
   */
  deleteSnapshot(callback?: (err: AWSError, data: RedshiftServerless.Types.DeleteSnapshotResponse) => void): Request<RedshiftServerless.Types.DeleteSnapshotResponse, AWSError>;
  /**
   * Deletes a usage limit from Amazon Redshift Serverless.
   */
  deleteUsageLimit(params: RedshiftServerless.Types.DeleteUsageLimitRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.DeleteUsageLimitResponse) => void): Request<RedshiftServerless.Types.DeleteUsageLimitResponse, AWSError>;
  /**
   * Deletes a usage limit from Amazon Redshift Serverless.
   */
  deleteUsageLimit(callback?: (err: AWSError, data: RedshiftServerless.Types.DeleteUsageLimitResponse) => void): Request<RedshiftServerless.Types.DeleteUsageLimitResponse, AWSError>;
  /**
   * Deletes a workgroup.
   */
  deleteWorkgroup(params: RedshiftServerless.Types.DeleteWorkgroupRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.DeleteWorkgroupResponse) => void): Request<RedshiftServerless.Types.DeleteWorkgroupResponse, AWSError>;
  /**
   * Deletes a workgroup.
   */
  deleteWorkgroup(callback?: (err: AWSError, data: RedshiftServerless.Types.DeleteWorkgroupResponse) => void): Request<RedshiftServerless.Types.DeleteWorkgroupResponse, AWSError>;
  /**
   * Returns a database user name and temporary password with temporary authorization to log in to Amazon Redshift Serverless. By default, the temporary credentials expire in 900 seconds. You can optionally specify a duration between 900 seconds (15 minutes) and 3600 seconds (60 minutes).  &lt;p&gt;The Identity and Access Management (IAM) user or role that runs GetCredentials must have an IAM policy attached that allows access to all necessary actions and resources.&lt;/p&gt; &lt;p&gt;If the &lt;code&gt;DbName&lt;/code&gt; parameter is specified, the IAM policy must allow access to the resource dbname for the specified database name.&lt;/p&gt; 
   */
  getCredentials(params: RedshiftServerless.Types.GetCredentialsRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.GetCredentialsResponse) => void): Request<RedshiftServerless.Types.GetCredentialsResponse, AWSError>;
  /**
   * Returns a database user name and temporary password with temporary authorization to log in to Amazon Redshift Serverless. By default, the temporary credentials expire in 900 seconds. You can optionally specify a duration between 900 seconds (15 minutes) and 3600 seconds (60 minutes).  &lt;p&gt;The Identity and Access Management (IAM) user or role that runs GetCredentials must have an IAM policy attached that allows access to all necessary actions and resources.&lt;/p&gt; &lt;p&gt;If the &lt;code&gt;DbName&lt;/code&gt; parameter is specified, the IAM policy must allow access to the resource dbname for the specified database name.&lt;/p&gt; 
   */
  getCredentials(callback?: (err: AWSError, data: RedshiftServerless.Types.GetCredentialsResponse) => void): Request<RedshiftServerless.Types.GetCredentialsResponse, AWSError>;
  /**
   * Returns information, such as the name, about a VPC endpoint.
   */
  getEndpointAccess(params: RedshiftServerless.Types.GetEndpointAccessRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.GetEndpointAccessResponse) => void): Request<RedshiftServerless.Types.GetEndpointAccessResponse, AWSError>;
  /**
   * Returns information, such as the name, about a VPC endpoint.
   */
  getEndpointAccess(callback?: (err: AWSError, data: RedshiftServerless.Types.GetEndpointAccessResponse) => void): Request<RedshiftServerless.Types.GetEndpointAccessResponse, AWSError>;
  /**
   * Returns information about a namespace in Amazon Redshift Serverless.
   */
  getNamespace(params: RedshiftServerless.Types.GetNamespaceRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.GetNamespaceResponse) => void): Request<RedshiftServerless.Types.GetNamespaceResponse, AWSError>;
  /**
   * Returns information about a namespace in Amazon Redshift Serverless.
   */
  getNamespace(callback?: (err: AWSError, data: RedshiftServerless.Types.GetNamespaceResponse) => void): Request<RedshiftServerless.Types.GetNamespaceResponse, AWSError>;
  /**
   * Returns information about a recovery point.
   */
  getRecoveryPoint(params: RedshiftServerless.Types.GetRecoveryPointRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.GetRecoveryPointResponse) => void): Request<RedshiftServerless.Types.GetRecoveryPointResponse, AWSError>;
  /**
   * Returns information about a recovery point.
   */
  getRecoveryPoint(callback?: (err: AWSError, data: RedshiftServerless.Types.GetRecoveryPointResponse) => void): Request<RedshiftServerless.Types.GetRecoveryPointResponse, AWSError>;
  /**
   * Returns a resource policy.
   */
  getResourcePolicy(params: RedshiftServerless.Types.GetResourcePolicyRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.GetResourcePolicyResponse) => void): Request<RedshiftServerless.Types.GetResourcePolicyResponse, AWSError>;
  /**
   * Returns a resource policy.
   */
  getResourcePolicy(callback?: (err: AWSError, data: RedshiftServerless.Types.GetResourcePolicyResponse) => void): Request<RedshiftServerless.Types.GetResourcePolicyResponse, AWSError>;
  /**
   * Returns information about a specific snapshot.
   */
  getSnapshot(params: RedshiftServerless.Types.GetSnapshotRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.GetSnapshotResponse) => void): Request<RedshiftServerless.Types.GetSnapshotResponse, AWSError>;
  /**
   * Returns information about a specific snapshot.
   */
  getSnapshot(callback?: (err: AWSError, data: RedshiftServerless.Types.GetSnapshotResponse) => void): Request<RedshiftServerless.Types.GetSnapshotResponse, AWSError>;
  /**
   * Returns information about a TableRestoreStatus object.
   */
  getTableRestoreStatus(params: RedshiftServerless.Types.GetTableRestoreStatusRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.GetTableRestoreStatusResponse) => void): Request<RedshiftServerless.Types.GetTableRestoreStatusResponse, AWSError>;
  /**
   * Returns information about a TableRestoreStatus object.
   */
  getTableRestoreStatus(callback?: (err: AWSError, data: RedshiftServerless.Types.GetTableRestoreStatusResponse) => void): Request<RedshiftServerless.Types.GetTableRestoreStatusResponse, AWSError>;
  /**
   * Returns information about a usage limit.
   */
  getUsageLimit(params: RedshiftServerless.Types.GetUsageLimitRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.GetUsageLimitResponse) => void): Request<RedshiftServerless.Types.GetUsageLimitResponse, AWSError>;
  /**
   * Returns information about a usage limit.
   */
  getUsageLimit(callback?: (err: AWSError, data: RedshiftServerless.Types.GetUsageLimitResponse) => void): Request<RedshiftServerless.Types.GetUsageLimitResponse, AWSError>;
  /**
   * Returns information about a specific workgroup.
   */
  getWorkgroup(params: RedshiftServerless.Types.GetWorkgroupRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.GetWorkgroupResponse) => void): Request<RedshiftServerless.Types.GetWorkgroupResponse, AWSError>;
  /**
   * Returns information about a specific workgroup.
   */
  getWorkgroup(callback?: (err: AWSError, data: RedshiftServerless.Types.GetWorkgroupResponse) => void): Request<RedshiftServerless.Types.GetWorkgroupResponse, AWSError>;
  /**
   * Returns an array of EndpointAccess objects and relevant information.
   */
  listEndpointAccess(params: RedshiftServerless.Types.ListEndpointAccessRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.ListEndpointAccessResponse) => void): Request<RedshiftServerless.Types.ListEndpointAccessResponse, AWSError>;
  /**
   * Returns an array of EndpointAccess objects and relevant information.
   */
  listEndpointAccess(callback?: (err: AWSError, data: RedshiftServerless.Types.ListEndpointAccessResponse) => void): Request<RedshiftServerless.Types.ListEndpointAccessResponse, AWSError>;
  /**
   * Returns information about a list of specified namespaces.
   */
  listNamespaces(params: RedshiftServerless.Types.ListNamespacesRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.ListNamespacesResponse) => void): Request<RedshiftServerless.Types.ListNamespacesResponse, AWSError>;
  /**
   * Returns information about a list of specified namespaces.
   */
  listNamespaces(callback?: (err: AWSError, data: RedshiftServerless.Types.ListNamespacesResponse) => void): Request<RedshiftServerless.Types.ListNamespacesResponse, AWSError>;
  /**
   * Returns an array of recovery points.
   */
  listRecoveryPoints(params: RedshiftServerless.Types.ListRecoveryPointsRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.ListRecoveryPointsResponse) => void): Request<RedshiftServerless.Types.ListRecoveryPointsResponse, AWSError>;
  /**
   * Returns an array of recovery points.
   */
  listRecoveryPoints(callback?: (err: AWSError, data: RedshiftServerless.Types.ListRecoveryPointsResponse) => void): Request<RedshiftServerless.Types.ListRecoveryPointsResponse, AWSError>;
  /**
   * Returns a list of snapshots.
   */
  listSnapshots(params: RedshiftServerless.Types.ListSnapshotsRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.ListSnapshotsResponse) => void): Request<RedshiftServerless.Types.ListSnapshotsResponse, AWSError>;
  /**
   * Returns a list of snapshots.
   */
  listSnapshots(callback?: (err: AWSError, data: RedshiftServerless.Types.ListSnapshotsResponse) => void): Request<RedshiftServerless.Types.ListSnapshotsResponse, AWSError>;
  /**
   * Returns information about an array of TableRestoreStatus objects.
   */
  listTableRestoreStatus(params: RedshiftServerless.Types.ListTableRestoreStatusRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.ListTableRestoreStatusResponse) => void): Request<RedshiftServerless.Types.ListTableRestoreStatusResponse, AWSError>;
  /**
   * Returns information about an array of TableRestoreStatus objects.
   */
  listTableRestoreStatus(callback?: (err: AWSError, data: RedshiftServerless.Types.ListTableRestoreStatusResponse) => void): Request<RedshiftServerless.Types.ListTableRestoreStatusResponse, AWSError>;
  /**
   * Lists the tags assigned to a resource.
   */
  listTagsForResource(params: RedshiftServerless.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.ListTagsForResourceResponse) => void): Request<RedshiftServerless.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags assigned to a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: RedshiftServerless.Types.ListTagsForResourceResponse) => void): Request<RedshiftServerless.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all usage limits within Amazon Redshift Serverless.
   */
  listUsageLimits(params: RedshiftServerless.Types.ListUsageLimitsRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.ListUsageLimitsResponse) => void): Request<RedshiftServerless.Types.ListUsageLimitsResponse, AWSError>;
  /**
   * Lists all usage limits within Amazon Redshift Serverless.
   */
  listUsageLimits(callback?: (err: AWSError, data: RedshiftServerless.Types.ListUsageLimitsResponse) => void): Request<RedshiftServerless.Types.ListUsageLimitsResponse, AWSError>;
  /**
   * Returns information about a list of specified workgroups.
   */
  listWorkgroups(params: RedshiftServerless.Types.ListWorkgroupsRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.ListWorkgroupsResponse) => void): Request<RedshiftServerless.Types.ListWorkgroupsResponse, AWSError>;
  /**
   * Returns information about a list of specified workgroups.
   */
  listWorkgroups(callback?: (err: AWSError, data: RedshiftServerless.Types.ListWorkgroupsResponse) => void): Request<RedshiftServerless.Types.ListWorkgroupsResponse, AWSError>;
  /**
   * Creates or updates a resource policy. Currently, you can use policies to share snapshots across Amazon Web Services accounts.
   */
  putResourcePolicy(params: RedshiftServerless.Types.PutResourcePolicyRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.PutResourcePolicyResponse) => void): Request<RedshiftServerless.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Creates or updates a resource policy. Currently, you can use policies to share snapshots across Amazon Web Services accounts.
   */
  putResourcePolicy(callback?: (err: AWSError, data: RedshiftServerless.Types.PutResourcePolicyResponse) => void): Request<RedshiftServerless.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Restore the data from a recovery point.
   */
  restoreFromRecoveryPoint(params: RedshiftServerless.Types.RestoreFromRecoveryPointRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.RestoreFromRecoveryPointResponse) => void): Request<RedshiftServerless.Types.RestoreFromRecoveryPointResponse, AWSError>;
  /**
   * Restore the data from a recovery point.
   */
  restoreFromRecoveryPoint(callback?: (err: AWSError, data: RedshiftServerless.Types.RestoreFromRecoveryPointResponse) => void): Request<RedshiftServerless.Types.RestoreFromRecoveryPointResponse, AWSError>;
  /**
   * Restores a namespace from a snapshot.
   */
  restoreFromSnapshot(params: RedshiftServerless.Types.RestoreFromSnapshotRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.RestoreFromSnapshotResponse) => void): Request<RedshiftServerless.Types.RestoreFromSnapshotResponse, AWSError>;
  /**
   * Restores a namespace from a snapshot.
   */
  restoreFromSnapshot(callback?: (err: AWSError, data: RedshiftServerless.Types.RestoreFromSnapshotResponse) => void): Request<RedshiftServerless.Types.RestoreFromSnapshotResponse, AWSError>;
  /**
   * Restores a table from a snapshot to your Amazon Redshift Serverless instance. You can't use this operation to restore tables with interleaved sort keys.
   */
  restoreTableFromSnapshot(params: RedshiftServerless.Types.RestoreTableFromSnapshotRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.RestoreTableFromSnapshotResponse) => void): Request<RedshiftServerless.Types.RestoreTableFromSnapshotResponse, AWSError>;
  /**
   * Restores a table from a snapshot to your Amazon Redshift Serverless instance. You can't use this operation to restore tables with interleaved sort keys.
   */
  restoreTableFromSnapshot(callback?: (err: AWSError, data: RedshiftServerless.Types.RestoreTableFromSnapshotResponse) => void): Request<RedshiftServerless.Types.RestoreTableFromSnapshotResponse, AWSError>;
  /**
   * Assigns one or more tags to a resource.
   */
  tagResource(params: RedshiftServerless.Types.TagResourceRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.TagResourceResponse) => void): Request<RedshiftServerless.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns one or more tags to a resource.
   */
  tagResource(callback?: (err: AWSError, data: RedshiftServerless.Types.TagResourceResponse) => void): Request<RedshiftServerless.Types.TagResourceResponse, AWSError>;
  /**
   * Removes a tag or set of tags from a resource.
   */
  untagResource(params: RedshiftServerless.Types.UntagResourceRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.UntagResourceResponse) => void): Request<RedshiftServerless.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes a tag or set of tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: RedshiftServerless.Types.UntagResourceResponse) => void): Request<RedshiftServerless.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an Amazon Redshift Serverless managed endpoint.
   */
  updateEndpointAccess(params: RedshiftServerless.Types.UpdateEndpointAccessRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.UpdateEndpointAccessResponse) => void): Request<RedshiftServerless.Types.UpdateEndpointAccessResponse, AWSError>;
  /**
   * Updates an Amazon Redshift Serverless managed endpoint.
   */
  updateEndpointAccess(callback?: (err: AWSError, data: RedshiftServerless.Types.UpdateEndpointAccessResponse) => void): Request<RedshiftServerless.Types.UpdateEndpointAccessResponse, AWSError>;
  /**
   * Updates a namespace with the specified settings. Unless required, you can't update multiple parameters in one request. For example, you must specify both adminUsername and adminUserPassword to update either field, but you can't update both kmsKeyId and logExports in a single request.
   */
  updateNamespace(params: RedshiftServerless.Types.UpdateNamespaceRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.UpdateNamespaceResponse) => void): Request<RedshiftServerless.Types.UpdateNamespaceResponse, AWSError>;
  /**
   * Updates a namespace with the specified settings. Unless required, you can't update multiple parameters in one request. For example, you must specify both adminUsername and adminUserPassword to update either field, but you can't update both kmsKeyId and logExports in a single request.
   */
  updateNamespace(callback?: (err: AWSError, data: RedshiftServerless.Types.UpdateNamespaceResponse) => void): Request<RedshiftServerless.Types.UpdateNamespaceResponse, AWSError>;
  /**
   * Updates a snapshot.
   */
  updateSnapshot(params: RedshiftServerless.Types.UpdateSnapshotRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.UpdateSnapshotResponse) => void): Request<RedshiftServerless.Types.UpdateSnapshotResponse, AWSError>;
  /**
   * Updates a snapshot.
   */
  updateSnapshot(callback?: (err: AWSError, data: RedshiftServerless.Types.UpdateSnapshotResponse) => void): Request<RedshiftServerless.Types.UpdateSnapshotResponse, AWSError>;
  /**
   * Update a usage limit in Amazon Redshift Serverless. You can't update the usage type or period of a usage limit.
   */
  updateUsageLimit(params: RedshiftServerless.Types.UpdateUsageLimitRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.UpdateUsageLimitResponse) => void): Request<RedshiftServerless.Types.UpdateUsageLimitResponse, AWSError>;
  /**
   * Update a usage limit in Amazon Redshift Serverless. You can't update the usage type or period of a usage limit.
   */
  updateUsageLimit(callback?: (err: AWSError, data: RedshiftServerless.Types.UpdateUsageLimitResponse) => void): Request<RedshiftServerless.Types.UpdateUsageLimitResponse, AWSError>;
  /**
   * Updates a workgroup with the specified configuration settings. You can't update multiple parameters in one request. For example, you can update baseCapacity or port in a single request, but you can't update both in the same request.
   */
  updateWorkgroup(params: RedshiftServerless.Types.UpdateWorkgroupRequest, callback?: (err: AWSError, data: RedshiftServerless.Types.UpdateWorkgroupResponse) => void): Request<RedshiftServerless.Types.UpdateWorkgroupResponse, AWSError>;
  /**
   * Updates a workgroup with the specified configuration settings. You can't update multiple parameters in one request. For example, you can update baseCapacity or port in a single request, but you can't update both in the same request.
   */
  updateWorkgroup(callback?: (err: AWSError, data: RedshiftServerless.Types.UpdateWorkgroupResponse) => void): Request<RedshiftServerless.Types.UpdateWorkgroupResponse, AWSError>;
}
declare namespace RedshiftServerless {
  export type AccountIdList = String[];
  export type AmazonResourceName = string;
  export type Boolean = boolean;
  export interface ConfigParameter {
    /**
     * The key of the parameter. The options are auto_mv, datestyle, enable_case_sensitivity_identifier, enable_user_activity_logging, query_group, search_path, and query monitoring metrics that let you define performance boundaries. For more information about query monitoring rules and available metrics, see Query monitoring metrics for Amazon Redshift Serverless.
     */
    parameterKey?: ParameterKey;
    /**
     * The value of the parameter to set.
     */
    parameterValue?: ParameterValue;
  }
  export type ConfigParameterList = ConfigParameter[];
  export interface ConvertRecoveryPointToSnapshotRequest {
    /**
     * The unique identifier of the recovery point.
     */
    recoveryPointId: String;
    /**
     * How long to retain the snapshot.
     */
    retentionPeriod?: Integer;
    /**
     * The name of the snapshot.
     */
    snapshotName: String;
    /**
     * An array of Tag objects to associate with the created snapshot.
     */
    tags?: TagList;
  }
  export interface ConvertRecoveryPointToSnapshotResponse {
    /**
     * The snapshot converted from the recovery point.
     */
    snapshot?: Snapshot;
  }
  export interface CreateEndpointAccessRequest {
    /**
     * The name of the VPC endpoint. An endpoint name must contain 1-30 characters. Valid characters are A-Z, a-z, 0-9, and hyphen(-). The first character must be a letter. The name can't contain two consecutive hyphens or end with a hyphen.
     */
    endpointName: String;
    /**
     * The unique identifers of subnets from which Amazon Redshift Serverless chooses one to deploy a VPC endpoint.
     */
    subnetIds: SubnetIdList;
    /**
     * The unique identifiers of the security group that defines the ports, protocols, and sources for inbound traffic that you are authorizing into your endpoint.
     */
    vpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * The name of the workgroup to associate with the VPC endpoint.
     */
    workgroupName: String;
  }
  export interface CreateEndpointAccessResponse {
    /**
     * The created VPC endpoint.
     */
    endpoint?: EndpointAccess;
  }
  export interface CreateNamespaceRequest {
    /**
     * The password of the administrator for the first database created in the namespace.
     */
    adminUserPassword?: DbPassword;
    /**
     * The username of the administrator for the first database created in the namespace.
     */
    adminUsername?: DbUser;
    /**
     * The name of the first database created in the namespace.
     */
    dbName?: String;
    /**
     * The Amazon Resource Name (ARN) of the IAM role to set as a default in the namespace.
     */
    defaultIamRoleArn?: String;
    /**
     * A list of IAM roles to associate with the namespace.
     */
    iamRoles?: IamRoleArnList;
    /**
     * The ID of the Amazon Web Services Key Management Service key used to encrypt your data.
     */
    kmsKeyId?: String;
    /**
     * The types of logs the namespace can export. Available export types are userlog, connectionlog, and useractivitylog.
     */
    logExports?: LogExportList;
    /**
     * The name of the namespace.
     */
    namespaceName: NamespaceName;
    /**
     * A list of tag instances.
     */
    tags?: TagList;
  }
  export interface CreateNamespaceResponse {
    /**
     * The created namespace object.
     */
    namespace?: Namespace;
  }
  export interface CreateSnapshotRequest {
    /**
     * The namespace to create a snapshot for.
     */
    namespaceName: String;
    /**
     * How long to retain the created snapshot.
     */
    retentionPeriod?: Integer;
    /**
     * The name of the snapshot.
     */
    snapshotName: String;
    /**
     * An array of Tag objects to associate with the snapshot.
     */
    tags?: TagList;
  }
  export interface CreateSnapshotResponse {
    /**
     * The created snapshot object.
     */
    snapshot?: Snapshot;
  }
  export interface CreateUsageLimitRequest {
    /**
     * The limit amount. If time-based, this amount is in Redshift Processing Units (RPU) consumed per hour. If data-based, this amount is in terabytes (TB) of data transferred between Regions in cross-account sharing. The value must be a positive number.
     */
    amount: Long;
    /**
     * The action that Amazon Redshift Serverless takes when the limit is reached. The default is log.
     */
    breachAction?: UsageLimitBreachAction;
    /**
     * The time period that the amount applies to. A weekly period begins on Sunday. The default is monthly.
     */
    period?: UsageLimitPeriod;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Redshift Serverless resource to create the usage limit for.
     */
    resourceArn: String;
    /**
     * The type of Amazon Redshift Serverless usage to create a usage limit for.
     */
    usageType: UsageLimitUsageType;
  }
  export interface CreateUsageLimitResponse {
    /**
     * The returned usage limit object.
     */
    usageLimit?: UsageLimit;
  }
  export interface CreateWorkgroupRequest {
    /**
     * The base data warehouse capacity of the workgroup in Redshift Processing Units (RPUs).
     */
    baseCapacity?: Integer;
    /**
     * An array of parameters to set for advanced control over a database. The options are auto_mv, datestyle, enable_case_sensitivity_identifier, enable_user_activity_logging, query_group, search_path, and query monitoring metrics that let you define performance boundaries. For more information about query monitoring rules and available metrics, see  Query monitoring metrics for Amazon Redshift Serverless.
     */
    configParameters?: ConfigParameterList;
    /**
     * The value that specifies whether to turn on enhanced virtual private cloud (VPC) routing, which forces Amazon Redshift Serverless to route traffic through your VPC instead of over the internet.
     */
    enhancedVpcRouting?: Boolean;
    /**
     * The name of the namespace to associate with the workgroup.
     */
    namespaceName: NamespaceName;
    /**
     * The custom port to use when connecting to a workgroup. Valid port ranges are 5431-5455 and 8191-8215. The default is 5439.
     */
    port?: Integer;
    /**
     * A value that specifies whether the workgroup can be accessed from a public network.
     */
    publiclyAccessible?: Boolean;
    /**
     * An array of security group IDs to associate with the workgroup.
     */
    securityGroupIds?: SecurityGroupIdList;
    /**
     * An array of VPC subnet IDs to associate with the workgroup.
     */
    subnetIds?: SubnetIdList;
    /**
     * A array of tag instances.
     */
    tags?: TagList;
    /**
     * The name of the created workgroup.
     */
    workgroupName: WorkgroupName;
  }
  export interface CreateWorkgroupResponse {
    /**
     * The created workgroup object.
     */
    workgroup?: Workgroup;
  }
  export type DbName = string;
  export type DbPassword = string;
  export type DbUser = string;
  export interface DeleteEndpointAccessRequest {
    /**
     * The name of the VPC endpoint to delete.
     */
    endpointName: String;
  }
  export interface DeleteEndpointAccessResponse {
    /**
     * The deleted VPC endpoint.
     */
    endpoint?: EndpointAccess;
  }
  export interface DeleteNamespaceRequest {
    /**
     * The name of the snapshot to be created before the namespace is deleted.
     */
    finalSnapshotName?: String;
    /**
     * How long to retain the final snapshot.
     */
    finalSnapshotRetentionPeriod?: Integer;
    /**
     * The name of the namespace to delete.
     */
    namespaceName: NamespaceName;
  }
  export interface DeleteNamespaceResponse {
    /**
     * The deleted namespace object.
     */
    namespace: Namespace;
  }
  export interface DeleteResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the policy to delete.
     */
    resourceArn: String;
  }
  export interface DeleteResourcePolicyResponse {
  }
  export interface DeleteSnapshotRequest {
    /**
     * The name of the snapshot to be deleted.
     */
    snapshotName: String;
  }
  export interface DeleteSnapshotResponse {
    /**
     * The deleted snapshot object.
     */
    snapshot?: Snapshot;
  }
  export interface DeleteUsageLimitRequest {
    /**
     * The unique identifier of the usage limit to delete.
     */
    usageLimitId: String;
  }
  export interface DeleteUsageLimitResponse {
    /**
     * The deleted usage limit object.
     */
    usageLimit?: UsageLimit;
  }
  export interface DeleteWorkgroupRequest {
    /**
     * The name of the workgroup to be deleted.
     */
    workgroupName: WorkgroupName;
  }
  export interface DeleteWorkgroupResponse {
    /**
     * The deleted workgroup object.
     */
    workgroup: Workgroup;
  }
  export type Double = number;
  export interface Endpoint {
    /**
     * The DNS address of the VPC endpoint.
     */
    address?: String;
    /**
     * The port that Amazon Redshift Serverless listens on.
     */
    port?: Integer;
    /**
     * An array of VpcEndpoint objects.
     */
    vpcEndpoints?: VpcEndpointList;
  }
  export interface EndpointAccess {
    /**
     * The DNS address of the endpoint.
     */
    address?: String;
    /**
     * The Amazon Resource Name (ARN) of the VPC endpoint.
     */
    endpointArn?: String;
    /**
     * The time that the endpoint was created.
     */
    endpointCreateTime?: SyntheticTimestamp_date_time;
    /**
     * The name of the VPC endpoint.
     */
    endpointName?: String;
    /**
     * The status of the VPC endpoint.
     */
    endpointStatus?: String;
    /**
     * The port number on which Amazon Redshift Serverless accepts incoming connections.
     */
    port?: Integer;
    /**
     * The unique identifier of subnets where Amazon Redshift Serverless choose to deploy the VPC endpoint.
     */
    subnetIds?: SubnetIdList;
    /**
     * The connection endpoint for connecting to Amazon Redshift Serverless.
     */
    vpcEndpoint?: VpcEndpoint;
    /**
     * The security groups associated with the endpoint.
     */
    vpcSecurityGroups?: VpcSecurityGroupMembershipList;
    /**
     * The name of the workgroup associated with the endpoint.
     */
    workgroupName?: String;
  }
  export type EndpointAccessList = EndpointAccess[];
  export interface GetCredentialsRequest {
    /**
     * The name of the database to get temporary authorization to log on to. Constraints:   Must be 1 to 64 alphanumeric characters or hyphens.   Must contain only uppercase or lowercase letters, numbers, underscore, plus sign, period (dot), at symbol (@), or hyphen.   The first character must be a letter.   Must not contain a colon ( : ) or slash ( / ).   Cannot be a reserved word. A list of reserved words can be found in Reserved Words  in the Amazon Redshift Database Developer Guide  
     */
    dbName?: DbName;
    /**
     * The number of seconds until the returned temporary password expires. The minimum is 900 seconds, and the maximum is 3600 seconds.
     */
    durationSeconds?: Integer;
    /**
     * The name of the workgroup associated with the database.
     */
    workgroupName: WorkgroupName;
  }
  export interface GetCredentialsResponse {
    /**
     * A temporary password that authorizes the user name returned by DbUser to log on to the database DbName.
     */
    dbPassword?: DbPassword;
    /**
     * A database user name that is authorized to log on to the database DbName using the password DbPassword. If the specified DbUser exists in the database, the new user name has the same database privileges as the the user named in DbUser. By default, the user is added to PUBLIC.
     */
    dbUser?: DbUser;
    /**
     * The date and time the password in DbPassword expires.
     */
    expiration?: Timestamp;
    /**
     * The date and time of when the DbUser and DbPassword authorization refreshes.
     */
    nextRefreshTime?: Timestamp;
  }
  export interface GetEndpointAccessRequest {
    /**
     * The name of the VPC endpoint to return information for.
     */
    endpointName: String;
  }
  export interface GetEndpointAccessResponse {
    /**
     * The returned VPC endpoint.
     */
    endpoint?: EndpointAccess;
  }
  export interface GetNamespaceRequest {
    /**
     * The name of the namespace to retrieve information for.
     */
    namespaceName: NamespaceName;
  }
  export interface GetNamespaceResponse {
    /**
     * The returned namespace object.
     */
    namespace: Namespace;
  }
  export interface GetRecoveryPointRequest {
    /**
     * The unique identifier of the recovery point to return information for.
     */
    recoveryPointId: String;
  }
  export interface GetRecoveryPointResponse {
    /**
     * The returned recovery point object.
     */
    recoveryPoint?: RecoveryPoint;
  }
  export interface GetResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to return.
     */
    resourceArn: String;
  }
  export interface GetResourcePolicyResponse {
    /**
     * The returned resource policy.
     */
    resourcePolicy?: ResourcePolicy;
  }
  export interface GetSnapshotRequest {
    /**
     * The owner Amazon Web Services account of a snapshot shared with another user.
     */
    ownerAccount?: String;
    /**
     * The Amazon Resource Name (ARN) of the snapshot to return.
     */
    snapshotArn?: String;
    /**
     * The name of the snapshot to return.
     */
    snapshotName?: String;
  }
  export interface GetSnapshotResponse {
    /**
     * The returned snapshot object.
     */
    snapshot?: Snapshot;
  }
  export interface GetTableRestoreStatusRequest {
    /**
     * The ID of the RestoreTableFromSnapshot request to return status for.
     */
    tableRestoreRequestId: String;
  }
  export interface GetTableRestoreStatusResponse {
    /**
     * The returned TableRestoreStatus object that contains information about the status of your RestoreTableFromSnapshot request.
     */
    tableRestoreStatus?: TableRestoreStatus;
  }
  export interface GetUsageLimitRequest {
    /**
     * The unique identifier of the usage limit to return information for.
     */
    usageLimitId: String;
  }
  export interface GetUsageLimitResponse {
    /**
     * The returned usage limit object.
     */
    usageLimit?: UsageLimit;
  }
  export interface GetWorkgroupRequest {
    /**
     * The name of the workgroup to return information for.
     */
    workgroupName: WorkgroupName;
  }
  export interface GetWorkgroupResponse {
    /**
     * The returned workgroup object.
     */
    workgroup: Workgroup;
  }
  export type IamRoleArn = string;
  export type IamRoleArnList = IamRoleArn[];
  export type Integer = number;
  export type KmsKeyId = string;
  export interface ListEndpointAccessRequest {
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to display the next page of results.
     */
    maxResults?: ListEndpointAccessRequestMaxResultsInteger;
    /**
     * If your initial ListEndpointAccess operation returns a nextToken, you can include the returned nextToken in following ListEndpointAccess operations, which returns results in the next page.
     */
    nextToken?: String;
    /**
     * The unique identifier of the virtual private cloud with access to Amazon Redshift Serverless.
     */
    vpcId?: String;
    /**
     * The name of the workgroup associated with the VPC endpoint to return.
     */
    workgroupName?: String;
  }
  export type ListEndpointAccessRequestMaxResultsInteger = number;
  export interface ListEndpointAccessResponse {
    /**
     * The returned VPC endpoints.
     */
    endpoints: EndpointAccessList;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    nextToken?: String;
  }
  export interface ListNamespacesRequest {
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to display the next page of results.
     */
    maxResults?: ListNamespacesRequestMaxResultsInteger;
    /**
     * If your initial ListNamespaces operation returns a nextToken, you can include the returned nextToken in following ListNamespaces operations, which returns results in the next page.
     */
    nextToken?: String;
  }
  export type ListNamespacesRequestMaxResultsInteger = number;
  export interface ListNamespacesResponse {
    /**
     * The list of returned namespaces.
     */
    namespaces: NamespaceList;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    nextToken?: String;
  }
  export interface ListRecoveryPointsRequest {
    /**
     * The time when creation of the recovery point finished.
     */
    endTime?: Timestamp;
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to display the next page of results.
     */
    maxResults?: ListRecoveryPointsRequestMaxResultsInteger;
    /**
     * The Amazon Resource Name (ARN) of the namespace from which to list recovery points.
     */
    namespaceArn?: String;
    /**
     * The name of the namespace to list recovery points for.
     */
    namespaceName?: NamespaceName;
    /**
     * If your initial ListRecoveryPoints operation returns a nextToken, you can include the returned nextToken in following ListRecoveryPoints operations, which returns results in the next page.
     */
    nextToken?: String;
    /**
     * The time when the recovery point's creation was initiated.
     */
    startTime?: Timestamp;
  }
  export type ListRecoveryPointsRequestMaxResultsInteger = number;
  export interface ListRecoveryPointsResponse {
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    nextToken?: String;
    /**
     * The returned recovery point objects.
     */
    recoveryPoints?: RecoveryPointList;
  }
  export interface ListSnapshotsRequest {
    /**
     * The timestamp showing when the snapshot creation finished.
     */
    endTime?: Timestamp;
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to display the next page of results.
     */
    maxResults?: ListSnapshotsRequestMaxResultsInteger;
    /**
     * The Amazon Resource Name (ARN) of the namespace from which to list all snapshots.
     */
    namespaceArn?: String;
    /**
     * The namespace from which to list all snapshots.
     */
    namespaceName?: String;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    nextToken?: String;
    /**
     * The owner Amazon Web Services account of the snapshot.
     */
    ownerAccount?: String;
    /**
     * The time when the creation of the snapshot was initiated.
     */
    startTime?: Timestamp;
  }
  export type ListSnapshotsRequestMaxResultsInteger = number;
  export interface ListSnapshotsResponse {
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    nextToken?: String;
    /**
     * All of the returned snapshot objects.
     */
    snapshots?: SnapshotList;
  }
  export interface ListTableRestoreStatusRequest {
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to display the next page of results.
     */
    maxResults?: ListTableRestoreStatusRequestMaxResultsInteger;
    /**
     * The namespace from which to list all of the statuses of RestoreTableFromSnapshot operations .
     */
    namespaceName?: String;
    /**
     * If your initial ListTableRestoreStatus operation returns a nextToken, you can include the returned nextToken in following ListTableRestoreStatus operations. This will return results on the next page.
     */
    nextToken?: PaginationToken;
    /**
     * The workgroup from which to list all of the statuses of RestoreTableFromSnapshot operations.
     */
    workgroupName?: String;
  }
  export type ListTableRestoreStatusRequestMaxResultsInteger = number;
  export interface ListTableRestoreStatusResponse {
    /**
     * If your initial ListTableRestoreStatus operation returns a nextToken, you can include the returned nextToken in following ListTableRestoreStatus operations. This will returns results on the next page.
     */
    nextToken?: PaginationToken;
    /**
     * The array of returned TableRestoreStatus objects.
     */
    tableRestoreStatuses?: TableRestoreStatusList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to list tags for.
     */
    resourceArn: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A map of the key-value pairs assigned to the resource.
     */
    tags?: TagList;
  }
  export interface ListUsageLimitsRequest {
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results. The default is 100.
     */
    maxResults?: ListUsageLimitsRequestMaxResultsInteger;
    /**
     * If your initial ListUsageLimits operation returns a nextToken, you can include the returned nextToken in following ListUsageLimits operations, which returns results in the next page. 
     */
    nextToken?: PaginationToken;
    /**
     * The Amazon Resource Name (ARN) associated with the resource whose usage limits you want to list.
     */
    resourceArn?: String;
    /**
     * The Amazon Redshift Serverless feature whose limits you want to see.
     */
    usageType?: UsageLimitUsageType;
  }
  export type ListUsageLimitsRequestMaxResultsInteger = number;
  export interface ListUsageLimitsResponse {
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    nextToken?: PaginationToken;
    /**
     * An array of returned usage limit objects.
     */
    usageLimits?: UsageLimits;
  }
  export interface ListWorkgroupsRequest {
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to display the next page of results.
     */
    maxResults?: ListWorkgroupsRequestMaxResultsInteger;
    /**
     * If your initial ListWorkgroups operation returns a nextToken, you can include the returned nextToken in following ListNamespaces operations, which returns results in the next page.
     */
    nextToken?: String;
  }
  export type ListWorkgroupsRequestMaxResultsInteger = number;
  export interface ListWorkgroupsResponse {
    /**
     *  If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. To retrieve the next page, make the call again using the returned token.
     */
    nextToken?: String;
    /**
     * The returned array of workgroups.
     */
    workgroups: WorkgroupList;
  }
  export type LogExport = "useractivitylog"|"userlog"|"connectionlog"|string;
  export type LogExportList = LogExport[];
  export type Long = number;
  export interface Namespace {
    /**
     * The username of the administrator for the first database created in the namespace.
     */
    adminUsername?: DbUser;
    /**
     * The date of when the namespace was created.
     */
    creationDate?: SyntheticTimestamp_date_time;
    /**
     * The name of the first database created in the namespace.
     */
    dbName?: String;
    /**
     * The Amazon Resource Name (ARN) of the IAM role to set as a default in the namespace.
     */
    defaultIamRoleArn?: String;
    /**
     * A list of IAM roles to associate with the namespace.
     */
    iamRoles?: IamRoleArnList;
    /**
     * The ID of the Amazon Web Services Key Management Service key used to encrypt your data.
     */
    kmsKeyId?: String;
    /**
     * The types of logs the namespace can export. Available export types are User log, Connection log, and User activity log.
     */
    logExports?: LogExportList;
    /**
     * The Amazon Resource Name (ARN) associated with a namespace.
     */
    namespaceArn?: String;
    /**
     * The unique identifier of a namespace.
     */
    namespaceId?: String;
    /**
     * The name of the namespace. Must be between 3-64 alphanumeric characters in lowercase, and it cannot be a reserved word. A list of reserved words can be found in Reserved Words in the Amazon Redshift Database Developer Guide.
     */
    namespaceName?: NamespaceName;
    /**
     * The status of the namespace.
     */
    status?: NamespaceStatus;
  }
  export type NamespaceList = Namespace[];
  export type NamespaceName = string;
  export type NamespaceStatus = "AVAILABLE"|"MODIFYING"|"DELETING"|string;
  export interface NetworkInterface {
    /**
     * The availability Zone.
     */
    availabilityZone?: String;
    /**
     * The unique identifier of the network interface.
     */
    networkInterfaceId?: String;
    /**
     * The IPv4 address of the network interface within the subnet.
     */
    privateIpAddress?: String;
    /**
     * The unique identifier of the subnet.
     */
    subnetId?: String;
  }
  export type NetworkInterfaceList = NetworkInterface[];
  export type PaginationToken = string;
  export type ParameterKey = string;
  export type ParameterValue = string;
  export interface PutResourcePolicyRequest {
    /**
     * The policy to create or update. For example, the following policy grants a user authorization to restore a snapshot.  "{\"Version\": \"2012-10-17\", \"Statement\" : [{ \"Sid\": \"AllowUserRestoreFromSnapshot\", \"Principal\":{\"AWS\": [\"739247239426\"]}, \"Action\": [\"redshift-serverless:RestoreFromSnapshot\"] , \"Effect\": \"Allow\" }]}" 
     */
    policy: String;
    /**
     * The Amazon Resource Name (ARN) of the account to create or update a resource policy for.
     */
    resourceArn: String;
  }
  export interface PutResourcePolicyResponse {
    /**
     * The policy that was created or updated.
     */
    resourcePolicy?: ResourcePolicy;
  }
  export interface RecoveryPoint {
    /**
     * The Amazon Resource Name (ARN) of the namespace the recovery point is associated with.
     */
    namespaceArn?: String;
    /**
     * The name of the namespace the recovery point is associated with.
     */
    namespaceName?: NamespaceName;
    /**
     * The time the recovery point is created.
     */
    recoveryPointCreateTime?: SyntheticTimestamp_date_time;
    /**
     * The unique identifier of the recovery point.
     */
    recoveryPointId?: String;
    /**
     * The total size of the data in the recovery point in megabytes.
     */
    totalSizeInMegaBytes?: Double;
    /**
     * The name of the workgroup the recovery point is associated with.
     */
    workgroupName?: WorkgroupName;
  }
  export type RecoveryPointList = RecoveryPoint[];
  export interface ResourcePolicy {
    /**
     * The resource policy.
     */
    policy?: String;
    /**
     * The Amazon Resource Name (ARN) of the policy.
     */
    resourceArn?: String;
  }
  export interface RestoreFromRecoveryPointRequest {
    /**
     * The name of the namespace to restore data into.
     */
    namespaceName: NamespaceName;
    /**
     * The unique identifier of the recovery point to restore from.
     */
    recoveryPointId: String;
    /**
     * The name of the workgroup used to restore data.
     */
    workgroupName: WorkgroupName;
  }
  export interface RestoreFromRecoveryPointResponse {
    /**
     * The namespace that data was restored into.
     */
    namespace?: Namespace;
    /**
     * The unique identifier of the recovery point used for the restore.
     */
    recoveryPointId?: String;
  }
  export interface RestoreFromSnapshotRequest {
    /**
     * The name of the namespace to restore the snapshot to.
     */
    namespaceName: NamespaceName;
    /**
     * The Amazon Web Services account that owns the snapshot.
     */
    ownerAccount?: String;
    /**
     * The Amazon Resource Name (ARN) of the snapshot to restore from. Required if restoring from Amazon Redshift Serverless to a provisioned cluster. Must not be specified at the same time as snapshotName. The format of the ARN is arn:aws:redshift:&lt;region&gt;:&lt;account_id&gt;:snapshot:&lt;cluster_identifier&gt;/&lt;snapshot_identifier&gt;.
     */
    snapshotArn?: String;
    /**
     * The name of the snapshot to restore from. Must not be specified at the same time as snapshotArn.
     */
    snapshotName?: String;
    /**
     * The name of the workgroup used to restore the snapshot.
     */
    workgroupName: WorkgroupName;
  }
  export interface RestoreFromSnapshotResponse {
    namespace?: Namespace;
    /**
     * The owner Amazon Web Services; account of the snapshot that was restored.
     */
    ownerAccount?: String;
    /**
     * The name of the snapshot used to restore the namespace.
     */
    snapshotName?: String;
  }
  export interface RestoreTableFromSnapshotRequest {
    /**
     * Indicates whether name identifiers for database, schema, and table are case sensitive. If true, the names are case sensitive. If false, the names are not case sensitive. The default is false.
     */
    activateCaseSensitiveIdentifier?: Boolean;
    /**
     * The namespace of the snapshot to restore from.
     */
    namespaceName: String;
    /**
     * The name of the table to create from the restore operation.
     */
    newTableName: String;
    /**
     * The name of the snapshot to restore the table from.
     */
    snapshotName: String;
    /**
     * The name of the source database that contains the table being restored.
     */
    sourceDatabaseName: String;
    /**
     * The name of the source schema that contains the table being restored.
     */
    sourceSchemaName?: String;
    /**
     * The name of the source table being restored.
     */
    sourceTableName: String;
    /**
     * The name of the database to restore the table to.
     */
    targetDatabaseName?: String;
    /**
     * The name of the schema to restore the table to.
     */
    targetSchemaName?: String;
    /**
     * The workgroup to restore the table to.
     */
    workgroupName: String;
  }
  export interface RestoreTableFromSnapshotResponse {
    /**
     * The TableRestoreStatus object that contains the status of the restore operation.
     */
    tableRestoreStatus?: TableRestoreStatus;
  }
  export type SecurityGroupId = string;
  export type SecurityGroupIdList = SecurityGroupId[];
  export interface Snapshot {
    /**
     * All of the Amazon Web Services accounts that have access to restore a snapshot to a provisioned cluster.
     */
    accountsWithProvisionedRestoreAccess?: AccountIdList;
    /**
     * All of the Amazon Web Services accounts that have access to restore a snapshot to a namespace.
     */
    accountsWithRestoreAccess?: AccountIdList;
    /**
     * The size of the incremental backup in megabytes.
     */
    actualIncrementalBackupSizeInMegaBytes?: Double;
    /**
     * The username of the database within a snapshot.
     */
    adminUsername?: String;
    /**
     * The size in megabytes of the data that has been backed up to a snapshot.
     */
    backupProgressInMegaBytes?: Double;
    /**
     * The rate at which data is backed up into a snapshot in megabytes per second.
     */
    currentBackupRateInMegaBytesPerSecond?: Double;
    /**
     * The amount of time it took to back up data into a snapshot.
     */
    elapsedTimeInSeconds?: Long;
    /**
     * The estimated amount of seconds until the snapshot completes backup.
     */
    estimatedSecondsToCompletion?: Long;
    /**
     * The unique identifier of the KMS key used to encrypt the snapshot.
     */
    kmsKeyId?: KmsKeyId;
    /**
     * The Amazon Resource Name (ARN) of the namespace the snapshot was created from.
     */
    namespaceArn?: String;
    /**
     * The name of the namepsace.
     */
    namespaceName?: String;
    /**
     * The owner Amazon Web Services; account of the snapshot.
     */
    ownerAccount?: String;
    /**
     * The Amazon Resource Name (ARN) of the snapshot.
     */
    snapshotArn?: String;
    /**
     * The timestamp of when the snapshot was created.
     */
    snapshotCreateTime?: SyntheticTimestamp_date_time;
    /**
     * The name of the snapshot.
     */
    snapshotName?: String;
    /**
     * The amount of days until the snapshot is deleted.
     */
    snapshotRemainingDays?: Integer;
    /**
     * The period of time, in days, of how long the snapshot is retained.
     */
    snapshotRetentionPeriod?: Integer;
    /**
     * The timestamp of when data within the snapshot started getting retained.
     */
    snapshotRetentionStartTime?: SyntheticTimestamp_date_time;
    /**
     * The status of the snapshot.
     */
    status?: SnapshotStatus;
    /**
     * The total size, in megabytes, of how big the snapshot is.
     */
    totalBackupSizeInMegaBytes?: Double;
  }
  export type SnapshotList = Snapshot[];
  export type SnapshotStatus = "AVAILABLE"|"CREATING"|"DELETED"|"CANCELLED"|"FAILED"|"COPYING"|string;
  export type String = string;
  export type SubnetId = string;
  export type SubnetIdList = SubnetId[];
  export type SyntheticTimestamp_date_time = Date;
  export interface TableRestoreStatus {
    /**
     * A description of the status of the table restore request. Status values include SUCCEEDED, FAILED, CANCELED, PENDING, IN_PROGRESS.
     */
    message?: String;
    /**
     * The namespace of the table being restored from.
     */
    namespaceName?: String;
    /**
     * The name of the table to create from the restore operation.
     */
    newTableName?: String;
    /**
     * The amount of data restored to the new table so far, in megabytes (MB).
     */
    progressInMegaBytes?: Long;
    /**
     * The time that the table restore request was made, in Universal Coordinated Time (UTC).
     */
    requestTime?: Timestamp;
    /**
     * The name of the snapshot being restored from.
     */
    snapshotName?: String;
    /**
     * The name of the source database being restored from.
     */
    sourceDatabaseName?: String;
    /**
     * The name of the source schema being restored from.
     */
    sourceSchemaName?: String;
    /**
     * The name of the source table being restored from.
     */
    sourceTableName?: String;
    /**
     * A value that describes the current state of the table restore request. Possible values include SUCCEEDED, FAILED, CANCELED, PENDING, IN_PROGRESS.
     */
    status?: String;
    /**
     * The ID of the RestoreTableFromSnapshot request.
     */
    tableRestoreRequestId?: String;
    /**
     * The name of the database to restore to.
     */
    targetDatabaseName?: String;
    /**
     * The name of the schema to restore to.
     */
    targetSchemaName?: String;
    /**
     * The total amount of data to restore to the new table, in megabytes (MB).
     */
    totalDataInMegaBytes?: Long;
    /**
     * The name of the workgroup being restored from.
     */
    workgroupName?: String;
  }
  export type TableRestoreStatusList = TableRestoreStatus[];
  export interface Tag {
    /**
     * The key to use in the tag.
     */
    key: TagKey;
    /**
     * The value of the tag.
     */
    value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to tag.
     */
    resourceArn: AmazonResourceName;
    /**
     * The map of the key-value pairs used to tag the resource.
     */
    tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to remove tags from.
     */
    resourceArn: AmazonResourceName;
    /**
     * The tag or set of tags to remove from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateEndpointAccessRequest {
    /**
     * The name of the VPC endpoint to update.
     */
    endpointName: String;
    /**
     * The list of VPC security groups associated with the endpoint after the endpoint is modified.
     */
    vpcSecurityGroupIds?: VpcSecurityGroupIdList;
  }
  export interface UpdateEndpointAccessResponse {
    /**
     * The updated VPC endpoint.
     */
    endpoint?: EndpointAccess;
  }
  export interface UpdateNamespaceRequest {
    /**
     * The password of the administrator for the first database created in the namespace. This parameter must be updated together with adminUsername.
     */
    adminUserPassword?: DbPassword;
    /**
     * The username of the administrator for the first database created in the namespace. This parameter must be updated together with adminUserPassword.
     */
    adminUsername?: DbUser;
    /**
     * The Amazon Resource Name (ARN) of the IAM role to set as a default in the namespace. This parameter must be updated together with iamRoles.
     */
    defaultIamRoleArn?: String;
    /**
     * A list of IAM roles to associate with the namespace. This parameter must be updated together with defaultIamRoleArn.
     */
    iamRoles?: IamRoleArnList;
    /**
     * The ID of the Amazon Web Services Key Management Service key used to encrypt your data.
     */
    kmsKeyId?: String;
    /**
     * The types of logs the namespace can export. The export types are userlog, connectionlog, and useractivitylog.
     */
    logExports?: LogExportList;
    /**
     * The name of the namespace to update. You can't update the name of a namespace once it is created.
     */
    namespaceName: NamespaceName;
  }
  export interface UpdateNamespaceResponse {
    /**
     * A list of tag instances.
     */
    namespace: Namespace;
  }
  export interface UpdateSnapshotRequest {
    /**
     * The new retention period of the snapshot.
     */
    retentionPeriod?: Integer;
    /**
     * The name of the snapshot.
     */
    snapshotName: String;
  }
  export interface UpdateSnapshotResponse {
    /**
     * The updated snapshot object.
     */
    snapshot?: Snapshot;
  }
  export interface UpdateUsageLimitRequest {
    /**
     * The new limit amount. If time-based, this amount is in Redshift Processing Units (RPU) consumed per hour. If data-based, this amount is in terabytes (TB) of data transferred between Regions in cross-account sharing. The value must be a positive number.
     */
    amount?: Long;
    /**
     * The new action that Amazon Redshift Serverless takes when the limit is reached.
     */
    breachAction?: UsageLimitBreachAction;
    /**
     * The identifier of the usage limit to update.
     */
    usageLimitId: String;
  }
  export interface UpdateUsageLimitResponse {
    /**
     * The updated usage limit object.
     */
    usageLimit?: UsageLimit;
  }
  export interface UpdateWorkgroupRequest {
    /**
     * The new base data warehouse capacity in Redshift Processing Units (RPUs).
     */
    baseCapacity?: Integer;
    /**
     * An array of parameters to set for advanced control over a database. The options are auto_mv, datestyle, enable_case_sensitivity_identifier, enable_user_activity_logging, query_group, search_path, and query monitoring metrics that let you define performance boundaries. For more information about query monitoring rules and available metrics, see  Query monitoring metrics for Amazon Redshift Serverless.
     */
    configParameters?: ConfigParameterList;
    /**
     * The value that specifies whether to turn on enhanced virtual private cloud (VPC) routing, which forces Amazon Redshift Serverless to route traffic through your VPC.
     */
    enhancedVpcRouting?: Boolean;
    /**
     * The custom port to use when connecting to a workgroup. Valid port ranges are 5431-5455 and 8191-8215. The default is 5439.
     */
    port?: Integer;
    /**
     * A value that specifies whether the workgroup can be accessible from a public network.
     */
    publiclyAccessible?: Boolean;
    /**
     * An array of security group IDs to associate with the workgroup.
     */
    securityGroupIds?: SecurityGroupIdList;
    /**
     * An array of VPC subnet IDs to associate with the workgroup.
     */
    subnetIds?: SubnetIdList;
    /**
     * The name of the workgroup to update. You can't update the name of a workgroup once it is created.
     */
    workgroupName: WorkgroupName;
  }
  export interface UpdateWorkgroupResponse {
    /**
     * The updated workgroup object.
     */
    workgroup: Workgroup;
  }
  export interface UsageLimit {
    /**
     * The limit amount. If time-based, this amount is in RPUs consumed per hour. If data-based, this amount is in terabytes (TB). The value must be a positive number.
     */
    amount?: Long;
    /**
     * The action that Amazon Redshift Serverless takes when the limit is reached.
     */
    breachAction?: UsageLimitBreachAction;
    /**
     * The time period that the amount applies to. A weekly period begins on Sunday. The default is monthly.
     */
    period?: UsageLimitPeriod;
    /**
     * The Amazon Resource Name (ARN) that identifies the Amazon Redshift Serverless resource.
     */
    resourceArn?: String;
    /**
     * The Amazon Resource Name (ARN) of the resource associated with the usage limit.
     */
    usageLimitArn?: String;
    /**
     * The identifier of the usage limit.
     */
    usageLimitId?: String;
    /**
     * The Amazon Redshift Serverless feature to limit.
     */
    usageType?: UsageLimitUsageType;
  }
  export type UsageLimitBreachAction = "log"|"emit-metric"|"deactivate"|string;
  export type UsageLimitPeriod = "daily"|"weekly"|"monthly"|string;
  export type UsageLimitUsageType = "serverless-compute"|"cross-region-datasharing"|string;
  export type UsageLimits = UsageLimit[];
  export interface VpcEndpoint {
    /**
     * One or more network interfaces of the endpoint. Also known as an interface endpoint.
     */
    networkInterfaces?: NetworkInterfaceList;
    /**
     * The connection endpoint ID for connecting to Amazon Redshift Serverless.
     */
    vpcEndpointId?: String;
    /**
     * The VPC identifier that the endpoint is associated with.
     */
    vpcId?: String;
  }
  export type VpcEndpointList = VpcEndpoint[];
  export type VpcSecurityGroupId = string;
  export type VpcSecurityGroupIdList = VpcSecurityGroupId[];
  export interface VpcSecurityGroupMembership {
    /**
     * The status of the VPC security group.
     */
    status?: String;
    /**
     * The unique identifier of the VPC security group.
     */
    vpcSecurityGroupId?: VpcSecurityGroupId;
  }
  export type VpcSecurityGroupMembershipList = VpcSecurityGroupMembership[];
  export interface Workgroup {
    /**
     * The base data warehouse capacity of the workgroup in Redshift Processing Units (RPUs).
     */
    baseCapacity?: Integer;
    /**
     * An array of parameters to set for advanced control over a database. The options are auto_mv, datestyle, enable_case_sensitivity_identifier, enable_user_activity_logging, query_group, , search_path, and query monitoring metrics that let you define performance boundaries. For more information about query monitoring rules and available metrics, see  Query monitoring metrics for Amazon Redshift Serverless.
     */
    configParameters?: ConfigParameterList;
    /**
     * The creation date of the workgroup.
     */
    creationDate?: SyntheticTimestamp_date_time;
    /**
     * The endpoint that is created from the workgroup.
     */
    endpoint?: Endpoint;
    /**
     * The value that specifies whether to enable enhanced virtual private cloud (VPC) routing, which forces Amazon Redshift Serverless to route traffic through your VPC.
     */
    enhancedVpcRouting?: Boolean;
    /**
     * The namespace the workgroup is associated with.
     */
    namespaceName?: String;
    /**
     * The custom port to use when connecting to a workgroup. Valid port ranges are 5431-5455 and 8191-8215. The default is 5439.
     */
    port?: Integer;
    /**
     * A value that specifies whether the workgroup can be accessible from a public network
     */
    publiclyAccessible?: Boolean;
    /**
     * An array of security group IDs to associate with the workgroup.
     */
    securityGroupIds?: SecurityGroupIdList;
    /**
     * The status of the workgroup.
     */
    status?: WorkgroupStatus;
    /**
     * An array of subnet IDs the workgroup is associated with.
     */
    subnetIds?: SubnetIdList;
    /**
     * The Amazon Resource Name (ARN) that links to the workgroup.
     */
    workgroupArn?: String;
    /**
     * The unique identifier of the workgroup.
     */
    workgroupId?: String;
    /**
     * The name of the workgroup.
     */
    workgroupName?: WorkgroupName;
  }
  export type WorkgroupList = Workgroup[];
  export type WorkgroupName = string;
  export type WorkgroupStatus = "CREATING"|"AVAILABLE"|"MODIFYING"|"DELETING"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-04-21"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the RedshiftServerless client.
   */
  export import Types = RedshiftServerless;
}
export = RedshiftServerless;
