import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Organizations extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Organizations.Types.ClientConfiguration)
  config: Config & Organizations.Types.ClientConfiguration;
  /**
   * Sends a response to the originator of a handshake agreeing to the action proposed by the handshake request. You can only call this operation by the following principals when they also have the relevant IAM permissions:    Invitation to join or Approve all features request handshakes: only a principal from the member account. The user who calls the API for an invitation to join must have the organizations:AcceptHandshake permission. If you enabled all features in the organization, the user must also have the iam:CreateServiceLinkedRole permission so that Organizations can create the required service-linked role named AWSServiceRoleForOrganizations. For more information, see Organizations and service-linked roles in the Organizations User Guide.    Enable all features final confirmation handshake: only a principal from the management account. For more information about invitations, see Inviting an Amazon Web Services account to join your organization in the Organizations User Guide. For more information about requests to enable all features in the organization, see Enabling all features in your organization in the Organizations User Guide.   After you accept a handshake, it continues to appear in the results of relevant APIs for only 30 days. After that, it's deleted.
   */
  acceptHandshake(params: Organizations.Types.AcceptHandshakeRequest, callback?: (err: AWSError, data: Organizations.Types.AcceptHandshakeResponse) => void): Request<Organizations.Types.AcceptHandshakeResponse, AWSError>;
  /**
   * Sends a response to the originator of a handshake agreeing to the action proposed by the handshake request. You can only call this operation by the following principals when they also have the relevant IAM permissions:    Invitation to join or Approve all features request handshakes: only a principal from the member account. The user who calls the API for an invitation to join must have the organizations:AcceptHandshake permission. If you enabled all features in the organization, the user must also have the iam:CreateServiceLinkedRole permission so that Organizations can create the required service-linked role named AWSServiceRoleForOrganizations. For more information, see Organizations and service-linked roles in the Organizations User Guide.    Enable all features final confirmation handshake: only a principal from the management account. For more information about invitations, see Inviting an Amazon Web Services account to join your organization in the Organizations User Guide. For more information about requests to enable all features in the organization, see Enabling all features in your organization in the Organizations User Guide.   After you accept a handshake, it continues to appear in the results of relevant APIs for only 30 days. After that, it's deleted.
   */
  acceptHandshake(callback?: (err: AWSError, data: Organizations.Types.AcceptHandshakeResponse) => void): Request<Organizations.Types.AcceptHandshakeResponse, AWSError>;
  /**
   * Attaches a policy to a root, an organizational unit (OU), or an individual account. How the policy affects accounts depends on the type of policy. Refer to the Organizations User Guide for information about each policy type:    AISERVICES_OPT_OUT_POLICY     BACKUP_POLICY     SERVICE_CONTROL_POLICY     TAG_POLICY    This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  attachPolicy(params: Organizations.Types.AttachPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches a policy to a root, an organizational unit (OU), or an individual account. How the policy affects accounts depends on the type of policy. Refer to the Organizations User Guide for information about each policy type:    AISERVICES_OPT_OUT_POLICY     BACKUP_POLICY     SERVICE_CONTROL_POLICY     TAG_POLICY    This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  attachPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Cancels a handshake. Canceling a handshake sets the handshake state to CANCELED. This operation can be called only from the account that originated the handshake. The recipient of the handshake can't cancel it, but can use DeclineHandshake instead. After a handshake is canceled, the recipient can no longer respond to that handshake. After you cancel a handshake, it continues to appear in the results of relevant APIs for only 30 days. After that, it's deleted.
   */
  cancelHandshake(params: Organizations.Types.CancelHandshakeRequest, callback?: (err: AWSError, data: Organizations.Types.CancelHandshakeResponse) => void): Request<Organizations.Types.CancelHandshakeResponse, AWSError>;
  /**
   * Cancels a handshake. Canceling a handshake sets the handshake state to CANCELED. This operation can be called only from the account that originated the handshake. The recipient of the handshake can't cancel it, but can use DeclineHandshake instead. After a handshake is canceled, the recipient can no longer respond to that handshake. After you cancel a handshake, it continues to appear in the results of relevant APIs for only 30 days. After that, it's deleted.
   */
  cancelHandshake(callback?: (err: AWSError, data: Organizations.Types.CancelHandshakeResponse) => void): Request<Organizations.Types.CancelHandshakeResponse, AWSError>;
  /**
   * Closes an Amazon Web Services member account within an organization. You can close an account when all features are enabled . You can't close the management account with this API. This is an asynchronous request that Amazon Web Services performs in the background. Because CloseAccount operates asynchronously, it can return a successful completion message even though account closure might still be in progress. You need to wait a few minutes before the account is fully closed. To check the status of the request, do one of the following:   Use the AccountId that you sent in the CloseAccount request to provide as a parameter to the DescribeAccount operation.  While the close account request is in progress, Account status will indicate PENDING_CLOSURE. When the close account request completes, the status will change to SUSPENDED.    Check the CloudTrail log for the CloseAccountResult event that gets published after the account closes successfully. For information on using CloudTrail with Organizations, see Logging and monitoring in Organizations in the Organizations User Guide.      You can close only 10% of member accounts, between 10 and 200, within a rolling 30 day period. This quota is not bound by a calendar month, but starts when you close an account. After you reach this limit, you can close additional accounts. For more information, see Closing a member account in your organization in the Organizations User Guide.    To reinstate a closed account, contact Amazon Web Services Support within the 90-day grace period while the account is in SUSPENDED status.    If the Amazon Web Services account you attempt to close is linked to an Amazon Web Services GovCloud (US) account, the CloseAccount request will close both accounts. To learn important pre-closure details, see  Closing an Amazon Web Services GovCloud (US) account in the  Amazon Web Services GovCloud User Guide.   
   */
  closeAccount(params: Organizations.Types.CloseAccountRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Closes an Amazon Web Services member account within an organization. You can close an account when all features are enabled . You can't close the management account with this API. This is an asynchronous request that Amazon Web Services performs in the background. Because CloseAccount operates asynchronously, it can return a successful completion message even though account closure might still be in progress. You need to wait a few minutes before the account is fully closed. To check the status of the request, do one of the following:   Use the AccountId that you sent in the CloseAccount request to provide as a parameter to the DescribeAccount operation.  While the close account request is in progress, Account status will indicate PENDING_CLOSURE. When the close account request completes, the status will change to SUSPENDED.    Check the CloudTrail log for the CloseAccountResult event that gets published after the account closes successfully. For information on using CloudTrail with Organizations, see Logging and monitoring in Organizations in the Organizations User Guide.      You can close only 10% of member accounts, between 10 and 200, within a rolling 30 day period. This quota is not bound by a calendar month, but starts when you close an account. After you reach this limit, you can close additional accounts. For more information, see Closing a member account in your organization in the Organizations User Guide.    To reinstate a closed account, contact Amazon Web Services Support within the 90-day grace period while the account is in SUSPENDED status.    If the Amazon Web Services account you attempt to close is linked to an Amazon Web Services GovCloud (US) account, the CloseAccount request will close both accounts. To learn important pre-closure details, see  Closing an Amazon Web Services GovCloud (US) account in the  Amazon Web Services GovCloud User Guide.   
   */
  closeAccount(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates an Amazon Web Services account that is automatically a member of the organization whose credentials made the request. This is an asynchronous request that Amazon Web Services performs in the background. Because CreateAccount operates asynchronously, it can return a successful completion message even though account initialization might still be in progress. You might need to wait a few minutes before you can successfully access the account. To check the status of the request, do one of the following:   Use the Id value of the CreateAccountStatus response element from this operation to provide as a parameter to the DescribeCreateAccountStatus operation.   Check the CloudTrail log for the CreateAccountResult event. For information on using CloudTrail with Organizations, see Logging and monitoring in Organizations in the Organizations User Guide.   The user who calls the API to create an account must have the organizations:CreateAccount permission. If you enabled all features in the organization, Organizations creates the required service-linked role named AWSServiceRoleForOrganizations. For more information, see Organizations and service-linked roles in the Organizations User Guide. If the request includes tags, then the requester must have the organizations:TagResource permission. Organizations preconfigures the new member account with a role (named OrganizationAccountAccessRole by default) that grants users in the management account administrator permissions in the new member account. Principals in the management account can assume the role. Organizations clones the company name and address information for the new account from the organization's management account. This operation can be called only from the organization's management account. For more information about creating accounts, see Creating a member account in your organization in the Organizations User Guide.    When you create an account in an organization using the Organizations console, API, or CLI commands, the information required for the account to operate as a standalone account, such as a payment method and signing the end user license agreement (EULA) is not automatically collected. If you must remove an account from your organization later, you can do so only after you provide the missing information. For more information, see Considerations before removing an account from an organization in the Organizations User Guide.   If you get an exception that indicates that you exceeded your account limits for the organization, contact Amazon Web Services Support.   If you get an exception that indicates that the operation failed because your organization is still initializing, wait one hour and then try again. If the error persists, contact Amazon Web Services Support.   Using CreateAccount to create multiple temporary accounts isn't recommended. You can only close an account from the Billing and Cost Management console, and you must be signed in as the root user. For information on the requirements and process for closing an account, see Closing a member account in your organization in the Organizations User Guide.     When you create a member account with this operation, you can choose whether to create the account with the IAM User and Role Access to Billing Information switch enabled. If you enable it, IAM users and roles that have appropriate permissions can view billing information for the account. If you disable it, only the account root user can access billing information. For information about how to disable this switch for an account, see Granting access to your billing information and tools. 
   */
  createAccount(params: Organizations.Types.CreateAccountRequest, callback?: (err: AWSError, data: Organizations.Types.CreateAccountResponse) => void): Request<Organizations.Types.CreateAccountResponse, AWSError>;
  /**
   * Creates an Amazon Web Services account that is automatically a member of the organization whose credentials made the request. This is an asynchronous request that Amazon Web Services performs in the background. Because CreateAccount operates asynchronously, it can return a successful completion message even though account initialization might still be in progress. You might need to wait a few minutes before you can successfully access the account. To check the status of the request, do one of the following:   Use the Id value of the CreateAccountStatus response element from this operation to provide as a parameter to the DescribeCreateAccountStatus operation.   Check the CloudTrail log for the CreateAccountResult event. For information on using CloudTrail with Organizations, see Logging and monitoring in Organizations in the Organizations User Guide.   The user who calls the API to create an account must have the organizations:CreateAccount permission. If you enabled all features in the organization, Organizations creates the required service-linked role named AWSServiceRoleForOrganizations. For more information, see Organizations and service-linked roles in the Organizations User Guide. If the request includes tags, then the requester must have the organizations:TagResource permission. Organizations preconfigures the new member account with a role (named OrganizationAccountAccessRole by default) that grants users in the management account administrator permissions in the new member account. Principals in the management account can assume the role. Organizations clones the company name and address information for the new account from the organization's management account. This operation can be called only from the organization's management account. For more information about creating accounts, see Creating a member account in your organization in the Organizations User Guide.    When you create an account in an organization using the Organizations console, API, or CLI commands, the information required for the account to operate as a standalone account, such as a payment method and signing the end user license agreement (EULA) is not automatically collected. If you must remove an account from your organization later, you can do so only after you provide the missing information. For more information, see Considerations before removing an account from an organization in the Organizations User Guide.   If you get an exception that indicates that you exceeded your account limits for the organization, contact Amazon Web Services Support.   If you get an exception that indicates that the operation failed because your organization is still initializing, wait one hour and then try again. If the error persists, contact Amazon Web Services Support.   Using CreateAccount to create multiple temporary accounts isn't recommended. You can only close an account from the Billing and Cost Management console, and you must be signed in as the root user. For information on the requirements and process for closing an account, see Closing a member account in your organization in the Organizations User Guide.     When you create a member account with this operation, you can choose whether to create the account with the IAM User and Role Access to Billing Information switch enabled. If you enable it, IAM users and roles that have appropriate permissions can view billing information for the account. If you disable it, only the account root user can access billing information. For information about how to disable this switch for an account, see Granting access to your billing information and tools. 
   */
  createAccount(callback?: (err: AWSError, data: Organizations.Types.CreateAccountResponse) => void): Request<Organizations.Types.CreateAccountResponse, AWSError>;
  /**
   * This action is available if all of the following are true:   You're authorized to create accounts in the Amazon Web Services GovCloud (US) Region. For more information on the Amazon Web Services GovCloud (US) Region, see the  Amazon Web Services GovCloud User Guide.    You already have an account in the Amazon Web Services GovCloud (US) Region that is paired with a management account of an organization in the commercial Region.   You call this action from the management account of your organization in the commercial Region.   You have the organizations:CreateGovCloudAccount permission.    Organizations automatically creates the required service-linked role named AWSServiceRoleForOrganizations. For more information, see Organizations and service-linked roles in the Organizations User Guide. Amazon Web Services automatically enables CloudTrail for Amazon Web Services GovCloud (US) accounts, but you should also do the following:   Verify that CloudTrail is enabled to store logs.   Create an Amazon S3 bucket for CloudTrail log storage. For more information, see Verifying CloudTrail Is Enabled in the Amazon Web Services GovCloud User Guide.    If the request includes tags, then the requester must have the organizations:TagResource permission. The tags are attached to the commercial account associated with the GovCloud account, rather than the GovCloud account itself. To add tags to the GovCloud account, call the TagResource operation in the GovCloud Region after the new GovCloud account exists. You call this action from the management account of your organization in the commercial Region to create a standalone Amazon Web Services account in the Amazon Web Services GovCloud (US) Region. After the account is created, the management account of an organization in the Amazon Web Services GovCloud (US) Region can invite it to that organization. For more information on inviting standalone accounts in the Amazon Web Services GovCloud (US) to join an organization, see Organizations in the Amazon Web Services GovCloud User Guide. Calling CreateGovCloudAccount is an asynchronous request that Amazon Web Services performs in the background. Because CreateGovCloudAccount operates asynchronously, it can return a successful completion message even though account initialization might still be in progress. You might need to wait a few minutes before you can successfully access the account. To check the status of the request, do one of the following:   Use the OperationId response element from this operation to provide as a parameter to the DescribeCreateAccountStatus operation.   Check the CloudTrail log for the CreateAccountResult event. For information on using CloudTrail with Organizations, see Logging and monitoring in Organizations in the Organizations User Guide.    When you call the CreateGovCloudAccount action, you create two accounts: a standalone account in the Amazon Web Services GovCloud (US) Region and an associated account in the commercial Region for billing and support purposes. The account in the commercial Region is automatically a member of the organization whose credentials made the request. Both accounts are associated with the same email address. A role is created in the new account in the commercial Region that allows the management account in the organization in the commercial Region to assume it. An Amazon Web Services GovCloud (US) account is then created and associated with the commercial account that you just created. A role is also created in the new Amazon Web Services GovCloud (US) account that can be assumed by the Amazon Web Services GovCloud (US) account that is associated with the management account of the commercial organization. For more information and to view a diagram that explains how account access works, see Organizations in the Amazon Web Services GovCloud User Guide. For more information about creating accounts, see Creating a member account in your organization in the Organizations User Guide.    When you create an account in an organization using the Organizations console, API, or CLI commands, the information required for the account to operate as a standalone account is not automatically collected. This includes a payment method and signing the end user license agreement (EULA). If you must remove an account from your organization later, you can do so only after you provide the missing information. For more information, see Considerations before removing an account from an organization in the Organizations User Guide.   If you get an exception that indicates that you exceeded your account limits for the organization, contact Amazon Web Services Support.   If you get an exception that indicates that the operation failed because your organization is still initializing, wait one hour and then try again. If the error persists, contact Amazon Web Services Support.   Using CreateGovCloudAccount to create multiple temporary accounts isn't recommended. You can only close an account from the Amazon Web Services Billing and Cost Management console, and you must be signed in as the root user. For information on the requirements and process for closing an account, see Closing a member account in your organization in the Organizations User Guide.     When you create a member account with this operation, you can choose whether to create the account with the IAM User and Role Access to Billing Information switch enabled. If you enable it, IAM users and roles that have appropriate permissions can view billing information for the account. If you disable it, only the account root user can access billing information. For information about how to disable this switch for an account, see Granting access to your billing information and tools. 
   */
  createGovCloudAccount(params: Organizations.Types.CreateGovCloudAccountRequest, callback?: (err: AWSError, data: Organizations.Types.CreateGovCloudAccountResponse) => void): Request<Organizations.Types.CreateGovCloudAccountResponse, AWSError>;
  /**
   * This action is available if all of the following are true:   You're authorized to create accounts in the Amazon Web Services GovCloud (US) Region. For more information on the Amazon Web Services GovCloud (US) Region, see the  Amazon Web Services GovCloud User Guide.    You already have an account in the Amazon Web Services GovCloud (US) Region that is paired with a management account of an organization in the commercial Region.   You call this action from the management account of your organization in the commercial Region.   You have the organizations:CreateGovCloudAccount permission.    Organizations automatically creates the required service-linked role named AWSServiceRoleForOrganizations. For more information, see Organizations and service-linked roles in the Organizations User Guide. Amazon Web Services automatically enables CloudTrail for Amazon Web Services GovCloud (US) accounts, but you should also do the following:   Verify that CloudTrail is enabled to store logs.   Create an Amazon S3 bucket for CloudTrail log storage. For more information, see Verifying CloudTrail Is Enabled in the Amazon Web Services GovCloud User Guide.    If the request includes tags, then the requester must have the organizations:TagResource permission. The tags are attached to the commercial account associated with the GovCloud account, rather than the GovCloud account itself. To add tags to the GovCloud account, call the TagResource operation in the GovCloud Region after the new GovCloud account exists. You call this action from the management account of your organization in the commercial Region to create a standalone Amazon Web Services account in the Amazon Web Services GovCloud (US) Region. After the account is created, the management account of an organization in the Amazon Web Services GovCloud (US) Region can invite it to that organization. For more information on inviting standalone accounts in the Amazon Web Services GovCloud (US) to join an organization, see Organizations in the Amazon Web Services GovCloud User Guide. Calling CreateGovCloudAccount is an asynchronous request that Amazon Web Services performs in the background. Because CreateGovCloudAccount operates asynchronously, it can return a successful completion message even though account initialization might still be in progress. You might need to wait a few minutes before you can successfully access the account. To check the status of the request, do one of the following:   Use the OperationId response element from this operation to provide as a parameter to the DescribeCreateAccountStatus operation.   Check the CloudTrail log for the CreateAccountResult event. For information on using CloudTrail with Organizations, see Logging and monitoring in Organizations in the Organizations User Guide.    When you call the CreateGovCloudAccount action, you create two accounts: a standalone account in the Amazon Web Services GovCloud (US) Region and an associated account in the commercial Region for billing and support purposes. The account in the commercial Region is automatically a member of the organization whose credentials made the request. Both accounts are associated with the same email address. A role is created in the new account in the commercial Region that allows the management account in the organization in the commercial Region to assume it. An Amazon Web Services GovCloud (US) account is then created and associated with the commercial account that you just created. A role is also created in the new Amazon Web Services GovCloud (US) account that can be assumed by the Amazon Web Services GovCloud (US) account that is associated with the management account of the commercial organization. For more information and to view a diagram that explains how account access works, see Organizations in the Amazon Web Services GovCloud User Guide. For more information about creating accounts, see Creating a member account in your organization in the Organizations User Guide.    When you create an account in an organization using the Organizations console, API, or CLI commands, the information required for the account to operate as a standalone account is not automatically collected. This includes a payment method and signing the end user license agreement (EULA). If you must remove an account from your organization later, you can do so only after you provide the missing information. For more information, see Considerations before removing an account from an organization in the Organizations User Guide.   If you get an exception that indicates that you exceeded your account limits for the organization, contact Amazon Web Services Support.   If you get an exception that indicates that the operation failed because your organization is still initializing, wait one hour and then try again. If the error persists, contact Amazon Web Services Support.   Using CreateGovCloudAccount to create multiple temporary accounts isn't recommended. You can only close an account from the Amazon Web Services Billing and Cost Management console, and you must be signed in as the root user. For information on the requirements and process for closing an account, see Closing a member account in your organization in the Organizations User Guide.     When you create a member account with this operation, you can choose whether to create the account with the IAM User and Role Access to Billing Information switch enabled. If you enable it, IAM users and roles that have appropriate permissions can view billing information for the account. If you disable it, only the account root user can access billing information. For information about how to disable this switch for an account, see Granting access to your billing information and tools. 
   */
  createGovCloudAccount(callback?: (err: AWSError, data: Organizations.Types.CreateGovCloudAccountResponse) => void): Request<Organizations.Types.CreateGovCloudAccountResponse, AWSError>;
  /**
   * Creates an Amazon Web Services organization. The account whose user is calling the CreateOrganization operation automatically becomes the management account of the new organization. This operation must be called using credentials from the account that is to become the new organization's management account. The principal must also have the relevant IAM permissions. By default (or if you set the FeatureSet parameter to ALL), the new organization is created with all features enabled and service control policies automatically enabled in the root. If you instead choose to create the organization supporting only the consolidated billing features by setting the FeatureSet parameter to CONSOLIDATED_BILLING, no policy types are enabled by default and you can't use organization policies.
   */
  createOrganization(params: Organizations.Types.CreateOrganizationRequest, callback?: (err: AWSError, data: Organizations.Types.CreateOrganizationResponse) => void): Request<Organizations.Types.CreateOrganizationResponse, AWSError>;
  /**
   * Creates an Amazon Web Services organization. The account whose user is calling the CreateOrganization operation automatically becomes the management account of the new organization. This operation must be called using credentials from the account that is to become the new organization's management account. The principal must also have the relevant IAM permissions. By default (or if you set the FeatureSet parameter to ALL), the new organization is created with all features enabled and service control policies automatically enabled in the root. If you instead choose to create the organization supporting only the consolidated billing features by setting the FeatureSet parameter to CONSOLIDATED_BILLING, no policy types are enabled by default and you can't use organization policies.
   */
  createOrganization(callback?: (err: AWSError, data: Organizations.Types.CreateOrganizationResponse) => void): Request<Organizations.Types.CreateOrganizationResponse, AWSError>;
  /**
   * Creates an organizational unit (OU) within a root or parent OU. An OU is a container for accounts that enables you to organize your accounts to apply policies according to your business requirements. The number of levels deep that you can nest OUs is dependent upon the policy types enabled for that root. For service control policies, the limit is five. For more information about OUs, see Managing organizational units (OUs) in the Organizations User Guide. If the request includes tags, then the requester must have the organizations:TagResource permission. This operation can be called only from the organization's management account.
   */
  createOrganizationalUnit(params: Organizations.Types.CreateOrganizationalUnitRequest, callback?: (err: AWSError, data: Organizations.Types.CreateOrganizationalUnitResponse) => void): Request<Organizations.Types.CreateOrganizationalUnitResponse, AWSError>;
  /**
   * Creates an organizational unit (OU) within a root or parent OU. An OU is a container for accounts that enables you to organize your accounts to apply policies according to your business requirements. The number of levels deep that you can nest OUs is dependent upon the policy types enabled for that root. For service control policies, the limit is five. For more information about OUs, see Managing organizational units (OUs) in the Organizations User Guide. If the request includes tags, then the requester must have the organizations:TagResource permission. This operation can be called only from the organization's management account.
   */
  createOrganizationalUnit(callback?: (err: AWSError, data: Organizations.Types.CreateOrganizationalUnitResponse) => void): Request<Organizations.Types.CreateOrganizationalUnitResponse, AWSError>;
  /**
   * Creates a policy of a specified type that you can attach to a root, an organizational unit (OU), or an individual Amazon Web Services account. For more information about policies and their use, see Managing Organizations policies. If the request includes tags, then the requester must have the organizations:TagResource permission. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  createPolicy(params: Organizations.Types.CreatePolicyRequest, callback?: (err: AWSError, data: Organizations.Types.CreatePolicyResponse) => void): Request<Organizations.Types.CreatePolicyResponse, AWSError>;
  /**
   * Creates a policy of a specified type that you can attach to a root, an organizational unit (OU), or an individual Amazon Web Services account. For more information about policies and their use, see Managing Organizations policies. If the request includes tags, then the requester must have the organizations:TagResource permission. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  createPolicy(callback?: (err: AWSError, data: Organizations.Types.CreatePolicyResponse) => void): Request<Organizations.Types.CreatePolicyResponse, AWSError>;
  /**
   * Declines a handshake request. This sets the handshake state to DECLINED and effectively deactivates the request. This operation can be called only from the account that received the handshake. The originator of the handshake can use CancelHandshake instead. The originator can't reactivate a declined request, but can reinitiate the process with a new handshake request. After you decline a handshake, it continues to appear in the results of relevant APIs for only 30 days. After that, it's deleted.
   */
  declineHandshake(params: Organizations.Types.DeclineHandshakeRequest, callback?: (err: AWSError, data: Organizations.Types.DeclineHandshakeResponse) => void): Request<Organizations.Types.DeclineHandshakeResponse, AWSError>;
  /**
   * Declines a handshake request. This sets the handshake state to DECLINED and effectively deactivates the request. This operation can be called only from the account that received the handshake. The originator of the handshake can use CancelHandshake instead. The originator can't reactivate a declined request, but can reinitiate the process with a new handshake request. After you decline a handshake, it continues to appear in the results of relevant APIs for only 30 days. After that, it's deleted.
   */
  declineHandshake(callback?: (err: AWSError, data: Organizations.Types.DeclineHandshakeResponse) => void): Request<Organizations.Types.DeclineHandshakeResponse, AWSError>;
  /**
   * Deletes the organization. You can delete an organization only by using credentials from the management account. The organization must be empty of member accounts.
   */
  deleteOrganization(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an organizational unit (OU) from a root or another OU. You must first remove all accounts and child OUs from the OU that you want to delete. This operation can be called only from the organization's management account.
   */
  deleteOrganizationalUnit(params: Organizations.Types.DeleteOrganizationalUnitRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an organizational unit (OU) from a root or another OU. You must first remove all accounts and child OUs from the OU that you want to delete. This operation can be called only from the organization's management account.
   */
  deleteOrganizationalUnit(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified policy from your organization. Before you perform this operation, you must first detach the policy from all organizational units (OUs), roots, and accounts. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  deletePolicy(params: Organizations.Types.DeletePolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified policy from your organization. Before you perform this operation, you must first detach the policy from all organizational units (OUs), roots, and accounts. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  deletePolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the resource policy from your organization. You can only call this operation from the organization's management account.
   */
  deleteResourcePolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified member Amazon Web Services account as a delegated administrator for the specified Amazon Web Services service.  Deregistering a delegated administrator can have unintended impacts on the functionality of the enabled Amazon Web Services service. See the documentation for the enabled service before you deregister a delegated administrator so that you understand any potential impacts.  You can run this action only for Amazon Web Services services that support this feature. For a current list of services that support it, see the column Supports Delegated Administrator in the table at Amazon Web Services Services that you can use with Organizations in the Organizations User Guide.  This operation can be called only from the organization's management account.
   */
  deregisterDelegatedAdministrator(params: Organizations.Types.DeregisterDelegatedAdministratorRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified member Amazon Web Services account as a delegated administrator for the specified Amazon Web Services service.  Deregistering a delegated administrator can have unintended impacts on the functionality of the enabled Amazon Web Services service. See the documentation for the enabled service before you deregister a delegated administrator so that you understand any potential impacts.  You can run this action only for Amazon Web Services services that support this feature. For a current list of services that support it, see the column Supports Delegated Administrator in the table at Amazon Web Services Services that you can use with Organizations in the Organizations User Guide.  This operation can be called only from the organization's management account.
   */
  deregisterDelegatedAdministrator(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Retrieves Organizations-related information about the specified account. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  describeAccount(params: Organizations.Types.DescribeAccountRequest, callback?: (err: AWSError, data: Organizations.Types.DescribeAccountResponse) => void): Request<Organizations.Types.DescribeAccountResponse, AWSError>;
  /**
   * Retrieves Organizations-related information about the specified account. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  describeAccount(callback?: (err: AWSError, data: Organizations.Types.DescribeAccountResponse) => void): Request<Organizations.Types.DescribeAccountResponse, AWSError>;
  /**
   * Retrieves the current status of an asynchronous request to create an account. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  describeCreateAccountStatus(params: Organizations.Types.DescribeCreateAccountStatusRequest, callback?: (err: AWSError, data: Organizations.Types.DescribeCreateAccountStatusResponse) => void): Request<Organizations.Types.DescribeCreateAccountStatusResponse, AWSError>;
  /**
   * Retrieves the current status of an asynchronous request to create an account. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  describeCreateAccountStatus(callback?: (err: AWSError, data: Organizations.Types.DescribeCreateAccountStatusResponse) => void): Request<Organizations.Types.DescribeCreateAccountStatusResponse, AWSError>;
  /**
   * Returns the contents of the effective policy for specified policy type and account. The effective policy is the aggregation of any policies of the specified type that the account inherits, plus any policy of that type that is directly attached to the account. This operation applies only to policy types other than service control policies (SCPs). For more information about policy inheritance, see Understanding management policy inheritance in the Organizations User Guide. This operation can be called from any account in the organization.
   */
  describeEffectivePolicy(params: Organizations.Types.DescribeEffectivePolicyRequest, callback?: (err: AWSError, data: Organizations.Types.DescribeEffectivePolicyResponse) => void): Request<Organizations.Types.DescribeEffectivePolicyResponse, AWSError>;
  /**
   * Returns the contents of the effective policy for specified policy type and account. The effective policy is the aggregation of any policies of the specified type that the account inherits, plus any policy of that type that is directly attached to the account. This operation applies only to policy types other than service control policies (SCPs). For more information about policy inheritance, see Understanding management policy inheritance in the Organizations User Guide. This operation can be called from any account in the organization.
   */
  describeEffectivePolicy(callback?: (err: AWSError, data: Organizations.Types.DescribeEffectivePolicyResponse) => void): Request<Organizations.Types.DescribeEffectivePolicyResponse, AWSError>;
  /**
   * Retrieves information about a previously requested handshake. The handshake ID comes from the response to the original InviteAccountToOrganization operation that generated the handshake. You can access handshakes that are ACCEPTED, DECLINED, or CANCELED for only 30 days after they change to that state. They're then deleted and no longer accessible. This operation can be called from any account in the organization.
   */
  describeHandshake(params: Organizations.Types.DescribeHandshakeRequest, callback?: (err: AWSError, data: Organizations.Types.DescribeHandshakeResponse) => void): Request<Organizations.Types.DescribeHandshakeResponse, AWSError>;
  /**
   * Retrieves information about a previously requested handshake. The handshake ID comes from the response to the original InviteAccountToOrganization operation that generated the handshake. You can access handshakes that are ACCEPTED, DECLINED, or CANCELED for only 30 days after they change to that state. They're then deleted and no longer accessible. This operation can be called from any account in the organization.
   */
  describeHandshake(callback?: (err: AWSError, data: Organizations.Types.DescribeHandshakeResponse) => void): Request<Organizations.Types.DescribeHandshakeResponse, AWSError>;
  /**
   * Retrieves information about the organization that the user's account belongs to. This operation can be called from any account in the organization.  Even if a policy type is shown as available in the organization, you can disable it separately at the root level with DisablePolicyType. Use ListRoots to see the status of policy types for a specified root. 
   */
  describeOrganization(callback?: (err: AWSError, data: Organizations.Types.DescribeOrganizationResponse) => void): Request<Organizations.Types.DescribeOrganizationResponse, AWSError>;
  /**
   * Retrieves information about an organizational unit (OU). This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  describeOrganizationalUnit(params: Organizations.Types.DescribeOrganizationalUnitRequest, callback?: (err: AWSError, data: Organizations.Types.DescribeOrganizationalUnitResponse) => void): Request<Organizations.Types.DescribeOrganizationalUnitResponse, AWSError>;
  /**
   * Retrieves information about an organizational unit (OU). This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  describeOrganizationalUnit(callback?: (err: AWSError, data: Organizations.Types.DescribeOrganizationalUnitResponse) => void): Request<Organizations.Types.DescribeOrganizationalUnitResponse, AWSError>;
  /**
   * Retrieves information about a policy. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  describePolicy(params: Organizations.Types.DescribePolicyRequest, callback?: (err: AWSError, data: Organizations.Types.DescribePolicyResponse) => void): Request<Organizations.Types.DescribePolicyResponse, AWSError>;
  /**
   * Retrieves information about a policy. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  describePolicy(callback?: (err: AWSError, data: Organizations.Types.DescribePolicyResponse) => void): Request<Organizations.Types.DescribePolicyResponse, AWSError>;
  /**
   * Retrieves information about a resource policy. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  describeResourcePolicy(callback?: (err: AWSError, data: Organizations.Types.DescribeResourcePolicyResponse) => void): Request<Organizations.Types.DescribeResourcePolicyResponse, AWSError>;
  /**
   * Detaches a policy from a target root, organizational unit (OU), or account.  If the policy being detached is a service control policy (SCP), the changes to permissions for Identity and Access Management (IAM) users and roles in affected accounts are immediate.  Every root, OU, and account must have at least one SCP attached. If you want to replace the default FullAWSAccess policy with an SCP that limits the permissions that can be delegated, you must attach the replacement SCP before you can remove the default SCP. This is the authorization strategy of an "allow list". If you instead attach a second SCP and leave the FullAWSAccess SCP still attached, and specify "Effect": "Deny" in the second SCP to override the "Effect": "Allow" in the FullAWSAccess policy (or any other attached SCP), you're using the authorization strategy of a "deny list". This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  detachPolicy(params: Organizations.Types.DetachPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Detaches a policy from a target root, organizational unit (OU), or account.  If the policy being detached is a service control policy (SCP), the changes to permissions for Identity and Access Management (IAM) users and roles in affected accounts are immediate.  Every root, OU, and account must have at least one SCP attached. If you want to replace the default FullAWSAccess policy with an SCP that limits the permissions that can be delegated, you must attach the replacement SCP before you can remove the default SCP. This is the authorization strategy of an "allow list". If you instead attach a second SCP and leave the FullAWSAccess SCP still attached, and specify "Effect": "Deny" in the second SCP to override the "Effect": "Allow" in the FullAWSAccess policy (or any other attached SCP), you're using the authorization strategy of a "deny list". This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  detachPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disables the integration of an Amazon Web Services service (the service that is specified by ServicePrincipal) with Organizations. When you disable integration, the specified service no longer can create a service-linked role in new accounts in your organization. This means the service can't perform operations on your behalf on any new accounts in your organization. The service can still perform operations in older accounts until the service completes its clean-up from Organizations.  We  strongly recommend  that you don't use this command to disable integration between Organizations and the specified Amazon Web Services service. Instead, use the console or commands that are provided by the specified service. This lets the trusted service perform any required initialization when enabling trusted access, such as creating any required resources and any required clean up of resources when disabling trusted access.  For information about how to disable trusted service access to your organization using the trusted service, see the Learn more link under the Supports Trusted Access column at Amazon Web Services services that you can use with Organizations. on this page. If you disable access by using this command, it causes the following actions to occur:   The service can no longer create a service-linked role in the accounts in your organization. This means that the service can't perform operations on your behalf on any new accounts in your organization. The service can still perform operations in older accounts until the service completes its clean-up from Organizations.    The service can no longer perform tasks in the member accounts in the organization, unless those operations are explicitly permitted by the IAM policies that are attached to your roles. This includes any data aggregation from the member accounts to the management account, or to a delegated administrator account, where relevant.   Some services detect this and clean up any remaining data or resources related to the integration, while other services stop accessing the organization but leave any historical data and configuration in place to support a possible re-enabling of the integration.   Using the other service's console or commands to disable the integration ensures that the other service is aware that it can clean up any resources that are required only for the integration. How the service cleans up its resources in the organization's accounts depends on that service. For more information, see the documentation for the other Amazon Web Services service.   After you perform the DisableAWSServiceAccess operation, the specified service can no longer perform operations in your organization's accounts  For more information about integrating other services with Organizations, including the list of services that work with Organizations, see Using Organizations with other Amazon Web Services services in the Organizations User Guide. This operation can be called only from the organization's management account.
   */
  disableAWSServiceAccess(params: Organizations.Types.DisableAWSServiceAccessRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disables the integration of an Amazon Web Services service (the service that is specified by ServicePrincipal) with Organizations. When you disable integration, the specified service no longer can create a service-linked role in new accounts in your organization. This means the service can't perform operations on your behalf on any new accounts in your organization. The service can still perform operations in older accounts until the service completes its clean-up from Organizations.  We  strongly recommend  that you don't use this command to disable integration between Organizations and the specified Amazon Web Services service. Instead, use the console or commands that are provided by the specified service. This lets the trusted service perform any required initialization when enabling trusted access, such as creating any required resources and any required clean up of resources when disabling trusted access.  For information about how to disable trusted service access to your organization using the trusted service, see the Learn more link under the Supports Trusted Access column at Amazon Web Services services that you can use with Organizations. on this page. If you disable access by using this command, it causes the following actions to occur:   The service can no longer create a service-linked role in the accounts in your organization. This means that the service can't perform operations on your behalf on any new accounts in your organization. The service can still perform operations in older accounts until the service completes its clean-up from Organizations.    The service can no longer perform tasks in the member accounts in the organization, unless those operations are explicitly permitted by the IAM policies that are attached to your roles. This includes any data aggregation from the member accounts to the management account, or to a delegated administrator account, where relevant.   Some services detect this and clean up any remaining data or resources related to the integration, while other services stop accessing the organization but leave any historical data and configuration in place to support a possible re-enabling of the integration.   Using the other service's console or commands to disable the integration ensures that the other service is aware that it can clean up any resources that are required only for the integration. How the service cleans up its resources in the organization's accounts depends on that service. For more information, see the documentation for the other Amazon Web Services service.   After you perform the DisableAWSServiceAccess operation, the specified service can no longer perform operations in your organization's accounts  For more information about integrating other services with Organizations, including the list of services that work with Organizations, see Using Organizations with other Amazon Web Services services in the Organizations User Guide. This operation can be called only from the organization's management account.
   */
  disableAWSServiceAccess(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disables an organizational policy type in a root. A policy of a certain type can be attached to entities in a root only if that type is enabled in the root. After you perform this operation, you no longer can attach policies of the specified type to that root or to any organizational unit (OU) or account in that root. You can undo this by using the EnablePolicyType operation. This is an asynchronous request that Amazon Web Services performs in the background. If you disable a policy type for a root, it still appears enabled for the organization if all features are enabled for the organization. Amazon Web Services recommends that you first use ListRoots to see the status of policy types for a specified root, and then use this operation. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.  To view the status of available policy types in the organization, use DescribeOrganization.
   */
  disablePolicyType(params: Organizations.Types.DisablePolicyTypeRequest, callback?: (err: AWSError, data: Organizations.Types.DisablePolicyTypeResponse) => void): Request<Organizations.Types.DisablePolicyTypeResponse, AWSError>;
  /**
   * Disables an organizational policy type in a root. A policy of a certain type can be attached to entities in a root only if that type is enabled in the root. After you perform this operation, you no longer can attach policies of the specified type to that root or to any organizational unit (OU) or account in that root. You can undo this by using the EnablePolicyType operation. This is an asynchronous request that Amazon Web Services performs in the background. If you disable a policy type for a root, it still appears enabled for the organization if all features are enabled for the organization. Amazon Web Services recommends that you first use ListRoots to see the status of policy types for a specified root, and then use this operation. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.  To view the status of available policy types in the organization, use DescribeOrganization.
   */
  disablePolicyType(callback?: (err: AWSError, data: Organizations.Types.DisablePolicyTypeResponse) => void): Request<Organizations.Types.DisablePolicyTypeResponse, AWSError>;
  /**
   * Enables the integration of an Amazon Web Services service (the service that is specified by ServicePrincipal) with Organizations. When you enable integration, you allow the specified service to create a service-linked role in all the accounts in your organization. This allows the service to perform operations on your behalf in your organization and its accounts.  We recommend that you enable integration between Organizations and the specified Amazon Web Services service by using the console or commands that are provided by the specified service. Doing so ensures that the service is aware that it can create the resources that are required for the integration. How the service creates those resources in the organization's accounts depends on that service. For more information, see the documentation for the other Amazon Web Services service.  For more information about enabling services to integrate with Organizations, see Using Organizations with other Amazon Web Services services in the Organizations User Guide. You can only call this operation from the organization's management account and only if the organization has enabled all features.
   */
  enableAWSServiceAccess(params: Organizations.Types.EnableAWSServiceAccessRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables the integration of an Amazon Web Services service (the service that is specified by ServicePrincipal) with Organizations. When you enable integration, you allow the specified service to create a service-linked role in all the accounts in your organization. This allows the service to perform operations on your behalf in your organization and its accounts.  We recommend that you enable integration between Organizations and the specified Amazon Web Services service by using the console or commands that are provided by the specified service. Doing so ensures that the service is aware that it can create the resources that are required for the integration. How the service creates those resources in the organization's accounts depends on that service. For more information, see the documentation for the other Amazon Web Services service.  For more information about enabling services to integrate with Organizations, see Using Organizations with other Amazon Web Services services in the Organizations User Guide. You can only call this operation from the organization's management account and only if the organization has enabled all features.
   */
  enableAWSServiceAccess(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables all features in an organization. This enables the use of organization policies that can restrict the services and actions that can be called in each account. Until you enable all features, you have access only to consolidated billing, and you can't use any of the advanced account administration features that Organizations supports. For more information, see Enabling all features in your organization in the Organizations User Guide.  This operation is required only for organizations that were created explicitly with only the consolidated billing features enabled. Calling this operation sends a handshake to every invited account in the organization. The feature set change can be finalized and the additional features enabled only after all administrators in the invited accounts approve the change by accepting the handshake.  After you enable all features, you can separately enable or disable individual policy types in a root using EnablePolicyType and DisablePolicyType. To see the status of policy types in a root, use ListRoots. After all invited member accounts accept the handshake, you finalize the feature set change by accepting the handshake that contains "Action": "ENABLE_ALL_FEATURES". This completes the change. After you enable all features in your organization, the management account in the organization can apply policies on all member accounts. These policies can restrict what users and even administrators in those accounts can do. The management account can apply policies that prevent accounts from leaving the organization. Ensure that your account administrators are aware of this. This operation can be called only from the organization's management account.
   */
  enableAllFeatures(params: Organizations.Types.EnableAllFeaturesRequest, callback?: (err: AWSError, data: Organizations.Types.EnableAllFeaturesResponse) => void): Request<Organizations.Types.EnableAllFeaturesResponse, AWSError>;
  /**
   * Enables all features in an organization. This enables the use of organization policies that can restrict the services and actions that can be called in each account. Until you enable all features, you have access only to consolidated billing, and you can't use any of the advanced account administration features that Organizations supports. For more information, see Enabling all features in your organization in the Organizations User Guide.  This operation is required only for organizations that were created explicitly with only the consolidated billing features enabled. Calling this operation sends a handshake to every invited account in the organization. The feature set change can be finalized and the additional features enabled only after all administrators in the invited accounts approve the change by accepting the handshake.  After you enable all features, you can separately enable or disable individual policy types in a root using EnablePolicyType and DisablePolicyType. To see the status of policy types in a root, use ListRoots. After all invited member accounts accept the handshake, you finalize the feature set change by accepting the handshake that contains "Action": "ENABLE_ALL_FEATURES". This completes the change. After you enable all features in your organization, the management account in the organization can apply policies on all member accounts. These policies can restrict what users and even administrators in those accounts can do. The management account can apply policies that prevent accounts from leaving the organization. Ensure that your account administrators are aware of this. This operation can be called only from the organization's management account.
   */
  enableAllFeatures(callback?: (err: AWSError, data: Organizations.Types.EnableAllFeaturesResponse) => void): Request<Organizations.Types.EnableAllFeaturesResponse, AWSError>;
  /**
   * Enables a policy type in a root. After you enable a policy type in a root, you can attach policies of that type to the root, any organizational unit (OU), or account in that root. You can undo this by using the DisablePolicyType operation. This is an asynchronous request that Amazon Web Services performs in the background. Amazon Web Services recommends that you first use ListRoots to see the status of policy types for a specified root, and then use this operation. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service. You can enable a policy type in a root only if that policy type is available in the organization. To view the status of available policy types in the organization, use DescribeOrganization.
   */
  enablePolicyType(params: Organizations.Types.EnablePolicyTypeRequest, callback?: (err: AWSError, data: Organizations.Types.EnablePolicyTypeResponse) => void): Request<Organizations.Types.EnablePolicyTypeResponse, AWSError>;
  /**
   * Enables a policy type in a root. After you enable a policy type in a root, you can attach policies of that type to the root, any organizational unit (OU), or account in that root. You can undo this by using the DisablePolicyType operation. This is an asynchronous request that Amazon Web Services performs in the background. Amazon Web Services recommends that you first use ListRoots to see the status of policy types for a specified root, and then use this operation. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service. You can enable a policy type in a root only if that policy type is available in the organization. To view the status of available policy types in the organization, use DescribeOrganization.
   */
  enablePolicyType(callback?: (err: AWSError, data: Organizations.Types.EnablePolicyTypeResponse) => void): Request<Organizations.Types.EnablePolicyTypeResponse, AWSError>;
  /**
   * Sends an invitation to another account to join your organization as a member account. Organizations sends email on your behalf to the email address that is associated with the other account's owner. The invitation is implemented as a Handshake whose details are in the response.    You can invite Amazon Web Services accounts only from the same seller as the management account. For example, if your organization's management account was created by Amazon Internet Services Pvt. Ltd (AISPL), an Amazon Web Services seller in India, you can invite only other AISPL accounts to your organization. You can't combine accounts from AISPL and Amazon Web Services or from any other Amazon Web Services seller. For more information, see Consolidated billing in India.   If you receive an exception that indicates that you exceeded your account limits for the organization or that the operation failed because your organization is still initializing, wait one hour and then try again. If the error persists after an hour, contact Amazon Web Services Support.    If the request includes tags, then the requester must have the organizations:TagResource permission. This operation can be called only from the organization's management account.
   */
  inviteAccountToOrganization(params: Organizations.Types.InviteAccountToOrganizationRequest, callback?: (err: AWSError, data: Organizations.Types.InviteAccountToOrganizationResponse) => void): Request<Organizations.Types.InviteAccountToOrganizationResponse, AWSError>;
  /**
   * Sends an invitation to another account to join your organization as a member account. Organizations sends email on your behalf to the email address that is associated with the other account's owner. The invitation is implemented as a Handshake whose details are in the response.    You can invite Amazon Web Services accounts only from the same seller as the management account. For example, if your organization's management account was created by Amazon Internet Services Pvt. Ltd (AISPL), an Amazon Web Services seller in India, you can invite only other AISPL accounts to your organization. You can't combine accounts from AISPL and Amazon Web Services or from any other Amazon Web Services seller. For more information, see Consolidated billing in India.   If you receive an exception that indicates that you exceeded your account limits for the organization or that the operation failed because your organization is still initializing, wait one hour and then try again. If the error persists after an hour, contact Amazon Web Services Support.    If the request includes tags, then the requester must have the organizations:TagResource permission. This operation can be called only from the organization's management account.
   */
  inviteAccountToOrganization(callback?: (err: AWSError, data: Organizations.Types.InviteAccountToOrganizationResponse) => void): Request<Organizations.Types.InviteAccountToOrganizationResponse, AWSError>;
  /**
   * Removes a member account from its parent organization. This version of the operation is performed by the account that wants to leave. To remove a member account as a user in the management account, use RemoveAccountFromOrganization instead. This operation can be called only from a member account in the organization.    The management account in an organization with all features enabled can set service control policies (SCPs) that can restrict what administrators of member accounts can do. This includes preventing them from successfully calling LeaveOrganization and leaving the organization.   You can leave an organization as a member account only if the account is configured with the information required to operate as a standalone account. When you create an account in an organization using the Organizations console, API, or CLI commands, the information required of standalone accounts is not automatically collected. For each account that you want to make standalone, you must perform the following steps. If any of the steps are already completed for this account, that step doesn't appear.   Choose a support plan   Provide and verify the required contact information   Provide a current payment method   Amazon Web Services uses the payment method to charge for any billable (not free tier) Amazon Web Services activity that occurs while the account isn't attached to an organization. For more information, see Considerations before removing an account from an organization in the Organizations User Guide.   The account that you want to leave must not be a delegated administrator account for any Amazon Web Services service enabled for your organization. If the account is a delegated administrator, you must first change the delegated administrator account to another account that is remaining in the organization.   You can leave an organization only after you enable IAM user access to billing in your account. For more information, see About IAM access to the Billing and Cost Management console in the Amazon Web Services Billing and Cost Management User Guide.   After the account leaves the organization, all tags that were attached to the account object in the organization are deleted. Amazon Web Services accounts outside of an organization do not support tags.   A newly created account has a waiting period before it can be removed from its organization. If you get an error that indicates that a wait period is required, then try again in a few days.   If you are using an organization principal to call LeaveOrganization across multiple accounts, you can only do this up to 5 accounts per second in a single organization.   
   */
  leaveOrganization(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Returns a list of the Amazon Web Services services that you enabled to integrate with your organization. After a service on this list creates the resources that it requires for the integration, it can perform operations on your organization and its accounts. For more information about integrating other services with Organizations, including the list of services that currently work with Organizations, see Using Organizations with other Amazon Web Services services in the Organizations User Guide. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listAWSServiceAccessForOrganization(params: Organizations.Types.ListAWSServiceAccessForOrganizationRequest, callback?: (err: AWSError, data: Organizations.Types.ListAWSServiceAccessForOrganizationResponse) => void): Request<Organizations.Types.ListAWSServiceAccessForOrganizationResponse, AWSError>;
  /**
   * Returns a list of the Amazon Web Services services that you enabled to integrate with your organization. After a service on this list creates the resources that it requires for the integration, it can perform operations on your organization and its accounts. For more information about integrating other services with Organizations, including the list of services that currently work with Organizations, see Using Organizations with other Amazon Web Services services in the Organizations User Guide. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listAWSServiceAccessForOrganization(callback?: (err: AWSError, data: Organizations.Types.ListAWSServiceAccessForOrganizationResponse) => void): Request<Organizations.Types.ListAWSServiceAccessForOrganizationResponse, AWSError>;
  /**
   * Lists all the accounts in the organization. To request only the accounts in a specified root or organizational unit (OU), use the ListAccountsForParent operation instead.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listAccounts(params: Organizations.Types.ListAccountsRequest, callback?: (err: AWSError, data: Organizations.Types.ListAccountsResponse) => void): Request<Organizations.Types.ListAccountsResponse, AWSError>;
  /**
   * Lists all the accounts in the organization. To request only the accounts in a specified root or organizational unit (OU), use the ListAccountsForParent operation instead.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listAccounts(callback?: (err: AWSError, data: Organizations.Types.ListAccountsResponse) => void): Request<Organizations.Types.ListAccountsResponse, AWSError>;
  /**
   * Lists the accounts in an organization that are contained by the specified target root or organizational unit (OU). If you specify the root, you get a list of all the accounts that aren't in any OU. If you specify an OU, you get a list of all the accounts in only that OU and not in any child OUs. To get a list of all accounts in the organization, use the ListAccounts operation.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listAccountsForParent(params: Organizations.Types.ListAccountsForParentRequest, callback?: (err: AWSError, data: Organizations.Types.ListAccountsForParentResponse) => void): Request<Organizations.Types.ListAccountsForParentResponse, AWSError>;
  /**
   * Lists the accounts in an organization that are contained by the specified target root or organizational unit (OU). If you specify the root, you get a list of all the accounts that aren't in any OU. If you specify an OU, you get a list of all the accounts in only that OU and not in any child OUs. To get a list of all accounts in the organization, use the ListAccounts operation.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listAccountsForParent(callback?: (err: AWSError, data: Organizations.Types.ListAccountsForParentResponse) => void): Request<Organizations.Types.ListAccountsForParentResponse, AWSError>;
  /**
   * Lists all of the organizational units (OUs) or accounts that are contained in the specified parent OU or root. This operation, along with ListParents enables you to traverse the tree structure that makes up this root.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listChildren(params: Organizations.Types.ListChildrenRequest, callback?: (err: AWSError, data: Organizations.Types.ListChildrenResponse) => void): Request<Organizations.Types.ListChildrenResponse, AWSError>;
  /**
   * Lists all of the organizational units (OUs) or accounts that are contained in the specified parent OU or root. This operation, along with ListParents enables you to traverse the tree structure that makes up this root.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listChildren(callback?: (err: AWSError, data: Organizations.Types.ListChildrenResponse) => void): Request<Organizations.Types.ListChildrenResponse, AWSError>;
  /**
   * Lists the account creation requests that match the specified status that is currently being tracked for the organization.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listCreateAccountStatus(params: Organizations.Types.ListCreateAccountStatusRequest, callback?: (err: AWSError, data: Organizations.Types.ListCreateAccountStatusResponse) => void): Request<Organizations.Types.ListCreateAccountStatusResponse, AWSError>;
  /**
   * Lists the account creation requests that match the specified status that is currently being tracked for the organization.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listCreateAccountStatus(callback?: (err: AWSError, data: Organizations.Types.ListCreateAccountStatusResponse) => void): Request<Organizations.Types.ListCreateAccountStatusResponse, AWSError>;
  /**
   * Lists the Amazon Web Services accounts that are designated as delegated administrators in this organization. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listDelegatedAdministrators(params: Organizations.Types.ListDelegatedAdministratorsRequest, callback?: (err: AWSError, data: Organizations.Types.ListDelegatedAdministratorsResponse) => void): Request<Organizations.Types.ListDelegatedAdministratorsResponse, AWSError>;
  /**
   * Lists the Amazon Web Services accounts that are designated as delegated administrators in this organization. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listDelegatedAdministrators(callback?: (err: AWSError, data: Organizations.Types.ListDelegatedAdministratorsResponse) => void): Request<Organizations.Types.ListDelegatedAdministratorsResponse, AWSError>;
  /**
   * List the Amazon Web Services services for which the specified account is a delegated administrator. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listDelegatedServicesForAccount(params: Organizations.Types.ListDelegatedServicesForAccountRequest, callback?: (err: AWSError, data: Organizations.Types.ListDelegatedServicesForAccountResponse) => void): Request<Organizations.Types.ListDelegatedServicesForAccountResponse, AWSError>;
  /**
   * List the Amazon Web Services services for which the specified account is a delegated administrator. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listDelegatedServicesForAccount(callback?: (err: AWSError, data: Organizations.Types.ListDelegatedServicesForAccountResponse) => void): Request<Organizations.Types.ListDelegatedServicesForAccountResponse, AWSError>;
  /**
   * Lists the current handshakes that are associated with the account of the requesting user. Handshakes that are ACCEPTED, DECLINED, CANCELED, or EXPIRED appear in the results of this API for only 30 days after changing to that state. After that, they're deleted and no longer accessible.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called from any account in the organization.
   */
  listHandshakesForAccount(params: Organizations.Types.ListHandshakesForAccountRequest, callback?: (err: AWSError, data: Organizations.Types.ListHandshakesForAccountResponse) => void): Request<Organizations.Types.ListHandshakesForAccountResponse, AWSError>;
  /**
   * Lists the current handshakes that are associated with the account of the requesting user. Handshakes that are ACCEPTED, DECLINED, CANCELED, or EXPIRED appear in the results of this API for only 30 days after changing to that state. After that, they're deleted and no longer accessible.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called from any account in the organization.
   */
  listHandshakesForAccount(callback?: (err: AWSError, data: Organizations.Types.ListHandshakesForAccountResponse) => void): Request<Organizations.Types.ListHandshakesForAccountResponse, AWSError>;
  /**
   * Lists the handshakes that are associated with the organization that the requesting user is part of. The ListHandshakesForOrganization operation returns a list of handshake structures. Each structure contains details and status about a handshake. Handshakes that are ACCEPTED, DECLINED, CANCELED, or EXPIRED appear in the results of this API for only 30 days after changing to that state. After that, they're deleted and no longer accessible.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listHandshakesForOrganization(params: Organizations.Types.ListHandshakesForOrganizationRequest, callback?: (err: AWSError, data: Organizations.Types.ListHandshakesForOrganizationResponse) => void): Request<Organizations.Types.ListHandshakesForOrganizationResponse, AWSError>;
  /**
   * Lists the handshakes that are associated with the organization that the requesting user is part of. The ListHandshakesForOrganization operation returns a list of handshake structures. Each structure contains details and status about a handshake. Handshakes that are ACCEPTED, DECLINED, CANCELED, or EXPIRED appear in the results of this API for only 30 days after changing to that state. After that, they're deleted and no longer accessible.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listHandshakesForOrganization(callback?: (err: AWSError, data: Organizations.Types.ListHandshakesForOrganizationResponse) => void): Request<Organizations.Types.ListHandshakesForOrganizationResponse, AWSError>;
  /**
   * Lists the organizational units (OUs) in a parent organizational unit or root.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listOrganizationalUnitsForParent(params: Organizations.Types.ListOrganizationalUnitsForParentRequest, callback?: (err: AWSError, data: Organizations.Types.ListOrganizationalUnitsForParentResponse) => void): Request<Organizations.Types.ListOrganizationalUnitsForParentResponse, AWSError>;
  /**
   * Lists the organizational units (OUs) in a parent organizational unit or root.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listOrganizationalUnitsForParent(callback?: (err: AWSError, data: Organizations.Types.ListOrganizationalUnitsForParentResponse) => void): Request<Organizations.Types.ListOrganizationalUnitsForParentResponse, AWSError>;
  /**
   * Lists the root or organizational units (OUs) that serve as the immediate parent of the specified child OU or account. This operation, along with ListChildren enables you to traverse the tree structure that makes up this root.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.  In the current release, a child can have only a single parent. 
   */
  listParents(params: Organizations.Types.ListParentsRequest, callback?: (err: AWSError, data: Organizations.Types.ListParentsResponse) => void): Request<Organizations.Types.ListParentsResponse, AWSError>;
  /**
   * Lists the root or organizational units (OUs) that serve as the immediate parent of the specified child OU or account. This operation, along with ListChildren enables you to traverse the tree structure that makes up this root.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.  In the current release, a child can have only a single parent. 
   */
  listParents(callback?: (err: AWSError, data: Organizations.Types.ListParentsResponse) => void): Request<Organizations.Types.ListParentsResponse, AWSError>;
  /**
   * Retrieves the list of all policies in an organization of a specified type.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listPolicies(params: Organizations.Types.ListPoliciesRequest, callback?: (err: AWSError, data: Organizations.Types.ListPoliciesResponse) => void): Request<Organizations.Types.ListPoliciesResponse, AWSError>;
  /**
   * Retrieves the list of all policies in an organization of a specified type.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listPolicies(callback?: (err: AWSError, data: Organizations.Types.ListPoliciesResponse) => void): Request<Organizations.Types.ListPoliciesResponse, AWSError>;
  /**
   * Lists the policies that are directly attached to the specified target root, organizational unit (OU), or account. You must specify the policy type that you want included in the returned list.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listPoliciesForTarget(params: Organizations.Types.ListPoliciesForTargetRequest, callback?: (err: AWSError, data: Organizations.Types.ListPoliciesForTargetResponse) => void): Request<Organizations.Types.ListPoliciesForTargetResponse, AWSError>;
  /**
   * Lists the policies that are directly attached to the specified target root, organizational unit (OU), or account. You must specify the policy type that you want included in the returned list.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listPoliciesForTarget(callback?: (err: AWSError, data: Organizations.Types.ListPoliciesForTargetResponse) => void): Request<Organizations.Types.ListPoliciesForTargetResponse, AWSError>;
  /**
   * Lists the roots that are defined in the current organization.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.  Policy types can be enabled and disabled in roots. This is distinct from whether they're available in the organization. When you enable all features, you make policy types available for use in that organization. Individual policy types can then be enabled and disabled in a root. To see the availability of a policy type in an organization, use DescribeOrganization. 
   */
  listRoots(params: Organizations.Types.ListRootsRequest, callback?: (err: AWSError, data: Organizations.Types.ListRootsResponse) => void): Request<Organizations.Types.ListRootsResponse, AWSError>;
  /**
   * Lists the roots that are defined in the current organization.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.  Policy types can be enabled and disabled in roots. This is distinct from whether they're available in the organization. When you enable all features, you make policy types available for use in that organization. Individual policy types can then be enabled and disabled in a root. To see the availability of a policy type in an organization, use DescribeOrganization. 
   */
  listRoots(callback?: (err: AWSError, data: Organizations.Types.ListRootsResponse) => void): Request<Organizations.Types.ListRootsResponse, AWSError>;
  /**
   * Lists tags that are attached to the specified resource. You can attach tags to the following resources in Organizations.   Amazon Web Services account   Organization root   Organizational unit (OU)   Policy (any type)   This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listTagsForResource(params: Organizations.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Organizations.Types.ListTagsForResourceResponse) => void): Request<Organizations.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists tags that are attached to the specified resource. You can attach tags to the following resources in Organizations.   Amazon Web Services account   Organization root   Organizational unit (OU)   Policy (any type)   This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listTagsForResource(callback?: (err: AWSError, data: Organizations.Types.ListTagsForResourceResponse) => void): Request<Organizations.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all the roots, organizational units (OUs), and accounts that the specified policy is attached to.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listTargetsForPolicy(params: Organizations.Types.ListTargetsForPolicyRequest, callback?: (err: AWSError, data: Organizations.Types.ListTargetsForPolicyResponse) => void): Request<Organizations.Types.ListTargetsForPolicyResponse, AWSError>;
  /**
   * Lists all the roots, organizational units (OUs), and accounts that the specified policy is attached to.  Always check the NextToken response parameter for a null value when calling a List* operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display.  This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  listTargetsForPolicy(callback?: (err: AWSError, data: Organizations.Types.ListTargetsForPolicyResponse) => void): Request<Organizations.Types.ListTargetsForPolicyResponse, AWSError>;
  /**
   * Moves an account from its current source parent root or organizational unit (OU) to the specified destination parent root or OU. This operation can be called only from the organization's management account.
   */
  moveAccount(params: Organizations.Types.MoveAccountRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Moves an account from its current source parent root or organizational unit (OU) to the specified destination parent root or OU. This operation can be called only from the organization's management account.
   */
  moveAccount(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates or updates a resource policy. You can only call this operation from the organization's management account.
   */
  putResourcePolicy(params: Organizations.Types.PutResourcePolicyRequest, callback?: (err: AWSError, data: Organizations.Types.PutResourcePolicyResponse) => void): Request<Organizations.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Creates or updates a resource policy. You can only call this operation from the organization's management account.
   */
  putResourcePolicy(callback?: (err: AWSError, data: Organizations.Types.PutResourcePolicyResponse) => void): Request<Organizations.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Enables the specified member account to administer the Organizations features of the specified Amazon Web Services service. It grants read-only access to Organizations service data. The account still requires IAM permissions to access and administer the Amazon Web Services service. You can run this action only for Amazon Web Services services that support this feature. For a current list of services that support it, see the column Supports Delegated Administrator in the table at Amazon Web Services Services that you can use with Organizations in the Organizations User Guide.  This operation can be called only from the organization's management account.
   */
  registerDelegatedAdministrator(params: Organizations.Types.RegisterDelegatedAdministratorRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables the specified member account to administer the Organizations features of the specified Amazon Web Services service. It grants read-only access to Organizations service data. The account still requires IAM permissions to access and administer the Amazon Web Services service. You can run this action only for Amazon Web Services services that support this feature. For a current list of services that support it, see the column Supports Delegated Administrator in the table at Amazon Web Services Services that you can use with Organizations in the Organizations User Guide.  This operation can be called only from the organization's management account.
   */
  registerDelegatedAdministrator(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified account from the organization. The removed account becomes a standalone account that isn't a member of any organization. It's no longer subject to any policies and is responsible for its own bill payments. The organization's management account is no longer charged for any expenses accrued by the member account after it's removed from the organization. This operation can be called only from the organization's management account. Member accounts can remove themselves with LeaveOrganization instead.    You can remove an account from your organization only if the account is configured with the information required to operate as a standalone account. When you create an account in an organization using the Organizations console, API, or CLI commands, the information required of standalone accounts is not automatically collected. For more information, see Considerations before removing an account from an organization in the Organizations User Guide.   The account that you want to leave must not be a delegated administrator account for any Amazon Web Services service enabled for your organization. If the account is a delegated administrator, you must first change the delegated administrator account to another account that is remaining in the organization.   After the account leaves the organization, all tags that were attached to the account object in the organization are deleted. Amazon Web Services accounts outside of an organization do not support tags.   
   */
  removeAccountFromOrganization(params: Organizations.Types.RemoveAccountFromOrganizationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified account from the organization. The removed account becomes a standalone account that isn't a member of any organization. It's no longer subject to any policies and is responsible for its own bill payments. The organization's management account is no longer charged for any expenses accrued by the member account after it's removed from the organization. This operation can be called only from the organization's management account. Member accounts can remove themselves with LeaveOrganization instead.    You can remove an account from your organization only if the account is configured with the information required to operate as a standalone account. When you create an account in an organization using the Organizations console, API, or CLI commands, the information required of standalone accounts is not automatically collected. For more information, see Considerations before removing an account from an organization in the Organizations User Guide.   The account that you want to leave must not be a delegated administrator account for any Amazon Web Services service enabled for your organization. If the account is a delegated administrator, you must first change the delegated administrator account to another account that is remaining in the organization.   After the account leaves the organization, all tags that were attached to the account object in the organization are deleted. Amazon Web Services accounts outside of an organization do not support tags.   
   */
  removeAccountFromOrganization(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to the specified resource. Currently, you can attach tags to the following resources in Organizations.   Amazon Web Services account   Organization root   Organizational unit (OU)   Policy (any type)   This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  tagResource(params: Organizations.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to the specified resource. Currently, you can attach tags to the following resources in Organizations.   Amazon Web Services account   Organization root   Organizational unit (OU)   Policy (any type)   This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes any tags with the specified keys from the specified resource. You can attach tags to the following resources in Organizations.   Amazon Web Services account   Organization root   Organizational unit (OU)   Policy (any type)   This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  untagResource(params: Organizations.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes any tags with the specified keys from the specified resource. You can attach tags to the following resources in Organizations.   Amazon Web Services account   Organization root   Organizational unit (OU)   Policy (any type)   This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Renames the specified organizational unit (OU). The ID and ARN don't change. The child OUs and accounts remain in place, and any attached policies of the OU remain attached. This operation can be called only from the organization's management account.
   */
  updateOrganizationalUnit(params: Organizations.Types.UpdateOrganizationalUnitRequest, callback?: (err: AWSError, data: Organizations.Types.UpdateOrganizationalUnitResponse) => void): Request<Organizations.Types.UpdateOrganizationalUnitResponse, AWSError>;
  /**
   * Renames the specified organizational unit (OU). The ID and ARN don't change. The child OUs and accounts remain in place, and any attached policies of the OU remain attached. This operation can be called only from the organization's management account.
   */
  updateOrganizationalUnit(callback?: (err: AWSError, data: Organizations.Types.UpdateOrganizationalUnitResponse) => void): Request<Organizations.Types.UpdateOrganizationalUnitResponse, AWSError>;
  /**
   * Updates an existing policy with a new name, description, or content. If you don't supply any parameter, that value remains unchanged. You can't change a policy's type. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  updatePolicy(params: Organizations.Types.UpdatePolicyRequest, callback?: (err: AWSError, data: Organizations.Types.UpdatePolicyResponse) => void): Request<Organizations.Types.UpdatePolicyResponse, AWSError>;
  /**
   * Updates an existing policy with a new name, description, or content. If you don't supply any parameter, that value remains unchanged. You can't change a policy's type. This operation can be called only from the organization's management account or by a member account that is a delegated administrator for an Amazon Web Services service.
   */
  updatePolicy(callback?: (err: AWSError, data: Organizations.Types.UpdatePolicyResponse) => void): Request<Organizations.Types.UpdatePolicyResponse, AWSError>;
}
declare namespace Organizations {
  export interface AcceptHandshakeRequest {
    /**
     * The unique identifier (ID) of the handshake that you want to accept. The regex pattern for handshake ID string requires "h-" followed by from 8 to 32 lowercase letters or digits.
     */
    HandshakeId: HandshakeId;
  }
  export interface AcceptHandshakeResponse {
    /**
     * A structure that contains details about the accepted handshake.
     */
    Handshake?: Handshake;
  }
  export interface Account {
    /**
     * The unique identifier (ID) of the account. The regex pattern for an account ID string requires exactly 12 digits.
     */
    Id?: AccountId;
    /**
     * The Amazon Resource Name (ARN) of the account. For more information about ARNs in Organizations, see ARN Formats Supported by Organizations in the Amazon Web Services Service Authorization Reference.
     */
    Arn?: AccountArn;
    /**
     * The email address associated with the Amazon Web Services account. The regex pattern for this parameter is a string of characters that represents a standard internet email address.
     */
    Email?: Email;
    /**
     * The friendly name of the account. The regex pattern that is used to validate this parameter is a string of any of the characters in the ASCII character range.
     */
    Name?: AccountName;
    /**
     * The status of the account in the organization.
     */
    Status?: AccountStatus;
    /**
     * The method by which the account joined the organization.
     */
    JoinedMethod?: AccountJoinedMethod;
    /**
     * The date the account became a part of the organization.
     */
    JoinedTimestamp?: Timestamp;
  }
  export type AccountArn = string;
  export type AccountId = string;
  export type AccountJoinedMethod = "INVITED"|"CREATED"|string;
  export type AccountName = string;
  export type AccountStatus = "ACTIVE"|"SUSPENDED"|"PENDING_CLOSURE"|string;
  export type Accounts = Account[];
  export type ActionType = "INVITE"|"ENABLE_ALL_FEATURES"|"APPROVE_ALL_FEATURES"|"ADD_ORGANIZATIONS_SERVICE_LINKED_ROLE"|string;
  export interface AttachPolicyRequest {
    /**
     * The unique identifier (ID) of the policy that you want to attach to the target. You can get the ID for the policy by calling the ListPolicies operation. The regex pattern for a policy ID string requires "p-" followed by from 8 to 128 lowercase or uppercase letters, digits, or the underscore character (_).
     */
    PolicyId: PolicyId;
    /**
     * The unique identifier (ID) of the root, OU, or account that you want to attach the policy to. You can get the ID by calling the ListRoots, ListOrganizationalUnitsForParent, or ListAccounts operations. The regex pattern for a target ID string requires one of the following:    Root - A string that begins with "r-" followed by from 4 to 32 lowercase letters or digits.    Account - A string that consists of exactly 12 digits.    Organizational unit (OU) - A string that begins with "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that the OU is in). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.  
     */
    TargetId: PolicyTargetId;
  }
  export type AwsManagedPolicy = boolean;
  export interface CancelHandshakeRequest {
    /**
     * The unique identifier (ID) of the handshake that you want to cancel. You can get the ID from the ListHandshakesForOrganization operation. The regex pattern for handshake ID string requires "h-" followed by from 8 to 32 lowercase letters or digits.
     */
    HandshakeId: HandshakeId;
  }
  export interface CancelHandshakeResponse {
    /**
     * A structure that contains details about the handshake that you canceled.
     */
    Handshake?: Handshake;
  }
  export interface Child {
    /**
     * The unique identifier (ID) of this child entity. The regex pattern for a child ID string requires one of the following:    Account - A string that consists of exactly 12 digits.    Organizational unit (OU) - A string that begins with "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that contains the OU). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.  
     */
    Id?: ChildId;
    /**
     * The type of this child entity.
     */
    Type?: ChildType;
  }
  export type ChildId = string;
  export type ChildType = "ACCOUNT"|"ORGANIZATIONAL_UNIT"|string;
  export type Children = Child[];
  export interface CloseAccountRequest {
    /**
     * Retrieves the Amazon Web Services account Id for the current CloseAccount API request. 
     */
    AccountId: AccountId;
  }
  export type CreateAccountFailureReason = "ACCOUNT_LIMIT_EXCEEDED"|"EMAIL_ALREADY_EXISTS"|"INVALID_ADDRESS"|"INVALID_EMAIL"|"CONCURRENT_ACCOUNT_MODIFICATION"|"INTERNAL_FAILURE"|"GOVCLOUD_ACCOUNT_ALREADY_EXISTS"|"MISSING_BUSINESS_VALIDATION"|"FAILED_BUSINESS_VALIDATION"|"PENDING_BUSINESS_VALIDATION"|"INVALID_IDENTITY_FOR_BUSINESS_VALIDATION"|"UNKNOWN_BUSINESS_VALIDATION"|"MISSING_PAYMENT_INSTRUMENT"|"INVALID_PAYMENT_INSTRUMENT"|"UPDATE_EXISTING_RESOURCE_POLICY_WITH_TAGS_NOT_SUPPORTED"|string;
  export type CreateAccountName = string;
  export interface CreateAccountRequest {
    /**
     * The email address of the owner to assign to the new member account. This email address must not already be associated with another Amazon Web Services account. You must use a valid email address to complete account creation. The rules for a valid email address:   The address must be a minimum of 6 and a maximum of 64 characters long.   All characters must be 7-bit ASCII characters.   There must be one and only one @ symbol, which separates the local name from the domain name.   The local name can't contain any of the following characters: whitespace, " ' ( ) &lt; &gt; [ ] : ; , \ | % &amp;   The local name can't begin with a dot (.)   The domain name can consist of only the characters [a-z],[A-Z],[0-9], hyphen (-), or dot (.)   The domain name can't begin or end with a hyphen (-) or dot (.)   The domain name must contain at least one dot   You can't access the root user of the account or remove an account that was created with an invalid email address.
     */
    Email: Email;
    /**
     * The friendly name of the member account.
     */
    AccountName: CreateAccountName;
    /**
     * The name of an IAM role that Organizations automatically preconfigures in the new member account. This role trusts the management account, allowing users in the management account to assume the role, as permitted by the management account administrator. The role has administrator permissions in the new member account. If you don't specify this parameter, the role name defaults to OrganizationAccountAccessRole. For more information about how to use this role to access the member account, see the following links:    Creating the OrganizationAccountAccessRole in an invited member account in the Organizations User Guide    Steps 2 and 3 in IAM Tutorial: Delegate access across Amazon Web Services accounts using IAM roles in the IAM User Guide    The regex pattern that is used to validate this parameter. The pattern can include uppercase letters, lowercase letters, digits with no spaces, and any of the following characters: =,.@-
     */
    RoleName?: RoleName;
    /**
     * If set to ALLOW, the new account enables IAM users to access account billing information if they have the required permissions. If set to DENY, only the root user of the new account can access account billing information. For more information, see About IAM access to the Billing and Cost Management console in the Amazon Web Services Billing and Cost Management User Guide. If you don't specify this parameter, the value defaults to ALLOW, and IAM users and roles with the required permissions can access billing information for the new account.
     */
    IamUserAccessToBilling?: IAMUserAccessToBilling;
    /**
     * A list of tags that you want to attach to the newly created account. For each tag in the list, you must specify both a tag key and a value. You can set the value to an empty string, but you can't set it to null. For more information about tagging, see Tagging Organizations resources in the Organizations User Guide.  If any one of the tags is not valid or if you exceed the maximum allowed number of tags for an account, then the entire request fails and the account is not created. 
     */
    Tags?: Tags;
  }
  export type CreateAccountRequestId = string;
  export interface CreateAccountResponse {
    /**
     * A structure that contains details about the request to create an account. This response structure might not be fully populated when you first receive it because account creation is an asynchronous process. You can pass the returned CreateAccountStatus ID as a parameter to DescribeCreateAccountStatus to get status about the progress of the request at later times. You can also check the CloudTrail log for the CreateAccountResult event. For more information, see Logging and monitoring in Organizations in the Organizations User Guide.
     */
    CreateAccountStatus?: CreateAccountStatus;
  }
  export type CreateAccountState = "IN_PROGRESS"|"SUCCEEDED"|"FAILED"|string;
  export type CreateAccountStates = CreateAccountState[];
  export interface CreateAccountStatus {
    /**
     * The unique identifier (ID) that references this request. You get this value from the response of the initial CreateAccount request to create the account. The regex pattern for a create account request ID string requires "car-" followed by from 8 to 32 lowercase letters or digits.
     */
    Id?: CreateAccountRequestId;
    /**
     * The account name given to the account when it was created.
     */
    AccountName?: CreateAccountName;
    /**
     * The status of the asynchronous request to create an Amazon Web Services account.
     */
    State?: CreateAccountState;
    /**
     * The date and time that the request was made for the account creation.
     */
    RequestedTimestamp?: Timestamp;
    /**
     * The date and time that the account was created and the request completed.
     */
    CompletedTimestamp?: Timestamp;
    /**
     * If the account was created successfully, the unique identifier (ID) of the new account. The regex pattern for an account ID string requires exactly 12 digits.
     */
    AccountId?: AccountId;
    /**
     * If the account was created successfully, the unique identifier (ID) of the new account in the Amazon Web Services GovCloud (US) Region.
     */
    GovCloudAccountId?: AccountId;
    /**
     * If the request failed, a description of the reason for the failure.   ACCOUNT_LIMIT_EXCEEDED: The account couldn't be created because you reached the limit on the number of accounts in your organization.   CONCURRENT_ACCOUNT_MODIFICATION: You already submitted a request with the same information.   EMAIL_ALREADY_EXISTS: The account could not be created because another Amazon Web Services account with that email address already exists.   FAILED_BUSINESS_VALIDATION: The Amazon Web Services account that owns your organization failed to receive business license validation.   GOVCLOUD_ACCOUNT_ALREADY_EXISTS: The account in the Amazon Web Services GovCloud (US) Region could not be created because this Region already includes an account with that email address.   IDENTITY_INVALID_BUSINESS_VALIDATION: The Amazon Web Services account that owns your organization can't complete business license validation because it doesn't have valid identity data.   INVALID_ADDRESS: The account could not be created because the address you provided is not valid.   INVALID_EMAIL: The account could not be created because the email address you provided is not valid.   INVALID_PAYMENT_INSTRUMENT: The Amazon Web Services account that owns your organization does not have a supported payment method associated with the account. Amazon Web Services does not support cards issued by financial institutions in Russia or Belarus. For more information, see Managing your Amazon Web Services payments.   INTERNAL_FAILURE: The account could not be created because of an internal failure. Try again later. If the problem persists, contact Amazon Web Services Customer Support.   MISSING_BUSINESS_VALIDATION: The Amazon Web Services account that owns your organization has not received Business Validation.    MISSING_PAYMENT_INSTRUMENT: You must configure the management account with a valid payment method, such as a credit card.   PENDING_BUSINESS_VALIDATION: The Amazon Web Services account that owns your organization is still in the process of completing business license validation.   UNKNOWN_BUSINESS_VALIDATION: The Amazon Web Services account that owns your organization has an unknown issue with business license validation.  
     */
    FailureReason?: CreateAccountFailureReason;
  }
  export type CreateAccountStatuses = CreateAccountStatus[];
  export interface CreateGovCloudAccountRequest {
    /**
     * Specifies the email address of the owner to assign to the new member account in the commercial Region. This email address must not already be associated with another Amazon Web Services account. You must use a valid email address to complete account creation. The rules for a valid email address:   The address must be a minimum of 6 and a maximum of 64 characters long.   All characters must be 7-bit ASCII characters.   There must be one and only one @ symbol, which separates the local name from the domain name.   The local name can't contain any of the following characters: whitespace, " ' ( ) &lt; &gt; [ ] : ; , \ | % &amp;   The local name can't begin with a dot (.)   The domain name can consist of only the characters [a-z],[A-Z],[0-9], hyphen (-), or dot (.)   The domain name can't begin or end with a hyphen (-) or dot (.)   The domain name must contain at least one dot   You can't access the root user of the account or remove an account that was created with an invalid email address. Like all request parameters for CreateGovCloudAccount, the request for the email address for the Amazon Web Services GovCloud (US) account originates from the commercial Region, not from the Amazon Web Services GovCloud (US) Region.
     */
    Email: Email;
    /**
     * The friendly name of the member account.  The account name can consist of only the characters [a-z],[A-Z],[0-9], hyphen (-), or dot (.) You can't separate characters with a dash (–).
     */
    AccountName: CreateAccountName;
    /**
     * (Optional) The name of an IAM role that Organizations automatically preconfigures in the new member accounts in both the Amazon Web Services GovCloud (US) Region and in the commercial Region. This role trusts the management account, allowing users in the management account to assume the role, as permitted by the management account administrator. The role has administrator permissions in the new member account. If you don't specify this parameter, the role name defaults to OrganizationAccountAccessRole. For more information about how to use this role to access the member account, see the following links:    Creating the OrganizationAccountAccessRole in an invited member account in the Organizations User Guide    Steps 2 and 3 in IAM Tutorial: Delegate access across Amazon Web Services accounts using IAM roles in the IAM User Guide    The regex pattern that is used to validate this parameter. The pattern can include uppercase letters, lowercase letters, digits with no spaces, and any of the following characters: =,.@-
     */
    RoleName?: RoleName;
    /**
     * If set to ALLOW, the new linked account in the commercial Region enables IAM users to access account billing information if they have the required permissions. If set to DENY, only the root user of the new account can access account billing information. For more information, see About IAM access to the Billing and Cost Management console in the Amazon Web Services Billing and Cost Management User Guide. If you don't specify this parameter, the value defaults to ALLOW, and IAM users and roles with the required permissions can access billing information for the new account.
     */
    IamUserAccessToBilling?: IAMUserAccessToBilling;
    /**
     * A list of tags that you want to attach to the newly created account. These tags are attached to the commercial account associated with the GovCloud account, and not to the GovCloud account itself. To add tags to the actual GovCloud account, call the TagResource operation in the GovCloud region after the new GovCloud account exists. For each tag in the list, you must specify both a tag key and a value. You can set the value to an empty string, but you can't set it to null. For more information about tagging, see Tagging Organizations resources in the Organizations User Guide.  If any one of the tags is not valid or if you exceed the maximum allowed number of tags for an account, then the entire request fails and the account is not created. 
     */
    Tags?: Tags;
  }
  export interface CreateGovCloudAccountResponse {
    CreateAccountStatus?: CreateAccountStatus;
  }
  export interface CreateOrganizationRequest {
    /**
     * Specifies the feature set supported by the new organization. Each feature set supports different levels of functionality.    CONSOLIDATED_BILLING: All member accounts have their bills consolidated to and paid by the management account. For more information, see Consolidated billing in the Organizations User Guide.  The consolidated billing feature subset isn't available for organizations in the Amazon Web Services GovCloud (US) Region.    ALL: In addition to all the features supported by the consolidated billing feature set, the management account can also apply any policy type to any member account in the organization. For more information, see All features in the Organizations User Guide.  
     */
    FeatureSet?: OrganizationFeatureSet;
  }
  export interface CreateOrganizationResponse {
    /**
     * A structure that contains details about the newly created organization.
     */
    Organization?: Organization;
  }
  export interface CreateOrganizationalUnitRequest {
    /**
     * The unique identifier (ID) of the parent root or OU that you want to create the new OU in. The regex pattern for a parent ID string requires one of the following:    Root - A string that begins with "r-" followed by from 4 to 32 lowercase letters or digits.    Organizational unit (OU) - A string that begins with "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that the OU is in). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.  
     */
    ParentId: ParentId;
    /**
     * The friendly name to assign to the new OU.
     */
    Name: OrganizationalUnitName;
    /**
     * A list of tags that you want to attach to the newly created OU. For each tag in the list, you must specify both a tag key and a value. You can set the value to an empty string, but you can't set it to null. For more information about tagging, see Tagging Organizations resources in the Organizations User Guide.  If any one of the tags is not valid or if you exceed the allowed number of tags for an OU, then the entire request fails and the OU is not created. 
     */
    Tags?: Tags;
  }
  export interface CreateOrganizationalUnitResponse {
    /**
     * A structure that contains details about the newly created OU.
     */
    OrganizationalUnit?: OrganizationalUnit;
  }
  export interface CreatePolicyRequest {
    /**
     * The policy text content to add to the new policy. The text that you supply must adhere to the rules of the policy type you specify in the Type parameter.
     */
    Content: PolicyContent;
    /**
     * An optional description to assign to the policy.
     */
    Description: PolicyDescription;
    /**
     * The friendly name to assign to the policy. The regex pattern that is used to validate this parameter is a string of any of the characters in the ASCII character range.
     */
    Name: PolicyName;
    /**
     * The type of policy to create. You can specify one of the following values:    AISERVICES_OPT_OUT_POLICY     BACKUP_POLICY     SERVICE_CONTROL_POLICY     TAG_POLICY   
     */
    Type: PolicyType;
    /**
     * A list of tags that you want to attach to the newly created policy. For each tag in the list, you must specify both a tag key and a value. You can set the value to an empty string, but you can't set it to null. For more information about tagging, see Tagging Organizations resources in the Organizations User Guide.  If any one of the tags is not valid or if you exceed the allowed number of tags for a policy, then the entire request fails and the policy is not created. 
     */
    Tags?: Tags;
  }
  export interface CreatePolicyResponse {
    /**
     * A structure that contains details about the newly created policy.
     */
    Policy?: Policy;
  }
  export interface DeclineHandshakeRequest {
    /**
     * The unique identifier (ID) of the handshake that you want to decline. You can get the ID from the ListHandshakesForAccount operation. The regex pattern for handshake ID string requires "h-" followed by from 8 to 32 lowercase letters or digits.
     */
    HandshakeId: HandshakeId;
  }
  export interface DeclineHandshakeResponse {
    /**
     * A structure that contains details about the declined handshake. The state is updated to show the value DECLINED.
     */
    Handshake?: Handshake;
  }
  export interface DelegatedAdministrator {
    /**
     * The unique identifier (ID) of the delegated administrator's account.
     */
    Id?: AccountId;
    /**
     * The Amazon Resource Name (ARN) of the delegated administrator's account.
     */
    Arn?: AccountArn;
    /**
     * The email address that is associated with the delegated administrator's Amazon Web Services account.
     */
    Email?: Email;
    /**
     * The friendly name of the delegated administrator's account.
     */
    Name?: AccountName;
    /**
     * The status of the delegated administrator's account in the organization.
     */
    Status?: AccountStatus;
    /**
     * The method by which the delegated administrator's account joined the organization.
     */
    JoinedMethod?: AccountJoinedMethod;
    /**
     * The date when the delegated administrator's account became a part of the organization.
     */
    JoinedTimestamp?: Timestamp;
    /**
     * The date when the account was made a delegated administrator.
     */
    DelegationEnabledDate?: Timestamp;
  }
  export type DelegatedAdministrators = DelegatedAdministrator[];
  export interface DelegatedService {
    /**
     * The name of an Amazon Web Services service that can request an operation for the specified service. This is typically in the form of a URL, such as:  servicename.amazonaws.com.
     */
    ServicePrincipal?: ServicePrincipal;
    /**
     * The date that the account became a delegated administrator for this service. 
     */
    DelegationEnabledDate?: Timestamp;
  }
  export type DelegatedServices = DelegatedService[];
  export interface DeleteOrganizationalUnitRequest {
    /**
     * The unique identifier (ID) of the organizational unit that you want to delete. You can get the ID from the ListOrganizationalUnitsForParent operation. The regex pattern for an organizational unit ID string requires "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that contains the OU). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.
     */
    OrganizationalUnitId: OrganizationalUnitId;
  }
  export interface DeletePolicyRequest {
    /**
     * The unique identifier (ID) of the policy that you want to delete. You can get the ID from the ListPolicies or ListPoliciesForTarget operations. The regex pattern for a policy ID string requires "p-" followed by from 8 to 128 lowercase or uppercase letters, digits, or the underscore character (_).
     */
    PolicyId: PolicyId;
  }
  export interface DeregisterDelegatedAdministratorRequest {
    /**
     * The account ID number of the member account in the organization that you want to deregister as a delegated administrator.
     */
    AccountId: AccountId;
    /**
     * The service principal name of an Amazon Web Services service for which the account is a delegated administrator. Delegated administrator privileges are revoked for only the specified Amazon Web Services service from the member account. If the specified service is the only service for which the member account is a delegated administrator, the operation also revokes Organizations read action permissions.
     */
    ServicePrincipal: ServicePrincipal;
  }
  export interface DescribeAccountRequest {
    /**
     * The unique identifier (ID) of the Amazon Web Services account that you want information about. You can get the ID from the ListAccounts or ListAccountsForParent operations. The regex pattern for an account ID string requires exactly 12 digits.
     */
    AccountId: AccountId;
  }
  export interface DescribeAccountResponse {
    /**
     * A structure that contains information about the requested account.
     */
    Account?: Account;
  }
  export interface DescribeCreateAccountStatusRequest {
    /**
     * Specifies the Id value that uniquely identifies the CreateAccount request. You can get the value from the CreateAccountStatus.Id response in an earlier CreateAccount request, or from the ListCreateAccountStatus operation. The regex pattern for a create account request ID string requires "car-" followed by from 8 to 32 lowercase letters or digits.
     */
    CreateAccountRequestId: CreateAccountRequestId;
  }
  export interface DescribeCreateAccountStatusResponse {
    /**
     * A structure that contains the current status of an account creation request.
     */
    CreateAccountStatus?: CreateAccountStatus;
  }
  export interface DescribeEffectivePolicyRequest {
    /**
     * The type of policy that you want information about. You can specify one of the following values:    AISERVICES_OPT_OUT_POLICY     BACKUP_POLICY     TAG_POLICY   
     */
    PolicyType: EffectivePolicyType;
    /**
     * When you're signed in as the management account, specify the ID of the account that you want details about. Specifying an organization root or organizational unit (OU) as the target is not supported.
     */
    TargetId?: PolicyTargetId;
  }
  export interface DescribeEffectivePolicyResponse {
    /**
     * The contents of the effective policy.
     */
    EffectivePolicy?: EffectivePolicy;
  }
  export interface DescribeHandshakeRequest {
    /**
     * The unique identifier (ID) of the handshake that you want information about. You can get the ID from the original call to InviteAccountToOrganization, or from a call to ListHandshakesForAccount or ListHandshakesForOrganization. The regex pattern for handshake ID string requires "h-" followed by from 8 to 32 lowercase letters or digits.
     */
    HandshakeId: HandshakeId;
  }
  export interface DescribeHandshakeResponse {
    /**
     * A structure that contains information about the specified handshake.
     */
    Handshake?: Handshake;
  }
  export interface DescribeOrganizationResponse {
    /**
     * A structure that contains information about the organization.  The AvailablePolicyTypes part of the response is deprecated, and you shouldn't use it in your apps. It doesn't include any policy type supported by Organizations other than SCPs. To determine which policy types are enabled in your organization, use the  ListRoots  operation. 
     */
    Organization?: Organization;
  }
  export interface DescribeOrganizationalUnitRequest {
    /**
     * The unique identifier (ID) of the organizational unit that you want details about. You can get the ID from the ListOrganizationalUnitsForParent operation. The regex pattern for an organizational unit ID string requires "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that contains the OU). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.
     */
    OrganizationalUnitId: OrganizationalUnitId;
  }
  export interface DescribeOrganizationalUnitResponse {
    /**
     * A structure that contains details about the specified OU.
     */
    OrganizationalUnit?: OrganizationalUnit;
  }
  export interface DescribePolicyRequest {
    /**
     * The unique identifier (ID) of the policy that you want details about. You can get the ID from the ListPolicies or ListPoliciesForTarget operations. The regex pattern for a policy ID string requires "p-" followed by from 8 to 128 lowercase or uppercase letters, digits, or the underscore character (_).
     */
    PolicyId: PolicyId;
  }
  export interface DescribePolicyResponse {
    /**
     * A structure that contains details about the specified policy.
     */
    Policy?: Policy;
  }
  export interface DescribeResourcePolicyResponse {
    /**
     * A structure that contains details about the resource policy.
     */
    ResourcePolicy?: ResourcePolicy;
  }
  export interface DetachPolicyRequest {
    /**
     * The unique identifier (ID) of the policy you want to detach. You can get the ID from the ListPolicies or ListPoliciesForTarget operations. The regex pattern for a policy ID string requires "p-" followed by from 8 to 128 lowercase or uppercase letters, digits, or the underscore character (_).
     */
    PolicyId: PolicyId;
    /**
     * The unique identifier (ID) of the root, OU, or account that you want to detach the policy from. You can get the ID from the ListRoots, ListOrganizationalUnitsForParent, or ListAccounts operations. The regex pattern for a target ID string requires one of the following:    Root - A string that begins with "r-" followed by from 4 to 32 lowercase letters or digits.    Account - A string that consists of exactly 12 digits.    Organizational unit (OU) - A string that begins with "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that the OU is in). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.  
     */
    TargetId: PolicyTargetId;
  }
  export interface DisableAWSServiceAccessRequest {
    /**
     * The service principal name of the Amazon Web Services service for which you want to disable integration with your organization. This is typically in the form of a URL, such as  service-abbreviation.amazonaws.com.
     */
    ServicePrincipal: ServicePrincipal;
  }
  export interface DisablePolicyTypeRequest {
    /**
     * The unique identifier (ID) of the root in which you want to disable a policy type. You can get the ID from the ListRoots operation. The regex pattern for a root ID string requires "r-" followed by from 4 to 32 lowercase letters or digits.
     */
    RootId: RootId;
    /**
     * The policy type that you want to disable in this root. You can specify one of the following values:    AISERVICES_OPT_OUT_POLICY     BACKUP_POLICY     SERVICE_CONTROL_POLICY     TAG_POLICY   
     */
    PolicyType: PolicyType;
  }
  export interface DisablePolicyTypeResponse {
    /**
     * A structure that shows the root with the updated list of enabled policy types.
     */
    Root?: Root;
  }
  export interface EffectivePolicy {
    /**
     * The text content of the policy.
     */
    PolicyContent?: PolicyContent;
    /**
     * The time of the last update to this policy.
     */
    LastUpdatedTimestamp?: Timestamp;
    /**
     * The account ID of the policy target. 
     */
    TargetId?: PolicyTargetId;
    /**
     * The policy type.
     */
    PolicyType?: EffectivePolicyType;
  }
  export type EffectivePolicyType = "TAG_POLICY"|"BACKUP_POLICY"|"AISERVICES_OPT_OUT_POLICY"|string;
  export type Email = string;
  export interface EnableAWSServiceAccessRequest {
    /**
     * The service principal name of the Amazon Web Services service for which you want to enable integration with your organization. This is typically in the form of a URL, such as  service-abbreviation.amazonaws.com.
     */
    ServicePrincipal: ServicePrincipal;
  }
  export interface EnableAllFeaturesRequest {
  }
  export interface EnableAllFeaturesResponse {
    /**
     * A structure that contains details about the handshake created to support this request to enable all features in the organization.
     */
    Handshake?: Handshake;
  }
  export interface EnablePolicyTypeRequest {
    /**
     * The unique identifier (ID) of the root in which you want to enable a policy type. You can get the ID from the ListRoots operation. The regex pattern for a root ID string requires "r-" followed by from 4 to 32 lowercase letters or digits.
     */
    RootId: RootId;
    /**
     * The policy type that you want to enable. You can specify one of the following values:    AISERVICES_OPT_OUT_POLICY     BACKUP_POLICY     SERVICE_CONTROL_POLICY     TAG_POLICY   
     */
    PolicyType: PolicyType;
  }
  export interface EnablePolicyTypeResponse {
    /**
     * A structure that shows the root with the updated list of enabled policy types.
     */
    Root?: Root;
  }
  export interface EnabledServicePrincipal {
    /**
     * The name of the service principal. This is typically in the form of a URL, such as:  servicename.amazonaws.com.
     */
    ServicePrincipal?: ServicePrincipal;
    /**
     * The date that the service principal was enabled for integration with Organizations.
     */
    DateEnabled?: Timestamp;
  }
  export type EnabledServicePrincipals = EnabledServicePrincipal[];
  export type GenericArn = string;
  export interface Handshake {
    /**
     * The unique identifier (ID) of a handshake. The originating account creates the ID when it initiates the handshake. The regex pattern for handshake ID string requires "h-" followed by from 8 to 32 lowercase letters or digits.
     */
    Id?: HandshakeId;
    /**
     * The Amazon Resource Name (ARN) of a handshake. For more information about ARNs in Organizations, see ARN Formats Supported by Organizations in the Amazon Web Services Service Authorization Reference.
     */
    Arn?: HandshakeArn;
    /**
     * Information about the two accounts that are participating in the handshake.
     */
    Parties?: HandshakeParties;
    /**
     * The current state of the handshake. Use the state to trace the flow of the handshake through the process from its creation to its acceptance. The meaning of each of the valid values is as follows:    REQUESTED: This handshake was sent to multiple recipients (applicable to only some handshake types) and not all recipients have responded yet. The request stays in this state until all recipients respond.    OPEN: This handshake was sent to multiple recipients (applicable to only some policy types) and all recipients have responded, allowing the originator to complete the handshake action.    CANCELED: This handshake is no longer active because it was canceled by the originating account.    ACCEPTED: This handshake is complete because it has been accepted by the recipient.    DECLINED: This handshake is no longer active because it was declined by the recipient account.    EXPIRED: This handshake is no longer active because the originator did not receive a response of any kind from the recipient before the expiration time (15 days).  
     */
    State?: HandshakeState;
    /**
     * The date and time that the handshake request was made.
     */
    RequestedTimestamp?: Timestamp;
    /**
     * The date and time that the handshake expires. If the recipient of the handshake request fails to respond before the specified date and time, the handshake becomes inactive and is no longer valid.
     */
    ExpirationTimestamp?: Timestamp;
    /**
     * The type of handshake, indicating what action occurs when the recipient accepts the handshake. The following handshake types are supported:    INVITE: This type of handshake represents a request to join an organization. It is always sent from the management account to only non-member accounts.    ENABLE_ALL_FEATURES: This type of handshake represents a request to enable all features in an organization. It is always sent from the management account to only invited member accounts. Created accounts do not receive this because those accounts were created by the organization's management account and approval is inferred.    APPROVE_ALL_FEATURES: This type of handshake is sent from the Organizations service when all member accounts have approved the ENABLE_ALL_FEATURES invitation. It is sent only to the management account and signals the master that it can finalize the process to enable all features.  
     */
    Action?: ActionType;
    /**
     * Additional information that is needed to process the handshake.
     */
    Resources?: HandshakeResources;
  }
  export type HandshakeArn = string;
  export interface HandshakeFilter {
    /**
     * Specifies the type of handshake action. If you specify ActionType, you cannot also specify ParentHandshakeId.
     */
    ActionType?: ActionType;
    /**
     * Specifies the parent handshake. Only used for handshake types that are a child of another type. If you specify ParentHandshakeId, you cannot also specify ActionType. The regex pattern for handshake ID string requires "h-" followed by from 8 to 32 lowercase letters or digits.
     */
    ParentHandshakeId?: HandshakeId;
  }
  export type HandshakeId = string;
  export type HandshakeNotes = string;
  export type HandshakeParties = HandshakeParty[];
  export interface HandshakeParty {
    /**
     * The unique identifier (ID) for the party. The regex pattern for handshake ID string requires "h-" followed by from 8 to 32 lowercase letters or digits.
     */
    Id: HandshakePartyId;
    /**
     * The type of party.
     */
    Type: HandshakePartyType;
  }
  export type HandshakePartyId = string;
  export type HandshakePartyType = "ACCOUNT"|"ORGANIZATION"|"EMAIL"|string;
  export interface HandshakeResource {
    /**
     * The information that is passed to the other party in the handshake. The format of the value string must match the requirements of the specified type.
     */
    Value?: HandshakeResourceValue;
    /**
     * The type of information being passed, specifying how the value is to be interpreted by the other party:    ACCOUNT - Specifies an Amazon Web Services account ID number.    ORGANIZATION - Specifies an organization ID number.    EMAIL - Specifies the email address that is associated with the account that receives the handshake.     OWNER_EMAIL - Specifies the email address associated with the management account. Included as information about an organization.     OWNER_NAME - Specifies the name associated with the management account. Included as information about an organization.     NOTES - Additional text provided by the handshake initiator and intended for the recipient to read.  
     */
    Type?: HandshakeResourceType;
    /**
     * When needed, contains an additional array of HandshakeResource objects.
     */
    Resources?: HandshakeResources;
  }
  export type HandshakeResourceType = "ACCOUNT"|"ORGANIZATION"|"ORGANIZATION_FEATURE_SET"|"EMAIL"|"MASTER_EMAIL"|"MASTER_NAME"|"NOTES"|"PARENT_HANDSHAKE"|string;
  export type HandshakeResourceValue = string;
  export type HandshakeResources = HandshakeResource[];
  export type HandshakeState = "REQUESTED"|"OPEN"|"CANCELED"|"ACCEPTED"|"DECLINED"|"EXPIRED"|string;
  export type Handshakes = Handshake[];
  export type IAMUserAccessToBilling = "ALLOW"|"DENY"|string;
  export interface InviteAccountToOrganizationRequest {
    /**
     * The identifier (ID) of the Amazon Web Services account that you want to invite to join your organization. This is a JSON object that contains the following elements:  { "Type": "ACCOUNT", "Id": "&lt; account id number &gt;" }  If you use the CLI, you can submit this as a single string, similar to the following example:  --target Id=123456789012,Type=ACCOUNT  If you specify "Type": "ACCOUNT", you must provide the Amazon Web Services account ID number as the Id. If you specify "Type": "EMAIL", you must specify the email address that is associated with the account.  --target Id=diego@example.com,Type=EMAIL 
     */
    Target: HandshakeParty;
    /**
     * Additional information that you want to include in the generated email to the recipient account owner.
     */
    Notes?: HandshakeNotes;
    /**
     * A list of tags that you want to attach to the account when it becomes a member of the organization. For each tag in the list, you must specify both a tag key and a value. You can set the value to an empty string, but you can't set it to null. For more information about tagging, see Tagging Organizations resources in the Organizations User Guide.  Any tags in the request are checked for compliance with any applicable tag policies when the request is made. The request is rejected if the tags in the request don't match the requirements of the policy at that time. Tag policy compliance is  not  checked again when the invitation is accepted and the tags are actually attached to the account. That means that if the tag policy changes between the invitation and the acceptance, then that tags could potentially be non-compliant.   If any one of the tags is not valid or if you exceed the allowed number of tags for an account, then the entire request fails and invitations are not sent. 
     */
    Tags?: Tags;
  }
  export interface InviteAccountToOrganizationResponse {
    /**
     * A structure that contains details about the handshake that is created to support this invitation request.
     */
    Handshake?: Handshake;
  }
  export interface ListAWSServiceAccessForOrganizationRequest {
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * The total number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value that is specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Organizations might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListAWSServiceAccessForOrganizationResponse {
    /**
     * A list of the service principals for the services that are enabled to integrate with your organization. Each principal is a structure that includes the name and the date that it was enabled for integration with Organizations.
     */
    EnabledServicePrincipals?: EnabledServicePrincipals;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListAccountsForParentRequest {
    /**
     * The unique identifier (ID) for the parent root or organization unit (OU) whose accounts you want to list.
     */
    ParentId: ParentId;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * The total number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value that is specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Organizations might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListAccountsForParentResponse {
    /**
     * A list of the accounts in the specified root or OU.
     */
    Accounts?: Accounts;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListAccountsRequest {
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * The total number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value that is specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Organizations might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListAccountsResponse {
    /**
     * A list of objects in the organization.
     */
    Accounts?: Accounts;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListChildrenRequest {
    /**
     * The unique identifier (ID) for the parent root or OU whose children you want to list. The regex pattern for a parent ID string requires one of the following:    Root - A string that begins with "r-" followed by from 4 to 32 lowercase letters or digits.    Organizational unit (OU) - A string that begins with "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that the OU is in). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.  
     */
    ParentId: ParentId;
    /**
     * Filters the output to include only the specified child type.
     */
    ChildType: ChildType;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * The total number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value that is specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Organizations might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListChildrenResponse {
    /**
     * The list of children of the specified parent container.
     */
    Children?: Children;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListCreateAccountStatusRequest {
    /**
     * A list of one or more states that you want included in the response. If this parameter isn't present, all requests are included in the response.
     */
    States?: CreateAccountStates;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * The total number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value that is specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Organizations might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListCreateAccountStatusResponse {
    /**
     * A list of objects with details about the requests. Certain elements, such as the accountId number, are present in the output only after the account has been successfully created.
     */
    CreateAccountStatuses?: CreateAccountStatuses;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListDelegatedAdministratorsRequest {
    /**
     * Specifies a service principal name. If specified, then the operation lists the delegated administrators only for the specified service. If you don't specify a service principal, the operation lists all delegated administrators for all services in your organization.
     */
    ServicePrincipal?: ServicePrincipal;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * The total number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value that is specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Organizations might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListDelegatedAdministratorsResponse {
    /**
     * The list of delegated administrators in your organization.
     */
    DelegatedAdministrators?: DelegatedAdministrators;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListDelegatedServicesForAccountRequest {
    /**
     * The account ID number of a delegated administrator account in the organization.
     */
    AccountId: AccountId;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * The total number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value that is specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Organizations might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListDelegatedServicesForAccountResponse {
    /**
     * The services for which the account is a delegated administrator.
     */
    DelegatedServices?: DelegatedServices;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListHandshakesForAccountRequest {
    /**
     * Filters the handshakes that you want included in the response. The default is all types. Use the ActionType element to limit the output to only a specified type, such as INVITE, ENABLE_ALL_FEATURES, or APPROVE_ALL_FEATURES. Alternatively, for the ENABLE_ALL_FEATURES handshake that generates a separate child handshake for each member account, you can specify ParentHandshakeId to see only the handshakes that were generated by that parent request.
     */
    Filter?: HandshakeFilter;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * The total number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value that is specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Organizations might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListHandshakesForAccountResponse {
    /**
     * A list of Handshake objects with details about each of the handshakes that is associated with the specified account.
     */
    Handshakes?: Handshakes;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListHandshakesForOrganizationRequest {
    /**
     * A filter of the handshakes that you want included in the response. The default is all types. Use the ActionType element to limit the output to only a specified type, such as INVITE, ENABLE-ALL-FEATURES, or APPROVE-ALL-FEATURES. Alternatively, for the ENABLE-ALL-FEATURES handshake that generates a separate child handshake for each member account, you can specify the ParentHandshakeId to see only the handshakes that were generated by that parent request.
     */
    Filter?: HandshakeFilter;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * The total number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value that is specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Organizations might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListHandshakesForOrganizationResponse {
    /**
     * A list of Handshake objects with details about each of the handshakes that are associated with an organization.
     */
    Handshakes?: Handshakes;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListOrganizationalUnitsForParentRequest {
    /**
     * The unique identifier (ID) of the root or OU whose child OUs you want to list. The regex pattern for a parent ID string requires one of the following:    Root - A string that begins with "r-" followed by from 4 to 32 lowercase letters or digits.    Organizational unit (OU) - A string that begins with "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that the OU is in). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.  
     */
    ParentId: ParentId;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * The total number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value that is specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Organizations might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListOrganizationalUnitsForParentResponse {
    /**
     * A list of the OUs in the specified root or parent OU.
     */
    OrganizationalUnits?: OrganizationalUnits;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListParentsRequest {
    /**
     * The unique identifier (ID) of the OU or account whose parent containers you want to list. Don't specify a root. The regex pattern for a child ID string requires one of the following:    Account - A string that consists of exactly 12 digits.    Organizational unit (OU) - A string that begins with "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that contains the OU). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.  
     */
    ChildId: ChildId;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * The total number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value that is specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Organizations might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListParentsResponse {
    /**
     * A list of parents for the specified child account or OU.
     */
    Parents?: Parents;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListPoliciesForTargetRequest {
    /**
     * The unique identifier (ID) of the root, organizational unit, or account whose policies you want to list. The regex pattern for a target ID string requires one of the following:    Root - A string that begins with "r-" followed by from 4 to 32 lowercase letters or digits.    Account - A string that consists of exactly 12 digits.    Organizational unit (OU) - A string that begins with "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that the OU is in). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.  
     */
    TargetId: PolicyTargetId;
    /**
     * The type of policy that you want to include in the returned list. You must specify one of the following values:    AISERVICES_OPT_OUT_POLICY     BACKUP_POLICY     SERVICE_CONTROL_POLICY     TAG_POLICY   
     */
    Filter: PolicyType;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * The total number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value that is specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Organizations might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListPoliciesForTargetResponse {
    /**
     * The list of policies that match the criteria in the request.
     */
    Policies?: Policies;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListPoliciesRequest {
    /**
     * Specifies the type of policy that you want to include in the response. You must specify one of the following values:    AISERVICES_OPT_OUT_POLICY     BACKUP_POLICY     SERVICE_CONTROL_POLICY     TAG_POLICY   
     */
    Filter: PolicyType;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * The total number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value that is specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Organizations might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListPoliciesResponse {
    /**
     * A list of policies that match the filter criteria in the request. The output list doesn't include the policy contents. To see the content for a policy, see DescribePolicy.
     */
    Policies?: Policies;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListRootsRequest {
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * The total number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value that is specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Organizations might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListRootsResponse {
    /**
     * A list of roots that are defined in an organization.
     */
    Roots?: Roots;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ID of the resource with the tags to list. You can specify any of the following taggable resources.   Amazon Web Services account – specify the account ID number.   Organizational unit – specify the OU ID that begins with ou- and looks similar to: ou-1a2b-34uvwxyz     Root – specify the root ID that begins with r- and looks similar to: r-1a2b     Policy – specify the policy ID that begins with p- andlooks similar to: p-12abcdefg3    
     */
    ResourceId: TaggableResourceId;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags that are assigned to the resource.
     */
    Tags?: Tags;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListTargetsForPolicyRequest {
    /**
     * The unique identifier (ID) of the policy whose attachments you want to know. The regex pattern for a policy ID string requires "p-" followed by from 8 to 128 lowercase or uppercase letters, digits, or the underscore character (_).
     */
    PolicyId: PolicyId;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * The total number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value that is specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Organizations might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListTargetsForPolicyResponse {
    /**
     * A list of structures, each of which contains details about one of the entities to which the specified policy is attached.
     */
    Targets?: PolicyTargets;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export type MaxResults = number;
  export interface MoveAccountRequest {
    /**
     * The unique identifier (ID) of the account that you want to move. The regex pattern for an account ID string requires exactly 12 digits.
     */
    AccountId: AccountId;
    /**
     * The unique identifier (ID) of the root or organizational unit that you want to move the account from. The regex pattern for a parent ID string requires one of the following:    Root - A string that begins with "r-" followed by from 4 to 32 lowercase letters or digits.    Organizational unit (OU) - A string that begins with "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that the OU is in). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.  
     */
    SourceParentId: ParentId;
    /**
     * The unique identifier (ID) of the root or organizational unit that you want to move the account to. The regex pattern for a parent ID string requires one of the following:    Root - A string that begins with "r-" followed by from 4 to 32 lowercase letters or digits.    Organizational unit (OU) - A string that begins with "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that the OU is in). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.  
     */
    DestinationParentId: ParentId;
  }
  export type NextToken = string;
  export interface Organization {
    /**
     * The unique identifier (ID) of an organization. The regex pattern for an organization ID string requires "o-" followed by from 10 to 32 lowercase letters or digits.
     */
    Id?: OrganizationId;
    /**
     * The Amazon Resource Name (ARN) of an organization. For more information about ARNs in Organizations, see ARN Formats Supported by Organizations in the Amazon Web Services Service Authorization Reference.
     */
    Arn?: OrganizationArn;
    /**
     * Specifies the functionality that currently is available to the organization. If set to "ALL", then all features are enabled and policies can be applied to accounts in the organization. If set to "CONSOLIDATED_BILLING", then only consolidated billing functionality is available. For more information, see Enabling all features in your organization in the Organizations User Guide.
     */
    FeatureSet?: OrganizationFeatureSet;
    /**
     * The Amazon Resource Name (ARN) of the account that is designated as the management account for the organization. For more information about ARNs in Organizations, see ARN Formats Supported by Organizations in the Amazon Web Services Service Authorization Reference.
     */
    MasterAccountArn?: AccountArn;
    /**
     * The unique identifier (ID) of the management account of an organization. The regex pattern for an account ID string requires exactly 12 digits.
     */
    MasterAccountId?: AccountId;
    /**
     * The email address that is associated with the Amazon Web Services account that is designated as the management account for the organization.
     */
    MasterAccountEmail?: Email;
    /**
     *  Do not use. This field is deprecated and doesn't provide complete information about the policies in your organization.  To determine the policies that are enabled and available for use in your organization, use the ListRoots operation instead.
     */
    AvailablePolicyTypes?: PolicyTypes;
  }
  export type OrganizationArn = string;
  export type OrganizationFeatureSet = "ALL"|"CONSOLIDATED_BILLING"|string;
  export type OrganizationId = string;
  export interface OrganizationalUnit {
    /**
     * The unique identifier (ID) associated with this OU. The regex pattern for an organizational unit ID string requires "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that contains the OU). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.
     */
    Id?: OrganizationalUnitId;
    /**
     * The Amazon Resource Name (ARN) of this OU. For more information about ARNs in Organizations, see ARN Formats Supported by Organizations in the Amazon Web Services Service Authorization Reference.
     */
    Arn?: OrganizationalUnitArn;
    /**
     * The friendly name of this OU. The regex pattern that is used to validate this parameter is a string of any of the characters in the ASCII character range.
     */
    Name?: OrganizationalUnitName;
  }
  export type OrganizationalUnitArn = string;
  export type OrganizationalUnitId = string;
  export type OrganizationalUnitName = string;
  export type OrganizationalUnits = OrganizationalUnit[];
  export interface Parent {
    /**
     * The unique identifier (ID) of the parent entity. The regex pattern for a parent ID string requires one of the following:    Root - A string that begins with "r-" followed by from 4 to 32 lowercase letters or digits.    Organizational unit (OU) - A string that begins with "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that the OU is in). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.  
     */
    Id?: ParentId;
    /**
     * The type of the parent entity.
     */
    Type?: ParentType;
  }
  export type ParentId = string;
  export type ParentType = "ROOT"|"ORGANIZATIONAL_UNIT"|string;
  export type Parents = Parent[];
  export type Policies = PolicySummary[];
  export interface Policy {
    /**
     * A structure that contains additional details about the policy.
     */
    PolicySummary?: PolicySummary;
    /**
     * The text content of the policy.
     */
    Content?: PolicyContent;
  }
  export type PolicyArn = string;
  export type PolicyContent = string;
  export type PolicyDescription = string;
  export type PolicyId = string;
  export type PolicyName = string;
  export interface PolicySummary {
    /**
     * The unique identifier (ID) of the policy. The regex pattern for a policy ID string requires "p-" followed by from 8 to 128 lowercase or uppercase letters, digits, or the underscore character (_).
     */
    Id?: PolicyId;
    /**
     * The Amazon Resource Name (ARN) of the policy. For more information about ARNs in Organizations, see ARN Formats Supported by Organizations in the Amazon Web Services Service Authorization Reference.
     */
    Arn?: PolicyArn;
    /**
     * The friendly name of the policy. The regex pattern that is used to validate this parameter is a string of any of the characters in the ASCII character range.
     */
    Name?: PolicyName;
    /**
     * The description of the policy.
     */
    Description?: PolicyDescription;
    /**
     * The type of policy.
     */
    Type?: PolicyType;
    /**
     * A boolean value that indicates whether the specified policy is an Amazon Web Services managed policy. If true, then you can attach the policy to roots, OUs, or accounts, but you cannot edit it.
     */
    AwsManaged?: AwsManagedPolicy;
  }
  export type PolicyTargetId = string;
  export interface PolicyTargetSummary {
    /**
     * The unique identifier (ID) of the policy target. The regex pattern for a target ID string requires one of the following:    Root - A string that begins with "r-" followed by from 4 to 32 lowercase letters or digits.    Account - A string that consists of exactly 12 digits.    Organizational unit (OU) - A string that begins with "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that the OU is in). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.  
     */
    TargetId?: PolicyTargetId;
    /**
     * The Amazon Resource Name (ARN) of the policy target. For more information about ARNs in Organizations, see ARN Formats Supported by Organizations in the Amazon Web Services Service Authorization Reference.
     */
    Arn?: GenericArn;
    /**
     * The friendly name of the policy target. The regex pattern that is used to validate this parameter is a string of any of the characters in the ASCII character range.
     */
    Name?: TargetName;
    /**
     * The type of the policy target.
     */
    Type?: TargetType;
  }
  export type PolicyTargets = PolicyTargetSummary[];
  export type PolicyType = "SERVICE_CONTROL_POLICY"|"TAG_POLICY"|"BACKUP_POLICY"|"AISERVICES_OPT_OUT_POLICY"|string;
  export type PolicyTypeStatus = "ENABLED"|"PENDING_ENABLE"|"PENDING_DISABLE"|string;
  export interface PolicyTypeSummary {
    /**
     * The name of the policy type.
     */
    Type?: PolicyType;
    /**
     * The status of the policy type as it relates to the associated root. To attach a policy of the specified type to a root or to an OU or account in that root, it must be available in the organization and enabled for that root.
     */
    Status?: PolicyTypeStatus;
  }
  export type PolicyTypes = PolicyTypeSummary[];
  export interface PutResourcePolicyRequest {
    /**
     * If provided, the new content for the resource policy. The text must be correctly formatted JSON that complies with the syntax for the resource policy's type. For more information, see SCP syntax in the Organizations User Guide.
     */
    Content: ResourcePolicyContent;
    /**
     * A list of tags that you want to attach to the newly created resource policy. For each tag in the list, you must specify both a tag key and a value. You can set the value to an empty string, but you can't set it to null. For more information about tagging, see Tagging Organizations resources in the Organizations User Guide.  Calls with tags apply to the initial creation of the resource policy, otherwise an exception is thrown. If any one of the tags is not valid or if you exceed the allowed number of tags for the resource policy, then the entire request fails and the resource policy is not created.  
     */
    Tags?: Tags;
  }
  export interface PutResourcePolicyResponse {
    /**
     * A structure that contains details about the resource policy.
     */
    ResourcePolicy?: ResourcePolicy;
  }
  export interface RegisterDelegatedAdministratorRequest {
    /**
     * The account ID number of the member account in the organization to register as a delegated administrator.
     */
    AccountId: AccountId;
    /**
     * The service principal of the Amazon Web Services service for which you want to make the member account a delegated administrator.
     */
    ServicePrincipal: ServicePrincipal;
  }
  export interface RemoveAccountFromOrganizationRequest {
    /**
     * The unique identifier (ID) of the member account that you want to remove from the organization. The regex pattern for an account ID string requires exactly 12 digits.
     */
    AccountId: AccountId;
  }
  export interface ResourcePolicy {
    /**
     * A structure that contains resource policy ID and Amazon Resource Name (ARN).
     */
    ResourcePolicySummary?: ResourcePolicySummary;
    /**
     * The policy text of the resource policy.
     */
    Content?: ResourcePolicyContent;
  }
  export type ResourcePolicyArn = string;
  export type ResourcePolicyContent = string;
  export type ResourcePolicyId = string;
  export interface ResourcePolicySummary {
    /**
     * The unique identifier (ID) of the resource policy.
     */
    Id?: ResourcePolicyId;
    /**
     * The Amazon Resource Name (ARN) of the resource policy.
     */
    Arn?: ResourcePolicyArn;
  }
  export type RoleName = string;
  export interface Root {
    /**
     * The unique identifier (ID) for the root. The regex pattern for a root ID string requires "r-" followed by from 4 to 32 lowercase letters or digits.
     */
    Id?: RootId;
    /**
     * The Amazon Resource Name (ARN) of the root. For more information about ARNs in Organizations, see ARN Formats Supported by Organizations in the Amazon Web Services Service Authorization Reference.
     */
    Arn?: RootArn;
    /**
     * The friendly name of the root. The regex pattern that is used to validate this parameter is a string of any of the characters in the ASCII character range.
     */
    Name?: RootName;
    /**
     * The types of policies that are currently enabled for the root and therefore can be attached to the root or to its OUs or accounts.  Even if a policy type is shown as available in the organization, you can separately enable and disable them at the root level by using EnablePolicyType and DisablePolicyType. Use DescribeOrganization to see the availability of the policy types in that organization. 
     */
    PolicyTypes?: PolicyTypes;
  }
  export type RootArn = string;
  export type RootId = string;
  export type RootName = string;
  export type Roots = Root[];
  export type ServicePrincipal = string;
  export interface Tag {
    /**
     * The key identifier, or name, of the tag.
     */
    Key: TagKey;
    /**
     * The string value that's associated with the key of the tag. You can set the value of a tag to an empty string, but you can't set the value of a tag to null.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export interface TagResourceRequest {
    /**
     * The ID of the resource to add a tag to. You can specify any of the following taggable resources.   Amazon Web Services account – specify the account ID number.   Organizational unit – specify the OU ID that begins with ou- and looks similar to: ou-1a2b-34uvwxyz     Root – specify the root ID that begins with r- and looks similar to: r-1a2b     Policy – specify the policy ID that begins with p- andlooks similar to: p-12abcdefg3    
     */
    ResourceId: TaggableResourceId;
    /**
     * A list of tags to add to the specified resource. For each tag in the list, you must specify both a tag key and a value. The value can be an empty string, but you can't set it to null.  If any one of the tags is not valid or if you exceed the maximum allowed number of tags for a resource, then the entire request fails. 
     */
    Tags: Tags;
  }
  export type TagValue = string;
  export type TaggableResourceId = string;
  export type Tags = Tag[];
  export type TargetName = string;
  export type TargetType = "ACCOUNT"|"ORGANIZATIONAL_UNIT"|"ROOT"|string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The ID of the resource to remove a tag from. You can specify any of the following taggable resources.   Amazon Web Services account – specify the account ID number.   Organizational unit – specify the OU ID that begins with ou- and looks similar to: ou-1a2b-34uvwxyz     Root – specify the root ID that begins with r- and looks similar to: r-1a2b     Policy – specify the policy ID that begins with p- andlooks similar to: p-12abcdefg3    
     */
    ResourceId: TaggableResourceId;
    /**
     * The list of keys for tags to remove from the specified resource.
     */
    TagKeys: TagKeys;
  }
  export interface UpdateOrganizationalUnitRequest {
    /**
     * The unique identifier (ID) of the OU that you want to rename. You can get the ID from the ListOrganizationalUnitsForParent operation. The regex pattern for an organizational unit ID string requires "ou-" followed by from 4 to 32 lowercase letters or digits (the ID of the root that contains the OU). This string is followed by a second "-" dash and from 8 to 32 additional lowercase letters or digits.
     */
    OrganizationalUnitId: OrganizationalUnitId;
    /**
     * The new name that you want to assign to the OU. The regex pattern that is used to validate this parameter is a string of any of the characters in the ASCII character range.
     */
    Name?: OrganizationalUnitName;
  }
  export interface UpdateOrganizationalUnitResponse {
    /**
     * A structure that contains the details about the specified OU, including its new name.
     */
    OrganizationalUnit?: OrganizationalUnit;
  }
  export interface UpdatePolicyRequest {
    /**
     * The unique identifier (ID) of the policy that you want to update. The regex pattern for a policy ID string requires "p-" followed by from 8 to 128 lowercase or uppercase letters, digits, or the underscore character (_).
     */
    PolicyId: PolicyId;
    /**
     * If provided, the new name for the policy. The regex pattern that is used to validate this parameter is a string of any of the characters in the ASCII character range.
     */
    Name?: PolicyName;
    /**
     * If provided, the new description for the policy.
     */
    Description?: PolicyDescription;
    /**
     * If provided, the new content for the policy. The text must be correctly formatted JSON that complies with the syntax for the policy's type. For more information, see SCP syntax in the Organizations User Guide.
     */
    Content?: PolicyContent;
  }
  export interface UpdatePolicyResponse {
    /**
     * A structure that contains details about the updated policy, showing the requested changes.
     */
    Policy?: Policy;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-11-28"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Organizations client.
   */
  export import Types = Organizations;
}
export = Organizations;
