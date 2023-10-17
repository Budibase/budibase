import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Batch extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Batch.Types.ClientConfiguration)
  config: Config & Batch.Types.ClientConfiguration;
  /**
   * Cancels a job in an Batch job queue. Jobs that are in the SUBMITTED or PENDING are canceled. A job inRUNNABLE remains in RUNNABLE until it reaches the head of the job queue. Then the job status is updated to FAILED.  A PENDING job is canceled after all dependency jobs are completed. Therefore, it may take longer than expected to cancel a job in PENDING status. When you try to cancel an array parent job in PENDING, Batch attempts to cancel all child jobs. The array parent job is canceled when all child jobs are completed.  Jobs that progressed to the STARTING or RUNNING state aren't canceled. However, the API operation still succeeds, even if no job is canceled. These jobs must be terminated with the TerminateJob operation.
   */
  cancelJob(params: Batch.Types.CancelJobRequest, callback?: (err: AWSError, data: Batch.Types.CancelJobResponse) => void): Request<Batch.Types.CancelJobResponse, AWSError>;
  /**
   * Cancels a job in an Batch job queue. Jobs that are in the SUBMITTED or PENDING are canceled. A job inRUNNABLE remains in RUNNABLE until it reaches the head of the job queue. Then the job status is updated to FAILED.  A PENDING job is canceled after all dependency jobs are completed. Therefore, it may take longer than expected to cancel a job in PENDING status. When you try to cancel an array parent job in PENDING, Batch attempts to cancel all child jobs. The array parent job is canceled when all child jobs are completed.  Jobs that progressed to the STARTING or RUNNING state aren't canceled. However, the API operation still succeeds, even if no job is canceled. These jobs must be terminated with the TerminateJob operation.
   */
  cancelJob(callback?: (err: AWSError, data: Batch.Types.CancelJobResponse) => void): Request<Batch.Types.CancelJobResponse, AWSError>;
  /**
   * Creates an Batch compute environment. You can create MANAGED or UNMANAGED compute environments. MANAGED compute environments can use Amazon EC2 or Fargate resources. UNMANAGED compute environments can only use EC2 resources. In a managed compute environment, Batch manages the capacity and instance types of the compute resources within the environment. This is based on the compute resource specification that you define or the launch template that you specify when you create the compute environment. Either, you can choose to use EC2 On-Demand Instances and EC2 Spot Instances. Or, you can use Fargate and Fargate Spot capacity in your managed compute environment. You can optionally set a maximum price so that Spot Instances only launch when the Spot Instance price is less than a specified percentage of the On-Demand price.  Multi-node parallel jobs aren't supported on Spot Instances.  In an unmanaged compute environment, you can manage your own EC2 compute resources and have flexibility with how you configure your compute resources. For example, you can use custom AMIs. However, you must verify that each of your AMIs meet the Amazon ECS container instance AMI specification. For more information, see container instance AMIs in the Amazon Elastic Container Service Developer Guide. After you created your unmanaged compute environment, you can use the DescribeComputeEnvironments operation to find the Amazon ECS cluster that's associated with it. Then, launch your container instances into that Amazon ECS cluster. For more information, see Launching an Amazon ECS container instance in the Amazon Elastic Container Service Developer Guide.  To create a compute environment that uses EKS resources, the caller must have permissions to call eks:DescribeCluster.   Batch doesn't automatically upgrade the AMIs in a compute environment after it's created. For example, it also doesn't update the AMIs in your compute environment when a newer version of the Amazon ECS optimized AMI is available. You're responsible for the management of the guest operating system. This includes any updates and security patches. You're also responsible for any additional application software or utilities that you install on the compute resources. There are two ways to use a new AMI for your Batch jobs. The original method is to complete these steps:   Create a new compute environment with the new AMI.   Add the compute environment to an existing job queue.   Remove the earlier compute environment from your job queue.   Delete the earlier compute environment.   In April 2022, Batch added enhanced support for updating compute environments. For more information, see Updating compute environments. To use the enhanced updating of compute environments to update AMIs, follow these rules:   Either don't set the service role (serviceRole) parameter or set it to the AWSBatchServiceRole service-linked role.   Set the allocation strategy (allocationStrategy) parameter to BEST_FIT_PROGRESSIVE, SPOT_CAPACITY_OPTIMIZED, or SPOT_PRICE_CAPACITY_OPTIMIZED.   Set the update to latest image version (updateToLatestImageVersion) parameter to true. The updateToLatestImageVersion parameter is used when you update a compute environment. This parameter is ignored when you create a compute environment.   Don't specify an AMI ID in imageId, imageIdOverride (in  ec2Configuration ), or in the launch template (launchTemplate). In that case, Batch selects the latest Amazon ECS optimized AMI that's supported by Batch at the time the infrastructure update is initiated. Alternatively, you can specify the AMI ID in the imageId or imageIdOverride parameters, or the launch template identified by the LaunchTemplate properties. Changing any of these properties starts an infrastructure update. If the AMI ID is specified in the launch template, it can't be replaced by specifying an AMI ID in either the imageId or imageIdOverride parameters. It can only be replaced by specifying a different launch template, or if the launch template version is set to $Default or $Latest, by setting either a new default version for the launch template (if $Default) or by adding a new version to the launch template (if $Latest).   If these rules are followed, any update that starts an infrastructure update causes the AMI ID to be re-selected. If the version setting in the launch template (launchTemplate) is set to $Latest or $Default, the latest or default version of the launch template is evaluated up at the time of the infrastructure update, even if the launchTemplate wasn't updated. 
   */
  createComputeEnvironment(params: Batch.Types.CreateComputeEnvironmentRequest, callback?: (err: AWSError, data: Batch.Types.CreateComputeEnvironmentResponse) => void): Request<Batch.Types.CreateComputeEnvironmentResponse, AWSError>;
  /**
   * Creates an Batch compute environment. You can create MANAGED or UNMANAGED compute environments. MANAGED compute environments can use Amazon EC2 or Fargate resources. UNMANAGED compute environments can only use EC2 resources. In a managed compute environment, Batch manages the capacity and instance types of the compute resources within the environment. This is based on the compute resource specification that you define or the launch template that you specify when you create the compute environment. Either, you can choose to use EC2 On-Demand Instances and EC2 Spot Instances. Or, you can use Fargate and Fargate Spot capacity in your managed compute environment. You can optionally set a maximum price so that Spot Instances only launch when the Spot Instance price is less than a specified percentage of the On-Demand price.  Multi-node parallel jobs aren't supported on Spot Instances.  In an unmanaged compute environment, you can manage your own EC2 compute resources and have flexibility with how you configure your compute resources. For example, you can use custom AMIs. However, you must verify that each of your AMIs meet the Amazon ECS container instance AMI specification. For more information, see container instance AMIs in the Amazon Elastic Container Service Developer Guide. After you created your unmanaged compute environment, you can use the DescribeComputeEnvironments operation to find the Amazon ECS cluster that's associated with it. Then, launch your container instances into that Amazon ECS cluster. For more information, see Launching an Amazon ECS container instance in the Amazon Elastic Container Service Developer Guide.  To create a compute environment that uses EKS resources, the caller must have permissions to call eks:DescribeCluster.   Batch doesn't automatically upgrade the AMIs in a compute environment after it's created. For example, it also doesn't update the AMIs in your compute environment when a newer version of the Amazon ECS optimized AMI is available. You're responsible for the management of the guest operating system. This includes any updates and security patches. You're also responsible for any additional application software or utilities that you install on the compute resources. There are two ways to use a new AMI for your Batch jobs. The original method is to complete these steps:   Create a new compute environment with the new AMI.   Add the compute environment to an existing job queue.   Remove the earlier compute environment from your job queue.   Delete the earlier compute environment.   In April 2022, Batch added enhanced support for updating compute environments. For more information, see Updating compute environments. To use the enhanced updating of compute environments to update AMIs, follow these rules:   Either don't set the service role (serviceRole) parameter or set it to the AWSBatchServiceRole service-linked role.   Set the allocation strategy (allocationStrategy) parameter to BEST_FIT_PROGRESSIVE, SPOT_CAPACITY_OPTIMIZED, or SPOT_PRICE_CAPACITY_OPTIMIZED.   Set the update to latest image version (updateToLatestImageVersion) parameter to true. The updateToLatestImageVersion parameter is used when you update a compute environment. This parameter is ignored when you create a compute environment.   Don't specify an AMI ID in imageId, imageIdOverride (in  ec2Configuration ), or in the launch template (launchTemplate). In that case, Batch selects the latest Amazon ECS optimized AMI that's supported by Batch at the time the infrastructure update is initiated. Alternatively, you can specify the AMI ID in the imageId or imageIdOverride parameters, or the launch template identified by the LaunchTemplate properties. Changing any of these properties starts an infrastructure update. If the AMI ID is specified in the launch template, it can't be replaced by specifying an AMI ID in either the imageId or imageIdOverride parameters. It can only be replaced by specifying a different launch template, or if the launch template version is set to $Default or $Latest, by setting either a new default version for the launch template (if $Default) or by adding a new version to the launch template (if $Latest).   If these rules are followed, any update that starts an infrastructure update causes the AMI ID to be re-selected. If the version setting in the launch template (launchTemplate) is set to $Latest or $Default, the latest or default version of the launch template is evaluated up at the time of the infrastructure update, even if the launchTemplate wasn't updated. 
   */
  createComputeEnvironment(callback?: (err: AWSError, data: Batch.Types.CreateComputeEnvironmentResponse) => void): Request<Batch.Types.CreateComputeEnvironmentResponse, AWSError>;
  /**
   * Creates an Batch job queue. When you create a job queue, you associate one or more compute environments to the queue and assign an order of preference for the compute environments. You also set a priority to the job queue that determines the order that the Batch scheduler places jobs onto its associated compute environments. For example, if a compute environment is associated with more than one job queue, the job queue with a higher priority is given preference for scheduling jobs to that compute environment.
   */
  createJobQueue(params: Batch.Types.CreateJobQueueRequest, callback?: (err: AWSError, data: Batch.Types.CreateJobQueueResponse) => void): Request<Batch.Types.CreateJobQueueResponse, AWSError>;
  /**
   * Creates an Batch job queue. When you create a job queue, you associate one or more compute environments to the queue and assign an order of preference for the compute environments. You also set a priority to the job queue that determines the order that the Batch scheduler places jobs onto its associated compute environments. For example, if a compute environment is associated with more than one job queue, the job queue with a higher priority is given preference for scheduling jobs to that compute environment.
   */
  createJobQueue(callback?: (err: AWSError, data: Batch.Types.CreateJobQueueResponse) => void): Request<Batch.Types.CreateJobQueueResponse, AWSError>;
  /**
   * Creates an Batch scheduling policy.
   */
  createSchedulingPolicy(params: Batch.Types.CreateSchedulingPolicyRequest, callback?: (err: AWSError, data: Batch.Types.CreateSchedulingPolicyResponse) => void): Request<Batch.Types.CreateSchedulingPolicyResponse, AWSError>;
  /**
   * Creates an Batch scheduling policy.
   */
  createSchedulingPolicy(callback?: (err: AWSError, data: Batch.Types.CreateSchedulingPolicyResponse) => void): Request<Batch.Types.CreateSchedulingPolicyResponse, AWSError>;
  /**
   * Deletes an Batch compute environment. Before you can delete a compute environment, you must set its state to DISABLED with the UpdateComputeEnvironment API operation and disassociate it from any job queues with the UpdateJobQueue API operation. Compute environments that use Fargate resources must terminate all active jobs on that compute environment before deleting the compute environment. If this isn't done, the compute environment enters an invalid state.
   */
  deleteComputeEnvironment(params: Batch.Types.DeleteComputeEnvironmentRequest, callback?: (err: AWSError, data: Batch.Types.DeleteComputeEnvironmentResponse) => void): Request<Batch.Types.DeleteComputeEnvironmentResponse, AWSError>;
  /**
   * Deletes an Batch compute environment. Before you can delete a compute environment, you must set its state to DISABLED with the UpdateComputeEnvironment API operation and disassociate it from any job queues with the UpdateJobQueue API operation. Compute environments that use Fargate resources must terminate all active jobs on that compute environment before deleting the compute environment. If this isn't done, the compute environment enters an invalid state.
   */
  deleteComputeEnvironment(callback?: (err: AWSError, data: Batch.Types.DeleteComputeEnvironmentResponse) => void): Request<Batch.Types.DeleteComputeEnvironmentResponse, AWSError>;
  /**
   * Deletes the specified job queue. You must first disable submissions for a queue with the UpdateJobQueue operation. All jobs in the queue are eventually terminated when you delete a job queue. The jobs are terminated at a rate of about 16 jobs each second. It's not necessary to disassociate compute environments from a queue before submitting a DeleteJobQueue request.
   */
  deleteJobQueue(params: Batch.Types.DeleteJobQueueRequest, callback?: (err: AWSError, data: Batch.Types.DeleteJobQueueResponse) => void): Request<Batch.Types.DeleteJobQueueResponse, AWSError>;
  /**
   * Deletes the specified job queue. You must first disable submissions for a queue with the UpdateJobQueue operation. All jobs in the queue are eventually terminated when you delete a job queue. The jobs are terminated at a rate of about 16 jobs each second. It's not necessary to disassociate compute environments from a queue before submitting a DeleteJobQueue request.
   */
  deleteJobQueue(callback?: (err: AWSError, data: Batch.Types.DeleteJobQueueResponse) => void): Request<Batch.Types.DeleteJobQueueResponse, AWSError>;
  /**
   * Deletes the specified scheduling policy. You can't delete a scheduling policy that's used in any job queues.
   */
  deleteSchedulingPolicy(params: Batch.Types.DeleteSchedulingPolicyRequest, callback?: (err: AWSError, data: Batch.Types.DeleteSchedulingPolicyResponse) => void): Request<Batch.Types.DeleteSchedulingPolicyResponse, AWSError>;
  /**
   * Deletes the specified scheduling policy. You can't delete a scheduling policy that's used in any job queues.
   */
  deleteSchedulingPolicy(callback?: (err: AWSError, data: Batch.Types.DeleteSchedulingPolicyResponse) => void): Request<Batch.Types.DeleteSchedulingPolicyResponse, AWSError>;
  /**
   * Deregisters an Batch job definition. Job definitions are permanently deleted after 180 days.
   */
  deregisterJobDefinition(params: Batch.Types.DeregisterJobDefinitionRequest, callback?: (err: AWSError, data: Batch.Types.DeregisterJobDefinitionResponse) => void): Request<Batch.Types.DeregisterJobDefinitionResponse, AWSError>;
  /**
   * Deregisters an Batch job definition. Job definitions are permanently deleted after 180 days.
   */
  deregisterJobDefinition(callback?: (err: AWSError, data: Batch.Types.DeregisterJobDefinitionResponse) => void): Request<Batch.Types.DeregisterJobDefinitionResponse, AWSError>;
  /**
   * Describes one or more of your compute environments. If you're using an unmanaged compute environment, you can use the DescribeComputeEnvironment operation to determine the ecsClusterArn that you launch your Amazon ECS container instances into.
   */
  describeComputeEnvironments(params: Batch.Types.DescribeComputeEnvironmentsRequest, callback?: (err: AWSError, data: Batch.Types.DescribeComputeEnvironmentsResponse) => void): Request<Batch.Types.DescribeComputeEnvironmentsResponse, AWSError>;
  /**
   * Describes one or more of your compute environments. If you're using an unmanaged compute environment, you can use the DescribeComputeEnvironment operation to determine the ecsClusterArn that you launch your Amazon ECS container instances into.
   */
  describeComputeEnvironments(callback?: (err: AWSError, data: Batch.Types.DescribeComputeEnvironmentsResponse) => void): Request<Batch.Types.DescribeComputeEnvironmentsResponse, AWSError>;
  /**
   * Describes a list of job definitions. You can specify a status (such as ACTIVE) to only return job definitions that match that status.
   */
  describeJobDefinitions(params: Batch.Types.DescribeJobDefinitionsRequest, callback?: (err: AWSError, data: Batch.Types.DescribeJobDefinitionsResponse) => void): Request<Batch.Types.DescribeJobDefinitionsResponse, AWSError>;
  /**
   * Describes a list of job definitions. You can specify a status (such as ACTIVE) to only return job definitions that match that status.
   */
  describeJobDefinitions(callback?: (err: AWSError, data: Batch.Types.DescribeJobDefinitionsResponse) => void): Request<Batch.Types.DescribeJobDefinitionsResponse, AWSError>;
  /**
   * Describes one or more of your job queues.
   */
  describeJobQueues(params: Batch.Types.DescribeJobQueuesRequest, callback?: (err: AWSError, data: Batch.Types.DescribeJobQueuesResponse) => void): Request<Batch.Types.DescribeJobQueuesResponse, AWSError>;
  /**
   * Describes one or more of your job queues.
   */
  describeJobQueues(callback?: (err: AWSError, data: Batch.Types.DescribeJobQueuesResponse) => void): Request<Batch.Types.DescribeJobQueuesResponse, AWSError>;
  /**
   * Describes a list of Batch jobs.
   */
  describeJobs(params: Batch.Types.DescribeJobsRequest, callback?: (err: AWSError, data: Batch.Types.DescribeJobsResponse) => void): Request<Batch.Types.DescribeJobsResponse, AWSError>;
  /**
   * Describes a list of Batch jobs.
   */
  describeJobs(callback?: (err: AWSError, data: Batch.Types.DescribeJobsResponse) => void): Request<Batch.Types.DescribeJobsResponse, AWSError>;
  /**
   * Describes one or more of your scheduling policies.
   */
  describeSchedulingPolicies(params: Batch.Types.DescribeSchedulingPoliciesRequest, callback?: (err: AWSError, data: Batch.Types.DescribeSchedulingPoliciesResponse) => void): Request<Batch.Types.DescribeSchedulingPoliciesResponse, AWSError>;
  /**
   * Describes one or more of your scheduling policies.
   */
  describeSchedulingPolicies(callback?: (err: AWSError, data: Batch.Types.DescribeSchedulingPoliciesResponse) => void): Request<Batch.Types.DescribeSchedulingPoliciesResponse, AWSError>;
  /**
   * Returns a list of Batch jobs. You must specify only one of the following items:   A job queue ID to return a list of jobs in that job queue   A multi-node parallel job ID to return a list of nodes for that job   An array job ID to return a list of the children for that job   You can filter the results by job status with the jobStatus parameter. If you don't specify a status, only RUNNING jobs are returned.
   */
  listJobs(params: Batch.Types.ListJobsRequest, callback?: (err: AWSError, data: Batch.Types.ListJobsResponse) => void): Request<Batch.Types.ListJobsResponse, AWSError>;
  /**
   * Returns a list of Batch jobs. You must specify only one of the following items:   A job queue ID to return a list of jobs in that job queue   A multi-node parallel job ID to return a list of nodes for that job   An array job ID to return a list of the children for that job   You can filter the results by job status with the jobStatus parameter. If you don't specify a status, only RUNNING jobs are returned.
   */
  listJobs(callback?: (err: AWSError, data: Batch.Types.ListJobsResponse) => void): Request<Batch.Types.ListJobsResponse, AWSError>;
  /**
   * Returns a list of Batch scheduling policies.
   */
  listSchedulingPolicies(params: Batch.Types.ListSchedulingPoliciesRequest, callback?: (err: AWSError, data: Batch.Types.ListSchedulingPoliciesResponse) => void): Request<Batch.Types.ListSchedulingPoliciesResponse, AWSError>;
  /**
   * Returns a list of Batch scheduling policies.
   */
  listSchedulingPolicies(callback?: (err: AWSError, data: Batch.Types.ListSchedulingPoliciesResponse) => void): Request<Batch.Types.ListSchedulingPoliciesResponse, AWSError>;
  /**
   * Lists the tags for an Batch resource. Batch resources that support tags are compute environments, jobs, job definitions, job queues, and scheduling policies. ARNs for child jobs of array and multi-node parallel (MNP) jobs aren't supported.
   */
  listTagsForResource(params: Batch.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Batch.Types.ListTagsForResourceResponse) => void): Request<Batch.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for an Batch resource. Batch resources that support tags are compute environments, jobs, job definitions, job queues, and scheduling policies. ARNs for child jobs of array and multi-node parallel (MNP) jobs aren't supported.
   */
  listTagsForResource(callback?: (err: AWSError, data: Batch.Types.ListTagsForResourceResponse) => void): Request<Batch.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Registers an Batch job definition.
   */
  registerJobDefinition(params: Batch.Types.RegisterJobDefinitionRequest, callback?: (err: AWSError, data: Batch.Types.RegisterJobDefinitionResponse) => void): Request<Batch.Types.RegisterJobDefinitionResponse, AWSError>;
  /**
   * Registers an Batch job definition.
   */
  registerJobDefinition(callback?: (err: AWSError, data: Batch.Types.RegisterJobDefinitionResponse) => void): Request<Batch.Types.RegisterJobDefinitionResponse, AWSError>;
  /**
   * Submits an Batch job from a job definition. Parameters that are specified during SubmitJob override parameters defined in the job definition. vCPU and memory requirements that are specified in the resourceRequirements objects in the job definition are the exception. They can't be overridden this way using the memory and vcpus parameters. Rather, you must specify updates to job definition parameters in a resourceRequirements object that's included in the containerOverrides parameter.  Job queues with a scheduling policy are limited to 500 active fair share identifiers at a time.    Jobs that run on Fargate resources can't be guaranteed to run for more than 14 days. This is because, after 14 days, Fargate resources might become unavailable and job might be terminated. 
   */
  submitJob(params: Batch.Types.SubmitJobRequest, callback?: (err: AWSError, data: Batch.Types.SubmitJobResponse) => void): Request<Batch.Types.SubmitJobResponse, AWSError>;
  /**
   * Submits an Batch job from a job definition. Parameters that are specified during SubmitJob override parameters defined in the job definition. vCPU and memory requirements that are specified in the resourceRequirements objects in the job definition are the exception. They can't be overridden this way using the memory and vcpus parameters. Rather, you must specify updates to job definition parameters in a resourceRequirements object that's included in the containerOverrides parameter.  Job queues with a scheduling policy are limited to 500 active fair share identifiers at a time.    Jobs that run on Fargate resources can't be guaranteed to run for more than 14 days. This is because, after 14 days, Fargate resources might become unavailable and job might be terminated. 
   */
  submitJob(callback?: (err: AWSError, data: Batch.Types.SubmitJobResponse) => void): Request<Batch.Types.SubmitJobResponse, AWSError>;
  /**
   * Associates the specified tags to a resource with the specified resourceArn. If existing tags on a resource aren't specified in the request parameters, they aren't changed. When a resource is deleted, the tags that are associated with that resource are deleted as well. Batch resources that support tags are compute environments, jobs, job definitions, job queues, and scheduling policies. ARNs for child jobs of array and multi-node parallel (MNP) jobs aren't supported.
   */
  tagResource(params: Batch.Types.TagResourceRequest, callback?: (err: AWSError, data: Batch.Types.TagResourceResponse) => void): Request<Batch.Types.TagResourceResponse, AWSError>;
  /**
   * Associates the specified tags to a resource with the specified resourceArn. If existing tags on a resource aren't specified in the request parameters, they aren't changed. When a resource is deleted, the tags that are associated with that resource are deleted as well. Batch resources that support tags are compute environments, jobs, job definitions, job queues, and scheduling policies. ARNs for child jobs of array and multi-node parallel (MNP) jobs aren't supported.
   */
  tagResource(callback?: (err: AWSError, data: Batch.Types.TagResourceResponse) => void): Request<Batch.Types.TagResourceResponse, AWSError>;
  /**
   * Terminates a job in a job queue. Jobs that are in the STARTING or RUNNING state are terminated, which causes them to transition to FAILED. Jobs that have not progressed to the STARTING state are cancelled.
   */
  terminateJob(params: Batch.Types.TerminateJobRequest, callback?: (err: AWSError, data: Batch.Types.TerminateJobResponse) => void): Request<Batch.Types.TerminateJobResponse, AWSError>;
  /**
   * Terminates a job in a job queue. Jobs that are in the STARTING or RUNNING state are terminated, which causes them to transition to FAILED. Jobs that have not progressed to the STARTING state are cancelled.
   */
  terminateJob(callback?: (err: AWSError, data: Batch.Types.TerminateJobResponse) => void): Request<Batch.Types.TerminateJobResponse, AWSError>;
  /**
   * Deletes specified tags from an Batch resource.
   */
  untagResource(params: Batch.Types.UntagResourceRequest, callback?: (err: AWSError, data: Batch.Types.UntagResourceResponse) => void): Request<Batch.Types.UntagResourceResponse, AWSError>;
  /**
   * Deletes specified tags from an Batch resource.
   */
  untagResource(callback?: (err: AWSError, data: Batch.Types.UntagResourceResponse) => void): Request<Batch.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an Batch compute environment.
   */
  updateComputeEnvironment(params: Batch.Types.UpdateComputeEnvironmentRequest, callback?: (err: AWSError, data: Batch.Types.UpdateComputeEnvironmentResponse) => void): Request<Batch.Types.UpdateComputeEnvironmentResponse, AWSError>;
  /**
   * Updates an Batch compute environment.
   */
  updateComputeEnvironment(callback?: (err: AWSError, data: Batch.Types.UpdateComputeEnvironmentResponse) => void): Request<Batch.Types.UpdateComputeEnvironmentResponse, AWSError>;
  /**
   * Updates a job queue.
   */
  updateJobQueue(params: Batch.Types.UpdateJobQueueRequest, callback?: (err: AWSError, data: Batch.Types.UpdateJobQueueResponse) => void): Request<Batch.Types.UpdateJobQueueResponse, AWSError>;
  /**
   * Updates a job queue.
   */
  updateJobQueue(callback?: (err: AWSError, data: Batch.Types.UpdateJobQueueResponse) => void): Request<Batch.Types.UpdateJobQueueResponse, AWSError>;
  /**
   * Updates a scheduling policy.
   */
  updateSchedulingPolicy(params: Batch.Types.UpdateSchedulingPolicyRequest, callback?: (err: AWSError, data: Batch.Types.UpdateSchedulingPolicyResponse) => void): Request<Batch.Types.UpdateSchedulingPolicyResponse, AWSError>;
  /**
   * Updates a scheduling policy.
   */
  updateSchedulingPolicy(callback?: (err: AWSError, data: Batch.Types.UpdateSchedulingPolicyResponse) => void): Request<Batch.Types.UpdateSchedulingPolicyResponse, AWSError>;
}
declare namespace Batch {
  export type ArrayJobDependency = "N_TO_N"|"SEQUENTIAL"|string;
  export type ArrayJobStatusSummary = {[key: string]: Integer};
  export interface ArrayProperties {
    /**
     * The size of the array job.
     */
    size?: Integer;
  }
  export interface ArrayPropertiesDetail {
    /**
     * A summary of the number of array job children in each available job status. This parameter is returned for parent array jobs.
     */
    statusSummary?: ArrayJobStatusSummary;
    /**
     * The size of the array job. This parameter is returned for parent array jobs.
     */
    size?: Integer;
    /**
     * The job index within the array that's associated with this job. This parameter is returned for array job children.
     */
    index?: Integer;
  }
  export interface ArrayPropertiesSummary {
    /**
     * The size of the array job. This parameter is returned for parent array jobs.
     */
    size?: Integer;
    /**
     * The job index within the array that's associated with this job. This parameter is returned for children of array jobs.
     */
    index?: Integer;
  }
  export type AssignPublicIp = "ENABLED"|"DISABLED"|string;
  export interface AttemptContainerDetail {
    /**
     * The Amazon Resource Name (ARN) of the Amazon ECS container instance that hosts the job attempt.
     */
    containerInstanceArn?: String;
    /**
     * The Amazon Resource Name (ARN) of the Amazon ECS task that's associated with the job attempt. Each container attempt receives a task ARN when they reach the STARTING status.
     */
    taskArn?: String;
    /**
     * The exit code for the job attempt. A non-zero exit code is considered failed.
     */
    exitCode?: Integer;
    /**
     * A short (255 max characters) human-readable string to provide additional details for a running or stopped container.
     */
    reason?: String;
    /**
     * The name of the CloudWatch Logs log stream that's associated with the container. The log group for Batch jobs is /aws/batch/job. Each container attempt receives a log stream name when they reach the RUNNING status.
     */
    logStreamName?: String;
    /**
     * The network interfaces that are associated with the job attempt.
     */
    networkInterfaces?: NetworkInterfaceList;
  }
  export interface AttemptDetail {
    /**
     * The details for the container in this job attempt.
     */
    container?: AttemptContainerDetail;
    /**
     * The Unix timestamp (in milliseconds) for when the attempt was started (when the attempt transitioned from the STARTING state to the RUNNING state).
     */
    startedAt?: Long;
    /**
     * The Unix timestamp (in milliseconds) for when the attempt was stopped (when the attempt transitioned from the RUNNING state to a terminal state, such as SUCCEEDED or FAILED).
     */
    stoppedAt?: Long;
    /**
     * A short, human-readable string to provide additional details for the current status of the job attempt.
     */
    statusReason?: String;
  }
  export type AttemptDetails = AttemptDetail[];
  export type Boolean = boolean;
  export type CEState = "ENABLED"|"DISABLED"|string;
  export type CEStatus = "CREATING"|"UPDATING"|"DELETING"|"DELETED"|"VALID"|"INVALID"|string;
  export type CEType = "MANAGED"|"UNMANAGED"|string;
  export type CRAllocationStrategy = "BEST_FIT"|"BEST_FIT_PROGRESSIVE"|"SPOT_CAPACITY_OPTIMIZED"|"SPOT_PRICE_CAPACITY_OPTIMIZED"|string;
  export type CRType = "EC2"|"SPOT"|"FARGATE"|"FARGATE_SPOT"|string;
  export type CRUpdateAllocationStrategy = "BEST_FIT_PROGRESSIVE"|"SPOT_CAPACITY_OPTIMIZED"|"SPOT_PRICE_CAPACITY_OPTIMIZED"|string;
  export interface CancelJobRequest {
    /**
     * The Batch job ID of the job to cancel.
     */
    jobId: String;
    /**
     * A message to attach to the job that explains the reason for canceling it. This message is returned by future DescribeJobs operations on the job. This message is also recorded in the Batch activity logs.
     */
    reason: String;
  }
  export interface CancelJobResponse {
  }
  export interface ComputeEnvironmentDetail {
    /**
     * The name of the compute environment. It can be up to 128 characters long. It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_).
     */
    computeEnvironmentName: String;
    /**
     * The Amazon Resource Name (ARN) of the compute environment.
     */
    computeEnvironmentArn: String;
    /**
     * The maximum number of VCPUs expected to be used for an unmanaged compute environment.
     */
    unmanagedvCpus?: Integer;
    /**
     * The Amazon Resource Name (ARN) of the underlying Amazon ECS cluster that the compute environment uses.
     */
    ecsClusterArn?: String;
    /**
     * The tags applied to the compute environment.
     */
    tags?: TagrisTagsMap;
    /**
     * The type of the compute environment: MANAGED or UNMANAGED. For more information, see Compute environments in the Batch User Guide.
     */
    type?: CEType;
    /**
     * The state of the compute environment. The valid values are ENABLED or DISABLED. If the state is ENABLED, then the Batch scheduler can attempt to place jobs from an associated job queue on the compute resources within the environment. If the compute environment is managed, then it can scale its instances out or in automatically based on the job queue demand. If the state is DISABLED, then the Batch scheduler doesn't attempt to place jobs within the environment. Jobs in a STARTING or RUNNING state continue to progress normally. Managed compute environments in the DISABLED state don't scale out.   Compute environments in a DISABLED state may continue to incur billing charges. To prevent additional charges, turn off and then delete the compute environment. For more information, see State in the Batch User Guide.  When an instance is idle, the instance scales down to the minvCpus value. However, the instance size doesn't change. For example, consider a c5.8xlarge instance with a minvCpus value of 4 and a desiredvCpus value of 36. This instance doesn't scale down to a c5.large instance.
     */
    state?: CEState;
    /**
     * The current status of the compute environment (for example, CREATING or VALID).
     */
    status?: CEStatus;
    /**
     * A short, human-readable string to provide additional details for the current status of the compute environment.
     */
    statusReason?: String;
    /**
     * The compute resources defined for the compute environment. For more information, see Compute environments in the Batch User Guide.
     */
    computeResources?: ComputeResource;
    /**
     * The service role that's associated with the compute environment that allows Batch to make calls to Amazon Web Services API operations on your behalf. For more information, see Batch service IAM role in the Batch User Guide.
     */
    serviceRole?: String;
    /**
     * Specifies the infrastructure update policy for the compute environment. For more information about infrastructure updates, see Updating compute environments in the Batch User Guide.
     */
    updatePolicy?: UpdatePolicy;
    /**
     * The configuration for the Amazon EKS cluster that supports the Batch compute environment. Only specify this parameter if the containerOrchestrationType is EKS.
     */
    eksConfiguration?: EksConfiguration;
    /**
     * The orchestration type of the compute environment. The valid values are ECS (default) or EKS.
     */
    containerOrchestrationType?: OrchestrationType;
    /**
     * Unique identifier for the compute environment.
     */
    uuid?: String;
  }
  export type ComputeEnvironmentDetailList = ComputeEnvironmentDetail[];
  export interface ComputeEnvironmentOrder {
    /**
     * The order of the compute environment. Compute environments are tried in ascending order. For example, if two compute environments are associated with a job queue, the compute environment with a lower order integer value is tried for job placement first.
     */
    order: Integer;
    /**
     * The Amazon Resource Name (ARN) of the compute environment.
     */
    computeEnvironment: String;
  }
  export type ComputeEnvironmentOrders = ComputeEnvironmentOrder[];
  export interface ComputeResource {
    /**
     * The type of compute environment: EC2, SPOT, FARGATE, or FARGATE_SPOT. For more information, see Compute environments in the Batch User Guide.  If you choose SPOT, you must also specify an Amazon EC2 Spot Fleet role with the spotIamFleetRole parameter. For more information, see Amazon EC2 spot fleet role in the Batch User Guide.
     */
    type: CRType;
    /**
     * The allocation strategy to use for the compute resource if not enough instances of the best fitting instance type can be allocated. This might be because of availability of the instance type in the Region or Amazon EC2 service limits. For more information, see Allocation strategies in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it.   BEST_FIT (default)  Batch selects an instance type that best fits the needs of the jobs with a preference for the lowest-cost instance type. If additional instances of the selected instance type aren't available, Batch waits for the additional instances to be available. If there aren't enough instances available or the user is reaching Amazon EC2 service limits, additional jobs aren't run until the currently running jobs are completed. This allocation strategy keeps costs lower but can limit scaling. If you're using Spot Fleets with BEST_FIT, the Spot Fleet IAM Role must be specified. Compute resources that use a BEST_FIT allocation strategy don't support infrastructure updates and can't update some parameters. For more information, see Updating compute environments in the Batch User Guide.  BEST_FIT_PROGRESSIVE  Batch selects additional instance types that are large enough to meet the requirements of the jobs in the queue. Its preference is for instance types with lower cost vCPUs. If additional instances of the previously selected instance types aren't available, Batch selects new instance types.  SPOT_CAPACITY_OPTIMIZED  Batch selects one or more instance types that are large enough to meet the requirements of the jobs in the queue. Its preference is for instance types that are less likely to be interrupted. This allocation strategy is only available for Spot Instance compute resources.  SPOT_PRICE_CAPACITY_OPTIMIZED  The price and capacity optimized allocation strategy looks at both price and capacity to select the Spot Instance pools that are the least likely to be interrupted and have the lowest possible price. This allocation strategy is only available for Spot Instance compute resources.   With BEST_FIT_PROGRESSIVE,SPOT_CAPACITY_OPTIMIZED and SPOT_PRICE_CAPACITY_OPTIMIZED strategies using On-Demand or Spot Instances, and the BEST_FIT strategy using Spot Instances, Batch might need to exceed maxvCpus to meet your capacity requirements. In this event, Batch never exceeds maxvCpus by more than a single instance.
     */
    allocationStrategy?: CRAllocationStrategy;
    /**
     * The minimum number of vCPUs that a compute environment should maintain (even if the compute environment is DISABLED).  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    minvCpus?: Integer;
    /**
     * The maximum number of vCPUs that a compute environment can support.  With BEST_FIT_PROGRESSIVE, SPOT_CAPACITY_OPTIMIZED and SPOT_PRICE_CAPACITY_OPTIMIZED allocation strategies using On-Demand or Spot Instances, and the BEST_FIT strategy using Spot Instances, Batch might need to exceed maxvCpus to meet your capacity requirements. In this event, Batch never exceeds maxvCpus by more than a single instance. For example, no more than a single instance from among those specified in your compute environment is allocated. 
     */
    maxvCpus: Integer;
    /**
     * The desired number of vCPUS in the compute environment. Batch modifies this value between the minimum and maximum values based on job queue demand.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    desiredvCpus?: Integer;
    /**
     * The instances types that can be launched. You can specify instance families to launch any instance type within those families (for example, c5 or p3), or you can specify specific sizes within a family (such as c5.8xlarge). You can also choose optimal to select instance types (from the C4, M4, and R4 instance families) that match the demand of your job queues.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it.   When you create a compute environment, the instance types that you select for the compute environment must share the same architecture. For example, you can't mix x86 and ARM instances in the same compute environment.   Currently, optimal uses instance types from the C4, M4, and R4 instance families. In Regions that don't have instance types from those instance families, instance types from the C5, M5, and R5 instance families are used. 
     */
    instanceTypes?: StringList;
    /**
     * The Amazon Machine Image (AMI) ID used for instances launched in the compute environment. This parameter is overridden by the imageIdOverride member of the Ec2Configuration structure.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it.   The AMI that you choose for a compute environment must match the architecture of the instance types that you intend to use for that compute environment. For example, if your compute environment uses A1 instance types, the compute resource AMI that you choose must support ARM instances. Amazon ECS vends both x86 and ARM versions of the Amazon ECS-optimized Amazon Linux 2 AMI. For more information, see Amazon ECS-optimized Amazon Linux 2 AMI in the Amazon Elastic Container Service Developer Guide. 
     */
    imageId?: String;
    /**
     * The VPC subnets where the compute resources are launched. These subnets must be within the same VPC. Fargate compute resources can contain up to 16 subnets. For more information, see VPCs and subnets in the Amazon VPC User Guide.  Batch on Amazon EC2 and Batch on Amazon EKS support Local Zones. For more information, see  Local Zones in the Amazon EC2 User Guide for Linux Instances, Amazon EKS and Amazon Web Services Local Zones in the Amazon EKS User Guide and  Amazon ECS clusters in Local Zones, Wavelength Zones, and Amazon Web Services Outposts in the Amazon ECS Developer Guide. Batch on Fargate doesn't currently support Local Zones. 
     */
    subnets: StringList;
    /**
     * The Amazon EC2 security groups that are associated with instances launched in the compute environment. One or more security groups must be specified, either in securityGroupIds or using a launch template referenced in launchTemplate. This parameter is required for jobs that are running on Fargate resources and must contain at least one security group. Fargate doesn't support launch templates. If security groups are specified using both securityGroupIds and launchTemplate, the values in securityGroupIds are used.
     */
    securityGroupIds?: StringList;
    /**
     * The Amazon EC2 key pair that's used for instances launched in the compute environment. You can use this key pair to log in to your instances with SSH.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    ec2KeyPair?: String;
    /**
     * The Amazon ECS instance profile applied to Amazon EC2 instances in a compute environment. You can specify the short name or full Amazon Resource Name (ARN) of an instance profile. For example,  ecsInstanceRole  or arn:aws:iam::&lt;aws_account_id&gt;:instance-profile/ecsInstanceRole . For more information, see Amazon ECS instance role in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    instanceRole?: String;
    /**
     * Key-value pair tags to be applied to EC2 resources that are launched in the compute environment. For Batch, these take the form of "String1": "String2", where String1 is the tag key and String2 is the tag value-for example, { "Name": "Batch Instance - C4OnDemand" }. This is helpful for recognizing your Batch instances in the Amazon EC2 console. Updating these tags requires an infrastructure update to the compute environment. For more information, see Updating compute environments in the Batch User Guide. These tags aren't seen when using the Batch ListTagsForResource API operation.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    tags?: TagsMap;
    /**
     * The Amazon EC2 placement group to associate with your compute resources. If you intend to submit multi-node parallel jobs to your compute environment, you should consider creating a cluster placement group and associate it with your compute resources. This keeps your multi-node parallel job on a logical grouping of instances within a single Availability Zone with high network flow potential. For more information, see Placement groups in the Amazon EC2 User Guide for Linux Instances.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    placementGroup?: String;
    /**
     * The maximum percentage that a Spot Instance price can be when compared with the On-Demand price for that instance type before instances are launched. For example, if your maximum percentage is 20%, then the Spot price must be less than 20% of the current On-Demand price for that Amazon EC2 instance. You always pay the lowest (market) price and never more than your maximum percentage. If you leave this field empty, the default value is 100% of the On-Demand price. For most use cases, we recommend leaving this field empty.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    bidPercentage?: Integer;
    /**
     * The Amazon Resource Name (ARN) of the Amazon EC2 Spot Fleet IAM role applied to a SPOT compute environment. This role is required if the allocation strategy set to BEST_FIT or if the allocation strategy isn't specified. For more information, see Amazon EC2 spot fleet role in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it.   To tag your Spot Instances on creation, the Spot Fleet IAM role specified here must use the newer AmazonEC2SpotFleetTaggingRole managed policy. The previously recommended AmazonEC2SpotFleetRole managed policy doesn't have the required permissions to tag Spot Instances. For more information, see Spot instances not tagged on creation in the Batch User Guide. 
     */
    spotIamFleetRole?: String;
    /**
     * The launch template to use for your compute resources. Any other compute resource parameters that you specify in a CreateComputeEnvironment API operation override the same parameters in the launch template. You must specify either the launch template ID or launch template name in the request, but not both. For more information, see Launch template support in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    launchTemplate?: LaunchTemplateSpecification;
    /**
     * Provides information that's used to select Amazon Machine Images (AMIs) for EC2 instances in the compute environment. If Ec2Configuration isn't specified, the default is ECS_AL2. One or two values can be provided.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    ec2Configuration?: Ec2ConfigurationList;
  }
  export interface ComputeResourceUpdate {
    /**
     * The minimum number of vCPUs that an environment should maintain (even if the compute environment is DISABLED).  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    minvCpus?: Integer;
    /**
     * The maximum number of Amazon EC2 vCPUs that an environment can reach.  With BEST_FIT_PROGRESSIVE, SPOT_CAPACITY_OPTIMIZED, and SPOT_PRICE_CAPACITY_OPTIMIZED allocation strategies using On-Demand or Spot Instances, and the BEST_FIT strategy using Spot Instances, Batch might need to exceed maxvCpus to meet your capacity requirements. In this event, Batch never exceeds maxvCpus by more than a single instance. That is, no more than a single instance from among those specified in your compute environment. 
     */
    maxvCpus?: Integer;
    /**
     * The desired number of vCPUS in the compute environment. Batch modifies this value between the minimum and maximum values based on job queue demand.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it.   Batch doesn't support changing the desired number of vCPUs of an existing compute environment. Don't specify this parameter for compute environments using Amazon EKS clusters.   When you update the desiredvCpus setting, the value must be between the minvCpus and maxvCpus values.  Additionally, the updated desiredvCpus value must be greater than or equal to the current desiredvCpus value. For more information, see Troubleshooting Batch in the Batch User Guide. 
     */
    desiredvCpus?: Integer;
    /**
     * The VPC subnets where the compute resources are launched. Fargate compute resources can contain up to 16 subnets. For Fargate compute resources, providing an empty list will be handled as if this parameter wasn't specified and no change is made. For EC2 compute resources, providing an empty list removes the VPC subnets from the compute resource. For more information, see VPCs and subnets in the Amazon VPC User Guide. When updating a compute environment, changing the VPC subnets requires an infrastructure update of the compute environment. For more information, see Updating compute environments in the Batch User Guide.  Batch on Amazon EC2 and Batch on Amazon EKS support Local Zones. For more information, see  Local Zones in the Amazon EC2 User Guide for Linux Instances, Amazon EKS and Amazon Web Services Local Zones in the Amazon EKS User Guide and  Amazon ECS clusters in Local Zones, Wavelength Zones, and Amazon Web Services Outposts in the Amazon ECS Developer Guide. Batch on Fargate doesn't currently support Local Zones. 
     */
    subnets?: StringList;
    /**
     * The Amazon EC2 security groups that are associated with instances launched in the compute environment. This parameter is required for Fargate compute resources, where it can contain up to 5 security groups. For Fargate compute resources, providing an empty list is handled as if this parameter wasn't specified and no change is made. For EC2 compute resources, providing an empty list removes the security groups from the compute resource. When updating a compute environment, changing the EC2 security groups requires an infrastructure update of the compute environment. For more information, see Updating compute environments in the Batch User Guide.
     */
    securityGroupIds?: StringList;
    /**
     * The allocation strategy to use for the compute resource if there's not enough instances of the best fitting instance type that can be allocated. This might be because of availability of the instance type in the Region or Amazon EC2 service limits. For more information, see Allocation strategies in the Batch User Guide. When updating a compute environment, changing the allocation strategy requires an infrastructure update of the compute environment. For more information, see Updating compute environments in the Batch User Guide. BEST_FIT isn't supported when updating a compute environment.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it.   BEST_FIT_PROGRESSIVE  Batch selects additional instance types that are large enough to meet the requirements of the jobs in the queue. Its preference is for instance types with lower cost vCPUs. If additional instances of the previously selected instance types aren't available, Batch selects new instance types.  SPOT_CAPACITY_OPTIMIZED  Batch selects one or more instance types that are large enough to meet the requirements of the jobs in the queue. Its preference is for instance types that are less likely to be interrupted. This allocation strategy is only available for Spot Instance compute resources.  SPOT_PRICE_CAPACITY_OPTIMIZED  The price and capacity optimized allocation strategy looks at both price and capacity to select the Spot Instance pools that are the least likely to be interrupted and have the lowest possible price. This allocation strategy is only available for Spot Instance compute resources.   With both BEST_FIT_PROGRESSIVE, SPOT_CAPACITY_OPTIMIZED, and SPOT_PRICE_CAPACITY_OPTIMIZED strategies using On-Demand or Spot Instances, and the BEST_FIT strategy using Spot Instances, Batch might need to exceed maxvCpus to meet your capacity requirements. In this event, Batch never exceeds maxvCpus by more than a single instance.
     */
    allocationStrategy?: CRUpdateAllocationStrategy;
    /**
     * The instances types that can be launched. You can specify instance families to launch any instance type within those families (for example, c5 or p3), or you can specify specific sizes within a family (such as c5.8xlarge). You can also choose optimal to select instance types (from the C4, M4, and R4 instance families) that match the demand of your job queues. When updating a compute environment, changing this setting requires an infrastructure update of the compute environment. For more information, see Updating compute environments in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it.   When you create a compute environment, the instance types that you select for the compute environment must share the same architecture. For example, you can't mix x86 and ARM instances in the same compute environment.   Currently, optimal uses instance types from the C4, M4, and R4 instance families. In Regions that don't have instance types from those instance families, instance types from the C5, M5, and R5 instance families are used. 
     */
    instanceTypes?: StringList;
    /**
     * The Amazon EC2 key pair that's used for instances launched in the compute environment. You can use this key pair to log in to your instances with SSH. To remove the Amazon EC2 key pair, set this value to an empty string. When updating a compute environment, changing the EC2 key pair requires an infrastructure update of the compute environment. For more information, see Updating compute environments in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    ec2KeyPair?: String;
    /**
     * The Amazon ECS instance profile applied to Amazon EC2 instances in a compute environment. You can specify the short name or full Amazon Resource Name (ARN) of an instance profile. For example,  ecsInstanceRole  or arn:aws:iam::&lt;aws_account_id&gt;:instance-profile/ecsInstanceRole . For more information, see Amazon ECS instance role in the Batch User Guide. When updating a compute environment, changing this setting requires an infrastructure update of the compute environment. For more information, see Updating compute environments in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    instanceRole?: String;
    /**
     * Key-value pair tags to be applied to EC2 resources that are launched in the compute environment. For Batch, these take the form of "String1": "String2", where String1 is the tag key and String2 is the tag value-for example, { "Name": "Batch Instance - C4OnDemand" }. This is helpful for recognizing your Batch instances in the Amazon EC2 console. These tags aren't seen when using the Batch ListTagsForResource API operation. When updating a compute environment, changing this setting requires an infrastructure update of the compute environment. For more information, see Updating compute environments in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    tags?: TagsMap;
    /**
     * The Amazon EC2 placement group to associate with your compute resources. If you intend to submit multi-node parallel jobs to your compute environment, you should consider creating a cluster placement group and associate it with your compute resources. This keeps your multi-node parallel job on a logical grouping of instances within a single Availability Zone with high network flow potential. For more information, see Placement groups in the Amazon EC2 User Guide for Linux Instances. When updating a compute environment, changing the placement group requires an infrastructure update of the compute environment. For more information, see Updating compute environments in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    placementGroup?: String;
    /**
     * The maximum percentage that a Spot Instance price can be when compared with the On-Demand price for that instance type before instances are launched. For example, if your maximum percentage is 20%, the Spot price must be less than 20% of the current On-Demand price for that Amazon EC2 instance. You always pay the lowest (market) price and never more than your maximum percentage. For most use cases, we recommend leaving this field empty. When updating a compute environment, changing the bid percentage requires an infrastructure update of the compute environment. For more information, see Updating compute environments in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    bidPercentage?: Integer;
    /**
     * The updated launch template to use for your compute resources. You must specify either the launch template ID or launch template name in the request, but not both. For more information, see Launch template support in the Batch User Guide. To remove the custom launch template and use the default launch template, set launchTemplateId or launchTemplateName member of the launch template specification to an empty string. Removing the launch template from a compute environment will not remove the AMI specified in the launch template. In order to update the AMI specified in a launch template, the updateToLatestImageVersion parameter must be set to true. When updating a compute environment, changing the launch template requires an infrastructure update of the compute environment. For more information, see Updating compute environments in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    launchTemplate?: LaunchTemplateSpecification;
    /**
     * Provides information used to select Amazon Machine Images (AMIs) for EC2 instances in the compute environment. If Ec2Configuration isn't specified, the default is ECS_AL2. When updating a compute environment, changing this setting requires an infrastructure update of the compute environment. For more information, see Updating compute environments in the Batch User Guide. To remove the EC2 configuration and any custom AMI ID specified in imageIdOverride, set this value to an empty string. One or two values can be provided.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. 
     */
    ec2Configuration?: Ec2ConfigurationList;
    /**
     * Specifies whether the AMI ID is updated to the latest one that's supported by Batch when the compute environment has an infrastructure update. The default value is false.  An AMI ID can either be specified in the imageId or imageIdOverride parameters or be determined by the launch template that's specified in the launchTemplate parameter. If an AMI ID is specified any of these ways, this parameter is ignored. For more information about to update AMI IDs during an infrastructure update, see Updating the AMI ID in the Batch User Guide.  When updating a compute environment, changing this setting requires an infrastructure update of the compute environment. For more information, see Updating compute environments in the Batch User Guide.
     */
    updateToLatestImageVersion?: Boolean;
    /**
     * The type of compute environment: EC2, SPOT, FARGATE, or FARGATE_SPOT. For more information, see Compute environments in the Batch User Guide.  If you choose SPOT, you must also specify an Amazon EC2 Spot Fleet role with the spotIamFleetRole parameter. For more information, see Amazon EC2 spot fleet role in the Batch User Guide. When updating a compute environment, changing the type of a compute environment requires an infrastructure update of the compute environment. For more information, see Updating compute environments in the Batch User Guide.
     */
    type?: CRType;
    /**
     * The Amazon Machine Image (AMI) ID used for instances launched in the compute environment. This parameter is overridden by the imageIdOverride member of the Ec2Configuration structure. To remove the custom AMI ID and use the default AMI ID, set this value to an empty string. When updating a compute environment, changing the AMI ID requires an infrastructure update of the compute environment. For more information, see Updating compute environments in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it.   The AMI that you choose for a compute environment must match the architecture of the instance types that you intend to use for that compute environment. For example, if your compute environment uses A1 instance types, the compute resource AMI that you choose must support ARM instances. Amazon ECS vends both x86 and ARM versions of the Amazon ECS-optimized Amazon Linux 2 AMI. For more information, see Amazon ECS-optimized Amazon Linux 2 AMI in the Amazon Elastic Container Service Developer Guide. 
     */
    imageId?: String;
  }
  export interface ContainerDetail {
    /**
     * The image used to start the container.
     */
    image?: String;
    /**
     * The number of vCPUs reserved for the container. For jobs that run on EC2 resources, you can specify the vCPU requirement for the job using resourceRequirements, but you can't specify the vCPU requirements in both the vcpus and resourceRequirements object. This parameter maps to CpuShares in the Create a container section of the Docker Remote API and the --cpu-shares option to docker run. Each vCPU is equivalent to 1,024 CPU shares. You must specify at least one vCPU. This is required but can be specified in several places. It must be specified for each node at least once.  This parameter isn't applicable to jobs that run on Fargate resources. For jobs that run on Fargate resources, you must specify the vCPU requirement for the job using resourceRequirements. 
     */
    vcpus?: Integer;
    /**
     * For jobs running on EC2 resources that didn't specify memory requirements using resourceRequirements, the number of MiB of memory reserved for the job. For other jobs, including all run on Fargate resources, see resourceRequirements.
     */
    memory?: Integer;
    /**
     * The command that's passed to the container.
     */
    command?: StringList;
    /**
     * The Amazon Resource Name (ARN) that's associated with the job when run.
     */
    jobRoleArn?: String;
    /**
     * The Amazon Resource Name (ARN) of the execution role that Batch can assume. For more information, see Batch execution IAM role in the Batch User Guide.
     */
    executionRoleArn?: String;
    /**
     * A list of volumes that are associated with the job.
     */
    volumes?: Volumes;
    /**
     * The environment variables to pass to a container.  Environment variables cannot start with "AWS_BATCH". This naming convention is reserved for variables that Batch sets. 
     */
    environment?: EnvironmentVariables;
    /**
     * The mount points for data volumes in your container.
     */
    mountPoints?: MountPoints;
    /**
     * When this parameter is true, the container is given read-only access to its root file system. This parameter maps to ReadonlyRootfs in the Create a container section of the Docker Remote API and the --read-only option to  docker run .
     */
    readonlyRootFilesystem?: Boolean;
    /**
     * A list of ulimit values to set in the container. This parameter maps to Ulimits in the Create a container section of the Docker Remote API and the --ulimit option to docker run.  This parameter isn't applicable to jobs that are running on Fargate resources. 
     */
    ulimits?: Ulimits;
    /**
     * When this parameter is true, the container is given elevated permissions on the host container instance (similar to the root user). The default value is false.  This parameter isn't applicable to jobs that are running on Fargate resources and shouldn't be provided, or specified as false. 
     */
    privileged?: Boolean;
    /**
     * The user name to use inside the container. This parameter maps to User in the Create a container section of the Docker Remote API and the --user option to docker run.
     */
    user?: String;
    /**
     * The exit code to return upon completion.
     */
    exitCode?: Integer;
    /**
     * A short (255 max characters) human-readable string to provide additional details for a running or stopped container.
     */
    reason?: String;
    /**
     * The Amazon Resource Name (ARN) of the container instance that the container is running on.
     */
    containerInstanceArn?: String;
    /**
     * The Amazon Resource Name (ARN) of the Amazon ECS task that's associated with the container job. Each container attempt receives a task ARN when they reach the STARTING status.
     */
    taskArn?: String;
    /**
     * The name of the Amazon CloudWatch Logs log stream that's associated with the container. The log group for Batch jobs is /aws/batch/job. Each container attempt receives a log stream name when they reach the RUNNING status.
     */
    logStreamName?: String;
    /**
     * The instance type of the underlying host infrastructure of a multi-node parallel job.  This parameter isn't applicable to jobs that are running on Fargate resources. 
     */
    instanceType?: String;
    /**
     * The network interfaces that are associated with the job.
     */
    networkInterfaces?: NetworkInterfaceList;
    /**
     * The type and amount of resources to assign to a container. The supported resources include GPU, MEMORY, and VCPU.
     */
    resourceRequirements?: ResourceRequirements;
    /**
     * Linux-specific modifications that are applied to the container, such as details for device mappings.
     */
    linuxParameters?: LinuxParameters;
    /**
     * The log configuration specification for the container. This parameter maps to LogConfig in the Create a container section of the Docker Remote API and the --log-driver option to docker run. By default, containers use the same logging driver that the Docker daemon uses. However, the container might use a different logging driver than the Docker daemon by specifying a log driver with this parameter in the container definition. To use a different logging driver for a container, the log system must be configured properly on the container instance. Or, alternatively, it must be configured on a different log server for remote logging options. For more information on the options for different supported log drivers, see Configure logging drivers in the Docker documentation.  Batch currently supports a subset of the logging drivers available to the Docker daemon (shown in the LogConfiguration data type). Additional log drivers might be available in future releases of the Amazon ECS container agent.  This parameter requires version 1.18 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log in to your container instance and run the following command: sudo docker version | grep "Server API version"   The Amazon ECS container agent running on a container instance must register the logging drivers available on that instance with the ECS_AVAILABLE_LOGGING_DRIVERS environment variable before containers placed on that instance can use these log configuration options. For more information, see Amazon ECS container agent configuration in the Amazon Elastic Container Service Developer Guide. 
     */
    logConfiguration?: LogConfiguration;
    /**
     * The secrets to pass to the container. For more information, see Specifying sensitive data in the Batch User Guide.
     */
    secrets?: SecretList;
    /**
     * The network configuration for jobs that are running on Fargate resources. Jobs that are running on EC2 resources must not specify this parameter.
     */
    networkConfiguration?: NetworkConfiguration;
    /**
     * The platform configuration for jobs that are running on Fargate resources. Jobs that are running on EC2 resources must not specify this parameter.
     */
    fargatePlatformConfiguration?: FargatePlatformConfiguration;
    /**
     * The amount of ephemeral storage allocated for the task. This parameter is used to expand the total amount of ephemeral storage available, beyond the default amount, for tasks hosted on Fargate.
     */
    ephemeralStorage?: EphemeralStorage;
    runtimePlatform?: RuntimePlatform;
  }
  export interface ContainerOverrides {
    /**
     * This parameter is deprecated, use resourceRequirements to override the vcpus parameter that's set in the job definition. It's not supported for jobs running on Fargate resources. For jobs that run on EC2 resources, it overrides the vcpus parameter set in the job definition, but doesn't override any vCPU requirement specified in the resourceRequirements structure in the job definition. To override vCPU requirements that are specified in the resourceRequirements structure in the job definition, resourceRequirements must be specified in the SubmitJob request, with type set to VCPU and value set to the new value. For more information, see Can't override job definition resource requirements in the Batch User Guide.
     */
    vcpus?: Integer;
    /**
     * This parameter is deprecated, use resourceRequirements to override the memory requirements specified in the job definition. It's not supported for jobs running on Fargate resources. For jobs that run on EC2 resources, it overrides the memory parameter set in the job definition, but doesn't override any memory requirement that's specified in the resourceRequirements structure in the job definition. To override memory requirements that are specified in the resourceRequirements structure in the job definition, resourceRequirements must be specified in the SubmitJob request, with type set to MEMORY and value set to the new value. For more information, see Can't override job definition resource requirements in the Batch User Guide.
     */
    memory?: Integer;
    /**
     * The command to send to the container that overrides the default command from the Docker image or the job definition.  This parameter can't contain an empty string. 
     */
    command?: StringList;
    /**
     * The instance type to use for a multi-node parallel job.  This parameter isn't applicable to single-node container jobs or jobs that run on Fargate resources, and shouldn't be provided. 
     */
    instanceType?: String;
    /**
     * The environment variables to send to the container. You can add new environment variables, which are added to the container at launch, or you can override the existing environment variables from the Docker image or the job definition.  Environment variables cannot start with "AWS_BATCH". This naming convention is reserved for variables that Batch sets. 
     */
    environment?: EnvironmentVariables;
    /**
     * The type and amount of resources to assign to a container. This overrides the settings in the job definition. The supported resources include GPU, MEMORY, and VCPU.
     */
    resourceRequirements?: ResourceRequirements;
  }
  export interface ContainerProperties {
    /**
     * The image used to start a container. This string is passed directly to the Docker daemon. Images in the Docker Hub registry are available by default. Other repositories are specified with  repository-url/image:tag . It can be 255 characters long. It can contain uppercase and lowercase letters, numbers, hyphens (-), underscores (_), colons (:), periods (.), forward slashes (/), and number signs (#). This parameter maps to Image in the Create a container section of the Docker Remote API and the IMAGE parameter of docker run.  Docker image architecture must match the processor architecture of the compute resources that they're scheduled on. For example, ARM-based Docker images can only run on ARM-based compute resources.    Images in Amazon ECR Public repositories use the full registry/repository[:tag] or registry/repository[@digest] naming conventions. For example, public.ecr.aws/registry_alias/my-web-app:latest .   Images in Amazon ECR repositories use the full registry and repository URI (for example, 123456789012.dkr.ecr.&lt;region-name&gt;.amazonaws.com/&lt;repository-name&gt;).   Images in official repositories on Docker Hub use a single name (for example, ubuntu or mongo).   Images in other repositories on Docker Hub are qualified with an organization name (for example, amazon/amazon-ecs-agent).   Images in other online repositories are qualified further by a domain name (for example, quay.io/assemblyline/ubuntu).  
     */
    image?: String;
    /**
     * This parameter is deprecated, use resourceRequirements to specify the vCPU requirements for the job definition. It's not supported for jobs running on Fargate resources. For jobs running on EC2 resources, it specifies the number of vCPUs reserved for the job. Each vCPU is equivalent to 1,024 CPU shares. This parameter maps to CpuShares in the Create a container section of the Docker Remote API and the --cpu-shares option to docker run. The number of vCPUs must be specified but can be specified in several places. You must specify it at least once for each node.
     */
    vcpus?: Integer;
    /**
     * This parameter is deprecated, use resourceRequirements to specify the memory requirements for the job definition. It's not supported for jobs running on Fargate resources. For jobs that run on EC2 resources, it specifies the memory hard limit (in MiB) for a container. If your container attempts to exceed the specified number, it's terminated. You must specify at least 4 MiB of memory for a job using this parameter. The memory hard limit can be specified in several places. It must be specified for each node at least once.
     */
    memory?: Integer;
    /**
     * The command that's passed to the container. This parameter maps to Cmd in the Create a container section of the Docker Remote API and the COMMAND parameter to docker run. For more information, see https://docs.docker.com/engine/reference/builder/#cmd.
     */
    command?: StringList;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that the container can assume for Amazon Web Services permissions. For more information, see IAM roles for tasks in the Amazon Elastic Container Service Developer Guide.
     */
    jobRoleArn?: String;
    /**
     * The Amazon Resource Name (ARN) of the execution role that Batch can assume. For jobs that run on Fargate resources, you must provide an execution role. For more information, see Batch execution IAM role in the Batch User Guide.
     */
    executionRoleArn?: String;
    /**
     * A list of data volumes used in a job.
     */
    volumes?: Volumes;
    /**
     * The environment variables to pass to a container. This parameter maps to Env in the Create a container section of the Docker Remote API and the --env option to docker run.  We don't recommend using plaintext environment variables for sensitive information, such as credential data.   Environment variables cannot start with "AWS_BATCH". This naming convention is reserved for variables that Batch sets. 
     */
    environment?: EnvironmentVariables;
    /**
     * The mount points for data volumes in your container. This parameter maps to Volumes in the Create a container section of the Docker Remote API and the --volume option to docker run.
     */
    mountPoints?: MountPoints;
    /**
     * When this parameter is true, the container is given read-only access to its root file system. This parameter maps to ReadonlyRootfs in the Create a container section of the Docker Remote API and the --read-only option to docker run.
     */
    readonlyRootFilesystem?: Boolean;
    /**
     * When this parameter is true, the container is given elevated permissions on the host container instance (similar to the root user). This parameter maps to Privileged in the Create a container section of the Docker Remote API and the --privileged option to docker run. The default value is false.  This parameter isn't applicable to jobs that are running on Fargate resources and shouldn't be provided, or specified as false. 
     */
    privileged?: Boolean;
    /**
     * A list of ulimits to set in the container. This parameter maps to Ulimits in the Create a container section of the Docker Remote API and the --ulimit option to docker run.  This parameter isn't applicable to jobs that are running on Fargate resources and shouldn't be provided. 
     */
    ulimits?: Ulimits;
    /**
     * The user name to use inside the container. This parameter maps to User in the Create a container section of the Docker Remote API and the --user option to docker run.
     */
    user?: String;
    /**
     * The instance type to use for a multi-node parallel job. All node groups in a multi-node parallel job must use the same instance type.  This parameter isn't applicable to single-node container jobs or jobs that run on Fargate resources, and shouldn't be provided. 
     */
    instanceType?: String;
    /**
     * The type and amount of resources to assign to a container. The supported resources include GPU, MEMORY, and VCPU.
     */
    resourceRequirements?: ResourceRequirements;
    /**
     * Linux-specific modifications that are applied to the container, such as details for device mappings.
     */
    linuxParameters?: LinuxParameters;
    /**
     * The log configuration specification for the container. This parameter maps to LogConfig in the Create a container section of the Docker Remote API and the --log-driver option to docker run. By default, containers use the same logging driver that the Docker daemon uses. However the container might use a different logging driver than the Docker daemon by specifying a log driver with this parameter in the container definition. To use a different logging driver for a container, the log system must be configured properly on the container instance (or on a different log server for remote logging options). For more information on the options for different supported log drivers, see Configure logging drivers in the Docker documentation.  Batch currently supports a subset of the logging drivers available to the Docker daemon (shown in the LogConfiguration data type).  This parameter requires version 1.18 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log in to your container instance and run the following command: sudo docker version | grep "Server API version"   The Amazon ECS container agent running on a container instance must register the logging drivers available on that instance with the ECS_AVAILABLE_LOGGING_DRIVERS environment variable before containers placed on that instance can use these log configuration options. For more information, see Amazon ECS container agent configuration in the Amazon Elastic Container Service Developer Guide. 
     */
    logConfiguration?: LogConfiguration;
    /**
     * The secrets for the container. For more information, see Specifying sensitive data in the Batch User Guide.
     */
    secrets?: SecretList;
    /**
     * The network configuration for jobs that are running on Fargate resources. Jobs that are running on EC2 resources must not specify this parameter.
     */
    networkConfiguration?: NetworkConfiguration;
    /**
     * The platform configuration for jobs that are running on Fargate resources. Jobs that are running on EC2 resources must not specify this parameter.
     */
    fargatePlatformConfiguration?: FargatePlatformConfiguration;
    /**
     * The amount of ephemeral storage to allocate for the task. This parameter is used to expand the total amount of ephemeral storage available, beyond the default amount, for tasks hosted on Fargate.
     */
    ephemeralStorage?: EphemeralStorage;
    runtimePlatform?: RuntimePlatform;
  }
  export interface ContainerSummary {
    /**
     * The exit code to return upon completion.
     */
    exitCode?: Integer;
    /**
     * A short (255 max characters) human-readable string to provide additional details for a running or stopped container.
     */
    reason?: String;
  }
  export interface CreateComputeEnvironmentRequest {
    /**
     * The name for your compute environment. It can be up to 128 characters long. It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_).
     */
    computeEnvironmentName: String;
    /**
     * The type of the compute environment: MANAGED or UNMANAGED. For more information, see Compute Environments in the Batch User Guide.
     */
    type: CEType;
    /**
     * The state of the compute environment. If the state is ENABLED, then the compute environment accepts jobs from a queue and can scale out automatically based on queues. If the state is ENABLED, then the Batch scheduler can attempt to place jobs from an associated job queue on the compute resources within the environment. If the compute environment is managed, then it can scale its instances out or in automatically, based on the job queue demand. If the state is DISABLED, then the Batch scheduler doesn't attempt to place jobs within the environment. Jobs in a STARTING or RUNNING state continue to progress normally. Managed compute environments in the DISABLED state don't scale out.   Compute environments in a DISABLED state may continue to incur billing charges. To prevent additional charges, turn off and then delete the compute environment. For more information, see State in the Batch User Guide.  When an instance is idle, the instance scales down to the minvCpus value. However, the instance size doesn't change. For example, consider a c5.8xlarge instance with a minvCpus value of 4 and a desiredvCpus value of 36. This instance doesn't scale down to a c5.large instance.
     */
    state?: CEState;
    /**
     * The maximum number of vCPUs for an unmanaged compute environment. This parameter is only used for fair share scheduling to reserve vCPU capacity for new share identifiers. If this parameter isn't provided for a fair share job queue, no vCPU capacity is reserved.  This parameter is only supported when the type parameter is set to UNMANAGED. 
     */
    unmanagedvCpus?: Integer;
    /**
     * Details about the compute resources managed by the compute environment. This parameter is required for managed compute environments. For more information, see Compute Environments in the Batch User Guide.
     */
    computeResources?: ComputeResource;
    /**
     * The full Amazon Resource Name (ARN) of the IAM role that allows Batch to make calls to other Amazon Web Services services on your behalf. For more information, see Batch service IAM role in the Batch User Guide.  If your account already created the Batch service-linked role, that role is used by default for your compute environment unless you specify a different role here. If the Batch service-linked role doesn't exist in your account, and no role is specified here, the service attempts to create the Batch service-linked role in your account.  If your specified role has a path other than /, then you must specify either the full role ARN (recommended) or prefix the role name with the path. For example, if a role with the name bar has a path of /foo/, specify /foo/bar as the role name. For more information, see Friendly names and paths in the IAM User Guide.  Depending on how you created your Batch service role, its ARN might contain the service-role path prefix. When you only specify the name of the service role, Batch assumes that your ARN doesn't use the service-role path prefix. Because of this, we recommend that you specify the full ARN of your service role when you create compute environments. 
     */
    serviceRole?: String;
    /**
     * The tags that you apply to the compute environment to help you categorize and organize your resources. Each tag consists of a key and an optional value. For more information, see Tagging Amazon Web Services Resources in Amazon Web Services General Reference. These tags can be updated or removed using the TagResource and UntagResource API operations. These tags don't propagate to the underlying compute resources.
     */
    tags?: TagrisTagsMap;
    /**
     * The details for the Amazon EKS cluster that supports the compute environment.
     */
    eksConfiguration?: EksConfiguration;
  }
  export interface CreateComputeEnvironmentResponse {
    /**
     * The name of the compute environment. It can be up to 128 characters long. It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_).
     */
    computeEnvironmentName?: String;
    /**
     * The Amazon Resource Name (ARN) of the compute environment.
     */
    computeEnvironmentArn?: String;
  }
  export interface CreateJobQueueRequest {
    /**
     * The name of the job queue. It can be up to 128 letters long. It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_).
     */
    jobQueueName: String;
    /**
     * The state of the job queue. If the job queue state is ENABLED, it is able to accept jobs. If the job queue state is DISABLED, new jobs can't be added to the queue, but jobs already in the queue can finish.
     */
    state?: JQState;
    /**
     * The Amazon Resource Name (ARN) of the fair share scheduling policy. If this parameter is specified, the job queue uses a fair share scheduling policy. If this parameter isn't specified, the job queue uses a first in, first out (FIFO) scheduling policy. After a job queue is created, you can replace but can't remove the fair share scheduling policy. The format is aws:Partition:batch:Region:Account:scheduling-policy/Name . An example is aws:aws:batch:us-west-2:123456789012:scheduling-policy/MySchedulingPolicy.
     */
    schedulingPolicyArn?: String;
    /**
     * The priority of the job queue. Job queues with a higher priority (or a higher integer value for the priority parameter) are evaluated first when associated with the same compute environment. Priority is determined in descending order. For example, a job queue with a priority value of 10 is given scheduling preference over a job queue with a priority value of 1. All of the compute environments must be either EC2 (EC2 or SPOT) or Fargate (FARGATE or FARGATE_SPOT); EC2 and Fargate compute environments can't be mixed.
     */
    priority: Integer;
    /**
     * The set of compute environments mapped to a job queue and their order relative to each other. The job scheduler uses this parameter to determine which compute environment runs a specific job. Compute environments must be in the VALID state before you can associate them with a job queue. You can associate up to three compute environments with a job queue. All of the compute environments must be either EC2 (EC2 or SPOT) or Fargate (FARGATE or FARGATE_SPOT); EC2 and Fargate compute environments can't be mixed.  All compute environments that are associated with a job queue must share the same architecture. Batch doesn't support mixing compute environment architecture types in a single job queue. 
     */
    computeEnvironmentOrder: ComputeEnvironmentOrders;
    /**
     * The tags that you apply to the job queue to help you categorize and organize your resources. Each tag consists of a key and an optional value. For more information, see Tagging your Batch resources in Batch User Guide.
     */
    tags?: TagrisTagsMap;
  }
  export interface CreateJobQueueResponse {
    /**
     * The name of the job queue.
     */
    jobQueueName: String;
    /**
     * The Amazon Resource Name (ARN) of the job queue.
     */
    jobQueueArn: String;
  }
  export interface CreateSchedulingPolicyRequest {
    /**
     * The name of the scheduling policy. It can be up to 128 letters long. It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_).
     */
    name: String;
    /**
     * The fair share policy of the scheduling policy.
     */
    fairsharePolicy?: FairsharePolicy;
    /**
     * The tags that you apply to the scheduling policy to help you categorize and organize your resources. Each tag consists of a key and an optional value. For more information, see Tagging Amazon Web Services Resources in Amazon Web Services General Reference. These tags can be updated or removed using the TagResource and UntagResource API operations.
     */
    tags?: TagrisTagsMap;
  }
  export interface CreateSchedulingPolicyResponse {
    /**
     * The name of the scheduling policy.
     */
    name: String;
    /**
     * The Amazon Resource Name (ARN) of the scheduling policy. The format is aws:Partition:batch:Region:Account:scheduling-policy/Name . For example, aws:aws:batch:us-west-2:123456789012:scheduling-policy/MySchedulingPolicy.
     */
    arn: String;
  }
  export interface DeleteComputeEnvironmentRequest {
    /**
     * The name or Amazon Resource Name (ARN) of the compute environment to delete.
     */
    computeEnvironment: String;
  }
  export interface DeleteComputeEnvironmentResponse {
  }
  export interface DeleteJobQueueRequest {
    /**
     * The short name or full Amazon Resource Name (ARN) of the queue to delete.
     */
    jobQueue: String;
  }
  export interface DeleteJobQueueResponse {
  }
  export interface DeleteSchedulingPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the scheduling policy to delete.
     */
    arn: String;
  }
  export interface DeleteSchedulingPolicyResponse {
  }
  export interface DeregisterJobDefinitionRequest {
    /**
     * The name and revision (name:revision) or full Amazon Resource Name (ARN) of the job definition to deregister.
     */
    jobDefinition: String;
  }
  export interface DeregisterJobDefinitionResponse {
  }
  export interface DescribeComputeEnvironmentsRequest {
    /**
     * A list of up to 100 compute environment names or full Amazon Resource Name (ARN) entries.
     */
    computeEnvironments?: StringList;
    /**
     * The maximum number of cluster results returned by DescribeComputeEnvironments in paginated output. When this parameter is used, DescribeComputeEnvironments only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another DescribeComputeEnvironments request with the returned nextToken value. This value can be between 1 and 100. If this parameter isn't used, then DescribeComputeEnvironments returns up to 100 results and a nextToken value if applicable.
     */
    maxResults?: Integer;
    /**
     * The nextToken value returned from a previous paginated DescribeComputeEnvironments request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return.  Treat this token as an opaque identifier that's only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    nextToken?: String;
  }
  export interface DescribeComputeEnvironmentsResponse {
    /**
     * The list of compute environments.
     */
    computeEnvironments?: ComputeEnvironmentDetailList;
    /**
     * The nextToken value to include in a future DescribeComputeEnvironments request. When the results of a DescribeComputeEnvironments request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export interface DescribeJobDefinitionsRequest {
    /**
     * A list of up to 100 job definitions. Each entry in the list can either be an ARN in the format arn:aws:batch:${Region}:${Account}:job-definition/${JobDefinitionName}:${Revision} or a short version using the form ${JobDefinitionName}:${Revision}.
     */
    jobDefinitions?: StringList;
    /**
     * The maximum number of results returned by DescribeJobDefinitions in paginated output. When this parameter is used, DescribeJobDefinitions only returns maxResults results in a single page and a nextToken response element. The remaining results of the initial request can be seen by sending another DescribeJobDefinitions request with the returned nextToken value. This value can be between 1 and 100. If this parameter isn't used, then DescribeJobDefinitions returns up to 100 results and a nextToken value if applicable.
     */
    maxResults?: Integer;
    /**
     * The name of the job definition to describe.
     */
    jobDefinitionName?: String;
    /**
     * The status used to filter job definitions.
     */
    status?: String;
    /**
     * The nextToken value returned from a previous paginated DescribeJobDefinitions request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return.  Treat this token as an opaque identifier that's only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    nextToken?: String;
  }
  export interface DescribeJobDefinitionsResponse {
    /**
     * The list of job definitions.
     */
    jobDefinitions?: JobDefinitionList;
    /**
     * The nextToken value to include in a future DescribeJobDefinitions request. When the results of a DescribeJobDefinitions request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export interface DescribeJobQueuesRequest {
    /**
     * A list of up to 100 queue names or full queue Amazon Resource Name (ARN) entries.
     */
    jobQueues?: StringList;
    /**
     * The maximum number of results returned by DescribeJobQueues in paginated output. When this parameter is used, DescribeJobQueues only returns maxResults results in a single page and a nextToken response element. The remaining results of the initial request can be seen by sending another DescribeJobQueues request with the returned nextToken value. This value can be between 1 and 100. If this parameter isn't used, then DescribeJobQueues returns up to 100 results and a nextToken value if applicable.
     */
    maxResults?: Integer;
    /**
     * The nextToken value returned from a previous paginated DescribeJobQueues request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return.  Treat this token as an opaque identifier that's only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    nextToken?: String;
  }
  export interface DescribeJobQueuesResponse {
    /**
     * The list of job queues.
     */
    jobQueues?: JobQueueDetailList;
    /**
     * The nextToken value to include in a future DescribeJobQueues request. When the results of a DescribeJobQueues request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export interface DescribeJobsRequest {
    /**
     * A list of up to 100 job IDs.
     */
    jobs: StringList;
  }
  export interface DescribeJobsResponse {
    /**
     * The list of jobs.
     */
    jobs?: JobDetailList;
  }
  export interface DescribeSchedulingPoliciesRequest {
    /**
     * A list of up to 100 scheduling policy Amazon Resource Name (ARN) entries.
     */
    arns: StringList;
  }
  export interface DescribeSchedulingPoliciesResponse {
    /**
     * The list of scheduling policies.
     */
    schedulingPolicies?: SchedulingPolicyDetailList;
  }
  export interface Device {
    /**
     * The path for the device on the host container instance.
     */
    hostPath: String;
    /**
     * The path inside the container that's used to expose the host device. By default, the hostPath value is used.
     */
    containerPath?: String;
    /**
     * The explicit permissions to provide to the container for the device. By default, the container has permissions for read, write, and mknod for the device.
     */
    permissions?: DeviceCgroupPermissions;
  }
  export type DeviceCgroupPermission = "READ"|"WRITE"|"MKNOD"|string;
  export type DeviceCgroupPermissions = DeviceCgroupPermission[];
  export type DevicesList = Device[];
  export interface EFSAuthorizationConfig {
    /**
     * The Amazon EFS access point ID to use. If an access point is specified, the root directory value specified in the EFSVolumeConfiguration must either be omitted or set to / which enforces the path set on the EFS access point. If an access point is used, transit encryption must be enabled in the EFSVolumeConfiguration. For more information, see Working with Amazon EFS access points in the Amazon Elastic File System User Guide.
     */
    accessPointId?: String;
    /**
     * Whether or not to use the Batch job IAM role defined in a job definition when mounting the Amazon EFS file system. If enabled, transit encryption must be enabled in the EFSVolumeConfiguration. If this parameter is omitted, the default value of DISABLED is used. For more information, see Using Amazon EFS access points in the Batch User Guide. EFS IAM authorization requires that TransitEncryption be ENABLED and that a JobRoleArn is specified.
     */
    iam?: EFSAuthorizationConfigIAM;
  }
  export type EFSAuthorizationConfigIAM = "ENABLED"|"DISABLED"|string;
  export type EFSTransitEncryption = "ENABLED"|"DISABLED"|string;
  export interface EFSVolumeConfiguration {
    /**
     * The Amazon EFS file system ID to use.
     */
    fileSystemId: String;
    /**
     * The directory within the Amazon EFS file system to mount as the root directory inside the host. If this parameter is omitted, the root of the Amazon EFS volume is used instead. Specifying / has the same effect as omitting this parameter. The maximum length is 4,096 characters.  If an EFS access point is specified in the authorizationConfig, the root directory parameter must either be omitted or set to /, which enforces the path set on the Amazon EFS access point. 
     */
    rootDirectory?: String;
    /**
     * Determines whether to enable encryption for Amazon EFS data in transit between the Amazon ECS host and the Amazon EFS server. Transit encryption must be enabled if Amazon EFS IAM authorization is used. If this parameter is omitted, the default value of DISABLED is used. For more information, see Encrypting data in transit in the Amazon Elastic File System User Guide.
     */
    transitEncryption?: EFSTransitEncryption;
    /**
     * The port to use when sending encrypted data between the Amazon ECS host and the Amazon EFS server. If you don't specify a transit encryption port, it uses the port selection strategy that the Amazon EFS mount helper uses. The value must be between 0 and 65,535. For more information, see EFS mount helper in the Amazon Elastic File System User Guide.
     */
    transitEncryptionPort?: Integer;
    /**
     * The authorization configuration details for the Amazon EFS file system.
     */
    authorizationConfig?: EFSAuthorizationConfig;
  }
  export interface Ec2Configuration {
    /**
     * The image type to match with the instance type to select an AMI. The supported values are different for ECS and EKS resources.  ECS  If the imageIdOverride parameter isn't specified, then a recent Amazon ECS-optimized Amazon Linux 2 AMI (ECS_AL2) is used. If a new image type is specified in an update, but neither an imageId nor a imageIdOverride parameter is specified, then the latest Amazon ECS optimized AMI for that image type that's supported by Batch is used.  ECS_AL2   Amazon Linux 2: Default for all non-GPU instance families.  ECS_AL2_NVIDIA   Amazon Linux 2 (GPU): Default for all GPU instance families (for example P4 and G4) and can be used for all non Amazon Web Services Graviton-based instance types.  ECS_AL1   Amazon Linux. Amazon Linux has reached the end-of-life of standard support. For more information, see Amazon Linux AMI.    EKS  If the imageIdOverride parameter isn't specified, then a recent Amazon EKS-optimized Amazon Linux AMI (EKS_AL2) is used. If a new image type is specified in an update, but neither an imageId nor a imageIdOverride parameter is specified, then the latest Amazon EKS optimized AMI for that image type that Batch supports is used.  EKS_AL2   Amazon Linux 2: Default for all non-GPU instance families.  EKS_AL2_NVIDIA   Amazon Linux 2 (accelerated): Default for all GPU instance families (for example, P4 and G4) and can be used for all non Amazon Web Services Graviton-based instance types.    
     */
    imageType: ImageType;
    /**
     * The AMI ID used for instances launched in the compute environment that match the image type. This setting overrides the imageId set in the computeResource object.  The AMI that you choose for a compute environment must match the architecture of the instance types that you intend to use for that compute environment. For example, if your compute environment uses A1 instance types, the compute resource AMI that you choose must support ARM instances. Amazon ECS vends both x86 and ARM versions of the Amazon ECS-optimized Amazon Linux 2 AMI. For more information, see Amazon ECS-optimized Amazon Linux 2 AMI in the Amazon Elastic Container Service Developer Guide. 
     */
    imageIdOverride?: ImageIdOverride;
    /**
     * The Kubernetes version for the compute environment. If you don't specify a value, the latest version that Batch supports is used.
     */
    imageKubernetesVersion?: KubernetesVersion;
  }
  export type Ec2ConfigurationList = Ec2Configuration[];
  export interface EksAttemptContainerDetail {
    /**
     * The exit code for the job attempt. A non-zero exit code is considered failed.
     */
    exitCode?: Integer;
    /**
     * A short (255 max characters) human-readable string to provide additional details for a running or stopped container.
     */
    reason?: String;
  }
  export type EksAttemptContainerDetails = EksAttemptContainerDetail[];
  export interface EksAttemptDetail {
    /**
     * The details for the final status of the containers for this job attempt.
     */
    containers?: EksAttemptContainerDetails;
    /**
     * The name of the pod for this job attempt.
     */
    podName?: String;
    /**
     * The name of the node for this job attempt.
     */
    nodeName?: String;
    /**
     * The Unix timestamp (in milliseconds) for when the attempt was started (when the attempt transitioned from the STARTING state to the RUNNING state).
     */
    startedAt?: Long;
    /**
     * The Unix timestamp (in milliseconds) for when the attempt was stopped. This happens when the attempt transitioned from the RUNNING state to a terminal state, such as SUCCEEDED or FAILED.
     */
    stoppedAt?: Long;
    /**
     * A short, human-readable string to provide additional details for the current status of the job attempt.
     */
    statusReason?: String;
  }
  export type EksAttemptDetails = EksAttemptDetail[];
  export interface EksConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the Amazon EKS cluster. An example is arn:aws:eks:us-east-1:123456789012:cluster/ClusterForBatch . 
     */
    eksClusterArn: String;
    /**
     * The namespace of the Amazon EKS cluster. Batch manages pods in this namespace. The value can't left empty or null. It must be fewer than 64 characters long, can't be set to default, can't start with "kube-," and must match this regular expression: ^[a-z0-9]([-a-z0-9]*[a-z0-9])?$. For more information, see Namespaces in the Kubernetes documentation.
     */
    kubernetesNamespace: String;
  }
  export interface EksContainer {
    /**
     * The name of the container. If the name isn't specified, the default name "Default" is used. Each container in a pod must have a unique name.
     */
    name?: String;
    /**
     * The Docker image used to start the container.
     */
    image: String;
    /**
     * The image pull policy for the container. Supported values are Always, IfNotPresent, and Never. This parameter defaults to IfNotPresent. However, if the :latest tag is specified, it defaults to Always. For more information, see Updating images in the Kubernetes documentation.
     */
    imagePullPolicy?: String;
    /**
     * The entrypoint for the container. This isn't run within a shell. If this isn't specified, the ENTRYPOINT of the container image is used. Environment variable references are expanded using the container's environment. If the referenced environment variable doesn't exist, the reference in the command isn't changed. For example, if the reference is to "$(NAME1)" and the NAME1 environment variable doesn't exist, the command string will remain "$(NAME1)." $$ is replaced with $ and the resulting string isn't expanded. For example, $$(VAR_NAME) will be passed as $(VAR_NAME) whether or not the VAR_NAME environment variable exists. The entrypoint can't be updated. For more information, see ENTRYPOINT in the Dockerfile reference and Define a command and arguments for a container and Entrypoint in the Kubernetes documentation.
     */
    command?: StringList;
    /**
     * An array of arguments to the entrypoint. If this isn't specified, the CMD of the container image is used. This corresponds to the args member in the Entrypoint portion of the Pod in Kubernetes. Environment variable references are expanded using the container's environment. If the referenced environment variable doesn't exist, the reference in the command isn't changed. For example, if the reference is to "$(NAME1)" and the NAME1 environment variable doesn't exist, the command string will remain "$(NAME1)." $$ is replaced with $, and the resulting string isn't expanded. For example, $$(VAR_NAME) is passed as $(VAR_NAME) whether or not the VAR_NAME environment variable exists. For more information, see CMD in the Dockerfile reference and Define a command and arguments for a pod in the Kubernetes documentation.
     */
    args?: StringList;
    /**
     * The environment variables to pass to a container.  Environment variables cannot start with "AWS_BATCH". This naming convention is reserved for variables that Batch sets. 
     */
    env?: EksContainerEnvironmentVariables;
    /**
     * The type and amount of resources to assign to a container. The supported resources include memory, cpu, and nvidia.com/gpu. For more information, see Resource management for pods and containers in the Kubernetes documentation.
     */
    resources?: EksContainerResourceRequirements;
    /**
     * The volume mounts for the container. Batch supports emptyDir, hostPath, and secret volume types. For more information about volumes and volume mounts in Kubernetes, see Volumes in the Kubernetes documentation.
     */
    volumeMounts?: EksContainerVolumeMounts;
    /**
     * The security context for a job. For more information, see Configure a security context for a pod or container in the Kubernetes documentation.
     */
    securityContext?: EksContainerSecurityContext;
  }
  export interface EksContainerDetail {
    /**
     * The name of the container. If the name isn't specified, the default name "Default" is used. Each container in a pod must have a unique name.
     */
    name?: String;
    /**
     * The Docker image used to start the container.
     */
    image?: String;
    /**
     * The image pull policy for the container. Supported values are Always, IfNotPresent, and Never. This parameter defaults to Always if the :latest tag is specified, IfNotPresent otherwise. For more information, see Updating images in the Kubernetes documentation.
     */
    imagePullPolicy?: String;
    /**
     * The entrypoint for the container. For more information, see Entrypoint in the Kubernetes documentation.
     */
    command?: StringList;
    /**
     * An array of arguments to the entrypoint. If this isn't specified, the CMD of the container image is used. This corresponds to the args member in the Entrypoint portion of the Pod in Kubernetes. Environment variable references are expanded using the container's environment. If the referenced environment variable doesn't exist, the reference in the command isn't changed. For example, if the reference is to "$(NAME1)" and the NAME1 environment variable doesn't exist, the command string will remain "$(NAME1)". $$ is replaced with $ and the resulting string isn't expanded. For example, $$(VAR_NAME) is passed as $(VAR_NAME) whether or not the VAR_NAME environment variable exists. For more information, see CMD in the Dockerfile reference and Define a command and arguments for a pod in the Kubernetes documentation.
     */
    args?: StringList;
    /**
     * The environment variables to pass to a container.  Environment variables cannot start with "AWS_BATCH". This naming convention is reserved for variables that Batch sets. 
     */
    env?: EksContainerEnvironmentVariables;
    /**
     * The type and amount of resources to assign to a container. The supported resources include memory, cpu, and nvidia.com/gpu. For more information, see Resource management for pods and containers in the Kubernetes documentation.
     */
    resources?: EksContainerResourceRequirements;
    /**
     * The exit code for the job attempt. A non-zero exit code is considered failed.
     */
    exitCode?: Integer;
    /**
     * A short human-readable string to provide additional details for a running or stopped container. It can be up to 255 characters long.
     */
    reason?: String;
    /**
     * The volume mounts for the container. Batch supports emptyDir, hostPath, and secret volume types. For more information about volumes and volume mounts in Kubernetes, see Volumes in the Kubernetes documentation.
     */
    volumeMounts?: EksContainerVolumeMounts;
    /**
     * The security context for a job. For more information, see Configure a security context for a pod or container in the Kubernetes documentation.
     */
    securityContext?: EksContainerSecurityContext;
  }
  export type EksContainerDetails = EksContainerDetail[];
  export interface EksContainerEnvironmentVariable {
    /**
     * The name of the environment variable.
     */
    name: String;
    /**
     * The value of the environment variable.
     */
    value?: String;
  }
  export type EksContainerEnvironmentVariables = EksContainerEnvironmentVariable[];
  export interface EksContainerOverride {
    /**
     * The override of the Docker image that's used to start the container.
     */
    image?: String;
    /**
     * The command to send to the container that overrides the default command from the Docker image or the job definition.
     */
    command?: StringList;
    /**
     * The arguments to the entrypoint to send to the container that overrides the default arguments from the Docker image or the job definition. For more information, see CMD in the Dockerfile reference and Define a command an arguments for a pod in the Kubernetes documentation.
     */
    args?: StringList;
    /**
     * The environment variables to send to the container. You can add new environment variables, which are added to the container at launch. Or, you can override the existing environment variables from the Docker image or the job definition.  Environment variables cannot start with "AWS_BATCH". This naming convention is reserved for variables that Batch sets. 
     */
    env?: EksContainerEnvironmentVariables;
    /**
     * The type and amount of resources to assign to a container. These override the settings in the job definition. The supported resources include memory, cpu, and nvidia.com/gpu. For more information, see Resource management for pods and containers in the Kubernetes documentation.
     */
    resources?: EksContainerResourceRequirements;
  }
  export type EksContainerOverrideList = EksContainerOverride[];
  export interface EksContainerResourceRequirements {
    /**
     * The type and quantity of the resources to reserve for the container. The values vary based on the name that's specified. Resources can be requested using either the limits or the requests objects.  memory  The memory hard limit (in MiB) for the container, using whole integers, with a "Mi" suffix. If your container attempts to exceed the memory specified, the container is terminated. You must specify at least 4 MiB of memory for a job. memory can be specified in limits, requests, or both. If memory is specified in both places, then the value that's specified in limits must be equal to the value that's specified in requests.  To maximize your resource utilization, provide your jobs with as much memory as possible for the specific instance type that you are using. To learn how, see Memory management in the Batch User Guide.   cpu  The number of CPUs that's reserved for the container. Values must be an even multiple of 0.25. cpu can be specified in limits, requests, or both. If cpu is specified in both places, then the value that's specified in limits must be at least as large as the value that's specified in requests.  nvidia.com/gpu  The number of GPUs that's reserved for the container. Values must be a whole integer. memory can be specified in limits, requests, or both. If memory is specified in both places, then the value that's specified in limits must be equal to the value that's specified in requests.  
     */
    limits?: EksLimits;
    /**
     * The type and quantity of the resources to request for the container. The values vary based on the name that's specified. Resources can be requested by using either the limits or the requests objects.  memory  The memory hard limit (in MiB) for the container, using whole integers, with a "Mi" suffix. If your container attempts to exceed the memory specified, the container is terminated. You must specify at least 4 MiB of memory for a job. memory can be specified in limits, requests, or both. If memory is specified in both, then the value that's specified in limits must be equal to the value that's specified in requests.  If you're trying to maximize your resource utilization by providing your jobs as much memory as possible for a particular instance type, see Memory management in the Batch User Guide.   cpu  The number of CPUs that are reserved for the container. Values must be an even multiple of 0.25. cpu can be specified in limits, requests, or both. If cpu is specified in both, then the value that's specified in limits must be at least as large as the value that's specified in requests.  nvidia.com/gpu  The number of GPUs that are reserved for the container. Values must be a whole integer. nvidia.com/gpu can be specified in limits, requests, or both. If nvidia.com/gpu is specified in both, then the value that's specified in limits must be equal to the value that's specified in requests.  
     */
    requests?: EksRequests;
  }
  export interface EksContainerSecurityContext {
    /**
     * When this parameter is specified, the container is run as the specified user ID (uid). If this parameter isn't specified, the default is the user that's specified in the image metadata. This parameter maps to RunAsUser and MustRanAs policy in the Users and groups pod security policies in the Kubernetes documentation.
     */
    runAsUser?: Long;
    /**
     * When this parameter is specified, the container is run as the specified group ID (gid). If this parameter isn't specified, the default is the group that's specified in the image metadata. This parameter maps to RunAsGroup and MustRunAs policy in the Users and groups pod security policies in the Kubernetes documentation.
     */
    runAsGroup?: Long;
    /**
     * When this parameter is true, the container is given elevated permissions on the host container instance. The level of permissions are similar to the root user permissions. The default value is false. This parameter maps to privileged policy in the Privileged pod security policies in the Kubernetes documentation.
     */
    privileged?: Boolean;
    /**
     * When this parameter is true, the container is given read-only access to its root file system. The default value is false. This parameter maps to ReadOnlyRootFilesystem policy in the Volumes and file systems pod security policies in the Kubernetes documentation.
     */
    readOnlyRootFilesystem?: Boolean;
    /**
     * When this parameter is specified, the container is run as a user with a uid other than 0. If this parameter isn't specified, so such rule is enforced. This parameter maps to RunAsUser and MustRunAsNonRoot policy in the Users and groups pod security policies in the Kubernetes documentation.
     */
    runAsNonRoot?: Boolean;
  }
  export interface EksContainerVolumeMount {
    /**
     * The name the volume mount. This must match the name of one of the volumes in the pod.
     */
    name?: String;
    /**
     * The path on the container where the volume is mounted.
     */
    mountPath?: String;
    /**
     * If this value is true, the container has read-only access to the volume. Otherwise, the container can write to the volume. The default value is false.
     */
    readOnly?: Boolean;
  }
  export type EksContainerVolumeMounts = EksContainerVolumeMount[];
  export type EksContainers = EksContainer[];
  export interface EksEmptyDir {
    /**
     * The medium to store the volume. The default value is an empty string, which uses the storage of the node.  ""   (Default) Use the disk storage of the node.  "Memory"  Use the tmpfs volume that's backed by the RAM of the node. Contents of the volume are lost when the node reboots, and any storage on the volume counts against the container's memory limit.  
     */
    medium?: String;
    /**
     * The maximum size of the volume. By default, there's no maximum size defined.
     */
    sizeLimit?: Quantity;
  }
  export interface EksHostPath {
    /**
     * The path of the file or directory on the host to mount into containers on the pod.
     */
    path?: String;
  }
  export type EksLabelsMap = {[key: string]: String};
  export type EksLimits = {[key: string]: Quantity};
  export interface EksMetadata {
    /**
     * Key-value pairs used to identify, sort, and organize cube resources. Can contain up to 63 uppercase letters, lowercase letters, numbers, hyphens (-), and underscores (_). Labels can be added or modified at any time. Each resource can have multiple labels, but each key must be unique for a given object.
     */
    labels?: EksLabelsMap;
  }
  export interface EksPodProperties {
    /**
     * The name of the service account that's used to run the pod. For more information, see Kubernetes service accounts and Configure a Kubernetes service account to assume an IAM role in the Amazon EKS User Guide and Configure service accounts for pods in the Kubernetes documentation.
     */
    serviceAccountName?: String;
    /**
     * Indicates if the pod uses the hosts' network IP address. The default value is true. Setting this to false enables the Kubernetes pod networking model. Most Batch workloads are egress-only and don't require the overhead of IP allocation for each pod for incoming connections. For more information, see Host namespaces and Pod networking in the Kubernetes documentation.
     */
    hostNetwork?: Boolean;
    /**
     * The DNS policy for the pod. The default value is ClusterFirst. If the hostNetwork parameter is not specified, the default is ClusterFirstWithHostNet. ClusterFirst indicates that any DNS query that does not match the configured cluster domain suffix is forwarded to the upstream nameserver inherited from the node. For more information, see Pod's DNS policy in the Kubernetes documentation. Valid values: Default | ClusterFirst | ClusterFirstWithHostNet 
     */
    dnsPolicy?: String;
    /**
     * The properties of the container that's used on the Amazon EKS pod.
     */
    containers?: EksContainers;
    /**
     * Specifies the volumes for a job definition that uses Amazon EKS resources.
     */
    volumes?: EksVolumes;
    /**
     * Metadata about the Kubernetes pod. For more information, see Understanding Kubernetes Objects in the Kubernetes documentation.
     */
    metadata?: EksMetadata;
  }
  export interface EksPodPropertiesDetail {
    /**
     * The name of the service account that's used to run the pod. For more information, see Kubernetes service accounts and Configure a Kubernetes service account to assume an IAM role in the Amazon EKS User Guide and Configure service accounts for pods in the Kubernetes documentation.
     */
    serviceAccountName?: String;
    /**
     * Indicates if the pod uses the hosts' network IP address. The default value is true. Setting this to false enables the Kubernetes pod networking model. Most Batch workloads are egress-only and don't require the overhead of IP allocation for each pod for incoming connections. For more information, see Host namespaces and Pod networking in the Kubernetes documentation.
     */
    hostNetwork?: Boolean;
    /**
     * The DNS policy for the pod. The default value is ClusterFirst. If the hostNetwork parameter is not specified, the default is ClusterFirstWithHostNet. ClusterFirst indicates that any DNS query that does not match the configured cluster domain suffix is forwarded to the upstream nameserver inherited from the node. If no value was specified for dnsPolicy in the RegisterJobDefinition API operation, then no value will be returned for dnsPolicy by either of DescribeJobDefinitions or DescribeJobs API operations. The pod spec setting will contain either ClusterFirst or ClusterFirstWithHostNet, depending on the value of the hostNetwork parameter. For more information, see Pod's DNS policy in the Kubernetes documentation. Valid values: Default | ClusterFirst | ClusterFirstWithHostNet 
     */
    dnsPolicy?: String;
    /**
     * The properties of the container that's used on the Amazon EKS pod.
     */
    containers?: EksContainerDetails;
    /**
     * Specifies the volumes for a job definition using Amazon EKS resources.
     */
    volumes?: EksVolumes;
    /**
     * The name of the pod for this job.
     */
    podName?: String;
    /**
     * The name of the node for this job.
     */
    nodeName?: String;
    metadata?: EksMetadata;
  }
  export interface EksPodPropertiesOverride {
    /**
     * The overrides for the container that's used on the Amazon EKS pod.
     */
    containers?: EksContainerOverrideList;
    /**
     * Metadata about the overrides for the container that's used on the Amazon EKS pod.
     */
    metadata?: EksMetadata;
  }
  export interface EksProperties {
    /**
     * The properties for the Kubernetes pod resources of a job.
     */
    podProperties?: EksPodProperties;
  }
  export interface EksPropertiesDetail {
    /**
     * The properties for the Kubernetes pod resources of a job.
     */
    podProperties?: EksPodPropertiesDetail;
  }
  export interface EksPropertiesOverride {
    /**
     * The overrides for the Kubernetes pod resources of a job.
     */
    podProperties?: EksPodPropertiesOverride;
  }
  export type EksRequests = {[key: string]: Quantity};
  export interface EksSecret {
    /**
     * The name of the secret. The name must be allowed as a DNS subdomain name. For more information, see DNS subdomain names in the Kubernetes documentation.
     */
    secretName: String;
    /**
     * Specifies whether the secret or the secret's keys must be defined.
     */
    optional?: Boolean;
  }
  export interface EksVolume {
    /**
     * The name of the volume. The name must be allowed as a DNS subdomain name. For more information, see DNS subdomain names in the Kubernetes documentation.
     */
    name: String;
    /**
     * Specifies the configuration of a Kubernetes hostPath volume. For more information, see hostPath in the Kubernetes documentation.
     */
    hostPath?: EksHostPath;
    /**
     * Specifies the configuration of a Kubernetes emptyDir volume. For more information, see emptyDir in the Kubernetes documentation.
     */
    emptyDir?: EksEmptyDir;
    /**
     * Specifies the configuration of a Kubernetes secret volume. For more information, see secret in the Kubernetes documentation.
     */
    secret?: EksSecret;
  }
  export type EksVolumes = EksVolume[];
  export type EnvironmentVariables = KeyValuePair[];
  export interface EphemeralStorage {
    /**
     * The total amount, in GiB, of ephemeral storage to set for the task. The minimum supported value is 21 GiB and the maximum supported value is 200 GiB.
     */
    sizeInGiB: Integer;
  }
  export interface EvaluateOnExit {
    /**
     * Contains a glob pattern to match against the StatusReason returned for a job. The pattern can contain up to 512 characters. It can contain letters, numbers, periods (.), colons (:), and white spaces (including spaces or tabs). It can optionally end with an asterisk (*) so that only the start of the string needs to be an exact match.
     */
    onStatusReason?: String;
    /**
     * Contains a glob pattern to match against the Reason returned for a job. The pattern can contain up to 512 characters. It can contain letters, numbers, periods (.), colons (:), and white space (including spaces and tabs). It can optionally end with an asterisk (*) so that only the start of the string needs to be an exact match.
     */
    onReason?: String;
    /**
     * Contains a glob pattern to match against the decimal representation of the ExitCode returned for a job. The pattern can be up to 512 characters long. It can contain only numbers, and can end with an asterisk (*) so that only the start of the string needs to be an exact match. The string can contain up to 512 characters.
     */
    onExitCode?: String;
    /**
     * Specifies the action to take if all of the specified conditions (onStatusReason, onReason, and onExitCode) are met. The values aren't case sensitive.
     */
    action: RetryAction;
  }
  export type EvaluateOnExitList = EvaluateOnExit[];
  export interface FairsharePolicy {
    /**
     * The amount of time (in seconds) to use to calculate a fair share percentage for each fair share identifier in use. A value of zero (0) indicates that only current usage is measured. The decay allows for more recently run jobs to have more weight than jobs that ran earlier. The maximum supported value is 604800 (1 week).
     */
    shareDecaySeconds?: Integer;
    /**
     * A value used to reserve some of the available maximum vCPU for fair share identifiers that aren't already used. The reserved ratio is (computeReservation/100)^ActiveFairShares  where  ActiveFairShares  is the number of active fair share identifiers. For example, a computeReservation value of 50 indicates that Batchreserves 50% of the maximum available vCPU if there's only one fair share identifier. It reserves 25% if there are two fair share identifiers. It reserves 12.5% if there are three fair share identifiers. A computeReservation value of 25 indicates that Batch should reserve 25% of the maximum available vCPU if there's only one fair share identifier, 6.25% if there are two fair share identifiers, and 1.56% if there are three fair share identifiers. The minimum value is 0 and the maximum value is 99.
     */
    computeReservation?: Integer;
    /**
     * An array of SharedIdentifier objects that contain the weights for the fair share identifiers for the fair share policy. Fair share identifiers that aren't included have a default weight of 1.0.
     */
    shareDistribution?: ShareAttributesList;
  }
  export interface FargatePlatformConfiguration {
    /**
     * The Fargate platform version where the jobs are running. A platform version is specified only for jobs that are running on Fargate resources. If one isn't specified, the LATEST platform version is used by default. This uses a recent, approved version of the Fargate platform for compute resources. For more information, see Fargate platform versions in the Amazon Elastic Container Service Developer Guide.
     */
    platformVersion?: String;
  }
  export type Float = number;
  export interface Host {
    /**
     * The path on the host container instance that's presented to the container. If this parameter is empty, then the Docker daemon has assigned a host path for you. If this parameter contains a file location, then the data volume persists at the specified location on the host container instance until you delete it manually. If the source path location doesn't exist on the host container instance, the Docker daemon creates it. If the location does exist, the contents of the source path folder are exported.  This parameter isn't applicable to jobs that run on Fargate resources. Don't provide this for these jobs. 
     */
    sourcePath?: String;
  }
  export type ImageIdOverride = string;
  export type ImageType = string;
  export type Integer = number;
  export type JQState = "ENABLED"|"DISABLED"|string;
  export type JQStatus = "CREATING"|"UPDATING"|"DELETING"|"DELETED"|"VALID"|"INVALID"|string;
  export interface JobDefinition {
    /**
     * The name of the job definition.
     */
    jobDefinitionName: String;
    /**
     * The Amazon Resource Name (ARN) for the job definition.
     */
    jobDefinitionArn: String;
    /**
     * The revision of the job definition.
     */
    revision: Integer;
    /**
     * The status of the job definition.
     */
    status?: String;
    /**
     * The type of job definition. It's either container or multinode. If the job is run on Fargate resources, then multinode isn't supported. For more information about multi-node parallel jobs, see Creating a multi-node parallel job definition in the Batch User Guide.
     */
    type: String;
    /**
     * The scheduling priority of the job definition. This only affects jobs in job queues with a fair share policy. Jobs with a higher scheduling priority are scheduled before jobs with a lower scheduling priority.
     */
    schedulingPriority?: Integer;
    /**
     * Default parameters or parameter substitution placeholders that are set in the job definition. Parameters are specified as a key-value pair mapping. Parameters in a SubmitJob request override any corresponding parameter defaults from the job definition. For more information about specifying parameters, see Job definition parameters in the Batch User Guide.
     */
    parameters?: ParametersMap;
    /**
     * The retry strategy to use for failed jobs that are submitted with this job definition.
     */
    retryStrategy?: RetryStrategy;
    /**
     * An object with various properties specific to Amazon ECS based jobs. Valid values are containerProperties, eksProperties, and nodeProperties. Only one can be specified.
     */
    containerProperties?: ContainerProperties;
    /**
     * The timeout time for jobs that are submitted with this job definition. After the amount of time you specify passes, Batch terminates your jobs if they aren't finished.
     */
    timeout?: JobTimeout;
    /**
     * An object with various properties that are specific to multi-node parallel jobs. Valid values are containerProperties, eksProperties, and nodeProperties. Only one can be specified.  If the job runs on Fargate resources, don't specify nodeProperties. Use containerProperties instead. 
     */
    nodeProperties?: NodeProperties;
    /**
     * The tags that are applied to the job definition.
     */
    tags?: TagrisTagsMap;
    /**
     * Specifies whether to propagate the tags from the job or job definition to the corresponding Amazon ECS task. If no value is specified, the tags aren't propagated. Tags can only be propagated to the tasks when the tasks are created. For tags with the same name, job tags are given priority over job definitions tags. If the total number of combined tags from the job and job definition is over 50, the job is moved to the FAILED state.
     */
    propagateTags?: Boolean;
    /**
     * The platform capabilities required by the job definition. If no value is specified, it defaults to EC2. Jobs run on Fargate resources specify FARGATE.
     */
    platformCapabilities?: PlatformCapabilityList;
    /**
     * An object with various properties that are specific to Amazon EKS based jobs. Valid values are containerProperties, eksProperties, and nodeProperties. Only one can be specified.
     */
    eksProperties?: EksProperties;
    /**
     * The orchestration type of the compute environment. The valid values are ECS (default) or EKS.
     */
    containerOrchestrationType?: OrchestrationType;
  }
  export type JobDefinitionList = JobDefinition[];
  export type JobDefinitionType = "container"|"multinode"|string;
  export interface JobDependency {
    /**
     * The job ID of the Batch job that's associated with this dependency.
     */
    jobId?: String;
    /**
     * The type of the job dependency.
     */
    type?: ArrayJobDependency;
  }
  export type JobDependencyList = JobDependency[];
  export interface JobDetail {
    /**
     * The Amazon Resource Name (ARN) of the job.
     */
    jobArn?: String;
    /**
     * The job name.
     */
    jobName: String;
    /**
     * The job ID.
     */
    jobId: String;
    /**
     * The Amazon Resource Name (ARN) of the job queue that the job is associated with.
     */
    jobQueue: String;
    /**
     * The current status for the job.  If your jobs don't progress to STARTING, see Jobs stuck in RUNNABLE status in the troubleshooting section of the Batch User Guide. 
     */
    status: JobStatus;
    /**
     * The share identifier for the job.
     */
    shareIdentifier?: String;
    /**
     * The scheduling policy of the job definition. This only affects jobs in job queues with a fair share policy. Jobs with a higher scheduling priority are scheduled before jobs with a lower scheduling priority.
     */
    schedulingPriority?: Integer;
    /**
     * A list of job attempts that are associated with this job.
     */
    attempts?: AttemptDetails;
    /**
     * A short, human-readable string to provide more details for the current status of the job.
     */
    statusReason?: String;
    /**
     * The Unix timestamp (in milliseconds) for when the job was created. For non-array jobs and parent array jobs, this is when the job entered the SUBMITTED state. This is specifically at the time SubmitJob was called. For array child jobs, this is when the child job was spawned by its parent and entered the PENDING state.
     */
    createdAt?: Long;
    /**
     * The retry strategy to use for this job if an attempt fails.
     */
    retryStrategy?: RetryStrategy;
    /**
     * The Unix timestamp (in milliseconds) for when the job was started. More specifically, it's when the job transitioned from the STARTING state to the RUNNING state. This parameter isn't provided for child jobs of array jobs or multi-node parallel jobs.
     */
    startedAt: Long;
    /**
     * The Unix timestamp (in milliseconds) for when the job was stopped. More specifically, it's when the job transitioned from the RUNNING state to a terminal state, such as SUCCEEDED or FAILED.
     */
    stoppedAt?: Long;
    /**
     * A list of job IDs that this job depends on.
     */
    dependsOn?: JobDependencyList;
    /**
     * The Amazon Resource Name (ARN) of the job definition that this job uses.
     */
    jobDefinition: String;
    /**
     * Additional parameters that are passed to the job that replace parameter substitution placeholders or override any corresponding parameter defaults from the job definition.
     */
    parameters?: ParametersMap;
    /**
     * An object that represents the details for the container that's associated with the job.
     */
    container?: ContainerDetail;
    /**
     * An object that represents the details of a node that's associated with a multi-node parallel job.
     */
    nodeDetails?: NodeDetails;
    /**
     * An object that represents the node properties of a multi-node parallel job.  This isn't applicable to jobs that are running on Fargate resources. 
     */
    nodeProperties?: NodeProperties;
    /**
     * The array properties of the job, if it's an array job.
     */
    arrayProperties?: ArrayPropertiesDetail;
    /**
     * The timeout configuration for the job.
     */
    timeout?: JobTimeout;
    /**
     * The tags that are applied to the job.
     */
    tags?: TagrisTagsMap;
    /**
     * Specifies whether to propagate the tags from the job or job definition to the corresponding Amazon ECS task. If no value is specified, the tags aren't propagated. Tags can only be propagated to the tasks when the tasks are created. For tags with the same name, job tags are given priority over job definitions tags. If the total number of combined tags from the job and job definition is over 50, the job is moved to the FAILED state.
     */
    propagateTags?: Boolean;
    /**
     * The platform capabilities required by the job definition. If no value is specified, it defaults to EC2. Jobs run on Fargate resources specify FARGATE.
     */
    platformCapabilities?: PlatformCapabilityList;
    /**
     * An object with various properties that are specific to Amazon EKS based jobs. Only one of container, eksProperties, or nodeDetails is specified.
     */
    eksProperties?: EksPropertiesDetail;
    /**
     * A list of job attempts that are associated with this job.
     */
    eksAttempts?: EksAttemptDetails;
    /**
     * Indicates whether the job is canceled.
     */
    isCancelled?: Boolean;
    /**
     * Indicates whether the job is terminated.
     */
    isTerminated?: Boolean;
  }
  export type JobDetailList = JobDetail[];
  export type JobExecutionTimeoutMinutes = number;
  export interface JobQueueDetail {
    /**
     * The job queue name.
     */
    jobQueueName: String;
    /**
     * The Amazon Resource Name (ARN) of the job queue.
     */
    jobQueueArn: String;
    /**
     * Describes the ability of the queue to accept new jobs. If the job queue state is ENABLED, it can accept jobs. If the job queue state is DISABLED, new jobs can't be added to the queue, but jobs already in the queue can finish.
     */
    state: JQState;
    /**
     * The Amazon Resource Name (ARN) of the scheduling policy. The format is aws:Partition:batch:Region:Account:scheduling-policy/Name . For example, aws:aws:batch:us-west-2:123456789012:scheduling-policy/MySchedulingPolicy.
     */
    schedulingPolicyArn?: String;
    /**
     * The status of the job queue (for example, CREATING or VALID).
     */
    status?: JQStatus;
    /**
     * A short, human-readable string to provide additional details for the current status of the job queue.
     */
    statusReason?: String;
    /**
     * The priority of the job queue. Job queues with a higher priority (or a higher integer value for the priority parameter) are evaluated first when associated with the same compute environment. Priority is determined in descending order. For example, a job queue with a priority value of 10 is given scheduling preference over a job queue with a priority value of 1. All of the compute environments must be either EC2 (EC2 or SPOT) or Fargate (FARGATE or FARGATE_SPOT). EC2 and Fargate compute environments can't be mixed.
     */
    priority: Integer;
    /**
     * The compute environments that are attached to the job queue and the order that job placement is preferred. Compute environments are selected for job placement in ascending order.
     */
    computeEnvironmentOrder: ComputeEnvironmentOrders;
    /**
     * The tags that are applied to the job queue. For more information, see Tagging your Batch resources in Batch User Guide.
     */
    tags?: TagrisTagsMap;
  }
  export type JobQueueDetailList = JobQueueDetail[];
  export type JobStatus = "SUBMITTED"|"PENDING"|"RUNNABLE"|"STARTING"|"RUNNING"|"SUCCEEDED"|"FAILED"|string;
  export interface JobSummary {
    /**
     * The Amazon Resource Name (ARN) of the job.
     */
    jobArn?: String;
    /**
     * The job ID.
     */
    jobId: String;
    /**
     * The job name.
     */
    jobName: String;
    /**
     * The Unix timestamp (in milliseconds) for when the job was created. For non-array jobs and parent array jobs, this is when the job entered the SUBMITTED state (at the time SubmitJob was called). For array child jobs, this is when the child job was spawned by its parent and entered the PENDING state.
     */
    createdAt?: Long;
    /**
     * The current status for the job.
     */
    status?: JobStatus;
    /**
     * A short, human-readable string to provide more details for the current status of the job.
     */
    statusReason?: String;
    /**
     * The Unix timestamp for when the job was started. More specifically, it's when the job transitioned from the STARTING state to the RUNNING state.
     */
    startedAt?: Long;
    /**
     * The Unix timestamp for when the job was stopped. More specifically, it's when the job transitioned from the RUNNING state to a terminal state, such as SUCCEEDED or FAILED.
     */
    stoppedAt?: Long;
    /**
     * An object that represents the details of the container that's associated with the job.
     */
    container?: ContainerSummary;
    /**
     * The array properties of the job, if it's an array job.
     */
    arrayProperties?: ArrayPropertiesSummary;
    /**
     * The node properties for a single node in a job summary list.  This isn't applicable to jobs that are running on Fargate resources. 
     */
    nodeProperties?: NodePropertiesSummary;
    /**
     * The Amazon Resource Name (ARN) of the job definition.
     */
    jobDefinition?: String;
  }
  export type JobSummaryList = JobSummary[];
  export interface JobTimeout {
    /**
     * The job timeout time (in seconds) that's measured from the job attempt's startedAt timestamp. After this time passes, Batch terminates your jobs if they aren't finished. The minimum value for the timeout is 60 seconds. For array jobs, the timeout applies to the child jobs, not to the parent array job. For multi-node parallel (MNP) jobs, the timeout applies to the whole job, not to the individual nodes.
     */
    attemptDurationSeconds?: Integer;
  }
  export interface KeyValuePair {
    /**
     * The name of the key-value pair. For environment variables, this is the name of the environment variable.
     */
    name?: String;
    /**
     * The value of the key-value pair. For environment variables, this is the value of the environment variable.
     */
    value?: String;
  }
  export interface KeyValuesPair {
    /**
     * The name of the filter. Filter names are case sensitive.
     */
    name?: String;
    /**
     * The filter values.
     */
    values?: StringList;
  }
  export type KubernetesVersion = string;
  export interface LaunchTemplateSpecification {
    /**
     * The ID of the launch template.
     */
    launchTemplateId?: String;
    /**
     * The name of the launch template.
     */
    launchTemplateName?: String;
    /**
     * The version number of the launch template, $Latest, or $Default. If the value is $Latest, the latest version of the launch template is used. If the value is $Default, the default version of the launch template is used.  If the AMI ID that's used in a compute environment is from the launch template, the AMI isn't changed when the compute environment is updated. It's only changed if the updateToLatestImageVersion parameter for the compute environment is set to true. During an infrastructure update, if either $Latest or $Default is specified, Batch re-evaluates the launch template version, and it might use a different version of the launch template. This is the case even if the launch template isn't specified in the update. When updating a compute environment, changing the launch template requires an infrastructure update of the compute environment. For more information, see Updating compute environments in the Batch User Guide.  Default: $Default.
     */
    version?: String;
  }
  export interface LinuxParameters {
    /**
     * Any of the host devices to expose to the container. This parameter maps to Devices in the Create a container section of the Docker Remote API and the --device option to docker run.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't provide it for these jobs. 
     */
    devices?: DevicesList;
    /**
     * If true, run an init process inside the container that forwards signals and reaps processes. This parameter maps to the --init option to docker run. This parameter requires version 1.25 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log in to your container instance and run the following command: sudo docker version | grep "Server API version" 
     */
    initProcessEnabled?: Boolean;
    /**
     * The value for the size (in MiB) of the /dev/shm volume. This parameter maps to the --shm-size option to docker run.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't provide it for these jobs. 
     */
    sharedMemorySize?: Integer;
    /**
     * The container path, mount options, and size (in MiB) of the tmpfs mount. This parameter maps to the --tmpfs option to docker run.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't provide this parameter for this resource type. 
     */
    tmpfs?: TmpfsList;
    /**
     * The total amount of swap memory (in MiB) a container can use. This parameter is translated to the --memory-swap option to docker run where the value is the sum of the container memory plus the maxSwap value. For more information, see  --memory-swap details in the Docker documentation. If a maxSwap value of 0 is specified, the container doesn't use swap. Accepted values are 0 or any positive integer. If the maxSwap parameter is omitted, the container doesn't use the swap configuration for the container instance that it's running on. A maxSwap value must be set for the swappiness parameter to be used.  This parameter isn't applicable to jobs that are running on Fargate resources. Don't provide it for these jobs. 
     */
    maxSwap?: Integer;
    /**
     * You can use this parameter to tune a container's memory swappiness behavior. A swappiness value of 0 causes swapping to not occur unless absolutely necessary. A swappiness value of 100 causes pages to be swapped aggressively. Valid values are whole numbers between 0 and 100. If the swappiness parameter isn't specified, a default value of 60 is used. If a value isn't specified for maxSwap, then this parameter is ignored. If maxSwap is set to 0, the container doesn't use swap. This parameter maps to the --memory-swappiness option to docker run. Consider the following when you use a per-container swap configuration.   Swap space must be enabled and allocated on the container instance for the containers to use.  By default, the Amazon ECS optimized AMIs don't have swap enabled. You must enable swap on the instance to use this feature. For more information, see Instance store swap volumes in the Amazon EC2 User Guide for Linux Instances or How do I allocate memory to work as swap space in an Amazon EC2 instance by using a swap file?     The swap space parameters are only supported for job definitions using EC2 resources.   If the maxSwap and swappiness parameters are omitted from a job definition, each container has a default swappiness value of 60. Moreover, the total swap usage is limited to two times the memory reservation of the container.    This parameter isn't applicable to jobs that are running on Fargate resources. Don't provide it for these jobs. 
     */
    swappiness?: Integer;
  }
  export type ListJobsFilterList = KeyValuesPair[];
  export interface ListJobsRequest {
    /**
     * The name or full Amazon Resource Name (ARN) of the job queue used to list jobs.
     */
    jobQueue?: String;
    /**
     * The job ID for an array job. Specifying an array job ID with this parameter lists all child jobs from within the specified array.
     */
    arrayJobId?: String;
    /**
     * The job ID for a multi-node parallel job. Specifying a multi-node parallel job ID with this parameter lists all nodes that are associated with the specified job.
     */
    multiNodeJobId?: String;
    /**
     * The job status used to filter jobs in the specified queue. If the filters parameter is specified, the jobStatus parameter is ignored and jobs with any status are returned. If you don't specify a status, only RUNNING jobs are returned.
     */
    jobStatus?: JobStatus;
    /**
     * The maximum number of results returned by ListJobs in paginated output. When this parameter is used, ListJobs only returns maxResults results in a single page and a nextToken response element. The remaining results of the initial request can be seen by sending another ListJobs request with the returned nextToken value. This value can be between 1 and 100. If this parameter isn't used, then ListJobs returns up to 100 results and a nextToken value if applicable.
     */
    maxResults?: Integer;
    /**
     * The nextToken value returned from a previous paginated ListJobs request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return.  Treat this token as an opaque identifier that's only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    nextToken?: String;
    /**
     * The filter to apply to the query. Only one filter can be used at a time. When the filter is used, jobStatus is ignored. The filter doesn't apply to child jobs in an array or multi-node parallel (MNP) jobs. The results are sorted by the createdAt field, with the most recent jobs being first.  JOB_NAME  The value of the filter is a case-insensitive match for the job name. If the value ends with an asterisk (*), the filter matches any job name that begins with the string before the '*'. This corresponds to the jobName value. For example, test1 matches both Test1 and test1, and test1* matches both test1 and Test10. When the JOB_NAME filter is used, the results are grouped by the job name and version.  JOB_DEFINITION  The value for the filter is the name or Amazon Resource Name (ARN) of the job definition. This corresponds to the jobDefinition value. The value is case sensitive. When the value for the filter is the job definition name, the results include all the jobs that used any revision of that job definition name. If the value ends with an asterisk (*), the filter matches any job definition name that begins with the string before the '*'. For example, jd1 matches only jd1, and jd1* matches both jd1 and jd1A. The version of the job definition that's used doesn't affect the sort order. When the JOB_DEFINITION filter is used and the ARN is used (which is in the form arn:${Partition}:batch:${Region}:${Account}:job-definition/${JobDefinitionName}:${Revision}), the results include jobs that used the specified revision of the job definition. Asterisk (*) isn't supported when the ARN is used.  BEFORE_CREATED_AT  The value for the filter is the time that's before the job was created. This corresponds to the createdAt value. The value is a string representation of the number of milliseconds since 00:00:00 UTC (midnight) on January 1, 1970.  AFTER_CREATED_AT  The value for the filter is the time that's after the job was created. This corresponds to the createdAt value. The value is a string representation of the number of milliseconds since 00:00:00 UTC (midnight) on January 1, 1970.  
     */
    filters?: ListJobsFilterList;
  }
  export interface ListJobsResponse {
    /**
     * A list of job summaries that match the request.
     */
    jobSummaryList: JobSummaryList;
    /**
     * The nextToken value to include in a future ListJobs request. When the results of a ListJobs request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export interface ListSchedulingPoliciesRequest {
    /**
     * The maximum number of results that's returned by ListSchedulingPolicies in paginated output. When this parameter is used, ListSchedulingPolicies only returns maxResults results in a single page and a nextToken response element. You can see the remaining results of the initial request by sending another ListSchedulingPolicies request with the returned nextToken value. This value can be between 1 and 100. If this parameter isn't used, ListSchedulingPolicies returns up to 100 results and a nextToken value if applicable.
     */
    maxResults?: Integer;
    /**
     * The nextToken value that's returned from a previous paginated ListSchedulingPolicies request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return.  Treat this token as an opaque identifier that's only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    nextToken?: String;
  }
  export interface ListSchedulingPoliciesResponse {
    /**
     * A list of scheduling policies that match the request.
     */
    schedulingPolicies?: SchedulingPolicyListingDetailList;
    /**
     * The nextToken value to include in a future ListSchedulingPolicies request. When the results of a ListSchedulingPolicies request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the resource that tags are listed for. Batch resources that support tags are compute environments, jobs, job definitions, job queues, and scheduling policies. ARNs for child jobs of array and multi-node parallel (MNP) jobs aren't supported.
     */
    resourceArn: String;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags for the resource.
     */
    tags?: TagrisTagsMap;
  }
  export interface LogConfiguration {
    /**
     * The log driver to use for the container. The valid values that are listed for this parameter are log drivers that the Amazon ECS container agent can communicate with by default. The supported log drivers are awslogs, fluentd, gelf, json-file, journald, logentries, syslog, and splunk.  Jobs that are running on Fargate resources are restricted to the awslogs and splunk log drivers.   awslogs  Specifies the Amazon CloudWatch Logs logging driver. For more information, see Using the awslogs log driver in the Batch User Guide and Amazon CloudWatch Logs logging driver in the Docker documentation.  fluentd  Specifies the Fluentd logging driver. For more information including usage and options, see Fluentd logging driver in the Docker documentation.  gelf  Specifies the Graylog Extended Format (GELF) logging driver. For more information including usage and options, see Graylog Extended Format logging driver in the Docker documentation.  journald  Specifies the journald logging driver. For more information including usage and options, see Journald logging driver in the Docker documentation.  json-file  Specifies the JSON file logging driver. For more information including usage and options, see JSON File logging driver in the Docker documentation.  splunk  Specifies the Splunk logging driver. For more information including usage and options, see Splunk logging driver in the Docker documentation.  syslog  Specifies the syslog logging driver. For more information including usage and options, see Syslog logging driver in the Docker documentation.    If you have a custom driver that's not listed earlier that you want to work with the Amazon ECS container agent, you can fork the Amazon ECS container agent project that's available on GitHub and customize it to work with that driver. We encourage you to submit pull requests for changes that you want to have included. However, Amazon Web Services doesn't currently support running modified copies of this software.  This parameter requires version 1.18 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log in to your container instance and run the following command: sudo docker version | grep "Server API version" 
     */
    logDriver: LogDriver;
    /**
     * The configuration options to send to the log driver. This parameter requires version 1.19 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log in to your container instance and run the following command: sudo docker version | grep "Server API version" 
     */
    options?: LogConfigurationOptionsMap;
    /**
     * The secrets to pass to the log configuration. For more information, see Specifying sensitive data in the Batch User Guide.
     */
    secretOptions?: SecretList;
  }
  export type LogConfigurationOptionsMap = {[key: string]: String};
  export type LogDriver = "json-file"|"syslog"|"journald"|"gelf"|"fluentd"|"awslogs"|"splunk"|string;
  export type Long = number;
  export interface MountPoint {
    /**
     * The path on the container where the host volume is mounted.
     */
    containerPath?: String;
    /**
     * If this value is true, the container has read-only access to the volume. Otherwise, the container can write to the volume. The default value is false.
     */
    readOnly?: Boolean;
    /**
     * The name of the volume to mount.
     */
    sourceVolume?: String;
  }
  export type MountPoints = MountPoint[];
  export interface NetworkConfiguration {
    /**
     * Indicates whether the job has a public IP address. For a job that's running on Fargate resources in a private subnet to send outbound traffic to the internet (for example, to pull container images), the private subnet requires a NAT gateway be attached to route requests to the internet. For more information, see Amazon ECS task networking in the Amazon Elastic Container Service Developer Guide. The default value is "DISABLED".
     */
    assignPublicIp?: AssignPublicIp;
  }
  export interface NetworkInterface {
    /**
     * The attachment ID for the network interface.
     */
    attachmentId?: String;
    /**
     * The private IPv6 address for the network interface.
     */
    ipv6Address?: String;
    /**
     * The private IPv4 address for the network interface.
     */
    privateIpv4Address?: String;
  }
  export type NetworkInterfaceList = NetworkInterface[];
  export interface NodeDetails {
    /**
     * The node index for the node. Node index numbering starts at zero. This index is also available on the node with the AWS_BATCH_JOB_NODE_INDEX environment variable.
     */
    nodeIndex?: Integer;
    /**
     * Specifies whether the current node is the main node for a multi-node parallel job.
     */
    isMainNode?: Boolean;
  }
  export interface NodeOverrides {
    /**
     * The number of nodes to use with a multi-node parallel job. This value overrides the number of nodes that are specified in the job definition. To use this override, you must meet the following conditions:   There must be at least one node range in your job definition that has an open upper boundary, such as : or n:.   The lower boundary of the node range that's specified in the job definition must be fewer than the number of nodes specified in the override.   The main node index that's specified in the job definition must be fewer than the number of nodes specified in the override.  
     */
    numNodes?: Integer;
    /**
     * The node property overrides for the job.
     */
    nodePropertyOverrides?: NodePropertyOverrides;
  }
  export interface NodeProperties {
    /**
     * The number of nodes that are associated with a multi-node parallel job.
     */
    numNodes: Integer;
    /**
     * Specifies the node index for the main node of a multi-node parallel job. This node index value must be fewer than the number of nodes.
     */
    mainNode: Integer;
    /**
     * A list of node ranges and their properties that are associated with a multi-node parallel job.
     */
    nodeRangeProperties: NodeRangeProperties;
  }
  export interface NodePropertiesSummary {
    /**
     * Specifies whether the current node is the main node for a multi-node parallel job.
     */
    isMainNode?: Boolean;
    /**
     * The number of nodes that are associated with a multi-node parallel job.
     */
    numNodes?: Integer;
    /**
     * The node index for the node. Node index numbering begins at zero. This index is also available on the node with the AWS_BATCH_JOB_NODE_INDEX environment variable.
     */
    nodeIndex?: Integer;
  }
  export interface NodePropertyOverride {
    /**
     * The range of nodes, using node index values, that's used to override. A range of 0:3 indicates nodes with index values of 0 through 3. If the starting range value is omitted (:n), then 0 is used to start the range. If the ending range value is omitted (n:), then the highest possible node index is used to end the range.
     */
    targetNodes: String;
    /**
     * The overrides that are sent to a node range.
     */
    containerOverrides?: ContainerOverrides;
  }
  export type NodePropertyOverrides = NodePropertyOverride[];
  export type NodeRangeProperties = NodeRangeProperty[];
  export interface NodeRangeProperty {
    /**
     * The range of nodes, using node index values. A range of 0:3 indicates nodes with index values of 0 through 3. If the starting range value is omitted (:n), then 0 is used to start the range. If the ending range value is omitted (n:), then the highest possible node index is used to end the range. Your accumulative node ranges must account for all nodes (0:n). You can nest node ranges (for example, 0:10 and 4:5). In this case, the 4:5 range properties override the 0:10 properties.
     */
    targetNodes: String;
    /**
     * The container details for the node range.
     */
    container?: ContainerProperties;
  }
  export type OrchestrationType = "ECS"|"EKS"|string;
  export type ParametersMap = {[key: string]: String};
  export type PlatformCapability = "EC2"|"FARGATE"|string;
  export type PlatformCapabilityList = PlatformCapability[];
  export type Quantity = string;
  export interface RegisterJobDefinitionRequest {
    /**
     * The name of the job definition to register. It can be up to 128 letters long. It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_).
     */
    jobDefinitionName: String;
    /**
     * The type of job definition. For more information about multi-node parallel jobs, see Creating a multi-node parallel job definition in the Batch User Guide.  If the job is run on Fargate resources, then multinode isn't supported. 
     */
    type: JobDefinitionType;
    /**
     * Default parameter substitution placeholders to set in the job definition. Parameters are specified as a key-value pair mapping. Parameters in a SubmitJob request override any corresponding parameter defaults from the job definition.
     */
    parameters?: ParametersMap;
    /**
     * The scheduling priority for jobs that are submitted with this job definition. This only affects jobs in job queues with a fair share policy. Jobs with a higher scheduling priority are scheduled before jobs with a lower scheduling priority. The minimum supported value is 0 and the maximum supported value is 9999.
     */
    schedulingPriority?: Integer;
    /**
     * An object with various properties specific to Amazon ECS based single-node container-based jobs. If the job definition's type parameter is container, then you must specify either containerProperties or nodeProperties. This must not be specified for Amazon EKS based job definitions.  If the job runs on Fargate resources, then you must not specify nodeProperties; use only containerProperties. 
     */
    containerProperties?: ContainerProperties;
    /**
     * An object with various properties specific to multi-node parallel jobs. If you specify node properties for a job, it becomes a multi-node parallel job. For more information, see Multi-node Parallel Jobs in the Batch User Guide. If the job definition's type parameter is container, then you must specify either containerProperties or nodeProperties.  If the job runs on Fargate resources, then you must not specify nodeProperties; use containerProperties instead.   If the job runs on Amazon EKS resources, then you must not specify nodeProperties. 
     */
    nodeProperties?: NodeProperties;
    /**
     * The retry strategy to use for failed jobs that are submitted with this job definition. Any retry strategy that's specified during a SubmitJob operation overrides the retry strategy defined here. If a job is terminated due to a timeout, it isn't retried.
     */
    retryStrategy?: RetryStrategy;
    /**
     * Specifies whether to propagate the tags from the job or job definition to the corresponding Amazon ECS task. If no value is specified, the tags are not propagated. Tags can only be propagated to the tasks during task creation. For tags with the same name, job tags are given priority over job definitions tags. If the total number of combined tags from the job and job definition is over 50, the job is moved to the FAILED state.  If the job runs on Amazon EKS resources, then you must not specify propagateTags. 
     */
    propagateTags?: Boolean;
    /**
     * The timeout configuration for jobs that are submitted with this job definition, after which Batch terminates your jobs if they have not finished. If a job is terminated due to a timeout, it isn't retried. The minimum value for the timeout is 60 seconds. Any timeout configuration that's specified during a SubmitJob operation overrides the timeout configuration defined here. For more information, see Job Timeouts in the Batch User Guide.
     */
    timeout?: JobTimeout;
    /**
     * The tags that you apply to the job definition to help you categorize and organize your resources. Each tag consists of a key and an optional value. For more information, see Tagging Amazon Web Services Resources in Batch User Guide.
     */
    tags?: TagrisTagsMap;
    /**
     * The platform capabilities required by the job definition. If no value is specified, it defaults to EC2. To run the job on Fargate resources, specify FARGATE.  If the job runs on Amazon EKS resources, then you must not specify platformCapabilities. 
     */
    platformCapabilities?: PlatformCapabilityList;
    /**
     * An object with various properties that are specific to Amazon EKS based jobs. This must not be specified for Amazon ECS based job definitions.
     */
    eksProperties?: EksProperties;
  }
  export interface RegisterJobDefinitionResponse {
    /**
     * The name of the job definition.
     */
    jobDefinitionName: String;
    /**
     * The Amazon Resource Name (ARN) of the job definition.
     */
    jobDefinitionArn: String;
    /**
     * The revision of the job definition.
     */
    revision: Integer;
  }
  export interface ResourceRequirement {
    /**
     * The quantity of the specified resource to reserve for the container. The values vary based on the type specified.  type="GPU"  The number of physical GPUs to reserve for the container. Make sure that the number of GPUs reserved for all containers in a job doesn't exceed the number of available GPUs on the compute resource that the job is launched on.  GPUs aren't available for jobs that are running on Fargate resources.   type="MEMORY"  The memory hard limit (in MiB) present to the container. This parameter is supported for jobs that are running on EC2 resources. If your container attempts to exceed the memory specified, the container is terminated. This parameter maps to Memory in the Create a container section of the Docker Remote API and the --memory option to docker run. You must specify at least 4 MiB of memory for a job. This is required but can be specified in several places for multi-node parallel (MNP) jobs. It must be specified for each node at least once. This parameter maps to Memory in the Create a container section of the Docker Remote API and the --memory option to docker run.  If you're trying to maximize your resource utilization by providing your jobs as much memory as possible for a particular instance type, see Memory management in the Batch User Guide.  For jobs that are running on Fargate resources, then value is the hard limit (in MiB), and must match one of the supported values and the VCPU values must be one of the values supported for that memory value.  value = 512   VCPU = 0.25  value = 1024   VCPU = 0.25 or 0.5  value = 2048   VCPU = 0.25, 0.5, or 1  value = 3072   VCPU = 0.5, or 1  value = 4096   VCPU = 0.5, 1, or 2  value = 5120, 6144, or 7168   VCPU = 1 or 2  value = 8192   VCPU = 1, 2, or 4  value = 9216, 10240, 11264, 12288, 13312, 14336, or 15360   VCPU = 2 or 4  value = 16384   VCPU = 2, 4, or 8  value = 17408, 18432, 19456, 21504, 22528, 23552, 25600, 26624, 27648, 29696, or 30720   VCPU = 4  value = 20480, 24576, or 28672   VCPU = 4 or 8  value = 36864, 45056, 53248, or 61440   VCPU = 8  value = 32768, 40960, 49152, or 57344   VCPU = 8 or 16  value = 65536, 73728, 81920, 90112, 98304, 106496, 114688, or 122880   VCPU = 16    type="VCPU"  The number of vCPUs reserved for the container. This parameter maps to CpuShares in the Create a container section of the Docker Remote API and the --cpu-shares option to docker run. Each vCPU is equivalent to 1,024 CPU shares. For EC2 resources, you must specify at least one vCPU. This is required but can be specified in several places; it must be specified for each node at least once. The default for the Fargate On-Demand vCPU resource count quota is 6 vCPUs. For more information about Fargate quotas, see Fargate quotas in the Amazon Web Services General Reference. For jobs that are running on Fargate resources, then value must match one of the supported values and the MEMORY values must be one of the values supported for that VCPU value. The supported values are 0.25, 0.5, 1, 2, 4, 8, and 16  value = 0.25   MEMORY = 512, 1024, or 2048  value = 0.5   MEMORY = 1024, 2048, 3072, or 4096  value = 1   MEMORY = 2048, 3072, 4096, 5120, 6144, 7168, or 8192  value = 2   MEMORY = 4096, 5120, 6144, 7168, 8192, 9216, 10240, 11264, 12288, 13312, 14336, 15360, or 16384  value = 4   MEMORY = 8192, 9216, 10240, 11264, 12288, 13312, 14336, 15360, 16384, 17408, 18432, 19456, 20480, 21504, 22528, 23552, 24576, 25600, 26624, 27648, 28672, 29696, or 30720  value = 8   MEMORY = 16384, 20480, 24576, 28672, 32768, 36864, 40960, 45056, 49152, 53248, 57344, or 61440   value = 16   MEMORY = 32768, 40960, 49152, 57344, 65536, 73728, 81920, 90112, 98304, 106496, 114688, or 122880     
     */
    value: String;
    /**
     * The type of resource to assign to a container. The supported resources include GPU, MEMORY, and VCPU.
     */
    type: ResourceType;
  }
  export type ResourceRequirements = ResourceRequirement[];
  export type ResourceType = "GPU"|"VCPU"|"MEMORY"|string;
  export type RetryAction = "RETRY"|"EXIT"|string;
  export interface RetryStrategy {
    /**
     * The number of times to move a job to the RUNNABLE status. You can specify between 1 and 10 attempts. If the value of attempts is greater than one, the job is retried on failure the same number of attempts as the value.
     */
    attempts?: Integer;
    /**
     * Array of up to 5 objects that specify the conditions where jobs are retried or failed. If this parameter is specified, then the attempts parameter must also be specified. If none of the listed conditions match, then the job is retried.
     */
    evaluateOnExit?: EvaluateOnExitList;
  }
  export interface RuntimePlatform {
    /**
     * The operating system for the compute environment. Valid values are: LINUX (default), WINDOWS_SERVER_2019_CORE, WINDOWS_SERVER_2019_FULL, WINDOWS_SERVER_2022_CORE, and WINDOWS_SERVER_2022_FULL.  The following parameters can’t be set for Windows containers: linuxParameters, privileged, user, ulimits, readonlyRootFilesystem, and efsVolumeConfiguration.   The Batch Scheduler checks before registering a task definition with Fargate. If the job requires a Windows container and the first compute environment is LINUX, the compute environment is skipped and the next is checked until a Windows-based compute environment is found.   Fargate Spot is not supported for Windows-based containers on Fargate. A job queue will be blocked if a Fargate Windows job is submitted to a job queue with only Fargate Spot compute environments. However, you can attach both FARGATE and FARGATE_SPOT compute environments to the same job queue. 
     */
    operatingSystemFamily?: String;
    /**
     * The vCPU architecture. The default value is X86_64. Valid values are X86_64 and ARM64.  This parameter must be set to X86_64 for Windows containers. 
     */
    cpuArchitecture?: String;
  }
  export interface SchedulingPolicyDetail {
    /**
     * The name of the scheduling policy.
     */
    name: String;
    /**
     * The Amazon Resource Name (ARN) of the scheduling policy. An example is arn:aws:batch:us-east-1:123456789012:scheduling-policy/HighPriority .
     */
    arn: String;
    /**
     * The fair share policy for the scheduling policy.
     */
    fairsharePolicy?: FairsharePolicy;
    /**
     * The tags that you apply to the scheduling policy to categorize and organize your resources. Each tag consists of a key and an optional value. For more information, see Tagging Amazon Web Services resources in Amazon Web Services General Reference.
     */
    tags?: TagrisTagsMap;
  }
  export type SchedulingPolicyDetailList = SchedulingPolicyDetail[];
  export interface SchedulingPolicyListingDetail {
    /**
     * Amazon Resource Name (ARN) of the scheduling policy.
     */
    arn: String;
  }
  export type SchedulingPolicyListingDetailList = SchedulingPolicyListingDetail[];
  export interface Secret {
    /**
     * The name of the secret.
     */
    name: String;
    /**
     * The secret to expose to the container. The supported values are either the full Amazon Resource Name (ARN) of the Secrets Manager secret or the full ARN of the parameter in the Amazon Web Services Systems Manager Parameter Store.  If the Amazon Web Services Systems Manager Parameter Store parameter exists in the same Region as the job you're launching, then you can use either the full Amazon Resource Name (ARN) or name of the parameter. If the parameter exists in a different Region, then the full ARN must be specified. 
     */
    valueFrom: String;
  }
  export type SecretList = Secret[];
  export interface ShareAttributes {
    /**
     * A fair share identifier or fair share identifier prefix. If the string ends with an asterisk (*), this entry specifies the weight factor to use for fair share identifiers that start with that prefix. The list of fair share identifiers in a fair share policy can't overlap. For example, you can't have one that specifies a shareIdentifier of UserA* and another that specifies a shareIdentifier of UserA-1. There can be no more than 500 fair share identifiers active in a job queue. The string is limited to 255 alphanumeric characters, and can be followed by an asterisk (*).
     */
    shareIdentifier: String;
    /**
     * The weight factor for the fair share identifier. The default value is 1.0. A lower value has a higher priority for compute resources. For example, jobs that use a share identifier with a weight factor of 0.125 (1/8) get 8 times the compute resources of jobs that use a share identifier with a weight factor of 1. The smallest supported value is 0.0001, and the largest supported value is 999.9999.
     */
    weightFactor?: Float;
  }
  export type ShareAttributesList = ShareAttributes[];
  export type String = string;
  export type StringList = String[];
  export interface SubmitJobRequest {
    /**
     * The name of the job. It can be up to 128 letters long. The first character must be alphanumeric, can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_).
     */
    jobName: String;
    /**
     * The job queue where the job is submitted. You can specify either the name or the Amazon Resource Name (ARN) of the queue.
     */
    jobQueue: String;
    /**
     * The share identifier for the job. Don't specify this parameter if the job queue doesn't have a scheduling policy. If the job queue has a scheduling policy, then this parameter must be specified. This string is limited to 255 alphanumeric characters, and can be followed by an asterisk (*).
     */
    shareIdentifier?: String;
    /**
     * The scheduling priority for the job. This only affects jobs in job queues with a fair share policy. Jobs with a higher scheduling priority are scheduled before jobs with a lower scheduling priority. This overrides any scheduling priority in the job definition. The minimum supported value is 0 and the maximum supported value is 9999.
     */
    schedulingPriorityOverride?: Integer;
    /**
     * The array properties for the submitted job, such as the size of the array. The array size can be between 2 and 10,000. If you specify array properties for a job, it becomes an array job. For more information, see Array Jobs in the Batch User Guide.
     */
    arrayProperties?: ArrayProperties;
    /**
     * A list of dependencies for the job. A job can depend upon a maximum of 20 jobs. You can specify a SEQUENTIAL type dependency without specifying a job ID for array jobs so that each child array job completes sequentially, starting at index 0. You can also specify an N_TO_N type dependency with a job ID for array jobs. In that case, each index child of this job must wait for the corresponding index child of each dependency to complete before it can begin.
     */
    dependsOn?: JobDependencyList;
    /**
     * The job definition used by this job. This value can be one of definition-name, definition-name:revision, or the Amazon Resource Name (ARN) for the job definition, with or without the revision (arn:aws:batch:region:account:job-definition/definition-name:revision , or arn:aws:batch:region:account:job-definition/definition-name ). If the revision is not specified, then the latest active revision is used.
     */
    jobDefinition: String;
    /**
     * Additional parameters passed to the job that replace parameter substitution placeholders that are set in the job definition. Parameters are specified as a key and value pair mapping. Parameters in a SubmitJob request override any corresponding parameter defaults from the job definition.
     */
    parameters?: ParametersMap;
    /**
     * An object with various properties that override the defaults for the job definition that specify the name of a container in the specified job definition and the overrides it should receive. You can override the default command for a container, which is specified in the job definition or the Docker image, with a command override. You can also override existing environment variables on a container or add new environment variables to it with an environment override.
     */
    containerOverrides?: ContainerOverrides;
    /**
     * A list of node overrides in JSON format that specify the node range to target and the container overrides for that node range.  This parameter isn't applicable to jobs that are running on Fargate resources; use containerOverrides instead. 
     */
    nodeOverrides?: NodeOverrides;
    /**
     * The retry strategy to use for failed jobs from this SubmitJob operation. When a retry strategy is specified here, it overrides the retry strategy defined in the job definition.
     */
    retryStrategy?: RetryStrategy;
    /**
     * Specifies whether to propagate the tags from the job or job definition to the corresponding Amazon ECS task. If no value is specified, the tags aren't propagated. Tags can only be propagated to the tasks during task creation. For tags with the same name, job tags are given priority over job definitions tags. If the total number of combined tags from the job and job definition is over 50, the job is moved to the FAILED state. When specified, this overrides the tag propagation setting in the job definition.
     */
    propagateTags?: Boolean;
    /**
     * The timeout configuration for this SubmitJob operation. You can specify a timeout duration after which Batch terminates your jobs if they haven't finished. If a job is terminated due to a timeout, it isn't retried. The minimum value for the timeout is 60 seconds. This configuration overrides any timeout configuration specified in the job definition. For array jobs, child jobs have the same timeout configuration as the parent job. For more information, see Job Timeouts in the Amazon Elastic Container Service Developer Guide.
     */
    timeout?: JobTimeout;
    /**
     * The tags that you apply to the job request to help you categorize and organize your resources. Each tag consists of a key and an optional value. For more information, see Tagging Amazon Web Services Resources in Amazon Web Services General Reference.
     */
    tags?: TagrisTagsMap;
    /**
     * An object that can only be specified for jobs that are run on Amazon EKS resources with various properties that override defaults for the job definition.
     */
    eksPropertiesOverride?: EksPropertiesOverride;
  }
  export interface SubmitJobResponse {
    /**
     * The Amazon Resource Name (ARN) for the job.
     */
    jobArn?: String;
    /**
     * The name of the job.
     */
    jobName: String;
    /**
     * The unique identifier for the job.
     */
    jobId: String;
  }
  export type TagKey = string;
  export type TagKeysList = TagKey[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that tags are added to. Batch resources that support tags are compute environments, jobs, job definitions, job queues, and scheduling policies. ARNs for child jobs of array and multi-node parallel (MNP) jobs aren't supported.
     */
    resourceArn: String;
    /**
     * The tags that you apply to the resource to help you categorize and organize your resources. Each tag consists of a key and an optional value. For more information, see Tagging Amazon Web Services Resources in Amazon Web Services General Reference.
     */
    tags: TagrisTagsMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TagrisTagsMap = {[key: string]: TagValue};
  export type TagsMap = {[key: string]: String};
  export interface TerminateJobRequest {
    /**
     * The Batch job ID of the job to terminate.
     */
    jobId: String;
    /**
     * A message to attach to the job that explains the reason for canceling it. This message is returned by future DescribeJobs operations on the job. This message is also recorded in the Batch activity logs.
     */
    reason: String;
  }
  export interface TerminateJobResponse {
  }
  export interface Tmpfs {
    /**
     * The absolute file path in the container where the tmpfs volume is mounted.
     */
    containerPath: String;
    /**
     * The size (in MiB) of the tmpfs volume.
     */
    size: Integer;
    /**
     * The list of tmpfs volume mount options. Valid values: "defaults" | "ro" | "rw" | "suid" | "nosuid" | "dev" | "nodev" | "exec" | "noexec" | "sync" | "async" | "dirsync" | "remount" | "mand" | "nomand" | "atime" | "noatime" | "diratime" | "nodiratime" | "bind" | "rbind" | "unbindable" | "runbindable" | "private" | "rprivate" | "shared" | "rshared" | "slave" | "rslave" | "relatime" | "norelatime" | "strictatime" | "nostrictatime" | "mode" | "uid" | "gid" | "nr_inodes" | "nr_blocks" | "mpol"
     */
    mountOptions?: StringList;
  }
  export type TmpfsList = Tmpfs[];
  export interface Ulimit {
    /**
     * The hard limit for the ulimit type.
     */
    hardLimit: Integer;
    /**
     * The type of the ulimit.
     */
    name: String;
    /**
     * The soft limit for the ulimit type.
     */
    softLimit: Integer;
  }
  export type Ulimits = Ulimit[];
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource from which to delete tags. Batch resources that support tags are compute environments, jobs, job definitions, job queues, and scheduling policies. ARNs for child jobs of array and multi-node parallel (MNP) jobs aren't supported.
     */
    resourceArn: String;
    /**
     * The keys of the tags to be removed.
     */
    tagKeys: TagKeysList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateComputeEnvironmentRequest {
    /**
     * The name or full Amazon Resource Name (ARN) of the compute environment to update.
     */
    computeEnvironment: String;
    /**
     * The state of the compute environment. Compute environments in the ENABLED state can accept jobs from a queue and scale in or out automatically based on the workload demand of its associated queues. If the state is ENABLED, then the Batch scheduler can attempt to place jobs from an associated job queue on the compute resources within the environment. If the compute environment is managed, then it can scale its instances out or in automatically, based on the job queue demand. If the state is DISABLED, then the Batch scheduler doesn't attempt to place jobs within the environment. Jobs in a STARTING or RUNNING state continue to progress normally. Managed compute environments in the DISABLED state don't scale out.   Compute environments in a DISABLED state may continue to incur billing charges. To prevent additional charges, turn off and then delete the compute environment. For more information, see State in the Batch User Guide.  When an instance is idle, the instance scales down to the minvCpus value. However, the instance size doesn't change. For example, consider a c5.8xlarge instance with a minvCpus value of 4 and a desiredvCpus value of 36. This instance doesn't scale down to a c5.large instance.
     */
    state?: CEState;
    /**
     * The maximum number of vCPUs expected to be used for an unmanaged compute environment. Don't specify this parameter for a managed compute environment. This parameter is only used for fair share scheduling to reserve vCPU capacity for new share identifiers. If this parameter isn't provided for a fair share job queue, no vCPU capacity is reserved.
     */
    unmanagedvCpus?: Integer;
    /**
     * Details of the compute resources managed by the compute environment. Required for a managed compute environment. For more information, see Compute Environments in the Batch User Guide.
     */
    computeResources?: ComputeResourceUpdate;
    /**
     * The full Amazon Resource Name (ARN) of the IAM role that allows Batch to make calls to other Amazon Web Services services on your behalf. For more information, see Batch service IAM role in the Batch User Guide.  If the compute environment has a service-linked role, it can't be changed to use a regular IAM role. Likewise, if the compute environment has a regular IAM role, it can't be changed to use a service-linked role. To update the parameters for the compute environment that require an infrastructure update to change, the AWSServiceRoleForBatch service-linked role must be used. For more information, see Updating compute environments in the Batch User Guide.  If your specified role has a path other than /, then you must either specify the full role ARN (recommended) or prefix the role name with the path.  Depending on how you created your Batch service role, its ARN might contain the service-role path prefix. When you only specify the name of the service role, Batch assumes that your ARN doesn't use the service-role path prefix. Because of this, we recommend that you specify the full ARN of your service role when you create compute environments. 
     */
    serviceRole?: String;
    /**
     * Specifies the updated infrastructure update policy for the compute environment. For more information about infrastructure updates, see Updating compute environments in the Batch User Guide.
     */
    updatePolicy?: UpdatePolicy;
  }
  export interface UpdateComputeEnvironmentResponse {
    /**
     * The name of the compute environment. It can be up to 128 characters long. It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_).
     */
    computeEnvironmentName?: String;
    /**
     * The Amazon Resource Name (ARN) of the compute environment.
     */
    computeEnvironmentArn?: String;
  }
  export interface UpdateJobQueueRequest {
    /**
     * The name or the Amazon Resource Name (ARN) of the job queue.
     */
    jobQueue: String;
    /**
     * Describes the queue's ability to accept new jobs. If the job queue state is ENABLED, it can accept jobs. If the job queue state is DISABLED, new jobs can't be added to the queue, but jobs already in the queue can finish.
     */
    state?: JQState;
    /**
     * Amazon Resource Name (ARN) of the fair share scheduling policy. Once a job queue is created, the fair share scheduling policy can be replaced but not removed. The format is aws:Partition:batch:Region:Account:scheduling-policy/Name . For example, aws:aws:batch:us-west-2:123456789012:scheduling-policy/MySchedulingPolicy.
     */
    schedulingPolicyArn?: String;
    /**
     * The priority of the job queue. Job queues with a higher priority (or a higher integer value for the priority parameter) are evaluated first when associated with the same compute environment. Priority is determined in descending order. For example, a job queue with a priority value of 10 is given scheduling preference over a job queue with a priority value of 1. All of the compute environments must be either EC2 (EC2 or SPOT) or Fargate (FARGATE or FARGATE_SPOT). EC2 and Fargate compute environments can't be mixed.
     */
    priority?: Integer;
    /**
     * Details the set of compute environments mapped to a job queue and their order relative to each other. This is one of the parameters used by the job scheduler to determine which compute environment runs a given job. Compute environments must be in the VALID state before you can associate them with a job queue. All of the compute environments must be either EC2 (EC2 or SPOT) or Fargate (FARGATE or FARGATE_SPOT). EC2 and Fargate compute environments can't be mixed.  All compute environments that are associated with a job queue must share the same architecture. Batch doesn't support mixing compute environment architecture types in a single job queue. 
     */
    computeEnvironmentOrder?: ComputeEnvironmentOrders;
  }
  export interface UpdateJobQueueResponse {
    /**
     * The name of the job queue.
     */
    jobQueueName?: String;
    /**
     * The Amazon Resource Name (ARN) of the job queue.
     */
    jobQueueArn?: String;
  }
  export interface UpdatePolicy {
    /**
     * Specifies whether jobs are automatically terminated when the computer environment infrastructure is updated. The default value is false.
     */
    terminateJobsOnUpdate?: Boolean;
    /**
     * Specifies the job timeout (in minutes) when the compute environment infrastructure is updated. The default value is 30.
     */
    jobExecutionTimeoutMinutes?: JobExecutionTimeoutMinutes;
  }
  export interface UpdateSchedulingPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the scheduling policy to update.
     */
    arn: String;
    /**
     * The fair share policy.
     */
    fairsharePolicy?: FairsharePolicy;
  }
  export interface UpdateSchedulingPolicyResponse {
  }
  export interface Volume {
    /**
     * The contents of the host parameter determine whether your data volume persists on the host container instance and where it's stored. If the host parameter is empty, then the Docker daemon assigns a host path for your data volume. However, the data isn't guaranteed to persist after the containers that are associated with it stop running.  This parameter isn't applicable to jobs that are running on Fargate resources and shouldn't be provided. 
     */
    host?: Host;
    /**
     * The name of the volume. It can be up to 255 characters long. It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_). This name is referenced in the sourceVolume parameter of container definition mountPoints.
     */
    name?: String;
    /**
     * This parameter is specified when you're using an Amazon Elastic File System file system for job storage. Jobs that are running on Fargate resources must specify a platformVersion of at least 1.4.0.
     */
    efsVolumeConfiguration?: EFSVolumeConfiguration;
  }
  export type Volumes = Volume[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-08-10"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Batch client.
   */
  export import Types = Batch;
}
export = Batch;
