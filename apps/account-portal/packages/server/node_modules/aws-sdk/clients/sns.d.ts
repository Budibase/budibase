import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SNS extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SNS.Types.ClientConfiguration)
  config: Config & SNS.Types.ClientConfiguration;
  /**
   * Adds a statement to a topic's access control policy, granting access for the specified Amazon Web Services accounts to the specified actions.  To remove the ability to change topic permissions, you must deny permissions to the AddPermission, RemovePermission, and SetTopicAttributes actions in your IAM policy. 
   */
  addPermission(params: SNS.Types.AddPermissionInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds a statement to a topic's access control policy, granting access for the specified Amazon Web Services accounts to the specified actions.  To remove the ability to change topic permissions, you must deny permissions to the AddPermission, RemovePermission, and SetTopicAttributes actions in your IAM policy. 
   */
  addPermission(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Accepts a phone number and indicates whether the phone holder has opted out of receiving SMS messages from your Amazon Web Services account. You cannot send SMS messages to a number that is opted out. To resume sending messages, you can opt in the number by using the OptInPhoneNumber action.
   */
  checkIfPhoneNumberIsOptedOut(params: SNS.Types.CheckIfPhoneNumberIsOptedOutInput, callback?: (err: AWSError, data: SNS.Types.CheckIfPhoneNumberIsOptedOutResponse) => void): Request<SNS.Types.CheckIfPhoneNumberIsOptedOutResponse, AWSError>;
  /**
   * Accepts a phone number and indicates whether the phone holder has opted out of receiving SMS messages from your Amazon Web Services account. You cannot send SMS messages to a number that is opted out. To resume sending messages, you can opt in the number by using the OptInPhoneNumber action.
   */
  checkIfPhoneNumberIsOptedOut(callback?: (err: AWSError, data: SNS.Types.CheckIfPhoneNumberIsOptedOutResponse) => void): Request<SNS.Types.CheckIfPhoneNumberIsOptedOutResponse, AWSError>;
  /**
   * Verifies an endpoint owner's intent to receive messages by validating the token sent to the endpoint by an earlier Subscribe action. If the token is valid, the action creates a new subscription and returns its Amazon Resource Name (ARN). This call requires an AWS signature only when the AuthenticateOnUnsubscribe flag is set to "true".
   */
  confirmSubscription(params: SNS.Types.ConfirmSubscriptionInput, callback?: (err: AWSError, data: SNS.Types.ConfirmSubscriptionResponse) => void): Request<SNS.Types.ConfirmSubscriptionResponse, AWSError>;
  /**
   * Verifies an endpoint owner's intent to receive messages by validating the token sent to the endpoint by an earlier Subscribe action. If the token is valid, the action creates a new subscription and returns its Amazon Resource Name (ARN). This call requires an AWS signature only when the AuthenticateOnUnsubscribe flag is set to "true".
   */
  confirmSubscription(callback?: (err: AWSError, data: SNS.Types.ConfirmSubscriptionResponse) => void): Request<SNS.Types.ConfirmSubscriptionResponse, AWSError>;
  /**
   * Creates a platform application object for one of the supported push notification services, such as APNS and GCM (Firebase Cloud Messaging), to which devices and mobile apps may register. You must specify PlatformPrincipal and PlatformCredential attributes when using the CreatePlatformApplication action.  PlatformPrincipal and PlatformCredential are received from the notification service.   For ADM, PlatformPrincipal is client id and PlatformCredential is client secret.   For Baidu, PlatformPrincipal is API key and PlatformCredential is secret key.   For APNS and APNS_SANDBOX using certificate credentials, PlatformPrincipal is SSL certificate and PlatformCredential is private key.   For APNS and APNS_SANDBOX using token credentials, PlatformPrincipal is signing key ID and PlatformCredential is signing key.   For GCM (Firebase Cloud Messaging), there is no PlatformPrincipal and the PlatformCredential is API key.   For MPNS, PlatformPrincipal is TLS certificate and PlatformCredential is private key.   For WNS, PlatformPrincipal is Package Security Identifier and PlatformCredential is secret key.   You can use the returned PlatformApplicationArn as an attribute for the CreatePlatformEndpoint action.
   */
  createPlatformApplication(params: SNS.Types.CreatePlatformApplicationInput, callback?: (err: AWSError, data: SNS.Types.CreatePlatformApplicationResponse) => void): Request<SNS.Types.CreatePlatformApplicationResponse, AWSError>;
  /**
   * Creates a platform application object for one of the supported push notification services, such as APNS and GCM (Firebase Cloud Messaging), to which devices and mobile apps may register. You must specify PlatformPrincipal and PlatformCredential attributes when using the CreatePlatformApplication action.  PlatformPrincipal and PlatformCredential are received from the notification service.   For ADM, PlatformPrincipal is client id and PlatformCredential is client secret.   For Baidu, PlatformPrincipal is API key and PlatformCredential is secret key.   For APNS and APNS_SANDBOX using certificate credentials, PlatformPrincipal is SSL certificate and PlatformCredential is private key.   For APNS and APNS_SANDBOX using token credentials, PlatformPrincipal is signing key ID and PlatformCredential is signing key.   For GCM (Firebase Cloud Messaging), there is no PlatformPrincipal and the PlatformCredential is API key.   For MPNS, PlatformPrincipal is TLS certificate and PlatformCredential is private key.   For WNS, PlatformPrincipal is Package Security Identifier and PlatformCredential is secret key.   You can use the returned PlatformApplicationArn as an attribute for the CreatePlatformEndpoint action.
   */
  createPlatformApplication(callback?: (err: AWSError, data: SNS.Types.CreatePlatformApplicationResponse) => void): Request<SNS.Types.CreatePlatformApplicationResponse, AWSError>;
  /**
   * Creates an endpoint for a device and mobile app on one of the supported push notification services, such as GCM (Firebase Cloud Messaging) and APNS. CreatePlatformEndpoint requires the PlatformApplicationArn that is returned from CreatePlatformApplication. You can use the returned EndpointArn to send a message to a mobile app or by the Subscribe action for subscription to a topic. The CreatePlatformEndpoint action is idempotent, so if the requester already owns an endpoint with the same device token and attributes, that endpoint's ARN is returned without creating a new endpoint. For more information, see Using Amazon SNS Mobile Push Notifications.  When using CreatePlatformEndpoint with Baidu, two attributes must be provided: ChannelId and UserId. The token field must also contain the ChannelId. For more information, see Creating an Amazon SNS Endpoint for Baidu. 
   */
  createPlatformEndpoint(params: SNS.Types.CreatePlatformEndpointInput, callback?: (err: AWSError, data: SNS.Types.CreateEndpointResponse) => void): Request<SNS.Types.CreateEndpointResponse, AWSError>;
  /**
   * Creates an endpoint for a device and mobile app on one of the supported push notification services, such as GCM (Firebase Cloud Messaging) and APNS. CreatePlatformEndpoint requires the PlatformApplicationArn that is returned from CreatePlatformApplication. You can use the returned EndpointArn to send a message to a mobile app or by the Subscribe action for subscription to a topic. The CreatePlatformEndpoint action is idempotent, so if the requester already owns an endpoint with the same device token and attributes, that endpoint's ARN is returned without creating a new endpoint. For more information, see Using Amazon SNS Mobile Push Notifications.  When using CreatePlatformEndpoint with Baidu, two attributes must be provided: ChannelId and UserId. The token field must also contain the ChannelId. For more information, see Creating an Amazon SNS Endpoint for Baidu. 
   */
  createPlatformEndpoint(callback?: (err: AWSError, data: SNS.Types.CreateEndpointResponse) => void): Request<SNS.Types.CreateEndpointResponse, AWSError>;
  /**
   * Adds a destination phone number to an Amazon Web Services account in the SMS sandbox and sends a one-time password (OTP) to that phone number. When you start using Amazon SNS to send SMS messages, your Amazon Web Services account is in the SMS sandbox. The SMS sandbox provides a safe environment for you to try Amazon SNS features without risking your reputation as an SMS sender. While your Amazon Web Services account is in the SMS sandbox, you can use all of the features of Amazon SNS. However, you can send SMS messages only to verified destination phone numbers. For more information, including how to move out of the sandbox to send messages without restrictions, see SMS sandbox in the Amazon SNS Developer Guide.
   */
  createSMSSandboxPhoneNumber(params: SNS.Types.CreateSMSSandboxPhoneNumberInput, callback?: (err: AWSError, data: SNS.Types.CreateSMSSandboxPhoneNumberResult) => void): Request<SNS.Types.CreateSMSSandboxPhoneNumberResult, AWSError>;
  /**
   * Adds a destination phone number to an Amazon Web Services account in the SMS sandbox and sends a one-time password (OTP) to that phone number. When you start using Amazon SNS to send SMS messages, your Amazon Web Services account is in the SMS sandbox. The SMS sandbox provides a safe environment for you to try Amazon SNS features without risking your reputation as an SMS sender. While your Amazon Web Services account is in the SMS sandbox, you can use all of the features of Amazon SNS. However, you can send SMS messages only to verified destination phone numbers. For more information, including how to move out of the sandbox to send messages without restrictions, see SMS sandbox in the Amazon SNS Developer Guide.
   */
  createSMSSandboxPhoneNumber(callback?: (err: AWSError, data: SNS.Types.CreateSMSSandboxPhoneNumberResult) => void): Request<SNS.Types.CreateSMSSandboxPhoneNumberResult, AWSError>;
  /**
   * Creates a topic to which notifications can be published. Users can create at most 100,000 standard topics (at most 1,000 FIFO topics). For more information, see Creating an Amazon SNS topic in the Amazon SNS Developer Guide. This action is idempotent, so if the requester already owns a topic with the specified name, that topic's ARN is returned without creating a new topic.
   */
  createTopic(params: SNS.Types.CreateTopicInput, callback?: (err: AWSError, data: SNS.Types.CreateTopicResponse) => void): Request<SNS.Types.CreateTopicResponse, AWSError>;
  /**
   * Creates a topic to which notifications can be published. Users can create at most 100,000 standard topics (at most 1,000 FIFO topics). For more information, see Creating an Amazon SNS topic in the Amazon SNS Developer Guide. This action is idempotent, so if the requester already owns a topic with the specified name, that topic's ARN is returned without creating a new topic.
   */
  createTopic(callback?: (err: AWSError, data: SNS.Types.CreateTopicResponse) => void): Request<SNS.Types.CreateTopicResponse, AWSError>;
  /**
   * Deletes the endpoint for a device and mobile app from Amazon SNS. This action is idempotent. For more information, see Using Amazon SNS Mobile Push Notifications.  When you delete an endpoint that is also subscribed to a topic, then you must also unsubscribe the endpoint from the topic.
   */
  deleteEndpoint(params: SNS.Types.DeleteEndpointInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the endpoint for a device and mobile app from Amazon SNS. This action is idempotent. For more information, see Using Amazon SNS Mobile Push Notifications.  When you delete an endpoint that is also subscribed to a topic, then you must also unsubscribe the endpoint from the topic.
   */
  deleteEndpoint(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a platform application object for one of the supported push notification services, such as APNS and GCM (Firebase Cloud Messaging). For more information, see Using Amazon SNS Mobile Push Notifications. 
   */
  deletePlatformApplication(params: SNS.Types.DeletePlatformApplicationInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a platform application object for one of the supported push notification services, such as APNS and GCM (Firebase Cloud Messaging). For more information, see Using Amazon SNS Mobile Push Notifications. 
   */
  deletePlatformApplication(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Amazon Web Services account's verified or pending phone number from the SMS sandbox. When you start using Amazon SNS to send SMS messages, your Amazon Web Services account is in the SMS sandbox. The SMS sandbox provides a safe environment for you to try Amazon SNS features without risking your reputation as an SMS sender. While your Amazon Web Services account is in the SMS sandbox, you can use all of the features of Amazon SNS. However, you can send SMS messages only to verified destination phone numbers. For more information, including how to move out of the sandbox to send messages without restrictions, see SMS sandbox in the Amazon SNS Developer Guide.
   */
  deleteSMSSandboxPhoneNumber(params: SNS.Types.DeleteSMSSandboxPhoneNumberInput, callback?: (err: AWSError, data: SNS.Types.DeleteSMSSandboxPhoneNumberResult) => void): Request<SNS.Types.DeleteSMSSandboxPhoneNumberResult, AWSError>;
  /**
   * Deletes an Amazon Web Services account's verified or pending phone number from the SMS sandbox. When you start using Amazon SNS to send SMS messages, your Amazon Web Services account is in the SMS sandbox. The SMS sandbox provides a safe environment for you to try Amazon SNS features without risking your reputation as an SMS sender. While your Amazon Web Services account is in the SMS sandbox, you can use all of the features of Amazon SNS. However, you can send SMS messages only to verified destination phone numbers. For more information, including how to move out of the sandbox to send messages without restrictions, see SMS sandbox in the Amazon SNS Developer Guide.
   */
  deleteSMSSandboxPhoneNumber(callback?: (err: AWSError, data: SNS.Types.DeleteSMSSandboxPhoneNumberResult) => void): Request<SNS.Types.DeleteSMSSandboxPhoneNumberResult, AWSError>;
  /**
   * Deletes a topic and all its subscriptions. Deleting a topic might prevent some messages previously sent to the topic from being delivered to subscribers. This action is idempotent, so deleting a topic that does not exist does not result in an error.
   */
  deleteTopic(params: SNS.Types.DeleteTopicInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a topic and all its subscriptions. Deleting a topic might prevent some messages previously sent to the topic from being delivered to subscribers. This action is idempotent, so deleting a topic that does not exist does not result in an error.
   */
  deleteTopic(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Retrieves the specified inline DataProtectionPolicy document that is stored in the specified Amazon SNS topic. 
   */
  getDataProtectionPolicy(params: SNS.Types.GetDataProtectionPolicyInput, callback?: (err: AWSError, data: SNS.Types.GetDataProtectionPolicyResponse) => void): Request<SNS.Types.GetDataProtectionPolicyResponse, AWSError>;
  /**
   * Retrieves the specified inline DataProtectionPolicy document that is stored in the specified Amazon SNS topic. 
   */
  getDataProtectionPolicy(callback?: (err: AWSError, data: SNS.Types.GetDataProtectionPolicyResponse) => void): Request<SNS.Types.GetDataProtectionPolicyResponse, AWSError>;
  /**
   * Retrieves the endpoint attributes for a device on one of the supported push notification services, such as GCM (Firebase Cloud Messaging) and APNS. For more information, see Using Amazon SNS Mobile Push Notifications. 
   */
  getEndpointAttributes(params: SNS.Types.GetEndpointAttributesInput, callback?: (err: AWSError, data: SNS.Types.GetEndpointAttributesResponse) => void): Request<SNS.Types.GetEndpointAttributesResponse, AWSError>;
  /**
   * Retrieves the endpoint attributes for a device on one of the supported push notification services, such as GCM (Firebase Cloud Messaging) and APNS. For more information, see Using Amazon SNS Mobile Push Notifications. 
   */
  getEndpointAttributes(callback?: (err: AWSError, data: SNS.Types.GetEndpointAttributesResponse) => void): Request<SNS.Types.GetEndpointAttributesResponse, AWSError>;
  /**
   * Retrieves the attributes of the platform application object for the supported push notification services, such as APNS and GCM (Firebase Cloud Messaging). For more information, see Using Amazon SNS Mobile Push Notifications. 
   */
  getPlatformApplicationAttributes(params: SNS.Types.GetPlatformApplicationAttributesInput, callback?: (err: AWSError, data: SNS.Types.GetPlatformApplicationAttributesResponse) => void): Request<SNS.Types.GetPlatformApplicationAttributesResponse, AWSError>;
  /**
   * Retrieves the attributes of the platform application object for the supported push notification services, such as APNS and GCM (Firebase Cloud Messaging). For more information, see Using Amazon SNS Mobile Push Notifications. 
   */
  getPlatformApplicationAttributes(callback?: (err: AWSError, data: SNS.Types.GetPlatformApplicationAttributesResponse) => void): Request<SNS.Types.GetPlatformApplicationAttributesResponse, AWSError>;
  /**
   * Returns the settings for sending SMS messages from your Amazon Web Services account. These settings are set with the SetSMSAttributes action.
   */
  getSMSAttributes(params: SNS.Types.GetSMSAttributesInput, callback?: (err: AWSError, data: SNS.Types.GetSMSAttributesResponse) => void): Request<SNS.Types.GetSMSAttributesResponse, AWSError>;
  /**
   * Returns the settings for sending SMS messages from your Amazon Web Services account. These settings are set with the SetSMSAttributes action.
   */
  getSMSAttributes(callback?: (err: AWSError, data: SNS.Types.GetSMSAttributesResponse) => void): Request<SNS.Types.GetSMSAttributesResponse, AWSError>;
  /**
   * Retrieves the SMS sandbox status for the calling Amazon Web Services account in the target Amazon Web Services Region. When you start using Amazon SNS to send SMS messages, your Amazon Web Services account is in the SMS sandbox. The SMS sandbox provides a safe environment for you to try Amazon SNS features without risking your reputation as an SMS sender. While your Amazon Web Services account is in the SMS sandbox, you can use all of the features of Amazon SNS. However, you can send SMS messages only to verified destination phone numbers. For more information, including how to move out of the sandbox to send messages without restrictions, see SMS sandbox in the Amazon SNS Developer Guide.
   */
  getSMSSandboxAccountStatus(params: SNS.Types.GetSMSSandboxAccountStatusInput, callback?: (err: AWSError, data: SNS.Types.GetSMSSandboxAccountStatusResult) => void): Request<SNS.Types.GetSMSSandboxAccountStatusResult, AWSError>;
  /**
   * Retrieves the SMS sandbox status for the calling Amazon Web Services account in the target Amazon Web Services Region. When you start using Amazon SNS to send SMS messages, your Amazon Web Services account is in the SMS sandbox. The SMS sandbox provides a safe environment for you to try Amazon SNS features without risking your reputation as an SMS sender. While your Amazon Web Services account is in the SMS sandbox, you can use all of the features of Amazon SNS. However, you can send SMS messages only to verified destination phone numbers. For more information, including how to move out of the sandbox to send messages without restrictions, see SMS sandbox in the Amazon SNS Developer Guide.
   */
  getSMSSandboxAccountStatus(callback?: (err: AWSError, data: SNS.Types.GetSMSSandboxAccountStatusResult) => void): Request<SNS.Types.GetSMSSandboxAccountStatusResult, AWSError>;
  /**
   * Returns all of the properties of a subscription.
   */
  getSubscriptionAttributes(params: SNS.Types.GetSubscriptionAttributesInput, callback?: (err: AWSError, data: SNS.Types.GetSubscriptionAttributesResponse) => void): Request<SNS.Types.GetSubscriptionAttributesResponse, AWSError>;
  /**
   * Returns all of the properties of a subscription.
   */
  getSubscriptionAttributes(callback?: (err: AWSError, data: SNS.Types.GetSubscriptionAttributesResponse) => void): Request<SNS.Types.GetSubscriptionAttributesResponse, AWSError>;
  /**
   * Returns all of the properties of a topic. Topic properties returned might differ based on the authorization of the user.
   */
  getTopicAttributes(params: SNS.Types.GetTopicAttributesInput, callback?: (err: AWSError, data: SNS.Types.GetTopicAttributesResponse) => void): Request<SNS.Types.GetTopicAttributesResponse, AWSError>;
  /**
   * Returns all of the properties of a topic. Topic properties returned might differ based on the authorization of the user.
   */
  getTopicAttributes(callback?: (err: AWSError, data: SNS.Types.GetTopicAttributesResponse) => void): Request<SNS.Types.GetTopicAttributesResponse, AWSError>;
  /**
   * Lists the endpoints and endpoint attributes for devices in a supported push notification service, such as GCM (Firebase Cloud Messaging) and APNS. The results for ListEndpointsByPlatformApplication are paginated and return a limited list of endpoints, up to 100. If additional records are available after the first page results, then a NextToken string will be returned. To receive the next page, you call ListEndpointsByPlatformApplication again using the NextToken string received from the previous call. When there are no more records to return, NextToken will be null. For more information, see Using Amazon SNS Mobile Push Notifications.  This action is throttled at 30 transactions per second (TPS).
   */
  listEndpointsByPlatformApplication(params: SNS.Types.ListEndpointsByPlatformApplicationInput, callback?: (err: AWSError, data: SNS.Types.ListEndpointsByPlatformApplicationResponse) => void): Request<SNS.Types.ListEndpointsByPlatformApplicationResponse, AWSError>;
  /**
   * Lists the endpoints and endpoint attributes for devices in a supported push notification service, such as GCM (Firebase Cloud Messaging) and APNS. The results for ListEndpointsByPlatformApplication are paginated and return a limited list of endpoints, up to 100. If additional records are available after the first page results, then a NextToken string will be returned. To receive the next page, you call ListEndpointsByPlatformApplication again using the NextToken string received from the previous call. When there are no more records to return, NextToken will be null. For more information, see Using Amazon SNS Mobile Push Notifications.  This action is throttled at 30 transactions per second (TPS).
   */
  listEndpointsByPlatformApplication(callback?: (err: AWSError, data: SNS.Types.ListEndpointsByPlatformApplicationResponse) => void): Request<SNS.Types.ListEndpointsByPlatformApplicationResponse, AWSError>;
  /**
   * Lists the calling Amazon Web Services account's dedicated origination numbers and their metadata. For more information about origination numbers, see Origination numbers in the Amazon SNS Developer Guide.
   */
  listOriginationNumbers(params: SNS.Types.ListOriginationNumbersRequest, callback?: (err: AWSError, data: SNS.Types.ListOriginationNumbersResult) => void): Request<SNS.Types.ListOriginationNumbersResult, AWSError>;
  /**
   * Lists the calling Amazon Web Services account's dedicated origination numbers and their metadata. For more information about origination numbers, see Origination numbers in the Amazon SNS Developer Guide.
   */
  listOriginationNumbers(callback?: (err: AWSError, data: SNS.Types.ListOriginationNumbersResult) => void): Request<SNS.Types.ListOriginationNumbersResult, AWSError>;
  /**
   * Returns a list of phone numbers that are opted out, meaning you cannot send SMS messages to them. The results for ListPhoneNumbersOptedOut are paginated, and each page returns up to 100 phone numbers. If additional phone numbers are available after the first page of results, then a NextToken string will be returned. To receive the next page, you call ListPhoneNumbersOptedOut again using the NextToken string received from the previous call. When there are no more records to return, NextToken will be null.
   */
  listPhoneNumbersOptedOut(params: SNS.Types.ListPhoneNumbersOptedOutInput, callback?: (err: AWSError, data: SNS.Types.ListPhoneNumbersOptedOutResponse) => void): Request<SNS.Types.ListPhoneNumbersOptedOutResponse, AWSError>;
  /**
   * Returns a list of phone numbers that are opted out, meaning you cannot send SMS messages to them. The results for ListPhoneNumbersOptedOut are paginated, and each page returns up to 100 phone numbers. If additional phone numbers are available after the first page of results, then a NextToken string will be returned. To receive the next page, you call ListPhoneNumbersOptedOut again using the NextToken string received from the previous call. When there are no more records to return, NextToken will be null.
   */
  listPhoneNumbersOptedOut(callback?: (err: AWSError, data: SNS.Types.ListPhoneNumbersOptedOutResponse) => void): Request<SNS.Types.ListPhoneNumbersOptedOutResponse, AWSError>;
  /**
   * Lists the platform application objects for the supported push notification services, such as APNS and GCM (Firebase Cloud Messaging). The results for ListPlatformApplications are paginated and return a limited list of applications, up to 100. If additional records are available after the first page results, then a NextToken string will be returned. To receive the next page, you call ListPlatformApplications using the NextToken string received from the previous call. When there are no more records to return, NextToken will be null. For more information, see Using Amazon SNS Mobile Push Notifications.  This action is throttled at 15 transactions per second (TPS).
   */
  listPlatformApplications(params: SNS.Types.ListPlatformApplicationsInput, callback?: (err: AWSError, data: SNS.Types.ListPlatformApplicationsResponse) => void): Request<SNS.Types.ListPlatformApplicationsResponse, AWSError>;
  /**
   * Lists the platform application objects for the supported push notification services, such as APNS and GCM (Firebase Cloud Messaging). The results for ListPlatformApplications are paginated and return a limited list of applications, up to 100. If additional records are available after the first page results, then a NextToken string will be returned. To receive the next page, you call ListPlatformApplications using the NextToken string received from the previous call. When there are no more records to return, NextToken will be null. For more information, see Using Amazon SNS Mobile Push Notifications.  This action is throttled at 15 transactions per second (TPS).
   */
  listPlatformApplications(callback?: (err: AWSError, data: SNS.Types.ListPlatformApplicationsResponse) => void): Request<SNS.Types.ListPlatformApplicationsResponse, AWSError>;
  /**
   * Lists the calling Amazon Web Services account's current verified and pending destination phone numbers in the SMS sandbox. When you start using Amazon SNS to send SMS messages, your Amazon Web Services account is in the SMS sandbox. The SMS sandbox provides a safe environment for you to try Amazon SNS features without risking your reputation as an SMS sender. While your Amazon Web Services account is in the SMS sandbox, you can use all of the features of Amazon SNS. However, you can send SMS messages only to verified destination phone numbers. For more information, including how to move out of the sandbox to send messages without restrictions, see SMS sandbox in the Amazon SNS Developer Guide.
   */
  listSMSSandboxPhoneNumbers(params: SNS.Types.ListSMSSandboxPhoneNumbersInput, callback?: (err: AWSError, data: SNS.Types.ListSMSSandboxPhoneNumbersResult) => void): Request<SNS.Types.ListSMSSandboxPhoneNumbersResult, AWSError>;
  /**
   * Lists the calling Amazon Web Services account's current verified and pending destination phone numbers in the SMS sandbox. When you start using Amazon SNS to send SMS messages, your Amazon Web Services account is in the SMS sandbox. The SMS sandbox provides a safe environment for you to try Amazon SNS features without risking your reputation as an SMS sender. While your Amazon Web Services account is in the SMS sandbox, you can use all of the features of Amazon SNS. However, you can send SMS messages only to verified destination phone numbers. For more information, including how to move out of the sandbox to send messages without restrictions, see SMS sandbox in the Amazon SNS Developer Guide.
   */
  listSMSSandboxPhoneNumbers(callback?: (err: AWSError, data: SNS.Types.ListSMSSandboxPhoneNumbersResult) => void): Request<SNS.Types.ListSMSSandboxPhoneNumbersResult, AWSError>;
  /**
   * Returns a list of the requester's subscriptions. Each call returns a limited list of subscriptions, up to 100. If there are more subscriptions, a NextToken is also returned. Use the NextToken parameter in a new ListSubscriptions call to get further results. This action is throttled at 30 transactions per second (TPS).
   */
  listSubscriptions(params: SNS.Types.ListSubscriptionsInput, callback?: (err: AWSError, data: SNS.Types.ListSubscriptionsResponse) => void): Request<SNS.Types.ListSubscriptionsResponse, AWSError>;
  /**
   * Returns a list of the requester's subscriptions. Each call returns a limited list of subscriptions, up to 100. If there are more subscriptions, a NextToken is also returned. Use the NextToken parameter in a new ListSubscriptions call to get further results. This action is throttled at 30 transactions per second (TPS).
   */
  listSubscriptions(callback?: (err: AWSError, data: SNS.Types.ListSubscriptionsResponse) => void): Request<SNS.Types.ListSubscriptionsResponse, AWSError>;
  /**
   * Returns a list of the subscriptions to a specific topic. Each call returns a limited list of subscriptions, up to 100. If there are more subscriptions, a NextToken is also returned. Use the NextToken parameter in a new ListSubscriptionsByTopic call to get further results. This action is throttled at 30 transactions per second (TPS).
   */
  listSubscriptionsByTopic(params: SNS.Types.ListSubscriptionsByTopicInput, callback?: (err: AWSError, data: SNS.Types.ListSubscriptionsByTopicResponse) => void): Request<SNS.Types.ListSubscriptionsByTopicResponse, AWSError>;
  /**
   * Returns a list of the subscriptions to a specific topic. Each call returns a limited list of subscriptions, up to 100. If there are more subscriptions, a NextToken is also returned. Use the NextToken parameter in a new ListSubscriptionsByTopic call to get further results. This action is throttled at 30 transactions per second (TPS).
   */
  listSubscriptionsByTopic(callback?: (err: AWSError, data: SNS.Types.ListSubscriptionsByTopicResponse) => void): Request<SNS.Types.ListSubscriptionsByTopicResponse, AWSError>;
  /**
   * List all tags added to the specified Amazon SNS topic. For an overview, see Amazon SNS Tags in the Amazon Simple Notification Service Developer Guide.
   */
  listTagsForResource(params: SNS.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: SNS.Types.ListTagsForResourceResponse) => void): Request<SNS.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List all tags added to the specified Amazon SNS topic. For an overview, see Amazon SNS Tags in the Amazon Simple Notification Service Developer Guide.
   */
  listTagsForResource(callback?: (err: AWSError, data: SNS.Types.ListTagsForResourceResponse) => void): Request<SNS.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of the requester's topics. Each call returns a limited list of topics, up to 100. If there are more topics, a NextToken is also returned. Use the NextToken parameter in a new ListTopics call to get further results. This action is throttled at 30 transactions per second (TPS).
   */
  listTopics(params: SNS.Types.ListTopicsInput, callback?: (err: AWSError, data: SNS.Types.ListTopicsResponse) => void): Request<SNS.Types.ListTopicsResponse, AWSError>;
  /**
   * Returns a list of the requester's topics. Each call returns a limited list of topics, up to 100. If there are more topics, a NextToken is also returned. Use the NextToken parameter in a new ListTopics call to get further results. This action is throttled at 30 transactions per second (TPS).
   */
  listTopics(callback?: (err: AWSError, data: SNS.Types.ListTopicsResponse) => void): Request<SNS.Types.ListTopicsResponse, AWSError>;
  /**
   * Use this request to opt in a phone number that is opted out, which enables you to resume sending SMS messages to the number. You can opt in a phone number only once every 30 days.
   */
  optInPhoneNumber(params: SNS.Types.OptInPhoneNumberInput, callback?: (err: AWSError, data: SNS.Types.OptInPhoneNumberResponse) => void): Request<SNS.Types.OptInPhoneNumberResponse, AWSError>;
  /**
   * Use this request to opt in a phone number that is opted out, which enables you to resume sending SMS messages to the number. You can opt in a phone number only once every 30 days.
   */
  optInPhoneNumber(callback?: (err: AWSError, data: SNS.Types.OptInPhoneNumberResponse) => void): Request<SNS.Types.OptInPhoneNumberResponse, AWSError>;
  /**
   * Sends a message to an Amazon SNS topic, a text message (SMS message) directly to a phone number, or a message to a mobile platform endpoint (when you specify the TargetArn). If you send a message to a topic, Amazon SNS delivers the message to each endpoint that is subscribed to the topic. The format of the message depends on the notification protocol for each subscribed endpoint. When a messageId is returned, the message is saved and Amazon SNS immediately delivers it to subscribers. To use the Publish action for publishing a message to a mobile endpoint, such as an app on a Kindle device or mobile phone, you must specify the EndpointArn for the TargetArn parameter. The EndpointArn is returned when making a call with the CreatePlatformEndpoint action.  For more information about formatting messages, see Send Custom Platform-Specific Payloads in Messages to Mobile Devices.   You can publish messages only to topics and endpoints in the same Amazon Web Services Region. 
   */
  publish(params: SNS.Types.PublishInput, callback?: (err: AWSError, data: SNS.Types.PublishResponse) => void): Request<SNS.Types.PublishResponse, AWSError>;
  /**
   * Sends a message to an Amazon SNS topic, a text message (SMS message) directly to a phone number, or a message to a mobile platform endpoint (when you specify the TargetArn). If you send a message to a topic, Amazon SNS delivers the message to each endpoint that is subscribed to the topic. The format of the message depends on the notification protocol for each subscribed endpoint. When a messageId is returned, the message is saved and Amazon SNS immediately delivers it to subscribers. To use the Publish action for publishing a message to a mobile endpoint, such as an app on a Kindle device or mobile phone, you must specify the EndpointArn for the TargetArn parameter. The EndpointArn is returned when making a call with the CreatePlatformEndpoint action.  For more information about formatting messages, see Send Custom Platform-Specific Payloads in Messages to Mobile Devices.   You can publish messages only to topics and endpoints in the same Amazon Web Services Region. 
   */
  publish(callback?: (err: AWSError, data: SNS.Types.PublishResponse) => void): Request<SNS.Types.PublishResponse, AWSError>;
  /**
   * Publishes up to ten messages to the specified topic. This is a batch version of Publish. For FIFO topics, multiple messages within a single batch are published in the order they are sent, and messages are deduplicated within the batch and across batches for 5 minutes. The result of publishing each message is reported individually in the response. Because the batch request can result in a combination of successful and unsuccessful actions, you should check for batch errors even when the call returns an HTTP status code of 200. The maximum allowed individual message size and the maximum total payload size (the sum of the individual lengths of all of the batched messages) are both 256 KB (262,144 bytes).  Some actions take lists of parameters. These lists are specified using the param.n notation. Values of n are integers starting from 1. For example, a parameter list with two elements looks like this:  &amp;AttributeName.1=first &amp;AttributeName.2=second If you send a batch message to a topic, Amazon SNS publishes the batch message to each endpoint that is subscribed to the topic. The format of the batch message depends on the notification protocol for each subscribed endpoint. When a messageId is returned, the batch message is saved and Amazon SNS immediately delivers the message to subscribers.
   */
  publishBatch(params: SNS.Types.PublishBatchInput, callback?: (err: AWSError, data: SNS.Types.PublishBatchResponse) => void): Request<SNS.Types.PublishBatchResponse, AWSError>;
  /**
   * Publishes up to ten messages to the specified topic. This is a batch version of Publish. For FIFO topics, multiple messages within a single batch are published in the order they are sent, and messages are deduplicated within the batch and across batches for 5 minutes. The result of publishing each message is reported individually in the response. Because the batch request can result in a combination of successful and unsuccessful actions, you should check for batch errors even when the call returns an HTTP status code of 200. The maximum allowed individual message size and the maximum total payload size (the sum of the individual lengths of all of the batched messages) are both 256 KB (262,144 bytes).  Some actions take lists of parameters. These lists are specified using the param.n notation. Values of n are integers starting from 1. For example, a parameter list with two elements looks like this:  &amp;AttributeName.1=first &amp;AttributeName.2=second If you send a batch message to a topic, Amazon SNS publishes the batch message to each endpoint that is subscribed to the topic. The format of the batch message depends on the notification protocol for each subscribed endpoint. When a messageId is returned, the batch message is saved and Amazon SNS immediately delivers the message to subscribers.
   */
  publishBatch(callback?: (err: AWSError, data: SNS.Types.PublishBatchResponse) => void): Request<SNS.Types.PublishBatchResponse, AWSError>;
  /**
   * Adds or updates an inline policy document that is stored in the specified Amazon SNS topic.
   */
  putDataProtectionPolicy(params: SNS.Types.PutDataProtectionPolicyInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates an inline policy document that is stored in the specified Amazon SNS topic.
   */
  putDataProtectionPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a statement from a topic's access control policy.  To remove the ability to change topic permissions, you must deny permissions to the AddPermission, RemovePermission, and SetTopicAttributes actions in your IAM policy. 
   */
  removePermission(params: SNS.Types.RemovePermissionInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a statement from a topic's access control policy.  To remove the ability to change topic permissions, you must deny permissions to the AddPermission, RemovePermission, and SetTopicAttributes actions in your IAM policy. 
   */
  removePermission(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the attributes for an endpoint for a device on one of the supported push notification services, such as GCM (Firebase Cloud Messaging) and APNS. For more information, see Using Amazon SNS Mobile Push Notifications. 
   */
  setEndpointAttributes(params: SNS.Types.SetEndpointAttributesInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the attributes for an endpoint for a device on one of the supported push notification services, such as GCM (Firebase Cloud Messaging) and APNS. For more information, see Using Amazon SNS Mobile Push Notifications. 
   */
  setEndpointAttributes(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the attributes of the platform application object for the supported push notification services, such as APNS and GCM (Firebase Cloud Messaging). For more information, see Using Amazon SNS Mobile Push Notifications. For information on configuring attributes for message delivery status, see Using Amazon SNS Application Attributes for Message Delivery Status. 
   */
  setPlatformApplicationAttributes(params: SNS.Types.SetPlatformApplicationAttributesInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the attributes of the platform application object for the supported push notification services, such as APNS and GCM (Firebase Cloud Messaging). For more information, see Using Amazon SNS Mobile Push Notifications. For information on configuring attributes for message delivery status, see Using Amazon SNS Application Attributes for Message Delivery Status. 
   */
  setPlatformApplicationAttributes(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Use this request to set the default settings for sending SMS messages and receiving daily SMS usage reports. You can override some of these settings for a single message when you use the Publish action with the MessageAttributes.entry.N parameter. For more information, see Publishing to a mobile phone in the Amazon SNS Developer Guide.  To use this operation, you must grant the Amazon SNS service principal (sns.amazonaws.com) permission to perform the s3:ListBucket action.  
   */
  setSMSAttributes(params: SNS.Types.SetSMSAttributesInput, callback?: (err: AWSError, data: SNS.Types.SetSMSAttributesResponse) => void): Request<SNS.Types.SetSMSAttributesResponse, AWSError>;
  /**
   * Use this request to set the default settings for sending SMS messages and receiving daily SMS usage reports. You can override some of these settings for a single message when you use the Publish action with the MessageAttributes.entry.N parameter. For more information, see Publishing to a mobile phone in the Amazon SNS Developer Guide.  To use this operation, you must grant the Amazon SNS service principal (sns.amazonaws.com) permission to perform the s3:ListBucket action.  
   */
  setSMSAttributes(callback?: (err: AWSError, data: SNS.Types.SetSMSAttributesResponse) => void): Request<SNS.Types.SetSMSAttributesResponse, AWSError>;
  /**
   * Allows a subscription owner to set an attribute of the subscription to a new value.
   */
  setSubscriptionAttributes(params: SNS.Types.SetSubscriptionAttributesInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Allows a subscription owner to set an attribute of the subscription to a new value.
   */
  setSubscriptionAttributes(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Allows a topic owner to set an attribute of the topic to a new value.  To remove the ability to change topic permissions, you must deny permissions to the AddPermission, RemovePermission, and SetTopicAttributes actions in your IAM policy. 
   */
  setTopicAttributes(params: SNS.Types.SetTopicAttributesInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Allows a topic owner to set an attribute of the topic to a new value.  To remove the ability to change topic permissions, you must deny permissions to the AddPermission, RemovePermission, and SetTopicAttributes actions in your IAM policy. 
   */
  setTopicAttributes(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Subscribes an endpoint to an Amazon SNS topic. If the endpoint type is HTTP/S or email, or if the endpoint and the topic are not in the same Amazon Web Services account, the endpoint owner must run the ConfirmSubscription action to confirm the subscription. You call the ConfirmSubscription action with the token from the subscription response. Confirmation tokens are valid for three days. This action is throttled at 100 transactions per second (TPS).
   */
  subscribe(params: SNS.Types.SubscribeInput, callback?: (err: AWSError, data: SNS.Types.SubscribeResponse) => void): Request<SNS.Types.SubscribeResponse, AWSError>;
  /**
   * Subscribes an endpoint to an Amazon SNS topic. If the endpoint type is HTTP/S or email, or if the endpoint and the topic are not in the same Amazon Web Services account, the endpoint owner must run the ConfirmSubscription action to confirm the subscription. You call the ConfirmSubscription action with the token from the subscription response. Confirmation tokens are valid for three days. This action is throttled at 100 transactions per second (TPS).
   */
  subscribe(callback?: (err: AWSError, data: SNS.Types.SubscribeResponse) => void): Request<SNS.Types.SubscribeResponse, AWSError>;
  /**
   * Add tags to the specified Amazon SNS topic. For an overview, see Amazon SNS Tags in the Amazon SNS Developer Guide. When you use topic tags, keep the following guidelines in mind:   Adding more than 50 tags to a topic isn't recommended.   Tags don't have any semantic meaning. Amazon SNS interprets tags as character strings.   Tags are case-sensitive.   A new tag with a key identical to that of an existing tag overwrites the existing tag.   Tagging actions are limited to 10 TPS per Amazon Web Services account, per Amazon Web Services Region. If your application requires a higher throughput, file a technical support request.  
   */
  tagResource(params: SNS.Types.TagResourceRequest, callback?: (err: AWSError, data: SNS.Types.TagResourceResponse) => void): Request<SNS.Types.TagResourceResponse, AWSError>;
  /**
   * Add tags to the specified Amazon SNS topic. For an overview, see Amazon SNS Tags in the Amazon SNS Developer Guide. When you use topic tags, keep the following guidelines in mind:   Adding more than 50 tags to a topic isn't recommended.   Tags don't have any semantic meaning. Amazon SNS interprets tags as character strings.   Tags are case-sensitive.   A new tag with a key identical to that of an existing tag overwrites the existing tag.   Tagging actions are limited to 10 TPS per Amazon Web Services account, per Amazon Web Services Region. If your application requires a higher throughput, file a technical support request.  
   */
  tagResource(callback?: (err: AWSError, data: SNS.Types.TagResourceResponse) => void): Request<SNS.Types.TagResourceResponse, AWSError>;
  /**
   * Deletes a subscription. If the subscription requires authentication for deletion, only the owner of the subscription or the topic's owner can unsubscribe, and an Amazon Web Services signature is required. If the Unsubscribe call does not require authentication and the requester is not the subscription owner, a final cancellation message is delivered to the endpoint, so that the endpoint owner can easily resubscribe to the topic if the Unsubscribe request was unintended.  Amazon SQS queue subscriptions require authentication for deletion. Only the owner of the subscription, or the owner of the topic can unsubscribe using the required Amazon Web Services signature.  This action is throttled at 100 transactions per second (TPS).
   */
  unsubscribe(params: SNS.Types.UnsubscribeInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a subscription. If the subscription requires authentication for deletion, only the owner of the subscription or the topic's owner can unsubscribe, and an Amazon Web Services signature is required. If the Unsubscribe call does not require authentication and the requester is not the subscription owner, a final cancellation message is delivered to the endpoint, so that the endpoint owner can easily resubscribe to the topic if the Unsubscribe request was unintended.  Amazon SQS queue subscriptions require authentication for deletion. Only the owner of the subscription, or the owner of the topic can unsubscribe using the required Amazon Web Services signature.  This action is throttled at 100 transactions per second (TPS).
   */
  unsubscribe(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove tags from the specified Amazon SNS topic. For an overview, see Amazon SNS Tags in the Amazon SNS Developer Guide.
   */
  untagResource(params: SNS.Types.UntagResourceRequest, callback?: (err: AWSError, data: SNS.Types.UntagResourceResponse) => void): Request<SNS.Types.UntagResourceResponse, AWSError>;
  /**
   * Remove tags from the specified Amazon SNS topic. For an overview, see Amazon SNS Tags in the Amazon SNS Developer Guide.
   */
  untagResource(callback?: (err: AWSError, data: SNS.Types.UntagResourceResponse) => void): Request<SNS.Types.UntagResourceResponse, AWSError>;
  /**
   * Verifies a destination phone number with a one-time password (OTP) for the calling Amazon Web Services account. When you start using Amazon SNS to send SMS messages, your Amazon Web Services account is in the SMS sandbox. The SMS sandbox provides a safe environment for you to try Amazon SNS features without risking your reputation as an SMS sender. While your Amazon Web Services account is in the SMS sandbox, you can use all of the features of Amazon SNS. However, you can send SMS messages only to verified destination phone numbers. For more information, including how to move out of the sandbox to send messages without restrictions, see SMS sandbox in the Amazon SNS Developer Guide.
   */
  verifySMSSandboxPhoneNumber(params: SNS.Types.VerifySMSSandboxPhoneNumberInput, callback?: (err: AWSError, data: SNS.Types.VerifySMSSandboxPhoneNumberResult) => void): Request<SNS.Types.VerifySMSSandboxPhoneNumberResult, AWSError>;
  /**
   * Verifies a destination phone number with a one-time password (OTP) for the calling Amazon Web Services account. When you start using Amazon SNS to send SMS messages, your Amazon Web Services account is in the SMS sandbox. The SMS sandbox provides a safe environment for you to try Amazon SNS features without risking your reputation as an SMS sender. While your Amazon Web Services account is in the SMS sandbox, you can use all of the features of Amazon SNS. However, you can send SMS messages only to verified destination phone numbers. For more information, including how to move out of the sandbox to send messages without restrictions, see SMS sandbox in the Amazon SNS Developer Guide.
   */
  verifySMSSandboxPhoneNumber(callback?: (err: AWSError, data: SNS.Types.VerifySMSSandboxPhoneNumberResult) => void): Request<SNS.Types.VerifySMSSandboxPhoneNumberResult, AWSError>;
}
declare namespace SNS {
  export type ActionsList = action[];
  export interface AddPermissionInput {
    /**
     * The ARN of the topic whose access control policy you wish to modify.
     */
    TopicArn: topicARN;
    /**
     * A unique identifier for the new policy statement.
     */
    Label: label;
    /**
     * The Amazon Web Services account IDs of the users (principals) who will be given access to the specified actions. The users must have Amazon Web Services account, but do not need to be signed up for this service.
     */
    AWSAccountId: DelegatesList;
    /**
     * The action you want to allow for the specified principal(s). Valid values: Any Amazon SNS action name, for example Publish.
     */
    ActionName: ActionsList;
  }
  export type AmazonResourceName = string;
  export interface BatchResultErrorEntry {
    /**
     * The Id of an entry in a batch request
     */
    Id: String;
    /**
     * An error code representing why the action failed on this entry.
     */
    Code: String;
    /**
     * A message explaining why the action failed on this entry.
     */
    Message?: String;
    /**
     * Specifies whether the error happened due to the caller of the batch API action.
     */
    SenderFault: boolean;
  }
  export type BatchResultErrorEntryList = BatchResultErrorEntry[];
  export type Binary = Buffer|Uint8Array|Blob|string;
  export interface CheckIfPhoneNumberIsOptedOutInput {
    /**
     * The phone number for which you want to check the opt out status.
     */
    phoneNumber: PhoneNumber;
  }
  export interface CheckIfPhoneNumberIsOptedOutResponse {
    /**
     * Indicates whether the phone number is opted out:    true – The phone number is opted out, meaning you cannot publish SMS messages to it.    false – The phone number is opted in, meaning you can publish SMS messages to it.  
     */
    isOptedOut?: boolean;
  }
  export interface ConfirmSubscriptionInput {
    /**
     * The ARN of the topic for which you wish to confirm a subscription.
     */
    TopicArn: topicARN;
    /**
     * Short-lived token sent to an endpoint during the Subscribe action.
     */
    Token: token;
    /**
     * Disallows unauthenticated unsubscribes of the subscription. If the value of this parameter is true and the request has an Amazon Web Services signature, then only the topic owner and the subscription owner can unsubscribe the endpoint. The unsubscribe action requires Amazon Web Services authentication. 
     */
    AuthenticateOnUnsubscribe?: authenticateOnUnsubscribe;
  }
  export interface ConfirmSubscriptionResponse {
    /**
     * The ARN of the created subscription.
     */
    SubscriptionArn?: subscriptionARN;
  }
  export interface CreateEndpointResponse {
    /**
     * EndpointArn returned from CreateEndpoint action.
     */
    EndpointArn?: String;
  }
  export interface CreatePlatformApplicationInput {
    /**
     * Application names must be made up of only uppercase and lowercase ASCII letters, numbers, underscores, hyphens, and periods, and must be between 1 and 256 characters long.
     */
    Name: String;
    /**
     * The following platforms are supported: ADM (Amazon Device Messaging), APNS (Apple Push Notification Service), APNS_SANDBOX, and GCM (Firebase Cloud Messaging).
     */
    Platform: String;
    /**
     * For a list of attributes, see SetPlatformApplicationAttributes.
     */
    Attributes: MapStringToString;
  }
  export interface CreatePlatformApplicationResponse {
    /**
     * PlatformApplicationArn is returned.
     */
    PlatformApplicationArn?: String;
  }
  export interface CreatePlatformEndpointInput {
    /**
     * PlatformApplicationArn returned from CreatePlatformApplication is used to create a an endpoint.
     */
    PlatformApplicationArn: String;
    /**
     * Unique identifier created by the notification service for an app on a device. The specific name for Token will vary, depending on which notification service is being used. For example, when using APNS as the notification service, you need the device token. Alternatively, when using GCM (Firebase Cloud Messaging) or ADM, the device token equivalent is called the registration ID.
     */
    Token: String;
    /**
     * Arbitrary user data to associate with the endpoint. Amazon SNS does not use this data. The data must be in UTF-8 format and less than 2KB.
     */
    CustomUserData?: String;
    /**
     * For a list of attributes, see SetEndpointAttributes.
     */
    Attributes?: MapStringToString;
  }
  export interface CreateSMSSandboxPhoneNumberInput {
    /**
     * The destination phone number to verify. On verification, Amazon SNS adds this phone number to the list of verified phone numbers that you can send SMS messages to.
     */
    PhoneNumber: PhoneNumberString;
    /**
     * The language to use for sending the OTP. The default value is en-US.
     */
    LanguageCode?: LanguageCodeString;
  }
  export interface CreateSMSSandboxPhoneNumberResult {
  }
  export interface CreateTopicInput {
    /**
     * The name of the topic you want to create. Constraints: Topic names must be made up of only uppercase and lowercase ASCII letters, numbers, underscores, and hyphens, and must be between 1 and 256 characters long. For a FIFO (first-in-first-out) topic, the name must end with the .fifo suffix. 
     */
    Name: topicName;
    /**
     * A map of attributes with their corresponding values. The following lists the names, descriptions, and values of the special request parameters that the CreateTopic action uses:    DeliveryPolicy – The policy that defines how Amazon SNS retries failed deliveries to HTTP/S endpoints.    DisplayName – The display name to use for a topic with SMS subscriptions.    FifoTopic – Set to true to create a FIFO topic.    Policy – The policy that defines who can access your topic. By default, only the topic owner can publish or subscribe to the topic.    SignatureVersion – The signature version corresponds to the hashing algorithm used while creating the signature of the notifications, subscription confirmations, or unsubscribe confirmation messages sent by Amazon SNS. By default, SignatureVersion is set to 1.    TracingConfig – Tracing mode of an Amazon SNS topic. By default TracingConfig is set to PassThrough, and the topic passes through the tracing header it receives from an Amazon SNS publisher to its subscriptions. If set to Active, Amazon SNS will vend X-Ray segment data to topic owner account if the sampled flag in the tracing header is true. This is only supported on standard topics.   The following attribute applies only to server-side encryption:    KmsMasterKeyId – The ID of an Amazon Web Services managed customer master key (CMK) for Amazon SNS or a custom CMK. For more information, see Key Terms. For more examples, see KeyId in the Key Management Service API Reference.    The following attributes apply only to FIFO topics:    FifoTopic – When this is set to true, a FIFO topic is created.    ContentBasedDeduplication – Enables content-based deduplication for FIFO topics.   By default, ContentBasedDeduplication is set to false. If you create a FIFO topic and this attribute is false, you must specify a value for the MessageDeduplicationId parameter for the Publish action.    When you set ContentBasedDeduplication to true, Amazon SNS uses a SHA-256 hash to generate the MessageDeduplicationId using the body of the message (but not the attributes of the message). (Optional) To override the generated value, you can specify a value for the MessageDeduplicationId parameter for the Publish action.    
     */
    Attributes?: TopicAttributesMap;
    /**
     * The list of tags to add to a new topic.  To be able to tag a topic on creation, you must have the sns:CreateTopic and sns:TagResource permissions. 
     */
    Tags?: TagList;
    /**
     * The body of the policy document you want to use for this topic. You can only add one policy per topic. The policy must be in JSON string format. Length Constraints: Maximum length of 30,720.
     */
    DataProtectionPolicy?: attributeValue;
  }
  export interface CreateTopicResponse {
    /**
     * The Amazon Resource Name (ARN) assigned to the created topic.
     */
    TopicArn?: topicARN;
  }
  export type DelegatesList = delegate[];
  export interface DeleteEndpointInput {
    /**
     * EndpointArn of endpoint to delete.
     */
    EndpointArn: String;
  }
  export interface DeletePlatformApplicationInput {
    /**
     * PlatformApplicationArn of platform application object to delete.
     */
    PlatformApplicationArn: String;
  }
  export interface DeleteSMSSandboxPhoneNumberInput {
    /**
     * The destination phone number to delete.
     */
    PhoneNumber: PhoneNumberString;
  }
  export interface DeleteSMSSandboxPhoneNumberResult {
  }
  export interface DeleteTopicInput {
    /**
     * The ARN of the topic you want to delete.
     */
    TopicArn: topicARN;
  }
  export interface Endpoint {
    /**
     * The EndpointArn for mobile app and device.
     */
    EndpointArn?: String;
    /**
     * Attributes for endpoint.
     */
    Attributes?: MapStringToString;
  }
  export interface GetDataProtectionPolicyInput {
    /**
     * The ARN of the topic whose DataProtectionPolicy you want to get. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    ResourceArn: topicARN;
  }
  export interface GetDataProtectionPolicyResponse {
    /**
     * Retrieves the DataProtectionPolicy in JSON string format.
     */
    DataProtectionPolicy?: attributeValue;
  }
  export interface GetEndpointAttributesInput {
    /**
     * EndpointArn for GetEndpointAttributes input.
     */
    EndpointArn: String;
  }
  export interface GetEndpointAttributesResponse {
    /**
     * Attributes include the following:    CustomUserData – arbitrary user data to associate with the endpoint. Amazon SNS does not use this data. The data must be in UTF-8 format and less than 2KB.    Enabled – flag that enables/disables delivery to the endpoint. Amazon SNS will set this to false when a notification service indicates to Amazon SNS that the endpoint is invalid. Users can set it back to true, typically after updating Token.    Token – device token, also referred to as a registration id, for an app and mobile device. This is returned from the notification service when an app and mobile device are registered with the notification service.  The device token for the iOS platform is returned in lowercase.   
     */
    Attributes?: MapStringToString;
  }
  export interface GetPlatformApplicationAttributesInput {
    /**
     * PlatformApplicationArn for GetPlatformApplicationAttributesInput.
     */
    PlatformApplicationArn: String;
  }
  export interface GetPlatformApplicationAttributesResponse {
    /**
     * Attributes include the following:    AppleCertificateExpiryDate – The expiry date of the SSL certificate used to configure certificate-based authentication.    ApplePlatformTeamID – The Apple developer account ID used to configure token-based authentication.    ApplePlatformBundleID – The app identifier used to configure token-based authentication.    EventEndpointCreated – Topic ARN to which EndpointCreated event notifications should be sent.    EventEndpointDeleted – Topic ARN to which EndpointDeleted event notifications should be sent.    EventEndpointUpdated – Topic ARN to which EndpointUpdate event notifications should be sent.    EventDeliveryFailure – Topic ARN to which DeliveryFailure event notifications should be sent upon Direct Publish delivery failure (permanent) to one of the application's endpoints.  
     */
    Attributes?: MapStringToString;
  }
  export interface GetSMSAttributesInput {
    /**
     * A list of the individual attribute names, such as MonthlySpendLimit, for which you want values. For all attribute names, see SetSMSAttributes. If you don't use this parameter, Amazon SNS returns all SMS attributes.
     */
    attributes?: ListString;
  }
  export interface GetSMSAttributesResponse {
    /**
     * The SMS attribute names and their values.
     */
    attributes?: MapStringToString;
  }
  export interface GetSMSSandboxAccountStatusInput {
  }
  export interface GetSMSSandboxAccountStatusResult {
    /**
     * Indicates whether the calling Amazon Web Services account is in the SMS sandbox.
     */
    IsInSandbox: boolean;
  }
  export interface GetSubscriptionAttributesInput {
    /**
     * The ARN of the subscription whose properties you want to get.
     */
    SubscriptionArn: subscriptionARN;
  }
  export interface GetSubscriptionAttributesResponse {
    /**
     * A map of the subscription's attributes. Attributes in this map include the following:    ConfirmationWasAuthenticated – true if the subscription confirmation request was authenticated.    DeliveryPolicy – The JSON serialization of the subscription's delivery policy.    EffectiveDeliveryPolicy – The JSON serialization of the effective delivery policy that takes into account the topic delivery policy and account system defaults.    FilterPolicy – The filter policy JSON that is assigned to the subscription. For more information, see Amazon SNS Message Filtering in the Amazon SNS Developer Guide.    FilterPolicyScope – This attribute lets you choose the filtering scope by using one of the following string value types:    MessageAttributes (default) – The filter is applied on the message attributes.    MessageBody – The filter is applied on the message body.      Owner – The Amazon Web Services account ID of the subscription's owner.    PendingConfirmation – true if the subscription hasn't been confirmed. To confirm a pending subscription, call the ConfirmSubscription action with a confirmation token.    RawMessageDelivery – true if raw message delivery is enabled for the subscription. Raw messages are free of JSON formatting and can be sent to HTTP/S and Amazon SQS endpoints.    RedrivePolicy – When specified, sends undeliverable messages to the specified Amazon SQS dead-letter queue. Messages that can't be delivered due to client errors (for example, when the subscribed endpoint is unreachable) or server errors (for example, when the service that powers the subscribed endpoint becomes unavailable) are held in the dead-letter queue for further analysis or reprocessing.    SubscriptionArn – The subscription's ARN.    TopicArn – The topic ARN that the subscription is associated with.   The following attribute applies only to Amazon Kinesis Data Firehose delivery stream subscriptions:    SubscriptionRoleArn – The ARN of the IAM role that has the following:   Permission to write to the Kinesis Data Firehose delivery stream   Amazon SNS listed as a trusted entity   Specifying a valid ARN for this attribute is required for Kinesis Data Firehose delivery stream subscriptions. For more information, see Fanout to Kinesis Data Firehose delivery streams in the Amazon SNS Developer Guide.  
     */
    Attributes?: SubscriptionAttributesMap;
  }
  export interface GetTopicAttributesInput {
    /**
     * The ARN of the topic whose properties you want to get.
     */
    TopicArn: topicARN;
  }
  export interface GetTopicAttributesResponse {
    /**
     * A map of the topic's attributes. Attributes in this map include the following:    DeliveryPolicy – The JSON serialization of the topic's delivery policy.    DisplayName – The human-readable name used in the From field for notifications to email and email-json endpoints.    EffectiveDeliveryPolicy – The JSON serialization of the effective delivery policy, taking system defaults into account.    Owner – The Amazon Web Services account ID of the topic's owner.    Policy – The JSON serialization of the topic's access control policy.    SignatureVersion – The signature version corresponds to the hashing algorithm used while creating the signature of the notifications, subscription confirmations, or unsubscribe confirmation messages sent by Amazon SNS.   By default, SignatureVersion is set to 1. The signature is a Base64-encoded SHA1withRSA signature.   When you set SignatureVersion to 2. Amazon SNS uses a Base64-encoded SHA256withRSA signature.   If the API response does not include the SignatureVersion attribute, it means that the SignatureVersion for the topic has value 1.       SubscriptionsConfirmed – The number of confirmed subscriptions for the topic.    SubscriptionsDeleted – The number of deleted subscriptions for the topic.    SubscriptionsPending – The number of subscriptions pending confirmation for the topic.    TopicArn – The topic's ARN.    TracingConfig – Tracing mode of an Amazon SNS topic. By default TracingConfig is set to PassThrough, and the topic passes through the tracing header it receives from an Amazon SNS publisher to its subscriptions. If set to Active, Amazon SNS will vend X-Ray segment data to topic owner account if the sampled flag in the tracing header is true. This is only supported on standard topics.   The following attribute applies only to server-side-encryption:    KmsMasterKeyId - The ID of an Amazon Web Services managed customer master key (CMK) for Amazon SNS or a custom CMK. For more information, see Key Terms. For more examples, see KeyId in the Key Management Service API Reference.   The following attributes apply only to FIFO topics:    FifoTopic – When this is set to true, a FIFO topic is created.    ContentBasedDeduplication – Enables content-based deduplication for FIFO topics.   By default, ContentBasedDeduplication is set to false. If you create a FIFO topic and this attribute is false, you must specify a value for the MessageDeduplicationId parameter for the Publish action.    When you set ContentBasedDeduplication to true, Amazon SNS uses a SHA-256 hash to generate the MessageDeduplicationId using the body of the message (but not the attributes of the message). (Optional) To override the generated value, you can specify a value for the MessageDeduplicationId parameter for the Publish action.    
     */
    Attributes?: TopicAttributesMap;
  }
  export type Iso2CountryCode = string;
  export type LanguageCodeString = "en-US"|"en-GB"|"es-419"|"es-ES"|"de-DE"|"fr-CA"|"fr-FR"|"it-IT"|"ja-JP"|"pt-BR"|"kr-KR"|"zh-CN"|"zh-TW"|string;
  export interface ListEndpointsByPlatformApplicationInput {
    /**
     * PlatformApplicationArn for ListEndpointsByPlatformApplicationInput action.
     */
    PlatformApplicationArn: String;
    /**
     * NextToken string is used when calling ListEndpointsByPlatformApplication action to retrieve additional records that are available after the first page results.
     */
    NextToken?: String;
  }
  export interface ListEndpointsByPlatformApplicationResponse {
    /**
     * Endpoints returned for ListEndpointsByPlatformApplication action.
     */
    Endpoints?: ListOfEndpoints;
    /**
     * NextToken string is returned when calling ListEndpointsByPlatformApplication action if additional records are available after the first page results.
     */
    NextToken?: String;
  }
  export type ListOfEndpoints = Endpoint[];
  export type ListOfPlatformApplications = PlatformApplication[];
  export interface ListOriginationNumbersRequest {
    /**
     * Token that the previous ListOriginationNumbers request returns.
     */
    NextToken?: nextToken;
    /**
     * The maximum number of origination numbers to return.
     */
    MaxResults?: MaxItemsListOriginationNumbers;
  }
  export interface ListOriginationNumbersResult {
    /**
     * A NextToken string is returned when you call the ListOriginationNumbers operation if additional pages of records are available.
     */
    NextToken?: nextToken;
    /**
     * A list of the calling account's verified and pending origination numbers.
     */
    PhoneNumbers?: PhoneNumberInformationList;
  }
  export interface ListPhoneNumbersOptedOutInput {
    /**
     * A NextToken string is used when you call the ListPhoneNumbersOptedOut action to retrieve additional records that are available after the first page of results.
     */
    nextToken?: string;
  }
  export interface ListPhoneNumbersOptedOutResponse {
    /**
     * A list of phone numbers that are opted out of receiving SMS messages. The list is paginated, and each page can contain up to 100 phone numbers.
     */
    phoneNumbers?: PhoneNumberList;
    /**
     * A NextToken string is returned when you call the ListPhoneNumbersOptedOut action if additional records are available after the first page of results.
     */
    nextToken?: string;
  }
  export interface ListPlatformApplicationsInput {
    /**
     * NextToken string is used when calling ListPlatformApplications action to retrieve additional records that are available after the first page results.
     */
    NextToken?: String;
  }
  export interface ListPlatformApplicationsResponse {
    /**
     * Platform applications returned when calling ListPlatformApplications action.
     */
    PlatformApplications?: ListOfPlatformApplications;
    /**
     * NextToken string is returned when calling ListPlatformApplications action if additional records are available after the first page results.
     */
    NextToken?: String;
  }
  export interface ListSMSSandboxPhoneNumbersInput {
    /**
     * Token that the previous ListSMSSandboxPhoneNumbersInput request returns.
     */
    NextToken?: nextToken;
    /**
     * The maximum number of phone numbers to return.
     */
    MaxResults?: MaxItems;
  }
  export interface ListSMSSandboxPhoneNumbersResult {
    /**
     * A list of the calling account's pending and verified phone numbers.
     */
    PhoneNumbers: SMSSandboxPhoneNumberList;
    /**
     * A NextToken string is returned when you call the ListSMSSandboxPhoneNumbersInput operation if additional pages of records are available.
     */
    NextToken?: string;
  }
  export type ListString = String[];
  export interface ListSubscriptionsByTopicInput {
    /**
     * The ARN of the topic for which you wish to find subscriptions.
     */
    TopicArn: topicARN;
    /**
     * Token returned by the previous ListSubscriptionsByTopic request.
     */
    NextToken?: nextToken;
  }
  export interface ListSubscriptionsByTopicResponse {
    /**
     * A list of subscriptions.
     */
    Subscriptions?: SubscriptionsList;
    /**
     * Token to pass along to the next ListSubscriptionsByTopic request. This element is returned if there are more subscriptions to retrieve.
     */
    NextToken?: nextToken;
  }
  export interface ListSubscriptionsInput {
    /**
     * Token returned by the previous ListSubscriptions request.
     */
    NextToken?: nextToken;
  }
  export interface ListSubscriptionsResponse {
    /**
     * A list of subscriptions.
     */
    Subscriptions?: SubscriptionsList;
    /**
     * Token to pass along to the next ListSubscriptions request. This element is returned if there are more subscriptions to retrieve.
     */
    NextToken?: nextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the topic for which to list tags.
     */
    ResourceArn: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags associated with the specified topic.
     */
    Tags?: TagList;
  }
  export interface ListTopicsInput {
    /**
     * Token returned by the previous ListTopics request.
     */
    NextToken?: nextToken;
  }
  export interface ListTopicsResponse {
    /**
     * A list of topic ARNs.
     */
    Topics?: TopicsList;
    /**
     * Token to pass along to the next ListTopics request. This element is returned if there are additional topics to retrieve.
     */
    NextToken?: nextToken;
  }
  export type MapStringToString = {[key: string]: String};
  export type MaxItems = number;
  export type MaxItemsListOriginationNumbers = number;
  export type MessageAttributeMap = {[key: string]: MessageAttributeValue};
  export interface MessageAttributeValue {
    /**
     * Amazon SNS supports the following logical data types: String, String.Array, Number, and Binary. For more information, see Message Attribute Data Types.
     */
    DataType: String;
    /**
     * Strings are Unicode with UTF8 binary encoding. For a list of code values, see ASCII Printable Characters.
     */
    StringValue?: String;
    /**
     * Binary type attributes can store any binary data, for example, compressed data, encrypted data, or images.
     */
    BinaryValue?: Binary;
  }
  export type NumberCapability = "SMS"|"MMS"|"VOICE"|string;
  export type NumberCapabilityList = NumberCapability[];
  export type OTPCode = string;
  export interface OptInPhoneNumberInput {
    /**
     * The phone number to opt in. Use E.164 format.
     */
    phoneNumber: PhoneNumber;
  }
  export interface OptInPhoneNumberResponse {
  }
  export type PhoneNumber = string;
  export interface PhoneNumberInformation {
    /**
     * The date and time when the phone number was created.
     */
    CreatedAt?: Timestamp;
    /**
     * The phone number.
     */
    PhoneNumber?: String;
    /**
     * The status of the phone number.
     */
    Status?: String;
    /**
     * The two-character code for the country or region, in ISO 3166-1 alpha-2 format.
     */
    Iso2CountryCode?: Iso2CountryCode;
    /**
     * The list of supported routes.
     */
    RouteType?: RouteType;
    /**
     * The capabilities of each phone number.
     */
    NumberCapabilities?: NumberCapabilityList;
  }
  export type PhoneNumberInformationList = PhoneNumberInformation[];
  export type PhoneNumberList = PhoneNumber[];
  export type PhoneNumberString = string;
  export interface PlatformApplication {
    /**
     * PlatformApplicationArn for platform application object.
     */
    PlatformApplicationArn?: String;
    /**
     * Attributes for platform application object.
     */
    Attributes?: MapStringToString;
  }
  export interface PublishBatchInput {
    /**
     * The Amazon resource name (ARN) of the topic you want to batch publish to.
     */
    TopicArn: topicARN;
    /**
     * A list of PublishBatch request entries to be sent to the SNS topic.
     */
    PublishBatchRequestEntries: PublishBatchRequestEntryList;
  }
  export interface PublishBatchRequestEntry {
    /**
     * An identifier for the message in this batch.  The Ids of a batch request must be unique within a request.  This identifier can have up to 80 characters. The following characters are accepted: alphanumeric characters, hyphens(-), and underscores (_).  
     */
    Id: String;
    /**
     * The body of the message.
     */
    Message: message;
    /**
     * The subject of the batch message.
     */
    Subject?: subject;
    /**
     * Set MessageStructure to json if you want to send a different message for each protocol. For example, using one publish action, you can send a short message to your SMS subscribers and a longer message to your email subscribers. If you set MessageStructure to json, the value of the Message parameter must:    be a syntactically valid JSON object; and   contain at least a top-level JSON key of "default" with a value that is a string.   You can define other top-level keys that define the message you want to send to a specific transport protocol (e.g. http). 
     */
    MessageStructure?: messageStructure;
    /**
     * Each message attribute consists of a Name, Type, and Value. For more information, see Amazon SNS message attributes in the Amazon SNS Developer Guide.
     */
    MessageAttributes?: MessageAttributeMap;
    /**
     * This parameter applies only to FIFO (first-in-first-out) topics. The token used for deduplication of messages within a 5-minute minimum deduplication interval. If a message with a particular MessageDeduplicationId is sent successfully, subsequent messages with the same MessageDeduplicationId are accepted successfully but aren't delivered.   Every message must have a unique MessageDeduplicationId.   You may provide a MessageDeduplicationId explicitly.   If you aren't able to provide a MessageDeduplicationId and you enable ContentBasedDeduplication for your topic, Amazon SNS uses a SHA-256 hash to generate the MessageDeduplicationId using the body of the message (but not the attributes of the message).   If you don't provide a MessageDeduplicationId and the topic doesn't have ContentBasedDeduplication set, the action fails with an error.   If the topic has a ContentBasedDeduplication set, your MessageDeduplicationId overrides the generated one.      When ContentBasedDeduplication is in effect, messages with identical content sent within the deduplication interval are treated as duplicates and only one copy of the message is delivered.   If you send one message with ContentBasedDeduplication enabled, and then another message with a MessageDeduplicationId that is the same as the one generated for the first MessageDeduplicationId, the two messages are treated as duplicates and only one copy of the message is delivered.     The MessageDeduplicationId is available to the consumer of the message (this can be useful for troubleshooting delivery issues). If a message is sent successfully but the acknowledgement is lost and the message is resent with the same MessageDeduplicationId after the deduplication interval, Amazon SNS can't detect duplicate messages.  Amazon SNS continues to keep track of the message deduplication ID even after the message is received and deleted.   The length of MessageDeduplicationId is 128 characters.  MessageDeduplicationId can contain alphanumeric characters (a-z, A-Z, 0-9) and punctuation (!"#$%&amp;'()*+,-./:;&lt;=&gt;?@[\]^_`{|}~).
     */
    MessageDeduplicationId?: String;
    /**
     * This parameter applies only to FIFO (first-in-first-out) topics. The tag that specifies that a message belongs to a specific message group. Messages that belong to the same message group are processed in a FIFO manner (however, messages in different message groups might be processed out of order). To interleave multiple ordered streams within a single topic, use MessageGroupId values (for example, session data for multiple users). In this scenario, multiple consumers can process the topic, but the session data of each user is processed in a FIFO fashion.  You must associate a non-empty MessageGroupId with a message. If you don't provide a MessageGroupId, the action fails.  The length of MessageGroupId is 128 characters.  MessageGroupId can contain alphanumeric characters (a-z, A-Z, 0-9) and punctuation (!"#$%&amp;'()*+,-./:;&lt;=&gt;?@[\]^_`{|}~).   MessageGroupId is required for FIFO topics. You can't use it for standard topics.  
     */
    MessageGroupId?: String;
  }
  export type PublishBatchRequestEntryList = PublishBatchRequestEntry[];
  export interface PublishBatchResponse {
    /**
     * A list of successful PublishBatch responses.
     */
    Successful?: PublishBatchResultEntryList;
    /**
     * A list of failed PublishBatch responses. 
     */
    Failed?: BatchResultErrorEntryList;
  }
  export interface PublishBatchResultEntry {
    /**
     * The Id of an entry in a batch request.
     */
    Id?: String;
    /**
     * An identifier for the message.
     */
    MessageId?: messageId;
    /**
     * This parameter applies only to FIFO (first-in-first-out) topics. The large, non-consecutive number that Amazon SNS assigns to each message. The length of SequenceNumber is 128 bits. SequenceNumber continues to increase for a particular MessageGroupId.
     */
    SequenceNumber?: String;
  }
  export type PublishBatchResultEntryList = PublishBatchResultEntry[];
  export interface PublishInput {
    /**
     * The topic you want to publish to. If you don't specify a value for the TopicArn parameter, you must specify a value for the PhoneNumber or TargetArn parameters.
     */
    TopicArn?: topicARN;
    /**
     * If you don't specify a value for the TargetArn parameter, you must specify a value for the PhoneNumber or TopicArn parameters.
     */
    TargetArn?: String;
    /**
     * The phone number to which you want to deliver an SMS message. Use E.164 format. If you don't specify a value for the PhoneNumber parameter, you must specify a value for the TargetArn or TopicArn parameters.
     */
    PhoneNumber?: String;
    /**
     * The message you want to send. If you are publishing to a topic and you want to send the same message to all transport protocols, include the text of the message as a String value. If you want to send different messages for each transport protocol, set the value of the MessageStructure parameter to json and use a JSON object for the Message parameter.   Constraints:   With the exception of SMS, messages must be UTF-8 encoded strings and at most 256 KB in size (262,144 bytes, not 262,144 characters).   For SMS, each message can contain up to 140 characters. This character limit depends on the encoding schema. For example, an SMS message can contain 160 GSM characters, 140 ASCII characters, or 70 UCS-2 characters. If you publish a message that exceeds this size limit, Amazon SNS sends the message as multiple messages, each fitting within the size limit. Messages aren't truncated mid-word but are cut off at whole-word boundaries. The total size limit for a single SMS Publish action is 1,600 characters.   JSON-specific constraints:   Keys in the JSON object that correspond to supported transport protocols must have simple JSON string values.   The values will be parsed (unescaped) before they are used in outgoing messages.   Outbound notifications are JSON encoded (meaning that the characters will be reescaped for sending).   Values have a minimum length of 0 (the empty string, "", is allowed).   Values have a maximum length bounded by the overall message size (so, including multiple protocols may limit message sizes).   Non-string values will cause the key to be ignored.   Keys that do not correspond to supported transport protocols are ignored.   Duplicate keys are not allowed.   Failure to parse or validate any key or value in the message will cause the Publish call to return an error (no partial delivery).  
     */
    Message: message;
    /**
     * Optional parameter to be used as the "Subject" line when the message is delivered to email endpoints. This field will also be included, if present, in the standard JSON messages delivered to other endpoints. Constraints: Subjects must be ASCII text that begins with a letter, number, or punctuation mark; must not include line breaks or control characters; and must be less than 100 characters long.
     */
    Subject?: subject;
    /**
     * Set MessageStructure to json if you want to send a different message for each protocol. For example, using one publish action, you can send a short message to your SMS subscribers and a longer message to your email subscribers. If you set MessageStructure to json, the value of the Message parameter must:    be a syntactically valid JSON object; and   contain at least a top-level JSON key of "default" with a value that is a string.   You can define other top-level keys that define the message you want to send to a specific transport protocol (e.g., "http"). Valid value: json 
     */
    MessageStructure?: messageStructure;
    /**
     * Message attributes for Publish action.
     */
    MessageAttributes?: MessageAttributeMap;
    /**
     * This parameter applies only to FIFO (first-in-first-out) topics. The MessageDeduplicationId can contain up to 128 alphanumeric characters (a-z, A-Z, 0-9) and punctuation (!"#$%&amp;'()*+,-./:;&lt;=&gt;?@[\]^_`{|}~). Every message must have a unique MessageDeduplicationId, which is a token used for deduplication of sent messages. If a message with a particular MessageDeduplicationId is sent successfully, any message sent with the same MessageDeduplicationId during the 5-minute deduplication interval is treated as a duplicate.  If the topic has ContentBasedDeduplication set, the system generates a MessageDeduplicationId based on the contents of the message. Your MessageDeduplicationId overrides the generated one.
     */
    MessageDeduplicationId?: String;
    /**
     * This parameter applies only to FIFO (first-in-first-out) topics. The MessageGroupId can contain up to 128 alphanumeric characters (a-z, A-Z, 0-9) and punctuation (!"#$%&amp;'()*+,-./:;&lt;=&gt;?@[\]^_`{|}~). The MessageGroupId is a tag that specifies that a message belongs to a specific message group. Messages that belong to the same message group are processed in a FIFO manner (however, messages in different message groups might be processed out of order). Every message must include a MessageGroupId.
     */
    MessageGroupId?: String;
  }
  export interface PublishResponse {
    /**
     * Unique identifier assigned to the published message. Length Constraint: Maximum 100 characters
     */
    MessageId?: messageId;
    /**
     * This response element applies only to FIFO (first-in-first-out) topics.  The sequence number is a large, non-consecutive number that Amazon SNS assigns to each message. The length of SequenceNumber is 128 bits. SequenceNumber continues to increase for each MessageGroupId.
     */
    SequenceNumber?: String;
  }
  export interface PutDataProtectionPolicyInput {
    /**
     * The ARN of the topic whose DataProtectionPolicy you want to add or update. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    ResourceArn: topicARN;
    /**
     * The JSON serialization of the topic's DataProtectionPolicy. The DataProtectionPolicy must be in JSON string format. Length Constraints: Maximum length of 30,720.
     */
    DataProtectionPolicy: attributeValue;
  }
  export interface RemovePermissionInput {
    /**
     * The ARN of the topic whose access control policy you wish to modify.
     */
    TopicArn: topicARN;
    /**
     * The unique label of the statement you want to remove.
     */
    Label: label;
  }
  export type RouteType = "Transactional"|"Promotional"|"Premium"|string;
  export interface SMSSandboxPhoneNumber {
    /**
     * The destination phone number.
     */
    PhoneNumber?: PhoneNumberString;
    /**
     * The destination phone number's verification status.
     */
    Status?: SMSSandboxPhoneNumberVerificationStatus;
  }
  export type SMSSandboxPhoneNumberList = SMSSandboxPhoneNumber[];
  export type SMSSandboxPhoneNumberVerificationStatus = "Pending"|"Verified"|string;
  export interface SetEndpointAttributesInput {
    /**
     * EndpointArn used for SetEndpointAttributes action.
     */
    EndpointArn: String;
    /**
     * A map of the endpoint attributes. Attributes in this map include the following:    CustomUserData – arbitrary user data to associate with the endpoint. Amazon SNS does not use this data. The data must be in UTF-8 format and less than 2KB.    Enabled – flag that enables/disables delivery to the endpoint. Amazon SNS will set this to false when a notification service indicates to Amazon SNS that the endpoint is invalid. Users can set it back to true, typically after updating Token.    Token – device token, also referred to as a registration id, for an app and mobile device. This is returned from the notification service when an app and mobile device are registered with the notification service.  
     */
    Attributes: MapStringToString;
  }
  export interface SetPlatformApplicationAttributesInput {
    /**
     * PlatformApplicationArn for SetPlatformApplicationAttributes action.
     */
    PlatformApplicationArn: String;
    /**
     * A map of the platform application attributes. Attributes in this map include the following:    PlatformCredential – The credential received from the notification service.   For ADM, PlatformCredentialis client secret.   For Apple Services using certificate credentials, PlatformCredential is private key.   For Apple Services using token credentials, PlatformCredential is signing key.   For GCM (Firebase Cloud Messaging), PlatformCredential is API key.         PlatformPrincipal – The principal received from the notification service.   For ADM, PlatformPrincipalis client id.   For Apple Services using certificate credentials, PlatformPrincipal is SSL certificate.   For Apple Services using token credentials, PlatformPrincipal is signing key ID.   For GCM (Firebase Cloud Messaging), there is no PlatformPrincipal.         EventEndpointCreated – Topic ARN to which EndpointCreated event notifications are sent.    EventEndpointDeleted – Topic ARN to which EndpointDeleted event notifications are sent.    EventEndpointUpdated – Topic ARN to which EndpointUpdate event notifications are sent.    EventDeliveryFailure – Topic ARN to which DeliveryFailure event notifications are sent upon Direct Publish delivery failure (permanent) to one of the application's endpoints.    SuccessFeedbackRoleArn – IAM role ARN used to give Amazon SNS write access to use CloudWatch Logs on your behalf.    FailureFeedbackRoleArn – IAM role ARN used to give Amazon SNS write access to use CloudWatch Logs on your behalf.    SuccessFeedbackSampleRate – Sample rate percentage (0-100) of successfully delivered messages.   The following attributes only apply to APNs token-based authentication:    ApplePlatformTeamID – The identifier that's assigned to your Apple developer account team.    ApplePlatformBundleID – The bundle identifier that's assigned to your iOS app.  
     */
    Attributes: MapStringToString;
  }
  export interface SetSMSAttributesInput {
    /**
     * The default settings for sending SMS messages from your Amazon Web Services account. You can set values for the following attribute names:  MonthlySpendLimit – The maximum amount in USD that you are willing to spend each month to send SMS messages. When Amazon SNS determines that sending an SMS message would incur a cost that exceeds this limit, it stops sending SMS messages within minutes.  Amazon SNS stops sending SMS messages within minutes of the limit being crossed. During that interval, if you continue to send SMS messages, you will incur costs that exceed your limit.  By default, the spend limit is set to the maximum allowed by Amazon SNS. If you want to raise the limit, submit an SNS Limit Increase case. For New limit value, enter your desired monthly spend limit. In the Use Case Description field, explain that you are requesting an SMS monthly spend limit increase.  DeliveryStatusIAMRole – The ARN of the IAM role that allows Amazon SNS to write logs about SMS deliveries in CloudWatch Logs. For each SMS message that you send, Amazon SNS writes a log that includes the message price, the success or failure status, the reason for failure (if the message failed), the message dwell time, and other information.  DeliveryStatusSuccessSamplingRate – The percentage of successful SMS deliveries for which Amazon SNS will write logs in CloudWatch Logs. The value can be an integer from 0 - 100. For example, to write logs only for failed deliveries, set this value to 0. To write logs for 10% of your successful deliveries, set it to 10.  DefaultSenderID – A string, such as your business brand, that is displayed as the sender on the receiving device. Support for sender IDs varies by country. The sender ID can be 1 - 11 alphanumeric characters, and it must contain at least one letter.  DefaultSMSType – The type of SMS message that you will send by default. You can assign the following values:    Promotional – (Default) Noncritical messages, such as marketing messages. Amazon SNS optimizes the message delivery to incur the lowest cost.    Transactional – Critical messages that support customer transactions, such as one-time passcodes for multi-factor authentication. Amazon SNS optimizes the message delivery to achieve the highest reliability.    UsageReportS3Bucket – The name of the Amazon S3 bucket to receive daily SMS usage reports from Amazon SNS. Each day, Amazon SNS will deliver a usage report as a CSV file to the bucket. The report includes the following information for each SMS message that was successfully delivered by your Amazon Web Services account:   Time that the message was published (in UTC)   Message ID   Destination phone number   Message type   Delivery status   Message price (in USD)   Part number (a message is split into multiple parts if it is too long for a single message)   Total number of parts   To receive the report, the bucket must have a policy that allows the Amazon SNS service principal to perform the s3:PutObject and s3:GetBucketLocation actions. For an example bucket policy and usage report, see Monitoring SMS Activity in the Amazon SNS Developer Guide.
     */
    attributes: MapStringToString;
  }
  export interface SetSMSAttributesResponse {
  }
  export interface SetSubscriptionAttributesInput {
    /**
     * The ARN of the subscription to modify.
     */
    SubscriptionArn: subscriptionARN;
    /**
     * A map of attributes with their corresponding values. The following lists the names, descriptions, and values of the special request parameters that this action uses:    DeliveryPolicy – The policy that defines how Amazon SNS retries failed deliveries to HTTP/S endpoints.    FilterPolicy – The simple JSON object that lets your subscriber receive only a subset of messages, rather than receiving every message published to the topic.    FilterPolicyScope – This attribute lets you choose the filtering scope by using one of the following string value types:    MessageAttributes (default) – The filter is applied on the message attributes.    MessageBody – The filter is applied on the message body.      RawMessageDelivery – When set to true, enables raw message delivery to Amazon SQS or HTTP/S endpoints. This eliminates the need for the endpoints to process JSON formatting, which is otherwise created for Amazon SNS metadata.    RedrivePolicy – When specified, sends undeliverable messages to the specified Amazon SQS dead-letter queue. Messages that can't be delivered due to client errors (for example, when the subscribed endpoint is unreachable) or server errors (for example, when the service that powers the subscribed endpoint becomes unavailable) are held in the dead-letter queue for further analysis or reprocessing.   The following attribute applies only to Amazon Kinesis Data Firehose delivery stream subscriptions:    SubscriptionRoleArn – The ARN of the IAM role that has the following:   Permission to write to the Kinesis Data Firehose delivery stream   Amazon SNS listed as a trusted entity   Specifying a valid ARN for this attribute is required for Kinesis Data Firehose delivery stream subscriptions. For more information, see Fanout to Kinesis Data Firehose delivery streams in the Amazon SNS Developer Guide.  
     */
    AttributeName: attributeName;
    /**
     * The new value for the attribute in JSON format.
     */
    AttributeValue?: attributeValue;
  }
  export interface SetTopicAttributesInput {
    /**
     * The ARN of the topic to modify.
     */
    TopicArn: topicARN;
    /**
     * A map of attributes with their corresponding values. The following lists the names, descriptions, and values of the special request parameters that the SetTopicAttributes action uses:    ApplicationSuccessFeedbackRoleArn – Indicates failed message delivery status for an Amazon SNS topic that is subscribed to a platform application endpoint.    DeliveryPolicy – The policy that defines how Amazon SNS retries failed deliveries to HTTP/S endpoints.    DisplayName – The display name to use for a topic with SMS subscriptions.    Policy – The policy that defines who can access your topic. By default, only the topic owner can publish or subscribe to the topic.    TracingConfig – Tracing mode of an Amazon SNS topic. By default TracingConfig is set to PassThrough, and the topic passes through the tracing header it receives from an Amazon SNS publisher to its subscriptions. If set to Active, Amazon SNS will vend X-Ray segment data to topic owner account if the sampled flag in the tracing header is true. This is only supported on standard topics.   HTTP    HTTPSuccessFeedbackRoleArn – Indicates successful message delivery status for an Amazon SNS topic that is subscribed to an HTTP endpoint.     HTTPSuccessFeedbackSampleRate – Indicates percentage of successful messages to sample for an Amazon SNS topic that is subscribed to an HTTP endpoint.    HTTPFailureFeedbackRoleArn – Indicates failed message delivery status for an Amazon SNS topic that is subscribed to an HTTP endpoint.     Amazon Kinesis Data Firehose    FirehoseSuccessFeedbackRoleArn – Indicates successful message delivery status for an Amazon SNS topic that is subscribed to an Amazon Kinesis Data Firehose endpoint.    FirehoseSuccessFeedbackSampleRate – Indicates percentage of successful messages to sample for an Amazon SNS topic that is subscribed to an Amazon Kinesis Data Firehose endpoint.    FirehoseFailureFeedbackRoleArn – Indicates failed message delivery status for an Amazon SNS topic that is subscribed to an Amazon Kinesis Data Firehose endpoint.      Lambda    LambdaSuccessFeedbackRoleArn – Indicates successful message delivery status for an Amazon SNS topic that is subscribed to an Lambda endpoint.    LambdaSuccessFeedbackSampleRate – Indicates percentage of successful messages to sample for an Amazon SNS topic that is subscribed to an Lambda endpoint.    LambdaFailureFeedbackRoleArn – Indicates failed message delivery status for an Amazon SNS topic that is subscribed to an Lambda endpoint.      Platform application endpoint    ApplicationSuccessFeedbackRoleArn – Indicates successful message delivery status for an Amazon SNS topic that is subscribed to an Amazon Web Services application endpoint.    ApplicationSuccessFeedbackSampleRate – Indicates percentage of successful messages to sample for an Amazon SNS topic that is subscribed to an Amazon Web Services application endpoint.    ApplicationFailureFeedbackRoleArn – Indicates failed message delivery status for an Amazon SNS topic that is subscribed to an Amazon Web Services application endpoint.    In addition to being able to configure topic attributes for message delivery status of notification messages sent to Amazon SNS application endpoints, you can also configure application attributes for the delivery status of push notification messages sent to push notification services. For example, For more information, see Using Amazon SNS Application Attributes for Message Delivery Status.     Amazon SQS    SQSSuccessFeedbackRoleArn – Indicates successful message delivery status for an Amazon SNS topic that is subscribed to an Amazon SQS endpoint.     SQSSuccessFeedbackSampleRate – Indicates percentage of successful messages to sample for an Amazon SNS topic that is subscribed to an Amazon SQS endpoint.     SQSFailureFeedbackRoleArn – Indicates failed message delivery status for an Amazon SNS topic that is subscribed to an Amazon SQS endpoint.       The &lt;ENDPOINT&gt;SuccessFeedbackRoleArn and &lt;ENDPOINT&gt;FailureFeedbackRoleArn attributes are used to give Amazon SNS write access to use CloudWatch Logs on your behalf. The &lt;ENDPOINT&gt;SuccessFeedbackSampleRate attribute is for specifying the sample rate percentage (0-100) of successfully delivered messages. After you configure the &lt;ENDPOINT&gt;FailureFeedbackRoleArn attribute, then all failed message deliveries generate CloudWatch Logs.   The following attribute applies only to server-side-encryption:    KmsMasterKeyId – The ID of an Amazon Web Services managed customer master key (CMK) for Amazon SNS or a custom CMK. For more information, see Key Terms. For more examples, see KeyId in the Key Management Service API Reference.     SignatureVersion – The signature version corresponds to the hashing algorithm used while creating the signature of the notifications, subscription confirmations, or unsubscribe confirmation messages sent by Amazon SNS. By default, SignatureVersion is set to 1.   The following attribute applies only to FIFO topics:    ContentBasedDeduplication – Enables content-based deduplication for FIFO topics.   By default, ContentBasedDeduplication is set to false. If you create a FIFO topic and this attribute is false, you must specify a value for the MessageDeduplicationId parameter for the Publish action.    When you set ContentBasedDeduplication to true, Amazon SNS uses a SHA-256 hash to generate the MessageDeduplicationId using the body of the message (but not the attributes of the message). (Optional) To override the generated value, you can specify a value for the MessageDeduplicationId parameter for the Publish action.    
     */
    AttributeName: attributeName;
    /**
     * The new value for the attribute.
     */
    AttributeValue?: attributeValue;
  }
  export type String = string;
  export interface SubscribeInput {
    /**
     * The ARN of the topic you want to subscribe to.
     */
    TopicArn: topicARN;
    /**
     * The protocol that you want to use. Supported protocols include:    http – delivery of JSON-encoded message via HTTP POST    https – delivery of JSON-encoded message via HTTPS POST    email – delivery of message via SMTP    email-json – delivery of JSON-encoded message via SMTP    sms – delivery of message via SMS    sqs – delivery of JSON-encoded message to an Amazon SQS queue    application – delivery of JSON-encoded message to an EndpointArn for a mobile app and device    lambda – delivery of JSON-encoded message to an Lambda function    firehose – delivery of JSON-encoded message to an Amazon Kinesis Data Firehose delivery stream.  
     */
    Protocol: protocol;
    /**
     * The endpoint that you want to receive notifications. Endpoints vary by protocol:   For the http protocol, the (public) endpoint is a URL beginning with http://.   For the https protocol, the (public) endpoint is a URL beginning with https://.   For the email protocol, the endpoint is an email address.   For the email-json protocol, the endpoint is an email address.   For the sms protocol, the endpoint is a phone number of an SMS-enabled device.   For the sqs protocol, the endpoint is the ARN of an Amazon SQS queue.   For the application protocol, the endpoint is the EndpointArn of a mobile app and device.   For the lambda protocol, the endpoint is the ARN of an Lambda function.   For the firehose protocol, the endpoint is the ARN of an Amazon Kinesis Data Firehose delivery stream.  
     */
    Endpoint?: endpoint;
    /**
     * A map of attributes with their corresponding values. The following lists the names, descriptions, and values of the special request parameters that the Subscribe action uses:    DeliveryPolicy – The policy that defines how Amazon SNS retries failed deliveries to HTTP/S endpoints.    FilterPolicy – The simple JSON object that lets your subscriber receive only a subset of messages, rather than receiving every message published to the topic.    FilterPolicyScope – This attribute lets you choose the filtering scope by using one of the following string value types:    MessageAttributes (default) – The filter is applied on the message attributes.    MessageBody – The filter is applied on the message body.      RawMessageDelivery – When set to true, enables raw message delivery to Amazon SQS or HTTP/S endpoints. This eliminates the need for the endpoints to process JSON formatting, which is otherwise created for Amazon SNS metadata.    RedrivePolicy – When specified, sends undeliverable messages to the specified Amazon SQS dead-letter queue. Messages that can't be delivered due to client errors (for example, when the subscribed endpoint is unreachable) or server errors (for example, when the service that powers the subscribed endpoint becomes unavailable) are held in the dead-letter queue for further analysis or reprocessing.   The following attribute applies only to Amazon Kinesis Data Firehose delivery stream subscriptions:    SubscriptionRoleArn – The ARN of the IAM role that has the following:   Permission to write to the Kinesis Data Firehose delivery stream   Amazon SNS listed as a trusted entity   Specifying a valid ARN for this attribute is required for Kinesis Data Firehose delivery stream subscriptions. For more information, see Fanout to Kinesis Data Firehose delivery streams in the Amazon SNS Developer Guide.  
     */
    Attributes?: SubscriptionAttributesMap;
    /**
     * Sets whether the response from the Subscribe request includes the subscription ARN, even if the subscription is not yet confirmed. If you set this parameter to true, the response includes the ARN in all cases, even if the subscription is not yet confirmed. In addition to the ARN for confirmed subscriptions, the response also includes the pending subscription ARN value for subscriptions that aren't yet confirmed. A subscription becomes confirmed when the subscriber calls the ConfirmSubscription action with a confirmation token.  The default value is false.
     */
    ReturnSubscriptionArn?: boolean;
  }
  export interface SubscribeResponse {
    /**
     * The ARN of the subscription if it is confirmed, or the string "pending confirmation" if the subscription requires confirmation. However, if the API request parameter ReturnSubscriptionArn is true, then the value is always the subscription ARN, even if the subscription requires confirmation.
     */
    SubscriptionArn?: subscriptionARN;
  }
  export interface Subscription {
    /**
     * The subscription's ARN.
     */
    SubscriptionArn?: subscriptionARN;
    /**
     * The subscription's owner.
     */
    Owner?: account;
    /**
     * The subscription's protocol.
     */
    Protocol?: protocol;
    /**
     * The subscription's endpoint (format depends on the protocol).
     */
    Endpoint?: endpoint;
    /**
     * The ARN of the subscription's topic.
     */
    TopicArn?: topicARN;
  }
  export type SubscriptionAttributesMap = {[key: string]: attributeValue};
  export type SubscriptionsList = Subscription[];
  export interface Tag {
    /**
     * The required key portion of the tag.
     */
    Key: TagKey;
    /**
     * The optional value portion of the tag.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The ARN of the topic to which to add tags.
     */
    ResourceArn: AmazonResourceName;
    /**
     * The tags to be added to the specified topic. A tag consists of a required key and an optional value.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface Topic {
    /**
     * The topic's ARN.
     */
    TopicArn?: topicARN;
  }
  export type TopicAttributesMap = {[key: string]: attributeValue};
  export type TopicsList = Topic[];
  export interface UnsubscribeInput {
    /**
     * The ARN of the subscription to be deleted.
     */
    SubscriptionArn: subscriptionARN;
  }
  export interface UntagResourceRequest {
    /**
     * The ARN of the topic from which to remove tags.
     */
    ResourceArn: AmazonResourceName;
    /**
     * The list of tag keys to remove from the specified topic.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface VerifySMSSandboxPhoneNumberInput {
    /**
     * The destination phone number to verify.
     */
    PhoneNumber: PhoneNumberString;
    /**
     * The OTP sent to the destination number from the CreateSMSSandBoxPhoneNumber call.
     */
    OneTimePassword: OTPCode;
  }
  export interface VerifySMSSandboxPhoneNumberResult {
  }
  export type account = string;
  export type action = string;
  export type attributeName = string;
  export type attributeValue = string;
  export type authenticateOnUnsubscribe = string;
  export type delegate = string;
  export type endpoint = string;
  export type label = string;
  export type message = string;
  export type messageId = string;
  export type messageStructure = string;
  export type nextToken = string;
  export type protocol = string;
  export type subject = string;
  export type subscriptionARN = string;
  export type token = string;
  export type topicARN = string;
  export type topicName = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2010-03-31"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SNS client.
   */
  export import Types = SNS;
}
export = SNS;
