import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Redshift extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Redshift.Types.ClientConfiguration)
  config: Config & Redshift.Types.ClientConfiguration;
  /**
   * Exchanges a DC1 Reserved Node for a DC2 Reserved Node with no changes to the configuration (term, payment type, or number of nodes) and no additional costs. 
   */
  acceptReservedNodeExchange(params: Redshift.Types.AcceptReservedNodeExchangeInputMessage, callback?: (err: AWSError, data: Redshift.Types.AcceptReservedNodeExchangeOutputMessage) => void): Request<Redshift.Types.AcceptReservedNodeExchangeOutputMessage, AWSError>;
  /**
   * Exchanges a DC1 Reserved Node for a DC2 Reserved Node with no changes to the configuration (term, payment type, or number of nodes) and no additional costs. 
   */
  acceptReservedNodeExchange(callback?: (err: AWSError, data: Redshift.Types.AcceptReservedNodeExchangeOutputMessage) => void): Request<Redshift.Types.AcceptReservedNodeExchangeOutputMessage, AWSError>;
  /**
   * Adds a partner integration to a cluster. This operation authorizes a partner to push status updates for the specified database. To complete the integration, you also set up the integration on the partner website.
   */
  addPartner(params: Redshift.Types.PartnerIntegrationInputMessage, callback?: (err: AWSError, data: Redshift.Types.PartnerIntegrationOutputMessage) => void): Request<Redshift.Types.PartnerIntegrationOutputMessage, AWSError>;
  /**
   * Adds a partner integration to a cluster. This operation authorizes a partner to push status updates for the specified database. To complete the integration, you also set up the integration on the partner website.
   */
  addPartner(callback?: (err: AWSError, data: Redshift.Types.PartnerIntegrationOutputMessage) => void): Request<Redshift.Types.PartnerIntegrationOutputMessage, AWSError>;
  /**
   * From a datashare consumer account, associates a datashare with the account (AssociateEntireAccount) or the specified namespace (ConsumerArn). If you make this association, the consumer can consume the datashare.
   */
  associateDataShareConsumer(params: Redshift.Types.AssociateDataShareConsumerMessage, callback?: (err: AWSError, data: Redshift.Types.DataShare) => void): Request<Redshift.Types.DataShare, AWSError>;
  /**
   * From a datashare consumer account, associates a datashare with the account (AssociateEntireAccount) or the specified namespace (ConsumerArn). If you make this association, the consumer can consume the datashare.
   */
  associateDataShareConsumer(callback?: (err: AWSError, data: Redshift.Types.DataShare) => void): Request<Redshift.Types.DataShare, AWSError>;
  /**
   * Adds an inbound (ingress) rule to an Amazon Redshift security group. Depending on whether the application accessing your cluster is running on the Internet or an Amazon EC2 instance, you can authorize inbound access to either a Classless Interdomain Routing (CIDR)/Internet Protocol (IP) range or to an Amazon EC2 security group. You can add as many as 20 ingress rules to an Amazon Redshift security group. If you authorize access to an Amazon EC2 security group, specify EC2SecurityGroupName and EC2SecurityGroupOwnerId. The Amazon EC2 security group and Amazon Redshift cluster must be in the same Amazon Web Services Region.  If you authorize access to a CIDR/IP address range, specify CIDRIP. For an overview of CIDR blocks, see the Wikipedia article on Classless Inter-Domain Routing.  You must also associate the security group with a cluster so that clients running on these IP addresses or the EC2 instance are authorized to connect to the cluster. For information about managing security groups, go to Working with Security Groups in the Amazon Redshift Cluster Management Guide.
   */
  authorizeClusterSecurityGroupIngress(params: Redshift.Types.AuthorizeClusterSecurityGroupIngressMessage, callback?: (err: AWSError, data: Redshift.Types.AuthorizeClusterSecurityGroupIngressResult) => void): Request<Redshift.Types.AuthorizeClusterSecurityGroupIngressResult, AWSError>;
  /**
   * Adds an inbound (ingress) rule to an Amazon Redshift security group. Depending on whether the application accessing your cluster is running on the Internet or an Amazon EC2 instance, you can authorize inbound access to either a Classless Interdomain Routing (CIDR)/Internet Protocol (IP) range or to an Amazon EC2 security group. You can add as many as 20 ingress rules to an Amazon Redshift security group. If you authorize access to an Amazon EC2 security group, specify EC2SecurityGroupName and EC2SecurityGroupOwnerId. The Amazon EC2 security group and Amazon Redshift cluster must be in the same Amazon Web Services Region.  If you authorize access to a CIDR/IP address range, specify CIDRIP. For an overview of CIDR blocks, see the Wikipedia article on Classless Inter-Domain Routing.  You must also associate the security group with a cluster so that clients running on these IP addresses or the EC2 instance are authorized to connect to the cluster. For information about managing security groups, go to Working with Security Groups in the Amazon Redshift Cluster Management Guide.
   */
  authorizeClusterSecurityGroupIngress(callback?: (err: AWSError, data: Redshift.Types.AuthorizeClusterSecurityGroupIngressResult) => void): Request<Redshift.Types.AuthorizeClusterSecurityGroupIngressResult, AWSError>;
  /**
   * From a data producer account, authorizes the sharing of a datashare with one or more consumer accounts or managing entities. To authorize a datashare for a data consumer, the producer account must have the correct access permissions.
   */
  authorizeDataShare(params: Redshift.Types.AuthorizeDataShareMessage, callback?: (err: AWSError, data: Redshift.Types.DataShare) => void): Request<Redshift.Types.DataShare, AWSError>;
  /**
   * From a data producer account, authorizes the sharing of a datashare with one or more consumer accounts or managing entities. To authorize a datashare for a data consumer, the producer account must have the correct access permissions.
   */
  authorizeDataShare(callback?: (err: AWSError, data: Redshift.Types.DataShare) => void): Request<Redshift.Types.DataShare, AWSError>;
  /**
   * Grants access to a cluster.
   */
  authorizeEndpointAccess(params: Redshift.Types.AuthorizeEndpointAccessMessage, callback?: (err: AWSError, data: Redshift.Types.EndpointAuthorization) => void): Request<Redshift.Types.EndpointAuthorization, AWSError>;
  /**
   * Grants access to a cluster.
   */
  authorizeEndpointAccess(callback?: (err: AWSError, data: Redshift.Types.EndpointAuthorization) => void): Request<Redshift.Types.EndpointAuthorization, AWSError>;
  /**
   * Authorizes the specified Amazon Web Services account to restore the specified snapshot.  For more information about working with snapshots, go to Amazon Redshift Snapshots in the Amazon Redshift Cluster Management Guide.
   */
  authorizeSnapshotAccess(params: Redshift.Types.AuthorizeSnapshotAccessMessage, callback?: (err: AWSError, data: Redshift.Types.AuthorizeSnapshotAccessResult) => void): Request<Redshift.Types.AuthorizeSnapshotAccessResult, AWSError>;
  /**
   * Authorizes the specified Amazon Web Services account to restore the specified snapshot.  For more information about working with snapshots, go to Amazon Redshift Snapshots in the Amazon Redshift Cluster Management Guide.
   */
  authorizeSnapshotAccess(callback?: (err: AWSError, data: Redshift.Types.AuthorizeSnapshotAccessResult) => void): Request<Redshift.Types.AuthorizeSnapshotAccessResult, AWSError>;
  /**
   * Deletes a set of cluster snapshots.
   */
  batchDeleteClusterSnapshots(params: Redshift.Types.BatchDeleteClusterSnapshotsRequest, callback?: (err: AWSError, data: Redshift.Types.BatchDeleteClusterSnapshotsResult) => void): Request<Redshift.Types.BatchDeleteClusterSnapshotsResult, AWSError>;
  /**
   * Deletes a set of cluster snapshots.
   */
  batchDeleteClusterSnapshots(callback?: (err: AWSError, data: Redshift.Types.BatchDeleteClusterSnapshotsResult) => void): Request<Redshift.Types.BatchDeleteClusterSnapshotsResult, AWSError>;
  /**
   * Modifies the settings for a set of cluster snapshots.
   */
  batchModifyClusterSnapshots(params: Redshift.Types.BatchModifyClusterSnapshotsMessage, callback?: (err: AWSError, data: Redshift.Types.BatchModifyClusterSnapshotsOutputMessage) => void): Request<Redshift.Types.BatchModifyClusterSnapshotsOutputMessage, AWSError>;
  /**
   * Modifies the settings for a set of cluster snapshots.
   */
  batchModifyClusterSnapshots(callback?: (err: AWSError, data: Redshift.Types.BatchModifyClusterSnapshotsOutputMessage) => void): Request<Redshift.Types.BatchModifyClusterSnapshotsOutputMessage, AWSError>;
  /**
   * Cancels a resize operation for a cluster.
   */
  cancelResize(params: Redshift.Types.CancelResizeMessage, callback?: (err: AWSError, data: Redshift.Types.ResizeProgressMessage) => void): Request<Redshift.Types.ResizeProgressMessage, AWSError>;
  /**
   * Cancels a resize operation for a cluster.
   */
  cancelResize(callback?: (err: AWSError, data: Redshift.Types.ResizeProgressMessage) => void): Request<Redshift.Types.ResizeProgressMessage, AWSError>;
  /**
   * Copies the specified automated cluster snapshot to a new manual cluster snapshot. The source must be an automated snapshot and it must be in the available state. When you delete a cluster, Amazon Redshift deletes any automated snapshots of the cluster. Also, when the retention period of the snapshot expires, Amazon Redshift automatically deletes it. If you want to keep an automated snapshot for a longer period, you can make a manual copy of the snapshot. Manual snapshots are retained until you delete them.  For more information about working with snapshots, go to Amazon Redshift Snapshots in the Amazon Redshift Cluster Management Guide.
   */
  copyClusterSnapshot(params: Redshift.Types.CopyClusterSnapshotMessage, callback?: (err: AWSError, data: Redshift.Types.CopyClusterSnapshotResult) => void): Request<Redshift.Types.CopyClusterSnapshotResult, AWSError>;
  /**
   * Copies the specified automated cluster snapshot to a new manual cluster snapshot. The source must be an automated snapshot and it must be in the available state. When you delete a cluster, Amazon Redshift deletes any automated snapshots of the cluster. Also, when the retention period of the snapshot expires, Amazon Redshift automatically deletes it. If you want to keep an automated snapshot for a longer period, you can make a manual copy of the snapshot. Manual snapshots are retained until you delete them.  For more information about working with snapshots, go to Amazon Redshift Snapshots in the Amazon Redshift Cluster Management Guide.
   */
  copyClusterSnapshot(callback?: (err: AWSError, data: Redshift.Types.CopyClusterSnapshotResult) => void): Request<Redshift.Types.CopyClusterSnapshotResult, AWSError>;
  /**
   * Creates an authentication profile with the specified parameters.
   */
  createAuthenticationProfile(params: Redshift.Types.CreateAuthenticationProfileMessage, callback?: (err: AWSError, data: Redshift.Types.CreateAuthenticationProfileResult) => void): Request<Redshift.Types.CreateAuthenticationProfileResult, AWSError>;
  /**
   * Creates an authentication profile with the specified parameters.
   */
  createAuthenticationProfile(callback?: (err: AWSError, data: Redshift.Types.CreateAuthenticationProfileResult) => void): Request<Redshift.Types.CreateAuthenticationProfileResult, AWSError>;
  /**
   * Creates a new cluster with the specified parameters. To create a cluster in Virtual Private Cloud (VPC), you must provide a cluster subnet group name. The cluster subnet group identifies the subnets of your VPC that Amazon Redshift uses when creating the cluster. For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide.
   */
  createCluster(params: Redshift.Types.CreateClusterMessage, callback?: (err: AWSError, data: Redshift.Types.CreateClusterResult) => void): Request<Redshift.Types.CreateClusterResult, AWSError>;
  /**
   * Creates a new cluster with the specified parameters. To create a cluster in Virtual Private Cloud (VPC), you must provide a cluster subnet group name. The cluster subnet group identifies the subnets of your VPC that Amazon Redshift uses when creating the cluster. For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide.
   */
  createCluster(callback?: (err: AWSError, data: Redshift.Types.CreateClusterResult) => void): Request<Redshift.Types.CreateClusterResult, AWSError>;
  /**
   * Creates an Amazon Redshift parameter group. Creating parameter groups is independent of creating clusters. You can associate a cluster with a parameter group when you create the cluster. You can also associate an existing cluster with a parameter group after the cluster is created by using ModifyCluster.  Parameters in the parameter group define specific behavior that applies to the databases you create on the cluster. For more information about parameters and parameter groups, go to Amazon Redshift Parameter Groups in the Amazon Redshift Cluster Management Guide.
   */
  createClusterParameterGroup(params: Redshift.Types.CreateClusterParameterGroupMessage, callback?: (err: AWSError, data: Redshift.Types.CreateClusterParameterGroupResult) => void): Request<Redshift.Types.CreateClusterParameterGroupResult, AWSError>;
  /**
   * Creates an Amazon Redshift parameter group. Creating parameter groups is independent of creating clusters. You can associate a cluster with a parameter group when you create the cluster. You can also associate an existing cluster with a parameter group after the cluster is created by using ModifyCluster.  Parameters in the parameter group define specific behavior that applies to the databases you create on the cluster. For more information about parameters and parameter groups, go to Amazon Redshift Parameter Groups in the Amazon Redshift Cluster Management Guide.
   */
  createClusterParameterGroup(callback?: (err: AWSError, data: Redshift.Types.CreateClusterParameterGroupResult) => void): Request<Redshift.Types.CreateClusterParameterGroupResult, AWSError>;
  /**
   * Creates a new Amazon Redshift security group. You use security groups to control access to non-VPC clusters.  For information about managing security groups, go to Amazon Redshift Cluster Security Groups in the Amazon Redshift Cluster Management Guide.
   */
  createClusterSecurityGroup(params: Redshift.Types.CreateClusterSecurityGroupMessage, callback?: (err: AWSError, data: Redshift.Types.CreateClusterSecurityGroupResult) => void): Request<Redshift.Types.CreateClusterSecurityGroupResult, AWSError>;
  /**
   * Creates a new Amazon Redshift security group. You use security groups to control access to non-VPC clusters.  For information about managing security groups, go to Amazon Redshift Cluster Security Groups in the Amazon Redshift Cluster Management Guide.
   */
  createClusterSecurityGroup(callback?: (err: AWSError, data: Redshift.Types.CreateClusterSecurityGroupResult) => void): Request<Redshift.Types.CreateClusterSecurityGroupResult, AWSError>;
  /**
   * Creates a manual snapshot of the specified cluster. The cluster must be in the available state.   For more information about working with snapshots, go to Amazon Redshift Snapshots in the Amazon Redshift Cluster Management Guide.
   */
  createClusterSnapshot(params: Redshift.Types.CreateClusterSnapshotMessage, callback?: (err: AWSError, data: Redshift.Types.CreateClusterSnapshotResult) => void): Request<Redshift.Types.CreateClusterSnapshotResult, AWSError>;
  /**
   * Creates a manual snapshot of the specified cluster. The cluster must be in the available state.   For more information about working with snapshots, go to Amazon Redshift Snapshots in the Amazon Redshift Cluster Management Guide.
   */
  createClusterSnapshot(callback?: (err: AWSError, data: Redshift.Types.CreateClusterSnapshotResult) => void): Request<Redshift.Types.CreateClusterSnapshotResult, AWSError>;
  /**
   * Creates a new Amazon Redshift subnet group. You must provide a list of one or more subnets in your existing Amazon Virtual Private Cloud (Amazon VPC) when creating Amazon Redshift subnet group.  For information about subnet groups, go to Amazon Redshift Cluster Subnet Groups in the Amazon Redshift Cluster Management Guide.
   */
  createClusterSubnetGroup(params: Redshift.Types.CreateClusterSubnetGroupMessage, callback?: (err: AWSError, data: Redshift.Types.CreateClusterSubnetGroupResult) => void): Request<Redshift.Types.CreateClusterSubnetGroupResult, AWSError>;
  /**
   * Creates a new Amazon Redshift subnet group. You must provide a list of one or more subnets in your existing Amazon Virtual Private Cloud (Amazon VPC) when creating Amazon Redshift subnet group.  For information about subnet groups, go to Amazon Redshift Cluster Subnet Groups in the Amazon Redshift Cluster Management Guide.
   */
  createClusterSubnetGroup(callback?: (err: AWSError, data: Redshift.Types.CreateClusterSubnetGroupResult) => void): Request<Redshift.Types.CreateClusterSubnetGroupResult, AWSError>;
  /**
   * Used to create a custom domain name for a cluster. Properties include the custom domain name, the cluster the custom domain is associated with, and the certificate Amazon Resource Name (ARN).
   */
  createCustomDomainAssociation(params: Redshift.Types.CreateCustomDomainAssociationMessage, callback?: (err: AWSError, data: Redshift.Types.CreateCustomDomainAssociationResult) => void): Request<Redshift.Types.CreateCustomDomainAssociationResult, AWSError>;
  /**
   * Used to create a custom domain name for a cluster. Properties include the custom domain name, the cluster the custom domain is associated with, and the certificate Amazon Resource Name (ARN).
   */
  createCustomDomainAssociation(callback?: (err: AWSError, data: Redshift.Types.CreateCustomDomainAssociationResult) => void): Request<Redshift.Types.CreateCustomDomainAssociationResult, AWSError>;
  /**
   * Creates a Redshift-managed VPC endpoint.
   */
  createEndpointAccess(params: Redshift.Types.CreateEndpointAccessMessage, callback?: (err: AWSError, data: Redshift.Types.EndpointAccess) => void): Request<Redshift.Types.EndpointAccess, AWSError>;
  /**
   * Creates a Redshift-managed VPC endpoint.
   */
  createEndpointAccess(callback?: (err: AWSError, data: Redshift.Types.EndpointAccess) => void): Request<Redshift.Types.EndpointAccess, AWSError>;
  /**
   * Creates an Amazon Redshift event notification subscription. This action requires an ARN (Amazon Resource Name) of an Amazon SNS topic created by either the Amazon Redshift console, the Amazon SNS console, or the Amazon SNS API. To obtain an ARN with Amazon SNS, you must create a topic in Amazon SNS and subscribe to the topic. The ARN is displayed in the SNS console. You can specify the source type, and lists of Amazon Redshift source IDs, event categories, and event severities. Notifications will be sent for all events you want that match those criteria. For example, you can specify source type = cluster, source ID = my-cluster-1 and mycluster2, event categories = Availability, Backup, and severity = ERROR. The subscription will only send notifications for those ERROR events in the Availability and Backup categories for the specified clusters. If you specify both the source type and source IDs, such as source type = cluster and source identifier = my-cluster-1, notifications will be sent for all the cluster events for my-cluster-1. If you specify a source type but do not specify a source identifier, you will receive notice of the events for the objects of that type in your Amazon Web Services account. If you do not specify either the SourceType nor the SourceIdentifier, you will be notified of events generated from all Amazon Redshift sources belonging to your Amazon Web Services account. You must specify a source type if you specify a source ID.
   */
  createEventSubscription(params: Redshift.Types.CreateEventSubscriptionMessage, callback?: (err: AWSError, data: Redshift.Types.CreateEventSubscriptionResult) => void): Request<Redshift.Types.CreateEventSubscriptionResult, AWSError>;
  /**
   * Creates an Amazon Redshift event notification subscription. This action requires an ARN (Amazon Resource Name) of an Amazon SNS topic created by either the Amazon Redshift console, the Amazon SNS console, or the Amazon SNS API. To obtain an ARN with Amazon SNS, you must create a topic in Amazon SNS and subscribe to the topic. The ARN is displayed in the SNS console. You can specify the source type, and lists of Amazon Redshift source IDs, event categories, and event severities. Notifications will be sent for all events you want that match those criteria. For example, you can specify source type = cluster, source ID = my-cluster-1 and mycluster2, event categories = Availability, Backup, and severity = ERROR. The subscription will only send notifications for those ERROR events in the Availability and Backup categories for the specified clusters. If you specify both the source type and source IDs, such as source type = cluster and source identifier = my-cluster-1, notifications will be sent for all the cluster events for my-cluster-1. If you specify a source type but do not specify a source identifier, you will receive notice of the events for the objects of that type in your Amazon Web Services account. If you do not specify either the SourceType nor the SourceIdentifier, you will be notified of events generated from all Amazon Redshift sources belonging to your Amazon Web Services account. You must specify a source type if you specify a source ID.
   */
  createEventSubscription(callback?: (err: AWSError, data: Redshift.Types.CreateEventSubscriptionResult) => void): Request<Redshift.Types.CreateEventSubscriptionResult, AWSError>;
  /**
   * Creates an HSM client certificate that an Amazon Redshift cluster will use to connect to the client's HSM in order to store and retrieve the keys used to encrypt the cluster databases. The command returns a public key, which you must store in the HSM. In addition to creating the HSM certificate, you must create an Amazon Redshift HSM configuration that provides a cluster the information needed to store and use encryption keys in the HSM. For more information, go to Hardware Security Modules in the Amazon Redshift Cluster Management Guide.
   */
  createHsmClientCertificate(params: Redshift.Types.CreateHsmClientCertificateMessage, callback?: (err: AWSError, data: Redshift.Types.CreateHsmClientCertificateResult) => void): Request<Redshift.Types.CreateHsmClientCertificateResult, AWSError>;
  /**
   * Creates an HSM client certificate that an Amazon Redshift cluster will use to connect to the client's HSM in order to store and retrieve the keys used to encrypt the cluster databases. The command returns a public key, which you must store in the HSM. In addition to creating the HSM certificate, you must create an Amazon Redshift HSM configuration that provides a cluster the information needed to store and use encryption keys in the HSM. For more information, go to Hardware Security Modules in the Amazon Redshift Cluster Management Guide.
   */
  createHsmClientCertificate(callback?: (err: AWSError, data: Redshift.Types.CreateHsmClientCertificateResult) => void): Request<Redshift.Types.CreateHsmClientCertificateResult, AWSError>;
  /**
   * Creates an HSM configuration that contains the information required by an Amazon Redshift cluster to store and use database encryption keys in a Hardware Security Module (HSM). After creating the HSM configuration, you can specify it as a parameter when creating a cluster. The cluster will then store its encryption keys in the HSM. In addition to creating an HSM configuration, you must also create an HSM client certificate. For more information, go to Hardware Security Modules in the Amazon Redshift Cluster Management Guide.
   */
  createHsmConfiguration(params: Redshift.Types.CreateHsmConfigurationMessage, callback?: (err: AWSError, data: Redshift.Types.CreateHsmConfigurationResult) => void): Request<Redshift.Types.CreateHsmConfigurationResult, AWSError>;
  /**
   * Creates an HSM configuration that contains the information required by an Amazon Redshift cluster to store and use database encryption keys in a Hardware Security Module (HSM). After creating the HSM configuration, you can specify it as a parameter when creating a cluster. The cluster will then store its encryption keys in the HSM. In addition to creating an HSM configuration, you must also create an HSM client certificate. For more information, go to Hardware Security Modules in the Amazon Redshift Cluster Management Guide.
   */
  createHsmConfiguration(callback?: (err: AWSError, data: Redshift.Types.CreateHsmConfigurationResult) => void): Request<Redshift.Types.CreateHsmConfigurationResult, AWSError>;
  /**
   * Creates a scheduled action. A scheduled action contains a schedule and an Amazon Redshift API action. For example, you can create a schedule of when to run the ResizeCluster API operation. 
   */
  createScheduledAction(params: Redshift.Types.CreateScheduledActionMessage, callback?: (err: AWSError, data: Redshift.Types.ScheduledAction) => void): Request<Redshift.Types.ScheduledAction, AWSError>;
  /**
   * Creates a scheduled action. A scheduled action contains a schedule and an Amazon Redshift API action. For example, you can create a schedule of when to run the ResizeCluster API operation. 
   */
  createScheduledAction(callback?: (err: AWSError, data: Redshift.Types.ScheduledAction) => void): Request<Redshift.Types.ScheduledAction, AWSError>;
  /**
   * Creates a snapshot copy grant that permits Amazon Redshift to use an encrypted symmetric key from Key Management Service (KMS) to encrypt copied snapshots in a destination region.  For more information about managing snapshot copy grants, go to Amazon Redshift Database Encryption in the Amazon Redshift Cluster Management Guide. 
   */
  createSnapshotCopyGrant(params: Redshift.Types.CreateSnapshotCopyGrantMessage, callback?: (err: AWSError, data: Redshift.Types.CreateSnapshotCopyGrantResult) => void): Request<Redshift.Types.CreateSnapshotCopyGrantResult, AWSError>;
  /**
   * Creates a snapshot copy grant that permits Amazon Redshift to use an encrypted symmetric key from Key Management Service (KMS) to encrypt copied snapshots in a destination region.  For more information about managing snapshot copy grants, go to Amazon Redshift Database Encryption in the Amazon Redshift Cluster Management Guide. 
   */
  createSnapshotCopyGrant(callback?: (err: AWSError, data: Redshift.Types.CreateSnapshotCopyGrantResult) => void): Request<Redshift.Types.CreateSnapshotCopyGrantResult, AWSError>;
  /**
   * Create a snapshot schedule that can be associated to a cluster and which overrides the default system backup schedule. 
   */
  createSnapshotSchedule(params: Redshift.Types.CreateSnapshotScheduleMessage, callback?: (err: AWSError, data: Redshift.Types.SnapshotSchedule) => void): Request<Redshift.Types.SnapshotSchedule, AWSError>;
  /**
   * Create a snapshot schedule that can be associated to a cluster and which overrides the default system backup schedule. 
   */
  createSnapshotSchedule(callback?: (err: AWSError, data: Redshift.Types.SnapshotSchedule) => void): Request<Redshift.Types.SnapshotSchedule, AWSError>;
  /**
   * Adds tags to a cluster. A resource can have up to 50 tags. If you try to create more than 50 tags for a resource, you will receive an error and the attempt will fail. If you specify a key that already exists for the resource, the value for that key will be updated with the new value.
   */
  createTags(params: Redshift.Types.CreateTagsMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds tags to a cluster. A resource can have up to 50 tags. If you try to create more than 50 tags for a resource, you will receive an error and the attempt will fail. If you specify a key that already exists for the resource, the value for that key will be updated with the new value.
   */
  createTags(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a usage limit for a specified Amazon Redshift feature on a cluster. The usage limit is identified by the returned usage limit identifier.
   */
  createUsageLimit(params: Redshift.Types.CreateUsageLimitMessage, callback?: (err: AWSError, data: Redshift.Types.UsageLimit) => void): Request<Redshift.Types.UsageLimit, AWSError>;
  /**
   * Creates a usage limit for a specified Amazon Redshift feature on a cluster. The usage limit is identified by the returned usage limit identifier.
   */
  createUsageLimit(callback?: (err: AWSError, data: Redshift.Types.UsageLimit) => void): Request<Redshift.Types.UsageLimit, AWSError>;
  /**
   * From a datashare producer account, removes authorization from the specified datashare. 
   */
  deauthorizeDataShare(params: Redshift.Types.DeauthorizeDataShareMessage, callback?: (err: AWSError, data: Redshift.Types.DataShare) => void): Request<Redshift.Types.DataShare, AWSError>;
  /**
   * From a datashare producer account, removes authorization from the specified datashare. 
   */
  deauthorizeDataShare(callback?: (err: AWSError, data: Redshift.Types.DataShare) => void): Request<Redshift.Types.DataShare, AWSError>;
  /**
   * Deletes an authentication profile.
   */
  deleteAuthenticationProfile(params: Redshift.Types.DeleteAuthenticationProfileMessage, callback?: (err: AWSError, data: Redshift.Types.DeleteAuthenticationProfileResult) => void): Request<Redshift.Types.DeleteAuthenticationProfileResult, AWSError>;
  /**
   * Deletes an authentication profile.
   */
  deleteAuthenticationProfile(callback?: (err: AWSError, data: Redshift.Types.DeleteAuthenticationProfileResult) => void): Request<Redshift.Types.DeleteAuthenticationProfileResult, AWSError>;
  /**
   * Deletes a previously provisioned cluster without its final snapshot being created. A successful response from the web service indicates that the request was received correctly. Use DescribeClusters to monitor the status of the deletion. The delete operation cannot be canceled or reverted once submitted. For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide. If you want to shut down the cluster and retain it for future use, set SkipFinalClusterSnapshot to false and specify a name for FinalClusterSnapshotIdentifier. You can later restore this snapshot to resume using the cluster. If a final cluster snapshot is requested, the status of the cluster will be "final-snapshot" while the snapshot is being taken, then it's "deleting" once Amazon Redshift begins deleting the cluster.   For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide.
   */
  deleteCluster(params: Redshift.Types.DeleteClusterMessage, callback?: (err: AWSError, data: Redshift.Types.DeleteClusterResult) => void): Request<Redshift.Types.DeleteClusterResult, AWSError>;
  /**
   * Deletes a previously provisioned cluster without its final snapshot being created. A successful response from the web service indicates that the request was received correctly. Use DescribeClusters to monitor the status of the deletion. The delete operation cannot be canceled or reverted once submitted. For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide. If you want to shut down the cluster and retain it for future use, set SkipFinalClusterSnapshot to false and specify a name for FinalClusterSnapshotIdentifier. You can later restore this snapshot to resume using the cluster. If a final cluster snapshot is requested, the status of the cluster will be "final-snapshot" while the snapshot is being taken, then it's "deleting" once Amazon Redshift begins deleting the cluster.   For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide.
   */
  deleteCluster(callback?: (err: AWSError, data: Redshift.Types.DeleteClusterResult) => void): Request<Redshift.Types.DeleteClusterResult, AWSError>;
  /**
   * Deletes a specified Amazon Redshift parameter group.  You cannot delete a parameter group if it is associated with a cluster. 
   */
  deleteClusterParameterGroup(params: Redshift.Types.DeleteClusterParameterGroupMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a specified Amazon Redshift parameter group.  You cannot delete a parameter group if it is associated with a cluster. 
   */
  deleteClusterParameterGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Amazon Redshift security group.  You cannot delete a security group that is associated with any clusters. You cannot delete the default security group.   For information about managing security groups, go to Amazon Redshift Cluster Security Groups in the Amazon Redshift Cluster Management Guide.
   */
  deleteClusterSecurityGroup(params: Redshift.Types.DeleteClusterSecurityGroupMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Amazon Redshift security group.  You cannot delete a security group that is associated with any clusters. You cannot delete the default security group.   For information about managing security groups, go to Amazon Redshift Cluster Security Groups in the Amazon Redshift Cluster Management Guide.
   */
  deleteClusterSecurityGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified manual snapshot. The snapshot must be in the available state, with no other users authorized to access the snapshot.  Unlike automated snapshots, manual snapshots are retained even after you delete your cluster. Amazon Redshift does not delete your manual snapshots. You must delete manual snapshot explicitly to avoid getting charged. If other accounts are authorized to access the snapshot, you must revoke all of the authorizations before you can delete the snapshot.
   */
  deleteClusterSnapshot(params: Redshift.Types.DeleteClusterSnapshotMessage, callback?: (err: AWSError, data: Redshift.Types.DeleteClusterSnapshotResult) => void): Request<Redshift.Types.DeleteClusterSnapshotResult, AWSError>;
  /**
   * Deletes the specified manual snapshot. The snapshot must be in the available state, with no other users authorized to access the snapshot.  Unlike automated snapshots, manual snapshots are retained even after you delete your cluster. Amazon Redshift does not delete your manual snapshots. You must delete manual snapshot explicitly to avoid getting charged. If other accounts are authorized to access the snapshot, you must revoke all of the authorizations before you can delete the snapshot.
   */
  deleteClusterSnapshot(callback?: (err: AWSError, data: Redshift.Types.DeleteClusterSnapshotResult) => void): Request<Redshift.Types.DeleteClusterSnapshotResult, AWSError>;
  /**
   * Deletes the specified cluster subnet group.
   */
  deleteClusterSubnetGroup(params: Redshift.Types.DeleteClusterSubnetGroupMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified cluster subnet group.
   */
  deleteClusterSubnetGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Contains information about deleting a custom domain association for a cluster.
   */
  deleteCustomDomainAssociation(params: Redshift.Types.DeleteCustomDomainAssociationMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Contains information about deleting a custom domain association for a cluster.
   */
  deleteCustomDomainAssociation(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Redshift-managed VPC endpoint.
   */
  deleteEndpointAccess(params: Redshift.Types.DeleteEndpointAccessMessage, callback?: (err: AWSError, data: Redshift.Types.EndpointAccess) => void): Request<Redshift.Types.EndpointAccess, AWSError>;
  /**
   * Deletes a Redshift-managed VPC endpoint.
   */
  deleteEndpointAccess(callback?: (err: AWSError, data: Redshift.Types.EndpointAccess) => void): Request<Redshift.Types.EndpointAccess, AWSError>;
  /**
   * Deletes an Amazon Redshift event notification subscription.
   */
  deleteEventSubscription(params: Redshift.Types.DeleteEventSubscriptionMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Amazon Redshift event notification subscription.
   */
  deleteEventSubscription(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified HSM client certificate.
   */
  deleteHsmClientCertificate(params: Redshift.Types.DeleteHsmClientCertificateMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified HSM client certificate.
   */
  deleteHsmClientCertificate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified Amazon Redshift HSM configuration.
   */
  deleteHsmConfiguration(params: Redshift.Types.DeleteHsmConfigurationMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified Amazon Redshift HSM configuration.
   */
  deleteHsmConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a partner integration from a cluster. Data can still flow to the cluster until the integration is deleted at the partner's website.
   */
  deletePartner(params: Redshift.Types.PartnerIntegrationInputMessage, callback?: (err: AWSError, data: Redshift.Types.PartnerIntegrationOutputMessage) => void): Request<Redshift.Types.PartnerIntegrationOutputMessage, AWSError>;
  /**
   * Deletes a partner integration from a cluster. Data can still flow to the cluster until the integration is deleted at the partner's website.
   */
  deletePartner(callback?: (err: AWSError, data: Redshift.Types.PartnerIntegrationOutputMessage) => void): Request<Redshift.Types.PartnerIntegrationOutputMessage, AWSError>;
  /**
   * Deletes a scheduled action. 
   */
  deleteScheduledAction(params: Redshift.Types.DeleteScheduledActionMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a scheduled action. 
   */
  deleteScheduledAction(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified snapshot copy grant.
   */
  deleteSnapshotCopyGrant(params: Redshift.Types.DeleteSnapshotCopyGrantMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified snapshot copy grant.
   */
  deleteSnapshotCopyGrant(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a snapshot schedule.
   */
  deleteSnapshotSchedule(params: Redshift.Types.DeleteSnapshotScheduleMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a snapshot schedule.
   */
  deleteSnapshotSchedule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes tags from a resource. You must provide the ARN of the resource from which you want to delete the tag or tags.
   */
  deleteTags(params: Redshift.Types.DeleteTagsMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes tags from a resource. You must provide the ARN of the resource from which you want to delete the tag or tags.
   */
  deleteTags(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a usage limit from a cluster.
   */
  deleteUsageLimit(params: Redshift.Types.DeleteUsageLimitMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a usage limit from a cluster.
   */
  deleteUsageLimit(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Returns a list of attributes attached to an account
   */
  describeAccountAttributes(params: Redshift.Types.DescribeAccountAttributesMessage, callback?: (err: AWSError, data: Redshift.Types.AccountAttributeList) => void): Request<Redshift.Types.AccountAttributeList, AWSError>;
  /**
   * Returns a list of attributes attached to an account
   */
  describeAccountAttributes(callback?: (err: AWSError, data: Redshift.Types.AccountAttributeList) => void): Request<Redshift.Types.AccountAttributeList, AWSError>;
  /**
   * Describes an authentication profile.
   */
  describeAuthenticationProfiles(params: Redshift.Types.DescribeAuthenticationProfilesMessage, callback?: (err: AWSError, data: Redshift.Types.DescribeAuthenticationProfilesResult) => void): Request<Redshift.Types.DescribeAuthenticationProfilesResult, AWSError>;
  /**
   * Describes an authentication profile.
   */
  describeAuthenticationProfiles(callback?: (err: AWSError, data: Redshift.Types.DescribeAuthenticationProfilesResult) => void): Request<Redshift.Types.DescribeAuthenticationProfilesResult, AWSError>;
  /**
   * Returns an array of ClusterDbRevision objects.
   */
  describeClusterDbRevisions(params: Redshift.Types.DescribeClusterDbRevisionsMessage, callback?: (err: AWSError, data: Redshift.Types.ClusterDbRevisionsMessage) => void): Request<Redshift.Types.ClusterDbRevisionsMessage, AWSError>;
  /**
   * Returns an array of ClusterDbRevision objects.
   */
  describeClusterDbRevisions(callback?: (err: AWSError, data: Redshift.Types.ClusterDbRevisionsMessage) => void): Request<Redshift.Types.ClusterDbRevisionsMessage, AWSError>;
  /**
   * Returns a list of Amazon Redshift parameter groups, including parameter groups you created and the default parameter group. For each parameter group, the response includes the parameter group name, description, and parameter group family name. You can optionally specify a name to retrieve the description of a specific parameter group.  For more information about parameters and parameter groups, go to Amazon Redshift Parameter Groups in the Amazon Redshift Cluster Management Guide. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all parameter groups that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all parameter groups that have any combination of those values are returned. If both tag keys and values are omitted from the request, parameter groups are returned regardless of whether they have tag keys or values associated with them.
   */
  describeClusterParameterGroups(params: Redshift.Types.DescribeClusterParameterGroupsMessage, callback?: (err: AWSError, data: Redshift.Types.ClusterParameterGroupsMessage) => void): Request<Redshift.Types.ClusterParameterGroupsMessage, AWSError>;
  /**
   * Returns a list of Amazon Redshift parameter groups, including parameter groups you created and the default parameter group. For each parameter group, the response includes the parameter group name, description, and parameter group family name. You can optionally specify a name to retrieve the description of a specific parameter group.  For more information about parameters and parameter groups, go to Amazon Redshift Parameter Groups in the Amazon Redshift Cluster Management Guide. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all parameter groups that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all parameter groups that have any combination of those values are returned. If both tag keys and values are omitted from the request, parameter groups are returned regardless of whether they have tag keys or values associated with them.
   */
  describeClusterParameterGroups(callback?: (err: AWSError, data: Redshift.Types.ClusterParameterGroupsMessage) => void): Request<Redshift.Types.ClusterParameterGroupsMessage, AWSError>;
  /**
   * Returns a detailed list of parameters contained within the specified Amazon Redshift parameter group. For each parameter the response includes information such as parameter name, description, data type, value, whether the parameter value is modifiable, and so on. You can specify source filter to retrieve parameters of only specific type. For example, to retrieve parameters that were modified by a user action such as from ModifyClusterParameterGroup, you can specify source equal to user.  For more information about parameters and parameter groups, go to Amazon Redshift Parameter Groups in the Amazon Redshift Cluster Management Guide.
   */
  describeClusterParameters(params: Redshift.Types.DescribeClusterParametersMessage, callback?: (err: AWSError, data: Redshift.Types.ClusterParameterGroupDetails) => void): Request<Redshift.Types.ClusterParameterGroupDetails, AWSError>;
  /**
   * Returns a detailed list of parameters contained within the specified Amazon Redshift parameter group. For each parameter the response includes information such as parameter name, description, data type, value, whether the parameter value is modifiable, and so on. You can specify source filter to retrieve parameters of only specific type. For example, to retrieve parameters that were modified by a user action such as from ModifyClusterParameterGroup, you can specify source equal to user.  For more information about parameters and parameter groups, go to Amazon Redshift Parameter Groups in the Amazon Redshift Cluster Management Guide.
   */
  describeClusterParameters(callback?: (err: AWSError, data: Redshift.Types.ClusterParameterGroupDetails) => void): Request<Redshift.Types.ClusterParameterGroupDetails, AWSError>;
  /**
   * Returns information about Amazon Redshift security groups. If the name of a security group is specified, the response will contain only information about only that security group.  For information about managing security groups, go to Amazon Redshift Cluster Security Groups in the Amazon Redshift Cluster Management Guide. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all security groups that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all security groups that have any combination of those values are returned. If both tag keys and values are omitted from the request, security groups are returned regardless of whether they have tag keys or values associated with them.
   */
  describeClusterSecurityGroups(params: Redshift.Types.DescribeClusterSecurityGroupsMessage, callback?: (err: AWSError, data: Redshift.Types.ClusterSecurityGroupMessage) => void): Request<Redshift.Types.ClusterSecurityGroupMessage, AWSError>;
  /**
   * Returns information about Amazon Redshift security groups. If the name of a security group is specified, the response will contain only information about only that security group.  For information about managing security groups, go to Amazon Redshift Cluster Security Groups in the Amazon Redshift Cluster Management Guide. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all security groups that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all security groups that have any combination of those values are returned. If both tag keys and values are omitted from the request, security groups are returned regardless of whether they have tag keys or values associated with them.
   */
  describeClusterSecurityGroups(callback?: (err: AWSError, data: Redshift.Types.ClusterSecurityGroupMessage) => void): Request<Redshift.Types.ClusterSecurityGroupMessage, AWSError>;
  /**
   * Returns one or more snapshot objects, which contain metadata about your cluster snapshots. By default, this operation returns information about all snapshots of all clusters that are owned by your Amazon Web Services account. No information is returned for snapshots owned by inactive Amazon Web Services accounts. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all snapshots that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all snapshots that have any combination of those values are returned. Only snapshots that you own are returned in the response; shared snapshots are not returned with the tag key and tag value request parameters. If both tag keys and values are omitted from the request, snapshots are returned regardless of whether they have tag keys or values associated with them.
   */
  describeClusterSnapshots(params: Redshift.Types.DescribeClusterSnapshotsMessage, callback?: (err: AWSError, data: Redshift.Types.SnapshotMessage) => void): Request<Redshift.Types.SnapshotMessage, AWSError>;
  /**
   * Returns one or more snapshot objects, which contain metadata about your cluster snapshots. By default, this operation returns information about all snapshots of all clusters that are owned by your Amazon Web Services account. No information is returned for snapshots owned by inactive Amazon Web Services accounts. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all snapshots that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all snapshots that have any combination of those values are returned. Only snapshots that you own are returned in the response; shared snapshots are not returned with the tag key and tag value request parameters. If both tag keys and values are omitted from the request, snapshots are returned regardless of whether they have tag keys or values associated with them.
   */
  describeClusterSnapshots(callback?: (err: AWSError, data: Redshift.Types.SnapshotMessage) => void): Request<Redshift.Types.SnapshotMessage, AWSError>;
  /**
   * Returns one or more cluster subnet group objects, which contain metadata about your cluster subnet groups. By default, this operation returns information about all cluster subnet groups that are defined in your Amazon Web Services account. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all subnet groups that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all subnet groups that have any combination of those values are returned. If both tag keys and values are omitted from the request, subnet groups are returned regardless of whether they have tag keys or values associated with them.
   */
  describeClusterSubnetGroups(params: Redshift.Types.DescribeClusterSubnetGroupsMessage, callback?: (err: AWSError, data: Redshift.Types.ClusterSubnetGroupMessage) => void): Request<Redshift.Types.ClusterSubnetGroupMessage, AWSError>;
  /**
   * Returns one or more cluster subnet group objects, which contain metadata about your cluster subnet groups. By default, this operation returns information about all cluster subnet groups that are defined in your Amazon Web Services account. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all subnet groups that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all subnet groups that have any combination of those values are returned. If both tag keys and values are omitted from the request, subnet groups are returned regardless of whether they have tag keys or values associated with them.
   */
  describeClusterSubnetGroups(callback?: (err: AWSError, data: Redshift.Types.ClusterSubnetGroupMessage) => void): Request<Redshift.Types.ClusterSubnetGroupMessage, AWSError>;
  /**
   * Returns a list of all the available maintenance tracks.
   */
  describeClusterTracks(params: Redshift.Types.DescribeClusterTracksMessage, callback?: (err: AWSError, data: Redshift.Types.TrackListMessage) => void): Request<Redshift.Types.TrackListMessage, AWSError>;
  /**
   * Returns a list of all the available maintenance tracks.
   */
  describeClusterTracks(callback?: (err: AWSError, data: Redshift.Types.TrackListMessage) => void): Request<Redshift.Types.TrackListMessage, AWSError>;
  /**
   * Returns descriptions of the available Amazon Redshift cluster versions. You can call this operation even before creating any clusters to learn more about the Amazon Redshift versions. For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide.
   */
  describeClusterVersions(params: Redshift.Types.DescribeClusterVersionsMessage, callback?: (err: AWSError, data: Redshift.Types.ClusterVersionsMessage) => void): Request<Redshift.Types.ClusterVersionsMessage, AWSError>;
  /**
   * Returns descriptions of the available Amazon Redshift cluster versions. You can call this operation even before creating any clusters to learn more about the Amazon Redshift versions. For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide.
   */
  describeClusterVersions(callback?: (err: AWSError, data: Redshift.Types.ClusterVersionsMessage) => void): Request<Redshift.Types.ClusterVersionsMessage, AWSError>;
  /**
   * Returns properties of provisioned clusters including general cluster properties, cluster database properties, maintenance and backup properties, and security and access properties. This operation supports pagination. For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all clusters that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all clusters that have any combination of those values are returned. If both tag keys and values are omitted from the request, clusters are returned regardless of whether they have tag keys or values associated with them.
   */
  describeClusters(params: Redshift.Types.DescribeClustersMessage, callback?: (err: AWSError, data: Redshift.Types.ClustersMessage) => void): Request<Redshift.Types.ClustersMessage, AWSError>;
  /**
   * Returns properties of provisioned clusters including general cluster properties, cluster database properties, maintenance and backup properties, and security and access properties. This operation supports pagination. For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all clusters that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all clusters that have any combination of those values are returned. If both tag keys and values are omitted from the request, clusters are returned regardless of whether they have tag keys or values associated with them.
   */
  describeClusters(callback?: (err: AWSError, data: Redshift.Types.ClustersMessage) => void): Request<Redshift.Types.ClustersMessage, AWSError>;
  /**
   * Contains information for custom domain associations for a cluster.
   */
  describeCustomDomainAssociations(params: Redshift.Types.DescribeCustomDomainAssociationsMessage, callback?: (err: AWSError, data: Redshift.Types.CustomDomainAssociationsMessage) => void): Request<Redshift.Types.CustomDomainAssociationsMessage, AWSError>;
  /**
   * Contains information for custom domain associations for a cluster.
   */
  describeCustomDomainAssociations(callback?: (err: AWSError, data: Redshift.Types.CustomDomainAssociationsMessage) => void): Request<Redshift.Types.CustomDomainAssociationsMessage, AWSError>;
  /**
   * Shows the status of any inbound or outbound datashares available in the specified account.
   */
  describeDataShares(params: Redshift.Types.DescribeDataSharesMessage, callback?: (err: AWSError, data: Redshift.Types.DescribeDataSharesResult) => void): Request<Redshift.Types.DescribeDataSharesResult, AWSError>;
  /**
   * Shows the status of any inbound or outbound datashares available in the specified account.
   */
  describeDataShares(callback?: (err: AWSError, data: Redshift.Types.DescribeDataSharesResult) => void): Request<Redshift.Types.DescribeDataSharesResult, AWSError>;
  /**
   * Returns a list of datashares where the account identifier being called is a consumer account identifier.
   */
  describeDataSharesForConsumer(params: Redshift.Types.DescribeDataSharesForConsumerMessage, callback?: (err: AWSError, data: Redshift.Types.DescribeDataSharesForConsumerResult) => void): Request<Redshift.Types.DescribeDataSharesForConsumerResult, AWSError>;
  /**
   * Returns a list of datashares where the account identifier being called is a consumer account identifier.
   */
  describeDataSharesForConsumer(callback?: (err: AWSError, data: Redshift.Types.DescribeDataSharesForConsumerResult) => void): Request<Redshift.Types.DescribeDataSharesForConsumerResult, AWSError>;
  /**
   * Returns a list of datashares when the account identifier being called is a producer account identifier.
   */
  describeDataSharesForProducer(params: Redshift.Types.DescribeDataSharesForProducerMessage, callback?: (err: AWSError, data: Redshift.Types.DescribeDataSharesForProducerResult) => void): Request<Redshift.Types.DescribeDataSharesForProducerResult, AWSError>;
  /**
   * Returns a list of datashares when the account identifier being called is a producer account identifier.
   */
  describeDataSharesForProducer(callback?: (err: AWSError, data: Redshift.Types.DescribeDataSharesForProducerResult) => void): Request<Redshift.Types.DescribeDataSharesForProducerResult, AWSError>;
  /**
   * Returns a list of parameter settings for the specified parameter group family.  For more information about parameters and parameter groups, go to Amazon Redshift Parameter Groups in the Amazon Redshift Cluster Management Guide.
   */
  describeDefaultClusterParameters(params: Redshift.Types.DescribeDefaultClusterParametersMessage, callback?: (err: AWSError, data: Redshift.Types.DescribeDefaultClusterParametersResult) => void): Request<Redshift.Types.DescribeDefaultClusterParametersResult, AWSError>;
  /**
   * Returns a list of parameter settings for the specified parameter group family.  For more information about parameters and parameter groups, go to Amazon Redshift Parameter Groups in the Amazon Redshift Cluster Management Guide.
   */
  describeDefaultClusterParameters(callback?: (err: AWSError, data: Redshift.Types.DescribeDefaultClusterParametersResult) => void): Request<Redshift.Types.DescribeDefaultClusterParametersResult, AWSError>;
  /**
   * Describes a Redshift-managed VPC endpoint.
   */
  describeEndpointAccess(params: Redshift.Types.DescribeEndpointAccessMessage, callback?: (err: AWSError, data: Redshift.Types.EndpointAccessList) => void): Request<Redshift.Types.EndpointAccessList, AWSError>;
  /**
   * Describes a Redshift-managed VPC endpoint.
   */
  describeEndpointAccess(callback?: (err: AWSError, data: Redshift.Types.EndpointAccessList) => void): Request<Redshift.Types.EndpointAccessList, AWSError>;
  /**
   * Describes an endpoint authorization.
   */
  describeEndpointAuthorization(params: Redshift.Types.DescribeEndpointAuthorizationMessage, callback?: (err: AWSError, data: Redshift.Types.EndpointAuthorizationList) => void): Request<Redshift.Types.EndpointAuthorizationList, AWSError>;
  /**
   * Describes an endpoint authorization.
   */
  describeEndpointAuthorization(callback?: (err: AWSError, data: Redshift.Types.EndpointAuthorizationList) => void): Request<Redshift.Types.EndpointAuthorizationList, AWSError>;
  /**
   * Displays a list of event categories for all event source types, or for a specified source type. For a list of the event categories and source types, go to Amazon Redshift Event Notifications.
   */
  describeEventCategories(params: Redshift.Types.DescribeEventCategoriesMessage, callback?: (err: AWSError, data: Redshift.Types.EventCategoriesMessage) => void): Request<Redshift.Types.EventCategoriesMessage, AWSError>;
  /**
   * Displays a list of event categories for all event source types, or for a specified source type. For a list of the event categories and source types, go to Amazon Redshift Event Notifications.
   */
  describeEventCategories(callback?: (err: AWSError, data: Redshift.Types.EventCategoriesMessage) => void): Request<Redshift.Types.EventCategoriesMessage, AWSError>;
  /**
   * Lists descriptions of all the Amazon Redshift event notification subscriptions for a customer account. If you specify a subscription name, lists the description for that subscription. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all event notification subscriptions that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all subscriptions that have any combination of those values are returned. If both tag keys and values are omitted from the request, subscriptions are returned regardless of whether they have tag keys or values associated with them.
   */
  describeEventSubscriptions(params: Redshift.Types.DescribeEventSubscriptionsMessage, callback?: (err: AWSError, data: Redshift.Types.EventSubscriptionsMessage) => void): Request<Redshift.Types.EventSubscriptionsMessage, AWSError>;
  /**
   * Lists descriptions of all the Amazon Redshift event notification subscriptions for a customer account. If you specify a subscription name, lists the description for that subscription. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all event notification subscriptions that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all subscriptions that have any combination of those values are returned. If both tag keys and values are omitted from the request, subscriptions are returned regardless of whether they have tag keys or values associated with them.
   */
  describeEventSubscriptions(callback?: (err: AWSError, data: Redshift.Types.EventSubscriptionsMessage) => void): Request<Redshift.Types.EventSubscriptionsMessage, AWSError>;
  /**
   * Returns events related to clusters, security groups, snapshots, and parameter groups for the past 14 days. Events specific to a particular cluster, security group, snapshot or parameter group can be obtained by providing the name as a parameter. By default, the past hour of events are returned.
   */
  describeEvents(params: Redshift.Types.DescribeEventsMessage, callback?: (err: AWSError, data: Redshift.Types.EventsMessage) => void): Request<Redshift.Types.EventsMessage, AWSError>;
  /**
   * Returns events related to clusters, security groups, snapshots, and parameter groups for the past 14 days. Events specific to a particular cluster, security group, snapshot or parameter group can be obtained by providing the name as a parameter. By default, the past hour of events are returned.
   */
  describeEvents(callback?: (err: AWSError, data: Redshift.Types.EventsMessage) => void): Request<Redshift.Types.EventsMessage, AWSError>;
  /**
   * Returns information about the specified HSM client certificate. If no certificate ID is specified, returns information about all the HSM certificates owned by your Amazon Web Services account. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all HSM client certificates that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all HSM client certificates that have any combination of those values are returned. If both tag keys and values are omitted from the request, HSM client certificates are returned regardless of whether they have tag keys or values associated with them.
   */
  describeHsmClientCertificates(params: Redshift.Types.DescribeHsmClientCertificatesMessage, callback?: (err: AWSError, data: Redshift.Types.HsmClientCertificateMessage) => void): Request<Redshift.Types.HsmClientCertificateMessage, AWSError>;
  /**
   * Returns information about the specified HSM client certificate. If no certificate ID is specified, returns information about all the HSM certificates owned by your Amazon Web Services account. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all HSM client certificates that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all HSM client certificates that have any combination of those values are returned. If both tag keys and values are omitted from the request, HSM client certificates are returned regardless of whether they have tag keys or values associated with them.
   */
  describeHsmClientCertificates(callback?: (err: AWSError, data: Redshift.Types.HsmClientCertificateMessage) => void): Request<Redshift.Types.HsmClientCertificateMessage, AWSError>;
  /**
   * Returns information about the specified Amazon Redshift HSM configuration. If no configuration ID is specified, returns information about all the HSM configurations owned by your Amazon Web Services account. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all HSM connections that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all HSM connections that have any combination of those values are returned. If both tag keys and values are omitted from the request, HSM connections are returned regardless of whether they have tag keys or values associated with them.
   */
  describeHsmConfigurations(params: Redshift.Types.DescribeHsmConfigurationsMessage, callback?: (err: AWSError, data: Redshift.Types.HsmConfigurationMessage) => void): Request<Redshift.Types.HsmConfigurationMessage, AWSError>;
  /**
   * Returns information about the specified Amazon Redshift HSM configuration. If no configuration ID is specified, returns information about all the HSM configurations owned by your Amazon Web Services account. If you specify both tag keys and tag values in the same request, Amazon Redshift returns all HSM connections that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all HSM connections that have any combination of those values are returned. If both tag keys and values are omitted from the request, HSM connections are returned regardless of whether they have tag keys or values associated with them.
   */
  describeHsmConfigurations(callback?: (err: AWSError, data: Redshift.Types.HsmConfigurationMessage) => void): Request<Redshift.Types.HsmConfigurationMessage, AWSError>;
  /**
   * Describes whether information, such as queries and connection attempts, is being logged for the specified Amazon Redshift cluster.
   */
  describeLoggingStatus(params: Redshift.Types.DescribeLoggingStatusMessage, callback?: (err: AWSError, data: Redshift.Types.LoggingStatus) => void): Request<Redshift.Types.LoggingStatus, AWSError>;
  /**
   * Describes whether information, such as queries and connection attempts, is being logged for the specified Amazon Redshift cluster.
   */
  describeLoggingStatus(callback?: (err: AWSError, data: Redshift.Types.LoggingStatus) => void): Request<Redshift.Types.LoggingStatus, AWSError>;
  /**
   * Returns properties of possible node configurations such as node type, number of nodes, and disk usage for the specified action type.
   */
  describeNodeConfigurationOptions(params: Redshift.Types.DescribeNodeConfigurationOptionsMessage, callback?: (err: AWSError, data: Redshift.Types.NodeConfigurationOptionsMessage) => void): Request<Redshift.Types.NodeConfigurationOptionsMessage, AWSError>;
  /**
   * Returns properties of possible node configurations such as node type, number of nodes, and disk usage for the specified action type.
   */
  describeNodeConfigurationOptions(callback?: (err: AWSError, data: Redshift.Types.NodeConfigurationOptionsMessage) => void): Request<Redshift.Types.NodeConfigurationOptionsMessage, AWSError>;
  /**
   * Returns a list of orderable cluster options. Before you create a new cluster you can use this operation to find what options are available, such as the EC2 Availability Zones (AZ) in the specific Amazon Web Services Region that you can specify, and the node types you can request. The node types differ by available storage, memory, CPU and price. With the cost involved you might want to obtain a list of cluster options in the specific region and specify values when creating a cluster. For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide.
   */
  describeOrderableClusterOptions(params: Redshift.Types.DescribeOrderableClusterOptionsMessage, callback?: (err: AWSError, data: Redshift.Types.OrderableClusterOptionsMessage) => void): Request<Redshift.Types.OrderableClusterOptionsMessage, AWSError>;
  /**
   * Returns a list of orderable cluster options. Before you create a new cluster you can use this operation to find what options are available, such as the EC2 Availability Zones (AZ) in the specific Amazon Web Services Region that you can specify, and the node types you can request. The node types differ by available storage, memory, CPU and price. With the cost involved you might want to obtain a list of cluster options in the specific region and specify values when creating a cluster. For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide.
   */
  describeOrderableClusterOptions(callback?: (err: AWSError, data: Redshift.Types.OrderableClusterOptionsMessage) => void): Request<Redshift.Types.OrderableClusterOptionsMessage, AWSError>;
  /**
   * Returns information about the partner integrations defined for a cluster.
   */
  describePartners(params: Redshift.Types.DescribePartnersInputMessage, callback?: (err: AWSError, data: Redshift.Types.DescribePartnersOutputMessage) => void): Request<Redshift.Types.DescribePartnersOutputMessage, AWSError>;
  /**
   * Returns information about the partner integrations defined for a cluster.
   */
  describePartners(callback?: (err: AWSError, data: Redshift.Types.DescribePartnersOutputMessage) => void): Request<Redshift.Types.DescribePartnersOutputMessage, AWSError>;
  /**
   * Returns exchange status details and associated metadata for a reserved-node exchange. Statuses include such values as in progress and requested.
   */
  describeReservedNodeExchangeStatus(params: Redshift.Types.DescribeReservedNodeExchangeStatusInputMessage, callback?: (err: AWSError, data: Redshift.Types.DescribeReservedNodeExchangeStatusOutputMessage) => void): Request<Redshift.Types.DescribeReservedNodeExchangeStatusOutputMessage, AWSError>;
  /**
   * Returns exchange status details and associated metadata for a reserved-node exchange. Statuses include such values as in progress and requested.
   */
  describeReservedNodeExchangeStatus(callback?: (err: AWSError, data: Redshift.Types.DescribeReservedNodeExchangeStatusOutputMessage) => void): Request<Redshift.Types.DescribeReservedNodeExchangeStatusOutputMessage, AWSError>;
  /**
   * Returns a list of the available reserved node offerings by Amazon Redshift with their descriptions including the node type, the fixed and recurring costs of reserving the node and duration the node will be reserved for you. These descriptions help you determine which reserve node offering you want to purchase. You then use the unique offering ID in you call to PurchaseReservedNodeOffering to reserve one or more nodes for your Amazon Redshift cluster.   For more information about reserved node offerings, go to Purchasing Reserved Nodes in the Amazon Redshift Cluster Management Guide.
   */
  describeReservedNodeOfferings(params: Redshift.Types.DescribeReservedNodeOfferingsMessage, callback?: (err: AWSError, data: Redshift.Types.ReservedNodeOfferingsMessage) => void): Request<Redshift.Types.ReservedNodeOfferingsMessage, AWSError>;
  /**
   * Returns a list of the available reserved node offerings by Amazon Redshift with their descriptions including the node type, the fixed and recurring costs of reserving the node and duration the node will be reserved for you. These descriptions help you determine which reserve node offering you want to purchase. You then use the unique offering ID in you call to PurchaseReservedNodeOffering to reserve one or more nodes for your Amazon Redshift cluster.   For more information about reserved node offerings, go to Purchasing Reserved Nodes in the Amazon Redshift Cluster Management Guide.
   */
  describeReservedNodeOfferings(callback?: (err: AWSError, data: Redshift.Types.ReservedNodeOfferingsMessage) => void): Request<Redshift.Types.ReservedNodeOfferingsMessage, AWSError>;
  /**
   * Returns the descriptions of the reserved nodes.
   */
  describeReservedNodes(params: Redshift.Types.DescribeReservedNodesMessage, callback?: (err: AWSError, data: Redshift.Types.ReservedNodesMessage) => void): Request<Redshift.Types.ReservedNodesMessage, AWSError>;
  /**
   * Returns the descriptions of the reserved nodes.
   */
  describeReservedNodes(callback?: (err: AWSError, data: Redshift.Types.ReservedNodesMessage) => void): Request<Redshift.Types.ReservedNodesMessage, AWSError>;
  /**
   * Returns information about the last resize operation for the specified cluster. If no resize operation has ever been initiated for the specified cluster, a HTTP 404 error is returned. If a resize operation was initiated and completed, the status of the resize remains as SUCCEEDED until the next resize.  A resize operation can be requested using ModifyCluster and specifying a different number or type of nodes for the cluster. 
   */
  describeResize(params: Redshift.Types.DescribeResizeMessage, callback?: (err: AWSError, data: Redshift.Types.ResizeProgressMessage) => void): Request<Redshift.Types.ResizeProgressMessage, AWSError>;
  /**
   * Returns information about the last resize operation for the specified cluster. If no resize operation has ever been initiated for the specified cluster, a HTTP 404 error is returned. If a resize operation was initiated and completed, the status of the resize remains as SUCCEEDED until the next resize.  A resize operation can be requested using ModifyCluster and specifying a different number or type of nodes for the cluster. 
   */
  describeResize(callback?: (err: AWSError, data: Redshift.Types.ResizeProgressMessage) => void): Request<Redshift.Types.ResizeProgressMessage, AWSError>;
  /**
   * Describes properties of scheduled actions. 
   */
  describeScheduledActions(params: Redshift.Types.DescribeScheduledActionsMessage, callback?: (err: AWSError, data: Redshift.Types.ScheduledActionsMessage) => void): Request<Redshift.Types.ScheduledActionsMessage, AWSError>;
  /**
   * Describes properties of scheduled actions. 
   */
  describeScheduledActions(callback?: (err: AWSError, data: Redshift.Types.ScheduledActionsMessage) => void): Request<Redshift.Types.ScheduledActionsMessage, AWSError>;
  /**
   * Returns a list of snapshot copy grants owned by the Amazon Web Services account in the destination region.  For more information about managing snapshot copy grants, go to Amazon Redshift Database Encryption in the Amazon Redshift Cluster Management Guide. 
   */
  describeSnapshotCopyGrants(params: Redshift.Types.DescribeSnapshotCopyGrantsMessage, callback?: (err: AWSError, data: Redshift.Types.SnapshotCopyGrantMessage) => void): Request<Redshift.Types.SnapshotCopyGrantMessage, AWSError>;
  /**
   * Returns a list of snapshot copy grants owned by the Amazon Web Services account in the destination region.  For more information about managing snapshot copy grants, go to Amazon Redshift Database Encryption in the Amazon Redshift Cluster Management Guide. 
   */
  describeSnapshotCopyGrants(callback?: (err: AWSError, data: Redshift.Types.SnapshotCopyGrantMessage) => void): Request<Redshift.Types.SnapshotCopyGrantMessage, AWSError>;
  /**
   * Returns a list of snapshot schedules. 
   */
  describeSnapshotSchedules(params: Redshift.Types.DescribeSnapshotSchedulesMessage, callback?: (err: AWSError, data: Redshift.Types.DescribeSnapshotSchedulesOutputMessage) => void): Request<Redshift.Types.DescribeSnapshotSchedulesOutputMessage, AWSError>;
  /**
   * Returns a list of snapshot schedules. 
   */
  describeSnapshotSchedules(callback?: (err: AWSError, data: Redshift.Types.DescribeSnapshotSchedulesOutputMessage) => void): Request<Redshift.Types.DescribeSnapshotSchedulesOutputMessage, AWSError>;
  /**
   * Returns account level backups storage size and provisional storage.
   */
  describeStorage(callback?: (err: AWSError, data: Redshift.Types.CustomerStorageMessage) => void): Request<Redshift.Types.CustomerStorageMessage, AWSError>;
  /**
   * Lists the status of one or more table restore requests made using the RestoreTableFromClusterSnapshot API action. If you don't specify a value for the TableRestoreRequestId parameter, then DescribeTableRestoreStatus returns the status of all table restore requests ordered by the date and time of the request in ascending order. Otherwise DescribeTableRestoreStatus returns the status of the table specified by TableRestoreRequestId.
   */
  describeTableRestoreStatus(params: Redshift.Types.DescribeTableRestoreStatusMessage, callback?: (err: AWSError, data: Redshift.Types.TableRestoreStatusMessage) => void): Request<Redshift.Types.TableRestoreStatusMessage, AWSError>;
  /**
   * Lists the status of one or more table restore requests made using the RestoreTableFromClusterSnapshot API action. If you don't specify a value for the TableRestoreRequestId parameter, then DescribeTableRestoreStatus returns the status of all table restore requests ordered by the date and time of the request in ascending order. Otherwise DescribeTableRestoreStatus returns the status of the table specified by TableRestoreRequestId.
   */
  describeTableRestoreStatus(callback?: (err: AWSError, data: Redshift.Types.TableRestoreStatusMessage) => void): Request<Redshift.Types.TableRestoreStatusMessage, AWSError>;
  /**
   * Returns a list of tags. You can return tags from a specific resource by specifying an ARN, or you can return all tags for a given type of resource, such as clusters, snapshots, and so on. The following are limitations for DescribeTags:    You cannot specify an ARN and a resource-type value together in the same request.   You cannot use the MaxRecords and Marker parameters together with the ARN parameter.   The MaxRecords parameter can be a range from 10 to 50 results to return in a request.   If you specify both tag keys and tag values in the same request, Amazon Redshift returns all resources that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all resources that have any combination of those values are returned. If both tag keys and values are omitted from the request, resources are returned regardless of whether they have tag keys or values associated with them.
   */
  describeTags(params: Redshift.Types.DescribeTagsMessage, callback?: (err: AWSError, data: Redshift.Types.TaggedResourceListMessage) => void): Request<Redshift.Types.TaggedResourceListMessage, AWSError>;
  /**
   * Returns a list of tags. You can return tags from a specific resource by specifying an ARN, or you can return all tags for a given type of resource, such as clusters, snapshots, and so on. The following are limitations for DescribeTags:    You cannot specify an ARN and a resource-type value together in the same request.   You cannot use the MaxRecords and Marker parameters together with the ARN parameter.   The MaxRecords parameter can be a range from 10 to 50 results to return in a request.   If you specify both tag keys and tag values in the same request, Amazon Redshift returns all resources that match any combination of the specified keys and values. For example, if you have owner and environment for tag keys, and admin and test for tag values, all resources that have any combination of those values are returned. If both tag keys and values are omitted from the request, resources are returned regardless of whether they have tag keys or values associated with them.
   */
  describeTags(callback?: (err: AWSError, data: Redshift.Types.TaggedResourceListMessage) => void): Request<Redshift.Types.TaggedResourceListMessage, AWSError>;
  /**
   * Shows usage limits on a cluster. Results are filtered based on the combination of input usage limit identifier, cluster identifier, and feature type parameters:   If usage limit identifier, cluster identifier, and feature type are not provided, then all usage limit objects for the current account in the current region are returned.   If usage limit identifier is provided, then the corresponding usage limit object is returned.   If cluster identifier is provided, then all usage limit objects for the specified cluster are returned.   If cluster identifier and feature type are provided, then all usage limit objects for the combination of cluster and feature are returned.  
   */
  describeUsageLimits(params: Redshift.Types.DescribeUsageLimitsMessage, callback?: (err: AWSError, data: Redshift.Types.UsageLimitList) => void): Request<Redshift.Types.UsageLimitList, AWSError>;
  /**
   * Shows usage limits on a cluster. Results are filtered based on the combination of input usage limit identifier, cluster identifier, and feature type parameters:   If usage limit identifier, cluster identifier, and feature type are not provided, then all usage limit objects for the current account in the current region are returned.   If usage limit identifier is provided, then the corresponding usage limit object is returned.   If cluster identifier is provided, then all usage limit objects for the specified cluster are returned.   If cluster identifier and feature type are provided, then all usage limit objects for the combination of cluster and feature are returned.  
   */
  describeUsageLimits(callback?: (err: AWSError, data: Redshift.Types.UsageLimitList) => void): Request<Redshift.Types.UsageLimitList, AWSError>;
  /**
   * Stops logging information, such as queries and connection attempts, for the specified Amazon Redshift cluster.
   */
  disableLogging(params: Redshift.Types.DisableLoggingMessage, callback?: (err: AWSError, data: Redshift.Types.LoggingStatus) => void): Request<Redshift.Types.LoggingStatus, AWSError>;
  /**
   * Stops logging information, such as queries and connection attempts, for the specified Amazon Redshift cluster.
   */
  disableLogging(callback?: (err: AWSError, data: Redshift.Types.LoggingStatus) => void): Request<Redshift.Types.LoggingStatus, AWSError>;
  /**
   * Disables the automatic copying of snapshots from one region to another region for a specified cluster. If your cluster and its snapshots are encrypted using an encrypted symmetric key from Key Management Service, use DeleteSnapshotCopyGrant to delete the grant that grants Amazon Redshift permission to the key in the destination region. 
   */
  disableSnapshotCopy(params: Redshift.Types.DisableSnapshotCopyMessage, callback?: (err: AWSError, data: Redshift.Types.DisableSnapshotCopyResult) => void): Request<Redshift.Types.DisableSnapshotCopyResult, AWSError>;
  /**
   * Disables the automatic copying of snapshots from one region to another region for a specified cluster. If your cluster and its snapshots are encrypted using an encrypted symmetric key from Key Management Service, use DeleteSnapshotCopyGrant to delete the grant that grants Amazon Redshift permission to the key in the destination region. 
   */
  disableSnapshotCopy(callback?: (err: AWSError, data: Redshift.Types.DisableSnapshotCopyResult) => void): Request<Redshift.Types.DisableSnapshotCopyResult, AWSError>;
  /**
   * From a datashare consumer account, remove association for the specified datashare. 
   */
  disassociateDataShareConsumer(params: Redshift.Types.DisassociateDataShareConsumerMessage, callback?: (err: AWSError, data: Redshift.Types.DataShare) => void): Request<Redshift.Types.DataShare, AWSError>;
  /**
   * From a datashare consumer account, remove association for the specified datashare. 
   */
  disassociateDataShareConsumer(callback?: (err: AWSError, data: Redshift.Types.DataShare) => void): Request<Redshift.Types.DataShare, AWSError>;
  /**
   * Starts logging information, such as queries and connection attempts, for the specified Amazon Redshift cluster.
   */
  enableLogging(params: Redshift.Types.EnableLoggingMessage, callback?: (err: AWSError, data: Redshift.Types.LoggingStatus) => void): Request<Redshift.Types.LoggingStatus, AWSError>;
  /**
   * Starts logging information, such as queries and connection attempts, for the specified Amazon Redshift cluster.
   */
  enableLogging(callback?: (err: AWSError, data: Redshift.Types.LoggingStatus) => void): Request<Redshift.Types.LoggingStatus, AWSError>;
  /**
   * Enables the automatic copy of snapshots from one region to another region for a specified cluster.
   */
  enableSnapshotCopy(params: Redshift.Types.EnableSnapshotCopyMessage, callback?: (err: AWSError, data: Redshift.Types.EnableSnapshotCopyResult) => void): Request<Redshift.Types.EnableSnapshotCopyResult, AWSError>;
  /**
   * Enables the automatic copy of snapshots from one region to another region for a specified cluster.
   */
  enableSnapshotCopy(callback?: (err: AWSError, data: Redshift.Types.EnableSnapshotCopyResult) => void): Request<Redshift.Types.EnableSnapshotCopyResult, AWSError>;
  /**
   * Returns a database user name and temporary password with temporary authorization to log on to an Amazon Redshift database. The action returns the database user name prefixed with IAM: if AutoCreate is False or IAMA: if AutoCreate is True. You can optionally specify one or more database user groups that the user will join at log on. By default, the temporary credentials expire in 900 seconds. You can optionally specify a duration between 900 seconds (15 minutes) and 3600 seconds (60 minutes). For more information, see Using IAM Authentication to Generate Database User Credentials in the Amazon Redshift Cluster Management Guide. The Identity and Access Management (IAM) user or role that runs GetClusterCredentials must have an IAM policy attached that allows access to all necessary actions and resources. For more information about permissions, see Resource Policies for GetClusterCredentials in the Amazon Redshift Cluster Management Guide. If the DbGroups parameter is specified, the IAM policy must allow the redshift:JoinGroup action with access to the listed dbgroups.  In addition, if the AutoCreate parameter is set to True, then the policy must include the redshift:CreateClusterUser permission. If the DbName parameter is specified, the IAM policy must allow access to the resource dbname for the specified database name. 
   */
  getClusterCredentials(params: Redshift.Types.GetClusterCredentialsMessage, callback?: (err: AWSError, data: Redshift.Types.ClusterCredentials) => void): Request<Redshift.Types.ClusterCredentials, AWSError>;
  /**
   * Returns a database user name and temporary password with temporary authorization to log on to an Amazon Redshift database. The action returns the database user name prefixed with IAM: if AutoCreate is False or IAMA: if AutoCreate is True. You can optionally specify one or more database user groups that the user will join at log on. By default, the temporary credentials expire in 900 seconds. You can optionally specify a duration between 900 seconds (15 minutes) and 3600 seconds (60 minutes). For more information, see Using IAM Authentication to Generate Database User Credentials in the Amazon Redshift Cluster Management Guide. The Identity and Access Management (IAM) user or role that runs GetClusterCredentials must have an IAM policy attached that allows access to all necessary actions and resources. For more information about permissions, see Resource Policies for GetClusterCredentials in the Amazon Redshift Cluster Management Guide. If the DbGroups parameter is specified, the IAM policy must allow the redshift:JoinGroup action with access to the listed dbgroups.  In addition, if the AutoCreate parameter is set to True, then the policy must include the redshift:CreateClusterUser permission. If the DbName parameter is specified, the IAM policy must allow access to the resource dbname for the specified database name. 
   */
  getClusterCredentials(callback?: (err: AWSError, data: Redshift.Types.ClusterCredentials) => void): Request<Redshift.Types.ClusterCredentials, AWSError>;
  /**
   * Returns a database user name and temporary password with temporary authorization to log in to an Amazon Redshift database. The database user is mapped 1:1 to the source Identity and Access Management (IAM) identity. For more information about IAM identities, see IAM Identities (users, user groups, and roles) in the Amazon Web Services Identity and Access Management User Guide. The Identity and Access Management (IAM) identity that runs this operation must have an IAM policy attached that allows access to all necessary actions and resources. For more information about permissions, see Using identity-based policies (IAM policies) in the Amazon Redshift Cluster Management Guide. 
   */
  getClusterCredentialsWithIAM(params: Redshift.Types.GetClusterCredentialsWithIAMMessage, callback?: (err: AWSError, data: Redshift.Types.ClusterExtendedCredentials) => void): Request<Redshift.Types.ClusterExtendedCredentials, AWSError>;
  /**
   * Returns a database user name and temporary password with temporary authorization to log in to an Amazon Redshift database. The database user is mapped 1:1 to the source Identity and Access Management (IAM) identity. For more information about IAM identities, see IAM Identities (users, user groups, and roles) in the Amazon Web Services Identity and Access Management User Guide. The Identity and Access Management (IAM) identity that runs this operation must have an IAM policy attached that allows access to all necessary actions and resources. For more information about permissions, see Using identity-based policies (IAM policies) in the Amazon Redshift Cluster Management Guide. 
   */
  getClusterCredentialsWithIAM(callback?: (err: AWSError, data: Redshift.Types.ClusterExtendedCredentials) => void): Request<Redshift.Types.ClusterExtendedCredentials, AWSError>;
  /**
   * Gets the configuration options for the reserved-node exchange. These options include information about the source reserved node and target reserved node offering. Details include the node type, the price, the node count, and the offering type.
   */
  getReservedNodeExchangeConfigurationOptions(params: Redshift.Types.GetReservedNodeExchangeConfigurationOptionsInputMessage, callback?: (err: AWSError, data: Redshift.Types.GetReservedNodeExchangeConfigurationOptionsOutputMessage) => void): Request<Redshift.Types.GetReservedNodeExchangeConfigurationOptionsOutputMessage, AWSError>;
  /**
   * Gets the configuration options for the reserved-node exchange. These options include information about the source reserved node and target reserved node offering. Details include the node type, the price, the node count, and the offering type.
   */
  getReservedNodeExchangeConfigurationOptions(callback?: (err: AWSError, data: Redshift.Types.GetReservedNodeExchangeConfigurationOptionsOutputMessage) => void): Request<Redshift.Types.GetReservedNodeExchangeConfigurationOptionsOutputMessage, AWSError>;
  /**
   * Returns an array of DC2 ReservedNodeOfferings that matches the payment type, term, and usage price of the given DC1 reserved node.
   */
  getReservedNodeExchangeOfferings(params: Redshift.Types.GetReservedNodeExchangeOfferingsInputMessage, callback?: (err: AWSError, data: Redshift.Types.GetReservedNodeExchangeOfferingsOutputMessage) => void): Request<Redshift.Types.GetReservedNodeExchangeOfferingsOutputMessage, AWSError>;
  /**
   * Returns an array of DC2 ReservedNodeOfferings that matches the payment type, term, and usage price of the given DC1 reserved node.
   */
  getReservedNodeExchangeOfferings(callback?: (err: AWSError, data: Redshift.Types.GetReservedNodeExchangeOfferingsOutputMessage) => void): Request<Redshift.Types.GetReservedNodeExchangeOfferingsOutputMessage, AWSError>;
  /**
   * This operation is retired. Calling this operation does not change AQUA configuration. Amazon Redshift automatically determines whether to use AQUA (Advanced Query Accelerator). 
   */
  modifyAquaConfiguration(params: Redshift.Types.ModifyAquaInputMessage, callback?: (err: AWSError, data: Redshift.Types.ModifyAquaOutputMessage) => void): Request<Redshift.Types.ModifyAquaOutputMessage, AWSError>;
  /**
   * This operation is retired. Calling this operation does not change AQUA configuration. Amazon Redshift automatically determines whether to use AQUA (Advanced Query Accelerator). 
   */
  modifyAquaConfiguration(callback?: (err: AWSError, data: Redshift.Types.ModifyAquaOutputMessage) => void): Request<Redshift.Types.ModifyAquaOutputMessage, AWSError>;
  /**
   * Modifies an authentication profile.
   */
  modifyAuthenticationProfile(params: Redshift.Types.ModifyAuthenticationProfileMessage, callback?: (err: AWSError, data: Redshift.Types.ModifyAuthenticationProfileResult) => void): Request<Redshift.Types.ModifyAuthenticationProfileResult, AWSError>;
  /**
   * Modifies an authentication profile.
   */
  modifyAuthenticationProfile(callback?: (err: AWSError, data: Redshift.Types.ModifyAuthenticationProfileResult) => void): Request<Redshift.Types.ModifyAuthenticationProfileResult, AWSError>;
  /**
   * Modifies the settings for a cluster. You can also change node type and the number of nodes to scale up or down the cluster. When resizing a cluster, you must specify both the number of nodes and the node type even if one of the parameters does not change. You can add another security or parameter group, or change the admin user password. Resetting a cluster password or modifying the security groups associated with a cluster do not need a reboot. However, modifying a parameter group requires a reboot for parameters to take effect. For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide.
   */
  modifyCluster(params: Redshift.Types.ModifyClusterMessage, callback?: (err: AWSError, data: Redshift.Types.ModifyClusterResult) => void): Request<Redshift.Types.ModifyClusterResult, AWSError>;
  /**
   * Modifies the settings for a cluster. You can also change node type and the number of nodes to scale up or down the cluster. When resizing a cluster, you must specify both the number of nodes and the node type even if one of the parameters does not change. You can add another security or parameter group, or change the admin user password. Resetting a cluster password or modifying the security groups associated with a cluster do not need a reboot. However, modifying a parameter group requires a reboot for parameters to take effect. For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide.
   */
  modifyCluster(callback?: (err: AWSError, data: Redshift.Types.ModifyClusterResult) => void): Request<Redshift.Types.ModifyClusterResult, AWSError>;
  /**
   * Modifies the database revision of a cluster. The database revision is a unique revision of the database running in a cluster.
   */
  modifyClusterDbRevision(params: Redshift.Types.ModifyClusterDbRevisionMessage, callback?: (err: AWSError, data: Redshift.Types.ModifyClusterDbRevisionResult) => void): Request<Redshift.Types.ModifyClusterDbRevisionResult, AWSError>;
  /**
   * Modifies the database revision of a cluster. The database revision is a unique revision of the database running in a cluster.
   */
  modifyClusterDbRevision(callback?: (err: AWSError, data: Redshift.Types.ModifyClusterDbRevisionResult) => void): Request<Redshift.Types.ModifyClusterDbRevisionResult, AWSError>;
  /**
   * Modifies the list of Identity and Access Management (IAM) roles that can be used by the cluster to access other Amazon Web Services services. The maximum number of IAM roles that you can associate is subject to a quota. For more information, go to Quotas and limits in the Amazon Redshift Cluster Management Guide.
   */
  modifyClusterIamRoles(params: Redshift.Types.ModifyClusterIamRolesMessage, callback?: (err: AWSError, data: Redshift.Types.ModifyClusterIamRolesResult) => void): Request<Redshift.Types.ModifyClusterIamRolesResult, AWSError>;
  /**
   * Modifies the list of Identity and Access Management (IAM) roles that can be used by the cluster to access other Amazon Web Services services. The maximum number of IAM roles that you can associate is subject to a quota. For more information, go to Quotas and limits in the Amazon Redshift Cluster Management Guide.
   */
  modifyClusterIamRoles(callback?: (err: AWSError, data: Redshift.Types.ModifyClusterIamRolesResult) => void): Request<Redshift.Types.ModifyClusterIamRolesResult, AWSError>;
  /**
   * Modifies the maintenance settings of a cluster.
   */
  modifyClusterMaintenance(params: Redshift.Types.ModifyClusterMaintenanceMessage, callback?: (err: AWSError, data: Redshift.Types.ModifyClusterMaintenanceResult) => void): Request<Redshift.Types.ModifyClusterMaintenanceResult, AWSError>;
  /**
   * Modifies the maintenance settings of a cluster.
   */
  modifyClusterMaintenance(callback?: (err: AWSError, data: Redshift.Types.ModifyClusterMaintenanceResult) => void): Request<Redshift.Types.ModifyClusterMaintenanceResult, AWSError>;
  /**
   * Modifies the parameters of a parameter group. For the parameters parameter, it can't contain ASCII characters.  For more information about parameters and parameter groups, go to Amazon Redshift Parameter Groups in the Amazon Redshift Cluster Management Guide.
   */
  modifyClusterParameterGroup(params: Redshift.Types.ModifyClusterParameterGroupMessage, callback?: (err: AWSError, data: Redshift.Types.ClusterParameterGroupNameMessage) => void): Request<Redshift.Types.ClusterParameterGroupNameMessage, AWSError>;
  /**
   * Modifies the parameters of a parameter group. For the parameters parameter, it can't contain ASCII characters.  For more information about parameters and parameter groups, go to Amazon Redshift Parameter Groups in the Amazon Redshift Cluster Management Guide.
   */
  modifyClusterParameterGroup(callback?: (err: AWSError, data: Redshift.Types.ClusterParameterGroupNameMessage) => void): Request<Redshift.Types.ClusterParameterGroupNameMessage, AWSError>;
  /**
   * Modifies the settings for a snapshot. This exanmple modifies the manual retention period setting for a cluster snapshot.
   */
  modifyClusterSnapshot(params: Redshift.Types.ModifyClusterSnapshotMessage, callback?: (err: AWSError, data: Redshift.Types.ModifyClusterSnapshotResult) => void): Request<Redshift.Types.ModifyClusterSnapshotResult, AWSError>;
  /**
   * Modifies the settings for a snapshot. This exanmple modifies the manual retention period setting for a cluster snapshot.
   */
  modifyClusterSnapshot(callback?: (err: AWSError, data: Redshift.Types.ModifyClusterSnapshotResult) => void): Request<Redshift.Types.ModifyClusterSnapshotResult, AWSError>;
  /**
   * Modifies a snapshot schedule for a cluster.
   */
  modifyClusterSnapshotSchedule(params: Redshift.Types.ModifyClusterSnapshotScheduleMessage, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Modifies a snapshot schedule for a cluster.
   */
  modifyClusterSnapshotSchedule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Modifies a cluster subnet group to include the specified list of VPC subnets. The operation replaces the existing list of subnets with the new list of subnets.
   */
  modifyClusterSubnetGroup(params: Redshift.Types.ModifyClusterSubnetGroupMessage, callback?: (err: AWSError, data: Redshift.Types.ModifyClusterSubnetGroupResult) => void): Request<Redshift.Types.ModifyClusterSubnetGroupResult, AWSError>;
  /**
   * Modifies a cluster subnet group to include the specified list of VPC subnets. The operation replaces the existing list of subnets with the new list of subnets.
   */
  modifyClusterSubnetGroup(callback?: (err: AWSError, data: Redshift.Types.ModifyClusterSubnetGroupResult) => void): Request<Redshift.Types.ModifyClusterSubnetGroupResult, AWSError>;
  /**
   * Contains information for changing a custom domain association.
   */
  modifyCustomDomainAssociation(params: Redshift.Types.ModifyCustomDomainAssociationMessage, callback?: (err: AWSError, data: Redshift.Types.ModifyCustomDomainAssociationResult) => void): Request<Redshift.Types.ModifyCustomDomainAssociationResult, AWSError>;
  /**
   * Contains information for changing a custom domain association.
   */
  modifyCustomDomainAssociation(callback?: (err: AWSError, data: Redshift.Types.ModifyCustomDomainAssociationResult) => void): Request<Redshift.Types.ModifyCustomDomainAssociationResult, AWSError>;
  /**
   * Modifies a Redshift-managed VPC endpoint.
   */
  modifyEndpointAccess(params: Redshift.Types.ModifyEndpointAccessMessage, callback?: (err: AWSError, data: Redshift.Types.EndpointAccess) => void): Request<Redshift.Types.EndpointAccess, AWSError>;
  /**
   * Modifies a Redshift-managed VPC endpoint.
   */
  modifyEndpointAccess(callback?: (err: AWSError, data: Redshift.Types.EndpointAccess) => void): Request<Redshift.Types.EndpointAccess, AWSError>;
  /**
   * Modifies an existing Amazon Redshift event notification subscription.
   */
  modifyEventSubscription(params: Redshift.Types.ModifyEventSubscriptionMessage, callback?: (err: AWSError, data: Redshift.Types.ModifyEventSubscriptionResult) => void): Request<Redshift.Types.ModifyEventSubscriptionResult, AWSError>;
  /**
   * Modifies an existing Amazon Redshift event notification subscription.
   */
  modifyEventSubscription(callback?: (err: AWSError, data: Redshift.Types.ModifyEventSubscriptionResult) => void): Request<Redshift.Types.ModifyEventSubscriptionResult, AWSError>;
  /**
   * Modifies a scheduled action. 
   */
  modifyScheduledAction(params: Redshift.Types.ModifyScheduledActionMessage, callback?: (err: AWSError, data: Redshift.Types.ScheduledAction) => void): Request<Redshift.Types.ScheduledAction, AWSError>;
  /**
   * Modifies a scheduled action. 
   */
  modifyScheduledAction(callback?: (err: AWSError, data: Redshift.Types.ScheduledAction) => void): Request<Redshift.Types.ScheduledAction, AWSError>;
  /**
   * Modifies the number of days to retain snapshots in the destination Amazon Web Services Region after they are copied from the source Amazon Web Services Region. By default, this operation only changes the retention period of copied automated snapshots. The retention periods for both new and existing copied automated snapshots are updated with the new retention period. You can set the manual option to change only the retention periods of copied manual snapshots. If you set this option, only newly copied manual snapshots have the new retention period. 
   */
  modifySnapshotCopyRetentionPeriod(params: Redshift.Types.ModifySnapshotCopyRetentionPeriodMessage, callback?: (err: AWSError, data: Redshift.Types.ModifySnapshotCopyRetentionPeriodResult) => void): Request<Redshift.Types.ModifySnapshotCopyRetentionPeriodResult, AWSError>;
  /**
   * Modifies the number of days to retain snapshots in the destination Amazon Web Services Region after they are copied from the source Amazon Web Services Region. By default, this operation only changes the retention period of copied automated snapshots. The retention periods for both new and existing copied automated snapshots are updated with the new retention period. You can set the manual option to change only the retention periods of copied manual snapshots. If you set this option, only newly copied manual snapshots have the new retention period. 
   */
  modifySnapshotCopyRetentionPeriod(callback?: (err: AWSError, data: Redshift.Types.ModifySnapshotCopyRetentionPeriodResult) => void): Request<Redshift.Types.ModifySnapshotCopyRetentionPeriodResult, AWSError>;
  /**
   * Modifies a snapshot schedule. Any schedule associated with a cluster is modified asynchronously.
   */
  modifySnapshotSchedule(params: Redshift.Types.ModifySnapshotScheduleMessage, callback?: (err: AWSError, data: Redshift.Types.SnapshotSchedule) => void): Request<Redshift.Types.SnapshotSchedule, AWSError>;
  /**
   * Modifies a snapshot schedule. Any schedule associated with a cluster is modified asynchronously.
   */
  modifySnapshotSchedule(callback?: (err: AWSError, data: Redshift.Types.SnapshotSchedule) => void): Request<Redshift.Types.SnapshotSchedule, AWSError>;
  /**
   * Modifies a usage limit in a cluster. You can't modify the feature type or period of a usage limit.
   */
  modifyUsageLimit(params: Redshift.Types.ModifyUsageLimitMessage, callback?: (err: AWSError, data: Redshift.Types.UsageLimit) => void): Request<Redshift.Types.UsageLimit, AWSError>;
  /**
   * Modifies a usage limit in a cluster. You can't modify the feature type or period of a usage limit.
   */
  modifyUsageLimit(callback?: (err: AWSError, data: Redshift.Types.UsageLimit) => void): Request<Redshift.Types.UsageLimit, AWSError>;
  /**
   * Pauses a cluster.
   */
  pauseCluster(params: Redshift.Types.PauseClusterMessage, callback?: (err: AWSError, data: Redshift.Types.PauseClusterResult) => void): Request<Redshift.Types.PauseClusterResult, AWSError>;
  /**
   * Pauses a cluster.
   */
  pauseCluster(callback?: (err: AWSError, data: Redshift.Types.PauseClusterResult) => void): Request<Redshift.Types.PauseClusterResult, AWSError>;
  /**
   * Allows you to purchase reserved nodes. Amazon Redshift offers a predefined set of reserved node offerings. You can purchase one or more of the offerings. You can call the DescribeReservedNodeOfferings API to obtain the available reserved node offerings. You can call this API by providing a specific reserved node offering and the number of nodes you want to reserve.   For more information about reserved node offerings, go to Purchasing Reserved Nodes in the Amazon Redshift Cluster Management Guide.
   */
  purchaseReservedNodeOffering(params: Redshift.Types.PurchaseReservedNodeOfferingMessage, callback?: (err: AWSError, data: Redshift.Types.PurchaseReservedNodeOfferingResult) => void): Request<Redshift.Types.PurchaseReservedNodeOfferingResult, AWSError>;
  /**
   * Allows you to purchase reserved nodes. Amazon Redshift offers a predefined set of reserved node offerings. You can purchase one or more of the offerings. You can call the DescribeReservedNodeOfferings API to obtain the available reserved node offerings. You can call this API by providing a specific reserved node offering and the number of nodes you want to reserve.   For more information about reserved node offerings, go to Purchasing Reserved Nodes in the Amazon Redshift Cluster Management Guide.
   */
  purchaseReservedNodeOffering(callback?: (err: AWSError, data: Redshift.Types.PurchaseReservedNodeOfferingResult) => void): Request<Redshift.Types.PurchaseReservedNodeOfferingResult, AWSError>;
  /**
   * Reboots a cluster. This action is taken as soon as possible. It results in a momentary outage to the cluster, during which the cluster status is set to rebooting. A cluster event is created when the reboot is completed. Any pending cluster modifications (see ModifyCluster) are applied at this reboot. For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide. 
   */
  rebootCluster(params: Redshift.Types.RebootClusterMessage, callback?: (err: AWSError, data: Redshift.Types.RebootClusterResult) => void): Request<Redshift.Types.RebootClusterResult, AWSError>;
  /**
   * Reboots a cluster. This action is taken as soon as possible. It results in a momentary outage to the cluster, during which the cluster status is set to rebooting. A cluster event is created when the reboot is completed. Any pending cluster modifications (see ModifyCluster) are applied at this reboot. For more information about managing clusters, go to Amazon Redshift Clusters in the Amazon Redshift Cluster Management Guide. 
   */
  rebootCluster(callback?: (err: AWSError, data: Redshift.Types.RebootClusterResult) => void): Request<Redshift.Types.RebootClusterResult, AWSError>;
  /**
   * From a datashare consumer account, rejects the specified datashare.
   */
  rejectDataShare(params: Redshift.Types.RejectDataShareMessage, callback?: (err: AWSError, data: Redshift.Types.DataShare) => void): Request<Redshift.Types.DataShare, AWSError>;
  /**
   * From a datashare consumer account, rejects the specified datashare.
   */
  rejectDataShare(callback?: (err: AWSError, data: Redshift.Types.DataShare) => void): Request<Redshift.Types.DataShare, AWSError>;
  /**
   * Sets one or more parameters of the specified parameter group to their default values and sets the source values of the parameters to "engine-default". To reset the entire parameter group specify the ResetAllParameters parameter. For parameter changes to take effect you must reboot any associated clusters. 
   */
  resetClusterParameterGroup(params: Redshift.Types.ResetClusterParameterGroupMessage, callback?: (err: AWSError, data: Redshift.Types.ClusterParameterGroupNameMessage) => void): Request<Redshift.Types.ClusterParameterGroupNameMessage, AWSError>;
  /**
   * Sets one or more parameters of the specified parameter group to their default values and sets the source values of the parameters to "engine-default". To reset the entire parameter group specify the ResetAllParameters parameter. For parameter changes to take effect you must reboot any associated clusters. 
   */
  resetClusterParameterGroup(callback?: (err: AWSError, data: Redshift.Types.ClusterParameterGroupNameMessage) => void): Request<Redshift.Types.ClusterParameterGroupNameMessage, AWSError>;
  /**
   * Changes the size of the cluster. You can change the cluster's type, or change the number or type of nodes. The default behavior is to use the elastic resize method. With an elastic resize, your cluster is available for read and write operations more quickly than with the classic resize method.  Elastic resize operations have the following restrictions:   You can only resize clusters of the following types:   dc1.large (if your cluster is in a VPC)   dc1.8xlarge (if your cluster is in a VPC)   dc2.large   dc2.8xlarge   ds2.xlarge   ds2.8xlarge   ra3.xlplus   ra3.4xlarge   ra3.16xlarge     The type of nodes that you add must match the node type for the cluster.  
   */
  resizeCluster(params: Redshift.Types.ResizeClusterMessage, callback?: (err: AWSError, data: Redshift.Types.ResizeClusterResult) => void): Request<Redshift.Types.ResizeClusterResult, AWSError>;
  /**
   * Changes the size of the cluster. You can change the cluster's type, or change the number or type of nodes. The default behavior is to use the elastic resize method. With an elastic resize, your cluster is available for read and write operations more quickly than with the classic resize method.  Elastic resize operations have the following restrictions:   You can only resize clusters of the following types:   dc1.large (if your cluster is in a VPC)   dc1.8xlarge (if your cluster is in a VPC)   dc2.large   dc2.8xlarge   ds2.xlarge   ds2.8xlarge   ra3.xlplus   ra3.4xlarge   ra3.16xlarge     The type of nodes that you add must match the node type for the cluster.  
   */
  resizeCluster(callback?: (err: AWSError, data: Redshift.Types.ResizeClusterResult) => void): Request<Redshift.Types.ResizeClusterResult, AWSError>;
  /**
   * Creates a new cluster from a snapshot. By default, Amazon Redshift creates the resulting cluster with the same configuration as the original cluster from which the snapshot was created, except that the new cluster is created with the default cluster security and parameter groups. After Amazon Redshift creates the cluster, you can use the ModifyCluster API to associate a different security group and different parameter group with the restored cluster. If you are using a DS node type, you can also choose to change to another DS node type of the same size during restore. If you restore a cluster into a VPC, you must provide a cluster subnet group where you want the cluster restored.  For more information about working with snapshots, go to Amazon Redshift Snapshots in the Amazon Redshift Cluster Management Guide.
   */
  restoreFromClusterSnapshot(params: Redshift.Types.RestoreFromClusterSnapshotMessage, callback?: (err: AWSError, data: Redshift.Types.RestoreFromClusterSnapshotResult) => void): Request<Redshift.Types.RestoreFromClusterSnapshotResult, AWSError>;
  /**
   * Creates a new cluster from a snapshot. By default, Amazon Redshift creates the resulting cluster with the same configuration as the original cluster from which the snapshot was created, except that the new cluster is created with the default cluster security and parameter groups. After Amazon Redshift creates the cluster, you can use the ModifyCluster API to associate a different security group and different parameter group with the restored cluster. If you are using a DS node type, you can also choose to change to another DS node type of the same size during restore. If you restore a cluster into a VPC, you must provide a cluster subnet group where you want the cluster restored.  For more information about working with snapshots, go to Amazon Redshift Snapshots in the Amazon Redshift Cluster Management Guide.
   */
  restoreFromClusterSnapshot(callback?: (err: AWSError, data: Redshift.Types.RestoreFromClusterSnapshotResult) => void): Request<Redshift.Types.RestoreFromClusterSnapshotResult, AWSError>;
  /**
   * Creates a new table from a table in an Amazon Redshift cluster snapshot. You must create the new table within the Amazon Redshift cluster that the snapshot was taken from. You cannot use RestoreTableFromClusterSnapshot to restore a table with the same name as an existing table in an Amazon Redshift cluster. That is, you cannot overwrite an existing table in a cluster with a restored table. If you want to replace your original table with a new, restored table, then rename or drop your original table before you call RestoreTableFromClusterSnapshot. When you have renamed your original table, then you can pass the original name of the table as the NewTableName parameter value in the call to RestoreTableFromClusterSnapshot. This way, you can replace the original table with the table created from the snapshot. You can't use this operation to restore tables with interleaved sort keys.
   */
  restoreTableFromClusterSnapshot(params: Redshift.Types.RestoreTableFromClusterSnapshotMessage, callback?: (err: AWSError, data: Redshift.Types.RestoreTableFromClusterSnapshotResult) => void): Request<Redshift.Types.RestoreTableFromClusterSnapshotResult, AWSError>;
  /**
   * Creates a new table from a table in an Amazon Redshift cluster snapshot. You must create the new table within the Amazon Redshift cluster that the snapshot was taken from. You cannot use RestoreTableFromClusterSnapshot to restore a table with the same name as an existing table in an Amazon Redshift cluster. That is, you cannot overwrite an existing table in a cluster with a restored table. If you want to replace your original table with a new, restored table, then rename or drop your original table before you call RestoreTableFromClusterSnapshot. When you have renamed your original table, then you can pass the original name of the table as the NewTableName parameter value in the call to RestoreTableFromClusterSnapshot. This way, you can replace the original table with the table created from the snapshot. You can't use this operation to restore tables with interleaved sort keys.
   */
  restoreTableFromClusterSnapshot(callback?: (err: AWSError, data: Redshift.Types.RestoreTableFromClusterSnapshotResult) => void): Request<Redshift.Types.RestoreTableFromClusterSnapshotResult, AWSError>;
  /**
   * Resumes a paused cluster.
   */
  resumeCluster(params: Redshift.Types.ResumeClusterMessage, callback?: (err: AWSError, data: Redshift.Types.ResumeClusterResult) => void): Request<Redshift.Types.ResumeClusterResult, AWSError>;
  /**
   * Resumes a paused cluster.
   */
  resumeCluster(callback?: (err: AWSError, data: Redshift.Types.ResumeClusterResult) => void): Request<Redshift.Types.ResumeClusterResult, AWSError>;
  /**
   * Revokes an ingress rule in an Amazon Redshift security group for a previously authorized IP range or Amazon EC2 security group. To add an ingress rule, see AuthorizeClusterSecurityGroupIngress. For information about managing security groups, go to Amazon Redshift Cluster Security Groups in the Amazon Redshift Cluster Management Guide. 
   */
  revokeClusterSecurityGroupIngress(params: Redshift.Types.RevokeClusterSecurityGroupIngressMessage, callback?: (err: AWSError, data: Redshift.Types.RevokeClusterSecurityGroupIngressResult) => void): Request<Redshift.Types.RevokeClusterSecurityGroupIngressResult, AWSError>;
  /**
   * Revokes an ingress rule in an Amazon Redshift security group for a previously authorized IP range or Amazon EC2 security group. To add an ingress rule, see AuthorizeClusterSecurityGroupIngress. For information about managing security groups, go to Amazon Redshift Cluster Security Groups in the Amazon Redshift Cluster Management Guide. 
   */
  revokeClusterSecurityGroupIngress(callback?: (err: AWSError, data: Redshift.Types.RevokeClusterSecurityGroupIngressResult) => void): Request<Redshift.Types.RevokeClusterSecurityGroupIngressResult, AWSError>;
  /**
   * Revokes access to a cluster.
   */
  revokeEndpointAccess(params: Redshift.Types.RevokeEndpointAccessMessage, callback?: (err: AWSError, data: Redshift.Types.EndpointAuthorization) => void): Request<Redshift.Types.EndpointAuthorization, AWSError>;
  /**
   * Revokes access to a cluster.
   */
  revokeEndpointAccess(callback?: (err: AWSError, data: Redshift.Types.EndpointAuthorization) => void): Request<Redshift.Types.EndpointAuthorization, AWSError>;
  /**
   * Removes the ability of the specified Amazon Web Services account to restore the specified snapshot. If the account is currently restoring the snapshot, the restore will run to completion.  For more information about working with snapshots, go to Amazon Redshift Snapshots in the Amazon Redshift Cluster Management Guide.
   */
  revokeSnapshotAccess(params: Redshift.Types.RevokeSnapshotAccessMessage, callback?: (err: AWSError, data: Redshift.Types.RevokeSnapshotAccessResult) => void): Request<Redshift.Types.RevokeSnapshotAccessResult, AWSError>;
  /**
   * Removes the ability of the specified Amazon Web Services account to restore the specified snapshot. If the account is currently restoring the snapshot, the restore will run to completion.  For more information about working with snapshots, go to Amazon Redshift Snapshots in the Amazon Redshift Cluster Management Guide.
   */
  revokeSnapshotAccess(callback?: (err: AWSError, data: Redshift.Types.RevokeSnapshotAccessResult) => void): Request<Redshift.Types.RevokeSnapshotAccessResult, AWSError>;
  /**
   * Rotates the encryption keys for a cluster.
   */
  rotateEncryptionKey(params: Redshift.Types.RotateEncryptionKeyMessage, callback?: (err: AWSError, data: Redshift.Types.RotateEncryptionKeyResult) => void): Request<Redshift.Types.RotateEncryptionKeyResult, AWSError>;
  /**
   * Rotates the encryption keys for a cluster.
   */
  rotateEncryptionKey(callback?: (err: AWSError, data: Redshift.Types.RotateEncryptionKeyResult) => void): Request<Redshift.Types.RotateEncryptionKeyResult, AWSError>;
  /**
   * Updates the status of a partner integration.
   */
  updatePartnerStatus(params: Redshift.Types.UpdatePartnerStatusInputMessage, callback?: (err: AWSError, data: Redshift.Types.PartnerIntegrationOutputMessage) => void): Request<Redshift.Types.PartnerIntegrationOutputMessage, AWSError>;
  /**
   * Updates the status of a partner integration.
   */
  updatePartnerStatus(callback?: (err: AWSError, data: Redshift.Types.PartnerIntegrationOutputMessage) => void): Request<Redshift.Types.PartnerIntegrationOutputMessage, AWSError>;
  /**
   * Waits for the clusterAvailable state by periodically calling the underlying Redshift.describeClustersoperation every 60 seconds (at most 30 times).
   */
  waitFor(state: "clusterAvailable", params: Redshift.Types.DescribeClustersMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Redshift.Types.ClustersMessage) => void): Request<Redshift.Types.ClustersMessage, AWSError>;
  /**
   * Waits for the clusterAvailable state by periodically calling the underlying Redshift.describeClustersoperation every 60 seconds (at most 30 times).
   */
  waitFor(state: "clusterAvailable", callback?: (err: AWSError, data: Redshift.Types.ClustersMessage) => void): Request<Redshift.Types.ClustersMessage, AWSError>;
  /**
   * Waits for the clusterDeleted state by periodically calling the underlying Redshift.describeClustersoperation every 60 seconds (at most 30 times).
   */
  waitFor(state: "clusterDeleted", params: Redshift.Types.DescribeClustersMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Redshift.Types.ClustersMessage) => void): Request<Redshift.Types.ClustersMessage, AWSError>;
  /**
   * Waits for the clusterDeleted state by periodically calling the underlying Redshift.describeClustersoperation every 60 seconds (at most 30 times).
   */
  waitFor(state: "clusterDeleted", callback?: (err: AWSError, data: Redshift.Types.ClustersMessage) => void): Request<Redshift.Types.ClustersMessage, AWSError>;
  /**
   * Waits for the clusterRestored state by periodically calling the underlying Redshift.describeClustersoperation every 60 seconds (at most 30 times).
   */
  waitFor(state: "clusterRestored", params: Redshift.Types.DescribeClustersMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Redshift.Types.ClustersMessage) => void): Request<Redshift.Types.ClustersMessage, AWSError>;
  /**
   * Waits for the clusterRestored state by periodically calling the underlying Redshift.describeClustersoperation every 60 seconds (at most 30 times).
   */
  waitFor(state: "clusterRestored", callback?: (err: AWSError, data: Redshift.Types.ClustersMessage) => void): Request<Redshift.Types.ClustersMessage, AWSError>;
  /**
   * Waits for the snapshotAvailable state by periodically calling the underlying Redshift.describeClusterSnapshotsoperation every 15 seconds (at most 20 times).
   */
  waitFor(state: "snapshotAvailable", params: Redshift.Types.DescribeClusterSnapshotsMessage & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Redshift.Types.SnapshotMessage) => void): Request<Redshift.Types.SnapshotMessage, AWSError>;
  /**
   * Waits for the snapshotAvailable state by periodically calling the underlying Redshift.describeClusterSnapshotsoperation every 15 seconds (at most 20 times).
   */
  waitFor(state: "snapshotAvailable", callback?: (err: AWSError, data: Redshift.Types.SnapshotMessage) => void): Request<Redshift.Types.SnapshotMessage, AWSError>;
}
declare namespace Redshift {
  export interface AcceptReservedNodeExchangeInputMessage {
    /**
     * A string representing the node identifier of the DC1 Reserved Node to be exchanged.
     */
    ReservedNodeId: String;
    /**
     * The unique identifier of the DC2 Reserved Node offering to be used for the exchange. You can obtain the value for the parameter by calling GetReservedNodeExchangeOfferings 
     */
    TargetReservedNodeOfferingId: String;
  }
  export interface AcceptReservedNodeExchangeOutputMessage {
    /**
     * 
     */
    ExchangedReservedNode?: ReservedNode;
  }
  export interface AccountAttribute {
    /**
     * The name of the attribute.
     */
    AttributeName?: String;
    /**
     * A list of attribute values.
     */
    AttributeValues?: AttributeValueList;
  }
  export interface AccountAttributeList {
    /**
     * A list of attributes assigned to an account.
     */
    AccountAttributes?: AttributeList;
  }
  export interface AccountWithRestoreAccess {
    /**
     * The identifier of an Amazon Web Services account authorized to restore a snapshot.
     */
    AccountId?: String;
    /**
     * The identifier of an Amazon Web Services support account authorized to restore a snapshot. For Amazon Web Services Support, the identifier is amazon-redshift-support. 
     */
    AccountAlias?: String;
  }
  export type AccountsWithRestoreAccessList = AccountWithRestoreAccess[];
  export type ActionType = "restore-cluster"|"recommend-node-config"|"resize-cluster"|string;
  export interface AquaConfiguration {
    /**
     * This field is retired. Amazon Redshift automatically determines whether to use AQUA (Advanced Query Accelerator).
     */
    AquaStatus?: AquaStatus;
    /**
     * This field is retired. Amazon Redshift automatically determines whether to use AQUA (Advanced Query Accelerator).
     */
    AquaConfigurationStatus?: AquaConfigurationStatus;
  }
  export type AquaConfigurationStatus = "enabled"|"disabled"|"auto"|string;
  export type AquaStatus = "enabled"|"disabled"|"applying"|string;
  export interface AssociateDataShareConsumerMessage {
    /**
     * The Amazon Resource Name (ARN) of the datashare that the consumer is to use with the account or the namespace.
     */
    DataShareArn: String;
    /**
     * A value that specifies whether the datashare is associated with the entire account.
     */
    AssociateEntireAccount?: BooleanOptional;
    /**
     * The Amazon Resource Name (ARN) of the consumer that is associated with the datashare.
     */
    ConsumerArn?: String;
    /**
     * From a datashare consumer account, associates a datashare with all existing and future namespaces in the specified Amazon Web Services Region.
     */
    ConsumerRegion?: String;
  }
  export type AssociatedClusterList = ClusterAssociatedToSchedule[];
  export interface Association {
    /**
     * The Amazon Resource Name (ARN) for the certificate associated with the custom domain.
     */
    CustomDomainCertificateArn?: String;
    /**
     * The expiration date for the certificate.
     */
    CustomDomainCertificateExpiryDate?: TStamp;
    /**
     * A list of all associated clusters and domain names tied to a specific certificate.
     */
    CertificateAssociations?: CertificateAssociationList;
  }
  export type AssociationList = Association[];
  export type AttributeList = AccountAttribute[];
  export type AttributeNameList = String[];
  export type AttributeValueList = AttributeValueTarget[];
  export interface AttributeValueTarget {
    /**
     * The value of the attribute.
     */
    AttributeValue?: String;
  }
  export interface AuthenticationProfile {
    /**
     * The name of the authentication profile.
     */
    AuthenticationProfileName?: AuthenticationProfileNameString;
    /**
     * The content of the authentication profile in JSON format. The maximum length of the JSON string is determined by a quota for your account.
     */
    AuthenticationProfileContent?: String;
  }
  export type AuthenticationProfileList = AuthenticationProfile[];
  export type AuthenticationProfileNameString = string;
  export type AuthorizationStatus = "Authorized"|"Revoking"|string;
  export interface AuthorizeClusterSecurityGroupIngressMessage {
    /**
     * The name of the security group to which the ingress rule is added.
     */
    ClusterSecurityGroupName: String;
    /**
     * The IP range to be added the Amazon Redshift security group.
     */
    CIDRIP?: String;
    /**
     * The EC2 security group to be added the Amazon Redshift security group.
     */
    EC2SecurityGroupName?: String;
    /**
     * The Amazon Web Services account number of the owner of the security group specified by the EC2SecurityGroupName parameter. The Amazon Web Services Access Key ID is not an acceptable value.  Example: 111122223333 
     */
    EC2SecurityGroupOwnerId?: String;
  }
  export interface AuthorizeClusterSecurityGroupIngressResult {
    ClusterSecurityGroup?: ClusterSecurityGroup;
  }
  export interface AuthorizeDataShareMessage {
    /**
     * The Amazon Resource Name (ARN) of the datashare that producers are to authorize sharing for.
     */
    DataShareArn: String;
    /**
     * The identifier of the data consumer that is authorized to access the datashare. This identifier is an Amazon Web Services account ID or a keyword, such as ADX.
     */
    ConsumerIdentifier: String;
  }
  export interface AuthorizeEndpointAccessMessage {
    /**
     * The cluster identifier of the cluster to grant access to.
     */
    ClusterIdentifier?: String;
    /**
     * The Amazon Web Services account ID to grant access to.
     */
    Account: String;
    /**
     * The virtual private cloud (VPC) identifiers to grant access to.
     */
    VpcIds?: VpcIdentifierList;
  }
  export interface AuthorizeSnapshotAccessMessage {
    /**
     * The identifier of the snapshot the account is authorized to restore.
     */
    SnapshotIdentifier?: String;
    /**
     * The Amazon Resource Name (ARN) of the snapshot to authorize access to.
     */
    SnapshotArn?: String;
    /**
     * The identifier of the cluster the snapshot was created from. This parameter is required if your IAM user has a policy containing a snapshot resource element that specifies anything other than * for the cluster name.
     */
    SnapshotClusterIdentifier?: String;
    /**
     * The identifier of the Amazon Web Services account authorized to restore the specified snapshot. To share a snapshot with Amazon Web Services Support, specify amazon-redshift-support.
     */
    AccountWithRestoreAccess: String;
  }
  export interface AuthorizeSnapshotAccessResult {
    Snapshot?: Snapshot;
  }
  export interface AvailabilityZone {
    /**
     * The name of the availability zone.
     */
    Name?: String;
    /**
     * 
     */
    SupportedPlatforms?: SupportedPlatformsList;
  }
  export type AvailabilityZoneList = AvailabilityZone[];
  export interface BatchDeleteClusterSnapshotsRequest {
    /**
     * A list of identifiers for the snapshots that you want to delete.
     */
    Identifiers: DeleteClusterSnapshotMessageList;
  }
  export interface BatchDeleteClusterSnapshotsResult {
    /**
     * A list of the snapshot identifiers that were deleted. 
     */
    Resources?: SnapshotIdentifierList;
    /**
     * A list of any errors returned.
     */
    Errors?: BatchSnapshotOperationErrorList;
  }
  export interface BatchModifyClusterSnapshotsMessage {
    /**
     * A list of snapshot identifiers you want to modify.
     */
    SnapshotIdentifierList: SnapshotIdentifierList;
    /**
     * The number of days that a manual snapshot is retained. If you specify the value -1, the manual snapshot is retained indefinitely. The number must be either -1 or an integer between 1 and 3,653. If you decrease the manual snapshot retention period from its current value, existing manual snapshots that fall outside of the new retention period will return an error. If you want to suppress the errors and delete the snapshots, use the force option. 
     */
    ManualSnapshotRetentionPeriod?: IntegerOptional;
    /**
     * A boolean value indicating whether to override an exception if the retention period has passed. 
     */
    Force?: Boolean;
  }
  export interface BatchModifyClusterSnapshotsOutputMessage {
    /**
     * A list of the snapshots that were modified.
     */
    Resources?: SnapshotIdentifierList;
    /**
     * A list of any errors returned.
     */
    Errors?: BatchSnapshotOperationErrors;
  }
  export type BatchSnapshotOperationErrorList = SnapshotErrorMessage[];
  export type BatchSnapshotOperationErrors = SnapshotErrorMessage[];
  export type Boolean = boolean;
  export type BooleanOptional = boolean;
  export interface CancelResizeMessage {
    /**
     * The unique identifier for the cluster that you want to cancel a resize operation for.
     */
    ClusterIdentifier: String;
  }
  export interface CertificateAssociation {
    /**
     * The custom domain name for the certificate association.
     */
    CustomDomainName?: String;
    /**
     * The cluster identifier for the certificate association.
     */
    ClusterIdentifier?: String;
  }
  export type CertificateAssociationList = CertificateAssociation[];
  export interface Cluster {
    /**
     * The unique identifier of the cluster.
     */
    ClusterIdentifier?: String;
    /**
     * The node type for the nodes in the cluster.
     */
    NodeType?: String;
    /**
     *  The current state of the cluster. Possible values are the following:    available     available, prep-for-resize     available, resize-cleanup     cancelling-resize     creating     deleting     final-snapshot     hardware-failure     incompatible-hsm     incompatible-network     incompatible-parameters     incompatible-restore     modifying     paused     rebooting     renaming     resizing     rotating-keys     storage-full     updating-hsm   
     */
    ClusterStatus?: String;
    /**
     * The availability status of the cluster for queries. Possible values are the following:   Available - The cluster is available for queries.    Unavailable - The cluster is not available for queries.   Maintenance - The cluster is intermittently available for queries due to maintenance activities.   Modifying - The cluster is intermittently available for queries due to changes that modify the cluster.   Failed - The cluster failed and is not available for queries.  
     */
    ClusterAvailabilityStatus?: String;
    /**
     * The status of a modify operation, if any, initiated for the cluster.
     */
    ModifyStatus?: String;
    /**
     * The admin user name for the cluster. This name is used to connect to the database that is specified in the DBName parameter. 
     */
    MasterUsername?: String;
    /**
     * The name of the initial database that was created when the cluster was created. This same name is returned for the life of the cluster. If an initial database was not specified, a database named devdev was created by default. 
     */
    DBName?: String;
    /**
     * The connection endpoint.
     */
    Endpoint?: Endpoint;
    /**
     * The date and time that the cluster was created.
     */
    ClusterCreateTime?: TStamp;
    /**
     * The number of days that automatic cluster snapshots are retained.
     */
    AutomatedSnapshotRetentionPeriod?: Integer;
    /**
     * The default number of days to retain a manual snapshot. If the value is -1, the snapshot is retained indefinitely. This setting doesn't change the retention period of existing snapshots. The value must be either -1 or an integer between 1 and 3,653.
     */
    ManualSnapshotRetentionPeriod?: Integer;
    /**
     * A list of cluster security group that are associated with the cluster. Each security group is represented by an element that contains ClusterSecurityGroup.Name and ClusterSecurityGroup.Status subelements.  Cluster security groups are used when the cluster is not created in an Amazon Virtual Private Cloud (VPC). Clusters that are created in a VPC use VPC security groups, which are listed by the VpcSecurityGroups parameter. 
     */
    ClusterSecurityGroups?: ClusterSecurityGroupMembershipList;
    /**
     * A list of Amazon Virtual Private Cloud (Amazon VPC) security groups that are associated with the cluster. This parameter is returned only if the cluster is in a VPC.
     */
    VpcSecurityGroups?: VpcSecurityGroupMembershipList;
    /**
     * The list of cluster parameter groups that are associated with this cluster. Each parameter group in the list is returned with its status.
     */
    ClusterParameterGroups?: ClusterParameterGroupStatusList;
    /**
     * The name of the subnet group that is associated with the cluster. This parameter is valid only when the cluster is in a VPC.
     */
    ClusterSubnetGroupName?: String;
    /**
     * The identifier of the VPC the cluster is in, if the cluster is in a VPC.
     */
    VpcId?: String;
    /**
     * The name of the Availability Zone in which the cluster is located.
     */
    AvailabilityZone?: String;
    /**
     * The weekly time range, in Universal Coordinated Time (UTC), during which system maintenance can occur.
     */
    PreferredMaintenanceWindow?: String;
    /**
     * A value that, if present, indicates that changes to the cluster are pending. Specific pending changes are identified by subelements.
     */
    PendingModifiedValues?: PendingModifiedValues;
    /**
     * The version ID of the Amazon Redshift engine that is running on the cluster.
     */
    ClusterVersion?: String;
    /**
     * A boolean value that, if true, indicates that major version upgrades will be applied automatically to the cluster during the maintenance window. 
     */
    AllowVersionUpgrade?: Boolean;
    /**
     * The number of compute nodes in the cluster.
     */
    NumberOfNodes?: Integer;
    /**
     * A boolean value that, if true, indicates that the cluster can be accessed from a public network.
     */
    PubliclyAccessible?: Boolean;
    /**
     * A boolean value that, if true, indicates that data in the cluster is encrypted at rest.
     */
    Encrypted?: Boolean;
    /**
     * A value that describes the status of a cluster restore action. This parameter returns null if the cluster was not created by restoring a snapshot.
     */
    RestoreStatus?: RestoreStatus;
    /**
     * 
     */
    DataTransferProgress?: DataTransferProgress;
    /**
     * A value that reports whether the Amazon Redshift cluster has finished applying any hardware security module (HSM) settings changes specified in a modify cluster command. Values: active, applying
     */
    HsmStatus?: HsmStatus;
    /**
     * A value that returns the destination region and retention period that are configured for cross-region snapshot copy.
     */
    ClusterSnapshotCopyStatus?: ClusterSnapshotCopyStatus;
    /**
     * The public key for the cluster.
     */
    ClusterPublicKey?: String;
    /**
     * The nodes in the cluster.
     */
    ClusterNodes?: ClusterNodesList;
    /**
     * The status of the elastic IP (EIP) address.
     */
    ElasticIpStatus?: ElasticIpStatus;
    /**
     * The specific revision number of the database in the cluster.
     */
    ClusterRevisionNumber?: String;
    /**
     * The list of tags for the cluster.
     */
    Tags?: TagList;
    /**
     * The Key Management Service (KMS) key ID of the encryption key used to encrypt data in the cluster.
     */
    KmsKeyId?: String;
    /**
     * An option that specifies whether to create the cluster with enhanced VPC routing enabled. To create a cluster that uses enhanced VPC routing, the cluster must be in a VPC. For more information, see Enhanced VPC Routing in the Amazon Redshift Cluster Management Guide. If this option is true, enhanced VPC routing is enabled.  Default: false
     */
    EnhancedVpcRouting?: Boolean;
    /**
     * A list of Identity and Access Management (IAM) roles that can be used by the cluster to access other Amazon Web Services services.
     */
    IamRoles?: ClusterIamRoleList;
    /**
     * Cluster operations that are waiting to be started.
     */
    PendingActions?: PendingActionsList;
    /**
     * The name of the maintenance track for the cluster.
     */
    MaintenanceTrackName?: String;
    /**
     * The number of nodes that you can resize the cluster to with the elastic resize method. 
     */
    ElasticResizeNumberOfNodeOptions?: String;
    /**
     * Describes a group of DeferredMaintenanceWindow objects.
     */
    DeferredMaintenanceWindows?: DeferredMaintenanceWindowsList;
    /**
     * A unique identifier for the cluster snapshot schedule.
     */
    SnapshotScheduleIdentifier?: String;
    /**
     * The current state of the cluster snapshot schedule.
     */
    SnapshotScheduleState?: ScheduleState;
    /**
     * The date and time when the next snapshot is expected to be taken for clusters with a valid snapshot schedule and backups enabled. 
     */
    ExpectedNextSnapshotScheduleTime?: TStamp;
    /**
     *  The status of next expected snapshot for clusters having a valid snapshot schedule and backups enabled. Possible values are the following:   OnTrack - The next snapshot is expected to be taken on time.    Pending - The next snapshot is pending to be taken.   
     */
    ExpectedNextSnapshotScheduleTimeStatus?: String;
    /**
     * The date and time in UTC when system maintenance can begin.
     */
    NextMaintenanceWindowStartTime?: TStamp;
    /**
     * Returns the following:   AllowCancelResize: a boolean value indicating if the resize operation can be cancelled.   ResizeType: Returns ClassicResize  
     */
    ResizeInfo?: ResizeInfo;
    /**
     * Describes the status of the Availability Zone relocation operation.
     */
    AvailabilityZoneRelocationStatus?: String;
    /**
     * The namespace Amazon Resource Name (ARN) of the cluster.
     */
    ClusterNamespaceArn?: String;
    /**
     * The total storage capacity of the cluster in megabytes. 
     */
    TotalStorageCapacityInMegaBytes?: LongOptional;
    /**
     * This field is retired. Amazon Redshift automatically determines whether to use AQUA (Advanced Query Accelerator).
     */
    AquaConfiguration?: AquaConfiguration;
    /**
     * The Amazon Resource Name (ARN) for the IAM role set as default for the cluster.
     */
    DefaultIamRoleArn?: String;
    /**
     * The status of the reserved-node exchange request. Statuses include in-progress and requested.
     */
    ReservedNodeExchangeStatus?: ReservedNodeExchangeStatus;
    /**
     * The custom domain name associated with the cluster.
     */
    CustomDomainName?: String;
    /**
     * The certificate Amazon Resource Name (ARN) for the custom domain name.
     */
    CustomDomainCertificateArn?: String;
    /**
     * The expiration date for the certificate associated with the custom domain name.
     */
    CustomDomainCertificateExpiryDate?: TStamp;
  }
  export interface ClusterAssociatedToSchedule {
    /**
     * 
     */
    ClusterIdentifier?: String;
    /**
     * 
     */
    ScheduleAssociationState?: ScheduleState;
  }
  export interface ClusterCredentials {
    /**
     * A database user name that is authorized to log on to the database DbName using the password DbPassword. If the specified DbUser exists in the database, the new user name has the same database permissions as the the user named in DbUser. By default, the user is added to PUBLIC. If the DbGroups parameter is specifed, DbUser is added to the listed groups for any sessions created using these credentials.
     */
    DbUser?: String;
    /**
     * A temporary password that authorizes the user name returned by DbUser to log on to the database DbName. 
     */
    DbPassword?: SensitiveString;
    /**
     * The date and time the password in DbPassword expires.
     */
    Expiration?: TStamp;
  }
  export interface ClusterDbRevision {
    /**
     * The unique identifier of the cluster.
     */
    ClusterIdentifier?: String;
    /**
     * A string representing the current cluster version.
     */
    CurrentDatabaseRevision?: String;
    /**
     * The date on which the database revision was released.
     */
    DatabaseRevisionReleaseDate?: TStamp;
    /**
     * A list of RevisionTarget objects, where each object describes the database revision that a cluster can be updated to.
     */
    RevisionTargets?: RevisionTargetsList;
  }
  export type ClusterDbRevisionsList = ClusterDbRevision[];
  export interface ClusterDbRevisionsMessage {
    /**
     * A string representing the starting point for the next set of revisions. If a value is returned in a response, you can retrieve the next set of revisions by providing the value in the marker parameter and retrying the command. If the marker field is empty, all revisions have already been returned.
     */
    Marker?: String;
    /**
     * A list of revisions.
     */
    ClusterDbRevisions?: ClusterDbRevisionsList;
  }
  export interface ClusterExtendedCredentials {
    /**
     * A database user name that you provide when you connect to a database. The database user is mapped 1:1 to the source IAM identity. 
     */
    DbUser?: String;
    /**
     * A temporary password that you provide when you connect to a database.
     */
    DbPassword?: SensitiveString;
    /**
     * The time (UTC) when the temporary password expires. After this timestamp, a log in with the temporary password fails.
     */
    Expiration?: TStamp;
    /**
     * Reserved for future use.
     */
    NextRefreshTime?: TStamp;
  }
  export interface ClusterIamRole {
    /**
     * The Amazon Resource Name (ARN) of the IAM role, for example, arn:aws:iam::123456789012:role/RedshiftCopyUnload. 
     */
    IamRoleArn?: String;
    /**
     * A value that describes the status of the IAM role's association with an Amazon Redshift cluster. The following are possible statuses and descriptions.    in-sync: The role is available for use by the cluster.    adding: The role is in the process of being associated with the cluster.    removing: The role is in the process of being disassociated with the cluster.  
     */
    ApplyStatus?: String;
  }
  export type ClusterIamRoleList = ClusterIamRole[];
  export type ClusterList = Cluster[];
  export interface ClusterNode {
    /**
     * Whether the node is a leader node or a compute node.
     */
    NodeRole?: String;
    /**
     * The private IP address of a node within a cluster.
     */
    PrivateIPAddress?: String;
    /**
     * The public IP address of a node within a cluster.
     */
    PublicIPAddress?: String;
  }
  export type ClusterNodesList = ClusterNode[];
  export interface ClusterParameterGroup {
    /**
     * The name of the cluster parameter group.
     */
    ParameterGroupName?: String;
    /**
     * The name of the cluster parameter group family that this cluster parameter group is compatible with.
     */
    ParameterGroupFamily?: String;
    /**
     * The description of the parameter group.
     */
    Description?: String;
    /**
     * The list of tags for the cluster parameter group.
     */
    Tags?: TagList;
  }
  export interface ClusterParameterGroupDetails {
    /**
     * A list of Parameter instances. Each instance lists the parameters of one cluster parameter group. 
     */
    Parameters?: ParametersList;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
  }
  export interface ClusterParameterGroupNameMessage {
    /**
     * The name of the cluster parameter group.
     */
    ParameterGroupName?: String;
    /**
     * The status of the parameter group. For example, if you made a change to a parameter group name-value pair, then the change could be pending a reboot of an associated cluster.
     */
    ParameterGroupStatus?: String;
  }
  export interface ClusterParameterGroupStatus {
    /**
     * The name of the cluster parameter group.
     */
    ParameterGroupName?: String;
    /**
     * The status of parameter updates.
     */
    ParameterApplyStatus?: String;
    /**
     * The list of parameter statuses.  For more information about parameters and parameter groups, go to Amazon Redshift Parameter Groups in the Amazon Redshift Cluster Management Guide.
     */
    ClusterParameterStatusList?: ClusterParameterStatusList;
  }
  export type ClusterParameterGroupStatusList = ClusterParameterGroupStatus[];
  export interface ClusterParameterGroupsMessage {
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
    /**
     * A list of ClusterParameterGroup instances. Each instance describes one cluster parameter group. 
     */
    ParameterGroups?: ParameterGroupList;
  }
  export interface ClusterParameterStatus {
    /**
     * The name of the parameter.
     */
    ParameterName?: String;
    /**
     * The status of the parameter that indicates whether the parameter is in sync with the database, waiting for a cluster reboot, or encountered an error when being applied. The following are possible statuses and descriptions.    in-sync: The parameter value is in sync with the database.    pending-reboot: The parameter value will be applied after the cluster reboots.    applying: The parameter value is being applied to the database.    invalid-parameter: Cannot apply the parameter value because it has an invalid value or syntax.    apply-deferred: The parameter contains static property changes. The changes are deferred until the cluster reboots.    apply-error: Cannot connect to the cluster. The parameter change will be applied after the cluster reboots.    unknown-error: Cannot apply the parameter change right now. The change will be applied after the cluster reboots.  
     */
    ParameterApplyStatus?: String;
    /**
     * The error that prevented the parameter from being applied to the database.
     */
    ParameterApplyErrorDescription?: String;
  }
  export type ClusterParameterStatusList = ClusterParameterStatus[];
  export interface ClusterSecurityGroup {
    /**
     * The name of the cluster security group to which the operation was applied.
     */
    ClusterSecurityGroupName?: String;
    /**
     * A description of the security group.
     */
    Description?: String;
    /**
     * A list of EC2 security groups that are permitted to access clusters associated with this cluster security group.
     */
    EC2SecurityGroups?: EC2SecurityGroupList;
    /**
     * A list of IP ranges (CIDR blocks) that are permitted to access clusters associated with this cluster security group.
     */
    IPRanges?: IPRangeList;
    /**
     * The list of tags for the cluster security group.
     */
    Tags?: TagList;
  }
  export interface ClusterSecurityGroupMembership {
    /**
     * The name of the cluster security group.
     */
    ClusterSecurityGroupName?: String;
    /**
     * The status of the cluster security group.
     */
    Status?: String;
  }
  export type ClusterSecurityGroupMembershipList = ClusterSecurityGroupMembership[];
  export interface ClusterSecurityGroupMessage {
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
    /**
     * A list of ClusterSecurityGroup instances. 
     */
    ClusterSecurityGroups?: ClusterSecurityGroups;
  }
  export type ClusterSecurityGroupNameList = String[];
  export type ClusterSecurityGroups = ClusterSecurityGroup[];
  export interface ClusterSnapshotCopyStatus {
    /**
     * The destination region that snapshots are automatically copied to when cross-region snapshot copy is enabled.
     */
    DestinationRegion?: String;
    /**
     * The number of days that automated snapshots are retained in the destination region after they are copied from a source region.
     */
    RetentionPeriod?: Long;
    /**
     * The number of days that automated snapshots are retained in the destination region after they are copied from a source region. If the value is -1, the manual snapshot is retained indefinitely.  The value must be either -1 or an integer between 1 and 3,653.
     */
    ManualSnapshotRetentionPeriod?: Integer;
    /**
     * The name of the snapshot copy grant.
     */
    SnapshotCopyGrantName?: String;
  }
  export interface ClusterSubnetGroup {
    /**
     * The name of the cluster subnet group.
     */
    ClusterSubnetGroupName?: String;
    /**
     * The description of the cluster subnet group.
     */
    Description?: String;
    /**
     * The VPC ID of the cluster subnet group.
     */
    VpcId?: String;
    /**
     * The status of the cluster subnet group. Possible values are Complete, Incomplete and Invalid. 
     */
    SubnetGroupStatus?: String;
    /**
     * A list of the VPC Subnet elements. 
     */
    Subnets?: SubnetList;
    /**
     * The list of tags for the cluster subnet group.
     */
    Tags?: TagList;
  }
  export interface ClusterSubnetGroupMessage {
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
    /**
     * A list of ClusterSubnetGroup instances. 
     */
    ClusterSubnetGroups?: ClusterSubnetGroups;
  }
  export type ClusterSubnetGroups = ClusterSubnetGroup[];
  export interface ClusterVersion {
    /**
     * The version number used by the cluster.
     */
    ClusterVersion?: String;
    /**
     * The name of the cluster parameter group family for the cluster.
     */
    ClusterParameterGroupFamily?: String;
    /**
     * The description of the cluster version.
     */
    Description?: String;
  }
  export type ClusterVersionList = ClusterVersion[];
  export interface ClusterVersionsMessage {
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
    /**
     * A list of Version elements. 
     */
    ClusterVersions?: ClusterVersionList;
  }
  export interface ClustersMessage {
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
    /**
     * A list of Cluster objects, where each object describes one cluster. 
     */
    Clusters?: ClusterList;
  }
  export interface CopyClusterSnapshotMessage {
    /**
     * The identifier for the source snapshot. Constraints:   Must be the identifier for a valid automated snapshot whose state is available.  
     */
    SourceSnapshotIdentifier: String;
    /**
     * The identifier of the cluster the source snapshot was created from. This parameter is required if your IAM user has a policy containing a snapshot resource element that specifies anything other than * for the cluster name. Constraints:   Must be the identifier for a valid cluster.  
     */
    SourceSnapshotClusterIdentifier?: String;
    /**
     * The identifier given to the new manual snapshot. Constraints:   Cannot be null, empty, or blank.   Must contain from 1 to 255 alphanumeric characters or hyphens.   First character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.   Must be unique for the Amazon Web Services account that is making the request.  
     */
    TargetSnapshotIdentifier: String;
    /**
     * The number of days that a manual snapshot is retained. If the value is -1, the manual snapshot is retained indefinitely.  The value must be either -1 or an integer between 1 and 3,653. The default value is -1.
     */
    ManualSnapshotRetentionPeriod?: IntegerOptional;
  }
  export interface CopyClusterSnapshotResult {
    Snapshot?: Snapshot;
  }
  export interface CreateAuthenticationProfileMessage {
    /**
     * The name of the authentication profile to be created.
     */
    AuthenticationProfileName: AuthenticationProfileNameString;
    /**
     * The content of the authentication profile in JSON format. The maximum length of the JSON string is determined by a quota for your account.
     */
    AuthenticationProfileContent: String;
  }
  export interface CreateAuthenticationProfileResult {
    /**
     * The name of the authentication profile that was created.
     */
    AuthenticationProfileName?: AuthenticationProfileNameString;
    /**
     * The content of the authentication profile in JSON format.
     */
    AuthenticationProfileContent?: String;
  }
  export interface CreateClusterMessage {
    /**
     * The name of the first database to be created when the cluster is created. To create additional databases after the cluster is created, connect to the cluster with a SQL client and use SQL commands to create a database. For more information, go to Create a Database in the Amazon Redshift Database Developer Guide.  Default: dev  Constraints:   Must contain 1 to 64 alphanumeric characters.   Must contain only lowercase letters.   Cannot be a word that is reserved by the service. A list of reserved words can be found in Reserved Words in the Amazon Redshift Database Developer Guide.   
     */
    DBName?: String;
    /**
     * A unique identifier for the cluster. You use this identifier to refer to the cluster for any subsequent cluster operations such as deleting or modifying. The identifier also appears in the Amazon Redshift console. Constraints:   Must contain from 1 to 63 alphanumeric characters or hyphens.   Alphabetic characters must be lowercase.   First character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.   Must be unique for all clusters within an Amazon Web Services account.   Example: myexamplecluster 
     */
    ClusterIdentifier: String;
    /**
     * The type of the cluster. When cluster type is specified as    single-node, the NumberOfNodes parameter is not required.    multi-node, the NumberOfNodes parameter is required.   Valid Values: multi-node | single-node  Default: multi-node 
     */
    ClusterType?: String;
    /**
     * The node type to be provisioned for the cluster. For information about node types, go to  Working with Clusters in the Amazon Redshift Cluster Management Guide.  Valid Values: ds2.xlarge | ds2.8xlarge | dc1.large | dc1.8xlarge | dc2.large | dc2.8xlarge | ra3.xlplus | ra3.4xlarge | ra3.16xlarge 
     */
    NodeType: String;
    /**
     * The user name associated with the admin user account for the cluster that is being created. Constraints:   Must be 1 - 128 alphanumeric characters or hyphens. The user name can't be PUBLIC.   Must contain only lowercase letters, numbers, underscore, plus sign, period (dot), at symbol (@), or hyphen.   The first character must be a letter.   Must not contain a colon (:) or a slash (/).   Cannot be a reserved word. A list of reserved words can be found in Reserved Words in the Amazon Redshift Database Developer Guide.   
     */
    MasterUsername: String;
    /**
     * The password associated with the admin user account for the cluster that is being created. Constraints:   Must be between 8 and 64 characters in length.   Must contain at least one uppercase letter.   Must contain at least one lowercase letter.   Must contain one number.   Can be any printable ASCII character (ASCII code 33-126) except ' (single quote), " (double quote), \, /, or @.  
     */
    MasterUserPassword: String;
    /**
     * A list of security groups to be associated with this cluster. Default: The default cluster security group for Amazon Redshift.
     */
    ClusterSecurityGroups?: ClusterSecurityGroupNameList;
    /**
     * A list of Virtual Private Cloud (VPC) security groups to be associated with the cluster. Default: The default VPC security group is associated with the cluster.
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * The name of a cluster subnet group to be associated with this cluster. If this parameter is not provided the resulting cluster will be deployed outside virtual private cloud (VPC).
     */
    ClusterSubnetGroupName?: String;
    /**
     * The EC2 Availability Zone (AZ) in which you want Amazon Redshift to provision the cluster. For example, if you have several EC2 instances running in a specific Availability Zone, then you might want the cluster to be provisioned in the same zone in order to decrease network latency. Default: A random, system-chosen Availability Zone in the region that is specified by the endpoint. Example: us-east-2d  Constraint: The specified Availability Zone must be in the same region as the current endpoint.
     */
    AvailabilityZone?: String;
    /**
     * The weekly time range (in UTC) during which automated cluster maintenance can occur.  Format: ddd:hh24:mi-ddd:hh24:mi   Default: A 30-minute window selected at random from an 8-hour block of time per region, occurring on a random day of the week. For more information about the time blocks for each region, see Maintenance Windows in Amazon Redshift Cluster Management Guide. Valid Days: Mon | Tue | Wed | Thu | Fri | Sat | Sun Constraints: Minimum 30-minute window.
     */
    PreferredMaintenanceWindow?: String;
    /**
     * The name of the parameter group to be associated with this cluster. Default: The default Amazon Redshift cluster parameter group. For information about the default parameter group, go to Working with Amazon Redshift Parameter Groups  Constraints:   Must be 1 to 255 alphanumeric characters or hyphens.   First character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.  
     */
    ClusterParameterGroupName?: String;
    /**
     * The number of days that automated snapshots are retained. If the value is 0, automated snapshots are disabled. Even if automated snapshots are disabled, you can still create manual snapshots when you want with CreateClusterSnapshot.  You can't disable automated snapshots for RA3 node types. Set the automated retention period from 1-35 days. Default: 1  Constraints: Must be a value from 0 to 35.
     */
    AutomatedSnapshotRetentionPeriod?: IntegerOptional;
    /**
     * The default number of days to retain a manual snapshot. If the value is -1, the snapshot is retained indefinitely. This setting doesn't change the retention period of existing snapshots. The value must be either -1 or an integer between 1 and 3,653.
     */
    ManualSnapshotRetentionPeriod?: IntegerOptional;
    /**
     * The port number on which the cluster accepts incoming connections. The cluster is accessible only via the JDBC and ODBC connection strings. Part of the connection string requires the port on which the cluster will listen for incoming connections. Default: 5439  Valid Values: 1150-65535 
     */
    Port?: IntegerOptional;
    /**
     * The version of the Amazon Redshift engine software that you want to deploy on the cluster. The version selected runs on all the nodes in the cluster. Constraints: Only version 1.0 is currently available. Example: 1.0 
     */
    ClusterVersion?: String;
    /**
     * If true, major version upgrades can be applied during the maintenance window to the Amazon Redshift engine that is running on the cluster. When a new major version of the Amazon Redshift engine is released, you can request that the service automatically apply upgrades during the maintenance window to the Amazon Redshift engine that is running on your cluster. Default: true 
     */
    AllowVersionUpgrade?: BooleanOptional;
    /**
     * The number of compute nodes in the cluster. This parameter is required when the ClusterType parameter is specified as multi-node.  For information about determining how many nodes you need, go to  Working with Clusters in the Amazon Redshift Cluster Management Guide.  If you don't specify this parameter, you get a single-node cluster. When requesting a multi-node cluster, you must specify the number of nodes that you want in the cluster. Default: 1  Constraints: Value must be at least 1 and no more than 100.
     */
    NumberOfNodes?: IntegerOptional;
    /**
     * If true, the cluster can be accessed from a public network. 
     */
    PubliclyAccessible?: BooleanOptional;
    /**
     * If true, the data in the cluster is encrypted at rest.  Default: false
     */
    Encrypted?: BooleanOptional;
    /**
     * Specifies the name of the HSM client certificate the Amazon Redshift cluster uses to retrieve the data encryption keys stored in an HSM.
     */
    HsmClientCertificateIdentifier?: String;
    /**
     * Specifies the name of the HSM configuration that contains the information the Amazon Redshift cluster can use to retrieve and store keys in an HSM.
     */
    HsmConfigurationIdentifier?: String;
    /**
     * The Elastic IP (EIP) address for the cluster. Constraints: The cluster must be provisioned in EC2-VPC and publicly-accessible through an Internet gateway. Don't specify the Elastic IP address for a publicly accessible cluster with availability zone relocation turned on. For more information about provisioning clusters in EC2-VPC, go to Supported Platforms to Launch Your Cluster in the Amazon Redshift Cluster Management Guide.
     */
    ElasticIp?: String;
    /**
     * A list of tag instances.
     */
    Tags?: TagList;
    /**
     * The Key Management Service (KMS) key ID of the encryption key that you want to use to encrypt data in the cluster.
     */
    KmsKeyId?: String;
    /**
     * An option that specifies whether to create the cluster with enhanced VPC routing enabled. To create a cluster that uses enhanced VPC routing, the cluster must be in a VPC. For more information, see Enhanced VPC Routing in the Amazon Redshift Cluster Management Guide. If this option is true, enhanced VPC routing is enabled.  Default: false
     */
    EnhancedVpcRouting?: BooleanOptional;
    /**
     * Reserved.
     */
    AdditionalInfo?: String;
    /**
     * A list of Identity and Access Management (IAM) roles that can be used by the cluster to access other Amazon Web Services services. You must supply the IAM roles in their Amazon Resource Name (ARN) format.  The maximum number of IAM roles that you can associate is subject to a quota. For more information, go to Quotas and limits in the Amazon Redshift Cluster Management Guide.
     */
    IamRoles?: IamRoleArnList;
    /**
     * An optional parameter for the name of the maintenance track for the cluster. If you don't provide a maintenance track name, the cluster is assigned to the current track.
     */
    MaintenanceTrackName?: String;
    /**
     * A unique identifier for the snapshot schedule.
     */
    SnapshotScheduleIdentifier?: String;
    /**
     * The option to enable relocation for an Amazon Redshift cluster between Availability Zones after the cluster is created.
     */
    AvailabilityZoneRelocation?: BooleanOptional;
    /**
     * This parameter is retired. It does not set the AQUA configuration status. Amazon Redshift automatically determines whether to use AQUA (Advanced Query Accelerator).
     */
    AquaConfigurationStatus?: AquaConfigurationStatus;
    /**
     * The Amazon Resource Name (ARN) for the IAM role that was set as default for the cluster when the cluster was created. 
     */
    DefaultIamRoleArn?: String;
    /**
     * A flag that specifies whether to load sample data once the cluster is created.
     */
    LoadSampleData?: String;
  }
  export interface CreateClusterParameterGroupMessage {
    /**
     * The name of the cluster parameter group. Constraints:   Must be 1 to 255 alphanumeric characters or hyphens   First character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.   Must be unique withing your Amazon Web Services account.    This value is stored as a lower-case string. 
     */
    ParameterGroupName: String;
    /**
     * The Amazon Redshift engine version to which the cluster parameter group applies. The cluster engine version determines the set of parameters. To get a list of valid parameter group family names, you can call DescribeClusterParameterGroups. By default, Amazon Redshift returns a list of all the parameter groups that are owned by your Amazon Web Services account, including the default parameter groups for each Amazon Redshift engine version. The parameter group family names associated with the default parameter groups provide you the valid values. For example, a valid family name is "redshift-1.0". 
     */
    ParameterGroupFamily: String;
    /**
     * A description of the parameter group.
     */
    Description: String;
    /**
     * A list of tag instances.
     */
    Tags?: TagList;
  }
  export interface CreateClusterParameterGroupResult {
    ClusterParameterGroup?: ClusterParameterGroup;
  }
  export interface CreateClusterResult {
    Cluster?: Cluster;
  }
  export interface CreateClusterSecurityGroupMessage {
    /**
     * The name for the security group. Amazon Redshift stores the value as a lowercase string. Constraints:   Must contain no more than 255 alphanumeric characters or hyphens.   Must not be "Default".   Must be unique for all security groups that are created by your Amazon Web Services account.   Example: examplesecuritygroup 
     */
    ClusterSecurityGroupName: String;
    /**
     * A description for the security group.
     */
    Description: String;
    /**
     * A list of tag instances.
     */
    Tags?: TagList;
  }
  export interface CreateClusterSecurityGroupResult {
    ClusterSecurityGroup?: ClusterSecurityGroup;
  }
  export interface CreateClusterSnapshotMessage {
    /**
     * A unique identifier for the snapshot that you are requesting. This identifier must be unique for all snapshots within the Amazon Web Services account. Constraints:   Cannot be null, empty, or blank   Must contain from 1 to 255 alphanumeric characters or hyphens   First character must be a letter   Cannot end with a hyphen or contain two consecutive hyphens   Example: my-snapshot-id 
     */
    SnapshotIdentifier: String;
    /**
     * The cluster identifier for which you want a snapshot.
     */
    ClusterIdentifier: String;
    /**
     * The number of days that a manual snapshot is retained. If the value is -1, the manual snapshot is retained indefinitely.  The value must be either -1 or an integer between 1 and 3,653. The default value is -1.
     */
    ManualSnapshotRetentionPeriod?: IntegerOptional;
    /**
     * A list of tag instances.
     */
    Tags?: TagList;
  }
  export interface CreateClusterSnapshotResult {
    Snapshot?: Snapshot;
  }
  export interface CreateClusterSubnetGroupMessage {
    /**
     * The name for the subnet group. Amazon Redshift stores the value as a lowercase string. Constraints:   Must contain no more than 255 alphanumeric characters or hyphens.   Must not be "Default".   Must be unique for all subnet groups that are created by your Amazon Web Services account.   Example: examplesubnetgroup 
     */
    ClusterSubnetGroupName: String;
    /**
     * A description for the subnet group.
     */
    Description: String;
    /**
     * An array of VPC subnet IDs. A maximum of 20 subnets can be modified in a single request.
     */
    SubnetIds: SubnetIdentifierList;
    /**
     * A list of tag instances.
     */
    Tags?: TagList;
  }
  export interface CreateClusterSubnetGroupResult {
    ClusterSubnetGroup?: ClusterSubnetGroup;
  }
  export interface CreateCustomDomainAssociationMessage {
    /**
     * The custom domain name for a custom domain association.
     */
    CustomDomainName: CustomDomainNameString;
    /**
     * The certificate Amazon Resource Name (ARN) for the custom domain name association.
     */
    CustomDomainCertificateArn: CustomDomainCertificateArnString;
    /**
     * The cluster identifier that the custom domain is associated with.
     */
    ClusterIdentifier: String;
  }
  export interface CreateCustomDomainAssociationResult {
    /**
     * The custom domain name for the association result.
     */
    CustomDomainName?: CustomDomainNameString;
    /**
     * The Amazon Resource Name (ARN) for the certificate associated with the custom domain name.
     */
    CustomDomainCertificateArn?: CustomDomainCertificateArnString;
    /**
     * The identifier of the cluster that the custom domain is associated with.
     */
    ClusterIdentifier?: String;
    /**
     * The expiration time for the certificate for the custom domain.
     */
    CustomDomainCertExpiryTime?: String;
  }
  export interface CreateEndpointAccessMessage {
    /**
     * The cluster identifier of the cluster to access.
     */
    ClusterIdentifier?: String;
    /**
     * The Amazon Web Services account ID of the owner of the cluster. This is only required if the cluster is in another Amazon Web Services account.
     */
    ResourceOwner?: String;
    /**
     * The Redshift-managed VPC endpoint name. An endpoint name must contain 1-30 characters. Valid characters are A-Z, a-z, 0-9, and hyphen(-). The first character must be a letter. The name can't contain two consecutive hyphens or end with a hyphen.
     */
    EndpointName: String;
    /**
     * The subnet group from which Amazon Redshift chooses the subnet to deploy the endpoint.
     */
    SubnetGroupName: String;
    /**
     * The security group that defines the ports, protocols, and sources for inbound traffic that you are authorizing into your endpoint.
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
  }
  export interface CreateEventSubscriptionMessage {
    /**
     * The name of the event subscription to be created. Constraints:   Cannot be null, empty, or blank.   Must contain from 1 to 255 alphanumeric characters or hyphens.   First character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.  
     */
    SubscriptionName: String;
    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic used to transmit the event notifications. The ARN is created by Amazon SNS when you create a topic and subscribe to it.
     */
    SnsTopicArn: String;
    /**
     * The type of source that will be generating the events. For example, if you want to be notified of events generated by a cluster, you would set this parameter to cluster. If this value is not specified, events are returned for all Amazon Redshift objects in your Amazon Web Services account. You must specify a source type in order to specify source IDs. Valid values: cluster, cluster-parameter-group, cluster-security-group, cluster-snapshot, and scheduled-action.
     */
    SourceType?: String;
    /**
     * A list of one or more identifiers of Amazon Redshift source objects. All of the objects must be of the same type as was specified in the source type parameter. The event subscription will return only events generated by the specified objects. If not specified, then events are returned for all objects within the source type specified. Example: my-cluster-1, my-cluster-2 Example: my-snapshot-20131010
     */
    SourceIds?: SourceIdsList;
    /**
     * Specifies the Amazon Redshift event categories to be published by the event notification subscription. Values: configuration, management, monitoring, security, pending
     */
    EventCategories?: EventCategoriesList;
    /**
     * Specifies the Amazon Redshift event severity to be published by the event notification subscription. Values: ERROR, INFO
     */
    Severity?: String;
    /**
     * A boolean value; set to true to activate the subscription, and set to false to create the subscription but not activate it. 
     */
    Enabled?: BooleanOptional;
    /**
     * A list of tag instances.
     */
    Tags?: TagList;
  }
  export interface CreateEventSubscriptionResult {
    EventSubscription?: EventSubscription;
  }
  export interface CreateHsmClientCertificateMessage {
    /**
     * The identifier to be assigned to the new HSM client certificate that the cluster will use to connect to the HSM to use the database encryption keys.
     */
    HsmClientCertificateIdentifier: String;
    /**
     * A list of tag instances.
     */
    Tags?: TagList;
  }
  export interface CreateHsmClientCertificateResult {
    HsmClientCertificate?: HsmClientCertificate;
  }
  export interface CreateHsmConfigurationMessage {
    /**
     * The identifier to be assigned to the new Amazon Redshift HSM configuration.
     */
    HsmConfigurationIdentifier: String;
    /**
     * A text description of the HSM configuration to be created.
     */
    Description: String;
    /**
     * The IP address that the Amazon Redshift cluster must use to access the HSM.
     */
    HsmIpAddress: String;
    /**
     * The name of the partition in the HSM where the Amazon Redshift clusters will store their database encryption keys.
     */
    HsmPartitionName: String;
    /**
     * The password required to access the HSM partition.
     */
    HsmPartitionPassword: String;
    /**
     * The HSMs public certificate file. When using Cloud HSM, the file name is server.pem.
     */
    HsmServerPublicCertificate: String;
    /**
     * A list of tag instances.
     */
    Tags?: TagList;
  }
  export interface CreateHsmConfigurationResult {
    HsmConfiguration?: HsmConfiguration;
  }
  export interface CreateScheduledActionMessage {
    /**
     * The name of the scheduled action. The name must be unique within an account. For more information about this parameter, see ScheduledAction. 
     */
    ScheduledActionName: String;
    /**
     * A JSON format string of the Amazon Redshift API operation with input parameters. For more information about this parameter, see ScheduledAction. 
     */
    TargetAction: ScheduledActionType;
    /**
     * The schedule in at( ) or cron( ) format. For more information about this parameter, see ScheduledAction.
     */
    Schedule: String;
    /**
     * The IAM role to assume to run the target action. For more information about this parameter, see ScheduledAction. 
     */
    IamRole: String;
    /**
     * The description of the scheduled action. 
     */
    ScheduledActionDescription?: String;
    /**
     * The start time in UTC of the scheduled action. Before this time, the scheduled action does not trigger. For more information about this parameter, see ScheduledAction.
     */
    StartTime?: TStamp;
    /**
     * The end time in UTC of the scheduled action. After this time, the scheduled action does not trigger. For more information about this parameter, see ScheduledAction. 
     */
    EndTime?: TStamp;
    /**
     * If true, the schedule is enabled. If false, the scheduled action does not trigger. For more information about state of the scheduled action, see ScheduledAction. 
     */
    Enable?: BooleanOptional;
  }
  export interface CreateSnapshotCopyGrantMessage {
    /**
     * The name of the snapshot copy grant. This name must be unique in the region for the Amazon Web Services account. Constraints:   Must contain from 1 to 63 alphanumeric characters or hyphens.   Alphabetic characters must be lowercase.   First character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.   Must be unique for all clusters within an Amazon Web Services account.  
     */
    SnapshotCopyGrantName: String;
    /**
     * The unique identifier of the encrypted symmetric key to which to grant Amazon Redshift permission. If no key is specified, the default key is used.
     */
    KmsKeyId?: String;
    /**
     * A list of tag instances.
     */
    Tags?: TagList;
  }
  export interface CreateSnapshotCopyGrantResult {
    SnapshotCopyGrant?: SnapshotCopyGrant;
  }
  export interface CreateSnapshotScheduleMessage {
    /**
     * The definition of the snapshot schedule. The definition is made up of schedule expressions, for example "cron(30 12 *)" or "rate(12 hours)". 
     */
    ScheduleDefinitions?: ScheduleDefinitionList;
    /**
     * A unique identifier for a snapshot schedule. Only alphanumeric characters are allowed for the identifier.
     */
    ScheduleIdentifier?: String;
    /**
     * The description of the snapshot schedule.
     */
    ScheduleDescription?: String;
    /**
     * An optional set of tags you can use to search for the schedule.
     */
    Tags?: TagList;
    /**
     * 
     */
    DryRun?: BooleanOptional;
    /**
     * 
     */
    NextInvocations?: IntegerOptional;
  }
  export interface CreateTagsMessage {
    /**
     * The Amazon Resource Name (ARN) to which you want to add the tag or tags. For example, arn:aws:redshift:us-east-2:123456789:cluster:t1. 
     */
    ResourceName: String;
    /**
     * One or more name/value pairs to add as tags to the specified resource. Each tag name is passed in with the parameter Key and the corresponding value is passed in with the parameter Value. The Key and Value parameters are separated by a comma (,). Separate multiple tags with a space. For example, --tags "Key"="owner","Value"="admin" "Key"="environment","Value"="test" "Key"="version","Value"="1.0". 
     */
    Tags: TagList;
  }
  export interface CreateUsageLimitMessage {
    /**
     * The identifier of the cluster that you want to limit usage.
     */
    ClusterIdentifier: String;
    /**
     * The Amazon Redshift feature that you want to limit.
     */
    FeatureType: UsageLimitFeatureType;
    /**
     * The type of limit. Depending on the feature type, this can be based on a time duration or data size. If FeatureType is spectrum, then LimitType must be data-scanned. If FeatureType is concurrency-scaling, then LimitType must be time. If FeatureType is cross-region-datasharing, then LimitType must be data-scanned. 
     */
    LimitType: UsageLimitLimitType;
    /**
     * The limit amount. If time-based, this amount is in minutes. If data-based, this amount is in terabytes (TB). The value must be a positive number. 
     */
    Amount: Long;
    /**
     * The time period that the amount applies to. A weekly period begins on Sunday. The default is monthly. 
     */
    Period?: UsageLimitPeriod;
    /**
     * The action that Amazon Redshift takes when the limit is reached. The default is log. For more information about this parameter, see UsageLimit.
     */
    BreachAction?: UsageLimitBreachAction;
    /**
     * A list of tag instances.
     */
    Tags?: TagList;
  }
  export interface CustomDomainAssociationsMessage {
    /**
     * The marker for the custom domain association.
     */
    Marker?: String;
    /**
     * The associations for the custom domain.
     */
    Associations?: AssociationList;
  }
  export type CustomDomainCertificateArnString = string;
  export type CustomDomainNameString = string;
  export interface CustomerStorageMessage {
    /**
     * The total amount of storage currently used for snapshots.
     */
    TotalBackupSizeInMegaBytes?: Double;
    /**
     * The total amount of storage currently provisioned.
     */
    TotalProvisionedStorageInMegaBytes?: Double;
  }
  export interface DataShare {
    /**
     * An Amazon Resource Name (ARN) that references the datashare that is owned by a specific namespace of the producer cluster. A datashare ARN is in the arn:aws:redshift:{region}:{account-id}:{datashare}:{namespace-guid}/{datashare-name} format.
     */
    DataShareArn?: String;
    /**
     * The Amazon Resource Name (ARN) of the producer.
     */
    ProducerArn?: String;
    /**
     * A value that specifies whether the datashare can be shared to a publicly accessible cluster.
     */
    AllowPubliclyAccessibleConsumers?: Boolean;
    /**
     * A value that specifies when the datashare has an association between producer and data consumers.
     */
    DataShareAssociations?: DataShareAssociationList;
    /**
     * The identifier of a datashare to show its managing entity.
     */
    ManagedBy?: String;
  }
  export interface DataShareAssociation {
    /**
     * The name of the consumer accounts that have an association with a producer datashare.
     */
    ConsumerIdentifier?: String;
    /**
     * The status of the datashare that is associated.
     */
    Status?: DataShareStatus;
    /**
     * The Amazon Web Services Region of the consumer accounts that have an association with a producer datashare.
     */
    ConsumerRegion?: String;
    /**
     * The creation date of the datashare that is associated.
     */
    CreatedDate?: TStamp;
    /**
     * The status change data of the datashare that is associated.
     */
    StatusChangeDate?: TStamp;
  }
  export type DataShareAssociationList = DataShareAssociation[];
  export type DataShareList = DataShare[];
  export type DataShareStatus = "ACTIVE"|"PENDING_AUTHORIZATION"|"AUTHORIZED"|"DEAUTHORIZED"|"REJECTED"|"AVAILABLE"|string;
  export type DataShareStatusForConsumer = "ACTIVE"|"AVAILABLE"|string;
  export type DataShareStatusForProducer = "ACTIVE"|"AUTHORIZED"|"PENDING_AUTHORIZATION"|"DEAUTHORIZED"|"REJECTED"|string;
  export interface DataTransferProgress {
    /**
     * Describes the status of the cluster. While the transfer is in progress the status is transferringdata.
     */
    Status?: String;
    /**
     * Describes the data transfer rate in MB's per second.
     */
    CurrentRateInMegaBytesPerSecond?: DoubleOptional;
    /**
     * Describes the total amount of data to be transfered in megabytes.
     */
    TotalDataInMegaBytes?: Long;
    /**
     * Describes the total amount of data that has been transfered in MB's.
     */
    DataTransferredInMegaBytes?: Long;
    /**
     * Describes the estimated number of seconds remaining to complete the transfer.
     */
    EstimatedTimeToCompletionInSeconds?: LongOptional;
    /**
     * Describes the number of seconds that have elapsed during the data transfer.
     */
    ElapsedTimeInSeconds?: LongOptional;
  }
  export type DbGroupList = String[];
  export interface DeauthorizeDataShareMessage {
    /**
     * The Amazon Resource Name (ARN) of the datashare to remove authorization from.
     */
    DataShareArn: String;
    /**
     * The identifier of the data consumer that is to have authorization removed from the datashare. This identifier is an Amazon Web Services account ID or a keyword, such as ADX.
     */
    ConsumerIdentifier: String;
  }
  export interface DefaultClusterParameters {
    /**
     * The name of the cluster parameter group family to which the engine default parameters apply.
     */
    ParameterGroupFamily?: String;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
    /**
     * The list of cluster default parameters.
     */
    Parameters?: ParametersList;
  }
  export interface DeferredMaintenanceWindow {
    /**
     * A unique identifier for the maintenance window.
     */
    DeferMaintenanceIdentifier?: String;
    /**
     *  A timestamp for the beginning of the time period when we defer maintenance.
     */
    DeferMaintenanceStartTime?: TStamp;
    /**
     *  A timestamp for the end of the time period when we defer maintenance.
     */
    DeferMaintenanceEndTime?: TStamp;
  }
  export type DeferredMaintenanceWindowsList = DeferredMaintenanceWindow[];
  export interface DeleteAuthenticationProfileMessage {
    /**
     * The name of the authentication profile to delete.
     */
    AuthenticationProfileName: AuthenticationProfileNameString;
  }
  export interface DeleteAuthenticationProfileResult {
    /**
     * The name of the authentication profile that was deleted.
     */
    AuthenticationProfileName?: AuthenticationProfileNameString;
  }
  export interface DeleteClusterMessage {
    /**
     * The identifier of the cluster to be deleted. Constraints:   Must contain lowercase characters.   Must contain from 1 to 63 alphanumeric characters or hyphens.   First character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.  
     */
    ClusterIdentifier: String;
    /**
     * Determines whether a final snapshot of the cluster is created before Amazon Redshift deletes the cluster. If true, a final cluster snapshot is not created. If false, a final cluster snapshot is created before the cluster is deleted.   The FinalClusterSnapshotIdentifier parameter must be specified if SkipFinalClusterSnapshot is false.  Default: false 
     */
    SkipFinalClusterSnapshot?: Boolean;
    /**
     * The identifier of the final snapshot that is to be created immediately before deleting the cluster. If this parameter is provided, SkipFinalClusterSnapshot must be false.  Constraints:   Must be 1 to 255 alphanumeric characters.   First character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.  
     */
    FinalClusterSnapshotIdentifier?: String;
    /**
     * The number of days that a manual snapshot is retained. If the value is -1, the manual snapshot is retained indefinitely. The value must be either -1 or an integer between 1 and 3,653. The default value is -1.
     */
    FinalClusterSnapshotRetentionPeriod?: IntegerOptional;
  }
  export interface DeleteClusterParameterGroupMessage {
    /**
     * The name of the parameter group to be deleted. Constraints:   Must be the name of an existing cluster parameter group.   Cannot delete a default cluster parameter group.  
     */
    ParameterGroupName: String;
  }
  export interface DeleteClusterResult {
    Cluster?: Cluster;
  }
  export interface DeleteClusterSecurityGroupMessage {
    /**
     * The name of the cluster security group to be deleted.
     */
    ClusterSecurityGroupName: String;
  }
  export interface DeleteClusterSnapshotMessage {
    /**
     * The unique identifier of the manual snapshot to be deleted. Constraints: Must be the name of an existing snapshot that is in the available, failed, or cancelled state.
     */
    SnapshotIdentifier: String;
    /**
     * The unique identifier of the cluster the snapshot was created from. This parameter is required if your IAM user has a policy containing a snapshot resource element that specifies anything other than * for the cluster name. Constraints: Must be the name of valid cluster.
     */
    SnapshotClusterIdentifier?: String;
  }
  export type DeleteClusterSnapshotMessageList = DeleteClusterSnapshotMessage[];
  export interface DeleteClusterSnapshotResult {
    Snapshot?: Snapshot;
  }
  export interface DeleteClusterSubnetGroupMessage {
    /**
     * The name of the cluster subnet group name to be deleted.
     */
    ClusterSubnetGroupName: String;
  }
  export interface DeleteCustomDomainAssociationMessage {
    /**
     * The identifier of the cluster to delete a custom domain association for.
     */
    ClusterIdentifier: String;
  }
  export interface DeleteEndpointAccessMessage {
    /**
     * The Redshift-managed VPC endpoint to delete.
     */
    EndpointName: String;
  }
  export interface DeleteEventSubscriptionMessage {
    /**
     * The name of the Amazon Redshift event notification subscription to be deleted.
     */
    SubscriptionName: String;
  }
  export interface DeleteHsmClientCertificateMessage {
    /**
     * The identifier of the HSM client certificate to be deleted.
     */
    HsmClientCertificateIdentifier: String;
  }
  export interface DeleteHsmConfigurationMessage {
    /**
     * The identifier of the Amazon Redshift HSM configuration to be deleted.
     */
    HsmConfigurationIdentifier: String;
  }
  export interface DeleteScheduledActionMessage {
    /**
     * The name of the scheduled action to delete. 
     */
    ScheduledActionName: String;
  }
  export interface DeleteSnapshotCopyGrantMessage {
    /**
     * The name of the snapshot copy grant to delete.
     */
    SnapshotCopyGrantName: String;
  }
  export interface DeleteSnapshotScheduleMessage {
    /**
     * A unique identifier of the snapshot schedule to delete.
     */
    ScheduleIdentifier: String;
  }
  export interface DeleteTagsMessage {
    /**
     * The Amazon Resource Name (ARN) from which you want to remove the tag or tags. For example, arn:aws:redshift:us-east-2:123456789:cluster:t1. 
     */
    ResourceName: String;
    /**
     * The tag key that you want to delete.
     */
    TagKeys: TagKeyList;
  }
  export interface DeleteUsageLimitMessage {
    /**
     * The identifier of the usage limit to delete.
     */
    UsageLimitId: String;
  }
  export interface DescribeAccountAttributesMessage {
    /**
     * A list of attribute names.
     */
    AttributeNames?: AttributeNameList;
  }
  export interface DescribeAuthenticationProfilesMessage {
    /**
     * The name of the authentication profile to describe. If not specified then all authentication profiles owned by the account are listed.
     */
    AuthenticationProfileName?: AuthenticationProfileNameString;
  }
  export interface DescribeAuthenticationProfilesResult {
    /**
     * The list of authentication profiles.
     */
    AuthenticationProfiles?: AuthenticationProfileList;
  }
  export interface DescribeClusterDbRevisionsMessage {
    /**
     * A unique identifier for a cluster whose ClusterDbRevisions you are requesting. This parameter is case sensitive. All clusters defined for an account are returned by default.
     */
    ClusterIdentifier?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in the marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the marker parameter and retrying the request.  Default: 100 Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point for returning a set of response records. When the results of a DescribeClusterDbRevisions request exceed the value specified in MaxRecords, Amazon Redshift returns a value in the marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the marker parameter and retrying the request.  Constraints: You can specify either the ClusterIdentifier parameter, or the marker parameter, but not both.
     */
    Marker?: String;
  }
  export interface DescribeClusterParameterGroupsMessage {
    /**
     * The name of a specific parameter group for which to return details. By default, details about all parameter groups and the default parameter group are returned.
     */
    ParameterGroupName?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeClusterParameterGroups request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
    /**
     * A tag key or keys for which you want to return all matching cluster parameter groups that are associated with the specified key or keys. For example, suppose that you have parameter groups that are tagged with keys called owner and environment. If you specify both of these tag keys in the request, Amazon Redshift returns a response with the parameter groups that have either or both of these tag keys associated with them.
     */
    TagKeys?: TagKeyList;
    /**
     * A tag value or values for which you want to return all matching cluster parameter groups that are associated with the specified tag value or values. For example, suppose that you have parameter groups that are tagged with values called admin and test. If you specify both of these tag values in the request, Amazon Redshift returns a response with the parameter groups that have either or both of these tag values associated with them.
     */
    TagValues?: TagValueList;
  }
  export interface DescribeClusterParametersMessage {
    /**
     * The name of a cluster parameter group for which to return details.
     */
    ParameterGroupName: String;
    /**
     * The parameter types to return. Specify user to show parameters that are different form the default. Similarly, specify engine-default to show parameters that are the same as the default parameter group.  Default: All parameter types returned. Valid Values: user | engine-default 
     */
    Source?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeClusterParameters request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
  }
  export interface DescribeClusterSecurityGroupsMessage {
    /**
     * The name of a cluster security group for which you are requesting details. You must specify either the Marker parameter or a ClusterSecurityGroupName parameter, but not both.   Example: securitygroup1 
     */
    ClusterSecurityGroupName?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeClusterSecurityGroups request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request.  Constraints: You must specify either the ClusterSecurityGroupName parameter or the Marker parameter, but not both. 
     */
    Marker?: String;
    /**
     * A tag key or keys for which you want to return all matching cluster security groups that are associated with the specified key or keys. For example, suppose that you have security groups that are tagged with keys called owner and environment. If you specify both of these tag keys in the request, Amazon Redshift returns a response with the security groups that have either or both of these tag keys associated with them.
     */
    TagKeys?: TagKeyList;
    /**
     * A tag value or values for which you want to return all matching cluster security groups that are associated with the specified tag value or values. For example, suppose that you have security groups that are tagged with values called admin and test. If you specify both of these tag values in the request, Amazon Redshift returns a response with the security groups that have either or both of these tag values associated with them.
     */
    TagValues?: TagValueList;
  }
  export interface DescribeClusterSnapshotsMessage {
    /**
     * The identifier of the cluster which generated the requested snapshots.
     */
    ClusterIdentifier?: String;
    /**
     * The snapshot identifier of the snapshot about which to return information.
     */
    SnapshotIdentifier?: String;
    /**
     * The Amazon Resource Name (ARN) of the snapshot associated with the message to describe cluster snapshots.
     */
    SnapshotArn?: String;
    /**
     * The type of snapshots for which you are requesting information. By default, snapshots of all types are returned. Valid Values: automated | manual 
     */
    SnapshotType?: String;
    /**
     * A value that requests only snapshots created at or after the specified time. The time value is specified in ISO 8601 format. For more information about ISO 8601, go to the ISO8601 Wikipedia page.  Example: 2012-07-16T18:00:00Z 
     */
    StartTime?: TStamp;
    /**
     * A time value that requests only snapshots created at or before the specified time. The time value is specified in ISO 8601 format. For more information about ISO 8601, go to the ISO8601 Wikipedia page.  Example: 2012-07-16T18:00:00Z 
     */
    EndTime?: TStamp;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeClusterSnapshots request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
    /**
     * The Amazon Web Services account used to create or copy the snapshot. Use this field to filter the results to snapshots owned by a particular account. To describe snapshots you own, either specify your Amazon Web Services account, or do not specify the parameter.
     */
    OwnerAccount?: String;
    /**
     * A tag key or keys for which you want to return all matching cluster snapshots that are associated with the specified key or keys. For example, suppose that you have snapshots that are tagged with keys called owner and environment. If you specify both of these tag keys in the request, Amazon Redshift returns a response with the snapshots that have either or both of these tag keys associated with them.
     */
    TagKeys?: TagKeyList;
    /**
     * A tag value or values for which you want to return all matching cluster snapshots that are associated with the specified tag value or values. For example, suppose that you have snapshots that are tagged with values called admin and test. If you specify both of these tag values in the request, Amazon Redshift returns a response with the snapshots that have either or both of these tag values associated with them.
     */
    TagValues?: TagValueList;
    /**
     * A value that indicates whether to return snapshots only for an existing cluster. You can perform table-level restore only by using a snapshot of an existing cluster, that is, a cluster that has not been deleted. Values for this parameter work as follows:    If ClusterExists is set to true, ClusterIdentifier is required.   If ClusterExists is set to false and ClusterIdentifier isn't specified, all snapshots associated with deleted clusters (orphaned snapshots) are returned.    If ClusterExists is set to false and ClusterIdentifier is specified for a deleted cluster, snapshots associated with that cluster are returned.   If ClusterExists is set to false and ClusterIdentifier is specified for an existing cluster, no snapshots are returned.   
     */
    ClusterExists?: BooleanOptional;
    /**
     * 
     */
    SortingEntities?: SnapshotSortingEntityList;
  }
  export interface DescribeClusterSubnetGroupsMessage {
    /**
     * The name of the cluster subnet group for which information is requested.
     */
    ClusterSubnetGroupName?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeClusterSubnetGroups request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
    /**
     * A tag key or keys for which you want to return all matching cluster subnet groups that are associated with the specified key or keys. For example, suppose that you have subnet groups that are tagged with keys called owner and environment. If you specify both of these tag keys in the request, Amazon Redshift returns a response with the subnet groups that have either or both of these tag keys associated with them.
     */
    TagKeys?: TagKeyList;
    /**
     * A tag value or values for which you want to return all matching cluster subnet groups that are associated with the specified tag value or values. For example, suppose that you have subnet groups that are tagged with values called admin and test. If you specify both of these tag values in the request, Amazon Redshift returns a response with the subnet groups that have either or both of these tag values associated with them.
     */
    TagValues?: TagValueList;
  }
  export interface DescribeClusterTracksMessage {
    /**
     * The name of the maintenance track. 
     */
    MaintenanceTrackName?: String;
    /**
     * An integer value for the maximum number of maintenance tracks to return.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeClusterTracks request exceed the value specified in MaxRecords, Amazon Redshift returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
  }
  export interface DescribeClusterVersionsMessage {
    /**
     * The specific cluster version to return. Example: 1.0 
     */
    ClusterVersion?: String;
    /**
     * The name of a specific cluster parameter group family to return details for. Constraints:   Must be 1 to 255 alphanumeric characters   First character must be a letter   Cannot end with a hyphen or contain two consecutive hyphens  
     */
    ClusterParameterGroupFamily?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeClusterVersions request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
  }
  export interface DescribeClustersMessage {
    /**
     * The unique identifier of a cluster whose properties you are requesting. This parameter is case sensitive. The default is that all clusters defined for an account are returned.
     */
    ClusterIdentifier?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeClusters request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request.  Constraints: You can specify either the ClusterIdentifier parameter or the Marker parameter, but not both. 
     */
    Marker?: String;
    /**
     * A tag key or keys for which you want to return all matching clusters that are associated with the specified key or keys. For example, suppose that you have clusters that are tagged with keys called owner and environment. If you specify both of these tag keys in the request, Amazon Redshift returns a response with the clusters that have either or both of these tag keys associated with them.
     */
    TagKeys?: TagKeyList;
    /**
     * A tag value or values for which you want to return all matching clusters that are associated with the specified tag value or values. For example, suppose that you have clusters that are tagged with values called admin and test. If you specify both of these tag values in the request, Amazon Redshift returns a response with the clusters that have either or both of these tag values associated with them.
     */
    TagValues?: TagValueList;
  }
  export interface DescribeCustomDomainAssociationsMessage {
    /**
     * The custom domain name for the custom domain association.
     */
    CustomDomainName?: CustomDomainNameString;
    /**
     * The certificate Amazon Resource Name (ARN) for the custom domain association.
     */
    CustomDomainCertificateArn?: CustomDomainCertificateArnString;
    /**
     * The maximum records setting for the associated custom domain.
     */
    MaxRecords?: IntegerOptional;
    /**
     * The marker for the custom domain association.
     */
    Marker?: String;
  }
  export interface DescribeDataSharesForConsumerMessage {
    /**
     * The Amazon Resource Name (ARN) of the consumer that returns in the list of datashares.
     */
    ConsumerArn?: String;
    /**
     * An identifier giving the status of a datashare in the consumer cluster. If this field is specified, Amazon Redshift returns the list of datashares that have the specified status.
     */
    Status?: DataShareStatusForConsumer;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value. 
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeDataSharesForConsumer request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
  }
  export interface DescribeDataSharesForConsumerResult {
    /**
     * Shows the results of datashares available for consumers.
     */
    DataShares?: DataShareList;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeDataSharesForConsumer request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
  }
  export interface DescribeDataSharesForProducerMessage {
    /**
     * The Amazon Resource Name (ARN) of the producer that returns in the list of datashares.
     */
    ProducerArn?: String;
    /**
     * An identifier giving the status of a datashare in the producer. If this field is specified, Amazon Redshift returns the list of datashares that have the specified status.
     */
    Status?: DataShareStatusForProducer;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value. 
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeDataSharesForProducer request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
  }
  export interface DescribeDataSharesForProducerResult {
    /**
     * Shows the results of datashares available for producers.
     */
    DataShares?: DataShareList;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeDataSharesForProducer request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
  }
  export interface DescribeDataSharesMessage {
    /**
     * The identifier of the datashare to describe details of.
     */
    DataShareArn?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value. 
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeDataShares request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
  }
  export interface DescribeDataSharesResult {
    /**
     * The results returned from describing datashares.
     */
    DataShares?: DataShareList;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeDataShares request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
  }
  export interface DescribeDefaultClusterParametersMessage {
    /**
     * The name of the cluster parameter group family.
     */
    ParameterGroupFamily: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeDefaultClusterParameters request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
  }
  export interface DescribeDefaultClusterParametersResult {
    DefaultClusterParameters?: DefaultClusterParameters;
  }
  export interface DescribeEndpointAccessMessage {
    /**
     * The cluster identifier associated with the described endpoint.
     */
    ClusterIdentifier?: String;
    /**
     * The Amazon Web Services account ID of the owner of the cluster.
     */
    ResourceOwner?: String;
    /**
     * The name of the endpoint to be described.
     */
    EndpointName?: String;
    /**
     * The virtual private cloud (VPC) identifier with access to the cluster.
     */
    VpcId?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a Marker is included in the response so that the remaining results can be retrieved.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeEndpointAccess request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by the MaxRecords parameter.
     */
    Marker?: String;
  }
  export interface DescribeEndpointAuthorizationMessage {
    /**
     * The cluster identifier of the cluster to access.
     */
    ClusterIdentifier?: String;
    /**
     * The Amazon Web Services account ID of either the cluster owner (grantor) or grantee. If Grantee parameter is true, then the Account value is of the grantor.
     */
    Account?: String;
    /**
     * Indicates whether to check authorization from a grantor or grantee point of view. If true, Amazon Redshift returns endpoint authorizations that you've been granted. If false (default), checks authorization from a grantor point of view.
     */
    Grantee?: BooleanOptional;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a Marker is included in the response so that the remaining results can be retrieved.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeEndpointAuthorization request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by the MaxRecords parameter.
     */
    Marker?: String;
  }
  export interface DescribeEventCategoriesMessage {
    /**
     * The source type, such as cluster or parameter group, to which the described event categories apply. Valid values: cluster, cluster-snapshot, cluster-parameter-group, cluster-security-group, and scheduled-action.
     */
    SourceType?: String;
  }
  export interface DescribeEventSubscriptionsMessage {
    /**
     * The name of the Amazon Redshift event notification subscription to be described.
     */
    SubscriptionName?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeEventSubscriptions request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
    /**
     * A tag key or keys for which you want to return all matching event notification subscriptions that are associated with the specified key or keys. For example, suppose that you have subscriptions that are tagged with keys called owner and environment. If you specify both of these tag keys in the request, Amazon Redshift returns a response with the subscriptions that have either or both of these tag keys associated with them.
     */
    TagKeys?: TagKeyList;
    /**
     * A tag value or values for which you want to return all matching event notification subscriptions that are associated with the specified tag value or values. For example, suppose that you have subscriptions that are tagged with values called admin and test. If you specify both of these tag values in the request, Amazon Redshift returns a response with the subscriptions that have either or both of these tag values associated with them.
     */
    TagValues?: TagValueList;
  }
  export interface DescribeEventsMessage {
    /**
     * The identifier of the event source for which events will be returned. If this parameter is not specified, then all sources are included in the response. Constraints: If SourceIdentifier is supplied, SourceType must also be provided.   Specify a cluster identifier when SourceType is cluster.   Specify a cluster security group name when SourceType is cluster-security-group.   Specify a cluster parameter group name when SourceType is cluster-parameter-group.   Specify a cluster snapshot identifier when SourceType is cluster-snapshot.  
     */
    SourceIdentifier?: String;
    /**
     * The event source to retrieve events for. If no value is specified, all events are returned. Constraints: If SourceType is supplied, SourceIdentifier must also be provided.   Specify cluster when SourceIdentifier is a cluster identifier.   Specify cluster-security-group when SourceIdentifier is a cluster security group name.   Specify cluster-parameter-group when SourceIdentifier is a cluster parameter group name.   Specify cluster-snapshot when SourceIdentifier is a cluster snapshot identifier.  
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
     * The number of minutes prior to the time of the request for which to retrieve events. For example, if the request is sent at 18:00 and you specify a duration of 60, then only events which have occurred after 17:00 will be returned. Default: 60 
     */
    Duration?: IntegerOptional;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeEvents request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
  }
  export interface DescribeHsmClientCertificatesMessage {
    /**
     * The identifier of a specific HSM client certificate for which you want information. If no identifier is specified, information is returned for all HSM client certificates owned by your Amazon Web Services account.
     */
    HsmClientCertificateIdentifier?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeHsmClientCertificates request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
    /**
     * A tag key or keys for which you want to return all matching HSM client certificates that are associated with the specified key or keys. For example, suppose that you have HSM client certificates that are tagged with keys called owner and environment. If you specify both of these tag keys in the request, Amazon Redshift returns a response with the HSM client certificates that have either or both of these tag keys associated with them.
     */
    TagKeys?: TagKeyList;
    /**
     * A tag value or values for which you want to return all matching HSM client certificates that are associated with the specified tag value or values. For example, suppose that you have HSM client certificates that are tagged with values called admin and test. If you specify both of these tag values in the request, Amazon Redshift returns a response with the HSM client certificates that have either or both of these tag values associated with them.
     */
    TagValues?: TagValueList;
  }
  export interface DescribeHsmConfigurationsMessage {
    /**
     * The identifier of a specific Amazon Redshift HSM configuration to be described. If no identifier is specified, information is returned for all HSM configurations owned by your Amazon Web Services account.
     */
    HsmConfigurationIdentifier?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeHsmConfigurations request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
    /**
     * A tag key or keys for which you want to return all matching HSM configurations that are associated with the specified key or keys. For example, suppose that you have HSM configurations that are tagged with keys called owner and environment. If you specify both of these tag keys in the request, Amazon Redshift returns a response with the HSM configurations that have either or both of these tag keys associated with them.
     */
    TagKeys?: TagKeyList;
    /**
     * A tag value or values for which you want to return all matching HSM configurations that are associated with the specified tag value or values. For example, suppose that you have HSM configurations that are tagged with values called admin and test. If you specify both of these tag values in the request, Amazon Redshift returns a response with the HSM configurations that have either or both of these tag values associated with them.
     */
    TagValues?: TagValueList;
  }
  export interface DescribeLoggingStatusMessage {
    /**
     * The identifier of the cluster from which to get the logging status. Example: examplecluster 
     */
    ClusterIdentifier: String;
  }
  export interface DescribeNodeConfigurationOptionsMessage {
    /**
     * The action type to evaluate for possible node configurations. Specify "restore-cluster" to get configuration combinations based on an existing snapshot. Specify "recommend-node-config" to get configuration recommendations based on an existing cluster or snapshot. Specify "resize-cluster" to get configuration combinations for elastic resize based on an existing cluster. 
     */
    ActionType: ActionType;
    /**
     * The identifier of the cluster to evaluate for possible node configurations.
     */
    ClusterIdentifier?: String;
    /**
     * The identifier of the snapshot to evaluate for possible node configurations.
     */
    SnapshotIdentifier?: String;
    /**
     * The Amazon Resource Name (ARN) of the snapshot associated with the message to describe node configuration.
     */
    SnapshotArn?: String;
    /**
     * The Amazon Web Services account used to create or copy the snapshot. Required if you are restoring a snapshot you do not own, optional if you own the snapshot.
     */
    OwnerAccount?: String;
    /**
     * A set of name, operator, and value items to filter the results.
     */
    Filters?: NodeConfigurationOptionsFilterList;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeNodeConfigurationOptions request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 500  Constraints: minimum 100, maximum 500.
     */
    MaxRecords?: IntegerOptional;
  }
  export interface DescribeOrderableClusterOptionsMessage {
    /**
     * The version filter value. Specify this parameter to show only the available offerings matching the specified version. Default: All versions. Constraints: Must be one of the version returned from DescribeClusterVersions.
     */
    ClusterVersion?: String;
    /**
     * The node type filter value. Specify this parameter to show only the available offerings matching the specified node type.
     */
    NodeType?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeOrderableClusterOptions request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
  }
  export interface DescribePartnersInputMessage {
    /**
     * The Amazon Web Services account ID that owns the cluster.
     */
    AccountId: PartnerIntegrationAccountId;
    /**
     * The cluster identifier of the cluster whose partner integration is being described.
     */
    ClusterIdentifier: PartnerIntegrationClusterIdentifier;
    /**
     * The name of the database whose partner integration is being described. If database name is not specified, then all databases in the cluster are described.
     */
    DatabaseName?: PartnerIntegrationDatabaseName;
    /**
     * The name of the partner that is being described. If partner name is not specified, then all partner integrations are described.
     */
    PartnerName?: PartnerIntegrationPartnerName;
  }
  export interface DescribePartnersOutputMessage {
    /**
     * A list of partner integrations.
     */
    PartnerIntegrationInfoList?: PartnerIntegrationInfoList;
  }
  export interface DescribeReservedNodeExchangeStatusInputMessage {
    /**
     * The identifier of the source reserved node in a reserved-node exchange request.
     */
    ReservedNodeId?: String;
    /**
     * The identifier of the reserved-node exchange request.
     */
    ReservedNodeExchangeRequestId?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a Marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeReservedNodeExchangeStatus request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by the MaxRecords parameter. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request.
     */
    Marker?: String;
  }
  export interface DescribeReservedNodeExchangeStatusOutputMessage {
    /**
     * The details of the reserved-node exchange request, including the status, request time, source reserved-node identifier, and additional details.
     */
    ReservedNodeExchangeStatusDetails?: ReservedNodeExchangeStatusList;
    /**
     * A pagination token provided by a previous DescribeReservedNodeExchangeStatus request.
     */
    Marker?: String;
  }
  export interface DescribeReservedNodeOfferingsMessage {
    /**
     * The unique identifier for the offering.
     */
    ReservedNodeOfferingId?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeReservedNodeOfferings request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
  }
  export interface DescribeReservedNodesMessage {
    /**
     * Identifier for the node reservation.
     */
    ReservedNodeId?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeReservedNodes request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
  }
  export interface DescribeResizeMessage {
    /**
     * The unique identifier of a cluster whose resize progress you are requesting. This parameter is case-sensitive. By default, resize operations for all clusters defined for an Amazon Web Services account are returned.
     */
    ClusterIdentifier: String;
  }
  export interface DescribeScheduledActionsMessage {
    /**
     * The name of the scheduled action to retrieve. 
     */
    ScheduledActionName?: String;
    /**
     * The type of the scheduled actions to retrieve. 
     */
    TargetActionType?: ScheduledActionTypeValues;
    /**
     * The start time in UTC of the scheduled actions to retrieve. Only active scheduled actions that have invocations after this time are retrieved.
     */
    StartTime?: TStamp;
    /**
     * The end time in UTC of the scheduled action to retrieve. Only active scheduled actions that have invocations before this time are retrieved.
     */
    EndTime?: TStamp;
    /**
     * If true, retrieve only active scheduled actions. If false, retrieve only disabled scheduled actions. 
     */
    Active?: BooleanOptional;
    /**
     * List of scheduled action filters. 
     */
    Filters?: ScheduledActionFilterList;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeScheduledActions request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
  }
  export interface DescribeSnapshotCopyGrantsMessage {
    /**
     * The name of the snapshot copy grant.
     */
    SnapshotCopyGrantName?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeSnapshotCopyGrant request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request.  Constraints: You can specify either the SnapshotCopyGrantName parameter or the Marker parameter, but not both. 
     */
    Marker?: String;
    /**
     * A tag key or keys for which you want to return all matching resources that are associated with the specified key or keys. For example, suppose that you have resources tagged with keys called owner and environment. If you specify both of these tag keys in the request, Amazon Redshift returns a response with all resources that have either or both of these tag keys associated with them.
     */
    TagKeys?: TagKeyList;
    /**
     * A tag value or values for which you want to return all matching resources that are associated with the specified value or values. For example, suppose that you have resources tagged with values called admin and test. If you specify both of these tag values in the request, Amazon Redshift returns a response with all resources that have either or both of these tag values associated with them.
     */
    TagValues?: TagValueList;
  }
  export interface DescribeSnapshotSchedulesMessage {
    /**
     * The unique identifier for the cluster whose snapshot schedules you want to view.
     */
    ClusterIdentifier?: String;
    /**
     * A unique identifier for a snapshot schedule.
     */
    ScheduleIdentifier?: String;
    /**
     * The key value for a snapshot schedule tag.
     */
    TagKeys?: TagKeyList;
    /**
     * The value corresponding to the key of the snapshot schedule tag.
     */
    TagValues?: TagValueList;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the marker parameter and retrying the command. If the marker field is empty, all response records have been retrieved for the request.
     */
    Marker?: String;
    /**
     * The maximum number or response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.
     */
    MaxRecords?: IntegerOptional;
  }
  export interface DescribeSnapshotSchedulesOutputMessage {
    /**
     * A list of SnapshotSchedules.
     */
    SnapshotSchedules?: SnapshotScheduleList;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the marker parameter and retrying the command. If the marker field is empty, all response records have been retrieved for the request.
     */
    Marker?: String;
  }
  export interface DescribeTableRestoreStatusMessage {
    /**
     * The Amazon Redshift cluster that the table is being restored to.
     */
    ClusterIdentifier?: String;
    /**
     * The identifier of the table restore request to return status for. If you don't specify a TableRestoreRequestId value, then DescribeTableRestoreStatus returns the status of all in-progress table restore requests.
     */
    TableRestoreRequestId?: String;
    /**
     * The maximum number of records to include in the response. If more records exist than the specified MaxRecords value, a pagination token called a marker is included in the response so that the remaining results can be retrieved.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous DescribeTableRestoreStatus request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by the MaxRecords parameter.
     */
    Marker?: String;
  }
  export interface DescribeTagsMessage {
    /**
     * The Amazon Resource Name (ARN) for which you want to describe the tag or tags. For example, arn:aws:redshift:us-east-2:123456789:cluster:t1. 
     */
    ResourceName?: String;
    /**
     * The type of resource with which you want to view tags. Valid resource types are:    Cluster   CIDR/IP   EC2 security group   Snapshot   Cluster security group   Subnet group   HSM connection   HSM certificate   Parameter group   Snapshot copy grant   For more information about Amazon Redshift resource types and constructing ARNs, go to Specifying Policy Elements: Actions, Effects, Resources, and Principals in the Amazon Redshift Cluster Management Guide. 
     */
    ResourceType?: String;
    /**
     * The maximum number or response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value. 
     */
    MaxRecords?: IntegerOptional;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the marker parameter and retrying the command. If the marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
    /**
     * A tag key or keys for which you want to return all matching resources that are associated with the specified key or keys. For example, suppose that you have resources tagged with keys called owner and environment. If you specify both of these tag keys in the request, Amazon Redshift returns a response with all resources that have either or both of these tag keys associated with them.
     */
    TagKeys?: TagKeyList;
    /**
     * A tag value or values for which you want to return all matching resources that are associated with the specified value or values. For example, suppose that you have resources tagged with values called admin and test. If you specify both of these tag values in the request, Amazon Redshift returns a response with all resources that have either or both of these tag values associated with them.
     */
    TagValues?: TagValueList;
  }
  export interface DescribeUsageLimitsMessage {
    /**
     * The identifier of the usage limit to describe.
     */
    UsageLimitId?: String;
    /**
     * The identifier of the cluster for which you want to describe usage limits.
     */
    ClusterIdentifier?: String;
    /**
     * The feature type for which you want to describe usage limits.
     */
    FeatureType?: UsageLimitFeatureType;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.  Default: 100  Constraints: minimum 20, maximum 100.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeUsageLimits request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
    /**
     * A tag key or keys for which you want to return all matching usage limit objects that are associated with the specified key or keys. For example, suppose that you have parameter groups that are tagged with keys called owner and environment. If you specify both of these tag keys in the request, Amazon Redshift returns a response with the usage limit objects have either or both of these tag keys associated with them.
     */
    TagKeys?: TagKeyList;
    /**
     * A tag value or values for which you want to return all matching usage limit objects that are associated with the specified tag value or values. For example, suppose that you have parameter groups that are tagged with values called admin and test. If you specify both of these tag values in the request, Amazon Redshift returns a response with the usage limit objects that have either or both of these tag values associated with them.
     */
    TagValues?: TagValueList;
  }
  export interface DisableLoggingMessage {
    /**
     * The identifier of the cluster on which logging is to be stopped. Example: examplecluster 
     */
    ClusterIdentifier: String;
  }
  export interface DisableSnapshotCopyMessage {
    /**
     * The unique identifier of the source cluster that you want to disable copying of snapshots to a destination region. Constraints: Must be the valid name of an existing cluster that has cross-region snapshot copy enabled.
     */
    ClusterIdentifier: String;
  }
  export interface DisableSnapshotCopyResult {
    Cluster?: Cluster;
  }
  export interface DisassociateDataShareConsumerMessage {
    /**
     * The Amazon Resource Name (ARN) of the datashare to remove association for. 
     */
    DataShareArn: String;
    /**
     * A value that specifies whether association for the datashare is removed from the entire account.
     */
    DisassociateEntireAccount?: BooleanOptional;
    /**
     * The Amazon Resource Name (ARN) of the consumer that association for the datashare is removed from.
     */
    ConsumerArn?: String;
    /**
     * From a datashare consumer account, removes association of a datashare from all the existing and future namespaces in the specified Amazon Web Services Region.
     */
    ConsumerRegion?: String;
  }
  export type Double = number;
  export type DoubleOptional = number;
  export interface EC2SecurityGroup {
    /**
     * The status of the EC2 security group.
     */
    Status?: String;
    /**
     * The name of the EC2 Security Group.
     */
    EC2SecurityGroupName?: String;
    /**
     * The Amazon Web Services account ID of the owner of the EC2 security group specified in the EC2SecurityGroupName field. 
     */
    EC2SecurityGroupOwnerId?: String;
    /**
     * The list of tags for the EC2 security group.
     */
    Tags?: TagList;
  }
  export type EC2SecurityGroupList = EC2SecurityGroup[];
  export interface ElasticIpStatus {
    /**
     * The elastic IP (EIP) address for the cluster.
     */
    ElasticIp?: String;
    /**
     * The status of the elastic IP (EIP) address.
     */
    Status?: String;
  }
  export type EligibleTracksToUpdateList = UpdateTarget[];
  export interface EnableLoggingMessage {
    /**
     * The identifier of the cluster on which logging is to be started. Example: examplecluster 
     */
    ClusterIdentifier: String;
    /**
     * The name of an existing S3 bucket where the log files are to be stored. Constraints:   Must be in the same region as the cluster   The cluster must have read bucket and put object permissions  
     */
    BucketName?: String;
    /**
     * The prefix applied to the log file names. Constraints:   Cannot exceed 512 characters   Cannot contain spaces( ), double quotes ("), single quotes ('), a backslash (\), or control characters. The hexadecimal codes for invalid characters are:    x00 to x20   x22   x27   x5c   x7f or larger    
     */
    S3KeyPrefix?: String;
    /**
     * The log destination type. An enum with possible values of s3 and cloudwatch.
     */
    LogDestinationType?: LogDestinationType;
    /**
     * The collection of exported log types. Possible values are connectionlog, useractivitylog, and userlog.
     */
    LogExports?: LogTypeList;
  }
  export interface EnableSnapshotCopyMessage {
    /**
     * The unique identifier of the source cluster to copy snapshots from. Constraints: Must be the valid name of an existing cluster that does not already have cross-region snapshot copy enabled.
     */
    ClusterIdentifier: String;
    /**
     * The destination Amazon Web Services Region that you want to copy snapshots to. Constraints: Must be the name of a valid Amazon Web Services Region. For more information, see Regions and Endpoints in the Amazon Web Services General Reference. 
     */
    DestinationRegion: String;
    /**
     * The number of days to retain automated snapshots in the destination region after they are copied from the source region. Default: 7. Constraints: Must be at least 1 and no more than 35.
     */
    RetentionPeriod?: IntegerOptional;
    /**
     * The name of the snapshot copy grant to use when snapshots of an Amazon Web Services KMS-encrypted cluster are copied to the destination region.
     */
    SnapshotCopyGrantName?: String;
    /**
     * The number of days to retain newly copied snapshots in the destination Amazon Web Services Region after they are copied from the source Amazon Web Services Region. If the value is -1, the manual snapshot is retained indefinitely.  The value must be either -1 or an integer between 1 and 3,653.
     */
    ManualSnapshotRetentionPeriod?: IntegerOptional;
  }
  export interface EnableSnapshotCopyResult {
    Cluster?: Cluster;
  }
  export interface Endpoint {
    /**
     * The DNS address of the Cluster.
     */
    Address?: String;
    /**
     * The port that the database engine is listening on.
     */
    Port?: Integer;
    /**
     * Describes a connection endpoint.
     */
    VpcEndpoints?: VpcEndpointsList;
  }
  export interface EndpointAccess {
    /**
     * The cluster identifier of the cluster associated with the endpoint.
     */
    ClusterIdentifier?: String;
    /**
     * The Amazon Web Services account ID of the owner of the cluster.
     */
    ResourceOwner?: String;
    /**
     * The subnet group name where Amazon Redshift chooses to deploy the endpoint.
     */
    SubnetGroupName?: String;
    /**
     * The status of the endpoint.
     */
    EndpointStatus?: String;
    /**
     * The name of the endpoint.
     */
    EndpointName?: String;
    /**
     * The time (UTC) that the endpoint was created.
     */
    EndpointCreateTime?: TStamp;
    /**
     * The port number on which the cluster accepts incoming connections.
     */
    Port?: Integer;
    /**
     * The DNS address of the endpoint.
     */
    Address?: String;
    /**
     * The security groups associated with the endpoint.
     */
    VpcSecurityGroups?: VpcSecurityGroupMembershipList;
    VpcEndpoint?: VpcEndpoint;
  }
  export interface EndpointAccessList {
    /**
     * The list of endpoints with access to the cluster.
     */
    EndpointAccessList?: EndpointAccesses;
    /**
     * An optional pagination token provided by a previous DescribeEndpointAccess request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by the MaxRecords parameter.
     */
    Marker?: String;
  }
  export type EndpointAccesses = EndpointAccess[];
  export interface EndpointAuthorization {
    /**
     * The Amazon Web Services account ID of the cluster owner.
     */
    Grantor?: String;
    /**
     * The Amazon Web Services account ID of the grantee of the cluster.
     */
    Grantee?: String;
    /**
     * The cluster identifier.
     */
    ClusterIdentifier?: String;
    /**
     * The time (UTC) when the authorization was created.
     */
    AuthorizeTime?: TStamp;
    /**
     * The status of the cluster.
     */
    ClusterStatus?: String;
    /**
     * The status of the authorization action.
     */
    Status?: AuthorizationStatus;
    /**
     * Indicates whether all VPCs in the grantee account are allowed access to the cluster.
     */
    AllowedAllVPCs?: Boolean;
    /**
     * The VPCs allowed access to the cluster.
     */
    AllowedVPCs?: VpcIdentifierList;
    /**
     * The number of Redshift-managed VPC endpoints created for the authorization.
     */
    EndpointCount?: Integer;
  }
  export interface EndpointAuthorizationList {
    /**
     * The authorizations to an endpoint.
     */
    EndpointAuthorizationList?: EndpointAuthorizations;
    /**
     * An optional pagination token provided by a previous DescribeEndpointAuthorization request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by the MaxRecords parameter.
     */
    Marker?: String;
  }
  export type EndpointAuthorizations = EndpointAuthorization[];
  export interface Event {
    /**
     * The identifier for the source of the event.
     */
    SourceIdentifier?: String;
    /**
     * The source type for this event.
     */
    SourceType?: SourceType;
    /**
     * The text of this event.
     */
    Message?: String;
    /**
     * A list of the event categories. Values: Configuration, Management, Monitoring, Security, Pending
     */
    EventCategories?: EventCategoriesList;
    /**
     * The severity of the event. Values: ERROR, INFO
     */
    Severity?: String;
    /**
     * The date and time of the event.
     */
    Date?: TStamp;
    /**
     * The identifier of the event.
     */
    EventId?: String;
  }
  export type EventCategoriesList = String[];
  export interface EventCategoriesMap {
    /**
     * The source type, such as cluster or cluster-snapshot, that the returned categories belong to.
     */
    SourceType?: String;
    /**
     * The events in the event category.
     */
    Events?: EventInfoMapList;
  }
  export type EventCategoriesMapList = EventCategoriesMap[];
  export interface EventCategoriesMessage {
    /**
     * A list of event categories descriptions.
     */
    EventCategoriesMapList?: EventCategoriesMapList;
  }
  export interface EventInfoMap {
    /**
     * The identifier of an Amazon Redshift event.
     */
    EventId?: String;
    /**
     * The category of an Amazon Redshift event.
     */
    EventCategories?: EventCategoriesList;
    /**
     * The description of an Amazon Redshift event.
     */
    EventDescription?: String;
    /**
     * The severity of the event. Values: ERROR, INFO
     */
    Severity?: String;
  }
  export type EventInfoMapList = EventInfoMap[];
  export type EventList = Event[];
  export interface EventSubscription {
    /**
     * The Amazon Web Services account associated with the Amazon Redshift event notification subscription.
     */
    CustomerAwsId?: String;
    /**
     * The name of the Amazon Redshift event notification subscription.
     */
    CustSubscriptionId?: String;
    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic used by the event notification subscription.
     */
    SnsTopicArn?: String;
    /**
     * The status of the Amazon Redshift event notification subscription. Constraints:   Can be one of the following: active | no-permission | topic-not-exist   The status "no-permission" indicates that Amazon Redshift no longer has permission to post to the Amazon SNS topic. The status "topic-not-exist" indicates that the topic was deleted after the subscription was created.  
     */
    Status?: String;
    /**
     * The date and time the Amazon Redshift event notification subscription was created.
     */
    SubscriptionCreationTime?: TStamp;
    /**
     * The source type of the events returned by the Amazon Redshift event notification, such as cluster, cluster-snapshot, cluster-parameter-group, cluster-security-group, or scheduled-action. 
     */
    SourceType?: String;
    /**
     * A list of the sources that publish events to the Amazon Redshift event notification subscription.
     */
    SourceIdsList?: SourceIdsList;
    /**
     * The list of Amazon Redshift event categories specified in the event notification subscription. Values: Configuration, Management, Monitoring, Security, Pending
     */
    EventCategoriesList?: EventCategoriesList;
    /**
     * The event severity specified in the Amazon Redshift event notification subscription. Values: ERROR, INFO
     */
    Severity?: String;
    /**
     * A boolean value indicating whether the subscription is enabled; true indicates that the subscription is enabled.
     */
    Enabled?: Boolean;
    /**
     * The list of tags for the event subscription.
     */
    Tags?: TagList;
  }
  export type EventSubscriptionsList = EventSubscription[];
  export interface EventSubscriptionsMessage {
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
    /**
     * A list of event subscriptions.
     */
    EventSubscriptionsList?: EventSubscriptionsList;
  }
  export interface EventsMessage {
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
    /**
     * A list of Event instances. 
     */
    Events?: EventList;
  }
  export interface GetClusterCredentialsMessage {
    /**
     * The name of a database user. If a user name matching DbUser exists in the database, the temporary user credentials have the same permissions as the existing user. If DbUser doesn't exist in the database and Autocreate is True, a new user is created using the value for DbUser with PUBLIC permissions. If a database user matching the value for DbUser doesn't exist and Autocreate is False, then the command succeeds but the connection attempt will fail because the user doesn't exist in the database. For more information, see CREATE USER in the Amazon Redshift Database Developer Guide.  Constraints:   Must be 1 to 64 alphanumeric characters or hyphens. The user name can't be PUBLIC.   Must contain uppercase or lowercase letters, numbers, underscore, plus sign, period (dot), at symbol (@), or hyphen.   First character must be a letter.   Must not contain a colon ( : ) or slash ( / ).    Cannot be a reserved word. A list of reserved words can be found in Reserved Words in the Amazon Redshift Database Developer Guide.  
     */
    DbUser: String;
    /**
     * The name of a database that DbUser is authorized to log on to. If DbName is not specified, DbUser can log on to any existing database. Constraints:   Must be 1 to 64 alphanumeric characters or hyphens   Must contain uppercase or lowercase letters, numbers, underscore, plus sign, period (dot), at symbol (@), or hyphen.   First character must be a letter.   Must not contain a colon ( : ) or slash ( / ).    Cannot be a reserved word. A list of reserved words can be found in Reserved Words in the Amazon Redshift Database Developer Guide.  
     */
    DbName?: String;
    /**
     * The unique identifier of the cluster that contains the database for which you are requesting credentials. This parameter is case sensitive.
     */
    ClusterIdentifier?: String;
    /**
     * The number of seconds until the returned temporary password expires. Constraint: minimum 900, maximum 3600. Default: 900
     */
    DurationSeconds?: IntegerOptional;
    /**
     * Create a database user with the name specified for the user named in DbUser if one does not exist.
     */
    AutoCreate?: BooleanOptional;
    /**
     * A list of the names of existing database groups that the user named in DbUser will join for the current session, in addition to any group memberships for an existing user. If not specified, a new user is added only to PUBLIC. Database group name constraints   Must be 1 to 64 alphanumeric characters or hyphens   Must contain only lowercase letters, numbers, underscore, plus sign, period (dot), at symbol (@), or hyphen.   First character must be a letter.   Must not contain a colon ( : ) or slash ( / ).    Cannot be a reserved word. A list of reserved words can be found in Reserved Words in the Amazon Redshift Database Developer Guide.  
     */
    DbGroups?: DbGroupList;
    /**
     * The custom domain name for the cluster credentials.
     */
    CustomDomainName?: String;
  }
  export interface GetClusterCredentialsWithIAMMessage {
    /**
     * The name of the database for which you are requesting credentials. If the database name is specified, the IAM policy must allow access to the resource dbname for the specified database name. If the database name is not specified, access to all databases is allowed.
     */
    DbName?: String;
    /**
     * The unique identifier of the cluster that contains the database for which you are requesting credentials. 
     */
    ClusterIdentifier?: String;
    /**
     * The number of seconds until the returned temporary password expires. Range: 900-3600. Default: 900.
     */
    DurationSeconds?: IntegerOptional;
    /**
     * The custom domain name for the IAM message cluster credentials.
     */
    CustomDomainName?: String;
  }
  export interface GetReservedNodeExchangeConfigurationOptionsInputMessage {
    /**
     * The action type of the reserved-node configuration. The action type can be an exchange initiated from either a snapshot or a resize.
     */
    ActionType: ReservedNodeExchangeActionType;
    /**
     * The identifier for the cluster that is the source for a reserved-node exchange.
     */
    ClusterIdentifier?: String;
    /**
     * The identifier for the snapshot that is the source for the reserved-node exchange.
     */
    SnapshotIdentifier?: String;
    /**
     * The maximum number of response records to return in each call. If the number of remaining response records exceeds the specified MaxRecords value, a value is returned in a Marker field of the response. You can retrieve the next set of records by retrying the command with the returned marker value.
     */
    MaxRecords?: IntegerOptional;
    /**
     * An optional pagination token provided by a previous GetReservedNodeExchangeConfigurationOptions request. If this parameter is specified, the response includes only records beyond the marker, up to the value specified by the MaxRecords parameter. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request.
     */
    Marker?: String;
  }
  export interface GetReservedNodeExchangeConfigurationOptionsOutputMessage {
    /**
     * A pagination token provided by a previous GetReservedNodeExchangeConfigurationOptions request.
     */
    Marker?: String;
    /**
     * the configuration options for the reserved-node exchange. These options include information about the source reserved node and target reserved node. Details include the node type, the price, the node count, and the offering type.
     */
    ReservedNodeConfigurationOptionList?: ReservedNodeConfigurationOptionList;
  }
  export interface GetReservedNodeExchangeOfferingsInputMessage {
    /**
     * A string representing the node identifier for the DC1 Reserved Node to be exchanged.
     */
    ReservedNodeId: String;
    /**
     * An integer setting the maximum number of ReservedNodeOfferings to retrieve.
     */
    MaxRecords?: IntegerOptional;
    /**
     * A value that indicates the starting point for the next set of ReservedNodeOfferings.
     */
    Marker?: String;
  }
  export interface GetReservedNodeExchangeOfferingsOutputMessage {
    /**
     * An optional parameter that specifies the starting point for returning a set of response records. When the results of a GetReservedNodeExchangeOfferings request exceed the value specified in MaxRecords, Amazon Redshift returns a value in the marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the marker parameter and retrying the request. 
     */
    Marker?: String;
    /**
     * Returns an array of ReservedNodeOffering objects.
     */
    ReservedNodeOfferings?: ReservedNodeOfferingList;
  }
  export interface HsmClientCertificate {
    /**
     * The identifier of the HSM client certificate.
     */
    HsmClientCertificateIdentifier?: String;
    /**
     * The public key that the Amazon Redshift cluster will use to connect to the HSM. You must register the public key in the HSM.
     */
    HsmClientCertificatePublicKey?: String;
    /**
     * The list of tags for the HSM client certificate.
     */
    Tags?: TagList;
  }
  export type HsmClientCertificateList = HsmClientCertificate[];
  export interface HsmClientCertificateMessage {
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
    /**
     * A list of the identifiers for one or more HSM client certificates used by Amazon Redshift clusters to store and retrieve database encryption keys in an HSM.
     */
    HsmClientCertificates?: HsmClientCertificateList;
  }
  export interface HsmConfiguration {
    /**
     * The name of the Amazon Redshift HSM configuration.
     */
    HsmConfigurationIdentifier?: String;
    /**
     * A text description of the HSM configuration.
     */
    Description?: String;
    /**
     * The IP address that the Amazon Redshift cluster must use to access the HSM.
     */
    HsmIpAddress?: String;
    /**
     * The name of the partition in the HSM where the Amazon Redshift clusters will store their database encryption keys.
     */
    HsmPartitionName?: String;
    /**
     * The list of tags for the HSM configuration.
     */
    Tags?: TagList;
  }
  export type HsmConfigurationList = HsmConfiguration[];
  export interface HsmConfigurationMessage {
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
    /**
     * A list of HsmConfiguration objects.
     */
    HsmConfigurations?: HsmConfigurationList;
  }
  export interface HsmStatus {
    /**
     * Specifies the name of the HSM client certificate the Amazon Redshift cluster uses to retrieve the data encryption keys stored in an HSM.
     */
    HsmClientCertificateIdentifier?: String;
    /**
     * Specifies the name of the HSM configuration that contains the information the Amazon Redshift cluster can use to retrieve and store keys in an HSM.
     */
    HsmConfigurationIdentifier?: String;
    /**
     * Reports whether the Amazon Redshift cluster has finished applying any HSM settings changes specified in a modify cluster command. Values: active, applying
     */
    Status?: String;
  }
  export interface IPRange {
    /**
     * The status of the IP range, for example, "authorized".
     */
    Status?: String;
    /**
     * The IP range in Classless Inter-Domain Routing (CIDR) notation.
     */
    CIDRIP?: String;
    /**
     * The list of tags for the IP range.
     */
    Tags?: TagList;
  }
  export type IPRangeList = IPRange[];
  export type IamRoleArnList = String[];
  export type ImportTablesCompleted = String[];
  export type ImportTablesInProgress = String[];
  export type ImportTablesNotStarted = String[];
  export type Integer = number;
  export type IntegerOptional = number;
  export type LogDestinationType = "s3"|"cloudwatch"|string;
  export type LogTypeList = String[];
  export interface LoggingStatus {
    /**
     *  true if logging is on, false if logging is off.
     */
    LoggingEnabled?: Boolean;
    /**
     * The name of the S3 bucket where the log files are stored.
     */
    BucketName?: String;
    /**
     * The prefix applied to the log file names.
     */
    S3KeyPrefix?: String;
    /**
     * The last time that logs were delivered.
     */
    LastSuccessfulDeliveryTime?: TStamp;
    /**
     * The last time when logs failed to be delivered.
     */
    LastFailureTime?: TStamp;
    /**
     * The message indicating that logs failed to be delivered.
     */
    LastFailureMessage?: String;
    /**
     * The log destination type. An enum with possible values of s3 and cloudwatch.
     */
    LogDestinationType?: LogDestinationType;
    /**
     * The collection of exported log types. Possible values are connectionlog, useractivitylog, and userlog.
     */
    LogExports?: LogTypeList;
  }
  export type Long = number;
  export type LongOptional = number;
  export interface MaintenanceTrack {
    /**
     * The name of the maintenance track. Possible values are current and trailing.
     */
    MaintenanceTrackName?: String;
    /**
     * The version number for the cluster release.
     */
    DatabaseVersion?: String;
    /**
     * An array of UpdateTarget objects to update with the maintenance track. 
     */
    UpdateTargets?: EligibleTracksToUpdateList;
  }
  export type Mode = "standard"|"high-performance"|string;
  export interface ModifyAquaInputMessage {
    /**
     * The identifier of the cluster to be modified.
     */
    ClusterIdentifier: String;
    /**
     * This parameter is retired. Amazon Redshift automatically determines whether to use AQUA (Advanced Query Accelerator).
     */
    AquaConfigurationStatus?: AquaConfigurationStatus;
  }
  export interface ModifyAquaOutputMessage {
    /**
     * This parameter is retired. Amazon Redshift automatically determines whether to use AQUA (Advanced Query Accelerator). 
     */
    AquaConfiguration?: AquaConfiguration;
  }
  export interface ModifyAuthenticationProfileMessage {
    /**
     * The name of the authentication profile to replace.
     */
    AuthenticationProfileName: AuthenticationProfileNameString;
    /**
     * The new content of the authentication profile in JSON format. The maximum length of the JSON string is determined by a quota for your account.
     */
    AuthenticationProfileContent: String;
  }
  export interface ModifyAuthenticationProfileResult {
    /**
     * The name of the authentication profile that was replaced.
     */
    AuthenticationProfileName?: AuthenticationProfileNameString;
    /**
     * The updated content of the authentication profile in JSON format.
     */
    AuthenticationProfileContent?: String;
  }
  export interface ModifyClusterDbRevisionMessage {
    /**
     * The unique identifier of a cluster whose database revision you want to modify.  Example: examplecluster 
     */
    ClusterIdentifier: String;
    /**
     * The identifier of the database revision. You can retrieve this value from the response to the DescribeClusterDbRevisions request.
     */
    RevisionTarget: String;
  }
  export interface ModifyClusterDbRevisionResult {
    Cluster?: Cluster;
  }
  export interface ModifyClusterIamRolesMessage {
    /**
     * The unique identifier of the cluster for which you want to associate or disassociate IAM roles.
     */
    ClusterIdentifier: String;
    /**
     * Zero or more IAM roles to associate with the cluster. The roles must be in their Amazon Resource Name (ARN) format. 
     */
    AddIamRoles?: IamRoleArnList;
    /**
     * Zero or more IAM roles in ARN format to disassociate from the cluster. 
     */
    RemoveIamRoles?: IamRoleArnList;
    /**
     * The Amazon Resource Name (ARN) for the IAM role that was set as default for the cluster when the cluster was last modified.
     */
    DefaultIamRoleArn?: String;
  }
  export interface ModifyClusterIamRolesResult {
    Cluster?: Cluster;
  }
  export interface ModifyClusterMaintenanceMessage {
    /**
     * A unique identifier for the cluster.
     */
    ClusterIdentifier: String;
    /**
     * A boolean indicating whether to enable the deferred maintenance window. 
     */
    DeferMaintenance?: BooleanOptional;
    /**
     * A unique identifier for the deferred maintenance window.
     */
    DeferMaintenanceIdentifier?: String;
    /**
     * A timestamp indicating the start time for the deferred maintenance window.
     */
    DeferMaintenanceStartTime?: TStamp;
    /**
     * A timestamp indicating end time for the deferred maintenance window. If you specify an end time, you can't specify a duration.
     */
    DeferMaintenanceEndTime?: TStamp;
    /**
     * An integer indicating the duration of the maintenance window in days. If you specify a duration, you can't specify an end time. The duration must be 45 days or less.
     */
    DeferMaintenanceDuration?: IntegerOptional;
  }
  export interface ModifyClusterMaintenanceResult {
    Cluster?: Cluster;
  }
  export interface ModifyClusterMessage {
    /**
     * The unique identifier of the cluster to be modified. Example: examplecluster 
     */
    ClusterIdentifier: String;
    /**
     * The new cluster type. When you submit your cluster resize request, your existing cluster goes into a read-only mode. After Amazon Redshift provisions a new cluster based on your resize requirements, there will be outage for a period while the old cluster is deleted and your connection is switched to the new cluster. You can use DescribeResize to track the progress of the resize request.  Valid Values:  multi-node | single-node  
     */
    ClusterType?: String;
    /**
     * The new node type of the cluster. If you specify a new node type, you must also specify the number of nodes parameter.  For more information about resizing clusters, go to Resizing Clusters in Amazon Redshift in the Amazon Redshift Cluster Management Guide. Valid Values: ds2.xlarge | ds2.8xlarge | dc1.large | dc1.8xlarge | dc2.large | dc2.8xlarge | ra3.xlplus | ra3.4xlarge | ra3.16xlarge 
     */
    NodeType?: String;
    /**
     * The new number of nodes of the cluster. If you specify a new number of nodes, you must also specify the node type parameter.  For more information about resizing clusters, go to Resizing Clusters in Amazon Redshift in the Amazon Redshift Cluster Management Guide. Valid Values: Integer greater than 0.
     */
    NumberOfNodes?: IntegerOptional;
    /**
     * A list of cluster security groups to be authorized on this cluster. This change is asynchronously applied as soon as possible. Security groups currently associated with the cluster, and not in the list of groups to apply, will be revoked from the cluster. Constraints:   Must be 1 to 255 alphanumeric characters or hyphens   First character must be a letter   Cannot end with a hyphen or contain two consecutive hyphens  
     */
    ClusterSecurityGroups?: ClusterSecurityGroupNameList;
    /**
     * A list of virtual private cloud (VPC) security groups to be associated with the cluster. This change is asynchronously applied as soon as possible.
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * The new password for the cluster admin user. This change is asynchronously applied as soon as possible. Between the time of the request and the completion of the request, the MasterUserPassword element exists in the PendingModifiedValues element of the operation response.   Operations never return the password, so this operation provides a way to regain access to the admin user account for a cluster if the password is lost.  Default: Uses existing setting. Constraints:   Must be between 8 and 64 characters in length.   Must contain at least one uppercase letter.   Must contain at least one lowercase letter.   Must contain one number.   Can be any printable ASCII character (ASCII code 33-126) except ' (single quote), " (double quote), \, /, or @.  
     */
    MasterUserPassword?: String;
    /**
     * The name of the cluster parameter group to apply to this cluster. This change is applied only after the cluster is rebooted. To reboot a cluster use RebootCluster.  Default: Uses existing setting. Constraints: The cluster parameter group must be in the same parameter group family that matches the cluster version.
     */
    ClusterParameterGroupName?: String;
    /**
     * The number of days that automated snapshots are retained. If the value is 0, automated snapshots are disabled. Even if automated snapshots are disabled, you can still create manual snapshots when you want with CreateClusterSnapshot.  If you decrease the automated snapshot retention period from its current value, existing automated snapshots that fall outside of the new retention period will be immediately deleted. You can't disable automated snapshots for RA3 node types. Set the automated retention period from 1-35 days. Default: Uses existing setting. Constraints: Must be a value from 0 to 35.
     */
    AutomatedSnapshotRetentionPeriod?: IntegerOptional;
    /**
     * The default for number of days that a newly created manual snapshot is retained. If the value is -1, the manual snapshot is retained indefinitely. This value doesn't retroactively change the retention periods of existing manual snapshots. The value must be either -1 or an integer between 1 and 3,653. The default value is -1.
     */
    ManualSnapshotRetentionPeriod?: IntegerOptional;
    /**
     * The weekly time range (in UTC) during which system maintenance can occur, if necessary. If system maintenance is necessary during the window, it may result in an outage. This maintenance window change is made immediately. If the new maintenance window indicates the current time, there must be at least 120 minutes between the current time and end of the window in order to ensure that pending changes are applied. Default: Uses existing setting. Format: ddd:hh24:mi-ddd:hh24:mi, for example wed:07:30-wed:08:00. Valid Days: Mon | Tue | Wed | Thu | Fri | Sat | Sun Constraints: Must be at least 30 minutes.
     */
    PreferredMaintenanceWindow?: String;
    /**
     * The new version number of the Amazon Redshift engine to upgrade to. For major version upgrades, if a non-default cluster parameter group is currently in use, a new cluster parameter group in the cluster parameter group family for the new version must be specified. The new cluster parameter group can be the default for that cluster parameter group family. For more information about parameters and parameter groups, go to Amazon Redshift Parameter Groups in the Amazon Redshift Cluster Management Guide. Example: 1.0 
     */
    ClusterVersion?: String;
    /**
     * If true, major version upgrades will be applied automatically to the cluster during the maintenance window.  Default: false 
     */
    AllowVersionUpgrade?: BooleanOptional;
    /**
     * Specifies the name of the HSM client certificate the Amazon Redshift cluster uses to retrieve the data encryption keys stored in an HSM.
     */
    HsmClientCertificateIdentifier?: String;
    /**
     * Specifies the name of the HSM configuration that contains the information the Amazon Redshift cluster can use to retrieve and store keys in an HSM.
     */
    HsmConfigurationIdentifier?: String;
    /**
     * The new identifier for the cluster. Constraints:   Must contain from 1 to 63 alphanumeric characters or hyphens.   Alphabetic characters must be lowercase.   First character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.   Must be unique for all clusters within an Amazon Web Services account.   Example: examplecluster 
     */
    NewClusterIdentifier?: String;
    /**
     * If true, the cluster can be accessed from a public network. Only clusters in VPCs can be set to be publicly available.
     */
    PubliclyAccessible?: BooleanOptional;
    /**
     * The Elastic IP (EIP) address for the cluster. Constraints: The cluster must be provisioned in EC2-VPC and publicly-accessible through an Internet gateway. For more information about provisioning clusters in EC2-VPC, go to Supported Platforms to Launch Your Cluster in the Amazon Redshift Cluster Management Guide.
     */
    ElasticIp?: String;
    /**
     * An option that specifies whether to create the cluster with enhanced VPC routing enabled. To create a cluster that uses enhanced VPC routing, the cluster must be in a VPC. For more information, see Enhanced VPC Routing in the Amazon Redshift Cluster Management Guide. If this option is true, enhanced VPC routing is enabled.  Default: false
     */
    EnhancedVpcRouting?: BooleanOptional;
    /**
     * The name for the maintenance track that you want to assign for the cluster. This name change is asynchronous. The new track name stays in the PendingModifiedValues for the cluster until the next maintenance window. When the maintenance track changes, the cluster is switched to the latest cluster release available for the maintenance track. At this point, the maintenance track name is applied.
     */
    MaintenanceTrackName?: String;
    /**
     * Indicates whether the cluster is encrypted. If the value is encrypted (true) and you provide a value for the KmsKeyId parameter, we encrypt the cluster with the provided KmsKeyId. If you don't provide a KmsKeyId, we encrypt with the default key.  If the value is not encrypted (false), then the cluster is decrypted. 
     */
    Encrypted?: BooleanOptional;
    /**
     * The Key Management Service (KMS) key ID of the encryption key that you want to use to encrypt data in the cluster.
     */
    KmsKeyId?: String;
    /**
     * The option to enable relocation for an Amazon Redshift cluster between Availability Zones after the cluster modification is complete.
     */
    AvailabilityZoneRelocation?: BooleanOptional;
    /**
     * The option to initiate relocation for an Amazon Redshift cluster to the target Availability Zone.
     */
    AvailabilityZone?: String;
    /**
     * The option to change the port of an Amazon Redshift cluster.
     */
    Port?: IntegerOptional;
  }
  export interface ModifyClusterParameterGroupMessage {
    /**
     * The name of the parameter group to be modified.
     */
    ParameterGroupName: String;
    /**
     * An array of parameters to be modified. A maximum of 20 parameters can be modified in a single request. For each parameter to be modified, you must supply at least the parameter name and parameter value; other name-value pairs of the parameter are optional. For the workload management (WLM) configuration, you must supply all the name-value pairs in the wlm_json_configuration parameter.
     */
    Parameters: ParametersList;
  }
  export interface ModifyClusterResult {
    Cluster?: Cluster;
  }
  export interface ModifyClusterSnapshotMessage {
    /**
     * The identifier of the snapshot whose setting you want to modify.
     */
    SnapshotIdentifier: String;
    /**
     * The number of days that a manual snapshot is retained. If the value is -1, the manual snapshot is retained indefinitely. If the manual snapshot falls outside of the new retention period, you can specify the force option to immediately delete the snapshot. The value must be either -1 or an integer between 1 and 3,653.
     */
    ManualSnapshotRetentionPeriod?: IntegerOptional;
    /**
     * A Boolean option to override an exception if the retention period has already passed.
     */
    Force?: Boolean;
  }
  export interface ModifyClusterSnapshotResult {
    Snapshot?: Snapshot;
  }
  export interface ModifyClusterSnapshotScheduleMessage {
    /**
     * A unique identifier for the cluster whose snapshot schedule you want to modify. 
     */
    ClusterIdentifier: String;
    /**
     * A unique alphanumeric identifier for the schedule that you want to associate with the cluster.
     */
    ScheduleIdentifier?: String;
    /**
     * A boolean to indicate whether to remove the assoiciation between the cluster and the schedule.
     */
    DisassociateSchedule?: BooleanOptional;
  }
  export interface ModifyClusterSubnetGroupMessage {
    /**
     * The name of the subnet group to be modified.
     */
    ClusterSubnetGroupName: String;
    /**
     * A text description of the subnet group to be modified.
     */
    Description?: String;
    /**
     * An array of VPC subnet IDs. A maximum of 20 subnets can be modified in a single request.
     */
    SubnetIds: SubnetIdentifierList;
  }
  export interface ModifyClusterSubnetGroupResult {
    ClusterSubnetGroup?: ClusterSubnetGroup;
  }
  export interface ModifyCustomDomainAssociationMessage {
    /**
     * The custom domain name for a changed custom domain association.
     */
    CustomDomainName?: CustomDomainNameString;
    /**
     * The certificate Amazon Resource Name (ARN) for the changed custom domain association.
     */
    CustomDomainCertificateArn?: CustomDomainCertificateArnString;
    /**
     * The identifier of the cluster to change a custom domain association for.
     */
    ClusterIdentifier: String;
  }
  export interface ModifyCustomDomainAssociationResult {
    /**
     * The custom domain name associated with the result for the changed custom domain association.
     */
    CustomDomainName?: CustomDomainNameString;
    /**
     * The certificate Amazon Resource Name (ARN) associated with the result for the changed custom domain association.
     */
    CustomDomainCertificateArn?: CustomDomainCertificateArnString;
    /**
     * The identifier of the cluster associated with the result for the changed custom domain association.
     */
    ClusterIdentifier?: String;
    /**
     * The certificate expiration time associated with the result for the changed custom domain association.
     */
    CustomDomainCertExpiryTime?: String;
  }
  export interface ModifyEndpointAccessMessage {
    /**
     * The endpoint to be modified.
     */
    EndpointName: String;
    /**
     * The complete list of VPC security groups associated with the endpoint after the endpoint is modified.
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
  }
  export interface ModifyEventSubscriptionMessage {
    /**
     * The name of the modified Amazon Redshift event notification subscription.
     */
    SubscriptionName: String;
    /**
     * The Amazon Resource Name (ARN) of the SNS topic to be used by the event notification subscription.
     */
    SnsTopicArn?: String;
    /**
     * The type of source that will be generating the events. For example, if you want to be notified of events generated by a cluster, you would set this parameter to cluster. If this value is not specified, events are returned for all Amazon Redshift objects in your Amazon Web Services account. You must specify a source type in order to specify source IDs. Valid values: cluster, cluster-parameter-group, cluster-security-group, cluster-snapshot, and scheduled-action.
     */
    SourceType?: String;
    /**
     * A list of one or more identifiers of Amazon Redshift source objects. All of the objects must be of the same type as was specified in the source type parameter. The event subscription will return only events generated by the specified objects. If not specified, then events are returned for all objects within the source type specified. Example: my-cluster-1, my-cluster-2 Example: my-snapshot-20131010
     */
    SourceIds?: SourceIdsList;
    /**
     * Specifies the Amazon Redshift event categories to be published by the event notification subscription. Values: configuration, management, monitoring, security, pending
     */
    EventCategories?: EventCategoriesList;
    /**
     * Specifies the Amazon Redshift event severity to be published by the event notification subscription. Values: ERROR, INFO
     */
    Severity?: String;
    /**
     * A Boolean value indicating if the subscription is enabled. true indicates the subscription is enabled 
     */
    Enabled?: BooleanOptional;
  }
  export interface ModifyEventSubscriptionResult {
    EventSubscription?: EventSubscription;
  }
  export interface ModifyScheduledActionMessage {
    /**
     * The name of the scheduled action to modify. 
     */
    ScheduledActionName: String;
    /**
     * A modified JSON format of the scheduled action. For more information about this parameter, see ScheduledAction. 
     */
    TargetAction?: ScheduledActionType;
    /**
     * A modified schedule in either at( ) or cron( ) format. For more information about this parameter, see ScheduledAction.
     */
    Schedule?: String;
    /**
     * A different IAM role to assume to run the target action. For more information about this parameter, see ScheduledAction.
     */
    IamRole?: String;
    /**
     * A modified description of the scheduled action. 
     */
    ScheduledActionDescription?: String;
    /**
     * A modified start time of the scheduled action. For more information about this parameter, see ScheduledAction. 
     */
    StartTime?: TStamp;
    /**
     * A modified end time of the scheduled action. For more information about this parameter, see ScheduledAction. 
     */
    EndTime?: TStamp;
    /**
     * A modified enable flag of the scheduled action. If true, the scheduled action is active. If false, the scheduled action is disabled. 
     */
    Enable?: BooleanOptional;
  }
  export interface ModifySnapshotCopyRetentionPeriodMessage {
    /**
     * The unique identifier of the cluster for which you want to change the retention period for either automated or manual snapshots that are copied to a destination Amazon Web Services Region. Constraints: Must be the valid name of an existing cluster that has cross-region snapshot copy enabled.
     */
    ClusterIdentifier: String;
    /**
     * The number of days to retain automated snapshots in the destination Amazon Web Services Region after they are copied from the source Amazon Web Services Region. By default, this only changes the retention period of copied automated snapshots.  If you decrease the retention period for automated snapshots that are copied to a destination Amazon Web Services Region, Amazon Redshift deletes any existing automated snapshots that were copied to the destination Amazon Web Services Region and that fall outside of the new retention period. Constraints: Must be at least 1 and no more than 35 for automated snapshots.  If you specify the manual option, only newly copied manual snapshots will have the new retention period.  If you specify the value of -1 newly copied manual snapshots are retained indefinitely. Constraints: The number of days must be either -1 or an integer between 1 and 3,653 for manual snapshots.
     */
    RetentionPeriod: Integer;
    /**
     * Indicates whether to apply the snapshot retention period to newly copied manual snapshots instead of automated snapshots.
     */
    Manual?: Boolean;
  }
  export interface ModifySnapshotCopyRetentionPeriodResult {
    Cluster?: Cluster;
  }
  export interface ModifySnapshotScheduleMessage {
    /**
     * A unique alphanumeric identifier of the schedule to modify.
     */
    ScheduleIdentifier: String;
    /**
     * An updated list of schedule definitions. A schedule definition is made up of schedule expressions, for example, "cron(30 12 *)" or "rate(12 hours)".
     */
    ScheduleDefinitions: ScheduleDefinitionList;
  }
  export interface ModifyUsageLimitMessage {
    /**
     * The identifier of the usage limit to modify.
     */
    UsageLimitId: String;
    /**
     * The new limit amount. For more information about this parameter, see UsageLimit. 
     */
    Amount?: LongOptional;
    /**
     * The new action that Amazon Redshift takes when the limit is reached. For more information about this parameter, see UsageLimit. 
     */
    BreachAction?: UsageLimitBreachAction;
  }
  export interface NetworkInterface {
    /**
     * The network interface identifier. 
     */
    NetworkInterfaceId?: String;
    /**
     * The subnet identifier. 
     */
    SubnetId?: String;
    /**
     * The IPv4 address of the network interface within the subnet. 
     */
    PrivateIpAddress?: String;
    /**
     * The Availability Zone. 
     */
    AvailabilityZone?: String;
  }
  export type NetworkInterfaceList = NetworkInterface[];
  export interface NodeConfigurationOption {
    /**
     * The node type, such as, "ds2.8xlarge".
     */
    NodeType?: String;
    /**
     * The number of nodes.
     */
    NumberOfNodes?: Integer;
    /**
     * The estimated disk utilizaton percentage.
     */
    EstimatedDiskUtilizationPercent?: DoubleOptional;
    /**
     * The category of the node configuration recommendation.
     */
    Mode?: Mode;
  }
  export type NodeConfigurationOptionList = NodeConfigurationOption[];
  export interface NodeConfigurationOptionsFilter {
    /**
     * The name of the element to filter.
     */
    Name?: NodeConfigurationOptionsFilterName;
    /**
     * The filter operator. If filter Name is NodeType only the 'in' operator is supported. Provide one value to evaluate for 'eq', 'lt', 'le', 'gt', and 'ge'. Provide two values to evaluate for 'between'. Provide a list of values for 'in'.
     */
    Operator?: OperatorType;
    /**
     * List of values. Compare Name using Operator to Values. If filter Name is NumberOfNodes, then values can range from 0 to 200. If filter Name is EstimatedDiskUtilizationPercent, then values can range from 0 to 100. For example, filter NumberOfNodes (name) GT (operator) 3 (values).
     */
    Values?: ValueStringList;
  }
  export type NodeConfigurationOptionsFilterList = NodeConfigurationOptionsFilter[];
  export type NodeConfigurationOptionsFilterName = "NodeType"|"NumberOfNodes"|"EstimatedDiskUtilizationPercent"|"Mode"|string;
  export interface NodeConfigurationOptionsMessage {
    /**
     * A list of valid node configurations.
     */
    NodeConfigurationOptionList?: NodeConfigurationOptionList;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
  }
  export type OperatorType = "eq"|"lt"|"gt"|"le"|"ge"|"in"|"between"|string;
  export interface OrderableClusterOption {
    /**
     * The version of the orderable cluster.
     */
    ClusterVersion?: String;
    /**
     * The cluster type, for example multi-node. 
     */
    ClusterType?: String;
    /**
     * The node type for the orderable cluster.
     */
    NodeType?: String;
    /**
     * A list of availability zones for the orderable cluster.
     */
    AvailabilityZones?: AvailabilityZoneList;
  }
  export type OrderableClusterOptionsList = OrderableClusterOption[];
  export interface OrderableClusterOptionsMessage {
    /**
     * An OrderableClusterOption structure containing information about orderable options for the cluster.
     */
    OrderableClusterOptions?: OrderableClusterOptionsList;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
  }
  export interface Parameter {
    /**
     * The name of the parameter.
     */
    ParameterName?: String;
    /**
     * The value of the parameter. If ParameterName is wlm_json_configuration, then the maximum size of ParameterValue is 8000 characters.
     */
    ParameterValue?: String;
    /**
     * A description of the parameter.
     */
    Description?: String;
    /**
     * The source of the parameter value, such as "engine-default" or "user".
     */
    Source?: String;
    /**
     * The data type of the parameter.
     */
    DataType?: String;
    /**
     * The valid range of values for the parameter.
     */
    AllowedValues?: String;
    /**
     * Specifies how to apply the WLM configuration parameter. Some properties can be applied dynamically, while other properties require that any associated clusters be rebooted for the configuration changes to be applied. For more information about parameters and parameter groups, go to Amazon Redshift Parameter Groups in the Amazon Redshift Cluster Management Guide.
     */
    ApplyType?: ParameterApplyType;
    /**
     * If true, the parameter can be modified. Some parameters have security or operational implications that prevent them from being changed. 
     */
    IsModifiable?: Boolean;
    /**
     * The earliest engine version to which the parameter can apply.
     */
    MinimumEngineVersion?: String;
  }
  export type ParameterApplyType = "static"|"dynamic"|string;
  export type ParameterGroupList = ClusterParameterGroup[];
  export type ParametersList = Parameter[];
  export type PartnerIntegrationAccountId = string;
  export type PartnerIntegrationClusterIdentifier = string;
  export type PartnerIntegrationDatabaseName = string;
  export interface PartnerIntegrationInfo {
    /**
     * The name of the database that receives data from a partner.
     */
    DatabaseName?: PartnerIntegrationDatabaseName;
    /**
     * The name of the partner.
     */
    PartnerName?: PartnerIntegrationPartnerName;
    /**
     * The partner integration status.
     */
    Status?: PartnerIntegrationStatus;
    /**
     * The status message provided by the partner.
     */
    StatusMessage?: PartnerIntegrationStatusMessage;
    /**
     * The date (UTC) that the partner integration was created.
     */
    CreatedAt?: TStamp;
    /**
     * The date (UTC) that the partner integration status was last updated by the partner.
     */
    UpdatedAt?: TStamp;
  }
  export type PartnerIntegrationInfoList = PartnerIntegrationInfo[];
  export interface PartnerIntegrationInputMessage {
    /**
     * The Amazon Web Services account ID that owns the cluster.
     */
    AccountId: PartnerIntegrationAccountId;
    /**
     * The cluster identifier of the cluster that receives data from the partner.
     */
    ClusterIdentifier: PartnerIntegrationClusterIdentifier;
    /**
     * The name of the database that receives data from the partner.
     */
    DatabaseName: PartnerIntegrationDatabaseName;
    /**
     * The name of the partner that is authorized to send data.
     */
    PartnerName: PartnerIntegrationPartnerName;
  }
  export interface PartnerIntegrationOutputMessage {
    /**
     * The name of the database that receives data from the partner.
     */
    DatabaseName?: PartnerIntegrationDatabaseName;
    /**
     * The name of the partner that is authorized to send data.
     */
    PartnerName?: PartnerIntegrationPartnerName;
  }
  export type PartnerIntegrationPartnerName = string;
  export type PartnerIntegrationStatus = "Active"|"Inactive"|"RuntimeFailure"|"ConnectionFailure"|string;
  export type PartnerIntegrationStatusMessage = string;
  export interface PauseClusterMessage {
    /**
     * The identifier of the cluster to be paused.
     */
    ClusterIdentifier: String;
  }
  export interface PauseClusterResult {
    Cluster?: Cluster;
  }
  export type PendingActionsList = String[];
  export interface PendingModifiedValues {
    /**
     * The pending or in-progress change of the admin user password for the cluster.
     */
    MasterUserPassword?: String;
    /**
     * The pending or in-progress change of the cluster's node type.
     */
    NodeType?: String;
    /**
     * The pending or in-progress change of the number of nodes in the cluster.
     */
    NumberOfNodes?: IntegerOptional;
    /**
     * The pending or in-progress change of the cluster type.
     */
    ClusterType?: String;
    /**
     * The pending or in-progress change of the service version.
     */
    ClusterVersion?: String;
    /**
     * The pending or in-progress change of the automated snapshot retention period.
     */
    AutomatedSnapshotRetentionPeriod?: IntegerOptional;
    /**
     * The pending or in-progress change of the new identifier for the cluster.
     */
    ClusterIdentifier?: String;
    /**
     * The pending or in-progress change of the ability to connect to the cluster from the public network.
     */
    PubliclyAccessible?: BooleanOptional;
    /**
     * An option that specifies whether to create the cluster with enhanced VPC routing enabled. To create a cluster that uses enhanced VPC routing, the cluster must be in a VPC. For more information, see Enhanced VPC Routing in the Amazon Redshift Cluster Management Guide. If this option is true, enhanced VPC routing is enabled.  Default: false
     */
    EnhancedVpcRouting?: BooleanOptional;
    /**
     * The name of the maintenance track that the cluster will change to during the next maintenance window.
     */
    MaintenanceTrackName?: String;
    /**
     * The encryption type for a cluster. Possible values are: KMS and None. 
     */
    EncryptionType?: String;
  }
  export interface PurchaseReservedNodeOfferingMessage {
    /**
     * The unique identifier of the reserved node offering you want to purchase.
     */
    ReservedNodeOfferingId: String;
    /**
     * The number of reserved nodes that you want to purchase. Default: 1 
     */
    NodeCount?: IntegerOptional;
  }
  export interface PurchaseReservedNodeOfferingResult {
    ReservedNode?: ReservedNode;
  }
  export interface RebootClusterMessage {
    /**
     * The cluster identifier.
     */
    ClusterIdentifier: String;
  }
  export interface RebootClusterResult {
    Cluster?: Cluster;
  }
  export interface RecurringCharge {
    /**
     * The amount charged per the period of time specified by the recurring charge frequency.
     */
    RecurringChargeAmount?: Double;
    /**
     * The frequency at which the recurring charge amount is applied.
     */
    RecurringChargeFrequency?: String;
  }
  export type RecurringChargeList = RecurringCharge[];
  export interface RejectDataShareMessage {
    /**
     * The Amazon Resource Name (ARN) of the datashare to reject.
     */
    DataShareArn: String;
  }
  export interface ReservedNode {
    /**
     * The unique identifier for the reservation.
     */
    ReservedNodeId?: String;
    /**
     * The identifier for the reserved node offering.
     */
    ReservedNodeOfferingId?: String;
    /**
     * The node type of the reserved node.
     */
    NodeType?: String;
    /**
     * The time the reservation started. You purchase a reserved node offering for a duration. This is the start time of that duration.
     */
    StartTime?: TStamp;
    /**
     * The duration of the node reservation in seconds.
     */
    Duration?: Integer;
    /**
     * The fixed cost Amazon Redshift charges you for this reserved node.
     */
    FixedPrice?: Double;
    /**
     * The hourly rate Amazon Redshift charges you for this reserved node.
     */
    UsagePrice?: Double;
    /**
     * The currency code for the reserved cluster.
     */
    CurrencyCode?: String;
    /**
     * The number of reserved compute nodes.
     */
    NodeCount?: Integer;
    /**
     * The state of the reserved compute node. Possible Values:   pending-payment-This reserved node has recently been purchased, and the sale has been approved, but payment has not yet been confirmed.   active-This reserved node is owned by the caller and is available for use.   payment-failed-Payment failed for the purchase attempt.   retired-The reserved node is no longer available.    exchanging-The owner is exchanging the reserved node for another reserved node.  
     */
    State?: String;
    /**
     * The anticipated utilization of the reserved node, as defined in the reserved node offering.
     */
    OfferingType?: String;
    /**
     * The recurring charges for the reserved node.
     */
    RecurringCharges?: RecurringChargeList;
    /**
     * 
     */
    ReservedNodeOfferingType?: ReservedNodeOfferingType;
  }
  export interface ReservedNodeConfigurationOption {
    SourceReservedNode?: ReservedNode;
    /**
     * The target reserved-node count.
     */
    TargetReservedNodeCount?: Integer;
    TargetReservedNodeOffering?: ReservedNodeOffering;
  }
  export type ReservedNodeConfigurationOptionList = ReservedNodeConfigurationOption[];
  export type ReservedNodeExchangeActionType = "restore-cluster"|"resize-cluster"|string;
  export interface ReservedNodeExchangeStatus {
    /**
     * The identifier of the reserved-node exchange request.
     */
    ReservedNodeExchangeRequestId?: String;
    /**
     * The status of the reserved-node exchange request. Statuses include in-progress and requested.
     */
    Status?: ReservedNodeExchangeStatusType;
    /**
     * A date and time that indicate when the reserved-node exchange was requested.
     */
    RequestTime?: TStamp;
    /**
     * The identifier of the source reserved node.
     */
    SourceReservedNodeId?: String;
    /**
     * The source reserved-node type, for example ds2.xlarge.
     */
    SourceReservedNodeType?: String;
    /**
     * The source reserved-node count in the cluster.
     */
    SourceReservedNodeCount?: Integer;
    /**
     * The identifier of the target reserved node offering.
     */
    TargetReservedNodeOfferingId?: String;
    /**
     * The node type of the target reserved node, for example ra3.4xlarge.
     */
    TargetReservedNodeType?: String;
    /**
     * The count of target reserved nodes in the cluster.
     */
    TargetReservedNodeCount?: Integer;
  }
  export type ReservedNodeExchangeStatusList = ReservedNodeExchangeStatus[];
  export type ReservedNodeExchangeStatusType = "REQUESTED"|"PENDING"|"IN_PROGRESS"|"RETRYING"|"SUCCEEDED"|"FAILED"|string;
  export type ReservedNodeList = ReservedNode[];
  export interface ReservedNodeOffering {
    /**
     * The offering identifier.
     */
    ReservedNodeOfferingId?: String;
    /**
     * The node type offered by the reserved node offering.
     */
    NodeType?: String;
    /**
     * The duration, in seconds, for which the offering will reserve the node.
     */
    Duration?: Integer;
    /**
     * The upfront fixed charge you will pay to purchase the specific reserved node offering.
     */
    FixedPrice?: Double;
    /**
     * The rate you are charged for each hour the cluster that is using the offering is running.
     */
    UsagePrice?: Double;
    /**
     * The currency code for the compute nodes offering.
     */
    CurrencyCode?: String;
    /**
     * The anticipated utilization of the reserved node, as defined in the reserved node offering.
     */
    OfferingType?: String;
    /**
     * The charge to your account regardless of whether you are creating any clusters using the node offering. Recurring charges are only in effect for heavy-utilization reserved nodes.
     */
    RecurringCharges?: RecurringChargeList;
    /**
     * 
     */
    ReservedNodeOfferingType?: ReservedNodeOfferingType;
  }
  export type ReservedNodeOfferingList = ReservedNodeOffering[];
  export type ReservedNodeOfferingType = "Regular"|"Upgradable"|string;
  export interface ReservedNodeOfferingsMessage {
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
    /**
     * A list of ReservedNodeOffering objects.
     */
    ReservedNodeOfferings?: ReservedNodeOfferingList;
  }
  export interface ReservedNodesMessage {
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
    /**
     * The list of ReservedNode objects.
     */
    ReservedNodes?: ReservedNodeList;
  }
  export interface ResetClusterParameterGroupMessage {
    /**
     * The name of the cluster parameter group to be reset.
     */
    ParameterGroupName: String;
    /**
     * If true, all parameters in the specified parameter group will be reset to their default values.  Default: true 
     */
    ResetAllParameters?: Boolean;
    /**
     * An array of names of parameters to be reset. If ResetAllParameters option is not used, then at least one parameter name must be supplied.  Constraints: A maximum of 20 parameters can be reset in a single request.
     */
    Parameters?: ParametersList;
  }
  export interface ResizeClusterMessage {
    /**
     * The unique identifier for the cluster to resize.
     */
    ClusterIdentifier: String;
    /**
     * The new cluster type for the specified cluster.
     */
    ClusterType?: String;
    /**
     * The new node type for the nodes you are adding. If not specified, the cluster's current node type is used.
     */
    NodeType?: String;
    /**
     * The new number of nodes for the cluster. If not specified, the cluster's current number of nodes is used.
     */
    NumberOfNodes?: IntegerOptional;
    /**
     * A boolean value indicating whether the resize operation is using the classic resize process. If you don't provide this parameter or set the value to false, the resize type is elastic. 
     */
    Classic?: BooleanOptional;
    /**
     * The identifier of the reserved node.
     */
    ReservedNodeId?: String;
    /**
     * The identifier of the target reserved node offering.
     */
    TargetReservedNodeOfferingId?: String;
  }
  export interface ResizeClusterResult {
    Cluster?: Cluster;
  }
  export interface ResizeInfo {
    /**
     * Returns the value ClassicResize.
     */
    ResizeType?: String;
    /**
     * A boolean value indicating if the resize operation can be cancelled.
     */
    AllowCancelResize?: Boolean;
  }
  export interface ResizeProgressMessage {
    /**
     * The node type that the cluster will have after the resize operation is complete.
     */
    TargetNodeType?: String;
    /**
     * The number of nodes that the cluster will have after the resize operation is complete.
     */
    TargetNumberOfNodes?: IntegerOptional;
    /**
     * The cluster type after the resize operation is complete. Valid Values: multi-node | single-node 
     */
    TargetClusterType?: String;
    /**
     * The status of the resize operation. Valid Values: NONE | IN_PROGRESS | FAILED | SUCCEEDED | CANCELLING 
     */
    Status?: String;
    /**
     * The names of tables that have been completely imported . Valid Values: List of table names.
     */
    ImportTablesCompleted?: ImportTablesCompleted;
    /**
     * The names of tables that are being currently imported. Valid Values: List of table names.
     */
    ImportTablesInProgress?: ImportTablesInProgress;
    /**
     * The names of tables that have not been yet imported. Valid Values: List of table names
     */
    ImportTablesNotStarted?: ImportTablesNotStarted;
    /**
     * The average rate of the resize operation over the last few minutes, measured in megabytes per second. After the resize operation completes, this value shows the average rate of the entire resize operation.
     */
    AvgResizeRateInMegaBytesPerSecond?: DoubleOptional;
    /**
     * The estimated total amount of data, in megabytes, on the cluster before the resize operation began.
     */
    TotalResizeDataInMegaBytes?: LongOptional;
    /**
     * While the resize operation is in progress, this value shows the current amount of data, in megabytes, that has been processed so far. When the resize operation is complete, this value shows the total amount of data, in megabytes, on the cluster, which may be more or less than TotalResizeDataInMegaBytes (the estimated total amount of data before resize).
     */
    ProgressInMegaBytes?: LongOptional;
    /**
     * The amount of seconds that have elapsed since the resize operation began. After the resize operation completes, this value shows the total actual time, in seconds, for the resize operation.
     */
    ElapsedTimeInSeconds?: LongOptional;
    /**
     * The estimated time remaining, in seconds, until the resize operation is complete. This value is calculated based on the average resize rate and the estimated amount of data remaining to be processed. Once the resize operation is complete, this value will be 0.
     */
    EstimatedTimeToCompletionInSeconds?: LongOptional;
    /**
     * An enum with possible values of ClassicResize and ElasticResize. These values describe the type of resize operation being performed. 
     */
    ResizeType?: String;
    /**
     * An optional string to provide additional details about the resize action.
     */
    Message?: String;
    /**
     * The type of encryption for the cluster after the resize is complete. Possible values are KMS and None. 
     */
    TargetEncryptionType?: String;
    /**
     * The percent of data transferred from source cluster to target cluster.
     */
    DataTransferProgressPercent?: DoubleOptional;
  }
  export type RestorableNodeTypeList = String[];
  export interface RestoreFromClusterSnapshotMessage {
    /**
     * The identifier of the cluster that will be created from restoring the snapshot. Constraints:   Must contain from 1 to 63 alphanumeric characters or hyphens.   Alphabetic characters must be lowercase.   First character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.   Must be unique for all clusters within an Amazon Web Services account.  
     */
    ClusterIdentifier: String;
    /**
     * The name of the snapshot from which to create the new cluster. This parameter isn't case sensitive. You must specify this parameter or snapshotArn, but not both. Example: my-snapshot-id 
     */
    SnapshotIdentifier?: String;
    /**
     * The Amazon Resource Name (ARN) of the snapshot associated with the message to restore from a cluster. You must specify this parameter or snapshotIdentifier, but not both.
     */
    SnapshotArn?: String;
    /**
     * The name of the cluster the source snapshot was created from. This parameter is required if your IAM user has a policy containing a snapshot resource element that specifies anything other than * for the cluster name.
     */
    SnapshotClusterIdentifier?: String;
    /**
     * The port number on which the cluster accepts connections. Default: The same port as the original cluster. Constraints: Must be between 1115 and 65535.
     */
    Port?: IntegerOptional;
    /**
     * The Amazon EC2 Availability Zone in which to restore the cluster. Default: A random, system-chosen Availability Zone. Example: us-east-2a 
     */
    AvailabilityZone?: String;
    /**
     * If true, major version upgrades can be applied during the maintenance window to the Amazon Redshift engine that is running on the cluster.  Default: true 
     */
    AllowVersionUpgrade?: BooleanOptional;
    /**
     * The name of the subnet group where you want to cluster restored. A snapshot of cluster in VPC can be restored only in VPC. Therefore, you must provide subnet group name where you want the cluster restored.
     */
    ClusterSubnetGroupName?: String;
    /**
     * If true, the cluster can be accessed from a public network. 
     */
    PubliclyAccessible?: BooleanOptional;
    /**
     * The Amazon Web Services account used to create or copy the snapshot. Required if you are restoring a snapshot you do not own, optional if you own the snapshot.
     */
    OwnerAccount?: String;
    /**
     * Specifies the name of the HSM client certificate the Amazon Redshift cluster uses to retrieve the data encryption keys stored in an HSM.
     */
    HsmClientCertificateIdentifier?: String;
    /**
     * Specifies the name of the HSM configuration that contains the information the Amazon Redshift cluster can use to retrieve and store keys in an HSM.
     */
    HsmConfigurationIdentifier?: String;
    /**
     * The Elastic IP (EIP) address for the cluster. Don't specify the Elastic IP address for a publicly accessible cluster with availability zone relocation turned on.
     */
    ElasticIp?: String;
    /**
     * The name of the parameter group to be associated with this cluster. Default: The default Amazon Redshift cluster parameter group. For information about the default parameter group, go to Working with Amazon Redshift Parameter Groups. Constraints:   Must be 1 to 255 alphanumeric characters or hyphens.   First character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.  
     */
    ClusterParameterGroupName?: String;
    /**
     * A list of security groups to be associated with this cluster. Default: The default cluster security group for Amazon Redshift. Cluster security groups only apply to clusters outside of VPCs.
     */
    ClusterSecurityGroups?: ClusterSecurityGroupNameList;
    /**
     * A list of Virtual Private Cloud (VPC) security groups to be associated with the cluster. Default: The default VPC security group is associated with the cluster. VPC security groups only apply to clusters in VPCs.
     */
    VpcSecurityGroupIds?: VpcSecurityGroupIdList;
    /**
     * The weekly time range (in UTC) during which automated cluster maintenance can occur.  Format: ddd:hh24:mi-ddd:hh24:mi   Default: The value selected for the cluster from which the snapshot was taken. For more information about the time blocks for each region, see Maintenance Windows in Amazon Redshift Cluster Management Guide.  Valid Days: Mon | Tue | Wed | Thu | Fri | Sat | Sun Constraints: Minimum 30-minute window.
     */
    PreferredMaintenanceWindow?: String;
    /**
     * The number of days that automated snapshots are retained. If the value is 0, automated snapshots are disabled. Even if automated snapshots are disabled, you can still create manual snapshots when you want with CreateClusterSnapshot.  You can't disable automated snapshots for RA3 node types. Set the automated retention period from 1-35 days. Default: The value selected for the cluster from which the snapshot was taken. Constraints: Must be a value from 0 to 35.
     */
    AutomatedSnapshotRetentionPeriod?: IntegerOptional;
    /**
     * The default number of days to retain a manual snapshot. If the value is -1, the snapshot is retained indefinitely. This setting doesn't change the retention period of existing snapshots. The value must be either -1 or an integer between 1 and 3,653.
     */
    ManualSnapshotRetentionPeriod?: IntegerOptional;
    /**
     * The Key Management Service (KMS) key ID of the encryption key that encrypts data in the cluster restored from a shared snapshot. You can also provide the key ID when you restore from an unencrypted snapshot to an encrypted cluster in the same account. Additionally, you can specify a new KMS key ID when you restore from an encrypted snapshot in the same account in order to change it. In that case, the restored cluster is encrypted with the new KMS key ID.
     */
    KmsKeyId?: String;
    /**
     * The node type that the restored cluster will be provisioned with. Default: The node type of the cluster from which the snapshot was taken. You can modify this if you are using any DS node type. In that case, you can choose to restore into another DS node type of the same size. For example, you can restore ds1.8xlarge into ds2.8xlarge, or ds1.xlarge into ds2.xlarge. If you have a DC instance type, you must restore into that same instance type and size. In other words, you can only restore a dc1.large instance type into another dc1.large instance type or dc2.large instance type. You can't restore dc1.8xlarge to dc2.8xlarge. First restore to a dc1.8xlarge cluster, then resize to a dc2.8large cluster. For more information about node types, see  About Clusters and Nodes in the Amazon Redshift Cluster Management Guide. 
     */
    NodeType?: String;
    /**
     * An option that specifies whether to create the cluster with enhanced VPC routing enabled. To create a cluster that uses enhanced VPC routing, the cluster must be in a VPC. For more information, see Enhanced VPC Routing in the Amazon Redshift Cluster Management Guide. If this option is true, enhanced VPC routing is enabled.  Default: false
     */
    EnhancedVpcRouting?: BooleanOptional;
    /**
     * Reserved.
     */
    AdditionalInfo?: String;
    /**
     * A list of Identity and Access Management (IAM) roles that can be used by the cluster to access other Amazon Web Services services. You must supply the IAM roles in their Amazon Resource Name (ARN) format.  The maximum number of IAM roles that you can associate is subject to a quota. For more information, go to Quotas and limits in the Amazon Redshift Cluster Management Guide.
     */
    IamRoles?: IamRoleArnList;
    /**
     * The name of the maintenance track for the restored cluster. When you take a snapshot, the snapshot inherits the MaintenanceTrack value from the cluster. The snapshot might be on a different track than the cluster that was the source for the snapshot. For example, suppose that you take a snapshot of a cluster that is on the current track and then change the cluster to be on the trailing track. In this case, the snapshot and the source cluster are on different tracks.
     */
    MaintenanceTrackName?: String;
    /**
     * A unique identifier for the snapshot schedule.
     */
    SnapshotScheduleIdentifier?: String;
    /**
     * The number of nodes specified when provisioning the restored cluster.
     */
    NumberOfNodes?: IntegerOptional;
    /**
     * The option to enable relocation for an Amazon Redshift cluster between Availability Zones after the cluster is restored.
     */
    AvailabilityZoneRelocation?: BooleanOptional;
    /**
     * This parameter is retired. It does not set the AQUA configuration status. Amazon Redshift automatically determines whether to use AQUA (Advanced Query Accelerator).
     */
    AquaConfigurationStatus?: AquaConfigurationStatus;
    /**
     * The Amazon Resource Name (ARN) for the IAM role that was set as default for the cluster when the cluster was last modified while it was restored from a snapshot.
     */
    DefaultIamRoleArn?: String;
    /**
     * The identifier of the target reserved node offering.
     */
    ReservedNodeId?: String;
    /**
     * The identifier of the target reserved node offering.
     */
    TargetReservedNodeOfferingId?: String;
    /**
     * Enables support for restoring an unencrypted snapshot to a cluster encrypted with Key Management Service (KMS) and a customer managed key.
     */
    Encrypted?: BooleanOptional;
  }
  export interface RestoreFromClusterSnapshotResult {
    Cluster?: Cluster;
  }
  export interface RestoreStatus {
    /**
     * The status of the restore action. Returns starting, restoring, completed, or failed.
     */
    Status?: String;
    /**
     * The number of megabytes per second being transferred from the backup storage. Returns the average rate for a completed backup. This field is only updated when you restore to DC2 and DS2 node types. 
     */
    CurrentRestoreRateInMegaBytesPerSecond?: Double;
    /**
     * The size of the set of snapshot data used to restore the cluster. This field is only updated when you restore to DC2 and DS2 node types. 
     */
    SnapshotSizeInMegaBytes?: Long;
    /**
     * The number of megabytes that have been transferred from snapshot storage. This field is only updated when you restore to DC2 and DS2 node types. 
     */
    ProgressInMegaBytes?: Long;
    /**
     * The amount of time an in-progress restore has been running, or the amount of time it took a completed restore to finish. This field is only updated when you restore to DC2 and DS2 node types. 
     */
    ElapsedTimeInSeconds?: Long;
    /**
     * The estimate of the time remaining before the restore will complete. Returns 0 for a completed restore. This field is only updated when you restore to DC2 and DS2 node types. 
     */
    EstimatedTimeToCompletionInSeconds?: Long;
  }
  export interface RestoreTableFromClusterSnapshotMessage {
    /**
     * The identifier of the Amazon Redshift cluster to restore the table to.
     */
    ClusterIdentifier: String;
    /**
     * The identifier of the snapshot to restore the table from. This snapshot must have been created from the Amazon Redshift cluster specified by the ClusterIdentifier parameter.
     */
    SnapshotIdentifier: String;
    /**
     * The name of the source database that contains the table to restore from.
     */
    SourceDatabaseName: String;
    /**
     * The name of the source schema that contains the table to restore from. If you do not specify a SourceSchemaName value, the default is public.
     */
    SourceSchemaName?: String;
    /**
     * The name of the source table to restore from.
     */
    SourceTableName: String;
    /**
     * The name of the database to restore the table to.
     */
    TargetDatabaseName?: String;
    /**
     * The name of the schema to restore the table to.
     */
    TargetSchemaName?: String;
    /**
     * The name of the table to create as a result of the current request.
     */
    NewTableName: String;
    /**
     * Indicates whether name identifiers for database, schema, and table are case sensitive. If true, the names are case sensitive. If false (default), the names are not case sensitive.
     */
    EnableCaseSensitiveIdentifier?: BooleanOptional;
  }
  export interface RestoreTableFromClusterSnapshotResult {
    TableRestoreStatus?: TableRestoreStatus;
  }
  export interface ResumeClusterMessage {
    /**
     * The identifier of the cluster to be resumed.
     */
    ClusterIdentifier: String;
  }
  export interface ResumeClusterResult {
    Cluster?: Cluster;
  }
  export interface RevisionTarget {
    /**
     * A unique string that identifies the version to update the cluster to. You can use this value in ModifyClusterDbRevision.
     */
    DatabaseRevision?: String;
    /**
     * A string that describes the changes and features that will be applied to the cluster when it is updated to the corresponding ClusterDbRevision.
     */
    Description?: String;
    /**
     * The date on which the database revision was released.
     */
    DatabaseRevisionReleaseDate?: TStamp;
  }
  export type RevisionTargetsList = RevisionTarget[];
  export interface RevokeClusterSecurityGroupIngressMessage {
    /**
     * The name of the security Group from which to revoke the ingress rule.
     */
    ClusterSecurityGroupName: String;
    /**
     * The IP range for which to revoke access. This range must be a valid Classless Inter-Domain Routing (CIDR) block of IP addresses. If CIDRIP is specified, EC2SecurityGroupName and EC2SecurityGroupOwnerId cannot be provided. 
     */
    CIDRIP?: String;
    /**
     * The name of the EC2 Security Group whose access is to be revoked. If EC2SecurityGroupName is specified, EC2SecurityGroupOwnerId must also be provided and CIDRIP cannot be provided. 
     */
    EC2SecurityGroupName?: String;
    /**
     * The Amazon Web Services account number of the owner of the security group specified in the EC2SecurityGroupName parameter. The Amazon Web Services access key ID is not an acceptable value. If EC2SecurityGroupOwnerId is specified, EC2SecurityGroupName must also be provided. and CIDRIP cannot be provided.  Example: 111122223333 
     */
    EC2SecurityGroupOwnerId?: String;
  }
  export interface RevokeClusterSecurityGroupIngressResult {
    ClusterSecurityGroup?: ClusterSecurityGroup;
  }
  export interface RevokeEndpointAccessMessage {
    /**
     * The cluster to revoke access from.
     */
    ClusterIdentifier?: String;
    /**
     * The Amazon Web Services account ID whose access is to be revoked.
     */
    Account?: String;
    /**
     * The virtual private cloud (VPC) identifiers for which access is to be revoked.
     */
    VpcIds?: VpcIdentifierList;
    /**
     * Indicates whether to force the revoke action. If true, the Redshift-managed VPC endpoints associated with the endpoint authorization are also deleted.
     */
    Force?: Boolean;
  }
  export interface RevokeSnapshotAccessMessage {
    /**
     * The identifier of the snapshot that the account can no longer access.
     */
    SnapshotIdentifier?: String;
    /**
     * The Amazon Resource Name (ARN) of the snapshot associated with the message to revoke access.
     */
    SnapshotArn?: String;
    /**
     * The identifier of the cluster the snapshot was created from. This parameter is required if your IAM user has a policy containing a snapshot resource element that specifies anything other than * for the cluster name.
     */
    SnapshotClusterIdentifier?: String;
    /**
     * The identifier of the Amazon Web Services account that can no longer restore the specified snapshot.
     */
    AccountWithRestoreAccess: String;
  }
  export interface RevokeSnapshotAccessResult {
    Snapshot?: Snapshot;
  }
  export interface RotateEncryptionKeyMessage {
    /**
     * The unique identifier of the cluster that you want to rotate the encryption keys for. Constraints: Must be the name of valid cluster that has encryption enabled.
     */
    ClusterIdentifier: String;
  }
  export interface RotateEncryptionKeyResult {
    Cluster?: Cluster;
  }
  export type ScheduleDefinitionList = String[];
  export type ScheduleState = "MODIFYING"|"ACTIVE"|"FAILED"|string;
  export interface ScheduledAction {
    /**
     * The name of the scheduled action. 
     */
    ScheduledActionName?: String;
    /**
     * A JSON format string of the Amazon Redshift API operation with input parameters.  "{\"ResizeCluster\":{\"NodeType\":\"ds2.8xlarge\",\"ClusterIdentifier\":\"my-test-cluster\",\"NumberOfNodes\":3}}". 
     */
    TargetAction?: ScheduledActionType;
    /**
     * The schedule for a one-time (at format) or recurring (cron format) scheduled action. Schedule invocations must be separated by at least one hour. Format of at expressions is "at(yyyy-mm-ddThh:mm:ss)". For example, "at(2016-03-04T17:27:00)". Format of cron expressions is "cron(Minutes Hours Day-of-month Month Day-of-week Year)". For example, "cron(0 10 ? * MON *)". For more information, see Cron Expressions in the Amazon CloudWatch Events User Guide.
     */
    Schedule?: String;
    /**
     * The IAM role to assume to run the scheduled action. This IAM role must have permission to run the Amazon Redshift API operation in the scheduled action. This IAM role must allow the Amazon Redshift scheduler (Principal scheduler.redshift.amazonaws.com) to assume permissions on your behalf. For more information about the IAM role to use with the Amazon Redshift scheduler, see Using Identity-Based Policies for Amazon Redshift in the Amazon Redshift Cluster Management Guide. 
     */
    IamRole?: String;
    /**
     * The description of the scheduled action. 
     */
    ScheduledActionDescription?: String;
    /**
     * The state of the scheduled action. For example, DISABLED. 
     */
    State?: ScheduledActionState;
    /**
     * List of times when the scheduled action will run. 
     */
    NextInvocations?: ScheduledActionTimeList;
    /**
     * The start time in UTC when the schedule is active. Before this time, the scheduled action does not trigger. 
     */
    StartTime?: TStamp;
    /**
     * The end time in UTC when the schedule is no longer active. After this time, the scheduled action does not trigger. 
     */
    EndTime?: TStamp;
  }
  export interface ScheduledActionFilter {
    /**
     * The type of element to filter. 
     */
    Name: ScheduledActionFilterName;
    /**
     * List of values. Compare if the value (of type defined by Name) equals an item in the list of scheduled actions. 
     */
    Values: ValueStringList;
  }
  export type ScheduledActionFilterList = ScheduledActionFilter[];
  export type ScheduledActionFilterName = "cluster-identifier"|"iam-role"|string;
  export type ScheduledActionList = ScheduledAction[];
  export type ScheduledActionState = "ACTIVE"|"DISABLED"|string;
  export type ScheduledActionTimeList = TStamp[];
  export interface ScheduledActionType {
    /**
     * An action that runs a ResizeCluster API operation. 
     */
    ResizeCluster?: ResizeClusterMessage;
    /**
     * An action that runs a PauseCluster API operation. 
     */
    PauseCluster?: PauseClusterMessage;
    /**
     * An action that runs a ResumeCluster API operation. 
     */
    ResumeCluster?: ResumeClusterMessage;
  }
  export type ScheduledActionTypeValues = "ResizeCluster"|"PauseCluster"|"ResumeCluster"|string;
  export interface ScheduledActionsMessage {
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeScheduledActions request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request. 
     */
    Marker?: String;
    /**
     * List of retrieved scheduled actions. 
     */
    ScheduledActions?: ScheduledActionList;
  }
  export type ScheduledSnapshotTimeList = TStamp[];
  export type SensitiveString = string;
  export interface Snapshot {
    /**
     * The snapshot identifier that is provided in the request.
     */
    SnapshotIdentifier?: String;
    /**
     * The identifier of the cluster for which the snapshot was taken.
     */
    ClusterIdentifier?: String;
    /**
     * The time (in UTC format) when Amazon Redshift began the snapshot. A snapshot contains a copy of the cluster data as of this exact time.
     */
    SnapshotCreateTime?: TStamp;
    /**
     * The snapshot status. The value of the status depends on the API operation used:     CreateClusterSnapshot and CopyClusterSnapshot returns status as "creating".     DescribeClusterSnapshots returns status as "creating", "available", "final snapshot", or "failed".    DeleteClusterSnapshot returns status as "deleted".  
     */
    Status?: String;
    /**
     * The port that the cluster is listening on.
     */
    Port?: Integer;
    /**
     * The Availability Zone in which the cluster was created.
     */
    AvailabilityZone?: String;
    /**
     * The time (UTC) when the cluster was originally created.
     */
    ClusterCreateTime?: TStamp;
    /**
     * The admin user name for the cluster.
     */
    MasterUsername?: String;
    /**
     * The version ID of the Amazon Redshift engine that is running on the cluster.
     */
    ClusterVersion?: String;
    /**
     * The cluster version of the cluster used to create the snapshot. For example, 1.0.15503. 
     */
    EngineFullVersion?: String;
    /**
     * The snapshot type. Snapshots created using CreateClusterSnapshot and CopyClusterSnapshot are of type "manual". 
     */
    SnapshotType?: String;
    /**
     * The node type of the nodes in the cluster.
     */
    NodeType?: String;
    /**
     * The number of nodes in the cluster.
     */
    NumberOfNodes?: Integer;
    /**
     * The name of the database that was created when the cluster was created.
     */
    DBName?: String;
    /**
     * The VPC identifier of the cluster if the snapshot is from a cluster in a VPC. Otherwise, this field is not in the output.
     */
    VpcId?: String;
    /**
     * If true, the data in the snapshot is encrypted at rest.
     */
    Encrypted?: Boolean;
    /**
     * The Key Management Service (KMS) key ID of the encryption key that was used to encrypt data in the cluster from which the snapshot was taken.
     */
    KmsKeyId?: String;
    /**
     * A boolean that indicates whether the snapshot data is encrypted using the HSM keys of the source cluster. true indicates that the data is encrypted using HSM keys.
     */
    EncryptedWithHSM?: Boolean;
    /**
     * A list of the Amazon Web Services accounts authorized to restore the snapshot. Returns null if no accounts are authorized. Visible only to the snapshot owner. 
     */
    AccountsWithRestoreAccess?: AccountsWithRestoreAccessList;
    /**
     * For manual snapshots, the Amazon Web Services account used to create or copy the snapshot. For automatic snapshots, the owner of the cluster. The owner can perform all snapshot actions, such as sharing a manual snapshot.
     */
    OwnerAccount?: String;
    /**
     * The size of the complete set of backup data that would be used to restore the cluster.
     */
    TotalBackupSizeInMegaBytes?: Double;
    /**
     * The size of the incremental backup.
     */
    ActualIncrementalBackupSizeInMegaBytes?: Double;
    /**
     * The number of megabytes that have been transferred to the snapshot backup.
     */
    BackupProgressInMegaBytes?: Double;
    /**
     * The number of megabytes per second being transferred to the snapshot backup. Returns 0 for a completed backup. 
     */
    CurrentBackupRateInMegaBytesPerSecond?: Double;
    /**
     * The estimate of the time remaining before the snapshot backup will complete. Returns 0 for a completed backup. 
     */
    EstimatedSecondsToCompletion?: Long;
    /**
     * The amount of time an in-progress snapshot backup has been running, or the amount of time it took a completed backup to finish.
     */
    ElapsedTimeInSeconds?: Long;
    /**
     * The source region from which the snapshot was copied.
     */
    SourceRegion?: String;
    /**
     * The list of tags for the cluster snapshot.
     */
    Tags?: TagList;
    /**
     * The list of node types that this cluster snapshot is able to restore into.
     */
    RestorableNodeTypes?: RestorableNodeTypeList;
    /**
     * An option that specifies whether to create the cluster with enhanced VPC routing enabled. To create a cluster that uses enhanced VPC routing, the cluster must be in a VPC. For more information, see Enhanced VPC Routing in the Amazon Redshift Cluster Management Guide. If this option is true, enhanced VPC routing is enabled.  Default: false
     */
    EnhancedVpcRouting?: Boolean;
    /**
     * The name of the maintenance track for the snapshot.
     */
    MaintenanceTrackName?: String;
    /**
     * The number of days that a manual snapshot is retained. If the value is -1, the manual snapshot is retained indefinitely.  The value must be either -1 or an integer between 1 and 3,653.
     */
    ManualSnapshotRetentionPeriod?: IntegerOptional;
    /**
     * The number of days until a manual snapshot will pass its retention period.
     */
    ManualSnapshotRemainingDays?: IntegerOptional;
    /**
     * A timestamp representing the start of the retention period for the snapshot.
     */
    SnapshotRetentionStartTime?: TStamp;
  }
  export type SnapshotAttributeToSortBy = "SOURCE_TYPE"|"TOTAL_SIZE"|"CREATE_TIME"|string;
  export interface SnapshotCopyGrant {
    /**
     * The name of the snapshot copy grant.
     */
    SnapshotCopyGrantName?: String;
    /**
     * The unique identifier of the encrypted symmetric key in Amazon Web Services KMS to which Amazon Redshift is granted permission.
     */
    KmsKeyId?: String;
    /**
     * A list of tag instances.
     */
    Tags?: TagList;
  }
  export type SnapshotCopyGrantList = SnapshotCopyGrant[];
  export interface SnapshotCopyGrantMessage {
    /**
     * An optional parameter that specifies the starting point to return a set of response records. When the results of a DescribeSnapshotCopyGrant request exceed the value specified in MaxRecords, Amazon Web Services returns a value in the Marker field of the response. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request.  Constraints: You can specify either the SnapshotCopyGrantName parameter or the Marker parameter, but not both. 
     */
    Marker?: String;
    /**
     * The list of SnapshotCopyGrant objects.
     */
    SnapshotCopyGrants?: SnapshotCopyGrantList;
  }
  export interface SnapshotErrorMessage {
    /**
     * A unique identifier for the snapshot returning the error.
     */
    SnapshotIdentifier?: String;
    /**
     * A unique identifier for the cluster.
     */
    SnapshotClusterIdentifier?: String;
    /**
     * The failure code for the error.
     */
    FailureCode?: String;
    /**
     * The text message describing the error.
     */
    FailureReason?: String;
  }
  export type SnapshotIdentifierList = String[];
  export type SnapshotList = Snapshot[];
  export interface SnapshotMessage {
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
    /**
     * A list of Snapshot instances. 
     */
    Snapshots?: SnapshotList;
  }
  export interface SnapshotSchedule {
    /**
     * A list of ScheduleDefinitions.
     */
    ScheduleDefinitions?: ScheduleDefinitionList;
    /**
     * A unique identifier for the schedule.
     */
    ScheduleIdentifier?: String;
    /**
     * The description of the schedule.
     */
    ScheduleDescription?: String;
    /**
     * An optional set of tags describing the schedule.
     */
    Tags?: TagList;
    /**
     * 
     */
    NextInvocations?: ScheduledSnapshotTimeList;
    /**
     * The number of clusters associated with the schedule.
     */
    AssociatedClusterCount?: IntegerOptional;
    /**
     * A list of clusters associated with the schedule. A maximum of 100 clusters is returned.
     */
    AssociatedClusters?: AssociatedClusterList;
  }
  export type SnapshotScheduleList = SnapshotSchedule[];
  export interface SnapshotSortingEntity {
    /**
     * The category for sorting the snapshots.
     */
    Attribute: SnapshotAttributeToSortBy;
    /**
     * The order for listing the attributes.
     */
    SortOrder?: SortByOrder;
  }
  export type SnapshotSortingEntityList = SnapshotSortingEntity[];
  export type SortByOrder = "ASC"|"DESC"|string;
  export type SourceIdsList = String[];
  export type SourceType = "cluster"|"cluster-parameter-group"|"cluster-security-group"|"cluster-snapshot"|"scheduled-action"|string;
  export type String = string;
  export interface Subnet {
    /**
     * The identifier of the subnet.
     */
    SubnetIdentifier?: String;
    /**
     * 
     */
    SubnetAvailabilityZone?: AvailabilityZone;
    /**
     * The status of the subnet.
     */
    SubnetStatus?: String;
  }
  export type SubnetIdentifierList = String[];
  export type SubnetList = Subnet[];
  export interface SupportedOperation {
    /**
     * A list of the supported operations.
     */
    OperationName?: String;
  }
  export type SupportedOperationList = SupportedOperation[];
  export interface SupportedPlatform {
    /**
     * 
     */
    Name?: String;
  }
  export type SupportedPlatformsList = SupportedPlatform[];
  export type TStamp = Date;
  export interface TableRestoreStatus {
    /**
     * The unique identifier for the table restore request.
     */
    TableRestoreRequestId?: String;
    /**
     * A value that describes the current state of the table restore request. Valid Values: SUCCEEDED, FAILED, CANCELED, PENDING, IN_PROGRESS 
     */
    Status?: TableRestoreStatusType;
    /**
     * A description of the status of the table restore request. Status values include SUCCEEDED, FAILED, CANCELED, PENDING, IN_PROGRESS.
     */
    Message?: String;
    /**
     * The time that the table restore request was made, in Universal Coordinated Time (UTC).
     */
    RequestTime?: TStamp;
    /**
     * The amount of data restored to the new table so far, in megabytes (MB).
     */
    ProgressInMegaBytes?: LongOptional;
    /**
     * The total amount of data to restore to the new table, in megabytes (MB).
     */
    TotalDataInMegaBytes?: LongOptional;
    /**
     * The identifier of the Amazon Redshift cluster that the table is being restored to.
     */
    ClusterIdentifier?: String;
    /**
     * The identifier of the snapshot that the table is being restored from.
     */
    SnapshotIdentifier?: String;
    /**
     * The name of the source database that contains the table being restored.
     */
    SourceDatabaseName?: String;
    /**
     * The name of the source schema that contains the table being restored.
     */
    SourceSchemaName?: String;
    /**
     * The name of the source table being restored.
     */
    SourceTableName?: String;
    /**
     * The name of the database to restore the table to.
     */
    TargetDatabaseName?: String;
    /**
     * The name of the schema to restore the table to.
     */
    TargetSchemaName?: String;
    /**
     * The name of the table to create as a result of the table restore request.
     */
    NewTableName?: String;
  }
  export type TableRestoreStatusList = TableRestoreStatus[];
  export interface TableRestoreStatusMessage {
    /**
     * A list of status details for one or more table restore requests.
     */
    TableRestoreStatusDetails?: TableRestoreStatusList;
    /**
     * A pagination token that can be used in a subsequent DescribeTableRestoreStatus request.
     */
    Marker?: String;
  }
  export type TableRestoreStatusType = "PENDING"|"IN_PROGRESS"|"SUCCEEDED"|"FAILED"|"CANCELED"|string;
  export interface Tag {
    /**
     * The key, or name, for the resource tag.
     */
    Key?: String;
    /**
     * The value for the resource tag.
     */
    Value?: String;
  }
  export type TagKeyList = String[];
  export type TagList = Tag[];
  export type TagValueList = String[];
  export interface TaggedResource {
    /**
     * The tag for the resource.
     */
    Tag?: Tag;
    /**
     * The Amazon Resource Name (ARN) with which the tag is associated, for example: arn:aws:redshift:us-east-2:123456789:cluster:t1.
     */
    ResourceName?: String;
    /**
     * The type of resource with which the tag is associated. Valid resource types are:    Cluster   CIDR/IP   EC2 security group   Snapshot   Cluster security group   Subnet group   HSM connection   HSM certificate   Parameter group   For more information about Amazon Redshift resource types and constructing ARNs, go to Constructing an Amazon Redshift Amazon Resource Name (ARN) in the Amazon Redshift Cluster Management Guide. 
     */
    ResourceType?: String;
  }
  export type TaggedResourceList = TaggedResource[];
  export interface TaggedResourceListMessage {
    /**
     * A list of tags with their associated resources.
     */
    TaggedResources?: TaggedResourceList;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
  }
  export type TrackList = MaintenanceTrack[];
  export interface TrackListMessage {
    /**
     * A list of maintenance tracks output by the DescribeClusterTracks operation. 
     */
    MaintenanceTracks?: TrackList;
    /**
     * The starting point to return a set of response tracklist records. You can retrieve the next set of response records by providing the returned marker value in the Marker parameter and retrying the request.
     */
    Marker?: String;
  }
  export interface UpdatePartnerStatusInputMessage {
    /**
     * The Amazon Web Services account ID that owns the cluster.
     */
    AccountId: PartnerIntegrationAccountId;
    /**
     * The cluster identifier of the cluster whose partner integration status is being updated.
     */
    ClusterIdentifier: PartnerIntegrationClusterIdentifier;
    /**
     * The name of the database whose partner integration status is being updated.
     */
    DatabaseName: PartnerIntegrationDatabaseName;
    /**
     * The name of the partner whose integration status is being updated.
     */
    PartnerName: PartnerIntegrationPartnerName;
    /**
     * The value of the updated status.
     */
    Status: PartnerIntegrationStatus;
    /**
     * The status message provided by the partner.
     */
    StatusMessage?: PartnerIntegrationStatusMessage;
  }
  export interface UpdateTarget {
    /**
     * The name of the new maintenance track.
     */
    MaintenanceTrackName?: String;
    /**
     * The cluster version for the new maintenance track.
     */
    DatabaseVersion?: String;
    /**
     * A list of operations supported by the maintenance track.
     */
    SupportedOperations?: SupportedOperationList;
  }
  export interface UsageLimit {
    /**
     * The identifier of the usage limit.
     */
    UsageLimitId?: String;
    /**
     * The identifier of the cluster with a usage limit.
     */
    ClusterIdentifier?: String;
    /**
     * The Amazon Redshift feature to which the limit applies.
     */
    FeatureType?: UsageLimitFeatureType;
    /**
     * The type of limit. Depending on the feature type, this can be based on a time duration or data size.
     */
    LimitType?: UsageLimitLimitType;
    /**
     * The limit amount. If time-based, this amount is in minutes. If data-based, this amount is in terabytes (TB).
     */
    Amount?: Long;
    /**
     * The time period that the amount applies to. A weekly period begins on Sunday. The default is monthly. 
     */
    Period?: UsageLimitPeriod;
    /**
     * The action that Amazon Redshift takes when the limit is reached. Possible values are:     log - To log an event in a system table. The default is log.    emit-metric - To emit CloudWatch metrics.    disable - To disable the feature until the next usage period begins.  
     */
    BreachAction?: UsageLimitBreachAction;
    /**
     * A list of tag instances.
     */
    Tags?: TagList;
  }
  export type UsageLimitBreachAction = "log"|"emit-metric"|"disable"|string;
  export type UsageLimitFeatureType = "spectrum"|"concurrency-scaling"|"cross-region-datasharing"|string;
  export type UsageLimitLimitType = "time"|"data-scanned"|string;
  export interface UsageLimitList {
    /**
     * Contains the output from the DescribeUsageLimits action. 
     */
    UsageLimits?: UsageLimits;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned marker value in the Marker parameter and retrying the command. If the Marker field is empty, all response records have been retrieved for the request. 
     */
    Marker?: String;
  }
  export type UsageLimitPeriod = "daily"|"weekly"|"monthly"|string;
  export type UsageLimits = UsageLimit[];
  export type ValueStringList = String[];
  export interface VpcEndpoint {
    /**
     * The connection endpoint ID for connecting an Amazon Redshift cluster through the proxy.
     */
    VpcEndpointId?: String;
    /**
     * The VPC identifier that the endpoint is associated. 
     */
    VpcId?: String;
    /**
     * One or more network interfaces of the endpoint. Also known as an interface endpoint. 
     */
    NetworkInterfaces?: NetworkInterfaceList;
  }
  export type VpcEndpointsList = VpcEndpoint[];
  export type VpcIdentifierList = String[];
  export type VpcSecurityGroupIdList = String[];
  export interface VpcSecurityGroupMembership {
    /**
     * The identifier of the VPC security group.
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
  export type apiVersion = "2012-12-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Redshift client.
   */
  export import Types = Redshift;
}
export = Redshift;
