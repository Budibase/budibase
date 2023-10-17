import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Kafka extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Kafka.Types.ClientConfiguration)
  config: Config & Kafka.Types.ClientConfiguration;
  /**
   * 
            Associates one or more Scram Secrets with an Amazon MSK cluster.
         
   */
  batchAssociateScramSecret(params: Kafka.Types.BatchAssociateScramSecretRequest, callback?: (err: AWSError, data: Kafka.Types.BatchAssociateScramSecretResponse) => void): Request<Kafka.Types.BatchAssociateScramSecretResponse, AWSError>;
  /**
   * 
            Associates one or more Scram Secrets with an Amazon MSK cluster.
         
   */
  batchAssociateScramSecret(callback?: (err: AWSError, data: Kafka.Types.BatchAssociateScramSecretResponse) => void): Request<Kafka.Types.BatchAssociateScramSecretResponse, AWSError>;
  /**
   * 
            Creates a new MSK cluster.
         
   */
  createCluster(params: Kafka.Types.CreateClusterRequest, callback?: (err: AWSError, data: Kafka.Types.CreateClusterResponse) => void): Request<Kafka.Types.CreateClusterResponse, AWSError>;
  /**
   * 
            Creates a new MSK cluster.
         
   */
  createCluster(callback?: (err: AWSError, data: Kafka.Types.CreateClusterResponse) => void): Request<Kafka.Types.CreateClusterResponse, AWSError>;
  /**
   * 
            Creates a new MSK cluster.
         
   */
  createClusterV2(params: Kafka.Types.CreateClusterV2Request, callback?: (err: AWSError, data: Kafka.Types.CreateClusterV2Response) => void): Request<Kafka.Types.CreateClusterV2Response, AWSError>;
  /**
   * 
            Creates a new MSK cluster.
         
   */
  createClusterV2(callback?: (err: AWSError, data: Kafka.Types.CreateClusterV2Response) => void): Request<Kafka.Types.CreateClusterV2Response, AWSError>;
  /**
   * 
            Creates a new MSK configuration.
         
   */
  createConfiguration(params: Kafka.Types.CreateConfigurationRequest, callback?: (err: AWSError, data: Kafka.Types.CreateConfigurationResponse) => void): Request<Kafka.Types.CreateConfigurationResponse, AWSError>;
  /**
   * 
            Creates a new MSK configuration.
         
   */
  createConfiguration(callback?: (err: AWSError, data: Kafka.Types.CreateConfigurationResponse) => void): Request<Kafka.Types.CreateConfigurationResponse, AWSError>;
  /**
   * 
            Creates a new MSK VPC connection.
         
   */
  createVpcConnection(params: Kafka.Types.CreateVpcConnectionRequest, callback?: (err: AWSError, data: Kafka.Types.CreateVpcConnectionResponse) => void): Request<Kafka.Types.CreateVpcConnectionResponse, AWSError>;
  /**
   * 
            Creates a new MSK VPC connection.
         
   */
  createVpcConnection(callback?: (err: AWSError, data: Kafka.Types.CreateVpcConnectionResponse) => void): Request<Kafka.Types.CreateVpcConnectionResponse, AWSError>;
  /**
   * 
            Deletes the MSK cluster specified by the Amazon Resource Name (ARN) in the request.
         
   */
  deleteCluster(params: Kafka.Types.DeleteClusterRequest, callback?: (err: AWSError, data: Kafka.Types.DeleteClusterResponse) => void): Request<Kafka.Types.DeleteClusterResponse, AWSError>;
  /**
   * 
            Deletes the MSK cluster specified by the Amazon Resource Name (ARN) in the request.
         
   */
  deleteCluster(callback?: (err: AWSError, data: Kafka.Types.DeleteClusterResponse) => void): Request<Kafka.Types.DeleteClusterResponse, AWSError>;
  /**
   * 
            Deletes the MSK cluster policy specified by the Amazon Resource Name (ARN) in the request.
         
   */
  deleteClusterPolicy(params: Kafka.Types.DeleteClusterPolicyRequest, callback?: (err: AWSError, data: Kafka.Types.DeleteClusterPolicyResponse) => void): Request<Kafka.Types.DeleteClusterPolicyResponse, AWSError>;
  /**
   * 
            Deletes the MSK cluster policy specified by the Amazon Resource Name (ARN) in the request.
         
   */
  deleteClusterPolicy(callback?: (err: AWSError, data: Kafka.Types.DeleteClusterPolicyResponse) => void): Request<Kafka.Types.DeleteClusterPolicyResponse, AWSError>;
  /**
   * 
            Deletes an MSK Configuration.
         
   */
  deleteConfiguration(params: Kafka.Types.DeleteConfigurationRequest, callback?: (err: AWSError, data: Kafka.Types.DeleteConfigurationResponse) => void): Request<Kafka.Types.DeleteConfigurationResponse, AWSError>;
  /**
   * 
            Deletes an MSK Configuration.
         
   */
  deleteConfiguration(callback?: (err: AWSError, data: Kafka.Types.DeleteConfigurationResponse) => void): Request<Kafka.Types.DeleteConfigurationResponse, AWSError>;
  /**
   * 
            Deletes a MSK VPC connection.
         
   */
  deleteVpcConnection(params: Kafka.Types.DeleteVpcConnectionRequest, callback?: (err: AWSError, data: Kafka.Types.DeleteVpcConnectionResponse) => void): Request<Kafka.Types.DeleteVpcConnectionResponse, AWSError>;
  /**
   * 
            Deletes a MSK VPC connection.
         
   */
  deleteVpcConnection(callback?: (err: AWSError, data: Kafka.Types.DeleteVpcConnectionResponse) => void): Request<Kafka.Types.DeleteVpcConnectionResponse, AWSError>;
  /**
   * 
            Returns a description of the MSK cluster whose Amazon Resource Name (ARN) is specified in the request.
         
   */
  describeCluster(params: Kafka.Types.DescribeClusterRequest, callback?: (err: AWSError, data: Kafka.Types.DescribeClusterResponse) => void): Request<Kafka.Types.DescribeClusterResponse, AWSError>;
  /**
   * 
            Returns a description of the MSK cluster whose Amazon Resource Name (ARN) is specified in the request.
         
   */
  describeCluster(callback?: (err: AWSError, data: Kafka.Types.DescribeClusterResponse) => void): Request<Kafka.Types.DescribeClusterResponse, AWSError>;
  /**
   * 
            Returns a description of the MSK cluster whose Amazon Resource Name (ARN) is specified in the request.
         
   */
  describeClusterV2(params: Kafka.Types.DescribeClusterV2Request, callback?: (err: AWSError, data: Kafka.Types.DescribeClusterV2Response) => void): Request<Kafka.Types.DescribeClusterV2Response, AWSError>;
  /**
   * 
            Returns a description of the MSK cluster whose Amazon Resource Name (ARN) is specified in the request.
         
   */
  describeClusterV2(callback?: (err: AWSError, data: Kafka.Types.DescribeClusterV2Response) => void): Request<Kafka.Types.DescribeClusterV2Response, AWSError>;
  /**
   * 
            Returns a description of the cluster operation specified by the ARN.
         
   */
  describeClusterOperation(params: Kafka.Types.DescribeClusterOperationRequest, callback?: (err: AWSError, data: Kafka.Types.DescribeClusterOperationResponse) => void): Request<Kafka.Types.DescribeClusterOperationResponse, AWSError>;
  /**
   * 
            Returns a description of the cluster operation specified by the ARN.
         
   */
  describeClusterOperation(callback?: (err: AWSError, data: Kafka.Types.DescribeClusterOperationResponse) => void): Request<Kafka.Types.DescribeClusterOperationResponse, AWSError>;
  /**
   * 
            Returns a description of the cluster operation specified by the ARN.

   */
  describeClusterOperationV2(params: Kafka.Types.DescribeClusterOperationV2Request, callback?: (err: AWSError, data: Kafka.Types.DescribeClusterOperationV2Response) => void): Request<Kafka.Types.DescribeClusterOperationV2Response, AWSError>;
  /**
   * 
            Returns a description of the cluster operation specified by the ARN.

   */
  describeClusterOperationV2(callback?: (err: AWSError, data: Kafka.Types.DescribeClusterOperationV2Response) => void): Request<Kafka.Types.DescribeClusterOperationV2Response, AWSError>;
  /**
   * 
            Returns a description of this MSK configuration.
         
   */
  describeConfiguration(params: Kafka.Types.DescribeConfigurationRequest, callback?: (err: AWSError, data: Kafka.Types.DescribeConfigurationResponse) => void): Request<Kafka.Types.DescribeConfigurationResponse, AWSError>;
  /**
   * 
            Returns a description of this MSK configuration.
         
   */
  describeConfiguration(callback?: (err: AWSError, data: Kafka.Types.DescribeConfigurationResponse) => void): Request<Kafka.Types.DescribeConfigurationResponse, AWSError>;
  /**
   * 
            Returns a description of this revision of the configuration.
         
   */
  describeConfigurationRevision(params: Kafka.Types.DescribeConfigurationRevisionRequest, callback?: (err: AWSError, data: Kafka.Types.DescribeConfigurationRevisionResponse) => void): Request<Kafka.Types.DescribeConfigurationRevisionResponse, AWSError>;
  /**
   * 
            Returns a description of this revision of the configuration.
         
   */
  describeConfigurationRevision(callback?: (err: AWSError, data: Kafka.Types.DescribeConfigurationRevisionResponse) => void): Request<Kafka.Types.DescribeConfigurationRevisionResponse, AWSError>;
  /**
   * 
            Returns a description of this MSK VPC connection.
         
   */
  describeVpcConnection(params: Kafka.Types.DescribeVpcConnectionRequest, callback?: (err: AWSError, data: Kafka.Types.DescribeVpcConnectionResponse) => void): Request<Kafka.Types.DescribeVpcConnectionResponse, AWSError>;
  /**
   * 
            Returns a description of this MSK VPC connection.
         
   */
  describeVpcConnection(callback?: (err: AWSError, data: Kafka.Types.DescribeVpcConnectionResponse) => void): Request<Kafka.Types.DescribeVpcConnectionResponse, AWSError>;
  /**
   * 
            Disassociates one or more Scram Secrets from an Amazon MSK cluster.
         
   */
  batchDisassociateScramSecret(params: Kafka.Types.BatchDisassociateScramSecretRequest, callback?: (err: AWSError, data: Kafka.Types.BatchDisassociateScramSecretResponse) => void): Request<Kafka.Types.BatchDisassociateScramSecretResponse, AWSError>;
  /**
   * 
            Disassociates one or more Scram Secrets from an Amazon MSK cluster.
         
   */
  batchDisassociateScramSecret(callback?: (err: AWSError, data: Kafka.Types.BatchDisassociateScramSecretResponse) => void): Request<Kafka.Types.BatchDisassociateScramSecretResponse, AWSError>;
  /**
   * 
            A list of brokers that a client application can use to bootstrap.
         
   */
  getBootstrapBrokers(params: Kafka.Types.GetBootstrapBrokersRequest, callback?: (err: AWSError, data: Kafka.Types.GetBootstrapBrokersResponse) => void): Request<Kafka.Types.GetBootstrapBrokersResponse, AWSError>;
  /**
   * 
            A list of brokers that a client application can use to bootstrap.
         
   */
  getBootstrapBrokers(callback?: (err: AWSError, data: Kafka.Types.GetBootstrapBrokersResponse) => void): Request<Kafka.Types.GetBootstrapBrokersResponse, AWSError>;
  /**
   * 
            Gets the Apache Kafka versions to which you can update the MSK cluster.
         
   */
  getCompatibleKafkaVersions(params: Kafka.Types.GetCompatibleKafkaVersionsRequest, callback?: (err: AWSError, data: Kafka.Types.GetCompatibleKafkaVersionsResponse) => void): Request<Kafka.Types.GetCompatibleKafkaVersionsResponse, AWSError>;
  /**
   * 
            Gets the Apache Kafka versions to which you can update the MSK cluster.
         
   */
  getCompatibleKafkaVersions(callback?: (err: AWSError, data: Kafka.Types.GetCompatibleKafkaVersionsResponse) => void): Request<Kafka.Types.GetCompatibleKafkaVersionsResponse, AWSError>;
  /**
   * 
            Get the MSK cluster policy specified by the Amazon Resource Name (ARN) in the request.
         
   */
  getClusterPolicy(params: Kafka.Types.GetClusterPolicyRequest, callback?: (err: AWSError, data: Kafka.Types.GetClusterPolicyResponse) => void): Request<Kafka.Types.GetClusterPolicyResponse, AWSError>;
  /**
   * 
            Get the MSK cluster policy specified by the Amazon Resource Name (ARN) in the request.
         
   */
  getClusterPolicy(callback?: (err: AWSError, data: Kafka.Types.GetClusterPolicyResponse) => void): Request<Kafka.Types.GetClusterPolicyResponse, AWSError>;
  /**
   * 
            Returns a list of all the operations that have been performed on the specified MSK cluster.
         
   */
  listClusterOperations(params: Kafka.Types.ListClusterOperationsRequest, callback?: (err: AWSError, data: Kafka.Types.ListClusterOperationsResponse) => void): Request<Kafka.Types.ListClusterOperationsResponse, AWSError>;
  /**
   * 
            Returns a list of all the operations that have been performed on the specified MSK cluster.
         
   */
  listClusterOperations(callback?: (err: AWSError, data: Kafka.Types.ListClusterOperationsResponse) => void): Request<Kafka.Types.ListClusterOperationsResponse, AWSError>;
  /**
   * 
            Returns a list of all the operations that have been performed on the specified MSK cluster.
         
   */
  listClusterOperationsV2(params: Kafka.Types.ListClusterOperationsV2Request, callback?: (err: AWSError, data: Kafka.Types.ListClusterOperationsV2Response) => void): Request<Kafka.Types.ListClusterOperationsV2Response, AWSError>;
  /**
   * 
            Returns a list of all the operations that have been performed on the specified MSK cluster.
         
   */
  listClusterOperationsV2(callback?: (err: AWSError, data: Kafka.Types.ListClusterOperationsV2Response) => void): Request<Kafka.Types.ListClusterOperationsV2Response, AWSError>;
  /**
   * 
            Returns a list of all the MSK clusters in the current Region.
         
   */
  listClusters(params: Kafka.Types.ListClustersRequest, callback?: (err: AWSError, data: Kafka.Types.ListClustersResponse) => void): Request<Kafka.Types.ListClustersResponse, AWSError>;
  /**
   * 
            Returns a list of all the MSK clusters in the current Region.
         
   */
  listClusters(callback?: (err: AWSError, data: Kafka.Types.ListClustersResponse) => void): Request<Kafka.Types.ListClustersResponse, AWSError>;
  /**
   * 
            Returns a list of all the MSK clusters in the current Region.
         
   */
  listClustersV2(params: Kafka.Types.ListClustersV2Request, callback?: (err: AWSError, data: Kafka.Types.ListClustersV2Response) => void): Request<Kafka.Types.ListClustersV2Response, AWSError>;
  /**
   * 
            Returns a list of all the MSK clusters in the current Region.
         
   */
  listClustersV2(callback?: (err: AWSError, data: Kafka.Types.ListClustersV2Response) => void): Request<Kafka.Types.ListClustersV2Response, AWSError>;
  /**
   * 
            Returns a list of all the MSK configurations in this Region.
         
   */
  listConfigurationRevisions(params: Kafka.Types.ListConfigurationRevisionsRequest, callback?: (err: AWSError, data: Kafka.Types.ListConfigurationRevisionsResponse) => void): Request<Kafka.Types.ListConfigurationRevisionsResponse, AWSError>;
  /**
   * 
            Returns a list of all the MSK configurations in this Region.
         
   */
  listConfigurationRevisions(callback?: (err: AWSError, data: Kafka.Types.ListConfigurationRevisionsResponse) => void): Request<Kafka.Types.ListConfigurationRevisionsResponse, AWSError>;
  /**
   * 
            Returns a list of all the MSK configurations in this Region.
         
   */
  listConfigurations(params: Kafka.Types.ListConfigurationsRequest, callback?: (err: AWSError, data: Kafka.Types.ListConfigurationsResponse) => void): Request<Kafka.Types.ListConfigurationsResponse, AWSError>;
  /**
   * 
            Returns a list of all the MSK configurations in this Region.
         
   */
  listConfigurations(callback?: (err: AWSError, data: Kafka.Types.ListConfigurationsResponse) => void): Request<Kafka.Types.ListConfigurationsResponse, AWSError>;
  /**
   * 
            Returns a list of Apache Kafka versions.
         
   */
  listKafkaVersions(params: Kafka.Types.ListKafkaVersionsRequest, callback?: (err: AWSError, data: Kafka.Types.ListKafkaVersionsResponse) => void): Request<Kafka.Types.ListKafkaVersionsResponse, AWSError>;
  /**
   * 
            Returns a list of Apache Kafka versions.
         
   */
  listKafkaVersions(callback?: (err: AWSError, data: Kafka.Types.ListKafkaVersionsResponse) => void): Request<Kafka.Types.ListKafkaVersionsResponse, AWSError>;
  /**
   * 
            Returns a list of the broker nodes in the cluster.
         
   */
  listNodes(params: Kafka.Types.ListNodesRequest, callback?: (err: AWSError, data: Kafka.Types.ListNodesResponse) => void): Request<Kafka.Types.ListNodesResponse, AWSError>;
  /**
   * 
            Returns a list of the broker nodes in the cluster.
         
   */
  listNodes(callback?: (err: AWSError, data: Kafka.Types.ListNodesResponse) => void): Request<Kafka.Types.ListNodesResponse, AWSError>;
  /**
   * 
            Returns a list of the Scram Secrets associated with an Amazon MSK cluster.
         
   */
  listScramSecrets(params: Kafka.Types.ListScramSecretsRequest, callback?: (err: AWSError, data: Kafka.Types.ListScramSecretsResponse) => void): Request<Kafka.Types.ListScramSecretsResponse, AWSError>;
  /**
   * 
            Returns a list of the Scram Secrets associated with an Amazon MSK cluster.
         
   */
  listScramSecrets(callback?: (err: AWSError, data: Kafka.Types.ListScramSecretsResponse) => void): Request<Kafka.Types.ListScramSecretsResponse, AWSError>;
  /**
   * 
            Returns a list of the tags associated with the specified resource.
         
   */
  listTagsForResource(params: Kafka.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Kafka.Types.ListTagsForResourceResponse) => void): Request<Kafka.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * 
            Returns a list of the tags associated with the specified resource.
         
   */
  listTagsForResource(callback?: (err: AWSError, data: Kafka.Types.ListTagsForResourceResponse) => void): Request<Kafka.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * 
            Returns a list of all the VPC connections in this Region.
         
   */
  listClientVpcConnections(params: Kafka.Types.ListClientVpcConnectionsRequest, callback?: (err: AWSError, data: Kafka.Types.ListClientVpcConnectionsResponse) => void): Request<Kafka.Types.ListClientVpcConnectionsResponse, AWSError>;
  /**
   * 
            Returns a list of all the VPC connections in this Region.
         
   */
  listClientVpcConnections(callback?: (err: AWSError, data: Kafka.Types.ListClientVpcConnectionsResponse) => void): Request<Kafka.Types.ListClientVpcConnectionsResponse, AWSError>;
  /**
   * 
            Returns a list of all the VPC connections in this Region.
         
   */
  listVpcConnections(params: Kafka.Types.ListVpcConnectionsRequest, callback?: (err: AWSError, data: Kafka.Types.ListVpcConnectionsResponse) => void): Request<Kafka.Types.ListVpcConnectionsResponse, AWSError>;
  /**
   * 
            Returns a list of all the VPC connections in this Region.
         
   */
  listVpcConnections(callback?: (err: AWSError, data: Kafka.Types.ListVpcConnectionsResponse) => void): Request<Kafka.Types.ListVpcConnectionsResponse, AWSError>;
  /**
   * 
            Returns empty response.
         
   */
  rejectClientVpcConnection(params: Kafka.Types.RejectClientVpcConnectionRequest, callback?: (err: AWSError, data: Kafka.Types.RejectClientVpcConnectionResponse) => void): Request<Kafka.Types.RejectClientVpcConnectionResponse, AWSError>;
  /**
   * 
            Returns empty response.
         
   */
  rejectClientVpcConnection(callback?: (err: AWSError, data: Kafka.Types.RejectClientVpcConnectionResponse) => void): Request<Kafka.Types.RejectClientVpcConnectionResponse, AWSError>;
  /**
   * 
            Creates or updates the MSK cluster policy specified by the cluster Amazon Resource Name (ARN) in the request.
         
   */
  putClusterPolicy(params: Kafka.Types.PutClusterPolicyRequest, callback?: (err: AWSError, data: Kafka.Types.PutClusterPolicyResponse) => void): Request<Kafka.Types.PutClusterPolicyResponse, AWSError>;
  /**
   * 
            Creates or updates the MSK cluster policy specified by the cluster Amazon Resource Name (ARN) in the request.
         
   */
  putClusterPolicy(callback?: (err: AWSError, data: Kafka.Types.PutClusterPolicyResponse) => void): Request<Kafka.Types.PutClusterPolicyResponse, AWSError>;
  /**
   * Reboots brokers.
   */
  rebootBroker(params: Kafka.Types.RebootBrokerRequest, callback?: (err: AWSError, data: Kafka.Types.RebootBrokerResponse) => void): Request<Kafka.Types.RebootBrokerResponse, AWSError>;
  /**
   * Reboots brokers.
   */
  rebootBroker(callback?: (err: AWSError, data: Kafka.Types.RebootBrokerResponse) => void): Request<Kafka.Types.RebootBrokerResponse, AWSError>;
  /**
   * 
            Adds tags to the specified MSK resource.
         
   */
  tagResource(params: Kafka.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * 
            Adds tags to the specified MSK resource.
         
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * 
            Removes the tags associated with the keys that are provided in the query.
         
   */
  untagResource(params: Kafka.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * 
            Removes the tags associated with the keys that are provided in the query.
         
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * 
            Updates the number of broker nodes in the cluster.
         
   */
  updateBrokerCount(params: Kafka.Types.UpdateBrokerCountRequest, callback?: (err: AWSError, data: Kafka.Types.UpdateBrokerCountResponse) => void): Request<Kafka.Types.UpdateBrokerCountResponse, AWSError>;
  /**
   * 
            Updates the number of broker nodes in the cluster.
         
   */
  updateBrokerCount(callback?: (err: AWSError, data: Kafka.Types.UpdateBrokerCountResponse) => void): Request<Kafka.Types.UpdateBrokerCountResponse, AWSError>;
  /**
   * 
            Updates EC2 instance type.
         
   */
  updateBrokerType(params: Kafka.Types.UpdateBrokerTypeRequest, callback?: (err: AWSError, data: Kafka.Types.UpdateBrokerTypeResponse) => void): Request<Kafka.Types.UpdateBrokerTypeResponse, AWSError>;
  /**
   * 
            Updates EC2 instance type.
         
   */
  updateBrokerType(callback?: (err: AWSError, data: Kafka.Types.UpdateBrokerTypeResponse) => void): Request<Kafka.Types.UpdateBrokerTypeResponse, AWSError>;
  /**
   * 
            Updates the EBS storage associated with MSK brokers.
         
   */
  updateBrokerStorage(params: Kafka.Types.UpdateBrokerStorageRequest, callback?: (err: AWSError, data: Kafka.Types.UpdateBrokerStorageResponse) => void): Request<Kafka.Types.UpdateBrokerStorageResponse, AWSError>;
  /**
   * 
            Updates the EBS storage associated with MSK brokers.
         
   */
  updateBrokerStorage(callback?: (err: AWSError, data: Kafka.Types.UpdateBrokerStorageResponse) => void): Request<Kafka.Types.UpdateBrokerStorageResponse, AWSError>;
  /**
   * 
            Updates an MSK configuration.
         
   */
  updateConfiguration(params: Kafka.Types.UpdateConfigurationRequest, callback?: (err: AWSError, data: Kafka.Types.UpdateConfigurationResponse) => void): Request<Kafka.Types.UpdateConfigurationResponse, AWSError>;
  /**
   * 
            Updates an MSK configuration.
         
   */
  updateConfiguration(callback?: (err: AWSError, data: Kafka.Types.UpdateConfigurationResponse) => void): Request<Kafka.Types.UpdateConfigurationResponse, AWSError>;
  /**
   * 
            Updates the cluster's connectivity configuration.
         
   */
  updateConnectivity(params: Kafka.Types.UpdateConnectivityRequest, callback?: (err: AWSError, data: Kafka.Types.UpdateConnectivityResponse) => void): Request<Kafka.Types.UpdateConnectivityResponse, AWSError>;
  /**
   * 
            Updates the cluster's connectivity configuration.
         
   */
  updateConnectivity(callback?: (err: AWSError, data: Kafka.Types.UpdateConnectivityResponse) => void): Request<Kafka.Types.UpdateConnectivityResponse, AWSError>;
  /**
   * 
            Updates the cluster with the configuration that is specified in the request body.
         
   */
  updateClusterConfiguration(params: Kafka.Types.UpdateClusterConfigurationRequest, callback?: (err: AWSError, data: Kafka.Types.UpdateClusterConfigurationResponse) => void): Request<Kafka.Types.UpdateClusterConfigurationResponse, AWSError>;
  /**
   * 
            Updates the cluster with the configuration that is specified in the request body.
         
   */
  updateClusterConfiguration(callback?: (err: AWSError, data: Kafka.Types.UpdateClusterConfigurationResponse) => void): Request<Kafka.Types.UpdateClusterConfigurationResponse, AWSError>;
  /**
   * 
            Updates the Apache Kafka version for the cluster.
         
   */
  updateClusterKafkaVersion(params: Kafka.Types.UpdateClusterKafkaVersionRequest, callback?: (err: AWSError, data: Kafka.Types.UpdateClusterKafkaVersionResponse) => void): Request<Kafka.Types.UpdateClusterKafkaVersionResponse, AWSError>;
  /**
   * 
            Updates the Apache Kafka version for the cluster.
         
   */
  updateClusterKafkaVersion(callback?: (err: AWSError, data: Kafka.Types.UpdateClusterKafkaVersionResponse) => void): Request<Kafka.Types.UpdateClusterKafkaVersionResponse, AWSError>;
  /**
   * 
            Updates the monitoring settings for the cluster. You can use this operation to specify which Apache Kafka metrics you want Amazon MSK to send to Amazon CloudWatch. You can also specify settings for open monitoring with Prometheus.
         
   */
  updateMonitoring(params: Kafka.Types.UpdateMonitoringRequest, callback?: (err: AWSError, data: Kafka.Types.UpdateMonitoringResponse) => void): Request<Kafka.Types.UpdateMonitoringResponse, AWSError>;
  /**
   * 
            Updates the monitoring settings for the cluster. You can use this operation to specify which Apache Kafka metrics you want Amazon MSK to send to Amazon CloudWatch. You can also specify settings for open monitoring with Prometheus.
         
   */
  updateMonitoring(callback?: (err: AWSError, data: Kafka.Types.UpdateMonitoringResponse) => void): Request<Kafka.Types.UpdateMonitoringResponse, AWSError>;
  /**
   * 
            Updates the security settings for the cluster. You can use this operation to specify encryption and authentication on existing clusters.
         
   */
  updateSecurity(params: Kafka.Types.UpdateSecurityRequest, callback?: (err: AWSError, data: Kafka.Types.UpdateSecurityResponse) => void): Request<Kafka.Types.UpdateSecurityResponse, AWSError>;
  /**
   * 
            Updates the security settings for the cluster. You can use this operation to specify encryption and authentication on existing clusters.
         
   */
  updateSecurity(callback?: (err: AWSError, data: Kafka.Types.UpdateSecurityResponse) => void): Request<Kafka.Types.UpdateSecurityResponse, AWSError>;
  /**
   * Updates cluster broker volume size (or) sets cluster storage mode to TIERED.
   */
  updateStorage(params: Kafka.Types.UpdateStorageRequest, callback?: (err: AWSError, data: Kafka.Types.UpdateStorageResponse) => void): Request<Kafka.Types.UpdateStorageResponse, AWSError>;
  /**
   * Updates cluster broker volume size (or) sets cluster storage mode to TIERED.
   */
  updateStorage(callback?: (err: AWSError, data: Kafka.Types.UpdateStorageResponse) => void): Request<Kafka.Types.UpdateStorageResponse, AWSError>;
}
declare namespace Kafka {
  export interface BatchAssociateScramSecretRequest {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster to be updated.
         
     */
    ClusterArn: __string;
    /**
     * 
            List of AWS Secrets Manager secret ARNs.
         
     */
    SecretArnList: __listOf__string;
  }
  export interface BatchAssociateScramSecretResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            List of errors when associating secrets to cluster.
         
     */
    UnprocessedScramSecrets?: __listOfUnprocessedScramSecret;
  }
  export type BrokerAZDistribution = "DEFAULT"|string;
  export interface BrokerEBSVolumeInfo {
    /**
     * 
            The ID of the broker to update.
         
     */
    KafkaBrokerNodeId: __string;
    /**
     * 
            EBS volume provisioned throughput information.
         
     */
    ProvisionedThroughput?: ProvisionedThroughput;
    /**
     * 
            Size of the EBS volume to update.
         
     */
    VolumeSizeGB?: __integer;
  }
  export interface BrokerLogs {
    CloudWatchLogs?: CloudWatchLogs;
    Firehose?: Firehose;
    S3?: S3;
  }
  export interface BrokerNodeGroupInfo {
    /**
     * 
            The distribution of broker nodes across Availability Zones. This is an optional parameter. If you don't specify it, Amazon MSK gives it the value DEFAULT. You can also explicitly set this parameter to the value DEFAULT. No other values are currently allowed.
         Amazon MSK distributes the broker nodes evenly across the Availability Zones that correspond to the subnets you provide when you create the cluster.
         
     */
    BrokerAZDistribution?: BrokerAZDistribution;
    /**
     * 
            The list of subnets to connect to in the client virtual private cloud (VPC). AWS creates elastic network interfaces inside these subnets. Client applications use elastic network interfaces to produce and consume data. Client subnets can't occupy the Availability Zone with ID use use1-az3.
         
     */
    ClientSubnets: __listOf__string;
    /**
     * 
            The type of Amazon EC2 instances to use for Apache Kafka brokers. The following instance types are allowed: kafka.m5.large, kafka.m5.xlarge, kafka.m5.2xlarge,
kafka.m5.4xlarge, kafka.m5.12xlarge, and kafka.m5.24xlarge.
         
     */
    InstanceType: __stringMin5Max32;
    /**
     * 
            The AWS security groups to associate with the elastic network interfaces in order to specify who can connect to and communicate with the Amazon MSK cluster. If you don't specify a security group, Amazon MSK uses the default security group associated with the VPC.
         
     */
    SecurityGroups?: __listOf__string;
    /**
     * 
            Contains information about storage volumes attached to MSK broker nodes.
         
     */
    StorageInfo?: StorageInfo;
    /**
     * 
            Information about the broker access configuration.
         
     */
    ConnectivityInfo?: ConnectivityInfo;
    /**
     * 
            The list of zoneIds for the cluster in the virtual private cloud (VPC).
         
     */
    ZoneIds?: __listOf__string;
  }
  export interface BrokerNodeInfo {
    /**
     * 
            The attached elastic network interface of the broker.
         
     */
    AttachedENIId?: __string;
    /**
     * 
            The ID of the broker.
         
     */
    BrokerId?: __double;
    /**
     * 
            The client subnet to which this broker node belongs.
         
     */
    ClientSubnet?: __string;
    /**
     * 
            The virtual private cloud (VPC) of the client.
         
     */
    ClientVpcIpAddress?: __string;
    /**
     * 
            Information about the version of software currently deployed on the Apache Kafka brokers in the cluster.
         
     */
    CurrentBrokerSoftwareInfo?: BrokerSoftwareInfo;
    /**
     * 
            Endpoints for accessing the broker.
         
     */
    Endpoints?: __listOf__string;
  }
  export interface BrokerSoftwareInfo {
    /**
     * 
            The Amazon Resource Name (ARN) of the configuration used for the cluster. This field isn't visible in this preview release.
         
     */
    ConfigurationArn?: __string;
    /**
     * 
            The revision of the configuration to use. This field isn't visible in this preview release.
         
     */
    ConfigurationRevision?: __long;
    /**
     * 
            The version of Apache Kafka.
         
     */
    KafkaVersion?: __string;
  }
  export interface ClientAuthentication {
    /**
     * 
            Details for ClientAuthentication using SASL.
         
     */
    Sasl?: Sasl;
    /**
     * 
            Details for ClientAuthentication using TLS.
         
     */
    Tls?: Tls;
    /**
     * 
            Contains information about unauthenticated traffic to the cluster.
         
     */
    Unauthenticated?: Unauthenticated;
  }
  export interface VpcConnectivityClientAuthentication {
    /**
     * 
            SASL authentication type details for VPC connectivity.
         
     */
    Sasl?: VpcConnectivitySasl;
    /**
     * 
            TLS authentication type details for VPC connectivity.
         
     */
    Tls?: VpcConnectivityTls;
  }
  export interface ServerlessClientAuthentication {
    /**
     * 
            Details for ClientAuthentication using SASL.
         
     */
    Sasl?: ServerlessSasl;
  }
  export type ClientBroker = "TLS"|"TLS_PLAINTEXT"|"PLAINTEXT"|string;
  export interface CloudWatchLogs {
    Enabled: __boolean;
    LogGroup?: __string;
  }
  export interface ClusterInfo {
    /**
     * 
            Arn of active cluster operation.
         
     */
    ActiveOperationArn?: __string;
    /**
     * 
            Information about the broker nodes.
         
     */
    BrokerNodeGroupInfo?: BrokerNodeGroupInfo;
    /**
     * 
            Includes all client authentication information.
         
     */
    ClientAuthentication?: ClientAuthentication;
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            The name of the cluster.
         
     */
    ClusterName?: __string;
    /**
     * 
            The time when the cluster was created.
         
     */
    CreationTime?: __timestampIso8601;
    /**
     * 
            Information about the version of software currently deployed on the Apache Kafka brokers in the cluster.
         
     */
    CurrentBrokerSoftwareInfo?: BrokerSoftwareInfo;
    /**
     * 
            The current version of the MSK cluster.
         
     */
    CurrentVersion?: __string;
    /**
     * 
            Includes all encryption-related information.
         
     */
    EncryptionInfo?: EncryptionInfo;
    /**
     * 
            Specifies which metrics are gathered for the MSK cluster. This property has the following possible values: DEFAULT, PER_BROKER, PER_TOPIC_PER_BROKER, and PER_TOPIC_PER_PARTITION. For a list of the metrics associated with each of these levels of monitoring, see Monitoring.
         
     */
    EnhancedMonitoring?: EnhancedMonitoring;
    /**
     * 
            Settings for open monitoring using Prometheus.
         
     */
    OpenMonitoring?: OpenMonitoring;
    LoggingInfo?: LoggingInfo;
    /**
     * 
            The number of broker nodes in the cluster.
         
     */
    NumberOfBrokerNodes?: __integer;
    /**
     * 
            The state of the cluster. The possible states are ACTIVE, CREATING, DELETING, FAILED, HEALING, MAINTENANCE, REBOOTING_BROKER, and UPDATING.
         
     */
    State?: ClusterState;
    StateInfo?: StateInfo;
    /**
     * 
            Tags attached to the cluster.
         
     */
    Tags?: __mapOf__string;
    /**
     * 
            The connection string to use to connect to the Apache ZooKeeper cluster.
         
     */
    ZookeeperConnectString?: __string;
    /**
     * 
            The connection string to use to connect to zookeeper cluster on Tls port.
         
     */
    ZookeeperConnectStringTls?: __string;
    /**
     * 
            This controls storage mode for supported storage tiers.
         
     */
    StorageMode?: StorageMode;
  }
  export interface Cluster {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies a cluster operation.
         
     */
    ActiveOperationArn?: __string;
    /**
     * 
            Cluster Type.
         
     */
    ClusterType?: ClusterType;
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            The name of the cluster.
         
     */
    ClusterName?: __string;
    /**
     * 
            The time when the cluster was created.
         
     */
    CreationTime?: __timestampIso8601;
    /**
     * 
            The current version of the MSK cluster.
         
     */
    CurrentVersion?: __string;
    /**
     * 
            The state of the cluster. The possible states are ACTIVE, CREATING, DELETING, FAILED, HEALING, MAINTENANCE, REBOOTING_BROKER, and UPDATING.
         
     */
    State?: ClusterState;
    /**
     * 
            State Info for the Amazon MSK cluster.
         
     */
    StateInfo?: StateInfo;
    /**
     * 
            Tags attached to the cluster.
         
     */
    Tags?: __mapOf__string;
    /**
     * 
            Information about the provisioned cluster.
         
     */
    Provisioned?: Provisioned;
    /**
     * 
            Information about the serverless cluster.
         
     */
    Serverless?: Serverless;
  }
  export interface ClusterOperationInfo {
    /**
     * 
            The ID of the API request that triggered this operation.
         
     */
    ClientRequestId?: __string;
    /**
     * 
            ARN of the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            The time that the operation was created.
         
     */
    CreationTime?: __timestampIso8601;
    /**
     * 
            The time at which the operation finished.
         
     */
    EndTime?: __timestampIso8601;
    /**
     * 
            Describes the error if the operation fails.
         
     */
    ErrorInfo?: ErrorInfo;
    /**
     * 
            ARN of the cluster operation.
         
     */
    OperationArn?: __string;
    /**
     * 
            State of the cluster operation.
         
     */
    OperationState?: __string;
    /**
     * 
            Steps completed during the operation.
         
     */
    OperationSteps?: __listOfClusterOperationStep;
    /**
     * 
            Type of the cluster operation.
         
     */
    OperationType?: __string;
    /**
     * 
            Information about cluster attributes before a cluster is updated.
         
     */
    SourceClusterInfo?: MutableClusterInfo;
    /**
     * 
            Information about cluster attributes after a cluster is updated.
         
     */
    TargetClusterInfo?: MutableClusterInfo;
    /**
     * 
            Description of the VPC connection for CreateVpcConnection and DeleteVpcConnection operations.
         
     */
    VpcConnectionInfo?: VpcConnectionInfo;
  }
  export interface ClusterOperationStep {
    /**
     * 
            Information about the step and its status.
         
     */
    StepInfo?: ClusterOperationStepInfo;
    /**
     * 
            The name of the step.
         
     */
    StepName?: __string;
  }
  export interface ClusterOperationStepInfo {
    /**
     * 
            The steps current status.
         
     */
    StepStatus?: __string;
  }
  export type ClusterState = "ACTIVE"|"CREATING"|"DELETING"|"FAILED"|"HEALING"|"MAINTENANCE"|"REBOOTING_BROKER"|"UPDATING"|string;
  export type ClusterType = "PROVISIONED"|"SERVERLESS"|string;
  export interface ProvisionedRequest {
    /**
     * 
            Information about the brokers.
         
     */
    BrokerNodeGroupInfo: BrokerNodeGroupInfo;
    /**
     * 
            Includes all client authentication information.
         
     */
    ClientAuthentication?: ClientAuthentication;
    /**
     * 
            Represents the configuration that you want Amazon MSK to use for the brokers in a cluster.
         
     */
    ConfigurationInfo?: ConfigurationInfo;
    /**
     * 
            Includes all encryption-related information.
         
     */
    EncryptionInfo?: EncryptionInfo;
    /**
     * 
            Specifies the level of monitoring for the MSK cluster. The possible values are DEFAULT, PER_BROKER, PER_TOPIC_PER_BROKER, and PER_TOPIC_PER_PARTITION.
         
     */
    EnhancedMonitoring?: EnhancedMonitoring;
    /**
     * 
            The settings for open monitoring.
         
     */
    OpenMonitoring?: OpenMonitoringInfo;
    /**
     * 
            The Apache Kafka version that you want for the cluster.
         
     */
    KafkaVersion: __stringMin1Max128;
    /**
     * 
            Log delivery information for the cluster.
         
     */
    LoggingInfo?: LoggingInfo;
    /**
     * 
            The number of broker nodes in the cluster.
         
     */
    NumberOfBrokerNodes: __integerMin1Max15;
    /**
     * 
            This controls storage mode for supported storage tiers.
         
     */
    StorageMode?: StorageMode;
  }
  export interface Provisioned {
    /**
     * 
            Information about the brokers.
         
     */
    BrokerNodeGroupInfo: BrokerNodeGroupInfo;
    /**
     * 
            Information about the Apache Kafka version deployed on the brokers.
         
     */
    CurrentBrokerSoftwareInfo?: BrokerSoftwareInfo;
    /**
     * 
            Includes all client authentication information.
         
     */
    ClientAuthentication?: ClientAuthentication;
    /**
     * 
            Includes all encryption-related information.
         
     */
    EncryptionInfo?: EncryptionInfo;
    /**
     * 
            Specifies the level of monitoring for the MSK cluster. The possible values are DEFAULT, PER_BROKER, PER_TOPIC_PER_BROKER, and PER_TOPIC_PER_PARTITION.
         
     */
    EnhancedMonitoring?: EnhancedMonitoring;
    /**
     * 
            The settings for open monitoring.
         
     */
    OpenMonitoring?: OpenMonitoringInfo;
    /**
     * 
            Log delivery information for the cluster.
         
     */
    LoggingInfo?: LoggingInfo;
    /**
     * 
            The number of broker nodes in the cluster.
         
     */
    NumberOfBrokerNodes: __integerMin1Max15;
    /**
     * 
            The connection string to use to connect to the Apache ZooKeeper cluster.
         
     */
    ZookeeperConnectString?: __string;
    /**
     * 
            The connection string to use to connect to the Apache ZooKeeper cluster on a TLS port.
         
     */
    ZookeeperConnectStringTls?: __string;
    /**
     * 
            This controls storage mode for supported storage tiers.
         
     */
    StorageMode?: StorageMode;
  }
  export interface VpcConfig {
    /**
     * 
            The IDs of the subnets associated with the cluster.
         
     */
    SubnetIds: __listOf__string;
    /**
     * 
            The IDs of the security groups associated with the cluster.
         
     */
    SecurityGroupIds?: __listOf__string;
  }
  export interface ServerlessRequest {
    /**
     * 
            The configuration of the Amazon VPCs for the cluster.
         
     */
    VpcConfigs: __listOfVpcConfig;
    /**
     * 
            Includes all client authentication information.
         
     */
    ClientAuthentication?: ServerlessClientAuthentication;
  }
  export interface Serverless {
    /**
     * 
            The configuration of the Amazon VPCs for the cluster.
         
     */
    VpcConfigs: __listOfVpcConfig;
    /**
     * 
            Includes all client authentication information.
         
     */
    ClientAuthentication?: ServerlessClientAuthentication;
  }
  export interface ClientVpcConnection {
    /**
     * 
            Information about the auth scheme of Vpc Connection.
         
     */
    Authentication?: __string;
    /**
     * 
            Creation time of the Vpc Connection.
         
     */
    CreationTime?: __timestampIso8601;
    /**
     * 
            State of the Vpc Connection.
         
     */
    State?: VpcConnectionState;
    /**
     * 
            The ARN that identifies the Vpc Connection.
         
     */
    VpcConnectionArn: __string;
    /**
     * 
            The Owner of the Vpc Connection.
         
     */
    Owner?: __string;
  }
  export interface VpcConnection {
    /**
     * 
            The ARN that identifies the Vpc Connection.
         
     */
    VpcConnectionArn: __string;
    /**
     * 
            The ARN that identifies the Cluster which the Vpc Connection belongs to.
         
     */
    TargetClusterArn: __string;
    /**
     * 
            Creation time of the Vpc Connection.
         
     */
    CreationTime?: __timestampIso8601;
    /**
     * 
            Information about the auth scheme of Vpc Connection.
         
     */
    Authentication?: __string;
    /**
     * 
            The vpcId that belongs to the Vpc Connection.
         
     */
    VpcId?: __string;
    /**
     * 
            State of the Vpc Connection.
         
     */
    State?: VpcConnectionState;
  }
  export interface CompatibleKafkaVersion {
    /**
     * 
            An Apache Kafka version.
            
     */
    SourceVersion?: __string;
    /**
     * 
            A list of Apache Kafka versions.
            
     */
    TargetVersions?: __listOf__string;
  }
  export interface Configuration {
    /**
     * 
            The Amazon Resource Name (ARN) of the configuration.
         
     */
    Arn: __string;
    /**
     * 
            The time when the configuration was created.
         
     */
    CreationTime: __timestampIso8601;
    /**
     * 
            The description of the configuration.
         
     */
    Description: __string;
    /**
     * 
            An array of the versions of Apache Kafka with which you can use this MSK configuration. You can use this configuration for an MSK cluster only if the Apache Kafka version specified for the cluster appears in this array.
         
     */
    KafkaVersions: __listOf__string;
    /**
     * 
            Latest revision of the configuration.
         
     */
    LatestRevision: ConfigurationRevision;
    /**
     * 
            The name of the configuration.
         
     */
    Name: __string;
    /**
     * 
            The state of the configuration. The possible states are ACTIVE, DELETING, and DELETE_FAILED. 
         
     */
    State: ConfigurationState;
  }
  export interface ConfigurationInfo {
    /**
     * 
            ARN of the configuration to use.
         
     */
    Arn: __string;
    /**
     * 
            The revision of the configuration to use.
         
     */
    Revision: __long;
  }
  export interface ConfigurationRevision {
    /**
     * 
            The time when the configuration revision was created.
         
     */
    CreationTime: __timestampIso8601;
    /**
     * 
            The description of the configuration revision.
         
     */
    Description?: __string;
    /**
     * 
            The revision number.
         
     */
    Revision: __long;
  }
  export type ConfigurationState = "ACTIVE"|"DELETING"|"DELETE_FAILED"|string;
  export interface ConnectivityInfo {
    /**
     * 
            Public access control for brokers.
         
     */
    PublicAccess?: PublicAccess;
    /**
     * 
            VPC connectivity access control for brokers.
         
     */
    VpcConnectivity?: VpcConnectivity;
  }
  export interface CreateClusterV2Request {
    /**
     * 
            The name of the cluster.
         
     */
    ClusterName: __stringMin1Max64;
    /**
     * 
            A map of tags that you want the cluster to have.
         
     */
    Tags?: __mapOf__string;
    /**
     * 
            Information about the provisioned cluster.
         
     */
    Provisioned?: ProvisionedRequest;
    /**
     * 
            Information about the serverless cluster.
         
     */
    Serverless?: ServerlessRequest;
  }
  export interface CreateClusterRequest {
    /**
     * 
            Information about the broker nodes in the cluster.
         
     */
    BrokerNodeGroupInfo: BrokerNodeGroupInfo;
    /**
     * 
            Includes all client authentication related information.
         
     */
    ClientAuthentication?: ClientAuthentication;
    /**
     * 
            The name of the cluster.
         
     */
    ClusterName: __stringMin1Max64;
    /**
     * 
            Represents the configuration that you want MSK to use for the brokers in a cluster.
         
     */
    ConfigurationInfo?: ConfigurationInfo;
    /**
     * 
            Includes all encryption-related information.
         
     */
    EncryptionInfo?: EncryptionInfo;
    /**
     * 
            Specifies the level of monitoring for the MSK cluster. The possible values are DEFAULT, PER_BROKER, PER_TOPIC_PER_BROKER, and PER_TOPIC_PER_PARTITION.
         
     */
    EnhancedMonitoring?: EnhancedMonitoring;
    /**
     * 
            The settings for open monitoring.
         
     */
    OpenMonitoring?: OpenMonitoringInfo;
    /**
     * 
            The version of Apache Kafka.
         
     */
    KafkaVersion: __stringMin1Max128;
    LoggingInfo?: LoggingInfo;
    /**
     * 
            The number of broker nodes in the cluster.
         
     */
    NumberOfBrokerNodes: __integerMin1Max15;
    /**
     * 
            Create tags when creating the cluster.
         
     */
    Tags?: __mapOf__string;
    /**
     * 
            This controls storage mode for supported storage tiers.
         
     */
    StorageMode?: StorageMode;
  }
  export interface CreateClusterResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            The name of the MSK cluster.
         
     */
    ClusterName?: __string;
    /**
     * 
            The state of the cluster. The possible states are ACTIVE, CREATING, DELETING, FAILED, HEALING, MAINTENANCE, REBOOTING_BROKER, and UPDATING.
         
     */
    State?: ClusterState;
  }
  export interface CreateClusterV2Response {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            The name of the MSK cluster.
         
     */
    ClusterName?: __string;
    /**
     * 
            The state of the cluster. The possible states are ACTIVE, CREATING, DELETING, FAILED, HEALING, MAINTENANCE, REBOOTING_BROKER, and UPDATING.
         
     */
    State?: ClusterState;
    /**
     * 
            The type of the cluster. The possible states are PROVISIONED or SERVERLESS.
         
     */
    ClusterType?: ClusterType;
  }
  export interface CreateConfigurationRequest {
    /**
     * 
            The description of the configuration.
         
     */
    Description?: __string;
    /**
     * 
            The versions of Apache Kafka with which you can use this MSK configuration.
         
     */
    KafkaVersions?: __listOf__string;
    /**
     * 
            The name of the configuration.
         
     */
    Name: __string;
    /**
     * 
            Contents of the server.properties file. When using the API, you must ensure that the contents of the file are base64 encoded. 
               When using the AWS Management Console, the SDK, or the AWS CLI, the contents of server.properties can be in plaintext.
         
     */
    ServerProperties: __blob;
  }
  export interface CreateConfigurationResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the configuration.
         
     */
    Arn?: __string;
    /**
     * 
            The time when the configuration was created.
         
     */
    CreationTime?: __timestampIso8601;
    /**
     * 
            Latest revision of the configuration.
         
     */
    LatestRevision?: ConfigurationRevision;
    /**
     * 
            The name of the configuration.
         
     */
    Name?: __string;
    /**
     * 
            The state of the configuration. The possible states are ACTIVE, DELETING, and DELETE_FAILED. 
         
     */
    State?: ConfigurationState;
  }
  export interface CreateVpcConnectionRequest {
    /**
     * 
            The cluster Amazon Resource Name (ARN) for the VPC connection.
         
     */
    TargetClusterArn: __string;
    /**
     * 
            The authentication type of VPC connection.
         
     */
    Authentication: __string;
    /**
     * 
            The VPC ID of VPC connection.
         
     */
    VpcId: __string;
    /**
     * 
            The list of client subnets.
         
     */
    ClientSubnets: __listOf__string;
    /**
     * 
            The list of security groups.
         
     */
    SecurityGroups: __listOf__string;
    /**
     * 
            A map of tags for the VPC connection.
         
     */
    Tags?: __mapOf__string;
  }
  export interface CreateVpcConnectionResponse {
    /**
     * 
            The VPC connection ARN.
         
     */
    VpcConnectionArn?: __string;
    /**
     * 
            The State of Vpc Connection.
         
     */
    State?: VpcConnectionState;
    /**
     * 
            The authentication type of VPC connection.
         
     */
    Authentication?: __string;
    /**
     * 
            The VPC ID of the VPC connection.
         
     */
    VpcId?: __string;
    /**
     * 
            The list of client subnets.
         
     */
    ClientSubnets?: __listOf__string;
    /**
     * 
            The list of security groups.
         
     */
    SecurityGroups?: __listOf__string;
    /**
     * 
            The creation time of VPC connection.
         
     */
    CreationTime?: __timestampIso8601;
    /**
     * 
            A map of tags for the VPC connection.
         
     */
    Tags?: __mapOf__string;
  }
  export interface ClusterOperationV2 {
    /**
     * 
            ARN of the cluster.
     */
    ClusterArn?: __string;
    /**
     * 
            Type of the backend cluster.
     */
    ClusterType?: ClusterType;
    /**
     * 
            The time at which operation was started.
     */
    StartTime?: __timestampIso8601;
    /**
     * 
            The time at which the operation finished.
     */
    EndTime?: __timestampIso8601;
    /**
     * 
            If cluster operation failed from an error, it describes the error.
     */
    ErrorInfo?: ErrorInfo;
    /**
     * 
            ARN of the cluster operation.
     */
    OperationArn?: __string;
    /**
     * 
            State of the cluster operation.
     */
    OperationState?: __string;
    /**
     * 
            Type of the cluster operation.
     */
    OperationType?: __string;
    /**
     * 
            Properties of a provisioned cluster.
     */
    Provisioned?: ClusterOperationV2Provisioned;
    /**
     * 
            Properties of a serverless cluster.
     */
    Serverless?: ClusterOperationV2Serverless;
  }
  export interface ClusterOperationV2Provisioned {
    /**
     * 
            Steps completed during the operation.
     */
    OperationSteps?: __listOfClusterOperationStep;
    /**
     * 
            Information about cluster attributes before a cluster is updated.
     */
    SourceClusterInfo?: MutableClusterInfo;
    /**
     * 
            Information about cluster attributes after a cluster is updated.
     */
    TargetClusterInfo?: MutableClusterInfo;
    /**
     * 
            Description of the VPC connection for CreateVpcConnection and DeleteVpcConnection operations.
     */
    VpcConnectionInfo?: VpcConnectionInfo;
  }
  export interface ClusterOperationV2Serverless {
    /**
     * 
            Description of the VPC connection for CreateVpcConnection and DeleteVpcConnection operations.
     */
    VpcConnectionInfo?: VpcConnectionInfoServerless;
  }
  export interface ClusterOperationV2Summary {
    /**
     * 
            ARN of the cluster.
     */
    ClusterArn?: __string;
    /**
     * 
            Type of the backend cluster.
     */
    ClusterType?: ClusterType;
    /**
     * 
            The time at which operation was started.
     */
    StartTime?: __timestampIso8601;
    /**
     * 
            The time at which the operation finished.
     */
    EndTime?: __timestampIso8601;
    /**
     * 
            ARN of the cluster operation.
     */
    OperationArn?: __string;
    /**
     * 
            State of the cluster operation.
     */
    OperationState?: __string;
    /**
     * 
            Type of the cluster operation.
     */
    OperationType?: __string;
  }
  export interface DeleteClusterRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the cluster.
         
     */
    ClusterArn: __string;
    /**
     * 
            The current version of the MSK cluster.
         
     */
    CurrentVersion?: __string;
  }
  export interface DeleteClusterResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            The state of the cluster. The possible states are ACTIVE, CREATING, DELETING, FAILED, HEALING, MAINTENANCE, REBOOTING_BROKER, and UPDATING.
         
     */
    State?: ClusterState;
  }
  export interface DeleteClusterPolicyRequest {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn: __string;
  }
  export interface DeleteClusterPolicyResponse {
  }
  export interface DeleteConfigurationRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies an MSK configuration.
         
     */
    Arn: __string;
  }
  export interface DeleteConfigurationResponse {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies an MSK configuration.
         
     */
    Arn?: __string;
    /**
     * 
            The state of the configuration. The possible states are ACTIVE, DELETING, and DELETE_FAILED. 
         
     */
    State?: ConfigurationState;
  }
  export interface DeleteVpcConnectionRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies an MSK VPC connection.
         
     */
    Arn: __string;
  }
  export interface DeleteVpcConnectionResponse {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies an MSK VPC connection.
         
     */
    VpcConnectionArn?: __string;
    /**
     * 
            The state of the VPC connection.
         
     */
    State?: VpcConnectionState;
  }
  export interface DescribeClusterOperationRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the MSK cluster operation.
         
     */
    ClusterOperationArn: __string;
  }
  export interface DescribeClusterOperationV2Request {
    /**
     * ARN of the cluster operation to describe.
     */
    ClusterOperationArn: __string;
  }
  export interface DescribeClusterOperationResponse {
    /**
     * 
            Cluster operation information
         
     */
    ClusterOperationInfo?: ClusterOperationInfo;
  }
  export interface DescribeClusterOperationV2Response {
    /**
     * 
            Cluster operation information
     */
    ClusterOperationInfo?: ClusterOperationV2;
  }
  export interface DescribeClusterRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the cluster.
         
     */
    ClusterArn: __string;
  }
  export interface DescribeClusterV2Request {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the cluster.
         
     */
    ClusterArn: __string;
  }
  export interface DescribeClusterResponse {
    /**
     * 
            The cluster information.
         
     */
    ClusterInfo?: ClusterInfo;
  }
  export interface DescribeClusterV2Response {
    /**
     * 
            The cluster information.
         
     */
    ClusterInfo?: Cluster;
  }
  export interface DescribeConfigurationRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies an MSK configuration and all of its revisions.
         
     */
    Arn: __string;
  }
  export interface DescribeConfigurationResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the configuration.
         
     */
    Arn?: __string;
    /**
     * 
            The time when the configuration was created.
         
     */
    CreationTime?: __timestampIso8601;
    /**
     * 
            The description of the configuration.
         
     */
    Description?: __string;
    /**
     * 
            The versions of Apache Kafka with which you can use this MSK configuration.
         
     */
    KafkaVersions?: __listOf__string;
    /**
     * 
            Latest revision of the configuration.
         
     */
    LatestRevision?: ConfigurationRevision;
    /**
     * 
            The name of the configuration.
         
     */
    Name?: __string;
    /**
     * 
            The state of the configuration. The possible states are ACTIVE, DELETING, and DELETE_FAILED. 
         
     */
    State?: ConfigurationState;
  }
  export interface DescribeConfigurationRevisionRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies an MSK configuration and all of its revisions.
         
     */
    Arn: __string;
    /**
     * 
            A string that uniquely identifies a revision of an MSK configuration.
         
     */
    Revision: __long;
  }
  export interface DescribeConfigurationRevisionResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the configuration.
         
     */
    Arn?: __string;
    /**
     * 
            The time when the configuration was created.
         
     */
    CreationTime?: __timestampIso8601;
    /**
     * 
            The description of the configuration.
         
     */
    Description?: __string;
    /**
     * 
            The revision number.
         
     */
    Revision?: __long;
    /**
     * 
            Contents of the server.properties file. When using the API, you must ensure that the contents of the file are base64 encoded. 
               When using the AWS Management Console, the SDK, or the AWS CLI, the contents of server.properties can be in plaintext.
         
     */
    ServerProperties?: __blob;
  }
  export interface DescribeVpcConnectionRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies a MSK VPC connection.
   
     */
    Arn: __string;
  }
  export interface DescribeVpcConnectionResponse {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies a MSK VPC connection.
   
     */
    VpcConnectionArn?: __string;
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies an MSK cluster.
   
     */
    TargetClusterArn?: __string;
    /**
     * 
            The state of VPC connection.
   
     */
    State?: VpcConnectionState;
    /**
     * 
            The authentication type of VPC connection.
   
     */
    Authentication?: __string;
    /**
     * 
            The VPC Id for the VPC connection.
   
     */
    VpcId?: __string;
    /**
     * 
            The list of subnets for the VPC connection.
   
     */
    Subnets?: __listOf__string;
    /**
     * 
            The list of security groups for the VPC connection.
   
     */
    SecurityGroups?: __listOf__string;
    /**
     * 
            The creation time of the VPC connection.
   
     */
    CreationTime?: __timestampIso8601;
    /**
     * 
            A map of tags for the VPC connection.
         
     */
    Tags?: __mapOf__string;
  }
  export interface BatchDisassociateScramSecretRequest {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster to be updated.
         
     */
    ClusterArn: __string;
    /**
     * 
            List of AWS Secrets Manager secret ARNs.
         
     */
    SecretArnList: __listOf__string;
  }
  export interface BatchDisassociateScramSecretResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            List of errors when disassociating secrets to cluster.
         
     */
    UnprocessedScramSecrets?: __listOfUnprocessedScramSecret;
  }
  export interface EBSStorageInfo {
    /**
     * 
            EBS volume provisioned throughput information.
         
     */
    ProvisionedThroughput?: ProvisionedThroughput;
    /**
     * 
            The size in GiB of the EBS volume for the data drive on each broker node.
         
     */
    VolumeSize?: __integerMin1Max16384;
  }
  export interface EncryptionAtRest {
    /**
     * 
            The ARN of the AWS KMS key for encrypting data at rest. If you don't specify a KMS key, MSK creates one for you and uses it.
         
     */
    DataVolumeKMSKeyId: __string;
  }
  export interface EncryptionInTransit {
    /**
     * 
            Indicates the encryption setting for data in transit between clients and brokers. The following are the possible values.
            
               TLS means that client-broker communication is enabled with TLS only.
            
               TLS_PLAINTEXT means that client-broker communication is enabled for both TLS-encrypted, as well as plaintext data.
            
               PLAINTEXT means that client-broker communication is enabled in plaintext only.
            The default value is TLS_PLAINTEXT.
         
     */
    ClientBroker?: ClientBroker;
    /**
     * 
            When set to true, it indicates that data communication among the broker nodes of the cluster is encrypted. When set to false, the communication happens in plaintext.
            The default value is true.
         
     */
    InCluster?: __boolean;
  }
  export interface EncryptionInfo {
    /**
     * 
            The data-volume encryption details.
         
     */
    EncryptionAtRest?: EncryptionAtRest;
    /**
     * 
            The details for encryption in transit.
         
     */
    EncryptionInTransit?: EncryptionInTransit;
  }
  export type EnhancedMonitoring = "DEFAULT"|"PER_BROKER"|"PER_TOPIC_PER_BROKER"|"PER_TOPIC_PER_PARTITION"|string;
  export interface ErrorInfo {
    /**
     * 
            A number describing the error programmatically.
         
     */
    ErrorCode?: __string;
    /**
     * 
            An optional field to provide more details about the error.
         
     */
    ErrorString?: __string;
  }
  export interface Firehose {
    DeliveryStream?: __string;
    Enabled: __boolean;
  }
  export interface GetBootstrapBrokersRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the cluster.
         
     */
    ClusterArn: __string;
  }
  export interface GetBootstrapBrokersResponse {
    /**
     * 
            A string containing one or more hostname:port pairs.
         
     */
    BootstrapBrokerString?: __string;
    /**
     * 
            A string containing one or more DNS names (or IP) and TLS port pairs.
         
     */
    BootstrapBrokerStringTls?: __string;
    /**
     * 
            A string containing one or more DNS names (or IP) and Sasl Scram port pairs.
         
     */
    BootstrapBrokerStringSaslScram?: __string;
    /**
     * 
            A string that contains one or more DNS names (or IP addresses) and SASL IAM port pairs.
         
     */
    BootstrapBrokerStringSaslIam?: __string;
    /**
     * 
            A string containing one or more DNS names (or IP) and TLS port pairs.
         
     */
    BootstrapBrokerStringPublicTls?: __string;
    /**
     * 
            A string containing one or more DNS names (or IP) and Sasl Scram port pairs.
         
     */
    BootstrapBrokerStringPublicSaslScram?: __string;
    /**
     * 
            A string that contains one or more DNS names (or IP addresses) and SASL IAM port pairs.
         
     */
    BootstrapBrokerStringPublicSaslIam?: __string;
    /**
     * 
            A string containing one or more DNS names (or IP) and TLS port pairs for VPC connectivity.
         
     */
    BootstrapBrokerStringVpcConnectivityTls?: __string;
    /**
     * 
            A string containing one or more DNS names (or IP) and SASL/SCRAM port pairs for VPC connectivity.
         
     */
    BootstrapBrokerStringVpcConnectivitySaslScram?: __string;
    /**
     * 
            A string containing one or more DNS names (or IP) and SASL/IAM port pairs for VPC connectivity.
         
     */
    BootstrapBrokerStringVpcConnectivitySaslIam?: __string;
  }
  export interface GetCompatibleKafkaVersionsRequest {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster check.
            
     */
    ClusterArn?: __string;
  }
  export interface GetCompatibleKafkaVersionsResponse {
    /**
     * 
            A list of CompatibleKafkaVersion objects.
            
     */
    CompatibleKafkaVersions?: __listOfCompatibleKafkaVersion;
  }
  export interface GetClusterPolicyRequest {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
            
     */
    ClusterArn: __string;
  }
  export interface GetClusterPolicyResponse {
    /**
     * 
            The version of cluster policy.
            
     */
    CurrentVersion?: __string;
    /**
     * 
            The cluster policy.
            
     */
    Policy?: __string;
  }
  export interface KafkaVersion {
    Version?: __string;
    Status?: KafkaVersionStatus;
  }
  export type KafkaVersionStatus = "ACTIVE"|"DEPRECATED"|string;
  export interface ListClusterOperationsRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the cluster.
         
     */
    ClusterArn: __string;
    /**
     * 
            The maximum number of results to return in the response. If there are more results, the response includes a NextToken parameter.
         
     */
    MaxResults?: MaxResults;
    /**
     * 
            The paginated results marker. When the result of the operation is truncated, the call returns NextToken in the response. 
            To get the next batch, provide this token in your next request.
         
     */
    NextToken?: __string;
  }
  export interface ListClusterOperationsV2Request {
    /**
     * The arn of the cluster whose operations are being requested.
     */
    ClusterArn: __string;
    /**
     * The maxResults of the query.
     */
    MaxResults?: MaxResults;
    /**
     * The nextToken of the query.
     */
    NextToken?: __string;
  }
  export interface ListClusterOperationsResponse {
    /**
     * 
            An array of cluster operation information objects.
         
     */
    ClusterOperationInfoList?: __listOfClusterOperationInfo;
    /**
     * 
            If the response of ListClusterOperations is truncated, it returns a NextToken in the response. This Nexttoken should be sent in the subsequent request to ListClusterOperations.
         
     */
    NextToken?: __string;
  }
  export interface ListClusterOperationsV2Response {
    /**
     * 
            An array of cluster operation information objects.
     */
    ClusterOperationInfoList?: __listOfClusterOperationV2Summary;
    /**
     * 
            If the response of ListClusterOperationsV2 is truncated, it returns a NextToken in the response. This NextToken should be sent in the subsequent request to ListClusterOperationsV2.
     */
    NextToken?: __string;
  }
  export interface ListClustersRequest {
    /**
     * 
            Specify a prefix of the name of the clusters that you want to list. The service lists all the clusters whose names start with this prefix.
         
     */
    ClusterNameFilter?: __string;
    /**
     * 
            The maximum number of results to return in the response. If there are more results, the response includes a NextToken parameter.
         
     */
    MaxResults?: MaxResults;
    /**
     * 
            The paginated results marker. When the result of the operation is truncated, the call returns NextToken in the response. 
            To get the next batch, provide this token in your next request.
         
     */
    NextToken?: __string;
  }
  export interface ListClustersV2Request {
    /**
     * 
            Specify a prefix of the names of the clusters that you want to list. The service lists all the clusters whose names start with this prefix.
         
     */
    ClusterNameFilter?: __string;
    /**
     * 
            Specify either PROVISIONED or SERVERLESS.
         
     */
    ClusterTypeFilter?: __string;
    /**
     * 
            The maximum number of results to return in the response. If there are more results, the response includes a NextToken parameter.
         
     */
    MaxResults?: MaxResults;
    /**
     * 
            The paginated results marker. When the result of the operation is truncated, the call returns NextToken in the response. 
            To get the next batch, provide this token in your next request.
         
     */
    NextToken?: __string;
  }
  export interface ListClustersResponse {
    /**
     * 
            Information on each of the MSK clusters in the response.
         
     */
    ClusterInfoList?: __listOfClusterInfo;
    /**
     * 
            The paginated results marker. When the result of a ListClusters operation is truncated, the call returns NextToken in the response. 
               To get another batch of clusters, provide this token in your next request.
         
     */
    NextToken?: __string;
  }
  export interface ListClustersV2Response {
    /**
     * 
            Information on each of the MSK clusters in the response.
         
     */
    ClusterInfoList?: __listOfCluster;
    /**
     * 
            The paginated results marker. When the result of a ListClusters operation is truncated, the call returns NextToken in the response. 
               To get another batch of clusters, provide this token in your next request.
         
     */
    NextToken?: __string;
  }
  export interface ListConfigurationRevisionsRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies an MSK configuration and all of its revisions.
         
     */
    Arn: __string;
    /**
     * 
            The maximum number of results to return in the response. If there are more results, the response includes a NextToken parameter.
         
     */
    MaxResults?: MaxResults;
    /**
     * 
            The paginated results marker. When the result of the operation is truncated, the call returns NextToken in the response. 
            To get the next batch, provide this token in your next request.
         
     */
    NextToken?: __string;
  }
  export interface ListConfigurationRevisionsResponse {
    /**
     * 
            Paginated results marker.
         
     */
    NextToken?: __string;
    /**
     * 
            List of ConfigurationRevision objects.
         
     */
    Revisions?: __listOfConfigurationRevision;
  }
  export interface ListConfigurationsRequest {
    /**
     * 
            The maximum number of results to return in the response. If there are more results, the response includes a NextToken parameter.
         
     */
    MaxResults?: MaxResults;
    /**
     * 
            The paginated results marker. When the result of the operation is truncated, the call returns NextToken in the response. 
            To get the next batch, provide this token in your next request.
         
     */
    NextToken?: __string;
  }
  export interface ListConfigurationsResponse {
    /**
     * 
            An array of MSK configurations.
         
     */
    Configurations?: __listOfConfiguration;
    /**
     * 
            The paginated results marker. When the result of a ListConfigurations operation is truncated, the call returns NextToken in the response. 
               To get another batch of configurations, provide this token in your next request.
         
     */
    NextToken?: __string;
  }
  export interface ListKafkaVersionsRequest {
    /**
     * 
            The maximum number of results to return in the response. If there are more results, the response includes a NextToken parameter.
     */
    MaxResults?: MaxResults;
    /**
     * 
            The paginated results marker. When the result of the operation is truncated, the call returns NextToken in the response. To get the next batch, provide this token in your next request.
     */
    NextToken?: __string;
  }
  export interface ListKafkaVersionsResponse {
    KafkaVersions?: __listOfKafkaVersion;
    NextToken?: __string;
  }
  export interface ListNodesRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the cluster.
         
     */
    ClusterArn: __string;
    /**
     * 
            The maximum number of results to return in the response. If there are more results, the response includes a NextToken parameter.
         
     */
    MaxResults?: MaxResults;
    /**
     * 
            The paginated results marker. When the result of the operation is truncated, the call returns NextToken in the response. 
            To get the next batch, provide this token in your next request.
         
     */
    NextToken?: __string;
  }
  export interface ListNodesResponse {
    /**
     * 
            The paginated results marker. When the result of a ListNodes operation is truncated, the call returns NextToken in the response. 
               To get another batch of nodes, provide this token in your next request.
         
     */
    NextToken?: __string;
    /**
     * 
            List containing a NodeInfo object.
         
     */
    NodeInfoList?: __listOfNodeInfo;
  }
  export interface ListScramSecretsRequest {
    /**
     * 
            The arn of the cluster.
         
     */
    ClusterArn: __string;
    /**
     * 
            The maxResults of the query.
         
     */
    MaxResults?: MaxResults;
    /**
     * 
            The nextToken of the query.
         
     */
    NextToken?: __string;
  }
  export interface ListScramSecretsResponse {
    /**
     * 
            Paginated results marker.
         
     */
    NextToken?: __string;
    /**
     * 
            The list of scram secrets associated with the cluster.
         
     */
    SecretArnList?: __listOf__string;
  }
  export interface ListTagsForResourceRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the resource that's associated with the tags.
         
     */
    ResourceArn: __string;
  }
  export interface ListTagsForResourceResponse {
    /**
     * 
            The key-value pair for the resource tag.
         
     */
    Tags?: __mapOf__string;
  }
  export interface ListClientVpcConnectionsRequest {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn: __string;
    /**
     * 
            The maximum number of results to return in the response. If there are more results, the response includes a NextToken parameter.
         
     */
    MaxResults?: MaxResults;
    /**
     * 
            The paginated results marker. When the result of the operation is truncated, the call returns NextToken in the response. 
            To get the next batch, provide this token in your next request.
         
     */
    NextToken?: __string;
  }
  export interface ListClientVpcConnectionsResponse {
    /**
     * 
            List of client VPC connections.
         
     */
    ClientVpcConnections?: __listOfClientVpcConnection;
    /**
     * 
            The paginated results marker. When the result of a ListClientVpcConnections operation is truncated, the call returns NextToken in the response. 
               To get another batch of configurations, provide this token in your next request.
         
     */
    NextToken?: __string;
  }
  export interface ListVpcConnectionsRequest {
    /**
     * 
            The maximum number of results to return in the response. If there are more results, the response includes a NextToken parameter.
         
     */
    MaxResults?: MaxResults;
    /**
     * 
            The paginated results marker. When the result of the operation is truncated, the call returns NextToken in the response. 
            To get the next batch, provide this token in your next request.
         
     */
    NextToken?: __string;
  }
  export interface ListVpcConnectionsResponse {
    /**
     * 
            List of VPC connections.
         
     */
    VpcConnections?: __listOfVpcConnection;
    /**
     * 
            The paginated results marker. When the result of a ListClientVpcConnections operation is truncated, the call returns NextToken in the response. 
               To get another batch of configurations, provide this token in your next request.
         
     */
    NextToken?: __string;
  }
  export interface RejectClientVpcConnectionRequest {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn: __string;
    /**
     * 
            The VPC connection ARN.
         
     */
    VpcConnectionArn: __string;
  }
  export interface RejectClientVpcConnectionResponse {
  }
  export type MaxResults = number;
  export interface LoggingInfo {
    BrokerLogs: BrokerLogs;
  }
  export interface MutableClusterInfo {
    /**
     * 
            Specifies the size of the EBS volume and the ID of the associated broker.
         
     */
    BrokerEBSVolumeInfo?: __listOfBrokerEBSVolumeInfo;
    /**
     * 
            Information about the changes in the configuration of the brokers.
         
     */
    ConfigurationInfo?: ConfigurationInfo;
    /**
     * 
            The number of broker nodes in the cluster.
         
     */
    NumberOfBrokerNodes?: __integer;
    /**
     * 
            Specifies which Apache Kafka metrics Amazon MSK gathers and sends to Amazon CloudWatch for this cluster.
         
     */
    EnhancedMonitoring?: EnhancedMonitoring;
    /**
     * 
            The settings for open monitoring.
         
     */
    OpenMonitoring?: OpenMonitoring;
    /**
     * 
            The Apache Kafka version.
            
     */
    KafkaVersion?: __string;
    /**
     * 
            You can configure your MSK cluster to send broker logs to different destination types. This is a container for the configuration details related to broker logs.
            
     */
    LoggingInfo?: LoggingInfo;
    /**
     * 
            Information about the Amazon MSK broker type.
            
     */
    InstanceType?: __stringMin5Max32;
    /**
     * 
            Includes all client authentication information.
         
     */
    ClientAuthentication?: ClientAuthentication;
    /**
     * 
            Includes all encryption-related information.
         
     */
    EncryptionInfo?: EncryptionInfo;
    /**
     * 
            Information about the broker access configuration.
         
     */
    ConnectivityInfo?: ConnectivityInfo;
    /**
     * 
            This controls storage mode for supported storage tiers.
         
     */
    StorageMode?: StorageMode;
  }
  export interface NodeExporter {
    /**
     * 
            Indicates whether you want to turn on or turn off the Node Exporter.
         
     */
    EnabledInBroker: __boolean;
  }
  export interface NodeExporterInfo {
    /**
     * 
            Indicates whether you want to turn on or turn off the Node Exporter.
         
     */
    EnabledInBroker: __boolean;
  }
  export interface JmxExporter {
    /**
     * 
            Indicates whether you want to turn on or turn off the JMX Exporter.
         
     */
    EnabledInBroker: __boolean;
  }
  export interface JmxExporterInfo {
    /**
     * 
            Indicates whether you want to turn on or turn off the JMX Exporter.
         
     */
    EnabledInBroker: __boolean;
  }
  export interface OpenMonitoring {
    /**
     * 
            Prometheus settings.
         
     */
    Prometheus: Prometheus;
  }
  export interface OpenMonitoringInfo {
    /**
     * 
            Prometheus settings.
         
     */
    Prometheus: PrometheusInfo;
  }
  export interface Prometheus {
    /**
     * 
            Indicates whether you want to turn on or turn off the JMX Exporter.
         
     */
    JmxExporter?: JmxExporter;
    /**
     * 
            Indicates whether you want to turn on or turn off the Node Exporter.
         
     */
    NodeExporter?: NodeExporter;
  }
  export interface PrometheusInfo {
    /**
     * 
            Indicates whether you want to turn on or turn off the JMX Exporter.
         
     */
    JmxExporter?: JmxExporterInfo;
    /**
     * 
            Indicates whether you want to turn on or turn off the Node Exporter.
         
     */
    NodeExporter?: NodeExporterInfo;
  }
  export interface ProvisionedThroughput {
    /**
     * 
            Provisioned throughput is enabled or not.
         
     */
    Enabled?: __boolean;
    /**
     * 
            Throughput value of the EBS volumes for the data drive on each kafka broker node in MiB per second.
         
     */
    VolumeThroughput?: __integer;
  }
  export interface PublicAccess {
    /**
     * 
            The value DISABLED indicates that public access is turned off. SERVICE_PROVIDED_EIPS indicates that public access is turned on.
         
     */
    Type?: __string;
  }
  export interface PutClusterPolicyRequest {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn: __string;
    /**
     * 
            The policy version.
         
     */
    CurrentVersion?: __string;
    /**
     * 
            The policy.
         
     */
    Policy: __string;
  }
  export interface PutClusterPolicyResponse {
    /**
     * 
            The policy version.
         
     */
    CurrentVersion?: __string;
  }
  export interface RebootBrokerRequest {
    /**
     * 
            The list of broker IDs to be rebooted. The reboot-broker operation supports rebooting one broker at a time.
         
     */
    BrokerIds: __listOf__string;
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster to be updated.
         
     */
    ClusterArn: __string;
  }
  export interface RebootBrokerResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster operation.
         
     */
    ClusterOperationArn?: __string;
  }
  export interface S3 {
    Bucket?: __string;
    Enabled: __boolean;
    Prefix?: __string;
  }
  export interface ServerlessSasl {
    /**
     * 
            Indicates whether IAM access control is enabled.
         
     */
    Iam?: Iam;
  }
  export interface Sasl {
    /**
     * 
            Details for SASL/SCRAM client authentication.
         
     */
    Scram?: Scram;
    /**
     * 
            Indicates whether IAM access control is enabled.
         
     */
    Iam?: Iam;
  }
  export interface VpcConnectivitySasl {
    /**
     * 
            Details for SASL/SCRAM client authentication for VPC connectivity.
         
     */
    Scram?: VpcConnectivityScram;
    /**
     * 
            Details for SASL/IAM client authentication for VPC connectivity.
         
     */
    Iam?: VpcConnectivityIam;
  }
  export interface Scram {
    /**
     * 
            SASL/SCRAM authentication is enabled or not.
         
     */
    Enabled?: __boolean;
  }
  export interface VpcConnectivityScram {
    /**
     * 
            SASL/SCRAM authentication is on or off for VPC connectivity.
         
     */
    Enabled?: __boolean;
  }
  export interface Iam {
    /**
     * 
            Indicates whether IAM access control is enabled.
         
     */
    Enabled?: __boolean;
  }
  export interface VpcConnectivityIam {
    /**
     * 
            SASL/IAM authentication is on or off for VPC connectivity.
         
     */
    Enabled?: __boolean;
  }
  export interface NodeInfo {
    /**
     * 
            The start time.
         
     */
    AddedToClusterTime?: __string;
    /**
     * 
            The broker node info.
         
     */
    BrokerNodeInfo?: BrokerNodeInfo;
    /**
     * 
            The instance type.
         
     */
    InstanceType?: __string;
    /**
     * 
            The Amazon Resource Name (ARN) of the node.
         
     */
    NodeARN?: __string;
    /**
     * 
            The node type.
         
     */
    NodeType?: NodeType;
    /**
     * 
            The ZookeeperNodeInfo.
         
     */
    ZookeeperNodeInfo?: ZookeeperNodeInfo;
  }
  export type NodeType = "BROKER"|string;
  export interface StateInfo {
    Code?: __string;
    Message?: __string;
  }
  export interface StorageInfo {
    /**
     * 
            EBS volume information.
         
     */
    EbsStorageInfo?: EBSStorageInfo;
  }
  export type StorageMode = "LOCAL"|"TIERED"|string;
  export interface TagResourceRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the resource that's associated with the tags.
         
     */
    ResourceArn: __string;
    /**
     * 
            The key-value pair for the resource tag.
         
     */
    Tags: __mapOf__string;
  }
  export interface Tls {
    /**
     * 
            List of ACM Certificate Authority ARNs.
         
     */
    CertificateAuthorityArnList?: __listOf__string;
    /**
     * 
            Specifies whether you want to turn on or turn off TLS authentication.
         
     */
    Enabled?: __boolean;
  }
  export interface VpcConnectivityTls {
    /**
     * 
            TLS authentication is on or off for VPC connectivity.
         
     */
    Enabled?: __boolean;
  }
  export interface Unauthenticated {
    /**
     * 
            Specifies whether you want to turn on or turn off unauthenticated traffic to your cluster.
         
     */
    Enabled?: __boolean;
  }
  export interface UnprocessedScramSecret {
    /**
     * 
            Error code for associate/disassociate failure.
         
     */
    ErrorCode?: __string;
    /**
     * 
            Error message for associate/disassociate failure.
         
     */
    ErrorMessage?: __string;
    /**
     * 
            AWS Secrets Manager secret ARN.
         
     */
    SecretArn?: __string;
  }
  export interface UntagResourceRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the resource that's associated with the tags.
         
     */
    ResourceArn: __string;
    /**
     * 
            Tag keys must be unique for a given cluster. In addition, the following restrictions apply:
            
               
                  Each tag key must be unique. If you add a tag with a key that's already in
                  use, your new tag overwrites the existing key-value pair. 
               
               
                  You can't start a tag key with aws: because this prefix is reserved for use
                  by  AWS.  AWS creates tags that begin with this prefix on your behalf, but
                  you can't edit or delete them.
               
               
                  Tag keys must be between 1 and 128 Unicode characters in length.
               
               
                  Tag keys must consist of the following characters: Unicode letters, digits,
                  white space, and the following special characters: _ . / = + -
                     @.
               
            
         
     */
    TagKeys: __listOf__string;
  }
  export interface UpdateBrokerCountRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the cluster.
         
     */
    ClusterArn: __string;
    /**
     * 
            The version of cluster to update from. A successful operation will then generate a new version.
         
     */
    CurrentVersion: __string;
    /**
     * 
            The number of broker nodes that you want the cluster to have after this operation completes successfully.
         
     */
    TargetNumberOfBrokerNodes: __integerMin1Max15;
  }
  export interface UpdateBrokerCountResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster operation.
         
     */
    ClusterOperationArn?: __string;
  }
  export interface UpdateBrokerTypeRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the cluster.
         
     */
    ClusterArn: __string;
    /**
     * 
            The cluster version that you want to change. After this operation completes successfully, the cluster will have a new version.
         
     */
    CurrentVersion: __string;
    /**
     * 
            The Amazon MSK broker type that you want all of the brokers in this cluster to be.
         
     */
    TargetInstanceType: __string;
  }
  export interface UpdateBrokerTypeResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster operation.
         
     */
    ClusterOperationArn?: __string;
  }
  export interface UpdateBrokerStorageRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the cluster.
         
     */
    ClusterArn: __string;
    /**
     * 
            The version of cluster to update from. A successful operation will then generate a new version.
         
     */
    CurrentVersion: __string;
    /**
     * 
            Describes the target volume size and the ID of the broker to apply the update to.
         
     */
    TargetBrokerEBSVolumeInfo: __listOfBrokerEBSVolumeInfo;
  }
  export interface UpdateBrokerStorageResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster operation.
         
     */
    ClusterOperationArn?: __string;
  }
  export interface UpdateClusterConfigurationRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the cluster.
         
     */
    ClusterArn: __string;
    /**
     * 
            Represents the configuration that you want MSK to use for the brokers in a cluster.
         
     */
    ConfigurationInfo: ConfigurationInfo;
    /**
     * 
            The version of the cluster that needs to be updated.
         
     */
    CurrentVersion: __string;
  }
  export interface UpdateClusterConfigurationResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster operation.
         
     */
    ClusterOperationArn?: __string;
  }
  export interface UpdateClusterKafkaVersionRequest {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster to be updated.
            
     */
    ClusterArn: __string;
    /**
     * 
            The custom configuration that should be applied on the new version of cluster.
            
     */
    ConfigurationInfo?: ConfigurationInfo;
    /**
     * 
            Current cluster version.
            
     */
    CurrentVersion: __string;
    /**
     * 
            Target Kafka version.
            
     */
    TargetKafkaVersion: __string;
  }
  export interface UpdateClusterKafkaVersionResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
            
     */
    ClusterArn?: __string;
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster operation.
            
     */
    ClusterOperationArn?: __string;
  }
  export interface UpdateMonitoringRequest {
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the cluster.
         
     */
    ClusterArn: __string;
    /**
     * 
            The version of the MSK cluster to update. Cluster versions aren't simple numbers. You can describe an MSK cluster to find its version. When this update operation is successful, it generates a new cluster version.
         
     */
    CurrentVersion: __string;
    /**
     * 
            Specifies which Apache Kafka metrics Amazon MSK gathers and sends to Amazon CloudWatch for this cluster.
         
     */
    EnhancedMonitoring?: EnhancedMonitoring;
    /**
     * 
            The settings for open monitoring.
         
     */
    OpenMonitoring?: OpenMonitoringInfo;
    LoggingInfo?: LoggingInfo;
  }
  export interface UpdateMonitoringResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster operation.
         
     */
    ClusterOperationArn?: __string;
  }
  export interface UpdateSecurityRequest {
    /**
     * 
            Includes all client authentication related information.
         
     */
    ClientAuthentication?: ClientAuthentication;
    /**
     * 
            The Amazon Resource Name (ARN) that uniquely identifies the cluster.
         
     */
    ClusterArn: __string;
    /**
     * 
            The version of the MSK cluster to update. Cluster versions aren't simple numbers. You can describe an MSK cluster to find its version. When this update operation is successful, it generates a new cluster version.
         
     */
    CurrentVersion: __string;
    /**
     * 
            Includes all encryption-related information.
         
     */
    EncryptionInfo?: EncryptionInfo;
  }
  export interface UpdateSecurityResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster operation.
         
     */
    ClusterOperationArn?: __string;
  }
  export interface UpdateStorageRequest {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster to be updated.
         
     */
    ClusterArn: __string;
    /**
     * 
            The version of cluster to update from. A successful operation will then generate a new version.
         
     */
    CurrentVersion: __string;
    /**
     * 
            EBS volume provisioned throughput information.
         
     */
    ProvisionedThroughput?: ProvisionedThroughput;
    /**
     * 
            Controls storage mode for supported storage tiers.
         
     */
    StorageMode?: StorageMode;
    /**
     * 
            size of the EBS volume to update.
         
     */
    VolumeSizeGB?: __integer;
  }
  export interface UpdateStorageResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster operation.
         
     */
    ClusterOperationArn?: __string;
  }
  export interface UpdateConfigurationRequest {
    /**
     * 
            The Amazon Resource Name (ARN) of the configuration.
         
     */
    Arn: __string;
    /**
     * 
            The description of the configuration revision.
         
     */
    Description?: __string;
    /**
     * 
            Contents of the server.properties file. When using the API, you must ensure that the contents of the file are base64 encoded. 
               When using the AWS Management Console, the SDK, or the AWS CLI, the contents of server.properties can be in plaintext.
         
     */
    ServerProperties: __blob;
  }
  export interface UpdateConfigurationResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the configuration.
         
     */
    Arn?: __string;
    /**
     * 
            Latest revision of the configuration.
         
     */
    LatestRevision?: ConfigurationRevision;
  }
  export interface UpdateConnectivityRequest {
    /**
     * 
            The Amazon Resource Name (ARN) of the configuration.
         
     */
    ClusterArn: __string;
    /**
     * 
            Information about the broker access configuration.
         
     */
    ConnectivityInfo: ConnectivityInfo;
    /**
     * 
            The version of the MSK cluster to update. Cluster versions aren't simple numbers. You can describe an MSK cluster to find its version. When this update operation is successful, it generates a new cluster version.
         
     */
    CurrentVersion: __string;
  }
  export interface UpdateConnectivityResponse {
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster.
         
     */
    ClusterArn?: __string;
    /**
     * 
            The Amazon Resource Name (ARN) of the cluster operation.
         
     */
    ClusterOperationArn?: __string;
  }
  export interface UserIdentity {
    /**
     * 
            The identity type of the requester that calls the API operation.
         
     */
    Type?: UserIdentityType;
    /**
     * 
            A unique identifier for the requester that calls the API operation.
         
     */
    PrincipalId?: __string;
  }
  export type UserIdentityType = "AWSACCOUNT"|"AWSSERVICE"|string;
  export interface VpcConnectionInfo {
    /**
     * 
            The Amazon Resource Name (ARN) of the VPC connection.
         
     */
    VpcConnectionArn?: __string;
    /**
     * 
            The owner of the VPC Connection.
         
     */
    Owner?: __string;
    /**
     * 
            Description of the requester that calls the API operation.
         
     */
    UserIdentity?: UserIdentity;
    /**
     * 
            The time when Amazon MSK creates the VPC Connnection.
         
     */
    CreationTime?: __timestampIso8601;
  }
  export interface VpcConnectionInfoServerless {
    /**
     * 
            The time when Amazon MSK creates the VPC Connnection.
     */
    CreationTime?: __timestampIso8601;
    /**
     * 
            The owner of the VPC Connection.
     */
    Owner?: __string;
    /**
     * 
            Description of the requester that calls the API operation.
     */
    UserIdentity?: UserIdentity;
    /**
     * 
            The Amazon Resource Name (ARN) of the VPC connection.
     */
    VpcConnectionArn?: __string;
  }
  export type VpcConnectionState = "CREATING"|"AVAILABLE"|"INACTIVE"|"DEACTIVATING"|"DELETING"|"FAILED"|"REJECTED"|"REJECTING"|string;
  export interface VpcConnectivity {
    /**
     * 
            Includes all client authentication information for VPC connectivity.
         
     */
    ClientAuthentication?: VpcConnectivityClientAuthentication;
  }
  export interface ZookeeperNodeInfo {
    /**
     * 
            The attached elastic network interface of the broker.
         
     */
    AttachedENIId?: __string;
    /**
     * 
            The virtual private cloud (VPC) IP address of the client.
         
     */
    ClientVpcIpAddress?: __string;
    /**
     * 
            Endpoints for accessing the ZooKeeper.
         
     */
    Endpoints?: __listOf__string;
    /**
     * 
            The role-specific ID for Zookeeper.
         
     */
    ZookeeperId?: __double;
    /**
     * 
            The version of Zookeeper.
         
     */
    ZookeeperVersion?: __string;
  }
  export type __boolean = boolean;
  export type __blob = Buffer|Uint8Array|Blob|string;
  export type __double = number;
  export type __integer = number;
  export type __integerMin1Max15 = number;
  export type __integerMin1Max16384 = number;
  export type __listOfBrokerEBSVolumeInfo = BrokerEBSVolumeInfo[];
  export type __listOfClusterInfo = ClusterInfo[];
  export type __listOfCluster = Cluster[];
  export type __listOfClusterOperationInfo = ClusterOperationInfo[];
  export type __listOfClusterOperationV2Summary = ClusterOperationV2Summary[];
  export type __listOfClusterOperationStep = ClusterOperationStep[];
  export type __listOfCompatibleKafkaVersion = CompatibleKafkaVersion[];
  export type __listOfVpcConfig = VpcConfig[];
  export type __listOfConfiguration = Configuration[];
  export type __listOfConfigurationRevision = ConfigurationRevision[];
  export type __listOfKafkaVersion = KafkaVersion[];
  export type __listOfNodeInfo = NodeInfo[];
  export type __listOfClientVpcConnection = ClientVpcConnection[];
  export type __listOfVpcConnection = VpcConnection[];
  export type __listOfUnprocessedScramSecret = UnprocessedScramSecret[];
  export type __listOf__string = __string[];
  export type __long = number;
  export type __mapOf__string = {[key: string]: __string};
  export type __string = string;
  export type __stringMin1Max128 = string;
  export type __stringMin1Max64 = string;
  export type __stringMin5Max32 = string;
  export type __timestampIso8601 = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-11-14"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Kafka client.
   */
  export import Types = Kafka;
}
export = Kafka;
