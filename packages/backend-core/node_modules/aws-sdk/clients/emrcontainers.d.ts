import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class EMRcontainers extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: EMRcontainers.Types.ClientConfiguration)
  config: Config & EMRcontainers.Types.ClientConfiguration;
  /**
   * Cancels a job run. A job run is a unit of work, such as a Spark jar, PySpark script, or SparkSQL query, that you submit to Amazon EMR on EKS.
   */
  cancelJobRun(params: EMRcontainers.Types.CancelJobRunRequest, callback?: (err: AWSError, data: EMRcontainers.Types.CancelJobRunResponse) => void): Request<EMRcontainers.Types.CancelJobRunResponse, AWSError>;
  /**
   * Cancels a job run. A job run is a unit of work, such as a Spark jar, PySpark script, or SparkSQL query, that you submit to Amazon EMR on EKS.
   */
  cancelJobRun(callback?: (err: AWSError, data: EMRcontainers.Types.CancelJobRunResponse) => void): Request<EMRcontainers.Types.CancelJobRunResponse, AWSError>;
  /**
   * Creates a managed endpoint. A managed endpoint is a gateway that connects EMR Studio to Amazon EMR on EKS so that EMR Studio can communicate with your virtual cluster.
   */
  createManagedEndpoint(params: EMRcontainers.Types.CreateManagedEndpointRequest, callback?: (err: AWSError, data: EMRcontainers.Types.CreateManagedEndpointResponse) => void): Request<EMRcontainers.Types.CreateManagedEndpointResponse, AWSError>;
  /**
   * Creates a managed endpoint. A managed endpoint is a gateway that connects EMR Studio to Amazon EMR on EKS so that EMR Studio can communicate with your virtual cluster.
   */
  createManagedEndpoint(callback?: (err: AWSError, data: EMRcontainers.Types.CreateManagedEndpointResponse) => void): Request<EMRcontainers.Types.CreateManagedEndpointResponse, AWSError>;
  /**
   * Creates a virtual cluster. Virtual cluster is a managed entity on Amazon EMR on EKS. You can create, describe, list and delete virtual clusters. They do not consume any additional resource in your system. A single virtual cluster maps to a single Kubernetes namespace. Given this relationship, you can model virtual clusters the same way you model Kubernetes namespaces to meet your requirements.
   */
  createVirtualCluster(params: EMRcontainers.Types.CreateVirtualClusterRequest, callback?: (err: AWSError, data: EMRcontainers.Types.CreateVirtualClusterResponse) => void): Request<EMRcontainers.Types.CreateVirtualClusterResponse, AWSError>;
  /**
   * Creates a virtual cluster. Virtual cluster is a managed entity on Amazon EMR on EKS. You can create, describe, list and delete virtual clusters. They do not consume any additional resource in your system. A single virtual cluster maps to a single Kubernetes namespace. Given this relationship, you can model virtual clusters the same way you model Kubernetes namespaces to meet your requirements.
   */
  createVirtualCluster(callback?: (err: AWSError, data: EMRcontainers.Types.CreateVirtualClusterResponse) => void): Request<EMRcontainers.Types.CreateVirtualClusterResponse, AWSError>;
  /**
   * Deletes a managed endpoint. A managed endpoint is a gateway that connects EMR Studio to Amazon EMR on EKS so that EMR Studio can communicate with your virtual cluster.
   */
  deleteManagedEndpoint(params: EMRcontainers.Types.DeleteManagedEndpointRequest, callback?: (err: AWSError, data: EMRcontainers.Types.DeleteManagedEndpointResponse) => void): Request<EMRcontainers.Types.DeleteManagedEndpointResponse, AWSError>;
  /**
   * Deletes a managed endpoint. A managed endpoint is a gateway that connects EMR Studio to Amazon EMR on EKS so that EMR Studio can communicate with your virtual cluster.
   */
  deleteManagedEndpoint(callback?: (err: AWSError, data: EMRcontainers.Types.DeleteManagedEndpointResponse) => void): Request<EMRcontainers.Types.DeleteManagedEndpointResponse, AWSError>;
  /**
   * Deletes a virtual cluster. Virtual cluster is a managed entity on Amazon EMR on EKS. You can create, describe, list and delete virtual clusters. They do not consume any additional resource in your system. A single virtual cluster maps to a single Kubernetes namespace. Given this relationship, you can model virtual clusters the same way you model Kubernetes namespaces to meet your requirements.
   */
  deleteVirtualCluster(params: EMRcontainers.Types.DeleteVirtualClusterRequest, callback?: (err: AWSError, data: EMRcontainers.Types.DeleteVirtualClusterResponse) => void): Request<EMRcontainers.Types.DeleteVirtualClusterResponse, AWSError>;
  /**
   * Deletes a virtual cluster. Virtual cluster is a managed entity on Amazon EMR on EKS. You can create, describe, list and delete virtual clusters. They do not consume any additional resource in your system. A single virtual cluster maps to a single Kubernetes namespace. Given this relationship, you can model virtual clusters the same way you model Kubernetes namespaces to meet your requirements.
   */
  deleteVirtualCluster(callback?: (err: AWSError, data: EMRcontainers.Types.DeleteVirtualClusterResponse) => void): Request<EMRcontainers.Types.DeleteVirtualClusterResponse, AWSError>;
  /**
   * Displays detailed information about a job run. A job run is a unit of work, such as a Spark jar, PySpark script, or SparkSQL query, that you submit to Amazon EMR on EKS.
   */
  describeJobRun(params: EMRcontainers.Types.DescribeJobRunRequest, callback?: (err: AWSError, data: EMRcontainers.Types.DescribeJobRunResponse) => void): Request<EMRcontainers.Types.DescribeJobRunResponse, AWSError>;
  /**
   * Displays detailed information about a job run. A job run is a unit of work, such as a Spark jar, PySpark script, or SparkSQL query, that you submit to Amazon EMR on EKS.
   */
  describeJobRun(callback?: (err: AWSError, data: EMRcontainers.Types.DescribeJobRunResponse) => void): Request<EMRcontainers.Types.DescribeJobRunResponse, AWSError>;
  /**
   * Displays detailed information about a managed endpoint. A managed endpoint is a gateway that connects EMR Studio to Amazon EMR on EKS so that EMR Studio can communicate with your virtual cluster.
   */
  describeManagedEndpoint(params: EMRcontainers.Types.DescribeManagedEndpointRequest, callback?: (err: AWSError, data: EMRcontainers.Types.DescribeManagedEndpointResponse) => void): Request<EMRcontainers.Types.DescribeManagedEndpointResponse, AWSError>;
  /**
   * Displays detailed information about a managed endpoint. A managed endpoint is a gateway that connects EMR Studio to Amazon EMR on EKS so that EMR Studio can communicate with your virtual cluster.
   */
  describeManagedEndpoint(callback?: (err: AWSError, data: EMRcontainers.Types.DescribeManagedEndpointResponse) => void): Request<EMRcontainers.Types.DescribeManagedEndpointResponse, AWSError>;
  /**
   * Displays detailed information about a specified virtual cluster. Virtual cluster is a managed entity on Amazon EMR on EKS. You can create, describe, list and delete virtual clusters. They do not consume any additional resource in your system. A single virtual cluster maps to a single Kubernetes namespace. Given this relationship, you can model virtual clusters the same way you model Kubernetes namespaces to meet your requirements.
   */
  describeVirtualCluster(params: EMRcontainers.Types.DescribeVirtualClusterRequest, callback?: (err: AWSError, data: EMRcontainers.Types.DescribeVirtualClusterResponse) => void): Request<EMRcontainers.Types.DescribeVirtualClusterResponse, AWSError>;
  /**
   * Displays detailed information about a specified virtual cluster. Virtual cluster is a managed entity on Amazon EMR on EKS. You can create, describe, list and delete virtual clusters. They do not consume any additional resource in your system. A single virtual cluster maps to a single Kubernetes namespace. Given this relationship, you can model virtual clusters the same way you model Kubernetes namespaces to meet your requirements.
   */
  describeVirtualCluster(callback?: (err: AWSError, data: EMRcontainers.Types.DescribeVirtualClusterResponse) => void): Request<EMRcontainers.Types.DescribeVirtualClusterResponse, AWSError>;
  /**
   * Lists job runs based on a set of parameters. A job run is a unit of work, such as a Spark jar, PySpark script, or SparkSQL query, that you submit to Amazon EMR on EKS.
   */
  listJobRuns(params: EMRcontainers.Types.ListJobRunsRequest, callback?: (err: AWSError, data: EMRcontainers.Types.ListJobRunsResponse) => void): Request<EMRcontainers.Types.ListJobRunsResponse, AWSError>;
  /**
   * Lists job runs based on a set of parameters. A job run is a unit of work, such as a Spark jar, PySpark script, or SparkSQL query, that you submit to Amazon EMR on EKS.
   */
  listJobRuns(callback?: (err: AWSError, data: EMRcontainers.Types.ListJobRunsResponse) => void): Request<EMRcontainers.Types.ListJobRunsResponse, AWSError>;
  /**
   * Lists managed endpoints based on a set of parameters. A managed endpoint is a gateway that connects EMR Studio to Amazon EMR on EKS so that EMR Studio can communicate with your virtual cluster.
   */
  listManagedEndpoints(params: EMRcontainers.Types.ListManagedEndpointsRequest, callback?: (err: AWSError, data: EMRcontainers.Types.ListManagedEndpointsResponse) => void): Request<EMRcontainers.Types.ListManagedEndpointsResponse, AWSError>;
  /**
   * Lists managed endpoints based on a set of parameters. A managed endpoint is a gateway that connects EMR Studio to Amazon EMR on EKS so that EMR Studio can communicate with your virtual cluster.
   */
  listManagedEndpoints(callback?: (err: AWSError, data: EMRcontainers.Types.ListManagedEndpointsResponse) => void): Request<EMRcontainers.Types.ListManagedEndpointsResponse, AWSError>;
  /**
   * Lists the tags assigned to the resources.
   */
  listTagsForResource(params: EMRcontainers.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: EMRcontainers.Types.ListTagsForResourceResponse) => void): Request<EMRcontainers.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags assigned to the resources.
   */
  listTagsForResource(callback?: (err: AWSError, data: EMRcontainers.Types.ListTagsForResourceResponse) => void): Request<EMRcontainers.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists information about the specified virtual cluster. Virtual cluster is a managed entity on Amazon EMR on EKS. You can create, describe, list and delete virtual clusters. They do not consume any additional resource in your system. A single virtual cluster maps to a single Kubernetes namespace. Given this relationship, you can model virtual clusters the same way you model Kubernetes namespaces to meet your requirements.
   */
  listVirtualClusters(params: EMRcontainers.Types.ListVirtualClustersRequest, callback?: (err: AWSError, data: EMRcontainers.Types.ListVirtualClustersResponse) => void): Request<EMRcontainers.Types.ListVirtualClustersResponse, AWSError>;
  /**
   * Lists information about the specified virtual cluster. Virtual cluster is a managed entity on Amazon EMR on EKS. You can create, describe, list and delete virtual clusters. They do not consume any additional resource in your system. A single virtual cluster maps to a single Kubernetes namespace. Given this relationship, you can model virtual clusters the same way you model Kubernetes namespaces to meet your requirements.
   */
  listVirtualClusters(callback?: (err: AWSError, data: EMRcontainers.Types.ListVirtualClustersResponse) => void): Request<EMRcontainers.Types.ListVirtualClustersResponse, AWSError>;
  /**
   * Starts a job run. A job run is a unit of work, such as a Spark jar, PySpark script, or SparkSQL query, that you submit to Amazon EMR on EKS.
   */
  startJobRun(params: EMRcontainers.Types.StartJobRunRequest, callback?: (err: AWSError, data: EMRcontainers.Types.StartJobRunResponse) => void): Request<EMRcontainers.Types.StartJobRunResponse, AWSError>;
  /**
   * Starts a job run. A job run is a unit of work, such as a Spark jar, PySpark script, or SparkSQL query, that you submit to Amazon EMR on EKS.
   */
  startJobRun(callback?: (err: AWSError, data: EMRcontainers.Types.StartJobRunResponse) => void): Request<EMRcontainers.Types.StartJobRunResponse, AWSError>;
  /**
   * Assigns tags to resources. A tag is a label that you assign to an AWS resource. Each tag consists of a key and an optional value, both of which you define. Tags enable you to categorize your AWS resources by attributes such as purpose, owner, or environment. When you have many resources of the same type, you can quickly identify a specific resource based on the tags you've assigned to it. For example, you can define a set of tags for your Amazon EMR on EKS clusters to help you track each cluster's owner and stack level. We recommend that you devise a consistent set of tag keys for each resource type. You can then search and filter the resources based on the tags that you add.
   */
  tagResource(params: EMRcontainers.Types.TagResourceRequest, callback?: (err: AWSError, data: EMRcontainers.Types.TagResourceResponse) => void): Request<EMRcontainers.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns tags to resources. A tag is a label that you assign to an AWS resource. Each tag consists of a key and an optional value, both of which you define. Tags enable you to categorize your AWS resources by attributes such as purpose, owner, or environment. When you have many resources of the same type, you can quickly identify a specific resource based on the tags you've assigned to it. For example, you can define a set of tags for your Amazon EMR on EKS clusters to help you track each cluster's owner and stack level. We recommend that you devise a consistent set of tag keys for each resource type. You can then search and filter the resources based on the tags that you add.
   */
  tagResource(callback?: (err: AWSError, data: EMRcontainers.Types.TagResourceResponse) => void): Request<EMRcontainers.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from resources.
   */
  untagResource(params: EMRcontainers.Types.UntagResourceRequest, callback?: (err: AWSError, data: EMRcontainers.Types.UntagResourceResponse) => void): Request<EMRcontainers.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from resources.
   */
  untagResource(callback?: (err: AWSError, data: EMRcontainers.Types.UntagResourceResponse) => void): Request<EMRcontainers.Types.UntagResourceResponse, AWSError>;
}
declare namespace EMRcontainers {
  export type ACMCertArn = string;
  export type Base64Encoded = string;
  export interface CancelJobRunRequest {
    /**
     * The ID of the job run to cancel.
     */
    id: ResourceIdString;
    /**
     * The ID of the virtual cluster for which the job run will be canceled.
     */
    virtualClusterId: ResourceIdString;
  }
  export interface CancelJobRunResponse {
    /**
     * The output contains the ID of the cancelled job run.
     */
    id?: ResourceIdString;
    /**
     * The output contains the virtual cluster ID for which the job run is cancelled.
     */
    virtualClusterId?: ResourceIdString;
  }
  export interface Certificate {
    /**
     * The ARN of the certificate generated for managed endpoint.
     */
    certificateArn?: ACMCertArn;
    /**
     * The base64 encoded PEM certificate data generated for managed endpoint.
     */
    certificateData?: Base64Encoded;
  }
  export type ClientToken = string;
  export interface CloudWatchMonitoringConfiguration {
    /**
     * The name of the log group for log publishing.
     */
    logGroupName: LogGroupName;
    /**
     * The specified name prefix for log streams.
     */
    logStreamNamePrefix?: String256;
  }
  export type ClusterId = string;
  export interface Configuration {
    /**
     * The classification within a configuration.
     */
    classification: String1024;
    /**
     * A set of properties specified within a configuration classification.
     */
    properties?: SensitivePropertiesMap;
    /**
     * A list of additional configurations to apply within a configuration object.
     */
    configurations?: ConfigurationList;
  }
  export type ConfigurationList = Configuration[];
  export interface ConfigurationOverrides {
    /**
     * The configurations for the application running by the job run. 
     */
    applicationConfiguration?: ConfigurationList;
    /**
     * The configurations for monitoring.
     */
    monitoringConfiguration?: MonitoringConfiguration;
  }
  export interface ContainerInfo {
    /**
     * The information about the EKS cluster.
     */
    eksInfo?: EksInfo;
  }
  export interface ContainerProvider {
    /**
     * The type of the container provider. EKS is the only supported type as of now.
     */
    type: ContainerProviderType;
    /**
     * The ID of the container cluster.
     */
    id: ClusterId;
    /**
     * The information about the container cluster.
     */
    info?: ContainerInfo;
  }
  export type ContainerProviderType = "EKS"|string;
  export interface CreateManagedEndpointRequest {
    /**
     * The name of the managed endpoint.
     */
    name: ResourceNameString;
    /**
     * The ID of the virtual cluster for which a managed endpoint is created.
     */
    virtualClusterId: ResourceIdString;
    /**
     * The type of the managed endpoint.
     */
    type: EndpointType;
    /**
     * The Amazon EMR release version.
     */
    releaseLabel: ReleaseLabel;
    /**
     * The ARN of the execution role.
     */
    executionRoleArn: IAMRoleArn;
    /**
     * The certificate ARN provided by users for the managed endpoint. This fiedd is under deprecation and will be removed in future releases.
     */
    certificateArn?: ACMCertArn;
    /**
     * The configuration settings that will be used to override existing configurations.
     */
    configurationOverrides?: ConfigurationOverrides;
    /**
     * The client idempotency token for this create call.
     */
    clientToken: ClientToken;
    /**
     * The tags of the managed endpoint. 
     */
    tags?: TagMap;
  }
  export interface CreateManagedEndpointResponse {
    /**
     * The output contains the ID of the managed endpoint.
     */
    id?: ResourceIdString;
    /**
     * The output contains the name of the managed endpoint.
     */
    name?: ResourceNameString;
    /**
     * The output contains the ARN of the managed endpoint.
     */
    arn?: EndpointArn;
    /**
     * The output contains the ID of the virtual cluster.
     */
    virtualClusterId?: ResourceIdString;
  }
  export interface CreateVirtualClusterRequest {
    /**
     * The specified name of the virtual cluster.
     */
    name: ResourceNameString;
    /**
     * The container provider of the virtual cluster.
     */
    containerProvider: ContainerProvider;
    /**
     * The client token of the virtual cluster.
     */
    clientToken: ClientToken;
    /**
     * The tags assigned to the virtual cluster.
     */
    tags?: TagMap;
  }
  export interface CreateVirtualClusterResponse {
    /**
     * This output contains the virtual cluster ID.
     */
    id?: ResourceIdString;
    /**
     * This output contains the name of the virtual cluster.
     */
    name?: ResourceNameString;
    /**
     * This output contains the ARN of virtual cluster.
     */
    arn?: VirtualClusterArn;
  }
  export type _Date = Date;
  export interface DeleteManagedEndpointRequest {
    /**
     * The ID of the managed endpoint.
     */
    id: ResourceIdString;
    /**
     * The ID of the endpoint's virtual cluster.
     */
    virtualClusterId: ResourceIdString;
  }
  export interface DeleteManagedEndpointResponse {
    /**
     * The output displays the ID of the managed endpoint.
     */
    id?: ResourceIdString;
    /**
     * The output displays the ID of the endpoint's virtual cluster.
     */
    virtualClusterId?: ResourceIdString;
  }
  export interface DeleteVirtualClusterRequest {
    /**
     * The ID of the virtual cluster that will be deleted.
     */
    id: ResourceIdString;
  }
  export interface DeleteVirtualClusterResponse {
    /**
     * This output contains the ID of the virtual cluster that will be deleted. 
     */
    id?: ResourceIdString;
  }
  export interface DescribeJobRunRequest {
    /**
     * The ID of the job run request. 
     */
    id: ResourceIdString;
    /**
     * The ID of the virtual cluster for which the job run is submitted.
     */
    virtualClusterId: ResourceIdString;
  }
  export interface DescribeJobRunResponse {
    /**
     * The output displays information about a job run.
     */
    jobRun?: JobRun;
  }
  export interface DescribeManagedEndpointRequest {
    /**
     * This output displays ID of the managed endpoint.
     */
    id: ResourceIdString;
    /**
     * The ID of the endpoint's virtual cluster.
     */
    virtualClusterId: ResourceIdString;
  }
  export interface DescribeManagedEndpointResponse {
    /**
     * This output displays information about a managed endpoint.
     */
    endpoint?: Endpoint;
  }
  export interface DescribeVirtualClusterRequest {
    /**
     * The ID of the virtual cluster that will be described.
     */
    id: ResourceIdString;
  }
  export interface DescribeVirtualClusterResponse {
    /**
     * This output displays information about the specified virtual cluster.
     */
    virtualCluster?: VirtualCluster;
  }
  export interface EksInfo {
    /**
     * The namespaces of the EKS cluster.
     */
    namespace?: KubernetesNamespace;
  }
  export interface Endpoint {
    /**
     * The ID of the endpoint.
     */
    id?: ResourceIdString;
    /**
     * The name of the endpoint.
     */
    name?: ResourceNameString;
    /**
     * The ARN of the endpoint.
     */
    arn?: EndpointArn;
    /**
     * The ID of the endpoint's virtual cluster.
     */
    virtualClusterId?: ResourceIdString;
    /**
     * The type of the endpoint.
     */
    type?: EndpointType;
    /**
     * The state of the endpoint.
     */
    state?: EndpointState;
    /**
     * The EMR release version to be used for the endpoint.
     */
    releaseLabel?: ReleaseLabel;
    /**
     * The execution role ARN of the endpoint.
     */
    executionRoleArn?: IAMRoleArn;
    /**
     * The certificate ARN of the endpoint. This field is under deprecation and will be removed in future.
     */
    certificateArn?: ACMCertArn;
    /**
     * The certificate generated by emr control plane on customer behalf to secure the managed endpoint.
     */
    certificateAuthority?: Certificate;
    /**
     * The configuration settings that are used to override existing configurations for endpoints.
     */
    configurationOverrides?: ConfigurationOverrides;
    /**
     * The server URL of the endpoint.
     */
    serverUrl?: UriString;
    /**
     * The date and time when the endpoint was created.
     */
    createdAt?: _Date;
    /**
     * The security group configuration of the endpoint. 
     */
    securityGroup?: String256;
    /**
     * The subnet IDs of the endpoint. 
     */
    subnetIds?: SubnetIds;
    /**
     *  Additional details of the endpoint state. 
     */
    stateDetails?: String256;
    /**
     *  The reasons why the endpoint has failed. 
     */
    failureReason?: FailureReason;
    /**
     * The tags of the endpoint. 
     */
    tags?: TagMap;
  }
  export type EndpointArn = string;
  export type EndpointState = "CREATING"|"ACTIVE"|"TERMINATING"|"TERMINATED"|"TERMINATED_WITH_ERRORS"|string;
  export type EndpointStates = EndpointState[];
  export type EndpointType = string;
  export type EndpointTypes = EndpointType[];
  export type Endpoints = Endpoint[];
  export type EntryPointArgument = string;
  export type EntryPointArguments = EntryPointArgument[];
  export type EntryPointPath = string;
  export type FailureReason = "INTERNAL_ERROR"|"USER_ERROR"|"VALIDATION_ERROR"|"CLUSTER_UNAVAILABLE"|string;
  export type IAMRoleArn = string;
  export type JavaInteger = number;
  export type JobArn = string;
  export interface JobDriver {
    /**
     * The job driver parameters specified for spark submit.
     */
    sparkSubmitJobDriver?: SparkSubmitJobDriver;
  }
  export interface JobRun {
    /**
     * The ID of the job run.
     */
    id?: ResourceIdString;
    /**
     * The name of the job run.
     */
    name?: ResourceNameString;
    /**
     * The ID of the job run's virtual cluster.
     */
    virtualClusterId?: ResourceIdString;
    /**
     * The ARN of job run.
     */
    arn?: JobArn;
    /**
     * The state of the job run. 
     */
    state?: JobRunState;
    /**
     * The client token used to start a job run.
     */
    clientToken?: ClientToken;
    /**
     * The execution role ARN of the job run.
     */
    executionRoleArn?: IAMRoleArn;
    /**
     * The release version of Amazon EMR.
     */
    releaseLabel?: ReleaseLabel;
    /**
     * The configuration settings that are used to override default configuration.
     */
    configurationOverrides?: ConfigurationOverrides;
    /**
     * Parameters of job driver for the job run.
     */
    jobDriver?: JobDriver;
    /**
     * The date and time when the job run was created.
     */
    createdAt?: _Date;
    /**
     * The user who created the job run.
     */
    createdBy?: RequestIdentityUserArn;
    /**
     * The date and time when the job run has finished.
     */
    finishedAt?: _Date;
    /**
     * Additional details of the job run state.
     */
    stateDetails?: String256;
    /**
     * The reasons why the job run has failed.
     */
    failureReason?: FailureReason;
    /**
     * The assigned tags of the job run.
     */
    tags?: TagMap;
  }
  export type JobRunState = "PENDING"|"SUBMITTED"|"RUNNING"|"FAILED"|"CANCELLED"|"CANCEL_PENDING"|"COMPLETED"|string;
  export type JobRunStates = JobRunState[];
  export type JobRuns = JobRun[];
  export type KubernetesNamespace = string;
  export interface ListJobRunsRequest {
    /**
     * The ID of the virtual cluster for which to list the job run. 
     */
    virtualClusterId: ResourceIdString;
    /**
     * The date and time before which the job runs were submitted.
     */
    createdBefore?: _Date;
    /**
     * The date and time after which the job runs were submitted.
     */
    createdAfter?: _Date;
    /**
     * The name of the job run.
     */
    name?: ResourceNameString;
    /**
     * The states of the job run.
     */
    states?: JobRunStates;
    /**
     * The maximum number of job runs that can be listed.
     */
    maxResults?: JavaInteger;
    /**
     * The token for the next set of job runs to return.
     */
    nextToken?: NextToken;
  }
  export interface ListJobRunsResponse {
    /**
     * This output lists information about the specified job runs.
     */
    jobRuns?: JobRuns;
    /**
     * This output displays the token for the next set of job runs.
     */
    nextToken?: NextToken;
  }
  export interface ListManagedEndpointsRequest {
    /**
     * The ID of the virtual cluster.
     */
    virtualClusterId: ResourceIdString;
    /**
     * The date and time before which the endpoints are created.
     */
    createdBefore?: _Date;
    /**
     *  The date and time after which the endpoints are created.
     */
    createdAfter?: _Date;
    /**
     * The types of the managed endpoints.
     */
    types?: EndpointTypes;
    /**
     * The states of the managed endpoints.
     */
    states?: EndpointStates;
    /**
     * The maximum number of managed endpoints that can be listed.
     */
    maxResults?: JavaInteger;
    /**
     *  The token for the next set of managed endpoints to return. 
     */
    nextToken?: NextToken;
  }
  export interface ListManagedEndpointsResponse {
    /**
     * The managed endpoints to be listed.
     */
    endpoints?: Endpoints;
    /**
     *  The token for the next set of endpoints to return. 
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of tagged resources.
     */
    resourceArn: RsiArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags assigned to resources.
     */
    tags?: TagMap;
  }
  export interface ListVirtualClustersRequest {
    /**
     * The container provider ID of the virtual cluster.
     */
    containerProviderId?: String1024;
    /**
     * The container provider type of the virtual cluster. EKS is the only supported type as of now.
     */
    containerProviderType?: ContainerProviderType;
    /**
     * The date and time after which the virtual clusters are created.
     */
    createdAfter?: _Date;
    /**
     * The date and time before which the virtual clusters are created.
     */
    createdBefore?: _Date;
    /**
     * The states of the requested virtual clusters.
     */
    states?: VirtualClusterStates;
    /**
     * The maximum number of virtual clusters that can be listed.
     */
    maxResults?: JavaInteger;
    /**
     * The token for the next set of virtual clusters to return. 
     */
    nextToken?: NextToken;
  }
  export interface ListVirtualClustersResponse {
    /**
     * This output lists the specified virtual clusters.
     */
    virtualClusters?: VirtualClusters;
    /**
     * This output displays the token for the next set of virtual clusters.
     */
    nextToken?: NextToken;
  }
  export type LogGroupName = string;
  export interface MonitoringConfiguration {
    /**
     * Monitoring configurations for the persistent application UI. 
     */
    persistentAppUI?: PersistentAppUI;
    /**
     * Monitoring configurations for CloudWatch.
     */
    cloudWatchMonitoringConfiguration?: CloudWatchMonitoringConfiguration;
    /**
     * Amazon S3 configuration for monitoring log publishing.
     */
    s3MonitoringConfiguration?: S3MonitoringConfiguration;
  }
  export type NextToken = string;
  export type PersistentAppUI = "ENABLED"|"DISABLED"|string;
  export type ReleaseLabel = string;
  export type RequestIdentityUserArn = string;
  export type ResourceIdString = string;
  export type ResourceNameString = string;
  export type RsiArn = string;
  export interface S3MonitoringConfiguration {
    /**
     * Amazon S3 destination URI for log publishing.
     */
    logUri: UriString;
  }
  export type SensitivePropertiesMap = {[key: string]: String1024};
  export interface SparkSubmitJobDriver {
    /**
     * The entry point of job application.
     */
    entryPoint: EntryPointPath;
    /**
     * The arguments for job application.
     */
    entryPointArguments?: EntryPointArguments;
    /**
     * The Spark submit parameters that are used for job runs.
     */
    sparkSubmitParameters?: SparkSubmitParameters;
  }
  export type SparkSubmitParameters = string;
  export interface StartJobRunRequest {
    /**
     * The name of the job run.
     */
    name?: ResourceNameString;
    /**
     * The virtual cluster ID for which the job run request is submitted.
     */
    virtualClusterId: ResourceIdString;
    /**
     * The client idempotency token of the job run request. 
     */
    clientToken: ClientToken;
    /**
     * The execution role ARN for the job run.
     */
    executionRoleArn: IAMRoleArn;
    /**
     * The Amazon EMR release version to use for the job run.
     */
    releaseLabel: ReleaseLabel;
    /**
     * The job driver for the job run.
     */
    jobDriver: JobDriver;
    /**
     * The configuration overrides for the job run.
     */
    configurationOverrides?: ConfigurationOverrides;
    /**
     * The tags assigned to job runs.
     */
    tags?: TagMap;
  }
  export interface StartJobRunResponse {
    /**
     * This output displays the started job run ID.
     */
    id?: ResourceIdString;
    /**
     * This output displays the name of the started job run.
     */
    name?: ResourceNameString;
    /**
     * This output lists the ARN of job run.
     */
    arn?: JobArn;
    /**
     * This output displays the virtual cluster ID for which the job run was submitted.
     */
    virtualClusterId?: ResourceIdString;
  }
  export type String1024 = string;
  export type String128 = string;
  export type String256 = string;
  export type StringEmpty256 = string;
  export type SubnetIds = String256[];
  export type TagKeyList = String128[];
  export type TagMap = {[key: string]: StringEmpty256};
  export interface TagResourceRequest {
    /**
     * The ARN of resources.
     */
    resourceArn: RsiArn;
    /**
     * The tags assigned to resources.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export interface UntagResourceRequest {
    /**
     * The ARN of resources.
     */
    resourceArn: RsiArn;
    /**
     * The tag keys of the resources.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export type UriString = string;
  export interface VirtualCluster {
    /**
     * The ID of the virtual cluster.
     */
    id?: ResourceIdString;
    /**
     * The name of the virtual cluster.
     */
    name?: ResourceNameString;
    /**
     * The ARN of the virtual cluster.
     */
    arn?: VirtualClusterArn;
    /**
     * The state of the virtual cluster.
     */
    state?: VirtualClusterState;
    /**
     * The container provider of the virtual cluster.
     */
    containerProvider?: ContainerProvider;
    /**
     * The date and time when the virtual cluster is created.
     */
    createdAt?: _Date;
    /**
     * The assigned tags of the virtual cluster.
     */
    tags?: TagMap;
  }
  export type VirtualClusterArn = string;
  export type VirtualClusterState = "RUNNING"|"TERMINATING"|"TERMINATED"|"ARRESTED"|string;
  export type VirtualClusterStates = VirtualClusterState[];
  export type VirtualClusters = VirtualCluster[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-10-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the EMRcontainers client.
   */
  export import Types = EMRcontainers;
}
export = EMRcontainers;
