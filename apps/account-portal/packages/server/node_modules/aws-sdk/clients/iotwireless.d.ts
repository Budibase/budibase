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
   * Associate a multicast group with a FUOTA task.
   */
  associateMulticastGroupWithFuotaTask(params: IoTWireless.Types.AssociateMulticastGroupWithFuotaTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.AssociateMulticastGroupWithFuotaTaskResponse) => void): Request<IoTWireless.Types.AssociateMulticastGroupWithFuotaTaskResponse, AWSError>;
  /**
   * Associate a multicast group with a FUOTA task.
   */
  associateMulticastGroupWithFuotaTask(callback?: (err: AWSError, data: IoTWireless.Types.AssociateMulticastGroupWithFuotaTaskResponse) => void): Request<IoTWireless.Types.AssociateMulticastGroupWithFuotaTaskResponse, AWSError>;
  /**
   * Associate a wireless device with a FUOTA task.
   */
  associateWirelessDeviceWithFuotaTask(params: IoTWireless.Types.AssociateWirelessDeviceWithFuotaTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.AssociateWirelessDeviceWithFuotaTaskResponse) => void): Request<IoTWireless.Types.AssociateWirelessDeviceWithFuotaTaskResponse, AWSError>;
  /**
   * Associate a wireless device with a FUOTA task.
   */
  associateWirelessDeviceWithFuotaTask(callback?: (err: AWSError, data: IoTWireless.Types.AssociateWirelessDeviceWithFuotaTaskResponse) => void): Request<IoTWireless.Types.AssociateWirelessDeviceWithFuotaTaskResponse, AWSError>;
  /**
   * Associates a wireless device with a multicast group.
   */
  associateWirelessDeviceWithMulticastGroup(params: IoTWireless.Types.AssociateWirelessDeviceWithMulticastGroupRequest, callback?: (err: AWSError, data: IoTWireless.Types.AssociateWirelessDeviceWithMulticastGroupResponse) => void): Request<IoTWireless.Types.AssociateWirelessDeviceWithMulticastGroupResponse, AWSError>;
  /**
   * Associates a wireless device with a multicast group.
   */
  associateWirelessDeviceWithMulticastGroup(callback?: (err: AWSError, data: IoTWireless.Types.AssociateWirelessDeviceWithMulticastGroupResponse) => void): Request<IoTWireless.Types.AssociateWirelessDeviceWithMulticastGroupResponse, AWSError>;
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
   * Cancels an existing multicast group session.
   */
  cancelMulticastGroupSession(params: IoTWireless.Types.CancelMulticastGroupSessionRequest, callback?: (err: AWSError, data: IoTWireless.Types.CancelMulticastGroupSessionResponse) => void): Request<IoTWireless.Types.CancelMulticastGroupSessionResponse, AWSError>;
  /**
   * Cancels an existing multicast group session.
   */
  cancelMulticastGroupSession(callback?: (err: AWSError, data: IoTWireless.Types.CancelMulticastGroupSessionResponse) => void): Request<IoTWireless.Types.CancelMulticastGroupSessionResponse, AWSError>;
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
   * Creates a FUOTA task.
   */
  createFuotaTask(params: IoTWireless.Types.CreateFuotaTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.CreateFuotaTaskResponse) => void): Request<IoTWireless.Types.CreateFuotaTaskResponse, AWSError>;
  /**
   * Creates a FUOTA task.
   */
  createFuotaTask(callback?: (err: AWSError, data: IoTWireless.Types.CreateFuotaTaskResponse) => void): Request<IoTWireless.Types.CreateFuotaTaskResponse, AWSError>;
  /**
   * Creates a multicast group.
   */
  createMulticastGroup(params: IoTWireless.Types.CreateMulticastGroupRequest, callback?: (err: AWSError, data: IoTWireless.Types.CreateMulticastGroupResponse) => void): Request<IoTWireless.Types.CreateMulticastGroupResponse, AWSError>;
  /**
   * Creates a multicast group.
   */
  createMulticastGroup(callback?: (err: AWSError, data: IoTWireless.Types.CreateMulticastGroupResponse) => void): Request<IoTWireless.Types.CreateMulticastGroupResponse, AWSError>;
  /**
   * Creates a new network analyzer configuration.
   */
  createNetworkAnalyzerConfiguration(params: IoTWireless.Types.CreateNetworkAnalyzerConfigurationRequest, callback?: (err: AWSError, data: IoTWireless.Types.CreateNetworkAnalyzerConfigurationResponse) => void): Request<IoTWireless.Types.CreateNetworkAnalyzerConfigurationResponse, AWSError>;
  /**
   * Creates a new network analyzer configuration.
   */
  createNetworkAnalyzerConfiguration(callback?: (err: AWSError, data: IoTWireless.Types.CreateNetworkAnalyzerConfigurationResponse) => void): Request<IoTWireless.Types.CreateNetworkAnalyzerConfigurationResponse, AWSError>;
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
   * Deletes a FUOTA task.
   */
  deleteFuotaTask(params: IoTWireless.Types.DeleteFuotaTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.DeleteFuotaTaskResponse) => void): Request<IoTWireless.Types.DeleteFuotaTaskResponse, AWSError>;
  /**
   * Deletes a FUOTA task.
   */
  deleteFuotaTask(callback?: (err: AWSError, data: IoTWireless.Types.DeleteFuotaTaskResponse) => void): Request<IoTWireless.Types.DeleteFuotaTaskResponse, AWSError>;
  /**
   * Deletes a multicast group if it is not in use by a fuota task.
   */
  deleteMulticastGroup(params: IoTWireless.Types.DeleteMulticastGroupRequest, callback?: (err: AWSError, data: IoTWireless.Types.DeleteMulticastGroupResponse) => void): Request<IoTWireless.Types.DeleteMulticastGroupResponse, AWSError>;
  /**
   * Deletes a multicast group if it is not in use by a fuota task.
   */
  deleteMulticastGroup(callback?: (err: AWSError, data: IoTWireless.Types.DeleteMulticastGroupResponse) => void): Request<IoTWireless.Types.DeleteMulticastGroupResponse, AWSError>;
  /**
   * Deletes a network analyzer configuration.
   */
  deleteNetworkAnalyzerConfiguration(params: IoTWireless.Types.DeleteNetworkAnalyzerConfigurationRequest, callback?: (err: AWSError, data: IoTWireless.Types.DeleteNetworkAnalyzerConfigurationResponse) => void): Request<IoTWireless.Types.DeleteNetworkAnalyzerConfigurationResponse, AWSError>;
  /**
   * Deletes a network analyzer configuration.
   */
  deleteNetworkAnalyzerConfiguration(callback?: (err: AWSError, data: IoTWireless.Types.DeleteNetworkAnalyzerConfigurationResponse) => void): Request<IoTWireless.Types.DeleteNetworkAnalyzerConfigurationResponse, AWSError>;
  /**
   * Remove queued messages from the downlink queue.
   */
  deleteQueuedMessages(params: IoTWireless.Types.DeleteQueuedMessagesRequest, callback?: (err: AWSError, data: IoTWireless.Types.DeleteQueuedMessagesResponse) => void): Request<IoTWireless.Types.DeleteQueuedMessagesResponse, AWSError>;
  /**
   * Remove queued messages from the downlink queue.
   */
  deleteQueuedMessages(callback?: (err: AWSError, data: IoTWireless.Types.DeleteQueuedMessagesResponse) => void): Request<IoTWireless.Types.DeleteQueuedMessagesResponse, AWSError>;
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
   * Delete an import task.
   */
  deleteWirelessDeviceImportTask(params: IoTWireless.Types.DeleteWirelessDeviceImportTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.DeleteWirelessDeviceImportTaskResponse) => void): Request<IoTWireless.Types.DeleteWirelessDeviceImportTaskResponse, AWSError>;
  /**
   * Delete an import task.
   */
  deleteWirelessDeviceImportTask(callback?: (err: AWSError, data: IoTWireless.Types.DeleteWirelessDeviceImportTaskResponse) => void): Request<IoTWireless.Types.DeleteWirelessDeviceImportTaskResponse, AWSError>;
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
   * Deregister a wireless device from AWS IoT Wireless.
   */
  deregisterWirelessDevice(params: IoTWireless.Types.DeregisterWirelessDeviceRequest, callback?: (err: AWSError, data: IoTWireless.Types.DeregisterWirelessDeviceResponse) => void): Request<IoTWireless.Types.DeregisterWirelessDeviceResponse, AWSError>;
  /**
   * Deregister a wireless device from AWS IoT Wireless.
   */
  deregisterWirelessDevice(callback?: (err: AWSError, data: IoTWireless.Types.DeregisterWirelessDeviceResponse) => void): Request<IoTWireless.Types.DeregisterWirelessDeviceResponse, AWSError>;
  /**
   * Disassociates your AWS account from a partner account. If PartnerAccountId and PartnerType are null, disassociates your AWS account from all partner accounts.
   */
  disassociateAwsAccountFromPartnerAccount(params: IoTWireless.Types.DisassociateAwsAccountFromPartnerAccountRequest, callback?: (err: AWSError, data: IoTWireless.Types.DisassociateAwsAccountFromPartnerAccountResponse) => void): Request<IoTWireless.Types.DisassociateAwsAccountFromPartnerAccountResponse, AWSError>;
  /**
   * Disassociates your AWS account from a partner account. If PartnerAccountId and PartnerType are null, disassociates your AWS account from all partner accounts.
   */
  disassociateAwsAccountFromPartnerAccount(callback?: (err: AWSError, data: IoTWireless.Types.DisassociateAwsAccountFromPartnerAccountResponse) => void): Request<IoTWireless.Types.DisassociateAwsAccountFromPartnerAccountResponse, AWSError>;
  /**
   * Disassociates a multicast group from a fuota task.
   */
  disassociateMulticastGroupFromFuotaTask(params: IoTWireless.Types.DisassociateMulticastGroupFromFuotaTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.DisassociateMulticastGroupFromFuotaTaskResponse) => void): Request<IoTWireless.Types.DisassociateMulticastGroupFromFuotaTaskResponse, AWSError>;
  /**
   * Disassociates a multicast group from a fuota task.
   */
  disassociateMulticastGroupFromFuotaTask(callback?: (err: AWSError, data: IoTWireless.Types.DisassociateMulticastGroupFromFuotaTaskResponse) => void): Request<IoTWireless.Types.DisassociateMulticastGroupFromFuotaTaskResponse, AWSError>;
  /**
   * Disassociates a wireless device from a FUOTA task.
   */
  disassociateWirelessDeviceFromFuotaTask(params: IoTWireless.Types.DisassociateWirelessDeviceFromFuotaTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.DisassociateWirelessDeviceFromFuotaTaskResponse) => void): Request<IoTWireless.Types.DisassociateWirelessDeviceFromFuotaTaskResponse, AWSError>;
  /**
   * Disassociates a wireless device from a FUOTA task.
   */
  disassociateWirelessDeviceFromFuotaTask(callback?: (err: AWSError, data: IoTWireless.Types.DisassociateWirelessDeviceFromFuotaTaskResponse) => void): Request<IoTWireless.Types.DisassociateWirelessDeviceFromFuotaTaskResponse, AWSError>;
  /**
   * Disassociates a wireless device from a multicast group.
   */
  disassociateWirelessDeviceFromMulticastGroup(params: IoTWireless.Types.DisassociateWirelessDeviceFromMulticastGroupRequest, callback?: (err: AWSError, data: IoTWireless.Types.DisassociateWirelessDeviceFromMulticastGroupResponse) => void): Request<IoTWireless.Types.DisassociateWirelessDeviceFromMulticastGroupResponse, AWSError>;
  /**
   * Disassociates a wireless device from a multicast group.
   */
  disassociateWirelessDeviceFromMulticastGroup(callback?: (err: AWSError, data: IoTWireless.Types.DisassociateWirelessDeviceFromMulticastGroupResponse) => void): Request<IoTWireless.Types.DisassociateWirelessDeviceFromMulticastGroupResponse, AWSError>;
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
   * Get the event configuration based on resource types.
   */
  getEventConfigurationByResourceTypes(params: IoTWireless.Types.GetEventConfigurationByResourceTypesRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetEventConfigurationByResourceTypesResponse) => void): Request<IoTWireless.Types.GetEventConfigurationByResourceTypesResponse, AWSError>;
  /**
   * Get the event configuration based on resource types.
   */
  getEventConfigurationByResourceTypes(callback?: (err: AWSError, data: IoTWireless.Types.GetEventConfigurationByResourceTypesResponse) => void): Request<IoTWireless.Types.GetEventConfigurationByResourceTypesResponse, AWSError>;
  /**
   * Gets information about a FUOTA task.
   */
  getFuotaTask(params: IoTWireless.Types.GetFuotaTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetFuotaTaskResponse) => void): Request<IoTWireless.Types.GetFuotaTaskResponse, AWSError>;
  /**
   * Gets information about a FUOTA task.
   */
  getFuotaTask(callback?: (err: AWSError, data: IoTWireless.Types.GetFuotaTaskResponse) => void): Request<IoTWireless.Types.GetFuotaTaskResponse, AWSError>;
  /**
   * Returns current default log levels or log levels by resource types. Based on resource types, log levels can be for wireless device log options or wireless gateway log options.
   */
  getLogLevelsByResourceTypes(params: IoTWireless.Types.GetLogLevelsByResourceTypesRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetLogLevelsByResourceTypesResponse) => void): Request<IoTWireless.Types.GetLogLevelsByResourceTypesResponse, AWSError>;
  /**
   * Returns current default log levels or log levels by resource types. Based on resource types, log levels can be for wireless device log options or wireless gateway log options.
   */
  getLogLevelsByResourceTypes(callback?: (err: AWSError, data: IoTWireless.Types.GetLogLevelsByResourceTypesResponse) => void): Request<IoTWireless.Types.GetLogLevelsByResourceTypesResponse, AWSError>;
  /**
   * Gets information about a multicast group.
   */
  getMulticastGroup(params: IoTWireless.Types.GetMulticastGroupRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetMulticastGroupResponse) => void): Request<IoTWireless.Types.GetMulticastGroupResponse, AWSError>;
  /**
   * Gets information about a multicast group.
   */
  getMulticastGroup(callback?: (err: AWSError, data: IoTWireless.Types.GetMulticastGroupResponse) => void): Request<IoTWireless.Types.GetMulticastGroupResponse, AWSError>;
  /**
   * Gets information about a multicast group session.
   */
  getMulticastGroupSession(params: IoTWireless.Types.GetMulticastGroupSessionRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetMulticastGroupSessionResponse) => void): Request<IoTWireless.Types.GetMulticastGroupSessionResponse, AWSError>;
  /**
   * Gets information about a multicast group session.
   */
  getMulticastGroupSession(callback?: (err: AWSError, data: IoTWireless.Types.GetMulticastGroupSessionResponse) => void): Request<IoTWireless.Types.GetMulticastGroupSessionResponse, AWSError>;
  /**
   * Get network analyzer configuration.
   */
  getNetworkAnalyzerConfiguration(params: IoTWireless.Types.GetNetworkAnalyzerConfigurationRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetNetworkAnalyzerConfigurationResponse) => void): Request<IoTWireless.Types.GetNetworkAnalyzerConfigurationResponse, AWSError>;
  /**
   * Get network analyzer configuration.
   */
  getNetworkAnalyzerConfiguration(callback?: (err: AWSError, data: IoTWireless.Types.GetNetworkAnalyzerConfigurationResponse) => void): Request<IoTWireless.Types.GetNetworkAnalyzerConfigurationResponse, AWSError>;
  /**
   * Gets information about a partner account. If PartnerAccountId and PartnerType are null, returns all partner accounts.
   */
  getPartnerAccount(params: IoTWireless.Types.GetPartnerAccountRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetPartnerAccountResponse) => void): Request<IoTWireless.Types.GetPartnerAccountResponse, AWSError>;
  /**
   * Gets information about a partner account. If PartnerAccountId and PartnerType are null, returns all partner accounts.
   */
  getPartnerAccount(callback?: (err: AWSError, data: IoTWireless.Types.GetPartnerAccountResponse) => void): Request<IoTWireless.Types.GetPartnerAccountResponse, AWSError>;
  /**
   * Get the position information for a given resource.  This action is no longer supported. Calls to retrieve the position information should use the GetResourcePosition API operation instead. 
   */
  getPosition(params: IoTWireless.Types.GetPositionRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetPositionResponse) => void): Request<IoTWireless.Types.GetPositionResponse, AWSError>;
  /**
   * Get the position information for a given resource.  This action is no longer supported. Calls to retrieve the position information should use the GetResourcePosition API operation instead. 
   */
  getPosition(callback?: (err: AWSError, data: IoTWireless.Types.GetPositionResponse) => void): Request<IoTWireless.Types.GetPositionResponse, AWSError>;
  /**
   * Get position configuration for a given resource.  This action is no longer supported. Calls to retrieve the position configuration should use the GetResourcePosition API operation instead. 
   */
  getPositionConfiguration(params: IoTWireless.Types.GetPositionConfigurationRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetPositionConfigurationResponse) => void): Request<IoTWireless.Types.GetPositionConfigurationResponse, AWSError>;
  /**
   * Get position configuration for a given resource.  This action is no longer supported. Calls to retrieve the position configuration should use the GetResourcePosition API operation instead. 
   */
  getPositionConfiguration(callback?: (err: AWSError, data: IoTWireless.Types.GetPositionConfigurationResponse) => void): Request<IoTWireless.Types.GetPositionConfigurationResponse, AWSError>;
  /**
   * Get estimated position information as a payload in GeoJSON format. The payload measurement data is resolved using solvers that are provided by third-party vendors.
   */
  getPositionEstimate(params: IoTWireless.Types.GetPositionEstimateRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetPositionEstimateResponse) => void): Request<IoTWireless.Types.GetPositionEstimateResponse, AWSError>;
  /**
   * Get estimated position information as a payload in GeoJSON format. The payload measurement data is resolved using solvers that are provided by third-party vendors.
   */
  getPositionEstimate(callback?: (err: AWSError, data: IoTWireless.Types.GetPositionEstimateResponse) => void): Request<IoTWireless.Types.GetPositionEstimateResponse, AWSError>;
  /**
   * Get the event configuration for a particular resource identifier.
   */
  getResourceEventConfiguration(params: IoTWireless.Types.GetResourceEventConfigurationRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetResourceEventConfigurationResponse) => void): Request<IoTWireless.Types.GetResourceEventConfigurationResponse, AWSError>;
  /**
   * Get the event configuration for a particular resource identifier.
   */
  getResourceEventConfiguration(callback?: (err: AWSError, data: IoTWireless.Types.GetResourceEventConfigurationResponse) => void): Request<IoTWireless.Types.GetResourceEventConfigurationResponse, AWSError>;
  /**
   * Fetches the log-level override, if any, for a given resource-ID and resource-type. It can be used for a wireless device or a wireless gateway.
   */
  getResourceLogLevel(params: IoTWireless.Types.GetResourceLogLevelRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetResourceLogLevelResponse) => void): Request<IoTWireless.Types.GetResourceLogLevelResponse, AWSError>;
  /**
   * Fetches the log-level override, if any, for a given resource-ID and resource-type. It can be used for a wireless device or a wireless gateway.
   */
  getResourceLogLevel(callback?: (err: AWSError, data: IoTWireless.Types.GetResourceLogLevelResponse) => void): Request<IoTWireless.Types.GetResourceLogLevelResponse, AWSError>;
  /**
   * Get the position information for a given wireless device or a wireless gateway resource. The position information uses the  World Geodetic System (WGS84).
   */
  getResourcePosition(params: IoTWireless.Types.GetResourcePositionRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetResourcePositionResponse) => void): Request<IoTWireless.Types.GetResourcePositionResponse, AWSError>;
  /**
   * Get the position information for a given wireless device or a wireless gateway resource. The position information uses the  World Geodetic System (WGS84).
   */
  getResourcePosition(callback?: (err: AWSError, data: IoTWireless.Types.GetResourcePositionResponse) => void): Request<IoTWireless.Types.GetResourcePositionResponse, AWSError>;
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
   * Get information about an import task and count of device onboarding summary information for the import task.
   */
  getWirelessDeviceImportTask(params: IoTWireless.Types.GetWirelessDeviceImportTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessDeviceImportTaskResponse) => void): Request<IoTWireless.Types.GetWirelessDeviceImportTaskResponse, AWSError>;
  /**
   * Get information about an import task and count of device onboarding summary information for the import task.
   */
  getWirelessDeviceImportTask(callback?: (err: AWSError, data: IoTWireless.Types.GetWirelessDeviceImportTaskResponse) => void): Request<IoTWireless.Types.GetWirelessDeviceImportTaskResponse, AWSError>;
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
   * List the Sidewalk devices in an import task and their onboarding status.
   */
  listDevicesForWirelessDeviceImportTask(params: IoTWireless.Types.ListDevicesForWirelessDeviceImportTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListDevicesForWirelessDeviceImportTaskResponse) => void): Request<IoTWireless.Types.ListDevicesForWirelessDeviceImportTaskResponse, AWSError>;
  /**
   * List the Sidewalk devices in an import task and their onboarding status.
   */
  listDevicesForWirelessDeviceImportTask(callback?: (err: AWSError, data: IoTWireless.Types.ListDevicesForWirelessDeviceImportTaskResponse) => void): Request<IoTWireless.Types.ListDevicesForWirelessDeviceImportTaskResponse, AWSError>;
  /**
   * List event configurations where at least one event topic has been enabled.
   */
  listEventConfigurations(params: IoTWireless.Types.ListEventConfigurationsRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListEventConfigurationsResponse) => void): Request<IoTWireless.Types.ListEventConfigurationsResponse, AWSError>;
  /**
   * List event configurations where at least one event topic has been enabled.
   */
  listEventConfigurations(callback?: (err: AWSError, data: IoTWireless.Types.ListEventConfigurationsResponse) => void): Request<IoTWireless.Types.ListEventConfigurationsResponse, AWSError>;
  /**
   * Lists the FUOTA tasks registered to your AWS account.
   */
  listFuotaTasks(params: IoTWireless.Types.ListFuotaTasksRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListFuotaTasksResponse) => void): Request<IoTWireless.Types.ListFuotaTasksResponse, AWSError>;
  /**
   * Lists the FUOTA tasks registered to your AWS account.
   */
  listFuotaTasks(callback?: (err: AWSError, data: IoTWireless.Types.ListFuotaTasksResponse) => void): Request<IoTWireless.Types.ListFuotaTasksResponse, AWSError>;
  /**
   * Lists the multicast groups registered to your AWS account.
   */
  listMulticastGroups(params: IoTWireless.Types.ListMulticastGroupsRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListMulticastGroupsResponse) => void): Request<IoTWireless.Types.ListMulticastGroupsResponse, AWSError>;
  /**
   * Lists the multicast groups registered to your AWS account.
   */
  listMulticastGroups(callback?: (err: AWSError, data: IoTWireless.Types.ListMulticastGroupsResponse) => void): Request<IoTWireless.Types.ListMulticastGroupsResponse, AWSError>;
  /**
   * List all multicast groups associated with a fuota task.
   */
  listMulticastGroupsByFuotaTask(params: IoTWireless.Types.ListMulticastGroupsByFuotaTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListMulticastGroupsByFuotaTaskResponse) => void): Request<IoTWireless.Types.ListMulticastGroupsByFuotaTaskResponse, AWSError>;
  /**
   * List all multicast groups associated with a fuota task.
   */
  listMulticastGroupsByFuotaTask(callback?: (err: AWSError, data: IoTWireless.Types.ListMulticastGroupsByFuotaTaskResponse) => void): Request<IoTWireless.Types.ListMulticastGroupsByFuotaTaskResponse, AWSError>;
  /**
   * Lists the network analyzer configurations.
   */
  listNetworkAnalyzerConfigurations(params: IoTWireless.Types.ListNetworkAnalyzerConfigurationsRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListNetworkAnalyzerConfigurationsResponse) => void): Request<IoTWireless.Types.ListNetworkAnalyzerConfigurationsResponse, AWSError>;
  /**
   * Lists the network analyzer configurations.
   */
  listNetworkAnalyzerConfigurations(callback?: (err: AWSError, data: IoTWireless.Types.ListNetworkAnalyzerConfigurationsResponse) => void): Request<IoTWireless.Types.ListNetworkAnalyzerConfigurationsResponse, AWSError>;
  /**
   * Lists the partner accounts associated with your AWS account.
   */
  listPartnerAccounts(params: IoTWireless.Types.ListPartnerAccountsRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListPartnerAccountsResponse) => void): Request<IoTWireless.Types.ListPartnerAccountsResponse, AWSError>;
  /**
   * Lists the partner accounts associated with your AWS account.
   */
  listPartnerAccounts(callback?: (err: AWSError, data: IoTWireless.Types.ListPartnerAccountsResponse) => void): Request<IoTWireless.Types.ListPartnerAccountsResponse, AWSError>;
  /**
   * List position configurations for a given resource, such as positioning solvers.  This action is no longer supported. Calls to retrieve position information should use the GetResourcePosition API operation instead. 
   */
  listPositionConfigurations(params: IoTWireless.Types.ListPositionConfigurationsRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListPositionConfigurationsResponse) => void): Request<IoTWireless.Types.ListPositionConfigurationsResponse, AWSError>;
  /**
   * List position configurations for a given resource, such as positioning solvers.  This action is no longer supported. Calls to retrieve position information should use the GetResourcePosition API operation instead. 
   */
  listPositionConfigurations(callback?: (err: AWSError, data: IoTWireless.Types.ListPositionConfigurationsResponse) => void): Request<IoTWireless.Types.ListPositionConfigurationsResponse, AWSError>;
  /**
   * List queued messages in the downlink queue.
   */
  listQueuedMessages(params: IoTWireless.Types.ListQueuedMessagesRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListQueuedMessagesResponse) => void): Request<IoTWireless.Types.ListQueuedMessagesResponse, AWSError>;
  /**
   * List queued messages in the downlink queue.
   */
  listQueuedMessages(callback?: (err: AWSError, data: IoTWireless.Types.ListQueuedMessagesResponse) => void): Request<IoTWireless.Types.ListQueuedMessagesResponse, AWSError>;
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
   * List wireless devices that have been added to an import task.
   */
  listWirelessDeviceImportTasks(params: IoTWireless.Types.ListWirelessDeviceImportTasksRequest, callback?: (err: AWSError, data: IoTWireless.Types.ListWirelessDeviceImportTasksResponse) => void): Request<IoTWireless.Types.ListWirelessDeviceImportTasksResponse, AWSError>;
  /**
   * List wireless devices that have been added to an import task.
   */
  listWirelessDeviceImportTasks(callback?: (err: AWSError, data: IoTWireless.Types.ListWirelessDeviceImportTasksResponse) => void): Request<IoTWireless.Types.ListWirelessDeviceImportTasksResponse, AWSError>;
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
   * Put position configuration for a given resource.  This action is no longer supported. Calls to update the position configuration should use the UpdateResourcePosition API operation instead. 
   */
  putPositionConfiguration(params: IoTWireless.Types.PutPositionConfigurationRequest, callback?: (err: AWSError, data: IoTWireless.Types.PutPositionConfigurationResponse) => void): Request<IoTWireless.Types.PutPositionConfigurationResponse, AWSError>;
  /**
   * Put position configuration for a given resource.  This action is no longer supported. Calls to update the position configuration should use the UpdateResourcePosition API operation instead. 
   */
  putPositionConfiguration(callback?: (err: AWSError, data: IoTWireless.Types.PutPositionConfigurationResponse) => void): Request<IoTWireless.Types.PutPositionConfigurationResponse, AWSError>;
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
   * Sends the specified data to a multicast group.
   */
  sendDataToMulticastGroup(params: IoTWireless.Types.SendDataToMulticastGroupRequest, callback?: (err: AWSError, data: IoTWireless.Types.SendDataToMulticastGroupResponse) => void): Request<IoTWireless.Types.SendDataToMulticastGroupResponse, AWSError>;
  /**
   * Sends the specified data to a multicast group.
   */
  sendDataToMulticastGroup(callback?: (err: AWSError, data: IoTWireless.Types.SendDataToMulticastGroupResponse) => void): Request<IoTWireless.Types.SendDataToMulticastGroupResponse, AWSError>;
  /**
   * Sends a decrypted application data frame to a device.
   */
  sendDataToWirelessDevice(params: IoTWireless.Types.SendDataToWirelessDeviceRequest, callback?: (err: AWSError, data: IoTWireless.Types.SendDataToWirelessDeviceResponse) => void): Request<IoTWireless.Types.SendDataToWirelessDeviceResponse, AWSError>;
  /**
   * Sends a decrypted application data frame to a device.
   */
  sendDataToWirelessDevice(callback?: (err: AWSError, data: IoTWireless.Types.SendDataToWirelessDeviceResponse) => void): Request<IoTWireless.Types.SendDataToWirelessDeviceResponse, AWSError>;
  /**
   * Starts a bulk association of all qualifying wireless devices with a multicast group.
   */
  startBulkAssociateWirelessDeviceWithMulticastGroup(params: IoTWireless.Types.StartBulkAssociateWirelessDeviceWithMulticastGroupRequest, callback?: (err: AWSError, data: IoTWireless.Types.StartBulkAssociateWirelessDeviceWithMulticastGroupResponse) => void): Request<IoTWireless.Types.StartBulkAssociateWirelessDeviceWithMulticastGroupResponse, AWSError>;
  /**
   * Starts a bulk association of all qualifying wireless devices with a multicast group.
   */
  startBulkAssociateWirelessDeviceWithMulticastGroup(callback?: (err: AWSError, data: IoTWireless.Types.StartBulkAssociateWirelessDeviceWithMulticastGroupResponse) => void): Request<IoTWireless.Types.StartBulkAssociateWirelessDeviceWithMulticastGroupResponse, AWSError>;
  /**
   * Starts a bulk disassociatin of all qualifying wireless devices from a multicast group.
   */
  startBulkDisassociateWirelessDeviceFromMulticastGroup(params: IoTWireless.Types.StartBulkDisassociateWirelessDeviceFromMulticastGroupRequest, callback?: (err: AWSError, data: IoTWireless.Types.StartBulkDisassociateWirelessDeviceFromMulticastGroupResponse) => void): Request<IoTWireless.Types.StartBulkDisassociateWirelessDeviceFromMulticastGroupResponse, AWSError>;
  /**
   * Starts a bulk disassociatin of all qualifying wireless devices from a multicast group.
   */
  startBulkDisassociateWirelessDeviceFromMulticastGroup(callback?: (err: AWSError, data: IoTWireless.Types.StartBulkDisassociateWirelessDeviceFromMulticastGroupResponse) => void): Request<IoTWireless.Types.StartBulkDisassociateWirelessDeviceFromMulticastGroupResponse, AWSError>;
  /**
   * Starts a FUOTA task.
   */
  startFuotaTask(params: IoTWireless.Types.StartFuotaTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.StartFuotaTaskResponse) => void): Request<IoTWireless.Types.StartFuotaTaskResponse, AWSError>;
  /**
   * Starts a FUOTA task.
   */
  startFuotaTask(callback?: (err: AWSError, data: IoTWireless.Types.StartFuotaTaskResponse) => void): Request<IoTWireless.Types.StartFuotaTaskResponse, AWSError>;
  /**
   * Starts a multicast group session.
   */
  startMulticastGroupSession(params: IoTWireless.Types.StartMulticastGroupSessionRequest, callback?: (err: AWSError, data: IoTWireless.Types.StartMulticastGroupSessionResponse) => void): Request<IoTWireless.Types.StartMulticastGroupSessionResponse, AWSError>;
  /**
   * Starts a multicast group session.
   */
  startMulticastGroupSession(callback?: (err: AWSError, data: IoTWireless.Types.StartMulticastGroupSessionResponse) => void): Request<IoTWireless.Types.StartMulticastGroupSessionResponse, AWSError>;
  /**
   * Start import task for a single wireless device.
   */
  startSingleWirelessDeviceImportTask(params: IoTWireless.Types.StartSingleWirelessDeviceImportTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.StartSingleWirelessDeviceImportTaskResponse) => void): Request<IoTWireless.Types.StartSingleWirelessDeviceImportTaskResponse, AWSError>;
  /**
   * Start import task for a single wireless device.
   */
  startSingleWirelessDeviceImportTask(callback?: (err: AWSError, data: IoTWireless.Types.StartSingleWirelessDeviceImportTaskResponse) => void): Request<IoTWireless.Types.StartSingleWirelessDeviceImportTaskResponse, AWSError>;
  /**
   * Start import task for provisioning Sidewalk devices in bulk using an S3 CSV file.
   */
  startWirelessDeviceImportTask(params: IoTWireless.Types.StartWirelessDeviceImportTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.StartWirelessDeviceImportTaskResponse) => void): Request<IoTWireless.Types.StartWirelessDeviceImportTaskResponse, AWSError>;
  /**
   * Start import task for provisioning Sidewalk devices in bulk using an S3 CSV file.
   */
  startWirelessDeviceImportTask(callback?: (err: AWSError, data: IoTWireless.Types.StartWirelessDeviceImportTaskResponse) => void): Request<IoTWireless.Types.StartWirelessDeviceImportTaskResponse, AWSError>;
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
   * Update the event configuration based on resource types.
   */
  updateEventConfigurationByResourceTypes(params: IoTWireless.Types.UpdateEventConfigurationByResourceTypesRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdateEventConfigurationByResourceTypesResponse) => void): Request<IoTWireless.Types.UpdateEventConfigurationByResourceTypesResponse, AWSError>;
  /**
   * Update the event configuration based on resource types.
   */
  updateEventConfigurationByResourceTypes(callback?: (err: AWSError, data: IoTWireless.Types.UpdateEventConfigurationByResourceTypesResponse) => void): Request<IoTWireless.Types.UpdateEventConfigurationByResourceTypesResponse, AWSError>;
  /**
   * Updates properties of a FUOTA task.
   */
  updateFuotaTask(params: IoTWireless.Types.UpdateFuotaTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdateFuotaTaskResponse) => void): Request<IoTWireless.Types.UpdateFuotaTaskResponse, AWSError>;
  /**
   * Updates properties of a FUOTA task.
   */
  updateFuotaTask(callback?: (err: AWSError, data: IoTWireless.Types.UpdateFuotaTaskResponse) => void): Request<IoTWireless.Types.UpdateFuotaTaskResponse, AWSError>;
  /**
   * Set default log level, or log levels by resource types. This can be for wireless device log options or wireless gateways log options and is used to control the log messages that'll be displayed in CloudWatch.
   */
  updateLogLevelsByResourceTypes(params: IoTWireless.Types.UpdateLogLevelsByResourceTypesRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdateLogLevelsByResourceTypesResponse) => void): Request<IoTWireless.Types.UpdateLogLevelsByResourceTypesResponse, AWSError>;
  /**
   * Set default log level, or log levels by resource types. This can be for wireless device log options or wireless gateways log options and is used to control the log messages that'll be displayed in CloudWatch.
   */
  updateLogLevelsByResourceTypes(callback?: (err: AWSError, data: IoTWireless.Types.UpdateLogLevelsByResourceTypesResponse) => void): Request<IoTWireless.Types.UpdateLogLevelsByResourceTypesResponse, AWSError>;
  /**
   * Updates properties of a multicast group session.
   */
  updateMulticastGroup(params: IoTWireless.Types.UpdateMulticastGroupRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdateMulticastGroupResponse) => void): Request<IoTWireless.Types.UpdateMulticastGroupResponse, AWSError>;
  /**
   * Updates properties of a multicast group session.
   */
  updateMulticastGroup(callback?: (err: AWSError, data: IoTWireless.Types.UpdateMulticastGroupResponse) => void): Request<IoTWireless.Types.UpdateMulticastGroupResponse, AWSError>;
  /**
   * Update network analyzer configuration.
   */
  updateNetworkAnalyzerConfiguration(params: IoTWireless.Types.UpdateNetworkAnalyzerConfigurationRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdateNetworkAnalyzerConfigurationResponse) => void): Request<IoTWireless.Types.UpdateNetworkAnalyzerConfigurationResponse, AWSError>;
  /**
   * Update network analyzer configuration.
   */
  updateNetworkAnalyzerConfiguration(callback?: (err: AWSError, data: IoTWireless.Types.UpdateNetworkAnalyzerConfigurationResponse) => void): Request<IoTWireless.Types.UpdateNetworkAnalyzerConfigurationResponse, AWSError>;
  /**
   * Updates properties of a partner account.
   */
  updatePartnerAccount(params: IoTWireless.Types.UpdatePartnerAccountRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdatePartnerAccountResponse) => void): Request<IoTWireless.Types.UpdatePartnerAccountResponse, AWSError>;
  /**
   * Updates properties of a partner account.
   */
  updatePartnerAccount(callback?: (err: AWSError, data: IoTWireless.Types.UpdatePartnerAccountResponse) => void): Request<IoTWireless.Types.UpdatePartnerAccountResponse, AWSError>;
  /**
   * Update the position information of a resource.  This action is no longer supported. Calls to update the position information should use the UpdateResourcePosition API operation instead. 
   */
  updatePosition(params: IoTWireless.Types.UpdatePositionRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdatePositionResponse) => void): Request<IoTWireless.Types.UpdatePositionResponse, AWSError>;
  /**
   * Update the position information of a resource.  This action is no longer supported. Calls to update the position information should use the UpdateResourcePosition API operation instead. 
   */
  updatePosition(callback?: (err: AWSError, data: IoTWireless.Types.UpdatePositionResponse) => void): Request<IoTWireless.Types.UpdatePositionResponse, AWSError>;
  /**
   * Update the event configuration for a particular resource identifier.
   */
  updateResourceEventConfiguration(params: IoTWireless.Types.UpdateResourceEventConfigurationRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdateResourceEventConfigurationResponse) => void): Request<IoTWireless.Types.UpdateResourceEventConfigurationResponse, AWSError>;
  /**
   * Update the event configuration for a particular resource identifier.
   */
  updateResourceEventConfiguration(callback?: (err: AWSError, data: IoTWireless.Types.UpdateResourceEventConfigurationResponse) => void): Request<IoTWireless.Types.UpdateResourceEventConfigurationResponse, AWSError>;
  /**
   * Update the position information of a given wireless device or a wireless gateway resource. The position coordinates are based on the  World Geodetic System (WGS84).
   */
  updateResourcePosition(params: IoTWireless.Types.UpdateResourcePositionRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdateResourcePositionResponse) => void): Request<IoTWireless.Types.UpdateResourcePositionResponse, AWSError>;
  /**
   * Update the position information of a given wireless device or a wireless gateway resource. The position coordinates are based on the  World Geodetic System (WGS84).
   */
  updateResourcePosition(callback?: (err: AWSError, data: IoTWireless.Types.UpdateResourcePositionResponse) => void): Request<IoTWireless.Types.UpdateResourcePositionResponse, AWSError>;
  /**
   * Updates properties of a wireless device.
   */
  updateWirelessDevice(params: IoTWireless.Types.UpdateWirelessDeviceRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdateWirelessDeviceResponse) => void): Request<IoTWireless.Types.UpdateWirelessDeviceResponse, AWSError>;
  /**
   * Updates properties of a wireless device.
   */
  updateWirelessDevice(callback?: (err: AWSError, data: IoTWireless.Types.UpdateWirelessDeviceResponse) => void): Request<IoTWireless.Types.UpdateWirelessDeviceResponse, AWSError>;
  /**
   * Update an import task to add more devices to the task.
   */
  updateWirelessDeviceImportTask(params: IoTWireless.Types.UpdateWirelessDeviceImportTaskRequest, callback?: (err: AWSError, data: IoTWireless.Types.UpdateWirelessDeviceImportTaskResponse) => void): Request<IoTWireless.Types.UpdateWirelessDeviceImportTaskResponse, AWSError>;
  /**
   * Update an import task to add more devices to the task.
   */
  updateWirelessDeviceImportTask(callback?: (err: AWSError, data: IoTWireless.Types.UpdateWirelessDeviceImportTaskResponse) => void): Request<IoTWireless.Types.UpdateWirelessDeviceImportTaskResponse, AWSError>;
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
    /**
     * The FCnt init value.
     */
    FCntStart?: FCntStart;
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
    /**
     * The FCnt init value.
     */
    FCntStart?: FCntStart;
  }
  export type AccountLinked = boolean;
  export interface Accuracy {
    /**
     * The horizontal accuracy of the estimated position, which is the difference between the estimated location and the actual device location.
     */
    HorizontalAccuracy?: HorizontalAccuracy;
    /**
     * The vertical accuracy of the estimated position, which is the difference between the estimated altitude and actual device latitude in meters.
     */
    VerticalAccuracy?: VerticalAccuracy;
  }
  export type AckModeRetryDurationSecs = number;
  export type AddGwMetadata = boolean;
  export type AmazonId = string;
  export type AmazonResourceName = string;
  export type ApId = string;
  export type AppEui = string;
  export type AppKey = string;
  export type AppSKey = string;
  export type AppServerPrivateKey = string;
  export interface ApplicationConfig {
    FPort?: FPort;
    /**
     * Application type, which can be specified to obtain real-time position information of your LoRaWAN device.
     */
    Type?: ApplicationConfigType;
    /**
     * The name of the position data destination that describes the AWS IoT rule that processes the device's position data for use by AWS IoT Core for LoRaWAN.
     */
    DestinationName?: DestinationName;
  }
  export type ApplicationConfigType = "SemtechGeolocation"|string;
  export type ApplicationServerPublicKey = string;
  export type Applications = ApplicationConfig[];
  export type AssistPosition = Coordinate[];
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
  export interface AssociateMulticastGroupWithFuotaTaskRequest {
    Id: FuotaTaskId;
    MulticastGroupId: MulticastGroupId;
  }
  export interface AssociateMulticastGroupWithFuotaTaskResponse {
  }
  export interface AssociateWirelessDeviceWithFuotaTaskRequest {
    Id: FuotaTaskId;
    WirelessDeviceId: WirelessDeviceId;
  }
  export interface AssociateWirelessDeviceWithFuotaTaskResponse {
  }
  export interface AssociateWirelessDeviceWithMulticastGroupRequest {
    Id: MulticastGroupId;
    WirelessDeviceId: WirelessDeviceId;
  }
  export interface AssociateWirelessDeviceWithMulticastGroupResponse {
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
  export type BCCH = number;
  export type BSIC = number;
  export type BaseLat = number;
  export type BaseLng = number;
  export type BaseStationId = number;
  export type BatteryLevel = "normal"|"low"|"critical"|string;
  export interface Beaconing {
    /**
     * The data rate for gateways that are sending the beacons.
     */
    DataRate?: BeaconingDataRate;
    /**
     * The frequency list for the gateways to send the beacons.
     */
    Frequencies?: BeaconingFrequencies;
  }
  export type BeaconingDataRate = number;
  export type BeaconingFrequencies = BeaconingFrequency[];
  export type BeaconingFrequency = number;
  export interface CancelMulticastGroupSessionRequest {
    Id: MulticastGroupId;
  }
  export interface CancelMulticastGroupSessionResponse {
  }
  export type CaptureTimeAccuracy = number;
  export type CdmaChannel = number;
  export type CdmaList = CdmaObj[];
  export interface CdmaLocalId {
    /**
     * Pseudo-noise offset, which is a characteristic of the signal from a cell on a radio tower.
     */
    PnOffset: PnOffset;
    /**
     * CDMA channel information.
     */
    CdmaChannel: CdmaChannel;
  }
  export type CdmaNmrList = CdmaNmrObj[];
  export interface CdmaNmrObj {
    /**
     * Pseudo-noise offset, which is a characteristic of the signal from a cell on a radio tower.
     */
    PnOffset: PnOffset;
    /**
     * CDMA channel information.
     */
    CdmaChannel: CdmaChannel;
    /**
     * Transmit power level of the pilot signal, measured in dBm (decibel-milliwatts).
     */
    PilotPower?: PilotPower;
    /**
     * CDMA base station ID (BSID).
     */
    BaseStationId?: BaseStationId;
  }
  export interface CdmaObj {
    /**
     * CDMA system ID (SID).
     */
    SystemId: SystemId;
    /**
     * CDMA network ID (NID).
     */
    NetworkId: NetworkId;
    /**
     * CDMA base station ID (BSID).
     */
    BaseStationId: BaseStationId;
    /**
     * CDMA registration zone (RZ).
     */
    RegistrationZone?: RegistrationZone;
    /**
     * CDMA local identification (local ID) parameters.
     */
    CdmaLocalId?: CdmaLocalId;
    /**
     * Transmit power level of the pilot signal, measured in dBm (decibel-milliwatts).
     */
    PilotPower?: PilotPower;
    /**
     * CDMA base station latitude in degrees.
     */
    BaseLat?: BaseLat;
    /**
     * CDMA base station longitude in degrees.
     */
    BaseLng?: BaseLng;
    /**
     * CDMA network measurement reports.
     */
    CdmaNmr?: CdmaNmrList;
  }
  export type CellParams = number;
  export interface CellTowers {
    /**
     * GSM object information.
     */
    Gsm?: GsmList;
    /**
     * WCDMA object information.
     */
    Wcdma?: WcdmaList;
    /**
     * TD-SCDMA object information.
     */
    Tdscdma?: TdscdmaList;
    /**
     * LTE object information.
     */
    Lte?: LteList;
    /**
     * CDMA object information.
     */
    Cdma?: CdmaList;
  }
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
  export interface ConnectionStatusEventConfiguration {
    /**
     * Connection status event configuration object for enabling or disabling LoRaWAN related event topics.
     */
    LoRaWAN?: LoRaWANConnectionStatusEventNotificationConfigurations;
    /**
     * Denotes whether the wireless gateway ID connection status event topic is enabled or disabled.
     */
    WirelessGatewayIdEventTopic?: EventNotificationTopicStatus;
  }
  export interface ConnectionStatusResourceTypeEventConfiguration {
    /**
     * Connection status resource type event configuration object for enabling or disabling LoRaWAN related event topics.
     */
    LoRaWAN?: LoRaWANConnectionStatusResourceTypeEventConfiguration;
  }
  export type Coordinate = number;
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
    /**
     * The Sidewalk-related information for creating the Sidewalk device profile.
     */
    Sidewalk?: SidewalkCreateDeviceProfile;
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
  export interface CreateFuotaTaskRequest {
    Name?: FuotaTaskName;
    Description?: Description;
    ClientRequestToken?: ClientRequestToken;
    LoRaWAN?: LoRaWANFuotaTask;
    FirmwareUpdateImage: FirmwareUpdateImage;
    FirmwareUpdateRole: FirmwareUpdateRole;
    Tags?: TagList;
    RedundancyPercent?: RedundancyPercent;
    FragmentSizeBytes?: FragmentSizeBytes;
    FragmentIntervalMS?: FragmentIntervalMS;
  }
  export interface CreateFuotaTaskResponse {
    Arn?: FuotaTaskArn;
    Id?: FuotaTaskId;
  }
  export interface CreateMulticastGroupRequest {
    Name?: MulticastGroupName;
    /**
     * The description of the multicast group.
     */
    Description?: Description;
    /**
     * Each resource must have a unique client request token. If you try to create a new resource with the same token as a resource that already exists, an exception occurs. If you omit this value, AWS SDKs will automatically generate a unique client request. 
     */
    ClientRequestToken?: ClientRequestToken;
    LoRaWAN: LoRaWANMulticast;
    Tags?: TagList;
  }
  export interface CreateMulticastGroupResponse {
    Arn?: MulticastGroupArn;
    Id?: MulticastGroupId;
  }
  export interface CreateNetworkAnalyzerConfigurationRequest {
    Name: NetworkAnalyzerConfigurationName;
    TraceContent?: TraceContent;
    /**
     * Wireless device resources to add to the network analyzer configuration. Provide the WirelessDeviceId of the resource to add in the input array.
     */
    WirelessDevices?: WirelessDeviceList;
    /**
     * Wireless gateway resources to add to the network analyzer configuration. Provide the WirelessGatewayId of the resource to add in the input array.
     */
    WirelessGateways?: WirelessGatewayList;
    Description?: Description;
    Tags?: TagList;
    ClientRequestToken?: ClientRequestToken;
    /**
     * Multicast Group resources to add to the network analyzer configruation. Provide the MulticastGroupId of the resource to add in the input array.
     */
    MulticastGroups?: NetworkAnalyzerMulticastGroupList;
  }
  export interface CreateNetworkAnalyzerConfigurationResponse {
    /**
     * The Amazon Resource Name of the new resource.
     */
    Arn?: NetworkAnalyzerConfigurationArn;
    Name?: NetworkAnalyzerConfigurationName;
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
    /**
     * FPort values for the GNSS, stream, and ClockSync functions of the positioning information.
     */
    Positioning?: PositioningConfigStatus;
    /**
     * The device configuration information to use to create the Sidewalk device.
     */
    Sidewalk?: SidewalkCreateWirelessDevice;
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
  export type CreatedAt = Date;
  export type CreationDate = Date;
  export type CreationTime = Date;
  export type DakCertificateId = string;
  export interface DakCertificateMetadata {
    /**
     * The certificate ID for the DAK.
     */
    CertificateId: DakCertificateId;
    /**
     * The maximum number of signatures that the DAK can sign. A value of -1 indicates that there's no device limit.
     */
    MaxAllowedSignature?: MaxAllowedSignature;
    /**
     * Whether factory support has been enabled.
     */
    FactorySupport?: FactorySupport;
    /**
     * The advertised product ID (APID) that's used for pre-production and production applications.
     */
    ApId?: ApId;
    /**
     * The device type ID that's used for prototyping applications.
     */
    DeviceTypeId?: DeviceTypeId;
  }
  export type DakCertificateMetadataList = DakCertificateMetadata[];
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
  export interface DeleteFuotaTaskRequest {
    Id: FuotaTaskId;
  }
  export interface DeleteFuotaTaskResponse {
  }
  export interface DeleteMulticastGroupRequest {
    Id: MulticastGroupId;
  }
  export interface DeleteMulticastGroupResponse {
  }
  export interface DeleteNetworkAnalyzerConfigurationRequest {
    ConfigurationName: NetworkAnalyzerConfigurationName;
  }
  export interface DeleteNetworkAnalyzerConfigurationResponse {
  }
  export interface DeleteQueuedMessagesRequest {
    /**
     * The ID of a given wireless device for which downlink messages will be deleted.
     */
    Id: WirelessDeviceId;
    /**
     * If message ID is "*", it cleares the entire downlink queue for a given device, specified by the wireless device ID. Otherwise, the downlink message with the specified message ID will be deleted.
     */
    MessageId: MessageId;
    /**
     * The wireless device type, which can be either Sidewalk or LoRaWAN.
     */
    WirelessDeviceType?: WirelessDeviceType;
  }
  export interface DeleteQueuedMessagesResponse {
  }
  export interface DeleteServiceProfileRequest {
    /**
     * The ID of the resource to delete.
     */
    Id: ServiceProfileId;
  }
  export interface DeleteServiceProfileResponse {
  }
  export interface DeleteWirelessDeviceImportTaskRequest {
    /**
     * The unique identifier of the import task to be deleted.
     */
    Id: ImportTaskId;
  }
  export interface DeleteWirelessDeviceImportTaskResponse {
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
  export interface DeregisterWirelessDeviceRequest {
    /**
     * The identifier of the wireless device to deregister from AWS IoT Wireless.
     */
    Identifier: Identifier;
    /**
     * The type of wireless device to deregister from AWS IoT Wireless, which can be LoRaWAN or Sidewalk.
     */
    WirelessDeviceType?: WirelessDeviceType;
  }
  export interface DeregisterWirelessDeviceResponse {
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
  export type DeviceCreationFile = string;
  export type DeviceCreationFileList = DeviceCreationFile[];
  export type DeviceName = string;
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
  export type DeviceProfileType = "Sidewalk"|"LoRaWAN"|string;
  export interface DeviceRegistrationStateEventConfiguration {
    /**
     * Device registration state event configuration object for enabling or disabling Sidewalk related event topics.
     */
    Sidewalk?: SidewalkEventNotificationConfigurations;
    /**
     * Denotes whether the wireless device ID device registration state event topic is enabled or disabled.
     */
    WirelessDeviceIdEventTopic?: EventNotificationTopicStatus;
  }
  export interface DeviceRegistrationStateResourceTypeEventConfiguration {
    /**
     * Device registration resource type state event configuration object for enabling or disabling Sidewalk related event topics.
     */
    Sidewalk?: SidewalkResourceTypeEventConfiguration;
  }
  export type DeviceState = "Provisioned"|"RegisteredNotSeen"|"RegisteredReachable"|"RegisteredUnreachable"|string;
  export type DeviceTypeId = string;
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
  export interface DisassociateMulticastGroupFromFuotaTaskRequest {
    Id: FuotaTaskId;
    MulticastGroupId: MulticastGroupId;
  }
  export interface DisassociateMulticastGroupFromFuotaTaskResponse {
  }
  export interface DisassociateWirelessDeviceFromFuotaTaskRequest {
    Id: FuotaTaskId;
    WirelessDeviceId: WirelessDeviceId;
  }
  export interface DisassociateWirelessDeviceFromFuotaTaskResponse {
  }
  export interface DisassociateWirelessDeviceFromMulticastGroupRequest {
    Id: MulticastGroupId;
    WirelessDeviceId: WirelessDeviceId;
  }
  export interface DisassociateWirelessDeviceFromMulticastGroupResponse {
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
  export type DlClass = "ClassB"|"ClassC"|string;
  export type DlDr = number;
  export type DlFreq = number;
  export type DlRate = number;
  export type DlRatePolicy = string;
  export type Double = number;
  export type DownlinkFrequency = number;
  export type DownlinkMode = "SEQUENTIAL"|"CONCURRENT"|"USING_UPLINK_GATEWAY"|string;
  export interface DownlinkQueueMessage {
    /**
     *  The message ID assigned by IoT Wireless to each downlink message, which helps identify the message.
     */
    MessageId?: MessageId;
    /**
     * The transmit mode to use for sending data to the wireless device. This can be 0 for UM (unacknowledge mode) or 1 for AM (acknowledge mode).
     */
    TransmitMode?: TransmitMode;
    /**
     * The time at which Iot Wireless received the downlink message.
     */
    ReceivedAt?: ISODateTimeString;
    LoRaWAN?: LoRaWANSendDataToDevice;
  }
  export type DownlinkQueueMessagesList = DownlinkQueueMessage[];
  export type DrMax = number;
  export type DrMaxBox = number;
  export type DrMin = number;
  export type DrMinBox = number;
  export type EARFCN = number;
  export type EndPoint = string;
  export type EutranCid = number;
  export type Event = "discovered"|"lost"|"ack"|"nack"|"passthrough"|string;
  export interface EventConfigurationItem {
    /**
     * Resource identifier opted in for event messaging.
     */
    Identifier?: Identifier;
    /**
     * Identifier type of the particular resource identifier for event configuration.
     */
    IdentifierType?: IdentifierType;
    /**
     * Partner type of the resource if the identifier type is PartnerAccountId.
     */
    PartnerType?: EventNotificationPartnerType;
    Events?: EventNotificationItemConfigurations;
  }
  export type EventConfigurationsList = EventConfigurationItem[];
  export interface EventNotificationItemConfigurations {
    /**
     * Device registration state event configuration for an event configuration item.
     */
    DeviceRegistrationState?: DeviceRegistrationStateEventConfiguration;
    /**
     * Proximity event configuration for an event configuration item.
     */
    Proximity?: ProximityEventConfiguration;
    /**
     * Join event configuration for an event configuration item.
     */
    Join?: JoinEventConfiguration;
    /**
     * Connection status event configuration for an event configuration item.
     */
    ConnectionStatus?: ConnectionStatusEventConfiguration;
    /**
     * Message delivery status event configuration for an event configuration item.
     */
    MessageDeliveryStatus?: MessageDeliveryStatusEventConfiguration;
  }
  export type EventNotificationPartnerType = "Sidewalk"|string;
  export type EventNotificationResourceType = "SidewalkAccount"|"WirelessDevice"|"WirelessGateway"|string;
  export type EventNotificationTopicStatus = "Enabled"|"Disabled"|string;
  export type Expression = string;
  export type ExpressionType = "RuleName"|"MqttTopic"|string;
  export type FCntStart = number;
  export type FNwkSIntKey = string;
  export type FPort = number;
  export interface FPorts {
    Fuota?: FPort;
    Multicast?: FPort;
    ClockSync?: FPort;
    /**
     * FPort values for the GNSS, stream, and ClockSync functions of the positioning information.
     */
    Positioning?: Positioning;
    /**
     * Optional LoRaWAN application information, which can be used for geolocation.
     */
    Applications?: Applications;
  }
  export type FactoryPresetFreqsList = PresetFreq[];
  export type FactorySupport = boolean;
  export type Fingerprint = string;
  export type FirmwareUpdateImage = string;
  export type FirmwareUpdateRole = string;
  export type FragmentIntervalMS = number;
  export type FragmentSizeBytes = number;
  export type FuotaDeviceStatus = "Initial"|"Package_Not_Supported"|"FragAlgo_unsupported"|"Not_enough_memory"|"FragIndex_unsupported"|"Wrong_descriptor"|"SessionCnt_replay"|"MissingFrag"|"MemoryError"|"MICError"|"Successful"|string;
  export interface FuotaTask {
    Id?: FuotaTaskId;
    Arn?: FuotaTaskArn;
    Name?: FuotaTaskName;
  }
  export type FuotaTaskArn = string;
  export type FuotaTaskId = string;
  export type FuotaTaskList = FuotaTask[];
  export type FuotaTaskName = string;
  export type FuotaTaskStatus = "Pending"|"FuotaSession_Waiting"|"In_FuotaSession"|"FuotaDone"|"Delete_Waiting"|string;
  export type GPST = number;
  export type GatewayEui = string;
  export type GatewayList = GatewayListItem[];
  export interface GatewayListItem {
    /**
     * The ID of the wireless gateways that you want to add to the list of gateways when sending downlink messages.
     */
    GatewayId: WirelessGatewayId;
    /**
     * The frequency to use for the gateways when sending a downlink message to the wireless device.
     */
    DownlinkFrequency: DownlinkFrequency;
  }
  export type GatewayMaxEirp = number;
  export type GenAppKey = string;
  export type GeoJsonPayload = Buffer|Uint8Array|Blob|string;
  export type GeranCid = number;
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
    /**
     * Information about the Sidewalk parameters in the device profile.
     */
    Sidewalk?: SidewalkGetDeviceProfile;
  }
  export interface GetEventConfigurationByResourceTypesRequest {
  }
  export interface GetEventConfigurationByResourceTypesResponse {
    /**
     * Resource type event configuration for the device registration state event.
     */
    DeviceRegistrationState?: DeviceRegistrationStateResourceTypeEventConfiguration;
    /**
     * Resource type event configuration for the proximity event.
     */
    Proximity?: ProximityResourceTypeEventConfiguration;
    /**
     * Resource type event configuration for the join event.
     */
    Join?: JoinResourceTypeEventConfiguration;
    /**
     * Resource type event configuration for the connection status event.
     */
    ConnectionStatus?: ConnectionStatusResourceTypeEventConfiguration;
    /**
     * Resource type event configuration object for the message delivery status event.
     */
    MessageDeliveryStatus?: MessageDeliveryStatusResourceTypeEventConfiguration;
  }
  export interface GetFuotaTaskRequest {
    Id: FuotaTaskId;
  }
  export interface GetFuotaTaskResponse {
    Arn?: FuotaTaskArn;
    Id?: FuotaTaskId;
    Status?: FuotaTaskStatus;
    Name?: FuotaTaskName;
    Description?: Description;
    LoRaWAN?: LoRaWANFuotaTaskGetInfo;
    FirmwareUpdateImage?: FirmwareUpdateImage;
    FirmwareUpdateRole?: FirmwareUpdateRole;
    CreatedAt?: CreatedAt;
    RedundancyPercent?: RedundancyPercent;
    FragmentSizeBytes?: FragmentSizeBytes;
    FragmentIntervalMS?: FragmentIntervalMS;
  }
  export interface GetLogLevelsByResourceTypesRequest {
  }
  export interface GetLogLevelsByResourceTypesResponse {
    DefaultLogLevel?: LogLevel;
    WirelessGatewayLogOptions?: WirelessGatewayLogOptionList;
    WirelessDeviceLogOptions?: WirelessDeviceLogOptionList;
  }
  export interface GetMulticastGroupRequest {
    Id: MulticastGroupId;
  }
  export interface GetMulticastGroupResponse {
    Arn?: MulticastGroupArn;
    Id?: MulticastGroupId;
    Name?: MulticastGroupName;
    Description?: Description;
    Status?: MulticastGroupStatus;
    LoRaWAN?: LoRaWANMulticastGet;
    CreatedAt?: CreatedAt;
  }
  export interface GetMulticastGroupSessionRequest {
    Id: MulticastGroupId;
  }
  export interface GetMulticastGroupSessionResponse {
    LoRaWAN?: LoRaWANMulticastSession;
  }
  export interface GetNetworkAnalyzerConfigurationRequest {
    ConfigurationName: NetworkAnalyzerConfigurationName;
  }
  export interface GetNetworkAnalyzerConfigurationResponse {
    TraceContent?: TraceContent;
    /**
     * List of wireless gateway resources that have been added to the network analyzer configuration.
     */
    WirelessDevices?: WirelessDeviceList;
    /**
     * List of wireless gateway resources that have been added to the network analyzer configuration.
     */
    WirelessGateways?: WirelessGatewayList;
    Description?: Description;
    /**
     * The Amazon Resource Name of the new resource.
     */
    Arn?: NetworkAnalyzerConfigurationArn;
    Name?: NetworkAnalyzerConfigurationName;
    /**
     * List of multicast group resources that have been added to the network analyzer configuration.
     */
    MulticastGroups?: NetworkAnalyzerMulticastGroupList;
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
  export interface GetPositionConfigurationRequest {
    /**
     * Resource identifier used in a position configuration.
     */
    ResourceIdentifier: PositionResourceIdentifier;
    /**
     * Resource type of the resource for which position configuration is retrieved.
     */
    ResourceType: PositionResourceType;
  }
  export interface GetPositionConfigurationResponse {
    /**
     * The wrapper for the solver configuration details object.
     */
    Solvers?: PositionSolverDetails;
    /**
     * The position data destination that describes the AWS IoT rule that processes the device's position data for use by AWS IoT Core for LoRaWAN.
     */
    Destination?: DestinationName;
  }
  export interface GetPositionEstimateRequest {
    /**
     * Retrieves an estimated device position by resolving WLAN measurement data. The position is resolved using HERE's Wi-Fi based solver.
     */
    WiFiAccessPoints?: WiFiAccessPoints;
    /**
     * Retrieves an estimated device position by resolving measurement data from cellular radio towers. The position is resolved using HERE's cellular-based solver.
     */
    CellTowers?: CellTowers;
    /**
     * Retrieves an estimated device position by resolving the IP address information from the device. The position is resolved using MaxMind's IP-based solver.
     */
    Ip?: Ip;
    /**
     * Retrieves an estimated device position by resolving the global navigation satellite system (GNSS) scan data. The position is resolved using the GNSS solver powered by LoRa Cloud.
     */
    Gnss?: Gnss;
    /**
     * Optional information that specifies the time when the position information will be resolved. It uses the Unix timestamp format. If not specified, the time at which the request was received will be used.
     */
    Timestamp?: CreationDate;
  }
  export interface GetPositionEstimateResponse {
    /**
     * The position information of the resource, displayed as a JSON payload. The payload uses the GeoJSON format, which a format that's used to encode geographic data structures. For more information, see GeoJSON.
     */
    GeoJsonPayload?: GeoJsonPayload;
  }
  export interface GetPositionRequest {
    /**
     * Resource identifier used to retrieve the position information.
     */
    ResourceIdentifier: PositionResourceIdentifier;
    /**
     * Resource type of the resource for which position information is retrieved.
     */
    ResourceType: PositionResourceType;
  }
  export interface GetPositionResponse {
    /**
     * The position information of the resource.
     */
    Position?: PositionCoordinate;
    /**
     * The accuracy of the estimated position in meters. An empty value indicates that no position data is available. A value of ‘0.0’ value indicates that position data is available. This data corresponds to the position information that you specified instead of the position computed by solver.
     */
    Accuracy?: Accuracy;
    /**
     * The type of solver used to identify the position of the resource.
     */
    SolverType?: PositionSolverType;
    /**
     * The vendor of the positioning solver.
     */
    SolverProvider?: PositionSolverProvider;
    /**
     * The version of the positioning solver.
     */
    SolverVersion?: PositionSolverVersion;
    /**
     * The timestamp at which the device's position was determined.
     */
    Timestamp?: ISODateTimeString;
  }
  export interface GetResourceEventConfigurationRequest {
    /**
     * Resource identifier to opt in for event messaging.
     */
    Identifier: Identifier;
    /**
     * Identifier type of the particular resource identifier for event configuration.
     */
    IdentifierType: IdentifierType;
    /**
     * Partner type of the resource if the identifier type is PartnerAccountId.
     */
    PartnerType?: EventNotificationPartnerType;
  }
  export interface GetResourceEventConfigurationResponse {
    /**
     * Event configuration for the device registration state event.
     */
    DeviceRegistrationState?: DeviceRegistrationStateEventConfiguration;
    /**
     * Event configuration for the proximity event.
     */
    Proximity?: ProximityEventConfiguration;
    /**
     * Event configuration for the join event.
     */
    Join?: JoinEventConfiguration;
    /**
     * Event configuration for the connection status event.
     */
    ConnectionStatus?: ConnectionStatusEventConfiguration;
    /**
     * Event configuration for the message delivery status event.
     */
    MessageDeliveryStatus?: MessageDeliveryStatusEventConfiguration;
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
  export interface GetResourcePositionRequest {
    /**
     * The identifier of the resource for which position information is retrieved. It can be the wireless device ID or the wireless gateway ID, depending on the resource type.
     */
    ResourceIdentifier: PositionResourceIdentifier;
    /**
     * The type of resource for which position information is retrieved, which can be a wireless device or a wireless gateway.
     */
    ResourceType: PositionResourceType;
  }
  export interface GetResourcePositionResponse {
    /**
     * The position information of the resource, displayed as a JSON payload. The payload uses the GeoJSON format, which a format that's used to encode geographic data structures. For more information, see GeoJSON.
     */
    GeoJsonPayload?: GeoJsonPayload;
  }
  export interface GetServiceEndpointRequest {
    /**
     * The service type for which to get endpoint information about. Can be CUPS for the Configuration and Update Server endpoint, or LNS for the LoRaWAN Network Server endpoint or CLAIM for the global endpoint.
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
  export interface GetWirelessDeviceImportTaskRequest {
    /**
     * The identifier of the import task for which information is requested.
     */
    Id: ImportTaskId;
  }
  export interface GetWirelessDeviceImportTaskResponse {
    /**
     * The identifier of the import task for which information is retrieved.
     */
    Id?: ImportTaskId;
    /**
     * The ARN (Amazon Resource Name) of the import task.
     */
    Arn?: ImportTaskArn;
    /**
     * The name of the destination that's assigned to the wireless devices in the import task.
     */
    DestinationName?: DestinationName;
    /**
     * The Sidewalk-related information about an import task.
     */
    Sidewalk?: SidewalkGetStartImportInfo;
    /**
     * The time at which the import task was created.
     */
    CreationTime?: CreationTime;
    /**
     * The import task status.
     */
    Status?: ImportTaskStatus;
    /**
     * The reason for the provided status information, such as a validation error that causes the import task to fail.
     */
    StatusReason?: StatusReason;
    /**
     * The number of devices in the import task that are waiting for the control log to start processing.
     */
    InitializedImportedDeviceCount?: ImportedWirelessDeviceCount;
    /**
     * The number of devices in the import task that are waiting in the import task queue to be onboarded.
     */
    PendingImportedDeviceCount?: ImportedWirelessDeviceCount;
    /**
     * The number of devices in the import task that have been onboarded to the import task.
     */
    OnboardedImportedDeviceCount?: ImportedWirelessDeviceCount;
    /**
     * The number of devices in the import task that failed to onboard to the import task.
     */
    FailedImportedDeviceCount?: ImportedWirelessDeviceCount;
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
    /**
     * FPort values for the GNSS, stream, and ClockSync functions of the positioning information.
     */
    Positioning?: PositioningConfigStatus;
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
     * The date and time when the most recent uplink was received.  This value is only valid for 3 months. 
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
     * The date and time when the most recent uplink was received.  This value is only valid for 3 months. 
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
     * The date and time when the most recent uplink was received.  This value is only valid for 3 months. 
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
  export interface GlobalIdentity {
    /**
     * Location area code of the global identity.
     */
    Lac: LAC;
    /**
     * GERAN (GSM EDGE Radio Access Network) cell global identifier.
     */
    GeranCid: GeranCid;
  }
  export interface Gnss {
    /**
     * Payload that contains the GNSS scan result, or NAV message, in hexadecimal notation.
     */
    Payload: GnssNav;
    /**
     * Optional parameter that gives an estimate of the time when the GNSS scan information is taken, in seconds GPS time (GPST). If capture time is not specified, the local server time is used.
     */
    CaptureTime?: GPST;
    /**
     * Optional value that gives the capture time estimate accuracy, in seconds. If capture time accuracy is not specified, default value of 300 is used.
     */
    CaptureTimeAccuracy?: CaptureTimeAccuracy;
    /**
     * Optional assistance position information, specified using latitude and longitude values in degrees. The coordinates are inside the WGS84 reference frame.
     */
    AssistPosition?: AssistPosition;
    /**
     * Optional assistance altitude, which is the altitude of the device at capture time, specified in meters above the WGS84 reference ellipsoid.
     */
    AssistAltitude?: Coordinate;
    /**
     * Optional parameter that forces 2D solve, which modifies the positioning algorithm to a 2D solution problem. When this parameter is specified, the assistance altitude should have an accuracy of at least 10 meters.
     */
    Use2DSolver?: Use2DSolver;
  }
  export type GnssNav = string;
  export type GsmList = GsmObj[];
  export interface GsmLocalId {
    /**
     * GSM base station identity code (BSIC).
     */
    Bsic: BSIC;
    /**
     * GSM broadcast control channel.
     */
    Bcch: BCCH;
  }
  export type GsmNmrList = GsmNmrObj[];
  export interface GsmNmrObj {
    /**
     * GSM base station identity code (BSIC).
     */
    Bsic: BSIC;
    /**
     * GSM broadcast control channel.
     */
    Bcch: BCCH;
    /**
     * Rx level, which is the received signal power, measured in dBm (decibel-milliwatts).
     */
    RxLevel?: RxLevel;
    /**
     * Global identity information of the GSM object.
     */
    GlobalIdentity?: GlobalIdentity;
  }
  export interface GsmObj {
    /**
     * Mobile Country Code.
     */
    Mcc: MCC;
    /**
     * Mobile Network Code.
     */
    Mnc: MNC;
    /**
     * Location area code.
     */
    Lac: LAC;
    /**
     * GERAN (GSM EDGE Radio Access Network) Cell Global Identifier.
     */
    GeranCid: GeranCid;
    /**
     * GSM local identification (local ID) information.
     */
    GsmLocalId?: GsmLocalId;
    /**
     * Timing advance value, which corresponds to the length of time a signal takes to reach the base station from a mobile phone.
     */
    GsmTimingAdvance?: GsmTimingAdvance;
    /**
     * Rx level, which is the received signal power, measured in dBm (decibel-milliwatts).
     */
    RxLevel?: RxLevel;
    /**
     * GSM object for network measurement reports.
     */
    GsmNmr?: GsmNmrList;
  }
  export type GsmTimingAdvance = number;
  export type HorizontalAccuracy = number;
  export type HrAllowed = boolean;
  export type IPAddress = string;
  export type ISODateTimeString = string;
  export type Identifier = string;
  export type IdentifierType = "PartnerAccountId"|"DevEui"|"GatewayEui"|"WirelessDeviceId"|"WirelessGatewayId"|string;
  export type ImportTaskArn = string;
  export type ImportTaskId = string;
  export type ImportTaskStatus = "INITIALIZING"|"INITIALIZED"|"PENDING"|"COMPLETE"|"FAILED"|"DELETING"|string;
  export interface ImportedSidewalkDevice {
    /**
     * The Sidewalk manufacturing serial number (SMSN) of the Sidewalk device.
     */
    SidewalkManufacturingSn?: SidewalkManufacturingSn;
    /**
     * The onboarding status of the Sidewalk device in the import task.
     */
    OnboardingStatus?: OnboardStatus;
    /**
     * The reason for the onboarding status information for the Sidewalk device.
     */
    OnboardingStatusReason?: OnboardStatusReason;
    /**
     * The time at which the status information was last updated.
     */
    LastUpdateTime?: LastUpdateTime;
  }
  export interface ImportedWirelessDevice {
    /**
     * The Sidewalk-related information about a device that has been added to an import task.
     */
    Sidewalk?: ImportedSidewalkDevice;
  }
  export type ImportedWirelessDeviceCount = number;
  export type ImportedWirelessDeviceList = ImportedWirelessDevice[];
  export type Integer = number;
  export type IotCertificateId = string;
  export interface Ip {
    /**
     * IP address information.
     */
    IpAddress: IPAddress;
  }
  export type JoinEui = string;
  export type JoinEuiFilters = JoinEuiRange[];
  export type JoinEuiRange = JoinEui[];
  export interface JoinEventConfiguration {
    /**
     * Join event configuration object for enabling or disabling LoRaWAN related event topics.
     */
    LoRaWAN?: LoRaWANJoinEventNotificationConfigurations;
    /**
     * Denotes whether the wireless device ID join event topic is enabled or disabled.
     */
    WirelessDeviceIdEventTopic?: EventNotificationTopicStatus;
  }
  export interface JoinResourceTypeEventConfiguration {
    /**
     * Join resource type event configuration object for enabling or disabling LoRaWAN related event topics.
     */
    LoRaWAN?: LoRaWANJoinResourceTypeEventConfiguration;
  }
  export type LAC = number;
  export type LastUpdateTime = Date;
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
    /**
     * A filter to list only device profiles that use this type, which can be LoRaWAN or Sidewalk.
     */
    DeviceProfileType?: DeviceProfileType;
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
  export interface ListDevicesForWirelessDeviceImportTaskRequest {
    /**
     * The identifier of the import task for which wireless devices are listed.
     */
    Id: ImportTaskId;
    MaxResults?: MaxResults;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    /**
     * The status of the devices in the import task.
     */
    Status?: OnboardStatus;
  }
  export interface ListDevicesForWirelessDeviceImportTaskResponse {
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    NextToken?: NextToken;
    /**
     * The name of the Sidewalk destination that describes the IoT rule to route messages received from devices in an import task that are onboarded to AWS IoT Wireless.
     */
    DestinationName?: DestinationName;
    /**
     * List of wireless devices in an import task and their onboarding status.
     */
    ImportedWirelessDeviceList?: ImportedWirelessDeviceList;
  }
  export interface ListEventConfigurationsRequest {
    /**
     * Resource type to filter event configurations.
     */
    ResourceType: EventNotificationResourceType;
    MaxResults?: MaxResults;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListEventConfigurationsResponse {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    /**
     * Event configurations of all events for a single resource.
     */
    EventConfigurationsList?: EventConfigurationsList;
  }
  export interface ListFuotaTasksRequest {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    MaxResults?: MaxResults;
  }
  export interface ListFuotaTasksResponse {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    FuotaTaskList?: FuotaTaskList;
  }
  export interface ListMulticastGroupsByFuotaTaskRequest {
    Id: FuotaTaskId;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    MaxResults?: MaxResults;
  }
  export interface ListMulticastGroupsByFuotaTaskResponse {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    MulticastGroupList?: MulticastGroupListByFuotaTask;
  }
  export interface ListMulticastGroupsRequest {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    MaxResults?: MaxResults;
  }
  export interface ListMulticastGroupsResponse {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    MulticastGroupList?: MulticastGroupList;
  }
  export interface ListNetworkAnalyzerConfigurationsRequest {
    MaxResults?: MaxResults;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListNetworkAnalyzerConfigurationsResponse {
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    NextToken?: NextToken;
    /**
     * The list of network analyzer configurations.
     */
    NetworkAnalyzerConfigurationList?: NetworkAnalyzerConfigurationList;
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
  export interface ListPositionConfigurationsRequest {
    /**
     * Resource type for which position configurations are listed.
     */
    ResourceType?: PositionResourceType;
    MaxResults?: MaxResults;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListPositionConfigurationsResponse {
    /**
     * A list of position configurations.
     */
    PositionConfigurationList?: PositionConfigurationList;
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    NextToken?: NextToken;
  }
  export interface ListQueuedMessagesRequest {
    /**
     * The ID of a given wireless device which the downlink message packets are being sent.
     */
    Id: WirelessDeviceId;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return in this operation.
     */
    MaxResults?: MaxResults;
    /**
     * The wireless device type, whic can be either Sidewalk or LoRaWAN.
     */
    WirelessDeviceType?: WirelessDeviceType;
  }
  export interface ListQueuedMessagesResponse {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
    /**
     * The messages in the downlink queue.
     */
    DownlinkQueueMessagesList?: DownlinkQueueMessagesList;
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
  export interface ListWirelessDeviceImportTasksRequest {
    MaxResults?: MaxResults;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListWirelessDeviceImportTasksResponse {
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    NextToken?: NextToken;
    /**
     * List of import tasks and summary information of onboarding status of devices in each import task.
     */
    WirelessDeviceImportTaskList?: WirelessDeviceImportTaskList;
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
    FuotaTaskId?: FuotaTaskId;
    MulticastGroupId?: MulticastGroupId;
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
  export interface LoRaWANConnectionStatusEventNotificationConfigurations {
    /**
     * Denotes whether the gateway EUI connection status event topic is enabled or disabled.
     */
    GatewayEuiEventTopic?: EventNotificationTopicStatus;
  }
  export interface LoRaWANConnectionStatusResourceTypeEventConfiguration {
    /**
     * Denotes whether the wireless gateway connection status event topic is enabled or disabled.
     */
    WirelessGatewayEventTopic?: EventNotificationTopicStatus;
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
    FPorts?: FPorts;
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
  export interface LoRaWANFuotaTask {
    RfRegion?: SupportedRfRegion;
  }
  export interface LoRaWANFuotaTaskGetInfo {
    RfRegion?: RfRegion;
    StartTime?: StartTime;
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
    /**
     * Beaconing object information, which consists of the data rate and frequency parameters.
     */
    Beaconing?: Beaconing;
    /**
     * The MaxEIRP value.
     */
    MaxEirp?: GatewayMaxEirp;
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
  export interface LoRaWANJoinEventNotificationConfigurations {
    /**
     * Denotes whether the Dev EUI join event topic is enabled or disabled.
     */
    DevEuiEventTopic?: EventNotificationTopicStatus;
  }
  export interface LoRaWANJoinResourceTypeEventConfiguration {
    /**
     * Denotes whether the wireless device join event topic is enabled or disabled.
     */
    WirelessDeviceEventTopic?: EventNotificationTopicStatus;
  }
  export interface LoRaWANListDevice {
    /**
     * The DevEUI value.
     */
    DevEui?: DevEui;
  }
  export interface LoRaWANMulticast {
    RfRegion?: SupportedRfRegion;
    DlClass?: DlClass;
  }
  export interface LoRaWANMulticastGet {
    RfRegion?: SupportedRfRegion;
    DlClass?: DlClass;
    NumberOfDevicesRequested?: NumberOfDevicesRequested;
    NumberOfDevicesInGroup?: NumberOfDevicesInGroup;
  }
  export interface LoRaWANMulticastMetadata {
    FPort?: FPort;
  }
  export interface LoRaWANMulticastSession {
    DlDr?: DlDr;
    DlFreq?: DlFreq;
    SessionStartTime?: SessionStartTimeTimestamp;
    SessionTimeout?: SessionTimeout;
    /**
     * The PingSlotPeriod value.
     */
    PingSlotPeriod?: PingSlotPeriod;
  }
  export interface LoRaWANSendDataToDevice {
    FPort?: FPort;
    /**
     * Choose the gateways that you want to use for the downlink data traffic when the wireless device is running in class B or class C mode.
     */
    ParticipatingGateways?: ParticipatingGateways;
  }
  export interface LoRaWANServiceProfile {
    /**
     * The AddGWMetaData value.
     */
    AddGwMetadata?: AddGwMetadata;
    /**
     * The DrMin value.
     */
    DrMin?: DrMinBox;
    /**
     * The DrMax value.
     */
    DrMax?: DrMaxBox;
    /**
     * The PRAllowed value that describes whether passive roaming is allowed.
     */
    PrAllowed?: PrAllowed;
    /**
     * The RAAllowed value that describes whether roaming activation is allowed.
     */
    RaAllowed?: RaAllowed;
  }
  export interface LoRaWANStartFuotaTask {
    StartTime?: StartTime;
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
    /**
     * ABP device object for update APIs for v1.1
     */
    AbpV1_1?: UpdateAbpV1_1;
    /**
     * ABP device object for update APIs for v1.0.x
     */
    AbpV1_0_x?: UpdateAbpV1_0_x;
    /**
     * FPorts object for the positioning information of the device.
     */
    FPorts?: UpdateFPorts;
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
  export type LteList = LteObj[];
  export interface LteLocalId {
    /**
     * Physical cell ID.
     */
    Pci: PCI;
    /**
     * Evolved universal terrestrial radio access (E-UTRA) absolute radio frequency channel number (FCN).
     */
    Earfcn: EARFCN;
  }
  export type LteNmrList = LteNmrObj[];
  export interface LteNmrObj {
    /**
     * Physical cell ID.
     */
    Pci: PCI;
    /**
     * E-UTRA (Evolved universal terrestrial Radio Access) absolute radio frequency channel Number (EARFCN).
     */
    Earfcn: EARFCN;
    /**
     * E-UTRAN (Evolved Universal Terrestrial Radio Access Network) cell global identifier (EUTRANCID).
     */
    EutranCid: EutranCid;
    /**
     * Signal power of the reference signal received, measured in dBm (decibel-milliwatts).
     */
    Rsrp?: RSRP;
    /**
     * Signal quality of the reference Signal received, measured in decibels (dB).
     */
    Rsrq?: RSRQ;
  }
  export interface LteObj {
    /**
     * Mobile Country Code.
     */
    Mcc: MCC;
    /**
     * Mobile Network Code.
     */
    Mnc: MNC;
    /**
     * E-UTRAN (Evolved Universal Terrestrial Radio Access Network) Cell Global Identifier.
     */
    EutranCid: EutranCid;
    /**
     * LTE tracking area code.
     */
    Tac?: TAC;
    /**
     * LTE local identification (local ID) information.
     */
    LteLocalId?: LteLocalId;
    /**
     * LTE timing advance.
     */
    LteTimingAdvance?: LteTimingAdvance;
    /**
     * Signal power of the reference signal received, measured in dBm (decibel-milliwatts).
     */
    Rsrp?: RSRP;
    /**
     * Signal quality of the reference Signal received, measured in decibels (dB).
     */
    Rsrq?: RSRQ;
    /**
     * Parameter that determines whether the LTE object is capable of supporting NR (new radio).
     */
    NrCapable?: NRCapable;
    /**
     * LTE object for network measurement reports.
     */
    LteNmr?: LteNmrList;
  }
  export type LteTimingAdvance = number;
  export type MCC = number;
  export type MNC = number;
  export type MacAddress = string;
  export type MacVersion = string;
  export type MaxAllowedSignature = number;
  export type MaxDutyCycle = number;
  export type MaxEirp = number;
  export type MaxResults = number;
  export type McGroupId = number;
  export interface MessageDeliveryStatusEventConfiguration {
    Sidewalk?: SidewalkEventNotificationConfigurations;
    /**
     * Denotes whether the wireless device ID message delivery status event topic is enabled or disabled.
     */
    WirelessDeviceIdEventTopic?: EventNotificationTopicStatus;
  }
  export interface MessageDeliveryStatusResourceTypeEventConfiguration {
    Sidewalk?: SidewalkResourceTypeEventConfiguration;
  }
  export type MessageId = string;
  export type MessageType = "CUSTOM_COMMAND_ID_NOTIFY"|"CUSTOM_COMMAND_ID_GET"|"CUSTOM_COMMAND_ID_SET"|"CUSTOM_COMMAND_ID_RESP"|string;
  export type MinGwDiversity = number;
  export type Model = string;
  export type MulticastDeviceStatus = string;
  export type MulticastFrameInfo = "ENABLED"|"DISABLED"|string;
  export interface MulticastGroup {
    Id?: MulticastGroupId;
    Arn?: MulticastGroupArn;
    Name?: MulticastGroupName;
  }
  export type MulticastGroupArn = string;
  export interface MulticastGroupByFuotaTask {
    Id?: MulticastGroupId;
  }
  export type MulticastGroupId = string;
  export type MulticastGroupList = MulticastGroup[];
  export type MulticastGroupListByFuotaTask = MulticastGroupByFuotaTask[];
  export type MulticastGroupMessageId = string;
  export type MulticastGroupName = string;
  export type MulticastGroupStatus = string;
  export interface MulticastWirelessMetadata {
    LoRaWAN?: LoRaWANMulticastMetadata;
  }
  export type NRCapable = boolean;
  export type NetId = string;
  export type NetIdFilters = NetId[];
  export type NetworkAnalyzerConfigurationArn = string;
  export type NetworkAnalyzerConfigurationList = NetworkAnalyzerConfigurations[];
  export type NetworkAnalyzerConfigurationName = string;
  export interface NetworkAnalyzerConfigurations {
    /**
     * The Amazon Resource Name of the new resource.
     */
    Arn?: NetworkAnalyzerConfigurationArn;
    Name?: NetworkAnalyzerConfigurationName;
  }
  export type NetworkAnalyzerMulticastGroupList = MulticastGroupId[];
  export type NetworkId = number;
  export type NextToken = string;
  export type NumberOfDevicesInGroup = number;
  export type NumberOfDevicesRequested = number;
  export type NwkGeoLoc = boolean;
  export type NwkKey = string;
  export type NwkSEncKey = string;
  export type NwkSKey = string;
  export type OnboardStatus = "INITIALIZED"|"PENDING"|"ONBOARDED"|"FAILED"|string;
  export type OnboardStatusReason = string;
  export interface OtaaV1_0_x {
    /**
     * The AppKey value.
     */
    AppKey?: AppKey;
    /**
     * The AppEUI value.
     */
    AppEui?: AppEui;
    /**
     * The GenAppKey value.
     */
    GenAppKey?: GenAppKey;
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
  export type PCI = number;
  export type PSC = number;
  export type PackageVersion = string;
  export interface ParticipatingGateways {
    /**
     * Indicates whether to send the downlink message in sequential mode or concurrent mode, or to use only the chosen gateways from the previous uplink message transmission.
     */
    DownlinkMode: DownlinkMode;
    /**
     * The list of gateways that you want to use for sending the downlink data traffic.
     */
    GatewayList: GatewayList;
    /**
     * The duration of time for which AWS IoT Core for LoRaWAN will wait before transmitting the payload to the next gateway.
     */
    TransmissionInterval: TransmissionInterval;
  }
  export type PartnerAccountArn = string;
  export type PartnerAccountId = string;
  export type PartnerType = "Sidewalk"|string;
  export type PathLoss = number;
  export type PayloadData = string;
  export type PilotPower = number;
  export type PingSlotDr = number;
  export type PingSlotFreq = number;
  export type PingSlotPeriod = number;
  export type PnOffset = number;
  export type PositionConfigurationFec = "ROSE"|"NONE"|string;
  export interface PositionConfigurationItem {
    /**
     * Resource identifier for the position configuration.
     */
    ResourceIdentifier?: PositionResourceIdentifier;
    /**
     * Resource type of the resource for the position configuration.
     */
    ResourceType?: PositionResourceType;
    /**
     * The details of the positioning solver object used to compute the location.
     */
    Solvers?: PositionSolverDetails;
    /**
     * The position data destination that describes the AWS IoT rule that processes the device's position data for use by AWS IoT Core for LoRaWAN.
     */
    Destination?: DestinationName;
  }
  export type PositionConfigurationList = PositionConfigurationItem[];
  export type PositionConfigurationStatus = "Enabled"|"Disabled"|string;
  export type PositionCoordinate = PositionCoordinateValue[];
  export type PositionCoordinateValue = number;
  export type PositionResourceIdentifier = string;
  export type PositionResourceType = "WirelessDevice"|"WirelessGateway"|string;
  export interface PositionSolverConfigurations {
    /**
     * The Semtech GNSS solver configuration object.
     */
    SemtechGnss?: SemtechGnssConfiguration;
  }
  export interface PositionSolverDetails {
    /**
     * The Semtech GNSS solver object details.
     */
    SemtechGnss?: SemtechGnssDetail;
  }
  export type PositionSolverProvider = "Semtech"|string;
  export type PositionSolverType = "GNSS"|string;
  export type PositionSolverVersion = string;
  export interface Positioning {
    ClockSync?: FPort;
    Stream?: FPort;
    Gnss?: FPort;
  }
  export type PositioningConfigStatus = "Enabled"|"Disabled"|string;
  export type PrAllowed = boolean;
  export type PresetFreq = number;
  export type PrivateKeysList = CertificateList[];
  export interface ProximityEventConfiguration {
    /**
     * Proximity event configuration object for enabling or disabling Sidewalk related event topics.
     */
    Sidewalk?: SidewalkEventNotificationConfigurations;
    /**
     * Denotes whether the wireless device ID proximity event topic is enabled or disabled.
     */
    WirelessDeviceIdEventTopic?: EventNotificationTopicStatus;
  }
  export interface ProximityResourceTypeEventConfiguration {
    /**
     * Proximity resource type event configuration object for enabling and disabling wireless device topic.
     */
    Sidewalk?: SidewalkResourceTypeEventConfiguration;
  }
  export interface PutPositionConfigurationRequest {
    /**
     * Resource identifier used to update the position configuration.
     */
    ResourceIdentifier: PositionResourceIdentifier;
    /**
     * Resource type of the resource for which you want to update the position configuration.
     */
    ResourceType: PositionResourceType;
    /**
     * The positioning solvers used to update the position configuration of the resource.
     */
    Solvers?: PositionSolverConfigurations;
    /**
     * The position data destination that describes the AWS IoT rule that processes the device's position data for use by AWS IoT Core for LoRaWAN.
     */
    Destination?: DestinationName;
  }
  export interface PutPositionConfigurationResponse {
  }
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
  export type QualificationStatus = boolean;
  export type QueryString = string;
  export type RSCP = number;
  export type RSRP = number;
  export type RSRQ = number;
  export type RSS = number;
  export type RaAllowed = boolean;
  export type RedundancyPercent = number;
  export type RegParamsRevision = string;
  export type RegistrationZone = number;
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
  export type Role = string;
  export type RoleArn = string;
  export type RxDataRate2 = number;
  export type RxDelay1 = number;
  export type RxDrOffset1 = number;
  export type RxFreq2 = number;
  export type RxLevel = number;
  export type SNwkSIntKey = string;
  export interface SemtechGnssConfiguration {
    /**
     * The status indicating whether the solver is enabled.
     */
    Status: PositionConfigurationStatus;
    /**
     * Whether forward error correction is enabled.
     */
    Fec: PositionConfigurationFec;
  }
  export interface SemtechGnssDetail {
    /**
     * The vendor of the solver object.
     */
    Provider?: PositionSolverProvider;
    /**
     * The type of positioning solver used.
     */
    Type?: PositionSolverType;
    /**
     * The status indicating whether the solver is enabled.
     */
    Status?: PositionConfigurationStatus;
    /**
     * Whether forward error correction is enabled.
     */
    Fec?: PositionConfigurationFec;
  }
  export interface SendDataToMulticastGroupRequest {
    Id: MulticastGroupId;
    PayloadData: PayloadData;
    WirelessMetadata: MulticastWirelessMetadata;
  }
  export interface SendDataToMulticastGroupResponse {
    MessageId?: MulticastGroupMessageId;
  }
  export interface SendDataToWirelessDeviceRequest {
    /**
     * The ID of the wireless device to receive the data.
     */
    Id: WirelessDeviceId;
    /**
     * The transmit mode to use to send data to the wireless device. Can be: 0 for UM (unacknowledge mode) or 1 for AM (acknowledge mode).
     */
    TransmitMode: TransmitMode;
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
  export type SessionStartTimeTimestamp = Date;
  export type SessionTimeout = number;
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
  export interface SidewalkCreateDeviceProfile {
  }
  export interface SidewalkCreateWirelessDevice {
    /**
     * The ID of the Sidewalk device profile.
     */
    DeviceProfileId?: DeviceProfileId;
  }
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
    /**
     * The Sidewalk device private keys that will be used for onboarding the device.
     */
    PrivateKeys?: PrivateKeysList;
    /**
     * The ID of the Sidewalk device profile.
     */
    DeviceProfileId?: DeviceProfileId;
    /**
     * The ID of the Sidewalk device profile.
     */
    CertificateId?: DakCertificateId;
    /**
     * The Sidewalk device status, such as provisioned or registered.
     */
    Status?: WirelessDeviceSidewalkStatus;
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
  export interface SidewalkEventNotificationConfigurations {
    /**
     * Denotes whether the Amazon ID event topic is enabled or disabled.
     */
    AmazonIdEventTopic?: EventNotificationTopicStatus;
  }
  export interface SidewalkGetDeviceProfile {
    /**
     * The Sidewalk application server public key.
     */
    ApplicationServerPublicKey?: ApplicationServerPublicKey;
    /**
     * Gets information about the certification status of a Sidewalk device profile.
     */
    QualificationStatus?: QualificationStatus;
    /**
     * The DAK certificate information of the Sidewalk device profile.
     */
    DakCertificateMetadata?: DakCertificateMetadataList;
  }
  export interface SidewalkGetStartImportInfo {
    /**
     * List of Sidewalk devices that are added to the import task.
     */
    DeviceCreationFileList?: DeviceCreationFileList;
    /**
     * The IAM role that allows AWS IoT Wireless to access the CSV file in the S3 bucket.
     */
    Role?: Role;
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
    /**
     * Sidewalk object used by list functions.
     */
    DeviceProfileId?: DeviceProfileId;
    /**
     * The status of the Sidewalk devices, such as provisioned or registered.
     */
    Status?: WirelessDeviceSidewalkStatus;
  }
  export type SidewalkManufacturingSn = string;
  export interface SidewalkResourceTypeEventConfiguration {
    /**
     * Denotes whether the wireless device join event topic is enabled or disabled.
     */
    WirelessDeviceEventTopic?: EventNotificationTopicStatus;
  }
  export interface SidewalkSendDataToDevice {
    /**
     * The sequence number.
     */
    Seq?: Seq;
    MessageType?: MessageType;
    /**
     * The duration of time in seconds to retry sending the ACK.
     */
    AckModeRetryDurationSecs?: AckModeRetryDurationSecs;
  }
  export interface SidewalkSingleStartImportInfo {
    /**
     * The Sidewalk manufacturing serial number (SMSN) of the device added to the import task.
     */
    SidewalkManufacturingSn?: SidewalkManufacturingSn;
  }
  export interface SidewalkStartImportInfo {
    /**
     * The CSV file contained in an S3 bucket that's used for adding devices to an import task.
     */
    DeviceCreationFile?: DeviceCreationFile;
    /**
     * The IAM role that allows AWS IoT Wireless to access the CSV file in the S3 bucket.
     */
    Role?: Role;
  }
  export interface SidewalkUpdateAccount {
    /**
     * The new Sidewalk application server private key.
     */
    AppServerPrivateKey?: AppServerPrivateKey;
  }
  export interface SidewalkUpdateImportInfo {
    /**
     * The CSV file contained in an S3 bucket that's used for appending devices to an existing import task.
     */
    DeviceCreationFile?: DeviceCreationFile;
  }
  export type SigningAlg = "Ed25519"|"P256r1"|string;
  export interface StartBulkAssociateWirelessDeviceWithMulticastGroupRequest {
    Id: MulticastGroupId;
    QueryString?: QueryString;
    Tags?: TagList;
  }
  export interface StartBulkAssociateWirelessDeviceWithMulticastGroupResponse {
  }
  export interface StartBulkDisassociateWirelessDeviceFromMulticastGroupRequest {
    Id: MulticastGroupId;
    QueryString?: QueryString;
    Tags?: TagList;
  }
  export interface StartBulkDisassociateWirelessDeviceFromMulticastGroupResponse {
  }
  export interface StartFuotaTaskRequest {
    Id: FuotaTaskId;
    LoRaWAN?: LoRaWANStartFuotaTask;
  }
  export interface StartFuotaTaskResponse {
  }
  export interface StartMulticastGroupSessionRequest {
    Id: MulticastGroupId;
    LoRaWAN: LoRaWANMulticastSession;
  }
  export interface StartMulticastGroupSessionResponse {
  }
  export interface StartSingleWirelessDeviceImportTaskRequest {
    /**
     * The name of the Sidewalk destination that describes the IoT rule to route messages from the device in the import task that will be onboarded to AWS IoT Wireless.
     */
    DestinationName: DestinationName;
    ClientRequestToken?: ClientRequestToken;
    /**
     * The name of the wireless device for which an import task is being started.
     */
    DeviceName?: DeviceName;
    Tags?: TagList;
    /**
     * The Sidewalk-related parameters for importing a single wireless device.
     */
    Sidewalk: SidewalkSingleStartImportInfo;
  }
  export interface StartSingleWirelessDeviceImportTaskResponse {
    /**
     * The import task ID.
     */
    Id?: ImportTaskId;
    /**
     * The ARN (Amazon Resource Name) of the import task.
     */
    Arn?: ImportTaskArn;
  }
  export type StartTime = Date;
  export interface StartWirelessDeviceImportTaskRequest {
    /**
     * The name of the Sidewalk destination that describes the IoT rule to route messages from the devices in the import task that are onboarded to AWS IoT Wireless.
     */
    DestinationName: DestinationName;
    ClientRequestToken?: ClientRequestToken;
    Tags?: TagList;
    /**
     * The Sidewalk-related parameters for importing wireless devices that need to be provisioned in bulk.
     */
    Sidewalk: SidewalkStartImportInfo;
  }
  export interface StartWirelessDeviceImportTaskResponse {
    /**
     * The import task ID.
     */
    Id?: ImportTaskId;
    /**
     * The ARN (Amazon Resource Name) of the import task.
     */
    Arn?: ImportTaskArn;
  }
  export type Station = string;
  export type StatusReason = string;
  export type SubBand = number;
  export type SubBands = SubBand[];
  export type SupportedRfRegion = "EU868"|"US915"|"AU915"|"AS923-1"|"AS923-2"|"AS923-3"|"AS923-4"|"EU433"|"CN470"|"CN779"|"RU864"|"KR920"|"IN865"|string;
  export type Supports32BitFCnt = boolean;
  export type SupportsClassB = boolean;
  export type SupportsClassC = boolean;
  export type SupportsJoin = boolean;
  export type SystemId = number;
  export type TAC = number;
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
  export type TdscdmaList = TdscdmaObj[];
  export interface TdscdmaLocalId {
    /**
     * TD-SCDMA UTRA (Universal Terrestrial Radio Access Network) absolute RF channel number (UARFCN).
     */
    Uarfcn: UARFCN;
    /**
     * Cell parameters for TD-SCDMA.
     */
    CellParams: CellParams;
  }
  export type TdscdmaNmrList = TdscdmaNmrObj[];
  export interface TdscdmaNmrObj {
    /**
     * TD-SCDMA UTRA (Universal Terrestrial Radio Access Network) absolute RF channel number.
     */
    Uarfcn: UARFCN;
    /**
     * Cell parameters for TD-SCDMA network measurement reports object.
     */
    CellParams: CellParams;
    /**
     * UTRAN (UMTS Terrestrial Radio Access Network) cell global identifier.
     */
    UtranCid?: UtranCid;
    /**
     * Code power of the received signal, measured in decibel-milliwatts (dBm).
     */
    Rscp?: RSCP;
    /**
     * Path loss, or path attenuation, is the reduction in power density of an electromagnetic wave as it propagates through space.
     */
    PathLoss?: PathLoss;
  }
  export interface TdscdmaObj {
    /**
     * Mobile Country Code.
     */
    Mcc: MCC;
    /**
     * Mobile Network Code.
     */
    Mnc: MNC;
    /**
     * Location Area Code.
     */
    Lac?: LAC;
    /**
     * UTRAN (UMTS Terrestrial Radio Access Network) Cell Global Identifier.
     */
    UtranCid: UtranCid;
    /**
     * TD-SCDMA local identification (local ID) information.
     */
    TdscdmaLocalId?: TdscdmaLocalId;
    /**
     * TD-SCDMA Timing advance.
     */
    TdscdmaTimingAdvance?: TdscdmaTimingAdvance;
    /**
     * Signal power of the received signal (Received Signal Code Power), measured in decibel-milliwatts (dBm).
     */
    Rscp?: RSCP;
    /**
     * Path loss, or path attenuation, is the reduction in power density of an electromagnetic wave as it propagates through space.
     */
    PathLoss?: PathLoss;
    /**
     * TD-SCDMA object for network measurement reports.
     */
    TdscdmaNmr?: TdscdmaNmrList;
  }
  export type TdscdmaTimingAdvance = number;
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
  export interface TraceContent {
    WirelessDeviceFrameInfo?: WirelessDeviceFrameInfo;
    LogLevel?: LogLevel;
    MulticastFrameInfo?: MulticastFrameInfo;
  }
  export type TransmissionInterval = number;
  export type TransmitMode = number;
  export type UARFCN = number;
  export type UARFCNDL = number;
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
  export interface UpdateAbpV1_0_x {
    /**
     * The FCnt init value.
     */
    FCntStart?: FCntStart;
  }
  export interface UpdateAbpV1_1 {
    /**
     * The FCnt init value.
     */
    FCntStart?: FCntStart;
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
  export interface UpdateEventConfigurationByResourceTypesRequest {
    /**
     * Device registration state resource type event configuration object for enabling and disabling wireless gateway topic.
     */
    DeviceRegistrationState?: DeviceRegistrationStateResourceTypeEventConfiguration;
    /**
     * Proximity resource type event configuration object for enabling and disabling wireless gateway topic.
     */
    Proximity?: ProximityResourceTypeEventConfiguration;
    /**
     * Join resource type event configuration object for enabling and disabling wireless device topic.
     */
    Join?: JoinResourceTypeEventConfiguration;
    /**
     * Connection status resource type event configuration object for enabling and disabling wireless gateway topic.
     */
    ConnectionStatus?: ConnectionStatusResourceTypeEventConfiguration;
    /**
     * Message delivery status resource type event configuration object for enabling and disabling wireless device topic.
     */
    MessageDeliveryStatus?: MessageDeliveryStatusResourceTypeEventConfiguration;
  }
  export interface UpdateEventConfigurationByResourceTypesResponse {
  }
  export interface UpdateFPorts {
    /**
     * Positioning FPorts for the ClockSync, Stream, and GNSS functions.
     */
    Positioning?: Positioning;
    /**
     * LoRaWAN application, which can be used for geolocation by activating positioning.
     */
    Applications?: Applications;
  }
  export interface UpdateFuotaTaskRequest {
    Id: FuotaTaskId;
    Name?: FuotaTaskName;
    Description?: Description;
    LoRaWAN?: LoRaWANFuotaTask;
    FirmwareUpdateImage?: FirmwareUpdateImage;
    FirmwareUpdateRole?: FirmwareUpdateRole;
    RedundancyPercent?: RedundancyPercent;
    FragmentSizeBytes?: FragmentSizeBytes;
    FragmentIntervalMS?: FragmentIntervalMS;
  }
  export interface UpdateFuotaTaskResponse {
  }
  export interface UpdateLogLevelsByResourceTypesRequest {
    DefaultLogLevel?: LogLevel;
    WirelessDeviceLogOptions?: WirelessDeviceLogOptionList;
    WirelessGatewayLogOptions?: WirelessGatewayLogOptionList;
  }
  export interface UpdateLogLevelsByResourceTypesResponse {
  }
  export interface UpdateMulticastGroupRequest {
    Id: MulticastGroupId;
    Name?: MulticastGroupName;
    Description?: Description;
    LoRaWAN?: LoRaWANMulticast;
  }
  export interface UpdateMulticastGroupResponse {
  }
  export interface UpdateNetworkAnalyzerConfigurationRequest {
    ConfigurationName: NetworkAnalyzerConfigurationName;
    TraceContent?: TraceContent;
    /**
     * Wireless device resources to add to the network analyzer configuration. Provide the WirelessDeviceId of the resource to add in the input array.
     */
    WirelessDevicesToAdd?: WirelessDeviceList;
    /**
     * Wireless device resources to remove from the network analyzer configuration. Provide the WirelessDeviceId of the resources to remove in the input array.
     */
    WirelessDevicesToRemove?: WirelessDeviceList;
    /**
     * Wireless gateway resources to add to the network analyzer configuration. Provide the WirelessGatewayId of the resource to add in the input array.
     */
    WirelessGatewaysToAdd?: WirelessGatewayList;
    /**
     * Wireless gateway resources to remove from the network analyzer configuration. Provide the WirelessGatewayId of the resources to remove in the input array.
     */
    WirelessGatewaysToRemove?: WirelessGatewayList;
    Description?: Description;
    /**
     * Multicast group resources to add to the network analyzer configuration. Provide the MulticastGroupId of the resource to add in the input array.
     */
    MulticastGroupsToAdd?: NetworkAnalyzerMulticastGroupList;
    /**
     * Multicast group resources to remove from the network analyzer configuration. Provide the MulticastGroupId of the resource to remove in the input array.
     */
    MulticastGroupsToRemove?: NetworkAnalyzerMulticastGroupList;
  }
  export interface UpdateNetworkAnalyzerConfigurationResponse {
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
  export interface UpdatePositionRequest {
    /**
     * Resource identifier of the resource for which position is updated.
     */
    ResourceIdentifier: PositionResourceIdentifier;
    /**
     * Resource type of the resource for which position is updated.
     */
    ResourceType: PositionResourceType;
    /**
     * The position information of the resource.
     */
    Position: PositionCoordinate;
  }
  export interface UpdatePositionResponse {
  }
  export interface UpdateResourceEventConfigurationRequest {
    /**
     * Resource identifier to opt in for event messaging.
     */
    Identifier: Identifier;
    /**
     * Identifier type of the particular resource identifier for event configuration.
     */
    IdentifierType: IdentifierType;
    /**
     * Partner type of the resource if the identifier type is PartnerAccountId 
     */
    PartnerType?: EventNotificationPartnerType;
    /**
     * Event configuration for the device registration state event.
     */
    DeviceRegistrationState?: DeviceRegistrationStateEventConfiguration;
    /**
     * Event configuration for the proximity event.
     */
    Proximity?: ProximityEventConfiguration;
    /**
     * Event configuration for the join event.
     */
    Join?: JoinEventConfiguration;
    /**
     * Event configuration for the connection status event.
     */
    ConnectionStatus?: ConnectionStatusEventConfiguration;
    /**
     * Event configuration for the message delivery status event.
     */
    MessageDeliveryStatus?: MessageDeliveryStatusEventConfiguration;
  }
  export interface UpdateResourceEventConfigurationResponse {
  }
  export interface UpdateResourcePositionRequest {
    /**
     * The identifier of the resource for which position information is updated. It can be the wireless device ID or the wireless gateway ID, depending on the resource type.
     */
    ResourceIdentifier: PositionResourceIdentifier;
    /**
     * The type of resource for which position information is updated, which can be a wireless device or a wireless gateway.
     */
    ResourceType: PositionResourceType;
    /**
     * The position information of the resource, displayed as a JSON payload. The payload uses the GeoJSON format, which a format that's used to encode geographic data structures. For more information, see GeoJSON.
     */
    GeoJsonPayload?: GeoJsonPayload;
  }
  export interface UpdateResourcePositionResponse {
  }
  export type UpdateSignature = string;
  export interface UpdateWirelessDeviceImportTaskRequest {
    /**
     * The identifier of the import task to be updated.
     */
    Id: ImportTaskId;
    /**
     * The Sidewalk-related parameters of the import task to be updated.
     */
    Sidewalk: SidewalkUpdateImportInfo;
  }
  export interface UpdateWirelessDeviceImportTaskResponse {
  }
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
    /**
     * FPort values for the GNSS, stream, and ClockSync functions of the positioning information.
     */
    Positioning?: PositioningConfigStatus;
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
    /**
     * The MaxEIRP value.
     */
    MaxEirp?: GatewayMaxEirp;
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
  export type Use2DSolver = boolean;
  export type UtranCid = number;
  export type VerticalAccuracy = number;
  export type WcdmaList = WcdmaObj[];
  export interface WcdmaLocalId {
    /**
     * WCDMA UTRA Absolute RF Channel Number downlink.
     */
    Uarfcndl: UARFCNDL;
    /**
     * Primary Scrambling Code.
     */
    Psc: PSC;
  }
  export type WcdmaNmrList = WcdmaNmrObj[];
  export interface WcdmaNmrObj {
    /**
     * WCDMA UTRA Absolute RF Channel Number downlink.
     */
    Uarfcndl: UARFCNDL;
    /**
     * Primary Scrambling Code.
     */
    Psc: PSC;
    /**
     * UTRAN (UMTS Terrestrial Radio Access Network) Cell Global Identifier.
     */
    UtranCid: UtranCid;
    /**
     * Received Signal Code Power (signal power) (dBm)
     */
    Rscp?: RSCP;
    /**
     * Path loss, or path attenuation, is the reduction in power density of an electromagnetic wave as it propagates through space.
     */
    PathLoss?: PathLoss;
  }
  export interface WcdmaObj {
    /**
     * Mobile Country Code.
     */
    Mcc: MCC;
    /**
     * Mobile Network Code.
     */
    Mnc: MNC;
    /**
     * Location Area Code.
     */
    Lac?: LAC;
    /**
     * UTRAN (UMTS Terrestrial Radio Access Network) Cell Global Identifier.
     */
    UtranCid: UtranCid;
    /**
     * WCDMA local ID information.
     */
    WcdmaLocalId?: WcdmaLocalId;
    /**
     * Received Signal Code Power (signal power) (dBm).
     */
    Rscp?: RSCP;
    /**
     * Path loss, or path attenuation, is the reduction in power density of an electromagnetic wave as it propagates through space.
     */
    PathLoss?: PathLoss;
    /**
     * WCDMA object for network measurement reports.
     */
    WcdmaNmr?: WcdmaNmrList;
  }
  export interface WiFiAccessPoint {
    /**
     * Wi-Fi MAC Address.
     */
    MacAddress: MacAddress;
    /**
     * Received signal strength (dBm) of the WLAN measurement data.
     */
    Rss: RSS;
  }
  export type WiFiAccessPoints = WiFiAccessPoint[];
  export type WirelessDeviceArn = string;
  export type WirelessDeviceEvent = "Join"|"Rejoin"|"Uplink_Data"|"Downlink_Data"|"Registration"|string;
  export interface WirelessDeviceEventLogOption {
    Event: WirelessDeviceEvent;
    LogLevel: LogLevel;
  }
  export type WirelessDeviceEventLogOptionList = WirelessDeviceEventLogOption[];
  export type WirelessDeviceFrameInfo = "ENABLED"|"DISABLED"|string;
  export type WirelessDeviceId = string;
  export type WirelessDeviceIdType = "WirelessDeviceId"|"DevEui"|"ThingName"|"SidewalkManufacturingSn"|string;
  export interface WirelessDeviceImportTask {
    /**
     * The ID of the wireless device import task.
     */
    Id?: ImportTaskId;
    /**
     * The ARN (Amazon Resource Name) of the wireless device import task.
     */
    Arn?: ImportTaskArn;
    /**
     * The name of the Sidewalk destination that that describes the IoT rule to route messages from the device in the import task that will be onboarded to AWS IoT Wireless
     */
    DestinationName?: DestinationName;
    /**
     * The Sidewalk-related information of the wireless device import task.
     */
    Sidewalk?: SidewalkGetStartImportInfo;
    /**
     * The time at which the import task was created.
     */
    CreationTime?: CreationTime;
    /**
     * The status information of the wireless device import task.
     */
    Status?: ImportTaskStatus;
    /**
     * The reason that provides additional information about the import task status.
     */
    StatusReason?: StatusReason;
    /**
     * The summary information of count of wireless devices that are waiting for the control log to be added to an import task.
     */
    InitializedImportedDeviceCount?: ImportedWirelessDeviceCount;
    /**
     * The summary information of count of wireless devices in an import task that are waiting in the queue to be onboarded.
     */
    PendingImportedDeviceCount?: ImportedWirelessDeviceCount;
    /**
     * The summary information of count of wireless devices in an import task that have been onboarded to the import task.
     */
    OnboardedImportedDeviceCount?: ImportedWirelessDeviceCount;
    /**
     * The summary information of count of wireless devices in an import task that failed to onboarded to the import task.
     */
    FailedImportedDeviceCount?: ImportedWirelessDeviceCount;
  }
  export type WirelessDeviceImportTaskList = WirelessDeviceImportTask[];
  export type WirelessDeviceList = WirelessDeviceId[];
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
  export type WirelessDeviceSidewalkStatus = "PROVISIONED"|"REGISTERED"|"ACTIVATED"|"UNKNOWN"|string;
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
     * The date and time when the most recent uplink was received.  Theis value is only valid for 3 months. 
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
    FuotaDeviceStatus?: FuotaDeviceStatus;
    /**
     * The status of the wireless device in the multicast group.
     */
    MulticastDeviceStatus?: MulticastDeviceStatus;
    McGroupId?: McGroupId;
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
  export type WirelessGatewayList = WirelessGatewayId[];
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
     * The date and time when the most recent uplink was received.  This value is only valid for 3 months. 
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
