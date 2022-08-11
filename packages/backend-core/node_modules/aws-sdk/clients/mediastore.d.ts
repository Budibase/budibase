import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class MediaStore extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MediaStore.Types.ClientConfiguration)
  config: Config & MediaStore.Types.ClientConfiguration;
  /**
   * Creates a storage container to hold objects. A container is similar to a bucket in the Amazon S3 service.
   */
  createContainer(params: MediaStore.Types.CreateContainerInput, callback?: (err: AWSError, data: MediaStore.Types.CreateContainerOutput) => void): Request<MediaStore.Types.CreateContainerOutput, AWSError>;
  /**
   * Creates a storage container to hold objects. A container is similar to a bucket in the Amazon S3 service.
   */
  createContainer(callback?: (err: AWSError, data: MediaStore.Types.CreateContainerOutput) => void): Request<MediaStore.Types.CreateContainerOutput, AWSError>;
  /**
   * Deletes the specified container. Before you make a DeleteContainer request, delete any objects in the container or in any folders in the container. You can delete only empty containers. 
   */
  deleteContainer(params: MediaStore.Types.DeleteContainerInput, callback?: (err: AWSError, data: MediaStore.Types.DeleteContainerOutput) => void): Request<MediaStore.Types.DeleteContainerOutput, AWSError>;
  /**
   * Deletes the specified container. Before you make a DeleteContainer request, delete any objects in the container or in any folders in the container. You can delete only empty containers. 
   */
  deleteContainer(callback?: (err: AWSError, data: MediaStore.Types.DeleteContainerOutput) => void): Request<MediaStore.Types.DeleteContainerOutput, AWSError>;
  /**
   * Deletes the access policy that is associated with the specified container.
   */
  deleteContainerPolicy(params: MediaStore.Types.DeleteContainerPolicyInput, callback?: (err: AWSError, data: MediaStore.Types.DeleteContainerPolicyOutput) => void): Request<MediaStore.Types.DeleteContainerPolicyOutput, AWSError>;
  /**
   * Deletes the access policy that is associated with the specified container.
   */
  deleteContainerPolicy(callback?: (err: AWSError, data: MediaStore.Types.DeleteContainerPolicyOutput) => void): Request<MediaStore.Types.DeleteContainerPolicyOutput, AWSError>;
  /**
   * Deletes the cross-origin resource sharing (CORS) configuration information that is set for the container. To use this operation, you must have permission to perform the MediaStore:DeleteCorsPolicy action. The container owner has this permission by default and can grant this permission to others.
   */
  deleteCorsPolicy(params: MediaStore.Types.DeleteCorsPolicyInput, callback?: (err: AWSError, data: MediaStore.Types.DeleteCorsPolicyOutput) => void): Request<MediaStore.Types.DeleteCorsPolicyOutput, AWSError>;
  /**
   * Deletes the cross-origin resource sharing (CORS) configuration information that is set for the container. To use this operation, you must have permission to perform the MediaStore:DeleteCorsPolicy action. The container owner has this permission by default and can grant this permission to others.
   */
  deleteCorsPolicy(callback?: (err: AWSError, data: MediaStore.Types.DeleteCorsPolicyOutput) => void): Request<MediaStore.Types.DeleteCorsPolicyOutput, AWSError>;
  /**
   * Removes an object lifecycle policy from a container. It takes up to 20 minutes for the change to take effect.
   */
  deleteLifecyclePolicy(params: MediaStore.Types.DeleteLifecyclePolicyInput, callback?: (err: AWSError, data: MediaStore.Types.DeleteLifecyclePolicyOutput) => void): Request<MediaStore.Types.DeleteLifecyclePolicyOutput, AWSError>;
  /**
   * Removes an object lifecycle policy from a container. It takes up to 20 minutes for the change to take effect.
   */
  deleteLifecyclePolicy(callback?: (err: AWSError, data: MediaStore.Types.DeleteLifecyclePolicyOutput) => void): Request<MediaStore.Types.DeleteLifecyclePolicyOutput, AWSError>;
  /**
   * Deletes the metric policy that is associated with the specified container. If there is no metric policy associated with the container, MediaStore doesn't send metrics to CloudWatch.
   */
  deleteMetricPolicy(params: MediaStore.Types.DeleteMetricPolicyInput, callback?: (err: AWSError, data: MediaStore.Types.DeleteMetricPolicyOutput) => void): Request<MediaStore.Types.DeleteMetricPolicyOutput, AWSError>;
  /**
   * Deletes the metric policy that is associated with the specified container. If there is no metric policy associated with the container, MediaStore doesn't send metrics to CloudWatch.
   */
  deleteMetricPolicy(callback?: (err: AWSError, data: MediaStore.Types.DeleteMetricPolicyOutput) => void): Request<MediaStore.Types.DeleteMetricPolicyOutput, AWSError>;
  /**
   * Retrieves the properties of the requested container. This request is commonly used to retrieve the endpoint of a container. An endpoint is a value assigned by the service when a new container is created. A container's endpoint does not change after it has been assigned. The DescribeContainer request returns a single Container object based on ContainerName. To return all Container objects that are associated with a specified AWS account, use ListContainers.
   */
  describeContainer(params: MediaStore.Types.DescribeContainerInput, callback?: (err: AWSError, data: MediaStore.Types.DescribeContainerOutput) => void): Request<MediaStore.Types.DescribeContainerOutput, AWSError>;
  /**
   * Retrieves the properties of the requested container. This request is commonly used to retrieve the endpoint of a container. An endpoint is a value assigned by the service when a new container is created. A container's endpoint does not change after it has been assigned. The DescribeContainer request returns a single Container object based on ContainerName. To return all Container objects that are associated with a specified AWS account, use ListContainers.
   */
  describeContainer(callback?: (err: AWSError, data: MediaStore.Types.DescribeContainerOutput) => void): Request<MediaStore.Types.DescribeContainerOutput, AWSError>;
  /**
   * Retrieves the access policy for the specified container. For information about the data that is included in an access policy, see the AWS Identity and Access Management User Guide.
   */
  getContainerPolicy(params: MediaStore.Types.GetContainerPolicyInput, callback?: (err: AWSError, data: MediaStore.Types.GetContainerPolicyOutput) => void): Request<MediaStore.Types.GetContainerPolicyOutput, AWSError>;
  /**
   * Retrieves the access policy for the specified container. For information about the data that is included in an access policy, see the AWS Identity and Access Management User Guide.
   */
  getContainerPolicy(callback?: (err: AWSError, data: MediaStore.Types.GetContainerPolicyOutput) => void): Request<MediaStore.Types.GetContainerPolicyOutput, AWSError>;
  /**
   * Returns the cross-origin resource sharing (CORS) configuration information that is set for the container. To use this operation, you must have permission to perform the MediaStore:GetCorsPolicy action. By default, the container owner has this permission and can grant it to others.
   */
  getCorsPolicy(params: MediaStore.Types.GetCorsPolicyInput, callback?: (err: AWSError, data: MediaStore.Types.GetCorsPolicyOutput) => void): Request<MediaStore.Types.GetCorsPolicyOutput, AWSError>;
  /**
   * Returns the cross-origin resource sharing (CORS) configuration information that is set for the container. To use this operation, you must have permission to perform the MediaStore:GetCorsPolicy action. By default, the container owner has this permission and can grant it to others.
   */
  getCorsPolicy(callback?: (err: AWSError, data: MediaStore.Types.GetCorsPolicyOutput) => void): Request<MediaStore.Types.GetCorsPolicyOutput, AWSError>;
  /**
   * Retrieves the object lifecycle policy that is assigned to a container.
   */
  getLifecyclePolicy(params: MediaStore.Types.GetLifecyclePolicyInput, callback?: (err: AWSError, data: MediaStore.Types.GetLifecyclePolicyOutput) => void): Request<MediaStore.Types.GetLifecyclePolicyOutput, AWSError>;
  /**
   * Retrieves the object lifecycle policy that is assigned to a container.
   */
  getLifecyclePolicy(callback?: (err: AWSError, data: MediaStore.Types.GetLifecyclePolicyOutput) => void): Request<MediaStore.Types.GetLifecyclePolicyOutput, AWSError>;
  /**
   * Returns the metric policy for the specified container. 
   */
  getMetricPolicy(params: MediaStore.Types.GetMetricPolicyInput, callback?: (err: AWSError, data: MediaStore.Types.GetMetricPolicyOutput) => void): Request<MediaStore.Types.GetMetricPolicyOutput, AWSError>;
  /**
   * Returns the metric policy for the specified container. 
   */
  getMetricPolicy(callback?: (err: AWSError, data: MediaStore.Types.GetMetricPolicyOutput) => void): Request<MediaStore.Types.GetMetricPolicyOutput, AWSError>;
  /**
   * Lists the properties of all containers in AWS Elemental MediaStore.  You can query to receive all the containers in one response. Or you can include the MaxResults parameter to receive a limited number of containers in each response. In this case, the response includes a token. To get the next set of containers, send the command again, this time with the NextToken parameter (with the returned token as its value). The next set of responses appears, with a token if there are still more containers to receive.  See also DescribeContainer, which gets the properties of one container. 
   */
  listContainers(params: MediaStore.Types.ListContainersInput, callback?: (err: AWSError, data: MediaStore.Types.ListContainersOutput) => void): Request<MediaStore.Types.ListContainersOutput, AWSError>;
  /**
   * Lists the properties of all containers in AWS Elemental MediaStore.  You can query to receive all the containers in one response. Or you can include the MaxResults parameter to receive a limited number of containers in each response. In this case, the response includes a token. To get the next set of containers, send the command again, this time with the NextToken parameter (with the returned token as its value). The next set of responses appears, with a token if there are still more containers to receive.  See also DescribeContainer, which gets the properties of one container. 
   */
  listContainers(callback?: (err: AWSError, data: MediaStore.Types.ListContainersOutput) => void): Request<MediaStore.Types.ListContainersOutput, AWSError>;
  /**
   * Returns a list of the tags assigned to the specified container. 
   */
  listTagsForResource(params: MediaStore.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: MediaStore.Types.ListTagsForResourceOutput) => void): Request<MediaStore.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Returns a list of the tags assigned to the specified container. 
   */
  listTagsForResource(callback?: (err: AWSError, data: MediaStore.Types.ListTagsForResourceOutput) => void): Request<MediaStore.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Creates an access policy for the specified container to restrict the users and clients that can access it. For information about the data that is included in an access policy, see the AWS Identity and Access Management User Guide. For this release of the REST API, you can create only one policy for a container. If you enter PutContainerPolicy twice, the second command modifies the existing policy. 
   */
  putContainerPolicy(params: MediaStore.Types.PutContainerPolicyInput, callback?: (err: AWSError, data: MediaStore.Types.PutContainerPolicyOutput) => void): Request<MediaStore.Types.PutContainerPolicyOutput, AWSError>;
  /**
   * Creates an access policy for the specified container to restrict the users and clients that can access it. For information about the data that is included in an access policy, see the AWS Identity and Access Management User Guide. For this release of the REST API, you can create only one policy for a container. If you enter PutContainerPolicy twice, the second command modifies the existing policy. 
   */
  putContainerPolicy(callback?: (err: AWSError, data: MediaStore.Types.PutContainerPolicyOutput) => void): Request<MediaStore.Types.PutContainerPolicyOutput, AWSError>;
  /**
   * Sets the cross-origin resource sharing (CORS) configuration on a container so that the container can service cross-origin requests. For example, you might want to enable a request whose origin is http://www.example.com to access your AWS Elemental MediaStore container at my.example.container.com by using the browser's XMLHttpRequest capability. To enable CORS on a container, you attach a CORS policy to the container. In the CORS policy, you configure rules that identify origins and the HTTP methods that can be executed on your container. The policy can contain up to 398,000 characters. You can add up to 100 rules to a CORS policy. If more than one rule applies, the service uses the first applicable rule listed. To learn more about CORS, see Cross-Origin Resource Sharing (CORS) in AWS Elemental MediaStore.
   */
  putCorsPolicy(params: MediaStore.Types.PutCorsPolicyInput, callback?: (err: AWSError, data: MediaStore.Types.PutCorsPolicyOutput) => void): Request<MediaStore.Types.PutCorsPolicyOutput, AWSError>;
  /**
   * Sets the cross-origin resource sharing (CORS) configuration on a container so that the container can service cross-origin requests. For example, you might want to enable a request whose origin is http://www.example.com to access your AWS Elemental MediaStore container at my.example.container.com by using the browser's XMLHttpRequest capability. To enable CORS on a container, you attach a CORS policy to the container. In the CORS policy, you configure rules that identify origins and the HTTP methods that can be executed on your container. The policy can contain up to 398,000 characters. You can add up to 100 rules to a CORS policy. If more than one rule applies, the service uses the first applicable rule listed. To learn more about CORS, see Cross-Origin Resource Sharing (CORS) in AWS Elemental MediaStore.
   */
  putCorsPolicy(callback?: (err: AWSError, data: MediaStore.Types.PutCorsPolicyOutput) => void): Request<MediaStore.Types.PutCorsPolicyOutput, AWSError>;
  /**
   * Writes an object lifecycle policy to a container. If the container already has an object lifecycle policy, the service replaces the existing policy with the new policy. It takes up to 20 minutes for the change to take effect. For information about how to construct an object lifecycle policy, see Components of an Object Lifecycle Policy.
   */
  putLifecyclePolicy(params: MediaStore.Types.PutLifecyclePolicyInput, callback?: (err: AWSError, data: MediaStore.Types.PutLifecyclePolicyOutput) => void): Request<MediaStore.Types.PutLifecyclePolicyOutput, AWSError>;
  /**
   * Writes an object lifecycle policy to a container. If the container already has an object lifecycle policy, the service replaces the existing policy with the new policy. It takes up to 20 minutes for the change to take effect. For information about how to construct an object lifecycle policy, see Components of an Object Lifecycle Policy.
   */
  putLifecyclePolicy(callback?: (err: AWSError, data: MediaStore.Types.PutLifecyclePolicyOutput) => void): Request<MediaStore.Types.PutLifecyclePolicyOutput, AWSError>;
  /**
   * The metric policy that you want to add to the container. A metric policy allows AWS Elemental MediaStore to send metrics to Amazon CloudWatch. It takes up to 20 minutes for the new policy to take effect.
   */
  putMetricPolicy(params: MediaStore.Types.PutMetricPolicyInput, callback?: (err: AWSError, data: MediaStore.Types.PutMetricPolicyOutput) => void): Request<MediaStore.Types.PutMetricPolicyOutput, AWSError>;
  /**
   * The metric policy that you want to add to the container. A metric policy allows AWS Elemental MediaStore to send metrics to Amazon CloudWatch. It takes up to 20 minutes for the new policy to take effect.
   */
  putMetricPolicy(callback?: (err: AWSError, data: MediaStore.Types.PutMetricPolicyOutput) => void): Request<MediaStore.Types.PutMetricPolicyOutput, AWSError>;
  /**
   * Starts access logging on the specified container. When you enable access logging on a container, MediaStore delivers access logs for objects stored in that container to Amazon CloudWatch Logs.
   */
  startAccessLogging(params: MediaStore.Types.StartAccessLoggingInput, callback?: (err: AWSError, data: MediaStore.Types.StartAccessLoggingOutput) => void): Request<MediaStore.Types.StartAccessLoggingOutput, AWSError>;
  /**
   * Starts access logging on the specified container. When you enable access logging on a container, MediaStore delivers access logs for objects stored in that container to Amazon CloudWatch Logs.
   */
  startAccessLogging(callback?: (err: AWSError, data: MediaStore.Types.StartAccessLoggingOutput) => void): Request<MediaStore.Types.StartAccessLoggingOutput, AWSError>;
  /**
   * Stops access logging on the specified container. When you stop access logging on a container, MediaStore stops sending access logs to Amazon CloudWatch Logs. These access logs are not saved and are not retrievable.
   */
  stopAccessLogging(params: MediaStore.Types.StopAccessLoggingInput, callback?: (err: AWSError, data: MediaStore.Types.StopAccessLoggingOutput) => void): Request<MediaStore.Types.StopAccessLoggingOutput, AWSError>;
  /**
   * Stops access logging on the specified container. When you stop access logging on a container, MediaStore stops sending access logs to Amazon CloudWatch Logs. These access logs are not saved and are not retrievable.
   */
  stopAccessLogging(callback?: (err: AWSError, data: MediaStore.Types.StopAccessLoggingOutput) => void): Request<MediaStore.Types.StopAccessLoggingOutput, AWSError>;
  /**
   * Adds tags to the specified AWS Elemental MediaStore container. Tags are key:value pairs that you can associate with AWS resources. For example, the tag key might be "customer" and the tag value might be "companyA." You can specify one or more tags to add to each container. You can add up to 50 tags to each container. For more information about tagging, including naming and usage conventions, see Tagging Resources in MediaStore.
   */
  tagResource(params: MediaStore.Types.TagResourceInput, callback?: (err: AWSError, data: MediaStore.Types.TagResourceOutput) => void): Request<MediaStore.Types.TagResourceOutput, AWSError>;
  /**
   * Adds tags to the specified AWS Elemental MediaStore container. Tags are key:value pairs that you can associate with AWS resources. For example, the tag key might be "customer" and the tag value might be "companyA." You can specify one or more tags to add to each container. You can add up to 50 tags to each container. For more information about tagging, including naming and usage conventions, see Tagging Resources in MediaStore.
   */
  tagResource(callback?: (err: AWSError, data: MediaStore.Types.TagResourceOutput) => void): Request<MediaStore.Types.TagResourceOutput, AWSError>;
  /**
   * Removes tags from the specified container. You can specify one or more tags to remove. 
   */
  untagResource(params: MediaStore.Types.UntagResourceInput, callback?: (err: AWSError, data: MediaStore.Types.UntagResourceOutput) => void): Request<MediaStore.Types.UntagResourceOutput, AWSError>;
  /**
   * Removes tags from the specified container. You can specify one or more tags to remove. 
   */
  untagResource(callback?: (err: AWSError, data: MediaStore.Types.UntagResourceOutput) => void): Request<MediaStore.Types.UntagResourceOutput, AWSError>;
}
declare namespace MediaStore {
  export type AllowedHeaders = Header[];
  export type AllowedMethods = MethodName[];
  export type AllowedOrigins = Origin[];
  export interface Container {
    /**
     * The DNS endpoint of the container. Use the endpoint to identify the specific container when sending requests to the data plane. The service assigns this value when the container is created. Once the value has been assigned, it does not change.
     */
    Endpoint?: Endpoint;
    /**
     * Unix timestamp.
     */
    CreationTime?: TimeStamp;
    /**
     * The Amazon Resource Name (ARN) of the container. The ARN has the following format: arn:aws:&lt;region&gt;:&lt;account that owns this container&gt;:container/&lt;name of container&gt;  For example: arn:aws:mediastore:us-west-2:111122223333:container/movies 
     */
    ARN?: ContainerARN;
    /**
     * The name of the container.
     */
    Name?: ContainerName;
    /**
     * The status of container creation or deletion. The status is one of the following: CREATING, ACTIVE, or DELETING. While the service is creating the container, the status is CREATING. When the endpoint is available, the status changes to ACTIVE.
     */
    Status?: ContainerStatus;
    /**
     * The state of access logging on the container. This value is false by default, indicating that AWS Elemental MediaStore does not send access logs to Amazon CloudWatch Logs. When you enable access logging on the container, MediaStore changes this value to true, indicating that the service delivers access logs for objects stored in that container to CloudWatch Logs.
     */
    AccessLoggingEnabled?: ContainerAccessLoggingEnabled;
  }
  export type ContainerARN = string;
  export type ContainerAccessLoggingEnabled = boolean;
  export type ContainerLevelMetrics = "ENABLED"|"DISABLED"|string;
  export type ContainerList = Container[];
  export type ContainerListLimit = number;
  export type ContainerName = string;
  export type ContainerPolicy = string;
  export type ContainerStatus = "ACTIVE"|"CREATING"|"DELETING"|string;
  export type CorsPolicy = CorsRule[];
  export interface CorsRule {
    /**
     * One or more response headers that you want users to be able to access from their applications (for example, from a JavaScript XMLHttpRequest object). Each CORS rule must have at least one AllowedOrigins element. The string value can include only one wildcard character (*), for example, http://*.example.com. Additionally, you can specify only one wildcard character to allow cross-origin access for all origins.
     */
    AllowedOrigins: AllowedOrigins;
    /**
     * Identifies an HTTP method that the origin that is specified in the rule is allowed to execute. Each CORS rule must contain at least one AllowedMethods and one AllowedOrigins element.
     */
    AllowedMethods?: AllowedMethods;
    /**
     * Specifies which headers are allowed in a preflight OPTIONS request through the Access-Control-Request-Headers header. Each header name that is specified in Access-Control-Request-Headers must have a corresponding entry in the rule. Only the headers that were requested are sent back.  This element can contain only one wildcard character (*).
     */
    AllowedHeaders: AllowedHeaders;
    /**
     * The time in seconds that your browser caches the preflight response for the specified resource. A CORS rule can have only one MaxAgeSeconds element.
     */
    MaxAgeSeconds?: MaxAgeSeconds;
    /**
     * One or more headers in the response that you want users to be able to access from their applications (for example, from a JavaScript XMLHttpRequest object). This element is optional for each rule.
     */
    ExposeHeaders?: ExposeHeaders;
  }
  export interface CreateContainerInput {
    /**
     * The name for the container. The name must be from 1 to 255 characters. Container names must be unique to your AWS account within a specific region. As an example, you could create a container named movies in every region, as long as you don’t have an existing container with that name.
     */
    ContainerName: ContainerName;
    /**
     * An array of key:value pairs that you define. These values can be anything that you want. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each container. For more information about tagging, including naming and usage conventions, see Tagging Resources in MediaStore.
     */
    Tags?: TagList;
  }
  export interface CreateContainerOutput {
    /**
     * ContainerARN: The Amazon Resource Name (ARN) of the newly created container. The ARN has the following format: arn:aws:&lt;region&gt;:&lt;account that owns this container&gt;:container/&lt;name of container&gt;. For example: arn:aws:mediastore:us-west-2:111122223333:container/movies  ContainerName: The container name as specified in the request. CreationTime: Unix time stamp. Status: The status of container creation or deletion. The status is one of the following: CREATING, ACTIVE, or DELETING. While the service is creating the container, the status is CREATING. When an endpoint is available, the status changes to ACTIVE. The return value does not include the container's endpoint. To make downstream requests, you must obtain this value by using DescribeContainer or ListContainers.
     */
    Container: Container;
  }
  export interface DeleteContainerInput {
    /**
     * The name of the container to delete. 
     */
    ContainerName: ContainerName;
  }
  export interface DeleteContainerOutput {
  }
  export interface DeleteContainerPolicyInput {
    /**
     * The name of the container that holds the policy.
     */
    ContainerName: ContainerName;
  }
  export interface DeleteContainerPolicyOutput {
  }
  export interface DeleteCorsPolicyInput {
    /**
     * The name of the container to remove the policy from.
     */
    ContainerName: ContainerName;
  }
  export interface DeleteCorsPolicyOutput {
  }
  export interface DeleteLifecyclePolicyInput {
    /**
     * The name of the container that holds the object lifecycle policy.
     */
    ContainerName: ContainerName;
  }
  export interface DeleteLifecyclePolicyOutput {
  }
  export interface DeleteMetricPolicyInput {
    /**
     * The name of the container that is associated with the metric policy that you want to delete.
     */
    ContainerName: ContainerName;
  }
  export interface DeleteMetricPolicyOutput {
  }
  export interface DescribeContainerInput {
    /**
     * The name of the container to query.
     */
    ContainerName?: ContainerName;
  }
  export interface DescribeContainerOutput {
    /**
     * The name of the queried container.
     */
    Container?: Container;
  }
  export type Endpoint = string;
  export type ExposeHeaders = Header[];
  export interface GetContainerPolicyInput {
    /**
     * The name of the container. 
     */
    ContainerName: ContainerName;
  }
  export interface GetContainerPolicyOutput {
    /**
     * The contents of the access policy.
     */
    Policy: ContainerPolicy;
  }
  export interface GetCorsPolicyInput {
    /**
     * The name of the container that the policy is assigned to.
     */
    ContainerName: ContainerName;
  }
  export interface GetCorsPolicyOutput {
    /**
     * The CORS policy assigned to the container.
     */
    CorsPolicy: CorsPolicy;
  }
  export interface GetLifecyclePolicyInput {
    /**
     * The name of the container that the object lifecycle policy is assigned to.
     */
    ContainerName: ContainerName;
  }
  export interface GetLifecyclePolicyOutput {
    /**
     * The object lifecycle policy that is assigned to the container.
     */
    LifecyclePolicy: LifecyclePolicy;
  }
  export interface GetMetricPolicyInput {
    /**
     * The name of the container that is associated with the metric policy.
     */
    ContainerName: ContainerName;
  }
  export interface GetMetricPolicyOutput {
    /**
     * The metric policy that is associated with the specific container.
     */
    MetricPolicy: MetricPolicy;
  }
  export type Header = string;
  export type LifecyclePolicy = string;
  export interface ListContainersInput {
    /**
     * Only if you used MaxResults in the first command, enter the token (which was included in the previous response) to obtain the next set of containers. This token is included in a response only if there actually are more containers to list.
     */
    NextToken?: PaginationToken;
    /**
     * Enter the maximum number of containers in the response. Use from 1 to 255 characters. 
     */
    MaxResults?: ContainerListLimit;
  }
  export interface ListContainersOutput {
    /**
     * The names of the containers.
     */
    Containers: ContainerList;
    /**
     *  NextToken is the token to use in the next call to ListContainers. This token is returned only if you included the MaxResults tag in the original command, and only if there are still containers to return. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListTagsForResourceInput {
    /**
     * The Amazon Resource Name (ARN) for the container.
     */
    Resource: ContainerARN;
  }
  export interface ListTagsForResourceOutput {
    /**
     * An array of key:value pairs that are assigned to the container.
     */
    Tags?: TagList;
  }
  export type MaxAgeSeconds = number;
  export type MethodName = "PUT"|"GET"|"DELETE"|"HEAD"|string;
  export interface MetricPolicy {
    /**
     * A setting to enable or disable metrics at the container level.
     */
    ContainerLevelMetrics: ContainerLevelMetrics;
    /**
     * A parameter that holds an array of rules that enable metrics at the object level. This parameter is optional, but if you choose to include it, you must also include at least one rule. By default, you can include up to five rules. You can also request a quota increase to allow up to 300 rules per policy.
     */
    MetricPolicyRules?: MetricPolicyRules;
  }
  export interface MetricPolicyRule {
    /**
     * A path or file name that defines which objects to include in the group. Wildcards (*) are acceptable.
     */
    ObjectGroup: ObjectGroup;
    /**
     * A name that allows you to refer to the object group.
     */
    ObjectGroupName: ObjectGroupName;
  }
  export type MetricPolicyRules = MetricPolicyRule[];
  export type ObjectGroup = string;
  export type ObjectGroupName = string;
  export type Origin = string;
  export type PaginationToken = string;
  export interface PutContainerPolicyInput {
    /**
     * The name of the container.
     */
    ContainerName: ContainerName;
    /**
     * The contents of the policy, which includes the following:    One Version tag   One Statement tag that contains the standard tags for the policy.  
     */
    Policy: ContainerPolicy;
  }
  export interface PutContainerPolicyOutput {
  }
  export interface PutCorsPolicyInput {
    /**
     * The name of the container that you want to assign the CORS policy to.
     */
    ContainerName: ContainerName;
    /**
     * The CORS policy to apply to the container. 
     */
    CorsPolicy: CorsPolicy;
  }
  export interface PutCorsPolicyOutput {
  }
  export interface PutLifecyclePolicyInput {
    /**
     * The name of the container that you want to assign the object lifecycle policy to.
     */
    ContainerName: ContainerName;
    /**
     * The object lifecycle policy to apply to the container.
     */
    LifecyclePolicy: LifecyclePolicy;
  }
  export interface PutLifecyclePolicyOutput {
  }
  export interface PutMetricPolicyInput {
    /**
     * The name of the container that you want to add the metric policy to.
     */
    ContainerName: ContainerName;
    /**
     * The metric policy that you want to associate with the container. In the policy, you must indicate whether you want MediaStore to send container-level metrics. You can also include up to five rules to define groups of objects that you want MediaStore to send object-level metrics for. If you include rules in the policy, construct each rule with both of the following:   An object group that defines which objects to include in the group. The definition can be a path or a file name, but it can't have more than 900 characters. Valid characters are: a-z, A-Z, 0-9, _ (underscore), = (equal), : (colon), . (period), - (hyphen), ~ (tilde), / (forward slash), and * (asterisk). Wildcards (*) are acceptable.   An object group name that allows you to refer to the object group. The name can't have more than 30 characters. Valid characters are: a-z, A-Z, 0-9, and _ (underscore).  
     */
    MetricPolicy: MetricPolicy;
  }
  export interface PutMetricPolicyOutput {
  }
  export interface StartAccessLoggingInput {
    /**
     * The name of the container that you want to start access logging on.
     */
    ContainerName: ContainerName;
  }
  export interface StartAccessLoggingOutput {
  }
  export interface StopAccessLoggingInput {
    /**
     * The name of the container that you want to stop access logging on.
     */
    ContainerName: ContainerName;
  }
  export interface StopAccessLoggingOutput {
  }
  export interface Tag {
    /**
     * Part of the key:value pair that defines a tag. You can use a tag key to describe a category of information, such as "customer." Tag keys are case-sensitive.
     */
    Key: TagKey;
    /**
     * Part of the key:value pair that defines a tag. You can use a tag value to describe a specific value within a category, such as "companyA" or "companyB." Tag values are case-sensitive.
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceInput {
    /**
     * The Amazon Resource Name (ARN) for the container. 
     */
    Resource: ContainerARN;
    /**
     * An array of key:value pairs that you want to add to the container. You need to specify only the tags that you want to add or update. For example, suppose a container already has two tags (customer:CompanyA and priority:High). You want to change the priority tag and also add a third tag (type:Contract). For TagResource, you specify the following tags: priority:Medium, type:Contract. The result is that your container has three tags: customer:CompanyA, priority:Medium, and type:Contract.
     */
    Tags: TagList;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
  export type TimeStamp = Date;
  export interface UntagResourceInput {
    /**
     * The Amazon Resource Name (ARN) for the container.
     */
    Resource: ContainerARN;
    /**
     * A comma-separated list of keys for tags that you want to remove from the container. For example, if your container has two tags (customer:CompanyA and priority:High) and you want to remove one of the tags (priority:High), you specify the key for the tag that you want to remove (priority).
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceOutput {
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-09-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MediaStore client.
   */
  export import Types = MediaStore;
}
export = MediaStore;
