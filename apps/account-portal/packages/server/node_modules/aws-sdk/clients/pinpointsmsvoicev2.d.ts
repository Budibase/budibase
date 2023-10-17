import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class PinpointSMSVoiceV2 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: PinpointSMSVoiceV2.Types.ClientConfiguration)
  config: Config & PinpointSMSVoiceV2.Types.ClientConfiguration;
  /**
   * Associates the specified origination identity with a pool. If the origination identity is a phone number and is already associated with another pool, an Error is returned. A sender ID can be associated with multiple pools. If the origination identity configuration doesn't match the pool's configuration, an Error is returned.
   */
  associateOriginationIdentity(params: PinpointSMSVoiceV2.Types.AssociateOriginationIdentityRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.AssociateOriginationIdentityResult) => void): Request<PinpointSMSVoiceV2.Types.AssociateOriginationIdentityResult, AWSError>;
  /**
   * Associates the specified origination identity with a pool. If the origination identity is a phone number and is already associated with another pool, an Error is returned. A sender ID can be associated with multiple pools. If the origination identity configuration doesn't match the pool's configuration, an Error is returned.
   */
  associateOriginationIdentity(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.AssociateOriginationIdentityResult) => void): Request<PinpointSMSVoiceV2.Types.AssociateOriginationIdentityResult, AWSError>;
  /**
   * Creates a new configuration set. After you create the configuration set, you can add one or more event destinations to it. A configuration set is a set of rules that you apply to the SMS and voice messages that you send. When you send a message, you can optionally specify a single configuration set.
   */
  createConfigurationSet(params: PinpointSMSVoiceV2.Types.CreateConfigurationSetRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.CreateConfigurationSetResult) => void): Request<PinpointSMSVoiceV2.Types.CreateConfigurationSetResult, AWSError>;
  /**
   * Creates a new configuration set. After you create the configuration set, you can add one or more event destinations to it. A configuration set is a set of rules that you apply to the SMS and voice messages that you send. When you send a message, you can optionally specify a single configuration set.
   */
  createConfigurationSet(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.CreateConfigurationSetResult) => void): Request<PinpointSMSVoiceV2.Types.CreateConfigurationSetResult, AWSError>;
  /**
   * Creates a new event destination in a configuration set. An event destination is a location where you send message events. The event options are Amazon CloudWatch, Amazon Kinesis Data Firehose, or Amazon SNS. For example, when a message is delivered successfully, you can send information about that event to an event destination, or send notifications to endpoints that are subscribed to an Amazon SNS topic. Each configuration set can contain between 0 and 5 event destinations. Each event destination can contain a reference to a single destination, such as a CloudWatch or Kinesis Data Firehose destination.
   */
  createEventDestination(params: PinpointSMSVoiceV2.Types.CreateEventDestinationRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.CreateEventDestinationResult) => void): Request<PinpointSMSVoiceV2.Types.CreateEventDestinationResult, AWSError>;
  /**
   * Creates a new event destination in a configuration set. An event destination is a location where you send message events. The event options are Amazon CloudWatch, Amazon Kinesis Data Firehose, or Amazon SNS. For example, when a message is delivered successfully, you can send information about that event to an event destination, or send notifications to endpoints that are subscribed to an Amazon SNS topic. Each configuration set can contain between 0 and 5 event destinations. Each event destination can contain a reference to a single destination, such as a CloudWatch or Kinesis Data Firehose destination.
   */
  createEventDestination(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.CreateEventDestinationResult) => void): Request<PinpointSMSVoiceV2.Types.CreateEventDestinationResult, AWSError>;
  /**
   * Creates a new opt-out list. If the opt-out list name already exists, an Error is returned. An opt-out list is a list of phone numbers that are opted out, meaning you can't send SMS or voice messages to them. If end user replies with the keyword "STOP," an entry for the phone number is added to the opt-out list. In addition to STOP, your recipients can use any supported opt-out keyword, such as CANCEL or OPTOUT. For a list of supported opt-out keywords, see  SMS opt out  in the Amazon Pinpoint User Guide.
   */
  createOptOutList(params: PinpointSMSVoiceV2.Types.CreateOptOutListRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.CreateOptOutListResult) => void): Request<PinpointSMSVoiceV2.Types.CreateOptOutListResult, AWSError>;
  /**
   * Creates a new opt-out list. If the opt-out list name already exists, an Error is returned. An opt-out list is a list of phone numbers that are opted out, meaning you can't send SMS or voice messages to them. If end user replies with the keyword "STOP," an entry for the phone number is added to the opt-out list. In addition to STOP, your recipients can use any supported opt-out keyword, such as CANCEL or OPTOUT. For a list of supported opt-out keywords, see  SMS opt out  in the Amazon Pinpoint User Guide.
   */
  createOptOutList(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.CreateOptOutListResult) => void): Request<PinpointSMSVoiceV2.Types.CreateOptOutListResult, AWSError>;
  /**
   * Creates a new pool and associates the specified origination identity to the pool. A pool can include one or more phone numbers and SenderIds that are associated with your Amazon Web Services account. The new pool inherits its configuration from the specified origination identity. This includes keywords, message type, opt-out list, two-way configuration, and self-managed opt-out configuration. Deletion protection isn't inherited from the origination identity and defaults to false. If the origination identity is a phone number and is already associated with another pool, an Error is returned. A sender ID can be associated with multiple pools.
   */
  createPool(params: PinpointSMSVoiceV2.Types.CreatePoolRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.CreatePoolResult) => void): Request<PinpointSMSVoiceV2.Types.CreatePoolResult, AWSError>;
  /**
   * Creates a new pool and associates the specified origination identity to the pool. A pool can include one or more phone numbers and SenderIds that are associated with your Amazon Web Services account. The new pool inherits its configuration from the specified origination identity. This includes keywords, message type, opt-out list, two-way configuration, and self-managed opt-out configuration. Deletion protection isn't inherited from the origination identity and defaults to false. If the origination identity is a phone number and is already associated with another pool, an Error is returned. A sender ID can be associated with multiple pools.
   */
  createPool(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.CreatePoolResult) => void): Request<PinpointSMSVoiceV2.Types.CreatePoolResult, AWSError>;
  /**
   * Deletes an existing configuration set. A configuration set is a set of rules that you apply to voice and SMS messages that you send. In a configuration set, you can specify a destination for specific types of events related to voice and SMS messages. 
   */
  deleteConfigurationSet(params: PinpointSMSVoiceV2.Types.DeleteConfigurationSetRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteConfigurationSetResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteConfigurationSetResult, AWSError>;
  /**
   * Deletes an existing configuration set. A configuration set is a set of rules that you apply to voice and SMS messages that you send. In a configuration set, you can specify a destination for specific types of events related to voice and SMS messages. 
   */
  deleteConfigurationSet(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteConfigurationSetResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteConfigurationSetResult, AWSError>;
  /**
   * Deletes an existing default message type on a configuration set.  A message type is a type of messages that you plan to send. If you send account-related messages or time-sensitive messages such as one-time passcodes, choose Transactional. If you plan to send messages that contain marketing material or other promotional content, choose Promotional. This setting applies to your entire Amazon Web Services account. 
   */
  deleteDefaultMessageType(params: PinpointSMSVoiceV2.Types.DeleteDefaultMessageTypeRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteDefaultMessageTypeResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteDefaultMessageTypeResult, AWSError>;
  /**
   * Deletes an existing default message type on a configuration set.  A message type is a type of messages that you plan to send. If you send account-related messages or time-sensitive messages such as one-time passcodes, choose Transactional. If you plan to send messages that contain marketing material or other promotional content, choose Promotional. This setting applies to your entire Amazon Web Services account. 
   */
  deleteDefaultMessageType(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteDefaultMessageTypeResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteDefaultMessageTypeResult, AWSError>;
  /**
   * Deletes an existing default sender ID on a configuration set. A default sender ID is the identity that appears on recipients' devices when they receive SMS messages. Support for sender ID capabilities varies by country or region.
   */
  deleteDefaultSenderId(params: PinpointSMSVoiceV2.Types.DeleteDefaultSenderIdRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteDefaultSenderIdResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteDefaultSenderIdResult, AWSError>;
  /**
   * Deletes an existing default sender ID on a configuration set. A default sender ID is the identity that appears on recipients' devices when they receive SMS messages. Support for sender ID capabilities varies by country or region.
   */
  deleteDefaultSenderId(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteDefaultSenderIdResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteDefaultSenderIdResult, AWSError>;
  /**
   * Deletes an existing event destination. An event destination is a location where you send response information about the messages that you send. For example, when a message is delivered successfully, you can send information about that event to an Amazon CloudWatch destination, or send notifications to endpoints that are subscribed to an Amazon SNS topic.
   */
  deleteEventDestination(params: PinpointSMSVoiceV2.Types.DeleteEventDestinationRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteEventDestinationResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteEventDestinationResult, AWSError>;
  /**
   * Deletes an existing event destination. An event destination is a location where you send response information about the messages that you send. For example, when a message is delivered successfully, you can send information about that event to an Amazon CloudWatch destination, or send notifications to endpoints that are subscribed to an Amazon SNS topic.
   */
  deleteEventDestination(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteEventDestinationResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteEventDestinationResult, AWSError>;
  /**
   * Deletes an existing keyword from an origination phone number or pool. A keyword is a word that you can search for on a particular phone number or pool. It is also a specific word or phrase that an end user can send to your number to elicit a response, such as an informational message or a special offer. When your number receives a message that begins with a keyword, Amazon Pinpoint responds with a customizable message. Keywords "HELP" and "STOP" can't be deleted or modified.
   */
  deleteKeyword(params: PinpointSMSVoiceV2.Types.DeleteKeywordRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteKeywordResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteKeywordResult, AWSError>;
  /**
   * Deletes an existing keyword from an origination phone number or pool. A keyword is a word that you can search for on a particular phone number or pool. It is also a specific word or phrase that an end user can send to your number to elicit a response, such as an informational message or a special offer. When your number receives a message that begins with a keyword, Amazon Pinpoint responds with a customizable message. Keywords "HELP" and "STOP" can't be deleted or modified.
   */
  deleteKeyword(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteKeywordResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteKeywordResult, AWSError>;
  /**
   * Deletes an existing opt-out list. All opted out phone numbers in the opt-out list are deleted. If the specified opt-out list name doesn't exist or is in-use by an origination phone number or pool, an Error is returned.
   */
  deleteOptOutList(params: PinpointSMSVoiceV2.Types.DeleteOptOutListRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteOptOutListResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteOptOutListResult, AWSError>;
  /**
   * Deletes an existing opt-out list. All opted out phone numbers in the opt-out list are deleted. If the specified opt-out list name doesn't exist or is in-use by an origination phone number or pool, an Error is returned.
   */
  deleteOptOutList(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteOptOutListResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteOptOutListResult, AWSError>;
  /**
   * Deletes an existing opted out destination phone number from the specified opt-out list. Each destination phone number can only be deleted once every 30 days. If the specified destination phone number doesn't exist or if the opt-out list doesn't exist, an Error is returned.
   */
  deleteOptedOutNumber(params: PinpointSMSVoiceV2.Types.DeleteOptedOutNumberRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteOptedOutNumberResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteOptedOutNumberResult, AWSError>;
  /**
   * Deletes an existing opted out destination phone number from the specified opt-out list. Each destination phone number can only be deleted once every 30 days. If the specified destination phone number doesn't exist or if the opt-out list doesn't exist, an Error is returned.
   */
  deleteOptedOutNumber(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteOptedOutNumberResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteOptedOutNumberResult, AWSError>;
  /**
   * Deletes an existing pool. Deleting a pool disassociates all origination identities from that pool. If the pool status isn't active or if deletion protection is enabled, an Error is returned. A pool is a collection of phone numbers and SenderIds. A pool can include one or more phone numbers and SenderIds that are associated with your Amazon Web Services account.
   */
  deletePool(params: PinpointSMSVoiceV2.Types.DeletePoolRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeletePoolResult) => void): Request<PinpointSMSVoiceV2.Types.DeletePoolResult, AWSError>;
  /**
   * Deletes an existing pool. Deleting a pool disassociates all origination identities from that pool. If the pool status isn't active or if deletion protection is enabled, an Error is returned. A pool is a collection of phone numbers and SenderIds. A pool can include one or more phone numbers and SenderIds that are associated with your Amazon Web Services account.
   */
  deletePool(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeletePoolResult) => void): Request<PinpointSMSVoiceV2.Types.DeletePoolResult, AWSError>;
  /**
   * Deletes an account-level monthly spending limit override for sending text messages. Deleting a spend limit override will set the EnforcedLimit to equal the MaxLimit, which is controlled by Amazon Web Services. For more information on spend limits (quotas) see Amazon Pinpoint quotas  in the Amazon Pinpoint Developer Guide.
   */
  deleteTextMessageSpendLimitOverride(params: PinpointSMSVoiceV2.Types.DeleteTextMessageSpendLimitOverrideRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteTextMessageSpendLimitOverrideResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteTextMessageSpendLimitOverrideResult, AWSError>;
  /**
   * Deletes an account-level monthly spending limit override for sending text messages. Deleting a spend limit override will set the EnforcedLimit to equal the MaxLimit, which is controlled by Amazon Web Services. For more information on spend limits (quotas) see Amazon Pinpoint quotas  in the Amazon Pinpoint Developer Guide.
   */
  deleteTextMessageSpendLimitOverride(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteTextMessageSpendLimitOverrideResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteTextMessageSpendLimitOverrideResult, AWSError>;
  /**
   * Deletes an account level monthly spend limit override for sending voice messages. Deleting a spend limit override sets the EnforcedLimit equal to the MaxLimit, which is controlled by Amazon Web Services. For more information on spending limits (quotas) see Amazon Pinpoint quotas in the Amazon Pinpoint Developer Guide.
   */
  deleteVoiceMessageSpendLimitOverride(params: PinpointSMSVoiceV2.Types.DeleteVoiceMessageSpendLimitOverrideRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteVoiceMessageSpendLimitOverrideResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteVoiceMessageSpendLimitOverrideResult, AWSError>;
  /**
   * Deletes an account level monthly spend limit override for sending voice messages. Deleting a spend limit override sets the EnforcedLimit equal to the MaxLimit, which is controlled by Amazon Web Services. For more information on spending limits (quotas) see Amazon Pinpoint quotas in the Amazon Pinpoint Developer Guide.
   */
  deleteVoiceMessageSpendLimitOverride(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DeleteVoiceMessageSpendLimitOverrideResult) => void): Request<PinpointSMSVoiceV2.Types.DeleteVoiceMessageSpendLimitOverrideResult, AWSError>;
  /**
   * Describes attributes of your Amazon Web Services account. The supported account attributes include account tier, which indicates whether your account is in the sandbox or production environment. When you're ready to move your account out of the sandbox, create an Amazon Web Services Support case for a service limit increase request. New Amazon Pinpoint accounts are placed into an SMS or voice sandbox. The sandbox protects both Amazon Web Services end recipients and SMS or voice recipients from fraud and abuse. 
   */
  describeAccountAttributes(params: PinpointSMSVoiceV2.Types.DescribeAccountAttributesRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeAccountAttributesResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeAccountAttributesResult, AWSError>;
  /**
   * Describes attributes of your Amazon Web Services account. The supported account attributes include account tier, which indicates whether your account is in the sandbox or production environment. When you're ready to move your account out of the sandbox, create an Amazon Web Services Support case for a service limit increase request. New Amazon Pinpoint accounts are placed into an SMS or voice sandbox. The sandbox protects both Amazon Web Services end recipients and SMS or voice recipients from fraud and abuse. 
   */
  describeAccountAttributes(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeAccountAttributesResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeAccountAttributesResult, AWSError>;
  /**
   * Describes the current Amazon Pinpoint SMS Voice V2 resource quotas for your account. The description for a quota includes the quota name, current usage toward that quota, and the quota's maximum value. When you establish an Amazon Web Services account, the account has initial quotas on the maximum number of configuration sets, opt-out lists, phone numbers, and pools that you can create in a given Region. For more information see  Amazon Pinpoint quotas  in the Amazon Pinpoint Developer Guide.
   */
  describeAccountLimits(params: PinpointSMSVoiceV2.Types.DescribeAccountLimitsRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeAccountLimitsResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeAccountLimitsResult, AWSError>;
  /**
   * Describes the current Amazon Pinpoint SMS Voice V2 resource quotas for your account. The description for a quota includes the quota name, current usage toward that quota, and the quota's maximum value. When you establish an Amazon Web Services account, the account has initial quotas on the maximum number of configuration sets, opt-out lists, phone numbers, and pools that you can create in a given Region. For more information see  Amazon Pinpoint quotas  in the Amazon Pinpoint Developer Guide.
   */
  describeAccountLimits(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeAccountLimitsResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeAccountLimitsResult, AWSError>;
  /**
   * Describes the specified configuration sets or all in your account. If you specify configuration set names, the output includes information for only the specified configuration sets. If you specify filters, the output includes information for only those configuration sets that meet the filter criteria. If you don't specify configuration set names or filters, the output includes information for all configuration sets. If you specify a configuration set name that isn't valid, an error is returned.
   */
  describeConfigurationSets(params: PinpointSMSVoiceV2.Types.DescribeConfigurationSetsRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeConfigurationSetsResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeConfigurationSetsResult, AWSError>;
  /**
   * Describes the specified configuration sets or all in your account. If you specify configuration set names, the output includes information for only the specified configuration sets. If you specify filters, the output includes information for only those configuration sets that meet the filter criteria. If you don't specify configuration set names or filters, the output includes information for all configuration sets. If you specify a configuration set name that isn't valid, an error is returned.
   */
  describeConfigurationSets(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeConfigurationSetsResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeConfigurationSetsResult, AWSError>;
  /**
   * Describes the specified keywords or all keywords on your origination phone number or pool. A keyword is a word that you can search for on a particular phone number or pool. It is also a specific word or phrase that an end user can send to your number to elicit a response, such as an informational message or a special offer. When your number receives a message that begins with a keyword, Amazon Pinpoint responds with a customizable message. If you specify a keyword that isn't valid, an Error is returned.
   */
  describeKeywords(params: PinpointSMSVoiceV2.Types.DescribeKeywordsRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeKeywordsResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeKeywordsResult, AWSError>;
  /**
   * Describes the specified keywords or all keywords on your origination phone number or pool. A keyword is a word that you can search for on a particular phone number or pool. It is also a specific word or phrase that an end user can send to your number to elicit a response, such as an informational message or a special offer. When your number receives a message that begins with a keyword, Amazon Pinpoint responds with a customizable message. If you specify a keyword that isn't valid, an Error is returned.
   */
  describeKeywords(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeKeywordsResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeKeywordsResult, AWSError>;
  /**
   * Describes the specified opt-out list or all opt-out lists in your account. If you specify opt-out list names, the output includes information for only the specified opt-out lists. Opt-out lists include only those that meet the filter criteria. If you don't specify opt-out list names or filters, the output includes information for all opt-out lists. If you specify an opt-out list name that isn't valid, an Error is returned.
   */
  describeOptOutLists(params: PinpointSMSVoiceV2.Types.DescribeOptOutListsRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeOptOutListsResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeOptOutListsResult, AWSError>;
  /**
   * Describes the specified opt-out list or all opt-out lists in your account. If you specify opt-out list names, the output includes information for only the specified opt-out lists. Opt-out lists include only those that meet the filter criteria. If you don't specify opt-out list names or filters, the output includes information for all opt-out lists. If you specify an opt-out list name that isn't valid, an Error is returned.
   */
  describeOptOutLists(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeOptOutListsResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeOptOutListsResult, AWSError>;
  /**
   * Describes the specified opted out destination numbers or all opted out destination numbers in an opt-out list. If you specify opted out numbers, the output includes information for only the specified opted out numbers. If you specify filters, the output includes information for only those opted out numbers that meet the filter criteria. If you don't specify opted out numbers or filters, the output includes information for all opted out destination numbers in your opt-out list. If you specify an opted out number that isn't valid, an Error is returned.
   */
  describeOptedOutNumbers(params: PinpointSMSVoiceV2.Types.DescribeOptedOutNumbersRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeOptedOutNumbersResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeOptedOutNumbersResult, AWSError>;
  /**
   * Describes the specified opted out destination numbers or all opted out destination numbers in an opt-out list. If you specify opted out numbers, the output includes information for only the specified opted out numbers. If you specify filters, the output includes information for only those opted out numbers that meet the filter criteria. If you don't specify opted out numbers or filters, the output includes information for all opted out destination numbers in your opt-out list. If you specify an opted out number that isn't valid, an Error is returned.
   */
  describeOptedOutNumbers(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeOptedOutNumbersResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeOptedOutNumbersResult, AWSError>;
  /**
   * Describes the specified origination phone number, or all the phone numbers in your account. If you specify phone number IDs, the output includes information for only the specified phone numbers. If you specify filters, the output includes information for only those phone numbers that meet the filter criteria. If you don't specify phone number IDs or filters, the output includes information for all phone numbers. If you specify a phone number ID that isn't valid, an Error is returned.
   */
  describePhoneNumbers(params: PinpointSMSVoiceV2.Types.DescribePhoneNumbersRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribePhoneNumbersResult) => void): Request<PinpointSMSVoiceV2.Types.DescribePhoneNumbersResult, AWSError>;
  /**
   * Describes the specified origination phone number, or all the phone numbers in your account. If you specify phone number IDs, the output includes information for only the specified phone numbers. If you specify filters, the output includes information for only those phone numbers that meet the filter criteria. If you don't specify phone number IDs or filters, the output includes information for all phone numbers. If you specify a phone number ID that isn't valid, an Error is returned.
   */
  describePhoneNumbers(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribePhoneNumbersResult) => void): Request<PinpointSMSVoiceV2.Types.DescribePhoneNumbersResult, AWSError>;
  /**
   * Retrieves the specified pools or all pools associated with your Amazon Web Services account. If you specify pool IDs, the output includes information for only the specified pools. If you specify filters, the output includes information for only those pools that meet the filter criteria. If you don't specify pool IDs or filters, the output includes information for all pools. If you specify a pool ID that isn't valid, an Error is returned. A pool is a collection of phone numbers and SenderIds. A pool can include one or more phone numbers and SenderIds that are associated with your Amazon Web Services account.
   */
  describePools(params: PinpointSMSVoiceV2.Types.DescribePoolsRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribePoolsResult) => void): Request<PinpointSMSVoiceV2.Types.DescribePoolsResult, AWSError>;
  /**
   * Retrieves the specified pools or all pools associated with your Amazon Web Services account. If you specify pool IDs, the output includes information for only the specified pools. If you specify filters, the output includes information for only those pools that meet the filter criteria. If you don't specify pool IDs or filters, the output includes information for all pools. If you specify a pool ID that isn't valid, an Error is returned. A pool is a collection of phone numbers and SenderIds. A pool can include one or more phone numbers and SenderIds that are associated with your Amazon Web Services account.
   */
  describePools(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribePoolsResult) => void): Request<PinpointSMSVoiceV2.Types.DescribePoolsResult, AWSError>;
  /**
   * Describes the specified SenderIds or all SenderIds associated with your Amazon Web Services account. If you specify SenderIds, the output includes information for only the specified SenderIds. If you specify filters, the output includes information for only those SenderIds that meet the filter criteria. If you don't specify SenderIds or filters, the output includes information for all SenderIds. f you specify a sender ID that isn't valid, an Error is returned.
   */
  describeSenderIds(params: PinpointSMSVoiceV2.Types.DescribeSenderIdsRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeSenderIdsResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeSenderIdsResult, AWSError>;
  /**
   * Describes the specified SenderIds or all SenderIds associated with your Amazon Web Services account. If you specify SenderIds, the output includes information for only the specified SenderIds. If you specify filters, the output includes information for only those SenderIds that meet the filter criteria. If you don't specify SenderIds or filters, the output includes information for all SenderIds. f you specify a sender ID that isn't valid, an Error is returned.
   */
  describeSenderIds(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeSenderIdsResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeSenderIdsResult, AWSError>;
  /**
   * Describes the current Amazon Pinpoint monthly spend limits for sending voice and text messages. When you establish an Amazon Web Services account, the account has initial monthly spend limit in a given Region. For more information on increasing your monthly spend limit, see  Requesting increases to your monthly SMS spending quota for Amazon Pinpoint  in the Amazon Pinpoint User Guide.
   */
  describeSpendLimits(params: PinpointSMSVoiceV2.Types.DescribeSpendLimitsRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeSpendLimitsResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeSpendLimitsResult, AWSError>;
  /**
   * Describes the current Amazon Pinpoint monthly spend limits for sending voice and text messages. When you establish an Amazon Web Services account, the account has initial monthly spend limit in a given Region. For more information on increasing your monthly spend limit, see  Requesting increases to your monthly SMS spending quota for Amazon Pinpoint  in the Amazon Pinpoint User Guide.
   */
  describeSpendLimits(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DescribeSpendLimitsResult) => void): Request<PinpointSMSVoiceV2.Types.DescribeSpendLimitsResult, AWSError>;
  /**
   * Removes the specified origination identity from an existing pool. If the origination identity isn't associated with the specified pool, an Error is returned.
   */
  disassociateOriginationIdentity(params: PinpointSMSVoiceV2.Types.DisassociateOriginationIdentityRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DisassociateOriginationIdentityResult) => void): Request<PinpointSMSVoiceV2.Types.DisassociateOriginationIdentityResult, AWSError>;
  /**
   * Removes the specified origination identity from an existing pool. If the origination identity isn't associated with the specified pool, an Error is returned.
   */
  disassociateOriginationIdentity(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.DisassociateOriginationIdentityResult) => void): Request<PinpointSMSVoiceV2.Types.DisassociateOriginationIdentityResult, AWSError>;
  /**
   * Lists all associated origination identities in your pool. If you specify filters, the output includes information for only those origination identities that meet the filter criteria.
   */
  listPoolOriginationIdentities(params: PinpointSMSVoiceV2.Types.ListPoolOriginationIdentitiesRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.ListPoolOriginationIdentitiesResult) => void): Request<PinpointSMSVoiceV2.Types.ListPoolOriginationIdentitiesResult, AWSError>;
  /**
   * Lists all associated origination identities in your pool. If you specify filters, the output includes information for only those origination identities that meet the filter criteria.
   */
  listPoolOriginationIdentities(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.ListPoolOriginationIdentitiesResult) => void): Request<PinpointSMSVoiceV2.Types.ListPoolOriginationIdentitiesResult, AWSError>;
  /**
   * List all tags associated with a resource.
   */
  listTagsForResource(params: PinpointSMSVoiceV2.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.ListTagsForResourceResult) => void): Request<PinpointSMSVoiceV2.Types.ListTagsForResourceResult, AWSError>;
  /**
   * List all tags associated with a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.ListTagsForResourceResult) => void): Request<PinpointSMSVoiceV2.Types.ListTagsForResourceResult, AWSError>;
  /**
   * Creates or updates a keyword configuration on an origination phone number or pool.  A keyword is a word that you can search for on a particular phone number or pool. It is also a specific word or phrase that an end user can send to your number to elicit a response, such as an informational message or a special offer. When your number receives a message that begins with a keyword, Amazon Pinpoint responds with a customizable message. If you specify a keyword that isn't valid, an Error is returned.
   */
  putKeyword(params: PinpointSMSVoiceV2.Types.PutKeywordRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.PutKeywordResult) => void): Request<PinpointSMSVoiceV2.Types.PutKeywordResult, AWSError>;
  /**
   * Creates or updates a keyword configuration on an origination phone number or pool.  A keyword is a word that you can search for on a particular phone number or pool. It is also a specific word or phrase that an end user can send to your number to elicit a response, such as an informational message or a special offer. When your number receives a message that begins with a keyword, Amazon Pinpoint responds with a customizable message. If you specify a keyword that isn't valid, an Error is returned.
   */
  putKeyword(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.PutKeywordResult) => void): Request<PinpointSMSVoiceV2.Types.PutKeywordResult, AWSError>;
  /**
   * Creates an opted out destination phone number in the opt-out list. If the destination phone number isn't valid or if the specified opt-out list doesn't exist, an Error is returned.
   */
  putOptedOutNumber(params: PinpointSMSVoiceV2.Types.PutOptedOutNumberRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.PutOptedOutNumberResult) => void): Request<PinpointSMSVoiceV2.Types.PutOptedOutNumberResult, AWSError>;
  /**
   * Creates an opted out destination phone number in the opt-out list. If the destination phone number isn't valid or if the specified opt-out list doesn't exist, an Error is returned.
   */
  putOptedOutNumber(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.PutOptedOutNumberResult) => void): Request<PinpointSMSVoiceV2.Types.PutOptedOutNumberResult, AWSError>;
  /**
   * Releases an existing origination phone number in your account. Once released, a phone number is no longer available for sending messages. If the origination phone number has deletion protection enabled or is associated with a pool, an Error is returned.
   */
  releasePhoneNumber(params: PinpointSMSVoiceV2.Types.ReleasePhoneNumberRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.ReleasePhoneNumberResult) => void): Request<PinpointSMSVoiceV2.Types.ReleasePhoneNumberResult, AWSError>;
  /**
   * Releases an existing origination phone number in your account. Once released, a phone number is no longer available for sending messages. If the origination phone number has deletion protection enabled or is associated with a pool, an Error is returned.
   */
  releasePhoneNumber(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.ReleasePhoneNumberResult) => void): Request<PinpointSMSVoiceV2.Types.ReleasePhoneNumberResult, AWSError>;
  /**
   * Request an origination phone number for use in your account. For more information on phone number request see  Requesting a number  in the Amazon Pinpoint User Guide.
   */
  requestPhoneNumber(params: PinpointSMSVoiceV2.Types.RequestPhoneNumberRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.RequestPhoneNumberResult) => void): Request<PinpointSMSVoiceV2.Types.RequestPhoneNumberResult, AWSError>;
  /**
   * Request an origination phone number for use in your account. For more information on phone number request see  Requesting a number  in the Amazon Pinpoint User Guide.
   */
  requestPhoneNumber(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.RequestPhoneNumberResult) => void): Request<PinpointSMSVoiceV2.Types.RequestPhoneNumberResult, AWSError>;
  /**
   * Creates a new text message and sends it to a recipient's phone number. SMS throughput limits are measured in Message Parts per Second (MPS). Your MPS limit depends on the destination country of your messages, as well as the type of phone number (origination number) that you use to send the message. For more information, see Message Parts per Second (MPS) limits in the Amazon Pinpoint User Guide.
   */
  sendTextMessage(params: PinpointSMSVoiceV2.Types.SendTextMessageRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.SendTextMessageResult) => void): Request<PinpointSMSVoiceV2.Types.SendTextMessageResult, AWSError>;
  /**
   * Creates a new text message and sends it to a recipient's phone number. SMS throughput limits are measured in Message Parts per Second (MPS). Your MPS limit depends on the destination country of your messages, as well as the type of phone number (origination number) that you use to send the message. For more information, see Message Parts per Second (MPS) limits in the Amazon Pinpoint User Guide.
   */
  sendTextMessage(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.SendTextMessageResult) => void): Request<PinpointSMSVoiceV2.Types.SendTextMessageResult, AWSError>;
  /**
   * Allows you to send a request that sends a text message through Amazon Pinpoint. This operation uses Amazon Polly to convert a text script into a voice message.
   */
  sendVoiceMessage(params: PinpointSMSVoiceV2.Types.SendVoiceMessageRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.SendVoiceMessageResult) => void): Request<PinpointSMSVoiceV2.Types.SendVoiceMessageResult, AWSError>;
  /**
   * Allows you to send a request that sends a text message through Amazon Pinpoint. This operation uses Amazon Polly to convert a text script into a voice message.
   */
  sendVoiceMessage(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.SendVoiceMessageResult) => void): Request<PinpointSMSVoiceV2.Types.SendVoiceMessageResult, AWSError>;
  /**
   * Sets the default message type on a configuration set. Choose the category of SMS messages that you plan to send from this account. If you send account-related messages or time-sensitive messages such as one-time passcodes, choose Transactional. If you plan to send messages that contain marketing material or other promotional content, choose Promotional. This setting applies to your entire Amazon Web Services account.
   */
  setDefaultMessageType(params: PinpointSMSVoiceV2.Types.SetDefaultMessageTypeRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.SetDefaultMessageTypeResult) => void): Request<PinpointSMSVoiceV2.Types.SetDefaultMessageTypeResult, AWSError>;
  /**
   * Sets the default message type on a configuration set. Choose the category of SMS messages that you plan to send from this account. If you send account-related messages or time-sensitive messages such as one-time passcodes, choose Transactional. If you plan to send messages that contain marketing material or other promotional content, choose Promotional. This setting applies to your entire Amazon Web Services account.
   */
  setDefaultMessageType(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.SetDefaultMessageTypeResult) => void): Request<PinpointSMSVoiceV2.Types.SetDefaultMessageTypeResult, AWSError>;
  /**
   * Sets default sender ID on a configuration set. When sending a text message to a destination country that supports sender IDs, the default sender ID on the configuration set specified will be used if no dedicated origination phone numbers or registered sender IDs are available in your account.
   */
  setDefaultSenderId(params: PinpointSMSVoiceV2.Types.SetDefaultSenderIdRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.SetDefaultSenderIdResult) => void): Request<PinpointSMSVoiceV2.Types.SetDefaultSenderIdResult, AWSError>;
  /**
   * Sets default sender ID on a configuration set. When sending a text message to a destination country that supports sender IDs, the default sender ID on the configuration set specified will be used if no dedicated origination phone numbers or registered sender IDs are available in your account.
   */
  setDefaultSenderId(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.SetDefaultSenderIdResult) => void): Request<PinpointSMSVoiceV2.Types.SetDefaultSenderIdResult, AWSError>;
  /**
   * Sets an account level monthly spend limit override for sending text messages. The requested spend limit must be less than or equal to the MaxLimit, which is set by Amazon Web Services. 
   */
  setTextMessageSpendLimitOverride(params: PinpointSMSVoiceV2.Types.SetTextMessageSpendLimitOverrideRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.SetTextMessageSpendLimitOverrideResult) => void): Request<PinpointSMSVoiceV2.Types.SetTextMessageSpendLimitOverrideResult, AWSError>;
  /**
   * Sets an account level monthly spend limit override for sending text messages. The requested spend limit must be less than or equal to the MaxLimit, which is set by Amazon Web Services. 
   */
  setTextMessageSpendLimitOverride(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.SetTextMessageSpendLimitOverrideResult) => void): Request<PinpointSMSVoiceV2.Types.SetTextMessageSpendLimitOverrideResult, AWSError>;
  /**
   * Sets an account level monthly spend limit override for sending voice messages. The requested spend limit must be less than or equal to the MaxLimit, which is set by Amazon Web Services. 
   */
  setVoiceMessageSpendLimitOverride(params: PinpointSMSVoiceV2.Types.SetVoiceMessageSpendLimitOverrideRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.SetVoiceMessageSpendLimitOverrideResult) => void): Request<PinpointSMSVoiceV2.Types.SetVoiceMessageSpendLimitOverrideResult, AWSError>;
  /**
   * Sets an account level monthly spend limit override for sending voice messages. The requested spend limit must be less than or equal to the MaxLimit, which is set by Amazon Web Services. 
   */
  setVoiceMessageSpendLimitOverride(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.SetVoiceMessageSpendLimitOverrideResult) => void): Request<PinpointSMSVoiceV2.Types.SetVoiceMessageSpendLimitOverrideResult, AWSError>;
  /**
   * Adds or overwrites only the specified tags for the specified Amazon Pinpoint SMS Voice, version 2 resource. When you specify an existing tag key, the value is overwritten with the new value. Each resource can have a maximum of 50 tags. Each tag consists of a key and an optional value. Tag keys must be unique per resource. For more information about tags, see  Tagging Amazon Pinpoint resources in the Amazon Pinpoint Developer Guide.
   */
  tagResource(params: PinpointSMSVoiceV2.Types.TagResourceRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.TagResourceResult) => void): Request<PinpointSMSVoiceV2.Types.TagResourceResult, AWSError>;
  /**
   * Adds or overwrites only the specified tags for the specified Amazon Pinpoint SMS Voice, version 2 resource. When you specify an existing tag key, the value is overwritten with the new value. Each resource can have a maximum of 50 tags. Each tag consists of a key and an optional value. Tag keys must be unique per resource. For more information about tags, see  Tagging Amazon Pinpoint resources in the Amazon Pinpoint Developer Guide.
   */
  tagResource(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.TagResourceResult) => void): Request<PinpointSMSVoiceV2.Types.TagResourceResult, AWSError>;
  /**
   * Removes the association of the specified tags from an Amazon Pinpoint SMS Voice V2 resource. For more information on tags see  Tagging Amazon Pinpoint resources in the Amazon Pinpoint Developer Guide. 
   */
  untagResource(params: PinpointSMSVoiceV2.Types.UntagResourceRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.UntagResourceResult) => void): Request<PinpointSMSVoiceV2.Types.UntagResourceResult, AWSError>;
  /**
   * Removes the association of the specified tags from an Amazon Pinpoint SMS Voice V2 resource. For more information on tags see  Tagging Amazon Pinpoint resources in the Amazon Pinpoint Developer Guide. 
   */
  untagResource(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.UntagResourceResult) => void): Request<PinpointSMSVoiceV2.Types.UntagResourceResult, AWSError>;
  /**
   * Updates an existing event destination in a configuration set. You can update the IAM role ARN for CloudWatch Logs and Kinesis Data Firehose. You can also enable or disable the event destination. You may want to update an event destination to change its matching event types or updating the destination resource ARN. You can't change an event destination's type between CloudWatch Logs, Kinesis Data Firehose, and Amazon SNS.
   */
  updateEventDestination(params: PinpointSMSVoiceV2.Types.UpdateEventDestinationRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.UpdateEventDestinationResult) => void): Request<PinpointSMSVoiceV2.Types.UpdateEventDestinationResult, AWSError>;
  /**
   * Updates an existing event destination in a configuration set. You can update the IAM role ARN for CloudWatch Logs and Kinesis Data Firehose. You can also enable or disable the event destination. You may want to update an event destination to change its matching event types or updating the destination resource ARN. You can't change an event destination's type between CloudWatch Logs, Kinesis Data Firehose, and Amazon SNS.
   */
  updateEventDestination(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.UpdateEventDestinationResult) => void): Request<PinpointSMSVoiceV2.Types.UpdateEventDestinationResult, AWSError>;
  /**
   * Updates the configuration of an existing origination phone number. You can update the opt-out list, enable or disable two-way messaging, change the TwoWayChannelArn, enable or disable self-managed opt-outs, and enable or disable deletion protection. If the origination phone number is associated with a pool, an Error is returned.
   */
  updatePhoneNumber(params: PinpointSMSVoiceV2.Types.UpdatePhoneNumberRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.UpdatePhoneNumberResult) => void): Request<PinpointSMSVoiceV2.Types.UpdatePhoneNumberResult, AWSError>;
  /**
   * Updates the configuration of an existing origination phone number. You can update the opt-out list, enable or disable two-way messaging, change the TwoWayChannelArn, enable or disable self-managed opt-outs, and enable or disable deletion protection. If the origination phone number is associated with a pool, an Error is returned.
   */
  updatePhoneNumber(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.UpdatePhoneNumberResult) => void): Request<PinpointSMSVoiceV2.Types.UpdatePhoneNumberResult, AWSError>;
  /**
   * Updates the configuration of an existing pool. You can update the opt-out list, enable or disable two-way messaging, change the TwoWayChannelArn, enable or disable self-managed opt-outs, enable or disable deletion protection, and enable or disable shared routes.
   */
  updatePool(params: PinpointSMSVoiceV2.Types.UpdatePoolRequest, callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.UpdatePoolResult) => void): Request<PinpointSMSVoiceV2.Types.UpdatePoolResult, AWSError>;
  /**
   * Updates the configuration of an existing pool. You can update the opt-out list, enable or disable two-way messaging, change the TwoWayChannelArn, enable or disable self-managed opt-outs, enable or disable deletion protection, and enable or disable shared routes.
   */
  updatePool(callback?: (err: AWSError, data: PinpointSMSVoiceV2.Types.UpdatePoolResult) => void): Request<PinpointSMSVoiceV2.Types.UpdatePoolResult, AWSError>;
}
declare namespace PinpointSMSVoiceV2 {
  export interface AccountAttribute {
    /**
     * The name of the account attribute.
     */
    Name: AccountAttributeName;
    /**
     * The value associated with the account attribute name.
     */
    Value: String;
  }
  export type AccountAttributeList = AccountAttribute[];
  export type AccountAttributeName = "ACCOUNT_TIER"|string;
  export interface AccountLimit {
    /**
     * The name of the attribute to apply the account limit to.
     */
    Name: AccountLimitName;
    /**
     * The current amount that has been spent, in US dollars.
     */
    Used: PrimitiveLong;
    /**
     * The Amazon Web Services set limit for that resource type, in US dollars.
     */
    Max: PrimitiveLong;
  }
  export type AccountLimitList = AccountLimit[];
  export type AccountLimitName = "PHONE_NUMBERS"|"POOLS"|"CONFIGURATION_SETS"|"OPT_OUT_LISTS"|string;
  export type AmazonResourceName = string;
  export interface AssociateOriginationIdentityRequest {
    /**
     * The pool to update with the new Identity. This value can be either the PoolId or PoolArn, and you can find these values using DescribePools.
     */
    PoolId: PoolIdOrArn;
    /**
     * The origination identity to use, such as PhoneNumberId, PhoneNumberArn, SenderId, or SenderIdArn. You can use DescribePhoneNumbers to find the values for PhoneNumberId and PhoneNumberArn, while DescribeSenderIds can be used to get the values for SenderId and SenderIdArn.
     */
    OriginationIdentity: PhoneOrSenderIdOrArn;
    /**
     * The new two-character code, in ISO 3166-1 alpha-2 format, for the country or region of the origination identity.
     */
    IsoCountryCode: IsoCountryCode;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don't specify a client token, a randomly generated token is used for the request to ensure idempotency.
     */
    ClientToken?: ClientToken;
  }
  export interface AssociateOriginationIdentityResult {
    /**
     * The Amazon Resource Name (ARN) of the pool that is now associated with the origination identity.
     */
    PoolArn?: String;
    /**
     * The PoolId of the pool that is now associated with the origination identity.
     */
    PoolId?: String;
    /**
     * The PhoneNumberArn or SenderIdArn of the origination identity.
     */
    OriginationIdentityArn?: String;
    /**
     * The PhoneNumberId or SenderId of the origination identity.
     */
    OriginationIdentity?: String;
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, for the country or region. 
     */
    IsoCountryCode?: IsoCountryCode;
  }
  export type Boolean = boolean;
  export type ClientToken = string;
  export interface CloudWatchLogsDestination {
    /**
     * The Amazon Resource Name (ARN) of an Amazon Identity and Access Management (IAM) role that is able to write event data to an Amazon CloudWatch destination.
     */
    IamRoleArn: IamRoleArn;
    /**
     * The name of the Amazon CloudWatch log group that you want to record events in. 
     */
    LogGroupArn: LogGroupArn;
  }
  export interface ConfigurationSetFilter {
    /**
     * The name of the attribute to filter on.
     */
    Name: ConfigurationSetFilterName;
    /**
     * An array values to filter for.
     */
    Values: FilterValueList;
  }
  export type ConfigurationSetFilterList = ConfigurationSetFilter[];
  export type ConfigurationSetFilterName = "event-destination-name"|"matching-event-types"|"default-message-type"|"default-sender-id"|string;
  export interface ConfigurationSetInformation {
    /**
     * The Resource Name (ARN) of the ConfigurationSet.
     */
    ConfigurationSetArn: String;
    /**
     * The name of the ConfigurationSet.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * An array of EventDestination objects that describe any events to log and where to log them.
     */
    EventDestinations: EventDestinationList;
    /**
     * The type of message. Valid values are TRANSACTIONAL for messages that are critical or time-sensitive and PROMOTIONAL for messages that aren't critical or time-sensitive.
     */
    DefaultMessageType?: MessageType;
    /**
     * The default sender ID used by the ConfigurationSet.
     */
    DefaultSenderId?: SenderId;
    /**
     * The time when the ConfigurationSet was created, in UNIX epoch time format.
     */
    CreatedTimestamp: Timestamp;
  }
  export type ConfigurationSetInformationList = ConfigurationSetInformation[];
  export type ConfigurationSetName = string;
  export type ConfigurationSetNameList = ConfigurationSetNameOrArn[];
  export type ConfigurationSetNameOrArn = string;
  export type ContextKey = string;
  export type ContextMap = {[key: string]: ContextValue};
  export type ContextValue = string;
  export interface CreateConfigurationSetRequest {
    /**
     * The name to use for the new configuration set.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * An array of key and value pair tags that's associated with the new configuration set. 
     */
    Tags?: TagList;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don't specify a client token, a randomly generated token is used for the request to ensure idempotency.
     */
    ClientToken?: ClientToken;
  }
  export interface CreateConfigurationSetResult {
    /**
     * The Amazon Resource Name (ARN) of the newly created configuration set.
     */
    ConfigurationSetArn?: String;
    /**
     * The name of the new configuration set.
     */
    ConfigurationSetName?: ConfigurationSetName;
    /**
     * An array of key and value pair tags that's associated with the configuration set.
     */
    Tags?: TagList;
    /**
     * The time when the configuration set was created, in UNIX epoch time format.
     */
    CreatedTimestamp?: Timestamp;
  }
  export interface CreateEventDestinationRequest {
    /**
     * Either the name of the configuration set or the configuration set ARN to apply event logging to. The ConfigurateSetName and ConfigurationSetArn can be found using the DescribeConfigurationSets action.
     */
    ConfigurationSetName: ConfigurationSetNameOrArn;
    /**
     * The name that identifies the event destination.
     */
    EventDestinationName: EventDestinationName;
    /**
     * An array of event types that determine which events to log. If "ALL" is used, then Amazon Pinpoint logs every event type.
     */
    MatchingEventTypes: EventTypeList;
    /**
     * An object that contains information about an event destination for logging to Amazon CloudWatch logs.
     */
    CloudWatchLogsDestination?: CloudWatchLogsDestination;
    /**
     * An object that contains information about an event destination for logging to Amazon Kinesis Data Firehose.
     */
    KinesisFirehoseDestination?: KinesisFirehoseDestination;
    /**
     * An object that contains information about an event destination for logging to Amazon SNS.
     */
    SnsDestination?: SnsDestination;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don't specify a client token, a randomly generated token is used for the request to ensure idempotency.
     */
    ClientToken?: ClientToken;
  }
  export interface CreateEventDestinationResult {
    /**
     * The ARN of the configuration set.
     */
    ConfigurationSetArn?: String;
    /**
     * The name of the configuration set.
     */
    ConfigurationSetName?: ConfigurationSetName;
    /**
     * The details of the destination where events are logged.
     */
    EventDestination?: EventDestination;
  }
  export interface CreateOptOutListRequest {
    /**
     * The name of the new OptOutList.
     */
    OptOutListName: OptOutListName;
    /**
     * An array of tags (key and value pairs) to associate with the new OptOutList.
     */
    Tags?: TagList;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don't specify a client token, a randomly generated token is used for the request to ensure idempotency.
     */
    ClientToken?: ClientToken;
  }
  export interface CreateOptOutListResult {
    /**
     * The Amazon Resource Name (ARN) for the OptOutList.
     */
    OptOutListArn?: String;
    /**
     * The name of the new OptOutList.
     */
    OptOutListName?: OptOutListName;
    /**
     * An array of tags (key and value pairs) associated with the new OptOutList.
     */
    Tags?: TagList;
    /**
     * The time when the pool was created, in UNIX epoch time format.
     */
    CreatedTimestamp?: Timestamp;
  }
  export interface CreatePoolRequest {
    /**
     * The origination identity to use such as a PhoneNumberId, PhoneNumberArn, SenderId or SenderIdArn. You can use DescribePhoneNumbers to find the values for PhoneNumberId and PhoneNumberArn while DescribeSenderIds can be used to get the values for SenderId and SenderIdArn.
     */
    OriginationIdentity: PhoneOrSenderIdOrArn;
    /**
     * The new two-character code, in ISO 3166-1 alpha-2 format, for the country or region of the new pool.
     */
    IsoCountryCode: IsoCountryCode;
    /**
     * The type of message. Valid values are TRANSACTIONAL for messages that are critical or time-sensitive and PROMOTIONAL for messages that aren't critical or time-sensitive.
     */
    MessageType: MessageType;
    /**
     * By default this is set to false. When set to true the pool can't be deleted. You can change this value using the UpdatePool action.
     */
    DeletionProtectionEnabled?: Boolean;
    /**
     * An array of tags (key and value pairs) associated with the pool.
     */
    Tags?: TagList;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don't specify a client token, a randomly generated token is used for the request to ensure idempotency.
     */
    ClientToken?: ClientToken;
  }
  export interface CreatePoolResult {
    /**
     * The Amazon Resource Name (ARN) for the pool.
     */
    PoolArn?: String;
    /**
     * The unique identifier for the pool.
     */
    PoolId?: String;
    /**
     * The current status of the pool.   CREATING: The pool is currently being created and isn't yet available for use.   ACTIVE: The pool is active and available for use.   DELETING: The pool is being deleted.  
     */
    Status?: PoolStatus;
    /**
     * The type of message for the pool to use.
     */
    MessageType?: MessageType;
    /**
     * By default this is set to false. When set to true you can receive incoming text messages from your end recipients.
     */
    TwoWayEnabled?: PrimitiveBoolean;
    /**
     * The Amazon Resource Name (ARN) of the two way channel.
     */
    TwoWayChannelArn?: TwoWayChannelArn;
    /**
     * By default this is set to false. When an end recipient sends a message that begins with HELP or STOP to one of your dedicated numbers, Amazon Pinpoint automatically replies with a customizable message and adds the end recipient to the OptOutList. When set to true you're responsible for responding to HELP and STOP requests. You're also responsible for tracking and honoring opt-out requests.
     */
    SelfManagedOptOutsEnabled?: PrimitiveBoolean;
    /**
     * The name of the OptOutList associated with the pool.
     */
    OptOutListName?: OptOutListName;
    /**
     * Indicates whether shared routes are enabled for the pool.
     */
    SharedRoutesEnabled?: PrimitiveBoolean;
    /**
     * When set to true deletion protection is enabled. By default this is set to false. 
     */
    DeletionProtectionEnabled?: PrimitiveBoolean;
    /**
     * An array of tags (key and value pairs) associated with the pool.
     */
    Tags?: TagList;
    /**
     * The time when the pool was created, in UNIX epoch time format.
     */
    CreatedTimestamp?: Timestamp;
  }
  export interface DeleteConfigurationSetRequest {
    /**
     * The name of the configuration set or the configuration set ARN that you want to delete. The ConfigurationSetName and ConfigurationSetArn can be found using the DescribeConfigurationSets action.
     */
    ConfigurationSetName: ConfigurationSetNameOrArn;
  }
  export interface DeleteConfigurationSetResult {
    /**
     * The Amazon Resource Name (ARN) of the deleted configuration set.
     */
    ConfigurationSetArn?: String;
    /**
     * The name of the deleted configuration set.
     */
    ConfigurationSetName?: ConfigurationSetName;
    /**
     * An array of any EventDestination objects that were associated with the deleted configuration set.
     */
    EventDestinations?: EventDestinationList;
    /**
     * The default message type of the configuration set that was deleted.
     */
    DefaultMessageType?: MessageType;
    /**
     * The default Sender ID of the configuration set that was deleted.
     */
    DefaultSenderId?: SenderId;
    /**
     * The time that the deleted configuration set was created in UNIX epoch time format.
     */
    CreatedTimestamp?: Timestamp;
  }
  export interface DeleteDefaultMessageTypeRequest {
    /**
     * The name of the configuration set or the configuration set Amazon Resource Name (ARN) to delete the default message type from. The ConfigurationSetName and ConfigurationSetArn can be found using the DescribeConfigurationSets action.
     */
    ConfigurationSetName: ConfigurationSetNameOrArn;
  }
  export interface DeleteDefaultMessageTypeResult {
    /**
     * The Amazon Resource Name (ARN) of the configuration set.
     */
    ConfigurationSetArn?: String;
    /**
     * The name of the configuration set.
     */
    ConfigurationSetName?: ConfigurationSetName;
    /**
     * The current message type for the configuration set.
     */
    MessageType?: MessageType;
  }
  export interface DeleteDefaultSenderIdRequest {
    /**
     * The name of the configuration set or the configuration set Amazon Resource Name (ARN) to delete the default sender ID from. The ConfigurationSetName and ConfigurationSetArn can be found using the DescribeConfigurationSets action.
     */
    ConfigurationSetName: ConfigurationSetNameOrArn;
  }
  export interface DeleteDefaultSenderIdResult {
    /**
     * The Amazon Resource Name (ARN) of the configuration set.
     */
    ConfigurationSetArn?: String;
    /**
     * The name of the configuration set.
     */
    ConfigurationSetName?: ConfigurationSetName;
    /**
     * The current sender ID for the configuration set.
     */
    SenderId?: SenderId;
  }
  export interface DeleteEventDestinationRequest {
    /**
     * The name of the configuration set or the configuration set's Amazon Resource Name (ARN) to remove the event destination from. The ConfigurateSetName and ConfigurationSetArn can be found using the DescribeConfigurationSets action.
     */
    ConfigurationSetName: ConfigurationSetNameOrArn;
    /**
     * The name of the event destination to delete.
     */
    EventDestinationName: EventDestinationName;
  }
  export interface DeleteEventDestinationResult {
    /**
     * The Amazon Resource Name (ARN) of the configuration set.
     */
    ConfigurationSetArn?: String;
    /**
     * The name of the configuration set the event destination was deleted from.
     */
    ConfigurationSetName?: ConfigurationSetName;
    /**
     * The event destination object that was deleted.
     */
    EventDestination?: EventDestination;
  }
  export interface DeleteKeywordRequest {
    /**
     * The origination identity to use such as a PhoneNumberId, PhoneNumberArn, PoolId or PoolArn. You can use DescribePhoneNumbers to find the values for PhoneNumberId and PhoneNumberArn and DescribePools to find the values of PoolId and PoolArn.
     */
    OriginationIdentity: PhoneOrPoolIdOrArn;
    /**
     * The keyword to delete.
     */
    Keyword: Keyword;
  }
  export interface DeleteKeywordResult {
    /**
     * The PhoneNumberArn or PoolArn that the keyword was associated with.
     */
    OriginationIdentityArn?: String;
    /**
     * The PhoneNumberId or PoolId that the keyword was associated with.
     */
    OriginationIdentity?: String;
    /**
     * The keyword that was deleted.
     */
    Keyword?: Keyword;
    /**
     * The message that was associated with the deleted keyword.
     */
    KeywordMessage?: KeywordMessage;
    /**
     * The action that was associated with the deleted keyword.
     */
    KeywordAction?: KeywordAction;
  }
  export interface DeleteOptOutListRequest {
    /**
     * The OptOutListName or OptOutListArn of the OptOutList to delete. You can use DescribeOptOutLists to find the values for OptOutListName and OptOutListArn.
     */
    OptOutListName: OptOutListNameOrArn;
  }
  export interface DeleteOptOutListResult {
    /**
     * The Amazon Resource Name (ARN) of the OptOutList that was removed.
     */
    OptOutListArn?: String;
    /**
     * The name of the OptOutList that was removed.
     */
    OptOutListName?: OptOutListName;
    /**
     * The time when the OptOutList was created, in UNIX epoch time format.
     */
    CreatedTimestamp?: Timestamp;
  }
  export interface DeleteOptedOutNumberRequest {
    /**
     * The OptOutListName or OptOutListArn to remove the phone number from.
     */
    OptOutListName: OptOutListNameOrArn;
    /**
     * The phone number, in E.164 format, to remove from the OptOutList.
     */
    OptedOutNumber: PhoneNumber;
  }
  export interface DeleteOptedOutNumberResult {
    /**
     * The OptOutListArn that the phone number was removed from.
     */
    OptOutListArn?: String;
    /**
     * The OptOutListName that the phone number was removed from.
     */
    OptOutListName?: OptOutListName;
    /**
     * The phone number that was removed from the OptOutList.
     */
    OptedOutNumber?: PhoneNumber;
    /**
     * The time that the number was removed at, in UNIX epoch time format.
     */
    OptedOutTimestamp?: Timestamp;
    /**
     * This is true if it was the end user who requested their phone number be removed. 
     */
    EndUserOptedOut?: PrimitiveBoolean;
  }
  export interface DeletePoolRequest {
    /**
     * The PoolId or PoolArn of the pool to delete. You can use DescribePools to find the values for PoolId and PoolArn .
     */
    PoolId: PoolIdOrArn;
  }
  export interface DeletePoolResult {
    /**
     * The Amazon Resource Name (ARN) of the pool that was deleted.
     */
    PoolArn?: String;
    /**
     * The PoolId of the pool that was deleted.
     */
    PoolId?: String;
    /**
     * The current status of the pool.   CREATING: The pool is currently being created and isn't yet available for use.   ACTIVE: The pool is active and available for use.   DELETING: The pool is being deleted.  
     */
    Status?: PoolStatus;
    /**
     * The message type that was associated with the deleted pool.
     */
    MessageType?: MessageType;
    /**
     * By default this is set to false. When set to true you can receive incoming text messages from your end recipients.
     */
    TwoWayEnabled?: PrimitiveBoolean;
    /**
     * The Amazon Resource Name (ARN) of the TwoWayChannel.
     */
    TwoWayChannelArn?: TwoWayChannelArn;
    /**
     * By default this is set to false. When an end recipient sends a message that begins with HELP or STOP to one of your dedicated numbers, Amazon Pinpoint automatically replies with a customizable message and adds the end recipient to the OptOutList. When set to true you're responsible for responding to HELP and STOP requests. You're also responsible for tracking and honoring opt-out requests.
     */
    SelfManagedOptOutsEnabled?: PrimitiveBoolean;
    /**
     * The name of the OptOutList that was associated with the deleted pool.
     */
    OptOutListName?: OptOutListName;
    /**
     * Indicates whether shared routes are enabled for the pool.
     */
    SharedRoutesEnabled?: PrimitiveBoolean;
    /**
     * The time when the pool was created, in UNIX epoch time format.
     */
    CreatedTimestamp?: Timestamp;
  }
  export interface DeleteTextMessageSpendLimitOverrideRequest {
  }
  export interface DeleteTextMessageSpendLimitOverrideResult {
    /**
     * The current monthly limit, in US dollars.
     */
    MonthlyLimit?: MonthlyLimit;
  }
  export interface DeleteVoiceMessageSpendLimitOverrideRequest {
  }
  export interface DeleteVoiceMessageSpendLimitOverrideResult {
    /**
     * The current monthly limit, in US dollars.
     */
    MonthlyLimit?: MonthlyLimit;
  }
  export type DeliveryStreamArn = string;
  export interface DescribeAccountAttributesRequest {
    /**
     * The token to be used for the next set of paginated results. You don't need to supply a value for this field in the initial request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per each request.
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeAccountAttributesResult {
    /**
     * An array of AccountAttributes objects.
     */
    AccountAttributes?: AccountAttributeList;
    /**
     * The token to be used for the next set of paginated results. If this field is empty then there are no more results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeAccountLimitsRequest {
    /**
     * The token to be used for the next set of paginated results. You don't need to supply a value for this field in the initial request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per each request.
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeAccountLimitsResult {
    /**
     * An array of AccountLimit objects that show the current spend limits.
     */
    AccountLimits?: AccountLimitList;
    /**
     * The token to be used for the next set of paginated results. If this field is empty then there are no more results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeConfigurationSetsRequest {
    /**
     * An array of strings. Each element can be either a ConfigurationSetName or ConfigurationSetArn.
     */
    ConfigurationSetNames?: ConfigurationSetNameList;
    /**
     * An array of filters to apply to the results that are returned.
     */
    Filters?: ConfigurationSetFilterList;
    /**
     * The token to be used for the next set of paginated results. You don't need to supply a value for this field in the initial request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per each request.
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeConfigurationSetsResult {
    /**
     * An array of ConfigurationSets objects.
     */
    ConfigurationSets?: ConfigurationSetInformationList;
    /**
     * The token to be used for the next set of paginated results. If this field is empty then there are no more results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeKeywordsRequest {
    /**
     * The origination identity to use such as a PhoneNumberId, PhoneNumberArn, SenderId or SenderIdArn. You can use DescribePhoneNumbers to find the values for PhoneNumberId and PhoneNumberArn while DescribeSenderIds can be used to get the values for SenderId and SenderIdArn.
     */
    OriginationIdentity: PhoneOrPoolIdOrArn;
    /**
     * An array of keywords to search for.
     */
    Keywords?: KeywordList;
    /**
     * An array of keyword filters to filter the results.
     */
    Filters?: KeywordFilterList;
    /**
     * The token to be used for the next set of paginated results. You don't need to supply a value for this field in the initial request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per each request.
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeKeywordsResult {
    /**
     * The PhoneNumberArn or PoolArn that is associated with the OriginationIdentity. 
     */
    OriginationIdentityArn?: String;
    /**
     * The PhoneNumberId or PoolId that is associated with the OriginationIdentity.
     */
    OriginationIdentity?: String;
    /**
     * An array of KeywordInformation objects that contain the results.
     */
    Keywords?: KeywordInformationList;
    /**
     * The token to be used for the next set of paginated results. If this field is empty then there are no more results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeOptOutListsRequest {
    /**
     * The OptOutLists to show the details of. This is an array of strings that can be either the OptOutListName or OptOutListArn.
     */
    OptOutListNames?: OptOutListNameList;
    /**
     * The token to be used for the next set of paginated results. You don't need to supply a value for this field in the initial request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per each request.
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeOptOutListsResult {
    /**
     * An array of OptOutListInformation objects that contain the details for the requested OptOutLists.
     */
    OptOutLists?: OptOutListInformationList;
    /**
     * The token to be used for the next set of paginated results. If this field is empty then there are no more results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeOptedOutNumbersRequest {
    /**
     * The OptOutListName or OptOutListArn of the OptOutList. You can use DescribeOptOutLists to find the values for OptOutListName and OptOutListArn.
     */
    OptOutListName: OptOutListNameOrArn;
    /**
     * An array of phone numbers to search for in the OptOutList.
     */
    OptedOutNumbers?: OptedOutNumberList;
    /**
     * An array of OptedOutFilter objects to filter the results on.
     */
    Filters?: OptedOutFilterList;
    /**
     * The token to be used for the next set of paginated results. You don't need to supply a value for this field in the initial request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per each request.
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeOptedOutNumbersResult {
    /**
     * The Amazon Resource Name (ARN) of the OptOutList.
     */
    OptOutListArn?: String;
    /**
     * The name of the OptOutList.
     */
    OptOutListName?: OptOutListName;
    /**
     * An array of OptedOutNumbersInformation objects that provide information about the requested OptedOutNumbers.
     */
    OptedOutNumbers?: OptedOutNumberInformationList;
    /**
     * The token to be used for the next set of paginated results. If this field is empty then there are no more results.
     */
    NextToken?: NextToken;
  }
  export interface DescribePhoneNumbersRequest {
    /**
     * The unique identifier of phone numbers to find information about. This is an array of strings that can be either the PhoneNumberId or PhoneNumberArn.
     */
    PhoneNumberIds?: PhoneNumberIdList;
    /**
     * An array of PhoneNumberFilter objects to filter the results.
     */
    Filters?: PhoneNumberFilterList;
    /**
     * The token to be used for the next set of paginated results. You don't need to supply a value for this field in the initial request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per each request.
     */
    MaxResults?: MaxResults;
  }
  export interface DescribePhoneNumbersResult {
    /**
     * An array of PhoneNumberInformation objects that contain the details for the requested phone numbers.
     */
    PhoneNumbers?: PhoneNumberInformationList;
    /**
     * The token to be used for the next set of paginated results. If this field is empty then there are no more results.
     */
    NextToken?: NextToken;
  }
  export interface DescribePoolsRequest {
    /**
     * The unique identifier of pools to find. This is an array of strings that can be either the PoolId or PoolArn.
     */
    PoolIds?: PoolIdList;
    /**
     * An array of PoolFilter objects to filter the results.
     */
    Filters?: PoolFilterList;
    /**
     * The token to be used for the next set of paginated results. You don't need to supply a value for this field in the initial request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per each request.
     */
    MaxResults?: MaxResults;
  }
  export interface DescribePoolsResult {
    /**
     * An array of PoolInformation objects that contain the details for the requested pools. 
     */
    Pools?: PoolInformationList;
    /**
     * The token to be used for the next set of paginated results. If this field is empty then there are no more results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeSenderIdsRequest {
    /**
     * An array of SenderIdAndCountry objects to search for.
     */
    SenderIds?: SenderIdList;
    /**
     * An array of SenderIdFilter objects to filter the results.
     */
    Filters?: SenderIdFilterList;
    /**
     * The token to be used for the next set of paginated results. You don't need to supply a value for this field in the initial request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per each request.
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeSenderIdsResult {
    /**
     * An array of SernderIdInformation objects that contain the details for the requested SenderIds.
     */
    SenderIds?: SenderIdInformationList;
    /**
     * The token to be used for the next set of paginated results. If this field is empty then there are no more results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeSpendLimitsRequest {
    /**
     * The token to be used for the next set of paginated results. You don't need to supply a value for this field in the initial request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per each request.
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeSpendLimitsResult {
    /**
     * An array of SpendLimit objects that contain the details for the requested spend limits.
     */
    SpendLimits?: SpendLimitList;
    /**
     * The token to be used for the next set of paginated results. If this field is empty then there are no more results.
     */
    NextToken?: NextToken;
  }
  export type DestinationCountryParameterKey = "IN_TEMPLATE_ID"|"IN_ENTITY_ID"|string;
  export type DestinationCountryParameterValue = string;
  export type DestinationCountryParameters = {[key: string]: DestinationCountryParameterValue};
  export interface DisassociateOriginationIdentityRequest {
    /**
     * The unique identifier for the pool to disassociate with the origination identity. This value can be either the PoolId or PoolArn.
     */
    PoolId: PoolIdOrArn;
    /**
     * The origination identity to use such as a PhoneNumberId, PhoneNumberArn, SenderId or SenderIdArn. You can use DescribePhoneNumbers find the values for PhoneNumberId and PhoneNumberArn, or use DescribeSenderIds to get the values for SenderId and SenderIdArn.
     */
    OriginationIdentity: PhoneOrSenderIdOrArn;
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, for the country or region. 
     */
    IsoCountryCode: IsoCountryCode;
    /**
     * Unique, case-sensitive identifier you provide to ensure the idempotency of the request. If you don't specify a client token, a randomly generated token is used for the request to ensure idempotency.
     */
    ClientToken?: ClientToken;
  }
  export interface DisassociateOriginationIdentityResult {
    /**
     * The Amazon Resource Name (ARN) of the pool.
     */
    PoolArn?: String;
    /**
     * The PoolId of the pool no longer associated with the origination identity.
     */
    PoolId?: String;
    /**
     * The PhoneNumberArn or SenderIdArn of the origination identity.
     */
    OriginationIdentityArn?: String;
    /**
     * The PhoneNumberId or SenderId of the origination identity.
     */
    OriginationIdentity?: String;
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, for the country or region.
     */
    IsoCountryCode?: IsoCountryCode;
  }
  export interface EventDestination {
    /**
     * The name of the EventDestination.
     */
    EventDestinationName: EventDestinationName;
    /**
     * When set to true events will be logged.
     */
    Enabled: Boolean;
    /**
     * An array of event types that determine which events to log.
     */
    MatchingEventTypes: EventTypeList;
    /**
     * An object that contains information about an event destination that sends logging events to Amazon CloudWatch logs.
     */
    CloudWatchLogsDestination?: CloudWatchLogsDestination;
    /**
     * An object that contains information about an event destination for logging to Amazon Kinesis Data Firehose.
     */
    KinesisFirehoseDestination?: KinesisFirehoseDestination;
    /**
     * An object that contains information about an event destination that sends logging events to Amazon SNS.
     */
    SnsDestination?: SnsDestination;
  }
  export type EventDestinationList = EventDestination[];
  export type EventDestinationName = string;
  export type EventType = "ALL"|"TEXT_ALL"|"TEXT_SENT"|"TEXT_PENDING"|"TEXT_QUEUED"|"TEXT_SUCCESSFUL"|"TEXT_DELIVERED"|"TEXT_INVALID"|"TEXT_INVALID_MESSAGE"|"TEXT_UNREACHABLE"|"TEXT_CARRIER_UNREACHABLE"|"TEXT_BLOCKED"|"TEXT_CARRIER_BLOCKED"|"TEXT_SPAM"|"TEXT_UNKNOWN"|"TEXT_TTL_EXPIRED"|"VOICE_ALL"|"VOICE_INITIATED"|"VOICE_RINGING"|"VOICE_ANSWERED"|"VOICE_COMPLETED"|"VOICE_BUSY"|"VOICE_NO_ANSWER"|"VOICE_FAILED"|"VOICE_TTL_EXPIRED"|string;
  export type EventTypeList = EventType[];
  export type FilterValue = string;
  export type FilterValueList = FilterValue[];
  export type IamRoleArn = string;
  export type IsoCountryCode = string;
  export type Keyword = string;
  export type KeywordAction = "AUTOMATIC_RESPONSE"|"OPT_OUT"|"OPT_IN"|string;
  export interface KeywordFilter {
    /**
     * The name of the attribute to filter on.
     */
    Name: KeywordFilterName;
    /**
     * An array values to filter for.
     */
    Values: FilterValueList;
  }
  export type KeywordFilterList = KeywordFilter[];
  export type KeywordFilterName = "keyword-action"|string;
  export interface KeywordInformation {
    /**
     * The keyword as a string.
     */
    Keyword: Keyword;
    /**
     * A custom message that can be used with the keyword.
     */
    KeywordMessage: KeywordMessage;
    /**
     * The action to perform for the keyword.
     */
    KeywordAction: KeywordAction;
  }
  export type KeywordInformationList = KeywordInformation[];
  export type KeywordList = Keyword[];
  export type KeywordMessage = string;
  export interface KinesisFirehoseDestination {
    /**
     * The ARN of an Amazon Identity and Access Management (IAM) role that is able to write event data to an Amazon Firehose destination.
     */
    IamRoleArn: IamRoleArn;
    /**
     * The Amazon Resource Name (ARN) of the delivery stream.
     */
    DeliveryStreamArn: DeliveryStreamArn;
  }
  export interface ListPoolOriginationIdentitiesRequest {
    /**
     * The unique identifier for the pool. This value can be either the PoolId or PoolArn.
     */
    PoolId: PoolIdOrArn;
    /**
     * An array of PoolOriginationIdentitiesFilter objects to filter the results..
     */
    Filters?: PoolOriginationIdentitiesFilterList;
    /**
     * The token to be used for the next set of paginated results. You don't need to supply a value for this field in the initial request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per each request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListPoolOriginationIdentitiesResult {
    /**
     * The Amazon Resource Name (ARN) for the pool.
     */
    PoolArn?: String;
    /**
     * The unique PoolId of the pool.
     */
    PoolId?: String;
    /**
     * An array of any OriginationIdentityMetadata objects.
     */
    OriginationIdentities?: OriginationIdentityMetadataList;
    /**
     * The token to be used for the next set of paginated results. If this field is empty then there are no more results.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to query for.
     */
    ResourceArn: AmazonResourceName;
  }
  export interface ListTagsForResourceResult {
    /**
     * The ARN of the resource.
     */
    ResourceArn?: AmazonResourceName;
    /**
     * An array of key and value pair tags that are associated with the resource.
     */
    Tags?: TagList;
  }
  export type LogGroupArn = string;
  export type MaxPrice = string;
  export type MaxResults = number;
  export type MessageType = "TRANSACTIONAL"|"PROMOTIONAL"|string;
  export type MessageTypeList = MessageType[];
  export type MonthlyLimit = number;
  export type NextToken = string;
  export type NonEmptyTagList = Tag[];
  export type NumberCapability = "SMS"|"VOICE"|string;
  export type NumberCapabilityList = NumberCapability[];
  export type NumberStatus = "PENDING"|"ACTIVE"|"ASSOCIATING"|"DISASSOCIATING"|"DELETED"|string;
  export type NumberType = "SHORT_CODE"|"LONG_CODE"|"TOLL_FREE"|"TEN_DLC"|string;
  export interface OptOutListInformation {
    /**
     * The Amazon Resource Name (ARN) of the OptOutList.
     */
    OptOutListArn: String;
    /**
     * The name of the OptOutList.
     */
    OptOutListName: OptOutListName;
    /**
     * The time when the OutOutList was created, in UNIX epoch time format.
     */
    CreatedTimestamp: Timestamp;
  }
  export type OptOutListInformationList = OptOutListInformation[];
  export type OptOutListName = string;
  export type OptOutListNameList = OptOutListNameOrArn[];
  export type OptOutListNameOrArn = string;
  export interface OptedOutFilter {
    /**
     * The name of the attribute to filter on.
     */
    Name: OptedOutFilterName;
    /**
     * An array of values to filter for.
     */
    Values: FilterValueList;
  }
  export type OptedOutFilterList = OptedOutFilter[];
  export type OptedOutFilterName = "end-user-opted-out"|string;
  export interface OptedOutNumberInformation {
    /**
     * The phone number that is opted out.
     */
    OptedOutNumber: PhoneNumber;
    /**
     * The time that the op tout occurred, in UNIX epoch time format.
     */
    OptedOutTimestamp: Timestamp;
    /**
     * This is set to true if it was the end recipient that opted out.
     */
    EndUserOptedOut: PrimitiveBoolean;
  }
  export type OptedOutNumberInformationList = OptedOutNumberInformation[];
  export type OptedOutNumberList = PhoneNumber[];
  export interface OriginationIdentityMetadata {
    /**
     * The Amazon Resource Name (ARN) associated with the origination identity.
     */
    OriginationIdentityArn: String;
    /**
     * The unique identifier of the origination identity.
     */
    OriginationIdentity: String;
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, for the country or region. 
     */
    IsoCountryCode: IsoCountryCode;
    /**
     * Describes if the origination identity can be used for text messages, voice calls or both.
     */
    NumberCapabilities: NumberCapabilityList;
  }
  export type OriginationIdentityMetadataList = OriginationIdentityMetadata[];
  export type PhoneNumber = string;
  export interface PhoneNumberFilter {
    /**
     * The name of the attribute to filter on.
     */
    Name: PhoneNumberFilterName;
    /**
     * An array values to filter for.
     */
    Values: FilterValueList;
  }
  export type PhoneNumberFilterList = PhoneNumberFilter[];
  export type PhoneNumberFilterName = "status"|"iso-country-code"|"message-type"|"number-capability"|"number-type"|"two-way-enabled"|"self-managed-opt-outs-enabled"|"opt-out-list-name"|"deletion-protection-enabled"|string;
  export type PhoneNumberIdList = PhoneNumberIdOrArn[];
  export type PhoneNumberIdOrArn = string;
  export interface PhoneNumberInformation {
    /**
     * The Amazon Resource Name (ARN) associated with the phone number.
     */
    PhoneNumberArn: String;
    /**
     * The unique identifier for the phone number.
     */
    PhoneNumberId?: String;
    /**
     * The phone number in E.164 format.
     */
    PhoneNumber: PhoneNumber;
    /**
     * The current status of the phone number.
     */
    Status: NumberStatus;
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, for the country or region. 
     */
    IsoCountryCode: IsoCountryCode;
    /**
     * The type of message. Valid values are TRANSACTIONAL for messages that are critical or time-sensitive and PROMOTIONAL for messages that aren't critical or time-sensitive.
     */
    MessageType: MessageType;
    /**
     * Describes if the origination identity can be used for text messages, voice calls or both.
     */
    NumberCapabilities: NumberCapabilityList;
    /**
     * The type of phone number.
     */
    NumberType: NumberType;
    /**
     * The price, in US dollars, to lease the phone number.
     */
    MonthlyLeasingPrice: String;
    /**
     * By default this is set to false. When set to true you can receive incoming text messages from your end recipients using the TwoWayChannelArn.
     */
    TwoWayEnabled: PrimitiveBoolean;
    /**
     * The Amazon Resource Name (ARN) of the two way channel.
     */
    TwoWayChannelArn?: TwoWayChannelArn;
    /**
     * When set to false an end recipient sends a message that begins with HELP or STOP to one of your dedicated numbers, Amazon Pinpoint automatically replies with a customizable message and adds the end recipient to the OptOutList. When set to true you're responsible for responding to HELP and STOP requests. You're also responsible for tracking and honoring opt-out request. For more information see Self-managed opt-outs 
     */
    SelfManagedOptOutsEnabled: PrimitiveBoolean;
    /**
     * The name of the OptOutList associated with the phone number.
     */
    OptOutListName: OptOutListName;
    /**
     * When set to true the phone number can't be deleted.
     */
    DeletionProtectionEnabled: PrimitiveBoolean;
    /**
     * The unique identifier of the pool associated with the phone number.
     */
    PoolId?: String;
    /**
     * The time when the phone number was created, in UNIX epoch time format.
     */
    CreatedTimestamp: Timestamp;
  }
  export type PhoneNumberInformationList = PhoneNumberInformation[];
  export type PhoneOrPoolIdOrArn = string;
  export type PhoneOrSenderIdOrArn = string;
  export interface PoolFilter {
    /**
     * The name of the attribute to filter on.
     */
    Name: PoolFilterName;
    /**
     * An array values to filter for.
     */
    Values: FilterValueList;
  }
  export type PoolFilterList = PoolFilter[];
  export type PoolFilterName = "status"|"message-type"|"two-way-enabled"|"self-managed-opt-outs-enabled"|"opt-out-list-name"|"shared-routes-enabled"|"deletion-protection-enabled"|string;
  export type PoolIdList = PoolIdOrArn[];
  export type PoolIdOrArn = string;
  export interface PoolInformation {
    /**
     * The Amazon Resource Name (ARN) for the pool.
     */
    PoolArn: String;
    /**
     * The unique identifier for the pool.
     */
    PoolId: String;
    /**
     * The current status of the pool.
     */
    Status: PoolStatus;
    /**
     * The type of message. Valid values are TRANSACTIONAL for messages that are critical or time-sensitive and PROMOTIONAL for messages that aren't critical or time-sensitive.
     */
    MessageType: MessageType;
    /**
     * When set to true you can receive incoming text messages from your end recipients using the TwoWayChannelArn.
     */
    TwoWayEnabled: PrimitiveBoolean;
    /**
     * The Amazon Resource Name (ARN) of the two way channel.
     */
    TwoWayChannelArn?: TwoWayChannelArn;
    /**
     * When set to false, an end recipient sends a message that begins with HELP or STOP to one of your dedicated numbers, Amazon Pinpoint automatically replies with a customizable message and adds the end recipient to the OptOutList. When set to true you're responsible for responding to HELP and STOP requests. You're also responsible for tracking and honoring opt-out requests. For more information see Self-managed opt-outs 
     */
    SelfManagedOptOutsEnabled: PrimitiveBoolean;
    /**
     * The name of the OptOutList associated with the pool.
     */
    OptOutListName: OptOutListName;
    /**
     * Allows you to enable shared routes on your pool. By default, this is set to False. If you set this value to True, your messages are sent using phone numbers or sender IDs (depending on the country) that are shared with other Amazon Pinpoint users. In some countries, such as the United States, senders aren't allowed to use shared routes and must use a dedicated phone number or short code.
     */
    SharedRoutesEnabled: PrimitiveBoolean;
    /**
     * When set to true the pool can't be deleted.
     */
    DeletionProtectionEnabled: PrimitiveBoolean;
    /**
     * The time when the pool was created, in UNIX epoch time format.
     */
    CreatedTimestamp: Timestamp;
  }
  export type PoolInformationList = PoolInformation[];
  export interface PoolOriginationIdentitiesFilter {
    /**
     * The name of the attribute to filter on.
     */
    Name: PoolOriginationIdentitiesFilterName;
    /**
     * An array values to filter for.
     */
    Values: FilterValueList;
  }
  export type PoolOriginationIdentitiesFilterList = PoolOriginationIdentitiesFilter[];
  export type PoolOriginationIdentitiesFilterName = "iso-country-code"|"number-capability"|string;
  export type PoolStatus = "CREATING"|"ACTIVE"|"DELETING"|string;
  export type PrimitiveBoolean = boolean;
  export type PrimitiveLong = number;
  export interface PutKeywordRequest {
    /**
     * The origination identity to use such as a PhoneNumberId, PhoneNumberArn, SenderId or SenderIdArn. You can use DescribePhoneNumbers get the values for PhoneNumberId and PhoneNumberArn while DescribeSenderIds can be used to get the values for SenderId and SenderIdArn.
     */
    OriginationIdentity: PhoneOrPoolIdOrArn;
    /**
     * The new keyword to add.
     */
    Keyword: Keyword;
    /**
     * The message associated with the keyword.   AUTOMATIC_RESPONSE: A message is sent to the recipient.   OPT_OUT: Keeps the recipient from receiving future messages.   OPT_IN: The recipient wants to receive future messages.  
     */
    KeywordMessage: KeywordMessage;
    /**
     * The action to perform for the new keyword when it is received.
     */
    KeywordAction?: KeywordAction;
  }
  export interface PutKeywordResult {
    /**
     * The PhoneNumberArn or PoolArn that the keyword was associated with.
     */
    OriginationIdentityArn?: String;
    /**
     * The PhoneNumberId or PoolId that the keyword was associated with.
     */
    OriginationIdentity?: String;
    /**
     * The keyword that was added.
     */
    Keyword?: Keyword;
    /**
     * The message associated with the keyword.
     */
    KeywordMessage?: KeywordMessage;
    /**
     * The action to perform when the keyword is used.
     */
    KeywordAction?: KeywordAction;
  }
  export interface PutOptedOutNumberRequest {
    /**
     * The OptOutListName or OptOutListArn to add the phone number to.
     */
    OptOutListName: OptOutListNameOrArn;
    /**
     * The phone number to add to the OptOutList in E.164 format.
     */
    OptedOutNumber: PhoneNumber;
  }
  export interface PutOptedOutNumberResult {
    /**
     * The OptOutListArn that the phone number was removed from.
     */
    OptOutListArn?: String;
    /**
     * The OptOutListName that the phone number was removed from.
     */
    OptOutListName?: OptOutListName;
    /**
     * The phone number that was added to the OptOutList.
     */
    OptedOutNumber?: PhoneNumber;
    /**
     * The time that the phone number was added to the OptOutList, in UNIX epoch time format.
     */
    OptedOutTimestamp?: Timestamp;
    /**
     * This is true if it was the end user who requested their phone number be removed. 
     */
    EndUserOptedOut?: PrimitiveBoolean;
  }
  export type RegistrationId = string;
  export interface ReleasePhoneNumberRequest {
    /**
     * The PhoneNumberId or PhoneNumberArn of the phone number to release. You can use DescribePhoneNumbers to get the values for PhoneNumberId and PhoneNumberArn.
     */
    PhoneNumberId: PhoneNumberIdOrArn;
  }
  export interface ReleasePhoneNumberResult {
    /**
     * The PhoneNumberArn of the phone number that was released.
     */
    PhoneNumberArn?: String;
    /**
     * The PhoneNumberId of the phone number that was released.
     */
    PhoneNumberId?: String;
    /**
     * The phone number that was released.
     */
    PhoneNumber?: PhoneNumber;
    /**
     * The current status of the request.
     */
    Status?: NumberStatus;
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, for the country or region.
     */
    IsoCountryCode?: IsoCountryCode;
    /**
     * The message type that was associated with the phone number.
     */
    MessageType?: MessageType;
    /**
     * Specifies if the number could be used for text messages, voice, or both.
     */
    NumberCapabilities?: NumberCapabilityList;
    /**
     * The type of number that was released.
     */
    NumberType?: NumberType;
    /**
     * The monthly price of the phone number, in US dollars.
     */
    MonthlyLeasingPrice?: String;
    /**
     * By default this is set to false. When set to true you can receive incoming text messages from your end recipients.
     */
    TwoWayEnabled?: PrimitiveBoolean;
    /**
     * The Amazon Resource Name (ARN) of the TwoWayChannel.
     */
    TwoWayChannelArn?: TwoWayChannelArn;
    /**
     * By default this is set to false. When an end recipient sends a message that begins with HELP or STOP to one of your dedicated numbers, Amazon Pinpoint automatically replies with a customizable message and adds the end recipient to the OptOutList. When set to true you're responsible for responding to HELP and STOP requests. You're also responsible for tracking and honoring opt-out requests.
     */
    SelfManagedOptOutsEnabled?: PrimitiveBoolean;
    /**
     * The name of the OptOutList that was associated with the phone number.
     */
    OptOutListName?: OptOutListName;
    /**
     * The time when the phone number was created, in UNIX epoch time format.
     */
    CreatedTimestamp?: Timestamp;
  }
  export interface RequestPhoneNumberRequest {
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, for the country or region. 
     */
    IsoCountryCode: IsoCountryCode;
    /**
     * The type of message. Valid values are TRANSACTIONAL for messages that are critical or time-sensitive and PROMOTIONAL for messages that aren't critical or time-sensitive.
     */
    MessageType: MessageType;
    /**
     * Indicates if the phone number will be used for text messages, voice messages, or both. 
     */
    NumberCapabilities: NumberCapabilityList;
    /**
     * The type of phone number to request.
     */
    NumberType: RequestableNumberType;
    /**
     * The name of the OptOutList to associate with the phone number. You can use the OutOutListName or OptPutListArn.
     */
    OptOutListName?: OptOutListNameOrArn;
    /**
     * The pool to associated with the phone number. You can use the PoolId or PoolArn. 
     */
    PoolId?: PoolIdOrArn;
    /**
     * Use this field to attach your phone number for an external registration process.
     */
    RegistrationId?: RegistrationId;
    /**
     * By default this is set to false. When set to true the phone number can't be deleted.
     */
    DeletionProtectionEnabled?: Boolean;
    /**
     * An array of tags (key and value pairs) associate with the requested phone number. 
     */
    Tags?: TagList;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don't specify a client token, a randomly generated token is used for the request to ensure idempotency.
     */
    ClientToken?: ClientToken;
  }
  export interface RequestPhoneNumberResult {
    /**
     * The Amazon Resource Name (ARN) of the requested phone number.
     */
    PhoneNumberArn?: String;
    /**
     * The unique identifier of the new phone number.
     */
    PhoneNumberId?: String;
    /**
     * The new phone number that was requested.
     */
    PhoneNumber?: PhoneNumber;
    /**
     * The current status of the request.
     */
    Status?: NumberStatus;
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, for the country or region. 
     */
    IsoCountryCode?: IsoCountryCode;
    /**
     * The type of message. Valid values are TRANSACTIONAL for messages that are critical or time-sensitive and PROMOTIONAL for messages that aren't critical or time-sensitive.
     */
    MessageType?: MessageType;
    /**
     * Indicates if the phone number will be used for text messages, voice messages or both. 
     */
    NumberCapabilities?: NumberCapabilityList;
    /**
     * The type of number that was released.
     */
    NumberType?: RequestableNumberType;
    /**
     * The monthly price, in US dollars, to lease the phone number.
     */
    MonthlyLeasingPrice?: String;
    /**
     * By default this is set to false. When set to true you can receive incoming text messages from your end recipients.
     */
    TwoWayEnabled?: PrimitiveBoolean;
    /**
     * The ARN used to identify the two way channel.
     */
    TwoWayChannelArn?: TwoWayChannelArn;
    /**
     * By default this is set to false. When an end recipient sends a message that begins with HELP or STOP to one of your dedicated numbers, Amazon Pinpoint automatically replies with a customizable message and adds the end recipient to the OptOutList. When set to true you're responsible for responding to HELP and STOP requests. You're also responsible for tracking and honoring opt-out requests.
     */
    SelfManagedOptOutsEnabled?: PrimitiveBoolean;
    /**
     * The name of the OptOutList that is associated with the requested phone number.
     */
    OptOutListName?: OptOutListName;
    /**
     * By default this is set to false. When set to true the phone number can't be deleted. 
     */
    DeletionProtectionEnabled?: PrimitiveBoolean;
    /**
     * The unique identifier of the pool associated with the phone number 
     */
    PoolId?: String;
    /**
     * An array of key and value pair tags that are associated with the phone number.
     */
    Tags?: TagList;
    /**
     * The time when the phone number was created, in UNIX epoch time format.
     */
    CreatedTimestamp?: Timestamp;
  }
  export type RequestableNumberType = "LONG_CODE"|"TOLL_FREE"|"TEN_DLC"|string;
  export interface SendTextMessageRequest {
    /**
     * The destination phone number in E.164 format.
     */
    DestinationPhoneNumber: PhoneNumber;
    /**
     * The origination identity of the message. This can be either the PhoneNumber, PhoneNumberId, PhoneNumberArn, SenderId, SenderIdArn, PoolId, or PoolArn.
     */
    OriginationIdentity?: TextMessageOriginationIdentity;
    /**
     * The body of the text message.
     */
    MessageBody?: TextMessageBody;
    /**
     * The type of message. Valid values are TRANSACTIONAL for messages that are critical or time-sensitive and PROMOTIONAL for messages that aren't critical or time-sensitive.
     */
    MessageType?: MessageType;
    /**
     * When you register a short code in the US, you must specify a program name. If you don’t have a US short code, omit this attribute.
     */
    Keyword?: Keyword;
    /**
     * The name of the configuration set to use. This can be either the ConfigurationSetName or ConfigurationSetArn.
     */
    ConfigurationSetName?: ConfigurationSetNameOrArn;
    /**
     * The maximum amount that you want to spend, in US dollars, per each text message part. A text message can contain multiple parts.
     */
    MaxPrice?: MaxPrice;
    /**
     * How long the text message is valid for. By default this is 72 hours.
     */
    TimeToLive?: TimeToLive;
    /**
     * You can specify custom data in this field. If you do, that data is logged to the event destination.
     */
    Context?: ContextMap;
    /**
     * This field is used for any country-specific registration requirements. Currently, this setting is only used when you send messages to recipients in India using a sender ID. For more information see Special requirements for sending SMS messages to recipients in India. 
     */
    DestinationCountryParameters?: DestinationCountryParameters;
    /**
     * When set to true, the message is checked and validated, but isn't sent to the end recipient.
     */
    DryRun?: PrimitiveBoolean;
  }
  export interface SendTextMessageResult {
    /**
     * The unique identifier for the message.
     */
    MessageId?: String;
  }
  export interface SendVoiceMessageRequest {
    /**
     * The destination phone number in E.164 format.
     */
    DestinationPhoneNumber: PhoneNumber;
    /**
     * The origination identity to use for the voice call. This can be the PhoneNumber, PhoneNumberId, PhoneNumberArn, PoolId, or PoolArn.
     */
    OriginationIdentity: VoiceMessageOriginationIdentity;
    /**
     * The text to convert to a voice message.
     */
    MessageBody?: VoiceMessageBody;
    /**
     * Specifies if the MessageBody field contains text or speech synthesis markup language (SSML).   TEXT: This is the default value. When used the maximum character limit is 3000.   SSML: When used the maximum character limit is 6000 including SSML tagging.  
     */
    MessageBodyTextType?: VoiceMessageBodyTextType;
    /**
     * The voice for the Amazon Polly service to use. By default this is set to "MATTHEW".
     */
    VoiceId?: VoiceId;
    /**
     * The name of the configuration set to use. This can be either the ConfigurationSetName or ConfigurationSetArn.
     */
    ConfigurationSetName?: ConfigurationSetNameOrArn;
    /**
     * The maximum amount to spend per voice message, in US dollars.
     */
    MaxPricePerMinute?: MaxPrice;
    /**
     * How long the voice message is valid for. By default this is 72 hours.
     */
    TimeToLive?: TimeToLive;
    /**
     * You can specify custom data in this field. If you do, that data is logged to the event destination.
     */
    Context?: ContextMap;
    /**
     * When set to true, the message is checked and validated, but isn't sent to the end recipient.
     */
    DryRun?: PrimitiveBoolean;
  }
  export interface SendVoiceMessageResult {
    /**
     * The unique identifier for the message.
     */
    MessageId?: String;
  }
  export type SenderId = string;
  export interface SenderIdAndCountry {
    /**
     * The unique identifier of the sender.
     */
    SenderId: SenderIdOrArn;
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, for the country or region. 
     */
    IsoCountryCode: IsoCountryCode;
  }
  export interface SenderIdFilter {
    /**
     * The name of the attribute to filter on.
     */
    Name: SenderIdFilterName;
    /**
     * An array of values to filter for.
     */
    Values: FilterValueList;
  }
  export type SenderIdFilterList = SenderIdFilter[];
  export type SenderIdFilterName = "sender-id"|"iso-country-code"|"message-type"|string;
  export interface SenderIdInformation {
    /**
     * The Amazon Resource Name (ARN) associated with the SenderId.
     */
    SenderIdArn: String;
    /**
     * The alphanumeric sender ID in a specific country that you'd like to describe.
     */
    SenderId: SenderId;
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, for the country or region. 
     */
    IsoCountryCode: IsoCountryCode;
    /**
     * The type of message. Valid values are TRANSACTIONAL for messages that are critical or time-sensitive and PROMOTIONAL for messages that aren't critical or time-sensitive.
     */
    MessageTypes: MessageTypeList;
    /**
     * The monthly leasing price, in US dollars.
     */
    MonthlyLeasingPrice: String;
  }
  export type SenderIdInformationList = SenderIdInformation[];
  export type SenderIdList = SenderIdAndCountry[];
  export type SenderIdOrArn = string;
  export interface SetDefaultMessageTypeRequest {
    /**
     * The configuration set to update with a new default message type. This field can be the ConsigurationSetName or ConfigurationSetArn.
     */
    ConfigurationSetName: ConfigurationSetNameOrArn;
    /**
     * The type of message. Valid values are TRANSACTIONAL for messages that are critical or time-sensitive and PROMOTIONAL for messages that aren't critical or time-sensitive.
     */
    MessageType: MessageType;
  }
  export interface SetDefaultMessageTypeResult {
    /**
     * The Amazon Resource Name (ARN) of the updated configuration set.
     */
    ConfigurationSetArn?: String;
    /**
     * The name of the configuration set that was updated.
     */
    ConfigurationSetName?: ConfigurationSetName;
    /**
     * The new default message type of the configuration set.
     */
    MessageType?: MessageType;
  }
  export interface SetDefaultSenderIdRequest {
    /**
     * The configuration set to updated with a new default SenderId. This field can be the ConsigurationSetName or ConfigurationSetArn.
     */
    ConfigurationSetName: ConfigurationSetNameOrArn;
    /**
     * The current sender ID for the configuration set. When sending a text message to a destination country which supports SenderIds, the default sender ID on the configuration set specified on SendTextMessage will be used if no dedicated origination phone numbers or registered SenderIds are available in your account, instead of a generic sender ID, such as 'NOTICE'.
     */
    SenderId: SenderId;
  }
  export interface SetDefaultSenderIdResult {
    /**
     * The Amazon Resource Name (ARN) of the updated configuration set.
     */
    ConfigurationSetArn?: String;
    /**
     * The name of the configuration set that was updated.
     */
    ConfigurationSetName?: ConfigurationSetName;
    /**
     * The default sender ID to set for the ConfigurationSet.
     */
    SenderId?: SenderId;
  }
  export interface SetTextMessageSpendLimitOverrideRequest {
    /**
     * The new monthly limit to enforce on text messages.
     */
    MonthlyLimit: MonthlyLimit;
  }
  export interface SetTextMessageSpendLimitOverrideResult {
    /**
     * The current monthly limit to enforce on sending text messages.
     */
    MonthlyLimit?: MonthlyLimit;
  }
  export interface SetVoiceMessageSpendLimitOverrideRequest {
    /**
     * The new monthly limit to enforce on voice messages.
     */
    MonthlyLimit: MonthlyLimit;
  }
  export interface SetVoiceMessageSpendLimitOverrideResult {
    /**
     * The current monthly limit to enforce on sending voice messages.
     */
    MonthlyLimit?: MonthlyLimit;
  }
  export interface SnsDestination {
    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic that you want to publish events to.
     */
    TopicArn: SnsTopicArn;
  }
  export type SnsTopicArn = string;
  export interface SpendLimit {
    /**
     * The name for the SpendLimit.
     */
    Name: SpendLimitName;
    /**
     * The maximum amount of money, in US dollars, that you want to be able to spend sending messages each month. This value has to be less than or equal to the amount in MaxLimit. To use this custom limit, Overridden must be set to true.
     */
    EnforcedLimit: PrimitiveLong;
    /**
     *  The maximum amount of money that you are able to spend to send messages each month, in US dollars.
     */
    MaxLimit: PrimitiveLong;
    /**
     * When set to True, the value that has been specified in the EnforcedLimit is used to determine the maximum amount in US dollars that can be spent to send messages each month, in US dollars.
     */
    Overridden: PrimitiveBoolean;
  }
  export type SpendLimitList = SpendLimit[];
  export type SpendLimitName = "TEXT_MESSAGE_MONTHLY_SPEND_LIMIT"|"VOICE_MESSAGE_MONTHLY_SPEND_LIMIT"|string;
  export type String = string;
  export interface Tag {
    /**
     * The key identifier, or name, of the tag.
     */
    Key: TagKey;
    /**
     * The string value associated with the key of the tag.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: AmazonResourceName;
    /**
     * An array of key and value pair tags that are associated with the resource.
     */
    Tags: NonEmptyTagList;
  }
  export interface TagResourceResult {
  }
  export type TagValue = string;
  export type TextMessageBody = string;
  export type TextMessageOriginationIdentity = string;
  export type TimeToLive = number;
  export type Timestamp = Date;
  export type TwoWayChannelArn = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: AmazonResourceName;
    /**
     * An array of tag key values to unassociate with the resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResult {
  }
  export interface UpdateEventDestinationRequest {
    /**
     * The configuration set to update with the new event destination. Valid values for this can be the ConfigurationSetName or ConfigurationSetArn.
     */
    ConfigurationSetName: ConfigurationSetNameOrArn;
    /**
     * The name to use for the event destination.
     */
    EventDestinationName: EventDestinationName;
    /**
     * When set to true logging is enabled.
     */
    Enabled?: Boolean;
    /**
     * An array of event types that determine which events to log.
     */
    MatchingEventTypes?: EventTypeList;
    /**
     * An object that contains information about an event destination that sends data to CloudWatch Logs.
     */
    CloudWatchLogsDestination?: CloudWatchLogsDestination;
    /**
     * An object that contains information about an event destination for logging to Kinesis Data Firehose.
     */
    KinesisFirehoseDestination?: KinesisFirehoseDestination;
    /**
     * An object that contains information about an event destination that sends data to Amazon SNS.
     */
    SnsDestination?: SnsDestination;
  }
  export interface UpdateEventDestinationResult {
    /**
     * The Amazon Resource Name (ARN) for the ConfigurationSet that was updated.
     */
    ConfigurationSetArn?: String;
    /**
     * The name of the configuration set.
     */
    ConfigurationSetName?: ConfigurationSetName;
    /**
     * An EventDestination object containing the details of where events will be logged. 
     */
    EventDestination?: EventDestination;
  }
  export interface UpdatePhoneNumberRequest {
    /**
     * The unique identifier of the phone number. Valid values for this field can be either the PhoneNumberId or PhoneNumberArn.
     */
    PhoneNumberId: PhoneNumberIdOrArn;
    /**
     * By default this is set to false. When set to true you can receive incoming text messages from your end recipients.
     */
    TwoWayEnabled?: Boolean;
    /**
     * The Amazon Resource Name (ARN) of the two way channel.
     */
    TwoWayChannelArn?: TwoWayChannelArn;
    /**
     * By default this is set to false. When an end recipient sends a message that begins with HELP or STOP to one of your dedicated numbers, Amazon Pinpoint automatically replies with a customizable message and adds the end recipient to the OptOutList. When set to true you're responsible for responding to HELP and STOP requests. You're also responsible for tracking and honoring opt-out requests.
     */
    SelfManagedOptOutsEnabled?: Boolean;
    /**
     * The OptOutList to add the phone number to. Valid values for this field can be either the OutOutListName or OutOutListArn.
     */
    OptOutListName?: OptOutListNameOrArn;
    /**
     * By default this is set to false. When set to true the phone number can't be deleted. 
     */
    DeletionProtectionEnabled?: Boolean;
  }
  export interface UpdatePhoneNumberResult {
    /**
     * The Amazon Resource Name (ARN) of the updated phone number.
     */
    PhoneNumberArn?: String;
    /**
     * The unique identifier of the phone number.
     */
    PhoneNumberId?: String;
    /**
     * The phone number that was updated.
     */
    PhoneNumber?: PhoneNumber;
    /**
     * The current status of the request.
     */
    Status?: NumberStatus;
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, for the country or region. 
     */
    IsoCountryCode?: IsoCountryCode;
    /**
     * The type of message. Valid values are TRANSACTIONAL for messages that are critical or time-sensitive and PROMOTIONAL for messages that aren't critical or time-sensitive.
     */
    MessageType?: MessageType;
    /**
     * Specifies if the number could be used for text messages, voice or both.
     */
    NumberCapabilities?: NumberCapabilityList;
    /**
     * The type of number that was requested.
     */
    NumberType?: NumberType;
    /**
     * The monthly leasing price of the phone number, in US dollars.
     */
    MonthlyLeasingPrice?: String;
    /**
     * By default this is set to false. When set to true you can receive incoming text messages from your end recipients.
     */
    TwoWayEnabled?: PrimitiveBoolean;
    /**
     * The Amazon Resource Name (ARN) of the two way channel.
     */
    TwoWayChannelArn?: TwoWayChannelArn;
    /**
     * This is true if self managed opt-out are enabled.
     */
    SelfManagedOptOutsEnabled?: PrimitiveBoolean;
    /**
     * The name of the OptOutList associated with the phone number.
     */
    OptOutListName?: OptOutListName;
    /**
     * When set to true the phone number can't be deleted.
     */
    DeletionProtectionEnabled?: PrimitiveBoolean;
    /**
     * The time when the phone number was created, in UNIX epoch time format.
     */
    CreatedTimestamp?: Timestamp;
  }
  export interface UpdatePoolRequest {
    /**
     * The unique identifier of the pool to update. Valid values are either the PoolId or PoolArn.
     */
    PoolId: PoolIdOrArn;
    /**
     * By default this is set to false. When set to true you can receive incoming text messages from your end recipients.
     */
    TwoWayEnabled?: Boolean;
    /**
     * The Amazon Resource Name (ARN) of the two way channel.
     */
    TwoWayChannelArn?: TwoWayChannelArn;
    /**
     * By default this is set to false. When an end recipient sends a message that begins with HELP or STOP to one of your dedicated numbers, Amazon Pinpoint automatically replies with a customizable message and adds the end recipient to the OptOutList. When set to true you're responsible for responding to HELP and STOP requests. You're also responsible for tracking and honoring opt-out requests.
     */
    SelfManagedOptOutsEnabled?: Boolean;
    /**
     * The OptOutList to associate with the pool. Valid values are either OptOutListName or OptOutListArn.
     */
    OptOutListName?: OptOutListNameOrArn;
    /**
     * Indicates whether shared routes are enabled for the pool.
     */
    SharedRoutesEnabled?: Boolean;
    /**
     * When set to true the pool can't be deleted.
     */
    DeletionProtectionEnabled?: Boolean;
  }
  export interface UpdatePoolResult {
    /**
     * The ARN of the pool.
     */
    PoolArn?: String;
    /**
     * The unique identifier of the pool.
     */
    PoolId?: String;
    /**
     * The current status of the pool update request.
     */
    Status?: PoolStatus;
    /**
     * The type of message for the pool to use.
     */
    MessageType?: MessageType;
    /**
     * By default this is set to false. When set to true you can receive incoming text messages from your end recipients.
     */
    TwoWayEnabled?: PrimitiveBoolean;
    /**
     * The Amazon Resource Name (ARN) of the two way channel.
     */
    TwoWayChannelArn?: TwoWayChannelArn;
    /**
     * When an end recipient sends a message that begins with HELP or STOP to one of your dedicated numbers, Amazon Pinpoint automatically replies with a customizable message and adds the end recipient to the OptOutList. When set to true you're responsible for responding to HELP and STOP requests. You're also responsible for tracking and honoring opt-out requests.
     */
    SelfManagedOptOutsEnabled?: PrimitiveBoolean;
    /**
     * The name of the OptOutList associated with the pool.
     */
    OptOutListName?: OptOutListName;
    /**
     * Indicates whether shared routes are enabled for the pool.
     */
    SharedRoutesEnabled?: PrimitiveBoolean;
    /**
     * When set to true the pool can't be deleted.
     */
    DeletionProtectionEnabled?: PrimitiveBoolean;
    /**
     * The time when the pool was created, in UNIX epoch time format.
     */
    CreatedTimestamp?: Timestamp;
  }
  export type VoiceId = "AMY"|"ASTRID"|"BIANCA"|"BRIAN"|"CAMILA"|"CARLA"|"CARMEN"|"CELINE"|"CHANTAL"|"CONCHITA"|"CRISTIANO"|"DORA"|"EMMA"|"ENRIQUE"|"EWA"|"FILIZ"|"GERAINT"|"GIORGIO"|"GWYNETH"|"HANS"|"INES"|"IVY"|"JACEK"|"JAN"|"JOANNA"|"JOEY"|"JUSTIN"|"KARL"|"KENDRA"|"KIMBERLY"|"LEA"|"LIV"|"LOTTE"|"LUCIA"|"LUPE"|"MADS"|"MAJA"|"MARLENE"|"MATHIEU"|"MATTHEW"|"MAXIM"|"MIA"|"MIGUEL"|"MIZUKI"|"NAJA"|"NICOLE"|"PENELOPE"|"RAVEENA"|"RICARDO"|"RUBEN"|"RUSSELL"|"SALLI"|"SEOYEON"|"TAKUMI"|"TATYANA"|"VICKI"|"VITORIA"|"ZEINA"|"ZHIYU"|string;
  export type VoiceMessageBody = string;
  export type VoiceMessageBodyTextType = "TEXT"|"SSML"|string;
  export type VoiceMessageOriginationIdentity = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-03-31"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the PinpointSMSVoiceV2 client.
   */
  export import Types = PinpointSMSVoiceV2;
}
export = PinpointSMSVoiceV2;
