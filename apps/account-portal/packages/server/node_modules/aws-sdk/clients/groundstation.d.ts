import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class GroundStation extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: GroundStation.Types.ClientConfiguration)
  config: Config & GroundStation.Types.ClientConfiguration;
  /**
   * Cancels a contact with a specified contact ID.
   */
  cancelContact(params: GroundStation.Types.CancelContactRequest, callback?: (err: AWSError, data: GroundStation.Types.ContactIdResponse) => void): Request<GroundStation.Types.ContactIdResponse, AWSError>;
  /**
   * Cancels a contact with a specified contact ID.
   */
  cancelContact(callback?: (err: AWSError, data: GroundStation.Types.ContactIdResponse) => void): Request<GroundStation.Types.ContactIdResponse, AWSError>;
  /**
   * Creates a Config with the specified configData parameters. Only one type of configData can be specified.
   */
  createConfig(params: GroundStation.Types.CreateConfigRequest, callback?: (err: AWSError, data: GroundStation.Types.ConfigIdResponse) => void): Request<GroundStation.Types.ConfigIdResponse, AWSError>;
  /**
   * Creates a Config with the specified configData parameters. Only one type of configData can be specified.
   */
  createConfig(callback?: (err: AWSError, data: GroundStation.Types.ConfigIdResponse) => void): Request<GroundStation.Types.ConfigIdResponse, AWSError>;
  /**
   * Creates a DataflowEndpoint group containing the specified list of DataflowEndpoint objects. The name field in each endpoint is used in your mission profile DataflowEndpointConfig to specify which endpoints to use during a contact. When a contact uses multiple DataflowEndpointConfig objects, each Config must match a DataflowEndpoint in the same group.
   */
  createDataflowEndpointGroup(params: GroundStation.Types.CreateDataflowEndpointGroupRequest, callback?: (err: AWSError, data: GroundStation.Types.DataflowEndpointGroupIdResponse) => void): Request<GroundStation.Types.DataflowEndpointGroupIdResponse, AWSError>;
  /**
   * Creates a DataflowEndpoint group containing the specified list of DataflowEndpoint objects. The name field in each endpoint is used in your mission profile DataflowEndpointConfig to specify which endpoints to use during a contact. When a contact uses multiple DataflowEndpointConfig objects, each Config must match a DataflowEndpoint in the same group.
   */
  createDataflowEndpointGroup(callback?: (err: AWSError, data: GroundStation.Types.DataflowEndpointGroupIdResponse) => void): Request<GroundStation.Types.DataflowEndpointGroupIdResponse, AWSError>;
  /**
   * Creates an Ephemeris with the specified EphemerisData.
   */
  createEphemeris(params: GroundStation.Types.CreateEphemerisRequest, callback?: (err: AWSError, data: GroundStation.Types.EphemerisIdResponse) => void): Request<GroundStation.Types.EphemerisIdResponse, AWSError>;
  /**
   * Creates an Ephemeris with the specified EphemerisData.
   */
  createEphemeris(callback?: (err: AWSError, data: GroundStation.Types.EphemerisIdResponse) => void): Request<GroundStation.Types.EphemerisIdResponse, AWSError>;
  /**
   * Creates a mission profile.  dataflowEdges is a list of lists of strings. Each lower level list of strings has two elements: a from ARN and a to ARN.
   */
  createMissionProfile(params: GroundStation.Types.CreateMissionProfileRequest, callback?: (err: AWSError, data: GroundStation.Types.MissionProfileIdResponse) => void): Request<GroundStation.Types.MissionProfileIdResponse, AWSError>;
  /**
   * Creates a mission profile.  dataflowEdges is a list of lists of strings. Each lower level list of strings has two elements: a from ARN and a to ARN.
   */
  createMissionProfile(callback?: (err: AWSError, data: GroundStation.Types.MissionProfileIdResponse) => void): Request<GroundStation.Types.MissionProfileIdResponse, AWSError>;
  /**
   * Deletes a Config.
   */
  deleteConfig(params: GroundStation.Types.DeleteConfigRequest, callback?: (err: AWSError, data: GroundStation.Types.ConfigIdResponse) => void): Request<GroundStation.Types.ConfigIdResponse, AWSError>;
  /**
   * Deletes a Config.
   */
  deleteConfig(callback?: (err: AWSError, data: GroundStation.Types.ConfigIdResponse) => void): Request<GroundStation.Types.ConfigIdResponse, AWSError>;
  /**
   * Deletes a dataflow endpoint group.
   */
  deleteDataflowEndpointGroup(params: GroundStation.Types.DeleteDataflowEndpointGroupRequest, callback?: (err: AWSError, data: GroundStation.Types.DataflowEndpointGroupIdResponse) => void): Request<GroundStation.Types.DataflowEndpointGroupIdResponse, AWSError>;
  /**
   * Deletes a dataflow endpoint group.
   */
  deleteDataflowEndpointGroup(callback?: (err: AWSError, data: GroundStation.Types.DataflowEndpointGroupIdResponse) => void): Request<GroundStation.Types.DataflowEndpointGroupIdResponse, AWSError>;
  /**
   * Deletes an ephemeris
   */
  deleteEphemeris(params: GroundStation.Types.DeleteEphemerisRequest, callback?: (err: AWSError, data: GroundStation.Types.EphemerisIdResponse) => void): Request<GroundStation.Types.EphemerisIdResponse, AWSError>;
  /**
   * Deletes an ephemeris
   */
  deleteEphemeris(callback?: (err: AWSError, data: GroundStation.Types.EphemerisIdResponse) => void): Request<GroundStation.Types.EphemerisIdResponse, AWSError>;
  /**
   * Deletes a mission profile.
   */
  deleteMissionProfile(params: GroundStation.Types.DeleteMissionProfileRequest, callback?: (err: AWSError, data: GroundStation.Types.MissionProfileIdResponse) => void): Request<GroundStation.Types.MissionProfileIdResponse, AWSError>;
  /**
   * Deletes a mission profile.
   */
  deleteMissionProfile(callback?: (err: AWSError, data: GroundStation.Types.MissionProfileIdResponse) => void): Request<GroundStation.Types.MissionProfileIdResponse, AWSError>;
  /**
   * Describes an existing contact.
   */
  describeContact(params: GroundStation.Types.DescribeContactRequest, callback?: (err: AWSError, data: GroundStation.Types.DescribeContactResponse) => void): Request<GroundStation.Types.DescribeContactResponse, AWSError>;
  /**
   * Describes an existing contact.
   */
  describeContact(callback?: (err: AWSError, data: GroundStation.Types.DescribeContactResponse) => void): Request<GroundStation.Types.DescribeContactResponse, AWSError>;
  /**
   * Describes an existing ephemeris.
   */
  describeEphemeris(params: GroundStation.Types.DescribeEphemerisRequest, callback?: (err: AWSError, data: GroundStation.Types.DescribeEphemerisResponse) => void): Request<GroundStation.Types.DescribeEphemerisResponse, AWSError>;
  /**
   * Describes an existing ephemeris.
   */
  describeEphemeris(callback?: (err: AWSError, data: GroundStation.Types.DescribeEphemerisResponse) => void): Request<GroundStation.Types.DescribeEphemerisResponse, AWSError>;
  /**
   *   For use by AWS Ground Station Agent and shouldn't be called directly.  Gets the latest configuration information for a registered agent.
   */
  getAgentConfiguration(params: GroundStation.Types.GetAgentConfigurationRequest, callback?: (err: AWSError, data: GroundStation.Types.GetAgentConfigurationResponse) => void): Request<GroundStation.Types.GetAgentConfigurationResponse, AWSError>;
  /**
   *   For use by AWS Ground Station Agent and shouldn't be called directly.  Gets the latest configuration information for a registered agent.
   */
  getAgentConfiguration(callback?: (err: AWSError, data: GroundStation.Types.GetAgentConfigurationResponse) => void): Request<GroundStation.Types.GetAgentConfigurationResponse, AWSError>;
  /**
   * Returns Config information. Only one Config response can be returned.
   */
  getConfig(params: GroundStation.Types.GetConfigRequest, callback?: (err: AWSError, data: GroundStation.Types.GetConfigResponse) => void): Request<GroundStation.Types.GetConfigResponse, AWSError>;
  /**
   * Returns Config information. Only one Config response can be returned.
   */
  getConfig(callback?: (err: AWSError, data: GroundStation.Types.GetConfigResponse) => void): Request<GroundStation.Types.GetConfigResponse, AWSError>;
  /**
   * Returns the dataflow endpoint group.
   */
  getDataflowEndpointGroup(params: GroundStation.Types.GetDataflowEndpointGroupRequest, callback?: (err: AWSError, data: GroundStation.Types.GetDataflowEndpointGroupResponse) => void): Request<GroundStation.Types.GetDataflowEndpointGroupResponse, AWSError>;
  /**
   * Returns the dataflow endpoint group.
   */
  getDataflowEndpointGroup(callback?: (err: AWSError, data: GroundStation.Types.GetDataflowEndpointGroupResponse) => void): Request<GroundStation.Types.GetDataflowEndpointGroupResponse, AWSError>;
  /**
   * Returns the number of reserved minutes used by account.
   */
  getMinuteUsage(params: GroundStation.Types.GetMinuteUsageRequest, callback?: (err: AWSError, data: GroundStation.Types.GetMinuteUsageResponse) => void): Request<GroundStation.Types.GetMinuteUsageResponse, AWSError>;
  /**
   * Returns the number of reserved minutes used by account.
   */
  getMinuteUsage(callback?: (err: AWSError, data: GroundStation.Types.GetMinuteUsageResponse) => void): Request<GroundStation.Types.GetMinuteUsageResponse, AWSError>;
  /**
   * Returns a mission profile.
   */
  getMissionProfile(params: GroundStation.Types.GetMissionProfileRequest, callback?: (err: AWSError, data: GroundStation.Types.GetMissionProfileResponse) => void): Request<GroundStation.Types.GetMissionProfileResponse, AWSError>;
  /**
   * Returns a mission profile.
   */
  getMissionProfile(callback?: (err: AWSError, data: GroundStation.Types.GetMissionProfileResponse) => void): Request<GroundStation.Types.GetMissionProfileResponse, AWSError>;
  /**
   * Returns a satellite.
   */
  getSatellite(params: GroundStation.Types.GetSatelliteRequest, callback?: (err: AWSError, data: GroundStation.Types.GetSatelliteResponse) => void): Request<GroundStation.Types.GetSatelliteResponse, AWSError>;
  /**
   * Returns a satellite.
   */
  getSatellite(callback?: (err: AWSError, data: GroundStation.Types.GetSatelliteResponse) => void): Request<GroundStation.Types.GetSatelliteResponse, AWSError>;
  /**
   * Returns a list of Config objects.
   */
  listConfigs(params: GroundStation.Types.ListConfigsRequest, callback?: (err: AWSError, data: GroundStation.Types.ListConfigsResponse) => void): Request<GroundStation.Types.ListConfigsResponse, AWSError>;
  /**
   * Returns a list of Config objects.
   */
  listConfigs(callback?: (err: AWSError, data: GroundStation.Types.ListConfigsResponse) => void): Request<GroundStation.Types.ListConfigsResponse, AWSError>;
  /**
   * Returns a list of contacts. If statusList contains AVAILABLE, the request must include groundStation, missionprofileArn, and satelliteArn. 
   */
  listContacts(params: GroundStation.Types.ListContactsRequest, callback?: (err: AWSError, data: GroundStation.Types.ListContactsResponse) => void): Request<GroundStation.Types.ListContactsResponse, AWSError>;
  /**
   * Returns a list of contacts. If statusList contains AVAILABLE, the request must include groundStation, missionprofileArn, and satelliteArn. 
   */
  listContacts(callback?: (err: AWSError, data: GroundStation.Types.ListContactsResponse) => void): Request<GroundStation.Types.ListContactsResponse, AWSError>;
  /**
   * Returns a list of DataflowEndpoint groups.
   */
  listDataflowEndpointGroups(params: GroundStation.Types.ListDataflowEndpointGroupsRequest, callback?: (err: AWSError, data: GroundStation.Types.ListDataflowEndpointGroupsResponse) => void): Request<GroundStation.Types.ListDataflowEndpointGroupsResponse, AWSError>;
  /**
   * Returns a list of DataflowEndpoint groups.
   */
  listDataflowEndpointGroups(callback?: (err: AWSError, data: GroundStation.Types.ListDataflowEndpointGroupsResponse) => void): Request<GroundStation.Types.ListDataflowEndpointGroupsResponse, AWSError>;
  /**
   * List existing ephemerides.
   */
  listEphemerides(params: GroundStation.Types.ListEphemeridesRequest, callback?: (err: AWSError, data: GroundStation.Types.ListEphemeridesResponse) => void): Request<GroundStation.Types.ListEphemeridesResponse, AWSError>;
  /**
   * List existing ephemerides.
   */
  listEphemerides(callback?: (err: AWSError, data: GroundStation.Types.ListEphemeridesResponse) => void): Request<GroundStation.Types.ListEphemeridesResponse, AWSError>;
  /**
   * Returns a list of ground stations. 
   */
  listGroundStations(params: GroundStation.Types.ListGroundStationsRequest, callback?: (err: AWSError, data: GroundStation.Types.ListGroundStationsResponse) => void): Request<GroundStation.Types.ListGroundStationsResponse, AWSError>;
  /**
   * Returns a list of ground stations. 
   */
  listGroundStations(callback?: (err: AWSError, data: GroundStation.Types.ListGroundStationsResponse) => void): Request<GroundStation.Types.ListGroundStationsResponse, AWSError>;
  /**
   * Returns a list of mission profiles.
   */
  listMissionProfiles(params: GroundStation.Types.ListMissionProfilesRequest, callback?: (err: AWSError, data: GroundStation.Types.ListMissionProfilesResponse) => void): Request<GroundStation.Types.ListMissionProfilesResponse, AWSError>;
  /**
   * Returns a list of mission profiles.
   */
  listMissionProfiles(callback?: (err: AWSError, data: GroundStation.Types.ListMissionProfilesResponse) => void): Request<GroundStation.Types.ListMissionProfilesResponse, AWSError>;
  /**
   * Returns a list of satellites.
   */
  listSatellites(params: GroundStation.Types.ListSatellitesRequest, callback?: (err: AWSError, data: GroundStation.Types.ListSatellitesResponse) => void): Request<GroundStation.Types.ListSatellitesResponse, AWSError>;
  /**
   * Returns a list of satellites.
   */
  listSatellites(callback?: (err: AWSError, data: GroundStation.Types.ListSatellitesResponse) => void): Request<GroundStation.Types.ListSatellitesResponse, AWSError>;
  /**
   * Returns a list of tags for a specified resource.
   */
  listTagsForResource(params: GroundStation.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: GroundStation.Types.ListTagsForResourceResponse) => void): Request<GroundStation.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of tags for a specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: GroundStation.Types.ListTagsForResourceResponse) => void): Request<GroundStation.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *   For use by AWS Ground Station Agent and shouldn't be called directly.   Registers a new agent with AWS Ground Station. 
   */
  registerAgent(params: GroundStation.Types.RegisterAgentRequest, callback?: (err: AWSError, data: GroundStation.Types.RegisterAgentResponse) => void): Request<GroundStation.Types.RegisterAgentResponse, AWSError>;
  /**
   *   For use by AWS Ground Station Agent and shouldn't be called directly.   Registers a new agent with AWS Ground Station. 
   */
  registerAgent(callback?: (err: AWSError, data: GroundStation.Types.RegisterAgentResponse) => void): Request<GroundStation.Types.RegisterAgentResponse, AWSError>;
  /**
   * Reserves a contact using specified parameters.
   */
  reserveContact(params: GroundStation.Types.ReserveContactRequest, callback?: (err: AWSError, data: GroundStation.Types.ContactIdResponse) => void): Request<GroundStation.Types.ContactIdResponse, AWSError>;
  /**
   * Reserves a contact using specified parameters.
   */
  reserveContact(callback?: (err: AWSError, data: GroundStation.Types.ContactIdResponse) => void): Request<GroundStation.Types.ContactIdResponse, AWSError>;
  /**
   * Assigns a tag to a resource.
   */
  tagResource(params: GroundStation.Types.TagResourceRequest, callback?: (err: AWSError, data: GroundStation.Types.TagResourceResponse) => void): Request<GroundStation.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns a tag to a resource.
   */
  tagResource(callback?: (err: AWSError, data: GroundStation.Types.TagResourceResponse) => void): Request<GroundStation.Types.TagResourceResponse, AWSError>;
  /**
   * Deassigns a resource tag.
   */
  untagResource(params: GroundStation.Types.UntagResourceRequest, callback?: (err: AWSError, data: GroundStation.Types.UntagResourceResponse) => void): Request<GroundStation.Types.UntagResourceResponse, AWSError>;
  /**
   * Deassigns a resource tag.
   */
  untagResource(callback?: (err: AWSError, data: GroundStation.Types.UntagResourceResponse) => void): Request<GroundStation.Types.UntagResourceResponse, AWSError>;
  /**
   *   For use by AWS Ground Station Agent and shouldn't be called directly.  Update the status of the agent.
   */
  updateAgentStatus(params: GroundStation.Types.UpdateAgentStatusRequest, callback?: (err: AWSError, data: GroundStation.Types.UpdateAgentStatusResponse) => void): Request<GroundStation.Types.UpdateAgentStatusResponse, AWSError>;
  /**
   *   For use by AWS Ground Station Agent and shouldn't be called directly.  Update the status of the agent.
   */
  updateAgentStatus(callback?: (err: AWSError, data: GroundStation.Types.UpdateAgentStatusResponse) => void): Request<GroundStation.Types.UpdateAgentStatusResponse, AWSError>;
  /**
   * Updates the Config used when scheduling contacts. Updating a Config will not update the execution parameters for existing future contacts scheduled with this Config.
   */
  updateConfig(params: GroundStation.Types.UpdateConfigRequest, callback?: (err: AWSError, data: GroundStation.Types.ConfigIdResponse) => void): Request<GroundStation.Types.ConfigIdResponse, AWSError>;
  /**
   * Updates the Config used when scheduling contacts. Updating a Config will not update the execution parameters for existing future contacts scheduled with this Config.
   */
  updateConfig(callback?: (err: AWSError, data: GroundStation.Types.ConfigIdResponse) => void): Request<GroundStation.Types.ConfigIdResponse, AWSError>;
  /**
   * Updates an existing ephemeris
   */
  updateEphemeris(params: GroundStation.Types.UpdateEphemerisRequest, callback?: (err: AWSError, data: GroundStation.Types.EphemerisIdResponse) => void): Request<GroundStation.Types.EphemerisIdResponse, AWSError>;
  /**
   * Updates an existing ephemeris
   */
  updateEphemeris(callback?: (err: AWSError, data: GroundStation.Types.EphemerisIdResponse) => void): Request<GroundStation.Types.EphemerisIdResponse, AWSError>;
  /**
   * Updates a mission profile. Updating a mission profile will not update the execution parameters for existing future contacts.
   */
  updateMissionProfile(params: GroundStation.Types.UpdateMissionProfileRequest, callback?: (err: AWSError, data: GroundStation.Types.MissionProfileIdResponse) => void): Request<GroundStation.Types.MissionProfileIdResponse, AWSError>;
  /**
   * Updates a mission profile. Updating a mission profile will not update the execution parameters for existing future contacts.
   */
  updateMissionProfile(callback?: (err: AWSError, data: GroundStation.Types.MissionProfileIdResponse) => void): Request<GroundStation.Types.MissionProfileIdResponse, AWSError>;
  /**
   * Waits for the contactScheduled state by periodically calling the underlying GroundStation.describeContactoperation every 5 seconds (at most 180 times). Waits until a contact has been scheduled
   */
  waitFor(state: "contactScheduled", params: GroundStation.Types.DescribeContactRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: GroundStation.Types.DescribeContactResponse) => void): Request<GroundStation.Types.DescribeContactResponse, AWSError>;
  /**
   * Waits for the contactScheduled state by periodically calling the underlying GroundStation.describeContactoperation every 5 seconds (at most 180 times). Waits until a contact has been scheduled
   */
  waitFor(state: "contactScheduled", callback?: (err: AWSError, data: GroundStation.Types.DescribeContactResponse) => void): Request<GroundStation.Types.DescribeContactResponse, AWSError>;
}
declare namespace GroundStation {
  export type AWSRegion = string;
  export type AgentCpuCoresList = Integer[];
  export interface AgentDetails {
    /**
     * List of CPU cores reserved for the agent.
     */
    agentCpuCores?: AgentCpuCoresList;
    /**
     * Current agent version.
     */
    agentVersion: VersionString;
    /**
     * List of versions being used by agent components.
     */
    componentVersions: ComponentVersionList;
    /**
     * ID of EC2 instance agent is running on.
     */
    instanceId: InstanceId;
    /**
     * Type of EC2 instance agent is running on.
     */
    instanceType: InstanceType;
    /**
     *  This field should not be used. Use agentCpuCores instead.  List of CPU cores reserved for processes other than the agent running on the EC2 instance.
     */
    reservedCpuCores?: AgentCpuCoresList;
  }
  export type AgentStatus = "SUCCESS"|"FAILED"|"ACTIVE"|"INACTIVE"|string;
  export interface AggregateStatus {
    /**
     * Sparse map of failure signatures.
     */
    signatureMap?: SignatureMap;
    /**
     * Aggregate status.
     */
    status: AgentStatus;
  }
  export type AngleUnits = "DEGREE_ANGLE"|"RADIAN"|string;
  export interface AntennaDemodDecodeDetails {
    /**
     * Name of an antenna demod decode output node used in a contact.
     */
    outputNode?: String;
  }
  export interface AntennaDownlinkConfig {
    /**
     * Object that describes a spectral Config.
     */
    spectrumConfig: SpectrumConfig;
  }
  export interface AntennaDownlinkDemodDecodeConfig {
    /**
     * Information about the decode Config.
     */
    decodeConfig: DecodeConfig;
    /**
     * Information about the demodulation Config.
     */
    demodulationConfig: DemodulationConfig;
    /**
     * Information about the spectral Config.
     */
    spectrumConfig: SpectrumConfig;
  }
  export interface AntennaUplinkConfig {
    /**
     * Information about the uplink spectral Config.
     */
    spectrumConfig: UplinkSpectrumConfig;
    /**
     * EIRP of the target.
     */
    targetEirp: Eirp;
    /**
     * Whether or not uplink transmit is disabled.
     */
    transmitDisabled?: Boolean;
  }
  export type AnyArn = string;
  export type AuditResults = "HEALTHY"|"UNHEALTHY"|string;
  export interface AwsGroundStationAgentEndpoint {
    /**
     * The status of AgentEndpoint.
     */
    agentStatus?: AgentStatus;
    /**
     * The results of the audit.
     */
    auditResults?: AuditResults;
    /**
     * The egress address of AgentEndpoint.
     */
    egressAddress: ConnectionDetails;
    /**
     * The ingress address of AgentEndpoint.
     */
    ingressAddress: RangedConnectionDetails;
    /**
     * Name string associated with AgentEndpoint. Used as a human-readable identifier for AgentEndpoint.
     */
    name: SafeName;
  }
  export type BandwidthUnits = "GHz"|"MHz"|"kHz"|string;
  export type Boolean = boolean;
  export type BucketArn = string;
  export interface CancelContactRequest {
    /**
     * UUID of a contact.
     */
    contactId: Uuid;
  }
  export type CapabilityArn = string;
  export type CapabilityArnList = CapabilityArn[];
  export type CapabilityHealth = "UNHEALTHY"|"HEALTHY"|string;
  export type CapabilityHealthReason = "NO_REGISTERED_AGENT"|"INVALID_IP_OWNERSHIP"|"NOT_AUTHORIZED_TO_CREATE_SLR"|"UNVERIFIED_IP_OWNERSHIP"|"INITIALIZING_DATAPLANE"|"DATAPLANE_FAILURE"|"HEALTHY"|string;
  export type CapabilityHealthReasonList = CapabilityHealthReason[];
  export interface ComponentStatusData {
    /**
     * Bytes received by the component.
     */
    bytesReceived?: Long;
    /**
     * Bytes sent by the component.
     */
    bytesSent?: Long;
    /**
     * Capability ARN of the component.
     */
    capabilityArn: CapabilityArn;
    /**
     * The Component type.
     */
    componentType: ComponentTypeString;
    /**
     * Dataflow UUID associated with the component.
     */
    dataflowId: Uuid;
    /**
     * Packets dropped by component.
     */
    packetsDropped?: Long;
    /**
     * Component status.
     */
    status: AgentStatus;
  }
  export type ComponentStatusList = ComponentStatusData[];
  export type ComponentTypeString = string;
  export interface ComponentVersion {
    /**
     * Component type.
     */
    componentType: ComponentTypeString;
    /**
     * List of versions.
     */
    versions: VersionStringList;
  }
  export type ComponentVersionList = ComponentVersion[];
  export type ConfigArn = string;
  export type ConfigCapabilityType = "antenna-downlink"|"antenna-downlink-demod-decode"|"antenna-uplink"|"dataflow-endpoint"|"tracking"|"uplink-echo"|"s3-recording"|string;
  export interface ConfigDetails {
    /**
     * Details for antenna demod decode Config in a contact.
     */
    antennaDemodDecodeDetails?: AntennaDemodDecodeDetails;
    endpointDetails?: EndpointDetails;
    /**
     * Details for an S3 recording Config in a contact.
     */
    s3RecordingDetails?: S3RecordingDetails;
  }
  export interface ConfigIdResponse {
    /**
     * ARN of a Config.
     */
    configArn?: ConfigArn;
    /**
     * UUID of a Config.
     */
    configId?: String;
    /**
     * Type of a Config.
     */
    configType?: ConfigCapabilityType;
  }
  export type ConfigList = ConfigListItem[];
  export interface ConfigListItem {
    /**
     * ARN of a Config.
     */
    configArn?: ConfigArn;
    /**
     * UUID of a Config.
     */
    configId?: String;
    /**
     * Type of a Config.
     */
    configType?: ConfigCapabilityType;
    /**
     * Name of a Config.
     */
    name?: String;
  }
  export interface ConfigTypeData {
    /**
     * Information about how AWS Ground Station should configure an antenna for downlink during a contact.
     */
    antennaDownlinkConfig?: AntennaDownlinkConfig;
    /**
     * Information about how AWS Ground Station should conﬁgure an antenna for downlink demod decode during a contact.
     */
    antennaDownlinkDemodDecodeConfig?: AntennaDownlinkDemodDecodeConfig;
    /**
     * Information about how AWS Ground Station should conﬁgure an antenna for uplink during a contact.
     */
    antennaUplinkConfig?: AntennaUplinkConfig;
    /**
     * Information about the dataflow endpoint Config.
     */
    dataflowEndpointConfig?: DataflowEndpointConfig;
    /**
     * Information about an S3 recording Config.
     */
    s3RecordingConfig?: S3RecordingConfig;
    /**
     * Object that determines whether tracking should be used during a contact executed with this Config in the mission profile. 
     */
    trackingConfig?: TrackingConfig;
    /**
     * Information about an uplink echo Config. Parameters from the AntennaUplinkConfig, corresponding to the specified AntennaUplinkConfigArn, are used when this UplinkEchoConfig is used in a contact.
     */
    uplinkEchoConfig?: UplinkEchoConfig;
  }
  export interface ConnectionDetails {
    /**
     * Maximum transmission unit (MTU) size in bytes of a dataflow endpoint.
     */
    mtu?: Integer;
    /**
     * A socket address.
     */
    socketAddress: SocketAddress;
  }
  export interface ContactData {
    /**
     * UUID of a contact.
     */
    contactId?: Uuid;
    /**
     * Status of a contact.
     */
    contactStatus?: ContactStatus;
    /**
     * End time of a contact in UTC.
     */
    endTime?: Timestamp;
    /**
     * Error message of a contact.
     */
    errorMessage?: String;
    /**
     * Name of a ground station.
     */
    groundStation?: String;
    /**
     * Maximum elevation angle of a contact.
     */
    maximumElevation?: Elevation;
    /**
     * ARN of a mission profile.
     */
    missionProfileArn?: MissionProfileArn;
    /**
     * Amount of time after a contact ends that you’d like to receive a CloudWatch event indicating the pass has finished.
     */
    postPassEndTime?: Timestamp;
    /**
     * Amount of time prior to contact start you’d like to receive a CloudWatch event indicating an upcoming pass.
     */
    prePassStartTime?: Timestamp;
    /**
     * Region of a contact.
     */
    region?: String;
    /**
     * ARN of a satellite.
     */
    satelliteArn?: satelliteArn;
    /**
     * Start time of a contact in UTC.
     */
    startTime?: Timestamp;
    /**
     * Tags assigned to a contact.
     */
    tags?: TagsMap;
  }
  export interface ContactIdResponse {
    /**
     * UUID of a contact.
     */
    contactId?: Uuid;
  }
  export type ContactList = ContactData[];
  export type ContactStatus = "AVAILABLE"|"AWS_CANCELLED"|"AWS_FAILED"|"CANCELLED"|"CANCELLING"|"COMPLETED"|"FAILED"|"FAILED_TO_SCHEDULE"|"PASS"|"POSTPASS"|"PREPASS"|"SCHEDULED"|"SCHEDULING"|string;
  export interface CreateConfigRequest {
    /**
     * Parameters of a Config.
     */
    configData: ConfigTypeData;
    /**
     * Name of a Config.
     */
    name: SafeName;
    /**
     * Tags assigned to a Config.
     */
    tags?: TagsMap;
  }
  export interface CreateDataflowEndpointGroupRequest {
    /**
     * Amount of time, in seconds, after a contact ends that the Ground Station Dataflow Endpoint Group will be in a POSTPASS state. A Ground Station Dataflow Endpoint Group State Change event will be emitted when the Dataflow Endpoint Group enters and exits the POSTPASS state.
     */
    contactPostPassDurationSeconds?: DataflowEndpointGroupDurationInSeconds;
    /**
     * Amount of time, in seconds, before a contact starts that the Ground Station Dataflow Endpoint Group will be in a PREPASS state. A Ground Station Dataflow Endpoint Group State Change event will be emitted when the Dataflow Endpoint Group enters and exits the PREPASS state.
     */
    contactPrePassDurationSeconds?: DataflowEndpointGroupDurationInSeconds;
    /**
     * Endpoint details of each endpoint in the dataflow endpoint group.
     */
    endpointDetails: EndpointDetailsList;
    /**
     * Tags of a dataflow endpoint group.
     */
    tags?: TagsMap;
  }
  export interface CreateEphemerisRequest {
    /**
     * Whether to set the ephemeris status to ENABLED after validation. Setting this to false will set the ephemeris status to DISABLED after validation.
     */
    enabled?: Boolean;
    /**
     * Ephemeris data.
     */
    ephemeris?: EphemerisData;
    /**
     * An overall expiration time for the ephemeris in UTC, after which it will become EXPIRED.
     */
    expirationTime?: Timestamp;
    /**
     * The ARN of a KMS key used to encrypt the ephemeris in Ground Station.
     */
    kmsKeyArn?: KeyArn;
    /**
     * A name string associated with the ephemeris. Used as a human-readable identifier for the ephemeris.
     */
    name: SafeName;
    /**
     * Customer-provided priority score to establish the order in which overlapping ephemerides should be used. The default for customer-provided ephemeris priority is 1, and higher numbers take precedence. Priority must be 1 or greater
     */
    priority?: CustomerEphemerisPriority;
    /**
     * AWS Ground Station satellite ID for this ephemeris.
     */
    satelliteId: Uuid;
    /**
     * Tags assigned to an ephemeris.
     */
    tags?: TagsMap;
  }
  export interface CreateMissionProfileRequest {
    /**
     * Amount of time after a contact ends that you’d like to receive a CloudWatch event indicating the pass has finished.
     */
    contactPostPassDurationSeconds?: DurationInSeconds;
    /**
     * Amount of time prior to contact start you’d like to receive a CloudWatch event indicating an upcoming pass.
     */
    contactPrePassDurationSeconds?: DurationInSeconds;
    /**
     * A list of lists of ARNs. Each list of ARNs is an edge, with a from Config and a to Config.
     */
    dataflowEdges: DataflowEdgeList;
    /**
     * Smallest amount of time in seconds that you’d like to see for an available contact. AWS Ground Station will not present you with contacts shorter than this duration.
     */
    minimumViableContactDurationSeconds: PositiveDurationInSeconds;
    /**
     * Name of a mission profile.
     */
    name: SafeName;
    /**
     * KMS key to use for encrypting streams.
     */
    streamsKmsKey?: KmsKey;
    /**
     * Role to use for encrypting streams with KMS key.
     */
    streamsKmsRole?: RoleArn;
    /**
     * Tags assigned to a mission profile.
     */
    tags?: TagsMap;
    /**
     * ARN of a tracking Config.
     */
    trackingConfigArn: ConfigArn;
  }
  export type Criticality = "PREFERRED"|"REMOVED"|"REQUIRED"|string;
  export type CustomerEphemerisPriority = number;
  export interface DataflowDetail {
    destination?: Destination;
    /**
     * Error message for a dataflow.
     */
    errorMessage?: String;
    source?: Source;
  }
  export type DataflowEdge = ConfigArn[];
  export type DataflowEdgeList = DataflowEdge[];
  export interface DataflowEndpoint {
    /**
     * Socket address of a dataflow endpoint.
     */
    address?: SocketAddress;
    /**
     * Maximum transmission unit (MTU) size in bytes of a dataflow endpoint.
     */
    mtu?: DataflowEndpointMtuInteger;
    /**
     * Name of a dataflow endpoint.
     */
    name?: SafeName;
    /**
     * Status of a dataflow endpoint.
     */
    status?: EndpointStatus;
  }
  export interface DataflowEndpointConfig {
    /**
     * Name of a dataflow endpoint.
     */
    dataflowEndpointName: String;
    /**
     * Region of a dataflow endpoint.
     */
    dataflowEndpointRegion?: String;
  }
  export type DataflowEndpointGroupArn = string;
  export type DataflowEndpointGroupDurationInSeconds = number;
  export interface DataflowEndpointGroupIdResponse {
    /**
     * UUID of a dataflow endpoint group.
     */
    dataflowEndpointGroupId?: Uuid;
  }
  export type DataflowEndpointGroupList = DataflowEndpointListItem[];
  export interface DataflowEndpointListItem {
    /**
     * ARN of a dataflow endpoint group.
     */
    dataflowEndpointGroupArn?: DataflowEndpointGroupArn;
    /**
     * UUID of a dataflow endpoint group.
     */
    dataflowEndpointGroupId?: Uuid;
  }
  export type DataflowEndpointMtuInteger = number;
  export type DataflowList = DataflowDetail[];
  export interface DecodeConfig {
    /**
     * Unvalidated JSON of a decode Config.
     */
    unvalidatedJSON: JsonString;
  }
  export interface DeleteConfigRequest {
    /**
     * UUID of a Config.
     */
    configId: Uuid;
    /**
     * Type of a Config.
     */
    configType: ConfigCapabilityType;
  }
  export interface DeleteDataflowEndpointGroupRequest {
    /**
     * UUID of a dataflow endpoint group.
     */
    dataflowEndpointGroupId: Uuid;
  }
  export interface DeleteEphemerisRequest {
    /**
     * The AWS Ground Station ephemeris ID.
     */
    ephemerisId: Uuid;
  }
  export interface DeleteMissionProfileRequest {
    /**
     * UUID of a mission profile.
     */
    missionProfileId: Uuid;
  }
  export interface DemodulationConfig {
    /**
     * Unvalidated JSON of a demodulation Config.
     */
    unvalidatedJSON: JsonString;
  }
  export interface DescribeContactRequest {
    /**
     * UUID of a contact.
     */
    contactId: Uuid;
  }
  export interface DescribeContactResponse {
    /**
     * UUID of a contact.
     */
    contactId?: Uuid;
    /**
     * Status of a contact.
     */
    contactStatus?: ContactStatus;
    /**
     * List describing source and destination details for each dataflow edge.
     */
    dataflowList?: DataflowList;
    /**
     * End time of a contact in UTC.
     */
    endTime?: Timestamp;
    /**
     * Error message for a contact.
     */
    errorMessage?: String;
    /**
     * Ground station for a contact.
     */
    groundStation?: String;
    /**
     * Maximum elevation angle of a contact.
     */
    maximumElevation?: Elevation;
    /**
     * ARN of a mission profile.
     */
    missionProfileArn?: MissionProfileArn;
    /**
     * Amount of time after a contact ends that you’d like to receive a CloudWatch event indicating the pass has finished.
     */
    postPassEndTime?: Timestamp;
    /**
     * Amount of time prior to contact start you’d like to receive a CloudWatch event indicating an upcoming pass.
     */
    prePassStartTime?: Timestamp;
    /**
     * Region of a contact.
     */
    region?: String;
    /**
     * ARN of a satellite.
     */
    satelliteArn?: satelliteArn;
    /**
     * Start time of a contact in UTC.
     */
    startTime?: Timestamp;
    /**
     * Tags assigned to a contact.
     */
    tags?: TagsMap;
  }
  export interface DescribeEphemerisRequest {
    /**
     * The AWS Ground Station ephemeris ID.
     */
    ephemerisId: Uuid;
  }
  export interface DescribeEphemerisResponse {
    /**
     * The time the ephemeris was uploaded in UTC.
     */
    creationTime?: Timestamp;
    /**
     * Whether or not the ephemeris is enabled.
     */
    enabled?: Boolean;
    /**
     * The AWS Ground Station ephemeris ID.
     */
    ephemerisId?: Uuid;
    /**
     * Reason that an ephemeris failed validation. Only provided for ephemerides with INVALID status.
     */
    invalidReason?: EphemerisInvalidReason;
    /**
     * A name string associated with the ephemeris. Used as a human-readable identifier for the ephemeris.
     */
    name?: SafeName;
    /**
     * Customer-provided priority score to establish the order in which overlapping ephemerides should be used. The default for customer-provided ephemeris priority is 1, and higher numbers take precedence. Priority must be 1 or greater
     */
    priority?: EphemerisPriority;
    /**
     * The AWS Ground Station satellite ID associated with ephemeris.
     */
    satelliteId?: Uuid;
    /**
     * The status of the ephemeris.
     */
    status?: EphemerisStatus;
    /**
     * Supplied ephemeris data.
     */
    suppliedData?: EphemerisTypeDescription;
    /**
     * Tags assigned to an ephemeris.
     */
    tags?: TagsMap;
  }
  export interface Destination {
    /**
     * Additional details for a Config, if type is dataflow endpoint or antenna demod decode.
     */
    configDetails?: ConfigDetails;
    /**
     * UUID of a Config.
     */
    configId?: Uuid;
    /**
     * Type of a Config.
     */
    configType?: ConfigCapabilityType;
    /**
     * Region of a dataflow destination.
     */
    dataflowDestinationRegion?: String;
  }
  export interface DiscoveryData {
    /**
     * List of capabilities to associate with agent.
     */
    capabilityArns: CapabilityArnList;
    /**
     * List of private IP addresses to associate with agent.
     */
    privateIpAddresses: IpAddressList;
    /**
     * List of public IP addresses to associate with agent.
     */
    publicIpAddresses: IpAddressList;
  }
  export type Double = number;
  export type DurationInSeconds = number;
  export interface Eirp {
    /**
     * Units of an EIRP.
     */
    units: EirpUnits;
    /**
     * Value of an EIRP. Valid values are between 20.0 to 50.0 dBW.
     */
    value: Double;
  }
  export type EirpUnits = "dBW"|string;
  export interface Elevation {
    /**
     * Elevation angle units.
     */
    unit: AngleUnits;
    /**
     * Elevation angle value.
     */
    value: Double;
  }
  export interface EndpointDetails {
    /**
     * An agent endpoint.
     */
    awsGroundStationAgentEndpoint?: AwsGroundStationAgentEndpoint;
    /**
     * A dataflow endpoint.
     */
    endpoint?: DataflowEndpoint;
    /**
     * Health reasons for a dataflow endpoint. This field is ignored when calling CreateDataflowEndpointGroup.
     */
    healthReasons?: CapabilityHealthReasonList;
    /**
     * A dataflow endpoint health status. This field is ignored when calling CreateDataflowEndpointGroup.
     */
    healthStatus?: CapabilityHealth;
    /**
     * Endpoint security details including a list of subnets, a list of security groups and a role to connect streams to instances.
     */
    securityDetails?: SecurityDetails;
  }
  export type EndpointDetailsList = EndpointDetails[];
  export type EndpointStatus = "created"|"creating"|"deleted"|"deleting"|"failed"|string;
  export type EphemeridesList = EphemerisItem[];
  export interface EphemerisData {
    oem?: OEMEphemeris;
    tle?: TLEEphemeris;
  }
  export interface EphemerisDescription {
    /**
     * Supplied ephemeris data.
     */
    ephemerisData?: UnboundedString;
    /**
     * Source S3 object used for the ephemeris.
     */
    sourceS3Object?: S3Object;
  }
  export interface EphemerisIdResponse {
    /**
     * The AWS Ground Station ephemeris ID.
     */
    ephemerisId?: Uuid;
  }
  export type EphemerisInvalidReason = "METADATA_INVALID"|"TIME_RANGE_INVALID"|"TRAJECTORY_INVALID"|"KMS_KEY_INVALID"|"VALIDATION_ERROR"|string;
  export interface EphemerisItem {
    /**
     * The time the ephemeris was uploaded in UTC.
     */
    creationTime?: Timestamp;
    /**
     * Whether or not the ephemeris is enabled.
     */
    enabled?: Boolean;
    /**
     * The AWS Ground Station ephemeris ID.
     */
    ephemerisId?: Uuid;
    /**
     * A name string associated with the ephemeris. Used as a human-readable identifier for the ephemeris.
     */
    name?: SafeName;
    /**
     * Customer-provided priority score to establish the order in which overlapping ephemerides should be used. The default for customer-provided ephemeris priority is 1, and higher numbers take precedence. Priority must be 1 or greater
     */
    priority?: EphemerisPriority;
    /**
     * Source S3 object used for the ephemeris.
     */
    sourceS3Object?: S3Object;
    /**
     * The status of the ephemeris.
     */
    status?: EphemerisStatus;
  }
  export interface EphemerisMetaData {
    /**
     * UUID of a customer-provided ephemeris. This field is not populated for default ephemerides from Space Track.
     */
    ephemerisId?: Uuid;
    /**
     * The epoch of a default, ephemeris from Space Track in UTC. This field is not populated for customer-provided ephemerides.
     */
    epoch?: Timestamp;
    /**
     * A name string associated with the ephemeris. Used as a human-readable identifier for the ephemeris. A name is only returned for customer-provider ephemerides that have a name associated.
     */
    name?: SafeName;
    /**
     * The EphemerisSource that generated a given ephemeris.
     */
    source: EphemerisSource;
  }
  export type EphemerisPriority = number;
  export type EphemerisSource = "CUSTOMER_PROVIDED"|"SPACE_TRACK"|string;
  export type EphemerisStatus = "VALIDATING"|"INVALID"|"ERROR"|"ENABLED"|"DISABLED"|"EXPIRED"|string;
  export type EphemerisStatusList = EphemerisStatus[];
  export interface EphemerisTypeDescription {
    oem?: EphemerisDescription;
    tle?: EphemerisDescription;
  }
  export interface Frequency {
    /**
     * Frequency units.
     */
    units: FrequencyUnits;
    /**
     * Frequency value. Valid values are between 2200 to 2300 MHz and 7750 to 8400 MHz for downlink and 2025 to 2120 MHz for uplink.
     */
    value: Double;
  }
  export interface FrequencyBandwidth {
    /**
     * Frequency bandwidth units.
     */
    units: BandwidthUnits;
    /**
     * Frequency bandwidth value. AWS Ground Station currently has the following bandwidth limitations:   For AntennaDownlinkDemodDecodeconfig, valid values are between 125 kHz to 650 MHz.   For AntennaDownlinkconfig, valid values are between 10 kHz to 54 MHz.   For AntennaUplinkConfig, valid values are between 10 kHz to 54 MHz.  
     */
    value: Double;
  }
  export type FrequencyUnits = "GHz"|"MHz"|"kHz"|string;
  export interface GetAgentConfigurationRequest {
    /**
     * UUID of agent to get configuration information for.
     */
    agentId: Uuid;
  }
  export interface GetAgentConfigurationResponse {
    /**
     * UUID of agent.
     */
    agentId?: Uuid;
    /**
     * Tasking document for agent.
     */
    taskingDocument?: String;
  }
  export interface GetConfigRequest {
    /**
     * UUID of a Config.
     */
    configId: Uuid;
    /**
     * Type of a Config.
     */
    configType: ConfigCapabilityType;
  }
  export interface GetConfigResponse {
    /**
     * ARN of a Config 
     */
    configArn: ConfigArn;
    /**
     * Data elements in a Config.
     */
    configData: ConfigTypeData;
    /**
     * UUID of a Config.
     */
    configId: String;
    /**
     * Type of a Config.
     */
    configType?: ConfigCapabilityType;
    /**
     * Name of a Config.
     */
    name: String;
    /**
     * Tags assigned to a Config.
     */
    tags?: TagsMap;
  }
  export interface GetDataflowEndpointGroupRequest {
    /**
     * UUID of a dataflow endpoint group.
     */
    dataflowEndpointGroupId: Uuid;
  }
  export interface GetDataflowEndpointGroupResponse {
    /**
     * Amount of time, in seconds, after a contact ends that the Ground Station Dataflow Endpoint Group will be in a POSTPASS state. A Ground Station Dataflow Endpoint Group State Change event will be emitted when the Dataflow Endpoint Group enters and exits the POSTPASS state.
     */
    contactPostPassDurationSeconds?: DataflowEndpointGroupDurationInSeconds;
    /**
     * Amount of time, in seconds, before a contact starts that the Ground Station Dataflow Endpoint Group will be in a PREPASS state. A Ground Station Dataflow Endpoint Group State Change event will be emitted when the Dataflow Endpoint Group enters and exits the PREPASS state.
     */
    contactPrePassDurationSeconds?: DataflowEndpointGroupDurationInSeconds;
    /**
     * ARN of a dataflow endpoint group.
     */
    dataflowEndpointGroupArn?: DataflowEndpointGroupArn;
    /**
     * UUID of a dataflow endpoint group.
     */
    dataflowEndpointGroupId?: Uuid;
    /**
     * Details of a dataflow endpoint.
     */
    endpointsDetails?: EndpointDetailsList;
    /**
     * Tags assigned to a dataflow endpoint group.
     */
    tags?: TagsMap;
  }
  export interface GetMinuteUsageRequest {
    /**
     * The month being requested, with a value of 1-12.
     */
    month: Month;
    /**
     * The year being requested, in the format of YYYY.
     */
    year: Year;
  }
  export interface GetMinuteUsageResponse {
    /**
     * Estimated number of minutes remaining for an account, specific to the month being requested.
     */
    estimatedMinutesRemaining?: Integer;
    /**
     * Returns whether or not an account has signed up for the reserved minutes pricing plan, specific to the month being requested.
     */
    isReservedMinutesCustomer?: Boolean;
    /**
     * Total number of reserved minutes allocated, specific to the month being requested.
     */
    totalReservedMinuteAllocation?: Integer;
    /**
     * Total scheduled minutes for an account, specific to the month being requested.
     */
    totalScheduledMinutes?: Integer;
    /**
     * Upcoming minutes scheduled for an account, specific to the month being requested.
     */
    upcomingMinutesScheduled?: Integer;
  }
  export interface GetMissionProfileRequest {
    /**
     * UUID of a mission profile.
     */
    missionProfileId: Uuid;
  }
  export interface GetMissionProfileResponse {
    /**
     * Amount of time after a contact ends that you’d like to receive a CloudWatch event indicating the pass has finished.
     */
    contactPostPassDurationSeconds?: DurationInSeconds;
    /**
     * Amount of time prior to contact start you’d like to receive a CloudWatch event indicating an upcoming pass.
     */
    contactPrePassDurationSeconds?: DurationInSeconds;
    /**
     * A list of lists of ARNs. Each list of ARNs is an edge, with a from Config and a to Config.
     */
    dataflowEdges?: DataflowEdgeList;
    /**
     * Smallest amount of time in seconds that you’d like to see for an available contact. AWS Ground Station will not present you with contacts shorter than this duration.
     */
    minimumViableContactDurationSeconds?: PositiveDurationInSeconds;
    /**
     * ARN of a mission profile.
     */
    missionProfileArn?: MissionProfileArn;
    /**
     * UUID of a mission profile.
     */
    missionProfileId?: Uuid;
    /**
     * Name of a mission profile.
     */
    name?: SafeName;
    /**
     * Region of a mission profile.
     */
    region?: AWSRegion;
    /**
     * KMS key to use for encrypting streams.
     */
    streamsKmsKey?: KmsKey;
    /**
     * Role to use for encrypting streams with KMS key.
     */
    streamsKmsRole?: RoleArn;
    /**
     * Tags assigned to a mission profile.
     */
    tags?: TagsMap;
    /**
     * ARN of a tracking Config.
     */
    trackingConfigArn?: ConfigArn;
  }
  export interface GetSatelliteRequest {
    /**
     * UUID of a satellite.
     */
    satelliteId: Uuid;
  }
  export interface GetSatelliteResponse {
    /**
     * The current ephemeris being used to compute the trajectory of the satellite.
     */
    currentEphemeris?: EphemerisMetaData;
    /**
     * A list of ground stations to which the satellite is on-boarded.
     */
    groundStations?: GroundStationIdList;
    /**
     * NORAD satellite ID number.
     */
    noradSatelliteID?: noradSatelliteID;
    /**
     * ARN of a satellite.
     */
    satelliteArn?: satelliteArn;
    /**
     * UUID of a satellite.
     */
    satelliteId?: Uuid;
  }
  export interface GroundStationData {
    /**
     * UUID of a ground station.
     */
    groundStationId?: GroundStationName;
    /**
     * Name of a ground station.
     */
    groundStationName?: GroundStationName;
    /**
     * Ground station Region.
     */
    region?: AWSRegion;
  }
  export type GroundStationIdList = GroundStationName[];
  export type GroundStationList = GroundStationData[];
  export type GroundStationName = string;
  export type InstanceId = string;
  export type InstanceType = string;
  export type Integer = number;
  export interface IntegerRange {
    /**
     * A maximum value.
     */
    maximum: Integer;
    /**
     * A minimum value.
     */
    minimum: Integer;
  }
  export type IpAddressList = IpV4Address[];
  export type IpV4Address = string;
  export type JsonString = string;
  export type KeyAliasArn = string;
  export type KeyArn = string;
  export interface KmsKey {
    /**
     * KMS Alias Arn.
     */
    kmsAliasArn?: KeyAliasArn;
    /**
     * KMS Key Arn.
     */
    kmsKeyArn?: KeyArn;
  }
  export interface ListConfigsRequest {
    /**
     * Maximum number of Configs returned.
     */
    maxResults?: PaginationMaxResults;
    /**
     * Next token returned in the request of a previous ListConfigs call. Used to get the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListConfigsResponse {
    /**
     * List of Config items.
     */
    configList?: ConfigList;
    /**
     * Next token returned in the response of a previous ListConfigs call. Used to get the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListContactsRequest {
    /**
     * End time of a contact in UTC.
     */
    endTime: Timestamp;
    /**
     * Name of a ground station.
     */
    groundStation?: GroundStationName;
    /**
     * Maximum number of contacts returned.
     */
    maxResults?: PaginationMaxResults;
    /**
     * ARN of a mission profile.
     */
    missionProfileArn?: MissionProfileArn;
    /**
     * Next token returned in the request of a previous ListContacts call. Used to get the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * ARN of a satellite.
     */
    satelliteArn?: satelliteArn;
    /**
     * Start time of a contact in UTC.
     */
    startTime: Timestamp;
    /**
     * Status of a contact reservation.
     */
    statusList: StatusList;
  }
  export interface ListContactsResponse {
    /**
     * List of contacts.
     */
    contactList?: ContactList;
    /**
     * Next token returned in the response of a previous ListContacts call. Used to get the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListDataflowEndpointGroupsRequest {
    /**
     * Maximum number of dataflow endpoint groups returned.
     */
    maxResults?: PaginationMaxResults;
    /**
     * Next token returned in the request of a previous ListDataflowEndpointGroups call. Used to get the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListDataflowEndpointGroupsResponse {
    /**
     * A list of dataflow endpoint groups.
     */
    dataflowEndpointGroupList?: DataflowEndpointGroupList;
    /**
     * Next token returned in the response of a previous ListDataflowEndpointGroups call. Used to get the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListEphemeridesRequest {
    /**
     * The end time to list in UTC. The operation will return an ephemeris if its expiration time is within the time range defined by the startTime and endTime.
     */
    endTime: Timestamp;
    /**
     * Maximum number of ephemerides to return.
     */
    maxResults?: PaginationMaxResults;
    /**
     * Pagination token.
     */
    nextToken?: PaginationToken;
    /**
     * The AWS Ground Station satellite ID to list ephemeris for.
     */
    satelliteId: Uuid;
    /**
     * The start time to list in UTC. The operation will return an ephemeris if its expiration time is within the time range defined by the startTime and endTime.
     */
    startTime: Timestamp;
    /**
     * The list of ephemeris status to return.
     */
    statusList?: EphemerisStatusList;
  }
  export interface ListEphemeridesResponse {
    /**
     * List of ephemerides.
     */
    ephemerides?: EphemeridesList;
    /**
     * Pagination token.
     */
    nextToken?: PaginationToken;
  }
  export interface ListGroundStationsRequest {
    /**
     * Maximum number of ground stations returned.
     */
    maxResults?: PaginationMaxResults;
    /**
     * Next token that can be supplied in the next call to get the next page of ground stations.
     */
    nextToken?: PaginationToken;
    /**
     * Satellite ID to retrieve on-boarded ground stations.
     */
    satelliteId?: Uuid;
  }
  export interface ListGroundStationsResponse {
    /**
     * List of ground stations.
     */
    groundStationList?: GroundStationList;
    /**
     * Next token that can be supplied in the next call to get the next page of ground stations.
     */
    nextToken?: PaginationToken;
  }
  export interface ListMissionProfilesRequest {
    /**
     * Maximum number of mission profiles returned.
     */
    maxResults?: PaginationMaxResults;
    /**
     * Next token returned in the request of a previous ListMissionProfiles call. Used to get the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListMissionProfilesResponse {
    /**
     * List of mission profiles.
     */
    missionProfileList?: MissionProfileList;
    /**
     * Next token returned in the response of a previous ListMissionProfiles call. Used to get the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListSatellitesRequest {
    /**
     * Maximum number of satellites returned.
     */
    maxResults?: PaginationMaxResults;
    /**
     * Next token that can be supplied in the next call to get the next page of satellites.
     */
    nextToken?: PaginationToken;
  }
  export interface ListSatellitesResponse {
    /**
     * Next token that can be supplied in the next call to get the next page of satellites.
     */
    nextToken?: PaginationToken;
    /**
     * List of satellites.
     */
    satellites?: SatelliteList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * ARN of a resource.
     */
    resourceArn: AnyArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Tags assigned to a resource.
     */
    tags?: TagsMap;
  }
  export type Long = number;
  export type MissionProfileArn = string;
  export interface MissionProfileIdResponse {
    /**
     * UUID of a mission profile.
     */
    missionProfileId?: Uuid;
  }
  export type MissionProfileList = MissionProfileListItem[];
  export interface MissionProfileListItem {
    /**
     * ARN of a mission profile.
     */
    missionProfileArn?: MissionProfileArn;
    /**
     * UUID of a mission profile.
     */
    missionProfileId?: Uuid;
    /**
     * Name of a mission profile.
     */
    name?: SafeName;
    /**
     * Region of a mission profile.
     */
    region?: AWSRegion;
  }
  export type Month = number;
  export interface OEMEphemeris {
    /**
     * The data for an OEM ephemeris, supplied directly in the request rather than through an S3 object.
     */
    oemData?: UnboundedString;
    /**
     * Identifies the S3 object to be used as the ephemeris.
     */
    s3Object?: S3Object;
  }
  export type PaginationMaxResults = number;
  export type PaginationToken = string;
  export type Polarization = "LEFT_HAND"|"NONE"|"RIGHT_HAND"|string;
  export type PositiveDurationInSeconds = number;
  export interface RangedConnectionDetails {
    /**
     * Maximum transmission unit (MTU) size in bytes of a dataflow endpoint.
     */
    mtu?: RangedConnectionDetailsMtuInteger;
    /**
     * A ranged socket address.
     */
    socketAddress: RangedSocketAddress;
  }
  export type RangedConnectionDetailsMtuInteger = number;
  export interface RangedSocketAddress {
    /**
     * IPv4 socket address.
     */
    name: IpV4Address;
    /**
     * Port range of a socket address.
     */
    portRange: IntegerRange;
  }
  export interface RegisterAgentRequest {
    /**
     * Detailed information about the agent being registered.
     */
    agentDetails: AgentDetails;
    /**
     * Data for associating an agent with the capabilities it is managing.
     */
    discoveryData: DiscoveryData;
  }
  export interface RegisterAgentResponse {
    /**
     * UUID of registered agent.
     */
    agentId?: Uuid;
  }
  export interface ReserveContactRequest {
    /**
     * End time of a contact in UTC.
     */
    endTime: Timestamp;
    /**
     * Name of a ground station.
     */
    groundStation: GroundStationName;
    /**
     * ARN of a mission profile.
     */
    missionProfileArn: MissionProfileArn;
    /**
     * ARN of a satellite
     */
    satelliteArn: satelliteArn;
    /**
     * Start time of a contact in UTC.
     */
    startTime: Timestamp;
    /**
     * Tags assigned to a contact.
     */
    tags?: TagsMap;
  }
  export type RoleArn = string;
  export type S3BucketName = string;
  export type S3KeyPrefix = string;
  export interface S3Object {
    /**
     * An Amazon S3 Bucket name.
     */
    bucket?: S3BucketName;
    /**
     * An Amazon S3 key for the ephemeris.
     */
    key?: S3ObjectKey;
    /**
     * For versioned S3 objects, the version to use for the ephemeris.
     */
    version?: S3VersionId;
  }
  export type S3ObjectKey = string;
  export interface S3RecordingConfig {
    /**
     * ARN of the bucket to record to.
     */
    bucketArn: BucketArn;
    /**
     * S3 Key prefix to prefice data files.
     */
    prefix?: S3KeyPrefix;
    /**
     * ARN of the role Ground Station assumes to write data to the bucket.
     */
    roleArn: RoleArn;
  }
  export interface S3RecordingDetails {
    /**
     * ARN of the bucket used.
     */
    bucketArn?: BucketArn;
    /**
     * Key template used for the S3 Recording Configuration
     */
    keyTemplate?: String;
  }
  export type S3VersionId = string;
  export type SafeName = string;
  export type SatelliteList = SatelliteListItem[];
  export interface SatelliteListItem {
    /**
     * The current ephemeris being used to compute the trajectory of the satellite.
     */
    currentEphemeris?: EphemerisMetaData;
    /**
     * A list of ground stations to which the satellite is on-boarded.
     */
    groundStations?: GroundStationIdList;
    /**
     * NORAD satellite ID number.
     */
    noradSatelliteID?: noradSatelliteID;
    /**
     * ARN of a satellite.
     */
    satelliteArn?: satelliteArn;
    /**
     * UUID of a satellite.
     */
    satelliteId?: Uuid;
  }
  export interface SecurityDetails {
    /**
     * ARN to a role needed for connecting streams to your instances. 
     */
    roleArn: RoleArn;
    /**
     * The security groups to attach to the elastic network interfaces.
     */
    securityGroupIds: SecurityGroupIdList;
    /**
     * A list of subnets where AWS Ground Station places elastic network interfaces to send streams to your instances.
     */
    subnetIds: SubnetList;
  }
  export type SecurityGroupIdList = String[];
  export type SignatureMap = {[key: string]: Boolean};
  export interface SocketAddress {
    /**
     * Name of a socket address.
     */
    name: String;
    /**
     * Port of a socket address.
     */
    port: Integer;
  }
  export interface Source {
    /**
     * Additional details for a Config, if type is dataflow-endpoint or antenna-downlink-demod-decode 
     */
    configDetails?: ConfigDetails;
    /**
     * UUID of a Config.
     */
    configId?: String;
    /**
     * Type of a Config.
     */
    configType?: ConfigCapabilityType;
    /**
     * Region of a dataflow source.
     */
    dataflowSourceRegion?: String;
  }
  export interface SpectrumConfig {
    /**
     * Bandwidth of a spectral Config. AWS Ground Station currently has the following bandwidth limitations:   For AntennaDownlinkDemodDecodeconfig, valid values are between 125 kHz to 650 MHz.   For AntennaDownlinkconfig valid values are between 10 kHz to 54 MHz.   For AntennaUplinkConfig, valid values are between 10 kHz to 54 MHz.  
     */
    bandwidth: FrequencyBandwidth;
    /**
     * Center frequency of a spectral Config. Valid values are between 2200 to 2300 MHz and 7750 to 8400 MHz for downlink and 2025 to 2120 MHz for uplink.
     */
    centerFrequency: Frequency;
    /**
     * Polarization of a spectral Config. Capturing both "RIGHT_HAND" and "LEFT_HAND" polarization requires two separate configs.
     */
    polarization?: Polarization;
  }
  export type StatusList = ContactStatus[];
  export type String = string;
  export type SubnetList = String[];
  export interface TLEData {
    /**
     * First line of two-line element set (TLE) data.
     */
    tleLine1: TleLineOne;
    /**
     * Second line of two-line element set (TLE) data.
     */
    tleLine2: TleLineTwo;
    /**
     * The valid time range for the TLE. Gaps or overlap are not permitted.
     */
    validTimeRange: TimeRange;
  }
  export type TLEDataList = TLEData[];
  export interface TLEEphemeris {
    /**
     * Identifies the S3 object to be used as the ephemeris.
     */
    s3Object?: S3Object;
    /**
     * The data for a TLE ephemeris, supplied directly in the request rather than through an S3 object.
     */
    tleData?: TLEDataList;
  }
  export type TagKeys = UnboundedString[];
  export interface TagResourceRequest {
    /**
     * ARN of a resource tag.
     */
    resourceArn: AnyArn;
    /**
     * Tags assigned to a resource.
     */
    tags: TagsMap;
  }
  export interface TagResourceResponse {
  }
  export type TagsMap = {[key: string]: String};
  export interface TimeRange {
    /**
     * Time in UTC at which the time range ends.
     */
    endTime: Timestamp;
    /**
     * Time in UTC at which the time range starts.
     */
    startTime: Timestamp;
  }
  export type Timestamp = Date;
  export type TleLineOne = string;
  export type TleLineTwo = string;
  export interface TrackingConfig {
    /**
     * Current setting for autotrack.
     */
    autotrack: Criticality;
  }
  export type UnboundedString = string;
  export interface UntagResourceRequest {
    /**
     * ARN of a resource.
     */
    resourceArn: AnyArn;
    /**
     * Keys of a resource tag.
     */
    tagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAgentStatusRequest {
    /**
     * UUID of agent to update.
     */
    agentId: Uuid;
    /**
     * Aggregate status for agent.
     */
    aggregateStatus: AggregateStatus;
    /**
     * List of component statuses for agent.
     */
    componentStatuses: ComponentStatusList;
    /**
     * GUID of agent task.
     */
    taskId: Uuid;
  }
  export interface UpdateAgentStatusResponse {
    /**
     * UUID of updated agent.
     */
    agentId: Uuid;
  }
  export interface UpdateConfigRequest {
    /**
     * Parameters of a Config.
     */
    configData: ConfigTypeData;
    /**
     * UUID of a Config.
     */
    configId: Uuid;
    /**
     * Type of a Config.
     */
    configType: ConfigCapabilityType;
    /**
     * Name of a Config.
     */
    name: SafeName;
  }
  export interface UpdateEphemerisRequest {
    /**
     * Whether the ephemeris is enabled or not. Changing this value will not require the ephemeris to be re-validated.
     */
    enabled: Boolean;
    /**
     * The AWS Ground Station ephemeris ID.
     */
    ephemerisId: Uuid;
    /**
     * A name string associated with the ephemeris. Used as a human-readable identifier for the ephemeris.
     */
    name?: SafeName;
    /**
     * Customer-provided priority score to establish the order in which overlapping ephemerides should be used. The default for customer-provided ephemeris priority is 1, and higher numbers take precedence. Priority must be 1 or greater
     */
    priority?: EphemerisPriority;
  }
  export interface UpdateMissionProfileRequest {
    /**
     * Amount of time after a contact ends that you’d like to receive a CloudWatch event indicating the pass has finished.
     */
    contactPostPassDurationSeconds?: DurationInSeconds;
    /**
     * Amount of time after a contact ends that you’d like to receive a CloudWatch event indicating the pass has finished.
     */
    contactPrePassDurationSeconds?: DurationInSeconds;
    /**
     * A list of lists of ARNs. Each list of ARNs is an edge, with a from Config and a to Config.
     */
    dataflowEdges?: DataflowEdgeList;
    /**
     * Smallest amount of time in seconds that you’d like to see for an available contact. AWS Ground Station will not present you with contacts shorter than this duration.
     */
    minimumViableContactDurationSeconds?: PositiveDurationInSeconds;
    /**
     * UUID of a mission profile.
     */
    missionProfileId: Uuid;
    /**
     * Name of a mission profile.
     */
    name?: SafeName;
    /**
     * KMS key to use for encrypting streams.
     */
    streamsKmsKey?: KmsKey;
    /**
     * Role to use for encrypting streams with KMS key.
     */
    streamsKmsRole?: RoleArn;
    /**
     * ARN of a tracking Config.
     */
    trackingConfigArn?: ConfigArn;
  }
  export interface UplinkEchoConfig {
    /**
     * ARN of an uplink Config.
     */
    antennaUplinkConfigArn: ConfigArn;
    /**
     * Whether or not an uplink Config is enabled.
     */
    enabled: Boolean;
  }
  export interface UplinkSpectrumConfig {
    /**
     * Center frequency of an uplink spectral Config. Valid values are between 2025 to 2120 MHz.
     */
    centerFrequency: Frequency;
    /**
     * Polarization of an uplink spectral Config. Capturing both "RIGHT_HAND" and "LEFT_HAND" polarization requires two separate configs.
     */
    polarization?: Polarization;
  }
  export type Uuid = string;
  export type VersionString = string;
  export type VersionStringList = VersionString[];
  export type Year = number;
  export type noradSatelliteID = number;
  export type satelliteArn = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-05-23"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the GroundStation client.
   */
  export import Types = GroundStation;
}
export = GroundStation;
