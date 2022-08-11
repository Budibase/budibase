import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class MemoryDB extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MemoryDB.Types.ClientConfiguration)
  config: Config & MemoryDB.Types.ClientConfiguration;
  /**
   * Apply the service update to a list of clusters supplied. For more information on service updates and applying them, see Applying the service updates.
   */
  batchUpdateCluster(params: MemoryDB.Types.BatchUpdateClusterRequest, callback?: (err: AWSError, data: MemoryDB.Types.BatchUpdateClusterResponse) => void): Request<MemoryDB.Types.BatchUpdateClusterResponse, AWSError>;
  /**
   * Apply the service update to a list of clusters supplied. For more information on service updates and applying them, see Applying the service updates.
   */
  batchUpdateCluster(callback?: (err: AWSError, data: MemoryDB.Types.BatchUpdateClusterResponse) => void): Request<MemoryDB.Types.BatchUpdateClusterResponse, AWSError>;
  /**
   * Makes a copy of an existing snapshot.
   */
  copySnapshot(params: MemoryDB.Types.CopySnapshotRequest, callback?: (err: AWSError, data: MemoryDB.Types.CopySnapshotResponse) => void): Request<MemoryDB.Types.CopySnapshotResponse, AWSError>;
  /**
   * Makes a copy of an existing snapshot.
   */
  copySnapshot(callback?: (err: AWSError, data: MemoryDB.Types.CopySnapshotResponse) => void): Request<MemoryDB.Types.CopySnapshotResponse, AWSError>;
  /**
   * Creates an Access Control List. For more information, see Authenticating users with Access Contol Lists (ACLs).
   */
  createACL(params: MemoryDB.Types.CreateACLRequest, callback?: (err: AWSError, data: MemoryDB.Types.CreateACLResponse) => void): Request<MemoryDB.Types.CreateACLResponse, AWSError>;
  /**
   * Creates an Access Control List. For more information, see Authenticating users with Access Contol Lists (ACLs).
   */
  createACL(callback?: (err: AWSError, data: MemoryDB.Types.CreateACLResponse) => void): Request<MemoryDB.Types.CreateACLResponse, AWSError>;
  /**
   * Creates a cluster. All nodes in the cluster run the same protocol-compliant engine software.
   */
  createCluster(params: MemoryDB.Types.CreateClusterRequest, callback?: (err: AWSError, data: MemoryDB.Types.CreateClusterResponse) => void): Request<MemoryDB.Types.CreateClusterResponse, AWSError>;
  /**
   * Creates a cluster. All nodes in the cluster run the same protocol-compliant engine software.
   */
  createCluster(callback?: (err: AWSError, data: MemoryDB.Types.CreateClusterResponse) => void): Request<MemoryDB.Types.CreateClusterResponse, AWSError>;
  /**
   * Creates a new MemoryDB parameter group. A parameter group is a collection of parameters and their values that are applied to all of the nodes in any cluster. For more information, see Configuring engine parameters using parameter groups. 
   */
  createParameterGroup(params: MemoryDB.Types.CreateParameterGroupRequest, callback?: (err: AWSError, data: MemoryDB.Types.CreateParameterGroupResponse) => void): Request<MemoryDB.Types.CreateParameterGroupResponse, AWSError>;
  /**
   * Creates a new MemoryDB parameter group. A parameter group is a collection of parameters and their values that are applied to all of the nodes in any cluster. For more information, see Configuring engine parameters using parameter groups. 
   */
  createParameterGroup(callback?: (err: AWSError, data: MemoryDB.Types.CreateParameterGroupResponse) => void): Request<MemoryDB.Types.CreateParameterGroupResponse, AWSError>;
  /**
   * Creates a copy of an entire cluster at a specific moment in time.
   */
  createSnapshot(params: MemoryDB.Types.CreateSnapshotRequest, callback?: (err: AWSError, data: MemoryDB.Types.CreateSnapshotResponse) => void): Request<MemoryDB.Types.CreateSnapshotResponse, AWSError>;
  /**
   * Creates a copy of an entire cluster at a specific moment in time.
   */
  createSnapshot(callback?: (err: AWSError, data: MemoryDB.Types.CreateSnapshotResponse) => void): Request<MemoryDB.Types.CreateSnapshotResponse, AWSError>;
  /**
   * Creates a subnet group. A subnet group is a collection of subnets (typically private) that you can designate for your clusters running in an Amazon Virtual Private Cloud (VPC) environment. When you create a cluster in an Amazon VPC, you must specify a subnet group. MemoryDB uses that subnet group to choose a subnet and IP addresses within that subnet to associate with your nodes. For more information, see Subnets and subnet groups.
   */
  createSubnetGroup(params: MemoryDB.Types.CreateSubnetGroupRequest, callback?: (err: AWSError, data: MemoryDB.Types.CreateSubnetGroupResponse) => void): Request<MemoryDB.Types.CreateSubnetGroupResponse, AWSError>;
  /**
   * Creates a subnet group. A subnet group is a collection of subnets (typically private) that you can designate for your clusters running in an Amazon Virtual Private Cloud (VPC) environment. When you create a cluster in an Amazon VPC, you must specify a subnet group. MemoryDB uses that subnet group to choose a subnet and IP addresses within that subnet to associate with your nodes. For more information, see Subnets and subnet groups.
   */
  createSubnetGroup(callback?: (err: AWSError, data: MemoryDB.Types.CreateSubnetGroupResponse) => void): Request<MemoryDB.Types.CreateSubnetGroupResponse, AWSError>;
  /**
   * Creates a MemoryDB user. For more information, see Authenticating users with Access Contol Lists (ACLs).
   */
  createUser(params: MemoryDB.Types.CreateUserRequest, callback?: (err: AWSError, data: MemoryDB.Types.CreateUserResponse) => void): Request<MemoryDB.Types.CreateUserResponse, AWSError>;
  /**
   * Creates a MemoryDB user. For more information, see Authenticating users with Access Contol Lists (ACLs).
   */
  createUser(callback?: (err: AWSError, data: MemoryDB.Types.CreateUserResponse) => void): Request<MemoryDB.Types.CreateUserResponse, AWSError>;
  /**
   * Deletes an Access Control List. The ACL must first be disassociated from the cluster before it can be deleted. For more information, see Authenticating users with Access Contol Lists (ACLs).
   */
  deleteACL(params: MemoryDB.Types.DeleteACLRequest, callback?: (err: AWSError, data: MemoryDB.Types.DeleteACLResponse) => void): Request<MemoryDB.Types.DeleteACLResponse, AWSError>;
  /**
   * Deletes an Access Control List. The ACL must first be disassociated from the cluster before it can be deleted. For more information, see Authenticating users with Access Contol Lists (ACLs).
   */
  deleteACL(callback?: (err: AWSError, data: MemoryDB.Types.DeleteACLResponse) => void): Request<MemoryDB.Types.DeleteACLResponse, AWSError>;
  /**
   * Deletes a cluster. It also deletes all associated nodes and node endpoints
   */
  deleteCluster(params: MemoryDB.Types.DeleteClusterRequest, callback?: (err: AWSError, data: MemoryDB.Types.DeleteClusterResponse) => void): Request<MemoryDB.Types.DeleteClusterResponse, AWSError>;
  /**
   * Deletes a cluster. It also deletes all associated nodes and node endpoints
   */
  deleteCluster(callback?: (err: AWSError, data: MemoryDB.Types.DeleteClusterResponse) => void): Request<MemoryDB.Types.DeleteClusterResponse, AWSError>;
  /**
   * Deletes the specified parameter group. You cannot delete a parameter group if it is associated with any clusters. You cannot delete the default parameter groups in your account.
   */
  deleteParameterGroup(params: MemoryDB.Types.DeleteParameterGroupRequest, callback?: (err: AWSError, data: MemoryDB.Types.DeleteParameterGroupResponse) => void): Request<MemoryDB.Types.DeleteParameterGroupResponse, AWSError>;
  /**
   * Deletes the specified parameter group. You cannot delete a parameter group if it is associated with any clusters. You cannot delete the default parameter groups in your account.
   */
  deleteParameterGroup(callback?: (err: AWSError, data: MemoryDB.Types.DeleteParameterGroupResponse) => void): Request<MemoryDB.Types.DeleteParameterGroupResponse, AWSError>;
  /**
   * Deletes an existing snapshot. When you receive a successful response from this operation, MemoryDB immediately begins deleting the snapshot; you cannot cancel or revert this operation.
   */
  deleteSnapshot(params: MemoryDB.Types.DeleteSnapshotRequest, callback?: (err: AWSError, data: MemoryDB.Types.DeleteSnapshotResponse) => void): Request<MemoryDB.Types.DeleteSnapshotResponse, AWSError>;
  /**
   * Deletes an existing snapshot. When you receive a successful response from this operation, MemoryDB immediately begins deleting the snapshot; you cannot cancel or revert this operation.
   */
  deleteSnapshot(callback?: (err: AWSError, data: MemoryDB.Types.DeleteSnapshotResponse) => void): Request<MemoryDB.Types.DeleteSnapshotResponse, AWSError>;
  /**
   * Deletes a subnet group. You cannot delete a default subnet group or one that is associated with any clusters.
   */
  deleteSubnetGroup(params: MemoryDB.Types.DeleteSubnetGroupRequest, callback?: (err: AWSError, data: MemoryDB.Types.DeleteSubnetGroupResponse) => void): Request<MemoryDB.Types.DeleteSubnetGroupResponse, AWSError>;
  /**
   * Deletes a subnet group. You cannot delete a default subnet group or one that is associated with any clusters.
   */
  deleteSubnetGroup(callback?: (err: AWSError, data: MemoryDB.Types.DeleteSubnetGroupResponse) => void): Request<MemoryDB.Types.DeleteSubnetGroupResponse, AWSError>;
  /**
   * Deletes a user. The user will be removed from all ACLs and in turn removed from all clusters.
   */
  deleteUser(params: MemoryDB.Types.DeleteUserRequest, callback?: (err: AWSError, data: MemoryDB.Types.DeleteUserResponse) => void): Request<MemoryDB.Types.DeleteUserResponse, AWSError>;
  /**
   * Deletes a user. The user will be removed from all ACLs and in turn removed from all clusters.
   */
  deleteUser(callback?: (err: AWSError, data: MemoryDB.Types.DeleteUserResponse) => void): Request<MemoryDB.Types.DeleteUserResponse, AWSError>;
  /**
   * Returns a list of ACLs
   */
  describeACLs(params: MemoryDB.Types.DescribeACLsRequest, callback?: (err: AWSError, data: MemoryDB.Types.DescribeACLsResponse) => void): Request<MemoryDB.Types.DescribeACLsResponse, AWSError>;
  /**
   * Returns a list of ACLs
   */
  describeACLs(callback?: (err: AWSError, data: MemoryDB.Types.DescribeACLsResponse) => void): Request<MemoryDB.Types.DescribeACLsResponse, AWSError>;
  /**
   * Returns information about all provisioned clusters if no cluster identifier is specified, or about a specific cluster if a cluster name is supplied.
   */
  describeClusters(params: MemoryDB.Types.DescribeClustersRequest, callback?: (err: AWSError, data: MemoryDB.Types.DescribeClustersResponse) => void): Request<MemoryDB.Types.DescribeClustersResponse, AWSError>;
  /**
   * Returns information about all provisioned clusters if no cluster identifier is specified, or about a specific cluster if a cluster name is supplied.
   */
  describeClusters(callback?: (err: AWSError, data: MemoryDB.Types.DescribeClustersResponse) => void): Request<MemoryDB.Types.DescribeClustersResponse, AWSError>;
  /**
   * Returns a list of the available Redis engine versions.
   */
  describeEngineVersions(params: MemoryDB.Types.DescribeEngineVersionsRequest, callback?: (err: AWSError, data: MemoryDB.Types.DescribeEngineVersionsResponse) => void): Request<MemoryDB.Types.DescribeEngineVersionsResponse, AWSError>;
  /**
   * Returns a list of the available Redis engine versions.
   */
  describeEngineVersions(callback?: (err: AWSError, data: MemoryDB.Types.DescribeEngineVersionsResponse) => void): Request<MemoryDB.Types.DescribeEngineVersionsResponse, AWSError>;
  /**
   * Returns events related to clusters, security groups, and parameter groups. You can obtain events specific to a particular cluster, security group, or parameter group by providing the name as a parameter. By default, only the events occurring within the last hour are returned; however, you can retrieve up to 14 days' worth of events if necessary.
   */
  describeEvents(params: MemoryDB.Types.DescribeEventsRequest, callback?: (err: AWSError, data: MemoryDB.Types.DescribeEventsResponse) => void): Request<MemoryDB.Types.DescribeEventsResponse, AWSError>;
  /**
   * Returns events related to clusters, security groups, and parameter groups. You can obtain events specific to a particular cluster, security group, or parameter group by providing the name as a parameter. By default, only the events occurring within the last hour are returned; however, you can retrieve up to 14 days' worth of events if necessary.
   */
  describeEvents(callback?: (err: AWSError, data: MemoryDB.Types.DescribeEventsResponse) => void): Request<MemoryDB.Types.DescribeEventsResponse, AWSError>;
  /**
   * Returns a list of parameter group descriptions. If a parameter group name is specified, the list contains only the descriptions for that group.
   */
  describeParameterGroups(params: MemoryDB.Types.DescribeParameterGroupsRequest, callback?: (err: AWSError, data: MemoryDB.Types.DescribeParameterGroupsResponse) => void): Request<MemoryDB.Types.DescribeParameterGroupsResponse, AWSError>;
  /**
   * Returns a list of parameter group descriptions. If a parameter group name is specified, the list contains only the descriptions for that group.
   */
  describeParameterGroups(callback?: (err: AWSError, data: MemoryDB.Types.DescribeParameterGroupsResponse) => void): Request<MemoryDB.Types.DescribeParameterGroupsResponse, AWSError>;
  /**
   * Returns the detailed parameter list for a particular parameter group.
   */
  describeParameters(params: MemoryDB.Types.DescribeParametersRequest, callback?: (err: AWSError, data: MemoryDB.Types.DescribeParametersResponse) => void): Request<MemoryDB.Types.DescribeParametersResponse, AWSError>;
  /**
   * Returns the detailed parameter list for a particular parameter group.
   */
  describeParameters(callback?: (err: AWSError, data: MemoryDB.Types.DescribeParametersResponse) => void): Request<MemoryDB.Types.DescribeParametersResponse, AWSError>;
  /**
   * Returns details of the service updates
   */
  describeServiceUpdates(params: MemoryDB.Types.DescribeServiceUpdatesRequest, callback?: (err: AWSError, data: MemoryDB.Types.DescribeServiceUpdatesResponse) => void): Request<MemoryDB.Types.DescribeServiceUpdatesResponse, AWSError>;
  /**
   * Returns details of the service updates
   */
  describeServiceUpdates(callback?: (err: AWSError, data: MemoryDB.Types.DescribeServiceUpdatesResponse) => void): Request<MemoryDB.Types.DescribeServiceUpdatesResponse, AWSError>;
  /**
   * Returns information about cluster snapshots. By default, DescribeSnapshots lists all of your snapshots; it can optionally describe a single snapshot, or just the snapshots associated with a particular cluster.
   */
  describeSnapshots(params: MemoryDB.Types.DescribeSnapshotsRequest, callback?: (err: AWSError, data: MemoryDB.Types.DescribeSnapshotsResponse) => void): Request<MemoryDB.Types.DescribeSnapshotsResponse, AWSError>;
  /**
   * Returns information about cluster snapshots. By default, DescribeSnapshots lists all of your snapshots; it can optionally describe a single snapshot, or just the snapshots associated with a particular cluster.
   */
  describeSnapshots(callback?: (err: AWSError, data: MemoryDB.Types.DescribeSnapshotsResponse) => void): Request<MemoryDB.Types.DescribeSnapshotsResponse, AWSError>;
  /**
   * Returns a list of subnet group descriptions. If a subnet group name is specified, the list contains only the description of that group.
   */
  describeSubnetGroups(params: MemoryDB.Types.DescribeSubnetGroupsRequest, callback?: (err: AWSError, data: MemoryDB.Types.DescribeSubnetGroupsResponse) => void): Request<MemoryDB.Types.DescribeSubnetGroupsResponse, AWSError>;
  /**
   * Returns a list of subnet group descriptions. If a subnet group name is specified, the list contains only the description of that group.
   */
  describeSubnetGroups(callback?: (err: AWSError, data: MemoryDB.Types.DescribeSubnetGroupsResponse) => void): Request<MemoryDB.Types.DescribeSubnetGroupsResponse, AWSError>;
  /**
   * Returns a list of users.
   */
  describeUsers(params: MemoryDB.Types.DescribeUsersRequest, callback?: (err: AWSError, data: MemoryDB.Types.DescribeUsersResponse) => void): Request<MemoryDB.Types.DescribeUsersResponse, AWSError>;
  /**
   * Returns a list of users.
   */
  describeUsers(callback?: (err: AWSError, data: MemoryDB.Types.DescribeUsersResponse) => void): Request<MemoryDB.Types.DescribeUsersResponse, AWSError>;
  /**
   * Used to failover a shard
   */
  failoverShard(params: MemoryDB.Types.FailoverShardRequest, callback?: (err: AWSError, data: MemoryDB.Types.FailoverShardResponse) => void): Request<MemoryDB.Types.FailoverShardResponse, AWSError>;
  /**
   * Used to failover a shard
   */
  failoverShard(callback?: (err: AWSError, data: MemoryDB.Types.FailoverShardResponse) => void): Request<MemoryDB.Types.FailoverShardResponse, AWSError>;
  /**
   * Lists all available node types that you can scale to from your cluster's current node type. When you use the UpdateCluster operation to scale your cluster, the value of the NodeType parameter must be one of the node types returned by this operation.
   */
  listAllowedNodeTypeUpdates(params: MemoryDB.Types.ListAllowedNodeTypeUpdatesRequest, callback?: (err: AWSError, data: MemoryDB.Types.ListAllowedNodeTypeUpdatesResponse) => void): Request<MemoryDB.Types.ListAllowedNodeTypeUpdatesResponse, AWSError>;
  /**
   * Lists all available node types that you can scale to from your cluster's current node type. When you use the UpdateCluster operation to scale your cluster, the value of the NodeType parameter must be one of the node types returned by this operation.
   */
  listAllowedNodeTypeUpdates(callback?: (err: AWSError, data: MemoryDB.Types.ListAllowedNodeTypeUpdatesResponse) => void): Request<MemoryDB.Types.ListAllowedNodeTypeUpdatesResponse, AWSError>;
  /**
   * Lists all tags currently on a named resource. A tag is a key-value pair where the key and value are case-sensitive. You can use tags to categorize and track your MemoryDB resources. For more information, see Tagging your MemoryDB resources 
   */
  listTags(params: MemoryDB.Types.ListTagsRequest, callback?: (err: AWSError, data: MemoryDB.Types.ListTagsResponse) => void): Request<MemoryDB.Types.ListTagsResponse, AWSError>;
  /**
   * Lists all tags currently on a named resource. A tag is a key-value pair where the key and value are case-sensitive. You can use tags to categorize and track your MemoryDB resources. For more information, see Tagging your MemoryDB resources 
   */
  listTags(callback?: (err: AWSError, data: MemoryDB.Types.ListTagsResponse) => void): Request<MemoryDB.Types.ListTagsResponse, AWSError>;
  /**
   * Modifies the parameters of a parameter group to the engine or system default value. You can reset specific parameters by submitting a list of parameter names. To reset the entire parameter group, specify the AllParameters and ParameterGroupName parameters.
   */
  resetParameterGroup(params: MemoryDB.Types.ResetParameterGroupRequest, callback?: (err: AWSError, data: MemoryDB.Types.ResetParameterGroupResponse) => void): Request<MemoryDB.Types.ResetParameterGroupResponse, AWSError>;
  /**
   * Modifies the parameters of a parameter group to the engine or system default value. You can reset specific parameters by submitting a list of parameter names. To reset the entire parameter group, specify the AllParameters and ParameterGroupName parameters.
   */
  resetParameterGroup(callback?: (err: AWSError, data: MemoryDB.Types.ResetParameterGroupResponse) => void): Request<MemoryDB.Types.ResetParameterGroupResponse, AWSError>;
  /**
   * A tag is a key-value pair where the key and value are case-sensitive. You can use tags to categorize and track all your MemoryDB resources. When you add or remove tags on clusters, those actions will be replicated to all nodes in the cluster. For more information, see Resource-level permissions. For example, you can use cost-allocation tags to your MemoryDB resources, Amazon generates a cost allocation report as a comma-separated value (CSV) file with your usage and costs aggregated by your tags. You can apply tags that represent business categories (such as cost centers, application names, or owners) to organize your costs across multiple services. For more information, see Using Cost Allocation Tags.
   */
  tagResource(params: MemoryDB.Types.TagResourceRequest, callback?: (err: AWSError, data: MemoryDB.Types.TagResourceResponse) => void): Request<MemoryDB.Types.TagResourceResponse, AWSError>;
  /**
   * A tag is a key-value pair where the key and value are case-sensitive. You can use tags to categorize and track all your MemoryDB resources. When you add or remove tags on clusters, those actions will be replicated to all nodes in the cluster. For more information, see Resource-level permissions. For example, you can use cost-allocation tags to your MemoryDB resources, Amazon generates a cost allocation report as a comma-separated value (CSV) file with your usage and costs aggregated by your tags. You can apply tags that represent business categories (such as cost centers, application names, or owners) to organize your costs across multiple services. For more information, see Using Cost Allocation Tags.
   */
  tagResource(callback?: (err: AWSError, data: MemoryDB.Types.TagResourceResponse) => void): Request<MemoryDB.Types.TagResourceResponse, AWSError>;
  /**
   * Use this operation to remove tags on a resource
   */
  untagResource(params: MemoryDB.Types.UntagResourceRequest, callback?: (err: AWSError, data: MemoryDB.Types.UntagResourceResponse) => void): Request<MemoryDB.Types.UntagResourceResponse, AWSError>;
  /**
   * Use this operation to remove tags on a resource
   */
  untagResource(callback?: (err: AWSError, data: MemoryDB.Types.UntagResourceResponse) => void): Request<MemoryDB.Types.UntagResourceResponse, AWSError>;
  /**
   * Changes the list of users that belong to the Access Control List.
   */
  updateACL(params: MemoryDB.Types.UpdateACLRequest, callback?: (err: AWSError, data: MemoryDB.Types.UpdateACLResponse) => void): Request<MemoryDB.Types.UpdateACLResponse, AWSError>;
  /**
   * Changes the list of users that belong to the Access Control List.
   */
  updateACL(callback?: (err: AWSError, data: MemoryDB.Types.UpdateACLResponse) => void): Request<MemoryDB.Types.UpdateACLResponse, AWSError>;
  /**
   * Modifies the settings for a cluster. You can use this operation to change one or more cluster configuration settings by specifying the settings and the new values.
   */
  updateCluster(params: MemoryDB.Types.UpdateClusterRequest, callback?: (err: AWSError, data: MemoryDB.Types.UpdateClusterResponse) => void): Request<MemoryDB.Types.UpdateClusterResponse, AWSError>;
  /**
   * Modifies the settings for a cluster. You can use this operation to change one or more cluster configuration settings by specifying the settings and the new values.
   */
  updateCluster(callback?: (err: AWSError, data: MemoryDB.Types.UpdateClusterResponse) => void): Request<MemoryDB.Types.UpdateClusterResponse, AWSError>;
  /**
   * Updates the parameters of a parameter group. You can modify up to 20 parameters in a single request by submitting a list parameter name and value pairs.
   */
  updateParameterGroup(params: MemoryDB.Types.UpdateParameterGroupRequest, callback?: (err: AWSError, data: MemoryDB.Types.UpdateParameterGroupResponse) => void): Request<MemoryDB.Types.UpdateParameterGroupResponse, AWSError>;
  /**
   * Updates the parameters of a parameter group. You can modify up to 20 parameters in a single request by submitting a list parameter name and value pairs.
   */
  updateParameterGroup(callback?: (err: AWSError, data: MemoryDB.Types.UpdateParameterGroupResponse) => void): Request<MemoryDB.Types.UpdateParameterGroupResponse, AWSError>;
  /**
   * Updates a subnet group. For more information, see Updating a subnet group 
   */
  updateSubnetGroup(params: MemoryDB.Types.UpdateSubnetGroupRequest, callback?: (err: AWSError, data: MemoryDB.Types.UpdateSubnetGroupResponse) => void): Request<MemoryDB.Types.UpdateSubnetGroupResponse, AWSError>;
  /**
   * Updates a subnet group. For more information, see Updating a subnet group 
   */
  updateSubnetGroup(callback?: (err: AWSError, data: MemoryDB.Types.UpdateSubnetGroupResponse) => void): Request<MemoryDB.Types.UpdateSubnetGroupResponse, AWSError>;
  /**
   * Changes user password(s) and/or access string.
   */
  updateUser(params: MemoryDB.Types.UpdateUserRequest, callback?: (err: AWSError, data: MemoryDB.Types.UpdateUserResponse) => void): Request<MemoryDB.Types.UpdateUserResponse, AWSError>;
  /**
   * Changes user password(s) and/or access string.
   */
  updateUser(callback?: (err: AWSError, data: MemoryDB.Types.UpdateUserResponse) => void): Request<MemoryDB.Types.UpdateUserResponse, AWSError>;
}
declare namespace MemoryDB {
  export interface ACL {
    /**
     * The name of the Access Control List
     */
    Name?: String;
    /**
     * Indicates ACL status. Can be "creating", "active", "modifying", "deleting".
     */
    Status?: String;
    /**
     * The list of user names that belong to the ACL.
     */
    UserNames?: UserNameList;
    /**
     * The minimum engine version supported for the ACL
     */
    MinimumEngineVersion?: String;
    /**
     * A list of updates being applied to the ACL.
     */
    PendingChanges?: ACLPendingChanges;
    /**
     * A list of clusters associated with the ACL.
     */
    Clusters?: ACLClusterNameList;
    /**
     * The Amazon Resource Name (ARN) of the ACL
     */
    ARN?: String;
  }
  export type ACLClusterNameList = String[];
  export type ACLList = ACL[];
  export type ACLName = string;
  export type ACLNameList = ACLName[];
  export interface ACLPendingChanges {
    /**
     * A list of user names being removed from the ACL
     */
    UserNamesToRemove?: UserNameList;
    /**
     * A list of users being added to the ACL
     */
    UserNamesToAdd?: UserNameList;
  }
  export interface ACLsUpdateStatus {
    /**
     * A list of ACLs pending to be applied.
     */
    ACLToApply?: ACLName;
  }
  export type AZStatus = "singleaz"|"multiaz"|string;
  export type AccessString = string;
  export interface Authentication {
    /**
     * Indicates whether the user requires a password to authenticate.
     */
    Type?: AuthenticationType;
    /**
     * The number of passwords belonging to the user. The maximum is two.
     */
    PasswordCount?: IntegerOptional;
  }
  export interface AuthenticationMode {
    /**
     * Indicates whether the user requires a password to authenticate. All newly-created users require a password.
     */
    Type?: InputAuthenticationType;
    /**
     * The password(s) used for authentication
     */
    Passwords?: PasswordListInput;
  }
  export type AuthenticationType = "password"|"no-password"|string;
  export interface AvailabilityZone {
    /**
     * The name of the Availability Zone.
     */
    Name?: String;
  }
  export interface BatchUpdateClusterRequest {
    /**
     * The cluster names to apply the updates.
     */
    ClusterNames: ClusterNameList;
    /**
     * The unique ID of the service update
     */
    ServiceUpdate?: ServiceUpdateRequest;
  }
  export interface BatchUpdateClusterResponse {
    /**
     * The list of clusters that have been updated.
     */
    ProcessedClusters?: ClusterList;
    /**
     * The list of clusters where updates have not been applied.
     */
    UnprocessedClusters?: UnprocessedClusterList;
  }
  export type Boolean = boolean;
  export type BooleanOptional = boolean;
  export interface Cluster {
    /**
     * The user-supplied name of the cluster. This identifier is a unique key that identifies a cluster.
     */
    Name?: String;
    /**
     * A description of the cluster
     */
    Description?: String;
    /**
     * The status of the cluster. For example, Available, Updating, Creating.
     */
    Status?: String;
    /**
     * A group of settings that are currently being applied.
     */
    PendingUpdates?: ClusterPendingUpdates;
    /**
     * The number of shards in the cluster
     */
    NumberOfShards?: IntegerOptional;
    /**
     * A list of shards that are members of the cluster.
     */
    Shards?: ShardList;
    /**
     * Indicates if the cluster has a Multi-AZ configuration (multiaz) or not (singleaz).
     */
    AvailabilityMode?: AZStatus;
    /**
     * The cluster's configuration endpoint
     */
    ClusterEndpoint?: Endpoint;
    /**
     * The cluster's node type
     */
    NodeType?: String;
    /**
     * The Redis engine version used by the cluster
     */
    EngineVersion?: String;
    /**
     * The Redis engine patch version used by the cluster
     */
    EnginePatchVersion?: String;
    /**
     * The name of the parameter group used by the cluster
     */
    ParameterGroupName?: String;
    /**
     * The status of the parameter group used by the cluster, for example 'active' or 'applying'.
     */
    ParameterGroupStatus?: String;
    /**
     * A list of security groups used by the cluster
     */
    SecurityGroups?: SecurityGroupMembershipList;
    /**
     * The name of the subnet group used by the cluster
     */
    SubnetGroupName?: String;
    /**
     * A flag to indicate if In-transit encryption is enabled
     */
    TLSEnabled?: BooleanOptional;
    /**
     * The ID of the KMS key used to encrypt the cluster
     */
    KmsKeyId?: String;
    /**
     * The Amazon Resource Name (ARN) of the cluster.
     */
    ARN?: String;
    /**
     * The Amazon Resource Name (ARN) of the SNS notification topic
     */
    SnsTopicArn?: String;
    /**
     * The SNS topic must be in Active status to receive notifications
     */
    SnsTopicStatus?: String;
    /**
     * The number of days for which MemoryDB retains automatic snapshots before deleting them. For example, if you set SnapshotRetentionLimit to 5, a snapshot that was taken today is retained for 5 days before being deleted.
     */
    SnapshotRetentionLimit?: IntegerOptional;
    /**
     * Specifies the weekly time range during which maintenance on the cluster is performed. It is specified as a range in the format ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC). The minimum maintenance window is a 60 minute period. 
     */
    MaintenanceWindow?: String;
    /**
     * The daily time range (in UTC) during which MemoryDB begins taking a daily snapshot of your shard. Example: 05:00-09:00 If you do not specify this parameter, MemoryDB automatically chooses an appropriate time range.
     */
    SnapshotWindow?: String;
    /**
     * The name of the Access Control List associated with this cluster.
     */
    ACLName?: ACLName;
    /**
     * When set to true, the cluster will automatically receive minor engine version upgrades after launch.
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
  }
  export interface ClusterConfiguration {
    /**
     * The name of the cluster
     */
    Name?: String;
    /**
     * The description of the cluster configuration
     */
    Description?: String;
    /**
     * The node type used for the cluster
     */
    NodeType?: String;
    /**
     * The Redis engine version used by the cluster
     */
    EngineVersion?: String;
    /**
     * The specified maintenance window for the cluster
     */
    MaintenanceWindow?: String;
    /**
     * The Amazon Resource Name (ARN) of the SNS notification topic for the cluster
     */
    TopicArn?: String;
    /**
     * The port used by the cluster
     */
    Port?: IntegerOptional;
    /**
     * The name of parameter group used by the cluster
     */
    ParameterGroupName?: String;
    /**
     * The name of the subnet group used by the cluster
     */
    SubnetGroupName?: String;
    /**
     * The ID of the VPC the cluster belongs to
     */
    VpcId?: String;
    /**
     * The snapshot retention limit set by the cluster
     */
    SnapshotRetentionLimit?: IntegerOptional;
    /**
     * The snapshot window set by the cluster
     */
    SnapshotWindow?: String;
    /**
     * The number of shards in the cluster
     */
    NumShards?: IntegerOptional;
    /**
     * The list of shards in the cluster
     */
    Shards?: ShardDetails;
  }
  export type ClusterList = Cluster[];
  export type ClusterNameList = String[];
  export interface ClusterPendingUpdates {
    /**
     * The status of an online resharding operation.
     */
    Resharding?: ReshardingStatus;
    /**
     * A list of ACLs associated with the cluster that are being updated
     */
    ACLs?: ACLsUpdateStatus;
    /**
     * A list of service updates being applied to the cluster
     */
    ServiceUpdates?: PendingModifiedServiceUpdateList;
  }
  export interface CopySnapshotRequest {
    /**
     * The name of an existing snapshot from which to make a copy.
     */
    SourceSnapshotName: String;
    /**
     * A name for the snapshot copy. MemoryDB does not permit overwriting a snapshot, therefore this name must be unique within its context - MemoryDB or an Amazon S3 bucket if exporting.
     */
    TargetSnapshotName: String;
    /**
     * The Amazon S3 bucket to which the snapshot is exported. This parameter is used only when exporting a snapshot for external access. When using this parameter to export a snapshot, be sure MemoryDB has the needed permissions to this S3 bucket. For more information, see Step 2: Grant MemoryDB Access to Your Amazon S3 Bucket. 
     */
    TargetBucket?: TargetBucket;
    /**
     * The ID of the KMS key used to encrypt the target snapshot.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * A list of tags to be added to this resource. A tag is a key-value pair. A tag key must be accompanied by a tag value, although null is accepted.
     */
    Tags?: TagList;
  }
  export interface CopySnapshotResponse {
    /**
     * Represents a copy of an entire cluster as of the time when the snapshot was taken.
     */
    Snapshot?: Snapshot;
  }
  export interface CreateACLRequest {
    /**
     * The name of the Access Control List.
     */
    ACLName: String;
    /**
     * The list of users that belong to the Access Control List.
     */
    UserNames?: UserNameListInput;
    /**
     * A list of tags to be added to this resource. A tag is a key-value pair. A tag key must be accompanied by a tag value, although null is accepted.
     */
    Tags?: TagList;
  }
  export interface CreateACLResponse {
    /**
     * The newly-created Access Control List.
     */
    ACL?: ACL;
  }
  export interface CreateClusterRequest {
    /**
     * The name of the cluster. This value must be unique as it also serves as the cluster identifier.
     */
    ClusterName: String;
    /**
     * The compute and memory capacity of the nodes in the cluster.
     */
    NodeType: String;
    /**
     * The name of the parameter group associated with the cluster.
     */
    ParameterGroupName?: String;
    /**
     * An optional description of the cluster.
     */
    Description?: String;
    /**
     * The number of shards the cluster will contain. The default value is 1. 
     */
    NumShards?: IntegerOptional;
    /**
     * The number of replicas to apply to each shard. The default value is 1. The maximum is 5. 
     */
    NumReplicasPerShard?: IntegerOptional;
    /**
     * The name of the subnet group to be used for the cluster.
     */
    SubnetGroupName?: String;
    /**
     * A list of security group names to associate with this cluster.
     */
    SecurityGroupIds?: SecurityGroupIdsList;
    /**
     * Specifies the weekly time range during which maintenance on the cluster is performed. It is specified as a range in the format ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC). The minimum maintenance window is a 60 minute period.
     */
    MaintenanceWindow?: String;
    /**
     * The port number on which each of the nodes accepts connections.
     */
    Port?: IntegerOptional;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Simple Notification Service (SNS) topic to which notifications are sent.
     */
    SnsTopicArn?: String;
    /**
     * A flag to enable in-transit encryption on the cluster.
     */
    TLSEnabled?: BooleanOptional;
    /**
     * The ID of the KMS key used to encrypt the cluster.
     */
    KmsKeyId?: String;
    /**
     * A list of Amazon Resource Names (ARN) that uniquely identify the RDB snapshot files stored in Amazon S3. The snapshot files are used to populate the new cluster. The Amazon S3 object name in the ARN cannot contain any commas.
     */
    SnapshotArns?: SnapshotArnsList;
    /**
     * The name of a snapshot from which to restore data into the new cluster. The snapshot status changes to restoring while the new cluster is being created.
     */
    SnapshotName?: String;
    /**
     * The number of days for which MemoryDB retains automatic snapshots before deleting them. For example, if you set SnapshotRetentionLimit to 5, a snapshot that was taken today is retained for 5 days before being deleted.
     */
    SnapshotRetentionLimit?: IntegerOptional;
    /**
     * A list of tags to be added to this resource. Tags are comma-separated key,value pairs (e.g. Key=myKey, Value=myKeyValue. You can include multiple tags as shown following: Key=myKey, Value=myKeyValue Key=mySecondKey, Value=mySecondKeyValue.
     */
    Tags?: TagList;
    /**
     * The daily time range (in UTC) during which MemoryDB begins taking a daily snapshot of your shard.  Example: 05:00-09:00  If you do not specify this parameter, MemoryDB automatically chooses an appropriate time range.
     */
    SnapshotWindow?: String;
    /**
     * The name of the Access Control List to associate with the cluster.
     */
    ACLName: ACLName;
    /**
     * The version number of the Redis engine to be used for the cluster.
     */
    EngineVersion?: String;
    /**
     * When set to true, the cluster will automatically receive minor engine version upgrades after launch.
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
  }
  export interface CreateClusterResponse {
    /**
     * The newly-created cluster.
     */
    Cluster?: Cluster;
  }
  export interface CreateParameterGroupRequest {
    /**
     * The name of the parameter group.
     */
    ParameterGroupName: String;
    /**
     * The name of the parameter group family that the parameter group can be used with.
     */
    Family: String;
    /**
     * An optional description of the parameter group.
     */
    Description?: String;
    /**
     * A list of tags to be added to this resource. A tag is a key-value pair. A tag key must be accompanied by a tag value, although null is accepted.
     */
    Tags?: TagList;
  }
  export interface CreateParameterGroupResponse {
    /**
     * The newly-created parameter group.
     */
    ParameterGroup?: ParameterGroup;
  }
  export interface CreateSnapshotRequest {
    /**
     * The snapshot is created from this cluster.
     */
    ClusterName: String;
    /**
     * A name for the snapshot being created.
     */
    SnapshotName: String;
    /**
     * The ID of the KMS key used to encrypt the snapshot.
     */
    KmsKeyId?: String;
    /**
     * A list of tags to be added to this resource. A tag is a key-value pair. A tag key must be accompanied by a tag value, although null is accepted.
     */
    Tags?: TagList;
  }
  export interface CreateSnapshotResponse {
    /**
     * The newly-created snapshot.
     */
    Snapshot?: Snapshot;
  }
  export interface CreateSubnetGroupRequest {
    /**
     * The name of the subnet group.
     */
    SubnetGroupName: String;
    /**
     * A description for the subnet group.
     */
    Description?: String;
    /**
     * A list of VPC subnet IDs for the subnet group.
     */
    SubnetIds: SubnetIdentifierList;
    /**
     * A list of tags to be added to this resource. A tag is a key-value pair. A tag key must be accompanied by a tag value, although null is accepted.
     */
    Tags?: TagList;
  }
  export interface CreateSubnetGroupResponse {
    /**
     * The newly-created subnet group
     */
    SubnetGroup?: SubnetGroup;
  }
  export interface CreateUserRequest {
    /**
     * The name of the user. This value must be unique as it also serves as the user identifier.
     */
    UserName: UserName;
    /**
     * Denotes the user's authentication properties, such as whether it requires a password to authenticate.
     */
    AuthenticationMode: AuthenticationMode;
    /**
     * Access permissions string used for this user.
     */
    AccessString: AccessString;
    /**
     * A list of tags to be added to this resource. A tag is a key-value pair. A tag key must be accompanied by a tag value, although null is accepted.
     */
    Tags?: TagList;
  }
  export interface CreateUserResponse {
    /**
     * The newly-created user.
     */
    User?: User;
  }
  export interface DeleteACLRequest {
    /**
     * The name of the Access Control List to delete
     */
    ACLName: String;
  }
  export interface DeleteACLResponse {
    /**
     * The Access Control List object that has been deleted.
     */
    ACL?: ACL;
  }
  export interface DeleteClusterRequest {
    /**
     * The name of the cluster to be deleted
     */
    ClusterName: String;
    /**
     * The user-supplied name of a final cluster snapshot. This is the unique name that identifies the snapshot. MemoryDB creates the snapshot, and then deletes the cluster immediately afterward.
     */
    FinalSnapshotName?: String;
  }
  export interface DeleteClusterResponse {
    /**
     * The cluster object that has been deleted
     */
    Cluster?: Cluster;
  }
  export interface DeleteParameterGroupRequest {
    /**
     * The name of the parameter group to delete.
     */
    ParameterGroupName: String;
  }
  export interface DeleteParameterGroupResponse {
    /**
     * The parameter group that has been deleted.
     */
    ParameterGroup?: ParameterGroup;
  }
  export interface DeleteSnapshotRequest {
    /**
     * The name of the snapshot to delete
     */
    SnapshotName: String;
  }
  export interface DeleteSnapshotResponse {
    /**
     * The snapshot object that has been deleted.
     */
    Snapshot?: Snapshot;
  }
  export interface DeleteSubnetGroupRequest {
    /**
     * The name of the subnet group to delete
     */
    SubnetGroupName: String;
  }
  export interface DeleteSubnetGroupResponse {
    /**
     * The subnet group object that has been deleted.
     */
    SubnetGroup?: SubnetGroup;
  }
  export interface DeleteUserRequest {
    /**
     * The name of the user to delete
     */
    UserName: UserName;
  }
  export interface DeleteUserResponse {
    /**
     * The user object that has been deleted.
     */
    User?: User;
  }
  export interface DescribeACLsRequest {
    /**
     * The name of the ACL
     */
    ACLName?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: IntegerOptional;
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
  }
  export interface DescribeACLsResponse {
    /**
     * The list of ACLs
     */
    ACLs?: ACLList;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
  }
  export interface DescribeClustersRequest {
    /**
     * The name of the cluster
     */
    ClusterName?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: IntegerOptional;
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
    /**
     * An optional flag that can be included in the request to retrieve information about the individual shard(s).
     */
    ShowShardDetails?: BooleanOptional;
  }
  export interface DescribeClustersResponse {
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
    /**
     * A list of clusters
     */
    Clusters?: ClusterList;
  }
  export interface DescribeEngineVersionsRequest {
    /**
     * The Redis engine version
     */
    EngineVersion?: String;
    /**
     * The name of a specific parameter group family to return details for.
     */
    ParameterGroupFamily?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: IntegerOptional;
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
    /**
     * If true, specifies that only the default version of the specified engine or engine and major version combination is to be returned.
     */
    DefaultOnly?: Boolean;
  }
  export interface DescribeEngineVersionsResponse {
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
    /**
     * A list of engine version details. Each element in the list contains detailed information about one engine version.
     */
    EngineVersions?: EngineVersionInfoList;
  }
  export interface DescribeEventsRequest {
    /**
     * The identifier of the event source for which events are returned. If not specified, all sources are included in the response.
     */
    SourceName?: String;
    /**
     * The event source to retrieve events for. If no value is specified, all events are returned.
     */
    SourceType?: SourceType;
    /**
     * The beginning of the time interval to retrieve events for, specified in ISO 8601 format. Example: 2017-03-30T07:03:49.555Z
     */
    StartTime?: TStamp;
    /**
     * The end of the time interval for which to retrieve events, specified in ISO 8601 format. Example: 2017-03-30T07:03:49.555Z
     */
    EndTime?: TStamp;
    /**
     * The number of minutes worth of events to retrieve.
     */
    Duration?: IntegerOptional;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: IntegerOptional;
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
  }
  export interface DescribeEventsResponse {
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
    /**
     * A list of events. Each element in the list contains detailed information about one event.
     */
    Events?: EventList;
  }
  export interface DescribeParameterGroupsRequest {
    /**
     * The name of a specific parameter group to return details for.
     */
    ParameterGroupName?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: IntegerOptional;
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
  }
  export interface DescribeParameterGroupsResponse {
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
    /**
     * A list of parameter groups. Each element in the list contains detailed information about one parameter group.
     */
    ParameterGroups?: ParameterGroupList;
  }
  export interface DescribeParametersRequest {
    /**
     * he name of a specific parameter group to return details for.
     */
    ParameterGroupName: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: IntegerOptional;
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
  }
  export interface DescribeParametersResponse {
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
    /**
     * A list of parameters specific to a particular parameter group. Each element in the list contains detailed information about one parameter.
     */
    Parameters?: ParametersList;
  }
  export interface DescribeServiceUpdatesRequest {
    /**
     * The unique ID of the service update to describe.
     */
    ServiceUpdateName?: String;
    /**
     * The list of cluster names to identify service updates to apply
     */
    ClusterNames?: ClusterNameList;
    /**
     * The status(es) of the service updates to filter on
     */
    Status?: ServiceUpdateStatusList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: IntegerOptional;
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
  }
  export interface DescribeServiceUpdatesResponse {
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
    /**
     * A list of service updates
     */
    ServiceUpdates?: ServiceUpdateList;
  }
  export interface DescribeSnapshotsRequest {
    /**
     * A user-supplied cluster identifier. If this parameter is specified, only snapshots associated with that specific cluster are described.
     */
    ClusterName?: String;
    /**
     * A user-supplied name of the snapshot. If this parameter is specified, only this named snapshot is described.
     */
    SnapshotName?: String;
    /**
     * If set to system, the output shows snapshots that were automatically created by MemoryDB. If set to user the output shows snapshots that were manually created. If omitted, the output shows both automatically and manually created snapshots.
     */
    Source?: String;
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: IntegerOptional;
    /**
     * A Boolean value which if true, the shard configuration is included in the snapshot description.
     */
    ShowDetail?: BooleanOptional;
  }
  export interface DescribeSnapshotsResponse {
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
    /**
     * A list of snapshots. Each item in the list contains detailed information about one snapshot.
     */
    Snapshots?: SnapshotList;
  }
  export interface DescribeSubnetGroupsRequest {
    /**
     * The name of the subnet group to return details for.
     */
    SubnetGroupName?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: IntegerOptional;
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
  }
  export interface DescribeSubnetGroupsResponse {
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
    /**
     * A list of subnet groups. Each element in the list contains detailed information about one group.
     */
    SubnetGroups?: SubnetGroupList;
  }
  export interface DescribeUsersRequest {
    /**
     * The name of the user
     */
    UserName?: UserName;
    /**
     * Filter to determine the list of users to return.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: IntegerOptional;
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
  }
  export interface DescribeUsersResponse {
    /**
     * A list of users.
     */
    Users?: UserList;
    /**
     * An optional argument to pass in case the total number of records exceeds the value of MaxResults. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. 
     */
    NextToken?: String;
  }
  export type Double = number;
  export interface Endpoint {
    /**
     * The DNS hostname of the node.
     */
    Address?: String;
    /**
     * The port number that the engine is listening on.
     */
    Port?: Integer;
  }
  export interface EngineVersionInfo {
    /**
     * The engine version
     */
    EngineVersion?: String;
    /**
     * The patched engine version
     */
    EnginePatchVersion?: String;
    /**
     * Specifies the name of the parameter group family to which the engine default parameters apply.
     */
    ParameterGroupFamily?: String;
  }
  export type EngineVersionInfoList = EngineVersionInfo[];
  export interface Event {
    /**
     * The name for the source of the event. For example, if the event occurred at the cluster level, the identifier would be the name of the cluster.
     */
    SourceName?: String;
    /**
     * Specifies the origin of this event - a cluster, a parameter group, a security group, etc.
     */
    SourceType?: SourceType;
    /**
     * The text of the event.
     */
    Message?: String;
    /**
     * The date and time when the event occurred.
     */
    Date?: TStamp;
  }
  export type EventList = Event[];
  export interface FailoverShardRequest {
    /**
     * The cluster being failed over
     */
    ClusterName: String;
    /**
     * The name of the shard
     */
    ShardName: String;
  }
  export interface FailoverShardResponse {
    /**
     * The cluster being failed over
     */
    Cluster?: Cluster;
  }
  export interface Filter {
    /**
     * The property being filtered. For example, UserName.
     */
    Name: FilterName;
    /**
     * The property values to filter on. For example, "user-123".
     */
    Values: FilterValueList;
  }
  export type FilterList = Filter[];
  export type FilterName = string;
  export type FilterValue = string;
  export type FilterValueList = FilterValue[];
  export type InputAuthenticationType = "password"|string;
  export type Integer = number;
  export type IntegerOptional = number;
  export type KeyList = String[];
  export type KmsKeyId = string;
  export interface ListAllowedNodeTypeUpdatesRequest {
    /**
     * The name of the cluster you want to scale. MemoryDB uses the cluster name to identify the current node type being used by this cluster, and from that to create a list of node types you can scale up to.
     */
    ClusterName: String;
  }
  export interface ListAllowedNodeTypeUpdatesResponse {
    /**
     * A list node types which you can use to scale up your cluster.
     */
    ScaleUpNodeTypes?: NodeTypeList;
    /**
     * A list node types which you can use to scale down your cluster.
     */
    ScaleDownNodeTypes?: NodeTypeList;
  }
  export interface ListTagsRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource for which you want the list of tags
     */
    ResourceArn: String;
  }
  export interface ListTagsResponse {
    /**
     * A list of tags as key-value pairs.
     */
    TagList?: TagList;
  }
  export interface Node {
    /**
     * The node identifier. A node name is a numeric identifier (0001, 0002, etc.). The combination of cluster name, shard name and node name uniquely identifies every node used in a customer's Amazon account.
     */
    Name?: String;
    /**
     * The status of the service update on the node
     */
    Status?: String;
    /**
     * The Availability Zone in which the node resides
     */
    AvailabilityZone?: String;
    /**
     * The date and time when the node was created.
     */
    CreateTime?: TStamp;
    /**
     * The hostname for connecting to this node.
     */
    Endpoint?: Endpoint;
  }
  export type NodeList = Node[];
  export type NodeTypeList = String[];
  export interface Parameter {
    /**
     * The name of the parameter
     */
    Name?: String;
    /**
     * The value of the parameter
     */
    Value?: String;
    /**
     * A description of the parameter
     */
    Description?: String;
    /**
     * The parameter's data type
     */
    DataType?: String;
    /**
     * The valid range of values for the parameter.
     */
    AllowedValues?: String;
    /**
     * The earliest engine version to which the parameter can apply.
     */
    MinimumEngineVersion?: String;
  }
  export interface ParameterGroup {
    /**
     * The name of the parameter group
     */
    Name?: String;
    /**
     * The name of the parameter group family that this parameter group is compatible with.
     */
    Family?: String;
    /**
     * A description of the parameter group
     */
    Description?: String;
    /**
     * The Amazon Resource Name (ARN) of the parameter group
     */
    ARN?: String;
  }
  export type ParameterGroupList = ParameterGroup[];
  export type ParameterNameList = String[];
  export interface ParameterNameValue {
    /**
     * The name of the parameter
     */
    ParameterName?: String;
    /**
     * The value of the parameter
     */
    ParameterValue?: String;
  }
  export type ParameterNameValueList = ParameterNameValue[];
  export type ParametersList = Parameter[];
  export type PasswordListInput = String[];
  export interface PendingModifiedServiceUpdate {
    /**
     * The unique ID of the service update
     */
    ServiceUpdateName?: String;
    /**
     * The status of the service update
     */
    Status?: ServiceUpdateStatus;
  }
  export type PendingModifiedServiceUpdateList = PendingModifiedServiceUpdate[];
  export interface ReplicaConfigurationRequest {
    /**
     * The number of replicas to scale up or down to
     */
    ReplicaCount?: Integer;
  }
  export interface ResetParameterGroupRequest {
    /**
     * The name of the parameter group to reset.
     */
    ParameterGroupName: String;
    /**
     * If true, all parameters in the parameter group are reset to their default values. If false, only the parameters listed by ParameterNames are reset to their default values.
     */
    AllParameters?: Boolean;
    /**
     * An array of parameter names to reset to their default values. If AllParameters is true, do not use ParameterNames. If AllParameters is false, you must specify the name of at least one parameter to reset.
     */
    ParameterNames?: ParameterNameList;
  }
  export interface ResetParameterGroupResponse {
    /**
     * The parameter group being reset.
     */
    ParameterGroup?: ParameterGroup;
  }
  export interface ReshardingStatus {
    /**
     * The status of the online resharding slot migration
     */
    SlotMigration?: SlotMigration;
  }
  export type SecurityGroupIdsList = String[];
  export interface SecurityGroupMembership {
    /**
     * The identifier of the security group.
     */
    SecurityGroupId?: String;
    /**
     * The status of the security group membership. The status changes whenever a security group is modified, or when the security groups assigned to a cluster are modified.
     */
    Status?: String;
  }
  export type SecurityGroupMembershipList = SecurityGroupMembership[];
  export interface ServiceUpdate {
    /**
     * The name of the cluster to which the service update applies
     */
    ClusterName?: String;
    /**
     * The unique ID of the service update
     */
    ServiceUpdateName?: String;
    /**
     * The date when the service update is initially available
     */
    ReleaseDate?: TStamp;
    /**
     * Provides details of the service update
     */
    Description?: String;
    /**
     * The status of the service update
     */
    Status?: ServiceUpdateStatus;
    /**
     * Reflects the nature of the service update
     */
    Type?: ServiceUpdateType;
    /**
     * A list of nodes updated by the service update
     */
    NodesUpdated?: String;
    /**
     * The date at which the service update will be automatically applied
     */
    AutoUpdateStartDate?: TStamp;
  }
  export type ServiceUpdateList = ServiceUpdate[];
  export interface ServiceUpdateRequest {
    /**
     * The unique ID of the service update
     */
    ServiceUpdateNameToApply?: String;
  }
  export type ServiceUpdateStatus = "available"|"in-progress"|"complete"|"scheduled"|string;
  export type ServiceUpdateStatusList = ServiceUpdateStatus[];
  export type ServiceUpdateType = "security-update"|string;
  export interface Shard {
    /**
     * The name of the shard
     */
    Name?: String;
    /**
     * The current state of this replication group - creating, available, modifying, deleting.
     */
    Status?: String;
    /**
     * The keyspace for this shard.
     */
    Slots?: String;
    /**
     * A list containing information about individual nodes within the shard
     */
    Nodes?: NodeList;
    /**
     * The number of nodes in the shard
     */
    NumberOfNodes?: IntegerOptional;
  }
  export interface ShardConfiguration {
    /**
     * A string that specifies the keyspace for a particular node group. Keyspaces range from 0 to 16,383. The string is in the format startkey-endkey.
     */
    Slots?: String;
    /**
     * The number of read replica nodes in this shard.
     */
    ReplicaCount?: IntegerOptional;
  }
  export interface ShardConfigurationRequest {
    /**
     * The number of shards in the cluster
     */
    ShardCount?: Integer;
  }
  export interface ShardDetail {
    /**
     * The name of the shard
     */
    Name?: String;
    /**
     * The configuration details of the shard
     */
    Configuration?: ShardConfiguration;
    /**
     * The size of the shard's snapshot
     */
    Size?: String;
    /**
     * The date and time that the shard's snapshot was created
     */
    SnapshotCreationTime?: TStamp;
  }
  export type ShardDetails = ShardDetail[];
  export type ShardList = Shard[];
  export interface SlotMigration {
    /**
     * The percentage of the slot migration that is complete.
     */
    ProgressPercentage?: Double;
  }
  export interface Snapshot {
    /**
     * The name of the snapshot
     */
    Name?: String;
    /**
     * The status of the snapshot. Valid values: creating | available | restoring | copying | deleting.
     */
    Status?: String;
    /**
     * Indicates whether the snapshot is from an automatic backup (automated) or was created manually (manual).
     */
    Source?: String;
    /**
     * The ID of the KMS key used to encrypt the snapshot.
     */
    KmsKeyId?: String;
    /**
     * The ARN (Amazon Resource Name) of the snapshot.
     */
    ARN?: String;
    /**
     * The configuration of the cluster from which the snapshot was taken
     */
    ClusterConfiguration?: ClusterConfiguration;
  }
  export type SnapshotArnsList = String[];
  export type SnapshotList = Snapshot[];
  export type SourceType = "node"|"parameter-group"|"subnet-group"|"cluster"|"user"|"acl"|string;
  export type String = string;
  export interface Subnet {
    /**
     * The unique identifier for the subnet.
     */
    Identifier?: String;
    /**
     * The Availability Zone where the subnet resides
     */
    AvailabilityZone?: AvailabilityZone;
  }
  export interface SubnetGroup {
    /**
     * The name of the subnet group
     */
    Name?: String;
    /**
     * A description of the subnet group
     */
    Description?: String;
    /**
     * The Amazon Virtual Private Cloud identifier (VPC ID) of the subnet group.
     */
    VpcId?: String;
    /**
     * A list of subnets associated with the subnet group.
     */
    Subnets?: SubnetList;
    /**
     * The ARN (Amazon Resource Name) of the subnet group.
     */
    ARN?: String;
  }
  export type SubnetGroupList = SubnetGroup[];
  export type SubnetIdentifierList = String[];
  export type SubnetList = Subnet[];
  export type TStamp = Date;
  export interface Tag {
    /**
     * The key for the tag. May not be null.
     */
    Key?: String;
    /**
     * The tag's value. May be null.
     */
    Value?: String;
  }
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to which the tags are to be added
     */
    ResourceArn: String;
    /**
     * A list of tags to be added to this resource. A tag is a key-value pair. A tag key must be accompanied by a tag value, although null is accepted.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
    /**
     * A list of tags as key-value pairs.
     */
    TagList?: TagList;
  }
  export type TargetBucket = string;
  export interface UnprocessedCluster {
    /**
     * The name of the cluster
     */
    ClusterName?: String;
    /**
     * The error type associated with the update failure
     */
    ErrorType?: String;
    /**
     * The error message associated with the update failure
     */
    ErrorMessage?: String;
  }
  export type UnprocessedClusterList = UnprocessedCluster[];
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to which the tags are to be removed
     */
    ResourceArn: String;
    /**
     * The list of keys of the tags that are to be removed
     */
    TagKeys: KeyList;
  }
  export interface UntagResourceResponse {
    /**
     * The list of tags removed
     */
    TagList?: TagList;
  }
  export interface UpdateACLRequest {
    /**
     * The name of the Access Control List
     */
    ACLName: String;
    /**
     * The list of users to add to the Access Control List
     */
    UserNamesToAdd?: UserNameListInput;
    /**
     * The list of users to remove from the Access Control List
     */
    UserNamesToRemove?: UserNameListInput;
  }
  export interface UpdateACLResponse {
    /**
     * The updated Access Control List
     */
    ACL?: ACL;
  }
  export interface UpdateClusterRequest {
    /**
     * The name of the cluster to update
     */
    ClusterName: String;
    /**
     * The description of the cluster to update
     */
    Description?: String;
    /**
     * The SecurityGroupIds to update
     */
    SecurityGroupIds?: SecurityGroupIdsList;
    /**
     * The maintenance window to update
     */
    MaintenanceWindow?: String;
    /**
     * The SNS topic ARN to update
     */
    SnsTopicArn?: String;
    /**
     * The status of the Amazon SNS notification topic. Notifications are sent only if the status is active.
     */
    SnsTopicStatus?: String;
    /**
     * The name of the parameter group to update
     */
    ParameterGroupName?: String;
    /**
     * The daily time range (in UTC) during which MemoryDB begins taking a daily snapshot of your cluster.
     */
    SnapshotWindow?: String;
    /**
     * The number of days for which MemoryDB retains automatic cluster snapshots before deleting them. For example, if you set SnapshotRetentionLimit to 5, a snapshot that was taken today is retained for 5 days before being deleted.
     */
    SnapshotRetentionLimit?: IntegerOptional;
    /**
     * A valid node type that you want to scale this cluster up or down to.
     */
    NodeType?: String;
    /**
     * The upgraded version of the engine to be run on the nodes. You can upgrade to a newer engine version, but you cannot downgrade to an earlier engine version. If you want to use an earlier engine version, you must delete the existing cluster and create it anew with the earlier engine version.
     */
    EngineVersion?: String;
    /**
     * The number of replicas that will reside in each shard
     */
    ReplicaConfiguration?: ReplicaConfigurationRequest;
    /**
     * The number of shards in the cluster
     */
    ShardConfiguration?: ShardConfigurationRequest;
    /**
     * The Access Control List that is associated with the cluster
     */
    ACLName?: ACLName;
  }
  export interface UpdateClusterResponse {
    /**
     * The updated cluster
     */
    Cluster?: Cluster;
  }
  export interface UpdateParameterGroupRequest {
    /**
     * The name of the parameter group to update.
     */
    ParameterGroupName: String;
    /**
     * An array of parameter names and values for the parameter update. You must supply at least one parameter name and value; subsequent arguments are optional. A maximum of 20 parameters may be updated per request.
     */
    ParameterNameValues: ParameterNameValueList;
  }
  export interface UpdateParameterGroupResponse {
    /**
     * The updated parameter group
     */
    ParameterGroup?: ParameterGroup;
  }
  export interface UpdateSubnetGroupRequest {
    /**
     * The name of the subnet group
     */
    SubnetGroupName: String;
    /**
     * A description of the subnet group
     */
    Description?: String;
    /**
     * The EC2 subnet IDs for the subnet group.
     */
    SubnetIds?: SubnetIdentifierList;
  }
  export interface UpdateSubnetGroupResponse {
    /**
     * The updated subnet group
     */
    SubnetGroup?: SubnetGroup;
  }
  export interface UpdateUserRequest {
    /**
     * The name of the user
     */
    UserName: UserName;
    /**
     * Denotes the user's authentication properties, such as whether it requires a password to authenticate.
     */
    AuthenticationMode?: AuthenticationMode;
    /**
     * Access permissions string used for this user.
     */
    AccessString?: AccessString;
  }
  export interface UpdateUserResponse {
    /**
     * The updated user
     */
    User?: User;
  }
  export interface User {
    /**
     * The name of the user
     */
    Name?: String;
    /**
     * Indicates the user status. Can be "active", "modifying" or "deleting".
     */
    Status?: String;
    /**
     * Access permissions string used for this user.
     */
    AccessString?: String;
    /**
     * The names of the Access Control Lists to which the user belongs
     */
    ACLNames?: ACLNameList;
    /**
     * The minimum engine version supported for the user
     */
    MinimumEngineVersion?: String;
    /**
     * Denotes whether the user requires a password to authenticate.
     */
    Authentication?: Authentication;
    /**
     * The Amazon Resource Name (ARN) of the user. 
     */
    ARN?: String;
  }
  export type UserList = User[];
  export type UserName = string;
  export type UserNameList = UserName[];
  export type UserNameListInput = UserName[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-01-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MemoryDB client.
   */
  export import Types = MemoryDB;
}
export = MemoryDB;
