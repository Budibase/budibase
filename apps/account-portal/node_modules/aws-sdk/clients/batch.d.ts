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
   * Cancels a job in an Batch job queue. Jobs that are in the SUBMITTED, PENDING, or RUNNABLE state are canceled. Jobs that have progressed to STARTING or RUNNING aren't canceled, but the API operation still succeeds, even if no job is canceled. These jobs must be terminated with the TerminateJob operation.
   */
  cancelJob(params: Batch.Types.CancelJobRequest, callback?: (err: AWSError, data: Batch.Types.CancelJobResponse) => void): Request<Batch.Types.CancelJobResponse, AWSError>;
  /**
   * Cancels a job in an Batch job queue. Jobs that are in the SUBMITTED, PENDING, or RUNNABLE state are canceled. Jobs that have progressed to STARTING or RUNNING aren't canceled, but the API operation still succeeds, even if no job is canceled. These jobs must be terminated with the TerminateJob operation.
   */
  cancelJob(callback?: (err: AWSError, data: Batch.Types.CancelJobResponse) => void): Request<Batch.Types.CancelJobResponse, AWSError>;
  /**
   * Creates an Batch compute environment. You can create MANAGED or UNMANAGED compute environments. MANAGED compute environments can use Amazon EC2 or Fargate resources. UNMANAGED compute environments can only use EC2 resources. In a managed compute environment, Batch manages the capacity and instance types of the compute resources within the environment. This is based on the compute resource specification that you define or the launch template that you specify when you create the compute environment. Either, you can choose to use EC2 On-Demand Instances and EC2 Spot Instances. Or, you can use Fargate and Fargate Spot capacity in your managed compute environment. You can optionally set a maximum price so that Spot Instances only launch when the Spot Instance price is less than a specified percentage of the On-Demand price.  Multi-node parallel jobs aren't supported on Spot Instances.  In an unmanaged compute environment, you can manage your own EC2 compute resources and have a lot of flexibility with how you configure your compute resources. For example, you can use custom AMIs. However, you must verify that each of your AMIs meet the Amazon ECS container instance AMI specification. For more information, see container instance AMIs in the Amazon Elastic Container Service Developer Guide. After you created your unmanaged compute environment, you can use the DescribeComputeEnvironments operation to find the Amazon ECS cluster that's associated with it. Then, launch your container instances into that Amazon ECS cluster. For more information, see Launching an Amazon ECS container instance in the Amazon Elastic Container Service Developer Guide.  Batch doesn't upgrade the AMIs in a compute environment after the environment is created. For example, it doesn't update the AMIs when a newer version of the Amazon ECS optimized AMI is available. Therefore, you're responsible for managing the guest operating system (including its updates and security patches) and any additional application software or utilities that you install on the compute resources. To use a new AMI for your Batch jobs, complete these steps:   Create a new compute environment with the new AMI.   Add the compute environment to an existing job queue.   Remove the earlier compute environment from your job queue.   Delete the earlier compute environment.   
   */
  createComputeEnvironment(params: Batch.Types.CreateComputeEnvironmentRequest, callback?: (err: AWSError, data: Batch.Types.CreateComputeEnvironmentResponse) => void): Request<Batch.Types.CreateComputeEnvironmentResponse, AWSError>;
  /**
   * Creates an Batch compute environment. You can create MANAGED or UNMANAGED compute environments. MANAGED compute environments can use Amazon EC2 or Fargate resources. UNMANAGED compute environments can only use EC2 resources. In a managed compute environment, Batch manages the capacity and instance types of the compute resources within the environment. This is based on the compute resource specification that you define or the launch template that you specify when you create the compute environment. Either, you can choose to use EC2 On-Demand Instances and EC2 Spot Instances. Or, you can use Fargate and Fargate Spot capacity in your managed compute environment. You can optionally set a maximum price so that Spot Instances only launch when the Spot Instance price is less than a specified percentage of the On-Demand price.  Multi-node parallel jobs aren't supported on Spot Instances.  In an unmanaged compute environment, you can manage your own EC2 compute resources and have a lot of flexibility with how you configure your compute resources. For example, you can use custom AMIs. However, you must verify that each of your AMIs meet the Amazon ECS container instance AMI specification. For more information, see container instance AMIs in the Amazon Elastic Container Service Developer Guide. After you created your unmanaged compute environment, you can use the DescribeComputeEnvironments operation to find the Amazon ECS cluster that's associated with it. Then, launch your container instances into that Amazon ECS cluster. For more information, see Launching an Amazon ECS container instance in the Amazon Elastic Container Service Developer Guide.  Batch doesn't upgrade the AMIs in a compute environment after the environment is created. For example, it doesn't update the AMIs when a newer version of the Amazon ECS optimized AMI is available. Therefore, you're responsible for managing the guest operating system (including its updates and security patches) and any additional application software or utilities that you install on the compute resources. To use a new AMI for your Batch jobs, complete these steps:   Create a new compute environment with the new AMI.   Add the compute environment to an existing job queue.   Remove the earlier compute environment from your job queue.   Delete the earlier compute environment.   
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
   * Deregisters an Batch job definition. Job definitions are permanently deleted after 180 days.
   */
  deregisterJobDefinition(params: Batch.Types.DeregisterJobDefinitionRequest, callback?: (err: AWSError, data: Batch.Types.DeregisterJobDefinitionResponse) => void): Request<Batch.Types.DeregisterJobDefinitionResponse, AWSError>;
  /**
   * Deregisters an Batch job definition. Job definitions are permanently deleted after 180 days.
   */
  deregisterJobDefinition(callback?: (err: AWSError, data: Batch.Types.DeregisterJobDefinitionResponse) => void): Request<Batch.Types.DeregisterJobDefinitionResponse, AWSError>;
  /**
   * Describes one or more of your compute environments. If you're using an unmanaged compute environment, you can use the DescribeComputeEnvironment operation to determine the ecsClusterArn that you should launch your Amazon ECS container instances into.
   */
  describeComputeEnvironments(params: Batch.Types.DescribeComputeEnvironmentsRequest, callback?: (err: AWSError, data: Batch.Types.DescribeComputeEnvironmentsResponse) => void): Request<Batch.Types.DescribeComputeEnvironmentsResponse, AWSError>;
  /**
   * Describes one or more of your compute environments. If you're using an unmanaged compute environment, you can use the DescribeComputeEnvironment operation to determine the ecsClusterArn that you should launch your Amazon ECS container instances into.
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
   * Returns a list of Batch jobs. You must specify only one of the following items:   A job queue ID to return a list of jobs in that job queue   A multi-node parallel job ID to return a list of nodes for that job   An array job ID to return a list of the children for that job   You can filter the results by job status with the jobStatus parameter. If you don't specify a status, only RUNNING jobs are returned.
   */
  listJobs(params: Batch.Types.ListJobsRequest, callback?: (err: AWSError, data: Batch.Types.ListJobsResponse) => void): Request<Batch.Types.ListJobsResponse, AWSError>;
  /**
   * Returns a list of Batch jobs. You must specify only one of the following items:   A job queue ID to return a list of jobs in that job queue   A multi-node parallel job ID to return a list of nodes for that job   An array job ID to return a list of the children for that job   You can filter the results by job status with the jobStatus parameter. If you don't specify a status, only RUNNING jobs are returned.
   */
  listJobs(callback?: (err: AWSError, data: Batch.Types.ListJobsResponse) => void): Request<Batch.Types.ListJobsResponse, AWSError>;
  /**
   * Lists the tags for an Batch resource. Batch resources that support tags are compute environments, jobs, job definitions, and job queues. ARNs for child jobs of array and multi-node parallel (MNP) jobs are not supported.
   */
  listTagsForResource(params: Batch.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Batch.Types.ListTagsForResourceResponse) => void): Request<Batch.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for an Batch resource. Batch resources that support tags are compute environments, jobs, job definitions, and job queues. ARNs for child jobs of array and multi-node parallel (MNP) jobs are not supported.
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
   * Submits an Batch job from a job definition. Parameters that are specified during SubmitJob override parameters defined in the job definition. vCPU and memory requirements that are specified in the ResourceRequirements objects in the job definition are the exception. They can't be overridden this way using the memory and vcpus parameters. Rather, you must specify updates to job definition parameters in a ResourceRequirements object that's included in the containerOverrides parameter.  Jobs that run on Fargate resources can't be guaranteed to run for more than 14 days. This is because, after 14 days, Fargate resources might become unavailable and job might be terminated. 
   */
  submitJob(params: Batch.Types.SubmitJobRequest, callback?: (err: AWSError, data: Batch.Types.SubmitJobResponse) => void): Request<Batch.Types.SubmitJobResponse, AWSError>;
  /**
   * Submits an Batch job from a job definition. Parameters that are specified during SubmitJob override parameters defined in the job definition. vCPU and memory requirements that are specified in the ResourceRequirements objects in the job definition are the exception. They can't be overridden this way using the memory and vcpus parameters. Rather, you must specify updates to job definition parameters in a ResourceRequirements object that's included in the containerOverrides parameter.  Jobs that run on Fargate resources can't be guaranteed to run for more than 14 days. This is because, after 14 days, Fargate resources might become unavailable and job might be terminated. 
   */
  submitJob(callback?: (err: AWSError, data: Batch.Types.SubmitJobResponse) => void): Request<Batch.Types.SubmitJobResponse, AWSError>;
  /**
   * Associates the specified tags to a resource with the specified resourceArn. If existing tags on a resource aren't specified in the request parameters, they aren't changed. When a resource is deleted, the tags that are associated with that resource are deleted as well. Batch resources that support tags are compute environments, jobs, job definitions, and job queues. ARNs for child jobs of array and multi-node parallel (MNP) jobs are not supported.
   */
  tagResource(params: Batch.Types.TagResourceRequest, callback?: (err: AWSError, data: Batch.Types.TagResourceResponse) => void): Request<Batch.Types.TagResourceResponse, AWSError>;
  /**
   * Associates the specified tags to a resource with the specified resourceArn. If existing tags on a resource aren't specified in the request parameters, they aren't changed. When a resource is deleted, the tags that are associated with that resource are deleted as well. Batch resources that support tags are compute environments, jobs, job definitions, and job queues. ARNs for child jobs of array and multi-node parallel (MNP) jobs are not supported.
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
     * The exit code for the job attempt. A non-zero exit code is considered a failure.
     */
    exitCode?: Integer;
    /**
     * A short (255 max characters) human-readable string to provide additional details about a running or stopped container.
     */
    reason?: String;
    /**
     * The name of the CloudWatch Logs log stream associated with the container. The log group for Batch jobs is /aws/batch/job. Each container attempt receives a log stream name when they reach the RUNNING status.
     */
    logStreamName?: String;
    /**
     * The network interfaces associated with the job attempt.
     */
    networkInterfaces?: NetworkInterfaceList;
  }
  export interface AttemptDetail {
    /**
     * Details about the container in this job attempt.
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
     * A short, human-readable string to provide additional details about the current status of the job attempt.
     */
    statusReason?: String;
  }
  export type AttemptDetails = AttemptDetail[];
  export type Boolean = boolean;
  export type CEState = "ENABLED"|"DISABLED"|string;
  export type CEStatus = "CREATING"|"UPDATING"|"DELETING"|"DELETED"|"VALID"|"INVALID"|string;
  export type CEType = "MANAGED"|"UNMANAGED"|string;
  export type CRAllocationStrategy = "BEST_FIT"|"BEST_FIT_PROGRESSIVE"|"SPOT_CAPACITY_OPTIMIZED"|string;
  export type CRType = "EC2"|"SPOT"|"FARGATE"|"FARGATE_SPOT"|string;
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
     * The name of the compute environment. Up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
     */
    computeEnvironmentName: String;
    /**
     * The Amazon Resource Name (ARN) of the compute environment.
     */
    computeEnvironmentArn: String;
    /**
     * The Amazon Resource Name (ARN) of the underlying Amazon ECS cluster used by the compute environment.
     */
    ecsClusterArn: String;
    /**
     * The tags applied to the compute environment.
     */
    tags?: TagrisTagsMap;
    /**
     * The type of the compute environment: MANAGED or UNMANAGED. For more information, see Compute Environments in the Batch User Guide.
     */
    type?: CEType;
    /**
     * The state of the compute environment. The valid values are ENABLED or DISABLED. If the state is ENABLED, then the Batch scheduler can attempt to place jobs from an associated job queue on the compute resources within the environment. If the compute environment is managed, then it can scale its instances out or in automatically, based on the job queue demand. If the state is DISABLED, then the Batch scheduler doesn't attempt to place jobs within the environment. Jobs in a STARTING or RUNNING state continue to progress normally. Managed compute environments in the DISABLED state don't scale out. However, they scale in to minvCpus value after instances become idle.
     */
    state?: CEState;
    /**
     * The current status of the compute environment (for example, CREATING or VALID).
     */
    status?: CEStatus;
    /**
     * A short, human-readable string to provide additional details about the current status of the compute environment.
     */
    statusReason?: String;
    /**
     * The compute resources defined for the compute environment. For more information, see Compute Environments in the Batch User Guide.
     */
    computeResources?: ComputeResource;
    /**
     * The service role associated with the compute environment that allows Batch to make calls to Amazon Web Services API operations on your behalf. For more information, see Batch service IAM role in the Batch User Guide.
     */
    serviceRole?: String;
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
     * The type of compute environment: EC2, SPOT, FARGATE, or FARGATE_SPOT. For more information, see Compute Environments in the Batch User Guide.  If you choose SPOT, you must also specify an Amazon EC2 Spot Fleet role with the spotIamFleetRole parameter. For more information, see Amazon EC2 Spot Fleet role in the Batch User Guide.
     */
    type: CRType;
    /**
     * The allocation strategy to use for the compute resource if not enough instances of the best fitting instance type can be allocated. This might be because of availability of the instance type in the Region or Amazon EC2 service limits. For more information, see Allocation Strategies in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified.   BEST_FIT (default)  Batch selects an instance type that best fits the needs of the jobs with a preference for the lowest-cost instance type. If additional instances of the selected instance type aren't available, Batch waits for the additional instances to be available. If there aren't enough instances available, or if the user is reaching Amazon EC2 service limits then additional jobs aren't run until the currently running jobs have completed. This allocation strategy keeps costs lower but can limit scaling. If you are using Spot Fleets with BEST_FIT then the Spot Fleet IAM Role must be specified.  BEST_FIT_PROGRESSIVE  Batch will select additional instance types that are large enough to meet the requirements of the jobs in the queue, with a preference for instance types with a lower cost per unit vCPU. If additional instances of the previously selected instance types aren't available, Batch will select new instance types.  SPOT_CAPACITY_OPTIMIZED  Batch will select one or more instance types that are large enough to meet the requirements of the jobs in the queue, with a preference for instance types that are less likely to be interrupted. This allocation strategy is only available for Spot Instance compute resources.   With both BEST_FIT_PROGRESSIVE and SPOT_CAPACITY_OPTIMIZED strategies, Batch might need to go above maxvCpus to meet your capacity requirements. In this event, Batch never exceeds maxvCpus by more than a single instance.
     */
    allocationStrategy?: CRAllocationStrategy;
    /**
     * The minimum number of Amazon EC2 vCPUs that an environment should maintain (even if the compute environment is DISABLED).  This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified. 
     */
    minvCpus?: Integer;
    /**
     * The maximum number of Amazon EC2 vCPUs that a compute environment can reach.  With both BEST_FIT_PROGRESSIVE and SPOT_CAPACITY_OPTIMIZED allocation strategies, Batch might need to exceed maxvCpus to meet your capacity requirements. In this event, Batch never exceeds maxvCpus by more than a single instance. For example, no more than a single instance from among those specified in your compute environment is allocated. 
     */
    maxvCpus: Integer;
    /**
     * The desired number of Amazon EC2 vCPUS in the compute environment. Batch modifies this value between the minimum and maximum values, based on job queue demand.  This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified. 
     */
    desiredvCpus?: Integer;
    /**
     * The instances types that can be launched. You can specify instance families to launch any instance type within those families (for example, c5 or p3), or you can specify specific sizes within a family (such as c5.8xlarge). You can also choose optimal to select instance types (from the C4, M4, and R4 instance families) that match the demand of your job queues.  This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified.   When you create a compute environment, the instance types that you select for the compute environment must share the same architecture. For example, you can't mix x86 and ARM instances in the same compute environment.   Currently, optimal uses instance types from the C4, M4, and R4 instance families. In Regions that don't have instance types from those instance families, instance types from the C5, M5. and R5 instance families are used. 
     */
    instanceTypes?: StringList;
    /**
     * The Amazon Machine Image (AMI) ID used for instances launched in the compute environment. This parameter is overridden by the imageIdOverride member of the Ec2Configuration structure.  This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified.   The AMI that you choose for a compute environment must match the architecture of the instance types that you intend to use for that compute environment. For example, if your compute environment uses A1 instance types, the compute resource AMI that you choose must support ARM instances. Amazon ECS vends both x86 and ARM versions of the Amazon ECS-optimized Amazon Linux 2 AMI. For more information, see Amazon ECS-optimized Amazon Linux 2 AMI in the Amazon Elastic Container Service Developer Guide. 
     */
    imageId?: String;
    /**
     * The VPC subnets where the compute resources are launched. These subnets must be within the same VPC. Fargate compute resources can contain up to 16 subnets. For more information, see VPCs and Subnets in the Amazon VPC User Guide.
     */
    subnets: StringList;
    /**
     * The Amazon EC2 security groups associated with instances launched in the compute environment. One or more security groups must be specified, either in securityGroupIds or using a launch template referenced in launchTemplate. This parameter is required for jobs that are running on Fargate resources and must contain at least one security group. Fargate doesn't support launch templates. If security groups are specified using both securityGroupIds and launchTemplate, the values in securityGroupIds are used.
     */
    securityGroupIds?: StringList;
    /**
     * The Amazon EC2 key pair that's used for instances launched in the compute environment. You can use this key pair to log in to your instances with SSH.  This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified. 
     */
    ec2KeyPair?: String;
    /**
     * The Amazon ECS instance profile applied to Amazon EC2 instances in a compute environment. You can specify the short name or full Amazon Resource Name (ARN) of an instance profile. For example,  ecsInstanceRole  or arn:aws:iam::&lt;aws_account_id&gt;:instance-profile/ecsInstanceRole . For more information, see Amazon ECS Instance Role in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified. 
     */
    instanceRole?: String;
    /**
     * Key-value pair tags to be applied to EC2 resources that are launched in the compute environment. For Batch, these take the form of "String1": "String2", where String1 is the tag key and String2 is the tag value−for example, { "Name": "Batch Instance - C4OnDemand" }. This is helpful for recognizing your Batch instances in the Amazon EC2 console. These tags can't be updated or removed after the compute environment is created.Aany changes to these tags require that you create a new compute environment and remove the old compute environment. These tags aren't seen when using the Batch ListTagsForResource API operation.  This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified. 
     */
    tags?: TagsMap;
    /**
     * The Amazon EC2 placement group to associate with your compute resources. If you intend to submit multi-node parallel jobs to your compute environment, you should consider creating a cluster placement group and associate it with your compute resources. This keeps your multi-node parallel job on a logical grouping of instances within a single Availability Zone with high network flow potential. For more information, see Placement Groups in the Amazon EC2 User Guide for Linux Instances.  This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified. 
     */
    placementGroup?: String;
    /**
     * The maximum percentage that a Spot Instance price can be when compared with the On-Demand price for that instance type before instances are launched. For example, if your maximum percentage is 20%, then the Spot price must be less than 20% of the current On-Demand price for that Amazon EC2 instance. You always pay the lowest (market) price and never more than your maximum percentage. If you leave this field empty, the default value is 100% of the On-Demand price.  This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified. 
     */
    bidPercentage?: Integer;
    /**
     * The Amazon Resource Name (ARN) of the Amazon EC2 Spot Fleet IAM role applied to a SPOT compute environment. This role is required if the allocation strategy set to BEST_FIT or if the allocation strategy isn't specified. For more information, see Amazon EC2 Spot Fleet Role in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified.   To tag your Spot Instances on creation, the Spot Fleet IAM role specified here must use the newer AmazonEC2SpotFleetTaggingRole managed policy. The previously recommended AmazonEC2SpotFleetRole managed policy doesn't have the required permissions to tag Spot Instances. For more information, see Spot Instances not tagged on creation in the Batch User Guide. 
     */
    spotIamFleetRole?: String;
    /**
     * The launch template to use for your compute resources. Any other compute resource parameters that you specify in a CreateComputeEnvironment API operation override the same parameters in the launch template. You must specify either the launch template ID or launch template name in the request, but not both. For more information, see Launch Template Support in the Batch User Guide.  This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified. 
     */
    launchTemplate?: LaunchTemplateSpecification;
    /**
     * Provides information used to select Amazon Machine Images (AMIs) for EC2 instances in the compute environment. If Ec2Configuration isn't specified, the default is ECS_AL1.  This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified. 
     */
    ec2Configuration?: Ec2ConfigurationList;
  }
  export interface ComputeResourceUpdate {
    /**
     * The minimum number of Amazon EC2 vCPUs that an environment should maintain.  This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified. 
     */
    minvCpus?: Integer;
    /**
     * The maximum number of Amazon EC2 vCPUs that an environment can reach.  With both BEST_FIT_PROGRESSIVE and SPOT_CAPACITY_OPTIMIZED allocation strategies, Batch might need to exceed maxvCpus to meet your capacity requirements. In this event, Batch never exceeds maxvCpus by more than a single instance. That is, no more than a single instance from among those specified in your compute environment. 
     */
    maxvCpus?: Integer;
    /**
     * The desired number of Amazon EC2 vCPUS in the compute environment.  This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified. 
     */
    desiredvCpus?: Integer;
    /**
     * The VPC subnets where the compute resources are launched. Fargate compute resources can contain up to 16 subnets. Providing an empty list will be handled as if this parameter wasn't specified and no change is made. This can't be specified for EC2 compute resources. For more information, see VPCs and Subnets in the Amazon VPC User Guide.
     */
    subnets?: StringList;
    /**
     * The Amazon EC2 security groups associated with instances launched in the compute environment. This parameter is required for Fargate compute resources, where it can contain up to 5 security groups. This can't be specified for EC2 compute resources. Providing an empty list is handled as if this parameter wasn't specified and no change is made.
     */
    securityGroupIds?: StringList;
  }
  export interface ContainerDetail {
    /**
     * The image used to start the container.
     */
    image?: String;
    /**
     * The number of vCPUs reserved for the container. For jobs that run on EC2 resources, you can specify the vCPU requirement for the job using resourceRequirements, but you can't specify the vCPU requirements in both the vcpus and resourceRequirement object. This parameter maps to CpuShares in the Create a container section of the Docker Remote API and the --cpu-shares option to docker run. Each vCPU is equivalent to 1,024 CPU shares. You must specify at least one vCPU. This is required but can be specified in several places. It must be specified for each node at least once.  This parameter isn't applicable to jobs that run on Fargate resources. For jobs that run on Fargate resources, you must specify the vCPU requirement for the job using resourceRequirements. 
     */
    vcpus?: Integer;
    /**
     * For jobs run on EC2 resources that didn't specify memory requirements using ResourceRequirement, the number of MiB of memory reserved for the job. For other jobs, including all run on Fargate resources, see resourceRequirements.
     */
    memory?: Integer;
    /**
     * The command that's passed to the container.
     */
    command?: StringList;
    /**
     * The Amazon Resource Name (ARN) associated with the job upon execution.
     */
    jobRoleArn?: String;
    /**
     * The Amazon Resource Name (ARN) of the execution role that Batch can assume. For more information, see Batch execution IAM role in the Batch User Guide.
     */
    executionRoleArn?: String;
    /**
     * A list of volumes associated with the job.
     */
    volumes?: Volumes;
    /**
     * The environment variables to pass to a container.  Environment variables must not start with AWS_BATCH; this naming convention is reserved for variables that are set by the Batch service. 
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
     * A short (255 max characters) human-readable string to provide additional details about a running or stopped container.
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
     * The name of the CloudWatch Logs log stream associated with the container. The log group for Batch jobs is /aws/batch/job. Each container attempt receives a log stream name when they reach the RUNNING status.
     */
    logStreamName?: String;
    /**
     * The instance type of the underlying host infrastructure of a multi-node parallel job.  This parameter isn't applicable to jobs that are running on Fargate resources. 
     */
    instanceType?: String;
    /**
     * The network interfaces associated with the job.
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
     * The log configuration specification for the container. This parameter maps to LogConfig in the Create a container section of the Docker Remote API and the --log-driver option to docker run. By default, containers use the same logging driver that the Docker daemon uses. However, the container might use a different logging driver than the Docker daemon by specifying a log driver with this parameter in the container definition. To use a different logging driver for a container, the log system must be configured properly on the container instance. Or, alternatively, it must be configured on a different log server for remote logging options. For more information on the options for different supported log drivers, see Configure logging drivers in the Docker documentation.  Batch currently supports a subset of the logging drivers available to the Docker daemon (shown in the LogConfiguration data type). Additional log drivers might be available in future releases of the Amazon ECS container agent.  This parameter requires version 1.18 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log into your container instance and run the following command: sudo docker version | grep "Server API version"   The Amazon ECS container agent running on a container instance must register the logging drivers available on that instance with the ECS_AVAILABLE_LOGGING_DRIVERS environment variable before containers placed on that instance can use these log configuration options. For more information, see Amazon ECS Container Agent Configuration in the Amazon Elastic Container Service Developer Guide. 
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
  }
  export interface ContainerOverrides {
    /**
     * This parameter indicates the number of vCPUs reserved for the container.It overrides the vcpus parameter that's set in the job definition, but doesn't override any vCPU requirement specified in the resourceRequirement structure in the job definition. To override vCPU requirements that are specified in the ResourceRequirement structure in the job definition, ResourceRequirement must be specified in the SubmitJob request, with type set to VCPU and value set to the new value. This parameter maps to CpuShares in the Create a container section of the Docker Remote API and the --cpu-shares option to docker run. Each vCPU is equivalent to 1,024 CPU shares. You must specify at least one vCPU.  This parameter is supported for jobs that run on EC2 resources, but isn't supported for jobs that run on Fargate resources. For Fargate resources, you can only use resourceRequirement. For EC2 resources, you can use either this parameter or resourceRequirement but not both. 
     */
    vcpus?: Integer;
    /**
     * This parameter indicates the amount of memory (in MiB) that's reserved for the job. It overrides the memory parameter set in the job definition, but doesn't override any memory requirement specified in the ResourceRequirement structure in the job definition. To override memory requirements that are specified in the ResourceRequirement structure in the job definition, ResourceRequirement must be specified in the SubmitJob request, with type set to MEMORY and value set to the new value. This parameter is supported for jobs that run on EC2 resources, but isn't supported for jobs that run on Fargate resources. For these resources, use resourceRequirement instead.
     */
    memory?: Integer;
    /**
     * The command to send to the container that overrides the default command from the Docker image or the job definition.
     */
    command?: StringList;
    /**
     * The instance type to use for a multi-node parallel job.  This parameter isn't applicable to single-node container jobs or jobs that run on Fargate resources, and shouldn't be provided. 
     */
    instanceType?: String;
    /**
     * The environment variables to send to the container. You can add new environment variables, which are added to the container at launch, or you can override the existing environment variables from the Docker image or the job definition.  Environment variables must not start with AWS_BATCH; this naming convention is reserved for variables that are set by the Batch service. 
     */
    environment?: EnvironmentVariables;
    /**
     * The type and amount of resources to assign to a container. This overrides the settings in the job definition. The supported resources include GPU, MEMORY, and VCPU.
     */
    resourceRequirements?: ResourceRequirements;
  }
  export interface ContainerProperties {
    /**
     * The image used to start a container. This string is passed directly to the Docker daemon. Images in the Docker Hub registry are available by default. Other repositories are specified with  repository-url/image:tag . Up to 255 letters (uppercase and lowercase), numbers, hyphens, underscores, colons, periods, forward slashes, and number signs are allowed. This parameter maps to Image in the Create a container section of the Docker Remote API and the IMAGE parameter of docker run.  Docker image architecture must match the processor architecture of the compute resources that they're scheduled on. For example, ARM-based Docker images can only run on ARM-based compute resources.    Images in Amazon ECR repositories use the full registry and repository URI (for example, 012345678910.dkr.ecr.&lt;region-name&gt;.amazonaws.com/&lt;repository-name&gt;).   Images in official repositories on Docker Hub use a single name (for example, ubuntu or mongo).   Images in other repositories on Docker Hub are qualified with an organization name (for example, amazon/amazon-ecs-agent).   Images in other online repositories are qualified further by a domain name (for example, quay.io/assemblyline/ubuntu).  
     */
    image?: String;
    /**
     * The number of vCPUs reserved for the job. Each vCPU is equivalent to 1,024 CPU shares. This parameter maps to CpuShares in the Create a container section of the Docker Remote API and the --cpu-shares option to docker run. The number of vCPUs must be specified but can be specified in several places. You must specify it at least once for each node. This parameter is supported on EC2 resources but isn't supported for jobs that run on Fargate resources. For these resources, use resourceRequirement instead. You can use this parameter or resourceRequirements structure but not both.  This parameter isn't applicable to jobs that are running on Fargate resources and shouldn't be provided. For jobs that run on Fargate resources, you must specify the vCPU requirement for the job using resourceRequirements. 
     */
    vcpus?: Integer;
    /**
     * This parameter indicates the memory hard limit (in MiB) for a container. If your container attempts to exceed the specified number, it's terminated. You must specify at least 4 MiB of memory for a job using this parameter. The memory hard limit can be specified in several places. It must be specified for each node at least once. This parameter maps to Memory in the Create a container section of the Docker Remote API and the --memory option to docker run. This parameter is supported on EC2 resources but isn't supported on Fargate resources. For Fargate resources, you should specify the memory requirement using resourceRequirement. You can also do this for EC2 resources.  If you're trying to maximize your resource utilization by providing your jobs as much memory as possible for a particular instance type, see Memory Management in the Batch User Guide. 
     */
    memory?: Integer;
    /**
     * The command that's passed to the container. This parameter maps to Cmd in the Create a container section of the Docker Remote API and the COMMAND parameter to docker run. For more information, see https://docs.docker.com/engine/reference/builder/#cmd.
     */
    command?: StringList;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that the container can assume for Amazon Web Services permissions. For more information, see IAM Roles for Tasks in the Amazon Elastic Container Service Developer Guide.
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
     * The environment variables to pass to a container. This parameter maps to Env in the Create a container section of the Docker Remote API and the --env option to docker run.  We don't recommend using plaintext environment variables for sensitive information, such as credential data.   Environment variables must not start with AWS_BATCH; this naming convention is reserved for variables that are set by the Batch service. 
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
     * The log configuration specification for the container. This parameter maps to LogConfig in the Create a container section of the Docker Remote API and the --log-driver option to docker run. By default, containers use the same logging driver that the Docker daemon uses. However the container might use a different logging driver than the Docker daemon by specifying a log driver with this parameter in the container definition. To use a different logging driver for a container, the log system must be configured properly on the container instance (or on a different log server for remote logging options). For more information on the options for different supported log drivers, see Configure logging drivers in the Docker documentation.  Batch currently supports a subset of the logging drivers available to the Docker daemon (shown in the LogConfiguration data type).  This parameter requires version 1.18 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log into your container instance and run the following command: sudo docker version | grep "Server API version"   The Amazon ECS container agent running on a container instance must register the logging drivers available on that instance with the ECS_AVAILABLE_LOGGING_DRIVERS environment variable before containers placed on that instance can use these log configuration options. For more information, see Amazon ECS Container Agent Configuration in the Amazon Elastic Container Service Developer Guide. 
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
  }
  export interface ContainerSummary {
    /**
     * The exit code to return upon completion.
     */
    exitCode?: Integer;
    /**
     * A short (255 max characters) human-readable string to provide additional details about a running or stopped container.
     */
    reason?: String;
  }
  export interface CreateComputeEnvironmentRequest {
    /**
     * The name for your compute environment. Up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
     */
    computeEnvironmentName: String;
    /**
     * The type of the compute environment: MANAGED or UNMANAGED. For more information, see Compute Environments in the Batch User Guide.
     */
    type: CEType;
    /**
     * The state of the compute environment. If the state is ENABLED, then the compute environment accepts jobs from a queue and can scale out automatically based on queues. If the state is ENABLED, then the Batch scheduler can attempt to place jobs from an associated job queue on the compute resources within the environment. If the compute environment is managed, then it can scale its instances out or in automatically, based on the job queue demand. If the state is DISABLED, then the Batch scheduler doesn't attempt to place jobs within the environment. Jobs in a STARTING or RUNNING state continue to progress normally. Managed compute environments in the DISABLED state don't scale out. However, they scale in to minvCpus value after instances become idle.
     */
    state?: CEState;
    /**
     * Details about the compute resources managed by the compute environment. This parameter is required for managed compute environments. For more information, see Compute Environments in the Batch User Guide.
     */
    computeResources?: ComputeResource;
    /**
     * The full Amazon Resource Name (ARN) of the IAM role that allows Batch to make calls to other Amazon Web Services services on your behalf. For more information, see Batch service IAM role in the Batch User Guide.  If your account already created the Batch service-linked role, that role is used by default for your compute environment unless you specify a different role here. If the Batch service-linked role doesn't exist in your account, and no role is specified here, the service attempts to create the Batch service-linked role in your account.  If your specified role has a path other than /, then you must specify either the full role ARN (recommended) or prefix the role name with the path. For example, if a role with the name bar has a path of /foo/ then you would specify /foo/bar as the role name. For more information, see Friendly names and paths in the IAM User Guide.  Depending on how you created your Batch service role, its ARN might contain the service-role path prefix. When you only specify the name of the service role, Batch assumes that your ARN doesn't use the service-role path prefix. Because of this, we recommend that you specify the full ARN of your service role when you create compute environments. 
     */
    serviceRole?: String;
    /**
     * The tags that you apply to the compute environment to help you categorize and organize your resources. Each tag consists of a key and an optional value. For more information, see Tagging Amazon Web Services Resources in Amazon Web Services General Reference. These tags can be updated or removed using the TagResource and UntagResource API operations. These tags don't propagate to the underlying compute resources.
     */
    tags?: TagrisTagsMap;
  }
  export interface CreateComputeEnvironmentResponse {
    /**
     * The name of the compute environment. Up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
     */
    computeEnvironmentName?: String;
    /**
     * The Amazon Resource Name (ARN) of the compute environment.
     */
    computeEnvironmentArn?: String;
  }
  export interface CreateJobQueueRequest {
    /**
     * The name of the job queue. Up to 128 letters (uppercase and lowercase), numbers, and underscores are allowed.
     */
    jobQueueName: String;
    /**
     * The state of the job queue. If the job queue state is ENABLED, it is able to accept jobs. If the job queue state is DISABLED, new jobs can't be added to the queue, but jobs already in the queue can finish.
     */
    state?: JQState;
    /**
     * The priority of the job queue. Job queues with a higher priority (or a higher integer value for the priority parameter) are evaluated first when associated with the same compute environment. Priority is determined in descending order. For example, a job queue with a priority value of 10 is given scheduling preference over a job queue with a priority value of 1. All of the compute environments must be either EC2 (EC2 or SPOT) or Fargate (FARGATE or FARGATE_SPOT); EC2 and Fargate compute environments can't be mixed.
     */
    priority: Integer;
    /**
     * The set of compute environments mapped to a job queue and their order relative to each other. The job scheduler uses this parameter to determine which compute environment should run a specific job. Compute environments must be in the VALID state before you can associate them with a job queue. You can associate up to three compute environments with a job queue. All of the compute environments must be either EC2 (EC2 or SPOT) or Fargate (FARGATE or FARGATE_SPOT); EC2 and Fargate compute environments can't be mixed.  All compute environments that are associated with a job queue must share the same architecture. Batch doesn't support mixing compute environment architecture types in a single job queue. 
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
     * The nextToken value returned from a previous paginated DescribeComputeEnvironments request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return.  This token should be treated as an opaque identifier that's only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    nextToken?: String;
  }
  export interface DescribeComputeEnvironmentsResponse {
    /**
     * The list of compute environments.
     */
    computeEnvironments?: ComputeEnvironmentDetailList;
    /**
     * The nextToken value to include in a future DescribeComputeEnvironments request. When the results of a DescribeJobDefinitions request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: String;
  }
  export interface DescribeJobDefinitionsRequest {
    /**
     * A list of up to 100 job definitions. Each entry in the list can either be an ARN of the form arn:aws:batch:${Region}:${Account}:job-definition/${JobDefinitionName}:${Revision} or a short version using the form ${JobDefinitionName}:${Revision}.
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
     * The nextToken value returned from a previous paginated DescribeJobDefinitions request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return.  This token should be treated as an opaque identifier that's only used to retrieve the next items in a list and not for other programmatic purposes. 
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
     * The nextToken value returned from a previous paginated DescribeJobQueues request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return.  This token should be treated as an opaque identifier that's only used to retrieve the next items in a list and not for other programmatic purposes. 
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
     * The Amazon EFS access point ID to use. If an access point is specified, the root directory value specified in the EFSVolumeConfiguration must either be omitted or set to / which will enforce the path set on the EFS access point. If an access point is used, transit encryption must be enabled in the EFSVolumeConfiguration. For more information, see Working with Amazon EFS Access Points in the Amazon Elastic File System User Guide.
     */
    accessPointId?: String;
    /**
     * Whether or not to use the Batch job IAM role defined in a job definition when mounting the Amazon EFS file system. If enabled, transit encryption must be enabled in the EFSVolumeConfiguration. If this parameter is omitted, the default value of DISABLED is used. For more information, see Using Amazon EFS Access Points in the Batch User Guide. EFS IAM authorization requires that TransitEncryption be ENABLED and that a JobRoleArn is specified.
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
     * The port to use when sending encrypted data between the Amazon ECS host and the Amazon EFS server. If you don't specify a transit encryption port, it uses the port selection strategy that the Amazon EFS mount helper uses. The value must be between 0 and 65,535. For more information, see EFS Mount Helper in the Amazon Elastic File System User Guide.
     */
    transitEncryptionPort?: Integer;
    /**
     * The authorization configuration details for the Amazon EFS file system.
     */
    authorizationConfig?: EFSAuthorizationConfig;
  }
  export interface Ec2Configuration {
    /**
     * The image type to match with the instance type to select an AMI. If the imageIdOverride parameter isn't specified, then a recent Amazon ECS-optimized AMI (ECS_AL1) is used. Starting on March 31, 2021, this default will be changing to ECS_AL2 (Amazon Linux 2).  ECS_AL2   Amazon Linux 2− Default for all Amazon Web Services Graviton-based instance families (for example, C6g, M6g, R6g, and T4g) and can be used for all non-GPU instance types.  ECS_AL2_NVIDIA   Amazon Linux 2 (GPU)−Default for all GPU instance families (for example P4 and G4) and can be used for all non Amazon Web Services Graviton-based instance types.  ECS_AL1   Amazon Linux−Default for all non-GPU, non Amazon Web Services Graviton instance families. Amazon Linux is reaching the end-of-life of standard support. For more information, see Amazon Linux AMI.  
     */
    imageType: ImageType;
    /**
     * The AMI ID used for instances launched in the compute environment that match the image type. This setting overrides the imageId set in the computeResource object.
     */
    imageIdOverride?: ImageIdOverride;
  }
  export type Ec2ConfigurationList = Ec2Configuration[];
  export type EnvironmentVariables = KeyValuePair[];
  export interface EvaluateOnExit {
    /**
     * Contains a glob pattern to match against the StatusReason returned for a job. The pattern can be up to 512 characters in length. It can contain letters, numbers, periods (.), colons (:), and white space (including spaces or tabs). It can optionally end with an asterisk (*) so that only the start of the string needs to be an exact match.
     */
    onStatusReason?: String;
    /**
     * Contains a glob pattern to match against the Reason returned for a job. The pattern can be up to 512 characters in length. It can contain letters, numbers, periods (.), colons (:), and white space (including spaces and tabs). It can optionally end with an asterisk (*) so that only the start of the string needs to be an exact match.
     */
    onReason?: String;
    /**
     * Contains a glob pattern to match against the decimal representation of the ExitCode returned for a job. The pattern can be up to 512 characters in length. It can contain only numbers, and can optionally end with an asterisk (*) so that only the start of the string needs to be an exact match.
     */
    onExitCode?: String;
    /**
     * Specifies the action to take if all of the specified conditions (onStatusReason, onReason, and onExitCode) are met. The values aren't case sensitive.
     */
    action: RetryAction;
  }
  export type EvaluateOnExitList = EvaluateOnExit[];
  export interface FargatePlatformConfiguration {
    /**
     * The Fargate platform version where the jobs are running. A platform version is specified only for jobs that are running on Fargate resources. If one isn't specified, the LATEST platform version is used by default. This uses a recent, approved version of the Fargate platform for compute resources. For more information, see Fargate platform versions in the Amazon Elastic Container Service Developer Guide.
     */
    platformVersion?: String;
  }
  export interface Host {
    /**
     * The path on the host container instance that's presented to the container. If this parameter is empty, then the Docker daemon has assigned a host path for you. If this parameter contains a file location, then the data volume persists at the specified location on the host container instance until you delete it manually. If the source path location doesn't exist on the host container instance, the Docker daemon creates it. If the location does exist, the contents of the source path folder are exported.  This parameter isn't applicable to jobs that run on Fargate resources and shouldn't be provided. 
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
     * The type of job definition. If the job is run on Fargate resources, then multinode isn't supported. For more information about multi-node parallel jobs, see Creating a multi-node parallel job definition in the Batch User Guide.
     */
    type: String;
    /**
     * Default parameters or parameter substitution placeholders that are set in the job definition. Parameters are specified as a key-value pair mapping. Parameters in a SubmitJob request override any corresponding parameter defaults from the job definition. For more information about specifying parameters, see Job Definition Parameters in the Batch User Guide.
     */
    parameters?: ParametersMap;
    /**
     * The retry strategy to use for failed jobs that are submitted with this job definition.
     */
    retryStrategy?: RetryStrategy;
    /**
     * An object with various properties specific to container-based jobs.
     */
    containerProperties?: ContainerProperties;
    /**
     * The timeout configuration for jobs that are submitted with this job definition. You can specify a timeout duration after which Batch terminates your jobs if they haven't finished.
     */
    timeout?: JobTimeout;
    /**
     * An object with various properties specific to multi-node parallel jobs.  If the job runs on Fargate resources, then you must not specify nodeProperties; use containerProperties instead. 
     */
    nodeProperties?: NodeProperties;
    /**
     * The tags applied to the job definition.
     */
    tags?: TagrisTagsMap;
    /**
     * Specifies whether to propagate the tags from the job or job definition to the corresponding Amazon ECS task. If no value is specified, the tags aren't propagated. Tags can only be propagated to the tasks during task creation. For tags with the same name, job tags are given priority over job definitions tags. If the total number of combined tags from the job and job definition is over 50, the job is moved to the FAILED state.
     */
    propagateTags?: Boolean;
    /**
     * The platform capabilities required by the job definition. If no value is specified, it defaults to EC2. Jobs run on Fargate resources specify FARGATE.
     */
    platformCapabilities?: PlatformCapabilityList;
  }
  export type JobDefinitionList = JobDefinition[];
  export type JobDefinitionType = "container"|"multinode"|string;
  export interface JobDependency {
    /**
     * The job ID of the Batch job associated with this dependency.
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
     * The name of the job.
     */
    jobName: String;
    /**
     * The ID for the job.
     */
    jobId: String;
    /**
     * The Amazon Resource Name (ARN) of the job queue that the job is associated with.
     */
    jobQueue: String;
    /**
     * The current status for the job.  If your jobs don't progress to STARTING, see Jobs Stuck in RUNNABLE Status in the troubleshooting section of the Batch User Guide. 
     */
    status: JobStatus;
    /**
     * A list of job attempts associated with this job.
     */
    attempts?: AttemptDetails;
    /**
     * A short, human-readable string to provide additional details about the current status of the job.
     */
    statusReason?: String;
    /**
     * The Unix timestamp (in milliseconds) for when the job was created. For non-array jobs and parent array jobs, this is when the job entered the SUBMITTED state (at the time SubmitJob was called). For array child jobs, this is when the child job was spawned by its parent and entered the PENDING state.
     */
    createdAt?: Long;
    /**
     * The retry strategy to use for this job if an attempt fails.
     */
    retryStrategy?: RetryStrategy;
    /**
     * The Unix timestamp (in milliseconds) for when the job was started (when the job transitioned from the STARTING state to the RUNNING state). This parameter isn't provided for child jobs of array jobs or multi-node parallel jobs.
     */
    startedAt: Long;
    /**
     * The Unix timestamp (in milliseconds) for when the job was stopped (when the job transitioned from the RUNNING state to a terminal state, such as SUCCEEDED or FAILED).
     */
    stoppedAt?: Long;
    /**
     * A list of job IDs that this job depends on.
     */
    dependsOn?: JobDependencyList;
    /**
     * The job definition that's used by this job.
     */
    jobDefinition: String;
    /**
     * Additional parameters passed to the job that replace parameter substitution placeholders or override any corresponding parameter defaults from the job definition.
     */
    parameters?: ParametersMap;
    /**
     * An object representing the details of the container that's associated with the job.
     */
    container?: ContainerDetail;
    /**
     * An object representing the details of a node that's associated with a multi-node parallel job.
     */
    nodeDetails?: NodeDetails;
    /**
     * An object representing the node properties of a multi-node parallel job.  This isn't applicable to jobs that are running on Fargate resources. 
     */
    nodeProperties?: NodeProperties;
    /**
     * The array properties of the job, if it is an array job.
     */
    arrayProperties?: ArrayPropertiesDetail;
    /**
     * The timeout configuration for the job.
     */
    timeout?: JobTimeout;
    /**
     * The tags applied to the job.
     */
    tags?: TagrisTagsMap;
    /**
     * Specifies whether to propagate the tags from the job or job definition to the corresponding Amazon ECS task. If no value is specified, the tags aren't propagated. Tags can only be propagated to the tasks during task creation. For tags with the same name, job tags are given priority over job definitions tags. If the total number of combined tags from the job and job definition is over 50, the job is moved to the FAILED state.
     */
    propagateTags?: Boolean;
    /**
     * The platform capabilities required by the job definition. If no value is specified, it defaults to EC2. Jobs run on Fargate resources specify FARGATE.
     */
    platformCapabilities?: PlatformCapabilityList;
  }
  export type JobDetailList = JobDetail[];
  export interface JobQueueDetail {
    /**
     * The name of the job queue.
     */
    jobQueueName: String;
    /**
     * The Amazon Resource Name (ARN) of the job queue.
     */
    jobQueueArn: String;
    /**
     * Describes the ability of the queue to accept new jobs. If the job queue state is ENABLED, it's able to accept jobs. If the job queue state is DISABLED, new jobs can't be added to the queue, but jobs already in the queue can finish.
     */
    state: JQState;
    /**
     * The status of the job queue (for example, CREATING or VALID).
     */
    status?: JQStatus;
    /**
     * A short, human-readable string to provide additional details about the current status of the job queue.
     */
    statusReason?: String;
    /**
     * The priority of the job queue. Job queues with a higher priority (or a higher integer value for the priority parameter) are evaluated first when associated with the same compute environment. Priority is determined in descending order, for example, a job queue with a priority value of 10 is given scheduling preference over a job queue with a priority value of 1. All of the compute environments must be either EC2 (EC2 or SPOT) or Fargate (FARGATE or FARGATE_SPOT); EC2 and Fargate compute environments can't be mixed.
     */
    priority: Integer;
    /**
     * The compute environments that are attached to the job queue and the order that job placement is preferred. Compute environments are selected for job placement in ascending order.
     */
    computeEnvironmentOrder: ComputeEnvironmentOrders;
    /**
     * The tags applied to the job queue. For more information, see Tagging your Batch resources in Batch User Guide.
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
     * The ID of the job.
     */
    jobId: String;
    /**
     * The name of the job.
     */
    jobName: String;
    /**
     * The Unix timestamp for when the job was created. For non-array jobs and parent array jobs, this is when the job entered the SUBMITTED state (at the time SubmitJob was called). For array child jobs, this is when the child job was spawned by its parent and entered the PENDING state.
     */
    createdAt?: Long;
    /**
     * The current status for the job.
     */
    status?: JobStatus;
    /**
     * A short, human-readable string to provide additional details about the current status of the job.
     */
    statusReason?: String;
    /**
     * The Unix timestamp for when the job was started (when the job transitioned from the STARTING state to the RUNNING state).
     */
    startedAt?: Long;
    /**
     * The Unix timestamp for when the job was stopped (when the job transitioned from the RUNNING state to a terminal state, such as SUCCEEDED or FAILED).
     */
    stoppedAt?: Long;
    /**
     * An object representing the details of the container that's associated with the job.
     */
    container?: ContainerSummary;
    /**
     * The array properties of the job, if it is an array job.
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
     * The time duration in seconds (measured from the job attempt's startedAt timestamp) after which Batch terminates your jobs if they have not finished. The minimum value for the timeout is 60 seconds.
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
     * The version number of the launch template, $Latest, or $Default. If the value is $Latest, the latest version of the launch template is used. If the value is $Default, the default version of the launch template is used.  After the compute environment is created, the launch template version that's used isn't changed, even if the $Default or $Latest version for the launch template is updated. To use a new launch template version, create a new compute environment, add the new compute environment to the existing job queue, remove the old compute environment from the job queue, and delete the old compute environment.  Default: $Default.
     */
    version?: String;
  }
  export interface LinuxParameters {
    /**
     * Any host devices to expose to the container. This parameter maps to Devices in the Create a container section of the Docker Remote API and the --device option to docker run.  This parameter isn't applicable to jobs that are running on Fargate resources and shouldn't be provided. 
     */
    devices?: DevicesList;
    /**
     * If true, run an init process inside the container that forwards signals and reaps processes. This parameter maps to the --init option to docker run. This parameter requires version 1.25 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log into your container instance and run the following command: sudo docker version | grep "Server API version" 
     */
    initProcessEnabled?: Boolean;
    /**
     * The value for the size (in MiB) of the /dev/shm volume. This parameter maps to the --shm-size option to docker run.  This parameter isn't applicable to jobs that are running on Fargate resources and shouldn't be provided. 
     */
    sharedMemorySize?: Integer;
    /**
     * The container path, mount options, and size (in MiB) of the tmpfs mount. This parameter maps to the --tmpfs option to docker run.  This parameter isn't applicable to jobs that are running on Fargate resources and shouldn't be provided. 
     */
    tmpfs?: TmpfsList;
    /**
     * The total amount of swap memory (in MiB) a container can use. This parameter is translated to the --memory-swap option to docker run where the value is the sum of the container memory plus the maxSwap value. For more information, see  --memory-swap details in the Docker documentation. If a maxSwap value of 0 is specified, the container doesn't use swap. Accepted values are 0 or any positive integer. If the maxSwap parameter is omitted, the container doesn't use the swap configuration for the container instance it is running on. A maxSwap value must be set for the swappiness parameter to be used.  This parameter isn't applicable to jobs that are running on Fargate resources and shouldn't be provided. 
     */
    maxSwap?: Integer;
    /**
     * This allows you to tune a container's memory swappiness behavior. A swappiness value of 0 causes swapping not to happen unless absolutely necessary. A swappiness value of 100 causes pages to be swapped very aggressively. Accepted values are whole numbers between 0 and 100. If the swappiness parameter isn't specified, a default value of 60 is used. If a value isn't specified for maxSwap, then this parameter is ignored. If maxSwap is set to 0, the container doesn't use swap. This parameter maps to the --memory-swappiness option to docker run. Consider the following when you use a per-container swap configuration.   Swap space must be enabled and allocated on the container instance for the containers to use.  The Amazon ECS optimized AMIs don't have swap enabled by default. You must enable swap on the instance to use this feature. For more information, see Instance Store Swap Volumes in the Amazon EC2 User Guide for Linux Instances or How do I allocate memory to work as swap space in an Amazon EC2 instance by using a swap file?     The swap space parameters are only supported for job definitions using EC2 resources.   If the maxSwap and swappiness parameters are omitted from a job definition, each container will have a default swappiness value of 60, and the total swap usage will be limited to two times the memory reservation of the container.    This parameter isn't applicable to jobs that are running on Fargate resources and shouldn't be provided. 
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
     * The nextToken value returned from a previous paginated ListJobs request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return.  This token should be treated as an opaque identifier that's only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    nextToken?: String;
    /**
     * The filter to apply to the query. Only one filter can be used at a time. When the filter is used, jobStatus is ignored. The filter doesn't apply to child jobs in an array or multi-node parallel (MNP) jobs. The results are sorted by the createdAt field, with the most recent jobs being first.  JOB_NAME  The value of the filter is a case-insensitive match for the job name. If the value ends with an asterisk (*), the filter will match any job name that begins with the string before the '*'. This corresponds to the jobName value. For example, test1 matches both Test1 and test1, and test1* matches both test1 and Test10. When the JOB_NAME filter is used, the results are grouped by the job name and version.  JOB_DEFINITION  The value for the filter is the name or Amazon Resource Name (ARN) of the job definition. This corresponds to the jobDefinition value. The value is case sensitive. When the value for the filter is the job definition name, the results include all the jobs that used any revision of that job definition name. If the value ends with an asterisk (*), the filter will match any job definition name that begins with the string before the '*'. For example, jd1 matches only jd1, and jd1* matches both jd1 and jd1A. The version of the job definition that's used doesn't affect the sort order. When the JOB_DEFINITION filter is used and the ARN is used (which is in the form arn:${Partition}:batch:${Region}:${Account}:job-definition/${JobDefinitionName}:${Revision}), the results include jobs that used the specified revision of the job definition. Asterisk (*) is not supported when the ARN is used.  BEFORE_CREATED_AT  The value for the filter is the time that's before the job was created. This corresponds to the createdAt value. The value is a string representation of the number of seconds since 00:00:00 UTC (midnight) on January 1, 1970.  AFTER_CREATED_AT  The value for the filter is the time that's after the job was created. This corresponds to the createdAt value. The value is a string representation of the number of seconds since 00:00:00 UTC (midnight) on January 1, 1970.  
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
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the resource that tags are listed for. Batch resources that support tags are compute environments, jobs, job definitions, and job queues. ARNs for child jobs of array and multi-node parallel (MNP) jobs are not supported.
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
     * The log driver to use for the container. The valid values listed for this parameter are log drivers that the Amazon ECS container agent can communicate with by default. The supported log drivers are awslogs, fluentd, gelf, json-file, journald, logentries, syslog, and splunk.  Jobs that are running on Fargate resources are restricted to the awslogs and splunk log drivers.   awslogs  Specifies the Amazon CloudWatch Logs logging driver. For more information, see Using the awslogs Log Driver in the Batch User Guide and Amazon CloudWatch Logs logging driver in the Docker documentation.  fluentd  Specifies the Fluentd logging driver. For more information, including usage and options, see Fluentd logging driver in the Docker documentation.  gelf  Specifies the Graylog Extended Format (GELF) logging driver. For more information, including usage and options, see Graylog Extended Format logging driver in the Docker documentation.  journald  Specifies the journald logging driver. For more information, including usage and options, see Journald logging driver in the Docker documentation.  json-file  Specifies the JSON file logging driver. For more information, including usage and options, see JSON File logging driver in the Docker documentation.  splunk  Specifies the Splunk logging driver. For more information, including usage and options, see Splunk logging driver in the Docker documentation.  syslog  Specifies the syslog logging driver. For more information, including usage and options, see Syslog logging driver in the Docker documentation.    If you have a custom driver that's not listed earlier that you want to work with the Amazon ECS container agent, you can fork the Amazon ECS container agent project that's available on GitHub and customize it to work with that driver. We encourage you to submit pull requests for changes that you want to have included. However, Amazon Web Services doesn't currently support running modified copies of this software.  This parameter requires version 1.18 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log into your container instance and run the following command: sudo docker version | grep "Server API version" 
     */
    logDriver: LogDriver;
    /**
     * The configuration options to send to the log driver. This parameter requires version 1.19 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log into your container instance and run the following command: sudo docker version | grep "Server API version" 
     */
    options?: LogConfigurationOptionsMap;
    /**
     * The secrets to pass to the log configuration. For more information, see Specifying Sensitive Data in the Batch User Guide.
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
     * Indicates whether the job should have a public IP address. For a job that is running on Fargate resources in a private subnet to send outbound traffic to the internet (for example, to pull container images), the private subnet requires a NAT gateway be attached to route requests to the internet. For more information, see Amazon ECS task networking. The default value is "DISABLED".
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
     * The node index for the node. Node index numbering begins at zero. This index is also available on the node with the AWS_BATCH_JOB_NODE_INDEX environment variable.
     */
    nodeIndex?: Integer;
    /**
     * Specifies whether the current node is the main node for a multi-node parallel job.
     */
    isMainNode?: Boolean;
  }
  export interface NodeOverrides {
    /**
     * The number of nodes to use with a multi-node parallel job. This value overrides the number of nodes that are specified in the job definition. To use this override:   There must be at least one node range in your job definition that has an open upper boundary (such as : or n:).   The lower boundary of the node range specified in the job definition must be fewer than the number of nodes specified in the override.   The main node index specified in the job definition must be fewer than the number of nodes specified in the override.  
     */
    numNodes?: Integer;
    /**
     * The node property overrides for the job.
     */
    nodePropertyOverrides?: NodePropertyOverrides;
  }
  export interface NodeProperties {
    /**
     * The number of nodes associated with a multi-node parallel job.
     */
    numNodes: Integer;
    /**
     * Specifies the node index for the main node of a multi-node parallel job. This node index value must be fewer than the number of nodes.
     */
    mainNode: Integer;
    /**
     * A list of node ranges and their properties associated with a multi-node parallel job.
     */
    nodeRangeProperties: NodeRangeProperties;
  }
  export interface NodePropertiesSummary {
    /**
     * Specifies whether the current node is the main node for a multi-node parallel job.
     */
    isMainNode?: Boolean;
    /**
     * The number of nodes associated with a multi-node parallel job.
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
     * The overrides that should be sent to a node range.
     */
    containerOverrides?: ContainerOverrides;
  }
  export type NodePropertyOverrides = NodePropertyOverride[];
  export type NodeRangeProperties = NodeRangeProperty[];
  export interface NodeRangeProperty {
    /**
     * The range of nodes, using node index values. A range of 0:3 indicates nodes with index values of 0 through 3. If the starting range value is omitted (:n), then 0 is used to start the range. If the ending range value is omitted (n:), then the highest possible node index is used to end the range. Your accumulative node ranges must account for all nodes (0:n). You can nest node ranges, for example 0:10 and 4:5, in which case the 4:5 range properties override the 0:10 properties.
     */
    targetNodes: String;
    /**
     * The container details for the node range.
     */
    container?: ContainerProperties;
  }
  export type ParametersMap = {[key: string]: String};
  export type PlatformCapability = "EC2"|"FARGATE"|string;
  export type PlatformCapabilityList = PlatformCapability[];
  export interface RegisterJobDefinitionRequest {
    /**
     * The name of the job definition to register. Up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
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
     * An object with various properties specific to single-node container-based jobs. If the job definition's type parameter is container, then you must specify either containerProperties or nodeProperties.  If the job runs on Fargate resources, then you must not specify nodeProperties; use only containerProperties. 
     */
    containerProperties?: ContainerProperties;
    /**
     * An object with various properties specific to multi-node parallel jobs. If you specify node properties for a job, it becomes a multi-node parallel job. For more information, see Multi-node Parallel Jobs in the Batch User Guide. If the job definition's type parameter is container, then you must specify either containerProperties or nodeProperties.  If the job runs on Fargate resources, then you must not specify nodeProperties; use containerProperties instead. 
     */
    nodeProperties?: NodeProperties;
    /**
     * The retry strategy to use for failed jobs that are submitted with this job definition. Any retry strategy that's specified during a SubmitJob operation overrides the retry strategy defined here. If a job is terminated due to a timeout, it isn't retried.
     */
    retryStrategy?: RetryStrategy;
    /**
     * Specifies whether to propagate the tags from the job or job definition to the corresponding Amazon ECS task. If no value is specified, the tags are not propagated. Tags can only be propagated to the tasks during task creation. For tags with the same name, job tags are given priority over job definitions tags. If the total number of combined tags from the job and job definition is over 50, the job is moved to the FAILED state.
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
     * The platform capabilities required by the job definition. If no value is specified, it defaults to EC2. To run the job on Fargate resources, specify FARGATE.
     */
    platformCapabilities?: PlatformCapabilityList;
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
     * The quantity of the specified resource to reserve for the container. The values vary based on the type specified.  type="GPU"  The number of physical GPUs to reserve for the container. The number of GPUs reserved for all containers in a job shouldn't exceed the number of available GPUs on the compute resource that the job is launched on.  GPUs are not available for jobs that are running on Fargate resources.   type="MEMORY"  The memory hard limit (in MiB) present to the container. This parameter is supported for jobs that are running on EC2 resources. If your container attempts to exceed the memory specified, the container is terminated. This parameter maps to Memory in the Create a container section of the Docker Remote API and the --memory option to docker run. You must specify at least 4 MiB of memory for a job. This is required but can be specified in several places for multi-node parallel (MNP) jobs. It must be specified for each node at least once. This parameter maps to Memory in the Create a container section of the Docker Remote API and the --memory option to docker run.  If you're trying to maximize your resource utilization by providing your jobs as much memory as possible for a particular instance type, see Memory Management in the Batch User Guide.  For jobs that are running on Fargate resources, then value is the hard limit (in MiB), and must match one of the supported values and the VCPU values must be one of the values supported for that memory value.  value = 512   VCPU = 0.25  value = 1024   VCPU = 0.25 or 0.5  value = 2048   VCPU = 0.25, 0.5, or 1  value = 3072   VCPU = 0.5, or 1  value = 4096   VCPU = 0.5, 1, or 2  value = 5120, 6144, or 7168   VCPU = 1 or 2  value = 8192   VCPU = 1, 2, or 4  value = 9216, 10240, 11264, 12288, 13312, 14336, 15360, or 16384   VCPU = 2 or 4  value = 17408, 18432, 19456, 20480, 21504, 22528, 23552, 24576, 25600, 26624, 27648, 28672, 29696, or 30720   VCPU = 4    type="VCPU"  The number of vCPUs reserved for the container. This parameter maps to CpuShares in the Create a container section of the Docker Remote API and the --cpu-shares option to docker run. Each vCPU is equivalent to 1,024 CPU shares. For EC2 resources, you must specify at least one vCPU. This is required but can be specified in several places; it must be specified for each node at least once. For jobs that are running on Fargate resources, then value must match one of the supported values and the MEMORY values must be one of the values supported for that VCPU value. The supported values are 0.25, 0.5, 1, 2, and 4  value = 0.25   MEMORY = 512, 1024, or 2048  value = 0.5   MEMORY = 1024, 2048, 3072, or 4096  value = 1   MEMORY = 2048, 3072, 4096, 5120, 6144, 7168, or 8192  value = 2   MEMORY = 4096, 5120, 6144, 7168, 8192, 9216, 10240, 11264, 12288, 13312, 14336, 15360, or 16384  value = 4   MEMORY = 8192, 9216, 10240, 11264, 12288, 13312, 14336, 15360, 16384, 17408, 18432, 19456, 20480, 21504, 22528, 23552, 24576, 25600, 26624, 27648, 28672, 29696, or 30720    
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
     * Array of up to 5 objects that specify conditions under which the job should be retried or failed. If this parameter is specified, then the attempts parameter must also be specified.
     */
    evaluateOnExit?: EvaluateOnExitList;
  }
  export interface Secret {
    /**
     * The name of the secret.
     */
    name: String;
    /**
     * The secret to expose to the container. The supported values are either the full ARN of the Secrets Manager secret or the full ARN of the parameter in the Amazon Web Services Systems Manager Parameter Store.  If the Amazon Web Services Systems Manager Parameter Store parameter exists in the same Region as the job you're launching, then you can use either the full ARN or name of the parameter. If the parameter exists in a different Region, then the full ARN must be specified. 
     */
    valueFrom: String;
  }
  export type SecretList = Secret[];
  export type String = string;
  export type StringList = String[];
  export interface SubmitJobRequest {
    /**
     * The name of the job. The first character must be alphanumeric, and up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
     */
    jobName: String;
    /**
     * The job queue where the job is submitted. You can specify either the name or the Amazon Resource Name (ARN) of the queue.
     */
    jobQueue: String;
    /**
     * The array properties for the submitted job, such as the size of the array. The array size can be between 2 and 10,000. If you specify array properties for a job, it becomes an array job. For more information, see Array Jobs in the Batch User Guide.
     */
    arrayProperties?: ArrayProperties;
    /**
     * A list of dependencies for the job. A job can depend upon a maximum of 20 jobs. You can specify a SEQUENTIAL type dependency without specifying a job ID for array jobs so that each child array job completes sequentially, starting at index 0. You can also specify an N_TO_N type dependency with a job ID for array jobs. In that case, each index child of this job must wait for the corresponding index child of each dependency to complete before it can begin.
     */
    dependsOn?: JobDependencyList;
    /**
     * The job definition used by this job. This value can be one of name, name:revision, or the Amazon Resource Name (ARN) for the job definition. If name is specified without a revision then the latest active revision is used.
     */
    jobDefinition: String;
    /**
     * Additional parameters passed to the job that replace parameter substitution placeholders that are set in the job definition. Parameters are specified as a key and value pair mapping. Parameters in a SubmitJob request override any corresponding parameter defaults from the job definition.
     */
    parameters?: ParametersMap;
    /**
     * A list of container overrides in the JSON format that specify the name of a container in the specified job definition and the overrides it should receive. You can override the default command for a container, which is specified in the job definition or the Docker image, with a command override. You can also override existing environment variables on a container or add new environment variables to it with an environment override.
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
     * The Amazon Resource Name (ARN) of the resource that tags are added to. Batch resources that support tags are compute environments, jobs, job definitions, and job queues. ARNs for child jobs of array and multi-node parallel (MNP) jobs are not supported.
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
     * The Amazon Resource Name (ARN) of the resource from which to delete tags. Batch resources that support tags are compute environments, jobs, job definitions, and job queues. ARNs for child jobs of array and multi-node parallel (MNP) jobs are not supported.
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
     * The state of the compute environment. Compute environments in the ENABLED state can accept jobs from a queue and scale in or out automatically based on the workload demand of its associated queues. If the state is ENABLED, then the Batch scheduler can attempt to place jobs from an associated job queue on the compute resources within the environment. If the compute environment is managed, then it can scale its instances out or in automatically, based on the job queue demand. If the state is DISABLED, then the Batch scheduler doesn't attempt to place jobs within the environment. Jobs in a STARTING or RUNNING state continue to progress normally. Managed compute environments in the DISABLED state don't scale out. However, they scale in to minvCpus value after instances become idle.
     */
    state?: CEState;
    /**
     * Details of the compute resources managed by the compute environment. Required for a managed compute environment. For more information, see Compute Environments in the Batch User Guide.
     */
    computeResources?: ComputeResourceUpdate;
    /**
     * The full Amazon Resource Name (ARN) of the IAM role that allows Batch to make calls to other Amazon Web Services services on your behalf. For more information, see Batch service IAM role in the Batch User Guide.  If the compute environment has a service-linked role, it can't be changed to use a regular IAM role. Likewise, if the compute environment has a regular IAM role, it can't be changed to use a service-linked role.  If your specified role has a path other than /, then you must either specify the full role ARN (this is recommended) or prefix the role name with the path.  Depending on how you created your Batch service role, its ARN might contain the service-role path prefix. When you only specify the name of the service role, Batch assumes that your ARN doesn't use the service-role path prefix. Because of this, we recommend that you specify the full ARN of your service role when you create compute environments. 
     */
    serviceRole?: String;
  }
  export interface UpdateComputeEnvironmentResponse {
    /**
     * The name of the compute environment. Up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
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
     * The priority of the job queue. Job queues with a higher priority (or a higher integer value for the priority parameter) are evaluated first when associated with the same compute environment. Priority is determined in descending order, for example, a job queue with a priority value of 10 is given scheduling preference over a job queue with a priority value of 1. All of the compute environments must be either EC2 (EC2 or SPOT) or Fargate (FARGATE or FARGATE_SPOT). EC2 and Fargate compute environments can't be mixed.
     */
    priority?: Integer;
    /**
     * Details the set of compute environments mapped to a job queue and their order relative to each other. This is one of the parameters used by the job scheduler to determine which compute environment should run a given job. Compute environments must be in the VALID state before you can associate them with a job queue. All of the compute environments must be either EC2 (EC2 or SPOT) or Fargate (FARGATE or FARGATE_SPOT). EC2 and Fargate compute environments can't be mixed.  All compute environments that are associated with a job queue must share the same architecture. Batch doesn't support mixing compute environment architecture types in a single job queue. 
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
  export interface Volume {
    /**
     * The contents of the host parameter determine whether your data volume persists on the host container instance and where it is stored. If the host parameter is empty, then the Docker daemon assigns a host path for your data volume. However, the data isn't guaranteed to persist after the containers associated with it stop running.  This parameter isn't applicable to jobs that are running on Fargate resources and shouldn't be provided. 
     */
    host?: Host;
    /**
     * The name of the volume. Up to 255 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed. This name is referenced in the sourceVolume parameter of container definition mountPoints.
     */
    name?: String;
    /**
     * This parameter is specified when you are using an Amazon Elastic File System file system for job storage. Jobs that are running on Fargate resources must specify a platformVersion of at least 1.4.0.
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
