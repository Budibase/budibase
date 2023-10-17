import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IoTWireless extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IoTWireless.Types.ClientConfiguration)
  config: Config & IoTWireless.Types.ClientConfiguration;
  /**
   * Associates a partner account with your AWS account.
   */
  associateAwsAccountWithPartnerAccount(params: IoTWireless.Types.AssociateAwsAccountWithPartnerAccountRequest, callback?: (err: AWSError, data: IoTWireless.Types.AssociateAwsAccountWithPartnerAccountResponse) => void): Request<IoTWireless.Types.AssociateAwsAccountWithPartnerAccountResponse, AWSError>;
  /**
   * Associates a partner account with your AWS account.
   */
  associateAwsAccountWithPartnerAccount(callback?: (err: AWSError, data: IoTWireless.Types.AssociateAwsAccountWithPartnerAccountResponse) => void): Request<IoTWireless.Types.AssociateAwsAccountWithPartnerAccountResponse, AWSError>;
  /**
   * Associates a wireless device with a thing.
   */
  associateWirelessDeviceWithThing(params: IoTWireless.Types.AssociateWirelessDeviceWithThingRequest, callback?: (err: AWSError, data: IoTWireless.Types.AssociateWirelessDeviceWithThingResponse) => void): Request<IoTWireless.Types.AssociateWirelessDeviceWithThingResponse, AWSError>;
  /**
   * Associates a wireless device with a thing.
   */
  associateWirelessDeviceWithThing(callback?: (err: AWSError, data: IoTWireless.Types.AssociateWirelessDeviceWithThingResponse) => void): Request<IoTWireless.Types.AssociateWirelessDeviceWithThingResponse, AWSError>;
  /**
   * Associates a wireless gateway with a certificate.
   */
  associateWirelessGatewayWithCertificate(params: IoTWireless.Types.AssociateWirelessGatewayWithCertificateRequest, callback?: (err: AWSError, data: IoTWireless.Types.AssociateWirelessGatewayWithCertificateResponse) => void): Request<IoTWireless.Types.AssociateWirelessGatewayWithCertificateResponse, AWSError>;
  /**
   * Associates a wireless gateway with a certificate.
   */
  associateWirelessGatewayWithCertificate(callback?: (err: AWSError, data: IoTWireless.Types.AssociateWirelessGatewayWithCertificateResponse) => void): Request<IoTWireless.Types.AssociateWirelessGatewayWithCertificateResponse, AWSError>;
  /**
   * Associates a wireless gateway with a thing.
   */
  associateWirelessGatewayWithThing(params: IoTWireless.Types.AssociateWirelessGatewayWithThingRequest, callback?: (err: AWSError, data: IoTWireless.Types.AssociateWirelessGatewayWithThingResponse) => void): Request<IoTWireless.Types.AssociateWirelessGatewayWithThingResponse, AWSError>;
  /**
   * Associates a wireless gateway with a thing.
   */
  associateWirelessGatewayWithThing(callback?: (err: AWSError, data: IoTWireless.Types.AssociateWirelessGatewayWithThingResponse) => void): Request<IoTWireless.Types.AssociateWirelessGatewayWithThingResponse, AWSError>;
  /**
   * Creates a new destination that maps a device message to an AWS IoT rule.
   */
  createDestination(params: IoTWireless.Types.CreateDestinationRequest, callback?: (err: AWSError, data: IoTWireless.Types.CreateDestinationResponse) => void): Request<IoTWireless.Types.CreateDestinationResponse, AWSError>;
  /**
   * Creates a new destination that maps a device message to an AWS IoT rule.
   */
  createDestination(callback?: (err: AWSError, data: IoTWireless.Types.CreateDestinationResponse) => void): Request<IoTWireless.Types.CreateDestinationResponse, AWSError>;
  /**
   * Creates a new device profile.
   */
  createDeviceProfile(params: IoTWireless.Types.CreateDeviceProfileRequest, callback?: (err: AWSError, data: IoTWireless.Types.CreateDeviceProfileResponse) => void): Request<IoTWireless.Types.CreateDeviceProfileResponse, AWSError>;
  /**
   * Creates a new device profile.
   */
  createDeviceProfile(callback?: (err: AWSError, data: IoTWireless.Types.CreateDeviceProfileResponse) => void): Request<IoTWireless.Types.CreateDeviceProfileResponse, AWSError>;
  /**
   * Creates a new service profile.
   */
  createServiceProfile(params: IoTWireless.Types.CreateServiceProfileRequest, callback?: (err: AWSError, data: IoTWireless.Types.CreateServiceProfileResponse) => void): Request<IoTWireless.Types.CreateServiceProfileResponse, AWSError>;
  /**
   * Creates a new service profile.
   */
  createServiceProfile(callback?: (err: AWSError, data: IoTWireless.Types.CreateServiceProfileResponse) => void): Request<IoTWireless.Types.CreateServiceProfileResponse, AWSError>;
  /**
   * Provisions a wireless device.
   */
  createWirelessDevice(params: IoTWireless.Types.CreateWirelessDeviceRequest, callback?: (err: AWSError, data: IoTWireless.Types.CreateWirelessDeviceResponse) => void): Request<IoTWireless.Types.CreateWirelessDeviceResponse, AWSError>;
  /**
   * Provisions a wireless device.
   */
  createWirelessDevice(callback?: (err: AWSError, data: IoTWireless.Types.CreateWirelessDeviceResponse) => void): Request<IoTWireless.Types.CreateWirelessDeviceResponse, AWSError>;
  /**
   * Provisions a wireless gateway.
   */
  createWirelessGateway(params: IoTWireless.Types.CreateWirelessGatewayRequest, callback?: (err: AWSError, data: IoTWireless.Types.CreateWirelessGatewayResponse) => void): Request<IoTWireless.Types.CreateWirelessGatewayResponse, AWSError>;
  /**
   * Provisions a wireless gateway.
   */
  createWirelessGateway(callback?: (err: AWSError, data: IoTWireless.Types.CreateWirelessGatewayResponse) => void): Request<IoTWireless.Types.CreateWirelessGatewayResponse, AWSError>;
  /**
   * Creates a task for a wireless gateway.
   */
  createWirelessGatewayTask(params: IoTWireless.Types.CreateWirelessGatewayTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.CreateWirelessGatewayTaskResponse) => void): Request<IoTWireless.Types.CreateWirelessGatewayTaskResponse, AWSError>;
  /**
   * Creates a task for a wireless gateway.
   */
  createWirelessGatewayTask(callback?: (err: AWSError, data: IoTWireless.Types.CreateWirelessGatewayTaskResponse) => void): Request<IoTWireless.Types.CreateWirelessGatewayTaskResponse, AWSError>;
  /**
   * Creates a gateway task definition.
   */
  createWirelessGatewayTaskDefinition(params: IoTWireless.Types.CreateWirelessGatewayTaskDefinitionRequest, callback?: (err: AWSError, data: IoTWireless.Types.CreateWirelessGatewayTaskDefinitionResponse) => void): Request<IoTWireless.Types.CreateWirelessGatewayTaskDefinitionResponse, AWSError>;
  /**
   * Creates a gateway task definition.
   */
  createWirelessGatewayTaskDefinition(callback?: (err: AWSError, data: IoTWireless.Types.CreateWirelessGatewayTaskDefinitionResponse) => void): Request<IoTWireless.Types.CreateWirelessGatewayTaskDefinitionResponse, AWSError>;
  /**
   * Deletes a destination.
   */
  deleteDestination(params: IoTWireless.Types.DeleteDestinationRequest, callback?: (err: AWSError, data: IoTWireless.Types.DeleteDestinationResponse) => void): Request<IoTWireless.Types.DeleteDestinationResponse, AWSError>;
  /**
   * Deletes a destination.
   */
  deleteDestination(callback?: (err: AWSError, data: IoTWireless.Types.DeleteDestinationResponse) => void): Request<IoTWireless.Types.DeleteDestinationResponse, AWSError>;
  /**
   * Deletes a device profile.
   */
  deleteDeviceProfile(params: IoTWireless.Types.DeleteDeviceProfileRequest, callback?: (err: AWSError, data: IoTWireless.Types.DeleteDeviceProfileResponse) => void): Request<IoTWireless.Types.DeleteDeviceProfileResponse, AWSError>;
  /**
   * Deletes a device profile.
   */
  deleteDeviceProfile(callback?: (err: AWSError, data: IoTWireless.Types.DeleteDeviceProfileResponse) => void): Request<IoTWireless.Types.DeleteDeviceProfileResponse, AWSError>;
  /**
   * Deletes a service profile.
   */
  deleteServiceProfile(params: IoTWireless.Types.DeleteServiceProfileRequest, callback?: (err: AWSError, data: IoTWireless.Types.DeleteServiceProfileResponse) => void): Request<IoTWireless.Types.DeleteServiceProfileResponse, AWSError>;
  /**
   * Deletes a service profile.
   */
  deleteServiceProfile(callback?: (err: AWSError, data: IoTWireless.Types.DeleteServiceProfileResponse) => void): Request<IoTWireless.Types.DeleteServiceProfileResponse, AWSError>;
  /**
   * Deletes a wireless device.
   */
  deleteWirelessDevice(params: IoTWireless.Types.DeleteWirelessDeviceRequest, callback?: (err: AWSError, data: IoTWireless.Types.DeleteWirelessDeviceResponse) => void): Request<IoTWireless.Types.DeleteWirelessDeviceResponse, AWSError>;
  /**
   * Deletes a wireless device.
   */
  deleteWirelessDevice(callback?: (err: AWSError, data: IoTWireless.Types.DeleteWirelessDeviceResponse) => void): Request<IoTWireless.Types.DeleteWirelessDeviceResponse, AWSError>;
  /**
   * Deletes a wireless gateway.
   */
  deleteWirelessGateway(params: IoTWireless.Types.DeleteWirelessGatewayRequest, callback?: (err: AWSError, data: IoTWireless.Types.DeleteWirelessGatewayResponse) => void): Request<IoTWireless.Types.DeleteWirelessGatewayResponse, AWSError>;
  /**
   * Deletes a wireless gateway.
   */
  deleteWirelessGateway(callback?: (err: AWSError, data: IoTWireless.Types.DeleteWirelessGatewayResponse) => void): Request<IoTWireless.Types.DeleteWirelessGatewayResponse, AWSError>;
  /**
   * Deletes a wireless gateway task.
   */
  deleteWirelessGatewayTask(params: IoTWireless.Types.DeleteWirelessGatewayTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.DeleteWirelessGatewayTaskResponse) => void): Request<IoTWireless.Types.DeleteWirelessGatewayTaskResponse, AWSError>;
  /**
   * Deletes a wireless gateway task.
   */
  deleteWirelessGatewayTask(callback?: (err: AWSError, data: IoTWireless.Types.DeleteWirelessGatewayTaskResponse) => void): Request<IoTWireless.Types.DeleteWirelessGatewayTaskResponse, AWSError>;
  /**
   * Deletes a wireless gateway task definition. Deleting this task definition does not affect tasks that are currently in progress.
   */
  deleteWirelessGatewayTaskDefinition(params: IoTWireless.Types.DeleteWirelessGatewayTaskDefinitionRequest, callback?: (err: AWSError, data: IoTWireless.Types.DeleteWirelessGatewayTaskDefinitionResponse) => void): Request<IoTWireless.Types.DeleteWirelessGatewayTaskDefinitionResponse, AWSError>;
  /**
   * Deletes a wireless gateway task definition. Deleting this task definition does not affect tasks that are currently in progress.
   */
  deleteWirelessGatewayTaskDefinition(callback?: (err: AWSError, data: IoTWireless.Types.DeleteWirelessGatewayTaskDefinitionResponse) => void): Request<IoTWireless.Types.DeleteWirelessGatewayTaskDefinitionResponse, AWSError>;
  /**
   * Disassociates your AWS account from a partner account. If PartnerAccountId and PartnerType are null, disassociates your AWS account from all partner accounts.
   */
  disassociateAwsAccountFromPartnerAccount(params: IoTWireless.Types.DisassociateAwsAccountFromPartnerAccountRequest, callback?: (err: AWSError, data: IoTWireless.Types.DisassociateAwsAccountFromPartnerAccountResponse) => void): Request<IoTWireless.Types.DisassociateAwsAccountFromPartnerAccountResponse, AWSError>;
  /**
   * Disassociates your AWS account from a partner account. If PartnerAccountId and PartnerType are null, disassociates your AWS account from all partner accounts.
   */
  disassociateAwsAccountFromPartnerAccount(callback?: (err: AWSError, data: IoTWireless.Types.DisassociateAwsAccountFromPartnerAccountResponse) => void): Request<IoTWireless.Types.DisassociateAwsAccountFromPartnerAccountResponse, AWSError>;
  /**
   * Disassociates a wireless device from its currently associated thing.
   */
  disassociateWirelessDeviceFromThing(params: IoTWireless.Types.DisassociateWirelessDeviceFromThingRequest, callback?: (err: AWSError, data: IoTWireless.Types.DisassociateWirelessDeviceFromThingResponse) => void): Request<IoTWireless.Types.DisassociateWirelessDeviceFromThingResponse, AWSError>;
  /**
   * Disassociates a wireless device from its currently associated thing.
   */
  disassociateWirelessDeviceFromThing(callback?: (err: AWSError, data: IoTWireless.Types.DisassociateWirelessDeviceFromThingResponse) => void): Request<IoTWireless.Types.DisassociateWirelessDeviceFromThingResponse, AWSError>;
  /**
   * Disassociates a wireless gateway from its currently associated certificate.
   */
  disassociateWirelessGatewayFromCertificate(params: IoTWireless.Types.DisassociateWirelessGatewayFromCertificateRequest, callback?: (err: AWSError, data: IoTWireless.Types.DisassociateWirelessGatewayFromCertificateResponse) => void): Request<IoTWireless.Types.DisassociateWirelessGatewayFromCertificateResponse, AWSError>;
  /**
   * Disassociates a wireless gateway from its currently associated certificate.
   */
  disassociateWirelessGatewayFromCertificate(callback?: (err: AWSError, data: IoTWireless.Types.DisassociateWirelessGatewayFromCertificateResponse) => void): Request<IoTWireless.Types.DisassociateWirelessGatewayFromCertificateResponse, AWSError>;
  /**
   * Disassociates a wireless gateway from its currently associated thing.
   */
  disassociateWirelessGatewayFromThing(params: IoTWireless.Types.DisassociateWirelessGatewayFromThingRequest, callback?: (err: AWSError, data: IoTWireless.Types.DisassociateWirelessGatewayFromThingResponse) => void): Request<IoTWireless.Types.DisassociateWirelessGatewayFromThingResponse, AWSError>;
  /**
   * Disassociates a wireless gateway from its currently associated thing.
   */
  disassociateWirelessGatewayFromThing(callback?: (err: AWSError, data: IoTWireless.Types.DisassociateWirelessGatewayFromThingResponse) => void): Request<IoTWireless.Types.DisassociateWirelessGatewayFromThingResponse, AWSError>;
  /**
   * Gets information about a destination.
   */
  getDestination(params: IoTWireless.Types.GetDestinationRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetDestinationResponse) => void): Request<IoTWireless.Types.GetDestinationResponse, AWSError>;
  /**
   * Gets information about a destination.
   */
  getDestination(callback?: (err: AWSError, data: IoTWireless.Types.GetDestinationResponse) => void): Request<IoTWireless.Types.GetDestinationResponse, AWSError>;
  /**
   * Gets information about a device profile.
   */
  getDeviceProfile(params: IoTWireless.Types.GetDeviceProfileRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetDeviceProfileResponse) => void): Request<IoTWireless.Types.GetDeviceProfileResponse, AWSError>;
  /**
   * Gets information about a device profile.
   */
  getDeviceProfile(callback?: (err: AWSError, data: IoTWireless.Types.GetDeviceProfileResponse) => void): Request<IoTWireless.Types.GetDeviceProfileResponse, AWSError>;
  /**
   * Returns current default log levels or log levels by resource types. Based on resource types, log levels can be for wireless device log options or wireless gateway log options.
   */
  getLogLevelsByResourceTypes(params: IoTWireless.Types.GetLogLevelsByResourceTypesRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetLogLevelsByResourceTypesResponse) => void): Request<IoTWireless.Types.GetLogLevelsByResourceTypesResponse, AWSError>;
  /**
   * Returns current default log levels or log levels by resource types. Based on resource types, log levels can be for wireless device log options or wireless gateway log options.
   */
  getLogLevelsByResourceTypes(callback?: (err: AWSError, data: IoTWireless.Types.GetLogLevelsByResourceTypesResponse) => void): Request<IoTWireless.Types.GetLogLevelsByResourceTypesResponse, AWSError>;
  /**
   * Gets information about a partner account. If PartnerAccountId and PartnerType are null, returns all partner accounts.
   */
  getPartnerAccount(params: IoTWireless.Types.GetPartnerAccountRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetPartnerAccountResponse) => void): Request<IoTWireless.Types.GetPartnerAccountResponse, AWSError>;
  /**
   * Gets information about a partner account. If PartnerAccountId and PartnerType are null, returns all partner accounts.
   */
  getPartnerAccount(callback?: (err: AWSError, data: IoTWireless.Types.GetPartnerAccountResponse) => void): Request<IoTWireless.Types.GetPartnerAccountResponse, AWSError>;
  /**
   * Fetches the log-level override, if any, for a given resource-ID and resource-type. It can be used for a wireless device or a wireless gateway.
   */
  getResourceLogLevel(params: IoTWireless.Types.GetResourceLogLevelRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetResourceLogLevelResponse) => void): Request<IoTWireless.Types.GetResourceLogLevelResponse, AWSError>;
  /**
   * Fetches the log-level override, if any, for a given resource-ID and resource-type. It can be used for a wireless device or a wireless gateway.
   */
  getResourceLogLevel(callback?: (err: AWSError, data: IoTWireless.Types.GetResourceLogLevelResponse) => void): Request<IoTWireless.Types.GetResourceLogLevelResponse, AWSError>;
  /**
   * Gets the account-specific endpoint for Configuration and Update Server (CUPS) protocol or LoRaWAN Network Server (LNS) connections.
   */
  getServiceEndpoint(params: IoTWireless.Types.GetServiceEndpointRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetServiceEndpointResponse) => void): Request<IoTWireless.Types.GetServiceEndpointResponse, AWSError>;
  /**
   * Gets the account-specific endpoint for Configuration and Update Server (CUPS) protocol or LoRaWAN Network Server (LNS) connections.
   */
  getServiceEndpoint(callback?: (err: AWSError, data: IoTWireless.Types.GetServiceEndpointResponse) => void): Request<IoTWireless.Types.GetServiceEndpointResponse, AWSError>;
  /**
   * Gets information about a service profile.
   */
  getServiceProfile(params: IoTWireless.Types.GetServiceProfileRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetServiceProfileResponse) => void): Request<IoTWireless.Types.GetServiceProfileResponse, AWSError>;
  /**
   * Gets information about a service profile.
   */
  getServiceProfile(callback?: (err: AWSError, data: IoTWireless.Types.GetServiceProfileResponse) => void): Request<IoTWireless.Types.GetServiceProfileResponse, AWSError>;
  /**
   * Gets information about a wireless device.
   */
  getWirelessDevice(params: IoTWireless.Types.GetWirelessDeviceRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessDeviceResponse) => void): Request<IoTWireless.Types.GetWirelessDeviceResponse, AWSError>;
  /**
   * Gets information about a wireless device.
   */
  getWirelessDevice(callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessDeviceResponse) => void): Request<IoTWireless.Types.GetWirelessDeviceResponse, AWSError>;
  /**
   * Gets operating information about a wireless device.
   */
  getWirelessDeviceStatistics(params: IoTWireless.Types.GetWirelessDeviceStatisticsRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessDeviceStatisticsResponse) => void): Request<IoTWireless.Types.GetWirelessDeviceStatisticsResponse, AWSError>;
  /**
   * Gets operating information about a wireless device.
   */
  getWirelessDeviceStatistics(callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessDeviceStatisticsResponse) => void): Request<IoTWireless.Types.GetWirelessDeviceStatisticsResponse, AWSError>;
  /**
   * Gets information about a wireless gateway.
   */
  getWirelessGateway(params: IoTWireless.Types.GetWirelessGatewayRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessGatewayResponse) => void): Request<IoTWireless.Types.GetWirelessGatewayResponse, AWSError>;
  /**
   * Gets information about a wireless gateway.
   */
  getWirelessGateway(callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessGatewayResponse) => void): Request<IoTWireless.Types.GetWirelessGatewayResponse, AWSError>;
  /**
   * Gets the ID of the certificate that is currently associated with a wireless gateway.
   */
  getWirelessGatewayCertificate(params: IoTWireless.Types.GetWirelessGatewayCertificateRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessGatewayCertificateResponse) => void): Request<IoTWireless.Types.GetWirelessGatewayCertificateResponse, AWSError>;
  /**
   * Gets the ID of the certificate that is currently associated with a wireless gateway.
   */
  getWirelessGatewayCertificate(callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessGatewayCertificateResponse) => void): Request<IoTWireless.Types.GetWirelessGatewayCertificateResponse, AWSError>;
  /**
   * Gets the firmware version and other information about a wireless gateway.
   */
  getWirelessGatewayFirmwareInformation(params: IoTWireless.Types.GetWirelessGatewayFirmwareInformationRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessGatewayFirmwareInformationResponse) => void): Request<IoTWireless.Types.GetWirelessGatewayFirmwareInformationResponse, AWSError>;
  /**
   * Gets the firmware version and other information about a wireless gateway.
   */
  getWirelessGatewayFirmwareInformation(callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessGatewayFirmwareInformationResponse) => void): Request<IoTWireless.Types.GetWirelessGatewayFirmwareInformationResponse, AWSError>;
  /**
   * Gets operating information about a wireless gateway.
   */
  getWirelessGatewayStatistics(params: IoTWireless.Types.GetWirelessGatewayStatisticsRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessGatewayStatisticsResponse) => void): Request<IoTWireless.Types.GetWirelessGatewayStatisticsResponse, AWSError>;
  /**
   * Gets operating information about a wireless gateway.
   */
  getWirelessGatewayStatistics(callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessGatewayStatisticsResponse) => void): Request<IoTWireless.Types.GetWirelessGatewayStatisticsResponse, AWSError>;
  /**
   * Gets information about a wireless gateway task.
   */
  getWirelessGatewayTask(params: IoTWireless.Types.GetWirelessGatewayTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessGatewayTaskResponse) => void): Request<IoTWireless.Types.GetWirelessGatewayTaskResponse, AWSError>;
  /**
   * Gets information about a wireless gateway task.
   */
  getWirelessGatewayTask(callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessGatewayTaskResponse) => void): Request<IoTWireless.Types.GetWirelessGatewayTaskResponse, AWSError>;
  /**
   * Gets information about a wireless gateway task definition.
   */
  getWirelessGatewayTaskDefinition(params: IoTWireless.Types.GetWirelessGatewayTaskDefinitionRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessGatewayTaskDefinitionResponse) => void): Request<IoTWireless.Types.GetWirelessGatewayTaskDefinitionResponse, AWSError>;
  /**
   * Gets information about a wireless gateway task definition.
   */
  getWirelessGatewayTaskDefinition(callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessGatewayTaskDefinitionResponse) => void): Request<IoTWireless.Types.GetWirelessGatewayTaskDefinitionResponse, AWSError>;
  /**
   * Lists the destinations registered to your AWS account.
   */
  listDestinations(params: IoTWireless.Types.ListDestinationsRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListDestinationsResponse) => void): Request<IoTWireless.Types.ListDestinationsResponse, AWSError>;
  /**
   * Lists the destinations registered to your AWS account.
   */
  listDestinations(callback?: (err: AWSError, data: IoTWireless.Types.ListDestinationsResponse) => void): Request<IoTWireless.Types.ListDestinationsResponse, AWSError>;
  /**
   * Lists the device profiles registered to your AWS account.
   */
  listDeviceProfiles(params: IoTWireless.Types.ListDeviceProfilesRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListDeviceProfilesResponse) => void): Request<IoTWireless.Types.ListDeviceProfilesResponse, AWSError>;
  /**
   * Lists the device profiles registered to your AWS account.
   */
  listDeviceProfiles(callback?: (err: AWSError, data: IoTWireless.Types.ListDeviceProfilesResponse) => void): Request<IoTWireless.Types.ListDeviceProfilesResponse, AWSError>;
  /**
   * Lists the partner accounts associated with your AWS account.
   */
  listPartnerAccounts(params: IoTWireless.Types.ListPartnerAccountsRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListPartnerAccountsResponse) => void): Request<IoTWireless.Types.ListPartnerAccountsResponse, AWSError>;
  /**
   * Lists the partner accounts associated with your AWS account.
   */
  listPartnerAccounts(callback?: (err: AWSError, data: IoTWireless.Types.ListPartnerAccountsResponse) => void): Request<IoTWireless.Types.ListPartnerAccountsResponse, AWSError>;
  /**
   * Lists the service profiles registered to your AWS account.
   */
  listServiceProfiles(params: IoTWireless.Types.ListServiceProfilesRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListServiceProfilesResponse) => void): Request<IoTWireless.Types.ListServiceProfilesResponse, AWSError>;
  /**
   * Lists the service profiles registered to your AWS account.
   */
  listServiceProfiles(callback?: (err: AWSError, data: IoTWireless.Types.ListServiceProfilesResponse) => void): Request<IoTWireless.Types.ListServiceProfilesResponse, AWSError>;
  /**
   * Lists the tags (metadata) you have assigned to the resource.
   */
  listTagsForResource(params: IoTWireless.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListTagsForResourceResponse) => void): Request<IoTWireless.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags (metadata) you have assigned to the resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: IoTWireless.Types.ListTagsForResourceResponse) => void): Request<IoTWireless.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the wireless devices registered to your AWS account.
   */
  listWirelessDevices(params: IoTWireless.Types.ListWirelessDevicesRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListWirelessDevicesResponse) => void): Request<IoTWireless.Types.ListWirelessDevicesResponse, AWSError>;
  /**
   * Lists the wireless devices registered to your AWS account.
   */
  listWirelessDevices(callback?: (err: AWSError, data: IoTWireless.Types.ListWirelessDevicesResponse) => void): Request<IoTWireless.Types.ListWirelessDevicesResponse, AWSError>;
  /**
   * List the wireless gateway tasks definitions registered to your AWS account.
   */
  listWirelessGatewayTaskDefinitions(params: IoTWireless.Types.ListWirelessGatewayTaskDefinitionsRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListWirelessGatewayTaskDefinitionsResponse) => void): Request<IoTWireless.Types.ListWirelessGatewayTaskDefinitionsResponse, AWSError>;
  /**
   * List the wireless gateway tasks definitions registered to your AWS account.
   */
  listWirelessGatewayTaskDefinitions(callback?: (err: AWSError, data: IoTWireless.Types.ListWirelessGatewayTaskDefinitionsResponse) => void): Request<IoTWireless.Types.ListWirelessGatewayTaskDefinitionsResponse, AWSError>;
  /**
   * Lists the wireless gateways registered to your AWS account.
   */
  listWirelessGateways(params: IoTWireless.Types.ListWirelessGatewaysRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListWirelessGatewaysResponse) => void): Request<IoTWireless.Types.ListWirelessGatewaysResponse, AWSError>;
  /**
   * Lists the wireless gateways registered to your AWS account.
   */
  listWirelessGateways(callback?: (err: AWSError, data: IoTWireless.Types.ListWirelessGatewaysResponse) => void): Request<IoTWireless.Types.ListWirelessGatewaysResponse, AWSError>;
  /**
   * Sets the log-level override for a resource-ID and resource-type. This option can be specified for a wireless gateway or a wireless device. A limit of 200 log level override can be set per account.
   */
  putResourceLogLevel(params: IoTWireless.Types.PutResourceLogLevelRequest, callback?: (err: AWSError, data: IoTWireless.Types.PutResourceLogLevelResponse) => void): Request<IoTWireless.Types.PutResourceLogLevelResponse, AWSError>;
  /**
   * Sets the log-level override for a resource-ID and resource-type. This option can be specified for a wireless gateway or a wireless device. A limit of 200 log level override can be set per account.
   */
  putResourceLogLevel(callback?: (err: AWSError, data: IoTWireless.Types.PutResourceLogLevelResponse) => void): Request<IoTWireless.Types.PutResourceLogLevelResponse, AWSError>;
  /**
   * Removes the log-level overrides for all resources; both wireless devices and wireless gateways.
   */
  resetAllResourceLogLevels(params: IoTWireless.Types.ResetAllResourceLogLevelsRequest, callback?: (err: AWSError, data: IoTWireless.Types.ResetAllResourceLogLevelsResponse) => void): Request<IoTWireless.Types.ResetAllResourceLogLevelsResponse, AWSError>;
  /**
   * Removes the log-level overrides for all resources; both wireless devices and wireless gateways.
   */
  resetAllResourceLogLevels(callback?: (err: AWSError, data: IoTWireless.Types.ResetAllResourceLogLevelsResponse) => void): Request<IoTWireless.Types.ResetAllResourceLogLevelsResponse, AWSError>;
  /**
   * Removes the log-level override, if any, for a specific resource-ID and resource-type. It can be used for a wireless device or a wireless gateway.
   */
  resetResourceLogLevel(params: IoTWireless.Types.ResetResourceLogLevelRequest, callback?: (err: AWSError, data: IoTWireless.Types.ResetResourceLogLevelResponse) => void): Request<IoTWireless.Types.ResetResourceLogLevelResponse, AWSError>;
  /**
   * Removes the log-level override, if any, for a specific resource-ID and resource-type. It can be used for a wireless device or a wireless gateway.
   */
  resetResourceLogLevel(callback?: (err: AWSError, data: IoTWireless.Types.ResetResourceLogLevelResponse) => void): Request<IoTWireless.Types.ResetResourceLogLevelResponse, AWSError>;
  /**
   * Sends a decrypted application data frame to a device.
   */
  sendDataToWirelessDevice(params: IoTWireless.Types.SendDataToWirelessDeviceRequest, callback?: (err: AWSError, data: IoTWireless.Types.SendDataToWirelessDeviceResponse) => void): Request<IoTWireless.Types.SendDataToWirelessDeviceResponse, AWSError>;
  /**
   * Sends a decrypted application data frame to a device.
   */
  sendDataToWirelessDevice(callback?: (err: AWSError, data: IoTWireless.Types.SendDataToWirelessDeviceResponse) => void): Request<IoTWireless.Types.SendDataToWirelessDeviceResponse, AWSError>;
  /**
   * Adds a tag to a resource.
   */
  tagResource(params: IoTWireless.Types.TagResourceRequest, callback?: (err: AWSError, data: IoTWireless.Types.TagResourceResponse) => void): Request<IoTWireless.Types.TagResourceResponse, AWSError>;
  /**
   * Adds a tag to a resource.
   */
  tagResource(callback?: (err: AWSError, data: IoTWireless.Types.TagResourceResponse) => void): Request<IoTWireless.Types.TagResourceResponse, AWSError>;
  /**
   * Simulates a provisioned device by sending an uplink data payload of Hello.
   */
  testWirelessDevice(params: IoTWireless.Types.TestWirelessDeviceRequest, callback?: (err: AWSError, data: IoTWireless.Types.TestWirelessDeviceResponse) => void): Request<IoTWireless.Types.TestWirelessDeviceResponse, AWSError>;
  /**
   * Simulates a provisioned device by sending an uplink data payload of Hello.
   */
  testWirelessDevice(callback?: (err: AWSError, data: IoTWireless.Types.TestWirelessDeviceResponse) => void): Request<IoTWireless.Types.TestWirelessDeviceResponse, AWSError>;
  /**
   * Removes one or more tags from a resource.
   */
  untagResource(params: IoTWireless.Types.UntagResourceRequest, callback?: (err: AWSError, data: IoTWireless.Types.UntagResourceResponse) => void): Request<IoTWireless.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: IoTWireless.Types.UntagResourceResponse) => void): Request<IoTWireless.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates properties of a destination.
   */
  updateDestination(params: IoTWireless.Types.UpdateDestinationRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdateDestinationResponse) => void): Request<IoTWireless.Types.UpdateDestinationResponse, AWSError>;
  /**
   * Updates properties of a destination.
   */
  updateDestination(callback?: (err: AWSError, data: IoTWireless.Types.UpdateDestinationResponse) => void): Request<IoTWireless.Types.UpdateDestinationResponse, AWSError>;
  /**
   * Set default log level, or log levels by resource types. This can be for wireless device log options or wireless gateways log options and is used to control the log messages that'll be displayed in CloudWatch.
   */
  updateLogLevelsByResourceTypes(params: IoTWireless.Types.UpdateLogLevelsByResourceTypesRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdateLogLevelsByResourceTypesResponse) => void): Request<IoTWireless.Types.UpdateLogLevelsByResourceTypesResponse, AWSError>;
  /**
   * Set default log level, or log levels by resource types. This can be for wireless device log options or wireless gateways log options and is used to control the log messages that'll be displayed in CloudWatch.
   */
  updateLogLevelsByResourceTypes(callback?: (err: AWSError, data: IoTWireless.Types.UpdateLogLevelsByResourceTypesResponse) => void): Request<IoTWireless.Types.UpdateLogLevelsByResourceTypesResponse, AWSError>;
  /**
   * Updates properties of a partner account.
   */
  updatePartnerAccount(params: IoTWireless.Types.UpdatePartnerAccountRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdatePartnerAccountResponse) => void): Request<IoTWireless.Types.UpdatePartnerAccountResponse, AWSError>;
  /**
   * Updates properties of a partner account.
   */
  updatePartnerAccount(callback?: (err: AWSError, data: IoTWireless.Types.UpdatePartnerAccountResponse) => void): Request<IoTWireless.Types.UpdatePartnerAccountResponse, AWSError>;
  /**
   * Updates properties of a wireless device.
   */
  updateWirelessDevice(params: IoTWireless.Types.UpdateWirelessDeviceRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdateWirelessDeviceResponse) => void): Request<IoTWireless.Types.UpdateWirelessDeviceResponse, AWSError>;
  /**
   * Updates properties of a wireless device.
   */
  updateWirelessDevice(callback?: (err: AWSError, data: IoTWireless.Types.UpdateWirelessDeviceResponse) => void): Request<IoTWireless.Types.UpdateWirelessDeviceResponse, AWSError>;
  /**
   * Updates properties of a wireless gateway.
   */
  updateWirelessGateway(params: IoTWireless.Types.UpdateWirelessGatewayRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdateWirelessGatewayResponse) => void): Request<IoTWireless.Types.UpdateWirelessGatewayResponse, AWSError>;
  /**
   * Updates properties of a wireless gateway.
   */
  updateWirelessGateway(callback?: (err: AWSError, data: IoTWireless.Types.UpdateWirelessGatewayResponse) => void): Request<IoTWireless.Types.UpdateWirelessGatewayResponse, AWSError>;
}
declare namespace IoTWireless {
  export interface AbpV1_0_x {
    /**
     * The DevAddr value.
     */
    DevAddr?: DevAddr;
    /**
     * Session keys for ABP v1.0.x
     */
    SessionKeys?: SessionKeysAbpV1_0_x;
  }
  export interface AbpV1_1 {
    /**
     * The DevAddr value.
     */
    DevAddr?: DevAddr;
    /**
     * Session keys for ABP v1.1
     */
    SessionKeys?: SessionKeysAbpV1_1;
  }
  export type AccountLinked = boolean;
  export type AddGwMetadata = boolean;
  export type AmazonId = string;
  export type AmazonResourceName = string;
  export type AppEui = string;
  export type AppKey = string;
  export type AppSKey = string;
  export type AppServerPrivateKey = string;
  export interface AssociateAwsAccountWithPartnerAccountRequest {
    /**
     * The Sidewalk account credentials.
     */
    Sidewalk: SidewalkAccountInfo;
    /**
     * Each resource must have a unique client request token. If you try to create a new resource with the same token as a resource that already exists, an exception occurs. If you omit this value, AWS SDKs will automatically generate a unique client request. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The tags to attach to the specified resource. Tags are metadata that you can use to manage a resource.
     */
    Tags?: TagList;
  }
  export interface AssociateAwsAccountWithPartnerAccountResponse {
    /**
     * The Sidewalk account credentials.
     */
    Sidewalk?: SidewalkAccountInfo;
    /**
     * The Amazon Resource Name of the resource.
     */
    Arn?: PartnerAccountArn;
  }
  export interface AssociateWirelessDeviceWithThingRequest {
    /**
     * The ID of the resource to update.
     */
    Id: WirelessDeviceId;
    /**
     * The ARN of the thing to associate with the wireless device.
     */
    ThingArn: ThingArn;
  }
  export interface AssociateWirelessDeviceWithThingResponse {
  }
  export interface AssociateWirelessGatewayWithCertificateRequest {
    /**
     * The ID of the resource to update.
     */
    Id: WirelessGatewayId;
    /**
     * The ID of the certificate to associate with the wireless gateway.
     */
    IotCertificateId: IotCertificateId;
  }
  export interface AssociateWirelessGatewayWithCertificateResponse {
    /**
     * The ID of the certificate associated with the wireless gateway.
     */
    IotCertificateId?: IotCertificateId;
  }
  export interface AssociateWirelessGatewayWithThingRequest {
    /**
     * The ID of the resource to update.
     */
    Id: WirelessGatewayId;
    /**
     * The ARN of the thing to associate with the wireless gateway.
     */
    ThingArn: ThingArn;
  }
  export interface AssociateWirelessGatewayWithThingResponse {
  }
  export type AutoCreateTasks = boolean;
  export type BatteryLevel = "normal"|"low"|"critical"|string;
  export interface CertificateList {
    /**
     * The certificate chain algorithm provided by sidewalk.
     */
    SigningAlg: SigningAlg;
    /**
     * The value of the chosen sidewalk certificate.
     */
    Value: CertificateValue;
  }
  export type CertificatePEM = string;
  export type CertificateValue = string;
  export type ChannelMask = string;
  export type ClassBTimeout = number;
  export type ClassCTimeout = number;
  export type ClientRequestToken = string;
  export type ConnectionStatus = "Connected"|"Disconnected"|string;
  export type Crc = number;
  export interface CreateDestinationRequest {
    /**
     * The name of the new resource.
     */
    Name: DestinationName;
    /**
     * The type of value in Expression.
     */
    ExpressionType: ExpressionType;
    /**
     * The rule name or topic rule to send messages to.
     */
    Expression: Expression;
    /**
     * The description of the new resource.
     */
    Description?: Description;
    /**
     * The ARN of the IAM Role that authorizes the destination.
     */
    RoleArn: RoleArn;
    /**
     * The tags to attach to the new destination. Tags are metadata that you can use to manage a resource.
     */
    Tags?: TagList;
    /**
     * Each resource must have a unique client request token. If you try to create a new resource with the same token as a resource that already exists, an exception occurs. If you omit this value, AWS SDKs will automatically generate a unique client request. 
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface CreateDestinationResponse {
    /**
     * The Amazon Resource Name of the new resource.
     */
    Arn?: DestinationArn;
    /**
     * The name of the new resource.
     */
    Name?: DestinationName;
  }
  export interface CreateDeviceProfileRequest {
    /**
     * The name of the new resource.
     */
    Name?: DeviceProfileName;
    /**
     * The device profile information to use to create the device profile.
     */
    LoRaWAN?: LoRaWANDeviceProfile;
    /**
     * The tags to attach to the new device profile. Tags are metadata that you can use to manage a resource.
     */
    Tags?: TagList;
    /**
     * Each resource must have a unique client request token. If you try to create a new resource with the same token as a resource that already exists, an exception occurs. If you omit this value, AWS SDKs will automatically generate a unique client request. 
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface CreateDeviceProfileResponse {
    /**
     * The Amazon Resource Name of the new resource.
     */
    Arn?: DeviceProfileArn;
    /**
     * The ID of the new device profile.
     */
    Id?: DeviceProfileId;
  }
  export interface CreateServiceProfileRequest {
    /**
     * The name of the new resource.
     */
    Name?: ServiceProfileName;
    /**
     * The service profile information to use to create the service profile.
     */
    LoRaWAN?: LoRaWANServiceProfile;
    /**
     * The tags to attach to the new service profile. Tags are metadata that you can use to manage a resource.
     */
    Tags?: TagList;
    /**
     * Each resource must have a unique client request token. If you try to create a new resource with the same token as a resource that already exists, an exception occurs. If you omit this value, AWS SDKs will automatically generate a unique client request. 
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface CreateServiceProfileResponse {
    /**
     * The Amazon Resource Name of the new resource.
     */
    Arn?: ServiceProfileArn;
    /**
     * The ID of the new service profile.
     */
    Id?: ServiceProfileId;
  }
  export interface CreateWirelessDeviceRequest {
    /**
     * The wireless device type.
     */
    Type: WirelessDeviceType;
    /**
     * The name of the new resource.
     */
    Name?: WirelessDeviceName;
    /**
     * The description of the new resource.
     */
    Description?: Description;
    /**
     * The name of the destination to assign to the new wireless device.
     */
    DestinationName: DestinationName;
    /**
     * Each resource must have a unique client request token. If you try to create a new resource with the same token as a resource that already exists, an exception occurs. If you omit this value, AWS SDKs will automatically generate a unique client request. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The device configuration information to use to create the wireless device.
     */
    LoRaWAN?: LoRaWANDevice;
    /**
     * The tags to attach to the new wireless device. Tags are metadata that you can use to manage a resource.
     */
    Tags?: TagList;
  }
  export interface CreateWirelessDeviceResponse {
    /**
     * The Amazon Resource Name of the new resource.
     */
    Arn?: WirelessDeviceArn;
    /**
     * The ID of the new wireless device.
     */
    Id?: WirelessDeviceId;
  }
  export interface CreateWirelessGatewayRequest {
    /**
     * The name of the new resource.
     */
    Name?: WirelessGatewayName;
    /**
     * The description of the new resource.
     */
    Description?: Description;
    /**
     * The gateway configuration information to use to create the wireless gateway.
     */
    LoRaWAN: LoRaWANGateway;
    /**
     * The tags to attach to the new wireless gateway. Tags are metadata that you can use to manage a resource.
     */
    Tags?: TagList;
    /**
     * Each resource must have a unique client request token. If you try to create a new resource with the same token as a resource that already exists, an exception occurs. If you omit this value, AWS SDKs will automatically generate a unique client request. 
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface CreateWirelessGatewayResponse {
    /**
     * The Amazon Resource Name of the new resource.
     */
    Arn?: WirelessGatewayArn;
    /**
     * The ID of the new wireless gateway.
     */
    Id?: WirelessDeviceId;
  }
  export interface CreateWirelessGatewayTaskDefinitionRequest {
    /**
     * Whether to automatically create tasks using this task definition for all gateways with the specified current version. If false, the task must me created by calling CreateWirelessGatewayTask.
     */
    AutoCreateTasks: AutoCreateTasks;
    /**
     * The name of the new resource.
     */
    Name?: WirelessGatewayTaskName;
    /**
     * Information about the gateways to update.
     */
    Update?: UpdateWirelessGatewayTaskCreate;
    /**
     * Each resource must have a unique client request token. If you try to create a new resource with the same token as a resource that already exists, an exception occurs. If you omit this value, AWS SDKs will automatically generate a unique client request. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The tags to attach to the specified resource. Tags are metadata that you can use to manage a resource.
     */
    Tags?: TagList;
  }
  export interface CreateWirelessGatewayTaskDefinitionResponse {
    /**
     * The ID of the new wireless gateway task definition.
     */
    Id?: WirelessGatewayTaskDefinitionId;
    /**
     * The Amazon Resource Name of the resource.
     */
    Arn?: WirelessGatewayTaskDefinitionArn;
  }
  export interface CreateWirelessGatewayTaskRequest {
    /**
     * The ID of the resource to update.
     */
    Id: WirelessGatewayId;
    /**
     * The ID of the WirelessGatewayTaskDefinition.
     */
    WirelessGatewayTaskDefinitionId: WirelessGatewayTaskDefinitionId;
  }
  export interface CreateWirelessGatewayTaskResponse {
    /**
     * The ID of the WirelessGatewayTaskDefinition.
     */
    WirelessGatewayTaskDefinitionId?: WirelessGatewayTaskDefinitionId;
    /**
     * The status of the request.
     */
    Status?: WirelessGatewayTaskStatus;
  }
  export interface DeleteDestinationRequest {
    /**
     * The name of the resource to delete.
     */
    Name: DestinationName;
  }
  export interface DeleteDestinationResponse {
  }
  export interface DeleteDeviceProfileRequest {
    /**
     * The ID of the resource to delete.
     */
    Id: DeviceProfileId;
  }
  export interface DeleteDeviceProfileResponse {
  }
  export interface DeleteServiceProfileRequest {
    /**
     * The ID of the resource to delete.
     */
    Id: ServiceProfileId;
  }
  export interface DeleteServiceProfileResponse {
  }
  export interface DeleteWirelessDeviceRequest {
    /**
     * The ID of the resource to delete.
     */
    Id: WirelessDeviceId;
  }
  export interface DeleteWirelessDeviceResponse {
  }
  export interface DeleteWirelessGatewayRequest {
    /**
     * The ID of the resource to delete.
     */
    Id: WirelessGatewayId;
  }
  export interface DeleteWirelessGatewayResponse {
  }
  export interface DeleteWirelessGatewayTaskDefinitionRequest {
    /**
     * The ID of the resource to delete.
     */
    Id: WirelessGatewayTaskDefinitionId;
  }
  export interface DeleteWirelessGatewayTaskDefinitionResponse {
  }
  export interface DeleteWirelessGatewayTaskRequest {
    /**
     * The ID of the resource to delete.
     */
    Id: WirelessGatewayId;
  }
  export interface DeleteWirelessGatewayTaskResponse {
  }
  export type Description = string;
  export type DestinationArn = string;
  export type DestinationList = Destinations[];
  export type DestinationName = string;
  export interface Destinations {
    /**
     * The Amazon Resource Name of the resource.
     */
    Arn?: DestinationArn;
    /**
     * The name of the resource.
     */
    Name?: DestinationName;
    /**
     * The type of value in Expression.
     */
    ExpressionType?: ExpressionType;
    /**
     * The rule name or topic rule to send messages to.
     */
    Expression?: Expression;
    /**
     * The description of the resource.
     */
    Description?: Description;
    /**
     * The ARN of the IAM Role that authorizes the destination.
     */
    RoleArn?: RoleArn;
  }
  export type DevAddr = string;
  export type DevEui = string;
  export type DevStatusReqFreq = number;
  export type DeviceCertificateList = CertificateList[];
  export interface DeviceProfile {
    /**
     * The Amazon Resource Name of the resource.
     */
    Arn?: DeviceProfileArn;
    /**
     * The name of the resource.
     */
    Name?: DeviceProfileName;
    /**
     * The ID of the device profile.
     */
    Id?: DeviceProfileId;
  }
  export type DeviceProfileArn = string;
  export type DeviceProfileId = string;
  export type DeviceProfileList = DeviceProfile[];
  export type DeviceProfileName = string;
  export type DeviceState = "Provisioned"|"RegisteredNotSeen"|"RegisteredReachable"|"RegisteredUnreachable"|string;
  export interface DisassociateAwsAccountFromPartnerAccountRequest {
    /**
     * The partner account ID to disassociate from the AWS account.
     */
    PartnerAccountId: PartnerAccountId;
    /**
     * The partner type.
     */
    PartnerType: PartnerType;
  }
  export interface DisassociateAwsAccountFromPartnerAccountResponse {
  }
  export interface DisassociateWirelessDeviceFromThingRequest {
    /**
     * The ID of the resource to update.
     */
    Id: WirelessDeviceId;
  }
  export interface DisassociateWirelessDeviceFromThingResponse {
  }
  export interface DisassociateWirelessGatewayFromCertificateRequest {
    /**
     * The ID of the resource to update.
     */
    Id: WirelessGatewayId;
  }
  export interface DisassociateWirelessGatewayFromCertificateResponse {
  }
  export interface DisassociateWirelessGatewayFromThingRequest {
    /**
     * The ID of the resource to update.
     */
    Id: WirelessGatewayId;
  }
  export interface DisassociateWirelessGatewayFromThingResponse {
  }
  export type DlBucketSize = number;
  export type DlRate = number;
  export type DlRatePolicy = string;
  export type Double = number;
  export type DrMax = number;
  export type DrMin = number;
  export type EndPoint = string;
  export type Event = "discovered"|"lost"|"ack"|"nack"|"passthrough"|string;
  export type Expression = string;
  export type ExpressionType = "RuleName"|"MqttTopic"|string;
  export type FNwkSIntKey = string;
  export type FPort = number;
  export type FactoryPresetFreqsList = PresetFreq[];
  export type Fingerprint = string;
  export type GatewayEui = string;
  export interface GetDestinationRequest {
    /**
     * The name of the resource to get.
     */
    Name: DestinationName;
  }
  export interface GetDestinationResponse {
    /**
     * The Amazon Resource Name of the resource.
     */
    Arn?: DestinationArn;
    /**
     * The name of the resource.
     */
    Name?: DestinationName;
    /**
     * The rule name or topic rule to send messages to.
     */
    Expression?: Expression;
    /**
     * The type of value in Expression.
     */
    ExpressionType?: ExpressionType;
    /**
     * The description of the resource.
     */
    Description?: Description;
    /**
     * The ARN of the IAM Role that authorizes the destination.
     */
    RoleArn?: RoleArn;
  }
  export interface GetDeviceProfileRequest {
    /**
     * The ID of the resource to get.
     */
    Id: DeviceProfileId;
  }
  export interface GetDeviceProfileResponse {
    /**
     * The Amazon Resource Name of the resource.
     */
    Arn?: DeviceProfileArn;
    /**
     * The name of the resource.
     */
    Name?: DeviceProfileName;
    /**
     * The ID of the device profile.
     */
    Id?: DeviceProfileId;
    /**
     * Information about the device profile.
     */
    LoRaWAN?: LoRaWANDeviceProfile;
  }
  export interface GetLogLevelsByResourceTypesRequest {
  }
  export interface GetLogLevelsByResourceTypesResponse {
    DefaultLogLevel?: LogLevel;
    WirelessGatewayLogOptions?: WirelessGatewayLogOptionList;
    WirelessDeviceLogOptions?: WirelessDeviceLogOptionList;
  }
  export interface GetPartnerAccountRequest {
    /**
     * The partner account ID to disassociate from the AWS account.
     */
    PartnerAccountId: PartnerAccountId;
    /**
     * The partner type.
     */
    PartnerType: PartnerType;
  }
  export interface GetPartnerAccountResponse {
    /**
     * The Sidewalk account credentials.
     */
    Sidewalk?: SidewalkAccountInfoWithFingerprint;
    /**
     * Whether the partner account is linked to the AWS account.
     */
    AccountLinked?: AccountLinked;
  }
  export interface GetResourceLogLevelRequest {
    ResourceIdentifier: ResourceIdentifier;
    /**
     * The type of the resource, which can be WirelessDevice or WirelessGateway.
     */
    ResourceType: ResourceType;
  }
  export interface GetResourceLogLevelResponse {
    LogLevel?: LogLevel;
  }
  export interface GetServiceEndpointRequest {
    /**
     * The service type for which to get endpoint information about. Can be CUPS for the Configuration and Update Server endpoint, or LNS for the LoRaWAN Network Server endpoint.
     */
    ServiceType?: WirelessGatewayServiceType;
  }
  export interface GetServiceEndpointResponse {
    /**
     * The endpoint's service type.
     */
    ServiceType?: WirelessGatewayServiceType;
    /**
     * The service endpoint value.
     */
    ServiceEndpoint?: EndPoint;
    /**
     * The Root CA of the server trust certificate.
     */
    ServerTrust?: CertificatePEM;
  }
  export interface GetServiceProfileRequest {
    /**
     * The ID of the resource to get.
     */
    Id: ServiceProfileId;
  }
  export interface GetServiceProfileResponse {
    /**
     * The Amazon Resource Name of the resource.
     */
    Arn?: ServiceProfileArn;
    /**
     * The name of the resource.
     */
    Name?: ServiceProfileName;
    /**
     * The ID of the service profile.
     */
    Id?: ServiceProfileId;
    /**
     * Information about the service profile.
     */
    LoRaWAN?: LoRaWANGetServiceProfileInfo;
  }
  export interface GetWirelessDeviceRequest {
    /**
     * The identifier of the wireless device to get.
     */
    Identifier: Identifier;
    /**
     * The type of identifier used in identifier.
     */
    IdentifierType: WirelessDeviceIdType;
  }
  export interface GetWirelessDeviceResponse {
    /**
     * The wireless device type.
     */
    Type?: WirelessDeviceType;
    /**
     * The name of the resource.
     */
    Name?: WirelessDeviceName;
    /**
     * The description of the resource.
     */
    Description?: Description;
    /**
     * The name of the destination to which the device is assigned.
     */
    DestinationName?: DestinationName;
    /**
     * The ID of the wireless device.
     */
    Id?: WirelessDeviceId;
    /**
     * The Amazon Resource Name of the resource.
     */
    Arn?: WirelessDeviceArn;
    /**
     * The name of the thing associated with the wireless device. The value is empty if a thing isn't associated with the device.
     */
    ThingName?: ThingName;
    /**
     * The ARN of the thing associated with the wireless device.
     */
    ThingArn?: ThingArn;
    /**
     * Information about the wireless device.
     */
    LoRaWAN?: LoRaWANDevice;
    /**
     * Sidewalk device object.
     */
    Sidewalk?: SidewalkDevice;
  }
  export interface GetWirelessDeviceStatisticsRequest {
    /**
     * The ID of the wireless device for which to get the data.
     */
    WirelessDeviceId: WirelessDeviceId;
  }
  export interface GetWirelessDeviceStatisticsResponse {
    /**
     * The ID of the wireless device.
     */
    WirelessDeviceId?: WirelessDeviceId;
    /**
     * The date and time when the most recent uplink was received.
     */
    LastUplinkReceivedAt?: ISODateTimeString;
    /**
     * Information about the wireless device's operations.
     */
    LoRaWAN?: LoRaWANDeviceMetadata;
    /**
     * MetaData for Sidewalk device.
     */
    Sidewalk?: SidewalkDeviceMetadata;
  }
  export interface GetWirelessGatewayCertificateRequest {
    /**
     * The ID of the resource to get.
     */
    Id: WirelessGatewayId;
  }
  export interface GetWirelessGatewayCertificateResponse {
    /**
     * The ID of the certificate associated with the wireless gateway.
     */
    IotCertificateId?: IotCertificateId;
    /**
     * The ID of the certificate that is associated with the wireless gateway and used for the LoRaWANNetworkServer endpoint.
     */
    LoRaWANNetworkServerCertificateId?: IotCertificateId;
  }
  export interface GetWirelessGatewayFirmwareInformationRequest {
    /**
     * The ID of the resource to get.
     */
    Id: WirelessGatewayId;
  }
  export interface GetWirelessGatewayFirmwareInformationResponse {
    /**
     * Information about the wireless gateway's firmware.
     */
    LoRaWAN?: LoRaWANGatewayCurrentVersion;
  }
  export interface GetWirelessGatewayRequest {
    /**
     * The identifier of the wireless gateway to get.
     */
    Identifier: Identifier;
    /**
     * The type of identifier used in identifier.
     */
    IdentifierType: WirelessGatewayIdType;
  }
  export interface GetWirelessGatewayResponse {
    /**
     * The name of the resource.
     */
    Name?: WirelessGatewayName;
    /**
     * The ID of the wireless gateway.
     */
    Id?: WirelessGatewayId;
    /**
     * The description of the resource.
     */
    Description?: Description;
    /**
     * Information about the wireless gateway.
     */
    LoRaWAN?: LoRaWANGateway;
    /**
     * The Amazon Resource Name of the resource.
     */
    Arn?: WirelessGatewayArn;
    /**
     * The name of the thing associated with the wireless gateway. The value is empty if a thing isn't associated with the gateway.
     */
    ThingName?: ThingName;
    /**
     * The ARN of the thing associated with the wireless gateway.
     */
    ThingArn?: ThingArn;
  }
  export interface GetWirelessGatewayStatisticsRequest {
    /**
     * The ID of the wireless gateway for which to get the data.
     */
    WirelessGatewayId: WirelessGatewayId;
  }
  export interface GetWirelessGatewayStatisticsResponse {
    /**
     * The ID of the wireless gateway.
     */
    WirelessGatewayId?: WirelessGatewayId;
    /**
     * The date and time when the most recent uplink was received.
     */
    LastUplinkReceivedAt?: ISODateTimeString;
    /**
     * The connection status of the wireless gateway.
     */
    ConnectionStatus?: ConnectionStatus;
  }
  export interface GetWirelessGatewayTaskDefinitionRequest {
    /**
     * The ID of the resource to get.
     */
    Id: WirelessGatewayTaskDefinitionId;
  }
  export interface GetWirelessGatewayTaskDefinitionResponse {
    /**
     * Whether to automatically create tasks using this task definition for all gateways with the specified current version. If false, the task must me created by calling CreateWirelessGatewayTask.
     */
    AutoCreateTasks?: AutoCreateTasks;
    /**
     * The name of the resource.
     */
    Name?: WirelessGatewayTaskName;
    /**
     * Information about the gateways to update.
     */
    Update?: UpdateWirelessGatewayTaskCreate;
    /**
     * The Amazon Resource Name of the resource.
     */
    Arn?: WirelessGatewayTaskDefinitionArn;
  }
  export interface GetWirelessGatewayTaskRequest {
    /**
     * The ID of the resource to get.
     */
    Id: WirelessGatewayId;
  }
  export interface GetWirelessGatewayTaskResponse {
    /**
     * The ID of the wireless gateway.
     */
    WirelessGatewayId?: WirelessGatewayId;
    /**
     * The ID of the WirelessGatewayTask.
     */
    WirelessGatewayTaskDefinitionId?: WirelessGatewayTaskDefinitionId;
    /**
     * The date and time when the most recent uplink was received.
     */
    LastUplinkReceivedAt?: ISODateTimeString;
    /**
     * The date and time when the task was created.
     */
    TaskCreatedAt?: ISODateTimeString;
    /**
     * The status of the request.
     */
    Status?: WirelessGatewayTaskStatus;
  }
  export type HrAllowed = boolean;
  export type ISODateTimeString = string;
  export type Identifier = string;
  export type Integer = number;
  export type IotCertificateId = string;
  export type JoinEui = string;
  export type JoinEuiFilters = JoinEuiRange[];
  export type JoinEuiRange = JoinEui[];
  export interface ListDestinationsRequest {
    /**
     * The maximum number of results to return in this operation.
     */
    MaxResults?: MaxResults;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListDestinationsResponse {
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    NextToken?: NextToken;
    /**
     * The list of destinations.
     */
    DestinationList?: DestinationList;
  }
  export interface ListDeviceProfilesRequest {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return in this operation.
     */
    MaxResults?: MaxResults;
  }
  export interface ListDeviceProfilesResponse {
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    NextToken?: NextToken;
    /**
     * The list of device profiles.
     */
    DeviceProfileList?: DeviceProfileList;
  }
  export interface ListPartnerAccountsRequest {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return in this operation.
     */
    MaxResults?: MaxResults;
  }
  export interface ListPartnerAccountsResponse {
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    NextToken?: NextToken;
    /**
     * The Sidewalk account credentials.
     */
    Sidewalk?: SidewalkAccountList;
  }
  export interface ListServiceProfilesRequest {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return in this operation.
     */
    MaxResults?: MaxResults;
  }
  export interface ListServiceProfilesResponse {
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    NextToken?: NextToken;
    /**
     * The list of service profiles.
     */
    ServiceProfileList?: ServiceProfileList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource for which you want to list tags.
     */
    ResourceArn: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags to attach to the specified resource. Tags are metadata that you can use to manage a resource.
     */
    Tags?: TagList;
  }
  export interface ListWirelessDevicesRequest {
    /**
     * The maximum number of results to return in this operation.
     */
    MaxResults?: MaxResults;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    /**
     * A filter to list only the wireless devices that use this destination.
     */
    DestinationName?: DestinationName;
    /**
     * A filter to list only the wireless devices that use this device profile.
     */
    DeviceProfileId?: DeviceProfileId;
    /**
     * A filter to list only the wireless devices that use this service profile.
     */
    ServiceProfileId?: ServiceProfileId;
    /**
     * A filter to list only the wireless devices that use this wireless device type.
     */
    WirelessDeviceType?: WirelessDeviceType;
  }
  export interface ListWirelessDevicesResponse {
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    NextToken?: NextToken;
    /**
     * The ID of the wireless device.
     */
    WirelessDeviceList?: WirelessDeviceStatisticsList;
  }
  export interface ListWirelessGatewayTaskDefinitionsRequest {
    /**
     * The maximum number of results to return in this operation.
     */
    MaxResults?: MaxResults;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    /**
     * A filter to list only the wireless gateway task definitions that use this task definition type.
     */
    TaskDefinitionType?: WirelessGatewayTaskDefinitionType;
  }
  export interface ListWirelessGatewayTaskDefinitionsResponse {
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    NextToken?: NextToken;
    /**
     * The list of task definitions.
     */
    TaskDefinitions?: WirelessGatewayTaskDefinitionList;
  }
  export interface ListWirelessGatewaysRequest {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return in this operation.
     */
    MaxResults?: MaxResults;
  }
  export interface ListWirelessGatewaysResponse {
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    NextToken?: NextToken;
    /**
     * The ID of the wireless gateway.
     */
    WirelessGatewayList?: WirelessGatewayStatisticsList;
  }
  export interface LoRaWANDevice {
    /**
     * The DevEUI value.
     */
    DevEui?: DevEui;
    /**
     * The ID of the device profile for the new wireless device.
     */
    DeviceProfileId?: DeviceProfileId;
    /**
     * The ID of the service profile.
     */
    ServiceProfileId?: ServiceProfileId;
    /**
     * OTAA device object for v1.1 for create APIs
     */
    OtaaV1_1?: OtaaV1_1;
    /**
     * OTAA device object for create APIs for v1.0.x
     */
    OtaaV1_0_x?: OtaaV1_0_x;
    /**
     * ABP device object for create APIs for v1.1
     */
    AbpV1_1?: AbpV1_1;
    /**
     * LoRaWAN object for create APIs
     */
    AbpV1_0_x?: AbpV1_0_x;
  }
  export interface LoRaWANDeviceMetadata {
    /**
     * The DevEUI value.
     */
    DevEui?: DevEui;
    /**
     * The FPort value.
     */
    FPort?: Integer;
    /**
     * The DataRate value.
     */
    DataRate?: Integer;
    /**
     * The device's channel frequency in Hz.
     */
    Frequency?: Integer;
    /**
     * The date and time of the metadata.
     */
    Timestamp?: ISODateTimeString;
    /**
     * Information about the gateways accessed by the device.
     */
    Gateways?: LoRaWANGatewayMetadataList;
  }
  export interface LoRaWANDeviceProfile {
    /**
     * The SupportsClassB value.
     */
    SupportsClassB?: SupportsClassB;
    /**
     * The ClassBTimeout value.
     */
    ClassBTimeout?: ClassBTimeout;
    /**
     * The PingSlotPeriod value.
     */
    PingSlotPeriod?: PingSlotPeriod;
    /**
     * The PingSlotDR value.
     */
    PingSlotDr?: PingSlotDr;
    /**
     * The PingSlotFreq value.
     */
    PingSlotFreq?: PingSlotFreq;
    /**
     * The SupportsClassC value.
     */
    SupportsClassC?: SupportsClassC;
    /**
     * The ClassCTimeout value.
     */
    ClassCTimeout?: ClassCTimeout;
    /**
     * The MAC version (such as OTAA 1.1 or OTAA 1.0.3) to use with this device profile.
     */
    MacVersion?: MacVersion;
    /**
     * The version of regional parameters.
     */
    RegParamsRevision?: RegParamsRevision;
    /**
     * The RXDelay1 value.
     */
    RxDelay1?: RxDelay1;
    /**
     * The RXDROffset1 value.
     */
    RxDrOffset1?: RxDrOffset1;
    /**
     * The RXDataRate2 value.
     */
    RxDataRate2?: RxDataRate2;
    /**
     * The RXFreq2 value.
     */
    RxFreq2?: RxFreq2;
    /**
     * The list of values that make up the FactoryPresetFreqs value.
     */
    FactoryPresetFreqsList?: FactoryPresetFreqsList;
    /**
     * The MaxEIRP value.
     */
    MaxEirp?: MaxEirp;
    /**
     * The MaxDutyCycle value.
     */
    MaxDutyCycle?: MaxDutyCycle;
    /**
     * The frequency band (RFRegion) value.
     */
    RfRegion?: RfRegion;
    /**
     * The SupportsJoin value.
     */
    SupportsJoin?: SupportsJoin;
    /**
     * The Supports32BitFCnt value.
     */
    Supports32BitFCnt?: Supports32BitFCnt;
  }
  export interface LoRaWANGateway {
    /**
     * The gateway's EUI value.
     */
    GatewayEui?: GatewayEui;
    /**
     * The frequency band (RFRegion) value.
     */
    RfRegion?: RfRegion;
    JoinEuiFilters?: JoinEuiFilters;
    NetIdFilters?: NetIdFilters;
    SubBands?: SubBands;
  }
  export interface LoRaWANGatewayCurrentVersion {
    /**
     * The version of the gateways that should receive the update.
     */
    CurrentVersion?: LoRaWANGatewayVersion;
  }
  export interface LoRaWANGatewayMetadata {
    /**
     * The gateway's EUI value.
     */
    GatewayEui?: GatewayEui;
    /**
     * The SNR value.
     */
    Snr?: Double;
    /**
     * The RSSI value.
     */
    Rssi?: Double;
  }
  export type LoRaWANGatewayMetadataList = LoRaWANGatewayMetadata[];
  export interface LoRaWANGatewayVersion {
    /**
     * The version of the wireless gateway firmware.
     */
    PackageVersion?: PackageVersion;
    /**
     * The model number of the wireless gateway.
     */
    Model?: Model;
    /**
     * The basic station version of the wireless gateway.
     */
    Station?: Station;
  }
  export interface LoRaWANGetServiceProfileInfo {
    /**
     * The ULRate value.
     */
    UlRate?: UlRate;
    /**
     * The ULBucketSize value.
     */
    UlBucketSize?: UlBucketSize;
    /**
     * The ULRatePolicy value.
     */
    UlRatePolicy?: UlRatePolicy;
    /**
     * The DLRate value.
     */
    DlRate?: DlRate;
    /**
     * The DLBucketSize value.
     */
    DlBucketSize?: DlBucketSize;
    /**
     * The DLRatePolicy value.
     */
    DlRatePolicy?: DlRatePolicy;
    /**
     * The AddGWMetaData value.
     */
    AddGwMetadata?: AddGwMetadata;
    /**
     * The DevStatusReqFreq value.
     */
    DevStatusReqFreq?: DevStatusReqFreq;
    /**
     * The ReportDevStatusBattery value.
     */
    ReportDevStatusBattery?: ReportDevStatusBattery;
    /**
     * The ReportDevStatusMargin value.
     */
    ReportDevStatusMargin?: ReportDevStatusMargin;
    /**
     * The DRMin value.
     */
    DrMin?: DrMin;
    /**
     * The DRMax value.
     */
    DrMax?: DrMax;
    /**
     * The ChannelMask value.
     */
    ChannelMask?: ChannelMask;
    /**
     * The PRAllowed value that describes whether passive roaming is allowed.
     */
    PrAllowed?: PrAllowed;
    /**
     * The HRAllowed value that describes whether handover roaming is allowed.
     */
    HrAllowed?: HrAllowed;
    /**
     * The RAAllowed value that describes whether roaming activation is allowed.
     */
    RaAllowed?: RaAllowed;
    /**
     * The NwkGeoLoc value.
     */
    NwkGeoLoc?: NwkGeoLoc;
    /**
     * The TargetPER value.
     */
    TargetPer?: TargetPer;
    /**
     * The MinGwDiversity value.
     */
    MinGwDiversity?: MinGwDiversity;
  }
  export interface LoRaWANListDevice {
    /**
     * The DevEUI value.
     */
    DevEui?: DevEui;
  }
  export interface LoRaWANSendDataToDevice {
    /**
     * The Fport value.
     */
    FPort?: FPort;
  }
  export interface LoRaWANServiceProfile {
    /**
     * The AddGWMetaData value.
     */
    AddGwMetadata?: AddGwMetadata;
  }
  export interface LoRaWANUpdateDevice {
    /**
     * The ID of the device profile for the wireless device.
     */
    DeviceProfileId?: DeviceProfileId;
    /**
     * The ID of the service profile.
     */
    ServiceProfileId?: ServiceProfileId;
  }
  export interface LoRaWANUpdateGatewayTaskCreate {
    /**
     * The signature used to verify the update firmware.
     */
    UpdateSignature?: UpdateSignature;
    /**
     * The CRC of the signature private key to check.
     */
    SigKeyCrc?: Crc;
    /**
     * The version of the gateways that should receive the update.
     */
    CurrentVersion?: LoRaWANGatewayVersion;
    /**
     * The firmware version to update the gateway to.
     */
    UpdateVersion?: LoRaWANGatewayVersion;
  }
  export interface LoRaWANUpdateGatewayTaskEntry {
    /**
     * The version of the gateways that should receive the update.
     */
    CurrentVersion?: LoRaWANGatewayVersion;
    /**
     * The firmware version to update the gateway to.
     */
    UpdateVersion?: LoRaWANGatewayVersion;
  }
  export type LogLevel = "INFO"|"ERROR"|"DISABLED"|string;
  export type MacVersion = string;
  export type MaxDutyCycle = number;
  export type MaxEirp = number;
  export type MaxResults = number;
  export type MessageId = string;
  export type MessageType = "CUSTOM_COMMAND_ID_NOTIFY"|"CUSTOM_COMMAND_ID_GET"|"CUSTOM_COMMAND_ID_SET"|"CUSTOM_COMMAND_ID_RESP"|string;
  export type MinGwDiversity = number;
  export type Model = string;
  export type NetId = string;
  export type NetIdFilters = NetId[];
  export type NextToken = string;
  export type NwkGeoLoc = boolean;
  export type NwkKey = string;
  export type NwkSEncKey = string;
  export type NwkSKey = string;
  export interface OtaaV1_0_x {
    /**
     * The AppKey value.
     */
    AppKey?: AppKey;
    /**
     * The AppEUI value.
     */
    AppEui?: AppEui;
  }
  export interface OtaaV1_1 {
    /**
     * The AppKey value.
     */
    AppKey?: AppKey;
    /**
     * The NwkKey value.
     */
    NwkKey?: NwkKey;
    /**
     * The JoinEUI value.
     */
    JoinEui?: JoinEui;
  }
  export type PackageVersion = string;
  export type PartnerAccountArn = string;
  export type PartnerAccountId = string;
  export type PartnerType = "Sidewalk"|string;
  export type PayloadData = string;
  export type PingSlotDr = number;
  export type PingSlotFreq = number;
  export type PingSlotPeriod = number;
  export type PrAllowed = boolean;
  export type PresetFreq = number;
  export interface PutResourceLogLevelRequest {
    ResourceIdentifier: ResourceIdentifier;
    /**
     * The type of the resource, which can be WirelessDevice or WirelessGateway.
     */
    ResourceType: ResourceType;
    LogLevel: LogLevel;
  }
  export interface PutResourceLogLevelResponse {
  }
  export type RaAllowed = boolean;
  export type RegParamsRevision = string;
  export type ReportDevStatusBattery = boolean;
  export type ReportDevStatusMargin = boolean;
  export interface ResetAllResourceLogLevelsRequest {
  }
  export interface ResetAllResourceLogLevelsResponse {
  }
  export interface ResetResourceLogLevelRequest {
    ResourceIdentifier: ResourceIdentifier;
    /**
     * The type of the resource, which can be WirelessDevice or WirelessGateway.
     */
    ResourceType: ResourceType;
  }
  export interface ResetResourceLogLevelResponse {
  }
  export type ResourceIdentifier = string;
  export type ResourceType = string;
  export type Result = string;
  export type RfRegion = string;
  export type RoleArn = string;
  export type RxDataRate2 = number;
  export type RxDelay1 = number;
  export type RxDrOffset1 = number;
  export type RxFreq2 = number;
  export type SNwkSIntKey = string;
  export interface SendDataToWirelessDeviceRequest {
    /**
     * The ID of the wireless device to receive the data.
     */
    Id: WirelessDeviceId;
    /**
     * The transmit mode to use to send data to the wireless device. Can be: 0 for UM (unacknowledge mode) or 1 for AM (acknowledge mode).
     */
    TransmitMode: TransmitMode;
    /**
     * The binary to be sent to the end device, encoded in base64.
     */
    PayloadData: PayloadData;
    /**
     * Metadata about the message request.
     */
    WirelessMetadata?: WirelessMetadata;
  }
  export interface SendDataToWirelessDeviceResponse {
    /**
     * The ID of the message sent to the wireless device.
     */
    MessageId?: MessageId;
  }
  export type Seq = number;
  export interface ServiceProfile {
    /**
     * The Amazon Resource Name of the resource.
     */
    Arn?: ServiceProfileArn;
    /**
     * The name of the resource.
     */
    Name?: ServiceProfileName;
    /**
     * The ID of the service profile.
     */
    Id?: ServiceProfileId;
  }
  export type ServiceProfileArn = string;
  export type ServiceProfileId = string;
  export type ServiceProfileList = ServiceProfile[];
  export type ServiceProfileName = string;
  export interface SessionKeysAbpV1_0_x {
    /**
     * The NwkSKey value.
     */
    NwkSKey?: NwkSKey;
    /**
     * The AppSKey value.
     */
    AppSKey?: AppSKey;
  }
  export interface SessionKeysAbpV1_1 {
    /**
     * The FNwkSIntKey value.
     */
    FNwkSIntKey?: FNwkSIntKey;
    /**
     * The SNwkSIntKey value.
     */
    SNwkSIntKey?: SNwkSIntKey;
    /**
     * The NwkSEncKey value.
     */
    NwkSEncKey?: NwkSEncKey;
    /**
     * The AppSKey value.
     */
    AppSKey?: AppSKey;
  }
  export interface SidewalkAccountInfo {
    /**
     * The Sidewalk Amazon ID.
     */
    AmazonId?: AmazonId;
    /**
     * The Sidewalk application server private key.
     */
    AppServerPrivateKey?: AppServerPrivateKey;
  }
  export interface SidewalkAccountInfoWithFingerprint {
    /**
     * The Sidewalk Amazon ID.
     */
    AmazonId?: AmazonId;
    /**
     * The fingerprint of the Sidewalk application server private key.
     */
    Fingerprint?: Fingerprint;
    /**
     * The Amazon Resource Name of the resource.
     */
    Arn?: PartnerAccountArn;
  }
  export type SidewalkAccountList = SidewalkAccountInfoWithFingerprint[];
  export interface SidewalkDevice {
    AmazonId?: AmazonId;
    /**
     * The sidewalk device identification.
     */
    SidewalkId?: SidewalkId;
    /**
     * The Sidewalk manufacturing series number.
     */
    SidewalkManufacturingSn?: SidewalkManufacturingSn;
    /**
     * The sidewalk device certificates for Ed25519 and P256r1.
     */
    DeviceCertificates?: DeviceCertificateList;
  }
  export interface SidewalkDeviceMetadata {
    /**
     * The RSSI value.
     */
    Rssi?: Integer;
    /**
     * Sidewalk device battery level.
     */
    BatteryLevel?: BatteryLevel;
    /**
     * Sidewalk device status notification.
     */
    Event?: Event;
    /**
     * Device state defines the device status of sidewalk device.
     */
    DeviceState?: DeviceState;
  }
  export type SidewalkId = string;
  export interface SidewalkListDevice {
    /**
     * The Sidewalk Amazon ID.
     */
    AmazonId?: AmazonId;
    /**
     * The sidewalk device identification.
     */
    SidewalkId?: SidewalkId;
    /**
     * The Sidewalk manufacturing series number.
     */
    SidewalkManufacturingSn?: SidewalkManufacturingSn;
    /**
     * The sidewalk device certificates for Ed25519 and P256r1.
     */
    DeviceCertificates?: DeviceCertificateList;
  }
  export type SidewalkManufacturingSn = string;
  export interface SidewalkSendDataToDevice {
    /**
     * The sequence number.
     */
    Seq?: Seq;
    MessageType?: MessageType;
  }
  export interface SidewalkUpdateAccount {
    /**
     * The new Sidewalk application server private key.
     */
    AppServerPrivateKey?: AppServerPrivateKey;
  }
  export type SigningAlg = "Ed25519"|"P256r1"|string;
  export type Station = string;
  export type SubBand = number;
  export type SubBands = SubBand[];
  export type Supports32BitFCnt = boolean;
  export type SupportsClassB = boolean;
  export type SupportsClassC = boolean;
  export type SupportsJoin = boolean;
  export interface Tag {
    /**
     * The tag's key value.
     */
    Key: TagKey;
    /**
     * The tag's value.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The ARN of the resource to add tags to.
     */
    ResourceArn: AmazonResourceName;
    /**
     * Adds to or modifies the tags of the given resource. Tags are metadata that you can use to manage a resource.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TargetPer = number;
  export interface TestWirelessDeviceRequest {
    /**
     * The ID of the wireless device to test.
     */
    Id: WirelessDeviceId;
  }
  export interface TestWirelessDeviceResponse {
    /**
     * The result returned by the test.
     */
    Result?: Result;
  }
  export type ThingArn = string;
  export type ThingName = string;
  export type TransmitMode = number;
  export type UlBucketSize = number;
  export type UlRate = number;
  export type UlRatePolicy = string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource to remove tags from.
     */
    ResourceArn: AmazonResourceName;
    /**
     * A list of the keys of the tags to remove from the resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export type UpdateDataSource = string;
  export interface UpdateDestinationRequest {
    /**
     * The new name of the resource.
     */
    Name: DestinationName;
    /**
     * The type of value in Expression.
     */
    ExpressionType?: ExpressionType;
    /**
     * The new rule name or topic rule to send messages to.
     */
    Expression?: Expression;
    /**
     * A new description of the resource.
     */
    Description?: Description;
    /**
     * The ARN of the IAM Role that authorizes the destination.
     */
    RoleArn?: RoleArn;
  }
  export interface UpdateDestinationResponse {
  }
  export interface UpdateLogLevelsByResourceTypesRequest {
    DefaultLogLevel?: LogLevel;
    WirelessDeviceLogOptions?: WirelessDeviceLogOptionList;
    WirelessGatewayLogOptions?: WirelessGatewayLogOptionList;
  }
  export interface UpdateLogLevelsByResourceTypesResponse {
  }
  export interface UpdatePartnerAccountRequest {
    /**
     * The Sidewalk account credentials.
     */
    Sidewalk: SidewalkUpdateAccount;
    /**
     * The ID of the partner account to update.
     */
    PartnerAccountId: PartnerAccountId;
    /**
     * The partner type.
     */
    PartnerType: PartnerType;
  }
  export interface UpdatePartnerAccountResponse {
  }
  export type UpdateSignature = string;
  export interface UpdateWirelessDeviceRequest {
    /**
     * The ID of the resource to update.
     */
    Id: WirelessDeviceId;
    /**
     * The name of the new destination for the device.
     */
    DestinationName?: DestinationName;
    /**
     * The new name of the resource.
     */
    Name?: WirelessDeviceName;
    /**
     * A new description of the resource.
     */
    Description?: Description;
    /**
     * The updated wireless device's configuration.
     */
    LoRaWAN?: LoRaWANUpdateDevice;
  }
  export interface UpdateWirelessDeviceResponse {
  }
  export interface UpdateWirelessGatewayRequest {
    /**
     * The ID of the resource to update.
     */
    Id: WirelessGatewayId;
    /**
     * The new name of the resource.
     */
    Name?: WirelessGatewayName;
    /**
     * A new description of the resource.
     */
    Description?: Description;
    JoinEuiFilters?: JoinEuiFilters;
    NetIdFilters?: NetIdFilters;
  }
  export interface UpdateWirelessGatewayResponse {
  }
  export interface UpdateWirelessGatewayTaskCreate {
    /**
     * The link to the S3 bucket.
     */
    UpdateDataSource?: UpdateDataSource;
    /**
     * The IAM role used to read data from the S3 bucket.
     */
    UpdateDataRole?: UpdateDataSource;
    /**
     * The properties that relate to the LoRaWAN wireless gateway.
     */
    LoRaWAN?: LoRaWANUpdateGatewayTaskCreate;
  }
  export interface UpdateWirelessGatewayTaskEntry {
    /**
     * The ID of the new wireless gateway task entry.
     */
    Id?: WirelessGatewayTaskDefinitionId;
    /**
     * The properties that relate to the LoRaWAN wireless gateway.
     */
    LoRaWAN?: LoRaWANUpdateGatewayTaskEntry;
    /**
     * The Amazon Resource Name of the resource.
     */
    Arn?: WirelessGatewayTaskDefinitionArn;
  }
  export type WirelessDeviceArn = string;
  export type WirelessDeviceEvent = "Join"|"Rejoin"|"Uplink_Data"|"Downlink_Data"|"Registration"|string;
  export interface WirelessDeviceEventLogOption {
    Event: WirelessDeviceEvent;
    LogLevel: LogLevel;
  }
  export type WirelessDeviceEventLogOptionList = WirelessDeviceEventLogOption[];
  export type WirelessDeviceId = string;
  export type WirelessDeviceIdType = "WirelessDeviceId"|"DevEui"|"ThingName"|"SidewalkManufacturingSn"|string;
  export interface WirelessDeviceLogOption {
    /**
     * The wireless device type.
     */
    Type: WirelessDeviceType;
    LogLevel: LogLevel;
    Events?: WirelessDeviceEventLogOptionList;
  }
  export type WirelessDeviceLogOptionList = WirelessDeviceLogOption[];
  export type WirelessDeviceName = string;
  export interface WirelessDeviceStatistics {
    /**
     * The Amazon Resource Name of the resource.
     */
    Arn?: WirelessDeviceArn;
    /**
     * The ID of the wireless device reporting the data.
     */
    Id?: WirelessDeviceId;
    /**
     * The wireless device type.
     */
    Type?: WirelessDeviceType;
    /**
     * The name of the resource.
     */
    Name?: WirelessDeviceName;
    /**
     * The name of the destination to which the device is assigned.
     */
    DestinationName?: DestinationName;
    /**
     * The date and time when the most recent uplink was received.
     */
    LastUplinkReceivedAt?: ISODateTimeString;
    /**
     * LoRaWAN device info.
     */
    LoRaWAN?: LoRaWANListDevice;
    /**
     * The Sidewalk account credentials.
     */
    Sidewalk?: SidewalkListDevice;
  }
  export type WirelessDeviceStatisticsList = WirelessDeviceStatistics[];
  export type WirelessDeviceType = "Sidewalk"|"LoRaWAN"|string;
  export type WirelessGatewayArn = string;
  export type WirelessGatewayEvent = "CUPS_Request"|"Certificate"|string;
  export interface WirelessGatewayEventLogOption {
    Event: WirelessGatewayEvent;
    LogLevel: LogLevel;
  }
  export type WirelessGatewayEventLogOptionList = WirelessGatewayEventLogOption[];
  export type WirelessGatewayId = string;
  export type WirelessGatewayIdType = "GatewayEui"|"WirelessGatewayId"|"ThingName"|string;
  export interface WirelessGatewayLogOption {
    Type: WirelessGatewayType;
    LogLevel: LogLevel;
    Events?: WirelessGatewayEventLogOptionList;
  }
  export type WirelessGatewayLogOptionList = WirelessGatewayLogOption[];
  export type WirelessGatewayName = string;
  export type WirelessGatewayServiceType = "CUPS"|"LNS"|string;
  export interface WirelessGatewayStatistics {
    /**
     * The Amazon Resource Name of the resource.
     */
    Arn?: WirelessGatewayArn;
    /**
     * The ID of the wireless gateway reporting the data.
     */
    Id?: WirelessGatewayId;
    /**
     * The name of the resource.
     */
    Name?: WirelessGatewayName;
    /**
     * The description of the resource.
     */
    Description?: Description;
    /**
     * LoRaWAN gateway info.
     */
    LoRaWAN?: LoRaWANGateway;
    /**
     * The date and time when the most recent uplink was received.
     */
    LastUplinkReceivedAt?: ISODateTimeString;
  }
  export type WirelessGatewayStatisticsList = WirelessGatewayStatistics[];
  export type WirelessGatewayTaskDefinitionArn = string;
  export type WirelessGatewayTaskDefinitionId = string;
  export type WirelessGatewayTaskDefinitionList = UpdateWirelessGatewayTaskEntry[];
  export type WirelessGatewayTaskDefinitionType = "UPDATE"|string;
  export type WirelessGatewayTaskName = string;
  export type WirelessGatewayTaskStatus = "PENDING"|"IN_PROGRESS"|"FIRST_RETRY"|"SECOND_RETRY"|"COMPLETED"|"FAILED"|string;
  export type WirelessGatewayType = "LoRaWAN"|string;
  export interface WirelessMetadata {
    /**
     * LoRaWAN device info.
     */
    LoRaWAN?: LoRaWANSendDataToDevice;
    /**
     * The Sidewalk account credentials.
     */
    Sidewalk?: SidewalkSendDataToDevice;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-11-22"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IoTWireless client.
   */
  export import Types = IoTWireless;
}
export = IoTWireless;
