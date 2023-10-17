import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Signer as signer} from '../lib/rds/signer';
interface Blob {}
declare class RDS extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: RDS.Types.ClientConfiguration)
  config: Config & RDS.Types.ClientConfiguration;
  /**
   * Associates an Identity and Access Management (IAM) role with a DB cluster.
   */
  addRoleToDBCluster(params: RDS.Types.AddRoleToDBClusterMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates an Identity and Access Management (IAM) role with a DB cluster.
   */
  addRoleToDBCluster(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates an Amazon Web Services Identity and Access Management (IAM) role with a DB instance.  To add a role to a DB instance, the status of the DB instance must be available.  This command doesn't apply to RDS Custom.
   */
  addRoleToDBInstance(params: RDS.Types.AddRoleToDBInstanceMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates an Amazon Web Services Identity and Access Management (IAM) role with a DB instance.  To add a role to a DB instance, the status of the DB instance must be available.  This command doesn't apply to RDS Custom.
   */
  addRoleToDBInstance(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds a source identifier to an existing RDS event notification subscription.
   */
  addSourceIdentifierToSubscription(params: RDS.Types.AddSourceIdentifierToSubscriptionMessage, callback?: (err: AWSError, data: RDS.Types.AddSourceIdentifierToSubscriptionResult) => void): Request<RDS.Types.AddSourceIdentifierToSubscriptionResult, AWSError>;
  /**
   * Adds a source identifier to an existing RDS event notification subscription.
   */
  addSourceIdentifierToSubscription(callback?: (err: AWSError, data: RDS.Types.AddSourceIdentifierToSubscriptionResult) => void): Request<RDS.Types.AddSourceIdentifierToSubscriptionResult, AWSError>;
  /**
   * Adds metadata tags to an Amazon RDS resource. These tags can also be used with cost allocation reporting to track cost associated with Amazon RDS resources, or used in a Condition statement in an IAM policy for Amazon RDS. For an overview on tagging Amazon RDS resources, see Tagging Amazon RDS Resources.
   */
  addTagsToResource(params: RDS.Types.AddTagsToResourceMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds metadata tags to an Amazon RDS resource. These tags can also be used with cost allocation reporting to track cost associated with Amazon RDS resources, or used in a Condition statement in an IAM policy for Amazon RDS. For an overview on tagging Amazon RDS resources, see Tagging Amazon RDS Resources.
   */
  addTagsToResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Applies a pending maintenance action to a resource (for example, to a DB instance).
   */
  applyPendingMaintenanceAction(params: RDS.Types.ApplyPendingMaintenanceActionMessage, callback?: (err: AWSError, data: RDS.Types.ApplyPendingMaintenanceActionResult) => void): Request<RDS.Types.ApplyPendingMaintenanceActionResult, AWSError>;
  /**
   * Applies a pending maintenance action to a resource (for example, to a DB instance).
   */
  applyPendingMaintenanceAction(callback?: (err: AWSError, data: RDS.Types.ApplyPendingMaintenanceActionResult) => void): Request<RDS.Types.ApplyPendingMaintenanceActionResult, AWSError>;
  /**
   * Enables ingress to a DBSecurityGroup using one of two forms of authorization. First, EC2 or VPC security groups can be added to the DBSecurityGroup if the application using the database is running on EC2 or VPC instances. Second, IP ranges are available if the application accessing your database is running on the internet. Required parameters for this API are one of CIDR range, EC2SecurityGroupId for VPC, or (EC2SecurityGroupOwnerId and either EC2SecurityGroupName or EC2SecurityGroupId for non-VPC). You can't authorize ingress from an EC2 security group in one Amazon Web Services Region to an Amazon RDS DB instance in another. You can't authorize ingress from a VPC security group in one VPC to an Amazon RDS DB instance in another. For an overview of CIDR ranges, go to the Wikipedia Tutorial.  EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that you migrate as soon as possible. For more information, see Migrate from EC2-Classic to a VPC in the Amazon EC2 User Guide, the blog EC2-Classic Networking is Retiring – Here’s How to Prepare, and Moving a DB instance not in a VPC into a VPC in the Amazon RDS User Guide. 
   */
  authorizeDBSecurityGroupIngress(params: RDS.Types.AuthorizeDBSecurityGroupIngressMessage, callback?: (err: AWSError, data: RDS.Types.AuthorizeDBSecurityGroupIngressResult) => void): Request<RDS.Types.AuthorizeDBSecurityGroupIngressResult, AWSError>;
  /**
   * Enables ingress to a DBSecurityGroup using one of two forms of authorization. First, EC2 or VPC security groups can be added to the DBSecurityGroup if the application using the database is running on EC2 or VPC instances. Second, IP ranges are available if the application accessing your database is running on the internet. Required parameters for this API are one of CIDR range, EC2SecurityGroupId for VPC, or (EC2SecurityGroupOwnerId and either EC2SecurityGroupName or EC2SecurityGroupId for non-VPC). You can't authorize ingress from an EC2 security group in one Amazon Web Services Region to an Amazon RDS DB instance in another. You can't authorize ingress from a VPC security group in one VPC to an Amazon RDS DB instance in another. For an overview of CIDR ranges, go to the Wikipedia Tutorial.  EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that you migrate as soon as possible. For more information, see Migrate from EC2-Classic to a VPC in the Amazon EC2 User Guide, the blog EC2-Classic Networking is Retiring – Here’s How to Prepare, and Moving a DB instance not in a VPC into a VPC in the Amazon RDS User Guide. 
   */
  authorizeDBSecurityGroupIngress(callback?: (err: AWSError, data: RDS.Types.AuthorizeDBSecurityGroupIngressResult) => void): Request<RDS.Types.AuthorizeDBSecurityGroupIngressResult, AWSError>;
  /**
   * Backtracks a DB cluster to a specific time, without creating a new DB cluster. For more information on backtracking, see  Backtracking an Aurora DB Cluster in the Amazon Aurora User Guide.  This action applies only to Aurora MySQL DB clusters. 
   */
  backtrackDBCluster(params: RDS.Types.BacktrackDBClusterMessage, callback?: (err: AWSError, data: RDS.Types.DBClusterBacktrack) => void): Request<RDS.Types.DBClusterBacktrack, AWSError>;
  /**
   * Backtracks a DB cluster to a specific time, without creating a new DB cluster. For more information on backtracking, see  Backtracking an Aurora DB Cluster in the Amazon Aurora User Guide.  This action applies only to Aurora MySQL DB clusters. 
   */
  backtrackDBCluster(callback?: (err: AWSError, data: RDS.Types.DBClusterBacktrack) => void): Request<RDS.Types.DBClusterBacktrack, AWSError>;
  /**
   * Cancels an export task in progress that is exporting a snapshot or cluster to Amazon S3. Any data that has already been written to the S3 bucket isn't removed.
   */
  cancelExportTask(params: RDS.Types.CancelExportTaskMessage, callback?: (err: AWSError, data: RDS.Types.ExportTask) => void): Request<RDS.Types.ExportTask, AWSError>;
  /**
   * Cancels an export task in progress that is exporting a snapshot or cluster to Amazon S3. Any data that has already been written to the S3 bucket isn't removed.
   */
  cancelExportTask(callback?: (err: AWSError, data: RDS.Types.ExportTask) => void): Request<RDS.Types.ExportTask, AWSError>;
  /**
   * Copies the specified DB cluster parameter group.
   */
  copyDBClusterParameterGroup(params: RDS.Types.CopyDBClusterParameterGroupMessage, callback?: (err: AWSError, data: RDS.Types.CopyDBClusterParameterGroupResult) => void): Request<RDS.Types.CopyDBClusterParameterGroupResult, AWSError>;
  /**
   * Copies the specified DB cluster parameter group.
   */
  copyDBClusterParameterGroup(callback?: (err: AWSError, data: RDS.Types.CopyDBClusterParameterGroupResult) => void): Request<RDS.Types.CopyDBClusterParameterGroupResult, AWSError>;
  /**
   * Copies a snapshot of a DB cluster. To copy a DB cluster snapshot from a shared manual DB cluster snapshot, SourceDBClusterSnapshotIdentifier must be the Amazon Resource Name (ARN) of the shared DB cluster snapshot. You can copy an encrypted DB cluster snapshot from another Amazon Web Services Region. In that case, the Amazon Web Services Region where you call the CopyDBClusterSnapshot operation is the destination Amazon Web Services Region for the encrypted DB cluster snapshot to be copied to. To copy an encrypted DB cluster snapshot from another Amazon Web Services Region, you must provide the following values:    KmsKeyId - The Amazon Web Services Key Management System (Amazon Web Services KMS) key identifier for the key to use to encrypt the copy of the DB cluster snapshot in the destination Amazon Web Services Region.    TargetDBClusterSnapshotIdentifier - The identifier for the new copy of the DB cluster snapshot in the destination Amazon Web Services Region.    SourceDBClusterSnapshotIdentifier - The DB cluster snapshot identifier for the encrypted DB cluster snapshot to be copied. This identifier must be in the ARN format for the source Amazon Web Services Region and is the same value as the SourceDBClusterSnapshotIdentifier in the presigned URL.   To cancel the copy operation once it is in progress, delete the target DB cluster snapshot identified by TargetDBClusterSnapshotIdentifier while that DB cluster snapshot is in "copying" status. For more information on copying encrypted Amazon Aurora DB cluster snapshots from one Amazon Web Services Region to another, see  Copying a Snapshot in the Amazon Aurora User Guide. For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  copyDBClusterSnapshot(params: RDS.Types.CopyDBClusterSnapshotMessage, callback?: (err: AWSError, data: RDS.Types.CopyDBClusterSnapshotResult) => void): Request<RDS.Types.CopyDBClusterSnapshotResult, AWSError>;
  /**
   * Copies a snapshot of a DB cluster. To copy a DB cluster snapshot from a shared manual DB cluster snapshot, SourceDBClusterSnapshotIdentifier must be the Amazon Resource Name (ARN) of the shared DB cluster snapshot. You can copy an encrypted DB cluster snapshot from another Amazon Web Services Region. In that case, the Amazon Web Services Region where you call the CopyDBClusterSnapshot operation is the destination Amazon Web Services Region for the encrypted DB cluster snapshot to be copied to. To copy an encrypted DB cluster snapshot from another Amazon Web Services Region, you must provide the following values:    KmsKeyId - The Amazon Web Services Key Management System (Amazon Web Services KMS) key identifier for the key to use to encrypt the copy of the DB cluster snapshot in the destination Amazon Web Services Region.    TargetDBClusterSnapshotIdentifier - The identifier for the new copy of the DB cluster snapshot in the destination Amazon Web Services Region.    SourceDBClusterSnapshotIdentifier - The DB cluster snapshot identifier for the encrypted DB cluster snapshot to be copied. This identifier must be in the ARN format for the source Amazon Web Services Region and is the same value as the SourceDBClusterSnapshotIdentifier in the presigned URL.   To cancel the copy operation once it is in progress, delete the target DB cluster snapshot identified by TargetDBClusterSnapshotIdentifier while that DB cluster snapshot is in "copying" status. For more information on copying encrypted Amazon Aurora DB cluster snapshots from one Amazon Web Services Region to another, see  Copying a Snapshot in the Amazon Aurora User Guide. For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  copyDBClusterSnapshot(callback?: (err: AWSError, data: RDS.Types.CopyDBClusterSnapshotResult) => void): Request<RDS.Types.CopyDBClusterSnapshotResult, AWSError>;
  /**
   * Copies the specified DB parameter group.
   */
  copyDBParameterGroup(params: RDS.Types.CopyDBParameterGroupMessage, callback?: (err: AWSError, data: RDS.Types.CopyDBParameterGroupResult) => void): Request<RDS.Types.CopyDBParameterGroupResult, AWSError>;
  /**
   * Copies the specified DB parameter group.
   */
  copyDBParameterGroup(callback?: (err: AWSError, data: RDS.Types.CopyDBParameterGroupResult) => void): Request<RDS.Types.CopyDBParameterGroupResult, AWSError>;
  /**
   * Copies the specified DB snapshot. The source DB snapshot must be in the available state. You can copy a snapshot from one Amazon Web Services Region to another. In that case, the Amazon Web Services Region where you call the CopyDBSnapshot operation is the destination Amazon Web Services Region for the DB snapshot copy. This command doesn't apply to RDS Custom. For more information about copying snapshots, see Copying a DB Snapshot in the Amazon RDS User Guide.
   */
  copyDBSnapshot(params: RDS.Types.CopyDBSnapshotMessage, callback?: (err: AWSError, data: RDS.Types.CopyDBSnapshotResult) => void): Request<RDS.Types.CopyDBSnapshotResult, AWSError>;
  /**
   * Copies the specified DB snapshot. The source DB snapshot must be in the available state. You can copy a snapshot from one Amazon Web Services Region to another. In that case, the Amazon Web Services Region where you call the CopyDBSnapshot operation is the destination Amazon Web Services Region for the DB snapshot copy. This command doesn't apply to RDS Custom. For more information about copying snapshots, see Copying a DB Snapshot in the Amazon RDS User Guide.
   */
  copyDBSnapshot(callback?: (err: AWSError, data: RDS.Types.CopyDBSnapshotResult) => void): Request<RDS.Types.CopyDBSnapshotResult, AWSError>;
  /**
   * Copies the specified option group.
   */
  copyOptionGroup(params: RDS.Types.CopyOptionGroupMessage, callback?: (err: AWSError, data: RDS.Types.CopyOptionGroupResult) => void): Request<RDS.Types.CopyOptionGroupResult, AWSError>;
  /**
   * Copies the specified option group.
   */
  copyOptionGroup(callback?: (err: AWSError, data: RDS.Types.CopyOptionGroupResult) => void): Request<RDS.Types.CopyOptionGroupResult, AWSError>;
  /**
   * Creates a blue/green deployment. A blue/green deployment creates a staging environment that copies the production environment. In a blue/green deployment, the blue environment is the current production environment. The green environment is the staging environment. The staging environment stays in sync with the current production environment using logical replication. You can make changes to the databases in the green environment without affecting production workloads. For example, you can upgrade the major or minor DB engine version, change database parameters, or make schema changes in the staging environment. You can thoroughly test changes in the green environment. When ready, you can switch over the environments to promote the green environment to be the new production environment. The switchover typically takes under a minute. For more information, see Using Amazon RDS Blue/Green Deployments for database updates in the Amazon RDS User Guide and  Using Amazon RDS Blue/Green Deployments for database updates in the Amazon Aurora User Guide.
   */
  createBlueGreenDeployment(params: RDS.Types.CreateBlueGreenDeploymentRequest, callback?: (err: AWSError, data: RDS.Types.CreateBlueGreenDeploymentResponse) => void): Request<RDS.Types.CreateBlueGreenDeploymentResponse, AWSError>;
  /**
   * Creates a blue/green deployment. A blue/green deployment creates a staging environment that copies the production environment. In a blue/green deployment, the blue environment is the current production environment. The green environment is the staging environment. The staging environment stays in sync with the current production environment using logical replication. You can make changes to the databases in the green environment without affecting production workloads. For example, you can upgrade the major or minor DB engine version, change database parameters, or make schema changes in the staging environment. You can thoroughly test changes in the green environment. When ready, you can switch over the environments to promote the green environment to be the new production environment. The switchover typically takes under a minute. For more information, see Using Amazon RDS Blue/Green Deployments for database updates in the Amazon RDS User Guide and  Using Amazon RDS Blue/Green Deployments for database updates in the Amazon Aurora User Guide.
   */
  createBlueGreenDeployment(callback?: (err: AWSError, data: RDS.Types.CreateBlueGreenDeploymentResponse) => void): Request<RDS.Types.CreateBlueGreenDeploymentResponse, AWSError>;
  /**
   * Creates a custom DB engine version (CEV).
   */
  createCustomDBEngineVersion(params: RDS.Types.CreateCustomDBEngineVersionMessage, callback?: (err: AWSError, data: RDS.Types.DBEngineVersion) => void): Request<RDS.Types.DBEngineVersion, AWSError>;
  /**
   * Creates a custom DB engine version (CEV).
   */
  createCustomDBEngineVersion(callback?: (err: AWSError, data: RDS.Types.DBEngineVersion) => void): Request<RDS.Types.DBEngineVersion, AWSError>;
  /**
   * Creates a new Amazon Aurora DB cluster or Multi-AZ DB cluster. If you create an Aurora DB cluster, the request creates an empty cluster. You must explicitly create the writer instance for your DB cluster using the CreateDBInstance operation. If you create a Multi-AZ DB cluster, the request creates a writer and two reader DB instances for you, each in a different Availability Zone. You can use the ReplicationSourceIdentifier parameter to create an Amazon Aurora DB cluster as a read replica of another DB cluster or Amazon RDS for MySQL or PostgreSQL DB instance. For more information about Amazon Aurora, see What is Amazon Aurora? in the Amazon Aurora User Guide. You can also use the ReplicationSourceIdentifier parameter to create a Multi-AZ DB cluster read replica with an RDS for MySQL or PostgreSQL DB instance as the source. For more information about Multi-AZ DB clusters, see Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  createDBCluster(params: RDS.Types.CreateDBClusterMessage, callback?: (err: AWSError, data: RDS.Types.CreateDBClusterResult) => void): Request<RDS.Types.CreateDBClusterResult, AWSError>;
  /**
   * Creates a new Amazon Aurora DB cluster or Multi-AZ DB cluster. If you create an Aurora DB cluster, the request creates an empty cluster. You must explicitly create the writer instance for your DB cluster using the CreateDBInstance operation. If you create a Multi-AZ DB cluster, the request creates a writer and two reader DB instances for you, each in a different Availability Zone. You can use the ReplicationSourceIdentifier parameter to create an Amazon Aurora DB cluster as a read replica of another DB cluster or Amazon RDS for MySQL or PostgreSQL DB instance. For more information about Amazon Aurora, see What is Amazon Aurora? in the Amazon Aurora User Guide. You can also use the ReplicationSourceIdentifier parameter to create a Multi-AZ DB cluster read replica with an RDS for MySQL or PostgreSQL DB instance as the source. For more information about Multi-AZ DB clusters, see Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  createDBCluster(callback?: (err: AWSError, data: RDS.Types.CreateDBClusterResult) => void): Request<RDS.Types.CreateDBClusterResult, AWSError>;
  /**
   * Creates a new custom endpoint and associates it with an Amazon Aurora DB cluster.  This action applies only to Aurora DB clusters. 
   */
  createDBClusterEndpoint(params: RDS.Types.CreateDBClusterEndpointMessage, callback?: (err: AWSError, data: RDS.Types.DBClusterEndpoint) => void): Request<RDS.Types.DBClusterEndpoint, AWSError>;
  /**
   * Creates a new custom endpoint and associates it with an Amazon Aurora DB cluster.  This action applies only to Aurora DB clusters. 
   */
  createDBClusterEndpoint(callback?: (err: AWSError, data: RDS.Types.DBClusterEndpoint) => void): Request<RDS.Types.DBClusterEndpoint, AWSError>;
  /**
   * Creates a new DB cluster parameter group. Parameters in a DB cluster parameter group apply to all of the instances in a DB cluster. A DB cluster parameter group is initially created with the default parameters for the database engine used by instances in the DB cluster. To provide custom values for any of the parameters, you must modify the group after creating it using ModifyDBClusterParameterGroup. Once you've created a DB cluster parameter group, you need to associate it with your DB cluster using ModifyDBCluster. When you associate a new DB cluster parameter group with a running Aurora DB cluster, reboot the DB instances in the DB cluster without failover for the new DB cluster parameter group and associated settings to take effect. When you associate a new DB cluster parameter group with a running Multi-AZ DB cluster, reboot the DB cluster without failover for the new DB cluster parameter group and associated settings to take effect.  After you create a DB cluster parameter group, you should wait at least 5 minutes before creating your first DB cluster that uses that DB cluster parameter group as the default parameter group. This allows Amazon RDS to fully complete the create action before the DB cluster parameter group is used as the default for a new DB cluster. This is especially important for parameters that are critical when creating the default database for a DB cluster, such as the character set for the default database defined by the character_set_database parameter. You can use the Parameter Groups option of the Amazon RDS console or the DescribeDBClusterParameters operation to verify that your DB cluster parameter group has been created or modified.  For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  createDBClusterParameterGroup(params: RDS.Types.CreateDBClusterParameterGroupMessage, callback?: (err: AWSError, data: RDS.Types.CreateDBClusterParameterGroupResult) => void): Request<RDS.Types.CreateDBClusterParameterGroupResult, AWSError>;
  /**
   * Creates a new DB cluster parameter group. Parameters in a DB cluster parameter group apply to all of the instances in a DB cluster. A DB cluster parameter group is initially created with the default parameters for the database engine used by instances in the DB cluster. To provide custom values for any of the parameters, you must modify the group after creating it using ModifyDBClusterParameterGroup. Once you've created a DB cluster parameter group, you need to associate it with your DB cluster using ModifyDBCluster. When you associate a new DB cluster parameter group with a running Aurora DB cluster, reboot the DB instances in the DB cluster without failover for the new DB cluster parameter group and associated settings to take effect. When you associate a new DB cluster parameter group with a running Multi-AZ DB cluster, reboot the DB cluster without failover for the new DB cluster parameter group and associated settings to take effect.  After you create a DB cluster parameter group, you should wait at least 5 minutes before creating your first DB cluster that uses that DB cluster parameter group as the default parameter group. This allows Amazon RDS to fully complete the create action before the DB cluster parameter group is used as the default for a new DB cluster. This is especially important for parameters that are critical when creating the default database for a DB cluster, such as the character set for the default database defined by the character_set_database parameter. You can use the Parameter Groups option of the Amazon RDS console or the DescribeDBClusterParameters operation to verify that your DB cluster parameter group has been created or modified.  For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  createDBClusterParameterGroup(callback?: (err: AWSError, data: RDS.Types.CreateDBClusterParameterGroupResult) => void): Request<RDS.Types.CreateDBClusterParameterGroupResult, AWSError>;
  /**
   * Creates a snapshot of a DB cluster. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  createDBClusterSnapshot(params: RDS.Types.CreateDBClusterSnapshotMessage, callback?: (err: AWSError, data: RDS.Types.CreateDBClusterSnapshotResult) => void): Request<RDS.Types.CreateDBClusterSnapshotResult, AWSError>;
  /**
   * Creates a snapshot of a DB cluster. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  createDBClusterSnapshot(callback?: (err: AWSError, data: RDS.Types.CreateDBClusterSnapshotResult) => void): Request<RDS.Types.CreateDBClusterSnapshotResult, AWSError>;
  /**
   * Creates a new DB instance. The new DB instance can be an RDS DB instance, or it can be a DB instance in an Aurora DB cluster. For an Aurora DB cluster, you can call this operation multiple times to add more than one DB instance to the cluster. For more information about creating an RDS DB instance, see  Creating an Amazon RDS DB instance in the Amazon RDS User Guide. For more information about creating a DB instance in an Aurora DB cluster, see  Creating an Amazon Aurora DB cluster in the Amazon Aurora User Guide.
   */
  createDBInstance(params: RDS.Types.CreateDBInstanceMessage, callback?: (err: AWSError, data: RDS.Types.CreateDBInstanceResult) => void): Request<RDS.Types.CreateDBInstanceResult, AWSError>;
  /**
   * Creates a new DB instance. The new DB instance can be an RDS DB instance, or it can be a DB instance in an Aurora DB cluster. For an Aurora DB cluster, you can call this operation multiple times to add more than one DB instance to the cluster. For more information about creating an RDS DB instance, see  Creating an Amazon RDS DB instance in the Amazon RDS User Guide. For more information about creating a DB instance in an Aurora DB cluster, see  Creating an Amazon Aurora DB cluster in the Amazon Aurora User Guide.
   */
  createDBInstance(callback?: (err: AWSError, data: RDS.Types.CreateDBInstanceResult) => void): Request<RDS.Types.CreateDBInstanceResult, AWSError>;
  /**
   * Creates a new DB instance that acts as a read replica for an existing source DB instance or Multi-AZ DB cluster. You can create a read replica for a DB instance running MySQL, MariaDB, Oracle, PostgreSQL, or SQL Server. You can create a read replica for a Multi-AZ DB cluster running MySQL or PostgreSQL. For more information, see Working with read replicas and Migrating from a Multi-AZ DB cluster to a DB instance using a read replica in the Amazon RDS User Guide. Amazon Aurora doesn't support this operation. To create a DB instance for an Aurora DB cluster, use the CreateDBInstance operation. All read replica DB instances are created with backups disabled. All other attributes (including DB security groups and DB parameter groups) are inherited from the source DB instance or cluster, except as specified.  Your source DB instance or cluster must have backup retention enabled. 
   */
  createDBInstanceReadReplica(params: RDS.Types.CreateDBInstanceReadReplicaMessage, callback?: (err: AWSError, data: RDS.Types.CreateDBInstanceReadReplicaResult) => void): Request<RDS.Types.CreateDBInstanceReadReplicaResult, AWSError>;
  /**
   * Creates a new DB instance that acts as a read replica for an existing source DB instance or Multi-AZ DB cluster. You can create a read replica for a DB instance running MySQL, MariaDB, Oracle, PostgreSQL, or SQL Server. You can create a read replica for a Multi-AZ DB cluster running MySQL or PostgreSQL. For more information, see Working with read replicas and Migrating from a Multi-AZ DB cluster to a DB instance using a read replica in the Amazon RDS User Guide. Amazon Aurora doesn't support this operation. To create a DB instance for an Aurora DB cluster, use the CreateDBInstance operation. All read replica DB instances are created with backups disabled. All other attributes (including DB security groups and DB parameter groups) are inherited from the source DB instance or cluster, except as specified.  Your source DB instance or cluster must have backup retention enabled. 
   */
  createDBInstanceReadReplica(callback?: (err: AWSError, data: RDS.Types.CreateDBInstanceReadReplicaResult) => void): Request<RDS.Types.CreateDBInstanceReadReplicaResult, AWSError>;
  /**
   * Creates a new DB parameter group. A DB parameter group is initially created with the default parameters for the database engine used by the DB instance. To provide custom values for any of the parameters, you must modify the group after creating it using ModifyDBParameterGroup. Once you've created a DB parameter group, you need to associate it with your DB instance using ModifyDBInstance. When you associate a new DB parameter group with a running DB instance, you need to reboot the DB instance without failover for the new DB parameter group and associated settings to take effect. This command doesn't apply to RDS Custom.  After you create a DB parameter group, you should wait at least 5 minutes before creating your first DB instance that uses that DB parameter group as the default parameter group. This allows Amazon RDS to fully complete the create action before the parameter group is used as the default for a new DB instance. This is especially important for parameters that are critical when creating the default database for a DB instance, such as the character set for the default database defined by the character_set_database parameter. You can use the Parameter Groups option of the Amazon RDS console or the DescribeDBParameters command to verify that your DB parameter group has been created or modified. 
   */
  createDBParameterGroup(params: RDS.Types.CreateDBParameterGroupMessage, callback?: (err: AWSError, data: RDS.Types.CreateDBParameterGroupResult) => void): Request<RDS.Types.CreateDBParameterGroupResult, AWSError>;
  /**
   * Creates a new DB parameter group. A DB parameter group is initially created with the default parameters for the database engine used by the DB instance. To provide custom values for any of the parameters, you must modify the group after creating it using ModifyDBParameterGroup. Once you've created a DB parameter group, you need to associate it with your DB instance using ModifyDBInstance. When you associate a new DB parameter group with a running DB instance, you need to reboot the DB instance without failover for the new DB parameter group and associated settings to take effect. This command doesn't apply to RDS Custom.  After you create a DB parameter group, you should wait at least 5 minutes before creating your first DB instance that uses that DB parameter group as the default parameter group. This allows Amazon RDS to fully complete the create action before the parameter group is used as the default for a new DB instance. This is especially important for parameters that are critical when creating the default database for a DB instance, such as the character set for the default database defined by the character_set_database parameter. You can use the Parameter Groups option of the Amazon RDS console or the DescribeDBParameters command to verify that your DB parameter group has been created or modified. 
   */
  createDBParameterGroup(callback?: (err: AWSError, data: RDS.Types.CreateDBParameterGroupResult) => void): Request<RDS.Types.CreateDBParameterGroupResult, AWSError>;
  /**
   * Creates a new DB proxy.
   */
  createDBProxy(params: RDS.Types.CreateDBProxyRequest, callback?: (err: AWSError, data: RDS.Types.CreateDBProxyResponse) => void): Request<RDS.Types.CreateDBProxyResponse, AWSError>;
  /**
   * Creates a new DB proxy.
   */
  createDBProxy(callback?: (err: AWSError, data: RDS.Types.CreateDBProxyResponse) => void): Request<RDS.Types.CreateDBProxyResponse, AWSError>;
  /**
   * Creates a DBProxyEndpoint. Only applies to proxies that are associated with Aurora DB clusters. You can use DB proxy endpoints to specify read/write or read-only access to the DB cluster. You can also use DB proxy endpoints to access a DB proxy through a different VPC than the proxy's default VPC.
   */
  createDBProxyEndpoint(params: RDS.Types.CreateDBProxyEndpointRequest, callback?: (err: AWSError, data: RDS.Types.CreateDBProxyEndpointResponse) => void): Request<RDS.Types.CreateDBProxyEndpointResponse, AWSError>;
  /**
   * Creates a DBProxyEndpoint. Only applies to proxies that are associated with Aurora DB clusters. You can use DB proxy endpoints to specify read/write or read-only access to the DB cluster. You can also use DB proxy endpoints to access a DB proxy through a different VPC than the proxy's default VPC.
   */
  createDBProxyEndpoint(callback?: (err: AWSError, data: RDS.Types.CreateDBProxyEndpointResponse) => void): Request<RDS.Types.CreateDBProxyEndpointResponse, AWSError>;
  /**
   * Creates a new DB security group. DB security groups control access to a DB instance. A DB security group controls access to EC2-Classic DB instances that are not in a VPC.  EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that you migrate as soon as possible. For more information, see Migrate from EC2-Classic to a VPC in the Amazon EC2 User Guide, the blog EC2-Classic Networking is Retiring – Here’s How to Prepare, and Moving a DB instance not in a VPC into a VPC in the Amazon RDS User Guide. 
   */
  createDBSecurityGroup(params: RDS.Types.CreateDBSecurityGroupMessage, callback?: (err: AWSError, data: RDS.Types.CreateDBSecurityGroupResult) => void): Request<RDS.Types.CreateDBSecurityGroupResult, AWSError>;
  /**
   * Creates a new DB security group. DB security groups control access to a DB instance. A DB security group controls access to EC2-Classic DB instances that are not in a VPC.  EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that you migrate as soon as possible. For more information, see Migrate from EC2-Classic to a VPC in the Amazon EC2 User Guide, the blog EC2-Classic Networking is Retiring – Here’s How to Prepare, and Moving a DB instance not in a VPC into a VPC in the Amazon RDS User Guide. 
   */
  createDBSecurityGroup(callback?: (err: AWSError, data: RDS.Types.CreateDBSecurityGroupResult) => void): Request<RDS.Types.CreateDBSecurityGroupResult, AWSError>;
  /**
   * Creates a snapshot of a DB instance. The source DB instance must be in the available or storage-optimization state.
   */
  createDBSnapshot(params: RDS.Types.CreateDBSnapshotMessage, callback?: (err: AWSError, data: RDS.Types.CreateDBSnapshotResult) => void): Request<RDS.Types.CreateDBSnapshotResult, AWSError>;
  /**
   * Creates a snapshot of a DB instance. The source DB instance must be in the available or storage-optimization state.
   */
  createDBSnapshot(callback?: (err: AWSError, data: RDS.Types.CreateDBSnapshotResult) => void): Request<RDS.Types.CreateDBSnapshotResult, AWSError>;
  /**
   * Creates a new DB subnet group. DB subnet groups must contain at least one subnet in at least two AZs in the Amazon Web Services Region.
   */
  createDBSubnetGroup(params: RDS.Types.CreateDBSubnetGroupMessage, callback?: (err: AWSError, data: RDS.Types.CreateDBSubnetGroupResult) => void): Request<RDS.Types.CreateDBSubnetGroupResult, AWSError>;
  /**
   * Creates a new DB subnet group. DB subnet groups must contain at least one subnet in at least two AZs in the Amazon Web Services Region.
   */
  createDBSubnetGroup(callback?: (err: AWSError, data: RDS.Types.CreateDBSubnetGroupResult) => void): Request<RDS.Types.CreateDBSubnetGroupResult, AWSError>;
  /**
   * Creates an RDS event notification subscription. This operation requires a topic Amazon Resource Name (ARN) created by either the RDS console, the SNS console, or the SNS API. To obtain an ARN with SNS, you must create a topic in Amazon SNS and subscribe to the topic. The ARN is displayed in the SNS console. You can specify the type of source (SourceType) that you want to be notified of and provide a list of RDS sources (SourceIds) that triggers the events. You can also provide a list of event categories (EventCategories) for events that you want to be notified of. For example, you can specify SourceType = db-instance, SourceIds = mydbinstance1, mydbinstance2 and EventCategories = Availability, Backup. If you specify both the SourceType and SourceIds, such as SourceType = db-instance and SourceIds = myDBInstance1, you are notified of all the db-instance events for the specified source. If you specify a SourceType but do not specify SourceIds, you receive notice of the events for that source type for all your RDS sources. If you don't specify either the SourceType or the SourceIds, you are notified of events generated from all RDS sources belonging to your customer account. For more information about subscribing to an event for RDS DB engines, see  Subscribing to Amazon RDS event notification in the Amazon RDS User Guide. For more information about subscribing to an event for Aurora DB engines, see  Subscribing to Amazon RDS event notification in the Amazon Aurora User Guide.
   */
  createEventSubscription(params: RDS.Types.CreateEventSubscriptionMessage, callback?: (err: AWSError, data: RDS.Types.CreateEventSubscriptionResult) => void): Request<RDS.Types.CreateEventSubscriptionResult, AWSError>;
  /**
   * Creates an RDS event notification subscription. This operation requires a topic Amazon Resource Name (ARN) created by either the RDS console, the SNS console, or the SNS API. To obtain an ARN with SNS, you must create a topic in Amazon SNS and subscribe to the topic. The ARN is displayed in the SNS console. You can specify the type of source (SourceType) that you want to be notified of and provide a list of RDS sources (SourceIds) that triggers the events. You can also provide a list of event categories (EventCategories) for events that you want to be notified of. For example, you can specify SourceType = db-instance, SourceIds = mydbinstance1, mydbinstance2 and EventCategories = Availability, Backup. If you specify both the SourceType and SourceIds, such as SourceType = db-instance and SourceIds = myDBInstance1, you are notified of all the db-instance events for the specified source. If you specify a SourceType but do not specify SourceIds, you receive notice of the events for that source type for all your RDS sources. If you don't specify either the SourceType or the SourceIds, you are notified of events generated from all RDS sources belonging to your customer account. For more information about subscribing to an event for RDS DB engines, see  Subscribing to Amazon RDS event notification in the Amazon RDS User Guide. For more information about subscribing to an event for Aurora DB engines, see  Subscribing to Amazon RDS event notification in the Amazon Aurora User Guide.
   */
  createEventSubscription(callback?: (err: AWSError, data: RDS.Types.CreateEventSubscriptionResult) => void): Request<RDS.Types.CreateEventSubscriptionResult, AWSError>;
  /**
   * Creates an Aurora global database spread across multiple Amazon Web Services Regions. The global database contains a single primary cluster with read-write capability, and a read-only secondary cluster that receives data from the primary cluster through high-speed replication performed by the Aurora storage subsystem. You can create a global database that is initially empty, and then create the primary and secondary DB clusters in the global database. Or you can specify an existing Aurora cluster during the create operation, and this cluster becomes the primary cluster of the global database.  This operation applies only to Aurora DB clusters. 
   */
  createGlobalCluster(params: RDS.Types.CreateGlobalClusterMessage, callback?: (err: AWSError, data: RDS.Types.CreateGlobalClusterResult) => void): Request<RDS.Types.CreateGlobalClusterResult, AWSError>;
  /**
   * Creates an Aurora global database spread across multiple Amazon Web Services Regions. The global database contains a single primary cluster with read-write capability, and a read-only secondary cluster that receives data from the primary cluster through high-speed replication performed by the Aurora storage subsystem. You can create a global database that is initially empty, and then create the primary and secondary DB clusters in the global database. Or you can specify an existing Aurora cluster during the create operation, and this cluster becomes the primary cluster of the global database.  This operation applies only to Aurora DB clusters. 
   */
  createGlobalCluster(callback?: (err: AWSError, data: RDS.Types.CreateGlobalClusterResult) => void): Request<RDS.Types.CreateGlobalClusterResult, AWSError>;
  /**
   * Creates a new option group. You can create up to 20 option groups. This command doesn't apply to RDS Custom.
   */
  createOptionGroup(params: RDS.Types.CreateOptionGroupMessage, callback?: (err: AWSError, data: RDS.Types.CreateOptionGroupResult) => void): Request<RDS.Types.CreateOptionGroupResult, AWSError>;
  /**
   * Creates a new option group. You can create up to 20 option groups. This command doesn't apply to RDS Custom.
   */
  createOptionGroup(callback?: (err: AWSError, data: RDS.Types.CreateOptionGroupResult) => void): Request<RDS.Types.CreateOptionGroupResult, AWSError>;
  /**
   * Deletes a blue/green deployment. For more information, see Using Amazon RDS Blue/Green Deployments for database updates in the Amazon RDS User Guide and Using Amazon RDS Blue/Green Deployments for database updates in the Amazon Aurora User Guide.
   */
  deleteBlueGreenDeployment(params: RDS.Types.DeleteBlueGreenDeploymentRequest, callback?: (err: AWSError, data: RDS.Types.DeleteBlueGreenDeploymentResponse) => void): Request<RDS.Types.DeleteBlueGreenDeploymentResponse, AWSError>;
  /**
   * Deletes a blue/green deployment. For more information, see Using Amazon RDS Blue/Green Deployments for database updates in the Amazon RDS User Guide and Using Amazon RDS Blue/Green Deployments for database updates in the Amazon Aurora User Guide.
   */
  deleteBlueGreenDeployment(callback?: (err: AWSError, data: RDS.Types.DeleteBlueGreenDeploymentResponse) => void): Request<RDS.Types.DeleteBlueGreenDeploymentResponse, AWSError>;
  /**
   * Deletes a custom engine version. To run this command, make sure you meet the following prerequisites:   The CEV must not be the default for RDS Custom. If it is, change the default before running this command.   The CEV must not be associated with an RDS Custom DB instance, RDS Custom instance snapshot, or automated backup of your RDS Custom instance.   Typically, deletion takes a few minutes.  The MediaImport service that imports files from Amazon S3 to create CEVs isn't integrated with Amazon Web Services CloudTrail. If you turn on data logging for Amazon RDS in CloudTrail, calls to the DeleteCustomDbEngineVersion event aren't logged. However, you might see calls from the API gateway that accesses your Amazon S3 bucket. These calls originate from the MediaImport service for the DeleteCustomDbEngineVersion event.  For more information, see Deleting a CEV in the Amazon RDS User Guide.
   */
  deleteCustomDBEngineVersion(params: RDS.Types.DeleteCustomDBEngineVersionMessage, callback?: (err: AWSError, data: RDS.Types.DBEngineVersion) => void): Request<RDS.Types.DBEngineVersion, AWSError>;
  /**
   * Deletes a custom engine version. To run this command, make sure you meet the following prerequisites:   The CEV must not be the default for RDS Custom. If it is, change the default before running this command.   The CEV must not be associated with an RDS Custom DB instance, RDS Custom instance snapshot, or automated backup of your RDS Custom instance.   Typically, deletion takes a few minutes.  The MediaImport service that imports files from Amazon S3 to create CEVs isn't integrated with Amazon Web Services CloudTrail. If you turn on data logging for Amazon RDS in CloudTrail, calls to the DeleteCustomDbEngineVersion event aren't logged. However, you might see calls from the API gateway that accesses your Amazon S3 bucket. These calls originate from the MediaImport service for the DeleteCustomDbEngineVersion event.  For more information, see Deleting a CEV in the Amazon RDS User Guide.
   */
  deleteCustomDBEngineVersion(callback?: (err: AWSError, data: RDS.Types.DBEngineVersion) => void): Request<RDS.Types.DBEngineVersion, AWSError>;
  /**
   * The DeleteDBCluster action deletes a previously provisioned DB cluster. When you delete a DB cluster, all automated backups for that DB cluster are deleted and can't be recovered. Manual DB cluster snapshots of the specified DB cluster are not deleted. If you're deleting a Multi-AZ DB cluster with read replicas, all cluster members are terminated and read replicas are promoted to standalone instances. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  deleteDBCluster(params: RDS.Types.DeleteDBClusterMessage, callback?: (err: AWSError, data: RDS.Types.DeleteDBClusterResult) => void): Request<RDS.Types.DeleteDBClusterResult, AWSError>;
  /**
   * The DeleteDBCluster action deletes a previously provisioned DB cluster. When you delete a DB cluster, all automated backups for that DB cluster are deleted and can't be recovered. Manual DB cluster snapshots of the specified DB cluster are not deleted. If you're deleting a Multi-AZ DB cluster with read replicas, all cluster members are terminated and read replicas are promoted to standalone instances. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  deleteDBCluster(callback?: (err: AWSError, data: RDS.Types.DeleteDBClusterResult) => void): Request<RDS.Types.DeleteDBClusterResult, AWSError>;
  /**
   * Deletes automated backups using the DbClusterResourceId value of the source DB cluster or the Amazon Resource Name (ARN) of the automated backups.
   */
  deleteDBClusterAutomatedBackup(params: RDS.Types.DeleteDBClusterAutomatedBackupMessage, callback?: (err: AWSError, data: RDS.Types.DeleteDBClusterAutomatedBackupResult) => void): Request<RDS.Types.DeleteDBClusterAutomatedBackupResult, AWSError>;
  /**
   * Deletes automated backups using the DbClusterResourceId value of the source DB cluster or the Amazon Resource Name (ARN) of the automated backups.
   */
  deleteDBClusterAutomatedBackup(callback?: (err: AWSError, data: RDS.Types.DeleteDBClusterAutomatedBackupResult) => void): Request<RDS.Types.DeleteDBClusterAutomatedBackupResult, AWSError>;
  /**
   * Deletes a custom endpoint and removes it from an Amazon Aurora DB cluster.  This action only applies to Aurora DB clusters. 
   */
  deleteDBClusterEndpoint(params: RDS.Types.DeleteDBClusterEndpointMessage, callback?: (err: AWSError, data: RDS.Types.DBClusterEndpoint) => void): Request<RDS.Types.DBClusterEndpoint, AWSError>;
  /**
   * Deletes a custom endpoint and removes it from an Amazon Aurora DB cluster.  This action only applies to Aurora DB clusters. 
   */
  deleteDBClusterEndpoint(callback?: (err: AWSError, data: RDS.Types.DBClusterEndpoint) => void): Request<RDS.Types.DBClusterEndpoint, AWSError>;
  /**
   * Deletes a specified DB cluster parameter group. The DB cluster parameter group to be deleted can't be associated with any DB clusters. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  deleteDBClusterParameterGroup(params: RDS.Types.DeleteDBClusterParameterGroupMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a specified DB cluster parameter group. The DB cluster parameter group to be deleted can't be associated with any DB clusters. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  deleteDBClusterParameterGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a DB cluster snapshot. If the snapshot is being copied, the copy operation is terminated.  The DB cluster snapshot must be in the available state to be deleted.  For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  deleteDBClusterSnapshot(params: RDS.Types.DeleteDBClusterSnapshotMessage, callback?: (err: AWSError, data: RDS.Types.DeleteDBClusterSnapshotResult) => void): Request<RDS.Types.DeleteDBClusterSnapshotResult, AWSError>;
  /**
   * Deletes a DB cluster snapshot. If the snapshot is being copied, the copy operation is terminated.  The DB cluster snapshot must be in the available state to be deleted.  For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  deleteDBClusterSnapshot(callback?: (err: AWSError, data: RDS.Types.DeleteDBClusterSnapshotResult) => void): Request<RDS.Types.DeleteDBClusterSnapshotResult, AWSError>;
  /**
   * Deletes a previously provisioned DB instance. When you delete a DB instance, all automated backups for that instance are deleted and can't be recovered. However, manual DB snapshots of the DB instance aren't deleted. If you request a final DB snapshot, the status of the Amazon RDS DB instance is deleting until the DB snapshot is created. This operation can't be canceled or reverted after it begins. To monitor the status of this operation, use DescribeDBInstance. When a DB instance is in a failure state and has a status of failed, incompatible-restore, or incompatible-network, you can only delete it when you skip creation of the final snapshot with the SkipFinalSnapshot parameter. If the specified DB instance is part of an Amazon Aurora DB cluster, you can't delete the DB instance if both of the following conditions are true:   The DB cluster is a read replica of another Amazon Aurora DB cluster.   The DB instance is the only instance in the DB cluster.   To delete a DB instance in this case, first use the PromoteReadReplicaDBCluster operation to promote the DB cluster so that it's no longer a read replica. After the promotion completes, use the DeleteDBInstance operation to delete the final instance in the DB cluster.  For RDS Custom DB instances, deleting the DB instance permanently deletes the EC2 instance and the associated EBS volumes. Make sure that you don't terminate or delete these resources before you delete the DB instance. Otherwise, deleting the DB instance and creation of the final snapshot might fail. 
   */
  deleteDBInstance(params: RDS.Types.DeleteDBInstanceMessage, callback?: (err: AWSError, data: RDS.Types.DeleteDBInstanceResult) => void): Request<RDS.Types.DeleteDBInstanceResult, AWSError>;
  /**
   * Deletes a previously provisioned DB instance. When you delete a DB instance, all automated backups for that instance are deleted and can't be recovered. However, manual DB snapshots of the DB instance aren't deleted. If you request a final DB snapshot, the status of the Amazon RDS DB instance is deleting until the DB snapshot is created. This operation can't be canceled or reverted after it begins. To monitor the status of this operation, use DescribeDBInstance. When a DB instance is in a failure state and has a status of failed, incompatible-restore, or incompatible-network, you can only delete it when you skip creation of the final snapshot with the SkipFinalSnapshot parameter. If the specified DB instance is part of an Amazon Aurora DB cluster, you can't delete the DB instance if both of the following conditions are true:   The DB cluster is a read replica of another Amazon Aurora DB cluster.   The DB instance is the only instance in the DB cluster.   To delete a DB instance in this case, first use the PromoteReadReplicaDBCluster operation to promote the DB cluster so that it's no longer a read replica. After the promotion completes, use the DeleteDBInstance operation to delete the final instance in the DB cluster.  For RDS Custom DB instances, deleting the DB instance permanently deletes the EC2 instance and the associated EBS volumes. Make sure that you don't terminate or delete these resources before you delete the DB instance. Otherwise, deleting the DB instance and creation of the final snapshot might fail. 
   */
  deleteDBInstance(callback?: (err: AWSError, data: RDS.Types.DeleteDBInstanceResult) => void): Request<RDS.Types.DeleteDBInstanceResult, AWSError>;
  /**
   * Deletes automated backups using the DbiResourceId value of the source DB instance or the Amazon Resource Name (ARN) of the automated backups.
   */
  deleteDBInstanceAutomatedBackup(params: RDS.Types.DeleteDBInstanceAutomatedBackupMessage, callback?: (err: AWSError, data: RDS.Types.DeleteDBInstanceAutomatedBackupResult) => void): Request<RDS.Types.DeleteDBInstanceAutomatedBackupResult, AWSError>;
  /**
   * Deletes automated backups using the DbiResourceId value of the source DB instance or the Amazon Resource Name (ARN) of the automated backups.
   */
  deleteDBInstanceAutomatedBackup(callback?: (err: AWSError, data: RDS.Types.DeleteDBInstanceAutomatedBackupResult) => void): Request<RDS.Types.DeleteDBInstanceAutomatedBackupResult, AWSError>;
  /**
   * Deletes a specified DB parameter group. The DB parameter group to be deleted can't be associated with any DB instances.
   */
  deleteDBParameterGroup(params: RDS.Types.DeleteDBParameterGroupMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a specified DB parameter group. The DB parameter group to be deleted can't be associated with any DB instances.
   */
  deleteDBParameterGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an existing DB proxy.
   */
  deleteDBProxy(params: RDS.Types.DeleteDBProxyRequest, callback?: (err: AWSError, data: RDS.Types.DeleteDBProxyResponse) => void): Request<RDS.Types.DeleteDBProxyResponse, AWSError>;
  /**
   * Deletes an existing DB proxy.
   */
  deleteDBProxy(callback?: (err: AWSError, data: RDS.Types.DeleteDBProxyResponse) => void): Request<RDS.Types.DeleteDBProxyResponse, AWSError>;
  /**
   * Deletes a DBProxyEndpoint. Doing so removes the ability to access the DB proxy using the endpoint that you defined. The endpoint that you delete might have provided capabilities such as read/write or read-only operations, or using a different VPC than the DB proxy's default VPC.
   */
  deleteDBProxyEndpoint(params: RDS.Types.DeleteDBProxyEndpointRequest, callback?: (err: AWSError, data: RDS.Types.DeleteDBProxyEndpointResponse) => void): Request<RDS.Types.DeleteDBProxyEndpointResponse, AWSError>;
  /**
   * Deletes a DBProxyEndpoint. Doing so removes the ability to access the DB proxy using the endpoint that you defined. The endpoint that you delete might have provided capabilities such as read/write or read-only operations, or using a different VPC than the DB proxy's default VPC.
   */
  deleteDBProxyEndpoint(callback?: (err: AWSError, data: RDS.Types.DeleteDBProxyEndpointResponse) => void): Request<RDS.Types.DeleteDBProxyEndpointResponse, AWSError>;
  /**
   * Deletes a DB security group. The specified DB security group must not be associated with any DB instances.  EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that you migrate as soon as possible. For more information, see Migrate from EC2-Classic to a VPC in the Amazon EC2 User Guide, the blog EC2-Classic Networking is Retiring – Here’s How to Prepare, and Moving a DB instance not in a VPC into a VPC in the Amazon RDS User Guide. 
   */
  deleteDBSecurityGroup(params: RDS.Types.DeleteDBSecurityGroupMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a DB security group. The specified DB security group must not be associated with any DB instances.  EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that you migrate as soon as possible. For more information, see Migrate from EC2-Classic to a VPC in the Amazon EC2 User Guide, the blog EC2-Classic Networking is Retiring – Here’s How to Prepare, and Moving a DB instance not in a VPC into a VPC in the Amazon RDS User Guide. 
   */
  deleteDBSecurityGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a DB snapshot. If the snapshot is being copied, the copy operation is terminated.  The DB snapshot must be in the available state to be deleted. 
   */
  deleteDBSnapshot(params: RDS.Types.DeleteDBSnapshotMessage, callback?: (err: AWSError, data: RDS.Types.DeleteDBSnapshotResult) => void): Request<RDS.Types.DeleteDBSnapshotResult, AWSError>;
  /**
   * Deletes a DB snapshot. If the snapshot is being copied, the copy operation is terminated.  The DB snapshot must be in the available state to be deleted. 
   */
  deleteDBSnapshot(callback?: (err: AWSError, data: RDS.Types.DeleteDBSnapshotResult) => void): Request<RDS.Types.DeleteDBSnapshotResult, AWSError>;
  /**
   * Deletes a DB subnet group.  The specified database subnet group must not be associated with any DB instances. 
   */
  deleteDBSubnetGroup(params: RDS.Types.DeleteDBSubnetGroupMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a DB subnet group.  The specified database subnet group must not be associated with any DB instances. 
   */
  deleteDBSubnetGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an RDS event notification subscription.
   */
  deleteEventSubscription(params: RDS.Types.DeleteEventSubscriptionMessage, callback?: (err: AWSError, data: RDS.Types.DeleteEventSubscriptionResult) => void): Request<RDS.Types.DeleteEventSubscriptionResult, AWSError>;
  /**
   * Deletes an RDS event notification subscription.
   */
  deleteEventSubscription(callback?: (err: AWSError, data: RDS.Types.DeleteEventSubscriptionResult) => void): Request<RDS.Types.DeleteEventSubscriptionResult, AWSError>;
  /**
   * Deletes a global database cluster. The primary and secondary clusters must already be detached or destroyed first.  This action only applies to Aurora DB clusters. 
   */
  deleteGlobalCluster(params: RDS.Types.DeleteGlobalClusterMessage, callback?: (err: AWSError, data: RDS.Types.DeleteGlobalClusterResult) => void): Request<RDS.Types.DeleteGlobalClusterResult, AWSError>;
  /**
   * Deletes a global database cluster. The primary and secondary clusters must already be detached or destroyed first.  This action only applies to Aurora DB clusters. 
   */
  deleteGlobalCluster(callback?: (err: AWSError, data: RDS.Types.DeleteGlobalClusterResult) => void): Request<RDS.Types.DeleteGlobalClusterResult, AWSError>;
  /**
   * Deletes an existing option group.
   */
  deleteOptionGroup(params: RDS.Types.DeleteOptionGroupMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an existing option group.
   */
  deleteOptionGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove the association between one or more DBProxyTarget data structures and a DBProxyTargetGroup.
   */
  deregisterDBProxyTargets(params: RDS.Types.DeregisterDBProxyTargetsRequest, callback?: (err: AWSError, data: RDS.Types.DeregisterDBProxyTargetsResponse) => void): Request<RDS.Types.DeregisterDBProxyTargetsResponse, AWSError>;
  /**
   * Remove the association between one or more DBProxyTarget data structures and a DBProxyTargetGroup.
   */
  deregisterDBProxyTargets(callback?: (err: AWSError, data: RDS.Types.DeregisterDBProxyTargetsResponse) => void): Request<RDS.Types.DeregisterDBProxyTargetsResponse, AWSError>;
  /**
   * Lists all of the attributes for a customer account. The attributes include Amazon RDS quotas for the account, such as the number of DB instances allowed. The description for a quota includes the quota name, current usage toward that quota, and the quota's maximum value. This command doesn't take any parameters.
   */
  describeAccountAttributes(params: RDS.Types.DescribeAccountAttributesMessage, callback?: (err: AWSError, data: RDS.Types.AccountAttributesMessage) => void): Request<RDS.Types.AccountAttributesMessage, AWSError>;
  /**
   * Lists all of the attributes for a customer account. The attributes include Amazon RDS quotas for the account, such as the number of DB instances allowed. The description for a quota includes the quota name, current usage toward that quota, and the quota's maximum value. This command doesn't take any parameters.
   */
  describeAccountAttributes(callback?: (err: AWSError, data: RDS.Types.AccountAttributesMessage) => void): Request<RDS.Types.AccountAttributesMessage, AWSError>;
  /**
   * Describes one or more blue/green deployments. For more information, see Using Amazon RDS Blue/Green Deployments for database updates in the Amazon RDS User Guide and  Using Amazon RDS Blue/Green Deployments for database updates in the Amazon Aurora User Guide.
   */
  describeBlueGreenDeployments(params: RDS.Types.DescribeBlueGreenDeploymentsRequest, callback?: (err: AWSError, data: RDS.Types.DescribeBlueGreenDeploymentsResponse) => void): Request<RDS.Types.DescribeBlueGreenDeploymentsResponse, AWSError>;
  /**
   * Describes one or more blue/green deployments. For more information, see Using Amazon RDS Blue/Green Deployments for database updates in the Amazon RDS User Guide and  Using Amazon RDS Blue/Green Deployments for database updates in the Amazon Aurora User Guide.
   */
  describeBlueGreenDeployments(callback?: (err: AWSError, data: RDS.Types.DescribeBlueGreenDeploymentsResponse) => void): Request<RDS.Types.DescribeBlueGreenDeploymentsResponse, AWSError>;
  /**
   * Lists the set of certificate authority (CA) certificates provided by Amazon RDS for this Amazon Web Services account. For more information, see Using SSL/TLS to encrypt a connection to a DB instance in the Amazon RDS User Guide and  Using SSL/TLS to encrypt a connection to a DB cluster in the Amazon Aurora User Guide.
   */
  describeCertificates(params: RDS.Types.DescribeCertificatesMessage, callback?: (err: AWSError, data: RDS.Types.CertificateMessage) => void): Request<RDS.Types.CertificateMessage, AWSError>;
  /**
   * Lists the set of certificate authority (CA) certificates provided by Amazon RDS for this Amazon Web Services account. For more information, see Using SSL/TLS to encrypt a connection to a DB instance in the Amazon RDS User Guide and  Using SSL/TLS to encrypt a connection to a DB cluster in the Amazon Aurora User Guide.
   */
  describeCertificates(callback?: (err: AWSError, data: RDS.Types.CertificateMessage) => void): Request<RDS.Types.CertificateMessage, AWSError>;
  /**
   * Displays backups for both current and deleted DB clusters. For example, use this operation to find details about automated backups for previously deleted clusters. Current clusters are returned for both the DescribeDBClusterAutomatedBackups and DescribeDBClusters operations. All parameters are optional.
   */
  describeDBClusterAutomatedBackups(params: RDS.Types.DescribeDBClusterAutomatedBackupsMessage, callback?: (err: AWSError, data: RDS.Types.DBClusterAutomatedBackupMessage) => void): Request<RDS.Types.DBClusterAutomatedBackupMessage, AWSError>;
  /**
   * Displays backups for both current and deleted DB clusters. For example, use this operation to find details about automated backups for previously deleted clusters. Current clusters are returned for both the DescribeDBClusterAutomatedBackups and DescribeDBClusters operations. All parameters are optional.
   */
  describeDBClusterAutomatedBackups(callback?: (err: AWSError, data: RDS.Types.DBClusterAutomatedBackupMessage) => void): Request<RDS.Types.DBClusterAutomatedBackupMessage, AWSError>;
  /**
   * Returns information about backtracks for a DB cluster. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide.  This action only applies to Aurora MySQL DB clusters. 
   */
  describeDBClusterBacktracks(params: RDS.Types.DescribeDBClusterBacktracksMessage, callback?: (err: AWSError, data: RDS.Types.DBClusterBacktrackMessage) => void): Request<RDS.Types.DBClusterBacktrackMessage, AWSError>;
  /**
   * Returns information about backtracks for a DB cluster. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide.  This action only applies to Aurora MySQL DB clusters. 
   */
  describeDBClusterBacktracks(callback?: (err: AWSError, data: RDS.Types.DBClusterBacktrackMessage) => void): Request<RDS.Types.DBClusterBacktrackMessage, AWSError>;
  /**
   * Returns information about endpoints for an Amazon Aurora DB cluster.  This action only applies to Aurora DB clusters. 
   */
  describeDBClusterEndpoints(params: RDS.Types.DescribeDBClusterEndpointsMessage, callback?: (err: AWSError, data: RDS.Types.DBClusterEndpointMessage) => void): Request<RDS.Types.DBClusterEndpointMessage, AWSError>;
  /**
   * Returns information about endpoints for an Amazon Aurora DB cluster.  This action only applies to Aurora DB clusters. 
   */
  describeDBClusterEndpoints(callback?: (err: AWSError, data: RDS.Types.DBClusterEndpointMessage) => void): Request<RDS.Types.DBClusterEndpointMessage, AWSError>;
  /**
   * Returns a list of DBClusterParameterGroup descriptions. If a DBClusterParameterGroupName parameter is specified, the list will contain only the description of the specified DB cluster parameter group. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  describeDBClusterParameterGroups(params: RDS.Types.DescribeDBClusterParameterGroupsMessage, callback?: (err: AWSError, data: RDS.Types.DBClusterParameterGroupsMessage) => void): Request<RDS.Types.DBClusterParameterGroupsMessage, AWSError>;
  /**
   * Returns a list of DBClusterParameterGroup descriptions. If a DBClusterParameterGroupName parameter is specified, the list will contain only the description of the specified DB cluster parameter group. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  describeDBClusterParameterGroups(callback?: (err: AWSError, data: RDS.Types.DBClusterParameterGroupsMessage) => void): Request<RDS.Types.DBClusterParameterGroupsMessage, AWSError>;
  /**
   * Returns the detailed parameter list for a particular DB cluster parameter group. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  describeDBClusterParameters(params: RDS.Types.DescribeDBClusterParametersMessage, callback?: (err: AWSError, data: RDS.Types.DBClusterParameterGroupDetails) => void): Request<RDS.Types.DBClusterParameterGroupDetails, AWSError>;
  /**
   * Returns the detailed parameter list for a particular DB cluster parameter group. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  describeDBClusterParameters(callback?: (err: AWSError, data: RDS.Types.DBClusterParameterGroupDetails) => void): Request<RDS.Types.DBClusterParameterGroupDetails, AWSError>;
  /**
   * Returns a list of DB cluster snapshot attribute names and values for a manual DB cluster snapshot. When sharing snapshots with other Amazon Web Services accounts, DescribeDBClusterSnapshotAttributes returns the restore attribute and a list of IDs for the Amazon Web Services accounts that are authorized to copy or restore the manual DB cluster snapshot. If all is included in the list of values for the restore attribute, then the manual DB cluster snapshot is public and can be copied or restored by all Amazon Web Services accounts. To add or remove access for an Amazon Web Services account to copy or restore a manual DB cluster snapshot, or to make the manual DB cluster snapshot public or private, use the ModifyDBClusterSnapshotAttribute API action.
   */
  describeDBClusterSnapshotAttributes(params: RDS.Types.DescribeDBClusterSnapshotAttributesMessage, callback?: (err: AWSError, data: RDS.Types.DescribeDBClusterSnapshotAttributesResult) => void): Request<RDS.Types.DescribeDBClusterSnapshotAttributesResult, AWSError>;
  /**
   * Returns a list of DB cluster snapshot attribute names and values for a manual DB cluster snapshot. When sharing snapshots with other Amazon Web Services accounts, DescribeDBClusterSnapshotAttributes returns the restore attribute and a list of IDs for the Amazon Web Services accounts that are authorized to copy or restore the manual DB cluster snapshot. If all is included in the list of values for the restore attribute, then the manual DB cluster snapshot is public and can be copied or restored by all Amazon Web Services accounts. To add or remove access for an Amazon Web Services account to copy or restore a manual DB cluster snapshot, or to make the manual DB cluster snapshot public or private, use the ModifyDBClusterSnapshotAttribute API action.
   */
  describeDBClusterSnapshotAttributes(callback?: (err: AWSError, data: RDS.Types.DescribeDBClusterSnapshotAttributesResult) => void): Request<RDS.Types.DescribeDBClusterSnapshotAttributesResult, AWSError>;
  /**
   * Returns information about DB cluster snapshots. This API action supports pagination. For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  describeDBClusterSnapshots(params: RDS.Types.DescribeDBClusterSnapshotsMessage, callback?: (err: AWSError, data: RDS.Types.DBClusterSnapshotMessage) => void): Request<RDS.Types.DBClusterSnapshotMessage, AWSError>;
  /**
   * Returns information about DB cluster snapshots. This API action supports pagination. For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  describeDBClusterSnapshots(callback?: (err: AWSError, data: RDS.Types.DBClusterSnapshotMessage) => void): Request<RDS.Types.DBClusterSnapshotMessage, AWSError>;
  /**
   * Describes existing Amazon Aurora DB clusters and Multi-AZ DB clusters. This API supports pagination. For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide. This operation can also return information for Amazon Neptune DB instances and Amazon DocumentDB instances.
   */
  describeDBClusters(params: RDS.Types.DescribeDBClustersMessage, callback?: (err: AWSError, data: RDS.Types.DBClusterMessage) => void): Request<RDS.Types.DBClusterMessage, AWSError>;
  /**
   * Describes existing Amazon Aurora DB clusters and Multi-AZ DB clusters. This API supports pagination. For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide. This operation can also return information for Amazon Neptune DB instances and Amazon DocumentDB instances.
   */
  describeDBClusters(callback?: (err: AWSError, data: RDS.Types.DBClusterMessage) => void): Request<RDS.Types.DBClusterMessage, AWSError>;
  /**
   * Describes the properties of specific versions of DB engines.
   */
  describeDBEngineVersions(params: RDS.Types.DescribeDBEngineVersionsMessage, callback?: (err: AWSError, data: RDS.Types.DBEngineVersionMessage) => void): Request<RDS.Types.DBEngineVersionMessage, AWSError>;
  /**
   * Describes the properties of specific versions of DB engines.
   */
  describeDBEngineVersions(callback?: (err: AWSError, data: RDS.Types.DBEngineVersionMessage) => void): Request<RDS.Types.DBEngineVersionMessage, AWSError>;
  /**
   * Displays backups for both current and deleted instances. For example, use this operation to find details about automated backups for previously deleted instances. Current instances with retention periods greater than zero (0) are returned for both the DescribeDBInstanceAutomatedBackups and DescribeDBInstances operations. All parameters are optional.
   */
  describeDBInstanceAutomatedBackups(params: RDS.Types.DescribeDBInstanceAutomatedBackupsMessage, callback?: (err: AWSError, data: RDS.Types.DBInstanceAutomatedBackupMessage) => void): Request<RDS.Types.DBInstanceAutomatedBackupMessage, AWSError>;
  /**
   * Displays backups for both current and deleted instances. For example, use this operation to find details about automated backups for previously deleted instances. Current instances with retention periods greater than zero (0) are returned for both the DescribeDBInstanceAutomatedBackups and DescribeDBInstances operations. All parameters are optional.
   */
  describeDBInstanceAutomatedBackups(callback?: (err: AWSError, data: RDS.Types.DBInstanceAutomatedBackupMessage) => void): Request<RDS.Types.DBInstanceAutomatedBackupMessage, AWSError>;
  /**
   * Describes provisioned RDS instances. This API supports pagination.  This operation can also return information for Amazon Neptune DB instances and Amazon DocumentDB instances. 
   */
  describeDBInstances(params: RDS.Types.DescribeDBInstancesMessage, callback?: (err: AWSError, data: RDS.Types.DBInstanceMessage) => void): Request<RDS.Types.DBInstanceMessage, AWSError>;
  /**
   * Describes provisioned RDS instances. This API supports pagination.  This operation can also return information for Amazon Neptune DB instances and Amazon DocumentDB instances. 
   */
  describeDBInstances(callback?: (err: AWSError, data: RDS.Types.DBInstanceMessage) => void): Request<RDS.Types.DBInstanceMessage, AWSError>;
  /**
   * Returns a list of DB log files for the DB instance. This command doesn't apply to RDS Custom.
   */
  describeDBLogFiles(params: RDS.Types.DescribeDBLogFilesMessage, callback?: (err: AWSError, data: RDS.Types.DescribeDBLogFilesResponse) => void): Request<RDS.Types.DescribeDBLogFilesResponse, AWSError>;
  /**
   * Returns a list of DB log files for the DB instance. This command doesn't apply to RDS Custom.
   */
  describeDBLogFiles(callback?: (err: AWSError, data: RDS.Types.DescribeDBLogFilesResponse) => void): Request<RDS.Types.DescribeDBLogFilesResponse, AWSError>;
  /**
   * Returns a list of DBParameterGroup descriptions. If a DBParameterGroupName is specified, the list will contain only the description of the specified DB parameter group.
   */
  describeDBParameterGroups(params: RDS.Types.DescribeDBParameterGroupsMessage, callback?: (err: AWSError, data: RDS.Types.DBParameterGroupsMessage) => void): Request<RDS.Types.DBParameterGroupsMessage, AWSError>;
  /**
   * Returns a list of DBParameterGroup descriptions. If a DBParameterGroupName is specified, the list will contain only the description of the specified DB parameter group.
   */
  describeDBParameterGroups(callback?: (err: AWSError, data: RDS.Types.DBParameterGroupsMessage) => void): Request<RDS.Types.DBParameterGroupsMessage, AWSError>;
  /**
   * Returns the detailed parameter list for a particular DB parameter group.
   */
  describeDBParameters(params: RDS.Types.DescribeDBParametersMessage, callback?: (err: AWSError, data: RDS.Types.DBParameterGroupDetails) => void): Request<RDS.Types.DBParameterGroupDetails, AWSError>;
  /**
   * Returns the detailed parameter list for a particular DB parameter group.
   */
  describeDBParameters(callback?: (err: AWSError, data: RDS.Types.DBParameterGroupDetails) => void): Request<RDS.Types.DBParameterGroupDetails, AWSError>;
  /**
   * Returns information about DB proxies.
   */
  describeDBProxies(params: RDS.Types.DescribeDBProxiesRequest, callback?: (err: AWSError, data: RDS.Types.DescribeDBProxiesResponse) => void): Request<RDS.Types.DescribeDBProxiesResponse, AWSError>;
  /**
   * Returns information about DB proxies.
   */
  describeDBProxies(callback?: (err: AWSError, data: RDS.Types.DescribeDBProxiesResponse) => void): Request<RDS.Types.DescribeDBProxiesResponse, AWSError>;
  /**
   * Returns information about DB proxy endpoints.
   */
  describeDBProxyEndpoints(params: RDS.Types.DescribeDBProxyEndpointsRequest, callback?: (err: AWSError, data: RDS.Types.DescribeDBProxyEndpointsResponse) => void): Request<RDS.Types.DescribeDBProxyEndpointsResponse, AWSError>;
  /**
   * Returns information about DB proxy endpoints.
   */
  describeDBProxyEndpoints(callback?: (err: AWSError, data: RDS.Types.DescribeDBProxyEndpointsResponse) => void): Request<RDS.Types.DescribeDBProxyEndpointsResponse, AWSError>;
  /**
   * Returns information about DB proxy target groups, represented by DBProxyTargetGroup data structures.
   */
  describeDBProxyTargetGroups(params: RDS.Types.DescribeDBProxyTargetGroupsRequest, callback?: (err: AWSError, data: RDS.Types.DescribeDBProxyTargetGroupsResponse) => void): Request<RDS.Types.DescribeDBProxyTargetGroupsResponse, AWSError>;
  /**
   * Returns information about DB proxy target groups, represented by DBProxyTargetGroup data structures.
   */
  describeDBProxyTargetGroups(callback?: (err: AWSError, data: RDS.Types.DescribeDBProxyTargetGroupsResponse) => void): Request<RDS.Types.DescribeDBProxyTargetGroupsResponse, AWSError>;
  /**
   * Returns information about DBProxyTarget objects. This API supports pagination.
   */
  describeDBProxyTargets(params: RDS.Types.DescribeDBProxyTargetsRequest, callback?: (err: AWSError, data: RDS.Types.DescribeDBProxyTargetsResponse) => void): Request<RDS.Types.DescribeDBProxyTargetsResponse, AWSError>;
  /**
   * Returns information about DBProxyTarget objects. This API supports pagination.
   */
  describeDBProxyTargets(callback?: (err: AWSError, data: RDS.Types.DescribeDBProxyTargetsResponse) => void): Request<RDS.Types.DescribeDBProxyTargetsResponse, AWSError>;
  /**
   * Returns a list of DBSecurityGroup descriptions. If a DBSecurityGroupName is specified, the list will contain only the descriptions of the specified DB security group.  EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that you migrate as soon as possible. For more information, see Migrate from EC2-Classic to a VPC in the Amazon EC2 User Guide, the blog EC2-Classic Networking is Retiring – Here’s How to Prepare, and Moving a DB instance not in a VPC into a VPC in the Amazon RDS User Guide. 
   */
  describeDBSecurityGroups(params: RDS.Types.DescribeDBSecurityGroupsMessage, callback?: (err: AWSError, data: RDS.Types.DBSecurityGroupMessage) => void): Request<RDS.Types.DBSecurityGroupMessage, AWSError>;
  /**
   * Returns a list of DBSecurityGroup descriptions. If a DBSecurityGroupName is specified, the list will contain only the descriptions of the specified DB security group.  EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that you migrate as soon as possible. For more information, see Migrate from EC2-Classic to a VPC in the Amazon EC2 User Guide, the blog EC2-Classic Networking is Retiring – Here’s How to Prepare, and Moving a DB instance not in a VPC into a VPC in the Amazon RDS User Guide. 
   */
  describeDBSecurityGroups(callback?: (err: AWSError, data: RDS.Types.DBSecurityGroupMessage) => void): Request<RDS.Types.DBSecurityGroupMessage, AWSError>;
  /**
   * Returns a list of DB snapshot attribute names and values for a manual DB snapshot. When sharing snapshots with other Amazon Web Services accounts, DescribeDBSnapshotAttributes returns the restore attribute and a list of IDs for the Amazon Web Services accounts that are authorized to copy or restore the manual DB snapshot. If all is included in the list of values for the restore attribute, then the manual DB snapshot is public and can be copied or restored by all Amazon Web Services accounts. To add or remove access for an Amazon Web Services account to copy or restore a manual DB snapshot, or to make the manual DB snapshot public or private, use the ModifyDBSnapshotAttribute API action.
   */
  describeDBSnapshotAttributes(params: RDS.Types.DescribeDBSnapshotAttributesMessage, callback?: (err: AWSError, data: RDS.Types.DescribeDBSnapshotAttributesResult) => void): Request<RDS.Types.DescribeDBSnapshotAttributesResult, AWSError>;
  /**
   * Returns a list of DB snapshot attribute names and values for a manual DB snapshot. When sharing snapshots with other Amazon Web Services accounts, DescribeDBSnapshotAttributes returns the restore attribute and a list of IDs for the Amazon Web Services accounts that are authorized to copy or restore the manual DB snapshot. If all is included in the list of values for the restore attribute, then the manual DB snapshot is public and can be copied or restored by all Amazon Web Services accounts. To add or remove access for an Amazon Web Services account to copy or restore a manual DB snapshot, or to make the manual DB snapshot public or private, use the ModifyDBSnapshotAttribute API action.
   */
  describeDBSnapshotAttributes(callback?: (err: AWSError, data: RDS.Types.DescribeDBSnapshotAttributesResult) => void): Request<RDS.Types.DescribeDBSnapshotAttributesResult, AWSError>;
  /**
   * Returns information about DB snapshots. This API action supports pagination.
   */
  describeDBSnapshots(params: RDS.Types.DescribeDBSnapshotsMessage, callback?: (err: AWSError, data: RDS.Types.DBSnapshotMessage) => void): Request<RDS.Types.DBSnapshotMessage, AWSError>;
  /**
   * Returns information about DB snapshots. This API action supports pagination.
   */
  describeDBSnapshots(callback?: (err: AWSError, data: RDS.Types.DBSnapshotMessage) => void): Request<RDS.Types.DBSnapshotMessage, AWSError>;
  /**
   * Returns a list of DBSubnetGroup descriptions. If a DBSubnetGroupName is specified, the list will contain only the descriptions of the specified DBSubnetGroup. For an overview of CIDR ranges, go to the Wikipedia Tutorial.
   */
  describeDBSubnetGroups(params: RDS.Types.DescribeDBSubnetGroupsMessage, callback?: (err: AWSError, data: RDS.Types.DBSubnetGroupMessage) => void): Request<RDS.Types.DBSubnetGroupMessage, AWSError>;
  /**
   * Returns a list of DBSubnetGroup descriptions. If a DBSubnetGroupName is specified, the list will contain only the descriptions of the specified DBSubnetGroup. For an overview of CIDR ranges, go to the Wikipedia Tutorial.
   */
  describeDBSubnetGroups(callback?: (err: AWSError, data: RDS.Types.DBSubnetGroupMessage) => void): Request<RDS.Types.DBSubnetGroupMessage, AWSError>;
  /**
   * Returns the default engine and system parameter information for the cluster database engine. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide.
   */
  describeEngineDefaultClusterParameters(params: RDS.Types.DescribeEngineDefaultClusterParametersMessage, callback?: (err: AWSError, data: RDS.Types.DescribeEngineDefaultClusterParametersResult) => void): Request<RDS.Types.DescribeEngineDefaultClusterParametersResult, AWSError>;
  /**
   * Returns the default engine and system parameter information for the cluster database engine. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide.
   */
  describeEngineDefaultClusterParameters(callback?: (err: AWSError, data: RDS.Types.DescribeEngineDefaultClusterParametersResult) => void): Request<RDS.Types.DescribeEngineDefaultClusterParametersResult, AWSError>;
  /**
   * Returns the default engine and system parameter information for the specified database engine.
   */
  describeEngineDefaultParameters(params: RDS.Types.DescribeEngineDefaultParametersMessage, callback?: (err: AWSError, data: RDS.Types.DescribeEngineDefaultParametersResult) => void): Request<RDS.Types.DescribeEngineDefaultParametersResult, AWSError>;
  /**
   * Returns the default engine and system parameter information for the specified database engine.
   */
  describeEngineDefaultParameters(callback?: (err: AWSError, data: RDS.Types.DescribeEngineDefaultParametersResult) => void): Request<RDS.Types.DescribeEngineDefaultParametersResult, AWSError>;
  /**
   * Displays a list of categories for all event source types, or, if specified, for a specified source type. You can also see this list in the "Amazon RDS event categories and event messages" section of the  Amazon RDS User Guide  or the  Amazon Aurora User Guide .
   */
  describeEventCategories(params: RDS.Types.DescribeEventCategoriesMessage, callback?: (err: AWSError, data: RDS.Types.EventCategoriesMessage) => void): Request<RDS.Types.EventCategoriesMessage, AWSError>;
  /**
   * Displays a list of categories for all event source types, or, if specified, for a specified source type. You can also see this list in the "Amazon RDS event categories and event messages" section of the  Amazon RDS User Guide  or the  Amazon Aurora User Guide .
   */
  describeEventCategories(callback?: (err: AWSError, data: RDS.Types.EventCategoriesMessage) => void): Request<RDS.Types.EventCategoriesMessage, AWSError>;
  /**
   * Lists all the subscription descriptions for a customer account. The description for a subscription includes SubscriptionName, SNSTopicARN, CustomerID, SourceType, SourceID, CreationTime, and Status. If you specify a SubscriptionName, lists the description for that subscription.
   */
  describeEventSubscriptions(params: RDS.Types.DescribeEventSubscriptionsMessage, callback?: (err: AWSError, data: RDS.Types.EventSubscriptionsMessage) => void): Request<RDS.Types.EventSubscriptionsMessage, AWSError>;
  /**
   * Lists all the subscription descriptions for a customer account. The description for a subscription includes SubscriptionName, SNSTopicARN, CustomerID, SourceType, SourceID, CreationTime, and Status. If you specify a SubscriptionName, lists the description for that subscription.
   */
  describeEventSubscriptions(callback?: (err: AWSError, data: RDS.Types.EventSubscriptionsMessage) => void): Request<RDS.Types.EventSubscriptionsMessage, AWSError>;
  /**
   * Returns events related to DB instances, DB clusters, DB parameter groups, DB security groups, DB snapshots, DB cluster snapshots, and RDS Proxies for the past 14 days. Events specific to a particular DB instance, DB cluster, DB parameter group, DB security group, DB snapshot, DB cluster snapshot group, or RDS Proxy can be obtained by providing the name as a parameter. For more information on working with events, see Monitoring Amazon RDS events in the Amazon RDS User Guide and Monitoring Amazon Aurora events in the Amazon Aurora User Guide.  By default, RDS returns events that were generated in the past hour. 
   */
  describeEvents(params: RDS.Types.DescribeEventsMessage, callback?: (err: AWSError, data: RDS.Types.EventsMessage) => void): Request<RDS.Types.EventsMessage, AWSError>;
  /**
   * Returns events related to DB instances, DB clusters, DB parameter groups, DB security groups, DB snapshots, DB cluster snapshots, and RDS Proxies for the past 14 days. Events specific to a particular DB instance, DB cluster, DB parameter group, DB security group, DB snapshot, DB cluster snapshot group, or RDS Proxy can be obtained by providing the name as a parameter. For more information on working with events, see Monitoring Amazon RDS events in the Amazon RDS User Guide and Monitoring Amazon Aurora events in the Amazon Aurora User Guide.  By default, RDS returns events that were generated in the past hour. 
   */
  describeEvents(callback?: (err: AWSError, data: RDS.Types.EventsMessage) => void): Request<RDS.Types.EventsMessage, AWSError>;
  /**
   * Returns information about a snapshot or cluster export to Amazon S3. This API operation supports pagination.
   */
  describeExportTasks(params: RDS.Types.DescribeExportTasksMessage, callback?: (err: AWSError, data: RDS.Types.ExportTasksMessage) => void): Request<RDS.Types.ExportTasksMessage, AWSError>;
  /**
   * Returns information about a snapshot or cluster export to Amazon S3. This API operation supports pagination.
   */
  describeExportTasks(callback?: (err: AWSError, data: RDS.Types.ExportTasksMessage) => void): Request<RDS.Types.ExportTasksMessage, AWSError>;
  /**
   * Returns information about Aurora global database clusters. This API supports pagination. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide.  This action only applies to Aurora DB clusters. 
   */
  describeGlobalClusters(params: RDS.Types.DescribeGlobalClustersMessage, callback?: (err: AWSError, data: RDS.Types.GlobalClustersMessage) => void): Request<RDS.Types.GlobalClustersMessage, AWSError>;
  /**
   * Returns information about Aurora global database clusters. This API supports pagination. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide.  This action only applies to Aurora DB clusters. 
   */
  describeGlobalClusters(callback?: (err: AWSError, data: RDS.Types.GlobalClustersMessage) => void): Request<RDS.Types.GlobalClustersMessage, AWSError>;
  /**
   * Describes all available options.
   */
  describeOptionGroupOptions(params: RDS.Types.DescribeOptionGroupOptionsMessage, callback?: (err: AWSError, data: RDS.Types.OptionGroupOptionsMessage) => void): Request<RDS.Types.OptionGroupOptionsMessage, AWSError>;
  /**
   * Describes all available options.
   */
  describeOptionGroupOptions(callback?: (err: AWSError, data: RDS.Types.OptionGroupOptionsMessage) => void): Request<RDS.Types.OptionGroupOptionsMessage, AWSError>;
  /**
   * Describes the available option groups.
   */
  describeOptionGroups(params: RDS.Types.DescribeOptionGroupsMessage, callback?: (err: AWSError, data: RDS.Types.OptionGroups) => void): Request<RDS.Types.OptionGroups, AWSError>;
  /**
   * Describes the available option groups.
   */
  describeOptionGroups(callback?: (err: AWSError, data: RDS.Types.OptionGroups) => void): Request<RDS.Types.OptionGroups, AWSError>;
  /**
   * Returns a list of orderable DB instance options for the specified DB engine, DB engine version, and DB instance class.
   */
  describeOrderableDBInstanceOptions(params: RDS.Types.DescribeOrderableDBInstanceOptionsMessage, callback?: (err: AWSError, data: RDS.Types.OrderableDBInstanceOptionsMessage) => void): Request<RDS.Types.OrderableDBInstanceOptionsMessage, AWSError>;
  /**
   * Returns a list of orderable DB instance options for the specified DB engine, DB engine version, and DB instance class.
   */
  describeOrderableDBInstanceOptions(callback?: (err: AWSError, data: RDS.Types.OrderableDBInstanceOptionsMessage) => void): Request<RDS.Types.OrderableDBInstanceOptionsMessage, AWSError>;
  /**
   * Returns a list of resources (for example, DB instances) that have at least one pending maintenance action.
   */
  describePendingMaintenanceActions(params: RDS.Types.DescribePendingMaintenanceActionsMessage, callback?: (err: AWSError, data: RDS.Types.PendingMaintenanceActionsMessage) => void): Request<RDS.Types.PendingMaintenanceActionsMessage, AWSError>;
  /**
   * Returns a list of resources (for example, DB instances) that have at least one pending maintenance action.
   */
  describePendingMaintenanceActions(callback?: (err: AWSError, data: RDS.Types.PendingMaintenanceActionsMessage) => void): Request<RDS.Types.PendingMaintenanceActionsMessage, AWSError>;
  /**
   * Returns information about reserved DB instances for this account, or about a specified reserved DB instance.
   */
  describeReservedDBInstances(params: RDS.Types.DescribeReservedDBInstancesMessage, callback?: (err: AWSError, data: RDS.Types.ReservedDBInstanceMessage) => void): Request<RDS.Types.ReservedDBInstanceMessage, AWSError>;
  /**
   * Returns information about reserved DB instances for this account, or about a specified reserved DB instance.
   */
  describeReservedDBInstances(callback?: (err: AWSError, data: RDS.Types.ReservedDBInstanceMessage) => void): Request<RDS.Types.ReservedDBInstanceMessage, AWSError>;
  /**
   * Lists available reserved DB instance offerings.
   */
  describeReservedDBInstancesOfferings(params: RDS.Types.DescribeReservedDBInstancesOfferingsMessage, callback?: (err: AWSError, data: RDS.Types.ReservedDBInstancesOfferingMessage) => void): Request<RDS.Types.ReservedDBInstancesOfferingMessage, AWSError>;
  /**
   * Lists available reserved DB instance offerings.
   */
  describeReservedDBInstancesOfferings(callback?: (err: AWSError, data: RDS.Types.ReservedDBInstancesOfferingMessage) => void): Request<RDS.Types.ReservedDBInstancesOfferingMessage, AWSError>;
  /**
   * Returns a list of the source Amazon Web Services Regions where the current Amazon Web Services Region can create a read replica, copy a DB snapshot from, or replicate automated backups from. Use this operation to determine whether cross-Region features are supported between other Regions and your current Region. This operation supports pagination. To return information about the Regions that are enabled for your account, or all Regions, use the EC2 operation DescribeRegions. For more information, see  DescribeRegions in the Amazon EC2 API Reference.
   */
  describeSourceRegions(params: RDS.Types.DescribeSourceRegionsMessage, callback?: (err: AWSError, data: RDS.Types.SourceRegionMessage) => void): Request<RDS.Types.SourceRegionMessage, AWSError>;
  /**
   * Returns a list of the source Amazon Web Services Regions where the current Amazon Web Services Region can create a read replica, copy a DB snapshot from, or replicate automated backups from. Use this operation to determine whether cross-Region features are supported between other Regions and your current Region. This operation supports pagination. To return information about the Regions that are enabled for your account, or all Regions, use the EC2 operation DescribeRegions. For more information, see  DescribeRegions in the Amazon EC2 API Reference.
   */
  describeSourceRegions(callback?: (err: AWSError, data: RDS.Types.SourceRegionMessage) => void): Request<RDS.Types.SourceRegionMessage, AWSError>;
  /**
   * You can call DescribeValidDBInstanceModifications to learn what modifications you can make to your DB instance. You can use this information when you call ModifyDBInstance. This command doesn't apply to RDS Custom.
   */
  describeValidDBInstanceModifications(params: RDS.Types.DescribeValidDBInstanceModificationsMessage, callback?: (err: AWSError, data: RDS.Types.DescribeValidDBInstanceModificationsResult) => void): Request<RDS.Types.DescribeValidDBInstanceModificationsResult, AWSError>;
  /**
   * You can call DescribeValidDBInstanceModifications to learn what modifications you can make to your DB instance. You can use this information when you call ModifyDBInstance. This command doesn't apply to RDS Custom.
   */
  describeValidDBInstanceModifications(callback?: (err: AWSError, data: RDS.Types.DescribeValidDBInstanceModificationsResult) => void): Request<RDS.Types.DescribeValidDBInstanceModificationsResult, AWSError>;
  /**
   * Downloads all or a portion of the specified log file, up to 1 MB in size. This command doesn't apply to RDS Custom.
   */
  downloadDBLogFilePortion(params: RDS.Types.DownloadDBLogFilePortionMessage, callback?: (err: AWSError, data: RDS.Types.DownloadDBLogFilePortionDetails) => void): Request<RDS.Types.DownloadDBLogFilePortionDetails, AWSError>;
  /**
   * Downloads all or a portion of the specified log file, up to 1 MB in size. This command doesn't apply to RDS Custom.
   */
  downloadDBLogFilePortion(callback?: (err: AWSError, data: RDS.Types.DownloadDBLogFilePortionDetails) => void): Request<RDS.Types.DownloadDBLogFilePortionDetails, AWSError>;
  /**
   * Forces a failover for a DB cluster. For an Aurora DB cluster, failover for a DB cluster promotes one of the Aurora Replicas (read-only instances) in the DB cluster to be the primary DB instance (the cluster writer). For a Multi-AZ DB cluster, failover for a DB cluster promotes one of the readable standby DB instances (read-only instances) in the DB cluster to be the primary DB instance (the cluster writer). An Amazon Aurora DB cluster automatically fails over to an Aurora Replica, if one exists, when the primary DB instance fails. A Multi-AZ DB cluster automatically fails over to a readable standby DB instance when the primary DB instance fails. To simulate a failure of a primary instance for testing, you can force a failover. Because each instance in a DB cluster has its own endpoint address, make sure to clean up and re-establish any existing connections that use those endpoint addresses when the failover is complete. For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  failoverDBCluster(params: RDS.Types.FailoverDBClusterMessage, callback?: (err: AWSError, data: RDS.Types.FailoverDBClusterResult) => void): Request<RDS.Types.FailoverDBClusterResult, AWSError>;
  /**
   * Forces a failover for a DB cluster. For an Aurora DB cluster, failover for a DB cluster promotes one of the Aurora Replicas (read-only instances) in the DB cluster to be the primary DB instance (the cluster writer). For a Multi-AZ DB cluster, failover for a DB cluster promotes one of the readable standby DB instances (read-only instances) in the DB cluster to be the primary DB instance (the cluster writer). An Amazon Aurora DB cluster automatically fails over to an Aurora Replica, if one exists, when the primary DB instance fails. A Multi-AZ DB cluster automatically fails over to a readable standby DB instance when the primary DB instance fails. To simulate a failure of a primary instance for testing, you can force a failover. Because each instance in a DB cluster has its own endpoint address, make sure to clean up and re-establish any existing connections that use those endpoint addresses when the failover is complete. For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  failoverDBCluster(callback?: (err: AWSError, data: RDS.Types.FailoverDBClusterResult) => void): Request<RDS.Types.FailoverDBClusterResult, AWSError>;
  /**
   * Promotes the specified secondary DB cluster to be the primary DB cluster in the global database cluster to fail over or switch over a global database. Switchover operations were previously called "managed planned failovers."  Although this operation can be used either to fail over or to switch over a global database cluster, its intended use is for global database failover. To switch over a global database cluster, we recommend that you use the SwitchoverGlobalCluster operation instead.  How you use this operation depends on whether you are failing over or switching over your global database cluster:   Failing over - Specify the AllowDataLoss parameter and don't specify the Switchover parameter.   Switching over - Specify the Switchover parameter or omit it, but don't specify the AllowDataLoss parameter.    About failing over and switching over  While failing over and switching over a global database cluster both change the primary DB cluster, you use these operations for different reasons:    Failing over - Use this operation to respond to an unplanned event, such as a Regional disaster in the primary Region. Failing over can result in a loss of write transaction data that wasn't replicated to the chosen secondary before the failover event occurred. However, the recovery process that promotes a DB instance on the chosen seconday DB cluster to be the primary writer DB instance guarantees that the data is in a transactionally consistent state. For more information about failing over an Amazon Aurora global database, see Performing managed failovers for Aurora global databases in the Amazon Aurora User Guide.    Switching over - Use this operation on a healthy global database cluster for planned events, such as Regional rotation or to fail back to the original primary DB cluster after a failover operation. With this operation, there is no data loss. For more information about switching over an Amazon Aurora global database, see Performing switchovers for Aurora global databases in the Amazon Aurora User Guide.  
   */
  failoverGlobalCluster(params: RDS.Types.FailoverGlobalClusterMessage, callback?: (err: AWSError, data: RDS.Types.FailoverGlobalClusterResult) => void): Request<RDS.Types.FailoverGlobalClusterResult, AWSError>;
  /**
   * Promotes the specified secondary DB cluster to be the primary DB cluster in the global database cluster to fail over or switch over a global database. Switchover operations were previously called "managed planned failovers."  Although this operation can be used either to fail over or to switch over a global database cluster, its intended use is for global database failover. To switch over a global database cluster, we recommend that you use the SwitchoverGlobalCluster operation instead.  How you use this operation depends on whether you are failing over or switching over your global database cluster:   Failing over - Specify the AllowDataLoss parameter and don't specify the Switchover parameter.   Switching over - Specify the Switchover parameter or omit it, but don't specify the AllowDataLoss parameter.    About failing over and switching over  While failing over and switching over a global database cluster both change the primary DB cluster, you use these operations for different reasons:    Failing over - Use this operation to respond to an unplanned event, such as a Regional disaster in the primary Region. Failing over can result in a loss of write transaction data that wasn't replicated to the chosen secondary before the failover event occurred. However, the recovery process that promotes a DB instance on the chosen seconday DB cluster to be the primary writer DB instance guarantees that the data is in a transactionally consistent state. For more information about failing over an Amazon Aurora global database, see Performing managed failovers for Aurora global databases in the Amazon Aurora User Guide.    Switching over - Use this operation on a healthy global database cluster for planned events, such as Regional rotation or to fail back to the original primary DB cluster after a failover operation. With this operation, there is no data loss. For more information about switching over an Amazon Aurora global database, see Performing switchovers for Aurora global databases in the Amazon Aurora User Guide.  
   */
  failoverGlobalCluster(callback?: (err: AWSError, data: RDS.Types.FailoverGlobalClusterResult) => void): Request<RDS.Types.FailoverGlobalClusterResult, AWSError>;
  /**
   * Lists all tags on an Amazon RDS resource. For an overview on tagging an Amazon RDS resource, see Tagging Amazon RDS Resources in the Amazon RDS User Guide.
   */
  listTagsForResource(params: RDS.Types.ListTagsForResourceMessage, callback?: (err: AWSError, data: RDS.Types.TagListMessage) => void): Request<RDS.Types.TagListMessage, AWSError>;
  /**
   * Lists all tags on an Amazon RDS resource. For an overview on tagging an Amazon RDS resource, see Tagging Amazon RDS Resources in the Amazon RDS User Guide.
   */
  listTagsForResource(callback?: (err: AWSError, data: RDS.Types.TagListMessage) => void): Request<RDS.Types.TagListMessage, AWSError>;
  /**
   * Changes the audit policy state of a database activity stream to either locked (default) or unlocked. A locked policy is read-only, whereas an unlocked policy is read/write. If your activity stream is started and locked, you can unlock it, customize your audit policy, and then lock your activity stream. Restarting the activity stream isn't required. For more information, see  Modifying a database activity stream in the Amazon RDS User Guide.  This operation is supported for RDS for Oracle and Microsoft SQL Server.
   */
  modifyActivityStream(params: RDS.Types.ModifyActivityStreamRequest, callback?: (err: AWSError, data: RDS.Types.ModifyActivityStreamResponse) => void): Request<RDS.Types.ModifyActivityStreamResponse, AWSError>;
  /**
   * Changes the audit policy state of a database activity stream to either locked (default) or unlocked. A locked policy is read-only, whereas an unlocked policy is read/write. If your activity stream is started and locked, you can unlock it, customize your audit policy, and then lock your activity stream. Restarting the activity stream isn't required. For more information, see  Modifying a database activity stream in the Amazon RDS User Guide.  This operation is supported for RDS for Oracle and Microsoft SQL Server.
   */
  modifyActivityStream(callback?: (err: AWSError, data: RDS.Types.ModifyActivityStreamResponse) => void): Request<RDS.Types.ModifyActivityStreamResponse, AWSError>;
  /**
   * Override the system-default Secure Sockets Layer/Transport Layer Security (SSL/TLS) certificate for Amazon RDS for new DB instances, or remove the override. By using this operation, you can specify an RDS-approved SSL/TLS certificate for new DB instances that is different from the default certificate provided by RDS. You can also use this operation to remove the override, so that new DB instances use the default certificate provided by RDS. You might need to override the default certificate in the following situations:   You already migrated your applications to support the latest certificate authority (CA) certificate, but the new CA certificate is not yet the RDS default CA certificate for the specified Amazon Web Services Region.   RDS has already moved to a new default CA certificate for the specified Amazon Web Services Region, but you are still in the process of supporting the new CA certificate. In this case, you temporarily need additional time to finish your application changes.   For more information about rotating your SSL/TLS certificate for RDS DB engines, see  Rotating Your SSL/TLS Certificate in the Amazon RDS User Guide. For more information about rotating your SSL/TLS certificate for Aurora DB engines, see  Rotating Your SSL/TLS Certificate in the Amazon Aurora User Guide.
   */
  modifyCertificates(params: RDS.Types.ModifyCertificatesMessage, callback?: (err: AWSError, data: RDS.Types.ModifyCertificatesResult) => void): Request<RDS.Types.ModifyCertificatesResult, AWSError>;
  /**
   * Override the system-default Secure Sockets Layer/Transport Layer Security (SSL/TLS) certificate for Amazon RDS for new DB instances, or remove the override. By using this operation, you can specify an RDS-approved SSL/TLS certificate for new DB instances that is different from the default certificate provided by RDS. You can also use this operation to remove the override, so that new DB instances use the default certificate provided by RDS. You might need to override the default certificate in the following situations:   You already migrated your applications to support the latest certificate authority (CA) certificate, but the new CA certificate is not yet the RDS default CA certificate for the specified Amazon Web Services Region.   RDS has already moved to a new default CA certificate for the specified Amazon Web Services Region, but you are still in the process of supporting the new CA certificate. In this case, you temporarily need additional time to finish your application changes.   For more information about rotating your SSL/TLS certificate for RDS DB engines, see  Rotating Your SSL/TLS Certificate in the Amazon RDS User Guide. For more information about rotating your SSL/TLS certificate for Aurora DB engines, see  Rotating Your SSL/TLS Certificate in the Amazon Aurora User Guide.
   */
  modifyCertificates(callback?: (err: AWSError, data: RDS.Types.ModifyCertificatesResult) => void): Request<RDS.Types.ModifyCertificatesResult, AWSError>;
  /**
   * Set the capacity of an Aurora Serverless v1 DB cluster to a specific value. Aurora Serverless v1 scales seamlessly based on the workload on the DB cluster. In some cases, the capacity might not scale fast enough to meet a sudden change in workload, such as a large number of new transactions. Call ModifyCurrentDBClusterCapacity to set the capacity explicitly. After this call sets the DB cluster capacity, Aurora Serverless v1 can automatically scale the DB cluster based on the cooldown period for scaling up and the cooldown period for scaling down. For more information about Aurora Serverless v1, see Using Amazon Aurora Serverless v1 in the Amazon Aurora User Guide.  If you call ModifyCurrentDBClusterCapacity with the default TimeoutAction, connections that prevent Aurora Serverless v1 from finding a scaling point might be dropped. For more information about scaling points, see  Autoscaling for Aurora Serverless v1 in the Amazon Aurora User Guide.   This action only applies to Aurora Serverless v1 DB clusters. 
   */
  modifyCurrentDBClusterCapacity(params: RDS.Types.ModifyCurrentDBClusterCapacityMessage, callback?: (err: AWSError, data: RDS.Types.DBClusterCapacityInfo) => void): Request<RDS.Types.DBClusterCapacityInfo, AWSError>;
  /**
   * Set the capacity of an Aurora Serverless v1 DB cluster to a specific value. Aurora Serverless v1 scales seamlessly based on the workload on the DB cluster. In some cases, the capacity might not scale fast enough to meet a sudden change in workload, such as a large number of new transactions. Call ModifyCurrentDBClusterCapacity to set the capacity explicitly. After this call sets the DB cluster capacity, Aurora Serverless v1 can automatically scale the DB cluster based on the cooldown period for scaling up and the cooldown period for scaling down. For more information about Aurora Serverless v1, see Using Amazon Aurora Serverless v1 in the Amazon Aurora User Guide.  If you call ModifyCurrentDBClusterCapacity with the default TimeoutAction, connections that prevent Aurora Serverless v1 from finding a scaling point might be dropped. For more information about scaling points, see  Autoscaling for Aurora Serverless v1 in the Amazon Aurora User Guide.   This action only applies to Aurora Serverless v1 DB clusters. 
   */
  modifyCurrentDBClusterCapacity(callback?: (err: AWSError, data: RDS.Types.DBClusterCapacityInfo) => void): Request<RDS.Types.DBClusterCapacityInfo, AWSError>;
  /**
   * Modifies the status of a custom engine version (CEV). You can find CEVs to modify by calling DescribeDBEngineVersions.  The MediaImport service that imports files from Amazon S3 to create CEVs isn't integrated with Amazon Web Services CloudTrail. If you turn on data logging for Amazon RDS in CloudTrail, calls to the ModifyCustomDbEngineVersion event aren't logged. However, you might see calls from the API gateway that accesses your Amazon S3 bucket. These calls originate from the MediaImport service for the ModifyCustomDbEngineVersion event.  For more information, see Modifying CEV status in the Amazon RDS User Guide.
   */
  modifyCustomDBEngineVersion(params: RDS.Types.ModifyCustomDBEngineVersionMessage, callback?: (err: AWSError, data: RDS.Types.DBEngineVersion) => void): Request<RDS.Types.DBEngineVersion, AWSError>;
  /**
   * Modifies the status of a custom engine version (CEV). You can find CEVs to modify by calling DescribeDBEngineVersions.  The MediaImport service that imports files from Amazon S3 to create CEVs isn't integrated with Amazon Web Services CloudTrail. If you turn on data logging for Amazon RDS in CloudTrail, calls to the ModifyCustomDbEngineVersion event aren't logged. However, you might see calls from the API gateway that accesses your Amazon S3 bucket. These calls originate from the MediaImport service for the ModifyCustomDbEngineVersion event.  For more information, see Modifying CEV status in the Amazon RDS User Guide.
   */
  modifyCustomDBEngineVersion(callback?: (err: AWSError, data: RDS.Types.DBEngineVersion) => void): Request<RDS.Types.DBEngineVersion, AWSError>;
  /**
   * Modifies the settings of an Amazon Aurora DB cluster or a Multi-AZ DB cluster. You can change one or more settings by specifying these parameters and the new values in the request. For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  modifyDBCluster(params: RDS.Types.ModifyDBClusterMessage, callback?: (err: AWSError, data: RDS.Types.ModifyDBClusterResult) => void): Request<RDS.Types.ModifyDBClusterResult, AWSError>;
  /**
   * Modifies the settings of an Amazon Aurora DB cluster or a Multi-AZ DB cluster. You can change one or more settings by specifying these parameters and the new values in the request. For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide.
   */
  modifyDBCluster(callback?: (err: AWSError, data: RDS.Types.ModifyDBClusterResult) => void): Request<RDS.Types.ModifyDBClusterResult, AWSError>;
  /**
   * Modifies the properties of an endpoint in an Amazon Aurora DB cluster.  This action only applies to Aurora DB clusters. 
   */
  modifyDBClusterEndpoint(params: RDS.Types.ModifyDBClusterEndpointMessage, callback?: (err: AWSError, data: RDS.Types.DBClusterEndpoint) => void): Request<RDS.Types.DBClusterEndpoint, AWSError>;
  /**
   * Modifies the properties of an endpoint in an Amazon Aurora DB cluster.  This action only applies to Aurora DB clusters. 
   */
  modifyDBClusterEndpoint(callback?: (err: AWSError, data: RDS.Types.DBClusterEndpoint) => void): Request<RDS.Types.DBClusterEndpoint, AWSError>;
  /**
   * Modifies the parameters of a DB cluster parameter group. To modify more than one parameter, submit a list of the following: ParameterName, ParameterValue, and ApplyMethod. A maximum of 20 parameters can be modified in a single request.  After you create a DB cluster parameter group, you should wait at least 5 minutes before creating your first DB cluster that uses that DB cluster parameter group as the default parameter group. This allows Amazon RDS to fully complete the create action before the parameter group is used as the default for a new DB cluster. This is especially important for parameters that are critical when creating the default database for a DB cluster, such as the character set for the default database defined by the character_set_database parameter. You can use the Parameter Groups option of the Amazon RDS console or the DescribeDBClusterParameters operation to verify that your DB cluster parameter group has been created or modified. If the modified DB cluster parameter group is used by an Aurora Serverless v1 cluster, Aurora applies the update immediately. The cluster restart might interrupt your workload. In that case, your application must reopen any connections and retry any transactions that were active when the parameter changes took effect.  For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide. 
   */
  modifyDBClusterParameterGroup(params: RDS.Types.ModifyDBClusterParameterGroupMessage, callback?: (err: AWSError, data: RDS.Types.DBClusterParameterGroupNameMessage) => void): Request<RDS.Types.DBClusterParameterGroupNameMessage, AWSError>;
  /**
   * Modifies the parameters of a DB cluster parameter group. To modify more than one parameter, submit a list of the following: ParameterName, ParameterValue, and ApplyMethod. A maximum of 20 parameters can be modified in a single request.  After you create a DB cluster parameter group, you should wait at least 5 minutes before creating your first DB cluster that uses that DB cluster parameter group as the default parameter group. This allows Amazon RDS to fully complete the create action before the parameter group is used as the default for a new DB cluster. This is especially important for parameters that are critical when creating the default database for a DB cluster, such as the character set for the default database defined by the character_set_database parameter. You can use the Parameter Groups option of the Amazon RDS console or the DescribeDBClusterParameters operation to verify that your DB cluster parameter group has been created or modified. If the modified DB cluster parameter group is used by an Aurora Serverless v1 cluster, Aurora applies the update immediately. The cluster restart might interrupt your workload. In that case, your application must reopen any connections and retry any transactions that were active when the parameter changes took effect.  For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide. 
   */
  modifyDBClusterParameterGroup(callback?: (err: AWSError, data: RDS.Types.DBClusterParameterGroupNameMessage) => void): Request<RDS.Types.DBClusterParameterGroupNameMessage, AWSError>;
  /**
   * Adds an attribute and values to, or removes an attribute and values from, a manual DB cluster snapshot. To share a manual DB cluster snapshot with other Amazon Web Services accounts, specify restore as the AttributeName and use the ValuesToAdd parameter to add a list of IDs of the Amazon Web Services accounts that are authorized to restore the manual DB cluster snapshot. Use the value all to make the manual DB cluster snapshot public, which means that it can be copied or restored by all Amazon Web Services accounts.  Don't add the all value for any manual DB cluster snapshots that contain private information that you don't want available to all Amazon Web Services accounts.  If a manual DB cluster snapshot is encrypted, it can be shared, but only by specifying a list of authorized Amazon Web Services account IDs for the ValuesToAdd parameter. You can't use all as a value for that parameter in this case. To view which Amazon Web Services accounts have access to copy or restore a manual DB cluster snapshot, or whether a manual DB cluster snapshot is public or private, use the DescribeDBClusterSnapshotAttributes API operation. The accounts are returned as values for the restore attribute.
   */
  modifyDBClusterSnapshotAttribute(params: RDS.Types.ModifyDBClusterSnapshotAttributeMessage, callback?: (err: AWSError, data: RDS.Types.ModifyDBClusterSnapshotAttributeResult) => void): Request<RDS.Types.ModifyDBClusterSnapshotAttributeResult, AWSError>;
  /**
   * Adds an attribute and values to, or removes an attribute and values from, a manual DB cluster snapshot. To share a manual DB cluster snapshot with other Amazon Web Services accounts, specify restore as the AttributeName and use the ValuesToAdd parameter to add a list of IDs of the Amazon Web Services accounts that are authorized to restore the manual DB cluster snapshot. Use the value all to make the manual DB cluster snapshot public, which means that it can be copied or restored by all Amazon Web Services accounts.  Don't add the all value for any manual DB cluster snapshots that contain private information that you don't want available to all Amazon Web Services accounts.  If a manual DB cluster snapshot is encrypted, it can be shared, but only by specifying a list of authorized Amazon Web Services account IDs for the ValuesToAdd parameter. You can't use all as a value for that parameter in this case. To view which Amazon Web Services accounts have access to copy or restore a manual DB cluster snapshot, or whether a manual DB cluster snapshot is public or private, use the DescribeDBClusterSnapshotAttributes API operation. The accounts are returned as values for the restore attribute.
   */
  modifyDBClusterSnapshotAttribute(callback?: (err: AWSError, data: RDS.Types.ModifyDBClusterSnapshotAttributeResult) => void): Request<RDS.Types.ModifyDBClusterSnapshotAttributeResult, AWSError>;
  /**
   * Modifies settings for a DB instance. You can change one or more database configuration parameters by specifying these parameters and the new values in the request. To learn what modifications you can make to your DB instance, call DescribeValidDBInstanceModifications before you call ModifyDBInstance.
   */
  modifyDBInstance(params: RDS.Types.ModifyDBInstanceMessage, callback?: (err: AWSError, data: RDS.Types.ModifyDBInstanceResult) => void): Request<RDS.Types.ModifyDBInstanceResult, AWSError>;
  /**
   * Modifies settings for a DB instance. You can change one or more database configuration parameters by specifying these parameters and the new values in the request. To learn what modifications you can make to your DB instance, call DescribeValidDBInstanceModifications before you call ModifyDBInstance.
   */
  modifyDBInstance(callback?: (err: AWSError, data: RDS.Types.ModifyDBInstanceResult) => void): Request<RDS.Types.ModifyDBInstanceResult, AWSError>;
  /**
   * Modifies the parameters of a DB parameter group. To modify more than one parameter, submit a list of the following: ParameterName, ParameterValue, and ApplyMethod. A maximum of 20 parameters can be modified in a single request.  After you modify a DB parameter group, you should wait at least 5 minutes before creating your first DB instance that uses that DB parameter group as the default parameter group. This allows Amazon RDS to fully complete the modify action before the parameter group is used as the default for a new DB instance. This is especially important for parameters that are critical when creating the default database for a DB instance, such as the character set for the default database defined by the character_set_database parameter. You can use the Parameter Groups option of the Amazon RDS console or the DescribeDBParameters command to verify that your DB parameter group has been created or modified. 
   */
  modifyDBParameterGroup(params: RDS.Types.ModifyDBParameterGroupMessage, callback?: (err: AWSError, data: RDS.Types.DBParameterGroupNameMessage) => void): Request<RDS.Types.DBParameterGroupNameMessage, AWSError>;
  /**
   * Modifies the parameters of a DB parameter group. To modify more than one parameter, submit a list of the following: ParameterName, ParameterValue, and ApplyMethod. A maximum of 20 parameters can be modified in a single request.  After you modify a DB parameter group, you should wait at least 5 minutes before creating your first DB instance that uses that DB parameter group as the default parameter group. This allows Amazon RDS to fully complete the modify action before the parameter group is used as the default for a new DB instance. This is especially important for parameters that are critical when creating the default database for a DB instance, such as the character set for the default database defined by the character_set_database parameter. You can use the Parameter Groups option of the Amazon RDS console or the DescribeDBParameters command to verify that your DB parameter group has been created or modified. 
   */
  modifyDBParameterGroup(callback?: (err: AWSError, data: RDS.Types.DBParameterGroupNameMessage) => void): Request<RDS.Types.DBParameterGroupNameMessage, AWSError>;
  /**
   * Changes the settings for an existing DB proxy.
   */
  modifyDBProxy(params: RDS.Types.ModifyDBProxyRequest, callback?: (err: AWSError, data: RDS.Types.ModifyDBProxyResponse) => void): Request<RDS.Types.ModifyDBProxyResponse, AWSError>;
  /**
   * Changes the settings for an existing DB proxy.
   */
  modifyDBProxy(callback?: (err: AWSError, data: RDS.Types.ModifyDBProxyResponse) => void): Request<RDS.Types.ModifyDBProxyResponse, AWSError>;
  /**
   * Changes the settings for an existing DB proxy endpoint.
   */
  modifyDBProxyEndpoint(params: RDS.Types.ModifyDBProxyEndpointRequest, callback?: (err: AWSError, data: RDS.Types.ModifyDBProxyEndpointResponse) => void): Request<RDS.Types.ModifyDBProxyEndpointResponse, AWSError>;
  /**
   * Changes the settings for an existing DB proxy endpoint.
   */
  modifyDBProxyEndpoint(callback?: (err: AWSError, data: RDS.Types.ModifyDBProxyEndpointResponse) => void): Request<RDS.Types.ModifyDBProxyEndpointResponse, AWSError>;
  /**
   * Modifies the properties of a DBProxyTargetGroup.
   */
  modifyDBProxyTargetGroup(params: RDS.Types.ModifyDBProxyTargetGroupRequest, callback?: (err: AWSError, data: RDS.Types.ModifyDBProxyTargetGroupResponse) => void): Request<RDS.Types.ModifyDBProxyTargetGroupResponse, AWSError>;
  /**
   * Modifies the properties of a DBProxyTargetGroup.
   */
  modifyDBProxyTargetGroup(callback?: (err: AWSError, data: RDS.Types.ModifyDBProxyTargetGroupResponse) => void): Request<RDS.Types.ModifyDBProxyTargetGroupResponse, AWSError>;
  /**
   * Updates a manual DB snapshot with a new engine version. The snapshot can be encrypted or unencrypted, but not shared or public.  Amazon RDS supports upgrading DB snapshots for MySQL, PostgreSQL, and Oracle. This command doesn't apply to RDS Custom.
   */
  modifyDBSnapshot(params: RDS.Types.ModifyDBSnapshotMessage, callback?: (err: AWSError, data: RDS.Types.ModifyDBSnapshotResult) => void): Request<RDS.Types.ModifyDBSnapshotResult, AWSError>;
  /**
   * Updates a manual DB snapshot with a new engine version. The snapshot can be encrypted or unencrypted, but not shared or public.  Amazon RDS supports upgrading DB snapshots for MySQL, PostgreSQL, and Oracle. This command doesn't apply to RDS Custom.
   */
  modifyDBSnapshot(callback?: (err: AWSError, data: RDS.Types.ModifyDBSnapshotResult) => void): Request<RDS.Types.ModifyDBSnapshotResult, AWSError>;
  /**
   * Adds an attribute and values to, or removes an attribute and values from, a manual DB snapshot. To share a manual DB snapshot with other Amazon Web Services accounts, specify restore as the AttributeName and use the ValuesToAdd parameter to add a list of IDs of the Amazon Web Services accounts that are authorized to restore the manual DB snapshot. Uses the value all to make the manual DB snapshot public, which means it can be copied or restored by all Amazon Web Services accounts.  Don't add the all value for any manual DB snapshots that contain private information that you don't want available to all Amazon Web Services accounts.  If the manual DB snapshot is encrypted, it can be shared, but only by specifying a list of authorized Amazon Web Services account IDs for the ValuesToAdd parameter. You can't use all as a value for that parameter in this case. To view which Amazon Web Services accounts have access to copy or restore a manual DB snapshot, or whether a manual DB snapshot public or private, use the DescribeDBSnapshotAttributes API operation. The accounts are returned as values for the restore attribute.
   */
  modifyDBSnapshotAttribute(params: RDS.Types.ModifyDBSnapshotAttributeMessage, callback?: (err: AWSError, data: RDS.Types.ModifyDBSnapshotAttributeResult) => void): Request<RDS.Types.ModifyDBSnapshotAttributeResult, AWSError>;
  /**
   * Adds an attribute and values to, or removes an attribute and values from, a manual DB snapshot. To share a manual DB snapshot with other Amazon Web Services accounts, specify restore as the AttributeName and use the ValuesToAdd parameter to add a list of IDs of the Amazon Web Services accounts that are authorized to restore the manual DB snapshot. Uses the value all to make the manual DB snapshot public, which means it can be copied or restored by all Amazon Web Services accounts.  Don't add the all value for any manual DB snapshots that contain private information that you don't want available to all Amazon Web Services accounts.  If the manual DB snapshot is encrypted, it can be shared, but only by specifying a list of authorized Amazon Web Services account IDs for the ValuesToAdd parameter. You can't use all as a value for that parameter in this case. To view which Amazon Web Services accounts have access to copy or restore a manual DB snapshot, or whether a manual DB snapshot public or private, use the DescribeDBSnapshotAttributes API operation. The accounts are returned as values for the restore attribute.
   */
  modifyDBSnapshotAttribute(callback?: (err: AWSError, data: RDS.Types.ModifyDBSnapshotAttributeResult) => void): Request<RDS.Types.ModifyDBSnapshotAttributeResult, AWSError>;
  /**
   * Modifies an existing DB subnet group. DB subnet groups must contain at least one subnet in at least two AZs in the Amazon Web Services Region.
   */
  modifyDBSubnetGroup(params: RDS.Types.ModifyDBSubnetGroupMessage, callback?: (err: AWSError, data: RDS.Types.ModifyDBSubnetGroupResult) => void): Request<RDS.Types.ModifyDBSubnetGroupResult, AWSError>;
  /**
   * Modifies an existing DB subnet group. DB subnet groups must contain at least one subnet in at least two AZs in the Amazon Web Services Region.
   */
  modifyDBSubnetGroup(callback?: (err: AWSError, data: RDS.Types.ModifyDBSubnetGroupResult) => void): Request<RDS.Types.ModifyDBSubnetGroupResult, AWSError>;
  /**
   * Modifies an existing RDS event notification subscription. You can't modify the source identifiers using this call. To change source identifiers for a subscription, use the AddSourceIdentifierToSubscription and RemoveSourceIdentifierFromSubscription calls. You can see a list of the event categories for a given source type (SourceType) in Events in the Amazon RDS User Guide or by using the DescribeEventCategories operation.
   */
  modifyEventSubscription(params: RDS.Types.ModifyEventSubscriptionMessage, callback?: (err: AWSError, data: RDS.Types.ModifyEventSubscriptionResult) => void): Request<RDS.Types.ModifyEventSubscriptionResult, AWSError>;
  /**
   * Modifies an existing RDS event notification subscription. You can't modify the source identifiers using this call. To change source identifiers for a subscription, use the AddSourceIdentifierToSubscription and RemoveSourceIdentifierFromSubscription calls. You can see a list of the event categories for a given source type (SourceType) in Events in the Amazon RDS User Guide or by using the DescribeEventCategories operation.
   */
  modifyEventSubscription(callback?: (err: AWSError, data: RDS.Types.ModifyEventSubscriptionResult) => void): Request<RDS.Types.ModifyEventSubscriptionResult, AWSError>;
  /**
   * Modifies a setting for an Amazon Aurora global database cluster. You can change one or more database configuration parameters by specifying these parameters and the new values in the request. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide.  This operation only applies to Aurora global database clusters. 
   */
  modifyGlobalCluster(params: RDS.Types.ModifyGlobalClusterMessage, callback?: (err: AWSError, data: RDS.Types.ModifyGlobalClusterResult) => void): Request<RDS.Types.ModifyGlobalClusterResult, AWSError>;
  /**
   * Modifies a setting for an Amazon Aurora global database cluster. You can change one or more database configuration parameters by specifying these parameters and the new values in the request. For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide.  This operation only applies to Aurora global database clusters. 
   */
  modifyGlobalCluster(callback?: (err: AWSError, data: RDS.Types.ModifyGlobalClusterResult) => void): Request<RDS.Types.ModifyGlobalClusterResult, AWSError>;
  /**
   * Modifies an existing option group.
   */
  modifyOptionGroup(params: RDS.Types.ModifyOptionGroupMessage, callback?: (err: AWSError, data: RDS.Types.ModifyOptionGroupResult) => void): Request<RDS.Types.ModifyOptionGroupResult, AWSError>;
  /**
   * Modifies an existing option group.
   */
  modifyOptionGroup(callback?: (err: AWSError, data: RDS.Types.ModifyOptionGroupResult) => void): Request<RDS.Types.ModifyOptionGroupResult, AWSError>;
  /**
   * Promotes a read replica DB instance to a standalone DB instance.    Backup duration is a function of the amount of changes to the database since the previous backup. If you plan to promote a read replica to a standalone instance, we recommend that you enable backups and complete at least one backup prior to promotion. In addition, a read replica cannot be promoted to a standalone instance when it is in the backing-up status. If you have enabled backups on your read replica, configure the automated backup window so that daily backups do not interfere with read replica promotion.   This command doesn't apply to Aurora MySQL, Aurora PostgreSQL, or RDS Custom.   
   */
  promoteReadReplica(params: RDS.Types.PromoteReadReplicaMessage, callback?: (err: AWSError, data: RDS.Types.PromoteReadReplicaResult) => void): Request<RDS.Types.PromoteReadReplicaResult, AWSError>;
  /**
   * Promotes a read replica DB instance to a standalone DB instance.    Backup duration is a function of the amount of changes to the database since the previous backup. If you plan to promote a read replica to a standalone instance, we recommend that you enable backups and complete at least one backup prior to promotion. In addition, a read replica cannot be promoted to a standalone instance when it is in the backing-up status. If you have enabled backups on your read replica, configure the automated backup window so that daily backups do not interfere with read replica promotion.   This command doesn't apply to Aurora MySQL, Aurora PostgreSQL, or RDS Custom.   
   */
  promoteReadReplica(callback?: (err: AWSError, data: RDS.Types.PromoteReadReplicaResult) => void): Request<RDS.Types.PromoteReadReplicaResult, AWSError>;
  /**
   * Promotes a read replica DB cluster to a standalone DB cluster.
   */
  promoteReadReplicaDBCluster(params: RDS.Types.PromoteReadReplicaDBClusterMessage, callback?: (err: AWSError, data: RDS.Types.PromoteReadReplicaDBClusterResult) => void): Request<RDS.Types.PromoteReadReplicaDBClusterResult, AWSError>;
  /**
   * Promotes a read replica DB cluster to a standalone DB cluster.
   */
  promoteReadReplicaDBCluster(callback?: (err: AWSError, data: RDS.Types.PromoteReadReplicaDBClusterResult) => void): Request<RDS.Types.PromoteReadReplicaDBClusterResult, AWSError>;
  /**
   * Purchases a reserved DB instance offering.
   */
  purchaseReservedDBInstancesOffering(params: RDS.Types.PurchaseReservedDBInstancesOfferingMessage, callback?: (err: AWSError, data: RDS.Types.PurchaseReservedDBInstancesOfferingResult) => void): Request<RDS.Types.PurchaseReservedDBInstancesOfferingResult, AWSError>;
  /**
   * Purchases a reserved DB instance offering.
   */
  purchaseReservedDBInstancesOffering(callback?: (err: AWSError, data: RDS.Types.PurchaseReservedDBInstancesOfferingResult) => void): Request<RDS.Types.PurchaseReservedDBInstancesOfferingResult, AWSError>;
  /**
   * You might need to reboot your DB cluster, usually for maintenance reasons. For example, if you make certain modifications, or if you change the DB cluster parameter group associated with the DB cluster, reboot the DB cluster for the changes to take effect. Rebooting a DB cluster restarts the database engine service. Rebooting a DB cluster results in a momentary outage, during which the DB cluster status is set to rebooting. Use this operation only for a non-Aurora Multi-AZ DB cluster. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide. 
   */
  rebootDBCluster(params: RDS.Types.RebootDBClusterMessage, callback?: (err: AWSError, data: RDS.Types.RebootDBClusterResult) => void): Request<RDS.Types.RebootDBClusterResult, AWSError>;
  /**
   * You might need to reboot your DB cluster, usually for maintenance reasons. For example, if you make certain modifications, or if you change the DB cluster parameter group associated with the DB cluster, reboot the DB cluster for the changes to take effect. Rebooting a DB cluster restarts the database engine service. Rebooting a DB cluster results in a momentary outage, during which the DB cluster status is set to rebooting. Use this operation only for a non-Aurora Multi-AZ DB cluster. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide. 
   */
  rebootDBCluster(callback?: (err: AWSError, data: RDS.Types.RebootDBClusterResult) => void): Request<RDS.Types.RebootDBClusterResult, AWSError>;
  /**
   * You might need to reboot your DB instance, usually for maintenance reasons. For example, if you make certain modifications, or if you change the DB parameter group associated with the DB instance, you must reboot the instance for the changes to take effect. Rebooting a DB instance restarts the database engine service. Rebooting a DB instance results in a momentary outage, during which the DB instance status is set to rebooting. For more information about rebooting, see Rebooting a DB Instance in the Amazon RDS User Guide.  This command doesn't apply to RDS Custom. If your DB instance is part of a Multi-AZ DB cluster, you can reboot the DB cluster with the RebootDBCluster operation.
   */
  rebootDBInstance(params: RDS.Types.RebootDBInstanceMessage, callback?: (err: AWSError, data: RDS.Types.RebootDBInstanceResult) => void): Request<RDS.Types.RebootDBInstanceResult, AWSError>;
  /**
   * You might need to reboot your DB instance, usually for maintenance reasons. For example, if you make certain modifications, or if you change the DB parameter group associated with the DB instance, you must reboot the instance for the changes to take effect. Rebooting a DB instance restarts the database engine service. Rebooting a DB instance results in a momentary outage, during which the DB instance status is set to rebooting. For more information about rebooting, see Rebooting a DB Instance in the Amazon RDS User Guide.  This command doesn't apply to RDS Custom. If your DB instance is part of a Multi-AZ DB cluster, you can reboot the DB cluster with the RebootDBCluster operation.
   */
  rebootDBInstance(callback?: (err: AWSError, data: RDS.Types.RebootDBInstanceResult) => void): Request<RDS.Types.RebootDBInstanceResult, AWSError>;
  /**
   * Associate one or more DBProxyTarget data structures with a DBProxyTargetGroup.
   */
  registerDBProxyTargets(params: RDS.Types.RegisterDBProxyTargetsRequest, callback?: (err: AWSError, data: RDS.Types.RegisterDBProxyTargetsResponse) => void): Request<RDS.Types.RegisterDBProxyTargetsResponse, AWSError>;
  /**
   * Associate one or more DBProxyTarget data structures with a DBProxyTargetGroup.
   */
  registerDBProxyTargets(callback?: (err: AWSError, data: RDS.Types.RegisterDBProxyTargetsResponse) => void): Request<RDS.Types.RegisterDBProxyTargetsResponse, AWSError>;
  /**
   * Detaches an Aurora secondary cluster from an Aurora global database cluster. The cluster becomes a standalone cluster with read-write capability instead of being read-only and receiving data from a primary cluster in a different Region.  This action only applies to Aurora DB clusters. 
   */
  removeFromGlobalCluster(params: RDS.Types.RemoveFromGlobalClusterMessage, callback?: (err: AWSError, data: RDS.Types.RemoveFromGlobalClusterResult) => void): Request<RDS.Types.RemoveFromGlobalClusterResult, AWSError>;
  /**
   * Detaches an Aurora secondary cluster from an Aurora global database cluster. The cluster becomes a standalone cluster with read-write capability instead of being read-only and receiving data from a primary cluster in a different Region.  This action only applies to Aurora DB clusters. 
   */
  removeFromGlobalCluster(callback?: (err: AWSError, data: RDS.Types.RemoveFromGlobalClusterResult) => void): Request<RDS.Types.RemoveFromGlobalClusterResult, AWSError>;
  /**
   * Removes the asssociation of an Amazon Web Services Identity and Access Management (IAM) role from a DB cluster. For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide. 
   */
  removeRoleFromDBCluster(params: RDS.Types.RemoveRoleFromDBClusterMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the asssociation of an Amazon Web Services Identity and Access Management (IAM) role from a DB cluster. For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide. 
   */
  removeRoleFromDBCluster(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociates an Amazon Web Services Identity and Access Management (IAM) role from a DB instance.
   */
  removeRoleFromDBInstance(params: RDS.Types.RemoveRoleFromDBInstanceMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociates an Amazon Web Services Identity and Access Management (IAM) role from a DB instance.
   */
  removeRoleFromDBInstance(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a source identifier from an existing RDS event notification subscription.
   */
  removeSourceIdentifierFromSubscription(params: RDS.Types.RemoveSourceIdentifierFromSubscriptionMessage, callback?: (err: AWSError, data: RDS.Types.RemoveSourceIdentifierFromSubscriptionResult) => void): Request<RDS.Types.RemoveSourceIdentifierFromSubscriptionResult, AWSError>;
  /**
   * Removes a source identifier from an existing RDS event notification subscription.
   */
  removeSourceIdentifierFromSubscription(callback?: (err: AWSError, data: RDS.Types.RemoveSourceIdentifierFromSubscriptionResult) => void): Request<RDS.Types.RemoveSourceIdentifierFromSubscriptionResult, AWSError>;
  /**
   * Removes metadata tags from an Amazon RDS resource. For an overview on tagging an Amazon RDS resource, see Tagging Amazon RDS Resources in the Amazon RDS User Guide. 
   */
  removeTagsFromResource(params: RDS.Types.RemoveTagsFromResourceMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes metadata tags from an Amazon RDS resource. For an overview on tagging an Amazon RDS resource, see Tagging Amazon RDS Resources in the Amazon RDS User Guide. 
   */
  removeTagsFromResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Modifies the parameters of a DB cluster parameter group to the default value. To reset specific parameters submit a list of the following: ParameterName and ApplyMethod. To reset the entire DB cluster parameter group, specify the DBClusterParameterGroupName and ResetAllParameters parameters. When resetting the entire group, dynamic parameters are updated immediately and static parameters are set to pending-reboot to take effect on the next DB instance restart or RebootDBInstance request. You must call RebootDBInstance for every DB instance in your DB cluster that you want the updated static parameter to apply to. For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide. 
   */
  resetDBClusterParameterGroup(params: RDS.Types.ResetDBClusterParameterGroupMessage, callback?: (err: AWSError, data: RDS.Types.DBClusterParameterGroupNameMessage) => void): Request<RDS.Types.DBClusterParameterGroupNameMessage, AWSError>;
  /**
   * Modifies the parameters of a DB cluster parameter group to the default value. To reset specific parameters submit a list of the following: ParameterName and ApplyMethod. To reset the entire DB cluster parameter group, specify the DBClusterParameterGroupName and ResetAllParameters parameters. When resetting the entire group, dynamic parameters are updated immediately and static parameters are set to pending-reboot to take effect on the next DB instance restart or RebootDBInstance request. You must call RebootDBInstance for every DB instance in your DB cluster that you want the updated static parameter to apply to. For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide. 
   */
  resetDBClusterParameterGroup(callback?: (err: AWSError, data: RDS.Types.DBClusterParameterGroupNameMessage) => void): Request<RDS.Types.DBClusterParameterGroupNameMessage, AWSError>;
  /**
   * Modifies the parameters of a DB parameter group to the engine/system default value. To reset specific parameters, provide a list of the following: ParameterName and ApplyMethod. To reset the entire DB parameter group, specify the DBParameterGroup name and ResetAllParameters parameters. When resetting the entire group, dynamic parameters are updated immediately and static parameters are set to pending-reboot to take effect on the next DB instance restart or RebootDBInstance request.
   */
  resetDBParameterGroup(params: RDS.Types.ResetDBParameterGroupMessage, callback?: (err: AWSError, data: RDS.Types.DBParameterGroupNameMessage) => void): Request<RDS.Types.DBParameterGroupNameMessage, AWSError>;
  /**
   * Modifies the parameters of a DB parameter group to the engine/system default value. To reset specific parameters, provide a list of the following: ParameterName and ApplyMethod. To reset the entire DB parameter group, specify the DBParameterGroup name and ResetAllParameters parameters. When resetting the entire group, dynamic parameters are updated immediately and static parameters are set to pending-reboot to take effect on the next DB instance restart or RebootDBInstance request.
   */
  resetDBParameterGroup(callback?: (err: AWSError, data: RDS.Types.DBParameterGroupNameMessage) => void): Request<RDS.Types.DBParameterGroupNameMessage, AWSError>;
  /**
   * Creates an Amazon Aurora DB cluster from MySQL data stored in an Amazon S3 bucket. Amazon RDS must be authorized to access the Amazon S3 bucket and the data must be created using the Percona XtraBackup utility as described in  Migrating Data from MySQL by Using an Amazon S3 Bucket in the Amazon Aurora User Guide.  This action only restores the DB cluster, not the DB instances for that DB cluster. You must invoke the CreateDBInstance action to create DB instances for the restored DB cluster, specifying the identifier of the restored DB cluster in DBClusterIdentifier. You can create DB instances only after the RestoreDBClusterFromS3 action has completed and the DB cluster is available.  For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide.  This action only applies to Aurora DB clusters. The source DB engine must be MySQL. 
   */
  restoreDBClusterFromS3(params: RDS.Types.RestoreDBClusterFromS3Message, callback?: (err: AWSError, data: RDS.Types.RestoreDBClusterFromS3Result) => void): Request<RDS.Types.RestoreDBClusterFromS3Result, AWSError>;
  /**
   * Creates an Amazon Aurora DB cluster from MySQL data stored in an Amazon S3 bucket. Amazon RDS must be authorized to access the Amazon S3 bucket and the data must be created using the Percona XtraBackup utility as described in  Migrating Data from MySQL by Using an Amazon S3 Bucket in the Amazon Aurora User Guide.  This action only restores the DB cluster, not the DB instances for that DB cluster. You must invoke the CreateDBInstance action to create DB instances for the restored DB cluster, specifying the identifier of the restored DB cluster in DBClusterIdentifier. You can create DB instances only after the RestoreDBClusterFromS3 action has completed and the DB cluster is available.  For more information on Amazon Aurora, see  What is Amazon Aurora? in the Amazon Aurora User Guide.  This action only applies to Aurora DB clusters. The source DB engine must be MySQL. 
   */
  restoreDBClusterFromS3(callback?: (err: AWSError, data: RDS.Types.RestoreDBClusterFromS3Result) => void): Request<RDS.Types.RestoreDBClusterFromS3Result, AWSError>;
  /**
   * Creates a new DB cluster from a DB snapshot or DB cluster snapshot. The target DB cluster is created from the source snapshot with a default configuration. If you don't specify a security group, the new DB cluster is associated with the default security group.  This action only restores the DB cluster, not the DB instances for that DB cluster. You must invoke the CreateDBInstance action to create DB instances for the restored DB cluster, specifying the identifier of the restored DB cluster in DBClusterIdentifier. You can create DB instances only after the RestoreDBClusterFromSnapshot action has completed and the DB cluster is available.  For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide. 
   */
  restoreDBClusterFromSnapshot(params: RDS.Types.RestoreDBClusterFromSnapshotMessage, callback?: (err: AWSError, data: RDS.Types.RestoreDBClusterFromSnapshotResult) => void): Request<RDS.Types.RestoreDBClusterFromSnapshotResult, AWSError>;
  /**
   * Creates a new DB cluster from a DB snapshot or DB cluster snapshot. The target DB cluster is created from the source snapshot with a default configuration. If you don't specify a security group, the new DB cluster is associated with the default security group.  This action only restores the DB cluster, not the DB instances for that DB cluster. You must invoke the CreateDBInstance action to create DB instances for the restored DB cluster, specifying the identifier of the restored DB cluster in DBClusterIdentifier. You can create DB instances only after the RestoreDBClusterFromSnapshot action has completed and the DB cluster is available.  For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide. 
   */
  restoreDBClusterFromSnapshot(callback?: (err: AWSError, data: RDS.Types.RestoreDBClusterFromSnapshotResult) => void): Request<RDS.Types.RestoreDBClusterFromSnapshotResult, AWSError>;
  /**
   * Restores a DB cluster to an arbitrary point in time. Users can restore to any point in time before LatestRestorableTime for up to BackupRetentionPeriod days. The target DB cluster is created from the source DB cluster with the same configuration as the original DB cluster, except that the new DB cluster is created with the default DB security group.  For Aurora, this action only restores the DB cluster, not the DB instances for that DB cluster. You must invoke the CreateDBInstance action to create DB instances for the restored DB cluster, specifying the identifier of the restored DB cluster in DBClusterIdentifier. You can create DB instances only after the RestoreDBClusterToPointInTime action has completed and the DB cluster is available.  For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide. 
   */
  restoreDBClusterToPointInTime(params: RDS.Types.RestoreDBClusterToPointInTimeMessage, callback?: (err: AWSError, data: RDS.Types.RestoreDBClusterToPointInTimeResult) => void): Request<RDS.Types.RestoreDBClusterToPointInTimeResult, AWSError>;
  /**
   * Restores a DB cluster to an arbitrary point in time. Users can restore to any point in time before LatestRestorableTime for up to BackupRetentionPeriod days. The target DB cluster is created from the source DB cluster with the same configuration as the original DB cluster, except that the new DB cluster is created with the default DB security group.  For Aurora, this action only restores the DB cluster, not the DB instances for that DB cluster. You must invoke the CreateDBInstance action to create DB instances for the restored DB cluster, specifying the identifier of the restored DB cluster in DBClusterIdentifier. You can create DB instances only after the RestoreDBClusterToPointInTime action has completed and the DB cluster is available.  For more information on Amazon Aurora DB clusters, see  What is Amazon Aurora? in the Amazon Aurora User Guide. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide. 
   */
  restoreDBClusterToPointInTime(callback?: (err: AWSError, data: RDS.Types.RestoreDBClusterToPointInTimeResult) => void): Request<RDS.Types.RestoreDBClusterToPointInTimeResult, AWSError>;
  /**
   * Creates a new DB instance from a DB snapshot. The target database is created from the source database restore point with most of the source's original configuration, including the default security group and DB parameter group. By default, the new DB instance is created as a Single-AZ deployment, except when the instance is a SQL Server instance that has an option group associated with mirroring. In this case, the instance becomes a Multi-AZ deployment, not a Single-AZ deployment. If you want to replace your original DB instance with the new, restored DB instance, then rename your original DB instance before you call the RestoreDBInstanceFromDBSnapshot action. RDS doesn't allow two DB instances with the same name. After you have renamed your original DB instance with a different identifier, then you can pass the original name of the DB instance as the DBInstanceIdentifier in the call to the RestoreDBInstanceFromDBSnapshot action. The result is that you replace the original DB instance with the DB instance created from the snapshot. If you are restoring from a shared manual DB snapshot, the DBSnapshotIdentifier must be the ARN of the shared DB snapshot.  This command doesn't apply to Aurora MySQL and Aurora PostgreSQL. For Aurora, use RestoreDBClusterFromSnapshot. 
   */
  restoreDBInstanceFromDBSnapshot(params: RDS.Types.RestoreDBInstanceFromDBSnapshotMessage, callback?: (err: AWSError, data: RDS.Types.RestoreDBInstanceFromDBSnapshotResult) => void): Request<RDS.Types.RestoreDBInstanceFromDBSnapshotResult, AWSError>;
  /**
   * Creates a new DB instance from a DB snapshot. The target database is created from the source database restore point with most of the source's original configuration, including the default security group and DB parameter group. By default, the new DB instance is created as a Single-AZ deployment, except when the instance is a SQL Server instance that has an option group associated with mirroring. In this case, the instance becomes a Multi-AZ deployment, not a Single-AZ deployment. If you want to replace your original DB instance with the new, restored DB instance, then rename your original DB instance before you call the RestoreDBInstanceFromDBSnapshot action. RDS doesn't allow two DB instances with the same name. After you have renamed your original DB instance with a different identifier, then you can pass the original name of the DB instance as the DBInstanceIdentifier in the call to the RestoreDBInstanceFromDBSnapshot action. The result is that you replace the original DB instance with the DB instance created from the snapshot. If you are restoring from a shared manual DB snapshot, the DBSnapshotIdentifier must be the ARN of the shared DB snapshot.  This command doesn't apply to Aurora MySQL and Aurora PostgreSQL. For Aurora, use RestoreDBClusterFromSnapshot. 
   */
  restoreDBInstanceFromDBSnapshot(callback?: (err: AWSError, data: RDS.Types.RestoreDBInstanceFromDBSnapshotResult) => void): Request<RDS.Types.RestoreDBInstanceFromDBSnapshotResult, AWSError>;
  /**
   * Amazon Relational Database Service (Amazon RDS) supports importing MySQL databases by using backup files. You can create a backup of your on-premises database, store it on Amazon Simple Storage Service (Amazon S3), and then restore the backup file onto a new Amazon RDS DB instance running MySQL. For more information, see Importing Data into an Amazon RDS MySQL DB Instance in the Amazon RDS User Guide.  This command doesn't apply to RDS Custom.
   */
  restoreDBInstanceFromS3(params: RDS.Types.RestoreDBInstanceFromS3Message, callback?: (err: AWSError, data: RDS.Types.RestoreDBInstanceFromS3Result) => void): Request<RDS.Types.RestoreDBInstanceFromS3Result, AWSError>;
  /**
   * Amazon Relational Database Service (Amazon RDS) supports importing MySQL databases by using backup files. You can create a backup of your on-premises database, store it on Amazon Simple Storage Service (Amazon S3), and then restore the backup file onto a new Amazon RDS DB instance running MySQL. For more information, see Importing Data into an Amazon RDS MySQL DB Instance in the Amazon RDS User Guide.  This command doesn't apply to RDS Custom.
   */
  restoreDBInstanceFromS3(callback?: (err: AWSError, data: RDS.Types.RestoreDBInstanceFromS3Result) => void): Request<RDS.Types.RestoreDBInstanceFromS3Result, AWSError>;
  /**
   * Restores a DB instance to an arbitrary point in time. You can restore to any point in time before the time identified by the LatestRestorableTime property. You can restore to a point up to the number of days specified by the BackupRetentionPeriod property. The target database is created with most of the original configuration, but in a system-selected Availability Zone, with the default security group, the default subnet group, and the default DB parameter group. By default, the new DB instance is created as a single-AZ deployment except when the instance is a SQL Server instance that has an option group that is associated with mirroring; in this case, the instance becomes a mirrored deployment and not a single-AZ deployment.  This command doesn't apply to Aurora MySQL and Aurora PostgreSQL. For Aurora, use RestoreDBClusterToPointInTime. 
   */
  restoreDBInstanceToPointInTime(params: RDS.Types.RestoreDBInstanceToPointInTimeMessage, callback?: (err: AWSError, data: RDS.Types.RestoreDBInstanceToPointInTimeResult) => void): Request<RDS.Types.RestoreDBInstanceToPointInTimeResult, AWSError>;
  /**
   * Restores a DB instance to an arbitrary point in time. You can restore to any point in time before the time identified by the LatestRestorableTime property. You can restore to a point up to the number of days specified by the BackupRetentionPeriod property. The target database is created with most of the original configuration, but in a system-selected Availability Zone, with the default security group, the default subnet group, and the default DB parameter group. By default, the new DB instance is created as a single-AZ deployment except when the instance is a SQL Server instance that has an option group that is associated with mirroring; in this case, the instance becomes a mirrored deployment and not a single-AZ deployment.  This command doesn't apply to Aurora MySQL and Aurora PostgreSQL. For Aurora, use RestoreDBClusterToPointInTime. 
   */
  restoreDBInstanceToPointInTime(callback?: (err: AWSError, data: RDS.Types.RestoreDBInstanceToPointInTimeResult) => void): Request<RDS.Types.RestoreDBInstanceToPointInTimeResult, AWSError>;
  /**
   * Revokes ingress from a DBSecurityGroup for previously authorized IP ranges or EC2 or VPC security groups. Required parameters for this API are one of CIDRIP, EC2SecurityGroupId for VPC, or (EC2SecurityGroupOwnerId and either EC2SecurityGroupName or EC2SecurityGroupId).  EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that you migrate as soon as possible. For more information, see Migrate from EC2-Classic to a VPC in the Amazon EC2 User Guide, the blog EC2-Classic Networking is Retiring – Here’s How to Prepare, and Moving a DB instance not in a VPC into a VPC in the Amazon RDS User Guide. 
   */
  revokeDBSecurityGroupIngress(params: RDS.Types.RevokeDBSecurityGroupIngressMessage, callback?: (err: AWSError, data: RDS.Types.RevokeDBSecurityGroupIngressResult) => void): Request<RDS.Types.RevokeDBSecurityGroupIngressResult, AWSError>;
  /**
   * Revokes ingress from a DBSecurityGroup for previously authorized IP ranges or EC2 or VPC security groups. Required parameters for this API are one of CIDRIP, EC2SecurityGroupId for VPC, or (EC2SecurityGroupOwnerId and either EC2SecurityGroupName or EC2SecurityGroupId).  EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that you migrate as soon as possible. For more information, see Migrate from EC2-Classic to a VPC in the Amazon EC2 User Guide, the blog EC2-Classic Networking is Retiring – Here’s How to Prepare, and Moving a DB instance not in a VPC into a VPC in the Amazon RDS User Guide. 
   */
  revokeDBSecurityGroupIngress(callback?: (err: AWSError, data: RDS.Types.RevokeDBSecurityGroupIngressResult) => void): Request<RDS.Types.RevokeDBSecurityGroupIngressResult, AWSError>;
  /**
   * Starts a database activity stream to monitor activity on the database. For more information, see  Monitoring Amazon Aurora with Database Activity Streams in the Amazon Aurora User Guide or  Monitoring Amazon RDS with Database Activity Streams in the Amazon RDS User Guide.
   */
  startActivityStream(params: RDS.Types.StartActivityStreamRequest, callback?: (err: AWSError, data: RDS.Types.StartActivityStreamResponse) => void): Request<RDS.Types.StartActivityStreamResponse, AWSError>;
  /**
   * Starts a database activity stream to monitor activity on the database. For more information, see  Monitoring Amazon Aurora with Database Activity Streams in the Amazon Aurora User Guide or  Monitoring Amazon RDS with Database Activity Streams in the Amazon RDS User Guide.
   */
  startActivityStream(callback?: (err: AWSError, data: RDS.Types.StartActivityStreamResponse) => void): Request<RDS.Types.StartActivityStreamResponse, AWSError>;
  /**
   * Starts an Amazon Aurora DB cluster that was stopped using the Amazon Web Services console, the stop-db-cluster CLI command, or the StopDBCluster action. For more information, see  Stopping and Starting an Aurora Cluster in the Amazon Aurora User Guide.  This action only applies to Aurora DB clusters. 
   */
  startDBCluster(params: RDS.Types.StartDBClusterMessage, callback?: (err: AWSError, data: RDS.Types.StartDBClusterResult) => void): Request<RDS.Types.StartDBClusterResult, AWSError>;
  /**
   * Starts an Amazon Aurora DB cluster that was stopped using the Amazon Web Services console, the stop-db-cluster CLI command, or the StopDBCluster action. For more information, see  Stopping and Starting an Aurora Cluster in the Amazon Aurora User Guide.  This action only applies to Aurora DB clusters. 
   */
  startDBCluster(callback?: (err: AWSError, data: RDS.Types.StartDBClusterResult) => void): Request<RDS.Types.StartDBClusterResult, AWSError>;
  /**
   * Starts an Amazon RDS DB instance that was stopped using the Amazon Web Services console, the stop-db-instance CLI command, or the StopDBInstance action. For more information, see  Starting an Amazon RDS DB instance That Was Previously Stopped in the Amazon RDS User Guide.   This command doesn't apply to RDS Custom, Aurora MySQL, and Aurora PostgreSQL. For Aurora DB clusters, use StartDBCluster instead. 
   */
  startDBInstance(params: RDS.Types.StartDBInstanceMessage, callback?: (err: AWSError, data: RDS.Types.StartDBInstanceResult) => void): Request<RDS.Types.StartDBInstanceResult, AWSError>;
  /**
   * Starts an Amazon RDS DB instance that was stopped using the Amazon Web Services console, the stop-db-instance CLI command, or the StopDBInstance action. For more information, see  Starting an Amazon RDS DB instance That Was Previously Stopped in the Amazon RDS User Guide.   This command doesn't apply to RDS Custom, Aurora MySQL, and Aurora PostgreSQL. For Aurora DB clusters, use StartDBCluster instead. 
   */
  startDBInstance(callback?: (err: AWSError, data: RDS.Types.StartDBInstanceResult) => void): Request<RDS.Types.StartDBInstanceResult, AWSError>;
  /**
   * Enables replication of automated backups to a different Amazon Web Services Region. This command doesn't apply to RDS Custom. For more information, see  Replicating Automated Backups to Another Amazon Web Services Region in the Amazon RDS User Guide. 
   */
  startDBInstanceAutomatedBackupsReplication(params: RDS.Types.StartDBInstanceAutomatedBackupsReplicationMessage, callback?: (err: AWSError, data: RDS.Types.StartDBInstanceAutomatedBackupsReplicationResult) => void): Request<RDS.Types.StartDBInstanceAutomatedBackupsReplicationResult, AWSError>;
  /**
   * Enables replication of automated backups to a different Amazon Web Services Region. This command doesn't apply to RDS Custom. For more information, see  Replicating Automated Backups to Another Amazon Web Services Region in the Amazon RDS User Guide. 
   */
  startDBInstanceAutomatedBackupsReplication(callback?: (err: AWSError, data: RDS.Types.StartDBInstanceAutomatedBackupsReplicationResult) => void): Request<RDS.Types.StartDBInstanceAutomatedBackupsReplicationResult, AWSError>;
  /**
   * Starts an export of DB snapshot or DB cluster data to Amazon S3. The provided IAM role must have access to the S3 bucket. You can't export snapshot data from RDS Custom DB instances. You can't export cluster data from Multi-AZ DB clusters. For more information on exporting DB snapshot data, see Exporting DB snapshot data to Amazon S3 in the Amazon RDS User Guide or Exporting DB cluster snapshot data to Amazon S3 in the Amazon Aurora User Guide. For more information on exporting DB cluster data, see Exporting DB cluster data to Amazon S3 in the Amazon Aurora User Guide.
   */
  startExportTask(params: RDS.Types.StartExportTaskMessage, callback?: (err: AWSError, data: RDS.Types.ExportTask) => void): Request<RDS.Types.ExportTask, AWSError>;
  /**
   * Starts an export of DB snapshot or DB cluster data to Amazon S3. The provided IAM role must have access to the S3 bucket. You can't export snapshot data from RDS Custom DB instances. You can't export cluster data from Multi-AZ DB clusters. For more information on exporting DB snapshot data, see Exporting DB snapshot data to Amazon S3 in the Amazon RDS User Guide or Exporting DB cluster snapshot data to Amazon S3 in the Amazon Aurora User Guide. For more information on exporting DB cluster data, see Exporting DB cluster data to Amazon S3 in the Amazon Aurora User Guide.
   */
  startExportTask(callback?: (err: AWSError, data: RDS.Types.ExportTask) => void): Request<RDS.Types.ExportTask, AWSError>;
  /**
   * Stops a database activity stream that was started using the Amazon Web Services console, the start-activity-stream CLI command, or the StartActivityStream action. For more information, see  Monitoring Amazon Aurora with Database Activity Streams in the Amazon Aurora User Guide or  Monitoring Amazon RDS with Database Activity Streams in the Amazon RDS User Guide.
   */
  stopActivityStream(params: RDS.Types.StopActivityStreamRequest, callback?: (err: AWSError, data: RDS.Types.StopActivityStreamResponse) => void): Request<RDS.Types.StopActivityStreamResponse, AWSError>;
  /**
   * Stops a database activity stream that was started using the Amazon Web Services console, the start-activity-stream CLI command, or the StartActivityStream action. For more information, see  Monitoring Amazon Aurora with Database Activity Streams in the Amazon Aurora User Guide or  Monitoring Amazon RDS with Database Activity Streams in the Amazon RDS User Guide.
   */
  stopActivityStream(callback?: (err: AWSError, data: RDS.Types.StopActivityStreamResponse) => void): Request<RDS.Types.StopActivityStreamResponse, AWSError>;
  /**
   * Stops an Amazon Aurora DB cluster. When you stop a DB cluster, Aurora retains the DB cluster's metadata, including its endpoints and DB parameter groups. Aurora also retains the transaction logs so you can do a point-in-time restore if necessary. For more information, see  Stopping and Starting an Aurora Cluster in the Amazon Aurora User Guide.  This action only applies to Aurora DB clusters. 
   */
  stopDBCluster(params: RDS.Types.StopDBClusterMessage, callback?: (err: AWSError, data: RDS.Types.StopDBClusterResult) => void): Request<RDS.Types.StopDBClusterResult, AWSError>;
  /**
   * Stops an Amazon Aurora DB cluster. When you stop a DB cluster, Aurora retains the DB cluster's metadata, including its endpoints and DB parameter groups. Aurora also retains the transaction logs so you can do a point-in-time restore if necessary. For more information, see  Stopping and Starting an Aurora Cluster in the Amazon Aurora User Guide.  This action only applies to Aurora DB clusters. 
   */
  stopDBCluster(callback?: (err: AWSError, data: RDS.Types.StopDBClusterResult) => void): Request<RDS.Types.StopDBClusterResult, AWSError>;
  /**
   * Stops an Amazon RDS DB instance. When you stop a DB instance, Amazon RDS retains the DB instance's metadata, including its endpoint, DB parameter group, and option group membership. Amazon RDS also retains the transaction logs so you can do a point-in-time restore if necessary. For more information, see  Stopping an Amazon RDS DB Instance Temporarily in the Amazon RDS User Guide.   This command doesn't apply to RDS Custom, Aurora MySQL, and Aurora PostgreSQL. For Aurora clusters, use StopDBCluster instead. 
   */
  stopDBInstance(params: RDS.Types.StopDBInstanceMessage, callback?: (err: AWSError, data: RDS.Types.StopDBInstanceResult) => void): Request<RDS.Types.StopDBInstanceResult, AWSError>;
  /**
   * Stops an Amazon RDS DB instance. When you stop a DB instance, Amazon RDS retains the DB instance's metadata, including its endpoint, DB parameter group, and option group membership. Amazon RDS also retains the transaction logs so you can do a point-in-time restore if necessary. For more information, see  Stopping an Amazon RDS DB Instance Temporarily in the Amazon RDS User Guide.   This command doesn't apply to RDS Custom, Aurora MySQL, and Aurora PostgreSQL. For Aurora clusters, use StopDBCluster instead. 
   */
  stopDBInstance(callback?: (err: AWSError, data: RDS.Types.StopDBInstanceResult) => void): Request<RDS.Types.StopDBInstanceResult, AWSError>;
  /**
   * Stops automated backup replication for a DB instance. This command doesn't apply to RDS Custom, Aurora MySQL, and Aurora PostgreSQL. For more information, see  Replicating Automated Backups to Another Amazon Web Services Region in the Amazon RDS User Guide. 
   */
  stopDBInstanceAutomatedBackupsReplication(params: RDS.Types.StopDBInstanceAutomatedBackupsReplicationMessage, callback?: (err: AWSError, data: RDS.Types.StopDBInstanceAutomatedBackupsReplicationResult) => void): Request<RDS.Types.StopDBInstanceAutomatedBackupsReplicationResult, AWSError>;
  /**
   * Stops automated backup replication for a DB instance. This command doesn't apply to RDS Custom, Aurora MySQL, and Aurora PostgreSQL. For more information, see  Replicating Automated Backups to Another Amazon Web Services Region in the Amazon RDS User Guide. 
   */
  stopDBInstanceAutomatedBackupsReplication(callback?: (err: AWSError, data: RDS.Types.StopDBInstanceAutomatedBackupsReplicationResult) => void): Request<RDS.Types.StopDBInstanceAutomatedBackupsReplicationResult, AWSError>;
  /**
   * Switches over a blue/green deployment. Before you switch over, production traffic is routed to the databases in the blue environment. After you switch over, production traffic is routed to the databases in the green environment. For more information, see Using Amazon RDS Blue/Green Deployments for database updates in the Amazon RDS User Guide and Using Amazon RDS Blue/Green Deployments for database updates in the Amazon Aurora User Guide.
   */
  switchoverBlueGreenDeployment(params: RDS.Types.SwitchoverBlueGreenDeploymentRequest, callback?: (err: AWSError, data: RDS.Types.SwitchoverBlueGreenDeploymentResponse) => void): Request<RDS.Types.SwitchoverBlueGreenDeploymentResponse, AWSError>;
  /**
   * Switches over a blue/green deployment. Before you switch over, production traffic is routed to the databases in the blue environment. After you switch over, production traffic is routed to the databases in the green environment. For more information, see Using Amazon RDS Blue/Green Deployments for database updates in the Amazon RDS User Guide and Using Amazon RDS Blue/Green Deployments for database updates in the Amazon Aurora User Guide.
   */
  switchoverBlueGreenDeployment(callback?: (err: AWSError, data: RDS.Types.SwitchoverBlueGreenDeploymentResponse) => void): Request<RDS.Types.SwitchoverBlueGreenDeploymentResponse, AWSError>;
  /**
   * Switches over the specified secondary DB cluster to be the new primary DB cluster in the global database cluster. Switchover operations were previously called "managed planned failovers." Aurora promotes the specified secondary cluster to assume full read/write capabilities and demotes the current primary cluster to a secondary (read-only) cluster, maintaining the orginal replication topology. All secondary clusters are synchronized with the primary at the beginning of the process so the new primary continues operations for the Aurora global database without losing any data. Your database is unavailable for a short time while the primary and selected secondary clusters are assuming their new roles. For more information about switching over an Aurora global database, see Performing switchovers for Amazon Aurora global databases in the Amazon Aurora User Guide.  This operation is intended for controlled environments, for operations such as "regional rotation" or to fall back to the original primary after a global database failover. 
   */
  switchoverGlobalCluster(params: RDS.Types.SwitchoverGlobalClusterMessage, callback?: (err: AWSError, data: RDS.Types.SwitchoverGlobalClusterResult) => void): Request<RDS.Types.SwitchoverGlobalClusterResult, AWSError>;
  /**
   * Switches over the specified secondary DB cluster to be the new primary DB cluster in the global database cluster. Switchover operations were previously called "managed planned failovers." Aurora promotes the specified secondary cluster to assume full read/write capabilities and demotes the current primary cluster to a secondary (read-only) cluster, maintaining the orginal replication topology. All secondary clusters are synchronized with the primary at the beginning of the process so the new primary continues operations for the Aurora global database without losing any data. Your database is unavailable for a short time while the primary and selected secondary clusters are assuming their new roles. For more information about switching over an Aurora global database, see Performing switchovers for Amazon Aurora global databases in the Amazon Aurora User Guide.  This operation is intended for controlled environments, for operations such as "regional rotation" or to fall back to the original primary after a global database failover. 
   */
  switchoverGlobalCluster(callback?: (err: AWSError, data: RDS.Types.SwitchoverGlobalClusterResult) => void): Request<RDS.Types.SwitchoverGlobalClusterResult, AWSError>;
  /**
   * Switches over an Oracle standby database in an Oracle Data Guard environment, making it the new primary database. Issue this command in the Region that hosts the current standby database.
   */
  switchoverReadReplica(params: RDS.Types.SwitchoverReadReplicaMessage, callback?: (err: AWSError, data: RDS.Types.SwitchoverReadReplicaResult) => void): Request<RDS.Types.SwitchoverReadReplicaResult, AWSError>;
  /**
   * Switches over an Oracle standby database in an Oracle Data Guard environment, making it the new primary database. Issue this command in the Region that hosts the current standby database.
   */
  switchoverReadReplica(callback?: (err: AWSError, data: RDS.Types.SwitchoverReadReplicaResult) => void): Request<RDS.Types.SwitchoverReadReplicaResult, AWSError>;
  /**
   * Waits for the dBInstanceAvailable state by periodically calling the underlying RDS.describeDBInstancesoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBInstanceAvailable", params: RDS.Types.DescribeDBInstancesMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: RDS.Types.DBInstanceMessage) => void): Request<RDS.Types.DBInstanceMessage, AWSError>;
  /**
   * Waits for the dBInstanceAvailable state by periodically calling the underlying RDS.describeDBInstancesoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBInstanceAvailable", callback?: (err: AWSError, data: RDS.Types.DBInstanceMessage) => void): Request<RDS.Types.DBInstanceMessage, AWSError>;
  /**
   * Waits for the dBInstanceDeleted state by periodically calling the underlying RDS.describeDBInstancesoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBInstanceDeleted", params: RDS.Types.DescribeDBInstancesMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: RDS.Types.DBInstanceMessage) => void): Request<RDS.Types.DBInstanceMessage, AWSError>;
  /**
   * Waits for the dBInstanceDeleted state by periodically calling the underlying RDS.describeDBInstancesoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBInstanceDeleted", callback?: (err: AWSError, data: RDS.Types.DBInstanceMessage) => void): Request<RDS.Types.DBInstanceMessage, AWSError>;
  /**
   * Waits for the dBSnapshotAvailable state by periodically calling the underlying RDS.describeDBSnapshotsoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBSnapshotAvailable", params: RDS.Types.DescribeDBSnapshotsMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: RDS.Types.DBSnapshotMessage) => void): Request<RDS.Types.DBSnapshotMessage, AWSError>;
  /**
   * Waits for the dBSnapshotAvailable state by periodically calling the underlying RDS.describeDBSnapshotsoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBSnapshotAvailable", callback?: (err: AWSError, data: RDS.Types.DBSnapshotMessage) => void): Request<RDS.Types.DBSnapshotMessage, AWSError>;
  /**
   * Waits for the dBSnapshotDeleted state by periodically calling the underlying RDS.describeDBSnapshotsoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBSnapshotDeleted", params: RDS.Types.DescribeDBSnapshotsMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: RDS.Types.DBSnapshotMessage) => void): Request<RDS.Types.DBSnapshotMessage, AWSError>;
  /**
   * Waits for the dBSnapshotDeleted state by periodically calling the underlying RDS.describeDBSnapshotsoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBSnapshotDeleted", callback?: (err: AWSError, data: RDS.Types.DBSnapshotMessage) => void): Request<RDS.Types.DBSnapshotMessage, AWSError>;
  /**
   * Waits for the dBClusterSnapshotAvailable state by periodically calling the underlying RDS.describeDBClusterSnapshotsoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBClusterSnapshotAvailable", params: RDS.Types.DescribeDBClusterSnapshotsMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: RDS.Types.DBClusterSnapshotMessage) => void): Request<RDS.Types.DBClusterSnapshotMessage, AWSError>;
  /**
   * Waits for the dBClusterSnapshotAvailable state by periodically calling the underlying RDS.describeDBClusterSnapshotsoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBClusterSnapshotAvailable", callback?: (err: AWSError, data: RDS.Types.DBClusterSnapshotMessage) => void): Request<RDS.Types.DBClusterSnapshotMessage, AWSError>;
  /**
   * Waits for the dBClusterSnapshotDeleted state by periodically calling the underlying RDS.describeDBClusterSnapshotsoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBClusterSnapshotDeleted", params: RDS.Types.DescribeDBClusterSnapshotsMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: RDS.Types.DBClusterSnapshotMessage) => void): Request<RDS.Types.DBClusterSnapshotMessage, AWSError>;
  /**
   * Waits for the dBClusterSnapshotDeleted state by periodically calling the underlying RDS.describeDBClusterSnapshotsoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBClusterSnapshotDeleted", callback?: (err: AWSError, data: RDS.Types.DBClusterSnapshotMessage) => void): Request<RDS.Types.DBClusterSnapshotMessage, AWSError>;
  /**
   * Waits for the dBClusterAvailable state by periodically calling the underlying RDS.describeDBClustersoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBClusterAvailable", params: RDS.Types.DescribeDBClustersMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: RDS.Types.DBClusterMessage) => void): Request<RDS.Types.DBClusterMessage, AWSError>;
  /**
   * Waits for the dBClusterAvailable state by periodically calling the underlying RDS.describeDBClustersoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBClusterAvailable", callback?: (err: AWSError, data: RDS.Types.DBClusterMessage) => void): Request<RDS.Types.DBClusterMessage, AWSError>;
  /**
   * Waits for the dBClusterDeleted state by periodically calling the underlying RDS.describeDBClustersoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBClusterDeleted", params: RDS.Types.DescribeDBClustersMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: RDS.Types.DBClusterMessage) => void): Request<RDS.Types.DBClusterMessage, AWSError>;
  /**
   * Waits for the dBClusterDeleted state by periodically calling the underlying RDS.describeDBClustersoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "dBClusterDeleted", callback?: (err: AWSError, data: RDS.Types.DBClusterMessage) => void): Request<RDS.Types.DBClusterMessage, AWSError>;
}
declare namespace RDS {
  export import Signer = signer;
}
declare namespace RDS {
  export interface AccountAttributesMessage {
    /**
     * A list of AccountQuota objects. Within this list, each quota has a name, a count of usage toward the quota maximum, and a maximum value for the quota.
     */
    AccountQuotas?: AccountQuotaList;
  }
  export interface AccountQuota {
    /**
     * The name of the Amazon RDS quota for this Amazon Web Services account.
     */
    AccountQuotaName?: String;
    /**
     * The amount currently used toward the quota maximum.
     */
    Used?: Long;
    /**
     * The maximum allowed value for the quota.
     */
    Max?: Long;
  }
  export type AccountQuotaList = AccountQuota[];
  export type ActivityStreamMode = "sync"|"async"|string;
  export type ActivityStreamModeList = String[];
  export type ActivityStreamPolicyStatus = "locked"|"unlocked"|"locking-policy"|"unlocking-policy"|string;
  export type ActivityStreamStatus = "stopped"|"starting"|"started"|"stopping"|string;
  export interface AddRoleToDBClusterMessage {
    /**
     * The name of the DB cluster to associate the IAM role with.
     */
    DBClusterIdentifier: String;
    /**
     * The Amazon Resource Name (ARN) of the IAM role to associate with the Aurora DB cluster, for example arn:aws:iam::123456789012:role/AuroraAccessRole.
     */
    RoleArn: String;
    /**
     * The name of the feature for the DB cluster that the IAM role is to be associated with. For information about supported feature names, see DBEngineVersion.
     */
    FeatureName?: String;
  }
  export interface AddRoleToDBInstanceMessage {
    /**
     * The name of the DB instance to associate the IAM role with.
     */
    DBInstanceIdentifier: String;
    /**
     * The Amazon Resource Name (ARN) of the IAM role to associate with the DB instance, for example arn:aws:iam::123456789012:role/AccessRole.
     */
    RoleArn: String;
    /**
     * The name of the feature for the DB instance that the IAM role is to be associated with. For information about supported feature names, see DBEngineVersion.
     */
    FeatureName: String;
  }
  export interface AddSourceIdentifierToSubscriptionMessage {
    /**
     * The name of the RDS event notification subscription you want to add a source identifier to.
     */
    SubscriptionName: String;
    /**
     * The identifier of the event source to be added. Constraints:   If the source type is a DB instance, a DBInstanceIdentifier value must be supplied.   If the source type is a DB cluster, a DBClusterIdentifier value must be supplied.   If the source type is a DB parameter group, a DBParameterGroupName value must be supplied.   If the source type is a DB security group, a DBSecurityGroupName value must be supplied.   If the source type is a DB snapshot, a DBSnapshotIdentifier value must be supplied.   If the source type is a DB cluster snapshot, a DBClusterSnapshotIdentifier value must be supplied.   If the source type is an RDS Proxy, a DBProxyName value must be supplied.  
     */
    SourceIdentifier: String;
  }
  export interface AddSourceIdentifierToSubscriptionResult {
    EventSubscription?: EventSubscription;
  }
  export interface AddTagsToResourceMessage {
    /**
     * The Amazon RDS resource that the tags are added to. This value is an Amazon Resource Name (ARN). For information about creating an ARN, see  Constructing an RDS Amazon Resource Name (ARN).
     */
    ResourceName: String;
    /**
     * The tags to be assigned to the Amazon RDS resource.
     */
    Tags: TagList;
  }
  export type ApplyMethod = "immediate"|"pending-reboot"|string;
  export interface ApplyPendingMaintenanceActionMessage {
    /**
     * The RDS Amazon Resource Name (ARN) of the resource that the pending maintenance action applies to. For information about creating an ARN, see  Constructing an RDS Amazon Resource Name (ARN).
     */
    ResourceIdentifier: String;
    /**
     * The pending maintenance action to apply to this resource. Valid Values: system-update, db-upgrade, hardware-maintenance, ca-certificate-rotation 
     */
    ApplyAction: String;
    /**
     * A value that specifies the type of opt-in request, or undoes an opt-in request. An opt-in request of type immediate can't be undone. Valid Values:    immediate - Apply the maintenance action immediately.    next-maintenance - Apply the maintenance action during the next maintenance window for the resource.    undo-opt-in - Cancel any existing next-maintenance opt-in requests.  
     */
    OptInType: String;
  }
  export interface ApplyPendingMaintenanceActionResult {
    ResourcePendingMaintenanceActions?: ResourcePendingMaintenanceActions;
  }
  export type AttributeValueList = String[];
  export type AuditPolicyState = "locked"|"unlocked"|string;
  export type AuthScheme = "SECRETS"|string;
  export interface AuthorizeDBSecurityGroupIngressMessage {
    /**
     * The name of the DB security group to add authorization to.
     */
    DBSecurityGroupName: String;
    /**
     * The IP range to authorize.
     */
    CIDRIP?: String;
    /**
     * Name of the EC2 security group to authorize. For VPC DB security groups, EC2SecurityGroupId must be provided. Otherwise, EC2SecurityGroupOwnerId and either EC2SecurityGroupName or EC2SecurityGroupId must be provided.
     */
    EC2SecurityGroupName?: String;
    /**
     * Id of the EC2 security group to authorize. For VPC DB security groups, EC2SecurityGroupId must be provided. Otherwise, EC2SecurityGroupOwnerId and either EC2SecurityGroupName or EC2SecurityGroupId must be provided.
     */
    EC2SecurityGroupId?: String;
    /**
     * Amazon Web Services account number of the owner of the EC2 security group specified in the EC2SecurityGroupName parameter. The Amazon Web Services access key ID isn't an acceptable value. For VPC DB security groups, EC2SecurityGroupId must be provided. Otherwise, EC2SecurityGroupOwnerId and either EC2SecurityGroupName or EC2SecurityGroupId must be provided.
     */
    EC2SecurityGroupOwnerId?: String;
  }
  export interface AuthorizeDBSecurityGroupIngressResult {
    DBSecurityGroup?: DBSecurityGroup;
  }
  export type AutomationMode = "full"|"all-paused"|string;
  export interface AvailabilityZone {
    /**
     * The name of the Availability Zone.
     */
    Name?: String;
  }
  export type AvailabilityZoneList = AvailabilityZone[];
  export type AvailabilityZones = String[];
  export interface AvailableProcessorFeature {
    /**
     * The name of the processor feature. Valid names are coreCount and threadsPerCore.
     */
    Name?: String;
    /**
     * The default value for the processor feature of the DB instance class.
     */
    DefaultValue?: String;
    /**
     * The allowed values for the processor feature of the DB instance class.
     */
    AllowedValues?: String;
  }
  export type AvailableProcessorFeatureList = AvailableProcessorFeature[];
  export type AwsBackupRecoveryPointArn = string;
  export interface BacktrackDBClusterMessage {
    /**
     * The DB cluster identifier of the DB cluster to be backtracked. This parameter is stored as a lowercase string. Constraints:   Must contain from 1 to 63 alphanumeric characters or hyphens.   First character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.   Example: my-cluster1 
     */
    DBClusterIdentifier: String;
    /**
     * The timestamp of the time to backtrack the DB cluster to, specified in ISO 8601 format. For more information about ISO 8601, see the ISO8601 Wikipedia page.   If the specified time isn't a consistent time for the DB cluster, Aurora automatically chooses the nearest possible consistent time for the DB cluster.  Constraints:   Must contain a valid ISO 8601 timestamp.   Can't contain a timestamp set in the future.   Example: 2017-07-08T18:00Z 
     */
    BacktrackTo: TStamp;
    /**
     * Specifies whether to force the DB cluster to backtrack when binary logging is enabled. Otherwise, an error occurs when binary logging is enabled.
     */
    Force?: BooleanOptional;
    /**
     * Specifies whether to backtrack the DB cluster to the earliest possible backtrack time when BacktrackTo is set to a timestamp earlier than the earliest backtrack time. When this parameter is disabled and BacktrackTo is set to a timestamp earlier than the earliest backtrack time, an error occurs.
     */
    UseEarliestTimeOnPointInTimeUnavailable?: BooleanOptional;
  }
  export interface BlueGreenDeployment {
    /**
     * The unique identifier of the blue/green deployment.
     */
    BlueGreenDeploymentIdentifier?: BlueGreenDeploymentIdentifier;
    /**
     * The user-supplied name of the blue/green deployment.
     */
    BlueGreenDeploymentName?: BlueGreenDeploymentName;
    /**
     * The source database for the blue/green deployment. Before switchover, the source database is the production database in the blue environment.
     */
    Source?: DatabaseArn;
    /**
     * The target database for the blue/green deployment. Before switchover, the target database is the clone database in the green environment.
     */
    Target?: DatabaseArn;
    /**
     * The details about each source and target resource in the blue/green deployment.
     */
    SwitchoverDetails?: SwitchoverDetailList;
    /**
     * Either tasks to be performed or tasks that have been completed on the target database before switchover.
     */
    Tasks?: BlueGreenDeploymentTaskList;
    /**
     * The status of the blue/green deployment. Valid Values:    PROVISIONING - Resources are being created in the green environment.    AVAILABLE - Resources are available in the green environment.    SWITCHOVER_IN_PROGRESS - The deployment is being switched from the blue environment to the green environment.    SWITCHOVER_COMPLETED - Switchover from the blue environment to the green environment is complete.    INVALID_CONFIGURATION - Resources in the green environment are invalid, so switchover isn't possible.    SWITCHOVER_FAILED - Switchover was attempted but failed.    DELETING - The blue/green deployment is being deleted.  
     */
    Status?: BlueGreenDeploymentStatus;
    /**
     * Additional information about the status of the blue/green deployment.
     */
    StatusDetails?: BlueGreenDeploymentStatusDetails;
    /**
     * The time when the blue/green deployment was created, in Universal Coordinated Time (UTC).
     */
    CreateTime?: TStamp;
    /**
     * The time when the blue/green deployment was deleted, in Universal Coordinated Time (UTC).
     */
    DeleteTime?: TStamp;
    TagList?: TagList;
  }
  export type BlueGreenDeploymentIdentifier = string;
  export type BlueGreenDeploymentList = BlueGreenDeployment[];
  export type BlueGreenDeploymentName = string;
  export type BlueGreenDeploymentStatus = string;
  export type BlueGreenDeploymentStatusDetails = string;
  export interface BlueGreenDeploymentTask {
    /**
     * The name of the blue/green deployment task.
     */
    Name?: BlueGreenDeploymentTaskName;
    /**
     * The status of the blue/green deployment task. Valid Values:    PENDING - The resource is being prepared for deployment.    IN_PROGRESS - The resource is being deployed.    COMPLETED - The resource has been deployed.    FAILED - Deployment of the resource failed.  
     */
    Status?: BlueGreenDeploymentTaskStatus;
  }
  export type BlueGreenDeploymentTaskList = BlueGreenDeploymentTask[];
  export type BlueGreenDeploymentTaskName = string;
  export type BlueGreenDeploymentTaskStatus = string;
  export type Boolean = boolean;
  export type BooleanOptional = boolean;
  export type BucketName = string;
  export type CACertificateIdentifiersList = String[];
  export interface CancelExportTaskMessage {
    /**
     * The identifier of the snapshot or cluster export task to cancel.
     */
    ExportTaskIdentifier: String;
  }
  export interface Certificate {
    /**
     * The unique key that identifies a certificate.
     */
    CertificateIdentifier?: String;
    /**
     * The type of the certificate.
     */
    CertificateType?: String;
    /**
     * The thumbprint of the certificate.
     */
    Thumbprint?: String;
    /**
     * The starting date from which the certificate is valid.
     */
    ValidFrom?: TStamp;
    /**
     * The final date that the certificate continues to be valid.
     */
    ValidTill?: TStamp;
    /**
     * The Amazon Resource Name (ARN) for the certificate.
     */
    CertificateArn?: String;
    /**
     * Indicates whether there is an override for the default certificate identifier.
     */
    CustomerOverride?: BooleanOptional;
    /**
     * If there is an override for the default certificate identifier, when the override expires.
     */
    CustomerOverrideValidTill?: TStamp;
  }
  export interface CertificateDetails {
    /**
     * The CA identifier of the CA certificate used for the DB instance's server certificate.
     */
    CAIdentifier?: String;
    /**
     * The expiration date of the DB instance’s server certificate.
     */
    ValidTill?: TStamp;
  }
  export type CertificateList = Certificate[];
  export interface CertificateMessage {
    /**
     * The default root CA for new databases created by your Amazon Web Services account. This is either the root CA override set on your Amazon Web Services account or the system default CA for the Region if no override exists. To override the default CA, use the ModifyCertificates operation.
     */
    DefaultCertificateForNewLaunches?: String;
    /**
     * The list of Certificate objects for the Amazon Web Services account.
     */
    Certificates?: CertificateList;
    /**
     * An optional pagination token provided by a previous DescribeCertificates request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords .
     */
    Marker?: String;
  }
  export interface CharacterSet {
    /**
     * The name of the character set.
     */
    CharacterSetName?: String;
    /**
     * The description of the character set.
     */
    CharacterSetDescription?: String;
  }
  export type ClientPasswordAuthType = "MYSQL_NATIVE_PASSWORD"|"POSTGRES_SCRAM_SHA_256"|"POSTGRES_MD5"|"SQL_SERVER_AUTHENTICATION"|string;
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
  export interface ClusterPendingModifiedValues {
    PendingCloudwatchLogsExports?: PendingCloudwatchLogsExports;
    /**
     * The DBClusterIdentifier value for the DB cluster.
     */
    DBClusterIdentifier?: String;
    /**
     * The master credentials for the DB cluster.
     */
    MasterUserPassword?: String;
    /**
     * Indicates whether mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts is enabled.
     */
    IAMDatabaseAuthenticationEnabled?: BooleanOptional;
    /**
     * The database engine version.
     */
    EngineVersion?: String;
    /**
     * The number of days for which automatic DB snapshots are retained.
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * The allocated storage size in gibibytes (GiB) for all database engines except Amazon Aurora. For Aurora, AllocatedStorage always returns 1, because Aurora DB cluster storage size isn't fixed, but instead automatically adjusts as needed.
     */
    AllocatedStorage?: IntegerOptional;
    /**
     * The Provisioned IOPS (I/O operations per second) value. This setting is only for non-Aurora Multi-AZ DB clusters.
     */
    Iops?: IntegerOptional;
    /**
     * The storage type for the DB cluster.
     */
    StorageType?: String;
  }
  export interface ConnectionPoolConfiguration {
    /**
     * The maximum size of the connection pool for each target in a target group. The value is expressed as a percentage of the max_connections setting for the RDS DB instance or Aurora DB cluster used by the target group. If you specify MaxIdleConnectionsPercent, then you must also include a value for this parameter. Default: 10 for RDS for Microsoft SQL Server, and 100 for all other engines Constraints:   Must be between 1 and 100.  
     */
    MaxConnectionsPercent?: IntegerOptional;
    /**
     * A value that controls how actively the proxy closes idle database connections in the connection pool. The value is expressed as a percentage of the max_connections setting for the RDS DB instance or Aurora DB cluster used by the target group. With a high value, the proxy leaves a high percentage of idle database connections open. A low value causes the proxy to close more idle connections and return them to the database. If you specify this parameter, then you must also include a value for MaxConnectionsPercent. Default: The default value is half of the value of MaxConnectionsPercent. For example, if MaxConnectionsPercent is 80, then the default value of MaxIdleConnectionsPercent is 40. If the value of MaxConnectionsPercent isn't specified, then for SQL Server, MaxIdleConnectionsPercent is 5, and for all other engines, the default is 50. Constraints:   Must be between 0 and the value of MaxConnectionsPercent.  
     */
    MaxIdleConnectionsPercent?: IntegerOptional;
    /**
     * The number of seconds for a proxy to wait for a connection to become available in the connection pool. This setting only applies when the proxy has opened its maximum number of connections and all connections are busy with client sessions. For an unlimited wait time, specify 0. Default: 120  Constraints:   Must be between 0 and 3600.  
     */
    ConnectionBorrowTimeout?: IntegerOptional;
    /**
     * Each item in the list represents a class of SQL operations that normally cause all later statements in a session using a proxy to be pinned to the same underlying database connection. Including an item in the list exempts that class of SQL operations from the pinning behavior. Default: no session pinning filters
     */
    SessionPinningFilters?: StringList;
    /**
     * One or more SQL statements for the proxy to run when opening each new database connection. Typically used with SET statements to make sure that each connection has identical settings such as time zone and character set. For multiple statements, use semicolons as the separator. You can also include multiple variables in a single SET statement, such as SET x=1, y=2. Default: no initialization query
     */
    InitQuery?: String;
  }
  export interface ConnectionPoolConfigurationInfo {
    /**
     * The maximum size of the connection pool for each target in a target group. The value is expressed as a percentage of the max_connections setting for the RDS DB instance or Aurora DB cluster used by the target group.
     */
    MaxConnectionsPercent?: Integer;
    /**
     * Controls how actively the proxy closes idle database connections in the connection pool. The value is expressed as a percentage of the max_connections setting for the RDS DB instance or Aurora DB cluster used by the target group. With a high value, the proxy leaves a high percentage of idle database connections open. A low value causes the proxy to close more idle connections and return them to the database.
     */
    MaxIdleConnectionsPercent?: Integer;
    /**
     * The number of seconds for a proxy to wait for a connection to become available in the connection pool. Only applies when the proxy has opened its maximum number of connections and all connections are busy with client sessions.
     */
    ConnectionBorrowTimeout?: Integer;
    /**
     * Each item in the list represents a class of SQL operations that normally cause all later statements in a session using a proxy to be pinned to the same underlying database connection. Including an item in the list exempts that class of SQL operations from the pinning behavior. This setting is only supported for MySQL engine family databases. Currently, the only allowed value is EXCLUDE_VARIABLE_SETS.
     */
    SessionPinningFilters?: StringList;
    /**
     * One or more SQL statements for the proxy to run when opening each new database connection. Typically used with SET statements to make sure that each connection has identical settings such as time zone and character set. This setting is empty by default. For multiple statements, use semicolons as the separator. You can also include multiple variables in a single SET statement, such as SET x=1, y=2.
     */
    InitQuery?: String;
  }
  export interface CopyDBClusterParameterGroupMessage {
    /**
     * The identifier or Amazon Resource Name (ARN) for the source DB cluster parameter group. For information about creating an ARN, see  Constructing an ARN for Amazon RDS in the Amazon Aurora User Guide. Constraints:   Must specify a valid DB cluster parameter group.  
     */
    SourceDBClusterParameterGroupIdentifier: String;
    /**
     * The identifier for the copied DB cluster parameter group. Constraints:   Can't be null, empty, or blank   Must contain from 1 to 255 letters, numbers, or hyphens   First character must be a letter   Can't end with a hyphen or contain two consecutive hyphens   Example: my-cluster-param-group1 
     */
    TargetDBClusterParameterGroupIdentifier: String;
    /**
     * A description for the copied DB cluster parameter group.
     */
    TargetDBClusterParameterGroupDescription: String;
    Tags?: TagList;
  }
  export interface CopyDBClusterParameterGroupResult {
    DBClusterParameterGroup?: DBClusterParameterGroup;
  }
  export interface CopyDBClusterSnapshotMessage {
    /**
     * The identifier of the DB cluster snapshot to copy. This parameter isn't case-sensitive. You can't copy an encrypted, shared DB cluster snapshot from one Amazon Web Services Region to another. Constraints:   Must specify a valid system snapshot in the "available" state.   If the source snapshot is in the same Amazon Web Services Region as the copy, specify a valid DB snapshot identifier.   If the source snapshot is in a different Amazon Web Services Region than the copy, specify a valid DB cluster snapshot ARN. For more information, go to  Copying Snapshots Across Amazon Web Services Regions in the Amazon Aurora User Guide.   Example: my-cluster-snapshot1 
     */
    SourceDBClusterSnapshotIdentifier: String;
    /**
     * The identifier of the new DB cluster snapshot to create from the source DB cluster snapshot. This parameter isn't case-sensitive. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   First character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.   Example: my-cluster-snapshot2 
     */
    TargetDBClusterSnapshotIdentifier: String;
    /**
     * The Amazon Web Services KMS key identifier for an encrypted DB cluster snapshot. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the Amazon Web Services KMS key. If you copy an encrypted DB cluster snapshot from your Amazon Web Services account, you can specify a value for KmsKeyId to encrypt the copy with a new KMS key. If you don't specify a value for KmsKeyId, then the copy of the DB cluster snapshot is encrypted with the same KMS key as the source DB cluster snapshot. If you copy an encrypted DB cluster snapshot that is shared from another Amazon Web Services account, then you must specify a value for KmsKeyId. To copy an encrypted DB cluster snapshot to another Amazon Web Services Region, you must set KmsKeyId to the Amazon Web Services KMS key identifier you want to use to encrypt the copy of the DB cluster snapshot in the destination Amazon Web Services Region. KMS keys are specific to the Amazon Web Services Region that they are created in, and you can't use KMS keys from one Amazon Web Services Region in another Amazon Web Services Region. If you copy an unencrypted DB cluster snapshot and specify a value for the KmsKeyId parameter, an error is returned.
     */
    KmsKeyId?: String;
    /**
     * When you are copying a DB cluster snapshot from one Amazon Web Services GovCloud (US) Region to another, the URL that contains a Signature Version 4 signed request for the CopyDBClusterSnapshot API operation in the Amazon Web Services Region that contains the source DB cluster snapshot to copy. Use the PreSignedUrl parameter when copying an encrypted DB cluster snapshot from another Amazon Web Services Region. Don't specify PreSignedUrl when copying an encrypted DB cluster snapshot in the same Amazon Web Services Region. This setting applies only to Amazon Web Services GovCloud (US) Regions. It's ignored in other Amazon Web Services Regions. The presigned URL must be a valid request for the CopyDBClusterSnapshot API operation that can run in the source Amazon Web Services Region that contains the encrypted DB cluster snapshot to copy. The presigned URL request must contain the following parameter values:    KmsKeyId - The KMS key identifier for the KMS key to use to encrypt the copy of the DB cluster snapshot in the destination Amazon Web Services Region. This is the same identifier for both the CopyDBClusterSnapshot operation that is called in the destination Amazon Web Services Region, and the operation contained in the presigned URL.    DestinationRegion - The name of the Amazon Web Services Region that the DB cluster snapshot is to be created in.    SourceDBClusterSnapshotIdentifier - The DB cluster snapshot identifier for the encrypted DB cluster snapshot to be copied. This identifier must be in the Amazon Resource Name (ARN) format for the source Amazon Web Services Region. For example, if you are copying an encrypted DB cluster snapshot from the us-west-2 Amazon Web Services Region, then your SourceDBClusterSnapshotIdentifier looks like the following example: arn:aws:rds:us-west-2:123456789012:cluster-snapshot:aurora-cluster1-snapshot-20161115.   To learn how to generate a Signature Version 4 signed request, see  Authenticating Requests: Using Query Parameters (Amazon Web Services Signature Version 4) and  Signature Version 4 Signing Process.  If you are using an Amazon Web Services SDK tool or the CLI, you can specify SourceRegion (or --source-region for the CLI) instead of specifying PreSignedUrl manually. Specifying SourceRegion autogenerates a presigned URL that is a valid request for the operation that can run in the source Amazon Web Services Region. If you supply a value for this operation's SourceRegion parameter, a pre-signed URL will be calculated on your behalf.
     */
    PreSignedUrl?: String;
    /**
     * Specifies whether to copy all tags from the source DB cluster snapshot to the target DB cluster snapshot. By default, tags are not copied.
     */
    CopyTags?: BooleanOptional;
    Tags?: TagList;
    /**
     * The ID of the region that contains the snapshot to be copied.
     */
    SourceRegion?: String;
  }
  export interface CopyDBClusterSnapshotResult {
    DBClusterSnapshot?: DBClusterSnapshot;
  }
  export interface CopyDBParameterGroupMessage {
    /**
     * The identifier or ARN for the source DB parameter group. For information about creating an ARN, see  Constructing an ARN for Amazon RDS in the Amazon RDS User Guide. Constraints:   Must specify a valid DB parameter group.  
     */
    SourceDBParameterGroupIdentifier: String;
    /**
     * The identifier for the copied DB parameter group. Constraints:   Can't be null, empty, or blank   Must contain from 1 to 255 letters, numbers, or hyphens   First character must be a letter   Can't end with a hyphen or contain two consecutive hyphens   Example: my-db-parameter-group 
     */
    TargetDBParameterGroupIdentifier: String;
    /**
     * A description for the copied DB parameter group.
     */
    TargetDBParameterGroupDescription: String;
    Tags?: TagList;
  }
  export interface CopyDBParameterGroupResult {
    DBParameterGroup?: DBParameterGroup;
  }
  export interface CopyDBSnapshotMessage {
    /**
     * The identifier for the source DB snapshot. If the source snapshot is in the same Amazon Web Services Region as the copy, specify a valid DB snapshot identifier. For example, you might specify rds:mysql-instance1-snapshot-20130805. If the source snapshot is in a different Amazon Web Services Region than the copy, specify a valid DB snapshot ARN. For example, you might specify arn:aws:rds:us-west-2:123456789012:snapshot:mysql-instance1-snapshot-20130805. If you are copying from a shared manual DB snapshot, this parameter must be the Amazon Resource Name (ARN) of the shared DB snapshot. If you are copying an encrypted snapshot this parameter must be in the ARN format for the source Amazon Web Services Region. Constraints:   Must specify a valid system snapshot in the "available" state.   Example: rds:mydb-2012-04-02-00-01  Example: arn:aws:rds:us-west-2:123456789012:snapshot:mysql-instance1-snapshot-20130805 
     */
    SourceDBSnapshotIdentifier: String;
    /**
     * The identifier for the copy of the snapshot. Constraints:   Can't be null, empty, or blank   Must contain from 1 to 255 letters, numbers, or hyphens   First character must be a letter   Can't end with a hyphen or contain two consecutive hyphens   Example: my-db-snapshot 
     */
    TargetDBSnapshotIdentifier: String;
    /**
     * The Amazon Web Services KMS key identifier for an encrypted DB snapshot. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. If you copy an encrypted DB snapshot from your Amazon Web Services account, you can specify a value for this parameter to encrypt the copy with a new KMS key. If you don't specify a value for this parameter, then the copy of the DB snapshot is encrypted with the same Amazon Web Services KMS key as the source DB snapshot. If you copy an encrypted DB snapshot that is shared from another Amazon Web Services account, then you must specify a value for this parameter. If you specify this parameter when you copy an unencrypted snapshot, the copy is encrypted. If you copy an encrypted snapshot to a different Amazon Web Services Region, then you must specify an Amazon Web Services KMS key identifier for the destination Amazon Web Services Region. KMS keys are specific to the Amazon Web Services Region that they are created in, and you can't use KMS keys from one Amazon Web Services Region in another Amazon Web Services Region.
     */
    KmsKeyId?: String;
    Tags?: TagList;
    /**
     * Specifies whether to copy all tags from the source DB snapshot to the target DB snapshot. By default, tags aren't copied.
     */
    CopyTags?: BooleanOptional;
    /**
     * When you are copying a snapshot from one Amazon Web Services GovCloud (US) Region to another, the URL that contains a Signature Version 4 signed request for the CopyDBSnapshot API operation in the source Amazon Web Services Region that contains the source DB snapshot to copy. This setting applies only to Amazon Web Services GovCloud (US) Regions. It's ignored in other Amazon Web Services Regions. You must specify this parameter when you copy an encrypted DB snapshot from another Amazon Web Services Region by using the Amazon RDS API. Don't specify PreSignedUrl when you are copying an encrypted DB snapshot in the same Amazon Web Services Region. The presigned URL must be a valid request for the CopyDBClusterSnapshot API operation that can run in the source Amazon Web Services Region that contains the encrypted DB cluster snapshot to copy. The presigned URL request must contain the following parameter values:    DestinationRegion - The Amazon Web Services Region that the encrypted DB snapshot is copied to. This Amazon Web Services Region is the same one where the CopyDBSnapshot operation is called that contains this presigned URL. For example, if you copy an encrypted DB snapshot from the us-west-2 Amazon Web Services Region to the us-east-1 Amazon Web Services Region, then you call the CopyDBSnapshot operation in the us-east-1 Amazon Web Services Region and provide a presigned URL that contains a call to the CopyDBSnapshot operation in the us-west-2 Amazon Web Services Region. For this example, the DestinationRegion in the presigned URL must be set to the us-east-1 Amazon Web Services Region.    KmsKeyId - The KMS key identifier for the KMS key to use to encrypt the copy of the DB snapshot in the destination Amazon Web Services Region. This is the same identifier for both the CopyDBSnapshot operation that is called in the destination Amazon Web Services Region, and the operation contained in the presigned URL.    SourceDBSnapshotIdentifier - The DB snapshot identifier for the encrypted snapshot to be copied. This identifier must be in the Amazon Resource Name (ARN) format for the source Amazon Web Services Region. For example, if you are copying an encrypted DB snapshot from the us-west-2 Amazon Web Services Region, then your SourceDBSnapshotIdentifier looks like the following example: arn:aws:rds:us-west-2:123456789012:snapshot:mysql-instance1-snapshot-20161115.   To learn how to generate a Signature Version 4 signed request, see Authenticating Requests: Using Query Parameters (Amazon Web Services Signature Version 4) and Signature Version 4 Signing Process.  If you are using an Amazon Web Services SDK tool or the CLI, you can specify SourceRegion (or --source-region for the CLI) instead of specifying PreSignedUrl manually. Specifying SourceRegion autogenerates a presigned URL that is a valid request for the operation that can run in the source Amazon Web Services Region. If you supply a value for this operation's SourceRegion parameter, a pre-signed URL will be calculated on your behalf.
     */
    PreSignedUrl?: String;
    /**
     * The name of an option group to associate with the copy of the snapshot. Specify this option if you are copying a snapshot from one Amazon Web Services Region to another, and your DB instance uses a nondefault option group. If your source DB instance uses Transparent Data Encryption for Oracle or Microsoft SQL Server, you must specify this option when copying across Amazon Web Services Regions. For more information, see Option group considerations in the Amazon RDS User Guide.
     */
    OptionGroupName?: String;
    /**
     * The external custom Availability Zone (CAZ) identifier for the target CAZ. Example: rds-caz-aiqhTgQv.
     */
    TargetCustomAvailabilityZone?: String;
    /**
     * Specifies whether to copy the DB option group associated with the source DB snapshot to the target Amazon Web Services account and associate with the target DB snapshot. The associated option group can be copied only with cross-account snapshot copy calls.
     */
    CopyOptionGroup?: BooleanOptional;
    /**
     * The ID of the region that contains the snapshot to be copied.
     */
    SourceRegion?: String;
  }
  export interface CopyDBSnapshotResult {
    DBSnapshot?: DBSnapshot;
  }
  export interface CopyOptionGroupMessage {
    /**
     * The identifier for the source option group. Constraints:   Must specify a valid option group.  
     */
    SourceOptionGroupIdentifier: String;
    /**
     * The identifier for the copied option group. Constraints:   Can't be null, empty, or blank   Must contain from 1 to 255 letters, numbers, or hyphens   First character must be a letter   Can't end with a hyphen or contain two consecutive hyphens   Example: my-option-group 
     */
    TargetOptionGroupIdentifier: String;
    /**
     * The description for the copied option group.
     */
    TargetOptionGroupDescription: String;
    Tags?: TagList;
  }
  export interface CopyOptionGroupResult {
    OptionGroup?: OptionGroup;
  }
  export interface CreateBlueGreenDeploymentRequest {
    /**
     * The name of the blue/green deployment. Constraints:   Can't be the same as an existing blue/green deployment name in the same account and Amazon Web Services Region.  
     */
    BlueGreenDeploymentName: BlueGreenDeploymentName;
    /**
     * The Amazon Resource Name (ARN) of the source production database. Specify the database that you want to clone. The blue/green deployment creates this database in the green environment. You can make updates to the database in the green environment, such as an engine version upgrade. When you are ready, you can switch the database in the green environment to be the production database.
     */
    Source: DatabaseArn;
    /**
     * The engine version of the database in the green environment. Specify the engine version to upgrade to in the green environment.
     */
    TargetEngineVersion?: TargetEngineVersion;
    /**
     * The DB parameter group associated with the DB instance in the green environment. To test parameter changes, specify a DB parameter group that is different from the one associated with the source DB instance.
     */
    TargetDBParameterGroupName?: TargetDBParameterGroupName;
    /**
     * The DB cluster parameter group associated with the Aurora DB cluster in the green environment. To test parameter changes, specify a DB cluster parameter group that is different from the one associated with the source DB cluster.
     */
    TargetDBClusterParameterGroupName?: TargetDBClusterParameterGroupName;
    /**
     * Tags to assign to the blue/green deployment.
     */
    Tags?: TagList;
  }
  export interface CreateBlueGreenDeploymentResponse {
    BlueGreenDeployment?: BlueGreenDeployment;
  }
  export interface CreateCustomDBEngineVersionMessage {
    /**
     * The database engine to use for your custom engine version (CEV). The only supported value is custom-oracle-ee.
     */
    Engine: CustomEngineName;
    /**
     * The name of your CEV. The name format is 19.customized_string. For example, a valid CEV name is 19.my_cev1. This setting is required for RDS Custom for Oracle, but optional for Amazon RDS. The combination of Engine and EngineVersion is unique per customer per Region.
     */
    EngineVersion: CustomEngineVersion;
    /**
     * The name of an Amazon S3 bucket that contains database installation files for your CEV. For example, a valid bucket name is my-custom-installation-files.
     */
    DatabaseInstallationFilesS3BucketName?: BucketName;
    /**
     * The Amazon S3 directory that contains the database installation files for your CEV. For example, a valid bucket name is 123456789012/cev1. If this setting isn't specified, no prefix is assumed.
     */
    DatabaseInstallationFilesS3Prefix?: String255;
    /**
     * The ID of the Amazon Machine Image (AMI). For RDS Custom for SQL Server, an AMI ID is required to create a CEV. For RDS Custom for Oracle, the default is the most recent AMI available, but you can specify an AMI ID that was used in a different Oracle CEV. Find the AMIs used by your CEVs by calling the DescribeDBEngineVersions operation.
     */
    ImageId?: String255;
    /**
     * The Amazon Web Services KMS key identifier for an encrypted CEV. A symmetric encryption KMS key is required for RDS Custom, but optional for Amazon RDS. If you have an existing symmetric encryption KMS key in your account, you can use it with RDS Custom. No further action is necessary. If you don't already have a symmetric encryption KMS key in your account, follow the instructions in  Creating a symmetric encryption KMS key in the Amazon Web Services Key Management Service Developer Guide. You can choose the same symmetric encryption key when you create a CEV and a DB instance, or choose different keys.
     */
    KMSKeyId?: KmsKeyIdOrArn;
    /**
     * An optional description of your CEV.
     */
    Description?: Description;
    /**
     * The CEV manifest, which is a JSON document that describes the installation .zip files stored in Amazon S3. Specify the name/value pairs in a file or a quoted string. RDS Custom applies the patches in the order in which they are listed. The following JSON fields are valid:  MediaImportTemplateVersion  Version of the CEV manifest. The date is in the format YYYY-MM-DD.  databaseInstallationFileNames  Ordered list of installation files for the CEV.  opatchFileNames  Ordered list of OPatch installers used for the Oracle DB engine.  psuRuPatchFileNames  The PSU and RU patches for this CEV.  OtherPatchFileNames  The patches that are not in the list of PSU and RU patches. Amazon RDS applies these patches after applying the PSU and RU patches.   For more information, see  Creating the CEV manifest in the Amazon RDS User Guide.
     */
    Manifest?: CustomDBEngineVersionManifest;
    Tags?: TagList;
    /**
     * Reserved for future use.
     */
    SourceCustomDbEngineVersionIdentifier?: String255;
    /**
     * Reserved for future use.
     */
    UseAwsProvidedLatestImage?: BooleanOptional;
  }
  export interface CreateDBClusterEndpointMessage {
    /**
     * The DB cluster identifier of the DB cluster associated with the endpoint. This parameter is stored as a lowercase string.
     */
    DBClusterIdentifier: String;
    /**
     * The identifier to use for the new endpoint. This parameter is stored as a lowercase string.
     */
    DBClusterEndpointIdentifier: String;
    /**
     * The type of the endpoint, one of: READER, WRITER, ANY.
     */
    EndpointType: String;
    /**
     * List of DB instance identifiers that are part of the custom endpoint group.
     */
    StaticMembers?: StringList;
    /**
     * List of DB instance identifiers that aren't part of the custom endpoint group. All other eligible instances are reachable through the custom endpoint. This parameter is relevant only if the list of static members is empty.
     */
    ExcludedMembers?: StringList;
    /**
     * The tags to be assigned to the Amazon RDS resource.
     */
    Tags?: TagList;
  }
  export interface CreateDBClusterMessage {
    /**
     * A list of Availability Zones (AZs) where DB instances in the DB cluster can be created. For information on Amazon Web Services Regions and Availability Zones, see Choosing the Regions and Availability Zones in the Amazon Aurora User Guide. Valid for Cluster Type: Aurora DB clusters only
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * The number of days for which automated backups are retained. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Default: 1  Constraints:   Must be a value from 1 to 35.  
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * The name of the character set (CharacterSet) to associate the DB cluster with. Valid for Cluster Type: Aurora DB clusters only
     */
    CharacterSetName?: String;
    /**
     * The name for your database of up to 64 alphanumeric characters. If you don't provide a name, Amazon RDS doesn't create a database in the DB cluster you are creating. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    DatabaseName?: String;
    /**
     * The identifier for this DB cluster. This parameter is stored as a lowercase string. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   First character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.   Example: my-cluster1 
     */
    DBClusterIdentifier: String;
    /**
     * The name of the DB cluster parameter group to associate with this DB cluster. If you don't specify a value, then the default DB cluster parameter group for the specified DB engine and version is used. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Constraints:   If supplied, must match the name of an existing DB cluster parameter group.  
     */
    DBClusterParameterGroupName?: String;
    /**
     * A list of EC2 VPC security groups to associate with this DB cluster. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * A DB subnet group to associate with this DB cluster. This setting is required to create a Multi-AZ DB cluster. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Constraints:   Must match the name of an existing DB subnet group.   Must not be default.   Example: mydbsubnetgroup 
     */
    DBSubnetGroupName?: String;
    /**
     * The database engine to use for this DB cluster. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Valid Values: aurora-mysql | aurora-postgresql | mysql | postgres 
     */
    Engine: String;
    /**
     * The version number of the database engine to use. To list all of the available engine versions for Aurora MySQL version 2 (5.7-compatible) and version 3 (MySQL 8.0-compatible), use the following command:  aws rds describe-db-engine-versions --engine aurora-mysql --query "DBEngineVersions[].EngineVersion"  You can supply either 5.7 or 8.0 to use the default engine version for Aurora MySQL version 2 or version 3, respectively. To list all of the available engine versions for Aurora PostgreSQL, use the following command:  aws rds describe-db-engine-versions --engine aurora-postgresql --query "DBEngineVersions[].EngineVersion"  To list all of the available engine versions for RDS for MySQL, use the following command:  aws rds describe-db-engine-versions --engine mysql --query "DBEngineVersions[].EngineVersion"  To list all of the available engine versions for RDS for PostgreSQL, use the following command:  aws rds describe-db-engine-versions --engine postgres --query "DBEngineVersions[].EngineVersion"  For information about a specific engine, see the following topics:   Aurora MySQL - see Database engine updates for Amazon Aurora MySQL in the Amazon Aurora User Guide.   Aurora PostgreSQL - see Amazon Aurora PostgreSQL releases and engine versions in the Amazon Aurora User Guide.   RDS for MySQL - see Amazon RDS for MySQL in the Amazon RDS User Guide.   RDS for PostgreSQL - see Amazon RDS for PostgreSQL in the Amazon RDS User Guide.   Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    EngineVersion?: String;
    /**
     * The port number on which the instances in the DB cluster accept connections. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Valid Values: 1150-65535  Default:   RDS for MySQL and Aurora MySQL - 3306    RDS for PostgreSQL and Aurora PostgreSQL - 5432   
     */
    Port?: IntegerOptional;
    /**
     * The name of the master user for the DB cluster. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Constraints:   Must be 1 to 16 letters or numbers.   First character must be a letter.   Can't be a reserved word for the chosen database engine.  
     */
    MasterUsername?: String;
    /**
     * The password for the master database user. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Constraints:   Must contain from 8 to 41 characters.   Can contain any printable ASCII character except "/", """, or "@".   Can't be specified if ManageMasterUserPassword is turned on.  
     */
    MasterUserPassword?: String;
    /**
     * The option group to associate the DB cluster with. DB clusters are associated with a default option group that can't be modified.
     */
    OptionGroupName?: String;
    /**
     * The daily time range during which automated backups are created if automated backups are enabled using the BackupRetentionPeriod parameter. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters The default is a 30-minute window selected at random from an 8-hour block of time for each Amazon Web Services Region. To view the time blocks available, see  Backup window in the Amazon Aurora User Guide. Constraints:   Must be in the format hh24:mi-hh24:mi.   Must be in Universal Coordinated Time (UTC).   Must not conflict with the preferred maintenance window.   Must be at least 30 minutes.  
     */
    PreferredBackupWindow?: String;
    /**
     * The weekly time range during which system maintenance can occur. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters The default is a 30-minute window selected at random from an 8-hour block of time for each Amazon Web Services Region, occurring on a random day of the week. To see the time blocks available, see  Adjusting the Preferred DB Cluster Maintenance Window in the Amazon Aurora User Guide. Constraints:   Must be in the format ddd:hh24:mi-ddd:hh24:mi.   Days must be one of Mon | Tue | Wed | Thu | Fri | Sat | Sun.   Must be in Universal Coordinated Time (UTC).   Must be at least 30 minutes.  
     */
    PreferredMaintenanceWindow?: String;
    /**
     * The Amazon Resource Name (ARN) of the source DB instance or DB cluster if this DB cluster is created as a read replica. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    ReplicationSourceIdentifier?: String;
    /**
     * Tags to assign to the DB cluster. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    Tags?: TagList;
    /**
     * Specifies whether the DB cluster is encrypted. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    StorageEncrypted?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier for an encrypted DB cluster. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. To use a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN. When a KMS key isn't specified in KmsKeyId:   If ReplicationSourceIdentifier identifies an encrypted source, then Amazon RDS uses the KMS key used to encrypt the source. Otherwise, Amazon RDS uses your default KMS key.   If the StorageEncrypted parameter is enabled and ReplicationSourceIdentifier isn't specified, then Amazon RDS uses your default KMS key.   There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region. If you create a read replica of an encrypted DB cluster in another Amazon Web Services Region, make sure to set KmsKeyId to a KMS key identifier that is valid in the destination Amazon Web Services Region. This KMS key is used to encrypt the read replica in that Amazon Web Services Region. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    KmsKeyId?: String;
    /**
     * When you are replicating a DB cluster from one Amazon Web Services GovCloud (US) Region to another, an URL that contains a Signature Version 4 signed request for the CreateDBCluster operation to be called in the source Amazon Web Services Region where the DB cluster is replicated from. Specify PreSignedUrl only when you are performing cross-Region replication from an encrypted DB cluster. The presigned URL must be a valid request for the CreateDBCluster API operation that can run in the source Amazon Web Services Region that contains the encrypted DB cluster to copy. The presigned URL request must contain the following parameter values:    KmsKeyId - The KMS key identifier for the KMS key to use to encrypt the copy of the DB cluster in the destination Amazon Web Services Region. This should refer to the same KMS key for both the CreateDBCluster operation that is called in the destination Amazon Web Services Region, and the operation contained in the presigned URL.    DestinationRegion - The name of the Amazon Web Services Region that Aurora read replica will be created in.    ReplicationSourceIdentifier - The DB cluster identifier for the encrypted DB cluster to be copied. This identifier must be in the Amazon Resource Name (ARN) format for the source Amazon Web Services Region. For example, if you are copying an encrypted DB cluster from the us-west-2 Amazon Web Services Region, then your ReplicationSourceIdentifier would look like Example: arn:aws:rds:us-west-2:123456789012:cluster:aurora-cluster1.   To learn how to generate a Signature Version 4 signed request, see  Authenticating Requests: Using Query Parameters (Amazon Web Services Signature Version 4) and  Signature Version 4 Signing Process.  If you are using an Amazon Web Services SDK tool or the CLI, you can specify SourceRegion (or --source-region for the CLI) instead of specifying PreSignedUrl manually. Specifying SourceRegion autogenerates a presigned URL that is a valid request for the operation that can run in the source Amazon Web Services Region.  Valid for Cluster Type: Aurora DB clusters onlyIf you supply a value for this operation's SourceRegion parameter, a pre-signed URL will be calculated on your behalf.
     */
    PreSignedUrl?: String;
    /**
     * Specifies whether to enable mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts. By default, mapping isn't enabled. For more information, see  IAM Database Authentication in the Amazon Aurora User Guide. Valid for Cluster Type: Aurora DB clusters only
     */
    EnableIAMDatabaseAuthentication?: BooleanOptional;
    /**
     * The target backtrack window, in seconds. To disable backtracking, set this value to 0. Valid for Cluster Type: Aurora MySQL DB clusters only Default: 0  Constraints:   If specified, this value must be set to a number from 0 to 259,200 (72 hours).  
     */
    BacktrackWindow?: LongOptional;
    /**
     * The list of log types that need to be enabled for exporting to CloudWatch Logs. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters The following values are valid for each DB engine:   Aurora MySQL - audit | error | general | slowquery    Aurora PostgreSQL - postgresql    RDS for MySQL - error | general | slowquery    RDS for PostgreSQL - postgresql | upgrade    For more information about exporting CloudWatch Logs for Amazon RDS, see Publishing Database Logs to Amazon CloudWatch Logs in the Amazon RDS User Guide. For more information about exporting CloudWatch Logs for Amazon Aurora, see Publishing Database Logs to Amazon CloudWatch Logs in the Amazon Aurora User Guide.
     */
    EnableCloudwatchLogsExports?: LogTypeList;
    /**
     * The DB engine mode of the DB cluster, either provisioned or serverless. The serverless engine mode only applies for Aurora Serverless v1 DB clusters. For information about limitations and requirements for Serverless DB clusters, see the following sections in the Amazon Aurora User Guide:    Limitations of Aurora Serverless v1     Requirements for Aurora Serverless v2    Valid for Cluster Type: Aurora DB clusters only
     */
    EngineMode?: String;
    /**
     * For DB clusters in serverless DB engine mode, the scaling properties of the DB cluster. Valid for Cluster Type: Aurora DB clusters only
     */
    ScalingConfiguration?: ScalingConfiguration;
    /**
     * Specifies whether the DB cluster has deletion protection enabled. The database can't be deleted when deletion protection is enabled. By default, deletion protection isn't enabled. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    DeletionProtection?: BooleanOptional;
    /**
     * The global cluster ID of an Aurora cluster that becomes the primary cluster in the new global database cluster. Valid for Cluster Type: Aurora DB clusters only
     */
    GlobalClusterIdentifier?: String;
    /**
     * Specifies whether to enable the HTTP endpoint for an Aurora Serverless v1 DB cluster. By default, the HTTP endpoint is disabled. When enabled, the HTTP endpoint provides a connectionless web service API for running SQL queries on the Aurora Serverless v1 DB cluster. You can also query your database from inside the RDS console with the query editor. For more information, see Using the Data API for Aurora Serverless v1 in the Amazon Aurora User Guide. Valid for Cluster Type: Aurora DB clusters only
     */
    EnableHttpEndpoint?: BooleanOptional;
    /**
     * Specifies whether to copy all tags from the DB cluster to snapshots of the DB cluster. The default is not to copy them. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    CopyTagsToSnapshot?: BooleanOptional;
    /**
     * The Active Directory directory ID to create the DB cluster in. For Amazon Aurora DB clusters, Amazon RDS can use Kerberos authentication to authenticate users that connect to the DB cluster. For more information, see Kerberos authentication in the Amazon Aurora User Guide. Valid for Cluster Type: Aurora DB clusters only
     */
    Domain?: String;
    /**
     * The name of the IAM role to use when making API calls to the Directory Service. Valid for Cluster Type: Aurora DB clusters only
     */
    DomainIAMRoleName?: String;
    /**
     * Specifies whether to enable this DB cluster to forward write operations to the primary cluster of a global cluster (Aurora global database). By default, write operations are not allowed on Aurora DB clusters that are secondary clusters in an Aurora global database. You can set this value only on Aurora DB clusters that are members of an Aurora global database. With this parameter enabled, a secondary cluster can forward writes to the current primary cluster, and the resulting changes are replicated back to this cluster. For the primary DB cluster of an Aurora global database, this value is used immediately if the primary is demoted by a global cluster API operation, but it does nothing until then. Valid for Cluster Type: Aurora DB clusters only
     */
    EnableGlobalWriteForwarding?: BooleanOptional;
    /**
     * The compute and memory capacity of each DB instance in the Multi-AZ DB cluster, for example db.m6gd.xlarge. Not all DB instance classes are available in all Amazon Web Services Regions, or for all database engines. For the full list of DB instance classes and availability for your engine, see DB instance class in the Amazon RDS User Guide. This setting is required to create a Multi-AZ DB cluster. Valid for Cluster Type: Multi-AZ DB clusters only
     */
    DBClusterInstanceClass?: String;
    /**
     * The amount of storage in gibibytes (GiB) to allocate to each DB instance in the Multi-AZ DB cluster. Valid for Cluster Type: Multi-AZ DB clusters only This setting is required to create a Multi-AZ DB cluster.
     */
    AllocatedStorage?: IntegerOptional;
    /**
     * The storage type to associate with the DB cluster. For information on storage types for Aurora DB clusters, see Storage configurations for Amazon Aurora DB clusters. For information on storage types for Multi-AZ DB clusters, see Settings for creating Multi-AZ DB clusters. This setting is required to create a Multi-AZ DB cluster. When specified for a Multi-AZ DB cluster, a value for the Iops parameter is required. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Valid Values:   Aurora DB clusters - aurora | aurora-iopt1    Multi-AZ DB clusters - io1    Default:   Aurora DB clusters - aurora    Multi-AZ DB clusters - io1     When you create an Aurora DB cluster with the storage type set to aurora-iopt1, the storage type is returned in the response. The storage type isn't returned when you set it to aurora. 
     */
    StorageType?: String;
    /**
     * The amount of Provisioned IOPS (input/output operations per second) to be initially allocated for each DB instance in the Multi-AZ DB cluster. For information about valid IOPS values, see Provisioned IOPS storage in the Amazon RDS User Guide. This setting is required to create a Multi-AZ DB cluster. Valid for Cluster Type: Multi-AZ DB clusters only Constraints:   Must be a multiple between .5 and 50 of the storage amount for the DB cluster.  
     */
    Iops?: IntegerOptional;
    /**
     * Specifies whether the DB cluster is publicly accessible. When the DB cluster is publicly accessible, its Domain Name System (DNS) endpoint resolves to the private IP address from within the DB cluster's virtual private cloud (VPC). It resolves to the public IP address from outside of the DB cluster's VPC. Access to the DB cluster is ultimately controlled by the security group it uses. That public access isn't permitted if the security group assigned to the DB cluster doesn't permit it. When the DB cluster isn't publicly accessible, it is an internal DB cluster with a DNS name that resolves to a private IP address. Valid for Cluster Type: Multi-AZ DB clusters only Default: The default behavior varies depending on whether DBSubnetGroupName is specified. If DBSubnetGroupName isn't specified, and PubliclyAccessible isn't specified, the following applies:   If the default VPC in the target Region doesn’t have an internet gateway attached to it, the DB cluster is private.   If the default VPC in the target Region has an internet gateway attached to it, the DB cluster is public.   If DBSubnetGroupName is specified, and PubliclyAccessible isn't specified, the following applies:   If the subnets are part of a VPC that doesn’t have an internet gateway attached to it, the DB cluster is private.   If the subnets are part of a VPC that has an internet gateway attached to it, the DB cluster is public.  
     */
    PubliclyAccessible?: BooleanOptional;
    /**
     * Specifies whether minor engine upgrades are applied automatically to the DB cluster during the maintenance window. By default, minor engine upgrades are applied automatically. Valid for Cluster Type: Multi-AZ DB clusters only
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
    /**
     * The interval, in seconds, between points when Enhanced Monitoring metrics are collected for the DB cluster. To turn off collecting Enhanced Monitoring metrics, specify 0. If MonitoringRoleArn is specified, also set MonitoringInterval to a value other than 0. Valid for Cluster Type: Multi-AZ DB clusters only Valid Values: 0 | 1 | 5 | 10 | 15 | 30 | 60  Default: 0 
     */
    MonitoringInterval?: IntegerOptional;
    /**
     * The Amazon Resource Name (ARN) for the IAM role that permits RDS to send Enhanced Monitoring metrics to Amazon CloudWatch Logs. An example is arn:aws:iam:123456789012:role/emaccess. For information on creating a monitoring role, see Setting up and enabling Enhanced Monitoring in the Amazon RDS User Guide. If MonitoringInterval is set to a value other than 0, supply a MonitoringRoleArn value. Valid for Cluster Type: Multi-AZ DB clusters only
     */
    MonitoringRoleArn?: String;
    /**
     * Specifies whether to turn on Performance Insights for the DB cluster. For more information, see  Using Amazon Performance Insights in the Amazon RDS User Guide. Valid for Cluster Type: Multi-AZ DB clusters only
     */
    EnablePerformanceInsights?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier for encryption of Performance Insights data. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. If you don't specify a value for PerformanceInsightsKMSKeyId, then Amazon RDS uses your default KMS key. There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region. Valid for Cluster Type: Multi-AZ DB clusters only
     */
    PerformanceInsightsKMSKeyId?: String;
    /**
     * The number of days to retain Performance Insights data. Valid for Cluster Type: Multi-AZ DB clusters only Valid Values:    7     month * 31, where month is a number of months from 1-23. Examples: 93 (3 months * 31), 341 (11 months * 31), 589 (19 months * 31)    731    Default: 7 days If you specify a retention period that isn't valid, such as 94, Amazon RDS issues an error.
     */
    PerformanceInsightsRetentionPeriod?: IntegerOptional;
    ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
    /**
     * The network type of the DB cluster. The network type is determined by the DBSubnetGroup specified for the DB cluster. A DBSubnetGroup can support only the IPv4 protocol or the IPv4 and the IPv6 protocols (DUAL). For more information, see  Working with a DB instance in a VPC in the Amazon Aurora User Guide.  Valid for Cluster Type: Aurora DB clusters only Valid Values: IPV4 | DUAL 
     */
    NetworkType?: String;
    /**
     * Reserved for future use.
     */
    DBSystemId?: String;
    /**
     * Specifies whether to manage the master user password with Amazon Web Services Secrets Manager. For more information, see Password management with Amazon Web Services Secrets Manager in the Amazon RDS User Guide and Password management with Amazon Web Services Secrets Manager in the Amazon Aurora User Guide.  Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Constraints:   Can't manage the master user password with Amazon Web Services Secrets Manager if MasterUserPassword is specified.  
     */
    ManageMasterUserPassword?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier to encrypt a secret that is automatically generated and managed in Amazon Web Services Secrets Manager. This setting is valid only if the master user password is managed by RDS in Amazon Web Services Secrets Manager for the DB cluster. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. To use a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN. If you don't specify MasterUserSecretKmsKeyId, then the aws/secretsmanager KMS key is used to encrypt the secret. If the secret is in a different Amazon Web Services account, then you can't use the aws/secretsmanager KMS key to encrypt the secret, and you must use a customer managed KMS key. There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    MasterUserSecretKmsKeyId?: String;
    /**
     * Specifies whether read replicas can forward write operations to the writer DB instance in the DB cluster. By default, write operations aren't allowed on reader DB instances. Valid for: Aurora DB clusters only
     */
    EnableLocalWriteForwarding?: BooleanOptional;
    /**
     * The ID of the region that contains the source for the read replica.
     */
    SourceRegion?: String;
  }
  export interface CreateDBClusterParameterGroupMessage {
    /**
     * The name of the DB cluster parameter group. Constraints:   Must not match the name of an existing DB cluster parameter group.    This value is stored as a lowercase string. 
     */
    DBClusterParameterGroupName: String;
    /**
     * The DB cluster parameter group family name. A DB cluster parameter group can be associated with one and only one DB cluster parameter group family, and can be applied only to a DB cluster running a database engine and engine version compatible with that DB cluster parameter group family.  Aurora MySQL  Example: aurora-mysql5.7, aurora-mysql8.0   Aurora PostgreSQL  Example: aurora-postgresql14   RDS for MySQL  Example: mysql8.0   RDS for PostgreSQL  Example: postgres12  To list all of the available parameter group families for a DB engine, use the following command:  aws rds describe-db-engine-versions --query "DBEngineVersions[].DBParameterGroupFamily" --engine &lt;engine&gt;  For example, to list all of the available parameter group families for the Aurora PostgreSQL DB engine, use the following command:  aws rds describe-db-engine-versions --query "DBEngineVersions[].DBParameterGroupFamily" --engine aurora-postgresql   The output contains duplicates.  The following are the valid DB engine values:    aurora-mysql     aurora-postgresql     mysql     postgres   
     */
    DBParameterGroupFamily: String;
    /**
     * The description for the DB cluster parameter group.
     */
    Description: String;
    /**
     * Tags to assign to the DB cluster parameter group.
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
     * The identifier of the DB cluster snapshot. This parameter is stored as a lowercase string. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   First character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.   Example: my-cluster1-snapshot1 
     */
    DBClusterSnapshotIdentifier: String;
    /**
     * The identifier of the DB cluster to create a snapshot for. This parameter isn't case-sensitive. Constraints:   Must match the identifier of an existing DBCluster.   Example: my-cluster1 
     */
    DBClusterIdentifier: String;
    /**
     * The tags to be assigned to the DB cluster snapshot.
     */
    Tags?: TagList;
  }
  export interface CreateDBClusterSnapshotResult {
    DBClusterSnapshot?: DBClusterSnapshot;
  }
  export interface CreateDBInstanceMessage {
    /**
     * The meaning of this parameter differs according to the database engine you use.  MySQL  The name of the database to create when the DB instance is created. If this parameter isn't specified, no database is created in the DB instance. Constraints:   Must contain 1 to 64 letters or numbers.   Must begin with a letter. Subsequent characters can be letters, underscores, or digits (0-9).   Can't be a word reserved by the specified database engine    MariaDB  The name of the database to create when the DB instance is created. If this parameter isn't specified, no database is created in the DB instance. Constraints:   Must contain 1 to 64 letters or numbers.   Must begin with a letter. Subsequent characters can be letters, underscores, or digits (0-9).   Can't be a word reserved by the specified database engine    PostgreSQL  The name of the database to create when the DB instance is created. If this parameter isn't specified, a database named postgres is created in the DB instance. Constraints:   Must contain 1 to 63 letters, numbers, or underscores.   Must begin with a letter. Subsequent characters can be letters, underscores, or digits (0-9).   Can't be a word reserved by the specified database engine    Oracle  The Oracle System ID (SID) of the created DB instance. If you don't specify a value, the default value is ORCL. You can't specify the string null, or any other reserved word, for DBName. Default: ORCL  Constraints:   Can't be longer than 8 characters    Amazon RDS Custom for Oracle  The Oracle System ID (SID) of the created RDS Custom DB instance. If you don't specify a value, the default value is ORCL for non-CDBs and RDSCDB for CDBs. Default: ORCL  Constraints:   It must contain 1 to 8 alphanumeric characters.   It must contain a letter.   It can't be a word reserved by the database engine.    Amazon RDS Custom for SQL Server  Not applicable. Must be null.  SQL Server  Not applicable. Must be null.  Amazon Aurora MySQL  The name of the database to create when the primary DB instance of the Aurora MySQL DB cluster is created. If this parameter isn't specified for an Aurora MySQL DB cluster, no database is created in the DB cluster. Constraints:   It must contain 1 to 64 alphanumeric characters.   It can't be a word reserved by the database engine.    Amazon Aurora PostgreSQL  The name of the database to create when the primary DB instance of the Aurora PostgreSQL DB cluster is created. If this parameter isn't specified for an Aurora PostgreSQL DB cluster, a database named postgres is created in the DB cluster. Constraints:   It must contain 1 to 63 alphanumeric characters.   It must begin with a letter. Subsequent characters can be letters, underscores, or digits (0 to 9).   It can't be a word reserved by the database engine.  
     */
    DBName?: String;
    /**
     * The identifier for this DB instance. This parameter is stored as a lowercase string. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   First character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.   Example: mydbinstance 
     */
    DBInstanceIdentifier: String;
    /**
     * The amount of storage in gibibytes (GiB) to allocate for the DB instance. This setting doesn't apply to Amazon Aurora DB instances. Aurora cluster volumes automatically grow as the amount of data in your database increases, though you are only charged for the space that you use in an Aurora cluster volume.  Amazon RDS Custom  Constraints to the amount of storage for each storage type are the following:   General Purpose (SSD) storage (gp2, gp3): Must be an integer from 40 to 65536 for RDS Custom for Oracle, 16384 for RDS Custom for SQL Server.   Provisioned IOPS storage (io1): Must be an integer from 40 to 65536 for RDS Custom for Oracle, 16384 for RDS Custom for SQL Server.    RDS for MariaDB  Constraints to the amount of storage for each storage type are the following:   General Purpose (SSD) storage (gp2, gp3): Must be an integer from 20 to 65536.   Provisioned IOPS storage (io1): Must be an integer from 100 to 65536.   Magnetic storage (standard): Must be an integer from 5 to 3072.    RDS for MySQL  Constraints to the amount of storage for each storage type are the following:   General Purpose (SSD) storage (gp2, gp3): Must be an integer from 20 to 65536.   Provisioned IOPS storage (io1): Must be an integer from 100 to 65536.   Magnetic storage (standard): Must be an integer from 5 to 3072.    RDS for Oracle  Constraints to the amount of storage for each storage type are the following:   General Purpose (SSD) storage (gp2, gp3): Must be an integer from 20 to 65536.   Provisioned IOPS storage (io1): Must be an integer from 100 to 65536.   Magnetic storage (standard): Must be an integer from 10 to 3072.    RDS for PostgreSQL  Constraints to the amount of storage for each storage type are the following:   General Purpose (SSD) storage (gp2, gp3): Must be an integer from 20 to 65536.   Provisioned IOPS storage (io1): Must be an integer from 100 to 65536.   Magnetic storage (standard): Must be an integer from 5 to 3072.    RDS for SQL Server  Constraints to the amount of storage for each storage type are the following:   General Purpose (SSD) storage (gp2, gp3):   Enterprise and Standard editions: Must be an integer from 20 to 16384.   Web and Express editions: Must be an integer from 20 to 16384.     Provisioned IOPS storage (io1):   Enterprise and Standard editions: Must be an integer from 100 to 16384.   Web and Express editions: Must be an integer from 100 to 16384.     Magnetic storage (standard):   Enterprise and Standard editions: Must be an integer from 20 to 1024.   Web and Express editions: Must be an integer from 20 to 1024.      
     */
    AllocatedStorage?: IntegerOptional;
    /**
     * The compute and memory capacity of the DB instance, for example db.m5.large. Not all DB instance classes are available in all Amazon Web Services Regions, or for all database engines. For the full list of DB instance classes, and availability for your engine, see DB instance classes in the Amazon RDS User Guide or Aurora DB instance classes in the Amazon Aurora User Guide.
     */
    DBInstanceClass: String;
    /**
     * The database engine to use for this DB instance. Not every database engine is available in every Amazon Web Services Region. Valid Values:    aurora-mysql (for Aurora MySQL DB instances)    aurora-postgresql (for Aurora PostgreSQL DB instances)    custom-oracle-ee (for RDS Custom for Oracle DB instances)    custom-oracle-ee-cdb (for RDS Custom for Oracle DB instances)    custom-sqlserver-ee (for RDS Custom for SQL Server DB instances)    custom-sqlserver-se (for RDS Custom for SQL Server DB instances)    custom-sqlserver-web (for RDS Custom for SQL Server DB instances)    mariadb     mysql     oracle-ee     oracle-ee-cdb     oracle-se2     oracle-se2-cdb     postgres     sqlserver-ee     sqlserver-se     sqlserver-ex     sqlserver-web   
     */
    Engine: String;
    /**
     * The name for the master user. This setting doesn't apply to Amazon Aurora DB instances. The name for the master user is managed by the DB cluster. This setting is required for RDS DB instances. Constraints:   Must be 1 to 16 letters, numbers, or underscores.   First character must be a letter.   Can't be a reserved word for the chosen database engine.  
     */
    MasterUsername?: String;
    /**
     * The password for the master user. This setting doesn't apply to Amazon Aurora DB instances. The password for the master user is managed by the DB cluster. Constraints:   Can't be specified if ManageMasterUserPassword is turned on.   Can include any printable ASCII character except "/", """, or "@". For RDS for Oracle, can't include the "&amp;" (ampersand) or the "'" (single quotes) character.   Length Constraints:   RDS for MariaDB - Must contain from 8 to 41 characters.   RDS for Microsoft SQL Server - Must contain from 8 to 128 characters.   RDS for MySQL - Must contain from 8 to 41 characters.   RDS for Oracle - Must contain from 8 to 30 characters.   RDS for PostgreSQL - Must contain from 8 to 128 characters.  
     */
    MasterUserPassword?: String;
    /**
     * A list of DB security groups to associate with this DB instance. This setting applies to the legacy EC2-Classic platform, which is no longer used to create new DB instances. Use the VpcSecurityGroupIds setting instead.
     */
    DBSecurityGroups?: DBSecurityGroupNameList;
    /**
     * A list of Amazon EC2 VPC security groups to associate with this DB instance. This setting doesn't apply to Amazon Aurora DB instances. The associated list of EC2 VPC security groups is managed by the DB cluster. Default: The default EC2 VPC security group for the DB subnet group's VPC.
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * The Availability Zone (AZ) where the database will be created. For information on Amazon Web Services Regions and Availability Zones, see Regions and Availability Zones. For Amazon Aurora, each Aurora DB cluster hosts copies of its storage in three separate Availability Zones. Specify one of these Availability Zones. Aurora automatically chooses an appropriate Availability Zone if you don't specify one. Default: A random, system-chosen Availability Zone in the endpoint's Amazon Web Services Region. Constraints:   The AvailabilityZone parameter can't be specified if the DB instance is a Multi-AZ deployment.   The specified Availability Zone must be in the same Amazon Web Services Region as the current endpoint.   Example: us-east-1d 
     */
    AvailabilityZone?: String;
    /**
     * A DB subnet group to associate with this DB instance. Constraints:   Must match the name of an existing DB subnet group.   Must not be default.   Example: mydbsubnetgroup 
     */
    DBSubnetGroupName?: String;
    /**
     * The time range each week during which system maintenance can occur. For more information, see Amazon RDS Maintenance Window in the Amazon RDS User Guide.  The default is a 30-minute window selected at random from an 8-hour block of time for each Amazon Web Services Region, occurring on a random day of the week. Constraints:   Must be in the format ddd:hh24:mi-ddd:hh24:mi.   The day values must be mon | tue | wed | thu | fri | sat | sun.    Must be in Universal Coordinated Time (UTC).   Must not conflict with the preferred backup window.   Must be at least 30 minutes.  
     */
    PreferredMaintenanceWindow?: String;
    /**
     * The name of the DB parameter group to associate with this DB instance. If you don't specify a value, then Amazon RDS uses the default DB parameter group for the specified DB engine and version. This setting doesn't apply to RDS Custom DB instances. Constraints:   Must be 1 to 255 letters, numbers, or hyphens.   The first character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.  
     */
    DBParameterGroupName?: String;
    /**
     * The number of days for which automated backups are retained. Setting this parameter to a positive number enables backups. Setting this parameter to 0 disables automated backups. This setting doesn't apply to Amazon Aurora DB instances. The retention period for automated backups is managed by the DB cluster. Default: 1  Constraints:   Must be a value from 0 to 35.   Can't be set to 0 if the DB instance is a source to read replicas.   Can't be set to 0 for an RDS Custom for Oracle DB instance.  
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * The daily time range during which automated backups are created if automated backups are enabled, using the BackupRetentionPeriod parameter. The default is a 30-minute window selected at random from an 8-hour block of time for each Amazon Web Services Region. For more information, see Backup window in the Amazon RDS User Guide. This setting doesn't apply to Amazon Aurora DB instances. The daily time range for creating automated backups is managed by the DB cluster. Constraints:   Must be in the format hh24:mi-hh24:mi.   Must be in Universal Coordinated Time (UTC).   Must not conflict with the preferred maintenance window.   Must be at least 30 minutes.  
     */
    PreferredBackupWindow?: String;
    /**
     * The port number on which the database accepts connections. This setting doesn't apply to Aurora DB instances. The port number is managed by the cluster. Valid Values: 1150-65535  Default:   RDS for MariaDB - 3306    RDS for Microsoft SQL Server - 1433    RDS for MySQL - 3306    RDS for Oracle - 1521    RDS for PostgreSQL - 5432    Constraints:   For RDS for Microsoft SQL Server, the value can't be 1234, 1434, 3260, 3343, 3389, 47001, or 49152-49156.  
     */
    Port?: IntegerOptional;
    /**
     * Specifies whether the DB instance is a Multi-AZ deployment. You can't set the AvailabilityZone parameter if the DB instance is a Multi-AZ deployment. This setting doesn't apply to the following DB instances:   Amazon Aurora (DB instance Availability Zones (AZs) are managed by the DB cluster.)   RDS Custom  
     */
    MultiAZ?: BooleanOptional;
    /**
     * The version number of the database engine to use. This setting doesn't apply to Amazon Aurora DB instances. The version number of the database engine the DB instance uses is managed by the DB cluster. For a list of valid engine versions, use the DescribeDBEngineVersions operation. The following are the database engines and links to information about the major and minor versions that are available with Amazon RDS. Not every database engine is available for every Amazon Web Services Region.  Amazon RDS Custom for Oracle  A custom engine version (CEV) that you have previously created. This setting is required for RDS Custom for Oracle. The CEV name has the following format: 19.customized_string. A valid CEV name is 19.my_cev1. For more information, see  Creating an RDS Custom for Oracle DB instance in the Amazon RDS User Guide.  Amazon RDS Custom for SQL Server  See RDS Custom for SQL Server general requirements in the Amazon RDS User Guide.  RDS for MariaDB  For information, see MariaDB on Amazon RDS versions in the Amazon RDS User Guide.  RDS for Microsoft SQL Server  For information, see Microsoft SQL Server versions on Amazon RDS in the Amazon RDS User Guide.  RDS for MySQL  For information, see MySQL on Amazon RDS versions in the Amazon RDS User Guide.  RDS for Oracle  For information, see Oracle Database Engine release notes in the Amazon RDS User Guide.  RDS for PostgreSQL  For information, see Amazon RDS for PostgreSQL versions and extensions in the Amazon RDS User Guide.  
     */
    EngineVersion?: String;
    /**
     * Specifies whether minor engine upgrades are applied automatically to the DB instance during the maintenance window. By default, minor engine upgrades are applied automatically. If you create an RDS Custom DB instance, you must set AutoMinorVersionUpgrade to false.
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
    /**
     * The license model information for this DB instance. This setting doesn't apply to Amazon Aurora or RDS Custom DB instances. Valid Values:   RDS for MariaDB - general-public-license    RDS for Microsoft SQL Server - license-included    RDS for MySQL - general-public-license    RDS for Oracle - bring-your-own-license | license-included    RDS for PostgreSQL - postgresql-license   
     */
    LicenseModel?: String;
    /**
     * The amount of Provisioned IOPS (input/output operations per second) to initially allocate for the DB instance. For information about valid IOPS values, see Amazon RDS DB instance storage in the Amazon RDS User Guide. This setting doesn't apply to Amazon Aurora DB instances. Storage is managed by the DB cluster. Constraints:   For RDS for MariaDB, MySQL, Oracle, and PostgreSQL - Must be a multiple between .5 and 50 of the storage amount for the DB instance.   For RDS for SQL Server - Must be a multiple between 1 and 50 of the storage amount for the DB instance.  
     */
    Iops?: IntegerOptional;
    /**
     * The option group to associate the DB instance with. Permanent options, such as the TDE option for Oracle Advanced Security TDE, can't be removed from an option group. Also, that option group can't be removed from a DB instance after it is associated with a DB instance. This setting doesn't apply to Amazon Aurora or RDS Custom DB instances.
     */
    OptionGroupName?: String;
    /**
     * For supported engines, the character set (CharacterSet) to associate the DB instance with. This setting doesn't apply to the following DB instances:   Amazon Aurora - The character set is managed by the DB cluster. For more information, see CreateDBCluster.   RDS Custom - However, if you need to change the character set, you can change it on the database itself.  
     */
    CharacterSetName?: String;
    /**
     * The name of the NCHAR character set for the Oracle DB instance. This setting doesn't apply to RDS Custom DB instances.
     */
    NcharCharacterSetName?: String;
    /**
     * Specifies whether the DB instance is publicly accessible. When the DB instance is publicly accessible, its Domain Name System (DNS) endpoint resolves to the private IP address from within the DB instance's virtual private cloud (VPC). It resolves to the public IP address from outside of the DB instance's VPC. Access to the DB instance is ultimately controlled by the security group it uses. That public access is not permitted if the security group assigned to the DB instance doesn't permit it. When the DB instance isn't publicly accessible, it is an internal DB instance with a DNS name that resolves to a private IP address. Default: The default behavior varies depending on whether DBSubnetGroupName is specified. If DBSubnetGroupName isn't specified, and PubliclyAccessible isn't specified, the following applies:   If the default VPC in the target Region doesn’t have an internet gateway attached to it, the DB instance is private.   If the default VPC in the target Region has an internet gateway attached to it, the DB instance is public.   If DBSubnetGroupName is specified, and PubliclyAccessible isn't specified, the following applies:   If the subnets are part of a VPC that doesn’t have an internet gateway attached to it, the DB instance is private.   If the subnets are part of a VPC that has an internet gateway attached to it, the DB instance is public.  
     */
    PubliclyAccessible?: BooleanOptional;
    /**
     * Tags to assign to the DB instance.
     */
    Tags?: TagList;
    /**
     * The identifier of the DB cluster that this DB instance will belong to. This setting doesn't apply to RDS Custom DB instances.
     */
    DBClusterIdentifier?: String;
    /**
     * The storage type to associate with the DB instance. If you specify io1 or gp3, you must also include a value for the Iops parameter. This setting doesn't apply to Amazon Aurora DB instances. Storage is managed by the DB cluster. Valid Values: gp2 | gp3 | io1 | standard  Default: io1, if the Iops parameter is specified. Otherwise, gp2.
     */
    StorageType?: String;
    /**
     * The ARN from the key store with which to associate the instance for TDE encryption. This setting doesn't apply to Amazon Aurora or RDS Custom DB instances.
     */
    TdeCredentialArn?: String;
    /**
     * The password for the given ARN from the key store in order to access the device. This setting doesn't apply to RDS Custom DB instances.
     */
    TdeCredentialPassword?: String;
    /**
     * Specifes whether the DB instance is encrypted. By default, it isn't encrypted. For RDS Custom DB instances, either enable this setting or leave it unset. Otherwise, Amazon RDS reports an error. This setting doesn't apply to Amazon Aurora DB instances. The encryption for DB instances is managed by the DB cluster.
     */
    StorageEncrypted?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier for an encrypted DB instance. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. To use a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN. This setting doesn't apply to Amazon Aurora DB instances. The Amazon Web Services KMS key identifier is managed by the DB cluster. For more information, see CreateDBCluster. If StorageEncrypted is enabled, and you do not specify a value for the KmsKeyId parameter, then Amazon RDS uses your default KMS key. There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region. For Amazon RDS Custom, a KMS key is required for DB instances. For most RDS engines, if you leave this parameter empty while enabling StorageEncrypted, the engine uses the default KMS key. However, RDS Custom doesn't use the default key when this parameter is empty. You must explicitly specify a key.
     */
    KmsKeyId?: String;
    /**
     * The Active Directory directory ID to create the DB instance in. Currently, only Microsoft SQL Server, MySQL, Oracle, and PostgreSQL DB instances can be created in an Active Directory Domain. For more information, see  Kerberos Authentication in the Amazon RDS User Guide. This setting doesn't apply to the following DB instances:   Amazon Aurora (The domain is managed by the DB cluster.)   RDS Custom  
     */
    Domain?: String;
    /**
     * The fully qualified domain name (FQDN) of an Active Directory domain. Constraints:   Can't be longer than 64 characters.   Example: mymanagedADtest.mymanagedAD.mydomain 
     */
    DomainFqdn?: String;
    /**
     * The Active Directory organizational unit for your DB instance to join. Constraints:   Must be in the distinguished name format.   Can't be longer than 64 characters.   Example: OU=mymanagedADtestOU,DC=mymanagedADtest,DC=mymanagedAD,DC=mydomain 
     */
    DomainOu?: String;
    /**
     * The ARN for the Secrets Manager secret with the credentials for the user joining the domain. Example: arn:aws:secretsmanager:region:account-number:secret:myselfmanagedADtestsecret-123456 
     */
    DomainAuthSecretArn?: String;
    /**
     * The IPv4 DNS IP addresses of your primary and secondary Active Directory domain controllers. Constraints:   Two IP addresses must be provided. If there isn't a secondary domain controller, use the IP address of the primary domain controller for both entries in the list.   Example: 123.124.125.126,234.235.236.237 
     */
    DomainDnsIps?: StringList;
    /**
     * Specifies whether to copy tags from the DB instance to snapshots of the DB instance. By default, tags are not copied. This setting doesn't apply to Amazon Aurora DB instances. Copying tags to snapshots is managed by the DB cluster. Setting this value for an Aurora DB instance has no effect on the DB cluster setting.
     */
    CopyTagsToSnapshot?: BooleanOptional;
    /**
     * The interval, in seconds, between points when Enhanced Monitoring metrics are collected for the DB instance. To disable collection of Enhanced Monitoring metrics, specify 0. If MonitoringRoleArn is specified, then you must set MonitoringInterval to a value other than 0. This setting doesn't apply to RDS Custom DB instances. Valid Values: 0 | 1 | 5 | 10 | 15 | 30 | 60  Default: 0 
     */
    MonitoringInterval?: IntegerOptional;
    /**
     * The ARN for the IAM role that permits RDS to send enhanced monitoring metrics to Amazon CloudWatch Logs. For example, arn:aws:iam:123456789012:role/emaccess. For information on creating a monitoring role, see Setting Up and Enabling Enhanced Monitoring in the Amazon RDS User Guide. If MonitoringInterval is set to a value other than 0, then you must supply a MonitoringRoleArn value. This setting doesn't apply to RDS Custom DB instances.
     */
    MonitoringRoleArn?: String;
    /**
     * The name of the IAM role to use when making API calls to the Directory Service. This setting doesn't apply to the following DB instances:   Amazon Aurora (The domain is managed by the DB cluster.)   RDS Custom  
     */
    DomainIAMRoleName?: String;
    /**
     * The order of priority in which an Aurora Replica is promoted to the primary instance after a failure of the existing primary instance. For more information, see  Fault Tolerance for an Aurora DB Cluster in the Amazon Aurora User Guide. This setting doesn't apply to RDS Custom DB instances. Default: 1  Valid Values: 0 - 15 
     */
    PromotionTier?: IntegerOptional;
    /**
     * The time zone of the DB instance. The time zone parameter is currently supported only by Microsoft SQL Server.
     */
    Timezone?: String;
    /**
     * Specifies whether to enable mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts. By default, mapping isn't enabled. For more information, see  IAM Database Authentication for MySQL and PostgreSQL in the Amazon RDS User Guide. This setting doesn't apply to the following DB instances:   Amazon Aurora (Mapping Amazon Web Services IAM accounts to database accounts is managed by the DB cluster.)   RDS Custom  
     */
    EnableIAMDatabaseAuthentication?: BooleanOptional;
    /**
     * Specifies whether to enable Performance Insights for the DB instance. For more information, see Using Amazon Performance Insights in the Amazon RDS User Guide. This setting doesn't apply to RDS Custom DB instances.
     */
    EnablePerformanceInsights?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier for encryption of Performance Insights data. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. If you don't specify a value for PerformanceInsightsKMSKeyId, then Amazon RDS uses your default KMS key. There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region. This setting doesn't apply to RDS Custom DB instances.
     */
    PerformanceInsightsKMSKeyId?: String;
    /**
     * The number of days to retain Performance Insights data. This setting doesn't apply to RDS Custom DB instances. Valid Values:    7     month * 31, where month is a number of months from 1-23. Examples: 93 (3 months * 31), 341 (11 months * 31), 589 (19 months * 31)    731    Default: 7 days If you specify a retention period that isn't valid, such as 94, Amazon RDS returns an error.
     */
    PerformanceInsightsRetentionPeriod?: IntegerOptional;
    /**
     * The list of log types that need to be enabled for exporting to CloudWatch Logs. For more information, see  Publishing Database Logs to Amazon CloudWatch Logs in the Amazon RDS User Guide. This setting doesn't apply to the following DB instances:   Amazon Aurora (CloudWatch Logs exports are managed by the DB cluster.)   RDS Custom   The following values are valid for each DB engine:   RDS for MariaDB - audit | error | general | slowquery    RDS for Microsoft SQL Server - agent | error    RDS for MySQL - audit | error | general | slowquery    RDS for Oracle - alert | audit | listener | trace | oemagent    RDS for PostgreSQL - postgresql | upgrade   
     */
    EnableCloudwatchLogsExports?: LogTypeList;
    /**
     * The number of CPU cores and the number of threads per core for the DB instance class of the DB instance. This setting doesn't apply to Amazon Aurora or RDS Custom DB instances.
     */
    ProcessorFeatures?: ProcessorFeatureList;
    /**
     * Specifies whether the DB instance has deletion protection enabled. The database can't be deleted when deletion protection is enabled. By default, deletion protection isn't enabled. For more information, see  Deleting a DB Instance. This setting doesn't apply to Amazon Aurora DB instances. You can enable or disable deletion protection for the DB cluster. For more information, see CreateDBCluster. DB instances in a DB cluster can be deleted even when deletion protection is enabled for the DB cluster.
     */
    DeletionProtection?: BooleanOptional;
    /**
     * The upper limit in gibibytes (GiB) to which Amazon RDS can automatically scale the storage of the DB instance. For more information about this setting, including limitations that apply to it, see  Managing capacity automatically with Amazon RDS storage autoscaling in the Amazon RDS User Guide. This setting doesn't apply to the following DB instances:   Amazon Aurora (Storage is managed by the DB cluster.)   RDS Custom  
     */
    MaxAllocatedStorage?: IntegerOptional;
    /**
     * Specifies whether to enable a customer-owned IP address (CoIP) for an RDS on Outposts DB instance. A CoIP provides local or external connectivity to resources in your Outpost subnets through your on-premises network. For some use cases, a CoIP can provide lower latency for connections to the DB instance from outside of its virtual private cloud (VPC) on your local network. For more information about RDS on Outposts, see Working with Amazon RDS on Amazon Web Services Outposts in the Amazon RDS User Guide. For more information about CoIPs, see Customer-owned IP addresses in the Amazon Web Services Outposts User Guide.
     */
    EnableCustomerOwnedIp?: BooleanOptional;
    /**
     * The instance profile associated with the underlying Amazon EC2 instance of an RDS Custom DB instance. This setting is required for RDS Custom. Constraints:   The profile must exist in your account.   The profile must have an IAM role that Amazon EC2 has permissions to assume.   The instance profile name and the associated IAM role name must start with the prefix AWSRDSCustom.   For the list of permissions required for the IAM role, see  Configure IAM and your VPC in the Amazon RDS User Guide.
     */
    CustomIamInstanceProfile?: String;
    /**
     * The location for storing automated backups and manual snapshots. Valie Values:    outposts (Amazon Web Services Outposts)    region (Amazon Web Services Region)   Default: region  For more information, see Working with Amazon RDS on Amazon Web Services Outposts in the Amazon RDS User Guide.
     */
    BackupTarget?: String;
    /**
     * The network type of the DB instance. The network type is determined by the DBSubnetGroup specified for the DB instance. A DBSubnetGroup can support only the IPv4 protocol or the IPv4 and the IPv6 protocols (DUAL). For more information, see  Working with a DB instance in a VPC in the Amazon RDS User Guide.  Valid Values: IPV4 | DUAL 
     */
    NetworkType?: String;
    /**
     * The storage throughput value for the DB instance. This setting applies only to the gp3 storage type. This setting doesn't apply to Amazon Aurora or RDS Custom DB instances.
     */
    StorageThroughput?: IntegerOptional;
    /**
     * Specifies whether to manage the master user password with Amazon Web Services Secrets Manager. For more information, see Password management with Amazon Web Services Secrets Manager in the Amazon RDS User Guide.  Constraints:   Can't manage the master user password with Amazon Web Services Secrets Manager if MasterUserPassword is specified.  
     */
    ManageMasterUserPassword?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier to encrypt a secret that is automatically generated and managed in Amazon Web Services Secrets Manager. This setting is valid only if the master user password is managed by RDS in Amazon Web Services Secrets Manager for the DB instance. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. To use a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN. If you don't specify MasterUserSecretKmsKeyId, then the aws/secretsmanager KMS key is used to encrypt the secret. If the secret is in a different Amazon Web Services account, then you can't use the aws/secretsmanager KMS key to encrypt the secret, and you must use a customer managed KMS key. There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region.
     */
    MasterUserSecretKmsKeyId?: String;
    /**
     * The CA certificate identifier to use for the DB instance's server certificate. This setting doesn't apply to RDS Custom DB instances. For more information, see Using SSL/TLS to encrypt a connection to a DB instance in the Amazon RDS User Guide and  Using SSL/TLS to encrypt a connection to a DB cluster in the Amazon Aurora User Guide.
     */
    CACertificateIdentifier?: String;
    /**
     * The Oracle system identifier (SID), which is the name of the Oracle database instance that manages your database files. In this context, the term "Oracle database instance" refers exclusively to the system global area (SGA) and Oracle background processes. If you don't specify a SID, the value defaults to RDSCDB. The Oracle SID is also the name of your CDB.
     */
    DBSystemId?: String;
    /**
     * Indicates whether the DB instance has a dedicated log volume (DLV) enabled.
     */
    DedicatedLogVolume?: BooleanOptional;
  }
  export interface CreateDBInstanceReadReplicaMessage {
    /**
     * The DB instance identifier of the read replica. This identifier is the unique key that identifies a DB instance. This parameter is stored as a lowercase string.
     */
    DBInstanceIdentifier: String;
    /**
     * The identifier of the DB instance that will act as the source for the read replica. Each DB instance can have up to 15 read replicas, with the exception of Oracle and SQL Server, which can have up to five. Constraints:   Must be the identifier of an existing MySQL, MariaDB, Oracle, PostgreSQL, or SQL Server DB instance.   Can't be specified if the SourceDBClusterIdentifier parameter is also specified.   For the limitations of Oracle read replicas, see Version and licensing considerations for RDS for Oracle replicas in the Amazon RDS User Guide.   For the limitations of SQL Server read replicas, see Read replica limitations with SQL Server in the Amazon RDS User Guide.   The specified DB instance must have automatic backups enabled, that is, its backup retention period must be greater than 0.   If the source DB instance is in the same Amazon Web Services Region as the read replica, specify a valid DB instance identifier.   If the source DB instance is in a different Amazon Web Services Region from the read replica, specify a valid DB instance ARN. For more information, see Constructing an ARN for Amazon RDS in the Amazon RDS User Guide. This doesn't apply to SQL Server or RDS Custom, which don't support cross-Region replicas.  
     */
    SourceDBInstanceIdentifier?: String;
    /**
     * The compute and memory capacity of the read replica, for example db.m4.large. Not all DB instance classes are available in all Amazon Web Services Regions, or for all database engines. For the full list of DB instance classes, and availability for your engine, see DB Instance Class in the Amazon RDS User Guide. Default: Inherits the value from the source DB instance.
     */
    DBInstanceClass?: String;
    /**
     * The Availability Zone (AZ) where the read replica will be created. Default: A random, system-chosen Availability Zone in the endpoint's Amazon Web Services Region. Example: us-east-1d 
     */
    AvailabilityZone?: String;
    /**
     * The port number that the DB instance uses for connections. Valid Values: 1150-65535  Default: Inherits the value from the source DB instance.
     */
    Port?: IntegerOptional;
    /**
     * Specifies whether the read replica is in a Multi-AZ deployment. You can create a read replica as a Multi-AZ DB instance. RDS creates a standby of your replica in another Availability Zone for failover support for the replica. Creating your read replica as a Multi-AZ DB instance is independent of whether the source is a Multi-AZ DB instance or a Multi-AZ DB cluster. This setting doesn't apply to RDS Custom DB instances.
     */
    MultiAZ?: BooleanOptional;
    /**
     * Specifies whether to automatically apply minor engine upgrades to the read replica during the maintenance window. This setting doesn't apply to RDS Custom DB instances. Default: Inherits the value from the source DB instance.
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
    /**
     * The amount of Provisioned IOPS (input/output operations per second) to initially allocate for the DB instance.
     */
    Iops?: IntegerOptional;
    /**
     * The option group to associate the DB instance with. If not specified, RDS uses the option group associated with the source DB instance or cluster.  For SQL Server, you must use the option group associated with the source.  This setting doesn't apply to RDS Custom DB instances.
     */
    OptionGroupName?: String;
    /**
     * The name of the DB parameter group to associate with this DB instance. If you don't specify a value for DBParameterGroupName, then Amazon RDS uses the DBParameterGroup of the source DB instance for a same Region read replica, or the default DBParameterGroup for the specified DB engine for a cross-Region read replica. Specifying a parameter group for this operation is only supported for MySQL DB instances for cross-Region read replicas and for Oracle DB instances. It isn't supported for MySQL DB instances for same Region read replicas or for RDS Custom. Constraints:   Must be 1 to 255 letters, numbers, or hyphens.   First character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.  
     */
    DBParameterGroupName?: String;
    /**
     * Specifies whether the DB instance is publicly accessible. When the DB cluster is publicly accessible, its Domain Name System (DNS) endpoint resolves to the private IP address from within the DB cluster's virtual private cloud (VPC). It resolves to the public IP address from outside of the DB cluster's VPC. Access to the DB cluster is ultimately controlled by the security group it uses. That public access isn't permitted if the security group assigned to the DB cluster doesn't permit it. When the DB instance isn't publicly accessible, it is an internal DB instance with a DNS name that resolves to a private IP address. For more information, see CreateDBInstance.
     */
    PubliclyAccessible?: BooleanOptional;
    Tags?: TagList;
    /**
     * A DB subnet group for the DB instance. The new DB instance is created in the VPC associated with the DB subnet group. If no DB subnet group is specified, then the new DB instance isn't created in a VPC. Constraints:   If supplied, must match the name of an existing DB subnet group.   The specified DB subnet group must be in the same Amazon Web Services Region in which the operation is running.   All read replicas in one Amazon Web Services Region that are created from the same source DB instance must either:   Specify DB subnet groups from the same VPC. All these read replicas are created in the same VPC.   Not specify a DB subnet group. All these read replicas are created outside of any VPC.     Example: mydbsubnetgroup 
     */
    DBSubnetGroupName?: String;
    /**
     * A list of Amazon EC2 VPC security groups to associate with the read replica. This setting doesn't apply to RDS Custom DB instances. Default: The default EC2 VPC security group for the DB subnet group's VPC.
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * The storage type to associate with the read replica. If you specify io1 or gp3, you must also include a value for the Iops parameter. Valid Values: gp2 | gp3 | io1 | standard  Default: io1 if the Iops parameter is specified. Otherwise, gp2.
     */
    StorageType?: String;
    /**
     * Specifies whether to copy all tags from the read replica to snapshots of the read replica. By default, tags aren't copied.
     */
    CopyTagsToSnapshot?: BooleanOptional;
    /**
     * The interval, in seconds, between points when Enhanced Monitoring metrics are collected for the read replica. To disable collection of Enhanced Monitoring metrics, specify 0. The default is 0. If MonitoringRoleArn is specified, then you must set MonitoringInterval to a value other than 0. This setting doesn't apply to RDS Custom DB instances. Valid Values: 0, 1, 5, 10, 15, 30, 60  Default: 0 
     */
    MonitoringInterval?: IntegerOptional;
    /**
     * The ARN for the IAM role that permits RDS to send enhanced monitoring metrics to Amazon CloudWatch Logs. For example, arn:aws:iam:123456789012:role/emaccess. For information on creating a monitoring role, go to To create an IAM role for Amazon RDS Enhanced Monitoring in the Amazon RDS User Guide. If MonitoringInterval is set to a value other than 0, then you must supply a MonitoringRoleArn value. This setting doesn't apply to RDS Custom DB instances.
     */
    MonitoringRoleArn?: String;
    /**
     * The Amazon Web Services KMS key identifier for an encrypted read replica. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. If you create an encrypted read replica in the same Amazon Web Services Region as the source DB instance or Multi-AZ DB cluster, don't specify a value for this parameter. A read replica in the same Amazon Web Services Region is always encrypted with the same KMS key as the source DB instance or cluster. If you create an encrypted read replica in a different Amazon Web Services Region, then you must specify a KMS key identifier for the destination Amazon Web Services Region. KMS keys are specific to the Amazon Web Services Region that they are created in, and you can't use KMS keys from one Amazon Web Services Region in another Amazon Web Services Region. You can't create an encrypted read replica from an unencrypted DB instance or Multi-AZ DB cluster. This setting doesn't apply to RDS Custom, which uses the same KMS key as the primary replica.
     */
    KmsKeyId?: String;
    /**
     * When you are creating a read replica from one Amazon Web Services GovCloud (US) Region to another or from one China Amazon Web Services Region to another, the URL that contains a Signature Version 4 signed request for the CreateDBInstanceReadReplica API operation in the source Amazon Web Services Region that contains the source DB instance. This setting applies only to Amazon Web Services GovCloud (US) Regions and China Amazon Web Services Regions. It's ignored in other Amazon Web Services Regions. This setting applies only when replicating from a source DB instance. Source DB clusters aren't supported in Amazon Web Services GovCloud (US) Regions and China Amazon Web Services Regions. You must specify this parameter when you create an encrypted read replica from another Amazon Web Services Region by using the Amazon RDS API. Don't specify PreSignedUrl when you are creating an encrypted read replica in the same Amazon Web Services Region. The presigned URL must be a valid request for the CreateDBInstanceReadReplica API operation that can run in the source Amazon Web Services Region that contains the encrypted source DB instance. The presigned URL request must contain the following parameter values:    DestinationRegion - The Amazon Web Services Region that the encrypted read replica is created in. This Amazon Web Services Region is the same one where the CreateDBInstanceReadReplica operation is called that contains this presigned URL. For example, if you create an encrypted DB instance in the us-west-1 Amazon Web Services Region, from a source DB instance in the us-east-2 Amazon Web Services Region, then you call the CreateDBInstanceReadReplica operation in the us-east-1 Amazon Web Services Region and provide a presigned URL that contains a call to the CreateDBInstanceReadReplica operation in the us-west-2 Amazon Web Services Region. For this example, the DestinationRegion in the presigned URL must be set to the us-east-1 Amazon Web Services Region.    KmsKeyId - The KMS key identifier for the key to use to encrypt the read replica in the destination Amazon Web Services Region. This is the same identifier for both the CreateDBInstanceReadReplica operation that is called in the destination Amazon Web Services Region, and the operation contained in the presigned URL.    SourceDBInstanceIdentifier - The DB instance identifier for the encrypted DB instance to be replicated. This identifier must be in the Amazon Resource Name (ARN) format for the source Amazon Web Services Region. For example, if you are creating an encrypted read replica from a DB instance in the us-west-2 Amazon Web Services Region, then your SourceDBInstanceIdentifier looks like the following example: arn:aws:rds:us-west-2:123456789012:instance:mysql-instance1-20161115.   To learn how to generate a Signature Version 4 signed request, see Authenticating Requests: Using Query Parameters (Amazon Web Services Signature Version 4) and Signature Version 4 Signing Process.  If you are using an Amazon Web Services SDK tool or the CLI, you can specify SourceRegion (or --source-region for the CLI) instead of specifying PreSignedUrl manually. Specifying SourceRegion autogenerates a presigned URL that is a valid request for the operation that can run in the source Amazon Web Services Region.  SourceRegion isn't supported for SQL Server, because Amazon RDS for SQL Server doesn't support cross-Region read replicas.  This setting doesn't apply to RDS Custom DB instances.If you supply a value for this operation's SourceRegion parameter, a pre-signed URL will be calculated on your behalf.
     */
    PreSignedUrl?: String;
    /**
     * Specifies whether to enable mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts. By default, mapping isn't enabled. For more information about IAM database authentication, see  IAM Database Authentication for MySQL and PostgreSQL in the Amazon RDS User Guide. This setting doesn't apply to RDS Custom DB instances.
     */
    EnableIAMDatabaseAuthentication?: BooleanOptional;
    /**
     * Specifies whether to enable Performance Insights for the read replica. For more information, see Using Amazon Performance Insights in the Amazon RDS User Guide. This setting doesn't apply to RDS Custom DB instances.
     */
    EnablePerformanceInsights?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier for encryption of Performance Insights data. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. If you do not specify a value for PerformanceInsightsKMSKeyId, then Amazon RDS uses your default KMS key. There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region. This setting doesn't apply to RDS Custom DB instances.
     */
    PerformanceInsightsKMSKeyId?: String;
    /**
     * The number of days to retain Performance Insights data. This setting doesn't apply to RDS Custom DB instances. Valid Values:    7     month * 31, where month is a number of months from 1-23. Examples: 93 (3 months * 31), 341 (11 months * 31), 589 (19 months * 31)    731    Default: 7 days If you specify a retention period that isn't valid, such as 94, Amazon RDS returns an error.
     */
    PerformanceInsightsRetentionPeriod?: IntegerOptional;
    /**
     * The list of logs that the new DB instance is to export to CloudWatch Logs. The values in the list depend on the DB engine being used. For more information, see Publishing Database Logs to Amazon CloudWatch Logs  in the Amazon RDS User Guide. This setting doesn't apply to RDS Custom DB instances.
     */
    EnableCloudwatchLogsExports?: LogTypeList;
    /**
     * The number of CPU cores and the number of threads per core for the DB instance class of the DB instance. This setting doesn't apply to RDS Custom DB instances.
     */
    ProcessorFeatures?: ProcessorFeatureList;
    /**
     * Specifies whether the DB instance class of the DB instance uses its default processor features. This setting doesn't apply to RDS Custom DB instances.
     */
    UseDefaultProcessorFeatures?: BooleanOptional;
    /**
     * Specifies whether to enable deletion protection for the DB instance. The database can't be deleted when deletion protection is enabled. By default, deletion protection isn't enabled. For more information, see  Deleting a DB Instance.
     */
    DeletionProtection?: BooleanOptional;
    /**
     * The Active Directory directory ID to create the DB instance in. Currently, only MySQL, Microsoft SQL Server, Oracle, and PostgreSQL DB instances can be created in an Active Directory Domain. For more information, see  Kerberos Authentication in the Amazon RDS User Guide. This setting doesn't apply to RDS Custom DB instances.
     */
    Domain?: String;
    /**
     * The name of the IAM role to use when making API calls to the Directory Service. This setting doesn't apply to RDS Custom DB instances.
     */
    DomainIAMRoleName?: String;
    /**
     * The fully qualified domain name (FQDN) of an Active Directory domain. Constraints:   Can't be longer than 64 characters.   Example: mymanagedADtest.mymanagedAD.mydomain 
     */
    DomainFqdn?: String;
    /**
     * The Active Directory organizational unit for your DB instance to join. Constraints:   Must be in the distinguished name format.   Can't be longer than 64 characters.   Example: OU=mymanagedADtestOU,DC=mymanagedADtest,DC=mymanagedAD,DC=mydomain 
     */
    DomainOu?: String;
    /**
     * The ARN for the Secrets Manager secret with the credentials for the user joining the domain. Example: arn:aws:secretsmanager:region:account-number:secret:myselfmanagedADtestsecret-123456 
     */
    DomainAuthSecretArn?: String;
    /**
     * The IPv4 DNS IP addresses of your primary and secondary Active Directory domain controllers. Constraints:   Two IP addresses must be provided. If there isn't a secondary domain controller, use the IP address of the primary domain controller for both entries in the list.   Example: 123.124.125.126,234.235.236.237 
     */
    DomainDnsIps?: StringList;
    /**
     * The open mode of the replica database: mounted or read-only.  This parameter is only supported for Oracle DB instances.  Mounted DB replicas are included in Oracle Database Enterprise Edition. The main use case for mounted replicas is cross-Region disaster recovery. The primary database doesn't use Active Data Guard to transmit information to the mounted replica. Because it doesn't accept user connections, a mounted replica can't serve a read-only workload. You can create a combination of mounted and read-only DB replicas for the same primary DB instance. For more information, see Working with Oracle Read Replicas for Amazon RDS in the Amazon RDS User Guide. For RDS Custom, you must specify this parameter and set it to mounted. The value won't be set by default. After replica creation, you can manage the open mode manually.
     */
    ReplicaMode?: ReplicaMode;
    /**
     * The upper limit in gibibytes (GiB) to which Amazon RDS can automatically scale the storage of the DB instance. For more information about this setting, including limitations that apply to it, see  Managing capacity automatically with Amazon RDS storage autoscaling in the Amazon RDS User Guide.
     */
    MaxAllocatedStorage?: IntegerOptional;
    /**
     * The instance profile associated with the underlying Amazon EC2 instance of an RDS Custom DB instance. The instance profile must meet the following requirements:   The profile must exist in your account.   The profile must have an IAM role that Amazon EC2 has permissions to assume.   The instance profile name and the associated IAM role name must start with the prefix AWSRDSCustom.   For the list of permissions required for the IAM role, see  Configure IAM and your VPC in the Amazon RDS User Guide. This setting is required for RDS Custom DB instances.
     */
    CustomIamInstanceProfile?: String;
    /**
     * The network type of the DB instance. Valid Values:    IPV4     DUAL    The network type is determined by the DBSubnetGroup specified for read replica. A DBSubnetGroup can support only the IPv4 protocol or the IPv4 and the IPv6 protocols (DUAL). For more information, see  Working with a DB instance in a VPC in the Amazon RDS User Guide. 
     */
    NetworkType?: String;
    /**
     * Specifies the storage throughput value for the read replica. This setting doesn't apply to RDS Custom or Amazon Aurora DB instances.
     */
    StorageThroughput?: IntegerOptional;
    /**
     * Specifies whether to enable a customer-owned IP address (CoIP) for an RDS on Outposts read replica. A CoIP provides local or external connectivity to resources in your Outpost subnets through your on-premises network. For some use cases, a CoIP can provide lower latency for connections to the read replica from outside of its virtual private cloud (VPC) on your local network. For more information about RDS on Outposts, see Working with Amazon RDS on Amazon Web Services Outposts in the Amazon RDS User Guide. For more information about CoIPs, see Customer-owned IP addresses in the Amazon Web Services Outposts User Guide.
     */
    EnableCustomerOwnedIp?: BooleanOptional;
    /**
     * The amount of storage (in gibibytes) to allocate initially for the read replica. Follow the allocation rules specified in CreateDBInstance.  Be sure to allocate enough storage for your read replica so that the create operation can succeed. You can also allocate additional storage for future growth. 
     */
    AllocatedStorage?: IntegerOptional;
    /**
     * The identifier of the Multi-AZ DB cluster that will act as the source for the read replica. Each DB cluster can have up to 15 read replicas. Constraints:   Must be the identifier of an existing Multi-AZ DB cluster.   Can't be specified if the SourceDBInstanceIdentifier parameter is also specified.   The specified DB cluster must have automatic backups enabled, that is, its backup retention period must be greater than 0.   The source DB cluster must be in the same Amazon Web Services Region as the read replica. Cross-Region replication isn't supported.  
     */
    SourceDBClusterIdentifier?: String;
    /**
     * Indicates whether the DB instance has a dedicated log volume (DLV) enabled.
     */
    DedicatedLogVolume?: BooleanOptional;
    /**
     * The ID of the region that contains the source for the read replica.
     */
    SourceRegion?: String;
  }
  export interface CreateDBInstanceReadReplicaResult {
    DBInstance?: DBInstance;
  }
  export interface CreateDBInstanceResult {
    DBInstance?: DBInstance;
  }
  export interface CreateDBParameterGroupMessage {
    /**
     * The name of the DB parameter group. Constraints:   Must be 1 to 255 letters, numbers, or hyphens.   First character must be a letter   Can't end with a hyphen or contain two consecutive hyphens    This value is stored as a lowercase string. 
     */
    DBParameterGroupName: String;
    /**
     * The DB parameter group family name. A DB parameter group can be associated with one and only one DB parameter group family, and can be applied only to a DB instance running a database engine and engine version compatible with that DB parameter group family. To list all of the available parameter group families for a DB engine, use the following command:  aws rds describe-db-engine-versions --query "DBEngineVersions[].DBParameterGroupFamily" --engine &lt;engine&gt;  For example, to list all of the available parameter group families for the MySQL DB engine, use the following command:  aws rds describe-db-engine-versions --query "DBEngineVersions[].DBParameterGroupFamily" --engine mysql   The output contains duplicates.  The following are the valid DB engine values:    aurora-mysql     aurora-postgresql     mariadb     mysql     oracle-ee     oracle-ee-cdb     oracle-se2     oracle-se2-cdb     postgres     sqlserver-ee     sqlserver-se     sqlserver-ex     sqlserver-web   
     */
    DBParameterGroupFamily: String;
    /**
     * The description for the DB parameter group.
     */
    Description: String;
    /**
     * Tags to assign to the DB parameter group.
     */
    Tags?: TagList;
  }
  export interface CreateDBParameterGroupResult {
    DBParameterGroup?: DBParameterGroup;
  }
  export interface CreateDBProxyEndpointRequest {
    /**
     * The name of the DB proxy associated with the DB proxy endpoint that you create.
     */
    DBProxyName: DBProxyName;
    /**
     * The name of the DB proxy endpoint to create.
     */
    DBProxyEndpointName: DBProxyEndpointName;
    /**
     * The VPC subnet IDs for the DB proxy endpoint that you create. You can specify a different set of subnet IDs than for the original DB proxy.
     */
    VpcSubnetIds: StringList;
    /**
     * The VPC security group IDs for the DB proxy endpoint that you create. You can specify a different set of security group IDs than for the original DB proxy. The default is the default security group for the VPC.
     */
    VpcSecurityGroupIds?: StringList;
    /**
     * The role of the DB proxy endpoint. The role determines whether the endpoint can be used for read/write or only read operations. The default is READ_WRITE. The only role that proxies for RDS for Microsoft SQL Server support is READ_WRITE.
     */
    TargetRole?: DBProxyEndpointTargetRole;
    Tags?: TagList;
  }
  export interface CreateDBProxyEndpointResponse {
    /**
     * The DBProxyEndpoint object that is created by the API operation. The DB proxy endpoint that you create might provide capabilities such as read/write or read-only operations, or using a different VPC than the proxy's default VPC.
     */
    DBProxyEndpoint?: DBProxyEndpoint;
  }
  export interface CreateDBProxyRequest {
    /**
     * The identifier for the proxy. This name must be unique for all proxies owned by your Amazon Web Services account in the specified Amazon Web Services Region. An identifier must begin with a letter and must contain only ASCII letters, digits, and hyphens; it can't end with a hyphen or contain two consecutive hyphens.
     */
    DBProxyName: String;
    /**
     * The kinds of databases that the proxy can connect to. This value determines which database network protocol the proxy recognizes when it interprets network traffic to and from the database. For Aurora MySQL, RDS for MariaDB, and RDS for MySQL databases, specify MYSQL. For Aurora PostgreSQL and RDS for PostgreSQL databases, specify POSTGRESQL. For RDS for Microsoft SQL Server, specify SQLSERVER.
     */
    EngineFamily: EngineFamily;
    /**
     * The authorization mechanism that the proxy uses.
     */
    Auth: UserAuthConfigList;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that the proxy uses to access secrets in Amazon Web Services Secrets Manager.
     */
    RoleArn: String;
    /**
     * One or more VPC subnet IDs to associate with the new proxy.
     */
    VpcSubnetIds: StringList;
    /**
     * One or more VPC security group IDs to associate with the new proxy.
     */
    VpcSecurityGroupIds?: StringList;
    /**
     * Specifies whether Transport Layer Security (TLS) encryption is required for connections to the proxy. By enabling this setting, you can enforce encrypted TLS connections to the proxy.
     */
    RequireTLS?: Boolean;
    /**
     * The number of seconds that a connection to the proxy can be inactive before the proxy disconnects it. You can set this value higher or lower than the connection timeout limit for the associated database.
     */
    IdleClientTimeout?: IntegerOptional;
    /**
     * Specifies whether the proxy includes detailed information about SQL statements in its logs. This information helps you to debug issues involving SQL behavior or the performance and scalability of the proxy connections. The debug information includes the text of SQL statements that you submit through the proxy. Thus, only enable this setting when needed for debugging, and only when you have security measures in place to safeguard any sensitive information that appears in the logs.
     */
    DebugLogging?: Boolean;
    /**
     * An optional set of key-value pairs to associate arbitrary data of your choosing with the proxy.
     */
    Tags?: TagList;
  }
  export interface CreateDBProxyResponse {
    /**
     * The DBProxy structure corresponding to the new proxy.
     */
    DBProxy?: DBProxy;
  }
  export interface CreateDBSecurityGroupMessage {
    /**
     * The name for the DB security group. This value is stored as a lowercase string. Constraints:   Must be 1 to 255 letters, numbers, or hyphens.   First character must be a letter   Can't end with a hyphen or contain two consecutive hyphens   Must not be "Default"   Example: mysecuritygroup 
     */
    DBSecurityGroupName: String;
    /**
     * The description for the DB security group.
     */
    DBSecurityGroupDescription: String;
    /**
     * Tags to assign to the DB security group.
     */
    Tags?: TagList;
  }
  export interface CreateDBSecurityGroupResult {
    DBSecurityGroup?: DBSecurityGroup;
  }
  export interface CreateDBSnapshotMessage {
    /**
     * The identifier for the DB snapshot. Constraints:   Can't be null, empty, or blank   Must contain from 1 to 255 letters, numbers, or hyphens   First character must be a letter   Can't end with a hyphen or contain two consecutive hyphens   Example: my-snapshot-id 
     */
    DBSnapshotIdentifier: String;
    /**
     * The identifier of the DB instance that you want to create the snapshot of. Constraints:   Must match the identifier of an existing DBInstance.  
     */
    DBInstanceIdentifier: String;
    Tags?: TagList;
  }
  export interface CreateDBSnapshotResult {
    DBSnapshot?: DBSnapshot;
  }
  export interface CreateDBSubnetGroupMessage {
    /**
     * The name for the DB subnet group. This value is stored as a lowercase string. Constraints:   Must contain no more than 255 letters, numbers, periods, underscores, spaces, or hyphens.   Must not be default.   First character must be a letter.   Example: mydbsubnetgroup 
     */
    DBSubnetGroupName: String;
    /**
     * The description for the DB subnet group.
     */
    DBSubnetGroupDescription: String;
    /**
     * The EC2 Subnet IDs for the DB subnet group.
     */
    SubnetIds: SubnetIdentifierList;
    /**
     * Tags to assign to the DB subnet group.
     */
    Tags?: TagList;
  }
  export interface CreateDBSubnetGroupResult {
    DBSubnetGroup?: DBSubnetGroup;
  }
  export interface CreateEventSubscriptionMessage {
    /**
     * The name of the subscription. Constraints: The name must be less than 255 characters.
     */
    SubscriptionName: String;
    /**
     * The Amazon Resource Name (ARN) of the SNS topic created for event notification. The ARN is created by Amazon SNS when you create a topic and subscribe to it.
     */
    SnsTopicArn: String;
    /**
     * The type of source that is generating the events. For example, if you want to be notified of events generated by a DB instance, you set this parameter to db-instance. For RDS Proxy events, specify db-proxy. If this value isn't specified, all events are returned. Valid Values: db-instance | db-cluster | db-parameter-group | db-security-group | db-snapshot | db-cluster-snapshot | db-proxy 
     */
    SourceType?: String;
    /**
     * A list of event categories for a particular source type (SourceType) that you want to subscribe to. You can see a list of the categories for a given source type in the "Amazon RDS event categories and event messages" section of the  Amazon RDS User Guide  or the  Amazon Aurora User Guide . You can also see this list by using the DescribeEventCategories operation.
     */
    EventCategories?: EventCategoriesList;
    /**
     * The list of identifiers of the event sources for which events are returned. If not specified, then all sources are included in the response. An identifier must begin with a letter and must contain only ASCII letters, digits, and hyphens. It can't end with a hyphen or contain two consecutive hyphens. Constraints:   If SourceIds are supplied, SourceType must also be provided.   If the source type is a DB instance, a DBInstanceIdentifier value must be supplied.   If the source type is a DB cluster, a DBClusterIdentifier value must be supplied.   If the source type is a DB parameter group, a DBParameterGroupName value must be supplied.   If the source type is a DB security group, a DBSecurityGroupName value must be supplied.   If the source type is a DB snapshot, a DBSnapshotIdentifier value must be supplied.   If the source type is a DB cluster snapshot, a DBClusterSnapshotIdentifier value must be supplied.   If the source type is an RDS Proxy, a DBProxyName value must be supplied.  
     */
    SourceIds?: SourceIdsList;
    /**
     * Specifies whether to activate the subscription. If the event notification subscription isn't activated, the subscription is created but not active.
     */
    Enabled?: BooleanOptional;
    Tags?: TagList;
  }
  export interface CreateEventSubscriptionResult {
    EventSubscription?: EventSubscription;
  }
  export interface CreateGlobalClusterMessage {
    /**
     * The cluster identifier for this global database cluster. This parameter is stored as a lowercase string.
     */
    GlobalClusterIdentifier?: String;
    /**
     * The Amazon Resource Name (ARN) to use as the primary cluster of the global database. If you provide a value for this parameter, don't specify values for the following settings because Amazon Aurora uses the values from the specified source DB cluster:    DatabaseName     Engine     EngineVersion     StorageEncrypted   
     */
    SourceDBClusterIdentifier?: String;
    /**
     * The database engine to use for this global database cluster. Valid Values: aurora-mysql | aurora-postgresql  Constraints:   Can't be specified if SourceDBClusterIdentifier is specified. In this case, Amazon Aurora uses the engine of the source DB cluster.  
     */
    Engine?: String;
    /**
     * The engine version to use for this global database cluster. Constraints:   Can't be specified if SourceDBClusterIdentifier is specified. In this case, Amazon Aurora uses the engine version of the source DB cluster.  
     */
    EngineVersion?: String;
    /**
     * Specifies whether to enable deletion protection for the new global database cluster. The global database can't be deleted when deletion protection is enabled.
     */
    DeletionProtection?: BooleanOptional;
    /**
     * The name for your database of up to 64 alphanumeric characters. If you don't specify a name, Amazon Aurora doesn't create a database in the global database cluster. Constraints:   Can't be specified if SourceDBClusterIdentifier is specified. In this case, Amazon Aurora uses the database name from the source DB cluster.  
     */
    DatabaseName?: String;
    /**
     * Specifies whether to enable storage encryption for the new global database cluster. Constraints:   Can't be specified if SourceDBClusterIdentifier is specified. In this case, Amazon Aurora uses the setting from the source DB cluster.  
     */
    StorageEncrypted?: BooleanOptional;
  }
  export interface CreateGlobalClusterResult {
    GlobalCluster?: GlobalCluster;
  }
  export interface CreateOptionGroupMessage {
    /**
     * Specifies the name of the option group to be created. Constraints:   Must be 1 to 255 letters, numbers, or hyphens   First character must be a letter   Can't end with a hyphen or contain two consecutive hyphens   Example: myoptiongroup 
     */
    OptionGroupName: String;
    /**
     * Specifies the name of the engine that this option group should be associated with. Valid Values:    mariadb     mysql     oracle-ee     oracle-ee-cdb     oracle-se2     oracle-se2-cdb     postgres     sqlserver-ee     sqlserver-se     sqlserver-ex     sqlserver-web   
     */
    EngineName: String;
    /**
     * Specifies the major version of the engine that this option group should be associated with.
     */
    MajorEngineVersion: String;
    /**
     * The description of the option group.
     */
    OptionGroupDescription: String;
    /**
     * Tags to assign to the option group.
     */
    Tags?: TagList;
  }
  export interface CreateOptionGroupResult {
    OptionGroup?: OptionGroup;
  }
  export interface CustomDBEngineVersionAMI {
    /**
     * A value that indicates the ID of the AMI.
     */
    ImageId?: String;
    /**
     * A value that indicates the status of a custom engine version (CEV).
     */
    Status?: String;
  }
  export type CustomDBEngineVersionManifest = string;
  export type CustomEngineName = string;
  export type CustomEngineVersion = string;
  export type CustomEngineVersionStatus = "available"|"inactive"|"inactive-except-restore"|string;
  export interface DBCluster {
    /**
     * For all database engines except Amazon Aurora, AllocatedStorage specifies the allocated storage size in gibibytes (GiB). For Aurora, AllocatedStorage always returns 1, because Aurora DB cluster storage size isn't fixed, but instead automatically adjusts as needed.
     */
    AllocatedStorage?: IntegerOptional;
    /**
     * The list of Availability Zones (AZs) where instances in the DB cluster can be created.
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * The number of days for which automatic DB snapshots are retained.
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * If present, specifies the name of the character set that this cluster is associated with.
     */
    CharacterSetName?: String;
    /**
     * The name of the initial database that was specified for the DB cluster when it was created, if one was provided. This same name is returned for the life of the DB cluster.
     */
    DatabaseName?: String;
    /**
     * The user-supplied identifier for the DB cluster. This identifier is the unique key that identifies a DB cluster.
     */
    DBClusterIdentifier?: String;
    /**
     * The name of the DB cluster parameter group for the DB cluster.
     */
    DBClusterParameterGroup?: String;
    /**
     * Information about the subnet group associated with the DB cluster, including the name, description, and subnets in the subnet group.
     */
    DBSubnetGroup?: String;
    /**
     * The current state of this DB cluster.
     */
    Status?: String;
    /**
     * The time when a stopped DB cluster is restarted automatically.
     */
    AutomaticRestartTime?: TStamp;
    /**
     * The progress of the operation as a percentage.
     */
    PercentProgress?: String;
    /**
     * The earliest time to which a database can be restored with point-in-time restore.
     */
    EarliestRestorableTime?: TStamp;
    /**
     * The connection endpoint for the primary instance of the DB cluster.
     */
    Endpoint?: String;
    /**
     * The reader endpoint for the DB cluster. The reader endpoint for a DB cluster load-balances connections across the Aurora Replicas that are available in a DB cluster. As clients request new connections to the reader endpoint, Aurora distributes the connection requests among the Aurora Replicas in the DB cluster. This functionality can help balance your read workload across multiple Aurora Replicas in your DB cluster. If a failover occurs, and the Aurora Replica that you are connected to is promoted to be the primary instance, your connection is dropped. To continue sending your read workload to other Aurora Replicas in the cluster, you can then reconnect to the reader endpoint.
     */
    ReaderEndpoint?: String;
    /**
     * The custom endpoints associated with the DB cluster.
     */
    CustomEndpoints?: StringList;
    /**
     * Indicates whether the DB cluster has instances in multiple Availability Zones.
     */
    MultiAZ?: BooleanOptional;
    /**
     * The database engine used for this DB cluster.
     */
    Engine?: String;
    /**
     * The version of the database engine.
     */
    EngineVersion?: String;
    /**
     * The latest time to which a database can be restored with point-in-time restore.
     */
    LatestRestorableTime?: TStamp;
    /**
     * The port that the database engine is listening on.
     */
    Port?: IntegerOptional;
    /**
     * The master username for the DB cluster.
     */
    MasterUsername?: String;
    /**
     * The list of option group memberships for this DB cluster.
     */
    DBClusterOptionGroupMemberships?: DBClusterOptionGroupMemberships;
    /**
     * The daily time range during which automated backups are created if automated backups are enabled, as determined by the BackupRetentionPeriod.
     */
    PreferredBackupWindow?: String;
    /**
     * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
     */
    PreferredMaintenanceWindow?: String;
    /**
     * The identifier of the source DB cluster if this DB cluster is a read replica.
     */
    ReplicationSourceIdentifier?: String;
    /**
     * Contains one or more identifiers of the read replicas associated with this DB cluster.
     */
    ReadReplicaIdentifiers?: ReadReplicaIdentifierList;
    /**
     * The list of DB instances that make up the DB cluster.
     */
    DBClusterMembers?: DBClusterMemberList;
    /**
     * The list of VPC security groups that the DB cluster belongs to.
     */
    VpcSecurityGroups?: VpcSecurityGroupMembershipList;
    /**
     * The ID that Amazon Route 53 assigns when you create a hosted zone.
     */
    HostedZoneId?: String;
    /**
     * Indicates whether the DB cluster is encrypted.
     */
    StorageEncrypted?: Boolean;
    /**
     * If StorageEncrypted is enabled, the Amazon Web Services KMS key identifier for the encrypted DB cluster. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key.
     */
    KmsKeyId?: String;
    /**
     * The Amazon Web Services Region-unique, immutable identifier for the DB cluster. This identifier is found in Amazon Web Services CloudTrail log entries whenever the KMS key for the DB cluster is accessed.
     */
    DbClusterResourceId?: String;
    /**
     * The Amazon Resource Name (ARN) for the DB cluster.
     */
    DBClusterArn?: String;
    /**
     * A list of the Amazon Web Services Identity and Access Management (IAM) roles that are associated with the DB cluster. IAM roles that are associated with a DB cluster grant permission for the DB cluster to access other Amazon Web Services on your behalf.
     */
    AssociatedRoles?: DBClusterRoles;
    /**
     * Indicates whether the mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts is enabled.
     */
    IAMDatabaseAuthenticationEnabled?: BooleanOptional;
    /**
     * The ID of the clone group with which the DB cluster is associated.
     */
    CloneGroupId?: String;
    /**
     * The time when the DB cluster was created, in Universal Coordinated Time (UTC).
     */
    ClusterCreateTime?: TStamp;
    /**
     * The earliest time to which a DB cluster can be backtracked.
     */
    EarliestBacktrackTime?: TStamp;
    /**
     * The target backtrack window, in seconds. If this value is set to 0, backtracking is disabled for the DB cluster. Otherwise, backtracking is enabled.
     */
    BacktrackWindow?: LongOptional;
    /**
     * The number of change records stored for Backtrack.
     */
    BacktrackConsumedChangeRecords?: LongOptional;
    /**
     * A list of log types that this DB cluster is configured to export to CloudWatch Logs. Log types vary by DB engine. For information about the log types for each DB engine, see Amazon RDS Database Log Files in the Amazon Aurora User Guide. 
     */
    EnabledCloudwatchLogsExports?: LogTypeList;
    /**
     * The current capacity of an Aurora Serverless v1 DB cluster. The capacity is 0 (zero) when the cluster is paused. For more information about Aurora Serverless v1, see Using Amazon Aurora Serverless v1 in the Amazon Aurora User Guide.
     */
    Capacity?: IntegerOptional;
    /**
     * The DB engine mode of the DB cluster, either provisioned or serverless. For more information, see  CreateDBCluster.
     */
    EngineMode?: String;
    ScalingConfigurationInfo?: ScalingConfigurationInfo;
    /**
     * Indicates whether the DB cluster has deletion protection enabled. The database can't be deleted when deletion protection is enabled.
     */
    DeletionProtection?: BooleanOptional;
    /**
     * Indicates whether the HTTP endpoint for an Aurora Serverless v1 DB cluster is enabled. When enabled, the HTTP endpoint provides a connectionless web service API for running SQL queries on the Aurora Serverless v1 DB cluster. You can also query your database from inside the RDS console with the query editor. For more information, see Using the Data API for Aurora Serverless v1 in the Amazon Aurora User Guide.
     */
    HttpEndpointEnabled?: BooleanOptional;
    /**
     * The mode of the database activity stream. Database events such as a change or access generate an activity stream event. The database session can handle these events either synchronously or asynchronously.
     */
    ActivityStreamMode?: ActivityStreamMode;
    /**
     * The status of the database activity stream.
     */
    ActivityStreamStatus?: ActivityStreamStatus;
    /**
     * The Amazon Web Services KMS key identifier used for encrypting messages in the database activity stream. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key.
     */
    ActivityStreamKmsKeyId?: String;
    /**
     * The name of the Amazon Kinesis data stream used for the database activity stream.
     */
    ActivityStreamKinesisStreamName?: String;
    /**
     * Indicates whether tags are copied from the DB cluster to snapshots of the DB cluster.
     */
    CopyTagsToSnapshot?: BooleanOptional;
    /**
     * Indicates whether the DB cluster is a clone of a DB cluster owned by a different Amazon Web Services account.
     */
    CrossAccountClone?: BooleanOptional;
    /**
     * The Active Directory Domain membership records associated with the DB cluster.
     */
    DomainMemberships?: DomainMembershipList;
    TagList?: TagList;
    /**
     * The status of write forwarding for a secondary cluster in an Aurora global database.
     */
    GlobalWriteForwardingStatus?: WriteForwardingStatus;
    /**
     * Indicates whether write forwarding is enabled for a secondary cluster in an Aurora global database. Because write forwarding takes time to enable, check the value of GlobalWriteForwardingStatus to confirm that the request has completed before using the write forwarding feature for this cluster.
     */
    GlobalWriteForwardingRequested?: BooleanOptional;
    /**
     * Information about pending changes to the DB cluster. This information is returned only when there are pending changes. Specific changes are identified by subelements.
     */
    PendingModifiedValues?: ClusterPendingModifiedValues;
    /**
     * The name of the compute and memory capacity class of the DB instance. This setting is only for non-Aurora Multi-AZ DB clusters.
     */
    DBClusterInstanceClass?: String;
    /**
     * The storage type associated with the DB cluster.
     */
    StorageType?: String;
    /**
     * The Provisioned IOPS (I/O operations per second) value. This setting is only for non-Aurora Multi-AZ DB clusters.
     */
    Iops?: IntegerOptional;
    /**
     * Indicates whether the DB cluster is publicly accessible. When the DB cluster is publicly accessible, its Domain Name System (DNS) endpoint resolves to the private IP address from within the DB cluster's virtual private cloud (VPC). It resolves to the public IP address from outside of the DB cluster's VPC. Access to the DB cluster is ultimately controlled by the security group it uses. That public access isn't permitted if the security group assigned to the DB cluster doesn't permit it. When the DB cluster isn't publicly accessible, it is an internal DB cluster with a DNS name that resolves to a private IP address. For more information, see CreateDBCluster. This setting is only for non-Aurora Multi-AZ DB clusters.
     */
    PubliclyAccessible?: BooleanOptional;
    /**
     * Indicates whether minor version patches are applied automatically. This setting is only for non-Aurora Multi-AZ DB clusters.
     */
    AutoMinorVersionUpgrade?: Boolean;
    /**
     * The interval, in seconds, between points when Enhanced Monitoring metrics are collected for the DB cluster. This setting is only for non-Aurora Multi-AZ DB clusters.
     */
    MonitoringInterval?: IntegerOptional;
    /**
     * The ARN for the IAM role that permits RDS to send Enhanced Monitoring metrics to Amazon CloudWatch Logs. This setting is only for non-Aurora Multi-AZ DB clusters.
     */
    MonitoringRoleArn?: String;
    /**
     * Indicates whether Performance Insights is enabled for the DB cluster. This setting is only for non-Aurora Multi-AZ DB clusters.
     */
    PerformanceInsightsEnabled?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier for encryption of Performance Insights data. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. This setting is only for non-Aurora Multi-AZ DB clusters.
     */
    PerformanceInsightsKMSKeyId?: String;
    /**
     * The number of days to retain Performance Insights data. This setting is only for non-Aurora Multi-AZ DB clusters. Valid Values:    7     month * 31, where month is a number of months from 1-23. Examples: 93 (3 months * 31), 341 (11 months * 31), 589 (19 months * 31)    731    Default: 7 days
     */
    PerformanceInsightsRetentionPeriod?: IntegerOptional;
    ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfigurationInfo;
    /**
     * The network type of the DB instance. The network type is determined by the DBSubnetGroup specified for the DB cluster. A DBSubnetGroup can support only the IPv4 protocol or the IPv4 and the IPv6 protocols (DUAL). For more information, see  Working with a DB instance in a VPC in the Amazon Aurora User Guide.  This setting is only for Aurora DB clusters. Valid Values: IPV4 | DUAL 
     */
    NetworkType?: String;
    /**
     * Reserved for future use.
     */
    DBSystemId?: String;
    /**
     * The secret managed by RDS in Amazon Web Services Secrets Manager for the master user password. For more information, see Password management with Amazon Web Services Secrets Manager in the Amazon RDS User Guide and Password management with Amazon Web Services Secrets Manager in the Amazon Aurora User Guide. 
     */
    MasterUserSecret?: MasterUserSecret;
    /**
     * The next time you can modify the DB cluster to use the aurora-iopt1 storage type. This setting is only for Aurora DB clusters.
     */
    IOOptimizedNextAllowedModificationTime?: TStamp;
    /**
     * Indicates whether an Aurora DB cluster has in-cluster write forwarding enabled, not enabled, requested, or is in the process of enabling it.
     */
    LocalWriteForwardingStatus?: LocalWriteForwardingStatus;
    /**
     * The Amazon Resource Name (ARN) of the recovery point in Amazon Web Services Backup.
     */
    AwsBackupRecoveryPointArn?: String;
  }
  export interface DBClusterAutomatedBackup {
    /**
     * The name of the database engine for this automated backup.
     */
    Engine?: String;
    /**
     * The VPC ID associated with the DB cluster.
     */
    VpcId?: String;
    /**
     * The Amazon Resource Name (ARN) for the automated backups.
     */
    DBClusterAutomatedBackupsArn?: String;
    /**
     * The identifier for the source DB cluster, which can't be changed and which is unique to an Amazon Web Services Region.
     */
    DBClusterIdentifier?: String;
    RestoreWindow?: RestoreWindow;
    /**
     * The master user name of the automated backup.
     */
    MasterUsername?: String;
    /**
     * The resource ID for the source DB cluster, which can't be changed and which is unique to an Amazon Web Services Region.
     */
    DbClusterResourceId?: String;
    /**
     * The Amazon Web Services Region associated with the automated backup.
     */
    Region?: String;
    /**
     * The license model information for this DB cluster automated backup.
     */
    LicenseModel?: String;
    /**
     * A list of status information for an automated backup:    retained - Automated backups for deleted clusters.  
     */
    Status?: String;
    /**
     * Indicates whether mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts is enabled.
     */
    IAMDatabaseAuthenticationEnabled?: Boolean;
    /**
     * The time when the DB cluster was created, in Universal Coordinated Time (UTC).
     */
    ClusterCreateTime?: TStamp;
    /**
     * Indicates whether the source DB cluster is encrypted.
     */
    StorageEncrypted?: Boolean;
    /**
     * For all database engines except Amazon Aurora, AllocatedStorage specifies the allocated storage size in gibibytes (GiB). For Aurora, AllocatedStorage always returns 1, because Aurora DB cluster storage size isn't fixed, but instead automatically adjusts as needed.
     */
    AllocatedStorage?: Integer;
    /**
     * The version of the database engine for the automated backup.
     */
    EngineVersion?: String;
    /**
     * The Amazon Resource Name (ARN) for the source DB cluster.
     */
    DBClusterArn?: String;
    /**
     * The retention period for the automated backups.
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * The engine mode of the database engine for the automated backup.
     */
    EngineMode?: String;
    /**
     * The Availability Zones where instances in the DB cluster can be created. For information on Amazon Web Services Regions and Availability Zones, see Regions and Availability Zones.
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * The port number that the automated backup used for connections. Default: Inherits from the source DB cluster Valid Values: 1150-65535 
     */
    Port?: Integer;
    /**
     * The Amazon Web Services KMS key ID for an automated backup. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key.
     */
    KmsKeyId?: String;
    /**
     * The storage type associated with the DB cluster. This setting is only for non-Aurora Multi-AZ DB clusters.
     */
    StorageType?: String;
    /**
     * The IOPS (I/O operations per second) value for the automated backup. This setting is only for non-Aurora Multi-AZ DB clusters.
     */
    Iops?: IntegerOptional;
    /**
     * The Amazon Resource Name (ARN) of the recovery point in Amazon Web Services Backup.
     */
    AwsBackupRecoveryPointArn?: String;
  }
  export type DBClusterAutomatedBackupList = DBClusterAutomatedBackup[];
  export interface DBClusterAutomatedBackupMessage {
    /**
     * The pagination token provided in the previous request. If this parameter is specified the response includes only records beyond the marker, up to MaxRecords.
     */
    Marker?: String;
    /**
     * A list of DBClusterAutomatedBackup backups.
     */
    DBClusterAutomatedBackups?: DBClusterAutomatedBackupList;
  }
  export interface DBClusterBacktrack {
    /**
     * Contains a user-supplied DB cluster identifier. This identifier is the unique key that identifies a DB cluster.
     */
    DBClusterIdentifier?: String;
    /**
     * Contains the backtrack identifier.
     */
    BacktrackIdentifier?: String;
    /**
     * The timestamp of the time to which the DB cluster was backtracked.
     */
    BacktrackTo?: TStamp;
    /**
     * The timestamp of the time from which the DB cluster was backtracked.
     */
    BacktrackedFrom?: TStamp;
    /**
     * The timestamp of the time at which the backtrack was requested.
     */
    BacktrackRequestCreationTime?: TStamp;
    /**
     * The status of the backtrack. This property returns one of the following values:    applying - The backtrack is currently being applied to or rolled back from the DB cluster.    completed - The backtrack has successfully been applied to or rolled back from the DB cluster.    failed - An error occurred while the backtrack was applied to or rolled back from the DB cluster.    pending - The backtrack is currently pending application to or rollback from the DB cluster.  
     */
    Status?: String;
  }
  export type DBClusterBacktrackList = DBClusterBacktrack[];
  export interface DBClusterBacktrackMessage {
    /**
     * A pagination token that can be used in a later DescribeDBClusterBacktracks request.
     */
    Marker?: String;
    /**
     * Contains a list of backtracks for the user.
     */
    DBClusterBacktracks?: DBClusterBacktrackList;
  }
  export interface DBClusterCapacityInfo {
    /**
     * A user-supplied DB cluster identifier. This identifier is the unique key that identifies a DB cluster.
     */
    DBClusterIdentifier?: String;
    /**
     * A value that specifies the capacity that the DB cluster scales to next.
     */
    PendingCapacity?: IntegerOptional;
    /**
     * The current capacity of the DB cluster.
     */
    CurrentCapacity?: IntegerOptional;
    /**
     * The number of seconds before a call to ModifyCurrentDBClusterCapacity times out.
     */
    SecondsBeforeTimeout?: IntegerOptional;
    /**
     * The timeout action of a call to ModifyCurrentDBClusterCapacity, either ForceApplyCapacityChange or RollbackCapacityChange.
     */
    TimeoutAction?: String;
  }
  export interface DBClusterEndpoint {
    /**
     * The identifier associated with the endpoint. This parameter is stored as a lowercase string.
     */
    DBClusterEndpointIdentifier?: String;
    /**
     * The DB cluster identifier of the DB cluster associated with the endpoint. This parameter is stored as a lowercase string.
     */
    DBClusterIdentifier?: String;
    /**
     * A unique system-generated identifier for an endpoint. It remains the same for the whole life of the endpoint.
     */
    DBClusterEndpointResourceIdentifier?: String;
    /**
     * The DNS address of the endpoint.
     */
    Endpoint?: String;
    /**
     * The current status of the endpoint. One of: creating, available, deleting, inactive, modifying. The inactive state applies to an endpoint that can't be used for a certain kind of cluster, such as a writer endpoint for a read-only secondary cluster in a global database.
     */
    Status?: String;
    /**
     * The type of the endpoint. One of: READER, WRITER, CUSTOM.
     */
    EndpointType?: String;
    /**
     * The type associated with a custom endpoint. One of: READER, WRITER, ANY.
     */
    CustomEndpointType?: String;
    /**
     * List of DB instance identifiers that are part of the custom endpoint group.
     */
    StaticMembers?: StringList;
    /**
     * List of DB instance identifiers that aren't part of the custom endpoint group. All other eligible instances are reachable through the custom endpoint. Only relevant if the list of static members is empty.
     */
    ExcludedMembers?: StringList;
    /**
     * The Amazon Resource Name (ARN) for the endpoint.
     */
    DBClusterEndpointArn?: String;
  }
  export type DBClusterEndpointList = DBClusterEndpoint[];
  export interface DBClusterEndpointMessage {
    /**
     * An optional pagination token provided by a previous DescribeDBClusterEndpoints request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * Contains the details of the endpoints associated with the cluster and matching any filter conditions.
     */
    DBClusterEndpoints?: DBClusterEndpointList;
  }
  export type DBClusterIdentifier = string;
  export type DBClusterList = DBCluster[];
  export interface DBClusterMember {
    /**
     * Specifies the instance identifier for this member of the DB cluster.
     */
    DBInstanceIdentifier?: String;
    /**
     * Indicates whether the cluster member is the primary DB instance for the DB cluster.
     */
    IsClusterWriter?: Boolean;
    /**
     * Specifies the status of the DB cluster parameter group for this member of the DB cluster.
     */
    DBClusterParameterGroupStatus?: String;
    /**
     * A value that specifies the order in which an Aurora Replica is promoted to the primary instance after a failure of the existing primary instance. For more information, see  Fault Tolerance for an Aurora DB Cluster in the Amazon Aurora User Guide.
     */
    PromotionTier?: IntegerOptional;
  }
  export type DBClusterMemberList = DBClusterMember[];
  export interface DBClusterMessage {
    /**
     * A pagination token that can be used in a later DescribeDBClusters request.
     */
    Marker?: String;
    /**
     * Contains a list of DB clusters for the user.
     */
    DBClusters?: DBClusterList;
  }
  export type DBClusterOptionGroupMemberships = DBClusterOptionGroupStatus[];
  export interface DBClusterOptionGroupStatus {
    /**
     * Specifies the name of the DB cluster option group.
     */
    DBClusterOptionGroupName?: String;
    /**
     * Specifies the status of the DB cluster option group.
     */
    Status?: String;
  }
  export interface DBClusterParameterGroup {
    /**
     * The name of the DB cluster parameter group.
     */
    DBClusterParameterGroupName?: String;
    /**
     * The name of the DB parameter group family that this DB cluster parameter group is compatible with.
     */
    DBParameterGroupFamily?: String;
    /**
     * Provides the customer-specified description for this DB cluster parameter group.
     */
    Description?: String;
    /**
     * The Amazon Resource Name (ARN) for the DB cluster parameter group.
     */
    DBClusterParameterGroupArn?: String;
  }
  export interface DBClusterParameterGroupDetails {
    /**
     * Provides a list of parameters for the DB cluster parameter group.
     */
    Parameters?: ParametersList;
    /**
     * An optional pagination token provided by a previous DescribeDBClusterParameters request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export type DBClusterParameterGroupList = DBClusterParameterGroup[];
  export interface DBClusterParameterGroupNameMessage {
    /**
     * The name of the DB cluster parameter group. Constraints:   Must be 1 to 255 letters or numbers.   First character must be a letter   Can't end with a hyphen or contain two consecutive hyphens    This value is stored as a lowercase string. 
     */
    DBClusterParameterGroupName?: String;
  }
  export interface DBClusterParameterGroupsMessage {
    /**
     * An optional pagination token provided by a previous DescribeDBClusterParameterGroups request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of DB cluster parameter groups.
     */
    DBClusterParameterGroups?: DBClusterParameterGroupList;
  }
  export interface DBClusterRole {
    /**
     * The Amazon Resource Name (ARN) of the IAM role that is associated with the DB cluster.
     */
    RoleArn?: String;
    /**
     * Describes the state of association between the IAM role and the DB cluster. The Status property returns one of the following values:    ACTIVE - the IAM role ARN is associated with the DB cluster and can be used to access other Amazon Web Services on your behalf.    PENDING - the IAM role ARN is being associated with the DB cluster.    INVALID - the IAM role ARN is associated with the DB cluster, but the DB cluster is unable to assume the IAM role in order to access other Amazon Web Services on your behalf.  
     */
    Status?: String;
    /**
     * The name of the feature associated with the Amazon Web Services Identity and Access Management (IAM) role. For information about supported feature names, see DBEngineVersion.
     */
    FeatureName?: String;
  }
  export type DBClusterRoles = DBClusterRole[];
  export interface DBClusterSnapshot {
    /**
     * The list of Availability Zones (AZs) where instances in the DB cluster snapshot can be restored.
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * The identifier for the DB cluster snapshot.
     */
    DBClusterSnapshotIdentifier?: String;
    /**
     * The DB cluster identifier of the DB cluster that this DB cluster snapshot was created from.
     */
    DBClusterIdentifier?: String;
    /**
     * The time when the snapshot was taken, in Universal Coordinated Time (UTC).
     */
    SnapshotCreateTime?: TStamp;
    /**
     * The name of the database engine for this DB cluster snapshot.
     */
    Engine?: String;
    /**
     * The engine mode of the database engine for this DB cluster snapshot.
     */
    EngineMode?: String;
    /**
     * The allocated storage size of the DB cluster snapshot in gibibytes (GiB).
     */
    AllocatedStorage?: Integer;
    /**
     * The status of this DB cluster snapshot. Valid statuses are the following:    available     copying     creating   
     */
    Status?: String;
    /**
     * The port that the DB cluster was listening on at the time of the snapshot.
     */
    Port?: Integer;
    /**
     * The VPC ID associated with the DB cluster snapshot.
     */
    VpcId?: String;
    /**
     * The time when the DB cluster was created, in Universal Coordinated Time (UTC).
     */
    ClusterCreateTime?: TStamp;
    /**
     * The master username for this DB cluster snapshot.
     */
    MasterUsername?: String;
    /**
     * The version of the database engine for this DB cluster snapshot.
     */
    EngineVersion?: String;
    /**
     * The license model information for this DB cluster snapshot.
     */
    LicenseModel?: String;
    /**
     * The type of the DB cluster snapshot.
     */
    SnapshotType?: String;
    /**
     * The percentage of the estimated data that has been transferred.
     */
    PercentProgress?: Integer;
    /**
     * Indicates whether the DB cluster snapshot is encrypted.
     */
    StorageEncrypted?: Boolean;
    /**
     * If StorageEncrypted is true, the Amazon Web Services KMS key identifier for the encrypted DB cluster snapshot. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key.
     */
    KmsKeyId?: String;
    /**
     * The Amazon Resource Name (ARN) for the DB cluster snapshot.
     */
    DBClusterSnapshotArn?: String;
    /**
     * If the DB cluster snapshot was copied from a source DB cluster snapshot, the Amazon Resource Name (ARN) for the source DB cluster snapshot, otherwise, a null value.
     */
    SourceDBClusterSnapshotArn?: String;
    /**
     * Indicates whether mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts is enabled.
     */
    IAMDatabaseAuthenticationEnabled?: Boolean;
    TagList?: TagList;
    /**
     * Reserved for future use.
     */
    DBSystemId?: String;
    /**
     * The storage type associated with the DB cluster snapshot. This setting is only for Aurora DB clusters.
     */
    StorageType?: String;
    /**
     * The resource ID of the DB cluster that this DB cluster snapshot was created from.
     */
    DbClusterResourceId?: String;
  }
  export interface DBClusterSnapshotAttribute {
    /**
     * The name of the manual DB cluster snapshot attribute. The attribute named restore refers to the list of Amazon Web Services accounts that have permission to copy or restore the manual DB cluster snapshot. For more information, see the ModifyDBClusterSnapshotAttribute API action.
     */
    AttributeName?: String;
    /**
     * The value(s) for the manual DB cluster snapshot attribute. If the AttributeName field is set to restore, then this element returns a list of IDs of the Amazon Web Services accounts that are authorized to copy or restore the manual DB cluster snapshot. If a value of all is in the list, then the manual DB cluster snapshot is public and available for any Amazon Web Services account to copy or restore.
     */
    AttributeValues?: AttributeValueList;
  }
  export type DBClusterSnapshotAttributeList = DBClusterSnapshotAttribute[];
  export interface DBClusterSnapshotAttributesResult {
    /**
     * The identifier of the manual DB cluster snapshot that the attributes apply to.
     */
    DBClusterSnapshotIdentifier?: String;
    /**
     * The list of attributes and values for the manual DB cluster snapshot.
     */
    DBClusterSnapshotAttributes?: DBClusterSnapshotAttributeList;
  }
  export type DBClusterSnapshotList = DBClusterSnapshot[];
  export interface DBClusterSnapshotMessage {
    /**
     * An optional pagination token provided by a previous DescribeDBClusterSnapshots request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * Provides a list of DB cluster snapshots for the user.
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
     * The name of the DB parameter group family for the database engine.
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
     * The default character set for new instances of this engine version, if the CharacterSetName parameter of the CreateDBInstance API isn't specified.
     */
    DefaultCharacterSet?: CharacterSet;
    /**
     * The EC2 image
     */
    Image?: CustomDBEngineVersionAMI;
    /**
     * A value that indicates the source media provider of the AMI based on the usage operation. Applicable for RDS Custom for SQL Server.
     */
    DBEngineMediaType?: String;
    /**
     * A list of the character sets supported by this engine for the CharacterSetName parameter of the CreateDBInstance operation.
     */
    SupportedCharacterSets?: SupportedCharacterSetsList;
    /**
     * A list of the character sets supported by the Oracle DB engine for the NcharCharacterSetName parameter of the CreateDBInstance operation.
     */
    SupportedNcharCharacterSets?: SupportedCharacterSetsList;
    /**
     * A list of engine versions that this database engine version can be upgraded to.
     */
    ValidUpgradeTarget?: ValidUpgradeTargetList;
    /**
     * A list of the time zones supported by this engine for the Timezone parameter of the CreateDBInstance action.
     */
    SupportedTimezones?: SupportedTimezonesList;
    /**
     * The types of logs that the database engine has available for export to CloudWatch Logs.
     */
    ExportableLogTypes?: LogTypeList;
    /**
     * Indicates whether the engine version supports exporting the log types specified by ExportableLogTypes to CloudWatch Logs.
     */
    SupportsLogExportsToCloudwatchLogs?: Boolean;
    /**
     * Indicates whether the database engine version supports read replicas.
     */
    SupportsReadReplica?: Boolean;
    /**
     * A list of the supported DB engine modes.
     */
    SupportedEngineModes?: EngineModeList;
    /**
     * A list of features supported by the DB engine. The supported features vary by DB engine and DB engine version. To determine the supported features for a specific DB engine and DB engine version using the CLI, use the following command:  aws rds describe-db-engine-versions --engine &lt;engine_name&gt; --engine-version &lt;engine_version&gt;  For example, to determine the supported features for RDS for PostgreSQL version 13.3 using the CLI, use the following command:  aws rds describe-db-engine-versions --engine postgres --engine-version 13.3  The supported features are listed under SupportedFeatureNames in the output.
     */
    SupportedFeatureNames?: FeatureNameList;
    /**
     * The status of the DB engine version, either available or deprecated.
     */
    Status?: String;
    /**
     * Indicates whether you can use Aurora parallel query with a specific DB engine version.
     */
    SupportsParallelQuery?: Boolean;
    /**
     * Indicates whether you can use Aurora global databases with a specific DB engine version.
     */
    SupportsGlobalDatabases?: Boolean;
    /**
     * The major engine version of the CEV.
     */
    MajorEngineVersion?: String;
    /**
     * The name of the Amazon S3 bucket that contains your database installation files.
     */
    DatabaseInstallationFilesS3BucketName?: String;
    /**
     * The Amazon S3 directory that contains the database installation files. If not specified, then no prefix is assumed.
     */
    DatabaseInstallationFilesS3Prefix?: String;
    /**
     * The ARN of the custom engine version.
     */
    DBEngineVersionArn?: String;
    /**
     * The Amazon Web Services KMS key identifier for an encrypted CEV. This parameter is required for RDS Custom, but optional for Amazon RDS.
     */
    KMSKeyId?: String;
    /**
     * The creation time of the DB engine version.
     */
    CreateTime?: TStamp;
    TagList?: TagList;
    /**
     * Indicates whether the engine version supports Babelfish for Aurora PostgreSQL.
     */
    SupportsBabelfish?: Boolean;
    /**
     * JSON string that lists the installation files and parameters that RDS Custom uses to create a custom engine version (CEV). RDS Custom applies the patches in the order in which they're listed in the manifest. You can set the Oracle home, Oracle base, and UNIX/Linux user and group using the installation parameters. For more information, see JSON fields in the CEV manifest in the Amazon RDS User Guide. 
     */
    CustomDBEngineVersionManifest?: CustomDBEngineVersionManifest;
    /**
     * Indicates whether the engine version supports rotating the server certificate without rebooting the DB instance.
     */
    SupportsCertificateRotationWithoutRestart?: BooleanOptional;
    /**
     * A list of the supported CA certificate identifiers. For more information, see Using SSL/TLS to encrypt a connection to a DB instance in the Amazon RDS User Guide and  Using SSL/TLS to encrypt a connection to a DB cluster in the Amazon Aurora User Guide.
     */
    SupportedCACertificateIdentifiers?: CACertificateIdentifiersList;
    /**
     * Indicates whether the DB engine version supports forwarding write operations from reader DB instances to the writer DB instance in the DB cluster. By default, write operations aren't allowed on reader DB instances. Valid for: Aurora DB clusters only
     */
    SupportsLocalWriteForwarding?: BooleanOptional;
  }
  export type DBEngineVersionList = DBEngineVersion[];
  export interface DBEngineVersionMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of DBEngineVersion elements.
     */
    DBEngineVersions?: DBEngineVersionList;
  }
  export interface DBInstance {
    /**
     * The user-supplied database identifier. This identifier is the unique key that identifies a DB instance.
     */
    DBInstanceIdentifier?: String;
    /**
     * The name of the compute and memory capacity class of the DB instance.
     */
    DBInstanceClass?: String;
    /**
     * The database engine used for this DB instance.
     */
    Engine?: String;
    /**
     * The current state of this database. For information about DB instance statuses, see Viewing DB instance status in the Amazon RDS User Guide. 
     */
    DBInstanceStatus?: String;
    /**
     * The time when a stopped DB instance is restarted automatically.
     */
    AutomaticRestartTime?: TStamp;
    /**
     * The master username for the DB instance.
     */
    MasterUsername?: String;
    /**
     * Contains the initial database name that you provided (if required) when you created the DB instance. This name is returned for the life of your DB instance. For an RDS for Oracle CDB instance, the name identifies the PDB rather than the CDB.
     */
    DBName?: String;
    /**
     * The connection endpoint for the DB instance.  The endpoint might not be shown for instances with the status of creating. 
     */
    Endpoint?: Endpoint;
    /**
     * The amount of storage in gibibytes (GiB) allocated for the DB instance.
     */
    AllocatedStorage?: Integer;
    /**
     * The date and time when the DB instance was created.
     */
    InstanceCreateTime?: TStamp;
    /**
     * The daily time range during which automated backups are created if automated backups are enabled, as determined by the BackupRetentionPeriod.
     */
    PreferredBackupWindow?: String;
    /**
     * The number of days for which automatic DB snapshots are retained.
     */
    BackupRetentionPeriod?: Integer;
    /**
     * A list of DB security group elements containing DBSecurityGroup.Name and DBSecurityGroup.Status subelements.
     */
    DBSecurityGroups?: DBSecurityGroupMembershipList;
    /**
     * The list of Amazon EC2 VPC security groups that the DB instance belongs to.
     */
    VpcSecurityGroups?: VpcSecurityGroupMembershipList;
    /**
     * The list of DB parameter groups applied to this DB instance.
     */
    DBParameterGroups?: DBParameterGroupStatusList;
    /**
     * The name of the Availability Zone where the DB instance is located.
     */
    AvailabilityZone?: String;
    /**
     * Information about the subnet group associated with the DB instance, including the name, description, and subnets in the subnet group.
     */
    DBSubnetGroup?: DBSubnetGroup;
    /**
     * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
     */
    PreferredMaintenanceWindow?: String;
    /**
     * Information about pending changes to the DB instance. This information is returned only when there are pending changes. Specific changes are identified by subelements.
     */
    PendingModifiedValues?: PendingModifiedValues;
    /**
     * The latest time to which a database in this DB instance can be restored with point-in-time restore.
     */
    LatestRestorableTime?: TStamp;
    /**
     * Indicates whether the DB instance is a Multi-AZ deployment. This setting doesn't apply to RDS Custom DB instances.
     */
    MultiAZ?: Boolean;
    /**
     * The version of the database engine.
     */
    EngineVersion?: String;
    /**
     * Indicates whether minor version patches are applied automatically.
     */
    AutoMinorVersionUpgrade?: Boolean;
    /**
     * The identifier of the source DB instance if this DB instance is a read replica.
     */
    ReadReplicaSourceDBInstanceIdentifier?: String;
    /**
     * The identifiers of the read replicas associated with this DB instance.
     */
    ReadReplicaDBInstanceIdentifiers?: ReadReplicaDBInstanceIdentifierList;
    /**
     * The identifiers of Aurora DB clusters to which the RDS DB instance is replicated as a read replica. For example, when you create an Aurora read replica of an RDS for MySQL DB instance, the Aurora MySQL DB cluster for the Aurora read replica is shown. This output doesn't contain information about cross-Region Aurora read replicas.  Currently, each RDS DB instance can have only one Aurora read replica. 
     */
    ReadReplicaDBClusterIdentifiers?: ReadReplicaDBClusterIdentifierList;
    /**
     * The open mode of an Oracle read replica. The default is open-read-only. For more information, see Working with Oracle Read Replicas for Amazon RDS in the Amazon RDS User Guide.  This attribute is only supported in RDS for Oracle. 
     */
    ReplicaMode?: ReplicaMode;
    /**
     * The license model information for this DB instance. This setting doesn't apply to RDS Custom DB instances.
     */
    LicenseModel?: String;
    /**
     * The Provisioned IOPS (I/O operations per second) value for the DB instance.
     */
    Iops?: IntegerOptional;
    /**
     * The list of option group memberships for this DB instance.
     */
    OptionGroupMemberships?: OptionGroupMembershipList;
    /**
     * If present, specifies the name of the character set that this instance is associated with.
     */
    CharacterSetName?: String;
    /**
     * The name of the NCHAR character set for the Oracle DB instance. This character set specifies the Unicode encoding for data stored in table columns of type NCHAR, NCLOB, or NVARCHAR2.
     */
    NcharCharacterSetName?: String;
    /**
     * If present, specifies the name of the secondary Availability Zone for a DB instance with multi-AZ support.
     */
    SecondaryAvailabilityZone?: String;
    /**
     * Indicates whether the DB instance is publicly accessible. When the DB cluster is publicly accessible, its Domain Name System (DNS) endpoint resolves to the private IP address from within the DB cluster's virtual private cloud (VPC). It resolves to the public IP address from outside of the DB cluster's VPC. Access to the DB cluster is ultimately controlled by the security group it uses. That public access isn't permitted if the security group assigned to the DB cluster doesn't permit it. When the DB instance isn't publicly accessible, it is an internal DB instance with a DNS name that resolves to a private IP address. For more information, see CreateDBInstance.
     */
    PubliclyAccessible?: Boolean;
    /**
     * The status of a read replica. If the DB instance isn't a read replica, the value is blank.
     */
    StatusInfos?: DBInstanceStatusInfoList;
    /**
     * The storage type associated with the DB instance.
     */
    StorageType?: String;
    /**
     * The ARN from the key store with which the instance is associated for TDE encryption.
     */
    TdeCredentialArn?: String;
    /**
     * The port that the DB instance listens on. If the DB instance is part of a DB cluster, this can be a different port than the DB cluster port.
     */
    DbInstancePort?: Integer;
    /**
     * If the DB instance is a member of a DB cluster, indicates the name of the DB cluster that the DB instance is a member of.
     */
    DBClusterIdentifier?: String;
    /**
     * Indicates whether the DB instance is encrypted.
     */
    StorageEncrypted?: Boolean;
    /**
     * If StorageEncrypted is enabled, the Amazon Web Services KMS key identifier for the encrypted DB instance. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key.
     */
    KmsKeyId?: String;
    /**
     * The Amazon Web Services Region-unique, immutable identifier for the DB instance. This identifier is found in Amazon Web Services CloudTrail log entries whenever the Amazon Web Services KMS key for the DB instance is accessed.
     */
    DbiResourceId?: String;
    /**
     * The identifier of the CA certificate for this DB instance. For more information, see Using SSL/TLS to encrypt a connection to a DB instance in the Amazon RDS User Guide and  Using SSL/TLS to encrypt a connection to a DB cluster in the Amazon Aurora User Guide.
     */
    CACertificateIdentifier?: String;
    /**
     * The Active Directory Domain membership records associated with the DB instance.
     */
    DomainMemberships?: DomainMembershipList;
    /**
     * Indicates whether tags are copied from the DB instance to snapshots of the DB instance. This setting doesn't apply to Amazon Aurora DB instances. Copying tags to snapshots is managed by the DB cluster. Setting this value for an Aurora DB instance has no effect on the DB cluster setting. For more information, see DBCluster.
     */
    CopyTagsToSnapshot?: Boolean;
    /**
     * The interval, in seconds, between points when Enhanced Monitoring metrics are collected for the DB instance.
     */
    MonitoringInterval?: IntegerOptional;
    /**
     * The Amazon Resource Name (ARN) of the Amazon CloudWatch Logs log stream that receives the Enhanced Monitoring metrics data for the DB instance.
     */
    EnhancedMonitoringResourceArn?: String;
    /**
     * The ARN for the IAM role that permits RDS to send Enhanced Monitoring metrics to Amazon CloudWatch Logs.
     */
    MonitoringRoleArn?: String;
    /**
     * The order of priority in which an Aurora Replica is promoted to the primary instance after a failure of the existing primary instance. For more information, see  Fault Tolerance for an Aurora DB Cluster in the Amazon Aurora User Guide.
     */
    PromotionTier?: IntegerOptional;
    /**
     * The Amazon Resource Name (ARN) for the DB instance.
     */
    DBInstanceArn?: String;
    /**
     * The time zone of the DB instance. In most cases, the Timezone element is empty. Timezone content appears only for Microsoft SQL Server DB instances that were created with a time zone specified.
     */
    Timezone?: String;
    /**
     * Indicates whether mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts is enabled for the DB instance. For a list of engine versions that support IAM database authentication, see IAM database authentication in the Amazon RDS User Guide and IAM database authentication in Aurora in the Amazon Aurora User Guide.
     */
    IAMDatabaseAuthenticationEnabled?: Boolean;
    /**
     * Indicates whether Performance Insights is enabled for the DB instance.
     */
    PerformanceInsightsEnabled?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier for encryption of Performance Insights data. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key.
     */
    PerformanceInsightsKMSKeyId?: String;
    /**
     * The number of days to retain Performance Insights data. Valid Values:    7     month * 31, where month is a number of months from 1-23. Examples: 93 (3 months * 31), 341 (11 months * 31), 589 (19 months * 31)    731    Default: 7 days
     */
    PerformanceInsightsRetentionPeriod?: IntegerOptional;
    /**
     * A list of log types that this DB instance is configured to export to CloudWatch Logs. Log types vary by DB engine. For information about the log types for each DB engine, see Monitoring Amazon RDS log files in the Amazon RDS User Guide. 
     */
    EnabledCloudwatchLogsExports?: LogTypeList;
    /**
     * The number of CPU cores and the number of threads per core for the DB instance class of the DB instance.
     */
    ProcessorFeatures?: ProcessorFeatureList;
    /**
     * Indicates whether the DB instance has deletion protection enabled. The database can't be deleted when deletion protection is enabled. For more information, see  Deleting a DB Instance.
     */
    DeletionProtection?: Boolean;
    /**
     * The Amazon Web Services Identity and Access Management (IAM) roles associated with the DB instance.
     */
    AssociatedRoles?: DBInstanceRoles;
    /**
     * The listener connection endpoint for SQL Server Always On.
     */
    ListenerEndpoint?: Endpoint;
    /**
     * The upper limit in gibibytes (GiB) to which Amazon RDS can automatically scale the storage of the DB instance.
     */
    MaxAllocatedStorage?: IntegerOptional;
    TagList?: TagList;
    /**
     * The list of replicated automated backups associated with the DB instance.
     */
    DBInstanceAutomatedBackupsReplications?: DBInstanceAutomatedBackupsReplicationList;
    /**
     * Indicates whether a customer-owned IP address (CoIP) is enabled for an RDS on Outposts DB instance. A CoIP provides local or external connectivity to resources in your Outpost subnets through your on-premises network. For some use cases, a CoIP can provide lower latency for connections to the DB instance from outside of its virtual private cloud (VPC) on your local network. For more information about RDS on Outposts, see Working with Amazon RDS on Amazon Web Services Outposts in the Amazon RDS User Guide. For more information about CoIPs, see Customer-owned IP addresses in the Amazon Web Services Outposts User Guide.
     */
    CustomerOwnedIpEnabled?: BooleanOptional;
    /**
     * The Amazon Resource Name (ARN) of the recovery point in Amazon Web Services Backup.
     */
    AwsBackupRecoveryPointArn?: String;
    /**
     * The status of the database activity stream.
     */
    ActivityStreamStatus?: ActivityStreamStatus;
    /**
     * The Amazon Web Services KMS key identifier used for encrypting messages in the database activity stream. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key.
     */
    ActivityStreamKmsKeyId?: String;
    /**
     * The name of the Amazon Kinesis data stream used for the database activity stream.
     */
    ActivityStreamKinesisStreamName?: String;
    /**
     * The mode of the database activity stream. Database events such as a change or access generate an activity stream event. RDS for Oracle always handles these events asynchronously.
     */
    ActivityStreamMode?: ActivityStreamMode;
    /**
     * Indicates whether engine-native audit fields are included in the database activity stream.
     */
    ActivityStreamEngineNativeAuditFieldsIncluded?: BooleanOptional;
    /**
     * The automation mode of the RDS Custom DB instance: full or all paused. If full, the DB instance automates monitoring and instance recovery. If all paused, the instance pauses automation for the duration set by --resume-full-automation-mode-minutes.
     */
    AutomationMode?: AutomationMode;
    /**
     * The number of minutes to pause the automation. When the time period ends, RDS Custom resumes full automation. The minimum value is 60 (default). The maximum value is 1,440.
     */
    ResumeFullAutomationModeTime?: TStamp;
    /**
     * The instance profile associated with the underlying Amazon EC2 instance of an RDS Custom DB instance. The instance profile must meet the following requirements:   The profile must exist in your account.   The profile must have an IAM role that Amazon EC2 has permissions to assume.   The instance profile name and the associated IAM role name must start with the prefix AWSRDSCustom.   For the list of permissions required for the IAM role, see  Configure IAM and your VPC in the Amazon RDS User Guide.
     */
    CustomIamInstanceProfile?: String;
    /**
     * The location where automated backups and manual snapshots are stored: Amazon Web Services Outposts or the Amazon Web Services Region.
     */
    BackupTarget?: String;
    /**
     * The network type of the DB instance. The network type is determined by the DBSubnetGroup specified for the DB instance. A DBSubnetGroup can support only the IPv4 protocol or the IPv4 and the IPv6 protocols (DUAL). For more information, see  Working with a DB instance in a VPC in the Amazon RDS User Guide and  Working with a DB instance in a VPC in the Amazon Aurora User Guide.  Valid Values: IPV4 | DUAL 
     */
    NetworkType?: String;
    /**
     * The status of the policy state of the activity stream.
     */
    ActivityStreamPolicyStatus?: ActivityStreamPolicyStatus;
    /**
     * The storage throughput for the DB instance. This setting applies only to the gp3 storage type.
     */
    StorageThroughput?: IntegerOptional;
    /**
     * The Oracle system ID (Oracle SID) for a container database (CDB). The Oracle SID is also the name of the CDB. This setting is only valid for RDS Custom DB instances.
     */
    DBSystemId?: String;
    /**
     * The secret managed by RDS in Amazon Web Services Secrets Manager for the master user password. For more information, see Password management with Amazon Web Services Secrets Manager in the Amazon RDS User Guide. 
     */
    MasterUserSecret?: MasterUserSecret;
    /**
     * The details of the DB instance's server certificate.
     */
    CertificateDetails?: CertificateDetails;
    /**
     * The identifier of the source DB cluster if this DB instance is a read replica.
     */
    ReadReplicaSourceDBClusterIdentifier?: String;
    /**
     * The progress of the storage optimization operation as a percentage.
     */
    PercentProgress?: String;
    /**
     * Indicates whether the DB instance has a dedicated log volume (DLV) enabled.
     */
    DedicatedLogVolume?: Boolean;
  }
  export interface DBInstanceAutomatedBackup {
    /**
     * The Amazon Resource Name (ARN) for the automated backups.
     */
    DBInstanceArn?: String;
    /**
     * The resource ID for the source DB instance, which can't be changed and which is unique to an Amazon Web Services Region.
     */
    DbiResourceId?: String;
    /**
     * The Amazon Web Services Region associated with the automated backup.
     */
    Region?: String;
    /**
     * The identifier for the source DB instance, which can't be changed and which is unique to an Amazon Web Services Region.
     */
    DBInstanceIdentifier?: String;
    /**
     * The earliest and latest time a DB instance can be restored to.
     */
    RestoreWindow?: RestoreWindow;
    /**
     * The allocated storage size for the the automated backup in gibibytes (GiB).
     */
    AllocatedStorage?: Integer;
    /**
     * A list of status information for an automated backup:    active - Automated backups for current instances.    retained - Automated backups for deleted instances.    creating - Automated backups that are waiting for the first automated snapshot to be available.  
     */
    Status?: String;
    /**
     * The port number that the automated backup used for connections. Default: Inherits from the source DB instance Valid Values: 1150-65535 
     */
    Port?: Integer;
    /**
     * The Availability Zone that the automated backup was created in. For information on Amazon Web Services Regions and Availability Zones, see Regions and Availability Zones.
     */
    AvailabilityZone?: String;
    /**
     * The VPC ID associated with the DB instance.
     */
    VpcId?: String;
    /**
     * The date and time when the DB instance was created.
     */
    InstanceCreateTime?: TStamp;
    /**
     * The master user name of an automated backup.
     */
    MasterUsername?: String;
    /**
     * The name of the database engine for this automated backup.
     */
    Engine?: String;
    /**
     * The version of the database engine for the automated backup.
     */
    EngineVersion?: String;
    /**
     * The license model information for the automated backup.
     */
    LicenseModel?: String;
    /**
     * The IOPS (I/O operations per second) value for the automated backup.
     */
    Iops?: IntegerOptional;
    /**
     * The option group the automated backup is associated with. If omitted, the default option group for the engine specified is used.
     */
    OptionGroupName?: String;
    /**
     * The ARN from the key store with which the automated backup is associated for TDE encryption.
     */
    TdeCredentialArn?: String;
    /**
     * Indicates whether the automated backup is encrypted.
     */
    Encrypted?: Boolean;
    /**
     * The storage type associated with the automated backup.
     */
    StorageType?: String;
    /**
     * The Amazon Web Services KMS key ID for an automated backup. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key.
     */
    KmsKeyId?: String;
    /**
     * The time zone of the automated backup. In most cases, the Timezone element is empty. Timezone content appears only for Microsoft SQL Server DB instances that were created with a time zone specified.
     */
    Timezone?: String;
    /**
     * True if mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts is enabled, and otherwise false.
     */
    IAMDatabaseAuthenticationEnabled?: Boolean;
    /**
     * The retention period for the automated backups.
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * The Amazon Resource Name (ARN) for the replicated automated backups.
     */
    DBInstanceAutomatedBackupsArn?: String;
    /**
     * The list of replications to different Amazon Web Services Regions associated with the automated backup.
     */
    DBInstanceAutomatedBackupsReplications?: DBInstanceAutomatedBackupsReplicationList;
    /**
     * The location where automated backups are stored: Amazon Web Services Outposts or the Amazon Web Services Region.
     */
    BackupTarget?: String;
    /**
     * The storage throughput for the automated backup.
     */
    StorageThroughput?: IntegerOptional;
    /**
     * The Amazon Resource Name (ARN) of the recovery point in Amazon Web Services Backup.
     */
    AwsBackupRecoveryPointArn?: String;
    /**
     * Indicates whether the DB instance has a dedicated log volume (DLV) enabled.
     */
    DedicatedLogVolume?: BooleanOptional;
  }
  export type DBInstanceAutomatedBackupList = DBInstanceAutomatedBackup[];
  export interface DBInstanceAutomatedBackupMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of DBInstanceAutomatedBackup instances.
     */
    DBInstanceAutomatedBackups?: DBInstanceAutomatedBackupList;
  }
  export interface DBInstanceAutomatedBackupsReplication {
    /**
     * The Amazon Resource Name (ARN) of the replicated automated backups.
     */
    DBInstanceAutomatedBackupsArn?: String;
  }
  export type DBInstanceAutomatedBackupsReplicationList = DBInstanceAutomatedBackupsReplication[];
  export type DBInstanceList = DBInstance[];
  export interface DBInstanceMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords .
     */
    Marker?: String;
    /**
     * A list of DBInstance instances.
     */
    DBInstances?: DBInstanceList;
  }
  export interface DBInstanceRole {
    /**
     * The Amazon Resource Name (ARN) of the IAM role that is associated with the DB instance.
     */
    RoleArn?: String;
    /**
     * The name of the feature associated with the Amazon Web Services Identity and Access Management (IAM) role. For information about supported feature names, see DBEngineVersion.
     */
    FeatureName?: String;
    /**
     * Information about the state of association between the IAM role and the DB instance. The Status property returns one of the following values:    ACTIVE - the IAM role ARN is associated with the DB instance and can be used to access other Amazon Web Services services on your behalf.    PENDING - the IAM role ARN is being associated with the DB instance.    INVALID - the IAM role ARN is associated with the DB instance, but the DB instance is unable to assume the IAM role in order to access other Amazon Web Services services on your behalf.  
     */
    Status?: String;
  }
  export type DBInstanceRoles = DBInstanceRole[];
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
     * The status of the DB instance. For a StatusType of read replica, the values can be replicating, replication stop point set, replication stop point reached, error, stopped, or terminated.
     */
    Status?: String;
    /**
     * Details of the error if there is an error for the instance. If the instance isn't in an error state, this value is blank.
     */
    Message?: String;
  }
  export type DBInstanceStatusInfoList = DBInstanceStatusInfo[];
  export interface DBParameterGroup {
    /**
     * The name of the DB parameter group.
     */
    DBParameterGroupName?: String;
    /**
     * The name of the DB parameter group family that this DB parameter group is compatible with.
     */
    DBParameterGroupFamily?: String;
    /**
     * Provides the customer-specified description for this DB parameter group.
     */
    Description?: String;
    /**
     * The Amazon Resource Name (ARN) for the DB parameter group.
     */
    DBParameterGroupArn?: String;
  }
  export interface DBParameterGroupDetails {
    /**
     * A list of Parameter values.
     */
    Parameters?: ParametersList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export type DBParameterGroupList = DBParameterGroup[];
  export interface DBParameterGroupNameMessage {
    /**
     * The name of the DB parameter group.
     */
    DBParameterGroupName?: String;
  }
  export interface DBParameterGroupStatus {
    /**
     * The name of the DB parameter group.
     */
    DBParameterGroupName?: String;
    /**
     * The status of parameter updates.
     */
    ParameterApplyStatus?: String;
  }
  export type DBParameterGroupStatusList = DBParameterGroupStatus[];
  export interface DBParameterGroupsMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of DBParameterGroup instances.
     */
    DBParameterGroups?: DBParameterGroupList;
  }
  export interface DBProxy {
    /**
     * The identifier for the proxy. This name must be unique for all proxies owned by your Amazon Web Services account in the specified Amazon Web Services Region.
     */
    DBProxyName?: String;
    /**
     * The Amazon Resource Name (ARN) for the proxy.
     */
    DBProxyArn?: String;
    /**
     * The current status of this proxy. A status of available means the proxy is ready to handle requests. Other values indicate that you must wait for the proxy to be ready, or take some action to resolve an issue.
     */
    Status?: DBProxyStatus;
    /**
     * The kinds of databases that the proxy can connect to. This value determines which database network protocol the proxy recognizes when it interprets network traffic to and from the database. MYSQL supports Aurora MySQL, RDS for MariaDB, and RDS for MySQL databases. POSTGRESQL supports Aurora PostgreSQL and RDS for PostgreSQL databases. SQLSERVER supports RDS for Microsoft SQL Server databases.
     */
    EngineFamily?: String;
    /**
     * Provides the VPC ID of the DB proxy.
     */
    VpcId?: String;
    /**
     * Provides a list of VPC security groups that the proxy belongs to.
     */
    VpcSecurityGroupIds?: StringList;
    /**
     * The EC2 subnet IDs for the proxy.
     */
    VpcSubnetIds?: StringList;
    /**
     * One or more data structures specifying the authorization mechanism to connect to the associated RDS DB instance or Aurora DB cluster.
     */
    Auth?: UserAuthConfigInfoList;
    /**
     * The Amazon Resource Name (ARN) for the IAM role that the proxy uses to access Amazon Secrets Manager.
     */
    RoleArn?: String;
    /**
     * The endpoint that you can use to connect to the DB proxy. You include the endpoint value in the connection string for a database client application.
     */
    Endpoint?: String;
    /**
     * Indicates whether Transport Layer Security (TLS) encryption is required for connections to the proxy.
     */
    RequireTLS?: Boolean;
    /**
     * The number of seconds a connection to the proxy can have no activity before the proxy drops the client connection. The proxy keeps the underlying database connection open and puts it back into the connection pool for reuse by later connection requests. Default: 1800 (30 minutes) Constraints: 1 to 28,800
     */
    IdleClientTimeout?: Integer;
    /**
     * Indicates whether the proxy includes detailed information about SQL statements in its logs. This information helps you to debug issues involving SQL behavior or the performance and scalability of the proxy connections. The debug information includes the text of SQL statements that you submit through the proxy. Thus, only enable this setting when needed for debugging, and only when you have security measures in place to safeguard any sensitive information that appears in the logs.
     */
    DebugLogging?: Boolean;
    /**
     * The date and time when the proxy was first created.
     */
    CreatedDate?: TStamp;
    /**
     * The date and time when the proxy was last updated.
     */
    UpdatedDate?: TStamp;
  }
  export interface DBProxyEndpoint {
    /**
     * The name for the DB proxy endpoint. An identifier must begin with a letter and must contain only ASCII letters, digits, and hyphens; it can't end with a hyphen or contain two consecutive hyphens.
     */
    DBProxyEndpointName?: String;
    /**
     * The Amazon Resource Name (ARN) for the DB proxy endpoint.
     */
    DBProxyEndpointArn?: String;
    /**
     * The identifier for the DB proxy that is associated with this DB proxy endpoint.
     */
    DBProxyName?: String;
    /**
     * The current status of this DB proxy endpoint. A status of available means the endpoint is ready to handle requests. Other values indicate that you must wait for the endpoint to be ready, or take some action to resolve an issue.
     */
    Status?: DBProxyEndpointStatus;
    /**
     * Provides the VPC ID of the DB proxy endpoint.
     */
    VpcId?: String;
    /**
     * Provides a list of VPC security groups that the DB proxy endpoint belongs to.
     */
    VpcSecurityGroupIds?: StringList;
    /**
     * The EC2 subnet IDs for the DB proxy endpoint.
     */
    VpcSubnetIds?: StringList;
    /**
     * The endpoint that you can use to connect to the DB proxy. You include the endpoint value in the connection string for a database client application.
     */
    Endpoint?: String;
    /**
     * The date and time when the DB proxy endpoint was first created.
     */
    CreatedDate?: TStamp;
    /**
     * A value that indicates whether the DB proxy endpoint can be used for read/write or read-only operations.
     */
    TargetRole?: DBProxyEndpointTargetRole;
    /**
     * Indicates whether this endpoint is the default endpoint for the associated DB proxy. Default DB proxy endpoints always have read/write capability. Other endpoints that you associate with the DB proxy can be either read/write or read-only.
     */
    IsDefault?: Boolean;
  }
  export type DBProxyEndpointList = DBProxyEndpoint[];
  export type DBProxyEndpointName = string;
  export type DBProxyEndpointStatus = "available"|"modifying"|"incompatible-network"|"insufficient-resource-limits"|"creating"|"deleting"|string;
  export type DBProxyEndpointTargetRole = "READ_WRITE"|"READ_ONLY"|string;
  export type DBProxyList = DBProxy[];
  export type DBProxyName = string;
  export type DBProxyStatus = "available"|"modifying"|"incompatible-network"|"insufficient-resource-limits"|"creating"|"deleting"|"suspended"|"suspending"|"reactivating"|string;
  export interface DBProxyTarget {
    /**
     * The Amazon Resource Name (ARN) for the RDS DB instance or Aurora DB cluster.
     */
    TargetArn?: String;
    /**
     * The writer endpoint for the RDS DB instance or Aurora DB cluster.
     */
    Endpoint?: String;
    /**
     * The DB cluster identifier when the target represents an Aurora DB cluster. This field is blank when the target represents an RDS DB instance.
     */
    TrackedClusterId?: String;
    /**
     * The identifier representing the target. It can be the instance identifier for an RDS DB instance, or the cluster identifier for an Aurora DB cluster.
     */
    RdsResourceId?: String;
    /**
     * The port that the RDS Proxy uses to connect to the target RDS DB instance or Aurora DB cluster.
     */
    Port?: Integer;
    /**
     * Specifies the kind of database, such as an RDS DB instance or an Aurora DB cluster, that the target represents.
     */
    Type?: TargetType;
    /**
     * A value that indicates whether the target of the proxy can be used for read/write or read-only operations.
     */
    Role?: TargetRole;
    /**
     * Information about the connection health of the RDS Proxy target.
     */
    TargetHealth?: TargetHealth;
  }
  export interface DBProxyTargetGroup {
    /**
     * The identifier for the RDS proxy associated with this target group.
     */
    DBProxyName?: String;
    /**
     * The identifier for the target group. This name must be unique for all target groups owned by your Amazon Web Services account in the specified Amazon Web Services Region.
     */
    TargetGroupName?: String;
    /**
     * The Amazon Resource Name (ARN) representing the target group.
     */
    TargetGroupArn?: String;
    /**
     * Indicates whether this target group is the first one used for connection requests by the associated proxy. Because each proxy is currently associated with a single target group, currently this setting is always true.
     */
    IsDefault?: Boolean;
    /**
     * The current status of this target group. A status of available means the target group is correctly associated with a database. Other values indicate that you must wait for the target group to be ready, or take some action to resolve an issue.
     */
    Status?: String;
    /**
     * The settings that determine the size and behavior of the connection pool for the target group.
     */
    ConnectionPoolConfig?: ConnectionPoolConfigurationInfo;
    /**
     * The date and time when the target group was first created.
     */
    CreatedDate?: TStamp;
    /**
     * The date and time when the target group was last updated.
     */
    UpdatedDate?: TStamp;
  }
  export interface DBSecurityGroup {
    /**
     * Provides the Amazon Web Services ID of the owner of a specific DB security group.
     */
    OwnerId?: String;
    /**
     * Specifies the name of the DB security group.
     */
    DBSecurityGroupName?: String;
    /**
     * Provides the description of the DB security group.
     */
    DBSecurityGroupDescription?: String;
    /**
     * Provides the VpcId of the DB security group.
     */
    VpcId?: String;
    /**
     * Contains a list of EC2SecurityGroup elements.
     */
    EC2SecurityGroups?: EC2SecurityGroupList;
    /**
     * Contains a list of IPRange elements.
     */
    IPRanges?: IPRangeList;
    /**
     * The Amazon Resource Name (ARN) for the DB security group.
     */
    DBSecurityGroupArn?: String;
  }
  export interface DBSecurityGroupMembership {
    /**
     * The name of the DB security group.
     */
    DBSecurityGroupName?: String;
    /**
     * The status of the DB security group.
     */
    Status?: String;
  }
  export type DBSecurityGroupMembershipList = DBSecurityGroupMembership[];
  export interface DBSecurityGroupMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of DBSecurityGroup instances.
     */
    DBSecurityGroups?: DBSecurityGroups;
  }
  export type DBSecurityGroupNameList = String[];
  export type DBSecurityGroups = DBSecurityGroup[];
  export interface DBSnapshot {
    /**
     * Specifies the identifier for the DB snapshot.
     */
    DBSnapshotIdentifier?: String;
    /**
     * Specifies the DB instance identifier of the DB instance this DB snapshot was created from.
     */
    DBInstanceIdentifier?: String;
    /**
     * Specifies when the snapshot was taken in Coordinated Universal Time (UTC). Changes for the copy when the snapshot is copied.
     */
    SnapshotCreateTime?: TStamp;
    /**
     * Specifies the name of the database engine.
     */
    Engine?: String;
    /**
     * Specifies the allocated storage size in gibibytes (GiB).
     */
    AllocatedStorage?: Integer;
    /**
     * Specifies the status of this DB snapshot.
     */
    Status?: String;
    /**
     * Specifies the port that the database engine was listening on at the time of the snapshot.
     */
    Port?: Integer;
    /**
     * Specifies the name of the Availability Zone the DB instance was located in at the time of the DB snapshot.
     */
    AvailabilityZone?: String;
    /**
     * Provides the VPC ID associated with the DB snapshot.
     */
    VpcId?: String;
    /**
     * Specifies the time in Coordinated Universal Time (UTC) when the DB instance, from which the snapshot was taken, was created.
     */
    InstanceCreateTime?: TStamp;
    /**
     * Provides the master username for the DB snapshot.
     */
    MasterUsername?: String;
    /**
     * Specifies the version of the database engine.
     */
    EngineVersion?: String;
    /**
     * License model information for the restored DB instance.
     */
    LicenseModel?: String;
    /**
     * Provides the type of the DB snapshot.
     */
    SnapshotType?: String;
    /**
     * Specifies the Provisioned IOPS (I/O operations per second) value of the DB instance at the time of the snapshot.
     */
    Iops?: IntegerOptional;
    /**
     * Provides the option group name for the DB snapshot.
     */
    OptionGroupName?: String;
    /**
     * The percentage of the estimated data that has been transferred.
     */
    PercentProgress?: Integer;
    /**
     * The Amazon Web Services Region that the DB snapshot was created in or copied from.
     */
    SourceRegion?: String;
    /**
     * The DB snapshot Amazon Resource Name (ARN) that the DB snapshot was copied from. It only has a value in the case of a cross-account or cross-Region copy.
     */
    SourceDBSnapshotIdentifier?: String;
    /**
     * Specifies the storage type associated with DB snapshot.
     */
    StorageType?: String;
    /**
     * The ARN from the key store with which to associate the instance for TDE encryption.
     */
    TdeCredentialArn?: String;
    /**
     * Indicates whether the DB snapshot is encrypted.
     */
    Encrypted?: Boolean;
    /**
     * If Encrypted is true, the Amazon Web Services KMS key identifier for the encrypted DB snapshot. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key.
     */
    KmsKeyId?: String;
    /**
     * The Amazon Resource Name (ARN) for the DB snapshot.
     */
    DBSnapshotArn?: String;
    /**
     * The time zone of the DB snapshot. In most cases, the Timezone element is empty. Timezone content appears only for snapshots taken from Microsoft SQL Server DB instances that were created with a time zone specified.
     */
    Timezone?: String;
    /**
     * Indicates whether mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts is enabled.
     */
    IAMDatabaseAuthenticationEnabled?: Boolean;
    /**
     * The number of CPU cores and the number of threads per core for the DB instance class of the DB instance when the DB snapshot was created.
     */
    ProcessorFeatures?: ProcessorFeatureList;
    /**
     * The identifier for the source DB instance, which can't be changed and which is unique to an Amazon Web Services Region.
     */
    DbiResourceId?: String;
    TagList?: TagList;
    /**
     * Specifies the time of the CreateDBSnapshot operation in Coordinated Universal Time (UTC). Doesn't change when the snapshot is copied.
     */
    OriginalSnapshotCreateTime?: TStamp;
    /**
     * The timestamp of the most recent transaction applied to the database that you're backing up. Thus, if you restore a snapshot, SnapshotDatabaseTime is the most recent transaction in the restored DB instance. In contrast, originalSnapshotCreateTime specifies the system time that the snapshot completed. If you back up a read replica, you can determine the replica lag by comparing SnapshotDatabaseTime with originalSnapshotCreateTime. For example, if originalSnapshotCreateTime is two hours later than SnapshotDatabaseTime, then the replica lag is two hours.
     */
    SnapshotDatabaseTime?: TStamp;
    /**
     * Specifies where manual snapshots are stored: Amazon Web Services Outposts or the Amazon Web Services Region.
     */
    SnapshotTarget?: String;
    /**
     * Specifies the storage throughput for the DB snapshot.
     */
    StorageThroughput?: IntegerOptional;
    /**
     * The Oracle system identifier (SID), which is the name of the Oracle database instance that manages your database files. The Oracle SID is also the name of your CDB.
     */
    DBSystemId?: String;
    /**
     * Indicates whether the DB instance has a dedicated log volume (DLV) enabled.
     */
    DedicatedLogVolume?: Boolean;
  }
  export interface DBSnapshotAttribute {
    /**
     * The name of the manual DB snapshot attribute. The attribute named restore refers to the list of Amazon Web Services accounts that have permission to copy or restore the manual DB cluster snapshot. For more information, see the ModifyDBSnapshotAttribute API action.
     */
    AttributeName?: String;
    /**
     * The value or values for the manual DB snapshot attribute. If the AttributeName field is set to restore, then this element returns a list of IDs of the Amazon Web Services accounts that are authorized to copy or restore the manual DB snapshot. If a value of all is in the list, then the manual DB snapshot is public and available for any Amazon Web Services account to copy or restore.
     */
    AttributeValues?: AttributeValueList;
  }
  export type DBSnapshotAttributeList = DBSnapshotAttribute[];
  export interface DBSnapshotAttributesResult {
    /**
     * The identifier of the manual DB snapshot that the attributes apply to.
     */
    DBSnapshotIdentifier?: String;
    /**
     * The list of attributes and values for the manual DB snapshot.
     */
    DBSnapshotAttributes?: DBSnapshotAttributeList;
  }
  export type DBSnapshotList = DBSnapshot[];
  export interface DBSnapshotMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of DBSnapshot instances.
     */
    DBSnapshots?: DBSnapshotList;
  }
  export interface DBSubnetGroup {
    /**
     * The name of the DB subnet group.
     */
    DBSubnetGroupName?: String;
    /**
     * Provides the description of the DB subnet group.
     */
    DBSubnetGroupDescription?: String;
    /**
     * Provides the VpcId of the DB subnet group.
     */
    VpcId?: String;
    /**
     * Provides the status of the DB subnet group.
     */
    SubnetGroupStatus?: String;
    /**
     * Contains a list of Subnet elements.
     */
    Subnets?: SubnetList;
    /**
     * The Amazon Resource Name (ARN) for the DB subnet group.
     */
    DBSubnetGroupArn?: String;
    /**
     * The network type of the DB subnet group. Valid values:    IPV4     DUAL    A DBSubnetGroup can support only the IPv4 protocol or the IPv4 and the IPv6 protocols (DUAL). For more information, see  Working with a DB instance in a VPC in the Amazon RDS User Guide. 
     */
    SupportedNetworkTypes?: StringList;
  }
  export interface DBSubnetGroupMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of DBSubnetGroup instances.
     */
    DBSubnetGroups?: DBSubnetGroups;
  }
  export type DBSubnetGroups = DBSubnetGroup[];
  export type DatabaseArn = string;
  export interface DeleteBlueGreenDeploymentRequest {
    /**
     * The unique identifier of the blue/green deployment to delete. This parameter isn't case-sensitive. Constraints:    Must match an existing blue/green deployment identifier.  
     */
    BlueGreenDeploymentIdentifier: BlueGreenDeploymentIdentifier;
    /**
     * Specifies whether to delete the resources in the green environment. You can't specify this option if the blue/green deployment status is SWITCHOVER_COMPLETED.
     */
    DeleteTarget?: BooleanOptional;
  }
  export interface DeleteBlueGreenDeploymentResponse {
    BlueGreenDeployment?: BlueGreenDeployment;
  }
  export interface DeleteCustomDBEngineVersionMessage {
    /**
     * The database engine. The only supported engines are custom-oracle-ee and custom-oracle-ee-cdb.
     */
    Engine: CustomEngineName;
    /**
     * The custom engine version (CEV) for your DB instance. This option is required for RDS Custom, but optional for Amazon RDS. The combination of Engine and EngineVersion is unique per customer per Amazon Web Services Region.
     */
    EngineVersion: CustomEngineVersion;
  }
  export interface DeleteDBClusterAutomatedBackupMessage {
    /**
     * The identifier for the source DB cluster, which can't be changed and which is unique to an Amazon Web Services Region.
     */
    DbClusterResourceId: String;
  }
  export interface DeleteDBClusterAutomatedBackupResult {
    DBClusterAutomatedBackup?: DBClusterAutomatedBackup;
  }
  export interface DeleteDBClusterEndpointMessage {
    /**
     * The identifier associated with the custom endpoint. This parameter is stored as a lowercase string.
     */
    DBClusterEndpointIdentifier: String;
  }
  export interface DeleteDBClusterMessage {
    /**
     * The DB cluster identifier for the DB cluster to be deleted. This parameter isn't case-sensitive. Constraints:   Must match an existing DBClusterIdentifier.  
     */
    DBClusterIdentifier: String;
    /**
     * Specifies whether to skip the creation of a final DB cluster snapshot before the DB cluster is deleted. If skip is specified, no DB cluster snapshot is created. If skip isn't specified, a DB cluster snapshot is created before the DB cluster is deleted. By default, skip isn't specified, and the DB cluster snapshot is created. By default, this parameter is disabled.  You must specify a FinalDBSnapshotIdentifier parameter if SkipFinalSnapshot is disabled. 
     */
    SkipFinalSnapshot?: Boolean;
    /**
     * The DB cluster snapshot identifier of the new DB cluster snapshot created when SkipFinalSnapshot is disabled.  Specifying this parameter and also skipping the creation of a final DB cluster snapshot with the SkipFinalShapshot parameter results in an error.  Constraints:   Must be 1 to 255 letters, numbers, or hyphens.   First character must be a letter   Can't end with a hyphen or contain two consecutive hyphens  
     */
    FinalDBSnapshotIdentifier?: String;
    /**
     * Specifies whether to remove automated backups immediately after the DB cluster is deleted. This parameter isn't case-sensitive. The default is to remove automated backups immediately after the DB cluster is deleted.
     */
    DeleteAutomatedBackups?: BooleanOptional;
  }
  export interface DeleteDBClusterParameterGroupMessage {
    /**
     * The name of the DB cluster parameter group. Constraints:   Must be the name of an existing DB cluster parameter group.   You can't delete a default DB cluster parameter group.   Can't be associated with any DB clusters.  
     */
    DBClusterParameterGroupName: String;
  }
  export interface DeleteDBClusterResult {
    DBCluster?: DBCluster;
  }
  export interface DeleteDBClusterSnapshotMessage {
    /**
     * The identifier of the DB cluster snapshot to delete. Constraints: Must be the name of an existing DB cluster snapshot in the available state.
     */
    DBClusterSnapshotIdentifier: String;
  }
  export interface DeleteDBClusterSnapshotResult {
    DBClusterSnapshot?: DBClusterSnapshot;
  }
  export interface DeleteDBInstanceAutomatedBackupMessage {
    /**
     * The identifier for the source DB instance, which can't be changed and which is unique to an Amazon Web Services Region.
     */
    DbiResourceId?: String;
    /**
     * The Amazon Resource Name (ARN) of the automated backups to delete, for example, arn:aws:rds:us-east-1:123456789012:auto-backup:ab-L2IJCEXJP7XQ7HOJ4SIEXAMPLE. This setting doesn't apply to RDS Custom.
     */
    DBInstanceAutomatedBackupsArn?: String;
  }
  export interface DeleteDBInstanceAutomatedBackupResult {
    DBInstanceAutomatedBackup?: DBInstanceAutomatedBackup;
  }
  export interface DeleteDBInstanceMessage {
    /**
     * The DB instance identifier for the DB instance to be deleted. This parameter isn't case-sensitive. Constraints:   Must match the name of an existing DB instance.  
     */
    DBInstanceIdentifier: String;
    /**
     * Specifies whether to skip the creation of a final DB snapshot before deleting the instance. If you enable this parameter, RDS doesn't create a DB snapshot. If you don't enable this parameter, RDS creates a DB snapshot before the DB instance is deleted. By default, skip isn't enabled, and the DB snapshot is created.  If you don't enable this parameter, you must specify the FinalDBSnapshotIdentifier parameter.  When a DB instance is in a failure state and has a status of failed, incompatible-restore, or incompatible-network, RDS can delete the instance only if you enable this parameter. If you delete a read replica or an RDS Custom instance, you must enable this setting. This setting is required for RDS Custom.
     */
    SkipFinalSnapshot?: Boolean;
    /**
     * The DBSnapshotIdentifier of the new DBSnapshot created when the SkipFinalSnapshot parameter is disabled.  If you enable this parameter and also enable SkipFinalShapshot, the command results in an error.  This setting doesn't apply to RDS Custom. Constraints:   Must be 1 to 255 letters or numbers.   First character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.   Can't be specified when deleting a read replica.  
     */
    FinalDBSnapshotIdentifier?: String;
    /**
     * Specifies whether to remove automated backups immediately after the DB instance is deleted. This parameter isn't case-sensitive. The default is to remove automated backups immediately after the DB instance is deleted.
     */
    DeleteAutomatedBackups?: BooleanOptional;
  }
  export interface DeleteDBInstanceResult {
    DBInstance?: DBInstance;
  }
  export interface DeleteDBParameterGroupMessage {
    /**
     * The name of the DB parameter group. Constraints:   Must be the name of an existing DB parameter group   You can't delete a default DB parameter group   Can't be associated with any DB instances  
     */
    DBParameterGroupName: String;
  }
  export interface DeleteDBProxyEndpointRequest {
    /**
     * The name of the DB proxy endpoint to delete.
     */
    DBProxyEndpointName: DBProxyEndpointName;
  }
  export interface DeleteDBProxyEndpointResponse {
    /**
     * The data structure representing the details of the DB proxy endpoint that you delete.
     */
    DBProxyEndpoint?: DBProxyEndpoint;
  }
  export interface DeleteDBProxyRequest {
    /**
     * The name of the DB proxy to delete.
     */
    DBProxyName: String;
  }
  export interface DeleteDBProxyResponse {
    /**
     * The data structure representing the details of the DB proxy that you delete.
     */
    DBProxy?: DBProxy;
  }
  export interface DeleteDBSecurityGroupMessage {
    /**
     * The name of the DB security group to delete.  You can't delete the default DB security group.  Constraints:   Must be 1 to 255 letters, numbers, or hyphens.   First character must be a letter   Can't end with a hyphen or contain two consecutive hyphens   Must not be "Default"  
     */
    DBSecurityGroupName: String;
  }
  export interface DeleteDBSnapshotMessage {
    /**
     * The DB snapshot identifier. Constraints: Must be the name of an existing DB snapshot in the available state.
     */
    DBSnapshotIdentifier: String;
  }
  export interface DeleteDBSnapshotResult {
    DBSnapshot?: DBSnapshot;
  }
  export interface DeleteDBSubnetGroupMessage {
    /**
     * The name of the database subnet group to delete.  You can't delete the default subnet group.  Constraints: Must match the name of an existing DBSubnetGroup. Must not be default. Example: mydbsubnetgroup 
     */
    DBSubnetGroupName: String;
  }
  export interface DeleteEventSubscriptionMessage {
    /**
     * The name of the RDS event notification subscription you want to delete.
     */
    SubscriptionName: String;
  }
  export interface DeleteEventSubscriptionResult {
    EventSubscription?: EventSubscription;
  }
  export interface DeleteGlobalClusterMessage {
    /**
     * The cluster identifier of the global database cluster being deleted.
     */
    GlobalClusterIdentifier: String;
  }
  export interface DeleteGlobalClusterResult {
    GlobalCluster?: GlobalCluster;
  }
  export interface DeleteOptionGroupMessage {
    /**
     * The name of the option group to be deleted.  You can't delete default option groups. 
     */
    OptionGroupName: String;
  }
  export interface DeregisterDBProxyTargetsRequest {
    /**
     * The identifier of the DBProxy that is associated with the DBProxyTargetGroup.
     */
    DBProxyName: String;
    /**
     * The identifier of the DBProxyTargetGroup.
     */
    TargetGroupName?: String;
    /**
     * One or more DB instance identifiers.
     */
    DBInstanceIdentifiers?: StringList;
    /**
     * One or more DB cluster identifiers.
     */
    DBClusterIdentifiers?: StringList;
  }
  export interface DeregisterDBProxyTargetsResponse {
  }
  export interface DescribeAccountAttributesMessage {
  }
  export interface DescribeBlueGreenDeploymentsRequest {
    /**
     * The blue/green deployment identifier. If you specify this parameter, the response only includes information about the specific blue/green deployment. This parameter isn't case-sensitive. Constraints:   Must match an existing blue/green deployment identifier.  
     */
    BlueGreenDeploymentIdentifier?: BlueGreenDeploymentIdentifier;
    /**
     * A filter that specifies one or more blue/green deployments to describe. Valid Values:    blue-green-deployment-identifier - Accepts system-generated identifiers for blue/green deployments. The results list only includes information about the blue/green deployments with the specified identifiers.    blue-green-deployment-name - Accepts user-supplied names for blue/green deployments. The results list only includes information about the blue/green deployments with the specified names.    source - Accepts source databases for a blue/green deployment. The results list only includes information about the blue/green deployments with the specified source databases.    target - Accepts target databases for a blue/green deployment. The results list only includes information about the blue/green deployments with the specified target databases.  
     */
    Filters?: FilterList;
    /**
     * An optional pagination token provided by a previous DescribeBlueGreenDeployments request. If you specify this parameter, the response only includes records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so you can retrieve the remaining results. Default: 100 Constraints:   Must be a minimum of 20.   Can't exceed 100.  
     */
    MaxRecords?: MaxRecords;
  }
  export interface DescribeBlueGreenDeploymentsResponse {
    /**
     * A list of blue/green deployments in the current account and Amazon Web Services Region.
     */
    BlueGreenDeployments?: BlueGreenDeploymentList;
    /**
     * A pagination token that can be used in a later DescribeBlueGreenDeployments request.
     */
    Marker?: String;
  }
  export interface DescribeCertificatesMessage {
    /**
     * The user-supplied certificate identifier. If this parameter is specified, information for only the identified certificate is returned. This parameter isn't case-sensitive. Constraints:   Must match an existing CertificateIdentifier.  
     */
    CertificateIdentifier?: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeCertificates request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBClusterAutomatedBackupsMessage {
    /**
     * The resource ID of the DB cluster that is the source of the automated backup. This parameter isn't case-sensitive.
     */
    DbClusterResourceId?: String;
    /**
     * (Optional) The user-supplied DB cluster identifier. If this parameter is specified, it must match the identifier of an existing DB cluster. It returns information from the specific DB cluster's automated backup. This parameter isn't case-sensitive.
     */
    DBClusterIdentifier?: String;
    /**
     * A filter that specifies which resources to return based on status. Supported filters are the following:    status     retained - Automated backups for deleted clusters and after backup replication is stopped.      db-cluster-id - Accepts DB cluster identifiers and Amazon Resource Names (ARNs). The results list includes only information about the DB cluster automated backups identified by these ARNs.    db-cluster-resource-id - Accepts DB resource identifiers and Amazon Resource Names (ARNs). The results list includes only information about the DB cluster resources identified by these ARNs.   Returns all resources by default. The status for each resource is specified in the response.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results.
     */
    MaxRecords?: IntegerOptional;
    /**
     * The pagination token provided in the previous request. If this parameter is specified the response includes only records beyond the marker, up to MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBClusterBacktracksMessage {
    /**
     * The DB cluster identifier of the DB cluster to be described. This parameter is stored as a lowercase string. Constraints:   Must contain from 1 to 63 alphanumeric characters or hyphens.   First character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.   Example: my-cluster1 
     */
    DBClusterIdentifier: String;
    /**
     * If specified, this value is the backtrack identifier of the backtrack to be described. Constraints:   Must contain a valid universally unique identifier (UUID). For more information about UUIDs, see Universally unique identifier.   Example: 123e4567-e89b-12d3-a456-426655440000 
     */
    BacktrackIdentifier?: String;
    /**
     * A filter that specifies one or more DB clusters to describe. Supported filters include the following:    db-cluster-backtrack-id - Accepts backtrack identifiers. The results list includes information about only the backtracks identified by these identifiers.    db-cluster-backtrack-status - Accepts any of the following backtrack status values:    applying     completed     failed     pending    The results list includes information about only the backtracks identified by these values.  
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeDBClusterBacktracks request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBClusterEndpointsMessage {
    /**
     * The DB cluster identifier of the DB cluster associated with the endpoint. This parameter is stored as a lowercase string.
     */
    DBClusterIdentifier?: String;
    /**
     * The identifier of the endpoint to describe. This parameter is stored as a lowercase string.
     */
    DBClusterEndpointIdentifier?: String;
    /**
     * A set of name-value pairs that define which endpoints to include in the output. The filters are specified as name-value pairs, in the format Name=endpoint_type,Values=endpoint_type1,endpoint_type2,.... Name can be one of: db-cluster-endpoint-type, db-cluster-endpoint-custom-type, db-cluster-endpoint-id, db-cluster-endpoint-status. Values for the  db-cluster-endpoint-type filter can be one or more of: reader, writer, custom. Values for the db-cluster-endpoint-custom-type filter can be one or more of: reader, any. Values for the db-cluster-endpoint-status filter can be one or more of: available, creating, deleting, inactive, modifying.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeDBClusterEndpoints request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBClusterParameterGroupsMessage {
    /**
     * The name of a specific DB cluster parameter group to return details for. Constraints:   If supplied, must match the name of an existing DBClusterParameterGroup.  
     */
    DBClusterParameterGroupName?: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeDBClusterParameterGroups request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBClusterParametersMessage {
    /**
     * The name of a specific DB cluster parameter group to return parameter details for. Constraints:   If supplied, must match the name of an existing DBClusterParameterGroup.  
     */
    DBClusterParameterGroupName: String;
    /**
     * A specific source to return parameters for. Valid Values:    customer     engine     service   
     */
    Source?: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeDBClusterParameters request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBClusterSnapshotAttributesMessage {
    /**
     * The identifier for the DB cluster snapshot to describe the attributes for.
     */
    DBClusterSnapshotIdentifier: String;
  }
  export interface DescribeDBClusterSnapshotAttributesResult {
    DBClusterSnapshotAttributesResult?: DBClusterSnapshotAttributesResult;
  }
  export interface DescribeDBClusterSnapshotsMessage {
    /**
     * The ID of the DB cluster to retrieve the list of DB cluster snapshots for. This parameter can't be used in conjunction with the DBClusterSnapshotIdentifier parameter. This parameter isn't case-sensitive. Constraints:   If supplied, must match the identifier of an existing DBCluster.  
     */
    DBClusterIdentifier?: String;
    /**
     * A specific DB cluster snapshot identifier to describe. This parameter can't be used in conjunction with the DBClusterIdentifier parameter. This value is stored as a lowercase string. Constraints:   If supplied, must match the identifier of an existing DBClusterSnapshot.   If this identifier is for an automated snapshot, the SnapshotType parameter must also be specified.  
     */
    DBClusterSnapshotIdentifier?: String;
    /**
     * The type of DB cluster snapshots to be returned. You can specify one of the following values:    automated - Return all DB cluster snapshots that have been automatically taken by Amazon RDS for my Amazon Web Services account.    manual - Return all DB cluster snapshots that have been taken by my Amazon Web Services account.    shared - Return all manual DB cluster snapshots that have been shared to my Amazon Web Services account.    public - Return all DB cluster snapshots that have been marked as public.   If you don't specify a SnapshotType value, then both automated and manual DB cluster snapshots are returned. You can include shared DB cluster snapshots with these results by enabling the IncludeShared parameter. You can include public DB cluster snapshots with these results by enabling the IncludePublic parameter. The IncludeShared and IncludePublic parameters don't apply for SnapshotType values of manual or automated. The IncludePublic parameter doesn't apply when SnapshotType is set to shared. The IncludeShared parameter doesn't apply when SnapshotType is set to public.
     */
    SnapshotType?: String;
    /**
     * A filter that specifies one or more DB cluster snapshots to describe. Supported filters:    db-cluster-id - Accepts DB cluster identifiers and DB cluster Amazon Resource Names (ARNs).    db-cluster-snapshot-id - Accepts DB cluster snapshot identifiers.    snapshot-type - Accepts types of DB cluster snapshots.    engine - Accepts names of database engines.  
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeDBClusterSnapshots request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * Specifies whether to include shared manual DB cluster snapshots from other Amazon Web Services accounts that this Amazon Web Services account has been given permission to copy or restore. By default, these snapshots are not included. You can give an Amazon Web Services account permission to restore a manual DB cluster snapshot from another Amazon Web Services account by the ModifyDBClusterSnapshotAttribute API action.
     */
    IncludeShared?: Boolean;
    /**
     * Specifies whether to include manual DB cluster snapshots that are public and can be copied or restored by any Amazon Web Services account. By default, the public snapshots are not included. You can share a manual DB cluster snapshot as public by using the ModifyDBClusterSnapshotAttribute API action.
     */
    IncludePublic?: Boolean;
    /**
     * A specific DB cluster resource ID to describe.
     */
    DbClusterResourceId?: String;
  }
  export interface DescribeDBClustersMessage {
    /**
     * The user-supplied DB cluster identifier or the Amazon Resource Name (ARN) of the DB cluster. If this parameter is specified, information for only the specific DB cluster is returned. This parameter isn't case-sensitive. Constraints:   If supplied, must match an existing DB cluster identifier.  
     */
    DBClusterIdentifier?: String;
    /**
     * A filter that specifies one or more DB clusters to describe. Supported Filters:    clone-group-id - Accepts clone group identifiers. The results list only includes information about the DB clusters associated with these clone groups.    db-cluster-id - Accepts DB cluster identifiers and DB cluster Amazon Resource Names (ARNs). The results list only includes information about the DB clusters identified by these ARNs.    db-cluster-resource-id - Accepts DB cluster resource identifiers. The results list will only include information about the DB clusters identified by these DB cluster resource identifiers.    domain - Accepts Active Directory directory IDs. The results list only includes information about the DB clusters associated with these domains.    engine - Accepts engine names. The results list only includes information about the DB clusters for these engines.  
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeDBClusters request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * Specifies whether the output includes information about clusters shared from other Amazon Web Services accounts.
     */
    IncludeShared?: Boolean;
  }
  export interface DescribeDBEngineVersionsMessage {
    /**
     * The database engine to return version details for. Valid Values:    aurora-mysql     aurora-postgresql     custom-oracle-ee     mariadb     mysql     oracle-ee     oracle-ee-cdb     oracle-se2     oracle-se2-cdb     postgres     sqlserver-ee     sqlserver-se     sqlserver-ex     sqlserver-web   
     */
    Engine?: String;
    /**
     * A specific database engine version to return details for. Example: 5.1.49 
     */
    EngineVersion?: String;
    /**
     * The name of a specific DB parameter group family to return details for. Constraints:   If supplied, must match an existing DB parameter group family.  
     */
    DBParameterGroupFamily?: String;
    /**
     * A filter that specifies one or more DB engine versions to describe. Supported filters:    db-parameter-group-family - Accepts parameter groups family names. The results list only includes information about the DB engine versions for these parameter group families.    engine - Accepts engine names. The results list only includes information about the DB engine versions for these engines.    engine-mode - Accepts DB engine modes. The results list only includes information about the DB engine versions for these engine modes. Valid DB engine modes are the following:    global     multimaster     parallelquery     provisioned     serverless       engine-version - Accepts engine versions. The results list only includes information about the DB engine versions for these engine versions.    status - Accepts engine version statuses. The results list only includes information about the DB engine versions for these statuses. Valid statuses are the following:    available     deprecated     
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more than the MaxRecords value is available, a pagination token called a marker is included in the response so you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * Specifies whether to return only the default version of the specified engine or the engine and major version combination.
     */
    DefaultOnly?: Boolean;
    /**
     * Specifies whether to list the supported character sets for each engine version. If this parameter is enabled and the requested engine supports the CharacterSetName parameter for CreateDBInstance, the response includes a list of supported character sets for each engine version. For RDS Custom, the default is not to list supported character sets. If you enable this parameter, RDS Custom returns no results.
     */
    ListSupportedCharacterSets?: BooleanOptional;
    /**
     * Specifies whether to list the supported time zones for each engine version. If this parameter is enabled and the requested engine supports the TimeZone parameter for CreateDBInstance, the response includes a list of supported time zones for each engine version. For RDS Custom, the default is not to list supported time zones. If you enable this parameter, RDS Custom returns no results.
     */
    ListSupportedTimezones?: BooleanOptional;
    /**
     * Specifies whether to also list the engine versions that aren't available. The default is to list only available engine versions.
     */
    IncludeAll?: BooleanOptional;
  }
  export interface DescribeDBInstanceAutomatedBackupsMessage {
    /**
     * The resource ID of the DB instance that is the source of the automated backup. This parameter isn't case-sensitive.
     */
    DbiResourceId?: String;
    /**
     * (Optional) The user-supplied instance identifier. If this parameter is specified, it must match the identifier of an existing DB instance. It returns information from the specific DB instance's automated backup. This parameter isn't case-sensitive.
     */
    DBInstanceIdentifier?: String;
    /**
     * A filter that specifies which resources to return based on status. Supported filters are the following:    status     active - Automated backups for current instances.    creating - Automated backups that are waiting for the first automated snapshot to be available.    retained - Automated backups for deleted instances and after backup replication is stopped.      db-instance-id - Accepts DB instance identifiers and Amazon Resource Names (ARNs). The results list includes only information about the DB instance automated backups identified by these ARNs.    dbi-resource-id - Accepts DB resource identifiers and Amazon Resource Names (ARNs). The results list includes only information about the DB instance resources identified by these ARNs.   Returns all resources by default. The status for each resource is specified in the response.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results.
     */
    MaxRecords?: IntegerOptional;
    /**
     * The pagination token provided in the previous request. If this parameter is specified the response includes only records beyond the marker, up to MaxRecords.
     */
    Marker?: String;
    /**
     * The Amazon Resource Name (ARN) of the replicated automated backups, for example, arn:aws:rds:us-east-1:123456789012:auto-backup:ab-L2IJCEXJP7XQ7HOJ4SIEXAMPLE. This setting doesn't apply to RDS Custom.
     */
    DBInstanceAutomatedBackupsArn?: String;
  }
  export interface DescribeDBInstancesMessage {
    /**
     * The user-supplied instance identifier or the Amazon Resource Name (ARN) of the DB instance. If this parameter is specified, information from only the specific DB instance is returned. This parameter isn't case-sensitive. Constraints:   If supplied, must match the identifier of an existing DB instance.  
     */
    DBInstanceIdentifier?: String;
    /**
     * A filter that specifies one or more DB instances to describe. Supported Filters:    db-cluster-id - Accepts DB cluster identifiers and DB cluster Amazon Resource Names (ARNs). The results list only includes information about the DB instances associated with the DB clusters identified by these ARNs.    db-instance-id - Accepts DB instance identifiers and DB instance Amazon Resource Names (ARNs). The results list only includes information about the DB instances identified by these ARNs.    dbi-resource-id - Accepts DB instance resource identifiers. The results list only includes information about the DB instances identified by these DB instance resource identifiers.    domain - Accepts Active Directory directory IDs. The results list only includes information about the DB instances associated with these domains.    engine - Accepts engine names. The results list only includes information about the DB instances for these engines.  
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeDBInstances request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBLogFilesDetails {
    /**
     * The name of the log file for the specified DB instance.
     */
    LogFileName?: String;
    /**
     * A POSIX timestamp when the last log entry was written.
     */
    LastWritten?: Long;
    /**
     * The size, in bytes, of the log file for the specified DB instance.
     */
    Size?: Long;
  }
  export type DescribeDBLogFilesList = DescribeDBLogFilesDetails[];
  export interface DescribeDBLogFilesMessage {
    /**
     * The customer-assigned name of the DB instance that contains the log files you want to list. Constraints:   Must match the identifier of an existing DBInstance.  
     */
    DBInstanceIdentifier: String;
    /**
     * Filters the available log files for log file names that contain the specified string.
     */
    FilenameContains?: String;
    /**
     * Filters the available log files for files written since the specified date, in POSIX timestamp format with milliseconds.
     */
    FileLastWritten?: Long;
    /**
     * Filters the available log files for files larger than the specified size.
     */
    FileSize?: Long;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so you can retrieve the remaining results.
     */
    MaxRecords?: IntegerOptional;
    /**
     * The pagination token provided in the previous request. If this parameter is specified the response includes only records beyond the marker, up to MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBLogFilesResponse {
    /**
     * The DB log files returned.
     */
    DescribeDBLogFiles?: DescribeDBLogFilesList;
    /**
     * A pagination token that can be used in a later DescribeDBLogFiles request.
     */
    Marker?: String;
  }
  export interface DescribeDBParameterGroupsMessage {
    /**
     * The name of a specific DB parameter group to return details for. Constraints:   If supplied, must match the name of an existing DBClusterParameterGroup.  
     */
    DBParameterGroupName?: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeDBParameterGroups request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBParametersMessage {
    /**
     * The name of a specific DB parameter group to return details for. Constraints:   If supplied, must match the name of an existing DBParameterGroup.  
     */
    DBParameterGroupName: String;
    /**
     * The parameter types to return. Default: All parameter types returned Valid Values: user | system | engine-default 
     */
    Source?: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeDBParameters request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBProxiesRequest {
    /**
     * The name of the DB proxy. If you omit this parameter, the output includes information about all DB proxies owned by your Amazon Web Services account ID.
     */
    DBProxyName?: String;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: MaxRecords;
  }
  export interface DescribeDBProxiesResponse {
    /**
     * A return value representing an arbitrary number of DBProxy data structures.
     */
    DBProxies?: DBProxyList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBProxyEndpointsRequest {
    /**
     * The name of the DB proxy whose endpoints you want to describe. If you omit this parameter, the output includes information about all DB proxy endpoints associated with all your DB proxies.
     */
    DBProxyName?: DBProxyName;
    /**
     * The name of a DB proxy endpoint to describe. If you omit this parameter, the output includes information about all DB proxy endpoints associated with the specified proxy.
     */
    DBProxyEndpointName?: DBProxyEndpointName;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: MaxRecords;
  }
  export interface DescribeDBProxyEndpointsResponse {
    /**
     * The list of ProxyEndpoint objects returned by the API operation.
     */
    DBProxyEndpoints?: DBProxyEndpointList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBProxyTargetGroupsRequest {
    /**
     * The identifier of the DBProxy associated with the target group.
     */
    DBProxyName: String;
    /**
     * The identifier of the DBProxyTargetGroup to describe.
     */
    TargetGroupName?: String;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: MaxRecords;
  }
  export interface DescribeDBProxyTargetGroupsResponse {
    /**
     * An arbitrary number of DBProxyTargetGroup objects, containing details of the corresponding target groups.
     */
    TargetGroups?: TargetGroupList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBProxyTargetsRequest {
    /**
     * The identifier of the DBProxyTarget to describe.
     */
    DBProxyName: String;
    /**
     * The identifier of the DBProxyTargetGroup to describe.
     */
    TargetGroupName?: String;
    /**
     * This parameter is not currently supported.
     */
    Filters?: FilterList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that the remaining results can be retrieved. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: MaxRecords;
  }
  export interface DescribeDBProxyTargetsResponse {
    /**
     * An arbitrary number of DBProxyTarget objects, containing details of the corresponding targets.
     */
    Targets?: TargetList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBSecurityGroupsMessage {
    /**
     * The name of the DB security group to return details for.
     */
    DBSecurityGroupName?: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeDBSecurityGroups request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeDBSnapshotAttributesMessage {
    /**
     * The identifier for the DB snapshot to describe the attributes for.
     */
    DBSnapshotIdentifier: String;
  }
  export interface DescribeDBSnapshotAttributesResult {
    DBSnapshotAttributesResult?: DBSnapshotAttributesResult;
  }
  export interface DescribeDBSnapshotsMessage {
    /**
     * The ID of the DB instance to retrieve the list of DB snapshots for. This parameter isn't case-sensitive. Constraints:   If supplied, must match the identifier of an existing DBInstance.  
     */
    DBInstanceIdentifier?: String;
    /**
     * A specific DB snapshot identifier to describe. This value is stored as a lowercase string. Constraints:   If supplied, must match the identifier of an existing DBSnapshot.   If this identifier is for an automated snapshot, the SnapshotType parameter must also be specified.  
     */
    DBSnapshotIdentifier?: String;
    /**
     * The type of snapshots to be returned. You can specify one of the following values:    automated - Return all DB snapshots that have been automatically taken by Amazon RDS for my Amazon Web Services account.    manual - Return all DB snapshots that have been taken by my Amazon Web Services account.    shared - Return all manual DB snapshots that have been shared to my Amazon Web Services account.    public - Return all DB snapshots that have been marked as public.    awsbackup - Return the DB snapshots managed by the Amazon Web Services Backup service. For information about Amazon Web Services Backup, see the  Amazon Web Services Backup Developer Guide.   The awsbackup type does not apply to Aurora.   If you don't specify a SnapshotType value, then both automated and manual snapshots are returned. Shared and public DB snapshots are not included in the returned results by default. You can include shared snapshots with these results by enabling the IncludeShared parameter. You can include public snapshots with these results by enabling the IncludePublic parameter. The IncludeShared and IncludePublic parameters don't apply for SnapshotType values of manual or automated. The IncludePublic parameter doesn't apply when SnapshotType is set to shared. The IncludeShared parameter doesn't apply when SnapshotType is set to public.
     */
    SnapshotType?: String;
    /**
     * A filter that specifies one or more DB snapshots to describe. Supported filters:    db-instance-id - Accepts DB instance identifiers and DB instance Amazon Resource Names (ARNs).    db-snapshot-id - Accepts DB snapshot identifiers.    dbi-resource-id - Accepts identifiers of source DB instances.    snapshot-type - Accepts types of DB snapshots.    engine - Accepts names of database engines.  
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeDBSnapshots request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * Specifies whether to include shared manual DB cluster snapshots from other Amazon Web Services accounts that this Amazon Web Services account has been given permission to copy or restore. By default, these snapshots are not included. You can give an Amazon Web Services account permission to restore a manual DB snapshot from another Amazon Web Services account by using the ModifyDBSnapshotAttribute API action. This setting doesn't apply to RDS Custom.
     */
    IncludeShared?: Boolean;
    /**
     * Specifies whether to include manual DB cluster snapshots that are public and can be copied or restored by any Amazon Web Services account. By default, the public snapshots are not included. You can share a manual DB snapshot as public by using the ModifyDBSnapshotAttribute API. This setting doesn't apply to RDS Custom.
     */
    IncludePublic?: Boolean;
    /**
     * A specific DB resource ID to describe.
     */
    DbiResourceId?: String;
  }
  export interface DescribeDBSubnetGroupsMessage {
    /**
     * The name of the DB subnet group to return details for.
     */
    DBSubnetGroupName?: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeDBSubnetGroups request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeEngineDefaultClusterParametersMessage {
    /**
     * The name of the DB cluster parameter group family to return engine parameter information for.
     */
    DBParameterGroupFamily: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeEngineDefaultClusterParameters request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeEngineDefaultClusterParametersResult {
    EngineDefaults?: EngineDefaults;
  }
  export interface DescribeEngineDefaultParametersMessage {
    /**
     * The name of the DB parameter group family. Valid Values:    aurora-mysql5.7     aurora-mysql8.0     aurora-postgresql10     aurora-postgresql11     aurora-postgresql12     aurora-postgresql13     aurora-postgresql14     custom-oracle-ee-19     mariadb10.2     mariadb10.3     mariadb10.4     mariadb10.5     mariadb10.6     mysql5.7     mysql8.0     oracle-ee-19     oracle-ee-cdb-19     oracle-ee-cdb-21     oracle-se2-19     oracle-se2-cdb-19     oracle-se2-cdb-21     postgres10     postgres11     postgres12     postgres13     postgres14     sqlserver-ee-11.0     sqlserver-ee-12.0     sqlserver-ee-13.0     sqlserver-ee-14.0     sqlserver-ee-15.0     sqlserver-ex-11.0     sqlserver-ex-12.0     sqlserver-ex-13.0     sqlserver-ex-14.0     sqlserver-ex-15.0     sqlserver-se-11.0     sqlserver-se-12.0     sqlserver-se-13.0     sqlserver-se-14.0     sqlserver-se-15.0     sqlserver-web-11.0     sqlserver-web-12.0     sqlserver-web-13.0     sqlserver-web-14.0     sqlserver-web-15.0   
     */
    DBParameterGroupFamily: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeEngineDefaultParameters request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeEngineDefaultParametersResult {
    EngineDefaults?: EngineDefaults;
  }
  export interface DescribeEventCategoriesMessage {
    /**
     * The type of source that is generating the events. For RDS Proxy events, specify db-proxy. Valid Values: db-instance | db-cluster | db-parameter-group | db-security-group | db-snapshot | db-cluster-snapshot | db-proxy 
     */
    SourceType?: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
  }
  export interface DescribeEventSubscriptionsMessage {
    /**
     * The name of the RDS event notification subscription you want to describe.
     */
    SubscriptionName?: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeOrderableDBInstanceOptions request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords .
     */
    Marker?: String;
  }
  export interface DescribeEventsMessage {
    /**
     * The identifier of the event source for which events are returned. If not specified, then all sources are included in the response. Constraints:   If SourceIdentifier is supplied, SourceType must also be provided.   If the source type is a DB instance, a DBInstanceIdentifier value must be supplied.   If the source type is a DB cluster, a DBClusterIdentifier value must be supplied.   If the source type is a DB parameter group, a DBParameterGroupName value must be supplied.   If the source type is a DB security group, a DBSecurityGroupName value must be supplied.   If the source type is a DB snapshot, a DBSnapshotIdentifier value must be supplied.   If the source type is a DB cluster snapshot, a DBClusterSnapshotIdentifier value must be supplied.   If the source type is an RDS Proxy, a DBProxyName value must be supplied.   Can't end with a hyphen or contain two consecutive hyphens.  
     */
    SourceIdentifier?: String;
    /**
     * The event source to retrieve events for. If no value is specified, all events are returned.
     */
    SourceType?: SourceType;
    /**
     * The beginning of the time interval to retrieve events for, specified in ISO 8601 format. For more information about ISO 8601, go to the ISO8601 Wikipedia page.  Example: 2009-07-08T18:00Z
     */
    StartTime?: TStamp;
    /**
     * The end of the time interval for which to retrieve events, specified in ISO 8601 format. For more information about ISO 8601, go to the ISO8601 Wikipedia page.  Example: 2009-07-08T18:00Z
     */
    EndTime?: TStamp;
    /**
     * The number of minutes to retrieve events for. Default: 60
     */
    Duration?: IntegerOptional;
    /**
     * A list of event categories that trigger notifications for a event notification subscription.
     */
    EventCategories?: EventCategoriesList;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeEvents request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeExportTasksMessage {
    /**
     * The identifier of the snapshot or cluster export task to be described.
     */
    ExportTaskIdentifier?: String;
    /**
     * The Amazon Resource Name (ARN) of the snapshot or cluster exported to Amazon S3.
     */
    SourceArn?: String;
    /**
     * Filters specify one or more snapshot or cluster exports to describe. The filters are specified as name-value pairs that define what to include in the output. Filter names and values are case-sensitive. Supported filters include the following:    export-task-identifier - An identifier for the snapshot or cluster export task.    s3-bucket - The Amazon S3 bucket the data is exported to.    source-arn - The Amazon Resource Name (ARN) of the snapshot or cluster exported to Amazon S3.    status - The status of the export task. Must be lowercase. Valid statuses are the following:    canceled     canceling     complete     failed     in_progress     starting     
     */
    Filters?: FilterList;
    /**
     * An optional pagination token provided by a previous DescribeExportTasks request. If you specify this parameter, the response includes only records beyond the marker, up to the value specified by the MaxRecords parameter.
     */
    Marker?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified value, a pagination token called a marker is included in the response. You can use the marker in a later DescribeExportTasks request to retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: MaxRecords;
    /**
     * The type of source for the export.
     */
    SourceType?: ExportSourceType;
  }
  export interface DescribeGlobalClustersMessage {
    /**
     * The user-supplied DB cluster identifier. If this parameter is specified, information from only the specific DB cluster is returned. This parameter isn't case-sensitive. Constraints:   If supplied, must match an existing DBClusterIdentifier.  
     */
    GlobalClusterIdentifier?: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeGlobalClusters request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeOptionGroupOptionsMessage {
    /**
     * A required parameter. Options available for the given engine name are described. Valid Values:    mariadb     mysql     oracle-ee     oracle-ee-cdb     oracle-se2     oracle-se2-cdb     postgres     sqlserver-ee     sqlserver-se     sqlserver-ex     sqlserver-web   
     */
    EngineName: String;
    /**
     * If specified, filters the results to include only options for the specified major engine version.
     */
    MajorEngineVersion?: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeOptionGroupsMessage {
    /**
     * The name of the option group to describe. Can't be supplied together with EngineName or MajorEngineVersion.
     */
    OptionGroupName?: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * An optional pagination token provided by a previous DescribeOptionGroups request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * Filters the list of option groups to only include groups associated with a specific database engine. Valid Values:    mariadb     mysql     oracle-ee     oracle-ee-cdb     oracle-se2     oracle-se2-cdb     postgres     sqlserver-ee     sqlserver-se     sqlserver-ex     sqlserver-web   
     */
    EngineName?: String;
    /**
     * Filters the list of option groups to only include groups associated with a specific database engine version. If specified, then EngineName must also be specified.
     */
    MajorEngineVersion?: String;
  }
  export interface DescribeOrderableDBInstanceOptionsMessage {
    /**
     * The name of the engine to retrieve DB instance options for. Valid Values:    aurora-mysql     aurora-postgresql     custom-oracle-ee     mariadb     mysql     oracle-ee     oracle-ee-cdb     oracle-se2     oracle-se2-cdb     postgres     sqlserver-ee     sqlserver-se     sqlserver-ex     sqlserver-web   
     */
    Engine: String;
    /**
     * The engine version filter value. Specify this parameter to show only the available offerings matching the specified engine version.
     */
    EngineVersion?: String;
    /**
     * The DB instance class filter value. Specify this parameter to show only the available offerings matching the specified DB instance class.
     */
    DBInstanceClass?: String;
    /**
     * The license model filter value. Specify this parameter to show only the available offerings matching the specified license model. RDS Custom supports only the BYOL licensing model.
     */
    LicenseModel?: String;
    /**
     * The Availability Zone group associated with a Local Zone. Specify this parameter to retrieve available offerings for the Local Zones in the group. Omit this parameter to show the available offerings in the specified Amazon Web Services Region. This setting doesn't apply to RDS Custom.
     */
    AvailabilityZoneGroup?: String;
    /**
     * Specifies whether to show only VPC or non-VPC offerings. RDS Custom supports only VPC offerings. RDS Custom supports only VPC offerings. If you describe non-VPC offerings for RDS Custom, the output shows VPC offerings.
     */
    Vpc?: BooleanOptional;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 10000.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeOrderableDBInstanceOptions request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribePendingMaintenanceActionsMessage {
    /**
     * The ARN of a resource to return pending maintenance actions for.
     */
    ResourceIdentifier?: String;
    /**
     * A filter that specifies one or more resources to return pending maintenance actions for. Supported filters:    db-cluster-id - Accepts DB cluster identifiers and DB cluster Amazon Resource Names (ARNs). The results list only includes pending maintenance actions for the DB clusters identified by these ARNs.    db-instance-id - Accepts DB instance identifiers and DB instance ARNs. The results list only includes pending maintenance actions for the DB instances identified by these ARNs.  
     */
    Filters?: FilterList;
    /**
     * An optional pagination token provided by a previous DescribePendingMaintenanceActions request. If this parameter is specified, the response includes only records beyond the marker, up to a number of records specified by MaxRecords.
     */
    Marker?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
  }
  export interface DescribeReservedDBInstancesMessage {
    /**
     * The reserved DB instance identifier filter value. Specify this parameter to show only the reservation that matches the specified reservation ID.
     */
    ReservedDBInstanceId?: String;
    /**
     * The offering identifier filter value. Specify this parameter to show only purchased reservations matching the specified offering identifier.
     */
    ReservedDBInstancesOfferingId?: String;
    /**
     * The DB instance class filter value. Specify this parameter to show only those reservations matching the specified DB instances class.
     */
    DBInstanceClass?: String;
    /**
     * The duration filter value, specified in years or seconds. Specify this parameter to show only reservations for this duration. Valid Values: 1 | 3 | 31536000 | 94608000 
     */
    Duration?: String;
    /**
     * The product description filter value. Specify this parameter to show only those reservations matching the specified product description.
     */
    ProductDescription?: String;
    /**
     * The offering type filter value. Specify this parameter to show only the available offerings matching the specified offering type. Valid Values: "Partial Upfront" | "All Upfront" | "No Upfront"  
     */
    OfferingType?: String;
    /**
     * Specifies whether to show only those reservations that support Multi-AZ.
     */
    MultiAZ?: BooleanOptional;
    /**
     * The lease identifier filter value. Specify this parameter to show only the reservation that matches the specified lease ID.  Amazon Web Services Support might request the lease ID for an issue related to a reserved DB instance. 
     */
    LeaseId?: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more than the MaxRecords value is available, a pagination token called a marker is included in the response so you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeReservedDBInstancesOfferingsMessage {
    /**
     * The offering identifier filter value. Specify this parameter to show only the available offering that matches the specified reservation identifier. Example: 438012d3-4052-4cc7-b2e3-8d3372e0e706 
     */
    ReservedDBInstancesOfferingId?: String;
    /**
     * The DB instance class filter value. Specify this parameter to show only the available offerings matching the specified DB instance class.
     */
    DBInstanceClass?: String;
    /**
     * Duration filter value, specified in years or seconds. Specify this parameter to show only reservations for this duration. Valid Values: 1 | 3 | 31536000 | 94608000 
     */
    Duration?: String;
    /**
     * Product description filter value. Specify this parameter to show only the available offerings that contain the specified product description.  The results show offerings that partially match the filter value. 
     */
    ProductDescription?: String;
    /**
     * The offering type filter value. Specify this parameter to show only the available offerings matching the specified offering type. Valid Values: "Partial Upfront" | "All Upfront" | "No Upfront"  
     */
    OfferingType?: String;
    /**
     * Specifies whether to show only those reservations that support Multi-AZ.
     */
    MultiAZ?: BooleanOptional;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
    /**
     * The maximum number of records to include in the response. If more than the MaxRecords value is available, a pagination token called a marker is included in the response so you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface DescribeSourceRegionsMessage {
    /**
     * The source Amazon Web Services Region name. For example, us-east-1. Constraints:   Must specify a valid Amazon Web Services Region name.  
     */
    RegionName?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so you can retrieve the remaining results. Default: 100 Constraints: Minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeSourceRegions request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
  }
  export interface DescribeValidDBInstanceModificationsMessage {
    /**
     * The customer identifier or the ARN of your DB instance.
     */
    DBInstanceIdentifier: String;
  }
  export interface DescribeValidDBInstanceModificationsResult {
    ValidDBInstanceModificationsMessage?: ValidDBInstanceModificationsMessage;
  }
  export type Description = string;
  export interface DomainMembership {
    /**
     * The identifier of the Active Directory Domain.
     */
    Domain?: String;
    /**
     * The status of the Active Directory Domain membership for the DB instance or cluster. Values include joined, pending-join, failed, and so on.
     */
    Status?: String;
    /**
     * The fully qualified domain name (FQDN) of the Active Directory Domain.
     */
    FQDN?: String;
    /**
     * The name of the IAM role used when making API calls to the Directory Service.
     */
    IAMRoleName?: String;
    /**
     * The Active Directory organizational unit for the DB instance or cluster.
     */
    OU?: String;
    /**
     * The ARN for the Secrets Manager secret with the credentials for the user that's a member of the domain.
     */
    AuthSecretArn?: String;
    /**
     * The IPv4 DNS IP addresses of the primary and secondary Active Directory domain controllers.
     */
    DnsIps?: StringList;
  }
  export type DomainMembershipList = DomainMembership[];
  export type Double = number;
  export type DoubleOptional = number;
  export interface DoubleRange {
    /**
     * The minimum value in the range.
     */
    From?: Double;
    /**
     * The maximum value in the range.
     */
    To?: Double;
  }
  export type DoubleRangeList = DoubleRange[];
  export interface DownloadDBLogFilePortionDetails {
    /**
     * Entries from the specified log file.
     */
    LogFileData?: String;
    /**
     * A pagination token that can be used in a later DownloadDBLogFilePortion request.
     */
    Marker?: String;
    /**
     * A Boolean value that, if true, indicates there is more data to be downloaded.
     */
    AdditionalDataPending?: Boolean;
  }
  export interface DownloadDBLogFilePortionMessage {
    /**
     * The customer-assigned name of the DB instance that contains the log files you want to list. Constraints:   Must match the identifier of an existing DBInstance.  
     */
    DBInstanceIdentifier: String;
    /**
     * The name of the log file to be downloaded.
     */
    LogFileName: String;
    /**
     * The pagination token provided in the previous request or "0". If the Marker parameter is specified the response includes only records beyond the marker until the end of the file or up to NumberOfLines.
     */
    Marker?: String;
    /**
     * The number of lines to download. If the number of lines specified results in a file over 1 MB in size, the file is truncated at 1 MB in size. If the NumberOfLines parameter is specified, then the block of lines returned can be from the beginning or the end of the log file, depending on the value of the Marker parameter.   If neither Marker or NumberOfLines are specified, the entire log file is returned up to a maximum of 10000 lines, starting with the most recent log entries first.   If NumberOfLines is specified and Marker isn't specified, then the most recent lines from the end of the log file are returned.   If Marker is specified as "0", then the specified number of lines from the beginning of the log file are returned.   You can download the log file in blocks of lines by specifying the size of the block using the NumberOfLines parameter, and by specifying a value of "0" for the Marker parameter in your first request. Include the Marker value returned in the response as the Marker value for the next request, continuing until the AdditionalDataPending response element returns false.  
     */
    NumberOfLines?: Integer;
  }
  export interface EC2SecurityGroup {
    /**
     * Provides the status of the EC2 security group. Status can be "authorizing", "authorized", "revoking", and "revoked".
     */
    Status?: String;
    /**
     * Specifies the name of the EC2 security group.
     */
    EC2SecurityGroupName?: String;
    /**
     * Specifies the id of the EC2 security group.
     */
    EC2SecurityGroupId?: String;
    /**
     * Specifies the Amazon Web Services ID of the owner of the EC2 security group specified in the EC2SecurityGroupName field.
     */
    EC2SecurityGroupOwnerId?: String;
  }
  export type EC2SecurityGroupList = EC2SecurityGroup[];
  export interface Endpoint {
    /**
     * Specifies the DNS address of the DB instance.
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
     * Specifies the name of the DB parameter group family that the engine default parameters apply to.
     */
    DBParameterGroupFamily?: String;
    /**
     * An optional pagination token provided by a previous EngineDefaults request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords .
     */
    Marker?: String;
    /**
     * Contains a list of engine default parameters.
     */
    Parameters?: ParametersList;
  }
  export type EngineFamily = "MYSQL"|"POSTGRESQL"|"SQLSERVER"|string;
  export type EngineModeList = String[];
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
     * The source type that the returned categories belong to
     */
    SourceType?: String;
    /**
     * The event categories for the specified source type
     */
    EventCategories?: EventCategoriesList;
  }
  export type EventCategoriesMapList = EventCategoriesMap[];
  export interface EventCategoriesMessage {
    /**
     * A list of EventCategoriesMap data types.
     */
    EventCategoriesMapList?: EventCategoriesMapList;
  }
  export type EventList = Event[];
  export interface EventSubscription {
    /**
     * The Amazon Web Services customer account associated with the RDS event notification subscription.
     */
    CustomerAwsId?: String;
    /**
     * The RDS event notification subscription Id.
     */
    CustSubscriptionId?: String;
    /**
     * The topic ARN of the RDS event notification subscription.
     */
    SnsTopicArn?: String;
    /**
     * The status of the RDS event notification subscription. Constraints: Can be one of the following: creating | modifying | deleting | active | no-permission | topic-not-exist The status "no-permission" indicates that RDS no longer has permission to post to the SNS topic. The status "topic-not-exist" indicates that the topic was deleted after the subscription was created.
     */
    Status?: String;
    /**
     * The time the RDS event notification subscription was created.
     */
    SubscriptionCreationTime?: String;
    /**
     * The source type for the RDS event notification subscription.
     */
    SourceType?: String;
    /**
     * A list of source IDs for the RDS event notification subscription.
     */
    SourceIdsList?: SourceIdsList;
    /**
     * A list of event categories for the RDS event notification subscription.
     */
    EventCategoriesList?: EventCategoriesList;
    /**
     * A Boolean value indicating if the subscription is enabled. True indicates the subscription is enabled.
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
     * An optional pagination token provided by a previous DescribeOrderableDBInstanceOptions request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of EventSubscriptions data types.
     */
    EventSubscriptionsList?: EventSubscriptionsList;
  }
  export interface EventsMessage {
    /**
     * An optional pagination token provided by a previous Events request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of Event instances.
     */
    Events?: EventList;
  }
  export type ExportSourceType = "SNAPSHOT"|"CLUSTER"|string;
  export interface ExportTask {
    /**
     * A unique identifier for the snapshot or cluster export task. This ID isn't an identifier for the Amazon S3 bucket where the data is exported.
     */
    ExportTaskIdentifier?: String;
    /**
     * The Amazon Resource Name (ARN) of the snapshot or cluster exported to Amazon S3.
     */
    SourceArn?: String;
    /**
     * The data exported from the snapshot or cluster. Valid Values:    database - Export all the data from a specified database.    database.table table-name - Export a table of the snapshot or cluster. This format is valid only for RDS for MySQL, RDS for MariaDB, and Aurora MySQL.    database.schema schema-name - Export a database schema of the snapshot or cluster. This format is valid only for RDS for PostgreSQL and Aurora PostgreSQL.    database.schema.table table-name - Export a table of the database schema. This format is valid only for RDS for PostgreSQL and Aurora PostgreSQL.  
     */
    ExportOnly?: StringList;
    /**
     * The time when the snapshot was created.
     */
    SnapshotTime?: TStamp;
    /**
     * The time when the snapshot or cluster export task started.
     */
    TaskStartTime?: TStamp;
    /**
     * The time when the snapshot or cluster export task ended.
     */
    TaskEndTime?: TStamp;
    /**
     * The Amazon S3 bucket where the snapshot or cluster is exported to.
     */
    S3Bucket?: String;
    /**
     * The Amazon S3 bucket prefix that is the file name and path of the exported data.
     */
    S3Prefix?: String;
    /**
     * The name of the IAM role that is used to write to Amazon S3 when exporting a snapshot or cluster.
     */
    IamRoleArn?: String;
    /**
     * The key identifier of the Amazon Web Services KMS key that is used to encrypt the data when it's exported to Amazon S3. The KMS key identifier is its key ARN, key ID, alias ARN, or alias name. The IAM role used for the export must have encryption and decryption permissions to use this KMS key.
     */
    KmsKeyId?: String;
    /**
     * The progress status of the export task. The status can be one of the following:    CANCELED     CANCELING     COMPLETE     FAILED     IN_PROGRESS     STARTING   
     */
    Status?: String;
    /**
     * The progress of the snapshot or cluster export task as a percentage.
     */
    PercentProgress?: Integer;
    /**
     * The total amount of data exported, in gigabytes.
     */
    TotalExtractedDataInGB?: Integer;
    /**
     * The reason the export failed, if it failed.
     */
    FailureCause?: String;
    /**
     * A warning about the snapshot or cluster export task.
     */
    WarningMessage?: String;
    /**
     * The type of source for the export.
     */
    SourceType?: ExportSourceType;
  }
  export type ExportTasksList = ExportTask[];
  export interface ExportTasksMessage {
    /**
     * A pagination token that can be used in a later DescribeExportTasks request. A marker is used for pagination to identify the location to begin output for the next response of DescribeExportTasks.
     */
    Marker?: String;
    /**
     * Information about an export of a snapshot or cluster to Amazon S3.
     */
    ExportTasks?: ExportTasksList;
  }
  export interface FailoverDBClusterMessage {
    /**
     * The identifier of the DB cluster to force a failover for. This parameter isn't case-sensitive. Constraints:   Must match the identifier of an existing DB cluster.  
     */
    DBClusterIdentifier: String;
    /**
     * The name of the DB instance to promote to the primary DB instance. Specify the DB instance identifier for an Aurora Replica or a Multi-AZ readable standby in the DB cluster, for example mydbcluster-replica1. This setting isn't supported for RDS for MySQL Multi-AZ DB clusters.
     */
    TargetDBInstanceIdentifier?: String;
  }
  export interface FailoverDBClusterResult {
    DBCluster?: DBCluster;
  }
  export interface FailoverGlobalClusterMessage {
    /**
     * The identifier of the global database cluster (Aurora global database) this operation should apply to. The identifier is the unique key assigned by the user when the Aurora global database is created. In other words, it's the name of the Aurora global database. Constraints:   Must match the identifier of an existing global database cluster.  
     */
    GlobalClusterIdentifier: GlobalClusterIdentifier;
    /**
     * The identifier of the secondary Aurora DB cluster that you want to promote to the primary for the global database cluster. Use the Amazon Resource Name (ARN) for the identifier so that Aurora can locate the cluster in its Amazon Web Services Region.
     */
    TargetDbClusterIdentifier: DBClusterIdentifier;
    /**
     * Specifies whether to allow data loss for this global database cluster operation. Allowing data loss triggers a global failover operation. If you don't specify AllowDataLoss, the global database cluster operation defaults to a switchover. Constraints:   Can't be specified together with the Switchover parameter.  
     */
    AllowDataLoss?: BooleanOptional;
    /**
     * Specifies whether to switch over this global database cluster. Constraints:   Can't be specified together with the AllowDataLoss parameter.  
     */
    Switchover?: BooleanOptional;
  }
  export interface FailoverGlobalClusterResult {
    GlobalCluster?: GlobalCluster;
  }
  export interface FailoverState {
    /**
     * The current status of the global cluster. Possible values are as follows:   pending &#x96; The service received a request to switch over or fail over the global cluster. The global cluster's primary DB cluster and the specified secondary DB cluster are being verified before the operation starts.   failing-over &#x96; This status covers the range of Aurora internal operations that take place during the switchover or failover process, such as demoting the primary Aurora DB cluster, promoting the secondary Aurora DB cluster, and synchronizing replicas.   cancelling &#x96; The request to switch over or fail over the global cluster was cancelled and the primary Aurora DB cluster and the selected secondary Aurora DB cluster are returning to their previous states.  
     */
    Status?: FailoverStatus;
    /**
     * The Amazon Resource Name (ARN) of the Aurora DB cluster that is currently being demoted, and which is associated with this state.
     */
    FromDbClusterArn?: String;
    /**
     * The Amazon Resource Name (ARN) of the Aurora DB cluster that is currently being promoted, and which is associated with this state.
     */
    ToDbClusterArn?: String;
    /**
     * Indicates whether the operation is a global switchover or a global failover. If data loss is allowed, then the operation is a global failover. Otherwise, it's a switchover.
     */
    IsDataLossAllowed?: Boolean;
  }
  export type FailoverStatus = "pending"|"failing-over"|"cancelling"|string;
  export type FeatureNameList = String[];
  export interface Filter {
    /**
     * The name of the filter. Filter names are case-sensitive.
     */
    Name: String;
    /**
     * One or more filter values. Filter values are case-sensitive.
     */
    Values: FilterValueList;
  }
  export type FilterList = Filter[];
  export type FilterValueList = String[];
  export interface GlobalCluster {
    /**
     * Contains a user-supplied global database cluster identifier. This identifier is the unique key that identifies a global database cluster.
     */
    GlobalClusterIdentifier?: String;
    /**
     * The Amazon Web Services Region-unique, immutable identifier for the global database cluster. This identifier is found in Amazon Web Services CloudTrail log entries whenever the Amazon Web Services KMS key for the DB cluster is accessed.
     */
    GlobalClusterResourceId?: String;
    /**
     * The Amazon Resource Name (ARN) for the global database cluster.
     */
    GlobalClusterArn?: String;
    /**
     * Specifies the current state of this global database cluster.
     */
    Status?: String;
    /**
     * The Aurora database engine used by the global database cluster.
     */
    Engine?: String;
    /**
     * Indicates the database engine version.
     */
    EngineVersion?: String;
    /**
     * The default database name within the new global database cluster.
     */
    DatabaseName?: String;
    /**
     * The storage encryption setting for the global database cluster.
     */
    StorageEncrypted?: BooleanOptional;
    /**
     * The deletion protection setting for the new global database cluster.
     */
    DeletionProtection?: BooleanOptional;
    /**
     * The list of primary and secondary clusters within the global database cluster.
     */
    GlobalClusterMembers?: GlobalClusterMemberList;
    /**
     * A data object containing all properties for the current state of an in-process or pending switchover or failover process for this global cluster (Aurora global database). This object is empty unless the SwitchoverGlobalCluster or FailoverGlobalCluster operation was called on this global cluster.
     */
    FailoverState?: FailoverState;
  }
  export type GlobalClusterIdentifier = string;
  export type GlobalClusterList = GlobalCluster[];
  export interface GlobalClusterMember {
    /**
     * The Amazon Resource Name (ARN) for each Aurora DB cluster in the global cluster.
     */
    DBClusterArn?: String;
    /**
     * The Amazon Resource Name (ARN) for each read-only secondary cluster associated with the global cluster.
     */
    Readers?: ReadersArnList;
    /**
     * Indicates whether the Aurora DB cluster is the primary cluster (that is, has read-write capability) for the global cluster with which it is associated.
     */
    IsWriter?: Boolean;
    /**
     * The status of write forwarding for a secondary cluster in the global cluster.
     */
    GlobalWriteForwardingStatus?: WriteForwardingStatus;
    /**
     * The status of synchronization of each Aurora DB cluster in the global cluster.
     */
    SynchronizationStatus?: GlobalClusterMemberSynchronizationStatus;
  }
  export type GlobalClusterMemberList = GlobalClusterMember[];
  export type GlobalClusterMemberSynchronizationStatus = "connected"|"pending-resync"|string;
  export interface GlobalClustersMessage {
    /**
     * An optional pagination token provided by a previous DescribeGlobalClusters request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * The list of global clusters returned by this request.
     */
    GlobalClusters?: GlobalClusterList;
  }
  export type IAMAuthMode = "DISABLED"|"REQUIRED"|"ENABLED"|string;
  export interface IPRange {
    /**
     * The status of the IP range. Status can be "authorizing", "authorized", "revoking", and "revoked".
     */
    Status?: String;
    /**
     * The IP range.
     */
    CIDRIP?: String;
  }
  export type IPRangeList = IPRange[];
  export type Integer = number;
  export type IntegerOptional = number;
  export type KeyList = String[];
  export type KmsKeyIdOrArn = string;
  export interface ListTagsForResourceMessage {
    /**
     * The Amazon RDS resource with tags to be listed. This value is an Amazon Resource Name (ARN). For information about creating an ARN, see  Constructing an ARN for Amazon RDS in the Amazon RDS User Guide.
     */
    ResourceName: String;
    /**
     * This parameter isn't currently supported.
     */
    Filters?: FilterList;
  }
  export type LocalWriteForwardingStatus = "enabled"|"disabled"|"enabling"|"disabling"|"requested"|string;
  export type LogTypeList = String[];
  export type Long = number;
  export type LongOptional = number;
  export interface MasterUserSecret {
    /**
     * The Amazon Resource Name (ARN) of the secret.
     */
    SecretArn?: String;
    /**
     * The status of the secret. The possible status values include the following:    creating - The secret is being created.    active - The secret is available for normal use and rotation.    rotating - The secret is being rotated.    impaired - The secret can be used to access database credentials, but it can't be rotated. A secret might have this status if, for example, permissions are changed so that RDS can no longer access either the secret or the KMS key for the secret. When a secret has this status, you can correct the condition that caused the status. Alternatively, modify the DB instance to turn off automatic management of database credentials, and then modify the DB instance again to turn on automatic management of database credentials.  
     */
    SecretStatus?: String;
    /**
     * The Amazon Web Services KMS key identifier that is used to encrypt the secret.
     */
    KmsKeyId?: String;
  }
  export type MaxRecords = number;
  export interface MinimumEngineVersionPerAllowedValue {
    /**
     * The allowed value for an option setting.
     */
    AllowedValue?: String;
    /**
     * The minimum DB engine version required for the allowed value.
     */
    MinimumEngineVersion?: String;
  }
  export type MinimumEngineVersionPerAllowedValueList = MinimumEngineVersionPerAllowedValue[];
  export interface ModifyActivityStreamRequest {
    /**
     * The Amazon Resource Name (ARN) of the RDS for Oracle or Microsoft SQL Server DB instance. For example, arn:aws:rds:us-east-1:12345667890:instance:my-orcl-db.
     */
    ResourceArn?: String;
    /**
     * The audit policy state. When a policy is unlocked, it is read/write. When it is locked, it is read-only. You can edit your audit policy only when the activity stream is unlocked or stopped.
     */
    AuditPolicyState?: AuditPolicyState;
  }
  export interface ModifyActivityStreamResponse {
    /**
     * The Amazon Web Services KMS key identifier for encryption of messages in the database activity stream.
     */
    KmsKeyId?: String;
    /**
     * The name of the Amazon Kinesis data stream to be used for the database activity stream.
     */
    KinesisStreamName?: String;
    /**
     * The status of the modification to the database activity stream.
     */
    Status?: ActivityStreamStatus;
    /**
     * The mode of the database activity stream.
     */
    Mode?: ActivityStreamMode;
    /**
     * Indicates whether engine-native audit fields are included in the database activity stream.
     */
    EngineNativeAuditFieldsIncluded?: BooleanOptional;
    /**
     * The status of the modification to the policy state of the database activity stream.
     */
    PolicyStatus?: ActivityStreamPolicyStatus;
  }
  export interface ModifyCertificatesMessage {
    /**
     * The new default certificate identifier to override the current one with. To determine the valid values, use the describe-certificates CLI command or the DescribeCertificates API operation.
     */
    CertificateIdentifier?: String;
    /**
     * Specifies whether to remove the override for the default certificate. If the override is removed, the default certificate is the system default.
     */
    RemoveCustomerOverride?: BooleanOptional;
  }
  export interface ModifyCertificatesResult {
    Certificate?: Certificate;
  }
  export interface ModifyCurrentDBClusterCapacityMessage {
    /**
     * The DB cluster identifier for the cluster being modified. This parameter isn't case-sensitive. Constraints:   Must match the identifier of an existing DB cluster.  
     */
    DBClusterIdentifier: String;
    /**
     * The DB cluster capacity. When you change the capacity of a paused Aurora Serverless v1 DB cluster, it automatically resumes. Constraints:   For Aurora MySQL, valid capacity values are 1, 2, 4, 8, 16, 32, 64, 128, and 256.   For Aurora PostgreSQL, valid capacity values are 2, 4, 8, 16, 32, 64, 192, and 384.  
     */
    Capacity?: IntegerOptional;
    /**
     * The amount of time, in seconds, that Aurora Serverless v1 tries to find a scaling point to perform seamless scaling before enforcing the timeout action. The default is 300. Specify a value between 10 and 600 seconds.
     */
    SecondsBeforeTimeout?: IntegerOptional;
    /**
     * The action to take when the timeout is reached, either ForceApplyCapacityChange or RollbackCapacityChange.  ForceApplyCapacityChange, the default, sets the capacity to the specified value as soon as possible.  RollbackCapacityChange ignores the capacity change if a scaling point isn't found in the timeout period.
     */
    TimeoutAction?: String;
  }
  export interface ModifyCustomDBEngineVersionMessage {
    /**
     * The DB engine. The only supported values are custom-oracle-ee and custom-oracle-ee-cdb.
     */
    Engine: CustomEngineName;
    /**
     * The custom engine version (CEV) that you want to modify. This option is required for RDS Custom for Oracle, but optional for Amazon RDS. The combination of Engine and EngineVersion is unique per customer per Amazon Web Services Region.
     */
    EngineVersion: CustomEngineVersion;
    /**
     * An optional description of your CEV.
     */
    Description?: Description;
    /**
     * The availability status to be assigned to the CEV. Valid values are as follows:  available  You can use this CEV to create a new RDS Custom DB instance.  inactive  You can create a new RDS Custom instance by restoring a DB snapshot with this CEV. You can't patch or create new instances with this CEV.   You can change any status to any status. A typical reason to change status is to prevent the accidental use of a CEV, or to make a deprecated CEV eligible for use again. For example, you might change the status of your CEV from available to inactive, and from inactive back to available. To change the availability status of the CEV, it must not currently be in use by an RDS Custom instance, snapshot, or automated backup.
     */
    Status?: CustomEngineVersionStatus;
  }
  export interface ModifyDBClusterEndpointMessage {
    /**
     * The identifier of the endpoint to modify. This parameter is stored as a lowercase string.
     */
    DBClusterEndpointIdentifier: String;
    /**
     * The type of the endpoint. One of: READER, WRITER, ANY.
     */
    EndpointType?: String;
    /**
     * List of DB instance identifiers that are part of the custom endpoint group.
     */
    StaticMembers?: StringList;
    /**
     * List of DB instance identifiers that aren't part of the custom endpoint group. All other eligible instances are reachable through the custom endpoint. Only relevant if the list of static members is empty.
     */
    ExcludedMembers?: StringList;
  }
  export interface ModifyDBClusterMessage {
    /**
     * The DB cluster identifier for the cluster being modified. This parameter isn't case-sensitive. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Constraints:   Must match the identifier of an existing DB cluster.  
     */
    DBClusterIdentifier: String;
    /**
     * The new DB cluster identifier for the DB cluster when renaming a DB cluster. This value is stored as a lowercase string. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   The first character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.   Example: my-cluster2 
     */
    NewDBClusterIdentifier?: String;
    /**
     * Specifies whether the modifications in this request and any pending modifications are asynchronously applied as soon as possible, regardless of the PreferredMaintenanceWindow setting for the DB cluster. If this parameter is disabled, changes to the DB cluster are applied during the next maintenance window. Most modifications can be applied immediately or during the next scheduled maintenance window. Some modifications, such as turning on deletion protection and changing the master password, are applied immediately—regardless of when you choose to apply them. By default, this parameter is disabled. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    ApplyImmediately?: Boolean;
    /**
     * The number of days for which automated backups are retained. Specify a minimum value of 1. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Default: 1  Constraints:   Must be a value from 1 to 35.  
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * The name of the DB cluster parameter group to use for the DB cluster. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    DBClusterParameterGroupName?: String;
    /**
     * A list of EC2 VPC security groups to associate with this DB cluster. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * The port number on which the DB cluster accepts connections. Valid for Cluster Type: Aurora DB clusters only Valid Values: 1150-65535  Default: The same port as the original DB cluster.
     */
    Port?: IntegerOptional;
    /**
     * The new password for the master database user. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Constraints:   Must contain from 8 to 41 characters.   Can contain any printable ASCII character except "/", """, or "@".   Can't be specified if ManageMasterUserPassword is turned on.  
     */
    MasterUserPassword?: String;
    /**
     * The option group to associate the DB cluster with. DB clusters are associated with a default option group that can't be modified.
     */
    OptionGroupName?: String;
    /**
     * The daily time range during which automated backups are created if automated backups are enabled, using the BackupRetentionPeriod parameter. The default is a 30-minute window selected at random from an 8-hour block of time for each Amazon Web Services Region. To view the time blocks available, see  Backup window in the Amazon Aurora User Guide. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Constraints:   Must be in the format hh24:mi-hh24:mi.   Must be in Universal Coordinated Time (UTC).   Must not conflict with the preferred maintenance window.   Must be at least 30 minutes.  
     */
    PreferredBackupWindow?: String;
    /**
     * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC). Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters The default is a 30-minute window selected at random from an 8-hour block of time for each Amazon Web Services Region, occurring on a random day of the week. To see the time blocks available, see  Adjusting the Preferred DB Cluster Maintenance Window in the Amazon Aurora User Guide. Constraints:   Must be in the format ddd:hh24:mi-ddd:hh24:mi.   Days must be one of Mon | Tue | Wed | Thu | Fri | Sat | Sun.   Must be in Universal Coordinated Time (UTC).   Must be at least 30 minutes.  
     */
    PreferredMaintenanceWindow?: String;
    /**
     * Specifies whether to enable mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts. By default, mapping isn't enabled. For more information, see  IAM Database Authentication in the Amazon Aurora User Guide. Valid for Cluster Type: Aurora DB clusters only
     */
    EnableIAMDatabaseAuthentication?: BooleanOptional;
    /**
     * The target backtrack window, in seconds. To disable backtracking, set this value to 0. Valid for Cluster Type: Aurora MySQL DB clusters only Default: 0  Constraints:   If specified, this value must be set to a number from 0 to 259,200 (72 hours).  
     */
    BacktrackWindow?: LongOptional;
    /**
     * The configuration setting for the log types to be enabled for export to CloudWatch Logs for a specific DB cluster. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters The following values are valid for each DB engine:   Aurora MySQL - audit | error | general | slowquery    Aurora PostgreSQL - postgresql    RDS for MySQL - error | general | slowquery    RDS for PostgreSQL - postgresql | upgrade    For more information about exporting CloudWatch Logs for Amazon RDS, see  Publishing Database Logs to Amazon CloudWatch Logs in the Amazon RDS User Guide. For more information about exporting CloudWatch Logs for Amazon Aurora, see Publishing Database Logs to Amazon CloudWatch Logs in the Amazon Aurora User Guide.
     */
    CloudwatchLogsExportConfiguration?: CloudwatchLogsExportConfiguration;
    /**
     * The version number of the database engine to which you want to upgrade. Changing this parameter results in an outage. The change is applied during the next maintenance window unless ApplyImmediately is enabled. If the cluster that you're modifying has one or more read replicas, all replicas must be running an engine version that's the same or later than the version you specify. To list all of the available engine versions for Aurora MySQL, use the following command:  aws rds describe-db-engine-versions --engine aurora-mysql --query "DBEngineVersions[].EngineVersion"  To list all of the available engine versions for Aurora PostgreSQL, use the following command:  aws rds describe-db-engine-versions --engine aurora-postgresql --query "DBEngineVersions[].EngineVersion"  To list all of the available engine versions for RDS for MySQL, use the following command:  aws rds describe-db-engine-versions --engine mysql --query "DBEngineVersions[].EngineVersion"  To list all of the available engine versions for RDS for PostgreSQL, use the following command:  aws rds describe-db-engine-versions --engine postgres --query "DBEngineVersions[].EngineVersion"  Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    EngineVersion?: String;
    /**
     * Specifies whether major version upgrades are allowed. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Constraints:   You must allow major version upgrades when specifying a value for the EngineVersion parameter that is a different major version than the DB cluster's current version.  
     */
    AllowMajorVersionUpgrade?: Boolean;
    /**
     * The name of the DB parameter group to apply to all instances of the DB cluster.  When you apply a parameter group using the DBInstanceParameterGroupName parameter, the DB cluster isn't rebooted automatically. Also, parameter changes are applied immediately rather than during the next maintenance window.  Valid for Cluster Type: Aurora DB clusters only Default: The existing name setting Constraints:   The DB parameter group must be in the same DB parameter group family as this DB cluster.   The DBInstanceParameterGroupName parameter is valid in combination with the AllowMajorVersionUpgrade parameter for a major version upgrade only.  
     */
    DBInstanceParameterGroupName?: String;
    /**
     * The Active Directory directory ID to move the DB cluster to. Specify none to remove the cluster from its current domain. The domain must be created prior to this operation. For more information, see Kerberos Authentication in the Amazon Aurora User Guide. Valid for Cluster Type: Aurora DB clusters only
     */
    Domain?: String;
    /**
     * The name of the IAM role to use when making API calls to the Directory Service. Valid for Cluster Type: Aurora DB clusters only
     */
    DomainIAMRoleName?: String;
    /**
     * The scaling properties of the DB cluster. You can only modify scaling properties for DB clusters in serverless DB engine mode. Valid for Cluster Type: Aurora DB clusters only
     */
    ScalingConfiguration?: ScalingConfiguration;
    /**
     * Specifies whether the DB cluster has deletion protection enabled. The database can't be deleted when deletion protection is enabled. By default, deletion protection isn't enabled. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    DeletionProtection?: BooleanOptional;
    /**
     * Specifies whether to enable the HTTP endpoint for an Aurora Serverless v1 DB cluster. By default, the HTTP endpoint is disabled. When enabled, the HTTP endpoint provides a connectionless web service API for running SQL queries on the Aurora Serverless v1 DB cluster. You can also query your database from inside the RDS console with the query editor. For more information, see Using the Data API for Aurora Serverless v1 in the Amazon Aurora User Guide. Valid for Cluster Type: Aurora DB clusters only
     */
    EnableHttpEndpoint?: BooleanOptional;
    /**
     * Specifies whether to copy all tags from the DB cluster to snapshots of the DB cluster. The default is not to copy them. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    CopyTagsToSnapshot?: BooleanOptional;
    /**
     * Specifies whether to enable this DB cluster to forward write operations to the primary cluster of a global cluster (Aurora global database). By default, write operations are not allowed on Aurora DB clusters that are secondary clusters in an Aurora global database. You can set this value only on Aurora DB clusters that are members of an Aurora global database. With this parameter enabled, a secondary cluster can forward writes to the current primary cluster, and the resulting changes are replicated back to this cluster. For the primary DB cluster of an Aurora global database, this value is used immediately if the primary is demoted by a global cluster API operation, but it does nothing until then. Valid for Cluster Type: Aurora DB clusters only
     */
    EnableGlobalWriteForwarding?: BooleanOptional;
    /**
     * The compute and memory capacity of each DB instance in the Multi-AZ DB cluster, for example db.m6gd.xlarge. Not all DB instance classes are available in all Amazon Web Services Regions, or for all database engines. For the full list of DB instance classes and availability for your engine, see  DB Instance Class in the Amazon RDS User Guide. Valid for Cluster Type: Multi-AZ DB clusters only
     */
    DBClusterInstanceClass?: String;
    /**
     * The amount of storage in gibibytes (GiB) to allocate to each DB instance in the Multi-AZ DB cluster. Valid for Cluster Type: Multi-AZ DB clusters only
     */
    AllocatedStorage?: IntegerOptional;
    /**
     * The storage type to associate with the DB cluster. For information on storage types for Aurora DB clusters, see Storage configurations for Amazon Aurora DB clusters. For information on storage types for Multi-AZ DB clusters, see Settings for creating Multi-AZ DB clusters. When specified for a Multi-AZ DB cluster, a value for the Iops parameter is required. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Valid Values:   Aurora DB clusters - aurora | aurora-iopt1    Multi-AZ DB clusters - io1    Default:   Aurora DB clusters - aurora    Multi-AZ DB clusters - io1   
     */
    StorageType?: String;
    /**
     * The amount of Provisioned IOPS (input/output operations per second) to be initially allocated for each DB instance in the Multi-AZ DB cluster. For information about valid IOPS values, see Amazon RDS Provisioned IOPS storage in the Amazon RDS User Guide. Valid for Cluster Type: Multi-AZ DB clusters only Constraints:   Must be a multiple between .5 and 50 of the storage amount for the DB cluster.  
     */
    Iops?: IntegerOptional;
    /**
     * Specifies whether minor engine upgrades are applied automatically to the DB cluster during the maintenance window. By default, minor engine upgrades are applied automatically. Valid for Cluster Type: Multi-AZ DB clusters only
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
    /**
     * The interval, in seconds, between points when Enhanced Monitoring metrics are collected for the DB cluster. To turn off collecting Enhanced Monitoring metrics, specify 0. If MonitoringRoleArn is specified, also set MonitoringInterval to a value other than 0. Valid for Cluster Type: Multi-AZ DB clusters only Valid Values: 0 | 1 | 5 | 10 | 15 | 30 | 60  Default: 0 
     */
    MonitoringInterval?: IntegerOptional;
    /**
     * The Amazon Resource Name (ARN) for the IAM role that permits RDS to send Enhanced Monitoring metrics to Amazon CloudWatch Logs. An example is arn:aws:iam:123456789012:role/emaccess. For information on creating a monitoring role, see To create an IAM role for Amazon RDS Enhanced Monitoring in the Amazon RDS User Guide.  If MonitoringInterval is set to a value other than 0, supply a MonitoringRoleArn value. Valid for Cluster Type: Multi-AZ DB clusters only
     */
    MonitoringRoleArn?: String;
    /**
     * Specifies whether to turn on Performance Insights for the DB cluster. For more information, see  Using Amazon Performance Insights in the Amazon RDS User Guide. Valid for Cluster Type: Multi-AZ DB clusters only
     */
    EnablePerformanceInsights?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier for encryption of Performance Insights data. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. If you don't specify a value for PerformanceInsightsKMSKeyId, then Amazon RDS uses your default KMS key. There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region. Valid for Cluster Type: Multi-AZ DB clusters only
     */
    PerformanceInsightsKMSKeyId?: String;
    /**
     * The number of days to retain Performance Insights data. Valid for Cluster Type: Multi-AZ DB clusters only Valid Values:    7     month * 31, where month is a number of months from 1-23. Examples: 93 (3 months * 31), 341 (11 months * 31), 589 (19 months * 31)    731    Default: 7 days If you specify a retention period that isn't valid, such as 94, Amazon RDS issues an error.
     */
    PerformanceInsightsRetentionPeriod?: IntegerOptional;
    ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
    /**
     * The network type of the DB cluster. The network type is determined by the DBSubnetGroup specified for the DB cluster. A DBSubnetGroup can support only the IPv4 protocol or the IPv4 and the IPv6 protocols (DUAL). For more information, see  Working with a DB instance in a VPC in the Amazon Aurora User Guide.  Valid for Cluster Type: Aurora DB clusters only Valid Values: IPV4 | DUAL 
     */
    NetworkType?: String;
    /**
     * Specifies whether to manage the master user password with Amazon Web Services Secrets Manager. If the DB cluster doesn't manage the master user password with Amazon Web Services Secrets Manager, you can turn on this management. In this case, you can't specify MasterUserPassword. If the DB cluster already manages the master user password with Amazon Web Services Secrets Manager, and you specify that the master user password is not managed with Amazon Web Services Secrets Manager, then you must specify MasterUserPassword. In this case, RDS deletes the secret and uses the new password for the master user specified by MasterUserPassword. For more information, see Password management with Amazon Web Services Secrets Manager in the Amazon RDS User Guide and Password management with Amazon Web Services Secrets Manager in the Amazon Aurora User Guide.  Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    ManageMasterUserPassword?: BooleanOptional;
    /**
     * Specifies whether to rotate the secret managed by Amazon Web Services Secrets Manager for the master user password. This setting is valid only if the master user password is managed by RDS in Amazon Web Services Secrets Manager for the DB cluster. The secret value contains the updated password. For more information, see Password management with Amazon Web Services Secrets Manager in the Amazon RDS User Guide and Password management with Amazon Web Services Secrets Manager in the Amazon Aurora User Guide.  Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters Constraints:   You must apply the change immediately when rotating the master user password.  
     */
    RotateMasterUserPassword?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier to encrypt a secret that is automatically generated and managed in Amazon Web Services Secrets Manager. This setting is valid only if both of the following conditions are met:   The DB cluster doesn't manage the master user password in Amazon Web Services Secrets Manager. If the DB cluster already manages the master user password in Amazon Web Services Secrets Manager, you can't change the KMS key that is used to encrypt the secret.   You are turning on ManageMasterUserPassword to manage the master user password in Amazon Web Services Secrets Manager. If you are turning on ManageMasterUserPassword and don't specify MasterUserSecretKmsKeyId, then the aws/secretsmanager KMS key is used to encrypt the secret. If the secret is in a different Amazon Web Services account, then you can't use the aws/secretsmanager KMS key to encrypt the secret, and you must use a customer managed KMS key.   The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. To use a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN. There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region. Valid for Cluster Type: Aurora DB clusters and Multi-AZ DB clusters
     */
    MasterUserSecretKmsKeyId?: String;
    /**
     * The DB engine mode of the DB cluster, either provisioned or serverless.  The DB engine mode can be modified only from serverless to provisioned.  For more information, see  CreateDBCluster. Valid for Cluster Type: Aurora DB clusters only
     */
    EngineMode?: String;
    /**
     * Specifies whether engine mode changes from serverless to provisioned are allowed. Valid for Cluster Type: Aurora Serverless v1 DB clusters only Constraints:   You must allow engine mode changes when specifying a different value for the EngineMode parameter from the DB cluster's current engine mode.  
     */
    AllowEngineModeChange?: Boolean;
    /**
     * Specifies whether read replicas can forward write operations to the writer DB instance in the DB cluster. By default, write operations aren't allowed on reader DB instances. Valid for: Aurora DB clusters only
     */
    EnableLocalWriteForwarding?: BooleanOptional;
    /**
     * The Amazon Resource Name (ARN) of the recovery point in Amazon Web Services Backup.
     */
    AwsBackupRecoveryPointArn?: AwsBackupRecoveryPointArn;
  }
  export interface ModifyDBClusterParameterGroupMessage {
    /**
     * The name of the DB cluster parameter group to modify.
     */
    DBClusterParameterGroupName: String;
    /**
     * A list of parameters in the DB cluster parameter group to modify. Valid Values (for the application method): immediate | pending-reboot   You can use the immediate value with dynamic parameters only. You can use the pending-reboot value for both dynamic and static parameters. When the application method is immediate, changes to dynamic parameters are applied immediately to the DB clusters associated with the parameter group. When the application method is pending-reboot, changes to dynamic and static parameters are applied after a reboot without failover to the DB clusters associated with the parameter group. 
     */
    Parameters: ParametersList;
  }
  export interface ModifyDBClusterResult {
    DBCluster?: DBCluster;
  }
  export interface ModifyDBClusterSnapshotAttributeMessage {
    /**
     * The identifier for the DB cluster snapshot to modify the attributes for.
     */
    DBClusterSnapshotIdentifier: String;
    /**
     * The name of the DB cluster snapshot attribute to modify. To manage authorization for other Amazon Web Services accounts to copy or restore a manual DB cluster snapshot, set this value to restore.  To view the list of attributes available to modify, use the DescribeDBClusterSnapshotAttributes API operation. 
     */
    AttributeName: String;
    /**
     * A list of DB cluster snapshot attributes to add to the attribute specified by AttributeName. To authorize other Amazon Web Services accounts to copy or restore a manual DB cluster snapshot, set this list to include one or more Amazon Web Services account IDs, or all to make the manual DB cluster snapshot restorable by any Amazon Web Services account. Do not add the all value for any manual DB cluster snapshots that contain private information that you don't want available to all Amazon Web Services accounts.
     */
    ValuesToAdd?: AttributeValueList;
    /**
     * A list of DB cluster snapshot attributes to remove from the attribute specified by AttributeName. To remove authorization for other Amazon Web Services accounts to copy or restore a manual DB cluster snapshot, set this list to include one or more Amazon Web Services account identifiers, or all to remove authorization for any Amazon Web Services account to copy or restore the DB cluster snapshot. If you specify all, an Amazon Web Services account whose account ID is explicitly added to the restore attribute can still copy or restore a manual DB cluster snapshot.
     */
    ValuesToRemove?: AttributeValueList;
  }
  export interface ModifyDBClusterSnapshotAttributeResult {
    DBClusterSnapshotAttributesResult?: DBClusterSnapshotAttributesResult;
  }
  export interface ModifyDBInstanceMessage {
    /**
     * The identifier of DB instance to modify. This value is stored as a lowercase string. Constraints:   Must match the identifier of an existing DB instance.  
     */
    DBInstanceIdentifier: String;
    /**
     * The new amount of storage in gibibytes (GiB) to allocate for the DB instance. For RDS for MariaDB, RDS for MySQL, RDS for Oracle, and RDS for PostgreSQL, the value supplied must be at least 10% greater than the current value. Values that are not at least 10% greater than the existing value are rounded up so that they are 10% greater than the current value. For the valid values for allocated storage for each engine, see CreateDBInstance.
     */
    AllocatedStorage?: IntegerOptional;
    /**
     * The new compute and memory capacity of the DB instance, for example db.m4.large. Not all DB instance classes are available in all Amazon Web Services Regions, or for all database engines. For the full list of DB instance classes, and availability for your engine, see DB Instance Class in the Amazon RDS User Guide or Aurora DB instance classes in the Amazon Aurora User Guide. For RDS Custom, see DB instance class support for RDS Custom for Oracle and  DB instance class support for RDS Custom for SQL Server. If you modify the DB instance class, an outage occurs during the change. The change is applied during the next maintenance window, unless you specify ApplyImmediately in your request.  Default: Uses existing setting Constraints:   If you are modifying the DB instance class and upgrading the engine version at the same time, the currently running engine version must be supported on the specified DB instance class. Otherwise, the operation returns an error. In this case, first run the operation to modify the DB instance class, and then run it again to upgrade the engine version.  
     */
    DBInstanceClass?: String;
    /**
     * The new DB subnet group for the DB instance. You can use this parameter to move your DB instance to a different VPC. If your DB instance isn't in a VPC, you can also use this parameter to move your DB instance into a VPC. For more information, see Working with a DB instance in a VPC in the Amazon RDS User Guide. Changing the subnet group causes an outage during the change. The change is applied during the next maintenance window, unless you enable ApplyImmediately. This parameter doesn't apply to RDS Custom DB instances. Constraints:   If supplied, must match existing DB subnet group.   Example: mydbsubnetgroup 
     */
    DBSubnetGroupName?: String;
    /**
     * A list of DB security groups to authorize on this DB instance. Changing this setting doesn't result in an outage and the change is asynchronously applied as soon as possible. This setting doesn't apply to RDS Custom DB instances. Constraints:   If supplied, must match existing DB security groups.  
     */
    DBSecurityGroups?: DBSecurityGroupNameList;
    /**
     * A list of Amazon EC2 VPC security groups to associate with this DB instance. This change is asynchronously applied as soon as possible. This setting doesn't apply to the following DB instances:   Amazon Aurora (The associated list of EC2 VPC security groups is managed by the DB cluster. For more information, see ModifyDBCluster.)   RDS Custom   Constraints:   If supplied, must match existing VPC security group IDs.  
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * Specifies whether the modifications in this request and any pending modifications are asynchronously applied as soon as possible, regardless of the PreferredMaintenanceWindow setting for the DB instance. By default, this parameter is disabled. If this parameter is disabled, changes to the DB instance are applied during the next maintenance window. Some parameter changes can cause an outage and are applied on the next call to RebootDBInstance, or the next failure reboot. Review the table of parameters in Modifying a DB Instance in the Amazon RDS User Guide to see the impact of enabling or disabling ApplyImmediately for each modified parameter and to determine when the changes are applied.
     */
    ApplyImmediately?: Boolean;
    /**
     * The new password for the master user. Changing this parameter doesn't result in an outage and the change is asynchronously applied as soon as possible. Between the time of the request and the completion of the request, the MasterUserPassword element exists in the PendingModifiedValues element of the operation response.  Amazon RDS API operations never return the password, so this action provides a way to regain access to a primary instance user if the password is lost. This includes restoring privileges that might have been accidentally revoked.  This setting doesn't apply to the following DB instances:   Amazon Aurora (The password for the master user is managed by the DB cluster. For more information, see ModifyDBCluster.)   RDS Custom   Default: Uses existing setting Constraints:   Can't be specified if ManageMasterUserPassword is turned on.   Can include any printable ASCII character except "/", """, or "@".   Length Constraints:   RDS for MariaDB - Must contain from 8 to 41 characters.   RDS for Microsoft SQL Server - Must contain from 8 to 128 characters.   RDS for MySQL - Must contain from 8 to 41 characters.   RDS for Oracle - Must contain from 8 to 30 characters.   RDS for PostgreSQL - Must contain from 8 to 128 characters.  
     */
    MasterUserPassword?: String;
    /**
     * The name of the DB parameter group to apply to the DB instance. Changing this setting doesn't result in an outage. The parameter group name itself is changed immediately, but the actual parameter changes are not applied until you reboot the instance without failover. In this case, the DB instance isn't rebooted automatically, and the parameter changes aren't applied during the next maintenance window. However, if you modify dynamic parameters in the newly associated DB parameter group, these changes are applied immediately without a reboot. This setting doesn't apply to RDS Custom DB instances. Default: Uses existing setting Constraints:   Must be in the same DB parameter group family as the DB instance.  
     */
    DBParameterGroupName?: String;
    /**
     * The number of days to retain automated backups. Setting this parameter to a positive number enables backups. Setting this parameter to 0 disables automated backups.  Enabling and disabling backups can result in a brief I/O suspension that lasts from a few seconds to a few minutes, depending on the size and class of your DB instance.  These changes are applied during the next maintenance window unless the ApplyImmediately parameter is enabled for this request. If you change the parameter from one non-zero value to another non-zero value, the change is asynchronously applied as soon as possible. This setting doesn't apply to Amazon Aurora DB instances. The retention period for automated backups is managed by the DB cluster. For more information, see ModifyDBCluster. Default: Uses existing setting Constraints:   Must be a value from 0 to 35.   Can't be set to 0 if the DB instance is a source to read replicas.   Can't be set to 0 for an RDS Custom for Oracle DB instance.  
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * The daily time range during which automated backups are created if automated backups are enabled, as determined by the BackupRetentionPeriod parameter. Changing this parameter doesn't result in an outage and the change is asynchronously applied as soon as possible. The default is a 30-minute window selected at random from an 8-hour block of time for each Amazon Web Services Region. For more information, see Backup window in the Amazon RDS User Guide. This setting doesn't apply to Amazon Aurora DB instances. The daily time range for creating automated backups is managed by the DB cluster. For more information, see ModifyDBCluster. Constraints:   Must be in the format hh24:mi-hh24:mi.   Must be in Universal Coordinated Time (UTC).   Must not conflict with the preferred maintenance window.   Must be at least 30 minutes.  
     */
    PreferredBackupWindow?: String;
    /**
     * The weekly time range during which system maintenance can occur, which might result in an outage. Changing this parameter doesn't result in an outage, except in the following situation, and the change is asynchronously applied as soon as possible. If there are pending actions that cause a reboot, and the maintenance window is changed to include the current time, then changing this parameter causes a reboot of the DB instance. If you change this window to the current time, there must be at least 30 minutes between the current time and end of the window to ensure pending changes are applied. For more information, see Amazon RDS Maintenance Window in the Amazon RDS User Guide.  Default: Uses existing setting Constraints:   Must be in the format ddd:hh24:mi-ddd:hh24:mi.   The day values must be mon | tue | wed | thu | fri | sat | sun.    Must be in Universal Coordinated Time (UTC).   Must not conflict with the preferred backup window.   Must be at least 30 minutes.  
     */
    PreferredMaintenanceWindow?: String;
    /**
     * Specifies whether the DB instance is a Multi-AZ deployment. Changing this parameter doesn't result in an outage. The change is applied during the next maintenance window unless the ApplyImmediately parameter is enabled for this request. This setting doesn't apply to RDS Custom DB instances.
     */
    MultiAZ?: BooleanOptional;
    /**
     * The version number of the database engine to upgrade to. Changing this parameter results in an outage and the change is applied during the next maintenance window unless the ApplyImmediately parameter is enabled for this request. For major version upgrades, if a nondefault DB parameter group is currently in use, a new DB parameter group in the DB parameter group family for the new engine version must be specified. The new DB parameter group can be the default for that DB parameter group family. If you specify only a major version, Amazon RDS updates the DB instance to the default minor version if the current minor version is lower. For information about valid engine versions, see CreateDBInstance, or call DescribeDBEngineVersions. If the instance that you're modifying is acting as a read replica, the engine version that you specify must be the same or higher than the version that the source DB instance or cluster is running. In RDS Custom for Oracle, this parameter is supported for read replicas only if they are in the PATCH_DB_FAILURE lifecycle. Constraints:   If you are upgrading the engine version and modifying the DB instance class at the same time, the currently running engine version must be supported on the specified DB instance class. Otherwise, the operation returns an error. In this case, first run the operation to modify the DB instance class, and then run it again to upgrade the engine version.  
     */
    EngineVersion?: String;
    /**
     * Specifies whether major version upgrades are allowed. Changing this parameter doesn't result in an outage and the change is asynchronously applied as soon as possible. This setting doesn't apply to RDS Custom DB instances. Constraints:   Major version upgrades must be allowed when specifying a value for the EngineVersion parameter that's a different major version than the DB instance's current version.  
     */
    AllowMajorVersionUpgrade?: Boolean;
    /**
     * Specifies whether minor version upgrades are applied automatically to the DB instance during the maintenance window. An outage occurs when all the following conditions are met:   The automatic upgrade is enabled for the maintenance window.   A newer minor version is available.   RDS has enabled automatic patching for the engine version.   If any of the preceding conditions isn't met, Amazon RDS applies the change as soon as possible and doesn't cause an outage. For an RDS Custom DB instance, don't enable this setting. Otherwise, the operation returns an error.
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
    /**
     * The license model for the DB instance. This setting doesn't apply to Amazon Aurora or RDS Custom DB instances. Valid Values:   RDS for MariaDB - general-public-license    RDS for Microsoft SQL Server - license-included    RDS for MySQL - general-public-license    RDS for Oracle - bring-your-own-license | license-included    RDS for PostgreSQL - postgresql-license   
     */
    LicenseModel?: String;
    /**
     * The new Provisioned IOPS (I/O operations per second) value for the RDS instance. Changing this setting doesn't result in an outage and the change is applied during the next maintenance window unless the ApplyImmediately parameter is enabled for this request. If you are migrating from Provisioned IOPS to standard storage, set this value to 0. The DB instance will require a reboot for the change in storage type to take effect. If you choose to migrate your DB instance from using standard storage to using Provisioned IOPS, or from using Provisioned IOPS to using standard storage, the process can take time. The duration of the migration depends on several factors such as database load, storage size, storage type (standard or Provisioned IOPS), amount of IOPS provisioned (if any), and the number of prior scale storage operations. Typical migration times are under 24 hours, but the process can take up to several days in some cases. During the migration, the DB instance is available for use, but might experience performance degradation. While the migration takes place, nightly backups for the instance are suspended. No other Amazon RDS operations can take place for the instance, including modifying the instance, rebooting the instance, deleting the instance, creating a read replica for the instance, and creating a DB snapshot of the instance. Constraints:   For RDS for MariaDB, RDS for MySQL, RDS for Oracle, and RDS for PostgreSQL - The value supplied must be at least 10% greater than the current value. Values that are not at least 10% greater than the existing value are rounded up so that they are 10% greater than the current value.   Default: Uses existing setting
     */
    Iops?: IntegerOptional;
    /**
     * The option group to associate the DB instance with. Changing this parameter doesn't result in an outage, with one exception. If the parameter change results in an option group that enables OEM, it can cause a brief period, lasting less than a second, during which new connections are rejected but existing connections aren't interrupted. The change is applied during the next maintenance window unless the ApplyImmediately parameter is enabled for this request. Permanent options, such as the TDE option for Oracle Advanced Security TDE, can't be removed from an option group, and that option group can't be removed from a DB instance after it is associated with a DB instance. This setting doesn't apply to RDS Custom DB instances.
     */
    OptionGroupName?: String;
    /**
     * The new identifier for the DB instance when renaming a DB instance. When you change the DB instance identifier, an instance reboot occurs immediately if you enable ApplyImmediately, or will occur during the next maintenance window if you disable ApplyImmediately. This value is stored as a lowercase string. This setting doesn't apply to RDS Custom DB instances. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   The first character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.   Example: mydbinstance 
     */
    NewDBInstanceIdentifier?: String;
    /**
     * The storage type to associate with the DB instance. If you specify Provisioned IOPS (io1), you must also include a value for the Iops parameter. If you choose to migrate your DB instance from using standard storage to using Provisioned IOPS, or from using Provisioned IOPS to using standard storage, the process can take time. The duration of the migration depends on several factors such as database load, storage size, storage type (standard or Provisioned IOPS), amount of IOPS provisioned (if any), and the number of prior scale storage operations. Typical migration times are under 24 hours, but the process can take up to several days in some cases. During the migration, the DB instance is available for use, but might experience performance degradation. While the migration takes place, nightly backups for the instance are suspended. No other Amazon RDS operations can take place for the instance, including modifying the instance, rebooting the instance, deleting the instance, creating a read replica for the instance, and creating a DB snapshot of the instance. Valid Values: gp2 | gp3 | io1 | standard  Default: io1, if the Iops parameter is specified. Otherwise, gp2.
     */
    StorageType?: String;
    /**
     * The ARN from the key store with which to associate the instance for TDE encryption. This setting doesn't apply to RDS Custom DB instances.
     */
    TdeCredentialArn?: String;
    /**
     * The password for the given ARN from the key store in order to access the device. This setting doesn't apply to RDS Custom DB instances.
     */
    TdeCredentialPassword?: String;
    /**
     * The CA certificate identifier to use for the DB instance's server certificate. This setting doesn't apply to RDS Custom DB instances. For more information, see Using SSL/TLS to encrypt a connection to a DB instance in the Amazon RDS User Guide and  Using SSL/TLS to encrypt a connection to a DB cluster in the Amazon Aurora User Guide.
     */
    CACertificateIdentifier?: String;
    /**
     * The Active Directory directory ID to move the DB instance to. Specify none to remove the instance from its current domain. You must create the domain before this operation. Currently, you can create only MySQL, Microsoft SQL Server, Oracle, and PostgreSQL DB instances in an Active Directory Domain. For more information, see  Kerberos Authentication in the Amazon RDS User Guide. This setting doesn't apply to RDS Custom DB instances.
     */
    Domain?: String;
    /**
     * The fully qualified domain name (FQDN) of an Active Directory domain. Constraints:   Can't be longer than 64 characters.   Example: mymanagedADtest.mymanagedAD.mydomain 
     */
    DomainFqdn?: String;
    /**
     * The Active Directory organizational unit for your DB instance to join. Constraints:   Must be in the distinguished name format.   Can't be longer than 64 characters.   Example: OU=mymanagedADtestOU,DC=mymanagedADtest,DC=mymanagedAD,DC=mydomain 
     */
    DomainOu?: String;
    /**
     * The ARN for the Secrets Manager secret with the credentials for the user joining the domain. Example: arn:aws:secretsmanager:region:account-number:secret:myselfmanagedADtestsecret-123456 
     */
    DomainAuthSecretArn?: String;
    /**
     * The IPv4 DNS IP addresses of your primary and secondary Active Directory domain controllers. Constraints:   Two IP addresses must be provided. If there isn't a secondary domain controller, use the IP address of the primary domain controller for both entries in the list.   Example: 123.124.125.126,234.235.236.237 
     */
    DomainDnsIps?: StringList;
    /**
     * Specifies whether to copy all tags from the DB instance to snapshots of the DB instance. By default, tags aren't copied. This setting doesn't apply to Amazon Aurora DB instances. Copying tags to snapshots is managed by the DB cluster. Setting this value for an Aurora DB instance has no effect on the DB cluster setting. For more information, see ModifyDBCluster.
     */
    CopyTagsToSnapshot?: BooleanOptional;
    /**
     * The interval, in seconds, between points when Enhanced Monitoring metrics are collected for the DB instance. To disable collection of Enhanced Monitoring metrics, specify 0. If MonitoringRoleArn is specified, set MonitoringInterval to a value other than 0. This setting doesn't apply to RDS Custom DB instances. Valid Values: 0 | 1 | 5 | 10 | 15 | 30 | 60  Default: 0 
     */
    MonitoringInterval?: IntegerOptional;
    /**
     * The port number on which the database accepts connections. The value of the DBPortNumber parameter must not match any of the port values specified for options in the option group for the DB instance. If you change the DBPortNumber value, your database restarts regardless of the value of the ApplyImmediately parameter. This setting doesn't apply to RDS Custom DB instances. Valid Values: 1150-65535  Default:   Amazon Aurora - 3306    RDS for MariaDB - 3306    RDS for Microsoft SQL Server - 1433    RDS for MySQL - 3306    RDS for Oracle - 1521    RDS for PostgreSQL - 5432    Constraints:   For RDS for Microsoft SQL Server, the value can't be 1234, 1434, 3260, 3343, 3389, 47001, or 49152-49156.  
     */
    DBPortNumber?: IntegerOptional;
    /**
     * Specifies whether the DB instance is publicly accessible. When the DB cluster is publicly accessible, its Domain Name System (DNS) endpoint resolves to the private IP address from within the DB cluster's virtual private cloud (VPC). It resolves to the public IP address from outside of the DB cluster's VPC. Access to the DB cluster is ultimately controlled by the security group it uses. That public access isn't permitted if the security group assigned to the DB cluster doesn't permit it. When the DB instance isn't publicly accessible, it is an internal DB instance with a DNS name that resolves to a private IP address.  PubliclyAccessible only applies to DB instances in a VPC. The DB instance must be part of a public subnet and PubliclyAccessible must be enabled for it to be publicly accessible. Changes to the PubliclyAccessible parameter are applied immediately regardless of the value of the ApplyImmediately parameter.
     */
    PubliclyAccessible?: BooleanOptional;
    /**
     * The ARN for the IAM role that permits RDS to send enhanced monitoring metrics to Amazon CloudWatch Logs. For example, arn:aws:iam:123456789012:role/emaccess. For information on creating a monitoring role, see To create an IAM role for Amazon RDS Enhanced Monitoring in the Amazon RDS User Guide.  If MonitoringInterval is set to a value other than 0, supply a MonitoringRoleArn value. This setting doesn't apply to RDS Custom DB instances.
     */
    MonitoringRoleArn?: String;
    /**
     * The name of the IAM role to use when making API calls to the Directory Service. This setting doesn't apply to RDS Custom DB instances.
     */
    DomainIAMRoleName?: String;
    /**
     * Specifies whether to remove the DB instance from the Active Directory domain.
     */
    DisableDomain?: BooleanOptional;
    /**
     * The order of priority in which an Aurora Replica is promoted to the primary instance after a failure of the existing primary instance. For more information, see  Fault Tolerance for an Aurora DB Cluster in the Amazon Aurora User Guide. This setting doesn't apply to RDS Custom DB instances. Default: 1  Valid Values: 0 - 15 
     */
    PromotionTier?: IntegerOptional;
    /**
     * Specifies whether to enable mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts. By default, mapping isn't enabled. This setting doesn't apply to Amazon Aurora. Mapping Amazon Web Services IAM accounts to database accounts is managed by the DB cluster. For more information about IAM database authentication, see  IAM Database Authentication for MySQL and PostgreSQL in the Amazon RDS User Guide.  This setting doesn't apply to RDS Custom DB instances.
     */
    EnableIAMDatabaseAuthentication?: BooleanOptional;
    /**
     * Specifies whether to enable Performance Insights for the DB instance. For more information, see Using Amazon Performance Insights in the Amazon RDS User Guide. This setting doesn't apply to RDS Custom DB instances.
     */
    EnablePerformanceInsights?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier for encryption of Performance Insights data. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. If you don't specify a value for PerformanceInsightsKMSKeyId, then Amazon RDS uses your default KMS key. There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region. This setting doesn't apply to RDS Custom DB instances.
     */
    PerformanceInsightsKMSKeyId?: String;
    /**
     * The number of days to retain Performance Insights data. This setting doesn't apply to RDS Custom DB instances. Valid Values:    7     month * 31, where month is a number of months from 1-23. Examples: 93 (3 months * 31), 341 (11 months * 31), 589 (19 months * 31)    731    Default: 7 days If you specify a retention period that isn't valid, such as 94, Amazon RDS returns an error.
     */
    PerformanceInsightsRetentionPeriod?: IntegerOptional;
    /**
     * The log types to be enabled for export to CloudWatch Logs for a specific DB instance. A change to the CloudwatchLogsExportConfiguration parameter is always applied to the DB instance immediately. Therefore, the ApplyImmediately parameter has no effect. This setting doesn't apply to RDS Custom DB instances.
     */
    CloudwatchLogsExportConfiguration?: CloudwatchLogsExportConfiguration;
    /**
     * The number of CPU cores and the number of threads per core for the DB instance class of the DB instance. This setting doesn't apply to RDS Custom DB instances.
     */
    ProcessorFeatures?: ProcessorFeatureList;
    /**
     * Specifies whether the DB instance class of the DB instance uses its default processor features. This setting doesn't apply to RDS Custom DB instances.
     */
    UseDefaultProcessorFeatures?: BooleanOptional;
    /**
     * Specifies whether the DB instance has deletion protection enabled. The database can't be deleted when deletion protection is enabled. By default, deletion protection isn't enabled. For more information, see  Deleting a DB Instance.
     */
    DeletionProtection?: BooleanOptional;
    /**
     * The upper limit in gibibytes (GiB) to which Amazon RDS can automatically scale the storage of the DB instance. For more information about this setting, including limitations that apply to it, see  Managing capacity automatically with Amazon RDS storage autoscaling in the Amazon RDS User Guide. This setting doesn't apply to RDS Custom DB instances.
     */
    MaxAllocatedStorage?: IntegerOptional;
    /**
     * Specifies whether the DB instance is restarted when you rotate your SSL/TLS certificate. By default, the DB instance is restarted when you rotate your SSL/TLS certificate. The certificate is not updated until the DB instance is restarted.  Set this parameter only if you are not using SSL/TLS to connect to the DB instance.  If you are using SSL/TLS to connect to the DB instance, follow the appropriate instructions for your DB engine to rotate your SSL/TLS certificate:   For more information about rotating your SSL/TLS certificate for RDS DB engines, see  Rotating Your SSL/TLS Certificate. in the Amazon RDS User Guide.    For more information about rotating your SSL/TLS certificate for Aurora DB engines, see  Rotating Your SSL/TLS Certificate in the Amazon Aurora User Guide.   This setting doesn't apply to RDS Custom DB instances.
     */
    CertificateRotationRestart?: BooleanOptional;
    /**
     * A value that sets the open mode of a replica database to either mounted or read-only.  Currently, this parameter is only supported for Oracle DB instances.  Mounted DB replicas are included in Oracle Enterprise Edition. The main use case for mounted replicas is cross-Region disaster recovery. The primary database doesn't use Active Data Guard to transmit information to the mounted replica. Because it doesn't accept user connections, a mounted replica can't serve a read-only workload. For more information, see Working with Oracle Read Replicas for Amazon RDS in the Amazon RDS User Guide. This setting doesn't apply to RDS Custom DB instances.
     */
    ReplicaMode?: ReplicaMode;
    /**
     * Specifies whether to enable a customer-owned IP address (CoIP) for an RDS on Outposts DB instance. A CoIP provides local or external connectivity to resources in your Outpost subnets through your on-premises network. For some use cases, a CoIP can provide lower latency for connections to the DB instance from outside of its virtual private cloud (VPC) on your local network. For more information about RDS on Outposts, see Working with Amazon RDS on Amazon Web Services Outposts in the Amazon RDS User Guide. For more information about CoIPs, see Customer-owned IP addresses in the Amazon Web Services Outposts User Guide.
     */
    EnableCustomerOwnedIp?: BooleanOptional;
    /**
     * The Amazon Resource Name (ARN) of the recovery point in Amazon Web Services Backup. This setting doesn't apply to RDS Custom DB instances.
     */
    AwsBackupRecoveryPointArn?: AwsBackupRecoveryPointArn;
    /**
     * The automation mode of the RDS Custom DB instance. If full, the DB instance automates monitoring and instance recovery. If all paused, the instance pauses automation for the duration set by ResumeFullAutomationModeMinutes.
     */
    AutomationMode?: AutomationMode;
    /**
     * The number of minutes to pause the automation. When the time period ends, RDS Custom resumes full automation. Default: 60  Constraints:   Must be at least 60.   Must be no more than 1,440.  
     */
    ResumeFullAutomationModeMinutes?: IntegerOptional;
    /**
     * The network type of the DB instance. The network type is determined by the DBSubnetGroup specified for the DB instance. A DBSubnetGroup can support only the IPv4 protocol or the IPv4 and the IPv6 protocols (DUAL). For more information, see  Working with a DB instance in a VPC in the Amazon RDS User Guide.  Valid Values: IPV4 | DUAL 
     */
    NetworkType?: String;
    /**
     * The storage throughput value for the DB instance. This setting applies only to the gp3 storage type. This setting doesn't apply to Amazon Aurora or RDS Custom DB instances.
     */
    StorageThroughput?: IntegerOptional;
    /**
     * Specifies whether to manage the master user password with Amazon Web Services Secrets Manager. If the DB instance doesn't manage the master user password with Amazon Web Services Secrets Manager, you can turn on this management. In this case, you can't specify MasterUserPassword. If the DB instance already manages the master user password with Amazon Web Services Secrets Manager, and you specify that the master user password is not managed with Amazon Web Services Secrets Manager, then you must specify MasterUserPassword. In this case, Amazon RDS deletes the secret and uses the new password for the master user specified by MasterUserPassword. For more information, see Password management with Amazon Web Services Secrets Manager in the Amazon RDS User Guide.  Constraints:   Can't manage the master user password with Amazon Web Services Secrets Manager if MasterUserPassword is specified.  
     */
    ManageMasterUserPassword?: BooleanOptional;
    /**
     * Specifies whether to rotate the secret managed by Amazon Web Services Secrets Manager for the master user password. This setting is valid only if the master user password is managed by RDS in Amazon Web Services Secrets Manager for the DB cluster. The secret value contains the updated password. For more information, see Password management with Amazon Web Services Secrets Manager in the Amazon RDS User Guide.  Constraints:   You must apply the change immediately when rotating the master user password.  
     */
    RotateMasterUserPassword?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier to encrypt a secret that is automatically generated and managed in Amazon Web Services Secrets Manager. This setting is valid only if both of the following conditions are met:   The DB instance doesn't manage the master user password in Amazon Web Services Secrets Manager. If the DB instance already manages the master user password in Amazon Web Services Secrets Manager, you can't change the KMS key used to encrypt the secret.   You are turning on ManageMasterUserPassword to manage the master user password in Amazon Web Services Secrets Manager. If you are turning on ManageMasterUserPassword and don't specify MasterUserSecretKmsKeyId, then the aws/secretsmanager KMS key is used to encrypt the secret. If the secret is in a different Amazon Web Services account, then you can't use the aws/secretsmanager KMS key to encrypt the secret, and you must use a customer managed KMS key.   The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. To use a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN. There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region.
     */
    MasterUserSecretKmsKeyId?: String;
    /**
     * The target Oracle DB engine when you convert a non-CDB to a CDB. This intermediate step is necessary to upgrade an Oracle Database 19c non-CDB to an Oracle Database 21c CDB. Note the following requirements:   Make sure that you specify oracle-ee-cdb or oracle-se2-cdb.   Make sure that your DB engine runs Oracle Database 19c with an April 2021 or later RU.   Note the following limitations:   You can't convert a CDB to a non-CDB.   You can't convert a replica database.   You can't convert a non-CDB to a CDB and upgrade the engine version in the same command.   You can't convert the existing custom parameter or option group when it has options or parameters that are permanent or persistent. In this situation, the DB instance reverts to the default option and parameter group. To avoid reverting to the default, specify a new parameter group with --db-parameter-group-name and a new option group with --option-group-name.  
     */
    Engine?: String;
    /**
     * Indicates whether the DB instance has a dedicated log volume (DLV) enabled.
     */
    DedicatedLogVolume?: BooleanOptional;
  }
  export interface ModifyDBInstanceResult {
    DBInstance?: DBInstance;
  }
  export interface ModifyDBParameterGroupMessage {
    /**
     * The name of the DB parameter group. Constraints:   If supplied, must match the name of an existing DBParameterGroup.  
     */
    DBParameterGroupName: String;
    /**
     * An array of parameter names, values, and the application methods for the parameter update. At least one parameter name, value, and application method must be supplied; later arguments are optional. A maximum of 20 parameters can be modified in a single request. Valid Values (for the application method): immediate | pending-reboot  You can use the immediate value with dynamic parameters only. You can use the pending-reboot value for both dynamic and static parameters. When the application method is immediate, changes to dynamic parameters are applied immediately to the DB instances associated with the parameter group. When the application method is pending-reboot, changes to dynamic and static parameters are applied after a reboot without failover to the DB instances associated with the parameter group.  You can't use pending-reboot with dynamic parameters on RDS for SQL Server DB instances. Use immediate.  For more information on modifying DB parameters, see Working with DB parameter groups in the Amazon RDS User Guide.
     */
    Parameters: ParametersList;
  }
  export interface ModifyDBProxyEndpointRequest {
    /**
     * The name of the DB proxy sociated with the DB proxy endpoint that you want to modify.
     */
    DBProxyEndpointName: DBProxyEndpointName;
    /**
     * The new identifier for the DBProxyEndpoint. An identifier must begin with a letter and must contain only ASCII letters, digits, and hyphens; it can't end with a hyphen or contain two consecutive hyphens.
     */
    NewDBProxyEndpointName?: DBProxyEndpointName;
    /**
     * The VPC security group IDs for the DB proxy endpoint. When the DB proxy endpoint uses a different VPC than the original proxy, you also specify a different set of security group IDs than for the original proxy.
     */
    VpcSecurityGroupIds?: StringList;
  }
  export interface ModifyDBProxyEndpointResponse {
    /**
     * The DBProxyEndpoint object representing the new settings for the DB proxy endpoint.
     */
    DBProxyEndpoint?: DBProxyEndpoint;
  }
  export interface ModifyDBProxyRequest {
    /**
     * The identifier for the DBProxy to modify.
     */
    DBProxyName: String;
    /**
     * The new identifier for the DBProxy. An identifier must begin with a letter and must contain only ASCII letters, digits, and hyphens; it can't end with a hyphen or contain two consecutive hyphens.
     */
    NewDBProxyName?: String;
    /**
     * The new authentication settings for the DBProxy.
     */
    Auth?: UserAuthConfigList;
    /**
     * Whether Transport Layer Security (TLS) encryption is required for connections to the proxy. By enabling this setting, you can enforce encrypted TLS connections to the proxy, even if the associated database doesn't use TLS.
     */
    RequireTLS?: BooleanOptional;
    /**
     * The number of seconds that a connection to the proxy can be inactive before the proxy disconnects it. You can set this value higher or lower than the connection timeout limit for the associated database.
     */
    IdleClientTimeout?: IntegerOptional;
    /**
     * Whether the proxy includes detailed information about SQL statements in its logs. This information helps you to debug issues involving SQL behavior or the performance and scalability of the proxy connections. The debug information includes the text of SQL statements that you submit through the proxy. Thus, only enable this setting when needed for debugging, and only when you have security measures in place to safeguard any sensitive information that appears in the logs.
     */
    DebugLogging?: BooleanOptional;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that the proxy uses to access secrets in Amazon Web Services Secrets Manager.
     */
    RoleArn?: String;
    /**
     * The new list of security groups for the DBProxy.
     */
    SecurityGroups?: StringList;
  }
  export interface ModifyDBProxyResponse {
    /**
     * The DBProxy object representing the new settings for the proxy.
     */
    DBProxy?: DBProxy;
  }
  export interface ModifyDBProxyTargetGroupRequest {
    /**
     * The name of the target group to modify.
     */
    TargetGroupName: String;
    /**
     * The name of the proxy.
     */
    DBProxyName: String;
    /**
     * The settings that determine the size and behavior of the connection pool for the target group.
     */
    ConnectionPoolConfig?: ConnectionPoolConfiguration;
    /**
     * The new name for the modified DBProxyTarget. An identifier must begin with a letter and must contain only ASCII letters, digits, and hyphens; it can't end with a hyphen or contain two consecutive hyphens.
     */
    NewName?: String;
  }
  export interface ModifyDBProxyTargetGroupResponse {
    /**
     * The settings of the modified DBProxyTarget.
     */
    DBProxyTargetGroup?: DBProxyTargetGroup;
  }
  export interface ModifyDBSnapshotAttributeMessage {
    /**
     * The identifier for the DB snapshot to modify the attributes for.
     */
    DBSnapshotIdentifier: String;
    /**
     * The name of the DB snapshot attribute to modify. To manage authorization for other Amazon Web Services accounts to copy or restore a manual DB snapshot, set this value to restore.  To view the list of attributes available to modify, use the DescribeDBSnapshotAttributes API operation. 
     */
    AttributeName: String;
    /**
     * A list of DB snapshot attributes to add to the attribute specified by AttributeName. To authorize other Amazon Web Services accounts to copy or restore a manual snapshot, set this list to include one or more Amazon Web Services account IDs, or all to make the manual DB snapshot restorable by any Amazon Web Services account. Do not add the all value for any manual DB snapshots that contain private information that you don't want available to all Amazon Web Services accounts.
     */
    ValuesToAdd?: AttributeValueList;
    /**
     * A list of DB snapshot attributes to remove from the attribute specified by AttributeName. To remove authorization for other Amazon Web Services accounts to copy or restore a manual snapshot, set this list to include one or more Amazon Web Services account identifiers, or all to remove authorization for any Amazon Web Services account to copy or restore the DB snapshot. If you specify all, an Amazon Web Services account whose account ID is explicitly added to the restore attribute can still copy or restore the manual DB snapshot.
     */
    ValuesToRemove?: AttributeValueList;
  }
  export interface ModifyDBSnapshotAttributeResult {
    DBSnapshotAttributesResult?: DBSnapshotAttributesResult;
  }
  export interface ModifyDBSnapshotMessage {
    /**
     * The identifier of the DB snapshot to modify.
     */
    DBSnapshotIdentifier: String;
    /**
     * The engine version to upgrade the DB snapshot to. The following are the database engines and engine versions that are available when you upgrade a DB snapshot.  MySQL     5.5.46 (supported for 5.1 DB snapshots)    Oracle     19.0.0.0.ru-2022-01.rur-2022-01.r1 (supported for 12.2.0.1 DB snapshots)    19.0.0.0.ru-2022-07.rur-2022-07.r1 (supported for 12.1.0.2 DB snapshots)    12.1.0.2.v8 (supported for 12.1.0.1 DB snapshots)    11.2.0.4.v12 (supported for 11.2.0.2 DB snapshots)    11.2.0.4.v11 (supported for 11.2.0.3 DB snapshots)    PostgreSQL  For the list of engine versions that are available for upgrading a DB snapshot, see  Upgrading the PostgreSQL DB Engine for Amazon RDS.
     */
    EngineVersion?: String;
    /**
     * The option group to identify with the upgraded DB snapshot. You can specify this parameter when you upgrade an Oracle DB snapshot. The same option group considerations apply when upgrading a DB snapshot as when upgrading a DB instance. For more information, see Option group considerations in the Amazon RDS User Guide. 
     */
    OptionGroupName?: String;
  }
  export interface ModifyDBSnapshotResult {
    DBSnapshot?: DBSnapshot;
  }
  export interface ModifyDBSubnetGroupMessage {
    /**
     * The name for the DB subnet group. This value is stored as a lowercase string. You can't modify the default subnet group. Constraints: Must match the name of an existing DBSubnetGroup. Must not be default. Example: mydbsubnetgroup 
     */
    DBSubnetGroupName: String;
    /**
     * The description for the DB subnet group.
     */
    DBSubnetGroupDescription?: String;
    /**
     * The EC2 subnet IDs for the DB subnet group.
     */
    SubnetIds: SubnetIdentifierList;
  }
  export interface ModifyDBSubnetGroupResult {
    DBSubnetGroup?: DBSubnetGroup;
  }
  export interface ModifyEventSubscriptionMessage {
    /**
     * The name of the RDS event notification subscription.
     */
    SubscriptionName: String;
    /**
     * The Amazon Resource Name (ARN) of the SNS topic created for event notification. The ARN is created by Amazon SNS when you create a topic and subscribe to it.
     */
    SnsTopicArn?: String;
    /**
     * The type of source that is generating the events. For example, if you want to be notified of events generated by a DB instance, you would set this parameter to db-instance. For RDS Proxy events, specify db-proxy. If this value isn't specified, all events are returned. Valid Values: db-instance | db-cluster | db-parameter-group | db-security-group | db-snapshot | db-cluster-snapshot | db-proxy 
     */
    SourceType?: String;
    /**
     * A list of event categories for a source type (SourceType) that you want to subscribe to. You can see a list of the categories for a given source type in Events in the Amazon RDS User Guide or by using the DescribeEventCategories operation.
     */
    EventCategories?: EventCategoriesList;
    /**
     * Specifies whether to activate the subscription.
     */
    Enabled?: BooleanOptional;
  }
  export interface ModifyEventSubscriptionResult {
    EventSubscription?: EventSubscription;
  }
  export interface ModifyGlobalClusterMessage {
    /**
     * The cluster identifier for the global cluster to modify. This parameter isn't case-sensitive. Constraints:   Must match the identifier of an existing global database cluster.  
     */
    GlobalClusterIdentifier?: String;
    /**
     * The new cluster identifier for the global database cluster. This value is stored as a lowercase string. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   The first character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.   Example: my-cluster2 
     */
    NewGlobalClusterIdentifier?: String;
    /**
     * Specifies whether to enable deletion protection for the global database cluster. The global database cluster can't be deleted when deletion protection is enabled.
     */
    DeletionProtection?: BooleanOptional;
    /**
     * The version number of the database engine to which you want to upgrade.  To list all of the available engine versions for aurora-mysql (for MySQL-based Aurora global databases), use the following command:  aws rds describe-db-engine-versions --engine aurora-mysql --query '*[]|[?SupportsGlobalDatabases == `true`].[EngineVersion]'  To list all of the available engine versions for aurora-postgresql (for PostgreSQL-based Aurora global databases), use the following command:  aws rds describe-db-engine-versions --engine aurora-postgresql --query '*[]|[?SupportsGlobalDatabases == `true`].[EngineVersion]' 
     */
    EngineVersion?: String;
    /**
     * Specifies whether to allow major version upgrades. Constraints: Must be enabled if you specify a value for the EngineVersion parameter that's a different major version than the global cluster's current version. If you upgrade the major version of a global database, the cluster and DB instance parameter groups are set to the default parameter groups for the new version. Apply any custom parameter groups after completing the upgrade.
     */
    AllowMajorVersionUpgrade?: BooleanOptional;
  }
  export interface ModifyGlobalClusterResult {
    GlobalCluster?: GlobalCluster;
  }
  export interface ModifyOptionGroupMessage {
    /**
     * The name of the option group to be modified. Permanent options, such as the TDE option for Oracle Advanced Security TDE, can't be removed from an option group, and that option group can't be removed from a DB instance once it is associated with a DB instance
     */
    OptionGroupName: String;
    /**
     * Options in this list are added to the option group or, if already present, the specified configuration is used to update the existing configuration.
     */
    OptionsToInclude?: OptionConfigurationList;
    /**
     * Options in this list are removed from the option group.
     */
    OptionsToRemove?: OptionNamesList;
    /**
     * Specifies whether to apply the change immediately or during the next maintenance window for each instance associated with the option group.
     */
    ApplyImmediately?: Boolean;
  }
  export interface ModifyOptionGroupResult {
    OptionGroup?: OptionGroup;
  }
  export interface Option {
    /**
     * The name of the option.
     */
    OptionName?: String;
    /**
     * The description of the option.
     */
    OptionDescription?: String;
    /**
     * Indicates whether this option is persistent.
     */
    Persistent?: Boolean;
    /**
     * Indicates whether this option is permanent.
     */
    Permanent?: Boolean;
    /**
     * If required, the port configured for this option to use.
     */
    Port?: IntegerOptional;
    /**
     * The version of the option.
     */
    OptionVersion?: String;
    /**
     * The option settings for this option.
     */
    OptionSettings?: OptionSettingConfigurationList;
    /**
     * If the option requires access to a port, then this DB security group allows access to the port.
     */
    DBSecurityGroupMemberships?: DBSecurityGroupMembershipList;
    /**
     * If the option requires access to a port, then this VPC security group allows access to the port.
     */
    VpcSecurityGroupMemberships?: VpcSecurityGroupMembershipList;
  }
  export interface OptionConfiguration {
    /**
     * The configuration of options to include in a group.
     */
    OptionName: String;
    /**
     * The optional port for the option.
     */
    Port?: IntegerOptional;
    /**
     * The version for the option.
     */
    OptionVersion?: String;
    /**
     * A list of DBSecurityGroupMembership name strings used for this option.
     */
    DBSecurityGroupMemberships?: DBSecurityGroupNameList;
    /**
     * A list of VpcSecurityGroupMembership name strings used for this option.
     */
    VpcSecurityGroupMemberships?: VpcSecurityGroupIdList;
    /**
     * The option settings to include in an option group.
     */
    OptionSettings?: OptionSettingsList;
  }
  export type OptionConfigurationList = OptionConfiguration[];
  export interface OptionGroup {
    /**
     * Specifies the name of the option group.
     */
    OptionGroupName?: String;
    /**
     * Provides a description of the option group.
     */
    OptionGroupDescription?: String;
    /**
     * Indicates the name of the engine that this option group can be applied to.
     */
    EngineName?: String;
    /**
     * Indicates the major engine version associated with this option group.
     */
    MajorEngineVersion?: String;
    /**
     * Indicates what options are available in the option group.
     */
    Options?: OptionsList;
    /**
     * Indicates whether this option group can be applied to both VPC and non-VPC instances. The value true indicates the option group can be applied to both VPC and non-VPC instances.
     */
    AllowsVpcAndNonVpcInstanceMemberships?: Boolean;
    /**
     * If AllowsVpcAndNonVpcInstanceMemberships is false, this field is blank. If AllowsVpcAndNonVpcInstanceMemberships is true and this field is blank, then this option group can be applied to both VPC and non-VPC instances. If this field contains a value, then this option group can only be applied to instances that are in the VPC indicated by this field.
     */
    VpcId?: String;
    /**
     * Specifies the Amazon Resource Name (ARN) for the option group.
     */
    OptionGroupArn?: String;
    /**
     * Specifies the name of the option group from which this option group is copied.
     */
    SourceOptionGroup?: String;
    /**
     * Specifies the Amazon Web Services account ID for the option group from which this option group is copied.
     */
    SourceAccountId?: String;
    /**
     * Indicates when the option group was copied.
     */
    CopyTimestamp?: TStamp;
  }
  export interface OptionGroupMembership {
    /**
     * The name of the option group that the instance belongs to.
     */
    OptionGroupName?: String;
    /**
     * The status of the DB instance's option group membership. Valid values are: in-sync, pending-apply, pending-removal, pending-maintenance-apply, pending-maintenance-removal, applying, removing, and failed.
     */
    Status?: String;
  }
  export type OptionGroupMembershipList = OptionGroupMembership[];
  export interface OptionGroupOption {
    /**
     * The name of the option.
     */
    Name?: String;
    /**
     * The description of the option.
     */
    Description?: String;
    /**
     * The name of the engine that this option can be applied to.
     */
    EngineName?: String;
    /**
     * Indicates the major engine version that the option is available for.
     */
    MajorEngineVersion?: String;
    /**
     * The minimum required engine version for the option to be applied.
     */
    MinimumRequiredMinorEngineVersion?: String;
    /**
     * Indicates whether the option requires a port.
     */
    PortRequired?: Boolean;
    /**
     * If the option requires a port, specifies the default port for the option.
     */
    DefaultPort?: IntegerOptional;
    /**
     * The options that are prerequisites for this option.
     */
    OptionsDependedOn?: OptionsDependedOn;
    /**
     * The options that conflict with this option.
     */
    OptionsConflictsWith?: OptionsConflictsWith;
    /**
     * Persistent options can't be removed from an option group while DB instances are associated with the option group. If you disassociate all DB instances from the option group, your can remove the persistent option from the option group.
     */
    Persistent?: Boolean;
    /**
     * Permanent options can never be removed from an option group. An option group containing a permanent option can't be removed from a DB instance.
     */
    Permanent?: Boolean;
    /**
     * If true, you must enable the Auto Minor Version Upgrade setting for your DB instance before you can use this option. You can enable Auto Minor Version Upgrade when you first create your DB instance, or by modifying your DB instance later.
     */
    RequiresAutoMinorEngineVersionUpgrade?: Boolean;
    /**
     * If true, you can only use this option with a DB instance that is in a VPC.
     */
    VpcOnly?: Boolean;
    /**
     * If true, you can change the option to an earlier version of the option. This only applies to options that have different versions available.
     */
    SupportsOptionVersionDowngrade?: BooleanOptional;
    /**
     * The option settings that are available (and the default value) for each option in an option group.
     */
    OptionGroupOptionSettings?: OptionGroupOptionSettingsList;
    /**
     * The versions that are available for the option.
     */
    OptionGroupOptionVersions?: OptionGroupOptionVersionsList;
    /**
     * Indicates whether the option can be copied across Amazon Web Services accounts.
     */
    CopyableCrossAccount?: BooleanOptional;
  }
  export interface OptionGroupOptionSetting {
    /**
     * The name of the option group option.
     */
    SettingName?: String;
    /**
     * The description of the option group option.
     */
    SettingDescription?: String;
    /**
     * The default value for the option group option.
     */
    DefaultValue?: String;
    /**
     * The DB engine specific parameter type for the option group option.
     */
    ApplyType?: String;
    /**
     * Indicates the acceptable values for the option group option.
     */
    AllowedValues?: String;
    /**
     * Indicates whether this option group option can be changed from the default value.
     */
    IsModifiable?: Boolean;
    /**
     * Indicates whether a value must be specified for this option setting of the option group option.
     */
    IsRequired?: Boolean;
    /**
     * The minimum DB engine version required for the corresponding allowed value for this option setting.
     */
    MinimumEngineVersionPerAllowedValue?: MinimumEngineVersionPerAllowedValueList;
  }
  export type OptionGroupOptionSettingsList = OptionGroupOptionSetting[];
  export type OptionGroupOptionVersionsList = OptionVersion[];
  export type OptionGroupOptionsList = OptionGroupOption[];
  export interface OptionGroupOptionsMessage {
    OptionGroupOptions?: OptionGroupOptionsList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface OptionGroups {
    /**
     * List of option groups.
     */
    OptionGroupsList?: OptionGroupsList;
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export type OptionGroupsList = OptionGroup[];
  export type OptionNamesList = String[];
  export interface OptionSetting {
    /**
     * The name of the option that has settings that you can set.
     */
    Name?: String;
    /**
     * The current value of the option setting.
     */
    Value?: String;
    /**
     * The default value of the option setting.
     */
    DefaultValue?: String;
    /**
     * The description of the option setting.
     */
    Description?: String;
    /**
     * The DB engine specific parameter type.
     */
    ApplyType?: String;
    /**
     * The data type of the option setting.
     */
    DataType?: String;
    /**
     * The allowed values of the option setting.
     */
    AllowedValues?: String;
    /**
     * Indicates whether the option setting can be modified from the default.
     */
    IsModifiable?: Boolean;
    /**
     * Indicates whether the option setting is part of a collection.
     */
    IsCollection?: Boolean;
  }
  export type OptionSettingConfigurationList = OptionSetting[];
  export type OptionSettingsList = OptionSetting[];
  export interface OptionVersion {
    /**
     * The version of the option.
     */
    Version?: String;
    /**
     * Indicates whether the version is the default version of the option.
     */
    IsDefault?: Boolean;
  }
  export type OptionsConflictsWith = String[];
  export type OptionsDependedOn = String[];
  export type OptionsList = Option[];
  export interface OrderableDBInstanceOption {
    /**
     * The engine type of a DB instance.
     */
    Engine?: String;
    /**
     * The engine version of a DB instance.
     */
    EngineVersion?: String;
    /**
     * The DB instance class for a DB instance.
     */
    DBInstanceClass?: String;
    /**
     * The license model for a DB instance.
     */
    LicenseModel?: String;
    /**
     * The Availability Zone group for a DB instance.
     */
    AvailabilityZoneGroup?: String;
    /**
     * A list of Availability Zones for a DB instance.
     */
    AvailabilityZones?: AvailabilityZoneList;
    /**
     * Indicates whether a DB instance is Multi-AZ capable.
     */
    MultiAZCapable?: Boolean;
    /**
     * Indicates whether a DB instance can have a read replica.
     */
    ReadReplicaCapable?: Boolean;
    /**
     * Indicates whether a DB instance is in a VPC.
     */
    Vpc?: Boolean;
    /**
     * Indicates whether a DB instance supports encrypted storage.
     */
    SupportsStorageEncryption?: Boolean;
    /**
     * The storage type for a DB instance.
     */
    StorageType?: String;
    /**
     * Indicates whether a DB instance supports provisioned IOPS.
     */
    SupportsIops?: Boolean;
    /**
     * Indicates whether a DB instance supports Enhanced Monitoring at intervals from 1 to 60 seconds.
     */
    SupportsEnhancedMonitoring?: Boolean;
    /**
     * Indicates whether a DB instance supports IAM database authentication.
     */
    SupportsIAMDatabaseAuthentication?: Boolean;
    /**
     * Indicates whether a DB instance supports Performance Insights.
     */
    SupportsPerformanceInsights?: Boolean;
    /**
     * Minimum storage size for a DB instance.
     */
    MinStorageSize?: IntegerOptional;
    /**
     * Maximum storage size for a DB instance.
     */
    MaxStorageSize?: IntegerOptional;
    /**
     * Minimum total provisioned IOPS for a DB instance.
     */
    MinIopsPerDbInstance?: IntegerOptional;
    /**
     * Maximum total provisioned IOPS for a DB instance.
     */
    MaxIopsPerDbInstance?: IntegerOptional;
    /**
     * Minimum provisioned IOPS per GiB for a DB instance.
     */
    MinIopsPerGib?: DoubleOptional;
    /**
     * Maximum provisioned IOPS per GiB for a DB instance.
     */
    MaxIopsPerGib?: DoubleOptional;
    /**
     * A list of the available processor features for the DB instance class of a DB instance.
     */
    AvailableProcessorFeatures?: AvailableProcessorFeatureList;
    /**
     * A list of the supported DB engine modes.
     */
    SupportedEngineModes?: EngineModeList;
    /**
     * Indicates whether Amazon RDS can automatically scale storage for DB instances that use the specified DB instance class.
     */
    SupportsStorageAutoscaling?: BooleanOptional;
    /**
     * Indicates whether a DB instance supports Kerberos Authentication.
     */
    SupportsKerberosAuthentication?: BooleanOptional;
    /**
     * Indicates whether a DB instance supports RDS on Outposts. For more information about RDS on Outposts, see Amazon RDS on Amazon Web Services Outposts in the Amazon RDS User Guide. 
     */
    OutpostCapable?: Boolean;
    /**
     * The list of supported modes for Database Activity Streams. Aurora PostgreSQL returns the value [sync, async]. Aurora MySQL and RDS for Oracle return [async] only. If Database Activity Streams isn't supported, the return value is an empty list.
     */
    SupportedActivityStreamModes?: ActivityStreamModeList;
    /**
     * Indicates whether you can use Aurora global databases with a specific combination of other DB engine attributes.
     */
    SupportsGlobalDatabases?: Boolean;
    /**
     * Indicates whether DB instances can be configured as a Multi-AZ DB cluster. For more information on Multi-AZ DB clusters, see  Multi-AZ deployments with two readable standby DB instances in the Amazon RDS User Guide. 
     */
    SupportsClusters?: Boolean;
    /**
     * The network types supported by the DB instance (IPV4 or DUAL). A DB instance can support only the IPv4 protocol or the IPv4 and the IPv6 protocols (DUAL). For more information, see  Working with a DB instance in a VPC in the Amazon RDS User Guide. 
     */
    SupportedNetworkTypes?: StringList;
    /**
     * Indicates whether a DB instance supports storage throughput.
     */
    SupportsStorageThroughput?: Boolean;
    /**
     * Minimum storage throughput for a DB instance.
     */
    MinStorageThroughputPerDbInstance?: IntegerOptional;
    /**
     * Maximum storage throughput for a DB instance.
     */
    MaxStorageThroughputPerDbInstance?: IntegerOptional;
    /**
     * Minimum storage throughput to provisioned IOPS ratio for a DB instance.
     */
    MinStorageThroughputPerIops?: DoubleOptional;
    /**
     * Maximum storage throughput to provisioned IOPS ratio for a DB instance.
     */
    MaxStorageThroughputPerIops?: DoubleOptional;
    /**
     * Indicates whether a DB instance supports using a dedicated log volume (DLV).
     */
    SupportsDedicatedLogVolume?: Boolean;
  }
  export type OrderableDBInstanceOptionsList = OrderableDBInstanceOption[];
  export interface OrderableDBInstanceOptionsMessage {
    /**
     * An OrderableDBInstanceOption structure containing information about orderable options for the DB instance.
     */
    OrderableDBInstanceOptions?: OrderableDBInstanceOptionsList;
    /**
     * An optional pagination token provided by a previous OrderableDBInstanceOptions request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface Outpost {
    /**
     * The Amazon Resource Name (ARN) of the Outpost.
     */
    Arn?: String;
  }
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
     * Provides a description of the parameter.
     */
    Description?: String;
    /**
     * The source of the parameter value.
     */
    Source?: String;
    /**
     * Specifies the engine specific parameters type.
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
     * Indicates whether (true) or not (false) the parameter can be modified. Some parameters have security or operational implications that prevent them from being changed.
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
    /**
     * The valid DB engine modes.
     */
    SupportedEngineModes?: EngineModeList;
  }
  export type ParametersList = Parameter[];
  export interface PendingCloudwatchLogsExports {
    /**
     * Log types that are in the process of being deactivated. After they are deactivated, these log types aren't exported to CloudWatch Logs.
     */
    LogTypesToEnable?: LogTypeList;
    /**
     * Log types that are in the process of being enabled. After they are enabled, these log types are exported to CloudWatch Logs.
     */
    LogTypesToDisable?: LogTypeList;
  }
  export interface PendingMaintenanceAction {
    /**
     * The type of pending maintenance action that is available for the resource. Valid actions are system-update, db-upgrade, hardware-maintenance, and ca-certificate-rotation.
     */
    Action?: String;
    /**
     * The date of the maintenance window when the action is applied. The maintenance action is applied to the resource during its first maintenance window after this date.
     */
    AutoAppliedAfterDate?: TStamp;
    /**
     * The date when the maintenance action is automatically applied. On this date, the maintenance action is applied to the resource as soon as possible, regardless of the maintenance window for the resource. There might be a delay of one or more days from this date before the maintenance action is applied.
     */
    ForcedApplyDate?: TStamp;
    /**
     * Indicates the type of opt-in request that has been received for the resource.
     */
    OptInStatus?: String;
    /**
     * The effective date when the pending maintenance action is applied to the resource. This date takes into account opt-in requests received from the ApplyPendingMaintenanceAction API, the AutoAppliedAfterDate, and the ForcedApplyDate. This value is blank if an opt-in request has not been received and nothing has been specified as AutoAppliedAfterDate or ForcedApplyDate.
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
     * A list of the pending maintenance actions for the resource.
     */
    PendingMaintenanceActions?: PendingMaintenanceActions;
    /**
     * An optional pagination token provided by a previous DescribePendingMaintenanceActions request. If this parameter is specified, the response includes only records beyond the marker, up to a number of records specified by MaxRecords.
     */
    Marker?: String;
  }
  export interface PendingModifiedValues {
    /**
     * The name of the compute and memory capacity class for the DB instance.
     */
    DBInstanceClass?: String;
    /**
     * The allocated storage size for the DB instance specified in gibibytes (GiB).
     */
    AllocatedStorage?: IntegerOptional;
    /**
     * The master credentials for the DB instance.
     */
    MasterUserPassword?: String;
    /**
     * The port for the DB instance.
     */
    Port?: IntegerOptional;
    /**
     * The number of days for which automated backups are retained.
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * Indicates whether the Single-AZ DB instance will change to a Multi-AZ deployment.
     */
    MultiAZ?: BooleanOptional;
    /**
     * The database engine version.
     */
    EngineVersion?: String;
    /**
     * The license model for the DB instance. Valid values: license-included | bring-your-own-license | general-public-license 
     */
    LicenseModel?: String;
    /**
     * The Provisioned IOPS value for the DB instance.
     */
    Iops?: IntegerOptional;
    /**
     * The database identifier for the DB instance.
     */
    DBInstanceIdentifier?: String;
    /**
     * The storage type of the DB instance.
     */
    StorageType?: String;
    /**
     * The identifier of the CA certificate for the DB instance. For more information, see Using SSL/TLS to encrypt a connection to a DB instance in the Amazon RDS User Guide and  Using SSL/TLS to encrypt a connection to a DB cluster in the Amazon Aurora User Guide.
     */
    CACertificateIdentifier?: String;
    /**
     * The DB subnet group for the DB instance.
     */
    DBSubnetGroupName?: String;
    PendingCloudwatchLogsExports?: PendingCloudwatchLogsExports;
    /**
     * The number of CPU cores and the number of threads per core for the DB instance class of the DB instance.
     */
    ProcessorFeatures?: ProcessorFeatureList;
    /**
     * Indicates whether mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts is enabled.
     */
    IAMDatabaseAuthenticationEnabled?: BooleanOptional;
    /**
     * The automation mode of the RDS Custom DB instance: full or all-paused. If full, the DB instance automates monitoring and instance recovery. If all-paused, the instance pauses automation for the duration set by --resume-full-automation-mode-minutes.
     */
    AutomationMode?: AutomationMode;
    /**
     * The number of minutes to pause the automation. When the time period ends, RDS Custom resumes full automation. The minimum value is 60 (default). The maximum value is 1,440.
     */
    ResumeFullAutomationModeTime?: TStamp;
    /**
     * The storage throughput of the DB instance.
     */
    StorageThroughput?: IntegerOptional;
    /**
     * The database engine of the DB instance.
     */
    Engine?: String;
    /**
     * Indicates whether the DB instance has a dedicated log volume (DLV) enabled.&gt;
     */
    DedicatedLogVolume?: BooleanOptional;
  }
  export interface ProcessorFeature {
    /**
     * The name of the processor feature. Valid names are coreCount and threadsPerCore.
     */
    Name?: String;
    /**
     * The value of a processor feature name.
     */
    Value?: String;
  }
  export type ProcessorFeatureList = ProcessorFeature[];
  export interface PromoteReadReplicaDBClusterMessage {
    /**
     * The identifier of the DB cluster read replica to promote. This parameter isn't case-sensitive. Constraints:   Must match the identifier of an existing DB cluster read replica.   Example: my-cluster-replica1 
     */
    DBClusterIdentifier: String;
  }
  export interface PromoteReadReplicaDBClusterResult {
    DBCluster?: DBCluster;
  }
  export interface PromoteReadReplicaMessage {
    /**
     * The DB instance identifier. This value is stored as a lowercase string. Constraints:   Must match the identifier of an existing read replica DB instance.   Example: mydbinstance 
     */
    DBInstanceIdentifier: String;
    /**
     * The number of days for which automated backups are retained. Setting this parameter to a positive number enables backups. Setting this parameter to 0 disables automated backups. Default: 1 Constraints:   Must be a value from 0 to 35.   Can't be set to 0 if the DB instance is a source to read replicas.  
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * The daily time range during which automated backups are created if automated backups are enabled, using the BackupRetentionPeriod parameter. The default is a 30-minute window selected at random from an 8-hour block of time for each Amazon Web Services Region. To see the time blocks available, see  Adjusting the Preferred Maintenance Window in the Amazon RDS User Guide.  Constraints:   Must be in the format hh24:mi-hh24:mi.   Must be in Universal Coordinated Time (UTC).   Must not conflict with the preferred maintenance window.   Must be at least 30 minutes.  
     */
    PreferredBackupWindow?: String;
  }
  export interface PromoteReadReplicaResult {
    DBInstance?: DBInstance;
  }
  export interface PurchaseReservedDBInstancesOfferingMessage {
    /**
     * The ID of the Reserved DB instance offering to purchase. Example: 438012d3-4052-4cc7-b2e3-8d3372e0e706
     */
    ReservedDBInstancesOfferingId: String;
    /**
     * Customer-specified identifier to track this reservation. Example: myreservationID
     */
    ReservedDBInstanceId?: String;
    /**
     * The number of instances to reserve. Default: 1 
     */
    DBInstanceCount?: IntegerOptional;
    Tags?: TagList;
  }
  export interface PurchaseReservedDBInstancesOfferingResult {
    ReservedDBInstance?: ReservedDBInstance;
  }
  export interface Range {
    /**
     * The minimum value in the range.
     */
    From?: Integer;
    /**
     * The maximum value in the range.
     */
    To?: Integer;
    /**
     * The step value for the range. For example, if you have a range of 5,000 to 10,000, with a step value of 1,000, the valid values start at 5,000 and step up by 1,000. Even though 7,500 is within the range, it isn't a valid value for the range. The valid values are 5,000, 6,000, 7,000, 8,000...
     */
    Step?: IntegerOptional;
  }
  export type RangeList = Range[];
  export type ReadReplicaDBClusterIdentifierList = String[];
  export type ReadReplicaDBInstanceIdentifierList = String[];
  export type ReadReplicaIdentifierList = String[];
  export type ReadersArnList = String[];
  export interface RebootDBClusterMessage {
    /**
     * The DB cluster identifier. This parameter is stored as a lowercase string. Constraints:   Must match the identifier of an existing DBCluster.  
     */
    DBClusterIdentifier: String;
  }
  export interface RebootDBClusterResult {
    DBCluster?: DBCluster;
  }
  export interface RebootDBInstanceMessage {
    /**
     * The DB instance identifier. This parameter is stored as a lowercase string. Constraints:   Must match the identifier of an existing DBInstance.  
     */
    DBInstanceIdentifier: String;
    /**
     * Specifies whether the reboot is conducted through a Multi-AZ failover. Constraint: You can't enable force failover if the instance isn't configured for Multi-AZ.
     */
    ForceFailover?: BooleanOptional;
  }
  export interface RebootDBInstanceResult {
    DBInstance?: DBInstance;
  }
  export interface RecurringCharge {
    /**
     * The amount of the recurring charge.
     */
    RecurringChargeAmount?: Double;
    /**
     * The frequency of the recurring charge.
     */
    RecurringChargeFrequency?: String;
  }
  export type RecurringChargeList = RecurringCharge[];
  export interface RegisterDBProxyTargetsRequest {
    /**
     * The identifier of the DBProxy that is associated with the DBProxyTargetGroup.
     */
    DBProxyName: String;
    /**
     * The identifier of the DBProxyTargetGroup.
     */
    TargetGroupName?: String;
    /**
     * One or more DB instance identifiers.
     */
    DBInstanceIdentifiers?: StringList;
    /**
     * One or more DB cluster identifiers.
     */
    DBClusterIdentifiers?: StringList;
  }
  export interface RegisterDBProxyTargetsResponse {
    /**
     * One or more DBProxyTarget objects that are created when you register targets with a target group.
     */
    DBProxyTargets?: TargetList;
  }
  export interface RemoveFromGlobalClusterMessage {
    /**
     * The cluster identifier to detach from the Aurora global database cluster.
     */
    GlobalClusterIdentifier?: String;
    /**
     * The Amazon Resource Name (ARN) identifying the cluster that was detached from the Aurora global database cluster.
     */
    DbClusterIdentifier?: String;
  }
  export interface RemoveFromGlobalClusterResult {
    GlobalCluster?: GlobalCluster;
  }
  export interface RemoveRoleFromDBClusterMessage {
    /**
     * The name of the DB cluster to disassociate the IAM role from.
     */
    DBClusterIdentifier: String;
    /**
     * The Amazon Resource Name (ARN) of the IAM role to disassociate from the Aurora DB cluster, for example arn:aws:iam::123456789012:role/AuroraAccessRole.
     */
    RoleArn: String;
    /**
     * The name of the feature for the DB cluster that the IAM role is to be disassociated from. For information about supported feature names, see DBEngineVersion.
     */
    FeatureName?: String;
  }
  export interface RemoveRoleFromDBInstanceMessage {
    /**
     * The name of the DB instance to disassociate the IAM role from.
     */
    DBInstanceIdentifier: String;
    /**
     * The Amazon Resource Name (ARN) of the IAM role to disassociate from the DB instance, for example, arn:aws:iam::123456789012:role/AccessRole.
     */
    RoleArn: String;
    /**
     * The name of the feature for the DB instance that the IAM role is to be disassociated from. For information about supported feature names, see DBEngineVersion.
     */
    FeatureName: String;
  }
  export interface RemoveSourceIdentifierFromSubscriptionMessage {
    /**
     * The name of the RDS event notification subscription you want to remove a source identifier from.
     */
    SubscriptionName: String;
    /**
     * The source identifier to be removed from the subscription, such as the DB instance identifier for a DB instance or the name of a security group.
     */
    SourceIdentifier: String;
  }
  export interface RemoveSourceIdentifierFromSubscriptionResult {
    EventSubscription?: EventSubscription;
  }
  export interface RemoveTagsFromResourceMessage {
    /**
     * The Amazon RDS resource that the tags are removed from. This value is an Amazon Resource Name (ARN). For information about creating an ARN, see  Constructing an ARN for Amazon RDS in the Amazon RDS User Guide. 
     */
    ResourceName: String;
    /**
     * The tag key (name) of the tag to be removed.
     */
    TagKeys: KeyList;
  }
  export type ReplicaMode = "open-read-only"|"mounted"|string;
  export interface ReservedDBInstance {
    /**
     * The unique identifier for the reservation.
     */
    ReservedDBInstanceId?: String;
    /**
     * The offering identifier.
     */
    ReservedDBInstancesOfferingId?: String;
    /**
     * The DB instance class for the reserved DB instance.
     */
    DBInstanceClass?: String;
    /**
     * The time the reservation started.
     */
    StartTime?: TStamp;
    /**
     * The duration of the reservation in seconds.
     */
    Duration?: Integer;
    /**
     * The fixed price charged for this reserved DB instance.
     */
    FixedPrice?: Double;
    /**
     * The hourly price charged for this reserved DB instance.
     */
    UsagePrice?: Double;
    /**
     * The currency code for the reserved DB instance.
     */
    CurrencyCode?: String;
    /**
     * The number of reserved DB instances.
     */
    DBInstanceCount?: Integer;
    /**
     * The description of the reserved DB instance.
     */
    ProductDescription?: String;
    /**
     * The offering type of this reserved DB instance.
     */
    OfferingType?: String;
    /**
     * Indicates whether the reservation applies to Multi-AZ deployments.
     */
    MultiAZ?: Boolean;
    /**
     * The state of the reserved DB instance.
     */
    State?: String;
    /**
     * The recurring price charged to run this reserved DB instance.
     */
    RecurringCharges?: RecurringChargeList;
    /**
     * The Amazon Resource Name (ARN) for the reserved DB instance.
     */
    ReservedDBInstanceArn?: String;
    /**
     * The unique identifier for the lease associated with the reserved DB instance.  Amazon Web Services Support might request the lease ID for an issue related to a reserved DB instance. 
     */
    LeaseId?: String;
  }
  export type ReservedDBInstanceList = ReservedDBInstance[];
  export interface ReservedDBInstanceMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of reserved DB instances.
     */
    ReservedDBInstances?: ReservedDBInstanceList;
  }
  export interface ReservedDBInstancesOffering {
    /**
     * The offering identifier.
     */
    ReservedDBInstancesOfferingId?: String;
    /**
     * The DB instance class for the reserved DB instance.
     */
    DBInstanceClass?: String;
    /**
     * The duration of the offering in seconds.
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
     * The currency code for the reserved DB instance offering.
     */
    CurrencyCode?: String;
    /**
     * The database engine used by the offering.
     */
    ProductDescription?: String;
    /**
     * The offering type.
     */
    OfferingType?: String;
    /**
     * Indicates whether the offering applies to Multi-AZ deployments.
     */
    MultiAZ?: Boolean;
    /**
     * The recurring price charged to run this reserved DB instance.
     */
    RecurringCharges?: RecurringChargeList;
  }
  export type ReservedDBInstancesOfferingList = ReservedDBInstancesOffering[];
  export interface ReservedDBInstancesOfferingMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of reserved DB instance offerings.
     */
    ReservedDBInstancesOfferings?: ReservedDBInstancesOfferingList;
  }
  export interface ResetDBClusterParameterGroupMessage {
    /**
     * The name of the DB cluster parameter group to reset.
     */
    DBClusterParameterGroupName: String;
    /**
     * Specifies whether to reset all parameters in the DB cluster parameter group to their default values. You can't use this parameter if there is a list of parameter names specified for the Parameters parameter.
     */
    ResetAllParameters?: Boolean;
    /**
     * A list of parameter names in the DB cluster parameter group to reset to the default values. You can't use this parameter if the ResetAllParameters parameter is enabled.
     */
    Parameters?: ParametersList;
  }
  export interface ResetDBParameterGroupMessage {
    /**
     * The name of the DB parameter group. Constraints:   Must match the name of an existing DBParameterGroup.  
     */
    DBParameterGroupName: String;
    /**
     * Specifies whether to reset all parameters in the DB parameter group to default values. By default, all parameters in the DB parameter group are reset to default values.
     */
    ResetAllParameters?: Boolean;
    /**
     * To reset the entire DB parameter group, specify the DBParameterGroup name and ResetAllParameters parameters. To reset specific parameters, provide a list of the following: ParameterName and ApplyMethod. A maximum of 20 parameters can be modified in a single request.  MySQL  Valid Values (for Apply method): immediate | pending-reboot  You can use the immediate value with dynamic parameters only. You can use the pending-reboot value for both dynamic and static parameters, and changes are applied when DB instance reboots.  MariaDB  Valid Values (for Apply method): immediate | pending-reboot  You can use the immediate value with dynamic parameters only. You can use the pending-reboot value for both dynamic and static parameters, and changes are applied when DB instance reboots.  Oracle  Valid Values (for Apply method): pending-reboot 
     */
    Parameters?: ParametersList;
  }
  export interface ResourcePendingMaintenanceActions {
    /**
     * The ARN of the resource that has pending maintenance actions.
     */
    ResourceIdentifier?: String;
    /**
     * A list that provides details about the pending maintenance actions for the resource.
     */
    PendingMaintenanceActionDetails?: PendingMaintenanceActionDetails;
  }
  export interface RestoreDBClusterFromS3Message {
    /**
     * A list of Availability Zones (AZs) where instances in the restored DB cluster can be created.
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * The number of days for which automated backups of the restored DB cluster are retained. You must specify a minimum value of 1. Default: 1 Constraints:   Must be a value from 1 to 35  
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * A value that indicates that the restored DB cluster should be associated with the specified CharacterSet.
     */
    CharacterSetName?: String;
    /**
     * The database name for the restored DB cluster.
     */
    DatabaseName?: String;
    /**
     * The name of the DB cluster to create from the source data in the Amazon S3 bucket. This parameter isn't case-sensitive. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   First character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.   Example: my-cluster1 
     */
    DBClusterIdentifier: String;
    /**
     * The name of the DB cluster parameter group to associate with the restored DB cluster. If this argument is omitted, the default parameter group for the engine version is used. Constraints:   If supplied, must match the name of an existing DBClusterParameterGroup.  
     */
    DBClusterParameterGroupName?: String;
    /**
     * A list of EC2 VPC security groups to associate with the restored DB cluster.
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * A DB subnet group to associate with the restored DB cluster. Constraints: If supplied, must match the name of an existing DBSubnetGroup. Example: mydbsubnetgroup 
     */
    DBSubnetGroupName?: String;
    /**
     * The name of the database engine to be used for this DB cluster. Valid Values: aurora-mysql (for Aurora MySQL)
     */
    Engine: String;
    /**
     * The version number of the database engine to use. To list all of the available engine versions for aurora-mysql (Aurora MySQL), use the following command:  aws rds describe-db-engine-versions --engine aurora-mysql --query "DBEngineVersions[].EngineVersion"   Aurora MySQL  Examples: 5.7.mysql_aurora.2.12.0, 8.0.mysql_aurora.3.04.0 
     */
    EngineVersion?: String;
    /**
     * The port number on which the instances in the restored DB cluster accept connections. Default: 3306 
     */
    Port?: IntegerOptional;
    /**
     * The name of the master user for the restored DB cluster. Constraints:   Must be 1 to 16 letters or numbers.   First character must be a letter.   Can't be a reserved word for the chosen database engine.  
     */
    MasterUsername: String;
    /**
     * The password for the master database user. This password can contain any printable ASCII character except "/", """, or "@". Constraints:   Must contain from 8 to 41 characters.   Can't be specified if ManageMasterUserPassword is turned on.  
     */
    MasterUserPassword?: String;
    /**
     * A value that indicates that the restored DB cluster should be associated with the specified option group. Permanent options can't be removed from an option group. An option group can't be removed from a DB cluster once it is associated with a DB cluster.
     */
    OptionGroupName?: String;
    /**
     * The daily time range during which automated backups are created if automated backups are enabled using the BackupRetentionPeriod parameter. The default is a 30-minute window selected at random from an 8-hour block of time for each Amazon Web Services Region. To view the time blocks available, see  Backup window in the Amazon Aurora User Guide. Constraints:   Must be in the format hh24:mi-hh24:mi.   Must be in Universal Coordinated Time (UTC).   Must not conflict with the preferred maintenance window.   Must be at least 30 minutes.  
     */
    PreferredBackupWindow?: String;
    /**
     * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC). Format: ddd:hh24:mi-ddd:hh24:mi  The default is a 30-minute window selected at random from an 8-hour block of time for each Amazon Web Services Region, occurring on a random day of the week. To see the time blocks available, see  Adjusting the Preferred Maintenance Window in the Amazon Aurora User Guide. Valid Days: Mon, Tue, Wed, Thu, Fri, Sat, Sun. Constraints: Minimum 30-minute window.
     */
    PreferredMaintenanceWindow?: String;
    Tags?: TagList;
    /**
     * Specifies whether the restored DB cluster is encrypted.
     */
    StorageEncrypted?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier for an encrypted DB cluster. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. To use a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN. If the StorageEncrypted parameter is enabled, and you do not specify a value for the KmsKeyId parameter, then Amazon RDS will use your default KMS key. There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region.
     */
    KmsKeyId?: String;
    /**
     * Specifies whether to enable mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts. By default, mapping isn't enabled. For more information, see  IAM Database Authentication in the Amazon Aurora User Guide.
     */
    EnableIAMDatabaseAuthentication?: BooleanOptional;
    /**
     * The identifier for the database engine that was backed up to create the files stored in the Amazon S3 bucket. Valid Values: mysql 
     */
    SourceEngine: String;
    /**
     * The version of the database that the backup files were created from. MySQL versions 5.7 and 8.0 are supported. Example: 5.7.40, 8.0.28 
     */
    SourceEngineVersion: String;
    /**
     * The name of the Amazon S3 bucket that contains the data used to create the Amazon Aurora DB cluster.
     */
    S3BucketName: String;
    /**
     * The prefix for all of the file names that contain the data used to create the Amazon Aurora DB cluster. If you do not specify a SourceS3Prefix value, then the Amazon Aurora DB cluster is created by using all of the files in the Amazon S3 bucket.
     */
    S3Prefix?: String;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Web Services Identity and Access Management (IAM) role that authorizes Amazon RDS to access the Amazon S3 bucket on your behalf.
     */
    S3IngestionRoleArn: String;
    /**
     * The target backtrack window, in seconds. To disable backtracking, set this value to 0.  Currently, Backtrack is only supported for Aurora MySQL DB clusters.  Default: 0 Constraints:   If specified, this value must be set to a number from 0 to 259,200 (72 hours).  
     */
    BacktrackWindow?: LongOptional;
    /**
     * The list of logs that the restored DB cluster is to export to CloudWatch Logs. The values in the list depend on the DB engine being used.  Aurora MySQL  Possible values are audit, error, general, and slowquery. For more information about exporting CloudWatch Logs for Amazon Aurora, see Publishing Database Logs to Amazon CloudWatch Logs in the Amazon Aurora User Guide.
     */
    EnableCloudwatchLogsExports?: LogTypeList;
    /**
     * Specifies whether to enable deletion protection for the DB cluster. The database can't be deleted when deletion protection is enabled. By default, deletion protection isn't enabled.
     */
    DeletionProtection?: BooleanOptional;
    /**
     * Specifies whether to copy all tags from the restored DB cluster to snapshots of the restored DB cluster. The default is not to copy them.
     */
    CopyTagsToSnapshot?: BooleanOptional;
    /**
     * Specify the Active Directory directory ID to restore the DB cluster in. The domain must be created prior to this operation. For Amazon Aurora DB clusters, Amazon RDS can use Kerberos Authentication to authenticate users that connect to the DB cluster. For more information, see Kerberos Authentication in the Amazon Aurora User Guide.
     */
    Domain?: String;
    /**
     * Specify the name of the IAM role to be used when making API calls to the Directory Service.
     */
    DomainIAMRoleName?: String;
    ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
    /**
     * The network type of the DB cluster. Valid Values:    IPV4     DUAL    The network type is determined by the DBSubnetGroup specified for the DB cluster. A DBSubnetGroup can support only the IPv4 protocol or the IPv4 and the IPv6 protocols (DUAL). For more information, see  Working with a DB instance in a VPC in the Amazon Aurora User Guide. 
     */
    NetworkType?: String;
    /**
     * Specifies whether to manage the master user password with Amazon Web Services Secrets Manager. For more information, see Password management with Amazon Web Services Secrets Manager in the Amazon RDS User Guide and Password management with Amazon Web Services Secrets Manager in the Amazon Aurora User Guide.  Constraints:   Can't manage the master user password with Amazon Web Services Secrets Manager if MasterUserPassword is specified.  
     */
    ManageMasterUserPassword?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier to encrypt a secret that is automatically generated and managed in Amazon Web Services Secrets Manager. This setting is valid only if the master user password is managed by RDS in Amazon Web Services Secrets Manager for the DB cluster. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. To use a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN. If you don't specify MasterUserSecretKmsKeyId, then the aws/secretsmanager KMS key is used to encrypt the secret. If the secret is in a different Amazon Web Services account, then you can't use the aws/secretsmanager KMS key to encrypt the secret, and you must use a customer managed KMS key. There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region.
     */
    MasterUserSecretKmsKeyId?: String;
    /**
     * Specifies the storage type to be associated with the DB cluster. Valid Values: aurora, aurora-iopt1  Default: aurora  Valid for: Aurora DB clusters only
     */
    StorageType?: String;
  }
  export interface RestoreDBClusterFromS3Result {
    DBCluster?: DBCluster;
  }
  export interface RestoreDBClusterFromSnapshotMessage {
    /**
     * Provides the list of Availability Zones (AZs) where instances in the restored DB cluster can be created. Valid for: Aurora DB clusters only
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * The name of the DB cluster to create from the DB snapshot or DB cluster snapshot. This parameter isn't case-sensitive. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens   First character must be a letter   Can't end with a hyphen or contain two consecutive hyphens   Example: my-snapshot-id  Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    DBClusterIdentifier: String;
    /**
     * The identifier for the DB snapshot or DB cluster snapshot to restore from. You can use either the name or the Amazon Resource Name (ARN) to specify a DB cluster snapshot. However, you can use only the ARN to specify a DB snapshot. Constraints:   Must match the identifier of an existing Snapshot.   Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    SnapshotIdentifier: String;
    /**
     * The database engine to use for the new DB cluster. Default: The same as source Constraint: Must be compatible with the engine of the source Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    Engine: String;
    /**
     * The version of the database engine to use for the new DB cluster. If you don't specify an engine version, the default version for the database engine in the Amazon Web Services Region is used. To list all of the available engine versions for Aurora MySQL, use the following command:  aws rds describe-db-engine-versions --engine aurora-mysql --query "DBEngineVersions[].EngineVersion"  To list all of the available engine versions for Aurora PostgreSQL, use the following command:  aws rds describe-db-engine-versions --engine aurora-postgresql --query "DBEngineVersions[].EngineVersion"  To list all of the available engine versions for RDS for MySQL, use the following command:  aws rds describe-db-engine-versions --engine mysql --query "DBEngineVersions[].EngineVersion"  To list all of the available engine versions for RDS for PostgreSQL, use the following command:  aws rds describe-db-engine-versions --engine postgres --query "DBEngineVersions[].EngineVersion"   Aurora MySQL  See Database engine updates for Amazon Aurora MySQL in the Amazon Aurora User Guide.  Aurora PostgreSQL  See Amazon Aurora PostgreSQL releases and engine versions in the Amazon Aurora User Guide.  MySQL  See Amazon RDS for MySQL in the Amazon RDS User Guide.   PostgreSQL  See Amazon RDS for PostgreSQL versions and extensions in the Amazon RDS User Guide.  Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    EngineVersion?: String;
    /**
     * The port number on which the new DB cluster accepts connections. Constraints: This value must be 1150-65535  Default: The same port as the original DB cluster. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    Port?: IntegerOptional;
    /**
     * The name of the DB subnet group to use for the new DB cluster. Constraints: If supplied, must match the name of an existing DB subnet group. Example: mydbsubnetgroup  Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    DBSubnetGroupName?: String;
    /**
     * The database name for the restored DB cluster. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    DatabaseName?: String;
    /**
     * The name of the option group to use for the restored DB cluster. DB clusters are associated with a default option group that can't be modified.
     */
    OptionGroupName?: String;
    /**
     * A list of VPC security groups that the new DB cluster will belong to. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * The tags to be assigned to the restored DB cluster. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    Tags?: TagList;
    /**
     * The Amazon Web Services KMS key identifier to use when restoring an encrypted DB cluster from a DB snapshot or DB cluster snapshot. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. To use a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN. When you don't specify a value for the KmsKeyId parameter, then the following occurs:   If the DB snapshot or DB cluster snapshot in SnapshotIdentifier is encrypted, then the restored DB cluster is encrypted using the KMS key that was used to encrypt the DB snapshot or DB cluster snapshot.   If the DB snapshot or DB cluster snapshot in SnapshotIdentifier isn't encrypted, then the restored DB cluster isn't encrypted.   Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    KmsKeyId?: String;
    /**
     * Specifies whether to enable mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts. By default, mapping isn't enabled. For more information, see  IAM Database Authentication in the Amazon Aurora User Guide. Valid for: Aurora DB clusters only
     */
    EnableIAMDatabaseAuthentication?: BooleanOptional;
    /**
     * The target backtrack window, in seconds. To disable backtracking, set this value to 0.  Currently, Backtrack is only supported for Aurora MySQL DB clusters.  Default: 0 Constraints:   If specified, this value must be set to a number from 0 to 259,200 (72 hours).   Valid for: Aurora DB clusters only
     */
    BacktrackWindow?: LongOptional;
    /**
     * The list of logs that the restored DB cluster is to export to Amazon CloudWatch Logs. The values in the list depend on the DB engine being used.  RDS for MySQL  Possible values are error, general, and slowquery.  RDS for PostgreSQL  Possible values are postgresql and upgrade.  Aurora MySQL  Possible values are audit, error, general, and slowquery.  Aurora PostgreSQL  Possible value is postgresql. For more information about exporting CloudWatch Logs for Amazon RDS, see Publishing Database Logs to Amazon CloudWatch Logs in the Amazon RDS User Guide. For more information about exporting CloudWatch Logs for Amazon Aurora, see Publishing Database Logs to Amazon CloudWatch Logs in the Amazon Aurora User Guide. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    EnableCloudwatchLogsExports?: LogTypeList;
    /**
     * The DB engine mode of the DB cluster, either provisioned or serverless. For more information, see  CreateDBCluster. Valid for: Aurora DB clusters only
     */
    EngineMode?: String;
    /**
     * For DB clusters in serverless DB engine mode, the scaling properties of the DB cluster. Valid for: Aurora DB clusters only
     */
    ScalingConfiguration?: ScalingConfiguration;
    /**
     * The name of the DB cluster parameter group to associate with this DB cluster. If this argument is omitted, the default DB cluster parameter group for the specified engine is used. Constraints:   If supplied, must match the name of an existing default DB cluster parameter group.   Must be 1 to 255 letters, numbers, or hyphens.   First character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.   Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    DBClusterParameterGroupName?: String;
    /**
     * Specifies whether to enable deletion protection for the DB cluster. The database can't be deleted when deletion protection is enabled. By default, deletion protection isn't enabled. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    DeletionProtection?: BooleanOptional;
    /**
     * Specifies whether to copy all tags from the restored DB cluster to snapshots of the restored DB cluster. The default is not to copy them. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    CopyTagsToSnapshot?: BooleanOptional;
    /**
     * The Active Directory directory ID to restore the DB cluster in. The domain must be created prior to this operation. Currently, only MySQL, Microsoft SQL Server, Oracle, and PostgreSQL DB instances can be created in an Active Directory Domain. For more information, see  Kerberos Authentication in the Amazon RDS User Guide. Valid for: Aurora DB clusters only
     */
    Domain?: String;
    /**
     * The name of the IAM role to be used when making API calls to the Directory Service. Valid for: Aurora DB clusters only
     */
    DomainIAMRoleName?: String;
    /**
     * The compute and memory capacity of the each DB instance in the Multi-AZ DB cluster, for example db.m6gd.xlarge. Not all DB instance classes are available in all Amazon Web Services Regions, or for all database engines. For the full list of DB instance classes, and availability for your engine, see DB Instance Class in the Amazon RDS User Guide.  Valid for: Multi-AZ DB clusters only
     */
    DBClusterInstanceClass?: String;
    /**
     * Specifies the storage type to be associated with the DB cluster. When specified for a Multi-AZ DB cluster, a value for the Iops parameter is required. Valid Values: aurora, aurora-iopt1 (Aurora DB clusters); io1 (Multi-AZ DB clusters) Default: aurora (Aurora DB clusters); io1 (Multi-AZ DB clusters) Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    StorageType?: String;
    /**
     * The amount of Provisioned IOPS (input/output operations per second) to be initially allocated for each DB instance in the Multi-AZ DB cluster. For information about valid IOPS values, see Amazon RDS Provisioned IOPS storage in the Amazon RDS User Guide. Constraints: Must be a multiple between .5 and 50 of the storage amount for the DB instance. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    Iops?: IntegerOptional;
    /**
     * Specifies whether the DB cluster is publicly accessible. When the DB cluster is publicly accessible, its Domain Name System (DNS) endpoint resolves to the private IP address from within the DB cluster's virtual private cloud (VPC). It resolves to the public IP address from outside of the DB cluster's VPC. Access to the DB cluster is ultimately controlled by the security group it uses. That public access is not permitted if the security group assigned to the DB cluster doesn't permit it. When the DB cluster isn't publicly accessible, it is an internal DB cluster with a DNS name that resolves to a private IP address. Default: The default behavior varies depending on whether DBSubnetGroupName is specified. If DBSubnetGroupName isn't specified, and PubliclyAccessible isn't specified, the following applies:   If the default VPC in the target Region doesn’t have an internet gateway attached to it, the DB cluster is private.   If the default VPC in the target Region has an internet gateway attached to it, the DB cluster is public.   If DBSubnetGroupName is specified, and PubliclyAccessible isn't specified, the following applies:   If the subnets are part of a VPC that doesn’t have an internet gateway attached to it, the DB cluster is private.   If the subnets are part of a VPC that has an internet gateway attached to it, the DB cluster is public.   Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    PubliclyAccessible?: BooleanOptional;
    ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
    /**
     * The network type of the DB cluster. Valid Values:    IPV4     DUAL    The network type is determined by the DBSubnetGroup specified for the DB cluster. A DBSubnetGroup can support only the IPv4 protocol or the IPv4 and the IPv6 protocols (DUAL). For more information, see  Working with a DB instance in a VPC in the Amazon Aurora User Guide.  Valid for: Aurora DB clusters only
     */
    NetworkType?: String;
  }
  export interface RestoreDBClusterFromSnapshotResult {
    DBCluster?: DBCluster;
  }
  export interface RestoreDBClusterToPointInTimeMessage {
    /**
     * The name of the new DB cluster to be created. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens   First character must be a letter   Can't end with a hyphen or contain two consecutive hyphens   Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    DBClusterIdentifier: String;
    /**
     * The type of restore to be performed. You can specify one of the following values:    full-copy - The new DB cluster is restored as a full copy of the source DB cluster.    copy-on-write - The new DB cluster is restored as a clone of the source DB cluster.   If you don't specify a RestoreType value, then the new DB cluster is restored as a full copy of the source DB cluster. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    RestoreType?: String;
    /**
     * The identifier of the source DB cluster from which to restore. Constraints:   Must match the identifier of an existing DBCluster.   Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    SourceDBClusterIdentifier?: String;
    /**
     * The date and time to restore the DB cluster to. Valid Values: Value must be a time in Universal Coordinated Time (UTC) format Constraints:   Must be before the latest restorable time for the DB instance   Must be specified if UseLatestRestorableTime parameter isn't provided   Can't be specified if the UseLatestRestorableTime parameter is enabled   Can't be specified if the RestoreType parameter is copy-on-write    Example: 2015-03-07T23:45:00Z  Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    RestoreToTime?: TStamp;
    /**
     * Specifies whether to restore the DB cluster to the latest restorable backup time. By default, the DB cluster isn't restored to the latest restorable backup time. Constraints: Can't be specified if RestoreToTime parameter is provided. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    UseLatestRestorableTime?: Boolean;
    /**
     * The port number on which the new DB cluster accepts connections. Constraints: A value from 1150-65535. Default: The default port for the engine. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    Port?: IntegerOptional;
    /**
     * The DB subnet group name to use for the new DB cluster. Constraints: If supplied, must match the name of an existing DBSubnetGroup. Example: mydbsubnetgroup  Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    DBSubnetGroupName?: String;
    /**
     * The name of the option group for the new DB cluster. DB clusters are associated with a default option group that can't be modified.
     */
    OptionGroupName?: String;
    /**
     * A list of VPC security groups that the new DB cluster belongs to. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    Tags?: TagList;
    /**
     * The Amazon Web Services KMS key identifier to use when restoring an encrypted DB cluster from an encrypted DB cluster. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. To use a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN. You can restore to a new DB cluster and encrypt the new DB cluster with a KMS key that is different from the KMS key used to encrypt the source DB cluster. The new DB cluster is encrypted with the KMS key identified by the KmsKeyId parameter. If you don't specify a value for the KmsKeyId parameter, then the following occurs:   If the DB cluster is encrypted, then the restored DB cluster is encrypted using the KMS key that was used to encrypt the source DB cluster.   If the DB cluster isn't encrypted, then the restored DB cluster isn't encrypted.   If DBClusterIdentifier refers to a DB cluster that isn't encrypted, then the restore request is rejected. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    KmsKeyId?: String;
    /**
     * Specifies whether to enable mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts. By default, mapping isn't enabled. For more information, see  IAM Database Authentication in the Amazon Aurora User Guide. Valid for: Aurora DB clusters only
     */
    EnableIAMDatabaseAuthentication?: BooleanOptional;
    /**
     * The target backtrack window, in seconds. To disable backtracking, set this value to 0. Default: 0 Constraints:   If specified, this value must be set to a number from 0 to 259,200 (72 hours).   Valid for: Aurora MySQL DB clusters only
     */
    BacktrackWindow?: LongOptional;
    /**
     * The list of logs that the restored DB cluster is to export to CloudWatch Logs. The values in the list depend on the DB engine being used.  RDS for MySQL  Possible values are error, general, and slowquery.  RDS for PostgreSQL  Possible values are postgresql and upgrade.  Aurora MySQL  Possible values are audit, error, general, and slowquery.  Aurora PostgreSQL  Possible value is postgresql. For more information about exporting CloudWatch Logs for Amazon RDS, see Publishing Database Logs to Amazon CloudWatch Logs in the Amazon RDS User Guide. For more information about exporting CloudWatch Logs for Amazon Aurora, see Publishing Database Logs to Amazon CloudWatch Logs in the Amazon Aurora User Guide. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    EnableCloudwatchLogsExports?: LogTypeList;
    /**
     * The name of the custom DB cluster parameter group to associate with this DB cluster. If the DBClusterParameterGroupName parameter is omitted, the default DB cluster parameter group for the specified engine is used. Constraints:   If supplied, must match the name of an existing DB cluster parameter group.   Must be 1 to 255 letters, numbers, or hyphens.   First character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.   Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    DBClusterParameterGroupName?: String;
    /**
     * Specifies whether to enable deletion protection for the DB cluster. The database can't be deleted when deletion protection is enabled. By default, deletion protection isn't enabled. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    DeletionProtection?: BooleanOptional;
    /**
     * Specifies whether to copy all tags from the restored DB cluster to snapshots of the restored DB cluster. The default is not to copy them. Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    CopyTagsToSnapshot?: BooleanOptional;
    /**
     * The Active Directory directory ID to restore the DB cluster in. The domain must be created prior to this operation. For Amazon Aurora DB clusters, Amazon RDS can use Kerberos Authentication to authenticate users that connect to the DB cluster. For more information, see Kerberos Authentication in the Amazon Aurora User Guide. Valid for: Aurora DB clusters only
     */
    Domain?: String;
    /**
     * The name of the IAM role to be used when making API calls to the Directory Service. Valid for: Aurora DB clusters only
     */
    DomainIAMRoleName?: String;
    /**
     * For DB clusters in serverless DB engine mode, the scaling properties of the DB cluster. Valid for: Aurora DB clusters only
     */
    ScalingConfiguration?: ScalingConfiguration;
    /**
     * The engine mode of the new cluster. Specify provisioned or serverless, depending on the type of the cluster you are creating. You can create an Aurora Serverless v1 clone from a provisioned cluster, or a provisioned clone from an Aurora Serverless v1 cluster. To create a clone that is an Aurora Serverless v1 cluster, the original cluster must be an Aurora Serverless v1 cluster or an encrypted provisioned cluster. Valid for: Aurora DB clusters only
     */
    EngineMode?: String;
    /**
     * The compute and memory capacity of the each DB instance in the Multi-AZ DB cluster, for example db.m6gd.xlarge. Not all DB instance classes are available in all Amazon Web Services Regions, or for all database engines. For the full list of DB instance classes, and availability for your engine, see DB instance class in the Amazon RDS User Guide. Valid for: Multi-AZ DB clusters only
     */
    DBClusterInstanceClass?: String;
    /**
     * Specifies the storage type to be associated with the DB cluster. When specified for a Multi-AZ DB cluster, a value for the Iops parameter is required. Valid Values: aurora, aurora-iopt1 (Aurora DB clusters); io1 (Multi-AZ DB clusters) Default: aurora (Aurora DB clusters); io1 (Multi-AZ DB clusters) Valid for: Aurora DB clusters and Multi-AZ DB clusters
     */
    StorageType?: String;
    /**
     * Specifies whether the DB cluster is publicly accessible. When the DB cluster is publicly accessible, its Domain Name System (DNS) endpoint resolves to the private IP address from within the DB cluster's virtual private cloud (VPC). It resolves to the public IP address from outside of the DB cluster's VPC. Access to the DB cluster is ultimately controlled by the security group it uses. That public access is not permitted if the security group assigned to the DB cluster doesn't permit it. When the DB cluster isn't publicly accessible, it is an internal DB cluster with a DNS name that resolves to a private IP address. Default: The default behavior varies depending on whether DBSubnetGroupName is specified. If DBSubnetGroupName isn't specified, and PubliclyAccessible isn't specified, the following applies:   If the default VPC in the target Region doesn’t have an internet gateway attached to it, the DB cluster is private.   If the default VPC in the target Region has an internet gateway attached to it, the DB cluster is public.   If DBSubnetGroupName is specified, and PubliclyAccessible isn't specified, the following applies:   If the subnets are part of a VPC that doesn’t have an internet gateway attached to it, the DB cluster is private.   If the subnets are part of a VPC that has an internet gateway attached to it, the DB cluster is public.   Valid for: Multi-AZ DB clusters only
     */
    PubliclyAccessible?: BooleanOptional;
    /**
     * The amount of Provisioned IOPS (input/output operations per second) to be initially allocated for each DB instance in the Multi-AZ DB cluster. For information about valid IOPS values, see Amazon RDS Provisioned IOPS storage in the Amazon RDS User Guide. Constraints: Must be a multiple between .5 and 50 of the storage amount for the DB instance. Valid for: Multi-AZ DB clusters only
     */
    Iops?: IntegerOptional;
    ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
    /**
     * The network type of the DB cluster. Valid Values:    IPV4     DUAL    The network type is determined by the DBSubnetGroup specified for the DB cluster. A DBSubnetGroup can support only the IPv4 protocol or the IPv4 and the IPv6 protocols (DUAL). For more information, see  Working with a DB instance in a VPC in the Amazon Aurora User Guide.  Valid for: Aurora DB clusters only
     */
    NetworkType?: String;
    /**
     * The resource ID of the source DB cluster from which to restore.
     */
    SourceDbClusterResourceId?: String;
  }
  export interface RestoreDBClusterToPointInTimeResult {
    DBCluster?: DBCluster;
  }
  export interface RestoreDBInstanceFromDBSnapshotMessage {
    /**
     * Name of the DB instance to create from the DB snapshot. This parameter isn't case-sensitive. Constraints:   Must contain from 1 to 63 numbers, letters, or hyphens   First character must be a letter   Can't end with a hyphen or contain two consecutive hyphens   Example: my-snapshot-id 
     */
    DBInstanceIdentifier: String;
    /**
     * The identifier for the DB snapshot to restore from. Constraints:   Must match the identifier of an existing DBSnapshot.   Can't be specified when DBClusterSnapshotIdentifier is specified.   Must be specified when DBClusterSnapshotIdentifier isn't specified.   If you are restoring from a shared manual DB snapshot, the DBSnapshotIdentifier must be the ARN of the shared DB snapshot.  
     */
    DBSnapshotIdentifier?: String;
    /**
     * The compute and memory capacity of the Amazon RDS DB instance, for example db.m4.large. Not all DB instance classes are available in all Amazon Web Services Regions, or for all database engines. For the full list of DB instance classes, and availability for your engine, see DB Instance Class in the Amazon RDS User Guide.  Default: The same DBInstanceClass as the original DB instance.
     */
    DBInstanceClass?: String;
    /**
     * The port number on which the database accepts connections. Default: The same port as the original DB instance Constraints: Value must be 1150-65535 
     */
    Port?: IntegerOptional;
    /**
     * The Availability Zone (AZ) where the DB instance will be created. Default: A random, system-chosen Availability Zone. Constraint: You can't specify the AvailabilityZone parameter if the DB instance is a Multi-AZ deployment. Example: us-east-1a 
     */
    AvailabilityZone?: String;
    /**
     * The DB subnet group name to use for the new instance. Constraints: If supplied, must match the name of an existing DBSubnetGroup. Example: mydbsubnetgroup 
     */
    DBSubnetGroupName?: String;
    /**
     * Specifies whether the DB instance is a Multi-AZ deployment. This setting doesn't apply to RDS Custom. Constraint: You can't specify the AvailabilityZone parameter if the DB instance is a Multi-AZ deployment.
     */
    MultiAZ?: BooleanOptional;
    /**
     * Specifies whether the DB instance is publicly accessible. When the DB instance is publicly accessible, its Domain Name System (DNS) endpoint resolves to the private IP address from within the DB instance's virtual private cloud (VPC). It resolves to the public IP address from outside of the DB instance's VPC. Access to the DB instance is ultimately controlled by the security group it uses. That public access is not permitted if the security group assigned to the DB instance doesn't permit it. When the DB instance isn't publicly accessible, it is an internal DB instance with a DNS name that resolves to a private IP address. For more information, see CreateDBInstance.
     */
    PubliclyAccessible?: BooleanOptional;
    /**
     * Specifies whether to automatically apply minor version upgrades to the DB instance during the maintenance window. If you restore an RDS Custom DB instance, you must disable this parameter.
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
    /**
     * License model information for the restored DB instance. This setting doesn't apply to RDS Custom. Default: Same as source. Valid Values: license-included | bring-your-own-license | general-public-license 
     */
    LicenseModel?: String;
    /**
     * The database name for the restored DB instance. This parameter doesn't apply to the MySQL, PostgreSQL, or MariaDB engines. It also doesn't apply to RDS Custom DB instances.
     */
    DBName?: String;
    /**
     * The database engine to use for the new instance. This setting doesn't apply to RDS Custom. Default: The same as source Constraint: Must be compatible with the engine of the source. For example, you can restore a MariaDB 10.1 DB instance from a MySQL 5.6 snapshot. Valid Values:    mariadb     mysql     oracle-ee     oracle-ee-cdb     oracle-se2     oracle-se2-cdb     postgres     sqlserver-ee     sqlserver-se     sqlserver-ex     sqlserver-web   
     */
    Engine?: String;
    /**
     * Specifies the amount of provisioned IOPS for the DB instance, expressed in I/O operations per second. If this parameter isn't specified, the IOPS value is taken from the backup. If this parameter is set to 0, the new instance is converted to a non-PIOPS instance. The conversion takes additional time, though your DB instance is available for connections before the conversion starts. The provisioned IOPS value must follow the requirements for your database engine. For more information, see Amazon RDS Provisioned IOPS storage in the Amazon RDS User Guide.  Constraints: Must be an integer greater than 1000.
     */
    Iops?: IntegerOptional;
    /**
     * The name of the option group to be used for the restored DB instance. Permanent options, such as the TDE option for Oracle Advanced Security TDE, can't be removed from an option group, and that option group can't be removed from a DB instance after it is associated with a DB instance. This setting doesn't apply to RDS Custom.
     */
    OptionGroupName?: String;
    Tags?: TagList;
    /**
     * Specifies the storage type to be associated with the DB instance. Valid Values: gp2 | gp3 | io1 | standard  If you specify io1 or gp3, you must also include a value for the Iops parameter. Default: io1 if the Iops parameter is specified, otherwise gp2 
     */
    StorageType?: String;
    /**
     * The ARN from the key store with which to associate the instance for TDE encryption. This setting doesn't apply to RDS Custom.
     */
    TdeCredentialArn?: String;
    /**
     * The password for the given ARN from the key store in order to access the device. This setting doesn't apply to RDS Custom.
     */
    TdeCredentialPassword?: String;
    /**
     * A list of EC2 VPC security groups to associate with this DB instance. Default: The default EC2 VPC security group for the DB subnet group's VPC.
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * Specify the Active Directory directory ID to restore the DB instance in. The domain/ must be created prior to this operation. Currently, you can create only MySQL, Microsoft SQL Server, Oracle, and PostgreSQL DB instances in an Active Directory Domain. For more information, see  Kerberos Authentication in the Amazon RDS User Guide. This setting doesn't apply to RDS Custom.
     */
    Domain?: String;
    /**
     * The fully qualified domain name (FQDN) of an Active Directory domain. Constraints:   Can't be longer than 64 characters.   Example: mymanagedADtest.mymanagedAD.mydomain 
     */
    DomainFqdn?: String;
    /**
     * The Active Directory organizational unit for your DB instance to join. Constraints:   Must be in the distinguished name format.   Can't be longer than 64 characters.   Example: OU=mymanagedADtestOU,DC=mymanagedADtest,DC=mymanagedAD,DC=mydomain 
     */
    DomainOu?: String;
    /**
     * The ARN for the Secrets Manager secret with the credentials for the user joining the domain. Constraints:   Can't be longer than 64 characters.   Example: arn:aws:secretsmanager:region:account-number:secret:myselfmanagedADtestsecret-123456 
     */
    DomainAuthSecretArn?: String;
    /**
     * The IPv4 DNS IP addresses of your primary and secondary Active Directory domain controllers. Constraints:   Two IP addresses must be provided. If there isn't a secondary domain controller, use the IP address of the primary domain controller for both entries in the list.   Example: 123.124.125.126,234.235.236.237 
     */
    DomainDnsIps?: StringList;
    /**
     * Specifies whether to copy all tags from the restored DB instance to snapshots of the DB instance. In most cases, tags aren't copied by default. However, when you restore a DB instance from a DB snapshot, RDS checks whether you specify new tags. If yes, the new tags are added to the restored DB instance. If there are no new tags, RDS looks for the tags from the source DB instance for the DB snapshot, and then adds those tags to the restored DB instance. For more information, see  Copying tags to DB instance snapshots in the Amazon RDS User Guide.
     */
    CopyTagsToSnapshot?: BooleanOptional;
    /**
     * The name of the IAM role to use when making API calls to the Directory Service. This setting doesn't apply to RDS Custom DB instances.
     */
    DomainIAMRoleName?: String;
    /**
     * Specifies whether to enable mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts. By default, mapping is disabled. For more information about IAM database authentication, see  IAM Database Authentication for MySQL and PostgreSQL in the Amazon RDS User Guide.  This setting doesn't apply to RDS Custom.
     */
    EnableIAMDatabaseAuthentication?: BooleanOptional;
    /**
     * The list of logs that the restored DB instance is to export to CloudWatch Logs. The values in the list depend on the DB engine being used. For more information, see Publishing Database Logs to Amazon CloudWatch Logs in the Amazon RDS User Guide. This setting doesn't apply to RDS Custom.
     */
    EnableCloudwatchLogsExports?: LogTypeList;
    /**
     * The number of CPU cores and the number of threads per core for the DB instance class of the DB instance. This setting doesn't apply to RDS Custom.
     */
    ProcessorFeatures?: ProcessorFeatureList;
    /**
     * Specifies whether the DB instance class of the DB instance uses its default processor features. This setting doesn't apply to RDS Custom.
     */
    UseDefaultProcessorFeatures?: BooleanOptional;
    /**
     * The name of the DB parameter group to associate with this DB instance. If you don't specify a value for DBParameterGroupName, then RDS uses the default DBParameterGroup for the specified DB engine. This setting doesn't apply to RDS Custom. Constraints:   If supplied, must match the name of an existing DBParameterGroup.   Must be 1 to 255 letters, numbers, or hyphens.   First character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.  
     */
    DBParameterGroupName?: String;
    /**
     * Specifies whether to enable deletion protection for the DB instance. The database can't be deleted when deletion protection is enabled. By default, deletion protection isn't enabled. For more information, see  Deleting a DB Instance.
     */
    DeletionProtection?: BooleanOptional;
    /**
     * Specifies whether to enable a customer-owned IP address (CoIP) for an RDS on Outposts DB instance. A CoIP provides local or external connectivity to resources in your Outpost subnets through your on-premises network. For some use cases, a CoIP can provide lower latency for connections to the DB instance from outside of its virtual private cloud (VPC) on your local network. This setting doesn't apply to RDS Custom. For more information about RDS on Outposts, see Working with Amazon RDS on Amazon Web Services Outposts in the Amazon RDS User Guide. For more information about CoIPs, see Customer-owned IP addresses in the Amazon Web Services Outposts User Guide.
     */
    EnableCustomerOwnedIp?: BooleanOptional;
    /**
     * The instance profile associated with the underlying Amazon EC2 instance of an RDS Custom DB instance. The instance profile must meet the following requirements:   The profile must exist in your account.   The profile must have an IAM role that Amazon EC2 has permissions to assume.   The instance profile name and the associated IAM role name must start with the prefix AWSRDSCustom.   For the list of permissions required for the IAM role, see  Configure IAM and your VPC in the Amazon RDS User Guide. This setting is required for RDS Custom.
     */
    CustomIamInstanceProfile?: String;
    /**
     * Specifies where automated backups and manual snapshots are stored for the restored DB instance. Possible values are outposts (Amazon Web Services Outposts) and region (Amazon Web Services Region). The default is region. For more information, see Working with Amazon RDS on Amazon Web Services Outposts in the Amazon RDS User Guide.
     */
    BackupTarget?: String;
    /**
     * The network type of the DB instance. Valid Values:    IPV4     DUAL    The network type is determined by the DBSubnetGroup specified for the DB instance. A DBSubnetGroup can support only the IPv4 protocol or the IPv4 and the IPv6 protocols (DUAL). For more information, see  Working with a DB instance in a VPC in the Amazon RDS User Guide. 
     */
    NetworkType?: String;
    /**
     * Specifies the storage throughput value for the DB instance. This setting doesn't apply to RDS Custom or Amazon Aurora.
     */
    StorageThroughput?: IntegerOptional;
    /**
     * The identifier for the RDS for MySQL Multi-AZ DB cluster snapshot to restore from. For more information on Multi-AZ DB clusters, see  Multi-AZ DB cluster deployments in the Amazon RDS User Guide. Constraints:   Must match the identifier of an existing Multi-AZ DB cluster snapshot.   Can't be specified when DBSnapshotIdentifier is specified.   Must be specified when DBSnapshotIdentifier isn't specified.   If you are restoring from a shared manual Multi-AZ DB cluster snapshot, the DBClusterSnapshotIdentifier must be the ARN of the shared snapshot.   Can't be the identifier of an Aurora DB cluster snapshot.   Can't be the identifier of an RDS for PostgreSQL Multi-AZ DB cluster snapshot.  
     */
    DBClusterSnapshotIdentifier?: String;
    /**
     * The amount of storage (in gibibytes) to allocate initially for the DB instance. Follow the allocation rules specified in CreateDBInstance.  Be sure to allocate enough storage for your new DB instance so that the restore operation can succeed. You can also allocate additional storage for future growth. 
     */
    AllocatedStorage?: IntegerOptional;
    /**
     * Specifies whether to enable a dedicated log volume (DLV) for the DB instance.
     */
    DedicatedLogVolume?: BooleanOptional;
  }
  export interface RestoreDBInstanceFromDBSnapshotResult {
    DBInstance?: DBInstance;
  }
  export interface RestoreDBInstanceFromS3Message {
    /**
     * The name of the database to create when the DB instance is created. Follow the naming rules specified in CreateDBInstance.
     */
    DBName?: String;
    /**
     * The DB instance identifier. This parameter is stored as a lowercase string. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   First character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.   Example: mydbinstance 
     */
    DBInstanceIdentifier: String;
    /**
     * The amount of storage (in gibibytes) to allocate initially for the DB instance. Follow the allocation rules specified in CreateDBInstance.  Be sure to allocate enough storage for your new DB instance so that the restore operation can succeed. You can also allocate additional storage for future growth. 
     */
    AllocatedStorage?: IntegerOptional;
    /**
     * The compute and memory capacity of the DB instance, for example db.m4.large. Not all DB instance classes are available in all Amazon Web Services Regions, or for all database engines. For the full list of DB instance classes, and availability for your engine, see DB Instance Class in the Amazon RDS User Guide.  Importing from Amazon S3 isn't supported on the db.t2.micro DB instance class.
     */
    DBInstanceClass: String;
    /**
     * The name of the database engine to be used for this instance. Valid Values: mysql 
     */
    Engine: String;
    /**
     * The name for the master user. Constraints:   Must be 1 to 16 letters or numbers.   First character must be a letter.   Can't be a reserved word for the chosen database engine.  
     */
    MasterUsername?: String;
    /**
     * The password for the master user. The password can include any printable ASCII character except "/", """, or "@". Constraints: Can't be specified if ManageMasterUserPassword is turned on.  MariaDB  Constraints: Must contain from 8 to 41 characters.  Microsoft SQL Server  Constraints: Must contain from 8 to 128 characters.  MySQL  Constraints: Must contain from 8 to 41 characters.  Oracle  Constraints: Must contain from 8 to 30 characters.  PostgreSQL  Constraints: Must contain from 8 to 128 characters.
     */
    MasterUserPassword?: String;
    /**
     * A list of DB security groups to associate with this DB instance. Default: The default DB security group for the database engine.
     */
    DBSecurityGroups?: DBSecurityGroupNameList;
    /**
     * A list of VPC security groups to associate with this DB instance.
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * The Availability Zone that the DB instance is created in. For information about Amazon Web Services Regions and Availability Zones, see Regions and Availability Zones in the Amazon RDS User Guide.  Default: A random, system-chosen Availability Zone in the endpoint's Amazon Web Services Region. Example: us-east-1d  Constraint: The AvailabilityZone parameter can't be specified if the DB instance is a Multi-AZ deployment. The specified Availability Zone must be in the same Amazon Web Services Region as the current endpoint.
     */
    AvailabilityZone?: String;
    /**
     * A DB subnet group to associate with this DB instance. Constraints: If supplied, must match the name of an existing DBSubnetGroup. Example: mydbsubnetgroup 
     */
    DBSubnetGroupName?: String;
    /**
     * The time range each week during which system maintenance can occur, in Universal Coordinated Time (UTC). For more information, see Amazon RDS Maintenance Window in the Amazon RDS User Guide.  Constraints:   Must be in the format ddd:hh24:mi-ddd:hh24:mi.   Valid Days: Mon, Tue, Wed, Thu, Fri, Sat, Sun.   Must be in Universal Coordinated Time (UTC).   Must not conflict with the preferred backup window.   Must be at least 30 minutes.  
     */
    PreferredMaintenanceWindow?: String;
    /**
     * The name of the DB parameter group to associate with this DB instance. If you do not specify a value for DBParameterGroupName, then the default DBParameterGroup for the specified DB engine is used.
     */
    DBParameterGroupName?: String;
    /**
     * The number of days for which automated backups are retained. Setting this parameter to a positive number enables backups. For more information, see CreateDBInstance.
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * The time range each day during which automated backups are created if automated backups are enabled. For more information, see Backup window in the Amazon RDS User Guide.  Constraints:   Must be in the format hh24:mi-hh24:mi.   Must be in Universal Coordinated Time (UTC).   Must not conflict with the preferred maintenance window.   Must be at least 30 minutes.  
     */
    PreferredBackupWindow?: String;
    /**
     * The port number on which the database accepts connections. Type: Integer Valid Values: 1150-65535  Default: 3306 
     */
    Port?: IntegerOptional;
    /**
     * Specifies whether the DB instance is a Multi-AZ deployment. If the DB instance is a Multi-AZ deployment, you can't set the AvailabilityZone parameter.
     */
    MultiAZ?: BooleanOptional;
    /**
     * The version number of the database engine to use. Choose the latest minor version of your database engine. For information about engine versions, see CreateDBInstance, or call DescribeDBEngineVersions.
     */
    EngineVersion?: String;
    /**
     * Specifies whether to automatically apply minor engine upgrades to the DB instance during the maintenance window. By default, minor engine upgrades are not applied automatically.
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
    /**
     * The license model for this DB instance. Use general-public-license.
     */
    LicenseModel?: String;
    /**
     * The amount of Provisioned IOPS (input/output operations per second) to allocate initially for the DB instance. For information about valid IOPS values, see Amazon RDS Provisioned IOPS storage in the Amazon RDS User Guide. 
     */
    Iops?: IntegerOptional;
    /**
     * The name of the option group to associate with this DB instance. If this argument is omitted, the default option group for the specified engine is used.
     */
    OptionGroupName?: String;
    /**
     * Specifies whether the DB instance is publicly accessible. When the DB instance is publicly accessible, its Domain Name System (DNS) endpoint resolves to the private IP address from within the DB instance's virtual private cloud (VPC). It resolves to the public IP address from outside of the DB instance's VPC. Access to the DB instance is ultimately controlled by the security group it uses. That public access is not permitted if the security group assigned to the DB instance doesn't permit it. When the DB instance isn't publicly accessible, it is an internal DB instance with a DNS name that resolves to a private IP address. For more information, see CreateDBInstance.
     */
    PubliclyAccessible?: BooleanOptional;
    /**
     * A list of tags to associate with this DB instance. For more information, see Tagging Amazon RDS Resources in the Amazon RDS User Guide. 
     */
    Tags?: TagList;
    /**
     * Specifies the storage type to be associated with the DB instance. Valid Values: gp2 | gp3 | io1 | standard  If you specify io1 or gp3, you must also include a value for the Iops parameter. Default: io1 if the Iops parameter is specified; otherwise gp2 
     */
    StorageType?: String;
    /**
     * Specifies whether the new DB instance is encrypted or not.
     */
    StorageEncrypted?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier for an encrypted DB instance. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. To use a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN. If the StorageEncrypted parameter is enabled, and you do not specify a value for the KmsKeyId parameter, then Amazon RDS will use your default KMS key. There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region.
     */
    KmsKeyId?: String;
    /**
     * Specifies whether to copy all tags from the DB instance to snapshots of the DB instance. By default, tags are not copied.
     */
    CopyTagsToSnapshot?: BooleanOptional;
    /**
     * The interval, in seconds, between points when Enhanced Monitoring metrics are collected for the DB instance. To disable collecting Enhanced Monitoring metrics, specify 0. If MonitoringRoleArn is specified, then you must also set MonitoringInterval to a value other than 0. Valid Values: 0, 1, 5, 10, 15, 30, 60 Default: 0 
     */
    MonitoringInterval?: IntegerOptional;
    /**
     * The ARN for the IAM role that permits RDS to send enhanced monitoring metrics to Amazon CloudWatch Logs. For example, arn:aws:iam:123456789012:role/emaccess. For information on creating a monitoring role, see Setting Up and Enabling Enhanced Monitoring in the Amazon RDS User Guide.  If MonitoringInterval is set to a value other than 0, then you must supply a MonitoringRoleArn value.
     */
    MonitoringRoleArn?: String;
    /**
     * Specifies whether to enable mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts. By default, mapping isn't enabled. For more information about IAM database authentication, see  IAM Database Authentication for MySQL and PostgreSQL in the Amazon RDS User Guide. 
     */
    EnableIAMDatabaseAuthentication?: BooleanOptional;
    /**
     * The name of the engine of your source database. Valid Values: mysql 
     */
    SourceEngine: String;
    /**
     * The version of the database that the backup files were created from. MySQL versions 5.6 and 5.7 are supported. Example: 5.6.40 
     */
    SourceEngineVersion: String;
    /**
     * The name of your Amazon S3 bucket that contains your database backup file.
     */
    S3BucketName: String;
    /**
     * The prefix of your Amazon S3 bucket.
     */
    S3Prefix?: String;
    /**
     * An Amazon Web Services Identity and Access Management (IAM) role to allow Amazon RDS to access your Amazon S3 bucket.
     */
    S3IngestionRoleArn: String;
    /**
     * Specifies whether to enable Performance Insights for the DB instance. For more information, see Using Amazon Performance Insights in the Amazon RDS User Guide.
     */
    EnablePerformanceInsights?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier for encryption of Performance Insights data. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. If you do not specify a value for PerformanceInsightsKMSKeyId, then Amazon RDS uses your default KMS key. There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region.
     */
    PerformanceInsightsKMSKeyId?: String;
    /**
     * The number of days to retain Performance Insights data. The default is 7 days. The following values are valid:   7    month * 31, where month is a number of months from 1-23   731   For example, the following values are valid:   93 (3 months * 31)   341 (11 months * 31)   589 (19 months * 31)   731   If you specify a retention period such as 94, which isn't a valid value, RDS issues an error.
     */
    PerformanceInsightsRetentionPeriod?: IntegerOptional;
    /**
     * The list of logs that the restored DB instance is to export to CloudWatch Logs. The values in the list depend on the DB engine being used. For more information, see Publishing Database Logs to Amazon CloudWatch Logs in the Amazon RDS User Guide.
     */
    EnableCloudwatchLogsExports?: LogTypeList;
    /**
     * The number of CPU cores and the number of threads per core for the DB instance class of the DB instance.
     */
    ProcessorFeatures?: ProcessorFeatureList;
    /**
     * Specifies whether the DB instance class of the DB instance uses its default processor features.
     */
    UseDefaultProcessorFeatures?: BooleanOptional;
    /**
     * Specifies whether to enable deletion protection for the DB instance. The database can't be deleted when deletion protection is enabled. By default, deletion protection isn't enabled. For more information, see  Deleting a DB Instance.
     */
    DeletionProtection?: BooleanOptional;
    /**
     * The upper limit in gibibytes (GiB) to which Amazon RDS can automatically scale the storage of the DB instance. For more information about this setting, including limitations that apply to it, see  Managing capacity automatically with Amazon RDS storage autoscaling in the Amazon RDS User Guide.
     */
    MaxAllocatedStorage?: IntegerOptional;
    /**
     * The network type of the DB instance. Valid Values:    IPV4     DUAL    The network type is determined by the DBSubnetGroup specified for the DB instance. A DBSubnetGroup can support only the IPv4 protocol or the IPv4 and the IPv6 protocols (DUAL). For more information, see  Working with a DB instance in a VPC in the Amazon RDS User Guide. 
     */
    NetworkType?: String;
    /**
     * Specifies the storage throughput value for the DB instance. This setting doesn't apply to RDS Custom or Amazon Aurora.
     */
    StorageThroughput?: IntegerOptional;
    /**
     * Specifies whether to manage the master user password with Amazon Web Services Secrets Manager. For more information, see Password management with Amazon Web Services Secrets Manager in the Amazon RDS User Guide.  Constraints:   Can't manage the master user password with Amazon Web Services Secrets Manager if MasterUserPassword is specified.  
     */
    ManageMasterUserPassword?: BooleanOptional;
    /**
     * The Amazon Web Services KMS key identifier to encrypt a secret that is automatically generated and managed in Amazon Web Services Secrets Manager. This setting is valid only if the master user password is managed by RDS in Amazon Web Services Secrets Manager for the DB instance. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. To use a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN. If you don't specify MasterUserSecretKmsKeyId, then the aws/secretsmanager KMS key is used to encrypt the secret. If the secret is in a different Amazon Web Services account, then you can't use the aws/secretsmanager KMS key to encrypt the secret, and you must use a customer managed KMS key. There is a default KMS key for your Amazon Web Services account. Your Amazon Web Services account has a different default KMS key for each Amazon Web Services Region.
     */
    MasterUserSecretKmsKeyId?: String;
    /**
     * Specifies whether to enable a dedicated log volume (DLV) for the DB instance.
     */
    DedicatedLogVolume?: BooleanOptional;
  }
  export interface RestoreDBInstanceFromS3Result {
    DBInstance?: DBInstance;
  }
  export interface RestoreDBInstanceToPointInTimeMessage {
    /**
     * The identifier of the source DB instance from which to restore. Constraints:   Must match the identifier of an existing DB instance.  
     */
    SourceDBInstanceIdentifier?: String;
    /**
     * The name of the new DB instance to create. Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   First character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.  
     */
    TargetDBInstanceIdentifier: String;
    /**
     * The date and time to restore from. Constraints:   Must be a time in Universal Coordinated Time (UTC) format.   Must be before the latest restorable time for the DB instance.   Can't be specified if the UseLatestRestorableTime parameter is enabled.   Example: 2009-09-07T23:45:00Z 
     */
    RestoreTime?: TStamp;
    /**
     * Specifies whether the DB instance is restored from the latest backup time. By default, the DB instance isn't restored from the latest backup time. Constraints:   Can't be specified if the RestoreTime parameter is provided.  
     */
    UseLatestRestorableTime?: Boolean;
    /**
     * The compute and memory capacity of the Amazon RDS DB instance, for example db.m4.large. Not all DB instance classes are available in all Amazon Web Services Regions, or for all database engines. For the full list of DB instance classes, and availability for your engine, see DB Instance Class in the Amazon RDS User Guide. Default: The same DB instance class as the original DB instance.
     */
    DBInstanceClass?: String;
    /**
     * The port number on which the database accepts connections. Default: The same port as the original DB instance. Constraints:   The value must be 1150-65535.  
     */
    Port?: IntegerOptional;
    /**
     * The Availability Zone (AZ) where the DB instance will be created. Default: A random, system-chosen Availability Zone. Constraints:   You can't specify the AvailabilityZone parameter if the DB instance is a Multi-AZ deployment.   Example: us-east-1a 
     */
    AvailabilityZone?: String;
    /**
     * The DB subnet group name to use for the new instance. Constraints:   If supplied, must match the name of an existing DB subnet group.   Example: mydbsubnetgroup 
     */
    DBSubnetGroupName?: String;
    /**
     * Secifies whether the DB instance is a Multi-AZ deployment. This setting doesn't apply to RDS Custom. Constraints:   You can't specify the AvailabilityZone parameter if the DB instance is a Multi-AZ deployment.  
     */
    MultiAZ?: BooleanOptional;
    /**
     * Specifies whether the DB instance is publicly accessible. When the DB cluster is publicly accessible, its Domain Name System (DNS) endpoint resolves to the private IP address from within the DB cluster's virtual private cloud (VPC). It resolves to the public IP address from outside of the DB cluster's VPC. Access to the DB cluster is ultimately controlled by the security group it uses. That public access isn't permitted if the security group assigned to the DB cluster doesn't permit it. When the DB instance isn't publicly accessible, it is an internal DB instance with a DNS name that resolves to a private IP address. For more information, see CreateDBInstance.
     */
    PubliclyAccessible?: BooleanOptional;
    /**
     * Specifies whether minor version upgrades are applied automatically to the DB instance during the maintenance window. This setting doesn't apply to RDS Custom.
     */
    AutoMinorVersionUpgrade?: BooleanOptional;
    /**
     * The license model information for the restored DB instance. This setting doesn't apply to RDS Custom. Valid Values: license-included | bring-your-own-license | general-public-license  Default: Same as the source.
     */
    LicenseModel?: String;
    /**
     * The database name for the restored DB instance.  This parameter isn't supported for the MySQL or MariaDB engines. It also doesn't apply to RDS Custom. 
     */
    DBName?: String;
    /**
     * The database engine to use for the new instance. This setting doesn't apply to RDS Custom. Valid Values:    mariadb     mysql     oracle-ee     oracle-ee-cdb     oracle-se2     oracle-se2-cdb     postgres     sqlserver-ee     sqlserver-se     sqlserver-ex     sqlserver-web    Default: The same as source Constraints:   Must be compatible with the engine of the source.  
     */
    Engine?: String;
    /**
     * The amount of Provisioned IOPS (input/output operations per second) to initially allocate for the DB instance. This setting doesn't apply to SQL Server. Constraints:   Must be an integer greater than 1000.  
     */
    Iops?: IntegerOptional;
    /**
     * The name of the option group to use for the restored DB instance. Permanent options, such as the TDE option for Oracle Advanced Security TDE, can't be removed from an option group, and that option group can't be removed from a DB instance after it is associated with a DB instance This setting doesn't apply to RDS Custom.
     */
    OptionGroupName?: String;
    /**
     * Specifies whether to copy all tags from the restored DB instance to snapshots of the DB instance. By default, tags are not copied.
     */
    CopyTagsToSnapshot?: BooleanOptional;
    Tags?: TagList;
    /**
     * The storage type to associate with the DB instance. Valid Values: gp2 | gp3 | io1 | standard  Default: io1, if the Iops parameter is specified. Otherwise, gp2. Constraints:   If you specify io1 or gp3, you must also include a value for the Iops parameter.  
     */
    StorageType?: String;
    /**
     * The ARN from the key store with which to associate the instance for TDE encryption. This setting doesn't apply to RDS Custom.
     */
    TdeCredentialArn?: String;
    /**
     * The password for the given ARN from the key store in order to access the device. This setting doesn't apply to RDS Custom.
     */
    TdeCredentialPassword?: String;
    /**
     * A list of EC2 VPC security groups to associate with this DB instance. Default: The default EC2 VPC security group for the DB subnet group's VPC.
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * The Active Directory directory ID to restore the DB instance in. Create the domain before running this command. Currently, you can create only the MySQL, Microsoft SQL Server, Oracle, and PostgreSQL DB instances in an Active Directory Domain. This setting doesn't apply to RDS Custom. For more information, see  Kerberos Authentication in the Amazon RDS User Guide.
     */
    Domain?: String;
    /**
     * The name of the IAM role to use when making API calls to the Directory Service. This setting doesn't apply to RDS Custom DB instances.
     */
    DomainIAMRoleName?: String;
    /**
     * The fully qualified domain name (FQDN) of an Active Directory domain. Constraints:   Can't be longer than 64 characters.   Example: mymanagedADtest.mymanagedAD.mydomain 
     */
    DomainFqdn?: String;
    /**
     * The Active Directory organizational unit for your DB instance to join. Constraints:   Must be in the distinguished name format.   Can't be longer than 64 characters.   Example: OU=mymanagedADtestOU,DC=mymanagedADtest,DC=mymanagedAD,DC=mydomain 
     */
    DomainOu?: String;
    /**
     * The ARN for the Secrets Manager secret with the credentials for the user joining the domain. Constraints:   Can't be longer than 64 characters.   Example: arn:aws:secretsmanager:region:account-number:secret:myselfmanagedADtestsecret-123456 
     */
    DomainAuthSecretArn?: String;
    /**
     * The IPv4 DNS IP addresses of your primary and secondary Active Directory domain controllers. Constraints:   Two IP addresses must be provided. If there isn't a secondary domain controller, use the IP address of the primary domain controller for both entries in the list.   Example: 123.124.125.126,234.235.236.237 
     */
    DomainDnsIps?: StringList;
    /**
     * Specifies whether to enable mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts. By default, mapping isn't enabled. This setting doesn't apply to RDS Custom. For more information about IAM database authentication, see  IAM Database Authentication for MySQL and PostgreSQL in the Amazon RDS User Guide. 
     */
    EnableIAMDatabaseAuthentication?: BooleanOptional;
    /**
     * The list of logs that the restored DB instance is to export to CloudWatch Logs. The values in the list depend on the DB engine being used. For more information, see Publishing Database Logs to Amazon CloudWatch Logs in the Amazon RDS User Guide. This setting doesn't apply to RDS Custom.
     */
    EnableCloudwatchLogsExports?: LogTypeList;
    /**
     * The number of CPU cores and the number of threads per core for the DB instance class of the DB instance. This setting doesn't apply to RDS Custom.
     */
    ProcessorFeatures?: ProcessorFeatureList;
    /**
     * Specifies whether the DB instance class of the DB instance uses its default processor features. This setting doesn't apply to RDS Custom.
     */
    UseDefaultProcessorFeatures?: BooleanOptional;
    /**
     * The name of the DB parameter group to associate with this DB instance. If you do not specify a value for DBParameterGroupName, then the default DBParameterGroup for the specified DB engine is used. This setting doesn't apply to RDS Custom. Constraints:   If supplied, must match the name of an existing DB parameter group.   Must be 1 to 255 letters, numbers, or hyphens.   First character must be a letter.   Can't end with a hyphen or contain two consecutive hyphens.  
     */
    DBParameterGroupName?: String;
    /**
     * Specifies whether the DB instance has deletion protection enabled. The database can't be deleted when deletion protection is enabled. By default, deletion protection isn't enabled. For more information, see  Deleting a DB Instance.
     */
    DeletionProtection?: BooleanOptional;
    /**
     * The resource ID of the source DB instance from which to restore.
     */
    SourceDbiResourceId?: String;
    /**
     * The upper limit in gibibytes (GiB) to which Amazon RDS can automatically scale the storage of the DB instance. For more information about this setting, including limitations that apply to it, see  Managing capacity automatically with Amazon RDS storage autoscaling in the Amazon RDS User Guide. This setting doesn't apply to RDS Custom.
     */
    MaxAllocatedStorage?: IntegerOptional;
    /**
     * The Amazon Resource Name (ARN) of the replicated automated backups from which to restore, for example, arn:aws:rds:us-east-1:123456789012:auto-backup:ab-L2IJCEXJP7XQ7HOJ4SIEXAMPLE. This setting doesn't apply to RDS Custom.
     */
    SourceDBInstanceAutomatedBackupsArn?: String;
    /**
     * Specifies whether to enable a customer-owned IP address (CoIP) for an RDS on Outposts DB instance. A CoIP provides local or external connectivity to resources in your Outpost subnets through your on-premises network. For some use cases, a CoIP can provide lower latency for connections to the DB instance from outside of its virtual private cloud (VPC) on your local network. This setting doesn't apply to RDS Custom. For more information about RDS on Outposts, see Working with Amazon RDS on Amazon Web Services Outposts in the Amazon RDS User Guide. For more information about CoIPs, see Customer-owned IP addresses in the Amazon Web Services Outposts User Guide.
     */
    EnableCustomerOwnedIp?: BooleanOptional;
    /**
     * The instance profile associated with the underlying Amazon EC2 instance of an RDS Custom DB instance. The instance profile must meet the following requirements:   The profile must exist in your account.   The profile must have an IAM role that Amazon EC2 has permissions to assume.   The instance profile name and the associated IAM role name must start with the prefix AWSRDSCustom.   For the list of permissions required for the IAM role, see  Configure IAM and your VPC in the Amazon RDS User Guide. This setting is required for RDS Custom.
     */
    CustomIamInstanceProfile?: String;
    /**
     * Specifies where automated backups and manual snapshots are stored for the restored DB instance. Possible values are outposts (Amazon Web Services Outposts) and region (Amazon Web Services Region). The default is region. For more information, see Working with Amazon RDS on Amazon Web Services Outposts in the Amazon RDS User Guide.
     */
    BackupTarget?: String;
    /**
     * The network type of the DB instance. The network type is determined by the DBSubnetGroup specified for the DB instance. A DBSubnetGroup can support only the IPv4 protocol or the IPv4 and the IPv6 protocols (DUAL). For more information, see  Working with a DB instance in a VPC in the Amazon RDS User Guide.  Valid Values:    IPV4     DUAL   
     */
    NetworkType?: String;
    /**
     * The storage throughput value for the DB instance. This setting doesn't apply to RDS Custom or Amazon Aurora.
     */
    StorageThroughput?: IntegerOptional;
    /**
     * The amount of storage (in gibibytes) to allocate initially for the DB instance. Follow the allocation rules specified in CreateDBInstance.  Be sure to allocate enough storage for your new DB instance so that the restore operation can succeed. You can also allocate additional storage for future growth. 
     */
    AllocatedStorage?: IntegerOptional;
    /**
     * Specifies whether to enable a dedicated log volume (DLV) for the DB instance.
     */
    DedicatedLogVolume?: BooleanOptional;
  }
  export interface RestoreDBInstanceToPointInTimeResult {
    DBInstance?: DBInstance;
  }
  export interface RestoreWindow {
    /**
     * The earliest time you can restore an instance to.
     */
    EarliestTime?: TStamp;
    /**
     * The latest time you can restore an instance to.
     */
    LatestTime?: TStamp;
  }
  export interface RevokeDBSecurityGroupIngressMessage {
    /**
     * The name of the DB security group to revoke ingress from.
     */
    DBSecurityGroupName: String;
    /**
     * The IP range to revoke access from. Must be a valid CIDR range. If CIDRIP is specified, EC2SecurityGroupName, EC2SecurityGroupId and EC2SecurityGroupOwnerId can't be provided.
     */
    CIDRIP?: String;
    /**
     * The name of the EC2 security group to revoke access from. For VPC DB security groups, EC2SecurityGroupId must be provided. Otherwise, EC2SecurityGroupOwnerId and either EC2SecurityGroupName or EC2SecurityGroupId must be provided.
     */
    EC2SecurityGroupName?: String;
    /**
     * The id of the EC2 security group to revoke access from. For VPC DB security groups, EC2SecurityGroupId must be provided. Otherwise, EC2SecurityGroupOwnerId and either EC2SecurityGroupName or EC2SecurityGroupId must be provided.
     */
    EC2SecurityGroupId?: String;
    /**
     * The Amazon Web Services account number of the owner of the EC2 security group specified in the EC2SecurityGroupName parameter. The Amazon Web Services access key ID isn't an acceptable value. For VPC DB security groups, EC2SecurityGroupId must be provided. Otherwise, EC2SecurityGroupOwnerId and either EC2SecurityGroupName or EC2SecurityGroupId must be provided.
     */
    EC2SecurityGroupOwnerId?: String;
  }
  export interface RevokeDBSecurityGroupIngressResult {
    DBSecurityGroup?: DBSecurityGroup;
  }
  export interface ScalingConfiguration {
    /**
     * The minimum capacity for an Aurora DB cluster in serverless DB engine mode. For Aurora MySQL, valid capacity values are 1, 2, 4, 8, 16, 32, 64, 128, and 256. For Aurora PostgreSQL, valid capacity values are 2, 4, 8, 16, 32, 64, 192, and 384. The minimum capacity must be less than or equal to the maximum capacity.
     */
    MinCapacity?: IntegerOptional;
    /**
     * The maximum capacity for an Aurora DB cluster in serverless DB engine mode. For Aurora MySQL, valid capacity values are 1, 2, 4, 8, 16, 32, 64, 128, and 256. For Aurora PostgreSQL, valid capacity values are 2, 4, 8, 16, 32, 64, 192, and 384. The maximum capacity must be greater than or equal to the minimum capacity.
     */
    MaxCapacity?: IntegerOptional;
    /**
     * Indicates whether to allow or disallow automatic pause for an Aurora DB cluster in serverless DB engine mode. A DB cluster can be paused only when it's idle (it has no connections).  If a DB cluster is paused for more than seven days, the DB cluster might be backed up with a snapshot. In this case, the DB cluster is restored when there is a request to connect to it. 
     */
    AutoPause?: BooleanOptional;
    /**
     * The time, in seconds, before an Aurora DB cluster in serverless mode is paused. Specify a value between 300 and 86,400 seconds.
     */
    SecondsUntilAutoPause?: IntegerOptional;
    /**
     * The action to take when the timeout is reached, either ForceApplyCapacityChange or RollbackCapacityChange.  ForceApplyCapacityChange sets the capacity to the specified value as soon as possible.  RollbackCapacityChange, the default, ignores the capacity change if a scaling point isn't found in the timeout period.  If you specify ForceApplyCapacityChange, connections that prevent Aurora Serverless v1 from finding a scaling point might be dropped.  For more information, see  Autoscaling for Aurora Serverless v1 in the Amazon Aurora User Guide.
     */
    TimeoutAction?: String;
    /**
     * The amount of time, in seconds, that Aurora Serverless v1 tries to find a scaling point to perform seamless scaling before enforcing the timeout action. The default is 300. Specify a value between 60 and 600 seconds.
     */
    SecondsBeforeTimeout?: IntegerOptional;
  }
  export interface ScalingConfigurationInfo {
    /**
     * The minimum capacity for an Aurora DB cluster in serverless DB engine mode.
     */
    MinCapacity?: IntegerOptional;
    /**
     * The maximum capacity for an Aurora DB cluster in serverless DB engine mode.
     */
    MaxCapacity?: IntegerOptional;
    /**
     * Indicates whether automatic pause is allowed for the Aurora DB cluster in serverless DB engine mode. When the value is set to false for an Aurora Serverless v1 DB cluster, the DB cluster automatically resumes.
     */
    AutoPause?: BooleanOptional;
    /**
     * The remaining amount of time, in seconds, before the Aurora DB cluster in serverless mode is paused. A DB cluster can be paused only when it's idle (it has no connections).
     */
    SecondsUntilAutoPause?: IntegerOptional;
    /**
     * The action that occurs when Aurora times out while attempting to change the capacity of an Aurora Serverless v1 cluster. The value is either ForceApplyCapacityChange or RollbackCapacityChange.  ForceApplyCapacityChange, the default, sets the capacity to the specified value as soon as possible.  RollbackCapacityChange ignores the capacity change if a scaling point isn't found in the timeout period.
     */
    TimeoutAction?: String;
    /**
     * The number of seconds before scaling times out. What happens when an attempted scaling action times out is determined by the TimeoutAction setting.
     */
    SecondsBeforeTimeout?: IntegerOptional;
  }
  export interface ServerlessV2ScalingConfiguration {
    /**
     * The minimum number of Aurora capacity units (ACUs) for a DB instance in an Aurora Serverless v2 cluster. You can specify ACU values in half-step increments, such as 8, 8.5, 9, and so on. The smallest value that you can use is 0.5.
     */
    MinCapacity?: DoubleOptional;
    /**
     * The maximum number of Aurora capacity units (ACUs) for a DB instance in an Aurora Serverless v2 cluster. You can specify ACU values in half-step increments, such as 40, 40.5, 41, and so on. The largest value that you can use is 128.
     */
    MaxCapacity?: DoubleOptional;
  }
  export interface ServerlessV2ScalingConfigurationInfo {
    /**
     * The minimum number of Aurora capacity units (ACUs) for a DB instance in an Aurora Serverless v2 cluster. You can specify ACU values in half-step increments, such as 8, 8.5, 9, and so on. The smallest value that you can use is 0.5.
     */
    MinCapacity?: DoubleOptional;
    /**
     * The maximum number of Aurora capacity units (ACUs) for a DB instance in an Aurora Serverless v2 cluster. You can specify ACU values in half-step increments, such as 40, 40.5, 41, and so on. The largest value that you can use is 128.
     */
    MaxCapacity?: DoubleOptional;
  }
  export type SourceIdsList = String[];
  export interface SourceRegion {
    /**
     * The name of the source Amazon Web Services Region.
     */
    RegionName?: String;
    /**
     * The endpoint for the source Amazon Web Services Region endpoint.
     */
    Endpoint?: String;
    /**
     * The status of the source Amazon Web Services Region.
     */
    Status?: String;
    /**
     * Indicates whether the source Amazon Web Services Region supports replicating automated backups to the current Amazon Web Services Region.
     */
    SupportsDBInstanceAutomatedBackupsReplication?: Boolean;
  }
  export type SourceRegionList = SourceRegion[];
  export interface SourceRegionMessage {
    /**
     * An optional pagination token provided by a previous request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by MaxRecords.
     */
    Marker?: String;
    /**
     * A list of SourceRegion instances that contains each source Amazon Web Services Region that the current Amazon Web Services Region can get a read replica or a DB snapshot from.
     */
    SourceRegions?: SourceRegionList;
  }
  export type SourceType = "db-instance"|"db-parameter-group"|"db-security-group"|"db-snapshot"|"db-cluster"|"db-cluster-snapshot"|"custom-engine-version"|"db-proxy"|"blue-green-deployment"|string;
  export interface StartActivityStreamRequest {
    /**
     * The Amazon Resource Name (ARN) of the DB cluster, for example, arn:aws:rds:us-east-1:12345667890:cluster:das-cluster.
     */
    ResourceArn: String;
    /**
     * Specifies the mode of the database activity stream. Database events such as a change or access generate an activity stream event. The database session can handle these events either synchronously or asynchronously.
     */
    Mode: ActivityStreamMode;
    /**
     * The Amazon Web Services KMS key identifier for encrypting messages in the database activity stream. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key.
     */
    KmsKeyId: String;
    /**
     * Specifies whether or not the database activity stream is to start as soon as possible, regardless of the maintenance window for the database.
     */
    ApplyImmediately?: BooleanOptional;
    /**
     * Specifies whether the database activity stream includes engine-native audit fields. This option applies to an Oracle or Microsoft SQL Server DB instance. By default, no engine-native audit fields are included.
     */
    EngineNativeAuditFieldsIncluded?: BooleanOptional;
  }
  export interface StartActivityStreamResponse {
    /**
     * The Amazon Web Services KMS key identifier for encryption of messages in the database activity stream.
     */
    KmsKeyId?: String;
    /**
     * The name of the Amazon Kinesis data stream to be used for the database activity stream.
     */
    KinesisStreamName?: String;
    /**
     * The status of the database activity stream.
     */
    Status?: ActivityStreamStatus;
    /**
     * The mode of the database activity stream.
     */
    Mode?: ActivityStreamMode;
    /**
     * Indicates whether or not the database activity stream will start as soon as possible, regardless of the maintenance window for the database.
     */
    ApplyImmediately?: Boolean;
    /**
     * Indicates whether engine-native audit fields are included in the database activity stream.
     */
    EngineNativeAuditFieldsIncluded?: BooleanOptional;
  }
  export interface StartDBClusterMessage {
    /**
     * The DB cluster identifier of the Amazon Aurora DB cluster to be started. This parameter is stored as a lowercase string.
     */
    DBClusterIdentifier: String;
  }
  export interface StartDBClusterResult {
    DBCluster?: DBCluster;
  }
  export interface StartDBInstanceAutomatedBackupsReplicationMessage {
    /**
     * The Amazon Resource Name (ARN) of the source DB instance for the replicated automated backups, for example, arn:aws:rds:us-west-2:123456789012:db:mydatabase.
     */
    SourceDBInstanceArn: String;
    /**
     * The retention period for the replicated automated backups.
     */
    BackupRetentionPeriod?: IntegerOptional;
    /**
     * The Amazon Web Services KMS key identifier for encryption of the replicated automated backups. The KMS key ID is the Amazon Resource Name (ARN) for the KMS encryption key in the destination Amazon Web Services Region, for example, arn:aws:kms:us-east-1:123456789012:key/AKIAIOSFODNN7EXAMPLE.
     */
    KmsKeyId?: String;
    /**
     * In an Amazon Web Services GovCloud (US) Region, an URL that contains a Signature Version 4 signed request for the StartDBInstanceAutomatedBackupsReplication operation to call in the Amazon Web Services Region of the source DB instance. The presigned URL must be a valid request for the StartDBInstanceAutomatedBackupsReplication API operation that can run in the Amazon Web Services Region that contains the source DB instance. This setting applies only to Amazon Web Services GovCloud (US) Regions. It's ignored in other Amazon Web Services Regions. To learn how to generate a Signature Version 4 signed request, see  Authenticating Requests: Using Query Parameters (Amazon Web Services Signature Version 4) and  Signature Version 4 Signing Process.  If you are using an Amazon Web Services SDK tool or the CLI, you can specify SourceRegion (or --source-region for the CLI) instead of specifying PreSignedUrl manually. Specifying SourceRegion autogenerates a presigned URL that is a valid request for the operation that can run in the source Amazon Web Services Region. 
     */
    PreSignedUrl?: String;
  }
  export interface StartDBInstanceAutomatedBackupsReplicationResult {
    DBInstanceAutomatedBackup?: DBInstanceAutomatedBackup;
  }
  export interface StartDBInstanceMessage {
    /**
     * The user-supplied instance identifier.
     */
    DBInstanceIdentifier: String;
  }
  export interface StartDBInstanceResult {
    DBInstance?: DBInstance;
  }
  export interface StartExportTaskMessage {
    /**
     * A unique identifier for the export task. This ID isn't an identifier for the Amazon S3 bucket where the data is to be exported.
     */
    ExportTaskIdentifier: String;
    /**
     * The Amazon Resource Name (ARN) of the snapshot or cluster to export to Amazon S3.
     */
    SourceArn: String;
    /**
     * The name of the Amazon S3 bucket to export the snapshot or cluster data to.
     */
    S3BucketName: String;
    /**
     * The name of the IAM role to use for writing to the Amazon S3 bucket when exporting a snapshot or cluster. In the IAM policy attached to your IAM role, include the following required actions to allow the transfer of files from Amazon RDS or Amazon Aurora to an S3 bucket:   s3:PutObject*   s3:GetObject*   s3:ListBucket   s3:DeleteObject*   s3:GetBucketLocation    In the policy, include the resources to identify the S3 bucket and objects in the bucket. The following list of resources shows the Amazon Resource Name (ARN) format for accessing S3:    arn:aws:s3:::your-s3-bucket      arn:aws:s3:::your-s3-bucket/*   
     */
    IamRoleArn: String;
    /**
     * The ID of the Amazon Web Services KMS key to use to encrypt the data exported to Amazon S3. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key. The caller of this operation must be authorized to run the following operations. These can be set in the Amazon Web Services KMS key policy:   kms:Encrypt   kms:Decrypt   kms:GenerateDataKey   kms:GenerateDataKeyWithoutPlaintext   kms:ReEncryptFrom   kms:ReEncryptTo   kms:CreateGrant   kms:DescribeKey   kms:RetireGrant  
     */
    KmsKeyId: String;
    /**
     * The Amazon S3 bucket prefix to use as the file name and path of the exported data.
     */
    S3Prefix?: String;
    /**
     * The data to be exported from the snapshot or cluster. If this parameter isn't provided, all of the data is exported. Valid Values:    database - Export all the data from a specified database.    database.table table-name - Export a table of the snapshot or cluster. This format is valid only for RDS for MySQL, RDS for MariaDB, and Aurora MySQL.    database.schema schema-name - Export a database schema of the snapshot or cluster. This format is valid only for RDS for PostgreSQL and Aurora PostgreSQL.    database.schema.table table-name - Export a table of the database schema. This format is valid only for RDS for PostgreSQL and Aurora PostgreSQL.  
     */
    ExportOnly?: StringList;
  }
  export interface StopActivityStreamRequest {
    /**
     * The Amazon Resource Name (ARN) of the DB cluster for the database activity stream. For example, arn:aws:rds:us-east-1:12345667890:cluster:das-cluster.
     */
    ResourceArn: String;
    /**
     * Specifies whether or not the database activity stream is to stop as soon as possible, regardless of the maintenance window for the database.
     */
    ApplyImmediately?: BooleanOptional;
  }
  export interface StopActivityStreamResponse {
    /**
     * The Amazon Web Services KMS key identifier used for encrypting messages in the database activity stream. The Amazon Web Services KMS key identifier is the key ARN, key ID, alias ARN, or alias name for the KMS key.
     */
    KmsKeyId?: String;
    /**
     * The name of the Amazon Kinesis data stream used for the database activity stream.
     */
    KinesisStreamName?: String;
    /**
     * The status of the database activity stream.
     */
    Status?: ActivityStreamStatus;
  }
  export interface StopDBClusterMessage {
    /**
     * The DB cluster identifier of the Amazon Aurora DB cluster to be stopped. This parameter is stored as a lowercase string.
     */
    DBClusterIdentifier: String;
  }
  export interface StopDBClusterResult {
    DBCluster?: DBCluster;
  }
  export interface StopDBInstanceAutomatedBackupsReplicationMessage {
    /**
     * The Amazon Resource Name (ARN) of the source DB instance for which to stop replicating automate backups, for example, arn:aws:rds:us-west-2:123456789012:db:mydatabase.
     */
    SourceDBInstanceArn: String;
  }
  export interface StopDBInstanceAutomatedBackupsReplicationResult {
    DBInstanceAutomatedBackup?: DBInstanceAutomatedBackup;
  }
  export interface StopDBInstanceMessage {
    /**
     * The user-supplied instance identifier.
     */
    DBInstanceIdentifier: String;
    /**
     * The user-supplied instance identifier of the DB Snapshot created immediately before the DB instance is stopped.
     */
    DBSnapshotIdentifier?: String;
  }
  export interface StopDBInstanceResult {
    DBInstance?: DBInstance;
  }
  export type String = string;
  export type String255 = string;
  export type StringList = String[];
  export interface Subnet {
    /**
     * The identifier of the subnet.
     */
    SubnetIdentifier?: String;
    SubnetAvailabilityZone?: AvailabilityZone;
    /**
     * If the subnet is associated with an Outpost, this value specifies the Outpost. For more information about RDS on Outposts, see Amazon RDS on Amazon Web Services Outposts in the Amazon RDS User Guide. 
     */
    SubnetOutpost?: Outpost;
    /**
     * The status of the subnet.
     */
    SubnetStatus?: String;
  }
  export type SubnetIdentifierList = String[];
  export type SubnetList = Subnet[];
  export type SupportedCharacterSetsList = CharacterSet[];
  export type SupportedTimezonesList = Timezone[];
  export interface SwitchoverBlueGreenDeploymentRequest {
    /**
     * The unique identifier of the blue/green deployment. Constraints:   Must match an existing blue/green deployment identifier.  
     */
    BlueGreenDeploymentIdentifier: BlueGreenDeploymentIdentifier;
    /**
     * The amount of time, in seconds, for the switchover to complete. Default: 300 If the switchover takes longer than the specified duration, then any changes are rolled back, and no changes are made to the environments.
     */
    SwitchoverTimeout?: SwitchoverTimeout;
  }
  export interface SwitchoverBlueGreenDeploymentResponse {
    BlueGreenDeployment?: BlueGreenDeployment;
  }
  export interface SwitchoverDetail {
    /**
     * The Amazon Resource Name (ARN) of a resource in the blue environment.
     */
    SourceMember?: DatabaseArn;
    /**
     * The Amazon Resource Name (ARN) of a resource in the green environment.
     */
    TargetMember?: DatabaseArn;
    /**
     * The switchover status of a resource in a blue/green deployment. Values:    PROVISIONING - The resource is being prepared to switch over.    AVAILABLE - The resource is ready to switch over.    SWITCHOVER_IN_PROGRESS - The resource is being switched over.    SWITCHOVER_COMPLETED - The resource has been switched over.    SWITCHOVER_FAILED - The resource attempted to switch over but failed.    MISSING_SOURCE - The source resource has been deleted.    MISSING_TARGET - The target resource has been deleted.  
     */
    Status?: SwitchoverDetailStatus;
  }
  export type SwitchoverDetailList = SwitchoverDetail[];
  export type SwitchoverDetailStatus = string;
  export interface SwitchoverGlobalClusterMessage {
    /**
     * The identifier of the global database cluster to switch over. This parameter isn't case-sensitive. Constraints:   Must match the identifier of an existing global database cluster (Aurora global database).  
     */
    GlobalClusterIdentifier: GlobalClusterIdentifier;
    /**
     * The identifier of the secondary Aurora DB cluster to promote to the new primary for the global database cluster. Use the Amazon Resource Name (ARN) for the identifier so that Aurora can locate the cluster in its Amazon Web Services Region.
     */
    TargetDbClusterIdentifier: DBClusterIdentifier;
  }
  export interface SwitchoverGlobalClusterResult {
    GlobalCluster?: GlobalCluster;
  }
  export interface SwitchoverReadReplicaMessage {
    /**
     * The DB instance identifier of the current standby database. This value is stored as a lowercase string. Constraints:   Must match the identiﬁer of an existing Oracle read replica DB instance.  
     */
    DBInstanceIdentifier: String;
  }
  export interface SwitchoverReadReplicaResult {
    DBInstance?: DBInstance;
  }
  export type SwitchoverTimeout = number;
  export type TStamp = Date;
  export interface Tag {
    /**
     * A key is the required name of the tag. The string value can be from 1 to 128 Unicode characters in length and can't be prefixed with aws: or rds:. The string can only contain only the set of Unicode letters, digits, white-space, '_', '.', ':', '/', '=', '+', '-', '@' (Java regex: "^([\\p{L}\\p{Z}\\p{N}_.:/=+\\-@]*)$").
     */
    Key?: String;
    /**
     * A value is the optional value of the tag. The string value can be from 1 to 256 Unicode characters in length and can't be prefixed with aws: or rds:. The string can only contain only the set of Unicode letters, digits, white-space, '_', '.', ':', '/', '=', '+', '-', '@' (Java regex: "^([\\p{L}\\p{Z}\\p{N}_.:/=+\\-@]*)$").
     */
    Value?: String;
  }
  export type TagList = Tag[];
  export interface TagListMessage {
    /**
     * List of tags returned by the ListTagsForResource operation.
     */
    TagList?: TagList;
  }
  export type TargetDBClusterParameterGroupName = string;
  export type TargetDBParameterGroupName = string;
  export type TargetEngineVersion = string;
  export type TargetGroupList = DBProxyTargetGroup[];
  export interface TargetHealth {
    /**
     * The current state of the connection health lifecycle for the RDS Proxy target. The following is a typical lifecycle example for the states of an RDS Proxy target:  registering &gt; unavailable &gt; available &gt; unavailable &gt; available 
     */
    State?: TargetState;
    /**
     * The reason for the current health State of the RDS Proxy target.
     */
    Reason?: TargetHealthReason;
    /**
     * A description of the health of the RDS Proxy target. If the State is AVAILABLE, a description is not included.
     */
    Description?: String;
  }
  export type TargetHealthReason = "UNREACHABLE"|"CONNECTION_FAILED"|"AUTH_FAILURE"|"PENDING_PROXY_CAPACITY"|"INVALID_REPLICATION_STATE"|string;
  export type TargetList = DBProxyTarget[];
  export type TargetRole = "READ_WRITE"|"READ_ONLY"|"UNKNOWN"|string;
  export type TargetState = "REGISTERING"|"AVAILABLE"|"UNAVAILABLE"|string;
  export type TargetType = "RDS_INSTANCE"|"RDS_SERVERLESS_ENDPOINT"|"TRACKED_CLUSTER"|string;
  export interface Timezone {
    /**
     * The name of the time zone.
     */
    TimezoneName?: String;
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
     * The version of the database engine that a DB instance can be upgraded to.
     */
    Description?: String;
    /**
     * Indicates whether the target version is applied to any source DB instances that have AutoMinorVersionUpgrade set to true.
     */
    AutoUpgrade?: Boolean;
    /**
     * Indicates whether upgrading to the target version requires upgrading the major version of the database engine.
     */
    IsMajorVersionUpgrade?: Boolean;
    /**
     * A list of the supported DB engine modes for the target engine version.
     */
    SupportedEngineModes?: EngineModeList;
    /**
     * Indicates whether you can use Aurora parallel query with the target engine version.
     */
    SupportsParallelQuery?: BooleanOptional;
    /**
     * Indicates whether you can use Aurora global databases with the target engine version.
     */
    SupportsGlobalDatabases?: BooleanOptional;
    /**
     * Indicates whether you can use Babelfish for Aurora PostgreSQL with the target engine version.
     */
    SupportsBabelfish?: BooleanOptional;
    /**
     * Indicates whether the target engine version supports forwarding write operations from reader DB instances to the writer DB instance in the DB cluster. By default, write operations aren't allowed on reader DB instances. Valid for: Aurora DB clusters only
     */
    SupportsLocalWriteForwarding?: BooleanOptional;
  }
  export interface UserAuthConfig {
    /**
     * A user-specified description about the authentication used by a proxy to log in as a specific database user.
     */
    Description?: String;
    /**
     * The name of the database user to which the proxy connects.
     */
    UserName?: String;
    /**
     * The type of authentication that the proxy uses for connections from the proxy to the underlying database.
     */
    AuthScheme?: AuthScheme;
    /**
     * The Amazon Resource Name (ARN) representing the secret that the proxy uses to authenticate to the RDS DB instance or Aurora DB cluster. These secrets are stored within Amazon Secrets Manager.
     */
    SecretArn?: String;
    /**
     * A value that indicates whether to require or disallow Amazon Web Services Identity and Access Management (IAM) authentication for connections to the proxy. The ENABLED value is valid only for proxies with RDS for Microsoft SQL Server.
     */
    IAMAuth?: IAMAuthMode;
    /**
     * The type of authentication the proxy uses for connections from clients.
     */
    ClientPasswordAuthType?: ClientPasswordAuthType;
  }
  export interface UserAuthConfigInfo {
    /**
     * A user-specified description about the authentication used by a proxy to log in as a specific database user.
     */
    Description?: String;
    /**
     * The name of the database user to which the proxy connects.
     */
    UserName?: String;
    /**
     * The type of authentication that the proxy uses for connections from the proxy to the underlying database.
     */
    AuthScheme?: AuthScheme;
    /**
     * The Amazon Resource Name (ARN) representing the secret that the proxy uses to authenticate to the RDS DB instance or Aurora DB cluster. These secrets are stored within Amazon Secrets Manager.
     */
    SecretArn?: String;
    /**
     * Whether to require or disallow Amazon Web Services Identity and Access Management (IAM) authentication for connections to the proxy. The ENABLED value is valid only for proxies with RDS for Microsoft SQL Server.
     */
    IAMAuth?: IAMAuthMode;
    /**
     * The type of authentication the proxy uses for connections from clients.
     */
    ClientPasswordAuthType?: ClientPasswordAuthType;
  }
  export type UserAuthConfigInfoList = UserAuthConfigInfo[];
  export type UserAuthConfigList = UserAuthConfig[];
  export interface ValidDBInstanceModificationsMessage {
    /**
     * Valid storage options for your DB instance.
     */
    Storage?: ValidStorageOptionsList;
    /**
     * Valid processor features for your DB instance.
     */
    ValidProcessorFeatures?: AvailableProcessorFeatureList;
    /**
     * Indicates whether a DB instance supports using a dedicated log volume (DLV).
     */
    SupportsDedicatedLogVolume?: Boolean;
  }
  export interface ValidStorageOptions {
    /**
     * The valid storage types for your DB instance. For example: gp2, gp3, io1.
     */
    StorageType?: String;
    /**
     * The valid range of storage in gibibytes (GiB). For example, 100 to 16,384.
     */
    StorageSize?: RangeList;
    /**
     * The valid range of provisioned IOPS. For example, 1000-256,000.
     */
    ProvisionedIops?: RangeList;
    /**
     * The valid range of Provisioned IOPS to gibibytes of storage multiplier. For example, 3-10, which means that provisioned IOPS can be between 3 and 10 times storage.
     */
    IopsToStorageRatio?: DoubleRangeList;
    /**
     * Indicates whether or not Amazon RDS can automatically scale storage for DB instances that use the new instance class.
     */
    SupportsStorageAutoscaling?: Boolean;
    /**
     * The valid range of provisioned storage throughput. For example, 500-4,000 mebibytes per second (MiBps).
     */
    ProvisionedStorageThroughput?: RangeList;
    /**
     * The valid range of storage throughput to provisioned IOPS ratios. For example, 0-0.25.
     */
    StorageThroughputToIopsRatio?: DoubleRangeList;
  }
  export type ValidStorageOptionsList = ValidStorageOptions[];
  export type ValidUpgradeTargetList = UpgradeTarget[];
  export type VpcSecurityGroupIdList = String[];
  export interface VpcSecurityGroupMembership {
    /**
     * The name of the VPC security group.
     */
    VpcSecurityGroupId?: String;
    /**
     * The membership status of the VPC security group. Currently, the only valid status is active.
     */
    Status?: String;
  }
  export type VpcSecurityGroupMembershipList = VpcSecurityGroupMembership[];
  export type WriteForwardingStatus = "enabled"|"disabled"|"enabling"|"disabling"|"unknown"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2013-01-10"|"2013-02-12"|"2013-09-09"|"2014-09-01"|"2014-09-01"|"2014-10-31"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the RDS client.
   */
  export import Types = RDS;
}
export = RDS;
