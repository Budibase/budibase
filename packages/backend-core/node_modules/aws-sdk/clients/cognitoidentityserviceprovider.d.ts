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
   * Adds additional user attributes to the user pool schema.
   */
  addCustomAttributes(params: CognitoIdentityServiceProvider.Types.AddCustomAttributesRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AddCustomAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AddCustomAttributesResponse, AWSError>;
  /**
   * Adds additional user attributes to the user pool schema.
   */
  addCustomAttributes(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AddCustomAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AddCustomAttributesResponse, AWSError>;
  /**
   * Adds the specified user to the specified group. Calling this action requires developer credentials.
   */
  adminAddUserToGroup(params: CognitoIdentityServiceProvider.Types.AdminAddUserToGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds the specified user to the specified group. Calling this action requires developer credentials.
   */
  adminAddUserToGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Confirms user registration as an admin without using a confirmation code. Works on any user. Calling this action requires developer credentials.
   */
  adminConfirmSignUp(params: CognitoIdentityServiceProvider.Types.AdminConfirmSignUpRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminConfirmSignUpResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminConfirmSignUpResponse, AWSError>;
  /**
   * Confirms user registration as an admin without using a confirmation code. Works on any user. Calling this action requires developer credentials.
   */
  adminConfirmSignUp(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminConfirmSignUpResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminConfirmSignUpResponse, AWSError>;
  /**
   * Creates a new user in the specified user pool. If MessageAction is not set, the default is to send a welcome message via email or phone (SMS).  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.   This message is based on a template that you configured in your call to create or update a user pool. This template includes your custom sign-up instructions and placeholders for user name and temporary password. Alternatively, you can call AdminCreateUser with “SUPPRESS” for the MessageAction parameter, and Amazon Cognito will not send any email.  In either case, the user will be in the FORCE_CHANGE_PASSWORD state until they sign in and change their password.  AdminCreateUser requires developer credentials.
   */
  adminCreateUser(params: CognitoIdentityServiceProvider.Types.AdminCreateUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminCreateUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminCreateUserResponse, AWSError>;
  /**
   * Creates a new user in the specified user pool. If MessageAction is not set, the default is to send a welcome message via email or phone (SMS).  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.   This message is based on a template that you configured in your call to create or update a user pool. This template includes your custom sign-up instructions and placeholders for user name and temporary password. Alternatively, you can call AdminCreateUser with “SUPPRESS” for the MessageAction parameter, and Amazon Cognito will not send any email.  In either case, the user will be in the FORCE_CHANGE_PASSWORD state until they sign in and change their password.  AdminCreateUser requires developer credentials.
   */
  adminCreateUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminCreateUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminCreateUserResponse, AWSError>;
  /**
   * Deletes a user as an administrator. Works on any user. Calling this action requires developer credentials.
   */
  adminDeleteUser(params: CognitoIdentityServiceProvider.Types.AdminDeleteUserRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a user as an administrator. Works on any user. Calling this action requires developer credentials.
   */
  adminDeleteUser(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the user attributes in a user pool as an administrator. Works on any user. Calling this action requires developer credentials.
   */
  adminDeleteUserAttributes(params: CognitoIdentityServiceProvider.Types.AdminDeleteUserAttributesRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminDeleteUserAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminDeleteUserAttributesResponse, AWSError>;
  /**
   * Deletes the user attributes in a user pool as an administrator. Works on any user. Calling this action requires developer credentials.
   */
  adminDeleteUserAttributes(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminDeleteUserAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminDeleteUserAttributesResponse, AWSError>;
  /**
   * Disables the user from signing in with the specified external (SAML or social) identity provider. If the user to disable is a Cognito User Pools native username + password user, they are not permitted to use their password to sign-in. If the user to disable is a linked external IdP user, any link between that user and an existing user is removed. The next time the external user (no longer attached to the previously linked DestinationUser) signs in, they must create a new user account. See AdminLinkProviderForUser. This action is enabled only for admin access and requires developer credentials. The ProviderName must match the value specified when creating an IdP for the pool.  To disable a native username + password user, the ProviderName value must be Cognito and the ProviderAttributeName must be Cognito_Subject, with the ProviderAttributeValue being the name that is used in the user pool for the user. The ProviderAttributeName must always be Cognito_Subject for social identity providers. The ProviderAttributeValue must always be the exact subject that was used when the user was originally linked as a source user. For de-linking a SAML identity, there are two scenarios. If the linked identity has not yet been used to sign-in, the ProviderAttributeName and ProviderAttributeValue must be the same values that were used for the SourceUser when the identities were originally linked using  AdminLinkProviderForUser call. (If the linking was done with ProviderAttributeName set to Cognito_Subject, the same applies here). However, if the user has already signed in, the ProviderAttributeName must be Cognito_Subject and ProviderAttributeValue must be the subject of the SAML assertion.
   */
  adminDisableProviderForUser(params: CognitoIdentityServiceProvider.Types.AdminDisableProviderForUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminDisableProviderForUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminDisableProviderForUserResponse, AWSError>;
  /**
   * Disables the user from signing in with the specified external (SAML or social) identity provider. If the user to disable is a Cognito User Pools native username + password user, they are not permitted to use their password to sign-in. If the user to disable is a linked external IdP user, any link between that user and an existing user is removed. The next time the external user (no longer attached to the previously linked DestinationUser) signs in, they must create a new user account. See AdminLinkProviderForUser. This action is enabled only for admin access and requires developer credentials. The ProviderName must match the value specified when creating an IdP for the pool.  To disable a native username + password user, the ProviderName value must be Cognito and the ProviderAttributeName must be Cognito_Subject, with the ProviderAttributeValue being the name that is used in the user pool for the user. The ProviderAttributeName must always be Cognito_Subject for social identity providers. The ProviderAttributeValue must always be the exact subject that was used when the user was originally linked as a source user. For de-linking a SAML identity, there are two scenarios. If the linked identity has not yet been used to sign-in, the ProviderAttributeName and ProviderAttributeValue must be the same values that were used for the SourceUser when the identities were originally linked using  AdminLinkProviderForUser call. (If the linking was done with ProviderAttributeName set to Cognito_Subject, the same applies here). However, if the user has already signed in, the ProviderAttributeName must be Cognito_Subject and ProviderAttributeValue must be the subject of the SAML assertion.
   */
  adminDisableProviderForUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminDisableProviderForUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminDisableProviderForUserResponse, AWSError>;
  /**
   * Disables the specified user. Calling this action requires developer credentials.
   */
  adminDisableUser(params: CognitoIdentityServiceProvider.Types.AdminDisableUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminDisableUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminDisableUserResponse, AWSError>;
  /**
   * Disables the specified user. Calling this action requires developer credentials.
   */
  adminDisableUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminDisableUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminDisableUserResponse, AWSError>;
  /**
   * Enables the specified user as an administrator. Works on any user. Calling this action requires developer credentials.
   */
  adminEnableUser(params: CognitoIdentityServiceProvider.Types.AdminEnableUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminEnableUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminEnableUserResponse, AWSError>;
  /**
   * Enables the specified user as an administrator. Works on any user. Calling this action requires developer credentials.
   */
  adminEnableUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminEnableUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminEnableUserResponse, AWSError>;
  /**
   * Forgets the device, as an administrator. Calling this action requires developer credentials.
   */
  adminForgetDevice(params: CognitoIdentityServiceProvider.Types.AdminForgetDeviceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Forgets the device, as an administrator. Calling this action requires developer credentials.
   */
  adminForgetDevice(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets the device, as an administrator. Calling this action requires developer credentials.
   */
  adminGetDevice(params: CognitoIdentityServiceProvider.Types.AdminGetDeviceRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminGetDeviceResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminGetDeviceResponse, AWSError>;
  /**
   * Gets the device, as an administrator. Calling this action requires developer credentials.
   */
  adminGetDevice(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminGetDeviceResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminGetDeviceResponse, AWSError>;
  /**
   * Gets the specified user by user name in a user pool as an administrator. Works on any user. Calling this action requires developer credentials.
   */
  adminGetUser(params: CognitoIdentityServiceProvider.Types.AdminGetUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminGetUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminGetUserResponse, AWSError>;
  /**
   * Gets the specified user by user name in a user pool as an administrator. Works on any user. Calling this action requires developer credentials.
   */
  adminGetUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminGetUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminGetUserResponse, AWSError>;
  /**
   * Initiates the authentication flow, as an administrator.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.   Calling this action requires developer credentials.
   */
  adminInitiateAuth(params: CognitoIdentityServiceProvider.Types.AdminInitiateAuthRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminInitiateAuthResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminInitiateAuthResponse, AWSError>;
  /**
   * Initiates the authentication flow, as an administrator.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.   Calling this action requires developer credentials.
   */
  adminInitiateAuth(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminInitiateAuthResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminInitiateAuthResponse, AWSError>;
  /**
   * Links an existing user account in a user pool (DestinationUser) to an identity from an external identity provider (SourceUser) based on a specified attribute name and value from the external identity provider. This allows you to create a link from the existing user account to an external federated user identity that has not yet been used to sign in, so that the federated user identity can be used to sign in as the existing user account.   For example, if there is an existing user with a username and password, this API links that user to a federated user identity, so that when the federated user identity is used, the user signs in as the existing user account.   The maximum number of federated identities linked to a user is 5.   Because this API allows a user with an external federated identity to sign in as an existing user in the user pool, it is critical that it only be used with external identity providers and provider attributes that have been trusted by the application owner.  This action is enabled only for admin access and requires developer credentials.
   */
  adminLinkProviderForUser(params: CognitoIdentityServiceProvider.Types.AdminLinkProviderForUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminLinkProviderForUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminLinkProviderForUserResponse, AWSError>;
  /**
   * Links an existing user account in a user pool (DestinationUser) to an identity from an external identity provider (SourceUser) based on a specified attribute name and value from the external identity provider. This allows you to create a link from the existing user account to an external federated user identity that has not yet been used to sign in, so that the federated user identity can be used to sign in as the existing user account.   For example, if there is an existing user with a username and password, this API links that user to a federated user identity, so that when the federated user identity is used, the user signs in as the existing user account.   The maximum number of federated identities linked to a user is 5.   Because this API allows a user with an external federated identity to sign in as an existing user in the user pool, it is critical that it only be used with external identity providers and provider attributes that have been trusted by the application owner.  This action is enabled only for admin access and requires developer credentials.
   */
  adminLinkProviderForUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminLinkProviderForUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminLinkProviderForUserResponse, AWSError>;
  /**
   * Lists devices, as an administrator. Calling this action requires developer credentials.
   */
  adminListDevices(params: CognitoIdentityServiceProvider.Types.AdminListDevicesRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminListDevicesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminListDevicesResponse, AWSError>;
  /**
   * Lists devices, as an administrator. Calling this action requires developer credentials.
   */
  adminListDevices(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminListDevicesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminListDevicesResponse, AWSError>;
  /**
   * Lists the groups that the user belongs to. Calling this action requires developer credentials.
   */
  adminListGroupsForUser(params: CognitoIdentityServiceProvider.Types.AdminListGroupsForUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminListGroupsForUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminListGroupsForUserResponse, AWSError>;
  /**
   * Lists the groups that the user belongs to. Calling this action requires developer credentials.
   */
  adminListGroupsForUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminListGroupsForUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminListGroupsForUserResponse, AWSError>;
  /**
   * Lists a history of user activity and any risks detected as part of Amazon Cognito advanced security.
   */
  adminListUserAuthEvents(params: CognitoIdentityServiceProvider.Types.AdminListUserAuthEventsRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminListUserAuthEventsResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminListUserAuthEventsResponse, AWSError>;
  /**
   * Lists a history of user activity and any risks detected as part of Amazon Cognito advanced security.
   */
  adminListUserAuthEvents(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminListUserAuthEventsResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminListUserAuthEventsResponse, AWSError>;
  /**
   * Removes the specified user from the specified group. Calling this action requires developer credentials.
   */
  adminRemoveUserFromGroup(params: CognitoIdentityServiceProvider.Types.AdminRemoveUserFromGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified user from the specified group. Calling this action requires developer credentials.
   */
  adminRemoveUserFromGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Resets the specified user's password in a user pool as an administrator. Works on any user. When a developer calls this API, the current password is invalidated, so it must be changed. If a user tries to sign in after the API is called, the app will get a PasswordResetRequiredException exception back and should direct the user down the flow to reset the password, which is the same as the forgot password flow. In addition, if the user pool has phone verification selected and a verified phone number exists for the user, or if email verification is selected and a verified email exists for the user, calling this API will also result in sending a message to the end user with the code to change their password.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.   Calling this action requires developer credentials.
   */
  adminResetUserPassword(params: CognitoIdentityServiceProvider.Types.AdminResetUserPasswordRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminResetUserPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminResetUserPasswordResponse, AWSError>;
  /**
   * Resets the specified user's password in a user pool as an administrator. Works on any user. When a developer calls this API, the current password is invalidated, so it must be changed. If a user tries to sign in after the API is called, the app will get a PasswordResetRequiredException exception back and should direct the user down the flow to reset the password, which is the same as the forgot password flow. In addition, if the user pool has phone verification selected and a verified phone number exists for the user, or if email verification is selected and a verified email exists for the user, calling this API will also result in sending a message to the end user with the code to change their password.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.   Calling this action requires developer credentials.
   */
  adminResetUserPassword(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminResetUserPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminResetUserPasswordResponse, AWSError>;
  /**
   * Responds to an authentication challenge, as an administrator.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.   Calling this action requires developer credentials.
   */
  adminRespondToAuthChallenge(params: CognitoIdentityServiceProvider.Types.AdminRespondToAuthChallengeRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminRespondToAuthChallengeResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminRespondToAuthChallengeResponse, AWSError>;
  /**
   * Responds to an authentication challenge, as an administrator.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.   Calling this action requires developer credentials.
   */
  adminRespondToAuthChallenge(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminRespondToAuthChallengeResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminRespondToAuthChallengeResponse, AWSError>;
  /**
   * Sets the user's multi-factor authentication (MFA) preference, including which MFA options are enabled and if any are preferred. Only one factor can be set as preferred. The preferred MFA factor will be used to authenticate a user if multiple factors are enabled. If multiple options are enabled and no preference is set, a challenge to choose an MFA option will be returned during sign in.
   */
  adminSetUserMFAPreference(params: CognitoIdentityServiceProvider.Types.AdminSetUserMFAPreferenceRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminSetUserMFAPreferenceResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminSetUserMFAPreferenceResponse, AWSError>;
  /**
   * Sets the user's multi-factor authentication (MFA) preference, including which MFA options are enabled and if any are preferred. Only one factor can be set as preferred. The preferred MFA factor will be used to authenticate a user if multiple factors are enabled. If multiple options are enabled and no preference is set, a challenge to choose an MFA option will be returned during sign in.
   */
  adminSetUserMFAPreference(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminSetUserMFAPreferenceResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminSetUserMFAPreferenceResponse, AWSError>;
  /**
   * Sets the specified user's password in a user pool as an administrator. Works on any user.  The password can be temporary or permanent. If it is temporary, the user status will be placed into the FORCE_CHANGE_PASSWORD state. When the user next tries to sign in, the InitiateAuth/AdminInitiateAuth response will contain the NEW_PASSWORD_REQUIRED challenge. If the user does not sign in before it expires, the user will not be able to sign in and their password will need to be reset by an administrator.  Once the user has set a new password, or the password is permanent, the user status will be set to Confirmed.
   */
  adminSetUserPassword(params: CognitoIdentityServiceProvider.Types.AdminSetUserPasswordRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminSetUserPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminSetUserPasswordResponse, AWSError>;
  /**
   * Sets the specified user's password in a user pool as an administrator. Works on any user.  The password can be temporary or permanent. If it is temporary, the user status will be placed into the FORCE_CHANGE_PASSWORD state. When the user next tries to sign in, the InitiateAuth/AdminInitiateAuth response will contain the NEW_PASSWORD_REQUIRED challenge. If the user does not sign in before it expires, the user will not be able to sign in and their password will need to be reset by an administrator.  Once the user has set a new password, or the password is permanent, the user status will be set to Confirmed.
   */
  adminSetUserPassword(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminSetUserPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminSetUserPasswordResponse, AWSError>;
  /**
   *  This action is no longer supported. You can use it to configure only SMS MFA. You can't use it to configure TOTP software token MFA. To configure either type of MFA, use AdminSetUserMFAPreference instead.
   */
  adminSetUserSettings(params: CognitoIdentityServiceProvider.Types.AdminSetUserSettingsRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminSetUserSettingsResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminSetUserSettingsResponse, AWSError>;
  /**
   *  This action is no longer supported. You can use it to configure only SMS MFA. You can't use it to configure TOTP software token MFA. To configure either type of MFA, use AdminSetUserMFAPreference instead.
   */
  adminSetUserSettings(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminSetUserSettingsResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminSetUserSettingsResponse, AWSError>;
  /**
   * Provides feedback for an authentication event as to whether it was from a valid user. This feedback is used for improving the risk evaluation decision for the user pool as part of Amazon Cognito advanced security.
   */
  adminUpdateAuthEventFeedback(params: CognitoIdentityServiceProvider.Types.AdminUpdateAuthEventFeedbackRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUpdateAuthEventFeedbackResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUpdateAuthEventFeedbackResponse, AWSError>;
  /**
   * Provides feedback for an authentication event as to whether it was from a valid user. This feedback is used for improving the risk evaluation decision for the user pool as part of Amazon Cognito advanced security.
   */
  adminUpdateAuthEventFeedback(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUpdateAuthEventFeedbackResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUpdateAuthEventFeedbackResponse, AWSError>;
  /**
   * Updates the device status as an administrator. Calling this action requires developer credentials.
   */
  adminUpdateDeviceStatus(params: CognitoIdentityServiceProvider.Types.AdminUpdateDeviceStatusRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUpdateDeviceStatusResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUpdateDeviceStatusResponse, AWSError>;
  /**
   * Updates the device status as an administrator. Calling this action requires developer credentials.
   */
  adminUpdateDeviceStatus(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUpdateDeviceStatusResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUpdateDeviceStatusResponse, AWSError>;
  /**
   * Updates the specified user's attributes, including developer attributes, as an administrator. Works on any user. For custom attributes, you must prepend the custom: prefix to the attribute name. In addition to updating user attributes, this API can also be used to mark phone and email as verified.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.   Calling this action requires developer credentials.
   */
  adminUpdateUserAttributes(params: CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesResponse, AWSError>;
  /**
   * Updates the specified user's attributes, including developer attributes, as an administrator. Works on any user. For custom attributes, you must prepend the custom: prefix to the attribute name. In addition to updating user attributes, this API can also be used to mark phone and email as verified.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.   Calling this action requires developer credentials.
   */
  adminUpdateUserAttributes(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesResponse, AWSError>;
  /**
   * Signs out users from all devices, as an administrator. It also invalidates all refresh tokens issued to a user. The user's current access and Id tokens remain valid until their expiry. Access and Id tokens expire one hour after they are issued. Calling this action requires developer credentials.
   */
  adminUserGlobalSignOut(params: CognitoIdentityServiceProvider.Types.AdminUserGlobalSignOutRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUserGlobalSignOutResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUserGlobalSignOutResponse, AWSError>;
  /**
   * Signs out users from all devices, as an administrator. It also invalidates all refresh tokens issued to a user. The user's current access and Id tokens remain valid until their expiry. Access and Id tokens expire one hour after they are issued. Calling this action requires developer credentials.
   */
  adminUserGlobalSignOut(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AdminUserGlobalSignOutResponse) => void): Request<CognitoIdentityServiceProvider.Types.AdminUserGlobalSignOutResponse, AWSError>;
  /**
   * Returns a unique generated shared secret key code for the user account. The request takes an access token or a session string, but not both.  Calling AssociateSoftwareToken immediately disassociates the existing software token from the user account. If the user doesn't subsequently verify the software token, their account is essentially set up to authenticate without MFA. If MFA config is set to Optional at the user pool level, the user can then login without MFA. However, if MFA is set to Required for the user pool, the user will be asked to setup a new software token MFA during sign in. 
   */
  associateSoftwareToken(params: CognitoIdentityServiceProvider.Types.AssociateSoftwareTokenRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AssociateSoftwareTokenResponse) => void): Request<CognitoIdentityServiceProvider.Types.AssociateSoftwareTokenResponse, AWSError>;
  /**
   * Returns a unique generated shared secret key code for the user account. The request takes an access token or a session string, but not both.  Calling AssociateSoftwareToken immediately disassociates the existing software token from the user account. If the user doesn't subsequently verify the software token, their account is essentially set up to authenticate without MFA. If MFA config is set to Optional at the user pool level, the user can then login without MFA. However, if MFA is set to Required for the user pool, the user will be asked to setup a new software token MFA during sign in. 
   */
  associateSoftwareToken(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.AssociateSoftwareTokenResponse) => void): Request<CognitoIdentityServiceProvider.Types.AssociateSoftwareTokenResponse, AWSError>;
  /**
   * Changes the password for a specified user in a user pool.
   */
  changePassword(params: CognitoIdentityServiceProvider.Types.ChangePasswordRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ChangePasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.ChangePasswordResponse, AWSError>;
  /**
   * Changes the password for a specified user in a user pool.
   */
  changePassword(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ChangePasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.ChangePasswordResponse, AWSError>;
  /**
   * Confirms tracking of the device. This API call is the call that begins device tracking.
   */
  confirmDevice(params: CognitoIdentityServiceProvider.Types.ConfirmDeviceRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ConfirmDeviceResponse) => void): Request<CognitoIdentityServiceProvider.Types.ConfirmDeviceResponse, AWSError>;
  /**
   * Confirms tracking of the device. This API call is the call that begins device tracking.
   */
  confirmDevice(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ConfirmDeviceResponse) => void): Request<CognitoIdentityServiceProvider.Types.ConfirmDeviceResponse, AWSError>;
  /**
   * Allows a user to enter a confirmation code to reset a forgotten password.
   */
  confirmForgotPassword(params: CognitoIdentityServiceProvider.Types.ConfirmForgotPasswordRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ConfirmForgotPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.ConfirmForgotPasswordResponse, AWSError>;
  /**
   * Allows a user to enter a confirmation code to reset a forgotten password.
   */
  confirmForgotPassword(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ConfirmForgotPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.ConfirmForgotPasswordResponse, AWSError>;
  /**
   * Confirms registration of a user and handles the existing alias from a previous user.
   */
  confirmSignUp(params: CognitoIdentityServiceProvider.Types.ConfirmSignUpRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ConfirmSignUpResponse) => void): Request<CognitoIdentityServiceProvider.Types.ConfirmSignUpResponse, AWSError>;
  /**
   * Confirms registration of a user and handles the existing alias from a previous user.
   */
  confirmSignUp(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ConfirmSignUpResponse) => void): Request<CognitoIdentityServiceProvider.Types.ConfirmSignUpResponse, AWSError>;
  /**
   * Creates a new group in the specified user pool. Calling this action requires developer credentials.
   */
  createGroup(params: CognitoIdentityServiceProvider.Types.CreateGroupRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateGroupResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateGroupResponse, AWSError>;
  /**
   * Creates a new group in the specified user pool. Calling this action requires developer credentials.
   */
  createGroup(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateGroupResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateGroupResponse, AWSError>;
  /**
   * Creates an identity provider for a user pool.
   */
  createIdentityProvider(params: CognitoIdentityServiceProvider.Types.CreateIdentityProviderRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateIdentityProviderResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateIdentityProviderResponse, AWSError>;
  /**
   * Creates an identity provider for a user pool.
   */
  createIdentityProvider(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateIdentityProviderResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateIdentityProviderResponse, AWSError>;
  /**
   * Creates a new OAuth2.0 resource server and defines custom scopes in it.
   */
  createResourceServer(params: CognitoIdentityServiceProvider.Types.CreateResourceServerRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateResourceServerResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateResourceServerResponse, AWSError>;
  /**
   * Creates a new OAuth2.0 resource server and defines custom scopes in it.
   */
  createResourceServer(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateResourceServerResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateResourceServerResponse, AWSError>;
  /**
   * Creates the user import job.
   */
  createUserImportJob(params: CognitoIdentityServiceProvider.Types.CreateUserImportJobRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateUserImportJobResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateUserImportJobResponse, AWSError>;
  /**
   * Creates the user import job.
   */
  createUserImportJob(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateUserImportJobResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateUserImportJobResponse, AWSError>;
  /**
   * Creates a new Amazon Cognito user pool and sets the password policy for the pool.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  createUserPool(params: CognitoIdentityServiceProvider.Types.CreateUserPoolRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateUserPoolResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateUserPoolResponse, AWSError>;
  /**
   * Creates a new Amazon Cognito user pool and sets the password policy for the pool.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  createUserPool(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateUserPoolResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateUserPoolResponse, AWSError>;
  /**
   * Creates the user pool client. When you create a new user pool client, token revocation is automatically enabled. For more information about revoking tokens, see RevokeToken.
   */
  createUserPoolClient(params: CognitoIdentityServiceProvider.Types.CreateUserPoolClientRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateUserPoolClientResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateUserPoolClientResponse, AWSError>;
  /**
   * Creates the user pool client. When you create a new user pool client, token revocation is automatically enabled. For more information about revoking tokens, see RevokeToken.
   */
  createUserPoolClient(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateUserPoolClientResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateUserPoolClientResponse, AWSError>;
  /**
   * Creates a new domain for a user pool.
   */
  createUserPoolDomain(params: CognitoIdentityServiceProvider.Types.CreateUserPoolDomainRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.CreateUserPoolDomainResponse) => void): Request<CognitoIdentityServiceProvider.Types.CreateUserPoolDomainResponse, AWSError>;
  /**
   * Creates a new domain for a user pool.
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
   * Deletes an identity provider for a user pool.
   */
  deleteIdentityProvider(params: CognitoIdentityServiceProvider.Types.DeleteIdentityProviderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an identity provider for a user pool.
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
   * Allows a user to delete himself or herself.
   */
  deleteUser(params: CognitoIdentityServiceProvider.Types.DeleteUserRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Allows a user to delete himself or herself.
   */
  deleteUser(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the attributes for a user.
   */
  deleteUserAttributes(params: CognitoIdentityServiceProvider.Types.DeleteUserAttributesRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DeleteUserAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.DeleteUserAttributesResponse, AWSError>;
  /**
   * Deletes the attributes for a user.
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
   * Gets information about a specific identity provider.
   */
  describeIdentityProvider(params: CognitoIdentityServiceProvider.Types.DescribeIdentityProviderRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeIdentityProviderResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeIdentityProviderResponse, AWSError>;
  /**
   * Gets information about a specific identity provider.
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
   * Returns the configuration information and metadata of the specified user pool.
   */
  describeUserPool(params: CognitoIdentityServiceProvider.Types.DescribeUserPoolRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeUserPoolResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeUserPoolResponse, AWSError>;
  /**
   * Returns the configuration information and metadata of the specified user pool.
   */
  describeUserPool(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeUserPoolResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeUserPoolResponse, AWSError>;
  /**
   * Client method for returning the configuration information and metadata of the specified user pool app client.
   */
  describeUserPoolClient(params: CognitoIdentityServiceProvider.Types.DescribeUserPoolClientRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.DescribeUserPoolClientResponse) => void): Request<CognitoIdentityServiceProvider.Types.DescribeUserPoolClientResponse, AWSError>;
  /**
   * Client method for returning the configuration information and metadata of the specified user pool app client.
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
   * Forgets the specified device.
   */
  forgetDevice(params: CognitoIdentityServiceProvider.Types.ForgetDeviceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Forgets the specified device.
   */
  forgetDevice(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Calling this API causes a message to be sent to the end user with a confirmation code that is required to change the user's password. For the Username parameter, you can use the username or user alias. The method used to send the confirmation code is sent according to the specified AccountRecoverySetting. For more information, see Recovering User Accounts in the Amazon Cognito Developer Guide. If neither a verified phone number nor a verified email exists, an InvalidParameterException is thrown. To use the confirmation code for resetting the password, call ConfirmForgotPassword.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  forgotPassword(params: CognitoIdentityServiceProvider.Types.ForgotPasswordRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ForgotPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.ForgotPasswordResponse, AWSError>;
  /**
   * Calling this API causes a message to be sent to the end user with a confirmation code that is required to change the user's password. For the Username parameter, you can use the username or user alias. The method used to send the confirmation code is sent according to the specified AccountRecoverySetting. For more information, see Recovering User Accounts in the Amazon Cognito Developer Guide. If neither a verified phone number nor a verified email exists, an InvalidParameterException is thrown. To use the confirmation code for resetting the password, call ConfirmForgotPassword.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  forgotPassword(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ForgotPasswordResponse) => void): Request<CognitoIdentityServiceProvider.Types.ForgotPasswordResponse, AWSError>;
  /**
   * Gets the header information for the .csv file to be used as input for the user import job.
   */
  getCSVHeader(params: CognitoIdentityServiceProvider.Types.GetCSVHeaderRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetCSVHeaderResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetCSVHeaderResponse, AWSError>;
  /**
   * Gets the header information for the .csv file to be used as input for the user import job.
   */
  getCSVHeader(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetCSVHeaderResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetCSVHeaderResponse, AWSError>;
  /**
   * Gets the device.
   */
  getDevice(params: CognitoIdentityServiceProvider.Types.GetDeviceRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetDeviceResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetDeviceResponse, AWSError>;
  /**
   * Gets the device.
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
   * Gets the specified identity provider.
   */
  getIdentityProviderByIdentifier(params: CognitoIdentityServiceProvider.Types.GetIdentityProviderByIdentifierRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetIdentityProviderByIdentifierResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetIdentityProviderByIdentifierResponse, AWSError>;
  /**
   * Gets the specified identity provider.
   */
  getIdentityProviderByIdentifier(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetIdentityProviderByIdentifierResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetIdentityProviderByIdentifierResponse, AWSError>;
  /**
   * This method takes a user pool ID, and returns the signing certificate.
   */
  getSigningCertificate(params: CognitoIdentityServiceProvider.Types.GetSigningCertificateRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetSigningCertificateResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetSigningCertificateResponse, AWSError>;
  /**
   * This method takes a user pool ID, and returns the signing certificate.
   */
  getSigningCertificate(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetSigningCertificateResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetSigningCertificateResponse, AWSError>;
  /**
   * Gets the UI Customization information for a particular app client's app UI, if there is something set. If nothing is set for the particular client, but there is an existing pool level customization (app clientId will be ALL), then that is returned. If nothing is present, then an empty shape is returned.
   */
  getUICustomization(params: CognitoIdentityServiceProvider.Types.GetUICustomizationRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetUICustomizationResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetUICustomizationResponse, AWSError>;
  /**
   * Gets the UI Customization information for a particular app client's app UI, if there is something set. If nothing is set for the particular client, but there is an existing pool level customization (app clientId will be ALL), then that is returned. If nothing is present, then an empty shape is returned.
   */
  getUICustomization(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetUICustomizationResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetUICustomizationResponse, AWSError>;
  /**
   * Gets the user attributes and metadata for a user.
   */
  getUser(params: CognitoIdentityServiceProvider.Types.GetUserRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetUserResponse, AWSError>;
  /**
   * Gets the user attributes and metadata for a user.
   */
  getUser(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetUserResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetUserResponse, AWSError>;
  /**
   * Gets the user attribute verification code for the specified attribute name.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  getUserAttributeVerificationCode(params: CognitoIdentityServiceProvider.Types.GetUserAttributeVerificationCodeRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GetUserAttributeVerificationCodeResponse) => void): Request<CognitoIdentityServiceProvider.Types.GetUserAttributeVerificationCodeResponse, AWSError>;
  /**
   * Gets the user attribute verification code for the specified attribute name.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
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
   * Signs out users from all devices. It also invalidates all refresh tokens issued to a user. The user's current access and Id tokens remain valid until their expiry. Access and Id tokens expire one hour after they are issued.
   */
  globalSignOut(params: CognitoIdentityServiceProvider.Types.GlobalSignOutRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GlobalSignOutResponse) => void): Request<CognitoIdentityServiceProvider.Types.GlobalSignOutResponse, AWSError>;
  /**
   * Signs out users from all devices. It also invalidates all refresh tokens issued to a user. The user's current access and Id tokens remain valid until their expiry. Access and Id tokens expire one hour after they are issued.
   */
  globalSignOut(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.GlobalSignOutResponse) => void): Request<CognitoIdentityServiceProvider.Types.GlobalSignOutResponse, AWSError>;
  /**
   * Initiates the authentication flow.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  initiateAuth(params: CognitoIdentityServiceProvider.Types.InitiateAuthRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.InitiateAuthResponse) => void): Request<CognitoIdentityServiceProvider.Types.InitiateAuthResponse, AWSError>;
  /**
   * Initiates the authentication flow.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  initiateAuth(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.InitiateAuthResponse) => void): Request<CognitoIdentityServiceProvider.Types.InitiateAuthResponse, AWSError>;
  /**
   * Lists the devices.
   */
  listDevices(params: CognitoIdentityServiceProvider.Types.ListDevicesRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListDevicesResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListDevicesResponse, AWSError>;
  /**
   * Lists the devices.
   */
  listDevices(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListDevicesResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListDevicesResponse, AWSError>;
  /**
   * Lists the groups associated with a user pool. Calling this action requires developer credentials.
   */
  listGroups(params: CognitoIdentityServiceProvider.Types.ListGroupsRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListGroupsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListGroupsResponse, AWSError>;
  /**
   * Lists the groups associated with a user pool. Calling this action requires developer credentials.
   */
  listGroups(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListGroupsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListGroupsResponse, AWSError>;
  /**
   * Lists information about all identity providers for a user pool.
   */
  listIdentityProviders(params: CognitoIdentityServiceProvider.Types.ListIdentityProvidersRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListIdentityProvidersResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListIdentityProvidersResponse, AWSError>;
  /**
   * Lists information about all identity providers for a user pool.
   */
  listIdentityProviders(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListIdentityProvidersResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListIdentityProvidersResponse, AWSError>;
  /**
   * Lists the resource servers for a user pool.
   */
  listResourceServers(params: CognitoIdentityServiceProvider.Types.ListResourceServersRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListResourceServersResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListResourceServersResponse, AWSError>;
  /**
   * Lists the resource servers for a user pool.
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
   * Lists the user import jobs.
   */
  listUserImportJobs(params: CognitoIdentityServiceProvider.Types.ListUserImportJobsRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUserImportJobsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUserImportJobsResponse, AWSError>;
  /**
   * Lists the user import jobs.
   */
  listUserImportJobs(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUserImportJobsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUserImportJobsResponse, AWSError>;
  /**
   * Lists the clients that have been created for the specified user pool.
   */
  listUserPoolClients(params: CognitoIdentityServiceProvider.Types.ListUserPoolClientsRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUserPoolClientsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUserPoolClientsResponse, AWSError>;
  /**
   * Lists the clients that have been created for the specified user pool.
   */
  listUserPoolClients(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUserPoolClientsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUserPoolClientsResponse, AWSError>;
  /**
   * Lists the user pools associated with an account.
   */
  listUserPools(params: CognitoIdentityServiceProvider.Types.ListUserPoolsRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUserPoolsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUserPoolsResponse, AWSError>;
  /**
   * Lists the user pools associated with an account.
   */
  listUserPools(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUserPoolsResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUserPoolsResponse, AWSError>;
  /**
   * Lists the users in the Amazon Cognito user pool.
   */
  listUsers(params: CognitoIdentityServiceProvider.Types.ListUsersRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUsersResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUsersResponse, AWSError>;
  /**
   * Lists the users in the Amazon Cognito user pool.
   */
  listUsers(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUsersResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUsersResponse, AWSError>;
  /**
   * Lists the users in the specified group. Calling this action requires developer credentials.
   */
  listUsersInGroup(params: CognitoIdentityServiceProvider.Types.ListUsersInGroupRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUsersInGroupResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUsersInGroupResponse, AWSError>;
  /**
   * Lists the users in the specified group. Calling this action requires developer credentials.
   */
  listUsersInGroup(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ListUsersInGroupResponse) => void): Request<CognitoIdentityServiceProvider.Types.ListUsersInGroupResponse, AWSError>;
  /**
   * Resends the confirmation (for confirmation of registration) to a specific user in the user pool.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  resendConfirmationCode(params: CognitoIdentityServiceProvider.Types.ResendConfirmationCodeRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ResendConfirmationCodeResponse) => void): Request<CognitoIdentityServiceProvider.Types.ResendConfirmationCodeResponse, AWSError>;
  /**
   * Resends the confirmation (for confirmation of registration) to a specific user in the user pool.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  resendConfirmationCode(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.ResendConfirmationCodeResponse) => void): Request<CognitoIdentityServiceProvider.Types.ResendConfirmationCodeResponse, AWSError>;
  /**
   * Responds to the authentication challenge.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  respondToAuthChallenge(params: CognitoIdentityServiceProvider.Types.RespondToAuthChallengeRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.RespondToAuthChallengeResponse) => void): Request<CognitoIdentityServiceProvider.Types.RespondToAuthChallengeResponse, AWSError>;
  /**
   * Responds to the authentication challenge.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  respondToAuthChallenge(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.RespondToAuthChallengeResponse) => void): Request<CognitoIdentityServiceProvider.Types.RespondToAuthChallengeResponse, AWSError>;
  /**
   * Revokes all of the access tokens generated by the specified refresh token. After the token is revoked, you can not use the revoked token to access Cognito authenticated APIs.
   */
  revokeToken(params: CognitoIdentityServiceProvider.Types.RevokeTokenRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.RevokeTokenResponse) => void): Request<CognitoIdentityServiceProvider.Types.RevokeTokenResponse, AWSError>;
  /**
   * Revokes all of the access tokens generated by the specified refresh token. After the token is revoked, you can not use the revoked token to access Cognito authenticated APIs.
   */
  revokeToken(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.RevokeTokenResponse) => void): Request<CognitoIdentityServiceProvider.Types.RevokeTokenResponse, AWSError>;
  /**
   * Configures actions on detected risks. To delete the risk configuration for UserPoolId or ClientId, pass null values for all four configuration types. To enable Amazon Cognito advanced security features, update the user pool to include the UserPoolAddOns keyAdvancedSecurityMode.
   */
  setRiskConfiguration(params: CognitoIdentityServiceProvider.Types.SetRiskConfigurationRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetRiskConfigurationResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetRiskConfigurationResponse, AWSError>;
  /**
   * Configures actions on detected risks. To delete the risk configuration for UserPoolId or ClientId, pass null values for all four configuration types. To enable Amazon Cognito advanced security features, update the user pool to include the UserPoolAddOns keyAdvancedSecurityMode.
   */
  setRiskConfiguration(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetRiskConfigurationResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetRiskConfigurationResponse, AWSError>;
  /**
   * Sets the UI customization information for a user pool's built-in app UI. You can specify app UI customization settings for a single client (with a specific clientId) or for all clients (by setting the clientId to ALL). If you specify ALL, the default configuration will be used for every client that has no UI customization set previously. If you specify UI customization settings for a particular client, it will no longer fall back to the ALL configuration.   To use this API, your user pool must have a domain associated with it. Otherwise, there is no place to host the app's pages, and the service will throw an error. 
   */
  setUICustomization(params: CognitoIdentityServiceProvider.Types.SetUICustomizationRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUICustomizationResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUICustomizationResponse, AWSError>;
  /**
   * Sets the UI customization information for a user pool's built-in app UI. You can specify app UI customization settings for a single client (with a specific clientId) or for all clients (by setting the clientId to ALL). If you specify ALL, the default configuration will be used for every client that has no UI customization set previously. If you specify UI customization settings for a particular client, it will no longer fall back to the ALL configuration.   To use this API, your user pool must have a domain associated with it. Otherwise, there is no place to host the app's pages, and the service will throw an error. 
   */
  setUICustomization(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUICustomizationResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUICustomizationResponse, AWSError>;
  /**
   * Set the user's multi-factor authentication (MFA) method preference, including which MFA factors are enabled and if any are preferred. Only one factor can be set as preferred. The preferred MFA factor will be used to authenticate a user if multiple factors are enabled. If multiple options are enabled and no preference is set, a challenge to choose an MFA option will be returned during sign in. If an MFA type is enabled for a user, the user will be prompted for MFA during all sign in attempts, unless device tracking is turned on and the device has been trusted. If you would like MFA to be applied selectively based on the assessed risk level of sign in attempts, disable MFA for users and turn on Adaptive Authentication for the user pool.
   */
  setUserMFAPreference(params: CognitoIdentityServiceProvider.Types.SetUserMFAPreferenceRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUserMFAPreferenceResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUserMFAPreferenceResponse, AWSError>;
  /**
   * Set the user's multi-factor authentication (MFA) method preference, including which MFA factors are enabled and if any are preferred. Only one factor can be set as preferred. The preferred MFA factor will be used to authenticate a user if multiple factors are enabled. If multiple options are enabled and no preference is set, a challenge to choose an MFA option will be returned during sign in. If an MFA type is enabled for a user, the user will be prompted for MFA during all sign in attempts, unless device tracking is turned on and the device has been trusted. If you would like MFA to be applied selectively based on the assessed risk level of sign in attempts, disable MFA for users and turn on Adaptive Authentication for the user pool.
   */
  setUserMFAPreference(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUserMFAPreferenceResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUserMFAPreferenceResponse, AWSError>;
  /**
   * Set the user pool multi-factor authentication (MFA) configuration.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  setUserPoolMfaConfig(params: CognitoIdentityServiceProvider.Types.SetUserPoolMfaConfigRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUserPoolMfaConfigResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUserPoolMfaConfigResponse, AWSError>;
  /**
   * Set the user pool multi-factor authentication (MFA) configuration.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  setUserPoolMfaConfig(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUserPoolMfaConfigResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUserPoolMfaConfigResponse, AWSError>;
  /**
   *  This action is no longer supported. You can use it to configure only SMS MFA. You can't use it to configure TOTP software token MFA. To configure either type of MFA, use SetUserMFAPreference instead.
   */
  setUserSettings(params: CognitoIdentityServiceProvider.Types.SetUserSettingsRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUserSettingsResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUserSettingsResponse, AWSError>;
  /**
   *  This action is no longer supported. You can use it to configure only SMS MFA. You can't use it to configure TOTP software token MFA. To configure either type of MFA, use SetUserMFAPreference instead.
   */
  setUserSettings(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SetUserSettingsResponse) => void): Request<CognitoIdentityServiceProvider.Types.SetUserSettingsResponse, AWSError>;
  /**
   * Registers the user in the specified user pool and creates a user name, password, and user attributes.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  signUp(params: CognitoIdentityServiceProvider.Types.SignUpRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.SignUpResponse) => void): Request<CognitoIdentityServiceProvider.Types.SignUpResponse, AWSError>;
  /**
   * Registers the user in the specified user pool and creates a user name, password, and user attributes.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
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
   * Assigns a set of tags to an Amazon Cognito user pool. A tag is a label that you can use to categorize and manage user pools in different ways, such as by purpose, owner, environment, or other criteria. Each tag consists of a key and value, both of which you define. A key is a general category for more specific values. For example, if you have two versions of a user pool, one for testing and another for production, you might assign an Environment tag key to both user pools. The value of this key might be Test for one user pool and Production for the other. Tags are useful for cost tracking and access control. You can activate your tags so that they appear on the Billing and Cost Management console, where you can track the costs associated with your user pools. In an IAM policy, you can constrain permissions for user pools based on specific tags or tag values. You can use this action up to 5 times per second, per account. A user pool can have as many as 50 tags.
   */
  tagResource(params: CognitoIdentityServiceProvider.Types.TagResourceRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.TagResourceResponse) => void): Request<CognitoIdentityServiceProvider.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns a set of tags to an Amazon Cognito user pool. A tag is a label that you can use to categorize and manage user pools in different ways, such as by purpose, owner, environment, or other criteria. Each tag consists of a key and value, both of which you define. A key is a general category for more specific values. For example, if you have two versions of a user pool, one for testing and another for production, you might assign an Environment tag key to both user pools. The value of this key might be Test for one user pool and Production for the other. Tags are useful for cost tracking and access control. You can activate your tags so that they appear on the Billing and Cost Management console, where you can track the costs associated with your user pools. In an IAM policy, you can constrain permissions for user pools based on specific tags or tag values. You can use this action up to 5 times per second, per account. A user pool can have as many as 50 tags.
   */
  tagResource(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.TagResourceResponse) => void): Request<CognitoIdentityServiceProvider.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from an Amazon Cognito user pool. You can use this action up to 5 times per second, per account
   */
  untagResource(params: CognitoIdentityServiceProvider.Types.UntagResourceRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UntagResourceResponse) => void): Request<CognitoIdentityServiceProvider.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from an Amazon Cognito user pool. You can use this action up to 5 times per second, per account
   */
  untagResource(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UntagResourceResponse) => void): Request<CognitoIdentityServiceProvider.Types.UntagResourceResponse, AWSError>;
  /**
   * Provides the feedback for an authentication event whether it was from a valid user or not. This feedback is used for improving the risk evaluation decision for the user pool as part of Amazon Cognito advanced security.
   */
  updateAuthEventFeedback(params: CognitoIdentityServiceProvider.Types.UpdateAuthEventFeedbackRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateAuthEventFeedbackResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateAuthEventFeedbackResponse, AWSError>;
  /**
   * Provides the feedback for an authentication event whether it was from a valid user or not. This feedback is used for improving the risk evaluation decision for the user pool as part of Amazon Cognito advanced security.
   */
  updateAuthEventFeedback(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateAuthEventFeedbackResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateAuthEventFeedbackResponse, AWSError>;
  /**
   * Updates the device status.
   */
  updateDeviceStatus(params: CognitoIdentityServiceProvider.Types.UpdateDeviceStatusRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateDeviceStatusResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateDeviceStatusResponse, AWSError>;
  /**
   * Updates the device status.
   */
  updateDeviceStatus(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateDeviceStatusResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateDeviceStatusResponse, AWSError>;
  /**
   * Updates the specified group with the specified attributes. Calling this action requires developer credentials.
   */
  updateGroup(params: CognitoIdentityServiceProvider.Types.UpdateGroupRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateGroupResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateGroupResponse, AWSError>;
  /**
   * Updates the specified group with the specified attributes. Calling this action requires developer credentials.
   */
  updateGroup(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateGroupResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateGroupResponse, AWSError>;
  /**
   * Updates identity provider information for a user pool.
   */
  updateIdentityProvider(params: CognitoIdentityServiceProvider.Types.UpdateIdentityProviderRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateIdentityProviderResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateIdentityProviderResponse, AWSError>;
  /**
   * Updates identity provider information for a user pool.
   */
  updateIdentityProvider(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateIdentityProviderResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateIdentityProviderResponse, AWSError>;
  /**
   * Updates the name and scopes of resource server. All other fields are read-only.  If you don't provide a value for an attribute, it will be set to the default value. 
   */
  updateResourceServer(params: CognitoIdentityServiceProvider.Types.UpdateResourceServerRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateResourceServerResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateResourceServerResponse, AWSError>;
  /**
   * Updates the name and scopes of resource server. All other fields are read-only.  If you don't provide a value for an attribute, it will be set to the default value. 
   */
  updateResourceServer(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateResourceServerResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateResourceServerResponse, AWSError>;
  /**
   * Allows a user to update a specific attribute (one at a time).  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  updateUserAttributes(params: CognitoIdentityServiceProvider.Types.UpdateUserAttributesRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserAttributesResponse, AWSError>;
  /**
   * Allows a user to update a specific attribute (one at a time).  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  updateUserAttributes(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserAttributesResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserAttributesResponse, AWSError>;
  /**
   * Updates the specified user pool with the specified attributes. You can get a list of the current user pool settings using DescribeUserPool. If you don't provide a value for an attribute, it will be set to the default value.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  updateUserPool(params: CognitoIdentityServiceProvider.Types.UpdateUserPoolRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserPoolResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserPoolResponse, AWSError>;
  /**
   * Updates the specified user pool with the specified attributes. You can get a list of the current user pool settings using DescribeUserPool. If you don't provide a value for an attribute, it will be set to the default value.  This action might generate an SMS text message. Starting June 1, 2021, U.S. telecom carriers require that you register an origination phone number before you can send SMS messages to U.S. phone numbers. If you use SMS text messages in Amazon Cognito, you must register a phone number with Amazon Pinpoint. Cognito will use the the registered number automatically. Otherwise, Cognito users that must receive SMS messages might be unable to sign up, activate their accounts, or sign in. If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Service, Amazon SNS might place your account in SMS sandbox. In  sandbox mode , you’ll have limitations, such as sending messages to only verified phone numbers. After testing in the sandbox environment, you can move out of the SMS sandbox and into production. For more information, see  SMS message settings for Cognito User Pools in the Amazon Cognito Developer Guide.  
   */
  updateUserPool(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserPoolResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserPoolResponse, AWSError>;
  /**
   * Updates the specified user pool app client with the specified attributes. You can get a list of the current user pool app client settings using DescribeUserPoolClient.  If you don't provide a value for an attribute, it will be set to the default value.  You can also use this operation to enable token revocation for user pool clients. For more information about revoking tokens, see RevokeToken.
   */
  updateUserPoolClient(params: CognitoIdentityServiceProvider.Types.UpdateUserPoolClientRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserPoolClientResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserPoolClientResponse, AWSError>;
  /**
   * Updates the specified user pool app client with the specified attributes. You can get a list of the current user pool app client settings using DescribeUserPoolClient.  If you don't provide a value for an attribute, it will be set to the default value.  You can also use this operation to enable token revocation for user pool clients. For more information about revoking tokens, see RevokeToken.
   */
  updateUserPoolClient(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserPoolClientResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserPoolClientResponse, AWSError>;
  /**
   * Updates the Secure Sockets Layer (SSL) certificate for the custom domain for your user pool. You can use this operation to provide the Amazon Resource Name (ARN) of a new certificate to Amazon Cognito. You cannot use it to change the domain for a user pool. A custom domain is used to host the Amazon Cognito hosted UI, which provides sign-up and sign-in pages for your application. When you set up a custom domain, you provide a certificate that you manage with Certificate Manager (ACM). When necessary, you can use this operation to change the certificate that you applied to your custom domain. Usually, this is unnecessary following routine certificate renewal with ACM. When you renew your existing certificate in ACM, the ARN for your certificate remains the same, and your custom domain uses the new certificate automatically. However, if you replace your existing certificate with a new one, ACM gives the new certificate a new ARN. To apply the new certificate to your custom domain, you must provide this ARN to Amazon Cognito. When you add your new certificate in ACM, you must choose US East (N. Virginia) as the Region. After you submit your request, Amazon Cognito requires up to 1 hour to distribute your new certificate to your custom domain. For more information about adding a custom domain to your user pool, see Using Your Own Domain for the Hosted UI.
   */
  updateUserPoolDomain(params: CognitoIdentityServiceProvider.Types.UpdateUserPoolDomainRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserPoolDomainResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserPoolDomainResponse, AWSError>;
  /**
   * Updates the Secure Sockets Layer (SSL) certificate for the custom domain for your user pool. You can use this operation to provide the Amazon Resource Name (ARN) of a new certificate to Amazon Cognito. You cannot use it to change the domain for a user pool. A custom domain is used to host the Amazon Cognito hosted UI, which provides sign-up and sign-in pages for your application. When you set up a custom domain, you provide a certificate that you manage with Certificate Manager (ACM). When necessary, you can use this operation to change the certificate that you applied to your custom domain. Usually, this is unnecessary following routine certificate renewal with ACM. When you renew your existing certificate in ACM, the ARN for your certificate remains the same, and your custom domain uses the new certificate automatically. However, if you replace your existing certificate with a new one, ACM gives the new certificate a new ARN. To apply the new certificate to your custom domain, you must provide this ARN to Amazon Cognito. When you add your new certificate in ACM, you must choose US East (N. Virginia) as the Region. After you submit your request, Amazon Cognito requires up to 1 hour to distribute your new certificate to your custom domain. For more information about adding a custom domain to your user pool, see Using Your Own Domain for the Hosted UI.
   */
  updateUserPoolDomain(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.UpdateUserPoolDomainResponse) => void): Request<CognitoIdentityServiceProvider.Types.UpdateUserPoolDomainResponse, AWSError>;
  /**
   * Use this API to register a user's entered TOTP code and mark the user's software token MFA status as "verified" if successful. The request takes an access token or a session string, but not both.
   */
  verifySoftwareToken(params: CognitoIdentityServiceProvider.Types.VerifySoftwareTokenRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.VerifySoftwareTokenResponse) => void): Request<CognitoIdentityServiceProvider.Types.VerifySoftwareTokenResponse, AWSError>;
  /**
   * Use this API to register a user's entered TOTP code and mark the user's software token MFA status as "verified" if successful. The request takes an access token or a session string, but not both.
   */
  verifySoftwareToken(callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.VerifySoftwareTokenResponse) => void): Request<CognitoIdentityServiceProvider.Types.VerifySoftwareTokenResponse, AWSError>;
  /**
   * Verifies the specified user attributes in the user pool.
   */
  verifyUserAttribute(params: CognitoIdentityServiceProvider.Types.VerifyUserAttributeRequest, callback?: (err: AWSError, data: CognitoIdentityServiceProvider.Types.VerifyUserAttributeResponse) => void): Request<CognitoIdentityServiceProvider.Types.VerifyUserAttributeResponse, AWSError>;
  /**
   * Verifies the specified user attributes in the user pool.
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
     * The event action.    BLOCK Choosing this action will block the request.    MFA_IF_CONFIGURED Throw MFA challenge if user has configured it, else allow the request.    MFA_REQUIRED Throw MFA challenge if user has configured it, else block the request.    NO_ACTION Allow the user sign-in.  
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
     * Account takeover risk configuration actions
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
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers.  If your user pool configuration includes triggers, the AdminConfirmSignUp API action invokes the Lambda function that is specified for the post confirmation trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. In this payload, the clientMetadata attribute provides the data that you assigned to the ClientMetadata parameter in your AdminConfirmSignUp request. In your function code in Lambda, you can process the ClientMetadata value to enhance your workflow for your specific needs. For more information, see Customizing User Pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  Take the following limitations into consideration when you use the ClientMetadata parameter:   Amazon Cognito does not store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.   Amazon Cognito does not validate the ClientMetadata value.   Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.   
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
     * The user account expiration limit, in days, after which the account is no longer usable. To reset the account after that time limit, you must call AdminCreateUser again, specifying "RESEND" for the MessageAction parameter. The default value for this parameter is 7.   If you set a value for TemporaryPasswordValidityDays in PasswordPolicy, that value will be used and UnusedAccountValidityDays will be deprecated for that user pool.  
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
     * The username for the user. Must be unique within the user pool. Must be a UTF-8 string between 1 and 128 characters. After the user is created, the username cannot be changed.
     */
    Username: UsernameType;
    /**
     * An array of name-value pairs that contain user attributes and attribute values to be set for the user to be created. You can create a user without specifying any attributes other than Username. However, any attributes that you specify as required (when creating a user pool or in the Attributes tab of the console) must be supplied either by you (in your call to AdminCreateUser) or by the user (when he or she signs up in response to your welcome message). For custom attributes, you must prepend the custom: prefix to the attribute name. To send a message inviting the user to sign up, you must specify the user's email address or phone number. This can be done in your call to AdminCreateUser or in the Users tab of the Amazon Cognito console for managing your user pools. In your call to AdminCreateUser, you can set the email_verified attribute to True, and you can set the phone_number_verified attribute to True. (You can also do this by calling AdminUpdateUserAttributes.)    email: The email address of the user to whom the message that contains the code and username will be sent. Required if the email_verified attribute is set to True, or if "EMAIL" is specified in the DesiredDeliveryMediums parameter.    phone_number: The phone number of the user to whom the message that contains the code and username will be sent. Required if the phone_number_verified attribute is set to True, or if "SMS" is specified in the DesiredDeliveryMediums parameter.  
     */
    UserAttributes?: AttributeListType;
    /**
     * The user's validation data. This is an array of name-value pairs that contain user attributes and attribute values that you can use for custom validation, such as restricting the types of user accounts that can be registered. For example, you might choose to allow or disallow user sign-up based on the user's domain. To configure custom validation, you must create a Pre Sign-up Lambda trigger for the user pool as described in the Amazon Cognito Developer Guide. The Lambda trigger receives the validation data and uses it in the validation process. The user's validation data is not persisted.
     */
    ValidationData?: AttributeListType;
    /**
     * The user's temporary password. This password must conform to the password policy that you specified when you created the user pool. The temporary password is valid only once. To complete the Admin Create User flow, the user must enter the temporary password in the sign-in page along with a new password to be used in all future sign-ins. This parameter is not required. If you do not specify a value, Amazon Cognito generates one for you. The temporary password can only be used until the user account expiration limit that you specified when you created the user pool. To reset the account after that time limit, you must call AdminCreateUser again, specifying "RESEND" for the MessageAction parameter.
     */
    TemporaryPassword?: PasswordType;
    /**
     * This parameter is only used if the phone_number_verified or email_verified attribute is set to True. Otherwise, it is ignored. If this parameter is set to True and the phone number or email address specified in the UserAttributes parameter already exists as an alias with a different user, the API call will migrate the alias from the previous user to the newly created user. The previous user will no longer be able to log in using that alias. If this parameter is set to False, the API throws an AliasExistsException error if the alias already exists. The default value is False.
     */
    ForceAliasCreation?: ForceAliasCreation;
    /**
     * Set to "RESEND" to resend the invitation message to a user that already exists and reset the expiration limit on the user's account. Set to "SUPPRESS" to suppress sending the message. Only one value can be specified.
     */
    MessageAction?: MessageActionType;
    /**
     * Specify "EMAIL" if email will be used to send the welcome message. Specify "SMS" if the phone number will be used. The default value is "SMS". More than one value can be specified.
     */
    DesiredDeliveryMediums?: DeliveryMediumListType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers.  You create custom workflows by assigning Lambda functions to user pool triggers. When you use the AdminCreateUser API action, Amazon Cognito invokes the function that is assigned to the pre sign-up trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your AdminCreateUser request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see Customizing User Pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  Take the following limitations into consideration when you use the ClientMetadata parameter:   Amazon Cognito does not store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.   Amazon Cognito does not validate the ClientMetadata value.   Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.   
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
     * An array of strings representing the user attribute names you wish to delete. For custom attributes, you must prepend the custom: prefix to the attribute name.
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
     * The user name of the user you wish to delete.
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
     * The user name of the user you wish to disable.
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
     * The user name of the user you wish to enable.
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
     * The user name of the user you wish to retrieve.
     */
    Username: UsernameType;
  }
  export interface AdminGetUserResponse {
    /**
     * The user name of the user about whom you are receiving information.
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
     * The date the user was last modified.
     */
    UserLastModifiedDate?: DateType;
    /**
     * Indicates that the status is enabled.
     */
    Enabled?: BooleanType;
    /**
     * The user status. Can be one of the following:   UNCONFIRMED - User has been created but not confirmed.   CONFIRMED - User has been confirmed.   ARCHIVED - User is no longer active.   COMPROMISED - User is disabled due to a potential security threat.   UNKNOWN - User status is not known.   RESET_REQUIRED - User is confirmed, but the user must request a code and reset his or her password before he or she can sign in.   FORCE_CHANGE_PASSWORD - The user is confirmed and the user can sign in using a temporary password, but on first sign-in, the user must change his or her password to a new value before doing anything else.   
     */
    UserStatus?: UserStatusType;
    /**
     *  This response parameter is no longer supported. It provides information only about SMS MFA configurations. It doesn't provide information about TOTP software token MFA configurations. To look up information about either type of MFA configuration, use UserMFASettingList instead.
     */
    MFAOptions?: MFAOptionListType;
    /**
     * The user's preferred MFA setting.
     */
    PreferredMfaSetting?: StringType;
    /**
     * The MFA options that are enabled for the user. The possible values in this list are SMS_MFA and SOFTWARE_TOKEN_MFA.
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
     * The authentication flow for this call to execute. The API action will depend on this value. For example:    REFRESH_TOKEN_AUTH will take in a valid refresh token and return new tokens.    USER_SRP_AUTH will take in USERNAME and SRP_A and return the SRP variables to be used for next challenge execution.    USER_PASSWORD_AUTH will take in USERNAME and PASSWORD and return the next challenge or tokens.   Valid values include:    USER_SRP_AUTH: Authentication flow for the Secure Remote Password (SRP) protocol.    REFRESH_TOKEN_AUTH/REFRESH_TOKEN: Authentication flow for refreshing the access token and ID token by supplying a valid refresh token.    CUSTOM_AUTH: Custom authentication flow.    ADMIN_NO_SRP_AUTH: Non-SRP authentication flow; you can pass in the USERNAME and PASSWORD directly if the flow is enabled for calling the app client.    USER_PASSWORD_AUTH: Non-SRP authentication flow; USERNAME and PASSWORD are passed directly. If a user migration Lambda trigger is set, this flow will invoke the user migration Lambda if the USERNAME is not found in the user pool.     ADMIN_USER_PASSWORD_AUTH: Admin-based user password authentication. This replaces the ADMIN_NO_SRP_AUTH authentication flow. In this flow, Cognito receives the password in the request instead of using the SRP process to verify passwords.  
     */
    AuthFlow: AuthFlowType;
    /**
     * The authentication parameters. These are inputs corresponding to the AuthFlow that you are invoking. The required values depend on the value of AuthFlow:   For USER_SRP_AUTH: USERNAME (required), SRP_A (required), SECRET_HASH (required if the app client is configured with a client secret), DEVICE_KEY.   For REFRESH_TOKEN_AUTH/REFRESH_TOKEN: REFRESH_TOKEN (required), SECRET_HASH (required if the app client is configured with a client secret), DEVICE_KEY.   For ADMIN_NO_SRP_AUTH: USERNAME (required), SECRET_HASH (if app client is configured with client secret), PASSWORD (required), DEVICE_KEY.   For CUSTOM_AUTH: USERNAME (required), SECRET_HASH (if app client is configured with client secret), DEVICE_KEY. To start the authentication flow with password verification, include ChallengeName: SRP_A and SRP_A: (The SRP_A Value).  
     */
    AuthParameters?: AuthParametersType;
    /**
     * A map of custom key-value pairs that you can provide as input for certain custom workflows that this action triggers. You create custom workflows by assigning Lambda functions to user pool triggers. When you use the AdminInitiateAuth API action, Amazon Cognito invokes the Lambda functions that are specified for various triggers. The ClientMetadata value is passed as input to the functions for only the following triggers:   Pre signup   Pre authentication   User migration   When Amazon Cognito invokes the functions for these triggers, it passes a JSON payload, which the function receives as input. This payload contains a validationData attribute, which provides the data that you assigned to the ClientMetadata parameter in your AdminInitiateAuth request. In your function code in Lambda, you can process the validationData value to enhance your workflow for your specific needs. When you use the AdminInitiateAuth API action, Amazon Cognito also invokes the functions for the following triggers, but it does not provide the ClientMetadata value as input:   Post authentication   Custom message   Pre token generation   Create auth challenge   Define auth challenge   Verify auth challenge   For more information, see Customizing User Pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  Take the following limitations into consideration when you use the ClientMetadata parameter:   Amazon Cognito does not store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.   Amazon Cognito does not validate the ClientMetadata value.   Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
    /**
     * The analytics metadata for collecting Amazon Pinpoint metrics for AdminInitiateAuth calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * Contextual data such as the user's device fingerprint, IP address, or location used for evaluating the risk of an unexpected event by Amazon Cognito advanced security.
     */
    ContextData?: ContextDataType;
  }
  export interface AdminInitiateAuthResponse {
    /**
     * The name of the challenge which you are responding to with this call. This is returned to you in the AdminInitiateAuth response if you need to pass another challenge.    MFA_SETUP: If MFA is required, users who do not have at least one of the MFA methods set up are presented with an MFA_SETUP challenge. The user must set up at least one MFA type to continue to authenticate.    SELECT_MFA_TYPE: Selects the MFA type. Valid MFA options are SMS_MFA for text SMS MFA, and SOFTWARE_TOKEN_MFA for TOTP software token MFA.    SMS_MFA: Next challenge is to supply an SMS_MFA_CODE, delivered via SMS.    PASSWORD_VERIFIER: Next challenge is to supply PASSWORD_CLAIM_SIGNATURE, PASSWORD_CLAIM_SECRET_BLOCK, and TIMESTAMP after the client-side SRP calculations.    CUSTOM_CHALLENGE: This is returned if your custom authentication flow determines that the user should pass another challenge before tokens are issued.    DEVICE_SRP_AUTH: If device tracking was enabled on your user pool and the previous challenges were passed, this challenge is returned so that Amazon Cognito can start tracking this device.    DEVICE_PASSWORD_VERIFIER: Similar to PASSWORD_VERIFIER, but for devices only.    ADMIN_NO_SRP_AUTH: This is returned if you need to authenticate with USERNAME and PASSWORD directly. An app client must be enabled to use this flow.    NEW_PASSWORD_REQUIRED: For users who are required to change their passwords after successful first login. This challenge should be passed with NEW_PASSWORD and any other required attributes.    MFA_SETUP: For users who are required to setup an MFA factor before they can sign-in. The MFA types enabled for the user pool will be listed in the challenge parameters MFA_CAN_SETUP value.   To setup software token MFA, use the session returned here from InitiateAuth as an input to AssociateSoftwareToken, and use the session returned by VerifySoftwareToken as an input to RespondToAuthChallenge with challenge name MFA_SETUP to complete sign-in. To setup SMS MFA, users will need help from an administrator to add a phone number to their account and then call InitiateAuth again to restart sign-in.  
     */
    ChallengeName?: ChallengeNameType;
    /**
     * The session which should be passed both ways in challenge-response calls to the service. If AdminInitiateAuth or AdminRespondToAuthChallenge API call determines that the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next AdminRespondToAuthChallenge API call.
     */
    Session?: SessionType;
    /**
     * The challenge parameters. These are returned to you in the AdminInitiateAuth response if you need to pass another challenge. The responses in this parameter should be used to compute inputs to the next call (AdminRespondToAuthChallenge). All challenges require USERNAME and SECRET_HASH (if applicable). The value of the USER_ID_FOR_SRP attribute will be the user's actual username, not an alias (such as email address or phone number), even if you specified an alias in your call to AdminInitiateAuth. This is because, in the AdminRespondToAuthChallenge API ChallengeResponses, the USERNAME attribute cannot be an alias.
     */
    ChallengeParameters?: ChallengeParametersType;
    /**
     * The result of the authentication response. This is only returned if the caller does not need to pass another challenge. If the caller does need to pass another challenge before it gets tokens, ChallengeName, ChallengeParameters, and Session are returned.
     */
    AuthenticationResult?: AuthenticationResultType;
  }
  export interface AdminLinkProviderForUserRequest {
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: StringType;
    /**
     * The existing user in the user pool to be linked to the external identity provider user account. Can be a native (Username + Password) Cognito User Pools user or a federated user (for example, a SAML or Facebook user). If the user doesn't exist, an exception is thrown. This is the user that is returned when the new user (with the linked identity provider attribute) signs in. For a native username + password user, the ProviderAttributeValue for the DestinationUser should be the username in the user pool. For a federated user, it should be the provider-specific user_id. The ProviderAttributeName of the DestinationUser is ignored. The ProviderName should be set to Cognito for users in Cognito user pools.
     */
    DestinationUser: ProviderUserIdentifierType;
    /**
     * An external identity provider account for a user who does not currently exist yet in the user pool. This user must be a federated user (for example, a SAML or Facebook user), not another native user. If the SourceUser is a federated social identity provider user (Facebook, Google, or Login with Amazon), you must set the ProviderAttributeName to Cognito_Subject. For social identity providers, the ProviderName will be Facebook, Google, or LoginWithAmazon, and Cognito will automatically parse the Facebook, Google, and Login with Amazon tokens for id, sub, and user_id, respectively. The ProviderAttributeValue for the user must be the same value as the id, sub, or user_id value found in the social identity provider token.  For SAML, the ProviderAttributeName can be any value that matches a claim in the SAML assertion. If you wish to link SAML users based on the subject of the SAML assertion, you should map the subject to a claim through the SAML identity provider and submit that claim name as the ProviderAttributeName. If you set ProviderAttributeName to Cognito_Subject, Cognito will automatically parse the default unique identifier found in the subject from the SAML token.
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
     * The maximum number of authentication events to return.
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
     * The user name of the user whose password you wish to reset.
     */
    Username: UsernameType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers.  You create custom workflows by assigning Lambda functions to user pool triggers. When you use the AdminResetUserPassword API action, Amazon Cognito invokes the function that is assigned to the custom message trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your AdminResetUserPassword request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see Customizing User Pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  Take the following limitations into consideration when you use the ClientMetadata parameter:   Amazon Cognito does not store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.   Amazon Cognito does not validate the ClientMetadata value.   Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.   
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
     * The challenge responses. These are inputs corresponding to the value of ChallengeName, for example:    SMS_MFA: SMS_MFA_CODE, USERNAME, SECRET_HASH (if app client is configured with client secret).    PASSWORD_VERIFIER: PASSWORD_CLAIM_SIGNATURE, PASSWORD_CLAIM_SECRET_BLOCK, TIMESTAMP, USERNAME, SECRET_HASH (if app client is configured with client secret).    ADMIN_NO_SRP_AUTH: PASSWORD, USERNAME, SECRET_HASH (if app client is configured with client secret).     NEW_PASSWORD_REQUIRED: NEW_PASSWORD, any other required attributes, USERNAME, SECRET_HASH (if app client is configured with client secret).     MFA_SETUP requires USERNAME, plus you need to use the session value returned by VerifySoftwareToken in the Session parameter.   The value of the USERNAME attribute must be the user's actual username, not an alias (such as email address or phone number). To make this easier, the AdminInitiateAuth response includes the actual username value in the USERNAMEUSER_ID_FOR_SRP attribute, even if you specified an alias in your call to AdminInitiateAuth.
     */
    ChallengeResponses?: ChallengeResponsesType;
    /**
     * The session which should be passed both ways in challenge-response calls to the service. If InitiateAuth or RespondToAuthChallenge API call determines that the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next RespondToAuthChallenge API call.
     */
    Session?: SessionType;
    /**
     * The analytics metadata for collecting Amazon Pinpoint metrics for AdminRespondToAuthChallenge calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * Contextual data such as the user's device fingerprint, IP address, or location used for evaluating the risk of an unexpected event by Amazon Cognito advanced security.
     */
    ContextData?: ContextDataType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers.  You create custom workflows by assigning Lambda functions to user pool triggers. When you use the AdminRespondToAuthChallenge API action, Amazon Cognito invokes any functions that are assigned to the following triggers: pre sign-up, custom message, post authentication, user migration, pre token generation, define auth challenge, create auth challenge, and verify auth challenge response. When Amazon Cognito invokes any of these functions, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your AdminRespondToAuthChallenge request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see Customizing User Pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  Take the following limitations into consideration when you use the ClientMetadata parameter:   Amazon Cognito does not store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.   Amazon Cognito does not validate the ClientMetadata value.   Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface AdminRespondToAuthChallengeResponse {
    /**
     * The name of the challenge. For more information, see AdminInitiateAuth.
     */
    ChallengeName?: ChallengeNameType;
    /**
     * The session which should be passed both ways in challenge-response calls to the service. If the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next RespondToAuthChallenge API call.
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
     * The user name of the user whose password you wish to set.
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
     * The ID of the user pool that contains the user that you are setting options for.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The user name of the user that you are setting options for.
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
     * The authentication event feedback value.
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
     * An array of name-value pairs representing user attributes. For custom attributes, you must prepend the custom: prefix to the attribute name.
     */
    UserAttributes: AttributeListType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers.  You create custom workflows by assigning Lambda functions to user pool triggers. When you use the AdminUpdateUserAttributes API action, Amazon Cognito invokes the function that is assigned to the custom message trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your AdminUpdateUserAttributes request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see Customizing User Pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  Take the following limitations into consideration when you use the ClientMetadata parameter:   Amazon Cognito does not store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.   Amazon Cognito does not validate the ClientMetadata value.   Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.   
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
     * The Amazon Resource Name (ARN) of an Amazon Pinpoint project. You can use the Amazon Pinpoint project for Pinpoint integration with the chosen User Pool Client. Amazon Cognito publishes events to the pinpoint project declared by the app ARN.
     */
    ApplicationArn?: ArnType;
    /**
     * The ARN of an IAM role that authorizes Amazon Cognito to publish events to Amazon Pinpoint analytics.
     */
    RoleArn?: ArnType;
    /**
     * The external ID.
     */
    ExternalId?: StringType;
    /**
     * If UserDataShared is true, Amazon Cognito will include user data in the events it publishes to Amazon Pinpoint analytics.
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
     * The access token.
     */
    AccessToken?: TokenModelType;
    /**
     * The session which should be passed both ways in challenge-response calls to the service. This allows authentication of the user as part of the MFA setup process.
     */
    Session?: SessionType;
  }
  export interface AssociateSoftwareTokenResponse {
    /**
     * A unique generated shared secret code that is used in the TOTP algorithm to generate a one time code.
     */
    SecretCode?: SecretCodeType;
    /**
     * The session which should be passed both ways in challenge-response calls to the service. This allows authentication of the user as part of the MFA setup process.
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
     * The creation date
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
     * The user context data captured at the time of an event request. It provides additional information about the client from which event the request is received.
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
  export interface AuthenticationResultType {
    /**
     * The access token.
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
     * The challenge name
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
     * The access token.
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
  export type CodeDeliveryDetailsListType = CodeDeliveryDetailsType[];
  export interface CodeDeliveryDetailsType {
    /**
     * The destination for the code delivery details.
     */
    Destination?: StringType;
    /**
     * The delivery medium (email message or phone number).
     */
    DeliveryMedium?: DeliveryMediumType;
    /**
     * The attribute name.
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
     * The access token.
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
     * Indicates whether the user confirmation is necessary to confirm the device response.
     */
    UserConfirmationNecessary?: BooleanType;
  }
  export interface ConfirmForgotPasswordRequest {
    /**
     * The app client ID of the app associated with the user pool.
     */
    ClientId: ClientIdType;
    /**
     * A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.
     */
    SecretHash?: SecretHashType;
    /**
     * The user name of the user for whom you want to enter a code to retrieve a forgotten password.
     */
    Username: UsernameType;
    /**
     * The confirmation code sent by a user's request to retrieve a forgotten password. For more information, see ForgotPassword.
     */
    ConfirmationCode: ConfirmationCodeType;
    /**
     * The password sent by a user's request to retrieve a forgotten password.
     */
    Password: PasswordType;
    /**
     * The Amazon Pinpoint analytics metadata for collecting metrics for ConfirmForgotPassword calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * Contextual data such as the user's device fingerprint, IP address, or location used for evaluating the risk of an unexpected event by Amazon Cognito advanced security.
     */
    UserContextData?: UserContextDataType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers.  You create custom workflows by assigning Lambda functions to user pool triggers. When you use the ConfirmForgotPassword API action, Amazon Cognito invokes the function that is assigned to the post confirmation trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your ConfirmForgotPassword request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see Customizing User Pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  Take the following limitations into consideration when you use the ClientMetadata parameter:   Amazon Cognito does not store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.   Amazon Cognito does not validate the ClientMetadata value.   Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.   
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
     * The user name of the user whose registration you wish to confirm.
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
     * Contextual data such as the user's device fingerprint, IP address, or location used for evaluating the risk of an unexpected event by Amazon Cognito advanced security.
     */
    UserContextData?: UserContextDataType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers.  You create custom workflows by assigning Lambda functions to user pool triggers. When you use the ConfirmSignUp API action, Amazon Cognito invokes the function that is assigned to the post confirmation trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your ConfirmSignUp request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see Customizing User Pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  Take the following limitations into consideration when you use the ClientMetadata parameter:   Amazon Cognito does not store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.   Amazon Cognito does not validate the ClientMetadata value.   Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface ConfirmSignUpResponse {
  }
  export type ConfirmationCodeType = string;
  export interface ContextDataType {
    /**
     * Source IP address of your user.
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
     * Encoded data containing device fingerprinting details, collected using the Amazon Cognito context data collection library.
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
     * The role ARN for the group.
     */
    RoleArn?: ArnType;
    /**
     * A nonnegative integer value that specifies the precedence of this group relative to the other groups that a user can belong to in the user pool. Zero is the highest precedence value. Groups with lower Precedence values take precedence over groups with higher or null Precedence values. If a user belongs to two or more groups, it is the group with the lowest precedence value whose role ARN will be used in the cognito:roles and cognito:preferred_role claims in the user's tokens. Two groups can have the same Precedence value. If this happens, neither group takes precedence over the other. If two groups with the same Precedence have the same role ARN, that role is used in the cognito:preferred_role claim in tokens for users in each group. If the two groups have different role ARNs, the cognito:preferred_role claim is not set in users' tokens. The default Precedence value is null.
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
     * The identity provider name.
     */
    ProviderName: ProviderNameTypeV1;
    /**
     * The identity provider type.
     */
    ProviderType: IdentityProviderTypeType;
    /**
     * The identity provider details. The following list describes the provider detail keys for each identity provider type.   For Google and Login with Amazon:   client_id   client_secret   authorize_scopes     For Facebook:   client_id   client_secret   authorize_scopes   api_version     For Sign in with Apple:   client_id   team_id   key_id   private_key   authorize_scopes     For OIDC providers:   client_id   client_secret   attributes_request_method   oidc_issuer   authorize_scopes   authorize_url if not available from discovery URL specified by oidc_issuer key    token_url if not available from discovery URL specified by oidc_issuer key    attributes_url if not available from discovery URL specified by oidc_issuer key    jwks_uri if not available from discovery URL specified by oidc_issuer key      For SAML providers:   MetadataFile OR MetadataURL   IDPSignout optional     
     */
    ProviderDetails: ProviderDetailsType;
    /**
     * A mapping of identity provider attributes to standard and custom user pool attributes.
     */
    AttributeMapping?: AttributeMappingType;
    /**
     * A list of identity provider identifiers.
     */
    IdpIdentifiers?: IdpIdentifiersListType;
  }
  export interface CreateIdentityProviderResponse {
    /**
     * The newly created identity provider object.
     */
    IdentityProvider: IdentityProviderType;
  }
  export interface CreateResourceServerRequest {
    /**
     * The user pool ID for the user pool.
     */
    UserPoolId: UserPoolIdType;
    /**
     * A unique resource server identifier for the resource server. This could be an HTTPS endpoint where the resource server is located. For example, https://my-weather-api.example.com.
     */
    Identifier: ResourceServerIdentifierType;
    /**
     * A friendly name for the resource server.
     */
    Name: ResourceServerNameType;
    /**
     * A list of scopes. Each scope is map, where the keys are name and description.
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
     * The role ARN for the Amazon CloudWatch Logging role for the user import job.
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
     * The time limit, in days, after which the refresh token is no longer valid and cannot be used.
     */
    RefreshTokenValidity?: RefreshTokenValidityType;
    /**
     * The time limit, between 5 minutes and 1 day, after which the access token is no longer valid and cannot be used. This value will be overridden if you have entered a value in TokenValidityUnits.
     */
    AccessTokenValidity?: AccessTokenValidityType;
    /**
     * The time limit, between 5 minutes and 1 day, after which the ID token is no longer valid and cannot be used. This value will be overridden if you have entered a value in TokenValidityUnits.
     */
    IdTokenValidity?: IdTokenValidityType;
    /**
     * The units in which the validity times are represented in. Default for RefreshToken is days, and default for ID and access tokens are hours.
     */
    TokenValidityUnits?: TokenValidityUnitsType;
    /**
     * The read attributes.
     */
    ReadAttributes?: ClientPermissionListType;
    /**
     * The user pool attributes that the app client can write to. If your app client allows users to sign in through an identity provider, this array must include all attributes that are mapped to identity provider attributes. Amazon Cognito updates mapped attributes when users sign in to your application through an identity provider. If your app client lacks write access to a mapped attribute, Amazon Cognito throws an error when it attempts to update the attribute. For more information, see Specifying Identity Provider Attribute Mappings for Your User Pool.
     */
    WriteAttributes?: ClientPermissionListType;
    /**
     * The authentication flows that are supported by the user pool clients. Flow names without the ALLOW_ prefix are deprecated in favor of new names with the ALLOW_ prefix. Note that values with ALLOW_ prefix cannot be used along with values without ALLOW_ prefix. Valid values include:    ALLOW_ADMIN_USER_PASSWORD_AUTH: Enable admin based user password authentication flow ADMIN_USER_PASSWORD_AUTH. This setting replaces the ADMIN_NO_SRP_AUTH setting. With this authentication flow, Cognito receives the password in the request instead of using the SRP (Secure Remote Password protocol) protocol to verify passwords.    ALLOW_CUSTOM_AUTH: Enable Lambda trigger based authentication.    ALLOW_USER_PASSWORD_AUTH: Enable user password-based authentication. In this flow, Cognito receives the password in the request instead of using the SRP protocol to verify passwords.    ALLOW_USER_SRP_AUTH: Enable SRP based authentication.    ALLOW_REFRESH_TOKEN_AUTH: Enable authflow to refresh tokens.  
     */
    ExplicitAuthFlows?: ExplicitAuthFlowsListType;
    /**
     * A list of provider names for the identity providers that are supported on this client. The following are supported: COGNITO, Facebook, Google and LoginWithAmazon.
     */
    SupportedIdentityProviders?: SupportedIdentityProvidersListType;
    /**
     * A list of allowed redirect (callback) URLs for the identity providers. A redirect URI must:   Be an absolute URI.   Be registered with the authorization server.   Not include a fragment component.   See OAuth 2.0 - Redirection Endpoint. Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only. App callback URLs such as myapp://example are also supported.
     */
    CallbackURLs?: CallbackURLsListType;
    /**
     * A list of allowed logout URLs for the identity providers.
     */
    LogoutURLs?: LogoutURLsListType;
    /**
     * The default redirect URI. Must be in the CallbackURLs list. A redirect URI must:   Be an absolute URI.   Be registered with the authorization server.   Not include a fragment component.   See OAuth 2.0 - Redirection Endpoint. Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only. App callback URLs such as myapp://example are also supported.
     */
    DefaultRedirectURI?: RedirectUrlType;
    /**
     * The allowed OAuth flows. Set to code to initiate a code grant flow, which provides an authorization code as the response. This code can be exchanged for access tokens with the token endpoint. Set to implicit to specify that the client should get the access token (and, optionally, ID token, based on scopes) directly. Set to client_credentials to specify that the client should get the access token (and, optionally, ID token, based on scopes) from the token endpoint using a combination of client and client_secret.
     */
    AllowedOAuthFlows?: OAuthFlowsType;
    /**
     * The allowed OAuth scopes. Possible values provided by OAuth are: phone, email, openid, and profile. Possible values provided by Amazon Web Services are: aws.cognito.signin.user.admin. Custom scopes created in Resource Servers are also supported.
     */
    AllowedOAuthScopes?: ScopeListType;
    /**
     * Set to true if the client is allowed to follow the OAuth protocol when interacting with Cognito user pools.
     */
    AllowedOAuthFlowsUserPoolClient?: BooleanType;
    /**
     * The Amazon Pinpoint analytics configuration for collecting metrics for this user pool.  In regions where Pinpoint is not available, Cognito User Pools only supports sending events to Amazon Pinpoint projects in us-east-1. In regions where Pinpoint is available, Cognito User Pools will support sending events to Amazon Pinpoint projects within that same region.  
     */
    AnalyticsConfiguration?: AnalyticsConfigurationType;
    /**
     * Use this setting to choose which errors and responses are returned by Cognito APIs during authentication, account confirmation, and password recovery when the user does not exist in the user pool. When set to ENABLED and the user does not exist, authentication returns an error indicating either the username or password was incorrect, and account confirmation and password recovery return a response indicating a code was sent to a simulated destination. When set to LEGACY, those APIs will return a UserNotFoundException exception if the user does not exist in the user pool. Valid values include:    ENABLED - This prevents user existence-related errors.    LEGACY - This represents the old behavior of Cognito where user existence related errors are not prevented.    After February 15th 2020, the value of PreventUserExistenceErrors will default to ENABLED for newly created user pool clients if no value is provided. 
     */
    PreventUserExistenceErrors?: PreventUserExistenceErrorTypes;
    /**
     * Enables or disables token revocation. For more information about revoking tokens, see RevokeToken. If you don't include this parameter, token revocation is automatically enabled for the new user pool client.
     */
    EnableTokenRevocation?: WrappedBooleanType;
  }
  export interface CreateUserPoolClientResponse {
    /**
     * The user pool client that was just created.
     */
    UserPoolClient?: UserPoolClientType;
  }
  export interface CreateUserPoolDomainRequest {
    /**
     * The domain string.
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
     * The Lambda trigger configuration information for the new user pool.  In a push model, event sources (such as Amazon S3 and custom applications) need permission to invoke a function. So you will need to make an extra call to add permission for these event sources to invoke your Lambda function.  For more information on using the Lambda API to add permission, see  AddPermission .  For adding permission using the CLI, see  add-permission . 
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
     * Specifies whether email addresses or phone numbers can be specified as usernames when a user signs up.
     */
    UsernameAttributes?: UsernameAttributesListType;
    /**
     * A string representing the SMS verification message.
     */
    SmsVerificationMessage?: SmsVerificationMessageType;
    /**
     * A string representing the email verification message. EmailVerificationMessage is allowed only if EmailSendingAccount is DEVELOPER. 
     */
    EmailVerificationMessage?: EmailVerificationMessageType;
    /**
     * A string representing the email verification subject. EmailVerificationSubject is allowed only if EmailSendingAccount is DEVELOPER. 
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
     * The device configuration.
     */
    DeviceConfiguration?: DeviceConfigurationType;
    /**
     * The email configuration.
     */
    EmailConfiguration?: EmailConfigurationType;
    /**
     * The SMS configuration.
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
     * Used to enable advanced security risk detection. Set the key AdvancedSecurityMode to the value "AUDIT".
     */
    UserPoolAddOns?: UserPoolAddOnsType;
    /**
     * You can choose to set case sensitivity on the username input for the selected sign-in option. For example, when this is set to False, users will be able to sign in using either "username" or "Username". This configuration is immutable once it has been set. For more information, see UsernameConfigurationType.
     */
    UsernameConfiguration?: UsernameConfigurationType;
    /**
     * Use this setting to define which verified available method a user can use to recover their password when they call ForgotPassword. It allows you to define a preferred method when a user has more than one method available. With this setting, SMS does not qualify for a valid password recovery mechanism if the user also has SMS MFA enabled. In the absence of this setting, Cognito uses the legacy behavior to determine the recovery method where SMS is preferred over email.
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
     * The Lambda version represents the signature of the "request" attribute in the "event" information Amazon Cognito passes to your custom email Lambda function. The only supported value is V1_0.
     */
    LambdaVersion: CustomEmailSenderLambdaVersionType;
    /**
     * The Lambda Amazon Resource Name of the Lambda function that Amazon Cognito triggers to send email notifications to users.
     */
    LambdaArn: ArnType;
  }
  export type CustomEmailSenderLambdaVersionType = "V1_0"|string;
  export interface CustomSMSLambdaVersionConfigType {
    /**
     * The Lambda version represents the signature of the "request" attribute in the "event" information Amazon Cognito passes to your custom SMS Lambda function. The only supported value is V1_0.
     */
    LambdaVersion: CustomSMSSenderLambdaVersionType;
    /**
     * The Lambda Amazon Resource Name of the Lambda function that Amazon Cognito triggers to send SMS notifications to users.
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
     * The identity provider name.
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
     * An array of strings representing the user attribute names you wish to delete. For custom attributes, you must prepend the custom: prefix to the attribute name.
     */
    UserAttributeNames: AttributeNameListType;
    /**
     * The access token used in the request to delete user attributes.
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
     * The domain string.
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
     * The access token from a request to delete a user.
     */
    AccessToken: TokenModelType;
  }
  export type DeliveryMediumListType = DeliveryMediumType[];
  export type DeliveryMediumType = "SMS"|"EMAIL"|string;
  export interface DescribeIdentityProviderRequest {
    /**
     * The user pool ID.
     */
    UserPoolId: UserPoolIdType;
    /**
     * The identity provider name.
     */
    ProviderName: ProviderNameType;
  }
  export interface DescribeIdentityProviderResponse {
    /**
     * The identity provider that was deleted.
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
     * The domain string.
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
     * Indicates whether a challenge is required on a new device. Only applicable to a new device.
     */
    ChallengeRequiredOnNewDevice?: BooleanType;
    /**
     * If true, a device is only remembered on user prompt.
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
     * The salt.
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
     * The last modified date of the device.
     */
    DeviceLastModifiedDate?: DateType;
    /**
     * The date in which the device was last authenticated.
     */
    DeviceLastAuthenticatedDate?: DateType;
  }
  export interface DomainDescriptionType {
    /**
     * The user pool ID.
     */
    UserPoolId?: UserPoolIdType;
    /**
     * The account ID for the user pool owner.
     */
    AWSAccountId?: AWSAccountIdType;
    /**
     * The domain string.
     */
    Domain?: DomainType;
    /**
     * The S3 bucket where the static files for this domain are stored.
     */
    S3Bucket?: S3BucketType;
    /**
     * The ARN of the CloudFront distribution.
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
     * The Amazon Resource Name (ARN) of a verified email address in Amazon SES. This email address is used in one of the following ways, depending on the value that you specify for the EmailSendingAccount parameter:   If you specify COGNITO_DEFAULT, Amazon Cognito uses this address as the custom FROM address when it emails your users by using its built-in email account.   If you specify DEVELOPER, Amazon Cognito emails your users with this address by calling Amazon SES on your behalf.  
     */
    SourceArn?: ArnType;
    /**
     * The destination to which the receiver of the email should reply to.
     */
    ReplyToEmailAddress?: EmailAddressType;
    /**
     * Specifies whether Amazon Cognito emails your users by using its built-in email functionality or your Amazon SES email configuration. Specify one of the following values:  COGNITO_DEFAULT  When Amazon Cognito emails your users, it uses its built-in email functionality. When you use the default option, Amazon Cognito allows only a limited number of emails each day for your user pool. For typical production environments, the default email limit is below the required delivery volume. To achieve a higher delivery volume, specify DEVELOPER to use your Amazon SES email configuration. To look up the email delivery limit for the default option, see Limits in Amazon Cognito in the Amazon Cognito Developer Guide. The default FROM address is no-reply@verificationemail.com. To customize the FROM address, provide the ARN of an Amazon SES verified email address for the SourceArn parameter.  If EmailSendingAccount is COGNITO_DEFAULT, the following parameters aren't allowed:   EmailVerificationMessage   EmailVerificationSubject   InviteMessageTemplate.EmailMessage   InviteMessageTemplate.EmailSubject   VerificationMessageTemplate.EmailMessage   VerificationMessageTemplate.EmailMessageByLink   VerificationMessageTemplate.EmailSubject,   VerificationMessageTemplate.EmailSubjectByLink    DEVELOPER EmailSendingAccount is required.   DEVELOPER  When Amazon Cognito emails your users, it uses your Amazon SES configuration. Amazon Cognito calls Amazon SES on your behalf to send email from your verified email address. When you use this option, the email delivery limits are the same limits that apply to your Amazon SES verified email address in your account. If you use this option, you must provide the ARN of an Amazon SES verified email address for the SourceArn parameter. Before Amazon Cognito can email your users, it requires additional permissions to call Amazon SES on your behalf. When you update your user pool with this option, Amazon Cognito creates a service-linked role, which is a type of IAM role, in your account. This role contains the permissions that allow Amazon Cognito to access Amazon SES and send email messages with your address. For more information about the service-linked role that Amazon Cognito creates, see Using Service-Linked Roles for Amazon Cognito in the Amazon Cognito Developer Guide.  
     */
    EmailSendingAccount?: EmailSendingAccountType;
    /**
     * Identifies either the sender’s email address or the sender’s name with their email address. For example, testuser@example.com or Test User &lt;testuser@example.com&gt;. This address will appear before the body of the email.
     */
    From?: StringType;
    /**
     * The set of configuration rules that can be applied to emails sent using Amazon SES. A configuration set is applied to an email by including a reference to the configuration set in the headers of the email. Once applied, all of the rules in that configuration set are applied to the email. Configuration sets can be used to apply the following types of rules to emails:    Event publishing – Amazon SES can track the number of send, delivery, open, click, bounce, and complaint events for each email sent. Use event publishing to send information about these events to other Amazon Web Services services such as SNS and CloudWatch.   IP pool management – When leasing dedicated IP addresses with Amazon SES, you can create groups of IP addresses, called dedicated IP pools. You can then associate the dedicated IP pools with configuration sets.  
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
     * The user's IP address.
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
     * The event feedback value.
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
  export type EventResponseType = "Success"|"Failure"|string;
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
  export type EventType = "SignIn"|"SignUp"|"ForgotPassword"|string;
  export type ExplicitAuthFlowsListType = ExplicitAuthFlowsType[];
  export type ExplicitAuthFlowsType = "ADMIN_NO_SRP_AUTH"|"CUSTOM_AUTH_FLOW_ONLY"|"USER_PASSWORD_AUTH"|"ALLOW_ADMIN_USER_PASSWORD_AUTH"|"ALLOW_CUSTOM_AUTH"|"ALLOW_USER_PASSWORD_AUTH"|"ALLOW_USER_SRP_AUTH"|"ALLOW_REFRESH_TOKEN_AUTH"|string;
  export type FeedbackValueType = "Valid"|"Invalid"|string;
  export type ForceAliasCreation = boolean;
  export interface ForgetDeviceRequest {
    /**
     * The access token for the forgotten device request.
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
     * Contextual data such as the user's device fingerprint, IP address, or location used for evaluating the risk of an unexpected event by Amazon Cognito advanced security.
     */
    UserContextData?: UserContextDataType;
    /**
     * The user name of the user for whom you want to enter a code to reset a forgotten password.
     */
    Username: UsernameType;
    /**
     * The Amazon Pinpoint analytics metadata for collecting metrics for ForgotPassword calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers.  You create custom workflows by assigning Lambda functions to user pool triggers. When you use the ForgotPassword API action, Amazon Cognito invokes any functions that are assigned to the following triggers: pre sign-up, custom message, and user migration. When Amazon Cognito invokes any of these functions, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your ForgotPassword request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see Customizing User Pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  Take the following limitations into consideration when you use the ClientMetadata parameter:   Amazon Cognito does not store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.   Amazon Cognito does not validate the ClientMetadata value.   Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.   
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
     * The header information for the .csv file for the user import job.
     */
    CSVHeader?: ListOfStringTypes;
  }
  export interface GetDeviceRequest {
    /**
     * The device key.
     */
    DeviceKey: DeviceKeyType;
    /**
     * The access token.
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
     * The identity provider ID.
     */
    IdpIdentifier: IdpIdentifierType;
  }
  export interface GetIdentityProviderByIdentifierResponse {
    /**
     * The identity provider object.
     */
    IdentityProvider: IdentityProviderType;
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
     * The access token returned by the server response to get the user attribute verification code.
     */
    AccessToken: TokenModelType;
    /**
     * The attribute name returned by the server response to get the user attribute verification code.
     */
    AttributeName: AttributeNameType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers.  You create custom workflows by assigning Lambda functions to user pool triggers. When you use the GetUserAttributeVerificationCode API action, Amazon Cognito invokes the function that is assigned to the custom message trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your GetUserAttributeVerificationCode request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see Customizing User Pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  Take the following limitations into consideration when you use the ClientMetadata parameter:   Amazon Cognito does not store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.   Amazon Cognito does not validate the ClientMetadata value.   Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.   
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
     * The SMS text message multi-factor (MFA) configuration.
     */
    SmsMfaConfiguration?: SmsMfaConfigType;
    /**
     * The software token multi-factor (MFA) configuration.
     */
    SoftwareTokenMfaConfiguration?: SoftwareTokenMfaConfigType;
    /**
     * The multi-factor (MFA) configuration. Valid values include:    OFF MFA will not be used for any users.    ON MFA is required for all users to sign in.    OPTIONAL MFA will be required only for individual users who have an MFA factor enabled.  
     */
    MfaConfiguration?: UserPoolMfaType;
  }
  export interface GetUserRequest {
    /**
     * The access token returned by the server response to get information about the user.
     */
    AccessToken: TokenModelType;
  }
  export interface GetUserResponse {
    /**
     * The user name of the user you wish to retrieve from the get user request.
     */
    Username: UsernameType;
    /**
     * An array of name-value pairs representing user attributes. For custom attributes, you must prepend the custom: prefix to the attribute name.
     */
    UserAttributes: AttributeListType;
    /**
     *  This response parameter is no longer supported. It provides information only about SMS MFA configurations. It doesn't provide information about TOTP software token MFA configurations. To look up information about either type of MFA configuration, use UserMFASettingList instead.
     */
    MFAOptions?: MFAOptionListType;
    /**
     * The user's preferred MFA setting.
     */
    PreferredMfaSetting?: StringType;
    /**
     * The MFA options that are enabled for the user. The possible values in this list are SMS_MFA and SOFTWARE_TOKEN_MFA.
     */
    UserMFASettingList?: UserMFASettingListType;
  }
  export interface GlobalSignOutRequest {
    /**
     * The access token.
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
     * The role ARN for the group.
     */
    RoleArn?: ArnType;
    /**
     * A nonnegative integer value that specifies the precedence of this group relative to the other groups that a user can belong to in the user pool. If a user belongs to two or more groups, it is the group with the highest precedence whose role ARN will be used in the cognito:roles and cognito:preferred_role claims in the user's tokens. Groups with higher Precedence values take precedence over groups with lower Precedence values or with null Precedence values. Two groups can have the same Precedence value. If this happens, neither group takes precedence over the other. If two groups with the same Precedence have the same role ARN, that role is used in the cognito:preferred_role claim in tokens for users in each group. If the two groups have different role ARNs, the cognito:preferred_role claim is not set in users' tokens. The default Precedence value is null.
     */
    Precedence?: PrecedenceType;
    /**
     * The date the group was last modified.
     */
    LastModifiedDate?: DateType;
    /**
     * The date the group was created.
     */
    CreationDate?: DateType;
  }
  export type HexStringType = string;
  export interface HttpHeader {
    /**
     * The header name
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
     * The identity provider name.
     */
    ProviderName?: ProviderNameType;
    /**
     * The identity provider type.
     */
    ProviderType?: IdentityProviderTypeType;
    /**
     * The identity provider details. The following list describes the provider detail keys for each identity provider type.   For Google and Login with Amazon:   client_id   client_secret   authorize_scopes     For Facebook:   client_id   client_secret   authorize_scopes   api_version     For Sign in with Apple:   client_id   team_id   key_id   private_key   authorize_scopes     For OIDC providers:   client_id   client_secret   attributes_request_method   oidc_issuer   authorize_scopes   authorize_url if not available from discovery URL specified by oidc_issuer key    token_url if not available from discovery URL specified by oidc_issuer key    attributes_url if not available from discovery URL specified by oidc_issuer key    jwks_uri if not available from discovery URL specified by oidc_issuer key      For SAML providers:   MetadataFile OR MetadataURL   IDPSignOut optional     
     */
    ProviderDetails?: ProviderDetailsType;
    /**
     * A mapping of identity provider attributes to standard and custom user pool attributes.
     */
    AttributeMapping?: AttributeMappingType;
    /**
     * A list of identity provider identifiers.
     */
    IdpIdentifiers?: IdpIdentifiersListType;
    /**
     * The date the identity provider was last modified.
     */
    LastModifiedDate?: DateType;
    /**
     * The date the identity provider was created.
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
     * The authentication flow for this call to execute. The API action will depend on this value. For example:     REFRESH_TOKEN_AUTH will take in a valid refresh token and return new tokens.    USER_SRP_AUTH will take in USERNAME and SRP_A and return the SRP variables to be used for next challenge execution.    USER_PASSWORD_AUTH will take in USERNAME and PASSWORD and return the next challenge or tokens.   Valid values include:    USER_SRP_AUTH: Authentication flow for the Secure Remote Password (SRP) protocol.    REFRESH_TOKEN_AUTH/REFRESH_TOKEN: Authentication flow for refreshing the access token and ID token by supplying a valid refresh token.    CUSTOM_AUTH: Custom authentication flow.    USER_PASSWORD_AUTH: Non-SRP authentication flow; USERNAME and PASSWORD are passed directly. If a user migration Lambda trigger is set, this flow will invoke the user migration Lambda if the USERNAME is not found in the user pool.     ADMIN_USER_PASSWORD_AUTH: Admin-based user password authentication. This replaces the ADMIN_NO_SRP_AUTH authentication flow. In this flow, Cognito receives the password in the request instead of using the SRP process to verify passwords.    ADMIN_NO_SRP_AUTH is not a valid value.
     */
    AuthFlow: AuthFlowType;
    /**
     * The authentication parameters. These are inputs corresponding to the AuthFlow that you are invoking. The required values depend on the value of AuthFlow:   For USER_SRP_AUTH: USERNAME (required), SRP_A (required), SECRET_HASH (required if the app client is configured with a client secret), DEVICE_KEY.   For REFRESH_TOKEN_AUTH/REFRESH_TOKEN: REFRESH_TOKEN (required), SECRET_HASH (required if the app client is configured with a client secret), DEVICE_KEY.   For CUSTOM_AUTH: USERNAME (required), SECRET_HASH (if app client is configured with client secret), DEVICE_KEY. To start the authentication flow with password verification, include ChallengeName: SRP_A and SRP_A: (The SRP_A Value).  
     */
    AuthParameters?: AuthParametersType;
    /**
     * A map of custom key-value pairs that you can provide as input for certain custom workflows that this action triggers. You create custom workflows by assigning Lambda functions to user pool triggers. When you use the InitiateAuth API action, Amazon Cognito invokes the Lambda functions that are specified for various triggers. The ClientMetadata value is passed as input to the functions for only the following triggers:   Pre signup   Pre authentication   User migration   When Amazon Cognito invokes the functions for these triggers, it passes a JSON payload, which the function receives as input. This payload contains a validationData attribute, which provides the data that you assigned to the ClientMetadata parameter in your InitiateAuth request. In your function code in Lambda, you can process the validationData value to enhance your workflow for your specific needs. When you use the InitiateAuth API action, Amazon Cognito also invokes the functions for the following triggers, but it does not provide the ClientMetadata value as input:   Post authentication   Custom message   Pre token generation   Create auth challenge   Define auth challenge   Verify auth challenge   For more information, see Customizing User Pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  Take the following limitations into consideration when you use the ClientMetadata parameter:   Amazon Cognito does not store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.   Amazon Cognito does not validate the ClientMetadata value.   Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
    /**
     * The app client ID.
     */
    ClientId: ClientIdType;
    /**
     * The Amazon Pinpoint analytics metadata for collecting metrics for InitiateAuth calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * Contextual data such as the user's device fingerprint, IP address, or location used for evaluating the risk of an unexpected event by Amazon Cognito advanced security.
     */
    UserContextData?: UserContextDataType;
  }
  export interface InitiateAuthResponse {
    /**
     * The name of the challenge which you are responding to with this call. This is returned to you in the AdminInitiateAuth response if you need to pass another challenge. Valid values include the following. Note that all of these challenges require USERNAME and SECRET_HASH (if applicable) in the parameters.    SMS_MFA: Next challenge is to supply an SMS_MFA_CODE, delivered via SMS.    PASSWORD_VERIFIER: Next challenge is to supply PASSWORD_CLAIM_SIGNATURE, PASSWORD_CLAIM_SECRET_BLOCK, and TIMESTAMP after the client-side SRP calculations.    CUSTOM_CHALLENGE: This is returned if your custom authentication flow determines that the user should pass another challenge before tokens are issued.    DEVICE_SRP_AUTH: If device tracking was enabled on your user pool and the previous challenges were passed, this challenge is returned so that Amazon Cognito can start tracking this device.    DEVICE_PASSWORD_VERIFIER: Similar to PASSWORD_VERIFIER, but for devices only.    NEW_PASSWORD_REQUIRED: For users who are required to change their passwords after successful first login. This challenge should be passed with NEW_PASSWORD and any other required attributes.    MFA_SETUP: For users who are required to setup an MFA factor before they can sign-in. The MFA types enabled for the user pool will be listed in the challenge parameters MFA_CAN_SETUP value.   To setup software token MFA, use the session returned here from InitiateAuth as an input to AssociateSoftwareToken, and use the session returned by VerifySoftwareToken as an input to RespondToAuthChallenge with challenge name MFA_SETUP to complete sign-in. To setup SMS MFA, users will need help from an administrator to add a phone number to their account and then call InitiateAuth again to restart sign-in.  
     */
    ChallengeName?: ChallengeNameType;
    /**
     * The session which should be passed both ways in challenge-response calls to the service. If the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next RespondToAuthChallenge API call.
     */
    Session?: SessionType;
    /**
     * The challenge parameters. These are returned to you in the InitiateAuth response if you need to pass another challenge. The responses in this parameter should be used to compute inputs to the next call (RespondToAuthChallenge).  All challenges require USERNAME and SECRET_HASH (if applicable).
     */
    ChallengeParameters?: ChallengeParametersType;
    /**
     * The result of the authentication response. This is only returned if the caller does not need to pass another challenge. If the caller does need to pass another challenge before it gets tokens, ChallengeName, ChallengeParameters, and Session are returned.
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
     * The Amazon Resource Name of Key Management Service Customer master keys . Amazon Cognito uses the key to encrypt codes and temporary passwords sent to CustomEmailSender and CustomSMSSender.
     */
    KMSKeyID?: ArnType;
  }
  export interface ListDevicesRequest {
    /**
     * The access tokens for the request to list devices.
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
     * The maximum number of identity providers to return.
     */
    MaxResults?: ListProvidersLimitType;
    /**
     * A pagination token.
     */
    NextToken?: PaginationKeyType;
  }
  export interface ListIdentityProvidersResponse {
    /**
     * A list of identity provider objects.
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
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    NextToken?: PaginationKey;
  }
  export interface ListUsersRequest {
    /**
     * The user pool ID for the user pool on which the search should be performed.
     */
    UserPoolId: UserPoolIdType;
    /**
     * An array of strings, where each string is the name of a user attribute to be returned for each user in the search results. If the array is null, all attributes are returned.
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
     * A filter string of the form "AttributeName Filter-Type "AttributeValue"". Quotation marks within the filter string must be escaped using the backslash (\) character. For example, "family_name = \"Reddy\"".    AttributeName: The name of the attribute to search for. You can only search for one attribute at a time.    Filter-Type: For an exact match, use =, for example, "given_name = \"Jon\"". For a prefix ("starts with") match, use ^=, for example, "given_name ^= \"Jon\"".     AttributeValue: The attribute value that must be matched for each user.   If the filter string is empty, ListUsers returns all users in the user pool. You can only search for the following standard attributes:    username (case-sensitive)    email     phone_number     name     given_name     family_name     preferred_username     cognito:user_status (called Status in the Console) (case-insensitive)    status (called Enabled in the Console) (case-sensitive)     sub    Custom attributes are not searchable. For more information, see Searching for Users Using the ListUsers API and Examples of Using the ListUsers API in the Amazon Cognito Developer Guide.
     */
    Filter?: UserFilterType;
  }
  export interface ListUsersResponse {
    /**
     * The users returned in the request to list users.
     */
    Users?: UsersListType;
    /**
     * An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.
     */
    PaginationToken?: SearchPaginationTokenType;
  }
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
     * The email address that is sending the email. It must be either individually verified with Amazon SES, or from a domain that has been verified with Amazon SES.
     */
    From?: StringType;
    /**
     * The destination to which the receiver of an email should reply to.
     */
    ReplyTo?: StringType;
    /**
     * The Amazon Resource Name (ARN) of the identity that is associated with the sending authorization policy. It permits Amazon Cognito to send for the email address specified in the From parameter.
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
     * The MFA email template used when MFA is challenged as part of a detected risk.
     */
    MfaEmail?: NotifyEmailType;
  }
  export interface NotifyEmailType {
    /**
     * The subject.
     */
    Subject: EmailNotificationSubjectType;
    /**
     * The HTML body.
     */
    HtmlBody?: EmailNotificationBodyType;
    /**
     * The text body.
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
     * The minimum length of the password policy that you have set. Cannot be less than 6.
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
     * In the password policy you have set, refers to the number of days a temporary password is valid. If the user does not sign-in during this time, their password will need to be reset by an administrator.  When you set TemporaryPasswordValidityDays for a user pool, you will no longer be able to set the deprecated UnusedAccountValidityDays value for that user pool. 
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
     * The identity provider name.
     */
    ProviderName?: ProviderNameType;
    /**
     * The identity provider type.
     */
    ProviderType?: IdentityProviderTypeType;
    /**
     * The date the provider was last modified.
     */
    LastModifiedDate?: DateType;
    /**
     * The date the provider was added to the user pool.
     */
    CreationDate?: DateType;
  }
  export type ProviderDetailsType = {[key: string]: StringType};
  export type ProviderNameType = string;
  export type ProviderNameTypeV1 = string;
  export interface ProviderUserIdentifierType {
    /**
     * The name of the provider, for example, Facebook, Google, or Login with Amazon.
     */
    ProviderName?: ProviderNameType;
    /**
     * The name of the provider attribute to link to, for example, NameID.
     */
    ProviderAttributeName?: StringType;
    /**
     * The value of the provider attribute to link to, for example, xxxxx_account.
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
     * Specifies the recovery method for a user.
     */
    Name: RecoveryOptionNameType;
  }
  export type RedirectUrlType = string;
  export type RefreshTokenValidityType = number;
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
     * Contextual data such as the user's device fingerprint, IP address, or location used for evaluating the risk of an unexpected event by Amazon Cognito advanced security.
     */
    UserContextData?: UserContextDataType;
    /**
     * The user name of the user to whom you wish to resend a confirmation code.
     */
    Username: UsernameType;
    /**
     * The Amazon Pinpoint analytics metadata for collecting metrics for ResendConfirmationCode calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers.  You create custom workflows by assigning Lambda functions to user pool triggers. When you use the ResendConfirmationCode API action, Amazon Cognito invokes the function that is assigned to the custom message trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your ResendConfirmationCode request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see Customizing User Pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  Take the following limitations into consideration when you use the ClientMetadata parameter:   Amazon Cognito does not store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.   Amazon Cognito does not validate the ClientMetadata value.   Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.   
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
     * The challenge name. For more information, see InitiateAuth.  ADMIN_NO_SRP_AUTH is not a valid value.
     */
    ChallengeName: ChallengeNameType;
    /**
     * The session which should be passed both ways in challenge-response calls to the service. If InitiateAuth or RespondToAuthChallenge API call determines that the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next RespondToAuthChallenge API call.
     */
    Session?: SessionType;
    /**
     * The challenge responses. These are inputs corresponding to the value of ChallengeName, for example:   SECRET_HASH (if app client is configured with client secret) applies to all inputs below (including SOFTWARE_TOKEN_MFA).     SMS_MFA: SMS_MFA_CODE, USERNAME.    PASSWORD_VERIFIER: PASSWORD_CLAIM_SIGNATURE, PASSWORD_CLAIM_SECRET_BLOCK, TIMESTAMP, USERNAME.    NEW_PASSWORD_REQUIRED: NEW_PASSWORD, any other required attributes, USERNAME.     SOFTWARE_TOKEN_MFA: USERNAME and SOFTWARE_TOKEN_MFA_CODE are required attributes.    DEVICE_SRP_AUTH requires USERNAME, DEVICE_KEY, SRP_A (and SECRET_HASH).    DEVICE_PASSWORD_VERIFIER requires everything that PASSWORD_VERIFIER requires plus DEVICE_KEY.    MFA_SETUP requires USERNAME, plus you need to use the session value returned by VerifySoftwareToken in the Session parameter.  
     */
    ChallengeResponses?: ChallengeResponsesType;
    /**
     * The Amazon Pinpoint analytics metadata for collecting metrics for RespondToAuthChallenge calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * Contextual data such as the user's device fingerprint, IP address, or location used for evaluating the risk of an unexpected event by Amazon Cognito advanced security.
     */
    UserContextData?: UserContextDataType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers.  You create custom workflows by assigning Lambda functions to user pool triggers. When you use the RespondToAuthChallenge API action, Amazon Cognito invokes any functions that are assigned to the following triggers: post authentication, pre token generation, define auth challenge, create auth challenge, and verify auth challenge. When Amazon Cognito invokes any of these functions, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your RespondToAuthChallenge request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see Customizing User Pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  Take the following limitations into consideration when you use the ClientMetadata parameter:   Amazon Cognito does not store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.   Amazon Cognito does not validate the ClientMetadata value.   Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.   
     */
    ClientMetadata?: ClientMetadataType;
  }
  export interface RespondToAuthChallengeResponse {
    /**
     * The challenge name. For more information, see InitiateAuth.
     */
    ChallengeName?: ChallengeNameType;
    /**
     * The session which should be passed both ways in challenge-response calls to the service. If the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next RespondToAuthChallenge API call.
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
     * The token that you want to revoke.
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
     * The compromised credentials risk configuration object including the EventFilter and the EventAction 
     */
    CompromisedCredentialsRiskConfiguration?: CompromisedCredentialsRiskConfigurationType;
    /**
     * The account takeover risk configuration object including the NotifyConfiguration object and Actions to take in the case of an account takeover.
     */
    AccountTakeoverRiskConfiguration?: AccountTakeoverRiskConfigurationType;
    /**
     * The configuration to override the risk decision.
     */
    RiskExceptionConfiguration?: RiskExceptionConfigurationType;
    /**
     * The last modified date.
     */
    LastModifiedDate?: DateType;
  }
  export type RiskDecisionType = "NoRisk"|"AccountTakeover"|"Block"|string;
  export interface RiskExceptionConfigurationType {
    /**
     * Overrides the risk decision to always block the pre-authentication requests. The IP range is in CIDR notation: a compact representation of an IP address and its associated routing prefix.
     */
    BlockedIPRangeList?: BlockedIPRangeListType;
    /**
     * Risk detection is not performed on the IP addresses in the range list. The IP range is in CIDR notation.
     */
    SkippedIPRangeList?: SkippedIPRangeListType;
  }
  export type RiskLevelType = "Low"|"Medium"|"High"|string;
  export type S3BucketType = string;
  export type SESConfigurationSet = string;
  export interface SMSMfaSettingsType {
    /**
     * Specifies whether SMS text message MFA is enabled. If an MFA type is enabled for a user, the user will be prompted for MFA during all sign in attempts, unless device tracking is turned on and the device has been trusted.
     */
    Enabled?: BooleanType;
    /**
     * Specifies whether SMS is the preferred MFA method.
     */
    PreferredMfa?: BooleanType;
  }
  export interface SchemaAttributeType {
    /**
     * A schema attribute of the name type.
     */
    Name?: CustomAttributeNameType;
    /**
     * The attribute data type.
     */
    AttributeDataType?: AttributeDataType;
    /**
     *  We recommend that you use WriteAttributes in the user pool client to control how attributes can be mutated for new use cases instead of using DeveloperOnlyAttribute.  Specifies whether the attribute type is developer only. This attribute can only be modified by an administrator. Users will not be able to modify this attribute using their access token. For example, DeveloperOnlyAttribute can be modified using AdminUpdateUserAttributes but cannot be updated using UpdateUserAttributes.
     */
    DeveloperOnlyAttribute?: BooleanType;
    /**
     * Specifies whether the value of the attribute can be changed. For any user pool attribute that's mapped to an identity provider attribute, you must set this parameter to true. Amazon Cognito updates mapped attributes when users sign in to your application through an identity provider. If an attribute is immutable, Amazon Cognito throws an error when it attempts to update the attribute. For more information, see Specifying Identity Provider Attribute Mappings for Your User Pool.
     */
    Mutable?: BooleanType;
    /**
     * Specifies whether a user pool attribute is required. If the attribute is required and the user does not provide a value, registration or sign-in will fail.
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
  export interface SetRiskConfigurationRequest {
    /**
     * The user pool ID. 
     */
    UserPoolId: UserPoolIdType;
    /**
     * The app client ID. If ClientId is null, then the risk configuration is mapped to userPoolId. When the client ID is null, the same risk configuration is applied to all the clients in the userPool. Otherwise, ClientId is mapped to the client. When the client ID is not null, the user pool configuration is overridden and the risk configuration for the client is used instead.
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
     * The time-based one-time password software token MFA settings.
     */
    SoftwareTokenMfaSettings?: SoftwareTokenMfaSettingsType;
    /**
     * The access token for the user.
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
     * The MFA configuration. Users who don't have an MFA factor set up won't be able to sign-in if you set the MfaConfiguration value to ‘ON’. See Adding Multi-Factor Authentication (MFA) to a User Pool to learn more. Valid values include:    OFF MFA will not be used for any users.    ON MFA is required for all users to sign in.    OPTIONAL MFA will be required only for individual users who have an MFA factor enabled.  
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
     * The MFA configuration. Valid values include:    OFF MFA will not be used for any users.    ON MFA is required for all users to sign in.    OPTIONAL MFA will be required only for individual users who have an MFA factor enabled.  
     */
    MfaConfiguration?: UserPoolMfaType;
  }
  export interface SetUserSettingsRequest {
    /**
     * The access token for the set user settings request.
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
     * The user name of the user you wish to register.
     */
    Username: UsernameType;
    /**
     * The password of the user you wish to register.
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
     * The Amazon Pinpoint analytics metadata for collecting metrics for SignUp calls.
     */
    AnalyticsMetadata?: AnalyticsMetadataType;
    /**
     * Contextual data such as the user's device fingerprint, IP address, or location used for evaluating the risk of an unexpected event by Amazon Cognito advanced security.
     */
    UserContextData?: UserContextDataType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers.  You create custom workflows by assigning Lambda functions to user pool triggers. When you use the SignUp API action, Amazon Cognito invokes any functions that are assigned to the following triggers: pre sign-up, custom message, and post confirmation. When Amazon Cognito invokes any of these functions, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your SignUp request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see Customizing User Pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  Take the following limitations into consideration when you use the ClientMetadata parameter:   Amazon Cognito does not store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.   Amazon Cognito does not validate the ClientMetadata value.   Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.   
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
     * The UUID of the authenticated user. This is not the same as username.
     */
    UserSub: StringType;
  }
  export type SkippedIPRangeListType = StringType[];
  export interface SmsConfigurationType {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Simple Notification Service (SNS) caller. This is the ARN of the IAM role in your account which Cognito will use to send SMS messages. SMS messages are subject to a spending limit. 
     */
    SnsCallerArn: ArnType;
    /**
     * The external ID is a value that we recommend you use to add security to your IAM role which is used to call Amazon SNS to send SMS messages for your user pool. If you provide an ExternalId, the Cognito User Pool will include it when attempting to assume your IAM role, so that you can set your roles trust policy to require the ExternalID. If you use the Cognito Management Console to create a role for SMS MFA, Cognito will create a role with the required permissions and a trust policy that demonstrates use of the ExternalId. For more information about the ExternalId of a role, see How to use an external ID when granting access to your Amazon Web Services resources to a third party 
     */
    ExternalId?: StringType;
  }
  export interface SmsMfaConfigType {
    /**
     * The SMS authentication message that will be sent to users with the code they need to sign in. The message must contain the ‘{####}’ placeholder, which will be replaced with the code. If the message is not included, and default message will be used.
     */
    SmsAuthenticationMessage?: SmsVerificationMessageType;
    /**
     * The SMS configuration.
     */
    SmsConfiguration?: SmsConfigurationType;
  }
  export type SmsVerificationMessageType = string;
  export type SoftwareTokenMFAUserCodeType = string;
  export interface SoftwareTokenMfaConfigType {
    /**
     * Specifies whether software token MFA is enabled.
     */
    Enabled?: BooleanType;
  }
  export interface SoftwareTokenMfaSettingsType {
    /**
     * Specifies whether software token MFA is enabled. If an MFA type is enabled for a user, the user will be prompted for MFA during all sign in attempts, unless device tracking is turned on and the device has been trusted.
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
     *  A time unit in “seconds”, “minutes”, “hours” or “days” for the value in AccessTokenValidity, defaults to hours.
     */
    AccessToken?: TimeUnitsType;
    /**
     * A time unit in “seconds”, “minutes”, “hours” or “days” for the value in IdTokenValidity, defaults to hours.
     */
    IdToken?: TimeUnitsType;
    /**
     * A time unit in “seconds”, “minutes”, “hours” or “days” for the value in RefreshTokenValidity, defaults to days.
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
     * The last-modified date for the UI customization.
     */
    LastModifiedDate?: DateType;
    /**
     * The creation date for the UI customization.
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
     * The authentication event feedback value.
     */
    FeedbackValue: FeedbackValueType;
  }
  export interface UpdateAuthEventFeedbackResponse {
  }
  export interface UpdateDeviceStatusRequest {
    /**
     * The access token.
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
     * The new role ARN for the group. This is used for setting the cognito:roles and cognito:preferred_role claims in the token.
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
     * The identity provider name.
     */
    ProviderName: ProviderNameType;
    /**
     * The identity provider details to be updated, such as MetadataURL and MetadataFile.
     */
    ProviderDetails?: ProviderDetailsType;
    /**
     * The identity provider attribute mapping to be changed.
     */
    AttributeMapping?: AttributeMappingType;
    /**
     * A list of identity provider identifiers.
     */
    IdpIdentifiers?: IdpIdentifiersListType;
  }
  export interface UpdateIdentityProviderResponse {
    /**
     * The identity provider object.
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
     * An array of name-value pairs representing user attributes. For custom attributes, you must prepend the custom: prefix to the attribute name.
     */
    UserAttributes: AttributeListType;
    /**
     * The access token for the request to update user attributes.
     */
    AccessToken: TokenModelType;
    /**
     * A map of custom key-value pairs that you can provide as input for any custom workflows that this action triggers.  You create custom workflows by assigning Lambda functions to user pool triggers. When you use the UpdateUserAttributes API action, Amazon Cognito invokes the function that is assigned to the custom message trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a clientMetadata attribute, which provides the data that you assigned to the ClientMetadata parameter in your UpdateUserAttributes request. In your function code in Lambda, you can process the clientMetadata value to enhance your workflow for your specific needs. For more information, see Customizing User Pool Workflows with Lambda Triggers in the Amazon Cognito Developer Guide.  Take the following limitations into consideration when you use the ClientMetadata parameter:   Amazon Cognito does not store the ClientMetadata value. This data is available only to Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.   Amazon Cognito does not validate the ClientMetadata value.   Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.   
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
     * The time limit, in days, after which the refresh token is no longer valid and cannot be used.
     */
    RefreshTokenValidity?: RefreshTokenValidityType;
    /**
     * The time limit, after which the access token is no longer valid and cannot be used.
     */
    AccessTokenValidity?: AccessTokenValidityType;
    /**
     * The time limit, after which the ID token is no longer valid and cannot be used.
     */
    IdTokenValidity?: IdTokenValidityType;
    /**
     * The units in which the validity times are represented in. Default for RefreshToken is days, and default for ID and access tokens are hours.
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
     * The authentication flows that are supported by the user pool clients. Flow names without the ALLOW_ prefix are deprecated in favor of new names with the ALLOW_ prefix. Note that values with ALLOW_ prefix cannot be used along with values without ALLOW_ prefix. Valid values include:    ALLOW_ADMIN_USER_PASSWORD_AUTH: Enable admin based user password authentication flow ADMIN_USER_PASSWORD_AUTH. This setting replaces the ADMIN_NO_SRP_AUTH setting. With this authentication flow, Cognito receives the password in the request instead of using the SRP (Secure Remote Password protocol) protocol to verify passwords.    ALLOW_CUSTOM_AUTH: Enable Lambda trigger based authentication.    ALLOW_USER_PASSWORD_AUTH: Enable user password-based authentication. In this flow, Cognito receives the password in the request instead of using the SRP protocol to verify passwords.    ALLOW_USER_SRP_AUTH: Enable SRP based authentication.    ALLOW_REFRESH_TOKEN_AUTH: Enable authflow to refresh tokens.  
     */
    ExplicitAuthFlows?: ExplicitAuthFlowsListType;
    /**
     * A list of provider names for the identity providers that are supported on this client.
     */
    SupportedIdentityProviders?: SupportedIdentityProvidersListType;
    /**
     * A list of allowed redirect (callback) URLs for the identity providers. A redirect URI must:   Be an absolute URI.   Be registered with the authorization server.   Not include a fragment component.   See OAuth 2.0 - Redirection Endpoint. Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only. App callback URLs such as myapp://example are also supported.
     */
    CallbackURLs?: CallbackURLsListType;
    /**
     * A list of allowed logout URLs for the identity providers.
     */
    LogoutURLs?: LogoutURLsListType;
    /**
     * The default redirect URI. Must be in the CallbackURLs list. A redirect URI must:   Be an absolute URI.   Be registered with the authorization server.   Not include a fragment component.   See OAuth 2.0 - Redirection Endpoint. Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only. App callback URLs such as myapp://example are also supported.
     */
    DefaultRedirectURI?: RedirectUrlType;
    /**
     * The allowed OAuth flows. Set to code to initiate a code grant flow, which provides an authorization code as the response. This code can be exchanged for access tokens with the token endpoint. Set to implicit to specify that the client should get the access token (and, optionally, ID token, based on scopes) directly. Set to client_credentials to specify that the client should get the access token (and, optionally, ID token, based on scopes) from the token endpoint using a combination of client and client_secret.
     */
    AllowedOAuthFlows?: OAuthFlowsType;
    /**
     * The allowed OAuth scopes. Possible values provided by OAuth are: phone, email, openid, and profile. Possible values provided by Amazon Web Services are: aws.cognito.signin.user.admin. Custom scopes created in Resource Servers are also supported.
     */
    AllowedOAuthScopes?: ScopeListType;
    /**
     * Set to true if the client is allowed to follow the OAuth protocol when interacting with Cognito user pools.
     */
    AllowedOAuthFlowsUserPoolClient?: BooleanType;
    /**
     * The Amazon Pinpoint analytics configuration for collecting metrics for this user pool.  In regions where Pinpoint is not available, Cognito User Pools only supports sending events to Amazon Pinpoint projects in us-east-1. In regions where Pinpoint is available, Cognito User Pools will support sending events to Amazon Pinpoint projects within that same region.  
     */
    AnalyticsConfiguration?: AnalyticsConfigurationType;
    /**
     * Use this setting to choose which errors and responses are returned by Cognito APIs during authentication, account confirmation, and password recovery when the user does not exist in the user pool. When set to ENABLED and the user does not exist, authentication returns an error indicating either the username or password was incorrect, and account confirmation and password recovery return a response indicating a code was sent to a simulated destination. When set to LEGACY, those APIs will return a UserNotFoundException exception if the user does not exist in the user pool. Valid values include:    ENABLED - This prevents user existence-related errors.    LEGACY - This represents the old behavior of Cognito where user existence related errors are not prevented.    After February 15th 2020, the value of PreventUserExistenceErrors will default to ENABLED for newly created user pool clients if no value is provided. 
     */
    PreventUserExistenceErrors?: PreventUserExistenceErrorTypes;
    /**
     * Enables or disables token revocation. For more information about revoking tokens, see RevokeToken.
     */
    EnableTokenRevocation?: WrappedBooleanType;
  }
  export interface UpdateUserPoolClientResponse {
    /**
     * The user pool client value from the response from the server when an update user pool client request is made.
     */
    UserPoolClient?: UserPoolClientType;
  }
  export interface UpdateUserPoolDomainRequest {
    /**
     * The domain name for the custom domain that hosts the sign-up and sign-in pages for your application. For example: auth.example.com.  This string can include only lowercase letters, numbers, and hyphens. Do not use a hyphen for the first or last character. Use periods to separate subdomain names.
     */
    Domain: DomainType;
    /**
     * The ID of the user pool that is associated with the custom domain that you are updating the certificate for.
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
     * A container with the policies you wish to update in a user pool.
     */
    Policies?: UserPoolPolicyType;
    /**
     * The Lambda configuration information from the request to update the user pool.
     */
    LambdaConfig?: LambdaConfigType;
    /**
     * The attributes that are automatically verified when the Amazon Cognito service makes a request to update user pools.
     */
    AutoVerifiedAttributes?: VerifiedAttributesListType;
    /**
     * A container with information about the SMS verification message.
     */
    SmsVerificationMessage?: SmsVerificationMessageType;
    /**
     * The contents of the email verification message.
     */
    EmailVerificationMessage?: EmailVerificationMessageType;
    /**
     * The subject of the email verification message.
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
     * Can be one of the following values:    OFF - MFA tokens are not required and cannot be specified during user registration.    ON - MFA tokens are required for all user registrations. You can only specify ON when you are initially creating a user pool. You can use the SetUserPoolMfaConfig API operation to turn MFA "ON" for existing user pools.     OPTIONAL - Users have the option when registering to create an MFA token.  
     */
    MfaConfiguration?: UserPoolMfaType;
    /**
     * Device configuration.
     */
    DeviceConfiguration?: DeviceConfigurationType;
    /**
     * Email configuration.
     */
    EmailConfiguration?: EmailConfigurationType;
    /**
     * SMS configuration.
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
     * Used to enable advanced security risk detection. Set the key AdvancedSecurityMode to the value "AUDIT".
     */
    UserPoolAddOns?: UserPoolAddOnsType;
    /**
     * Use this setting to define which verified available method a user can use to recover their password when they call ForgotPassword. It allows you to define a preferred method when a user has more than one method available. With this setting, SMS does not qualify for a valid password recovery mechanism if the user also has SMS MFA enabled. In the absence of this setting, Cognito uses the legacy behavior to determine the recovery method where SMS is preferred over email.
     */
    AccountRecoverySetting?: AccountRecoverySettingType;
  }
  export interface UpdateUserPoolResponse {
  }
  export interface UserContextDataType {
    /**
     * Contextual data such as the user's device fingerprint, IP address, or location used for evaluating the risk of an unexpected event by Amazon Cognito advanced security.
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
     * The date the user import job was created.
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
     * The status of the user import job. One of the following:    Created - The job was created but not started.    Pending - A transition state. You have started the job, but it has not begun importing users yet.    InProgress - The job has started, and users are being imported.    Stopping - You have stopped the job, but the job has not stopped importing users yet.    Stopped - You have stopped the job, and the job has stopped importing users.    Succeeded - The job has completed successfully.    Failed - The job has stopped due to an error.    Expired - You created a job, but did not start the job within 24-48 hours. All data associated with the job was deleted, and the job cannot be started.  
     */
    Status?: UserImportJobStatusType;
    /**
     * The role ARN for the Amazon CloudWatch Logging role for the user import job. For more information, see "Creating the CloudWatch Logs IAM Role" in the Amazon Cognito Developer Guide.
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
     * The number of users that could not be imported.
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
     * The advanced security mode.
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
     * The date the user pool client was last modified.
     */
    LastModifiedDate?: DateType;
    /**
     * The date the user pool client was created.
     */
    CreationDate?: DateType;
    /**
     * The time limit, in days, after which the refresh token is no longer valid and cannot be used.
     */
    RefreshTokenValidity?: RefreshTokenValidityType;
    /**
     * The time limit, specified by tokenValidityUnits, defaulting to hours, after which the access token is no longer valid and cannot be used.
     */
    AccessTokenValidity?: AccessTokenValidityType;
    /**
     * The time limit, specified by tokenValidityUnits, defaulting to hours, after which the refresh token is no longer valid and cannot be used.
     */
    IdTokenValidity?: IdTokenValidityType;
    /**
     * The time units used to specify the token validity times of their respective token.
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
     * The authentication flows that are supported by the user pool clients. Flow names without the ALLOW_ prefix are deprecated in favor of new names with the ALLOW_ prefix. Note that values with ALLOW_ prefix cannot be used along with values without ALLOW_ prefix. Valid values include:    ALLOW_ADMIN_USER_PASSWORD_AUTH: Enable admin based user password authentication flow ADMIN_USER_PASSWORD_AUTH. This setting replaces the ADMIN_NO_SRP_AUTH setting. With this authentication flow, Cognito receives the password in the request instead of using the SRP (Secure Remote Password protocol) protocol to verify passwords.    ALLOW_CUSTOM_AUTH: Enable Lambda trigger based authentication.    ALLOW_USER_PASSWORD_AUTH: Enable user password-based authentication. In this flow, Cognito receives the password in the request instead of using the SRP protocol to verify passwords.    ALLOW_USER_SRP_AUTH: Enable SRP based authentication.    ALLOW_REFRESH_TOKEN_AUTH: Enable authflow to refresh tokens.  
     */
    ExplicitAuthFlows?: ExplicitAuthFlowsListType;
    /**
     * A list of provider names for the identity providers that are supported on this client.
     */
    SupportedIdentityProviders?: SupportedIdentityProvidersListType;
    /**
     * A list of allowed redirect (callback) URLs for the identity providers. A redirect URI must:   Be an absolute URI.   Be registered with the authorization server.   Not include a fragment component.   See OAuth 2.0 - Redirection Endpoint. Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only. App callback URLs such as myapp://example are also supported.
     */
    CallbackURLs?: CallbackURLsListType;
    /**
     * A list of allowed logout URLs for the identity providers.
     */
    LogoutURLs?: LogoutURLsListType;
    /**
     * The default redirect URI. Must be in the CallbackURLs list. A redirect URI must:   Be an absolute URI.   Be registered with the authorization server.   Not include a fragment component.   See OAuth 2.0 - Redirection Endpoint. Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only. App callback URLs such as myapp://example are also supported.
     */
    DefaultRedirectURI?: RedirectUrlType;
    /**
     * The allowed OAuth flows. Set to code to initiate a code grant flow, which provides an authorization code as the response. This code can be exchanged for access tokens with the token endpoint. Set to implicit to specify that the client should get the access token (and, optionally, ID token, based on scopes) directly. Set to client_credentials to specify that the client should get the access token (and, optionally, ID token, based on scopes) from the token endpoint using a combination of client and client_secret.
     */
    AllowedOAuthFlows?: OAuthFlowsType;
    /**
     * The allowed OAuth scopes. Possible values provided by OAuth are: phone, email, openid, and profile. Possible values provided by Amazon Web Services are: aws.cognito.signin.user.admin. Custom scopes created in Resource Servers are also supported.
     */
    AllowedOAuthScopes?: ScopeListType;
    /**
     * Set to true if the client is allowed to follow the OAuth protocol when interacting with Cognito user pools.
     */
    AllowedOAuthFlowsUserPoolClient?: BooleanType;
    /**
     * The Amazon Pinpoint analytics configuration for the user pool client.  Cognito User Pools only supports sending events to Amazon Pinpoint projects in the US East (N. Virginia) us-east-1 Region, regardless of the region in which the user pool resides. 
     */
    AnalyticsConfiguration?: AnalyticsConfigurationType;
    /**
     * Use this setting to choose which errors and responses are returned by Cognito APIs during authentication, account confirmation, and password recovery when the user does not exist in the user pool. When set to ENABLED and the user does not exist, authentication returns an error indicating either the username or password was incorrect, and account confirmation and password recovery return a response indicating a code was sent to a simulated destination. When set to LEGACY, those APIs will return a UserNotFoundException exception if the user does not exist in the user pool. Valid values include:    ENABLED - This prevents user existence-related errors.    LEGACY - This represents the old behavior of Cognito where user existence related errors are not prevented.    After February 15th 2020, the value of PreventUserExistenceErrors will default to ENABLED for newly created user pool clients if no value is provided. 
     */
    PreventUserExistenceErrors?: PreventUserExistenceErrorTypes;
    /**
     * Indicates whether token revocation is enabled for the user pool client. When you create a new user pool client, token revocation is enabled by default. For more information about revoking tokens, see RevokeToken.
     */
    EnableTokenRevocation?: WrappedBooleanType;
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
     * The date the user pool description was last modified.
     */
    LastModifiedDate?: DateType;
    /**
     * The date the user pool description was created.
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
     * The Lambda triggers associated with the user pool.
     */
    LambdaConfig?: LambdaConfigType;
    /**
     * The status of a user pool.
     */
    Status?: StatusType;
    /**
     * The date the user pool was last modified.
     */
    LastModifiedDate?: DateType;
    /**
     * The date the user pool was created.
     */
    CreationDate?: DateType;
    /**
     * A container with the schema attributes of a user pool.
     */
    SchemaAttributes?: SchemaAttributesListType;
    /**
     * Specifies the attributes that are auto-verified in a user pool.
     */
    AutoVerifiedAttributes?: VerifiedAttributesListType;
    /**
     * Specifies the attributes that are aliased in a user pool.
     */
    AliasAttributes?: AliasAttributesListType;
    /**
     * Specifies whether email addresses or phone numbers can be specified as usernames when a user signs up.
     */
    UsernameAttributes?: UsernameAttributesListType;
    /**
     * The contents of the SMS verification message.
     */
    SmsVerificationMessage?: SmsVerificationMessageType;
    /**
     * The contents of the email verification message.
     */
    EmailVerificationMessage?: EmailVerificationMessageType;
    /**
     * The subject of the email verification message.
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
     * Can be one of the following values:    OFF - MFA tokens are not required and cannot be specified during user registration.    ON - MFA tokens are required for all user registrations. You can only specify required when you are initially creating a user pool.    OPTIONAL - Users have the option when registering to create an MFA token.  
     */
    MfaConfiguration?: UserPoolMfaType;
    /**
     * The device configuration.
     */
    DeviceConfiguration?: DeviceConfigurationType;
    /**
     * A number estimating the size of the user pool.
     */
    EstimatedNumberOfUsers?: IntegerType;
    /**
     * The email configuration.
     */
    EmailConfiguration?: EmailConfigurationType;
    /**
     * The SMS configuration.
     */
    SmsConfiguration?: SmsConfigurationType;
    /**
     * The tags that are assigned to the user pool. A tag is a label that you can apply to user pools to categorize and manage them in different ways, such as by purpose, owner, environment, or other criteria.
     */
    UserPoolTags?: UserPoolTagsType;
    /**
     * The reason why the SMS configuration cannot send the messages to your users. This message might include comma-separated values to describe why your SMS configuration can't send messages to user pool end users.   InvalidSmsRoleAccessPolicyException - The IAM role which Cognito uses to send SMS messages is not properly configured. For more information, see SmsConfigurationType.   SNSSandbox - The account is in SNS Sandbox and messages won’t reach unverified end users. This parameter won’t get populated with SNSSandbox if the IAM user creating the user pool doesn’t have SNS permissions. To learn how to move your account out of the sandbox, see Moving out of the SMS sandbox.  
     */
    SmsConfigurationFailure?: StringType;
    /**
     * The reason why the email configuration cannot send the messages to your users.
     */
    EmailConfigurationFailure?: StringType;
    /**
     * Holds the domain prefix if the user pool has a domain associated with it.
     */
    Domain?: DomainType;
    /**
     * A custom domain name that you provide to Amazon Cognito. This parameter applies only if you use a custom domain to host the sign-up and sign-in pages for your application. For example: auth.example.com. For more information about adding a custom domain to your user pool, see Using Your Own Domain for the Hosted UI.
     */
    CustomDomain?: DomainType;
    /**
     * The configuration for AdminCreateUser requests.
     */
    AdminCreateUserConfig?: AdminCreateUserConfigType;
    /**
     * The user pool add-ons.
     */
    UserPoolAddOns?: UserPoolAddOnsType;
    /**
     * You can choose to enable case sensitivity on the username input for the selected sign-in option. For example, when this is set to False, users will be able to sign in using either "username" or "Username". This configuration is immutable once it has been set. For more information, see UsernameConfigurationType.
     */
    UsernameConfiguration?: UsernameConfigurationType;
    /**
     * The Amazon Resource Name (ARN) for the user pool.
     */
    Arn?: ArnType;
    /**
     * Use this setting to define which verified available method a user can use to recover their password when they call ForgotPassword. It allows you to define a preferred method when a user has more than one method available. With this setting, SMS does not qualify for a valid password recovery mechanism if the user also has SMS MFA enabled. In the absence of this setting, Cognito uses the legacy behavior to determine the recovery method where SMS is preferred over email.
     */
    AccountRecoverySetting?: AccountRecoverySettingType;
  }
  export type UserStatusType = "UNCONFIRMED"|"CONFIRMED"|"ARCHIVED"|"COMPROMISED"|"UNKNOWN"|"RESET_REQUIRED"|"FORCE_CHANGE_PASSWORD"|string;
  export interface UserType {
    /**
     * The user name of the user you wish to describe.
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
     * The last modified date of the user.
     */
    UserLastModifiedDate?: DateType;
    /**
     * Specifies whether the user is enabled.
     */
    Enabled?: BooleanType;
    /**
     * The user status. Can be one of the following:   UNCONFIRMED - User has been created but not confirmed.   CONFIRMED - User has been confirmed.   ARCHIVED - User is no longer active.   COMPROMISED - User is disabled due to a potential security threat.   UNKNOWN - User status is not known.   RESET_REQUIRED - User is confirmed, but the user must request a code and reset his or her password before he or she can sign in.   FORCE_CHANGE_PASSWORD - The user is confirmed and the user can sign in using a temporary password, but on first sign-in, the user must change his or her password to a new value before doing anything else.   
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
     * Specifies whether username case sensitivity will be applied for all users in the user pool through Cognito APIs. Valid values include:     True : Enables case sensitivity for all username input. When this option is set to True, users must sign in using the exact capitalization of their given username. For example, “UserName”. This is the default value.     False : Enables case insensitivity for all username input. For example, when this option is set to False, users will be able to sign in using either "username" or "Username". This option also enables both preferred_username and email alias to be case insensitive, in addition to the username attribute.  
     */
    CaseSensitive: WrappedBooleanType;
  }
  export type UsernameType = string;
  export type UsersListType = UserType[];
  export interface VerificationMessageTemplateType {
    /**
     * The SMS message template.
     */
    SmsMessage?: SmsVerificationMessageType;
    /**
     * The email message template. EmailMessage is allowed only if  EmailSendingAccount is DEVELOPER. 
     */
    EmailMessage?: EmailVerificationMessageType;
    /**
     * The subject line for the email message template. EmailSubject is allowed only if EmailSendingAccount is DEVELOPER. 
     */
    EmailSubject?: EmailVerificationSubjectType;
    /**
     * The email message template for sending a confirmation link to the user. EmailMessageByLink is allowed only if  EmailSendingAccount is DEVELOPER.
     */
    EmailMessageByLink?: EmailVerificationMessageByLinkType;
    /**
     * The subject line for the email message template for sending a confirmation link to the user. EmailSubjectByLink is allowed only  EmailSendingAccount is DEVELOPER.
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
     * The access token.
     */
    AccessToken?: TokenModelType;
    /**
     * The session which should be passed both ways in challenge-response calls to the service.
     */
    Session?: SessionType;
    /**
     * The one time password computed using the secret code returned by AssociateSoftwareToken".
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
     * The session which should be passed both ways in challenge-response calls to the service.
     */
    Session?: SessionType;
  }
  export type VerifySoftwareTokenResponseType = "SUCCESS"|"ERROR"|string;
  export interface VerifyUserAttributeRequest {
    /**
     * Represents the access token of the request to verify user attributes.
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
