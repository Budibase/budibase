import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class BackupGateway extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: BackupGateway.Types.ClientConfiguration)
  config: Config & BackupGateway.Types.ClientConfiguration;
  /**
   * Associates a backup gateway with your server. After you complete the association process, you can back up and restore your VMs through the gateway.
   */
  associateGatewayToServer(params: BackupGateway.Types.AssociateGatewayToServerInput, callback?: (err: AWSError, data: BackupGateway.Types.AssociateGatewayToServerOutput) => void): Request<BackupGateway.Types.AssociateGatewayToServerOutput, AWSError>;
  /**
   * Associates a backup gateway with your server. After you complete the association process, you can back up and restore your VMs through the gateway.
   */
  associateGatewayToServer(callback?: (err: AWSError, data: BackupGateway.Types.AssociateGatewayToServerOutput) => void): Request<BackupGateway.Types.AssociateGatewayToServerOutput, AWSError>;
  /**
   * Creates a backup gateway. After you create a gateway, you can associate it with a server using the AssociateGatewayToServer operation.
   */
  createGateway(params: BackupGateway.Types.CreateGatewayInput, callback?: (err: AWSError, data: BackupGateway.Types.CreateGatewayOutput) => void): Request<BackupGateway.Types.CreateGatewayOutput, AWSError>;
  /**
   * Creates a backup gateway. After you create a gateway, you can associate it with a server using the AssociateGatewayToServer operation.
   */
  createGateway(callback?: (err: AWSError, data: BackupGateway.Types.CreateGatewayOutput) => void): Request<BackupGateway.Types.CreateGatewayOutput, AWSError>;
  /**
   * Deletes a backup gateway.
   */
  deleteGateway(params: BackupGateway.Types.DeleteGatewayInput, callback?: (err: AWSError, data: BackupGateway.Types.DeleteGatewayOutput) => void): Request<BackupGateway.Types.DeleteGatewayOutput, AWSError>;
  /**
   * Deletes a backup gateway.
   */
  deleteGateway(callback?: (err: AWSError, data: BackupGateway.Types.DeleteGatewayOutput) => void): Request<BackupGateway.Types.DeleteGatewayOutput, AWSError>;
  /**
   * Deletes a hypervisor.
   */
  deleteHypervisor(params: BackupGateway.Types.DeleteHypervisorInput, callback?: (err: AWSError, data: BackupGateway.Types.DeleteHypervisorOutput) => void): Request<BackupGateway.Types.DeleteHypervisorOutput, AWSError>;
  /**
   * Deletes a hypervisor.
   */
  deleteHypervisor(callback?: (err: AWSError, data: BackupGateway.Types.DeleteHypervisorOutput) => void): Request<BackupGateway.Types.DeleteHypervisorOutput, AWSError>;
  /**
   * Disassociates a backup gateway from the specified server. After the disassociation process finishes, the gateway can no longer access the virtual machines on the server.
   */
  disassociateGatewayFromServer(params: BackupGateway.Types.DisassociateGatewayFromServerInput, callback?: (err: AWSError, data: BackupGateway.Types.DisassociateGatewayFromServerOutput) => void): Request<BackupGateway.Types.DisassociateGatewayFromServerOutput, AWSError>;
  /**
   * Disassociates a backup gateway from the specified server. After the disassociation process finishes, the gateway can no longer access the virtual machines on the server.
   */
  disassociateGatewayFromServer(callback?: (err: AWSError, data: BackupGateway.Types.DisassociateGatewayFromServerOutput) => void): Request<BackupGateway.Types.DisassociateGatewayFromServerOutput, AWSError>;
  /**
   * Retrieves the bandwidth rate limit schedule for a specified gateway. By default, gateways do not have bandwidth rate limit schedules, which means no bandwidth rate limiting is in effect. Use this to get a gateway's bandwidth rate limit schedule.
   */
  getBandwidthRateLimitSchedule(params: BackupGateway.Types.GetBandwidthRateLimitScheduleInput, callback?: (err: AWSError, data: BackupGateway.Types.GetBandwidthRateLimitScheduleOutput) => void): Request<BackupGateway.Types.GetBandwidthRateLimitScheduleOutput, AWSError>;
  /**
   * Retrieves the bandwidth rate limit schedule for a specified gateway. By default, gateways do not have bandwidth rate limit schedules, which means no bandwidth rate limiting is in effect. Use this to get a gateway's bandwidth rate limit schedule.
   */
  getBandwidthRateLimitSchedule(callback?: (err: AWSError, data: BackupGateway.Types.GetBandwidthRateLimitScheduleOutput) => void): Request<BackupGateway.Types.GetBandwidthRateLimitScheduleOutput, AWSError>;
  /**
   * By providing the ARN (Amazon Resource Name), this API returns the gateway.
   */
  getGateway(params: BackupGateway.Types.GetGatewayInput, callback?: (err: AWSError, data: BackupGateway.Types.GetGatewayOutput) => void): Request<BackupGateway.Types.GetGatewayOutput, AWSError>;
  /**
   * By providing the ARN (Amazon Resource Name), this API returns the gateway.
   */
  getGateway(callback?: (err: AWSError, data: BackupGateway.Types.GetGatewayOutput) => void): Request<BackupGateway.Types.GetGatewayOutput, AWSError>;
  /**
   * This action requests information about the specified hypervisor to which the gateway will connect. A hypervisor is hardware, software, or firmware that creates and manages virtual machines, and allocates resources to them.
   */
  getHypervisor(params: BackupGateway.Types.GetHypervisorInput, callback?: (err: AWSError, data: BackupGateway.Types.GetHypervisorOutput) => void): Request<BackupGateway.Types.GetHypervisorOutput, AWSError>;
  /**
   * This action requests information about the specified hypervisor to which the gateway will connect. A hypervisor is hardware, software, or firmware that creates and manages virtual machines, and allocates resources to them.
   */
  getHypervisor(callback?: (err: AWSError, data: BackupGateway.Types.GetHypervisorOutput) => void): Request<BackupGateway.Types.GetHypervisorOutput, AWSError>;
  /**
   * This action retrieves the property mappings for the specified hypervisor. A hypervisor property mapping displays the relationship of entity properties available from the on-premises hypervisor to the properties available in Amazon Web Services.
   */
  getHypervisorPropertyMappings(params: BackupGateway.Types.GetHypervisorPropertyMappingsInput, callback?: (err: AWSError, data: BackupGateway.Types.GetHypervisorPropertyMappingsOutput) => void): Request<BackupGateway.Types.GetHypervisorPropertyMappingsOutput, AWSError>;
  /**
   * This action retrieves the property mappings for the specified hypervisor. A hypervisor property mapping displays the relationship of entity properties available from the on-premises hypervisor to the properties available in Amazon Web Services.
   */
  getHypervisorPropertyMappings(callback?: (err: AWSError, data: BackupGateway.Types.GetHypervisorPropertyMappingsOutput) => void): Request<BackupGateway.Types.GetHypervisorPropertyMappingsOutput, AWSError>;
  /**
   * By providing the ARN (Amazon Resource Name), this API returns the virtual machine.
   */
  getVirtualMachine(params: BackupGateway.Types.GetVirtualMachineInput, callback?: (err: AWSError, data: BackupGateway.Types.GetVirtualMachineOutput) => void): Request<BackupGateway.Types.GetVirtualMachineOutput, AWSError>;
  /**
   * By providing the ARN (Amazon Resource Name), this API returns the virtual machine.
   */
  getVirtualMachine(callback?: (err: AWSError, data: BackupGateway.Types.GetVirtualMachineOutput) => void): Request<BackupGateway.Types.GetVirtualMachineOutput, AWSError>;
  /**
   * Connect to a hypervisor by importing its configuration.
   */
  importHypervisorConfiguration(params: BackupGateway.Types.ImportHypervisorConfigurationInput, callback?: (err: AWSError, data: BackupGateway.Types.ImportHypervisorConfigurationOutput) => void): Request<BackupGateway.Types.ImportHypervisorConfigurationOutput, AWSError>;
  /**
   * Connect to a hypervisor by importing its configuration.
   */
  importHypervisorConfiguration(callback?: (err: AWSError, data: BackupGateway.Types.ImportHypervisorConfigurationOutput) => void): Request<BackupGateway.Types.ImportHypervisorConfigurationOutput, AWSError>;
  /**
   * Lists backup gateways owned by an Amazon Web Services account in an Amazon Web Services Region. The returned list is ordered by gateway Amazon Resource Name (ARN).
   */
  listGateways(params: BackupGateway.Types.ListGatewaysInput, callback?: (err: AWSError, data: BackupGateway.Types.ListGatewaysOutput) => void): Request<BackupGateway.Types.ListGatewaysOutput, AWSError>;
  /**
   * Lists backup gateways owned by an Amazon Web Services account in an Amazon Web Services Region. The returned list is ordered by gateway Amazon Resource Name (ARN).
   */
  listGateways(callback?: (err: AWSError, data: BackupGateway.Types.ListGatewaysOutput) => void): Request<BackupGateway.Types.ListGatewaysOutput, AWSError>;
  /**
   * Lists your hypervisors.
   */
  listHypervisors(params: BackupGateway.Types.ListHypervisorsInput, callback?: (err: AWSError, data: BackupGateway.Types.ListHypervisorsOutput) => void): Request<BackupGateway.Types.ListHypervisorsOutput, AWSError>;
  /**
   * Lists your hypervisors.
   */
  listHypervisors(callback?: (err: AWSError, data: BackupGateway.Types.ListHypervisorsOutput) => void): Request<BackupGateway.Types.ListHypervisorsOutput, AWSError>;
  /**
   * Lists the tags applied to the resource identified by its Amazon Resource Name (ARN).
   */
  listTagsForResource(params: BackupGateway.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: BackupGateway.Types.ListTagsForResourceOutput) => void): Request<BackupGateway.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Lists the tags applied to the resource identified by its Amazon Resource Name (ARN).
   */
  listTagsForResource(callback?: (err: AWSError, data: BackupGateway.Types.ListTagsForResourceOutput) => void): Request<BackupGateway.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Lists your virtual machines.
   */
  listVirtualMachines(params: BackupGateway.Types.ListVirtualMachinesInput, callback?: (err: AWSError, data: BackupGateway.Types.ListVirtualMachinesOutput) => void): Request<BackupGateway.Types.ListVirtualMachinesOutput, AWSError>;
  /**
   * Lists your virtual machines.
   */
  listVirtualMachines(callback?: (err: AWSError, data: BackupGateway.Types.ListVirtualMachinesOutput) => void): Request<BackupGateway.Types.ListVirtualMachinesOutput, AWSError>;
  /**
   * This action sets the bandwidth rate limit schedule for a specified gateway. By default, gateways do not have a bandwidth rate limit schedule, which means no bandwidth rate limiting is in effect. Use this to initiate a gateway's bandwidth rate limit schedule.
   */
  putBandwidthRateLimitSchedule(params: BackupGateway.Types.PutBandwidthRateLimitScheduleInput, callback?: (err: AWSError, data: BackupGateway.Types.PutBandwidthRateLimitScheduleOutput) => void): Request<BackupGateway.Types.PutBandwidthRateLimitScheduleOutput, AWSError>;
  /**
   * This action sets the bandwidth rate limit schedule for a specified gateway. By default, gateways do not have a bandwidth rate limit schedule, which means no bandwidth rate limiting is in effect. Use this to initiate a gateway's bandwidth rate limit schedule.
   */
  putBandwidthRateLimitSchedule(callback?: (err: AWSError, data: BackupGateway.Types.PutBandwidthRateLimitScheduleOutput) => void): Request<BackupGateway.Types.PutBandwidthRateLimitScheduleOutput, AWSError>;
  /**
   * This action sets the property mappings for the specified hypervisor. A hypervisor property mapping displays the relationship of entity properties available from the on-premises hypervisor to the properties available in Amazon Web Services.
   */
  putHypervisorPropertyMappings(params: BackupGateway.Types.PutHypervisorPropertyMappingsInput, callback?: (err: AWSError, data: BackupGateway.Types.PutHypervisorPropertyMappingsOutput) => void): Request<BackupGateway.Types.PutHypervisorPropertyMappingsOutput, AWSError>;
  /**
   * This action sets the property mappings for the specified hypervisor. A hypervisor property mapping displays the relationship of entity properties available from the on-premises hypervisor to the properties available in Amazon Web Services.
   */
  putHypervisorPropertyMappings(callback?: (err: AWSError, data: BackupGateway.Types.PutHypervisorPropertyMappingsOutput) => void): Request<BackupGateway.Types.PutHypervisorPropertyMappingsOutput, AWSError>;
  /**
   * Set the maintenance start time for a gateway.
   */
  putMaintenanceStartTime(params: BackupGateway.Types.PutMaintenanceStartTimeInput, callback?: (err: AWSError, data: BackupGateway.Types.PutMaintenanceStartTimeOutput) => void): Request<BackupGateway.Types.PutMaintenanceStartTimeOutput, AWSError>;
  /**
   * Set the maintenance start time for a gateway.
   */
  putMaintenanceStartTime(callback?: (err: AWSError, data: BackupGateway.Types.PutMaintenanceStartTimeOutput) => void): Request<BackupGateway.Types.PutMaintenanceStartTimeOutput, AWSError>;
  /**
   * This action sends a request to sync metadata across the specified virtual machines.
   */
  startVirtualMachinesMetadataSync(params: BackupGateway.Types.StartVirtualMachinesMetadataSyncInput, callback?: (err: AWSError, data: BackupGateway.Types.StartVirtualMachinesMetadataSyncOutput) => void): Request<BackupGateway.Types.StartVirtualMachinesMetadataSyncOutput, AWSError>;
  /**
   * This action sends a request to sync metadata across the specified virtual machines.
   */
  startVirtualMachinesMetadataSync(callback?: (err: AWSError, data: BackupGateway.Types.StartVirtualMachinesMetadataSyncOutput) => void): Request<BackupGateway.Types.StartVirtualMachinesMetadataSyncOutput, AWSError>;
  /**
   * Tag the resource.
   */
  tagResource(params: BackupGateway.Types.TagResourceInput, callback?: (err: AWSError, data: BackupGateway.Types.TagResourceOutput) => void): Request<BackupGateway.Types.TagResourceOutput, AWSError>;
  /**
   * Tag the resource.
   */
  tagResource(callback?: (err: AWSError, data: BackupGateway.Types.TagResourceOutput) => void): Request<BackupGateway.Types.TagResourceOutput, AWSError>;
  /**
   * Tests your hypervisor configuration to validate that backup gateway can connect with the hypervisor and its resources.
   */
  testHypervisorConfiguration(params: BackupGateway.Types.TestHypervisorConfigurationInput, callback?: (err: AWSError, data: BackupGateway.Types.TestHypervisorConfigurationOutput) => void): Request<BackupGateway.Types.TestHypervisorConfigurationOutput, AWSError>;
  /**
   * Tests your hypervisor configuration to validate that backup gateway can connect with the hypervisor and its resources.
   */
  testHypervisorConfiguration(callback?: (err: AWSError, data: BackupGateway.Types.TestHypervisorConfigurationOutput) => void): Request<BackupGateway.Types.TestHypervisorConfigurationOutput, AWSError>;
  /**
   * Removes tags from the resource.
   */
  untagResource(params: BackupGateway.Types.UntagResourceInput, callback?: (err: AWSError, data: BackupGateway.Types.UntagResourceOutput) => void): Request<BackupGateway.Types.UntagResourceOutput, AWSError>;
  /**
   * Removes tags from the resource.
   */
  untagResource(callback?: (err: AWSError, data: BackupGateway.Types.UntagResourceOutput) => void): Request<BackupGateway.Types.UntagResourceOutput, AWSError>;
  /**
   * Updates a gateway's name. Specify which gateway to update using the Amazon Resource Name (ARN) of the gateway in your request.
   */
  updateGatewayInformation(params: BackupGateway.Types.UpdateGatewayInformationInput, callback?: (err: AWSError, data: BackupGateway.Types.UpdateGatewayInformationOutput) => void): Request<BackupGateway.Types.UpdateGatewayInformationOutput, AWSError>;
  /**
   * Updates a gateway's name. Specify which gateway to update using the Amazon Resource Name (ARN) of the gateway in your request.
   */
  updateGatewayInformation(callback?: (err: AWSError, data: BackupGateway.Types.UpdateGatewayInformationOutput) => void): Request<BackupGateway.Types.UpdateGatewayInformationOutput, AWSError>;
  /**
   * Updates the gateway virtual machine (VM) software. The request immediately triggers the software update.  When you make this request, you get a 200 OK success response immediately. However, it might take some time for the update to complete. 
   */
  updateGatewaySoftwareNow(params: BackupGateway.Types.UpdateGatewaySoftwareNowInput, callback?: (err: AWSError, data: BackupGateway.Types.UpdateGatewaySoftwareNowOutput) => void): Request<BackupGateway.Types.UpdateGatewaySoftwareNowOutput, AWSError>;
  /**
   * Updates the gateway virtual machine (VM) software. The request immediately triggers the software update.  When you make this request, you get a 200 OK success response immediately. However, it might take some time for the update to complete. 
   */
  updateGatewaySoftwareNow(callback?: (err: AWSError, data: BackupGateway.Types.UpdateGatewaySoftwareNowOutput) => void): Request<BackupGateway.Types.UpdateGatewaySoftwareNowOutput, AWSError>;
  /**
   * Updates a hypervisor metadata, including its host, username, and password. Specify which hypervisor to update using the Amazon Resource Name (ARN) of the hypervisor in your request.
   */
  updateHypervisor(params: BackupGateway.Types.UpdateHypervisorInput, callback?: (err: AWSError, data: BackupGateway.Types.UpdateHypervisorOutput) => void): Request<BackupGateway.Types.UpdateHypervisorOutput, AWSError>;
  /**
   * Updates a hypervisor metadata, including its host, username, and password. Specify which hypervisor to update using the Amazon Resource Name (ARN) of the hypervisor in your request.
   */
  updateHypervisor(callback?: (err: AWSError, data: BackupGateway.Types.UpdateHypervisorOutput) => void): Request<BackupGateway.Types.UpdateHypervisorOutput, AWSError>;
}
declare namespace BackupGateway {
  export type ActivationKey = string;
  export interface AssociateGatewayToServerInput {
    /**
     * The Amazon Resource Name (ARN) of the gateway. Use the ListGateways operation to return a list of gateways for your account and Amazon Web Services Region.
     */
    GatewayArn: GatewayArn;
    /**
     * The Amazon Resource Name (ARN) of the server that hosts your virtual machines.
     */
    ServerArn: ServerArn;
  }
  export interface AssociateGatewayToServerOutput {
    /**
     * The Amazon Resource Name (ARN) of a gateway.
     */
    GatewayArn?: GatewayArn;
  }
  export type AverageUploadRateLimit = number;
  export interface BandwidthRateLimitInterval {
    /**
     * The average upload rate limit component of the bandwidth rate limit interval, in bits per second. This field does not appear in the response if the upload rate limit is not set.  For Backup Gateway, the minimum value is (Value). 
     */
    AverageUploadRateLimitInBitsPerSec?: AverageUploadRateLimit;
    /**
     * The days of the week component of the bandwidth rate limit interval, represented as ordinal numbers from 0 to 6, where 0 represents Sunday and 6 represents Saturday.
     */
    DaysOfWeek: DaysOfWeek;
    /**
     * The hour of the day to end the bandwidth rate limit interval.
     */
    EndHourOfDay: HourOfDay;
    /**
     * The minute of the hour to end the bandwidth rate limit interval.  The bandwidth rate limit interval ends at the end of the minute. To end an interval at the end of an hour, use the value 59. 
     */
    EndMinuteOfHour: MinuteOfHour;
    /**
     * The hour of the day to start the bandwidth rate limit interval.
     */
    StartHourOfDay: HourOfDay;
    /**
     * The minute of the hour to start the bandwidth rate limit interval. The interval begins at the start of that minute. To begin an interval exactly at the start of the hour, use the value 0.
     */
    StartMinuteOfHour: MinuteOfHour;
  }
  export type BandwidthRateLimitIntervals = BandwidthRateLimitInterval[];
  export interface CreateGatewayInput {
    /**
     * The activation key of the created gateway.
     */
    ActivationKey: ActivationKey;
    /**
     * The display name of the created gateway.
     */
    GatewayDisplayName: Name;
    /**
     * The type of created gateway.
     */
    GatewayType: GatewayType;
    /**
     * A list of up to 50 tags to assign to the gateway. Each tag is a key-value pair.
     */
    Tags?: Tags;
  }
  export interface CreateGatewayOutput {
    /**
     * The Amazon Resource Name (ARN) of the gateway you create.
     */
    GatewayArn?: GatewayArn;
  }
  export type DayOfMonth = number;
  export type DayOfWeek = number;
  export type DaysOfWeek = DayOfWeek[];
  export interface DeleteGatewayInput {
    /**
     * The Amazon Resource Name (ARN) of the gateway to delete.
     */
    GatewayArn: GatewayArn;
  }
  export interface DeleteGatewayOutput {
    /**
     * The Amazon Resource Name (ARN) of the gateway you deleted.
     */
    GatewayArn?: GatewayArn;
  }
  export interface DeleteHypervisorInput {
    /**
     * The Amazon Resource Name (ARN) of the hypervisor to delete.
     */
    HypervisorArn: ServerArn;
  }
  export interface DeleteHypervisorOutput {
    /**
     * The Amazon Resource Name (ARN) of the hypervisor you deleted.
     */
    HypervisorArn?: ServerArn;
  }
  export interface DisassociateGatewayFromServerInput {
    /**
     * The Amazon Resource Name (ARN) of the gateway to disassociate.
     */
    GatewayArn: GatewayArn;
  }
  export interface DisassociateGatewayFromServerOutput {
    /**
     * The Amazon Resource Name (ARN) of the gateway you disassociated.
     */
    GatewayArn?: GatewayArn;
  }
  export interface Gateway {
    /**
     * The Amazon Resource Name (ARN) of the gateway. Use the ListGateways operation to return a list of gateways for your account and Amazon Web Services Region.
     */
    GatewayArn?: GatewayArn;
    /**
     * The display name of the gateway.
     */
    GatewayDisplayName?: Name;
    /**
     * The type of the gateway.
     */
    GatewayType?: GatewayType;
    /**
     * The hypervisor ID of the gateway.
     */
    HypervisorId?: HypervisorId;
    /**
     * The last time Backup gateway communicated with the gateway, in Unix format and UTC time.
     */
    LastSeenTime?: Time;
  }
  export type GatewayArn = string;
  export interface GatewayDetails {
    /**
     * The Amazon Resource Name (ARN) of the gateway. Use the ListGateways operation to return a list of gateways for your account and Amazon Web Services Region.
     */
    GatewayArn?: GatewayArn;
    /**
     * The display name of the gateway.
     */
    GatewayDisplayName?: Name;
    /**
     * The type of the gateway type.
     */
    GatewayType?: GatewayType;
    /**
     * The hypervisor ID of the gateway.
     */
    HypervisorId?: HypervisorId;
    /**
     * Details showing the last time Backup gateway communicated with the cloud, in Unix format and UTC time.
     */
    LastSeenTime?: Time;
    /**
     * Returns your gateway's weekly maintenance start time including the day and time of the week. Note that values are in terms of the gateway's time zone. Can be weekly or monthly.
     */
    MaintenanceStartTime?: MaintenanceStartTime;
    /**
     * Details showing the next update availability time of the gateway.
     */
    NextUpdateAvailabilityTime?: Time;
    /**
     * The DNS name for the virtual private cloud (VPC) endpoint the gateway uses to connect to the cloud for backup gateway.
     */
    VpcEndpoint?: VpcEndpoint;
  }
  export type GatewayType = "BACKUP_VM"|string;
  export type Gateways = Gateway[];
  export interface GetBandwidthRateLimitScheduleInput {
    /**
     * The Amazon Resource Name (ARN) of the gateway. Use the  ListGateways  operation to return a list of gateways for your account and Amazon Web Services Region.
     */
    GatewayArn: GatewayArn;
  }
  export interface GetBandwidthRateLimitScheduleOutput {
    /**
     * An array containing bandwidth rate limit schedule intervals for a gateway. When no bandwidth rate limit intervals have been scheduled, the array is empty.
     */
    BandwidthRateLimitIntervals?: BandwidthRateLimitIntervals;
    /**
     * The Amazon Resource Name (ARN) of the gateway. Use the  ListGateways  operation to return a list of gateways for your account and Amazon Web Services Region.
     */
    GatewayArn?: GatewayArn;
  }
  export interface GetGatewayInput {
    /**
     * The Amazon Resource Name (ARN) of the gateway.
     */
    GatewayArn: GatewayArn;
  }
  export interface GetGatewayOutput {
    /**
     * By providing the ARN (Amazon Resource Name), this API returns the gateway.
     */
    Gateway?: GatewayDetails;
  }
  export interface GetHypervisorInput {
    /**
     * The Amazon Resource Name (ARN) of the hypervisor.
     */
    HypervisorArn: ServerArn;
  }
  export interface GetHypervisorOutput {
    /**
     * Details about the requested hypervisor.
     */
    Hypervisor?: HypervisorDetails;
  }
  export interface GetHypervisorPropertyMappingsInput {
    /**
     * The Amazon Resource Name (ARN) of the hypervisor.
     */
    HypervisorArn: ServerArn;
  }
  export interface GetHypervisorPropertyMappingsOutput {
    /**
     * The Amazon Resource Name (ARN) of the hypervisor.
     */
    HypervisorArn?: ServerArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM role.
     */
    IamRoleArn?: IamRoleArn;
    /**
     * This is a display of the mappings of on-premises VMware tags to the Amazon Web Services tags.
     */
    VmwareToAwsTagMappings?: VmwareToAwsTagMappings;
  }
  export interface GetVirtualMachineInput {
    /**
     * The Amazon Resource Name (ARN) of the virtual machine.
     */
    ResourceArn: ResourceArn;
  }
  export interface GetVirtualMachineOutput {
    /**
     * This object contains the basic attributes of VirtualMachine contained by the output of GetVirtualMachine 
     */
    VirtualMachine?: VirtualMachineDetails;
  }
  export type Host = string;
  export type HourOfDay = number;
  export interface Hypervisor {
    /**
     * The server host of the hypervisor. This can be either an IP address or a fully-qualified domain name (FQDN).
     */
    Host?: Host;
    /**
     * The Amazon Resource Name (ARN) of the hypervisor.
     */
    HypervisorArn?: ServerArn;
    /**
     * The Amazon Resource Name (ARN) of the Key Management Service used to encrypt the hypervisor.
     */
    KmsKeyArn?: KmsKeyArn;
    /**
     * The name of the hypervisor.
     */
    Name?: Name;
    /**
     * The state of the hypervisor.
     */
    State?: HypervisorState;
  }
  export interface HypervisorDetails {
    /**
     * The server host of the hypervisor. This can be either an IP address or a fully-qualified domain name (FQDN).
     */
    Host?: Host;
    /**
     * The Amazon Resource Name (ARN) of the hypervisor.
     */
    HypervisorArn?: ServerArn;
    /**
     * The Amazon Resource Name (ARN) of the KMS used to encrypt the hypervisor.
     */
    KmsKeyArn?: KmsKeyArn;
    /**
     * This is the time when the most recent successful sync of metadata occurred.
     */
    LastSuccessfulMetadataSyncTime?: Time;
    /**
     * This is the most recent status for the indicated metadata sync.
     */
    LatestMetadataSyncStatus?: SyncMetadataStatus;
    /**
     * This is the most recent status for the indicated metadata sync.
     */
    LatestMetadataSyncStatusMessage?: string;
    /**
     * The Amazon Resource Name (ARN) of the group of gateways within the requested log.
     */
    LogGroupArn?: LogGroupArn;
    /**
     * This is the name of the specified hypervisor.
     */
    Name?: Name;
    /**
     * This is the current state of the specified hypervisor. The possible states are PENDING, ONLINE, OFFLINE, or ERROR.
     */
    State?: HypervisorState;
  }
  export type HypervisorId = string;
  export type HypervisorState = "PENDING"|"ONLINE"|"OFFLINE"|"ERROR"|string;
  export type Hypervisors = Hypervisor[];
  export type IamRoleArn = string;
  export interface ImportHypervisorConfigurationInput {
    /**
     * The server host of the hypervisor. This can be either an IP address or a fully-qualified domain name (FQDN).
     */
    Host: Host;
    /**
     * The Key Management Service for the hypervisor.
     */
    KmsKeyArn?: KmsKeyArn;
    /**
     * The name of the hypervisor.
     */
    Name: Name;
    /**
     * The password for the hypervisor.
     */
    Password?: Password;
    /**
     * The tags of the hypervisor configuration to import.
     */
    Tags?: Tags;
    /**
     * The username for the hypervisor.
     */
    Username?: Username;
  }
  export interface ImportHypervisorConfigurationOutput {
    /**
     * The Amazon Resource Name (ARN) of the hypervisor you disassociated.
     */
    HypervisorArn?: ServerArn;
  }
  export type KmsKeyArn = string;
  export interface ListGatewaysInput {
    /**
     * The maximum number of gateways to list.
     */
    MaxResults?: MaxResults;
    /**
     * The next item following a partial list of returned resources. For example, if a request is made to return MaxResults number of resources, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: NextToken;
  }
  export interface ListGatewaysOutput {
    /**
     * A list of your gateways.
     */
    Gateways?: Gateways;
    /**
     * The next item following a partial list of returned resources. For example, if a request is made to return maxResults number of resources, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: NextToken;
  }
  export interface ListHypervisorsInput {
    /**
     * The maximum number of hypervisors to list.
     */
    MaxResults?: MaxResults;
    /**
     * The next item following a partial list of returned resources. For example, if a request is made to return maxResults number of resources, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: NextToken;
  }
  export interface ListHypervisorsOutput {
    /**
     * A list of your Hypervisor objects, ordered by their Amazon Resource Names (ARNs).
     */
    Hypervisors?: Hypervisors;
    /**
     * The next item following a partial list of returned resources. For example, if a request is made to return maxResults number of resources, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the resource's tags to list.
     */
    ResourceArn: ResourceArn;
  }
  export interface ListTagsForResourceOutput {
    /**
     * The Amazon Resource Name (ARN) of the resource's tags that you listed.
     */
    ResourceArn?: ResourceArn;
    /**
     * A list of the resource's tags.
     */
    Tags?: Tags;
  }
  export interface ListVirtualMachinesInput {
    /**
     * The Amazon Resource Name (ARN) of the hypervisor connected to your virtual machine.
     */
    HypervisorArn?: ServerArn;
    /**
     * The maximum number of virtual machines to list.
     */
    MaxResults?: MaxResults;
    /**
     * The next item following a partial list of returned resources. For example, if a request is made to return maxResults number of resources, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: NextToken;
  }
  export interface ListVirtualMachinesOutput {
    /**
     * The next item following a partial list of returned resources. For example, if a request is made to return maxResults number of resources, NextToken allows you to return more items in your list starting at the location pointed to by the next token.
     */
    NextToken?: NextToken;
    /**
     * A list of your VirtualMachine objects, ordered by their Amazon Resource Names (ARNs).
     */
    VirtualMachines?: VirtualMachines;
  }
  export type LogGroupArn = string;
  export interface MaintenanceStartTime {
    /**
     * The day of the month component of the maintenance start time represented as an ordinal number from 1 to 28, where 1 represents the first day of the month and 28 represents the last day of the month.
     */
    DayOfMonth?: DayOfMonth;
    /**
     * An ordinal number between 0 and 6 that represents the day of the week, where 0 represents Sunday and 6 represents Saturday. The day of week is in the time zone of the gateway.
     */
    DayOfWeek?: DayOfWeek;
    /**
     * The hour component of the maintenance start time represented as hh, where hh is the hour (0 to 23). The hour of the day is in the time zone of the gateway.
     */
    HourOfDay: HourOfDay;
    /**
     * The minute component of the maintenance start time represented as mm, where mm is the minute (0 to 59). The minute of the hour is in the time zone of the gateway.
     */
    MinuteOfHour: MinuteOfHour;
  }
  export type MaxResults = number;
  export type MinuteOfHour = number;
  export type Name = string;
  export type NextToken = string;
  export type Password = string;
  export type Path = string;
  export interface PutBandwidthRateLimitScheduleInput {
    /**
     * An array containing bandwidth rate limit schedule intervals for a gateway. When no bandwidth rate limit intervals have been scheduled, the array is empty.
     */
    BandwidthRateLimitIntervals: BandwidthRateLimitIntervals;
    /**
     * The Amazon Resource Name (ARN) of the gateway. Use the  ListGateways  operation to return a list of gateways for your account and Amazon Web Services Region.
     */
    GatewayArn: GatewayArn;
  }
  export interface PutBandwidthRateLimitScheduleOutput {
    /**
     * The Amazon Resource Name (ARN) of the gateway. Use the  ListGateways  operation to return a list of gateways for your account and Amazon Web Services Region.
     */
    GatewayArn?: GatewayArn;
  }
  export interface PutHypervisorPropertyMappingsInput {
    /**
     * The Amazon Resource Name (ARN) of the hypervisor.
     */
    HypervisorArn: ServerArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM role.
     */
    IamRoleArn: IamRoleArn;
    /**
     * This action requests the mappings of on-premises VMware tags to the Amazon Web Services tags.
     */
    VmwareToAwsTagMappings: VmwareToAwsTagMappings;
  }
  export interface PutHypervisorPropertyMappingsOutput {
    /**
     * The Amazon Resource Name (ARN) of the hypervisor.
     */
    HypervisorArn?: ServerArn;
  }
  export interface PutMaintenanceStartTimeInput {
    /**
     * The day of the month start maintenance on a gateway. Valid values range from Sunday to Saturday.
     */
    DayOfMonth?: DayOfMonth;
    /**
     * The day of the week to start maintenance on a gateway.
     */
    DayOfWeek?: DayOfWeek;
    /**
     * The Amazon Resource Name (ARN) for the gateway, used to specify its maintenance start time.
     */
    GatewayArn: GatewayArn;
    /**
     * The hour of the day to start maintenance on a gateway.
     */
    HourOfDay: HourOfDay;
    /**
     * The minute of the hour to start maintenance on a gateway.
     */
    MinuteOfHour: MinuteOfHour;
  }
  export interface PutMaintenanceStartTimeOutput {
    /**
     * The Amazon Resource Name (ARN) of a gateway for which you set the maintenance start time.
     */
    GatewayArn?: GatewayArn;
  }
  export type ResourceArn = string;
  export type ServerArn = string;
  export interface StartVirtualMachinesMetadataSyncInput {
    /**
     * The Amazon Resource Name (ARN) of the hypervisor.
     */
    HypervisorArn: ServerArn;
  }
  export interface StartVirtualMachinesMetadataSyncOutput {
    /**
     * The Amazon Resource Name (ARN) of the hypervisor.
     */
    HypervisorArn?: ServerArn;
  }
  export type SyncMetadataStatus = "CREATED"|"RUNNING"|"FAILED"|"PARTIALLY_FAILED"|"SUCCEEDED"|string;
  export interface Tag {
    /**
     * The key part of a tag's key-value pair. The key can't start with aws:.
     */
    Key: TagKey;
    /**
     * The value part of a tag's key-value pair.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export interface TagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the resource to tag.
     */
    ResourceARN: ResourceArn;
    /**
     * A list of tags to assign to the resource.
     */
    Tags: Tags;
  }
  export interface TagResourceOutput {
    /**
     * The Amazon Resource Name (ARN) of the resource you tagged.
     */
    ResourceARN?: ResourceArn;
  }
  export type TagValue = string;
  export type Tags = Tag[];
  export interface TestHypervisorConfigurationInput {
    /**
     * The Amazon Resource Name (ARN) of the gateway to the hypervisor to test.
     */
    GatewayArn: GatewayArn;
    /**
     * The server host of the hypervisor. This can be either an IP address or a fully-qualified domain name (FQDN).
     */
    Host: Host;
    /**
     * The password for the hypervisor.
     */
    Password?: Password;
    /**
     * The username for the hypervisor.
     */
    Username?: Username;
  }
  export interface TestHypervisorConfigurationOutput {
  }
  export type Time = Date;
  export interface UntagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the resource from which to remove tags.
     */
    ResourceARN: ResourceArn;
    /**
     * The list of tag keys specifying which tags to remove.
     */
    TagKeys: TagKeys;
  }
  export interface UntagResourceOutput {
    /**
     * The Amazon Resource Name (ARN) of the resource from which you removed tags.
     */
    ResourceARN?: ResourceArn;
  }
  export interface UpdateGatewayInformationInput {
    /**
     * The Amazon Resource Name (ARN) of the gateway to update.
     */
    GatewayArn: GatewayArn;
    /**
     * The updated display name of the gateway.
     */
    GatewayDisplayName?: Name;
  }
  export interface UpdateGatewayInformationOutput {
    /**
     * The Amazon Resource Name (ARN) of the gateway you updated.
     */
    GatewayArn?: GatewayArn;
  }
  export interface UpdateGatewaySoftwareNowInput {
    /**
     * The Amazon Resource Name (ARN) of the gateway to be updated.
     */
    GatewayArn: GatewayArn;
  }
  export interface UpdateGatewaySoftwareNowOutput {
    /**
     * The Amazon Resource Name (ARN) of the gateway you updated.
     */
    GatewayArn?: GatewayArn;
  }
  export interface UpdateHypervisorInput {
    /**
     * The updated host of the hypervisor. This can be either an IP address or a fully-qualified domain name (FQDN).
     */
    Host?: Host;
    /**
     * The Amazon Resource Name (ARN) of the hypervisor to update.
     */
    HypervisorArn: ServerArn;
    /**
     * The Amazon Resource Name (ARN) of the group of gateways within the requested log.
     */
    LogGroupArn?: LogGroupArn;
    /**
     * The updated name for the hypervisor
     */
    Name?: Name;
    /**
     * The updated password for the hypervisor.
     */
    Password?: Password;
    /**
     * The updated username for the hypervisor.
     */
    Username?: Username;
  }
  export interface UpdateHypervisorOutput {
    /**
     * The Amazon Resource Name (ARN) of the hypervisor you updated.
     */
    HypervisorArn?: ServerArn;
  }
  export type Username = string;
  export interface VirtualMachine {
    /**
     * The host name of the virtual machine.
     */
    HostName?: Name;
    /**
     * The ID of the virtual machine's hypervisor.
     */
    HypervisorId?: string;
    /**
     * The most recent date a virtual machine was backed up, in Unix format and UTC time.
     */
    LastBackupDate?: Time;
    /**
     * The name of the virtual machine.
     */
    Name?: Name;
    /**
     * The path of the virtual machine.
     */
    Path?: Path;
    /**
     * The Amazon Resource Name (ARN) of the virtual machine. For example, arn:aws:backup-gateway:us-west-1:0000000000000:vm/vm-0000ABCDEFGIJKL.
     */
    ResourceArn?: ResourceArn;
  }
  export interface VirtualMachineDetails {
    /**
     * The host name of the virtual machine.
     */
    HostName?: Name;
    /**
     * The ID of the virtual machine's hypervisor.
     */
    HypervisorId?: string;
    /**
     * The most recent date a virtual machine was backed up, in Unix format and UTC time.
     */
    LastBackupDate?: Time;
    /**
     * The name of the virtual machine.
     */
    Name?: Name;
    /**
     * The path of the virtual machine.
     */
    Path?: Path;
    /**
     * The Amazon Resource Name (ARN) of the virtual machine. For example, arn:aws:backup-gateway:us-west-1:0000000000000:vm/vm-0000ABCDEFGIJKL.
     */
    ResourceArn?: ResourceArn;
    /**
     * These are the details of the VMware tags associated with the specified virtual machine.
     */
    VmwareTags?: VmwareTags;
  }
  export type VirtualMachines = VirtualMachine[];
  export type VmwareCategory = string;
  export interface VmwareTag {
    /**
     * The is the category of VMware.
     */
    VmwareCategory?: VmwareCategory;
    /**
     * This is a user-defined description of a VMware tag.
     */
    VmwareTagDescription?: string;
    /**
     * This is the user-defined name of a VMware tag.
     */
    VmwareTagName?: VmwareTagName;
  }
  export type VmwareTagName = string;
  export type VmwareTags = VmwareTag[];
  export interface VmwareToAwsTagMapping {
    /**
     * The key part of the Amazon Web Services tag's key-value pair.
     */
    AwsTagKey: TagKey;
    /**
     * The value part of the Amazon Web Services tag's key-value pair.
     */
    AwsTagValue: TagValue;
    /**
     * The is the category of VMware.
     */
    VmwareCategory: VmwareCategory;
    /**
     * This is the user-defined name of a VMware tag.
     */
    VmwareTagName: VmwareTagName;
  }
  export type VmwareToAwsTagMappings = VmwareToAwsTagMapping[];
  export type VpcEndpoint = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-01-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the BackupGateway client.
   */
  export import Types = BackupGateway;
}
export = BackupGateway;
