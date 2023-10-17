import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ChimeSDKMessaging extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ChimeSDKMessaging.Types.ClientConfiguration)
  config: Config & ChimeSDKMessaging.Types.ClientConfiguration;
  /**
   * Associates a channel flow with a channel. Once associated, all messages to that channel go through channel flow processors. To stop processing, use the DisassociateChannelFlow API.  Only administrators or channel moderators can associate a channel flow. The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  associateChannelFlow(params: ChimeSDKMessaging.Types.AssociateChannelFlowRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates a channel flow with a channel. Once associated, all messages to that channel go through channel flow processors. To stop processing, use the DisassociateChannelFlow API.  Only administrators or channel moderators can associate a channel flow. The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  associateChannelFlow(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds a specified number of users and bots to a channel. 
   */
  batchCreateChannelMembership(params: ChimeSDKMessaging.Types.BatchCreateChannelMembershipRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.BatchCreateChannelMembershipResponse) => void): Request<ChimeSDKMessaging.Types.BatchCreateChannelMembershipResponse, AWSError>;
  /**
   * Adds a specified number of users and bots to a channel. 
   */
  batchCreateChannelMembership(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.BatchCreateChannelMembershipResponse) => void): Request<ChimeSDKMessaging.Types.BatchCreateChannelMembershipResponse, AWSError>;
  /**
   * Calls back Amazon Chime SDK messaging with a processing response message. This should be invoked from the processor Lambda. This is a developer API. You can return one of the following processing responses:   Update message content or metadata   Deny a message   Make no changes to the message  
   */
  channelFlowCallback(params: ChimeSDKMessaging.Types.ChannelFlowCallbackRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ChannelFlowCallbackResponse) => void): Request<ChimeSDKMessaging.Types.ChannelFlowCallbackResponse, AWSError>;
  /**
   * Calls back Amazon Chime SDK messaging with a processing response message. This should be invoked from the processor Lambda. This is a developer API. You can return one of the following processing responses:   Update message content or metadata   Deny a message   Make no changes to the message  
   */
  channelFlowCallback(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ChannelFlowCallbackResponse) => void): Request<ChimeSDKMessaging.Types.ChannelFlowCallbackResponse, AWSError>;
  /**
   * Creates a channel to which you can add users and send messages.  Restriction: You can't change a channel's privacy.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  createChannel(params: ChimeSDKMessaging.Types.CreateChannelRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.CreateChannelResponse) => void): Request<ChimeSDKMessaging.Types.CreateChannelResponse, AWSError>;
  /**
   * Creates a channel to which you can add users and send messages.  Restriction: You can't change a channel's privacy.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  createChannel(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.CreateChannelResponse) => void): Request<ChimeSDKMessaging.Types.CreateChannelResponse, AWSError>;
  /**
   * Permanently bans a member from a channel. Moderators can't add banned members to a channel. To undo a ban, you first have to DeleteChannelBan, and then CreateChannelMembership. Bans are cleaned up when you delete users or channels. If you ban a user who is already part of a channel, that user is automatically kicked from the channel.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  createChannelBan(params: ChimeSDKMessaging.Types.CreateChannelBanRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.CreateChannelBanResponse) => void): Request<ChimeSDKMessaging.Types.CreateChannelBanResponse, AWSError>;
  /**
   * Permanently bans a member from a channel. Moderators can't add banned members to a channel. To undo a ban, you first have to DeleteChannelBan, and then CreateChannelMembership. Bans are cleaned up when you delete users or channels. If you ban a user who is already part of a channel, that user is automatically kicked from the channel.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  createChannelBan(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.CreateChannelBanResponse) => void): Request<ChimeSDKMessaging.Types.CreateChannelBanResponse, AWSError>;
  /**
   * Creates a channel flow, a container for processors. Processors are AWS Lambda functions that perform actions on chat messages, such as stripping out profanity. You can associate channel flows with channels, and the processors in the channel flow then take action on all messages sent to that channel. This is a developer API. Channel flows process the following items:   New and updated messages   Persistent and non-persistent messages   The Standard message type    Channel flows don't process Control or System messages. For more information about the message types provided by Chime SDK messaging, refer to Message types in the Amazon Chime developer guide. 
   */
  createChannelFlow(params: ChimeSDKMessaging.Types.CreateChannelFlowRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.CreateChannelFlowResponse) => void): Request<ChimeSDKMessaging.Types.CreateChannelFlowResponse, AWSError>;
  /**
   * Creates a channel flow, a container for processors. Processors are AWS Lambda functions that perform actions on chat messages, such as stripping out profanity. You can associate channel flows with channels, and the processors in the channel flow then take action on all messages sent to that channel. This is a developer API. Channel flows process the following items:   New and updated messages   Persistent and non-persistent messages   The Standard message type    Channel flows don't process Control or System messages. For more information about the message types provided by Chime SDK messaging, refer to Message types in the Amazon Chime developer guide. 
   */
  createChannelFlow(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.CreateChannelFlowResponse) => void): Request<ChimeSDKMessaging.Types.CreateChannelFlowResponse, AWSError>;
  /**
   * Adds a member to a channel. The InvitedBy field in ChannelMembership is derived from the request header. A channel member can:   List messages   Send messages   Receive messages   Edit their own messages   Leave the channel   Privacy settings impact this action as follows:   Public Channels: You do not need to be a member to list messages, but you must be a member to send messages.   Private Channels: You must be a member to list or send messages.    The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUserArn or AppInstanceBot that makes the API call as the value in the header. 
   */
  createChannelMembership(params: ChimeSDKMessaging.Types.CreateChannelMembershipRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.CreateChannelMembershipResponse) => void): Request<ChimeSDKMessaging.Types.CreateChannelMembershipResponse, AWSError>;
  /**
   * Adds a member to a channel. The InvitedBy field in ChannelMembership is derived from the request header. A channel member can:   List messages   Send messages   Receive messages   Edit their own messages   Leave the channel   Privacy settings impact this action as follows:   Public Channels: You do not need to be a member to list messages, but you must be a member to send messages.   Private Channels: You must be a member to list or send messages.    The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUserArn or AppInstanceBot that makes the API call as the value in the header. 
   */
  createChannelMembership(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.CreateChannelMembershipResponse) => void): Request<ChimeSDKMessaging.Types.CreateChannelMembershipResponse, AWSError>;
  /**
   * Creates a new ChannelModerator. A channel moderator can:   Add and remove other members of the channel.   Add and remove other moderators of the channel.   Add and remove user bans for the channel.   Redact messages in the channel.   List messages in the channel.    The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBotof the user that makes the API call as the value in the header. 
   */
  createChannelModerator(params: ChimeSDKMessaging.Types.CreateChannelModeratorRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.CreateChannelModeratorResponse) => void): Request<ChimeSDKMessaging.Types.CreateChannelModeratorResponse, AWSError>;
  /**
   * Creates a new ChannelModerator. A channel moderator can:   Add and remove other members of the channel.   Add and remove other moderators of the channel.   Add and remove user bans for the channel.   Redact messages in the channel.   List messages in the channel.    The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBotof the user that makes the API call as the value in the header. 
   */
  createChannelModerator(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.CreateChannelModeratorResponse) => void): Request<ChimeSDKMessaging.Types.CreateChannelModeratorResponse, AWSError>;
  /**
   * Immediately makes a channel and its memberships inaccessible and marks them for deletion. This is an irreversible process.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUserArn or AppInstanceBot that makes the API call as the value in the header. 
   */
  deleteChannel(params: ChimeSDKMessaging.Types.DeleteChannelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Immediately makes a channel and its memberships inaccessible and marks them for deletion. This is an irreversible process.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUserArn or AppInstanceBot that makes the API call as the value in the header. 
   */
  deleteChannel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a member from a channel's ban list.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  deleteChannelBan(params: ChimeSDKMessaging.Types.DeleteChannelBanRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a member from a channel's ban list.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  deleteChannelBan(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a channel flow, an irreversible process. This is a developer API.   This API works only when the channel flow is not associated with any channel. To get a list of all channels that a channel flow is associated with, use the ListChannelsAssociatedWithChannelFlow API. Use the DisassociateChannelFlow API to disassociate a channel flow from all channels.  
   */
  deleteChannelFlow(params: ChimeSDKMessaging.Types.DeleteChannelFlowRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a channel flow, an irreversible process. This is a developer API.   This API works only when the channel flow is not associated with any channel. To get a list of all channels that a channel flow is associated with, use the ListChannelsAssociatedWithChannelFlow API. Use the DisassociateChannelFlow API to disassociate a channel flow from all channels.  
   */
  deleteChannelFlow(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a member from a channel.  The x-amz-chime-bearer request header is mandatory. Use the AppInstanceUserArn of the user that makes the API call as the value in the header. 
   */
  deleteChannelMembership(params: ChimeSDKMessaging.Types.DeleteChannelMembershipRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a member from a channel.  The x-amz-chime-bearer request header is mandatory. Use the AppInstanceUserArn of the user that makes the API call as the value in the header. 
   */
  deleteChannelMembership(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a channel message. Only admins can perform this action. Deletion makes messages inaccessible immediately. A background process deletes any revisions created by UpdateChannelMessage.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  deleteChannelMessage(params: ChimeSDKMessaging.Types.DeleteChannelMessageRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a channel message. Only admins can perform this action. Deletion makes messages inaccessible immediately. A background process deletes any revisions created by UpdateChannelMessage.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  deleteChannelMessage(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a channel moderator.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  deleteChannelModerator(params: ChimeSDKMessaging.Types.DeleteChannelModeratorRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a channel moderator.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  deleteChannelModerator(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the streaming configurations for an AppInstance. For more information, see Streaming messaging data in the Amazon Chime SDK Developer Guide.
   */
  deleteMessagingStreamingConfigurations(params: ChimeSDKMessaging.Types.DeleteMessagingStreamingConfigurationsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the streaming configurations for an AppInstance. For more information, see Streaming messaging data in the Amazon Chime SDK Developer Guide.
   */
  deleteMessagingStreamingConfigurations(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Returns the full details of a channel in an Amazon Chime AppInstance.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  describeChannel(params: ChimeSDKMessaging.Types.DescribeChannelRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.DescribeChannelResponse) => void): Request<ChimeSDKMessaging.Types.DescribeChannelResponse, AWSError>;
  /**
   * Returns the full details of a channel in an Amazon Chime AppInstance.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  describeChannel(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.DescribeChannelResponse) => void): Request<ChimeSDKMessaging.Types.DescribeChannelResponse, AWSError>;
  /**
   * Returns the full details of a channel ban.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  describeChannelBan(params: ChimeSDKMessaging.Types.DescribeChannelBanRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.DescribeChannelBanResponse) => void): Request<ChimeSDKMessaging.Types.DescribeChannelBanResponse, AWSError>;
  /**
   * Returns the full details of a channel ban.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  describeChannelBan(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.DescribeChannelBanResponse) => void): Request<ChimeSDKMessaging.Types.DescribeChannelBanResponse, AWSError>;
  /**
   * Returns the full details of a channel flow in an Amazon Chime AppInstance. This is a developer API.
   */
  describeChannelFlow(params: ChimeSDKMessaging.Types.DescribeChannelFlowRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.DescribeChannelFlowResponse) => void): Request<ChimeSDKMessaging.Types.DescribeChannelFlowResponse, AWSError>;
  /**
   * Returns the full details of a channel flow in an Amazon Chime AppInstance. This is a developer API.
   */
  describeChannelFlow(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.DescribeChannelFlowResponse) => void): Request<ChimeSDKMessaging.Types.DescribeChannelFlowResponse, AWSError>;
  /**
   * Returns the full details of a user's channel membership.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  describeChannelMembership(params: ChimeSDKMessaging.Types.DescribeChannelMembershipRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.DescribeChannelMembershipResponse) => void): Request<ChimeSDKMessaging.Types.DescribeChannelMembershipResponse, AWSError>;
  /**
   * Returns the full details of a user's channel membership.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  describeChannelMembership(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.DescribeChannelMembershipResponse) => void): Request<ChimeSDKMessaging.Types.DescribeChannelMembershipResponse, AWSError>;
  /**
   *  Returns the details of a channel based on the membership of the specified AppInstanceUser or AppInstanceBot.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  describeChannelMembershipForAppInstanceUser(params: ChimeSDKMessaging.Types.DescribeChannelMembershipForAppInstanceUserRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.DescribeChannelMembershipForAppInstanceUserResponse) => void): Request<ChimeSDKMessaging.Types.DescribeChannelMembershipForAppInstanceUserResponse, AWSError>;
  /**
   *  Returns the details of a channel based on the membership of the specified AppInstanceUser or AppInstanceBot.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  describeChannelMembershipForAppInstanceUser(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.DescribeChannelMembershipForAppInstanceUserResponse) => void): Request<ChimeSDKMessaging.Types.DescribeChannelMembershipForAppInstanceUserResponse, AWSError>;
  /**
   * Returns the full details of a channel moderated by the specified AppInstanceUser or AppInstanceBot.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  describeChannelModeratedByAppInstanceUser(params: ChimeSDKMessaging.Types.DescribeChannelModeratedByAppInstanceUserRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.DescribeChannelModeratedByAppInstanceUserResponse) => void): Request<ChimeSDKMessaging.Types.DescribeChannelModeratedByAppInstanceUserResponse, AWSError>;
  /**
   * Returns the full details of a channel moderated by the specified AppInstanceUser or AppInstanceBot.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  describeChannelModeratedByAppInstanceUser(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.DescribeChannelModeratedByAppInstanceUserResponse) => void): Request<ChimeSDKMessaging.Types.DescribeChannelModeratedByAppInstanceUserResponse, AWSError>;
  /**
   * Returns the full details of a single ChannelModerator.  The x-amz-chime-bearer request header is mandatory. Use the AppInstanceUserArn of the user that makes the API call as the value in the header. 
   */
  describeChannelModerator(params: ChimeSDKMessaging.Types.DescribeChannelModeratorRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.DescribeChannelModeratorResponse) => void): Request<ChimeSDKMessaging.Types.DescribeChannelModeratorResponse, AWSError>;
  /**
   * Returns the full details of a single ChannelModerator.  The x-amz-chime-bearer request header is mandatory. Use the AppInstanceUserArn of the user that makes the API call as the value in the header. 
   */
  describeChannelModerator(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.DescribeChannelModeratorResponse) => void): Request<ChimeSDKMessaging.Types.DescribeChannelModeratorResponse, AWSError>;
  /**
   * Disassociates a channel flow from all its channels. Once disassociated, all messages to that channel stop going through the channel flow processor.  Only administrators or channel moderators can disassociate a channel flow. The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  disassociateChannelFlow(params: ChimeSDKMessaging.Types.DisassociateChannelFlowRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociates a channel flow from all its channels. Once disassociated, all messages to that channel stop going through the channel flow processor.  Only administrators or channel moderators can disassociate a channel flow. The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  disassociateChannelFlow(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets the membership preferences of an AppInstanceUser or AppInstanceBot for the specified channel. A user or a bot must be a member of the channel and own the membership in order to retrieve membership preferences. Users or bots in the AppInstanceAdmin and channel moderator roles can't retrieve preferences for other users or bots. Banned users or bots can't retrieve membership preferences for the channel from which they are banned.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  getChannelMembershipPreferences(params: ChimeSDKMessaging.Types.GetChannelMembershipPreferencesRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.GetChannelMembershipPreferencesResponse) => void): Request<ChimeSDKMessaging.Types.GetChannelMembershipPreferencesResponse, AWSError>;
  /**
   * Gets the membership preferences of an AppInstanceUser or AppInstanceBot for the specified channel. A user or a bot must be a member of the channel and own the membership in order to retrieve membership preferences. Users or bots in the AppInstanceAdmin and channel moderator roles can't retrieve preferences for other users or bots. Banned users or bots can't retrieve membership preferences for the channel from which they are banned.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  getChannelMembershipPreferences(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.GetChannelMembershipPreferencesResponse) => void): Request<ChimeSDKMessaging.Types.GetChannelMembershipPreferencesResponse, AWSError>;
  /**
   * Gets the full details of a channel message.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  getChannelMessage(params: ChimeSDKMessaging.Types.GetChannelMessageRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.GetChannelMessageResponse) => void): Request<ChimeSDKMessaging.Types.GetChannelMessageResponse, AWSError>;
  /**
   * Gets the full details of a channel message.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  getChannelMessage(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.GetChannelMessageResponse) => void): Request<ChimeSDKMessaging.Types.GetChannelMessageResponse, AWSError>;
  /**
   * Gets message status for a specified messageId. Use this API to determine the intermediate status of messages going through channel flow processing. The API provides an alternative to retrieving message status if the event was not received because a client wasn't connected to a websocket.  Messages can have any one of these statuses.  SENT  Message processed successfully  PENDING  Ongoing processing  FAILED  Processing failed  DENIED  Message denied by the processor      This API does not return statuses for denied messages, because we don't store them once the processor denies them.    Only the message sender can invoke this API.   The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header.   
   */
  getChannelMessageStatus(params: ChimeSDKMessaging.Types.GetChannelMessageStatusRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.GetChannelMessageStatusResponse) => void): Request<ChimeSDKMessaging.Types.GetChannelMessageStatusResponse, AWSError>;
  /**
   * Gets message status for a specified messageId. Use this API to determine the intermediate status of messages going through channel flow processing. The API provides an alternative to retrieving message status if the event was not received because a client wasn't connected to a websocket.  Messages can have any one of these statuses.  SENT  Message processed successfully  PENDING  Ongoing processing  FAILED  Processing failed  DENIED  Message denied by the processor      This API does not return statuses for denied messages, because we don't store them once the processor denies them.    Only the message sender can invoke this API.   The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header.   
   */
  getChannelMessageStatus(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.GetChannelMessageStatusResponse) => void): Request<ChimeSDKMessaging.Types.GetChannelMessageStatusResponse, AWSError>;
  /**
   * The details of the endpoint for the messaging session.
   */
  getMessagingSessionEndpoint(params: ChimeSDKMessaging.Types.GetMessagingSessionEndpointRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.GetMessagingSessionEndpointResponse) => void): Request<ChimeSDKMessaging.Types.GetMessagingSessionEndpointResponse, AWSError>;
  /**
   * The details of the endpoint for the messaging session.
   */
  getMessagingSessionEndpoint(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.GetMessagingSessionEndpointResponse) => void): Request<ChimeSDKMessaging.Types.GetMessagingSessionEndpointResponse, AWSError>;
  /**
   * Retrieves the data streaming configuration for an AppInstance. For more information, see Streaming messaging data in the Amazon Chime SDK Developer Guide.
   */
  getMessagingStreamingConfigurations(params: ChimeSDKMessaging.Types.GetMessagingStreamingConfigurationsRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.GetMessagingStreamingConfigurationsResponse) => void): Request<ChimeSDKMessaging.Types.GetMessagingStreamingConfigurationsResponse, AWSError>;
  /**
   * Retrieves the data streaming configuration for an AppInstance. For more information, see Streaming messaging data in the Amazon Chime SDK Developer Guide.
   */
  getMessagingStreamingConfigurations(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.GetMessagingStreamingConfigurationsResponse) => void): Request<ChimeSDKMessaging.Types.GetMessagingStreamingConfigurationsResponse, AWSError>;
  /**
   * Lists all the users and bots banned from a particular channel.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  listChannelBans(params: ChimeSDKMessaging.Types.ListChannelBansRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelBansResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelBansResponse, AWSError>;
  /**
   * Lists all the users and bots banned from a particular channel.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  listChannelBans(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelBansResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelBansResponse, AWSError>;
  /**
   * Returns a paginated lists of all the channel flows created under a single Chime. This is a developer API.
   */
  listChannelFlows(params: ChimeSDKMessaging.Types.ListChannelFlowsRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelFlowsResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelFlowsResponse, AWSError>;
  /**
   * Returns a paginated lists of all the channel flows created under a single Chime. This is a developer API.
   */
  listChannelFlows(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelFlowsResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelFlowsResponse, AWSError>;
  /**
   * Lists all channel memberships in a channel.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header.  If you want to list the channels to which a specific app instance user belongs, see the ListChannelMembershipsForAppInstanceUser API.
   */
  listChannelMemberships(params: ChimeSDKMessaging.Types.ListChannelMembershipsRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelMembershipsResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelMembershipsResponse, AWSError>;
  /**
   * Lists all channel memberships in a channel.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header.  If you want to list the channels to which a specific app instance user belongs, see the ListChannelMembershipsForAppInstanceUser API.
   */
  listChannelMemberships(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelMembershipsResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelMembershipsResponse, AWSError>;
  /**
   *  Lists all channels that an AppInstanceUser or AppInstanceBot is a part of. Only an AppInstanceAdmin can call the API with a user ARN that is not their own.   The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  listChannelMembershipsForAppInstanceUser(params: ChimeSDKMessaging.Types.ListChannelMembershipsForAppInstanceUserRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelMembershipsForAppInstanceUserResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelMembershipsForAppInstanceUserResponse, AWSError>;
  /**
   *  Lists all channels that an AppInstanceUser or AppInstanceBot is a part of. Only an AppInstanceAdmin can call the API with a user ARN that is not their own.   The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  listChannelMembershipsForAppInstanceUser(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelMembershipsForAppInstanceUserResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelMembershipsForAppInstanceUserResponse, AWSError>;
  /**
   * List all the messages in a channel. Returns a paginated list of ChannelMessages. By default, sorted by creation timestamp in descending order.  Redacted messages appear in the results as empty, since they are only redacted, not deleted. Deleted messages do not appear in the results. This action always returns the latest version of an edited message. Also, the x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  listChannelMessages(params: ChimeSDKMessaging.Types.ListChannelMessagesRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelMessagesResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelMessagesResponse, AWSError>;
  /**
   * List all the messages in a channel. Returns a paginated list of ChannelMessages. By default, sorted by creation timestamp in descending order.  Redacted messages appear in the results as empty, since they are only redacted, not deleted. Deleted messages do not appear in the results. This action always returns the latest version of an edited message. Also, the x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  listChannelMessages(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelMessagesResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelMessagesResponse, AWSError>;
  /**
   * Lists all the moderators for a channel.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  listChannelModerators(params: ChimeSDKMessaging.Types.ListChannelModeratorsRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelModeratorsResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelModeratorsResponse, AWSError>;
  /**
   * Lists all the moderators for a channel.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  listChannelModerators(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelModeratorsResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelModeratorsResponse, AWSError>;
  /**
   * Lists all Channels created under a single Chime App as a paginated list. You can specify filters to narrow results.  Functionality &amp; restrictions    Use privacy = PUBLIC to retrieve all public channels in the account.   Only an AppInstanceAdmin can set privacy = PRIVATE to list the private channels in an account.    The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  listChannels(params: ChimeSDKMessaging.Types.ListChannelsRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelsResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelsResponse, AWSError>;
  /**
   * Lists all Channels created under a single Chime App as a paginated list. You can specify filters to narrow results.  Functionality &amp; restrictions    Use privacy = PUBLIC to retrieve all public channels in the account.   Only an AppInstanceAdmin can set privacy = PRIVATE to list the private channels in an account.    The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  listChannels(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelsResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelsResponse, AWSError>;
  /**
   * Lists all channels associated with a specified channel flow. You can associate a channel flow with multiple channels, but you can only associate a channel with one channel flow. This is a developer API.
   */
  listChannelsAssociatedWithChannelFlow(params: ChimeSDKMessaging.Types.ListChannelsAssociatedWithChannelFlowRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelsAssociatedWithChannelFlowResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelsAssociatedWithChannelFlowResponse, AWSError>;
  /**
   * Lists all channels associated with a specified channel flow. You can associate a channel flow with multiple channels, but you can only associate a channel with one channel flow. This is a developer API.
   */
  listChannelsAssociatedWithChannelFlow(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelsAssociatedWithChannelFlowResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelsAssociatedWithChannelFlowResponse, AWSError>;
  /**
   * A list of the channels moderated by an AppInstanceUser.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  listChannelsModeratedByAppInstanceUser(params: ChimeSDKMessaging.Types.ListChannelsModeratedByAppInstanceUserRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelsModeratedByAppInstanceUserResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelsModeratedByAppInstanceUserResponse, AWSError>;
  /**
   * A list of the channels moderated by an AppInstanceUser.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  listChannelsModeratedByAppInstanceUser(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListChannelsModeratedByAppInstanceUserResponse) => void): Request<ChimeSDKMessaging.Types.ListChannelsModeratedByAppInstanceUserResponse, AWSError>;
  /**
   * Lists all the SubChannels in an elastic channel when given a channel ID. Available only to the app instance admins and channel moderators of elastic channels.
   */
  listSubChannels(params: ChimeSDKMessaging.Types.ListSubChannelsRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListSubChannelsResponse) => void): Request<ChimeSDKMessaging.Types.ListSubChannelsResponse, AWSError>;
  /**
   * Lists all the SubChannels in an elastic channel when given a channel ID. Available only to the app instance admins and channel moderators of elastic channels.
   */
  listSubChannels(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListSubChannelsResponse) => void): Request<ChimeSDKMessaging.Types.ListSubChannelsResponse, AWSError>;
  /**
   * Lists the tags applied to an Amazon Chime SDK messaging resource.
   */
  listTagsForResource(params: ChimeSDKMessaging.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListTagsForResourceResponse) => void): Request<ChimeSDKMessaging.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags applied to an Amazon Chime SDK messaging resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.ListTagsForResourceResponse) => void): Request<ChimeSDKMessaging.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Sets the number of days before the channel is automatically deleted.    A background process deletes expired channels within 6 hours of expiration. Actual deletion times may vary.   Expired channels that have not yet been deleted appear as active, and you can update their expiration settings. The system honors the new settings.   The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header.   
   */
  putChannelExpirationSettings(params: ChimeSDKMessaging.Types.PutChannelExpirationSettingsRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.PutChannelExpirationSettingsResponse) => void): Request<ChimeSDKMessaging.Types.PutChannelExpirationSettingsResponse, AWSError>;
  /**
   * Sets the number of days before the channel is automatically deleted.    A background process deletes expired channels within 6 hours of expiration. Actual deletion times may vary.   Expired channels that have not yet been deleted appear as active, and you can update their expiration settings. The system honors the new settings.   The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header.   
   */
  putChannelExpirationSettings(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.PutChannelExpirationSettingsResponse) => void): Request<ChimeSDKMessaging.Types.PutChannelExpirationSettingsResponse, AWSError>;
  /**
   * Sets the membership preferences of an AppInstanceUser or AppInstanceBot for the specified channel. The user or bot must be a member of the channel. Only the user or bot who owns the membership can set preferences. Users or bots in the AppInstanceAdmin and channel moderator roles can't set preferences for other users. Banned users or bots can't set membership preferences for the channel from which they are banned.  The x-amz-chime-bearer request header is mandatory. Use the ARN of an AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  putChannelMembershipPreferences(params: ChimeSDKMessaging.Types.PutChannelMembershipPreferencesRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.PutChannelMembershipPreferencesResponse) => void): Request<ChimeSDKMessaging.Types.PutChannelMembershipPreferencesResponse, AWSError>;
  /**
   * Sets the membership preferences of an AppInstanceUser or AppInstanceBot for the specified channel. The user or bot must be a member of the channel. Only the user or bot who owns the membership can set preferences. Users or bots in the AppInstanceAdmin and channel moderator roles can't set preferences for other users. Banned users or bots can't set membership preferences for the channel from which they are banned.  The x-amz-chime-bearer request header is mandatory. Use the ARN of an AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  putChannelMembershipPreferences(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.PutChannelMembershipPreferencesResponse) => void): Request<ChimeSDKMessaging.Types.PutChannelMembershipPreferencesResponse, AWSError>;
  /**
   * Sets the data streaming configuration for an AppInstance. For more information, see Streaming messaging data in the Amazon Chime SDK Developer Guide.
   */
  putMessagingStreamingConfigurations(params: ChimeSDKMessaging.Types.PutMessagingStreamingConfigurationsRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.PutMessagingStreamingConfigurationsResponse) => void): Request<ChimeSDKMessaging.Types.PutMessagingStreamingConfigurationsResponse, AWSError>;
  /**
   * Sets the data streaming configuration for an AppInstance. For more information, see Streaming messaging data in the Amazon Chime SDK Developer Guide.
   */
  putMessagingStreamingConfigurations(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.PutMessagingStreamingConfigurationsResponse) => void): Request<ChimeSDKMessaging.Types.PutMessagingStreamingConfigurationsResponse, AWSError>;
  /**
   * Redacts message content, but not metadata. The message exists in the back end, but the action returns null content, and the state shows as redacted.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  redactChannelMessage(params: ChimeSDKMessaging.Types.RedactChannelMessageRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.RedactChannelMessageResponse) => void): Request<ChimeSDKMessaging.Types.RedactChannelMessageResponse, AWSError>;
  /**
   * Redacts message content, but not metadata. The message exists in the back end, but the action returns null content, and the state shows as redacted.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  redactChannelMessage(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.RedactChannelMessageResponse) => void): Request<ChimeSDKMessaging.Types.RedactChannelMessageResponse, AWSError>;
  /**
   * Allows the ChimeBearer to search channels by channel members. Users or bots can search across the channels that they belong to. Users in the AppInstanceAdmin role can search across all channels. The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header.
   */
  searchChannels(params: ChimeSDKMessaging.Types.SearchChannelsRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.SearchChannelsResponse) => void): Request<ChimeSDKMessaging.Types.SearchChannelsResponse, AWSError>;
  /**
   * Allows the ChimeBearer to search channels by channel members. Users or bots can search across the channels that they belong to. Users in the AppInstanceAdmin role can search across all channels. The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header.
   */
  searchChannels(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.SearchChannelsResponse) => void): Request<ChimeSDKMessaging.Types.SearchChannelsResponse, AWSError>;
  /**
   * Sends a message to a particular channel that the member is a part of.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. Also, STANDARD messages can be up to 4KB in size and contain metadata. Metadata is arbitrary, and you can use it in a variety of ways, such as containing a link to an attachment.  CONTROL messages are limited to 30 bytes and do not contain metadata. 
   */
  sendChannelMessage(params: ChimeSDKMessaging.Types.SendChannelMessageRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.SendChannelMessageResponse) => void): Request<ChimeSDKMessaging.Types.SendChannelMessageResponse, AWSError>;
  /**
   * Sends a message to a particular channel that the member is a part of.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. Also, STANDARD messages can be up to 4KB in size and contain metadata. Metadata is arbitrary, and you can use it in a variety of ways, such as containing a link to an attachment.  CONTROL messages are limited to 30 bytes and do not contain metadata. 
   */
  sendChannelMessage(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.SendChannelMessageResponse) => void): Request<ChimeSDKMessaging.Types.SendChannelMessageResponse, AWSError>;
  /**
   * Applies the specified tags to the specified Amazon Chime SDK messaging resource.
   */
  tagResource(params: ChimeSDKMessaging.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Applies the specified tags to the specified Amazon Chime SDK messaging resource.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the specified Amazon Chime SDK messaging resource.
   */
  untagResource(params: ChimeSDKMessaging.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the specified Amazon Chime SDK messaging resource.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Update a channel's attributes.  Restriction: You can't change a channel's privacy.   The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  updateChannel(params: ChimeSDKMessaging.Types.UpdateChannelRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.UpdateChannelResponse) => void): Request<ChimeSDKMessaging.Types.UpdateChannelResponse, AWSError>;
  /**
   * Update a channel's attributes.  Restriction: You can't change a channel's privacy.   The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  updateChannel(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.UpdateChannelResponse) => void): Request<ChimeSDKMessaging.Types.UpdateChannelResponse, AWSError>;
  /**
   * Updates channel flow attributes. This is a developer API.
   */
  updateChannelFlow(params: ChimeSDKMessaging.Types.UpdateChannelFlowRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.UpdateChannelFlowResponse) => void): Request<ChimeSDKMessaging.Types.UpdateChannelFlowResponse, AWSError>;
  /**
   * Updates channel flow attributes. This is a developer API.
   */
  updateChannelFlow(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.UpdateChannelFlowResponse) => void): Request<ChimeSDKMessaging.Types.UpdateChannelFlowResponse, AWSError>;
  /**
   * Updates the content of a message.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  updateChannelMessage(params: ChimeSDKMessaging.Types.UpdateChannelMessageRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.UpdateChannelMessageResponse) => void): Request<ChimeSDKMessaging.Types.UpdateChannelMessageResponse, AWSError>;
  /**
   * Updates the content of a message.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  updateChannelMessage(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.UpdateChannelMessageResponse) => void): Request<ChimeSDKMessaging.Types.UpdateChannelMessageResponse, AWSError>;
  /**
   * The details of the time when a user last read messages in a channel.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  updateChannelReadMarker(params: ChimeSDKMessaging.Types.UpdateChannelReadMarkerRequest, callback?: (err: AWSError, data: ChimeSDKMessaging.Types.UpdateChannelReadMarkerResponse) => void): Request<ChimeSDKMessaging.Types.UpdateChannelReadMarkerResponse, AWSError>;
  /**
   * The details of the time when a user last read messages in a channel.  The x-amz-chime-bearer request header is mandatory. Use the ARN of the AppInstanceUser or AppInstanceBot that makes the API call as the value in the header. 
   */
  updateChannelReadMarker(callback?: (err: AWSError, data: ChimeSDKMessaging.Types.UpdateChannelReadMarkerResponse) => void): Request<ChimeSDKMessaging.Types.UpdateChannelReadMarkerResponse, AWSError>;
}
declare namespace ChimeSDKMessaging {
  export type AllowNotifications = "ALL"|"NONE"|"FILTERED"|string;
  export interface AppInstanceUserMembershipSummary {
    /**
     * The type of ChannelMembership.
     */
    Type?: ChannelMembershipType;
    /**
     * The time at which an AppInstanceUser last marked a channel as read.
     */
    ReadMarkerTimestamp?: Timestamp;
    /**
     * The ID of the SubChannel that the AppInstanceUser is a member of.
     */
    SubChannelId?: SubChannelId;
  }
  export interface AssociateChannelFlowRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The ARN of the channel flow.
     */
    ChannelFlowArn: ChimeArn;
    /**
     * The AppInstanceUserArn of the user making the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface BatchChannelMemberships {
    /**
     * The identifier of the member who invited another member.
     */
    InvitedBy?: Identity;
    /**
     * The membership types set for the channel members.
     */
    Type?: ChannelMembershipType;
    /**
     * The users successfully added to the request.
     */
    Members?: Members;
    /**
     * The ARN of the channel to which you're adding members.
     */
    ChannelArn?: ChimeArn;
    /**
     * The ID of the SubChannel.
     */
    SubChannelId?: SubChannelId;
  }
  export interface BatchCreateChannelMembershipError {
    /**
     * The AppInstanceUserArn of the member that the service couldn't add.
     */
    MemberArn?: ChimeArn;
    /**
     * The error code.
     */
    ErrorCode?: ErrorCode;
    /**
     * The error message.
     */
    ErrorMessage?: String;
  }
  export type BatchCreateChannelMembershipErrors = BatchCreateChannelMembershipError[];
  export interface BatchCreateChannelMembershipRequest {
    /**
     * The ARN of the channel to which you're adding users or bots.
     */
    ChannelArn: ChimeArn;
    /**
     * The membership type of a user, DEFAULT or HIDDEN. Default members are always returned as part of ListChannelMemberships. Hidden members are only returned if the type filter in ListChannelMemberships equals HIDDEN. Otherwise hidden members are not returned. This is only supported by moderators.
     */
    Type?: ChannelMembershipType;
    /**
     * The ARNs of the members you want to add to the channel. Only AppInstanceUsers and AppInstanceBots can be added as a channel member.
     */
    MemberArns: MemberArns;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
    /**
     * The ID of the SubChannel in the request.   Only required when creating membership in a SubChannel for a moderator in an elastic channel. 
     */
    SubChannelId?: SubChannelId;
  }
  export interface BatchCreateChannelMembershipResponse {
    /**
     * The list of channel memberships in the response.
     */
    BatchChannelMemberships?: BatchChannelMemberships;
    /**
     * If the action fails for one or more of the memberships in the request, a list of the memberships is returned, along with error codes and error messages.
     */
    Errors?: BatchCreateChannelMembershipErrors;
  }
  export type CallbackIdType = string;
  export interface Channel {
    /**
     * The name of a channel.
     */
    Name?: NonEmptyResourceName;
    /**
     * The ARN of a channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The mode of the channel.
     */
    Mode?: ChannelMode;
    /**
     * The channel's privacy setting.
     */
    Privacy?: ChannelPrivacy;
    /**
     * The channel's metadata.
     */
    Metadata?: Metadata;
    /**
     * The AppInstanceUser who created the channel.
     */
    CreatedBy?: Identity;
    /**
     * The time at which the AppInstanceUser created the channel.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * The time at which a member sent the last message in the channel.
     */
    LastMessageTimestamp?: Timestamp;
    /**
     * The time at which a channel was last updated.
     */
    LastUpdatedTimestamp?: Timestamp;
    /**
     * The ARN of the channel flow.
     */
    ChannelFlowArn?: ChimeArn;
    /**
     * The attributes required to configure and create an elastic channel. An elastic channel can support a maximum of 1-million members.
     */
    ElasticChannelConfiguration?: ElasticChannelConfiguration;
    /**
     * Settings that control when a channel expires.
     */
    ExpirationSettings?: ExpirationSettings;
  }
  export interface ChannelAssociatedWithFlowSummary {
    /**
     * The name of the channel flow.
     */
    Name?: NonEmptyResourceName;
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The mode of the channel.
     */
    Mode?: ChannelMode;
    /**
     * The channel's privacy setting.
     */
    Privacy?: ChannelPrivacy;
    /**
     * The channel's metadata.
     */
    Metadata?: Metadata;
  }
  export type ChannelAssociatedWithFlowSummaryList = ChannelAssociatedWithFlowSummary[];
  export interface ChannelBan {
    /**
     * The member being banned from the channel.
     */
    Member?: Identity;
    /**
     * The ARN of the channel from which a member is being banned.
     */
    ChannelArn?: ChimeArn;
    /**
     * The time at which the ban was created.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * The AppInstanceUser who created the ban.
     */
    CreatedBy?: Identity;
  }
  export interface ChannelBanSummary {
    /**
     * The member being banned from a channel.
     */
    Member?: Identity;
  }
  export type ChannelBanSummaryList = ChannelBanSummary[];
  export interface ChannelFlow {
    /**
     * The ARN of the channel flow.
     */
    ChannelFlowArn?: ChimeArn;
    /**
     * Information about the processor Lambda functions.
     */
    Processors?: ProcessorList;
    /**
     * The name of the channel flow.
     */
    Name?: NonEmptyResourceName;
    /**
     * The time at which the channel flow was created.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * The time at which a channel flow was updated.
     */
    LastUpdatedTimestamp?: Timestamp;
  }
  export interface ChannelFlowCallbackRequest {
    /**
     * The identifier passed to the processor by the service when invoked. Use the identifier to call back the service.
     */
    CallbackId: CallbackIdType;
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * When a processor determines that a message needs to be DENIED, pass this parameter with a value of true.
     */
    DeleteResource?: NonNullableBoolean;
    /**
     * Stores information about the processed message.
     */
    ChannelMessage: ChannelMessageCallback;
  }
  export interface ChannelFlowCallbackResponse {
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The call back ID passed in the request.
     */
    CallbackId?: CallbackIdType;
  }
  export type ChannelFlowExecutionOrder = number;
  export interface ChannelFlowSummary {
    /**
     * The ARN of the channel flow.
     */
    ChannelFlowArn?: ChimeArn;
    /**
     * The name of the channel flow.
     */
    Name?: NonEmptyResourceName;
    /**
     * Information about the processor Lambda functions.
     */
    Processors?: ProcessorList;
  }
  export type ChannelFlowSummaryList = ChannelFlowSummary[];
  export type ChannelId = string;
  export type ChannelMemberArns = ChimeArn[];
  export interface ChannelMembership {
    /**
     * The identifier of the member who invited another member.
     */
    InvitedBy?: Identity;
    /**
     * The membership type set for the channel member.
     */
    Type?: ChannelMembershipType;
    /**
     * The data of the channel member.
     */
    Member?: Identity;
    /**
     * The ARN of the member's channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The time at which the channel membership was created.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * The time at which a channel membership was last updated.
     */
    LastUpdatedTimestamp?: Timestamp;
    /**
     * The ID of the SubChannel that a user belongs to.
     */
    SubChannelId?: SubChannelId;
  }
  export interface ChannelMembershipForAppInstanceUserSummary {
    /**
     * Returns the channel data for an AppInstance.
     */
    ChannelSummary?: ChannelSummary;
    /**
     * Returns the channel membership data for an AppInstance.
     */
    AppInstanceUserMembershipSummary?: AppInstanceUserMembershipSummary;
  }
  export type ChannelMembershipForAppInstanceUserSummaryList = ChannelMembershipForAppInstanceUserSummary[];
  export interface ChannelMembershipPreferences {
    /**
     * The push notification configuration of a message.
     */
    PushNotifications?: PushNotificationPreferences;
  }
  export interface ChannelMembershipSummary {
    /**
     * A member's summary data.
     */
    Member?: Identity;
  }
  export type ChannelMembershipSummaryList = ChannelMembershipSummary[];
  export type ChannelMembershipType = "DEFAULT"|"HIDDEN"|string;
  export interface ChannelMessage {
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The ID of a message.
     */
    MessageId?: MessageId;
    /**
     * The content of the channel message. For Amazon Lex V2 bot responses, this field holds a list of messages originating from the bot. For more information, refer to Processing responses from an AppInstanceBot in the Amazon Chime SDK Messaging Developer Guide.
     */
    Content?: Content;
    /**
     * The message metadata.
     */
    Metadata?: Metadata;
    /**
     * The message type.
     */
    Type?: ChannelMessageType;
    /**
     * The time at which the message was created.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * The time at which a message was edited.
     */
    LastEditedTimestamp?: Timestamp;
    /**
     * The time at which a message was updated.
     */
    LastUpdatedTimestamp?: Timestamp;
    /**
     * The message sender.
     */
    Sender?: Identity;
    /**
     * Hides the content of a message.
     */
    Redacted?: NonNullableBoolean;
    /**
     * The persistence setting for a channel message.
     */
    Persistence?: ChannelMessagePersistenceType;
    /**
     * The status of the channel message.
     */
    Status?: ChannelMessageStatusStructure;
    /**
     * The attributes for the channel message. For Amazon Lex V2 bot responses, the attributes are mapped to specific fields from the bot. For more information, refer to Processing responses from an AppInstanceBot in the Amazon Chime SDK Messaging Developer Guide.
     */
    MessageAttributes?: MessageAttributeMap;
    /**
     * The ID of the SubChannel.
     */
    SubChannelId?: SubChannelId;
    /**
     * The content type of the channel message. For Amazon Lex V2 bot responses, the content type is application/amz-chime-lex-msgs for success responses and application/amz-chime-lex-error for failure responses. For more information, refer to Processing responses from an AppInstanceBot in the Amazon Chime SDK Messaging Developer Guide.
     */
    ContentType?: ContentType;
    /**
     * The target of a message, a sender, a user, or a bot. Only the target and the sender can view targeted messages. Only users who can see targeted messages can take actions on them. However, administrators can delete targeted messages that they can’t see.
     */
    Target?: TargetList;
  }
  export interface ChannelMessageCallback {
    /**
     * The message ID.
     */
    MessageId: MessageId;
    /**
     * The message content. For Amazon Lex V2 bot responses, this field holds a list of messages originating from the bot. For more information, refer to Processing responses from an AppInstanceBot in the Amazon Chime SDK Messaging Developer Guide.
     */
    Content?: NonEmptyContent;
    /**
     * The message metadata.
     */
    Metadata?: Metadata;
    /**
     * The push notification configuration of the message.
     */
    PushNotification?: PushNotificationConfiguration;
    /**
     * The attributes for the channel message. For Amazon Lex V2 bot responses, the attributes are mapped to specific fields from the bot. For more information, refer to Processing responses from an AppInstanceBot in the Amazon Chime SDK Messaging Developer Guide.
     */
    MessageAttributes?: MessageAttributeMap;
    /**
     * The ID of the SubChannel.
     */
    SubChannelId?: SubChannelId;
    /**
     * The content type of the call-back message. For Amazon Lex V2 bot responses, the content type is application/amz-chime-lex-msgs for success responses and application/amz-chime-lex-error for failure responses. For more information, refer to Processing responses from an AppInstanceBot in the Amazon Chime SDK Messaging Developer Guide.
     */
    ContentType?: ContentType;
  }
  export type ChannelMessagePersistenceType = "PERSISTENT"|"NON_PERSISTENT"|string;
  export type ChannelMessageStatus = "SENT"|"PENDING"|"FAILED"|"DENIED"|string;
  export interface ChannelMessageStatusStructure {
    /**
     * The message status value.
     */
    Value?: ChannelMessageStatus;
    /**
     * Contains more details about the message status.
     */
    Detail?: StatusDetail;
  }
  export interface ChannelMessageSummary {
    /**
     * The ID of the message.
     */
    MessageId?: MessageId;
    /**
     * The content of the channel message. For Amazon Lex V2 bot responses, this field holds a list of messages originating from the bot. For more information, refer to Processing responses from an AppInstanceBot in the Amazon Chime SDK Messaging Developer Guide.
     */
    Content?: Content;
    /**
     * The metadata of the message.
     */
    Metadata?: Metadata;
    /**
     * The type of message.
     */
    Type?: ChannelMessageType;
    /**
     * The time at which the message summary was created.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * The time at which a message was last updated.
     */
    LastUpdatedTimestamp?: Timestamp;
    /**
     * The time at which a message was last edited.
     */
    LastEditedTimestamp?: Timestamp;
    /**
     * The message sender.
     */
    Sender?: Identity;
    /**
     * Indicates whether a message was redacted.
     */
    Redacted?: NonNullableBoolean;
    /**
     * The message status. The status value is SENT for messages sent to a channel without a channel flow. For channels associated with channel flow, the value determines the processing stage.
     */
    Status?: ChannelMessageStatusStructure;
    /**
     * The attributes for the channel message. For Amazon Lex V2 bot responses, the attributes are mapped to specific fields from the bot. For more information, refer to Processing responses from an AppInstanceBot in the Amazon Chime SDK Messaging Developer Guide.
     */
    MessageAttributes?: MessageAttributeMap;
    /**
     * The content type of the channel message listed in the summary. For Amazon Lex V2 bot responses, the content type is application/amz-chime-lex-msgs for success responses and application/amz-chime-lex-error for failure responses. For more information, refer to Processing responses from an AppInstanceBot in the Amazon Chime SDK Messaging Developer Guide.
     */
    ContentType?: ContentType;
    /**
     * The target of a message, a sender, a user, or a bot. Only the target and the sender can view targeted messages. Only users who can see targeted messages can take actions on them. However, administrators can delete targeted messages that they can’t see.
     */
    Target?: TargetList;
  }
  export type ChannelMessageSummaryList = ChannelMessageSummary[];
  export type ChannelMessageType = "STANDARD"|"CONTROL"|string;
  export type ChannelMode = "UNRESTRICTED"|"RESTRICTED"|string;
  export interface ChannelModeratedByAppInstanceUserSummary {
    /**
     * Summary of the details of a Channel.
     */
    ChannelSummary?: ChannelSummary;
  }
  export type ChannelModeratedByAppInstanceUserSummaryList = ChannelModeratedByAppInstanceUserSummary[];
  export interface ChannelModerator {
    /**
     * The moderator's data.
     */
    Moderator?: Identity;
    /**
     * The ARN of the moderator's channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The time at which the moderator was created.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * The AppInstanceUser who created the moderator.
     */
    CreatedBy?: Identity;
  }
  export type ChannelModeratorArns = ChimeArn[];
  export interface ChannelModeratorSummary {
    /**
     * The data for a moderator.
     */
    Moderator?: Identity;
  }
  export type ChannelModeratorSummaryList = ChannelModeratorSummary[];
  export type ChannelPrivacy = "PUBLIC"|"PRIVATE"|string;
  export interface ChannelSummary {
    /**
     * The name of the channel.
     */
    Name?: NonEmptyResourceName;
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The mode of the channel.
     */
    Mode?: ChannelMode;
    /**
     * The privacy setting of the channel.
     */
    Privacy?: ChannelPrivacy;
    /**
     * The metadata of the channel.
     */
    Metadata?: Metadata;
    /**
     * The time at which the last persistent message visible to the caller in a channel was sent.
     */
    LastMessageTimestamp?: Timestamp;
  }
  export type ChannelSummaryList = ChannelSummary[];
  export type ChimeArn = string;
  export type ClientRequestToken = string;
  export type Content = string;
  export type ContentType = string;
  export interface CreateChannelBanRequest {
    /**
     * The ARN of the ban request.
     */
    ChannelArn: ChimeArn;
    /**
     * The AppInstanceUserArn of the member being banned.
     */
    MemberArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface CreateChannelBanResponse {
    /**
     * The ARN of the response to the ban request.
     */
    ChannelArn?: ChimeArn;
    /**
     * The ChannelArn and BannedIdentity of the member in the ban response.
     */
    Member?: Identity;
  }
  export interface CreateChannelFlowRequest {
    /**
     * The ARN of the channel flow request.
     */
    AppInstanceArn: ChimeArn;
    /**
     * Information about the processor Lambda functions.
     */
    Processors: ProcessorList;
    /**
     * The name of the channel flow.
     */
    Name: NonEmptyResourceName;
    /**
     * The tags for the creation request.
     */
    Tags?: TagList;
    /**
     * The client token for the request. An Idempotency token.
     */
    ClientRequestToken: ClientRequestToken;
  }
  export interface CreateChannelFlowResponse {
    /**
     * The ARN of the channel flow.
     */
    ChannelFlowArn?: ChimeArn;
  }
  export interface CreateChannelMembershipRequest {
    /**
     * The ARN of the channel to which you're adding users.
     */
    ChannelArn: ChimeArn;
    /**
     * The AppInstanceUserArn of the member you want to add to the channel.
     */
    MemberArn: ChimeArn;
    /**
     * The membership type of a user, DEFAULT or HIDDEN. Default members are always returned as part of ListChannelMemberships. Hidden members are only returned if the type filter in ListChannelMemberships equals HIDDEN. Otherwise hidden members are not returned. This is only supported by moderators.
     */
    Type: ChannelMembershipType;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
    /**
     * The ID of the SubChannel in the request.  Only required when creating membership in a SubChannel for a moderator in an elastic channel. 
     */
    SubChannelId?: SubChannelId;
  }
  export interface CreateChannelMembershipResponse {
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The ARN and metadata of the member being added.
     */
    Member?: Identity;
    /**
     * The ID of the SubChannel in the response.
     */
    SubChannelId?: SubChannelId;
  }
  export interface CreateChannelModeratorRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The AppInstanceUserArn of the moderator.
     */
    ChannelModeratorArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface CreateChannelModeratorResponse {
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The ARNs of the channel and the moderator.
     */
    ChannelModerator?: Identity;
  }
  export interface CreateChannelRequest {
    /**
     * The ARN of the channel request.
     */
    AppInstanceArn: ChimeArn;
    /**
     * The name of the channel.
     */
    Name: NonEmptyResourceName;
    /**
     * The channel mode: UNRESTRICTED or RESTRICTED. Administrators, moderators, and channel members can add themselves and other members to unrestricted channels. Only administrators and moderators can add members to restricted channels.
     */
    Mode?: ChannelMode;
    /**
     * The channel's privacy level: PUBLIC or PRIVATE. Private channels aren't discoverable by users outside the channel. Public channels are discoverable by anyone in the AppInstance.
     */
    Privacy?: ChannelPrivacy;
    /**
     * The metadata of the creation request. Limited to 1KB and UTF-8.
     */
    Metadata?: Metadata;
    /**
     * The client token for the request. An Idempotency token.
     */
    ClientRequestToken: ClientRequestToken;
    /**
     * The tags for the creation request.
     */
    Tags?: TagList;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
    /**
     * The ID of the channel in the request.
     */
    ChannelId?: ChannelId;
    /**
     * The ARNs of the channel members in the request.
     */
    MemberArns?: ChannelMemberArns;
    /**
     * The ARNs of the channel moderators in the request.
     */
    ModeratorArns?: ChannelModeratorArns;
    /**
     * The attributes required to configure and create an elastic channel. An elastic channel can support a maximum of 1-million users, excluding moderators.
     */
    ElasticChannelConfiguration?: ElasticChannelConfiguration;
    /**
     * Settings that control the interval after which the channel is automatically deleted.
     */
    ExpirationSettings?: ExpirationSettings;
  }
  export interface CreateChannelResponse {
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
  }
  export interface DeleteChannelBanRequest {
    /**
     * The ARN of the channel from which the AppInstanceUser was banned.
     */
    ChannelArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser that you want to reinstate.
     */
    MemberArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface DeleteChannelFlowRequest {
    /**
     * The ARN of the channel flow.
     */
    ChannelFlowArn: ChimeArn;
  }
  export interface DeleteChannelMembershipRequest {
    /**
     * The ARN of the channel from which you want to remove the user.
     */
    ChannelArn: ChimeArn;
    /**
     * The AppInstanceUserArn of the member that you're removing from the channel.
     */
    MemberArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
    /**
     * The ID of the SubChannel in the request.  Only for use by moderators. 
     */
    SubChannelId?: SubChannelId;
  }
  export interface DeleteChannelMessageRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The ID of the message being deleted.
     */
    MessageId: MessageId;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
    /**
     * The ID of the SubChannel in the request.  Only required when deleting messages in a SubChannel that the user belongs to. 
     */
    SubChannelId?: SubChannelId;
  }
  export interface DeleteChannelModeratorRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The AppInstanceUserArn of the moderator being deleted.
     */
    ChannelModeratorArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface DeleteChannelRequest {
    /**
     * The ARN of the channel being deleted.
     */
    ChannelArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface DeleteMessagingStreamingConfigurationsRequest {
    /**
     * The ARN of the streaming configurations being deleted.
     */
    AppInstanceArn: ChimeArn;
  }
  export interface DescribeChannelBanRequest {
    /**
     * The ARN of the channel from which the user is banned.
     */
    ChannelArn: ChimeArn;
    /**
     * The AppInstanceUserArn of the member being banned.
     */
    MemberArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface DescribeChannelBanResponse {
    /**
     * The details of the ban.
     */
    ChannelBan?: ChannelBan;
  }
  export interface DescribeChannelFlowRequest {
    /**
     * The ARN of the channel flow.
     */
    ChannelFlowArn: ChimeArn;
  }
  export interface DescribeChannelFlowResponse {
    /**
     * The channel flow details.
     */
    ChannelFlow?: ChannelFlow;
  }
  export interface DescribeChannelMembershipForAppInstanceUserRequest {
    /**
     * The ARN of the channel to which the user belongs.
     */
    ChannelArn: ChimeArn;
    /**
     * The ARN of the user or bot in a channel.
     */
    AppInstanceUserArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface DescribeChannelMembershipForAppInstanceUserResponse {
    /**
     * The channel to which a user belongs.
     */
    ChannelMembership?: ChannelMembershipForAppInstanceUserSummary;
  }
  export interface DescribeChannelMembershipRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The AppInstanceUserArn of the member.
     */
    MemberArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
    /**
     * The ID of the SubChannel in the request. The response contains an ElasticChannelConfiguration object.  Only required to get a user’s SubChannel membership details. 
     */
    SubChannelId?: SubChannelId;
  }
  export interface DescribeChannelMembershipResponse {
    /**
     * The details of the membership.
     */
    ChannelMembership?: ChannelMembership;
  }
  export interface DescribeChannelModeratedByAppInstanceUserRequest {
    /**
     * The ARN of the moderated channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The ARN of the user or bot in the moderated channel.
     */
    AppInstanceUserArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface DescribeChannelModeratedByAppInstanceUserResponse {
    /**
     * The moderated channel.
     */
    Channel?: ChannelModeratedByAppInstanceUserSummary;
  }
  export interface DescribeChannelModeratorRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The AppInstanceUserArn of the channel moderator.
     */
    ChannelModeratorArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface DescribeChannelModeratorResponse {
    /**
     * The details of the channel moderator.
     */
    ChannelModerator?: ChannelModerator;
  }
  export interface DescribeChannelRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface DescribeChannelResponse {
    /**
     * The channel details.
     */
    Channel?: Channel;
  }
  export interface DisassociateChannelFlowRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The ARN of the channel flow.
     */
    ChannelFlowArn: ChimeArn;
    /**
     * The AppInstanceUserArn of the user making the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface ElasticChannelConfiguration {
    /**
     * The maximum number of SubChannels that you want to allow in the elastic channel.
     */
    MaximumSubChannels: MaximumSubChannels;
    /**
     * The maximum number of members allowed in a SubChannel.
     */
    TargetMembershipsPerSubChannel: TargetMembershipsPerSubChannel;
    /**
     * The minimum allowed percentage of TargetMembershipsPerSubChannel users. Ceil of the calculated value is used in balancing members among SubChannels of the elastic channel.
     */
    MinimumMembershipPercentage: MinimumMembershipPercentage;
  }
  export type ErrorCode = "BadRequest"|"Conflict"|"Forbidden"|"NotFound"|"PreconditionFailed"|"ResourceLimitExceeded"|"ServiceFailure"|"AccessDenied"|"ServiceUnavailable"|"Throttled"|"Throttling"|"Unauthorized"|"Unprocessable"|"VoiceConnectorGroupAssociationsExist"|"PhoneNumberAssociationsExist"|string;
  export type ExpirationCriterion = "CREATED_TIMESTAMP"|"LAST_MESSAGE_TIMESTAMP"|string;
  export type ExpirationDays = number;
  export interface ExpirationSettings {
    /**
     * The period in days after which the system automatically deletes a channel.
     */
    ExpirationDays: ExpirationDays;
    /**
     * The conditions that must be met for a channel to expire.
     */
    ExpirationCriterion: ExpirationCriterion;
  }
  export type FallbackAction = "CONTINUE"|"ABORT"|string;
  export type FilterRule = string;
  export interface GetChannelMembershipPreferencesRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The AppInstanceUserArn of the member retrieving the preferences.
     */
    MemberArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface GetChannelMembershipPreferencesResponse {
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The details of a user.
     */
    Member?: Identity;
    /**
     * The channel membership preferences for an AppInstanceUser .
     */
    Preferences?: ChannelMembershipPreferences;
  }
  export interface GetChannelMessageRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The ID of the message.
     */
    MessageId: MessageId;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
    /**
     * The ID of the SubChannel in the request.  Only required when getting messages in a SubChannel that the user belongs to. 
     */
    SubChannelId?: SubChannelId;
  }
  export interface GetChannelMessageResponse {
    /**
     * The details of and content in the message.
     */
    ChannelMessage?: ChannelMessage;
  }
  export interface GetChannelMessageStatusRequest {
    /**
     * The ARN of the channel
     */
    ChannelArn: ChimeArn;
    /**
     * The ID of the message.
     */
    MessageId: MessageId;
    /**
     * The AppInstanceUserArn of the user making the API call.
     */
    ChimeBearer: ChimeArn;
    /**
     * The ID of the SubChannel in the request.  Only required when getting message status in a SubChannel that the user belongs to. 
     */
    SubChannelId?: SubChannelId;
  }
  export interface GetChannelMessageStatusResponse {
    /**
     * The message status and details.
     */
    Status?: ChannelMessageStatusStructure;
  }
  export interface GetMessagingSessionEndpointRequest {
  }
  export interface GetMessagingSessionEndpointResponse {
    /**
     * The endpoint returned in the response.
     */
    Endpoint?: MessagingSessionEndpoint;
  }
  export interface GetMessagingStreamingConfigurationsRequest {
    /**
     * The ARN of the streaming configurations.
     */
    AppInstanceArn: ChimeArn;
  }
  export interface GetMessagingStreamingConfigurationsResponse {
    /**
     * The streaming settings.
     */
    StreamingConfigurations?: StreamingConfigurationList;
  }
  export interface Identity {
    /**
     * The ARN in an Identity.
     */
    Arn?: ChimeArn;
    /**
     * The name in an Identity.
     */
    Name?: ResourceName;
  }
  export type InvocationType = "ASYNC"|string;
  export interface LambdaConfiguration {
    /**
     * The ARN of the Lambda message processing function.
     */
    ResourceArn: LambdaFunctionArn;
    /**
     * Controls how the Lambda function is invoked.
     */
    InvocationType: InvocationType;
  }
  export type LambdaFunctionArn = string;
  export interface ListChannelBansRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The maximum number of bans that you want returned.
     */
    MaxResults?: MaxResults;
    /**
     * The token passed by previous API calls until all requested bans are returned.
     */
    NextToken?: NextToken;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface ListChannelBansResponse {
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The token passed by previous API calls until all requested bans are returned.
     */
    NextToken?: NextToken;
    /**
     * The information for each requested ban.
     */
    ChannelBans?: ChannelBanSummaryList;
  }
  export interface ListChannelFlowsRequest {
    /**
     * The ARN of the app instance.
     */
    AppInstanceArn: ChimeArn;
    /**
     * The maximum number of channel flows that you want to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token passed by previous API calls until all requested channel flows are returned.
     */
    NextToken?: NextToken;
  }
  export interface ListChannelFlowsResponse {
    /**
     * The information about each channel flow.
     */
    ChannelFlows?: ChannelFlowSummaryList;
    /**
     * The token passed by previous API calls until all requested channels are returned.
     */
    NextToken?: NextToken;
  }
  export interface ListChannelMembershipsForAppInstanceUserRequest {
    /**
     * The ARN of the user or bot.
     */
    AppInstanceUserArn?: ChimeArn;
    /**
     * The maximum number of users that you want returned.
     */
    MaxResults?: MaxResults;
    /**
     * The token returned from previous API requests until the number of channel memberships is reached.
     */
    NextToken?: NextToken;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface ListChannelMembershipsForAppInstanceUserResponse {
    /**
     * The information for the requested channel memberships.
     */
    ChannelMemberships?: ChannelMembershipForAppInstanceUserSummaryList;
    /**
     * The token passed by previous API calls until all requested users are returned.
     */
    NextToken?: NextToken;
  }
  export interface ListChannelMembershipsRequest {
    /**
     * The maximum number of channel memberships that you want returned.
     */
    ChannelArn: ChimeArn;
    /**
     * The membership type of a user, DEFAULT or HIDDEN. Default members are returned as part of ListChannelMemberships if no type is specified. Hidden members are only returned if the type filter in ListChannelMemberships equals HIDDEN.
     */
    Type?: ChannelMembershipType;
    /**
     * The maximum number of channel memberships that you want returned.
     */
    MaxResults?: MaxResults;
    /**
     * The token passed by previous API calls until all requested channel memberships are returned.
     */
    NextToken?: NextToken;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
    /**
     * The ID of the SubChannel in the request.  Only required when listing a user's memberships in a particular sub-channel of an elastic channel. 
     */
    SubChannelId?: SubChannelId;
  }
  export interface ListChannelMembershipsResponse {
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The information for the requested channel memberships.
     */
    ChannelMemberships?: ChannelMembershipSummaryList;
    /**
     * The token passed by previous API calls until all requested channel memberships are returned.
     */
    NextToken?: NextToken;
  }
  export interface ListChannelMessagesRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The order in which you want messages sorted. Default is Descending, based on time created.
     */
    SortOrder?: SortOrder;
    /**
     * The initial or starting time stamp for your requested messages.
     */
    NotBefore?: Timestamp;
    /**
     * The final or ending time stamp for your requested messages.
     */
    NotAfter?: Timestamp;
    /**
     * The maximum number of messages that you want returned.
     */
    MaxResults?: MaxResults;
    /**
     * The token passed by previous API calls until all requested messages are returned.
     */
    NextToken?: NextToken;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
    /**
     * The ID of the SubChannel in the request.  Only required when listing the messages in a SubChannel that the user belongs to. 
     */
    SubChannelId?: SubChannelId;
  }
  export interface ListChannelMessagesResponse {
    /**
     * The ARN of the channel containing the requested messages.
     */
    ChannelArn?: ChimeArn;
    /**
     * The token passed by previous API calls until all requested messages are returned.
     */
    NextToken?: NextToken;
    /**
     * The information about, and content of, each requested message.
     */
    ChannelMessages?: ChannelMessageSummaryList;
    /**
     * The ID of the SubChannel in the response.
     */
    SubChannelId?: SubChannelId;
  }
  export interface ListChannelModeratorsRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The maximum number of moderators that you want returned.
     */
    MaxResults?: MaxResults;
    /**
     * The token passed by previous API calls until all requested moderators are returned.
     */
    NextToken?: NextToken;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface ListChannelModeratorsResponse {
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The token passed by previous API calls until all requested moderators are returned.
     */
    NextToken?: NextToken;
    /**
     * The information about and names of each moderator.
     */
    ChannelModerators?: ChannelModeratorSummaryList;
  }
  export interface ListChannelsAssociatedWithChannelFlowRequest {
    /**
     * The ARN of the channel flow.
     */
    ChannelFlowArn: ChimeArn;
    /**
     * The maximum number of channels that you want to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token passed by previous API calls until all requested channels are returned.
     */
    NextToken?: NextToken;
  }
  export interface ListChannelsAssociatedWithChannelFlowResponse {
    /**
     * The information about each channel.
     */
    Channels?: ChannelAssociatedWithFlowSummaryList;
    /**
     * The token passed by previous API calls until all requested channels are returned.
     */
    NextToken?: NextToken;
  }
  export interface ListChannelsModeratedByAppInstanceUserRequest {
    /**
     * The ARN of the user or bot in the moderated channel.
     */
    AppInstanceUserArn?: ChimeArn;
    /**
     * The maximum number of channels in the request.
     */
    MaxResults?: MaxResults;
    /**
     * The token returned from previous API requests until the number of channels moderated by the user is reached.
     */
    NextToken?: NextToken;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface ListChannelsModeratedByAppInstanceUserResponse {
    /**
     * The moderated channels in the request.
     */
    Channels?: ChannelModeratedByAppInstanceUserSummaryList;
    /**
     * The token returned from previous API requests until the number of channels moderated by the user is reached.
     */
    NextToken?: NextToken;
  }
  export interface ListChannelsRequest {
    /**
     * The ARN of the AppInstance.
     */
    AppInstanceArn: ChimeArn;
    /**
     * The privacy setting. PUBLIC retrieves all the public channels. PRIVATE retrieves private channels. Only an AppInstanceAdmin can retrieve private channels. 
     */
    Privacy?: ChannelPrivacy;
    /**
     * The maximum number of channels that you want to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token passed by previous API calls until all requested channels are returned.
     */
    NextToken?: NextToken;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface ListChannelsResponse {
    /**
     * The information about each channel.
     */
    Channels?: ChannelSummaryList;
    /**
     * The token returned from previous API requests until the number of channels is reached.
     */
    NextToken?: NextToken;
  }
  export interface ListSubChannelsRequest {
    /**
     * The ARN of elastic channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The AppInstanceUserArn of the user making the API call.
     */
    ChimeBearer: ChimeArn;
    /**
     * The maximum number of sub-channels that you want to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token passed by previous API calls until all requested sub-channels are returned.
     */
    NextToken?: NextToken;
  }
  export interface ListSubChannelsResponse {
    /**
     * The ARN of elastic channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The information about each sub-channel.
     */
    SubChannels?: SubChannelSummaryList;
    /**
     * The token passed by previous API calls until all requested sub-channels are returned.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource.
     */
    ResourceARN: ChimeArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tag key-value pairs.
     */
    Tags?: TagList;
  }
  export type MaxResults = number;
  export type MaximumSubChannels = number;
  export type MemberArns = ChimeArn[];
  export type Members = Identity[];
  export type MembershipCount = number;
  export type MessageAttributeMap = {[key: string]: MessageAttributeValue};
  export type MessageAttributeName = string;
  export type MessageAttributeStringValue = string;
  export type MessageAttributeStringValues = MessageAttributeStringValue[];
  export interface MessageAttributeValue {
    /**
     * The strings in a message attribute value.
     */
    StringValues?: MessageAttributeStringValues;
  }
  export type MessageId = string;
  export type MessagingDataType = "Channel"|"ChannelMessage"|string;
  export interface MessagingSessionEndpoint {
    /**
     * The endpoint to which you establish a websocket connection.
     */
    Url?: UrlType;
  }
  export type Metadata = string;
  export type MinimumMembershipPercentage = number;
  export type NextToken = string;
  export type NonEmptyContent = string;
  export type NonEmptyResourceName = string;
  export type NonNullableBoolean = boolean;
  export interface Processor {
    /**
     * The name of the channel flow.
     */
    Name: NonEmptyResourceName;
    /**
     * The information about the type of processor and its identifier.
     */
    Configuration: ProcessorConfiguration;
    /**
     * The sequence in which processors run. If you have multiple processors in a channel flow, message processing goes through each processor in the sequence. The value determines the sequence. At this point, we support only 1 processor within a flow.
     */
    ExecutionOrder: ChannelFlowExecutionOrder;
    /**
     * Determines whether to continue with message processing or stop it in cases where communication with a processor fails. If a processor has a fallback action of ABORT and communication with it fails, the processor sets the message status to FAILED and does not send the message to any recipients. Note that if the last processor in the channel flow sequence has a fallback action of CONTINUE and communication with the processor fails, then the message is considered processed and sent to recipients of the channel.
     */
    FallbackAction: FallbackAction;
  }
  export interface ProcessorConfiguration {
    /**
     * Indicates that the processor is of type Lambda.
     */
    Lambda: LambdaConfiguration;
  }
  export type ProcessorList = Processor[];
  export type PushNotificationBody = string;
  export interface PushNotificationConfiguration {
    /**
     * The title of the push notification.
     */
    Title?: PushNotificationTitle;
    /**
     * The body of the push notification.
     */
    Body?: PushNotificationBody;
    /**
     * Enum value that indicates the type of the push notification for a message. DEFAULT: Normal mobile push notification. VOIP: VOIP mobile push notification.
     */
    Type?: PushNotificationType;
  }
  export interface PushNotificationPreferences {
    /**
     * Enum value that indicates which push notifications to send to the requested member of a channel. ALL sends all push notifications, NONE sends no push notifications, FILTERED sends only filtered push notifications. 
     */
    AllowNotifications: AllowNotifications;
    /**
     * The simple JSON object used to send a subset of a push notification to the requested member.
     */
    FilterRule?: FilterRule;
  }
  export type PushNotificationTitle = string;
  export type PushNotificationType = "DEFAULT"|"VOIP"|string;
  export interface PutChannelExpirationSettingsRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer?: ChimeArn;
    /**
     * Settings that control the interval after which a channel is deleted.
     */
    ExpirationSettings?: ExpirationSettings;
  }
  export interface PutChannelExpirationSettingsResponse {
    /**
     * The channel ARN.
     */
    ChannelArn?: ChimeArn;
    /**
     * Settings that control the interval after which a channel is deleted.
     */
    ExpirationSettings?: ExpirationSettings;
  }
  export interface PutChannelMembershipPreferencesRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The ARN of the member setting the preferences.
     */
    MemberArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
    /**
     * The channel membership preferences of an AppInstanceUser .
     */
    Preferences: ChannelMembershipPreferences;
  }
  export interface PutChannelMembershipPreferencesResponse {
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The details of a user.
     */
    Member?: Identity;
    /**
     * The ARN and metadata of the member being added.
     */
    Preferences?: ChannelMembershipPreferences;
  }
  export interface PutMessagingStreamingConfigurationsRequest {
    /**
     * The ARN of the streaming configuration.
     */
    AppInstanceArn: ChimeArn;
    /**
     * The streaming configurations.
     */
    StreamingConfigurations: StreamingConfigurationList;
  }
  export interface PutMessagingStreamingConfigurationsResponse {
    /**
     * The requested streaming configurations.
     */
    StreamingConfigurations?: StreamingConfigurationList;
  }
  export interface RedactChannelMessageRequest {
    /**
     * The ARN of the channel containing the messages that you want to redact.
     */
    ChannelArn: ChimeArn;
    /**
     * The ID of the message being redacted.
     */
    MessageId: MessageId;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
    /**
     * The ID of the SubChannel in the request.
     */
    SubChannelId?: SubChannelId;
  }
  export interface RedactChannelMessageResponse {
    /**
     * The ARN of the channel containing the messages that you want to redact.
     */
    ChannelArn?: ChimeArn;
    /**
     * The ID of the message being redacted.
     */
    MessageId?: MessageId;
    /**
     * The ID of the SubChannel in the response.  Only required when redacting messages in a SubChannel that the user belongs to. 
     */
    SubChannelId?: SubChannelId;
  }
  export type ResourceName = string;
  export interface SearchChannelsRequest {
    /**
     * The AppInstanceUserArn of the user making the API call.
     */
    ChimeBearer?: ChimeArn;
    /**
     * A list of the Field objects in the channel being searched.
     */
    Fields: SearchFields;
    /**
     * The maximum number of channels that you want returned.
     */
    MaxResults?: MaxResults;
    /**
     * The token returned from previous API requests until the number of channels is reached.
     */
    NextToken?: NextToken;
  }
  export interface SearchChannelsResponse {
    /**
     * A list of the channels in the request.
     */
    Channels?: ChannelSummaryList;
    /**
     * The token returned from previous API responses until the number of channels is reached.
     */
    NextToken?: NextToken;
  }
  export interface SearchField {
    /**
     * An enum value that indicates the key to search the channel on. MEMBERS allows you to search channels based on memberships. You can use it with the EQUALS operator to get channels whose memberships are equal to the specified values, and with the INCLUDES operator to get channels whose memberships include the specified values.
     */
    Key: SearchFieldKey;
    /**
     * The values that you want to search for, a list of strings. The values must be AppInstanceUserArns specified as a list of strings.  This operation isn't supported for AppInstanceUsers with large number of memberships. 
     */
    Values: SearchFieldValues;
    /**
     * The operator used to compare field values, currently EQUALS or INCLUDES. Use the EQUALS operator to find channels whose memberships equal the specified values. Use the INCLUDES operator to find channels whose memberships include the specified values.
     */
    Operator: SearchFieldOperator;
  }
  export type SearchFieldKey = "MEMBERS"|string;
  export type SearchFieldOperator = "EQUALS"|"INCLUDES"|string;
  export type SearchFieldValue = string;
  export type SearchFieldValues = SearchFieldValue[];
  export type SearchFields = SearchField[];
  export interface SendChannelMessageRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The content of the channel message.
     */
    Content: NonEmptyContent;
    /**
     * The type of message, STANDARD or CONTROL.  STANDARD messages can be up to 4KB in size and contain metadata. Metadata is arbitrary, and you can use it in a variety of ways, such as containing a link to an attachment.  CONTROL messages are limited to 30 bytes and do not contain metadata.
     */
    Type: ChannelMessageType;
    /**
     * Boolean that controls whether the message is persisted on the back end. Required.
     */
    Persistence: ChannelMessagePersistenceType;
    /**
     * The optional metadata for each message.
     */
    Metadata?: Metadata;
    /**
     * The Idempotency token for each client request.
     */
    ClientRequestToken: ClientRequestToken;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
    /**
     * The push notification configuration of the message.
     */
    PushNotification?: PushNotificationConfiguration;
    /**
     * The attributes for the message, used for message filtering along with a FilterRule defined in the PushNotificationPreferences.
     */
    MessageAttributes?: MessageAttributeMap;
    /**
     * The ID of the SubChannel in the request.
     */
    SubChannelId?: SubChannelId;
    /**
     * The content type of the channel message.
     */
    ContentType?: ContentType;
    /**
     * The target of a message. Must be a member of the channel, such as another user, a bot, or the sender. Only the target and the sender can view targeted messages. Only users who can see targeted messages can take actions on them. However, administrators can delete targeted messages that they can’t see. 
     */
    Target?: TargetList;
  }
  export interface SendChannelMessageResponse {
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The ID string assigned to each message.
     */
    MessageId?: MessageId;
    /**
     * The status of the channel message.
     */
    Status?: ChannelMessageStatusStructure;
    /**
     * The ID of the SubChannel in the response.
     */
    SubChannelId?: SubChannelId;
  }
  export type SortOrder = "ASCENDING"|"DESCENDING"|string;
  export type StatusDetail = string;
  export interface StreamingConfiguration {
    /**
     * The data type of the configuration.
     */
    DataType: MessagingDataType;
    /**
     * The ARN of the resource in the configuration. 
     */
    ResourceArn: ChimeArn;
  }
  export type StreamingConfigurationList = StreamingConfiguration[];
  export type String = string;
  export type SubChannelId = string;
  export interface SubChannelSummary {
    /**
     * The unique ID of a SubChannel.
     */
    SubChannelId?: SubChannelId;
    /**
     * The number of members in a SubChannel.
     */
    MembershipCount?: MembershipCount;
  }
  export type SubChannelSummaryList = SubChannelSummary[];
  export interface Tag {
    /**
     * The key in a tag.
     */
    Key: TagKey;
    /**
     * The value in a tag.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The resource ARN.
     */
    ResourceARN: ChimeArn;
    /**
     * The tag key-value pairs.
     */
    Tags: TagList;
  }
  export type TagValue = string;
  export interface Target {
    /**
     * The ARN of the target channel member.
     */
    MemberArn?: ChimeArn;
  }
  export type TargetList = Target[];
  export type TargetMembershipsPerSubChannel = number;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The resource ARN.
     */
    ResourceARN: ChimeArn;
    /**
     * The tag keys.
     */
    TagKeys: TagKeyList;
  }
  export interface UpdateChannelFlowRequest {
    /**
     * The ARN of the channel flow.
     */
    ChannelFlowArn: ChimeArn;
    /**
     * Information about the processor Lambda functions 
     */
    Processors: ProcessorList;
    /**
     * The name of the channel flow.
     */
    Name: NonEmptyResourceName;
  }
  export interface UpdateChannelFlowResponse {
    /**
     * The ARN of the channel flow.
     */
    ChannelFlowArn?: ChimeArn;
  }
  export interface UpdateChannelMessageRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The ID string of the message being updated.
     */
    MessageId: MessageId;
    /**
     * The content of the channel message. 
     */
    Content: NonEmptyContent;
    /**
     * The metadata of the message being updated.
     */
    Metadata?: Metadata;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
    /**
     * The ID of the SubChannel in the request.  Only required when updating messages in a SubChannel that the user belongs to. 
     */
    SubChannelId?: SubChannelId;
    /**
     * The content type of the channel message.
     */
    ContentType?: ContentType;
  }
  export interface UpdateChannelMessageResponse {
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
    /**
     * The ID string of the message being updated.
     */
    MessageId?: MessageId;
    /**
     * The status of the message update.
     */
    Status?: ChannelMessageStatusStructure;
    /**
     * The ID of the SubChannel in the response.
     */
    SubChannelId?: SubChannelId;
  }
  export interface UpdateChannelReadMarkerRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface UpdateChannelReadMarkerResponse {
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
  }
  export interface UpdateChannelRequest {
    /**
     * The ARN of the channel.
     */
    ChannelArn: ChimeArn;
    /**
     * The name of the channel.
     */
    Name?: NonEmptyResourceName;
    /**
     * The mode of the update request.
     */
    Mode?: ChannelMode;
    /**
     * The metadata for the update request.
     */
    Metadata?: Metadata;
    /**
     * The ARN of the AppInstanceUser or AppInstanceBot that makes the API call.
     */
    ChimeBearer: ChimeArn;
  }
  export interface UpdateChannelResponse {
    /**
     * The ARN of the channel.
     */
    ChannelArn?: ChimeArn;
  }
  export type UrlType = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-05-15"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ChimeSDKMessaging client.
   */
  export import Types = ChimeSDKMessaging;
}
export = ChimeSDKMessaging;
