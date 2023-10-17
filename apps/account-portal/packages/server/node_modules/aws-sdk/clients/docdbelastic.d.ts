import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class DocDBElastic extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: DocDBElastic.Types.ClientConfiguration)
  config: Config & DocDBElastic.Types.ClientConfiguration;
  /**
   * Creates a new Elastic DocumentDB cluster and returns its Cluster structure.
   */
  createCluster(params: DocDBElastic.Types.CreateClusterInput, callback?: (err: AWSError, data: DocDBElastic.Types.CreateClusterOutput) => void): Request<DocDBElastic.Types.CreateClusterOutput, AWSError>;
  /**
   * Creates a new Elastic DocumentDB cluster and returns its Cluster structure.
   */
  createCluster(callback?: (err: AWSError, data: DocDBElastic.Types.CreateClusterOutput) => void): Request<DocDBElastic.Types.CreateClusterOutput, AWSError>;
  /**
   * Creates a snapshot of a cluster.
   */
  createClusterSnapshot(params: DocDBElastic.Types.CreateClusterSnapshotInput, callback?: (err: AWSError, data: DocDBElastic.Types.CreateClusterSnapshotOutput) => void): Request<DocDBElastic.Types.CreateClusterSnapshotOutput, AWSError>;
  /**
   * Creates a snapshot of a cluster.
   */
  createClusterSnapshot(callback?: (err: AWSError, data: DocDBElastic.Types.CreateClusterSnapshotOutput) => void): Request<DocDBElastic.Types.CreateClusterSnapshotOutput, AWSError>;
  /**
   * Delete a Elastic DocumentDB cluster.
   */
  deleteCluster(params: DocDBElastic.Types.DeleteClusterInput, callback?: (err: AWSError, data: DocDBElastic.Types.DeleteClusterOutput) => void): Request<DocDBElastic.Types.DeleteClusterOutput, AWSError>;
  /**
   * Delete a Elastic DocumentDB cluster.
   */
  deleteCluster(callback?: (err: AWSError, data: DocDBElastic.Types.DeleteClusterOutput) => void): Request<DocDBElastic.Types.DeleteClusterOutput, AWSError>;
  /**
   * Delete a Elastic DocumentDB snapshot.
   */
  deleteClusterSnapshot(params: DocDBElastic.Types.DeleteClusterSnapshotInput, callback?: (err: AWSError, data: DocDBElastic.Types.DeleteClusterSnapshotOutput) => void): Request<DocDBElastic.Types.DeleteClusterSnapshotOutput, AWSError>;
  /**
   * Delete a Elastic DocumentDB snapshot.
   */
  deleteClusterSnapshot(callback?: (err: AWSError, data: DocDBElastic.Types.DeleteClusterSnapshotOutput) => void): Request<DocDBElastic.Types.DeleteClusterSnapshotOutput, AWSError>;
  /**
   * Returns information about a specific Elastic DocumentDB cluster.
   */
  getCluster(params: DocDBElastic.Types.GetClusterInput, callback?: (err: AWSError, data: DocDBElastic.Types.GetClusterOutput) => void): Request<DocDBElastic.Types.GetClusterOutput, AWSError>;
  /**
   * Returns information about a specific Elastic DocumentDB cluster.
   */
  getCluster(callback?: (err: AWSError, data: DocDBElastic.Types.GetClusterOutput) => void): Request<DocDBElastic.Types.GetClusterOutput, AWSError>;
  /**
   * Returns information about a specific Elastic DocumentDB snapshot
   */
  getClusterSnapshot(params: DocDBElastic.Types.GetClusterSnapshotInput, callback?: (err: AWSError, data: DocDBElastic.Types.GetClusterSnapshotOutput) => void): Request<DocDBElastic.Types.GetClusterSnapshotOutput, AWSError>;
  /**
   * Returns information about a specific Elastic DocumentDB snapshot
   */
  getClusterSnapshot(callback?: (err: AWSError, data: DocDBElastic.Types.GetClusterSnapshotOutput) => void): Request<DocDBElastic.Types.GetClusterSnapshotOutput, AWSError>;
  /**
   * Returns information about Elastic DocumentDB snapshots for a specified cluster.
   */
  listClusterSnapshots(params: DocDBElastic.Types.ListClusterSnapshotsInput, callback?: (err: AWSError, data: DocDBElastic.Types.ListClusterSnapshotsOutput) => void): Request<DocDBElastic.Types.ListClusterSnapshotsOutput, AWSError>;
  /**
   * Returns information about Elastic DocumentDB snapshots for a specified cluster.
   */
  listClusterSnapshots(callback?: (err: AWSError, data: DocDBElastic.Types.ListClusterSnapshotsOutput) => void): Request<DocDBElastic.Types.ListClusterSnapshotsOutput, AWSError>;
  /**
   * Returns information about provisioned Elastic DocumentDB clusters.
   */
  listClusters(params: DocDBElastic.Types.ListClustersInput, callback?: (err: AWSError, data: DocDBElastic.Types.ListClustersOutput) => void): Request<DocDBElastic.Types.ListClustersOutput, AWSError>;
  /**
   * Returns information about provisioned Elastic DocumentDB clusters.
   */
  listClusters(callback?: (err: AWSError, data: DocDBElastic.Types.ListClustersOutput) => void): Request<DocDBElastic.Types.ListClustersOutput, AWSError>;
  /**
   * Lists all tags on a Elastic DocumentDB resource
   */
  listTagsForResource(params: DocDBElastic.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: DocDBElastic.Types.ListTagsForResourceResponse) => void): Request<DocDBElastic.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all tags on a Elastic DocumentDB resource
   */
  listTagsForResource(callback?: (err: AWSError, data: DocDBElastic.Types.ListTagsForResourceResponse) => void): Request<DocDBElastic.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Restores a Elastic DocumentDB cluster from a snapshot.
   */
  restoreClusterFromSnapshot(params: DocDBElastic.Types.RestoreClusterFromSnapshotInput, callback?: (err: AWSError, data: DocDBElastic.Types.RestoreClusterFromSnapshotOutput) => void): Request<DocDBElastic.Types.RestoreClusterFromSnapshotOutput, AWSError>;
  /**
   * Restores a Elastic DocumentDB cluster from a snapshot.
   */
  restoreClusterFromSnapshot(callback?: (err: AWSError, data: DocDBElastic.Types.RestoreClusterFromSnapshotOutput) => void): Request<DocDBElastic.Types.RestoreClusterFromSnapshotOutput, AWSError>;
  /**
   * Adds metadata tags to a Elastic DocumentDB resource
   */
  tagResource(params: DocDBElastic.Types.TagResourceRequest, callback?: (err: AWSError, data: DocDBElastic.Types.TagResourceResponse) => void): Request<DocDBElastic.Types.TagResourceResponse, AWSError>;
  /**
   * Adds metadata tags to a Elastic DocumentDB resource
   */
  tagResource(callback?: (err: AWSError, data: DocDBElastic.Types.TagResourceResponse) => void): Request<DocDBElastic.Types.TagResourceResponse, AWSError>;
  /**
   * Removes metadata tags to a Elastic DocumentDB resource
   */
  untagResource(params: DocDBElastic.Types.UntagResourceRequest, callback?: (err: AWSError, data: DocDBElastic.Types.UntagResourceResponse) => void): Request<DocDBElastic.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes metadata tags to a Elastic DocumentDB resource
   */
  untagResource(callback?: (err: AWSError, data: DocDBElastic.Types.UntagResourceResponse) => void): Request<DocDBElastic.Types.UntagResourceResponse, AWSError>;
  /**
   * Modifies a Elastic DocumentDB cluster. This includes updating admin-username/password, upgrading API version setting up a backup window and maintenance window
   */
  updateCluster(params: DocDBElastic.Types.UpdateClusterInput, callback?: (err: AWSError, data: DocDBElastic.Types.UpdateClusterOutput) => void): Request<DocDBElastic.Types.UpdateClusterOutput, AWSError>;
  /**
   * Modifies a Elastic DocumentDB cluster. This includes updating admin-username/password, upgrading API version setting up a backup window and maintenance window
   */
  updateCluster(callback?: (err: AWSError, data: DocDBElastic.Types.UpdateClusterOutput) => void): Request<DocDBElastic.Types.UpdateClusterOutput, AWSError>;
}
declare namespace DocDBElastic {
  export type Arn = string;
  export type Auth = "PLAIN_TEXT"|"SECRET_ARN"|string;
  export interface Cluster {
    /**
     * The name of the Elastic DocumentDB cluster administrator.
     */
    adminUserName: String;
    /**
     * The authentication type for the Elastic DocumentDB cluster.
     */
    authType: Auth;
    /**
     * The arn of the Elastic DocumentDB cluster.
     */
    clusterArn: String;
    /**
     * The URL used to connect to the Elastic DocumentDB cluster.
     */
    clusterEndpoint: String;
    /**
     * The name of the Elastic DocumentDB cluster.
     */
    clusterName: String;
    /**
     * The time when the Elastic DocumentDB cluster was created in Universal Coordinated Time (UTC).
     */
    createTime: String;
    /**
     * The KMS key identifier to use to encrypt the Elastic DocumentDB cluster.
     */
    kmsKeyId: String;
    /**
     * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).  Format: ddd:hh24:mi-ddd:hh24:mi 
     */
    preferredMaintenanceWindow: String;
    /**
     * The capacity of each shard in the Elastic DocumentDB cluster.
     */
    shardCapacity: Integer;
    /**
     * The number of shards in the Elastic DocumentDB cluster.
     */
    shardCount: Integer;
    /**
     * The status of the Elastic DocumentDB cluster.
     */
    status: Status;
    /**
     * The Amazon EC2 subnet IDs for the Elastic DocumentDB cluster.
     */
    subnetIds: StringList;
    /**
     * A list of EC2 VPC security groups associated with this cluster.
     */
    vpcSecurityGroupIds: StringList;
  }
  export interface ClusterInList {
    /**
     * The arn of the Elastic DocumentDB cluster.
     */
    clusterArn: String;
    /**
     * The name of the Elastic DocumentDB cluster.
     */
    clusterName: String;
    /**
     * The status of the Elastic DocumentDB cluster.
     */
    status: Status;
  }
  export type ClusterList = ClusterInList[];
  export interface ClusterSnapshot {
    /**
     * The name of the Elastic DocumentDB cluster administrator.
     */
    adminUserName: String;
    /**
     * The arn of the Elastic DocumentDB cluster.
     */
    clusterArn: String;
    /**
     * The time when the Elastic DocumentDB cluster was created in Universal Coordinated Time (UTC).
     */
    clusterCreationTime: String;
    /**
     * The KMS key identifier to use to encrypt the Elastic DocumentDB cluster.
     */
    kmsKeyId: String;
    /**
     * The arn of the Elastic DocumentDB snapshot
     */
    snapshotArn: String;
    /**
     * The time when the Elastic DocumentDB snapshot was created in Universal Coordinated Time (UTC).
     */
    snapshotCreationTime: String;
    /**
     * The name of the Elastic DocumentDB snapshot.
     */
    snapshotName: String;
    /**
     * The status of the Elastic DocumentDB snapshot.
     */
    status: Status;
    /**
     * A list of the IDs of subnets associated with the DB cluster snapshot.
     */
    subnetIds: StringList;
    /**
     * A list of the IDs of the VPC security groups associated with the cluster snapshot.
     */
    vpcSecurityGroupIds: StringList;
  }
  export interface ClusterSnapshotInList {
    /**
     * The arn of the Elastic DocumentDB cluster.
     */
    clusterArn: String;
    /**
     * The arn of the Elastic DocumentDB snapshot
     */
    snapshotArn: String;
    /**
     * The time when the Elastic DocumentDB snapshot was created in Universal Coordinated Time (UTC).
     */
    snapshotCreationTime: String;
    /**
     * The name of the Elastic DocumentDB snapshot.
     */
    snapshotName: String;
    /**
     * The status of the Elastic DocumentDB snapshot.
     */
    status: Status;
  }
  export type ClusterSnapshotList = ClusterSnapshotInList[];
  export interface CreateClusterInput {
    /**
     * The name of the Elastic DocumentDB cluster administrator.  Constraints:   Must be from 1 to 63 letters or numbers.   The first character must be a letter.   Cannot be a reserved word.  
     */
    adminUserName: String;
    /**
     * The password for the Elastic DocumentDB cluster administrator and can contain any printable ASCII characters.  Constraints:   Must contain from 8 to 100 characters.   Cannot contain a forward slash (/), double quote ("), or the "at" symbol (@).  
     */
    adminUserPassword: Password;
    /**
     * The authentication type for the Elastic DocumentDB cluster.
     */
    authType: Auth;
    /**
     * The client token for the Elastic DocumentDB cluster.
     */
    clientToken?: String;
    /**
     * The name of the new Elastic DocumentDB cluster. This parameter is stored as a lowercase string.  Constraints:   Must contain from 1 to 63 letters, numbers, or hyphens.   The first character must be a letter.   Cannot end with a hyphen or contain two consecutive hyphens.    Example: my-cluster 
     */
    clusterName: String;
    /**
     * The KMS key identifier to use to encrypt the new Elastic DocumentDB cluster. The KMS key identifier is the Amazon Resource Name (ARN) for the KMS encryption key. If you are creating a cluster using the same Amazon account that owns this KMS encryption key, you can use the KMS key alias instead of the ARN as the KMS encryption key. If an encryption key is not specified, Elastic DocumentDB uses the default encryption key that KMS creates for your account. Your account has a different default encryption key for each Amazon Region.
     */
    kmsKeyId?: String;
    /**
     * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).  Format: ddd:hh24:mi-ddd:hh24:mi   Default: a 30-minute window selected at random from an 8-hour block of time for each Amazon Web Services Region, occurring on a random day of the week.  Valid days: Mon, Tue, Wed, Thu, Fri, Sat, Sun  Constraints: Minimum 30-minute window.
     */
    preferredMaintenanceWindow?: String;
    /**
     * The capacity of each shard in the new Elastic DocumentDB cluster.
     */
    shardCapacity: Integer;
    /**
     * The number of shards to create in the new Elastic DocumentDB cluster.
     */
    shardCount: Integer;
    /**
     * The Amazon EC2 subnet IDs for the new Elastic DocumentDB cluster.
     */
    subnetIds?: StringList;
    /**
     * The tags to be assigned to the new Elastic DocumentDB cluster.
     */
    tags?: TagMap;
    /**
     * A list of EC2 VPC security groups to associate with the new Elastic DocumentDB cluster.
     */
    vpcSecurityGroupIds?: StringList;
  }
  export interface CreateClusterOutput {
    /**
     * The new Elastic DocumentDB cluster that has been created.
     */
    cluster: Cluster;
  }
  export interface CreateClusterSnapshotInput {
    /**
     * The arn of the Elastic DocumentDB cluster that the snapshot will be taken from.
     */
    clusterArn: String;
    /**
     * The name of the Elastic DocumentDB snapshot.
     */
    snapshotName: CreateClusterSnapshotInputSnapshotNameString;
    /**
     * The tags to be assigned to the new Elastic DocumentDB snapshot.
     */
    tags?: TagMap;
  }
  export type CreateClusterSnapshotInputSnapshotNameString = string;
  export interface CreateClusterSnapshotOutput {
    /**
     * Returns information about the new Elastic DocumentDB snapshot.
     */
    snapshot: ClusterSnapshot;
  }
  export interface DeleteClusterInput {
    /**
     * The arn of the Elastic DocumentDB cluster that is to be deleted.
     */
    clusterArn: String;
  }
  export interface DeleteClusterOutput {
    /**
     * Returns information about the newly deleted Elastic DocumentDB cluster.
     */
    cluster: Cluster;
  }
  export interface DeleteClusterSnapshotInput {
    /**
     * The arn of the Elastic DocumentDB snapshot that is to be deleted.
     */
    snapshotArn: String;
  }
  export interface DeleteClusterSnapshotOutput {
    /**
     * Returns information about the newly deleted Elastic DocumentDB snapshot.
     */
    snapshot: ClusterSnapshot;
  }
  export interface GetClusterInput {
    /**
     * The arn of the Elastic DocumentDB cluster.
     */
    clusterArn: String;
  }
  export interface GetClusterOutput {
    /**
     * Returns information about a specific Elastic DocumentDB cluster.
     */
    cluster: Cluster;
  }
  export interface GetClusterSnapshotInput {
    /**
     * The arn of the Elastic DocumentDB snapshot.
     */
    snapshotArn: String;
  }
  export interface GetClusterSnapshotOutput {
    /**
     * Returns information about a specific Elastic DocumentDB snapshot.
     */
    snapshot: ClusterSnapshot;
  }
  export type Integer = number;
  export interface ListClusterSnapshotsInput {
    /**
     * The arn of the Elastic DocumentDB cluster.
     */
    clusterArn?: String;
    /**
     * The maximum number of entries to recieve in the response.
     */
    maxResults?: ListClusterSnapshotsInputMaxResultsInteger;
    /**
     * The nextToken which is used the get the next page of data.
     */
    nextToken?: PaginationToken;
  }
  export type ListClusterSnapshotsInputMaxResultsInteger = number;
  export interface ListClusterSnapshotsOutput {
    /**
     * The response will provide a nextToken if there is more data beyond the maxResults. If there is no more data in the responce, the nextToken will not be returned.
     */
    nextToken?: PaginationToken;
    /**
     * A list of Elastic DocumentDB snapshots for a specified cluster.
     */
    snapshots?: ClusterSnapshotList;
  }
  export interface ListClustersInput {
    /**
     * The maximum number of entries to recieve in the response.
     */
    maxResults?: ListClustersInputMaxResultsInteger;
    /**
     * The nextToken which is used the get the next page of data.
     */
    nextToken?: PaginationToken;
  }
  export type ListClustersInputMaxResultsInteger = number;
  export interface ListClustersOutput {
    /**
     * A list of Elastic DocumentDB cluster.
     */
    clusters?: ClusterList;
    /**
     * The response will provide a nextToken if there is more data beyond the maxResults. If there is no more data in the responce, the nextToken will not be returned.
     */
    nextToken?: PaginationToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The arn of the Elastic DocumentDB resource.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The list of tags for the specified Elastic DocumentDB resource.
     */
    tags?: TagMap;
  }
  export type PaginationToken = string;
  export type Password = string;
  export interface RestoreClusterFromSnapshotInput {
    /**
     * The name of the Elastic DocumentDB cluster.
     */
    clusterName: String;
    /**
     * The KMS key identifier to use to encrypt the new Elastic DocumentDB cluster. The KMS key identifier is the Amazon Resource Name (ARN) for the KMS encryption key. If you are creating a cluster using the same Amazon account that owns this KMS encryption key, you can use the KMS key alias instead of the ARN as the KMS encryption key. If an encryption key is not specified here, Elastic DocumentDB uses the default encryption key that KMS creates for your account. Your account has a different default encryption key for each Amazon Region.
     */
    kmsKeyId?: String;
    /**
     * The arn of the Elastic DocumentDB snapshot.
     */
    snapshotArn: String;
    /**
     * The Amazon EC2 subnet IDs for the Elastic DocumentDB cluster.
     */
    subnetIds?: StringList;
    /**
     * A list of the tag names to be assigned to the restored DB cluster, in the form of an array of key-value pairs in which the key is the tag name and the value is the key value.
     */
    tags?: TagMap;
    /**
     * A list of EC2 VPC security groups to associate with the Elastic DocumentDB cluster.
     */
    vpcSecurityGroupIds?: StringList;
  }
  export interface RestoreClusterFromSnapshotOutput {
    /**
     * Returns information about a the restored Elastic DocumentDB cluster.
     */
    cluster: Cluster;
  }
  export type Status = "CREATING"|"ACTIVE"|"DELETING"|"UPDATING"|"VPC_ENDPOINT_LIMIT_EXCEEDED"|"IP_ADDRESS_LIMIT_EXCEEDED"|"INVALID_SECURITY_GROUP_ID"|"INVALID_SUBNET_ID"|"INACCESSIBLE_ENCRYPTION_CREDS"|string;
  export type String = string;
  export type StringList = String[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The arn of the Elastic DocumentDB resource.
     */
    resourceArn: Arn;
    /**
     * The tags to be assigned to the Elastic DocumentDB resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface UntagResourceRequest {
    /**
     * The arn of the Elastic DocumentDB resource.
     */
    resourceArn: Arn;
    /**
     * The tag keys to be removed from the Elastic DocumentDB resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateClusterInput {
    /**
     * The password for the Elastic DocumentDB cluster administrator. This password can contain any printable ASCII character except forward slash (/), double quote ("), or the "at" symbol (@).  Constraints: Must contain from 8 to 100 characters.
     */
    adminUserPassword?: Password;
    /**
     * The authentication type for the Elastic DocumentDB cluster.
     */
    authType?: Auth;
    /**
     * The client token for the Elastic DocumentDB cluster.
     */
    clientToken?: String;
    /**
     * The arn of the Elastic DocumentDB cluster.
     */
    clusterArn: String;
    /**
     * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).  Format: ddd:hh24:mi-ddd:hh24:mi   Default: a 30-minute window selected at random from an 8-hour block of time for each Amazon Web Services Region, occurring on a random day of the week.  Valid days: Mon, Tue, Wed, Thu, Fri, Sat, Sun  Constraints: Minimum 30-minute window.
     */
    preferredMaintenanceWindow?: String;
    /**
     * The capacity of each shard in the Elastic DocumentDB cluster.
     */
    shardCapacity?: Integer;
    /**
     * The number of shards to create in the Elastic DocumentDB cluster.
     */
    shardCount?: Integer;
    /**
     * The number of shards to create in the Elastic DocumentDB cluster.
     */
    subnetIds?: StringList;
    /**
     * A list of EC2 VPC security groups to associate with the new Elastic DocumentDB cluster.
     */
    vpcSecurityGroupIds?: StringList;
  }
  export interface UpdateClusterOutput {
    /**
     * Returns information about the updated Elastic DocumentDB cluster.
     */
    cluster: Cluster;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-11-28"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the DocDBElastic client.
   */
  export import Types = DocDBElastic;
}
export = DocDBElastic;
