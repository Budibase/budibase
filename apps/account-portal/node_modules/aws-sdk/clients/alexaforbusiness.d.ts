import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class AlexaForBusiness extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: AlexaForBusiness.Types.ClientConfiguration)
  config: Config & AlexaForBusiness.Types.ClientConfiguration;
  /**
   * Associates a skill with the organization under the customer's AWS account. If a skill is private, the user implicitly accepts access to this skill during enablement.
   */
  approveSkill(params: AlexaForBusiness.Types.ApproveSkillRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.ApproveSkillResponse) => void): Request<AlexaForBusiness.Types.ApproveSkillResponse, AWSError>;
  /**
   * Associates a skill with the organization under the customer's AWS account. If a skill is private, the user implicitly accepts access to this skill during enablement.
   */
  approveSkill(callback?: (err: AWSError, data: AlexaForBusiness.Types.ApproveSkillResponse) => void): Request<AlexaForBusiness.Types.ApproveSkillResponse, AWSError>;
  /**
   * Associates a contact with a given address book.
   */
  associateContactWithAddressBook(params: AlexaForBusiness.Types.AssociateContactWithAddressBookRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.AssociateContactWithAddressBookResponse) => void): Request<AlexaForBusiness.Types.AssociateContactWithAddressBookResponse, AWSError>;
  /**
   * Associates a contact with a given address book.
   */
  associateContactWithAddressBook(callback?: (err: AWSError, data: AlexaForBusiness.Types.AssociateContactWithAddressBookResponse) => void): Request<AlexaForBusiness.Types.AssociateContactWithAddressBookResponse, AWSError>;
  /**
   * Associates a device with the specified network profile.
   */
  associateDeviceWithNetworkProfile(params: AlexaForBusiness.Types.AssociateDeviceWithNetworkProfileRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.AssociateDeviceWithNetworkProfileResponse) => void): Request<AlexaForBusiness.Types.AssociateDeviceWithNetworkProfileResponse, AWSError>;
  /**
   * Associates a device with the specified network profile.
   */
  associateDeviceWithNetworkProfile(callback?: (err: AWSError, data: AlexaForBusiness.Types.AssociateDeviceWithNetworkProfileResponse) => void): Request<AlexaForBusiness.Types.AssociateDeviceWithNetworkProfileResponse, AWSError>;
  /**
   * Associates a device with a given room. This applies all the settings from the room profile to the device, and all the skills in any skill groups added to that room. This operation requires the device to be online, or else a manual sync is required. 
   */
  associateDeviceWithRoom(params: AlexaForBusiness.Types.AssociateDeviceWithRoomRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.AssociateDeviceWithRoomResponse) => void): Request<AlexaForBusiness.Types.AssociateDeviceWithRoomResponse, AWSError>;
  /**
   * Associates a device with a given room. This applies all the settings from the room profile to the device, and all the skills in any skill groups added to that room. This operation requires the device to be online, or else a manual sync is required. 
   */
  associateDeviceWithRoom(callback?: (err: AWSError, data: AlexaForBusiness.Types.AssociateDeviceWithRoomResponse) => void): Request<AlexaForBusiness.Types.AssociateDeviceWithRoomResponse, AWSError>;
  /**
   * Associates a skill group with a given room. This enables all skills in the associated skill group on all devices in the room.
   */
  associateSkillGroupWithRoom(params: AlexaForBusiness.Types.AssociateSkillGroupWithRoomRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.AssociateSkillGroupWithRoomResponse) => void): Request<AlexaForBusiness.Types.AssociateSkillGroupWithRoomResponse, AWSError>;
  /**
   * Associates a skill group with a given room. This enables all skills in the associated skill group on all devices in the room.
   */
  associateSkillGroupWithRoom(callback?: (err: AWSError, data: AlexaForBusiness.Types.AssociateSkillGroupWithRoomResponse) => void): Request<AlexaForBusiness.Types.AssociateSkillGroupWithRoomResponse, AWSError>;
  /**
   * Associates a skill with a skill group.
   */
  associateSkillWithSkillGroup(params: AlexaForBusiness.Types.AssociateSkillWithSkillGroupRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.AssociateSkillWithSkillGroupResponse) => void): Request<AlexaForBusiness.Types.AssociateSkillWithSkillGroupResponse, AWSError>;
  /**
   * Associates a skill with a skill group.
   */
  associateSkillWithSkillGroup(callback?: (err: AWSError, data: AlexaForBusiness.Types.AssociateSkillWithSkillGroupResponse) => void): Request<AlexaForBusiness.Types.AssociateSkillWithSkillGroupResponse, AWSError>;
  /**
   * Makes a private skill available for enrolled users to enable on their devices.
   */
  associateSkillWithUsers(params: AlexaForBusiness.Types.AssociateSkillWithUsersRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.AssociateSkillWithUsersResponse) => void): Request<AlexaForBusiness.Types.AssociateSkillWithUsersResponse, AWSError>;
  /**
   * Makes a private skill available for enrolled users to enable on their devices.
   */
  associateSkillWithUsers(callback?: (err: AWSError, data: AlexaForBusiness.Types.AssociateSkillWithUsersResponse) => void): Request<AlexaForBusiness.Types.AssociateSkillWithUsersResponse, AWSError>;
  /**
   * Creates an address book with the specified details.
   */
  createAddressBook(params: AlexaForBusiness.Types.CreateAddressBookRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateAddressBookResponse) => void): Request<AlexaForBusiness.Types.CreateAddressBookResponse, AWSError>;
  /**
   * Creates an address book with the specified details.
   */
  createAddressBook(callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateAddressBookResponse) => void): Request<AlexaForBusiness.Types.CreateAddressBookResponse, AWSError>;
  /**
   * Creates a recurring schedule for usage reports to deliver to the specified S3 location with a specified daily or weekly interval.
   */
  createBusinessReportSchedule(params: AlexaForBusiness.Types.CreateBusinessReportScheduleRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateBusinessReportScheduleResponse) => void): Request<AlexaForBusiness.Types.CreateBusinessReportScheduleResponse, AWSError>;
  /**
   * Creates a recurring schedule for usage reports to deliver to the specified S3 location with a specified daily or weekly interval.
   */
  createBusinessReportSchedule(callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateBusinessReportScheduleResponse) => void): Request<AlexaForBusiness.Types.CreateBusinessReportScheduleResponse, AWSError>;
  /**
   * Adds a new conference provider under the user's AWS account.
   */
  createConferenceProvider(params: AlexaForBusiness.Types.CreateConferenceProviderRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateConferenceProviderResponse) => void): Request<AlexaForBusiness.Types.CreateConferenceProviderResponse, AWSError>;
  /**
   * Adds a new conference provider under the user's AWS account.
   */
  createConferenceProvider(callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateConferenceProviderResponse) => void): Request<AlexaForBusiness.Types.CreateConferenceProviderResponse, AWSError>;
  /**
   * Creates a contact with the specified details.
   */
  createContact(params: AlexaForBusiness.Types.CreateContactRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateContactResponse) => void): Request<AlexaForBusiness.Types.CreateContactResponse, AWSError>;
  /**
   * Creates a contact with the specified details.
   */
  createContact(callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateContactResponse) => void): Request<AlexaForBusiness.Types.CreateContactResponse, AWSError>;
  /**
   * Creates a gateway group with the specified details.
   */
  createGatewayGroup(params: AlexaForBusiness.Types.CreateGatewayGroupRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateGatewayGroupResponse) => void): Request<AlexaForBusiness.Types.CreateGatewayGroupResponse, AWSError>;
  /**
   * Creates a gateway group with the specified details.
   */
  createGatewayGroup(callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateGatewayGroupResponse) => void): Request<AlexaForBusiness.Types.CreateGatewayGroupResponse, AWSError>;
  /**
   * Creates a network profile with the specified details.
   */
  createNetworkProfile(params: AlexaForBusiness.Types.CreateNetworkProfileRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateNetworkProfileResponse) => void): Request<AlexaForBusiness.Types.CreateNetworkProfileResponse, AWSError>;
  /**
   * Creates a network profile with the specified details.
   */
  createNetworkProfile(callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateNetworkProfileResponse) => void): Request<AlexaForBusiness.Types.CreateNetworkProfileResponse, AWSError>;
  /**
   * Creates a new room profile with the specified details.
   */
  createProfile(params: AlexaForBusiness.Types.CreateProfileRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateProfileResponse) => void): Request<AlexaForBusiness.Types.CreateProfileResponse, AWSError>;
  /**
   * Creates a new room profile with the specified details.
   */
  createProfile(callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateProfileResponse) => void): Request<AlexaForBusiness.Types.CreateProfileResponse, AWSError>;
  /**
   * Creates a room with the specified details.
   */
  createRoom(params: AlexaForBusiness.Types.CreateRoomRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateRoomResponse) => void): Request<AlexaForBusiness.Types.CreateRoomResponse, AWSError>;
  /**
   * Creates a room with the specified details.
   */
  createRoom(callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateRoomResponse) => void): Request<AlexaForBusiness.Types.CreateRoomResponse, AWSError>;
  /**
   * Creates a skill group with a specified name and description.
   */
  createSkillGroup(params: AlexaForBusiness.Types.CreateSkillGroupRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateSkillGroupResponse) => void): Request<AlexaForBusiness.Types.CreateSkillGroupResponse, AWSError>;
  /**
   * Creates a skill group with a specified name and description.
   */
  createSkillGroup(callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateSkillGroupResponse) => void): Request<AlexaForBusiness.Types.CreateSkillGroupResponse, AWSError>;
  /**
   * Creates a user.
   */
  createUser(params: AlexaForBusiness.Types.CreateUserRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateUserResponse) => void): Request<AlexaForBusiness.Types.CreateUserResponse, AWSError>;
  /**
   * Creates a user.
   */
  createUser(callback?: (err: AWSError, data: AlexaForBusiness.Types.CreateUserResponse) => void): Request<AlexaForBusiness.Types.CreateUserResponse, AWSError>;
  /**
   * Deletes an address book by the address book ARN.
   */
  deleteAddressBook(params: AlexaForBusiness.Types.DeleteAddressBookRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteAddressBookResponse) => void): Request<AlexaForBusiness.Types.DeleteAddressBookResponse, AWSError>;
  /**
   * Deletes an address book by the address book ARN.
   */
  deleteAddressBook(callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteAddressBookResponse) => void): Request<AlexaForBusiness.Types.DeleteAddressBookResponse, AWSError>;
  /**
   * Deletes the recurring report delivery schedule with the specified schedule ARN.
   */
  deleteBusinessReportSchedule(params: AlexaForBusiness.Types.DeleteBusinessReportScheduleRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteBusinessReportScheduleResponse) => void): Request<AlexaForBusiness.Types.DeleteBusinessReportScheduleResponse, AWSError>;
  /**
   * Deletes the recurring report delivery schedule with the specified schedule ARN.
   */
  deleteBusinessReportSchedule(callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteBusinessReportScheduleResponse) => void): Request<AlexaForBusiness.Types.DeleteBusinessReportScheduleResponse, AWSError>;
  /**
   * Deletes a conference provider.
   */
  deleteConferenceProvider(params: AlexaForBusiness.Types.DeleteConferenceProviderRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteConferenceProviderResponse) => void): Request<AlexaForBusiness.Types.DeleteConferenceProviderResponse, AWSError>;
  /**
   * Deletes a conference provider.
   */
  deleteConferenceProvider(callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteConferenceProviderResponse) => void): Request<AlexaForBusiness.Types.DeleteConferenceProviderResponse, AWSError>;
  /**
   * Deletes a contact by the contact ARN.
   */
  deleteContact(params: AlexaForBusiness.Types.DeleteContactRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteContactResponse) => void): Request<AlexaForBusiness.Types.DeleteContactResponse, AWSError>;
  /**
   * Deletes a contact by the contact ARN.
   */
  deleteContact(callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteContactResponse) => void): Request<AlexaForBusiness.Types.DeleteContactResponse, AWSError>;
  /**
   * Removes a device from Alexa For Business.
   */
  deleteDevice(params: AlexaForBusiness.Types.DeleteDeviceRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteDeviceResponse) => void): Request<AlexaForBusiness.Types.DeleteDeviceResponse, AWSError>;
  /**
   * Removes a device from Alexa For Business.
   */
  deleteDevice(callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteDeviceResponse) => void): Request<AlexaForBusiness.Types.DeleteDeviceResponse, AWSError>;
  /**
   * When this action is called for a specified shared device, it allows authorized users to delete the device's entire previous history of voice input data and associated response data. This action can be called once every 24 hours for a specific shared device.
   */
  deleteDeviceUsageData(params: AlexaForBusiness.Types.DeleteDeviceUsageDataRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteDeviceUsageDataResponse) => void): Request<AlexaForBusiness.Types.DeleteDeviceUsageDataResponse, AWSError>;
  /**
   * When this action is called for a specified shared device, it allows authorized users to delete the device's entire previous history of voice input data and associated response data. This action can be called once every 24 hours for a specific shared device.
   */
  deleteDeviceUsageData(callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteDeviceUsageDataResponse) => void): Request<AlexaForBusiness.Types.DeleteDeviceUsageDataResponse, AWSError>;
  /**
   * Deletes a gateway group.
   */
  deleteGatewayGroup(params: AlexaForBusiness.Types.DeleteGatewayGroupRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteGatewayGroupResponse) => void): Request<AlexaForBusiness.Types.DeleteGatewayGroupResponse, AWSError>;
  /**
   * Deletes a gateway group.
   */
  deleteGatewayGroup(callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteGatewayGroupResponse) => void): Request<AlexaForBusiness.Types.DeleteGatewayGroupResponse, AWSError>;
  /**
   * Deletes a network profile by the network profile ARN.
   */
  deleteNetworkProfile(params: AlexaForBusiness.Types.DeleteNetworkProfileRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteNetworkProfileResponse) => void): Request<AlexaForBusiness.Types.DeleteNetworkProfileResponse, AWSError>;
  /**
   * Deletes a network profile by the network profile ARN.
   */
  deleteNetworkProfile(callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteNetworkProfileResponse) => void): Request<AlexaForBusiness.Types.DeleteNetworkProfileResponse, AWSError>;
  /**
   * Deletes a room profile by the profile ARN.
   */
  deleteProfile(params: AlexaForBusiness.Types.DeleteProfileRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteProfileResponse) => void): Request<AlexaForBusiness.Types.DeleteProfileResponse, AWSError>;
  /**
   * Deletes a room profile by the profile ARN.
   */
  deleteProfile(callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteProfileResponse) => void): Request<AlexaForBusiness.Types.DeleteProfileResponse, AWSError>;
  /**
   * Deletes a room by the room ARN.
   */
  deleteRoom(params: AlexaForBusiness.Types.DeleteRoomRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteRoomResponse) => void): Request<AlexaForBusiness.Types.DeleteRoomResponse, AWSError>;
  /**
   * Deletes a room by the room ARN.
   */
  deleteRoom(callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteRoomResponse) => void): Request<AlexaForBusiness.Types.DeleteRoomResponse, AWSError>;
  /**
   * Deletes room skill parameter details by room, skill, and parameter key ID.
   */
  deleteRoomSkillParameter(params: AlexaForBusiness.Types.DeleteRoomSkillParameterRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteRoomSkillParameterResponse) => void): Request<AlexaForBusiness.Types.DeleteRoomSkillParameterResponse, AWSError>;
  /**
   * Deletes room skill parameter details by room, skill, and parameter key ID.
   */
  deleteRoomSkillParameter(callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteRoomSkillParameterResponse) => void): Request<AlexaForBusiness.Types.DeleteRoomSkillParameterResponse, AWSError>;
  /**
   * Unlinks a third-party account from a skill.
   */
  deleteSkillAuthorization(params: AlexaForBusiness.Types.DeleteSkillAuthorizationRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteSkillAuthorizationResponse) => void): Request<AlexaForBusiness.Types.DeleteSkillAuthorizationResponse, AWSError>;
  /**
   * Unlinks a third-party account from a skill.
   */
  deleteSkillAuthorization(callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteSkillAuthorizationResponse) => void): Request<AlexaForBusiness.Types.DeleteSkillAuthorizationResponse, AWSError>;
  /**
   * Deletes a skill group by skill group ARN.
   */
  deleteSkillGroup(params: AlexaForBusiness.Types.DeleteSkillGroupRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteSkillGroupResponse) => void): Request<AlexaForBusiness.Types.DeleteSkillGroupResponse, AWSError>;
  /**
   * Deletes a skill group by skill group ARN.
   */
  deleteSkillGroup(callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteSkillGroupResponse) => void): Request<AlexaForBusiness.Types.DeleteSkillGroupResponse, AWSError>;
  /**
   * Deletes a specified user by user ARN and enrollment ARN.
   */
  deleteUser(params: AlexaForBusiness.Types.DeleteUserRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteUserResponse) => void): Request<AlexaForBusiness.Types.DeleteUserResponse, AWSError>;
  /**
   * Deletes a specified user by user ARN and enrollment ARN.
   */
  deleteUser(callback?: (err: AWSError, data: AlexaForBusiness.Types.DeleteUserResponse) => void): Request<AlexaForBusiness.Types.DeleteUserResponse, AWSError>;
  /**
   * Disassociates a contact from a given address book.
   */
  disassociateContactFromAddressBook(params: AlexaForBusiness.Types.DisassociateContactFromAddressBookRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DisassociateContactFromAddressBookResponse) => void): Request<AlexaForBusiness.Types.DisassociateContactFromAddressBookResponse, AWSError>;
  /**
   * Disassociates a contact from a given address book.
   */
  disassociateContactFromAddressBook(callback?: (err: AWSError, data: AlexaForBusiness.Types.DisassociateContactFromAddressBookResponse) => void): Request<AlexaForBusiness.Types.DisassociateContactFromAddressBookResponse, AWSError>;
  /**
   * Disassociates a device from its current room. The device continues to be connected to the Wi-Fi network and is still registered to the account. The device settings and skills are removed from the room.
   */
  disassociateDeviceFromRoom(params: AlexaForBusiness.Types.DisassociateDeviceFromRoomRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DisassociateDeviceFromRoomResponse) => void): Request<AlexaForBusiness.Types.DisassociateDeviceFromRoomResponse, AWSError>;
  /**
   * Disassociates a device from its current room. The device continues to be connected to the Wi-Fi network and is still registered to the account. The device settings and skills are removed from the room.
   */
  disassociateDeviceFromRoom(callback?: (err: AWSError, data: AlexaForBusiness.Types.DisassociateDeviceFromRoomResponse) => void): Request<AlexaForBusiness.Types.DisassociateDeviceFromRoomResponse, AWSError>;
  /**
   * Disassociates a skill from a skill group.
   */
  disassociateSkillFromSkillGroup(params: AlexaForBusiness.Types.DisassociateSkillFromSkillGroupRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DisassociateSkillFromSkillGroupResponse) => void): Request<AlexaForBusiness.Types.DisassociateSkillFromSkillGroupResponse, AWSError>;
  /**
   * Disassociates a skill from a skill group.
   */
  disassociateSkillFromSkillGroup(callback?: (err: AWSError, data: AlexaForBusiness.Types.DisassociateSkillFromSkillGroupResponse) => void): Request<AlexaForBusiness.Types.DisassociateSkillFromSkillGroupResponse, AWSError>;
  /**
   * Makes a private skill unavailable for enrolled users and prevents them from enabling it on their devices.
   */
  disassociateSkillFromUsers(params: AlexaForBusiness.Types.DisassociateSkillFromUsersRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DisassociateSkillFromUsersResponse) => void): Request<AlexaForBusiness.Types.DisassociateSkillFromUsersResponse, AWSError>;
  /**
   * Makes a private skill unavailable for enrolled users and prevents them from enabling it on their devices.
   */
  disassociateSkillFromUsers(callback?: (err: AWSError, data: AlexaForBusiness.Types.DisassociateSkillFromUsersResponse) => void): Request<AlexaForBusiness.Types.DisassociateSkillFromUsersResponse, AWSError>;
  /**
   * Disassociates a skill group from a specified room. This disables all skills in the skill group on all devices in the room.
   */
  disassociateSkillGroupFromRoom(params: AlexaForBusiness.Types.DisassociateSkillGroupFromRoomRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.DisassociateSkillGroupFromRoomResponse) => void): Request<AlexaForBusiness.Types.DisassociateSkillGroupFromRoomResponse, AWSError>;
  /**
   * Disassociates a skill group from a specified room. This disables all skills in the skill group on all devices in the room.
   */
  disassociateSkillGroupFromRoom(callback?: (err: AWSError, data: AlexaForBusiness.Types.DisassociateSkillGroupFromRoomResponse) => void): Request<AlexaForBusiness.Types.DisassociateSkillGroupFromRoomResponse, AWSError>;
  /**
   * Forgets smart home appliances associated to a room.
   */
  forgetSmartHomeAppliances(params: AlexaForBusiness.Types.ForgetSmartHomeAppliancesRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.ForgetSmartHomeAppliancesResponse) => void): Request<AlexaForBusiness.Types.ForgetSmartHomeAppliancesResponse, AWSError>;
  /**
   * Forgets smart home appliances associated to a room.
   */
  forgetSmartHomeAppliances(callback?: (err: AWSError, data: AlexaForBusiness.Types.ForgetSmartHomeAppliancesResponse) => void): Request<AlexaForBusiness.Types.ForgetSmartHomeAppliancesResponse, AWSError>;
  /**
   * Gets address the book details by the address book ARN.
   */
  getAddressBook(params: AlexaForBusiness.Types.GetAddressBookRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.GetAddressBookResponse) => void): Request<AlexaForBusiness.Types.GetAddressBookResponse, AWSError>;
  /**
   * Gets address the book details by the address book ARN.
   */
  getAddressBook(callback?: (err: AWSError, data: AlexaForBusiness.Types.GetAddressBookResponse) => void): Request<AlexaForBusiness.Types.GetAddressBookResponse, AWSError>;
  /**
   * Retrieves the existing conference preferences.
   */
  getConferencePreference(params: AlexaForBusiness.Types.GetConferencePreferenceRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.GetConferencePreferenceResponse) => void): Request<AlexaForBusiness.Types.GetConferencePreferenceResponse, AWSError>;
  /**
   * Retrieves the existing conference preferences.
   */
  getConferencePreference(callback?: (err: AWSError, data: AlexaForBusiness.Types.GetConferencePreferenceResponse) => void): Request<AlexaForBusiness.Types.GetConferencePreferenceResponse, AWSError>;
  /**
   * Gets details about a specific conference provider.
   */
  getConferenceProvider(params: AlexaForBusiness.Types.GetConferenceProviderRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.GetConferenceProviderResponse) => void): Request<AlexaForBusiness.Types.GetConferenceProviderResponse, AWSError>;
  /**
   * Gets details about a specific conference provider.
   */
  getConferenceProvider(callback?: (err: AWSError, data: AlexaForBusiness.Types.GetConferenceProviderResponse) => void): Request<AlexaForBusiness.Types.GetConferenceProviderResponse, AWSError>;
  /**
   * Gets the contact details by the contact ARN.
   */
  getContact(params: AlexaForBusiness.Types.GetContactRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.GetContactResponse) => void): Request<AlexaForBusiness.Types.GetContactResponse, AWSError>;
  /**
   * Gets the contact details by the contact ARN.
   */
  getContact(callback?: (err: AWSError, data: AlexaForBusiness.Types.GetContactResponse) => void): Request<AlexaForBusiness.Types.GetContactResponse, AWSError>;
  /**
   * Gets the details of a device by device ARN.
   */
  getDevice(params: AlexaForBusiness.Types.GetDeviceRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.GetDeviceResponse) => void): Request<AlexaForBusiness.Types.GetDeviceResponse, AWSError>;
  /**
   * Gets the details of a device by device ARN.
   */
  getDevice(callback?: (err: AWSError, data: AlexaForBusiness.Types.GetDeviceResponse) => void): Request<AlexaForBusiness.Types.GetDeviceResponse, AWSError>;
  /**
   * Retrieves the details of a gateway.
   */
  getGateway(params: AlexaForBusiness.Types.GetGatewayRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.GetGatewayResponse) => void): Request<AlexaForBusiness.Types.GetGatewayResponse, AWSError>;
  /**
   * Retrieves the details of a gateway.
   */
  getGateway(callback?: (err: AWSError, data: AlexaForBusiness.Types.GetGatewayResponse) => void): Request<AlexaForBusiness.Types.GetGatewayResponse, AWSError>;
  /**
   * Retrieves the details of a gateway group.
   */
  getGatewayGroup(params: AlexaForBusiness.Types.GetGatewayGroupRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.GetGatewayGroupResponse) => void): Request<AlexaForBusiness.Types.GetGatewayGroupResponse, AWSError>;
  /**
   * Retrieves the details of a gateway group.
   */
  getGatewayGroup(callback?: (err: AWSError, data: AlexaForBusiness.Types.GetGatewayGroupResponse) => void): Request<AlexaForBusiness.Types.GetGatewayGroupResponse, AWSError>;
  /**
   * Retrieves the configured values for the user enrollment invitation email template.
   */
  getInvitationConfiguration(params: AlexaForBusiness.Types.GetInvitationConfigurationRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.GetInvitationConfigurationResponse) => void): Request<AlexaForBusiness.Types.GetInvitationConfigurationResponse, AWSError>;
  /**
   * Retrieves the configured values for the user enrollment invitation email template.
   */
  getInvitationConfiguration(callback?: (err: AWSError, data: AlexaForBusiness.Types.GetInvitationConfigurationResponse) => void): Request<AlexaForBusiness.Types.GetInvitationConfigurationResponse, AWSError>;
  /**
   * Gets the network profile details by the network profile ARN.
   */
  getNetworkProfile(params: AlexaForBusiness.Types.GetNetworkProfileRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.GetNetworkProfileResponse) => void): Request<AlexaForBusiness.Types.GetNetworkProfileResponse, AWSError>;
  /**
   * Gets the network profile details by the network profile ARN.
   */
  getNetworkProfile(callback?: (err: AWSError, data: AlexaForBusiness.Types.GetNetworkProfileResponse) => void): Request<AlexaForBusiness.Types.GetNetworkProfileResponse, AWSError>;
  /**
   * Gets the details of a room profile by profile ARN.
   */
  getProfile(params: AlexaForBusiness.Types.GetProfileRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.GetProfileResponse) => void): Request<AlexaForBusiness.Types.GetProfileResponse, AWSError>;
  /**
   * Gets the details of a room profile by profile ARN.
   */
  getProfile(callback?: (err: AWSError, data: AlexaForBusiness.Types.GetProfileResponse) => void): Request<AlexaForBusiness.Types.GetProfileResponse, AWSError>;
  /**
   * Gets room details by room ARN.
   */
  getRoom(params: AlexaForBusiness.Types.GetRoomRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.GetRoomResponse) => void): Request<AlexaForBusiness.Types.GetRoomResponse, AWSError>;
  /**
   * Gets room details by room ARN.
   */
  getRoom(callback?: (err: AWSError, data: AlexaForBusiness.Types.GetRoomResponse) => void): Request<AlexaForBusiness.Types.GetRoomResponse, AWSError>;
  /**
   * Gets room skill parameter details by room, skill, and parameter key ARN.
   */
  getRoomSkillParameter(params: AlexaForBusiness.Types.GetRoomSkillParameterRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.GetRoomSkillParameterResponse) => void): Request<AlexaForBusiness.Types.GetRoomSkillParameterResponse, AWSError>;
  /**
   * Gets room skill parameter details by room, skill, and parameter key ARN.
   */
  getRoomSkillParameter(callback?: (err: AWSError, data: AlexaForBusiness.Types.GetRoomSkillParameterResponse) => void): Request<AlexaForBusiness.Types.GetRoomSkillParameterResponse, AWSError>;
  /**
   * Gets skill group details by skill group ARN.
   */
  getSkillGroup(params: AlexaForBusiness.Types.GetSkillGroupRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.GetSkillGroupResponse) => void): Request<AlexaForBusiness.Types.GetSkillGroupResponse, AWSError>;
  /**
   * Gets skill group details by skill group ARN.
   */
  getSkillGroup(callback?: (err: AWSError, data: AlexaForBusiness.Types.GetSkillGroupResponse) => void): Request<AlexaForBusiness.Types.GetSkillGroupResponse, AWSError>;
  /**
   * Lists the details of the schedules that a user configured. A download URL of the report associated with each schedule is returned every time this action is called. A new download URL is returned each time, and is valid for 24 hours.
   */
  listBusinessReportSchedules(params: AlexaForBusiness.Types.ListBusinessReportSchedulesRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.ListBusinessReportSchedulesResponse) => void): Request<AlexaForBusiness.Types.ListBusinessReportSchedulesResponse, AWSError>;
  /**
   * Lists the details of the schedules that a user configured. A download URL of the report associated with each schedule is returned every time this action is called. A new download URL is returned each time, and is valid for 24 hours.
   */
  listBusinessReportSchedules(callback?: (err: AWSError, data: AlexaForBusiness.Types.ListBusinessReportSchedulesResponse) => void): Request<AlexaForBusiness.Types.ListBusinessReportSchedulesResponse, AWSError>;
  /**
   * Lists conference providers under a specific AWS account.
   */
  listConferenceProviders(params: AlexaForBusiness.Types.ListConferenceProvidersRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.ListConferenceProvidersResponse) => void): Request<AlexaForBusiness.Types.ListConferenceProvidersResponse, AWSError>;
  /**
   * Lists conference providers under a specific AWS account.
   */
  listConferenceProviders(callback?: (err: AWSError, data: AlexaForBusiness.Types.ListConferenceProvidersResponse) => void): Request<AlexaForBusiness.Types.ListConferenceProvidersResponse, AWSError>;
  /**
   * Lists the device event history, including device connection status, for up to 30 days.
   */
  listDeviceEvents(params: AlexaForBusiness.Types.ListDeviceEventsRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.ListDeviceEventsResponse) => void): Request<AlexaForBusiness.Types.ListDeviceEventsResponse, AWSError>;
  /**
   * Lists the device event history, including device connection status, for up to 30 days.
   */
  listDeviceEvents(callback?: (err: AWSError, data: AlexaForBusiness.Types.ListDeviceEventsResponse) => void): Request<AlexaForBusiness.Types.ListDeviceEventsResponse, AWSError>;
  /**
   * Retrieves a list of gateway group summaries. Use GetGatewayGroup to retrieve details of a specific gateway group.
   */
  listGatewayGroups(params: AlexaForBusiness.Types.ListGatewayGroupsRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.ListGatewayGroupsResponse) => void): Request<AlexaForBusiness.Types.ListGatewayGroupsResponse, AWSError>;
  /**
   * Retrieves a list of gateway group summaries. Use GetGatewayGroup to retrieve details of a specific gateway group.
   */
  listGatewayGroups(callback?: (err: AWSError, data: AlexaForBusiness.Types.ListGatewayGroupsResponse) => void): Request<AlexaForBusiness.Types.ListGatewayGroupsResponse, AWSError>;
  /**
   * Retrieves a list of gateway summaries. Use GetGateway to retrieve details of a specific gateway. An optional gateway group ARN can be provided to only retrieve gateway summaries of gateways that are associated with that gateway group ARN.
   */
  listGateways(params: AlexaForBusiness.Types.ListGatewaysRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.ListGatewaysResponse) => void): Request<AlexaForBusiness.Types.ListGatewaysResponse, AWSError>;
  /**
   * Retrieves a list of gateway summaries. Use GetGateway to retrieve details of a specific gateway. An optional gateway group ARN can be provided to only retrieve gateway summaries of gateways that are associated with that gateway group ARN.
   */
  listGateways(callback?: (err: AWSError, data: AlexaForBusiness.Types.ListGatewaysResponse) => void): Request<AlexaForBusiness.Types.ListGatewaysResponse, AWSError>;
  /**
   * Lists all enabled skills in a specific skill group.
   */
  listSkills(params: AlexaForBusiness.Types.ListSkillsRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.ListSkillsResponse) => void): Request<AlexaForBusiness.Types.ListSkillsResponse, AWSError>;
  /**
   * Lists all enabled skills in a specific skill group.
   */
  listSkills(callback?: (err: AWSError, data: AlexaForBusiness.Types.ListSkillsResponse) => void): Request<AlexaForBusiness.Types.ListSkillsResponse, AWSError>;
  /**
   * Lists all categories in the Alexa skill store.
   */
  listSkillsStoreCategories(params: AlexaForBusiness.Types.ListSkillsStoreCategoriesRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.ListSkillsStoreCategoriesResponse) => void): Request<AlexaForBusiness.Types.ListSkillsStoreCategoriesResponse, AWSError>;
  /**
   * Lists all categories in the Alexa skill store.
   */
  listSkillsStoreCategories(callback?: (err: AWSError, data: AlexaForBusiness.Types.ListSkillsStoreCategoriesResponse) => void): Request<AlexaForBusiness.Types.ListSkillsStoreCategoriesResponse, AWSError>;
  /**
   * Lists all skills in the Alexa skill store by category.
   */
  listSkillsStoreSkillsByCategory(params: AlexaForBusiness.Types.ListSkillsStoreSkillsByCategoryRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.ListSkillsStoreSkillsByCategoryResponse) => void): Request<AlexaForBusiness.Types.ListSkillsStoreSkillsByCategoryResponse, AWSError>;
  /**
   * Lists all skills in the Alexa skill store by category.
   */
  listSkillsStoreSkillsByCategory(callback?: (err: AWSError, data: AlexaForBusiness.Types.ListSkillsStoreSkillsByCategoryResponse) => void): Request<AlexaForBusiness.Types.ListSkillsStoreSkillsByCategoryResponse, AWSError>;
  /**
   * Lists all of the smart home appliances associated with a room.
   */
  listSmartHomeAppliances(params: AlexaForBusiness.Types.ListSmartHomeAppliancesRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.ListSmartHomeAppliancesResponse) => void): Request<AlexaForBusiness.Types.ListSmartHomeAppliancesResponse, AWSError>;
  /**
   * Lists all of the smart home appliances associated with a room.
   */
  listSmartHomeAppliances(callback?: (err: AWSError, data: AlexaForBusiness.Types.ListSmartHomeAppliancesResponse) => void): Request<AlexaForBusiness.Types.ListSmartHomeAppliancesResponse, AWSError>;
  /**
   * Lists all tags for the specified resource.
   */
  listTags(params: AlexaForBusiness.Types.ListTagsRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.ListTagsResponse) => void): Request<AlexaForBusiness.Types.ListTagsResponse, AWSError>;
  /**
   * Lists all tags for the specified resource.
   */
  listTags(callback?: (err: AWSError, data: AlexaForBusiness.Types.ListTagsResponse) => void): Request<AlexaForBusiness.Types.ListTagsResponse, AWSError>;
  /**
   * Sets the conference preferences on a specific conference provider at the account level.
   */
  putConferencePreference(params: AlexaForBusiness.Types.PutConferencePreferenceRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.PutConferencePreferenceResponse) => void): Request<AlexaForBusiness.Types.PutConferencePreferenceResponse, AWSError>;
  /**
   * Sets the conference preferences on a specific conference provider at the account level.
   */
  putConferencePreference(callback?: (err: AWSError, data: AlexaForBusiness.Types.PutConferencePreferenceResponse) => void): Request<AlexaForBusiness.Types.PutConferencePreferenceResponse, AWSError>;
  /**
   * Configures the email template for the user enrollment invitation with the specified attributes.
   */
  putInvitationConfiguration(params: AlexaForBusiness.Types.PutInvitationConfigurationRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.PutInvitationConfigurationResponse) => void): Request<AlexaForBusiness.Types.PutInvitationConfigurationResponse, AWSError>;
  /**
   * Configures the email template for the user enrollment invitation with the specified attributes.
   */
  putInvitationConfiguration(callback?: (err: AWSError, data: AlexaForBusiness.Types.PutInvitationConfigurationResponse) => void): Request<AlexaForBusiness.Types.PutInvitationConfigurationResponse, AWSError>;
  /**
   * Updates room skill parameter details by room, skill, and parameter key ID. Not all skills have a room skill parameter.
   */
  putRoomSkillParameter(params: AlexaForBusiness.Types.PutRoomSkillParameterRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.PutRoomSkillParameterResponse) => void): Request<AlexaForBusiness.Types.PutRoomSkillParameterResponse, AWSError>;
  /**
   * Updates room skill parameter details by room, skill, and parameter key ID. Not all skills have a room skill parameter.
   */
  putRoomSkillParameter(callback?: (err: AWSError, data: AlexaForBusiness.Types.PutRoomSkillParameterResponse) => void): Request<AlexaForBusiness.Types.PutRoomSkillParameterResponse, AWSError>;
  /**
   * Links a user's account to a third-party skill provider. If this API operation is called by an assumed IAM role, the skill being linked must be a private skill. Also, the skill must be owned by the AWS account that assumed the IAM role.
   */
  putSkillAuthorization(params: AlexaForBusiness.Types.PutSkillAuthorizationRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.PutSkillAuthorizationResponse) => void): Request<AlexaForBusiness.Types.PutSkillAuthorizationResponse, AWSError>;
  /**
   * Links a user's account to a third-party skill provider. If this API operation is called by an assumed IAM role, the skill being linked must be a private skill. Also, the skill must be owned by the AWS account that assumed the IAM role.
   */
  putSkillAuthorization(callback?: (err: AWSError, data: AlexaForBusiness.Types.PutSkillAuthorizationResponse) => void): Request<AlexaForBusiness.Types.PutSkillAuthorizationResponse, AWSError>;
  /**
   * Registers an Alexa-enabled device built by an Original Equipment Manufacturer (OEM) using Alexa Voice Service (AVS).
   */
  registerAVSDevice(params: AlexaForBusiness.Types.RegisterAVSDeviceRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.RegisterAVSDeviceResponse) => void): Request<AlexaForBusiness.Types.RegisterAVSDeviceResponse, AWSError>;
  /**
   * Registers an Alexa-enabled device built by an Original Equipment Manufacturer (OEM) using Alexa Voice Service (AVS).
   */
  registerAVSDevice(callback?: (err: AWSError, data: AlexaForBusiness.Types.RegisterAVSDeviceResponse) => void): Request<AlexaForBusiness.Types.RegisterAVSDeviceResponse, AWSError>;
  /**
   * Disassociates a skill from the organization under a user's AWS account. If the skill is a private skill, it moves to an AcceptStatus of PENDING. Any private or public skill that is rejected can be added later by calling the ApproveSkill API. 
   */
  rejectSkill(params: AlexaForBusiness.Types.RejectSkillRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.RejectSkillResponse) => void): Request<AlexaForBusiness.Types.RejectSkillResponse, AWSError>;
  /**
   * Disassociates a skill from the organization under a user's AWS account. If the skill is a private skill, it moves to an AcceptStatus of PENDING. Any private or public skill that is rejected can be added later by calling the ApproveSkill API. 
   */
  rejectSkill(callback?: (err: AWSError, data: AlexaForBusiness.Types.RejectSkillResponse) => void): Request<AlexaForBusiness.Types.RejectSkillResponse, AWSError>;
  /**
   * Determines the details for the room from which a skill request was invoked. This operation is used by skill developers. To query ResolveRoom from an Alexa skill, the skill ID needs to be authorized. When the skill is using an AWS Lambda function, the skill is automatically authorized when you publish your skill as a private skill to your AWS account. Skills that are hosted using a custom web service must be manually authorized. To get your skill authorized, contact AWS Support with your AWS account ID that queries the ResolveRoom API and skill ID. 
   */
  resolveRoom(params: AlexaForBusiness.Types.ResolveRoomRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.ResolveRoomResponse) => void): Request<AlexaForBusiness.Types.ResolveRoomResponse, AWSError>;
  /**
   * Determines the details for the room from which a skill request was invoked. This operation is used by skill developers. To query ResolveRoom from an Alexa skill, the skill ID needs to be authorized. When the skill is using an AWS Lambda function, the skill is automatically authorized when you publish your skill as a private skill to your AWS account. Skills that are hosted using a custom web service must be manually authorized. To get your skill authorized, contact AWS Support with your AWS account ID that queries the ResolveRoom API and skill ID. 
   */
  resolveRoom(callback?: (err: AWSError, data: AlexaForBusiness.Types.ResolveRoomResponse) => void): Request<AlexaForBusiness.Types.ResolveRoomResponse, AWSError>;
  /**
   * Revokes an invitation and invalidates the enrollment URL.
   */
  revokeInvitation(params: AlexaForBusiness.Types.RevokeInvitationRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.RevokeInvitationResponse) => void): Request<AlexaForBusiness.Types.RevokeInvitationResponse, AWSError>;
  /**
   * Revokes an invitation and invalidates the enrollment URL.
   */
  revokeInvitation(callback?: (err: AWSError, data: AlexaForBusiness.Types.RevokeInvitationResponse) => void): Request<AlexaForBusiness.Types.RevokeInvitationResponse, AWSError>;
  /**
   * Searches address books and lists the ones that meet a set of filter and sort criteria.
   */
  searchAddressBooks(params: AlexaForBusiness.Types.SearchAddressBooksRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchAddressBooksResponse) => void): Request<AlexaForBusiness.Types.SearchAddressBooksResponse, AWSError>;
  /**
   * Searches address books and lists the ones that meet a set of filter and sort criteria.
   */
  searchAddressBooks(callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchAddressBooksResponse) => void): Request<AlexaForBusiness.Types.SearchAddressBooksResponse, AWSError>;
  /**
   * Searches contacts and lists the ones that meet a set of filter and sort criteria.
   */
  searchContacts(params: AlexaForBusiness.Types.SearchContactsRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchContactsResponse) => void): Request<AlexaForBusiness.Types.SearchContactsResponse, AWSError>;
  /**
   * Searches contacts and lists the ones that meet a set of filter and sort criteria.
   */
  searchContacts(callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchContactsResponse) => void): Request<AlexaForBusiness.Types.SearchContactsResponse, AWSError>;
  /**
   * Searches devices and lists the ones that meet a set of filter criteria.
   */
  searchDevices(params: AlexaForBusiness.Types.SearchDevicesRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchDevicesResponse) => void): Request<AlexaForBusiness.Types.SearchDevicesResponse, AWSError>;
  /**
   * Searches devices and lists the ones that meet a set of filter criteria.
   */
  searchDevices(callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchDevicesResponse) => void): Request<AlexaForBusiness.Types.SearchDevicesResponse, AWSError>;
  /**
   * Searches network profiles and lists the ones that meet a set of filter and sort criteria.
   */
  searchNetworkProfiles(params: AlexaForBusiness.Types.SearchNetworkProfilesRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchNetworkProfilesResponse) => void): Request<AlexaForBusiness.Types.SearchNetworkProfilesResponse, AWSError>;
  /**
   * Searches network profiles and lists the ones that meet a set of filter and sort criteria.
   */
  searchNetworkProfiles(callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchNetworkProfilesResponse) => void): Request<AlexaForBusiness.Types.SearchNetworkProfilesResponse, AWSError>;
  /**
   * Searches room profiles and lists the ones that meet a set of filter criteria.
   */
  searchProfiles(params: AlexaForBusiness.Types.SearchProfilesRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchProfilesResponse) => void): Request<AlexaForBusiness.Types.SearchProfilesResponse, AWSError>;
  /**
   * Searches room profiles and lists the ones that meet a set of filter criteria.
   */
  searchProfiles(callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchProfilesResponse) => void): Request<AlexaForBusiness.Types.SearchProfilesResponse, AWSError>;
  /**
   * Searches rooms and lists the ones that meet a set of filter and sort criteria.
   */
  searchRooms(params: AlexaForBusiness.Types.SearchRoomsRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchRoomsResponse) => void): Request<AlexaForBusiness.Types.SearchRoomsResponse, AWSError>;
  /**
   * Searches rooms and lists the ones that meet a set of filter and sort criteria.
   */
  searchRooms(callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchRoomsResponse) => void): Request<AlexaForBusiness.Types.SearchRoomsResponse, AWSError>;
  /**
   * Searches skill groups and lists the ones that meet a set of filter and sort criteria.
   */
  searchSkillGroups(params: AlexaForBusiness.Types.SearchSkillGroupsRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchSkillGroupsResponse) => void): Request<AlexaForBusiness.Types.SearchSkillGroupsResponse, AWSError>;
  /**
   * Searches skill groups and lists the ones that meet a set of filter and sort criteria.
   */
  searchSkillGroups(callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchSkillGroupsResponse) => void): Request<AlexaForBusiness.Types.SearchSkillGroupsResponse, AWSError>;
  /**
   * Searches users and lists the ones that meet a set of filter and sort criteria.
   */
  searchUsers(params: AlexaForBusiness.Types.SearchUsersRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchUsersResponse) => void): Request<AlexaForBusiness.Types.SearchUsersResponse, AWSError>;
  /**
   * Searches users and lists the ones that meet a set of filter and sort criteria.
   */
  searchUsers(callback?: (err: AWSError, data: AlexaForBusiness.Types.SearchUsersResponse) => void): Request<AlexaForBusiness.Types.SearchUsersResponse, AWSError>;
  /**
   * Triggers an asynchronous flow to send text, SSML, or audio announcements to rooms that are identified by a search or filter. 
   */
  sendAnnouncement(params: AlexaForBusiness.Types.SendAnnouncementRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.SendAnnouncementResponse) => void): Request<AlexaForBusiness.Types.SendAnnouncementResponse, AWSError>;
  /**
   * Triggers an asynchronous flow to send text, SSML, or audio announcements to rooms that are identified by a search or filter. 
   */
  sendAnnouncement(callback?: (err: AWSError, data: AlexaForBusiness.Types.SendAnnouncementResponse) => void): Request<AlexaForBusiness.Types.SendAnnouncementResponse, AWSError>;
  /**
   * Sends an enrollment invitation email with a URL to a user. The URL is valid for 30 days or until you call this operation again, whichever comes first. 
   */
  sendInvitation(params: AlexaForBusiness.Types.SendInvitationRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.SendInvitationResponse) => void): Request<AlexaForBusiness.Types.SendInvitationResponse, AWSError>;
  /**
   * Sends an enrollment invitation email with a URL to a user. The URL is valid for 30 days or until you call this operation again, whichever comes first. 
   */
  sendInvitation(callback?: (err: AWSError, data: AlexaForBusiness.Types.SendInvitationResponse) => void): Request<AlexaForBusiness.Types.SendInvitationResponse, AWSError>;
  /**
   * Resets a device and its account to the known default settings. This clears all information and settings set by previous users in the following ways:   Bluetooth - This unpairs all bluetooth devices paired with your echo device.   Volume - This resets the echo device's volume to the default value.   Notifications - This clears all notifications from your echo device.   Lists - This clears all to-do items from your echo device.   Settings - This internally syncs the room's profile (if the device is assigned to a room), contacts, address books, delegation access for account linking, and communications (if enabled on the room profile).  
   */
  startDeviceSync(params: AlexaForBusiness.Types.StartDeviceSyncRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.StartDeviceSyncResponse) => void): Request<AlexaForBusiness.Types.StartDeviceSyncResponse, AWSError>;
  /**
   * Resets a device and its account to the known default settings. This clears all information and settings set by previous users in the following ways:   Bluetooth - This unpairs all bluetooth devices paired with your echo device.   Volume - This resets the echo device's volume to the default value.   Notifications - This clears all notifications from your echo device.   Lists - This clears all to-do items from your echo device.   Settings - This internally syncs the room's profile (if the device is assigned to a room), contacts, address books, delegation access for account linking, and communications (if enabled on the room profile).  
   */
  startDeviceSync(callback?: (err: AWSError, data: AlexaForBusiness.Types.StartDeviceSyncResponse) => void): Request<AlexaForBusiness.Types.StartDeviceSyncResponse, AWSError>;
  /**
   * Initiates the discovery of any smart home appliances associated with the room.
   */
  startSmartHomeApplianceDiscovery(params: AlexaForBusiness.Types.StartSmartHomeApplianceDiscoveryRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.StartSmartHomeApplianceDiscoveryResponse) => void): Request<AlexaForBusiness.Types.StartSmartHomeApplianceDiscoveryResponse, AWSError>;
  /**
   * Initiates the discovery of any smart home appliances associated with the room.
   */
  startSmartHomeApplianceDiscovery(callback?: (err: AWSError, data: AlexaForBusiness.Types.StartSmartHomeApplianceDiscoveryResponse) => void): Request<AlexaForBusiness.Types.StartSmartHomeApplianceDiscoveryResponse, AWSError>;
  /**
   * Adds metadata tags to a specified resource.
   */
  tagResource(params: AlexaForBusiness.Types.TagResourceRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.TagResourceResponse) => void): Request<AlexaForBusiness.Types.TagResourceResponse, AWSError>;
  /**
   * Adds metadata tags to a specified resource.
   */
  tagResource(callback?: (err: AWSError, data: AlexaForBusiness.Types.TagResourceResponse) => void): Request<AlexaForBusiness.Types.TagResourceResponse, AWSError>;
  /**
   * Removes metadata tags from a specified resource.
   */
  untagResource(params: AlexaForBusiness.Types.UntagResourceRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.UntagResourceResponse) => void): Request<AlexaForBusiness.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes metadata tags from a specified resource.
   */
  untagResource(callback?: (err: AWSError, data: AlexaForBusiness.Types.UntagResourceResponse) => void): Request<AlexaForBusiness.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates address book details by the address book ARN.
   */
  updateAddressBook(params: AlexaForBusiness.Types.UpdateAddressBookRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateAddressBookResponse) => void): Request<AlexaForBusiness.Types.UpdateAddressBookResponse, AWSError>;
  /**
   * Updates address book details by the address book ARN.
   */
  updateAddressBook(callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateAddressBookResponse) => void): Request<AlexaForBusiness.Types.UpdateAddressBookResponse, AWSError>;
  /**
   * Updates the configuration of the report delivery schedule with the specified schedule ARN.
   */
  updateBusinessReportSchedule(params: AlexaForBusiness.Types.UpdateBusinessReportScheduleRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateBusinessReportScheduleResponse) => void): Request<AlexaForBusiness.Types.UpdateBusinessReportScheduleResponse, AWSError>;
  /**
   * Updates the configuration of the report delivery schedule with the specified schedule ARN.
   */
  updateBusinessReportSchedule(callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateBusinessReportScheduleResponse) => void): Request<AlexaForBusiness.Types.UpdateBusinessReportScheduleResponse, AWSError>;
  /**
   * Updates an existing conference provider's settings.
   */
  updateConferenceProvider(params: AlexaForBusiness.Types.UpdateConferenceProviderRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateConferenceProviderResponse) => void): Request<AlexaForBusiness.Types.UpdateConferenceProviderResponse, AWSError>;
  /**
   * Updates an existing conference provider's settings.
   */
  updateConferenceProvider(callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateConferenceProviderResponse) => void): Request<AlexaForBusiness.Types.UpdateConferenceProviderResponse, AWSError>;
  /**
   * Updates the contact details by the contact ARN.
   */
  updateContact(params: AlexaForBusiness.Types.UpdateContactRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateContactResponse) => void): Request<AlexaForBusiness.Types.UpdateContactResponse, AWSError>;
  /**
   * Updates the contact details by the contact ARN.
   */
  updateContact(callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateContactResponse) => void): Request<AlexaForBusiness.Types.UpdateContactResponse, AWSError>;
  /**
   * Updates the device name by device ARN.
   */
  updateDevice(params: AlexaForBusiness.Types.UpdateDeviceRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateDeviceResponse) => void): Request<AlexaForBusiness.Types.UpdateDeviceResponse, AWSError>;
  /**
   * Updates the device name by device ARN.
   */
  updateDevice(callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateDeviceResponse) => void): Request<AlexaForBusiness.Types.UpdateDeviceResponse, AWSError>;
  /**
   * Updates the details of a gateway. If any optional field is not provided, the existing corresponding value is left unmodified.
   */
  updateGateway(params: AlexaForBusiness.Types.UpdateGatewayRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateGatewayResponse) => void): Request<AlexaForBusiness.Types.UpdateGatewayResponse, AWSError>;
  /**
   * Updates the details of a gateway. If any optional field is not provided, the existing corresponding value is left unmodified.
   */
  updateGateway(callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateGatewayResponse) => void): Request<AlexaForBusiness.Types.UpdateGatewayResponse, AWSError>;
  /**
   * Updates the details of a gateway group. If any optional field is not provided, the existing corresponding value is left unmodified.
   */
  updateGatewayGroup(params: AlexaForBusiness.Types.UpdateGatewayGroupRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateGatewayGroupResponse) => void): Request<AlexaForBusiness.Types.UpdateGatewayGroupResponse, AWSError>;
  /**
   * Updates the details of a gateway group. If any optional field is not provided, the existing corresponding value is left unmodified.
   */
  updateGatewayGroup(callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateGatewayGroupResponse) => void): Request<AlexaForBusiness.Types.UpdateGatewayGroupResponse, AWSError>;
  /**
   * Updates a network profile by the network profile ARN.
   */
  updateNetworkProfile(params: AlexaForBusiness.Types.UpdateNetworkProfileRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateNetworkProfileResponse) => void): Request<AlexaForBusiness.Types.UpdateNetworkProfileResponse, AWSError>;
  /**
   * Updates a network profile by the network profile ARN.
   */
  updateNetworkProfile(callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateNetworkProfileResponse) => void): Request<AlexaForBusiness.Types.UpdateNetworkProfileResponse, AWSError>;
  /**
   * Updates an existing room profile by room profile ARN.
   */
  updateProfile(params: AlexaForBusiness.Types.UpdateProfileRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateProfileResponse) => void): Request<AlexaForBusiness.Types.UpdateProfileResponse, AWSError>;
  /**
   * Updates an existing room profile by room profile ARN.
   */
  updateProfile(callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateProfileResponse) => void): Request<AlexaForBusiness.Types.UpdateProfileResponse, AWSError>;
  /**
   * Updates room details by room ARN.
   */
  updateRoom(params: AlexaForBusiness.Types.UpdateRoomRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateRoomResponse) => void): Request<AlexaForBusiness.Types.UpdateRoomResponse, AWSError>;
  /**
   * Updates room details by room ARN.
   */
  updateRoom(callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateRoomResponse) => void): Request<AlexaForBusiness.Types.UpdateRoomResponse, AWSError>;
  /**
   * Updates skill group details by skill group ARN.
   */
  updateSkillGroup(params: AlexaForBusiness.Types.UpdateSkillGroupRequest, callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateSkillGroupResponse) => void): Request<AlexaForBusiness.Types.UpdateSkillGroupResponse, AWSError>;
  /**
   * Updates skill group details by skill group ARN.
   */
  updateSkillGroup(callback?: (err: AWSError, data: AlexaForBusiness.Types.UpdateSkillGroupResponse) => void): Request<AlexaForBusiness.Types.UpdateSkillGroupResponse, AWSError>;
}
declare namespace AlexaForBusiness {
  export type Address = string;
  export interface AddressBook {
    /**
     * The ARN of the address book.
     */
    AddressBookArn?: Arn;
    /**
     * The name of the address book.
     */
    Name?: AddressBookName;
    /**
     * The description of the address book.
     */
    Description?: AddressBookDescription;
  }
  export interface AddressBookData {
    /**
     * The ARN of the address book.
     */
    AddressBookArn?: Arn;
    /**
     * The name of the address book.
     */
    Name?: AddressBookName;
    /**
     * The description of the address book.
     */
    Description?: AddressBookDescription;
  }
  export type AddressBookDataList = AddressBookData[];
  export type AddressBookDescription = string;
  export type AddressBookName = string;
  export type AmazonId = string;
  export type ApplianceDescription = string;
  export type ApplianceFriendlyName = string;
  export type ApplianceManufacturerName = string;
  export interface ApproveSkillRequest {
    /**
     * The unique identifier of the skill.
     */
    SkillId: SkillId;
  }
  export interface ApproveSkillResponse {
  }
  export type Arn = string;
  export interface AssociateContactWithAddressBookRequest {
    /**
     * The ARN of the contact to associate with an address book.
     */
    ContactArn: Arn;
    /**
     * The ARN of the address book with which to associate the contact.
     */
    AddressBookArn: Arn;
  }
  export interface AssociateContactWithAddressBookResponse {
  }
  export interface AssociateDeviceWithNetworkProfileRequest {
    /**
     * The device ARN.
     */
    DeviceArn: Arn;
    /**
     * The ARN of the network profile to associate with a device.
     */
    NetworkProfileArn: Arn;
  }
  export interface AssociateDeviceWithNetworkProfileResponse {
  }
  export interface AssociateDeviceWithRoomRequest {
    /**
     * The ARN of the device to associate to a room. Required.
     */
    DeviceArn?: Arn;
    /**
     * The ARN of the room with which to associate the device. Required.
     */
    RoomArn?: Arn;
  }
  export interface AssociateDeviceWithRoomResponse {
  }
  export interface AssociateSkillGroupWithRoomRequest {
    /**
     * The ARN of the skill group to associate with a room. Required.
     */
    SkillGroupArn?: Arn;
    /**
     * The ARN of the room with which to associate the skill group. Required.
     */
    RoomArn?: Arn;
  }
  export interface AssociateSkillGroupWithRoomResponse {
  }
  export interface AssociateSkillWithSkillGroupRequest {
    /**
     * The ARN of the skill group to associate the skill to. Required.
     */
    SkillGroupArn?: Arn;
    /**
     * The unique identifier of the skill.
     */
    SkillId: SkillId;
  }
  export interface AssociateSkillWithSkillGroupResponse {
  }
  export interface AssociateSkillWithUsersRequest {
    /**
     * The private skill ID you want to make available to enrolled users.
     */
    SkillId: SkillId;
  }
  export interface AssociateSkillWithUsersResponse {
  }
  export interface Audio {
    /**
     * The locale of the audio message. Currently, en-US is supported.
     */
    Locale: Locale;
    /**
     * The location of the audio file. Currently, S3 URLs are supported. Only S3 locations comprised of safe characters are valid. For more information, see Safe Characters.
     */
    Location: AudioLocation;
  }
  export type AudioList = Audio[];
  export type AudioLocation = string;
  export type AuthorizationResult = {[key: string]: Value};
  export type Boolean = boolean;
  export type BulletPoint = string;
  export type BulletPoints = BulletPoint[];
  export interface BusinessReport {
    /**
     * The status of the report generation execution (RUNNING, SUCCEEDED, or FAILED).
     */
    Status?: BusinessReportStatus;
    /**
     * The failure code.
     */
    FailureCode?: BusinessReportFailureCode;
    /**
     * The S3 location of the output reports.
     */
    S3Location?: BusinessReportS3Location;
    /**
     * The time of report delivery.
     */
    DeliveryTime?: BusinessReportDeliveryTime;
    /**
     * The download link where a user can download the report.
     */
    DownloadUrl?: BusinessReportDownloadUrl;
  }
  export interface BusinessReportContentRange {
    /**
     * The interval of the content range.
     */
    Interval: BusinessReportInterval;
  }
  export type BusinessReportDeliveryTime = Date;
  export type BusinessReportDownloadUrl = string;
  export type BusinessReportFailureCode = "ACCESS_DENIED"|"NO_SUCH_BUCKET"|"INTERNAL_FAILURE"|string;
  export type BusinessReportFormat = "CSV"|"CSV_ZIP"|string;
  export type BusinessReportInterval = "ONE_DAY"|"ONE_WEEK"|"THIRTY_DAYS"|string;
  export interface BusinessReportRecurrence {
    /**
     * The start date.
     */
    StartDate?: _Date;
  }
  export interface BusinessReportS3Location {
    /**
     * The path of the business report.
     */
    Path?: BusinessReportS3Path;
    /**
     * The S3 bucket name of the output reports.
     */
    BucketName?: CustomerS3BucketName;
  }
  export type BusinessReportS3Path = string;
  export interface BusinessReportSchedule {
    /**
     * The ARN of the business report schedule.
     */
    ScheduleArn?: Arn;
    /**
     * The name identifier of the schedule.
     */
    ScheduleName?: BusinessReportScheduleName;
    /**
     * The S3 bucket name of the output reports.
     */
    S3BucketName?: CustomerS3BucketName;
    /**
     * The S3 key where the report is delivered.
     */
    S3KeyPrefix?: S3KeyPrefix;
    /**
     * The format of the generated report (individual CSV files or zipped files of individual files).
     */
    Format?: BusinessReportFormat;
    /**
     * The content range of the reports.
     */
    ContentRange?: BusinessReportContentRange;
    /**
     * The recurrence of the reports.
     */
    Recurrence?: BusinessReportRecurrence;
    /**
     * The details of the last business report delivery for a specified time interval.
     */
    LastBusinessReport?: BusinessReport;
  }
  export type BusinessReportScheduleList = BusinessReportSchedule[];
  export type BusinessReportScheduleName = string;
  export type BusinessReportStatus = "RUNNING"|"SUCCEEDED"|"FAILED"|string;
  export interface Category {
    /**
     * The ID of the skill store category.
     */
    CategoryId?: CategoryId;
    /**
     * The name of the skill store category.
     */
    CategoryName?: CategoryName;
  }
  export type CategoryId = number;
  export type CategoryList = Category[];
  export type CategoryName = string;
  export type CertificateTime = Date;
  export type ClientId = string;
  export type ClientRequestToken = string;
  export type CommsProtocol = "SIP"|"SIPS"|"H323"|string;
  export interface ConferencePreference {
    /**
     * The ARN of the default conference provider.
     */
    DefaultConferenceProviderArn?: Arn;
  }
  export interface ConferenceProvider {
    /**
     * The ARN of the newly created conference provider.
     */
    Arn?: Arn;
    /**
     * The name of the conference provider.
     */
    Name?: ConferenceProviderName;
    /**
     * The type of conference providers.
     */
    Type?: ConferenceProviderType;
    /**
     * The IP endpoint and protocol for calling.
     */
    IPDialIn?: IPDialIn;
    /**
     * The information for PSTN conferencing.
     */
    PSTNDialIn?: PSTNDialIn;
    /**
     * The meeting settings for the conference provider.
     */
    MeetingSetting?: MeetingSetting;
  }
  export type ConferenceProviderName = string;
  export type ConferenceProviderType = "CHIME"|"BLUEJEANS"|"FUZE"|"GOOGLE_HANGOUTS"|"POLYCOM"|"RINGCENTRAL"|"SKYPE_FOR_BUSINESS"|"WEBEX"|"ZOOM"|"CUSTOM"|string;
  export type ConferenceProvidersList = ConferenceProvider[];
  export type ConnectionStatus = "ONLINE"|"OFFLINE"|string;
  export type ConnectionStatusUpdatedTime = Date;
  export interface Contact {
    /**
     * The ARN of the contact.
     */
    ContactArn?: Arn;
    /**
     * The name of the contact to display on the console.
     */
    DisplayName?: ContactName;
    /**
     * The first name of the contact, used to call the contact on the device.
     */
    FirstName?: ContactName;
    /**
     * The last name of the contact, used to call the contact on the device.
     */
    LastName?: ContactName;
    /**
     * The phone number of the contact. The phone number type defaults to WORK. You can either specify PhoneNumber or PhoneNumbers. We recommend that you use PhoneNumbers, which lets you specify the phone number type and multiple numbers.
     */
    PhoneNumber?: RawPhoneNumber;
    /**
     * The list of phone numbers for the contact.
     */
    PhoneNumbers?: PhoneNumberList;
    /**
     * The list of SIP addresses for the contact.
     */
    SipAddresses?: SipAddressList;
  }
  export interface ContactData {
    /**
     * The ARN of the contact.
     */
    ContactArn?: Arn;
    /**
     * The name of the contact to display on the console.
     */
    DisplayName?: ContactName;
    /**
     * The first name of the contact, used to call the contact on the device.
     */
    FirstName?: ContactName;
    /**
     * The last name of the contact, used to call the contact on the device.
     */
    LastName?: ContactName;
    /**
     * The phone number of the contact. The phone number type defaults to WORK. You can specify PhoneNumber or PhoneNumbers. We recommend that you use PhoneNumbers, which lets you specify the phone number type and multiple numbers.
     */
    PhoneNumber?: RawPhoneNumber;
    /**
     * The list of phone numbers for the contact.
     */
    PhoneNumbers?: PhoneNumberList;
    /**
     * The list of SIP addresses for the contact.
     */
    SipAddresses?: SipAddressList;
  }
  export type ContactDataList = ContactData[];
  export type ContactName = string;
  export interface Content {
    /**
     * The list of text messages.
     */
    TextList?: TextList;
    /**
     * The list of SSML messages.
     */
    SsmlList?: SsmlList;
    /**
     * The list of audio messages.
     */
    AudioList?: AudioList;
  }
  export type CountryCode = string;
  export interface CreateAddressBookRequest {
    /**
     * The name of the address book.
     */
    Name: AddressBookName;
    /**
     * The description of the address book.
     */
    Description?: AddressBookDescription;
    /**
     * A unique, user-specified identifier for the request that ensures idempotency.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The tags to be added to the specified resource. Do not provide system tags.
     */
    Tags?: TagList;
  }
  export interface CreateAddressBookResponse {
    /**
     * The ARN of the newly created address book.
     */
    AddressBookArn?: Arn;
  }
  export interface CreateBusinessReportScheduleRequest {
    /**
     * The name identifier of the schedule.
     */
    ScheduleName?: BusinessReportScheduleName;
    /**
     * The S3 bucket name of the output reports. If this isn't specified, the report can be retrieved from a download link by calling ListBusinessReportSchedule. 
     */
    S3BucketName?: CustomerS3BucketName;
    /**
     * The S3 key where the report is delivered.
     */
    S3KeyPrefix?: S3KeyPrefix;
    /**
     * The format of the generated report (individual CSV files or zipped files of individual files).
     */
    Format: BusinessReportFormat;
    /**
     * The content range of the reports.
     */
    ContentRange: BusinessReportContentRange;
    /**
     * The recurrence of the reports. If this isn't specified, the report will only be delivered one time when the API is called. 
     */
    Recurrence?: BusinessReportRecurrence;
    /**
     * The client request token.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The tags for the business report schedule.
     */
    Tags?: TagList;
  }
  export interface CreateBusinessReportScheduleResponse {
    /**
     * The ARN of the business report schedule.
     */
    ScheduleArn?: Arn;
  }
  export interface CreateConferenceProviderRequest {
    /**
     * The name of the conference provider.
     */
    ConferenceProviderName: ConferenceProviderName;
    /**
     * Represents a type within a list of predefined types.
     */
    ConferenceProviderType: ConferenceProviderType;
    /**
     * The IP endpoint and protocol for calling.
     */
    IPDialIn?: IPDialIn;
    /**
     * The information for PSTN conferencing.
     */
    PSTNDialIn?: PSTNDialIn;
    /**
     * The meeting settings for the conference provider.
     */
    MeetingSetting: MeetingSetting;
    /**
     * The request token of the client.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The tags to be added to the specified resource. Do not provide system tags.
     */
    Tags?: TagList;
  }
  export interface CreateConferenceProviderResponse {
    /**
     * The ARN of the newly-created conference provider.
     */
    ConferenceProviderArn?: Arn;
  }
  export interface CreateContactRequest {
    /**
     * The name of the contact to display on the console.
     */
    DisplayName?: ContactName;
    /**
     * The first name of the contact that is used to call the contact on the device.
     */
    FirstName: ContactName;
    /**
     * The last name of the contact that is used to call the contact on the device.
     */
    LastName?: ContactName;
    /**
     * The phone number of the contact in E.164 format. The phone number type defaults to WORK. You can specify PhoneNumber or PhoneNumbers. We recommend that you use PhoneNumbers, which lets you specify the phone number type and multiple numbers.
     */
    PhoneNumber?: RawPhoneNumber;
    /**
     * The list of phone numbers for the contact.
     */
    PhoneNumbers?: PhoneNumberList;
    /**
     * The list of SIP addresses for the contact.
     */
    SipAddresses?: SipAddressList;
    /**
     * A unique, user-specified identifier for this request that ensures idempotency.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The tags to be added to the specified resource. Do not provide system tags.
     */
    Tags?: TagList;
  }
  export interface CreateContactResponse {
    /**
     * The ARN of the newly created address book.
     */
    ContactArn?: Arn;
  }
  export interface CreateEndOfMeetingReminder {
    /**
     *  A range of 3 to 15 minutes that determines when the reminder begins.
     */
    ReminderAtMinutes: EndOfMeetingReminderMinutesList;
    /**
     * The type of sound that users hear during the end of meeting reminder. 
     */
    ReminderType: EndOfMeetingReminderType;
    /**
     * Whether an end of meeting reminder is enabled or not.
     */
    Enabled: Boolean;
  }
  export interface CreateGatewayGroupRequest {
    /**
     * The name of the gateway group.
     */
    Name: GatewayGroupName;
    /**
     * The description of the gateway group.
     */
    Description?: GatewayGroupDescription;
    /**
     *  A unique, user-specified identifier for the request that ensures idempotency.
     */
    ClientRequestToken: ClientRequestToken;
    /**
     * The tags to be added to the specified resource. Do not provide system tags.
     */
    Tags?: TagList;
  }
  export interface CreateGatewayGroupResponse {
    /**
     * The ARN of the created gateway group.
     */
    GatewayGroupArn?: Arn;
  }
  export interface CreateInstantBooking {
    /**
     * Duration between 15 and 240 minutes at increments of 15 that determines how long to book an available room when a meeting is started with Alexa.
     */
    DurationInMinutes: Minutes;
    /**
     * Whether instant booking is enabled or not.
     */
    Enabled: Boolean;
  }
  export interface CreateMeetingRoomConfiguration {
    /**
     * Whether room utilization metrics are enabled or not.
     */
    RoomUtilizationMetricsEnabled?: Boolean;
    EndOfMeetingReminder?: CreateEndOfMeetingReminder;
    /**
     * Settings to automatically book a room for a configured duration if it's free when joining a meeting with Alexa.
     */
    InstantBooking?: CreateInstantBooking;
    /**
     * Settings for requiring a check in when a room is reserved. Alexa can cancel a room reservation if it's not checked into to make the room available for others. Users can check in by joining the meeting with Alexa or an AVS device, or by saying “Alexa, check in.”
     */
    RequireCheckIn?: CreateRequireCheckIn;
  }
  export interface CreateNetworkProfileRequest {
    /**
     * The name of the network profile associated with a device.
     */
    NetworkProfileName: NetworkProfileName;
    /**
     * Detailed information about a device's network profile.
     */
    Description?: NetworkProfileDescription;
    /**
     * The SSID of the Wi-Fi network.
     */
    Ssid: NetworkSsid;
    /**
     * The security type of the Wi-Fi network. This can be WPA2_ENTERPRISE, WPA2_PSK, WPA_PSK, WEP, or OPEN.
     */
    SecurityType: NetworkSecurityType;
    /**
     * The authentication standard that is used in the EAP framework. Currently, EAP_TLS is supported.
     */
    EapMethod?: NetworkEapMethod;
    /**
     * The current password of the Wi-Fi network.
     */
    CurrentPassword?: CurrentWiFiPassword;
    /**
     * The next, or subsequent, password of the Wi-Fi network. This password is asynchronously transmitted to the device and is used when the password of the network changes to NextPassword. 
     */
    NextPassword?: NextWiFiPassword;
    /**
     * The ARN of the Private Certificate Authority (PCA) created in AWS Certificate Manager (ACM). This is used to issue certificates to the devices. 
     */
    CertificateAuthorityArn?: Arn;
    /**
     * The root certificates of your authentication server that is installed on your devices and used to trust your authentication server during EAP negotiation. 
     */
    TrustAnchors?: TrustAnchorList;
    ClientRequestToken: ClientRequestToken;
    /**
     * The tags to be added to the specified resource. Do not provide system tags. 
     */
    Tags?: TagList;
  }
  export interface CreateNetworkProfileResponse {
    /**
     * The ARN of the network profile associated with a device.
     */
    NetworkProfileArn?: Arn;
  }
  export interface CreateProfileRequest {
    /**
     * The name of a room profile.
     */
    ProfileName: ProfileName;
    /**
     * The time zone used by a room profile.
     */
    Timezone: Timezone;
    /**
     * The valid address for the room.
     */
    Address: Address;
    /**
     * The distance unit to be used by devices in the profile.
     */
    DistanceUnit: DistanceUnit;
    /**
     * The temperature unit to be used by devices in the profile.
     */
    TemperatureUnit: TemperatureUnit;
    /**
     * A wake word for Alexa, Echo, Amazon, or a computer.
     */
    WakeWord: WakeWord;
    /**
     * The locale of the room profile. (This is currently only available to a limited preview audience.)
     */
    Locale?: DeviceLocale;
    /**
     * The user-specified token that is used during the creation of a profile.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * Whether room profile setup is enabled.
     */
    SetupModeDisabled?: Boolean;
    /**
     * The maximum volume limit for a room profile.
     */
    MaxVolumeLimit?: MaxVolumeLimit;
    /**
     * Whether PSTN calling is enabled.
     */
    PSTNEnabled?: Boolean;
    /**
     * Whether data retention of the profile is enabled.
     */
    DataRetentionOptIn?: Boolean;
    /**
     * The meeting room settings of a room profile.
     */
    MeetingRoomConfiguration?: CreateMeetingRoomConfiguration;
    /**
     * The tags for the profile.
     */
    Tags?: TagList;
  }
  export interface CreateProfileResponse {
    /**
     * The ARN of the newly created room profile in the response.
     */
    ProfileArn?: Arn;
  }
  export interface CreateRequireCheckIn {
    /**
     * Duration between 5 and 20 minutes to determine when to release the room if it's not checked into.
     */
    ReleaseAfterMinutes: Minutes;
    /**
     * Whether require check in is enabled or not.
     */
    Enabled: Boolean;
  }
  export interface CreateRoomRequest {
    /**
     * The name for the room.
     */
    RoomName: RoomName;
    /**
     * The description for the room.
     */
    Description?: RoomDescription;
    /**
     * The profile ARN for the room. This is required.
     */
    ProfileArn?: Arn;
    /**
     * The calendar ARN for the room.
     */
    ProviderCalendarId?: ProviderCalendarId;
    /**
     * A unique, user-specified identifier for this request that ensures idempotency. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The tags for the room.
     */
    Tags?: TagList;
  }
  export interface CreateRoomResponse {
    /**
     * The ARN of the newly created room in the response.
     */
    RoomArn?: Arn;
  }
  export interface CreateSkillGroupRequest {
    /**
     * The name for the skill group.
     */
    SkillGroupName: SkillGroupName;
    /**
     * The description for the skill group.
     */
    Description?: SkillGroupDescription;
    /**
     * A unique, user-specified identifier for this request that ensures idempotency. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The tags for the skill group.
     */
    Tags?: TagList;
  }
  export interface CreateSkillGroupResponse {
    /**
     * The ARN of the newly created skill group in the response.
     */
    SkillGroupArn?: Arn;
  }
  export interface CreateUserRequest {
    /**
     * The ARN for the user.
     */
    UserId: user_UserId;
    /**
     * The first name for the user.
     */
    FirstName?: user_FirstName;
    /**
     * The last name for the user.
     */
    LastName?: user_LastName;
    /**
     * The email address for the user.
     */
    Email?: Email;
    /**
     * A unique, user-specified identifier for this request that ensures idempotency. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The tags for the user.
     */
    Tags?: TagList;
  }
  export interface CreateUserResponse {
    /**
     * The ARN of the newly created user in the response.
     */
    UserArn?: Arn;
  }
  export type CurrentWiFiPassword = string;
  export type CustomerS3BucketName = string;
  export type _Date = string;
  export interface DeleteAddressBookRequest {
    /**
     * The ARN of the address book to delete.
     */
    AddressBookArn: Arn;
  }
  export interface DeleteAddressBookResponse {
  }
  export interface DeleteBusinessReportScheduleRequest {
    /**
     * The ARN of the business report schedule.
     */
    ScheduleArn: Arn;
  }
  export interface DeleteBusinessReportScheduleResponse {
  }
  export interface DeleteConferenceProviderRequest {
    /**
     * The ARN of the conference provider.
     */
    ConferenceProviderArn: Arn;
  }
  export interface DeleteConferenceProviderResponse {
  }
  export interface DeleteContactRequest {
    /**
     * The ARN of the contact to delete.
     */
    ContactArn: Arn;
  }
  export interface DeleteContactResponse {
  }
  export interface DeleteDeviceRequest {
    /**
     * The ARN of the device for which to request details.
     */
    DeviceArn: Arn;
  }
  export interface DeleteDeviceResponse {
  }
  export interface DeleteDeviceUsageDataRequest {
    /**
     * The ARN of the device.
     */
    DeviceArn: Arn;
    /**
     * The type of usage data to delete.
     */
    DeviceUsageType: DeviceUsageType;
  }
  export interface DeleteDeviceUsageDataResponse {
  }
  export interface DeleteGatewayGroupRequest {
    /**
     * The ARN of the gateway group to delete.
     */
    GatewayGroupArn: Arn;
  }
  export interface DeleteGatewayGroupResponse {
  }
  export interface DeleteNetworkProfileRequest {
    /**
     * The ARN of the network profile associated with a device.
     */
    NetworkProfileArn: Arn;
  }
  export interface DeleteNetworkProfileResponse {
  }
  export interface DeleteProfileRequest {
    /**
     * The ARN of the room profile to delete. Required.
     */
    ProfileArn?: Arn;
  }
  export interface DeleteProfileResponse {
  }
  export interface DeleteRoomRequest {
    /**
     * The ARN of the room to delete. Required.
     */
    RoomArn?: Arn;
  }
  export interface DeleteRoomResponse {
  }
  export interface DeleteRoomSkillParameterRequest {
    /**
     * The ARN of the room from which to remove the room skill parameter details.
     */
    RoomArn?: Arn;
    /**
     * The ID of the skill from which to remove the room skill parameter details.
     */
    SkillId: SkillId;
    /**
     * The room skill parameter key for which to remove details.
     */
    ParameterKey: RoomSkillParameterKey;
  }
  export interface DeleteRoomSkillParameterResponse {
  }
  export interface DeleteSkillAuthorizationRequest {
    /**
     * The unique identifier of a skill.
     */
    SkillId: SkillId;
    /**
     * The room that the skill is authorized for.
     */
    RoomArn?: Arn;
  }
  export interface DeleteSkillAuthorizationResponse {
  }
  export interface DeleteSkillGroupRequest {
    /**
     * The ARN of the skill group to delete. Required.
     */
    SkillGroupArn?: Arn;
  }
  export interface DeleteSkillGroupResponse {
  }
  export interface DeleteUserRequest {
    /**
     * The ARN of the user to delete in the organization. Required.
     */
    UserArn?: Arn;
    /**
     * The ARN of the user's enrollment in the organization. Required.
     */
    EnrollmentId: EnrollmentId;
  }
  export interface DeleteUserResponse {
  }
  export interface DeveloperInfo {
    /**
     * The name of the developer.
     */
    DeveloperName?: DeveloperName;
    /**
     * The URL of the privacy policy.
     */
    PrivacyPolicy?: PrivacyPolicy;
    /**
     * The email of the developer.
     */
    Email?: Email;
    /**
     * The website of the developer.
     */
    Url?: Url;
  }
  export type DeveloperName = string;
  export interface Device {
    /**
     * The ARN of a device.
     */
    DeviceArn?: Arn;
    /**
     * The serial number of a device.
     */
    DeviceSerialNumber?: DeviceSerialNumber;
    /**
     * The type of a device.
     */
    DeviceType?: DeviceType;
    /**
     * The name of a device.
     */
    DeviceName?: DeviceName;
    /**
     * The software version of a device.
     */
    SoftwareVersion?: SoftwareVersion;
    /**
     * The MAC address of a device.
     */
    MacAddress?: MacAddress;
    /**
     * The room ARN of a device.
     */
    RoomArn?: Arn;
    /**
     * The status of a device. If the status is not READY, check the DeviceStatusInfo value for details.
     */
    DeviceStatus?: DeviceStatus;
    /**
     * Detailed information about a device's status.
     */
    DeviceStatusInfo?: DeviceStatusInfo;
    /**
     * Detailed information about a device's network profile.
     */
    NetworkProfileInfo?: DeviceNetworkProfileInfo;
  }
  export interface DeviceData {
    /**
     * The ARN of a device.
     */
    DeviceArn?: Arn;
    /**
     * The serial number of a device.
     */
    DeviceSerialNumber?: DeviceSerialNumber;
    /**
     * The type of a device.
     */
    DeviceType?: DeviceType;
    /**
     * The name of a device.
     */
    DeviceName?: DeviceName;
    /**
     * The software version of a device.
     */
    SoftwareVersion?: SoftwareVersion;
    /**
     * The MAC address of a device.
     */
    MacAddress?: MacAddress;
    /**
     * The status of a device.
     */
    DeviceStatus?: DeviceStatus;
    /**
     * The ARN of the network profile associated with a device.
     */
    NetworkProfileArn?: Arn;
    /**
     * The name of the network profile associated with a device.
     */
    NetworkProfileName?: NetworkProfileName;
    /**
     * The room ARN associated with a device.
     */
    RoomArn?: Arn;
    /**
     * The name of the room associated with a device.
     */
    RoomName?: DeviceRoomName;
    /**
     * Detailed information about a device's status.
     */
    DeviceStatusInfo?: DeviceStatusInfo;
    /**
     * The time (in epoch) when the device data was created.
     */
    CreatedTime?: DeviceDataCreatedTime;
  }
  export type DeviceDataCreatedTime = Date;
  export type DeviceDataList = DeviceData[];
  export interface DeviceEvent {
    /**
     * The type of device event.
     */
    Type?: DeviceEventType;
    /**
     * The value of the event.
     */
    Value?: DeviceEventValue;
    /**
     * The time (in epoch) when the event occurred. 
     */
    Timestamp?: DeviceEventTime;
  }
  export type DeviceEventList = DeviceEvent[];
  export type DeviceEventTime = Date;
  export type DeviceEventType = "CONNECTION_STATUS"|"DEVICE_STATUS"|string;
  export type DeviceEventValue = string;
  export type DeviceLocale = string;
  export type DeviceName = string;
  export interface DeviceNetworkProfileInfo {
    /**
     * The ARN of the network profile associated with a device.
     */
    NetworkProfileArn?: Arn;
    /**
     * The ARN of the certificate associated with a device.
     */
    CertificateArn?: Arn;
    /**
     * The time (in epoch) when the certificate expires.
     */
    CertificateExpirationTime?: CertificateTime;
  }
  export type DeviceRoomName = string;
  export type DeviceSerialNumber = string;
  export type DeviceSerialNumberForAVS = string;
  export type DeviceStatus = "READY"|"PENDING"|"WAS_OFFLINE"|"DEREGISTERED"|"FAILED"|string;
  export interface DeviceStatusDetail {
    /**
     * The list of available features on the device.
     */
    Feature?: Feature;
    /**
     * The device status detail code.
     */
    Code?: DeviceStatusDetailCode;
  }
  export type DeviceStatusDetailCode = "DEVICE_SOFTWARE_UPDATE_NEEDED"|"DEVICE_WAS_OFFLINE"|"CREDENTIALS_ACCESS_FAILURE"|"TLS_VERSION_MISMATCH"|"ASSOCIATION_REJECTION"|"AUTHENTICATION_FAILURE"|"DHCP_FAILURE"|"INTERNET_UNAVAILABLE"|"DNS_FAILURE"|"UNKNOWN_FAILURE"|"CERTIFICATE_ISSUING_LIMIT_EXCEEDED"|"INVALID_CERTIFICATE_AUTHORITY"|"NETWORK_PROFILE_NOT_FOUND"|"INVALID_PASSWORD_STATE"|"PASSWORD_NOT_FOUND"|"PASSWORD_MANAGER_ACCESS_DENIED"|"CERTIFICATE_AUTHORITY_ACCESS_DENIED"|string;
  export type DeviceStatusDetails = DeviceStatusDetail[];
  export interface DeviceStatusInfo {
    /**
     * One or more device status detail descriptions.
     */
    DeviceStatusDetails?: DeviceStatusDetails;
    /**
     * The latest available information about the connection status of a device. 
     */
    ConnectionStatus?: ConnectionStatus;
    /**
     * The time (in epoch) when the device connection status changed.
     */
    ConnectionStatusUpdatedTime?: ConnectionStatusUpdatedTime;
  }
  export type DeviceType = string;
  export type DeviceUsageType = "VOICE"|string;
  export interface DisassociateContactFromAddressBookRequest {
    /**
     * The ARN of the contact to disassociate from an address book.
     */
    ContactArn: Arn;
    /**
     * The ARN of the address from which to disassociate the contact.
     */
    AddressBookArn: Arn;
  }
  export interface DisassociateContactFromAddressBookResponse {
  }
  export interface DisassociateDeviceFromRoomRequest {
    /**
     * The ARN of the device to disassociate from a room. Required.
     */
    DeviceArn?: Arn;
  }
  export interface DisassociateDeviceFromRoomResponse {
  }
  export interface DisassociateSkillFromSkillGroupRequest {
    /**
     * The unique identifier of a skill. Required.
     */
    SkillGroupArn?: Arn;
    /**
     * The ARN of a skill group to associate to a skill.
     */
    SkillId: SkillId;
  }
  export interface DisassociateSkillFromSkillGroupResponse {
  }
  export interface DisassociateSkillFromUsersRequest {
    /**
     *  The private skill ID you want to make unavailable for enrolled users.
     */
    SkillId: SkillId;
  }
  export interface DisassociateSkillFromUsersResponse {
  }
  export interface DisassociateSkillGroupFromRoomRequest {
    /**
     * The ARN of the skill group to disassociate from a room. Required.
     */
    SkillGroupArn?: Arn;
    /**
     * The ARN of the room from which the skill group is to be disassociated. Required.
     */
    RoomArn?: Arn;
  }
  export interface DisassociateSkillGroupFromRoomResponse {
  }
  export type DistanceUnit = "METRIC"|"IMPERIAL"|string;
  export type Email = string;
  export type EnablementType = "ENABLED"|"PENDING"|string;
  export type EnablementTypeFilter = "ENABLED"|"PENDING"|string;
  export interface EndOfMeetingReminder {
    /**
     * A range of 3 to 15 minutes that determines when the reminder begins.
     */
    ReminderAtMinutes?: EndOfMeetingReminderMinutesList;
    /**
     * The type of sound that users hear during the end of meeting reminder. 
     */
    ReminderType?: EndOfMeetingReminderType;
    /**
     * Whether an end of meeting reminder is enabled or not.
     */
    Enabled?: Boolean;
  }
  export type EndOfMeetingReminderMinutesList = Minutes[];
  export type EndOfMeetingReminderType = "ANNOUNCEMENT_TIME_CHECK"|"ANNOUNCEMENT_VARIABLE_TIME_LEFT"|"CHIME"|"KNOCK"|string;
  export type EndUserLicenseAgreement = string;
  export type Endpoint = string;
  export type EnrollmentId = string;
  export type EnrollmentStatus = "INITIALIZED"|"PENDING"|"REGISTERED"|"DISASSOCIATING"|"DEREGISTERING"|string;
  export type Feature = "BLUETOOTH"|"VOLUME"|"NOTIFICATIONS"|"LISTS"|"SKILLS"|"NETWORK_PROFILE"|"SETTINGS"|"ALL"|string;
  export type Features = Feature[];
  export interface Filter {
    /**
     * The key of a filter.
     */
    Key: FilterKey;
    /**
     * The values of a filter.
     */
    Values: FilterValueList;
  }
  export type FilterKey = string;
  export type FilterList = Filter[];
  export type FilterValue = string;
  export type FilterValueList = FilterValue[];
  export interface ForgetSmartHomeAppliancesRequest {
    /**
     * The room that the appliances are associated with.
     */
    RoomArn: Arn;
  }
  export interface ForgetSmartHomeAppliancesResponse {
  }
  export interface Gateway {
    /**
     * The ARN of the gateway.
     */
    Arn?: Arn;
    /**
     * The name of the gateway.
     */
    Name?: GatewayName;
    /**
     * The description of the gateway.
     */
    Description?: GatewayDescription;
    /**
     * The ARN of the gateway group that the gateway is associated to.
     */
    GatewayGroupArn?: Arn;
    /**
     * The software version of the gateway. The gateway automatically updates its software version during normal operation.
     */
    SoftwareVersion?: GatewayVersion;
  }
  export type GatewayDescription = string;
  export interface GatewayGroup {
    /**
     * The ARN of the gateway group.
     */
    Arn?: Arn;
    /**
     * The name of the gateway group.
     */
    Name?: GatewayGroupName;
    /**
     * The description of the gateway group.
     */
    Description?: GatewayGroupDescription;
  }
  export type GatewayGroupDescription = string;
  export type GatewayGroupName = string;
  export type GatewayGroupSummaries = GatewayGroupSummary[];
  export interface GatewayGroupSummary {
    /**
     * The ARN of the gateway group.
     */
    Arn?: Arn;
    /**
     * The name of the gateway group.
     */
    Name?: GatewayGroupName;
    /**
     * The description of the gateway group.
     */
    Description?: GatewayGroupDescription;
  }
  export type GatewayName = string;
  export type GatewaySummaries = GatewaySummary[];
  export interface GatewaySummary {
    /**
     * The ARN of the gateway.
     */
    Arn?: Arn;
    /**
     * The name of the gateway.
     */
    Name?: GatewayName;
    /**
     * The description of the gateway.
     */
    Description?: GatewayDescription;
    /**
     * The ARN of the gateway group that the gateway is associated to.
     */
    GatewayGroupArn?: Arn;
    /**
     * The software version of the gateway. The gateway automatically updates its software version during normal operation.
     */
    SoftwareVersion?: GatewayVersion;
  }
  export type GatewayVersion = string;
  export type GenericKeyword = string;
  export type GenericKeywords = GenericKeyword[];
  export interface GetAddressBookRequest {
    /**
     * The ARN of the address book for which to request details.
     */
    AddressBookArn: Arn;
  }
  export interface GetAddressBookResponse {
    /**
     * The details of the requested address book.
     */
    AddressBook?: AddressBook;
  }
  export interface GetConferencePreferenceRequest {
  }
  export interface GetConferencePreferenceResponse {
    /**
     * The conference preference.
     */
    Preference?: ConferencePreference;
  }
  export interface GetConferenceProviderRequest {
    /**
     * The ARN of the newly created conference provider.
     */
    ConferenceProviderArn: Arn;
  }
  export interface GetConferenceProviderResponse {
    /**
     * The conference provider.
     */
    ConferenceProvider?: ConferenceProvider;
  }
  export interface GetContactRequest {
    /**
     * The ARN of the contact for which to request details.
     */
    ContactArn: Arn;
  }
  export interface GetContactResponse {
    /**
     * The details of the requested contact.
     */
    Contact?: Contact;
  }
  export interface GetDeviceRequest {
    /**
     * The ARN of the device for which to request details. Required.
     */
    DeviceArn?: Arn;
  }
  export interface GetDeviceResponse {
    /**
     * The details of the device requested. Required.
     */
    Device?: Device;
  }
  export interface GetGatewayGroupRequest {
    /**
     * The ARN of the gateway group to get.
     */
    GatewayGroupArn: Arn;
  }
  export interface GetGatewayGroupResponse {
    GatewayGroup?: GatewayGroup;
  }
  export interface GetGatewayRequest {
    /**
     * The ARN of the gateway to get.
     */
    GatewayArn: Arn;
  }
  export interface GetGatewayResponse {
    /**
     * The details of the gateway.
     */
    Gateway?: Gateway;
  }
  export interface GetInvitationConfigurationRequest {
  }
  export interface GetInvitationConfigurationResponse {
    /**
     * The name of the organization sending the enrollment invite to a user.
     */
    OrganizationName?: OrganizationName;
    /**
     * The email ID of the organization or individual contact that the enrolled user can use. 
     */
    ContactEmail?: Email;
    /**
     * The list of private skill IDs that you want to recommend to the user to enable in the invitation.
     */
    PrivateSkillIds?: ShortSkillIdList;
  }
  export interface GetNetworkProfileRequest {
    /**
     * The ARN of the network profile associated with a device.
     */
    NetworkProfileArn: Arn;
  }
  export interface GetNetworkProfileResponse {
    /**
     * The network profile associated with a device.
     */
    NetworkProfile?: NetworkProfile;
  }
  export interface GetProfileRequest {
    /**
     * The ARN of the room profile for which to request details. Required.
     */
    ProfileArn?: Arn;
  }
  export interface GetProfileResponse {
    /**
     * The details of the room profile requested. Required.
     */
    Profile?: Profile;
  }
  export interface GetRoomRequest {
    /**
     * The ARN of the room for which to request details. Required.
     */
    RoomArn?: Arn;
  }
  export interface GetRoomResponse {
    /**
     * The details of the room requested.
     */
    Room?: Room;
  }
  export interface GetRoomSkillParameterRequest {
    /**
     * The ARN of the room from which to get the room skill parameter details. 
     */
    RoomArn?: Arn;
    /**
     * The ARN of the skill from which to get the room skill parameter details. Required.
     */
    SkillId: SkillId;
    /**
     * The room skill parameter key for which to get details. Required.
     */
    ParameterKey: RoomSkillParameterKey;
  }
  export interface GetRoomSkillParameterResponse {
    /**
     * The details of the room skill parameter requested. Required.
     */
    RoomSkillParameter?: RoomSkillParameter;
  }
  export interface GetSkillGroupRequest {
    /**
     * The ARN of the skill group for which to get details. Required.
     */
    SkillGroupArn?: Arn;
  }
  export interface GetSkillGroupResponse {
    /**
     * The details of the skill group requested. Required.
     */
    SkillGroup?: SkillGroup;
  }
  export interface IPDialIn {
    /**
     * The IP address.
     */
    Endpoint: Endpoint;
    /**
     * The protocol, including SIP, SIPS, and H323.
     */
    CommsProtocol: CommsProtocol;
  }
  export type IconUrl = string;
  export interface InstantBooking {
    /**
     * Duration between 15 and 240 minutes at increments of 15 that determines how long to book an available room when a meeting is started with Alexa. 
     */
    DurationInMinutes?: Minutes;
    /**
     * Whether instant booking is enabled or not.
     */
    Enabled?: Boolean;
  }
  export type InvocationPhrase = string;
  export type Key = string;
  export interface ListBusinessReportSchedulesRequest {
    /**
     * The token used to list the remaining schedules from the previous API call.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of schedules listed in the call.
     */
    MaxResults?: MaxResults;
  }
  export interface ListBusinessReportSchedulesResponse {
    /**
     * The schedule of the reports.
     */
    BusinessReportSchedules?: BusinessReportScheduleList;
    /**
     * The token used to list the remaining schedules from the previous API call.
     */
    NextToken?: NextToken;
  }
  export interface ListConferenceProvidersRequest {
    /**
     * The tokens used for pagination.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of conference providers to be returned, per paginated calls.
     */
    MaxResults?: MaxResults;
  }
  export interface ListConferenceProvidersResponse {
    /**
     * The conference providers.
     */
    ConferenceProviders?: ConferenceProvidersList;
    /**
     * The tokens used for pagination.
     */
    NextToken?: NextToken;
  }
  export interface ListDeviceEventsRequest {
    /**
     * The ARN of a device.
     */
    DeviceArn: Arn;
    /**
     * The event type to filter device events. If EventType isn't specified, this returns a list of all device events in reverse chronological order. If EventType is specified, this returns a list of device events for that EventType in reverse chronological order. 
     */
    EventType?: DeviceEventType;
    /**
     * An optional token returned from a prior request. Use this token for pagination of results from this action. If this parameter is specified, the response only includes results beyond the token, up to the value specified by MaxResults. When the end of results is reached, the response has a value of null.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to include in the response. The default value is 50. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved. 
     */
    MaxResults?: MaxResults;
  }
  export interface ListDeviceEventsResponse {
    /**
     * The device events requested for the device ARN.
     */
    DeviceEvents?: DeviceEventList;
    /**
     * The token returned to indicate that there is more data available.
     */
    NextToken?: NextToken;
  }
  export interface ListGatewayGroupsRequest {
    /**
     * The token used to paginate though multiple pages of gateway group summaries.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of gateway group summaries to return. The default is 50.
     */
    MaxResults?: MaxResults;
  }
  export interface ListGatewayGroupsResponse {
    /**
     * The gateway groups in the list.
     */
    GatewayGroups?: GatewayGroupSummaries;
    /**
     * The token used to paginate though multiple pages of gateway group summaries.
     */
    NextToken?: NextToken;
  }
  export interface ListGatewaysRequest {
    /**
     * The gateway group ARN for which to list gateways.
     */
    GatewayGroupArn?: Arn;
    /**
     * The token used to paginate though multiple pages of gateway summaries.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of gateway summaries to return. The default is 50.
     */
    MaxResults?: MaxResults;
  }
  export interface ListGatewaysResponse {
    /**
     * The gateways in the list.
     */
    Gateways?: GatewaySummaries;
    /**
     * The token used to paginate though multiple pages of gateway summaries.
     */
    NextToken?: NextToken;
  }
  export interface ListSkillsRequest {
    /**
     * The ARN of the skill group for which to list enabled skills.
     */
    SkillGroupArn?: Arn;
    /**
     * Whether the skill is enabled under the user's account.
     */
    EnablementType?: EnablementTypeFilter;
    /**
     * Whether the skill is publicly available or is a private skill.
     */
    SkillType?: SkillTypeFilter;
    /**
     * An optional token returned from a prior request. Use this token for pagination of results from this action. If this parameter is specified, the response includes only results beyond the token, up to the value specified by MaxResults.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: SkillListMaxResults;
  }
  export interface ListSkillsResponse {
    /**
     * The list of enabled skills requested. Required.
     */
    SkillSummaries?: SkillSummaryList;
    /**
     * The token returned to indicate that there is more data available.
     */
    NextToken?: NextToken;
  }
  export interface ListSkillsStoreCategoriesRequest {
    /**
     * The tokens used for pagination.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of categories returned, per paginated calls.
     */
    MaxResults?: MaxResults;
  }
  export interface ListSkillsStoreCategoriesResponse {
    /**
     * The list of categories.
     */
    CategoryList?: CategoryList;
    /**
     * The tokens used for pagination.
     */
    NextToken?: NextToken;
  }
  export interface ListSkillsStoreSkillsByCategoryRequest {
    /**
     * The category ID for which the skills are being retrieved from the skill store.
     */
    CategoryId: CategoryId;
    /**
     * The tokens used for pagination.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of skills returned per paginated calls.
     */
    MaxResults?: SkillListMaxResults;
  }
  export interface ListSkillsStoreSkillsByCategoryResponse {
    /**
     * The skill store skills.
     */
    SkillsStoreSkills?: SkillsStoreSkillList;
    /**
     * The tokens used for pagination.
     */
    NextToken?: NextToken;
  }
  export interface ListSmartHomeAppliancesRequest {
    /**
     * The room that the appliances are associated with.
     */
    RoomArn: Arn;
    /**
     * The maximum number of appliances to be returned, per paginated calls.
     */
    MaxResults?: MaxResults;
    /**
     * The tokens used for pagination.
     */
    NextToken?: NextToken;
  }
  export interface ListSmartHomeAppliancesResponse {
    /**
     * The smart home appliances.
     */
    SmartHomeAppliances?: SmartHomeApplianceList;
    /**
     * The tokens used for pagination.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsRequest {
    /**
     * The ARN of the specified resource for which to list tags.
     */
    Arn: Arn;
    /**
     * An optional token returned from a prior request. Use this token for pagination of results from this action. If this parameter is specified, the response includes only results beyond the token, up to the value specified by MaxResults. 
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: MaxResults;
  }
  export interface ListTagsResponse {
    /**
     * The tags requested for the specified resource.
     */
    Tags?: TagList;
    /**
     * The token returned to indicate that there is more data available.
     */
    NextToken?: NextToken;
  }
  export type Locale = "en-US"|string;
  export type MacAddress = string;
  export type MaxResults = number;
  export type MaxVolumeLimit = number;
  export interface MeetingRoomConfiguration {
    /**
     * Whether room utilization metrics are enabled or not.
     */
    RoomUtilizationMetricsEnabled?: Boolean;
    /**
     * Settings for the end of meeting reminder feature that are applied to a room profile. The end of meeting reminder enables Alexa to remind users when a meeting is ending. 
     */
    EndOfMeetingReminder?: EndOfMeetingReminder;
    /**
     * Settings to automatically book the room if available for a configured duration when joining a meeting with Alexa. 
     */
    InstantBooking?: InstantBooking;
    /**
     * Settings for requiring a check in when a room is reserved. Alexa can cancel a room reservation if it's not checked into. This makes the room available for others. Users can check in by joining the meeting with Alexa or an AVS device, or by saying “Alexa, check in.” 
     */
    RequireCheckIn?: RequireCheckIn;
  }
  export interface MeetingSetting {
    /**
     * The values that indicate whether the pin is always required.
     */
    RequirePin: RequirePin;
  }
  export type Minutes = number;
  export type NetworkEapMethod = "EAP_TLS"|string;
  export interface NetworkProfile {
    /**
     * The ARN of the network profile associated with a device.
     */
    NetworkProfileArn?: Arn;
    /**
     * The name of the network profile associated with a device.
     */
    NetworkProfileName?: NetworkProfileName;
    /**
     * Detailed information about a device's network profile.
     */
    Description?: NetworkProfileDescription;
    /**
     * The SSID of the Wi-Fi network.
     */
    Ssid?: NetworkSsid;
    /**
     * The security type of the Wi-Fi network. This can be WPA2_ENTERPRISE, WPA2_PSK, WPA_PSK, WEP, or OPEN.
     */
    SecurityType?: NetworkSecurityType;
    /**
     * The authentication standard that is used in the EAP framework. Currently, EAP_TLS is supported. 
     */
    EapMethod?: NetworkEapMethod;
    /**
     * The current password of the Wi-Fi network.
     */
    CurrentPassword?: CurrentWiFiPassword;
    /**
     * The next, or subsequent, password of the Wi-Fi network. This password is asynchronously transmitted to the device and is used when the password of the network changes to NextPassword. 
     */
    NextPassword?: NextWiFiPassword;
    /**
     * The ARN of the Private Certificate Authority (PCA) created in AWS Certificate Manager (ACM). This is used to issue certificates to the devices. 
     */
    CertificateAuthorityArn?: Arn;
    /**
     * The root certificates of your authentication server, which is installed on your devices and used to trust your authentication server during EAP negotiation.
     */
    TrustAnchors?: TrustAnchorList;
  }
  export interface NetworkProfileData {
    /**
     * The ARN of the network profile associated with a device.
     */
    NetworkProfileArn?: Arn;
    /**
     * The name of the network profile associated with a device.
     */
    NetworkProfileName?: NetworkProfileName;
    /**
     * Detailed information about a device's network profile.
     */
    Description?: NetworkProfileDescription;
    /**
     * The SSID of the Wi-Fi network.
     */
    Ssid?: NetworkSsid;
    /**
     * The security type of the Wi-Fi network. This can be WPA2_ENTERPRISE, WPA2_PSK, WPA_PSK, WEP, or OPEN.
     */
    SecurityType?: NetworkSecurityType;
    /**
     * The authentication standard that is used in the EAP framework. Currently, EAP_TLS is supported.
     */
    EapMethod?: NetworkEapMethod;
    /**
     * The ARN of the Private Certificate Authority (PCA) created in AWS Certificate Manager (ACM). This is used to issue certificates to the devices.
     */
    CertificateAuthorityArn?: Arn;
  }
  export type NetworkProfileDataList = NetworkProfileData[];
  export type NetworkProfileDescription = string;
  export type NetworkProfileName = string;
  export type NetworkSecurityType = "OPEN"|"WEP"|"WPA_PSK"|"WPA2_PSK"|"WPA2_ENTERPRISE"|string;
  export type NetworkSsid = string;
  export type NewInThisVersionBulletPoints = BulletPoint[];
  export type NextToken = string;
  export type NextWiFiPassword = string;
  export type OneClickIdDelay = string;
  export type OneClickPinDelay = string;
  export type OrganizationName = string;
  export type OutboundPhoneNumber = string;
  export interface PSTNDialIn {
    /**
     * The zip code.
     */
    CountryCode: CountryCode;
    /**
     * The phone number to call to join the conference.
     */
    PhoneNumber: OutboundPhoneNumber;
    /**
     * The delay duration before Alexa enters the conference ID with dual-tone multi-frequency (DTMF). Each number on the dial pad corresponds to a DTMF tone, which is how we send data over the telephone network.
     */
    OneClickIdDelay: OneClickIdDelay;
    /**
     * The delay duration before Alexa enters the conference pin with dual-tone multi-frequency (DTMF). Each number on the dial pad corresponds to a DTMF tone, which is how we send data over the telephone network.
     */
    OneClickPinDelay: OneClickPinDelay;
  }
  export interface PhoneNumber {
    /**
     * The raw value of the phone number.
     */
    Number: RawPhoneNumber;
    /**
     * The type of the phone number.
     */
    Type: PhoneNumberType;
  }
  export type PhoneNumberList = PhoneNumber[];
  export type PhoneNumberType = "MOBILE"|"WORK"|"HOME"|string;
  export type PrivacyPolicy = string;
  export type ProductDescription = string;
  export type ProductId = string;
  export interface Profile {
    /**
     * The ARN of a room profile.
     */
    ProfileArn?: Arn;
    /**
     * The name of a room profile.
     */
    ProfileName?: ProfileName;
    /**
     * Retrieves if the profile is default or not.
     */
    IsDefault?: Boolean;
    /**
     * The address of a room profile.
     */
    Address?: Address;
    /**
     * The time zone of a room profile.
     */
    Timezone?: Timezone;
    /**
     * The distance unit of a room profile.
     */
    DistanceUnit?: DistanceUnit;
    /**
     * The temperature unit of a room profile.
     */
    TemperatureUnit?: TemperatureUnit;
    /**
     * The wake word of a room profile.
     */
    WakeWord?: WakeWord;
    /**
     * The locale of a room profile. (This is currently available only to a limited preview audience.)
     */
    Locale?: DeviceLocale;
    /**
     * The setup mode of a room profile.
     */
    SetupModeDisabled?: Boolean;
    /**
     * The max volume limit of a room profile.
     */
    MaxVolumeLimit?: MaxVolumeLimit;
    /**
     * The PSTN setting of a room profile.
     */
    PSTNEnabled?: Boolean;
    /**
     * Whether data retention of the profile is enabled.
     */
    DataRetentionOptIn?: Boolean;
    /**
     * The ARN of the address book.
     */
    AddressBookArn?: Arn;
    /**
     * Meeting room settings of a room profile.
     */
    MeetingRoomConfiguration?: MeetingRoomConfiguration;
  }
  export interface ProfileData {
    /**
     * The ARN of a room profile.
     */
    ProfileArn?: Arn;
    /**
     * The name of a room profile.
     */
    ProfileName?: ProfileName;
    /**
     * Retrieves if the profile data is default or not.
     */
    IsDefault?: Boolean;
    /**
     * The address of a room profile.
     */
    Address?: Address;
    /**
     * The time zone of a room profile.
     */
    Timezone?: Timezone;
    /**
     * The distance unit of a room profile.
     */
    DistanceUnit?: DistanceUnit;
    /**
     * The temperature unit of a room profile.
     */
    TemperatureUnit?: TemperatureUnit;
    /**
     * The wake word of a room profile.
     */
    WakeWord?: WakeWord;
    /**
     * The locale of a room profile. (This is currently available only to a limited preview audience.)
     */
    Locale?: DeviceLocale;
  }
  export type ProfileDataList = ProfileData[];
  export type ProfileName = string;
  export type ProviderCalendarId = string;
  export interface PutConferencePreferenceRequest {
    /**
     * The conference preference of a specific conference provider.
     */
    ConferencePreference: ConferencePreference;
  }
  export interface PutConferencePreferenceResponse {
  }
  export interface PutInvitationConfigurationRequest {
    /**
     * The name of the organization sending the enrollment invite to a user.
     */
    OrganizationName: OrganizationName;
    /**
     * The email ID of the organization or individual contact that the enrolled user can use. 
     */
    ContactEmail?: Email;
    /**
     * The list of private skill IDs that you want to recommend to the user to enable in the invitation.
     */
    PrivateSkillIds?: ShortSkillIdList;
  }
  export interface PutInvitationConfigurationResponse {
  }
  export interface PutRoomSkillParameterRequest {
    /**
     * The ARN of the room associated with the room skill parameter. Required.
     */
    RoomArn?: Arn;
    /**
     * The ARN of the skill associated with the room skill parameter. Required.
     */
    SkillId: SkillId;
    /**
     * The updated room skill parameter. Required.
     */
    RoomSkillParameter: RoomSkillParameter;
  }
  export interface PutRoomSkillParameterResponse {
  }
  export interface PutSkillAuthorizationRequest {
    /**
     * The authorization result specific to OAUTH code grant output. "Code” must be populated in the AuthorizationResult map to establish the authorization.
     */
    AuthorizationResult: AuthorizationResult;
    /**
     * The unique identifier of a skill.
     */
    SkillId: SkillId;
    /**
     * The room that the skill is authorized for.
     */
    RoomArn?: Arn;
  }
  export interface PutSkillAuthorizationResponse {
  }
  export type RawPhoneNumber = string;
  export interface RegisterAVSDeviceRequest {
    /**
     * The client ID of the OEM used for code-based linking authorization on an AVS device.
     */
    ClientId: ClientId;
    /**
     * The code that is obtained after your AVS device has made a POST request to LWA as a part of the Device Authorization Request component of the OAuth code-based linking specification.
     */
    UserCode: UserCode;
    /**
     * The product ID used to identify your AVS device during authorization.
     */
    ProductId: ProductId;
    /**
     * The key generated by the OEM that uniquely identifies a specified instance of your AVS device.
     */
    DeviceSerialNumber?: DeviceSerialNumberForAVS;
    /**
     * The device type ID for your AVS device generated by Amazon when the OEM creates a new product on Amazon's Developer Console.
     */
    AmazonId: AmazonId;
    /**
     * The Amazon Resource Name (ARN) of the room with which to associate your AVS device.
     */
    RoomArn?: Arn;
    /**
     * The tags to be added to the specified resource. Do not provide system tags.
     */
    Tags?: TagList;
  }
  export interface RegisterAVSDeviceResponse {
    /**
     * The ARN of the device.
     */
    DeviceArn?: Arn;
  }
  export interface RejectSkillRequest {
    /**
     * The unique identifier of the skill.
     */
    SkillId: SkillId;
  }
  export interface RejectSkillResponse {
  }
  export type ReleaseDate = string;
  export interface RequireCheckIn {
    /**
     * Duration between 5 and 20 minutes to determine when to release the room if it's not checked into. 
     */
    ReleaseAfterMinutes?: Minutes;
    /**
     * Whether require check in is enabled or not.
     */
    Enabled?: Boolean;
  }
  export type RequirePin = "YES"|"NO"|"OPTIONAL"|string;
  export interface ResolveRoomRequest {
    /**
     * The ARN of the user. Required.
     */
    UserId: UserId;
    /**
     * The ARN of the skill that was requested. Required.
     */
    SkillId: SkillId;
  }
  export interface ResolveRoomResponse {
    /**
     * The ARN of the room from which the skill request was invoked.
     */
    RoomArn?: Arn;
    /**
     * The name of the room from which the skill request was invoked.
     */
    RoomName?: RoomName;
    /**
     * Response to get the room profile request. Required.
     */
    RoomSkillParameters?: RoomSkillParameters;
  }
  export type ReviewKey = string;
  export type ReviewValue = string;
  export type Reviews = {[key: string]: ReviewValue};
  export interface RevokeInvitationRequest {
    /**
     * The ARN of the user for whom to revoke an enrollment invitation. Required.
     */
    UserArn?: Arn;
    /**
     * The ARN of the enrollment invitation to revoke. Required.
     */
    EnrollmentId?: EnrollmentId;
  }
  export interface RevokeInvitationResponse {
  }
  export interface Room {
    /**
     * The ARN of a room.
     */
    RoomArn?: Arn;
    /**
     * The name of a room.
     */
    RoomName?: RoomName;
    /**
     * The description of a room.
     */
    Description?: RoomDescription;
    /**
     * The provider calendar ARN of a room.
     */
    ProviderCalendarId?: ProviderCalendarId;
    /**
     * The profile ARN of a room.
     */
    ProfileArn?: Arn;
  }
  export interface RoomData {
    /**
     * The ARN of a room.
     */
    RoomArn?: Arn;
    /**
     * The name of a room.
     */
    RoomName?: RoomName;
    /**
     * The description of a room.
     */
    Description?: RoomDescription;
    /**
     * The provider calendar ARN of a room.
     */
    ProviderCalendarId?: ProviderCalendarId;
    /**
     * The profile ARN of a room.
     */
    ProfileArn?: Arn;
    /**
     * The profile name of a room.
     */
    ProfileName?: ProfileName;
  }
  export type RoomDataList = RoomData[];
  export type RoomDescription = string;
  export type RoomName = string;
  export interface RoomSkillParameter {
    /**
     * The parameter key of a room skill parameter. ParameterKey is an enumerated type that only takes “DEFAULT” or “SCOPE” as valid values.
     */
    ParameterKey: RoomSkillParameterKey;
    /**
     * The parameter value of a room skill parameter.
     */
    ParameterValue: RoomSkillParameterValue;
  }
  export type RoomSkillParameterKey = string;
  export type RoomSkillParameterValue = string;
  export type RoomSkillParameters = RoomSkillParameter[];
  export type S3KeyPrefix = string;
  export type SampleUtterances = Utterance[];
  export interface SearchAddressBooksRequest {
    /**
     * The filters to use to list a specified set of address books. The supported filter key is AddressBookName.
     */
    Filters?: FilterList;
    /**
     * The sort order to use in listing the specified set of address books. The supported sort key is AddressBookName.
     */
    SortCriteria?: SortList;
    /**
     * An optional token returned from a prior request. Use this token for pagination of results from this action. If this parameter is specified, the response only includes results beyond the token, up to the value specified by MaxResults.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: MaxResults;
  }
  export interface SearchAddressBooksResponse {
    /**
     * The address books that meet the specified set of filter criteria, in sort order.
     */
    AddressBooks?: AddressBookDataList;
    /**
     * The token returned to indicate that there is more data available.
     */
    NextToken?: NextToken;
    /**
     * The total number of address books returned.
     */
    TotalCount?: TotalCount;
  }
  export interface SearchContactsRequest {
    /**
     * The filters to use to list a specified set of address books. The supported filter keys are DisplayName, FirstName, LastName, and AddressBookArns.
     */
    Filters?: FilterList;
    /**
     * The sort order to use in listing the specified set of contacts. The supported sort keys are DisplayName, FirstName, and LastName.
     */
    SortCriteria?: SortList;
    /**
     * An optional token returned from a prior request. Use this token for pagination of results from this action. If this parameter is specified, the response only includes results beyond the token, up to the value specified by MaxResults.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: MaxResults;
  }
  export interface SearchContactsResponse {
    /**
     * The contacts that meet the specified set of filter criteria, in sort order.
     */
    Contacts?: ContactDataList;
    /**
     * The token returned to indicate that there is more data available.
     */
    NextToken?: NextToken;
    /**
     * The total number of contacts returned.
     */
    TotalCount?: TotalCount;
  }
  export interface SearchDevicesRequest {
    /**
     * An optional token returned from a prior request. Use this token for pagination of results from this action. If this parameter is specified, the response includes only results beyond the token, up to the value specified by MaxResults.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: MaxResults;
    /**
     * The filters to use to list a specified set of devices. Supported filter keys are DeviceName, DeviceStatus, DeviceStatusDetailCode, RoomName, DeviceType, DeviceSerialNumber, UnassociatedOnly, ConnectionStatus (ONLINE and OFFLINE), NetworkProfileName, NetworkProfileArn, Feature, and FailureCode.
     */
    Filters?: FilterList;
    /**
     * The sort order to use in listing the specified set of devices. Supported sort keys are DeviceName, DeviceStatus, RoomName, DeviceType, DeviceSerialNumber, ConnectionStatus, NetworkProfileName, NetworkProfileArn, Feature, and FailureCode.
     */
    SortCriteria?: SortList;
  }
  export interface SearchDevicesResponse {
    /**
     * The devices that meet the specified set of filter criteria, in sort order.
     */
    Devices?: DeviceDataList;
    /**
     * The token returned to indicate that there is more data available.
     */
    NextToken?: NextToken;
    /**
     * The total number of devices returned.
     */
    TotalCount?: TotalCount;
  }
  export interface SearchNetworkProfilesRequest {
    /**
     * An optional token returned from a prior request. Use this token for pagination of results from this action. If this parameter is specified, the response includes only results beyond the token, up to the value specified by MaxResults. 
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved. 
     */
    MaxResults?: MaxResults;
    /**
     * The filters to use to list a specified set of network profiles. Valid filters are NetworkProfileName, Ssid, and SecurityType.
     */
    Filters?: FilterList;
    /**
     * The sort order to use to list the specified set of network profiles. Valid sort criteria includes NetworkProfileName, Ssid, and SecurityType.
     */
    SortCriteria?: SortList;
  }
  export interface SearchNetworkProfilesResponse {
    /**
     * The network profiles that meet the specified set of filter criteria, in sort order. It is a list of NetworkProfileData objects. 
     */
    NetworkProfiles?: NetworkProfileDataList;
    /**
     * An optional token returned from a prior request. Use this token for pagination of results from this action. If this parameter is specified, the response includes only results beyond the token, up to the value specified by MaxResults.
     */
    NextToken?: NextToken;
    /**
     * The total number of network profiles returned.
     */
    TotalCount?: TotalCount;
  }
  export interface SearchProfilesRequest {
    /**
     * An optional token returned from a prior request. Use this token for pagination of results from this action. If this parameter is specified, the response includes only results beyond the token, up to the value specified by MaxResults.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    MaxResults?: MaxResults;
    /**
     * The filters to use to list a specified set of room profiles. Supported filter keys are ProfileName and Address. Required. 
     */
    Filters?: FilterList;
    /**
     * The sort order to use in listing the specified set of room profiles. Supported sort keys are ProfileName and Address.
     */
    SortCriteria?: SortList;
  }
  export interface SearchProfilesResponse {
    /**
     * The profiles that meet the specified set of filter criteria, in sort order.
     */
    Profiles?: ProfileDataList;
    /**
     * The token returned to indicate that there is more data available.
     */
    NextToken?: NextToken;
    /**
     * The total number of room profiles returned.
     */
    TotalCount?: TotalCount;
  }
  export interface SearchRoomsRequest {
    /**
     * An optional token returned from a prior request. Use this token for pagination of results from this action. If this parameter is specified, the response includes only results beyond the token, up to the value specified by MaxResults.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved. 
     */
    MaxResults?: MaxResults;
    /**
     * The filters to use to list a specified set of rooms. The supported filter keys are RoomName and ProfileName.
     */
    Filters?: FilterList;
    /**
     * The sort order to use in listing the specified set of rooms. The supported sort keys are RoomName and ProfileName.
     */
    SortCriteria?: SortList;
  }
  export interface SearchRoomsResponse {
    /**
     * The rooms that meet the specified set of filter criteria, in sort order.
     */
    Rooms?: RoomDataList;
    /**
     * The token returned to indicate that there is more data available.
     */
    NextToken?: NextToken;
    /**
     * The total number of rooms returned.
     */
    TotalCount?: TotalCount;
  }
  export interface SearchSkillGroupsRequest {
    /**
     * An optional token returned from a prior request. Use this token for pagination of results from this action. If this parameter is specified, the response includes only results beyond the token, up to the value specified by MaxResults. Required.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved. 
     */
    MaxResults?: MaxResults;
    /**
     * The filters to use to list a specified set of skill groups. The supported filter key is SkillGroupName. 
     */
    Filters?: FilterList;
    /**
     * The sort order to use in listing the specified set of skill groups. The supported sort key is SkillGroupName. 
     */
    SortCriteria?: SortList;
  }
  export interface SearchSkillGroupsResponse {
    /**
     * The skill groups that meet the filter criteria, in sort order.
     */
    SkillGroups?: SkillGroupDataList;
    /**
     * The token returned to indicate that there is more data available.
     */
    NextToken?: NextToken;
    /**
     * The total number of skill groups returned.
     */
    TotalCount?: TotalCount;
  }
  export interface SearchUsersRequest {
    /**
     * An optional token returned from a prior request. Use this token for pagination of results from this action. If this parameter is specified, the response includes only results beyond the token, up to the value specified by MaxResults. Required.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved. Required.
     */
    MaxResults?: MaxResults;
    /**
     * The filters to use for listing a specific set of users. Required. Supported filter keys are UserId, FirstName, LastName, Email, and EnrollmentStatus.
     */
    Filters?: FilterList;
    /**
     * The sort order to use in listing the filtered set of users. Required. Supported sort keys are UserId, FirstName, LastName, Email, and EnrollmentStatus.
     */
    SortCriteria?: SortList;
  }
  export interface SearchUsersResponse {
    /**
     * The users that meet the specified set of filter criteria, in sort order.
     */
    Users?: UserDataList;
    /**
     * The token returned to indicate that there is more data available.
     */
    NextToken?: NextToken;
    /**
     * The total number of users returned.
     */
    TotalCount?: TotalCount;
  }
  export interface SendAnnouncementRequest {
    /**
     * The filters to use to send an announcement to a specified list of rooms. The supported filter keys are RoomName, ProfileName, RoomArn, and ProfileArn. To send to all rooms, specify an empty RoomFilters list.
     */
    RoomFilters: FilterList;
    /**
     * The announcement content. This can contain only one of the three possible announcement types (text, SSML or audio).
     */
    Content: Content;
    /**
     * The time to live for an announcement. Default is 300. If delivery doesn't occur within this time, the announcement is not delivered.
     */
    TimeToLiveInSeconds?: TimeToLiveInSeconds;
    /**
     * The unique, user-specified identifier for the request that ensures idempotency.
     */
    ClientRequestToken: ClientRequestToken;
  }
  export interface SendAnnouncementResponse {
    /**
     * The identifier of the announcement.
     */
    AnnouncementArn?: Arn;
  }
  export interface SendInvitationRequest {
    /**
     * The ARN of the user to whom to send an invitation. Required.
     */
    UserArn?: Arn;
  }
  export interface SendInvitationResponse {
  }
  export type ShortDescription = string;
  export type ShortSkillIdList = SkillId[];
  export interface SipAddress {
    /**
     * The URI for the SIP address.
     */
    Uri: SipUri;
    /**
     * The type of the SIP address.
     */
    Type: SipType;
  }
  export type SipAddressList = SipAddress[];
  export type SipType = "WORK"|string;
  export type SipUri = string;
  export interface SkillDetails {
    /**
     * The description of the product.
     */
    ProductDescription?: ProductDescription;
    /**
     * The phrase used to trigger the skill.
     */
    InvocationPhrase?: InvocationPhrase;
    /**
     * The date when the skill was released.
     */
    ReleaseDate?: ReleaseDate;
    /**
     * The URL of the end user license agreement.
     */
    EndUserLicenseAgreement?: EndUserLicenseAgreement;
    /**
     * The generic keywords associated with the skill that can be used to find a skill.
     */
    GenericKeywords?: GenericKeywords;
    /**
     * The details about what the skill supports organized as bullet points.
     */
    BulletPoints?: BulletPoints;
    /**
     * The updates added in bullet points.
     */
    NewInThisVersionBulletPoints?: NewInThisVersionBulletPoints;
    /**
     * The types of skills.
     */
    SkillTypes?: SkillTypes;
    /**
     *  This member has been deprecated.  The list of reviews for the skill, including Key and Value pair.
     */
    Reviews?: Reviews;
    /**
     * The details about the developer that published the skill.
     */
    DeveloperInfo?: DeveloperInfo;
  }
  export interface SkillGroup {
    /**
     * The ARN of a skill group.
     */
    SkillGroupArn?: Arn;
    /**
     * The name of a skill group.
     */
    SkillGroupName?: SkillGroupName;
    /**
     * The description of a skill group.
     */
    Description?: SkillGroupDescription;
  }
  export interface SkillGroupData {
    /**
     * The skill group ARN of a skill group.
     */
    SkillGroupArn?: Arn;
    /**
     * The skill group name of a skill group.
     */
    SkillGroupName?: SkillGroupName;
    /**
     * The description of a skill group.
     */
    Description?: SkillGroupDescription;
  }
  export type SkillGroupDataList = SkillGroupData[];
  export type SkillGroupDescription = string;
  export type SkillGroupName = string;
  export type SkillId = string;
  export type SkillListMaxResults = number;
  export type SkillName = string;
  export type SkillStoreType = string;
  export interface SkillSummary {
    /**
     * The ARN of the skill summary.
     */
    SkillId?: SkillId;
    /**
     * The name of the skill.
     */
    SkillName?: SkillName;
    /**
     * Linking support for a skill.
     */
    SupportsLinking?: boolean;
    /**
     * Whether the skill is enabled under the user's account, or if it requires linking to be used.
     */
    EnablementType?: EnablementType;
    /**
     * Whether the skill is publicly available or is a private skill.
     */
    SkillType?: SkillType;
  }
  export type SkillSummaryList = SkillSummary[];
  export type SkillType = "PUBLIC"|"PRIVATE"|string;
  export type SkillTypeFilter = "PUBLIC"|"PRIVATE"|"ALL"|string;
  export type SkillTypes = SkillStoreType[];
  export interface SkillsStoreSkill {
    /**
     * The ARN of the skill.
     */
    SkillId?: SkillId;
    /**
     * The name of the skill.
     */
    SkillName?: SkillName;
    /**
     * Short description about the skill.
     */
    ShortDescription?: ShortDescription;
    /**
     * The URL where the skill icon resides.
     */
    IconUrl?: IconUrl;
    /**
     * Sample utterances that interact with the skill.
     */
    SampleUtterances?: SampleUtterances;
    /**
     * Information about the skill.
     */
    SkillDetails?: SkillDetails;
    /**
     * Linking support for a skill.
     */
    SupportsLinking?: boolean;
  }
  export type SkillsStoreSkillList = SkillsStoreSkill[];
  export interface SmartHomeAppliance {
    /**
     * The friendly name of the smart home appliance.
     */
    FriendlyName?: ApplianceFriendlyName;
    /**
     * The description of the smart home appliance.
     */
    Description?: ApplianceDescription;
    /**
     * The name of the manufacturer of the smart home appliance.
     */
    ManufacturerName?: ApplianceManufacturerName;
  }
  export type SmartHomeApplianceList = SmartHomeAppliance[];
  export type SoftwareVersion = string;
  export interface Sort {
    /**
     * The sort key of a sort object.
     */
    Key: SortKey;
    /**
     * The sort value of a sort object.
     */
    Value: SortValue;
  }
  export type SortKey = string;
  export type SortList = Sort[];
  export type SortValue = "ASC"|"DESC"|string;
  export interface Ssml {
    /**
     * The locale of the SSML message. Currently, en-US is supported.
     */
    Locale: Locale;
    /**
     * The value of the SSML message in the correct SSML format. The audio tag is not supported.
     */
    Value: SsmlValue;
  }
  export type SsmlList = Ssml[];
  export type SsmlValue = string;
  export interface StartDeviceSyncRequest {
    /**
     * The ARN of the room with which the device to sync is associated. Required.
     */
    RoomArn?: Arn;
    /**
     * The ARN of the device to sync. Required.
     */
    DeviceArn?: Arn;
    /**
     * Request structure to start the device sync. Required.
     */
    Features: Features;
  }
  export interface StartDeviceSyncResponse {
  }
  export interface StartSmartHomeApplianceDiscoveryRequest {
    /**
     * The room where smart home appliance discovery was initiated.
     */
    RoomArn: Arn;
  }
  export interface StartSmartHomeApplianceDiscoveryResponse {
  }
  export interface Tag {
    /**
     * The key of a tag. Tag keys are case-sensitive. 
     */
    Key: TagKey;
    /**
     * The value of a tag. Tag values are case sensitive and can be null.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The ARN of the resource to which to add metadata tags. Required. 
     */
    Arn: Arn;
    /**
     * The tags to be added to the specified resource. Do not provide system tags. Required. 
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TemperatureUnit = "FAHRENHEIT"|"CELSIUS"|string;
  export interface Text {
    /**
     * The locale of the text message. Currently, en-US is supported.
     */
    Locale: Locale;
    /**
     * The value of the text message.
     */
    Value: TextValue;
  }
  export type TextList = Text[];
  export type TextValue = string;
  export type TimeToLiveInSeconds = number;
  export type Timezone = string;
  export type TotalCount = number;
  export type TrustAnchor = string;
  export type TrustAnchorList = TrustAnchor[];
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource from which to remove metadata tags. Required. 
     */
    Arn: Arn;
    /**
     * The tags to be removed from the specified resource. Do not provide system tags. Required. 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAddressBookRequest {
    /**
     * The ARN of the room to update.
     */
    AddressBookArn: Arn;
    /**
     * The updated name of the room.
     */
    Name?: AddressBookName;
    /**
     * The updated description of the room.
     */
    Description?: AddressBookDescription;
  }
  export interface UpdateAddressBookResponse {
  }
  export interface UpdateBusinessReportScheduleRequest {
    /**
     * The ARN of the business report schedule.
     */
    ScheduleArn: Arn;
    /**
     * The S3 location of the output reports.
     */
    S3BucketName?: CustomerS3BucketName;
    /**
     * The S3 key where the report is delivered.
     */
    S3KeyPrefix?: S3KeyPrefix;
    /**
     * The format of the generated report (individual CSV files or zipped files of individual files).
     */
    Format?: BusinessReportFormat;
    /**
     * The name identifier of the schedule.
     */
    ScheduleName?: BusinessReportScheduleName;
    /**
     * The recurrence of the reports.
     */
    Recurrence?: BusinessReportRecurrence;
  }
  export interface UpdateBusinessReportScheduleResponse {
  }
  export interface UpdateConferenceProviderRequest {
    /**
     * The ARN of the conference provider.
     */
    ConferenceProviderArn: Arn;
    /**
     * The type of the conference provider.
     */
    ConferenceProviderType: ConferenceProviderType;
    /**
     * The IP endpoint and protocol for calling.
     */
    IPDialIn?: IPDialIn;
    /**
     * The information for PSTN conferencing.
     */
    PSTNDialIn?: PSTNDialIn;
    /**
     * The meeting settings for the conference provider.
     */
    MeetingSetting: MeetingSetting;
  }
  export interface UpdateConferenceProviderResponse {
  }
  export interface UpdateContactRequest {
    /**
     * The ARN of the contact to update.
     */
    ContactArn: Arn;
    /**
     * The updated display name of the contact.
     */
    DisplayName?: ContactName;
    /**
     * The updated first name of the contact.
     */
    FirstName?: ContactName;
    /**
     * The updated last name of the contact.
     */
    LastName?: ContactName;
    /**
     * The updated phone number of the contact. The phone number type defaults to WORK. You can either specify PhoneNumber or PhoneNumbers. We recommend that you use PhoneNumbers, which lets you specify the phone number type and multiple numbers.
     */
    PhoneNumber?: RawPhoneNumber;
    /**
     * The list of phone numbers for the contact.
     */
    PhoneNumbers?: PhoneNumberList;
    /**
     * The list of SIP addresses for the contact.
     */
    SipAddresses?: SipAddressList;
  }
  export interface UpdateContactResponse {
  }
  export interface UpdateDeviceRequest {
    /**
     * The ARN of the device to update. Required.
     */
    DeviceArn?: Arn;
    /**
     * The updated device name. Required.
     */
    DeviceName?: DeviceName;
  }
  export interface UpdateDeviceResponse {
  }
  export interface UpdateEndOfMeetingReminder {
    /**
     * Updates settings for the end of meeting reminder feature that are applied to a room profile. The end of meeting reminder enables Alexa to remind users when a meeting is ending. 
     */
    ReminderAtMinutes?: EndOfMeetingReminderMinutesList;
    /**
     * The type of sound that users hear during the end of meeting reminder. 
     */
    ReminderType?: EndOfMeetingReminderType;
    /**
     * Whether an end of meeting reminder is enabled or not.
     */
    Enabled?: Boolean;
  }
  export interface UpdateGatewayGroupRequest {
    /**
     * The ARN of the gateway group to update.
     */
    GatewayGroupArn: Arn;
    /**
     * The updated name of the gateway group.
     */
    Name?: GatewayGroupName;
    /**
     * The updated description of the gateway group.
     */
    Description?: GatewayGroupDescription;
  }
  export interface UpdateGatewayGroupResponse {
  }
  export interface UpdateGatewayRequest {
    /**
     * The ARN of the gateway to update.
     */
    GatewayArn: Arn;
    /**
     * The updated name of the gateway.
     */
    Name?: GatewayName;
    /**
     * The updated description of the gateway.
     */
    Description?: GatewayDescription;
    /**
     * The updated software version of the gateway. The gateway automatically updates its software version during normal operation.
     */
    SoftwareVersion?: GatewayVersion;
  }
  export interface UpdateGatewayResponse {
  }
  export interface UpdateInstantBooking {
    /**
     * Duration between 15 and 240 minutes at increments of 15 that determines how long to book an available room when a meeting is started with Alexa.
     */
    DurationInMinutes?: Minutes;
    /**
     * Whether instant booking is enabled or not.
     */
    Enabled?: Boolean;
  }
  export interface UpdateMeetingRoomConfiguration {
    /**
     * Whether room utilization metrics are enabled or not.
     */
    RoomUtilizationMetricsEnabled?: Boolean;
    /**
     * Settings for the end of meeting reminder feature that are applied to a room profile. The end of meeting reminder enables Alexa to remind users when a meeting is ending. 
     */
    EndOfMeetingReminder?: UpdateEndOfMeetingReminder;
    /**
     * Settings to automatically book an available room available for a configured duration when joining a meeting with Alexa.
     */
    InstantBooking?: UpdateInstantBooking;
    /**
     * Settings for requiring a check in when a room is reserved. Alexa can cancel a room reservation if it's not checked into to make the room available for others. Users can check in by joining the meeting with Alexa or an AVS device, or by saying “Alexa, check in.” 
     */
    RequireCheckIn?: UpdateRequireCheckIn;
  }
  export interface UpdateNetworkProfileRequest {
    /**
     * The ARN of the network profile associated with a device.
     */
    NetworkProfileArn: Arn;
    /**
     * The name of the network profile associated with a device.
     */
    NetworkProfileName?: NetworkProfileName;
    /**
     * Detailed information about a device's network profile.
     */
    Description?: NetworkProfileDescription;
    /**
     * The current password of the Wi-Fi network.
     */
    CurrentPassword?: CurrentWiFiPassword;
    /**
     * The next, or subsequent, password of the Wi-Fi network. This password is asynchronously transmitted to the device and is used when the password of the network changes to NextPassword. 
     */
    NextPassword?: NextWiFiPassword;
    /**
     * The ARN of the Private Certificate Authority (PCA) created in AWS Certificate Manager (ACM). This is used to issue certificates to the devices. 
     */
    CertificateAuthorityArn?: Arn;
    /**
     * The root certificate(s) of your authentication server that will be installed on your devices and used to trust your authentication server during EAP negotiation. 
     */
    TrustAnchors?: TrustAnchorList;
  }
  export interface UpdateNetworkProfileResponse {
  }
  export interface UpdateProfileRequest {
    /**
     * The ARN of the room profile to update. Required.
     */
    ProfileArn?: Arn;
    /**
     * The updated name for the room profile.
     */
    ProfileName?: ProfileName;
    /**
     * Sets the profile as default if selected. If this is missing, no update is done to the default status.
     */
    IsDefault?: Boolean;
    /**
     * The updated timezone for the room profile.
     */
    Timezone?: Timezone;
    /**
     * The updated address for the room profile.
     */
    Address?: Address;
    /**
     * The updated distance unit for the room profile.
     */
    DistanceUnit?: DistanceUnit;
    /**
     * The updated temperature unit for the room profile.
     */
    TemperatureUnit?: TemperatureUnit;
    /**
     * The updated wake word for the room profile.
     */
    WakeWord?: WakeWord;
    /**
     * The updated locale for the room profile. (This is currently only available to a limited preview audience.)
     */
    Locale?: DeviceLocale;
    /**
     * Whether the setup mode of the profile is enabled.
     */
    SetupModeDisabled?: Boolean;
    /**
     * The updated maximum volume limit for the room profile.
     */
    MaxVolumeLimit?: MaxVolumeLimit;
    /**
     * Whether the PSTN setting of the room profile is enabled.
     */
    PSTNEnabled?: Boolean;
    /**
     * Whether data retention of the profile is enabled.
     */
    DataRetentionOptIn?: Boolean;
    /**
     * The updated meeting room settings of a room profile.
     */
    MeetingRoomConfiguration?: UpdateMeetingRoomConfiguration;
  }
  export interface UpdateProfileResponse {
  }
  export interface UpdateRequireCheckIn {
    /**
     * Duration between 5 and 20 minutes to determine when to release the room if it's not checked into. 
     */
    ReleaseAfterMinutes?: Minutes;
    /**
     * Whether require check in is enabled or not.
     */
    Enabled?: Boolean;
  }
  export interface UpdateRoomRequest {
    /**
     * The ARN of the room to update. 
     */
    RoomArn?: Arn;
    /**
     * The updated name for the room.
     */
    RoomName?: RoomName;
    /**
     * The updated description for the room.
     */
    Description?: RoomDescription;
    /**
     * The updated provider calendar ARN for the room.
     */
    ProviderCalendarId?: ProviderCalendarId;
    /**
     * The updated profile ARN for the room.
     */
    ProfileArn?: Arn;
  }
  export interface UpdateRoomResponse {
  }
  export interface UpdateSkillGroupRequest {
    /**
     * The ARN of the skill group to update. 
     */
    SkillGroupArn?: Arn;
    /**
     * The updated name for the skill group.
     */
    SkillGroupName?: SkillGroupName;
    /**
     * The updated description for the skill group.
     */
    Description?: SkillGroupDescription;
  }
  export interface UpdateSkillGroupResponse {
  }
  export type Url = string;
  export type UserCode = string;
  export interface UserData {
    /**
     * The ARN of a user.
     */
    UserArn?: Arn;
    /**
     * The first name of a user.
     */
    FirstName?: user_FirstName;
    /**
     * The last name of a user.
     */
    LastName?: user_LastName;
    /**
     * The email of a user.
     */
    Email?: Email;
    /**
     * The enrollment status of a user.
     */
    EnrollmentStatus?: EnrollmentStatus;
    /**
     * The enrollment ARN of a user.
     */
    EnrollmentId?: EnrollmentId;
  }
  export type UserDataList = UserData[];
  export type UserId = string;
  export type Utterance = string;
  export type Value = string;
  export type WakeWord = "ALEXA"|"AMAZON"|"ECHO"|"COMPUTER"|string;
  export type user_FirstName = string;
  export type user_LastName = string;
  export type user_UserId = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-11-09"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the AlexaForBusiness client.
   */
  export import Types = AlexaForBusiness;
}
export = AlexaForBusiness;
