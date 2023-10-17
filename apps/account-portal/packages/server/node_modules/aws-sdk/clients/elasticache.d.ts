import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ElastiCache extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ElastiCache.Types.ClientConfiguration)
  config: Config & ElastiCache.Types.ClientConfiguration;
  /**
   * A tag is a key-value pair where the key and value are case-sensitive. You can use tags to categorize and track all your ElastiCache resources, with the exception of global replication group. When you add or remove tags on replication groups, those actions will be replicated to all nodes in the replication group. For more information, see Resource-level permissions.  For example, you can use cost-allocation tags to your ElastiCache resources, Amazon generates a cost allocation report as a comma-separated value (CSV) file with your usage and costs aggregated by your tags. You can apply tags that represent business categories (such as cost centers, application names, or owners) to organize your costs across multiple services. For more information, see Using Cost Allocation Tags in Amazon ElastiCache in the ElastiCache User Guide.
   */
  addTagsToResource(params: ElastiCache.Types.AddTagsToResourceMessage, callback?: (err: AWSError, data: ElastiCache.Types.TagListMessage) => void): Request<ElastiCache.Types.TagListMessage, AWSError>;
  /**
   * A tag is a key-value pair where the key and value are case-sensitive. You can use tags to categorize and track all your ElastiCache resources, with the exception of global replication group. When you add or remove tags on replication groups, those actions will be replicated to all nodes in the replication group. For more information, see Resource-level permissions.  For example, you can use cost-allocation tags to your ElastiCache resources, Amazon generates a cost allocation report as a comma-separated value (CSV) file with your usage and costs aggregated by your tags. You can apply tags that represent business categories (such as cost centers, application names, or owners) to organize your costs across multiple services. For more information, see Using Cost Allocation Tags in Amazon ElastiCache in the ElastiCache User Guide.
   */
  addTagsToResource(callback?: (err: AWSError, data: ElastiCache.Types.TagListMessage) => void): Request<ElastiCache.Types.TagListMessage, AWSError>;
  /**
   * Allows network ingress to a cache security group. Applications using ElastiCache must be running on Amazon EC2, and Amazon EC2 security groups are used as the authorization mechanism.  You cannot authorize ingress from an Amazon EC2 security group in one region to an ElastiCache cluster in another region. 
   */
  authorizeCacheSecurityGroupIngress(params: ElastiCache.Types.AuthorizeCacheSecurityGroupIngressMessage, callback?: (err: AWSError, data: ElastiCache.Types.AuthorizeCacheSecurityGroupIngressResult) => void): Request<ElastiCache.Types.AuthorizeCacheSecurityGroupIngressResult, AWSError>;
  /**
   * Allows network ingress to a cache security group. Applications using ElastiCache must be running on Amazon EC2, and Amazon EC2 security groups are used as the authorization mechanism.  You cannot authorize ingress from an Amazon EC2 security group in one region to an ElastiCache cluster in another region. 
   */
  authorizeCacheSecurityGroupIngress(callback?: (err: AWSError, data: ElastiCache.Types.AuthorizeCacheSecurityGroupIngressResult) => void): Request<ElastiCache.Types.AuthorizeCacheSecurityGroupIngressResult, AWSError>;
  /**
   * Apply the service update. For more information on service updates and applying them, see Applying Service Updates.
   */
  batchApplyUpdateAction(params: ElastiCache.Types.BatchApplyUpdateActionMessage, callback?: (err: AWSError, data: ElastiCache.Types.UpdateActionResultsMessage) => void): Request<ElastiCache.Types.UpdateActionResultsMessage, AWSError>;
  /**
   * Apply the service update. For more information on service updates and applying them, see Applying Service Updates.
   */
  batchApplyUpdateAction(callback?: (err: AWSError, data: ElastiCache.Types.UpdateActionResultsMessage) => void): Request<ElastiCache.Types.UpdateActionResultsMessage, AWSError>;
  /**
   * Stop the service update. For more information on service updates and stopping them, see Stopping Service Updates.
   */
  batchStopUpdateAction(params: ElastiCache.Types.BatchStopUpdateActionMessage, callback?: (err: AWSError, data: ElastiCache.Types.UpdateActionResultsMessage) => void): Request<ElastiCache.Types.UpdateActionResultsMessage, AWSError>;
  /**
   * Stop the service update. For more information on service updates and stopping them, see Stopping Service Updates.
   */
  batchStopUpdateAction(callback?: (err: AWSError, data: ElastiCache.Types.UpdateActionResultsMessage) => void): Request<ElastiCache.Types.UpdateActionResultsMessage, AWSError>;
  /**
   * Complete the migration of data.
   */
  completeMigration(params: ElastiCache.Types.CompleteMigrationMessage, callback?: (err: AWSError, data: ElastiCache.Types.CompleteMigrationResponse) => void): Request<ElastiCache.Types.CompleteMigrationResponse, AWSError>;
  /**
   * Complete the migration of data.
   */
  completeMigration(callback?: (err: AWSError, data: ElastiCache.Types.CompleteMigrationResponse) => void): Request<ElastiCache.Types.CompleteMigrationResponse, AWSError>;
  /**
   * Makes a copy of an existing snapshot.  This operation is valid for Redis only.   Users or groups that have permissions to use the CopySnapshot operation can create their own Amazon S3 buckets and copy snapshots to it. To control access to your snapshots, use an IAM policy to control who has the ability to use the CopySnapshot operation. For more information about using IAM to control the use of ElastiCache operations, see Exporting Snapshots and Authentication &amp; Access Control.  You could receive the following error messages.  Error Messages     Error Message: The S3 bucket %s is outside of the region.  Solution: Create an Amazon S3 bucket in the same region as your snapshot. For more information, see Step 1: Create an Amazon S3 Bucket in the ElastiCache User Guide.    Error Message: The S3 bucket %s does not exist.  Solution: Create an Amazon S3 bucket in the same region as your snapshot. For more information, see Step 1: Create an Amazon S3 Bucket in the ElastiCache User Guide.    Error Message: The S3 bucket %s is not owned by the authenticated user.  Solution: Create an Amazon S3 bucket in the same region as your snapshot. For more information, see Step 1: Create an Amazon S3 Bucket in the ElastiCache User Guide.    Error Message: The authenticated user does not have sufficient permissions to perform the desired activity.  Solution: Contact your system administrator to get the needed permissions.    Error Message: The S3 bucket %s already contains an object with key %s.  Solution: Give the TargetSnapshotName a new and unique value. If exporting a snapshot, you could alternatively create a new Amazon S3 bucket and use this same value for TargetSnapshotName.    Error Message:  ElastiCache has not been granted READ permissions %s on the S3 Bucket.  Solution: Add List and Read permissions on the bucket. For more information, see Step 2: Grant ElastiCache Access to Your Amazon S3 Bucket in the ElastiCache User Guide.    Error Message:  ElastiCache has not been granted WRITE permissions %s on the S3 Bucket.  Solution: Add Upload/Delete permissions on the bucket. For more information, see Step 2: Grant ElastiCache Access to Your Amazon S3 Bucket in the ElastiCache User Guide.    Error Message:  ElastiCache has not been granted READ_ACP permissions %s on the S3 Bucket.  Solution: Add View Permissions on the bucket. For more information, see Step 2: Grant ElastiCache Access to Your Amazon S3 Bucket in the ElastiCache User Guide.  
   */
  copySnapshot(params: ElastiCache.Types.CopySnapshotMessage, callback?: (err: AWSError, data: ElastiCache.Types.CopySnapshotResult) => void): Request<ElastiCache.Types.CopySnapshotResult, AWSError>;
  /**
   * Makes a copy of an existing snapshot.  This operation is valid for Redis only.   Users or groups that have permissions to use the CopySnapshot operation can create their own Amazon S3 buckets and copy snapshots to it. To control access to your snapshots, use an IAM policy to control who has the ability to use the CopySnapshot operation. For more information about using IAM to control the use of ElastiCache operations, see Exporting Snapshots and Authentication &amp; Access Control.  You could receive the following error messages.  Error Messages     Error Message: The S3 bucket %s is outside of the region.  Solution: Create an Amazon S3 bucket in the same region as your snapshot. For more information, see Step 1: Create an Amazon S3 Bucket in the ElastiCache User Guide.    Error Message: The S3 bucket %s does not exist.  Solution: Create an Amazon S3 bucket in the same region as your snapshot. For more information, see Step 1: Create an Amazon S3 Bucket in the ElastiCache User Guide.    Error Message: The S3 bucket %s is not owned by the authenticated user.  Solution: Create an Amazon S3 bucket in the same region as your snapshot. For more information, see Step 1: Create an Amazon S3 Bucket in the ElastiCache User Guide.    Error Message: The authenticated user does not have sufficient permissions to perform the desired activity.  Solution: Contact your system administrator to get the needed permissions.    Error Message: The S3 bucket %s already contains an object with key %s.  Solution: Give the TargetSnapshotName a new and unique value. If exporting a snapshot, you could alternatively create a new Amazon S3 bucket and use this same value for TargetSnapshotName.    Error Message:  ElastiCache has not been granted READ permissions %s on the S3 Bucket.  Solution: Add List and Read permissions on the bucket. For more information, see Step 2: Grant ElastiCache Access to Your Amazon S3 Bucket in the ElastiCache User Guide.    Error Message:  ElastiCache has not been granted WRITE permissions %s on the S3 Bucket.  Solution: Add Upload/Delete permissions on the bucket. For more information, see Step 2: Grant ElastiCache Access to Your Amazon S3 Bucket in the ElastiCache User Guide.    Error Message:  ElastiCache has not been granted READ_ACP permissions %s on the S3 Bucket.  Solution: Add View Permissions on the bucket. For more information, see Step 2: Grant ElastiCache Access to Your Amazon S3 Bucket in the ElastiCache User Guide.  
   */
  copySnapshot(callback?: (err: AWSError, data: ElastiCache.Types.CopySnapshotResult) => void): Request<ElastiCache.Types.CopySnapshotResult, AWSError>;
  /**
   * Creates a cluster. All nodes in the cluster run the same protocol-compliant cache engine software, either Memcached or Redis. This operation is not supported for Redis (cluster mode enabled) clusters.
   */
  createCacheCluster(params: ElastiCache.Types.CreateCacheClusterMessage, callback?: (err: AWSError, data: ElastiCache.Types.CreateCacheClusterResult) => void): Request<ElastiCache.Types.CreateCacheClusterResult, AWSError>;
  /**
   * Creates a cluster. All nodes in the cluster run the same protocol-compliant cache engine software, either Memcached or Redis. This operation is not supported for Redis (cluster mode enabled) clusters.
   */
  createCacheCluster(callback?: (err: AWSError, data: ElastiCache.Types.CreateCacheClusterResult) => void): Request<ElastiCache.Types.CreateCacheClusterResult, AWSError>;
  /**
   * Creates a new Amazon ElastiCache cache parameter group. An ElastiCache cache parameter group is a collection of parameters and their values that are applied to all of the nodes in any cluster or replication group using the CacheParameterGroup. A newly created CacheParameterGroup is an exact duplicate of the default parameter group for the CacheParameterGroupFamily. To customize the newly created CacheParameterGroup you can change the values of specific parameters. For more information, see:    ModifyCacheParameterGroup in the ElastiCache API Reference.    Parameters and Parameter Groups in the ElastiCache User Guide.  
   */
  createCacheParameterGroup(params: ElastiCache.Types.CreateCacheParameterGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.CreateCacheParameterGroupResult) => void): Request<ElastiCache.Types.CreateCacheParameterGroupResult, AWSError>;
  /**
   * Creates a new Amazon ElastiCache cache parameter group. An ElastiCache cache parameter group is a collection of parameters and their values that are applied to all of the nodes in any cluster or replication group using the CacheParameterGroup. A newly created CacheParameterGroup is an exact duplicate of the default parameter group for the CacheParameterGroupFamily. To customize the newly created CacheParameterGroup you can change the values of specific parameters. For more information, see:    ModifyCacheParameterGroup in the ElastiCache API Reference.    Parameters and Parameter Groups in the ElastiCache User Guide.  
   */
  createCacheParameterGroup(callback?: (err: AWSError, data: ElastiCache.Types.CreateCacheParameterGroupResult) => void): Request<ElastiCache.Types.CreateCacheParameterGroupResult, AWSError>;
  /**
   * Creates a new cache security group. Use a cache security group to control access to one or more clusters. Cache security groups are only used when you are creating a cluster outside of an Amazon Virtual Private Cloud (Amazon VPC). If you are creating a cluster inside of a VPC, use a cache subnet group instead. For more information, see CreateCacheSubnetGroup.
   */
  createCacheSecurityGroup(params: ElastiCache.Types.CreateCacheSecurityGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.CreateCacheSecurityGroupResult) => void): Request<ElastiCache.Types.CreateCacheSecurityGroupResult, AWSError>;
  /**
   * Creates a new cache security group. Use a cache security group to control access to one or more clusters. Cache security groups are only used when you are creating a cluster outside of an Amazon Virtual Private Cloud (Amazon VPC). If you are creating a cluster inside of a VPC, use a cache subnet group instead. For more information, see CreateCacheSubnetGroup.
   */
  createCacheSecurityGroup(callback?: (err: AWSError, data: ElastiCache.Types.CreateCacheSecurityGroupResult) => void): Request<ElastiCache.Types.CreateCacheSecurityGroupResult, AWSError>;
  /**
   * Creates a new cache subnet group. Use this parameter only when you are creating a cluster in an Amazon Virtual Private Cloud (Amazon VPC).
   */
  createCacheSubnetGroup(params: ElastiCache.Types.CreateCacheSubnetGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.CreateCacheSubnetGroupResult) => void): Request<ElastiCache.Types.CreateCacheSubnetGroupResult, AWSError>;
  /**
   * Creates a new cache subnet group. Use this parameter only when you are creating a cluster in an Amazon Virtual Private Cloud (Amazon VPC).
   */
  createCacheSubnetGroup(callback?: (err: AWSError, data: ElastiCache.Types.CreateCacheSubnetGroupResult) => void): Request<ElastiCache.Types.CreateCacheSubnetGroupResult, AWSError>;
  /**
   * Global Datastore for Redis offers fully managed, fast, reliable and secure cross-region replication. Using Global Datastore for Redis, you can create cross-region read replica clusters for ElastiCache for Redis to enable low-latency reads and disaster recovery across regions. For more information, see Replication Across Regions Using Global Datastore.    The GlobalReplicationGroupIdSuffix is the name of the Global datastore.   The PrimaryReplicationGroupId represents the name of the primary cluster that accepts writes and will replicate updates to the secondary cluster.  
   */
  createGlobalReplicationGroup(params: ElastiCache.Types.CreateGlobalReplicationGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.CreateGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.CreateGlobalReplicationGroupResult, AWSError>;
  /**
   * Global Datastore for Redis offers fully managed, fast, reliable and secure cross-region replication. Using Global Datastore for Redis, you can create cross-region read replica clusters for ElastiCache for Redis to enable low-latency reads and disaster recovery across regions. For more information, see Replication Across Regions Using Global Datastore.    The GlobalReplicationGroupIdSuffix is the name of the Global datastore.   The PrimaryReplicationGroupId represents the name of the primary cluster that accepts writes and will replicate updates to the secondary cluster.  
   */
  createGlobalReplicationGroup(callback?: (err: AWSError, data: ElastiCache.Types.CreateGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.CreateGlobalReplicationGroupResult, AWSError>;
  /**
   * Creates a Redis (cluster mode disabled) or a Redis (cluster mode enabled) replication group. This API can be used to create a standalone regional replication group or a secondary replication group associated with a Global datastore. A Redis (cluster mode disabled) replication group is a collection of clusters, where one of the clusters is a read/write primary and the others are read-only replicas. Writes to the primary are asynchronously propagated to the replicas. A Redis cluster-mode enabled cluster is comprised of from 1 to 90 shards (API/CLI: node groups). Each shard has a primary node and up to 5 read-only replica nodes. The configuration can range from 90 shards and 0 replicas to 15 shards and 5 replicas, which is the maximum number or replicas allowed.  The node or shard limit can be increased to a maximum of 500 per cluster if the Redis engine version is 5.0.6 or higher. For example, you can choose to configure a 500 node cluster that ranges between 83 shards (one primary and 5 replicas per shard) and 500 shards (single primary and no replicas). Make sure there are enough available IP addresses to accommodate the increase. Common pitfalls include the subnets in the subnet group have too small a CIDR range or the subnets are shared and heavily used by other clusters. For more information, see Creating a Subnet Group. For versions below 5.0.6, the limit is 250 per cluster. To request a limit increase, see Amazon Service Limits and choose the limit type Nodes per cluster per instance type.  When a Redis (cluster mode disabled) replication group has been successfully created, you can add one or more read replicas to it, up to a total of 5 read replicas. If you need to increase or decrease the number of node groups (console: shards), you can avail yourself of ElastiCache for Redis' scaling. For more information, see Scaling ElastiCache for Redis Clusters in the ElastiCache User Guide.  This operation is valid for Redis only. 
   */
  createReplicationGroup(params: ElastiCache.Types.CreateReplicationGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.CreateReplicationGroupResult) => void): Request<ElastiCache.Types.CreateReplicationGroupResult, AWSError>;
  /**
   * Creates a Redis (cluster mode disabled) or a Redis (cluster mode enabled) replication group. This API can be used to create a standalone regional replication group or a secondary replication group associated with a Global datastore. A Redis (cluster mode disabled) replication group is a collection of clusters, where one of the clusters is a read/write primary and the others are read-only replicas. Writes to the primary are asynchronously propagated to the replicas. A Redis cluster-mode enabled cluster is comprised of from 1 to 90 shards (API/CLI: node groups). Each shard has a primary node and up to 5 read-only replica nodes. The configuration can range from 90 shards and 0 replicas to 15 shards and 5 replicas, which is the maximum number or replicas allowed.  The node or shard limit can be increased to a maximum of 500 per cluster if the Redis engine version is 5.0.6 or higher. For example, you can choose to configure a 500 node cluster that ranges between 83 shards (one primary and 5 replicas per shard) and 500 shards (single primary and no replicas). Make sure there are enough available IP addresses to accommodate the increase. Common pitfalls include the subnets in the subnet group have too small a CIDR range or the subnets are shared and heavily used by other clusters. For more information, see Creating a Subnet Group. For versions below 5.0.6, the limit is 250 per cluster. To request a limit increase, see Amazon Service Limits and choose the limit type Nodes per cluster per instance type.  When a Redis (cluster mode disabled) replication group has been successfully created, you can add one or more read replicas to it, up to a total of 5 read replicas. If you need to increase or decrease the number of node groups (console: shards), you can avail yourself of ElastiCache for Redis' scaling. For more information, see Scaling ElastiCache for Redis Clusters in the ElastiCache User Guide.  This operation is valid for Redis only. 
   */
  createReplicationGroup(callback?: (err: AWSError, data: ElastiCache.Types.CreateReplicationGroupResult) => void): Request<ElastiCache.Types.CreateReplicationGroupResult, AWSError>;
  /**
   * Creates a copy of an entire cluster or replication group at a specific moment in time.  This operation is valid for Redis only. 
   */
  createSnapshot(params: ElastiCache.Types.CreateSnapshotMessage, callback?: (err: AWSError, data: ElastiCache.Types.CreateSnapshotResult) => void): Request<ElastiCache.Types.CreateSnapshotResult, AWSError>;
  /**
   * Creates a copy of an entire cluster or replication group at a specific moment in time.  This operation is valid for Redis only. 
   */
  createSnapshot(callback?: (err: AWSError, data: ElastiCache.Types.CreateSnapshotResult) => void): Request<ElastiCache.Types.CreateSnapshotResult, AWSError>;
  /**
   * For Redis engine version 6.0 onwards: Creates a Redis user. For more information, see Using Role Based Access Control (RBAC).
   */
  createUser(params: ElastiCache.Types.CreateUserMessage, callback?: (err: AWSError, data: ElastiCache.Types.User) => void): Request<ElastiCache.Types.User, AWSError>;
  /**
   * For Redis engine version 6.0 onwards: Creates a Redis user. For more information, see Using Role Based Access Control (RBAC).
   */
  createUser(callback?: (err: AWSError, data: ElastiCache.Types.User) => void): Request<ElastiCache.Types.User, AWSError>;
  /**
   * For Redis engine version 6.0 onwards: Creates a Redis user group. For more information, see Using Role Based Access Control (RBAC) 
   */
  createUserGroup(params: ElastiCache.Types.CreateUserGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.UserGroup) => void): Request<ElastiCache.Types.UserGroup, AWSError>;
  /**
   * For Redis engine version 6.0 onwards: Creates a Redis user group. For more information, see Using Role Based Access Control (RBAC) 
   */
  createUserGroup(callback?: (err: AWSError, data: ElastiCache.Types.UserGroup) => void): Request<ElastiCache.Types.UserGroup, AWSError>;
  /**
   * Decreases the number of node groups in a Global datastore
   */
  decreaseNodeGroupsInGlobalReplicationGroup(params: ElastiCache.Types.DecreaseNodeGroupsInGlobalReplicationGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.DecreaseNodeGroupsInGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.DecreaseNodeGroupsInGlobalReplicationGroupResult, AWSError>;
  /**
   * Decreases the number of node groups in a Global datastore
   */
  decreaseNodeGroupsInGlobalReplicationGroup(callback?: (err: AWSError, data: ElastiCache.Types.DecreaseNodeGroupsInGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.DecreaseNodeGroupsInGlobalReplicationGroupResult, AWSError>;
  /**
   * Dynamically decreases the number of replicas in a Redis (cluster mode disabled) replication group or the number of replica nodes in one or more node groups (shards) of a Redis (cluster mode enabled) replication group. This operation is performed with no cluster down time.
   */
  decreaseReplicaCount(params: ElastiCache.Types.DecreaseReplicaCountMessage, callback?: (err: AWSError, data: ElastiCache.Types.DecreaseReplicaCountResult) => void): Request<ElastiCache.Types.DecreaseReplicaCountResult, AWSError>;
  /**
   * Dynamically decreases the number of replicas in a Redis (cluster mode disabled) replication group or the number of replica nodes in one or more node groups (shards) of a Redis (cluster mode enabled) replication group. This operation is performed with no cluster down time.
   */
  decreaseReplicaCount(callback?: (err: AWSError, data: ElastiCache.Types.DecreaseReplicaCountResult) => void): Request<ElastiCache.Types.DecreaseReplicaCountResult, AWSError>;
  /**
   * Deletes a previously provisioned cluster. DeleteCacheCluster deletes all associated cache nodes, node endpoints and the cluster itself. When you receive a successful response from this operation, Amazon ElastiCache immediately begins deleting the cluster; you cannot cancel or revert this operation. This operation is not valid for:   Redis (cluster mode enabled) clusters   Redis (cluster mode disabled) clusters   A cluster that is the last read replica of a replication group   A cluster that is the primary node of a replication group   A node group (shard) that has Multi-AZ mode enabled   A cluster from a Redis (cluster mode enabled) replication group   A cluster that is not in the available state  
   */
  deleteCacheCluster(params: ElastiCache.Types.DeleteCacheClusterMessage, callback?: (err: AWSError, data: ElastiCache.Types.DeleteCacheClusterResult) => void): Request<ElastiCache.Types.DeleteCacheClusterResult, AWSError>;
  /**
   * Deletes a previously provisioned cluster. DeleteCacheCluster deletes all associated cache nodes, node endpoints and the cluster itself. When you receive a successful response from this operation, Amazon ElastiCache immediately begins deleting the cluster; you cannot cancel or revert this operation. This operation is not valid for:   Redis (cluster mode enabled) clusters   Redis (cluster mode disabled) clusters   A cluster that is the last read replica of a replication group   A cluster that is the primary node of a replication group   A node group (shard) that has Multi-AZ mode enabled   A cluster from a Redis (cluster mode enabled) replication group   A cluster that is not in the available state  
   */
  deleteCacheCluster(callback?: (err: AWSError, data: ElastiCache.Types.DeleteCacheClusterResult) => void): Request<ElastiCache.Types.DeleteCacheClusterResult, AWSError>;
  /**
   * Deletes the specified cache parameter group. You cannot delete a cache parameter group if it is associated with any cache clusters. You cannot delete the default cache parameter groups in your account.
   */
  deleteCacheParameterGroup(params: ElastiCache.Types.DeleteCacheParameterGroupMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified cache parameter group. You cannot delete a cache parameter group if it is associated with any cache clusters. You cannot delete the default cache parameter groups in your account.
   */
  deleteCacheParameterGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a cache security group.  You cannot delete a cache security group if it is associated with any clusters. 
   */
  deleteCacheSecurityGroup(params: ElastiCache.Types.DeleteCacheSecurityGroupMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a cache security group.  You cannot delete a cache security group if it is associated with any clusters. 
   */
  deleteCacheSecurityGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a cache subnet group.  You cannot delete a default cache subnet group or one that is associated with any clusters. 
   */
  deleteCacheSubnetGroup(params: ElastiCache.Types.DeleteCacheSubnetGroupMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a cache subnet group.  You cannot delete a default cache subnet group or one that is associated with any clusters. 
   */
  deleteCacheSubnetGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deleting a Global datastore is a two-step process:    First, you must DisassociateGlobalReplicationGroup to remove the secondary clusters in the Global datastore.   Once the Global datastore contains only the primary cluster, you can use the DeleteGlobalReplicationGroup API to delete the Global datastore while retainining the primary cluster using RetainPrimaryReplicationGroup=true.   Since the Global Datastore has only a primary cluster, you can delete the Global Datastore while retaining the primary by setting RetainPrimaryReplicationGroup=true. The primary cluster is never deleted when deleting a Global Datastore. It can only be deleted when it no longer is associated with any Global Datastore. When you receive a successful response from this operation, Amazon ElastiCache immediately begins deleting the selected resources; you cannot cancel or revert this operation.
   */
  deleteGlobalReplicationGroup(params: ElastiCache.Types.DeleteGlobalReplicationGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.DeleteGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.DeleteGlobalReplicationGroupResult, AWSError>;
  /**
   * Deleting a Global datastore is a two-step process:    First, you must DisassociateGlobalReplicationGroup to remove the secondary clusters in the Global datastore.   Once the Global datastore contains only the primary cluster, you can use the DeleteGlobalReplicationGroup API to delete the Global datastore while retainining the primary cluster using RetainPrimaryReplicationGroup=true.   Since the Global Datastore has only a primary cluster, you can delete the Global Datastore while retaining the primary by setting RetainPrimaryReplicationGroup=true. The primary cluster is never deleted when deleting a Global Datastore. It can only be deleted when it no longer is associated with any Global Datastore. When you receive a successful response from this operation, Amazon ElastiCache immediately begins deleting the selected resources; you cannot cancel or revert this operation.
   */
  deleteGlobalReplicationGroup(callback?: (err: AWSError, data: ElastiCache.Types.DeleteGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.DeleteGlobalReplicationGroupResult, AWSError>;
  /**
   * Deletes an existing replication group. By default, this operation deletes the entire replication group, including the primary/primaries and all of the read replicas. If the replication group has only one primary, you can optionally delete only the read replicas, while retaining the primary by setting RetainPrimaryCluster=true. When you receive a successful response from this operation, Amazon ElastiCache immediately begins deleting the selected resources; you cannot cancel or revert this operation.  This operation is valid for Redis only. 
   */
  deleteReplicationGroup(params: ElastiCache.Types.DeleteReplicationGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.DeleteReplicationGroupResult) => void): Request<ElastiCache.Types.DeleteReplicationGroupResult, AWSError>;
  /**
   * Deletes an existing replication group. By default, this operation deletes the entire replication group, including the primary/primaries and all of the read replicas. If the replication group has only one primary, you can optionally delete only the read replicas, while retaining the primary by setting RetainPrimaryCluster=true. When you receive a successful response from this operation, Amazon ElastiCache immediately begins deleting the selected resources; you cannot cancel or revert this operation.  This operation is valid for Redis only. 
   */
  deleteReplicationGroup(callback?: (err: AWSError, data: ElastiCache.Types.DeleteReplicationGroupResult) => void): Request<ElastiCache.Types.DeleteReplicationGroupResult, AWSError>;
  /**
   * Deletes an existing snapshot. When you receive a successful response from this operation, ElastiCache immediately begins deleting the snapshot; you cannot cancel or revert this operation.  This operation is valid for Redis only. 
   */
  deleteSnapshot(params: ElastiCache.Types.DeleteSnapshotMessage, callback?: (err: AWSError, data: ElastiCache.Types.DeleteSnapshotResult) => void): Request<ElastiCache.Types.DeleteSnapshotResult, AWSError>;
  /**
   * Deletes an existing snapshot. When you receive a successful response from this operation, ElastiCache immediately begins deleting the snapshot; you cannot cancel or revert this operation.  This operation is valid for Redis only. 
   */
  deleteSnapshot(callback?: (err: AWSError, data: ElastiCache.Types.DeleteSnapshotResult) => void): Request<ElastiCache.Types.DeleteSnapshotResult, AWSError>;
  /**
   * For Redis engine version 6.0 onwards: Deletes a user. The user will be removed from all user groups and in turn removed from all replication groups. For more information, see Using Role Based Access Control (RBAC). 
   */
  deleteUser(params: ElastiCache.Types.DeleteUserMessage, callback?: (err: AWSError, data: ElastiCache.Types.User) => void): Request<ElastiCache.Types.User, AWSError>;
  /**
   * For Redis engine version 6.0 onwards: Deletes a user. The user will be removed from all user groups and in turn removed from all replication groups. For more information, see Using Role Based Access Control (RBAC). 
   */
  deleteUser(callback?: (err: AWSError, data: ElastiCache.Types.User) => void): Request<ElastiCache.Types.User, AWSError>;
  /**
   * For Redis engine version 6.0 onwards: Deletes a user group. The user group must first be disassociated from the replication group before it can be deleted. For more information, see Using Role Based Access Control (RBAC). 
   */
  deleteUserGroup(params: ElastiCache.Types.DeleteUserGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.UserGroup) => void): Request<ElastiCache.Types.UserGroup, AWSError>;
  /**
   * For Redis engine version 6.0 onwards: Deletes a user group. The user group must first be disassociated from the replication group before it can be deleted. For more information, see Using Role Based Access Control (RBAC). 
   */
  deleteUserGroup(callback?: (err: AWSError, data: ElastiCache.Types.UserGroup) => void): Request<ElastiCache.Types.UserGroup, AWSError>;
  /**
   * Returns information about all provisioned clusters if no cluster identifier is specified, or about a specific cache cluster if a cluster identifier is supplied. By default, abbreviated information about the clusters is returned. You can use the optional ShowCacheNodeInfo flag to retrieve detailed information about the cache nodes associated with the clusters. These details include the DNS address and port for the cache node endpoint. If the cluster is in the creating state, only cluster-level information is displayed until all of the nodes are successfully provisioned. If the cluster is in the deleting state, only cluster-level information is displayed. If cache nodes are currently being added to the cluster, node endpoint information and creation time for the additional nodes are not displayed until they are completely provisioned. When the cluster state is available, the cluster is ready for use. If cache nodes are currently being removed from the cluster, no endpoint information for the removed nodes is displayed.
   */
  describeCacheClusters(params: ElastiCache.Types.DescribeCacheClustersMessage, callback?: (err: AWSError, data: ElastiCache.Types.CacheClusterMessage) => void): Request<ElastiCache.Types.CacheClusterMessage, AWSError>;
  /**
   * Returns information about all provisioned clusters if no cluster identifier is specified, or about a specific cache cluster if a cluster identifier is supplied. By default, abbreviated information about the clusters is returned. You can use the optional ShowCacheNodeInfo flag to retrieve detailed information about the cache nodes associated with the clusters. These details include the DNS address and port for the cache node endpoint. If the cluster is in the creating state, only cluster-level information is displayed until all of the nodes are successfully provisioned. If the cluster is in the deleting state, only cluster-level information is displayed. If cache nodes are currently being added to the cluster, node endpoint information and creation time for the additional nodes are not displayed until they are completely provisioned. When the cluster state is available, the cluster is ready for use. If cache nodes are currently being removed from the cluster, no endpoint information for the removed nodes is displayed.
   */
  describeCacheClusters(callback?: (err: AWSError, data: ElastiCache.Types.CacheClusterMessage) => void): Request<ElastiCache.Types.CacheClusterMessage, AWSError>;
  /**
   * Returns a list of the available cache engines and their versions.
   */
  describeCacheEngineVersions(params: ElastiCache.Types.DescribeCacheEngineVersionsMessage, callback?: (err: AWSError, data: ElastiCache.Types.CacheEngineVersionMessage) => void): Request<ElastiCache.Types.CacheEngineVersionMessage, AWSError>;
  /**
   * Returns a list of the available cache engines and their versions.
   */
  describeCacheEngineVersions(callback?: (err: AWSError, data: ElastiCache.Types.CacheEngineVersionMessage) => void): Request<ElastiCache.Types.CacheEngineVersionMessage, AWSError>;
  /**
   * Returns a list of cache parameter group descriptions. If a cache parameter group name is specified, the list contains only the descriptions for that group.
   */
  describeCacheParameterGroups(params: ElastiCache.Types.DescribeCacheParameterGroupsMessage, callback?: (err: AWSError, data: ElastiCache.Types.CacheParameterGroupsMessage) => void): Request<ElastiCache.Types.CacheParameterGroupsMessage, AWSError>;
  /**
   * Returns a list of cache parameter group descriptions. If a cache parameter group name is specified, the list contains only the descriptions for that group.
   */
  describeCacheParameterGroups(callback?: (err: AWSError, data: ElastiCache.Types.CacheParameterGroupsMessage) => void): Request<ElastiCache.Types.CacheParameterGroupsMessage, AWSError>;
  /**
   * Returns the detailed parameter list for a particular cache parameter group.
   */
  describeCacheParameters(params: ElastiCache.Types.DescribeCacheParametersMessage, callback?: (err: AWSError, data: ElastiCache.Types.CacheParameterGroupDetails) => void): Request<ElastiCache.Types.CacheParameterGroupDetails, AWSError>;
  /**
   * Returns the detailed parameter list for a particular cache parameter group.
   */
  describeCacheParameters(callback?: (err: AWSError, data: ElastiCache.Types.CacheParameterGroupDetails) => void): Request<ElastiCache.Types.CacheParameterGroupDetails, AWSError>;
  /**
   * Returns a list of cache security group descriptions. If a cache security group name is specified, the list contains only the description of that group. This applicable only when you have ElastiCache in Classic setup 
   */
  describeCacheSecurityGroups(params: ElastiCache.Types.DescribeCacheSecurityGroupsMessage, callback?: (err: AWSError, data: ElastiCache.Types.CacheSecurityGroupMessage) => void): Request<ElastiCache.Types.CacheSecurityGroupMessage, AWSError>;
  /**
   * Returns a list of cache security group descriptions. If a cache security group name is specified, the list contains only the description of that group. This applicable only when you have ElastiCache in Classic setup 
   */
  describeCacheSecurityGroups(callback?: (err: AWSError, data: ElastiCache.Types.CacheSecurityGroupMessage) => void): Request<ElastiCache.Types.CacheSecurityGroupMessage, AWSError>;
  /**
   * Returns a list of cache subnet group descriptions. If a subnet group name is specified, the list contains only the description of that group. This is applicable only when you have ElastiCache in VPC setup. All ElastiCache clusters now launch in VPC by default. 
   */
  describeCacheSubnetGroups(params: ElastiCache.Types.DescribeCacheSubnetGroupsMessage, callback?: (err: AWSError, data: ElastiCache.Types.CacheSubnetGroupMessage) => void): Request<ElastiCache.Types.CacheSubnetGroupMessage, AWSError>;
  /**
   * Returns a list of cache subnet group descriptions. If a subnet group name is specified, the list contains only the description of that group. This is applicable only when you have ElastiCache in VPC setup. All ElastiCache clusters now launch in VPC by default. 
   */
  describeCacheSubnetGroups(callback?: (err: AWSError, data: ElastiCache.Types.CacheSubnetGroupMessage) => void): Request<ElastiCache.Types.CacheSubnetGroupMessage, AWSError>;
  /**
   * Returns the default engine and system parameter information for the specified cache engine.
   */
  describeEngineDefaultParameters(params: ElastiCache.Types.DescribeEngineDefaultParametersMessage, callback?: (err: AWSError, data: ElastiCache.Types.DescribeEngineDefaultParametersResult) => void): Request<ElastiCache.Types.DescribeEngineDefaultParametersResult, AWSError>;
  /**
   * Returns the default engine and system parameter information for the specified cache engine.
   */
  describeEngineDefaultParameters(callback?: (err: AWSError, data: ElastiCache.Types.DescribeEngineDefaultParametersResult) => void): Request<ElastiCache.Types.DescribeEngineDefaultParametersResult, AWSError>;
  /**
   * Returns events related to clusters, cache security groups, and cache parameter groups. You can obtain events specific to a particular cluster, cache security group, or cache parameter group by providing the name as a parameter. By default, only the events occurring within the last hour are returned; however, you can retrieve up to 14 days' worth of events if necessary.
   */
  describeEvents(params: ElastiCache.Types.DescribeEventsMessage, callback?: (err: AWSError, data: ElastiCache.Types.EventsMessage) => void): Request<ElastiCache.Types.EventsMessage, AWSError>;
  /**
   * Returns events related to clusters, cache security groups, and cache parameter groups. You can obtain events specific to a particular cluster, cache security group, or cache parameter group by providing the name as a parameter. By default, only the events occurring within the last hour are returned; however, you can retrieve up to 14 days' worth of events if necessary.
   */
  describeEvents(callback?: (err: AWSError, data: ElastiCache.Types.EventsMessage) => void): Request<ElastiCache.Types.EventsMessage, AWSError>;
  /**
   * Returns information about a particular global replication group. If no identifier is specified, returns information about all Global datastores. 
   */
  describeGlobalReplicationGroups(params: ElastiCache.Types.DescribeGlobalReplicationGroupsMessage, callback?: (err: AWSError, data: ElastiCache.Types.DescribeGlobalReplicationGroupsResult) => void): Request<ElastiCache.Types.DescribeGlobalReplicationGroupsResult, AWSError>;
  /**
   * Returns information about a particular global replication group. If no identifier is specified, returns information about all Global datastores. 
   */
  describeGlobalReplicationGroups(callback?: (err: AWSError, data: ElastiCache.Types.DescribeGlobalReplicationGroupsResult) => void): Request<ElastiCache.Types.DescribeGlobalReplicationGroupsResult, AWSError>;
  /**
   * Returns information about a particular replication group. If no identifier is specified, DescribeReplicationGroups returns information about all replication groups.  This operation is valid for Redis only. 
   */
  describeReplicationGroups(params: ElastiCache.Types.DescribeReplicationGroupsMessage, callback?: (err: AWSError, data: ElastiCache.Types.ReplicationGroupMessage) => void): Request<ElastiCache.Types.ReplicationGroupMessage, AWSError>;
  /**
   * Returns information about a particular replication group. If no identifier is specified, DescribeReplicationGroups returns information about all replication groups.  This operation is valid for Redis only. 
   */
  describeReplicationGroups(callback?: (err: AWSError, data: ElastiCache.Types.ReplicationGroupMessage) => void): Request<ElastiCache.Types.ReplicationGroupMessage, AWSError>;
  /**
   * Returns information about reserved cache nodes for this account, or about a specified reserved cache node.
   */
  describeReservedCacheNodes(params: ElastiCache.Types.DescribeReservedCacheNodesMessage, callback?: (err: AWSError, data: ElastiCache.Types.ReservedCacheNodeMessage) => void): Request<ElastiCache.Types.ReservedCacheNodeMessage, AWSError>;
  /**
   * Returns information about reserved cache nodes for this account, or about a specified reserved cache node.
   */
  describeReservedCacheNodes(callback?: (err: AWSError, data: ElastiCache.Types.ReservedCacheNodeMessage) => void): Request<ElastiCache.Types.ReservedCacheNodeMessage, AWSError>;
  /**
   * Lists available reserved cache node offerings.
   */
  describeReservedCacheNodesOfferings(params: ElastiCache.Types.DescribeReservedCacheNodesOfferingsMessage, callback?: (err: AWSError, data: ElastiCache.Types.ReservedCacheNodesOfferingMessage) => void): Request<ElastiCache.Types.ReservedCacheNodesOfferingMessage, AWSError>;
  /**
   * Lists available reserved cache node offerings.
   */
  describeReservedCacheNodesOfferings(callback?: (err: AWSError, data: ElastiCache.Types.ReservedCacheNodesOfferingMessage) => void): Request<ElastiCache.Types.ReservedCacheNodesOfferingMessage, AWSError>;
  /**
   * Returns details of the service updates
   */
  describeServiceUpdates(params: ElastiCache.Types.DescribeServiceUpdatesMessage, callback?: (err: AWSError, data: ElastiCache.Types.ServiceUpdatesMessage) => void): Request<ElastiCache.Types.ServiceUpdatesMessage, AWSError>;
  /**
   * Returns details of the service updates
   */
  describeServiceUpdates(callback?: (err: AWSError, data: ElastiCache.Types.ServiceUpdatesMessage) => void): Request<ElastiCache.Types.ServiceUpdatesMessage, AWSError>;
  /**
   * Returns information about cluster or replication group snapshots. By default, DescribeSnapshots lists all of your snapshots; it can optionally describe a single snapshot, or just the snapshots associated with a particular cache cluster.  This operation is valid for Redis only. 
   */
  describeSnapshots(params: ElastiCache.Types.DescribeSnapshotsMessage, callback?: (err: AWSError, data: ElastiCache.Types.DescribeSnapshotsListMessage) => void): Request<ElastiCache.Types.DescribeSnapshotsListMessage, AWSError>;
  /**
   * Returns information about cluster or replication group snapshots. By default, DescribeSnapshots lists all of your snapshots; it can optionally describe a single snapshot, or just the snapshots associated with a particular cache cluster.  This operation is valid for Redis only. 
   */
  describeSnapshots(callback?: (err: AWSError, data: ElastiCache.Types.DescribeSnapshotsListMessage) => void): Request<ElastiCache.Types.DescribeSnapshotsListMessage, AWSError>;
  /**
   * Returns details of the update actions 
   */
  describeUpdateActions(params: ElastiCache.Types.DescribeUpdateActionsMessage, callback?: (err: AWSError, data: ElastiCache.Types.UpdateActionsMessage) => void): Request<ElastiCache.Types.UpdateActionsMessage, AWSError>;
  /**
   * Returns details of the update actions 
   */
  describeUpdateActions(callback?: (err: AWSError, data: ElastiCache.Types.UpdateActionsMessage) => void): Request<ElastiCache.Types.UpdateActionsMessage, AWSError>;
  /**
   * Returns a list of user groups.
   */
  describeUserGroups(params: ElastiCache.Types.DescribeUserGroupsMessage, callback?: (err: AWSError, data: ElastiCache.Types.DescribeUserGroupsResult) => void): Request<ElastiCache.Types.DescribeUserGroupsResult, AWSError>;
  /**
   * Returns a list of user groups.
   */
  describeUserGroups(callback?: (err: AWSError, data: ElastiCache.Types.DescribeUserGroupsResult) => void): Request<ElastiCache.Types.DescribeUserGroupsResult, AWSError>;
  /**
   * Returns a list of users.
   */
  describeUsers(params: ElastiCache.Types.DescribeUsersMessage, callback?: (err: AWSError, data: ElastiCache.Types.DescribeUsersResult) => void): Request<ElastiCache.Types.DescribeUsersResult, AWSError>;
  /**
   * Returns a list of users.
   */
  describeUsers(callback?: (err: AWSError, data: ElastiCache.Types.DescribeUsersResult) => void): Request<ElastiCache.Types.DescribeUsersResult, AWSError>;
  /**
   * Remove a secondary cluster from the Global datastore using the Global datastore name. The secondary cluster will no longer receive updates from the primary cluster, but will remain as a standalone cluster in that Amazon region.
   */
  disassociateGlobalReplicationGroup(params: ElastiCache.Types.DisassociateGlobalReplicationGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.DisassociateGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.DisassociateGlobalReplicationGroupResult, AWSError>;
  /**
   * Remove a secondary cluster from the Global datastore using the Global datastore name. The secondary cluster will no longer receive updates from the primary cluster, but will remain as a standalone cluster in that Amazon region.
   */
  disassociateGlobalReplicationGroup(callback?: (err: AWSError, data: ElastiCache.Types.DisassociateGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.DisassociateGlobalReplicationGroupResult, AWSError>;
  /**
   * Used to failover the primary region to a secondary region. The secondary region will become primary, and all other clusters will become secondary.
   */
  failoverGlobalReplicationGroup(params: ElastiCache.Types.FailoverGlobalReplicationGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.FailoverGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.FailoverGlobalReplicationGroupResult, AWSError>;
  /**
   * Used to failover the primary region to a secondary region. The secondary region will become primary, and all other clusters will become secondary.
   */
  failoverGlobalReplicationGroup(callback?: (err: AWSError, data: ElastiCache.Types.FailoverGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.FailoverGlobalReplicationGroupResult, AWSError>;
  /**
   * Increase the number of node groups in the Global datastore
   */
  increaseNodeGroupsInGlobalReplicationGroup(params: ElastiCache.Types.IncreaseNodeGroupsInGlobalReplicationGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.IncreaseNodeGroupsInGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.IncreaseNodeGroupsInGlobalReplicationGroupResult, AWSError>;
  /**
   * Increase the number of node groups in the Global datastore
   */
  increaseNodeGroupsInGlobalReplicationGroup(callback?: (err: AWSError, data: ElastiCache.Types.IncreaseNodeGroupsInGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.IncreaseNodeGroupsInGlobalReplicationGroupResult, AWSError>;
  /**
   * Dynamically increases the number of replicas in a Redis (cluster mode disabled) replication group or the number of replica nodes in one or more node groups (shards) of a Redis (cluster mode enabled) replication group. This operation is performed with no cluster down time.
   */
  increaseReplicaCount(params: ElastiCache.Types.IncreaseReplicaCountMessage, callback?: (err: AWSError, data: ElastiCache.Types.IncreaseReplicaCountResult) => void): Request<ElastiCache.Types.IncreaseReplicaCountResult, AWSError>;
  /**
   * Dynamically increases the number of replicas in a Redis (cluster mode disabled) replication group or the number of replica nodes in one or more node groups (shards) of a Redis (cluster mode enabled) replication group. This operation is performed with no cluster down time.
   */
  increaseReplicaCount(callback?: (err: AWSError, data: ElastiCache.Types.IncreaseReplicaCountResult) => void): Request<ElastiCache.Types.IncreaseReplicaCountResult, AWSError>;
  /**
   * Lists all available node types that you can scale your Redis cluster's or replication group's current node type. When you use the ModifyCacheCluster or ModifyReplicationGroup operations to scale your cluster or replication group, the value of the CacheNodeType parameter must be one of the node types returned by this operation.
   */
  listAllowedNodeTypeModifications(params: ElastiCache.Types.ListAllowedNodeTypeModificationsMessage, callback?: (err: AWSError, data: ElastiCache.Types.AllowedNodeTypeModificationsMessage) => void): Request<ElastiCache.Types.AllowedNodeTypeModificationsMessage, AWSError>;
  /**
   * Lists all available node types that you can scale your Redis cluster's or replication group's current node type. When you use the ModifyCacheCluster or ModifyReplicationGroup operations to scale your cluster or replication group, the value of the CacheNodeType parameter must be one of the node types returned by this operation.
   */
  listAllowedNodeTypeModifications(callback?: (err: AWSError, data: ElastiCache.Types.AllowedNodeTypeModificationsMessage) => void): Request<ElastiCache.Types.AllowedNodeTypeModificationsMessage, AWSError>;
  /**
   * Lists all tags currently on a named resource.  A tag is a key-value pair where the key and value are case-sensitive. You can use tags to categorize and track all your ElastiCache resources, with the exception of global replication group. When you add or remove tags on replication groups, those actions will be replicated to all nodes in the replication group. For more information, see Resource-level permissions. If the cluster is not in the available state, ListTagsForResource returns an error.
   */
  listTagsForResource(params: ElastiCache.Types.ListTagsForResourceMessage, callback?: (err: AWSError, data: ElastiCache.Types.TagListMessage) => void): Request<ElastiCache.Types.TagListMessage, AWSError>;
  /**
   * Lists all tags currently on a named resource.  A tag is a key-value pair where the key and value are case-sensitive. You can use tags to categorize and track all your ElastiCache resources, with the exception of global replication group. When you add or remove tags on replication groups, those actions will be replicated to all nodes in the replication group. For more information, see Resource-level permissions. If the cluster is not in the available state, ListTagsForResource returns an error.
   */
  listTagsForResource(callback?: (err: AWSError, data: ElastiCache.Types.TagListMessage) => void): Request<ElastiCache.Types.TagListMessage, AWSError>;
  /**
   * Modifies the settings for a cluster. You can use this operation to change one or more cluster configuration parameters by specifying the parameters and the new values.
   */
  modifyCacheCluster(params: ElastiCache.Types.ModifyCacheClusterMessage, callback?: (err: AWSError, data: ElastiCache.Types.ModifyCacheClusterResult) => void): Request<ElastiCache.Types.ModifyCacheClusterResult, AWSError>;
  /**
   * Modifies the settings for a cluster. You can use this operation to change one or more cluster configuration parameters by specifying the parameters and the new values.
   */
  modifyCacheCluster(callback?: (err: AWSError, data: ElastiCache.Types.ModifyCacheClusterResult) => void): Request<ElastiCache.Types.ModifyCacheClusterResult, AWSError>;
  /**
   * Modifies the parameters of a cache parameter group. You can modify up to 20 parameters in a single request by submitting a list parameter name and value pairs.
   */
  modifyCacheParameterGroup(params: ElastiCache.Types.ModifyCacheParameterGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.CacheParameterGroupNameMessage) => void): Request<ElastiCache.Types.CacheParameterGroupNameMessage, AWSError>;
  /**
   * Modifies the parameters of a cache parameter group. You can modify up to 20 parameters in a single request by submitting a list parameter name and value pairs.
   */
  modifyCacheParameterGroup(callback?: (err: AWSError, data: ElastiCache.Types.CacheParameterGroupNameMessage) => void): Request<ElastiCache.Types.CacheParameterGroupNameMessage, AWSError>;
  /**
   * Modifies an existing cache subnet group.
   */
  modifyCacheSubnetGroup(params: ElastiCache.Types.ModifyCacheSubnetGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.ModifyCacheSubnetGroupResult) => void): Request<ElastiCache.Types.ModifyCacheSubnetGroupResult, AWSError>;
  /**
   * Modifies an existing cache subnet group.
   */
  modifyCacheSubnetGroup(callback?: (err: AWSError, data: ElastiCache.Types.ModifyCacheSubnetGroupResult) => void): Request<ElastiCache.Types.ModifyCacheSubnetGroupResult, AWSError>;
  /**
   * Modifies the settings for a Global datastore.
   */
  modifyGlobalReplicationGroup(params: ElastiCache.Types.ModifyGlobalReplicationGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.ModifyGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.ModifyGlobalReplicationGroupResult, AWSError>;
  /**
   * Modifies the settings for a Global datastore.
   */
  modifyGlobalReplicationGroup(callback?: (err: AWSError, data: ElastiCache.Types.ModifyGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.ModifyGlobalReplicationGroupResult, AWSError>;
  /**
   * Modifies the settings for a replication group.    Scaling for Amazon ElastiCache for Redis (cluster mode enabled) in the ElastiCache User Guide    ModifyReplicationGroupShardConfiguration in the ElastiCache API Reference    This operation is valid for Redis only. 
   */
  modifyReplicationGroup(params: ElastiCache.Types.ModifyReplicationGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.ModifyReplicationGroupResult) => void): Request<ElastiCache.Types.ModifyReplicationGroupResult, AWSError>;
  /**
   * Modifies the settings for a replication group.    Scaling for Amazon ElastiCache for Redis (cluster mode enabled) in the ElastiCache User Guide    ModifyReplicationGroupShardConfiguration in the ElastiCache API Reference    This operation is valid for Redis only. 
   */
  modifyReplicationGroup(callback?: (err: AWSError, data: ElastiCache.Types.ModifyReplicationGroupResult) => void): Request<ElastiCache.Types.ModifyReplicationGroupResult, AWSError>;
  /**
   * Modifies a replication group's shards (node groups) by allowing you to add shards, remove shards, or rebalance the keyspaces among existing shards.
   */
  modifyReplicationGroupShardConfiguration(params: ElastiCache.Types.ModifyReplicationGroupShardConfigurationMessage, callback?: (err: AWSError, data: ElastiCache.Types.ModifyReplicationGroupShardConfigurationResult) => void): Request<ElastiCache.Types.ModifyReplicationGroupShardConfigurationResult, AWSError>;
  /**
   * Modifies a replication group's shards (node groups) by allowing you to add shards, remove shards, or rebalance the keyspaces among existing shards.
   */
  modifyReplicationGroupShardConfiguration(callback?: (err: AWSError, data: ElastiCache.Types.ModifyReplicationGroupShardConfigurationResult) => void): Request<ElastiCache.Types.ModifyReplicationGroupShardConfigurationResult, AWSError>;
  /**
   * Changes user password(s) and/or access string.
   */
  modifyUser(params: ElastiCache.Types.ModifyUserMessage, callback?: (err: AWSError, data: ElastiCache.Types.User) => void): Request<ElastiCache.Types.User, AWSError>;
  /**
   * Changes user password(s) and/or access string.
   */
  modifyUser(callback?: (err: AWSError, data: ElastiCache.Types.User) => void): Request<ElastiCache.Types.User, AWSError>;
  /**
   * Changes the list of users that belong to the user group.
   */
  modifyUserGroup(params: ElastiCache.Types.ModifyUserGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.UserGroup) => void): Request<ElastiCache.Types.UserGroup, AWSError>;
  /**
   * Changes the list of users that belong to the user group.
   */
  modifyUserGroup(callback?: (err: AWSError, data: ElastiCache.Types.UserGroup) => void): Request<ElastiCache.Types.UserGroup, AWSError>;
  /**
   * Allows you to purchase a reserved cache node offering. Reserved nodes are not eligible for cancellation and are non-refundable. For more information, see Managing Costs with Reserved Nodes for Redis or Managing Costs with Reserved Nodes for Memcached.
   */
  purchaseReservedCacheNodesOffering(params: ElastiCache.Types.PurchaseReservedCacheNodesOfferingMessage, callback?: (err: AWSError, data: ElastiCache.Types.PurchaseReservedCacheNodesOfferingResult) => void): Request<ElastiCache.Types.PurchaseReservedCacheNodesOfferingResult, AWSError>;
  /**
   * Allows you to purchase a reserved cache node offering. Reserved nodes are not eligible for cancellation and are non-refundable. For more information, see Managing Costs with Reserved Nodes for Redis or Managing Costs with Reserved Nodes for Memcached.
   */
  purchaseReservedCacheNodesOffering(callback?: (err: AWSError, data: ElastiCache.Types.PurchaseReservedCacheNodesOfferingResult) => void): Request<ElastiCache.Types.PurchaseReservedCacheNodesOfferingResult, AWSError>;
  /**
   * Redistribute slots to ensure uniform distribution across existing shards in the cluster.
   */
  rebalanceSlotsInGlobalReplicationGroup(params: ElastiCache.Types.RebalanceSlotsInGlobalReplicationGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.RebalanceSlotsInGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.RebalanceSlotsInGlobalReplicationGroupResult, AWSError>;
  /**
   * Redistribute slots to ensure uniform distribution across existing shards in the cluster.
   */
  rebalanceSlotsInGlobalReplicationGroup(callback?: (err: AWSError, data: ElastiCache.Types.RebalanceSlotsInGlobalReplicationGroupResult) => void): Request<ElastiCache.Types.RebalanceSlotsInGlobalReplicationGroupResult, AWSError>;
  /**
   * Reboots some, or all, of the cache nodes within a provisioned cluster. This operation applies any modified cache parameter groups to the cluster. The reboot operation takes place as soon as possible, and results in a momentary outage to the cluster. During the reboot, the cluster status is set to REBOOTING. The reboot causes the contents of the cache (for each cache node being rebooted) to be lost. When the reboot is complete, a cluster event is created. Rebooting a cluster is currently supported on Memcached and Redis (cluster mode disabled) clusters. Rebooting is not supported on Redis (cluster mode enabled) clusters. If you make changes to parameters that require a Redis (cluster mode enabled) cluster reboot for the changes to be applied, see Rebooting a Cluster for an alternate process.
   */
  rebootCacheCluster(params: ElastiCache.Types.RebootCacheClusterMessage, callback?: (err: AWSError, data: ElastiCache.Types.RebootCacheClusterResult) => void): Request<ElastiCache.Types.RebootCacheClusterResult, AWSError>;
  /**
   * Reboots some, or all, of the cache nodes within a provisioned cluster. This operation applies any modified cache parameter groups to the cluster. The reboot operation takes place as soon as possible, and results in a momentary outage to the cluster. During the reboot, the cluster status is set to REBOOTING. The reboot causes the contents of the cache (for each cache node being rebooted) to be lost. When the reboot is complete, a cluster event is created. Rebooting a cluster is currently supported on Memcached and Redis (cluster mode disabled) clusters. Rebooting is not supported on Redis (cluster mode enabled) clusters. If you make changes to parameters that require a Redis (cluster mode enabled) cluster reboot for the changes to be applied, see Rebooting a Cluster for an alternate process.
   */
  rebootCacheCluster(callback?: (err: AWSError, data: ElastiCache.Types.RebootCacheClusterResult) => void): Request<ElastiCache.Types.RebootCacheClusterResult, AWSError>;
  /**
   * Removes the tags identified by the TagKeys list from the named resource. A tag is a key-value pair where the key and value are case-sensitive. You can use tags to categorize and track all your ElastiCache resources, with the exception of global replication group. When you add or remove tags on replication groups, those actions will be replicated to all nodes in the replication group. For more information, see Resource-level permissions.
   */
  removeTagsFromResource(params: ElastiCache.Types.RemoveTagsFromResourceMessage, callback?: (err: AWSError, data: ElastiCache.Types.TagListMessage) => void): Request<ElastiCache.Types.TagListMessage, AWSError>;
  /**
   * Removes the tags identified by the TagKeys list from the named resource. A tag is a key-value pair where the key and value are case-sensitive. You can use tags to categorize and track all your ElastiCache resources, with the exception of global replication group. When you add or remove tags on replication groups, those actions will be replicated to all nodes in the replication group. For more information, see Resource-level permissions.
   */
  removeTagsFromResource(callback?: (err: AWSError, data: ElastiCache.Types.TagListMessage) => void): Request<ElastiCache.Types.TagListMessage, AWSError>;
  /**
   * Modifies the parameters of a cache parameter group to the engine or system default value. You can reset specific parameters by submitting a list of parameter names. To reset the entire cache parameter group, specify the ResetAllParameters and CacheParameterGroupName parameters.
   */
  resetCacheParameterGroup(params: ElastiCache.Types.ResetCacheParameterGroupMessage, callback?: (err: AWSError, data: ElastiCache.Types.CacheParameterGroupNameMessage) => void): Request<ElastiCache.Types.CacheParameterGroupNameMessage, AWSError>;
  /**
   * Modifies the parameters of a cache parameter group to the engine or system default value. You can reset specific parameters by submitting a list of parameter names. To reset the entire cache parameter group, specify the ResetAllParameters and CacheParameterGroupName parameters.
   */
  resetCacheParameterGroup(callback?: (err: AWSError, data: ElastiCache.Types.CacheParameterGroupNameMessage) => void): Request<ElastiCache.Types.CacheParameterGroupNameMessage, AWSError>;
  /**
   * Revokes ingress from a cache security group. Use this operation to disallow access from an Amazon EC2 security group that had been previously authorized.
   */
  revokeCacheSecurityGroupIngress(params: ElastiCache.Types.RevokeCacheSecurityGroupIngressMessage, callback?: (err: AWSError, data: ElastiCache.Types.RevokeCacheSecurityGroupIngressResult) => void): Request<ElastiCache.Types.RevokeCacheSecurityGroupIngressResult, AWSError>;
  /**
   * Revokes ingress from a cache security group. Use this operation to disallow access from an Amazon EC2 security group that had been previously authorized.
   */
  revokeCacheSecurityGroupIngress(callback?: (err: AWSError, data: ElastiCache.Types.RevokeCacheSecurityGroupIngressResult) => void): Request<ElastiCache.Types.RevokeCacheSecurityGroupIngressResult, AWSError>;
  /**
   * Start the migration of data.
   */
  startMigration(params: ElastiCache.Types.StartMigrationMessage, callback?: (err: AWSError, data: ElastiCache.Types.StartMigrationResponse) => void): Request<ElastiCache.Types.StartMigrationResponse, AWSError>;
  /**
   * Start the migration of data.
   */
  startMigration(callback?: (err: AWSError, data: ElastiCache.Types.StartMigrationResponse) => void): Request<ElastiCache.Types.StartMigrationResponse, AWSError>;
  /**
   * Represents the input of a TestFailover operation which test automatic failover on a specified node group (called shard in the console) in a replication group (called cluster in the console). This API is designed for testing the behavior of your application in case of ElastiCache failover. It is not designed to be an operational tool for initiating a failover to overcome a problem you may have with the cluster. Moreover, in certain conditions such as large-scale operational events, Amazon may block this API.   Note the following    A customer can use this operation to test automatic failover on up to 5 shards (called node groups in the ElastiCache API and Amazon CLI) in any rolling 24-hour period.   If calling this operation on shards in different clusters (called replication groups in the API and CLI), the calls can be made concurrently.     If calling this operation multiple times on different shards in the same Redis (cluster mode enabled) replication group, the first node replacement must complete before a subsequent call can be made.   To determine whether the node replacement is complete you can check Events using the Amazon ElastiCache console, the Amazon CLI, or the ElastiCache API. Look for the following automatic failover related events, listed here in order of occurrance:   Replication group message: Test Failover API called for node group &lt;node-group-id&gt;    Cache cluster message: Failover from primary node &lt;primary-node-id&gt; to replica node &lt;node-id&gt; completed    Replication group message: Failover from primary node &lt;primary-node-id&gt; to replica node &lt;node-id&gt; completed    Cache cluster message: Recovering cache nodes &lt;node-id&gt;    Cache cluster message: Finished recovery for cache nodes &lt;node-id&gt;    For more information see:    Viewing ElastiCache Events in the ElastiCache User Guide     DescribeEvents in the ElastiCache API Reference     Also see, Testing Multi-AZ  in the ElastiCache User Guide.
   */
  testFailover(params: ElastiCache.Types.TestFailoverMessage, callback?: (err: AWSError, data: ElastiCache.Types.TestFailoverResult) => void): Request<ElastiCache.Types.TestFailoverResult, AWSError>;
  /**
   * Represents the input of a TestFailover operation which test automatic failover on a specified node group (called shard in the console) in a replication group (called cluster in the console). This API is designed for testing the behavior of your application in case of ElastiCache failover. It is not designed to be an operational tool for initiating a failover to overcome a problem you may have with the cluster. Moreover, in certain conditions such as large-scale operational events, Amazon may block this API.   Note the following    A customer can use this operation to test automatic failover on up to 5 shards (called node groups in the ElastiCache API and Amazon CLI) in any rolling 24-hour period.   If calling this operation on shards in different clusters (called replication groups in the API and CLI), the calls can be made concurrently.     If calling this operation multiple times on different shards in the same Redis (cluster mode enabled) replication group, the first node replacement must complete before a subsequent call can be made.   To determine whether the node replacement is complete you can check Events using the Amazon ElastiCache console, the Amazon CLI, or the ElastiCache API. Look for the following automatic failover related events, listed here in order of occurrance:   Replication group message: Test Failover API called for node group &lt;node-group-id&gt;    Cache cluster message: Failover from primary node &lt;primary-node-id&gt; to replica node &lt;node-id&gt; completed    Replication group message: Failover from primary node &lt;primary-node-id&gt; to replica node &lt;node-id&gt; completed    Cache cluster message: Recovering cache nodes &lt;node-id&gt;    Cache cluster message: Finished recovery for cache nodes &lt;node-id&gt;    For more information see:    Viewing ElastiCache Events in the ElastiCache User Guide     DescribeEvents in the ElastiCache API Reference     Also see, Testing Multi-AZ  in the ElastiCache User Guide.
   */
  testFailover(callback?: (err: AWSError, data: ElastiCache.Types.TestFailoverResult) => void): Request<ElastiCache.Types.TestFailoverResult, AWSError>;
  /**
   *  Async API to test connection between source and target replication group. 
   */
  testMigration(params: ElastiCache.Types.TestMigrationMessage, callback?: (err: AWSError, data: ElastiCache.Types.TestMigrationResponse) => void): Request<ElastiCache.Types.TestMigrationResponse, AWSError>;
  /**
   *  Async API to test connection between source and target replication group. 
   */
  testMigration(callback?: (err: AWSError, data: ElastiCache.Types.TestMigrationResponse) => void): Request<ElastiCache.Types.TestMigrationResponse, AWSError>;
  /**
   * Waits for the cacheClusterAvailable state by periodically calling the underlying ElastiCache.describeCacheClustersoperation every 15 seconds (at most 40 times). Wait until ElastiCache cluster is available.
   */
  waitFor(state: "cacheClusterAvailable", params: ElastiCache.Types.DescribeCacheClustersMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: ElastiCache.Types.CacheClusterMessage) => void): Request<ElastiCache.Types.CacheClusterMessage, AWSError>;
  /**
   * Waits for the cacheClusterAvailable state by periodically calling the underlying ElastiCache.describeCacheClustersoperation every 15 seconds (at most 40 times). Wait until ElastiCache cluster is available.
   */
  waitFor(state: "cacheClusterAvailable", callback?: (err: AWSError, data: ElastiCache.Types.CacheClusterMessage) => void): Request<ElastiCache.Types.CacheClusterMessage, AWSError>;
  /**
   * Waits for the cacheClusterDeleted state by periodically calling the underlying ElastiCache.describeCacheClustersoperation every 15 seconds (at most 40 times). Wait until ElastiCache cluster is deleted.
   */
  waitFor(state: "cacheClusterDeleted", params: ElastiCache.Types.DescribeCacheClustersMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: ElastiCache.Types.CacheClusterMessage) => void): Request<ElastiCache.Types.CacheClusterMessage, AWSError>;
  /**
   * Waits for the cacheClusterDeleted state by periodically calling the underlying ElastiCache.describeCacheClustersoperation every 15 seconds (at most 40 times). Wait until ElastiCache cluster is deleted.
   */
  waitFor(state: "cacheClusterDeleted", callback?: (err: AWSError, data: ElastiCache.Types.CacheClusterMessage) => void): Request<ElastiCache.Types.CacheClusterMessage, AWSError>;
  /**
   * Waits for the replicationGroupAvailable state by periodically calling the underlying ElastiCache.describeReplicationGroupsoperation every 15 seconds (at most 40 times). Wait until ElastiCache replication group is available.
   */
  waitFor(state: "replicationGroupAvailable", params: ElastiCache.Types.DescribeReplicationGroupsMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: ElastiCache.Types.ReplicationGroupMessage) => void): Request<ElastiCache.Types.ReplicationGroupMessage, AWSError>;
  /**
   * Waits for the replicationGroupAvailable state by periodically calling the underlying ElastiCache.describeReplicationGroupsoperation every 15 seconds (at most 40 times). Wait until ElastiCache replication group is available.
   */
  waitFor(state: "replicationGroupAvailable", callback?: (err: AWSError, data: ElastiCache.Types.ReplicationGroupMessage) => void): Request<ElastiCache.Types.ReplicationGroupMessage, AWSError>;
  /**
   * Waits for the replicationGroupDeleted state by periodically calling the underlying ElastiCache.describeReplicationGroupsoperation every 15 seconds (at most 40 times). Wait until ElastiCache replication group is deleted.
   */
  waitFor(state: "replicationGroupDeleted", params: ElastiCache.Types.DescribeReplicationGroupsMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: ElastiCache.Types.ReplicationGroupMessage) => void): Request<ElastiCache.Types.ReplicationGroupMessage, AWSError>;
  /**
   * Waits for the replicationGroupDeleted state by periodically calling the underlying ElastiCache.describeReplicationGroupsoperation every 15 seconds (at most 40 times). Wait until ElastiCache replication group is deleted.
   */
  waitFor(state: "replicationGroupDeleted", callback?: (err: AWSError, data: ElastiCache.Types.ReplicationGroupMessage) => void): Request<ElastiCache.Types.ReplicationGroupMessage, AWSError>;
}
declare namespace ElastiCache {
  export type AZMode = "single-az"|"cross-az"|string;
  export type AccessString = string;
  export interface AddTagsToResourceMessage {
    /**
     * The Amazon Resource Name (ARN) of the resource to which the tags are to be added, for example arn:aws:elasticache:us-west-2:0123456789:cluster:myCluster or arn:aws:elasticache:us-west-2:0123456789:snapshot:mySnapshot. ElastiCache resources are cluster and snapshot. For more information about ARNs, see Amazon Resource Names (ARNs) and Amazon Service Namespaces.
     */
    ResourceName: String;
    /**
     * A list of tags to be added to this resource. A tag is a key-value pair. A tag key must be accompanied by a tag value, although null is accepted.
     */
    Tags: TagList;
  }
  export type AllowedNodeGroupId = string;
  export interface AllowedNodeTypeModificationsMessage {
    /**
     * A string list, each element of which specifies a cache node type which you can use to scale your cluster or replication group. When scaling up a Redis cluster or replication group using ModifyCacheCluster or ModifyReplicationGroup, use a value from this list for the CacheNodeType parameter.
     */
    ScaleUpModifications?: NodeTypeList;
    /**
     * A string list, each element of which specifies a cache node type which you can use to scale your cluster or replication group. When scaling down a Redis cluster or replication group using ModifyCacheCluster or ModifyReplicationGroup, use a value from this list for the CacheNodeType parameter. 
     */
    ScaleDownModifications?: NodeTypeList;
  }
  export type AuthTokenUpdateStatus = "SETTING"|"ROTATING"|string;
  export type AuthTokenUpdateStrategyType = "SET"|"ROTATE"|"DELETE"|string;
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
     * Specifies the authentication type. Possible options are IAM authentication, password and no password.
     */
    Type?: InputAuthenticationType;
    /**
     * Specifies the passwords to use for authentication if Type is set to password.
     */
    Passwords?: PasswordListInput;
  }
  export type AuthenticationType = "password"|"no-password"|"iam"|string;
  export interface AuthorizeCacheSecurityGroupIngressMessage {
    /**
     * The cache security group that allows network ingress.
     */
    CacheSecurityGroupName: String;
    /**
     * The Amazon EC2 security group to be authorized for ingress to the cache security group.
     */
    EC2SecurityGroupName: String;
    /**
     * The Amazon account number of the Amazon EC2 security group owner. Note that this is not the same thing as an Amazon access key ID - you must provide a valid Amazon account number for this parameter.
     */
    EC2SecurityGroupOwnerId: String;
  }
  export interface AuthorizeCacheSecurityGroupIngressResult {
    CacheSecurityGroup?: CacheSecurityGroup;
  }
  export type AutomaticFailoverStatus = "enabled"|"disabled"|"enabling"|"disabling"|string;
  export interface AvailabilityZone {
    /**
     * The name of the Availability Zone.
     */
    Name?: String;
  }
  export type AvailabilityZonesList = String[];
  export interface BatchApplyUpdateActionMessage {
    /**
     * The replication group IDs
     */
    ReplicationGroupIds?: ReplicationGroupIdList;
    /**
     * The cache cluster IDs
     */
    CacheClusterIds?: CacheClusterIdList;
    /**
     * The unique ID of the service update
     */
    ServiceUpdateName: String;
  }
  export interface BatchStopUpdateActionMessage {
    /**
     * The replication group IDs
     */
    ReplicationGroupIds?: ReplicationGroupIdList;
    /**
     * The cache cluster IDs
     */
    CacheClusterIds?: CacheClusterIdList;
    /**
     * The unique ID of the service update
     */
    ServiceUpdateName: String;
  }
  export type Boolean = boolean;
  export type BooleanOptional = boolean;
  export interface CacheCluster {
    /**
     * The user-supplied identifier of the cluster. This identifier is a unique key that identifies a cluster.
     */
    CacheClusterId?: String;
    /**
     * Represents a Memcached cluster endpoint which can be used by an application to connect to any node in the cluster. The configuration endpoint will always have .cfg in it. Example: mem-3.9dvc4r.cfg.usw2.cache.amazonaws.com:11211 
     */
    ConfigurationEndpoint?: Endpoint;
    /**
     * The URL of the web page where you can download the latest ElastiCache client library.
     */
    ClientDownloadLandingPage?: String;
    /**
     * The name of the compute and memory capacity node type for the cluster. The following node types are supported by ElastiCache. Generally speaking, the current generation types provide more memory and computational power at lower cost when compared to their equivalent previous generation counterparts.   General purpose:   Current generation:   M6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward): cache.m6g.large, cache.m6g.xlarge, cache.m6g.2xlarge, cache.m6g.4xlarge, cache.m6g.8xlarge, cache.m6g.12xlarge, cache.m6g.16xlarge   For region availability, see Supported Node Types    M5 node types: cache.m5.large, cache.m5.xlarge, cache.m5.2xlarge, cache.m5.4xlarge, cache.m5.12xlarge, cache.m5.24xlarge   M4 node types: cache.m4.large, cache.m4.xlarge, cache.m4.2xlarge, cache.m4.4xlarge, cache.m4.10xlarge   T4g node types (available only for Redis engine version 5.0.6 onward and Memcached engine version 1.5.16 onward): cache.t4g.micro, cache.t4g.small, cache.t4g.medium   T3 node types: cache.t3.micro, cache.t3.small, cache.t3.medium   T2 node types: cache.t2.micro, cache.t2.small, cache.t2.medium    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  T1 node types: cache.t1.micro   M1 node types: cache.m1.small, cache.m1.medium, cache.m1.large, cache.m1.xlarge   M3 node types: cache.m3.medium, cache.m3.large, cache.m3.xlarge, cache.m3.2xlarge      Compute optimized:   Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  C1 node types: cache.c1.xlarge      Memory optimized:   Current generation:   R6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward).  cache.r6g.large, cache.r6g.xlarge, cache.r6g.2xlarge, cache.r6g.4xlarge, cache.r6g.8xlarge, cache.r6g.12xlarge, cache.r6g.16xlarge   For region availability, see Supported Node Types    R5 node types: cache.r5.large, cache.r5.xlarge, cache.r5.2xlarge, cache.r5.4xlarge, cache.r5.12xlarge, cache.r5.24xlarge   R4 node types: cache.r4.large, cache.r4.xlarge, cache.r4.2xlarge, cache.r4.4xlarge, cache.r4.8xlarge, cache.r4.16xlarge    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  M2 node types: cache.m2.xlarge, cache.m2.2xlarge, cache.m2.4xlarge   R3 node types: cache.r3.large, cache.r3.xlarge, cache.r3.2xlarge, cache.r3.4xlarge, cache.r3.8xlarge       Additional node type info    All current generation instance types are created in Amazon VPC by default.   Redis append-only files (AOF) are not supported for T1 or T2 instances.   Redis Multi-AZ with automatic failover is not supported on T1 instances.   Redis configuration variables appendonly and appendfsync are not supported on Redis version 2.8.22 and later.  
     */
    CacheNodeType?: String;
    /**
     * The name of the cache engine (memcached or redis) to be used for this cluster.
     */
    Engine?: String;
    /**
     * The version of the cache engine that is used in this cluster.
     */
    EngineVersion?: String;
    /**
     * The current state of this cluster, one of the following values: available, creating, deleted, deleting, incompatible-network, modifying, rebooting cluster nodes, restore-failed, or snapshotting.
     */
    CacheClusterStatus?: String;
    /**
     * The number of cache nodes in the cluster. For clusters running Redis, this value must be 1. For clusters running Memcached, this value must be between 1 and 40.
     */
    NumCacheNodes?: IntegerOptional;
    /**
     * The name of the Availability Zone in which the cluster is located or "Multiple" if the cache nodes are located in different Availability Zones.
     */
    PreferredAvailabilityZone?: String;
    /**
     * The outpost ARN in which the cache cluster is created.
     */
    PreferredOutpostArn?: String;
    /**
     * The date and time when the cluster was created.
     */
    CacheClusterCreateTime?: TStamp;
    /**
     * Specifies the weekly time range during which maintenance on the cluster is performed. It is specified as a range in the format ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC). The minimum maintenance window is a 60 minute period. Valid values for ddd are:    sun     mon     tue     wed     thu     fri     sat    Example: sun:23:00-mon:01:30 
     */
    PreferredMaintenanceWindow?: String;
    PendingModifiedValues?: PendingModifiedValues;
    /**
     * Describes a notification topic and its status. Notification topics are used for publishing ElastiCache events to subscribers using Amazon Simple Notification Service (SNS). 
     */
    NotificationConfiguration?: NotificationConfiguration;
    /**
     * A list of cache security group elements, composed of name and status sub-elements.
     */
    CacheSecurityGroups?: CacheSecurityGroupMembershipList;
    /**
     * Status of the cache parameter group.
     */
    CacheParameterGroup?: CacheParameterGroupStatus;
    /**
     * The name of the cache subnet group associated with the cluster.
     */
    CacheSubnetGroupName?: String;
    /**
     * A list of cache nodes that are members of the cluster.
     */
    CacheNodes?: CacheNodeList;
    /**
     *  If you are running Redis engine version 6.0 or later, set this parameter to yes if you want to opt-in to the next auto minor version upgrade campaign. This parameter is disabled for previous versions.  
     */
    AutoMinorVersionUpgrade?: Boolean;
    /**
     * A list of VPC Security Groups associated with the cluster.
     */
    SecurityGroups?: SecurityGroupMembershipList;
    /**
     * The replication group to which this cluster belongs. If this field is empty, the cluster is not associated with any replication group.
     */
    ReplicationGroupId?: String;
    /**
     * The number of days for which ElastiCache retains automatic cluster snapshots before deleting them. For example, if you set SnapshotRetentionLimit to 5, a snapshot that was taken today is retained for 5 days before being deleted.   If the value of SnapshotRetentionLimit is set to zero (0), backups are turned off. 
     */
    SnapshotRetentionLimit?: IntegerOptional;
    /**
     * The daily time range (in UTC) during which ElastiCache begins taking a daily snapshot of your cluster. Example: 05:00-09:00 
     */
    SnapshotWindow?: String;
    /**
     * A flag that enables using an AuthToken (password) when issuing Redis commands. Default: false 
     */
    AuthTokenEnabled?: BooleanOptional;
    /**
     * The date the auth token was last modified
     */
    AuthTokenLastModifiedDate?: TStamp;
    /**
     * A flag that enables in-transit encryption when set to true.  Required: Only available when creating a replication group in an Amazon VPC using redis version 3.2.6, 4.x or later. Default: false 
     */
    TransitEncryptionEnabled?: BooleanOptional;
    /**
     * A flag that enables encryption at-rest when set to true. You cannot modify the value of AtRestEncryptionEnabled after the cluster is created. To enable at-rest encryption on a cluster you must set AtRestEncryptionEnabled to true when you create a cluster.  Required: Only available when creating a replication group in an Amazon VPC using redis version 3.2.6, 4.x or later. Default: false 
     */
    AtRestEncryptionEnabled?: BooleanOptional;
    /**
     * The ARN (Amazon Resource Name) of the cache cluster.
     */
    ARN?: String;
    /**
     * A boolean value indicating whether log delivery is enabled for the replication group.
     */
    ReplicationGroupLogDeliveryEnabled?: Boolean;
    /**
     * Returns the destination, format and type of the logs.
     */
    LogDeliveryConfigurations?: LogDeliveryConfigurationList;
    /**
     * Must be either ipv4 | ipv6 | dual_stack. IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the Nitro system.
     */
    NetworkType?: NetworkType;
    /**
     * The network type associated with the cluster, either ipv4 | ipv6. IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the Nitro system.
     */
    IpDiscovery?: IpDiscovery;
    /**
     * A setting that allows you to migrate your clients to use in-transit encryption, with no downtime.
     */
    TransitEncryptionMode?: TransitEncryptionMode;
  }
  export type CacheClusterIdList = String[];
  export type CacheClusterList = CacheCluster[];
  export interface CacheClusterMessage {
    /**
     * Provides an identifier to allow retrieval of paginated results.
     */
    Marker?: String;
    /**
     * A list of clusters. Each item in the list contains detailed information about one cluster.
     */
    CacheClusters?: CacheClusterList;
  }
  export interface CacheEngineVersion {
    /**
     * The name of the cache engine.
     */
    Engine?: String;
    /**
     * The version number of the cache engine.
     */
    EngineVersion?: String;
    /**
     * The name of the cache parameter group family associated with this cache engine. Valid values are: memcached1.4 | memcached1.5 | memcached1.6 | redis2.6 | redis2.8 | redis3.2 | redis4.0 | redis5.0 | redis6.x | redis7 
     */
    CacheParameterGroupFamily?: String;
    /**
     * The description of the cache engine.
     */
    CacheEngineDescription?: String;
    /**
     * The description of the cache engine version.
     */
    CacheEngineVersionDescription?: String;
  }
  export type CacheEngineVersionList = CacheEngineVersion[];
  export interface CacheEngineVersionMessage {
    /**
     * Provides an identifier to allow retrieval of paginated results.
     */
    Marker?: String;
    /**
     * A list of cache engine version details. Each element in the list contains detailed information about one cache engine version.
     */
    CacheEngineVersions?: CacheEngineVersionList;
  }
  export interface CacheNode {
    /**
     * The cache node identifier. A node ID is a numeric identifier (0001, 0002, etc.). The combination of cluster ID and node ID uniquely identifies every cache node used in a customer's Amazon account.
     */
    CacheNodeId?: String;
    /**
     * The current state of this cache node, one of the following values: available, creating, rebooting, or deleting.
     */
    CacheNodeStatus?: String;
    /**
     * The date and time when the cache node was created.
     */
    CacheNodeCreateTime?: TStamp;
    /**
     * The hostname for connecting to this cache node.
     */
    Endpoint?: Endpoint;
    /**
     * The status of the parameter group applied to this cache node.
     */
    ParameterGroupStatus?: String;
    /**
     * The ID of the primary node to which this read replica node is synchronized. If this field is empty, this node is not associated with a primary cluster.
     */
    SourceCacheNodeId?: String;
    /**
     * The Availability Zone where this node was created and now resides.
     */
    CustomerAvailabilityZone?: String;
    /**
     * The customer outpost ARN of the cache node.
     */
    CustomerOutpostArn?: String;
  }
  export type CacheNodeIdsList = String[];
  export type CacheNodeList = CacheNode[];
  export interface CacheNodeTypeSpecificParameter {
    /**
     * The name of the parameter.
     */
    ParameterName?: String;
    /**
     * A description of the parameter.
     */
    Description?: String;
    /**
     * The source of the parameter value.
     */
    Source?: String;
    /**
     * The valid data type for the parameter.
     */
    DataType?: String;
    /**
     * The valid range of values for the parameter.
     */
    AllowedValues?: String;
    /**
     * Indicates whether (true) or not (false) the parameter can be modified. Some parameters have security or operational implications that prevent them from being changed.
     */
    IsModifiable?: Boolean;
    /**
     * The earliest cache engine version to which the parameter can apply.
     */
    MinimumEngineVersion?: String;
    /**
     * A list of cache node types and their corresponding values for this parameter.
     */
    CacheNodeTypeSpecificValues?: CacheNodeTypeSpecificValueList;
    /**
     * Indicates whether a change to the parameter is applied immediately or requires a reboot for the change to be applied. You can force a reboot or wait until the next maintenance window's reboot. For more information, see Rebooting a Cluster.
     */
    ChangeType?: ChangeType;
  }
  export type CacheNodeTypeSpecificParametersList = CacheNodeTypeSpecificParameter[];
  export interface CacheNodeTypeSpecificValue {
    /**
     * The cache node type for which this value applies.
     */
    CacheNodeType?: String;
    /**
     * The value for the cache node type.
     */
    Value?: String;
  }
  export type CacheNodeTypeSpecificValueList = CacheNodeTypeSpecificValue[];
  export interface CacheNodeUpdateStatus {
    /**
     * The node ID of the cache cluster
     */
    CacheNodeId?: String;
    /**
     * The update status of the node
     */
    NodeUpdateStatus?: NodeUpdateStatus;
    /**
     * The deletion date of the node
     */
    NodeDeletionDate?: TStamp;
    /**
     * The start date of the update for a node
     */
    NodeUpdateStartDate?: TStamp;
    /**
     * The end date of the update for a node
     */
    NodeUpdateEndDate?: TStamp;
    /**
     * Reflects whether the update was initiated by the customer or automatically applied
     */
    NodeUpdateInitiatedBy?: NodeUpdateInitiatedBy;
    /**
     * The date when the update is triggered
     */
    NodeUpdateInitiatedDate?: TStamp;
    /**
     * The date when the NodeUpdateStatus was last modified&gt;
     */
    NodeUpdateStatusModifiedDate?: TStamp;
  }
  export type CacheNodeUpdateStatusList = CacheNodeUpdateStatus[];
  export interface CacheParameterGroup {
    /**
     * The name of the cache parameter group.
     */
    CacheParameterGroupName?: String;
    /**
     * The name of the cache parameter group family that this cache parameter group is compatible with. Valid values are: memcached1.4 | memcached1.5 | memcached1.6 | redis2.6 | redis2.8 | redis3.2 | redis4.0 | redis5.0 | redis6.x | redis7 
     */
    CacheParameterGroupFamily?: String;
    /**
     * The description for this cache parameter group.
     */
    Description?: String;
    /**
     * Indicates whether the parameter group is associated with a Global datastore
     */
    IsGlobal?: Boolean;
    /**
     * The ARN (Amazon Resource Name) of the cache parameter group.
     */
    ARN?: String;
  }
  export interface CacheParameterGroupDetails {
    /**
     * Provides an identifier to allow retrieval of paginated results.
     */
    Marker?: String;
    /**
     * A list of Parameter instances.
     */
    Parameters?: ParametersList;
    /**
     * A list of parameters specific to a particular cache node type. Each element in the list contains detailed information about one parameter.
     */
    CacheNodeTypeSpecificParameters?: CacheNodeTypeSpecificParametersList;
  }
  export type CacheParameterGroupList = CacheParameterGroup[];
  export interface CacheParameterGroupNameMessage {
    /**
     * The name of the cache parameter group.
     */
    CacheParameterGroupName?: String;
  }
  export interface CacheParameterGroupStatus {
    /**
     * The name of the cache parameter group.
     */
    CacheParameterGroupName?: String;
    /**
     * The status of parameter updates.
     */
    ParameterApplyStatus?: String;
    /**
     * A list of the cache node IDs which need to be rebooted for parameter changes to be applied. A node ID is a numeric identifier (0001, 0002, etc.).
     */
    CacheNodeIdsToReboot?: CacheNodeIdsList;
  }
  export interface CacheParameterGroupsMessage {
    /**
     * Provides an identifier to allow retrieval of paginated results.
     */
    Marker?: String;
    /**
     * A list of cache parameter groups. Each element in the list contains detailed information about one cache parameter group.
     */
    CacheParameterGroups?: CacheParameterGroupList;
  }
  export interface CacheSecurityGroup {
    /**
     * The Amazon account ID of the cache security group owner.
     */
    OwnerId?: String;
    /**
     * The name of the cache security group.
     */
    CacheSecurityGroupName?: String;
    /**
     * The description of the cache security group.
     */
    Description?: String;
    /**
     * A list of Amazon EC2 security groups that are associated with this cache security group.
     */
    EC2SecurityGroups?: EC2SecurityGroupList;
    /**
     * The ARN of the cache security group,
     */
    ARN?: String;
  }
  export interface CacheSecurityGroupMembership {
    /**
     * The name of the cache security group.
     */
    CacheSecurityGroupName?: String;
    /**
     * The membership status in the cache security group. The status changes when a cache security group is modified, or when the cache security groups assigned to a cluster are modified.
     */
    Status?: String;
  }
  export type CacheSecurityGroupMembershipList = CacheSecurityGroupMembership[];
  export interface CacheSecurityGroupMessage {
    /**
     * Provides an identifier to allow retrieval of paginated results.
     */
    Marker?: String;
    /**
     * A list of cache security groups. Each element in the list contains detailed information about one group.
     */
    CacheSecurityGroups?: CacheSecurityGroups;
  }
  export type CacheSecurityGroupNameList = String[];
  export type CacheSecurityGroups = CacheSecurityGroup[];
  export interface CacheSubnetGroup {
    /**
     * The name of the cache subnet group.
     */
    CacheSubnetGroupName?: String;
    /**
     * The description of the cache subnet group.
     */
    CacheSubnetGroupDescription?: String;
    /**
     * The Amazon Virtual Private Cloud identifier (VPC ID) of the cache subnet group.
     */
    VpcId?: String;
    /**
     * A list of subnets associated with the cache subnet group.
     */
    Subnets?: SubnetList;
    /**
     * The ARN (Amazon Resource Name) of the cache subnet group.
     */
    ARN?: String;
    /**
     * Either ipv4 | ipv6 | dual_stack. IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the Nitro system.
     */
    SupportedNetworkTypes?: NetworkTypeList;
  }
  export interface CacheSubnetGroupMessage {
    /**
     * Provides an identifier to allow retrieval of paginated results.
     */
    Marker?: String;
    /**
     * A list of cache subnet groups. Each element in the list contains detailed information about one group.
     */
    CacheSubnetGroups?: CacheSubnetGroups;
  }
  export type CacheSubnetGroups = CacheSubnetGroup[];
  export type ChangeType = "immediate"|"requires-reboot"|string;
  export interface CloudWatchLogsDestinationDetails {
    /**
     * The name of the CloudWatch Logs log group.
     */
    LogGroup?: String;
  }
  export type ClusterIdList = String[];
  export type ClusterMode = "enabled"|"disabled"|"compatible"|string;
  export interface CompleteMigrationMessage {
    /**
     * The ID of the replication group to which data is being migrated.
     */
    ReplicationGroupId: String;
    /**
     * Forces the migration to stop without ensuring that data is in sync. It is recommended to use this option only to abort the migration and not recommended when application wants to continue migration to ElastiCache.
     */
    Force?: Boolean;
  }
  export interface CompleteMigrationResponse {
    ReplicationGroup?: ReplicationGroup;
  }
  export interface ConfigureShard {
    /**
     * The 4-digit id for the node group you are configuring. For Redis (cluster mode disabled) replication groups, the node group id is always 0001. To find a Redis (cluster mode enabled)'s node group's (shard's) id, see Finding a Shard's Id.
     */
    NodeGroupId: AllowedNodeGroupId;
    /**
     * The number of replicas you want in this node group at the end of this operation. The maximum value for NewReplicaCount is 5. The minimum value depends upon the type of Redis replication group you are working with. The minimum number of replicas in a shard or replication group is:   Redis (cluster mode disabled)   If Multi-AZ: 1   If Multi-AZ: 0     Redis (cluster mode enabled): 0 (though you will not be able to failover to a replica if your primary node fails)  
     */
    NewReplicaCount: Integer;
    /**
     * A list of PreferredAvailabilityZone strings that specify which availability zones the replication group's nodes are to be in. The nummber of PreferredAvailabilityZone values must equal the value of NewReplicaCount plus 1 to account for the primary node. If this member of ReplicaConfiguration is omitted, ElastiCache for Redis selects the availability zone for each of the replicas.
     */
    PreferredAvailabilityZones?: PreferredAvailabilityZoneList;
    /**
     * The outpost ARNs in which the cache cluster is created.
     */
    PreferredOutpostArns?: PreferredOutpostArnList;
  }
  export interface CopySnapshotMessage {
    /**
     * The name of an existing snapshot from which to make a copy.
     */
    SourceSnapshotName: String;
    /**
     * A name for the snapshot copy. ElastiCache does not permit overwriting a snapshot, therefore this name must be unique within its context - ElastiCache or an Amazon S3 bucket if exporting.
     */
    TargetSnapshotName: String;
    /**
     * The Amazon S3 bucket to which the snapshot is exported. This parameter is used only when exporting a snapshot for external access. When using this parameter to export a snapshot, be sure Amazon ElastiCache has the needed permissions to this S3 bucket. For more information, see Step 2: Grant ElastiCache Access to Your Amazon S3 Bucket in the Amazon ElastiCache User Guide. For more information, see Exporting a Snapshot in the Amazon ElastiCache User Guide.
     */
    TargetBucket?: String;
    /**
     * The ID of the KMS key used to encrypt the target snapshot.
     */
    KmsKeyId?: String;
    /**
     * A list of tags to be added to this resource. A tag is a key-value pair. A tag key must be accompanied by a tag value, although null is accepted.
     */
    Tags?: TagList;
  }
  export interface CopySnapshotResult {
    Snapshot?: Snapshot;
  }
  export interface CreateCacheClusterMessage {
    /**
     * The node group (shard) identifier. This parameter is stored as a lowercase string.  Constraints:    A name must contain from 1 to 50 alphanumeric characters or hyphens.   The first character must be a letter.   A name cannot end with a hyphen or contain two consecutive hyphens.  
     */
    CacheClusterId: String;
    /**
     * The ID of the replication group to which this cluster should belong. If this parameter is specified, the cluster is added to the specified replication group as a read replica; otherwise, the cluster is a standalone primary that is not part of any replication group. If the specified replication group is Multi-AZ enabled and the Availability Zone is not specified, the cluster is created in Availability Zones that provide the best spread of read replicas across Availability Zones.  This parameter is only valid if the Engine parameter is redis. 
     */
    ReplicationGroupId?: String;
    /**
     * Specifies whether the nodes in this Memcached cluster are created in a single Availability Zone or created across multiple Availability Zones in the cluster's region. This parameter is only supported for Memcached clusters. If the AZMode and PreferredAvailabilityZones are not specified, ElastiCache assumes single-az mode.
     */
    AZMode?: AZMode;
    /**
     * The EC2 Availability Zone in which the cluster is created. All nodes belonging to this cluster are placed in the preferred Availability Zone. If you want to create your nodes across multiple Availability Zones, use PreferredAvailabilityZones. Default: System chosen Availability Zone.
     */
    PreferredAvailabilityZone?: String;
    /**
     * A list of the Availability Zones in which cache nodes are created. The order of the zones in the list is not important. This option is only supported on Memcached.  If you are creating your cluster in an Amazon VPC (recommended) you can only locate nodes in Availability Zones that are associated with the subnets in the selected subnet group. The number of Availability Zones listed must equal the value of NumCacheNodes.  If you want all the nodes in the same Availability Zone, use PreferredAvailabilityZone instead, or repeat the Availability Zone multiple times in the list. Default: System chosen Availability Zones.
     */
    PreferredAvailabilityZones?: PreferredAvailabilityZoneList;
    /**
     * The initial number of cache nodes that the cluster has. For clusters running Redis, this value must be 1. For clusters running Memcached, this value must be between 1 and 40. If you need more than 40 nodes for your Memcached cluster, please fill out the ElastiCache Limit Increase Request form at http://aws.amazon.com/contact-us/elasticache-node-limit-request/.
     */
    NumCacheNodes?: IntegerOptional;
    /**
     * The compute and memory capacity of the nodes in the node group (shard). The following node types are supported by ElastiCache. Generally speaking, the current generation types provide more memory and computational power at lower cost when compared to their equivalent previous generation counterparts.   General purpose:   Current generation:   M6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward): cache.m6g.large, cache.m6g.xlarge, cache.m6g.2xlarge, cache.m6g.4xlarge, cache.m6g.8xlarge, cache.m6g.12xlarge, cache.m6g.16xlarge   For region availability, see Supported Node Types    M5 node types: cache.m5.large, cache.m5.xlarge, cache.m5.2xlarge, cache.m5.4xlarge, cache.m5.12xlarge, cache.m5.24xlarge   M4 node types: cache.m4.large, cache.m4.xlarge, cache.m4.2xlarge, cache.m4.4xlarge, cache.m4.10xlarge   T4g node types (available only for Redis engine version 5.0.6 onward and Memcached engine version 1.5.16 onward): cache.t4g.micro, cache.t4g.small, cache.t4g.medium   T3 node types: cache.t3.micro, cache.t3.small, cache.t3.medium   T2 node types: cache.t2.micro, cache.t2.small, cache.t2.medium    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  T1 node types: cache.t1.micro   M1 node types: cache.m1.small, cache.m1.medium, cache.m1.large, cache.m1.xlarge   M3 node types: cache.m3.medium, cache.m3.large, cache.m3.xlarge, cache.m3.2xlarge      Compute optimized:   Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  C1 node types: cache.c1.xlarge      Memory optimized:   Current generation:   R6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward).  cache.r6g.large, cache.r6g.xlarge, cache.r6g.2xlarge, cache.r6g.4xlarge, cache.r6g.8xlarge, cache.r6g.12xlarge, cache.r6g.16xlarge   For region availability, see Supported Node Types    R5 node types: cache.r5.large, cache.r5.xlarge, cache.r5.2xlarge, cache.r5.4xlarge, cache.r5.12xlarge, cache.r5.24xlarge   R4 node types: cache.r4.large, cache.r4.xlarge, cache.r4.2xlarge, cache.r4.4xlarge, cache.r4.8xlarge, cache.r4.16xlarge    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  M2 node types: cache.m2.xlarge, cache.m2.2xlarge, cache.m2.4xlarge   R3 node types: cache.r3.large, cache.r3.xlarge, cache.r3.2xlarge, cache.r3.4xlarge, cache.r3.8xlarge       Additional node type info    All current generation instance types are created in Amazon VPC by default.   Redis append-only files (AOF) are not supported for T1 or T2 instances.   Redis Multi-AZ with automatic failover is not supported on T1 instances.   Redis configuration variables appendonly and appendfsync are not supported on Redis version 2.8.22 and later.  
     */
    CacheNodeType?: String;
    /**
     * The name of the cache engine to be used for this cluster. Valid values for this parameter are: memcached | redis 
     */
    Engine?: String;
    /**
     * The version number of the cache engine to be used for this cluster. To view the supported cache engine versions, use the DescribeCacheEngineVersions operation.  Important: You can upgrade to a newer engine version (see Selecting a Cache Engine and Version), but you cannot downgrade to an earlier engine version. If you want to use an earlier engine version, you must delete the existing cluster or replication group and create it anew with the earlier engine version. 
     */
    EngineVersion?: String;
    /**
     * The name of the parameter group to associate with this cluster. If this argument is omitted, the default parameter group for the specified engine is used. You cannot use any parameter group which has cluster-enabled='yes' when creating a cluster.
     */
    CacheParameterGroupName?: String;
    /**
     * The name of the subnet group to be used for the cluster. Use this parameter only when you are creating a cluster in an Amazon Virtual Private Cloud (Amazon VPC).  If you're going to launch your cluster in an Amazon VPC, you need to create a subnet group before you start creating a cluster. For more information, see Subnets and Subnet Groups. 
     */
    CacheSubnetGroupName?: String;
    /**
     * A list of security group names to associate with this cluster. Use this parameter only when you are creating a cluster outside of an Amazon Virtual Private Cloud (Amazon VPC).
     */
    CacheSecurityGroupNames?: CacheSecurityGroupNameList;
    /**
     * One or more VPC security groups associated with the cluster. Use this parameter only when you are creating a cluster in an Amazon Virtual Private Cloud (Amazon VPC).
     */
    SecurityGroupIds?: SecurityGroupIdsList;
    /**
     * A list of tags to be added to this resource.
     */
    Tags?: TagList;
    /**
     * A single-element string list containing an Amazon Resource Name (ARN) that uniquely identifies a Redis RDB snapshot file stored in Amazon S3. The snapshot file is used to populate the node group (shard). The Amazon S3 object name in the ARN cannot contain any commas.  This parameter is only valid if the Engine parameter is redis.  Example of an Amazon S3 ARN: arn:aws:s3:::my_bucket/snapshot1.rdb 
     */
    SnapshotArns?: SnapshotArnsList;
    /**
     * The name of a Redis snapshot from which to restore data into the new node group (shard). The snapshot status changes to restoring while the new node group (shard) is being created.  This parameter is only valid if the Engine parameter is redis. 
     */
    SnapshotName?: String;
    /**
     * Specifies the weekly time range during which maintenance on the cluster is performed. It is specified as a range in the format ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC). The minimum maintenance window is a 60 minute period. 
     */
    PreferredMaintenanceWindow?: String;
    /**
     * The port number on which each of the cache nodes accepts connections.
     */
    Port?: IntegerOptional;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Simple Notification Service (SNS) topic to which notifications are sent.  The Amazon SNS topic owner must be the same as the cluster owner. 
     */
    NotificationTopicArn?: String;
    /**
     *  If you are running Redis engine version 6.0 or later, set this parameter to yes if you want to opt-in to the next auto minor version upgrade campaign. This parameter is disabled for previous versions.  
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
    /**
     * The number of days for which ElastiCache retains automatic snapshots before deleting them. For example, if you set SnapshotRetentionLimit to 5, a snapshot taken today is retained for 5 days before being deleted.  This parameter is only valid if the Engine parameter is redis.  Default: 0 (i.e., automatic backups are disabled for this cache cluster).
     */
    SnapshotRetentionLimit?: IntegerOptional;
    /**
     * The daily time range (in UTC) during which ElastiCache begins taking a daily snapshot of your node group (shard). Example: 05:00-09:00  If you do not specify this parameter, ElastiCache automatically chooses an appropriate time range.  This parameter is only valid if the Engine parameter is redis. 
     */
    SnapshotWindow?: String;
    /**
     *  Reserved parameter. The password used to access a password protected server. Password constraints:   Must be only printable ASCII characters.   Must be at least 16 characters and no more than 128 characters in length.   The only permitted printable special characters are !, &amp;, #, $, ^, &lt;, &gt;, and -. Other printable special characters cannot be used in the AUTH token.   For more information, see AUTH password at http://redis.io/commands/AUTH.
     */
    AuthToken?: String;
    /**
     * Specifies whether the nodes in the cluster are created in a single outpost or across multiple outposts.
     */
    OutpostMode?: OutpostMode;
    /**
     * The outpost ARN in which the cache cluster is created.
     */
    PreferredOutpostArn?: String;
    /**
     * The outpost ARNs in which the cache cluster is created.
     */
    PreferredOutpostArns?: PreferredOutpostArnList;
    /**
     * Specifies the destination, format and type of the logs. 
     */
    LogDeliveryConfigurations?: LogDeliveryConfigurationRequestList;
    /**
     * A flag that enables in-transit encryption when set to true.
     */
    TransitEncryptionEnabled?: BooleanOptional;
    /**
     * Must be either ipv4 | ipv6 | dual_stack. IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the Nitro system. 
     */
    NetworkType?: NetworkType;
    /**
     * The network type you choose when modifying a cluster, either ipv4 | ipv6. IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the Nitro system.
     */
    IpDiscovery?: IpDiscovery;
  }
  export interface CreateCacheClusterResult {
    CacheCluster?: CacheCluster;
  }
  export interface CreateCacheParameterGroupMessage {
    /**
     * A user-specified name for the cache parameter group.
     */
    CacheParameterGroupName: String;
    /**
     * The name of the cache parameter group family that the cache parameter group can be used with. Valid values are: memcached1.4 | memcached1.5 | memcached1.6 | redis2.6 | redis2.8 | redis3.2 | redis4.0 | redis5.0 | redis6.x | redis7 
     */
    CacheParameterGroupFamily: String;
    /**
     * A user-specified description for the cache parameter group.
     */
    Description: String;
    /**
     * A list of tags to be added to this resource. A tag is a key-value pair. A tag key must be accompanied by a tag value, although null is accepted.
     */
    Tags?: TagList;
  }
  export interface CreateCacheParameterGroupResult {
    CacheParameterGroup?: CacheParameterGroup;
  }
  export interface CreateCacheSecurityGroupMessage {
    /**
     * A name for the cache security group. This value is stored as a lowercase string. Constraints: Must contain no more than 255 alphanumeric characters. Cannot be the word "Default". Example: mysecuritygroup 
     */
    CacheSecurityGroupName: String;
    /**
     * A description for the cache security group.
     */
    Description: String;
    /**
     * A list of tags to be added to this resource. A tag is a key-value pair. A tag key must be accompanied by a tag value, although null is accepted.
     */
    Tags?: TagList;
  }
  export interface CreateCacheSecurityGroupResult {
    CacheSecurityGroup?: CacheSecurityGroup;
  }
  export interface CreateCacheSubnetGroupMessage {
    /**
     * A name for the cache subnet group. This value is stored as a lowercase string. Constraints: Must contain no more than 255 alphanumeric characters or hyphens. Example: mysubnetgroup 
     */
    CacheSubnetGroupName: String;
    /**
     * A description for the cache subnet group.
     */
    CacheSubnetGroupDescription: String;
    /**
     * A list of VPC subnet IDs for the cache subnet group.
     */
    SubnetIds: SubnetIdentifierList;
    /**
     * A list of tags to be added to this resource. A tag is a key-value pair. A tag key must be accompanied by a tag value, although null is accepted.
     */
    Tags?: TagList;
  }
  export interface CreateCacheSubnetGroupResult {
    CacheSubnetGroup?: CacheSubnetGroup;
  }
  export interface CreateGlobalReplicationGroupMessage {
    /**
     * The suffix name of a Global datastore. Amazon ElastiCache automatically applies a prefix to the Global datastore ID when it is created. Each Amazon Region has its own prefix. For instance, a Global datastore ID created in the US-West-1 region will begin with "dsdfu" along with the suffix name you provide. The suffix, combined with the auto-generated prefix, guarantees uniqueness of the Global datastore name across multiple regions.  For a full list of Amazon Regions and their respective Global datastore iD prefixes, see Using the Amazon CLI with Global datastores .
     */
    GlobalReplicationGroupIdSuffix: String;
    /**
     * Provides details of the Global datastore
     */
    GlobalReplicationGroupDescription?: String;
    /**
     * The name of the primary cluster that accepts writes and will replicate updates to the secondary cluster.
     */
    PrimaryReplicationGroupId: String;
  }
  export interface CreateGlobalReplicationGroupResult {
    GlobalReplicationGroup?: GlobalReplicationGroup;
  }
  export interface CreateReplicationGroupMessage {
    /**
     * The replication group identifier. This parameter is stored as a lowercase string. Constraints:   A name must contain from 1 to 40 alphanumeric characters or hyphens.   The first character must be a letter.   A name cannot end with a hyphen or contain two consecutive hyphens.  
     */
    ReplicationGroupId: String;
    /**
     * A user-created description for the replication group.
     */
    ReplicationGroupDescription: String;
    /**
     * The name of the Global datastore
     */
    GlobalReplicationGroupId?: String;
    /**
     * The identifier of the cluster that serves as the primary for this replication group. This cluster must already exist and have a status of available. This parameter is not required if NumCacheClusters, NumNodeGroups, or ReplicasPerNodeGroup is specified.
     */
    PrimaryClusterId?: String;
    /**
     * Specifies whether a read-only replica is automatically promoted to read/write primary if the existing primary fails.  AutomaticFailoverEnabled must be enabled for Redis (cluster mode enabled) replication groups. Default: false
     */
    AutomaticFailoverEnabled?: BooleanOptional;
    /**
     * A flag indicating if you have Multi-AZ enabled to enhance fault tolerance. For more information, see Minimizing Downtime: Multi-AZ.
     */
    MultiAZEnabled?: BooleanOptional;
    /**
     * The number of clusters this replication group initially has. This parameter is not used if there is more than one node group (shard). You should use ReplicasPerNodeGroup instead. If AutomaticFailoverEnabled is true, the value of this parameter must be at least 2. If AutomaticFailoverEnabled is false you can omit this parameter (it will default to 1), or you can explicitly set it to a value between 2 and 6. The maximum permitted value for NumCacheClusters is 6 (1 primary plus 5 replicas).
     */
    NumCacheClusters?: IntegerOptional;
    /**
     * A list of EC2 Availability Zones in which the replication group's clusters are created. The order of the Availability Zones in the list is the order in which clusters are allocated. The primary cluster is created in the first AZ in the list. This parameter is not used if there is more than one node group (shard). You should use NodeGroupConfiguration instead.  If you are creating your replication group in an Amazon VPC (recommended), you can only locate clusters in Availability Zones associated with the subnets in the selected subnet group. The number of Availability Zones listed must equal the value of NumCacheClusters.  Default: system chosen Availability Zones.
     */
    PreferredCacheClusterAZs?: AvailabilityZonesList;
    /**
     * An optional parameter that specifies the number of node groups (shards) for this Redis (cluster mode enabled) replication group. For Redis (cluster mode disabled) either omit this parameter or set it to 1. Default: 1
     */
    NumNodeGroups?: IntegerOptional;
    /**
     * An optional parameter that specifies the number of replica nodes in each node group (shard). Valid values are 0 to 5.
     */
    ReplicasPerNodeGroup?: IntegerOptional;
    /**
     * A list of node group (shard) configuration options. Each node group (shard) configuration has the following members: PrimaryAvailabilityZone, ReplicaAvailabilityZones, ReplicaCount, and Slots. If you're creating a Redis (cluster mode disabled) or a Redis (cluster mode enabled) replication group, you can use this parameter to individually configure each node group (shard), or you can omit this parameter. However, it is required when seeding a Redis (cluster mode enabled) cluster from a S3 rdb file. You must configure each node group (shard) using this parameter because you must specify the slots for each node group.
     */
    NodeGroupConfiguration?: NodeGroupConfigurationList;
    /**
     * The compute and memory capacity of the nodes in the node group (shard). The following node types are supported by ElastiCache. Generally speaking, the current generation types provide more memory and computational power at lower cost when compared to their equivalent previous generation counterparts.   General purpose:   Current generation:   M6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward): cache.m6g.large, cache.m6g.xlarge, cache.m6g.2xlarge, cache.m6g.4xlarge, cache.m6g.8xlarge, cache.m6g.12xlarge, cache.m6g.16xlarge   For region availability, see Supported Node Types    M5 node types: cache.m5.large, cache.m5.xlarge, cache.m5.2xlarge, cache.m5.4xlarge, cache.m5.12xlarge, cache.m5.24xlarge   M4 node types: cache.m4.large, cache.m4.xlarge, cache.m4.2xlarge, cache.m4.4xlarge, cache.m4.10xlarge   T4g node types (available only for Redis engine version 5.0.6 onward and Memcached engine version 1.5.16 onward): cache.t4g.micro, cache.t4g.small, cache.t4g.medium   T3 node types: cache.t3.micro, cache.t3.small, cache.t3.medium   T2 node types: cache.t2.micro, cache.t2.small, cache.t2.medium    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  T1 node types: cache.t1.micro   M1 node types: cache.m1.small, cache.m1.medium, cache.m1.large, cache.m1.xlarge   M3 node types: cache.m3.medium, cache.m3.large, cache.m3.xlarge, cache.m3.2xlarge      Compute optimized:   Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  C1 node types: cache.c1.xlarge      Memory optimized:   Current generation:   R6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward).  cache.r6g.large, cache.r6g.xlarge, cache.r6g.2xlarge, cache.r6g.4xlarge, cache.r6g.8xlarge, cache.r6g.12xlarge, cache.r6g.16xlarge   For region availability, see Supported Node Types    R5 node types: cache.r5.large, cache.r5.xlarge, cache.r5.2xlarge, cache.r5.4xlarge, cache.r5.12xlarge, cache.r5.24xlarge   R4 node types: cache.r4.large, cache.r4.xlarge, cache.r4.2xlarge, cache.r4.4xlarge, cache.r4.8xlarge, cache.r4.16xlarge    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  M2 node types: cache.m2.xlarge, cache.m2.2xlarge, cache.m2.4xlarge   R3 node types: cache.r3.large, cache.r3.xlarge, cache.r3.2xlarge, cache.r3.4xlarge, cache.r3.8xlarge       Additional node type info    All current generation instance types are created in Amazon VPC by default.   Redis append-only files (AOF) are not supported for T1 or T2 instances.   Redis Multi-AZ with automatic failover is not supported on T1 instances.   Redis configuration variables appendonly and appendfsync are not supported on Redis version 2.8.22 and later.  
     */
    CacheNodeType?: String;
    /**
     * The name of the cache engine to be used for the clusters in this replication group. The value must be set to Redis.
     */
    Engine?: String;
    /**
     * The version number of the cache engine to be used for the clusters in this replication group. To view the supported cache engine versions, use the DescribeCacheEngineVersions operation.  Important: You can upgrade to a newer engine version (see Selecting a Cache Engine and Version) in the ElastiCache User Guide, but you cannot downgrade to an earlier engine version. If you want to use an earlier engine version, you must delete the existing cluster or replication group and create it anew with the earlier engine version. 
     */
    EngineVersion?: String;
    /**
     * The name of the parameter group to associate with this replication group. If this argument is omitted, the default cache parameter group for the specified engine is used. If you are running Redis version 3.2.4 or later, only one node group (shard), and want to use a default parameter group, we recommend that you specify the parameter group by name.    To create a Redis (cluster mode disabled) replication group, use CacheParameterGroupName=default.redis3.2.   To create a Redis (cluster mode enabled) replication group, use CacheParameterGroupName=default.redis3.2.cluster.on.  
     */
    CacheParameterGroupName?: String;
    /**
     * The name of the cache subnet group to be used for the replication group.  If you're going to launch your cluster in an Amazon VPC, you need to create a subnet group before you start creating a cluster. For more information, see Subnets and Subnet Groups. 
     */
    CacheSubnetGroupName?: String;
    /**
     * A list of cache security group names to associate with this replication group.
     */
    CacheSecurityGroupNames?: CacheSecurityGroupNameList;
    /**
     * One or more Amazon VPC security groups associated with this replication group. Use this parameter only when you are creating a replication group in an Amazon Virtual Private Cloud (Amazon VPC).
     */
    SecurityGroupIds?: SecurityGroupIdsList;
    /**
     * A list of tags to be added to this resource. Tags are comma-separated key,value pairs (e.g. Key=myKey, Value=myKeyValue. You can include multiple tags as shown following: Key=myKey, Value=myKeyValue Key=mySecondKey, Value=mySecondKeyValue. Tags on replication groups will be replicated to all nodes.
     */
    Tags?: TagList;
    /**
     * A list of Amazon Resource Names (ARN) that uniquely identify the Redis RDB snapshot files stored in Amazon S3. The snapshot files are used to populate the new replication group. The Amazon S3 object name in the ARN cannot contain any commas. The new replication group will have the number of node groups (console: shards) specified by the parameter NumNodeGroups or the number of node groups configured by NodeGroupConfiguration regardless of the number of ARNs specified here. Example of an Amazon S3 ARN: arn:aws:s3:::my_bucket/snapshot1.rdb 
     */
    SnapshotArns?: SnapshotArnsList;
    /**
     * The name of a snapshot from which to restore data into the new replication group. The snapshot status changes to restoring while the new replication group is being created.
     */
    SnapshotName?: String;
    /**
     * Specifies the weekly time range during which maintenance on the cluster is performed. It is specified as a range in the format ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC). The minimum maintenance window is a 60 minute period. Valid values for ddd are: Specifies the weekly time range during which maintenance on the cluster is performed. It is specified as a range in the format ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC). The minimum maintenance window is a 60 minute period. Valid values for ddd are:    sun     mon     tue     wed     thu     fri     sat    Example: sun:23:00-mon:01:30 
     */
    PreferredMaintenanceWindow?: String;
    /**
     * The port number on which each member of the replication group accepts connections.
     */
    Port?: IntegerOptional;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Simple Notification Service (SNS) topic to which notifications are sent.  The Amazon SNS topic owner must be the same as the cluster owner. 
     */
    NotificationTopicArn?: String;
    /**
     *  If you are running Redis engine version 6.0 or later, set this parameter to yes if you want to opt-in to the next auto minor version upgrade campaign. This parameter is disabled for previous versions.  
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
    /**
     * The number of days for which ElastiCache retains automatic snapshots before deleting them. For example, if you set SnapshotRetentionLimit to 5, a snapshot that was taken today is retained for 5 days before being deleted. Default: 0 (i.e., automatic backups are disabled for this cluster).
     */
    SnapshotRetentionLimit?: IntegerOptional;
    /**
     * The daily time range (in UTC) during which ElastiCache begins taking a daily snapshot of your node group (shard). Example: 05:00-09:00  If you do not specify this parameter, ElastiCache automatically chooses an appropriate time range.
     */
    SnapshotWindow?: String;
    /**
     *  Reserved parameter. The password used to access a password protected server.  AuthToken can be specified only on replication groups where TransitEncryptionEnabled is true.  For HIPAA compliance, you must specify TransitEncryptionEnabled as true, an AuthToken, and a CacheSubnetGroup.  Password constraints:   Must be only printable ASCII characters.   Must be at least 16 characters and no more than 128 characters in length.   The only permitted printable special characters are !, &amp;, #, $, ^, &lt;, &gt;, and -. Other printable special characters cannot be used in the AUTH token.   For more information, see AUTH password at http://redis.io/commands/AUTH.
     */
    AuthToken?: String;
    /**
     * A flag that enables in-transit encryption when set to true. This parameter is valid only if the Engine parameter is redis, the EngineVersion parameter is 3.2.6, 4.x or later, and the cluster is being created in an Amazon VPC. If you enable in-transit encryption, you must also specify a value for CacheSubnetGroup.  Required: Only available when creating a replication group in an Amazon VPC using redis version 3.2.6, 4.x or later. Default: false   For HIPAA compliance, you must specify TransitEncryptionEnabled as true, an AuthToken, and a CacheSubnetGroup. 
     */
    TransitEncryptionEnabled?: BooleanOptional;
    /**
     * A flag that enables encryption at rest when set to true. You cannot modify the value of AtRestEncryptionEnabled after the replication group is created. To enable encryption at rest on a replication group you must set AtRestEncryptionEnabled to true when you create the replication group.   Required: Only available when creating a replication group in an Amazon VPC using redis version 3.2.6, 4.x or later. Default: false 
     */
    AtRestEncryptionEnabled?: BooleanOptional;
    /**
     * The ID of the KMS key used to encrypt the disk in the cluster.
     */
    KmsKeyId?: String;
    /**
     * The user group to associate with the replication group.
     */
    UserGroupIds?: UserGroupIdListInput;
    /**
     * Specifies the destination, format and type of the logs.
     */
    LogDeliveryConfigurations?: LogDeliveryConfigurationRequestList;
    /**
     * Enables data tiering. Data tiering is only supported for replication groups using the r6gd node type. This parameter must be set to true when using r6gd nodes. For more information, see Data tiering.
     */
    DataTieringEnabled?: BooleanOptional;
    /**
     * Must be either ipv4 | ipv6 | dual_stack. IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the Nitro system.
     */
    NetworkType?: NetworkType;
    /**
     * The network type you choose when creating a replication group, either ipv4 | ipv6. IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the Nitro system.
     */
    IpDiscovery?: IpDiscovery;
    /**
     * A setting that allows you to migrate your clients to use in-transit encryption, with no downtime. When setting TransitEncryptionEnabled to true, you can set your TransitEncryptionMode to preferred in the same request, to allow both encrypted and unencrypted connections at the same time. Once you migrate all your Redis clients to use encrypted connections you can modify the value to required to allow encrypted connections only. Setting TransitEncryptionMode to required is a two-step process that requires you to first set the TransitEncryptionMode to preferred, after that you can set TransitEncryptionMode to required. This process will not trigger the replacement of the replication group.
     */
    TransitEncryptionMode?: TransitEncryptionMode;
    /**
     * Enabled or Disabled. To modify cluster mode from Disabled to Enabled, you must first set the cluster mode to Compatible. Compatible mode allows your Redis clients to connect using both cluster mode enabled and cluster mode disabled. After you migrate all Redis clients to use cluster mode enabled, you can then complete cluster mode configuration and set the cluster mode to Enabled.
     */
    ClusterMode?: ClusterMode;
  }
  export interface CreateReplicationGroupResult {
    ReplicationGroup?: ReplicationGroup;
  }
  export interface CreateSnapshotMessage {
    /**
     * The identifier of an existing replication group. The snapshot is created from this replication group.
     */
    ReplicationGroupId?: String;
    /**
     * The identifier of an existing cluster. The snapshot is created from this cluster.
     */
    CacheClusterId?: String;
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
  export interface CreateSnapshotResult {
    Snapshot?: Snapshot;
  }
  export interface CreateUserGroupMessage {
    /**
     * The ID of the user group.
     */
    UserGroupId: String;
    /**
     * The current supported value is Redis. 
     */
    Engine: EngineType;
    /**
     * The list of user IDs that belong to the user group.
     */
    UserIds?: UserIdListInput;
    /**
     * A list of tags to be added to this resource. A tag is a key-value pair. A tag key must be accompanied by a tag value, although null is accepted.
     */
    Tags?: TagList;
  }
  export interface CreateUserMessage {
    /**
     * The ID of the user.
     */
    UserId: UserId;
    /**
     * The username of the user.
     */
    UserName: UserName;
    /**
     * The current supported value is Redis. 
     */
    Engine: EngineType;
    /**
     * Passwords used for this user. You can create up to two passwords for each user.
     */
    Passwords?: PasswordListInput;
    /**
     * Access permissions string used for this user.
     */
    AccessString: AccessString;
    /**
     * Indicates a password is not required for this user.
     */
    NoPasswordRequired?: BooleanOptional;
    /**
     * A list of tags to be added to this resource. A tag is a key-value pair. A tag key must be accompanied by a tag value, although null is accepted.
     */
    Tags?: TagList;
    /**
     * Specifies how to authenticate the user.
     */
    AuthenticationMode?: AuthenticationMode;
  }
  export interface CustomerNodeEndpoint {
    /**
     * The address of the node endpoint
     */
    Address?: String;
    /**
     * The port of the node endpoint
     */
    Port?: IntegerOptional;
  }
  export type CustomerNodeEndpointList = CustomerNodeEndpoint[];
  export type DataTieringStatus = "enabled"|"disabled"|string;
  export interface DecreaseNodeGroupsInGlobalReplicationGroupMessage {
    /**
     * The name of the Global datastore
     */
    GlobalReplicationGroupId: String;
    /**
     * The number of node groups (shards) that results from the modification of the shard configuration
     */
    NodeGroupCount: Integer;
    /**
     * If the value of NodeGroupCount is less than the current number of node groups (shards), then either NodeGroupsToRemove or NodeGroupsToRetain is required. GlobalNodeGroupsToRemove is a list of NodeGroupIds to remove from the cluster. ElastiCache for Redis will attempt to remove all node groups listed by GlobalNodeGroupsToRemove from the cluster. 
     */
    GlobalNodeGroupsToRemove?: GlobalNodeGroupIdList;
    /**
     * If the value of NodeGroupCount is less than the current number of node groups (shards), then either NodeGroupsToRemove or NodeGroupsToRetain is required. GlobalNodeGroupsToRetain is a list of NodeGroupIds to retain from the cluster. ElastiCache for Redis will attempt to retain all node groups listed by GlobalNodeGroupsToRetain from the cluster. 
     */
    GlobalNodeGroupsToRetain?: GlobalNodeGroupIdList;
    /**
     * Indicates that the shard reconfiguration process begins immediately. At present, the only permitted value for this parameter is true. 
     */
    ApplyImmediately: Boolean;
  }
  export interface DecreaseNodeGroupsInGlobalReplicationGroupResult {
    GlobalReplicationGroup?: GlobalReplicationGroup;
  }
  export interface DecreaseReplicaCountMessage {
    /**
     * The id of the replication group from which you want to remove replica nodes.
     */
    ReplicationGroupId: String;
    /**
     * The number of read replica nodes you want at the completion of this operation. For Redis (cluster mode disabled) replication groups, this is the number of replica nodes in the replication group. For Redis (cluster mode enabled) replication groups, this is the number of replica nodes in each of the replication group's node groups. The minimum number of replicas in a shard or replication group is:   Redis (cluster mode disabled)   If Multi-AZ is enabled: 1   If Multi-AZ is not enabled: 0     Redis (cluster mode enabled): 0 (though you will not be able to failover to a replica if your primary node fails)  
     */
    NewReplicaCount?: IntegerOptional;
    /**
     * A list of ConfigureShard objects that can be used to configure each shard in a Redis (cluster mode enabled) replication group. The ConfigureShard has three members: NewReplicaCount, NodeGroupId, and PreferredAvailabilityZones.
     */
    ReplicaConfiguration?: ReplicaConfigurationList;
    /**
     * A list of the node ids to remove from the replication group or node group (shard).
     */
    ReplicasToRemove?: RemoveReplicasList;
    /**
     * If True, the number of replica nodes is decreased immediately. ApplyImmediately=False is not currently supported.
     */
    ApplyImmediately: Boolean;
  }
  export interface DecreaseReplicaCountResult {
    ReplicationGroup?: ReplicationGroup;
  }
  export interface DeleteCacheClusterMessage {
    /**
     * The cluster identifier for the cluster to be deleted. This parameter is not case sensitive.
     */
    CacheClusterId: String;
    /**
     * The user-supplied name of a final cluster snapshot. This is the unique name that identifies the snapshot. ElastiCache creates the snapshot, and then deletes the cluster immediately afterward.
     */
    FinalSnapshotIdentifier?: String;
  }
  export interface DeleteCacheClusterResult {
    CacheCluster?: CacheCluster;
  }
  export interface DeleteCacheParameterGroupMessage {
    /**
     * The name of the cache parameter group to delete.  The specified cache security group must not be associated with any clusters. 
     */
    CacheParameterGroupName: String;
  }
  export interface DeleteCacheSecurityGroupMessage {
    /**
     * The name of the cache security group to delete.  You cannot delete the default security group. 
     */
    CacheSecurityGroupName: String;
  }
  export interface DeleteCacheSubnetGroupMessage {
    /**
     * The name of the cache subnet group to delete. Constraints: Must contain no more than 255 alphanumeric characters or hyphens.
     */
    CacheSubnetGroupName: String;
  }
  export interface DeleteGlobalReplicationGroupMessage {
    /**
     * The name of the Global datastore
     */
    GlobalReplicationGroupId: String;
    /**
     * The primary replication group is retained as a standalone replication group. 
     */
    RetainPrimaryReplicationGroup: Boolean;
  }
  export interface DeleteGlobalReplicationGroupResult {
    GlobalReplicationGroup?: GlobalReplicationGroup;
  }
  export interface DeleteReplicationGroupMessage {
    /**
     * The identifier for the cluster to be deleted. This parameter is not case sensitive.
     */
    ReplicationGroupId: String;
    /**
     * If set to true, all of the read replicas are deleted, but the primary node is retained.
     */
    RetainPrimaryCluster?: BooleanOptional;
    /**
     * The name of a final node group (shard) snapshot. ElastiCache creates the snapshot from the primary node in the cluster, rather than one of the replicas; this is to ensure that it captures the freshest data. After the final snapshot is taken, the replication group is immediately deleted.
     */
    FinalSnapshotIdentifier?: String;
  }
  export interface DeleteReplicationGroupResult {
    ReplicationGroup?: ReplicationGroup;
  }
  export interface DeleteSnapshotMessage {
    /**
     * The name of the snapshot to be deleted.
     */
    SnapshotName: String;
  }
  export interface DeleteSnapshotResult {
    Snapshot?: Snapshot;
  }
  export interface DeleteUserGroupMessage {
    /**
     * The ID of the user group.
     */
    UserGroupId: String;
  }
  export interface DeleteUserMessage {
    /**
     * The ID of the user.
     */
    UserId: UserId;
  }
  export interface DescribeCacheClustersMessage {
    /**
     * The user-supplied cluster identifier. If this parameter is specified, only information about that specific cluster is returned. This parameter isn't case sensitive.
     */
    CacheClusterId?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: minimum 20; maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * An optional flag that can be included in the DescribeCacheCluster request to retrieve information about the individual cache nodes.
     */
    ShowCacheNodeInfo?: BooleanOptional;
    /**
     * An optional flag that can be included in the DescribeCacheCluster request to show only nodes (API/CLI: clusters) that are not members of a replication group. In practice, this mean Memcached and single node Redis clusters.
     */
    ShowCacheClustersNotInReplicationGroups?: BooleanOptional;
  }
  export interface DescribeCacheEngineVersionsMessage {
    /**
     * The cache engine to return. Valid values: memcached | redis 
     */
    Engine?: String;
    /**
     * The cache engine version to return. Example: 1.4.14 
     */
    EngineVersion?: String;
    /**
     * The name of a specific cache parameter group family to return details for. Valid values are: memcached1.4 | memcached1.5 | memcached1.6 | redis2.6 | redis2.8 | redis3.2 | redis4.0 | redis5.0 | redis6.x | redis6.2 | redis7  Constraints:   Must be 1 to 255 alphanumeric characters   First character must be a letter   Cannot end with a hyphen or contain two consecutive hyphens  
     */
    CacheParameterGroupFamily?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: minimum 20; maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * If true, specifies that only the default version of the specified engine or engine and major version combination is to be returned.
     */
    DefaultOnly?: Boolean;
  }
  export interface DescribeCacheParameterGroupsMessage {
    /**
     * The name of a specific cache parameter group to return details for.
     */
    CacheParameterGroupName?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: minimum 20; maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeCacheParametersMessage {
    /**
     * The name of a specific cache parameter group to return details for.
     */
    CacheParameterGroupName: String;
    /**
     * The parameter types to return. Valid values: user | system | engine-default 
     */
    Source?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: minimum 20; maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeCacheSecurityGroupsMessage {
    /**
     * The name of the cache security group to return details for.
     */
    CacheSecurityGroupName?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: minimum 20; maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeCacheSubnetGroupsMessage {
    /**
     * The name of the cache subnet group to return details for.
     */
    CacheSubnetGroupName?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: minimum 20; maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeEngineDefaultParametersMessage {
    /**
     * The name of the cache parameter group family. Valid values are: memcached1.4 | memcached1.5 | memcached1.6 | redis2.6 | redis2.8 | redis3.2 | redis4.0 | redis5.0 | redis6.x | redis6.2 | redis7 
     */
    CacheParameterGroupFamily: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: minimum 20; maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeEngineDefaultParametersResult {
    EngineDefaults?: EngineDefaults;
  }
  export interface DescribeEventsMessage {
    /**
     * The identifier of the event source for which events are returned. If not specified, all sources are included in the response.
     */
    SourceIdentifier?: String;
    /**
     * The event source to retrieve events for. If no value is specified, all events are returned.
     */
    SourceType?: SourceType;
    /**
     * The beginning of the time interval to retrieve events for, specified in ISO 8601 format.  Example: 2017-03-30T07:03:49.555Z
     */
    StartTime?: TStamp;
    /**
     * The end of the time interval for which to retrieve events, specified in ISO 8601 format.  Example: 2017-03-30T07:03:49.555Z
     */
    EndTime?: TStamp;
    /**
     * The number of minutes worth of events to retrieve.
     */
    Duration?: IntegerOptional;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: minimum 20; maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeGlobalReplicationGroupsMessage {
    /**
     * The name of the Global datastore
     */
    GlobalReplicationGroupId?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a marker is included in the response so that the remaining results can be retrieved. 
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords. 
     */
    Marker?: String;
    /**
     * Returns the list of members that comprise the Global datastore.
     */
    ShowMemberInfo?: BooleanOptional;
  }
  export interface DescribeGlobalReplicationGroupsResult {
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords. &gt;
     */
    Marker?: String;
    /**
     * Indicates the slot configuration and global identifier for each slice group.
     */
    GlobalReplicationGroups?: GlobalReplicationGroupList;
  }
  export interface DescribeReplicationGroupsMessage {
    /**
     * The identifier for the replication group to be described. This parameter is not case sensitive. If you do not specify this parameter, information about all replication groups is returned.
     */
    ReplicationGroupId?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: minimum 20; maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeReservedCacheNodesMessage {
    /**
     * The reserved cache node identifier filter value. Use this parameter to show only the reservation that matches the specified reservation ID.
     */
    ReservedCacheNodeId?: String;
    /**
     * The offering identifier filter value. Use this parameter to show only purchased reservations matching the specified offering identifier.
     */
    ReservedCacheNodesOfferingId?: String;
    /**
     * The cache node type filter value. Use this parameter to show only those reservations matching the specified cache node type. The following node types are supported by ElastiCache. Generally speaking, the current generation types provide more memory and computational power at lower cost when compared to their equivalent previous generation counterparts.   General purpose:   Current generation:   M6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward): cache.m6g.large, cache.m6g.xlarge, cache.m6g.2xlarge, cache.m6g.4xlarge, cache.m6g.8xlarge, cache.m6g.12xlarge, cache.m6g.16xlarge   For region availability, see Supported Node Types    M5 node types: cache.m5.large, cache.m5.xlarge, cache.m5.2xlarge, cache.m5.4xlarge, cache.m5.12xlarge, cache.m5.24xlarge   M4 node types: cache.m4.large, cache.m4.xlarge, cache.m4.2xlarge, cache.m4.4xlarge, cache.m4.10xlarge   T4g node types (available only for Redis engine version 5.0.6 onward and Memcached engine version 1.5.16 onward): cache.t4g.micro, cache.t4g.small, cache.t4g.medium   T3 node types: cache.t3.micro, cache.t3.small, cache.t3.medium   T2 node types: cache.t2.micro, cache.t2.small, cache.t2.medium    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  T1 node types: cache.t1.micro   M1 node types: cache.m1.small, cache.m1.medium, cache.m1.large, cache.m1.xlarge   M3 node types: cache.m3.medium, cache.m3.large, cache.m3.xlarge, cache.m3.2xlarge      Compute optimized:   Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  C1 node types: cache.c1.xlarge      Memory optimized:   Current generation:   R6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward).  cache.r6g.large, cache.r6g.xlarge, cache.r6g.2xlarge, cache.r6g.4xlarge, cache.r6g.8xlarge, cache.r6g.12xlarge, cache.r6g.16xlarge   For region availability, see Supported Node Types    R5 node types: cache.r5.large, cache.r5.xlarge, cache.r5.2xlarge, cache.r5.4xlarge, cache.r5.12xlarge, cache.r5.24xlarge   R4 node types: cache.r4.large, cache.r4.xlarge, cache.r4.2xlarge, cache.r4.4xlarge, cache.r4.8xlarge, cache.r4.16xlarge    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  M2 node types: cache.m2.xlarge, cache.m2.2xlarge, cache.m2.4xlarge   R3 node types: cache.r3.large, cache.r3.xlarge, cache.r3.2xlarge, cache.r3.4xlarge, cache.r3.8xlarge       Additional node type info    All current generation instance types are created in Amazon VPC by default.   Redis append-only files (AOF) are not supported for T1 or T2 instances.   Redis Multi-AZ with automatic failover is not supported on T1 instances.   Redis configuration variables appendonly and appendfsync are not supported on Redis version 2.8.22 and later.  
     */
    CacheNodeType?: String;
    /**
     * The duration filter value, specified in years or seconds. Use this parameter to show only reservations for this duration. Valid Values: 1 | 3 | 31536000 | 94608000 
     */
    Duration?: String;
    /**
     * The product description filter value. Use this parameter to show only those reservations matching the specified product description.
     */
    ProductDescription?: String;
    /**
     * The offering type filter value. Use this parameter to show only the available offerings matching the specified offering type. Valid values: "Light Utilization"|"Medium Utilization"|"Heavy Utilization"|"All Upfront"|"Partial Upfront"| "No Upfront" 
     */
    OfferingType?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: minimum 20; maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeReservedCacheNodesOfferingsMessage {
    /**
     * The offering identifier filter value. Use this parameter to show only the available offering that matches the specified reservation identifier. Example: 438012d3-4052-4cc7-b2e3-8d3372e0e706 
     */
    ReservedCacheNodesOfferingId?: String;
    /**
     * The cache node type filter value. Use this parameter to show only the available offerings matching the specified cache node type. The following node types are supported by ElastiCache. Generally speaking, the current generation types provide more memory and computational power at lower cost when compared to their equivalent previous generation counterparts.   General purpose:   Current generation:   M6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward): cache.m6g.large, cache.m6g.xlarge, cache.m6g.2xlarge, cache.m6g.4xlarge, cache.m6g.8xlarge, cache.m6g.12xlarge, cache.m6g.16xlarge   For region availability, see Supported Node Types    M5 node types: cache.m5.large, cache.m5.xlarge, cache.m5.2xlarge, cache.m5.4xlarge, cache.m5.12xlarge, cache.m5.24xlarge   M4 node types: cache.m4.large, cache.m4.xlarge, cache.m4.2xlarge, cache.m4.4xlarge, cache.m4.10xlarge   T4g node types (available only for Redis engine version 5.0.6 onward and Memcached engine version 1.5.16 onward): cache.t4g.micro, cache.t4g.small, cache.t4g.medium   T3 node types: cache.t3.micro, cache.t3.small, cache.t3.medium   T2 node types: cache.t2.micro, cache.t2.small, cache.t2.medium    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  T1 node types: cache.t1.micro   M1 node types: cache.m1.small, cache.m1.medium, cache.m1.large, cache.m1.xlarge   M3 node types: cache.m3.medium, cache.m3.large, cache.m3.xlarge, cache.m3.2xlarge      Compute optimized:   Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  C1 node types: cache.c1.xlarge      Memory optimized:   Current generation:   R6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward).  cache.r6g.large, cache.r6g.xlarge, cache.r6g.2xlarge, cache.r6g.4xlarge, cache.r6g.8xlarge, cache.r6g.12xlarge, cache.r6g.16xlarge   For region availability, see Supported Node Types    R5 node types: cache.r5.large, cache.r5.xlarge, cache.r5.2xlarge, cache.r5.4xlarge, cache.r5.12xlarge, cache.r5.24xlarge   R4 node types: cache.r4.large, cache.r4.xlarge, cache.r4.2xlarge, cache.r4.4xlarge, cache.r4.8xlarge, cache.r4.16xlarge    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  M2 node types: cache.m2.xlarge, cache.m2.2xlarge, cache.m2.4xlarge   R3 node types: cache.r3.large, cache.r3.xlarge, cache.r3.2xlarge, cache.r3.4xlarge, cache.r3.8xlarge       Additional node type info    All current generation instance types are created in Amazon VPC by default.   Redis append-only files (AOF) are not supported for T1 or T2 instances.   Redis Multi-AZ with automatic failover is not supported on T1 instances.   Redis configuration variables appendonly and appendfsync are not supported on Redis version 2.8.22 and later.  
     */
    CacheNodeType?: String;
    /**
     * Duration filter value, specified in years or seconds. Use this parameter to show only reservations for a given duration. Valid Values: 1 | 3 | 31536000 | 94608000 
     */
    Duration?: String;
    /**
     * The product description filter value. Use this parameter to show only the available offerings matching the specified product description.
     */
    ProductDescription?: String;
    /**
     * The offering type filter value. Use this parameter to show only the available offerings matching the specified offering type. Valid Values: "Light Utilization"|"Medium Utilization"|"Heavy Utilization" |"All Upfront"|"Partial Upfront"| "No Upfront" 
     */
    OfferingType?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: minimum 20; maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeServiceUpdatesMessage {
    /**
     * The unique ID of the service update
     */
    ServiceUpdateName?: String;
    /**
     * The status of the service update
     */
    ServiceUpdateStatus?: ServiceUpdateStatusList;
    /**
     * The maximum number of records to include in the response
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeSnapshotsListMessage {
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of snapshots. Each item in the list contains detailed information about one snapshot.
     */
    Snapshots?: SnapshotList;
  }
  export interface DescribeSnapshotsMessage {
    /**
     * A user-supplied replication group identifier. If this parameter is specified, only snapshots associated with that specific replication group are described.
     */
    ReplicationGroupId?: String;
    /**
     * A user-supplied cluster identifier. If this parameter is specified, only snapshots associated with that specific cluster are described.
     */
    CacheClusterId?: String;
    /**
     * A user-supplied name of the snapshot. If this parameter is specified, only this snapshot are described.
     */
    SnapshotName?: String;
    /**
     * If set to system, the output shows snapshots that were automatically created by ElastiCache. If set to user the output shows snapshots that were manually created. If omitted, the output shows both automatically and manually created snapshots.
     */
    SnapshotSource?: String;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a marker is included in the response so that the remaining results can be retrieved. Default: 50 Constraints: minimum 20; maximum 50.
     */
    MaxRecords?: IntegerOptional;
    /**
     * A Boolean value which if true, the node group (shard) configuration is included in the snapshot description.
     */
    ShowNodeGroupConfig?: BooleanOptional;
  }
  export interface DescribeUpdateActionsMessage {
    /**
     * The unique ID of the service update
     */
    ServiceUpdateName?: String;
    /**
     * The replication group IDs
     */
    ReplicationGroupIds?: ReplicationGroupIdList;
    /**
     * The cache cluster IDs
     */
    CacheClusterIds?: CacheClusterIdList;
    /**
     * The Elasticache engine to which the update applies. Either Redis or Memcached 
     */
    Engine?: String;
    /**
     * The status of the service update
     */
    ServiceUpdateStatus?: ServiceUpdateStatusList;
    /**
     * The range of time specified to search for service updates that are in available status
     */
    ServiceUpdateTimeRange?: TimeRangeFilter;
    /**
     * The status of the update action.
     */
    UpdateActionStatus?: UpdateActionStatusList;
    /**
     * Dictates whether to include node level update status in the response 
     */
    ShowNodeLevelUpdateStatus?: BooleanOptional;
    /**
     * The maximum number of records to include in the response
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeUserGroupsMessage {
    /**
     * The ID of the user group.
     */
    UserGroupId?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a marker is included in the response so that the remaining results can be retrieved. 
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords. &gt;
     */
    Marker?: String;
  }
  export interface DescribeUserGroupsResult {
    /**
     * Returns a list of user groups.
     */
    UserGroups?: UserGroupList;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords. &gt;
     */
    Marker?: String;
  }
  export interface DescribeUsersMessage {
    /**
     * The Redis engine. 
     */
    Engine?: EngineType;
    /**
     * The ID of the user.
     */
    UserId?: UserId;
    /**
     * Filter to determine the list of User IDs to return.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a marker is included in the response so that the remaining results can be retrieved. 
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords. &gt;
     */
    Marker?: String;
  }
  export interface DescribeUsersResult {
    /**
     * A list of users.
     */
    Users?: UserList;
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords. &gt;
     */
    Marker?: String;
  }
  export interface DestinationDetails {
    /**
     * The configuration details of the CloudWatch Logs destination.
     */
    CloudWatchLogsDetails?: CloudWatchLogsDestinationDetails;
    /**
     * The configuration details of the Kinesis Data Firehose destination.
     */
    KinesisFirehoseDetails?: KinesisFirehoseDestinationDetails;
  }
  export type DestinationType = "cloudwatch-logs"|"kinesis-firehose"|string;
  export interface DisassociateGlobalReplicationGroupMessage {
    /**
     * The name of the Global datastore
     */
    GlobalReplicationGroupId: String;
    /**
     * The name of the secondary cluster you wish to remove from the Global datastore
     */
    ReplicationGroupId: String;
    /**
     * The Amazon region of secondary cluster you wish to remove from the Global datastore
     */
    ReplicationGroupRegion: String;
  }
  export interface DisassociateGlobalReplicationGroupResult {
    GlobalReplicationGroup?: GlobalReplicationGroup;
  }
  export type Double = number;
  export interface EC2SecurityGroup {
    /**
     * The status of the Amazon EC2 security group.
     */
    Status?: String;
    /**
     * The name of the Amazon EC2 security group.
     */
    EC2SecurityGroupName?: String;
    /**
     * The Amazon account ID of the Amazon EC2 security group owner.
     */
    EC2SecurityGroupOwnerId?: String;
  }
  export type EC2SecurityGroupList = EC2SecurityGroup[];
  export interface Endpoint {
    /**
     * The DNS hostname of the cache node.
     */
    Address?: String;
    /**
     * The port number that the cache engine is listening on.
     */
    Port?: Integer;
  }
  export interface EngineDefaults {
    /**
     * Specifies the name of the cache parameter group family to which the engine default parameters apply. Valid values are: memcached1.4 | memcached1.5 | memcached1.6 | redis2.6 | redis2.8 | redis3.2 | redis4.0 | redis5.0 | redis6.0 | redis6.x | redis7 
     */
    CacheParameterGroupFamily?: String;
    /**
     * Provides an identifier to allow retrieval of paginated results.
     */
    Marker?: String;
    /**
     * Contains a list of engine default parameters.
     */
    Parameters?: ParametersList;
    /**
     * A list of parameters specific to a particular cache node type. Each element in the list contains detailed information about one parameter.
     */
    CacheNodeTypeSpecificParameters?: CacheNodeTypeSpecificParametersList;
  }
  export type EngineType = string;
  export interface Event {
    /**
     * The identifier for the source of the event. For example, if the event occurred at the cluster level, the identifier would be the name of the cluster.
     */
    SourceIdentifier?: String;
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
  export interface EventsMessage {
    /**
     * Provides an identifier to allow retrieval of paginated results.
     */
    Marker?: String;
    /**
     * A list of events. Each element in the list contains detailed information about one event.
     */
    Events?: EventList;
  }
  export interface FailoverGlobalReplicationGroupMessage {
    /**
     * The name of the Global datastore
     */
    GlobalReplicationGroupId: String;
    /**
     * The Amazon region of the primary cluster of the Global datastore
     */
    PrimaryRegion: String;
    /**
     * The name of the primary replication group
     */
    PrimaryReplicationGroupId: String;
  }
  export interface FailoverGlobalReplicationGroupResult {
    GlobalReplicationGroup?: GlobalReplicationGroup;
  }
  export interface Filter {
    /**
     * The property being filtered. For example, UserId.
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
  export interface GlobalNodeGroup {
    /**
     * The name of the global node group
     */
    GlobalNodeGroupId?: String;
    /**
     * The keyspace for this node group
     */
    Slots?: String;
  }
  export type GlobalNodeGroupIdList = String[];
  export type GlobalNodeGroupList = GlobalNodeGroup[];
  export interface GlobalReplicationGroup {
    /**
     * The name of the Global datastore
     */
    GlobalReplicationGroupId?: String;
    /**
     * The optional description of the Global datastore
     */
    GlobalReplicationGroupDescription?: String;
    /**
     * The status of the Global datastore
     */
    Status?: String;
    /**
     * The cache node type of the Global datastore
     */
    CacheNodeType?: String;
    /**
     * The Elasticache engine. For Redis only.
     */
    Engine?: String;
    /**
     * The Elasticache Redis engine version.
     */
    EngineVersion?: String;
    /**
     * The replication groups that comprise the Global datastore.
     */
    Members?: GlobalReplicationGroupMemberList;
    /**
     * A flag that indicates whether the Global datastore is cluster enabled.
     */
    ClusterEnabled?: BooleanOptional;
    /**
     * Indicates the slot configuration and global identifier for each slice group.
     */
    GlobalNodeGroups?: GlobalNodeGroupList;
    /**
     * A flag that enables using an AuthToken (password) when issuing Redis commands. Default: false 
     */
    AuthTokenEnabled?: BooleanOptional;
    /**
     * A flag that enables in-transit encryption when set to true.  Required: Only available when creating a replication group in an Amazon VPC using redis version 3.2.6, 4.x or later.
     */
    TransitEncryptionEnabled?: BooleanOptional;
    /**
     * A flag that enables encryption at rest when set to true. You cannot modify the value of AtRestEncryptionEnabled after the replication group is created. To enable encryption at rest on a replication group you must set AtRestEncryptionEnabled to true when you create the replication group.   Required: Only available when creating a replication group in an Amazon VPC using redis version 3.2.6, 4.x or later.
     */
    AtRestEncryptionEnabled?: BooleanOptional;
    /**
     * The ARN (Amazon Resource Name) of the global replication group.
     */
    ARN?: String;
  }
  export interface GlobalReplicationGroupInfo {
    /**
     * The name of the Global datastore
     */
    GlobalReplicationGroupId?: String;
    /**
     * The role of the replication group in a Global datastore. Can be primary or secondary.
     */
    GlobalReplicationGroupMemberRole?: String;
  }
  export type GlobalReplicationGroupList = GlobalReplicationGroup[];
  export interface GlobalReplicationGroupMember {
    /**
     * The replication group id of the Global datastore member.
     */
    ReplicationGroupId?: String;
    /**
     * The Amazon region of the Global datastore member.
     */
    ReplicationGroupRegion?: String;
    /**
     * Indicates the role of the replication group, primary or secondary.
     */
    Role?: String;
    /**
     * Indicates whether automatic failover is enabled for the replication group.
     */
    AutomaticFailover?: AutomaticFailoverStatus;
    /**
     * The status of the membership of the replication group.
     */
    Status?: String;
  }
  export type GlobalReplicationGroupMemberList = GlobalReplicationGroupMember[];
  export interface IncreaseNodeGroupsInGlobalReplicationGroupMessage {
    /**
     * The name of the Global datastore
     */
    GlobalReplicationGroupId: String;
    /**
     * Total number of node groups you want
     */
    NodeGroupCount: Integer;
    /**
     * Describes the replication group IDs, the Amazon regions where they are stored and the shard configuration for each that comprise the Global datastore
     */
    RegionalConfigurations?: RegionalConfigurationList;
    /**
     * Indicates that the process begins immediately. At present, the only permitted value for this parameter is true.
     */
    ApplyImmediately: Boolean;
  }
  export interface IncreaseNodeGroupsInGlobalReplicationGroupResult {
    GlobalReplicationGroup?: GlobalReplicationGroup;
  }
  export interface IncreaseReplicaCountMessage {
    /**
     * The id of the replication group to which you want to add replica nodes.
     */
    ReplicationGroupId: String;
    /**
     * The number of read replica nodes you want at the completion of this operation. For Redis (cluster mode disabled) replication groups, this is the number of replica nodes in the replication group. For Redis (cluster mode enabled) replication groups, this is the number of replica nodes in each of the replication group's node groups.
     */
    NewReplicaCount?: IntegerOptional;
    /**
     * A list of ConfigureShard objects that can be used to configure each shard in a Redis (cluster mode enabled) replication group. The ConfigureShard has three members: NewReplicaCount, NodeGroupId, and PreferredAvailabilityZones.
     */
    ReplicaConfiguration?: ReplicaConfigurationList;
    /**
     * If True, the number of replica nodes is increased immediately. ApplyImmediately=False is not currently supported.
     */
    ApplyImmediately: Boolean;
  }
  export interface IncreaseReplicaCountResult {
    ReplicationGroup?: ReplicationGroup;
  }
  export type InputAuthenticationType = "password"|"no-password-required"|"iam"|string;
  export type Integer = number;
  export type IntegerOptional = number;
  export type IpDiscovery = "ipv4"|"ipv6"|string;
  export type KeyList = String[];
  export interface KinesisFirehoseDestinationDetails {
    /**
     * The name of the Kinesis Data Firehose delivery stream.
     */
    DeliveryStream?: String;
  }
  export interface ListAllowedNodeTypeModificationsMessage {
    /**
     * The name of the cluster you want to scale up to a larger node instanced type. ElastiCache uses the cluster id to identify the current node type of this cluster and from that to create a list of node types you can scale up to.  You must provide a value for either the CacheClusterId or the ReplicationGroupId. 
     */
    CacheClusterId?: String;
    /**
     * The name of the replication group want to scale up to a larger node type. ElastiCache uses the replication group id to identify the current node type being used by this replication group, and from that to create a list of node types you can scale up to.  You must provide a value for either the CacheClusterId or the ReplicationGroupId. 
     */
    ReplicationGroupId?: String;
  }
  export interface ListTagsForResourceMessage {
    /**
     * The Amazon Resource Name (ARN) of the resource for which you want the list of tags, for example arn:aws:elasticache:us-west-2:0123456789:cluster:myCluster or arn:aws:elasticache:us-west-2:0123456789:snapshot:mySnapshot. For more information about ARNs, see Amazon Resource Names (ARNs) and Amazon Web Services Service Namespaces.
     */
    ResourceName: String;
  }
  export interface LogDeliveryConfiguration {
    /**
     * Refers to slow-log or engine-log.
     */
    LogType?: LogType;
    /**
     * Returns the destination type, either cloudwatch-logs or kinesis-firehose.
     */
    DestinationType?: DestinationType;
    /**
     * Configuration details of either a CloudWatch Logs destination or Kinesis Data Firehose destination.
     */
    DestinationDetails?: DestinationDetails;
    /**
     * Returns the log format, either JSON or TEXT.
     */
    LogFormat?: LogFormat;
    /**
     * Returns the log delivery configuration status. Values are one of enabling | disabling | modifying | active | error 
     */
    Status?: LogDeliveryConfigurationStatus;
    /**
     * Returns an error message for the log delivery configuration.
     */
    Message?: String;
  }
  export type LogDeliveryConfigurationList = LogDeliveryConfiguration[];
  export interface LogDeliveryConfigurationRequest {
    /**
     * Refers to slow-log or engine-log..
     */
    LogType?: LogType;
    /**
     * Specify either cloudwatch-logs or kinesis-firehose as the destination type.
     */
    DestinationType?: DestinationType;
    /**
     * Configuration details of either a CloudWatch Logs destination or Kinesis Data Firehose destination.
     */
    DestinationDetails?: DestinationDetails;
    /**
     * Specifies either JSON or TEXT
     */
    LogFormat?: LogFormat;
    /**
     * Specify if log delivery is enabled. Default true.
     */
    Enabled?: BooleanOptional;
  }
  export type LogDeliveryConfigurationRequestList = LogDeliveryConfigurationRequest[];
  export type LogDeliveryConfigurationStatus = "active"|"enabling"|"modifying"|"disabling"|"error"|string;
  export type LogFormat = "text"|"json"|string;
  export type LogType = "slow-log"|"engine-log"|string;
  export interface ModifyCacheClusterMessage {
    /**
     * The cluster identifier. This value is stored as a lowercase string.
     */
    CacheClusterId: String;
    /**
     * The number of cache nodes that the cluster should have. If the value for NumCacheNodes is greater than the sum of the number of current cache nodes and the number of cache nodes pending creation (which may be zero), more nodes are added. If the value is less than the number of existing cache nodes, nodes are removed. If the value is equal to the number of current cache nodes, any pending add or remove requests are canceled. If you are removing cache nodes, you must use the CacheNodeIdsToRemove parameter to provide the IDs of the specific cache nodes to remove. For clusters running Redis, this value must be 1. For clusters running Memcached, this value must be between 1 and 40.  Adding or removing Memcached cache nodes can be applied immediately or as a pending operation (see ApplyImmediately). A pending operation to modify the number of cache nodes in a cluster during its maintenance window, whether by adding or removing nodes in accordance with the scale out architecture, is not queued. The customer's latest request to add or remove nodes to the cluster overrides any previous pending operations to modify the number of cache nodes in the cluster. For example, a request to remove 2 nodes would override a previous pending operation to remove 3 nodes. Similarly, a request to add 2 nodes would override a previous pending operation to remove 3 nodes and vice versa. As Memcached cache nodes may now be provisioned in different Availability Zones with flexible cache node placement, a request to add nodes does not automatically override a previous pending operation to add nodes. The customer can modify the previous pending operation to add more nodes or explicitly cancel the pending request and retry the new request. To cancel pending operations to modify the number of cache nodes in a cluster, use the ModifyCacheCluster request and set NumCacheNodes equal to the number of cache nodes currently in the cluster. 
     */
    NumCacheNodes?: IntegerOptional;
    /**
     * A list of cache node IDs to be removed. A node ID is a numeric identifier (0001, 0002, etc.). This parameter is only valid when NumCacheNodes is less than the existing number of cache nodes. The number of cache node IDs supplied in this parameter must match the difference between the existing number of cache nodes in the cluster or pending cache nodes, whichever is greater, and the value of NumCacheNodes in the request. For example: If you have 3 active cache nodes, 7 pending cache nodes, and the number of cache nodes in this ModifyCacheCluster call is 5, you must list 2 (7 - 5) cache node IDs to remove.
     */
    CacheNodeIdsToRemove?: CacheNodeIdsList;
    /**
     * Specifies whether the new nodes in this Memcached cluster are all created in a single Availability Zone or created across multiple Availability Zones. Valid values: single-az | cross-az. This option is only supported for Memcached clusters.  You cannot specify single-az if the Memcached cluster already has cache nodes in different Availability Zones. If cross-az is specified, existing Memcached nodes remain in their current Availability Zone. Only newly created nodes are located in different Availability Zones.  
     */
    AZMode?: AZMode;
    /**
     *  This option is only supported on Memcached clusters.  The list of Availability Zones where the new Memcached cache nodes are created. This parameter is only valid when NumCacheNodes in the request is greater than the sum of the number of active cache nodes and the number of cache nodes pending creation (which may be zero). The number of Availability Zones supplied in this list must match the cache nodes being added in this request. Scenarios:    Scenario 1: You have 3 active nodes and wish to add 2 nodes. Specify NumCacheNodes=5 (3 + 2) and optionally specify two Availability Zones for the two new nodes.    Scenario 2: You have 3 active nodes and 2 nodes pending creation (from the scenario 1 call) and want to add 1 more node. Specify NumCacheNodes=6 ((3 + 2) + 1) and optionally specify an Availability Zone for the new node.    Scenario 3: You want to cancel all pending operations. Specify NumCacheNodes=3 to cancel all pending operations.   The Availability Zone placement of nodes pending creation cannot be modified. If you wish to cancel any nodes pending creation, add 0 nodes by setting NumCacheNodes to the number of current nodes. If cross-az is specified, existing Memcached nodes remain in their current Availability Zone. Only newly created nodes can be located in different Availability Zones. For guidance on how to move existing Memcached nodes to different Availability Zones, see the Availability Zone Considerations section of Cache Node Considerations for Memcached.  Impact of new add/remove requests upon pending requests    Scenario-1   Pending Action: Delete   New Request: Delete   Result: The new delete, pending or immediate, replaces the pending delete.     Scenario-2   Pending Action: Delete   New Request: Create   Result: The new create, pending or immediate, replaces the pending delete.     Scenario-3   Pending Action: Create   New Request: Delete   Result: The new delete, pending or immediate, replaces the pending create.     Scenario-4   Pending Action: Create   New Request: Create   Result: The new create is added to the pending create.   Important: If the new create request is Apply Immediately - Yes, all creates are performed immediately. If the new create request is Apply Immediately - No, all creates are pending.     
     */
    NewAvailabilityZones?: PreferredAvailabilityZoneList;
    /**
     * A list of cache security group names to authorize on this cluster. This change is asynchronously applied as soon as possible. You can use this parameter only with clusters that are created outside of an Amazon Virtual Private Cloud (Amazon VPC). Constraints: Must contain no more than 255 alphanumeric characters. Must not be "Default".
     */
    CacheSecurityGroupNames?: CacheSecurityGroupNameList;
    /**
     * Specifies the VPC Security Groups associated with the cluster. This parameter can be used only with clusters that are created in an Amazon Virtual Private Cloud (Amazon VPC).
     */
    SecurityGroupIds?: SecurityGroupIdsList;
    /**
     * Specifies the weekly time range during which maintenance on the cluster is performed. It is specified as a range in the format ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC). The minimum maintenance window is a 60 minute period. Valid values for ddd are:    sun     mon     tue     wed     thu     fri     sat    Example: sun:23:00-mon:01:30 
     */
    PreferredMaintenanceWindow?: String;
    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic to which notifications are sent.  The Amazon SNS topic owner must be same as the cluster owner. 
     */
    NotificationTopicArn?: String;
    /**
     * The name of the cache parameter group to apply to this cluster. This change is asynchronously applied as soon as possible for parameters when the ApplyImmediately parameter is specified as true for this request.
     */
    CacheParameterGroupName?: String;
    /**
     * The status of the Amazon SNS notification topic. Notifications are sent only if the status is active. Valid values: active | inactive 
     */
    NotificationTopicStatus?: String;
    /**
     * If true, this parameter causes the modifications in this request and any pending modifications to be applied, asynchronously and as soon as possible, regardless of the PreferredMaintenanceWindow setting for the cluster. If false, changes to the cluster are applied on the next maintenance reboot, or the next failure reboot, whichever occurs first.  If you perform a ModifyCacheCluster before a pending modification is applied, the pending modification is replaced by the newer modification.  Valid values: true | false  Default: false 
     */
    ApplyImmediately?: Boolean;
    /**
     * The upgraded version of the cache engine to be run on the cache nodes.  Important: You can upgrade to a newer engine version (see Selecting a Cache Engine and Version), but you cannot downgrade to an earlier engine version. If you want to use an earlier engine version, you must delete the existing cluster and create it anew with the earlier engine version. 
     */
    EngineVersion?: String;
    /**
     *  If you are running Redis engine version 6.0 or later, set this parameter to yes if you want to opt-in to the next auto minor version upgrade campaign. This parameter is disabled for previous versions.  
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
    /**
     * The number of days for which ElastiCache retains automatic cluster snapshots before deleting them. For example, if you set SnapshotRetentionLimit to 5, a snapshot that was taken today is retained for 5 days before being deleted.  If the value of SnapshotRetentionLimit is set to zero (0), backups are turned off. 
     */
    SnapshotRetentionLimit?: IntegerOptional;
    /**
     * The daily time range (in UTC) during which ElastiCache begins taking a daily snapshot of your cluster. 
     */
    SnapshotWindow?: String;
    /**
     * A valid cache node type that you want to scale this cluster up to.
     */
    CacheNodeType?: String;
    /**
     * Reserved parameter. The password used to access a password protected server. This parameter must be specified with the auth-token-update parameter. Password constraints:   Must be only printable ASCII characters   Must be at least 16 characters and no more than 128 characters in length   Cannot contain any of the following characters: '/', '"', or '@', '%'    For more information, see AUTH password at AUTH.
     */
    AuthToken?: String;
    /**
     * Specifies the strategy to use to update the AUTH token. This parameter must be specified with the auth-token parameter. Possible values:   Rotate   Set    For more information, see Authenticating Users with Redis AUTH 
     */
    AuthTokenUpdateStrategy?: AuthTokenUpdateStrategyType;
    /**
     * Specifies the destination, format and type of the logs.
     */
    LogDeliveryConfigurations?: LogDeliveryConfigurationRequestList;
    /**
     * The network type you choose when modifying a cluster, either ipv4 | ipv6. IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the Nitro system.
     */
    IpDiscovery?: IpDiscovery;
  }
  export interface ModifyCacheClusterResult {
    CacheCluster?: CacheCluster;
  }
  export interface ModifyCacheParameterGroupMessage {
    /**
     * The name of the cache parameter group to modify.
     */
    CacheParameterGroupName: String;
    /**
     * An array of parameter names and values for the parameter update. You must supply at least one parameter name and value; subsequent arguments are optional. A maximum of 20 parameters may be modified per request.
     */
    ParameterNameValues: ParameterNameValueList;
  }
  export interface ModifyCacheSubnetGroupMessage {
    /**
     * The name for the cache subnet group. This value is stored as a lowercase string. Constraints: Must contain no more than 255 alphanumeric characters or hyphens. Example: mysubnetgroup 
     */
    CacheSubnetGroupName: String;
    /**
     * A description of the cache subnet group.
     */
    CacheSubnetGroupDescription?: String;
    /**
     * The EC2 subnet IDs for the cache subnet group.
     */
    SubnetIds?: SubnetIdentifierList;
  }
  export interface ModifyCacheSubnetGroupResult {
    CacheSubnetGroup?: CacheSubnetGroup;
  }
  export interface ModifyGlobalReplicationGroupMessage {
    /**
     * The name of the Global datastore
     */
    GlobalReplicationGroupId: String;
    /**
     * This parameter causes the modifications in this request and any pending modifications to be applied, asynchronously and as soon as possible. Modifications to Global Replication Groups cannot be requested to be applied in PreferredMaintenceWindow. 
     */
    ApplyImmediately: Boolean;
    /**
     * A valid cache node type that you want to scale this Global datastore to.
     */
    CacheNodeType?: String;
    /**
     * The upgraded version of the cache engine to be run on the clusters in the Global datastore. 
     */
    EngineVersion?: String;
    /**
     * The name of the cache parameter group to use with the Global datastore. It must be compatible with the major engine version used by the Global datastore.
     */
    CacheParameterGroupName?: String;
    /**
     * A description of the Global datastore
     */
    GlobalReplicationGroupDescription?: String;
    /**
     * Determines whether a read replica is automatically promoted to read/write primary if the existing primary encounters a failure. 
     */
    AutomaticFailoverEnabled?: BooleanOptional;
  }
  export interface ModifyGlobalReplicationGroupResult {
    GlobalReplicationGroup?: GlobalReplicationGroup;
  }
  export interface ModifyReplicationGroupMessage {
    /**
     * The identifier of the replication group to modify.
     */
    ReplicationGroupId: String;
    /**
     * A description for the replication group. Maximum length is 255 characters.
     */
    ReplicationGroupDescription?: String;
    /**
     * For replication groups with a single primary, if this parameter is specified, ElastiCache promotes the specified cluster in the specified replication group to the primary role. The nodes of all other clusters in the replication group are read replicas.
     */
    PrimaryClusterId?: String;
    /**
     * The cluster ID that is used as the daily snapshot source for the replication group. This parameter cannot be set for Redis (cluster mode enabled) replication groups.
     */
    SnapshottingClusterId?: String;
    /**
     * Determines whether a read replica is automatically promoted to read/write primary if the existing primary encounters a failure. Valid values: true | false 
     */
    AutomaticFailoverEnabled?: BooleanOptional;
    /**
     * A flag to indicate MultiAZ is enabled.
     */
    MultiAZEnabled?: BooleanOptional;
    /**
     * Deprecated. This parameter is not used.
     */
    NodeGroupId?: String;
    /**
     * A list of cache security group names to authorize for the clusters in this replication group. This change is asynchronously applied as soon as possible. This parameter can be used only with replication group containing clusters running outside of an Amazon Virtual Private Cloud (Amazon VPC). Constraints: Must contain no more than 255 alphanumeric characters. Must not be Default.
     */
    CacheSecurityGroupNames?: CacheSecurityGroupNameList;
    /**
     * Specifies the VPC Security Groups associated with the clusters in the replication group. This parameter can be used only with replication group containing clusters running in an Amazon Virtual Private Cloud (Amazon VPC).
     */
    SecurityGroupIds?: SecurityGroupIdsList;
    /**
     * Specifies the weekly time range during which maintenance on the cluster is performed. It is specified as a range in the format ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC). The minimum maintenance window is a 60 minute period. Valid values for ddd are:    sun     mon     tue     wed     thu     fri     sat    Example: sun:23:00-mon:01:30 
     */
    PreferredMaintenanceWindow?: String;
    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic to which notifications are sent.  The Amazon SNS topic owner must be same as the replication group owner.  
     */
    NotificationTopicArn?: String;
    /**
     * The name of the cache parameter group to apply to all of the clusters in this replication group. This change is asynchronously applied as soon as possible for parameters when the ApplyImmediately parameter is specified as true for this request.
     */
    CacheParameterGroupName?: String;
    /**
     * The status of the Amazon SNS notification topic for the replication group. Notifications are sent only if the status is active. Valid values: active | inactive 
     */
    NotificationTopicStatus?: String;
    /**
     * If true, this parameter causes the modifications in this request and any pending modifications to be applied, asynchronously and as soon as possible, regardless of the PreferredMaintenanceWindow setting for the replication group. If false, changes to the nodes in the replication group are applied on the next maintenance reboot, or the next failure reboot, whichever occurs first. Valid values: true | false  Default: false 
     */
    ApplyImmediately?: Boolean;
    /**
     * The upgraded version of the cache engine to be run on the clusters in the replication group.  Important: You can upgrade to a newer engine version (see Selecting a Cache Engine and Version), but you cannot downgrade to an earlier engine version. If you want to use an earlier engine version, you must delete the existing replication group and create it anew with the earlier engine version. 
     */
    EngineVersion?: String;
    /**
     *  If you are running Redis engine version 6.0 or later, set this parameter to yes if you want to opt-in to the next auto minor version upgrade campaign. This parameter is disabled for previous versions.  
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
    /**
     * The number of days for which ElastiCache retains automatic node group (shard) snapshots before deleting them. For example, if you set SnapshotRetentionLimit to 5, a snapshot that was taken today is retained for 5 days before being deleted.  Important If the value of SnapshotRetentionLimit is set to zero (0), backups are turned off.
     */
    SnapshotRetentionLimit?: IntegerOptional;
    /**
     * The daily time range (in UTC) during which ElastiCache begins taking a daily snapshot of the node group (shard) specified by SnapshottingClusterId. Example: 05:00-09:00  If you do not specify this parameter, ElastiCache automatically chooses an appropriate time range.
     */
    SnapshotWindow?: String;
    /**
     * A valid cache node type that you want to scale this replication group to.
     */
    CacheNodeType?: String;
    /**
     * Reserved parameter. The password used to access a password protected server. This parameter must be specified with the auth-token-update-strategy  parameter. Password constraints:   Must be only printable ASCII characters   Must be at least 16 characters and no more than 128 characters in length   Cannot contain any of the following characters: '/', '"', or '@', '%'    For more information, see AUTH password at AUTH.
     */
    AuthToken?: String;
    /**
     * Specifies the strategy to use to update the AUTH token. This parameter must be specified with the auth-token parameter. Possible values:   Rotate   Set    For more information, see Authenticating Users with Redis AUTH 
     */
    AuthTokenUpdateStrategy?: AuthTokenUpdateStrategyType;
    /**
     * The ID of the user group you are associating with the replication group.
     */
    UserGroupIdsToAdd?: UserGroupIdList;
    /**
     * The ID of the user group to disassociate from the replication group, meaning the users in the group no longer can access the replication group.
     */
    UserGroupIdsToRemove?: UserGroupIdList;
    /**
     * Removes the user group associated with this replication group.
     */
    RemoveUserGroups?: BooleanOptional;
    /**
     * Specifies the destination, format and type of the logs.
     */
    LogDeliveryConfigurations?: LogDeliveryConfigurationRequestList;
    /**
     * The network type you choose when modifying a cluster, either ipv4 | ipv6. IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the Nitro system.
     */
    IpDiscovery?: IpDiscovery;
    /**
     * A flag that enables in-transit encryption when set to true. If you are enabling in-transit encryption for an existing cluster, you must also set TransitEncryptionMode to preferred.
     */
    TransitEncryptionEnabled?: BooleanOptional;
    /**
     * A setting that allows you to migrate your clients to use in-transit encryption, with no downtime. You must set TransitEncryptionEnabled to true, for your existing cluster, and set TransitEncryptionMode to preferred in the same request to allow both encrypted and unencrypted connections at the same time. Once you migrate all your Redis clients to use encrypted connections you can set the value to required to allow encrypted connections only. Setting TransitEncryptionMode to required is a two-step process that requires you to first set the TransitEncryptionMode to preferred, after that you can set TransitEncryptionMode to required. 
     */
    TransitEncryptionMode?: TransitEncryptionMode;
    /**
     * Enabled or Disabled. To modify cluster mode from Disabled to Enabled, you must first set the cluster mode to Compatible. Compatible mode allows your Redis clients to connect using both cluster mode enabled and cluster mode disabled. After you migrate all Redis clients to use cluster mode enabled, you can then complete cluster mode configuration and set the cluster mode to Enabled.
     */
    ClusterMode?: ClusterMode;
  }
  export interface ModifyReplicationGroupResult {
    ReplicationGroup?: ReplicationGroup;
  }
  export interface ModifyReplicationGroupShardConfigurationMessage {
    /**
     * The name of the Redis (cluster mode enabled) cluster (replication group) on which the shards are to be configured.
     */
    ReplicationGroupId: String;
    /**
     * The number of node groups (shards) that results from the modification of the shard configuration.
     */
    NodeGroupCount: Integer;
    /**
     * Indicates that the shard reconfiguration process begins immediately. At present, the only permitted value for this parameter is true. Value: true
     */
    ApplyImmediately: Boolean;
    /**
     * Specifies the preferred availability zones for each node group in the cluster. If the value of NodeGroupCount is greater than the current number of node groups (shards), you can use this parameter to specify the preferred availability zones of the cluster's shards. If you omit this parameter ElastiCache selects availability zones for you. You can specify this parameter only if the value of NodeGroupCount is greater than the current number of node groups (shards).
     */
    ReshardingConfiguration?: ReshardingConfigurationList;
    /**
     * If the value of NodeGroupCount is less than the current number of node groups (shards), then either NodeGroupsToRemove or NodeGroupsToRetain is required. NodeGroupsToRemove is a list of NodeGroupIds to remove from the cluster. ElastiCache for Redis will attempt to remove all node groups listed by NodeGroupsToRemove from the cluster.
     */
    NodeGroupsToRemove?: NodeGroupsToRemoveList;
    /**
     * If the value of NodeGroupCount is less than the current number of node groups (shards), then either NodeGroupsToRemove or NodeGroupsToRetain is required. NodeGroupsToRetain is a list of NodeGroupIds to retain in the cluster. ElastiCache for Redis will attempt to remove all node groups except those listed by NodeGroupsToRetain from the cluster.
     */
    NodeGroupsToRetain?: NodeGroupsToRetainList;
  }
  export interface ModifyReplicationGroupShardConfigurationResult {
    ReplicationGroup?: ReplicationGroup;
  }
  export interface ModifyUserGroupMessage {
    /**
     * The ID of the user group.
     */
    UserGroupId: String;
    /**
     * The list of user IDs to add to the user group.
     */
    UserIdsToAdd?: UserIdListInput;
    /**
     * The list of user IDs to remove from the user group.
     */
    UserIdsToRemove?: UserIdListInput;
  }
  export interface ModifyUserMessage {
    /**
     * The ID of the user.
     */
    UserId: UserId;
    /**
     * Access permissions string used for this user.
     */
    AccessString?: AccessString;
    /**
     * Adds additional user permissions to the access string.
     */
    AppendAccessString?: AccessString;
    /**
     * The passwords belonging to the user. You are allowed up to two.
     */
    Passwords?: PasswordListInput;
    /**
     * Indicates no password is required for the user.
     */
    NoPasswordRequired?: BooleanOptional;
    /**
     * Specifies how to authenticate the user.
     */
    AuthenticationMode?: AuthenticationMode;
  }
  export type MultiAZStatus = "enabled"|"disabled"|string;
  export type NetworkType = "ipv4"|"ipv6"|"dual_stack"|string;
  export type NetworkTypeList = NetworkType[];
  export interface NodeGroup {
    /**
     * The identifier for the node group (shard). A Redis (cluster mode disabled) replication group contains only 1 node group; therefore, the node group ID is 0001. A Redis (cluster mode enabled) replication group contains 1 to 90 node groups numbered 0001 to 0090. Optionally, the user can provide the id for a node group. 
     */
    NodeGroupId?: String;
    /**
     * The current state of this replication group - creating, available, modifying, deleting.
     */
    Status?: String;
    /**
     * The endpoint of the primary node in this node group (shard).
     */
    PrimaryEndpoint?: Endpoint;
    /**
     * The endpoint of the replica nodes in this node group (shard).
     */
    ReaderEndpoint?: Endpoint;
    /**
     * The keyspace for this node group (shard).
     */
    Slots?: String;
    /**
     * A list containing information about individual nodes within the node group (shard).
     */
    NodeGroupMembers?: NodeGroupMemberList;
  }
  export interface NodeGroupConfiguration {
    /**
     * Either the ElastiCache for Redis supplied 4-digit id or a user supplied id for the node group these configuration values apply to.
     */
    NodeGroupId?: AllowedNodeGroupId;
    /**
     * A string that specifies the keyspace for a particular node group. Keyspaces range from 0 to 16,383. The string is in the format startkey-endkey. Example: "0-3999" 
     */
    Slots?: String;
    /**
     * The number of read replica nodes in this node group (shard).
     */
    ReplicaCount?: IntegerOptional;
    /**
     * The Availability Zone where the primary node of this node group (shard) is launched.
     */
    PrimaryAvailabilityZone?: String;
    /**
     * A list of Availability Zones to be used for the read replicas. The number of Availability Zones in this list must match the value of ReplicaCount or ReplicasPerNodeGroup if not specified.
     */
    ReplicaAvailabilityZones?: AvailabilityZonesList;
    /**
     * The outpost ARN of the primary node.
     */
    PrimaryOutpostArn?: String;
    /**
     * The outpost ARN of the node replicas.
     */
    ReplicaOutpostArns?: OutpostArnsList;
  }
  export type NodeGroupConfigurationList = NodeGroupConfiguration[];
  export type NodeGroupList = NodeGroup[];
  export interface NodeGroupMember {
    /**
     * The ID of the cluster to which the node belongs.
     */
    CacheClusterId?: String;
    /**
     * The ID of the node within its cluster. A node ID is a numeric identifier (0001, 0002, etc.).
     */
    CacheNodeId?: String;
    /**
     * The information required for client programs to connect to a node for read operations. The read endpoint is only applicable on Redis (cluster mode disabled) clusters.
     */
    ReadEndpoint?: Endpoint;
    /**
     * The name of the Availability Zone in which the node is located.
     */
    PreferredAvailabilityZone?: String;
    /**
     * The outpost ARN of the node group member.
     */
    PreferredOutpostArn?: String;
    /**
     * The role that is currently assigned to the node - primary or replica. This member is only applicable for Redis (cluster mode disabled) replication groups.
     */
    CurrentRole?: String;
  }
  export type NodeGroupMemberList = NodeGroupMember[];
  export interface NodeGroupMemberUpdateStatus {
    /**
     * The cache cluster ID
     */
    CacheClusterId?: String;
    /**
     * The node ID of the cache cluster
     */
    CacheNodeId?: String;
    /**
     * The update status of the node
     */
    NodeUpdateStatus?: NodeUpdateStatus;
    /**
     * The deletion date of the node
     */
    NodeDeletionDate?: TStamp;
    /**
     * The start date of the update for a node
     */
    NodeUpdateStartDate?: TStamp;
    /**
     * The end date of the update for a node
     */
    NodeUpdateEndDate?: TStamp;
    /**
     * Reflects whether the update was initiated by the customer or automatically applied
     */
    NodeUpdateInitiatedBy?: NodeUpdateInitiatedBy;
    /**
     * The date when the update is triggered
     */
    NodeUpdateInitiatedDate?: TStamp;
    /**
     * The date when the NodeUpdateStatus was last modified
     */
    NodeUpdateStatusModifiedDate?: TStamp;
  }
  export type NodeGroupMemberUpdateStatusList = NodeGroupMemberUpdateStatus[];
  export interface NodeGroupUpdateStatus {
    /**
     * The ID of the node group
     */
    NodeGroupId?: String;
    /**
     * The status of the service update on the node group member
     */
    NodeGroupMemberUpdateStatus?: NodeGroupMemberUpdateStatusList;
  }
  export type NodeGroupUpdateStatusList = NodeGroupUpdateStatus[];
  export type NodeGroupsToRemoveList = AllowedNodeGroupId[];
  export type NodeGroupsToRetainList = AllowedNodeGroupId[];
  export interface NodeSnapshot {
    /**
     * A unique identifier for the source cluster.
     */
    CacheClusterId?: String;
    /**
     * A unique identifier for the source node group (shard).
     */
    NodeGroupId?: String;
    /**
     * The cache node identifier for the node in the source cluster.
     */
    CacheNodeId?: String;
    /**
     * The configuration for the source node group (shard).
     */
    NodeGroupConfiguration?: NodeGroupConfiguration;
    /**
     * The size of the cache on the source cache node.
     */
    CacheSize?: String;
    /**
     * The date and time when the cache node was created in the source cluster.
     */
    CacheNodeCreateTime?: TStamp;
    /**
     * The date and time when the source node's metadata and cache data set was obtained for the snapshot.
     */
    SnapshotCreateTime?: TStamp;
  }
  export type NodeSnapshotList = NodeSnapshot[];
  export type NodeTypeList = String[];
  export type NodeUpdateInitiatedBy = "system"|"customer"|string;
  export type NodeUpdateStatus = "not-applied"|"waiting-to-start"|"in-progress"|"stopping"|"stopped"|"complete"|string;
  export interface NotificationConfiguration {
    /**
     * The Amazon Resource Name (ARN) that identifies the topic.
     */
    TopicArn?: String;
    /**
     * The current state of the topic.
     */
    TopicStatus?: String;
  }
  export type OutpostArnsList = String[];
  export type OutpostMode = "single-outpost"|"cross-outpost"|string;
  export interface Parameter {
    /**
     * The name of the parameter.
     */
    ParameterName?: String;
    /**
     * The value of the parameter.
     */
    ParameterValue?: String;
    /**
     * A description of the parameter.
     */
    Description?: String;
    /**
     * The source of the parameter.
     */
    Source?: String;
    /**
     * The valid data type for the parameter.
     */
    DataType?: String;
    /**
     * The valid range of values for the parameter.
     */
    AllowedValues?: String;
    /**
     * Indicates whether (true) or not (false) the parameter can be modified. Some parameters have security or operational implications that prevent them from being changed.
     */
    IsModifiable?: Boolean;
    /**
     * The earliest cache engine version to which the parameter can apply.
     */
    MinimumEngineVersion?: String;
    /**
     * Indicates whether a change to the parameter is applied immediately or requires a reboot for the change to be applied. You can force a reboot or wait until the next maintenance window's reboot. For more information, see Rebooting a Cluster.
     */
    ChangeType?: ChangeType;
  }
  export interface ParameterNameValue {
    /**
     * The name of the parameter.
     */
    ParameterName?: String;
    /**
     * The value of the parameter.
     */
    ParameterValue?: String;
  }
  export type ParameterNameValueList = ParameterNameValue[];
  export type ParametersList = Parameter[];
  export type PasswordListInput = String[];
  export type PendingAutomaticFailoverStatus = "enabled"|"disabled"|string;
  export interface PendingLogDeliveryConfiguration {
    /**
     * Refers to slow-log or engine-log..
     */
    LogType?: LogType;
    /**
     * Returns the destination type, either CloudWatch Logs or Kinesis Data Firehose.
     */
    DestinationType?: DestinationType;
    /**
     * Configuration details of either a CloudWatch Logs destination or Kinesis Data Firehose destination.
     */
    DestinationDetails?: DestinationDetails;
    /**
     * Returns the log format, either JSON or TEXT
     */
    LogFormat?: LogFormat;
  }
  export type PendingLogDeliveryConfigurationList = PendingLogDeliveryConfiguration[];
  export interface PendingModifiedValues {
    /**
     * The new number of cache nodes for the cluster. For clusters running Redis, this value must be 1. For clusters running Memcached, this value must be between 1 and 40.
     */
    NumCacheNodes?: IntegerOptional;
    /**
     * A list of cache node IDs that are being removed (or will be removed) from the cluster. A node ID is a 4-digit numeric identifier (0001, 0002, etc.).
     */
    CacheNodeIdsToRemove?: CacheNodeIdsList;
    /**
     * The new cache engine version that the cluster runs.
     */
    EngineVersion?: String;
    /**
     * The cache node type that this cluster or replication group is scaled to.
     */
    CacheNodeType?: String;
    /**
     * The auth token status
     */
    AuthTokenStatus?: AuthTokenUpdateStatus;
    /**
     * The log delivery configurations being modified 
     */
    LogDeliveryConfigurations?: PendingLogDeliveryConfigurationList;
    /**
     * A flag that enables in-transit encryption when set to true.
     */
    TransitEncryptionEnabled?: BooleanOptional;
    /**
     * A setting that allows you to migrate your clients to use in-transit encryption, with no downtime.
     */
    TransitEncryptionMode?: TransitEncryptionMode;
  }
  export type PreferredAvailabilityZoneList = String[];
  export type PreferredOutpostArnList = String[];
  export interface ProcessedUpdateAction {
    /**
     * The ID of the replication group
     */
    ReplicationGroupId?: String;
    /**
     * The ID of the cache cluster
     */
    CacheClusterId?: String;
    /**
     * The unique ID of the service update
     */
    ServiceUpdateName?: String;
    /**
     * The status of the update action on the Redis cluster
     */
    UpdateActionStatus?: UpdateActionStatus;
  }
  export type ProcessedUpdateActionList = ProcessedUpdateAction[];
  export interface PurchaseReservedCacheNodesOfferingMessage {
    /**
     * The ID of the reserved cache node offering to purchase. Example: 438012d3-4052-4cc7-b2e3-8d3372e0e706 
     */
    ReservedCacheNodesOfferingId: String;
    /**
     * A customer-specified identifier to track this reservation.  The Reserved Cache Node ID is an unique customer-specified identifier to track this reservation. If this parameter is not specified, ElastiCache automatically generates an identifier for the reservation.  Example: myreservationID
     */
    ReservedCacheNodeId?: String;
    /**
     * The number of cache node instances to reserve. Default: 1 
     */
    CacheNodeCount?: IntegerOptional;
    /**
     * A list of tags to be added to this resource. A tag is a key-value pair. A tag key must be accompanied by a tag value, although null is accepted.
     */
    Tags?: TagList;
  }
  export interface PurchaseReservedCacheNodesOfferingResult {
    ReservedCacheNode?: ReservedCacheNode;
  }
  export interface RebalanceSlotsInGlobalReplicationGroupMessage {
    /**
     * The name of the Global datastore
     */
    GlobalReplicationGroupId: String;
    /**
     * If True, redistribution is applied immediately.
     */
    ApplyImmediately: Boolean;
  }
  export interface RebalanceSlotsInGlobalReplicationGroupResult {
    GlobalReplicationGroup?: GlobalReplicationGroup;
  }
  export interface RebootCacheClusterMessage {
    /**
     * The cluster identifier. This parameter is stored as a lowercase string.
     */
    CacheClusterId: String;
    /**
     * A list of cache node IDs to reboot. A node ID is a numeric identifier (0001, 0002, etc.). To reboot an entire cluster, specify all of the cache node IDs.
     */
    CacheNodeIdsToReboot: CacheNodeIdsList;
  }
  export interface RebootCacheClusterResult {
    CacheCluster?: CacheCluster;
  }
  export interface RecurringCharge {
    /**
     * The monetary amount of the recurring charge.
     */
    RecurringChargeAmount?: Double;
    /**
     * The frequency of the recurring charge.
     */
    RecurringChargeFrequency?: String;
  }
  export type RecurringChargeList = RecurringCharge[];
  export interface RegionalConfiguration {
    /**
     * The name of the secondary cluster
     */
    ReplicationGroupId: String;
    /**
     * The Amazon region where the cluster is stored
     */
    ReplicationGroupRegion: String;
    /**
     * A list of PreferredAvailabilityZones objects that specifies the configuration of a node group in the resharded cluster. 
     */
    ReshardingConfiguration: ReshardingConfigurationList;
  }
  export type RegionalConfigurationList = RegionalConfiguration[];
  export type RemoveReplicasList = String[];
  export interface RemoveTagsFromResourceMessage {
    /**
     * The Amazon Resource Name (ARN) of the resource from which you want the tags removed, for example arn:aws:elasticache:us-west-2:0123456789:cluster:myCluster or arn:aws:elasticache:us-west-2:0123456789:snapshot:mySnapshot. For more information about ARNs, see Amazon Resource Names (ARNs) and Amazon Service Namespaces.
     */
    ResourceName: String;
    /**
     * A list of TagKeys identifying the tags you want removed from the named resource.
     */
    TagKeys: KeyList;
  }
  export type ReplicaConfigurationList = ConfigureShard[];
  export interface ReplicationGroup {
    /**
     * The identifier for the replication group.
     */
    ReplicationGroupId?: String;
    /**
     * The user supplied description of the replication group.
     */
    Description?: String;
    /**
     * The name of the Global datastore and role of this replication group in the Global datastore.
     */
    GlobalReplicationGroupInfo?: GlobalReplicationGroupInfo;
    /**
     * The current state of this replication group - creating, available, modifying, deleting, create-failed, snapshotting.
     */
    Status?: String;
    /**
     * A group of settings to be applied to the replication group, either immediately or during the next maintenance window.
     */
    PendingModifiedValues?: ReplicationGroupPendingModifiedValues;
    /**
     * The names of all the cache clusters that are part of this replication group.
     */
    MemberClusters?: ClusterIdList;
    /**
     * A list of node groups in this replication group. For Redis (cluster mode disabled) replication groups, this is a single-element list. For Redis (cluster mode enabled) replication groups, the list contains an entry for each node group (shard).
     */
    NodeGroups?: NodeGroupList;
    /**
     * The cluster ID that is used as the daily snapshot source for the replication group.
     */
    SnapshottingClusterId?: String;
    /**
     * Indicates the status of automatic failover for this Redis replication group.
     */
    AutomaticFailover?: AutomaticFailoverStatus;
    /**
     * A flag indicating if you have Multi-AZ enabled to enhance fault tolerance. For more information, see Minimizing Downtime: Multi-AZ 
     */
    MultiAZ?: MultiAZStatus;
    /**
     * The configuration endpoint for this replication group. Use the configuration endpoint to connect to this replication group.
     */
    ConfigurationEndpoint?: Endpoint;
    /**
     * The number of days for which ElastiCache retains automatic cluster snapshots before deleting them. For example, if you set SnapshotRetentionLimit to 5, a snapshot that was taken today is retained for 5 days before being deleted.   If the value of SnapshotRetentionLimit is set to zero (0), backups are turned off. 
     */
    SnapshotRetentionLimit?: IntegerOptional;
    /**
     * The daily time range (in UTC) during which ElastiCache begins taking a daily snapshot of your node group (shard). Example: 05:00-09:00  If you do not specify this parameter, ElastiCache automatically chooses an appropriate time range.  This parameter is only valid if the Engine parameter is redis. 
     */
    SnapshotWindow?: String;
    /**
     * A flag indicating whether or not this replication group is cluster enabled; i.e., whether its data can be partitioned across multiple shards (API/CLI: node groups). Valid values: true | false 
     */
    ClusterEnabled?: BooleanOptional;
    /**
     * The name of the compute and memory capacity node type for each node in the replication group.
     */
    CacheNodeType?: String;
    /**
     * A flag that enables using an AuthToken (password) when issuing Redis commands. Default: false 
     */
    AuthTokenEnabled?: BooleanOptional;
    /**
     * The date the auth token was last modified
     */
    AuthTokenLastModifiedDate?: TStamp;
    /**
     * A flag that enables in-transit encryption when set to true.  Required: Only available when creating a replication group in an Amazon VPC using redis version 3.2.6, 4.x or later. Default: false 
     */
    TransitEncryptionEnabled?: BooleanOptional;
    /**
     * A flag that enables encryption at-rest when set to true. You cannot modify the value of AtRestEncryptionEnabled after the cluster is created. To enable encryption at-rest on a cluster you must set AtRestEncryptionEnabled to true when you create a cluster.  Required: Only available when creating a replication group in an Amazon VPC using redis version 3.2.6, 4.x or later. Default: false 
     */
    AtRestEncryptionEnabled?: BooleanOptional;
    /**
     * The outpost ARNs of the replication group's member clusters.
     */
    MemberClustersOutpostArns?: ReplicationGroupOutpostArnList;
    /**
     * The ID of the KMS key used to encrypt the disk in the cluster.
     */
    KmsKeyId?: String;
    /**
     * The ARN (Amazon Resource Name) of the replication group.
     */
    ARN?: String;
    /**
     * The ID of the user group associated to the replication group.
     */
    UserGroupIds?: UserGroupIdList;
    /**
     * Returns the destination, format and type of the logs. 
     */
    LogDeliveryConfigurations?: LogDeliveryConfigurationList;
    /**
     * The date and time when the cluster was created.
     */
    ReplicationGroupCreateTime?: TStamp;
    /**
     * Enables data tiering. Data tiering is only supported for replication groups using the r6gd node type. This parameter must be set to true when using r6gd nodes. For more information, see Data tiering.
     */
    DataTiering?: DataTieringStatus;
    /**
     * If you are running Redis engine version 6.0 or later, set this parameter to yes if you want to opt-in to the next auto minor version upgrade campaign. This parameter is disabled for previous versions. 
     */
    AutoMinorVersionUpgrade?: Boolean;
    /**
     * Must be either ipv4 | ipv6 | dual_stack. IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the Nitro system.
     */
    NetworkType?: NetworkType;
    /**
     * The network type you choose when modifying a cluster, either ipv4 | ipv6. IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the Nitro system.
     */
    IpDiscovery?: IpDiscovery;
    /**
     * A setting that allows you to migrate your clients to use in-transit encryption, with no downtime.
     */
    TransitEncryptionMode?: TransitEncryptionMode;
    /**
     * Enabled or Disabled. To modify cluster mode from Disabled to Enabled, you must first set the cluster mode to Compatible. Compatible mode allows your Redis clients to connect using both cluster mode enabled and cluster mode disabled. After you migrate all Redis clients to use cluster mode enabled, you can then complete cluster mode configuration and set the cluster mode to Enabled.
     */
    ClusterMode?: ClusterMode;
  }
  export type ReplicationGroupIdList = String[];
  export type ReplicationGroupList = ReplicationGroup[];
  export interface ReplicationGroupMessage {
    /**
     * Provides an identifier to allow retrieval of paginated results.
     */
    Marker?: String;
    /**
     * A list of replication groups. Each item in the list contains detailed information about one replication group.
     */
    ReplicationGroups?: ReplicationGroupList;
  }
  export type ReplicationGroupOutpostArnList = String[];
  export interface ReplicationGroupPendingModifiedValues {
    /**
     * The primary cluster ID that is applied immediately (if --apply-immediately was specified), or during the next maintenance window.
     */
    PrimaryClusterId?: String;
    /**
     * Indicates the status of automatic failover for this Redis replication group.
     */
    AutomaticFailoverStatus?: PendingAutomaticFailoverStatus;
    /**
     * The status of an online resharding operation.
     */
    Resharding?: ReshardingStatus;
    /**
     * The auth token status
     */
    AuthTokenStatus?: AuthTokenUpdateStatus;
    /**
     * The user group being modified.
     */
    UserGroups?: UserGroupsUpdateStatus;
    /**
     * The log delivery configurations being modified 
     */
    LogDeliveryConfigurations?: PendingLogDeliveryConfigurationList;
    /**
     * A flag that enables in-transit encryption when set to true.
     */
    TransitEncryptionEnabled?: BooleanOptional;
    /**
     * A setting that allows you to migrate your clients to use in-transit encryption, with no downtime.
     */
    TransitEncryptionMode?: TransitEncryptionMode;
    /**
     * Enabled or Disabled. To modify cluster mode from Disabled to Enabled, you must first set the cluster mode to Compatible. Compatible mode allows your Redis clients to connect using both cluster mode enabled and cluster mode disabled. After you migrate all Redis clients to use cluster mode enabled, you can then complete cluster mode configuration and set the cluster mode to Enabled.
     */
    ClusterMode?: ClusterMode;
  }
  export interface ReservedCacheNode {
    /**
     * The unique identifier for the reservation.
     */
    ReservedCacheNodeId?: String;
    /**
     * The offering identifier.
     */
    ReservedCacheNodesOfferingId?: String;
    /**
     * The cache node type for the reserved cache nodes. The following node types are supported by ElastiCache. Generally speaking, the current generation types provide more memory and computational power at lower cost when compared to their equivalent previous generation counterparts.   General purpose:   Current generation:   M6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward): cache.m6g.large, cache.m6g.xlarge, cache.m6g.2xlarge, cache.m6g.4xlarge, cache.m6g.8xlarge, cache.m6g.12xlarge, cache.m6g.16xlarge   For region availability, see Supported Node Types    M5 node types: cache.m5.large, cache.m5.xlarge, cache.m5.2xlarge, cache.m5.4xlarge, cache.m5.12xlarge, cache.m5.24xlarge   M4 node types: cache.m4.large, cache.m4.xlarge, cache.m4.2xlarge, cache.m4.4xlarge, cache.m4.10xlarge   T4g node types (available only for Redis engine version 5.0.6 onward and Memcached engine version 1.5.16 onward): cache.t4g.micro, cache.t4g.small, cache.t4g.medium   T3 node types: cache.t3.micro, cache.t3.small, cache.t3.medium   T2 node types: cache.t2.micro, cache.t2.small, cache.t2.medium    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  T1 node types: cache.t1.micro   M1 node types: cache.m1.small, cache.m1.medium, cache.m1.large, cache.m1.xlarge   M3 node types: cache.m3.medium, cache.m3.large, cache.m3.xlarge, cache.m3.2xlarge      Compute optimized:   Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  C1 node types: cache.c1.xlarge      Memory optimized:   Current generation:   R6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward).  cache.r6g.large, cache.r6g.xlarge, cache.r6g.2xlarge, cache.r6g.4xlarge, cache.r6g.8xlarge, cache.r6g.12xlarge, cache.r6g.16xlarge   For region availability, see Supported Node Types    R5 node types: cache.r5.large, cache.r5.xlarge, cache.r5.2xlarge, cache.r5.4xlarge, cache.r5.12xlarge, cache.r5.24xlarge   R4 node types: cache.r4.large, cache.r4.xlarge, cache.r4.2xlarge, cache.r4.4xlarge, cache.r4.8xlarge, cache.r4.16xlarge    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  M2 node types: cache.m2.xlarge, cache.m2.2xlarge, cache.m2.4xlarge   R3 node types: cache.r3.large, cache.r3.xlarge, cache.r3.2xlarge, cache.r3.4xlarge, cache.r3.8xlarge       Additional node type info    All current generation instance types are created in Amazon VPC by default.   Redis append-only files (AOF) are not supported for T1 or T2 instances.   Redis Multi-AZ with automatic failover is not supported on T1 instances.   Redis configuration variables appendonly and appendfsync are not supported on Redis version 2.8.22 and later.  
     */
    CacheNodeType?: String;
    /**
     * The time the reservation started.
     */
    StartTime?: TStamp;
    /**
     * The duration of the reservation in seconds.
     */
    Duration?: Integer;
    /**
     * The fixed price charged for this reserved cache node.
     */
    FixedPrice?: Double;
    /**
     * The hourly price charged for this reserved cache node.
     */
    UsagePrice?: Double;
    /**
     * The number of cache nodes that have been reserved.
     */
    CacheNodeCount?: Integer;
    /**
     * The description of the reserved cache node.
     */
    ProductDescription?: String;
    /**
     * The offering type of this reserved cache node.
     */
    OfferingType?: String;
    /**
     * The state of the reserved cache node.
     */
    State?: String;
    /**
     * The recurring price charged to run this reserved cache node.
     */
    RecurringCharges?: RecurringChargeList;
    /**
     * The Amazon Resource Name (ARN) of the reserved cache node. Example: arn:aws:elasticache:us-east-1:123456789012:reserved-instance:ri-2017-03-27-08-33-25-582 
     */
    ReservationARN?: String;
  }
  export type ReservedCacheNodeList = ReservedCacheNode[];
  export interface ReservedCacheNodeMessage {
    /**
     * Provides an identifier to allow retrieval of paginated results.
     */
    Marker?: String;
    /**
     * A list of reserved cache nodes. Each element in the list contains detailed information about one node.
     */
    ReservedCacheNodes?: ReservedCacheNodeList;
  }
  export interface ReservedCacheNodesOffering {
    /**
     * A unique identifier for the reserved cache node offering.
     */
    ReservedCacheNodesOfferingId?: String;
    /**
     * The cache node type for the reserved cache node. The following node types are supported by ElastiCache. Generally speaking, the current generation types provide more memory and computational power at lower cost when compared to their equivalent previous generation counterparts.   General purpose:   Current generation:   M6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward): cache.m6g.large, cache.m6g.xlarge, cache.m6g.2xlarge, cache.m6g.4xlarge, cache.m6g.8xlarge, cache.m6g.12xlarge, cache.m6g.16xlarge   For region availability, see Supported Node Types    M5 node types: cache.m5.large, cache.m5.xlarge, cache.m5.2xlarge, cache.m5.4xlarge, cache.m5.12xlarge, cache.m5.24xlarge   M4 node types: cache.m4.large, cache.m4.xlarge, cache.m4.2xlarge, cache.m4.4xlarge, cache.m4.10xlarge   T4g node types (available only for Redis engine version 5.0.6 onward and Memcached engine version 1.5.16 onward): cache.t4g.micro, cache.t4g.small, cache.t4g.medium   T3 node types: cache.t3.micro, cache.t3.small, cache.t3.medium   T2 node types: cache.t2.micro, cache.t2.small, cache.t2.medium    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  T1 node types: cache.t1.micro   M1 node types: cache.m1.small, cache.m1.medium, cache.m1.large, cache.m1.xlarge   M3 node types: cache.m3.medium, cache.m3.large, cache.m3.xlarge, cache.m3.2xlarge      Compute optimized:   Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  C1 node types: cache.c1.xlarge      Memory optimized:   Current generation:   R6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward).  cache.r6g.large, cache.r6g.xlarge, cache.r6g.2xlarge, cache.r6g.4xlarge, cache.r6g.8xlarge, cache.r6g.12xlarge, cache.r6g.16xlarge   For region availability, see Supported Node Types    R5 node types: cache.r5.large, cache.r5.xlarge, cache.r5.2xlarge, cache.r5.4xlarge, cache.r5.12xlarge, cache.r5.24xlarge   R4 node types: cache.r4.large, cache.r4.xlarge, cache.r4.2xlarge, cache.r4.4xlarge, cache.r4.8xlarge, cache.r4.16xlarge    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  M2 node types: cache.m2.xlarge, cache.m2.2xlarge, cache.m2.4xlarge   R3 node types: cache.r3.large, cache.r3.xlarge, cache.r3.2xlarge, cache.r3.4xlarge, cache.r3.8xlarge       Additional node type info    All current generation instance types are created in Amazon VPC by default.   Redis append-only files (AOF) are not supported for T1 or T2 instances.   Redis Multi-AZ with automatic failover is not supported on T1 instances.   Redis configuration variables appendonly and appendfsync are not supported on Redis version 2.8.22 and later.  
     */
    CacheNodeType?: String;
    /**
     * The duration of the offering. in seconds.
     */
    Duration?: Integer;
    /**
     * The fixed price charged for this offering.
     */
    FixedPrice?: Double;
    /**
     * The hourly price charged for this offering.
     */
    UsagePrice?: Double;
    /**
     * The cache engine used by the offering.
     */
    ProductDescription?: String;
    /**
     * The offering type.
     */
    OfferingType?: String;
    /**
     * The recurring price charged to run this reserved cache node.
     */
    RecurringCharges?: RecurringChargeList;
  }
  export type ReservedCacheNodesOfferingList = ReservedCacheNodesOffering[];
  export interface ReservedCacheNodesOfferingMessage {
    /**
     * Provides an identifier to allow retrieval of paginated results.
     */
    Marker?: String;
    /**
     * A list of reserved cache node offerings. Each element in the list contains detailed information about one offering.
     */
    ReservedCacheNodesOfferings?: ReservedCacheNodesOfferingList;
  }
  export interface ResetCacheParameterGroupMessage {
    /**
     * The name of the cache parameter group to reset.
     */
    CacheParameterGroupName: String;
    /**
     * If true, all parameters in the cache parameter group are reset to their default values. If false, only the parameters listed by ParameterNameValues are reset to their default values. Valid values: true | false 
     */
    ResetAllParameters?: Boolean;
    /**
     * An array of parameter names to reset to their default values. If ResetAllParameters is true, do not use ParameterNameValues. If ResetAllParameters is false, you must specify the name of at least one parameter to reset.
     */
    ParameterNameValues?: ParameterNameValueList;
  }
  export interface ReshardingConfiguration {
    /**
     * Either the ElastiCache for Redis supplied 4-digit id or a user supplied id for the node group these configuration values apply to.
     */
    NodeGroupId?: AllowedNodeGroupId;
    /**
     * A list of preferred availability zones for the nodes in this cluster.
     */
    PreferredAvailabilityZones?: AvailabilityZonesList;
  }
  export type ReshardingConfigurationList = ReshardingConfiguration[];
  export interface ReshardingStatus {
    /**
     * Represents the progress of an online resharding operation.
     */
    SlotMigration?: SlotMigration;
  }
  export interface RevokeCacheSecurityGroupIngressMessage {
    /**
     * The name of the cache security group to revoke ingress from.
     */
    CacheSecurityGroupName: String;
    /**
     * The name of the Amazon EC2 security group to revoke access from.
     */
    EC2SecurityGroupName: String;
    /**
     * The Amazon account number of the Amazon EC2 security group owner. Note that this is not the same thing as an Amazon access key ID - you must provide a valid Amazon account number for this parameter.
     */
    EC2SecurityGroupOwnerId: String;
  }
  export interface RevokeCacheSecurityGroupIngressResult {
    CacheSecurityGroup?: CacheSecurityGroup;
  }
  export type SecurityGroupIdsList = String[];
  export interface SecurityGroupMembership {
    /**
     * The identifier of the cache security group.
     */
    SecurityGroupId?: String;
    /**
     * The status of the cache security group membership. The status changes whenever a cache security group is modified, or when the cache security groups assigned to a cluster are modified.
     */
    Status?: String;
  }
  export type SecurityGroupMembershipList = SecurityGroupMembership[];
  export interface ServiceUpdate {
    /**
     * The unique ID of the service update
     */
    ServiceUpdateName?: String;
    /**
     * The date when the service update is initially available
     */
    ServiceUpdateReleaseDate?: TStamp;
    /**
     * The date after which the service update is no longer available
     */
    ServiceUpdateEndDate?: TStamp;
    /**
     * The severity of the service update
     */
    ServiceUpdateSeverity?: ServiceUpdateSeverity;
    /**
     * The recommendend date to apply the service update in order to ensure compliance. For information on compliance, see Self-Service Security Updates for Compliance.
     */
    ServiceUpdateRecommendedApplyByDate?: TStamp;
    /**
     * The status of the service update
     */
    ServiceUpdateStatus?: ServiceUpdateStatus;
    /**
     * Provides details of the service update
     */
    ServiceUpdateDescription?: String;
    /**
     * Reflects the nature of the service update
     */
    ServiceUpdateType?: ServiceUpdateType;
    /**
     * The Elasticache engine to which the update applies. Either Redis or Memcached
     */
    Engine?: String;
    /**
     * The Elasticache engine version to which the update applies. Either Redis or Memcached engine version
     */
    EngineVersion?: String;
    /**
     * Indicates whether the service update will be automatically applied once the recommended apply-by date has expired. 
     */
    AutoUpdateAfterRecommendedApplyByDate?: BooleanOptional;
    /**
     * The estimated length of time the service update will take
     */
    EstimatedUpdateTime?: String;
  }
  export type ServiceUpdateList = ServiceUpdate[];
  export type ServiceUpdateSeverity = "critical"|"important"|"medium"|"low"|string;
  export type ServiceUpdateStatus = "available"|"cancelled"|"expired"|string;
  export type ServiceUpdateStatusList = ServiceUpdateStatus[];
  export type ServiceUpdateType = "security-update"|string;
  export interface ServiceUpdatesMessage {
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of service updates
     */
    ServiceUpdates?: ServiceUpdateList;
  }
  export type SlaMet = "yes"|"no"|"n/a"|string;
  export interface SlotMigration {
    /**
     * The percentage of the slot migration that is complete.
     */
    ProgressPercentage?: Double;
  }
  export interface Snapshot {
    /**
     * The name of a snapshot. For an automatic snapshot, the name is system-generated. For a manual snapshot, this is the user-provided name.
     */
    SnapshotName?: String;
    /**
     * The unique identifier of the source replication group.
     */
    ReplicationGroupId?: String;
    /**
     * A description of the source replication group.
     */
    ReplicationGroupDescription?: String;
    /**
     * The user-supplied identifier of the source cluster.
     */
    CacheClusterId?: String;
    /**
     * The status of the snapshot. Valid values: creating | available | restoring | copying | deleting.
     */
    SnapshotStatus?: String;
    /**
     * Indicates whether the snapshot is from an automatic backup (automated) or was created manually (manual).
     */
    SnapshotSource?: String;
    /**
     * The name of the compute and memory capacity node type for the source cluster. The following node types are supported by ElastiCache. Generally speaking, the current generation types provide more memory and computational power at lower cost when compared to their equivalent previous generation counterparts.   General purpose:   Current generation:   M6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward): cache.m6g.large, cache.m6g.xlarge, cache.m6g.2xlarge, cache.m6g.4xlarge, cache.m6g.8xlarge, cache.m6g.12xlarge, cache.m6g.16xlarge   For region availability, see Supported Node Types    M5 node types: cache.m5.large, cache.m5.xlarge, cache.m5.2xlarge, cache.m5.4xlarge, cache.m5.12xlarge, cache.m5.24xlarge   M4 node types: cache.m4.large, cache.m4.xlarge, cache.m4.2xlarge, cache.m4.4xlarge, cache.m4.10xlarge   T4g node types (available only for Redis engine version 5.0.6 onward and Memcached engine version 1.5.16 onward): cache.t4g.micro, cache.t4g.small, cache.t4g.medium   T3 node types: cache.t3.micro, cache.t3.small, cache.t3.medium   T2 node types: cache.t2.micro, cache.t2.small, cache.t2.medium    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  T1 node types: cache.t1.micro   M1 node types: cache.m1.small, cache.m1.medium, cache.m1.large, cache.m1.xlarge   M3 node types: cache.m3.medium, cache.m3.large, cache.m3.xlarge, cache.m3.2xlarge      Compute optimized:   Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  C1 node types: cache.c1.xlarge      Memory optimized:   Current generation:   R6g node types (available only for Redis engine version 5.0.6 onward and for Memcached engine version 1.5.16 onward).  cache.r6g.large, cache.r6g.xlarge, cache.r6g.2xlarge, cache.r6g.4xlarge, cache.r6g.8xlarge, cache.r6g.12xlarge, cache.r6g.16xlarge   For region availability, see Supported Node Types    R5 node types: cache.r5.large, cache.r5.xlarge, cache.r5.2xlarge, cache.r5.4xlarge, cache.r5.12xlarge, cache.r5.24xlarge   R4 node types: cache.r4.large, cache.r4.xlarge, cache.r4.2xlarge, cache.r4.4xlarge, cache.r4.8xlarge, cache.r4.16xlarge    Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)  M2 node types: cache.m2.xlarge, cache.m2.2xlarge, cache.m2.4xlarge   R3 node types: cache.r3.large, cache.r3.xlarge, cache.r3.2xlarge, cache.r3.4xlarge, cache.r3.8xlarge       Additional node type info    All current generation instance types are created in Amazon VPC by default.   Redis append-only files (AOF) are not supported for T1 or T2 instances.   Redis Multi-AZ with automatic failover is not supported on T1 instances.   Redis configuration variables appendonly and appendfsync are not supported on Redis version 2.8.22 and later.  
     */
    CacheNodeType?: String;
    /**
     * The name of the cache engine (memcached or redis) used by the source cluster.
     */
    Engine?: String;
    /**
     * The version of the cache engine version that is used by the source cluster.
     */
    EngineVersion?: String;
    /**
     * The number of cache nodes in the source cluster. For clusters running Redis, this value must be 1. For clusters running Memcached, this value must be between 1 and 40.
     */
    NumCacheNodes?: IntegerOptional;
    /**
     * The name of the Availability Zone in which the source cluster is located.
     */
    PreferredAvailabilityZone?: String;
    /**
     * The ARN (Amazon Resource Name) of the preferred outpost.
     */
    PreferredOutpostArn?: String;
    /**
     * The date and time when the source cluster was created.
     */
    CacheClusterCreateTime?: TStamp;
    /**
     * Specifies the weekly time range during which maintenance on the cluster is performed. It is specified as a range in the format ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC). The minimum maintenance window is a 60 minute period. Valid values for ddd are:    sun     mon     tue     wed     thu     fri     sat    Example: sun:23:00-mon:01:30 
     */
    PreferredMaintenanceWindow?: String;
    /**
     * The Amazon Resource Name (ARN) for the topic used by the source cluster for publishing notifications.
     */
    TopicArn?: String;
    /**
     * The port number used by each cache nodes in the source cluster.
     */
    Port?: IntegerOptional;
    /**
     * The cache parameter group that is associated with the source cluster.
     */
    CacheParameterGroupName?: String;
    /**
     * The name of the cache subnet group associated with the source cluster.
     */
    CacheSubnetGroupName?: String;
    /**
     * The Amazon Virtual Private Cloud identifier (VPC ID) of the cache subnet group for the source cluster.
     */
    VpcId?: String;
    /**
     *  If you are running Redis engine version 6.0 or later, set this parameter to yes if you want to opt-in to the next auto minor version upgrade campaign. This parameter is disabled for previous versions.  
     */
    AutoMinorVersionUpgrade?: Boolean;
    /**
     * For an automatic snapshot, the number of days for which ElastiCache retains the snapshot before deleting it. For manual snapshots, this field reflects the SnapshotRetentionLimit for the source cluster when the snapshot was created. This field is otherwise ignored: Manual snapshots do not expire, and can only be deleted using the DeleteSnapshot operation.   Important If the value of SnapshotRetentionLimit is set to zero (0), backups are turned off.
     */
    SnapshotRetentionLimit?: IntegerOptional;
    /**
     * The daily time range during which ElastiCache takes daily snapshots of the source cluster.
     */
    SnapshotWindow?: String;
    /**
     * The number of node groups (shards) in this snapshot. When restoring from a snapshot, the number of node groups (shards) in the snapshot and in the restored replication group must be the same.
     */
    NumNodeGroups?: IntegerOptional;
    /**
     * Indicates the status of automatic failover for the source Redis replication group.
     */
    AutomaticFailover?: AutomaticFailoverStatus;
    /**
     * A list of the cache nodes in the source cluster.
     */
    NodeSnapshots?: NodeSnapshotList;
    /**
     * The ID of the KMS key used to encrypt the snapshot.
     */
    KmsKeyId?: String;
    /**
     * The ARN (Amazon Resource Name) of the snapshot.
     */
    ARN?: String;
    /**
     * Enables data tiering. Data tiering is only supported for replication groups using the r6gd node type. This parameter must be set to true when using r6gd nodes. For more information, see Data tiering.
     */
    DataTiering?: DataTieringStatus;
  }
  export type SnapshotArnsList = String[];
  export type SnapshotList = Snapshot[];
  export type SourceType = "cache-cluster"|"cache-parameter-group"|"cache-security-group"|"cache-subnet-group"|"replication-group"|"user"|"user-group"|string;
  export interface StartMigrationMessage {
    /**
     * The ID of the replication group to which data should be migrated.
     */
    ReplicationGroupId: String;
    /**
     * List of endpoints from which data should be migrated. For Redis (cluster mode disabled), list should have only one element.
     */
    CustomerNodeEndpointList: CustomerNodeEndpointList;
  }
  export interface StartMigrationResponse {
    ReplicationGroup?: ReplicationGroup;
  }
  export type String = string;
  export interface Subnet {
    /**
     * The unique identifier for the subnet.
     */
    SubnetIdentifier?: String;
    /**
     * The Availability Zone associated with the subnet.
     */
    SubnetAvailabilityZone?: AvailabilityZone;
    /**
     * The outpost ARN of the subnet.
     */
    SubnetOutpost?: SubnetOutpost;
    /**
     * Either ipv4 | ipv6 | dual_stack. IPv6 is supported for workloads using Redis engine version 6.2 onward or Memcached engine version 1.6.6 on all instances built on the Nitro system.
     */
    SupportedNetworkTypes?: NetworkTypeList;
  }
  export type SubnetIdentifierList = String[];
  export type SubnetList = Subnet[];
  export interface SubnetOutpost {
    /**
     * The outpost ARN of the subnet.
     */
    SubnetOutpostArn?: String;
  }
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
  export interface TagListMessage {
    /**
     * A list of tags as key-value pairs.
     */
    TagList?: TagList;
  }
  export interface TestFailoverMessage {
    /**
     * The name of the replication group (console: cluster) whose automatic failover is being tested by this operation.
     */
    ReplicationGroupId: String;
    /**
     * The name of the node group (called shard in the console) in this replication group on which automatic failover is to be tested. You may test automatic failover on up to 5 node groups in any rolling 24-hour period.
     */
    NodeGroupId: AllowedNodeGroupId;
  }
  export interface TestFailoverResult {
    ReplicationGroup?: ReplicationGroup;
  }
  export interface TestMigrationMessage {
    /**
     *  The ID of the replication group to which data is to be migrated. 
     */
    ReplicationGroupId: String;
    /**
     *  List of endpoints from which data should be migrated. List should have only one element. 
     */
    CustomerNodeEndpointList: CustomerNodeEndpointList;
  }
  export interface TestMigrationResponse {
    ReplicationGroup?: ReplicationGroup;
  }
  export interface TimeRangeFilter {
    /**
     * The start time of the time range filter
     */
    StartTime?: TStamp;
    /**
     * The end time of the time range filter
     */
    EndTime?: TStamp;
  }
  export type TransitEncryptionMode = "preferred"|"required"|string;
  export type UGReplicationGroupIdList = String[];
  export interface UnprocessedUpdateAction {
    /**
     * The replication group ID
     */
    ReplicationGroupId?: String;
    /**
     * The ID of the cache cluster
     */
    CacheClusterId?: String;
    /**
     * The unique ID of the service update
     */
    ServiceUpdateName?: String;
    /**
     * The error type for requests that are not processed
     */
    ErrorType?: String;
    /**
     * The error message that describes the reason the request was not processed
     */
    ErrorMessage?: String;
  }
  export type UnprocessedUpdateActionList = UnprocessedUpdateAction[];
  export interface UpdateAction {
    /**
     * The ID of the replication group
     */
    ReplicationGroupId?: String;
    /**
     * The ID of the cache cluster
     */
    CacheClusterId?: String;
    /**
     * The unique ID of the service update
     */
    ServiceUpdateName?: String;
    /**
     * The date the update is first available
     */
    ServiceUpdateReleaseDate?: TStamp;
    /**
     * The severity of the service update
     */
    ServiceUpdateSeverity?: ServiceUpdateSeverity;
    /**
     * The status of the service update
     */
    ServiceUpdateStatus?: ServiceUpdateStatus;
    /**
     * The recommended date to apply the service update to ensure compliance. For information on compliance, see Self-Service Security Updates for Compliance.
     */
    ServiceUpdateRecommendedApplyByDate?: TStamp;
    /**
     * Reflects the nature of the service update 
     */
    ServiceUpdateType?: ServiceUpdateType;
    /**
     * The date that the service update is available to a replication group
     */
    UpdateActionAvailableDate?: TStamp;
    /**
     * The status of the update action
     */
    UpdateActionStatus?: UpdateActionStatus;
    /**
     * The progress of the service update on the replication group
     */
    NodesUpdated?: String;
    /**
     * The date when the UpdateActionStatus was last modified
     */
    UpdateActionStatusModifiedDate?: TStamp;
    /**
     * If yes, all nodes in the replication group have been updated by the recommended apply-by date. If no, at least one node in the replication group have not been updated by the recommended apply-by date. If N/A, the replication group was created after the recommended apply-by date.
     */
    SlaMet?: SlaMet;
    /**
     * The status of the service update on the node group
     */
    NodeGroupUpdateStatus?: NodeGroupUpdateStatusList;
    /**
     * The status of the service update on the cache node
     */
    CacheNodeUpdateStatus?: CacheNodeUpdateStatusList;
    /**
     * The estimated length of time for the update to complete
     */
    EstimatedUpdateTime?: String;
    /**
     * The Elasticache engine to which the update applies. Either Redis or Memcached
     */
    Engine?: String;
  }
  export type UpdateActionList = UpdateAction[];
  export interface UpdateActionResultsMessage {
    /**
     * Update actions that have been processed successfully
     */
    ProcessedUpdateActions?: ProcessedUpdateActionList;
    /**
     * Update actions that haven't been processed successfully
     */
    UnprocessedUpdateActions?: UnprocessedUpdateActionList;
  }
  export type UpdateActionStatus = "not-applied"|"waiting-to-start"|"in-progress"|"stopping"|"stopped"|"complete"|"scheduling"|"scheduled"|"not-applicable"|string;
  export type UpdateActionStatusList = UpdateActionStatus[];
  export interface UpdateActionsMessage {
    /**
     * An optional marker returned from a prior request. Use this marker for pagination of results from this operation. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * Returns a list of update actions
     */
    UpdateActions?: UpdateActionList;
  }
  export interface User {
    /**
     * The ID of the user.
     */
    UserId?: String;
    /**
     * The username of the user.
     */
    UserName?: String;
    /**
     * Indicates the user status. Can be "active", "modifying" or "deleting".
     */
    Status?: String;
    /**
     * The current supported value is Redis.
     */
    Engine?: EngineType;
    /**
     * The minimum engine version required, which is Redis 6.0
     */
    MinimumEngineVersion?: String;
    /**
     * Access permissions string used for this user.
     */
    AccessString?: String;
    /**
     * Returns a list of the user group IDs the user belongs to.
     */
    UserGroupIds?: UserGroupIdList;
    /**
     * Denotes whether the user requires a password to authenticate.
     */
    Authentication?: Authentication;
    /**
     * The Amazon Resource Name (ARN) of the user.
     */
    ARN?: String;
  }
  export interface UserGroup {
    /**
     * The ID of the user group.
     */
    UserGroupId?: String;
    /**
     * Indicates user group status. Can be "creating", "active", "modifying", "deleting".
     */
    Status?: String;
    /**
     * The current supported value is Redis. 
     */
    Engine?: EngineType;
    /**
     * The list of user IDs that belong to the user group.
     */
    UserIds?: UserIdList;
    /**
     * The minimum engine version required, which is Redis 6.0
     */
    MinimumEngineVersion?: String;
    /**
     * A list of updates being applied to the user group.
     */
    PendingChanges?: UserGroupPendingChanges;
    /**
     * A list of replication groups that the user group can access.
     */
    ReplicationGroups?: UGReplicationGroupIdList;
    /**
     * The Amazon Resource Name (ARN) of the user group.
     */
    ARN?: String;
  }
  export type UserGroupId = string;
  export type UserGroupIdList = UserGroupId[];
  export type UserGroupIdListInput = UserGroupId[];
  export type UserGroupList = UserGroup[];
  export interface UserGroupPendingChanges {
    /**
     * The list of user IDs to remove.
     */
    UserIdsToRemove?: UserIdList;
    /**
     * The list of user IDs to add.
     */
    UserIdsToAdd?: UserIdList;
  }
  export interface UserGroupsUpdateStatus {
    /**
     * The ID of the user group to add.
     */
    UserGroupIdsToAdd?: UserGroupIdList;
    /**
     * The ID of the user group to remove.
     */
    UserGroupIdsToRemove?: UserGroupIdList;
  }
  export type UserId = string;
  export type UserIdList = UserId[];
  export type UserIdListInput = UserId[];
  export type UserList = User[];
  export type UserName = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2012-11-15"|"2014-03-24"|"2014-07-15"|"2014-09-30"|"2015-02-02"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ElastiCache client.
   */
  export import Types = ElastiCache;
}
export = ElastiCache;
