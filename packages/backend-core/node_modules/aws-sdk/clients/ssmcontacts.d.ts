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
   * Lists the tags of an escalation plan or contact.
   */
  listTagsForResource(params: SSMContacts.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: SSMContacts.Types.ListTagsForResourceResult) => void): Request<SSMContacts.Types.ListTagsForResourceResult, AWSError>;
  /**
   * Lists the tags of an escalation plan or contact.
   */
  listTagsForResource(callback?: (err: AWSError, data: SSMContacts.Types.ListTagsForResourceResult) => void): Request<SSMContacts.Types.ListTagsForResourceResult, AWSError>;
  /**
   * Adds a resource to the specified contact or escalation plan.
   */
  putContactPolicy(params: SSMContacts.Types.PutContactPolicyRequest, callback?: (err: AWSError, data: SSMContacts.Types.PutContactPolicyResult) => void): Request<SSMContacts.Types.PutContactPolicyResult, AWSError>;
  /**
   * Adds a resource to the specified contact or escalation plan.
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
     * The accept code is a 6-digit code used to acknowledge the page.
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
  export type ContactType = "PERSONAL"|"ESCALATION"|string;
  export type ContactsList = Contact[];
  export type Content = string;
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
  export type DateTime = Date;
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
    Stages: StagesList;
  }
  export type Policy = string;
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
  export type RetryIntervalInMinutes = number;
  export interface SendActivationCodeRequest {
    /**
     * The Amazon Resource Name (ARN) of the contact channel.
     */
    ContactChannelId: SsmContactsArn;
  }
  export interface SendActivationCodeResult {
  }
  export type Sender = string;
  export type SimpleAddress = string;
  export type SsmContactsArn = string;
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
