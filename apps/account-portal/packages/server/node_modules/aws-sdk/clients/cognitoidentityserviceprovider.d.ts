import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CognitoIdentityServiceProvider extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CognitoIdentityServiceProvider.Types.ClientConfiguration)
  config: Config & CognitoIdentityServiceProvider.Types.ClientConfiguration;
  /**
   * Adds additional user attributes to the user pool schema.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  addCustomAttributes(params: CognitoIdentityServiceProvider.Types.AddCustomAttributesRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AddCustomAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AddCustomAttributesResponse, AWSError>;
  /**
   * Adds additional user attributes to the user pool schema.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  addCustomAttributes(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AddCustomAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AddCustomAttributesResponse, AWSError>;
  /**
   * Adds the specified user to the specified group.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminAddUserToGroup(params: CognitoIdentityServiceProvider.Types.AdminAddUserToGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds the specified user to the specified group.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminAddUserToGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Confirms user registration as an admin without using a confirmation code. Works on any user.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminConfirmSignUp(params: CognitoIdentityServiceProvider.Types.AdminConfirmSignUpRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminConfirmSignUpResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminConfirmSignUpResponse, AWSError>;
  /**
   * Confirms user registration as an admin without using a confirmation code. Works on any user.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminConfirmSignUp(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminConfirmSignUpResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminConfirmSignUpResponse, AWSError>;
  /**
   * Creates a new user in the specified user pool. If MessageAction isn't set, the default is to send a welcome message via email or phone (SMS).  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide.  This message is based on a template that you configured in your call to create or update a user pool. This template includes your custom sign-up instructions and placeholders for user name and temporary password. Alternatively, you can call AdminCreateUser with SUPPRESS for the MessageAction parameter, and Amazon Cognito won't send any email.  In either case, the user will be in the FORCE_CHANGE_PASSWORD state until they sign in and change their password.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminCreateUser(params: CognitoIdentityServiceProvider.Types.AdminCreateUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminCreateUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminCreateUserResponse, AWSError>;
  /**
   * Creates a new user in the specified user pool. If MessageAction isn't set, the default is to send a welcome message via email or phone (SMS).  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide.  This message is based on a template that you configured in your call to create or update a user pool. This template includes your custom sign-up instructions and placeholders for user name and temporary password. Alternatively, you can call AdminCreateUser with SUPPRESS for the MessageAction parameter, and Amazon Cognito won't send any email.  In either case, the user will be in the FORCE_CHANGE_PASSWORD state until they sign in and change their password.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminCreateUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminCreateUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminCreateUserResponse, AWSError>;
  /**
   * Deletes a user as an administrator. Works on any user.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminDeleteUser(params: CognitoIdentityServiceProvider.Types.AdminDeleteUserRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a user as an administrator. Works on any user.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminDeleteUser(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the user attributes in a user pool as an administrator. Works on any user.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminDeleteUserAttributes(params: CognitoIdentityServiceProvider.Types.AdminDeleteUserAttributesRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminDeleteUserAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminDeleteUserAttributesResponse, AWSError>;
  /**
   * Deletes the user attributes in a user pool as an administrator. Works on any user.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminDeleteUserAttributes(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminDeleteUserAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminDeleteUserAttributesResponse, AWSError>;
  /**
   * Prevents the user from signing in with the specified external (SAML or social) identity provider (IdP). If the user that you want to deactivate is a Amazon Cognito user pools native username + password user, they can't use their password to sign in. If the user to deactivate is a linked external IdP user, any link between that user and an existing user is removed. When the external user signs in again, and the user is no longer attached to the previously linked DestinationUser, the user must create a new user account. See AdminLinkProviderForUser. The ProviderName must match the value specified when creating an IdP for the pool.  To deactivate a native username + password user, the ProviderName value must be Cognito and the ProviderAttributeName must be Cognito_Subject. The ProviderAttributeValue must be the name that is used in the user pool for the user. The ProviderAttributeName must always be Cognito_Subject for social IdPs. The ProviderAttributeValue must always be the exact subject that was used when the user was originally linked as a source user. For de-linking a SAML identity, there are two scenarios. If the linked identity has not yet been used to sign in, the ProviderAttributeName and ProviderAttributeValue must be the same values that were used for the SourceUser when the identities were originally linked using  AdminLinkProviderForUser call. (If the linking was done with ProviderAttributeName set to Cognito_Subject, the same applies here). However, if the user has already signed in, the ProviderAttributeName must be Cognito_Subject and ProviderAttributeValue must be the subject of the SAML assertion.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminDisableProviderForUser(params: CognitoIdentityServiceProvider.Types.AdminDisableProviderForUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminDisableProviderForUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminDisableProviderForUserResponse, AWSError>;
  /**
   * Prevents the user from signing in with the specified external (SAML or social) identity provider (IdP). If the user that you want to deactivate is a Amazon Cognito user pools native username + password user, they can't use their password to sign in. If the user to deactivate is a linked external IdP user, any link between that user and an existing user is removed. When the external user signs in again, and the user is no longer attached to the previously linked DestinationUser, the user must create a new user account. See AdminLinkProviderForUser. The ProviderName must match the value specified when creating an IdP for the pool.  To deactivate a native username + password user, the ProviderName value must be Cognito and the ProviderAttributeName must be Cognito_Subject. The ProviderAttributeValue must be the name that is used in the user pool for the user. The ProviderAttributeName must always be Cognito_Subject for social IdPs. The ProviderAttributeValue must always be the exact subject that was used when the user was originally linked as a source user. For de-linking a SAML identity, there are two scenarios. If the linked identity has not yet been used to sign in, the ProviderAttributeName and ProviderAttributeValue must be the same values that were used for the SourceUser when the identities were originally linked using  AdminLinkProviderForUser call. (If the linking was done with ProviderAttributeName set to Cognito_Subject, the same applies here). However, if the user has already signed in, the ProviderAttributeName must be Cognito_Subject and ProviderAttributeValue must be the subject of the SAML assertion.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminDisableProviderForUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminDisableProviderForUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminDisableProviderForUserResponse, AWSError>;
  /**
   * Deactivates a user and revokes all access tokens for the user. A deactivated user can't sign in, but still appears in the responses to GetUser and ListUsers API requests.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminDisableUser(params: CognitoIdentityServiceProvider.Types.AdminDisableUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminDisableUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminDisableUserResponse, AWSError>;
  /**
   * Deactivates a user and revokes all access tokens for the user. A deactivated user can't sign in, but still appears in the responses to GetUser and ListUsers API requests.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminDisableUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminDisableUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminDisableUserResponse, AWSError>;
  /**
   * Enables the specified user as an administrator. Works on any user.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminEnableUser(params: CognitoIdentityServiceProvider.Types.AdminEnableUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminEnableUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminEnableUserResponse, AWSError>;
  /**
   * Enables the specified user as an administrator. Works on any user.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminEnableUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminEnableUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminEnableUserResponse, AWSError>;
  /**
   * Forgets the device, as an administrator.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminForgetDevice(params: CognitoIdentityServiceProvider.Types.AdminForgetDeviceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Forgets the device, as an administrator.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminForgetDevice(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets the device, as an administrator.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminGetDevice(params: CognitoIdentityServiceProvider.Types.AdminGetDeviceRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminGetDeviceResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminGetDeviceResponse, AWSError>;
  /**
   * Gets the device, as an administrator.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminGetDevice(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminGetDeviceResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminGetDeviceResponse, AWSError>;
  /**
   * Gets the specified user by user name in a user pool as an administrator. Works on any user.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminGetUser(params: CognitoIdentityServiceProvider.Types.AdminGetUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminGetUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminGetUserResponse, AWSError>;
  /**
   * Gets the specified user by user name in a user pool as an administrator. Works on any user.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminGetUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminGetUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminGetUserResponse, AWSError>;
  /**
   * Initiates the authentication flow, as an administrator.  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide.   Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminInitiateAuth(params: CognitoIdentityServiceProvider.Types.AdminInitiateAuthRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminInitiateAuthResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminInitiateAuthResponse, AWSError>;
  /**
   * Initiates the authentication flow, as an administrator.  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide.   Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminInitiateAuth(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminInitiateAuthResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminInitiateAuthResponse, AWSError>;
  /**
   * Links an existing user account in a user pool (DestinationUser) to an identity from an external IdP (SourceUser) based on a specified attribute name and value from the external IdP. This allows you to create a link from the existing user account to an external federated user identity that has not yet been used to sign in. You can then use the federated user identity to sign in as the existing user account.   For example, if there is an existing user with a username and password, this API links that user to a federated user identity. When the user signs in with a federated user identity, they sign in as the existing user account.  The maximum number of federated identities linked to a user is five.   Because this API allows a user with an external federated identity to sign in as an existing user in the user pool, it is critical that it only be used with external IdPs and provider attributes that have been trusted by the application owner.   Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminLinkProviderForUser(params: CognitoIdentityServiceProvider.Types.AdminLinkProviderForUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminLinkProviderForUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminLinkProviderForUserResponse, AWSError>;
  /**
   * Links an existing user account in a user pool (DestinationUser) to an identity from an external IdP (SourceUser) based on a specified attribute name and value from the external IdP. This allows you to create a link from the existing user account to an external federated user identity that has not yet been used to sign in. You can then use the federated user identity to sign in as the existing user account.   For example, if there is an existing user with a username and password, this API links that user to a federated user identity. When the user signs in with a federated user identity, they sign in as the existing user account.  The maximum number of federated identities linked to a user is five.   Because this API allows a user with an external federated identity to sign in as an existing user in the user pool, it is critical that it only be used with external IdPs and provider attributes that have been trusted by the application owner.   Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminLinkProviderForUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminLinkProviderForUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminLinkProviderForUserResponse, AWSError>;
  /**
   * Lists devices, as an administrator.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminListDevices(params: CognitoIdentityServiceProvider.Types.AdminListDevicesRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminListDevicesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminListDevicesResponse, AWSError>;
  /**
   * Lists devices, as an administrator.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminListDevices(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminListDevicesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminListDevicesResponse, AWSError>;
  /**
   * Lists the groups that the user belongs to.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminListGroupsForUser(params: CognitoIdentityServiceProvider.Types.AdminListGroupsForUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminListGroupsForUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminListGroupsForUserResponse, AWSError>;
  /**
   * Lists the groups that the user belongs to.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminListGroupsForUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminListGroupsForUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminListGroupsForUserResponse, AWSError>;
  /**
   * A history of user activity and any risks detected as part of Amazon Cognito advanced security.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminListUserAuthEvents(params: CognitoIdentityServiceProvider.Types.AdminListUserAuthEventsRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminListUserAuthEventsResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminListUserAuthEventsResponse, AWSError>;
  /**
   * A history of user activity and any risks detected as part of Amazon Cognito advanced security.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminListUserAuthEvents(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminListUserAuthEventsResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminListUserAuthEventsResponse, AWSError>;
  /**
   * Removes the specified user from the specified group.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminRemoveUserFromGroup(params: CognitoIdentityServiceProvider.Types.AdminRemoveUserFromGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified user from the specified group.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminRemoveUserFromGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Resets the specified user's password in a user pool as an administrator. Works on any user.  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide.  Deactivates a user's password, requiring them to change it. If a user tries to sign in after the API is called, Amazon Cognito responds with a PasswordResetRequiredException error. Your app must then perform the actions that reset your user's password: the forgot-password flow. In addition, if the user pool has phone verification selected and a verified phone number exists for the user, or if email verification is selected and a verified email exists for the user, calling this API will also result in sending a message to the end user with the code to change their password.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminResetUserPassword(params: CognitoIdentityServiceProvider.Types.AdminResetUserPasswordRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminResetUserPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminResetUserPasswordResponse, AWSError>;
  /**
   * Resets the specified user's password in a user pool as an administrator. Works on any user.  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide.  Deactivates a user's password, requiring them to change it. If a user tries to sign in after the API is called, Amazon Cognito responds with a PasswordResetRequiredException error. Your app must then perform the actions that reset your user's password: the forgot-password flow. In addition, if the user pool has phone verification selected and a verified phone number exists for the user, or if email verification is selected and a verified email exists for the user, calling this API will also result in sending a message to the end user with the code to change their password.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminResetUserPassword(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminResetUserPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminResetUserPasswordResponse, AWSError>;
  /**
   * Responds to an authentication challenge, as an administrator.  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide.   Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminRespondToAuthChallenge(params: CognitoIdentityServiceProvider.Types.AdminRespondToAuthChallengeRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminRespondToAuthChallengeResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminRespondToAuthChallengeResponse, AWSError>;
  /**
   * Responds to an authentication challenge, as an administrator.  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide.   Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminRespondToAuthChallenge(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminRespondToAuthChallengeResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminRespondToAuthChallengeResponse, AWSError>;
  /**
   * The user's multi-factor authentication (MFA) preference, including which MFA options are activated, and if any are preferred. Only one factor can be set as preferred. The preferred MFA factor will be used to authenticate a user if multiple factors are activated. If multiple options are activated and no preference is set, a challenge to choose an MFA option will be returned during sign-in.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminSetUserMFAPreference(params: CognitoIdentityServiceProvider.Types.AdminSetUserMFAPreferenceRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminSetUserMFAPreferenceResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminSetUserMFAPreferenceResponse, AWSError>;
  /**
   * The user's multi-factor authentication (MFA) preference, including which MFA options are activated, and if any are preferred. Only one factor can be set as preferred. The preferred MFA factor will be used to authenticate a user if multiple factors are activated. If multiple options are activated and no preference is set, a challenge to choose an MFA option will be returned during sign-in.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminSetUserMFAPreference(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminSetUserMFAPreferenceResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminSetUserMFAPreferenceResponse, AWSError>;
  /**
   * Sets the specified user's password in a user pool as an administrator. Works on any user.  The password can be temporary or permanent. If it is temporary, the user status enters the FORCE_CHANGE_PASSWORD state. When the user next tries to sign in, the InitiateAuth/AdminInitiateAuth response will contain the NEW_PASSWORD_REQUIRED challenge. If the user doesn't sign in before it expires, the user won't be able to sign in, and an administrator must reset their password.  Once the user has set a new password, or the password is permanent, the user status is set to Confirmed.  AdminSetUserPassword can set a password for the user profile that Amazon Cognito creates for third-party federated users. When you set a password, the federated user's status changes from EXTERNAL_PROVIDER to CONFIRMED. A user in this state can sign in as a federated user, and initiate authentication flows in the API like a linked native user. They can also modify their password and attributes in token-authenticated API requests like ChangePassword and UpdateUserAttributes. As a best security practice and to keep users in sync with your external IdP, don't set passwords on federated user profiles. To set up a federated user for native sign-in with a linked native user, refer to Linking federated users to an existing user profile.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminSetUserPassword(params: CognitoIdentityServiceProvider.Types.AdminSetUserPasswordRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminSetUserPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminSetUserPasswordResponse, AWSError>;
  /**
   * Sets the specified user's password in a user pool as an administrator. Works on any user.  The password can be temporary or permanent. If it is temporary, the user status enters the FORCE_CHANGE_PASSWORD state. When the user next tries to sign in, the InitiateAuth/AdminInitiateAuth response will contain the NEW_PASSWORD_REQUIRED challenge. If the user doesn't sign in before it expires, the user won't be able to sign in, and an administrator must reset their password.  Once the user has set a new password, or the password is permanent, the user status is set to Confirmed.  AdminSetUserPassword can set a password for the user profile that Amazon Cognito creates for third-party federated users. When you set a password, the federated user's status changes from EXTERNAL_PROVIDER to CONFIRMED. A user in this state can sign in as a federated user, and initiate authentication flows in the API like a linked native user. They can also modify their password and attributes in token-authenticated API requests like ChangePassword and UpdateUserAttributes. As a best security practice and to keep users in sync with your external IdP, don't set passwords on federated user profiles. To set up a federated user for native sign-in with a linked native user, refer to Linking federated users to an existing user profile.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminSetUserPassword(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminSetUserPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminSetUserPasswordResponse, AWSError>;
  /**
   *  This action is no longer supported. You can use it to configure only SMS MFA. You can't use it to configure time-based one-time password (TOTP) software token MFA. To configure either type of MFA, use AdminSetUserMFAPreference instead.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminSetUserSettings(params: CognitoIdentityServiceProvider.Types.AdminSetUserSettingsRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminSetUserSettingsResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminSetUserSettingsResponse, AWSError>;
  /**
   *  This action is no longer supported. You can use it to configure only SMS MFA. You can't use it to configure time-based one-time password (TOTP) software token MFA. To configure either type of MFA, use AdminSetUserMFAPreference instead.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminSetUserSettings(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminSetUserSettingsResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminSetUserSettingsResponse, AWSError>;
  /**
   * Provides feedback for an authentication event indicating if it was from a valid user. This feedback is used for improving the risk evaluation decision for the user pool as part of Amazon Cognito advanced security.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminUpdateAuthEventFeedback(params: CognitoIdentityServiceProvider.Types.AdminUpdateAuthEventFeedbackRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUpdateAuthEventFeedbackResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUpdateAuthEventFeedbackResponse, AWSError>;
  /**
   * Provides feedback for an authentication event indicating if it was from a valid user. This feedback is used for improving the risk evaluation decision for the user pool as part of Amazon Cognito advanced security.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminUpdateAuthEventFeedback(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUpdateAuthEventFeedbackResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUpdateAuthEventFeedbackResponse, AWSError>;
  /**
   * Updates the device status as an administrator.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminUpdateDeviceStatus(params: CognitoIdentityServiceProvider.Types.AdminUpdateDeviceStatusRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUpdateDeviceStatusResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUpdateDeviceStatusResponse, AWSError>;
  /**
   * Updates the device status as an administrator.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminUpdateDeviceStatus(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUpdateDeviceStatusResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUpdateDeviceStatusResponse, AWSError>;
  /**
   *  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide.  Updates the specified user's attributes, including developer attributes, as an administrator. Works on any user. To delete an attribute from your user, submit the attribute in your API request with a blank value. For custom attributes, you must prepend the custom: prefix to the attribute name. In addition to updating user attributes, this API can also be used to mark phone and email as verified.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminUpdateUserAttributes(params: CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesResponse, AWSError>;
  /**
   *  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide.  Updates the specified user's attributes, including developer attributes, as an administrator. Works on any user. To delete an attribute from your user, submit the attribute in your API request with a blank value. For custom attributes, you must prepend the custom: prefix to the attribute name. In addition to updating user attributes, this API can also be used to mark phone and email as verified.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminUpdateUserAttributes(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesResponse, AWSError>;
  /**
   * Signs out a user from all devices. AdminUserGlobalSignOut invalidates all identity, access and refresh tokens that Amazon Cognito has issued to a user. A user can still use a hosted UI cookie to retrieve new tokens for the duration of the 1-hour cookie validity period. Your app isn't aware that a user's access token is revoked unless it attempts to authorize a user pools API request with an access token that contains the scope aws.cognito.signin.user.admin. Your app might otherwise accept access tokens until they expire.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminUserGlobalSignOut(params: CognitoIdentityServiceProvider.Types.AdminUserGlobalSignOutRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUserGlobalSignOutResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUserGlobalSignOutResponse, AWSError>;
  /**
   * Signs out a user from all devices. AdminUserGlobalSignOut invalidates all identity, access and refresh tokens that Amazon Cognito has issued to a user. A user can still use a hosted UI cookie to retrieve new tokens for the duration of the 1-hour cookie validity period. Your app isn't aware that a user's access token is revoked unless it attempts to authorize a user pools API request with an access token that contains the scope aws.cognito.signin.user.admin. Your app might otherwise accept access tokens until they expire.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  adminUserGlobalSignOut(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUserGlobalSignOutResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUserGlobalSignOutResponse, AWSError>;
  /**
   * Begins setup of time-based one-time password (TOTP) multi-factor authentication (MFA) for a user, with a unique private key that Amazon Cognito generates and returns in the API response. You can authorize an AssociateSoftwareToken request with either the user's access token, or a session string from a challenge response that you received from Amazon Cognito.  Amazon Cognito disassociates an existing software token when you verify the new token in a  VerifySoftwareToken API request. If you don't verify the software token and your user pool doesn't require MFA, the user can then authenticate with user name and password credentials alone. If your user pool requires TOTP MFA, Amazon Cognito generates an MFA_SETUP or SOFTWARE_TOKEN_SETUP challenge each time your user signs. Complete setup with AssociateSoftwareToken and VerifySoftwareToken. After you set up software token MFA for your user, Amazon Cognito generates a SOFTWARE_TOKEN_MFA challenge when they authenticate. Respond to this challenge with your user's TOTP.   Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  associateSoftwareToken(params: CognitoIdentityServiceProvider.Types.AssociateSoftwareTokenRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AssociateSoftwareTokenResponse) => void): Request<CognitoIdentityServiceProvider.Types.AssociateSoftwareTokenResponse, AWSError>;
  /**
   * Begins setup of time-based one-time password (TOTP) multi-factor authentication (MFA) for a user, with a unique private key that Amazon Cognito generates and returns in the API response. You can authorize an AssociateSoftwareToken request with either the user's access token, or a session string from a challenge response that you received from Amazon Cognito.  Amazon Cognito disassociates an existing software token when you verify the new token in a  VerifySoftwareToken API request. If you don't verify the software token and your user pool doesn't require MFA, the user can then authenticate with user name and password credentials alone. If your user pool requires TOTP MFA, Amazon Cognito generates an MFA_SETUP or SOFTWARE_TOKEN_SETUP challenge each time your user signs. Complete setup with AssociateSoftwareToken and VerifySoftwareToken. After you set up software token MFA for your user, Amazon Cognito generates a SOFTWARE_TOKEN_MFA challenge when they authenticate. Respond to this challenge with your user's TOTP.   Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  associateSoftwareToken(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AssociateSoftwareTokenResponse) => void): Request<CognitoIdentityServiceProvider.Types.AssociateSoftwareTokenResponse, AWSError>;
  /**
   * Changes the password for a specified user in a user pool.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  changePassword(params: CognitoIdentityServiceProvider.Types.ChangePasswordRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ChangePasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.ChangePasswordResponse, AWSError>;
  /**
   * Changes the password for a specified user in a user pool.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  changePassword(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ChangePasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.ChangePasswordResponse, AWSError>;
  /**
   * Confirms tracking of the device. This API call is the call that begins device tracking.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  confirmDevice(params: CognitoIdentityServiceProvider.Types.ConfirmDeviceRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ConfirmDeviceResponse) => void): Request<CognitoIdentityServiceProvider.Types.ConfirmDeviceResponse, AWSError>;
  /**
   * Confirms tracking of the device. This API call is the call that begins device tracking.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  confirmDevice(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ConfirmDeviceResponse) => void): Request<CognitoIdentityServiceProvider.Types.ConfirmDeviceResponse, AWSError>;
  /**
   * Allows a user to enter a confirmation code to reset a forgotten password.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  confirmForgotPassword(params: CognitoIdentityServiceProvider.Types.ConfirmForgotPasswordRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ConfirmForgotPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.ConfirmForgotPasswordResponse, AWSError>;
  /**
   * Allows a user to enter a confirmation code to reset a forgotten password.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  confirmForgotPassword(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ConfirmForgotPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.ConfirmForgotPasswordResponse, AWSError>;
  /**
   * Confirms registration of a new user.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  confirmSignUp(params: CognitoIdentityServiceProvider.Types.ConfirmSignUpRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ConfirmSignUpResponse) => void): Request<CognitoIdentityServiceProvider.Types.ConfirmSignUpResponse, AWSError>;
  /**
   * Confirms registration of a new user.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  confirmSignUp(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ConfirmSignUpResponse) => void): Request<CognitoIdentityServiceProvider.Types.ConfirmSignUpResponse, AWSError>;
  /**
   * Creates a new group in the specified user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  createGroup(params: CognitoIdentityServiceProvider.Types.CreateGroupRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateGroupResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateGroupResponse, AWSError>;
  /**
   * Creates a new group in the specified user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  createGroup(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateGroupResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateGroupResponse, AWSError>;
  /**
   * Creates an IdP for a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  createIdentityProvider(params: CognitoIdentityServiceProvider.Types.CreateIdentityProviderRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateIdentityProviderResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateIdentityProviderResponse, AWSError>;
  /**
   * Creates an IdP for a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  createIdentityProvider(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateIdentityProviderResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateIdentityProviderResponse, AWSError>;
  /**
   * Creates a new OAuth2.0 resource server and defines custom scopes within it.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  createResourceServer(params: CognitoIdentityServiceProvider.Types.CreateResourceServerRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateResourceServerResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateResourceServerResponse, AWSError>;
  /**
   * Creates a new OAuth2.0 resource server and defines custom scopes within it.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  createResourceServer(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateResourceServerResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateResourceServerResponse, AWSError>;
  /**
   * Creates a user import job.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  createUserImportJob(params: CognitoIdentityServiceProvider.Types.CreateUserImportJobRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateUserImportJobResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateUserImportJobResponse, AWSError>;
  /**
   * Creates a user import job.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  createUserImportJob(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateUserImportJobResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateUserImportJobResponse, AWSError>;
  /**
   *  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide.  Creates a new Amazon Cognito user pool and sets the password policy for the pool.  If you don't provide a value for an attribute, Amazon Cognito sets it to its default value.   Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  createUserPool(params: CognitoIdentityServiceProvider.Types.CreateUserPoolRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateUserPoolResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateUserPoolResponse, AWSError>;
  /**
   *  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide.  Creates a new Amazon Cognito user pool and sets the password policy for the pool.  If you don't provide a value for an attribute, Amazon Cognito sets it to its default value.   Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  createUserPool(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateUserPoolResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateUserPoolResponse, AWSError>;
  /**
   * Creates the user pool client. When you create a new user pool client, token revocation is automatically activated. For more information about revoking tokens, see RevokeToken.  If you don't provide a value for an attribute, Amazon Cognito sets it to its default value.   Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  createUserPoolClient(params: CognitoIdentityServiceProvider.Types.CreateUserPoolClientRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateUserPoolClientResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateUserPoolClientResponse, AWSError>;
  /**
   * Creates the user pool client. When you create a new user pool client, token revocation is automatically activated. For more information about revoking tokens, see RevokeToken.  If you don't provide a value for an attribute, Amazon Cognito sets it to its default value.   Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  createUserPoolClient(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateUserPoolClientResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateUserPoolClientResponse, AWSError>;
  /**
   * Creates a new domain for a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  createUserPoolDomain(params: CognitoIdentityServiceProvider.Types.CreateUserPoolDomainRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateUserPoolDomainResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateUserPoolDomainResponse, AWSError>;
  /**
   * Creates a new domain for a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  createUserPoolDomain(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateUserPoolDomainResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateUserPoolDomainResponse, AWSError>;
  /**
   * Deletes a group. Calling this action requires developer credentials.
   */
  deleteGroup(params: CognitoIdentityServiceProvider.Types.DeleteGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a group. Calling this action requires developer credentials.
   */
  deleteGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an IdP for a user pool.
   */
  deleteIdentityProvider(params: CognitoIdentityServiceProvider.Types.DeleteIdentityProviderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an IdP for a user pool.
   */
  deleteIdentityProvider(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a resource server.
   */
  deleteResourceServer(params: CognitoIdentityServiceProvider.Types.DeleteResourceServerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a resource server.
   */
  deleteResourceServer(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Allows a user to delete their own user profile.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  deleteUser(params: CognitoIdentityServiceProvider.Types.DeleteUserRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Allows a user to delete their own user profile.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  deleteUser(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the attributes for a user.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  deleteUserAttributes(params: CognitoIdentityServiceProvider.Types.DeleteUserAttributesRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DeleteUserAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.DeleteUserAttributesResponse, AWSError>;
  /**
   * Deletes the attributes for a user.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  deleteUserAttributes(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DeleteUserAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.DeleteUserAttributesResponse, AWSError>;
  /**
   * Deletes the specified Amazon Cognito user pool.
   */
  deleteUserPool(params: CognitoIdentityServiceProvider.Types.DeleteUserPoolRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified Amazon Cognito user pool.
   */
  deleteUserPool(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Allows the developer to delete the user pool client.
   */
  deleteUserPoolClient(params: CognitoIdentityServiceProvider.Types.DeleteUserPoolClientRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Allows the developer to delete the user pool client.
   */
  deleteUserPoolClient(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a domain for a user pool.
   */
  deleteUserPoolDomain(params: CognitoIdentityServiceProvider.Types.DeleteUserPoolDomainRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DeleteUserPoolDomainResponse) => void): Request<CognitoIdentityServiceProvider.Types.DeleteUserPoolDomainResponse, AWSError>;
  /**
   * Deletes a domain for a user pool.
   */
  deleteUserPoolDomain(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DeleteUserPoolDomainResponse) => void): Request<CognitoIdentityServiceProvider.Types.DeleteUserPoolDomainResponse, AWSError>;
  /**
   * Gets information about a specific IdP.
   */
  describeIdentityProvider(params: CognitoIdentityServiceProvider.Types.DescribeIdentityProviderRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeIdentityProviderResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeIdentityProviderResponse, AWSError>;
  /**
   * Gets information about a specific IdP.
   */
  describeIdentityProvider(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeIdentityProviderResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeIdentityProviderResponse, AWSError>;
  /**
   * Describes a resource server.
   */
  describeResourceServer(params: CognitoIdentityServiceProvider.Types.DescribeResourceServerRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeResourceServerResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeResourceServerResponse, AWSError>;
  /**
   * Describes a resource server.
   */
  describeResourceServer(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeResourceServerResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeResourceServerResponse, AWSError>;
  /**
   * Describes the risk configuration.
   */
  describeRiskConfiguration(params: CognitoIdentityServiceProvider.Types.DescribeRiskConfigurationRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeRiskConfigurationResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeRiskConfigurationResponse, AWSError>;
  /**
   * Describes the risk configuration.
   */
  describeRiskConfiguration(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeRiskConfigurationResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeRiskConfigurationResponse, AWSError>;
  /**
   * Describes the user import job.
   */
  describeUserImportJob(params: CognitoIdentityServiceProvider.Types.DescribeUserImportJobRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeUserImportJobResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeUserImportJobResponse, AWSError>;
  /**
   * Describes the user import job.
   */
  describeUserImportJob(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeUserImportJobResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeUserImportJobResponse, AWSError>;
  /**
   * Returns the configuration information and metadata of the specified user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  describeUserPool(params: CognitoIdentityServiceProvider.Types.DescribeUserPoolRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeUserPoolResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeUserPoolResponse, AWSError>;
  /**
   * Returns the configuration information and metadata of the specified user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  describeUserPool(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeUserPoolResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeUserPoolResponse, AWSError>;
  /**
   * Client method for returning the configuration information and metadata of the specified user pool app client.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  describeUserPoolClient(params: CognitoIdentityServiceProvider.Types.DescribeUserPoolClientRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeUserPoolClientResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeUserPoolClientResponse, AWSError>;
  /**
   * Client method for returning the configuration information and metadata of the specified user pool app client.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  describeUserPoolClient(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeUserPoolClientResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeUserPoolClientResponse, AWSError>;
  /**
   * Gets information about a domain.
   */
  describeUserPoolDomain(params: CognitoIdentityServiceProvider.Types.DescribeUserPoolDomainRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeUserPoolDomainResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeUserPoolDomainResponse, AWSError>;
  /**
   * Gets information about a domain.
   */
  describeUserPoolDomain(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeUserPoolDomainResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeUserPoolDomainResponse, AWSError>;
  /**
   * Forgets the specified device.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  forgetDevice(params: CognitoIdentityServiceProvider.Types.ForgetDeviceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Forgets the specified device.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  forgetDevice(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Calling this API causes a message to be sent to the end user with a confirmation code that is required to change the user's password. For the Username parameter, you can use the username or user alias. The method used to send the confirmation code is sent according to the specified AccountRecoverySetting. For more information, see Recovering User Accounts in the Amazon Cognito Developer Guide. To use the confirmation code for resetting the password, call ConfirmForgotPassword.  If neither a verified phone number nor a verified email exists, this API returns InvalidParameterException. If your app client has a client secret and you don't provide a SECRET_HASH parameter, this API returns NotAuthorizedException.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs.   This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  forgotPassword(params: CognitoIdentityServiceProvider.Types.ForgotPasswordRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ForgotPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.ForgotPasswordResponse, AWSError>;
  /**
   * Calling this API causes a message to be sent to the end user with a confirmation code that is required to change the user's password. For the Username parameter, you can use the username or user alias. The method used to send the confirmation code is sent according to the specified AccountRecoverySetting. For more information, see Recovering User Accounts in the Amazon Cognito Developer Guide. To use the confirmation code for resetting the password, call ConfirmForgotPassword.  If neither a verified phone number nor a verified email exists, this API returns InvalidParameterException. If your app client has a client secret and you don't provide a SECRET_HASH parameter, this API returns NotAuthorizedException.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs.   This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  forgotPassword(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ForgotPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.ForgotPasswordResponse, AWSError>;
  /**
   * Gets the header information for the comma-separated value (CSV) file to be used as input for the user import job.
   */
  getCSVHeader(params: CognitoIdentityServiceProvider.Types.GetCSVHeaderRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetCSVHeaderResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetCSVHeaderResponse, AWSError>;
  /**
   * Gets the header information for the comma-separated value (CSV) file to be used as input for the user import job.
   */
  getCSVHeader(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetCSVHeaderResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetCSVHeaderResponse, AWSError>;
  /**
   * Gets the device.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  getDevice(params: CognitoIdentityServiceProvider.Types.GetDeviceRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetDeviceResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetDeviceResponse, AWSError>;
  /**
   * Gets the device.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  getDevice(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetDeviceResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetDeviceResponse, AWSError>;
  /**
   * Gets a group. Calling this action requires developer credentials.
   */
  getGroup(params: CognitoIdentityServiceProvider.Types.GetGroupRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetGroupResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetGroupResponse, AWSError>;
  /**
   * Gets a group. Calling this action requires developer credentials.
   */
  getGroup(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetGroupResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetGroupResponse, AWSError>;
  /**
   * Gets the specified IdP.
   */
  getIdentityProviderByIdentifier(params: CognitoIdentityServiceProvider.Types.GetIdentityProviderByIdentifierRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetIdentityProviderByIdentifierResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetIdentityProviderByIdentifierResponse, AWSError>;
  /**
   * Gets the specified IdP.
   */
  getIdentityProviderByIdentifier(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetIdentityProviderByIdentifierResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetIdentityProviderByIdentifierResponse, AWSError>;
  /**
   * Gets the detailed activity logging configuration for a user pool.
   */
  getLogDeliveryConfiguration(params: CognitoIdentityServiceProvider.Types.GetLogDeliveryConfigurationRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetLogDeliveryConfigurationResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetLogDeliveryConfigurationResponse, AWSError>;
  /**
   * Gets the detailed activity logging configuration for a user pool.
   */
  getLogDeliveryConfiguration(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetLogDeliveryConfigurationResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetLogDeliveryConfigurationResponse, AWSError>;
  /**
   * This method takes a user pool ID, and returns the signing certificate. The issued certificate is valid for 10 years from the date of issue. Amazon Cognito issues and assigns a new signing certificate annually. This process returns a new value in the response to GetSigningCertificate, but doesn't invalidate the original certificate.
   */
  getSigningCertificate(params: CognitoIdentityServiceProvider.Types.GetSigningCertificateRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetSigningCertificateResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetSigningCertificateResponse, AWSError>;
  /**
   * This method takes a user pool ID, and returns the signing certificate. The issued certificate is valid for 10 years from the date of issue. Amazon Cognito issues and assigns a new signing certificate annually. This process returns a new value in the response to GetSigningCertificate, but doesn't invalidate the original certificate.
   */
  getSigningCertificate(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetSigningCertificateResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetSigningCertificateResponse, AWSError>;
  /**
   * Gets the user interface (UI) Customization information for a particular app client's app UI, if any such information exists for the client. If nothing is set for the particular client, but there is an existing pool level customization (the app clientId is ALL), then that information is returned. If nothing is present, then an empty shape is returned.
   */
  getUICustomization(params: CognitoIdentityServiceProvider.Types.GetUICustomizationRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetUICustomizationResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetUICustomizationResponse, AWSError>;
  /**
   * Gets the user interface (UI) Customization information for a particular app client's app UI, if any such information exists for the client. If nothing is set for the particular client, but there is an existing pool level customization (the app clientId is ALL), then that information is returned. If nothing is present, then an empty shape is returned.
   */
  getUICustomization(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetUICustomizationResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetUICustomizationResponse, AWSError>;
  /**
   * Gets the user attributes and metadata for a user.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  getUser(params: CognitoIdentityServiceProvider.Types.GetUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetUserResponse, AWSError>;
  /**
   * Gets the user attributes and metadata for a user.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  getUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetUserResponse, AWSError>;
  /**
   * Generates a user attribute verification code for the specified attribute name. Sends a message to a user with a code that they must return in a VerifyUserAttribute request.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs.   This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  getUserAttributeVerificationCode(params: CognitoIdentityServiceProvider.Types.GetUserAttributeVerificationCodeRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetUserAttributeVerificationCodeResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetUserAttributeVerificationCodeResponse, AWSError>;
  /**
   * Generates a user attribute verification code for the specified attribute name. Sends a message to a user with a code that they must return in a VerifyUserAttribute request.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs.   This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  getUserAttributeVerificationCode(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetUserAttributeVerificationCodeResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetUserAttributeVerificationCodeResponse, AWSError>;
  /**
   * Gets the user pool multi-factor authentication (MFA) configuration.
   */
  getUserPoolMfaConfig(params: CognitoIdentityServiceProvider.Types.GetUserPoolMfaConfigRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetUserPoolMfaConfigResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetUserPoolMfaConfigResponse, AWSError>;
  /**
   * Gets the user pool multi-factor authentication (MFA) configuration.
   */
  getUserPoolMfaConfig(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetUserPoolMfaConfigResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetUserPoolMfaConfigResponse, AWSError>;
  /**
   * Signs out a user from all devices. GlobalSignOut invalidates all identity, access and refresh tokens that Amazon Cognito has issued to a user. A user can still use a hosted UI cookie to retrieve new tokens for the duration of the 1-hour cookie validity period. Your app isn't aware that a user's access token is revoked unless it attempts to authorize a user pools API request with an access token that contains the scope aws.cognito.signin.user.admin. Your app might otherwise accept access tokens until they expire.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  globalSignOut(params: CognitoIdentityServiceProvider.Types.GlobalSignOutRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GlobalSignOutResponse) => void): Request<CognitoIdentityServiceProvider.Types.GlobalSignOutResponse, AWSError>;
  /**
   * Signs out a user from all devices. GlobalSignOut invalidates all identity, access and refresh tokens that Amazon Cognito has issued to a user. A user can still use a hosted UI cookie to retrieve new tokens for the duration of the 1-hour cookie validity period. Your app isn't aware that a user's access token is revoked unless it attempts to authorize a user pools API request with an access token that contains the scope aws.cognito.signin.user.admin. Your app might otherwise accept access tokens until they expire.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  globalSignOut(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GlobalSignOutResponse) => void): Request<CognitoIdentityServiceProvider.Types.GlobalSignOutResponse, AWSError>;
  /**
   * Initiates sign-in for a user in the Amazon Cognito user directory. You can't sign in a user with a federated IdP with InitiateAuth. For more information, see  Adding user pool sign-in through a third party.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs.   This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  initiateAuth(params: CognitoIdentityServiceProvider.Types.InitiateAuthRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.InitiateAuthResponse) => void): Request<CognitoIdentityServiceProvider.Types.InitiateAuthResponse, AWSError>;
  /**
   * Initiates sign-in for a user in the Amazon Cognito user directory. You can't sign in a user with a federated IdP with InitiateAuth. For more information, see  Adding user pool sign-in through a third party.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs.   This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  initiateAuth(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.InitiateAuthResponse) => void): Request<CognitoIdentityServiceProvider.Types.InitiateAuthResponse, AWSError>;
  /**
   * Lists the sign-in devices that Amazon Cognito has registered to the current user.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  listDevices(params: CognitoIdentityServiceProvider.Types.ListDevicesRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListDevicesResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListDevicesResponse, AWSError>;
  /**
   * Lists the sign-in devices that Amazon Cognito has registered to the current user.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  listDevices(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListDevicesResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListDevicesResponse, AWSError>;
  /**
   * Lists the groups associated with a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listGroups(params: CognitoIdentityServiceProvider.Types.ListGroupsRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListGroupsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListGroupsResponse, AWSError>;
  /**
   * Lists the groups associated with a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listGroups(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListGroupsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListGroupsResponse, AWSError>;
  /**
   * Lists information about all IdPs for a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listIdentityProviders(params: CognitoIdentityServiceProvider.Types.ListIdentityProvidersRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListIdentityProvidersResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListIdentityProvidersResponse, AWSError>;
  /**
   * Lists information about all IdPs for a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listIdentityProviders(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListIdentityProvidersResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListIdentityProvidersResponse, AWSError>;
  /**
   * Lists the resource servers for a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listResourceServers(params: CognitoIdentityServiceProvider.Types.ListResourceServersRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListResourceServersResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListResourceServersResponse, AWSError>;
  /**
   * Lists the resource servers for a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listResourceServers(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListResourceServersResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListResourceServersResponse, AWSError>;
  /**
   * Lists the tags that are assigned to an Amazon Cognito user pool. A tag is a label that you can apply to user pools to categorize and manage them in different ways, such as by purpose, owner, environment, or other criteria. You can use this action up to 10 times per second, per account.
   */
  listTagsForResource(params: CognitoIdentityServiceProvider.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListTagsForResourceResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags that are assigned to an Amazon Cognito user pool. A tag is a label that you can apply to user pools to categorize and manage them in different ways, such as by purpose, owner, environment, or other criteria. You can use this action up to 10 times per second, per account.
   */
  listTagsForResource(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListTagsForResourceResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists user import jobs for a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listUserImportJobs(params: CognitoIdentityServiceProvider.Types.ListUserImportJobsRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUserImportJobsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUserImportJobsResponse, AWSError>;
  /**
   * Lists user import jobs for a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listUserImportJobs(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUserImportJobsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUserImportJobsResponse, AWSError>;
  /**
   * Lists the clients that have been created for the specified user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listUserPoolClients(params: CognitoIdentityServiceProvider.Types.ListUserPoolClientsRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUserPoolClientsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUserPoolClientsResponse, AWSError>;
  /**
   * Lists the clients that have been created for the specified user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listUserPoolClients(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUserPoolClientsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUserPoolClientsResponse, AWSError>;
  /**
   * Lists the user pools associated with an Amazon Web Services account.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listUserPools(params: CognitoIdentityServiceProvider.Types.ListUserPoolsRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUserPoolsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUserPoolsResponse, AWSError>;
  /**
   * Lists the user pools associated with an Amazon Web Services account.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listUserPools(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUserPoolsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUserPoolsResponse, AWSError>;
  /**
   * Lists users and their basic details in a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listUsers(params: CognitoIdentityServiceProvider.Types.ListUsersRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUsersResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUsersResponse, AWSError>;
  /**
   * Lists users and their basic details in a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listUsers(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUsersResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUsersResponse, AWSError>;
  /**
   * Lists the users in the specified group.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listUsersInGroup(params: CognitoIdentityServiceProvider.Types.ListUsersInGroupRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUsersInGroupResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUsersInGroupResponse, AWSError>;
  /**
   * Lists the users in the specified group.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  listUsersInGroup(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUsersInGroupResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUsersInGroupResponse, AWSError>;
  /**
   * Resends the confirmation (for confirmation of registration) to a specific user in the user pool.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs.   This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  resendConfirmationCode(params: CognitoIdentityServiceProvider.Types.ResendConfirmationCodeRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ResendConfirmationCodeResponse) => void): Request<CognitoIdentityServiceProvider.Types.ResendConfirmationCodeResponse, AWSError>;
  /**
   * Resends the confirmation (for confirmation of registration) to a specific user in the user pool.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs.   This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  resendConfirmationCode(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ResendConfirmationCodeResponse) => void): Request<CognitoIdentityServiceProvider.Types.ResendConfirmationCodeResponse, AWSError>;
  /**
   * Responds to the authentication challenge.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs.   This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  respondToAuthChallenge(params: CognitoIdentityServiceProvider.Types.RespondToAuthChallengeRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.RespondToAuthChallengeResponse) => void): Request<CognitoIdentityServiceProvider.Types.RespondToAuthChallengeResponse, AWSError>;
  /**
   * Responds to the authentication challenge.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs.   This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  respondToAuthChallenge(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.RespondToAuthChallengeResponse) => void): Request<CognitoIdentityServiceProvider.Types.RespondToAuthChallengeResponse, AWSError>;
  /**
   * Revokes all of the access tokens generated by, and at the same time as, the specified refresh token. After a token is revoked, you can't use the revoked token to access Amazon Cognito user APIs, or to authorize access to your resource server.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  revokeToken(params: CognitoIdentityServiceProvider.Types.RevokeTokenRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.RevokeTokenResponse) => void): Request<CognitoIdentityServiceProvider.Types.RevokeTokenResponse, AWSError>;
  /**
   * Revokes all of the access tokens generated by, and at the same time as, the specified refresh token. After a token is revoked, you can't use the revoked token to access Amazon Cognito user APIs, or to authorize access to your resource server.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  revokeToken(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.RevokeTokenResponse) => void): Request<CognitoIdentityServiceProvider.Types.RevokeTokenResponse, AWSError>;
  /**
   * Sets up or modifies the detailed activity logging configuration of a user pool.
   */
  setLogDeliveryConfiguration(params: CognitoIdentityServiceProvider.Types.SetLogDeliveryConfigurationRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetLogDeliveryConfigurationResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetLogDeliveryConfigurationResponse, AWSError>;
  /**
   * Sets up or modifies the detailed activity logging configuration of a user pool.
   */
  setLogDeliveryConfiguration(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetLogDeliveryConfigurationResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetLogDeliveryConfigurationResponse, AWSError>;
  /**
   * Configures actions on detected risks. To delete the risk configuration for UserPoolId or ClientId, pass null values for all four configuration types. To activate Amazon Cognito advanced security features, update the user pool to include the UserPoolAddOns keyAdvancedSecurityMode.
   */
  setRiskConfiguration(params: CognitoIdentityServiceProvider.Types.SetRiskConfigurationRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetRiskConfigurationResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetRiskConfigurationResponse, AWSError>;
  /**
   * Configures actions on detected risks. To delete the risk configuration for UserPoolId or ClientId, pass null values for all four configuration types. To activate Amazon Cognito advanced security features, update the user pool to include the UserPoolAddOns keyAdvancedSecurityMode.
   */
  setRiskConfiguration(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetRiskConfigurationResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetRiskConfigurationResponse, AWSError>;
  /**
   * Sets the user interface (UI) customization information for a user pool's built-in app UI. You can specify app UI customization settings for a single client (with a specific clientId) or for all clients (by setting the clientId to ALL). If you specify ALL, the default configuration is used for every client that has no previously set UI customization. If you specify UI customization settings for a particular client, it will no longer return to the ALL configuration.  To use this API, your user pool must have a domain associated with it. Otherwise, there is no place to host the app's pages, and the service will throw an error. 
   */
  setUICustomization(params: CognitoIdentityServiceProvider.Types.SetUICustomizationRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUICustomizationResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUICustomizationResponse, AWSError>;
  /**
   * Sets the user interface (UI) customization information for a user pool's built-in app UI. You can specify app UI customization settings for a single client (with a specific clientId) or for all clients (by setting the clientId to ALL). If you specify ALL, the default configuration is used for every client that has no previously set UI customization. If you specify UI customization settings for a particular client, it will no longer return to the ALL configuration.  To use this API, your user pool must have a domain associated with it. Otherwise, there is no place to host the app's pages, and the service will throw an error. 
   */
  setUICustomization(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUICustomizationResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUICustomizationResponse, AWSError>;
  /**
   * Set the user's multi-factor authentication (MFA) method preference, including which MFA factors are activated and if any are preferred. Only one factor can be set as preferred. The preferred MFA factor will be used to authenticate a user if multiple factors are activated. If multiple options are activated and no preference is set, a challenge to choose an MFA option will be returned during sign-in. If an MFA type is activated for a user, the user will be prompted for MFA during all sign-in attempts unless device tracking is turned on and the device has been trusted. If you want MFA to be applied selectively based on the assessed risk level of sign-in attempts, deactivate MFA for users and turn on Adaptive Authentication for the user pool.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  setUserMFAPreference(params: CognitoIdentityServiceProvider.Types.SetUserMFAPreferenceRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUserMFAPreferenceResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUserMFAPreferenceResponse, AWSError>;
  /**
   * Set the user's multi-factor authentication (MFA) method preference, including which MFA factors are activated and if any are preferred. Only one factor can be set as preferred. The preferred MFA factor will be used to authenticate a user if multiple factors are activated. If multiple options are activated and no preference is set, a challenge to choose an MFA option will be returned during sign-in. If an MFA type is activated for a user, the user will be prompted for MFA during all sign-in attempts unless device tracking is turned on and the device has been trusted. If you want MFA to be applied selectively based on the assessed risk level of sign-in attempts, deactivate MFA for users and turn on Adaptive Authentication for the user pool.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  setUserMFAPreference(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUserMFAPreferenceResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUserMFAPreferenceResponse, AWSError>;
  /**
   * Sets the user pool multi-factor authentication (MFA) configuration.  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  setUserPoolMfaConfig(params: CognitoIdentityServiceProvider.Types.SetUserPoolMfaConfigRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUserPoolMfaConfigResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUserPoolMfaConfigResponse, AWSError>;
  /**
   * Sets the user pool multi-factor authentication (MFA) configuration.  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  setUserPoolMfaConfig(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUserPoolMfaConfigResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUserPoolMfaConfigResponse, AWSError>;
  /**
   *  This action is no longer supported. You can use it to configure only SMS MFA. You can't use it to configure time-based one-time password (TOTP) software token MFA. To configure either type of MFA, use SetUserMFAPreference instead.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  setUserSettings(params: CognitoIdentityServiceProvider.Types.SetUserSettingsRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUserSettingsResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUserSettingsResponse, AWSError>;
  /**
   *  This action is no longer supported. You can use it to configure only SMS MFA. You can't use it to configure time-based one-time password (TOTP) software token MFA. To configure either type of MFA, use SetUserMFAPreference instead.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  setUserSettings(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUserSettingsResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUserSettingsResponse, AWSError>;
  /**
   * Registers the user in the specified user pool and creates a user name, password, and user attributes.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs.   This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  signUp(params: CognitoIdentityServiceProvider.Types.SignUpRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SignUpResponse) => void): Request<CognitoIdentityServiceProvider.Types.SignUpResponse, AWSError>;
  /**
   * Registers the user in the specified user pool and creates a user name, password, and user attributes.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs.   This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  signUp(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SignUpResponse) => void): Request<CognitoIdentityServiceProvider.Types.SignUpResponse, AWSError>;
  /**
   * Starts the user import.
   */
  startUserImportJob(params: CognitoIdentityServiceProvider.Types.StartUserImportJobRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.StartUserImportJobResponse) => void): Request<CognitoIdentityServiceProvider.Types.StartUserImportJobResponse, AWSError>;
  /**
   * Starts the user import.
   */
  startUserImportJob(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.StartUserImportJobResponse) => void): Request<CognitoIdentityServiceProvider.Types.StartUserImportJobResponse, AWSError>;
  /**
   * Stops the user import job.
   */
  stopUserImportJob(params: CognitoIdentityServiceProvider.Types.StopUserImportJobRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.StopUserImportJobResponse) => void): Request<CognitoIdentityServiceProvider.Types.StopUserImportJobResponse, AWSError>;
  /**
   * Stops the user import job.
   */
  stopUserImportJob(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.StopUserImportJobResponse) => void): Request<CognitoIdentityServiceProvider.Types.StopUserImportJobResponse, AWSError>;
  /**
   * Assigns a set of tags to an Amazon Cognito user pool. A tag is a label that you can use to categorize and manage user pools in different ways, such as by purpose, owner, environment, or other criteria. Each tag consists of a key and value, both of which you define. A key is a general category for more specific values. For example, if you have two versions of a user pool, one for testing and another for production, you might assign an Environment tag key to both user pools. The value of this key might be Test for one user pool, and Production for the other. Tags are useful for cost tracking and access control. You can activate your tags so that they appear on the Billing and Cost Management console, where you can track the costs associated with your user pools. In an Identity and Access Management policy, you can constrain permissions for user pools based on specific tags or tag values. You can use this action up to 5 times per second, per account. A user pool can have as many as 50 tags.
   */
  tagResource(params: CognitoIdentityServiceProvider.Types.TagResourceRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.TagResourceResponse) => void): Request<CognitoIdentityServiceProvider.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns a set of tags to an Amazon Cognito user pool. A tag is a label that you can use to categorize and manage user pools in different ways, such as by purpose, owner, environment, or other criteria. Each tag consists of a key and value, both of which you define. A key is a general category for more specific values. For example, if you have two versions of a user pool, one for testing and another for production, you might assign an Environment tag key to both user pools. The value of this key might be Test for one user pool, and Production for the other. Tags are useful for cost tracking and access control. You can activate your tags so that they appear on the Billing and Cost Management console, where you can track the costs associated with your user pools. In an Identity and Access Management policy, you can constrain permissions for user pools based on specific tags or tag values. You can use this action up to 5 times per second, per account. A user pool can have as many as 50 tags.
   */
  tagResource(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.TagResourceResponse) => void): Request<CognitoIdentityServiceProvider.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from an Amazon Cognito user pool. You can use this action up to 5 times per second, per account.
   */
  untagResource(params: CognitoIdentityServiceProvider.Types.UntagResourceRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UntagResourceResponse) => void): Request<CognitoIdentityServiceProvider.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from an Amazon Cognito user pool. You can use this action up to 5 times per second, per account.
   */
  untagResource(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UntagResourceResponse) => void): Request<CognitoIdentityServiceProvider.Types.UntagResourceResponse, AWSError>;
  /**
   * Provides the feedback for an authentication event, whether it was from a valid user or not. This feedback is used for improving the risk evaluation decision for the user pool as part of Amazon Cognito advanced security.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  updateAuthEventFeedback(params: CognitoIdentityServiceProvider.Types.UpdateAuthEventFeedbackRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateAuthEventFeedbackResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateAuthEventFeedbackResponse, AWSError>;
  /**
   * Provides the feedback for an authentication event, whether it was from a valid user or not. This feedback is used for improving the risk evaluation decision for the user pool as part of Amazon Cognito advanced security.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  updateAuthEventFeedback(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateAuthEventFeedbackResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateAuthEventFeedbackResponse, AWSError>;
  /**
   * Updates the device status.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  updateDeviceStatus(params: CognitoIdentityServiceProvider.Types.UpdateDeviceStatusRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateDeviceStatusResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateDeviceStatusResponse, AWSError>;
  /**
   * Updates the device status.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  updateDeviceStatus(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateDeviceStatusResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateDeviceStatusResponse, AWSError>;
  /**
   * Updates the specified group with the specified attributes.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  updateGroup(params: CognitoIdentityServiceProvider.Types.UpdateGroupRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateGroupResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateGroupResponse, AWSError>;
  /**
   * Updates the specified group with the specified attributes.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  updateGroup(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateGroupResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateGroupResponse, AWSError>;
  /**
   * Updates IdP information for a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  updateIdentityProvider(params: CognitoIdentityServiceProvider.Types.UpdateIdentityProviderRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateIdentityProviderResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateIdentityProviderResponse, AWSError>;
  /**
   * Updates IdP information for a user pool.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  updateIdentityProvider(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateIdentityProviderResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateIdentityProviderResponse, AWSError>;
  /**
   * Updates the name and scopes of resource server. All other fields are read-only.  If you don't provide a value for an attribute, it is set to the default value.   Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  updateResourceServer(params: CognitoIdentityServiceProvider.Types.UpdateResourceServerRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateResourceServerResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateResourceServerResponse, AWSError>;
  /**
   * Updates the name and scopes of resource server. All other fields are read-only.  If you don't provide a value for an attribute, it is set to the default value.   Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  updateResourceServer(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateResourceServerResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateResourceServerResponse, AWSError>;
  /**
   * Allows a user to update a specific attribute (one at a time).  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs.   This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  updateUserAttributes(params: CognitoIdentityServiceProvider.Types.UpdateUserAttributesRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserAttributesResponse, AWSError>;
  /**
   * Allows a user to update a specific attribute (one at a time).  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs.   This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide. 
   */
  updateUserAttributes(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserAttributesResponse, AWSError>;
  /**
   *  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide.  Updates the specified user pool with the specified attributes. You can get a list of the current user pool settings using DescribeUserPool.  If you don't provide a value for an attribute, Amazon Cognito sets it to its default value.   Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  updateUserPool(params: CognitoIdentityServiceProvider.Types.UpdateUserPoolRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserPoolResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserPoolResponse, AWSError>;
  /**
   *  This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers require you to register an origination phone number before you can send SMS messages to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must receive SMS messages might not be able to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon Simple Notification Service might place your account in the SMS sandbox. In  sandbox mode , you can send messages only to verified phone numbers. After you test your app while in the sandbox environment, you can move out of the sandbox and into production. For more information, see  SMS message settings for Amazon Cognito user pools in the Amazon Cognito Developer Guide.  Updates the specified user pool with the specified attributes. You can get a list of the current user pool settings using DescribeUserPool.  If you don't provide a value for an attribute, Amazon Cognito sets it to its default value.   Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  updateUserPool(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserPoolResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserPoolResponse, AWSError>;
  /**
   * Updates the specified user pool app client with the specified attributes. You can get a list of the current user pool app client settings using DescribeUserPoolClient.  If you don't provide a value for an attribute, Amazon Cognito sets it to its default value.  You can also use this operation to enable token revocation for user pool clients. For more information about revoking tokens, see RevokeToken.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  updateUserPoolClient(params: CognitoIdentityServiceProvider.Types.UpdateUserPoolClientRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserPoolClientResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserPoolClientResponse, AWSError>;
  /**
   * Updates the specified user pool app client with the specified attributes. You can get a list of the current user pool app client settings using DescribeUserPoolClient.  If you don't provide a value for an attribute, Amazon Cognito sets it to its default value.  You can also use this operation to enable token revocation for user pool clients. For more information about revoking tokens, see RevokeToken.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  updateUserPoolClient(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserPoolClientResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserPoolClientResponse, AWSError>;
  /**
   * Updates the Secure Sockets Layer (SSL) certificate for the custom domain for your user pool. You can use this operation to provide the Amazon Resource Name (ARN) of a new certificate to Amazon Cognito. You can't use it to change the domain for a user pool. A custom domain is used to host the Amazon Cognito hosted UI, which provides sign-up and sign-in pages for your application. When you set up a custom domain, you provide a certificate that you manage with Certificate Manager (ACM). When necessary, you can use this operation to change the certificate that you applied to your custom domain. Usually, this is unnecessary following routine certificate renewal with ACM. When you renew your existing certificate in ACM, the ARN for your certificate remains the same, and your custom domain uses the new certificate automatically. However, if you replace your existing certificate with a new one, ACM gives the new certificate a new ARN. To apply the new certificate to your custom domain, you must provide this ARN to Amazon Cognito. When you add your new certificate in ACM, you must choose US East (N. Virginia) as the Amazon Web Services Region. After you submit your request, Amazon Cognito requires up to 1 hour to distribute your new certificate to your custom domain. For more information about adding a custom domain to your user pool, see Using Your Own Domain for the Hosted UI.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  updateUserPoolDomain(params: CognitoIdentityServiceProvider.Types.UpdateUserPoolDomainRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserPoolDomainResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserPoolDomainResponse, AWSError>;
  /**
   * Updates the Secure Sockets Layer (SSL) certificate for the custom domain for your user pool. You can use this operation to provide the Amazon Resource Name (ARN) of a new certificate to Amazon Cognito. You can't use it to change the domain for a user pool. A custom domain is used to host the Amazon Cognito hosted UI, which provides sign-up and sign-in pages for your application. When you set up a custom domain, you provide a certificate that you manage with Certificate Manager (ACM). When necessary, you can use this operation to change the certificate that you applied to your custom domain. Usually, this is unnecessary following routine certificate renewal with ACM. When you renew your existing certificate in ACM, the ARN for your certificate remains the same, and your custom domain uses the new certificate automatically. However, if you replace your existing certificate with a new one, ACM gives the new certificate a new ARN. To apply the new certificate to your custom domain, you must provide this ARN to Amazon Cognito. When you add your new certificate in ACM, you must choose US East (N. Virginia) as the Amazon Web Services Region. After you submit your request, Amazon Cognito requires up to 1 hour to distribute your new certificate to your custom domain. For more information about adding a custom domain to your user pool, see Using Your Own Domain for the Hosted UI.  Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you must use IAM credentials to authorize requests, and you must grant yourself the corresponding IAM permission in a policy.  Learn more     Signing Amazon Web Services API Requests     Using the Amazon Cognito user pools API and user pool endpoints    
   */
  updateUserPoolDomain(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserPoolDomainResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserPoolDomainResponse, AWSError>;
  /**
   * Use this API to register a user's entered time-based one-time password (TOTP) code and mark the user's software token MFA status as "verified" if successful. The request takes an access token or a session string, but not both.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  verifySoftwareToken(params: CognitoIdentityServiceProvider.Types.VerifySoftwareTokenRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.VerifySoftwareTokenResponse) => void): Request<CognitoIdentityServiceProvider.Types.VerifySoftwareTokenResponse, AWSError>;
  /**
   * Use this API to register a user's entered time-based one-time password (TOTP) code and mark the user's software token MFA status as "verified" if successful. The request takes an access token or a session string, but not both.  Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  verifySoftwareToken(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.VerifySoftwareTokenResponse) => void): Request<CognitoIdentityServiceProvider.Types.VerifySoftwareTokenResponse, AWSError>;
  /**
   * Verifies the specified user attributes in the user pool.  If your user pool requires verification before Amazon Cognito updates the attribute value, VerifyUserAttribute updates the affected attribute to its pending value. For more information, see  UserAttributeUpdateSettingsType.   Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  verifyUserAttribute(params: CognitoIdentityServiceProvider.Types.VerifyUserAttributeRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.VerifyUserAttributeResponse) => void): Request<CognitoIdentityServiceProvider.Types.VerifyUserAttributeResponse, AWSError>;
  /**
   * Verifies the specified user attributes in the user pool.  If your user pool requires verification before Amazon Cognito updates the attribute value, VerifyUserAttribute updates the affected attribute to its pending value. For more information, see  UserAttributeUpdateSettingsType.   Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For this operation, you can't use IAM credentials to authorize requests, and you can't grant IAM permissions in policies. For more information about authorization models in Amazon Cognito, see Using the Amazon Cognito native and OIDC APIs. 
   */
  verifyUserAttribute(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.VerifyUserAttributeResponse) => void): Request<CognitoIdentityServiceProvider.Types.VerifyUserAttributeResponse, AWSError>;
}
declare namespace CognitoIdentityServiceProvider {
  export type AWSAccountIdType = string;
  export type AccessTokenValidityType = number;
  export interface AccountRecoverySettingType {
    /**
     * The list of RecoveryOptionTypes.
     */
    RecoveryMechanisms?: RecoveryMechanismsType;
  }
  export type AccountTakeoverActionNotifyType = boolean;
  export interface AccountTakeoverActionType {
    /**
     * Flag specifying whether to send a notification.
     */
    Notify: AccountTakeoverActionNotifyType;
    /**
     * The action to take in response to the account takeover action. Valid values are as follows:    BLOCK Choosing this action will block the request.    MFA_IF_CONFIGURED Present an MFA challenge if user has configured it, else allow the request.    MFA_REQUIRED Present an MFA challenge if user has configured it, else block the request.    NO_ACTION Allow the user to sign in.  
     */
    EventAction: AccountTakeoverEventActionType;
  }
  export interface AccountTakeoverActionsType {
    /**
     * Action to take for a low risk.
     */
    LowAction?: AccountTakeoverActionType;
    /**
     * Action to take for a medium risk.
     */
    MediumAction?: AccountTakeoverActionType;
    /**
     * Action to take for a high risk.
     */
    HighAction?: AccountTakeoverActionType;
  }
  export type AccountTakeoverEventActionType = "BLOCK"|"MFA_IF_CONFIGURED"|"MFA_REQUIRED"|"NO_ACTION"|string;
  export interface AccountTakeoverRiskConfigurationType {
    /**
     * The notify configuration used to construct email notifications.
     */
    NotifyConfiguration?: NotifyConfigurationType;
    /**
     * Account takeover risk configuration actions.
     */
    Actions: AccountTakeoverActionsType;
  }
  export interface AddCustomAttributesRequest {
    /**
     * The user pool ID for the user pool where you want to add custom attributes.
     */
    UserPoolId: UserPoolIdType;
    /**
     * An array of custom attributes, such as Mutable and Name.
     */
    CustomAttributes: CustomAttributesListType;
  }
  export interface AddCustomAttributesResponse {
  }
  export interface AdminAddUserToGroupRequest {
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The username for the user.
     */
    Username: UsernameType;
    /**
     * The group name.
     */
    GroupName: GroupNameType;
  }
  export interface AdminConfirmSignUpRequest {
    /**
     * The user pool ID for which you want to confirm user registration.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name for which you want to confirm user registration.
     */
    Username: UsernameType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers. If your user pool configuration includes triggers, the AdminConfirmSignUp API action invokes the Lambda function that is specified for the post confirmation trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. In this payload, the clientMetadata attribute provides the data that you assigned to the ClientMetadata parameter in your AdminConfirmSignUp request. In your function code in Lambda, you can process the ClientMetadata value to enhance your workflow for your specific needs. For more information, see  Customizing user pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  When you use the ClientMetadata parameter, remember that Amazon Cognito won't do the following:   Store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration doesn't include triggers, the ClientMetadata parameter serves no purpose.   Validate the ClientMetadata value.   Encrypt the ClientMetadata value. Don't use Amazon Cognito to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface AdminConfirmSignUpResponse {
  }
  export interface AdminCreateUserConfigType {
    /**
     * Set to True if only the administrator is allowed to create user profiles. Set to False if users can sign themselves up via an app.
     */
    AllowAdminCreateUserOnly?: BooleanType;
    /**
     * The user account expiration limit, in days, after which a new account that hasn't signed in is no longer usable. To reset the account after that time limit, you must call AdminCreateUser again, specifying "RESEND" for the MessageAction parameter. The default value for this parameter is 7.   If you set a value for TemporaryPasswordValidityDays in PasswordPolicy, that value will be used, and UnusedAccountValidityDays will be no longer be an available parameter for that user pool. 
     */
    UnusedAccountValidityDays?: AdminCreateUserUnusedAccountValidityDaysType;
    /**
     * The message template to be used for the welcome message to new users. See also Customizing User Invitation Messages.
     */
    InviteMessageTemplate?: MessageTemplateType;
  }
  export interface AdminCreateUserRequest {
    /**
     * The user pool ID for the user pool where the user will be created.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The value that you want to set as the username sign-in attribute. The following conditions apply to the username parameter.   The username can't be a duplicate of another username in the same user pool.   You can't change the value of a username after you create it.   You can only provide a value if usernames are a valid sign-in attribute for your user pool. If your user pool only supports phone numbers or email addresses as sign-in attributes, Amazon Cognito automatically generates a username value. For more information, see Customizing sign-in attributes.  
     */
    Username: UsernameType;
    /**
     * An array of name-value pairs that contain user attributes and attribute values to be set for the user to be created. You can create a user without specifying any attributes other than Username. However, any attributes that you specify as required (when creating a user pool or in the Attributes tab of the console) either you should supply (in your call to AdminCreateUser) or the user should supply (when they sign up in response to your welcome message). For custom attributes, you must prepend the custom: prefix to the attribute name. To send a message inviting the user to sign up, you must specify the user's email address or phone number. You can do this in your call to AdminCreateUser or in the Users tab of the Amazon Cognito console for managing your user pools. In your call to AdminCreateUser, you can set the email_verified attribute to True, and you can set the phone_number_verified attribute to True. You can also do this by calling AdminUpdateUserAttributes.    email: The email address of the user to whom the message that contains the code and username will be sent. Required if the email_verified attribute is set to True, or if "EMAIL" is specified in the DesiredDeliveryMediums parameter.    phone_number: The phone number of the user to whom the message that contains the code and username will be sent. Required if the phone_number_verified attribute is set to True, or if "SMS" is specified in the DesiredDeliveryMediums parameter.  
     */
    UserAttributes?: AttributeListType;
    /**
     * The user's validation data. This is an array of name-value pairs that contain user attributes and attribute values that you can use for custom validation, such as restricting the types of user accounts that can be registered. For example, you might choose to allow or disallow user sign-up based on the user's domain. To configure custom validation, you must create a Pre Sign-up Lambda trigger for the user pool as described in the Amazon Cognito Developer Guide. The Lambda trigger receives the validation data and uses it in the validation process. The user's validation data isn't persisted.
     */
    ValidationData?: AttributeListType;
    /**
     * The user's temporary password. This password must conform to the password policy that you specified when you created the user pool. The temporary password is valid only once. To complete the Admin Create User flow, the user must enter the temporary password in the sign-in page, along with a new password to be used in all future sign-ins. This parameter isn't required. If you don't specify a value, Amazon Cognito generates one for you. The temporary password can only be used until the user account expiration limit that you set for your user pool. To reset the account after that time limit, you must call AdminCreateUser again and specify RESEND for the MessageAction parameter.
     */
    TemporaryPassword?: PasswordType;
    /**
     * This parameter is used only if the phone_number_verified or email_verified attribute is set to True. Otherwise, it is ignored. If this parameter is set to True and the phone number or email address specified in the UserAttributes parameter already exists as an alias with a different user, the API call will migrate the alias from the previous user to the newly created user. The previous user will no longer be able to log in using that alias. If this parameter is set to False, the API throws an AliasExistsException error if the alias already exists. The default value is False.
     */
    ForceAliasCreation?: ForceAliasCreation;
    /**
     * Set to RESEND to resend the invitation message to a user that already exists and reset the expiration limit on the user's account. Set to SUPPRESS to suppress sending the message. You can specify only one value.
     */
    MessageAction?: MessageActionType;
    /**
     * Specify "EMAIL" if email will be used to send the welcome message. Specify "SMS" if the phone number will be used. The default value is "SMS". You can specify more than one value.
     */
    DesiredDeliveryMediums?: DeliveryMediumListType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers. You create custom workflows by assigning Lambda functions to user pool triggers. When you use the AdminCreateUser API action, Amazon Cognito invokes the function that is assigned to the pre sign-up trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your AdminCreateUser request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see  Customizing user pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  When you use the ClientMetadata parameter, remember that Amazon Cognito won't do the following:   Store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration doesn't include triggers, the ClientMetadata parameter serves no purpose.   Validate the ClientMetadata value.   Encrypt the ClientMetadata value. Don't use Amazon Cognito to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface AdminCreateUserResponse {
    /**
     * The newly created user.
     */
    User?: UserType;
  }
  export type AdminCreateUserUnusedAccountValidityDaysType = number;
  export interface AdminDeleteUserAttributesRequest {
    /**
     * The user pool ID for the user pool where you want to delete user attributes.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name of the user from which you would like to delete attributes.
     */
    Username: UsernameType;
    /**
     * An array of strings representing the user attribute names you want to delete. For custom attributes, you must prepend the custom: prefix to the attribute name.
     */
    UserAttributeNames: AttributeNameListType;
  }
  export interface AdminDeleteUserAttributesResponse {
  }
  export interface AdminDeleteUserRequest {
    /**
     * The user pool ID for the user pool where you want to delete the user.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name of the user you want to delete.
     */
    Username: UsernameType;
  }
  export interface AdminDisableProviderForUserRequest {
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: StringType;
    /**
     * The user to be disabled.
     */
    User: ProviderUserIdentifierType;
  }
  export interface AdminDisableProviderForUserResponse {
  }
  export interface AdminDisableUserRequest {
    /**
     * The user pool ID for the user pool where you want to disable the user.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name of the user you want to disable.
     */
    Username: UsernameType;
  }
  export interface AdminDisableUserResponse {
  }
  export interface AdminEnableUserRequest {
    /**
     * The user pool ID for the user pool where you want to enable the user.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name of the user you want to enable.
     */
    Username: UsernameType;
  }
  export interface AdminEnableUserResponse {
  }
  export interface AdminForgetDeviceRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name.
     */
    Username: UsernameType;
    /**
     * The device key.
     */
    DeviceKey: DeviceKeyType;
  }
  export interface AdminGetDeviceRequest {
    /**
     * The device key.
     */
    DeviceKey: DeviceKeyType;
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name.
     */
    Username: UsernameType;
  }
  export interface AdminGetDeviceResponse {
    /**
     * The device.
     */
    Device: DeviceType;
  }
  export interface AdminGetUserRequest {
    /**
     * The user pool ID for the user pool where you want to get information about the user.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name of the user you want to retrieve.
     */
    Username: UsernameType;
  }
  export interface AdminGetUserResponse {
    /**
     * The username of the user that you requested.
     */
    Username: UsernameType;
    /**
     * An array of name-value pairs representing user attributes.
     */
    UserAttributes?: AttributeListType;
    /**
     * The date the user was created.
     */
    UserCreateDate?: DateType;
    /**
     * The date and time, in ISO 8601 format, when the item was modified.
     */
    UserLastModifiedDate?: DateType;
    /**
     * Indicates that the status is enabled.
     */
    Enabled?: BooleanType;
    /**
     * The user status. Can be one of the following:   UNCONFIRMED - User has been created but not confirmed.   CONFIRMED - User has been confirmed.   UNKNOWN - User status isn't known.   RESET_REQUIRED - User is confirmed, but the user must request a code and reset their password before they can sign in.   FORCE_CHANGE_PASSWORD - The user is confirmed and the user can sign in using a temporary password, but on first sign-in, the user must change their password to a new value before doing anything else.   
     */
    UserStatus?: UserStatusType;
    /**
     *  This response parameter is no longer supported. It provides information only about SMS MFA configurations. It doesn't provide information about time-based one-time password (TOTP) software token MFA configurations. To look up information about either type of MFA configuration, use UserMFASettingList instead.
     */
    MFAOptions?: MFAOptionListType;
    /**
     * The user's preferred MFA setting.
     */
    PreferredMfaSetting?: StringType;
    /**
     * The MFA options that are activated for the user. The possible values in this list are SMS_MFA and SOFTWARE_TOKEN_MFA.
     */
    UserMFASettingList?: UserMFASettingListType;
  }
  export interface AdminInitiateAuthRequest {
    /**
     * The ID of the Amazon Cognito user pool.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The app client ID.
     */
    ClientId: ClientIdType;
    /**
     * The authentication flow for this call to run. The API action will depend on this value. For example:    REFRESH_TOKEN_AUTH will take in a valid refresh token and return new tokens.    USER_SRP_AUTH will take in USERNAME and SRP_A and return the Secure Remote Password (SRP) protocol variables to be used for next challenge execution.    ADMIN_USER_PASSWORD_AUTH will take in USERNAME and PASSWORD and return the next challenge or tokens.   Valid values include:    USER_SRP_AUTH: Authentication flow for the Secure Remote Password (SRP) protocol.    REFRESH_TOKEN_AUTH/REFRESH_TOKEN: Authentication flow for refreshing the access token and ID token by supplying a valid refresh token.    CUSTOM_AUTH: Custom authentication flow.    ADMIN_NO_SRP_AUTH: Non-SRP authentication flow; you can pass in the USERNAME and PASSWORD directly if the flow is enabled for calling the app client.    ADMIN_USER_PASSWORD_AUTH: Admin-based user password authentication. This replaces the ADMIN_NO_SRP_AUTH authentication flow. In this flow, Amazon Cognito receives the password in the request instead of using the SRP process to verify passwords.  
     */
    AuthFlow: AuthFlowType;
    /**
     * The authentication parameters. These are inputs corresponding to the AuthFlow that you're invoking. The required values depend on the value of AuthFlow:   For USER_SRP_AUTH: USERNAME (required), SRP_A (required), SECRET_HASH (required if the app client is configured with a client secret), DEVICE_KEY.   For ADMIN_USER_PASSWORD_AUTH: USERNAME (required), PASSWORD (required), SECRET_HASH (required if the app client is configured with a client secret), DEVICE_KEY.   For REFRESH_TOKEN_AUTH/REFRESH_TOKEN: REFRESH_TOKEN (required), SECRET_HASH (required if the app client is configured with a client secret), DEVICE_KEY.   For CUSTOM_AUTH: USERNAME (required), SECRET_HASH (if app client is configured with client secret), DEVICE_KEY. To start the authentication flow with password verification, include ChallengeName: SRP_A and SRP_A: (The SRP_A Value).   For more information about SECRET_HASH, see Computing secret hash values. For information about DEVICE_KEY, see Working with user devices in your user pool.
     */
    AuthParameters?: AuthParametersType;
    /**
     * A map of custom key-value pairs that you can provide as input for certain custom workflows that this action triggers. You create custom workflows by assigning Lambda functions to user pool triggers. When you use the AdminInitiateAuth API action, Amazon Cognito invokes the Lambda functions that are specified for various triggers. The ClientMetadata value is passed as input to the functions for only the following triggers:   Pre signup   Pre authentication   User migration   When Amazon Cognito invokes the functions for these triggers, it passes a JSON payload, which the function receives as input. This payload contains a validationData attribute, which provides the data that you assigned to the ClientMetadata parameter in your AdminInitiateAuth request. In your function code in Lambda, you can process the validationData value to enhance your workflow for your specific needs. When you use the AdminInitiateAuth API action, Amazon Cognito also invokes the functions for the following triggers, but it doesn't provide the ClientMetadata value as input:   Post authentication   Custom message   Pre token generation   Create auth challenge   Define auth challenge   Verify auth challenge   For more information, see  Customizing user pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  When you use the ClientMetadata parameter, remember that Amazon Cognito won't do the following:   Store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration doesn't include triggers, the ClientMetadata parameter serves no purpose.   Validate the ClientMetadata value.   Encrypt the ClientMetadata value. Don't use Amazon Cognito to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
    /**
     * The analytics metadata for collecting Amazon Pinpoint metrics for AdminInitiateAuth calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * Contextual data about your user session, such as the device fingerprint, IP address, or location. Amazon Cognito advanced security evaluates the risk of an authentication event based on the context that your app generates and passes to Amazon Cognito when it makes API requests.
     */
    ContextData?: ContextDataType;
  }
  export interface AdminInitiateAuthResponse {
    /**
     * The name of the challenge that you're responding to with this call. This is returned in the AdminInitiateAuth response if you must pass another challenge.    MFA_SETUP: If MFA is required, users who don't have at least one of the MFA methods set up are presented with an MFA_SETUP challenge. The user must set up at least one MFA type to continue to authenticate.    SELECT_MFA_TYPE: Selects the MFA type. Valid MFA options are SMS_MFA for text SMS MFA, and SOFTWARE_TOKEN_MFA for time-based one-time password (TOTP) software token MFA.    SMS_MFA: Next challenge is to supply an SMS_MFA_CODE, delivered via SMS.    PASSWORD_VERIFIER: Next challenge is to supply PASSWORD_CLAIM_SIGNATURE, PASSWORD_CLAIM_SECRET_BLOCK, and TIMESTAMP after the client-side SRP calculations.    CUSTOM_CHALLENGE: This is returned if your custom authentication flow determines that the user should pass another challenge before tokens are issued.    DEVICE_SRP_AUTH: If device tracking was activated in your user pool and the previous challenges were passed, this challenge is returned so that Amazon Cognito can start tracking this device.    DEVICE_PASSWORD_VERIFIER: Similar to PASSWORD_VERIFIER, but for devices only.    ADMIN_NO_SRP_AUTH: This is returned if you must authenticate with USERNAME and PASSWORD directly. An app client must be enabled to use this flow.    NEW_PASSWORD_REQUIRED: For users who are required to change their passwords after successful first login. Respond to this challenge with NEW_PASSWORD and any required attributes that Amazon Cognito returned in the requiredAttributes parameter. You can also set values for attributes that aren't required by your user pool and that your app client can write. For more information, see AdminRespondToAuthChallenge.  In a NEW_PASSWORD_REQUIRED challenge response, you can't modify a required attribute that already has a value. In AdminRespondToAuthChallenge, set a value for any keys that Amazon Cognito returned in the requiredAttributes parameter, then use the AdminUpdateUserAttributes API operation to modify the value of any additional attributes.     MFA_SETUP: For users who are required to set up an MFA factor before they can sign in. The MFA types activated for the user pool will be listed in the challenge parameters MFA_CAN_SETUP value.   To set up software token MFA, use the session returned here from InitiateAuth as an input to AssociateSoftwareToken, and use the session returned by VerifySoftwareToken as an input to RespondToAuthChallenge with challenge name MFA_SETUP to complete sign-in. To set up SMS MFA, users will need help from an administrator to add a phone number to their account and then call InitiateAuth again to restart sign-in.  
     */
    ChallengeName?: ChallengeNameType;
    /**
     * The session that should be passed both ways in challenge-response calls to the service. If AdminInitiateAuth or AdminRespondToAuthChallenge API call determines that the caller must pass another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next AdminRespondToAuthChallenge API call.
     */
    Session?: SessionType;
    /**
     * The challenge parameters. These are returned to you in the AdminInitiateAuth response if you must pass another challenge. The responses in this parameter should be used to compute inputs to the next call (AdminRespondToAuthChallenge). All challenges require USERNAME and SECRET_HASH (if applicable). The value of the USER_ID_FOR_SRP attribute is the user's actual username, not an alias (such as email address or phone number), even if you specified an alias in your call to AdminInitiateAuth. This happens because, in the AdminRespondToAuthChallenge API ChallengeResponses, the USERNAME attribute can't be an alias.
     */
    ChallengeParameters?: ChallengeParametersType;
    /**
     * The result of the authentication response. This is only returned if the caller doesn't need to pass another challenge. If the caller does need to pass another challenge before it gets tokens, ChallengeName, ChallengeParameters, and Session are returned.
     */
    AuthenticationResult?: AuthenticationResultType;
  }
  export interface AdminLinkProviderForUserRequest {
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: StringType;
    /**
     * The existing user in the user pool that you want to assign to the external IdP user account. This user can be a local (Username + Password) Amazon Cognito user pools user or a federated user (for example, a SAML or Facebook user). If the user doesn't exist, Amazon Cognito generates an exception. Amazon Cognito returns this user when the new user (with the linked IdP attribute) signs in. For a native username + password user, the ProviderAttributeValue for the DestinationUser should be the username in the user pool. For a federated user, it should be the provider-specific user_id. The ProviderAttributeName of the DestinationUser is ignored. The ProviderName should be set to Cognito for users in Cognito user pools.  All attributes in the DestinationUser profile must be mutable. If you have assigned the user any immutable custom attributes, the operation won't succeed. 
     */
    DestinationUser: ProviderUserIdentifierType;
    /**
     * An external IdP account for a user who doesn't exist yet in the user pool. This user must be a federated user (for example, a SAML or Facebook user), not another native user. If the SourceUser is using a federated social IdP, such as Facebook, Google, or Login with Amazon, you must set the ProviderAttributeName to Cognito_Subject. For social IdPs, the ProviderName will be Facebook, Google, or LoginWithAmazon, and Amazon Cognito will automatically parse the Facebook, Google, and Login with Amazon tokens for id, sub, and user_id, respectively. The ProviderAttributeValue for the user must be the same value as the id, sub, or user_id value found in the social IdP token.  For OIDC, the ProviderAttributeName can be any value that matches a claim in the ID token, or that your app retrieves from the userInfo endpoint. You must map the claim to a user pool attribute in your IdP configuration, and set the user pool attribute name as the value of ProviderAttributeName in your AdminLinkProviderForUser request. For SAML, the ProviderAttributeName can be any value that matches a claim in the SAML assertion. To link SAML users based on the subject of the SAML assertion, map the subject to a claim through the SAML IdP and set that claim name as the value of ProviderAttributeName in your AdminLinkProviderForUser request. For both OIDC and SAML users, when you set ProviderAttributeName to Cognito_Subject, Amazon Cognito will automatically parse the default unique identifier found in the subject from the IdP token.
     */
    SourceUser: ProviderUserIdentifierType;
  }
  export interface AdminLinkProviderForUserResponse {
  }
  export interface AdminListDevicesRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name.
     */
    Username: UsernameType;
    /**
     * The limit of the devices request.
     */
    Limit?: QueryLimitType;
    /**
     * The pagination token.
     */
    PaginationToken?: SearchPaginationTokenType;
  }
  export interface AdminListDevicesResponse {
    /**
     * The devices in the list of devices response.
     */
    Devices?: DeviceListType;
    /**
     * The pagination token.
     */
    PaginationToken?: SearchPaginationTokenType;
  }
  export interface AdminListGroupsForUserRequest {
    /**
     * The username for the user.
     */
    Username: UsernameType;
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The limit of the request to list groups.
     */
    Limit?: QueryLimitType;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: PaginationKey;
  }
  export interface AdminListGroupsForUserResponse {
    /**
     * The groups that the user belongs to.
     */
    Groups?: GroupListType;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: PaginationKey;
  }
  export interface AdminListUserAuthEventsRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user pool username or an alias.
     */
    Username: UsernameType;
    /**
     * The maximum number of authentication events to return. Returns 60 events if you set MaxResults to 0, or if you don't include a MaxResults parameter.
     */
    MaxResults?: QueryLimitType;
    /**
     * A pagination token.
     */
    NextToken?: PaginationKey;
  }
  export interface AdminListUserAuthEventsResponse {
    /**
     * The response object. It includes the EventID, EventType, CreationDate, EventRisk, and EventResponse.
     */
    AuthEvents?: AuthEventsType;
    /**
     * A pagination token.
     */
    NextToken?: PaginationKey;
  }
  export interface AdminRemoveUserFromGroupRequest {
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The username for the user.
     */
    Username: UsernameType;
    /**
     * The group name.
     */
    GroupName: GroupNameType;
  }
  export interface AdminResetUserPasswordRequest {
    /**
     * The user pool ID for the user pool where you want to reset the user's password.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name of the user whose password you want to reset.
     */
    Username: UsernameType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers. You create custom workflows by assigning Lambda functions to user pool triggers. When you use the AdminResetUserPassword API action, Amazon Cognito invokes the function that is assigned to the custom message trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your AdminResetUserPassword request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs.  For more information, see  Customizing user pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  When you use the ClientMetadata parameter, remember that Amazon Cognito won't do the following:   Store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration doesn't include triggers, the ClientMetadata parameter serves no purpose.   Validate the ClientMetadata value.   Encrypt the ClientMetadata value. Don't use Amazon Cognito to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface AdminResetUserPasswordResponse {
  }
  export interface AdminRespondToAuthChallengeRequest {
    /**
     * The ID of the Amazon Cognito user pool.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The app client ID.
     */
    ClientId: ClientIdType;
    /**
     * The challenge name. For more information, see AdminInitiateAuth.
     */
    ChallengeName: ChallengeNameType;
    /**
     * The challenge responses. These are inputs corresponding to the value of ChallengeName, for example:    SMS_MFA: SMS_MFA_CODE, USERNAME, SECRET_HASH (if app client is configured with client secret).    PASSWORD_VERIFIER: PASSWORD_CLAIM_SIGNATURE, PASSWORD_CLAIM_SECRET_BLOCK, TIMESTAMP, USERNAME, SECRET_HASH (if app client is configured with client secret).   PASSWORD_VERIFIER requires DEVICE_KEY when signing in with a remembered device.     ADMIN_NO_SRP_AUTH: PASSWORD, USERNAME, SECRET_HASH (if app client is configured with client secret).     NEW_PASSWORD_REQUIRED: NEW_PASSWORD, USERNAME, SECRET_HASH (if app client is configured with client secret). To set any required attributes that Amazon Cognito returned as requiredAttributes in the AdminInitiateAuth response, add a userAttributes.attributename  parameter. This parameter can also set values for writable attributes that aren't required by your user pool.  In a NEW_PASSWORD_REQUIRED challenge response, you can't modify a required attribute that already has a value. In AdminRespondToAuthChallenge, set a value for any keys that Amazon Cognito returned in the requiredAttributes parameter, then use the AdminUpdateUserAttributes API operation to modify the value of any additional attributes.     MFA_SETUP requires USERNAME, plus you must use the session value returned by VerifySoftwareToken in the Session parameter.   The value of the USERNAME attribute must be the user's actual username, not an alias (such as an email address or phone number). To make this simpler, the AdminInitiateAuth response includes the actual username value in the USERNAMEUSER_ID_FOR_SRP attribute. This happens even if you specified an alias in your call to AdminInitiateAuth. For more information about SECRET_HASH, see Computing secret hash values. For information about DEVICE_KEY, see Working with user devices in your user pool.
     */
    ChallengeResponses?: ChallengeResponsesType;
    /**
     * The session that should be passed both ways in challenge-response calls to the service. If an InitiateAuth or RespondToAuthChallenge API call determines that the caller must pass another challenge, it returns a session with other challenge parameters. This session should be passed as it is to the next RespondToAuthChallenge API call.
     */
    Session?: SessionType;
    /**
     * The analytics metadata for collecting Amazon Pinpoint metrics for AdminRespondToAuthChallenge calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * Contextual data about your user session, such as the device fingerprint, IP address, or location. Amazon Cognito advanced security evaluates the risk of an authentication event based on the context that your app generates and passes to Amazon Cognito when it makes API requests.
     */
    ContextData?: ContextDataType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers. You create custom workflows by assigning Lambda functions to user pool triggers. When you use the AdminRespondToAuthChallenge API action, Amazon Cognito invokes any functions that you have assigned to the following triggers:    pre sign-up   custom message   post authentication   user migration   pre token generation   define auth challenge   create auth challenge   verify auth challenge response   When Amazon Cognito invokes any of these functions, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute that provides the data that you assigned to the ClientMetadata parameter in your AdminRespondToAuthChallenge request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see  Customizing user pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  When you use the ClientMetadata parameter, remember that Amazon Cognito won't do the following:   Store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration doesn't include triggers, the ClientMetadata parameter serves no purpose.   Validate the ClientMetadata value.   Encrypt the ClientMetadata value. Don't use Amazon Cognito to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface AdminRespondToAuthChallengeResponse {
    /**
     * The name of the challenge. For more information, see AdminInitiateAuth.
     */
    ChallengeName?: ChallengeNameType;
    /**
     * The session that should be passed both ways in challenge-response calls to the service. If the caller must pass another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next RespondToAuthChallenge API call.
     */
    Session?: SessionType;
    /**
     * The challenge parameters. For more information, see AdminInitiateAuth.
     */
    ChallengeParameters?: ChallengeParametersType;
    /**
     * The result returned by the server in response to the authentication request.
     */
    AuthenticationResult?: AuthenticationResultType;
  }
  export interface AdminSetUserMFAPreferenceRequest {
    /**
     * The SMS text message MFA settings.
     */
    SMSMfaSettings?: SMSMfaSettingsType;
    /**
     * The time-based one-time password software token MFA settings.
     */
    SoftwareTokenMfaSettings?: SoftwareTokenMfaSettingsType;
    /**
     * The user pool username or alias.
     */
    Username: UsernameType;
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
  }
  export interface AdminSetUserMFAPreferenceResponse {
  }
  export interface AdminSetUserPasswordRequest {
    /**
     * The user pool ID for the user pool where you want to set the user's password.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name of the user whose password you want to set.
     */
    Username: UsernameType;
    /**
     * The password for the user.
     */
    Password: PasswordType;
    /**
     *  True if the password is permanent, False if it is temporary.
     */
    Permanent?: BooleanType;
  }
  export interface AdminSetUserPasswordResponse {
  }
  export interface AdminSetUserSettingsRequest {
    /**
     * The ID of the user pool that contains the user whose options you're setting.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name of the user whose options you're setting.
     */
    Username: UsernameType;
    /**
     * You can use this parameter only to set an SMS configuration that uses SMS for delivery.
     */
    MFAOptions: MFAOptionListType;
  }
  export interface AdminSetUserSettingsResponse {
  }
  export interface AdminUpdateAuthEventFeedbackRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user pool username.
     */
    Username: UsernameType;
    /**
     * The authentication event ID.
     */
    EventId: EventIdType;
    /**
     * The authentication event feedback value. When you provide a FeedbackValue value of valid, you tell Amazon Cognito that you trust a user session where Amazon Cognito has evaluated some level of risk. When you provide a FeedbackValue value of invalid, you tell Amazon Cognito that you don't trust a user session, or you don't believe that Amazon Cognito evaluated a high-enough risk level.
     */
    FeedbackValue: FeedbackValueType;
  }
  export interface AdminUpdateAuthEventFeedbackResponse {
  }
  export interface AdminUpdateDeviceStatusRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name.
     */
    Username: UsernameType;
    /**
     * The device key.
     */
    DeviceKey: DeviceKeyType;
    /**
     * The status indicating whether a device has been remembered or not.
     */
    DeviceRememberedStatus?: DeviceRememberedStatusType;
  }
  export interface AdminUpdateDeviceStatusResponse {
  }
  export interface AdminUpdateUserAttributesRequest {
    /**
     * The user pool ID for the user pool where you want to update user attributes.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name of the user for whom you want to update user attributes.
     */
    Username: UsernameType;
    /**
     * An array of name-value pairs representing user attributes. For custom attributes, you must prepend the custom: prefix to the attribute name. If your user pool requires verification before Amazon Cognito updates an attribute value that you specify in this request, Amazon Cognito doesn’t immediately update the value of that attribute. After your user receives and responds to a verification message to verify the new value, Amazon Cognito updates the attribute value. Your user can sign in and receive messages with the original attribute value until they verify the new value. To update the value of an attribute that requires verification in the same API request, include the email_verified or phone_number_verified attribute, with a value of true. If you set the email_verified or phone_number_verified value for an email or phone_number attribute that requires verification to true, Amazon Cognito doesn’t send a verification message to your user.
     */
    UserAttributes: AttributeListType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers. You create custom workflows by assigning Lambda functions to user pool triggers. When you use the AdminUpdateUserAttributes API action, Amazon Cognito invokes the function that is assigned to the custom message trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your AdminUpdateUserAttributes request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see  Customizing user pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  When you use the ClientMetadata parameter, remember that Amazon Cognito won't do the following:   Store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration doesn't include triggers, the ClientMetadata parameter serves no purpose.   Validate the ClientMetadata value.   Encrypt the ClientMetadata value. Don't use Amazon Cognito to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface AdminUpdateUserAttributesResponse {
  }
  export interface AdminUserGlobalSignOutRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name.
     */
    Username: UsernameType;
  }
  export interface AdminUserGlobalSignOutResponse {
  }
  export type AdvancedSecurityModeType = "OFF"|"AUDIT"|"ENFORCED"|string;
  export type AliasAttributeType = "phone_number"|"email"|"preferred_username"|string;
  export type AliasAttributesListType = AliasAttributeType[];
  export interface AnalyticsConfigurationType {
    /**
     * The application ID for an Amazon Pinpoint application.
     */
    ApplicationId?: HexStringType;
    /**
     * The Amazon Resource Name (ARN) of an Amazon Pinpoint project. You can use the Amazon Pinpoint project to integrate with the chosen user pool Client. Amazon Cognito publishes events to the Amazon Pinpoint project that the app ARN declares.
     */
    ApplicationArn?: ArnType;
    /**
     * The ARN of an Identity and Access Management role that authorizes Amazon Cognito to publish events to Amazon Pinpoint analytics.
     */
    RoleArn?: ArnType;
    /**
     * The external ID.
     */
    ExternalId?: StringType;
    /**
     * If UserDataShared is true, Amazon Cognito includes user data in the events that it publishes to Amazon Pinpoint analytics.
     */
    UserDataShared?: BooleanType;
  }
  export interface AnalyticsMetadataType {
    /**
     * The endpoint ID.
     */
    AnalyticsEndpointId?: StringType;
  }
  export type ArnType = string;
  export interface AssociateSoftwareTokenRequest {
    /**
     * A valid access token that Amazon Cognito issued to the user whose software token you want to generate.
     */
    AccessToken?: TokenModelType;
    /**
     * The session that should be passed both ways in challenge-response calls to the service. This allows authentication of the user as part of the MFA setup process.
     */
    Session?: SessionType;
  }
  export interface AssociateSoftwareTokenResponse {
    /**
     * A unique generated shared secret code that is used in the TOTP algorithm to generate a one-time code.
     */
    SecretCode?: SecretCodeType;
    /**
     * The session that should be passed both ways in challenge-response calls to the service. This allows authentication of the user as part of the MFA setup process.
     */
    Session?: SessionType;
  }
  export type AttributeDataType = "String"|"Number"|"DateTime"|"Boolean"|string;
  export type AttributeListType = AttributeType[];
  export type AttributeMappingKeyType = string;
  export type AttributeMappingType = {[key: string]: StringType};
  export type AttributeNameListType = AttributeNameType[];
  export type AttributeNameType = string;
  export interface AttributeType {
    /**
     * The name of the attribute.
     */
    Name: AttributeNameType;
    /**
     * The value of the attribute.
     */
    Value?: AttributeValueType;
  }
  export type AttributeValueType = string;
  export type AttributesRequireVerificationBeforeUpdateType = VerifiedAttributeType[];
  export interface AuthEventType {
    /**
     * The event ID.
     */
    EventId?: StringType;
    /**
     * The event type.
     */
    EventType?: EventType;
    /**
     * The date and time, in ISO 8601 format, when the item was created.
     */
    CreationDate?: DateType;
    /**
     * The event response.
     */
    EventResponse?: EventResponseType;
    /**
     * The event risk.
     */
    EventRisk?: EventRiskType;
    /**
     * The challenge responses.
     */
    ChallengeResponses?: ChallengeResponseListType;
    /**
     * The user context data captured at the time of an event request. This value provides additional information about the client from which event the request is received.
     */
    EventContextData?: EventContextDataType;
    /**
     * A flag specifying the user feedback captured at the time of an event request is good or bad. 
     */
    EventFeedback?: EventFeedbackType;
  }
  export type AuthEventsType = AuthEventType[];
  export type AuthFlowType = "USER_SRP_AUTH"|"REFRESH_TOKEN_AUTH"|"REFRESH_TOKEN"|"CUSTOM_AUTH"|"ADMIN_NO_SRP_AUTH"|"USER_PASSWORD_AUTH"|"ADMIN_USER_PASSWORD_AUTH"|string;
  export type AuthParametersType = {[key: string]: StringType};
  export type AuthSessionValidityType = number;
  export interface AuthenticationResultType {
    /**
     * A valid access token that Amazon Cognito issued to the user who you want to authenticate.
     */
    AccessToken?: TokenModelType;
    /**
     * The expiration period of the authentication result in seconds.
     */
    ExpiresIn?: IntegerType;
    /**
     * The token type.
     */
    TokenType?: StringType;
    /**
     * The refresh token.
     */
    RefreshToken?: TokenModelType;
    /**
     * The ID token.
     */
    IdToken?: TokenModelType;
    /**
     * The new device metadata from an authentication result.
     */
    NewDeviceMetadata?: NewDeviceMetadataType;
  }
  export type BlockedIPRangeListType = StringType[];
  export type BooleanType = boolean;
  export type CSSType = string;
  export type CSSVersionType = string;
  export type CallbackURLsListType = RedirectUrlType[];
  export type ChallengeName = "Password"|"Mfa"|string;
  export type ChallengeNameType = "SMS_MFA"|"SOFTWARE_TOKEN_MFA"|"SELECT_MFA_TYPE"|"MFA_SETUP"|"PASSWORD_VERIFIER"|"CUSTOM_CHALLENGE"|"DEVICE_SRP_AUTH"|"DEVICE_PASSWORD_VERIFIER"|"ADMIN_NO_SRP_AUTH"|"NEW_PASSWORD_REQUIRED"|string;
  export type ChallengeParametersType = {[key: string]: StringType};
  export type ChallengeResponse = "Success"|"Failure"|string;
  export type ChallengeResponseListType = ChallengeResponseType[];
  export interface ChallengeResponseType {
    /**
     * The challenge name.
     */
    ChallengeName?: ChallengeName;
    /**
     * The challenge response.
     */
    ChallengeResponse?: ChallengeResponse;
  }
  export type ChallengeResponsesType = {[key: string]: StringType};
  export interface ChangePasswordRequest {
    /**
     * The old password.
     */
    PreviousPassword: PasswordType;
    /**
     * The new password.
     */
    ProposedPassword: PasswordType;
    /**
     * A valid access token that Amazon Cognito issued to the user whose password you want to change.
     */
    AccessToken: TokenModelType;
  }
  export interface ChangePasswordResponse {
  }
  export type ClientIdType = string;
  export type ClientMetadataType = {[key: string]: StringType};
  export type ClientNameType = string;
  export type ClientPermissionListType = ClientPermissionType[];
  export type ClientPermissionType = string;
  export type ClientSecretType = string;
  export interface CloudWatchLogsConfigurationType {
    /**
     * The Amazon Resource Name (arn) of a CloudWatch Logs log group where your user pool sends logs. The log group must not be encrypted with Key Management Service and must be in the same Amazon Web Services account as your user pool. To send logs to log groups with a resource policy of a size greater than 5120 characters, configure a log group with a path that starts with /aws/vendedlogs. For more information, see Enabling logging from certain Amazon Web Services services.
     */
    LogGroupArn?: ArnType;
  }
  export type CodeDeliveryDetailsListType = CodeDeliveryDetailsType[];
  export interface CodeDeliveryDetailsType {
    /**
     * The email address or phone number destination where Amazon Cognito sent the code.
     */
    Destination?: StringType;
    /**
     * The method that Amazon Cognito used to send the code.
     */
    DeliveryMedium?: DeliveryMediumType;
    /**
     * The name of the attribute that Amazon Cognito verifies with the code.
     */
    AttributeName?: AttributeNameType;
  }
  export type CompletionMessageType = string;
  export interface CompromisedCredentialsActionsType {
    /**
     * The event action.
     */
    EventAction: CompromisedCredentialsEventActionType;
  }
  export type CompromisedCredentialsEventActionType = "BLOCK"|"NO_ACTION"|string;
  export interface CompromisedCredentialsRiskConfigurationType {
    /**
     * Perform the action for these events. The default is to perform all events if no event filter is specified.
     */
    EventFilter?: EventFiltersType;
    /**
     * The compromised credentials risk configuration actions.
     */
    Actions: CompromisedCredentialsActionsType;
  }
  export interface ConfirmDeviceRequest {
    /**
     * A valid access token that Amazon Cognito issued to the user whose device you want to confirm.
     */
    AccessToken: TokenModelType;
    /**
     * The device key.
     */
    DeviceKey: DeviceKeyType;
    /**
     * The configuration of the device secret verifier.
     */
    DeviceSecretVerifierConfig?: DeviceSecretVerifierConfigType;
    /**
     * The device name.
     */
    DeviceName?: DeviceNameType;
  }
  export interface ConfirmDeviceResponse {
    /**
     * Indicates whether the user confirmation must confirm the device response.
     */
    UserConfirmationNecessary?: BooleanType;
  }
  export interface ConfirmForgotPasswordRequest {
    /**
     * The app client ID of the app associated with the user pool.
     */
    ClientId: ClientIdType;
    /**
     * A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message. For more information about SecretHash, see Computing secret hash values.
     */
    SecretHash?: SecretHashType;
    /**
     * The user name of the user for whom you want to enter a code to retrieve a forgotten password.
     */
    Username: UsernameType;
    /**
     * The confirmation code from your user's request to reset their password. For more information, see ForgotPassword.
     */
    ConfirmationCode: ConfirmationCodeType;
    /**
     * The new password that your user wants to set.
     */
    Password: PasswordType;
    /**
     * The Amazon Pinpoint analytics metadata for collecting metrics for ConfirmForgotPassword calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * Contextual data about your user session, such as the device fingerprint, IP address, or location. Amazon Cognito advanced security evaluates the risk of an authentication event based on the context that your app generates and passes to Amazon Cognito when it makes API requests.
     */
    UserContextData?: UserContextDataType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers. You create custom workflows by assigning Lambda functions to user pool triggers. When you use the ConfirmForgotPassword API action, Amazon Cognito invokes the function that is assigned to the post confirmation trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your ConfirmForgotPassword request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see  Customizing user pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  When you use the ClientMetadata parameter, remember that Amazon Cognito won't do the following:   Store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration doesn't include triggers, the ClientMetadata parameter serves no purpose.   Validate the ClientMetadata value.   Encrypt the ClientMetadata value. Don't use Amazon Cognito to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface ConfirmForgotPasswordResponse {
  }
  export interface ConfirmSignUpRequest {
    /**
     * The ID of the app client associated with the user pool.
     */
    ClientId: ClientIdType;
    /**
     * A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.
     */
    SecretHash?: SecretHashType;
    /**
     * The user name of the user whose registration you want to confirm.
     */
    Username: UsernameType;
    /**
     * The confirmation code sent by a user's request to confirm registration.
     */
    ConfirmationCode: ConfirmationCodeType;
    /**
     * Boolean to be specified to force user confirmation irrespective of existing alias. By default set to False. If this parameter is set to True and the phone number/email used for sign up confirmation already exists as an alias with a different user, the API call will migrate the alias from the previous user to the newly created user being confirmed. If set to False, the API will throw an AliasExistsException error.
     */
    ForceAliasCreation?: ForceAliasCreation;
    /**
     * The Amazon Pinpoint analytics metadata for collecting metrics for ConfirmSignUp calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * Contextual data about your user session, such as the device fingerprint, IP address, or location. Amazon Cognito advanced security evaluates the risk of an authentication event based on the context that your app generates and passes to Amazon Cognito when it makes API requests.
     */
    UserContextData?: UserContextDataType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers. You create custom workflows by assigning Lambda functions to user pool triggers. When you use the ConfirmSignUp API action, Amazon Cognito invokes the function that is assigned to the post confirmation trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your ConfirmSignUp request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see  Customizing user pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  When you use the ClientMetadata parameter, remember that Amazon Cognito won't do the following:   Store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration doesn't include triggers, the ClientMetadata parameter serves no purpose.   Validate the ClientMetadata value.   Encrypt the ClientMetadata value. Don't use Amazon Cognito to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface ConfirmSignUpResponse {
  }
  export type ConfirmationCodeType = string;
  export interface ContextDataType {
    /**
     * The source IP address of your user's device.
     */
    IpAddress: StringType;
    /**
     * Your server endpoint where this API is invoked.
     */
    ServerName: StringType;
    /**
     * Your server path where this API is invoked.
     */
    ServerPath: StringType;
    /**
     * HttpHeaders received on your server in same order.
     */
    HttpHeaders: HttpHeaderList;
    /**
     * Encoded device-fingerprint details that your app collected with the Amazon Cognito context data collection library. For more information, see Adding user device and session data to API requests.
     */
    EncodedData?: StringType;
  }
  export interface CreateGroupRequest {
    /**
     * The name of the group. Must be unique.
     */
    GroupName: GroupNameType;
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: UserPoolIdType;
    /**
     * A string containing the description of the group.
     */
    Description?: DescriptionType;
    /**
     * The role Amazon Resource Name (ARN) for the group.
     */
    RoleArn?: ArnType;
    /**
     * A non-negative integer value that specifies the precedence of this group relative to the other groups that a user can belong to in the user pool. Zero is the highest precedence value. Groups with lower Precedence values take precedence over groups with higher or null Precedence values. If a user belongs to two or more groups, it is the group with the lowest precedence value whose role ARN is given in the user's tokens for the cognito:roles and cognito:preferred_role claims. Two groups can have the same Precedence value. If this happens, neither group takes precedence over the other. If two groups with the same Precedence have the same role ARN, that role is used in the cognito:preferred_role claim in tokens for users in each group. If the two groups have different role ARNs, the cognito:preferred_role claim isn't set in users' tokens. The default Precedence value is null. The maximum Precedence value is 2^31-1.
     */
    Precedence?: PrecedenceType;
  }
  export interface CreateGroupResponse {
    /**
     * The group object for the group.
     */
    Group?: GroupType;
  }
  export interface CreateIdentityProviderRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The IdP name.
     */
    ProviderName: ProviderNameTypeV2;
    /**
     * The IdP type.
     */
    ProviderType: IdentityProviderTypeType;
    /**
     * The IdP details. The following list describes the provider detail keys for each IdP type.   For Google and Login with Amazon:   client_id   client_secret   authorize_scopes     For Facebook:   client_id   client_secret   authorize_scopes   api_version     For Sign in with Apple:   client_id   team_id   key_id   private_key   authorize_scopes     For OpenID Connect (OIDC) providers:   client_id   client_secret   attributes_request_method   oidc_issuer   authorize_scopes   The following keys are only present if Amazon Cognito didn't discover them at the oidc_issuer URL.   authorize_url    token_url    attributes_url    jwks_uri      Amazon Cognito sets the value of the following keys automatically. They are read-only.   attributes_url_add_attributes        For SAML providers:   MetadataFile or MetadataURL   IDPSignout optional     
     */
    ProviderDetails: ProviderDetailsType;
    /**
     * A mapping of IdP attributes to standard and custom user pool attributes.
     */
    AttributeMapping?: AttributeMappingType;
    /**
     * A list of IdP identifiers.
     */
    IdpIdentifiers?: IdpIdentifiersListType;
  }
  export interface CreateIdentityProviderResponse {
    /**
     * The newly created IdP object.
     */
    IdentityProvider: IdentityProviderType;
  }
  export interface CreateResourceServerRequest {
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: UserPoolIdType;
    /**
     * A unique resource server identifier for the resource server. This could be an HTTPS endpoint where the resource server is located, such as https://my-weather-api.example.com.
     */
    Identifier: ResourceServerIdentifierType;
    /**
     * A friendly name for the resource server.
     */
    Name: ResourceServerNameType;
    /**
     * A list of scopes. Each scope is a key-value map with the keys name and description.
     */
    Scopes?: ResourceServerScopeListType;
  }
  export interface CreateResourceServerResponse {
    /**
     * The newly created resource server.
     */
    ResourceServer: ResourceServerType;
  }
  export interface CreateUserImportJobRequest {
    /**
     * The job name for the user import job.
     */
    JobName: UserImportJobNameType;
    /**
     * The user pool ID for the user pool that the users are being imported into.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The role ARN for the Amazon CloudWatch Logs Logging role for the user import job.
     */
    CloudWatchLogsRoleArn: ArnType;
  }
  export interface CreateUserImportJobResponse {
    /**
     * The job object that represents the user import job.
     */
    UserImportJob?: UserImportJobType;
  }
  export interface CreateUserPoolClientRequest {
    /**
     * The user pool ID for the user pool where you want to create a user pool client.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The client name for the user pool client you would like to create.
     */
    ClientName: ClientNameType;
    /**
     * Boolean to specify whether you want to generate a secret for the user pool client being created.
     */
    GenerateSecret?: GenerateSecret;
    /**
     * The refresh token time limit. After this limit expires, your user can't use their refresh token. To specify the time unit for RefreshTokenValidity as seconds, minutes, hours, or days, set a TokenValidityUnits value in your API request. For example, when you set RefreshTokenValidity as 10 and TokenValidityUnits as days, your user can refresh their session and retrieve new access and ID tokens for 10 days. The default time unit for RefreshTokenValidity in an API request is days. You can't set RefreshTokenValidity to 0. If you do, Amazon Cognito overrides the value with the default value of 30 days. Valid range is displayed below in seconds. If you don't specify otherwise in the configuration of your app client, your refresh tokens are valid for 30 days.
     */
    RefreshTokenValidity?: RefreshTokenValidityType;
    /**
     * The access token time limit. After this limit expires, your user can't use their access token. To specify the time unit for AccessTokenValidity as seconds, minutes, hours, or days, set a TokenValidityUnits value in your API request. For example, when you set AccessTokenValidity to 10 and TokenValidityUnits to hours, your user can authorize access with their access token for 10 hours. The default time unit for AccessTokenValidity in an API request is hours. Valid range is displayed below in seconds. If you don't specify otherwise in the configuration of your app client, your access tokens are valid for one hour.
     */
    AccessTokenValidity?: AccessTokenValidityType;
    /**
     * The ID token time limit. After this limit expires, your user can't use their ID token. To specify the time unit for IdTokenValidity as seconds, minutes, hours, or days, set a TokenValidityUnits value in your API request. For example, when you set IdTokenValidity as 10 and TokenValidityUnits as hours, your user can authenticate their session with their ID token for 10 hours. The default time unit for IdTokenValidity in an API request is hours. Valid range is displayed below in seconds. If you don't specify otherwise in the configuration of your app client, your ID tokens are valid for one hour.
     */
    IdTokenValidity?: IdTokenValidityType;
    /**
     * The units in which the validity times are represented. The default unit for RefreshToken is days, and default for ID and access tokens are hours.
     */
    TokenValidityUnits?: TokenValidityUnitsType;
    /**
     * The read attributes.
     */
    ReadAttributes?: ClientPermissionListType;
    /**
     * The user pool attributes that the app client can write to. If your app client allows users to sign in through an IdP, this array must include all attributes that you have mapped to IdP attributes. Amazon Cognito updates mapped attributes when users sign in to your application through an IdP. If your app client does not have write access to a mapped attribute, Amazon Cognito throws an error when it tries to update the attribute. For more information, see Specifying IdP Attribute Mappings for Your user pool.
     */
    WriteAttributes?: ClientPermissionListType;
    /**
     * The authentication flows that you want your user pool client to support. For each app client in your user pool, you can sign in your users with any combination of one or more flows, including with a user name and Secure Remote Password (SRP), a user name and password, or a custom authentication process that you define with Lambda functions.  If you don't specify a value for ExplicitAuthFlows, your user client supports ALLOW_REFRESH_TOKEN_AUTH, ALLOW_USER_SRP_AUTH, and ALLOW_CUSTOM_AUTH.  Valid values include:    ALLOW_ADMIN_USER_PASSWORD_AUTH: Enable admin based user password authentication flow ADMIN_USER_PASSWORD_AUTH. This setting replaces the ADMIN_NO_SRP_AUTH setting. With this authentication flow, your app passes a user name and password to Amazon Cognito in the request, instead of using the Secure Remote Password (SRP) protocol to securely transmit the password.    ALLOW_CUSTOM_AUTH: Enable Lambda trigger based authentication.    ALLOW_USER_PASSWORD_AUTH: Enable user password-based authentication. In this flow, Amazon Cognito receives the password in the request instead of using the SRP protocol to verify passwords.    ALLOW_USER_SRP_AUTH: Enable SRP-based authentication.    ALLOW_REFRESH_TOKEN_AUTH: Enable authflow to refresh tokens.   In some environments, you will see the values ADMIN_NO_SRP_AUTH, CUSTOM_AUTH_FLOW_ONLY, or USER_PASSWORD_AUTH. You can't assign these legacy ExplicitAuthFlows values to user pool clients at the same time as values that begin with ALLOW_, like ALLOW_USER_SRP_AUTH.
     */
    ExplicitAuthFlows?: ExplicitAuthFlowsListType;
    /**
     * A list of provider names for the identity providers (IdPs) that are supported on this client. The following are supported: COGNITO, Facebook, Google, SignInWithApple, and LoginWithAmazon. You can also specify the names that you configured for the SAML and OIDC IdPs in your user pool, for example MySAMLIdP or MyOIDCIdP.
     */
    SupportedIdentityProviders?: SupportedIdentityProvidersListType;
    /**
     * A list of allowed redirect (callback) URLs for the IdPs. A redirect URI must:   Be an absolute URI.   Be registered with the authorization server.   Not include a fragment component.   See OAuth 2.0 - Redirection Endpoint. Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only. App callback URLs such as myapp://example are also supported.
     */
    CallbackURLs?: CallbackURLsListType;
    /**
     * A list of allowed logout URLs for the IdPs.
     */
    LogoutURLs?: LogoutURLsListType;
    /**
     * The default redirect URI. Must be in the CallbackURLs list. A redirect URI must:   Be an absolute URI.   Be registered with the authorization server.   Not include a fragment component.   See OAuth 2.0 - Redirection Endpoint. Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only. App callback URLs such as myapp://example are also supported.
     */
    DefaultRedirectURI?: RedirectUrlType;
    /**
     * The allowed OAuth flows.  code  Use a code grant flow, which provides an authorization code as the response. This code can be exchanged for access tokens with the /oauth2/token endpoint.  implicit  Issue the access token (and, optionally, ID token, based on scopes) directly to your user.  client_credentials  Issue the access token from the /oauth2/token endpoint directly to a non-person user using a combination of the client ID and client secret.  
     */
    AllowedOAuthFlows?: OAuthFlowsType;
    /**
     * The allowed OAuth scopes. Possible values provided by OAuth are phone, email, openid, and profile. Possible values provided by Amazon Web Services are aws.cognito.signin.user.admin. Custom scopes created in Resource Servers are also supported.
     */
    AllowedOAuthScopes?: ScopeListType;
    /**
     * Set to true to use OAuth 2.0 features in your user pool app client.  AllowedOAuthFlowsUserPoolClient must be true before you can configure the following features in your app client.    CallBackURLs: Callback URLs.    LogoutURLs: Sign-out redirect URLs.    AllowedOAuthScopes: OAuth 2.0 scopes.    AllowedOAuthFlows: Support for authorization code, implicit, and client credentials OAuth 2.0 grants.   To use OAuth 2.0 features, configure one of these features in the Amazon Cognito console or set AllowedOAuthFlowsUserPoolClient to true in a CreateUserPoolClient or UpdateUserPoolClient API request. If you don't set a value for AllowedOAuthFlowsUserPoolClient in a request with the CLI or SDKs, it defaults to false.
     */
    AllowedOAuthFlowsUserPoolClient?: BooleanType;
    /**
     * The user pool analytics configuration for collecting metrics and sending them to your Amazon Pinpoint campaign.  In Amazon Web Services Regions where Amazon Pinpoint isn't available, user pools only support sending events to Amazon Pinpoint projects in Amazon Web Services Region us-east-1. In Regions where Amazon Pinpoint is available, user pools support sending events to Amazon Pinpoint projects within that same Region. 
     */
    AnalyticsConfiguration?: AnalyticsConfigurationType;
    /**
     * Errors and responses that you want Amazon Cognito APIs to return during authentication, account confirmation, and password recovery when the user doesn't exist in the user pool. When set to ENABLED and the user doesn't exist, authentication returns an error indicating either the username or password was incorrect. Account confirmation and password recovery return a response indicating a code was sent to a simulated destination. When set to LEGACY, those APIs return a UserNotFoundException exception if the user doesn't exist in the user pool. Valid values include:    ENABLED - This prevents user existence-related errors.    LEGACY - This represents the early behavior of Amazon Cognito where user existence related errors aren't prevented.  
     */
    PreventUserExistenceErrors?: PreventUserExistenceErrorTypes;
    /**
     * Activates or deactivates token revocation. For more information about revoking tokens, see RevokeToken. If you don't include this parameter, token revocation is automatically activated for the new user pool client.
     */
    EnableTokenRevocation?: WrappedBooleanType;
    /**
     * Activates the propagation of additional user context data. For more information about propagation of user context data, see  Adding advanced security to a user pool. If you don’t include this parameter, you can't send device fingerprint information, including source IP address, to Amazon Cognito advanced security. You can only activate EnablePropagateAdditionalUserContextData in an app client that has a client secret.
     */
    EnablePropagateAdditionalUserContextData?: WrappedBooleanType;
    /**
     * Amazon Cognito creates a session token for each API request in an authentication flow. AuthSessionValidity is the duration, in minutes, of that session token. Your user pool native user must respond to each authentication challenge before the session expires.
     */
    AuthSessionValidity?: AuthSessionValidityType;
  }
  export interface CreateUserPoolClientResponse {
    /**
     * The user pool client that was just created.
     */
    UserPoolClient?: UserPoolClientType;
  }
  export interface CreateUserPoolDomainRequest {
    /**
     * The domain string. For custom domains, this is the fully-qualified domain name, such as auth.example.com. For Amazon Cognito prefix domains, this is the prefix alone, such as auth.
     */
    Domain: DomainType;
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The configuration for a custom domain that hosts the sign-up and sign-in webpages for your application. Provide this parameter only if you want to use a custom domain for your user pool. Otherwise, you can exclude this parameter and use the Amazon Cognito hosted domain instead. For more information about the hosted domain and custom domains, see Configuring a User Pool Domain.
     */
    CustomDomainConfig?: CustomDomainConfigType;
  }
  export interface CreateUserPoolDomainResponse {
    /**
     * The Amazon CloudFront endpoint that you use as the target of the alias that you set up with your Domain Name Service (DNS) provider.
     */
    CloudFrontDomain?: DomainType;
  }
  export interface CreateUserPoolRequest {
    /**
     * A string used to name the user pool.
     */
    PoolName: UserPoolNameType;
    /**
     * The policies associated with the new user pool.
     */
    Policies?: UserPoolPolicyType;
    /**
     * When active, DeletionProtection prevents accidental deletion of your user pool. Before you can delete a user pool that you have protected against deletion, you must deactivate this feature. When you try to delete a protected user pool in a DeleteUserPool API request, Amazon Cognito returns an InvalidParameterException error. To delete a protected user pool, send a new DeleteUserPool request after you deactivate deletion protection in an UpdateUserPool API request.
     */
    DeletionProtection?: DeletionProtectionType;
    /**
     * The Lambda trigger configuration information for the new user pool.  In a push model, event sources (such as Amazon S3 and custom applications) need permission to invoke a function. So you must make an extra call to add permission for these event sources to invoke your Lambda function.  For more information on using the Lambda API to add permission, see AddPermission .  For adding permission using the CLI, see add-permission . 
     */
    LambdaConfig?: LambdaConfigType;
    /**
     * The attributes to be auto-verified. Possible values: email, phone_number.
     */
    AutoVerifiedAttributes?: VerifiedAttributesListType;
    /**
     * Attributes supported as an alias for this user pool. Possible values: phone_number, email, or preferred_username.
     */
    AliasAttributes?: AliasAttributesListType;
    /**
     * Specifies whether a user can use an email address or phone number as a username when they sign up.
     */
    UsernameAttributes?: UsernameAttributesListType;
    /**
     * This parameter is no longer used. See VerificationMessageTemplateType.
     */
    SmsVerificationMessage?: SmsVerificationMessageType;
    /**
     * This parameter is no longer used. See VerificationMessageTemplateType.
     */
    EmailVerificationMessage?: EmailVerificationMessageType;
    /**
     * This parameter is no longer used. See VerificationMessageTemplateType.
     */
    EmailVerificationSubject?: EmailVerificationSubjectType;
    /**
     * The template for the verification message that the user sees when the app requests permission to access the user's information.
     */
    VerificationMessageTemplate?: VerificationMessageTemplateType;
    /**
     * A string representing the SMS authentication message.
     */
    SmsAuthenticationMessage?: SmsVerificationMessageType;
    /**
     * Specifies MFA configuration details.
     */
    MfaConfiguration?: UserPoolMfaType;
    /**
     * The settings for updates to user attributes. These settings include the property AttributesRequireVerificationBeforeUpdate, a user-pool setting that tells Amazon Cognito how to handle changes to the value of your users' email address and phone number attributes. For more information, see  Verifying updates to email addresses and phone numbers.
     */
    UserAttributeUpdateSettings?: UserAttributeUpdateSettingsType;
    /**
     * The device-remembering configuration for a user pool. A null value indicates that you have deactivated device remembering in your user pool.  When you provide a value for any DeviceConfiguration field, you activate the Amazon Cognito device-remembering feature. 
     */
    DeviceConfiguration?: DeviceConfigurationType;
    /**
     * The email configuration of your user pool. The email configuration type sets your preferred sending method, Amazon Web Services Region, and sender for messages from your user pool.
     */
    EmailConfiguration?: EmailConfigurationType;
    /**
     * The SMS configuration with the settings that your Amazon Cognito user pool must use to send an SMS message from your Amazon Web Services account through Amazon Simple Notification Service. To send SMS messages with Amazon SNS in the Amazon Web Services Region that you want, the Amazon Cognito user pool uses an Identity and Access Management (IAM) role in your Amazon Web Services account.
     */
    SmsConfiguration?: SmsConfigurationType;
    /**
     * The tag keys and values to assign to the user pool. A tag is a label that you can use to categorize and manage user pools in different ways, such as by purpose, owner, environment, or other criteria.
     */
    UserPoolTags?: UserPoolTagsType;
    /**
     * The configuration for AdminCreateUser requests.
     */
    AdminCreateUserConfig?: AdminCreateUserConfigType;
    /**
     * An array of schema attributes for the new user pool. These attributes can be standard or custom attributes.
     */
    Schema?: SchemaAttributesListType;
    /**
     * User pool add-ons. Contains settings for activation of advanced security features. To log user security information but take no action, set to AUDIT. To configure automatic security responses to risky traffic to your user pool, set to ENFORCED. For more information, see Adding advanced security to a user pool.
     */
    UserPoolAddOns?: UserPoolAddOnsType;
    /**
     * Case sensitivity on the username input for the selected sign-in option. When case sensitivity is set to False (case insensitive), users can sign in with any combination of capital and lowercase letters. For example, username, USERNAME, or UserName, or for email, email@example.com or EMaiL@eXamplE.Com. For most use cases, set case sensitivity to False (case insensitive) as a best practice. When usernames and email addresses are case insensitive, Amazon Cognito treats any variation in case as the same user, and prevents a case variation from being assigned to the same attribute for a different user. This configuration is immutable after you set it. For more information, see UsernameConfigurationType.
     */
    UsernameConfiguration?: UsernameConfigurationType;
    /**
     * The available verified method a user can use to recover their password when they call ForgotPassword. You can use this setting to define a preferred method when a user has more than one method available. With this setting, SMS doesn't qualify for a valid password recovery mechanism if the user also has SMS multi-factor authentication (MFA) activated. In the absence of this setting, Amazon Cognito uses the legacy behavior to determine the recovery method where SMS is preferred through email.
     */
    AccountRecoverySetting?: AccountRecoverySettingType;
  }
  export interface CreateUserPoolResponse {
    /**
     * A container for the user pool details.
     */
    UserPool?: UserPoolType;
  }
  export type CustomAttributeNameType = string;
  export type CustomAttributesListType = SchemaAttributeType[];
  export interface CustomDomainConfigType {
    /**
     * The Amazon Resource Name (ARN) of an Certificate Manager SSL certificate. You use this certificate for the subdomain of your custom domain.
     */
    CertificateArn: ArnType;
  }
  export interface CustomEmailLambdaVersionConfigType {
    /**
     * Signature of the "request" attribute in the "event" information Amazon Cognito passes to your custom email Lambda function. The only supported value is V1_0.
     */
    LambdaVersion: CustomEmailSenderLambdaVersionType;
    /**
     * The Amazon Resource Name (ARN) of the Lambda function that Amazon Cognito activates to send email notifications to users.
     */
    LambdaArn: ArnType;
  }
  export type CustomEmailSenderLambdaVersionType = "V1_0"|string;
  export interface CustomSMSLambdaVersionConfigType {
    /**
     * Signature of the "request" attribute in the "event" information that Amazon Cognito passes to your custom SMS Lambda function. The only supported value is V1_0.
     */
    LambdaVersion: CustomSMSSenderLambdaVersionType;
    /**
     * The Amazon Resource Name (ARN) of the Lambda function that Amazon Cognito activates to send SMS notifications to users.
     */
    LambdaArn: ArnType;
  }
  export type CustomSMSSenderLambdaVersionType = "V1_0"|string;
  export type DateType = Date;
  export type DefaultEmailOptionType = "CONFIRM_WITH_LINK"|"CONFIRM_WITH_CODE"|string;
  export interface DeleteGroupRequest {
    /**
     * The name of the group.
     */
    GroupName: GroupNameType;
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: UserPoolIdType;
  }
  export interface DeleteIdentityProviderRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The IdP name.
     */
    ProviderName: ProviderNameType;
  }
  export interface DeleteResourceServerRequest {
    /**
     * The user pool ID for the user pool that hosts the resource server.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The identifier for the resource server.
     */
    Identifier: ResourceServerIdentifierType;
  }
  export interface DeleteUserAttributesRequest {
    /**
     * An array of strings representing the user attribute names you want to delete. For custom attributes, you must prependattach the custom: prefix to the front of the attribute name.
     */
    UserAttributeNames: AttributeNameListType;
    /**
     * A valid access token that Amazon Cognito issued to the user whose attributes you want to delete.
     */
    AccessToken: TokenModelType;
  }
  export interface DeleteUserAttributesResponse {
  }
  export interface DeleteUserPoolClientRequest {
    /**
     * The user pool ID for the user pool where you want to delete the client.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The app client ID of the app associated with the user pool.
     */
    ClientId: ClientIdType;
  }
  export interface DeleteUserPoolDomainRequest {
    /**
     * The domain string. For custom domains, this is the fully-qualified domain name, such as auth.example.com. For Amazon Cognito prefix domains, this is the prefix alone, such as auth.
     */
    Domain: DomainType;
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
  }
  export interface DeleteUserPoolDomainResponse {
  }
  export interface DeleteUserPoolRequest {
    /**
     * The user pool ID for the user pool you want to delete.
     */
    UserPoolId: UserPoolIdType;
  }
  export interface DeleteUserRequest {
    /**
     * A valid access token that Amazon Cognito issued to the user whose user profile you want to delete.
     */
    AccessToken: TokenModelType;
  }
  export type DeletionProtectionType = "ACTIVE"|"INACTIVE"|string;
  export type DeliveryMediumListType = DeliveryMediumType[];
  export type DeliveryMediumType = "SMS"|"EMAIL"|string;
  export interface DescribeIdentityProviderRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The IdP name.
     */
    ProviderName: ProviderNameType;
  }
  export interface DescribeIdentityProviderResponse {
    /**
     * The identity provider details.
     */
    IdentityProvider: IdentityProviderType;
  }
  export interface DescribeResourceServerRequest {
    /**
     * The user pool ID for the user pool that hosts the resource server.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The identifier for the resource server
     */
    Identifier: ResourceServerIdentifierType;
  }
  export interface DescribeResourceServerResponse {
    /**
     * The resource server.
     */
    ResourceServer: ResourceServerType;
  }
  export interface DescribeRiskConfigurationRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The app client ID.
     */
    ClientId?: ClientIdType;
  }
  export interface DescribeRiskConfigurationResponse {
    /**
     * The risk configuration.
     */
    RiskConfiguration: RiskConfigurationType;
  }
  export interface DescribeUserImportJobRequest {
    /**
     * The user pool ID for the user pool that the users are being imported into.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The job ID for the user import job.
     */
    JobId: UserImportJobIdType;
  }
  export interface DescribeUserImportJobResponse {
    /**
     * The job object that represents the user import job.
     */
    UserImportJob?: UserImportJobType;
  }
  export interface DescribeUserPoolClientRequest {
    /**
     * The user pool ID for the user pool you want to describe.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The app client ID of the app associated with the user pool.
     */
    ClientId: ClientIdType;
  }
  export interface DescribeUserPoolClientResponse {
    /**
     * The user pool client from a server response to describe the user pool client.
     */
    UserPoolClient?: UserPoolClientType;
  }
  export interface DescribeUserPoolDomainRequest {
    /**
     * The domain string. For custom domains, this is the fully-qualified domain name, such as auth.example.com. For Amazon Cognito prefix domains, this is the prefix alone, such as auth.
     */
    Domain: DomainType;
  }
  export interface DescribeUserPoolDomainResponse {
    /**
     * A domain description object containing information about the domain.
     */
    DomainDescription?: DomainDescriptionType;
  }
  export interface DescribeUserPoolRequest {
    /**
     * The user pool ID for the user pool you want to describe.
     */
    UserPoolId: UserPoolIdType;
  }
  export interface DescribeUserPoolResponse {
    /**
     * The container of metadata returned by the server to describe the pool.
     */
    UserPool?: UserPoolType;
  }
  export type DescriptionType = string;
  export interface DeviceConfigurationType {
    /**
     * When true, a remembered device can sign in with device authentication instead of SMS and time-based one-time password (TOTP) factors for multi-factor authentication (MFA).  Whether or not ChallengeRequiredOnNewDevice is true, users who sign in with devices that have not been confirmed or remembered must still provide a second factor in a user pool that requires MFA. 
     */
    ChallengeRequiredOnNewDevice?: BooleanType;
    /**
     * When true, Amazon Cognito doesn't automatically remember a user's device when your app sends a  ConfirmDevice API request. In your app, create a prompt for your user to choose whether they want to remember their device. Return the user's choice in an  UpdateDeviceStatus API request. When DeviceOnlyRememberedOnUserPrompt is false, Amazon Cognito immediately remembers devices that you register in a ConfirmDevice API request.
     */
    DeviceOnlyRememberedOnUserPrompt?: BooleanType;
  }
  export type DeviceKeyType = string;
  export type DeviceListType = DeviceType[];
  export type DeviceNameType = string;
  export type DeviceRememberedStatusType = "remembered"|"not_remembered"|string;
  export interface DeviceSecretVerifierConfigType {
    /**
     * The password verifier.
     */
    PasswordVerifier?: StringType;
    /**
     * The salt 
     */
    Salt?: StringType;
  }
  export interface DeviceType {
    /**
     * The device key.
     */
    DeviceKey?: DeviceKeyType;
    /**
     * The device attributes.
     */
    DeviceAttributes?: AttributeListType;
    /**
     * The creation date of the device.
     */
    DeviceCreateDate?: DateType;
    /**
     * The date and time, in ISO 8601 format, when the item was modified.
     */
    DeviceLastModifiedDate?: DateType;
    /**
     * The date when the device was last authenticated.
     */
    DeviceLastAuthenticatedDate?: DateType;
  }
  export interface DomainDescriptionType {
    /**
     * The user pool ID.
     */
    UserPoolId?: UserPoolIdType;
    /**
     * The Amazon Web Services ID for the user pool owner.
     */
    AWSAccountId?: AWSAccountIdType;
    /**
     * The domain string. For custom domains, this is the fully-qualified domain name, such as auth.example.com. For Amazon Cognito prefix domains, this is the prefix alone, such as auth.
     */
    Domain?: DomainType;
    /**
     * The Amazon S3 bucket where the static files for this domain are stored.
     */
    S3Bucket?: S3BucketType;
    /**
     * The Amazon CloudFront endpoint that you use as the target of the alias that you set up with your Domain Name Service (DNS) provider.
     */
    CloudFrontDistribution?: StringType;
    /**
     * The app version.
     */
    Version?: DomainVersionType;
    /**
     * The domain status.
     */
    Status?: DomainStatusType;
    /**
     * The configuration for a custom domain that hosts the sign-up and sign-in webpages for your application.
     */
    CustomDomainConfig?: CustomDomainConfigType;
  }
  export type DomainStatusType = "CREATING"|"DELETING"|"UPDATING"|"ACTIVE"|"FAILED"|string;
  export type DomainType = string;
  export type DomainVersionType = string;
  export type EmailAddressType = string;
  export interface EmailConfigurationType {
    /**
     * The ARN of a verified email address or an address from a verified domain in Amazon SES. You can set a SourceArn email from a verified domain only with an API request. You can set a verified email address, but not an address in a verified domain, in the Amazon Cognito console. Amazon Cognito uses the email address that you provide in one of the following ways, depending on the value that you specify for the EmailSendingAccount parameter:   If you specify COGNITO_DEFAULT, Amazon Cognito uses this address as the custom FROM address when it emails your users using its built-in email account.   If you specify DEVELOPER, Amazon Cognito emails your users with this address by calling Amazon SES on your behalf.   The Region value of the SourceArn parameter must indicate a supported Amazon Web Services Region of your user pool. Typically, the Region in the SourceArn and the user pool Region are the same. For more information, see Amazon SES email configuration regions in the Amazon Cognito Developer Guide.
     */
    SourceArn?: ArnType;
    /**
     * The destination to which the receiver of the email should reply.
     */
    ReplyToEmailAddress?: EmailAddressType;
    /**
     * Specifies whether Amazon Cognito uses its built-in functionality to send your users email messages, or uses your Amazon Simple Email Service email configuration. Specify one of the following values:  COGNITO_DEFAULT  When Amazon Cognito emails your users, it uses its built-in email functionality. When you use the default option, Amazon Cognito allows only a limited number of emails each day for your user pool. For typical production environments, the default email limit is less than the required delivery volume. To achieve a higher delivery volume, specify DEVELOPER to use your Amazon SES email configuration. To look up the email delivery limit for the default option, see Limits in the Amazon Cognito Developer Guide. The default FROM address is no-reply@verificationemail.com. To customize the FROM address, provide the Amazon Resource Name (ARN) of an Amazon SES verified email address for the SourceArn parameter.  DEVELOPER  When Amazon Cognito emails your users, it uses your Amazon SES configuration. Amazon Cognito calls Amazon SES on your behalf to send email from your verified email address. When you use this option, the email delivery limits are the same limits that apply to your Amazon SES verified email address in your Amazon Web Services account. If you use this option, provide the ARN of an Amazon SES verified email address for the SourceArn parameter. Before Amazon Cognito can email your users, it requires additional permissions to call Amazon SES on your behalf. When you update your user pool with this option, Amazon Cognito creates a service-linked role, which is a type of role in your Amazon Web Services account. This role contains the permissions that allow you to access Amazon SES and send email messages from your email address. For more information about the service-linked role that Amazon Cognito creates, see Using Service-Linked Roles for Amazon Cognito in the Amazon Cognito Developer Guide.  
     */
    EmailSendingAccount?: EmailSendingAccountType;
    /**
     * Either the sender’s email address or the sender’s name with their email address. For example, testuser@example.com or Test User &lt;testuser@example.com&gt;. This address appears before the body of the email.
     */
    From?: StringType;
    /**
     * The set of configuration rules that can be applied to emails sent using Amazon Simple Email Service. A configuration set is applied to an email by including a reference to the configuration set in the headers of the email. Once applied, all of the rules in that configuration set are applied to the email. Configuration sets can be used to apply the following types of rules to emails:   Event publishing  Amazon Simple Email Service can track the number of send, delivery, open, click, bounce, and complaint events for each email sent. Use event publishing to send information about these events to other Amazon Web Services services such as and Amazon CloudWatch  IP pool management  When leasing dedicated IP addresses with Amazon Simple Email Service, you can create groups of IP addresses, called dedicated IP pools. You can then associate the dedicated IP pools with configuration sets.  
     */
    ConfigurationSet?: SESConfigurationSet;
  }
  export type EmailNotificationBodyType = string;
  export type EmailNotificationSubjectType = string;
  export type EmailSendingAccountType = "COGNITO_DEFAULT"|"DEVELOPER"|string;
  export type EmailVerificationMessageByLinkType = string;
  export type EmailVerificationMessageType = string;
  export type EmailVerificationSubjectByLinkType = string;
  export type EmailVerificationSubjectType = string;
  export interface EventContextDataType {
    /**
     * The source IP address of your user's device.
     */
    IpAddress?: StringType;
    /**
     * The user's device name.
     */
    DeviceName?: StringType;
    /**
     * The user's time zone.
     */
    Timezone?: StringType;
    /**
     * The user's city.
     */
    City?: StringType;
    /**
     * The user's country.
     */
    Country?: StringType;
  }
  export interface EventFeedbackType {
    /**
     * The authentication event feedback value. When you provide a FeedbackValue value of valid, you tell Amazon Cognito that you trust a user session where Amazon Cognito has evaluated some level of risk. When you provide a FeedbackValue value of invalid, you tell Amazon Cognito that you don't trust a user session, or you don't believe that Amazon Cognito evaluated a high-enough risk level.
     */
    FeedbackValue: FeedbackValueType;
    /**
     * The provider.
     */
    Provider: StringType;
    /**
     * The event feedback date.
     */
    FeedbackDate?: DateType;
  }
  export type EventFilterType = "SIGN_IN"|"PASSWORD_CHANGE"|"SIGN_UP"|string;
  export type EventFiltersType = EventFilterType[];
  export type EventIdType = string;
  export type EventResponseType = "Pass"|"Fail"|"InProgress"|string;
  export interface EventRiskType {
    /**
     * The risk decision.
     */
    RiskDecision?: RiskDecisionType;
    /**
     * The risk level.
     */
    RiskLevel?: RiskLevelType;
    /**
     * Indicates whether compromised credentials were detected during an authentication event.
     */
    CompromisedCredentialsDetected?: WrappedBooleanType;
  }
  export type EventSourceName = "userNotification"|string;
  export type EventType = "SignIn"|"SignUp"|"ForgotPassword"|"PasswordChange"|"ResendCode"|string;
  export type ExplicitAuthFlowsListType = ExplicitAuthFlowsType[];
  export type ExplicitAuthFlowsType = "ADMIN_NO_SRP_AUTH"|"CUSTOM_AUTH_FLOW_ONLY"|"USER_PASSWORD_AUTH"|"ALLOW_ADMIN_USER_PASSWORD_AUTH"|"ALLOW_CUSTOM_AUTH"|"ALLOW_USER_PASSWORD_AUTH"|"ALLOW_USER_SRP_AUTH"|"ALLOW_REFRESH_TOKEN_AUTH"|string;
  export type FeedbackValueType = "Valid"|"Invalid"|string;
  export type ForceAliasCreation = boolean;
  export interface ForgetDeviceRequest {
    /**
     * A valid access token that Amazon Cognito issued to the user whose registered device you want to forget.
     */
    AccessToken?: TokenModelType;
    /**
     * The device key.
     */
    DeviceKey: DeviceKeyType;
  }
  export interface ForgotPasswordRequest {
    /**
     * The ID of the client associated with the user pool.
     */
    ClientId: ClientIdType;
    /**
     * A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.
     */
    SecretHash?: SecretHashType;
    /**
     * Contextual data about your user session, such as the device fingerprint, IP address, or location. Amazon Cognito advanced security evaluates the risk of an authentication event based on the context that your app generates and passes to Amazon Cognito when it makes API requests.
     */
    UserContextData?: UserContextDataType;
    /**
     * The user name of the user for whom you want to enter a code to reset a forgotten password.
     */
    Username: UsernameType;
    /**
     * The Amazon Pinpoint analytics metadata that contributes to your metrics for ForgotPassword calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers. You create custom workflows by assigning Lambda functions to user pool triggers. When you use the ForgotPassword API action, Amazon Cognito invokes any functions that are assigned to the following triggers: pre sign-up, custom message, and user migration. When Amazon Cognito invokes any of these functions, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your ForgotPassword request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see  Customizing user pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  When you use the ClientMetadata parameter, remember that Amazon Cognito won't do the following:   Store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration doesn't include triggers, the ClientMetadata parameter serves no purpose.   Validate the ClientMetadata value.   Encrypt the ClientMetadata value. Don't use Amazon Cognito to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface ForgotPasswordResponse {
    /**
     * The code delivery details returned by the server in response to the request to reset a password.
     */
    CodeDeliveryDetails?: CodeDeliveryDetailsType;
  }
  export type GenerateSecret = boolean;
  export interface GetCSVHeaderRequest {
    /**
     * The user pool ID for the user pool that the users are to be imported into.
     */
    UserPoolId: UserPoolIdType;
  }
  export interface GetCSVHeaderResponse {
    /**
     * The user pool ID for the user pool that the users are to be imported into.
     */
    UserPoolId?: UserPoolIdType;
    /**
     * The header information of the CSV file for the user import job.
     */
    CSVHeader?: ListOfStringTypes;
  }
  export interface GetDeviceRequest {
    /**
     * The device key.
     */
    DeviceKey: DeviceKeyType;
    /**
     * A valid access token that Amazon Cognito issued to the user whose device information you want to request.
     */
    AccessToken?: TokenModelType;
  }
  export interface GetDeviceResponse {
    /**
     * The device.
     */
    Device: DeviceType;
  }
  export interface GetGroupRequest {
    /**
     * The name of the group.
     */
    GroupName: GroupNameType;
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: UserPoolIdType;
  }
  export interface GetGroupResponse {
    /**
     * The group object for the group.
     */
    Group?: GroupType;
  }
  export interface GetIdentityProviderByIdentifierRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The IdP identifier.
     */
    IdpIdentifier: IdpIdentifierType;
  }
  export interface GetIdentityProviderByIdentifierResponse {
    /**
     * The identity provider details.
     */
    IdentityProvider: IdentityProviderType;
  }
  export interface GetLogDeliveryConfigurationRequest {
    /**
     * The ID of the user pool where you want to view detailed activity logging configuration.
     */
    UserPoolId: UserPoolIdType;
  }
  export interface GetLogDeliveryConfigurationResponse {
    /**
     * The detailed activity logging configuration of the requested user pool.
     */
    LogDeliveryConfiguration?: LogDeliveryConfigurationType;
  }
  export interface GetSigningCertificateRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
  }
  export interface GetSigningCertificateResponse {
    /**
     * The signing certificate.
     */
    Certificate?: StringType;
  }
  export interface GetUICustomizationRequest {
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The client ID for the client app.
     */
    ClientId?: ClientIdType;
  }
  export interface GetUICustomizationResponse {
    /**
     * The UI customization information.
     */
    UICustomization: UICustomizationType;
  }
  export interface GetUserAttributeVerificationCodeRequest {
    /**
     * A non-expired access token for the user whose attribute verification code you want to generate.
     */
    AccessToken: TokenModelType;
    /**
     * The attribute name returned by the server response to get the user attribute verification code.
     */
    AttributeName: AttributeNameType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers. You create custom workflows by assigning Lambda functions to user pool triggers. When you use the GetUserAttributeVerificationCode API action, Amazon Cognito invokes the function that is assigned to the custom message trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your GetUserAttributeVerificationCode request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see  Customizing user pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  When you use the ClientMetadata parameter, remember that Amazon Cognito won't do the following:   Store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration doesn't include triggers, the ClientMetadata parameter serves no purpose.   Validate the ClientMetadata value.   Encrypt the ClientMetadata value. Don't use Amazon Cognito to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface GetUserAttributeVerificationCodeResponse {
    /**
     * The code delivery details returned by the server in response to the request to get the user attribute verification code.
     */
    CodeDeliveryDetails?: CodeDeliveryDetailsType;
  }
  export interface GetUserPoolMfaConfigRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
  }
  export interface GetUserPoolMfaConfigResponse {
    /**
     * The SMS text message multi-factor authentication (MFA) configuration.
     */
    SmsMfaConfiguration?: SmsMfaConfigType;
    /**
     * The software token multi-factor authentication (MFA) configuration.
     */
    SoftwareTokenMfaConfiguration?: SoftwareTokenMfaConfigType;
    /**
     * The multi-factor authentication (MFA) configuration. Valid values include:    OFF MFA won't be used for any users.    ON MFA is required for all users to sign in.    OPTIONAL MFA will be required only for individual users who have an MFA factor activated.  
     */
    MfaConfiguration?: UserPoolMfaType;
  }
  export interface GetUserRequest {
    /**
     * A non-expired access token for the user whose information you want to query.
     */
    AccessToken: TokenModelType;
  }
  export interface GetUserResponse {
    /**
     * The username of the user that you requested.
     */
    Username: UsernameType;
    /**
     * An array of name-value pairs representing user attributes. For custom attributes, you must prepend the custom: prefix to the attribute name.
     */
    UserAttributes: AttributeListType;
    /**
     *  This response parameter is no longer supported. It provides information only about SMS MFA configurations. It doesn't provide information about time-based one-time password (TOTP) software token MFA configurations. To look up information about either type of MFA configuration, use UserMFASettingList instead.
     */
    MFAOptions?: MFAOptionListType;
    /**
     * The user's preferred MFA setting.
     */
    PreferredMfaSetting?: StringType;
    /**
     * The MFA options that are activated for the user. The possible values in this list are SMS_MFA and SOFTWARE_TOKEN_MFA.
     */
    UserMFASettingList?: UserMFASettingListType;
  }
  export interface GlobalSignOutRequest {
    /**
     * A valid access token that Amazon Cognito issued to the user who you want to sign out.
     */
    AccessToken: TokenModelType;
  }
  export interface GlobalSignOutResponse {
  }
  export type GroupListType = GroupType[];
  export type GroupNameType = string;
  export interface GroupType {
    /**
     * The name of the group.
     */
    GroupName?: GroupNameType;
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId?: UserPoolIdType;
    /**
     * A string containing the description of the group.
     */
    Description?: DescriptionType;
    /**
     * The role Amazon Resource Name (ARN) for the group.
     */
    RoleArn?: ArnType;
    /**
     * A non-negative integer value that specifies the precedence of this group relative to the other groups that a user can belong to in the user pool. Zero is the highest precedence value. Groups with lower Precedence values take precedence over groups with higher ornull Precedence values. If a user belongs to two or more groups, it is the group with the lowest precedence value whose role ARN is given in the user's tokens for the cognito:roles and cognito:preferred_role claims. Two groups can have the same Precedence value. If this happens, neither group takes precedence over the other. If two groups with the same Precedence have the same role ARN, that role is used in the cognito:preferred_role claim in tokens for users in each group. If the two groups have different role ARNs, the cognito:preferred_role claim isn't set in users' tokens. The default Precedence value is null.
     */
    Precedence?: PrecedenceType;
    /**
     * The date and time, in ISO 8601 format, when the item was modified.
     */
    LastModifiedDate?: DateType;
    /**
     * The date and time, in ISO 8601 format, when the item was created.
     */
    CreationDate?: DateType;
  }
  export type HexStringType = string;
  export interface HttpHeader {
    /**
     * The header name.
     */
    headerName?: StringType;
    /**
     * The header value.
     */
    headerValue?: StringType;
  }
  export type HttpHeaderList = HttpHeader[];
  export type IdTokenValidityType = number;
  export interface IdentityProviderType {
    /**
     * The user pool ID.
     */
    UserPoolId?: UserPoolIdType;
    /**
     * The IdP name.
     */
    ProviderName?: ProviderNameType;
    /**
     * The IdP type.
     */
    ProviderType?: IdentityProviderTypeType;
    /**
     * The IdP details. The following list describes the provider detail keys for each IdP type.   For Google and Login with Amazon:   client_id   client_secret   authorize_scopes     For Facebook:   client_id   client_secret   authorize_scopes   api_version     For Sign in with Apple:   client_id   team_id   key_id   private_key  You can submit a private_key when you add or update an IdP. Describe operations don't return the private key.    authorize_scopes     For OIDC providers:   client_id   client_secret   attributes_request_method   oidc_issuer   authorize_scopes   The following keys are only present if Amazon Cognito didn't discover them at the oidc_issuer URL.   authorize_url    token_url    attributes_url    jwks_uri      Amazon Cognito sets the value of the following keys automatically. They are read-only.   attributes_url_add_attributes        For SAML providers:   MetadataFile or MetadataURL   IDPSignout optional     
     */
    ProviderDetails?: ProviderDetailsType;
    /**
     * A mapping of IdP attributes to standard and custom user pool attributes.
     */
    AttributeMapping?: AttributeMappingType;
    /**
     * A list of IdP identifiers.
     */
    IdpIdentifiers?: IdpIdentifiersListType;
    /**
     * The date and time, in ISO 8601 format, when the item was modified.
     */
    LastModifiedDate?: DateType;
    /**
     * The date and time, in ISO 8601 format, when the item was created.
     */
    CreationDate?: DateType;
  }
  export type IdentityProviderTypeType = "SAML"|"Facebook"|"Google"|"LoginWithAmazon"|"SignInWithApple"|"OIDC"|string;
  export type IdpIdentifierType = string;
  export type IdpIdentifiersListType = IdpIdentifierType[];
  export type ImageFileType = Buffer|Uint8Array|Blob|string;
  export type ImageUrlType = string;
  export interface InitiateAuthRequest {
    /**
     * The authentication flow for this call to run. The API action will depend on this value. For example:    REFRESH_TOKEN_AUTH takes in a valid refresh token and returns new tokens.    USER_SRP_AUTH takes in USERNAME and SRP_A and returns the SRP variables to be used for next challenge execution.    USER_PASSWORD_AUTH takes in USERNAME and PASSWORD and returns the next challenge or tokens.   Valid values include:    USER_SRP_AUTH: Authentication flow for the Secure Remote Password (SRP) protocol.    REFRESH_TOKEN_AUTH/REFRESH_TOKEN: Authentication flow for refreshing the access token and ID token by supplying a valid refresh token.    CUSTOM_AUTH: Custom authentication flow.    USER_PASSWORD_AUTH: Non-SRP authentication flow; user name and password are passed directly. If a user migration Lambda trigger is set, this flow will invoke the user migration Lambda if it doesn't find the user name in the user pool.     ADMIN_NO_SRP_AUTH isn't a valid value.
     */
    AuthFlow: AuthFlowType;
    /**
     * The authentication parameters. These are inputs corresponding to the AuthFlow that you're invoking. The required values depend on the value of AuthFlow:   For USER_SRP_AUTH: USERNAME (required), SRP_A (required), SECRET_HASH (required if the app client is configured with a client secret), DEVICE_KEY.   For USER_PASSWORD_AUTH: USERNAME (required), PASSWORD (required), SECRET_HASH (required if the app client is configured with a client secret), DEVICE_KEY.   For REFRESH_TOKEN_AUTH/REFRESH_TOKEN: REFRESH_TOKEN (required), SECRET_HASH (required if the app client is configured with a client secret), DEVICE_KEY.   For CUSTOM_AUTH: USERNAME (required), SECRET_HASH (if app client is configured with client secret), DEVICE_KEY. To start the authentication flow with password verification, include ChallengeName: SRP_A and SRP_A: (The SRP_A Value).   For more information about SECRET_HASH, see Computing secret hash values. For information about DEVICE_KEY, see Working with user devices in your user pool.
     */
    AuthParameters?: AuthParametersType;
    /**
     * A map of custom key-value pairs that you can provide as input for certain custom workflows that this action triggers. You create custom workflows by assigning Lambda functions to user pool triggers. When you use the InitiateAuth API action, Amazon Cognito invokes the Lambda functions that are specified for various triggers. The ClientMetadata value is passed as input to the functions for only the following triggers:   Pre signup   Pre authentication   User migration   When Amazon Cognito invokes the functions for these triggers, it passes a JSON payload, which the function receives as input. This payload contains a validationData attribute, which provides the data that you assigned to the ClientMetadata parameter in your InitiateAuth request. In your function code in Lambda, you can process the validationData value to enhance your workflow for your specific needs. When you use the InitiateAuth API action, Amazon Cognito also invokes the functions for the following triggers, but it doesn't provide the ClientMetadata value as input:   Post authentication   Custom message   Pre token generation   Create auth challenge   Define auth challenge   Verify auth challenge   For more information, see  Customizing user pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  When you use the ClientMetadata parameter, remember that Amazon Cognito won't do the following:   Store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration doesn't include triggers, the ClientMetadata parameter serves no purpose.   Validate the ClientMetadata value.   Encrypt the ClientMetadata value. Don't use Amazon Cognito to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
    /**
     * The app client ID.
     */
    ClientId: ClientIdType;
    /**
     * The Amazon Pinpoint analytics metadata that contributes to your metrics for InitiateAuth calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * Contextual data about your user session, such as the device fingerprint, IP address, or location. Amazon Cognito advanced security evaluates the risk of an authentication event based on the context that your app generates and passes to Amazon Cognito when it makes API requests.
     */
    UserContextData?: UserContextDataType;
  }
  export interface InitiateAuthResponse {
    /**
     * The name of the challenge that you're responding to with this call. This name is returned in the AdminInitiateAuth response if you must pass another challenge. Valid values include the following:  All of the following challenges require USERNAME and SECRET_HASH (if applicable) in the parameters.     SMS_MFA: Next challenge is to supply an SMS_MFA_CODE, delivered via SMS.    PASSWORD_VERIFIER: Next challenge is to supply PASSWORD_CLAIM_SIGNATURE, PASSWORD_CLAIM_SECRET_BLOCK, and TIMESTAMP after the client-side SRP calculations.    CUSTOM_CHALLENGE: This is returned if your custom authentication flow determines that the user should pass another challenge before tokens are issued.    DEVICE_SRP_AUTH: If device tracking was activated on your user pool and the previous challenges were passed, this challenge is returned so that Amazon Cognito can start tracking this device.    DEVICE_PASSWORD_VERIFIER: Similar to PASSWORD_VERIFIER, but for devices only.    NEW_PASSWORD_REQUIRED: For users who are required to change their passwords after successful first login.  Respond to this challenge with NEW_PASSWORD and any required attributes that Amazon Cognito returned in the requiredAttributes parameter. You can also set values for attributes that aren't required by your user pool and that your app client can write. For more information, see RespondToAuthChallenge.  In a NEW_PASSWORD_REQUIRED challenge response, you can't modify a required attribute that already has a value. In RespondToAuthChallenge, set a value for any keys that Amazon Cognito returned in the requiredAttributes parameter, then use the UpdateUserAttributes API operation to modify the value of any additional attributes.     MFA_SETUP: For users who are required to setup an MFA factor before they can sign in. The MFA types activated for the user pool will be listed in the challenge parameters MFA_CAN_SETUP value.   To set up software token MFA, use the session returned here from InitiateAuth as an input to AssociateSoftwareToken. Use the session returned by VerifySoftwareToken as an input to RespondToAuthChallenge with challenge name MFA_SETUP to complete sign-in. To set up SMS MFA, an administrator should help the user to add a phone number to their account, and then the user should call InitiateAuth again to restart sign-in.  
     */
    ChallengeName?: ChallengeNameType;
    /**
     * The session that should pass both ways in challenge-response calls to the service. If the caller must pass another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next RespondToAuthChallenge API call.
     */
    Session?: SessionType;
    /**
     * The challenge parameters. These are returned in the InitiateAuth response if you must pass another challenge. The responses in this parameter should be used to compute inputs to the next call (RespondToAuthChallenge).  All challenges require USERNAME and SECRET_HASH (if applicable).
     */
    ChallengeParameters?: ChallengeParametersType;
    /**
     * The result of the authentication response. This result is only returned if the caller doesn't need to pass another challenge. If the caller does need to pass another challenge before it gets tokens, ChallengeName, ChallengeParameters, and Session are returned.
     */
    AuthenticationResult?: AuthenticationResultType;
  }
  export type IntegerType = number;
  export interface LambdaConfigType {
    /**
     * A pre-registration Lambda trigger.
     */
    PreSignUp?: ArnType;
    /**
     * A custom Message Lambda trigger.
     */
    CustomMessage?: ArnType;
    /**
     * A post-confirmation Lambda trigger.
     */
    PostConfirmation?: ArnType;
    /**
     * A pre-authentication Lambda trigger.
     */
    PreAuthentication?: ArnType;
    /**
     * A post-authentication Lambda trigger.
     */
    PostAuthentication?: ArnType;
    /**
     * Defines the authentication challenge.
     */
    DefineAuthChallenge?: ArnType;
    /**
     * Creates an authentication challenge.
     */
    CreateAuthChallenge?: ArnType;
    /**
     * Verifies the authentication challenge response.
     */
    VerifyAuthChallengeResponse?: ArnType;
    /**
     * A Lambda trigger that is invoked before token generation.
     */
    PreTokenGeneration?: ArnType;
    /**
     * The user migration Lambda config type.
     */
    UserMigration?: ArnType;
    /**
     * A custom SMS sender Lambda trigger.
     */
    CustomSMSSender?: CustomSMSLambdaVersionConfigType;
    /**
     * A custom email sender Lambda trigger.
     */
    CustomEmailSender?: CustomEmailLambdaVersionConfigType;
    /**
     * The Amazon Resource Name (ARN) of an KMS key. Amazon Cognito uses the key to encrypt codes and temporary passwords sent to CustomEmailSender and CustomSMSSender.
     */
    KMSKeyID?: ArnType;
  }
  export interface ListDevicesRequest {
    /**
     * A valid access token that Amazon Cognito issued to the user whose list of devices you want to view.
     */
    AccessToken: TokenModelType;
    /**
     * The limit of the device request.
     */
    Limit?: QueryLimitType;
    /**
     * The pagination token for the list request.
     */
    PaginationToken?: SearchPaginationTokenType;
  }
  export interface ListDevicesResponse {
    /**
     * The devices returned in the list devices response.
     */
    Devices?: DeviceListType;
    /**
     * The pagination token for the list device response.
     */
    PaginationToken?: SearchPaginationTokenType;
  }
  export interface ListGroupsRequest {
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The limit of the request to list groups.
     */
    Limit?: QueryLimitType;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: PaginationKey;
  }
  export interface ListGroupsResponse {
    /**
     * The group objects for the groups.
     */
    Groups?: GroupListType;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: PaginationKey;
  }
  export interface ListIdentityProvidersRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The maximum number of IdPs to return.
     */
    MaxResults?: ListProvidersLimitType;
    /**
     * A pagination token.
     */
    NextToken?: PaginationKeyType;
  }
  export interface ListIdentityProvidersResponse {
    /**
     * A list of IdP objects.
     */
    Providers: ProvidersListType;
    /**
     * A pagination token.
     */
    NextToken?: PaginationKeyType;
  }
  export type ListOfStringTypes = StringType[];
  export type ListProvidersLimitType = number;
  export type ListResourceServersLimitType = number;
  export interface ListResourceServersRequest {
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The maximum number of resource servers to return.
     */
    MaxResults?: ListResourceServersLimitType;
    /**
     * A pagination token.
     */
    NextToken?: PaginationKeyType;
  }
  export interface ListResourceServersResponse {
    /**
     * The resource servers.
     */
    ResourceServers: ResourceServersListType;
    /**
     * A pagination token.
     */
    NextToken?: PaginationKeyType;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the user pool that the tags are assigned to.
     */
    ResourceArn: ArnType;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags that are assigned to the user pool.
     */
    Tags?: UserPoolTagsType;
  }
  export interface ListUserImportJobsRequest {
    /**
     * The user pool ID for the user pool that the users are being imported into.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The maximum number of import jobs you want the request to return.
     */
    MaxResults: PoolQueryLimitType;
    /**
     * An identifier that was returned from the previous call to ListUserImportJobs, which can be used to return the next set of import jobs in the list.
     */
    PaginationToken?: PaginationKeyType;
  }
  export interface ListUserImportJobsResponse {
    /**
     * The user import jobs.
     */
    UserImportJobs?: UserImportJobsListType;
    /**
     * An identifier that can be used to return the next set of user import jobs in the list.
     */
    PaginationToken?: PaginationKeyType;
  }
  export interface ListUserPoolClientsRequest {
    /**
     * The user pool ID for the user pool where you want to list user pool clients.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The maximum number of results you want the request to return when listing the user pool clients.
     */
    MaxResults?: QueryLimit;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: PaginationKey;
  }
  export interface ListUserPoolClientsResponse {
    /**
     * The user pool clients in the response that lists user pool clients.
     */
    UserPoolClients?: UserPoolClientListType;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: PaginationKey;
  }
  export interface ListUserPoolsRequest {
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: PaginationKeyType;
    /**
     * The maximum number of results you want the request to return when listing the user pools.
     */
    MaxResults: PoolQueryLimitType;
  }
  export interface ListUserPoolsResponse {
    /**
     * The user pools from the response to list users.
     */
    UserPools?: UserPoolListType;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: PaginationKeyType;
  }
  export interface ListUsersInGroupRequest {
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The name of the group.
     */
    GroupName: GroupNameType;
    /**
     * The limit of the request to list users.
     */
    Limit?: QueryLimitType;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: PaginationKey;
  }
  export interface ListUsersInGroupResponse {
    /**
     * The users returned in the request to list users.
     */
    Users?: UsersListType;
    /**
     * An identifier that you can use in a later request to return the next set of items in the list.
     */
    NextToken?: PaginationKey;
  }
  export interface ListUsersRequest {
    /**
     * The user pool ID for the user pool on which the search should be performed.
     */
    UserPoolId: UserPoolIdType;
    /**
     * A JSON array of user attribute names, for example given_name, that you want Amazon Cognito to include in the response for each user. When you don't provide an AttributesToGet parameter, Amazon Cognito returns all attributes for each user.
     */
    AttributesToGet?: SearchedAttributeNamesListType;
    /**
     * Maximum number of users to be returned.
     */
    Limit?: QueryLimitType;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    PaginationToken?: SearchPaginationTokenType;
    /**
     * A filter string of the form "AttributeName Filter-Type "AttributeValue"". Quotation marks within the filter string must be escaped using the backslash (\) character. For example, "family_name = \"Reddy\"".    AttributeName: The name of the attribute to search for. You can only search for one attribute at a time.    Filter-Type: For an exact match, use =, for example, "given_name = \"Jon\"". For a prefix ("starts with") match, use ^=, for example, "given_name ^= \"Jon\"".     AttributeValue: The attribute value that must be matched for each user.   If the filter string is empty, ListUsers returns all users in the user pool. You can only search for the following standard attributes:    username (case-sensitive)    email     phone_number     name     given_name     family_name     preferred_username     cognito:user_status (called Status in the Console) (case-insensitive)    status (called Enabled in the Console) (case-sensitive)     sub    Custom attributes aren't searchable.  You can also list users with a client-side filter. The server-side filter matches no more than one attribute. For an advanced search, use a client-side filter with the --query parameter of the list-users action in the CLI. When you use a client-side filter, ListUsers returns a paginated list of zero or more users. You can receive multiple pages in a row with zero results. Repeat the query with each pagination token that is returned until you receive a null pagination token value, and then review the combined result.  For more information about server-side and client-side filtering, see FilteringCLI output in the Command Line Interface User Guide.   For more information, see Searching for Users Using the ListUsers API and Examples of Using the ListUsers API in the Amazon Cognito Developer Guide.
     */
    Filter?: UserFilterType;
  }
  export interface ListUsersResponse {
    /**
     * A list of the user pool users, and their attributes, that match your query.  Amazon Cognito creates a profile in your user pool for each native user in your user pool, and each unique user ID from your third-party identity providers (IdPs). When you link users with the AdminLinkProviderForUser API operation, the output of ListUsers displays both the IdP user and the native user that you linked. You can identify IdP users in the Users object of this API response by the IdP prefix that Amazon Cognito appends to Username. 
     */
    Users?: UsersListType;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    PaginationToken?: SearchPaginationTokenType;
  }
  export type LogConfigurationListType = LogConfigurationType[];
  export interface LogConfigurationType {
    /**
     * The errorlevel selection of logs that a user pool sends for detailed activity logging.
     */
    LogLevel: LogLevel;
    /**
     * The source of events that your user pool sends for detailed activity logging.
     */
    EventSource: EventSourceName;
    /**
     * The CloudWatch logging destination of a user pool.
     */
    CloudWatchLogsConfiguration?: CloudWatchLogsConfigurationType;
  }
  export interface LogDeliveryConfigurationType {
    /**
     * The ID of the user pool where you configured detailed activity logging.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The detailed activity logging destination of a user pool.
     */
    LogConfigurations: LogConfigurationListType;
  }
  export type LogLevel = "ERROR"|string;
  export type LogoutURLsListType = RedirectUrlType[];
  export type LongType = number;
  export type MFAOptionListType = MFAOptionType[];
  export interface MFAOptionType {
    /**
     * The delivery medium to send the MFA code. You can use this parameter to set only the SMS delivery medium value.
     */
    DeliveryMedium?: DeliveryMediumType;
    /**
     * The attribute name of the MFA option type. The only valid value is phone_number.
     */
    AttributeName?: AttributeNameType;
  }
  export type MessageActionType = "RESEND"|"SUPPRESS"|string;
  export interface MessageTemplateType {
    /**
     * The message template for SMS messages.
     */
    SMSMessage?: SmsVerificationMessageType;
    /**
     * The message template for email messages. EmailMessage is allowed only if EmailSendingAccount is DEVELOPER. 
     */
    EmailMessage?: EmailVerificationMessageType;
    /**
     * The subject line for email messages. EmailSubject is allowed only if EmailSendingAccount is DEVELOPER. 
     */
    EmailSubject?: EmailVerificationSubjectType;
  }
  export interface NewDeviceMetadataType {
    /**
     * The device key.
     */
    DeviceKey?: DeviceKeyType;
    /**
     * The device group key.
     */
    DeviceGroupKey?: StringType;
  }
  export interface NotifyConfigurationType {
    /**
     * The email address that is sending the email. The address must be either individually verified with Amazon Simple Email Service, or from a domain that has been verified with Amazon SES.
     */
    From?: StringType;
    /**
     * The destination to which the receiver of an email should reply to.
     */
    ReplyTo?: StringType;
    /**
     * The Amazon Resource Name (ARN) of the identity that is associated with the sending authorization policy. This identity permits Amazon Cognito to send for the email address specified in the From parameter.
     */
    SourceArn: ArnType;
    /**
     * Email template used when a detected risk event is blocked.
     */
    BlockEmail?: NotifyEmailType;
    /**
     * The email template used when a detected risk event is allowed.
     */
    NoActionEmail?: NotifyEmailType;
    /**
     * The multi-factor authentication (MFA) email template used when MFA is challenged as part of a detected risk.
     */
    MfaEmail?: NotifyEmailType;
  }
  export interface NotifyEmailType {
    /**
     * The email subject.
     */
    Subject: EmailNotificationSubjectType;
    /**
     * The email HTML body.
     */
    HtmlBody?: EmailNotificationBodyType;
    /**
     * The email text body.
     */
    TextBody?: EmailNotificationBodyType;
  }
  export interface NumberAttributeConstraintsType {
    /**
     * The minimum value of an attribute that is of the number data type.
     */
    MinValue?: StringType;
    /**
     * The maximum value of an attribute that is of the number data type.
     */
    MaxValue?: StringType;
  }
  export type OAuthFlowType = "code"|"implicit"|"client_credentials"|string;
  export type OAuthFlowsType = OAuthFlowType[];
  export type PaginationKey = string;
  export type PaginationKeyType = string;
  export type PasswordPolicyMinLengthType = number;
  export interface PasswordPolicyType {
    /**
     * The minimum length of the password in the policy that you have set. This value can't be less than 6.
     */
    MinimumLength?: PasswordPolicyMinLengthType;
    /**
     * In the password policy that you have set, refers to whether you have required users to use at least one uppercase letter in their password.
     */
    RequireUppercase?: BooleanType;
    /**
     * In the password policy that you have set, refers to whether you have required users to use at least one lowercase letter in their password.
     */
    RequireLowercase?: BooleanType;
    /**
     * In the password policy that you have set, refers to whether you have required users to use at least one number in their password.
     */
    RequireNumbers?: BooleanType;
    /**
     * In the password policy that you have set, refers to whether you have required users to use at least one symbol in their password.
     */
    RequireSymbols?: BooleanType;
    /**
     * The number of days a temporary password is valid in the password policy. If the user doesn't sign in during this time, an administrator must reset their password.  When you set TemporaryPasswordValidityDays for a user pool, you can no longer set a value for the legacy UnusedAccountValidityDays parameter in that user pool. 
     */
    TemporaryPasswordValidityDays?: TemporaryPasswordValidityDaysType;
  }
  export type PasswordType = string;
  export type PoolQueryLimitType = number;
  export type PreSignedUrlType = string;
  export type PrecedenceType = number;
  export type PreventUserExistenceErrorTypes = "LEGACY"|"ENABLED"|string;
  export type PriorityType = number;
  export interface ProviderDescription {
    /**
     * The IdP name.
     */
    ProviderName?: ProviderNameType;
    /**
     * The IdP type.
     */
    ProviderType?: IdentityProviderTypeType;
    /**
     * The date the provider was last modified.
     */
    LastModifiedDate?: DateType;
    /**
     * The date and time, in ISO 8601 format, when the item was created.
     */
    CreationDate?: DateType;
  }
  export type ProviderDetailsType = {[key: string]: StringType};
  export type ProviderNameType = string;
  export type ProviderNameTypeV2 = string;
  export interface ProviderUserIdentifierType {
    /**
     * The name of the provider, such as Facebook, Google, or Login with Amazon.
     */
    ProviderName?: ProviderNameType;
    /**
     * The name of the provider attribute to link to, such as NameID.
     */
    ProviderAttributeName?: StringType;
    /**
     * The value of the provider attribute to link to, such as xxxxx_account.
     */
    ProviderAttributeValue?: StringType;
  }
  export type ProvidersListType = ProviderDescription[];
  export type QueryLimit = number;
  export type QueryLimitType = number;
  export type RecoveryMechanismsType = RecoveryOptionType[];
  export type RecoveryOptionNameType = "verified_email"|"verified_phone_number"|"admin_only"|string;
  export interface RecoveryOptionType {
    /**
     * A positive integer specifying priority of a method with 1 being the highest priority.
     */
    Priority: PriorityType;
    /**
     * The recovery method for a user.
     */
    Name: RecoveryOptionNameType;
  }
  export type RedirectUrlType = string;
  export type RefreshTokenValidityType = number;
  export type RegionCodeType = string;
  export interface ResendConfirmationCodeRequest {
    /**
     * The ID of the client associated with the user pool.
     */
    ClientId: ClientIdType;
    /**
     * A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.
     */
    SecretHash?: SecretHashType;
    /**
     * Contextual data about your user session, such as the device fingerprint, IP address, or location. Amazon Cognito advanced security evaluates the risk of an authentication event based on the context that your app generates and passes to Amazon Cognito when it makes API requests.
     */
    UserContextData?: UserContextDataType;
    /**
     * The username attribute of the user to whom you want to resend a confirmation code.
     */
    Username: UsernameType;
    /**
     * The Amazon Pinpoint analytics metadata that contributes to your metrics for ResendConfirmationCode calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers. You create custom workflows by assigning Lambda functions to user pool triggers. When you use the ResendConfirmationCode API action, Amazon Cognito invokes the function that is assigned to the custom message trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your ResendConfirmationCode request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see  Customizing user pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  When you use the ClientMetadata parameter, remember that Amazon Cognito won't do the following:   Store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration doesn't include triggers, the ClientMetadata parameter serves no purpose.   Validate the ClientMetadata value.   Encrypt the ClientMetadata value. Don't use Amazon Cognito to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface ResendConfirmationCodeResponse {
    /**
     * The code delivery details returned by the server in response to the request to resend the confirmation code.
     */
    CodeDeliveryDetails?: CodeDeliveryDetailsType;
  }
  export type ResourceServerIdentifierType = string;
  export type ResourceServerNameType = string;
  export type ResourceServerScopeDescriptionType = string;
  export type ResourceServerScopeListType = ResourceServerScopeType[];
  export type ResourceServerScopeNameType = string;
  export interface ResourceServerScopeType {
    /**
     * The name of the scope.
     */
    ScopeName: ResourceServerScopeNameType;
    /**
     * A description of the scope.
     */
    ScopeDescription: ResourceServerScopeDescriptionType;
  }
  export interface ResourceServerType {
    /**
     * The user pool ID for the user pool that hosts the resource server.
     */
    UserPoolId?: UserPoolIdType;
    /**
     * The identifier for the resource server.
     */
    Identifier?: ResourceServerIdentifierType;
    /**
     * The name of the resource server.
     */
    Name?: ResourceServerNameType;
    /**
     * A list of scopes that are defined for the resource server.
     */
    Scopes?: ResourceServerScopeListType;
  }
  export type ResourceServersListType = ResourceServerType[];
  export interface RespondToAuthChallengeRequest {
    /**
     * The app client ID.
     */
    ClientId: ClientIdType;
    /**
     * The challenge name. For more information, see InitiateAuth.  ADMIN_NO_SRP_AUTH isn't a valid value.
     */
    ChallengeName: ChallengeNameType;
    /**
     * The session that should be passed both ways in challenge-response calls to the service. If InitiateAuth or RespondToAuthChallenge API call determines that the caller must pass another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next RespondToAuthChallenge API call.
     */
    Session?: SessionType;
    /**
     * The challenge responses. These are inputs corresponding to the value of ChallengeName, for example:   SECRET_HASH (if app client is configured with client secret) applies to all of the inputs that follow (including SOFTWARE_TOKEN_MFA).     SMS_MFA: SMS_MFA_CODE, USERNAME.    PASSWORD_VERIFIER: PASSWORD_CLAIM_SIGNATURE, PASSWORD_CLAIM_SECRET_BLOCK, TIMESTAMP, USERNAME.   PASSWORD_VERIFIER requires DEVICE_KEY when you sign in with a remembered device.     NEW_PASSWORD_REQUIRED: NEW_PASSWORD, USERNAME, SECRET_HASH (if app client is configured with client secret). To set any required attributes that Amazon Cognito returned as requiredAttributes in the InitiateAuth response, add a userAttributes.attributename  parameter. This parameter can also set values for writable attributes that aren't required by your user pool.  In a NEW_PASSWORD_REQUIRED challenge response, you can't modify a required attribute that already has a value. In RespondToAuthChallenge, set a value for any keys that Amazon Cognito returned in the requiredAttributes parameter, then use the UpdateUserAttributes API operation to modify the value of any additional attributes.     SOFTWARE_TOKEN_MFA: USERNAME and SOFTWARE_TOKEN_MFA_CODE are required attributes.    DEVICE_SRP_AUTH requires USERNAME, DEVICE_KEY, SRP_A (and SECRET_HASH).    DEVICE_PASSWORD_VERIFIER requires everything that PASSWORD_VERIFIER requires, plus DEVICE_KEY.    MFA_SETUP requires USERNAME, plus you must use the session value returned by VerifySoftwareToken in the Session parameter.   For more information about SECRET_HASH, see Computing secret hash values. For information about DEVICE_KEY, see Working with user devices in your user pool.
     */
    ChallengeResponses?: ChallengeResponsesType;
    /**
     * The Amazon Pinpoint analytics metadata that contributes to your metrics for RespondToAuthChallenge calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * Contextual data about your user session, such as the device fingerprint, IP address, or location. Amazon Cognito advanced security evaluates the risk of an authentication event based on the context that your app generates and passes to Amazon Cognito when it makes API requests.
     */
    UserContextData?: UserContextDataType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers. You create custom workflows by assigning Lambda functions to user pool triggers. When you use the RespondToAuthChallenge API action, Amazon Cognito invokes any functions that are assigned to the following triggers: post authentication, pre token generation, define auth challenge, create auth challenge, and verify auth challenge. When Amazon Cognito invokes any of these functions, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your RespondToAuthChallenge request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see  Customizing user pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  When you use the ClientMetadata parameter, remember that Amazon Cognito won't do the following:   Store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration doesn't include triggers, the ClientMetadata parameter serves no purpose.   Validate the ClientMetadata value.   Encrypt the ClientMetadata value. Don't use Amazon Cognito to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface RespondToAuthChallengeResponse {
    /**
     * The challenge name. For more information, see InitiateAuth.
     */
    ChallengeName?: ChallengeNameType;
    /**
     * The session that should be passed both ways in challenge-response calls to the service. If the caller must pass another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next RespondToAuthChallenge API call.
     */
    Session?: SessionType;
    /**
     * The challenge parameters. For more information, see InitiateAuth.
     */
    ChallengeParameters?: ChallengeParametersType;
    /**
     * The result returned by the server in response to the request to respond to the authentication challenge.
     */
    AuthenticationResult?: AuthenticationResultType;
  }
  export interface RevokeTokenRequest {
    /**
     * The refresh token that you want to revoke.
     */
    Token: TokenModelType;
    /**
     * The client ID for the token that you want to revoke.
     */
    ClientId: ClientIdType;
    /**
     * The secret for the client ID. This is required only if the client ID has a secret.
     */
    ClientSecret?: ClientSecretType;
  }
  export interface RevokeTokenResponse {
  }
  export interface RiskConfigurationType {
    /**
     * The user pool ID.
     */
    UserPoolId?: UserPoolIdType;
    /**
     * The app client ID.
     */
    ClientId?: ClientIdType;
    /**
     * The compromised credentials risk configuration object, including the EventFilter and the EventAction.
     */
    CompromisedCredentialsRiskConfiguration?: CompromisedCredentialsRiskConfigurationType;
    /**
     * The account takeover risk configuration object, including the NotifyConfiguration object and Actions to take if there is an account takeover.
     */
    AccountTakeoverRiskConfiguration?: AccountTakeoverRiskConfigurationType;
    /**
     * The configuration to override the risk decision.
     */
    RiskExceptionConfiguration?: RiskExceptionConfigurationType;
    /**
     * The date and time, in ISO 8601 format, when the item was modified.
     */
    LastModifiedDate?: DateType;
  }
  export type RiskDecisionType = "NoRisk"|"AccountTakeover"|"Block"|string;
  export interface RiskExceptionConfigurationType {
    /**
     * Overrides the risk decision to always block the pre-authentication requests. The IP range is in CIDR notation, a compact representation of an IP address and its routing prefix.
     */
    BlockedIPRangeList?: BlockedIPRangeListType;
    /**
     * Risk detection isn't performed on the IP addresses in this range list. The IP range is in CIDR notation.
     */
    SkippedIPRangeList?: SkippedIPRangeListType;
  }
  export type RiskLevelType = "Low"|"Medium"|"High"|string;
  export type S3BucketType = string;
  export type SESConfigurationSet = string;
  export interface SMSMfaSettingsType {
    /**
     * Specifies whether SMS text message MFA is activated. If an MFA type is activated for a user, the user will be prompted for MFA during all sign-in attempts, unless device tracking is turned on and the device has been trusted.
     */
    Enabled?: BooleanType;
    /**
     * Specifies whether SMS is the preferred MFA method.
     */
    PreferredMfa?: BooleanType;
  }
  export interface SchemaAttributeType {
    /**
     * The name of your user pool attribute, for example username or custom:costcenter.
     */
    Name?: CustomAttributeNameType;
    /**
     * The data format of the values for your attribute.
     */
    AttributeDataType?: AttributeDataType;
    /**
     *  You should use WriteAttributes in the user pool client to control how attributes can be mutated for new use cases instead of using DeveloperOnlyAttribute.  Specifies whether the attribute type is developer only. This attribute can only be modified by an administrator. Users won't be able to modify this attribute using their access token. For example, DeveloperOnlyAttribute can be modified using AdminUpdateUserAttributes but can't be updated using UpdateUserAttributes.
     */
    DeveloperOnlyAttribute?: BooleanType;
    /**
     * Specifies whether the value of the attribute can be changed. Any user pool attribute whose value you map from an IdP attribute must be mutable, with a parameter value of true. Amazon Cognito updates mapped attributes when users sign in to your application through an IdP. If an attribute is immutable, Amazon Cognito throws an error when it attempts to update the attribute. For more information, see Specifying Identity Provider Attribute Mappings for Your User Pool.
     */
    Mutable?: BooleanType;
    /**
     * Specifies whether a user pool attribute is required. If the attribute is required and the user doesn't provide a value, registration or sign-in will fail.
     */
    Required?: BooleanType;
    /**
     * Specifies the constraints for an attribute of the number type.
     */
    NumberAttributeConstraints?: NumberAttributeConstraintsType;
    /**
     * Specifies the constraints for an attribute of the string type.
     */
    StringAttributeConstraints?: StringAttributeConstraintsType;
  }
  export type SchemaAttributesListType = SchemaAttributeType[];
  export type ScopeListType = ScopeType[];
  export type ScopeType = string;
  export type SearchPaginationTokenType = string;
  export type SearchedAttributeNamesListType = AttributeNameType[];
  export type SecretCodeType = string;
  export type SecretHashType = string;
  export type SessionType = string;
  export interface SetLogDeliveryConfigurationRequest {
    /**
     * The ID of the user pool where you want to configure detailed activity logging .
     */
    UserPoolId: UserPoolIdType;
    /**
     * A collection of all of the detailed activity logging configurations for a user pool.
     */
    LogConfigurations: LogConfigurationListType;
  }
  export interface SetLogDeliveryConfigurationResponse {
    /**
     * The detailed activity logging configuration that you applied to the requested user pool.
     */
    LogDeliveryConfiguration?: LogDeliveryConfigurationType;
  }
  export interface SetRiskConfigurationRequest {
    /**
     * The user pool ID. 
     */
    UserPoolId: UserPoolIdType;
    /**
     * The app client ID. If ClientId is null, then the risk configuration is mapped to userPoolId. When the client ID is null, the same risk configuration is applied to all the clients in the userPool. Otherwise, ClientId is mapped to the client. When the client ID isn't null, the user pool configuration is overridden and the risk configuration for the client is used instead.
     */
    ClientId?: ClientIdType;
    /**
     * The compromised credentials risk configuration.
     */
    CompromisedCredentialsRiskConfiguration?: CompromisedCredentialsRiskConfigurationType;
    /**
     * The account takeover risk configuration.
     */
    AccountTakeoverRiskConfiguration?: AccountTakeoverRiskConfigurationType;
    /**
     * The configuration to override the risk decision.
     */
    RiskExceptionConfiguration?: RiskExceptionConfigurationType;
  }
  export interface SetRiskConfigurationResponse {
    /**
     * The risk configuration.
     */
    RiskConfiguration: RiskConfigurationType;
  }
  export interface SetUICustomizationRequest {
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The client ID for the client app.
     */
    ClientId?: ClientIdType;
    /**
     * The CSS values in the UI customization.
     */
    CSS?: CSSType;
    /**
     * The uploaded logo image for the UI customization.
     */
    ImageFile?: ImageFileType;
  }
  export interface SetUICustomizationResponse {
    /**
     * The UI customization information.
     */
    UICustomization: UICustomizationType;
  }
  export interface SetUserMFAPreferenceRequest {
    /**
     * The SMS text message multi-factor authentication (MFA) settings.
     */
    SMSMfaSettings?: SMSMfaSettingsType;
    /**
     * The time-based one-time password (TOTP) software token MFA settings.
     */
    SoftwareTokenMfaSettings?: SoftwareTokenMfaSettingsType;
    /**
     * A valid access token that Amazon Cognito issued to the user whose MFA preference you want to set.
     */
    AccessToken: TokenModelType;
  }
  export interface SetUserMFAPreferenceResponse {
  }
  export interface SetUserPoolMfaConfigRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The SMS text message MFA configuration.
     */
    SmsMfaConfiguration?: SmsMfaConfigType;
    /**
     * The software token MFA configuration.
     */
    SoftwareTokenMfaConfiguration?: SoftwareTokenMfaConfigType;
    /**
     * The MFA configuration. If you set the MfaConfiguration value to ‘ON’, only users who have set up an MFA factor can sign in. To learn more, see Adding Multi-Factor Authentication (MFA) to a user pool. Valid values include:    OFF MFA won't be used for any users.    ON MFA is required for all users to sign in.    OPTIONAL MFA will be required only for individual users who have an MFA factor activated.  
     */
    MfaConfiguration?: UserPoolMfaType;
  }
  export interface SetUserPoolMfaConfigResponse {
    /**
     * The SMS text message MFA configuration.
     */
    SmsMfaConfiguration?: SmsMfaConfigType;
    /**
     * The software token MFA configuration.
     */
    SoftwareTokenMfaConfiguration?: SoftwareTokenMfaConfigType;
    /**
     * The MFA configuration. Valid values include:    OFF MFA won't be used for any users.    ON MFA is required for all users to sign in.    OPTIONAL MFA will be required only for individual users who have an MFA factor enabled.  
     */
    MfaConfiguration?: UserPoolMfaType;
  }
  export interface SetUserSettingsRequest {
    /**
     * A valid access token that Amazon Cognito issued to the user whose user settings you want to configure.
     */
    AccessToken: TokenModelType;
    /**
     * You can use this parameter only to set an SMS configuration that uses SMS for delivery.
     */
    MFAOptions: MFAOptionListType;
  }
  export interface SetUserSettingsResponse {
  }
  export interface SignUpRequest {
    /**
     * The ID of the client associated with the user pool.
     */
    ClientId: ClientIdType;
    /**
     * A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.
     */
    SecretHash?: SecretHashType;
    /**
     * The user name of the user you want to register.
     */
    Username: UsernameType;
    /**
     * The password of the user you want to register.
     */
    Password: PasswordType;
    /**
     * An array of name-value pairs representing user attributes. For custom attributes, you must prepend the custom: prefix to the attribute name.
     */
    UserAttributes?: AttributeListType;
    /**
     * The validation data in the request to register a user.
     */
    ValidationData?: AttributeListType;
    /**
     * The Amazon Pinpoint analytics metadata that contributes to your metrics for SignUp calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * Contextual data about your user session, such as the device fingerprint, IP address, or location. Amazon Cognito advanced security evaluates the risk of an authentication event based on the context that your app generates and passes to Amazon Cognito when it makes API requests.
     */
    UserContextData?: UserContextDataType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers. You create custom workflows by assigning Lambda functions to user pool triggers. When you use the SignUp API action, Amazon Cognito invokes any functions that are assigned to the following triggers: pre sign-up, custom message, and post confirmation. When Amazon Cognito invokes any of these functions, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your SignUp request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see  Customizing user pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  When you use the ClientMetadata parameter, remember that Amazon Cognito won't do the following:   Store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration doesn't include triggers, the ClientMetadata parameter serves no purpose.   Validate the ClientMetadata value.   Encrypt the ClientMetadata value. Don't use Amazon Cognito to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface SignUpResponse {
    /**
     * A response from the server indicating that a user registration has been confirmed.
     */
    UserConfirmed: BooleanType;
    /**
     * The code delivery details returned by the server response to the user registration request.
     */
    CodeDeliveryDetails?: CodeDeliveryDetailsType;
    /**
     * The UUID of the authenticated user. This isn't the same as username.
     */
    UserSub: StringType;
  }
  export type SkippedIPRangeListType = StringType[];
  export interface SmsConfigurationType {
    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS caller. This is the ARN of the IAM role in your Amazon Web Services account that Amazon Cognito will use to send SMS messages. SMS messages are subject to a spending limit. 
     */
    SnsCallerArn: ArnType;
    /**
     * The external ID provides additional security for your IAM role. You can use an ExternalId with the IAM role that you use with Amazon SNS to send SMS messages for your user pool. If you provide an ExternalId, your Amazon Cognito user pool includes it in the request to assume your IAM role. You can configure the role trust policy to require that Amazon Cognito, and any principal, provide the ExternalID. If you use the Amazon Cognito Management Console to create a role for SMS multi-factor authentication (MFA), Amazon Cognito creates a role with the required permissions and a trust policy that demonstrates use of the ExternalId. For more information about the ExternalId of a role, see How to use an external ID when granting access to your Amazon Web Services resources to a third party 
     */
    ExternalId?: StringType;
    /**
     * The Amazon Web Services Region to use with Amazon SNS integration. You can choose the same Region as your user pool, or a supported Legacy Amazon SNS alternate Region.   Amazon Cognito resources in the Asia Pacific (Seoul) Amazon Web Services Region must use your Amazon SNS configuration in the Asia Pacific (Tokyo) Region. For more information, see SMS message settings for Amazon Cognito user pools.
     */
    SnsRegion?: RegionCodeType;
  }
  export interface SmsMfaConfigType {
    /**
     * The SMS authentication message that will be sent to users with the code they must sign in. The message must contain the ‘{####}’ placeholder, which is replaced with the code. If the message isn't included, and default message will be used.
     */
    SmsAuthenticationMessage?: SmsVerificationMessageType;
    /**
     * The SMS configuration with the settings that your Amazon Cognito user pool must use to send an SMS message from your Amazon Web Services account through Amazon Simple Notification Service. To request Amazon SNS in the Amazon Web Services Region that you want, the Amazon Cognito user pool uses an Identity and Access Management (IAM) role that you provide for your Amazon Web Services account.
     */
    SmsConfiguration?: SmsConfigurationType;
  }
  export type SmsVerificationMessageType = string;
  export type SoftwareTokenMFAUserCodeType = string;
  export interface SoftwareTokenMfaConfigType {
    /**
     * Specifies whether software token MFA is activated.
     */
    Enabled?: BooleanType;
  }
  export interface SoftwareTokenMfaSettingsType {
    /**
     * Specifies whether software token MFA is activated. If an MFA type is activated for a user, the user will be prompted for MFA during all sign-in attempts, unless device tracking is turned on and the device has been trusted.
     */
    Enabled?: BooleanType;
    /**
     * Specifies whether software token MFA is the preferred MFA method.
     */
    PreferredMfa?: BooleanType;
  }
  export interface StartUserImportJobRequest {
    /**
     * The user pool ID for the user pool that the users are being imported into.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The job ID for the user import job.
     */
    JobId: UserImportJobIdType;
  }
  export interface StartUserImportJobResponse {
    /**
     * The job object that represents the user import job.
     */
    UserImportJob?: UserImportJobType;
  }
  export type StatusType = "Enabled"|"Disabled"|string;
  export interface StopUserImportJobRequest {
    /**
     * The user pool ID for the user pool that the users are being imported into.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The job ID for the user import job.
     */
    JobId: UserImportJobIdType;
  }
  export interface StopUserImportJobResponse {
    /**
     * The job object that represents the user import job.
     */
    UserImportJob?: UserImportJobType;
  }
  export interface StringAttributeConstraintsType {
    /**
     * The minimum length.
     */
    MinLength?: StringType;
    /**
     * The maximum length.
     */
    MaxLength?: StringType;
  }
  export type StringType = string;
  export type SupportedIdentityProvidersListType = ProviderNameType[];
  export type TagKeysType = string;
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the user pool to assign the tags to.
     */
    ResourceArn: ArnType;
    /**
     * The tags to assign to the user pool.
     */
    Tags: UserPoolTagsType;
  }
  export interface TagResourceResponse {
  }
  export type TagValueType = string;
  export type TemporaryPasswordValidityDaysType = number;
  export type TimeUnitsType = "seconds"|"minutes"|"hours"|"days"|string;
  export type TokenModelType = string;
  export interface TokenValidityUnitsType {
    /**
     *  A time unit of seconds, minutes, hours, or days for the value that you set in the AccessTokenValidity parameter. The default AccessTokenValidity time unit is hours. AccessTokenValidity duration can range from five minutes to one day.
     */
    AccessToken?: TimeUnitsType;
    /**
     * A time unit of seconds, minutes, hours, or days for the value that you set in the IdTokenValidity parameter. The default IdTokenValidity time unit is hours. IdTokenValidity duration can range from five minutes to one day.
     */
    IdToken?: TimeUnitsType;
    /**
     * A time unit of seconds, minutes, hours, or days for the value that you set in the RefreshTokenValidity parameter. The default RefreshTokenValidity time unit is days. RefreshTokenValidity duration can range from 60 minutes to 10 years.
     */
    RefreshToken?: TimeUnitsType;
  }
  export interface UICustomizationType {
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId?: UserPoolIdType;
    /**
     * The client ID for the client app.
     */
    ClientId?: ClientIdType;
    /**
     * The logo image for the UI customization.
     */
    ImageUrl?: ImageUrlType;
    /**
     * The CSS values in the UI customization.
     */
    CSS?: CSSType;
    /**
     * The CSS version number.
     */
    CSSVersion?: CSSVersionType;
    /**
     * The date and time, in ISO 8601 format, when the item was modified.
     */
    LastModifiedDate?: DateType;
    /**
     * The date and time, in ISO 8601 format, when the item was created.
     */
    CreationDate?: DateType;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the user pool that the tags are assigned to.
     */
    ResourceArn: ArnType;
    /**
     * The keys of the tags to remove from the user pool.
     */
    TagKeys: UserPoolTagsListType;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAuthEventFeedbackRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user pool username.
     */
    Username: UsernameType;
    /**
     * The event ID.
     */
    EventId: EventIdType;
    /**
     * The feedback token.
     */
    FeedbackToken: TokenModelType;
    /**
     * The authentication event feedback value. When you provide a FeedbackValue value of valid, you tell Amazon Cognito that you trust a user session where Amazon Cognito has evaluated some level of risk. When you provide a FeedbackValue value of invalid, you tell Amazon Cognito that you don't trust a user session, or you don't believe that Amazon Cognito evaluated a high-enough risk level.
     */
    FeedbackValue: FeedbackValueType;
  }
  export interface UpdateAuthEventFeedbackResponse {
  }
  export interface UpdateDeviceStatusRequest {
    /**
     * A valid access token that Amazon Cognito issued to the user whose device status you want to update.
     */
    AccessToken: TokenModelType;
    /**
     * The device key.
     */
    DeviceKey: DeviceKeyType;
    /**
     * The status of whether a device is remembered.
     */
    DeviceRememberedStatus?: DeviceRememberedStatusType;
  }
  export interface UpdateDeviceStatusResponse {
  }
  export interface UpdateGroupRequest {
    /**
     * The name of the group.
     */
    GroupName: GroupNameType;
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: UserPoolIdType;
    /**
     * A string containing the new description of the group.
     */
    Description?: DescriptionType;
    /**
     * The new role Amazon Resource Name (ARN) for the group. This is used for setting the cognito:roles and cognito:preferred_role claims in the token.
     */
    RoleArn?: ArnType;
    /**
     * The new precedence value for the group. For more information about this parameter, see CreateGroup.
     */
    Precedence?: PrecedenceType;
  }
  export interface UpdateGroupResponse {
    /**
     * The group object for the group.
     */
    Group?: GroupType;
  }
  export interface UpdateIdentityProviderRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The IdP name.
     */
    ProviderName: ProviderNameType;
    /**
     * The IdP details to be updated, such as MetadataURL and MetadataFile.
     */
    ProviderDetails?: ProviderDetailsType;
    /**
     * The IdP attribute mapping to be changed.
     */
    AttributeMapping?: AttributeMappingType;
    /**
     * A list of IdP identifiers.
     */
    IdpIdentifiers?: IdpIdentifiersListType;
  }
  export interface UpdateIdentityProviderResponse {
    /**
     * The identity provider details.
     */
    IdentityProvider: IdentityProviderType;
  }
  export interface UpdateResourceServerRequest {
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The identifier for the resource server.
     */
    Identifier: ResourceServerIdentifierType;
    /**
     * The name of the resource server.
     */
    Name: ResourceServerNameType;
    /**
     * The scope values to be set for the resource server.
     */
    Scopes?: ResourceServerScopeListType;
  }
  export interface UpdateResourceServerResponse {
    /**
     * The resource server.
     */
    ResourceServer: ResourceServerType;
  }
  export interface UpdateUserAttributesRequest {
    /**
     * An array of name-value pairs representing user attributes. For custom attributes, you must prepend the custom: prefix to the attribute name. If you have set an attribute to require verification before Amazon Cognito updates its value, this request doesn’t immediately update the value of that attribute. After your user receives and responds to a verification message to verify the new value, Amazon Cognito updates the attribute value. Your user can sign in and receive messages with the original attribute value until they verify the new value.
     */
    UserAttributes: AttributeListType;
    /**
     * A valid access token that Amazon Cognito issued to the user whose user attributes you want to update.
     */
    AccessToken: TokenModelType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action initiates.  You create custom workflows by assigning Lambda functions to user pool triggers. When you use the UpdateUserAttributes API action, Amazon Cognito invokes the function that is assigned to the custom message trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your UpdateUserAttributes request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see  Customizing user pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  When you use the ClientMetadata parameter, remember that Amazon Cognito won't do the following:   Store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration doesn't include triggers, the ClientMetadata parameter serves no purpose.   Validate the ClientMetadata value.   Encrypt the ClientMetadata value. Don't use Amazon Cognito to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface UpdateUserAttributesResponse {
    /**
     * The code delivery details list from the server for the request to update user attributes.
     */
    CodeDeliveryDetailsList?: CodeDeliveryDetailsListType;
  }
  export interface UpdateUserPoolClientRequest {
    /**
     * The user pool ID for the user pool where you want to update the user pool client.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The ID of the client associated with the user pool.
     */
    ClientId: ClientIdType;
    /**
     * The client name from the update user pool client request.
     */
    ClientName?: ClientNameType;
    /**
     * The refresh token time limit. After this limit expires, your user can't use their refresh token. To specify the time unit for RefreshTokenValidity as seconds, minutes, hours, or days, set a TokenValidityUnits value in your API request. For example, when you set RefreshTokenValidity as 10 and TokenValidityUnits as days, your user can refresh their session and retrieve new access and ID tokens for 10 days. The default time unit for RefreshTokenValidity in an API request is days. You can't set RefreshTokenValidity to 0. If you do, Amazon Cognito overrides the value with the default value of 30 days. Valid range is displayed below in seconds. If you don't specify otherwise in the configuration of your app client, your refresh tokens are valid for 30 days.
     */
    RefreshTokenValidity?: RefreshTokenValidityType;
    /**
     * The access token time limit. After this limit expires, your user can't use their access token. To specify the time unit for AccessTokenValidity as seconds, minutes, hours, or days, set a TokenValidityUnits value in your API request. For example, when you set AccessTokenValidity to 10 and TokenValidityUnits to hours, your user can authorize access with their access token for 10 hours. The default time unit for AccessTokenValidity in an API request is hours. Valid range is displayed below in seconds. If you don't specify otherwise in the configuration of your app client, your access tokens are valid for one hour.
     */
    AccessTokenValidity?: AccessTokenValidityType;
    /**
     * The ID token time limit. After this limit expires, your user can't use their ID token. To specify the time unit for IdTokenValidity as seconds, minutes, hours, or days, set a TokenValidityUnits value in your API request. For example, when you set IdTokenValidity as 10 and TokenValidityUnits as hours, your user can authenticate their session with their ID token for 10 hours. The default time unit for IdTokenValidity in an API request is hours. Valid range is displayed below in seconds. If you don't specify otherwise in the configuration of your app client, your ID tokens are valid for one hour.
     */
    IdTokenValidity?: IdTokenValidityType;
    /**
     * The time units you use when you set the duration of ID, access, and refresh tokens. The default unit for RefreshToken is days, and the default for ID and access tokens is hours.
     */
    TokenValidityUnits?: TokenValidityUnitsType;
    /**
     * The read-only attributes of the user pool.
     */
    ReadAttributes?: ClientPermissionListType;
    /**
     * The writeable attributes of the user pool.
     */
    WriteAttributes?: ClientPermissionListType;
    /**
     * The authentication flows that you want your user pool client to support. For each app client in your user pool, you can sign in your users with any combination of one or more flows, including with a user name and Secure Remote Password (SRP), a user name and password, or a custom authentication process that you define with Lambda functions.  If you don't specify a value for ExplicitAuthFlows, your user client supports ALLOW_REFRESH_TOKEN_AUTH, ALLOW_USER_SRP_AUTH, and ALLOW_CUSTOM_AUTH.  Valid values include:    ALLOW_ADMIN_USER_PASSWORD_AUTH: Enable admin based user password authentication flow ADMIN_USER_PASSWORD_AUTH. This setting replaces the ADMIN_NO_SRP_AUTH setting. With this authentication flow, your app passes a user name and password to Amazon Cognito in the request, instead of using the Secure Remote Password (SRP) protocol to securely transmit the password.    ALLOW_CUSTOM_AUTH: Enable Lambda trigger based authentication.    ALLOW_USER_PASSWORD_AUTH: Enable user password-based authentication. In this flow, Amazon Cognito receives the password in the request instead of using the SRP protocol to verify passwords.    ALLOW_USER_SRP_AUTH: Enable SRP-based authentication.    ALLOW_REFRESH_TOKEN_AUTH: Enable authflow to refresh tokens.   In some environments, you will see the values ADMIN_NO_SRP_AUTH, CUSTOM_AUTH_FLOW_ONLY, or USER_PASSWORD_AUTH. You can't assign these legacy ExplicitAuthFlows values to user pool clients at the same time as values that begin with ALLOW_, like ALLOW_USER_SRP_AUTH.
     */
    ExplicitAuthFlows?: ExplicitAuthFlowsListType;
    /**
     * A list of provider names for the IdPs that this client supports. The following are supported: COGNITO, Facebook, Google, SignInWithApple, LoginWithAmazon, and the names of your own SAML and OIDC providers.
     */
    SupportedIdentityProviders?: SupportedIdentityProvidersListType;
    /**
     * A list of allowed redirect (callback) URLs for the IdPs. A redirect URI must:   Be an absolute URI.   Be registered with the authorization server.   Not include a fragment component.   See OAuth 2.0 - Redirection Endpoint. Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only. App callback URLs such as myapp://example are also supported.
     */
    CallbackURLs?: CallbackURLsListType;
    /**
     * A list of allowed logout URLs for the IdPs.
     */
    LogoutURLs?: LogoutURLsListType;
    /**
     * The default redirect URI. Must be in the CallbackURLs list. A redirect URI must:   Be an absolute URI.   Be registered with the authorization server.   Not include a fragment component.   See OAuth 2.0 - Redirection Endpoint. Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only. App callback URLs such as myapp://example are also supported.
     */
    DefaultRedirectURI?: RedirectUrlType;
    /**
     * The allowed OAuth flows.  code  Use a code grant flow, which provides an authorization code as the response. This code can be exchanged for access tokens with the /oauth2/token endpoint.  implicit  Issue the access token (and, optionally, ID token, based on scopes) directly to your user.  client_credentials  Issue the access token from the /oauth2/token endpoint directly to a non-person user using a combination of the client ID and client secret.  
     */
    AllowedOAuthFlows?: OAuthFlowsType;
    /**
     * The allowed OAuth scopes. Possible values provided by OAuth are phone, email, openid, and profile. Possible values provided by Amazon Web Services are aws.cognito.signin.user.admin. Custom scopes created in Resource Servers are also supported.
     */
    AllowedOAuthScopes?: ScopeListType;
    /**
     * Set to true to use OAuth 2.0 features in your user pool app client.  AllowedOAuthFlowsUserPoolClient must be true before you can configure the following features in your app client.    CallBackURLs: Callback URLs.    LogoutURLs: Sign-out redirect URLs.    AllowedOAuthScopes: OAuth 2.0 scopes.    AllowedOAuthFlows: Support for authorization code, implicit, and client credentials OAuth 2.0 grants.   To use OAuth 2.0 features, configure one of these features in the Amazon Cognito console or set AllowedOAuthFlowsUserPoolClient to true in a CreateUserPoolClient or UpdateUserPoolClient API request. If you don't set a value for AllowedOAuthFlowsUserPoolClient in a request with the CLI or SDKs, it defaults to false.
     */
    AllowedOAuthFlowsUserPoolClient?: BooleanType;
    /**
     * The Amazon Pinpoint analytics configuration necessary to collect metrics for this user pool.  In Amazon Web Services Regions where Amazon Pinpoint isn't available, user pools only support sending events to Amazon Pinpoint projects in us-east-1. In Regions where Amazon Pinpoint is available, user pools support sending events to Amazon Pinpoint projects within that same Region. 
     */
    AnalyticsConfiguration?: AnalyticsConfigurationType;
    /**
     * Errors and responses that you want Amazon Cognito APIs to return during authentication, account confirmation, and password recovery when the user doesn't exist in the user pool. When set to ENABLED and the user doesn't exist, authentication returns an error indicating either the username or password was incorrect. Account confirmation and password recovery return a response indicating a code was sent to a simulated destination. When set to LEGACY, those APIs return a UserNotFoundException exception if the user doesn't exist in the user pool. Valid values include:    ENABLED - This prevents user existence-related errors.    LEGACY - This represents the early behavior of Amazon Cognito where user existence related errors aren't prevented.  
     */
    PreventUserExistenceErrors?: PreventUserExistenceErrorTypes;
    /**
     * Activates or deactivates token revocation. For more information about revoking tokens, see RevokeToken.
     */
    EnableTokenRevocation?: WrappedBooleanType;
    /**
     * Activates the propagation of additional user context data. For more information about propagation of user context data, see  Adding advanced security to a user pool. If you don’t include this parameter, you can't send device fingerprint information, including source IP address, to Amazon Cognito advanced security. You can only activate EnablePropagateAdditionalUserContextData in an app client that has a client secret.
     */
    EnablePropagateAdditionalUserContextData?: WrappedBooleanType;
    /**
     * Amazon Cognito creates a session token for each API request in an authentication flow. AuthSessionValidity is the duration, in minutes, of that session token. Your user pool native user must respond to each authentication challenge before the session expires.
     */
    AuthSessionValidity?: AuthSessionValidityType;
  }
  export interface UpdateUserPoolClientResponse {
    /**
     * The user pool client value from the response from the server when you request to update the user pool client.
     */
    UserPoolClient?: UserPoolClientType;
  }
  export interface UpdateUserPoolDomainRequest {
    /**
     * The domain name for the custom domain that hosts the sign-up and sign-in pages for your application. One example might be auth.example.com.  This string can include only lowercase letters, numbers, and hyphens. Don't use a hyphen for the first or last character. Use periods to separate subdomain names.
     */
    Domain: DomainType;
    /**
     * The ID of the user pool that is associated with the custom domain whose certificate you're updating.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The configuration for a custom domain that hosts the sign-up and sign-in pages for your application. Use this object to specify an SSL certificate that is managed by ACM.
     */
    CustomDomainConfig: CustomDomainConfigType;
  }
  export interface UpdateUserPoolDomainResponse {
    /**
     * The Amazon CloudFront endpoint that Amazon Cognito set up when you added the custom domain to your user pool.
     */
    CloudFrontDomain?: DomainType;
  }
  export interface UpdateUserPoolRequest {
    /**
     * The user pool ID for the user pool you want to update.
     */
    UserPoolId: UserPoolIdType;
    /**
     * A container with the policies you want to update in a user pool.
     */
    Policies?: UserPoolPolicyType;
    /**
     * When active, DeletionProtection prevents accidental deletion of your user pool. Before you can delete a user pool that you have protected against deletion, you must deactivate this feature. When you try to delete a protected user pool in a DeleteUserPool API request, Amazon Cognito returns an InvalidParameterException error. To delete a protected user pool, send a new DeleteUserPool request after you deactivate deletion protection in an UpdateUserPool API request.
     */
    DeletionProtection?: DeletionProtectionType;
    /**
     * The Lambda configuration information from the request to update the user pool.
     */
    LambdaConfig?: LambdaConfigType;
    /**
     * The attributes that are automatically verified when Amazon Cognito requests to update user pools.
     */
    AutoVerifiedAttributes?: VerifiedAttributesListType;
    /**
     * This parameter is no longer used. See VerificationMessageTemplateType.
     */
    SmsVerificationMessage?: SmsVerificationMessageType;
    /**
     * This parameter is no longer used. See VerificationMessageTemplateType.
     */
    EmailVerificationMessage?: EmailVerificationMessageType;
    /**
     * This parameter is no longer used. See VerificationMessageTemplateType.
     */
    EmailVerificationSubject?: EmailVerificationSubjectType;
    /**
     * The template for verification messages.
     */
    VerificationMessageTemplate?: VerificationMessageTemplateType;
    /**
     * The contents of the SMS authentication message.
     */
    SmsAuthenticationMessage?: SmsVerificationMessageType;
    /**
     * The settings for updates to user attributes. These settings include the property AttributesRequireVerificationBeforeUpdate, a user-pool setting that tells Amazon Cognito how to handle changes to the value of your users' email address and phone number attributes. For more information, see  Verifying updates to email addresses and phone numbers.
     */
    UserAttributeUpdateSettings?: UserAttributeUpdateSettingsType;
    /**
     * Possible values include:    OFF - MFA tokens aren't required and can't be specified during user registration.    ON - MFA tokens are required for all user registrations. You can only specify ON when you're initially creating a user pool. You can use the SetUserPoolMfaConfig API operation to turn MFA "ON" for existing user pools.     OPTIONAL - Users have the option when registering to create an MFA token.  
     */
    MfaConfiguration?: UserPoolMfaType;
    /**
     * The device-remembering configuration for a user pool. A null value indicates that you have deactivated device remembering in your user pool.  When you provide a value for any DeviceConfiguration field, you activate the Amazon Cognito device-remembering feature. 
     */
    DeviceConfiguration?: DeviceConfigurationType;
    /**
     * The email configuration of your user pool. The email configuration type sets your preferred sending method, Amazon Web Services Region, and sender for email invitation and verification messages from your user pool.
     */
    EmailConfiguration?: EmailConfigurationType;
    /**
     * The SMS configuration with the settings that your Amazon Cognito user pool must use to send an SMS message from your Amazon Web Services account through Amazon Simple Notification Service. To send SMS messages with Amazon SNS in the Amazon Web Services Region that you want, the Amazon Cognito user pool uses an Identity and Access Management (IAM) role in your Amazon Web Services account.
     */
    SmsConfiguration?: SmsConfigurationType;
    /**
     * The tag keys and values to assign to the user pool. A tag is a label that you can use to categorize and manage user pools in different ways, such as by purpose, owner, environment, or other criteria.
     */
    UserPoolTags?: UserPoolTagsType;
    /**
     * The configuration for AdminCreateUser requests.
     */
    AdminCreateUserConfig?: AdminCreateUserConfigType;
    /**
     * User pool add-ons. Contains settings for activation of advanced security features. To log user security information but take no action, set to AUDIT. To configure automatic security responses to risky traffic to your user pool, set to ENFORCED. For more information, see Adding advanced security to a user pool.
     */
    UserPoolAddOns?: UserPoolAddOnsType;
    /**
     * The available verified method a user can use to recover their password when they call ForgotPassword. You can use this setting to define a preferred method when a user has more than one method available. With this setting, SMS doesn't qualify for a valid password recovery mechanism if the user also has SMS multi-factor authentication (MFA) activated. In the absence of this setting, Amazon Cognito uses the legacy behavior to determine the recovery method where SMS is preferred through email.
     */
    AccountRecoverySetting?: AccountRecoverySettingType;
  }
  export interface UpdateUserPoolResponse {
  }
  export interface UserAttributeUpdateSettingsType {
    /**
     * Requires that your user verifies their email address, phone number, or both before Amazon Cognito updates the value of that attribute. When you update a user attribute that has this option activated, Amazon Cognito sends a verification message to the new phone number or email address. Amazon Cognito doesn’t change the value of the attribute until your user responds to the verification message and confirms the new value. You can verify an updated email address or phone number with a VerifyUserAttribute API request. You can also call the AdminUpdateUserAttributes API and set email_verified or phone_number_verified to true. When AttributesRequireVerificationBeforeUpdate is false, your user pool doesn't require that your users verify attribute changes before Amazon Cognito updates them. In a user pool where AttributesRequireVerificationBeforeUpdate is false, API operations that change attribute values can immediately update a user’s email or phone_number attribute.
     */
    AttributesRequireVerificationBeforeUpdate?: AttributesRequireVerificationBeforeUpdateType;
  }
  export interface UserContextDataType {
    /**
     * The source IP address of your user's device.
     */
    IpAddress?: StringType;
    /**
     * Encoded device-fingerprint details that your app collected with the Amazon Cognito context data collection library. For more information, see Adding user device and session data to API requests.
     */
    EncodedData?: StringType;
  }
  export type UserFilterType = string;
  export type UserImportJobIdType = string;
  export type UserImportJobNameType = string;
  export type UserImportJobStatusType = "Created"|"Pending"|"InProgress"|"Stopping"|"Expired"|"Stopped"|"Failed"|"Succeeded"|string;
  export interface UserImportJobType {
    /**
     * The job name for the user import job.
     */
    JobName?: UserImportJobNameType;
    /**
     * The job ID for the user import job.
     */
    JobId?: UserImportJobIdType;
    /**
     * The user pool ID for the user pool that the users are being imported into.
     */
    UserPoolId?: UserPoolIdType;
    /**
     * The pre-signed URL to be used to upload the .csv file.
     */
    PreSignedUrl?: PreSignedUrlType;
    /**
     * The date and time, in ISO 8601 format, when the item was created.
     */
    CreationDate?: DateType;
    /**
     * The date when the user import job was started.
     */
    StartDate?: DateType;
    /**
     * The date when the user import job was completed.
     */
    CompletionDate?: DateType;
    /**
     * The status of the user import job. One of the following:    Created - The job was created but not started.    Pending - A transition state. You have started the job, but it has not begun importing users yet.    InProgress - The job has started, and users are being imported.    Stopping - You have stopped the job, but the job has not stopped importing users yet.    Stopped - You have stopped the job, and the job has stopped importing users.    Succeeded - The job has completed successfully.    Failed - The job has stopped due to an error.    Expired - You created a job, but did not start the job within 24-48 hours. All data associated with the job was deleted, and the job can't be started.  
     */
    Status?: UserImportJobStatusType;
    /**
     * The role Amazon Resource Name (ARN) for the Amazon CloudWatch Logging role for the user import job. For more information, see "Creating the CloudWatch Logs IAM Role" in the Amazon Cognito Developer Guide.
     */
    CloudWatchLogsRoleArn?: ArnType;
    /**
     * The number of users that were successfully imported.
     */
    ImportedUsers?: LongType;
    /**
     * The number of users that were skipped.
     */
    SkippedUsers?: LongType;
    /**
     * The number of users that couldn't be imported.
     */
    FailedUsers?: LongType;
    /**
     * The message returned when the user import job is completed.
     */
    CompletionMessage?: CompletionMessageType;
  }
  export type UserImportJobsListType = UserImportJobType[];
  export type UserMFASettingListType = StringType[];
  export interface UserPoolAddOnsType {
    /**
     * The operating mode of advanced security features in your user pool.
     */
    AdvancedSecurityMode: AdvancedSecurityModeType;
  }
  export interface UserPoolClientDescription {
    /**
     * The ID of the client associated with the user pool.
     */
    ClientId?: ClientIdType;
    /**
     * The user pool ID for the user pool where you want to describe the user pool client.
     */
    UserPoolId?: UserPoolIdType;
    /**
     * The client name from the user pool client description.
     */
    ClientName?: ClientNameType;
  }
  export type UserPoolClientListType = UserPoolClientDescription[];
  export interface UserPoolClientType {
    /**
     * The user pool ID for the user pool client.
     */
    UserPoolId?: UserPoolIdType;
    /**
     * The client name from the user pool request of the client type.
     */
    ClientName?: ClientNameType;
    /**
     * The ID of the client associated with the user pool.
     */
    ClientId?: ClientIdType;
    /**
     * The client secret from the user pool request of the client type.
     */
    ClientSecret?: ClientSecretType;
    /**
     * The date and time, in ISO 8601 format, when the item was modified.
     */
    LastModifiedDate?: DateType;
    /**
     * The date and time, in ISO 8601 format, when the item was created.
     */
    CreationDate?: DateType;
    /**
     * The refresh token time limit. After this limit expires, your user can't use their refresh token. To specify the time unit for RefreshTokenValidity as seconds, minutes, hours, or days, set a TokenValidityUnits value in your API request. For example, when you set RefreshTokenValidity as 10 and TokenValidityUnits as days, your user can refresh their session and retrieve new access and ID tokens for 10 days. The default time unit for RefreshTokenValidity in an API request is days. You can't set RefreshTokenValidity to 0. If you do, Amazon Cognito overrides the value with the default value of 30 days. Valid range is displayed below in seconds. If you don't specify otherwise in the configuration of your app client, your refresh tokens are valid for 30 days.
     */
    RefreshTokenValidity?: RefreshTokenValidityType;
    /**
     * The access token time limit. After this limit expires, your user can't use their access token. To specify the time unit for AccessTokenValidity as seconds, minutes, hours, or days, set a TokenValidityUnits value in your API request. For example, when you set AccessTokenValidity to 10 and TokenValidityUnits to hours, your user can authorize access with their access token for 10 hours. The default time unit for AccessTokenValidity in an API request is hours. Valid range is displayed below in seconds. If you don't specify otherwise in the configuration of your app client, your access tokens are valid for one hour.
     */
    AccessTokenValidity?: AccessTokenValidityType;
    /**
     * The ID token time limit. After this limit expires, your user can't use their ID token. To specify the time unit for IdTokenValidity as seconds, minutes, hours, or days, set a TokenValidityUnits value in your API request. For example, when you set IdTokenValidity as 10 and TokenValidityUnits as hours, your user can authenticate their session with their ID token for 10 hours. The default time unit for IdTokenValidity in an API request is hours. Valid range is displayed below in seconds. If you don't specify otherwise in the configuration of your app client, your ID tokens are valid for one hour.
     */
    IdTokenValidity?: IdTokenValidityType;
    /**
     * The time units used to specify the token validity times of each token type: ID, access, and refresh.
     */
    TokenValidityUnits?: TokenValidityUnitsType;
    /**
     * The Read-only attributes.
     */
    ReadAttributes?: ClientPermissionListType;
    /**
     * The writeable attributes.
     */
    WriteAttributes?: ClientPermissionListType;
    /**
     * The authentication flows that you want your user pool client to support. For each app client in your user pool, you can sign in your users with any combination of one or more flows, including with a user name and Secure Remote Password (SRP), a user name and password, or a custom authentication process that you define with Lambda functions.  If you don't specify a value for ExplicitAuthFlows, your user client supports ALLOW_REFRESH_TOKEN_AUTH, ALLOW_USER_SRP_AUTH, and ALLOW_CUSTOM_AUTH.  Valid values include:    ALLOW_ADMIN_USER_PASSWORD_AUTH: Enable admin based user password authentication flow ADMIN_USER_PASSWORD_AUTH. This setting replaces the ADMIN_NO_SRP_AUTH setting. With this authentication flow, your app passes a user name and password to Amazon Cognito in the request, instead of using the Secure Remote Password (SRP) protocol to securely transmit the password.    ALLOW_CUSTOM_AUTH: Enable Lambda trigger based authentication.    ALLOW_USER_PASSWORD_AUTH: Enable user password-based authentication. In this flow, Amazon Cognito receives the password in the request instead of using the SRP protocol to verify passwords.    ALLOW_USER_SRP_AUTH: Enable SRP-based authentication.    ALLOW_REFRESH_TOKEN_AUTH: Enable authflow to refresh tokens.   In some environments, you will see the values ADMIN_NO_SRP_AUTH, CUSTOM_AUTH_FLOW_ONLY, or USER_PASSWORD_AUTH. You can't assign these legacy ExplicitAuthFlows values to user pool clients at the same time as values that begin with ALLOW_, like ALLOW_USER_SRP_AUTH.
     */
    ExplicitAuthFlows?: ExplicitAuthFlowsListType;
    /**
     * A list of provider names for the IdPs that this client supports. The following are supported: COGNITO, Facebook, Google, SignInWithApple, LoginWithAmazon, and the names of your own SAML and OIDC providers.
     */
    SupportedIdentityProviders?: SupportedIdentityProvidersListType;
    /**
     * A list of allowed redirect (callback) URLs for the IdPs. A redirect URI must:   Be an absolute URI.   Be registered with the authorization server.   Not include a fragment component.   See OAuth 2.0 - Redirection Endpoint. Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only. App callback URLs such as myapp://example are also supported.
     */
    CallbackURLs?: CallbackURLsListType;
    /**
     * A list of allowed logout URLs for the IdPs.
     */
    LogoutURLs?: LogoutURLsListType;
    /**
     * The default redirect URI. Must be in the CallbackURLs list. A redirect URI must:   Be an absolute URI.   Be registered with the authorization server.   Not include a fragment component.   See OAuth 2.0 - Redirection Endpoint. Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only. App callback URLs such as myapp://example are also supported.
     */
    DefaultRedirectURI?: RedirectUrlType;
    /**
     * The allowed OAuth flows.  code  Use a code grant flow, which provides an authorization code as the response. This code can be exchanged for access tokens with the /oauth2/token endpoint.  implicit  Issue the access token (and, optionally, ID token, based on scopes) directly to your user.  client_credentials  Issue the access token from the /oauth2/token endpoint directly to a non-person user using a combination of the client ID and client secret.  
     */
    AllowedOAuthFlows?: OAuthFlowsType;
    /**
     * The OAuth scopes that your app client supports. Possible values that OAuth provides are phone, email, openid, and profile. Possible values that Amazon Web Services provides are aws.cognito.signin.user.admin. Amazon Cognito also supports custom scopes that you create in Resource Servers.
     */
    AllowedOAuthScopes?: ScopeListType;
    /**
     * Set to true to use OAuth 2.0 features in your user pool app client.  AllowedOAuthFlowsUserPoolClient must be true before you can configure the following features in your app client.    CallBackURLs: Callback URLs.    LogoutURLs: Sign-out redirect URLs.    AllowedOAuthScopes: OAuth 2.0 scopes.    AllowedOAuthFlows: Support for authorization code, implicit, and client credentials OAuth 2.0 grants.   To use OAuth 2.0 features, configure one of these features in the Amazon Cognito console or set AllowedOAuthFlowsUserPoolClient to true in a CreateUserPoolClient or UpdateUserPoolClient API request. If you don't set a value for AllowedOAuthFlowsUserPoolClient in a request with the CLI or SDKs, it defaults to false.
     */
    AllowedOAuthFlowsUserPoolClient?: BooleanType;
    /**
     * The Amazon Pinpoint analytics configuration for the user pool client.  Amazon Cognito user pools only support sending events to Amazon Pinpoint projects in the US East (N. Virginia) us-east-1 Region, regardless of the Region where the user pool resides. 
     */
    AnalyticsConfiguration?: AnalyticsConfigurationType;
    /**
     * Errors and responses that you want Amazon Cognito APIs to return during authentication, account confirmation, and password recovery when the user doesn't exist in the user pool. When set to ENABLED and the user doesn't exist, authentication returns an error indicating either the username or password was incorrect. Account confirmation and password recovery return a response indicating a code was sent to a simulated destination. When set to LEGACY, those APIs return a UserNotFoundException exception if the user doesn't exist in the user pool. Valid values include:    ENABLED - This prevents user existence-related errors.    LEGACY - This represents the old behavior of Amazon Cognito where user existence related errors aren't prevented.  
     */
    PreventUserExistenceErrors?: PreventUserExistenceErrorTypes;
    /**
     * Indicates whether token revocation is activated for the user pool client. When you create a new user pool client, token revocation is activated by default. For more information about revoking tokens, see RevokeToken.
     */
    EnableTokenRevocation?: WrappedBooleanType;
    /**
     * When EnablePropagateAdditionalUserContextData is true, Amazon Cognito accepts an IpAddress value that you send in the UserContextData parameter. The UserContextData parameter sends information to Amazon Cognito advanced security for risk analysis. You can send UserContextData when you sign in Amazon Cognito native users with the InitiateAuth and RespondToAuthChallenge API operations. When EnablePropagateAdditionalUserContextData is false, you can't send your user's source IP address to Amazon Cognito advanced security with unauthenticated API operations. EnablePropagateAdditionalUserContextData doesn't affect whether you can send a source IP address in a ContextData parameter with the authenticated API operations AdminInitiateAuth and AdminRespondToAuthChallenge. You can only activate EnablePropagateAdditionalUserContextData in an app client that has a client secret. For more information about propagation of user context data, see Adding user device and session data to API requests.
     */
    EnablePropagateAdditionalUserContextData?: WrappedBooleanType;
    /**
     * Amazon Cognito creates a session token for each API request in an authentication flow. AuthSessionValidity is the duration, in minutes, of that session token. Your user pool native user must respond to each authentication challenge before the session expires.
     */
    AuthSessionValidity?: AuthSessionValidityType;
  }
  export interface UserPoolDescriptionType {
    /**
     * The ID in a user pool description.
     */
    Id?: UserPoolIdType;
    /**
     * The name in a user pool description.
     */
    Name?: UserPoolNameType;
    /**
     * The Lambda configuration information in a user pool description.
     */
    LambdaConfig?: LambdaConfigType;
    /**
     * The user pool status in a user pool description.
     */
    Status?: StatusType;
    /**
     * The date and time, in ISO 8601 format, when the item was modified.
     */
    LastModifiedDate?: DateType;
    /**
     * The date and time, in ISO 8601 format, when the item was created.
     */
    CreationDate?: DateType;
  }
  export type UserPoolIdType = string;
  export type UserPoolListType = UserPoolDescriptionType[];
  export type UserPoolMfaType = "OFF"|"ON"|"OPTIONAL"|string;
  export type UserPoolNameType = string;
  export interface UserPoolPolicyType {
    /**
     * The password policy.
     */
    PasswordPolicy?: PasswordPolicyType;
  }
  export type UserPoolTagsListType = TagKeysType[];
  export type UserPoolTagsType = {[key: string]: TagValueType};
  export interface UserPoolType {
    /**
     * The ID of the user pool.
     */
    Id?: UserPoolIdType;
    /**
     * The name of the user pool.
     */
    Name?: UserPoolNameType;
    /**
     * The policies associated with the user pool.
     */
    Policies?: UserPoolPolicyType;
    /**
     * When active, DeletionProtection prevents accidental deletion of your user pool. Before you can delete a user pool that you have protected against deletion, you must deactivate this feature. When you try to delete a protected user pool in a DeleteUserPool API request, Amazon Cognito returns an InvalidParameterException error. To delete a protected user pool, send a new DeleteUserPool request after you deactivate deletion protection in an UpdateUserPool API request.
     */
    DeletionProtection?: DeletionProtectionType;
    /**
     * The Lambda triggers associated with the user pool.
     */
    LambdaConfig?: LambdaConfigType;
    /**
     * The status of a user pool.
     */
    Status?: StatusType;
    /**
     * The date and time, in ISO 8601 format, when the item was modified.
     */
    LastModifiedDate?: DateType;
    /**
     * The date and time, in ISO 8601 format, when the item was created.
     */
    CreationDate?: DateType;
    /**
     * A list of the user attributes and their properties in your user pool. The attribute schema contains standard attributes, custom attributes with a custom: prefix, and developer attributes with a dev: prefix. For more information, see User pool attributes. Developer-only attributes are a legacy feature of user pools, are read-only to all app clients. You can create and update developer-only attributes only with IAM-authenticated API operations. Use app client read/write permissions instead.
     */
    SchemaAttributes?: SchemaAttributesListType;
    /**
     * The attributes that are auto-verified in a user pool.
     */
    AutoVerifiedAttributes?: VerifiedAttributesListType;
    /**
     * The attributes that are aliased in a user pool.
     */
    AliasAttributes?: AliasAttributesListType;
    /**
     * Specifies whether a user can use an email address or phone number as a username when they sign up.
     */
    UsernameAttributes?: UsernameAttributesListType;
    /**
     * This parameter is no longer used. See VerificationMessageTemplateType.
     */
    SmsVerificationMessage?: SmsVerificationMessageType;
    /**
     * This parameter is no longer used. See VerificationMessageTemplateType.
     */
    EmailVerificationMessage?: EmailVerificationMessageType;
    /**
     * This parameter is no longer used. See VerificationMessageTemplateType.
     */
    EmailVerificationSubject?: EmailVerificationSubjectType;
    /**
     * The template for verification messages.
     */
    VerificationMessageTemplate?: VerificationMessageTemplateType;
    /**
     * The contents of the SMS authentication message.
     */
    SmsAuthenticationMessage?: SmsVerificationMessageType;
    /**
     * The settings for updates to user attributes. These settings include the property AttributesRequireVerificationBeforeUpdate, a user-pool setting that tells Amazon Cognito how to handle changes to the value of your users' email address and phone number attributes. For more information, see  Verifying updates to email addresses and phone numbers.
     */
    UserAttributeUpdateSettings?: UserAttributeUpdateSettingsType;
    /**
     * Can be one of the following values:    OFF - MFA tokens aren't required and can't be specified during user registration.    ON - MFA tokens are required for all user registrations. You can only specify required when you're initially creating a user pool.    OPTIONAL - Users have the option when registering to create an MFA token.  
     */
    MfaConfiguration?: UserPoolMfaType;
    /**
     * The device-remembering configuration for a user pool. A null value indicates that you have deactivated device remembering in your user pool.  When you provide a value for any DeviceConfiguration field, you activate the Amazon Cognito device-remembering feature. 
     */
    DeviceConfiguration?: DeviceConfigurationType;
    /**
     * A number estimating the size of the user pool.
     */
    EstimatedNumberOfUsers?: IntegerType;
    /**
     * The email configuration of your user pool. The email configuration type sets your preferred sending method, Amazon Web Services Region, and sender for messages from your user pool.
     */
    EmailConfiguration?: EmailConfigurationType;
    /**
     * The SMS configuration with the settings that your Amazon Cognito user pool must use to send an SMS message from your Amazon Web Services account through Amazon Simple Notification Service. To send SMS messages with Amazon SNS in the Amazon Web Services Region that you want, the Amazon Cognito user pool uses an Identity and Access Management (IAM) role in your Amazon Web Services account.
     */
    SmsConfiguration?: SmsConfigurationType;
    /**
     * The tags that are assigned to the user pool. A tag is a label that you can apply to user pools to categorize and manage them in different ways, such as by purpose, owner, environment, or other criteria.
     */
    UserPoolTags?: UserPoolTagsType;
    /**
     * The reason why the SMS configuration can't send the messages to your users. This message might include comma-separated values to describe why your SMS configuration can't send messages to user pool end users.  InvalidSmsRoleAccessPolicyException  The Identity and Access Management role that Amazon Cognito uses to send SMS messages isn't properly configured. For more information, see SmsConfigurationType.  SNSSandbox  The Amazon Web Services account is in the SNS SMS Sandbox and messages will only reach verified end users. This parameter won’t get populated with SNSSandbox if the user creating the user pool doesn’t have SNS permissions. To learn how to move your Amazon Web Services account out of the sandbox, see Moving out of the SMS sandbox.  
     */
    SmsConfigurationFailure?: StringType;
    /**
     * Deprecated. Review error codes from API requests with EventSource:cognito-idp.amazonaws.com in CloudTrail for information about problems with user pool email configuration.
     */
    EmailConfigurationFailure?: StringType;
    /**
     * The domain prefix, if the user pool has a domain associated with it.
     */
    Domain?: DomainType;
    /**
     * A custom domain name that you provide to Amazon Cognito. This parameter applies only if you use a custom domain to host the sign-up and sign-in pages for your application. An example of a custom domain name might be auth.example.com. For more information about adding a custom domain to your user pool, see Using Your Own Domain for the Hosted UI.
     */
    CustomDomain?: DomainType;
    /**
     * The configuration for AdminCreateUser requests.
     */
    AdminCreateUserConfig?: AdminCreateUserConfigType;
    /**
     * User pool add-ons. Contains settings for activation of advanced security features. To log user security information but take no action, set to AUDIT. To configure automatic security responses to risky traffic to your user pool, set to ENFORCED. For more information, see Adding advanced security to a user pool.
     */
    UserPoolAddOns?: UserPoolAddOnsType;
    /**
     * Case sensitivity of the username input for the selected sign-in option. For example, when case sensitivity is set to False, users can sign in using either "username" or "Username". This configuration is immutable once it has been set. For more information, see UsernameConfigurationType.
     */
    UsernameConfiguration?: UsernameConfigurationType;
    /**
     * The Amazon Resource Name (ARN) for the user pool.
     */
    Arn?: ArnType;
    /**
     * The available verified method a user can use to recover their password when they call ForgotPassword. You can use this setting to define a preferred method when a user has more than one method available. With this setting, SMS doesn't qualify for a valid password recovery mechanism if the user also has SMS multi-factor authentication (MFA) activated. In the absence of this setting, Amazon Cognito uses the legacy behavior to determine the recovery method where SMS is preferred through email.
     */
    AccountRecoverySetting?: AccountRecoverySettingType;
  }
  export type UserStatusType = "UNCONFIRMED"|"CONFIRMED"|"ARCHIVED"|"COMPROMISED"|"UNKNOWN"|"RESET_REQUIRED"|"FORCE_CHANGE_PASSWORD"|string;
  export interface UserType {
    /**
     * The user name of the user you want to describe.
     */
    Username?: UsernameType;
    /**
     * A container with information about the user type attributes.
     */
    Attributes?: AttributeListType;
    /**
     * The creation date of the user.
     */
    UserCreateDate?: DateType;
    /**
     * The date and time, in ISO 8601 format, when the item was modified.
     */
    UserLastModifiedDate?: DateType;
    /**
     * Specifies whether the user is enabled.
     */
    Enabled?: BooleanType;
    /**
     * The user status. This can be one of the following:   UNCONFIRMED - User has been created but not confirmed.   CONFIRMED - User has been confirmed.   EXTERNAL_PROVIDER - User signed in with a third-party IdP.   UNKNOWN - User status isn't known.   RESET_REQUIRED - User is confirmed, but the user must request a code and reset their password before they can sign in.   FORCE_CHANGE_PASSWORD - The user is confirmed and the user can sign in using a temporary password, but on first sign-in, the user must change their password to a new value before doing anything else.   
     */
    UserStatus?: UserStatusType;
    /**
     * The MFA options for the user.
     */
    MFAOptions?: MFAOptionListType;
  }
  export type UsernameAttributeType = "phone_number"|"email"|string;
  export type UsernameAttributesListType = UsernameAttributeType[];
  export interface UsernameConfigurationType {
    /**
     * Specifies whether user name case sensitivity will be applied for all users in the user pool through Amazon Cognito APIs. For most use cases, set case sensitivity to False (case insensitive) as a best practice. When usernames and email addresses are case insensitive, users can sign in as the same user when they enter a different capitalization of their user name. Valid values include:  True  Enables case sensitivity for all username input. When this option is set to True, users must sign in using the exact capitalization of their given username, such as “UserName”. This is the default value.  False  Enables case insensitivity for all username input. For example, when this option is set to False, users can sign in using username, USERNAME, or UserName. This option also enables both preferred_username and email alias to be case insensitive, in addition to the username attribute.  
     */
    CaseSensitive: WrappedBooleanType;
  }
  export type UsernameType = string;
  export type UsersListType = UserType[];
  export interface VerificationMessageTemplateType {
    /**
     * The template for SMS messages that Amazon Cognito sends to your users.
     */
    SmsMessage?: SmsVerificationMessageType;
    /**
     * The template for email messages that Amazon Cognito sends to your users. You can set an EmailMessage template only if the value of  EmailSendingAccount is DEVELOPER. When your EmailSendingAccount is DEVELOPER, your user pool sends email messages with your own Amazon SES configuration.
     */
    EmailMessage?: EmailVerificationMessageType;
    /**
     * The subject line for the email message template. You can set an EmailSubject template only if the value of  EmailSendingAccount is DEVELOPER. When your EmailSendingAccount is DEVELOPER, your user pool sends email messages with your own Amazon SES configuration.
     */
    EmailSubject?: EmailVerificationSubjectType;
    /**
     * The email message template for sending a confirmation link to the user. You can set an EmailMessageByLink template only if the value of  EmailSendingAccount is DEVELOPER. When your EmailSendingAccount is DEVELOPER, your user pool sends email messages with your own Amazon SES configuration.
     */
    EmailMessageByLink?: EmailVerificationMessageByLinkType;
    /**
     * The subject line for the email message template for sending a confirmation link to the user. You can set an EmailSubjectByLink template only if the value of  EmailSendingAccount is DEVELOPER. When your EmailSendingAccount is DEVELOPER, your user pool sends email messages with your own Amazon SES configuration.
     */
    EmailSubjectByLink?: EmailVerificationSubjectByLinkType;
    /**
     * The default email option.
     */
    DefaultEmailOption?: DefaultEmailOptionType;
  }
  export type VerifiedAttributeType = "phone_number"|"email"|string;
  export type VerifiedAttributesListType = VerifiedAttributeType[];
  export interface VerifySoftwareTokenRequest {
    /**
     * A valid access token that Amazon Cognito issued to the user whose software token you want to verify.
     */
    AccessToken?: TokenModelType;
    /**
     * The session that should be passed both ways in challenge-response calls to the service.
     */
    Session?: SessionType;
    /**
     * The one- time password computed using the secret code returned by AssociateSoftwareToken.
     */
    UserCode: SoftwareTokenMFAUserCodeType;
    /**
     * The friendly device name.
     */
    FriendlyDeviceName?: StringType;
  }
  export interface VerifySoftwareTokenResponse {
    /**
     * The status of the verify software token.
     */
    Status?: VerifySoftwareTokenResponseType;
    /**
     * The session that should be passed both ways in challenge-response calls to the service.
     */
    Session?: SessionType;
  }
  export type VerifySoftwareTokenResponseType = "SUCCESS"|"ERROR"|string;
  export interface VerifyUserAttributeRequest {
    /**
     * A valid access token that Amazon Cognito issued to the user whose user attributes you want to verify.
     */
    AccessToken: TokenModelType;
    /**
     * The attribute name in the request to verify user attributes.
     */
    AttributeName: AttributeNameType;
    /**
     * The verification code in the request to verify user attributes.
     */
    Code: ConfirmationCodeType;
  }
  export interface VerifyUserAttributeResponse {
  }
  export type WrappedBooleanType = boolean;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-04-18"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CognitoIdentityServiceProvider client.
   */
  export import Types = CognitoIdentityServiceProvider;
}
export = CognitoIdentityServiceProvider;
