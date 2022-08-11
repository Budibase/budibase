import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
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
   * Returns the number of minutes used by account.
   */
  getMinuteUsage(params: GroundStation.Types.GetMinuteUsageRequest, callback?: (err: AWSError, data: GroundStation.Types.GetMinuteUsageResponse) => void): Request<GroundStation.Types.GetMinuteUsageResponse, AWSError>;
  /**
   * Returns the number of minutes used by account.
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
   * Updates the Config used when scheduling contacts. Updating a Config will not update the execution parameters for existing future contacts scheduled with this Config.
   */
  updateConfig(params: GroundStation.Types.UpdateConfigRequest, callback?: (err: AWSError, data: GroundStation.Types.ConfigIdResponse) => void): Request<GroundStation.Types.ConfigIdResponse, AWSError>;
  /**
   * Updates the Config used when scheduling contacts. Updating a Config will not update the execution parameters for existing future contacts scheduled with this Config.
   */
  updateConfig(callback?: (err: AWSError, data: GroundStation.Types.ConfigIdResponse) => void): Request<GroundStation.Types.ConfigIdResponse, AWSError>;
  /**
   * Updates a mission profile. Updating a mission profile will not update the execution parameters for existing future contacts.
   */
  updateMissionProfile(params: GroundStation.Types.UpdateMissionProfileRequest, callback?: (err: AWSError, data: GroundStation.Types.MissionProfileIdResponse) => void): Request<GroundStation.Types.MissionProfileIdResponse, AWSError>;
  /**
   * Updates a mission profile. Updating a mission profile will not update the execution parameters for existing future contacts.
   */
  updateMissionProfile(callback?: (err: AWSError, data: GroundStation.Types.MissionProfileIdResponse) => void): Request<GroundStation.Types.MissionProfileIdResponse, AWSError>;
}
declare namespace GroundStation {
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
  export type BandwidthUnits = "GHz"|"MHz"|"kHz"|string;
  export type Boolean = boolean;
  export type BucketArn = string;
  export interface CancelContactRequest {
    /**
     * UUID of a contact.
     */
    contactId: String;
  }
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
  export interface ContactData {
    /**
     * UUID of a contact.
     */
    contactId?: String;
    /**
     * Status of a contact.
     */
    contactStatus?: ContactStatus;
    /**
     * End time of a contact.
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
     * Start time of a contact.
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
    contactId?: String;
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
     * Endpoint details of each endpoint in the dataflow endpoint group.
     */
    endpointDetails: EndpointDetailsList;
    /**
     * Tags of a dataflow endpoint group.
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
    minimumViableContactDurationSeconds: DurationInSeconds;
    /**
     * Name of a mission profile.
     */
    name: SafeName;
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
  export interface DataflowEndpointGroupIdResponse {
    /**
     * UUID of a dataflow endpoint group.
     */
    dataflowEndpointGroupId?: String;
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
    dataflowEndpointGroupId?: String;
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
    configId: String;
    /**
     * Type of a Config.
     */
    configType: ConfigCapabilityType;
  }
  export interface DeleteDataflowEndpointGroupRequest {
    /**
     * UUID of a dataflow endpoint group.
     */
    dataflowEndpointGroupId: String;
  }
  export interface DeleteMissionProfileRequest {
    /**
     * UUID of a mission profile.
     */
    missionProfileId: String;
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
    contactId: String;
  }
  export interface DescribeContactResponse {
    /**
     * UUID of a contact.
     */
    contactId?: String;
    /**
     * Status of a contact.
     */
    contactStatus?: ContactStatus;
    /**
     * List describing source and destination details for each dataflow edge.
     */
    dataflowList?: DataflowList;
    /**
     * End time of a contact.
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
     * Start time of a contact.
     */
    startTime?: Timestamp;
    /**
     * Tags assigned to a contact.
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
    configId?: String;
    /**
     * Type of a Config.
     */
    configType?: ConfigCapabilityType;
    /**
     * Region of a dataflow destination.
     */
    dataflowDestinationRegion?: String;
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
     * A dataflow endpoint.
     */
    endpoint?: DataflowEndpoint;
    /**
     * Endpoint security details.
     */
    securityDetails?: SecurityDetails;
  }
  export type EndpointDetailsList = EndpointDetails[];
  export type EndpointStatus = "created"|"creating"|"deleted"|"deleting"|"failed"|string;
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
  export interface GetConfigRequest {
    /**
     * UUID of a Config.
     */
    configId: String;
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
    dataflowEndpointGroupId: String;
  }
  export interface GetDataflowEndpointGroupResponse {
    /**
     * ARN of a dataflow endpoint group.
     */
    dataflowEndpointGroupArn?: DataflowEndpointGroupArn;
    /**
     * UUID of a dataflow endpoint group.
     */
    dataflowEndpointGroupId?: String;
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
    month: Integer;
    /**
     * The year being requested, in the format of YYYY.
     */
    year: Integer;
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
    missionProfileId: String;
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
    minimumViableContactDurationSeconds?: DurationInSeconds;
    /**
     * ARN of a mission profile.
     */
    missionProfileArn?: MissionProfileArn;
    /**
     * UUID of a mission profile.
     */
    missionProfileId?: String;
    /**
     * Name of a mission profile.
     */
    name?: String;
    /**
     * Region of a mission profile.
     */
    region?: String;
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
    satelliteId: String;
  }
  export interface GetSatelliteResponse {
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
    groundStationId?: String;
    /**
     * Name of a ground station.
     */
    groundStationName?: String;
    /**
     * Ground station Region.
     */
    region?: String;
  }
  export type GroundStationIdList = String[];
  export type GroundStationList = GroundStationData[];
  export type Integer = number;
  export type JsonString = string;
  export interface ListConfigsRequest {
    /**
     * Maximum number of Configs returned.
     */
    maxResults?: Integer;
    /**
     * Next token returned in the request of a previous ListConfigs call. Used to get the next page of results.
     */
    nextToken?: String;
  }
  export interface ListConfigsResponse {
    /**
     * List of Config items.
     */
    configList?: ConfigList;
    /**
     * Next token returned in the response of a previous ListConfigs call. Used to get the next page of results.
     */
    nextToken?: String;
  }
  export interface ListContactsRequest {
    /**
     * End time of a contact.
     */
    endTime: Timestamp;
    /**
     * Name of a ground station.
     */
    groundStation?: String;
    /**
     * Maximum number of contacts returned.
     */
    maxResults?: Integer;
    /**
     * ARN of a mission profile.
     */
    missionProfileArn?: MissionProfileArn;
    /**
     * Next token returned in the request of a previous ListContacts call. Used to get the next page of results.
     */
    nextToken?: String;
    /**
     * ARN of a satellite.
     */
    satelliteArn?: satelliteArn;
    /**
     * Start time of a contact.
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
    nextToken?: String;
  }
  export interface ListDataflowEndpointGroupsRequest {
    /**
     * Maximum number of dataflow endpoint groups returned.
     */
    maxResults?: Integer;
    /**
     * Next token returned in the request of a previous ListDataflowEndpointGroups call. Used to get the next page of results.
     */
    nextToken?: String;
  }
  export interface ListDataflowEndpointGroupsResponse {
    /**
     * A list of dataflow endpoint groups.
     */
    dataflowEndpointGroupList?: DataflowEndpointGroupList;
    /**
     * Next token returned in the response of a previous ListDataflowEndpointGroups call. Used to get the next page of results.
     */
    nextToken?: String;
  }
  export interface ListGroundStationsRequest {
    /**
     * Maximum number of ground stations returned.
     */
    maxResults?: Integer;
    /**
     * Next token that can be supplied in the next call to get the next page of ground stations.
     */
    nextToken?: String;
    /**
     * Satellite ID to retrieve on-boarded ground stations.
     */
    satelliteId?: String;
  }
  export interface ListGroundStationsResponse {
    /**
     * List of ground stations.
     */
    groundStationList?: GroundStationList;
    /**
     * Next token that can be supplied in the next call to get the next page of ground stations.
     */
    nextToken?: String;
  }
  export interface ListMissionProfilesRequest {
    /**
     * Maximum number of mission profiles returned.
     */
    maxResults?: Integer;
    /**
     * Next token returned in the request of a previous ListMissionProfiles call. Used to get the next page of results.
     */
    nextToken?: String;
  }
  export interface ListMissionProfilesResponse {
    /**
     * List of mission profiles.
     */
    missionProfileList?: MissionProfileList;
    /**
     * Next token returned in the response of a previous ListMissionProfiles call. Used to get the next page of results.
     */
    nextToken?: String;
  }
  export interface ListSatellitesRequest {
    /**
     * Maximum number of satellites returned.
     */
    maxResults?: Integer;
    /**
     * Next token that can be supplied in the next call to get the next page of satellites.
     */
    nextToken?: String;
  }
  export interface ListSatellitesResponse {
    /**
     * Next token that can be supplied in the next call to get the next page of satellites.
     */
    nextToken?: String;
    /**
     * List of satellites.
     */
    satellites?: SatelliteList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * ARN of a resource.
     */
    resourceArn: String;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Tags assigned to a resource.
     */
    tags?: TagsMap;
  }
  export type MissionProfileArn = string;
  export interface MissionProfileIdResponse {
    /**
     * UUID of a mission profile.
     */
    missionProfileId?: String;
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
    missionProfileId?: String;
    /**
     * Name of a mission profile.
     */
    name?: String;
    /**
     * Region of a mission profile.
     */
    region?: String;
  }
  export type Polarization = "LEFT_HAND"|"NONE"|"RIGHT_HAND"|string;
  export interface ReserveContactRequest {
    /**
     * End time of a contact.
     */
    endTime: Timestamp;
    /**
     * Name of a ground station.
     */
    groundStation: String;
    /**
     * ARN of a mission profile.
     */
    missionProfileArn: MissionProfileArn;
    /**
     * ARN of a satellite
     */
    satelliteArn: satelliteArn;
    /**
     * Start time of a contact.
     */
    startTime: Timestamp;
    /**
     * Tags assigned to a contact.
     */
    tags?: TagsMap;
  }
  export type RoleArn = string;
  export type S3KeyPrefix = string;
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
     * Template of the S3 key used.
     */
    keyTemplate?: String;
  }
  export type SafeName = string;
  export type SatelliteList = SatelliteListItem[];
  export interface SatelliteListItem {
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
     * Additional details for a Config, if type is dataflow endpoint or antenna demod decode.
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
  export type TagKeys = String[];
  export interface TagResourceRequest {
    /**
     * ARN of a resource tag.
     */
    resourceArn: String;
    /**
     * Tags assigned to a resource.
     */
    tags: TagsMap;
  }
  export interface TagResourceResponse {
  }
  export type TagsMap = {[key: string]: String};
  export type Timestamp = Date;
  export interface TrackingConfig {
    /**
     * Current setting for autotrack.
     */
    autotrack: Criticality;
  }
  export interface UntagResourceRequest {
    /**
     * ARN of a resource.
     */
    resourceArn: String;
    /**
     * Keys of a resource tag.
     */
    tagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateConfigRequest {
    /**
     * Parameters of a Config.
     */
    configData: ConfigTypeData;
    /**
     * UUID of a Config.
     */
    configId: String;
    /**
     * Type of a Config.
     */
    configType: ConfigCapabilityType;
    /**
     * Name of a Config.
     */
    name: SafeName;
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
    minimumViableContactDurationSeconds?: DurationInSeconds;
    /**
     * UUID of a mission profile.
     */
    missionProfileId: String;
    /**
     * Name of a mission profile.
     */
    name?: SafeName;
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
