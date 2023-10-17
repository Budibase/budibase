import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Pipes extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Pipes.Types.ClientConfiguration)
  config: Config & Pipes.Types.ClientConfiguration;
  /**
   * Create a pipe. Amazon EventBridge Pipes connect event sources to targets and reduces the need for specialized knowledge and integration code.
   */
  createPipe(params: Pipes.Types.CreatePipeRequest, callback?: (err: AWSError, data: Pipes.Types.CreatePipeResponse) => void): Request<Pipes.Types.CreatePipeResponse, AWSError>;
  /**
   * Create a pipe. Amazon EventBridge Pipes connect event sources to targets and reduces the need for specialized knowledge and integration code.
   */
  createPipe(callback?: (err: AWSError, data: Pipes.Types.CreatePipeResponse) => void): Request<Pipes.Types.CreatePipeResponse, AWSError>;
  /**
   * Delete an existing pipe. For more information about pipes, see Amazon EventBridge Pipes in the Amazon EventBridge User Guide.
   */
  deletePipe(params: Pipes.Types.DeletePipeRequest, callback?: (err: AWSError, data: Pipes.Types.DeletePipeResponse) => void): Request<Pipes.Types.DeletePipeResponse, AWSError>;
  /**
   * Delete an existing pipe. For more information about pipes, see Amazon EventBridge Pipes in the Amazon EventBridge User Guide.
   */
  deletePipe(callback?: (err: AWSError, data: Pipes.Types.DeletePipeResponse) => void): Request<Pipes.Types.DeletePipeResponse, AWSError>;
  /**
   * Get the information about an existing pipe. For more information about pipes, see Amazon EventBridge Pipes in the Amazon EventBridge User Guide.
   */
  describePipe(params: Pipes.Types.DescribePipeRequest, callback?: (err: AWSError, data: Pipes.Types.DescribePipeResponse) => void): Request<Pipes.Types.DescribePipeResponse, AWSError>;
  /**
   * Get the information about an existing pipe. For more information about pipes, see Amazon EventBridge Pipes in the Amazon EventBridge User Guide.
   */
  describePipe(callback?: (err: AWSError, data: Pipes.Types.DescribePipeResponse) => void): Request<Pipes.Types.DescribePipeResponse, AWSError>;
  /**
   * Get the pipes associated with this account. For more information about pipes, see Amazon EventBridge Pipes in the Amazon EventBridge User Guide.
   */
  listPipes(params: Pipes.Types.ListPipesRequest, callback?: (err: AWSError, data: Pipes.Types.ListPipesResponse) => void): Request<Pipes.Types.ListPipesResponse, AWSError>;
  /**
   * Get the pipes associated with this account. For more information about pipes, see Amazon EventBridge Pipes in the Amazon EventBridge User Guide.
   */
  listPipes(callback?: (err: AWSError, data: Pipes.Types.ListPipesResponse) => void): Request<Pipes.Types.ListPipesResponse, AWSError>;
  /**
   * Displays the tags associated with a pipe.
   */
  listTagsForResource(params: Pipes.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Pipes.Types.ListTagsForResourceResponse) => void): Request<Pipes.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Displays the tags associated with a pipe.
   */
  listTagsForResource(callback?: (err: AWSError, data: Pipes.Types.ListTagsForResourceResponse) => void): Request<Pipes.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Start an existing pipe.
   */
  startPipe(params: Pipes.Types.StartPipeRequest, callback?: (err: AWSError, data: Pipes.Types.StartPipeResponse) => void): Request<Pipes.Types.StartPipeResponse, AWSError>;
  /**
   * Start an existing pipe.
   */
  startPipe(callback?: (err: AWSError, data: Pipes.Types.StartPipeResponse) => void): Request<Pipes.Types.StartPipeResponse, AWSError>;
  /**
   * Stop an existing pipe.
   */
  stopPipe(params: Pipes.Types.StopPipeRequest, callback?: (err: AWSError, data: Pipes.Types.StopPipeResponse) => void): Request<Pipes.Types.StopPipeResponse, AWSError>;
  /**
   * Stop an existing pipe.
   */
  stopPipe(callback?: (err: AWSError, data: Pipes.Types.StopPipeResponse) => void): Request<Pipes.Types.StopPipeResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified pipe. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can use the TagResource action with a pipe that already has tags. If you specify a new tag key, this tag is appended to the list of tags associated with the pipe. If you specify a tag key that is already associated with the pipe, the new tag value that you specify replaces the previous value for that tag. You can associate as many as 50 tags with a pipe.
   */
  tagResource(params: Pipes.Types.TagResourceRequest, callback?: (err: AWSError, data: Pipes.Types.TagResourceResponse) => void): Request<Pipes.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified pipe. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can use the TagResource action with a pipe that already has tags. If you specify a new tag key, this tag is appended to the list of tags associated with the pipe. If you specify a tag key that is already associated with the pipe, the new tag value that you specify replaces the previous value for that tag. You can associate as many as 50 tags with a pipe.
   */
  tagResource(callback?: (err: AWSError, data: Pipes.Types.TagResourceResponse) => void): Request<Pipes.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified pipes.
   */
  untagResource(params: Pipes.Types.UntagResourceRequest, callback?: (err: AWSError, data: Pipes.Types.UntagResourceResponse) => void): Request<Pipes.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified pipes.
   */
  untagResource(callback?: (err: AWSError, data: Pipes.Types.UntagResourceResponse) => void): Request<Pipes.Types.UntagResourceResponse, AWSError>;
  /**
   * Update an existing pipe. When you call UpdatePipe, only the fields that are included in the request are changed, the rest are unchanged. The exception to this is if you modify any Amazon Web Services-service specific fields in the SourceParameters, EnrichmentParameters, or TargetParameters objects. The fields in these objects are updated atomically as one and override existing values. This is by design and means that if you don't specify an optional field in one of these Parameters objects, that field will be set to its system-default value after the update. For more information about pipes, see  Amazon EventBridge Pipes in the Amazon EventBridge User Guide.
   */
  updatePipe(params: Pipes.Types.UpdatePipeRequest, callback?: (err: AWSError, data: Pipes.Types.UpdatePipeResponse) => void): Request<Pipes.Types.UpdatePipeResponse, AWSError>;
  /**
   * Update an existing pipe. When you call UpdatePipe, only the fields that are included in the request are changed, the rest are unchanged. The exception to this is if you modify any Amazon Web Services-service specific fields in the SourceParameters, EnrichmentParameters, or TargetParameters objects. The fields in these objects are updated atomically as one and override existing values. This is by design and means that if you don't specify an optional field in one of these Parameters objects, that field will be set to its system-default value after the update. For more information about pipes, see  Amazon EventBridge Pipes in the Amazon EventBridge User Guide.
   */
  updatePipe(callback?: (err: AWSError, data: Pipes.Types.UpdatePipeResponse) => void): Request<Pipes.Types.UpdatePipeResponse, AWSError>;
}
declare namespace Pipes {
  export type Arn = string;
  export type ArnOrJsonPath = string;
  export type ArnOrUrl = string;
  export type AssignPublicIp = "ENABLED"|"DISABLED"|string;
  export interface AwsVpcConfiguration {
    /**
     * Specifies whether the task's elastic network interface receives a public IP address. You can specify ENABLED only when LaunchType in EcsParameters is set to FARGATE.
     */
    AssignPublicIp?: AssignPublicIp;
    /**
     * Specifies the security groups associated with the task. These security groups must all be in the same VPC. You can specify as many as five security groups. If you do not specify a security group, the default security group for the VPC is used.
     */
    SecurityGroups?: SecurityGroups;
    /**
     * Specifies the subnets associated with the task. These subnets must all be in the same VPC. You can specify as many as 16 subnets.
     */
    Subnets: Subnets;
  }
  export interface BatchArrayProperties {
    /**
     * The size of the array, if this is an array batch job.
     */
    Size?: BatchArraySize;
  }
  export type BatchArraySize = number;
  export interface BatchContainerOverrides {
    /**
     * The command to send to the container that overrides the default command from the Docker image or the task definition.
     */
    Command?: StringList;
    /**
     * The environment variables to send to the container. You can add new environment variables, which are added to the container at launch, or you can override the existing environment variables from the Docker image or the task definition.  Environment variables cannot start with "Batch". This naming convention is reserved for variables that Batch sets. 
     */
    Environment?: BatchEnvironmentVariableList;
    /**
     * The instance type to use for a multi-node parallel job.  This parameter isn't applicable to single-node container jobs or jobs that run on Fargate resources, and shouldn't be provided. 
     */
    InstanceType?: String;
    /**
     * The type and amount of resources to assign to a container. This overrides the settings in the job definition. The supported resources include GPU, MEMORY, and VCPU.
     */
    ResourceRequirements?: BatchResourceRequirementsList;
  }
  export type BatchDependsOn = BatchJobDependency[];
  export interface BatchEnvironmentVariable {
    /**
     * The name of the key-value pair. For environment variables, this is the name of the environment variable.
     */
    Name?: String;
    /**
     * The value of the key-value pair. For environment variables, this is the value of the environment variable.
     */
    Value?: String;
  }
  export type BatchEnvironmentVariableList = BatchEnvironmentVariable[];
  export interface BatchJobDependency {
    /**
     * The job ID of the Batch job that's associated with this dependency.
     */
    JobId?: String;
    /**
     * The type of the job dependency.
     */
    Type?: BatchJobDependencyType;
  }
  export type BatchJobDependencyType = "N_TO_N"|"SEQUENTIAL"|string;
  export type BatchParametersMap = {[key: string]: String};
  export interface BatchResourceRequirement {
    /**
     * The type of resource to assign to a container. The supported resources include GPU, MEMORY, and VCPU.
     */
    Type: BatchResourceRequirementType;
    /**
     * The quantity of the specified resource to reserve for the container. The values vary based on the type specified.  type="GPU"  The number of physical GPUs to reserve for the container. Make sure that the number of GPUs reserved for all containers in a job doesn't exceed the number of available GPUs on the compute resource that the job is launched on.  GPUs aren't available for jobs that are running on Fargate resources.   type="MEMORY"  The memory hard limit (in MiB) present to the container. This parameter is supported for jobs that are running on EC2 resources. If your container attempts to exceed the memory specified, the container is terminated. This parameter maps to Memory in the  Create a container section of the Docker Remote API and the --memory option to docker run. You must specify at least 4 MiB of memory for a job. This is required but can be specified in several places for multi-node parallel (MNP) jobs. It must be specified for each node at least once. This parameter maps to Memory in the  Create a container section of the Docker Remote API and the --memory option to docker run.  If you're trying to maximize your resource utilization by providing your jobs as much memory as possible for a particular instance type, see Memory management in the Batch User Guide.  For jobs that are running on Fargate resources, then value is the hard limit (in MiB), and must match one of the supported values and the VCPU values must be one of the values supported for that memory value.  value = 512   VCPU = 0.25  value = 1024   VCPU = 0.25 or 0.5  value = 2048   VCPU = 0.25, 0.5, or 1  value = 3072   VCPU = 0.5, or 1  value = 4096   VCPU = 0.5, 1, or 2  value = 5120, 6144, or 7168   VCPU = 1 or 2  value = 8192   VCPU = 1, 2, 4, or 8  value = 9216, 10240, 11264, 12288, 13312, 14336, or 15360   VCPU = 2 or 4  value = 16384   VCPU = 2, 4, or 8  value = 17408, 18432, 19456, 21504, 22528, 23552, 25600, 26624, 27648, 29696, or 30720   VCPU = 4  value = 20480, 24576, or 28672   VCPU = 4 or 8  value = 36864, 45056, 53248, or 61440   VCPU = 8  value = 32768, 40960, 49152, or 57344   VCPU = 8 or 16  value = 65536, 73728, 81920, 90112, 98304, 106496, 114688, or 122880   VCPU = 16    type="VCPU"  The number of vCPUs reserved for the container. This parameter maps to CpuShares in the  Create a container section of the Docker Remote API and the --cpu-shares option to docker run. Each vCPU is equivalent to 1,024 CPU shares. For EC2 resources, you must specify at least one vCPU. This is required but can be specified in several places; it must be specified for each node at least once. The default for the Fargate On-Demand vCPU resource count quota is 6 vCPUs. For more information about Fargate quotas, see Fargate quotas in the Amazon Web Services General Reference. For jobs that are running on Fargate resources, then value must match one of the supported values and the MEMORY values must be one of the values supported for that VCPU value. The supported values are 0.25, 0.5, 1, 2, 4, 8, and 16  value = 0.25   MEMORY = 512, 1024, or 2048  value = 0.5   MEMORY = 1024, 2048, 3072, or 4096  value = 1   MEMORY = 2048, 3072, 4096, 5120, 6144, 7168, or 8192  value = 2   MEMORY = 4096, 5120, 6144, 7168, 8192, 9216, 10240, 11264, 12288, 13312, 14336, 15360, or 16384  value = 4   MEMORY = 8192, 9216, 10240, 11264, 12288, 13312, 14336, 15360, 16384, 17408, 18432, 19456, 20480, 21504, 22528, 23552, 24576, 25600, 26624, 27648, 28672, 29696, or 30720  value = 8   MEMORY = 16384, 20480, 24576, 28672, 32768, 36864, 40960, 45056, 49152, 53248, 57344, or 61440   value = 16   MEMORY = 32768, 40960, 49152, 57344, 65536, 73728, 81920, 90112, 98304, 106496, 114688, or 122880     
     */
    Value: String;
  }
  export type BatchResourceRequirementType = "GPU"|"MEMORY"|"VCPU"|string;
  export type BatchResourceRequirementsList = BatchResourceRequirement[];
  export type BatchRetryAttempts = number;
  export interface BatchRetryStrategy {
    /**
     * The number of times to move a job to the RUNNABLE status. If the value of attempts is greater than one, the job is retried on failure the same number of attempts as the value.
     */
    Attempts?: BatchRetryAttempts;
  }
  export type Boolean = boolean;
  export type CapacityProvider = string;
  export type CapacityProviderStrategy = CapacityProviderStrategyItem[];
  export interface CapacityProviderStrategyItem {
    /**
     * The base value designates how many tasks, at a minimum, to run on the specified capacity provider. Only one capacity provider in a capacity provider strategy can have a base defined. If no value is specified, the default value of 0 is used. 
     */
    base?: CapacityProviderStrategyItemBase;
    /**
     * The short name of the capacity provider.
     */
    capacityProvider: CapacityProvider;
    /**
     * The weight value designates the relative percentage of the total number of tasks launched that should use the specified capacity provider. The weight value is taken into consideration after the base value, if defined, is satisfied.
     */
    weight?: CapacityProviderStrategyItemWeight;
  }
  export type CapacityProviderStrategyItemBase = number;
  export type CapacityProviderStrategyItemWeight = number;
  export interface CreatePipeRequest {
    /**
     * A description of the pipe.
     */
    Description?: PipeDescription;
    /**
     * The state the pipe should be in.
     */
    DesiredState?: RequestedPipeState;
    /**
     * The ARN of the enrichment resource.
     */
    Enrichment?: OptionalArn;
    /**
     * The parameters required to set up enrichment on your pipe.
     */
    EnrichmentParameters?: PipeEnrichmentParameters;
    /**
     * The name of the pipe.
     */
    Name: PipeName;
    /**
     * The ARN of the role that allows the pipe to send data to the target.
     */
    RoleArn: RoleArn;
    /**
     * The ARN of the source resource.
     */
    Source: ArnOrUrl;
    /**
     * The parameters required to set up a source for your pipe.
     */
    SourceParameters?: PipeSourceParameters;
    /**
     * The list of key-value pairs to associate with the pipe.
     */
    Tags?: TagMap;
    /**
     * The ARN of the target resource.
     */
    Target: Arn;
    /**
     * The parameters required to set up a target for your pipe.
     */
    TargetParameters?: PipeTargetParameters;
  }
  export interface CreatePipeResponse {
    /**
     * The ARN of the pipe.
     */
    Arn?: PipeArn;
    /**
     * The time the pipe was created.
     */
    CreationTime?: Timestamp;
    /**
     * The state the pipe is in.
     */
    CurrentState?: PipeState;
    /**
     * The state the pipe should be in.
     */
    DesiredState?: RequestedPipeState;
    /**
     * When the pipe was last updated, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    LastModifiedTime?: Timestamp;
    /**
     * The name of the pipe.
     */
    Name?: PipeName;
  }
  export type Database = string;
  export type DbUser = string;
  export interface DeadLetterConfig {
    /**
     * The ARN of the Amazon SQS queue specified as the target for the dead-letter queue.
     */
    Arn?: Arn;
  }
  export interface DeletePipeRequest {
    /**
     * The name of the pipe.
     */
    Name: PipeName;
  }
  export interface DeletePipeResponse {
    /**
     * The ARN of the pipe.
     */
    Arn?: PipeArn;
    /**
     * The time the pipe was created.
     */
    CreationTime?: Timestamp;
    /**
     * The state the pipe is in.
     */
    CurrentState?: PipeState;
    /**
     * The state the pipe should be in.
     */
    DesiredState?: RequestedPipeStateDescribeResponse;
    /**
     * When the pipe was last updated, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    LastModifiedTime?: Timestamp;
    /**
     * The name of the pipe.
     */
    Name?: PipeName;
  }
  export interface DescribePipeRequest {
    /**
     * The name of the pipe.
     */
    Name: PipeName;
  }
  export interface DescribePipeResponse {
    /**
     * The ARN of the pipe.
     */
    Arn?: PipeArn;
    /**
     * The time the pipe was created.
     */
    CreationTime?: Timestamp;
    /**
     * The state the pipe is in.
     */
    CurrentState?: PipeState;
    /**
     * A description of the pipe.
     */
    Description?: PipeDescription;
    /**
     * The state the pipe should be in.
     */
    DesiredState?: RequestedPipeStateDescribeResponse;
    /**
     * The ARN of the enrichment resource.
     */
    Enrichment?: OptionalArn;
    /**
     * The parameters required to set up enrichment on your pipe.
     */
    EnrichmentParameters?: PipeEnrichmentParameters;
    /**
     * When the pipe was last updated, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    LastModifiedTime?: Timestamp;
    /**
     * The name of the pipe.
     */
    Name?: PipeName;
    /**
     * The ARN of the role that allows the pipe to send data to the target.
     */
    RoleArn?: RoleArn;
    /**
     * The ARN of the source resource.
     */
    Source?: ArnOrUrl;
    /**
     * The parameters required to set up a source for your pipe.
     */
    SourceParameters?: PipeSourceParameters;
    /**
     * The reason the pipe is in its current state.
     */
    StateReason?: PipeStateReason;
    /**
     * The list of key-value pairs to associate with the pipe.
     */
    Tags?: TagMap;
    /**
     * The ARN of the target resource.
     */
    Target?: Arn;
    /**
     * The parameters required to set up a target for your pipe.
     */
    TargetParameters?: PipeTargetParameters;
  }
  export type DynamoDBStreamStartPosition = "TRIM_HORIZON"|"LATEST"|string;
  export interface EcsContainerOverride {
    /**
     * The command to send to the container that overrides the default command from the Docker image or the task definition. You must also specify a container name.
     */
    Command?: StringList;
    /**
     * The number of cpu units reserved for the container, instead of the default value from the task definition. You must also specify a container name.
     */
    Cpu?: Integer;
    /**
     * The environment variables to send to the container. You can add new environment variables, which are added to the container at launch, or you can override the existing environment variables from the Docker image or the task definition. You must also specify a container name.
     */
    Environment?: EcsEnvironmentVariableList;
    /**
     * A list of files containing the environment variables to pass to a container, instead of the value from the container definition.
     */
    EnvironmentFiles?: EcsEnvironmentFileList;
    /**
     * The hard limit (in MiB) of memory to present to the container, instead of the default value from the task definition. If your container attempts to exceed the memory specified here, the container is killed. You must also specify a container name.
     */
    Memory?: Integer;
    /**
     * The soft limit (in MiB) of memory to reserve for the container, instead of the default value from the task definition. You must also specify a container name.
     */
    MemoryReservation?: Integer;
    /**
     * The name of the container that receives the override. This parameter is required if any override is specified.
     */
    Name?: String;
    /**
     * The type and amount of a resource to assign to a container, instead of the default value from the task definition. The only supported resource is a GPU.
     */
    ResourceRequirements?: EcsResourceRequirementsList;
  }
  export type EcsContainerOverrideList = EcsContainerOverride[];
  export interface EcsEnvironmentFile {
    /**
     * The file type to use. The only supported value is s3.
     */
    type: EcsEnvironmentFileType;
    /**
     * The Amazon Resource Name (ARN) of the Amazon S3 object containing the environment variable file.
     */
    value: String;
  }
  export type EcsEnvironmentFileList = EcsEnvironmentFile[];
  export type EcsEnvironmentFileType = "s3"|string;
  export interface EcsEnvironmentVariable {
    /**
     * The name of the key-value pair. For environment variables, this is the name of the environment variable.
     */
    name?: String;
    /**
     * The value of the key-value pair. For environment variables, this is the value of the environment variable.
     */
    value?: String;
  }
  export type EcsEnvironmentVariableList = EcsEnvironmentVariable[];
  export interface EcsEphemeralStorage {
    /**
     * The total amount, in GiB, of ephemeral storage to set for the task. The minimum supported value is 21 GiB and the maximum supported value is 200 GiB.
     */
    sizeInGiB: EphemeralStorageSize;
  }
  export interface EcsInferenceAcceleratorOverride {
    /**
     * The Elastic Inference accelerator device name to override for the task. This parameter must match a deviceName specified in the task definition.
     */
    deviceName?: String;
    /**
     * The Elastic Inference accelerator type to use.
     */
    deviceType?: String;
  }
  export type EcsInferenceAcceleratorOverrideList = EcsInferenceAcceleratorOverride[];
  export interface EcsResourceRequirement {
    /**
     * The type of resource to assign to a container. The supported values are GPU or InferenceAccelerator.
     */
    type: EcsResourceRequirementType;
    /**
     * The value for the specified resource type. If the GPU type is used, the value is the number of physical GPUs the Amazon ECS container agent reserves for the container. The number of GPUs that's reserved for all containers in a task can't exceed the number of available GPUs on the container instance that the task is launched on. If the InferenceAccelerator type is used, the value matches the deviceName for an InferenceAccelerator specified in a task definition.
     */
    value: String;
  }
  export type EcsResourceRequirementType = "GPU"|"InferenceAccelerator"|string;
  export type EcsResourceRequirementsList = EcsResourceRequirement[];
  export interface EcsTaskOverride {
    /**
     * One or more container overrides that are sent to a task.
     */
    ContainerOverrides?: EcsContainerOverrideList;
    /**
     * The cpu override for the task.
     */
    Cpu?: String;
    /**
     * The ephemeral storage setting override for the task.  This parameter is only supported for tasks hosted on Fargate that use the following platform versions:   Linux platform version 1.4.0 or later.   Windows platform version 1.0.0 or later.   
     */
    EphemeralStorage?: EcsEphemeralStorage;
    /**
     * The Amazon Resource Name (ARN) of the task execution IAM role override for the task. For more information, see Amazon ECS task execution IAM role in the Amazon Elastic Container Service Developer Guide.
     */
    ExecutionRoleArn?: ArnOrJsonPath;
    /**
     * The Elastic Inference accelerator override for the task.
     */
    InferenceAcceleratorOverrides?: EcsInferenceAcceleratorOverrideList;
    /**
     * The memory override for the task.
     */
    Memory?: String;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that containers in this task can assume. All containers in this task are granted the permissions that are specified in this role. For more information, see IAM Role for Tasks in the Amazon Elastic Container Service Developer Guide.
     */
    TaskRoleArn?: ArnOrJsonPath;
  }
  export type EndpointString = string;
  export type EphemeralStorageSize = number;
  export type EventBridgeDetailType = string;
  export type EventBridgeEndpointId = string;
  export type EventBridgeEventResourceList = ArnOrJsonPath[];
  export type EventBridgeEventSource = string;
  export type EventPattern = string;
  export interface Filter {
    /**
     * The event pattern.
     */
    Pattern?: EventPattern;
  }
  export interface FilterCriteria {
    /**
     * The event patterns.
     */
    Filters?: FilterList;
  }
  export type FilterList = Filter[];
  export type HeaderKey = string;
  export type HeaderParametersMap = {[key: string]: HeaderValue};
  export type HeaderValue = string;
  export type InputTemplate = string;
  export type Integer = number;
  export type JsonPath = string;
  export type KafkaBootstrapServers = EndpointString[];
  export type KafkaTopicName = string;
  export type KinesisPartitionKey = string;
  export type KinesisStreamStartPosition = "TRIM_HORIZON"|"LATEST"|"AT_TIMESTAMP"|string;
  export type LaunchType = "EC2"|"FARGATE"|"EXTERNAL"|string;
  export type LimitMax10 = number;
  export type LimitMax100 = number;
  export type LimitMax10000 = number;
  export type LimitMin1 = number;
  export interface ListPipesRequest {
    /**
     * The state the pipe is in.
     */
    CurrentState?: PipeState;
    /**
     * The state the pipe should be in.
     */
    DesiredState?: RequestedPipeState;
    /**
     * The maximum number of pipes to include in the response.
     */
    Limit?: LimitMax100;
    /**
     * A value that will return a subset of the pipes associated with this account. For example, "NamePrefix": "ABC" will return all endpoints with "ABC" in the name.
     */
    NamePrefix?: PipeName;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    NextToken?: NextToken;
    /**
     * The prefix matching the pipe source.
     */
    SourcePrefix?: ResourceArn;
    /**
     * The prefix matching the pipe target.
     */
    TargetPrefix?: ResourceArn;
  }
  export interface ListPipesResponse {
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    NextToken?: NextToken;
    /**
     * The pipes returned by the call.
     */
    Pipes?: PipeList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the pipe for which you want to view tags.
     */
    resourceArn: PipeArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The list of key-value pairs to associate with the pipe.
     */
    tags?: TagMap;
  }
  export type LogStreamName = string;
  export interface MQBrokerAccessCredentials {
    /**
     * The ARN of the Secrets Manager secret.
     */
    BasicAuth?: SecretManagerArn;
  }
  export type MQBrokerQueueName = string;
  export interface MSKAccessCredentials {
    /**
     * The ARN of the Secrets Manager secret.
     */
    ClientCertificateTlsAuth?: SecretManagerArn;
    /**
     * The ARN of the Secrets Manager secret.
     */
    SaslScram512Auth?: SecretManagerArn;
  }
  export type MSKStartPosition = "TRIM_HORIZON"|"LATEST"|string;
  export type MaximumBatchingWindowInSeconds = number;
  export type MaximumRecordAgeInSeconds = number;
  export type MaximumRetryAttemptsESM = number;
  export type MessageDeduplicationId = string;
  export type MessageGroupId = string;
  export interface NetworkConfiguration {
    /**
     * Use this structure to specify the VPC subnets and security groups for the task, and whether a public IP address is to be used. This structure is relevant only for ECS tasks that use the awsvpc network mode.
     */
    awsvpcConfiguration?: AwsVpcConfiguration;
  }
  export type NextToken = string;
  export type OnPartialBatchItemFailureStreams = "AUTOMATIC_BISECT"|string;
  export type OptionalArn = string;
  export type PathParameter = string;
  export type PathParameterList = PathParameter[];
  export interface Pipe {
    /**
     * The ARN of the pipe.
     */
    Arn?: PipeArn;
    /**
     * The time the pipe was created.
     */
    CreationTime?: Timestamp;
    /**
     * The state the pipe is in.
     */
    CurrentState?: PipeState;
    /**
     * The state the pipe should be in.
     */
    DesiredState?: RequestedPipeState;
    /**
     * The ARN of the enrichment resource.
     */
    Enrichment?: OptionalArn;
    /**
     * When the pipe was last updated, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    LastModifiedTime?: Timestamp;
    /**
     * The name of the pipe.
     */
    Name?: PipeName;
    /**
     * The ARN of the source resource.
     */
    Source?: ArnOrUrl;
    /**
     * The reason the pipe is in its current state.
     */
    StateReason?: PipeStateReason;
    /**
     * The ARN of the target resource.
     */
    Target?: Arn;
  }
  export type PipeArn = string;
  export type PipeDescription = string;
  export interface PipeEnrichmentHttpParameters {
    /**
     * The headers that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
     */
    HeaderParameters?: HeaderParametersMap;
    /**
     * The path parameter values to be used to populate API Gateway REST API or EventBridge ApiDestination path wildcards ("*").
     */
    PathParameterValues?: PathParameterList;
    /**
     * The query string keys/values that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
     */
    QueryStringParameters?: QueryStringParametersMap;
  }
  export interface PipeEnrichmentParameters {
    /**
     * Contains the HTTP parameters to use when the target is a API Gateway REST endpoint or EventBridge ApiDestination. If you specify an API Gateway REST API or EventBridge ApiDestination as a target, you can use this parameter to specify headers, path parameters, and query string keys/values as part of your target invoking request. If you're using ApiDestinations, the corresponding Connection can also have these values configured. In case of any conflicting keys, values from the Connection take precedence.
     */
    HttpParameters?: PipeEnrichmentHttpParameters;
    /**
     * Valid JSON text passed to the enrichment. In this case, nothing from the event itself is passed to the enrichment. For more information, see The JavaScript Object Notation (JSON) Data Interchange Format.
     */
    InputTemplate?: InputTemplate;
  }
  export type PipeList = Pipe[];
  export type PipeName = string;
  export interface PipeSourceActiveMQBrokerParameters {
    /**
     * The maximum number of records to include in each batch.
     */
    BatchSize?: LimitMax10000;
    /**
     * The credentials needed to access the resource.
     */
    Credentials: MQBrokerAccessCredentials;
    /**
     * The maximum length of a time to wait for events.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
    /**
     * The name of the destination queue to consume.
     */
    QueueName: MQBrokerQueueName;
  }
  export interface PipeSourceDynamoDBStreamParameters {
    /**
     * The maximum number of records to include in each batch.
     */
    BatchSize?: LimitMax10000;
    /**
     * Define the target queue to send dead-letter queue events to.
     */
    DeadLetterConfig?: DeadLetterConfig;
    /**
     * The maximum length of a time to wait for events.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
    /**
     * (Streams only) Discard records older than the specified age. The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, EventBridge never discards old records. 
     */
    MaximumRecordAgeInSeconds?: MaximumRecordAgeInSeconds;
    /**
     * (Streams only) Discard records after the specified number of retries. The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, EventBridge retries failed records until the record expires in the event source.
     */
    MaximumRetryAttempts?: MaximumRetryAttemptsESM;
    /**
     * (Streams only) Define how to handle item process failures. AUTOMATIC_BISECT halves each batch and retry each half until all the records are processed or there is one failed message left in the batch.
     */
    OnPartialBatchItemFailure?: OnPartialBatchItemFailureStreams;
    /**
     * (Streams only) The number of batches to process concurrently from each shard. The default value is 1.
     */
    ParallelizationFactor?: LimitMax10;
    /**
     * (Streams only) The position in a stream from which to start reading.
     */
    StartingPosition: DynamoDBStreamStartPosition;
  }
  export interface PipeSourceKinesisStreamParameters {
    /**
     * The maximum number of records to include in each batch.
     */
    BatchSize?: LimitMax10000;
    /**
     * Define the target queue to send dead-letter queue events to.
     */
    DeadLetterConfig?: DeadLetterConfig;
    /**
     * The maximum length of a time to wait for events.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
    /**
     * (Streams only) Discard records older than the specified age. The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, EventBridge never discards old records. 
     */
    MaximumRecordAgeInSeconds?: MaximumRecordAgeInSeconds;
    /**
     * (Streams only) Discard records after the specified number of retries. The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, EventBridge retries failed records until the record expires in the event source.
     */
    MaximumRetryAttempts?: MaximumRetryAttemptsESM;
    /**
     * (Streams only) Define how to handle item process failures. AUTOMATIC_BISECT halves each batch and retry each half until all the records are processed or there is one failed message left in the batch.
     */
    OnPartialBatchItemFailure?: OnPartialBatchItemFailureStreams;
    /**
     * (Streams only) The number of batches to process concurrently from each shard. The default value is 1.
     */
    ParallelizationFactor?: LimitMax10;
    /**
     * (Streams only) The position in a stream from which to start reading.
     */
    StartingPosition: KinesisStreamStartPosition;
    /**
     * With StartingPosition set to AT_TIMESTAMP, the time from which to start reading, in Unix time seconds.
     */
    StartingPositionTimestamp?: Timestamp;
  }
  export interface PipeSourceManagedStreamingKafkaParameters {
    /**
     * The maximum number of records to include in each batch.
     */
    BatchSize?: LimitMax10000;
    /**
     * The name of the destination queue to consume.
     */
    ConsumerGroupID?: URI;
    /**
     * The credentials needed to access the resource.
     */
    Credentials?: MSKAccessCredentials;
    /**
     * The maximum length of a time to wait for events.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
    /**
     * (Streams only) The position in a stream from which to start reading.
     */
    StartingPosition?: MSKStartPosition;
    /**
     * The name of the topic that the pipe will read from.
     */
    TopicName: KafkaTopicName;
  }
  export interface PipeSourceParameters {
    /**
     * The parameters for using an Active MQ broker as a source.
     */
    ActiveMQBrokerParameters?: PipeSourceActiveMQBrokerParameters;
    /**
     * The parameters for using a DynamoDB stream as a source.
     */
    DynamoDBStreamParameters?: PipeSourceDynamoDBStreamParameters;
    /**
     * The collection of event patterns used to filter events. For more information, see Events and Event Patterns in the Amazon EventBridge User Guide.
     */
    FilterCriteria?: FilterCriteria;
    /**
     * The parameters for using a Kinesis stream as a source.
     */
    KinesisStreamParameters?: PipeSourceKinesisStreamParameters;
    /**
     * The parameters for using an MSK stream as a source.
     */
    ManagedStreamingKafkaParameters?: PipeSourceManagedStreamingKafkaParameters;
    /**
     * The parameters for using a Rabbit MQ broker as a source.
     */
    RabbitMQBrokerParameters?: PipeSourceRabbitMQBrokerParameters;
    /**
     * The parameters for using a self-managed Apache Kafka stream as a source.
     */
    SelfManagedKafkaParameters?: PipeSourceSelfManagedKafkaParameters;
    /**
     * The parameters for using a Amazon SQS stream as a source.
     */
    SqsQueueParameters?: PipeSourceSqsQueueParameters;
  }
  export interface PipeSourceRabbitMQBrokerParameters {
    /**
     * The maximum number of records to include in each batch.
     */
    BatchSize?: LimitMax10000;
    /**
     * The credentials needed to access the resource.
     */
    Credentials: MQBrokerAccessCredentials;
    /**
     * The maximum length of a time to wait for events.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
    /**
     * The name of the destination queue to consume.
     */
    QueueName: MQBrokerQueueName;
    /**
     * The name of the virtual host associated with the source broker.
     */
    VirtualHost?: URI;
  }
  export interface PipeSourceSelfManagedKafkaParameters {
    /**
     * An array of server URLs.
     */
    AdditionalBootstrapServers?: KafkaBootstrapServers;
    /**
     * The maximum number of records to include in each batch.
     */
    BatchSize?: LimitMax10000;
    /**
     * The name of the destination queue to consume.
     */
    ConsumerGroupID?: URI;
    /**
     * The credentials needed to access the resource.
     */
    Credentials?: SelfManagedKafkaAccessConfigurationCredentials;
    /**
     * The maximum length of a time to wait for events.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
    /**
     * The ARN of the Secrets Manager secret used for certification.
     */
    ServerRootCaCertificate?: SecretManagerArn;
    /**
     * (Streams only) The position in a stream from which to start reading.
     */
    StartingPosition?: SelfManagedKafkaStartPosition;
    /**
     * The name of the topic that the pipe will read from.
     */
    TopicName: KafkaTopicName;
    /**
     * This structure specifies the VPC subnets and security groups for the stream, and whether a public IP address is to be used.
     */
    Vpc?: SelfManagedKafkaAccessConfigurationVpc;
  }
  export interface PipeSourceSqsQueueParameters {
    /**
     * The maximum number of records to include in each batch.
     */
    BatchSize?: LimitMax10000;
    /**
     * The maximum length of a time to wait for events.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
  }
  export type PipeState = "RUNNING"|"STOPPED"|"CREATING"|"UPDATING"|"DELETING"|"STARTING"|"STOPPING"|"CREATE_FAILED"|"UPDATE_FAILED"|"START_FAILED"|"STOP_FAILED"|string;
  export type PipeStateReason = string;
  export interface PipeTargetBatchJobParameters {
    /**
     * The array properties for the submitted job, such as the size of the array. The array size can be between 2 and 10,000. If you specify array properties for a job, it becomes an array job. This parameter is used only if the target is an Batch job.
     */
    ArrayProperties?: BatchArrayProperties;
    /**
     * The overrides that are sent to a container.
     */
    ContainerOverrides?: BatchContainerOverrides;
    /**
     * A list of dependencies for the job. A job can depend upon a maximum of 20 jobs. You can specify a SEQUENTIAL type dependency without specifying a job ID for array jobs so that each child array job completes sequentially, starting at index 0. You can also specify an N_TO_N type dependency with a job ID for array jobs. In that case, each index child of this job must wait for the corresponding index child of each dependency to complete before it can begin.
     */
    DependsOn?: BatchDependsOn;
    /**
     * The job definition used by this job. This value can be one of name, name:revision, or the Amazon Resource Name (ARN) for the job definition. If name is specified without a revision then the latest active revision is used.
     */
    JobDefinition: String;
    /**
     * The name of the job. It can be up to 128 letters long. The first character must be alphanumeric, can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_).
     */
    JobName: String;
    /**
     * Additional parameters passed to the job that replace parameter substitution placeholders that are set in the job definition. Parameters are specified as a key and value pair mapping. Parameters included here override any corresponding parameter defaults from the job definition.
     */
    Parameters?: BatchParametersMap;
    /**
     * The retry strategy to use for failed jobs. When a retry strategy is specified here, it overrides the retry strategy defined in the job definition.
     */
    RetryStrategy?: BatchRetryStrategy;
  }
  export interface PipeTargetCloudWatchLogsParameters {
    /**
     * The name of the log stream.
     */
    LogStreamName?: LogStreamName;
    /**
     * The time the event occurred, expressed as the number of milliseconds after Jan 1, 1970 00:00:00 UTC.
     */
    Timestamp?: JsonPath;
  }
  export interface PipeTargetEcsTaskParameters {
    /**
     * The capacity provider strategy to use for the task. If a capacityProviderStrategy is specified, the launchType parameter must be omitted. If no capacityProviderStrategy or launchType is specified, the defaultCapacityProviderStrategy for the cluster is used. 
     */
    CapacityProviderStrategy?: CapacityProviderStrategy;
    /**
     * Specifies whether to enable Amazon ECS managed tags for the task. For more information, see Tagging Your Amazon ECS Resources in the Amazon Elastic Container Service Developer Guide. 
     */
    EnableECSManagedTags?: Boolean;
    /**
     * Whether or not to enable the execute command functionality for the containers in this task. If true, this enables execute command functionality on all containers in the task.
     */
    EnableExecuteCommand?: Boolean;
    /**
     * Specifies an Amazon ECS task group for the task. The maximum length is 255 characters.
     */
    Group?: String;
    /**
     * Specifies the launch type on which your task is running. The launch type that you specify here must match one of the launch type (compatibilities) of the target task. The FARGATE value is supported only in the Regions where Fargate with Amazon ECS is supported. For more information, see Fargate on Amazon ECS in the Amazon Elastic Container Service Developer Guide.
     */
    LaunchType?: LaunchType;
    /**
     * Use this structure if the Amazon ECS task uses the awsvpc network mode. This structure specifies the VPC subnets and security groups associated with the task, and whether a public IP address is to be used. This structure is required if LaunchType is FARGATE because the awsvpc mode is required for Fargate tasks. If you specify NetworkConfiguration when the target ECS task does not use the awsvpc network mode, the task fails.
     */
    NetworkConfiguration?: NetworkConfiguration;
    /**
     * The overrides that are associated with a task.
     */
    Overrides?: EcsTaskOverride;
    /**
     * An array of placement constraint objects to use for the task. You can specify up to 10 constraints per task (including constraints in the task definition and those specified at runtime).
     */
    PlacementConstraints?: PlacementConstraints;
    /**
     * The placement strategy objects to use for the task. You can specify a maximum of five strategy rules per task. 
     */
    PlacementStrategy?: PlacementStrategies;
    /**
     * Specifies the platform version for the task. Specify only the numeric portion of the platform version, such as 1.1.0. This structure is used only if LaunchType is FARGATE. For more information about valid platform versions, see Fargate Platform Versions in the Amazon Elastic Container Service Developer Guide.
     */
    PlatformVersion?: String;
    /**
     * Specifies whether to propagate the tags from the task definition to the task. If no value is specified, the tags are not propagated. Tags can only be propagated to the task during task creation. To add tags to a task after task creation, use the TagResource API action. 
     */
    PropagateTags?: PropagateTags;
    /**
     * The reference ID to use for the task.
     */
    ReferenceId?: ReferenceId;
    /**
     * The metadata that you apply to the task to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. To learn more, see RunTask in the Amazon ECS API Reference.
     */
    Tags?: TagList;
    /**
     * The number of tasks to create based on TaskDefinition. The default is 1.
     */
    TaskCount?: LimitMin1;
    /**
     * The ARN of the task definition to use if the event target is an Amazon ECS task. 
     */
    TaskDefinitionArn: ArnOrJsonPath;
  }
  export interface PipeTargetEventBridgeEventBusParameters {
    /**
     * A free-form string, with a maximum of 128 characters, used to decide what fields to expect in the event detail.
     */
    DetailType?: EventBridgeDetailType;
    /**
     * The URL subdomain of the endpoint. For example, if the URL for Endpoint is https://abcde.veo.endpoints.event.amazonaws.com, then the EndpointId is abcde.veo.  When using Java, you must include auth-crt on the class path. 
     */
    EndpointId?: EventBridgeEndpointId;
    /**
     * Amazon Web Services resources, identified by Amazon Resource Name (ARN), which the event primarily concerns. Any number, including zero, may be present.
     */
    Resources?: EventBridgeEventResourceList;
    /**
     * The source of the event.
     */
    Source?: EventBridgeEventSource;
    /**
     * The time stamp of the event, per RFC3339. If no time stamp is provided, the time stamp of the PutEvents call is used.
     */
    Time?: JsonPath;
  }
  export interface PipeTargetHttpParameters {
    /**
     * The headers that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
     */
    HeaderParameters?: HeaderParametersMap;
    /**
     * The path parameter values to be used to populate API Gateway REST API or EventBridge ApiDestination path wildcards ("*").
     */
    PathParameterValues?: PathParameterList;
    /**
     * The query string keys/values that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
     */
    QueryStringParameters?: QueryStringParametersMap;
  }
  export type PipeTargetInvocationType = "REQUEST_RESPONSE"|"FIRE_AND_FORGET"|string;
  export interface PipeTargetKinesisStreamParameters {
    /**
     * Determines which shard in the stream the data record is assigned to. Partition keys are Unicode strings with a maximum length limit of 256 characters for each key. Amazon Kinesis Data Streams uses the partition key as input to a hash function that maps the partition key and associated data to a specific shard. Specifically, an MD5 hash function is used to map partition keys to 128-bit integer values and to map associated data records to shards. As a result of this hashing mechanism, all data records with the same partition key map to the same shard within the stream.
     */
    PartitionKey: KinesisPartitionKey;
  }
  export interface PipeTargetLambdaFunctionParameters {
    /**
     * Choose from the following options.    RequestResponse (default) - Invoke the function synchronously. Keep the connection open until the function returns a response or times out. The API response includes the function response and additional data.    Event - Invoke the function asynchronously. Send events that fail multiple times to the function's dead-letter queue (if it's configured). The API response only includes a status code.    DryRun - Validate parameter values and verify that the user or role has permission to invoke the function.  
     */
    InvocationType?: PipeTargetInvocationType;
  }
  export interface PipeTargetParameters {
    /**
     * The parameters for using an Batch job as a target.
     */
    BatchJobParameters?: PipeTargetBatchJobParameters;
    /**
     * The parameters for using an CloudWatch Logs log stream as a target.
     */
    CloudWatchLogsParameters?: PipeTargetCloudWatchLogsParameters;
    /**
     * The parameters for using an Amazon ECS task as a target.
     */
    EcsTaskParameters?: PipeTargetEcsTaskParameters;
    /**
     * The parameters for using an EventBridge event bus as a target.
     */
    EventBridgeEventBusParameters?: PipeTargetEventBridgeEventBusParameters;
    /**
     * These are custom parameter to be used when the target is an API Gateway REST APIs or EventBridge ApiDestinations.
     */
    HttpParameters?: PipeTargetHttpParameters;
    /**
     * Valid JSON text passed to the target. In this case, nothing from the event itself is passed to the target. For more information, see The JavaScript Object Notation (JSON) Data Interchange Format.
     */
    InputTemplate?: InputTemplate;
    /**
     * The parameters for using a Kinesis stream as a source.
     */
    KinesisStreamParameters?: PipeTargetKinesisStreamParameters;
    /**
     * The parameters for using a Lambda function as a target.
     */
    LambdaFunctionParameters?: PipeTargetLambdaFunctionParameters;
    /**
     * These are custom parameters to be used when the target is a Amazon Redshift cluster to invoke the Amazon Redshift Data API ExecuteStatement.
     */
    RedshiftDataParameters?: PipeTargetRedshiftDataParameters;
    /**
     * The parameters for using a SageMaker pipeline as a target.
     */
    SageMakerPipelineParameters?: PipeTargetSageMakerPipelineParameters;
    /**
     * The parameters for using a Amazon SQS stream as a source.
     */
    SqsQueueParameters?: PipeTargetSqsQueueParameters;
    /**
     * The parameters for using a Step Functions state machine as a target.
     */
    StepFunctionStateMachineParameters?: PipeTargetStateMachineParameters;
  }
  export interface PipeTargetRedshiftDataParameters {
    /**
     * The name of the database. Required when authenticating using temporary credentials.
     */
    Database: Database;
    /**
     * The database user name. Required when authenticating using temporary credentials.
     */
    DbUser?: DbUser;
    /**
     * The name or ARN of the secret that enables access to the database. Required when authenticating using SageMaker.
     */
    SecretManagerArn?: SecretManagerArnOrJsonPath;
    /**
     * The SQL statement text to run.
     */
    Sqls: Sqls;
    /**
     * The name of the SQL statement. You can name the SQL statement when you create it to identify the query.
     */
    StatementName?: StatementName;
    /**
     * Indicates whether to send an event back to EventBridge after the SQL statement runs.
     */
    WithEvent?: Boolean;
  }
  export interface PipeTargetSageMakerPipelineParameters {
    /**
     * List of Parameter names and values for SageMaker Model Building Pipeline execution.
     */
    PipelineParameterList?: SageMakerPipelineParameterList;
  }
  export interface PipeTargetSqsQueueParameters {
    /**
     * This parameter applies only to FIFO (first-in-first-out) queues. The token used for deduplication of sent messages.
     */
    MessageDeduplicationId?: MessageDeduplicationId;
    /**
     * The FIFO message group ID to use as the target.
     */
    MessageGroupId?: MessageGroupId;
  }
  export interface PipeTargetStateMachineParameters {
    /**
     * Specify whether to wait for the state machine to finish or not.
     */
    InvocationType?: PipeTargetInvocationType;
  }
  export interface PlacementConstraint {
    /**
     * A cluster query language expression to apply to the constraint. You cannot specify an expression if the constraint type is distinctInstance. To learn more, see Cluster Query Language in the Amazon Elastic Container Service Developer Guide. 
     */
    expression?: PlacementConstraintExpression;
    /**
     * The type of constraint. Use distinctInstance to ensure that each task in a particular group is running on a different container instance. Use memberOf to restrict the selection to a group of valid candidates. 
     */
    type?: PlacementConstraintType;
  }
  export type PlacementConstraintExpression = string;
  export type PlacementConstraintType = "distinctInstance"|"memberOf"|string;
  export type PlacementConstraints = PlacementConstraint[];
  export type PlacementStrategies = PlacementStrategy[];
  export interface PlacementStrategy {
    /**
     * The field to apply the placement strategy against. For the spread placement strategy, valid values are instanceId (or host, which has the same effect), or any platform or custom attribute that is applied to a container instance, such as attribute:ecs.availability-zone. For the binpack placement strategy, valid values are cpu and memory. For the random placement strategy, this field is not used. 
     */
    field?: PlacementStrategyField;
    /**
     * The type of placement strategy. The random placement strategy randomly places tasks on available candidates. The spread placement strategy spreads placement across available candidates evenly based on the field parameter. The binpack strategy places tasks on available candidates that have the least available amount of the resource that is specified with the field parameter. For example, if you binpack on memory, a task is placed on the instance with the least amount of remaining memory (but still enough to run the task). 
     */
    type?: PlacementStrategyType;
  }
  export type PlacementStrategyField = string;
  export type PlacementStrategyType = "random"|"spread"|"binpack"|string;
  export type PropagateTags = "TASK_DEFINITION"|string;
  export type QueryStringKey = string;
  export type QueryStringParametersMap = {[key: string]: QueryStringValue};
  export type QueryStringValue = string;
  export type ReferenceId = string;
  export type RequestedPipeState = "RUNNING"|"STOPPED"|string;
  export type RequestedPipeStateDescribeResponse = "RUNNING"|"STOPPED"|"DELETED"|string;
  export type ResourceArn = string;
  export type RoleArn = string;
  export interface SageMakerPipelineParameter {
    /**
     * Name of parameter to start execution of a SageMaker Model Building Pipeline.
     */
    Name: SageMakerPipelineParameterName;
    /**
     * Value of parameter to start execution of a SageMaker Model Building Pipeline.
     */
    Value: SageMakerPipelineParameterValue;
  }
  export type SageMakerPipelineParameterList = SageMakerPipelineParameter[];
  export type SageMakerPipelineParameterName = string;
  export type SageMakerPipelineParameterValue = string;
  export type SecretManagerArn = string;
  export type SecretManagerArnOrJsonPath = string;
  export type SecurityGroup = string;
  export type SecurityGroupId = string;
  export type SecurityGroupIds = SecurityGroupId[];
  export type SecurityGroups = SecurityGroup[];
  export interface SelfManagedKafkaAccessConfigurationCredentials {
    /**
     * The ARN of the Secrets Manager secret.
     */
    BasicAuth?: SecretManagerArn;
    /**
     * The ARN of the Secrets Manager secret.
     */
    ClientCertificateTlsAuth?: SecretManagerArn;
    /**
     * The ARN of the Secrets Manager secret.
     */
    SaslScram256Auth?: SecretManagerArn;
    /**
     * The ARN of the Secrets Manager secret.
     */
    SaslScram512Auth?: SecretManagerArn;
  }
  export interface SelfManagedKafkaAccessConfigurationVpc {
    /**
     * Specifies the security groups associated with the stream. These security groups must all be in the same VPC. You can specify as many as five security groups. If you do not specify a security group, the default security group for the VPC is used.
     */
    SecurityGroup?: SecurityGroupIds;
    /**
     * Specifies the subnets associated with the stream. These subnets must all be in the same VPC. You can specify as many as 16 subnets.
     */
    Subnets?: SubnetIds;
  }
  export type SelfManagedKafkaStartPosition = "TRIM_HORIZON"|"LATEST"|string;
  export type Sql = string;
  export type Sqls = Sql[];
  export interface StartPipeRequest {
    /**
     * The name of the pipe.
     */
    Name: PipeName;
  }
  export interface StartPipeResponse {
    /**
     * The ARN of the pipe.
     */
    Arn?: PipeArn;
    /**
     * The time the pipe was created.
     */
    CreationTime?: Timestamp;
    /**
     * The state the pipe is in.
     */
    CurrentState?: PipeState;
    /**
     * The state the pipe should be in.
     */
    DesiredState?: RequestedPipeState;
    /**
     * When the pipe was last updated, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    LastModifiedTime?: Timestamp;
    /**
     * The name of the pipe.
     */
    Name?: PipeName;
  }
  export type StatementName = string;
  export interface StopPipeRequest {
    /**
     * The name of the pipe.
     */
    Name: PipeName;
  }
  export interface StopPipeResponse {
    /**
     * The ARN of the pipe.
     */
    Arn?: PipeArn;
    /**
     * The time the pipe was created.
     */
    CreationTime?: Timestamp;
    /**
     * The state the pipe is in.
     */
    CurrentState?: PipeState;
    /**
     * The state the pipe should be in.
     */
    DesiredState?: RequestedPipeState;
    /**
     * When the pipe was last updated, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    LastModifiedTime?: Timestamp;
    /**
     * The name of the pipe.
     */
    Name?: PipeName;
  }
  export type String = string;
  export type StringList = String[];
  export type Subnet = string;
  export type SubnetId = string;
  export type SubnetIds = SubnetId[];
  export type Subnets = Subnet[];
  export interface Tag {
    /**
     * A string you can use to assign a value. The combination of tag keys and values can help you organize and categorize your resources.
     */
    Key: TagKey;
    /**
     * The value for the specified tag key.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The ARN of the pipe.
     */
    resourceArn: PipeArn;
    /**
     * The list of key-value pairs associated with the pipe.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export type URI = string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the pipe.
     */
    resourceArn: PipeArn;
    /**
     * The list of tag keys to remove from the pipe.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdatePipeRequest {
    /**
     * A description of the pipe.
     */
    Description?: PipeDescription;
    /**
     * The state the pipe should be in.
     */
    DesiredState?: RequestedPipeState;
    /**
     * The ARN of the enrichment resource.
     */
    Enrichment?: OptionalArn;
    /**
     * The parameters required to set up enrichment on your pipe.
     */
    EnrichmentParameters?: PipeEnrichmentParameters;
    /**
     * The name of the pipe.
     */
    Name: PipeName;
    /**
     * The ARN of the role that allows the pipe to send data to the target.
     */
    RoleArn: RoleArn;
    /**
     * The parameters required to set up a source for your pipe.
     */
    SourceParameters?: UpdatePipeSourceParameters;
    /**
     * The ARN of the target resource.
     */
    Target?: Arn;
    /**
     * The parameters required to set up a target for your pipe.
     */
    TargetParameters?: PipeTargetParameters;
  }
  export interface UpdatePipeResponse {
    /**
     * The ARN of the pipe.
     */
    Arn?: PipeArn;
    /**
     * The time the pipe was created.
     */
    CreationTime?: Timestamp;
    /**
     * The state the pipe is in.
     */
    CurrentState?: PipeState;
    /**
     * The state the pipe should be in.
     */
    DesiredState?: RequestedPipeState;
    /**
     * When the pipe was last updated, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    LastModifiedTime?: Timestamp;
    /**
     * The name of the pipe.
     */
    Name?: PipeName;
  }
  export interface UpdatePipeSourceActiveMQBrokerParameters {
    /**
     * The maximum number of records to include in each batch.
     */
    BatchSize?: LimitMax10000;
    /**
     * The credentials needed to access the resource.
     */
    Credentials: MQBrokerAccessCredentials;
    /**
     * The maximum length of a time to wait for events.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
  }
  export interface UpdatePipeSourceDynamoDBStreamParameters {
    /**
     * The maximum number of records to include in each batch.
     */
    BatchSize?: LimitMax10000;
    /**
     * Define the target queue to send dead-letter queue events to.
     */
    DeadLetterConfig?: DeadLetterConfig;
    /**
     * The maximum length of a time to wait for events.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
    /**
     * (Streams only) Discard records older than the specified age. The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, EventBridge never discards old records. 
     */
    MaximumRecordAgeInSeconds?: MaximumRecordAgeInSeconds;
    /**
     * (Streams only) Discard records after the specified number of retries. The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, EventBridge retries failed records until the record expires in the event source.
     */
    MaximumRetryAttempts?: MaximumRetryAttemptsESM;
    /**
     * (Streams only) Define how to handle item process failures. AUTOMATIC_BISECT halves each batch and retry each half until all the records are processed or there is one failed message left in the batch.
     */
    OnPartialBatchItemFailure?: OnPartialBatchItemFailureStreams;
    /**
     * (Streams only) The number of batches to process concurrently from each shard. The default value is 1.
     */
    ParallelizationFactor?: LimitMax10;
  }
  export interface UpdatePipeSourceKinesisStreamParameters {
    /**
     * The maximum number of records to include in each batch.
     */
    BatchSize?: LimitMax10000;
    /**
     * Define the target queue to send dead-letter queue events to.
     */
    DeadLetterConfig?: DeadLetterConfig;
    /**
     * The maximum length of a time to wait for events.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
    /**
     * (Streams only) Discard records older than the specified age. The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, EventBridge never discards old records. 
     */
    MaximumRecordAgeInSeconds?: MaximumRecordAgeInSeconds;
    /**
     * (Streams only) Discard records after the specified number of retries. The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, EventBridge retries failed records until the record expires in the event source.
     */
    MaximumRetryAttempts?: MaximumRetryAttemptsESM;
    /**
     * (Streams only) Define how to handle item process failures. AUTOMATIC_BISECT halves each batch and retry each half until all the records are processed or there is one failed message left in the batch.
     */
    OnPartialBatchItemFailure?: OnPartialBatchItemFailureStreams;
    /**
     * (Streams only) The number of batches to process concurrently from each shard. The default value is 1.
     */
    ParallelizationFactor?: LimitMax10;
  }
  export interface UpdatePipeSourceManagedStreamingKafkaParameters {
    /**
     * The maximum number of records to include in each batch.
     */
    BatchSize?: LimitMax10000;
    /**
     * The credentials needed to access the resource.
     */
    Credentials?: MSKAccessCredentials;
    /**
     * The maximum length of a time to wait for events.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
  }
  export interface UpdatePipeSourceParameters {
    /**
     * The parameters for using an Active MQ broker as a source.
     */
    ActiveMQBrokerParameters?: UpdatePipeSourceActiveMQBrokerParameters;
    /**
     * The parameters for using a DynamoDB stream as a source.
     */
    DynamoDBStreamParameters?: UpdatePipeSourceDynamoDBStreamParameters;
    /**
     * The collection of event patterns used to filter events. For more information, see Events and Event Patterns in the Amazon EventBridge User Guide.
     */
    FilterCriteria?: FilterCriteria;
    /**
     * The parameters for using a Kinesis stream as a source.
     */
    KinesisStreamParameters?: UpdatePipeSourceKinesisStreamParameters;
    /**
     * The parameters for using an MSK stream as a source.
     */
    ManagedStreamingKafkaParameters?: UpdatePipeSourceManagedStreamingKafkaParameters;
    /**
     * The parameters for using a Rabbit MQ broker as a source.
     */
    RabbitMQBrokerParameters?: UpdatePipeSourceRabbitMQBrokerParameters;
    /**
     * The parameters for using a self-managed Apache Kafka stream as a source.
     */
    SelfManagedKafkaParameters?: UpdatePipeSourceSelfManagedKafkaParameters;
    /**
     * The parameters for using a Amazon SQS stream as a source.
     */
    SqsQueueParameters?: UpdatePipeSourceSqsQueueParameters;
  }
  export interface UpdatePipeSourceRabbitMQBrokerParameters {
    /**
     * The maximum number of records to include in each batch.
     */
    BatchSize?: LimitMax10000;
    /**
     * The credentials needed to access the resource.
     */
    Credentials: MQBrokerAccessCredentials;
    /**
     * The maximum length of a time to wait for events.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
  }
  export interface UpdatePipeSourceSelfManagedKafkaParameters {
    /**
     * The maximum number of records to include in each batch.
     */
    BatchSize?: LimitMax10000;
    /**
     * The credentials needed to access the resource.
     */
    Credentials?: SelfManagedKafkaAccessConfigurationCredentials;
    /**
     * The maximum length of a time to wait for events.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
    /**
     * The ARN of the Secrets Manager secret used for certification.
     */
    ServerRootCaCertificate?: SecretManagerArn;
    /**
     * This structure specifies the VPC subnets and security groups for the stream, and whether a public IP address is to be used.
     */
    Vpc?: SelfManagedKafkaAccessConfigurationVpc;
  }
  export interface UpdatePipeSourceSqsQueueParameters {
    /**
     * The maximum number of records to include in each batch.
     */
    BatchSize?: LimitMax10000;
    /**
     * The maximum length of a time to wait for events.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2015-10-07"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Pipes client.
   */
  export import Types = Pipes;
}
export = Pipes;
