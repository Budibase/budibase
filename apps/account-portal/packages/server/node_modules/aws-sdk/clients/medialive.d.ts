import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Readable} from 'stream';
interface Blob {}
declare class MediaLive extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MediaLive.Types.ClientConfiguration)
  config: Config & MediaLive.Types.ClientConfiguration;
  /**
   * Accept an incoming input device transfer. The ownership of the device will transfer to your AWS account.
   */
  acceptInputDeviceTransfer(params: MediaLive.Types.AcceptInputDeviceTransferRequest, callback?: (err: AWSError, data: MediaLive.Types.AcceptInputDeviceTransferResponse) => void): Request<MediaLive.Types.AcceptInputDeviceTransferResponse, AWSError>;
  /**
   * Accept an incoming input device transfer. The ownership of the device will transfer to your AWS account.
   */
  acceptInputDeviceTransfer(callback?: (err: AWSError, data: MediaLive.Types.AcceptInputDeviceTransferResponse) => void): Request<MediaLive.Types.AcceptInputDeviceTransferResponse, AWSError>;
  /**
   * Starts delete of resources.
   */
  batchDelete(params: MediaLive.Types.BatchDeleteRequest, callback?: (err: AWSError, data: MediaLive.Types.BatchDeleteResponse) => void): Request<MediaLive.Types.BatchDeleteResponse, AWSError>;
  /**
   * Starts delete of resources.
   */
  batchDelete(callback?: (err: AWSError, data: MediaLive.Types.BatchDeleteResponse) => void): Request<MediaLive.Types.BatchDeleteResponse, AWSError>;
  /**
   * Starts existing resources
   */
  batchStart(params: MediaLive.Types.BatchStartRequest, callback?: (err: AWSError, data: MediaLive.Types.BatchStartResponse) => void): Request<MediaLive.Types.BatchStartResponse, AWSError>;
  /**
   * Starts existing resources
   */
  batchStart(callback?: (err: AWSError, data: MediaLive.Types.BatchStartResponse) => void): Request<MediaLive.Types.BatchStartResponse, AWSError>;
  /**
   * Stops running resources
   */
  batchStop(params: MediaLive.Types.BatchStopRequest, callback?: (err: AWSError, data: MediaLive.Types.BatchStopResponse) => void): Request<MediaLive.Types.BatchStopResponse, AWSError>;
  /**
   * Stops running resources
   */
  batchStop(callback?: (err: AWSError, data: MediaLive.Types.BatchStopResponse) => void): Request<MediaLive.Types.BatchStopResponse, AWSError>;
  /**
   * Update a channel schedule
   */
  batchUpdateSchedule(params: MediaLive.Types.BatchUpdateScheduleRequest, callback?: (err: AWSError, data: MediaLive.Types.BatchUpdateScheduleResponse) => void): Request<MediaLive.Types.BatchUpdateScheduleResponse, AWSError>;
  /**
   * Update a channel schedule
   */
  batchUpdateSchedule(callback?: (err: AWSError, data: MediaLive.Types.BatchUpdateScheduleResponse) => void): Request<MediaLive.Types.BatchUpdateScheduleResponse, AWSError>;
  /**
   * Cancel an input device transfer that you have requested.
   */
  cancelInputDeviceTransfer(params: MediaLive.Types.CancelInputDeviceTransferRequest, callback?: (err: AWSError, data: MediaLive.Types.CancelInputDeviceTransferResponse) => void): Request<MediaLive.Types.CancelInputDeviceTransferResponse, AWSError>;
  /**
   * Cancel an input device transfer that you have requested.
   */
  cancelInputDeviceTransfer(callback?: (err: AWSError, data: MediaLive.Types.CancelInputDeviceTransferResponse) => void): Request<MediaLive.Types.CancelInputDeviceTransferResponse, AWSError>;
  /**
   * Send a request to claim an AWS Elemental device that you have purchased from a third-party vendor. After the request succeeds, you will own the device.
   */
  claimDevice(params: MediaLive.Types.ClaimDeviceRequest, callback?: (err: AWSError, data: MediaLive.Types.ClaimDeviceResponse) => void): Request<MediaLive.Types.ClaimDeviceResponse, AWSError>;
  /**
   * Send a request to claim an AWS Elemental device that you have purchased from a third-party vendor. After the request succeeds, you will own the device.
   */
  claimDevice(callback?: (err: AWSError, data: MediaLive.Types.ClaimDeviceResponse) => void): Request<MediaLive.Types.ClaimDeviceResponse, AWSError>;
  /**
   * Creates a new channel
   */
  createChannel(params: MediaLive.Types.CreateChannelRequest, callback?: (err: AWSError, data: MediaLive.Types.CreateChannelResponse) => void): Request<MediaLive.Types.CreateChannelResponse, AWSError>;
  /**
   * Creates a new channel
   */
  createChannel(callback?: (err: AWSError, data: MediaLive.Types.CreateChannelResponse) => void): Request<MediaLive.Types.CreateChannelResponse, AWSError>;
  /**
   * Create an input
   */
  createInput(params: MediaLive.Types.CreateInputRequest, callback?: (err: AWSError, data: MediaLive.Types.CreateInputResponse) => void): Request<MediaLive.Types.CreateInputResponse, AWSError>;
  /**
   * Create an input
   */
  createInput(callback?: (err: AWSError, data: MediaLive.Types.CreateInputResponse) => void): Request<MediaLive.Types.CreateInputResponse, AWSError>;
  /**
   * Creates a Input Security Group
   */
  createInputSecurityGroup(params: MediaLive.Types.CreateInputSecurityGroupRequest, callback?: (err: AWSError, data: MediaLive.Types.CreateInputSecurityGroupResponse) => void): Request<MediaLive.Types.CreateInputSecurityGroupResponse, AWSError>;
  /**
   * Creates a Input Security Group
   */
  createInputSecurityGroup(callback?: (err: AWSError, data: MediaLive.Types.CreateInputSecurityGroupResponse) => void): Request<MediaLive.Types.CreateInputSecurityGroupResponse, AWSError>;
  /**
   * Create a new multiplex.
   */
  createMultiplex(params: MediaLive.Types.CreateMultiplexRequest, callback?: (err: AWSError, data: MediaLive.Types.CreateMultiplexResponse) => void): Request<MediaLive.Types.CreateMultiplexResponse, AWSError>;
  /**
   * Create a new multiplex.
   */
  createMultiplex(callback?: (err: AWSError, data: MediaLive.Types.CreateMultiplexResponse) => void): Request<MediaLive.Types.CreateMultiplexResponse, AWSError>;
  /**
   * Create a new program in the multiplex.
   */
  createMultiplexProgram(params: MediaLive.Types.CreateMultiplexProgramRequest, callback?: (err: AWSError, data: MediaLive.Types.CreateMultiplexProgramResponse) => void): Request<MediaLive.Types.CreateMultiplexProgramResponse, AWSError>;
  /**
   * Create a new program in the multiplex.
   */
  createMultiplexProgram(callback?: (err: AWSError, data: MediaLive.Types.CreateMultiplexProgramResponse) => void): Request<MediaLive.Types.CreateMultiplexProgramResponse, AWSError>;
  /**
   * Create a partner input
   */
  createPartnerInput(params: MediaLive.Types.CreatePartnerInputRequest, callback?: (err: AWSError, data: MediaLive.Types.CreatePartnerInputResponse) => void): Request<MediaLive.Types.CreatePartnerInputResponse, AWSError>;
  /**
   * Create a partner input
   */
  createPartnerInput(callback?: (err: AWSError, data: MediaLive.Types.CreatePartnerInputResponse) => void): Request<MediaLive.Types.CreatePartnerInputResponse, AWSError>;
  /**
   * Create tags for a resource
   */
  createTags(params: MediaLive.Types.CreateTagsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Create tags for a resource
   */
  createTags(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Starts deletion of channel. The associated outputs are also deleted.
   */
  deleteChannel(params: MediaLive.Types.DeleteChannelRequest, callback?: (err: AWSError, data: MediaLive.Types.DeleteChannelResponse) => void): Request<MediaLive.Types.DeleteChannelResponse, AWSError>;
  /**
   * Starts deletion of channel. The associated outputs are also deleted.
   */
  deleteChannel(callback?: (err: AWSError, data: MediaLive.Types.DeleteChannelResponse) => void): Request<MediaLive.Types.DeleteChannelResponse, AWSError>;
  /**
   * Deletes the input end point
   */
  deleteInput(params: MediaLive.Types.DeleteInputRequest, callback?: (err: AWSError, data: MediaLive.Types.DeleteInputResponse) => void): Request<MediaLive.Types.DeleteInputResponse, AWSError>;
  /**
   * Deletes the input end point
   */
  deleteInput(callback?: (err: AWSError, data: MediaLive.Types.DeleteInputResponse) => void): Request<MediaLive.Types.DeleteInputResponse, AWSError>;
  /**
   * Deletes an Input Security Group
   */
  deleteInputSecurityGroup(params: MediaLive.Types.DeleteInputSecurityGroupRequest, callback?: (err: AWSError, data: MediaLive.Types.DeleteInputSecurityGroupResponse) => void): Request<MediaLive.Types.DeleteInputSecurityGroupResponse, AWSError>;
  /**
   * Deletes an Input Security Group
   */
  deleteInputSecurityGroup(callback?: (err: AWSError, data: MediaLive.Types.DeleteInputSecurityGroupResponse) => void): Request<MediaLive.Types.DeleteInputSecurityGroupResponse, AWSError>;
  /**
   * Delete a multiplex. The multiplex must be idle.
   */
  deleteMultiplex(params: MediaLive.Types.DeleteMultiplexRequest, callback?: (err: AWSError, data: MediaLive.Types.DeleteMultiplexResponse) => void): Request<MediaLive.Types.DeleteMultiplexResponse, AWSError>;
  /**
   * Delete a multiplex. The multiplex must be idle.
   */
  deleteMultiplex(callback?: (err: AWSError, data: MediaLive.Types.DeleteMultiplexResponse) => void): Request<MediaLive.Types.DeleteMultiplexResponse, AWSError>;
  /**
   * Delete a program from a multiplex.
   */
  deleteMultiplexProgram(params: MediaLive.Types.DeleteMultiplexProgramRequest, callback?: (err: AWSError, data: MediaLive.Types.DeleteMultiplexProgramResponse) => void): Request<MediaLive.Types.DeleteMultiplexProgramResponse, AWSError>;
  /**
   * Delete a program from a multiplex.
   */
  deleteMultiplexProgram(callback?: (err: AWSError, data: MediaLive.Types.DeleteMultiplexProgramResponse) => void): Request<MediaLive.Types.DeleteMultiplexProgramResponse, AWSError>;
  /**
   * Delete an expired reservation.
   */
  deleteReservation(params: MediaLive.Types.DeleteReservationRequest, callback?: (err: AWSError, data: MediaLive.Types.DeleteReservationResponse) => void): Request<MediaLive.Types.DeleteReservationResponse, AWSError>;
  /**
   * Delete an expired reservation.
   */
  deleteReservation(callback?: (err: AWSError, data: MediaLive.Types.DeleteReservationResponse) => void): Request<MediaLive.Types.DeleteReservationResponse, AWSError>;
  /**
   * Delete all schedule actions on a channel.
   */
  deleteSchedule(params: MediaLive.Types.DeleteScheduleRequest, callback?: (err: AWSError, data: MediaLive.Types.DeleteScheduleResponse) => void): Request<MediaLive.Types.DeleteScheduleResponse, AWSError>;
  /**
   * Delete all schedule actions on a channel.
   */
  deleteSchedule(callback?: (err: AWSError, data: MediaLive.Types.DeleteScheduleResponse) => void): Request<MediaLive.Types.DeleteScheduleResponse, AWSError>;
  /**
   * Removes tags for a resource
   */
  deleteTags(params: MediaLive.Types.DeleteTagsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes tags for a resource
   */
  deleteTags(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets details about a channel
   */
  describeChannel(params: MediaLive.Types.DescribeChannelRequest, callback?: (err: AWSError, data: MediaLive.Types.DescribeChannelResponse) => void): Request<MediaLive.Types.DescribeChannelResponse, AWSError>;
  /**
   * Gets details about a channel
   */
  describeChannel(callback?: (err: AWSError, data: MediaLive.Types.DescribeChannelResponse) => void): Request<MediaLive.Types.DescribeChannelResponse, AWSError>;
  /**
   * Produces details about an input
   */
  describeInput(params: MediaLive.Types.DescribeInputRequest, callback?: (err: AWSError, data: MediaLive.Types.DescribeInputResponse) => void): Request<MediaLive.Types.DescribeInputResponse, AWSError>;
  /**
   * Produces details about an input
   */
  describeInput(callback?: (err: AWSError, data: MediaLive.Types.DescribeInputResponse) => void): Request<MediaLive.Types.DescribeInputResponse, AWSError>;
  /**
   * Gets the details for the input device
   */
  describeInputDevice(params: MediaLive.Types.DescribeInputDeviceRequest, callback?: (err: AWSError, data: MediaLive.Types.DescribeInputDeviceResponse) => void): Request<MediaLive.Types.DescribeInputDeviceResponse, AWSError>;
  /**
   * Gets the details for the input device
   */
  describeInputDevice(callback?: (err: AWSError, data: MediaLive.Types.DescribeInputDeviceResponse) => void): Request<MediaLive.Types.DescribeInputDeviceResponse, AWSError>;
  /**
   * Get the latest thumbnail data for the input device.
   */
  describeInputDeviceThumbnail(params: MediaLive.Types.DescribeInputDeviceThumbnailRequest, callback?: (err: AWSError, data: MediaLive.Types.DescribeInputDeviceThumbnailResponse) => void): Request<MediaLive.Types.DescribeInputDeviceThumbnailResponse, AWSError>;
  /**
   * Get the latest thumbnail data for the input device.
   */
  describeInputDeviceThumbnail(callback?: (err: AWSError, data: MediaLive.Types.DescribeInputDeviceThumbnailResponse) => void): Request<MediaLive.Types.DescribeInputDeviceThumbnailResponse, AWSError>;
  /**
   * Produces a summary of an Input Security Group
   */
  describeInputSecurityGroup(params: MediaLive.Types.DescribeInputSecurityGroupRequest, callback?: (err: AWSError, data: MediaLive.Types.DescribeInputSecurityGroupResponse) => void): Request<MediaLive.Types.DescribeInputSecurityGroupResponse, AWSError>;
  /**
   * Produces a summary of an Input Security Group
   */
  describeInputSecurityGroup(callback?: (err: AWSError, data: MediaLive.Types.DescribeInputSecurityGroupResponse) => void): Request<MediaLive.Types.DescribeInputSecurityGroupResponse, AWSError>;
  /**
   * Gets details about a multiplex.
   */
  describeMultiplex(params: MediaLive.Types.DescribeMultiplexRequest, callback?: (err: AWSError, data: MediaLive.Types.DescribeMultiplexResponse) => void): Request<MediaLive.Types.DescribeMultiplexResponse, AWSError>;
  /**
   * Gets details about a multiplex.
   */
  describeMultiplex(callback?: (err: AWSError, data: MediaLive.Types.DescribeMultiplexResponse) => void): Request<MediaLive.Types.DescribeMultiplexResponse, AWSError>;
  /**
   * Get the details for a program in a multiplex.
   */
  describeMultiplexProgram(params: MediaLive.Types.DescribeMultiplexProgramRequest, callback?: (err: AWSError, data: MediaLive.Types.DescribeMultiplexProgramResponse) => void): Request<MediaLive.Types.DescribeMultiplexProgramResponse, AWSError>;
  /**
   * Get the details for a program in a multiplex.
   */
  describeMultiplexProgram(callback?: (err: AWSError, data: MediaLive.Types.DescribeMultiplexProgramResponse) => void): Request<MediaLive.Types.DescribeMultiplexProgramResponse, AWSError>;
  /**
   * Get details for an offering.
   */
  describeOffering(params: MediaLive.Types.DescribeOfferingRequest, callback?: (err: AWSError, data: MediaLive.Types.DescribeOfferingResponse) => void): Request<MediaLive.Types.DescribeOfferingResponse, AWSError>;
  /**
   * Get details for an offering.
   */
  describeOffering(callback?: (err: AWSError, data: MediaLive.Types.DescribeOfferingResponse) => void): Request<MediaLive.Types.DescribeOfferingResponse, AWSError>;
  /**
   * Get details for a reservation.
   */
  describeReservation(params: MediaLive.Types.DescribeReservationRequest, callback?: (err: AWSError, data: MediaLive.Types.DescribeReservationResponse) => void): Request<MediaLive.Types.DescribeReservationResponse, AWSError>;
  /**
   * Get details for a reservation.
   */
  describeReservation(callback?: (err: AWSError, data: MediaLive.Types.DescribeReservationResponse) => void): Request<MediaLive.Types.DescribeReservationResponse, AWSError>;
  /**
   * Get a channel schedule
   */
  describeSchedule(params: MediaLive.Types.DescribeScheduleRequest, callback?: (err: AWSError, data: MediaLive.Types.DescribeScheduleResponse) => void): Request<MediaLive.Types.DescribeScheduleResponse, AWSError>;
  /**
   * Get a channel schedule
   */
  describeSchedule(callback?: (err: AWSError, data: MediaLive.Types.DescribeScheduleResponse) => void): Request<MediaLive.Types.DescribeScheduleResponse, AWSError>;
  /**
   * Get account configuration
   */
  describeAccountConfiguration(params: MediaLive.Types.DescribeAccountConfigurationRequest, callback?: (err: AWSError, data: MediaLive.Types.DescribeAccountConfigurationResponse) => void): Request<MediaLive.Types.DescribeAccountConfigurationResponse, AWSError>;
  /**
   * Get account configuration
   */
  describeAccountConfiguration(callback?: (err: AWSError, data: MediaLive.Types.DescribeAccountConfigurationResponse) => void): Request<MediaLive.Types.DescribeAccountConfigurationResponse, AWSError>;
  /**
   * Describe the latest thumbnails data.
   */
  describeThumbnails(params: MediaLive.Types.DescribeThumbnailsRequest, callback?: (err: AWSError, data: MediaLive.Types.DescribeThumbnailsResponse) => void): Request<MediaLive.Types.DescribeThumbnailsResponse, AWSError>;
  /**
   * Describe the latest thumbnails data.
   */
  describeThumbnails(callback?: (err: AWSError, data: MediaLive.Types.DescribeThumbnailsResponse) => void): Request<MediaLive.Types.DescribeThumbnailsResponse, AWSError>;
  /**
   * Produces list of channels that have been created
   */
  listChannels(params: MediaLive.Types.ListChannelsRequest, callback?: (err: AWSError, data: MediaLive.Types.ListChannelsResponse) => void): Request<MediaLive.Types.ListChannelsResponse, AWSError>;
  /**
   * Produces list of channels that have been created
   */
  listChannels(callback?: (err: AWSError, data: MediaLive.Types.ListChannelsResponse) => void): Request<MediaLive.Types.ListChannelsResponse, AWSError>;
  /**
   * List input devices that are currently being transferred. List input devices that you are transferring from your AWS account or input devices that another AWS account is transferring to you.
   */
  listInputDeviceTransfers(params: MediaLive.Types.ListInputDeviceTransfersRequest, callback?: (err: AWSError, data: MediaLive.Types.ListInputDeviceTransfersResponse) => void): Request<MediaLive.Types.ListInputDeviceTransfersResponse, AWSError>;
  /**
   * List input devices that are currently being transferred. List input devices that you are transferring from your AWS account or input devices that another AWS account is transferring to you.
   */
  listInputDeviceTransfers(callback?: (err: AWSError, data: MediaLive.Types.ListInputDeviceTransfersResponse) => void): Request<MediaLive.Types.ListInputDeviceTransfersResponse, AWSError>;
  /**
   * List input devices
   */
  listInputDevices(params: MediaLive.Types.ListInputDevicesRequest, callback?: (err: AWSError, data: MediaLive.Types.ListInputDevicesResponse) => void): Request<MediaLive.Types.ListInputDevicesResponse, AWSError>;
  /**
   * List input devices
   */
  listInputDevices(callback?: (err: AWSError, data: MediaLive.Types.ListInputDevicesResponse) => void): Request<MediaLive.Types.ListInputDevicesResponse, AWSError>;
  /**
   * Produces a list of Input Security Groups for an account
   */
  listInputSecurityGroups(params: MediaLive.Types.ListInputSecurityGroupsRequest, callback?: (err: AWSError, data: MediaLive.Types.ListInputSecurityGroupsResponse) => void): Request<MediaLive.Types.ListInputSecurityGroupsResponse, AWSError>;
  /**
   * Produces a list of Input Security Groups for an account
   */
  listInputSecurityGroups(callback?: (err: AWSError, data: MediaLive.Types.ListInputSecurityGroupsResponse) => void): Request<MediaLive.Types.ListInputSecurityGroupsResponse, AWSError>;
  /**
   * Produces list of inputs that have been created
   */
  listInputs(params: MediaLive.Types.ListInputsRequest, callback?: (err: AWSError, data: MediaLive.Types.ListInputsResponse) => void): Request<MediaLive.Types.ListInputsResponse, AWSError>;
  /**
   * Produces list of inputs that have been created
   */
  listInputs(callback?: (err: AWSError, data: MediaLive.Types.ListInputsResponse) => void): Request<MediaLive.Types.ListInputsResponse, AWSError>;
  /**
   * List the programs that currently exist for a specific multiplex.
   */
  listMultiplexPrograms(params: MediaLive.Types.ListMultiplexProgramsRequest, callback?: (err: AWSError, data: MediaLive.Types.ListMultiplexProgramsResponse) => void): Request<MediaLive.Types.ListMultiplexProgramsResponse, AWSError>;
  /**
   * List the programs that currently exist for a specific multiplex.
   */
  listMultiplexPrograms(callback?: (err: AWSError, data: MediaLive.Types.ListMultiplexProgramsResponse) => void): Request<MediaLive.Types.ListMultiplexProgramsResponse, AWSError>;
  /**
   * Retrieve a list of the existing multiplexes.
   */
  listMultiplexes(params: MediaLive.Types.ListMultiplexesRequest, callback?: (err: AWSError, data: MediaLive.Types.ListMultiplexesResponse) => void): Request<MediaLive.Types.ListMultiplexesResponse, AWSError>;
  /**
   * Retrieve a list of the existing multiplexes.
   */
  listMultiplexes(callback?: (err: AWSError, data: MediaLive.Types.ListMultiplexesResponse) => void): Request<MediaLive.Types.ListMultiplexesResponse, AWSError>;
  /**
   * List offerings available for purchase.
   */
  listOfferings(params: MediaLive.Types.ListOfferingsRequest, callback?: (err: AWSError, data: MediaLive.Types.ListOfferingsResponse) => void): Request<MediaLive.Types.ListOfferingsResponse, AWSError>;
  /**
   * List offerings available for purchase.
   */
  listOfferings(callback?: (err: AWSError, data: MediaLive.Types.ListOfferingsResponse) => void): Request<MediaLive.Types.ListOfferingsResponse, AWSError>;
  /**
   * List purchased reservations.
   */
  listReservations(params: MediaLive.Types.ListReservationsRequest, callback?: (err: AWSError, data: MediaLive.Types.ListReservationsResponse) => void): Request<MediaLive.Types.ListReservationsResponse, AWSError>;
  /**
   * List purchased reservations.
   */
  listReservations(callback?: (err: AWSError, data: MediaLive.Types.ListReservationsResponse) => void): Request<MediaLive.Types.ListReservationsResponse, AWSError>;
  /**
   * Produces list of tags that have been created for a resource
   */
  listTagsForResource(params: MediaLive.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: MediaLive.Types.ListTagsForResourceResponse) => void): Request<MediaLive.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Produces list of tags that have been created for a resource
   */
  listTagsForResource(callback?: (err: AWSError, data: MediaLive.Types.ListTagsForResourceResponse) => void): Request<MediaLive.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Purchase an offering and create a reservation.
   */
  purchaseOffering(params: MediaLive.Types.PurchaseOfferingRequest, callback?: (err: AWSError, data: MediaLive.Types.PurchaseOfferingResponse) => void): Request<MediaLive.Types.PurchaseOfferingResponse, AWSError>;
  /**
   * Purchase an offering and create a reservation.
   */
  purchaseOffering(callback?: (err: AWSError, data: MediaLive.Types.PurchaseOfferingResponse) => void): Request<MediaLive.Types.PurchaseOfferingResponse, AWSError>;
  /**
   * Send a reboot command to the specified input device. The device will begin rebooting within a few seconds of sending the command. When the reboot is complete, the device’s connection status will change to connected.
   */
  rebootInputDevice(params: MediaLive.Types.RebootInputDeviceRequest, callback?: (err: AWSError, data: MediaLive.Types.RebootInputDeviceResponse) => void): Request<MediaLive.Types.RebootInputDeviceResponse, AWSError>;
  /**
   * Send a reboot command to the specified input device. The device will begin rebooting within a few seconds of sending the command. When the reboot is complete, the device’s connection status will change to connected.
   */
  rebootInputDevice(callback?: (err: AWSError, data: MediaLive.Types.RebootInputDeviceResponse) => void): Request<MediaLive.Types.RebootInputDeviceResponse, AWSError>;
  /**
   * Reject the transfer of the specified input device to your AWS account.
   */
  rejectInputDeviceTransfer(params: MediaLive.Types.RejectInputDeviceTransferRequest, callback?: (err: AWSError, data: MediaLive.Types.RejectInputDeviceTransferResponse) => void): Request<MediaLive.Types.RejectInputDeviceTransferResponse, AWSError>;
  /**
   * Reject the transfer of the specified input device to your AWS account.
   */
  rejectInputDeviceTransfer(callback?: (err: AWSError, data: MediaLive.Types.RejectInputDeviceTransferResponse) => void): Request<MediaLive.Types.RejectInputDeviceTransferResponse, AWSError>;
  /**
   * Update account configuration
   */
  updateAccountConfiguration(params: MediaLive.Types.UpdateAccountConfigurationRequest, callback?: (err: AWSError, data: MediaLive.Types.UpdateAccountConfigurationResponse) => void): Request<MediaLive.Types.UpdateAccountConfigurationResponse, AWSError>;
  /**
   * Update account configuration
   */
  updateAccountConfiguration(callback?: (err: AWSError, data: MediaLive.Types.UpdateAccountConfigurationResponse) => void): Request<MediaLive.Types.UpdateAccountConfigurationResponse, AWSError>;
  /**
   * Starts an existing channel
   */
  startChannel(params: MediaLive.Types.StartChannelRequest, callback?: (err: AWSError, data: MediaLive.Types.StartChannelResponse) => void): Request<MediaLive.Types.StartChannelResponse, AWSError>;
  /**
   * Starts an existing channel
   */
  startChannel(callback?: (err: AWSError, data: MediaLive.Types.StartChannelResponse) => void): Request<MediaLive.Types.StartChannelResponse, AWSError>;
  /**
   * Start an input device that is attached to a MediaConnect flow. (There is no need to start a device that is attached to a MediaLive input; MediaLive starts the device when the channel starts.)
   */
  startInputDevice(params: MediaLive.Types.StartInputDeviceRequest, callback?: (err: AWSError, data: MediaLive.Types.StartInputDeviceResponse) => void): Request<MediaLive.Types.StartInputDeviceResponse, AWSError>;
  /**
   * Start an input device that is attached to a MediaConnect flow. (There is no need to start a device that is attached to a MediaLive input; MediaLive starts the device when the channel starts.)
   */
  startInputDevice(callback?: (err: AWSError, data: MediaLive.Types.StartInputDeviceResponse) => void): Request<MediaLive.Types.StartInputDeviceResponse, AWSError>;
  /**
   * Start a maintenance window for the specified input device. Starting a maintenance window will give the device up to two hours to install software. If the device was streaming prior to the maintenance, it will resume streaming when the software is fully installed. Devices automatically install updates while they are powered on and their MediaLive channels are stopped. A maintenance window allows you to update a device without having to stop MediaLive channels that use the device. The device must remain powered on and connected to the internet for the duration of the maintenance.
   */
  startInputDeviceMaintenanceWindow(params: MediaLive.Types.StartInputDeviceMaintenanceWindowRequest, callback?: (err: AWSError, data: MediaLive.Types.StartInputDeviceMaintenanceWindowResponse) => void): Request<MediaLive.Types.StartInputDeviceMaintenanceWindowResponse, AWSError>;
  /**
   * Start a maintenance window for the specified input device. Starting a maintenance window will give the device up to two hours to install software. If the device was streaming prior to the maintenance, it will resume streaming when the software is fully installed. Devices automatically install updates while they are powered on and their MediaLive channels are stopped. A maintenance window allows you to update a device without having to stop MediaLive channels that use the device. The device must remain powered on and connected to the internet for the duration of the maintenance.
   */
  startInputDeviceMaintenanceWindow(callback?: (err: AWSError, data: MediaLive.Types.StartInputDeviceMaintenanceWindowResponse) => void): Request<MediaLive.Types.StartInputDeviceMaintenanceWindowResponse, AWSError>;
  /**
   * Start (run) the multiplex. Starting the multiplex does not start the channels. You must explicitly start each channel.
   */
  startMultiplex(params: MediaLive.Types.StartMultiplexRequest, callback?: (err: AWSError, data: MediaLive.Types.StartMultiplexResponse) => void): Request<MediaLive.Types.StartMultiplexResponse, AWSError>;
  /**
   * Start (run) the multiplex. Starting the multiplex does not start the channels. You must explicitly start each channel.
   */
  startMultiplex(callback?: (err: AWSError, data: MediaLive.Types.StartMultiplexResponse) => void): Request<MediaLive.Types.StartMultiplexResponse, AWSError>;
  /**
   * Stops a running channel
   */
  stopChannel(params: MediaLive.Types.StopChannelRequest, callback?: (err: AWSError, data: MediaLive.Types.StopChannelResponse) => void): Request<MediaLive.Types.StopChannelResponse, AWSError>;
  /**
   * Stops a running channel
   */
  stopChannel(callback?: (err: AWSError, data: MediaLive.Types.StopChannelResponse) => void): Request<MediaLive.Types.StopChannelResponse, AWSError>;
  /**
   * Stop an input device that is attached to a MediaConnect flow. (There is no need to stop a device that is attached to a MediaLive input; MediaLive automatically stops the device when the channel stops.)
   */
  stopInputDevice(params: MediaLive.Types.StopInputDeviceRequest, callback?: (err: AWSError, data: MediaLive.Types.StopInputDeviceResponse) => void): Request<MediaLive.Types.StopInputDeviceResponse, AWSError>;
  /**
   * Stop an input device that is attached to a MediaConnect flow. (There is no need to stop a device that is attached to a MediaLive input; MediaLive automatically stops the device when the channel stops.)
   */
  stopInputDevice(callback?: (err: AWSError, data: MediaLive.Types.StopInputDeviceResponse) => void): Request<MediaLive.Types.StopInputDeviceResponse, AWSError>;
  /**
   * Stops a running multiplex. If the multiplex isn't running, this action has no effect.
   */
  stopMultiplex(params: MediaLive.Types.StopMultiplexRequest, callback?: (err: AWSError, data: MediaLive.Types.StopMultiplexResponse) => void): Request<MediaLive.Types.StopMultiplexResponse, AWSError>;
  /**
   * Stops a running multiplex. If the multiplex isn't running, this action has no effect.
   */
  stopMultiplex(callback?: (err: AWSError, data: MediaLive.Types.StopMultiplexResponse) => void): Request<MediaLive.Types.StopMultiplexResponse, AWSError>;
  /**
   * Start an input device transfer to another AWS account. After you make the request, the other account must accept or reject the transfer.
   */
  transferInputDevice(params: MediaLive.Types.TransferInputDeviceRequest, callback?: (err: AWSError, data: MediaLive.Types.TransferInputDeviceResponse) => void): Request<MediaLive.Types.TransferInputDeviceResponse, AWSError>;
  /**
   * Start an input device transfer to another AWS account. After you make the request, the other account must accept or reject the transfer.
   */
  transferInputDevice(callback?: (err: AWSError, data: MediaLive.Types.TransferInputDeviceResponse) => void): Request<MediaLive.Types.TransferInputDeviceResponse, AWSError>;
  /**
   * Updates a channel.
   */
  updateChannel(params: MediaLive.Types.UpdateChannelRequest, callback?: (err: AWSError, data: MediaLive.Types.UpdateChannelResponse) => void): Request<MediaLive.Types.UpdateChannelResponse, AWSError>;
  /**
   * Updates a channel.
   */
  updateChannel(callback?: (err: AWSError, data: MediaLive.Types.UpdateChannelResponse) => void): Request<MediaLive.Types.UpdateChannelResponse, AWSError>;
  /**
   * Changes the class of the channel.
   */
  updateChannelClass(params: MediaLive.Types.UpdateChannelClassRequest, callback?: (err: AWSError, data: MediaLive.Types.UpdateChannelClassResponse) => void): Request<MediaLive.Types.UpdateChannelClassResponse, AWSError>;
  /**
   * Changes the class of the channel.
   */
  updateChannelClass(callback?: (err: AWSError, data: MediaLive.Types.UpdateChannelClassResponse) => void): Request<MediaLive.Types.UpdateChannelClassResponse, AWSError>;
  /**
   * Updates an input.
   */
  updateInput(params: MediaLive.Types.UpdateInputRequest, callback?: (err: AWSError, data: MediaLive.Types.UpdateInputResponse) => void): Request<MediaLive.Types.UpdateInputResponse, AWSError>;
  /**
   * Updates an input.
   */
  updateInput(callback?: (err: AWSError, data: MediaLive.Types.UpdateInputResponse) => void): Request<MediaLive.Types.UpdateInputResponse, AWSError>;
  /**
   * Updates the parameters for the input device.
   */
  updateInputDevice(params: MediaLive.Types.UpdateInputDeviceRequest, callback?: (err: AWSError, data: MediaLive.Types.UpdateInputDeviceResponse) => void): Request<MediaLive.Types.UpdateInputDeviceResponse, AWSError>;
  /**
   * Updates the parameters for the input device.
   */
  updateInputDevice(callback?: (err: AWSError, data: MediaLive.Types.UpdateInputDeviceResponse) => void): Request<MediaLive.Types.UpdateInputDeviceResponse, AWSError>;
  /**
   * Update an Input Security Group's Whilelists.
   */
  updateInputSecurityGroup(params: MediaLive.Types.UpdateInputSecurityGroupRequest, callback?: (err: AWSError, data: MediaLive.Types.UpdateInputSecurityGroupResponse) => void): Request<MediaLive.Types.UpdateInputSecurityGroupResponse, AWSError>;
  /**
   * Update an Input Security Group's Whilelists.
   */
  updateInputSecurityGroup(callback?: (err: AWSError, data: MediaLive.Types.UpdateInputSecurityGroupResponse) => void): Request<MediaLive.Types.UpdateInputSecurityGroupResponse, AWSError>;
  /**
   * Updates a multiplex.
   */
  updateMultiplex(params: MediaLive.Types.UpdateMultiplexRequest, callback?: (err: AWSError, data: MediaLive.Types.UpdateMultiplexResponse) => void): Request<MediaLive.Types.UpdateMultiplexResponse, AWSError>;
  /**
   * Updates a multiplex.
   */
  updateMultiplex(callback?: (err: AWSError, data: MediaLive.Types.UpdateMultiplexResponse) => void): Request<MediaLive.Types.UpdateMultiplexResponse, AWSError>;
  /**
   * Update a program in a multiplex.
   */
  updateMultiplexProgram(params: MediaLive.Types.UpdateMultiplexProgramRequest, callback?: (err: AWSError, data: MediaLive.Types.UpdateMultiplexProgramResponse) => void): Request<MediaLive.Types.UpdateMultiplexProgramResponse, AWSError>;
  /**
   * Update a program in a multiplex.
   */
  updateMultiplexProgram(callback?: (err: AWSError, data: MediaLive.Types.UpdateMultiplexProgramResponse) => void): Request<MediaLive.Types.UpdateMultiplexProgramResponse, AWSError>;
  /**
   * Update reservation.
   */
  updateReservation(params: MediaLive.Types.UpdateReservationRequest, callback?: (err: AWSError, data: MediaLive.Types.UpdateReservationResponse) => void): Request<MediaLive.Types.UpdateReservationResponse, AWSError>;
  /**
   * Update reservation.
   */
  updateReservation(callback?: (err: AWSError, data: MediaLive.Types.UpdateReservationResponse) => void): Request<MediaLive.Types.UpdateReservationResponse, AWSError>;
  /**
   * Waits for the channelCreated state by periodically calling the underlying MediaLive.describeChanneloperation every 3 seconds (at most 5 times). Wait until a channel has been created
   */
  waitFor(state: "channelCreated", params: MediaLive.Types.DescribeChannelRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: MediaLive.Types.DescribeChannelResponse) => void): Request<MediaLive.Types.DescribeChannelResponse, AWSError>;
  /**
   * Waits for the channelCreated state by periodically calling the underlying MediaLive.describeChanneloperation every 3 seconds (at most 5 times). Wait until a channel has been created
   */
  waitFor(state: "channelCreated", callback?: (err: AWSError, data: MediaLive.Types.DescribeChannelResponse) => void): Request<MediaLive.Types.DescribeChannelResponse, AWSError>;
  /**
   * Waits for the channelRunning state by periodically calling the underlying MediaLive.describeChanneloperation every 5 seconds (at most 120 times). Wait until a channel is running
   */
  waitFor(state: "channelRunning", params: MediaLive.Types.DescribeChannelRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: MediaLive.Types.DescribeChannelResponse) => void): Request<MediaLive.Types.DescribeChannelResponse, AWSError>;
  /**
   * Waits for the channelRunning state by periodically calling the underlying MediaLive.describeChanneloperation every 5 seconds (at most 120 times). Wait until a channel is running
   */
  waitFor(state: "channelRunning", callback?: (err: AWSError, data: MediaLive.Types.DescribeChannelResponse) => void): Request<MediaLive.Types.DescribeChannelResponse, AWSError>;
  /**
   * Waits for the channelStopped state by periodically calling the underlying MediaLive.describeChanneloperation every 5 seconds (at most 60 times). Wait until a channel has is stopped
   */
  waitFor(state: "channelStopped", params: MediaLive.Types.DescribeChannelRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: MediaLive.Types.DescribeChannelResponse) => void): Request<MediaLive.Types.DescribeChannelResponse, AWSError>;
  /**
   * Waits for the channelStopped state by periodically calling the underlying MediaLive.describeChanneloperation every 5 seconds (at most 60 times). Wait until a channel has is stopped
   */
  waitFor(state: "channelStopped", callback?: (err: AWSError, data: MediaLive.Types.DescribeChannelResponse) => void): Request<MediaLive.Types.DescribeChannelResponse, AWSError>;
  /**
   * Waits for the channelDeleted state by periodically calling the underlying MediaLive.describeChanneloperation every 5 seconds (at most 84 times). Wait until a channel has been deleted
   */
  waitFor(state: "channelDeleted", params: MediaLive.Types.DescribeChannelRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: MediaLive.Types.DescribeChannelResponse) => void): Request<MediaLive.Types.DescribeChannelResponse, AWSError>;
  /**
   * Waits for the channelDeleted state by periodically calling the underlying MediaLive.describeChanneloperation every 5 seconds (at most 84 times). Wait until a channel has been deleted
   */
  waitFor(state: "channelDeleted", callback?: (err: AWSError, data: MediaLive.Types.DescribeChannelResponse) => void): Request<MediaLive.Types.DescribeChannelResponse, AWSError>;
  /**
   * Waits for the inputAttached state by periodically calling the underlying MediaLive.describeInputoperation every 5 seconds (at most 20 times). Wait until an input has been attached
   */
  waitFor(state: "inputAttached", params: MediaLive.Types.DescribeInputRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: MediaLive.Types.DescribeInputResponse) => void): Request<MediaLive.Types.DescribeInputResponse, AWSError>;
  /**
   * Waits for the inputAttached state by periodically calling the underlying MediaLive.describeInputoperation every 5 seconds (at most 20 times). Wait until an input has been attached
   */
  waitFor(state: "inputAttached", callback?: (err: AWSError, data: MediaLive.Types.DescribeInputResponse) => void): Request<MediaLive.Types.DescribeInputResponse, AWSError>;
  /**
   * Waits for the inputDetached state by periodically calling the underlying MediaLive.describeInputoperation every 5 seconds (at most 84 times). Wait until an input has been detached
   */
  waitFor(state: "inputDetached", params: MediaLive.Types.DescribeInputRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: MediaLive.Types.DescribeInputResponse) => void): Request<MediaLive.Types.DescribeInputResponse, AWSError>;
  /**
   * Waits for the inputDetached state by periodically calling the underlying MediaLive.describeInputoperation every 5 seconds (at most 84 times). Wait until an input has been detached
   */
  waitFor(state: "inputDetached", callback?: (err: AWSError, data: MediaLive.Types.DescribeInputResponse) => void): Request<MediaLive.Types.DescribeInputResponse, AWSError>;
  /**
   * Waits for the inputDeleted state by periodically calling the underlying MediaLive.describeInputoperation every 5 seconds (at most 20 times). Wait until an input has been deleted
   */
  waitFor(state: "inputDeleted", params: MediaLive.Types.DescribeInputRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: MediaLive.Types.DescribeInputResponse) => void): Request<MediaLive.Types.DescribeInputResponse, AWSError>;
  /**
   * Waits for the inputDeleted state by periodically calling the underlying MediaLive.describeInputoperation every 5 seconds (at most 20 times). Wait until an input has been deleted
   */
  waitFor(state: "inputDeleted", callback?: (err: AWSError, data: MediaLive.Types.DescribeInputResponse) => void): Request<MediaLive.Types.DescribeInputResponse, AWSError>;
  /**
   * Waits for the multiplexCreated state by periodically calling the underlying MediaLive.describeMultiplexoperation every 3 seconds (at most 5 times). Wait until a multiplex has been created
   */
  waitFor(state: "multiplexCreated", params: MediaLive.Types.DescribeMultiplexRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: MediaLive.Types.DescribeMultiplexResponse) => void): Request<MediaLive.Types.DescribeMultiplexResponse, AWSError>;
  /**
   * Waits for the multiplexCreated state by periodically calling the underlying MediaLive.describeMultiplexoperation every 3 seconds (at most 5 times). Wait until a multiplex has been created
   */
  waitFor(state: "multiplexCreated", callback?: (err: AWSError, data: MediaLive.Types.DescribeMultiplexResponse) => void): Request<MediaLive.Types.DescribeMultiplexResponse, AWSError>;
  /**
   * Waits for the multiplexRunning state by periodically calling the underlying MediaLive.describeMultiplexoperation every 5 seconds (at most 120 times). Wait until a multiplex is running
   */
  waitFor(state: "multiplexRunning", params: MediaLive.Types.DescribeMultiplexRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: MediaLive.Types.DescribeMultiplexResponse) => void): Request<MediaLive.Types.DescribeMultiplexResponse, AWSError>;
  /**
   * Waits for the multiplexRunning state by periodically calling the underlying MediaLive.describeMultiplexoperation every 5 seconds (at most 120 times). Wait until a multiplex is running
   */
  waitFor(state: "multiplexRunning", callback?: (err: AWSError, data: MediaLive.Types.DescribeMultiplexResponse) => void): Request<MediaLive.Types.DescribeMultiplexResponse, AWSError>;
  /**
   * Waits for the multiplexStopped state by periodically calling the underlying MediaLive.describeMultiplexoperation every 5 seconds (at most 28 times). Wait until a multiplex has is stopped
   */
  waitFor(state: "multiplexStopped", params: MediaLive.Types.DescribeMultiplexRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: MediaLive.Types.DescribeMultiplexResponse) => void): Request<MediaLive.Types.DescribeMultiplexResponse, AWSError>;
  /**
   * Waits for the multiplexStopped state by periodically calling the underlying MediaLive.describeMultiplexoperation every 5 seconds (at most 28 times). Wait until a multiplex has is stopped
   */
  waitFor(state: "multiplexStopped", callback?: (err: AWSError, data: MediaLive.Types.DescribeMultiplexResponse) => void): Request<MediaLive.Types.DescribeMultiplexResponse, AWSError>;
  /**
   * Waits for the multiplexDeleted state by periodically calling the underlying MediaLive.describeMultiplexoperation every 5 seconds (at most 20 times). Wait until a multiplex has been deleted
   */
  waitFor(state: "multiplexDeleted", params: MediaLive.Types.DescribeMultiplexRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: MediaLive.Types.DescribeMultiplexResponse) => void): Request<MediaLive.Types.DescribeMultiplexResponse, AWSError>;
  /**
   * Waits for the multiplexDeleted state by periodically calling the underlying MediaLive.describeMultiplexoperation every 5 seconds (at most 20 times). Wait until a multiplex has been deleted
   */
  waitFor(state: "multiplexDeleted", callback?: (err: AWSError, data: MediaLive.Types.DescribeMultiplexResponse) => void): Request<MediaLive.Types.DescribeMultiplexResponse, AWSError>;
}
declare namespace MediaLive {
  export type AacCodingMode = "AD_RECEIVER_MIX"|"CODING_MODE_1_0"|"CODING_MODE_1_1"|"CODING_MODE_2_0"|"CODING_MODE_5_1"|string;
  export type AacInputType = "BROADCASTER_MIXED_AD"|"NORMAL"|string;
  export type AacProfile = "HEV1"|"HEV2"|"LC"|string;
  export type AacRateControlMode = "CBR"|"VBR"|string;
  export type AacRawFormat = "LATM_LOAS"|"NONE"|string;
  export interface AacSettings {
    /**
     * Average bitrate in bits/second. Valid values depend on rate control mode and profile.
     */
    Bitrate?: __double;
    /**
     * Mono, Stereo, or 5.1 channel layout. Valid values depend on rate control mode and profile. The adReceiverMix setting receives a stereo description plus control track and emits a mono AAC encode of the description track, with control data emitted in the PES header as per ETSI TS 101 154 Annex E.
     */
    CodingMode?: AacCodingMode;
    /**
     * Set to "broadcasterMixedAd" when input contains pre-mixed main audio + AD (narration) as a stereo pair.  The Audio Type field (audioType) will be set to 3, which signals to downstream systems that this stream contains "broadcaster mixed AD". Note that the input received by the encoder must contain pre-mixed audio; the encoder does not perform the mixing. The values in audioTypeControl and audioType (in AudioDescription) are ignored when set to broadcasterMixedAd.

Leave set to "normal" when input does not contain pre-mixed audio + AD.
     */
    InputType?: AacInputType;
    /**
     * AAC Profile.
     */
    Profile?: AacProfile;
    /**
     * Rate Control Mode.
     */
    RateControlMode?: AacRateControlMode;
    /**
     * Sets LATM / LOAS AAC output for raw containers.
     */
    RawFormat?: AacRawFormat;
    /**
     * Sample rate in Hz. Valid values depend on rate control mode and profile.
     */
    SampleRate?: __double;
    /**
     * Use MPEG-2 AAC audio instead of MPEG-4 AAC audio for raw or MPEG-2 Transport Stream containers.
     */
    Spec?: AacSpec;
    /**
     * VBR Quality Level - Only used if rateControlMode is VBR.
     */
    VbrQuality?: AacVbrQuality;
  }
  export type AacSpec = "MPEG2"|"MPEG4"|string;
  export type AacVbrQuality = "HIGH"|"LOW"|"MEDIUM_HIGH"|"MEDIUM_LOW"|string;
  export type Ac3AttenuationControl = "ATTENUATE_3_DB"|"NONE"|string;
  export type Ac3BitstreamMode = "COMMENTARY"|"COMPLETE_MAIN"|"DIALOGUE"|"EMERGENCY"|"HEARING_IMPAIRED"|"MUSIC_AND_EFFECTS"|"VISUALLY_IMPAIRED"|"VOICE_OVER"|string;
  export type Ac3CodingMode = "CODING_MODE_1_0"|"CODING_MODE_1_1"|"CODING_MODE_2_0"|"CODING_MODE_3_2_LFE"|string;
  export type Ac3DrcProfile = "FILM_STANDARD"|"NONE"|string;
  export type Ac3LfeFilter = "DISABLED"|"ENABLED"|string;
  export type Ac3MetadataControl = "FOLLOW_INPUT"|"USE_CONFIGURED"|string;
  export interface Ac3Settings {
    /**
     * Average bitrate in bits/second. Valid bitrates depend on the coding mode.
     */
    Bitrate?: __double;
    /**
     * Specifies the bitstream mode (bsmod) for the emitted AC-3 stream. See ATSC A/52-2012 for background on these values.
     */
    BitstreamMode?: Ac3BitstreamMode;
    /**
     * Dolby Digital coding mode. Determines number of channels.
     */
    CodingMode?: Ac3CodingMode;
    /**
     * Sets the dialnorm for the output. If excluded and input audio is Dolby Digital, dialnorm will be passed through.
     */
    Dialnorm?: __integerMin1Max31;
    /**
     * If set to filmStandard, adds dynamic range compression signaling to the output bitstream as defined in the Dolby Digital specification.
     */
    DrcProfile?: Ac3DrcProfile;
    /**
     * When set to enabled, applies a 120Hz lowpass filter to the LFE channel prior to encoding. Only valid in codingMode32Lfe mode.
     */
    LfeFilter?: Ac3LfeFilter;
    /**
     * When set to "followInput", encoder metadata will be sourced from the DD, DD+, or DolbyE decoder that supplied this audio data. If audio was not supplied from one of these streams, then the static metadata settings will be used.
     */
    MetadataControl?: Ac3MetadataControl;
    /**
     * Applies a 3 dB attenuation to the surround channels. Applies only when the coding mode parameter is CODING_MODE_3_2_LFE.
     */
    AttenuationControl?: Ac3AttenuationControl;
  }
  export interface AcceptInputDeviceTransferRequest {
    /**
     * The unique ID of the input device to accept. For example, hd-123456789abcdef.
     */
    InputDeviceId: __string;
  }
  export interface AcceptInputDeviceTransferResponse {
  }
  export type AccessibilityType = "DOES_NOT_IMPLEMENT_ACCESSIBILITY_FEATURES"|"IMPLEMENTS_ACCESSIBILITY_FEATURES"|string;
  export interface AccountConfiguration {
    /**
     * Specifies the KMS key to use for all features that use key encryption. Specify the ARN of a KMS key that you have created. Or leave blank to use the key that MediaLive creates and manages for you.
     */
    KmsKeyId?: __string;
  }
  export type AfdSignaling = "AUTO"|"FIXED"|"NONE"|string;
  export interface AncillarySourceSettings {
    /**
     * Specifies the number (1 to 4) of the captions channel you want to extract from the ancillary captions. If you plan to convert the ancillary captions to another format, complete this field. If you plan to choose Embedded as the captions destination in the output (to pass through all the channels in the ancillary captions), leave this field blank because MediaLive ignores the field.
     */
    SourceAncillaryChannelNumber?: __integerMin1Max4;
  }
  export interface ArchiveCdnSettings {
    ArchiveS3Settings?: ArchiveS3Settings;
  }
  export interface ArchiveContainerSettings {
    M2tsSettings?: M2tsSettings;
    RawSettings?: RawSettings;
  }
  export interface ArchiveGroupSettings {
    /**
     * Parameters that control interactions with the CDN.
     */
    ArchiveCdnSettings?: ArchiveCdnSettings;
    /**
     * A directory and base filename where archive files should be written.
     */
    Destination: OutputLocationRef;
    /**
     * Number of seconds to write to archive file before closing and starting a new one.
     */
    RolloverInterval?: __integerMin1;
  }
  export interface ArchiveOutputSettings {
    /**
     * Settings specific to the container type of the file.
     */
    ContainerSettings: ArchiveContainerSettings;
    /**
     * Output file extension. If excluded, this will be auto-selected from the container type.
     */
    Extension?: __string;
    /**
     * String concatenated to the end of the destination filename.  Required for multiple outputs of the same type.
     */
    NameModifier?: __string;
  }
  export interface ArchiveS3Settings {
    /**
     * Specify the canned ACL to apply to each S3 request. Defaults to none.
     */
    CannedAcl?: S3CannedAcl;
  }
  export interface AribDestinationSettings {
  }
  export interface AribSourceSettings {
  }
  export interface AudioChannelMapping {
    /**
     * Indices and gain values for each input channel that should be remixed into this output channel.
     */
    InputChannelLevels: __listOfInputChannelLevel;
    /**
     * The index of the output channel being produced.
     */
    OutputChannel: __integerMin0Max7;
  }
  export interface AudioCodecSettings {
    AacSettings?: AacSettings;
    Ac3Settings?: Ac3Settings;
    Eac3AtmosSettings?: Eac3AtmosSettings;
    Eac3Settings?: Eac3Settings;
    Mp2Settings?: Mp2Settings;
    PassThroughSettings?: PassThroughSettings;
    WavSettings?: WavSettings;
  }
  export interface AudioDescription {
    /**
     * Advanced audio normalization settings.
     */
    AudioNormalizationSettings?: AudioNormalizationSettings;
    /**
     * The name of the AudioSelector used as the source for this AudioDescription.
     */
    AudioSelectorName: __string;
    /**
     * Applies only if audioTypeControl is useConfigured. The values for audioType are defined in ISO-IEC 13818-1.
     */
    AudioType?: AudioType;
    /**
     * Determines how audio type is determined.
  followInput: If the input contains an ISO 639 audioType, then that value is passed through to the output. If the input contains no ISO 639 audioType, the value in Audio Type is included in the output.
  useConfigured: The value in Audio Type is included in the output.
Note that this field and audioType are both ignored if inputType is broadcasterMixedAd.
     */
    AudioTypeControl?: AudioDescriptionAudioTypeControl;
    /**
     * Settings to configure one or more solutions that insert audio watermarks in the audio encode
     */
    AudioWatermarkingSettings?: AudioWatermarkSettings;
    /**
     * Audio codec settings.
     */
    CodecSettings?: AudioCodecSettings;
    /**
     * RFC 5646 language code representing the language of the audio output track. Only used if languageControlMode is useConfigured, or there is no ISO 639 language code specified in the input.
     */
    LanguageCode?: __stringMin1Max35;
    /**
     * Choosing followInput will cause the ISO 639 language code of the output to follow the ISO 639 language code of the input. The languageCode will be used when useConfigured is set, or when followInput is selected but there is no ISO 639 language code specified by the input.
     */
    LanguageCodeControl?: AudioDescriptionLanguageCodeControl;
    /**
     * The name of this AudioDescription. Outputs will use this name to uniquely identify this AudioDescription.  Description names should be unique within this Live Event.
     */
    Name: __stringMax255;
    /**
     * Settings that control how input audio channels are remixed into the output audio channels.
     */
    RemixSettings?: RemixSettings;
    /**
     * Used for MS Smooth and Apple HLS outputs. Indicates the name displayed by the player (eg. English, or Director Commentary).
     */
    StreamName?: __string;
  }
  export type AudioDescriptionAudioTypeControl = "FOLLOW_INPUT"|"USE_CONFIGURED"|string;
  export type AudioDescriptionLanguageCodeControl = "FOLLOW_INPUT"|"USE_CONFIGURED"|string;
  export interface AudioDolbyEDecode {
    /**
     * Applies only to Dolby E. Enter the program ID (according to the metadata in the audio) of the Dolby E program to extract from the specified track. One program extracted per audio selector. To select multiple programs, create multiple selectors with the same Track and different Program numbers. “All channels” means to ignore the program IDs and include all the channels in this selector; useful if metadata is known to be incorrect.
     */
    ProgramSelection: DolbyEProgramSelection;
  }
  export interface AudioHlsRenditionSelection {
    /**
     * Specifies the GROUP-ID in the #EXT-X-MEDIA tag of the target HLS audio rendition.
     */
    GroupId: __stringMin1;
    /**
     * Specifies the NAME in the #EXT-X-MEDIA tag of the target HLS audio rendition.
     */
    Name: __stringMin1;
  }
  export interface AudioLanguageSelection {
    /**
     * Selects a specific three-letter language code from within an audio source.
     */
    LanguageCode: __string;
    /**
     * When set to "strict", the transport stream demux strictly identifies audio streams by their language descriptor. If a PMT update occurs such that an audio stream matching the initially selected language is no longer present then mute will be encoded until the language returns. If "loose", then on a PMT update the demux will choose another audio stream in the program with the same stream type if it can't find one with the same language.
     */
    LanguageSelectionPolicy?: AudioLanguageSelectionPolicy;
  }
  export type AudioLanguageSelectionPolicy = "LOOSE"|"STRICT"|string;
  export type AudioNormalizationAlgorithm = "ITU_1770_1"|"ITU_1770_2"|string;
  export type AudioNormalizationAlgorithmControl = "CORRECT_AUDIO"|string;
  export interface AudioNormalizationSettings {
    /**
     * Audio normalization algorithm to use. itu17701 conforms to the CALM Act specification, itu17702 conforms to the EBU R-128 specification.
     */
    Algorithm?: AudioNormalizationAlgorithm;
    /**
     * When set to correctAudio the output audio is corrected using the chosen algorithm. If set to measureOnly, the audio will be measured but not adjusted.
     */
    AlgorithmControl?: AudioNormalizationAlgorithmControl;
    /**
     * Target LKFS(loudness) to adjust volume to. If no value is entered, a default value will be used according to the chosen algorithm.  The CALM Act (1770-1) recommends a target of -24 LKFS. The EBU R-128 specification (1770-2) recommends a target of -23 LKFS.
     */
    TargetLkfs?: __doubleMinNegative59Max0;
  }
  export type AudioOnlyHlsSegmentType = "AAC"|"FMP4"|string;
  export interface AudioOnlyHlsSettings {
    /**
     * Specifies the group to which the audio Rendition belongs.
     */
    AudioGroupId?: __string;
    /**
     * Optional. Specifies the .jpg or .png image to use as the cover art for an audio-only output. We recommend a low bit-size file because the image increases the output audio bandwidth.

The image is attached to the audio as an ID3 tag, frame type APIC, picture type 0x10, as per the "ID3 tag version 2.4.0 - Native Frames" standard.
     */
    AudioOnlyImage?: InputLocation;
    /**
     * Four types of audio-only tracks are supported:

Audio-Only Variant Stream
The client can play back this audio-only stream instead of video in low-bandwidth scenarios. Represented as an EXT-X-STREAM-INF in the HLS manifest.

Alternate Audio, Auto Select, Default
Alternate rendition that the client should try to play back by default. Represented as an EXT-X-MEDIA in the HLS manifest with DEFAULT=YES, AUTOSELECT=YES

Alternate Audio, Auto Select, Not Default
Alternate rendition that the client may try to play back by default. Represented as an EXT-X-MEDIA in the HLS manifest with DEFAULT=NO, AUTOSELECT=YES

Alternate Audio, not Auto Select
Alternate rendition that the client will not try to play back by default. Represented as an EXT-X-MEDIA in the HLS manifest with DEFAULT=NO, AUTOSELECT=NO
     */
    AudioTrackType?: AudioOnlyHlsTrackType;
    /**
     * Specifies the segment type.
     */
    SegmentType?: AudioOnlyHlsSegmentType;
  }
  export type AudioOnlyHlsTrackType = "ALTERNATE_AUDIO_AUTO_SELECT"|"ALTERNATE_AUDIO_AUTO_SELECT_DEFAULT"|"ALTERNATE_AUDIO_NOT_AUTO_SELECT"|"AUDIO_ONLY_VARIANT_STREAM"|string;
  export interface AudioPidSelection {
    /**
     * Selects a specific PID from within a source.
     */
    Pid: __integerMin0Max8191;
  }
  export interface AudioSelector {
    /**
     * The name of this AudioSelector. AudioDescriptions will use this name to uniquely identify this Selector.  Selector names should be unique per input.
     */
    Name: __stringMin1;
    /**
     * The audio selector settings.
     */
    SelectorSettings?: AudioSelectorSettings;
  }
  export interface AudioSelectorSettings {
    AudioHlsRenditionSelection?: AudioHlsRenditionSelection;
    AudioLanguageSelection?: AudioLanguageSelection;
    AudioPidSelection?: AudioPidSelection;
    AudioTrackSelection?: AudioTrackSelection;
  }
  export interface AudioSilenceFailoverSettings {
    /**
     * The name of the audio selector in the input that MediaLive should monitor to detect silence. Select your most important rendition. If you didn't create an audio selector in this input, leave blank.
     */
    AudioSelectorName: __string;
    /**
     * The amount of time (in milliseconds) that the active input must be silent before automatic input failover occurs. Silence is defined as audio loss or audio quieter than -50 dBFS.
     */
    AudioSilenceThresholdMsec?: __integerMin1000;
  }
  export interface AudioTrack {
    /**
     * 1-based integer value that maps to a specific audio track
     */
    Track: __integerMin1;
  }
  export interface AudioTrackSelection {
    /**
     * Selects one or more unique audio tracks from within a source.
     */
    Tracks: __listOfAudioTrack;
    /**
     * Configure decoding options for Dolby E streams - these should be Dolby E frames carried in PCM streams tagged with SMPTE-337
     */
    DolbyEDecode?: AudioDolbyEDecode;
  }
  export type AudioType = "CLEAN_EFFECTS"|"HEARING_IMPAIRED"|"UNDEFINED"|"VISUAL_IMPAIRED_COMMENTARY"|string;
  export interface AudioWatermarkSettings {
    /**
     * Settings to configure Nielsen Watermarks in the audio encode
     */
    NielsenWatermarksSettings?: NielsenWatermarksSettings;
  }
  export type AuthenticationScheme = "AKAMAI"|"COMMON"|string;
  export interface AutomaticInputFailoverSettings {
    /**
     * This clear time defines the requirement a recovered input must meet to be considered healthy. The input must have no failover conditions for this length of time. Enter a time in milliseconds. This value is particularly important if the input_preference for the failover pair is set to PRIMARY_INPUT_PREFERRED, because after this time, MediaLive will switch back to the primary input.
     */
    ErrorClearTimeMsec?: __integerMin1;
    /**
     * A list of failover conditions. If any of these conditions occur, MediaLive will perform a failover to the other input.
     */
    FailoverConditions?: __listOfFailoverCondition;
    /**
     * Input preference when deciding which input to make active when a previously failed input has recovered.
     */
    InputPreference?: InputPreference;
    /**
     * The input ID of the secondary input in the automatic input failover pair.
     */
    SecondaryInputId: __string;
  }
  export interface AvailBlanking {
    /**
     * Blanking image to be used. Leave empty for solid black. Only bmp and png images are supported.
     */
    AvailBlankingImage?: InputLocation;
    /**
     * When set to enabled, causes video, audio and captions to be blanked when insertion metadata is added.
     */
    State?: AvailBlankingState;
  }
  export type AvailBlankingState = "DISABLED"|"ENABLED"|string;
  export interface AvailConfiguration {
    /**
     * Controls how SCTE-35 messages create cues. Splice Insert mode treats all segmentation signals traditionally. With Time Signal APOS mode only Time Signal Placement Opportunity and Break messages create segment breaks. With ESAM mode, signals are forwarded to an ESAM server for possible update.
     */
    AvailSettings?: AvailSettings;
  }
  export interface AvailSettings {
    Esam?: Esam;
    Scte35SpliceInsert?: Scte35SpliceInsert;
    Scte35TimeSignalApos?: Scte35TimeSignalApos;
  }
  export interface BatchDeleteRequest {
    /**
     * List of channel IDs
     */
    ChannelIds?: __listOf__string;
    /**
     * List of input IDs
     */
    InputIds?: __listOf__string;
    /**
     * List of input security group IDs
     */
    InputSecurityGroupIds?: __listOf__string;
    /**
     * List of multiplex IDs
     */
    MultiplexIds?: __listOf__string;
  }
  export interface BatchDeleteResponse {
    /**
     * List of failed operations
     */
    Failed?: __listOfBatchFailedResultModel;
    /**
     * List of successful operations
     */
    Successful?: __listOfBatchSuccessfulResultModel;
  }
  export interface BatchFailedResultModel {
    /**
     * ARN of the resource
     */
    Arn?: __string;
    /**
     * Error code for the failed operation
     */
    Code?: __string;
    /**
     * ID of the resource
     */
    Id?: __string;
    /**
     * Error message for the failed operation
     */
    Message?: __string;
  }
  export interface BatchScheduleActionCreateRequest {
    /**
     * A list of schedule actions to create.
     */
    ScheduleActions: __listOfScheduleAction;
  }
  export interface BatchScheduleActionCreateResult {
    /**
     * List of actions that have been created in the schedule.
     */
    ScheduleActions: __listOfScheduleAction;
  }
  export interface BatchScheduleActionDeleteRequest {
    /**
     * A list of schedule actions to delete.
     */
    ActionNames: __listOf__string;
  }
  export interface BatchScheduleActionDeleteResult {
    /**
     * List of actions that have been deleted from the schedule.
     */
    ScheduleActions: __listOfScheduleAction;
  }
  export interface BatchStartRequest {
    /**
     * List of channel IDs
     */
    ChannelIds?: __listOf__string;
    /**
     * List of multiplex IDs
     */
    MultiplexIds?: __listOf__string;
  }
  export interface BatchStartResponse {
    /**
     * List of failed operations
     */
    Failed?: __listOfBatchFailedResultModel;
    /**
     * List of successful operations
     */
    Successful?: __listOfBatchSuccessfulResultModel;
  }
  export interface BatchStopRequest {
    /**
     * List of channel IDs
     */
    ChannelIds?: __listOf__string;
    /**
     * List of multiplex IDs
     */
    MultiplexIds?: __listOf__string;
  }
  export interface BatchStopResponse {
    /**
     * List of failed operations
     */
    Failed?: __listOfBatchFailedResultModel;
    /**
     * List of successful operations
     */
    Successful?: __listOfBatchSuccessfulResultModel;
  }
  export interface BatchSuccessfulResultModel {
    /**
     * ARN of the resource
     */
    Arn?: __string;
    /**
     * ID of the resource
     */
    Id?: __string;
    /**
     * Current state of the resource
     */
    State?: __string;
  }
  export interface BatchUpdateScheduleRequest {
    /**
     * Id of the channel whose schedule is being updated.
     */
    ChannelId: __string;
    /**
     * Schedule actions to create in the schedule.
     */
    Creates?: BatchScheduleActionCreateRequest;
    /**
     * Schedule actions to delete from the schedule.
     */
    Deletes?: BatchScheduleActionDeleteRequest;
  }
  export interface BatchUpdateScheduleResponse {
    /**
     * Schedule actions created in the schedule.
     */
    Creates?: BatchScheduleActionCreateResult;
    /**
     * Schedule actions deleted from the schedule.
     */
    Deletes?: BatchScheduleActionDeleteResult;
  }
  export interface BlackoutSlate {
    /**
     * Blackout slate image to be used. Leave empty for solid black. Only bmp and png images are supported.
     */
    BlackoutSlateImage?: InputLocation;
    /**
     * Setting to enabled causes the encoder to blackout the video, audio, and captions, and raise the "Network Blackout Image" slate when an SCTE104/35 Network End Segmentation Descriptor is encountered. The blackout will be lifted when the Network Start Segmentation Descriptor is encountered. The Network End and Network Start descriptors must contain a network ID that matches the value entered in "Network ID".
     */
    NetworkEndBlackout?: BlackoutSlateNetworkEndBlackout;
    /**
     * Path to local file to use as Network End Blackout image. Image will be scaled to fill the entire output raster.
     */
    NetworkEndBlackoutImage?: InputLocation;
    /**
     * Provides Network ID that matches EIDR ID format (e.g., "10.XXXX/XXXX-XXXX-XXXX-XXXX-XXXX-C").
     */
    NetworkId?: __stringMin34Max34;
    /**
     * When set to enabled, causes video, audio and captions to be blanked when indicated by program metadata.
     */
    State?: BlackoutSlateState;
  }
  export type BlackoutSlateNetworkEndBlackout = "DISABLED"|"ENABLED"|string;
  export type BlackoutSlateState = "DISABLED"|"ENABLED"|string;
  export type BurnInAlignment = "CENTERED"|"LEFT"|"SMART"|string;
  export type BurnInBackgroundColor = "BLACK"|"NONE"|"WHITE"|string;
  export interface BurnInDestinationSettings {
    /**
     * If no explicit xPosition or yPosition is provided, setting alignment to centered will place the captions at the bottom center of the output. Similarly, setting a left alignment will align captions to the bottom left of the output. If x and y positions are given in conjunction with the alignment parameter, the font will be justified (either left or centered) relative to those coordinates. Selecting "smart" justification will left-justify live subtitles and center-justify pre-recorded subtitles.  All burn-in and DVB-Sub font settings must match.
     */
    Alignment?: BurnInAlignment;
    /**
     * Specifies the color of the rectangle behind the captions.  All burn-in and DVB-Sub font settings must match.
     */
    BackgroundColor?: BurnInBackgroundColor;
    /**
     * Specifies the opacity of the background rectangle. 255 is opaque; 0 is transparent. Leaving this parameter out is equivalent to setting it to 0 (transparent).  All burn-in and DVB-Sub font settings must match.
     */
    BackgroundOpacity?: __integerMin0Max255;
    /**
     * External font file used for caption burn-in. File extension must be 'ttf' or 'tte'.  Although the user can select output fonts for many different types of input captions,  embedded, STL and teletext sources use a strict grid system. Using external fonts with these caption sources could cause unexpected display of proportional fonts.  All burn-in and DVB-Sub font settings must match.
     */
    Font?: InputLocation;
    /**
     * Specifies the color of the burned-in captions.  This option is not valid for source captions that are STL, 608/embedded or teletext.  These source settings are already pre-defined by the caption stream.  All burn-in and DVB-Sub font settings must match.
     */
    FontColor?: BurnInFontColor;
    /**
     * Specifies the opacity of the burned-in captions. 255 is opaque; 0 is transparent.  All burn-in and DVB-Sub font settings must match.
     */
    FontOpacity?: __integerMin0Max255;
    /**
     * Font resolution in DPI (dots per inch); default is 96 dpi.  All burn-in and DVB-Sub font settings must match.
     */
    FontResolution?: __integerMin96Max600;
    /**
     * When set to 'auto' fontSize will scale depending on the size of the output.  Giving a positive integer will specify the exact font size in points.  All burn-in and DVB-Sub font settings must match.
     */
    FontSize?: __string;
    /**
     * Specifies font outline color. This option is not valid for source captions that are either 608/embedded or teletext. These source settings are already pre-defined by the caption stream. All burn-in and DVB-Sub font settings must match.
     */
    OutlineColor?: BurnInOutlineColor;
    /**
     * Specifies font outline size in pixels. This option is not valid for source captions that are either 608/embedded or teletext. These source settings are already pre-defined by the caption stream. All burn-in and DVB-Sub font settings must match.
     */
    OutlineSize?: __integerMin0Max10;
    /**
     * Specifies the color of the shadow cast by the captions.  All burn-in and DVB-Sub font settings must match.
     */
    ShadowColor?: BurnInShadowColor;
    /**
     * Specifies the opacity of the shadow. 255 is opaque; 0 is transparent. Leaving this parameter out is equivalent to setting it to 0 (transparent).  All burn-in and DVB-Sub font settings must match.
     */
    ShadowOpacity?: __integerMin0Max255;
    /**
     * Specifies the horizontal offset of the shadow relative to the captions in pixels. A value of -2 would result in a shadow offset 2 pixels to the left.  All burn-in and DVB-Sub font settings must match.
     */
    ShadowXOffset?: __integer;
    /**
     * Specifies the vertical offset of the shadow relative to the captions in pixels. A value of -2 would result in a shadow offset 2 pixels above the text.  All burn-in and DVB-Sub font settings must match.
     */
    ShadowYOffset?: __integer;
    /**
     * Controls whether a fixed grid size will be used to generate the output subtitles bitmap. Only applicable for Teletext inputs and DVB-Sub/Burn-in outputs.
     */
    TeletextGridControl?: BurnInTeletextGridControl;
    /**
     * Specifies the horizontal position of the caption relative to the left side of the output in pixels. A value of 10 would result in the captions starting 10 pixels from the left of the output. If no explicit xPosition is provided, the horizontal caption position will be determined by the alignment parameter.  All burn-in and DVB-Sub font settings must match.
     */
    XPosition?: __integerMin0;
    /**
     * Specifies the vertical position of the caption relative to the top of the output in pixels. A value of 10 would result in the captions starting 10 pixels from the top of the output. If no explicit yPosition is provided, the caption will be positioned towards the bottom of the output.  All burn-in and DVB-Sub font settings must match.
     */
    YPosition?: __integerMin0;
  }
  export type BurnInFontColor = "BLACK"|"BLUE"|"GREEN"|"RED"|"WHITE"|"YELLOW"|string;
  export type BurnInOutlineColor = "BLACK"|"BLUE"|"GREEN"|"RED"|"WHITE"|"YELLOW"|string;
  export type BurnInShadowColor = "BLACK"|"NONE"|"WHITE"|string;
  export type BurnInTeletextGridControl = "FIXED"|"SCALED"|string;
  export interface CancelInputDeviceTransferRequest {
    /**
     * The unique ID of the input device to cancel. For example, hd-123456789abcdef.
     */
    InputDeviceId: __string;
  }
  export interface CancelInputDeviceTransferResponse {
  }
  export interface CaptionDescription {
    /**
     * Indicates whether the caption track implements accessibility features such as written descriptions of spoken dialog, music, and sounds.
     */
    Accessibility?: AccessibilityType;
    /**
     * Specifies which input caption selector to use as a caption source when generating output captions. This field should match a captionSelector name.
     */
    CaptionSelectorName: __string;
    /**
     * Additional settings for captions destination that depend on the destination type.
     */
    DestinationSettings?: CaptionDestinationSettings;
    /**
     * ISO 639-2 three-digit code: http://www.loc.gov/standards/iso639-2/
     */
    LanguageCode?: __string;
    /**
     * Human readable information to indicate captions available for players (eg. English, or Spanish).
     */
    LanguageDescription?: __string;
    /**
     * Name of the caption description.  Used to associate a caption description with an output.  Names must be unique within an event.
     */
    Name: __string;
  }
  export interface CaptionDestinationSettings {
    AribDestinationSettings?: AribDestinationSettings;
    BurnInDestinationSettings?: BurnInDestinationSettings;
    DvbSubDestinationSettings?: DvbSubDestinationSettings;
    EbuTtDDestinationSettings?: EbuTtDDestinationSettings;
    EmbeddedDestinationSettings?: EmbeddedDestinationSettings;
    EmbeddedPlusScte20DestinationSettings?: EmbeddedPlusScte20DestinationSettings;
    RtmpCaptionInfoDestinationSettings?: RtmpCaptionInfoDestinationSettings;
    Scte20PlusEmbeddedDestinationSettings?: Scte20PlusEmbeddedDestinationSettings;
    Scte27DestinationSettings?: Scte27DestinationSettings;
    SmpteTtDestinationSettings?: SmpteTtDestinationSettings;
    TeletextDestinationSettings?: TeletextDestinationSettings;
    TtmlDestinationSettings?: TtmlDestinationSettings;
    WebvttDestinationSettings?: WebvttDestinationSettings;
  }
  export interface CaptionLanguageMapping {
    /**
     * The closed caption channel being described by this CaptionLanguageMapping.  Each channel mapping must have a unique channel number (maximum of 4)
     */
    CaptionChannel: __integerMin1Max4;
    /**
     * Three character ISO 639-2 language code (see http://www.loc.gov/standards/iso639-2)
     */
    LanguageCode: __stringMin3Max3;
    /**
     * Textual description of language
     */
    LanguageDescription: __stringMin1;
  }
  export interface CaptionRectangle {
    /**
     * See the description in leftOffset.
For height, specify the entire height of the rectangle as a percentage of the underlying frame height. For example, \"80\" means the rectangle height is 80% of the underlying frame height. The topOffset and rectangleHeight must add up to 100% or less.
This field corresponds to tts:extent - Y in the TTML standard.
     */
    Height: __doubleMin0Max100;
    /**
     * Applies only if you plan to convert these source captions to EBU-TT-D or TTML in an output. (Make sure to leave the default if you don't have either of these formats in the output.) You can define a display rectangle for the captions that is smaller than the underlying video frame. You define the rectangle by specifying the position of the left edge, top edge, bottom edge, and right edge of the rectangle, all within the underlying video frame. The units for the measurements are percentages.
If you specify a value for one of these fields, you must specify a value for all of them.
For leftOffset, specify the position of the left edge of the rectangle, as a percentage of the underlying frame width, and relative to the left edge of the frame. For example, \"10\" means the measurement is 10% of the underlying frame width. The rectangle left edge starts at that position from the left edge of the frame.
This field corresponds to tts:origin - X in the TTML standard.
     */
    LeftOffset: __doubleMin0Max100;
    /**
     * See the description in leftOffset.
For topOffset, specify the position of the top edge of the rectangle, as a percentage of the underlying frame height, and relative to the top edge of the frame. For example, \"10\" means the measurement is 10% of the underlying frame height. The rectangle top edge starts at that position from the top edge of the frame.
This field corresponds to tts:origin - Y in the TTML standard.
     */
    TopOffset: __doubleMin0Max100;
    /**
     * See the description in leftOffset.
For width, specify the entire width of the rectangle as a percentage of the underlying frame width. For example, \"80\" means the rectangle width is 80% of the underlying frame width. The leftOffset and rectangleWidth must add up to 100% or less.
This field corresponds to tts:extent - X in the TTML standard.
     */
    Width: __doubleMin0Max100;
  }
  export interface CaptionSelector {
    /**
     * When specified this field indicates the three letter language code of the caption track to extract from the source.
     */
    LanguageCode?: __string;
    /**
     * Name identifier for a caption selector.  This name is used to associate this caption selector with one or more caption descriptions.  Names must be unique within an event.
     */
    Name: __stringMin1;
    /**
     * Caption selector settings.
     */
    SelectorSettings?: CaptionSelectorSettings;
  }
  export interface CaptionSelectorSettings {
    AncillarySourceSettings?: AncillarySourceSettings;
    AribSourceSettings?: AribSourceSettings;
    DvbSubSourceSettings?: DvbSubSourceSettings;
    EmbeddedSourceSettings?: EmbeddedSourceSettings;
    Scte20SourceSettings?: Scte20SourceSettings;
    Scte27SourceSettings?: Scte27SourceSettings;
    TeletextSourceSettings?: TeletextSourceSettings;
  }
  export type CdiInputResolution = "SD"|"HD"|"FHD"|"UHD"|string;
  export interface CdiInputSpecification {
    /**
     * Maximum CDI input resolution
     */
    Resolution?: CdiInputResolution;
  }
  export interface Channel {
    /**
     * The unique arn of the channel.
     */
    Arn?: __string;
    /**
     * Specification of CDI inputs for this channel
     */
    CdiInputSpecification?: CdiInputSpecification;
    /**
     * The class for this channel. STANDARD for a channel with two pipelines or SINGLE_PIPELINE for a channel with one pipeline.
     */
    ChannelClass?: ChannelClass;
    /**
     * A list of destinations of the channel. For UDP outputs, there is one
destination per output. For other types (HLS, for example), there is
one destination per packager.

     */
    Destinations?: __listOfOutputDestination;
    /**
     * The endpoints where outgoing connections initiate from
     */
    EgressEndpoints?: __listOfChannelEgressEndpoint;
    EncoderSettings?: EncoderSettings;
    /**
     * The unique id of the channel.
     */
    Id?: __string;
    /**
     * List of input attachments for channel.
     */
    InputAttachments?: __listOfInputAttachment;
    /**
     * Specification of network and file inputs for this channel
     */
    InputSpecification?: InputSpecification;
    /**
     * The log level being written to CloudWatch Logs.
     */
    LogLevel?: LogLevel;
    /**
     * Maintenance settings for this channel.
     */
    Maintenance?: MaintenanceStatus;
    /**
     * The name of the channel. (user-mutable)
     */
    Name?: __string;
    /**
     * Runtime details for the pipelines of a running channel.
     */
    PipelineDetails?: __listOfPipelineDetail;
    /**
     * The number of currently healthy pipelines.
     */
    PipelinesRunningCount?: __integer;
    /**
     * The Amazon Resource Name (ARN) of the role assumed when running the Channel.
     */
    RoleArn?: __string;
    State?: ChannelState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    /**
     * Settings for VPC output
     */
    Vpc?: VpcOutputSettingsDescription;
  }
  export type ChannelClass = "STANDARD"|"SINGLE_PIPELINE"|string;
  export interface ChannelEgressEndpoint {
    /**
     * Public IP of where a channel's output comes from
     */
    SourceIp?: __string;
  }
  export type ChannelState = "CREATING"|"CREATE_FAILED"|"IDLE"|"STARTING"|"RUNNING"|"RECOVERING"|"STOPPING"|"DELETING"|"DELETED"|"UPDATING"|"UPDATE_FAILED"|string;
  export interface ChannelSummary {
    /**
     * The unique arn of the channel.
     */
    Arn?: __string;
    /**
     * Specification of CDI inputs for this channel
     */
    CdiInputSpecification?: CdiInputSpecification;
    /**
     * The class for this channel. STANDARD for a channel with two pipelines or SINGLE_PIPELINE for a channel with one pipeline.
     */
    ChannelClass?: ChannelClass;
    /**
     * A list of destinations of the channel. For UDP outputs, there is one
destination per output. For other types (HLS, for example), there is
one destination per packager.

     */
    Destinations?: __listOfOutputDestination;
    /**
     * The endpoints where outgoing connections initiate from
     */
    EgressEndpoints?: __listOfChannelEgressEndpoint;
    /**
     * The unique id of the channel.
     */
    Id?: __string;
    /**
     * List of input attachments for channel.
     */
    InputAttachments?: __listOfInputAttachment;
    /**
     * Specification of network and file inputs for this channel
     */
    InputSpecification?: InputSpecification;
    /**
     * The log level being written to CloudWatch Logs.
     */
    LogLevel?: LogLevel;
    /**
     * Maintenance settings for this channel.
     */
    Maintenance?: MaintenanceStatus;
    /**
     * The name of the channel. (user-mutable)
     */
    Name?: __string;
    /**
     * The number of currently healthy pipelines.
     */
    PipelinesRunningCount?: __integer;
    /**
     * The Amazon Resource Name (ARN) of the role assumed when running the Channel.
     */
    RoleArn?: __string;
    State?: ChannelState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    /**
     * Settings for any VPC outputs.
     */
    Vpc?: VpcOutputSettingsDescription;
  }
  export interface ClaimDeviceRequest {
    /**
     * The id of the device you want to claim.
     */
    Id?: __string;
  }
  export interface ClaimDeviceResponse {
  }
  export interface ColorSpacePassthroughSettings {
  }
  export interface CreateChannelRequest {
    /**
     * Specification of CDI inputs for this channel
     */
    CdiInputSpecification?: CdiInputSpecification;
    /**
     * The class for this channel. STANDARD for a channel with two pipelines or SINGLE_PIPELINE for a channel with one pipeline.
     */
    ChannelClass?: ChannelClass;
    Destinations?: __listOfOutputDestination;
    EncoderSettings?: EncoderSettings;
    /**
     * List of input attachments for channel.
     */
    InputAttachments?: __listOfInputAttachment;
    /**
     * Specification of network and file inputs for this channel
     */
    InputSpecification?: InputSpecification;
    /**
     * The log level to write to CloudWatch Logs.
     */
    LogLevel?: LogLevel;
    /**
     * Maintenance settings for this channel.
     */
    Maintenance?: MaintenanceCreateSettings;
    /**
     * Name of channel.
     */
    Name?: __string;
    /**
     * Unique request ID to be specified. This is needed to prevent retries from
creating multiple resources.

     */
    RequestId?: __string;
    /**
     * Deprecated field that's only usable by whitelisted customers.
     */
    Reserved?: __string;
    /**
     * An optional Amazon Resource Name (ARN) of the role to assume when running the Channel.
     */
    RoleArn?: __string;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    /**
     * Settings for the VPC outputs
     */
    Vpc?: VpcOutputSettings;
  }
  export interface CreateChannelResponse {
    Channel?: Channel;
  }
  export interface CreateInputRequest {
    /**
     * Destination settings for PUSH type inputs.
     */
    Destinations?: __listOfInputDestinationRequest;
    /**
     * Settings for the devices.
     */
    InputDevices?: __listOfInputDeviceSettings;
    /**
     * A list of security groups referenced by IDs to attach to the input.
     */
    InputSecurityGroups?: __listOf__string;
    /**
     * A list of the MediaConnect Flows that you want to use in this input. You can specify as few as one
Flow and presently, as many as two. The only requirement is when you have more than one is that each Flow is in a
separate Availability Zone as this ensures your EML input is redundant to AZ issues.

     */
    MediaConnectFlows?: __listOfMediaConnectFlowRequest;
    /**
     * Name of the input.
     */
    Name?: __string;
    /**
     * Unique identifier of the request to ensure the request is handled
exactly once in case of retries.

     */
    RequestId?: __string;
    /**
     * The Amazon Resource Name (ARN) of the role this input assumes during and after creation.
     */
    RoleArn?: __string;
    /**
     * The source URLs for a PULL-type input. Every PULL type input needs
exactly two source URLs for redundancy.
Only specify sources for PULL type Inputs. Leave Destinations empty.

     */
    Sources?: __listOfInputSourceRequest;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    Type?: InputType;
    Vpc?: InputVpcRequest;
  }
  export interface CreateInputResponse {
    Input?: Input;
  }
  export interface CreateInputSecurityGroupRequest {
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    /**
     * List of IPv4 CIDR addresses to whitelist
     */
    WhitelistRules?: __listOfInputWhitelistRuleCidr;
  }
  export interface CreateInputSecurityGroupResponse {
    SecurityGroup?: InputSecurityGroup;
  }
  export interface CreateMultiplexProgramRequest {
    /**
     * ID of the multiplex where the program is to be created.
     */
    MultiplexId: __string;
    /**
     * The settings for this multiplex program.
     */
    MultiplexProgramSettings: MultiplexProgramSettings;
    /**
     * Name of multiplex program.
     */
    ProgramName: __string;
    /**
     * Unique request ID. This prevents retries from creating multiple
resources.

     */
    RequestId: __string;
  }
  export interface CreateMultiplexProgramResponse {
    /**
     * The newly created multiplex program.
     */
    MultiplexProgram?: MultiplexProgram;
  }
  export interface CreateMultiplexRequest {
    /**
     * A list of availability zones for the multiplex. You must specify exactly two.
     */
    AvailabilityZones: __listOf__string;
    /**
     * Configuration for a multiplex event.
     */
    MultiplexSettings: MultiplexSettings;
    /**
     * Name of multiplex.
     */
    Name: __string;
    /**
     * Unique request ID. This prevents retries from creating multiple
resources.

     */
    RequestId: __string;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
  }
  export interface CreateMultiplexResponse {
    /**
     * The newly created multiplex.
     */
    Multiplex?: Multiplex;
  }
  export interface CreatePartnerInputRequest {
    /**
     * Unique ID of the input.
     */
    InputId: __string;
    /**
     * Unique identifier of the request to ensure the request is handled
exactly once in case of retries.

     */
    RequestId?: __string;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
  }
  export interface CreatePartnerInputResponse {
    Input?: Input;
  }
  export interface CreateTagsRequest {
    ResourceArn: __string;
    Tags?: Tags;
  }
  export interface DeleteChannelRequest {
    /**
     * Unique ID of the channel.
     */
    ChannelId: __string;
  }
  export interface DeleteChannelResponse {
    /**
     * The unique arn of the channel.
     */
    Arn?: __string;
    /**
     * Specification of CDI inputs for this channel
     */
    CdiInputSpecification?: CdiInputSpecification;
    /**
     * The class for this channel. STANDARD for a channel with two pipelines or SINGLE_PIPELINE for a channel with one pipeline.
     */
    ChannelClass?: ChannelClass;
    /**
     * A list of destinations of the channel. For UDP outputs, there is one
destination per output. For other types (HLS, for example), there is
one destination per packager.

     */
    Destinations?: __listOfOutputDestination;
    /**
     * The endpoints where outgoing connections initiate from
     */
    EgressEndpoints?: __listOfChannelEgressEndpoint;
    EncoderSettings?: EncoderSettings;
    /**
     * The unique id of the channel.
     */
    Id?: __string;
    /**
     * List of input attachments for channel.
     */
    InputAttachments?: __listOfInputAttachment;
    /**
     * Specification of network and file inputs for this channel
     */
    InputSpecification?: InputSpecification;
    /**
     * The log level being written to CloudWatch Logs.
     */
    LogLevel?: LogLevel;
    /**
     * Maintenance settings for this channel.
     */
    Maintenance?: MaintenanceStatus;
    /**
     * The name of the channel. (user-mutable)
     */
    Name?: __string;
    /**
     * Runtime details for the pipelines of a running channel.
     */
    PipelineDetails?: __listOfPipelineDetail;
    /**
     * The number of currently healthy pipelines.
     */
    PipelinesRunningCount?: __integer;
    /**
     * The Amazon Resource Name (ARN) of the role assumed when running the Channel.
     */
    RoleArn?: __string;
    State?: ChannelState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    /**
     * Settings for VPC output
     */
    Vpc?: VpcOutputSettingsDescription;
  }
  export interface DeleteInputRequest {
    /**
     * Unique ID of the input
     */
    InputId: __string;
  }
  export interface DeleteInputResponse {
  }
  export interface DeleteInputSecurityGroupRequest {
    /**
     * The Input Security Group to delete
     */
    InputSecurityGroupId: __string;
  }
  export interface DeleteInputSecurityGroupResponse {
  }
  export interface DeleteMultiplexProgramRequest {
    /**
     * The ID of the multiplex that the program belongs to.
     */
    MultiplexId: __string;
    /**
     * The multiplex program name.
     */
    ProgramName: __string;
  }
  export interface DeleteMultiplexProgramResponse {
    /**
     * The MediaLive channel associated with the program.
     */
    ChannelId?: __string;
    /**
     * The settings for this multiplex program.
     */
    MultiplexProgramSettings?: MultiplexProgramSettings;
    /**
     * The packet identifier map for this multiplex program.
     */
    PacketIdentifiersMap?: MultiplexProgramPacketIdentifiersMap;
    /**
     * Contains information about the current sources for the specified program in the specified multiplex. Keep in mind that each multiplex pipeline connects to both pipelines in a given source channel (the channel identified by the program). But only one of those channel pipelines is ever active at one time.
     */
    PipelineDetails?: __listOfMultiplexProgramPipelineDetail;
    /**
     * The name of the multiplex program.
     */
    ProgramName?: __string;
  }
  export interface DeleteMultiplexRequest {
    /**
     * The ID of the multiplex.
     */
    MultiplexId: __string;
  }
  export interface DeleteMultiplexResponse {
    /**
     * The unique arn of the multiplex.
     */
    Arn?: __string;
    /**
     * A list of availability zones for the multiplex.
     */
    AvailabilityZones?: __listOf__string;
    /**
     * A list of the multiplex output destinations.
     */
    Destinations?: __listOfMultiplexOutputDestination;
    /**
     * The unique id of the multiplex.
     */
    Id?: __string;
    /**
     * Configuration for a multiplex event.
     */
    MultiplexSettings?: MultiplexSettings;
    /**
     * The name of the multiplex.
     */
    Name?: __string;
    /**
     * The number of currently healthy pipelines.
     */
    PipelinesRunningCount?: __integer;
    /**
     * The number of programs in the multiplex.
     */
    ProgramCount?: __integer;
    /**
     * The current state of the multiplex.
     */
    State?: MultiplexState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
  }
  export interface DeleteReservationRequest {
    /**
     * Unique reservation ID, e.g. '1234567'
     */
    ReservationId: __string;
  }
  export interface DeleteReservationResponse {
    /**
     * Unique reservation ARN, e.g. 'arn:aws:medialive:us-west-2:123456789012:reservation:1234567'
     */
    Arn?: __string;
    /**
     * Number of reserved resources
     */
    Count?: __integer;
    /**
     * Currency code for usagePrice and fixedPrice in ISO-4217 format, e.g. 'USD'
     */
    CurrencyCode?: __string;
    /**
     * Lease duration, e.g. '12'
     */
    Duration?: __integer;
    /**
     * Units for duration, e.g. 'MONTHS'
     */
    DurationUnits?: OfferingDurationUnits;
    /**
     * Reservation UTC end date and time in ISO-8601 format, e.g. '2019-03-01T00:00:00'
     */
    End?: __string;
    /**
     * One-time charge for each reserved resource, e.g. '0.0' for a NO_UPFRONT offering
     */
    FixedPrice?: __double;
    /**
     * User specified reservation name
     */
    Name?: __string;
    /**
     * Offering description, e.g. 'HD AVC output at 10-20 Mbps, 30 fps, and standard VQ in US West (Oregon)'
     */
    OfferingDescription?: __string;
    /**
     * Unique offering ID, e.g. '87654321'
     */
    OfferingId?: __string;
    /**
     * Offering type, e.g. 'NO_UPFRONT'
     */
    OfferingType?: OfferingType;
    /**
     * AWS region, e.g. 'us-west-2'
     */
    Region?: __string;
    /**
     * Renewal settings for the reservation
     */
    RenewalSettings?: RenewalSettings;
    /**
     * Unique reservation ID, e.g. '1234567'
     */
    ReservationId?: __string;
    /**
     * Resource configuration details
     */
    ResourceSpecification?: ReservationResourceSpecification;
    /**
     * Reservation UTC start date and time in ISO-8601 format, e.g. '2018-03-01T00:00:00'
     */
    Start?: __string;
    /**
     * Current state of reservation, e.g. 'ACTIVE'
     */
    State?: ReservationState;
    /**
     * A collection of key-value pairs
     */
    Tags?: Tags;
    /**
     * Recurring usage charge for each reserved resource, e.g. '157.0'
     */
    UsagePrice?: __double;
  }
  export interface DeleteScheduleRequest {
    /**
     * Id of the channel whose schedule is being deleted.
     */
    ChannelId: __string;
  }
  export interface DeleteScheduleResponse {
  }
  export interface DeleteTagsRequest {
    ResourceArn: __string;
    /**
     * An array of tag keys to delete
     */
    TagKeys: __listOf__string;
  }
  export interface DescribeChannelRequest {
    /**
     * channel ID
     */
    ChannelId: __string;
  }
  export interface DescribeChannelResponse {
    /**
     * The unique arn of the channel.
     */
    Arn?: __string;
    /**
     * Specification of CDI inputs for this channel
     */
    CdiInputSpecification?: CdiInputSpecification;
    /**
     * The class for this channel. STANDARD for a channel with two pipelines or SINGLE_PIPELINE for a channel with one pipeline.
     */
    ChannelClass?: ChannelClass;
    /**
     * A list of destinations of the channel. For UDP outputs, there is one
destination per output. For other types (HLS, for example), there is
one destination per packager.

     */
    Destinations?: __listOfOutputDestination;
    /**
     * The endpoints where outgoing connections initiate from
     */
    EgressEndpoints?: __listOfChannelEgressEndpoint;
    EncoderSettings?: EncoderSettings;
    /**
     * The unique id of the channel.
     */
    Id?: __string;
    /**
     * List of input attachments for channel.
     */
    InputAttachments?: __listOfInputAttachment;
    /**
     * Specification of network and file inputs for this channel
     */
    InputSpecification?: InputSpecification;
    /**
     * The log level being written to CloudWatch Logs.
     */
    LogLevel?: LogLevel;
    /**
     * Maintenance settings for this channel.
     */
    Maintenance?: MaintenanceStatus;
    /**
     * The name of the channel. (user-mutable)
     */
    Name?: __string;
    /**
     * Runtime details for the pipelines of a running channel.
     */
    PipelineDetails?: __listOfPipelineDetail;
    /**
     * The number of currently healthy pipelines.
     */
    PipelinesRunningCount?: __integer;
    /**
     * The Amazon Resource Name (ARN) of the role assumed when running the Channel.
     */
    RoleArn?: __string;
    State?: ChannelState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    /**
     * Settings for VPC output
     */
    Vpc?: VpcOutputSettingsDescription;
  }
  export interface DescribeInputDeviceRequest {
    /**
     * The unique ID of this input device. For example, hd-123456789abcdef.
     */
    InputDeviceId: __string;
  }
  export interface DescribeInputDeviceResponse {
    /**
     * The unique ARN of the input device.
     */
    Arn?: __string;
    /**
     * The state of the connection between the input device and AWS.
     */
    ConnectionState?: InputDeviceConnectionState;
    /**
     * The status of the action to synchronize the device configuration. If you change the configuration of the input device (for example, the maximum bitrate), MediaLive sends the new data to the device. The device might not update itself immediately. SYNCED means the device has updated its configuration. SYNCING means that it has not updated its configuration.
     */
    DeviceSettingsSyncState?: DeviceSettingsSyncState;
    /**
     * The status of software on the input device.
     */
    DeviceUpdateStatus?: DeviceUpdateStatus;
    /**
     * Settings that describe an input device that is type HD.
     */
    HdDeviceSettings?: InputDeviceHdSettings;
    /**
     * The unique ID of the input device.
     */
    Id?: __string;
    /**
     * The network MAC address of the input device.
     */
    MacAddress?: __string;
    /**
     * A name that you specify for the input device.
     */
    Name?: __string;
    /**
     * The network settings for the input device.
     */
    NetworkSettings?: InputDeviceNetworkSettings;
    /**
     * The unique serial number of the input device.
     */
    SerialNumber?: __string;
    /**
     * The type of the input device.
     */
    Type?: InputDeviceType;
    /**
     * Settings that describe an input device that is type UHD.
     */
    UhdDeviceSettings?: InputDeviceUhdSettings;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    /**
     * The Availability Zone associated with this input device.
     */
    AvailabilityZone?: __string;
    /**
     * An array of the ARNs for the MediaLive inputs attached to the device. Returned only if the outputType is MEDIALIVE_INPUT.
     */
    MedialiveInputArns?: __listOf__string;
    /**
     * The output attachment type of the input device. Specifies MEDIACONNECT_FLOW if this device is the source for a MediaConnect flow. Specifies MEDIALIVE_INPUT if this device is the source for a MediaLive input.
     */
    OutputType?: InputDeviceOutputType;
  }
  export interface DescribeInputDeviceThumbnailRequest {
    /**
     * The unique ID of this input device. For example, hd-123456789abcdef.
     */
    InputDeviceId: __string;
    /**
     * The HTTP Accept header. Indicates the requested type for the thumbnail.
     */
    Accept: AcceptHeader;
  }
  export interface DescribeInputDeviceThumbnailResponse {
    /**
     * The binary data for the thumbnail that the Link device has most recently sent to MediaLive.
     */
    Body?: InputDeviceThumbnail;
    /**
     * Specifies the media type of the thumbnail.
     */
    ContentType?: ContentType;
    /**
     * The length of the content.
     */
    ContentLength?: __long;
    /**
     * The unique, cacheable version of this thumbnail.
     */
    ETag?: __string;
    /**
     * The date and time the thumbnail was last updated at the device.
     */
    LastModified?: __timestamp;
  }
  export interface DescribeInputRequest {
    /**
     * Unique ID of the input
     */
    InputId: __string;
  }
  export interface DescribeInputResponse {
    /**
     * The Unique ARN of the input (generated, immutable).
     */
    Arn?: __string;
    /**
     * A list of channel IDs that that input is attached to (currently an input can only be attached to one channel).
     */
    AttachedChannels?: __listOf__string;
    /**
     * A list of the destinations of the input (PUSH-type).
     */
    Destinations?: __listOfInputDestination;
    /**
     * The generated ID of the input (unique for user account, immutable).
     */
    Id?: __string;
    /**
     * STANDARD - MediaLive expects two sources to be connected to this input. If the channel is also STANDARD, both sources will be ingested. If the channel is SINGLE_PIPELINE, only the first source will be ingested; the second source will always be ignored, even if the first source fails.
SINGLE_PIPELINE - You can connect only one source to this input. If the ChannelClass is also  SINGLE_PIPELINE, this value is valid. If the ChannelClass is STANDARD, this value is not valid because the channel requires two sources in the input.

     */
    InputClass?: InputClass;
    /**
     * Settings for the input devices.
     */
    InputDevices?: __listOfInputDeviceSettings;
    /**
     * A list of IDs for all Inputs which are partners of this one.
     */
    InputPartnerIds?: __listOf__string;
    /**
     * Certain pull input sources can be dynamic, meaning that they can have their URL's dynamically changes
during input switch actions. Presently, this functionality only works with MP4_FILE and TS_FILE inputs.

     */
    InputSourceType?: InputSourceType;
    /**
     * A list of MediaConnect Flows for this input.
     */
    MediaConnectFlows?: __listOfMediaConnectFlow;
    /**
     * The user-assigned name (This is a mutable value).
     */
    Name?: __string;
    /**
     * The Amazon Resource Name (ARN) of the role this input assumes during and after creation.
     */
    RoleArn?: __string;
    /**
     * A list of IDs for all the Input Security Groups attached to the input.
     */
    SecurityGroups?: __listOf__string;
    /**
     * A list of the sources of the input (PULL-type).
     */
    Sources?: __listOfInputSource;
    State?: InputState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    Type?: InputType;
  }
  export interface DescribeInputSecurityGroupRequest {
    /**
     * The id of the Input Security Group to describe
     */
    InputSecurityGroupId: __string;
  }
  export interface DescribeInputSecurityGroupResponse {
    /**
     * Unique ARN of Input Security Group
     */
    Arn?: __string;
    /**
     * The Id of the Input Security Group
     */
    Id?: __string;
    /**
     * The list of inputs currently using this Input Security Group.
     */
    Inputs?: __listOf__string;
    /**
     * The current state of the Input Security Group.
     */
    State?: InputSecurityGroupState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    /**
     * Whitelist rules and their sync status
     */
    WhitelistRules?: __listOfInputWhitelistRule;
  }
  export interface DescribeMultiplexProgramRequest {
    /**
     * The ID of the multiplex that the program belongs to.
     */
    MultiplexId: __string;
    /**
     * The name of the program.
     */
    ProgramName: __string;
  }
  export interface DescribeMultiplexProgramResponse {
    /**
     * The MediaLive channel associated with the program.
     */
    ChannelId?: __string;
    /**
     * The settings for this multiplex program.
     */
    MultiplexProgramSettings?: MultiplexProgramSettings;
    /**
     * The packet identifier map for this multiplex program.
     */
    PacketIdentifiersMap?: MultiplexProgramPacketIdentifiersMap;
    /**
     * Contains information about the current sources for the specified program in the specified multiplex. Keep in mind that each multiplex pipeline connects to both pipelines in a given source channel (the channel identified by the program). But only one of those channel pipelines is ever active at one time.
     */
    PipelineDetails?: __listOfMultiplexProgramPipelineDetail;
    /**
     * The name of the multiplex program.
     */
    ProgramName?: __string;
  }
  export interface DescribeMultiplexRequest {
    /**
     * The ID of the multiplex.
     */
    MultiplexId: __string;
  }
  export interface DescribeMultiplexResponse {
    /**
     * The unique arn of the multiplex.
     */
    Arn?: __string;
    /**
     * A list of availability zones for the multiplex.
     */
    AvailabilityZones?: __listOf__string;
    /**
     * A list of the multiplex output destinations.
     */
    Destinations?: __listOfMultiplexOutputDestination;
    /**
     * The unique id of the multiplex.
     */
    Id?: __string;
    /**
     * Configuration for a multiplex event.
     */
    MultiplexSettings?: MultiplexSettings;
    /**
     * The name of the multiplex.
     */
    Name?: __string;
    /**
     * The number of currently healthy pipelines.
     */
    PipelinesRunningCount?: __integer;
    /**
     * The number of programs in the multiplex.
     */
    ProgramCount?: __integer;
    /**
     * The current state of the multiplex.
     */
    State?: MultiplexState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
  }
  export interface DescribeOfferingRequest {
    /**
     * Unique offering ID, e.g. '87654321'
     */
    OfferingId: __string;
  }
  export interface DescribeOfferingResponse {
    /**
     * Unique offering ARN, e.g. 'arn:aws:medialive:us-west-2:123456789012:offering:87654321'
     */
    Arn?: __string;
    /**
     * Currency code for usagePrice and fixedPrice in ISO-4217 format, e.g. 'USD'
     */
    CurrencyCode?: __string;
    /**
     * Lease duration, e.g. '12'
     */
    Duration?: __integer;
    /**
     * Units for duration, e.g. 'MONTHS'
     */
    DurationUnits?: OfferingDurationUnits;
    /**
     * One-time charge for each reserved resource, e.g. '0.0' for a NO_UPFRONT offering
     */
    FixedPrice?: __double;
    /**
     * Offering description, e.g. 'HD AVC output at 10-20 Mbps, 30 fps, and standard VQ in US West (Oregon)'
     */
    OfferingDescription?: __string;
    /**
     * Unique offering ID, e.g. '87654321'
     */
    OfferingId?: __string;
    /**
     * Offering type, e.g. 'NO_UPFRONT'
     */
    OfferingType?: OfferingType;
    /**
     * AWS region, e.g. 'us-west-2'
     */
    Region?: __string;
    /**
     * Resource configuration details
     */
    ResourceSpecification?: ReservationResourceSpecification;
    /**
     * Recurring usage charge for each reserved resource, e.g. '157.0'
     */
    UsagePrice?: __double;
  }
  export interface DescribeReservationRequest {
    /**
     * Unique reservation ID, e.g. '1234567'
     */
    ReservationId: __string;
  }
  export interface DescribeReservationResponse {
    /**
     * Unique reservation ARN, e.g. 'arn:aws:medialive:us-west-2:123456789012:reservation:1234567'
     */
    Arn?: __string;
    /**
     * Number of reserved resources
     */
    Count?: __integer;
    /**
     * Currency code for usagePrice and fixedPrice in ISO-4217 format, e.g. 'USD'
     */
    CurrencyCode?: __string;
    /**
     * Lease duration, e.g. '12'
     */
    Duration?: __integer;
    /**
     * Units for duration, e.g. 'MONTHS'
     */
    DurationUnits?: OfferingDurationUnits;
    /**
     * Reservation UTC end date and time in ISO-8601 format, e.g. '2019-03-01T00:00:00'
     */
    End?: __string;
    /**
     * One-time charge for each reserved resource, e.g. '0.0' for a NO_UPFRONT offering
     */
    FixedPrice?: __double;
    /**
     * User specified reservation name
     */
    Name?: __string;
    /**
     * Offering description, e.g. 'HD AVC output at 10-20 Mbps, 30 fps, and standard VQ in US West (Oregon)'
     */
    OfferingDescription?: __string;
    /**
     * Unique offering ID, e.g. '87654321'
     */
    OfferingId?: __string;
    /**
     * Offering type, e.g. 'NO_UPFRONT'
     */
    OfferingType?: OfferingType;
    /**
     * AWS region, e.g. 'us-west-2'
     */
    Region?: __string;
    /**
     * Renewal settings for the reservation
     */
    RenewalSettings?: RenewalSettings;
    /**
     * Unique reservation ID, e.g. '1234567'
     */
    ReservationId?: __string;
    /**
     * Resource configuration details
     */
    ResourceSpecification?: ReservationResourceSpecification;
    /**
     * Reservation UTC start date and time in ISO-8601 format, e.g. '2018-03-01T00:00:00'
     */
    Start?: __string;
    /**
     * Current state of reservation, e.g. 'ACTIVE'
     */
    State?: ReservationState;
    /**
     * A collection of key-value pairs
     */
    Tags?: Tags;
    /**
     * Recurring usage charge for each reserved resource, e.g. '157.0'
     */
    UsagePrice?: __double;
  }
  export interface DescribeScheduleRequest {
    /**
     * Id of the channel whose schedule is being updated.
     */
    ChannelId: __string;
    MaxResults?: MaxResults;
    NextToken?: __string;
  }
  export interface DescribeScheduleResponse {
    /**
     * The next token; for use in pagination.
     */
    NextToken?: __string;
    /**
     * The list of actions in the schedule.
     */
    ScheduleActions?: __listOfScheduleAction;
  }
  export type DeviceSettingsSyncState = "SYNCED"|"SYNCING"|string;
  export type DeviceUpdateStatus = "UP_TO_DATE"|"NOT_UP_TO_DATE"|"UPDATING"|string;
  export type DolbyEProgramSelection = "ALL_CHANNELS"|"PROGRAM_1"|"PROGRAM_2"|"PROGRAM_3"|"PROGRAM_4"|"PROGRAM_5"|"PROGRAM_6"|"PROGRAM_7"|"PROGRAM_8"|string;
  export interface DolbyVision81Settings {
  }
  export interface DvbNitSettings {
    /**
     * The numeric value placed in the Network Information Table (NIT).
     */
    NetworkId: __integerMin0Max65536;
    /**
     * The network name text placed in the networkNameDescriptor inside the Network Information Table. Maximum length is 256 characters.
     */
    NetworkName: __stringMin1Max256;
    /**
     * The number of milliseconds between instances of this table in the output transport stream.
     */
    RepInterval?: __integerMin25Max10000;
  }
  export type DvbSdtOutputSdt = "SDT_FOLLOW"|"SDT_FOLLOW_IF_PRESENT"|"SDT_MANUAL"|"SDT_NONE"|string;
  export interface DvbSdtSettings {
    /**
     * Selects method of inserting SDT information into output stream. The sdtFollow setting copies SDT information from input stream to output stream. The sdtFollowIfPresent setting copies SDT information from input stream to output stream if SDT information is present in the input, otherwise it will fall back on the user-defined values. The sdtManual setting means user will enter the SDT information. The sdtNone setting means output stream will not contain SDT information.
     */
    OutputSdt?: DvbSdtOutputSdt;
    /**
     * The number of milliseconds between instances of this table in the output transport stream.
     */
    RepInterval?: __integerMin25Max2000;
    /**
     * The service name placed in the serviceDescriptor in the Service Description Table. Maximum length is 256 characters.
     */
    ServiceName?: __stringMin1Max256;
    /**
     * The service provider name placed in the serviceDescriptor in the Service Description Table. Maximum length is 256 characters.
     */
    ServiceProviderName?: __stringMin1Max256;
  }
  export type DvbSubDestinationAlignment = "CENTERED"|"LEFT"|"SMART"|string;
  export type DvbSubDestinationBackgroundColor = "BLACK"|"NONE"|"WHITE"|string;
  export type DvbSubDestinationFontColor = "BLACK"|"BLUE"|"GREEN"|"RED"|"WHITE"|"YELLOW"|string;
  export type DvbSubDestinationOutlineColor = "BLACK"|"BLUE"|"GREEN"|"RED"|"WHITE"|"YELLOW"|string;
  export interface DvbSubDestinationSettings {
    /**
     * If no explicit xPosition or yPosition is provided, setting alignment to centered will place the captions at the bottom center of the output. Similarly, setting a left alignment will align captions to the bottom left of the output. If x and y positions are given in conjunction with the alignment parameter, the font will be justified (either left or centered) relative to those coordinates. Selecting "smart" justification will left-justify live subtitles and center-justify pre-recorded subtitles.  This option is not valid for source captions that are STL or 608/embedded.  These source settings are already pre-defined by the caption stream.  All burn-in and DVB-Sub font settings must match.
     */
    Alignment?: DvbSubDestinationAlignment;
    /**
     * Specifies the color of the rectangle behind the captions.  All burn-in and DVB-Sub font settings must match.
     */
    BackgroundColor?: DvbSubDestinationBackgroundColor;
    /**
     * Specifies the opacity of the background rectangle. 255 is opaque; 0 is transparent. Leaving this parameter blank is equivalent to setting it to 0 (transparent).  All burn-in and DVB-Sub font settings must match.
     */
    BackgroundOpacity?: __integerMin0Max255;
    /**
     * External font file used for caption burn-in. File extension must be 'ttf' or 'tte'.  Although the user can select output fonts for many different types of input captions, embedded, STL and teletext sources use a strict grid system. Using external fonts with these caption sources could cause unexpected display of proportional fonts.  All burn-in and DVB-Sub font settings must match.
     */
    Font?: InputLocation;
    /**
     * Specifies the color of the burned-in captions.  This option is not valid for source captions that are STL, 608/embedded or teletext.  These source settings are already pre-defined by the caption stream.  All burn-in and DVB-Sub font settings must match.
     */
    FontColor?: DvbSubDestinationFontColor;
    /**
     * Specifies the opacity of the burned-in captions. 255 is opaque; 0 is transparent.  All burn-in and DVB-Sub font settings must match.
     */
    FontOpacity?: __integerMin0Max255;
    /**
     * Font resolution in DPI (dots per inch); default is 96 dpi.  All burn-in and DVB-Sub font settings must match.
     */
    FontResolution?: __integerMin96Max600;
    /**
     * When set to auto fontSize will scale depending on the size of the output.  Giving a positive integer will specify the exact font size in points.  All burn-in and DVB-Sub font settings must match.
     */
    FontSize?: __string;
    /**
     * Specifies font outline color. This option is not valid for source captions that are either 608/embedded or teletext. These source settings are already pre-defined by the caption stream. All burn-in and DVB-Sub font settings must match.
     */
    OutlineColor?: DvbSubDestinationOutlineColor;
    /**
     * Specifies font outline size in pixels. This option is not valid for source captions that are either 608/embedded or teletext. These source settings are already pre-defined by the caption stream. All burn-in and DVB-Sub font settings must match.
     */
    OutlineSize?: __integerMin0Max10;
    /**
     * Specifies the color of the shadow cast by the captions.  All burn-in and DVB-Sub font settings must match.
     */
    ShadowColor?: DvbSubDestinationShadowColor;
    /**
     * Specifies the opacity of the shadow. 255 is opaque; 0 is transparent. Leaving this parameter blank is equivalent to setting it to 0 (transparent).  All burn-in and DVB-Sub font settings must match.
     */
    ShadowOpacity?: __integerMin0Max255;
    /**
     * Specifies the horizontal offset of the shadow relative to the captions in pixels. A value of -2 would result in a shadow offset 2 pixels to the left.  All burn-in and DVB-Sub font settings must match.
     */
    ShadowXOffset?: __integer;
    /**
     * Specifies the vertical offset of the shadow relative to the captions in pixels. A value of -2 would result in a shadow offset 2 pixels above the text.  All burn-in and DVB-Sub font settings must match.
     */
    ShadowYOffset?: __integer;
    /**
     * Controls whether a fixed grid size will be used to generate the output subtitles bitmap. Only applicable for Teletext inputs and DVB-Sub/Burn-in outputs.
     */
    TeletextGridControl?: DvbSubDestinationTeletextGridControl;
    /**
     * Specifies the horizontal position of the caption relative to the left side of the output in pixels. A value of 10 would result in the captions starting 10 pixels from the left of the output. If no explicit xPosition is provided, the horizontal caption position will be determined by the alignment parameter.  This option is not valid for source captions that are STL, 608/embedded or teletext. These source settings are already pre-defined by the caption stream.  All burn-in and DVB-Sub font settings must match.
     */
    XPosition?: __integerMin0;
    /**
     * Specifies the vertical position of the caption relative to the top of the output in pixels. A value of 10 would result in the captions starting 10 pixels from the top of the output. If no explicit yPosition is provided, the caption will be positioned towards the bottom of the output.  This option is not valid for source captions that are STL, 608/embedded or teletext.  These source settings are already pre-defined by the caption stream.  All burn-in and DVB-Sub font settings must match.
     */
    YPosition?: __integerMin0;
  }
  export type DvbSubDestinationShadowColor = "BLACK"|"NONE"|"WHITE"|string;
  export type DvbSubDestinationTeletextGridControl = "FIXED"|"SCALED"|string;
  export type DvbSubOcrLanguage = "DEU"|"ENG"|"FRA"|"NLD"|"POR"|"SPA"|string;
  export interface DvbSubSourceSettings {
    /**
     * If you will configure a WebVTT caption description that references this caption selector, use this field to
provide the language to consider when translating the image-based source to text.
     */
    OcrLanguage?: DvbSubOcrLanguage;
    /**
     * When using DVB-Sub with Burn-In or SMPTE-TT, use this PID for the source content. Unused for DVB-Sub passthrough. All DVB-Sub content is passed through, regardless of selectors.
     */
    Pid?: __integerMin1;
  }
  export interface DvbTdtSettings {
    /**
     * The number of milliseconds between instances of this table in the output transport stream.
     */
    RepInterval?: __integerMin1000Max30000;
  }
  export type Eac3AtmosCodingMode = "CODING_MODE_5_1_4"|"CODING_MODE_7_1_4"|"CODING_MODE_9_1_6"|string;
  export type Eac3AtmosDrcLine = "FILM_LIGHT"|"FILM_STANDARD"|"MUSIC_LIGHT"|"MUSIC_STANDARD"|"NONE"|"SPEECH"|string;
  export type Eac3AtmosDrcRf = "FILM_LIGHT"|"FILM_STANDARD"|"MUSIC_LIGHT"|"MUSIC_STANDARD"|"NONE"|"SPEECH"|string;
  export interface Eac3AtmosSettings {
    /**
     * Average bitrate in bits/second. Valid bitrates depend on the coding mode.
//  * @affectsRightSizing true
     */
    Bitrate?: __double;
    /**
     * Dolby Digital Plus with Dolby Atmos coding mode. Determines number of channels.
     */
    CodingMode?: Eac3AtmosCodingMode;
    /**
     * Sets the dialnorm for the output. Default 23.
     */
    Dialnorm?: __integerMin1Max31;
    /**
     * Sets the Dolby dynamic range compression profile.
     */
    DrcLine?: Eac3AtmosDrcLine;
    /**
     * Sets the profile for heavy Dolby dynamic range compression, ensures that the instantaneous signal peaks do not exceed specified levels.
     */
    DrcRf?: Eac3AtmosDrcRf;
    /**
     * Height dimensional trim. Sets the maximum amount to attenuate the height channels when the downstream player isn??t configured to handle Dolby Digital Plus with Dolby Atmos and must remix the channels.
     */
    HeightTrim?: __double;
    /**
     * Surround dimensional trim. Sets the maximum amount to attenuate the surround channels when the downstream player isn't configured to handle Dolby Digital Plus with Dolby Atmos and must remix the channels.
     */
    SurroundTrim?: __double;
  }
  export type Eac3AttenuationControl = "ATTENUATE_3_DB"|"NONE"|string;
  export type Eac3BitstreamMode = "COMMENTARY"|"COMPLETE_MAIN"|"EMERGENCY"|"HEARING_IMPAIRED"|"VISUALLY_IMPAIRED"|string;
  export type Eac3CodingMode = "CODING_MODE_1_0"|"CODING_MODE_2_0"|"CODING_MODE_3_2"|string;
  export type Eac3DcFilter = "DISABLED"|"ENABLED"|string;
  export type Eac3DrcLine = "FILM_LIGHT"|"FILM_STANDARD"|"MUSIC_LIGHT"|"MUSIC_STANDARD"|"NONE"|"SPEECH"|string;
  export type Eac3DrcRf = "FILM_LIGHT"|"FILM_STANDARD"|"MUSIC_LIGHT"|"MUSIC_STANDARD"|"NONE"|"SPEECH"|string;
  export type Eac3LfeControl = "LFE"|"NO_LFE"|string;
  export type Eac3LfeFilter = "DISABLED"|"ENABLED"|string;
  export type Eac3MetadataControl = "FOLLOW_INPUT"|"USE_CONFIGURED"|string;
  export type Eac3PassthroughControl = "NO_PASSTHROUGH"|"WHEN_POSSIBLE"|string;
  export type Eac3PhaseControl = "NO_SHIFT"|"SHIFT_90_DEGREES"|string;
  export interface Eac3Settings {
    /**
     * When set to attenuate3Db, applies a 3 dB attenuation to the surround channels. Only used for 3/2 coding mode.
     */
    AttenuationControl?: Eac3AttenuationControl;
    /**
     * Average bitrate in bits/second. Valid bitrates depend on the coding mode.
     */
    Bitrate?: __double;
    /**
     * Specifies the bitstream mode (bsmod) for the emitted E-AC-3 stream. See ATSC A/52-2012 (Annex E) for background on these values.
     */
    BitstreamMode?: Eac3BitstreamMode;
    /**
     * Dolby Digital Plus coding mode. Determines number of channels.
     */
    CodingMode?: Eac3CodingMode;
    /**
     * When set to enabled, activates a DC highpass filter for all input channels.
     */
    DcFilter?: Eac3DcFilter;
    /**
     * Sets the dialnorm for the output. If blank and input audio is Dolby Digital Plus, dialnorm will be passed through.
     */
    Dialnorm?: __integerMin1Max31;
    /**
     * Sets the Dolby dynamic range compression profile.
     */
    DrcLine?: Eac3DrcLine;
    /**
     * Sets the profile for heavy Dolby dynamic range compression, ensures that the instantaneous signal peaks do not exceed specified levels.
     */
    DrcRf?: Eac3DrcRf;
    /**
     * When encoding 3/2 audio, setting to lfe enables the LFE channel
     */
    LfeControl?: Eac3LfeControl;
    /**
     * When set to enabled, applies a 120Hz lowpass filter to the LFE channel prior to encoding. Only valid with codingMode32 coding mode.
     */
    LfeFilter?: Eac3LfeFilter;
    /**
     * Left only/Right only center mix level. Only used for 3/2 coding mode.
     */
    LoRoCenterMixLevel?: __double;
    /**
     * Left only/Right only surround mix level. Only used for 3/2 coding mode.
     */
    LoRoSurroundMixLevel?: __double;
    /**
     * Left total/Right total center mix level. Only used for 3/2 coding mode.
     */
    LtRtCenterMixLevel?: __double;
    /**
     * Left total/Right total surround mix level. Only used for 3/2 coding mode.
     */
    LtRtSurroundMixLevel?: __double;
    /**
     * When set to followInput, encoder metadata will be sourced from the DD, DD+, or DolbyE decoder that supplied this audio data. If audio was not supplied from one of these streams, then the static metadata settings will be used.
     */
    MetadataControl?: Eac3MetadataControl;
    /**
     * When set to whenPossible, input DD+ audio will be passed through if it is present on the input. This detection is dynamic over the life of the transcode. Inputs that alternate between DD+ and non-DD+ content will have a consistent DD+ output as the system alternates between passthrough and encoding.
     */
    PassthroughControl?: Eac3PassthroughControl;
    /**
     * When set to shift90Degrees, applies a 90-degree phase shift to the surround channels. Only used for 3/2 coding mode.
     */
    PhaseControl?: Eac3PhaseControl;
    /**
     * Stereo downmix preference. Only used for 3/2 coding mode.
     */
    StereoDownmix?: Eac3StereoDownmix;
    /**
     * When encoding 3/2 audio, sets whether an extra center back surround channel is matrix encoded into the left and right surround channels.
     */
    SurroundExMode?: Eac3SurroundExMode;
    /**
     * When encoding 2/0 audio, sets whether Dolby Surround is matrix encoded into the two channels.
     */
    SurroundMode?: Eac3SurroundMode;
  }
  export type Eac3StereoDownmix = "DPL2"|"LO_RO"|"LT_RT"|"NOT_INDICATED"|string;
  export type Eac3SurroundExMode = "DISABLED"|"ENABLED"|"NOT_INDICATED"|string;
  export type Eac3SurroundMode = "DISABLED"|"ENABLED"|"NOT_INDICATED"|string;
  export interface EbuTtDDestinationSettings {
    /**
     * Complete this field if you want to include the name of the copyright holder in the copyright tag in the captions metadata.
     */
    CopyrightHolder?: __stringMax1000;
    /**
     * Specifies how to handle the gap between the lines (in multi-line captions).

- enabled: Fill with the captions background color (as specified in the input captions).
- disabled: Leave the gap unfilled.
     */
    FillLineGap?: EbuTtDFillLineGapControl;
    /**
     * Specifies the font family to include in the font data attached to the EBU-TT captions. Valid only if styleControl is set to include. If you leave this field empty, the font family is set to "monospaced". (If styleControl is set to exclude, the font family is always set to "monospaced".)

You specify only the font family. All other style information (color, bold, position and so on) is copied from the input captions. The size is always set to 100% to allow the downstream player to choose the size.

- Enter a list of font families, as a comma-separated list of font names, in order of preference. The name can be a font family (such as “Arial”), or a generic font family (such as “serif”), or “default” (to let the downstream player choose the font).
- Leave blank to set the family to “monospace”.
     */
    FontFamily?: __string;
    /**
     * Specifies the style information (font color, font position, and so on) to include in the font data that is attached to the EBU-TT captions.

- include: Take the style information (font color, font position, and so on) from the source captions and include that information in the font data attached to the EBU-TT captions. This option is valid only if the source captions are Embedded or Teletext.
- exclude: In the font data attached to the EBU-TT captions, set the font family to "monospaced". Do not include any other style information.
     */
    StyleControl?: EbuTtDDestinationStyleControl;
  }
  export type EbuTtDDestinationStyleControl = "EXCLUDE"|"INCLUDE"|string;
  export type EbuTtDFillLineGapControl = "DISABLED"|"ENABLED"|string;
  export type EmbeddedConvert608To708 = "DISABLED"|"UPCONVERT"|string;
  export interface EmbeddedDestinationSettings {
  }
  export interface EmbeddedPlusScte20DestinationSettings {
  }
  export type EmbeddedScte20Detection = "AUTO"|"OFF"|string;
  export interface EmbeddedSourceSettings {
    /**
     * If upconvert, 608 data is both passed through via the "608 compatibility bytes" fields of the 708 wrapper as well as translated into 708. 708 data present in the source content will be discarded.
     */
    Convert608To708?: EmbeddedConvert608To708;
    /**
     * Set to "auto" to handle streams with intermittent and/or non-aligned SCTE-20 and Embedded captions.
     */
    Scte20Detection?: EmbeddedScte20Detection;
    /**
     * Specifies the 608/708 channel number within the video track from which to extract captions. Unused for passthrough.
     */
    Source608ChannelNumber?: __integerMin1Max4;
    /**
     * This field is unused and deprecated.
     */
    Source608TrackNumber?: __integerMin1Max5;
  }
  export interface EncoderSettings {
    AudioDescriptions: __listOfAudioDescription;
    /**
     * Settings for ad avail blanking.
     */
    AvailBlanking?: AvailBlanking;
    /**
     * Event-wide configuration settings for ad avail insertion.
     */
    AvailConfiguration?: AvailConfiguration;
    /**
     * Settings for blackout slate.
     */
    BlackoutSlate?: BlackoutSlate;
    /**
     * Settings for caption decriptions
     */
    CaptionDescriptions?: __listOfCaptionDescription;
    /**
     * Feature Activations
     */
    FeatureActivations?: FeatureActivations;
    /**
     * Configuration settings that apply to the event as a whole.
     */
    GlobalConfiguration?: GlobalConfiguration;
    /**
     * Settings for motion graphics.
     */
    MotionGraphicsConfiguration?: MotionGraphicsConfiguration;
    /**
     * Nielsen configuration settings.
     */
    NielsenConfiguration?: NielsenConfiguration;
    OutputGroups: __listOfOutputGroup;
    /**
     * Contains settings used to acquire and adjust timecode information from inputs.
     */
    TimecodeConfig: TimecodeConfig;
    VideoDescriptions: __listOfVideoDescription;
    /**
     * Thumbnail configuration settings.
     */
    ThumbnailConfiguration?: ThumbnailConfiguration;
  }
  export interface EpochLockingSettings {
    /**
     * Optional. Enter a value here to use a custom epoch, instead of the standard epoch (which started at 1970-01-01T00:00:00 UTC). Specify the start time of the custom epoch, in YYYY-MM-DDTHH:MM:SS in UTC. The time must be 2000-01-01T00:00:00 or later. Always set the MM:SS portion to 00:00.
     */
    CustomEpoch?: __string;
    /**
     * Optional. Enter a time for the jam sync. The default is midnight UTC. When epoch locking is enabled, MediaLive performs a daily jam sync on every output encode to ensure timecodes don’t diverge from the wall clock. The jam sync applies only to encodes with frame rate of 29.97 or 59.94 FPS. To override, enter a time in HH:MM:SS in UTC. Always set the MM:SS portion to 00:00.
     */
    JamSyncTime?: __string;
  }
  export interface Esam {
    /**
     * Sent as acquisitionPointIdentity to identify the MediaLive channel to the POIS.
     */
    AcquisitionPointId: __stringMax256;
    /**
     * When specified, this offset (in milliseconds) is added to the input Ad Avail PTS time. This only applies to embedded SCTE 104/35 messages and does not apply to OOB messages.
     */
    AdAvailOffset?: __integerMinNegative1000Max1000;
    /**
     * Documentation update needed
     */
    PasswordParam?: __string;
    /**
     * The URL of the signal conditioner endpoint on the Placement Opportunity Information System (POIS). MediaLive sends SignalProcessingEvents here when SCTE-35 messages are read.
     */
    PoisEndpoint: __stringMax2048;
    /**
     * Documentation update needed
     */
    Username?: __string;
    /**
     * Optional data sent as zoneIdentity to identify the MediaLive channel to the POIS.
     */
    ZoneIdentity?: __stringMax256;
  }
  export interface FailoverCondition {
    /**
     * Failover condition type-specific settings.
     */
    FailoverConditionSettings?: FailoverConditionSettings;
  }
  export interface FailoverConditionSettings {
    /**
     * MediaLive will perform a failover if the specified audio selector is silent for the specified period.
     */
    AudioSilenceSettings?: AudioSilenceFailoverSettings;
    /**
     * MediaLive will perform a failover if content is not detected in this input for the specified period.
     */
    InputLossSettings?: InputLossFailoverSettings;
    /**
     * MediaLive will perform a failover if content is considered black for the specified period.
     */
    VideoBlackSettings?: VideoBlackFailoverSettings;
  }
  export interface FeatureActivations {
    /**
     * Enables the Input Prepare feature. You can create Input Prepare actions in the schedule only if this feature is enabled.
If you disable the feature on an existing schedule, make sure that you first delete all input prepare actions from the schedule.
     */
    InputPrepareScheduleActions?: FeatureActivationsInputPrepareScheduleActions;
  }
  export type FeatureActivationsInputPrepareScheduleActions = "DISABLED"|"ENABLED"|string;
  export type FecOutputIncludeFec = "COLUMN"|"COLUMN_AND_ROW"|string;
  export interface FecOutputSettings {
    /**
     * Parameter D from SMPTE 2022-1. The height of the FEC protection matrix.  The number of transport stream packets per column error correction packet. Must be between 4 and 20, inclusive.
     */
    ColumnDepth?: __integerMin4Max20;
    /**
     * Enables column only or column and row based FEC
     */
    IncludeFec?: FecOutputIncludeFec;
    /**
     * Parameter L from SMPTE 2022-1. The width of the FEC protection matrix.  Must be between 1 and 20, inclusive. If only Column FEC is used, then larger values increase robustness.  If Row FEC is used, then this is the number of transport stream packets per row error correction packet, and the value must be between 4 and 20, inclusive, if includeFec is columnAndRow. If includeFec is column, this value must be 1 to 20, inclusive.
     */
    RowLength?: __integerMin1Max20;
  }
  export type FixedAfd = "AFD_0000"|"AFD_0010"|"AFD_0011"|"AFD_0100"|"AFD_1000"|"AFD_1001"|"AFD_1010"|"AFD_1011"|"AFD_1101"|"AFD_1110"|"AFD_1111"|string;
  export interface FixedModeScheduleActionStartSettings {
    /**
     * Start time for the action to start in the channel. (Not the time for the action to be added to the schedule: actions are always added to the schedule immediately.) UTC format: yyyy-mm-ddThh:mm:ss.nnnZ. All the letters are digits (for example, mm might be 01) except for the two constants "T" for time and "Z" for "UTC format".
     */
    Time: __string;
  }
  export interface Fmp4HlsSettings {
    /**
     * List all the audio groups that are used with the video output stream. Input all the audio GROUP-IDs that are associated to the video, separate by ','.
     */
    AudioRenditionSets?: __string;
    /**
     * If set to passthrough, Nielsen inaudible tones for media tracking will be detected in the input audio and an equivalent ID3 tag will be inserted in the output.
     */
    NielsenId3Behavior?: Fmp4NielsenId3Behavior;
    /**
     * When set to passthrough, timed metadata is passed through from input to output.
     */
    TimedMetadataBehavior?: Fmp4TimedMetadataBehavior;
  }
  export type Fmp4NielsenId3Behavior = "NO_PASSTHROUGH"|"PASSTHROUGH"|string;
  export type Fmp4TimedMetadataBehavior = "NO_PASSTHROUGH"|"PASSTHROUGH"|string;
  export interface FollowModeScheduleActionStartSettings {
    /**
     * Identifies whether this action starts relative to the start or relative to the end of the reference action.
     */
    FollowPoint: FollowPoint;
    /**
     * The action name of another action that this one refers to.
     */
    ReferenceActionName: __string;
  }
  export type FollowPoint = "END"|"START"|string;
  export interface FrameCaptureCdnSettings {
    FrameCaptureS3Settings?: FrameCaptureS3Settings;
  }
  export interface FrameCaptureGroupSettings {
    /**
     * The destination for the frame capture files. Either the URI for an Amazon S3 bucket and object, plus a file name prefix (for example, s3ssl://sportsDelivery/highlights/20180820/curling-) or the URI for a MediaStore container, plus a file name prefix (for example, mediastoressl://sportsDelivery/20180820/curling-). The final file names consist of the prefix from the destination field (for example, "curling-") + name modifier + the counter (5 digits, starting from 00001) + extension (which is always .jpg).  For example, curling-low.00001.jpg
     */
    Destination: OutputLocationRef;
    /**
     * Parameters that control interactions with the CDN.
     */
    FrameCaptureCdnSettings?: FrameCaptureCdnSettings;
  }
  export interface FrameCaptureHlsSettings {
  }
  export type FrameCaptureIntervalUnit = "MILLISECONDS"|"SECONDS"|string;
  export interface FrameCaptureOutputSettings {
    /**
     * Required if the output group contains more than one output. This modifier forms part of the output file name.
     */
    NameModifier?: __string;
  }
  export interface FrameCaptureS3Settings {
    /**
     * Specify the canned ACL to apply to each S3 request. Defaults to none.
     */
    CannedAcl?: S3CannedAcl;
  }
  export interface FrameCaptureSettings {
    /**
     * The frequency at which to capture frames for inclusion in the output. May be specified in either seconds or milliseconds, as specified by captureIntervalUnits.
     */
    CaptureInterval?: __integerMin1Max3600000;
    /**
     * Unit for the frame capture interval.
     */
    CaptureIntervalUnits?: FrameCaptureIntervalUnit;
    /**
     * Timecode burn-in settings
     */
    TimecodeBurninSettings?: TimecodeBurninSettings;
  }
  export interface DescribeAccountConfigurationRequest {
  }
  export interface DescribeAccountConfigurationResponse {
    AccountConfiguration?: AccountConfiguration;
  }
  export interface DescribeThumbnailsRequest {
    /**
     * Unique ID of the channel
     */
    ChannelId: __string;
    /**
     * Pipeline ID ("0" or "1")
     */
    PipelineId: __string;
    /**
     * thumbnail type
     */
    ThumbnailType: __string;
  }
  export interface DescribeThumbnailsResponse {
    ThumbnailDetails?: __listOfThumbnailDetail;
  }
  export interface GlobalConfiguration {
    /**
     * Value to set the initial audio gain for the Live Event.
     */
    InitialAudioGain?: __integerMinNegative60Max60;
    /**
     * Indicates the action to take when the current input completes (e.g. end-of-file). When switchAndLoopInputs is configured the encoder will restart at the beginning of the first input.  When "none" is configured the encoder will transcode either black, a solid color, or a user specified slate images per the "Input Loss Behavior" configuration until the next input switch occurs (which is controlled through the Channel Schedule API).
     */
    InputEndAction?: GlobalConfigurationInputEndAction;
    /**
     * Settings for system actions when input is lost.
     */
    InputLossBehavior?: InputLossBehavior;
    /**
     * Indicates how MediaLive pipelines are synchronized.

PIPELINE_LOCKING - MediaLive will attempt to synchronize the output of each pipeline to the other.
EPOCH_LOCKING - MediaLive will attempt to synchronize the output of each pipeline to the Unix epoch.
     */
    OutputLockingMode?: GlobalConfigurationOutputLockingMode;
    /**
     * Indicates whether the rate of frames emitted by the Live encoder should be paced by its system clock (which optionally may be locked to another source via NTP) or should be locked to the clock of the source that is providing the input stream.
     */
    OutputTimingSource?: GlobalConfigurationOutputTimingSource;
    /**
     * Adjusts video input buffer for streams with very low video framerates. This is commonly set to enabled for music channels with less than one video frame per second.
     */
    SupportLowFramerateInputs?: GlobalConfigurationLowFramerateInputs;
    /**
     * Advanced output locking settings
     */
    OutputLockingSettings?: OutputLockingSettings;
  }
  export type GlobalConfigurationInputEndAction = "NONE"|"SWITCH_AND_LOOP_INPUTS"|string;
  export type GlobalConfigurationLowFramerateInputs = "DISABLED"|"ENABLED"|string;
  export type GlobalConfigurationOutputLockingMode = "EPOCH_LOCKING"|"PIPELINE_LOCKING"|string;
  export type GlobalConfigurationOutputTimingSource = "INPUT_CLOCK"|"SYSTEM_CLOCK"|string;
  export type H264AdaptiveQuantization = "AUTO"|"HIGH"|"HIGHER"|"LOW"|"MAX"|"MEDIUM"|"OFF"|string;
  export type H264ColorMetadata = "IGNORE"|"INSERT"|string;
  export interface H264ColorSpaceSettings {
    ColorSpacePassthroughSettings?: ColorSpacePassthroughSettings;
    Rec601Settings?: Rec601Settings;
    Rec709Settings?: Rec709Settings;
  }
  export type H264EntropyEncoding = "CABAC"|"CAVLC"|string;
  export interface H264FilterSettings {
    TemporalFilterSettings?: TemporalFilterSettings;
  }
  export type H264FlickerAq = "DISABLED"|"ENABLED"|string;
  export type H264ForceFieldPictures = "DISABLED"|"ENABLED"|string;
  export type H264FramerateControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type H264GopBReference = "DISABLED"|"ENABLED"|string;
  export type H264GopSizeUnits = "FRAMES"|"SECONDS"|string;
  export type H264Level = "H264_LEVEL_1"|"H264_LEVEL_1_1"|"H264_LEVEL_1_2"|"H264_LEVEL_1_3"|"H264_LEVEL_2"|"H264_LEVEL_2_1"|"H264_LEVEL_2_2"|"H264_LEVEL_3"|"H264_LEVEL_3_1"|"H264_LEVEL_3_2"|"H264_LEVEL_4"|"H264_LEVEL_4_1"|"H264_LEVEL_4_2"|"H264_LEVEL_5"|"H264_LEVEL_5_1"|"H264_LEVEL_5_2"|"H264_LEVEL_AUTO"|string;
  export type H264LookAheadRateControl = "HIGH"|"LOW"|"MEDIUM"|string;
  export type H264ParControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type H264Profile = "BASELINE"|"HIGH"|"HIGH_10BIT"|"HIGH_422"|"HIGH_422_10BIT"|"MAIN"|string;
  export type H264QualityLevel = "ENHANCED_QUALITY"|"STANDARD_QUALITY"|string;
  export type H264RateControlMode = "CBR"|"MULTIPLEX"|"QVBR"|"VBR"|string;
  export type H264ScanType = "INTERLACED"|"PROGRESSIVE"|string;
  export type H264SceneChangeDetect = "DISABLED"|"ENABLED"|string;
  export interface H264Settings {
    /**
     * Enables or disables adaptive quantization, which is a technique MediaLive can apply to video on a frame-by-frame basis to produce more compression without losing quality. There are three types of adaptive quantization: flicker, spatial, and temporal. Set the field in one of these ways: Set to Auto. Recommended. For each type of AQ, MediaLive will determine if AQ is needed, and if so, the appropriate strength. Set a strength (a value other than Auto or Disable). This strength will apply to any of the AQ fields that you choose to enable. Set to Disabled to disable all types of adaptive quantization.
     */
    AdaptiveQuantization?: H264AdaptiveQuantization;
    /**
     * Indicates that AFD values will be written into the output stream.  If afdSignaling is "auto", the system will try to preserve the input AFD value (in cases where multiple AFD values are valid). If set to "fixed", the AFD value will be the value configured in the fixedAfd parameter.
     */
    AfdSignaling?: AfdSignaling;
    /**
     * Average bitrate in bits/second. Required when the rate control mode is VBR or CBR. Not used for QVBR. In an MS Smooth output group, each output must have a unique value when its bitrate is rounded down to the nearest multiple of 1000.
     */
    Bitrate?: __integerMin1000;
    /**
     * Percentage of the buffer that should initially be filled (HRD buffer model).
     */
    BufFillPct?: __integerMin0Max100;
    /**
     * Size of buffer (HRD buffer model) in bits.
     */
    BufSize?: __integerMin0;
    /**
     * Includes colorspace metadata in the output.
     */
    ColorMetadata?: H264ColorMetadata;
    /**
     * Color Space settings
     */
    ColorSpaceSettings?: H264ColorSpaceSettings;
    /**
     * Entropy encoding mode.  Use cabac (must be in Main or High profile) or cavlc.
     */
    EntropyEncoding?: H264EntropyEncoding;
    /**
     * Optional filters that you can apply to an encode.
     */
    FilterSettings?: H264FilterSettings;
    /**
     * Four bit AFD value to write on all frames of video in the output stream. Only valid when afdSignaling is set to 'Fixed'.
     */
    FixedAfd?: FixedAfd;
    /**
     * Flicker AQ makes adjustments within each frame to reduce flicker or 'pop' on I-frames. The value to enter in this field depends on the value in the Adaptive quantization field: If you have set the Adaptive quantization field to Auto, MediaLive ignores any value in this field. MediaLive will determine if flicker AQ is appropriate and will apply the appropriate strength. If you have set the Adaptive quantization field to a strength, you can set this field to Enabled or Disabled. Enabled: MediaLive will apply flicker AQ using the specified strength. Disabled: MediaLive won't apply flicker AQ. If you have set the Adaptive quantization to Disabled, MediaLive ignores any value in this field and doesn't apply flicker AQ.
     */
    FlickerAq?: H264FlickerAq;
    /**
     * This setting applies only when scan type is "interlaced." It controls whether coding is performed on a field basis or on a frame basis. (When the video is progressive, the coding is always performed on a frame basis.)
enabled: Force MediaLive to code on a field basis, so that odd and even sets of fields are coded separately.
disabled: Code the two sets of fields separately (on a field basis) or together (on a frame basis using PAFF), depending on what is most appropriate for the content.
     */
    ForceFieldPictures?: H264ForceFieldPictures;
    /**
     * This field indicates how the output video frame rate is specified.  If "specified" is selected then the output video frame rate is determined by framerateNumerator and framerateDenominator, else if "initializeFromSource" is selected then the output video frame rate will be set equal to the input video frame rate of the first input.
     */
    FramerateControl?: H264FramerateControl;
    /**
     * Framerate denominator.
     */
    FramerateDenominator?: __integerMin1;
    /**
     * Framerate numerator - framerate is a fraction, e.g. 24000 / 1001 = 23.976 fps.
     */
    FramerateNumerator?: __integerMin1;
    /**
     * Documentation update needed
     */
    GopBReference?: H264GopBReference;
    /**
     * Frequency of closed GOPs. In streaming applications, it is recommended that this be set to 1 so a decoder joining mid-stream will receive an IDR frame as quickly as possible. Setting this value to 0 will break output segmenting.
     */
    GopClosedCadence?: __integerMin0;
    /**
     * Number of B-frames between reference frames.
     */
    GopNumBFrames?: __integerMin0Max7;
    /**
     * GOP size (keyframe interval) in units of either frames or seconds per gopSizeUnits.
If gopSizeUnits is frames, gopSize must be an integer and must be greater than or equal to 1.
If gopSizeUnits is seconds, gopSize must be greater than 0, but need not be an integer.
     */
    GopSize?: __double;
    /**
     * Indicates if the gopSize is specified in frames or seconds. If seconds the system will convert the gopSize into a frame count at run time.
     */
    GopSizeUnits?: H264GopSizeUnits;
    /**
     * H.264 Level.
     */
    Level?: H264Level;
    /**
     * Amount of lookahead. A value of low can decrease latency and memory usage, while high can produce better quality for certain content.
     */
    LookAheadRateControl?: H264LookAheadRateControl;
    /**
     * For QVBR: See the tooltip for Quality level

For VBR: Set the maximum bitrate in order to accommodate expected spikes in the complexity of the video.
     */
    MaxBitrate?: __integerMin1000;
    /**
     * Only meaningful if sceneChangeDetect is set to enabled.  Defaults to 5 if multiplex rate control is used.  Enforces separation between repeated (cadence) I-frames and I-frames inserted by Scene Change Detection. If a scene change I-frame is within I-interval frames of a cadence I-frame, the GOP is shrunk and/or stretched to the scene change I-frame. GOP stretch requires enabling lookahead as well as setting I-interval. The normal cadence resumes for the next GOP. Note: Maximum GOP stretch = GOP size + Min-I-interval - 1
     */
    MinIInterval?: __integerMin0Max30;
    /**
     * Number of reference frames to use. The encoder may use more than requested if using B-frames and/or interlaced encoding.
     */
    NumRefFrames?: __integerMin1Max6;
    /**
     * This field indicates how the output pixel aspect ratio is specified.  If "specified" is selected then the output video pixel aspect ratio is determined by parNumerator and parDenominator, else if "initializeFromSource" is selected then the output pixsel aspect ratio will be set equal to the input video pixel aspect ratio of the first input.
     */
    ParControl?: H264ParControl;
    /**
     * Pixel Aspect Ratio denominator.
     */
    ParDenominator?: __integerMin1;
    /**
     * Pixel Aspect Ratio numerator.
     */
    ParNumerator?: __integerMin1;
    /**
     * H.264 Profile.
     */
    Profile?: H264Profile;
    /**
     * Leave as STANDARD_QUALITY or choose a different value (which might result in additional costs to run the channel).
- ENHANCED_QUALITY: Produces a slightly better video quality without an increase in the bitrate. Has an effect only when the Rate control mode is QVBR or CBR. If this channel is in a MediaLive multiplex, the value must be ENHANCED_QUALITY.
- STANDARD_QUALITY: Valid for any Rate control mode.
     */
    QualityLevel?: H264QualityLevel;
    /**
     * Controls the target quality for the video encode. Applies only when the rate control mode is QVBR. You can set a target quality or you can let MediaLive determine the best quality. To set a target quality, enter values in the QVBR quality level field and the Max bitrate field. Enter values that suit your most important viewing devices. Recommended values are:
- Primary screen: Quality level: 8 to 10. Max bitrate: 4M
- PC or tablet: Quality level: 7. Max bitrate: 1.5M to 3M
- Smartphone: Quality level: 6. Max bitrate: 1M to 1.5M
To let MediaLive decide, leave the QVBR quality level field empty, and in Max bitrate enter the maximum rate you want in the video. For more information, see the section called "Video - rate control mode" in the MediaLive user guide
     */
    QvbrQualityLevel?: __integerMin1Max10;
    /**
     * Rate control mode.

QVBR: Quality will match the specified quality level except when it is constrained by the
maximum bitrate.  Recommended if you or your viewers pay for bandwidth.

VBR: Quality and bitrate vary, depending on the video complexity. Recommended instead of QVBR
if you want to maintain a specific average bitrate over the duration of the channel.

CBR: Quality varies, depending on the video complexity. Recommended only if you distribute
your assets to devices that cannot handle variable bitrates.

Multiplex: This rate control mode is only supported (and is required) when the video is being
delivered to a MediaLive Multiplex in which case the rate control configuration is controlled
by the properties within the Multiplex Program.
     */
    RateControlMode?: H264RateControlMode;
    /**
     * Sets the scan type of the output to progressive or top-field-first interlaced.
     */
    ScanType?: H264ScanType;
    /**
     * Scene change detection.

- On: inserts I-frames when scene change is detected.
- Off: does not force an I-frame when scene change is detected.
     */
    SceneChangeDetect?: H264SceneChangeDetect;
    /**
     * Number of slices per picture. Must be less than or equal to the number of macroblock rows for progressive pictures, and less than or equal to half the number of macroblock rows for interlaced pictures.
This field is optional; when no value is specified the encoder will choose the number of slices based on encode resolution.
     */
    Slices?: __integerMin1Max32;
    /**
     * Softness. Selects quantizer matrix, larger values reduce high-frequency content in the encoded image.  If not set to zero, must be greater than 15.
     */
    Softness?: __integerMin0Max128;
    /**
     * Spatial AQ makes adjustments within each frame based on spatial variation of content complexity. The value to enter in this field depends on the value in the Adaptive quantization field: If you have set the Adaptive quantization field to Auto, MediaLive ignores any value in this field. MediaLive will determine if spatial AQ is appropriate and will apply the appropriate strength. If you have set the Adaptive quantization field to a strength, you can set this field to Enabled or Disabled. Enabled: MediaLive will apply spatial AQ using the specified strength. Disabled: MediaLive won't apply spatial AQ. If you have set the Adaptive quantization to Disabled, MediaLive ignores any value in this field and doesn't apply spatial AQ.
     */
    SpatialAq?: H264SpatialAq;
    /**
     * If set to fixed, use gopNumBFrames B-frames per sub-GOP. If set to dynamic, optimize the number of B-frames used for each sub-GOP to improve visual quality.
     */
    SubgopLength?: H264SubGopLength;
    /**
     * Produces a bitstream compliant with SMPTE RP-2027.
     */
    Syntax?: H264Syntax;
    /**
     * Temporal makes adjustments within each frame based on temporal variation of content complexity. The value to enter in this field depends on the value in the Adaptive quantization field: If you have set the Adaptive quantization field to Auto, MediaLive ignores any value in this field. MediaLive will determine if temporal AQ is appropriate and will apply the appropriate strength. If you have set the Adaptive quantization field to a strength, you can set this field to Enabled or Disabled. Enabled: MediaLive will apply temporal AQ using the specified strength. Disabled: MediaLive won't apply temporal AQ. If you have set the Adaptive quantization to Disabled, MediaLive ignores any value in this field and doesn't apply temporal AQ.
     */
    TemporalAq?: H264TemporalAq;
    /**
     * Determines how timecodes should be inserted into the video elementary stream.
- 'disabled': Do not include timecodes
- 'picTimingSei': Pass through picture timing SEI messages from the source specified in Timecode Config
     */
    TimecodeInsertion?: H264TimecodeInsertionBehavior;
    /**
     * Timecode burn-in settings
     */
    TimecodeBurninSettings?: TimecodeBurninSettings;
  }
  export type H264SpatialAq = "DISABLED"|"ENABLED"|string;
  export type H264SubGopLength = "DYNAMIC"|"FIXED"|string;
  export type H264Syntax = "DEFAULT"|"RP2027"|string;
  export type H264TemporalAq = "DISABLED"|"ENABLED"|string;
  export type H264TimecodeInsertionBehavior = "DISABLED"|"PIC_TIMING_SEI"|string;
  export type H265AdaptiveQuantization = "AUTO"|"HIGH"|"HIGHER"|"LOW"|"MAX"|"MEDIUM"|"OFF"|string;
  export type H265AlternativeTransferFunction = "INSERT"|"OMIT"|string;
  export type H265ColorMetadata = "IGNORE"|"INSERT"|string;
  export interface H265ColorSpaceSettings {
    ColorSpacePassthroughSettings?: ColorSpacePassthroughSettings;
    DolbyVision81Settings?: DolbyVision81Settings;
    Hdr10Settings?: Hdr10Settings;
    Rec601Settings?: Rec601Settings;
    Rec709Settings?: Rec709Settings;
  }
  export interface H265FilterSettings {
    TemporalFilterSettings?: TemporalFilterSettings;
  }
  export type H265FlickerAq = "DISABLED"|"ENABLED"|string;
  export type H265GopSizeUnits = "FRAMES"|"SECONDS"|string;
  export type H265Level = "H265_LEVEL_1"|"H265_LEVEL_2"|"H265_LEVEL_2_1"|"H265_LEVEL_3"|"H265_LEVEL_3_1"|"H265_LEVEL_4"|"H265_LEVEL_4_1"|"H265_LEVEL_5"|"H265_LEVEL_5_1"|"H265_LEVEL_5_2"|"H265_LEVEL_6"|"H265_LEVEL_6_1"|"H265_LEVEL_6_2"|"H265_LEVEL_AUTO"|string;
  export type H265LookAheadRateControl = "HIGH"|"LOW"|"MEDIUM"|string;
  export type H265Profile = "MAIN"|"MAIN_10BIT"|string;
  export type H265RateControlMode = "CBR"|"MULTIPLEX"|"QVBR"|string;
  export type H265ScanType = "INTERLACED"|"PROGRESSIVE"|string;
  export type H265SceneChangeDetect = "DISABLED"|"ENABLED"|string;
  export interface H265Settings {
    /**
     * Adaptive quantization. Allows intra-frame quantizers to vary to improve visual quality.
     */
    AdaptiveQuantization?: H265AdaptiveQuantization;
    /**
     * Indicates that AFD values will be written into the output stream.  If afdSignaling is "auto", the system will try to preserve the input AFD value (in cases where multiple AFD values are valid). If set to "fixed", the AFD value will be the value configured in the fixedAfd parameter.
     */
    AfdSignaling?: AfdSignaling;
    /**
     * Whether or not EML should insert an Alternative Transfer Function SEI message to support backwards compatibility with non-HDR decoders and displays.
     */
    AlternativeTransferFunction?: H265AlternativeTransferFunction;
    /**
     * Average bitrate in bits/second. Required when the rate control mode is VBR or CBR. Not used for QVBR. In an MS Smooth output group, each output must have a unique value when its bitrate is rounded down to the nearest multiple of 1000.
     */
    Bitrate?: __integerMin100000Max40000000;
    /**
     * Size of buffer (HRD buffer model) in bits.
     */
    BufSize?: __integerMin100000Max80000000;
    /**
     * Includes colorspace metadata in the output.
     */
    ColorMetadata?: H265ColorMetadata;
    /**
     * Color Space settings
     */
    ColorSpaceSettings?: H265ColorSpaceSettings;
    /**
     * Optional filters that you can apply to an encode.
     */
    FilterSettings?: H265FilterSettings;
    /**
     * Four bit AFD value to write on all frames of video in the output stream. Only valid when afdSignaling is set to 'Fixed'.
     */
    FixedAfd?: FixedAfd;
    /**
     * If set to enabled, adjust quantization within each frame to reduce flicker or 'pop' on I-frames.
     */
    FlickerAq?: H265FlickerAq;
    /**
     * Framerate denominator.
     */
    FramerateDenominator: __integerMin1Max3003;
    /**
     * Framerate numerator - framerate is a fraction, e.g. 24000 / 1001 = 23.976 fps.
     */
    FramerateNumerator: __integerMin1;
    /**
     * Frequency of closed GOPs. In streaming applications, it is recommended that this be set to 1 so a decoder joining mid-stream will receive an IDR frame as quickly as possible. Setting this value to 0 will break output segmenting.
     */
    GopClosedCadence?: __integerMin0;
    /**
     * GOP size (keyframe interval) in units of either frames or seconds per gopSizeUnits.
If gopSizeUnits is frames, gopSize must be an integer and must be greater than or equal to 1.
If gopSizeUnits is seconds, gopSize must be greater than 0, but need not be an integer.
     */
    GopSize?: __double;
    /**
     * Indicates if the gopSize is specified in frames or seconds. If seconds the system will convert the gopSize into a frame count at run time.
     */
    GopSizeUnits?: H265GopSizeUnits;
    /**
     * H.265 Level.
     */
    Level?: H265Level;
    /**
     * Amount of lookahead. A value of low can decrease latency and memory usage, while high can produce better quality for certain content.
     */
    LookAheadRateControl?: H265LookAheadRateControl;
    /**
     * For QVBR: See the tooltip for Quality level
     */
    MaxBitrate?: __integerMin100000Max40000000;
    /**
     * Only meaningful if sceneChangeDetect is set to enabled.  Defaults to 5 if multiplex rate control is used.  Enforces separation between repeated (cadence) I-frames and I-frames inserted by Scene Change Detection. If a scene change I-frame is within I-interval frames of a cadence I-frame, the GOP is shrunk and/or stretched to the scene change I-frame. GOP stretch requires enabling lookahead as well as setting I-interval. The normal cadence resumes for the next GOP. Note: Maximum GOP stretch = GOP size + Min-I-interval - 1
     */
    MinIInterval?: __integerMin0Max30;
    /**
     * Pixel Aspect Ratio denominator.
     */
    ParDenominator?: __integerMin1;
    /**
     * Pixel Aspect Ratio numerator.
     */
    ParNumerator?: __integerMin1;
    /**
     * H.265 Profile.
     */
    Profile?: H265Profile;
    /**
     * Controls the target quality for the video encode. Applies only when the rate control mode is QVBR. Set values for the QVBR quality level field and Max bitrate field that suit your most important viewing devices. Recommended values are:
- Primary screen: Quality level: 8 to 10. Max bitrate: 4M
- PC or tablet: Quality level: 7. Max bitrate: 1.5M to 3M
- Smartphone: Quality level: 6. Max bitrate: 1M to 1.5M
     */
    QvbrQualityLevel?: __integerMin1Max10;
    /**
     * Rate control mode.

QVBR: Quality will match the specified quality level except when it is constrained by the
maximum bitrate.  Recommended if you or your viewers pay for bandwidth.

CBR: Quality varies, depending on the video complexity. Recommended only if you distribute
your assets to devices that cannot handle variable bitrates.

Multiplex: This rate control mode is only supported (and is required) when the video is being
delivered to a MediaLive Multiplex in which case the rate control configuration is controlled
by the properties within the Multiplex Program.
     */
    RateControlMode?: H265RateControlMode;
    /**
     * Sets the scan type of the output to progressive or top-field-first interlaced.
     */
    ScanType?: H265ScanType;
    /**
     * Scene change detection.
     */
    SceneChangeDetect?: H265SceneChangeDetect;
    /**
     * Number of slices per picture. Must be less than or equal to the number of macroblock rows for progressive pictures, and less than or equal to half the number of macroblock rows for interlaced pictures.
This field is optional; when no value is specified the encoder will choose the number of slices based on encode resolution.
     */
    Slices?: __integerMin1Max16;
    /**
     * H.265 Tier.
     */
    Tier?: H265Tier;
    /**
     * Determines how timecodes should be inserted into the video elementary stream.
- 'disabled': Do not include timecodes
- 'picTimingSei': Pass through picture timing SEI messages from the source specified in Timecode Config
     */
    TimecodeInsertion?: H265TimecodeInsertionBehavior;
    /**
     * Timecode burn-in settings
     */
    TimecodeBurninSettings?: TimecodeBurninSettings;
  }
  export type H265Tier = "HIGH"|"MAIN"|string;
  export type H265TimecodeInsertionBehavior = "DISABLED"|"PIC_TIMING_SEI"|string;
  export interface Hdr10Settings {
    /**
     * Maximum Content Light Level
An integer metadata value defining the maximum light level, in nits,
of any single pixel within an encoded HDR video stream or file.
     */
    MaxCll?: __integerMin0Max32768;
    /**
     * Maximum Frame Average Light Level
An integer metadata value defining the maximum average light level, in nits,
for any single frame within an encoded HDR video stream or file.
     */
    MaxFall?: __integerMin0Max32768;
  }
  export type HlsAdMarkers = "ADOBE"|"ELEMENTAL"|"ELEMENTAL_SCTE35"|string;
  export type HlsAkamaiHttpTransferMode = "CHUNKED"|"NON_CHUNKED"|string;
  export interface HlsAkamaiSettings {
    /**
     * Number of seconds to wait before retrying connection to the CDN if the connection is lost.
     */
    ConnectionRetryInterval?: __integerMin0;
    /**
     * Size in seconds of file cache for streaming outputs.
     */
    FilecacheDuration?: __integerMin0Max600;
    /**
     * Specify whether or not to use chunked transfer encoding to Akamai. User should contact Akamai to enable this feature.
     */
    HttpTransferMode?: HlsAkamaiHttpTransferMode;
    /**
     * Number of retry attempts that will be made before the Live Event is put into an error state. Applies only if the CDN destination URI begins with "s3" or "mediastore". For other URIs, the value is always 3.
     */
    NumRetries?: __integerMin0;
    /**
     * If a streaming output fails, number of seconds to wait until a restart is initiated. A value of 0 means never restart.
     */
    RestartDelay?: __integerMin0Max15;
    /**
     * Salt for authenticated Akamai.
     */
    Salt?: __string;
    /**
     * Token parameter for authenticated akamai. If not specified, _gda_ is used.
     */
    Token?: __string;
  }
  export interface HlsBasicPutSettings {
    /**
     * Number of seconds to wait before retrying connection to the CDN if the connection is lost.
     */
    ConnectionRetryInterval?: __integerMin0;
    /**
     * Size in seconds of file cache for streaming outputs.
     */
    FilecacheDuration?: __integerMin0Max600;
    /**
     * Number of retry attempts that will be made before the Live Event is put into an error state. Applies only if the CDN destination URI begins with "s3" or "mediastore". For other URIs, the value is always 3.
     */
    NumRetries?: __integerMin0;
    /**
     * If a streaming output fails, number of seconds to wait until a restart is initiated. A value of 0 means never restart.
     */
    RestartDelay?: __integerMin0Max15;
  }
  export type HlsCaptionLanguageSetting = "INSERT"|"NONE"|"OMIT"|string;
  export interface HlsCdnSettings {
    HlsAkamaiSettings?: HlsAkamaiSettings;
    HlsBasicPutSettings?: HlsBasicPutSettings;
    HlsMediaStoreSettings?: HlsMediaStoreSettings;
    HlsS3Settings?: HlsS3Settings;
    HlsWebdavSettings?: HlsWebdavSettings;
  }
  export type HlsClientCache = "DISABLED"|"ENABLED"|string;
  export type HlsCodecSpecification = "RFC_4281"|"RFC_6381"|string;
  export type HlsDirectoryStructure = "SINGLE_DIRECTORY"|"SUBDIRECTORY_PER_STREAM"|string;
  export type HlsDiscontinuityTags = "INSERT"|"NEVER_INSERT"|string;
  export type HlsEncryptionType = "AES128"|"SAMPLE_AES"|string;
  export interface HlsGroupSettings {
    /**
     * Choose one or more ad marker types to pass SCTE35 signals through to this group of Apple HLS outputs.
     */
    AdMarkers?: __listOfHlsAdMarkers;
    /**
     * A partial URI prefix that will be prepended to each output in the media .m3u8 file. Can be used if base manifest is delivered from a different URL than the main .m3u8 file.
     */
    BaseUrlContent?: __string;
    /**
     * Optional. One value per output group.

This field is required only if you are completing Base URL content A, and the downstream system has notified you that the media files for pipeline 1 of all outputs are in a location different from the media files for pipeline 0.
     */
    BaseUrlContent1?: __string;
    /**
     * A partial URI prefix that will be prepended to each output in the media .m3u8 file. Can be used if base manifest is delivered from a different URL than the main .m3u8 file.
     */
    BaseUrlManifest?: __string;
    /**
     * Optional. One value per output group.

Complete this field only if you are completing Base URL manifest A, and the downstream system has notified you that the child manifest files for pipeline 1 of all outputs are in a location different from the child manifest files for pipeline 0.
     */
    BaseUrlManifest1?: __string;
    /**
     * Mapping of up to 4 caption channels to caption languages.  Is only meaningful if captionLanguageSetting is set to "insert".
     */
    CaptionLanguageMappings?: __listOfCaptionLanguageMapping;
    /**
     * Applies only to 608 Embedded output captions.
insert: Include CLOSED-CAPTIONS lines in the manifest. Specify at least one language in the CC1 Language Code field. One CLOSED-CAPTION line is added for each Language Code you specify. Make sure to specify the languages in the order in which they appear in the original source (if the source is embedded format) or the order of the caption selectors (if the source is other than embedded). Otherwise, languages in the manifest will not match up properly with the output captions.
none: Include CLOSED-CAPTIONS=NONE line in the manifest.
omit: Omit any CLOSED-CAPTIONS line from the manifest.
     */
    CaptionLanguageSetting?: HlsCaptionLanguageSetting;
    /**
     * When set to "disabled", sets the #EXT-X-ALLOW-CACHE:no tag in the manifest, which prevents clients from saving media segments for later replay.
     */
    ClientCache?: HlsClientCache;
    /**
     * Specification to use (RFC-6381 or the default RFC-4281) during m3u8 playlist generation.
     */
    CodecSpecification?: HlsCodecSpecification;
    /**
     * For use with encryptionType. This is a 128-bit, 16-byte hex value represented by a 32-character text string. If ivSource is set to "explicit" then this parameter is required and is used as the IV for encryption.
     */
    ConstantIv?: __stringMin32Max32;
    /**
     * A directory or HTTP destination for the HLS segments, manifest files, and encryption keys (if enabled).
     */
    Destination: OutputLocationRef;
    /**
     * Place segments in subdirectories.
     */
    DirectoryStructure?: HlsDirectoryStructure;
    /**
     * Specifies whether to insert EXT-X-DISCONTINUITY tags in the HLS child manifests for this output group.
Typically, choose Insert because these tags are required in the manifest (according to the HLS specification) and serve an important purpose.
Choose Never Insert only if the downstream system is doing real-time failover (without using the MediaLive automatic failover feature) and only if that downstream system has advised you to exclude the tags.
     */
    DiscontinuityTags?: HlsDiscontinuityTags;
    /**
     * Encrypts the segments with the given encryption scheme.  Exclude this parameter if no encryption is desired.
     */
    EncryptionType?: HlsEncryptionType;
    /**
     * Parameters that control interactions with the CDN.
     */
    HlsCdnSettings?: HlsCdnSettings;
    /**
     * State of HLS ID3 Segment Tagging
     */
    HlsId3SegmentTagging?: HlsId3SegmentTaggingState;
    /**
     * DISABLED: Do not create an I-frame-only manifest, but do create the master and media manifests (according to the Output Selection field).

STANDARD: Create an I-frame-only manifest for each output that contains video, as well as the other manifests (according to the Output Selection field). The I-frame manifest contains a #EXT-X-I-FRAMES-ONLY tag to indicate it is I-frame only, and one or more #EXT-X-BYTERANGE entries identifying the I-frame position. For example, #EXT-X-BYTERANGE:160364@1461888"
     */
    IFrameOnlyPlaylists?: IFrameOnlyPlaylistType;
    /**
     * Specifies whether to include the final (incomplete) segment in the media output when the pipeline stops producing output because of a channel stop, a channel pause or a loss of input to the pipeline.
Auto means that MediaLive decides whether to include the final segment, depending on the channel class and the types of output groups.
Suppress means to never include the incomplete segment. We recommend you choose Auto and let MediaLive control the behavior.
     */
    IncompleteSegmentBehavior?: HlsIncompleteSegmentBehavior;
    /**
     * Applies only if Mode field is LIVE.

Specifies the maximum number of segments in the media manifest file. After this maximum, older segments are removed from the media manifest. This number must be smaller than the number in the Keep Segments field.
     */
    IndexNSegments?: __integerMin3;
    /**
     * Parameter that control output group behavior on input loss.
     */
    InputLossAction?: InputLossActionForHlsOut;
    /**
     * For use with encryptionType. The IV (Initialization Vector) is a 128-bit number used in conjunction with the key for encrypting blocks. If set to "include", IV is listed in the manifest, otherwise the IV is not in the manifest.
     */
    IvInManifest?: HlsIvInManifest;
    /**
     * For use with encryptionType. The IV (Initialization Vector) is a 128-bit number used in conjunction with the key for encrypting blocks. If this setting is "followsSegmentNumber", it will cause the IV to change every segment (to match the segment number). If this is set to "explicit", you must enter a constantIv value.
     */
    IvSource?: HlsIvSource;
    /**
     * Applies only if Mode field is LIVE.

Specifies the number of media segments to retain in the destination directory. This number should be bigger than indexNSegments (Num segments). We recommend (value = (2 x indexNsegments) + 1).

If this "keep segments" number is too low, the following might happen: the player is still reading a media manifest file that lists this segment, but that segment has been removed from the destination directory (as directed by indexNSegments). This situation would result in a 404 HTTP error on the player.
     */
    KeepSegments?: __integerMin1;
    /**
     * The value specifies how the key is represented in the resource identified by the URI.  If parameter is absent, an implicit value of "identity" is used.  A reverse DNS string can also be given.
     */
    KeyFormat?: __string;
    /**
     * Either a single positive integer version value or a slash delimited list of version values (1/2/3).
     */
    KeyFormatVersions?: __string;
    /**
     * The key provider settings.
     */
    KeyProviderSettings?: KeyProviderSettings;
    /**
     * When set to gzip, compresses HLS playlist.
     */
    ManifestCompression?: HlsManifestCompression;
    /**
     * Indicates whether the output manifest should use floating point or integer values for segment duration.
     */
    ManifestDurationFormat?: HlsManifestDurationFormat;
    /**
     * Minimum length of MPEG-2 Transport Stream segments in seconds. When set, minimum segment length is enforced by looking ahead and back within the specified range for a nearby avail and extending the segment size if needed.
     */
    MinSegmentLength?: __integerMin0;
    /**
     * If "vod", all segments are indexed and kept permanently in the destination and manifest. If "live", only the number segments specified in keepSegments and indexNSegments are kept; newer segments replace older segments, which may prevent players from rewinding all the way to the beginning of the event.

VOD mode uses HLS EXT-X-PLAYLIST-TYPE of EVENT while the channel is running, converting it to a "VOD" type manifest on completion of the stream.
     */
    Mode?: HlsMode;
    /**
     * MANIFESTS_AND_SEGMENTS: Generates manifests (master manifest, if applicable, and media manifests) for this output group.

VARIANT_MANIFESTS_AND_SEGMENTS: Generates media manifests for this output group, but not a master manifest.

SEGMENTS_ONLY: Does not generate any manifests for this output group.
     */
    OutputSelection?: HlsOutputSelection;
    /**
     * Includes or excludes EXT-X-PROGRAM-DATE-TIME tag in .m3u8 manifest files. The value is calculated using the program date time clock.
     */
    ProgramDateTime?: HlsProgramDateTime;
    /**
     * Specifies the algorithm used to drive the HLS EXT-X-PROGRAM-DATE-TIME clock. Options include:

INITIALIZE_FROM_OUTPUT_TIMECODE: The PDT clock is initialized as a function of the first output timecode, then incremented by the EXTINF duration of each encoded segment.

SYSTEM_CLOCK: The PDT clock is initialized as a function of the UTC wall clock, then incremented by the EXTINF duration of each encoded segment. If the PDT clock diverges from the wall clock by more than 500ms, it is resynchronized to the wall clock.
     */
    ProgramDateTimeClock?: HlsProgramDateTimeClock;
    /**
     * Period of insertion of EXT-X-PROGRAM-DATE-TIME entry, in seconds.
     */
    ProgramDateTimePeriod?: __integerMin0Max3600;
    /**
     * ENABLED: The master manifest (.m3u8 file) for each pipeline includes information about both pipelines: first its own media files, then the media files of the other pipeline. This feature allows playout device that support stale manifest detection to switch from one manifest to the other, when the current manifest seems to be stale. There are still two destinations and two master manifests, but both master manifests reference the media files from both pipelines.

DISABLED: The master manifest (.m3u8 file) for each pipeline includes information about its own pipeline only.

For an HLS output group with MediaPackage as the destination, the DISABLED behavior is always followed. MediaPackage regenerates the manifests it serves to players so a redundant manifest from MediaLive is irrelevant.
     */
    RedundantManifest?: HlsRedundantManifest;
    /**
     * Length of MPEG-2 Transport Stream segments to create in seconds. Note that segments will end on the next keyframe after this duration, so actual segment length may be longer.
     */
    SegmentLength?: __integerMin1;
    /**
     * useInputSegmentation has been deprecated. The configured segment size is always used.
     */
    SegmentationMode?: HlsSegmentationMode;
    /**
     * Number of segments to write to a subdirectory before starting a new one. directoryStructure must be subdirectoryPerStream for this setting to have an effect.
     */
    SegmentsPerSubdirectory?: __integerMin1;
    /**
     * Include or exclude RESOLUTION attribute for video in EXT-X-STREAM-INF tag of variant manifest.
     */
    StreamInfResolution?: HlsStreamInfResolution;
    /**
     * Indicates ID3 frame that has the timecode.
     */
    TimedMetadataId3Frame?: HlsTimedMetadataId3Frame;
    /**
     * Timed Metadata interval in seconds.
     */
    TimedMetadataId3Period?: __integerMin0;
    /**
     * Provides an extra millisecond delta offset to fine tune the timestamps.
     */
    TimestampDeltaMilliseconds?: __integerMin0;
    /**
     * SEGMENTED_FILES: Emit the program as segments - multiple .ts media files.

SINGLE_FILE: Applies only if Mode field is VOD. Emit the program as a single .ts media file. The media manifest includes #EXT-X-BYTERANGE tags to index segments for playback. A typical use for this value is when sending the output to AWS Elemental MediaConvert, which can accept only a single media file. Playback while the channel is running is not guaranteed due to HTTP server caching.
     */
    TsFileMode?: HlsTsFileMode;
  }
  export type HlsH265PackagingType = "HEV1"|"HVC1"|string;
  export interface HlsId3SegmentTaggingScheduleActionSettings {
    /**
     * ID3 tag to insert into each segment. Supports special keyword identifiers to substitute in segment-related values.\nSupported keyword identifiers: https://docs.aws.amazon.com/medialive/latest/ug/variable-data-identifiers.html
     */
    Tag?: __string;
    /**
     * Base64 string formatted according to the ID3 specification: http://id3.org/id3v2.4.0-structure
     */
    Id3?: __string;
  }
  export type HlsId3SegmentTaggingState = "DISABLED"|"ENABLED"|string;
  export type HlsIncompleteSegmentBehavior = "AUTO"|"SUPPRESS"|string;
  export interface HlsInputSettings {
    /**
     * When specified the HLS stream with the m3u8 BANDWIDTH that most closely matches this value will be chosen, otherwise the highest bandwidth stream in the m3u8 will be chosen.  The bitrate is specified in bits per second, as in an HLS manifest.
     */
    Bandwidth?: __integerMin0;
    /**
     * When specified, reading of the HLS input will begin this many buffer segments from the end (most recently written segment).  When not specified, the HLS input will begin with the first segment specified in the m3u8.
     */
    BufferSegments?: __integerMin0;
    /**
     * The number of consecutive times that attempts to read a manifest or segment must fail before the input is considered unavailable.
     */
    Retries?: __integerMin0;
    /**
     * The number of seconds between retries when an attempt to read a manifest or segment fails.
     */
    RetryInterval?: __integerMin0;
    /**
     * Identifies the source for the SCTE-35 messages that MediaLive will ingest. Messages can be ingested from the content segments (in the stream) or from tags in the playlist (the HLS manifest). MediaLive ignores SCTE-35 information in the source that is not selected.
     */
    Scte35Source?: HlsScte35SourceType;
  }
  export type HlsIvInManifest = "EXCLUDE"|"INCLUDE"|string;
  export type HlsIvSource = "EXPLICIT"|"FOLLOWS_SEGMENT_NUMBER"|string;
  export type HlsManifestCompression = "GZIP"|"NONE"|string;
  export type HlsManifestDurationFormat = "FLOATING_POINT"|"INTEGER"|string;
  export interface HlsMediaStoreSettings {
    /**
     * Number of seconds to wait before retrying connection to the CDN if the connection is lost.
     */
    ConnectionRetryInterval?: __integerMin0;
    /**
     * Size in seconds of file cache for streaming outputs.
     */
    FilecacheDuration?: __integerMin0Max600;
    /**
     * When set to temporal, output files are stored in non-persistent memory for faster reading and writing.
     */
    MediaStoreStorageClass?: HlsMediaStoreStorageClass;
    /**
     * Number of retry attempts that will be made before the Live Event is put into an error state. Applies only if the CDN destination URI begins with "s3" or "mediastore". For other URIs, the value is always 3.
     */
    NumRetries?: __integerMin0;
    /**
     * If a streaming output fails, number of seconds to wait until a restart is initiated. A value of 0 means never restart.
     */
    RestartDelay?: __integerMin0Max15;
  }
  export type HlsMediaStoreStorageClass = "TEMPORAL"|string;
  export type HlsMode = "LIVE"|"VOD"|string;
  export type HlsOutputSelection = "MANIFESTS_AND_SEGMENTS"|"SEGMENTS_ONLY"|"VARIANT_MANIFESTS_AND_SEGMENTS"|string;
  export interface HlsOutputSettings {
    /**
     * Only applicable when this output is referencing an H.265 video description.
Specifies whether MP4 segments should be packaged as HEV1 or HVC1.
     */
    H265PackagingType?: HlsH265PackagingType;
    /**
     * Settings regarding the underlying stream. These settings are different for audio-only outputs.
     */
    HlsSettings: HlsSettings;
    /**
     * String concatenated to the end of the destination filename. Accepts \"Format Identifiers\":#formatIdentifierParameters.
     */
    NameModifier?: __stringMin1;
    /**
     * String concatenated to end of segment filenames.
     */
    SegmentModifier?: __string;
  }
  export type HlsProgramDateTime = "EXCLUDE"|"INCLUDE"|string;
  export type HlsProgramDateTimeClock = "INITIALIZE_FROM_OUTPUT_TIMECODE"|"SYSTEM_CLOCK"|string;
  export type HlsRedundantManifest = "DISABLED"|"ENABLED"|string;
  export interface HlsS3Settings {
    /**
     * Specify the canned ACL to apply to each S3 request. Defaults to none.
     */
    CannedAcl?: S3CannedAcl;
  }
  export type HlsScte35SourceType = "MANIFEST"|"SEGMENTS"|string;
  export type HlsSegmentationMode = "USE_INPUT_SEGMENTATION"|"USE_SEGMENT_DURATION"|string;
  export interface HlsSettings {
    AudioOnlyHlsSettings?: AudioOnlyHlsSettings;
    Fmp4HlsSettings?: Fmp4HlsSettings;
    FrameCaptureHlsSettings?: FrameCaptureHlsSettings;
    StandardHlsSettings?: StandardHlsSettings;
  }
  export type HlsStreamInfResolution = "EXCLUDE"|"INCLUDE"|string;
  export type HlsTimedMetadataId3Frame = "NONE"|"PRIV"|"TDRL"|string;
  export interface HlsTimedMetadataScheduleActionSettings {
    /**
     * Base64 string formatted according to the ID3 specification: http://id3.org/id3v2.4.0-structure
     */
    Id3: __string;
  }
  export type HlsTsFileMode = "SEGMENTED_FILES"|"SINGLE_FILE"|string;
  export type HlsWebdavHttpTransferMode = "CHUNKED"|"NON_CHUNKED"|string;
  export interface HlsWebdavSettings {
    /**
     * Number of seconds to wait before retrying connection to the CDN if the connection is lost.
     */
    ConnectionRetryInterval?: __integerMin0;
    /**
     * Size in seconds of file cache for streaming outputs.
     */
    FilecacheDuration?: __integerMin0Max600;
    /**
     * Specify whether or not to use chunked transfer encoding to WebDAV.
     */
    HttpTransferMode?: HlsWebdavHttpTransferMode;
    /**
     * Number of retry attempts that will be made before the Live Event is put into an error state. Applies only if the CDN destination URI begins with "s3" or "mediastore". For other URIs, the value is always 3.
     */
    NumRetries?: __integerMin0;
    /**
     * If a streaming output fails, number of seconds to wait until a restart is initiated. A value of 0 means never restart.
     */
    RestartDelay?: __integerMin0Max15;
  }
  export interface HtmlMotionGraphicsSettings {
  }
  export type IFrameOnlyPlaylistType = "DISABLED"|"STANDARD"|string;
  export interface ImmediateModeScheduleActionStartSettings {
  }
  export type IncludeFillerNalUnits = "AUTO"|"DROP"|"INCLUDE"|string;
  export interface Input {
    /**
     * The Unique ARN of the input (generated, immutable).
     */
    Arn?: __string;
    /**
     * A list of channel IDs that that input is attached to (currently an input can only be attached to one channel).
     */
    AttachedChannels?: __listOf__string;
    /**
     * A list of the destinations of the input (PUSH-type).
     */
    Destinations?: __listOfInputDestination;
    /**
     * The generated ID of the input (unique for user account, immutable).
     */
    Id?: __string;
    /**
     * STANDARD - MediaLive expects two sources to be connected to this input. If the channel is also STANDARD, both sources will be ingested. If the channel is SINGLE_PIPELINE, only the first source will be ingested; the second source will always be ignored, even if the first source fails.
SINGLE_PIPELINE - You can connect only one source to this input. If the ChannelClass is also  SINGLE_PIPELINE, this value is valid. If the ChannelClass is STANDARD, this value is not valid because the channel requires two sources in the input.

     */
    InputClass?: InputClass;
    /**
     * Settings for the input devices.
     */
    InputDevices?: __listOfInputDeviceSettings;
    /**
     * A list of IDs for all Inputs which are partners of this one.
     */
    InputPartnerIds?: __listOf__string;
    /**
     * Certain pull input sources can be dynamic, meaning that they can have their URL's dynamically changes
during input switch actions. Presently, this functionality only works with MP4_FILE and TS_FILE inputs.

     */
    InputSourceType?: InputSourceType;
    /**
     * A list of MediaConnect Flows for this input.
     */
    MediaConnectFlows?: __listOfMediaConnectFlow;
    /**
     * The user-assigned name (This is a mutable value).
     */
    Name?: __string;
    /**
     * The Amazon Resource Name (ARN) of the role this input assumes during and after creation.
     */
    RoleArn?: __string;
    /**
     * A list of IDs for all the Input Security Groups attached to the input.
     */
    SecurityGroups?: __listOf__string;
    /**
     * A list of the sources of the input (PULL-type).
     */
    Sources?: __listOfInputSource;
    State?: InputState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    Type?: InputType;
  }
  export interface InputAttachment {
    /**
     * User-specified settings for defining what the conditions are for declaring the input unhealthy and failing over to a different input.
     */
    AutomaticInputFailoverSettings?: AutomaticInputFailoverSettings;
    /**
     * User-specified name for the attachment. This is required if the user wants to use this input in an input switch action.
     */
    InputAttachmentName?: __string;
    /**
     * The ID of the input
     */
    InputId?: __string;
    /**
     * Settings of an input (caption selector, etc.)
     */
    InputSettings?: InputSettings;
  }
  export interface InputChannelLevel {
    /**
     * Remixing value. Units are in dB and acceptable values are within the range from -60 (mute) and 6 dB.
     */
    Gain: __integerMinNegative60Max6;
    /**
     * The index of the input channel used as a source.
     */
    InputChannel: __integerMin0Max15;
  }
  export type InputClass = "STANDARD"|"SINGLE_PIPELINE"|string;
  export interface InputClippingSettings {
    /**
     * The source of the timecodes in the source being clipped.
     */
    InputTimecodeSource: InputTimecodeSource;
    /**
     * Settings to identify the start of the clip.
     */
    StartTimecode?: StartTimecode;
    /**
     * Settings to identify the end of the clip.
     */
    StopTimecode?: StopTimecode;
  }
  export type InputCodec = "MPEG2"|"AVC"|"HEVC"|string;
  export type InputDeblockFilter = "DISABLED"|"ENABLED"|string;
  export type InputDenoiseFilter = "DISABLED"|"ENABLED"|string;
  export interface InputDestination {
    /**
     * The system-generated static IP address of endpoint.
It remains fixed for the lifetime of the input.

     */
    Ip?: __string;
    /**
     * The port number for the input.
     */
    Port?: __string;
    /**
     * This represents the endpoint that the customer stream will be
pushed to.

     */
    Url?: __string;
    Vpc?: InputDestinationVpc;
  }
  export interface InputDestinationRequest {
    /**
     * A unique name for the location the RTMP stream is being pushed
to.

     */
    StreamName?: __string;
  }
  export interface InputDestinationVpc {
    /**
     * The availability zone of the Input destination.

     */
    AvailabilityZone?: __string;
    /**
     * The network interface ID of the Input destination in the VPC.

     */
    NetworkInterfaceId?: __string;
  }
  export type InputDeviceActiveInput = "HDMI"|"SDI"|string;
  export type InputDeviceCodec = "HEVC"|"AVC"|string;
  export interface InputDeviceConfigurableSettings {
    /**
     * The input source that you want to use. If the device has a source connected to only one of its input ports, or if you don't care which source the device sends, specify Auto. If the device has sources connected to both its input ports, and you want to use a specific source, specify the source.
     */
    ConfiguredInput?: InputDeviceConfiguredInput;
    /**
     * The maximum bitrate in bits per second. Set a value here to throttle the bitrate of the source video.
     */
    MaxBitrate?: __integer;
    /**
     * The Link device's buffer size (latency) in milliseconds (ms).
     */
    LatencyMs?: __integer;
    /**
     * Choose the codec for the video that the device produces. Only UHD devices can specify this parameter.
     */
    Codec?: InputDeviceCodec;
    /**
     * To attach this device to a MediaConnect flow, specify these parameters. To detach an existing flow, enter {} for the value of mediaconnectSettings. Only UHD devices can specify this parameter.
     */
    MediaconnectSettings?: InputDeviceMediaConnectConfigurableSettings;
  }
  export type InputDeviceConfiguredInput = "AUTO"|"HDMI"|"SDI"|string;
  export type InputDeviceConnectionState = "DISCONNECTED"|"CONNECTED"|string;
  export interface InputDeviceHdSettings {
    /**
     * If you specified Auto as the configured input, specifies which of the sources is currently active (SDI or HDMI).
     */
    ActiveInput?: InputDeviceActiveInput;
    /**
     * The source at the input device that is currently active. You can specify this source.
     */
    ConfiguredInput?: InputDeviceConfiguredInput;
    /**
     * The state of the input device.
     */
    DeviceState?: InputDeviceState;
    /**
     * The frame rate of the video source.
     */
    Framerate?: __double;
    /**
     * The height of the video source, in pixels.
     */
    Height?: __integer;
    /**
     * The current maximum bitrate for ingesting this source, in bits per second. You can specify this maximum.
     */
    MaxBitrate?: __integer;
    /**
     * The scan type of the video source.
     */
    ScanType?: InputDeviceScanType;
    /**
     * The width of the video source, in pixels.
     */
    Width?: __integer;
    /**
     * The Link device's buffer size (latency) in milliseconds (ms). You can specify this value.
     */
    LatencyMs?: __integer;
  }
  export type InputDeviceIpScheme = "STATIC"|"DHCP"|string;
  export interface InputDeviceMediaConnectConfigurableSettings {
    /**
     * The ARN of the MediaConnect flow to attach this device to.
     */
    FlowArn?: __string;
    /**
     * The ARN for the role that MediaLive assumes to access the attached flow and secret. For more information about how to create this role, see the MediaLive user guide.
     */
    RoleArn?: __string;
    /**
     * The ARN for the secret that holds the encryption key to encrypt the content output by the device.
     */
    SecretArn?: __string;
    /**
     * The name of the MediaConnect Flow source to stream to.
     */
    SourceName?: __string;
  }
  export interface InputDeviceMediaConnectSettings {
    /**
     * The ARN of the MediaConnect flow.
     */
    FlowArn?: __string;
    /**
     * The ARN for the role that MediaLive assumes to access the attached flow and secret.
     */
    RoleArn?: __string;
    /**
     * The ARN of the secret used to encrypt the stream.
     */
    SecretArn?: __string;
    /**
     * The name of the MediaConnect flow source.
     */
    SourceName?: __string;
  }
  export interface InputDeviceNetworkSettings {
    /**
     * The DNS addresses of the input device.
     */
    DnsAddresses?: __listOf__string;
    /**
     * The network gateway IP address.
     */
    Gateway?: __string;
    /**
     * The IP address of the input device.
     */
    IpAddress?: __string;
    /**
     * Specifies whether the input device has been configured (outside of MediaLive) to use a dynamic IP address assignment (DHCP) or a static IP address.
     */
    IpScheme?: InputDeviceIpScheme;
    /**
     * The subnet mask of the input device.
     */
    SubnetMask?: __string;
  }
  export type InputDeviceOutputType = "NONE"|"MEDIALIVE_INPUT"|"MEDIACONNECT_FLOW"|string;
  export interface InputDeviceRequest {
    /**
     * The unique ID for the device.
     */
    Id?: __string;
  }
  export type InputDeviceScanType = "INTERLACED"|"PROGRESSIVE"|string;
  export interface InputDeviceSettings {
    /**
     * The unique ID for the device.
     */
    Id?: __string;
  }
  export type InputDeviceState = "IDLE"|"STREAMING"|string;
  export interface InputDeviceSummary {
    /**
     * The unique ARN of the input device.
     */
    Arn?: __string;
    /**
     * The state of the connection between the input device and AWS.
     */
    ConnectionState?: InputDeviceConnectionState;
    /**
     * The status of the action to synchronize the device configuration. If you change the configuration of the input device (for example, the maximum bitrate), MediaLive sends the new data to the device. The device might not update itself immediately. SYNCED means the device has updated its configuration. SYNCING means that it has not updated its configuration.
     */
    DeviceSettingsSyncState?: DeviceSettingsSyncState;
    /**
     * The status of software on the input device.
     */
    DeviceUpdateStatus?: DeviceUpdateStatus;
    /**
     * Settings that describe an input device that is type HD.
     */
    HdDeviceSettings?: InputDeviceHdSettings;
    /**
     * The unique ID of the input device.
     */
    Id?: __string;
    /**
     * The network MAC address of the input device.
     */
    MacAddress?: __string;
    /**
     * A name that you specify for the input device.
     */
    Name?: __string;
    /**
     * Network settings for the input device.
     */
    NetworkSettings?: InputDeviceNetworkSettings;
    /**
     * The unique serial number of the input device.
     */
    SerialNumber?: __string;
    /**
     * The type of the input device.
     */
    Type?: InputDeviceType;
    /**
     * Settings that describe an input device that is type UHD.
     */
    UhdDeviceSettings?: InputDeviceUhdSettings;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    /**
     * The Availability Zone associated with this input device.
     */
    AvailabilityZone?: __string;
    /**
     * An array of the ARNs for the MediaLive inputs attached to the device. Returned only if the outputType is MEDIALIVE_INPUT.
     */
    MedialiveInputArns?: __listOf__string;
    /**
     * The output attachment type of the input device. Specifies MEDIACONNECT_FLOW if this device is the source for a MediaConnect flow. Specifies MEDIALIVE_INPUT if this device is the source for a MediaLive input.
     */
    OutputType?: InputDeviceOutputType;
  }
  export type InputDeviceTransferType = "OUTGOING"|"INCOMING"|string;
  export type InputDeviceType = "HD"|"UHD"|string;
  export interface InputDeviceUhdSettings {
    /**
     * If you specified Auto as the configured input, specifies which of the sources is currently active (SDI or HDMI).
     */
    ActiveInput?: InputDeviceActiveInput;
    /**
     * The source at the input device that is currently active. You can specify this source.
     */
    ConfiguredInput?: InputDeviceConfiguredInput;
    /**
     * The state of the input device.
     */
    DeviceState?: InputDeviceState;
    /**
     * The frame rate of the video source.
     */
    Framerate?: __double;
    /**
     * The height of the video source, in pixels.
     */
    Height?: __integer;
    /**
     * The current maximum bitrate for ingesting this source, in bits per second. You can specify this maximum.
     */
    MaxBitrate?: __integer;
    /**
     * The scan type of the video source.
     */
    ScanType?: InputDeviceScanType;
    /**
     * The width of the video source, in pixels.
     */
    Width?: __integer;
    /**
     * The Link device's buffer size (latency) in milliseconds (ms). You can specify this value.
     */
    LatencyMs?: __integer;
    /**
     * The codec for the video that the device produces.
     */
    Codec?: InputDeviceCodec;
    /**
     * Information about the MediaConnect flow attached to the device. Returned only if the outputType is MEDIACONNECT_FLOW.
     */
    MediaconnectSettings?: InputDeviceMediaConnectSettings;
  }
  export type InputFilter = "AUTO"|"DISABLED"|"FORCED"|string;
  export interface InputLocation {
    /**
     * key used to extract the password from EC2 Parameter store
     */
    PasswordParam?: __string;
    /**
     * Uniform Resource Identifier - This should be a path to a file accessible to the Live system (eg. a http:// URI) depending on the output type. For example, a RTMP destination should have a uri simliar to: "rtmp://fmsserver/live".
     */
    Uri: __stringMax2048;
    /**
     * Documentation update needed
     */
    Username?: __string;
  }
  export type InputLossActionForHlsOut = "EMIT_OUTPUT"|"PAUSE_OUTPUT"|string;
  export type InputLossActionForMsSmoothOut = "EMIT_OUTPUT"|"PAUSE_OUTPUT"|string;
  export type InputLossActionForRtmpOut = "EMIT_OUTPUT"|"PAUSE_OUTPUT"|string;
  export type InputLossActionForUdpOut = "DROP_PROGRAM"|"DROP_TS"|"EMIT_PROGRAM"|string;
  export interface InputLossBehavior {
    /**
     * Documentation update needed
     */
    BlackFrameMsec?: __integerMin0Max1000000;
    /**
     * When input loss image type is "color" this field specifies the color to use. Value: 6 hex characters representing the values of RGB.
     */
    InputLossImageColor?: __stringMin6Max6;
    /**
     * When input loss image type is "slate" these fields specify the parameters for accessing the slate.
     */
    InputLossImageSlate?: InputLocation;
    /**
     * Indicates whether to substitute a solid color or a slate into the output after input loss exceeds blackFrameMsec.
     */
    InputLossImageType?: InputLossImageType;
    /**
     * Documentation update needed
     */
    RepeatFrameMsec?: __integerMin0Max1000000;
  }
  export interface InputLossFailoverSettings {
    /**
     * The amount of time (in milliseconds) that no input is detected. After that time, an input failover will occur.
     */
    InputLossThresholdMsec?: __integerMin100;
  }
  export type InputLossImageType = "COLOR"|"SLATE"|string;
  export type InputMaximumBitrate = "MAX_10_MBPS"|"MAX_20_MBPS"|"MAX_50_MBPS"|string;
  export type InputPreference = "EQUAL_INPUT_PREFERENCE"|"PRIMARY_INPUT_PREFERRED"|string;
  export interface InputPrepareScheduleActionSettings {
    /**
     * The name of the input attachment that should be prepared by this action. If no name is provided, the action will stop the most recent prepare (if any) when activated.
     */
    InputAttachmentNameReference?: __string;
    /**
     * Settings to let you create a clip of the file input, in order to set up the input to ingest only a portion of the file.
     */
    InputClippingSettings?: InputClippingSettings;
    /**
     * The value for the variable portion of the URL for the dynamic input, for this instance of the input. Each time you use the same dynamic input in an input switch action, you can provide a different value, in order to connect the input to a different content source.
     */
    UrlPath?: __listOf__string;
  }
  export type InputResolution = "SD"|"HD"|"UHD"|string;
  export interface InputSecurityGroup {
    /**
     * Unique ARN of Input Security Group
     */
    Arn?: __string;
    /**
     * The Id of the Input Security Group
     */
    Id?: __string;
    /**
     * The list of inputs currently using this Input Security Group.
     */
    Inputs?: __listOf__string;
    /**
     * The current state of the Input Security Group.
     */
    State?: InputSecurityGroupState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    /**
     * Whitelist rules and their sync status
     */
    WhitelistRules?: __listOfInputWhitelistRule;
  }
  export type InputSecurityGroupState = "IDLE"|"IN_USE"|"UPDATING"|"DELETED"|string;
  export interface InputSettings {
    /**
     * Used to select the audio stream to decode for inputs that have multiple available.
     */
    AudioSelectors?: __listOfAudioSelector;
    /**
     * Used to select the caption input to use for inputs that have multiple available.
     */
    CaptionSelectors?: __listOfCaptionSelector;
    /**
     * Enable or disable the deblock filter when filtering.
     */
    DeblockFilter?: InputDeblockFilter;
    /**
     * Enable or disable the denoise filter when filtering.
     */
    DenoiseFilter?: InputDenoiseFilter;
    /**
     * Adjusts the magnitude of filtering from 1 (minimal) to 5 (strongest).
     */
    FilterStrength?: __integerMin1Max5;
    /**
     * Turns on the filter for this input. MPEG-2 inputs have the deblocking filter enabled by default.
1) auto - filtering will be applied depending on input type/quality
2) disabled - no filtering will be applied to the input
3) forced - filtering will be applied regardless of input type
     */
    InputFilter?: InputFilter;
    /**
     * Input settings.
     */
    NetworkInputSettings?: NetworkInputSettings;
    /**
     * PID from which to read SCTE-35 messages. If left undefined, EML will select the first SCTE-35 PID found in the input.
     */
    Scte35Pid?: __integerMin32Max8191;
    /**
     * Specifies whether to extract applicable ancillary data from a SMPTE-2038 source in this input. Applicable data types are captions, timecode, AFD, and SCTE-104 messages.
- PREFER: Extract from SMPTE-2038 if present in this input, otherwise extract from another source (if any).
- IGNORE: Never extract any ancillary data from SMPTE-2038.
     */
    Smpte2038DataPreference?: Smpte2038DataPreference;
    /**
     * Loop input if it is a file. This allows a file input to be streamed indefinitely.
     */
    SourceEndBehavior?: InputSourceEndBehavior;
    /**
     * Informs which video elementary stream to decode for input types that have multiple available.
     */
    VideoSelector?: VideoSelector;
  }
  export interface InputSource {
    /**
     * The key used to extract the password from EC2 Parameter store.
     */
    PasswordParam?: __string;
    /**
     * This represents the customer's source URL where stream is
pulled from.

     */
    Url?: __string;
    /**
     * The username for the input source.
     */
    Username?: __string;
  }
  export type InputSourceEndBehavior = "CONTINUE"|"LOOP"|string;
  export interface InputSourceRequest {
    /**
     * The key used to extract the password from EC2 Parameter store.
     */
    PasswordParam?: __string;
    /**
     * This represents the customer's source URL where stream is
pulled from.

     */
    Url?: __string;
    /**
     * The username for the input source.
     */
    Username?: __string;
  }
  export type InputSourceType = "STATIC"|"DYNAMIC"|string;
  export interface InputSpecification {
    /**
     * Input codec
     */
    Codec?: InputCodec;
    /**
     * Maximum input bitrate, categorized coarsely
     */
    MaximumBitrate?: InputMaximumBitrate;
    /**
     * Input resolution, categorized coarsely
     */
    Resolution?: InputResolution;
  }
  export type InputState = "CREATING"|"DETACHED"|"ATTACHED"|"DELETING"|"DELETED"|string;
  export interface InputSwitchScheduleActionSettings {
    /**
     * The name of the input attachment (not the name of the input!) to switch to. The name is specified in the channel configuration.
     */
    InputAttachmentNameReference: __string;
    /**
     * Settings to let you create a clip of the file input, in order to set up the input to ingest only a portion of the file.
     */
    InputClippingSettings?: InputClippingSettings;
    /**
     * The value for the variable portion of the URL for the dynamic input, for this instance of the input. Each time you use the same dynamic input in an input switch action, you can provide a different value, in order to connect the input to a different content source.
     */
    UrlPath?: __listOf__string;
  }
  export type InputTimecodeSource = "ZEROBASED"|"EMBEDDED"|string;
  export type InputType = "UDP_PUSH"|"RTP_PUSH"|"RTMP_PUSH"|"RTMP_PULL"|"URL_PULL"|"MP4_FILE"|"MEDIACONNECT"|"INPUT_DEVICE"|"AWS_CDI"|"TS_FILE"|string;
  export interface InputVpcRequest {
    /**
     * A list of up to 5 EC2 VPC security group IDs to attach to the Input VPC network interfaces.
Requires subnetIds. If none are specified then the VPC default security group will be used.

     */
    SecurityGroupIds?: __listOf__string;
    /**
     * A list of 2 VPC subnet IDs from the same VPC.
Subnet IDs must be mapped to two unique availability zones (AZ).

     */
    SubnetIds: __listOf__string;
  }
  export interface InputWhitelistRule {
    /**
     * The IPv4 CIDR that's whitelisted.
     */
    Cidr?: __string;
  }
  export interface InputWhitelistRuleCidr {
    /**
     * The IPv4 CIDR to whitelist.
     */
    Cidr?: __string;
  }
  export interface KeyProviderSettings {
    StaticKeySettings?: StaticKeySettings;
  }
  export type LastFrameClippingBehavior = "EXCLUDE_LAST_FRAME"|"INCLUDE_LAST_FRAME"|string;
  export interface ListChannelsRequest {
    MaxResults?: MaxResults;
    NextToken?: __string;
  }
  export interface ListChannelsResponse {
    Channels?: __listOfChannelSummary;
    NextToken?: __string;
  }
  export interface ListInputDeviceTransfersRequest {
    MaxResults?: MaxResults;
    NextToken?: __string;
    TransferType: __string;
  }
  export interface ListInputDeviceTransfersResponse {
    /**
     * The list of devices that you are transferring or are being transferred to you.
     */
    InputDeviceTransfers?: __listOfTransferringInputDeviceSummary;
    /**
     * A token to get additional list results.
     */
    NextToken?: __string;
  }
  export interface ListInputDevicesRequest {
    MaxResults?: MaxResults;
    NextToken?: __string;
  }
  export interface ListInputDevicesResponse {
    /**
     * The list of input devices.
     */
    InputDevices?: __listOfInputDeviceSummary;
    /**
     * A token to get additional list results.
     */
    NextToken?: __string;
  }
  export interface ListInputSecurityGroupsRequest {
    MaxResults?: MaxResults;
    NextToken?: __string;
  }
  export interface ListInputSecurityGroupsResponse {
    /**
     * List of input security groups
     */
    InputSecurityGroups?: __listOfInputSecurityGroup;
    NextToken?: __string;
  }
  export interface ListInputsRequest {
    MaxResults?: MaxResults;
    NextToken?: __string;
  }
  export interface ListInputsResponse {
    Inputs?: __listOfInput;
    NextToken?: __string;
  }
  export interface ListMultiplexProgramsRequest {
    /**
     * The maximum number of items to return.
     */
    MaxResults?: MaxResults;
    /**
     * The ID of the multiplex that the programs belong to.
     */
    MultiplexId: __string;
    /**
     * The token to retrieve the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListMultiplexProgramsResponse {
    /**
     * List of multiplex programs.
     */
    MultiplexPrograms?: __listOfMultiplexProgramSummary;
    /**
     * Token for the next ListMultiplexProgram request.
     */
    NextToken?: __string;
  }
  export interface ListMultiplexesRequest {
    /**
     * The maximum number of items to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token to retrieve the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListMultiplexesResponse {
    /**
     * List of multiplexes.
     */
    Multiplexes?: __listOfMultiplexSummary;
    /**
     * Token for the next ListMultiplexes request.
     */
    NextToken?: __string;
  }
  export interface ListOfferingsRequest {
    /**
     * Filter by channel class, 'STANDARD' or 'SINGLE_PIPELINE'

     */
    ChannelClass?: __string;
    /**
     * Filter to offerings that match the configuration of an existing channel, e.g. '2345678' (a channel ID)

     */
    ChannelConfiguration?: __string;
    /**
     * Filter by codec, 'AVC', 'HEVC', 'MPEG2', 'AUDIO', or 'LINK'
     */
    Codec?: __string;
    /**
     * Filter by offering duration, e.g. '12'
     */
    Duration?: __string;
    MaxResults?: MaxResults;
    /**
     * Filter by bitrate, 'MAX_10_MBPS', 'MAX_20_MBPS', or 'MAX_50_MBPS'

     */
    MaximumBitrate?: __string;
    /**
     * Filter by framerate, 'MAX_30_FPS' or 'MAX_60_FPS'
     */
    MaximumFramerate?: __string;
    NextToken?: __string;
    /**
     * Filter by resolution, 'SD', 'HD', 'FHD', or 'UHD'
     */
    Resolution?: __string;
    /**
     * Filter by resource type, 'INPUT', 'OUTPUT', 'MULTIPLEX', or 'CHANNEL'
     */
    ResourceType?: __string;
    /**
     * Filter by special feature, 'ADVANCED_AUDIO' or 'AUDIO_NORMALIZATION'

     */
    SpecialFeature?: __string;
    /**
     * Filter by video quality, 'STANDARD', 'ENHANCED', or 'PREMIUM'

     */
    VideoQuality?: __string;
  }
  export interface ListOfferingsResponse {
    /**
     * Token to retrieve the next page of results
     */
    NextToken?: __string;
    /**
     * List of offerings
     */
    Offerings?: __listOfOffering;
  }
  export interface ListReservationsRequest {
    /**
     * Filter by channel class, 'STANDARD' or 'SINGLE_PIPELINE'

     */
    ChannelClass?: __string;
    /**
     * Filter by codec, 'AVC', 'HEVC', 'MPEG2', 'AUDIO', or 'LINK'
     */
    Codec?: __string;
    MaxResults?: MaxResults;
    /**
     * Filter by bitrate, 'MAX_10_MBPS', 'MAX_20_MBPS', or 'MAX_50_MBPS'

     */
    MaximumBitrate?: __string;
    /**
     * Filter by framerate, 'MAX_30_FPS' or 'MAX_60_FPS'
     */
    MaximumFramerate?: __string;
    NextToken?: __string;
    /**
     * Filter by resolution, 'SD', 'HD', 'FHD', or 'UHD'
     */
    Resolution?: __string;
    /**
     * Filter by resource type, 'INPUT', 'OUTPUT', 'MULTIPLEX', or 'CHANNEL'
     */
    ResourceType?: __string;
    /**
     * Filter by special feature, 'ADVANCED_AUDIO' or 'AUDIO_NORMALIZATION'

     */
    SpecialFeature?: __string;
    /**
     * Filter by video quality, 'STANDARD', 'ENHANCED', or 'PREMIUM'

     */
    VideoQuality?: __string;
  }
  export interface ListReservationsResponse {
    /**
     * Token to retrieve the next page of results
     */
    NextToken?: __string;
    /**
     * List of reservations
     */
    Reservations?: __listOfReservation;
  }
  export interface ListTagsForResourceRequest {
    ResourceArn: __string;
  }
  export interface ListTagsForResourceResponse {
    Tags?: Tags;
  }
  export type LogLevel = "ERROR"|"WARNING"|"INFO"|"DEBUG"|"DISABLED"|string;
  export type M2tsAbsentInputAudioBehavior = "DROP"|"ENCODE_SILENCE"|string;
  export type M2tsArib = "DISABLED"|"ENABLED"|string;
  export type M2tsAribCaptionsPidControl = "AUTO"|"USE_CONFIGURED"|string;
  export type M2tsAudioBufferModel = "ATSC"|"DVB"|string;
  export type M2tsAudioInterval = "VIDEO_AND_FIXED_INTERVALS"|"VIDEO_INTERVAL"|string;
  export type M2tsAudioStreamType = "ATSC"|"DVB"|string;
  export type M2tsBufferModel = "MULTIPLEX"|"NONE"|string;
  export type M2tsCcDescriptor = "DISABLED"|"ENABLED"|string;
  export type M2tsEbifControl = "NONE"|"PASSTHROUGH"|string;
  export type M2tsEbpPlacement = "VIDEO_AND_AUDIO_PIDS"|"VIDEO_PID"|string;
  export type M2tsEsRateInPes = "EXCLUDE"|"INCLUDE"|string;
  export type M2tsKlv = "NONE"|"PASSTHROUGH"|string;
  export type M2tsNielsenId3Behavior = "NO_PASSTHROUGH"|"PASSTHROUGH"|string;
  export type M2tsPcrControl = "CONFIGURED_PCR_PERIOD"|"PCR_EVERY_PES_PACKET"|string;
  export type M2tsRateMode = "CBR"|"VBR"|string;
  export type M2tsScte35Control = "NONE"|"PASSTHROUGH"|string;
  export type M2tsSegmentationMarkers = "EBP"|"EBP_LEGACY"|"NONE"|"PSI_SEGSTART"|"RAI_ADAPT"|"RAI_SEGSTART"|string;
  export type M2tsSegmentationStyle = "MAINTAIN_CADENCE"|"RESET_CADENCE"|string;
  export interface M2tsSettings {
    /**
     * When set to drop, output audio streams will be removed from the program if the selected input audio stream is removed from the input. This allows the output audio configuration to dynamically change based on input configuration. If this is set to encodeSilence, all output audio streams will output encoded silence when not connected to an active input stream.
     */
    AbsentInputAudioBehavior?: M2tsAbsentInputAudioBehavior;
    /**
     * When set to enabled, uses ARIB-compliant field muxing and removes video descriptor.
     */
    Arib?: M2tsArib;
    /**
     * Packet Identifier (PID) for ARIB Captions in the transport stream. Can be entered as a decimal or hexadecimal value.  Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
     */
    AribCaptionsPid?: __string;
    /**
     * If set to auto, pid number used for ARIB Captions will be auto-selected from unused pids.  If set to useConfigured, ARIB Captions will be on the configured pid number.
     */
    AribCaptionsPidControl?: M2tsAribCaptionsPidControl;
    /**
     * When set to dvb, uses DVB buffer model for Dolby Digital audio.  When set to atsc, the ATSC model is used.
     */
    AudioBufferModel?: M2tsAudioBufferModel;
    /**
     * The number of audio frames to insert for each PES packet.
     */
    AudioFramesPerPes?: __integerMin0;
    /**
     * Packet Identifier (PID) of the elementary audio stream(s) in the transport stream. Multiple values are accepted, and can be entered in ranges and/or by comma separation. Can be entered as decimal or hexadecimal values. Each PID specified must be in the range of 32 (or 0x20)..8182 (or 0x1ff6).
     */
    AudioPids?: __string;
    /**
     * When set to atsc, uses stream type = 0x81 for AC3 and stream type = 0x87 for EAC3. When set to dvb, uses stream type = 0x06.
     */
    AudioStreamType?: M2tsAudioStreamType;
    /**
     * The output bitrate of the transport stream in bits per second. Setting to 0 lets the muxer automatically determine the appropriate bitrate.
     */
    Bitrate?: __integerMin0;
    /**
     * Controls the timing accuracy for output network traffic. Leave as MULTIPLEX to ensure accurate network packet timing. Or set to NONE, which might result in lower latency but will result in more variability in output network packet timing. This variability might cause interruptions, jitter, or bursty behavior in your playback or receiving devices.
     */
    BufferModel?: M2tsBufferModel;
    /**
     * When set to enabled, generates captionServiceDescriptor in PMT.
     */
    CcDescriptor?: M2tsCcDescriptor;
    /**
     * Inserts DVB Network Information Table (NIT) at the specified table repetition interval.
     */
    DvbNitSettings?: DvbNitSettings;
    /**
     * Inserts DVB Service Description Table (SDT) at the specified table repetition interval.
     */
    DvbSdtSettings?: DvbSdtSettings;
    /**
     * Packet Identifier (PID) for input source DVB Subtitle data to this output. Multiple values are accepted, and can be entered in ranges and/or by comma separation. Can be entered as decimal or hexadecimal values.  Each PID specified must be in the range of 32 (or 0x20)..8182 (or 0x1ff6).
     */
    DvbSubPids?: __string;
    /**
     * Inserts DVB Time and Date Table (TDT) at the specified table repetition interval.
     */
    DvbTdtSettings?: DvbTdtSettings;
    /**
     * Packet Identifier (PID) for input source DVB Teletext data to this output. Can be entered as a decimal or hexadecimal value.  Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
     */
    DvbTeletextPid?: __string;
    /**
     * If set to passthrough, passes any EBIF data from the input source to this output.
     */
    Ebif?: M2tsEbifControl;
    /**
     * When videoAndFixedIntervals is selected, audio EBP markers will be added to partitions 3 and 4. The interval between these additional markers will be fixed, and will be slightly shorter than the video EBP marker interval. Only available when EBP Cablelabs segmentation markers are selected.  Partitions 1 and 2 will always follow the video interval.
     */
    EbpAudioInterval?: M2tsAudioInterval;
    /**
     * When set, enforces that Encoder Boundary Points do not come within the specified time interval of each other by looking ahead at input video. If another EBP is going to come in within the specified time interval, the current EBP is not emitted, and the segment is "stretched" to the next marker.  The lookahead value does not add latency to the system. The Live Event must be configured elsewhere to create sufficient latency to make the lookahead accurate.
     */
    EbpLookaheadMs?: __integerMin0Max10000;
    /**
     * Controls placement of EBP on Audio PIDs. If set to videoAndAudioPids, EBP markers will be placed on the video PID and all audio PIDs.  If set to videoPid, EBP markers will be placed on only the video PID.
     */
    EbpPlacement?: M2tsEbpPlacement;
    /**
     * This field is unused and deprecated.
     */
    EcmPid?: __string;
    /**
     * Include or exclude the ES Rate field in the PES header.
     */
    EsRateInPes?: M2tsEsRateInPes;
    /**
     * Packet Identifier (PID) for input source ETV Platform data to this output. Can be entered as a decimal or hexadecimal value.  Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
     */
    EtvPlatformPid?: __string;
    /**
     * Packet Identifier (PID) for input source ETV Signal data to this output. Can be entered as a decimal or hexadecimal value.  Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
     */
    EtvSignalPid?: __string;
    /**
     * The length in seconds of each fragment. Only used with EBP markers.
     */
    FragmentTime?: __doubleMin0;
    /**
     * If set to passthrough, passes any KLV data from the input source to this output.
     */
    Klv?: M2tsKlv;
    /**
     * Packet Identifier (PID) for input source KLV data to this output. Multiple values are accepted, and can be entered in ranges and/or by comma separation. Can be entered as decimal or hexadecimal values.  Each PID specified must be in the range of 32 (or 0x20)..8182 (or 0x1ff6).
     */
    KlvDataPids?: __string;
    /**
     * If set to passthrough, Nielsen inaudible tones for media tracking will be detected in the input audio and an equivalent ID3 tag will be inserted in the output.
     */
    NielsenId3Behavior?: M2tsNielsenId3Behavior;
    /**
     * Value in bits per second of extra null packets to insert into the transport stream. This can be used if a downstream encryption system requires periodic null packets.
     */
    NullPacketBitrate?: __doubleMin0;
    /**
     * The number of milliseconds between instances of this table in the output transport stream.  Valid values are 0, 10..1000.
     */
    PatInterval?: __integerMin0Max1000;
    /**
     * When set to pcrEveryPesPacket, a Program Clock Reference value is inserted for every Packetized Elementary Stream (PES) header. This parameter is effective only when the PCR PID is the same as the video or audio elementary stream.
     */
    PcrControl?: M2tsPcrControl;
    /**
     * Maximum time in milliseconds between Program Clock Reference (PCRs) inserted into the transport stream.
     */
    PcrPeriod?: __integerMin0Max500;
    /**
     * Packet Identifier (PID) of the Program Clock Reference (PCR) in the transport stream. When no value is given, the encoder will assign the same value as the Video PID. Can be entered as a decimal or hexadecimal value.  Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
     */
    PcrPid?: __string;
    /**
     * The number of milliseconds between instances of this table in the output transport stream. Valid values are 0, 10..1000.
     */
    PmtInterval?: __integerMin0Max1000;
    /**
     * Packet Identifier (PID) for the Program Map Table (PMT) in the transport stream. Can be entered as a decimal or hexadecimal value. Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
     */
    PmtPid?: __string;
    /**
     * The value of the program number field in the Program Map Table.
     */
    ProgramNum?: __integerMin0Max65535;
    /**
     * When vbr, does not insert null packets into transport stream to fill specified bitrate. The bitrate setting acts as the maximum bitrate when vbr is set.
     */
    RateMode?: M2tsRateMode;
    /**
     * Packet Identifier (PID) for input source SCTE-27 data to this output. Multiple values are accepted, and can be entered in ranges and/or by comma separation. Can be entered as decimal or hexadecimal values.  Each PID specified must be in the range of 32 (or 0x20)..8182 (or 0x1ff6).
     */
    Scte27Pids?: __string;
    /**
     * Optionally pass SCTE-35 signals from the input source to this output.
     */
    Scte35Control?: M2tsScte35Control;
    /**
     * Packet Identifier (PID) of the SCTE-35 stream in the transport stream. Can be entered as a decimal or hexadecimal value.  Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
     */
    Scte35Pid?: __string;
    /**
     * Inserts segmentation markers at each segmentationTime period. raiSegstart sets the Random Access Indicator bit in the adaptation field. raiAdapt sets the RAI bit and adds the current timecode in the private data bytes. psiSegstart inserts PAT and PMT tables at the start of segments. ebp adds Encoder Boundary Point information to the adaptation field as per OpenCable specification OC-SP-EBP-I01-130118. ebpLegacy adds Encoder Boundary Point information to the adaptation field using a legacy proprietary format.
     */
    SegmentationMarkers?: M2tsSegmentationMarkers;
    /**
     * The segmentation style parameter controls how segmentation markers are inserted into the transport stream. With avails, it is possible that segments may be truncated, which can influence where future segmentation markers are inserted.

When a segmentation style of "resetCadence" is selected and a segment is truncated due to an avail, we will reset the segmentation cadence. This means the subsequent segment will have a duration of $segmentationTime seconds.

When a segmentation style of "maintainCadence" is selected and a segment is truncated due to an avail, we will not reset the segmentation cadence. This means the subsequent segment will likely be truncated as well. However, all segments after that will have a duration of $segmentationTime seconds. Note that EBP lookahead is a slight exception to this rule.
     */
    SegmentationStyle?: M2tsSegmentationStyle;
    /**
     * The length in seconds of each segment. Required unless markers is set to _none_.
     */
    SegmentationTime?: __doubleMin1;
    /**
     * When set to passthrough, timed metadata will be passed through from input to output.
     */
    TimedMetadataBehavior?: M2tsTimedMetadataBehavior;
    /**
     * Packet Identifier (PID) of the timed metadata stream in the transport stream. Can be entered as a decimal or hexadecimal value.  Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
     */
    TimedMetadataPid?: __string;
    /**
     * The value of the transport stream ID field in the Program Map Table.
     */
    TransportStreamId?: __integerMin0Max65535;
    /**
     * Packet Identifier (PID) of the elementary video stream in the transport stream. Can be entered as a decimal or hexadecimal value.  Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
     */
    VideoPid?: __string;
    /**
     * Defines the amount SCTE-35 preroll will be increased (in milliseconds) on the output. Preroll is the amount of time between the presence of a SCTE-35 indication in a transport stream and the PTS of the video frame it references. Zero means don't add pullup (it doesn't mean set the preroll to zero). Negative pullup is not supported, which means that you can't make the preroll shorter. Be aware that latency in the output will increase by the pullup amount.
     */
    Scte35PrerollPullupMilliseconds?: __doubleMin0Max5000;
  }
  export type M2tsTimedMetadataBehavior = "NO_PASSTHROUGH"|"PASSTHROUGH"|string;
  export type M3u8KlvBehavior = "NO_PASSTHROUGH"|"PASSTHROUGH"|string;
  export type M3u8NielsenId3Behavior = "NO_PASSTHROUGH"|"PASSTHROUGH"|string;
  export type M3u8PcrControl = "CONFIGURED_PCR_PERIOD"|"PCR_EVERY_PES_PACKET"|string;
  export type M3u8Scte35Behavior = "NO_PASSTHROUGH"|"PASSTHROUGH"|string;
  export interface M3u8Settings {
    /**
     * The number of audio frames to insert for each PES packet.
     */
    AudioFramesPerPes?: __integerMin0;
    /**
     * Packet Identifier (PID) of the elementary audio stream(s) in the transport stream. Multiple values are accepted, and can be entered in ranges and/or by comma separation. Can be entered as decimal or hexadecimal values.
     */
    AudioPids?: __string;
    /**
     * This parameter is unused and deprecated.
     */
    EcmPid?: __string;
    /**
     * If set to passthrough, Nielsen inaudible tones for media tracking will be detected in the input audio and an equivalent ID3 tag will be inserted in the output.
     */
    NielsenId3Behavior?: M3u8NielsenId3Behavior;
    /**
     * The number of milliseconds between instances of this table in the output transport stream. A value of \"0\" writes out the PMT once per segment file.
     */
    PatInterval?: __integerMin0Max1000;
    /**
     * When set to pcrEveryPesPacket, a Program Clock Reference value is inserted for every Packetized Elementary Stream (PES) header. This parameter is effective only when the PCR PID is the same as the video or audio elementary stream.
     */
    PcrControl?: M3u8PcrControl;
    /**
     * Maximum time in milliseconds between Program Clock References (PCRs) inserted into the transport stream.
     */
    PcrPeriod?: __integerMin0Max500;
    /**
     * Packet Identifier (PID) of the Program Clock Reference (PCR) in the transport stream. When no value is given, the encoder will assign the same value as the Video PID. Can be entered as a decimal or hexadecimal value.
     */
    PcrPid?: __string;
    /**
     * The number of milliseconds between instances of this table in the output transport stream. A value of \"0\" writes out the PMT once per segment file.
     */
    PmtInterval?: __integerMin0Max1000;
    /**
     * Packet Identifier (PID) for the Program Map Table (PMT) in the transport stream. Can be entered as a decimal or hexadecimal value.
     */
    PmtPid?: __string;
    /**
     * The value of the program number field in the Program Map Table.
     */
    ProgramNum?: __integerMin0Max65535;
    /**
     * If set to passthrough, passes any SCTE-35 signals from the input source to this output.
     */
    Scte35Behavior?: M3u8Scte35Behavior;
    /**
     * Packet Identifier (PID) of the SCTE-35 stream in the transport stream. Can be entered as a decimal or hexadecimal value.
     */
    Scte35Pid?: __string;
    /**
     * When set to passthrough, timed metadata is passed through from input to output.
     */
    TimedMetadataBehavior?: M3u8TimedMetadataBehavior;
    /**
     * Packet Identifier (PID) of the timed metadata stream in the transport stream. Can be entered as a decimal or hexadecimal value.  Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
     */
    TimedMetadataPid?: __string;
    /**
     * The value of the transport stream ID field in the Program Map Table.
     */
    TransportStreamId?: __integerMin0Max65535;
    /**
     * Packet Identifier (PID) of the elementary video stream in the transport stream. Can be entered as a decimal or hexadecimal value.
     */
    VideoPid?: __string;
    /**
     * If set to passthrough, passes any KLV data from the input source to this output.
     */
    KlvBehavior?: M3u8KlvBehavior;
    /**
     * Packet Identifier (PID) for input source KLV data to this output. Multiple values are accepted, and can be entered in ranges and/or by comma separation. Can be entered as decimal or hexadecimal values.  Each PID specified must be in the range of 32 (or 0x20)..8182 (or 0x1ff6).
     */
    KlvDataPids?: __string;
  }
  export type M3u8TimedMetadataBehavior = "NO_PASSTHROUGH"|"PASSTHROUGH"|string;
  export interface MaintenanceCreateSettings {
    /**
     * Choose one day of the week for maintenance. The chosen day is used for all future maintenance windows.
     */
    MaintenanceDay?: MaintenanceDay;
    /**
     * Choose the hour that maintenance will start. The chosen time is used for all future maintenance windows.
     */
    MaintenanceStartTime?: __stringPattern010920300;
  }
  export type MaintenanceDay = "MONDAY"|"TUESDAY"|"WEDNESDAY"|"THURSDAY"|"FRIDAY"|"SATURDAY"|"SUNDAY"|string;
  export interface MaintenanceStatus {
    /**
     * The currently selected maintenance day.
     */
    MaintenanceDay?: MaintenanceDay;
    /**
     * Maintenance is required by the displayed date and time. Date and time is in ISO.
     */
    MaintenanceDeadline?: __string;
    /**
     * The currently scheduled maintenance date and time. Date and time is in ISO.
     */
    MaintenanceScheduledDate?: __string;
    /**
     * The currently selected maintenance start time. Time is in UTC.
     */
    MaintenanceStartTime?: __string;
  }
  export interface MaintenanceUpdateSettings {
    /**
     * Choose one day of the week for maintenance. The chosen day is used for all future maintenance windows.
     */
    MaintenanceDay?: MaintenanceDay;
    /**
     * Choose a specific date for maintenance to occur. The chosen date is used for the next maintenance window only.
     */
    MaintenanceScheduledDate?: __string;
    /**
     * Choose the hour that maintenance will start. The chosen time is used for all future maintenance windows.
     */
    MaintenanceStartTime?: __stringPattern010920300;
  }
  export type MaxResults = number;
  export interface MediaConnectFlow {
    /**
     * The unique ARN of the MediaConnect Flow being used as a source.
     */
    FlowArn?: __string;
  }
  export interface MediaConnectFlowRequest {
    /**
     * The ARN of the MediaConnect Flow that you want to use as a source.
     */
    FlowArn?: __string;
  }
  export interface MediaPackageGroupSettings {
    /**
     * MediaPackage channel destination.
     */
    Destination: OutputLocationRef;
  }
  export interface MediaPackageOutputDestinationSettings {
    /**
     * ID of the channel in MediaPackage that is the destination for this output group. You do not need to specify the individual inputs in MediaPackage; MediaLive will handle the connection of the two MediaLive pipelines to the two MediaPackage inputs. The MediaPackage channel and MediaLive channel must be in the same region.
     */
    ChannelId?: __stringMin1;
  }
  export interface MediaPackageOutputSettings {
  }
  export interface MotionGraphicsActivateScheduleActionSettings {
    /**
     * Duration (in milliseconds) that motion graphics should render on to the video stream. Leaving out this property or setting to 0 will result in rendering continuing until a deactivate action is processed.
     */
    Duration?: __longMin0Max86400000;
    /**
     * Key used to extract the password from EC2 Parameter store
     */
    PasswordParam?: __string;
    /**
     * URI of the HTML5 content to be rendered into the live stream.
     */
    Url?: __string;
    /**
     * Documentation update needed
     */
    Username?: __string;
  }
  export interface MotionGraphicsConfiguration {
    MotionGraphicsInsertion?: MotionGraphicsInsertion;
    /**
     * Motion Graphics Settings
     */
    MotionGraphicsSettings: MotionGraphicsSettings;
  }
  export interface MotionGraphicsDeactivateScheduleActionSettings {
  }
  export type MotionGraphicsInsertion = "DISABLED"|"ENABLED"|string;
  export interface MotionGraphicsSettings {
    HtmlMotionGraphicsSettings?: HtmlMotionGraphicsSettings;
  }
  export type Mp2CodingMode = "CODING_MODE_1_0"|"CODING_MODE_2_0"|string;
  export interface Mp2Settings {
    /**
     * Average bitrate in bits/second.
     */
    Bitrate?: __double;
    /**
     * The MPEG2 Audio coding mode.  Valid values are codingMode10 (for mono) or codingMode20 (for stereo).
     */
    CodingMode?: Mp2CodingMode;
    /**
     * Sample rate in Hz.
     */
    SampleRate?: __double;
  }
  export type Mpeg2AdaptiveQuantization = "AUTO"|"HIGH"|"LOW"|"MEDIUM"|"OFF"|string;
  export type Mpeg2ColorMetadata = "IGNORE"|"INSERT"|string;
  export type Mpeg2ColorSpace = "AUTO"|"PASSTHROUGH"|string;
  export type Mpeg2DisplayRatio = "DISPLAYRATIO16X9"|"DISPLAYRATIO4X3"|string;
  export interface Mpeg2FilterSettings {
    TemporalFilterSettings?: TemporalFilterSettings;
  }
  export type Mpeg2GopSizeUnits = "FRAMES"|"SECONDS"|string;
  export type Mpeg2ScanType = "INTERLACED"|"PROGRESSIVE"|string;
  export interface Mpeg2Settings {
    /**
     * Choose Off to disable adaptive quantization. Or choose another value to enable the quantizer and set its strength. The strengths are: Auto, Off, Low, Medium, High. When you enable this field, MediaLive allows intra-frame quantizers to vary, which might improve visual quality.
     */
    AdaptiveQuantization?: Mpeg2AdaptiveQuantization;
    /**
     * Indicates the AFD values that MediaLive will write into the video encode. If you do not know what AFD signaling is, or if your downstream system has not given you guidance, choose AUTO.
AUTO: MediaLive will try to preserve the input AFD value (in cases where multiple AFD values are valid).
FIXED: MediaLive will use the value you specify in fixedAFD.
     */
    AfdSignaling?: AfdSignaling;
    /**
     * Specifies whether to include the color space metadata. The metadata describes the color space that applies to the video (the colorSpace field). We recommend that you insert the metadata.
     */
    ColorMetadata?: Mpeg2ColorMetadata;
    /**
     * Choose the type of color space conversion to apply to the output. For detailed information on setting up both the input and the output to obtain the desired color space in the output, see the section on \"MediaLive Features - Video - color space\" in the MediaLive User Guide.
PASSTHROUGH: Keep the color space of the input content - do not convert it.
AUTO:Convert all content that is SD to rec 601, and convert all content that is HD to rec 709.
     */
    ColorSpace?: Mpeg2ColorSpace;
    /**
     * Sets the pixel aspect ratio for the encode.
     */
    DisplayAspectRatio?: Mpeg2DisplayRatio;
    /**
     * Optionally specify a noise reduction filter, which can improve quality of compressed content. If you do not choose a filter, no filter will be applied.
TEMPORAL: This filter is useful for both source content that is noisy (when it has excessive digital artifacts) and source content that is clean.
When the content is noisy, the filter cleans up the source content before the encoding phase, with these two effects: First, it improves the output video quality because the content has been cleaned up. Secondly, it decreases the bandwidth because MediaLive does not waste bits on encoding noise.
When the content is reasonably clean, the filter tends to decrease the bitrate.
     */
    FilterSettings?: Mpeg2FilterSettings;
    /**
     * Complete this field only when afdSignaling is set to FIXED. Enter the AFD value (4 bits) to write on all frames of the video encode.
     */
    FixedAfd?: FixedAfd;
    /**
     * description": "The framerate denominator. For example, 1001. The framerate is the numerator divided by the denominator. For example, 24000 / 1001 = 23.976 FPS.
     */
    FramerateDenominator: __integerMin1;
    /**
     * The framerate numerator. For example, 24000. The framerate is the numerator divided by the denominator. For example, 24000 / 1001 = 23.976 FPS.
     */
    FramerateNumerator: __integerMin1;
    /**
     * MPEG2: default is open GOP.
     */
    GopClosedCadence?: __integerMin0;
    /**
     * Relates to the GOP structure. The number of B-frames between reference frames. If you do not know what a B-frame is, use the default.
     */
    GopNumBFrames?: __integerMin0Max7;
    /**
     * Relates to the GOP structure. The GOP size (keyframe interval) in the units specified in gopSizeUnits. If you do not know what GOP is, use the default.
If gopSizeUnits is frames, then the gopSize must be an integer and must be greater than or equal to 1.
If gopSizeUnits is seconds, the gopSize must be greater than 0, but does not need to be an integer.
     */
    GopSize?: __double;
    /**
     * Relates to the GOP structure. Specifies whether the gopSize is specified in frames or seconds. If you do not plan to change the default gopSize, leave the default. If you specify SECONDS, MediaLive will internally convert the gop size to a frame count.
     */
    GopSizeUnits?: Mpeg2GopSizeUnits;
    /**
     * Set the scan type of the output to PROGRESSIVE or INTERLACED (top field first).
     */
    ScanType?: Mpeg2ScanType;
    /**
     * Relates to the GOP structure. If you do not know what GOP is, use the default.
FIXED: Set the number of B-frames in each sub-GOP to the value in gopNumBFrames.
DYNAMIC: Let MediaLive optimize the number of B-frames in each sub-GOP, to improve visual quality.
     */
    SubgopLength?: Mpeg2SubGopLength;
    /**
     * Determines how MediaLive inserts timecodes in the output video. For detailed information about setting up the input and the output for a timecode, see the section on \"MediaLive Features - Timecode configuration\" in the MediaLive User Guide.
DISABLED: do not include timecodes.
GOP_TIMECODE: Include timecode metadata in the GOP header.
     */
    TimecodeInsertion?: Mpeg2TimecodeInsertionBehavior;
    /**
     * Timecode burn-in settings
     */
    TimecodeBurninSettings?: TimecodeBurninSettings;
  }
  export type Mpeg2SubGopLength = "DYNAMIC"|"FIXED"|string;
  export type Mpeg2TimecodeInsertionBehavior = "DISABLED"|"GOP_TIMECODE"|string;
  export interface MsSmoothGroupSettings {
    /**
     * The ID to include in each message in the sparse track. Ignored if sparseTrackType is NONE.
     */
    AcquisitionPointId?: __string;
    /**
     * If set to passthrough for an audio-only MS Smooth output, the fragment absolute time will be set to the current timecode. This option does not write timecodes to the audio elementary stream.
     */
    AudioOnlyTimecodeControl?: SmoothGroupAudioOnlyTimecodeControl;
    /**
     * If set to verifyAuthenticity, verify the https certificate chain to a trusted Certificate Authority (CA).  This will cause https outputs to self-signed certificates to fail.
     */
    CertificateMode?: SmoothGroupCertificateMode;
    /**
     * Number of seconds to wait before retrying connection to the IIS server if the connection is lost. Content will be cached during this time and the cache will be be delivered to the IIS server once the connection is re-established.
     */
    ConnectionRetryInterval?: __integerMin0;
    /**
     * Smooth Streaming publish point on an IIS server. Elemental Live acts as a "Push" encoder to IIS.
     */
    Destination: OutputLocationRef;
    /**
     * MS Smooth event ID to be sent to the IIS server.

Should only be specified if eventIdMode is set to useConfigured.
     */
    EventId?: __string;
    /**
     * Specifies whether or not to send an event ID to the IIS server. If no event ID is sent and the same Live Event is used without changing the publishing point, clients might see cached video from the previous run.

Options:
- "useConfigured" - use the value provided in eventId
- "useTimestamp" - generate and send an event ID based on the current timestamp
- "noEventId" - do not send an event ID to the IIS server.
     */
    EventIdMode?: SmoothGroupEventIdMode;
    /**
     * When set to sendEos, send EOS signal to IIS server when stopping the event
     */
    EventStopBehavior?: SmoothGroupEventStopBehavior;
    /**
     * Size in seconds of file cache for streaming outputs.
     */
    FilecacheDuration?: __integerMin0;
    /**
     * Length of mp4 fragments to generate (in seconds). Fragment length must be compatible with GOP size and framerate.
     */
    FragmentLength?: __integerMin1;
    /**
     * Parameter that control output group behavior on input loss.
     */
    InputLossAction?: InputLossActionForMsSmoothOut;
    /**
     * Number of retry attempts.
     */
    NumRetries?: __integerMin0;
    /**
     * Number of seconds before initiating a restart due to output failure, due to exhausting the numRetries on one segment, or exceeding filecacheDuration.
     */
    RestartDelay?: __integerMin0;
    /**
     * useInputSegmentation has been deprecated. The configured segment size is always used.
     */
    SegmentationMode?: SmoothGroupSegmentationMode;
    /**
     * Number of milliseconds to delay the output from the second pipeline.
     */
    SendDelayMs?: __integerMin0Max10000;
    /**
     * Identifies the type of data to place in the sparse track:
- SCTE35: Insert SCTE-35 messages from the source content. With each message, insert an IDR frame to start a new segment.
- SCTE35_WITHOUT_SEGMENTATION: Insert SCTE-35 messages from the source content. With each message, insert an IDR frame but don't start a new segment.
- NONE: Don't generate a sparse track for any outputs in this output group.
     */
    SparseTrackType?: SmoothGroupSparseTrackType;
    /**
     * When set to send, send stream manifest so publishing point doesn't start until all streams start.
     */
    StreamManifestBehavior?: SmoothGroupStreamManifestBehavior;
    /**
     * Timestamp offset for the event.  Only used if timestampOffsetMode is set to useConfiguredOffset.
     */
    TimestampOffset?: __string;
    /**
     * Type of timestamp date offset to use.
- useEventStartDate: Use the date the event was started as the offset
- useConfiguredOffset: Use an explicitly configured date as the offset
     */
    TimestampOffsetMode?: SmoothGroupTimestampOffsetMode;
  }
  export type MsSmoothH265PackagingType = "HEV1"|"HVC1"|string;
  export interface MsSmoothOutputSettings {
    /**
     * Only applicable when this output is referencing an H.265 video description.
Specifies whether MP4 segments should be packaged as HEV1 or HVC1.
     */
    H265PackagingType?: MsSmoothH265PackagingType;
    /**
     * String concatenated to the end of the destination filename.  Required for multiple outputs of the same type.
     */
    NameModifier?: __string;
  }
  export interface Multiplex {
    /**
     * The unique arn of the multiplex.
     */
    Arn?: __string;
    /**
     * A list of availability zones for the multiplex.
     */
    AvailabilityZones?: __listOf__string;
    /**
     * A list of the multiplex output destinations.
     */
    Destinations?: __listOfMultiplexOutputDestination;
    /**
     * The unique id of the multiplex.
     */
    Id?: __string;
    /**
     * Configuration for a multiplex event.
     */
    MultiplexSettings?: MultiplexSettings;
    /**
     * The name of the multiplex.
     */
    Name?: __string;
    /**
     * The number of currently healthy pipelines.
     */
    PipelinesRunningCount?: __integer;
    /**
     * The number of programs in the multiplex.
     */
    ProgramCount?: __integer;
    /**
     * The current state of the multiplex.
     */
    State?: MultiplexState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
  }
  export interface MultiplexGroupSettings {
  }
  export interface MultiplexMediaConnectOutputDestinationSettings {
    /**
     * The MediaConnect entitlement ARN available as a Flow source.
     */
    EntitlementArn?: __stringMin1;
  }
  export interface MultiplexOutputDestination {
    /**
     * Multiplex MediaConnect output destination settings.
     */
    MediaConnectSettings?: MultiplexMediaConnectOutputDestinationSettings;
  }
  export interface MultiplexOutputSettings {
    /**
     * Destination is a Multiplex.
     */
    Destination: OutputLocationRef;
  }
  export interface MultiplexProgram {
    /**
     * The MediaLive channel associated with the program.
     */
    ChannelId?: __string;
    /**
     * The settings for this multiplex program.
     */
    MultiplexProgramSettings?: MultiplexProgramSettings;
    /**
     * The packet identifier map for this multiplex program.
     */
    PacketIdentifiersMap?: MultiplexProgramPacketIdentifiersMap;
    /**
     * Contains information about the current sources for the specified program in the specified multiplex. Keep in mind that each multiplex pipeline connects to both pipelines in a given source channel (the channel identified by the program). But only one of those channel pipelines is ever active at one time.
     */
    PipelineDetails?: __listOfMultiplexProgramPipelineDetail;
    /**
     * The name of the multiplex program.
     */
    ProgramName?: __string;
  }
  export interface MultiplexProgramChannelDestinationSettings {
    /**
     * The ID of the Multiplex that the encoder is providing output to. You do not need to specify the individual inputs to the Multiplex; MediaLive will handle the connection of the two MediaLive pipelines to the two Multiplex instances.
The Multiplex must be in the same region as the Channel.
     */
    MultiplexId?: __stringMin1;
    /**
     * The program name of the Multiplex program that the encoder is providing output to.
     */
    ProgramName?: __stringMin1;
  }
  export interface MultiplexProgramPacketIdentifiersMap {
    AudioPids?: __listOf__integer;
    DvbSubPids?: __listOf__integer;
    DvbTeletextPid?: __integer;
    EtvPlatformPid?: __integer;
    EtvSignalPid?: __integer;
    KlvDataPids?: __listOf__integer;
    PcrPid?: __integer;
    PmtPid?: __integer;
    PrivateMetadataPid?: __integer;
    Scte27Pids?: __listOf__integer;
    Scte35Pid?: __integer;
    TimedMetadataPid?: __integer;
    VideoPid?: __integer;
  }
  export interface MultiplexProgramPipelineDetail {
    /**
     * Identifies the channel pipeline that is currently active for the pipeline (identified by PipelineId) in the multiplex.
     */
    ActiveChannelPipeline?: __string;
    /**
     * Identifies a specific pipeline in the multiplex.
     */
    PipelineId?: __string;
  }
  export interface MultiplexProgramServiceDescriptor {
    /**
     * Name of the provider.
     */
    ProviderName: __stringMax256;
    /**
     * Name of the service.
     */
    ServiceName: __stringMax256;
  }
  export interface MultiplexProgramSettings {
    /**
     * Indicates which pipeline is preferred by the multiplex for program ingest.
     */
    PreferredChannelPipeline?: PreferredChannelPipeline;
    /**
     * Unique program number.
     */
    ProgramNumber: __integerMin0Max65535;
    /**
     * Transport stream service descriptor configuration for the Multiplex program.
     */
    ServiceDescriptor?: MultiplexProgramServiceDescriptor;
    /**
     * Program video settings configuration.
     */
    VideoSettings?: MultiplexVideoSettings;
  }
  export interface MultiplexProgramSummary {
    /**
     * The MediaLive Channel associated with the program.
     */
    ChannelId?: __string;
    /**
     * The name of the multiplex program.
     */
    ProgramName?: __string;
  }
  export interface MultiplexSettings {
    /**
     * Maximum video buffer delay in milliseconds.
     */
    MaximumVideoBufferDelayMilliseconds?: __integerMin800Max3000;
    /**
     * Transport stream bit rate.
     */
    TransportStreamBitrate: __integerMin1000000Max100000000;
    /**
     * Transport stream ID.
     */
    TransportStreamId: __integerMin0Max65535;
    /**
     * Transport stream reserved bit rate.
     */
    TransportStreamReservedBitrate?: __integerMin0Max100000000;
  }
  export interface MultiplexSettingsSummary {
    /**
     * Transport stream bit rate.
     */
    TransportStreamBitrate?: __integerMin1000000Max100000000;
  }
  export type MultiplexState = "CREATING"|"CREATE_FAILED"|"IDLE"|"STARTING"|"RUNNING"|"RECOVERING"|"STOPPING"|"DELETING"|"DELETED"|string;
  export interface MultiplexStatmuxVideoSettings {
    /**
     * Maximum statmux bitrate.
     */
    MaximumBitrate?: __integerMin100000Max100000000;
    /**
     * Minimum statmux bitrate.
     */
    MinimumBitrate?: __integerMin100000Max100000000;
    /**
     * The purpose of the priority is to use a combination of the\nmultiplex rate control algorithm and the QVBR capability of the\nencoder to prioritize the video quality of some channels in a\nmultiplex over others.  Channels that have a higher priority will\nget higher video quality at the expense of the video quality of\nother channels in the multiplex with lower priority.
     */
    Priority?: __integerMinNegative5Max5;
  }
  export interface MultiplexSummary {
    /**
     * The unique arn of the multiplex.
     */
    Arn?: __string;
    /**
     * A list of availability zones for the multiplex.
     */
    AvailabilityZones?: __listOf__string;
    /**
     * The unique id of the multiplex.
     */
    Id?: __string;
    /**
     * Configuration for a multiplex event.
     */
    MultiplexSettings?: MultiplexSettingsSummary;
    /**
     * The name of the multiplex.
     */
    Name?: __string;
    /**
     * The number of currently healthy pipelines.
     */
    PipelinesRunningCount?: __integer;
    /**
     * The number of programs in the multiplex.
     */
    ProgramCount?: __integer;
    /**
     * The current state of the multiplex.
     */
    State?: MultiplexState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
  }
  export interface MultiplexVideoSettings {
    /**
     * The constant bitrate configuration for the video encode.
When this field is defined, StatmuxSettings must be undefined.
     */
    ConstantBitrate?: __integerMin100000Max100000000;
    /**
     * Statmux rate control settings.
When this field is defined, ConstantBitrate must be undefined.
     */
    StatmuxSettings?: MultiplexStatmuxVideoSettings;
  }
  export type NetworkInputServerValidation = "CHECK_CRYPTOGRAPHY_AND_VALIDATE_NAME"|"CHECK_CRYPTOGRAPHY_ONLY"|string;
  export interface NetworkInputSettings {
    /**
     * Specifies HLS input settings when the uri is for a HLS manifest.
     */
    HlsInputSettings?: HlsInputSettings;
    /**
     * Check HTTPS server certificates. When set to checkCryptographyOnly, cryptography in the certificate will be checked, but not the server's name. Certain subdomains (notably S3 buckets that use dots in the bucket name) do not strictly match the corresponding certificate's wildcard pattern and would otherwise cause the event to error. This setting is ignored for protocols that do not use https.
     */
    ServerValidation?: NetworkInputServerValidation;
  }
  export interface NielsenCBET {
    /**
     * Enter the CBET check digits to use in the watermark.
     */
    CbetCheckDigitString: __stringMin2Max2;
    /**
     * Determines the method of CBET insertion mode when prior encoding is detected on the same layer.
     */
    CbetStepaside: NielsenWatermarksCbetStepaside;
    /**
     * Enter the CBET Source ID (CSID) to use in the watermark
     */
    Csid: __stringMin1Max7;
  }
  export interface NielsenConfiguration {
    /**
     * Enter the Distributor ID assigned to your organization by Nielsen.
     */
    DistributorId?: __string;
    /**
     * Enables Nielsen PCM to ID3 tagging
     */
    NielsenPcmToId3Tagging?: NielsenPcmToId3TaggingState;
  }
  export interface NielsenNaesIiNw {
    /**
     * Enter the check digit string for the watermark
     */
    CheckDigitString: __stringMin2Max2;
    /**
     * Enter the Nielsen Source ID (SID) to include in the watermark
     */
    Sid: __doubleMin1Max65535;
    /**
     * Choose the timezone for the time stamps in the watermark. If not provided,
the timestamps will be in Coordinated Universal Time (UTC)
     */
    Timezone?: NielsenWatermarkTimezones;
  }
  export type NielsenPcmToId3TaggingState = "DISABLED"|"ENABLED"|string;
  export type NielsenWatermarkTimezones = "AMERICA_PUERTO_RICO"|"US_ALASKA"|"US_ARIZONA"|"US_CENTRAL"|"US_EASTERN"|"US_HAWAII"|"US_MOUNTAIN"|"US_PACIFIC"|"US_SAMOA"|"UTC"|string;
  export type NielsenWatermarksCbetStepaside = "DISABLED"|"ENABLED"|string;
  export type NielsenWatermarksDistributionTypes = "FINAL_DISTRIBUTOR"|"PROGRAM_CONTENT"|string;
  export interface NielsenWatermarksSettings {
    /**
     * Complete these fields only if you want to insert watermarks of type Nielsen CBET
     */
    NielsenCbetSettings?: NielsenCBET;
    /**
     * Choose the distribution types that you want to assign to the watermarks:
- PROGRAM_CONTENT
- FINAL_DISTRIBUTOR
     */
    NielsenDistributionType?: NielsenWatermarksDistributionTypes;
    /**
     * Complete these fields only if you want to insert watermarks of type Nielsen NAES II (N2) and Nielsen NAES VI (NW).
     */
    NielsenNaesIiNwSettings?: NielsenNaesIiNw;
  }
  export interface Offering {
    /**
     * Unique offering ARN, e.g. 'arn:aws:medialive:us-west-2:123456789012:offering:87654321'
     */
    Arn?: __string;
    /**
     * Currency code for usagePrice and fixedPrice in ISO-4217 format, e.g. 'USD'
     */
    CurrencyCode?: __string;
    /**
     * Lease duration, e.g. '12'
     */
    Duration?: __integer;
    /**
     * Units for duration, e.g. 'MONTHS'
     */
    DurationUnits?: OfferingDurationUnits;
    /**
     * One-time charge for each reserved resource, e.g. '0.0' for a NO_UPFRONT offering
     */
    FixedPrice?: __double;
    /**
     * Offering description, e.g. 'HD AVC output at 10-20 Mbps, 30 fps, and standard VQ in US West (Oregon)'
     */
    OfferingDescription?: __string;
    /**
     * Unique offering ID, e.g. '87654321'
     */
    OfferingId?: __string;
    /**
     * Offering type, e.g. 'NO_UPFRONT'
     */
    OfferingType?: OfferingType;
    /**
     * AWS region, e.g. 'us-west-2'
     */
    Region?: __string;
    /**
     * Resource configuration details
     */
    ResourceSpecification?: ReservationResourceSpecification;
    /**
     * Recurring usage charge for each reserved resource, e.g. '157.0'
     */
    UsagePrice?: __double;
  }
  export type OfferingDurationUnits = "MONTHS"|string;
  export type OfferingType = "NO_UPFRONT"|string;
  export interface Output {
    /**
     * The names of the AudioDescriptions used as audio sources for this output.
     */
    AudioDescriptionNames?: __listOf__string;
    /**
     * The names of the CaptionDescriptions used as caption sources for this output.
     */
    CaptionDescriptionNames?: __listOf__string;
    /**
     * The name used to identify an output.
     */
    OutputName?: __stringMin1Max255;
    /**
     * Output type-specific settings.
     */
    OutputSettings: OutputSettings;
    /**
     * The name of the VideoDescription used as the source for this output.
     */
    VideoDescriptionName?: __string;
  }
  export interface OutputDestination {
    /**
     * User-specified id. This is used in an output group or an output.
     */
    Id?: __string;
    /**
     * Destination settings for a MediaPackage output; one destination for both encoders.
     */
    MediaPackageSettings?: __listOfMediaPackageOutputDestinationSettings;
    /**
     * Destination settings for a Multiplex output; one destination for both encoders.
     */
    MultiplexSettings?: MultiplexProgramChannelDestinationSettings;
    /**
     * Destination settings for a standard output; one destination for each redundant encoder.
     */
    Settings?: __listOfOutputDestinationSettings;
  }
  export interface OutputDestinationSettings {
    /**
     * key used to extract the password from EC2 Parameter store
     */
    PasswordParam?: __string;
    /**
     * Stream name for RTMP destinations (URLs of type rtmp://)
     */
    StreamName?: __string;
    /**
     * A URL specifying a destination
     */
    Url?: __string;
    /**
     * username for destination
     */
    Username?: __string;
  }
  export interface OutputGroup {
    /**
     * Custom output group name optionally defined by the user.
     */
    Name?: __stringMax32;
    /**
     * Settings associated with the output group.
     */
    OutputGroupSettings: OutputGroupSettings;
    Outputs: __listOfOutput;
  }
  export interface OutputGroupSettings {
    ArchiveGroupSettings?: ArchiveGroupSettings;
    FrameCaptureGroupSettings?: FrameCaptureGroupSettings;
    HlsGroupSettings?: HlsGroupSettings;
    MediaPackageGroupSettings?: MediaPackageGroupSettings;
    MsSmoothGroupSettings?: MsSmoothGroupSettings;
    MultiplexGroupSettings?: MultiplexGroupSettings;
    RtmpGroupSettings?: RtmpGroupSettings;
    UdpGroupSettings?: UdpGroupSettings;
  }
  export interface OutputLocationRef {
    DestinationRefId?: __string;
  }
  export interface OutputLockingSettings {
    EpochLockingSettings?: EpochLockingSettings;
    PipelineLockingSettings?: PipelineLockingSettings;
  }
  export interface OutputSettings {
    ArchiveOutputSettings?: ArchiveOutputSettings;
    FrameCaptureOutputSettings?: FrameCaptureOutputSettings;
    HlsOutputSettings?: HlsOutputSettings;
    MediaPackageOutputSettings?: MediaPackageOutputSettings;
    MsSmoothOutputSettings?: MsSmoothOutputSettings;
    MultiplexOutputSettings?: MultiplexOutputSettings;
    RtmpOutputSettings?: RtmpOutputSettings;
    UdpOutputSettings?: UdpOutputSettings;
  }
  export interface PassThroughSettings {
  }
  export interface PauseStateScheduleActionSettings {
    Pipelines?: __listOfPipelinePauseStateSettings;
  }
  export interface PipelineDetail {
    /**
     * The name of the active input attachment currently being ingested by this pipeline.
     */
    ActiveInputAttachmentName?: __string;
    /**
     * The name of the input switch schedule action that occurred most recently and that resulted in the switch to the current input attachment for this pipeline.
     */
    ActiveInputSwitchActionName?: __string;
    /**
     * The name of the motion graphics activate action that occurred most recently and that resulted in the current graphics URI for this pipeline.
     */
    ActiveMotionGraphicsActionName?: __string;
    /**
     * The current URI being used for HTML5 motion graphics for this pipeline.
     */
    ActiveMotionGraphicsUri?: __string;
    /**
     * Pipeline ID
     */
    PipelineId?: __string;
  }
  export type PipelineId = "PIPELINE_0"|"PIPELINE_1"|string;
  export interface PipelineLockingSettings {
  }
  export interface PipelinePauseStateSettings {
    /**
     * Pipeline ID to pause ("PIPELINE_0" or "PIPELINE_1").
     */
    PipelineId: PipelineId;
  }
  export type PreferredChannelPipeline = "CURRENTLY_ACTIVE"|"PIPELINE_0"|"PIPELINE_1"|string;
  export interface PurchaseOfferingRequest {
    /**
     * Number of resources
     */
    Count: __integerMin1;
    /**
     * Name for the new reservation
     */
    Name?: __string;
    /**
     * Offering to purchase, e.g. '87654321'
     */
    OfferingId: __string;
    /**
     * Renewal settings for the reservation
     */
    RenewalSettings?: RenewalSettings;
    /**
     * Unique request ID to be specified. This is needed to prevent retries from creating multiple resources.
     */
    RequestId?: __string;
    /**
     * Requested reservation start time (UTC) in ISO-8601 format. The specified time must be between the first day of the current month and one year from now. If no value is given, the default is now.
     */
    Start?: __string;
    /**
     * A collection of key-value pairs
     */
    Tags?: Tags;
  }
  export interface PurchaseOfferingResponse {
    Reservation?: Reservation;
  }
  export interface RawSettings {
  }
  export type RebootInputDeviceForce = "NO"|"YES"|string;
  export interface RebootInputDeviceRequest {
    /**
     * Force a reboot of an input device. If the device is streaming, it will stop streaming and begin rebooting within a few seconds of sending the command. If the device was streaming prior to the reboot, the device will resume streaming when the reboot completes.
     */
    Force?: RebootInputDeviceForce;
    /**
     * The unique ID of the input device to reboot. For example, hd-123456789abcdef.
     */
    InputDeviceId: __string;
  }
  export interface RebootInputDeviceResponse {
  }
  export interface Rec601Settings {
  }
  export interface Rec709Settings {
  }
  export interface RejectInputDeviceTransferRequest {
    /**
     * The unique ID of the input device to reject. For example, hd-123456789abcdef.
     */
    InputDeviceId: __string;
  }
  export interface RejectInputDeviceTransferResponse {
  }
  export interface RemixSettings {
    /**
     * Mapping of input channels to output channels, with appropriate gain adjustments.
     */
    ChannelMappings: __listOfAudioChannelMapping;
    /**
     * Number of input channels to be used.
     */
    ChannelsIn?: __integerMin1Max16;
    /**
     * Number of output channels to be produced.
Valid values: 1, 2, 4, 6, 8
     */
    ChannelsOut?: __integerMin1Max8;
  }
  export interface RenewalSettings {
    /**
     * Automatic renewal status for the reservation
     */
    AutomaticRenewal?: ReservationAutomaticRenewal;
    /**
     * Count for the reservation renewal
     */
    RenewalCount?: __integerMin1;
  }
  export interface Reservation {
    /**
     * Unique reservation ARN, e.g. 'arn:aws:medialive:us-west-2:123456789012:reservation:1234567'
     */
    Arn?: __string;
    /**
     * Number of reserved resources
     */
    Count?: __integer;
    /**
     * Currency code for usagePrice and fixedPrice in ISO-4217 format, e.g. 'USD'
     */
    CurrencyCode?: __string;
    /**
     * Lease duration, e.g. '12'
     */
    Duration?: __integer;
    /**
     * Units for duration, e.g. 'MONTHS'
     */
    DurationUnits?: OfferingDurationUnits;
    /**
     * Reservation UTC end date and time in ISO-8601 format, e.g. '2019-03-01T00:00:00'
     */
    End?: __string;
    /**
     * One-time charge for each reserved resource, e.g. '0.0' for a NO_UPFRONT offering
     */
    FixedPrice?: __double;
    /**
     * User specified reservation name
     */
    Name?: __string;
    /**
     * Offering description, e.g. 'HD AVC output at 10-20 Mbps, 30 fps, and standard VQ in US West (Oregon)'
     */
    OfferingDescription?: __string;
    /**
     * Unique offering ID, e.g. '87654321'
     */
    OfferingId?: __string;
    /**
     * Offering type, e.g. 'NO_UPFRONT'
     */
    OfferingType?: OfferingType;
    /**
     * AWS region, e.g. 'us-west-2'
     */
    Region?: __string;
    /**
     * Renewal settings for the reservation
     */
    RenewalSettings?: RenewalSettings;
    /**
     * Unique reservation ID, e.g. '1234567'
     */
    ReservationId?: __string;
    /**
     * Resource configuration details
     */
    ResourceSpecification?: ReservationResourceSpecification;
    /**
     * Reservation UTC start date and time in ISO-8601 format, e.g. '2018-03-01T00:00:00'
     */
    Start?: __string;
    /**
     * Current state of reservation, e.g. 'ACTIVE'
     */
    State?: ReservationState;
    /**
     * A collection of key-value pairs
     */
    Tags?: Tags;
    /**
     * Recurring usage charge for each reserved resource, e.g. '157.0'
     */
    UsagePrice?: __double;
  }
  export type ReservationAutomaticRenewal = "DISABLED"|"ENABLED"|"UNAVAILABLE"|string;
  export type ReservationCodec = "MPEG2"|"AVC"|"HEVC"|"AUDIO"|"LINK"|string;
  export type ReservationMaximumBitrate = "MAX_10_MBPS"|"MAX_20_MBPS"|"MAX_50_MBPS"|string;
  export type ReservationMaximumFramerate = "MAX_30_FPS"|"MAX_60_FPS"|string;
  export type ReservationResolution = "SD"|"HD"|"FHD"|"UHD"|string;
  export interface ReservationResourceSpecification {
    /**
     * Channel class, e.g. 'STANDARD'
     */
    ChannelClass?: ChannelClass;
    /**
     * Codec, e.g. 'AVC'
     */
    Codec?: ReservationCodec;
    /**
     * Maximum bitrate, e.g. 'MAX_20_MBPS'
     */
    MaximumBitrate?: ReservationMaximumBitrate;
    /**
     * Maximum framerate, e.g. 'MAX_30_FPS' (Outputs only)
     */
    MaximumFramerate?: ReservationMaximumFramerate;
    /**
     * Resolution, e.g. 'HD'
     */
    Resolution?: ReservationResolution;
    /**
     * Resource type, 'INPUT', 'OUTPUT', 'MULTIPLEX', or 'CHANNEL'
     */
    ResourceType?: ReservationResourceType;
    /**
     * Special feature, e.g. 'AUDIO_NORMALIZATION' (Channels only)
     */
    SpecialFeature?: ReservationSpecialFeature;
    /**
     * Video quality, e.g. 'STANDARD' (Outputs only)
     */
    VideoQuality?: ReservationVideoQuality;
  }
  export type ReservationResourceType = "INPUT"|"OUTPUT"|"MULTIPLEX"|"CHANNEL"|string;
  export type ReservationSpecialFeature = "ADVANCED_AUDIO"|"AUDIO_NORMALIZATION"|"MGHD"|"MGUHD"|string;
  export type ReservationState = "ACTIVE"|"EXPIRED"|"CANCELED"|"DELETED"|string;
  export type ReservationVideoQuality = "STANDARD"|"ENHANCED"|"PREMIUM"|string;
  export type RtmpAdMarkers = "ON_CUE_POINT_SCTE35"|string;
  export type RtmpCacheFullBehavior = "DISCONNECT_IMMEDIATELY"|"WAIT_FOR_SERVER"|string;
  export type RtmpCaptionData = "ALL"|"FIELD1_608"|"FIELD1_AND_FIELD2_608"|string;
  export interface RtmpCaptionInfoDestinationSettings {
  }
  export interface RtmpGroupSettings {
    /**
     * Choose the ad marker type for this output group. MediaLive will create a message based on the content of each SCTE-35 message, format it for that marker type, and insert it in the datastream.
     */
    AdMarkers?: __listOfRtmpAdMarkers;
    /**
     * Authentication scheme to use when connecting with CDN
     */
    AuthenticationScheme?: AuthenticationScheme;
    /**
     * Controls behavior when content cache fills up. If remote origin server stalls the RTMP connection and does not accept content fast enough the 'Media Cache' will fill up. When the cache reaches the duration specified by cacheLength the cache will stop accepting new content. If set to disconnectImmediately, the RTMP output will force a disconnect. Clear the media cache, and reconnect after restartDelay seconds. If set to waitForServer, the RTMP output will wait up to 5 minutes to allow the origin server to begin accepting data again.
     */
    CacheFullBehavior?: RtmpCacheFullBehavior;
    /**
     * Cache length, in seconds, is used to calculate buffer size.
     */
    CacheLength?: __integerMin30;
    /**
     * Controls the types of data that passes to onCaptionInfo outputs.  If set to 'all' then 608 and 708 carried DTVCC data will be passed.  If set to 'field1AndField2608' then DTVCC data will be stripped out, but 608 data from both fields will be passed. If set to 'field1608' then only the data carried in 608 from field 1 video will be passed.
     */
    CaptionData?: RtmpCaptionData;
    /**
     * Controls the behavior of this RTMP group if input becomes unavailable.

- emitOutput: Emit a slate until input returns.
- pauseOutput: Stop transmitting data until input returns. This does not close the underlying RTMP connection.
     */
    InputLossAction?: InputLossActionForRtmpOut;
    /**
     * If a streaming output fails, number of seconds to wait until a restart is initiated. A value of 0 means never restart.
     */
    RestartDelay?: __integerMin0;
    /**
     * Applies only when the rate control mode (in the codec settings) is CBR (constant bit rate). Controls whether the RTMP output stream is padded (with FILL NAL units) in order to achieve a constant bit rate that is truly constant. When there is no padding, the bandwidth varies (up to the bitrate value in the codec settings). We recommend that you choose Auto.
     */
    IncludeFillerNalUnits?: IncludeFillerNalUnits;
  }
  export type RtmpOutputCertificateMode = "SELF_SIGNED"|"VERIFY_AUTHENTICITY"|string;
  export interface RtmpOutputSettings {
    /**
     * If set to verifyAuthenticity, verify the tls certificate chain to a trusted Certificate Authority (CA).  This will cause rtmps outputs with self-signed certificates to fail.
     */
    CertificateMode?: RtmpOutputCertificateMode;
    /**
     * Number of seconds to wait before retrying a connection to the Flash Media server if the connection is lost.
     */
    ConnectionRetryInterval?: __integerMin1;
    /**
     * The RTMP endpoint excluding the stream name (eg. rtmp://host/appname). For connection to Akamai, a username and password must be supplied. URI fields accept format identifiers.
     */
    Destination: OutputLocationRef;
    /**
     * Number of retry attempts.
     */
    NumRetries?: __integerMin0;
  }
  export type S3CannedAcl = "AUTHENTICATED_READ"|"BUCKET_OWNER_FULL_CONTROL"|"BUCKET_OWNER_READ"|"PUBLIC_READ"|string;
  export interface ScheduleAction {
    /**
     * The name of the action, must be unique within the schedule. This name provides the main reference to an action once it is added to the schedule. A name is unique if it is no longer in the schedule. The schedule is automatically cleaned up to remove actions with a start time of more than 1 hour ago (approximately) so at that point a name can be reused.
     */
    ActionName: __string;
    /**
     * Settings for this schedule action.
     */
    ScheduleActionSettings: ScheduleActionSettings;
    /**
     * The time for the action to start in the channel.
     */
    ScheduleActionStartSettings: ScheduleActionStartSettings;
  }
  export interface ScheduleActionSettings {
    /**
     * Action to insert HLS ID3 segment tagging
     */
    HlsId3SegmentTaggingSettings?: HlsId3SegmentTaggingScheduleActionSettings;
    /**
     * Action to insert HLS metadata
     */
    HlsTimedMetadataSettings?: HlsTimedMetadataScheduleActionSettings;
    /**
     * Action to prepare an input for a future immediate input switch
     */
    InputPrepareSettings?: InputPrepareScheduleActionSettings;
    /**
     * Action to switch the input
     */
    InputSwitchSettings?: InputSwitchScheduleActionSettings;
    /**
     * Action to activate a motion graphics image overlay
     */
    MotionGraphicsImageActivateSettings?: MotionGraphicsActivateScheduleActionSettings;
    /**
     * Action to deactivate a motion graphics image overlay
     */
    MotionGraphicsImageDeactivateSettings?: MotionGraphicsDeactivateScheduleActionSettings;
    /**
     * Action to pause or unpause one or both channel pipelines
     */
    PauseStateSettings?: PauseStateScheduleActionSettings;
    /**
     * Action to specify scte35 input
     */
    Scte35InputSettings?: Scte35InputScheduleActionSettings;
    /**
     * Action to insert SCTE-35 return_to_network message
     */
    Scte35ReturnToNetworkSettings?: Scte35ReturnToNetworkScheduleActionSettings;
    /**
     * Action to insert SCTE-35 splice_insert message
     */
    Scte35SpliceInsertSettings?: Scte35SpliceInsertScheduleActionSettings;
    /**
     * Action to insert SCTE-35 time_signal message
     */
    Scte35TimeSignalSettings?: Scte35TimeSignalScheduleActionSettings;
    /**
     * Action to activate a static image overlay
     */
    StaticImageActivateSettings?: StaticImageActivateScheduleActionSettings;
    /**
     * Action to deactivate a static image overlay
     */
    StaticImageDeactivateSettings?: StaticImageDeactivateScheduleActionSettings;
  }
  export interface ScheduleActionStartSettings {
    /**
     * Option for specifying the start time for an action.
     */
    FixedModeScheduleActionStartSettings?: FixedModeScheduleActionStartSettings;
    /**
     * Option for specifying an action as relative to another action.
     */
    FollowModeScheduleActionStartSettings?: FollowModeScheduleActionStartSettings;
    /**
     * Option for specifying an action that should be applied immediately.
     */
    ImmediateModeScheduleActionStartSettings?: ImmediateModeScheduleActionStartSettings;
  }
  export type Scte20Convert608To708 = "DISABLED"|"UPCONVERT"|string;
  export interface Scte20PlusEmbeddedDestinationSettings {
  }
  export interface Scte20SourceSettings {
    /**
     * If upconvert, 608 data is both passed through via the "608 compatibility bytes" fields of the 708 wrapper as well as translated into 708. 708 data present in the source content will be discarded.
     */
    Convert608To708?: Scte20Convert608To708;
    /**
     * Specifies the 608/708 channel number within the video track from which to extract captions. Unused for passthrough.
     */
    Source608ChannelNumber?: __integerMin1Max4;
  }
  export interface Scte27DestinationSettings {
  }
  export type Scte27OcrLanguage = "DEU"|"ENG"|"FRA"|"NLD"|"POR"|"SPA"|string;
  export interface Scte27SourceSettings {
    /**
     * If you will configure a WebVTT caption description that references this caption selector, use this field to
provide the language to consider when translating the image-based source to text.
     */
    OcrLanguage?: Scte27OcrLanguage;
    /**
     * The pid field is used in conjunction with the caption selector languageCode field as follows:
  - Specify PID and Language: Extracts captions from that PID; the language is "informational".
  - Specify PID and omit Language: Extracts the specified PID.
  - Omit PID and specify Language: Extracts the specified language, whichever PID that happens to be.
  - Omit PID and omit Language: Valid only if source is DVB-Sub that is being passed through; all languages will be passed through.
     */
    Pid?: __integerMin1;
  }
  export type Scte35AposNoRegionalBlackoutBehavior = "FOLLOW"|"IGNORE"|string;
  export type Scte35AposWebDeliveryAllowedBehavior = "FOLLOW"|"IGNORE"|string;
  export type Scte35ArchiveAllowedFlag = "ARCHIVE_NOT_ALLOWED"|"ARCHIVE_ALLOWED"|string;
  export interface Scte35DeliveryRestrictions {
    /**
     * Corresponds to SCTE-35 archive_allowed_flag.
     */
    ArchiveAllowedFlag: Scte35ArchiveAllowedFlag;
    /**
     * Corresponds to SCTE-35 device_restrictions parameter.
     */
    DeviceRestrictions: Scte35DeviceRestrictions;
    /**
     * Corresponds to SCTE-35 no_regional_blackout_flag parameter.
     */
    NoRegionalBlackoutFlag: Scte35NoRegionalBlackoutFlag;
    /**
     * Corresponds to SCTE-35 web_delivery_allowed_flag parameter.
     */
    WebDeliveryAllowedFlag: Scte35WebDeliveryAllowedFlag;
  }
  export interface Scte35Descriptor {
    /**
     * SCTE-35 Descriptor Settings.
     */
    Scte35DescriptorSettings: Scte35DescriptorSettings;
  }
  export interface Scte35DescriptorSettings {
    /**
     * SCTE-35 Segmentation Descriptor.
     */
    SegmentationDescriptorScte35DescriptorSettings: Scte35SegmentationDescriptor;
  }
  export type Scte35DeviceRestrictions = "NONE"|"RESTRICT_GROUP0"|"RESTRICT_GROUP1"|"RESTRICT_GROUP2"|string;
  export type Scte35InputMode = "FIXED"|"FOLLOW_ACTIVE"|string;
  export interface Scte35InputScheduleActionSettings {
    /**
     * In fixed mode, enter the name of the input attachment that you want to use as a SCTE-35 input. (Don't enter the ID of the input.)"
     */
    InputAttachmentNameReference?: __string;
    /**
     * Whether the SCTE-35 input should be the active input or a fixed input.
     */
    Mode: Scte35InputMode;
  }
  export type Scte35NoRegionalBlackoutFlag = "REGIONAL_BLACKOUT"|"NO_REGIONAL_BLACKOUT"|string;
  export interface Scte35ReturnToNetworkScheduleActionSettings {
    /**
     * The splice_event_id for the SCTE-35 splice_insert, as defined in SCTE-35.
     */
    SpliceEventId: __longMin0Max4294967295;
  }
  export type Scte35SegmentationCancelIndicator = "SEGMENTATION_EVENT_NOT_CANCELED"|"SEGMENTATION_EVENT_CANCELED"|string;
  export interface Scte35SegmentationDescriptor {
    /**
     * Holds the four SCTE-35 delivery restriction parameters.
     */
    DeliveryRestrictions?: Scte35DeliveryRestrictions;
    /**
     * Corresponds to SCTE-35 segment_num. A value that is valid for the specified segmentation_type_id.
     */
    SegmentNum?: __integerMin0Max255;
    /**
     * Corresponds to SCTE-35 segmentation_event_cancel_indicator.
     */
    SegmentationCancelIndicator: Scte35SegmentationCancelIndicator;
    /**
     * Corresponds to SCTE-35 segmentation_duration. Optional. The duration for the time_signal, in 90 KHz ticks. To convert seconds to ticks, multiple the seconds by 90,000. Enter time in 90 KHz clock ticks. If you do not enter a duration, the time_signal will continue until you insert a cancellation message.
     */
    SegmentationDuration?: __longMin0Max1099511627775;
    /**
     * Corresponds to SCTE-35 segmentation_event_id. 
     */
    SegmentationEventId: __longMin0Max4294967295;
    /**
     * Corresponds to SCTE-35 segmentation_type_id. One of the segmentation_type_id values listed in the SCTE-35 specification. On the console, enter the ID in decimal (for example, "52"). In the CLI, API, or an SDK, enter the ID in hex (for example, "0x34") or decimal (for example, "52").
     */
    SegmentationTypeId?: __integerMin0Max255;
    /**
     * Corresponds to SCTE-35 segmentation_upid. Enter a string containing the hexadecimal representation of the characters that make up the SCTE-35 segmentation_upid value. Must contain an even number of hex characters. Do not include spaces between each hex pair. For example, the ASCII "ADS Information" becomes hex "41445320496e666f726d6174696f6e.
     */
    SegmentationUpid?: __string;
    /**
     * Corresponds to SCTE-35 segmentation_upid_type. On the console, enter one of the types listed in the SCTE-35 specification, converted to a decimal. For example, "0x0C" hex from the specification is "12" in decimal. In the CLI, API, or an SDK, enter one of the types listed in the SCTE-35 specification, in either hex (for example, "0x0C" ) or in decimal (for example, "12").
     */
    SegmentationUpidType?: __integerMin0Max255;
    /**
     * Corresponds to SCTE-35 segments_expected. A value that is valid for the specified segmentation_type_id.
     */
    SegmentsExpected?: __integerMin0Max255;
    /**
     * Corresponds to SCTE-35 sub_segment_num. A value that is valid for the specified segmentation_type_id.
     */
    SubSegmentNum?: __integerMin0Max255;
    /**
     * Corresponds to SCTE-35 sub_segments_expected. A value that is valid for the specified segmentation_type_id.
     */
    SubSegmentsExpected?: __integerMin0Max255;
  }
  export interface Scte35SpliceInsert {
    /**
     * When specified, this offset (in milliseconds) is added to the input Ad Avail PTS time. This only applies to embedded SCTE 104/35 messages and does not apply to OOB messages.
     */
    AdAvailOffset?: __integerMinNegative1000Max1000;
    /**
     * When set to ignore, Segment Descriptors with noRegionalBlackoutFlag set to 0 will no longer trigger blackouts or Ad Avail slates
     */
    NoRegionalBlackoutFlag?: Scte35SpliceInsertNoRegionalBlackoutBehavior;
    /**
     * When set to ignore, Segment Descriptors with webDeliveryAllowedFlag set to 0 will no longer trigger blackouts or Ad Avail slates
     */
    WebDeliveryAllowedFlag?: Scte35SpliceInsertWebDeliveryAllowedBehavior;
  }
  export type Scte35SpliceInsertNoRegionalBlackoutBehavior = "FOLLOW"|"IGNORE"|string;
  export interface Scte35SpliceInsertScheduleActionSettings {
    /**
     * Optional, the duration for the splice_insert, in 90 KHz ticks. To convert seconds to ticks, multiple the seconds by 90,000. If you enter a duration, there is an expectation that the downstream system can read the duration and cue in at that time. If you do not enter a duration, the splice_insert will continue indefinitely and there is an expectation that you will enter a return_to_network to end the splice_insert at the appropriate time.
     */
    Duration?: __longMin0Max8589934591;
    /**
     * The splice_event_id for the SCTE-35 splice_insert, as defined in SCTE-35.
     */
    SpliceEventId: __longMin0Max4294967295;
  }
  export type Scte35SpliceInsertWebDeliveryAllowedBehavior = "FOLLOW"|"IGNORE"|string;
  export interface Scte35TimeSignalApos {
    /**
     * When specified, this offset (in milliseconds) is added to the input Ad Avail PTS time. This only applies to embedded SCTE 104/35 messages and does not apply to OOB messages.
     */
    AdAvailOffset?: __integerMinNegative1000Max1000;
    /**
     * When set to ignore, Segment Descriptors with noRegionalBlackoutFlag set to 0 will no longer trigger blackouts or Ad Avail slates
     */
    NoRegionalBlackoutFlag?: Scte35AposNoRegionalBlackoutBehavior;
    /**
     * When set to ignore, Segment Descriptors with webDeliveryAllowedFlag set to 0 will no longer trigger blackouts or Ad Avail slates
     */
    WebDeliveryAllowedFlag?: Scte35AposWebDeliveryAllowedBehavior;
  }
  export interface Scte35TimeSignalScheduleActionSettings {
    /**
     * The list of SCTE-35 descriptors accompanying the SCTE-35 time_signal.
     */
    Scte35Descriptors: __listOfScte35Descriptor;
  }
  export type Scte35WebDeliveryAllowedFlag = "WEB_DELIVERY_NOT_ALLOWED"|"WEB_DELIVERY_ALLOWED"|string;
  export interface UpdateAccountConfigurationRequest {
    AccountConfiguration?: AccountConfiguration;
  }
  export interface UpdateAccountConfigurationResponse {
    AccountConfiguration?: AccountConfiguration;
  }
  export type SmoothGroupAudioOnlyTimecodeControl = "PASSTHROUGH"|"USE_CONFIGURED_CLOCK"|string;
  export type SmoothGroupCertificateMode = "SELF_SIGNED"|"VERIFY_AUTHENTICITY"|string;
  export type SmoothGroupEventIdMode = "NO_EVENT_ID"|"USE_CONFIGURED"|"USE_TIMESTAMP"|string;
  export type SmoothGroupEventStopBehavior = "NONE"|"SEND_EOS"|string;
  export type SmoothGroupSegmentationMode = "USE_INPUT_SEGMENTATION"|"USE_SEGMENT_DURATION"|string;
  export type SmoothGroupSparseTrackType = "NONE"|"SCTE_35"|"SCTE_35_WITHOUT_SEGMENTATION"|string;
  export type SmoothGroupStreamManifestBehavior = "DO_NOT_SEND"|"SEND"|string;
  export type SmoothGroupTimestampOffsetMode = "USE_CONFIGURED_OFFSET"|"USE_EVENT_START_DATE"|string;
  export type Smpte2038DataPreference = "IGNORE"|"PREFER"|string;
  export interface SmpteTtDestinationSettings {
  }
  export interface StandardHlsSettings {
    /**
     * List all the audio groups that are used with the video output stream. Input all the audio GROUP-IDs that are associated to the video, separate by ','.
     */
    AudioRenditionSets?: __string;
    M3u8Settings: M3u8Settings;
  }
  export interface StartChannelRequest {
    /**
     * A request to start a channel
     */
    ChannelId: __string;
  }
  export interface StartChannelResponse {
    /**
     * The unique arn of the channel.
     */
    Arn?: __string;
    /**
     * Specification of CDI inputs for this channel
     */
    CdiInputSpecification?: CdiInputSpecification;
    /**
     * The class for this channel. STANDARD for a channel with two pipelines or SINGLE_PIPELINE for a channel with one pipeline.
     */
    ChannelClass?: ChannelClass;
    /**
     * A list of destinations of the channel. For UDP outputs, there is one
destination per output. For other types (HLS, for example), there is
one destination per packager.

     */
    Destinations?: __listOfOutputDestination;
    /**
     * The endpoints where outgoing connections initiate from
     */
    EgressEndpoints?: __listOfChannelEgressEndpoint;
    EncoderSettings?: EncoderSettings;
    /**
     * The unique id of the channel.
     */
    Id?: __string;
    /**
     * List of input attachments for channel.
     */
    InputAttachments?: __listOfInputAttachment;
    /**
     * Specification of network and file inputs for this channel
     */
    InputSpecification?: InputSpecification;
    /**
     * The log level being written to CloudWatch Logs.
     */
    LogLevel?: LogLevel;
    /**
     * Maintenance settings for this channel.
     */
    Maintenance?: MaintenanceStatus;
    /**
     * The name of the channel. (user-mutable)
     */
    Name?: __string;
    /**
     * Runtime details for the pipelines of a running channel.
     */
    PipelineDetails?: __listOfPipelineDetail;
    /**
     * The number of currently healthy pipelines.
     */
    PipelinesRunningCount?: __integer;
    /**
     * The Amazon Resource Name (ARN) of the role assumed when running the Channel.
     */
    RoleArn?: __string;
    State?: ChannelState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    /**
     * Settings for VPC output
     */
    Vpc?: VpcOutputSettingsDescription;
  }
  export interface StartInputDeviceMaintenanceWindowRequest {
    /**
     * The unique ID of the input device to start a maintenance window for. For example, hd-123456789abcdef.
     */
    InputDeviceId: __string;
  }
  export interface StartInputDeviceMaintenanceWindowResponse {
  }
  export interface StartInputDeviceRequest {
    /**
     * The unique ID of the input device to reboot. For example, hd-123456789abcdef.
     */
    InputDeviceId: __string;
  }
  export interface StartInputDeviceResponse {
  }
  export interface StartMultiplexRequest {
    /**
     * The ID of the multiplex.
     */
    MultiplexId: __string;
  }
  export interface StartMultiplexResponse {
    /**
     * The unique arn of the multiplex.
     */
    Arn?: __string;
    /**
     * A list of availability zones for the multiplex.
     */
    AvailabilityZones?: __listOf__string;
    /**
     * A list of the multiplex output destinations.
     */
    Destinations?: __listOfMultiplexOutputDestination;
    /**
     * The unique id of the multiplex.
     */
    Id?: __string;
    /**
     * Configuration for a multiplex event.
     */
    MultiplexSettings?: MultiplexSettings;
    /**
     * The name of the multiplex.
     */
    Name?: __string;
    /**
     * The number of currently healthy pipelines.
     */
    PipelinesRunningCount?: __integer;
    /**
     * The number of programs in the multiplex.
     */
    ProgramCount?: __integer;
    /**
     * The current state of the multiplex.
     */
    State?: MultiplexState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
  }
  export interface StartTimecode {
    /**
     * The timecode for the frame where you want to start the clip. Optional; if not specified, the clip starts at first frame in the file. Enter the timecode as HH:MM:SS:FF or HH:MM:SS;FF.
     */
    Timecode?: __string;
  }
  export interface StaticImageActivateScheduleActionSettings {
    /**
     * The duration in milliseconds for the image to remain on the video. If omitted or set to 0 the duration is unlimited and the image will remain until it is explicitly deactivated.
     */
    Duration?: __integerMin0;
    /**
     * The time in milliseconds for the image to fade in. The fade-in starts at the start time of the overlay. Default is 0 (no fade-in).
     */
    FadeIn?: __integerMin0;
    /**
     * Applies only if a duration is specified. The time in milliseconds for the image to fade out. The fade-out starts when the duration time is hit, so it effectively extends the duration. Default is 0 (no fade-out).
     */
    FadeOut?: __integerMin0;
    /**
     * The height of the image when inserted into the video, in pixels. The overlay will be scaled up or down to the specified height. Leave blank to use the native height of the overlay.
     */
    Height?: __integerMin1;
    /**
     * The location and filename of the image file to overlay on the video. The file must be a 32-bit BMP, PNG, or TGA file, and must not be larger (in pixels) than the input video.
     */
    Image: InputLocation;
    /**
     * Placement of the left edge of the overlay relative to the left edge of the video frame, in pixels. 0 (the default) is the left edge of the frame. If the placement causes the overlay to extend beyond the right edge of the underlying video, then the overlay is cropped on the right.
     */
    ImageX?: __integerMin0;
    /**
     * Placement of the top edge of the overlay relative to the top edge of the video frame, in pixels. 0 (the default) is the top edge of the frame. If the placement causes the overlay to extend beyond the bottom edge of the underlying video, then the overlay is cropped on the bottom.
     */
    ImageY?: __integerMin0;
    /**
     * The number of the layer, 0 to 7. There are 8 layers that can be overlaid on the video, each layer with a different image. The layers are in Z order, which means that overlays with higher values of layer are inserted on top of overlays with lower values of layer. Default is 0.
     */
    Layer?: __integerMin0Max7;
    /**
     * Opacity of image where 0 is transparent and 100 is fully opaque. Default is 100.
     */
    Opacity?: __integerMin0Max100;
    /**
     * The width of the image when inserted into the video, in pixels. The overlay will be scaled up or down to the specified width. Leave blank to use the native width of the overlay.
     */
    Width?: __integerMin1;
  }
  export interface StaticImageDeactivateScheduleActionSettings {
    /**
     * The time in milliseconds for the image to fade out. Default is 0 (no fade-out).
     */
    FadeOut?: __integerMin0;
    /**
     * The image overlay layer to deactivate, 0 to 7. Default is 0.
     */
    Layer?: __integerMin0Max7;
  }
  export interface StaticKeySettings {
    /**
     * The URL of the license server used for protecting content.
     */
    KeyProviderServer?: InputLocation;
    /**
     * Static key value as a 32 character hexadecimal string.
     */
    StaticKeyValue: __stringMin32Max32;
  }
  export interface StopChannelRequest {
    /**
     * A request to stop a running channel
     */
    ChannelId: __string;
  }
  export interface StopChannelResponse {
    /**
     * The unique arn of the channel.
     */
    Arn?: __string;
    /**
     * Specification of CDI inputs for this channel
     */
    CdiInputSpecification?: CdiInputSpecification;
    /**
     * The class for this channel. STANDARD for a channel with two pipelines or SINGLE_PIPELINE for a channel with one pipeline.
     */
    ChannelClass?: ChannelClass;
    /**
     * A list of destinations of the channel. For UDP outputs, there is one
destination per output. For other types (HLS, for example), there is
one destination per packager.

     */
    Destinations?: __listOfOutputDestination;
    /**
     * The endpoints where outgoing connections initiate from
     */
    EgressEndpoints?: __listOfChannelEgressEndpoint;
    EncoderSettings?: EncoderSettings;
    /**
     * The unique id of the channel.
     */
    Id?: __string;
    /**
     * List of input attachments for channel.
     */
    InputAttachments?: __listOfInputAttachment;
    /**
     * Specification of network and file inputs for this channel
     */
    InputSpecification?: InputSpecification;
    /**
     * The log level being written to CloudWatch Logs.
     */
    LogLevel?: LogLevel;
    /**
     * Maintenance settings for this channel.
     */
    Maintenance?: MaintenanceStatus;
    /**
     * The name of the channel. (user-mutable)
     */
    Name?: __string;
    /**
     * Runtime details for the pipelines of a running channel.
     */
    PipelineDetails?: __listOfPipelineDetail;
    /**
     * The number of currently healthy pipelines.
     */
    PipelinesRunningCount?: __integer;
    /**
     * The Amazon Resource Name (ARN) of the role assumed when running the Channel.
     */
    RoleArn?: __string;
    State?: ChannelState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    /**
     * Settings for VPC output
     */
    Vpc?: VpcOutputSettingsDescription;
  }
  export interface StopInputDeviceRequest {
    /**
     * The unique ID of the input device to reboot. For example, hd-123456789abcdef.
     */
    InputDeviceId: __string;
  }
  export interface StopInputDeviceResponse {
  }
  export interface StopMultiplexRequest {
    /**
     * The ID of the multiplex.
     */
    MultiplexId: __string;
  }
  export interface StopMultiplexResponse {
    /**
     * The unique arn of the multiplex.
     */
    Arn?: __string;
    /**
     * A list of availability zones for the multiplex.
     */
    AvailabilityZones?: __listOf__string;
    /**
     * A list of the multiplex output destinations.
     */
    Destinations?: __listOfMultiplexOutputDestination;
    /**
     * The unique id of the multiplex.
     */
    Id?: __string;
    /**
     * Configuration for a multiplex event.
     */
    MultiplexSettings?: MultiplexSettings;
    /**
     * The name of the multiplex.
     */
    Name?: __string;
    /**
     * The number of currently healthy pipelines.
     */
    PipelinesRunningCount?: __integer;
    /**
     * The number of programs in the multiplex.
     */
    ProgramCount?: __integer;
    /**
     * The current state of the multiplex.
     */
    State?: MultiplexState;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
  }
  export interface StopTimecode {
    /**
     * If you specify a StopTimecode in an input (in order to clip the file), you can specify if you want the clip to exclude (the default) or include the frame specified by the timecode.
     */
    LastFrameClippingBehavior?: LastFrameClippingBehavior;
    /**
     * The timecode for the frame where you want to stop the clip. Optional; if not specified, the clip continues to the end of the file. Enter the timecode as HH:MM:SS:FF or HH:MM:SS;FF.
     */
    Timecode?: __string;
  }
  export type Tags = {[key: string]: __string};
  export interface TeletextDestinationSettings {
  }
  export interface TeletextSourceSettings {
    /**
     * Optionally defines a region where TTML style captions will be displayed
     */
    OutputRectangle?: CaptionRectangle;
    /**
     * Specifies the teletext page number within the data stream from which to extract captions. Range of 0x100 (256) to 0x8FF (2303). Unused for passthrough. Should be specified as a hexadecimal string with no "0x" prefix.
     */
    PageNumber?: __string;
  }
  export type TemporalFilterPostFilterSharpening = "AUTO"|"DISABLED"|"ENABLED"|string;
  export interface TemporalFilterSettings {
    /**
     * If you enable this filter, the results are the following:
- If the source content is noisy (it contains excessive digital artifacts), the filter cleans up the source.
- If the source content is already clean, the filter tends to decrease the bitrate, especially when the rate control mode is QVBR.
     */
    PostFilterSharpening?: TemporalFilterPostFilterSharpening;
    /**
     * Choose a filter strength. We recommend a strength of 1 or 2. A higher strength might take out good information, resulting in an image that is overly soft.
     */
    Strength?: TemporalFilterStrength;
  }
  export type TemporalFilterStrength = "AUTO"|"STRENGTH_1"|"STRENGTH_2"|"STRENGTH_3"|"STRENGTH_4"|"STRENGTH_5"|"STRENGTH_6"|"STRENGTH_7"|"STRENGTH_8"|"STRENGTH_9"|"STRENGTH_10"|"STRENGTH_11"|"STRENGTH_12"|"STRENGTH_13"|"STRENGTH_14"|"STRENGTH_15"|"STRENGTH_16"|string;
  export interface Thumbnail {
    /**
     * The binary data for the latest thumbnail.
     */
    Body?: __string;
    /**
     * The content type for the latest thumbnail.
     */
    ContentType?: __string;
    /**
     * Thumbnail Type
     */
    ThumbnailType?: ThumbnailType;
    /**
     * Time stamp for the latest thumbnail.
     */
    TimeStamp?: __timestampIso8601;
  }
  export interface ThumbnailConfiguration {
    /**
     * Whether Thumbnail is enabled.
     */
    State: ThumbnailState;
  }
  export interface ThumbnailDetail {
    /**
     * Pipeline ID
     */
    PipelineId?: __string;
    /**
     * thumbnails of a single pipeline
     */
    Thumbnails?: __listOfThumbnail;
  }
  export type ThumbnailState = "AUTO"|"DISABLED"|string;
  export type ThumbnailType = "UNSPECIFIED"|"CURRENT_ACTIVE"|string;
  export type TimecodeBurninFontSize = "EXTRA_SMALL_10"|"LARGE_48"|"MEDIUM_32"|"SMALL_16"|string;
  export type TimecodeBurninPosition = "BOTTOM_CENTER"|"BOTTOM_LEFT"|"BOTTOM_RIGHT"|"MIDDLE_CENTER"|"MIDDLE_LEFT"|"MIDDLE_RIGHT"|"TOP_CENTER"|"TOP_LEFT"|"TOP_RIGHT"|string;
  export interface TimecodeBurninSettings {
    /**
     * Choose a timecode burn-in font size
     */
    FontSize: TimecodeBurninFontSize;
    /**
     * Choose a timecode burn-in output position
     */
    Position: TimecodeBurninPosition;
    /**
     * Create a timecode burn-in prefix (optional)
     */
    Prefix?: __stringMax255;
  }
  export interface TimecodeConfig {
    /**
     * Identifies the source for the timecode that will be associated with the events outputs.
-Embedded (embedded): Initialize the output timecode with timecode from the the source.  If no embedded timecode is detected in the source, the system falls back to using "Start at 0" (zerobased).
-System Clock (systemclock): Use the UTC time.
-Start at 0 (zerobased): The time of the first frame of the event will be 00:00:00:00.
     */
    Source: TimecodeConfigSource;
    /**
     * Threshold in frames beyond which output timecode is resynchronized to the input timecode. Discrepancies below this threshold are permitted to avoid unnecessary discontinuities in the output timecode. No timecode sync when this is not specified.
     */
    SyncThreshold?: __integerMin1Max1000000;
  }
  export type TimecodeConfigSource = "EMBEDDED"|"SYSTEMCLOCK"|"ZEROBASED"|string;
  export interface TransferInputDeviceRequest {
    /**
     * The unique ID of this input device. For example, hd-123456789abcdef.
     */
    InputDeviceId: __string;
    /**
     * The AWS account ID (12 digits) for the recipient of the device transfer.
     */
    TargetCustomerId?: __string;
    /**
     * The target AWS region to transfer the device.
     */
    TargetRegion?: __string;
    /**
     * An optional message for the recipient. Maximum 280 characters.
     */
    TransferMessage?: __string;
  }
  export interface TransferInputDeviceResponse {
  }
  export interface TransferringInputDeviceSummary {
    /**
     * The unique ID of the input device.
     */
    Id?: __string;
    /**
     * The optional message that the sender has attached to the transfer.
     */
    Message?: __string;
    /**
     * The AWS account ID for the recipient of the input device transfer.
     */
    TargetCustomerId?: __string;
    /**
     * The type (direction) of the input device transfer.
     */
    TransferType?: InputDeviceTransferType;
  }
  export interface TtmlDestinationSettings {
    /**
     * This field is not currently supported and will not affect the output styling. Leave the default value.
     */
    StyleControl?: TtmlDestinationStyleControl;
  }
  export type TtmlDestinationStyleControl = "PASSTHROUGH"|"USE_CONFIGURED"|string;
  export interface UdpContainerSettings {
    M2tsSettings?: M2tsSettings;
  }
  export interface UdpGroupSettings {
    /**
     * Specifies behavior of last resort when input video is lost, and no more backup inputs are available. When dropTs is selected the entire transport stream will stop being emitted.  When dropProgram is selected the program can be dropped from the transport stream (and replaced with null packets to meet the TS bitrate requirement).  Or, when emitProgram is chosen the transport stream will continue to be produced normally with repeat frames, black frames, or slate frames substituted for the absent input video.
     */
    InputLossAction?: InputLossActionForUdpOut;
    /**
     * Indicates ID3 frame that has the timecode.
     */
    TimedMetadataId3Frame?: UdpTimedMetadataId3Frame;
    /**
     * Timed Metadata interval in seconds.
     */
    TimedMetadataId3Period?: __integerMin0;
  }
  export interface UdpOutputSettings {
    /**
     * UDP output buffering in milliseconds. Larger values increase latency through the transcoder but simultaneously assist the transcoder in maintaining a constant, low-jitter UDP/RTP output while accommodating clock recovery, input switching, input disruptions, picture reordering, etc.
     */
    BufferMsec?: __integerMin0Max10000;
    ContainerSettings: UdpContainerSettings;
    /**
     * Destination address and port number for RTP or UDP packets. Can be unicast or multicast RTP or UDP (eg. rtp://239.10.10.10:5001 or udp://10.100.100.100:5002).
     */
    Destination: OutputLocationRef;
    /**
     * Settings for enabling and adjusting Forward Error Correction on UDP outputs.
     */
    FecOutputSettings?: FecOutputSettings;
  }
  export type UdpTimedMetadataId3Frame = "NONE"|"PRIV"|"TDRL"|string;
  export interface UpdateChannelClassRequest {
    /**
     * The channel class that you wish to update this channel to use.
     */
    ChannelClass: ChannelClass;
    /**
     * Channel Id of the channel whose class should be updated.
     */
    ChannelId: __string;
    /**
     * A list of output destinations for this channel.
     */
    Destinations?: __listOfOutputDestination;
  }
  export interface UpdateChannelClassResponse {
    Channel?: Channel;
  }
  export interface UpdateChannelRequest {
    /**
     * Specification of CDI inputs for this channel
     */
    CdiInputSpecification?: CdiInputSpecification;
    /**
     * channel ID
     */
    ChannelId: __string;
    /**
     * A list of output destinations for this channel.
     */
    Destinations?: __listOfOutputDestination;
    /**
     * The encoder settings for this channel.
     */
    EncoderSettings?: EncoderSettings;
    InputAttachments?: __listOfInputAttachment;
    /**
     * Specification of network and file inputs for this channel
     */
    InputSpecification?: InputSpecification;
    /**
     * The log level to write to CloudWatch Logs.
     */
    LogLevel?: LogLevel;
    /**
     * Maintenance settings for this channel.
     */
    Maintenance?: MaintenanceUpdateSettings;
    /**
     * The name of the channel.
     */
    Name?: __string;
    /**
     * An optional Amazon Resource Name (ARN) of the role to assume when running the Channel. If you do not specify this on an update call but the role was previously set that role will be removed.
     */
    RoleArn?: __string;
  }
  export interface UpdateChannelResponse {
    Channel?: Channel;
  }
  export interface UpdateInputDeviceRequest {
    /**
     * The settings that you want to apply to the HD input device.
     */
    HdDeviceSettings?: InputDeviceConfigurableSettings;
    /**
     * The unique ID of the input device. For example, hd-123456789abcdef.
     */
    InputDeviceId: __string;
    /**
     * The name that you assigned to this input device (not the unique ID).
     */
    Name?: __string;
    /**
     * The settings that you want to apply to the UHD input device.
     */
    UhdDeviceSettings?: InputDeviceConfigurableSettings;
    /**
     * The Availability Zone you want associated with this input device.
     */
    AvailabilityZone?: __string;
  }
  export interface UpdateInputDeviceResponse {
    /**
     * The unique ARN of the input device.
     */
    Arn?: __string;
    /**
     * The state of the connection between the input device and AWS.
     */
    ConnectionState?: InputDeviceConnectionState;
    /**
     * The status of the action to synchronize the device configuration. If you change the configuration of the input device (for example, the maximum bitrate), MediaLive sends the new data to the device. The device might not update itself immediately. SYNCED means the device has updated its configuration. SYNCING means that it has not updated its configuration.
     */
    DeviceSettingsSyncState?: DeviceSettingsSyncState;
    /**
     * The status of software on the input device.
     */
    DeviceUpdateStatus?: DeviceUpdateStatus;
    /**
     * Settings that describe an input device that is type HD.
     */
    HdDeviceSettings?: InputDeviceHdSettings;
    /**
     * The unique ID of the input device.
     */
    Id?: __string;
    /**
     * The network MAC address of the input device.
     */
    MacAddress?: __string;
    /**
     * A name that you specify for the input device.
     */
    Name?: __string;
    /**
     * The network settings for the input device.
     */
    NetworkSettings?: InputDeviceNetworkSettings;
    /**
     * The unique serial number of the input device.
     */
    SerialNumber?: __string;
    /**
     * The type of the input device.
     */
    Type?: InputDeviceType;
    /**
     * Settings that describe an input device that is type UHD.
     */
    UhdDeviceSettings?: InputDeviceUhdSettings;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    /**
     * The Availability Zone associated with this input device.
     */
    AvailabilityZone?: __string;
    /**
     * An array of the ARNs for the MediaLive inputs attached to the device. Returned only if the outputType is MEDIALIVE_INPUT.
     */
    MedialiveInputArns?: __listOf__string;
    /**
     * The output attachment type of the input device. Specifies MEDIACONNECT_FLOW if this device is the source for a MediaConnect flow. Specifies MEDIALIVE_INPUT if this device is the source for a MediaLive input.
     */
    OutputType?: InputDeviceOutputType;
  }
  export interface UpdateInputRequest {
    /**
     * Destination settings for PUSH type inputs.
     */
    Destinations?: __listOfInputDestinationRequest;
    /**
     * Settings for the devices.
     */
    InputDevices?: __listOfInputDeviceRequest;
    /**
     * Unique ID of the input.
     */
    InputId: __string;
    /**
     * A list of security groups referenced by IDs to attach to the input.
     */
    InputSecurityGroups?: __listOf__string;
    /**
     * A list of the MediaConnect Flow ARNs that you want to use as the source of the input. You can specify as few as one
Flow and presently, as many as two. The only requirement is when you have more than one is that each Flow is in a
separate Availability Zone as this ensures your EML input is redundant to AZ issues.

     */
    MediaConnectFlows?: __listOfMediaConnectFlowRequest;
    /**
     * Name of the input.
     */
    Name?: __string;
    /**
     * The Amazon Resource Name (ARN) of the role this input assumes during and after creation.
     */
    RoleArn?: __string;
    /**
     * The source URLs for a PULL-type input. Every PULL type input needs
exactly two source URLs for redundancy.
Only specify sources for PULL type Inputs. Leave Destinations empty.

     */
    Sources?: __listOfInputSourceRequest;
  }
  export interface UpdateInputResponse {
    Input?: Input;
  }
  export interface UpdateInputSecurityGroupRequest {
    /**
     * The id of the Input Security Group to update.
     */
    InputSecurityGroupId: __string;
    /**
     * A collection of key-value pairs.
     */
    Tags?: Tags;
    /**
     * List of IPv4 CIDR addresses to whitelist
     */
    WhitelistRules?: __listOfInputWhitelistRuleCidr;
  }
  export interface UpdateInputSecurityGroupResponse {
    SecurityGroup?: InputSecurityGroup;
  }
  export interface UpdateMultiplexProgramRequest {
    /**
     * The ID of the multiplex of the program to update.
     */
    MultiplexId: __string;
    /**
     * The new settings for a multiplex program.
     */
    MultiplexProgramSettings?: MultiplexProgramSettings;
    /**
     * The name of the program to update.
     */
    ProgramName: __string;
  }
  export interface UpdateMultiplexProgramResponse {
    /**
     * The updated multiplex program.
     */
    MultiplexProgram?: MultiplexProgram;
  }
  export interface UpdateMultiplexRequest {
    /**
     * ID of the multiplex to update.
     */
    MultiplexId: __string;
    /**
     * The new settings for a multiplex.
     */
    MultiplexSettings?: MultiplexSettings;
    /**
     * Name of the multiplex.
     */
    Name?: __string;
  }
  export interface UpdateMultiplexResponse {
    /**
     * The updated multiplex.
     */
    Multiplex?: Multiplex;
  }
  export interface UpdateReservationRequest {
    /**
     * Name of the reservation
     */
    Name?: __string;
    /**
     * Renewal settings for the reservation
     */
    RenewalSettings?: RenewalSettings;
    /**
     * Unique reservation ID, e.g. '1234567'
     */
    ReservationId: __string;
  }
  export interface UpdateReservationResponse {
    Reservation?: Reservation;
  }
  export interface VideoBlackFailoverSettings {
    /**
     * A value used in calculating the threshold below which MediaLive considers a pixel to be 'black'. For the input to be considered black, every pixel in a frame must be below this threshold. The threshold is calculated as a percentage (expressed as a decimal) of white. Therefore .1 means 10% white (or 90% black). Note how the formula works for any color depth. For example, if you set this field to 0.1 in 10-bit color depth: (1023*0.1=102.3), which means a pixel value of 102 or less is 'black'. If you set this field to .1 in an 8-bit color depth: (255*0.1=25.5), which means a pixel value of 25 or less is 'black'. The range is 0.0 to 1.0, with any number of decimal places.
     */
    BlackDetectThreshold?: __doubleMin0Max1;
    /**
     * The amount of time (in milliseconds) that the active input must be black before automatic input failover occurs.
     */
    VideoBlackThresholdMsec?: __integerMin1000;
  }
  export interface VideoCodecSettings {
    FrameCaptureSettings?: FrameCaptureSettings;
    H264Settings?: H264Settings;
    H265Settings?: H265Settings;
    Mpeg2Settings?: Mpeg2Settings;
  }
  export interface VideoDescription {
    /**
     * Video codec settings.
     */
    CodecSettings?: VideoCodecSettings;
    /**
     * Output video height, in pixels. Must be an even number. For most codecs, you can leave this field and width blank in order to use the height and width (resolution) from the source. Note, however, that leaving blank is not recommended. For the Frame Capture codec, height and width are required.
     */
    Height?: __integer;
    /**
     * The name of this VideoDescription. Outputs will use this name to uniquely identify this Description.  Description names should be unique within this Live Event.
     */
    Name: __string;
    /**
     * Indicates how MediaLive will respond to the AFD values that might be in the input video. If you do not know what AFD signaling is, or if your downstream system has not given you guidance, choose PASSTHROUGH.
RESPOND: MediaLive clips the input video using a formula that uses the AFD values (configured in afdSignaling ), the input display aspect ratio, and the output display aspect ratio. MediaLive also includes the AFD values in the output, unless the codec for this encode is FRAME_CAPTURE.
PASSTHROUGH: MediaLive ignores the AFD values and does not clip the video. But MediaLive does include the values in the output.
NONE: MediaLive does not clip the input video and does not include the AFD values in the output
     */
    RespondToAfd?: VideoDescriptionRespondToAfd;
    /**
     * STRETCH_TO_OUTPUT configures the output position to stretch the video to the specified output resolution (height and width). This option will override any position value. DEFAULT may insert black boxes (pillar boxes or letter boxes) around the video to provide the specified output resolution.
     */
    ScalingBehavior?: VideoDescriptionScalingBehavior;
    /**
     * Changes the strength of the anti-alias filter used for scaling. 0 is the softest setting, 100 is the sharpest. A setting of 50 is recommended for most content.
     */
    Sharpness?: __integerMin0Max100;
    /**
     * Output video width, in pixels. Must be an even number. For most codecs, you can leave this field and height blank in order to use the height and width (resolution) from the source. Note, however, that leaving blank is not recommended. For the Frame Capture codec, height and width are required.
     */
    Width?: __integer;
  }
  export type VideoDescriptionRespondToAfd = "NONE"|"PASSTHROUGH"|"RESPOND"|string;
  export type VideoDescriptionScalingBehavior = "DEFAULT"|"STRETCH_TO_OUTPUT"|string;
  export interface VideoSelector {
    /**
     * Specifies the color space of an input. This setting works in tandem with colorSpaceUsage and a video description's colorSpaceSettingsChoice to determine if any conversion will be performed.
     */
    ColorSpace?: VideoSelectorColorSpace;
    /**
     * Color space settings
     */
    ColorSpaceSettings?: VideoSelectorColorSpaceSettings;
    /**
     * Applies only if colorSpace is a value other than follow. This field controls how the value in the colorSpace field will be used. fallback means that when the input does include color space data, that data will be used, but when the input has no color space data, the value in colorSpace will be used. Choose fallback if your input is sometimes missing color space data, but when it does have color space data, that data is correct. force means to always use the value in colorSpace. Choose force if your input usually has no color space data or might have unreliable color space data.
     */
    ColorSpaceUsage?: VideoSelectorColorSpaceUsage;
    /**
     * The video selector settings.
     */
    SelectorSettings?: VideoSelectorSettings;
  }
  export type VideoSelectorColorSpace = "FOLLOW"|"HDR10"|"HLG_2020"|"REC_601"|"REC_709"|string;
  export interface VideoSelectorColorSpaceSettings {
    Hdr10Settings?: Hdr10Settings;
  }
  export type VideoSelectorColorSpaceUsage = "FALLBACK"|"FORCE"|string;
  export interface VideoSelectorPid {
    /**
     * Selects a specific PID from within a video source.
     */
    Pid?: __integerMin0Max8191;
  }
  export interface VideoSelectorProgramId {
    /**
     * Selects a specific program from within a multi-program transport stream. If the program doesn't exist, the first program within the transport stream will be selected by default.
     */
    ProgramId?: __integerMin0Max65536;
  }
  export interface VideoSelectorSettings {
    VideoSelectorPid?: VideoSelectorPid;
    VideoSelectorProgramId?: VideoSelectorProgramId;
  }
  export interface VpcOutputSettings {
    /**
     * List of public address allocation ids to associate with ENIs that will be created in Output VPC.
Must specify one for SINGLE_PIPELINE, two for STANDARD channels

     */
    PublicAddressAllocationIds?: __listOf__string;
    /**
     * A list of up to 5 EC2 VPC security group IDs to attach to the Output VPC network interfaces.
If none are specified then the VPC default security group will be used

     */
    SecurityGroupIds?: __listOf__string;
    /**
     * A list of VPC subnet IDs from the same VPC.
If STANDARD channel, subnet IDs must be mapped to two unique availability zones (AZ).

     */
    SubnetIds: __listOf__string;
  }
  export interface VpcOutputSettingsDescription {
    /**
     * The Availability Zones where the vpc subnets are located.
The first Availability Zone applies to the first subnet in the list of subnets.
The second Availability Zone applies to the second subnet.

     */
    AvailabilityZones?: __listOf__string;
    /**
     * A list of Elastic Network Interfaces created by MediaLive in the customer's VPC

     */
    NetworkInterfaceIds?: __listOf__string;
    /**
     * A list of up EC2 VPC security group IDs attached to the Output VPC network interfaces.

     */
    SecurityGroupIds?: __listOf__string;
    /**
     * A list of VPC subnet IDs from the same VPC.
If STANDARD channel, subnet IDs must be mapped to two unique availability zones (AZ).

     */
    SubnetIds?: __listOf__string;
  }
  export type WavCodingMode = "CODING_MODE_1_0"|"CODING_MODE_2_0"|"CODING_MODE_4_0"|"CODING_MODE_8_0"|string;
  export interface WavSettings {
    /**
     * Bits per sample.
     */
    BitDepth?: __double;
    /**
     * The audio coding mode for the WAV audio. The mode determines the number of channels in the audio.
     */
    CodingMode?: WavCodingMode;
    /**
     * Sample rate in Hz.
     */
    SampleRate?: __double;
  }
  export interface WebvttDestinationSettings {
    /**
     * Controls whether the color and position of the source captions is passed through to the WebVTT output captions.  PASSTHROUGH - Valid only if the source captions are EMBEDDED or TELETEXT.  NO_STYLE_DATA - Don't pass through the style. The output captions will not contain any font styling information.
     */
    StyleControl?: WebvttDestinationStyleControl;
  }
  export type WebvttDestinationStyleControl = "NO_STYLE_DATA"|"PASSTHROUGH"|string;
  export type __double = number;
  export type __doubleMin0 = number;
  export type __doubleMin0Max1 = number;
  export type __doubleMin0Max100 = number;
  export type __doubleMin0Max5000 = number;
  export type __doubleMin1 = number;
  export type __doubleMin1Max65535 = number;
  export type __doubleMinNegative59Max0 = number;
  export type __integer = number;
  export type __integerMin0 = number;
  export type __integerMin0Max10 = number;
  export type __integerMin0Max100 = number;
  export type __integerMin0Max1000 = number;
  export type __integerMin0Max10000 = number;
  export type __integerMin0Max1000000 = number;
  export type __integerMin0Max100000000 = number;
  export type __integerMin0Max128 = number;
  export type __integerMin0Max15 = number;
  export type __integerMin0Max255 = number;
  export type __integerMin0Max30 = number;
  export type __integerMin0Max32768 = number;
  export type __integerMin0Max3600 = number;
  export type __integerMin0Max500 = number;
  export type __integerMin0Max600 = number;
  export type __integerMin0Max65535 = number;
  export type __integerMin0Max65536 = number;
  export type __integerMin0Max7 = number;
  export type __integerMin0Max8191 = number;
  export type __integerMin1 = number;
  export type __integerMin100 = number;
  export type __integerMin1000 = number;
  export type __integerMin1000000Max100000000 = number;
  export type __integerMin100000Max100000000 = number;
  export type __integerMin100000Max40000000 = number;
  export type __integerMin100000Max80000000 = number;
  export type __integerMin1000Max30000 = number;
  export type __integerMin1Max10 = number;
  export type __integerMin1Max1000000 = number;
  export type __integerMin1Max16 = number;
  export type __integerMin1Max20 = number;
  export type __integerMin1Max3003 = number;
  export type __integerMin1Max31 = number;
  export type __integerMin1Max32 = number;
  export type __integerMin1Max3600000 = number;
  export type __integerMin1Max4 = number;
  export type __integerMin1Max5 = number;
  export type __integerMin1Max6 = number;
  export type __integerMin1Max8 = number;
  export type __integerMin25Max10000 = number;
  export type __integerMin25Max2000 = number;
  export type __integerMin3 = number;
  export type __integerMin30 = number;
  export type __integerMin32Max8191 = number;
  export type __integerMin4Max20 = number;
  export type __integerMin800Max3000 = number;
  export type __integerMin96Max600 = number;
  export type __integerMinNegative1000Max1000 = number;
  export type __integerMinNegative5Max5 = number;
  export type __integerMinNegative60Max6 = number;
  export type __integerMinNegative60Max60 = number;
  export type __listOfAudioChannelMapping = AudioChannelMapping[];
  export type __listOfAudioDescription = AudioDescription[];
  export type __listOfAudioSelector = AudioSelector[];
  export type __listOfAudioTrack = AudioTrack[];
  export type __listOfBatchFailedResultModel = BatchFailedResultModel[];
  export type __listOfBatchSuccessfulResultModel = BatchSuccessfulResultModel[];
  export type __listOfCaptionDescription = CaptionDescription[];
  export type __listOfCaptionLanguageMapping = CaptionLanguageMapping[];
  export type __listOfCaptionSelector = CaptionSelector[];
  export type __listOfChannelEgressEndpoint = ChannelEgressEndpoint[];
  export type __listOfChannelSummary = ChannelSummary[];
  export type __listOfFailoverCondition = FailoverCondition[];
  export type __listOfHlsAdMarkers = HlsAdMarkers[];
  export type __listOfInput = Input[];
  export type __listOfInputAttachment = InputAttachment[];
  export type __listOfInputChannelLevel = InputChannelLevel[];
  export type __listOfInputDestination = InputDestination[];
  export type __listOfInputDestinationRequest = InputDestinationRequest[];
  export type __listOfInputDeviceRequest = InputDeviceRequest[];
  export type __listOfInputDeviceSettings = InputDeviceSettings[];
  export type __listOfInputDeviceSummary = InputDeviceSummary[];
  export type __listOfInputSecurityGroup = InputSecurityGroup[];
  export type __listOfInputSource = InputSource[];
  export type __listOfInputSourceRequest = InputSourceRequest[];
  export type __listOfInputWhitelistRule = InputWhitelistRule[];
  export type __listOfInputWhitelistRuleCidr = InputWhitelistRuleCidr[];
  export type __listOfMediaConnectFlow = MediaConnectFlow[];
  export type __listOfMediaConnectFlowRequest = MediaConnectFlowRequest[];
  export type __listOfMediaPackageOutputDestinationSettings = MediaPackageOutputDestinationSettings[];
  export type __listOfMultiplexOutputDestination = MultiplexOutputDestination[];
  export type __listOfMultiplexProgramPipelineDetail = MultiplexProgramPipelineDetail[];
  export type __listOfMultiplexProgramSummary = MultiplexProgramSummary[];
  export type __listOfMultiplexSummary = MultiplexSummary[];
  export type __listOfOffering = Offering[];
  export type __listOfOutput = Output[];
  export type __listOfOutputDestination = OutputDestination[];
  export type __listOfOutputDestinationSettings = OutputDestinationSettings[];
  export type __listOfOutputGroup = OutputGroup[];
  export type __listOfPipelineDetail = PipelineDetail[];
  export type __listOfPipelinePauseStateSettings = PipelinePauseStateSettings[];
  export type __listOfReservation = Reservation[];
  export type __listOfRtmpAdMarkers = RtmpAdMarkers[];
  export type __listOfScheduleAction = ScheduleAction[];
  export type __listOfScte35Descriptor = Scte35Descriptor[];
  export type __listOfThumbnail = Thumbnail[];
  export type __listOfThumbnailDetail = ThumbnailDetail[];
  export type __listOfTransferringInputDeviceSummary = TransferringInputDeviceSummary[];
  export type __listOfVideoDescription = VideoDescription[];
  export type __listOf__integer = __integer[];
  export type __listOf__string = __string[];
  export type __long = number;
  export type __longMin0Max1099511627775 = number;
  export type __longMin0Max4294967295 = number;
  export type __longMin0Max8589934591 = number;
  export type __longMin0Max86400000 = number;
  export type __string = string;
  export type __stringMax1000 = string;
  export type __stringMax2048 = string;
  export type __stringMax255 = string;
  export type __stringMax256 = string;
  export type __stringMax32 = string;
  export type __stringMin1 = string;
  export type __stringMin1Max255 = string;
  export type __stringMin1Max256 = string;
  export type __stringMin1Max35 = string;
  export type __stringMin1Max7 = string;
  export type __stringMin2Max2 = string;
  export type __stringMin32Max32 = string;
  export type __stringMin34Max34 = string;
  export type __stringMin3Max3 = string;
  export type __stringMin6Max6 = string;
  export type __stringPattern010920300 = string;
  export type __timestampIso8601 = Date;
  export type InputDeviceThumbnail = Buffer|Uint8Array|Blob|string|Readable;
  export type AcceptHeader = "image/jpeg"|string;
  export type ContentType = "image/jpeg"|string;
  export type __timestamp = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-10-14"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MediaLive client.
   */
  export import Types = MediaLive;
}
export = MediaLive;
