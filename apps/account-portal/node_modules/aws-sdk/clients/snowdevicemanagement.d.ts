import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SnowDeviceManagement extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SnowDeviceManagement.Types.ClientConfiguration)
  config: Config & SnowDeviceManagement.Types.ClientConfiguration;
  /**
   * Sends a cancel request for a specified task. You can cancel a task only if it's still in a QUEUED state. Tasks that are already running can't be cancelled.  A task might still run if it's processed from the queue before the CancelTask operation changes the task's state. 
   */
  cancelTask(params: SnowDeviceManagement.Types.CancelTaskInput, callback?: (err: AWSError, data: SnowDeviceManagement.Types.CancelTaskOutput) => void): Request<SnowDeviceManagement.Types.CancelTaskOutput, AWSError>;
  /**
   * Sends a cancel request for a specified task. You can cancel a task only if it's still in a QUEUED state. Tasks that are already running can't be cancelled.  A task might still run if it's processed from the queue before the CancelTask operation changes the task's state. 
   */
  cancelTask(callback?: (err: AWSError, data: SnowDeviceManagement.Types.CancelTaskOutput) => void): Request<SnowDeviceManagement.Types.CancelTaskOutput, AWSError>;
  /**
   * Instructs one or more devices to start a task, such as unlocking or rebooting.
   */
  createTask(params: SnowDeviceManagement.Types.CreateTaskInput, callback?: (err: AWSError, data: SnowDeviceManagement.Types.CreateTaskOutput) => void): Request<SnowDeviceManagement.Types.CreateTaskOutput, AWSError>;
  /**
   * Instructs one or more devices to start a task, such as unlocking or rebooting.
   */
  createTask(callback?: (err: AWSError, data: SnowDeviceManagement.Types.CreateTaskOutput) => void): Request<SnowDeviceManagement.Types.CreateTaskOutput, AWSError>;
  /**
   * Checks device-specific information, such as the device type, software version, IP addresses, and lock status.
   */
  describeDevice(params: SnowDeviceManagement.Types.DescribeDeviceInput, callback?: (err: AWSError, data: SnowDeviceManagement.Types.DescribeDeviceOutput) => void): Request<SnowDeviceManagement.Types.DescribeDeviceOutput, AWSError>;
  /**
   * Checks device-specific information, such as the device type, software version, IP addresses, and lock status.
   */
  describeDevice(callback?: (err: AWSError, data: SnowDeviceManagement.Types.DescribeDeviceOutput) => void): Request<SnowDeviceManagement.Types.DescribeDeviceOutput, AWSError>;
  /**
   * Checks the current state of the Amazon EC2 instances. The output is similar to describeDevice, but the results are sourced from the device cache in the Amazon Web Services Cloud and include a subset of the available fields. 
   */
  describeDeviceEc2Instances(params: SnowDeviceManagement.Types.DescribeDeviceEc2Input, callback?: (err: AWSError, data: SnowDeviceManagement.Types.DescribeDeviceEc2Output) => void): Request<SnowDeviceManagement.Types.DescribeDeviceEc2Output, AWSError>;
  /**
   * Checks the current state of the Amazon EC2 instances. The output is similar to describeDevice, but the results are sourced from the device cache in the Amazon Web Services Cloud and include a subset of the available fields. 
   */
  describeDeviceEc2Instances(callback?: (err: AWSError, data: SnowDeviceManagement.Types.DescribeDeviceEc2Output) => void): Request<SnowDeviceManagement.Types.DescribeDeviceEc2Output, AWSError>;
  /**
   * Checks the status of a remote task running on one or more target devices.
   */
  describeExecution(params: SnowDeviceManagement.Types.DescribeExecutionInput, callback?: (err: AWSError, data: SnowDeviceManagement.Types.DescribeExecutionOutput) => void): Request<SnowDeviceManagement.Types.DescribeExecutionOutput, AWSError>;
  /**
   * Checks the status of a remote task running on one or more target devices.
   */
  describeExecution(callback?: (err: AWSError, data: SnowDeviceManagement.Types.DescribeExecutionOutput) => void): Request<SnowDeviceManagement.Types.DescribeExecutionOutput, AWSError>;
  /**
   * Checks the metadata for a given task on a device. 
   */
  describeTask(params: SnowDeviceManagement.Types.DescribeTaskInput, callback?: (err: AWSError, data: SnowDeviceManagement.Types.DescribeTaskOutput) => void): Request<SnowDeviceManagement.Types.DescribeTaskOutput, AWSError>;
  /**
   * Checks the metadata for a given task on a device. 
   */
  describeTask(callback?: (err: AWSError, data: SnowDeviceManagement.Types.DescribeTaskOutput) => void): Request<SnowDeviceManagement.Types.DescribeTaskOutput, AWSError>;
  /**
   * Returns a list of the Amazon Web Services resources available for a device. Currently, Amazon EC2 instances are the only supported resource type.
   */
  listDeviceResources(params: SnowDeviceManagement.Types.ListDeviceResourcesInput, callback?: (err: AWSError, data: SnowDeviceManagement.Types.ListDeviceResourcesOutput) => void): Request<SnowDeviceManagement.Types.ListDeviceResourcesOutput, AWSError>;
  /**
   * Returns a list of the Amazon Web Services resources available for a device. Currently, Amazon EC2 instances are the only supported resource type.
   */
  listDeviceResources(callback?: (err: AWSError, data: SnowDeviceManagement.Types.ListDeviceResourcesOutput) => void): Request<SnowDeviceManagement.Types.ListDeviceResourcesOutput, AWSError>;
  /**
   * Returns a list of all devices on your Amazon Web Services account that have Amazon Web Services Snow Device Management enabled in the Amazon Web Services Region where the command is run.
   */
  listDevices(params: SnowDeviceManagement.Types.ListDevicesInput, callback?: (err: AWSError, data: SnowDeviceManagement.Types.ListDevicesOutput) => void): Request<SnowDeviceManagement.Types.ListDevicesOutput, AWSError>;
  /**
   * Returns a list of all devices on your Amazon Web Services account that have Amazon Web Services Snow Device Management enabled in the Amazon Web Services Region where the command is run.
   */
  listDevices(callback?: (err: AWSError, data: SnowDeviceManagement.Types.ListDevicesOutput) => void): Request<SnowDeviceManagement.Types.ListDevicesOutput, AWSError>;
  /**
   * Returns the status of tasks for one or more target devices.
   */
  listExecutions(params: SnowDeviceManagement.Types.ListExecutionsInput, callback?: (err: AWSError, data: SnowDeviceManagement.Types.ListExecutionsOutput) => void): Request<SnowDeviceManagement.Types.ListExecutionsOutput, AWSError>;
  /**
   * Returns the status of tasks for one or more target devices.
   */
  listExecutions(callback?: (err: AWSError, data: SnowDeviceManagement.Types.ListExecutionsOutput) => void): Request<SnowDeviceManagement.Types.ListExecutionsOutput, AWSError>;
  /**
   * Returns a list of tags for a managed device or task.
   */
  listTagsForResource(params: SnowDeviceManagement.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: SnowDeviceManagement.Types.ListTagsForResourceOutput) => void): Request<SnowDeviceManagement.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Returns a list of tags for a managed device or task.
   */
  listTagsForResource(callback?: (err: AWSError, data: SnowDeviceManagement.Types.ListTagsForResourceOutput) => void): Request<SnowDeviceManagement.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Returns a list of tasks that can be filtered by state.
   */
  listTasks(params: SnowDeviceManagement.Types.ListTasksInput, callback?: (err: AWSError, data: SnowDeviceManagement.Types.ListTasksOutput) => void): Request<SnowDeviceManagement.Types.ListTasksOutput, AWSError>;
  /**
   * Returns a list of tasks that can be filtered by state.
   */
  listTasks(callback?: (err: AWSError, data: SnowDeviceManagement.Types.ListTasksOutput) => void): Request<SnowDeviceManagement.Types.ListTasksOutput, AWSError>;
  /**
   * Adds or replaces tags on a device or task.
   */
  tagResource(params: SnowDeviceManagement.Types.TagResourceInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or replaces tags on a device or task.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a tag from a device or task.
   */
  untagResource(params: SnowDeviceManagement.Types.UntagResourceInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a tag from a device or task.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace SnowDeviceManagement {
  export type AttachmentStatus = "ATTACHING"|"ATTACHED"|"DETACHING"|"DETACHED"|string;
  export type Boolean = boolean;
  export interface CancelTaskInput {
    /**
     * The ID of the task that you are attempting to cancel. You can retrieve a task ID by using the ListTasks operation.
     */
    taskId: TaskId;
  }
  export interface CancelTaskOutput {
    /**
     * The ID of the task that you are attempting to cancel.
     */
    taskId?: String;
  }
  export interface Capacity {
    /**
     * The amount of capacity available for use on the device.
     */
    available?: Long;
    /**
     * The name of the type of capacity, such as memory.
     */
    name?: CapacityNameString;
    /**
     * The total capacity on the device.
     */
    total?: Long;
    /**
     * The unit of measure for the type of capacity.
     */
    unit?: CapacityUnitString;
    /**
     * The amount of capacity used on the device.
     */
    used?: Long;
  }
  export type CapacityList = Capacity[];
  export type CapacityNameString = string;
  export type CapacityUnitString = string;
  export interface Command {
    /**
     * Reboots the device.
     */
    reboot?: Reboot;
    /**
     * Unlocks the device.
     */
    unlock?: Unlock;
  }
  export interface CpuOptions {
    /**
     * The number of cores that the CPU can use.
     */
    coreCount?: Integer;
    /**
     * The number of threads per core in the CPU.
     */
    threadsPerCore?: Integer;
  }
  export interface CreateTaskInput {
    /**
     * A token ensuring that the action is called only once with the specified details.
     */
    clientToken?: IdempotencyToken;
    /**
     * The task to be performed. Only one task is executed on a device at a time.
     */
    command: Command;
    /**
     * A description of the task and its targets.
     */
    description?: TaskDescriptionString;
    /**
     * Optional metadata that you assign to a resource. You can use tags to categorize a resource in different ways, such as by purpose, owner, or environment. 
     */
    tags?: TagMap;
    /**
     * A list of managed device IDs.
     */
    targets: TargetList;
  }
  export interface CreateTaskOutput {
    /**
     * The Amazon Resource Name (ARN) of the task that you created.
     */
    taskArn?: String;
    /**
     * The ID of the task that you created.
     */
    taskId?: String;
  }
  export interface DescribeDeviceEc2Input {
    /**
     * A list of instance IDs associated with the managed device.
     */
    instanceIds: InstanceIdsList;
    /**
     * The ID of the managed device.
     */
    managedDeviceId: ManagedDeviceId;
  }
  export interface DescribeDeviceEc2Output {
    /**
     * A list of structures containing information about each instance. 
     */
    instances?: InstanceSummaryList;
  }
  export interface DescribeDeviceInput {
    /**
     * The ID of the device that you are checking the information of.
     */
    managedDeviceId: ManagedDeviceId;
  }
  export interface DescribeDeviceOutput {
    /**
     * The ID of the job used when ordering the device.
     */
    associatedWithJob?: String;
    /**
     * The hardware specifications of the device. 
     */
    deviceCapacities?: CapacityList;
    /**
     * The current state of the device.
     */
    deviceState?: UnlockState;
    /**
     * The type of Amazon Web Services Snow Family device.
     */
    deviceType?: String;
    /**
     * When the device last contacted the Amazon Web Services Cloud. Indicates that the device is online.
     */
    lastReachedOutAt?: Timestamp;
    /**
     * When the device last pushed an update to the Amazon Web Services Cloud. Indicates when the device cache was refreshed.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the device.
     */
    managedDeviceArn?: String;
    /**
     * The ID of the device that you checked the information for.
     */
    managedDeviceId?: ManagedDeviceId;
    /**
     * The network interfaces available on the device.
     */
    physicalNetworkInterfaces?: PhysicalNetworkInterfaceList;
    /**
     * The software installed on the device.
     */
    software?: SoftwareInformation;
    /**
     * Optional metadata that you assign to a resource. You can use tags to categorize a resource in different ways, such as by purpose, owner, or environment. 
     */
    tags?: TagMap;
  }
  export interface DescribeExecutionInput {
    /**
     * The ID of the managed device.
     */
    managedDeviceId: ManagedDeviceId;
    /**
     * The ID of the task that the action is describing.
     */
    taskId: TaskId;
  }
  export interface DescribeExecutionOutput {
    /**
     * The ID of the execution.
     */
    executionId?: ExecutionId;
    /**
     * When the status of the execution was last updated.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The ID of the managed device that the task is being executed on.
     */
    managedDeviceId?: ManagedDeviceId;
    /**
     * When the execution began.
     */
    startedAt?: Timestamp;
    /**
     * The current state of the execution.
     */
    state?: ExecutionState;
    /**
     * The ID of the task being executed on the device.
     */
    taskId?: TaskId;
  }
  export interface DescribeTaskInput {
    /**
     * The ID of the task to be described.
     */
    taskId: TaskId;
  }
  export interface DescribeTaskOutput {
    /**
     * When the task was completed.
     */
    completedAt?: Timestamp;
    /**
     * When the CreateTask operation was called.
     */
    createdAt?: Timestamp;
    /**
     * The description provided of the task and managed devices.
     */
    description?: TaskDescriptionString;
    /**
     * When the state of the task was last updated.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The current state of the task.
     */
    state?: TaskState;
    /**
     * Optional metadata that you assign to a resource. You can use tags to categorize a resource in different ways, such as by purpose, owner, or environment.
     */
    tags?: TagMap;
    /**
     * The managed devices that the task was sent to.
     */
    targets?: TargetList;
    /**
     * The Amazon Resource Name (ARN) of the task.
     */
    taskArn?: String;
    /**
     * The ID of the task.
     */
    taskId?: String;
  }
  export interface DeviceSummary {
    /**
     * The ID of the job used to order the device.
     */
    associatedWithJob?: String;
    /**
     * The Amazon Resource Name (ARN) of the device.
     */
    managedDeviceArn?: String;
    /**
     * The ID of the device.
     */
    managedDeviceId?: ManagedDeviceId;
    /**
     * Optional metadata that you assign to a resource. You can use tags to categorize a resource in different ways, such as by purpose, owner, or environment.
     */
    tags?: TagMap;
  }
  export type DeviceSummaryList = DeviceSummary[];
  export interface EbsInstanceBlockDevice {
    /**
     * When the attachment was initiated.
     */
    attachTime?: Timestamp;
    /**
     * A value that indicates whether the volume is deleted on instance termination.
     */
    deleteOnTermination?: Boolean;
    /**
     * The attachment state.
     */
    status?: AttachmentStatus;
    /**
     * The ID of the Amazon EBS volume.
     */
    volumeId?: String;
  }
  export type ExecutionId = string;
  export type ExecutionState = "QUEUED"|"IN_PROGRESS"|"CANCELED"|"FAILED"|"SUCCEEDED"|"REJECTED"|"TIMED_OUT"|string;
  export interface ExecutionSummary {
    /**
     * The ID of the execution.
     */
    executionId?: ExecutionId;
    /**
     * The ID of the managed device that the task is being executed on.
     */
    managedDeviceId?: ManagedDeviceId;
    /**
     * The state of the execution.
     */
    state?: ExecutionState;
    /**
     * The ID of the task.
     */
    taskId?: TaskId;
  }
  export type ExecutionSummaryList = ExecutionSummary[];
  export type IdempotencyToken = string;
  export interface Instance {
    /**
     * The Amazon Machine Image (AMI) launch index, which you can use to find this instance in the launch group. 
     */
    amiLaunchIndex?: Integer;
    /**
     * Any block device mapping entries for the instance.
     */
    blockDeviceMappings?: InstanceBlockDeviceMappingList;
    /**
     * The CPU options for the instance.
     */
    cpuOptions?: CpuOptions;
    /**
     * When the instance was created.
     */
    createdAt?: Timestamp;
    /**
     * The ID of the AMI used to launch the instance.
     */
    imageId?: String;
    /**
     * The ID of the instance.
     */
    instanceId?: String;
    /**
     * The instance type.
     */
    instanceType?: String;
    /**
     * The private IPv4 address assigned to the instance.
     */
    privateIpAddress?: String;
    /**
     * The public IPv4 address assigned to the instance.
     */
    publicIpAddress?: String;
    /**
     * The device name of the root device volume (for example, /dev/sda1). 
     */
    rootDeviceName?: String;
    /**
     * The security groups for the instance.
     */
    securityGroups?: SecurityGroupIdentifierList;
    state?: InstanceState;
    /**
     * When the instance was last updated.
     */
    updatedAt?: Timestamp;
  }
  export interface InstanceBlockDeviceMapping {
    /**
     * The block device name.
     */
    deviceName?: String;
    /**
     * The parameters used to automatically set up Amazon Elastic Block Store (Amazon EBS) volumes when the instance is launched. 
     */
    ebs?: EbsInstanceBlockDevice;
  }
  export type InstanceBlockDeviceMappingList = InstanceBlockDeviceMapping[];
  export type InstanceIdsList = String[];
  export interface InstanceState {
    /**
     * The state of the instance as a 16-bit unsigned integer.  The high byte is all of the bits between 2^8 and (2^16)-1, which equals decimal values between 256 and 65,535. These numerical values are used for internal purposes and should be ignored.  The low byte is all of the bits between 2^0 and (2^8)-1, which equals decimal values between 0 and 255.  The valid values for the instance state code are all in the range of the low byte. These values are:     0 : pending     16 : running     32 : shutting-down     48 : terminated     64 : stopping     80 : stopped    You can ignore the high byte value by zeroing out all of the bits above 2^8 or 256 in decimal. 
     */
    code?: Integer;
    /**
     * The current state of the instance.
     */
    name?: InstanceStateName;
  }
  export type InstanceStateName = "PENDING"|"RUNNING"|"SHUTTING_DOWN"|"TERMINATED"|"STOPPING"|"STOPPED"|string;
  export interface InstanceSummary {
    /**
     * A structure containing details about the instance.
     */
    instance?: Instance;
    /**
     * When the instance summary was last updated.
     */
    lastUpdatedAt?: Timestamp;
  }
  export type InstanceSummaryList = InstanceSummary[];
  export type Integer = number;
  export type IpAddressAssignment = "DHCP"|"STATIC"|string;
  export type JobId = string;
  export interface ListDeviceResourcesInput {
    /**
     * The ID of the managed device that you are listing the resources of.
     */
    managedDeviceId: ManagedDeviceId;
    /**
     * The maximum number of resources per page.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token to continue to the next page of results.
     */
    nextToken?: NextToken;
    /**
     * A structure used to filter the results by type of resource.
     */
    type?: ListDeviceResourcesInputTypeString;
  }
  export type ListDeviceResourcesInputTypeString = string;
  export interface ListDeviceResourcesOutput {
    /**
     * A pagination token to continue to the next page of results.
     */
    nextToken?: NextToken;
    /**
     * A structure defining the resource's type, Amazon Resource Name (ARN), and ID.
     */
    resources?: ResourceSummaryList;
  }
  export interface ListDevicesInput {
    /**
     * The ID of the job used to order the device.
     */
    jobId?: JobId;
    /**
     * The maximum number of devices to list per page.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token to continue to the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListDevicesOutput {
    /**
     * A list of device structures that contain information about the device.
     */
    devices?: DeviceSummaryList;
    /**
     * A pagination token to continue to the next page of devices.
     */
    nextToken?: NextToken;
  }
  export interface ListExecutionsInput {
    /**
     * The maximum number of tasks to list per page.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token to continue to the next page of tasks.
     */
    nextToken?: NextToken;
    /**
     * A structure used to filter the tasks by their current state.
     */
    state?: ExecutionState;
    /**
     * The ID of the task.
     */
    taskId: TaskId;
  }
  export interface ListExecutionsOutput {
    /**
     * A list of executions. Each execution contains the task ID, the device that the task is executing on, the execution ID, and the status of the execution.
     */
    executions?: ExecutionSummaryList;
    /**
     * A pagination token to continue to the next page of executions.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the device or task.
     */
    resourceArn: String;
  }
  export interface ListTagsForResourceOutput {
    /**
     * The list of tags for the device or task.
     */
    tags?: TagMap;
  }
  export interface ListTasksInput {
    /**
     * The maximum number of tasks per page.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token to continue to the next page of tasks.
     */
    nextToken?: NextToken;
    /**
     * A structure used to filter the list of tasks.
     */
    state?: TaskState;
  }
  export interface ListTasksOutput {
    /**
     * A pagination token to continue to the next page of tasks.
     */
    nextToken?: NextToken;
    /**
     * A list of task structures containing details about each task.
     */
    tasks?: TaskSummaryList;
  }
  export type Long = number;
  export type ManagedDeviceId = string;
  export type MaxResults = number;
  export type NextToken = string;
  export type PhysicalConnectorType = "RJ45"|"SFP_PLUS"|"QSFP"|"RJ45_2"|"WIFI"|string;
  export interface PhysicalNetworkInterface {
    /**
     * The default gateway of the device.
     */
    defaultGateway?: String;
    /**
     * The IP address of the device.
     */
    ipAddress?: String;
    /**
     * A value that describes whether the IP address is dynamic or persistent.
     */
    ipAddressAssignment?: IpAddressAssignment;
    /**
     * The MAC address of the device.
     */
    macAddress?: String;
    /**
     * The netmask used to divide the IP address into subnets.
     */
    netmask?: String;
    /**
     * The physical connector type.
     */
    physicalConnectorType?: PhysicalConnectorType;
    /**
     * The physical network interface ID.
     */
    physicalNetworkInterfaceId?: String;
  }
  export type PhysicalNetworkInterfaceList = PhysicalNetworkInterface[];
  export interface Reboot {
  }
  export interface ResourceSummary {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    arn?: String;
    /**
     * The ID of the resource.
     */
    id?: String;
    /**
     * The resource type.
     */
    resourceType: String;
  }
  export type ResourceSummaryList = ResourceSummary[];
  export interface SecurityGroupIdentifier {
    /**
     * The security group ID.
     */
    groupId?: String;
    /**
     * The security group name.
     */
    groupName?: String;
  }
  export type SecurityGroupIdentifierList = SecurityGroupIdentifier[];
  export interface SoftwareInformation {
    /**
     * The state of the software that is installed or that is being installed on the device.
     */
    installState?: String;
    /**
     * The version of the software currently installed on the device.
     */
    installedVersion?: String;
    /**
     * The version of the software being installed on the device.
     */
    installingVersion?: String;
  }
  export type String = string;
  export type TagKeys = String[];
  export type TagMap = {[key: string]: String};
  export interface TagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the device or task.
     */
    resourceArn: String;
    /**
     * Optional metadata that you assign to a resource. You can use tags to categorize a resource in different ways, such as by purpose, owner, or environment.
     */
    tags: TagMap;
  }
  export type TargetList = String[];
  export type TaskDescriptionString = string;
  export type TaskId = string;
  export type TaskState = "IN_PROGRESS"|"CANCELED"|"COMPLETED"|string;
  export interface TaskSummary {
    /**
     * The state of the task assigned to one or many devices.
     */
    state?: TaskState;
    /**
     * Optional metadata that you assign to a resource. You can use tags to categorize a resource in different ways, such as by purpose, owner, or environment.
     */
    tags?: TagMap;
    /**
     * The Amazon Resource Name (ARN) of the task.
     */
    taskArn?: String;
    /**
     * The task ID.
     */
    taskId: TaskId;
  }
  export type TaskSummaryList = TaskSummary[];
  export type Timestamp = Date;
  export interface Unlock {
  }
  export type UnlockState = "UNLOCKED"|"LOCKED"|"UNLOCKING"|string;
  export interface UntagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the device or task.
     */
    resourceArn: String;
    /**
     * Optional metadata that you assign to a resource. You can use tags to categorize a resource in different ways, such as by purpose, owner, or environment.
     */
    tagKeys: TagKeys;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-08-04"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SnowDeviceManagement client.
   */
  export import Types = SnowDeviceManagement;
}
export = SnowDeviceManagement;
