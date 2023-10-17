import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class DocDB extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: DocDB.Types.ClientConfiguration)
  config: Config & DocDB.Types.ClientConfiguration;
  /**
   * Adds a source identifier to an existing event notification subscription.
   */
  addSourceIdentifierToSubscription(params: DocDB.Types.AddSourceIdentifierToSubscriptionMessage, callback?: (err: AWSError, data: DocDB.Types.AddSourceIdentifierToSubscriptionResult) => void): Request<DocDB.Types.AddSourceIdentifierToSubscriptionResult, AWSError>;
  /**
   * Adds a source identifier to an existing event notification subscription.
   */
  addSourceIdentifierToSubscription(callback?: (err: AWSError, data: DocDB.Types.AddSourceIdentifierToSubscriptionResult) => void): Request<DocDB.Types.AddSourceIdentifierToSubscriptionResult, AWSError>;
  /**
   * Adds metadata tags to an Amazon DocumentDB resource. You can use these tags with cost allocation reporting to track costs that are associated with Amazon DocumentDB resources or in a Condition statement in an Identity and Access Management (IAM) policy for Amazon DocumentDB.
   */
  addTagsToResource(params: DocDB.Types.AddTagsToResourceMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds metadata tags to an Amazon DocumentDB resource. You can use these tags with cost allocation reporting to track costs that are associated with Amazon DocumentDB resources or in a Condition statement in an Identity and Access Management (IAM) policy for Amazon DocumentDB.
   */
  addTagsToResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Applies a pending maintenance action to a resource (for example, to an Amazon DocumentDB instance).
   */
  applyPendingMaintenanceAction(params: DocDB.Types.ApplyPendingMaintenanceActionMessage, callback?: (err: AWSError, data: DocDB.Types.ApplyPendingMaintenanceActionResult) => void): Request<DocDB.Types.ApplyPendingMaintenanceActionResult, AWSError>;
  /**
   * Applies a pending maintenance action to a resource (for example, to an Amazon DocumentDB instance).
   */
  applyPendingMaintenanceAction(callback?: (err: AWSError, data: DocDB.Types.ApplyPendingMaintenanceActionResult) => void): Request<DocDB.Types.ApplyPendingMaintenanceActionResult, AWSError>;
  /**
   * Copies the specified cluster parameter group.
   */
  copyDBClusterParameterGroup(params: DocDB.Types.CopyDBClusterParameterGroupMessage, callback?: (err: AWSError, data: DocDB.Types.CopyDBClusterParameterGroupResult) => void): Request<DocDB.Types.CopyDBClusterParameterGroupResult, AWSError>;
  /**
   * Copies the specified cluster parameter group.
   */
  copyDBClusterParameterGroup(callback?: (err: AWSError, data: DocDB.Types.CopyDBClusterParameterGroupResult) => void): Request<DocDB.Types.CopyDBClusterParameterGroupResult, AWSError>;
  /**
   * Copies a snapshot of a cluster. To copy a cluster snapshot from a shared manual cluster snapshot, SourceDBClusterSnapshotIdentifier must be the Amazon Resource Name (ARN) of the shared cluster snapshot. You can only copy a shared DB cluster snapshot, whether encrypted or not, in the same Region. To cancel the copy operation after it is in progress, delete the target cluster snapshot identified by TargetDBClusterSnapshotIdentifier while that cluster snapshot is in the copying status.
   */
  copyDBClusterSnapshot(params: DocDB.Types.CopyDBClusterSnapshotMessage, callback?: (err: AWSError, data: DocDB.Types.CopyDBClusterSnapshotResult) => void): Request<DocDB.Types.CopyDBClusterSnapshotResult, AWSError>;
  /**
   * Copies a snapshot of a cluster. To copy a cluster snapshot from a shared manual cluster snapshot, SourceDBClusterSnapshotIdentifier must be the Amazon Resource Name (ARN) of the shared cluster snapshot. You can only copy a shared DB cluster snapshot, whether encrypted or not, in the same Region. To cancel the copy operation after it is in progress, delete the target cluster snapshot identified by TargetDBClusterSnapshotIdentifier while that cluster snapshot is in the copying status.
   */
  copyDBClusterSnapshot(callback?: (err: AWSError, data: DocDB.Types.CopyDBClusterSnapshotResult) => void): Request<DocDB.Types.CopyDBClusterSnapshotResult, AWSError>;
  /**
   * Creates a new Amazon DocumentDB cluster.
   */
  createDBCluster(params: DocDB.Types.CreateDBClusterMessage, callback?: (err: AWSError, data: DocDB.Types.CreateDBClusterResult) => void): Request<DocDB.Types.CreateDBClusterResult, AWSError>;
  /**
   * Creates a new Amazon DocumentDB cluster.
   */
  createDBCluster(callback?: (err: AWSError, data: DocDB.Types.CreateDBClusterResult) => void): Request<DocDB.Types.CreateDBClusterResult, AWSError>;
  /**
   * Creates a new cluster parameter group. Parameters in a cluster parameter group apply to all of the instances in a cluster. A cluster parameter group is initially created with the default parameters for the database engine used by instances in the cluster. In Amazon DocumentDB, you cannot make modifications directly to the default.docdb3.6 cluster parameter group. If your Amazon DocumentDB cluster is using the default cluster parameter group and you want to modify a value in it, you must first  create a new parameter group or  copy an existing parameter group, modify it, and then apply the modified parameter group to your cluster. For the new cluster parameter group and associated settings to take effect, you must then reboot the instances in the cluster without failover. For more information, see  Modifying Amazon DocumentDB Cluster Parameter Groups. 
   */
  createDBClusterParameterGroup(params: DocDB.Types.CreateDBClusterParameterGroupMessage, callback?: (err: AWSError, data: DocDB.Types.CreateDBClusterParameterGroupResult) => void): Request<DocDB.Types.CreateDBClusterParameterGroupResult, AWSError>;
  /**
   * Creates a new cluster parameter group. Parameters in a cluster parameter group apply to all of the instances in a cluster. A cluster parameter group is initially created with the default parameters for the database engine used by instances in the cluster. In Amazon DocumentDB, you cannot make modifications directly to the default.docdb3.6 cluster parameter group. If your Amazon DocumentDB cluster is using the default cluster parameter group and you want to modify a value in it, you must first  create a new parameter group or  copy an existing parameter group, modify it, and then apply the modified parameter group to your cluster. For the new cluster parameter group and associated settings to take effect, you must then reboot the instances in the cluster without failover. For more information, see  Modifying Amazon DocumentDB Cluster Parameter Groups. 
   */
  createDBClusterParameterGroup(callback?: (err: AWSError, data: DocDB.Types.CreateDBClusterParameterGroupResult) => void): Request<DocDB.Types.CreateDBClusterParameterGroupResult, AWSError>;
  /**
   * Creates a snapshot of a cluster. 
   */
  createDBClusterSnapshot(params: DocDB.Types.CreateDBClusterSnapshotMessage, callback?: (err: AWSError, data: DocDB.Types.CreateDBClusterSnapshotResult) => void): Request<DocDB.Types.CreateDBClusterSnapshotResult, AWSError>;
  /**
   * Creates a snapshot of a cluster. 
   */
  createDBClusterSnapshot(callback?: (err: AWSError, data: DocDB.Types.CreateDBClusterSnapshotResult) => void): Request<DocDB.Types.CreateDBClusterSnapshotResult, AWSError>;
  /**
   * Creates a new instance.
   */
  createDBInstance(params: DocDB.Types.CreateDBInstanceMessage, callback?: (err: AWSError, data: DocDB.Types.CreateDBInstanceResult) => void): Request<DocDB.Types.CreateDBInstanceResult, AWSError>;
  /**
   * Creates a new instance.
   */
  createDBInstance(callback?: (err: AWSError, data: DocDB.Types.CreateDBInstanceResult) => void): Request<DocDB.Types.CreateDBInstanceResult, AWSError>;
  /**
   * Creates a new subnet group. subnet groups must contain at least one subnet in at least two Availability Zones in the Region.
   */
  createDBSubnetGroup(params: DocDB.Types.CreateDBSubnetGroupMessage, callback?: (err: AWSError, data: DocDB.Types.CreateDBSubnetGroupResult) => void): Request<DocDB.Types.CreateDBSubnetGroupResult, AWSError>;
  /**
   * Creates a new subnet group. subnet groups must contain at least one subnet in at least two Availability Zones in the Region.
   */
  createDBSubnetGroup(callback?: (err: AWSError, data: DocDB.Types.CreateDBSubnetGroupResult) => void): Request<DocDB.Types.CreateDBSubnetGroupResult, AWSError>;
  /**
   * Creates an Amazon DocumentDB event notification subscription. This action requires a topic Amazon Resource Name (ARN) created by using the Amazon DocumentDB console, the Amazon SNS console, or the Amazon SNS API. To obtain an ARN with Amazon SNS, you must create a topic in Amazon SNS and subscribe to the topic. The ARN is displayed in the Amazon SNS console. You can specify the type of source (SourceType) that you want to be notified of. You can also provide a list of Amazon DocumentDB sources (SourceIds) that trigger the events, and you can provide a list of event categories (EventCategories) for events that you want to be notified of. For example, you can specify SourceType = db-instance, SourceIds = mydbinstance1, mydbinstance2 and EventCategories = Availability, Backup. If you specify both the SourceType and SourceIds (such as SourceType = db-instance and SourceIdentifier = myDBInstance1), you are notified of all the db-instance events for the specified source. If you specify a SourceType but do not specify a SourceIdentifier, you receive notice of the events for that source type for all your Amazon DocumentDB sources. If you do not specify either the SourceType or the SourceIdentifier, you are notified of events generated from all Amazon DocumentDB sources belonging to your customer account.
   */
  createEventSubscription(params: DocDB.Types.CreateEventSubscriptionMessage, callback?: (err: AWSError, data: DocDB.Types.CreateEventSubscriptionResult) => void): Request<DocDB.Types.CreateEventSubscriptionResult, AWSError>;
  /**
   * Creates an Amazon DocumentDB event notification subscription. This action requires a topic Amazon Resource Name (ARN) created by using the Amazon DocumentDB console, the Amazon SNS console, or the Amazon SNS API. To obtain an ARN with Amazon SNS, you must create a topic in Amazon SNS and subscribe to the topic. The ARN is displayed in the Amazon SNS console. You can specify the type of source (SourceType) that you want to be notified of. You can also provide a list of Amazon DocumentDB sources (SourceIds) that trigger the events, and you can provide a list of event categories (EventCategories) for events that you want to be notified of. For example, you can specify SourceType = db-instance, SourceIds = mydbinstance1, mydbinstance2 and EventCategories = Availability, Backup. If you specify both the SourceType and SourceIds (such as SourceType = db-instance and SourceIdentifier = myDBInstance1), you are notified of all the db-instance events for the specified source. If you specify a SourceType but do not specify a SourceIdentifier, you receive notice of the events for that source type for all your Amazon DocumentDB sources. If you do not specify either the SourceType or the SourceIdentifier, you are notified of events generated from all Amazon DocumentDB sources belonging to your customer account.
   */
  createEventSubscription(callback?: (err: AWSError, data: DocDB.Types.CreateEventSubscriptionResult) => void): Request<DocDB.Types.CreateEventSubscriptionResult, AWSError>;
  /**
   * Creates an Amazon DocumentDB global cluster that can span multiple multiple Regions. The global cluster contains one primary cluster with read-write capability, and up-to give read-only secondary clusters. Global clusters uses storage-based fast replication across regions with latencies less than one second, using dedicated infrastructure with no impact to your workload’s performance.  You can create a global cluster that is initially empty, and then add a primary and a secondary to it. Or you can specify an existing cluster during the create operation, and this cluster becomes the primary of the global cluster.   This action only applies to Amazon DocumentDB clusters. 
   */
  createGlobalCluster(params: DocDB.Types.CreateGlobalClusterMessage, callback?: (err: AWSError, data: DocDB.Types.CreateGlobalClusterResult) => void): Request<DocDB.Types.CreateGlobalClusterResult, AWSError>;
  /**
   * Creates an Amazon DocumentDB global cluster that can span multiple multiple Regions. The global cluster contains one primary cluster with read-write capability, and up-to give read-only secondary clusters. Global clusters uses storage-based fast replication across regions with latencies less than one second, using dedicated infrastructure with no impact to your workload’s performance.  You can create a global cluster that is initially empty, and then add a primary and a secondary to it. Or you can specify an existing cluster during the create operation, and this cluster becomes the primary of the global cluster.   This action only applies to Amazon DocumentDB clusters. 
   */
  createGlobalCluster(callback?: (err: AWSError, data: DocDB.Types.CreateGlobalClusterResult) => void): Request<DocDB.Types.CreateGlobalClusterResult, AWSError>;
  /**
   * Deletes a previously provisioned cluster. When you delete a cluster, all automated backups for that cluster are deleted and can't be recovered. Manual DB cluster snapshots of the specified cluster are not deleted. 
   */
  deleteDBCluster(params: DocDB.Types.DeleteDBClusterMessage, callback?: (err: AWSError, data: DocDB.Types.DeleteDBClusterResult) => void): Request<DocDB.Types.DeleteDBClusterResult, AWSError>;
  /**
   * Deletes a previously provisioned cluster. When you delete a cluster, all automated backups for that cluster are deleted and can't be recovered. Manual DB cluster snapshots of the specified cluster are not deleted. 
   */
  deleteDBCluster(callback?: (err: AWSError, data: DocDB.Types.DeleteDBClusterResult) => void): Request<DocDB.Types.DeleteDBClusterResult, AWSError>;
  /**
   * Deletes a specified cluster parameter group. The cluster parameter group to be deleted can't be associated with any clusters.
   */
  deleteDBClusterParameterGroup(params: DocDB.Types.DeleteDBClusterParameterGroupMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a specified cluster parameter group. The cluster parameter group to be deleted can't be associated with any clusters.
   */
  deleteDBClusterParameterGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a cluster snapshot. If the snapshot is being copied, the copy operation is terminated.  The cluster snapshot must be in the available state to be deleted. 
   */
  deleteDBClusterSnapshot(params: DocDB.Types.DeleteDBClusterSnapshotMessage, callback?: (err: AWSError, data: DocDB.Types.DeleteDBClusterSnapshotResult) => void): Request<DocDB.Types.DeleteDBClusterSnapshotResult, AWSError>;
  /**
   * Deletes a cluster snapshot. If the snapshot is being copied, the copy operation is terminated.  The cluster snapshot must be in the available state to be deleted. 
   */
  deleteDBClusterSnapshot(callback?: (err: AWSError, data: DocDB.Types.DeleteDBClusterSnapshotResult) => void): Request<DocDB.Types.DeleteDBClusterSnapshotResult, AWSError>;
  /**
   * Deletes a previously provisioned instance.
   */
  deleteDBInstance(params: DocDB.Types.DeleteDBInstanceMessage, callback?: (err: AWSError, data: DocDB.Types.DeleteDBInstanceResult) => void): Request<DocDB.Types.DeleteDBInstanceResult, AWSError>;
  /**
   * Deletes a previously provisioned instance.
   */
  deleteDBInstance(callback?: (err: AWSError, data: DocDB.Types.DeleteDBInstanceResult) => void): Request<DocDB.Types.DeleteDBInstanceResult, AWSError>;
  /**
   * Deletes a subnet group.  The specified database subnet group must not be associated with any DB instances. 
   */
  deleteDBSubnetGroup(params: DocDB.Types.DeleteDBSubnetGroupMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a subnet group.  The specified database subnet group must not be associated with any DB instances. 
   */
  deleteDBSubnetGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Amazon DocumentDB event notification subscription.
   */
  deleteEventSubscription(params: DocDB.Types.DeleteEventSubscriptionMessage, callback?: (err: AWSError, data: DocDB.Types.DeleteEventSubscriptionResult) => void): Request<DocDB.Types.DeleteEventSubscriptionResult, AWSError>;
  /**
   * Deletes an Amazon DocumentDB event notification subscription.
   */
  deleteEventSubscription(callback?: (err: AWSError, data: DocDB.Types.DeleteEventSubscriptionResult) => void): Request<DocDB.Types.DeleteEventSubscriptionResult, AWSError>;
  /**
   * Deletes a global cluster. The primary and secondary clusters must already be detached or deleted before attempting to delete a global cluster.  This action only applies to Amazon DocumentDB clusters. 
   */
  deleteGlobalCluster(params: DocDB.Types.DeleteGlobalClusterMessage, callback?: (err: AWSError, data: DocDB.Types.DeleteGlobalClusterResult) => void): Request<DocDB.Types.DeleteGlobalClusterResult, AWSError>;
  /**
   * Deletes a global cluster. The primary and secondary clusters must already be detached or deleted before attempting to delete a global cluster.  This action only applies to Amazon DocumentDB clusters. 
   */
  deleteGlobalCluster(callback?: (err: AWSError, data: DocDB.Types.DeleteGlobalClusterResult) => void): Request<DocDB.Types.DeleteGlobalClusterResult, AWSError>;
  /**
   * Returns a list of certificate authority (CA) certificates provided by Amazon DocumentDB for this account.
   */
  describeCertificates(params: DocDB.Types.DescribeCertificatesMessage, callback?: (err: AWSError, data: DocDB.Types.CertificateMessage) => void): Request<DocDB.Types.CertificateMessage, AWSError>;
  /**
   * Returns a list of certificate authority (CA) certificates provided by Amazon DocumentDB for this account.
   */
  describeCertificates(callback?: (err: AWSError, data: DocDB.Types.CertificateMessage) => void): Request<DocDB.Types.CertificateMessage, AWSError>;
  /**
   * Returns a list of DBClusterParameterGroup descriptions. If a DBClusterParameterGroupName parameter is specified, the list contains only the description of the specified cluster parameter group. 
   */
  describeDBClusterParameterGroups(params: DocDB.Types.DescribeDBClusterParameterGroupsMessage, callback?: (err: AWSError, data: DocDB.Types.DBClusterParameterGroupsMessage) => void): Request<DocDB.Types.DBClusterParameterGroupsMessage, AWSError>;
  /**
   * Returns a list of DBClusterParameterGroup descriptions. If a DBClusterParameterGroupName parameter is specified, the list contains only the description of the specified cluster parameter group. 
   */
  describeDBClusterParameterGroups(callback?: (err: AWSError, data: DocDB.Types.DBClusterParameterGroupsMessage) => void): Request<DocDB.Types.DBClusterParameterGroupsMessage, AWSError>;
  /**
   * Returns the detailed parameter list for a particular cluster parameter group.
   */
  describeDBClusterParameters(params: DocDB.Types.DescribeDBClusterParametersMessage, callback?: (err: AWSError, data: DocDB.Types.DBClusterParameterGroupDetails) => void): Request<DocDB.Types.DBClusterParameterGroupDetails, AWSError>;
  /**
   * Returns the detailed parameter list for a particular cluster parameter group.
   */
  describeDBClusterParameters(callback?: (err: AWSError, data: DocDB.Types.DBClusterParameterGroupDetails) => void): Request<DocDB.Types.DBClusterParameterGroupDetails, AWSError>;
  /**
   * Returns a list of cluster snapshot attribute names and values for a manual DB cluster snapshot. When you share snapshots with other accounts, DescribeDBClusterSnapshotAttributes returns the restore attribute and a list of IDs for the accounts that are authorized to copy or restore the manual cluster snapshot. If all is included in the list of values for the restore attribute, then the manual cluster snapshot is public and can be copied or restored by all accounts.
   */
  describeDBClusterSnapshotAttributes(params: DocDB.Types.DescribeDBClusterSnapshotAttributesMessage, callback?: (err: AWSError, data: DocDB.Types.DescribeDBClusterSnapshotAttributesResult) => void): Request<DocDB.Types.DescribeDBClusterSnapshotAttributesResult, AWSError>;
  /**
   * Returns a list of cluster snapshot attribute names and values for a manual DB cluster snapshot. When you share snapshots with other accounts, DescribeDBClusterSnapshotAttributes returns the restore attribute and a list of IDs for the accounts that are authorized to copy or restore the manual cluster snapshot. If all is included in the list of values for the restore attribute, then the manual cluster snapshot is public and can be copied or restored by all accounts.
   */
  describeDBClusterSnapshotAttributes(callback?: (err: AWSError, data: DocDB.Types.DescribeDBClusterSnapshotAttributesResult) => void): Request<DocDB.Types.DescribeDBClusterSnapshotAttributesResult, AWSError>;
  /**
   * Returns information about cluster snapshots. This API operation supports pagination.
   */
  describeDBClusterSnapshots(params: DocDB.Types.DescribeDBClusterSnapshotsMessage, callback?: (err: AWSError, data: DocDB.Types.DBClusterSnapshotMessage) => void): Request<DocDB.Types.DBClusterSnapshotMessage, AWSError>;
  /**
   * Returns information about cluster snapshots. This API operation supports pagination.
   */
  describeDBClusterSnapshots(callback?: (err: AWSError, data: DocDB.Types.DBClusterSnapshotMessage) => void): Request<DocDB.Types.DBClusterSnapshotMessage, AWSError>;
  /**
   * Returns information about provisioned Amazon DocumentDB clusters. This API operation supports pagination. For certain management features such as cluster and instance lifecycle management, Amazon DocumentDB leverages operational technology that is shared with Amazon RDS and Amazon Neptune. Use the filterName=engine,Values=docdb filter parameter to return only Amazon DocumentDB clusters.
   */
  describeDBClusters(params: DocDB.Types.DescribeDBClustersMessage, callback?: (err: AWSError, data: DocDB.Types.DBClusterMessage) => void): Request<DocDB.Types.DBClusterMessage, AWSError>;
  /**
   * Returns information about provisioned Amazon DocumentDB clusters. This API operation supports pagination. For certain management features such as cluster and instance lifecycle management, Amazon DocumentDB leverages operational technology that is shared with Amazon RDS and Amazon Neptune. Use the filterName=engine,Values=docdb filter parameter to return only Amazon DocumentDB clusters.
   */
  describeDBClusters(callback?: (err: AWSError, data: DocDB.Types.DBClusterMessage) => void): Request<DocDB.Types.DBClusterMessage, AWSError>;
  /**
   * Returns a list of the available engines.
   */
  describeDBEngineVersions(params: DocDB.Types.DescribeDBEngineVersionsMessage, callback?: (err: AWSError, data: DocDB.Types.DBEngineVersionMessage) => void): Request<DocDB.Types.DBEngineVersionMessage, AWSError>;
  /**
   * Returns a list of the available engines.
   */
  describeDBEngineVersions(callback?: (err: AWSError, data: DocDB.Types.DBEngineVersionMessage) => void): Request<DocDB.Types.DBEngineVersionMessage, AWSError>;
  /**
   * Returns information about provisioned Amazon DocumentDB instances. This API supports pagination.
   */
  describeDBInstances(params: DocDB.Types.DescribeDBInstancesMessage, callback?: (err: AWSError, data: DocDB.Types.DBInstanceMessage) => void): Request<DocDB.Types.DBInstanceMessage, AWSError>;
  /**
   * Returns information about provisioned Amazon DocumentDB instances. This API supports pagination.
   */
  describeDBInstances(callback?: (err: AWSError, data: DocDB.Types.DBInstanceMessage) => void): Request<DocDB.Types.DBInstanceMessage, AWSError>;
  /**
   * Returns a list of DBSubnetGroup descriptions. If a DBSubnetGroupName is specified, the list will contain only the descriptions of the specified DBSubnetGroup.
   */
  describeDBSubnetGroups(params: DocDB.Types.DescribeDBSubnetGroupsMessage, callback?: (err: AWSError, data: DocDB.Types.DBSubnetGroupMessage) => void): Request<DocDB.Types.DBSubnetGroupMessage, AWSError>;
  /**
   * Returns a list of DBSubnetGroup descriptions. If a DBSubnetGroupName is specified, the list will contain only the descriptions of the specified DBSubnetGroup.
   */
  describeDBSubnetGroups(callback?: (err: AWSError, data: DocDB.Types.DBSubnetGroupMessage) => void): Request<DocDB.Types.DBSubnetGroupMessage, AWSError>;
  /**
   * Returns the default engine and system parameter information for the cluster database engine.
   */
  describeEngineDefaultClusterParameters(params: DocDB.Types.DescribeEngineDefaultClusterParametersMessage, callback?: (err: AWSError, data: DocDB.Types.DescribeEngineDefaultClusterParametersResult) => void): Request<DocDB.Types.DescribeEngineDefaultClusterParametersResult, AWSError>;
  /**
   * Returns the default engine and system parameter information for the cluster database engine.
   */
  describeEngineDefaultClusterParameters(callback?: (err: AWSError, data: DocDB.Types.DescribeEngineDefaultClusterParametersResult) => void): Request<DocDB.Types.DescribeEngineDefaultClusterParametersResult, AWSError>;
  /**
   * Displays a list of categories for all event source types, or, if specified, for a specified source type. 
   */
  describeEventCategories(params: DocDB.Types.DescribeEventCategoriesMessage, callback?: (err: AWSError, data: DocDB.Types.EventCategoriesMessage) => void): Request<DocDB.Types.EventCategoriesMessage, AWSError>;
  /**
   * Displays a list of categories for all event source types, or, if specified, for a specified source type. 
   */
  describeEventCategories(callback?: (err: AWSError, data: DocDB.Types.EventCategoriesMessage) => void): Request<DocDB.Types.EventCategoriesMessage, AWSError>;
  /**
   * Lists all the subscription descriptions for a customer account. The description for a subscription includes SubscriptionName, SNSTopicARN, CustomerID, SourceType, SourceID, CreationTime, and Status. If you specify a SubscriptionName, lists the description for that subscription.
   */
  describeEventSubscriptions(params: DocDB.Types.DescribeEventSubscriptionsMessage, callback?: (err: AWSError, data: DocDB.Types.EventSubscriptionsMessage) => void): Request<DocDB.Types.EventSubscriptionsMessage, AWSError>;
  /**
   * Lists all the subscription descriptions for a customer account. The description for a subscription includes SubscriptionName, SNSTopicARN, CustomerID, SourceType, SourceID, CreationTime, and Status. If you specify a SubscriptionName, lists the description for that subscription.
   */
  describeEventSubscriptions(callback?: (err: AWSError, data: DocDB.Types.EventSubscriptionsMessage) => void): Request<DocDB.Types.EventSubscriptionsMessage, AWSError>;
  /**
   * Returns events related to instances, security groups, snapshots, and DB parameter groups for the past 14 days. You can obtain events specific to a particular DB instance, security group, snapshot, or parameter group by providing the name as a parameter. By default, the events of the past hour are returned.
   */
  describeEvents(params: DocDB.Types.DescribeEventsMessage, callback?: (err: AWSError, data: DocDB.Types.EventsMessage) => void): Request<DocDB.Types.EventsMessage, AWSError>;
  /**
   * Returns events related to instances, security groups, snapshots, and DB parameter groups for the past 14 days. You can obtain events specific to a particular DB instance, security group, snapshot, or parameter group by providing the name as a parameter. By default, the events of the past hour are returned.
   */
  describeEvents(callback?: (err: AWSError, data: DocDB.Types.EventsMessage) => void): Request<DocDB.Types.EventsMessage, AWSError>;
  /**
   * Returns information about Amazon DocumentDB global clusters. This API supports pagination.  This action only applies to Amazon DocumentDB clusters. 
   */
  describeGlobalClusters(params: DocDB.Types.DescribeGlobalClustersMessage, callback?: (err: AWSError, data: DocDB.Types.GlobalClustersMessage) => void): Request<DocDB.Types.GlobalClustersMessage, AWSError>;
  /**
   * Returns information about Amazon DocumentDB global clusters. This API supports pagination.  This action only applies to Amazon DocumentDB clusters. 
   */
  describeGlobalClusters(callback?: (err: AWSError, data: DocDB.Types.GlobalClustersMessage) => void): Request<DocDB.Types.GlobalClustersMessage, AWSError>;
  /**
   * Returns a list of orderable instance options for the specified engine.
   */
  describeOrderableDBInstanceOptions(params: DocDB.Types.DescribeOrderableDBInstanceOptionsMessage, callback?: (err: AWSError, data: DocDB.Types.OrderableDBInstanceOptionsMessage) => void): Request<DocDB.Types.OrderableDBInstanceOptionsMessage, AWSError>;
  /**
   * Returns a list of orderable instance options for the specified engine.
   */
  describeOrderableDBInstanceOptions(callback?: (err: AWSError, data: DocDB.Types.OrderableDBInstanceOptionsMessage) => void): Request<DocDB.Types.OrderableDBInstanceOptionsMessage, AWSError>;
  /**
   * Returns a list of resources (for example, instances) that have at least one pending maintenance action.
   */
  describePendingMaintenanceActions(params: DocDB.Types.DescribePendingMaintenanceActionsMessage, callback?: (err: AWSError, data: DocDB.Types.PendingMaintenanceActionsMessage) => void): Request<DocDB.Types.PendingMaintenanceActionsMessage, AWSError>;
  /**
   * Returns a list of resources (for example, instances) that have at least one pending maintenance action.
   */
  describePendingMaintenanceActions(callback?: (err: AWSError, data: DocDB.Types.PendingMaintenanceActionsMessage) => void): Request<DocDB.Types.PendingMaintenanceActionsMessage, AWSError>;
  /**
   * Forces a failover for a cluster. A failover for a cluster promotes one of the Amazon DocumentDB replicas (read-only instances) in the cluster to be the primary instance (the cluster writer). If the primary instance fails, Amazon DocumentDB automatically fails over to an Amazon DocumentDB replica, if one exists. You can force a failover when you want to simulate a failure of a primary instance for testing.
   */
  failoverDBCluster(params: DocDB.Types.FailoverDBClusterMessage, callback?: (err: AWSError, data: DocDB.Types.FailoverDBClusterResult) => void): Request<DocDB.Types.FailoverDBClusterResult, AWSError>;
  /**
   * Forces a failover for a cluster. A failover for a cluster promotes one of the Amazon DocumentDB replicas (read-only instances) in the cluster to be the primary instance (the cluster writer). If the primary instance fails, Amazon DocumentDB automatically fails over to an Amazon DocumentDB replica, if one exists. You can force a failover when you want to simulate a failure of a primary instance for testing.
   */
  failoverDBCluster(callback?: (err: AWSError, data: DocDB.Types.FailoverDBClusterResult) => void): Request<DocDB.Types.FailoverDBClusterResult, AWSError>;
  /**
   * Lists all tags on an Amazon DocumentDB resource.
   */
  listTagsForResource(params: DocDB.Types.ListTagsForResourceMessage, callback?: (err: AWSError, data: DocDB.Types.TagListMessage) => void): Request<DocDB.Types.TagListMessage, AWSError>;
  /**
   * Lists all tags on an Amazon DocumentDB resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: DocDB.Types.TagListMessage) => void): Request<DocDB.Types.TagListMessage, AWSError>;
  /**
   * Modifies a setting for an Amazon DocumentDB cluster. You can change one or more database configuration parameters by specifying these parameters and the new values in the request. 
   */
  modifyDBCluster(params: DocDB.Types.ModifyDBClusterMessage, callback?: (err: AWSError, data: DocDB.Types.ModifyDBClusterResult) => void): Request<DocDB.Types.ModifyDBClusterResult, AWSError>;
  /**
   * Modifies a setting for an Amazon DocumentDB cluster. You can change one or more database configuration parameters by specifying these parameters and the new values in the request. 
   */
  modifyDBCluster(callback?: (err: AWSError, data: DocDB.Types.ModifyDBClusterResult) => void): Request<DocDB.Types.ModifyDBClusterResult, AWSError>;
  /**
   *  Modifies the parameters of a cluster parameter group. To modify more than one parameter, submit a list of the following: ParameterName, ParameterValue, and ApplyMethod. A maximum of 20 parameters can be modified in a single request.   Changes to dynamic parameters are applied immediately. Changes to static parameters require a reboot or maintenance window before the change can take effect.   After you create a cluster parameter group, you should wait at least 5 minutes before creating your first cluster that uses that cluster parameter group as the default parameter group. This allows Amazon DocumentDB to fully complete the create action before the parameter group is used as the default for a new cluster. This step is especially important for parameters that are critical when creating the default database for a cluster, such as the character set for the default database defined by the character_set_database parameter. 
   */
  modifyDBClusterParameterGroup(params: DocDB.Types.ModifyDBClusterParameterGroupMessage, callback?: (err: AWSError, data: DocDB.Types.DBClusterParameterGroupNameMessage) => void): Request<DocDB.Types.DBClusterParameterGroupNameMessage, AWSError>;
  /**
   *  Modifies the parameters of a cluster parameter group. To modify more than one parameter, submit a list of the following: ParameterName, ParameterValue, and ApplyMethod. A maximum of 20 parameters can be modified in a single request.   Changes to dynamic parameters are applied immediately. Changes to static parameters require a reboot or maintenance window before the change can take effect.   After you create a cluster parameter group, you should wait at least 5 minutes before creating your first cluster that uses that cluster parameter group as the default parameter group. This allows Amazon DocumentDB to fully complete the create action before the parameter group is used as the default for a new cluster. This step is especially important for parameters that are critical when creating the default database for a cluster, such as the character set for the default database defined by the character_set_database parameter. 
   */
  modifyDBClusterParameterGroup(callback?: (err: AWSError, data: DocDB.Types.DBClusterParameterGroupNameMessage) => void): Request<DocDB.Types.DBClusterParameterGroupNameMessage, AWSError>;
  /**
   * Adds an attribute and values to, or removes an attribute and values from, a manual cluster snapshot. To share a manual cluster snapshot with other accounts, specify restore as the AttributeName, and use the ValuesToAdd parameter to add a list of IDs of the accounts that are authorized to restore the manual cluster snapshot. Use the value all to make the manual cluster snapshot public, which means that it can be copied or restored by all accounts. Do not add the all value for any manual cluster snapshots that contain private information that you don't want available to all accounts. If a manual cluster snapshot is encrypted, it can be shared, but only by specifying a list of authorized account IDs for the ValuesToAdd parameter. You can't use all as a value for that parameter in this case.
   */
  modifyDBClusterSnapshotAttribute(params: DocDB.Types.ModifyDBClusterSnapshotAttributeMessage, callback?: (err: AWSError, data: DocDB.Types.ModifyDBClusterSnapshotAttributeResult) => void): Request<DocDB.Types.ModifyDBClusterSnapshotAttributeResult, AWSError>;
  /**
   * Adds an attribute and values to, or removes an attribute and values from, a manual cluster snapshot. To share a manual cluster snapshot with other accounts, specify restore as the AttributeName, and use the ValuesToAdd parameter to add a list of IDs of the accounts that are authorized to restore the manual cluster snapshot. Use the value all to make the manual cluster snapshot public, which means that it can be copied or restored by all accounts. Do not add the all value for any manual cluster snapshots that contain private information that you don't want available to all accounts. If a manual cluster snapshot is encrypted, it can be shared, but only by specifying a list of authorized account IDs for the ValuesToAdd parameter. You can't use all as a value for that parameter in this case.
   */
  modifyDBClusterSnapshotAttribute(callback?: (err: AWSError, data: DocDB.Types.ModifyDBClusterSnapshotAttributeResult) => void): Request<DocDB.Types.ModifyDBClusterSnapshotAttributeResult, AWSError>;
  /**
   * Modifies settings for an instance. You can change one or more database configuration parameters by specifying these parameters and the new values in the request.
   */
  modifyDBInstance(params: DocDB.Types.ModifyDBInstanceMessage, callback?: (err: AWSError, data: DocDB.Types.ModifyDBInstanceResult) => void): Request<DocDB.Types.ModifyDBInstanceResult, AWSError>;
  /**
   * Modifies settings for an instance. You can change one or more database configuration parameters by specifying these parameters and the new values in the request.
   */
  modifyDBInstance(callback?: (err: AWSError, data: DocDB.Types.ModifyDBInstanceResult) => void): Request<DocDB.Types.ModifyDBInstanceResult, AWSError>;
  /**
   * Modifies an existing subnet group. subnet groups must contain at least one subnet in at least two Availability Zones in the Region.
   */
  modifyDBSubnetGroup(params: DocDB.Types.ModifyDBSubnetGroupMessage, callback?: (err: AWSError, data: DocDB.Types.ModifyDBSubnetGroupResult) => void): Request<DocDB.Types.ModifyDBSubnetGroupResult, AWSError>;
  /**
   * Modifies an existing subnet group. subnet groups must contain at least one subnet in at least two Availability Zones in the Region.
   */
  modifyDBSubnetGroup(callback?: (err: AWSError, data: DocDB.Types.ModifyDBSubnetGroupResult) => void): Request<DocDB.Types.ModifyDBSubnetGroupResult, AWSError>;
  /**
   * Modifies an existing Amazon DocumentDB event notification subscription.
   */
  modifyEventSubscription(params: DocDB.Types.ModifyEventSubscriptionMessage, callback?: (err: AWSError, data: DocDB.Types.ModifyEventSubscriptionResult) => void): Request<DocDB.Types.ModifyEventSubscriptionResult, AWSError>;
  /**
   * Modifies an existing Amazon DocumentDB event notification subscription.
   */
  modifyEventSubscription(callback?: (err: AWSError, data: DocDB.Types.ModifyEventSubscriptionResult) => void): Request<DocDB.Types.ModifyEventSubscriptionResult, AWSError>;
  /**
   * Modify a setting for an Amazon DocumentDB global cluster. You can change one or more configuration parameters (for example: deletion protection), or the global cluster identifier by specifying these parameters and the new values in the request.  This action only applies to Amazon DocumentDB clusters. 
   */
  modifyGlobalCluster(params: DocDB.Types.ModifyGlobalClusterMessage, callback?: (err: AWSError, data: DocDB.Types.ModifyGlobalClusterResult) => void): Request<DocDB.Types.ModifyGlobalClusterResult, AWSError>;
  /**
   * Modify a setting for an Amazon DocumentDB global cluster. You can change one or more configuration parameters (for example: deletion protection), or the global cluster identifier by specifying these parameters and the new values in the request.  This action only applies to Amazon DocumentDB clusters. 
   */
  modifyGlobalCluster(callback?: (err: AWSError, data: DocDB.Types.ModifyGlobalClusterResult) => void): Request<DocDB.Types.ModifyGlobalClusterResult, AWSError>;
  /**
   * You might need to reboot your instance, usually for maintenance reasons. For example, if you make certain changes, or if you change the cluster parameter group that is associated with the instance, you must reboot the instance for the changes to take effect.  Rebooting an instance restarts the database engine service. Rebooting an instance results in a momentary outage, during which the instance status is set to rebooting. 
   */
  rebootDBInstance(params: DocDB.Types.RebootDBInstanceMessage, callback?: (err: AWSError, data: DocDB.Types.RebootDBInstanceResult) => void): Request<DocDB.Types.RebootDBInstanceResult, AWSError>;
  /**
   * You might need to reboot your instance, usually for maintenance reasons. For example, if you make certain changes, or if you change the cluster parameter group that is associated with the instance, you must reboot the instance for the changes to take effect.  Rebooting an instance restarts the database engine service. Rebooting an instance results in a momentary outage, during which the instance status is set to rebooting. 
   */
  rebootDBInstance(callback?: (err: AWSError, data: DocDB.Types.RebootDBInstanceResult) => void): Request<DocDB.Types.RebootDBInstanceResult, AWSError>;
  /**
   * Detaches an Amazon DocumentDB secondary cluster from a global cluster. The cluster becomes a standalone cluster with read-write capability instead of being read-only and receiving data from a primary in a different region.   This action only applies to Amazon DocumentDB clusters. 
   */
  removeFromGlobalCluster(params: DocDB.Types.RemoveFromGlobalClusterMessage, callback?: (err: AWSError, data: DocDB.Types.RemoveFromGlobalClusterResult) => void): Request<DocDB.Types.RemoveFromGlobalClusterResult, AWSError>;
  /**
   * Detaches an Amazon DocumentDB secondary cluster from a global cluster. The cluster becomes a standalone cluster with read-write capability instead of being read-only and receiving data from a primary in a different region.   This action only applies to Amazon DocumentDB clusters. 
   */
  removeFromGlobalCluster(callback?: (err: AWSError, data: DocDB.Types.RemoveFromGlobalClusterResult) => void): Request<DocDB.Types.RemoveFromGlobalClusterResult, AWSError>;
  /**
   * Removes a source identifier from an existing Amazon DocumentDB event notification subscription.
   */
  removeSourceIdentifierFromSubscription(params: DocDB.Types.RemoveSourceIdentifierFromSubscriptionMessage, callback?: (err: AWSError, data: DocDB.Types.RemoveSourceIdentifierFromSubscriptionResult) => void): Request<DocDB.Types.RemoveSourceIdentifierFromSubscriptionResult, AWSError>;
  /**
   * Removes a source identifier from an existing Amazon DocumentDB event notification subscription.
   */
  removeSourceIdentifierFromSubscription(callback?: (err: AWSError, data: DocDB.Types.RemoveSourceIdentifierFromSubscriptionResult) => void): Request<DocDB.Types.RemoveSourceIdentifierFromSubscriptionResult, AWSError>;
  /**
   * Removes metadata tags from an Amazon DocumentDB resource.
   */
  removeTagsFromResource(params: DocDB.Types.RemoveTagsFromResourceMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes metadata tags from an Amazon DocumentDB resource.
   */
  removeTagsFromResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Modifies the parameters of a cluster parameter group to the default value. To reset specific parameters, submit a list of the following: ParameterName and ApplyMethod. To reset the entire cluster parameter group, specify the DBClusterParameterGroupName and ResetAllParameters parameters.   When you reset the entire group, dynamic parameters are updated immediately and static parameters are set to pending-reboot to take effect on the next DB instance reboot.
   */
  resetDBClusterParameterGroup(params: DocDB.Types.ResetDBClusterParameterGroupMessage, callback?: (err: AWSError, data: DocDB.Types.DBClusterParameterGroupNameMessage) => void): Request<DocDB.Types.DBClusterParameterGroupNameMessage, AWSError>;
  /**
   *  Modifies the parameters of a cluster parameter group to the default value. To reset specific parameters, submit a list of the following: ParameterName and ApplyMethod. To reset the entire cluster parameter group, specify the DBClusterParameterGroupName and ResetAllParameters parameters.   When you reset the entire group, dynamic parameters are updated immediately and static parameters are set to pending-reboot to take effect on the next DB instance reboot.
   */
  resetDBClusterParameterGroup(callback?: (err: AWSError, data: DocDB.Types.DBClusterParameterGroupNameMessage) => void): Request<DocDB.Types.DBClusterParameterGroupNameMessage, AWSError>;
  /**
   * Creates a new cluster from a snapshot or cluster snapshot. If a snapshot is specified, the target cluster is created from the source DB snapshot with a default configuration and default security group. If a cluster snapshot is specified, the target cluster is created from the source cluster restore point with the same configuration as the original source DB cluster, except that the new cluster is created with the default security group.
   */
  restoreDBClusterFromSnapshot(params: DocDB.Types.RestoreDBClusterFromSnapshotMessage, callback?: (err: AWSError, data: DocDB.Types.RestoreDBClusterFromSnapshotResult) => void): Request<DocDB.Types.RestoreDBClusterFromSnapshotResult, AWSError>;
  /**
   * Creates a new cluster from a snapshot or cluster snapshot. If a snapshot is specified, the target cluster is created from the source DB snapshot with a default configuration and default security group. If a cluster snapshot is specified, the target cluster is created from the source cluster restore point with the same configuration as the original source DB cluster, except that the new cluster is created with the default security group.
   */
  restoreDBClusterFromSnapshot(callback?: (err: AWSError, data: DocDB.Types.RestoreDBClusterFromSnapshotResult) => void): Request<DocDB.Types.RestoreDBClusterFromSnapshotResult, AWSError>;
  /**
   * Restores a cluster to an arbitrary point in time. Users can restore to any point in time before LatestRestorableTime for up to BackupRetentionPeriod days. The target cluster is created from the source cluster with the same configuration as the original cluster, except that the new cluster is created with the default security group. 
   */
  restoreDBClusterToPointInTime(params: DocDB.Types.RestoreDBClusterToPointInTimeMessage, callback?: (err: AWSError, data: DocDB.Types.RestoreDBClusterToPointInTimeResult) => void): Request<DocDB.Types.RestoreDBClusterToPointInTimeResult, AWSError>;
  /**
   * Restores a cluster to an arbitrary point in time. Users can restore to any point in time before LatestRestorableTime for up to BackupRetentionPeriod days. The target cluster is created from the source cluster with the same configuration as the original cluster, except that the new cluster is created with the default security group. 
   */
  restoreDBClusterToPointInTime(callback?: (err: AWSError, data: DocDB.Types.RestoreDBClusterToPointInTimeResult) => void): Request<DocDB.Types.RestoreDBClusterToPointInTimeResult, AWSError>;
  /**
   * Restarts the stopped cluster that is specified by DBClusterIdentifier. For more information, see Stopping and Starting an Amazon DocumentDB Cluster.
   */
  startDBCluster(params: DocDB.Types.StartDBClusterMessage, callback?: (err: AWSError, data: DocDB.Types.StartDBClusterResult) => void): Request<DocDB.Types.StartDBClusterResult, AWSError>;
  /**
   * Restarts the stopped cluster that is specified by DBClusterIdentifier. For more information, see Stopping and Starting an Amazon DocumentDB Cluster.
   */
  startDBCluster(callback?: (err: AWSError, data: DocDB.Types.StartDBClusterResult) => void): Request<DocDB.Types.StartDBClusterResult, AWSError>;
  /**
   * Stops the running cluster that is specified by DBClusterIdentifier. The cluster must be in the available state. For more information, see Stopping and Starting an Amazon DocumentDB Cluster.
   */
  stopDBCluster(params: DocDB.Types.StopDBClusterMessage, callback?: (err: AWSError, data: DocDB.Types.StopDBClusterResult) => void): Request<DocDB.Types.StopDBClusterResult, AWSError>;
  /**
   * Stops the running cluster that is specified by DBClusterIdentifier. The cluster must be in the available state. For more information, see Stopping and Starting an Amazon DocumentDB Cluster.
   */
  stopDBCluster(callback?: (err: AWSError, data: DocDB.Types.StopDBClusterResult) => void): Request<DocDB.Types.StopDBClusterResult, AWSError>;
  /**
   * Waits for the dBInstanceAvailable state by periodically calling the underlying DocDB.describeDBInstancesoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBInstanceAvailable", params: DocDB.Types.DescribeDBInstancesMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: DocDB.Types.DBInstanceMessage) => void): Request<DocDB.Types.DBInstanceMessage, AWSError>;
  /**
   * Waits for the dBInstanceAvailable state by periodically calling the underlying DocDB.describeDBInstancesoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBInstanceAvailable", callback?: (err: AWSError, data: DocDB.Types.DBInstanceMessage) => void): Request<DocDB.Types.DBInstanceMessage, AWSError>;
  /**
   * Waits for the dBInstanceDeleted state by periodically calling the underlying DocDB.describeDBInstancesoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBInstanceDeleted", params: DocDB.Types.DescribeDBInstancesMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: DocDB.Types.DBInstanceMessage) => void): Request<DocDB.Types.DBInstanceMessage, AWSError>;
  /**
   * Waits for the dBInstanceDeleted state by periodically calling the underlying DocDB.describeDBInstancesoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBInstanceDeleted", callback?: (err: AWSError, data: DocDB.Types.DBInstanceMessage) => void): Request<DocDB.Types.DBInstanceMessage, AWSError>;
}
declare namespace DocDB {
  export interface AddSourceIdentifierToSubscriptionMessage {
    /**
     * The name of the Amazon DocumentDB event notification subscription that you want to add a source identifier to.
     */
    SubscriptionName: String;
    /**
     * The identifier of the event source to be added:   If the source type is an instance, a DBInstanceIdentifier must be provided.   If the source type is a security group, a DBSecurityGroupName must be provided.   If the source type is a parameter group, a DBParameterGroupName must be provided.   If the source type is a snapshot, a DBSnapshotIdentifier must be provided.  
     */
    SourceIdentifier: String;
  }
  export interface AddSourceIdentifierToSubscriptionResult {
    EventSubscription?: EventSubscription;
  }
  export interface AddTagsToResourceMessage {
    /**
     * The Amazon DocumentDB resource that the tags are added to. This value is an Amazon Resource Name .
     */
    ResourceName: String;
    /**
     * The tags to be assigned to the Amazon DocumentDB resource.
     */
    Tags: TagList;
  }
  export type ApplyMethod = "immediate"|"pending-reboot"|string;
  export interface ApplyPendingMaintenanceActionMessage {
    /**
     * The Amazon Resource Name (ARN) of the resource that the pending maintenance action applies to.
     */
    ResourceIdentifier: String;
    /**
     * The pending maintenance action to apply to this resource. Valid values: system-update, db-upgrade 
     */
    ApplyAction: String;
    /**
     * A value that specifies the type of opt-in request or undoes an opt-in request. An opt-in request of type immediate can't be undone. Valid values:    immediate - Apply the maintenance action immediately.    next-maintenance - Apply the maintenance action during the next maintenance window for the resource.     undo-opt-in - Cancel any existing next-maintenance opt-in requests.  
     */
    OptInType: String;
  }
  export interface ApplyPendingMaintenanceActionResult {
    ResourcePendingMaintenanceActions?: ResourcePendingMaintenanceActions;
  }
  export type AttributeValueList = String[];
  export interface AvailabilityZone {
    /**
     * The name of the Availability Zone.
     */
    Name?: String;
  }
  export type AvailabilityZoneList = AvailabilityZone[];
  export type AvailabilityZones = String[];
  export type Boolean = boolean;
  export type BooleanOptional = boolean;
  export interface Certificate {
    /**
     * The unique key that identifies a certificate. Example: rds-ca-2019 
     */
    CertificateIdentifier?: String;
    /**
     * The type of the certificate. Example: CA 
     */
    CertificateType?: String;
    /**
     * The thumbprint of the certificate.
     */
    Thumbprint?: String;
    /**
     * The starting date-time from which the certificate is valid. Example: 2019-07-31T17:57:09Z 
     */
    ValidFrom?: TStamp;
    /**
     * The date-time after which the certificate is no longer valid. Example: 2024-07-31T17:57:09Z 
     */
    ValidTill?: TStamp;
    /**
     * The Amazon Resource Name (ARN) for the certificate. Example: arn:aws:rds:us-east-1::cert:rds-ca-2019 
     */
    CertificateArn?: String;
  }
  export type CertificateList = Certificate[];
  export interface CertificateMessage {
    /**
     * A list of certificates for this account.
     */
    Certificates?: CertificateList;
    /**
     * An optional pagination token provided if the number of records retrieved is greater than MaxRecords. If this parameter is specified, the marker specifies the next record in the list. Including the value of Marker in the next call to DescribeCertificates results in the next page of certificates.
     */
    Marker?: String;
  }
  export interface CloudwatchLogsExportConfiguration {
    /**
     * The list of log types to enable.
     */
    EnableLogTypes?: LogTypeList;
    /**
     * The list of log types to disable.
     */
    DisableLogTypes?: LogTypeList;
  }
  export interface CopyDBClusterParameterGroupMessage {
    /**
     * The identifier or Amazon Resource Name (ARN) for the source cluster parameter group. Constraints:   Must specify a valid cluster parameter group.   If the source cluster parameter group is in the same Region as the copy, specify a valid parameter group identifier; for example, my-db-cluster-param-group, or a valid ARN.   If the source parameter group is in a different Region than the copy, specify a valid cluster parameter group ARN; for example, arn:aws:rds:us-east-1:123456789012:sample-cluster:sample-parameter-group.  
     */
    SourceDBClusterParameterGroupIdentifier: String;
    /**
     * The identifier for the copied cluster parameter group. Constraints:   Cannot be null, empty, or blank.   Must contain from 1 to 255 letters, numbers, or hyphens.    The first character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.    Example: my-cluster-param-group1 
     */
    TargetDBClusterParameterGroupIdentifier: String;
    /**
     * A description for the copied cluster parameter group.
     */
    TargetDBClusterParameterGroupDescription: String;
    /**
     * The tags that are to be assigned to the parameter group.
     */
    Tags?: TagList;
  }
  export interface CopyDBClusterParameterGroupResult {
    DBClusterParameterGroup?: DBClusterParameterGroup;
  }
  export interface CopyDBClusterSnapshotMessage {
    /**
     * The identifier of the cluster snapshot to copy. This parameter is not case sensitive. Constraints:   Must specify a valid system snapshot in the available state.   If the source snapshot is in the same Region as the copy, specify a valid snapshot identifier.   If the source snapshot is in a different Region than the copy, specify a valid cluster snapshot ARN.   Example: my-cluster-snapshot1 
     */
    SourceDBClusterSnapshotIdentifier: String;
    /**
     * The identifier of the new cluster snapshot to create from the source cluster snapshot. This parameter is not case sensitive. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.    The first character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.    Example: my-cluster-snapshot2 
     */
    TargetDBClusterSnapshotIdentifier: String;
    /**
     * The KMS key ID for an encrypted cluster snapshot. The KMS key ID is the Amazon Resource Name (ARN), KMS key identifier, or the KMS key alias for the KMS encryption key.  If you copy an encrypted cluster snapshot from your account, you can specify a value for KmsKeyId to encrypt the copy with a new KMS encryption key. If you don't specify a value for KmsKeyId, then the copy of the cluster snapshot is encrypted with the same KMS key as the source cluster snapshot. If you copy an encrypted cluster snapshot that is shared from another account, then you must specify a value for KmsKeyId. To copy an encrypted cluster snapshot to another Region, set KmsKeyId to the KMS key ID that you want to use to encrypt the copy of the cluster snapshot in the destination Region. KMS encryption keys are specific to the Region that they are created in, and you can't use encryption keys from one Region in another Region. If you copy an unencrypted cluster snapshot and specify a value for the KmsKeyId parameter, an error is returned.
     */
    KmsKeyId?: String;
    /**
     * The URL that contains a Signature Version 4 signed request for theCopyDBClusterSnapshot API action in the Region that contains the source cluster snapshot to copy. You must use the PreSignedUrl parameter when copying a cluster snapshot from another Region. If you are using an Amazon Web Services SDK tool or the CLI, you can specify SourceRegion (or --source-region for the CLI) instead of specifying PreSignedUrl manually. Specifying SourceRegion autogenerates a pre-signed URL that is a valid request for the operation that can be executed in the source Region. The presigned URL must be a valid request for the CopyDBClusterSnapshot API action that can be executed in the source Region that contains the cluster snapshot to be copied. The presigned URL request must contain the following parameter values:    SourceRegion - The ID of the region that contains the snapshot to be copied.    SourceDBClusterSnapshotIdentifier - The identifier for the the encrypted cluster snapshot to be copied. This identifier must be in the Amazon Resource Name (ARN) format for the source Region. For example, if you are copying an encrypted cluster snapshot from the us-east-1 Region, then your SourceDBClusterSnapshotIdentifier looks something like the following: arn:aws:rds:us-east-1:12345678012:sample-cluster:sample-cluster-snapshot.    TargetDBClusterSnapshotIdentifier - The identifier for the new cluster snapshot to be created. This parameter isn't case sensitive.  
     */
    PreSignedUrl?: String;
    /**
     * Set to true to copy all tags from the source cluster snapshot to the target cluster snapshot, and otherwise false. The default is false.
     */
    CopyTags?: BooleanOptional;
    /**
     * The tags to be assigned to the cluster snapshot.
     */
    Tags?: TagList;
  }
  export interface CopyDBClusterSnapshotResult {
    DBClusterSnapshot?: DBClusterSnapshot;
  }
  export interface CreateDBClusterMessage {
    /**
     * A list of Amazon EC2 Availability Zones that instances in the cluster can be created in.
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * The number of days for which automated backups are retained. You must specify a minimum value of 1. Default: 1 Constraints:   Must be a value from 1 to 35.  
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * The cluster identifier. This parameter is stored as a lowercase string. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.    The first character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.    Example: my-cluster 
     */
    DBClusterIdentifier: String;
    /**
     * The name of the cluster parameter group to associate with this cluster.
     */
    DBClusterParameterGroupName?: String;
    /**
     * A list of EC2 VPC security groups to associate with this cluster. 
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * A subnet group to associate with this cluster. Constraints: Must match the name of an existing DBSubnetGroup. Must not be default. Example: mySubnetgroup 
     */
    DBSubnetGroupName?: String;
    /**
     * The name of the database engine to be used for this cluster. Valid values: docdb 
     */
    Engine: String;
    /**
     * The version number of the database engine to use. The --engine-version will default to the latest major engine version. For production workloads, we recommend explicitly declaring this parameter with the intended major engine version.
     */
    EngineVersion?: String;
    /**
     * The port number on which the instances in the cluster accept connections.
     */
    Port?: IntegerOptional;
    /**
     * The name of the master user for the cluster. Constraints:   Must be from 1 to 63 letters or numbers.   The first character must be a letter.   Cannot be a reserved word for the chosen database engine.   
     */
    MasterUsername?: String;
    /**
     * The password for the master database user. This password can contain any printable ASCII character except forward slash (/), double quote ("), or the "at" symbol (@). Constraints: Must contain from 8 to 100 characters.
     */
    MasterUserPassword?: String;
    /**
     * The daily time range during which automated backups are created if automated backups are enabled using the BackupRetentionPeriod parameter.  The default is a 30-minute window selected at random from an 8-hour block of time for each Region.  Constraints:   Must be in the format hh24:mi-hh24:mi.   Must be in Universal Coordinated Time (UTC).   Must not conflict with the preferred maintenance window.    Must be at least 30 minutes.  
     */
    PreferredBackupWindow?: String;
    /**
     * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC). Format: ddd:hh24:mi-ddd:hh24:mi  The default is a 30-minute window selected at random from an 8-hour block of time for each Region, occurring on a random day of the week. Valid days: Mon, Tue, Wed, Thu, Fri, Sat, Sun Constraints: Minimum 30-minute window.
     */
    PreferredMaintenanceWindow?: String;
    /**
     * The tags to be assigned to the cluster.
     */
    Tags?: TagList;
    /**
     * Specifies whether the cluster is encrypted.
     */
    StorageEncrypted?: BooleanOptional;
    /**
     * The KMS key identifier for an encrypted cluster. The KMS key identifier is the Amazon Resource Name (ARN) for the KMS encryption key. If you are creating a cluster using the same account that owns the KMS encryption key that is used to encrypt the new cluster, you can use the KMS key alias instead of the ARN for the KMS encryption key. If an encryption key is not specified in KmsKeyId:    If the StorageEncrypted parameter is true, Amazon DocumentDB uses your default encryption key.    KMS creates the default encryption key for your account. Your account has a different default encryption key for each Regions.
     */
    KmsKeyId?: String;
    /**
     * Not currently supported. 
     */
    PreSignedUrl?: String;
    /**
     * A list of log types that need to be enabled for exporting to Amazon CloudWatch Logs. You can enable audit logs or profiler logs. For more information, see  Auditing Amazon DocumentDB Events and  Profiling Amazon DocumentDB Operations. 
     */
    EnableCloudwatchLogsExports?: LogTypeList;
    /**
     * Specifies whether this cluster can be deleted. If DeletionProtection is enabled, the cluster cannot be deleted unless it is modified and DeletionProtection is disabled. DeletionProtection protects clusters from being accidentally deleted.
     */
    DeletionProtection?: BooleanOptional;
    /**
     * The cluster identifier of the new global cluster.
     */
    GlobalClusterIdentifier?: GlobalClusterIdentifier;
  }
  export interface CreateDBClusterParameterGroupMessage {
    /**
     * The name of the cluster parameter group. Constraints:   Must not match the name of an existing DBClusterParameterGroup.    This value is stored as a lowercase string. 
     */
    DBClusterParameterGroupName: String;
    /**
     * The cluster parameter group family name.
     */
    DBParameterGroupFamily: String;
    /**
     * The description for the cluster parameter group.
     */
    Description: String;
    /**
     * The tags to be assigned to the cluster parameter group.
     */
    Tags?: TagList;
  }
  export interface CreateDBClusterParameterGroupResult {
    DBClusterParameterGroup?: DBClusterParameterGroup;
  }
  export interface CreateDBClusterResult {
    DBCluster?: DBCluster;
  }
  export interface CreateDBClusterSnapshotMessage {
    /**
     * The identifier of the cluster snapshot. This parameter is stored as a lowercase string. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   The first character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.    Example: my-cluster-snapshot1 
     */
    DBClusterSnapshotIdentifier: String;
    /**
     * The identifier of the cluster to create a snapshot for. This parameter is not case sensitive. Constraints:   Must match the identifier of an existing DBCluster.   Example: my-cluster 
     */
    DBClusterIdentifier: String;
    /**
     * The tags to be assigned to the cluster snapshot.
     */
    Tags?: TagList;
  }
  export interface CreateDBClusterSnapshotResult {
    DBClusterSnapshot?: DBClusterSnapshot;
  }
  export interface CreateDBInstanceMessage {
    /**
     * The instance identifier. This parameter is stored as a lowercase string. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   The first character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.   Example: mydbinstance 
     */
    DBInstanceIdentifier: String;
    /**
     * The compute and memory capacity of the instance; for example, db.r5.large. 
     */
    DBInstanceClass: String;
    /**
     * The name of the database engine to be used for this instance. Valid value: docdb 
     */
    Engine: String;
    /**
     * The Amazon EC2 Availability Zone that the instance is created in.  Default: A random, system-chosen Availability Zone in the endpoint's Region. Example: us-east-1d 
     */
    AvailabilityZone?: String;
    /**
     * The time range each week during which system maintenance can occur, in Universal Coordinated Time (UTC).  Format: ddd:hh24:mi-ddd:hh24:mi  The default is a 30-minute window selected at random from an 8-hour block of time for each Region, occurring on a random day of the week.  Valid days: Mon, Tue, Wed, Thu, Fri, Sat, Sun Constraints: Minimum 30-minute window.
     */
    PreferredMaintenanceWindow?: String;
    /**
     * This parameter does not apply to Amazon DocumentDB. Amazon DocumentDB does not perform minor version upgrades regardless of the value set. Default: false 
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
    /**
     * The tags to be assigned to the instance. You can assign up to 10 tags to an instance.
     */
    Tags?: TagList;
    /**
     * The identifier of the cluster that the instance will belong to.
     */
    DBClusterIdentifier: String;
    /**
     * A value that specifies the order in which an Amazon DocumentDB replica is promoted to the primary instance after a failure of the existing primary instance. Default: 1 Valid values: 0-15
     */
    PromotionTier?: IntegerOptional;
  }
  export interface CreateDBInstanceResult {
    DBInstance?: DBInstance;
  }
  export interface CreateDBSubnetGroupMessage {
    /**
     * The name for the subnet group. This value is stored as a lowercase string. Constraints: Must contain no more than 255 letters, numbers, periods, underscores, spaces, or hyphens. Must not be default. Example: mySubnetgroup 
     */
    DBSubnetGroupName: String;
    /**
     * The description for the subnet group.
     */
    DBSubnetGroupDescription: String;
    /**
     * The Amazon EC2 subnet IDs for the subnet group.
     */
    SubnetIds: SubnetIdentifierList;
    /**
     * The tags to be assigned to the subnet group.
     */
    Tags?: TagList;
  }
  export interface CreateDBSubnetGroupResult {
    DBSubnetGroup?: DBSubnetGroup;
  }
  export interface CreateEventSubscriptionMessage {
    /**
     * The name of the subscription. Constraints: The name must be fewer than 255 characters.
     */
    SubscriptionName: String;
    /**
     * The Amazon Resource Name (ARN) of the SNS topic created for event notification. Amazon SNS creates the ARN when you create a topic and subscribe to it.
     */
    SnsTopicArn: String;
    /**
     * The type of source that is generating the events. For example, if you want to be notified of events generated by an instance, you would set this parameter to db-instance. If this value is not specified, all events are returned. Valid values: db-instance, db-cluster, db-parameter-group, db-security-group, db-cluster-snapshot 
     */
    SourceType?: String;
    /**
     *  A list of event categories for a SourceType that you want to subscribe to. 
     */
    EventCategories?: EventCategoriesList;
    /**
     * The list of identifiers of the event sources for which events are returned. If not specified, then all sources are included in the response. An identifier must begin with a letter and must contain only ASCII letters, digits, and hyphens; it can't end with a hyphen or contain two consecutive hyphens. Constraints:   If SourceIds are provided, SourceType must also be provided.   If the source type is an instance, a DBInstanceIdentifier must be provided.   If the source type is a security group, a DBSecurityGroupName must be provided.   If the source type is a parameter group, a DBParameterGroupName must be provided.   If the source type is a snapshot, a DBSnapshotIdentifier must be provided.  
     */
    SourceIds?: SourceIdsList;
    /**
     *  A Boolean value; set to true to activate the subscription, set to false to create the subscription but not active it. 
     */
    Enabled?: BooleanOptional;
    /**
     * The tags to be assigned to the event subscription.
     */
    Tags?: TagList;
  }
  export interface CreateEventSubscriptionResult {
    EventSubscription?: EventSubscription;
  }
  export interface CreateGlobalClusterMessage {
    /**
     * The cluster identifier of the new global cluster.
     */
    GlobalClusterIdentifier: GlobalClusterIdentifier;
    /**
     * The Amazon Resource Name (ARN) to use as the primary cluster of the global cluster. This parameter is optional.
     */
    SourceDBClusterIdentifier?: String;
    /**
     * The name of the database engine to be used for this cluster.
     */
    Engine?: String;
    /**
     * The engine version of the global cluster.
     */
    EngineVersion?: String;
    /**
     * The deletion protection setting for the new global cluster. The global cluster can't be deleted when deletion protection is enabled. 
     */
    DeletionProtection?: BooleanOptional;
    /**
     * The name for your database of up to 64 alpha-numeric characters. If you do not provide a name, Amazon DocumentDB will not create a database in the global cluster you are creating.
     */
    DatabaseName?: String;
    /**
     * The storage encryption setting for the new global cluster. 
     */
    StorageEncrypted?: BooleanOptional;
  }
  export interface CreateGlobalClusterResult {
    GlobalCluster?: GlobalCluster;
  }
  export interface DBCluster {
    /**
     * Provides the list of Amazon EC2 Availability Zones that instances in the cluster can be created in.
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * Specifies the number of days for which automatic snapshots are retained.
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * Contains a user-supplied cluster identifier. This identifier is the unique key that identifies a cluster.
     */
    DBClusterIdentifier?: String;
    /**
     * Specifies the name of the cluster parameter group for the cluster.
     */
    DBClusterParameterGroup?: String;
    /**
     * Specifies information on the subnet group that is associated with the cluster, including the name, description, and subnets in the subnet group.
     */
    DBSubnetGroup?: String;
    /**
     * Specifies the current state of this cluster.
     */
    Status?: String;
    /**
     * Specifies the progress of the operation as a percentage.
     */
    PercentProgress?: String;
    /**
     * The earliest time to which a database can be restored with point-in-time restore.
     */
    EarliestRestorableTime?: TStamp;
    /**
     * Specifies the connection endpoint for the primary instance of the cluster.
     */
    Endpoint?: String;
    /**
     * The reader endpoint for the cluster. The reader endpoint for a cluster load balances connections across the Amazon DocumentDB replicas that are available in a cluster. As clients request new connections to the reader endpoint, Amazon DocumentDB distributes the connection requests among the Amazon DocumentDB replicas in the cluster. This functionality can help balance your read workload across multiple Amazon DocumentDB replicas in your cluster.  If a failover occurs, and the Amazon DocumentDB replica that you are connected to is promoted to be the primary instance, your connection is dropped. To continue sending your read workload to other Amazon DocumentDB replicas in the cluster, you can then reconnect to the reader endpoint.
     */
    ReaderEndpoint?: String;
    /**
     * Specifies whether the cluster has instances in multiple Availability Zones.
     */
    MultiAZ?: Boolean;
    /**
     * Provides the name of the database engine to be used for this cluster.
     */
    Engine?: String;
    /**
     * Indicates the database engine version.
     */
    EngineVersion?: String;
    /**
     * Specifies the latest time to which a database can be restored with point-in-time restore.
     */
    LatestRestorableTime?: TStamp;
    /**
     * Specifies the port that the database engine is listening on.
     */
    Port?: IntegerOptional;
    /**
     * Contains the master user name for the cluster.
     */
    MasterUsername?: String;
    /**
     * Specifies the daily time range during which automated backups are created if automated backups are enabled, as determined by the BackupRetentionPeriod. 
     */
    PreferredBackupWindow?: String;
    /**
     * Specifies the weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
     */
    PreferredMaintenanceWindow?: String;
    /**
     * Contains the identifier of the source cluster if this cluster is a secondary cluster.
     */
    ReplicationSourceIdentifier?: String;
    /**
     * Contains one or more identifiers of the secondary clusters that are associated with this cluster.
     */
    ReadReplicaIdentifiers?: ReadReplicaIdentifierList;
    /**
     * Provides the list of instances that make up the cluster.
     */
    DBClusterMembers?: DBClusterMemberList;
    /**
     * Provides a list of virtual private cloud (VPC) security groups that the cluster belongs to.
     */
    VpcSecurityGroups?: VpcSecurityGroupMembershipList;
    /**
     * Specifies the ID that Amazon Route 53 assigns when you create a hosted zone.
     */
    HostedZoneId?: String;
    /**
     * Specifies whether the cluster is encrypted.
     */
    StorageEncrypted?: Boolean;
    /**
     * If StorageEncrypted is true, the KMS key identifier for the encrypted cluster.
     */
    KmsKeyId?: String;
    /**
     * The Region-unique, immutable identifier for the cluster. This identifier is found in CloudTrail log entries whenever the KMS key for the cluster is accessed.
     */
    DbClusterResourceId?: String;
    /**
     * The Amazon Resource Name (ARN) for the cluster.
     */
    DBClusterArn?: String;
    /**
     * Provides a list of the Identity and Access Management (IAM) roles that are associated with the cluster. (IAM) roles that are associated with a cluster grant permission for the cluster to access other Amazon Web Services services on your behalf.
     */
    AssociatedRoles?: DBClusterRoles;
    /**
     * Specifies the time when the cluster was created, in Universal Coordinated Time (UTC).
     */
    ClusterCreateTime?: TStamp;
    /**
     * A list of log types that this cluster is configured to export to Amazon CloudWatch Logs.
     */
    EnabledCloudwatchLogsExports?: LogTypeList;
    /**
     * Specifies whether this cluster can be deleted. If DeletionProtection is enabled, the cluster cannot be deleted unless it is modified and DeletionProtection is disabled. DeletionProtection protects clusters from being accidentally deleted.
     */
    DeletionProtection?: Boolean;
  }
  export type DBClusterList = DBCluster[];
  export interface DBClusterMember {
    /**
     * Specifies the instance identifier for this member of the cluster.
     */
    DBInstanceIdentifier?: String;
    /**
     * A value that is true if the cluster member is the primary instance for the cluster and false otherwise.
     */
    IsClusterWriter?: Boolean;
    /**
     * Specifies the status of the cluster parameter group for this member of the DB cluster.
     */
    DBClusterParameterGroupStatus?: String;
    /**
     * A value that specifies the order in which an Amazon DocumentDB replica is promoted to the primary instance after a failure of the existing primary instance. 
     */
    PromotionTier?: IntegerOptional;
  }
  export type DBClusterMemberList = DBClusterMember[];
  export interface DBClusterMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of clusters.
     */
    DBClusters?: DBClusterList;
  }
  export interface DBClusterParameterGroup {
    /**
     * Provides the name of the cluster parameter group.
     */
    DBClusterParameterGroupName?: String;
    /**
     * Provides the name of the parameter group family that this cluster parameter group is compatible with.
     */
    DBParameterGroupFamily?: String;
    /**
     * Provides the customer-specified description for this cluster parameter group.
     */
    Description?: String;
    /**
     * The Amazon Resource Name (ARN) for the cluster parameter group.
     */
    DBClusterParameterGroupArn?: String;
  }
  export interface DBClusterParameterGroupDetails {
    /**
     * Provides a list of parameters for the cluster parameter group.
     */
    Parameters?: ParametersList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export type DBClusterParameterGroupList = DBClusterParameterGroup[];
  export interface DBClusterParameterGroupNameMessage {
    /**
     * The name of a cluster parameter group. Constraints:   Must be from 1 to 255 letters or numbers.   The first character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.    This value is stored as a lowercase string. 
     */
    DBClusterParameterGroupName?: String;
  }
  export interface DBClusterParameterGroupsMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of cluster parameter groups.
     */
    DBClusterParameterGroups?: DBClusterParameterGroupList;
  }
  export interface DBClusterRole {
    /**
     * The Amazon Resource Name (ARN) of the IAMrole that is associated with the DB cluster.
     */
    RoleArn?: String;
    /**
     * Describes the state of association between the IAMrole and the cluster. The Status property returns one of the following values:    ACTIVE - The IAMrole ARN is associated with the cluster and can be used to access other Amazon Web Services services on your behalf.    PENDING - The IAMrole ARN is being associated with the cluster.    INVALID - The IAMrole ARN is associated with the cluster, but the cluster cannot assume the IAMrole to access other Amazon Web Services services on your behalf.  
     */
    Status?: String;
  }
  export type DBClusterRoles = DBClusterRole[];
  export interface DBClusterSnapshot {
    /**
     * Provides the list of Amazon EC2 Availability Zones that instances in the cluster snapshot can be restored in.
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * Specifies the identifier for the cluster snapshot.
     */
    DBClusterSnapshotIdentifier?: String;
    /**
     * Specifies the cluster identifier of the cluster that this cluster snapshot was created from.
     */
    DBClusterIdentifier?: String;
    /**
     * Provides the time when the snapshot was taken, in UTC.
     */
    SnapshotCreateTime?: TStamp;
    /**
     * Specifies the name of the database engine.
     */
    Engine?: String;
    /**
     * Specifies the status of this cluster snapshot.
     */
    Status?: String;
    /**
     * Specifies the port that the cluster was listening on at the time of the snapshot.
     */
    Port?: Integer;
    /**
     * Provides the virtual private cloud (VPC) ID that is associated with the cluster snapshot.
     */
    VpcId?: String;
    /**
     * Specifies the time when the cluster was created, in Universal Coordinated Time (UTC).
     */
    ClusterCreateTime?: TStamp;
    /**
     * Provides the master user name for the cluster snapshot.
     */
    MasterUsername?: String;
    /**
     * Provides the version of the database engine for this cluster snapshot.
     */
    EngineVersion?: String;
    /**
     * Provides the type of the cluster snapshot.
     */
    SnapshotType?: String;
    /**
     * Specifies the percentage of the estimated data that has been transferred.
     */
    PercentProgress?: Integer;
    /**
     * Specifies whether the cluster snapshot is encrypted.
     */
    StorageEncrypted?: Boolean;
    /**
     * If StorageEncrypted is true, the KMS key identifier for the encrypted cluster snapshot.
     */
    KmsKeyId?: String;
    /**
     * The Amazon Resource Name (ARN) for the cluster snapshot.
     */
    DBClusterSnapshotArn?: String;
    /**
     * If the cluster snapshot was copied from a source cluster snapshot, the ARN for the source cluster snapshot; otherwise, a null value.
     */
    SourceDBClusterSnapshotArn?: String;
  }
  export interface DBClusterSnapshotAttribute {
    /**
     * The name of the manual cluster snapshot attribute. The attribute named restore refers to the list of accounts that have permission to copy or restore the manual cluster snapshot.
     */
    AttributeName?: String;
    /**
     * The values for the manual cluster snapshot attribute. If the AttributeName field is set to restore, then this element returns a list of IDs of the accounts that are authorized to copy or restore the manual cluster snapshot. If a value of all is in the list, then the manual cluster snapshot is public and available for any account to copy or restore.
     */
    AttributeValues?: AttributeValueList;
  }
  export type DBClusterSnapshotAttributeList = DBClusterSnapshotAttribute[];
  export interface DBClusterSnapshotAttributesResult {
    /**
     * The identifier of the cluster snapshot that the attributes apply to.
     */
    DBClusterSnapshotIdentifier?: String;
    /**
     * The list of attributes and values for the cluster snapshot.
     */
    DBClusterSnapshotAttributes?: DBClusterSnapshotAttributeList;
  }
  export type DBClusterSnapshotList = DBClusterSnapshot[];
  export interface DBClusterSnapshotMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * Provides a list of cluster snapshots.
     */
    DBClusterSnapshots?: DBClusterSnapshotList;
  }
  export interface DBEngineVersion {
    /**
     * The name of the database engine.
     */
    Engine?: String;
    /**
     * The version number of the database engine.
     */
    EngineVersion?: String;
    /**
     * The name of the parameter group family for the database engine.
     */
    DBParameterGroupFamily?: String;
    /**
     * The description of the database engine.
     */
    DBEngineDescription?: String;
    /**
     * The description of the database engine version.
     */
    DBEngineVersionDescription?: String;
    /**
     * A list of engine versions that this database engine version can be upgraded to.
     */
    ValidUpgradeTarget?: ValidUpgradeTargetList;
    /**
     * The types of logs that the database engine has available for export to Amazon CloudWatch Logs.
     */
    ExportableLogTypes?: LogTypeList;
    /**
     * A value that indicates whether the engine version supports exporting the log types specified by ExportableLogTypes to CloudWatch Logs.
     */
    SupportsLogExportsToCloudwatchLogs?: Boolean;
  }
  export type DBEngineVersionList = DBEngineVersion[];
  export interface DBEngineVersionMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * Detailed information about one or more engine versions.
     */
    DBEngineVersions?: DBEngineVersionList;
  }
  export interface DBInstance {
    /**
     * Contains a user-provided database identifier. This identifier is the unique key that identifies an instance.
     */
    DBInstanceIdentifier?: String;
    /**
     * Contains the name of the compute and memory capacity class of the instance.
     */
    DBInstanceClass?: String;
    /**
     * Provides the name of the database engine to be used for this instance.
     */
    Engine?: String;
    /**
     * Specifies the current state of this database.
     */
    DBInstanceStatus?: String;
    /**
     * Specifies the connection endpoint.
     */
    Endpoint?: Endpoint;
    /**
     * Provides the date and time that the instance was created.
     */
    InstanceCreateTime?: TStamp;
    /**
     *  Specifies the daily time range during which automated backups are created if automated backups are enabled, as determined by the BackupRetentionPeriod. 
     */
    PreferredBackupWindow?: String;
    /**
     * Specifies the number of days for which automatic snapshots are retained.
     */
    BackupRetentionPeriod?: Integer;
    /**
     * Provides a list of VPC security group elements that the instance belongs to.
     */
    VpcSecurityGroups?: VpcSecurityGroupMembershipList;
    /**
     * Specifies the name of the Availability Zone that the instance is located in.
     */
    AvailabilityZone?: String;
    /**
     * Specifies information on the subnet group that is associated with the instance, including the name, description, and subnets in the subnet group.
     */
    DBSubnetGroup?: DBSubnetGroup;
    /**
     * Specifies the weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
     */
    PreferredMaintenanceWindow?: String;
    /**
     * Specifies that changes to the instance are pending. This element is included only when changes are pending. Specific changes are identified by subelements.
     */
    PendingModifiedValues?: PendingModifiedValues;
    /**
     * Specifies the latest time to which a database can be restored with point-in-time restore.
     */
    LatestRestorableTime?: TStamp;
    /**
     * Indicates the database engine version.
     */
    EngineVersion?: String;
    /**
     * Does not apply. This parameter does not apply to Amazon DocumentDB. Amazon DocumentDB does not perform minor version upgrades regardless of the value set.
     */
    AutoMinorVersionUpgrade?: Boolean;
    /**
     * Not supported. Amazon DocumentDB does not currently support public endpoints. The value of PubliclyAccessible is always false.
     */
    PubliclyAccessible?: Boolean;
    /**
     * The status of a read replica. If the instance is not a read replica, this is blank.
     */
    StatusInfos?: DBInstanceStatusInfoList;
    /**
     * Contains the name of the cluster that the instance is a member of if the instance is a member of a cluster.
     */
    DBClusterIdentifier?: String;
    /**
     * Specifies whether or not the instance is encrypted.
     */
    StorageEncrypted?: Boolean;
    /**
     *  If StorageEncrypted is true, the KMS key identifier for the encrypted instance. 
     */
    KmsKeyId?: String;
    /**
     * The Region-unique, immutable identifier for the instance. This identifier is found in CloudTrail log entries whenever the KMS key for the instance is accessed.
     */
    DbiResourceId?: String;
    /**
     * The identifier of the CA certificate for this DB instance.
     */
    CACertificateIdentifier?: String;
    /**
     * A value that specifies the order in which an Amazon DocumentDB replica is promoted to the primary instance after a failure of the existing primary instance.
     */
    PromotionTier?: IntegerOptional;
    /**
     * The Amazon Resource Name (ARN) for the instance.
     */
    DBInstanceArn?: String;
    /**
     * A list of log types that this instance is configured to export to CloudWatch Logs.
     */
    EnabledCloudwatchLogsExports?: LogTypeList;
  }
  export type DBInstanceList = DBInstance[];
  export interface DBInstanceMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * Detailed information about one or more instances. 
     */
    DBInstances?: DBInstanceList;
  }
  export interface DBInstanceStatusInfo {
    /**
     * This value is currently "read replication."
     */
    StatusType?: String;
    /**
     * A Boolean value that is true if the instance is operating normally, or false if the instance is in an error state.
     */
    Normal?: Boolean;
    /**
     * Status of the instance. For a StatusType of read replica, the values can be replicating, error, stopped, or terminated.
     */
    Status?: String;
    /**
     * Details of the error if there is an error for the instance. If the instance is not in an error state, this value is blank.
     */
    Message?: String;
  }
  export type DBInstanceStatusInfoList = DBInstanceStatusInfo[];
  export interface DBSubnetGroup {
    /**
     * The name of the subnet group.
     */
    DBSubnetGroupName?: String;
    /**
     * Provides the description of the subnet group.
     */
    DBSubnetGroupDescription?: String;
    /**
     * Provides the virtual private cloud (VPC) ID of the subnet group.
     */
    VpcId?: String;
    /**
     * Provides the status of the subnet group.
     */
    SubnetGroupStatus?: String;
    /**
     * Detailed information about one or more subnets within a subnet group.
     */
    Subnets?: SubnetList;
    /**
     * The Amazon Resource Name (ARN) for the DB subnet group.
     */
    DBSubnetGroupArn?: String;
  }
  export interface DBSubnetGroupMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * Detailed information about one or more subnet groups.
     */
    DBSubnetGroups?: DBSubnetGroups;
  }
  export type DBSubnetGroups = DBSubnetGroup[];
  export interface DeleteDBClusterMessage {
    /**
     * The cluster identifier for the cluster to be deleted. This parameter isn't case sensitive. Constraints:   Must match an existing DBClusterIdentifier.  
     */
    DBClusterIdentifier: String;
    /**
     *  Determines whether a final cluster snapshot is created before the cluster is deleted. If true is specified, no cluster snapshot is created. If false is specified, a cluster snapshot is created before the DB cluster is deleted.   If SkipFinalSnapshot is false, you must specify a FinalDBSnapshotIdentifier parameter.  Default: false 
     */
    SkipFinalSnapshot?: Boolean;
    /**
     *  The cluster snapshot identifier of the new cluster snapshot created when SkipFinalSnapshot is set to false.    Specifying this parameter and also setting the SkipFinalShapshot parameter to true results in an error.   Constraints:   Must be from 1 to 255 letters, numbers, or hyphens.   The first character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.  
     */
    FinalDBSnapshotIdentifier?: String;
  }
  export interface DeleteDBClusterParameterGroupMessage {
    /**
     * The name of the cluster parameter group. Constraints:   Must be the name of an existing cluster parameter group.   You can't delete a default cluster parameter group.   Cannot be associated with any clusters.  
     */
    DBClusterParameterGroupName: String;
  }
  export interface DeleteDBClusterResult {
    DBCluster?: DBCluster;
  }
  export interface DeleteDBClusterSnapshotMessage {
    /**
     * The identifier of the cluster snapshot to delete. Constraints: Must be the name of an existing cluster snapshot in the available state.
     */
    DBClusterSnapshotIdentifier: String;
  }
  export interface DeleteDBClusterSnapshotResult {
    DBClusterSnapshot?: DBClusterSnapshot;
  }
  export interface DeleteDBInstanceMessage {
    /**
     * The instance identifier for the instance to be deleted. This parameter isn't case sensitive. Constraints:   Must match the name of an existing instance.  
     */
    DBInstanceIdentifier: String;
  }
  export interface DeleteDBInstanceResult {
    DBInstance?: DBInstance;
  }
  export interface DeleteDBSubnetGroupMessage {
    /**
     * The name of the database subnet group to delete.  You can't delete the default subnet group.  Constraints: Must match the name of an existing DBSubnetGroup. Must not be default. Example: mySubnetgroup 
     */
    DBSubnetGroupName: String;
  }
  export interface DeleteEventSubscriptionMessage {
    /**
     * The name of the Amazon DocumentDB event notification subscription that you want to delete.
     */
    SubscriptionName: String;
  }
  export interface DeleteEventSubscriptionResult {
    EventSubscription?: EventSubscription;
  }
  export interface DeleteGlobalClusterMessage {
    /**
     * The cluster identifier of the global cluster being deleted.
     */
    GlobalClusterIdentifier: GlobalClusterIdentifier;
  }
  export interface DeleteGlobalClusterResult {
    GlobalCluster?: GlobalCluster;
  }
  export interface DescribeCertificatesMessage {
    /**
     * The user-supplied certificate identifier. If this parameter is specified, information for only the specified certificate is returned. If this parameter is omitted, a list of up to MaxRecords certificates is returned. This parameter is not case sensitive. Constraints   Must match an existing CertificateIdentifier.  
     */
    CertificateIdentifier?: String;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints:   Minimum: 20   Maximum: 100  
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeCertificates request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBClusterParameterGroupsMessage {
    /**
     * The name of a specific cluster parameter group to return details for. Constraints:   If provided, must match the name of an existing DBClusterParameterGroup.  
     */
    DBClusterParameterGroupName?: String;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
    /**
     *  The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token (marker) is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBClusterParametersMessage {
    /**
     * The name of a specific cluster parameter group to return parameter details for. Constraints:   If provided, must match the name of an existing DBClusterParameterGroup.  
     */
    DBClusterParameterGroupName: String;
    /**
     *  A value that indicates to return only parameters for a specific source. Parameter sources can be engine, service, or customer. 
     */
    Source?: String;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
    /**
     *  The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token (marker) is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBClusterSnapshotAttributesMessage {
    /**
     * The identifier for the cluster snapshot to describe the attributes for.
     */
    DBClusterSnapshotIdentifier: String;
  }
  export interface DescribeDBClusterSnapshotAttributesResult {
    DBClusterSnapshotAttributesResult?: DBClusterSnapshotAttributesResult;
  }
  export interface DescribeDBClusterSnapshotsMessage {
    /**
     * The ID of the cluster to retrieve the list of cluster snapshots for. This parameter can't be used with the DBClusterSnapshotIdentifier parameter. This parameter is not case sensitive.  Constraints:   If provided, must match the identifier of an existing DBCluster.  
     */
    DBClusterIdentifier?: String;
    /**
     * A specific cluster snapshot identifier to describe. This parameter can't be used with the DBClusterIdentifier parameter. This value is stored as a lowercase string.  Constraints:   If provided, must match the identifier of an existing DBClusterSnapshot.   If this identifier is for an automated snapshot, the SnapshotType parameter must also be specified.  
     */
    DBClusterSnapshotIdentifier?: String;
    /**
     * The type of cluster snapshots to be returned. You can specify one of the following values:    automated - Return all cluster snapshots that Amazon DocumentDB has automatically created for your account.    manual - Return all cluster snapshots that you have manually created for your account.    shared - Return all manual cluster snapshots that have been shared to your account.    public - Return all cluster snapshots that have been marked as public.   If you don't specify a SnapshotType value, then both automated and manual cluster snapshots are returned. You can include shared cluster snapshots with these results by setting the IncludeShared parameter to true. You can include public cluster snapshots with these results by setting theIncludePublic parameter to true. The IncludeShared and IncludePublic parameters don't apply for SnapshotType values of manual or automated. The IncludePublic parameter doesn't apply when SnapshotType is set to shared. The IncludeShared parameter doesn't apply when SnapshotType is set to public.
     */
    SnapshotType?: String;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
    /**
     *  The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token (marker) is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * Set to true to include shared manual cluster snapshots from other accounts that this account has been given permission to copy or restore, and otherwise false. The default is false.
     */
    IncludeShared?: Boolean;
    /**
     * Set to true to include manual cluster snapshots that are public and can be copied or restored by any account, and otherwise false. The default is false.
     */
    IncludePublic?: Boolean;
  }
  export interface DescribeDBClustersMessage {
    /**
     * The user-provided cluster identifier. If this parameter is specified, information from only the specific cluster is returned. This parameter isn't case sensitive. Constraints:   If provided, must match an existing DBClusterIdentifier.  
     */
    DBClusterIdentifier?: String;
    /**
     * A filter that specifies one or more clusters to describe. Supported filters:    db-cluster-id - Accepts cluster identifiers and cluster Amazon Resource Names (ARNs). The results list only includes information about the clusters identified by these ARNs.  
     */
    Filters?: FilterList;
    /**
     *  The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token (marker) is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBEngineVersionsMessage {
    /**
     * The database engine to return.
     */
    Engine?: String;
    /**
     * The database engine version to return. Example: 3.6.0 
     */
    EngineVersion?: String;
    /**
     * The name of a specific parameter group family to return details for. Constraints:   If provided, must match an existing DBParameterGroupFamily.  
     */
    DBParameterGroupFamily?: String;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
    /**
     *  The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token (marker) is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * Indicates that only the default version of the specified engine or engine and major version combination is returned.
     */
    DefaultOnly?: Boolean;
    /**
     * If this parameter is specified and the requested engine supports the CharacterSetName parameter for CreateDBInstance, the response includes a list of supported character sets for each engine version. 
     */
    ListSupportedCharacterSets?: BooleanOptional;
    /**
     * If this parameter is specified and the requested engine supports the TimeZone parameter for CreateDBInstance, the response includes a list of supported time zones for each engine version. 
     */
    ListSupportedTimezones?: BooleanOptional;
  }
  export interface DescribeDBInstancesMessage {
    /**
     * The user-provided instance identifier. If this parameter is specified, information from only the specific instance is returned. This parameter isn't case sensitive. Constraints:   If provided, must match the identifier of an existing DBInstance.  
     */
    DBInstanceIdentifier?: String;
    /**
     * A filter that specifies one or more instances to describe. Supported filters:    db-cluster-id - Accepts cluster identifiers and cluster Amazon Resource Names (ARNs). The results list includes only the information about the instances that are associated with the clusters that are identified by these ARNs.    db-instance-id - Accepts instance identifiers and instance ARNs. The results list includes only the information about the instances that are identified by these ARNs.  
     */
    Filters?: FilterList;
    /**
     *  The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token (marker) is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBSubnetGroupsMessage {
    /**
     * The name of the subnet group to return details for.
     */
    DBSubnetGroupName?: String;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
    /**
     *  The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token (marker) is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeEngineDefaultClusterParametersMessage {
    /**
     * The name of the cluster parameter group family to return the engine parameter information for.
     */
    DBParameterGroupFamily: String;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
    /**
     *  The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token (marker) is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeEngineDefaultClusterParametersResult {
    EngineDefaults?: EngineDefaults;
  }
  export interface DescribeEventCategoriesMessage {
    /**
     * The type of source that is generating the events. Valid values: db-instance, db-parameter-group, db-security-group 
     */
    SourceType?: String;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
  }
  export interface DescribeEventSubscriptionsMessage {
    /**
     * The name of the Amazon DocumentDB event notification subscription that you want to describe.
     */
    SubscriptionName?: String;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
    /**
     *  The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token (marker) is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeEventsMessage {
    /**
     * The identifier of the event source for which events are returned. If not specified, then all sources are included in the response. Constraints:   If SourceIdentifier is provided, SourceType must also be provided.   If the source type is DBInstance, a DBInstanceIdentifier must be provided.   If the source type is DBSecurityGroup, a DBSecurityGroupName must be provided.   If the source type is DBParameterGroup, a DBParameterGroupName must be provided.   If the source type is DBSnapshot, a DBSnapshotIdentifier must be provided.   Cannot end with a hyphen or contain two consecutive hyphens.  
     */
    SourceIdentifier?: String;
    /**
     * The event source to retrieve events for. If no value is specified, all events are returned.
     */
    SourceType?: SourceType;
    /**
     *  The beginning of the time interval to retrieve events for, specified in ISO 8601 format.  Example: 2009-07-08T18:00Z
     */
    StartTime?: TStamp;
    /**
     *  The end of the time interval for which to retrieve events, specified in ISO 8601 format.  Example: 2009-07-08T18:00Z
     */
    EndTime?: TStamp;
    /**
     * The number of minutes to retrieve events for. Default: 60
     */
    Duration?: IntegerOptional;
    /**
     * A list of event categories that trigger notifications for an event notification subscription.
     */
    EventCategories?: EventCategoriesList;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
    /**
     *  The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token (marker) is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeGlobalClustersMessage {
    /**
     * The user-supplied cluster identifier. If this parameter is specified, information from only the specific cluster is returned. This parameter isn't case-sensitive.
     */
    GlobalClusterIdentifier?: GlobalClusterIdentifier;
    /**
     * A filter that specifies one or more global DB clusters to describe. Supported filters: db-cluster-id accepts cluster identifiers and cluster Amazon Resource Names (ARNs). The results list will only include information about the clusters identified by these ARNs.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results. 
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeGlobalClusters request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeOrderableDBInstanceOptionsMessage {
    /**
     * The name of the engine to retrieve instance options for.
     */
    Engine: String;
    /**
     * The engine version filter value. Specify this parameter to show only the available offerings that match the specified engine version.
     */
    EngineVersion?: String;
    /**
     * The instance class filter value. Specify this parameter to show only the available offerings that match the specified instance class.
     */
    DBInstanceClass?: String;
    /**
     * The license model filter value. Specify this parameter to show only the available offerings that match the specified license model.
     */
    LicenseModel?: String;
    /**
     * The virtual private cloud (VPC) filter value. Specify this parameter to show only the available VPC or non-VPC offerings.
     */
    Vpc?: BooleanOptional;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
    /**
     *  The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token (marker) is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribePendingMaintenanceActionsMessage {
    /**
     * The ARN of a resource to return pending maintenance actions for.
     */
    ResourceIdentifier?: String;
    /**
     * A filter that specifies one or more resources to return pending maintenance actions for. Supported filters:    db-cluster-id - Accepts cluster identifiers and cluster Amazon Resource Names (ARNs). The results list includes only pending maintenance actions for the clusters identified by these ARNs.    db-instance-id - Accepts instance identifiers and instance ARNs. The results list includes only pending maintenance actions for the DB instances identified by these ARNs.  
     */
    Filters?: FilterList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     *  The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token (marker) is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
  }
  export interface Endpoint {
    /**
     * Specifies the DNS address of the instance.
     */
    Address?: String;
    /**
     * Specifies the port that the database engine is listening on.
     */
    Port?: Integer;
    /**
     * Specifies the ID that Amazon Route 53 assigns when you create a hosted zone.
     */
    HostedZoneId?: String;
  }
  export interface EngineDefaults {
    /**
     * The name of the cluster parameter group family to return the engine parameter information for.
     */
    DBParameterGroupFamily?: String;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * The parameters of a particular cluster parameter group family.
     */
    Parameters?: ParametersList;
  }
  export interface Event {
    /**
     * Provides the identifier for the source of the event.
     */
    SourceIdentifier?: String;
    /**
     * Specifies the source type for this event.
     */
    SourceType?: SourceType;
    /**
     * Provides the text of this event.
     */
    Message?: String;
    /**
     * Specifies the category for the event.
     */
    EventCategories?: EventCategoriesList;
    /**
     * Specifies the date and time of the event.
     */
    Date?: TStamp;
    /**
     * The Amazon Resource Name (ARN) for the event.
     */
    SourceArn?: String;
  }
  export type EventCategoriesList = String[];
  export interface EventCategoriesMap {
    /**
     * The source type that the returned categories belong to.
     */
    SourceType?: String;
    /**
     * The event categories for the specified source type.
     */
    EventCategories?: EventCategoriesList;
  }
  export type EventCategoriesMapList = EventCategoriesMap[];
  export interface EventCategoriesMessage {
    /**
     * A list of event category maps.
     */
    EventCategoriesMapList?: EventCategoriesMapList;
  }
  export type EventList = Event[];
  export interface EventSubscription {
    /**
     * The Amazon Web Services customer account that is associated with the Amazon DocumentDB event notification subscription.
     */
    CustomerAwsId?: String;
    /**
     * The Amazon DocumentDB event notification subscription ID.
     */
    CustSubscriptionId?: String;
    /**
     * The topic ARN of the Amazon DocumentDB event notification subscription.
     */
    SnsTopicArn?: String;
    /**
     * The status of the Amazon DocumentDB event notification subscription. Constraints: Can be one of the following: creating, modifying, deleting, active, no-permission, topic-not-exist  The no-permission status indicates that Amazon DocumentDB no longer has permission to post to the SNS topic. The topic-not-exist status indicates that the topic was deleted after the subscription was created.
     */
    Status?: String;
    /**
     * The time at which the Amazon DocumentDB event notification subscription was created.
     */
    SubscriptionCreationTime?: String;
    /**
     * The source type for the Amazon DocumentDB event notification subscription.
     */
    SourceType?: String;
    /**
     * A list of source IDs for the Amazon DocumentDB event notification subscription.
     */
    SourceIdsList?: SourceIdsList;
    /**
     * A list of event categories for the Amazon DocumentDB event notification subscription.
     */
    EventCategoriesList?: EventCategoriesList;
    /**
     * A Boolean value indicating whether the subscription is enabled. A value of true indicates that the subscription is enabled.
     */
    Enabled?: Boolean;
    /**
     * The Amazon Resource Name (ARN) for the event subscription.
     */
    EventSubscriptionArn?: String;
  }
  export type EventSubscriptionsList = EventSubscription[];
  export interface EventSubscriptionsMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of event subscriptions.
     */
    EventSubscriptionsList?: EventSubscriptionsList;
  }
  export interface EventsMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * Detailed information about one or more events. 
     */
    Events?: EventList;
  }
  export interface FailoverDBClusterMessage {
    /**
     * A cluster identifier to force a failover for. This parameter is not case sensitive. Constraints:   Must match the identifier of an existing DBCluster.  
     */
    DBClusterIdentifier?: String;
    /**
     * The name of the instance to promote to the primary instance. You must specify the instance identifier for an Amazon DocumentDB replica in the cluster. For example, mydbcluster-replica1.
     */
    TargetDBInstanceIdentifier?: String;
  }
  export interface FailoverDBClusterResult {
    DBCluster?: DBCluster;
  }
  export interface Filter {
    /**
     * The name of the filter. Filter names are case sensitive.
     */
    Name: String;
    /**
     * One or more filter values. Filter values are case sensitive.
     */
    Values: FilterValueList;
  }
  export type FilterList = Filter[];
  export type FilterValueList = String[];
  export interface GlobalCluster {
    /**
     * Contains a user-supplied global cluster identifier. This identifier is the unique key that identifies a global cluster. 
     */
    GlobalClusterIdentifier?: GlobalClusterIdentifier;
    /**
     * The Region-unique, immutable identifier for the global database cluster. This identifier is found in AWS CloudTrail log entries whenever the AWS KMS customer master key (CMK) for the cluster is accessed. 
     */
    GlobalClusterResourceId?: String;
    /**
     * The Amazon Resource Name (ARN) for the global cluster.
     */
    GlobalClusterArn?: String;
    /**
     * Specifies the current state of this global cluster.
     */
    Status?: String;
    /**
     * The Amazon DocumentDB database engine used by the global cluster. 
     */
    Engine?: String;
    /**
     * Indicates the database engine version.
     */
    EngineVersion?: String;
    /**
     * The default database name within the new global cluster.
     */
    DatabaseName?: String;
    /**
     * The storage encryption setting for the global cluster.
     */
    StorageEncrypted?: BooleanOptional;
    /**
     * The deletion protection setting for the new global cluster.
     */
    DeletionProtection?: BooleanOptional;
    /**
     * The list of cluster IDs for secondary clusters within the global cluster. Currently limited to one item. 
     */
    GlobalClusterMembers?: GlobalClusterMemberList;
  }
  export type GlobalClusterIdentifier = string;
  export type GlobalClusterList = GlobalCluster[];
  export interface GlobalClusterMember {
    /**
     * The Amazon Resource Name (ARN) for each Amazon DocumentDB cluster.
     */
    DBClusterArn?: String;
    /**
     * The Amazon Resource Name (ARN) for each read-only secondary cluster associated with the Aurora global cluster.
     */
    Readers?: ReadersArnList;
    /**
     *  Specifies whether the Amazon DocumentDB cluster is the primary cluster (that is, has read-write capability) for the Amazon DocumentDB global cluster with which it is associated. 
     */
    IsWriter?: Boolean;
  }
  export type GlobalClusterMemberList = GlobalClusterMember[];
  export interface GlobalClustersMessage {
    /**
     * 
     */
    Marker?: String;
    /**
     * 
     */
    GlobalClusters?: GlobalClusterList;
  }
  export type Integer = number;
  export type IntegerOptional = number;
  export type KeyList = String[];
  export interface ListTagsForResourceMessage {
    /**
     * The Amazon DocumentDB resource with tags to be listed. This value is an Amazon Resource Name (ARN).
     */
    ResourceName: String;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
  }
  export type LogTypeList = String[];
  export interface ModifyDBClusterMessage {
    /**
     * The cluster identifier for the cluster that is being modified. This parameter is not case sensitive. Constraints:   Must match the identifier of an existing DBCluster.  
     */
    DBClusterIdentifier: String;
    /**
     * The new cluster identifier for the cluster when renaming a cluster. This value is stored as a lowercase string. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   The first character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.   Example: my-cluster2 
     */
    NewDBClusterIdentifier?: String;
    /**
     * A value that specifies whether the changes in this request and any pending changes are asynchronously applied as soon as possible, regardless of the PreferredMaintenanceWindow setting for the cluster. If this parameter is set to false, changes to the cluster are applied during the next maintenance window. The ApplyImmediately parameter affects only the NewDBClusterIdentifier and MasterUserPassword values. If you set this parameter value to false, the changes to the NewDBClusterIdentifier and MasterUserPassword values are applied during the next maintenance window. All other changes are applied immediately, regardless of the value of the ApplyImmediately parameter. Default: false 
     */
    ApplyImmediately?: Boolean;
    /**
     * The number of days for which automated backups are retained. You must specify a minimum value of 1. Default: 1 Constraints:   Must be a value from 1 to 35.  
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * The name of the cluster parameter group to use for the cluster.
     */
    DBClusterParameterGroupName?: String;
    /**
     * A list of virtual private cloud (VPC) security groups that the cluster will belong to.
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * The port number on which the cluster accepts connections. Constraints: Must be a value from 1150 to 65535.  Default: The same port as the original cluster.
     */
    Port?: IntegerOptional;
    /**
     * The password for the master database user. This password can contain any printable ASCII character except forward slash (/), double quote ("), or the "at" symbol (@). Constraints: Must contain from 8 to 100 characters.
     */
    MasterUserPassword?: String;
    /**
     * The daily time range during which automated backups are created if automated backups are enabled, using the BackupRetentionPeriod parameter.  The default is a 30-minute window selected at random from an 8-hour block of time for each Region.  Constraints:   Must be in the format hh24:mi-hh24:mi.   Must be in Universal Coordinated Time (UTC).   Must not conflict with the preferred maintenance window.   Must be at least 30 minutes.  
     */
    PreferredBackupWindow?: String;
    /**
     * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC). Format: ddd:hh24:mi-ddd:hh24:mi  The default is a 30-minute window selected at random from an 8-hour block of time for each Region, occurring on a random day of the week.  Valid days: Mon, Tue, Wed, Thu, Fri, Sat, Sun Constraints: Minimum 30-minute window.
     */
    PreferredMaintenanceWindow?: String;
    /**
     * The configuration setting for the log types to be enabled for export to Amazon CloudWatch Logs for a specific instance or cluster. The EnableLogTypes and DisableLogTypes arrays determine which logs are exported (or not exported) to CloudWatch Logs.
     */
    CloudwatchLogsExportConfiguration?: CloudwatchLogsExportConfiguration;
    /**
     * The version number of the database engine to which you want to upgrade. Modifying engine version is not supported on Amazon DocumentDB.
     */
    EngineVersion?: String;
    /**
     * Specifies whether this cluster can be deleted. If DeletionProtection is enabled, the cluster cannot be deleted unless it is modified and DeletionProtection is disabled. DeletionProtection protects clusters from being accidentally deleted.
     */
    DeletionProtection?: BooleanOptional;
  }
  export interface ModifyDBClusterParameterGroupMessage {
    /**
     * The name of the cluster parameter group to modify.
     */
    DBClusterParameterGroupName: String;
    /**
     * A list of parameters in the cluster parameter group to modify.
     */
    Parameters: ParametersList;
  }
  export interface ModifyDBClusterResult {
    DBCluster?: DBCluster;
  }
  export interface ModifyDBClusterSnapshotAttributeMessage {
    /**
     * The identifier for the cluster snapshot to modify the attributes for.
     */
    DBClusterSnapshotIdentifier: String;
    /**
     * The name of the cluster snapshot attribute to modify. To manage authorization for other accounts to copy or restore a manual cluster snapshot, set this value to restore.
     */
    AttributeName: String;
    /**
     * A list of cluster snapshot attributes to add to the attribute specified by AttributeName. To authorize other accounts to copy or restore a manual cluster snapshot, set this list to include one or more account IDs. To make the manual cluster snapshot restorable by any account, set it to all. Do not add the all value for any manual cluster snapshots that contain private information that you don't want to be available to all accounts.
     */
    ValuesToAdd?: AttributeValueList;
    /**
     * A list of cluster snapshot attributes to remove from the attribute specified by AttributeName. To remove authorization for other accounts to copy or restore a manual cluster snapshot, set this list to include one or more account identifiers. To remove authorization for any account to copy or restore the cluster snapshot, set it to all . If you specify all, an account whose account ID is explicitly added to the restore attribute can still copy or restore a manual cluster snapshot.
     */
    ValuesToRemove?: AttributeValueList;
  }
  export interface ModifyDBClusterSnapshotAttributeResult {
    DBClusterSnapshotAttributesResult?: DBClusterSnapshotAttributesResult;
  }
  export interface ModifyDBInstanceMessage {
    /**
     * The instance identifier. This value is stored as a lowercase string. Constraints:   Must match the identifier of an existing DBInstance.  
     */
    DBInstanceIdentifier: String;
    /**
     * The new compute and memory capacity of the instance; for example, db.r5.large. Not all instance classes are available in all Regions.  If you modify the instance class, an outage occurs during the change. The change is applied during the next maintenance window, unless ApplyImmediately is specified as true for this request.  Default: Uses existing setting.
     */
    DBInstanceClass?: String;
    /**
     * Specifies whether the modifications in this request and any pending modifications are asynchronously applied as soon as possible, regardless of the PreferredMaintenanceWindow setting for the instance.   If this parameter is set to false, changes to the instance are applied during the next maintenance window. Some parameter changes can cause an outage and are applied on the next reboot. Default: false 
     */
    ApplyImmediately?: Boolean;
    /**
     * The weekly time range (in UTC) during which system maintenance can occur, which might result in an outage. Changing this parameter doesn't result in an outage except in the following situation, and the change is asynchronously applied as soon as possible. If there are pending actions that cause a reboot, and the maintenance window is changed to include the current time, changing this parameter causes a reboot of the instance. If you are moving this window to the current time, there must be at least 30 minutes between the current time and end of the window to ensure that pending changes are applied. Default: Uses existing setting. Format: ddd:hh24:mi-ddd:hh24:mi  Valid days: Mon, Tue, Wed, Thu, Fri, Sat, Sun Constraints: Must be at least 30 minutes.
     */
    PreferredMaintenanceWindow?: String;
    /**
     * This parameter does not apply to Amazon DocumentDB. Amazon DocumentDB does not perform minor version upgrades regardless of the value set.
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
    /**
     *  The new instance identifier for the instance when renaming an instance. When you change the instance identifier, an instance reboot occurs immediately if you set Apply Immediately to true. It occurs during the next maintenance window if you set Apply Immediately to false. This value is stored as a lowercase string.  Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   The first character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.   Example: mydbinstance 
     */
    NewDBInstanceIdentifier?: String;
    /**
     * Indicates the certificate that needs to be associated with the instance.
     */
    CACertificateIdentifier?: String;
    /**
     * A value that specifies the order in which an Amazon DocumentDB replica is promoted to the primary instance after a failure of the existing primary instance. Default: 1 Valid values: 0-15
     */
    PromotionTier?: IntegerOptional;
  }
  export interface ModifyDBInstanceResult {
    DBInstance?: DBInstance;
  }
  export interface ModifyDBSubnetGroupMessage {
    /**
     * The name for the subnet group. This value is stored as a lowercase string. You can't modify the default subnet group.  Constraints: Must match the name of an existing DBSubnetGroup. Must not be default. Example: mySubnetgroup 
     */
    DBSubnetGroupName: String;
    /**
     * The description for the subnet group.
     */
    DBSubnetGroupDescription?: String;
    /**
     * The Amazon EC2 subnet IDs for the subnet group.
     */
    SubnetIds: SubnetIdentifierList;
  }
  export interface ModifyDBSubnetGroupResult {
    DBSubnetGroup?: DBSubnetGroup;
  }
  export interface ModifyEventSubscriptionMessage {
    /**
     * The name of the Amazon DocumentDB event notification subscription.
     */
    SubscriptionName: String;
    /**
     * The Amazon Resource Name (ARN) of the SNS topic created for event notification. The ARN is created by Amazon SNS when you create a topic and subscribe to it.
     */
    SnsTopicArn?: String;
    /**
     * The type of source that is generating the events. For example, if you want to be notified of events generated by an instance, set this parameter to db-instance. If this value is not specified, all events are returned. Valid values: db-instance, db-parameter-group, db-security-group 
     */
    SourceType?: String;
    /**
     *  A list of event categories for a SourceType that you want to subscribe to.
     */
    EventCategories?: EventCategoriesList;
    /**
     *  A Boolean value; set to true to activate the subscription. 
     */
    Enabled?: BooleanOptional;
  }
  export interface ModifyEventSubscriptionResult {
    EventSubscription?: EventSubscription;
  }
  export interface ModifyGlobalClusterMessage {
    /**
     * The identifier for the global cluster being modified. This parameter isn't case-sensitive. Constraints:   Must match the identifier of an existing global cluster.  
     */
    GlobalClusterIdentifier: GlobalClusterIdentifier;
    /**
     * The new identifier for a global cluster when you modify a global cluster. This value is stored as a lowercase string.   Must contain from 1 to 63 letters, numbers, or hyphens The first character must be a letter Can't end with a hyphen or contain two consecutive hyphens   Example: my-cluster2 
     */
    NewGlobalClusterIdentifier?: GlobalClusterIdentifier;
    /**
     * Indicates if the global cluster has deletion protection enabled. The global cluster can't be deleted when deletion protection is enabled. 
     */
    DeletionProtection?: BooleanOptional;
  }
  export interface ModifyGlobalClusterResult {
    GlobalCluster?: GlobalCluster;
  }
  export interface OrderableDBInstanceOption {
    /**
     * The engine type of an instance.
     */
    Engine?: String;
    /**
     * The engine version of an instance.
     */
    EngineVersion?: String;
    /**
     * The instance class for an instance.
     */
    DBInstanceClass?: String;
    /**
     * The license model for an instance.
     */
    LicenseModel?: String;
    /**
     * A list of Availability Zones for an instance.
     */
    AvailabilityZones?: AvailabilityZoneList;
    /**
     * Indicates whether an instance is in a virtual private cloud (VPC).
     */
    Vpc?: Boolean;
  }
  export type OrderableDBInstanceOptionsList = OrderableDBInstanceOption[];
  export interface OrderableDBInstanceOptionsMessage {
    /**
     * The options that are available for a particular orderable instance.
     */
    OrderableDBInstanceOptions?: OrderableDBInstanceOptionsList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface Parameter {
    /**
     * Specifies the name of the parameter.
     */
    ParameterName?: String;
    /**
     * Specifies the value of the parameter.
     */
    ParameterValue?: String;
    /**
     * Provides a description of the parameter.
     */
    Description?: String;
    /**
     * Indicates the source of the parameter value.
     */
    Source?: String;
    /**
     * Specifies the engine-specific parameters type.
     */
    ApplyType?: String;
    /**
     * Specifies the valid data type for the parameter.
     */
    DataType?: String;
    /**
     * Specifies the valid range of values for the parameter.
     */
    AllowedValues?: String;
    /**
     *  Indicates whether (true) or not (false) the parameter can be modified. Some parameters have security or operational implications that prevent them from being changed. 
     */
    IsModifiable?: Boolean;
    /**
     * The earliest engine version to which the parameter can apply.
     */
    MinimumEngineVersion?: String;
    /**
     * Indicates when to apply parameter updates.
     */
    ApplyMethod?: ApplyMethod;
  }
  export type ParametersList = Parameter[];
  export interface PendingCloudwatchLogsExports {
    /**
     * Log types that are in the process of being deactivated. After they are deactivated, these log types aren't exported to CloudWatch Logs.
     */
    LogTypesToEnable?: LogTypeList;
    /**
     * Log types that are in the process of being enabled. After they are enabled, these log types are exported to Amazon CloudWatch Logs.
     */
    LogTypesToDisable?: LogTypeList;
  }
  export interface PendingMaintenanceAction {
    /**
     * The type of pending maintenance action that is available for the resource.
     */
    Action?: String;
    /**
     * The date of the maintenance window when the action is applied. The maintenance action is applied to the resource during its first maintenance window after this date. If this date is specified, any next-maintenance opt-in requests are ignored.
     */
    AutoAppliedAfterDate?: TStamp;
    /**
     * The date when the maintenance action is automatically applied. The maintenance action is applied to the resource on this date regardless of the maintenance window for the resource. If this date is specified, any immediate opt-in requests are ignored.
     */
    ForcedApplyDate?: TStamp;
    /**
     * Indicates the type of opt-in request that has been received for the resource.
     */
    OptInStatus?: String;
    /**
     * The effective date when the pending maintenance action is applied to the resource.
     */
    CurrentApplyDate?: TStamp;
    /**
     * A description providing more detail about the maintenance action.
     */
    Description?: String;
  }
  export type PendingMaintenanceActionDetails = PendingMaintenanceAction[];
  export type PendingMaintenanceActions = ResourcePendingMaintenanceActions[];
  export interface PendingMaintenanceActionsMessage {
    /**
     * The maintenance actions to be applied.
     */
    PendingMaintenanceActions?: PendingMaintenanceActions;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface PendingModifiedValues {
    /**
     *  Contains the new DBInstanceClass for the instance that will be applied or is currently being applied. 
     */
    DBInstanceClass?: String;
    /**
     *  Contains the new AllocatedStorage size for then instance that will be applied or is currently being applied. 
     */
    AllocatedStorage?: IntegerOptional;
    /**
     * Contains the pending or currently in-progress change of the master credentials for the instance.
     */
    MasterUserPassword?: String;
    /**
     * Specifies the pending port for the instance.
     */
    Port?: IntegerOptional;
    /**
     * Specifies the pending number of days for which automated backups are retained.
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * Indicates that the Single-AZ instance is to change to a Multi-AZ deployment.
     */
    MultiAZ?: BooleanOptional;
    /**
     * Indicates the database engine version.
     */
    EngineVersion?: String;
    /**
     * The license model for the instance. Valid values: license-included, bring-your-own-license, general-public-license 
     */
    LicenseModel?: String;
    /**
     * Specifies the new Provisioned IOPS value for the instance that will be applied or is currently being applied.
     */
    Iops?: IntegerOptional;
    /**
     *  Contains the new DBInstanceIdentifier for the instance that will be applied or is currently being applied. 
     */
    DBInstanceIdentifier?: String;
    /**
     * Specifies the storage type to be associated with the instance.
     */
    StorageType?: String;
    /**
     * Specifies the identifier of the certificate authority (CA) certificate for the DB instance.
     */
    CACertificateIdentifier?: String;
    /**
     * The new subnet group for the instance. 
     */
    DBSubnetGroupName?: String;
    /**
     * A list of the log types whose configuration is still pending. These log types are in the process of being activated or deactivated.
     */
    PendingCloudwatchLogsExports?: PendingCloudwatchLogsExports;
  }
  export type ReadReplicaIdentifierList = String[];
  export type ReadersArnList = String[];
  export interface RebootDBInstanceMessage {
    /**
     * The instance identifier. This parameter is stored as a lowercase string. Constraints:   Must match the identifier of an existing DBInstance.  
     */
    DBInstanceIdentifier: String;
    /**
     *  When true, the reboot is conducted through a Multi-AZ failover.  Constraint: You can't specify true if the instance is not configured for Multi-AZ.
     */
    ForceFailover?: BooleanOptional;
  }
  export interface RebootDBInstanceResult {
    DBInstance?: DBInstance;
  }
  export interface RemoveFromGlobalClusterMessage {
    /**
     * The cluster identifier to detach from the Amazon DocumentDB global cluster. 
     */
    GlobalClusterIdentifier: GlobalClusterIdentifier;
    /**
     * The Amazon Resource Name (ARN) identifying the cluster that was detached from the Amazon DocumentDB global cluster. 
     */
    DbClusterIdentifier: String;
  }
  export interface RemoveFromGlobalClusterResult {
    GlobalCluster?: GlobalCluster;
  }
  export interface RemoveSourceIdentifierFromSubscriptionMessage {
    /**
     * The name of the Amazon DocumentDB event notification subscription that you want to remove a source identifier from.
     */
    SubscriptionName: String;
    /**
     *  The source identifier to be removed from the subscription, such as the instance identifier for an instance, or the name of a security group. 
     */
    SourceIdentifier: String;
  }
  export interface RemoveSourceIdentifierFromSubscriptionResult {
    EventSubscription?: EventSubscription;
  }
  export interface RemoveTagsFromResourceMessage {
    /**
     * The Amazon DocumentDB resource that the tags are removed from. This value is an Amazon Resource Name (ARN).
     */
    ResourceName: String;
    /**
     * The tag key (name) of the tag to be removed.
     */
    TagKeys: KeyList;
  }
  export interface ResetDBClusterParameterGroupMessage {
    /**
     * The name of the cluster parameter group to reset.
     */
    DBClusterParameterGroupName: String;
    /**
     * A value that is set to true to reset all parameters in the cluster parameter group to their default values, and false otherwise. You can't use this parameter if there is a list of parameter names specified for the Parameters parameter.
     */
    ResetAllParameters?: Boolean;
    /**
     * A list of parameter names in the cluster parameter group to reset to the default values. You can't use this parameter if the ResetAllParameters parameter is set to true.
     */
    Parameters?: ParametersList;
  }
  export interface ResourcePendingMaintenanceActions {
    /**
     * The Amazon Resource Name (ARN) of the resource that has pending maintenance actions.
     */
    ResourceIdentifier?: String;
    /**
     * A list that provides details about the pending maintenance actions for the resource.
     */
    PendingMaintenanceActionDetails?: PendingMaintenanceActionDetails;
  }
  export interface RestoreDBClusterFromSnapshotMessage {
    /**
     * Provides the list of Amazon EC2 Availability Zones that instances in the restored DB cluster can be created in.
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * The name of the cluster to create from the snapshot or cluster snapshot. This parameter isn't case sensitive. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   The first character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.   Example: my-snapshot-id 
     */
    DBClusterIdentifier: String;
    /**
     * The identifier for the snapshot or cluster snapshot to restore from. You can use either the name or the Amazon Resource Name (ARN) to specify a cluster snapshot. However, you can use only the ARN to specify a snapshot. Constraints:   Must match the identifier of an existing snapshot.  
     */
    SnapshotIdentifier: String;
    /**
     * The database engine to use for the new cluster. Default: The same as source. Constraint: Must be compatible with the engine of the source.
     */
    Engine: String;
    /**
     * The version of the database engine to use for the new cluster.
     */
    EngineVersion?: String;
    /**
     * The port number on which the new cluster accepts connections. Constraints: Must be a value from 1150 to 65535. Default: The same port as the original cluster.
     */
    Port?: IntegerOptional;
    /**
     * The name of the subnet group to use for the new cluster. Constraints: If provided, must match the name of an existing DBSubnetGroup. Example: mySubnetgroup 
     */
    DBSubnetGroupName?: String;
    /**
     * A list of virtual private cloud (VPC) security groups that the new cluster will belong to.
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * The tags to be assigned to the restored cluster.
     */
    Tags?: TagList;
    /**
     * The KMS key identifier to use when restoring an encrypted cluster from a DB snapshot or cluster snapshot. The KMS key identifier is the Amazon Resource Name (ARN) for the KMS encryption key. If you are restoring a cluster with the same account that owns the KMS encryption key used to encrypt the new cluster, then you can use the KMS key alias instead of the ARN for the KMS encryption key. If you do not specify a value for the KmsKeyId parameter, then the following occurs:   If the snapshot or cluster snapshot in SnapshotIdentifier is encrypted, then the restored cluster is encrypted using the KMS key that was used to encrypt the snapshot or the cluster snapshot.   If the snapshot or the cluster snapshot in SnapshotIdentifier is not encrypted, then the restored DB cluster is not encrypted.  
     */
    KmsKeyId?: String;
    /**
     * A list of log types that must be enabled for exporting to Amazon CloudWatch Logs.
     */
    EnableCloudwatchLogsExports?: LogTypeList;
    /**
     * Specifies whether this cluster can be deleted. If DeletionProtection is enabled, the cluster cannot be deleted unless it is modified and DeletionProtection is disabled. DeletionProtection protects clusters from being accidentally deleted.
     */
    DeletionProtection?: BooleanOptional;
  }
  export interface RestoreDBClusterFromSnapshotResult {
    DBCluster?: DBCluster;
  }
  export interface RestoreDBClusterToPointInTimeMessage {
    /**
     * The name of the new cluster to be created. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   The first character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.  
     */
    DBClusterIdentifier: String;
    /**
     * The identifier of the source cluster from which to restore. Constraints:   Must match the identifier of an existing DBCluster.  
     */
    SourceDBClusterIdentifier: String;
    /**
     * The date and time to restore the cluster to. Valid values: A time in Universal Coordinated Time (UTC) format. Constraints:   Must be before the latest restorable time for the instance.   Must be specified if the UseLatestRestorableTime parameter is not provided.   Cannot be specified if the UseLatestRestorableTime parameter is true.   Cannot be specified if the RestoreType parameter is copy-on-write.   Example: 2015-03-07T23:45:00Z 
     */
    RestoreToTime?: TStamp;
    /**
     * A value that is set to true to restore the cluster to the latest restorable backup time, and false otherwise.  Default: false  Constraints: Cannot be specified if the RestoreToTime parameter is provided.
     */
    UseLatestRestorableTime?: Boolean;
    /**
     * The port number on which the new cluster accepts connections. Constraints: Must be a value from 1150 to 65535.  Default: The default port for the engine.
     */
    Port?: IntegerOptional;
    /**
     * The subnet group name to use for the new cluster. Constraints: If provided, must match the name of an existing DBSubnetGroup. Example: mySubnetgroup 
     */
    DBSubnetGroupName?: String;
    /**
     * A list of VPC security groups that the new cluster belongs to.
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * The tags to be assigned to the restored cluster.
     */
    Tags?: TagList;
    /**
     * The KMS key identifier to use when restoring an encrypted cluster from an encrypted cluster. The KMS key identifier is the Amazon Resource Name (ARN) for the KMS encryption key. If you are restoring a cluster with the same account that owns the KMS encryption key used to encrypt the new cluster, then you can use the KMS key alias instead of the ARN for the KMS encryption key. You can restore to a new cluster and encrypt the new cluster with an KMS key that is different from the KMS key used to encrypt the source cluster. The new DB cluster is encrypted with the KMS key identified by the KmsKeyId parameter. If you do not specify a value for the KmsKeyId parameter, then the following occurs:   If the cluster is encrypted, then the restored cluster is encrypted using the KMS key that was used to encrypt the source cluster.   If the cluster is not encrypted, then the restored cluster is not encrypted.   If DBClusterIdentifier refers to a cluster that is not encrypted, then the restore request is rejected.
     */
    KmsKeyId?: String;
    /**
     * A list of log types that must be enabled for exporting to Amazon CloudWatch Logs.
     */
    EnableCloudwatchLogsExports?: LogTypeList;
    /**
     * Specifies whether this cluster can be deleted. If DeletionProtection is enabled, the cluster cannot be deleted unless it is modified and DeletionProtection is disabled. DeletionProtection protects clusters from being accidentally deleted.
     */
    DeletionProtection?: BooleanOptional;
  }
  export interface RestoreDBClusterToPointInTimeResult {
    DBCluster?: DBCluster;
  }
  export type SourceIdsList = String[];
  export type SourceType = "db-instance"|"db-parameter-group"|"db-security-group"|"db-snapshot"|"db-cluster"|"db-cluster-snapshot"|string;
  export interface StartDBClusterMessage {
    /**
     * The identifier of the cluster to restart. Example: docdb-2019-05-28-15-24-52 
     */
    DBClusterIdentifier: String;
  }
  export interface StartDBClusterResult {
    DBCluster?: DBCluster;
  }
  export interface StopDBClusterMessage {
    /**
     * The identifier of the cluster to stop. Example: docdb-2019-05-28-15-24-52 
     */
    DBClusterIdentifier: String;
  }
  export interface StopDBClusterResult {
    DBCluster?: DBCluster;
  }
  export type String = string;
  export interface Subnet {
    /**
     * Specifies the identifier of the subnet.
     */
    SubnetIdentifier?: String;
    /**
     * Specifies the Availability Zone for the subnet.
     */
    SubnetAvailabilityZone?: AvailabilityZone;
    /**
     * Specifies the status of the subnet.
     */
    SubnetStatus?: String;
  }
  export type SubnetIdentifierList = String[];
  export type SubnetList = Subnet[];
  export type TStamp = Date;
  export interface Tag {
    /**
     * The required name of the tag. The string value can be from 1 to 128 Unicode characters in length and can't be prefixed with "aws:" or "rds:". The string can contain only the set of Unicode letters, digits, white space, '_', '.', '/', '=', '+', '-' (Java regex: "^([\\p{L}\\p{Z}\\p{N}_.:/=+\\-]*)$").
     */
    Key?: String;
    /**
     * The optional value of the tag. The string value can be from 1 to 256 Unicode characters in length and can't be prefixed with "aws:" or "rds:". The string can contain only the set of Unicode letters, digits, white space, '_', '.', '/', '=', '+', '-' (Java regex: "^([\\p{L}\\p{Z}\\p{N}_.:/=+\\-]*)$").
     */
    Value?: String;
  }
  export type TagList = Tag[];
  export interface TagListMessage {
    /**
     * A list of one or more tags.
     */
    TagList?: TagList;
  }
  export interface UpgradeTarget {
    /**
     * The name of the upgrade target database engine.
     */
    Engine?: String;
    /**
     * The version number of the upgrade target database engine.
     */
    EngineVersion?: String;
    /**
     * The version of the database engine that an instance can be upgraded to.
     */
    Description?: String;
    /**
     * A value that indicates whether the target version is applied to any source DB instances that have AutoMinorVersionUpgrade set to true.
     */
    AutoUpgrade?: Boolean;
    /**
     * A value that indicates whether a database engine is upgraded to a major version.
     */
    IsMajorVersionUpgrade?: Boolean;
  }
  export type ValidUpgradeTargetList = UpgradeTarget[];
  export type VpcSecurityGroupIdList = String[];
  export interface VpcSecurityGroupMembership {
    /**
     * The name of the VPC security group.
     */
    VpcSecurityGroupId?: String;
    /**
     * The status of the VPC security group.
     */
    Status?: String;
  }
  export type VpcSecurityGroupMembershipList = VpcSecurityGroupMembership[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2014-10-31"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the DocDB client.
   */
  export import Types = DocDB;
}
export = DocDB;
