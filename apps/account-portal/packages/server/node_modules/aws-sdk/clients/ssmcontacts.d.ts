import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SSMContacts extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SSMContacts.Types.ClientConfiguration)
  config: Config & SSMContacts.Types.ClientConfiguration;
  /**
   * Used to acknowledge an engagement to a contact channel during an incident.
   */
  acceptPage(params: SSMContacts.Types.AcceptPageRequest, callback?: (err: AWSError, data: SSMContacts.Types.AcceptPageResult) => void): Request<SSMContacts.Types.AcceptPageResult, AWSError>;
  /**
   * Used to acknowledge an engagement to a contact channel during an incident.
   */
  acceptPage(callback?: (err: AWSError, data: SSMContacts.Types.AcceptPageResult) => void): Request<SSMContacts.Types.AcceptPageResult, AWSError>;
  /**
   * Activates a contact's contact channel. Incident Manager can't engage a contact until the contact channel has been activated.
   */
  activateContactChannel(params: SSMContacts.Types.ActivateContactChannelRequest, callback?: (err: AWSError, data: SSMContacts.Types.ActivateContactChannelResult) => void): Request<SSMContacts.Types.ActivateContactChannelResult, AWSError>;
  /**
   * Activates a contact's contact channel. Incident Manager can't engage a contact until the contact channel has been activated.
   */
  activateContactChannel(callback?: (err: AWSError, data: SSMContacts.Types.ActivateContactChannelResult) => void): Request<SSMContacts.Types.ActivateContactChannelResult, AWSError>;
  /**
   * Contacts are either the contacts that Incident Manager engages during an incident or the escalation plans that Incident Manager uses to engage contacts in phases during an incident.
   */
  createContact(params: SSMContacts.Types.CreateContactRequest, callback?: (err: AWSError, data: SSMContacts.Types.CreateContactResult) => void): Request<SSMContacts.Types.CreateContactResult, AWSError>;
  /**
   * Contacts are either the contacts that Incident Manager engages during an incident or the escalation plans that Incident Manager uses to engage contacts in phases during an incident.
   */
  createContact(callback?: (err: AWSError, data: SSMContacts.Types.CreateContactResult) => void): Request<SSMContacts.Types.CreateContactResult, AWSError>;
  /**
   * A contact channel is the method that Incident Manager uses to engage your contact.
   */
  createContactChannel(params: SSMContacts.Types.CreateContactChannelRequest, callback?: (err: AWSError, data: SSMContacts.Types.CreateContactChannelResult) => void): Request<SSMContacts.Types.CreateContactChannelResult, AWSError>;
  /**
   * A contact channel is the method that Incident Manager uses to engage your contact.
   */
  createContactChannel(callback?: (err: AWSError, data: SSMContacts.Types.CreateContactChannelResult) => void): Request<SSMContacts.Types.CreateContactChannelResult, AWSError>;
  /**
   * Creates a rotation in an on-call schedule.
   */
  createRotation(params: SSMContacts.Types.CreateRotationRequest, callback?: (err: AWSError, data: SSMContacts.Types.CreateRotationResult) => void): Request<SSMContacts.Types.CreateRotationResult, AWSError>;
  /**
   * Creates a rotation in an on-call schedule.
   */
  createRotation(callback?: (err: AWSError, data: SSMContacts.Types.CreateRotationResult) => void): Request<SSMContacts.Types.CreateRotationResult, AWSError>;
  /**
   * Creates an override for a rotation in an on-call schedule.
   */
  createRotationOverride(params: SSMContacts.Types.CreateRotationOverrideRequest, callback?: (err: AWSError, data: SSMContacts.Types.CreateRotationOverrideResult) => void): Request<SSMContacts.Types.CreateRotationOverrideResult, AWSError>;
  /**
   * Creates an override for a rotation in an on-call schedule.
   */
  createRotationOverride(callback?: (err: AWSError, data: SSMContacts.Types.CreateRotationOverrideResult) => void): Request<SSMContacts.Types.CreateRotationOverrideResult, AWSError>;
  /**
   * To no longer receive Incident Manager engagements to a contact channel, you can deactivate the channel.
   */
  deactivateContactChannel(params: SSMContacts.Types.DeactivateContactChannelRequest, callback?: (err: AWSError, data: SSMContacts.Types.DeactivateContactChannelResult) => void): Request<SSMContacts.Types.DeactivateContactChannelResult, AWSError>;
  /**
   * To no longer receive Incident Manager engagements to a contact channel, you can deactivate the channel.
   */
  deactivateContactChannel(callback?: (err: AWSError, data: SSMContacts.Types.DeactivateContactChannelResult) => void): Request<SSMContacts.Types.DeactivateContactChannelResult, AWSError>;
  /**
   * To remove a contact from Incident Manager, you can delete the contact. Deleting a contact removes them from all escalation plans and related response plans. Deleting an escalation plan removes it from all related response plans. You will have to recreate the contact and its contact channels before you can use it again.
   */
  deleteContact(params: SSMContacts.Types.DeleteContactRequest, callback?: (err: AWSError, data: SSMContacts.Types.DeleteContactResult) => void): Request<SSMContacts.Types.DeleteContactResult, AWSError>;
  /**
   * To remove a contact from Incident Manager, you can delete the contact. Deleting a contact removes them from all escalation plans and related response plans. Deleting an escalation plan removes it from all related response plans. You will have to recreate the contact and its contact channels before you can use it again.
   */
  deleteContact(callback?: (err: AWSError, data: SSMContacts.Types.DeleteContactResult) => void): Request<SSMContacts.Types.DeleteContactResult, AWSError>;
  /**
   * To no longer receive engagements on a contact channel, you can delete the channel from a contact. Deleting the contact channel removes it from the contact's engagement plan. If you delete the only contact channel for a contact, you won't be able to engage that contact during an incident.
   */
  deleteContactChannel(params: SSMContacts.Types.DeleteContactChannelRequest, callback?: (err: AWSError, data: SSMContacts.Types.DeleteContactChannelResult) => void): Request<SSMContacts.Types.DeleteContactChannelResult, AWSError>;
  /**
   * To no longer receive engagements on a contact channel, you can delete the channel from a contact. Deleting the contact channel removes it from the contact's engagement plan. If you delete the only contact channel for a contact, you won't be able to engage that contact during an incident.
   */
  deleteContactChannel(callback?: (err: AWSError, data: SSMContacts.Types.DeleteContactChannelResult) => void): Request<SSMContacts.Types.DeleteContactChannelResult, AWSError>;
  /**
   * Deletes a rotation from the system. If a rotation belongs to more than one on-call schedule, this operation deletes it from all of them.
   */
  deleteRotation(params: SSMContacts.Types.DeleteRotationRequest, callback?: (err: AWSError, data: SSMContacts.Types.DeleteRotationResult) => void): Request<SSMContacts.Types.DeleteRotationResult, AWSError>;
  /**
   * Deletes a rotation from the system. If a rotation belongs to more than one on-call schedule, this operation deletes it from all of them.
   */
  deleteRotation(callback?: (err: AWSError, data: SSMContacts.Types.DeleteRotationResult) => void): Request<SSMContacts.Types.DeleteRotationResult, AWSError>;
  /**
   * Deletes an existing override for an on-call rotation.
   */
  deleteRotationOverride(params: SSMContacts.Types.DeleteRotationOverrideRequest, callback?: (err: AWSError, data: SSMContacts.Types.DeleteRotationOverrideResult) => void): Request<SSMContacts.Types.DeleteRotationOverrideResult, AWSError>;
  /**
   * Deletes an existing override for an on-call rotation.
   */
  deleteRotationOverride(callback?: (err: AWSError, data: SSMContacts.Types.DeleteRotationOverrideResult) => void): Request<SSMContacts.Types.DeleteRotationOverrideResult, AWSError>;
  /**
   * Incident Manager uses engagements to engage contacts and escalation plans during an incident. Use this command to describe the engagement that occurred during an incident.
   */
  describeEngagement(params: SSMContacts.Types.DescribeEngagementRequest, callback?: (err: AWSError, data: SSMContacts.Types.DescribeEngagementResult) => void): Request<SSMContacts.Types.DescribeEngagementResult, AWSError>;
  /**
   * Incident Manager uses engagements to engage contacts and escalation plans during an incident. Use this command to describe the engagement that occurred during an incident.
   */
  describeEngagement(callback?: (err: AWSError, data: SSMContacts.Types.DescribeEngagementResult) => void): Request<SSMContacts.Types.DescribeEngagementResult, AWSError>;
  /**
   * Lists details of the engagement to a contact channel.
   */
  describePage(params: SSMContacts.Types.DescribePageRequest, callback?: (err: AWSError, data: SSMContacts.Types.DescribePageResult) => void): Request<SSMContacts.Types.DescribePageResult, AWSError>;
  /**
   * Lists details of the engagement to a contact channel.
   */
  describePage(callback?: (err: AWSError, data: SSMContacts.Types.DescribePageResult) => void): Request<SSMContacts.Types.DescribePageResult, AWSError>;
  /**
   * Retrieves information about the specified contact or escalation plan.
   */
  getContact(params: SSMContacts.Types.GetContactRequest, callback?: (err: AWSError, data: SSMContacts.Types.GetContactResult) => void): Request<SSMContacts.Types.GetContactResult, AWSError>;
  /**
   * Retrieves information about the specified contact or escalation plan.
   */
  getContact(callback?: (err: AWSError, data: SSMContacts.Types.GetContactResult) => void): Request<SSMContacts.Types.GetContactResult, AWSError>;
  /**
   * List details about a specific contact channel.
   */
  getContactChannel(params: SSMContacts.Types.GetContactChannelRequest, callback?: (err: AWSError, data: SSMContacts.Types.GetContactChannelResult) => void): Request<SSMContacts.Types.GetContactChannelResult, AWSError>;
  /**
   * List details about a specific contact channel.
   */
  getContactChannel(callback?: (err: AWSError, data: SSMContacts.Types.GetContactChannelResult) => void): Request<SSMContacts.Types.GetContactChannelResult, AWSError>;
  /**
   * Retrieves the resource policies attached to the specified contact or escalation plan.
   */
  getContactPolicy(params: SSMContacts.Types.GetContactPolicyRequest, callback?: (err: AWSError, data: SSMContacts.Types.GetContactPolicyResult) => void): Request<SSMContacts.Types.GetContactPolicyResult, AWSError>;
  /**
   * Retrieves the resource policies attached to the specified contact or escalation plan.
   */
  getContactPolicy(callback?: (err: AWSError, data: SSMContacts.Types.GetContactPolicyResult) => void): Request<SSMContacts.Types.GetContactPolicyResult, AWSError>;
  /**
   * Retrieves information about an on-call rotation.
   */
  getRotation(params: SSMContacts.Types.GetRotationRequest, callback?: (err: AWSError, data: SSMContacts.Types.GetRotationResult) => void): Request<SSMContacts.Types.GetRotationResult, AWSError>;
  /**
   * Retrieves information about an on-call rotation.
   */
  getRotation(callback?: (err: AWSError, data: SSMContacts.Types.GetRotationResult) => void): Request<SSMContacts.Types.GetRotationResult, AWSError>;
  /**
   * Retrieves information about an override to an on-call rotation.
   */
  getRotationOverride(params: SSMContacts.Types.GetRotationOverrideRequest, callback?: (err: AWSError, data: SSMContacts.Types.GetRotationOverrideResult) => void): Request<SSMContacts.Types.GetRotationOverrideResult, AWSError>;
  /**
   * Retrieves information about an override to an on-call rotation.
   */
  getRotationOverride(callback?: (err: AWSError, data: SSMContacts.Types.GetRotationOverrideResult) => void): Request<SSMContacts.Types.GetRotationOverrideResult, AWSError>;
  /**
   * Lists all contact channels for the specified contact.
   */
  listContactChannels(params: SSMContacts.Types.ListContactChannelsRequest, callback?: (err: AWSError, data: SSMContacts.Types.ListContactChannelsResult) => void): Request<SSMContacts.Types.ListContactChannelsResult, AWSError>;
  /**
   * Lists all contact channels for the specified contact.
   */
  listContactChannels(callback?: (err: AWSError, data: SSMContacts.Types.ListContactChannelsResult) => void): Request<SSMContacts.Types.ListContactChannelsResult, AWSError>;
  /**
   * Lists all contacts and escalation plans in Incident Manager.
   */
  listContacts(params: SSMContacts.Types.ListContactsRequest, callback?: (err: AWSError, data: SSMContacts.Types.ListContactsResult) => void): Request<SSMContacts.Types.ListContactsResult, AWSError>;
  /**
   * Lists all contacts and escalation plans in Incident Manager.
   */
  listContacts(callback?: (err: AWSError, data: SSMContacts.Types.ListContactsResult) => void): Request<SSMContacts.Types.ListContactsResult, AWSError>;
  /**
   * Lists all engagements that have happened in an incident.
   */
  listEngagements(params: SSMContacts.Types.ListEngagementsRequest, callback?: (err: AWSError, data: SSMContacts.Types.ListEngagementsResult) => void): Request<SSMContacts.Types.ListEngagementsResult, AWSError>;
  /**
   * Lists all engagements that have happened in an incident.
   */
  listEngagements(callback?: (err: AWSError, data: SSMContacts.Types.ListEngagementsResult) => void): Request<SSMContacts.Types.ListEngagementsResult, AWSError>;
  /**
   * Lists all of the engagements to contact channels that have been acknowledged.
   */
  listPageReceipts(params: SSMContacts.Types.ListPageReceiptsRequest, callback?: (err: AWSError, data: SSMContacts.Types.ListPageReceiptsResult) => void): Request<SSMContacts.Types.ListPageReceiptsResult, AWSError>;
  /**
   * Lists all of the engagements to contact channels that have been acknowledged.
   */
  listPageReceipts(callback?: (err: AWSError, data: SSMContacts.Types.ListPageReceiptsResult) => void): Request<SSMContacts.Types.ListPageReceiptsResult, AWSError>;
  /**
   * Returns the resolution path of an engagement. For example, the escalation plan engaged in an incident might target an on-call schedule that includes several contacts in a rotation, but just one contact on-call when the incident starts. The resolution path indicates the hierarchy of escalation plan &gt; on-call schedule &gt; contact.
   */
  listPageResolutions(params: SSMContacts.Types.ListPageResolutionsRequest, callback?: (err: AWSError, data: SSMContacts.Types.ListPageResolutionsResult) => void): Request<SSMContacts.Types.ListPageResolutionsResult, AWSError>;
  /**
   * Returns the resolution path of an engagement. For example, the escalation plan engaged in an incident might target an on-call schedule that includes several contacts in a rotation, but just one contact on-call when the incident starts. The resolution path indicates the hierarchy of escalation plan &gt; on-call schedule &gt; contact.
   */
  listPageResolutions(callback?: (err: AWSError, data: SSMContacts.Types.ListPageResolutionsResult) => void): Request<SSMContacts.Types.ListPageResolutionsResult, AWSError>;
  /**
   * Lists the engagements to a contact's contact channels.
   */
  listPagesByContact(params: SSMContacts.Types.ListPagesByContactRequest, callback?: (err: AWSError, data: SSMContacts.Types.ListPagesByContactResult) => void): Request<SSMContacts.Types.ListPagesByContactResult, AWSError>;
  /**
   * Lists the engagements to a contact's contact channels.
   */
  listPagesByContact(callback?: (err: AWSError, data: SSMContacts.Types.ListPagesByContactResult) => void): Request<SSMContacts.Types.ListPagesByContactResult, AWSError>;
  /**
   * Lists the engagements to contact channels that occurred by engaging a contact.
   */
  listPagesByEngagement(params: SSMContacts.Types.ListPagesByEngagementRequest, callback?: (err: AWSError, data: SSMContacts.Types.ListPagesByEngagementResult) => void): Request<SSMContacts.Types.ListPagesByEngagementResult, AWSError>;
  /**
   * Lists the engagements to contact channels that occurred by engaging a contact.
   */
  listPagesByEngagement(callback?: (err: AWSError, data: SSMContacts.Types.ListPagesByEngagementResult) => void): Request<SSMContacts.Types.ListPagesByEngagementResult, AWSError>;
  /**
   * Returns a list of shifts based on rotation configuration parameters.  The Incident Manager primarily uses this operation to populate the Preview calendar. It is not typically run by end users. 
   */
  listPreviewRotationShifts(params: SSMContacts.Types.ListPreviewRotationShiftsRequest, callback?: (err: AWSError, data: SSMContacts.Types.ListPreviewRotationShiftsResult) => void): Request<SSMContacts.Types.ListPreviewRotationShiftsResult, AWSError>;
  /**
   * Returns a list of shifts based on rotation configuration parameters.  The Incident Manager primarily uses this operation to populate the Preview calendar. It is not typically run by end users. 
   */
  listPreviewRotationShifts(callback?: (err: AWSError, data: SSMContacts.Types.ListPreviewRotationShiftsResult) => void): Request<SSMContacts.Types.ListPreviewRotationShiftsResult, AWSError>;
  /**
   * Retrieves a list of overrides currently specified for an on-call rotation.
   */
  listRotationOverrides(params: SSMContacts.Types.ListRotationOverridesRequest, callback?: (err: AWSError, data: SSMContacts.Types.ListRotationOverridesResult) => void): Request<SSMContacts.Types.ListRotationOverridesResult, AWSError>;
  /**
   * Retrieves a list of overrides currently specified for an on-call rotation.
   */
  listRotationOverrides(callback?: (err: AWSError, data: SSMContacts.Types.ListRotationOverridesResult) => void): Request<SSMContacts.Types.ListRotationOverridesResult, AWSError>;
  /**
   * Returns a list of shifts generated by an existing rotation in the system.
   */
  listRotationShifts(params: SSMContacts.Types.ListRotationShiftsRequest, callback?: (err: AWSError, data: SSMContacts.Types.ListRotationShiftsResult) => void): Request<SSMContacts.Types.ListRotationShiftsResult, AWSError>;
  /**
   * Returns a list of shifts generated by an existing rotation in the system.
   */
  listRotationShifts(callback?: (err: AWSError, data: SSMContacts.Types.ListRotationShiftsResult) => void): Request<SSMContacts.Types.ListRotationShiftsResult, AWSError>;
  /**
   * Retrieves a list of on-call rotations.
   */
  listRotations(params: SSMContacts.Types.ListRotationsRequest, callback?: (err: AWSError, data: SSMContacts.Types.ListRotationsResult) => void): Request<SSMContacts.Types.ListRotationsResult, AWSError>;
  /**
   * Retrieves a list of on-call rotations.
   */
  listRotations(callback?: (err: AWSError, data: SSMContacts.Types.ListRotationsResult) => void): Request<SSMContacts.Types.ListRotationsResult, AWSError>;
  /**
   * Lists the tags of an escalation plan or contact.
   */
  listTagsForResource(params: SSMContacts.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: SSMContacts.Types.ListTagsForResourceResult) => void): Request<SSMContacts.Types.ListTagsForResourceResult, AWSError>;
  /**
   * Lists the tags of an escalation plan or contact.
   */
  listTagsForResource(callback?: (err: AWSError, data: SSMContacts.Types.ListTagsForResourceResult) => void): Request<SSMContacts.Types.ListTagsForResourceResult, AWSError>;
  /**
   * Adds a resource policy to the specified contact or escalation plan. The resource policy is used to share the contact or escalation plan using Resource Access Manager (RAM). For more information about cross-account sharing, see Setting up cross-account functionality.
   */
  putContactPolicy(params: SSMContacts.Types.PutContactPolicyRequest, callback?: (err: AWSError, data: SSMContacts.Types.PutContactPolicyResult) => void): Request<SSMContacts.Types.PutContactPolicyResult, AWSError>;
  /**
   * Adds a resource policy to the specified contact or escalation plan. The resource policy is used to share the contact or escalation plan using Resource Access Manager (RAM). For more information about cross-account sharing, see Setting up cross-account functionality.
   */
  putContactPolicy(callback?: (err: AWSError, data: SSMContacts.Types.PutContactPolicyResult) => void): Request<SSMContacts.Types.PutContactPolicyResult, AWSError>;
  /**
   * Sends an activation code to a contact channel. The contact can use this code to activate the contact channel in the console or with the ActivateChannel operation. Incident Manager can't engage a contact channel until it has been activated.
   */
  sendActivationCode(params: SSMContacts.Types.SendActivationCodeRequest, callback?: (err: AWSError, data: SSMContacts.Types.SendActivationCodeResult) => void): Request<SSMContacts.Types.SendActivationCodeResult, AWSError>;
  /**
   * Sends an activation code to a contact channel. The contact can use this code to activate the contact channel in the console or with the ActivateChannel operation. Incident Manager can't engage a contact channel until it has been activated.
   */
  sendActivationCode(callback?: (err: AWSError, data: SSMContacts.Types.SendActivationCodeResult) => void): Request<SSMContacts.Types.SendActivationCodeResult, AWSError>;
  /**
   * Starts an engagement to a contact or escalation plan. The engagement engages each contact specified in the incident.
   */
  startEngagement(params: SSMContacts.Types.StartEngagementRequest, callback?: (err: AWSError, data: SSMContacts.Types.StartEngagementResult) => void): Request<SSMContacts.Types.StartEngagementResult, AWSError>;
  /**
   * Starts an engagement to a contact or escalation plan. The engagement engages each contact specified in the incident.
   */
  startEngagement(callback?: (err: AWSError, data: SSMContacts.Types.StartEngagementResult) => void): Request<SSMContacts.Types.StartEngagementResult, AWSError>;
  /**
   * Stops an engagement before it finishes the final stage of the escalation plan or engagement plan. Further contacts aren't engaged.
   */
  stopEngagement(params: SSMContacts.Types.StopEngagementRequest, callback?: (err: AWSError, data: SSMContacts.Types.StopEngagementResult) => void): Request<SSMContacts.Types.StopEngagementResult, AWSError>;
  /**
   * Stops an engagement before it finishes the final stage of the escalation plan or engagement plan. Further contacts aren't engaged.
   */
  stopEngagement(callback?: (err: AWSError, data: SSMContacts.Types.StopEngagementResult) => void): Request<SSMContacts.Types.StopEngagementResult, AWSError>;
  /**
   * Tags a contact or escalation plan. You can tag only contacts and escalation plans in the first region of your replication set.
   */
  tagResource(params: SSMContacts.Types.TagResourceRequest, callback?: (err: AWSError, data: SSMContacts.Types.TagResourceResult) => void): Request<SSMContacts.Types.TagResourceResult, AWSError>;
  /**
   * Tags a contact or escalation plan. You can tag only contacts and escalation plans in the first region of your replication set.
   */
  tagResource(callback?: (err: AWSError, data: SSMContacts.Types.TagResourceResult) => void): Request<SSMContacts.Types.TagResourceResult, AWSError>;
  /**
   * Removes tags from the specified resource.
   */
  untagResource(params: SSMContacts.Types.UntagResourceRequest, callback?: (err: AWSError, data: SSMContacts.Types.UntagResourceResult) => void): Request<SSMContacts.Types.UntagResourceResult, AWSError>;
  /**
   * Removes tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: SSMContacts.Types.UntagResourceResult) => void): Request<SSMContacts.Types.UntagResourceResult, AWSError>;
  /**
   * Updates the contact or escalation plan specified.
   */
  updateContact(params: SSMContacts.Types.UpdateContactRequest, callback?: (err: AWSError, data: SSMContacts.Types.UpdateContactResult) => void): Request<SSMContacts.Types.UpdateContactResult, AWSError>;
  /**
   * Updates the contact or escalation plan specified.
   */
  updateContact(callback?: (err: AWSError, data: SSMContacts.Types.UpdateContactResult) => void): Request<SSMContacts.Types.UpdateContactResult, AWSError>;
  /**
   * Updates a contact's contact channel.
   */
  updateContactChannel(params: SSMContacts.Types.UpdateContactChannelRequest, callback?: (err: AWSError, data: SSMContacts.Types.UpdateContactChannelResult) => void): Request<SSMContacts.Types.UpdateContactChannelResult, AWSError>;
  /**
   * Updates a contact's contact channel.
   */
  updateContactChannel(callback?: (err: AWSError, data: SSMContacts.Types.UpdateContactChannelResult) => void): Request<SSMContacts.Types.UpdateContactChannelResult, AWSError>;
  /**
   * Updates the information specified for an on-call rotation.
   */
  updateRotation(params: SSMContacts.Types.UpdateRotationRequest, callback?: (err: AWSError, data: SSMContacts.Types.UpdateRotationResult) => void): Request<SSMContacts.Types.UpdateRotationResult, AWSError>;
  /**
   * Updates the information specified for an on-call rotation.
   */
  updateRotation(callback?: (err: AWSError, data: SSMContacts.Types.UpdateRotationResult) => void): Request<SSMContacts.Types.UpdateRotationResult, AWSError>;
}
declare namespace SSMContacts {
  export type AcceptCode = string;
  export type AcceptCodeValidation = "IGNORE"|"ENFORCE"|string;
  export interface AcceptPageRequest {
    /**
     * The Amazon Resource Name (ARN) of the engagement to a contact channel.
     */
    PageId: SsmContactsArn;
    /**
     * The ARN of the contact channel.
     */
    ContactChannelId?: SsmContactsArn;
    /**
     * The type indicates if the page was DELIVERED or READ.
     */
    AcceptType: AcceptType;
    /**
     * Information provided by the user when the user acknowledges the page.
     */
    Note?: ReceiptInfo;
    /**
     * A 6-digit code used to acknowledge the page.
     */
    AcceptCode: AcceptCode;
    /**
     * An optional field that Incident Manager uses to ENFORCE AcceptCode validation when acknowledging an page. Acknowledgement can occur by replying to a page, or when entering the AcceptCode in the console. Enforcing AcceptCode validation causes Incident Manager to verify that the code entered by the user matches the code sent by Incident Manager with the page. Incident Manager can also IGNORE AcceptCode validation. Ignoring AcceptCode validation causes Incident Manager to accept any value entered for the AcceptCode.
     */
    AcceptCodeValidation?: AcceptCodeValidation;
  }
  export interface AcceptPageResult {
  }
  export type AcceptType = "DELIVERED"|"READ"|string;
  export interface ActivateContactChannelRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact channel.
     */
    ContactChannelId: SsmContactsArn;
    /**
     * The code sent to the contact channel when it was created in the contact.
     */
    ActivationCode: ActivationCode;
  }
  export interface ActivateContactChannelResult {
  }
  export type ActivationCode = string;
  export type ActivationStatus = "ACTIVATED"|"NOT_ACTIVATED"|string;
  export type AmazonResourceName = string;
  export type ChannelName = string;
  export interface ChannelTargetInfo {
    /**
     * The Amazon Resource Name (ARN) of the contact channel.
     */
    ContactChannelId: SsmContactsArn;
    /**
     * The number of minutes to wait to retry sending engagement in the case the engagement initially fails.
     */
    RetryIntervalInMinutes?: RetryIntervalInMinutes;
  }
  export type ChannelType = "SMS"|"VOICE"|"EMAIL"|string;
  export interface Contact {
    /**
     * The Amazon Resource Name (ARN) of the contact or escalation plan.
     */
    ContactArn: SsmContactsArn;
    /**
     * The unique and identifiable alias of the contact or escalation plan.
     */
    Alias: ContactAlias;
    /**
     * The full name of the contact or escalation plan.
     */
    DisplayName?: ContactName;
    /**
     * Refers to the type of contact. A single contact is type PERSONAL and an escalation plan is type ESCALATION.
     */
    Type: ContactType;
  }
  export type ContactAlias = string;
  export interface ContactChannel {
    /**
     * The Amazon Resource Name (ARN) of the contact channel.
     */
    ContactChannelArn: SsmContactsArn;
    /**
     * The ARN of the contact that contains the contact channel.
     */
    ContactArn: SsmContactsArn;
    /**
     * The name of the contact channel.
     */
    Name: ChannelName;
    /**
     * The type of the contact channel. Incident Manager supports three contact methods:   SMS   VOICE   EMAIL  
     */
    Type?: ChannelType;
    /**
     * The details that Incident Manager uses when trying to engage the contact channel.
     */
    DeliveryAddress: ContactChannelAddress;
    /**
     * A Boolean value describing if the contact channel has been activated or not. If the contact channel isn't activated, Incident Manager can't engage the contact through it.
     */
    ActivationStatus: ActivationStatus;
  }
  export interface ContactChannelAddress {
    /**
     * The format is dependent on the type of the contact channel. The following are the expected formats:   SMS - '+' followed by the country code and phone number   VOICE - '+' followed by the country code and phone number   EMAIL - any standard email format  
     */
    SimpleAddress?: SimpleAddress;
  }
  export type ContactChannelList = ContactChannel[];
  export type ContactName = string;
  export interface ContactTargetInfo {
    /**
     * The Amazon Resource Name (ARN) of the contact.
     */
    ContactId?: SsmContactsArn;
    /**
     * A Boolean value determining if the contact's acknowledgement stops the progress of stages in the plan.
     */
    IsEssential: IsEssential;
  }
  export type ContactType = "PERSONAL"|"ESCALATION"|"ONCALL_SCHEDULE"|string;
  export type ContactsList = Contact[];
  export type Content = string;
  export interface CoverageTime {
    /**
     * Information about when the on-call rotation shift begins.
     */
    Start?: HandOffTime;
    /**
     * Information about when the on-call rotation shift ends.
     */
    End?: HandOffTime;
  }
  export type CoverageTimes = CoverageTime[];
  export interface CreateContactChannelRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact you are adding the contact channel to.
     */
    ContactId: SsmContactsArn;
    /**
     * The name of the contact channel.
     */
    Name: ChannelName;
    /**
     * Incident Manager supports three types of contact channels:    SMS     VOICE     EMAIL   
     */
    Type: ChannelType;
    /**
     * The details that Incident Manager uses when trying to engage the contact channel. The format is dependent on the type of the contact channel. The following are the expected formats:   SMS - '+' followed by the country code and phone number   VOICE - '+' followed by the country code and phone number   EMAIL - any standard email format  
     */
    DeliveryAddress: ContactChannelAddress;
    /**
     * If you want to activate the channel at a later time, you can choose to defer activation. Incident Manager can't engage your contact channel until it has been activated.
     */
    DeferActivation?: DeferActivation;
    /**
     * A token ensuring that the operation is called only once with the specified details.
     */
    IdempotencyToken?: IdempotencyToken;
  }
  export interface CreateContactChannelResult {
    /**
     * The Amazon Resource Name (ARN) of the contact channel.
     */
    ContactChannelArn: SsmContactsArn;
  }
  export interface CreateContactRequest {
    /**
     * The short name to quickly identify a contact or escalation plan. The contact alias must be unique and identifiable.
     */
    Alias: ContactAlias;
    /**
     * The full name of the contact or escalation plan.
     */
    DisplayName?: ContactName;
    /**
     * To create an escalation plan use ESCALATION. To create a contact use PERSONAL.
     */
    Type: ContactType;
    /**
     * A list of stages. A contact has an engagement plan with stages that contact specified contact channels. An escalation plan uses stages that contact specified contacts.
     */
    Plan: Plan;
    /**
     * Adds a tag to the target. You can only tag resources created in the first Region of your replication set.
     */
    Tags?: TagsList;
    /**
     * A token ensuring that the operation is called only once with the specified details.
     */
    IdempotencyToken?: IdempotencyToken;
  }
  export interface CreateContactResult {
    /**
     * The Amazon Resource Name (ARN) of the created contact or escalation plan.
     */
    ContactArn: SsmContactsArn;
  }
  export interface CreateRotationOverrideRequest {
    /**
     * The Amazon Resource Name (ARN) of the rotation to create an override for.
     */
    RotationId: SsmContactsArn;
    /**
     * The Amazon Resource Names (ARNs) of the contacts to replace those in the current on-call rotation with. If you want to include any current team members in the override shift, you must include their ARNs in the new contact ID list.
     */
    NewContactIds: RotationOverrideContactsArnList;
    /**
     * The date and time when the override goes into effect.
     */
    StartTime: DateTime;
    /**
     * The date and time when the override ends.
     */
    EndTime: DateTime;
    /**
     * A token that ensures that the operation is called only once with the specified details.
     */
    IdempotencyToken?: IdempotencyToken;
  }
  export interface CreateRotationOverrideResult {
    /**
     * The Amazon Resource Name (ARN) of the created rotation override.
     */
    RotationOverrideId: Uuid;
  }
  export interface CreateRotationRequest {
    /**
     * The name of the rotation.
     */
    Name: RotationName;
    /**
     * The Amazon Resource Names (ARNs) of the contacts to add to the rotation. The order that you list the contacts in is their shift order in the rotation schedule. To change the order of the contact's shifts, use the UpdateRotation operation.
     */
    ContactIds: RotationContactsArnList;
    /**
     * The date and time that the rotation goes into effect.
     */
    StartTime?: DateTime;
    /**
     * The time zone to base the rotation’s activity on in Internet Assigned Numbers Authority (IANA) format. For example: "America/Los_Angeles", "UTC", or "Asia/Seoul". For more information, see the Time Zone Database on the IANA website.  Designators for time zones that don’t support Daylight Savings Time rules, such as Pacific Standard Time (PST) and Pacific Daylight Time (PDT), are not supported. 
     */
    TimeZoneId: TimeZoneId;
    /**
     * Information about the rule that specifies when a shift's team members rotate.
     */
    Recurrence: RecurrenceSettings;
    /**
     * Optional metadata to assign to the rotation. Tags enable you to categorize a resource in different ways, such as by purpose, owner, or environment. For more information, see Tagging Incident Manager resources in the Incident Manager User Guide.
     */
    Tags?: TagsList;
    /**
     * A token that ensures that the operation is called only once with the specified details.
     */
    IdempotencyToken?: IdempotencyToken;
  }
  export interface CreateRotationResult {
    /**
     * The Amazon Resource Name (ARN) of the created rotation.
     */
    RotationArn: SsmContactsArn;
  }
  export type DailySettings = HandOffTime[];
  export type DateTime = Date;
  export type DayOfMonth = number;
  export type DayOfWeek = "MON"|"TUE"|"WED"|"THU"|"FRI"|"SAT"|"SUN"|string;
  export interface DeactivateContactChannelRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact channel you're deactivating.
     */
    ContactChannelId: SsmContactsArn;
  }
  export interface DeactivateContactChannelResult {
  }
  export type DeferActivation = boolean;
  export interface DeleteContactChannelRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact channel.
     */
    ContactChannelId: SsmContactsArn;
  }
  export interface DeleteContactChannelResult {
  }
  export interface DeleteContactRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact that you're deleting.
     */
    ContactId: SsmContactsArn;
  }
  export interface DeleteContactResult {
  }
  export interface DeleteRotationOverrideRequest {
    /**
     * The Amazon Resource Name (ARN) of the rotation that was overridden.
     */
    RotationId: SsmContactsArn;
    /**
     * The Amazon Resource Name (ARN) of the on-call rotation override to delete.
     */
    RotationOverrideId: Uuid;
  }
  export interface DeleteRotationOverrideResult {
  }
  export interface DeleteRotationRequest {
    /**
     * The Amazon Resource Name (ARN) of the on-call rotation to delete.
     */
    RotationId: SsmContactsArn;
  }
  export interface DeleteRotationResult {
  }
  export interface DescribeEngagementRequest {
    /**
     * The Amazon Resource Name (ARN) of the engagement you want the details of.
     */
    EngagementId: SsmContactsArn;
  }
  export interface DescribeEngagementResult {
    /**
     * The ARN of the escalation plan or contacts involved in the engagement.
     */
    ContactArn: SsmContactsArn;
    /**
     * The ARN of the engagement.
     */
    EngagementArn: SsmContactsArn;
    /**
     * The user that started the engagement.
     */
    Sender: Sender;
    /**
     * The secure subject of the message that was sent to the contact. Use this field for engagements to VOICE and EMAIL.
     */
    Subject: Subject;
    /**
     * The secure content of the message that was sent to the contact. Use this field for engagements to VOICE and EMAIL.
     */
    Content: Content;
    /**
     * The insecure subject of the message that was sent to the contact. Use this field for engagements to SMS.
     */
    PublicSubject?: PublicSubject;
    /**
     * The insecure content of the message that was sent to the contact. Use this field for engagements to SMS.
     */
    PublicContent?: PublicContent;
    /**
     * The ARN of the incident in which the engagement occurred.
     */
    IncidentId?: IncidentId;
    /**
     * The time that the engagement started.
     */
    StartTime?: DateTime;
    /**
     * The time that the engagement ended.
     */
    StopTime?: DateTime;
  }
  export interface DescribePageRequest {
    /**
     * The ID of the engagement to a contact channel.
     */
    PageId: SsmContactsArn;
  }
  export interface DescribePageResult {
    /**
     * The Amazon Resource Name (ARN) of the engagement to a contact channel.
     */
    PageArn: SsmContactsArn;
    /**
     * The ARN of the engagement that engaged the contact channel.
     */
    EngagementArn: SsmContactsArn;
    /**
     * The ARN of the contact that was engaged.
     */
    ContactArn: SsmContactsArn;
    /**
     * The user that started the engagement.
     */
    Sender: Sender;
    /**
     * The secure subject of the message that was sent to the contact. Use this field for engagements to VOICE and EMAIL.
     */
    Subject: Subject;
    /**
     * The secure content of the message that was sent to the contact. Use this field for engagements to VOICE and EMAIL.
     */
    Content: Content;
    /**
     * The insecure subject of the message that was sent to the contact. Use this field for engagements to SMS.
     */
    PublicSubject?: PublicSubject;
    /**
     * The insecure content of the message that was sent to the contact. Use this field for engagements to SMS.
     */
    PublicContent?: PublicContent;
    /**
     * The ARN of the incident that engaged the contact channel.
     */
    IncidentId?: IncidentId;
    /**
     * The time the engagement was sent to the contact channel.
     */
    SentTime?: DateTime;
    /**
     * The time that the contact channel acknowledged the engagement.
     */
    ReadTime?: DateTime;
    /**
     * The time that the contact channel received the engagement.
     */
    DeliveryTime?: DateTime;
  }
  export interface Engagement {
    /**
     * The Amazon Resource Name (ARN) of the engagement.
     */
    EngagementArn: SsmContactsArn;
    /**
     * The ARN of the escalation plan or contact that Incident Manager is engaging.
     */
    ContactArn: SsmContactsArn;
    /**
     * The user that started the engagement.
     */
    Sender: Sender;
    /**
     * The ARN of the incident that's engaging the contact.
     */
    IncidentId?: IncidentId;
    /**
     * The time that the engagement began.
     */
    StartTime?: DateTime;
    /**
     * The time that the engagement ended.
     */
    StopTime?: DateTime;
  }
  export type EngagementsList = Engagement[];
  export interface GetContactChannelRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact channel you want information about.
     */
    ContactChannelId: SsmContactsArn;
  }
  export interface GetContactChannelResult {
    /**
     * The ARN of the contact that the channel belongs to.
     */
    ContactArn: SsmContactsArn;
    /**
     * The ARN of the contact channel.
     */
    ContactChannelArn: SsmContactsArn;
    /**
     * The name of the contact channel
     */
    Name: ChannelName;
    /**
     * The type of contact channel. The type is SMS, VOICE, or EMAIL.
     */
    Type: ChannelType;
    /**
     * The details that Incident Manager uses when trying to engage the contact channel.
     */
    DeliveryAddress: ContactChannelAddress;
    /**
     * A Boolean value indicating if the contact channel has been activated or not.
     */
    ActivationStatus?: ActivationStatus;
  }
  export interface GetContactPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact or escalation plan.
     */
    ContactArn: SsmContactsArn;
  }
  export interface GetContactPolicyResult {
    /**
     * The ARN of the contact or escalation plan.
     */
    ContactArn?: SsmContactsArn;
    /**
     * Details about the resource policy attached to the contact or escalation plan.
     */
    Policy?: Policy;
  }
  export interface GetContactRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact or escalation plan.
     */
    ContactId: SsmContactsArn;
  }
  export interface GetContactResult {
    /**
     * The ARN of the contact or escalation plan.
     */
    ContactArn: SsmContactsArn;
    /**
     * The alias of the contact or escalation plan. The alias is unique and identifiable.
     */
    Alias: ContactAlias;
    /**
     * The full name of the contact or escalation plan.
     */
    DisplayName?: ContactName;
    /**
     * The type of contact, either PERSONAL or ESCALATION.
     */
    Type: ContactType;
    /**
     * Details about the specific timing or stages and targets of the escalation plan or engagement plan.
     */
    Plan: Plan;
  }
  export interface GetRotationOverrideRequest {
    /**
     * The Amazon Resource Name (ARN) of the overridden rotation to retrieve information about.
     */
    RotationId: SsmContactsArn;
    /**
     * The Amazon Resource Name (ARN) of the on-call rotation override to retrieve information about.
     */
    RotationOverrideId: Uuid;
  }
  export interface GetRotationOverrideResult {
    /**
     * The Amazon Resource Name (ARN) of the override to an on-call rotation.
     */
    RotationOverrideId?: Uuid;
    /**
     * The Amazon Resource Name (ARN) of the on-call rotation that was overridden.
     */
    RotationArn?: SsmContactsArn;
    /**
     * The Amazon Resource Names (ARNs) of the contacts assigned to the override of the on-call rotation.
     */
    NewContactIds?: SsmContactsArnList;
    /**
     * The date and time when the override goes into effect.
     */
    StartTime?: DateTime;
    /**
     * The date and time when the override ends.
     */
    EndTime?: DateTime;
    /**
     * The date and time when the override was created.
     */
    CreateTime?: DateTime;
  }
  export interface GetRotationRequest {
    /**
     * The Amazon Resource Name (ARN) of the on-call rotation to retrieve information about.
     */
    RotationId: SsmContactsArn;
  }
  export interface GetRotationResult {
    /**
     * The Amazon Resource Name (ARN) of the on-call rotation.
     */
    RotationArn: SsmContactsArn;
    /**
     * The name of the on-call rotation.
     */
    Name: RotationName;
    /**
     * The Amazon Resource Names (ARNs) of the contacts assigned to the on-call rotation team.
     */
    ContactIds: RotationContactsArnList;
    /**
     * The specified start time for the on-call rotation.
     */
    StartTime: DateTime;
    /**
     * The time zone that the rotation’s activity is based on, in Internet Assigned Numbers Authority (IANA) format.
     */
    TimeZoneId: TimeZoneId;
    /**
     * Specifies how long a rotation lasts before restarting at the beginning of the shift order.
     */
    Recurrence: RecurrenceSettings;
  }
  export interface HandOffTime {
    /**
     * The hour when an on-call rotation shift begins or ends.
     */
    HourOfDay: HourOfDay;
    /**
     * The minute when an on-call rotation shift begins or ends.
     */
    MinuteOfHour: MinuteOfHour;
  }
  export type HourOfDay = number;
  export type IdempotencyToken = string;
  export type IncidentId = string;
  export type IsEssential = boolean;
  export interface ListContactChannelsRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact.
     */
    ContactId: SsmContactsArn;
    /**
     * The pagination token to continue to the next page of results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of contact channels per page.
     */
    MaxResults?: MaxResults;
  }
  export interface ListContactChannelsResult {
    /**
     * The pagination token to continue to the next page of results.
     */
    NextToken?: PaginationToken;
    /**
     * A list of contact channels related to the specified contact.
     */
    ContactChannels: ContactChannelList;
  }
  export interface ListContactsRequest {
    /**
     * The pagination token to continue to the next page of results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of contacts and escalation plans per page of results.
     */
    MaxResults?: MaxResults;
    /**
     * Used to list only contacts who's aliases start with the specified prefix.
     */
    AliasPrefix?: ContactAlias;
    /**
     * The type of contact. A contact is type PERSONAL and an escalation plan is type ESCALATION.
     */
    Type?: ContactType;
  }
  export interface ListContactsResult {
    /**
     * The pagination token to continue to the next page of results.
     */
    NextToken?: PaginationToken;
    /**
     * A list of the contacts and escalation plans in your Incident Manager account.
     */
    Contacts?: ContactsList;
  }
  export interface ListEngagementsRequest {
    /**
     * The pagination token to continue to the next page of results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of engagements per page of results.
     */
    MaxResults?: MaxResults;
    /**
     * The Amazon Resource Name (ARN) of the incident you're listing engagements for.
     */
    IncidentId?: IncidentId;
    /**
     * The time range to lists engagements for an incident.
     */
    TimeRangeValue?: TimeRange;
  }
  export interface ListEngagementsResult {
    /**
     * The pagination token to continue to the next page of results.
     */
    NextToken?: PaginationToken;
    /**
     * A list of each engagement that occurred during the specified time range of an incident.
     */
    Engagements: EngagementsList;
  }
  export interface ListPageReceiptsRequest {
    /**
     * The Amazon Resource Name (ARN) of the engagement to a specific contact channel.
     */
    PageId: SsmContactsArn;
    /**
     * The pagination token to continue to the next page of results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of acknowledgements per page of results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListPageReceiptsResult {
    /**
     * The pagination token to continue to the next page of results.
     */
    NextToken?: PaginationToken;
    /**
     * A list of each acknowledgement.
     */
    Receipts?: ReceiptsList;
  }
  export interface ListPageResolutionsRequest {
    /**
     * A token to start the list. Use this token to get the next set of results.
     */
    NextToken?: PaginationToken;
    /**
     * The Amazon Resource Name (ARN) of the contact engaged for the incident.
     */
    PageId: SsmContactsArn;
  }
  export interface ListPageResolutionsResult {
    /**
     * The token for the next set of items to return. Use this token to get the next set of results.
     */
    NextToken?: PaginationToken;
    /**
     * Information about the resolution for an engagement.
     */
    PageResolutions: ResolutionList;
  }
  export interface ListPagesByContactRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact you are retrieving engagements for.
     */
    ContactId: SsmContactsArn;
    /**
     * The pagination token to continue to the next page of results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of engagements to contact channels to list per page of results. 
     */
    MaxResults?: MaxResults;
  }
  export interface ListPagesByContactResult {
    /**
     * The pagination token to continue to the next page of results.
     */
    NextToken?: PaginationToken;
    /**
     * The list of engagements to a contact's contact channel.
     */
    Pages: PagesList;
  }
  export interface ListPagesByEngagementRequest {
    /**
     * The Amazon Resource Name (ARN) of the engagement.
     */
    EngagementId: SsmContactsArn;
    /**
     * The pagination token to continue to the next page of results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of engagements to contact channels to list per page of results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListPagesByEngagementResult {
    /**
     * The pagination token to continue to the next page of results.
     */
    NextToken?: PaginationToken;
    /**
     * The list of engagements to contact channels.
     */
    Pages: PagesList;
  }
  export interface ListPreviewRotationShiftsRequest {
    /**
     * The date and time a rotation would begin. The first shift is calculated from this date and time.
     */
    RotationStartTime?: DateTime;
    /**
     * Used to filter the range of calculated shifts before sending the response back to the user. 
     */
    StartTime?: DateTime;
    /**
     * The date and time a rotation shift would end.
     */
    EndTime: DateTime;
    /**
     * The contacts that would be assigned to a rotation.
     */
    Members: RotationPreviewMemberList;
    /**
     * The time zone the rotation’s activity would be based on, in Internet Assigned Numbers Authority (IANA) format. For example: "America/Los_Angeles", "UTC", or "Asia/Seoul". 
     */
    TimeZoneId: TimeZoneId;
    /**
     * Information about how long a rotation would last before restarting at the beginning of the shift order.
     */
    Recurrence: RecurrenceSettings;
    /**
     * Information about changes that would be made in a rotation override.
     */
    Overrides?: OverrideList;
    /**
     * A token to start the list. This token is used to get the next set of results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of items to return for this call. The call also returns a token that can be specified in a subsequent call to get the next set of results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListPreviewRotationShiftsResult {
    /**
     * Details about a rotation shift, including times, types, and contacts.
     */
    RotationShifts?: RotationShifts;
    /**
     * The token for the next set of items to return. This token is used to get the next set of results.
     */
    NextToken?: PaginationToken;
  }
  export interface ListRotationOverridesRequest {
    /**
     * The Amazon Resource Name (ARN) of the rotation to retrieve information about.
     */
    RotationId: SsmContactsArn;
    /**
     * The date and time for the beginning of a time range for listing overrides.
     */
    StartTime: DateTime;
    /**
     * The date and time for the end of a time range for listing overrides.
     */
    EndTime: DateTime;
    /**
     * A token to start the list. Use this token to get the next set of results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of items to return for this call. The call also returns a token that you can specify in a subsequent call to get the next set of results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListRotationOverridesResult {
    /**
     * A list of rotation overrides in the specified time range.
     */
    RotationOverrides?: RotationOverrides;
    /**
     * The token for the next set of items to return. Use this token to get the next set of results.
     */
    NextToken?: PaginationToken;
  }
  export interface ListRotationShiftsRequest {
    /**
     * The Amazon Resource Name (ARN) of the rotation to retrieve shift information about. 
     */
    RotationId: SsmContactsArn;
    /**
     * The date and time for the beginning of the time range to list shifts for.
     */
    StartTime?: DateTime;
    /**
     * The date and time for the end of the time range to list shifts for.
     */
    EndTime: DateTime;
    /**
     * A token to start the list. Use this token to get the next set of results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of items to return for this call. The call also returns a token that you can specify in a subsequent call to get the next set of results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListRotationShiftsResult {
    /**
     * Information about shifts that meet the filter criteria.
     */
    RotationShifts?: RotationShifts;
    /**
     * The token for the next set of items to return. Use this token to get the next set of results.
     */
    NextToken?: PaginationToken;
  }
  export interface ListRotationsRequest {
    /**
     * A filter to include rotations in list results based on their common prefix. For example, entering prod returns a list of all rotation names that begin with prod, such as production and prod-1.
     */
    RotationNamePrefix?: RotationName;
    /**
     * A token to start the list. Use this token to get the next set of results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of items to return for this call. The call also returns a token that you can specify in a subsequent call to get the next set of results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListRotationsResult {
    /**
     * The token for the next set of items to return. Use this token to get the next set of results.
     */
    NextToken?: PaginationToken;
    /**
     * Information about rotations that meet the filter criteria.
     */
    Rotations: Rotations;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact or escalation plan.
     */
    ResourceARN: AmazonResourceName;
  }
  export interface ListTagsForResourceResult {
    /**
     * The tags related to the contact or escalation plan.
     */
    Tags?: TagsList;
  }
  export type MaxResults = number;
  export type Member = string;
  export type MinuteOfHour = number;
  export interface MonthlySetting {
    /**
     * The day of the month when monthly recurring on-call rotations begin.
     */
    DayOfMonth: DayOfMonth;
    /**
     * The time of day when a monthly recurring on-call shift rotation begins.
     */
    HandOffTime: HandOffTime;
  }
  export type MonthlySettings = MonthlySetting[];
  export type NumberOfOnCalls = number;
  export type OverrideList = PreviewOverride[];
  export interface Page {
    /**
     * The Amazon Resource Name (ARN) of the page to the contact channel.
     */
    PageArn: SsmContactsArn;
    /**
     * The ARN of the engagement that this page is part of.
     */
    EngagementArn: SsmContactsArn;
    /**
     * The ARN of the contact that Incident Manager is engaging.
     */
    ContactArn: SsmContactsArn;
    /**
     * The user that started the engagement.
     */
    Sender: Sender;
    /**
     * The ARN of the incident that's engaging the contact channel.
     */
    IncidentId?: IncidentId;
    /**
     * The time that Incident Manager engaged the contact channel.
     */
    SentTime?: DateTime;
    /**
     * The time the message was delivered to the contact channel.
     */
    DeliveryTime?: DateTime;
    /**
     * The time that the contact channel acknowledged engagement.
     */
    ReadTime?: DateTime;
  }
  export type PagesList = Page[];
  export type PaginationToken = string;
  export interface Plan {
    /**
     * A list of stages that the escalation plan or engagement plan uses to engage contacts and contact methods.
     */
    Stages?: StagesList;
    /**
     * The Amazon Resource Names (ARNs) of the on-call rotations associated with the plan. 
     */
    RotationIds?: SsmContactsArnList;
  }
  export type Policy = string;
  export interface PreviewOverride {
    /**
     * Information about contacts to add to an on-call rotation override.
     */
    NewMembers?: RotationOverridePreviewMemberList;
    /**
     * Information about the time a rotation override would begin.
     */
    StartTime?: DateTime;
    /**
     * Information about the time a rotation override would end.
     */
    EndTime?: DateTime;
  }
  export type PublicContent = string;
  export type PublicSubject = string;
  export interface PutContactPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact or escalation plan.
     */
    ContactArn: SsmContactsArn;
    /**
     * Details of the resource policy.
     */
    Policy: Policy;
  }
  export interface PutContactPolicyResult {
  }
  export interface Receipt {
    /**
     * The Amazon Resource Name (ARN) of the contact channel Incident Manager engaged.
     */
    ContactChannelArn?: SsmContactsArn;
    /**
     * The type follows the engagement cycle, SENT, DELIVERED, and READ.
     */
    ReceiptType: ReceiptType;
    /**
     * Information provided during the page acknowledgement.
     */
    ReceiptInfo?: ReceiptInfo;
    /**
     * The time receipt was SENT, DELIVERED, or READ.
     */
    ReceiptTime: DateTime;
  }
  export type ReceiptInfo = string;
  export type ReceiptType = "DELIVERED"|"ERROR"|"READ"|"SENT"|"STOP"|string;
  export type ReceiptsList = Receipt[];
  export type RecurrenceMultiplier = number;
  export interface RecurrenceSettings {
    /**
     * Information about on-call rotations that recur monthly.
     */
    MonthlySettings?: MonthlySettings;
    /**
     * Information about on-call rotations that recur weekly.
     */
    WeeklySettings?: WeeklySettings;
    /**
     * Information about on-call rotations that recur daily.
     */
    DailySettings?: DailySettings;
    /**
     * The number of contacts, or shift team members designated to be on call concurrently during a shift. For example, in an on-call schedule containing ten contacts, a value of 2 designates that two of them are on call at any given time.
     */
    NumberOfOnCalls: NumberOfOnCalls;
    /**
     * Information about the days of the week included in on-call rotation coverage.
     */
    ShiftCoverages?: ShiftCoveragesMap;
    /**
     * The number of days, weeks, or months a single rotation lasts.
     */
    RecurrenceMultiplier: RecurrenceMultiplier;
  }
  export interface ResolutionContact {
    /**
     * The Amazon Resource Name (ARN) of a contact in the engagement resolution process. 
     */
    ContactArn: SsmContactsArn;
    /**
     * The type of contact for a resolution step.
     */
    Type: ContactType;
    /**
     * The stage in the escalation plan that resolves to this contact.
     */
    StageIndex?: StageIndex;
  }
  export type ResolutionList = ResolutionContact[];
  export type RetryIntervalInMinutes = number;
  export interface Rotation {
    /**
     * The Amazon Resource Name (ARN) of the rotation.
     */
    RotationArn: SsmContactsArn;
    /**
     * The name of the rotation.
     */
    Name: RotationName;
    /**
     * The Amazon Resource Names (ARNs) of the contacts assigned to the rotation team.
     */
    ContactIds?: SsmContactsArnList;
    /**
     * The date and time the rotation becomes active.
     */
    StartTime?: DateTime;
    /**
     * The time zone the rotation’s activity is based on, in Internet Assigned Numbers Authority (IANA) format. For example: "America/Los_Angeles", "UTC", or "Asia/Seoul". 
     */
    TimeZoneId?: TimeZoneId;
    /**
     * Information about when an on-call rotation is in effect and how long the rotation period lasts.
     */
    Recurrence?: RecurrenceSettings;
  }
  export type RotationContactsArnList = SsmContactsArn[];
  export type RotationName = string;
  export interface RotationOverride {
    /**
     * The Amazon Resource Name (ARN) of the override to an on-call rotation.
     */
    RotationOverrideId: Uuid;
    /**
     * The Amazon Resource Names (ARNs) of the contacts assigned to the override of the on-call rotation.
     */
    NewContactIds: SsmContactsArnList;
    /**
     * The time a rotation override begins.
     */
    StartTime: DateTime;
    /**
     * The time a rotation override ends.
     */
    EndTime: DateTime;
    /**
     * The time a rotation override was created.
     */
    CreateTime: DateTime;
  }
  export type RotationOverrideContactsArnList = SsmContactsArn[];
  export type RotationOverridePreviewMemberList = Member[];
  export type RotationOverrides = RotationOverride[];
  export type RotationPreviewMemberList = Member[];
  export interface RotationShift {
    /**
     * The Amazon Resource Names (ARNs) of the contacts who are part of the shift rotation. 
     */
    ContactIds?: SsmContactsArnList;
    /**
     * The time a shift rotation begins.
     */
    StartTime: DateTime;
    /**
     * The time a shift rotation ends.
     */
    EndTime: DateTime;
    /**
     * The type of shift rotation.
     */
    Type?: ShiftType;
    /**
     * Additional information about an on-call rotation shift.
     */
    ShiftDetails?: ShiftDetails;
  }
  export type RotationShifts = RotationShift[];
  export type Rotations = Rotation[];
  export interface SendActivationCodeRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact channel.
     */
    ContactChannelId: SsmContactsArn;
  }
  export interface SendActivationCodeResult {
  }
  export type Sender = string;
  export type ShiftCoveragesMap = {[key: string]: CoverageTimes};
  export interface ShiftDetails {
    /**
     * The Amazon Resources Names (ARNs) of the contacts who were replaced in a shift when an override was created. If the override is deleted, these contacts are restored to the shift.
     */
    OverriddenContactIds: SsmContactsArnList;
  }
  export type ShiftType = "REGULAR"|"OVERRIDDEN"|string;
  export type SimpleAddress = string;
  export type SsmContactsArn = string;
  export type SsmContactsArnList = SsmContactsArn[];
  export interface Stage {
    /**
     * The time to wait until beginning the next stage. The duration can only be set to 0 if a target is specified.
     */
    DurationInMinutes: StageDurationInMins;
    /**
     * The contacts or contact methods that the escalation plan or engagement plan is engaging.
     */
    Targets: TargetsList;
  }
  export type StageDurationInMins = number;
  export type StageIndex = number;
  export type StagesList = Stage[];
  export interface StartEngagementRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact being engaged.
     */
    ContactId: SsmContactsArn;
    /**
     * The user that started the engagement.
     */
    Sender: Sender;
    /**
     * The secure subject of the message that was sent to the contact. Use this field for engagements to VOICE or EMAIL.
     */
    Subject: Subject;
    /**
     * The secure content of the message that was sent to the contact. Use this field for engagements to VOICE or EMAIL.
     */
    Content: Content;
    /**
     * The insecure subject of the message that was sent to the contact. Use this field for engagements to SMS.
     */
    PublicSubject?: PublicSubject;
    /**
     * The insecure content of the message that was sent to the contact. Use this field for engagements to SMS.
     */
    PublicContent?: PublicContent;
    /**
     * The ARN of the incident that the engagement is part of.
     */
    IncidentId?: IncidentId;
    /**
     * A token ensuring that the operation is called only once with the specified details.
     */
    IdempotencyToken?: IdempotencyToken;
  }
  export interface StartEngagementResult {
    /**
     * The ARN of the engagement.
     */
    EngagementArn: SsmContactsArn;
  }
  export interface StopEngagementRequest {
    /**
     * The Amazon Resource Name (ARN) of the engagement.
     */
    EngagementId: SsmContactsArn;
    /**
     * The reason that you're stopping the engagement.
     */
    Reason?: StopReason;
  }
  export interface StopEngagementResult {
  }
  export type StopReason = string;
  export type Subject = string;
  export interface Tag {
    /**
     * Name of the object key.
     */
    Key?: TagKey;
    /**
     * Value of the tag.
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact or escalation plan.
     */
    ResourceARN: AmazonResourceName;
    /**
     * A list of tags that you are adding to the contact or escalation plan.
     */
    Tags: TagsList;
  }
  export interface TagResourceResult {
  }
  export type TagValue = string;
  export type TagsList = Tag[];
  export interface Target {
    /**
     * Information about the contact channel Incident Manager is engaging.
     */
    ChannelTargetInfo?: ChannelTargetInfo;
    /**
     * Information about the contact that Incident Manager is engaging.
     */
    ContactTargetInfo?: ContactTargetInfo;
  }
  export type TargetsList = Target[];
  export interface TimeRange {
    /**
     * The start of the time range.
     */
    StartTime?: DateTime;
    /**
     * The end of the time range.
     */
    EndTime?: DateTime;
  }
  export type TimeZoneId = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact or escalation plan.
     */
    ResourceARN: AmazonResourceName;
    /**
     * The key of the tag that you want to remove.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResult {
  }
  export interface UpdateContactChannelRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact channel you want to update.
     */
    ContactChannelId: SsmContactsArn;
    /**
     * The name of the contact channel.
     */
    Name?: ChannelName;
    /**
     * The details that Incident Manager uses when trying to engage the contact channel.
     */
    DeliveryAddress?: ContactChannelAddress;
  }
  export interface UpdateContactChannelResult {
  }
  export interface UpdateContactRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact or escalation plan you're updating.
     */
    ContactId: SsmContactsArn;
    /**
     * The full name of the contact or escalation plan.
     */
    DisplayName?: ContactName;
    /**
     * A list of stages. A contact has an engagement plan with stages for specified contact channels. An escalation plan uses these stages to contact specified contacts.
     */
    Plan?: Plan;
  }
  export interface UpdateContactResult {
  }
  export interface UpdateRotationRequest {
    /**
     * The Amazon Resource Name (ARN) of the rotation to update.
     */
    RotationId: SsmContactsArn;
    /**
     * The Amazon Resource Names (ARNs) of the contacts to include in the updated rotation.  The order in which you list the contacts is their shift order in the rotation schedule.
     */
    ContactIds?: RotationContactsArnList;
    /**
     * The date and time the rotation goes into effect.
     */
    StartTime?: DateTime;
    /**
     * The time zone to base the updated rotation’s activity on, in Internet Assigned Numbers Authority (IANA) format. For example: "America/Los_Angeles", "UTC", or "Asia/Seoul". For more information, see the Time Zone Database on the IANA website.  Designators for time zones that don’t support Daylight Savings Time Rules, such as Pacific Standard Time (PST) and Pacific Daylight Time (PDT), aren't supported. 
     */
    TimeZoneId?: TimeZoneId;
    /**
     * Information about how long the updated rotation lasts before restarting at the beginning of the shift order.
     */
    Recurrence: RecurrenceSettings;
  }
  export interface UpdateRotationResult {
  }
  export type Uuid = string;
  export interface WeeklySetting {
    /**
     * The day of the week when weekly recurring on-call shift rotations begins.
     */
    DayOfWeek: DayOfWeek;
    /**
     * The time of day when a weekly recurring on-call shift rotation begins.
     */
    HandOffTime: HandOffTime;
  }
  export type WeeklySettings = WeeklySetting[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-05-03"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SSMContacts client.
   */
  export import Types = SSMContacts;
}
export = SSMContacts;
