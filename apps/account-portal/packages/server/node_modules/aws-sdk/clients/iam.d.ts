import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IAM extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IAM.Types.ClientConfiguration)
  config: Config & IAM.Types.ClientConfiguration;
  /**
   * Adds a new client ID (also known as audience) to the list of client IDs already registered for the specified IAM OpenID Connect (OIDC) provider resource. This operation is idempotent; it does not fail or return an error if you add an existing client ID to the provider.
   */
  addClientIDToOpenIDConnectProvider(params: IAM.Types.AddClientIDToOpenIDConnectProviderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds a new client ID (also known as audience) to the list of client IDs already registered for the specified IAM OpenID Connect (OIDC) provider resource. This operation is idempotent; it does not fail or return an error if you add an existing client ID to the provider.
   */
  addClientIDToOpenIDConnectProvider(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds the specified IAM role to the specified instance profile. An instance profile can contain only one role, and this quota cannot be increased. You can remove the existing role and then add a different role to an instance profile. You must then wait for the change to appear across all of Amazon Web Services because of eventual consistency. To force the change, you must disassociate the instance profile and then associate the instance profile, or you can stop your instance and then restart it.  The caller of this operation must be granted the PassRole permission on the IAM role by a permissions policy.   For more information about roles, see IAM roles in the IAM User Guide. For more information about instance profiles, see Using instance profiles in the IAM User Guide.
   */
  addRoleToInstanceProfile(params: IAM.Types.AddRoleToInstanceProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds the specified IAM role to the specified instance profile. An instance profile can contain only one role, and this quota cannot be increased. You can remove the existing role and then add a different role to an instance profile. You must then wait for the change to appear across all of Amazon Web Services because of eventual consistency. To force the change, you must disassociate the instance profile and then associate the instance profile, or you can stop your instance and then restart it.  The caller of this operation must be granted the PassRole permission on the IAM role by a permissions policy.   For more information about roles, see IAM roles in the IAM User Guide. For more information about instance profiles, see Using instance profiles in the IAM User Guide.
   */
  addRoleToInstanceProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds the specified user to the specified group.
   */
  addUserToGroup(params: IAM.Types.AddUserToGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds the specified user to the specified group.
   */
  addUserToGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches the specified managed policy to the specified IAM group. You use this operation to attach a managed policy to a group. To embed an inline policy in a group, use  PutGroupPolicy . As a best practice, you can validate your IAM policies. To learn more, see Validating IAM policies in the IAM User Guide. For more information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  attachGroupPolicy(params: IAM.Types.AttachGroupPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches the specified managed policy to the specified IAM group. You use this operation to attach a managed policy to a group. To embed an inline policy in a group, use  PutGroupPolicy . As a best practice, you can validate your IAM policies. To learn more, see Validating IAM policies in the IAM User Guide. For more information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  attachGroupPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches the specified managed policy to the specified IAM role. When you attach a managed policy to a role, the managed policy becomes part of the role's permission (access) policy.  You cannot use a managed policy as the role's trust policy. The role's trust policy is created at the same time as the role, using  CreateRole . You can update a role's trust policy using  UpdateAssumerolePolicy .  Use this operation to attach a managed policy to a role. To embed an inline policy in a role, use  PutRolePolicy . For more information about policies, see Managed policies and inline policies in the IAM User Guide. As a best practice, you can validate your IAM policies. To learn more, see Validating IAM policies in the IAM User Guide.
   */
  attachRolePolicy(params: IAM.Types.AttachRolePolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches the specified managed policy to the specified IAM role. When you attach a managed policy to a role, the managed policy becomes part of the role's permission (access) policy.  You cannot use a managed policy as the role's trust policy. The role's trust policy is created at the same time as the role, using  CreateRole . You can update a role's trust policy using  UpdateAssumerolePolicy .  Use this operation to attach a managed policy to a role. To embed an inline policy in a role, use  PutRolePolicy . For more information about policies, see Managed policies and inline policies in the IAM User Guide. As a best practice, you can validate your IAM policies. To learn more, see Validating IAM policies in the IAM User Guide.
   */
  attachRolePolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches the specified managed policy to the specified user. You use this operation to attach a managed policy to a user. To embed an inline policy in a user, use  PutUserPolicy . As a best practice, you can validate your IAM policies. To learn more, see Validating IAM policies in the IAM User Guide. For more information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  attachUserPolicy(params: IAM.Types.AttachUserPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches the specified managed policy to the specified user. You use this operation to attach a managed policy to a user. To embed an inline policy in a user, use  PutUserPolicy . As a best practice, you can validate your IAM policies. To learn more, see Validating IAM policies in the IAM User Guide. For more information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  attachUserPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the password of the IAM user who is calling this operation. This operation can be performed using the CLI, the Amazon Web Services API, or the My Security Credentials page in the Amazon Web Services Management Console. The Amazon Web Services account root user password is not affected by this operation. Use UpdateLoginProfile to use the CLI, the Amazon Web Services API, or the Users page in the IAM console to change the password for any IAM user. For more information about modifying passwords, see Managing passwords in the IAM User Guide.
   */
  changePassword(params: IAM.Types.ChangePasswordRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the password of the IAM user who is calling this operation. This operation can be performed using the CLI, the Amazon Web Services API, or the My Security Credentials page in the Amazon Web Services Management Console. The Amazon Web Services account root user password is not affected by this operation. Use UpdateLoginProfile to use the CLI, the Amazon Web Services API, or the Users page in the IAM console to change the password for any IAM user. For more information about modifying passwords, see Managing passwords in the IAM User Guide.
   */
  changePassword(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Creates a new Amazon Web Services secret access key and corresponding Amazon Web Services access key ID for the specified user. The default status for new keys is Active. If you do not specify a user name, IAM determines the user name implicitly based on the Amazon Web Services access key ID signing the request. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials. This is true even if the Amazon Web Services account has no associated users.  For information about quotas on the number of keys you can create, see IAM and STS quotas in the IAM User Guide.  To ensure the security of your Amazon Web Services account, the secret access key is accessible only during key and user creation. You must save the key (for example, in a text file) if you want to be able to access it again. If a secret key is lost, you can delete the access keys for the associated user and then create new keys. 
   */
  createAccessKey(params: IAM.Types.CreateAccessKeyRequest, callback?: (err: AWSError, data: IAM.Types.CreateAccessKeyResponse) => void): Request<IAM.Types.CreateAccessKeyResponse, AWSError>;
  /**
   *  Creates a new Amazon Web Services secret access key and corresponding Amazon Web Services access key ID for the specified user. The default status for new keys is Active. If you do not specify a user name, IAM determines the user name implicitly based on the Amazon Web Services access key ID signing the request. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials. This is true even if the Amazon Web Services account has no associated users.  For information about quotas on the number of keys you can create, see IAM and STS quotas in the IAM User Guide.  To ensure the security of your Amazon Web Services account, the secret access key is accessible only during key and user creation. You must save the key (for example, in a text file) if you want to be able to access it again. If a secret key is lost, you can delete the access keys for the associated user and then create new keys. 
   */
  createAccessKey(callback?: (err: AWSError, data: IAM.Types.CreateAccessKeyResponse) => void): Request<IAM.Types.CreateAccessKeyResponse, AWSError>;
  /**
   * Creates an alias for your Amazon Web Services account. For information about using an Amazon Web Services account alias, see Creating, deleting, and listing an Amazon Web Services account alias in the Amazon Web Services Sign-In User Guide.
   */
  createAccountAlias(params: IAM.Types.CreateAccountAliasRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates an alias for your Amazon Web Services account. For information about using an Amazon Web Services account alias, see Creating, deleting, and listing an Amazon Web Services account alias in the Amazon Web Services Sign-In User Guide.
   */
  createAccountAlias(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a new group.  For information about the number of groups you can create, see IAM and STS quotas in the IAM User Guide.
   */
  createGroup(params: IAM.Types.CreateGroupRequest, callback?: (err: AWSError, data: IAM.Types.CreateGroupResponse) => void): Request<IAM.Types.CreateGroupResponse, AWSError>;
  /**
   * Creates a new group.  For information about the number of groups you can create, see IAM and STS quotas in the IAM User Guide.
   */
  createGroup(callback?: (err: AWSError, data: IAM.Types.CreateGroupResponse) => void): Request<IAM.Types.CreateGroupResponse, AWSError>;
  /**
   *  Creates a new instance profile. For information about instance profiles, see Using roles for applications on Amazon EC2 in the IAM User Guide, and Instance profiles in the Amazon EC2 User Guide.  For information about the number of instance profiles you can create, see IAM object quotas in the IAM User Guide.
   */
  createInstanceProfile(params: IAM.Types.CreateInstanceProfileRequest, callback?: (err: AWSError, data: IAM.Types.CreateInstanceProfileResponse) => void): Request<IAM.Types.CreateInstanceProfileResponse, AWSError>;
  /**
   *  Creates a new instance profile. For information about instance profiles, see Using roles for applications on Amazon EC2 in the IAM User Guide, and Instance profiles in the Amazon EC2 User Guide.  For information about the number of instance profiles you can create, see IAM object quotas in the IAM User Guide.
   */
  createInstanceProfile(callback?: (err: AWSError, data: IAM.Types.CreateInstanceProfileResponse) => void): Request<IAM.Types.CreateInstanceProfileResponse, AWSError>;
  /**
   * Creates a password for the specified IAM user. A password allows an IAM user to access Amazon Web Services services through the Amazon Web Services Management Console. You can use the CLI, the Amazon Web Services API, or the Users page in the IAM console to create a password for any IAM user. Use ChangePassword to update your own existing password in the My Security Credentials page in the Amazon Web Services Management Console. For more information about managing passwords, see Managing passwords in the IAM User Guide.
   */
  createLoginProfile(params: IAM.Types.CreateLoginProfileRequest, callback?: (err: AWSError, data: IAM.Types.CreateLoginProfileResponse) => void): Request<IAM.Types.CreateLoginProfileResponse, AWSError>;
  /**
   * Creates a password for the specified IAM user. A password allows an IAM user to access Amazon Web Services services through the Amazon Web Services Management Console. You can use the CLI, the Amazon Web Services API, or the Users page in the IAM console to create a password for any IAM user. Use ChangePassword to update your own existing password in the My Security Credentials page in the Amazon Web Services Management Console. For more information about managing passwords, see Managing passwords in the IAM User Guide.
   */
  createLoginProfile(callback?: (err: AWSError, data: IAM.Types.CreateLoginProfileResponse) => void): Request<IAM.Types.CreateLoginProfileResponse, AWSError>;
  /**
   * Creates an IAM entity to describe an identity provider (IdP) that supports OpenID Connect (OIDC). The OIDC provider that you create with this operation can be used as a principal in a role's trust policy. Such a policy establishes a trust relationship between Amazon Web Services and the OIDC provider. If you are using an OIDC identity provider from Google, Facebook, or Amazon Cognito, you don't need to create a separate IAM identity provider. These OIDC identity providers are already built-in to Amazon Web Services and are available for your use. Instead, you can move directly to creating new roles using your identity provider. To learn more, see Creating a role for web identity or OpenID connect federation in the IAM User Guide. When you create the IAM OIDC provider, you specify the following:   The URL of the OIDC identity provider (IdP) to trust   A list of client IDs (also known as audiences) that identify the application or applications allowed to authenticate using the OIDC provider   A list of tags that are attached to the specified IAM OIDC provider   A list of thumbprints of one or more server certificates that the IdP uses   You get all of this information from the OIDC IdP you want to use to access Amazon Web Services.  Amazon Web Services secures communication with some OIDC identity providers (IdPs) through our library of trusted root certificate authorities (CAs) instead of using a certificate thumbprint to verify your IdP server certificate. These OIDC IdPs include Auth0, GitHub, Google, and those that use an Amazon S3 bucket to host a JSON Web Key Set (JWKS) endpoint. In these cases, your legacy thumbprint remains in your configuration, but is no longer used for validation.   The trust for the OIDC provider is derived from the IAM provider that this operation creates. Therefore, it is best to limit access to the CreateOpenIDConnectProvider operation to highly privileged users. 
   */
  createOpenIDConnectProvider(params: IAM.Types.CreateOpenIDConnectProviderRequest, callback?: (err: AWSError, data: IAM.Types.CreateOpenIDConnectProviderResponse) => void): Request<IAM.Types.CreateOpenIDConnectProviderResponse, AWSError>;
  /**
   * Creates an IAM entity to describe an identity provider (IdP) that supports OpenID Connect (OIDC). The OIDC provider that you create with this operation can be used as a principal in a role's trust policy. Such a policy establishes a trust relationship between Amazon Web Services and the OIDC provider. If you are using an OIDC identity provider from Google, Facebook, or Amazon Cognito, you don't need to create a separate IAM identity provider. These OIDC identity providers are already built-in to Amazon Web Services and are available for your use. Instead, you can move directly to creating new roles using your identity provider. To learn more, see Creating a role for web identity or OpenID connect federation in the IAM User Guide. When you create the IAM OIDC provider, you specify the following:   The URL of the OIDC identity provider (IdP) to trust   A list of client IDs (also known as audiences) that identify the application or applications allowed to authenticate using the OIDC provider   A list of tags that are attached to the specified IAM OIDC provider   A list of thumbprints of one or more server certificates that the IdP uses   You get all of this information from the OIDC IdP you want to use to access Amazon Web Services.  Amazon Web Services secures communication with some OIDC identity providers (IdPs) through our library of trusted root certificate authorities (CAs) instead of using a certificate thumbprint to verify your IdP server certificate. These OIDC IdPs include Auth0, GitHub, Google, and those that use an Amazon S3 bucket to host a JSON Web Key Set (JWKS) endpoint. In these cases, your legacy thumbprint remains in your configuration, but is no longer used for validation.   The trust for the OIDC provider is derived from the IAM provider that this operation creates. Therefore, it is best to limit access to the CreateOpenIDConnectProvider operation to highly privileged users. 
   */
  createOpenIDConnectProvider(callback?: (err: AWSError, data: IAM.Types.CreateOpenIDConnectProviderResponse) => void): Request<IAM.Types.CreateOpenIDConnectProviderResponse, AWSError>;
  /**
   * Creates a new managed policy for your Amazon Web Services account. This operation creates a policy version with a version identifier of v1 and sets v1 as the policy's default version. For more information about policy versions, see Versioning for managed policies in the IAM User Guide. As a best practice, you can validate your IAM policies. To learn more, see Validating IAM policies in the IAM User Guide. For more information about managed policies in general, see Managed policies and inline policies in the IAM User Guide.
   */
  createPolicy(params: IAM.Types.CreatePolicyRequest, callback?: (err: AWSError, data: IAM.Types.CreatePolicyResponse) => void): Request<IAM.Types.CreatePolicyResponse, AWSError>;
  /**
   * Creates a new managed policy for your Amazon Web Services account. This operation creates a policy version with a version identifier of v1 and sets v1 as the policy's default version. For more information about policy versions, see Versioning for managed policies in the IAM User Guide. As a best practice, you can validate your IAM policies. To learn more, see Validating IAM policies in the IAM User Guide. For more information about managed policies in general, see Managed policies and inline policies in the IAM User Guide.
   */
  createPolicy(callback?: (err: AWSError, data: IAM.Types.CreatePolicyResponse) => void): Request<IAM.Types.CreatePolicyResponse, AWSError>;
  /**
   * Creates a new version of the specified managed policy. To update a managed policy, you create a new policy version. A managed policy can have up to five versions. If the policy has five versions, you must delete an existing version using DeletePolicyVersion before you create a new version. Optionally, you can set the new version as the policy's default version. The default version is the version that is in effect for the IAM users, groups, and roles to which the policy is attached. For more information about managed policy versions, see Versioning for managed policies in the IAM User Guide.
   */
  createPolicyVersion(params: IAM.Types.CreatePolicyVersionRequest, callback?: (err: AWSError, data: IAM.Types.CreatePolicyVersionResponse) => void): Request<IAM.Types.CreatePolicyVersionResponse, AWSError>;
  /**
   * Creates a new version of the specified managed policy. To update a managed policy, you create a new policy version. A managed policy can have up to five versions. If the policy has five versions, you must delete an existing version using DeletePolicyVersion before you create a new version. Optionally, you can set the new version as the policy's default version. The default version is the version that is in effect for the IAM users, groups, and roles to which the policy is attached. For more information about managed policy versions, see Versioning for managed policies in the IAM User Guide.
   */
  createPolicyVersion(callback?: (err: AWSError, data: IAM.Types.CreatePolicyVersionResponse) => void): Request<IAM.Types.CreatePolicyVersionResponse, AWSError>;
  /**
   * Creates a new role for your Amazon Web Services account.  For more information about roles, see IAM roles in the IAM User Guide. For information about quotas for role names and the number of roles you can create, see IAM and STS quotas in the IAM User Guide.
   */
  createRole(params: IAM.Types.CreateRoleRequest, callback?: (err: AWSError, data: IAM.Types.CreateRoleResponse) => void): Request<IAM.Types.CreateRoleResponse, AWSError>;
  /**
   * Creates a new role for your Amazon Web Services account.  For more information about roles, see IAM roles in the IAM User Guide. For information about quotas for role names and the number of roles you can create, see IAM and STS quotas in the IAM User Guide.
   */
  createRole(callback?: (err: AWSError, data: IAM.Types.CreateRoleResponse) => void): Request<IAM.Types.CreateRoleResponse, AWSError>;
  /**
   * Creates an IAM resource that describes an identity provider (IdP) that supports SAML 2.0. The SAML provider resource that you create with this operation can be used as a principal in an IAM role's trust policy. Such a policy can enable federated users who sign in using the SAML IdP to assume the role. You can create an IAM role that supports Web-based single sign-on (SSO) to the Amazon Web Services Management Console or one that supports API access to Amazon Web Services. When you create the SAML provider resource, you upload a SAML metadata document that you get from your IdP. That document includes the issuer's name, expiration information, and keys that can be used to validate the SAML authentication response (assertions) that the IdP sends. You must generate the metadata document using the identity management software that is used as your organization's IdP.   This operation requires Signature Version 4.   For more information, see Enabling SAML 2.0 federated users to access the Amazon Web Services Management Console and About SAML 2.0-based federation in the IAM User Guide.
   */
  createSAMLProvider(params: IAM.Types.CreateSAMLProviderRequest, callback?: (err: AWSError, data: IAM.Types.CreateSAMLProviderResponse) => void): Request<IAM.Types.CreateSAMLProviderResponse, AWSError>;
  /**
   * Creates an IAM resource that describes an identity provider (IdP) that supports SAML 2.0. The SAML provider resource that you create with this operation can be used as a principal in an IAM role's trust policy. Such a policy can enable federated users who sign in using the SAML IdP to assume the role. You can create an IAM role that supports Web-based single sign-on (SSO) to the Amazon Web Services Management Console or one that supports API access to Amazon Web Services. When you create the SAML provider resource, you upload a SAML metadata document that you get from your IdP. That document includes the issuer's name, expiration information, and keys that can be used to validate the SAML authentication response (assertions) that the IdP sends. You must generate the metadata document using the identity management software that is used as your organization's IdP.   This operation requires Signature Version 4.   For more information, see Enabling SAML 2.0 federated users to access the Amazon Web Services Management Console and About SAML 2.0-based federation in the IAM User Guide.
   */
  createSAMLProvider(callback?: (err: AWSError, data: IAM.Types.CreateSAMLProviderResponse) => void): Request<IAM.Types.CreateSAMLProviderResponse, AWSError>;
  /**
   * Creates an IAM role that is linked to a specific Amazon Web Services service. The service controls the attached policies and when the role can be deleted. This helps ensure that the service is not broken by an unexpectedly changed or deleted role, which could put your Amazon Web Services resources into an unknown state. Allowing the service to control the role helps improve service stability and proper cleanup when a service and its role are no longer needed. For more information, see Using service-linked roles in the IAM User Guide.  To attach a policy to this service-linked role, you must make the request using the Amazon Web Services service that depends on this role.
   */
  createServiceLinkedRole(params: IAM.Types.CreateServiceLinkedRoleRequest, callback?: (err: AWSError, data: IAM.Types.CreateServiceLinkedRoleResponse) => void): Request<IAM.Types.CreateServiceLinkedRoleResponse, AWSError>;
  /**
   * Creates an IAM role that is linked to a specific Amazon Web Services service. The service controls the attached policies and when the role can be deleted. This helps ensure that the service is not broken by an unexpectedly changed or deleted role, which could put your Amazon Web Services resources into an unknown state. Allowing the service to control the role helps improve service stability and proper cleanup when a service and its role are no longer needed. For more information, see Using service-linked roles in the IAM User Guide.  To attach a policy to this service-linked role, you must make the request using the Amazon Web Services service that depends on this role.
   */
  createServiceLinkedRole(callback?: (err: AWSError, data: IAM.Types.CreateServiceLinkedRoleResponse) => void): Request<IAM.Types.CreateServiceLinkedRoleResponse, AWSError>;
  /**
   * Generates a set of credentials consisting of a user name and password that can be used to access the service specified in the request. These credentials are generated by IAM, and can be used only for the specified service.  You can have a maximum of two sets of service-specific credentials for each supported service per user. You can create service-specific credentials for CodeCommit and Amazon Keyspaces (for Apache Cassandra). You can reset the password to a new service-generated value by calling ResetServiceSpecificCredential. For more information about service-specific credentials, see Using IAM with CodeCommit: Git credentials, SSH keys, and Amazon Web Services access keys in the IAM User Guide.
   */
  createServiceSpecificCredential(params: IAM.Types.CreateServiceSpecificCredentialRequest, callback?: (err: AWSError, data: IAM.Types.CreateServiceSpecificCredentialResponse) => void): Request<IAM.Types.CreateServiceSpecificCredentialResponse, AWSError>;
  /**
   * Generates a set of credentials consisting of a user name and password that can be used to access the service specified in the request. These credentials are generated by IAM, and can be used only for the specified service.  You can have a maximum of two sets of service-specific credentials for each supported service per user. You can create service-specific credentials for CodeCommit and Amazon Keyspaces (for Apache Cassandra). You can reset the password to a new service-generated value by calling ResetServiceSpecificCredential. For more information about service-specific credentials, see Using IAM with CodeCommit: Git credentials, SSH keys, and Amazon Web Services access keys in the IAM User Guide.
   */
  createServiceSpecificCredential(callback?: (err: AWSError, data: IAM.Types.CreateServiceSpecificCredentialResponse) => void): Request<IAM.Types.CreateServiceSpecificCredentialResponse, AWSError>;
  /**
   * Creates a new IAM user for your Amazon Web Services account.  For information about quotas for the number of IAM users you can create, see IAM and STS quotas in the IAM User Guide.
   */
  createUser(params: IAM.Types.CreateUserRequest, callback?: (err: AWSError, data: IAM.Types.CreateUserResponse) => void): Request<IAM.Types.CreateUserResponse, AWSError>;
  /**
   * Creates a new IAM user for your Amazon Web Services account.  For information about quotas for the number of IAM users you can create, see IAM and STS quotas in the IAM User Guide.
   */
  createUser(callback?: (err: AWSError, data: IAM.Types.CreateUserResponse) => void): Request<IAM.Types.CreateUserResponse, AWSError>;
  /**
   * Creates a new virtual MFA device for the Amazon Web Services account. After creating the virtual MFA, use EnableMFADevice to attach the MFA device to an IAM user. For more information about creating and working with virtual MFA devices, see Using a virtual MFA device in the IAM User Guide. For information about the maximum number of MFA devices you can create, see IAM and STS quotas in the IAM User Guide.  The seed information contained in the QR code and the Base32 string should be treated like any other secret access information. In other words, protect the seed information as you would your Amazon Web Services access keys or your passwords. After you provision your virtual device, you should ensure that the information is destroyed following secure procedures. 
   */
  createVirtualMFADevice(params: IAM.Types.CreateVirtualMFADeviceRequest, callback?: (err: AWSError, data: IAM.Types.CreateVirtualMFADeviceResponse) => void): Request<IAM.Types.CreateVirtualMFADeviceResponse, AWSError>;
  /**
   * Creates a new virtual MFA device for the Amazon Web Services account. After creating the virtual MFA, use EnableMFADevice to attach the MFA device to an IAM user. For more information about creating and working with virtual MFA devices, see Using a virtual MFA device in the IAM User Guide. For information about the maximum number of MFA devices you can create, see IAM and STS quotas in the IAM User Guide.  The seed information contained in the QR code and the Base32 string should be treated like any other secret access information. In other words, protect the seed information as you would your Amazon Web Services access keys or your passwords. After you provision your virtual device, you should ensure that the information is destroyed following secure procedures. 
   */
  createVirtualMFADevice(callback?: (err: AWSError, data: IAM.Types.CreateVirtualMFADeviceResponse) => void): Request<IAM.Types.CreateVirtualMFADeviceResponse, AWSError>;
  /**
   * Deactivates the specified MFA device and removes it from association with the user name for which it was originally enabled. For more information about creating and working with virtual MFA devices, see Enabling a virtual multi-factor authentication (MFA) device in the IAM User Guide.
   */
  deactivateMFADevice(params: IAM.Types.DeactivateMFADeviceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deactivates the specified MFA device and removes it from association with the user name for which it was originally enabled. For more information about creating and working with virtual MFA devices, see Enabling a virtual multi-factor authentication (MFA) device in the IAM User Guide.
   */
  deactivateMFADevice(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the access key pair associated with the specified IAM user. If you do not specify a user name, IAM determines the user name implicitly based on the Amazon Web Services access key ID signing the request. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated users.
   */
  deleteAccessKey(params: IAM.Types.DeleteAccessKeyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the access key pair associated with the specified IAM user. If you do not specify a user name, IAM determines the user name implicitly based on the Amazon Web Services access key ID signing the request. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated users.
   */
  deleteAccessKey(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Deletes the specified Amazon Web Services account alias. For information about using an Amazon Web Services account alias, see Creating, deleting, and listing an Amazon Web Services account alias in the Amazon Web Services Sign-In User Guide.
   */
  deleteAccountAlias(params: IAM.Types.DeleteAccountAliasRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Deletes the specified Amazon Web Services account alias. For information about using an Amazon Web Services account alias, see Creating, deleting, and listing an Amazon Web Services account alias in the Amazon Web Services Sign-In User Guide.
   */
  deleteAccountAlias(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the password policy for the Amazon Web Services account. There are no parameters.
   */
  deleteAccountPasswordPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified IAM group. The group must not contain any users or have any attached policies.
   */
  deleteGroup(params: IAM.Types.DeleteGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified IAM group. The group must not contain any users or have any attached policies.
   */
  deleteGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified inline policy that is embedded in the specified IAM group. A group can also have managed policies attached to it. To detach a managed policy from a group, use DetachGroupPolicy. For more information about policies, refer to Managed policies and inline policies in the IAM User Guide.
   */
  deleteGroupPolicy(params: IAM.Types.DeleteGroupPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified inline policy that is embedded in the specified IAM group. A group can also have managed policies attached to it. To detach a managed policy from a group, use DetachGroupPolicy. For more information about policies, refer to Managed policies and inline policies in the IAM User Guide.
   */
  deleteGroupPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified instance profile. The instance profile must not have an associated role.  Make sure that you do not have any Amazon EC2 instances running with the instance profile you are about to delete. Deleting a role or instance profile that is associated with a running instance will break any applications running on the instance.  For more information about instance profiles, see Using instance profiles in the IAM User Guide.
   */
  deleteInstanceProfile(params: IAM.Types.DeleteInstanceProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified instance profile. The instance profile must not have an associated role.  Make sure that you do not have any Amazon EC2 instances running with the instance profile you are about to delete. Deleting a role or instance profile that is associated with a running instance will break any applications running on the instance.  For more information about instance profiles, see Using instance profiles in the IAM User Guide.
   */
  deleteInstanceProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the password for the specified IAM user, For more information, see Managing passwords for IAM users. You can use the CLI, the Amazon Web Services API, or the Users page in the IAM console to delete a password for any IAM user. You can use ChangePassword to update, but not delete, your own password in the My Security Credentials page in the Amazon Web Services Management Console.  Deleting a user's password does not prevent a user from accessing Amazon Web Services through the command line interface or the API. To prevent all user access, you must also either make any access keys inactive or delete them. For more information about making keys inactive or deleting them, see UpdateAccessKey and DeleteAccessKey. 
   */
  deleteLoginProfile(params: IAM.Types.DeleteLoginProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the password for the specified IAM user, For more information, see Managing passwords for IAM users. You can use the CLI, the Amazon Web Services API, or the Users page in the IAM console to delete a password for any IAM user. You can use ChangePassword to update, but not delete, your own password in the My Security Credentials page in the Amazon Web Services Management Console.  Deleting a user's password does not prevent a user from accessing Amazon Web Services through the command line interface or the API. To prevent all user access, you must also either make any access keys inactive or delete them. For more information about making keys inactive or deleting them, see UpdateAccessKey and DeleteAccessKey. 
   */
  deleteLoginProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an OpenID Connect identity provider (IdP) resource object in IAM. Deleting an IAM OIDC provider resource does not update any roles that reference the provider as a principal in their trust policies. Any attempt to assume a role that references a deleted provider fails. This operation is idempotent; it does not fail or return an error if you call the operation for a provider that does not exist.
   */
  deleteOpenIDConnectProvider(params: IAM.Types.DeleteOpenIDConnectProviderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an OpenID Connect identity provider (IdP) resource object in IAM. Deleting an IAM OIDC provider resource does not update any roles that reference the provider as a principal in their trust policies. Any attempt to assume a role that references a deleted provider fails. This operation is idempotent; it does not fail or return an error if you call the operation for a provider that does not exist.
   */
  deleteOpenIDConnectProvider(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified managed policy. Before you can delete a managed policy, you must first detach the policy from all users, groups, and roles that it is attached to. In addition, you must delete all the policy's versions. The following steps describe the process for deleting a managed policy:   Detach the policy from all users, groups, and roles that the policy is attached to, using DetachUserPolicy, DetachGroupPolicy, or DetachRolePolicy. To list all the users, groups, and roles that a policy is attached to, use ListEntitiesForPolicy.   Delete all versions of the policy using DeletePolicyVersion. To list the policy's versions, use ListPolicyVersions. You cannot use DeletePolicyVersion to delete the version that is marked as the default version. You delete the policy's default version in the next step of the process.   Delete the policy (this automatically deletes the policy's default version) using this operation.   For information about managed policies, see Managed policies and inline policies in the IAM User Guide.
   */
  deletePolicy(params: IAM.Types.DeletePolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified managed policy. Before you can delete a managed policy, you must first detach the policy from all users, groups, and roles that it is attached to. In addition, you must delete all the policy's versions. The following steps describe the process for deleting a managed policy:   Detach the policy from all users, groups, and roles that the policy is attached to, using DetachUserPolicy, DetachGroupPolicy, or DetachRolePolicy. To list all the users, groups, and roles that a policy is attached to, use ListEntitiesForPolicy.   Delete all versions of the policy using DeletePolicyVersion. To list the policy's versions, use ListPolicyVersions. You cannot use DeletePolicyVersion to delete the version that is marked as the default version. You delete the policy's default version in the next step of the process.   Delete the policy (this automatically deletes the policy's default version) using this operation.   For information about managed policies, see Managed policies and inline policies in the IAM User Guide.
   */
  deletePolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified version from the specified managed policy. You cannot delete the default version from a policy using this operation. To delete the default version from a policy, use DeletePolicy. To find out which version of a policy is marked as the default version, use ListPolicyVersions. For information about versions for managed policies, see Versioning for managed policies in the IAM User Guide.
   */
  deletePolicyVersion(params: IAM.Types.DeletePolicyVersionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified version from the specified managed policy. You cannot delete the default version from a policy using this operation. To delete the default version from a policy, use DeletePolicy. To find out which version of a policy is marked as the default version, use ListPolicyVersions. For information about versions for managed policies, see Versioning for managed policies in the IAM User Guide.
   */
  deletePolicyVersion(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified role. Unlike the Amazon Web Services Management Console, when you delete a role programmatically, you must delete the items attached to the role manually, or the deletion fails. For more information, see Deleting an IAM role. Before attempting to delete a role, remove the following attached items:    Inline policies (DeleteRolePolicy)   Attached managed policies (DetachRolePolicy)   Instance profile (RemoveRoleFromInstanceProfile)   Optional – Delete instance profile after detaching from role for resource clean up (DeleteInstanceProfile)    Make sure that you do not have any Amazon EC2 instances running with the role you are about to delete. Deleting a role or instance profile that is associated with a running instance will break any applications running on the instance. 
   */
  deleteRole(params: IAM.Types.DeleteRoleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified role. Unlike the Amazon Web Services Management Console, when you delete a role programmatically, you must delete the items attached to the role manually, or the deletion fails. For more information, see Deleting an IAM role. Before attempting to delete a role, remove the following attached items:    Inline policies (DeleteRolePolicy)   Attached managed policies (DetachRolePolicy)   Instance profile (RemoveRoleFromInstanceProfile)   Optional – Delete instance profile after detaching from role for resource clean up (DeleteInstanceProfile)    Make sure that you do not have any Amazon EC2 instances running with the role you are about to delete. Deleting a role or instance profile that is associated with a running instance will break any applications running on the instance. 
   */
  deleteRole(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the permissions boundary for the specified IAM role.  You cannot set the boundary for a service-linked role.  Deleting the permissions boundary for a role might increase its permissions. For example, it might allow anyone who assumes the role to perform all the actions granted in its permissions policies. 
   */
  deleteRolePermissionsBoundary(params: IAM.Types.DeleteRolePermissionsBoundaryRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the permissions boundary for the specified IAM role.  You cannot set the boundary for a service-linked role.  Deleting the permissions boundary for a role might increase its permissions. For example, it might allow anyone who assumes the role to perform all the actions granted in its permissions policies. 
   */
  deleteRolePermissionsBoundary(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified inline policy that is embedded in the specified IAM role. A role can also have managed policies attached to it. To detach a managed policy from a role, use DetachRolePolicy. For more information about policies, refer to Managed policies and inline policies in the IAM User Guide.
   */
  deleteRolePolicy(params: IAM.Types.DeleteRolePolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified inline policy that is embedded in the specified IAM role. A role can also have managed policies attached to it. To detach a managed policy from a role, use DetachRolePolicy. For more information about policies, refer to Managed policies and inline policies in the IAM User Guide.
   */
  deleteRolePolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a SAML provider resource in IAM. Deleting the provider resource from IAM does not update any roles that reference the SAML provider resource's ARN as a principal in their trust policies. Any attempt to assume a role that references a non-existent provider resource ARN fails.   This operation requires Signature Version 4. 
   */
  deleteSAMLProvider(params: IAM.Types.DeleteSAMLProviderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a SAML provider resource in IAM. Deleting the provider resource from IAM does not update any roles that reference the SAML provider resource's ARN as a principal in their trust policies. Any attempt to assume a role that references a non-existent provider resource ARN fails.   This operation requires Signature Version 4. 
   */
  deleteSAMLProvider(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified SSH public key. The SSH public key deleted by this operation is used only for authenticating the associated IAM user to an CodeCommit repository. For more information about using SSH keys to authenticate to an CodeCommit repository, see Set up CodeCommit for SSH connections in the CodeCommit User Guide.
   */
  deleteSSHPublicKey(params: IAM.Types.DeleteSSHPublicKeyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified SSH public key. The SSH public key deleted by this operation is used only for authenticating the associated IAM user to an CodeCommit repository. For more information about using SSH keys to authenticate to an CodeCommit repository, see Set up CodeCommit for SSH connections in the CodeCommit User Guide.
   */
  deleteSSHPublicKey(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified server certificate. For more information about working with server certificates, see Working with server certificates in the IAM User Guide. This topic also includes a list of Amazon Web Services services that can use the server certificates that you manage with IAM.   If you are using a server certificate with Elastic Load Balancing, deleting the certificate could have implications for your application. If Elastic Load Balancing doesn't detect the deletion of bound certificates, it may continue to use the certificates. This could cause Elastic Load Balancing to stop accepting traffic. We recommend that you remove the reference to the certificate from Elastic Load Balancing before using this command to delete the certificate. For more information, see DeleteLoadBalancerListeners in the Elastic Load Balancing API Reference. 
   */
  deleteServerCertificate(params: IAM.Types.DeleteServerCertificateRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified server certificate. For more information about working with server certificates, see Working with server certificates in the IAM User Guide. This topic also includes a list of Amazon Web Services services that can use the server certificates that you manage with IAM.   If you are using a server certificate with Elastic Load Balancing, deleting the certificate could have implications for your application. If Elastic Load Balancing doesn't detect the deletion of bound certificates, it may continue to use the certificates. This could cause Elastic Load Balancing to stop accepting traffic. We recommend that you remove the reference to the certificate from Elastic Load Balancing before using this command to delete the certificate. For more information, see DeleteLoadBalancerListeners in the Elastic Load Balancing API Reference. 
   */
  deleteServerCertificate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Submits a service-linked role deletion request and returns a DeletionTaskId, which you can use to check the status of the deletion. Before you call this operation, confirm that the role has no active sessions and that any resources used by the role in the linked service are deleted. If you call this operation more than once for the same service-linked role and an earlier deletion task is not complete, then the DeletionTaskId of the earlier request is returned. If you submit a deletion request for a service-linked role whose linked service is still accessing a resource, then the deletion task fails. If it fails, the GetServiceLinkedRoleDeletionStatus operation returns the reason for the failure, usually including the resources that must be deleted. To delete the service-linked role, you must first remove those resources from the linked service and then submit the deletion request again. Resources are specific to the service that is linked to the role. For more information about removing resources from a service, see the Amazon Web Services documentation for your service. For more information about service-linked roles, see Roles terms and concepts: Amazon Web Services service-linked role in the IAM User Guide.
   */
  deleteServiceLinkedRole(params: IAM.Types.DeleteServiceLinkedRoleRequest, callback?: (err: AWSError, data: IAM.Types.DeleteServiceLinkedRoleResponse) => void): Request<IAM.Types.DeleteServiceLinkedRoleResponse, AWSError>;
  /**
   * Submits a service-linked role deletion request and returns a DeletionTaskId, which you can use to check the status of the deletion. Before you call this operation, confirm that the role has no active sessions and that any resources used by the role in the linked service are deleted. If you call this operation more than once for the same service-linked role and an earlier deletion task is not complete, then the DeletionTaskId of the earlier request is returned. If you submit a deletion request for a service-linked role whose linked service is still accessing a resource, then the deletion task fails. If it fails, the GetServiceLinkedRoleDeletionStatus operation returns the reason for the failure, usually including the resources that must be deleted. To delete the service-linked role, you must first remove those resources from the linked service and then submit the deletion request again. Resources are specific to the service that is linked to the role. For more information about removing resources from a service, see the Amazon Web Services documentation for your service. For more information about service-linked roles, see Roles terms and concepts: Amazon Web Services service-linked role in the IAM User Guide.
   */
  deleteServiceLinkedRole(callback?: (err: AWSError, data: IAM.Types.DeleteServiceLinkedRoleResponse) => void): Request<IAM.Types.DeleteServiceLinkedRoleResponse, AWSError>;
  /**
   * Deletes the specified service-specific credential.
   */
  deleteServiceSpecificCredential(params: IAM.Types.DeleteServiceSpecificCredentialRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified service-specific credential.
   */
  deleteServiceSpecificCredential(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a signing certificate associated with the specified IAM user. If you do not specify a user name, IAM determines the user name implicitly based on the Amazon Web Services access key ID signing the request. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated IAM users.
   */
  deleteSigningCertificate(params: IAM.Types.DeleteSigningCertificateRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a signing certificate associated with the specified IAM user. If you do not specify a user name, IAM determines the user name implicitly based on the Amazon Web Services access key ID signing the request. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated IAM users.
   */
  deleteSigningCertificate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified IAM user. Unlike the Amazon Web Services Management Console, when you delete a user programmatically, you must delete the items attached to the user manually, or the deletion fails. For more information, see Deleting an IAM user. Before attempting to delete a user, remove the following items:   Password (DeleteLoginProfile)   Access keys (DeleteAccessKey)   Signing certificate (DeleteSigningCertificate)   SSH public key (DeleteSSHPublicKey)   Git credentials (DeleteServiceSpecificCredential)   Multi-factor authentication (MFA) device (DeactivateMFADevice, DeleteVirtualMFADevice)   Inline policies (DeleteUserPolicy)   Attached managed policies (DetachUserPolicy)   Group memberships (RemoveUserFromGroup)  
   */
  deleteUser(params: IAM.Types.DeleteUserRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified IAM user. Unlike the Amazon Web Services Management Console, when you delete a user programmatically, you must delete the items attached to the user manually, or the deletion fails. For more information, see Deleting an IAM user. Before attempting to delete a user, remove the following items:   Password (DeleteLoginProfile)   Access keys (DeleteAccessKey)   Signing certificate (DeleteSigningCertificate)   SSH public key (DeleteSSHPublicKey)   Git credentials (DeleteServiceSpecificCredential)   Multi-factor authentication (MFA) device (DeactivateMFADevice, DeleteVirtualMFADevice)   Inline policies (DeleteUserPolicy)   Attached managed policies (DetachUserPolicy)   Group memberships (RemoveUserFromGroup)  
   */
  deleteUser(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the permissions boundary for the specified IAM user.  Deleting the permissions boundary for a user might increase its permissions by allowing the user to perform all the actions granted in its permissions policies.  
   */
  deleteUserPermissionsBoundary(params: IAM.Types.DeleteUserPermissionsBoundaryRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the permissions boundary for the specified IAM user.  Deleting the permissions boundary for a user might increase its permissions by allowing the user to perform all the actions granted in its permissions policies.  
   */
  deleteUserPermissionsBoundary(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified inline policy that is embedded in the specified IAM user. A user can also have managed policies attached to it. To detach a managed policy from a user, use DetachUserPolicy. For more information about policies, refer to Managed policies and inline policies in the IAM User Guide.
   */
  deleteUserPolicy(params: IAM.Types.DeleteUserPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified inline policy that is embedded in the specified IAM user. A user can also have managed policies attached to it. To detach a managed policy from a user, use DetachUserPolicy. For more information about policies, refer to Managed policies and inline policies in the IAM User Guide.
   */
  deleteUserPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a virtual MFA device.   You must deactivate a user's virtual MFA device before you can delete it. For information about deactivating MFA devices, see DeactivateMFADevice.  
   */
  deleteVirtualMFADevice(params: IAM.Types.DeleteVirtualMFADeviceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a virtual MFA device.   You must deactivate a user's virtual MFA device before you can delete it. For information about deactivating MFA devices, see DeactivateMFADevice.  
   */
  deleteVirtualMFADevice(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified managed policy from the specified IAM group. A group can also have inline policies embedded with it. To delete an inline policy, use DeleteGroupPolicy. For information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  detachGroupPolicy(params: IAM.Types.DetachGroupPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified managed policy from the specified IAM group. A group can also have inline policies embedded with it. To delete an inline policy, use DeleteGroupPolicy. For information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  detachGroupPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified managed policy from the specified role. A role can also have inline policies embedded with it. To delete an inline policy, use DeleteRolePolicy. For information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  detachRolePolicy(params: IAM.Types.DetachRolePolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified managed policy from the specified role. A role can also have inline policies embedded with it. To delete an inline policy, use DeleteRolePolicy. For information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  detachRolePolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified managed policy from the specified user. A user can also have inline policies embedded with it. To delete an inline policy, use DeleteUserPolicy. For information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  detachUserPolicy(params: IAM.Types.DetachUserPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified managed policy from the specified user. A user can also have inline policies embedded with it. To delete an inline policy, use DeleteUserPolicy. For information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  detachUserPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables the specified MFA device and associates it with the specified IAM user. When enabled, the MFA device is required for every subsequent login by the IAM user associated with the device.
   */
  enableMFADevice(params: IAM.Types.EnableMFADeviceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables the specified MFA device and associates it with the specified IAM user. When enabled, the MFA device is required for every subsequent login by the IAM user associated with the device.
   */
  enableMFADevice(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Generates a credential report for the Amazon Web Services account. For more information about the credential report, see Getting credential reports in the IAM User Guide.
   */
  generateCredentialReport(callback?: (err: AWSError, data: IAM.Types.GenerateCredentialReportResponse) => void): Request<IAM.Types.GenerateCredentialReportResponse, AWSError>;
  /**
   * Generates a report for service last accessed data for Organizations. You can generate a report for any entities (organization root, organizational unit, or account) or policies in your organization. To call this operation, you must be signed in using your Organizations management account credentials. You can use your long-term IAM user or root user credentials, or temporary credentials from assuming an IAM role. SCPs must be enabled for your organization root. You must have the required IAM and Organizations permissions. For more information, see Refining permissions using service last accessed data in the IAM User Guide. You can generate a service last accessed data report for entities by specifying only the entity's path. This data includes a list of services that are allowed by any service control policies (SCPs) that apply to the entity. You can generate a service last accessed data report for a policy by specifying an entity's path and an optional Organizations policy ID. This data includes a list of services that are allowed by the specified SCP. For each service in both report types, the data includes the most recent account activity that the policy allows to account principals in the entity or the entity's children. For important information about the data, reporting period, permissions required, troubleshooting, and supported Regions see Reducing permissions using service last accessed data in the IAM User Guide.  The data includes all attempts to access Amazon Web Services, not just the successful ones. This includes all attempts that were made using the Amazon Web Services Management Console, the Amazon Web Services API through any of the SDKs, or any of the command line tools. An unexpected entry in the service last accessed data does not mean that an account has been compromised, because the request might have been denied. Refer to your CloudTrail logs as the authoritative source for information about all API calls and whether they were successful or denied access. For more information, see Logging IAM events with CloudTrail in the IAM User Guide.  This operation returns a JobId. Use this parameter in the  GetOrganizationsAccessReport  operation to check the status of the report generation. To check the status of this request, use the JobId parameter in the  GetOrganizationsAccessReport  operation and test the JobStatus response parameter. When the job is complete, you can retrieve the report. To generate a service last accessed data report for entities, specify an entity path without specifying the optional Organizations policy ID. The type of entity that you specify determines the data returned in the report.    Root – When you specify the organizations root as the entity, the resulting report lists all of the services allowed by SCPs that are attached to your root. For each service, the report includes data for all accounts in your organization except the management account, because the management account is not limited by SCPs.    OU – When you specify an organizational unit (OU) as the entity, the resulting report lists all of the services allowed by SCPs that are attached to the OU and its parents. For each service, the report includes data for all accounts in the OU or its children. This data excludes the management account, because the management account is not limited by SCPs.    management account – When you specify the management account, the resulting report lists all Amazon Web Services services, because the management account is not limited by SCPs. For each service, the report includes data for only the management account.    Account – When you specify another account as the entity, the resulting report lists all of the services allowed by SCPs that are attached to the account and its parents. For each service, the report includes data for only the specified account.   To generate a service last accessed data report for policies, specify an entity path and the optional Organizations policy ID. The type of entity that you specify determines the data returned for each service.    Root – When you specify the root entity and a policy ID, the resulting report lists all of the services that are allowed by the specified SCP. For each service, the report includes data for all accounts in your organization to which the SCP applies. This data excludes the management account, because the management account is not limited by SCPs. If the SCP is not attached to any entities in the organization, then the report will return a list of services with no data.    OU – When you specify an OU entity and a policy ID, the resulting report lists all of the services that are allowed by the specified SCP. For each service, the report includes data for all accounts in the OU or its children to which the SCP applies. This means that other accounts outside the OU that are affected by the SCP might not be included in the data. This data excludes the management account, because the management account is not limited by SCPs. If the SCP is not attached to the OU or one of its children, the report will return a list of services with no data.    management account – When you specify the management account, the resulting report lists all Amazon Web Services services, because the management account is not limited by SCPs. If you specify a policy ID in the CLI or API, the policy is ignored. For each service, the report includes data for only the management account.    Account – When you specify another account entity and a policy ID, the resulting report lists all of the services that are allowed by the specified SCP. For each service, the report includes data for only the specified account. This means that other accounts in the organization that are affected by the SCP might not be included in the data. If the SCP is not attached to the account, the report will return a list of services with no data.    Service last accessed data does not use other policy types when determining whether a principal could access a service. These other policy types include identity-based policies, resource-based policies, access control lists, IAM permissions boundaries, and STS assume role policies. It only applies SCP logic. For more about the evaluation of policy types, see Evaluating policies in the IAM User Guide.  For more information about service last accessed data, see Reducing policy scope by viewing user activity in the IAM User Guide.
   */
  generateOrganizationsAccessReport(params: IAM.Types.GenerateOrganizationsAccessReportRequest, callback?: (err: AWSError, data: IAM.Types.GenerateOrganizationsAccessReportResponse) => void): Request<IAM.Types.GenerateOrganizationsAccessReportResponse, AWSError>;
  /**
   * Generates a report for service last accessed data for Organizations. You can generate a report for any entities (organization root, organizational unit, or account) or policies in your organization. To call this operation, you must be signed in using your Organizations management account credentials. You can use your long-term IAM user or root user credentials, or temporary credentials from assuming an IAM role. SCPs must be enabled for your organization root. You must have the required IAM and Organizations permissions. For more information, see Refining permissions using service last accessed data in the IAM User Guide. You can generate a service last accessed data report for entities by specifying only the entity's path. This data includes a list of services that are allowed by any service control policies (SCPs) that apply to the entity. You can generate a service last accessed data report for a policy by specifying an entity's path and an optional Organizations policy ID. This data includes a list of services that are allowed by the specified SCP. For each service in both report types, the data includes the most recent account activity that the policy allows to account principals in the entity or the entity's children. For important information about the data, reporting period, permissions required, troubleshooting, and supported Regions see Reducing permissions using service last accessed data in the IAM User Guide.  The data includes all attempts to access Amazon Web Services, not just the successful ones. This includes all attempts that were made using the Amazon Web Services Management Console, the Amazon Web Services API through any of the SDKs, or any of the command line tools. An unexpected entry in the service last accessed data does not mean that an account has been compromised, because the request might have been denied. Refer to your CloudTrail logs as the authoritative source for information about all API calls and whether they were successful or denied access. For more information, see Logging IAM events with CloudTrail in the IAM User Guide.  This operation returns a JobId. Use this parameter in the  GetOrganizationsAccessReport  operation to check the status of the report generation. To check the status of this request, use the JobId parameter in the  GetOrganizationsAccessReport  operation and test the JobStatus response parameter. When the job is complete, you can retrieve the report. To generate a service last accessed data report for entities, specify an entity path without specifying the optional Organizations policy ID. The type of entity that you specify determines the data returned in the report.    Root – When you specify the organizations root as the entity, the resulting report lists all of the services allowed by SCPs that are attached to your root. For each service, the report includes data for all accounts in your organization except the management account, because the management account is not limited by SCPs.    OU – When you specify an organizational unit (OU) as the entity, the resulting report lists all of the services allowed by SCPs that are attached to the OU and its parents. For each service, the report includes data for all accounts in the OU or its children. This data excludes the management account, because the management account is not limited by SCPs.    management account – When you specify the management account, the resulting report lists all Amazon Web Services services, because the management account is not limited by SCPs. For each service, the report includes data for only the management account.    Account – When you specify another account as the entity, the resulting report lists all of the services allowed by SCPs that are attached to the account and its parents. For each service, the report includes data for only the specified account.   To generate a service last accessed data report for policies, specify an entity path and the optional Organizations policy ID. The type of entity that you specify determines the data returned for each service.    Root – When you specify the root entity and a policy ID, the resulting report lists all of the services that are allowed by the specified SCP. For each service, the report includes data for all accounts in your organization to which the SCP applies. This data excludes the management account, because the management account is not limited by SCPs. If the SCP is not attached to any entities in the organization, then the report will return a list of services with no data.    OU – When you specify an OU entity and a policy ID, the resulting report lists all of the services that are allowed by the specified SCP. For each service, the report includes data for all accounts in the OU or its children to which the SCP applies. This means that other accounts outside the OU that are affected by the SCP might not be included in the data. This data excludes the management account, because the management account is not limited by SCPs. If the SCP is not attached to the OU or one of its children, the report will return a list of services with no data.    management account – When you specify the management account, the resulting report lists all Amazon Web Services services, because the management account is not limited by SCPs. If you specify a policy ID in the CLI or API, the policy is ignored. For each service, the report includes data for only the management account.    Account – When you specify another account entity and a policy ID, the resulting report lists all of the services that are allowed by the specified SCP. For each service, the report includes data for only the specified account. This means that other accounts in the organization that are affected by the SCP might not be included in the data. If the SCP is not attached to the account, the report will return a list of services with no data.    Service last accessed data does not use other policy types when determining whether a principal could access a service. These other policy types include identity-based policies, resource-based policies, access control lists, IAM permissions boundaries, and STS assume role policies. It only applies SCP logic. For more about the evaluation of policy types, see Evaluating policies in the IAM User Guide.  For more information about service last accessed data, see Reducing policy scope by viewing user activity in the IAM User Guide.
   */
  generateOrganizationsAccessReport(callback?: (err: AWSError, data: IAM.Types.GenerateOrganizationsAccessReportResponse) => void): Request<IAM.Types.GenerateOrganizationsAccessReportResponse, AWSError>;
  /**
   * Generates a report that includes details about when an IAM resource (user, group, role, or policy) was last used in an attempt to access Amazon Web Services services. Recent activity usually appears within four hours. IAM reports activity for at least the last 400 days, or less if your Region began supporting this feature within the last year. For more information, see Regions where data is tracked.  The service last accessed data includes all attempts to access an Amazon Web Services API, not just the successful ones. This includes all attempts that were made using the Amazon Web Services Management Console, the Amazon Web Services API through any of the SDKs, or any of the command line tools. An unexpected entry in the service last accessed data does not mean that your account has been compromised, because the request might have been denied. Refer to your CloudTrail logs as the authoritative source for information about all API calls and whether they were successful or denied access. For more information, see Logging IAM events with CloudTrail in the IAM User Guide.  The GenerateServiceLastAccessedDetails operation returns a JobId. Use this parameter in the following operations to retrieve the following details from your report:     GetServiceLastAccessedDetails – Use this operation for users, groups, roles, or policies to list every Amazon Web Services service that the resource could access using permissions policies. For each service, the response includes information about the most recent access attempt. The JobId returned by GenerateServiceLastAccessedDetail must be used by the same role within a session, or by the same user when used to call GetServiceLastAccessedDetail.    GetServiceLastAccessedDetailsWithEntities – Use this operation for groups and policies to list information about the associated entities (users or roles) that attempted to access a specific Amazon Web Services service.    To check the status of the GenerateServiceLastAccessedDetails request, use the JobId parameter in the same operations and test the JobStatus response parameter. For additional information about the permissions policies that allow an identity (user, group, or role) to access specific services, use the ListPoliciesGrantingServiceAccess operation.  Service last accessed data does not use other policy types when determining whether a resource could access a service. These other policy types include resource-based policies, access control lists, Organizations policies, IAM permissions boundaries, and STS assume role policies. It only applies permissions policy logic. For more about the evaluation of policy types, see Evaluating policies in the IAM User Guide.  For more information about service and action last accessed data, see Reducing permissions using service last accessed data in the IAM User Guide.
   */
  generateServiceLastAccessedDetails(params: IAM.Types.GenerateServiceLastAccessedDetailsRequest, callback?: (err: AWSError, data: IAM.Types.GenerateServiceLastAccessedDetailsResponse) => void): Request<IAM.Types.GenerateServiceLastAccessedDetailsResponse, AWSError>;
  /**
   * Generates a report that includes details about when an IAM resource (user, group, role, or policy) was last used in an attempt to access Amazon Web Services services. Recent activity usually appears within four hours. IAM reports activity for at least the last 400 days, or less if your Region began supporting this feature within the last year. For more information, see Regions where data is tracked.  The service last accessed data includes all attempts to access an Amazon Web Services API, not just the successful ones. This includes all attempts that were made using the Amazon Web Services Management Console, the Amazon Web Services API through any of the SDKs, or any of the command line tools. An unexpected entry in the service last accessed data does not mean that your account has been compromised, because the request might have been denied. Refer to your CloudTrail logs as the authoritative source for information about all API calls and whether they were successful or denied access. For more information, see Logging IAM events with CloudTrail in the IAM User Guide.  The GenerateServiceLastAccessedDetails operation returns a JobId. Use this parameter in the following operations to retrieve the following details from your report:     GetServiceLastAccessedDetails – Use this operation for users, groups, roles, or policies to list every Amazon Web Services service that the resource could access using permissions policies. For each service, the response includes information about the most recent access attempt. The JobId returned by GenerateServiceLastAccessedDetail must be used by the same role within a session, or by the same user when used to call GetServiceLastAccessedDetail.    GetServiceLastAccessedDetailsWithEntities – Use this operation for groups and policies to list information about the associated entities (users or roles) that attempted to access a specific Amazon Web Services service.    To check the status of the GenerateServiceLastAccessedDetails request, use the JobId parameter in the same operations and test the JobStatus response parameter. For additional information about the permissions policies that allow an identity (user, group, or role) to access specific services, use the ListPoliciesGrantingServiceAccess operation.  Service last accessed data does not use other policy types when determining whether a resource could access a service. These other policy types include resource-based policies, access control lists, Organizations policies, IAM permissions boundaries, and STS assume role policies. It only applies permissions policy logic. For more about the evaluation of policy types, see Evaluating policies in the IAM User Guide.  For more information about service and action last accessed data, see Reducing permissions using service last accessed data in the IAM User Guide.
   */
  generateServiceLastAccessedDetails(callback?: (err: AWSError, data: IAM.Types.GenerateServiceLastAccessedDetailsResponse) => void): Request<IAM.Types.GenerateServiceLastAccessedDetailsResponse, AWSError>;
  /**
   * Retrieves information about when the specified access key was last used. The information includes the date and time of last use, along with the Amazon Web Services service and Region that were specified in the last request made with that key.
   */
  getAccessKeyLastUsed(params: IAM.Types.GetAccessKeyLastUsedRequest, callback?: (err: AWSError, data: IAM.Types.GetAccessKeyLastUsedResponse) => void): Request<IAM.Types.GetAccessKeyLastUsedResponse, AWSError>;
  /**
   * Retrieves information about when the specified access key was last used. The information includes the date and time of last use, along with the Amazon Web Services service and Region that were specified in the last request made with that key.
   */
  getAccessKeyLastUsed(callback?: (err: AWSError, data: IAM.Types.GetAccessKeyLastUsedResponse) => void): Request<IAM.Types.GetAccessKeyLastUsedResponse, AWSError>;
  /**
   * Retrieves information about all IAM users, groups, roles, and policies in your Amazon Web Services account, including their relationships to one another. Use this operation to obtain a snapshot of the configuration of IAM permissions (users, groups, roles, and policies) in your account.  Policies returned by this operation are URL-encoded compliant with RFC 3986. You can use a URL decoding method to convert the policy back to plain JSON text. For example, if you use Java, you can use the decode method of the java.net.URLDecoder utility class in the Java SDK. Other languages and SDKs provide similar functionality.  You can optionally filter the results using the Filter parameter. You can paginate the results using the MaxItems and Marker parameters.
   */
  getAccountAuthorizationDetails(params: IAM.Types.GetAccountAuthorizationDetailsRequest, callback?: (err: AWSError, data: IAM.Types.GetAccountAuthorizationDetailsResponse) => void): Request<IAM.Types.GetAccountAuthorizationDetailsResponse, AWSError>;
  /**
   * Retrieves information about all IAM users, groups, roles, and policies in your Amazon Web Services account, including their relationships to one another. Use this operation to obtain a snapshot of the configuration of IAM permissions (users, groups, roles, and policies) in your account.  Policies returned by this operation are URL-encoded compliant with RFC 3986. You can use a URL decoding method to convert the policy back to plain JSON text. For example, if you use Java, you can use the decode method of the java.net.URLDecoder utility class in the Java SDK. Other languages and SDKs provide similar functionality.  You can optionally filter the results using the Filter parameter. You can paginate the results using the MaxItems and Marker parameters.
   */
  getAccountAuthorizationDetails(callback?: (err: AWSError, data: IAM.Types.GetAccountAuthorizationDetailsResponse) => void): Request<IAM.Types.GetAccountAuthorizationDetailsResponse, AWSError>;
  /**
   * Retrieves the password policy for the Amazon Web Services account. This tells you the complexity requirements and mandatory rotation periods for the IAM user passwords in your account. For more information about using a password policy, see Managing an IAM password policy.
   */
  getAccountPasswordPolicy(callback?: (err: AWSError, data: IAM.Types.GetAccountPasswordPolicyResponse) => void): Request<IAM.Types.GetAccountPasswordPolicyResponse, AWSError>;
  /**
   * Retrieves information about IAM entity usage and IAM quotas in the Amazon Web Services account.  For information about IAM quotas, see IAM and STS quotas in the IAM User Guide.
   */
  getAccountSummary(callback?: (err: AWSError, data: IAM.Types.GetAccountSummaryResponse) => void): Request<IAM.Types.GetAccountSummaryResponse, AWSError>;
  /**
   * Gets a list of all of the context keys referenced in the input policies. The policies are supplied as a list of one or more strings. To get the context keys from policies associated with an IAM user, group, or role, use GetContextKeysForPrincipalPolicy. Context keys are variables maintained by Amazon Web Services and its services that provide details about the context of an API query request. Context keys can be evaluated by testing against a value specified in an IAM policy. Use GetContextKeysForCustomPolicy to understand what key names and values you must supply when you call SimulateCustomPolicy. Note that all parameters are shown in unencoded form here for clarity but must be URL encoded to be included as a part of a real HTML request.
   */
  getContextKeysForCustomPolicy(params: IAM.Types.GetContextKeysForCustomPolicyRequest, callback?: (err: AWSError, data: IAM.Types.GetContextKeysForPolicyResponse) => void): Request<IAM.Types.GetContextKeysForPolicyResponse, AWSError>;
  /**
   * Gets a list of all of the context keys referenced in the input policies. The policies are supplied as a list of one or more strings. To get the context keys from policies associated with an IAM user, group, or role, use GetContextKeysForPrincipalPolicy. Context keys are variables maintained by Amazon Web Services and its services that provide details about the context of an API query request. Context keys can be evaluated by testing against a value specified in an IAM policy. Use GetContextKeysForCustomPolicy to understand what key names and values you must supply when you call SimulateCustomPolicy. Note that all parameters are shown in unencoded form here for clarity but must be URL encoded to be included as a part of a real HTML request.
   */
  getContextKeysForCustomPolicy(callback?: (err: AWSError, data: IAM.Types.GetContextKeysForPolicyResponse) => void): Request<IAM.Types.GetContextKeysForPolicyResponse, AWSError>;
  /**
   * Gets a list of all of the context keys referenced in all the IAM policies that are attached to the specified IAM entity. The entity can be an IAM user, group, or role. If you specify a user, then the request also includes all of the policies attached to groups that the user is a member of. You can optionally include a list of one or more additional policies, specified as strings. If you want to include only a list of policies by string, use GetContextKeysForCustomPolicy instead.  Note: This operation discloses information about the permissions granted to other users. If you do not want users to see other user's permissions, then consider allowing them to use GetContextKeysForCustomPolicy instead. Context keys are variables maintained by Amazon Web Services and its services that provide details about the context of an API query request. Context keys can be evaluated by testing against a value in an IAM policy. Use GetContextKeysForPrincipalPolicy to understand what key names and values you must supply when you call SimulatePrincipalPolicy.
   */
  getContextKeysForPrincipalPolicy(params: IAM.Types.GetContextKeysForPrincipalPolicyRequest, callback?: (err: AWSError, data: IAM.Types.GetContextKeysForPolicyResponse) => void): Request<IAM.Types.GetContextKeysForPolicyResponse, AWSError>;
  /**
   * Gets a list of all of the context keys referenced in all the IAM policies that are attached to the specified IAM entity. The entity can be an IAM user, group, or role. If you specify a user, then the request also includes all of the policies attached to groups that the user is a member of. You can optionally include a list of one or more additional policies, specified as strings. If you want to include only a list of policies by string, use GetContextKeysForCustomPolicy instead.  Note: This operation discloses information about the permissions granted to other users. If you do not want users to see other user's permissions, then consider allowing them to use GetContextKeysForCustomPolicy instead. Context keys are variables maintained by Amazon Web Services and its services that provide details about the context of an API query request. Context keys can be evaluated by testing against a value in an IAM policy. Use GetContextKeysForPrincipalPolicy to understand what key names and values you must supply when you call SimulatePrincipalPolicy.
   */
  getContextKeysForPrincipalPolicy(callback?: (err: AWSError, data: IAM.Types.GetContextKeysForPolicyResponse) => void): Request<IAM.Types.GetContextKeysForPolicyResponse, AWSError>;
  /**
   *  Retrieves a credential report for the Amazon Web Services account. For more information about the credential report, see Getting credential reports in the IAM User Guide.
   */
  getCredentialReport(callback?: (err: AWSError, data: IAM.Types.GetCredentialReportResponse) => void): Request<IAM.Types.GetCredentialReportResponse, AWSError>;
  /**
   *  Returns a list of IAM users that are in the specified IAM group. You can paginate the results using the MaxItems and Marker parameters.
   */
  getGroup(params: IAM.Types.GetGroupRequest, callback?: (err: AWSError, data: IAM.Types.GetGroupResponse) => void): Request<IAM.Types.GetGroupResponse, AWSError>;
  /**
   *  Returns a list of IAM users that are in the specified IAM group. You can paginate the results using the MaxItems and Marker parameters.
   */
  getGroup(callback?: (err: AWSError, data: IAM.Types.GetGroupResponse) => void): Request<IAM.Types.GetGroupResponse, AWSError>;
  /**
   * Retrieves the specified inline policy document that is embedded in the specified IAM group.  Policies returned by this operation are URL-encoded compliant with RFC 3986. You can use a URL decoding method to convert the policy back to plain JSON text. For example, if you use Java, you can use the decode method of the java.net.URLDecoder utility class in the Java SDK. Other languages and SDKs provide similar functionality.  An IAM group can also have managed policies attached to it. To retrieve a managed policy document that is attached to a group, use GetPolicy to determine the policy's default version, then use GetPolicyVersion to retrieve the policy document. For more information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  getGroupPolicy(params: IAM.Types.GetGroupPolicyRequest, callback?: (err: AWSError, data: IAM.Types.GetGroupPolicyResponse) => void): Request<IAM.Types.GetGroupPolicyResponse, AWSError>;
  /**
   * Retrieves the specified inline policy document that is embedded in the specified IAM group.  Policies returned by this operation are URL-encoded compliant with RFC 3986. You can use a URL decoding method to convert the policy back to plain JSON text. For example, if you use Java, you can use the decode method of the java.net.URLDecoder utility class in the Java SDK. Other languages and SDKs provide similar functionality.  An IAM group can also have managed policies attached to it. To retrieve a managed policy document that is attached to a group, use GetPolicy to determine the policy's default version, then use GetPolicyVersion to retrieve the policy document. For more information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  getGroupPolicy(callback?: (err: AWSError, data: IAM.Types.GetGroupPolicyResponse) => void): Request<IAM.Types.GetGroupPolicyResponse, AWSError>;
  /**
   *  Retrieves information about the specified instance profile, including the instance profile's path, GUID, ARN, and role. For more information about instance profiles, see Using instance profiles in the IAM User Guide.
   */
  getInstanceProfile(params: IAM.Types.GetInstanceProfileRequest, callback?: (err: AWSError, data: IAM.Types.GetInstanceProfileResponse) => void): Request<IAM.Types.GetInstanceProfileResponse, AWSError>;
  /**
   *  Retrieves information about the specified instance profile, including the instance profile's path, GUID, ARN, and role. For more information about instance profiles, see Using instance profiles in the IAM User Guide.
   */
  getInstanceProfile(callback?: (err: AWSError, data: IAM.Types.GetInstanceProfileResponse) => void): Request<IAM.Types.GetInstanceProfileResponse, AWSError>;
  /**
   * Retrieves the user name for the specified IAM user. A login profile is created when you create a password for the user to access the Amazon Web Services Management Console. If the user does not exist or does not have a password, the operation returns a 404 (NoSuchEntity) error. If you create an IAM user with access to the console, the CreateDate reflects the date you created the initial password for the user. If you create an IAM user with programmatic access, and then later add a password for the user to access the Amazon Web Services Management Console, the CreateDate reflects the initial password creation date. A user with programmatic access does not have a login profile unless you create a password for the user to access the Amazon Web Services Management Console.
   */
  getLoginProfile(params: IAM.Types.GetLoginProfileRequest, callback?: (err: AWSError, data: IAM.Types.GetLoginProfileResponse) => void): Request<IAM.Types.GetLoginProfileResponse, AWSError>;
  /**
   * Retrieves the user name for the specified IAM user. A login profile is created when you create a password for the user to access the Amazon Web Services Management Console. If the user does not exist or does not have a password, the operation returns a 404 (NoSuchEntity) error. If you create an IAM user with access to the console, the CreateDate reflects the date you created the initial password for the user. If you create an IAM user with programmatic access, and then later add a password for the user to access the Amazon Web Services Management Console, the CreateDate reflects the initial password creation date. A user with programmatic access does not have a login profile unless you create a password for the user to access the Amazon Web Services Management Console.
   */
  getLoginProfile(callback?: (err: AWSError, data: IAM.Types.GetLoginProfileResponse) => void): Request<IAM.Types.GetLoginProfileResponse, AWSError>;
  /**
   * Retrieves information about an MFA device for a specified user.
   */
  getMFADevice(params: IAM.Types.GetMFADeviceRequest, callback?: (err: AWSError, data: IAM.Types.GetMFADeviceResponse) => void): Request<IAM.Types.GetMFADeviceResponse, AWSError>;
  /**
   * Retrieves information about an MFA device for a specified user.
   */
  getMFADevice(callback?: (err: AWSError, data: IAM.Types.GetMFADeviceResponse) => void): Request<IAM.Types.GetMFADeviceResponse, AWSError>;
  /**
   * Returns information about the specified OpenID Connect (OIDC) provider resource object in IAM.
   */
  getOpenIDConnectProvider(params: IAM.Types.GetOpenIDConnectProviderRequest, callback?: (err: AWSError, data: IAM.Types.GetOpenIDConnectProviderResponse) => void): Request<IAM.Types.GetOpenIDConnectProviderResponse, AWSError>;
  /**
   * Returns information about the specified OpenID Connect (OIDC) provider resource object in IAM.
   */
  getOpenIDConnectProvider(callback?: (err: AWSError, data: IAM.Types.GetOpenIDConnectProviderResponse) => void): Request<IAM.Types.GetOpenIDConnectProviderResponse, AWSError>;
  /**
   * Retrieves the service last accessed data report for Organizations that was previously generated using the  GenerateOrganizationsAccessReport  operation. This operation retrieves the status of your report job and the report contents. Depending on the parameters that you passed when you generated the report, the data returned could include different information. For details, see GenerateOrganizationsAccessReport. To call this operation, you must be signed in to the management account in your organization. SCPs must be enabled for your organization root. You must have permissions to perform this operation. For more information, see Refining permissions using service last accessed data in the IAM User Guide. For each service that principals in an account (root user, IAM users, or IAM roles) could access using SCPs, the operation returns details about the most recent access attempt. If there was no attempt, the service is listed without details about the most recent attempt to access the service. If the operation fails, it returns the reason that it failed. By default, the list is sorted by service namespace.
   */
  getOrganizationsAccessReport(params: IAM.Types.GetOrganizationsAccessReportRequest, callback?: (err: AWSError, data: IAM.Types.GetOrganizationsAccessReportResponse) => void): Request<IAM.Types.GetOrganizationsAccessReportResponse, AWSError>;
  /**
   * Retrieves the service last accessed data report for Organizations that was previously generated using the  GenerateOrganizationsAccessReport  operation. This operation retrieves the status of your report job and the report contents. Depending on the parameters that you passed when you generated the report, the data returned could include different information. For details, see GenerateOrganizationsAccessReport. To call this operation, you must be signed in to the management account in your organization. SCPs must be enabled for your organization root. You must have permissions to perform this operation. For more information, see Refining permissions using service last accessed data in the IAM User Guide. For each service that principals in an account (root user, IAM users, or IAM roles) could access using SCPs, the operation returns details about the most recent access attempt. If there was no attempt, the service is listed without details about the most recent attempt to access the service. If the operation fails, it returns the reason that it failed. By default, the list is sorted by service namespace.
   */
  getOrganizationsAccessReport(callback?: (err: AWSError, data: IAM.Types.GetOrganizationsAccessReportResponse) => void): Request<IAM.Types.GetOrganizationsAccessReportResponse, AWSError>;
  /**
   * Retrieves information about the specified managed policy, including the policy's default version and the total number of IAM users, groups, and roles to which the policy is attached. To retrieve the list of the specific users, groups, and roles that the policy is attached to, use ListEntitiesForPolicy. This operation returns metadata about the policy. To retrieve the actual policy document for a specific version of the policy, use GetPolicyVersion. This operation retrieves information about managed policies. To retrieve information about an inline policy that is embedded with an IAM user, group, or role, use GetUserPolicy, GetGroupPolicy, or GetRolePolicy. For more information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  getPolicy(params: IAM.Types.GetPolicyRequest, callback?: (err: AWSError, data: IAM.Types.GetPolicyResponse) => void): Request<IAM.Types.GetPolicyResponse, AWSError>;
  /**
   * Retrieves information about the specified managed policy, including the policy's default version and the total number of IAM users, groups, and roles to which the policy is attached. To retrieve the list of the specific users, groups, and roles that the policy is attached to, use ListEntitiesForPolicy. This operation returns metadata about the policy. To retrieve the actual policy document for a specific version of the policy, use GetPolicyVersion. This operation retrieves information about managed policies. To retrieve information about an inline policy that is embedded with an IAM user, group, or role, use GetUserPolicy, GetGroupPolicy, or GetRolePolicy. For more information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  getPolicy(callback?: (err: AWSError, data: IAM.Types.GetPolicyResponse) => void): Request<IAM.Types.GetPolicyResponse, AWSError>;
  /**
   * Retrieves information about the specified version of the specified managed policy, including the policy document.  Policies returned by this operation are URL-encoded compliant with RFC 3986. You can use a URL decoding method to convert the policy back to plain JSON text. For example, if you use Java, you can use the decode method of the java.net.URLDecoder utility class in the Java SDK. Other languages and SDKs provide similar functionality.  To list the available versions for a policy, use ListPolicyVersions. This operation retrieves information about managed policies. To retrieve information about an inline policy that is embedded in a user, group, or role, use GetUserPolicy, GetGroupPolicy, or GetRolePolicy. For more information about the types of policies, see Managed policies and inline policies in the IAM User Guide. For more information about managed policy versions, see Versioning for managed policies in the IAM User Guide.
   */
  getPolicyVersion(params: IAM.Types.GetPolicyVersionRequest, callback?: (err: AWSError, data: IAM.Types.GetPolicyVersionResponse) => void): Request<IAM.Types.GetPolicyVersionResponse, AWSError>;
  /**
   * Retrieves information about the specified version of the specified managed policy, including the policy document.  Policies returned by this operation are URL-encoded compliant with RFC 3986. You can use a URL decoding method to convert the policy back to plain JSON text. For example, if you use Java, you can use the decode method of the java.net.URLDecoder utility class in the Java SDK. Other languages and SDKs provide similar functionality.  To list the available versions for a policy, use ListPolicyVersions. This operation retrieves information about managed policies. To retrieve information about an inline policy that is embedded in a user, group, or role, use GetUserPolicy, GetGroupPolicy, or GetRolePolicy. For more information about the types of policies, see Managed policies and inline policies in the IAM User Guide. For more information about managed policy versions, see Versioning for managed policies in the IAM User Guide.
   */
  getPolicyVersion(callback?: (err: AWSError, data: IAM.Types.GetPolicyVersionResponse) => void): Request<IAM.Types.GetPolicyVersionResponse, AWSError>;
  /**
   * Retrieves information about the specified role, including the role's path, GUID, ARN, and the role's trust policy that grants permission to assume the role. For more information about roles, see IAM roles in the IAM User Guide.  Policies returned by this operation are URL-encoded compliant with RFC 3986. You can use a URL decoding method to convert the policy back to plain JSON text. For example, if you use Java, you can use the decode method of the java.net.URLDecoder utility class in the Java SDK. Other languages and SDKs provide similar functionality. 
   */
  getRole(params: IAM.Types.GetRoleRequest, callback?: (err: AWSError, data: IAM.Types.GetRoleResponse) => void): Request<IAM.Types.GetRoleResponse, AWSError>;
  /**
   * Retrieves information about the specified role, including the role's path, GUID, ARN, and the role's trust policy that grants permission to assume the role. For more information about roles, see IAM roles in the IAM User Guide.  Policies returned by this operation are URL-encoded compliant with RFC 3986. You can use a URL decoding method to convert the policy back to plain JSON text. For example, if you use Java, you can use the decode method of the java.net.URLDecoder utility class in the Java SDK. Other languages and SDKs provide similar functionality. 
   */
  getRole(callback?: (err: AWSError, data: IAM.Types.GetRoleResponse) => void): Request<IAM.Types.GetRoleResponse, AWSError>;
  /**
   * Retrieves the specified inline policy document that is embedded with the specified IAM role.  Policies returned by this operation are URL-encoded compliant with RFC 3986. You can use a URL decoding method to convert the policy back to plain JSON text. For example, if you use Java, you can use the decode method of the java.net.URLDecoder utility class in the Java SDK. Other languages and SDKs provide similar functionality.  An IAM role can also have managed policies attached to it. To retrieve a managed policy document that is attached to a role, use GetPolicy to determine the policy's default version, then use GetPolicyVersion to retrieve the policy document. For more information about policies, see Managed policies and inline policies in the IAM User Guide.  For more information about roles, see IAM roles in the IAM User Guide.
   */
  getRolePolicy(params: IAM.Types.GetRolePolicyRequest, callback?: (err: AWSError, data: IAM.Types.GetRolePolicyResponse) => void): Request<IAM.Types.GetRolePolicyResponse, AWSError>;
  /**
   * Retrieves the specified inline policy document that is embedded with the specified IAM role.  Policies returned by this operation are URL-encoded compliant with RFC 3986. You can use a URL decoding method to convert the policy back to plain JSON text. For example, if you use Java, you can use the decode method of the java.net.URLDecoder utility class in the Java SDK. Other languages and SDKs provide similar functionality.  An IAM role can also have managed policies attached to it. To retrieve a managed policy document that is attached to a role, use GetPolicy to determine the policy's default version, then use GetPolicyVersion to retrieve the policy document. For more information about policies, see Managed policies and inline policies in the IAM User Guide.  For more information about roles, see IAM roles in the IAM User Guide.
   */
  getRolePolicy(callback?: (err: AWSError, data: IAM.Types.GetRolePolicyResponse) => void): Request<IAM.Types.GetRolePolicyResponse, AWSError>;
  /**
   * Returns the SAML provider metadocument that was uploaded when the IAM SAML provider resource object was created or updated.  This operation requires Signature Version 4. 
   */
  getSAMLProvider(params: IAM.Types.GetSAMLProviderRequest, callback?: (err: AWSError, data: IAM.Types.GetSAMLProviderResponse) => void): Request<IAM.Types.GetSAMLProviderResponse, AWSError>;
  /**
   * Returns the SAML provider metadocument that was uploaded when the IAM SAML provider resource object was created or updated.  This operation requires Signature Version 4. 
   */
  getSAMLProvider(callback?: (err: AWSError, data: IAM.Types.GetSAMLProviderResponse) => void): Request<IAM.Types.GetSAMLProviderResponse, AWSError>;
  /**
   * Retrieves the specified SSH public key, including metadata about the key. The SSH public key retrieved by this operation is used only for authenticating the associated IAM user to an CodeCommit repository. For more information about using SSH keys to authenticate to an CodeCommit repository, see Set up CodeCommit for SSH connections in the CodeCommit User Guide.
   */
  getSSHPublicKey(params: IAM.Types.GetSSHPublicKeyRequest, callback?: (err: AWSError, data: IAM.Types.GetSSHPublicKeyResponse) => void): Request<IAM.Types.GetSSHPublicKeyResponse, AWSError>;
  /**
   * Retrieves the specified SSH public key, including metadata about the key. The SSH public key retrieved by this operation is used only for authenticating the associated IAM user to an CodeCommit repository. For more information about using SSH keys to authenticate to an CodeCommit repository, see Set up CodeCommit for SSH connections in the CodeCommit User Guide.
   */
  getSSHPublicKey(callback?: (err: AWSError, data: IAM.Types.GetSSHPublicKeyResponse) => void): Request<IAM.Types.GetSSHPublicKeyResponse, AWSError>;
  /**
   * Retrieves information about the specified server certificate stored in IAM. For more information about working with server certificates, see Working with server certificates in the IAM User Guide. This topic includes a list of Amazon Web Services services that can use the server certificates that you manage with IAM.
   */
  getServerCertificate(params: IAM.Types.GetServerCertificateRequest, callback?: (err: AWSError, data: IAM.Types.GetServerCertificateResponse) => void): Request<IAM.Types.GetServerCertificateResponse, AWSError>;
  /**
   * Retrieves information about the specified server certificate stored in IAM. For more information about working with server certificates, see Working with server certificates in the IAM User Guide. This topic includes a list of Amazon Web Services services that can use the server certificates that you manage with IAM.
   */
  getServerCertificate(callback?: (err: AWSError, data: IAM.Types.GetServerCertificateResponse) => void): Request<IAM.Types.GetServerCertificateResponse, AWSError>;
  /**
   * Retrieves a service last accessed report that was created using the GenerateServiceLastAccessedDetails operation. You can use the JobId parameter in GetServiceLastAccessedDetails to retrieve the status of your report job. When the report is complete, you can retrieve the generated report. The report includes a list of Amazon Web Services services that the resource (user, group, role, or managed policy) can access.  Service last accessed data does not use other policy types when determining whether a resource could access a service. These other policy types include resource-based policies, access control lists, Organizations policies, IAM permissions boundaries, and STS assume role policies. It only applies permissions policy logic. For more about the evaluation of policy types, see Evaluating policies in the IAM User Guide.  For each service that the resource could access using permissions policies, the operation returns details about the most recent access attempt. If there was no attempt, the service is listed without details about the most recent attempt to access the service. If the operation fails, the GetServiceLastAccessedDetails operation returns the reason that it failed. The GetServiceLastAccessedDetails operation returns a list of services. This list includes the number of entities that have attempted to access the service and the date and time of the last attempt. It also returns the ARN of the following entity, depending on the resource ARN that you used to generate the report:    User – Returns the user ARN that you used to generate the report    Group – Returns the ARN of the group member (user) that last attempted to access the service    Role – Returns the role ARN that you used to generate the report    Policy – Returns the ARN of the user or role that last used the policy to attempt to access the service   By default, the list is sorted by service namespace. If you specified ACTION_LEVEL granularity when you generated the report, this operation returns service and action last accessed data. This includes the most recent access attempt for each tracked action within a service. Otherwise, this operation returns only service data. For more information about service and action last accessed data, see Reducing permissions using service last accessed data in the IAM User Guide.
   */
  getServiceLastAccessedDetails(params: IAM.Types.GetServiceLastAccessedDetailsRequest, callback?: (err: AWSError, data: IAM.Types.GetServiceLastAccessedDetailsResponse) => void): Request<IAM.Types.GetServiceLastAccessedDetailsResponse, AWSError>;
  /**
   * Retrieves a service last accessed report that was created using the GenerateServiceLastAccessedDetails operation. You can use the JobId parameter in GetServiceLastAccessedDetails to retrieve the status of your report job. When the report is complete, you can retrieve the generated report. The report includes a list of Amazon Web Services services that the resource (user, group, role, or managed policy) can access.  Service last accessed data does not use other policy types when determining whether a resource could access a service. These other policy types include resource-based policies, access control lists, Organizations policies, IAM permissions boundaries, and STS assume role policies. It only applies permissions policy logic. For more about the evaluation of policy types, see Evaluating policies in the IAM User Guide.  For each service that the resource could access using permissions policies, the operation returns details about the most recent access attempt. If there was no attempt, the service is listed without details about the most recent attempt to access the service. If the operation fails, the GetServiceLastAccessedDetails operation returns the reason that it failed. The GetServiceLastAccessedDetails operation returns a list of services. This list includes the number of entities that have attempted to access the service and the date and time of the last attempt. It also returns the ARN of the following entity, depending on the resource ARN that you used to generate the report:    User – Returns the user ARN that you used to generate the report    Group – Returns the ARN of the group member (user) that last attempted to access the service    Role – Returns the role ARN that you used to generate the report    Policy – Returns the ARN of the user or role that last used the policy to attempt to access the service   By default, the list is sorted by service namespace. If you specified ACTION_LEVEL granularity when you generated the report, this operation returns service and action last accessed data. This includes the most recent access attempt for each tracked action within a service. Otherwise, this operation returns only service data. For more information about service and action last accessed data, see Reducing permissions using service last accessed data in the IAM User Guide.
   */
  getServiceLastAccessedDetails(callback?: (err: AWSError, data: IAM.Types.GetServiceLastAccessedDetailsResponse) => void): Request<IAM.Types.GetServiceLastAccessedDetailsResponse, AWSError>;
  /**
   * After you generate a group or policy report using the GenerateServiceLastAccessedDetails operation, you can use the JobId parameter in GetServiceLastAccessedDetailsWithEntities. This operation retrieves the status of your report job and a list of entities that could have used group or policy permissions to access the specified service.    Group – For a group report, this operation returns a list of users in the group that could have used the group’s policies in an attempt to access the service.    Policy – For a policy report, this operation returns a list of entities (users or roles) that could have used the policy in an attempt to access the service.   You can also use this operation for user or role reports to retrieve details about those entities. If the operation fails, the GetServiceLastAccessedDetailsWithEntities operation returns the reason that it failed. By default, the list of associated entities is sorted by date, with the most recent access listed first.
   */
  getServiceLastAccessedDetailsWithEntities(params: IAM.Types.GetServiceLastAccessedDetailsWithEntitiesRequest, callback?: (err: AWSError, data: IAM.Types.GetServiceLastAccessedDetailsWithEntitiesResponse) => void): Request<IAM.Types.GetServiceLastAccessedDetailsWithEntitiesResponse, AWSError>;
  /**
   * After you generate a group or policy report using the GenerateServiceLastAccessedDetails operation, you can use the JobId parameter in GetServiceLastAccessedDetailsWithEntities. This operation retrieves the status of your report job and a list of entities that could have used group or policy permissions to access the specified service.    Group – For a group report, this operation returns a list of users in the group that could have used the group’s policies in an attempt to access the service.    Policy – For a policy report, this operation returns a list of entities (users or roles) that could have used the policy in an attempt to access the service.   You can also use this operation for user or role reports to retrieve details about those entities. If the operation fails, the GetServiceLastAccessedDetailsWithEntities operation returns the reason that it failed. By default, the list of associated entities is sorted by date, with the most recent access listed first.
   */
  getServiceLastAccessedDetailsWithEntities(callback?: (err: AWSError, data: IAM.Types.GetServiceLastAccessedDetailsWithEntitiesResponse) => void): Request<IAM.Types.GetServiceLastAccessedDetailsWithEntitiesResponse, AWSError>;
  /**
   * Retrieves the status of your service-linked role deletion. After you use DeleteServiceLinkedRole to submit a service-linked role for deletion, you can use the DeletionTaskId parameter in GetServiceLinkedRoleDeletionStatus to check the status of the deletion. If the deletion fails, this operation returns the reason that it failed, if that information is returned by the service.
   */
  getServiceLinkedRoleDeletionStatus(params: IAM.Types.GetServiceLinkedRoleDeletionStatusRequest, callback?: (err: AWSError, data: IAM.Types.GetServiceLinkedRoleDeletionStatusResponse) => void): Request<IAM.Types.GetServiceLinkedRoleDeletionStatusResponse, AWSError>;
  /**
   * Retrieves the status of your service-linked role deletion. After you use DeleteServiceLinkedRole to submit a service-linked role for deletion, you can use the DeletionTaskId parameter in GetServiceLinkedRoleDeletionStatus to check the status of the deletion. If the deletion fails, this operation returns the reason that it failed, if that information is returned by the service.
   */
  getServiceLinkedRoleDeletionStatus(callback?: (err: AWSError, data: IAM.Types.GetServiceLinkedRoleDeletionStatusResponse) => void): Request<IAM.Types.GetServiceLinkedRoleDeletionStatusResponse, AWSError>;
  /**
   * Retrieves information about the specified IAM user, including the user's creation date, path, unique ID, and ARN. If you do not specify a user name, IAM determines the user name implicitly based on the Amazon Web Services access key ID used to sign the request to this operation.
   */
  getUser(params: IAM.Types.GetUserRequest, callback?: (err: AWSError, data: IAM.Types.GetUserResponse) => void): Request<IAM.Types.GetUserResponse, AWSError>;
  /**
   * Retrieves information about the specified IAM user, including the user's creation date, path, unique ID, and ARN. If you do not specify a user name, IAM determines the user name implicitly based on the Amazon Web Services access key ID used to sign the request to this operation.
   */
  getUser(callback?: (err: AWSError, data: IAM.Types.GetUserResponse) => void): Request<IAM.Types.GetUserResponse, AWSError>;
  /**
   * Retrieves the specified inline policy document that is embedded in the specified IAM user.  Policies returned by this operation are URL-encoded compliant with RFC 3986. You can use a URL decoding method to convert the policy back to plain JSON text. For example, if you use Java, you can use the decode method of the java.net.URLDecoder utility class in the Java SDK. Other languages and SDKs provide similar functionality.  An IAM user can also have managed policies attached to it. To retrieve a managed policy document that is attached to a user, use GetPolicy to determine the policy's default version. Then use GetPolicyVersion to retrieve the policy document. For more information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  getUserPolicy(params: IAM.Types.GetUserPolicyRequest, callback?: (err: AWSError, data: IAM.Types.GetUserPolicyResponse) => void): Request<IAM.Types.GetUserPolicyResponse, AWSError>;
  /**
   * Retrieves the specified inline policy document that is embedded in the specified IAM user.  Policies returned by this operation are URL-encoded compliant with RFC 3986. You can use a URL decoding method to convert the policy back to plain JSON text. For example, if you use Java, you can use the decode method of the java.net.URLDecoder utility class in the Java SDK. Other languages and SDKs provide similar functionality.  An IAM user can also have managed policies attached to it. To retrieve a managed policy document that is attached to a user, use GetPolicy to determine the policy's default version. Then use GetPolicyVersion to retrieve the policy document. For more information about policies, see Managed policies and inline policies in the IAM User Guide.
   */
  getUserPolicy(callback?: (err: AWSError, data: IAM.Types.GetUserPolicyResponse) => void): Request<IAM.Types.GetUserPolicyResponse, AWSError>;
  /**
   * Returns information about the access key IDs associated with the specified IAM user. If there is none, the operation returns an empty list. Although each user is limited to a small number of keys, you can still paginate the results using the MaxItems and Marker parameters. If the UserName is not specified, the user name is determined implicitly based on the Amazon Web Services access key ID used to sign the request. If a temporary access key is used, then UserName is required. If a long-term key is assigned to the user, then UserName is not required. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated users.  To ensure the security of your Amazon Web Services account, the secret access key is accessible only during key and user creation. 
   */
  listAccessKeys(params: IAM.Types.ListAccessKeysRequest, callback?: (err: AWSError, data: IAM.Types.ListAccessKeysResponse) => void): Request<IAM.Types.ListAccessKeysResponse, AWSError>;
  /**
   * Returns information about the access key IDs associated with the specified IAM user. If there is none, the operation returns an empty list. Although each user is limited to a small number of keys, you can still paginate the results using the MaxItems and Marker parameters. If the UserName is not specified, the user name is determined implicitly based on the Amazon Web Services access key ID used to sign the request. If a temporary access key is used, then UserName is required. If a long-term key is assigned to the user, then UserName is not required. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated users.  To ensure the security of your Amazon Web Services account, the secret access key is accessible only during key and user creation. 
   */
  listAccessKeys(callback?: (err: AWSError, data: IAM.Types.ListAccessKeysResponse) => void): Request<IAM.Types.ListAccessKeysResponse, AWSError>;
  /**
   * Lists the account alias associated with the Amazon Web Services account (Note: you can have only one). For information about using an Amazon Web Services account alias, see Creating, deleting, and listing an Amazon Web Services account alias in the Amazon Web Services Sign-In User Guide.
   */
  listAccountAliases(params: IAM.Types.ListAccountAliasesRequest, callback?: (err: AWSError, data: IAM.Types.ListAccountAliasesResponse) => void): Request<IAM.Types.ListAccountAliasesResponse, AWSError>;
  /**
   * Lists the account alias associated with the Amazon Web Services account (Note: you can have only one). For information about using an Amazon Web Services account alias, see Creating, deleting, and listing an Amazon Web Services account alias in the Amazon Web Services Sign-In User Guide.
   */
  listAccountAliases(callback?: (err: AWSError, data: IAM.Types.ListAccountAliasesResponse) => void): Request<IAM.Types.ListAccountAliasesResponse, AWSError>;
  /**
   * Lists all managed policies that are attached to the specified IAM group. An IAM group can also have inline policies embedded with it. To list the inline policies for a group, use ListGroupPolicies. For information about policies, see Managed policies and inline policies in the IAM User Guide. You can paginate the results using the MaxItems and Marker parameters. You can use the PathPrefix parameter to limit the list of policies to only those matching the specified path prefix. If there are no policies attached to the specified group (or none that match the specified path prefix), the operation returns an empty list.
   */
  listAttachedGroupPolicies(params: IAM.Types.ListAttachedGroupPoliciesRequest, callback?: (err: AWSError, data: IAM.Types.ListAttachedGroupPoliciesResponse) => void): Request<IAM.Types.ListAttachedGroupPoliciesResponse, AWSError>;
  /**
   * Lists all managed policies that are attached to the specified IAM group. An IAM group can also have inline policies embedded with it. To list the inline policies for a group, use ListGroupPolicies. For information about policies, see Managed policies and inline policies in the IAM User Guide. You can paginate the results using the MaxItems and Marker parameters. You can use the PathPrefix parameter to limit the list of policies to only those matching the specified path prefix. If there are no policies attached to the specified group (or none that match the specified path prefix), the operation returns an empty list.
   */
  listAttachedGroupPolicies(callback?: (err: AWSError, data: IAM.Types.ListAttachedGroupPoliciesResponse) => void): Request<IAM.Types.ListAttachedGroupPoliciesResponse, AWSError>;
  /**
   * Lists all managed policies that are attached to the specified IAM role. An IAM role can also have inline policies embedded with it. To list the inline policies for a role, use ListRolePolicies. For information about policies, see Managed policies and inline policies in the IAM User Guide. You can paginate the results using the MaxItems and Marker parameters. You can use the PathPrefix parameter to limit the list of policies to only those matching the specified path prefix. If there are no policies attached to the specified role (or none that match the specified path prefix), the operation returns an empty list.
   */
  listAttachedRolePolicies(params: IAM.Types.ListAttachedRolePoliciesRequest, callback?: (err: AWSError, data: IAM.Types.ListAttachedRolePoliciesResponse) => void): Request<IAM.Types.ListAttachedRolePoliciesResponse, AWSError>;
  /**
   * Lists all managed policies that are attached to the specified IAM role. An IAM role can also have inline policies embedded with it. To list the inline policies for a role, use ListRolePolicies. For information about policies, see Managed policies and inline policies in the IAM User Guide. You can paginate the results using the MaxItems and Marker parameters. You can use the PathPrefix parameter to limit the list of policies to only those matching the specified path prefix. If there are no policies attached to the specified role (or none that match the specified path prefix), the operation returns an empty list.
   */
  listAttachedRolePolicies(callback?: (err: AWSError, data: IAM.Types.ListAttachedRolePoliciesResponse) => void): Request<IAM.Types.ListAttachedRolePoliciesResponse, AWSError>;
  /**
   * Lists all managed policies that are attached to the specified IAM user. An IAM user can also have inline policies embedded with it. To list the inline policies for a user, use ListUserPolicies. For information about policies, see Managed policies and inline policies in the IAM User Guide. You can paginate the results using the MaxItems and Marker parameters. You can use the PathPrefix parameter to limit the list of policies to only those matching the specified path prefix. If there are no policies attached to the specified group (or none that match the specified path prefix), the operation returns an empty list.
   */
  listAttachedUserPolicies(params: IAM.Types.ListAttachedUserPoliciesRequest, callback?: (err: AWSError, data: IAM.Types.ListAttachedUserPoliciesResponse) => void): Request<IAM.Types.ListAttachedUserPoliciesResponse, AWSError>;
  /**
   * Lists all managed policies that are attached to the specified IAM user. An IAM user can also have inline policies embedded with it. To list the inline policies for a user, use ListUserPolicies. For information about policies, see Managed policies and inline policies in the IAM User Guide. You can paginate the results using the MaxItems and Marker parameters. You can use the PathPrefix parameter to limit the list of policies to only those matching the specified path prefix. If there are no policies attached to the specified group (or none that match the specified path prefix), the operation returns an empty list.
   */
  listAttachedUserPolicies(callback?: (err: AWSError, data: IAM.Types.ListAttachedUserPoliciesResponse) => void): Request<IAM.Types.ListAttachedUserPoliciesResponse, AWSError>;
  /**
   * Lists all IAM users, groups, and roles that the specified managed policy is attached to. You can use the optional EntityFilter parameter to limit the results to a particular type of entity (users, groups, or roles). For example, to list only the roles that are attached to the specified policy, set EntityFilter to Role. You can paginate the results using the MaxItems and Marker parameters.
   */
  listEntitiesForPolicy(params: IAM.Types.ListEntitiesForPolicyRequest, callback?: (err: AWSError, data: IAM.Types.ListEntitiesForPolicyResponse) => void): Request<IAM.Types.ListEntitiesForPolicyResponse, AWSError>;
  /**
   * Lists all IAM users, groups, and roles that the specified managed policy is attached to. You can use the optional EntityFilter parameter to limit the results to a particular type of entity (users, groups, or roles). For example, to list only the roles that are attached to the specified policy, set EntityFilter to Role. You can paginate the results using the MaxItems and Marker parameters.
   */
  listEntitiesForPolicy(callback?: (err: AWSError, data: IAM.Types.ListEntitiesForPolicyResponse) => void): Request<IAM.Types.ListEntitiesForPolicyResponse, AWSError>;
  /**
   * Lists the names of the inline policies that are embedded in the specified IAM group. An IAM group can also have managed policies attached to it. To list the managed policies that are attached to a group, use ListAttachedGroupPolicies. For more information about policies, see Managed policies and inline policies in the IAM User Guide. You can paginate the results using the MaxItems and Marker parameters. If there are no inline policies embedded with the specified group, the operation returns an empty list.
   */
  listGroupPolicies(params: IAM.Types.ListGroupPoliciesRequest, callback?: (err: AWSError, data: IAM.Types.ListGroupPoliciesResponse) => void): Request<IAM.Types.ListGroupPoliciesResponse, AWSError>;
  /**
   * Lists the names of the inline policies that are embedded in the specified IAM group. An IAM group can also have managed policies attached to it. To list the managed policies that are attached to a group, use ListAttachedGroupPolicies. For more information about policies, see Managed policies and inline policies in the IAM User Guide. You can paginate the results using the MaxItems and Marker parameters. If there are no inline policies embedded with the specified group, the operation returns an empty list.
   */
  listGroupPolicies(callback?: (err: AWSError, data: IAM.Types.ListGroupPoliciesResponse) => void): Request<IAM.Types.ListGroupPoliciesResponse, AWSError>;
  /**
   * Lists the IAM groups that have the specified path prefix.  You can paginate the results using the MaxItems and Marker parameters.
   */
  listGroups(params: IAM.Types.ListGroupsRequest, callback?: (err: AWSError, data: IAM.Types.ListGroupsResponse) => void): Request<IAM.Types.ListGroupsResponse, AWSError>;
  /**
   * Lists the IAM groups that have the specified path prefix.  You can paginate the results using the MaxItems and Marker parameters.
   */
  listGroups(callback?: (err: AWSError, data: IAM.Types.ListGroupsResponse) => void): Request<IAM.Types.ListGroupsResponse, AWSError>;
  /**
   * Lists the IAM groups that the specified IAM user belongs to. You can paginate the results using the MaxItems and Marker parameters.
   */
  listGroupsForUser(params: IAM.Types.ListGroupsForUserRequest, callback?: (err: AWSError, data: IAM.Types.ListGroupsForUserResponse) => void): Request<IAM.Types.ListGroupsForUserResponse, AWSError>;
  /**
   * Lists the IAM groups that the specified IAM user belongs to. You can paginate the results using the MaxItems and Marker parameters.
   */
  listGroupsForUser(callback?: (err: AWSError, data: IAM.Types.ListGroupsForUserResponse) => void): Request<IAM.Types.ListGroupsForUserResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified IAM instance profile. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  listInstanceProfileTags(params: IAM.Types.ListInstanceProfileTagsRequest, callback?: (err: AWSError, data: IAM.Types.ListInstanceProfileTagsResponse) => void): Request<IAM.Types.ListInstanceProfileTagsResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified IAM instance profile. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  listInstanceProfileTags(callback?: (err: AWSError, data: IAM.Types.ListInstanceProfileTagsResponse) => void): Request<IAM.Types.ListInstanceProfileTagsResponse, AWSError>;
  /**
   * Lists the instance profiles that have the specified path prefix. If there are none, the operation returns an empty list. For more information about instance profiles, see Using instance profiles in the IAM User Guide.  IAM resource-listing operations return a subset of the available attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for an instance profile, see GetInstanceProfile.  You can paginate the results using the MaxItems and Marker parameters.
   */
  listInstanceProfiles(params: IAM.Types.ListInstanceProfilesRequest, callback?: (err: AWSError, data: IAM.Types.ListInstanceProfilesResponse) => void): Request<IAM.Types.ListInstanceProfilesResponse, AWSError>;
  /**
   * Lists the instance profiles that have the specified path prefix. If there are none, the operation returns an empty list. For more information about instance profiles, see Using instance profiles in the IAM User Guide.  IAM resource-listing operations return a subset of the available attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for an instance profile, see GetInstanceProfile.  You can paginate the results using the MaxItems and Marker parameters.
   */
  listInstanceProfiles(callback?: (err: AWSError, data: IAM.Types.ListInstanceProfilesResponse) => void): Request<IAM.Types.ListInstanceProfilesResponse, AWSError>;
  /**
   * Lists the instance profiles that have the specified associated IAM role. If there are none, the operation returns an empty list. For more information about instance profiles, go to Using instance profiles in the IAM User Guide. You can paginate the results using the MaxItems and Marker parameters.
   */
  listInstanceProfilesForRole(params: IAM.Types.ListInstanceProfilesForRoleRequest, callback?: (err: AWSError, data: IAM.Types.ListInstanceProfilesForRoleResponse) => void): Request<IAM.Types.ListInstanceProfilesForRoleResponse, AWSError>;
  /**
   * Lists the instance profiles that have the specified associated IAM role. If there are none, the operation returns an empty list. For more information about instance profiles, go to Using instance profiles in the IAM User Guide. You can paginate the results using the MaxItems and Marker parameters.
   */
  listInstanceProfilesForRole(callback?: (err: AWSError, data: IAM.Types.ListInstanceProfilesForRoleResponse) => void): Request<IAM.Types.ListInstanceProfilesForRoleResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified IAM virtual multi-factor authentication (MFA) device. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  listMFADeviceTags(params: IAM.Types.ListMFADeviceTagsRequest, callback?: (err: AWSError, data: IAM.Types.ListMFADeviceTagsResponse) => void): Request<IAM.Types.ListMFADeviceTagsResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified IAM virtual multi-factor authentication (MFA) device. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  listMFADeviceTags(callback?: (err: AWSError, data: IAM.Types.ListMFADeviceTagsResponse) => void): Request<IAM.Types.ListMFADeviceTagsResponse, AWSError>;
  /**
   * Lists the MFA devices for an IAM user. If the request includes a IAM user name, then this operation lists all the MFA devices associated with the specified user. If you do not specify a user name, IAM determines the user name implicitly based on the Amazon Web Services access key ID signing the request for this operation. You can paginate the results using the MaxItems and Marker parameters.
   */
  listMFADevices(params: IAM.Types.ListMFADevicesRequest, callback?: (err: AWSError, data: IAM.Types.ListMFADevicesResponse) => void): Request<IAM.Types.ListMFADevicesResponse, AWSError>;
  /**
   * Lists the MFA devices for an IAM user. If the request includes a IAM user name, then this operation lists all the MFA devices associated with the specified user. If you do not specify a user name, IAM determines the user name implicitly based on the Amazon Web Services access key ID signing the request for this operation. You can paginate the results using the MaxItems and Marker parameters.
   */
  listMFADevices(callback?: (err: AWSError, data: IAM.Types.ListMFADevicesResponse) => void): Request<IAM.Types.ListMFADevicesResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified OpenID Connect (OIDC)-compatible identity provider. The returned list of tags is sorted by tag key. For more information, see About web identity federation. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  listOpenIDConnectProviderTags(params: IAM.Types.ListOpenIDConnectProviderTagsRequest, callback?: (err: AWSError, data: IAM.Types.ListOpenIDConnectProviderTagsResponse) => void): Request<IAM.Types.ListOpenIDConnectProviderTagsResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified OpenID Connect (OIDC)-compatible identity provider. The returned list of tags is sorted by tag key. For more information, see About web identity federation. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  listOpenIDConnectProviderTags(callback?: (err: AWSError, data: IAM.Types.ListOpenIDConnectProviderTagsResponse) => void): Request<IAM.Types.ListOpenIDConnectProviderTagsResponse, AWSError>;
  /**
   * Lists information about the IAM OpenID Connect (OIDC) provider resource objects defined in the Amazon Web Services account.  IAM resource-listing operations return a subset of the available attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for an OIDC provider, see GetOpenIDConnectProvider. 
   */
  listOpenIDConnectProviders(params: IAM.Types.ListOpenIDConnectProvidersRequest, callback?: (err: AWSError, data: IAM.Types.ListOpenIDConnectProvidersResponse) => void): Request<IAM.Types.ListOpenIDConnectProvidersResponse, AWSError>;
  /**
   * Lists information about the IAM OpenID Connect (OIDC) provider resource objects defined in the Amazon Web Services account.  IAM resource-listing operations return a subset of the available attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for an OIDC provider, see GetOpenIDConnectProvider. 
   */
  listOpenIDConnectProviders(callback?: (err: AWSError, data: IAM.Types.ListOpenIDConnectProvidersResponse) => void): Request<IAM.Types.ListOpenIDConnectProvidersResponse, AWSError>;
  /**
   * Lists all the managed policies that are available in your Amazon Web Services account, including your own customer-defined managed policies and all Amazon Web Services managed policies. You can filter the list of policies that is returned using the optional OnlyAttached, Scope, and PathPrefix parameters. For example, to list only the customer managed policies in your Amazon Web Services account, set Scope to Local. To list only Amazon Web Services managed policies, set Scope to AWS. You can paginate the results using the MaxItems and Marker parameters. For more information about managed policies, see Managed policies and inline policies in the IAM User Guide.  IAM resource-listing operations return a subset of the available attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for a customer manged policy, see GetPolicy. 
   */
  listPolicies(params: IAM.Types.ListPoliciesRequest, callback?: (err: AWSError, data: IAM.Types.ListPoliciesResponse) => void): Request<IAM.Types.ListPoliciesResponse, AWSError>;
  /**
   * Lists all the managed policies that are available in your Amazon Web Services account, including your own customer-defined managed policies and all Amazon Web Services managed policies. You can filter the list of policies that is returned using the optional OnlyAttached, Scope, and PathPrefix parameters. For example, to list only the customer managed policies in your Amazon Web Services account, set Scope to Local. To list only Amazon Web Services managed policies, set Scope to AWS. You can paginate the results using the MaxItems and Marker parameters. For more information about managed policies, see Managed policies and inline policies in the IAM User Guide.  IAM resource-listing operations return a subset of the available attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for a customer manged policy, see GetPolicy. 
   */
  listPolicies(callback?: (err: AWSError, data: IAM.Types.ListPoliciesResponse) => void): Request<IAM.Types.ListPoliciesResponse, AWSError>;
  /**
   * Retrieves a list of policies that the IAM identity (user, group, or role) can use to access each specified service.  This operation does not use other policy types when determining whether a resource could access a service. These other policy types include resource-based policies, access control lists, Organizations policies, IAM permissions boundaries, and STS assume role policies. It only applies permissions policy logic. For more about the evaluation of policy types, see Evaluating policies in the IAM User Guide.  The list of policies returned by the operation depends on the ARN of the identity that you provide.    User – The list of policies includes the managed and inline policies that are attached to the user directly. The list also includes any additional managed and inline policies that are attached to the group to which the user belongs.     Group – The list of policies includes only the managed and inline policies that are attached to the group directly. Policies that are attached to the group’s user are not included.    Role – The list of policies includes only the managed and inline policies that are attached to the role.   For each managed policy, this operation returns the ARN and policy name. For each inline policy, it returns the policy name and the entity to which it is attached. Inline policies do not have an ARN. For more information about these policy types, see Managed policies and inline policies in the IAM User Guide. Policies that are attached to users and roles as permissions boundaries are not returned. To view which managed policy is currently used to set the permissions boundary for a user or role, use the GetUser or GetRole operations.
   */
  listPoliciesGrantingServiceAccess(params: IAM.Types.ListPoliciesGrantingServiceAccessRequest, callback?: (err: AWSError, data: IAM.Types.ListPoliciesGrantingServiceAccessResponse) => void): Request<IAM.Types.ListPoliciesGrantingServiceAccessResponse, AWSError>;
  /**
   * Retrieves a list of policies that the IAM identity (user, group, or role) can use to access each specified service.  This operation does not use other policy types when determining whether a resource could access a service. These other policy types include resource-based policies, access control lists, Organizations policies, IAM permissions boundaries, and STS assume role policies. It only applies permissions policy logic. For more about the evaluation of policy types, see Evaluating policies in the IAM User Guide.  The list of policies returned by the operation depends on the ARN of the identity that you provide.    User – The list of policies includes the managed and inline policies that are attached to the user directly. The list also includes any additional managed and inline policies that are attached to the group to which the user belongs.     Group – The list of policies includes only the managed and inline policies that are attached to the group directly. Policies that are attached to the group’s user are not included.    Role – The list of policies includes only the managed and inline policies that are attached to the role.   For each managed policy, this operation returns the ARN and policy name. For each inline policy, it returns the policy name and the entity to which it is attached. Inline policies do not have an ARN. For more information about these policy types, see Managed policies and inline policies in the IAM User Guide. Policies that are attached to users and roles as permissions boundaries are not returned. To view which managed policy is currently used to set the permissions boundary for a user or role, use the GetUser or GetRole operations.
   */
  listPoliciesGrantingServiceAccess(callback?: (err: AWSError, data: IAM.Types.ListPoliciesGrantingServiceAccessResponse) => void): Request<IAM.Types.ListPoliciesGrantingServiceAccessResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified IAM customer managed policy. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  listPolicyTags(params: IAM.Types.ListPolicyTagsRequest, callback?: (err: AWSError, data: IAM.Types.ListPolicyTagsResponse) => void): Request<IAM.Types.ListPolicyTagsResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified IAM customer managed policy. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  listPolicyTags(callback?: (err: AWSError, data: IAM.Types.ListPolicyTagsResponse) => void): Request<IAM.Types.ListPolicyTagsResponse, AWSError>;
  /**
   * Lists information about the versions of the specified managed policy, including the version that is currently set as the policy's default version. For more information about managed policies, see Managed policies and inline policies in the IAM User Guide.
   */
  listPolicyVersions(params: IAM.Types.ListPolicyVersionsRequest, callback?: (err: AWSError, data: IAM.Types.ListPolicyVersionsResponse) => void): Request<IAM.Types.ListPolicyVersionsResponse, AWSError>;
  /**
   * Lists information about the versions of the specified managed policy, including the version that is currently set as the policy's default version. For more information about managed policies, see Managed policies and inline policies in the IAM User Guide.
   */
  listPolicyVersions(callback?: (err: AWSError, data: IAM.Types.ListPolicyVersionsResponse) => void): Request<IAM.Types.ListPolicyVersionsResponse, AWSError>;
  /**
   * Lists the names of the inline policies that are embedded in the specified IAM role. An IAM role can also have managed policies attached to it. To list the managed policies that are attached to a role, use ListAttachedRolePolicies. For more information about policies, see Managed policies and inline policies in the IAM User Guide. You can paginate the results using the MaxItems and Marker parameters. If there are no inline policies embedded with the specified role, the operation returns an empty list.
   */
  listRolePolicies(params: IAM.Types.ListRolePoliciesRequest, callback?: (err: AWSError, data: IAM.Types.ListRolePoliciesResponse) => void): Request<IAM.Types.ListRolePoliciesResponse, AWSError>;
  /**
   * Lists the names of the inline policies that are embedded in the specified IAM role. An IAM role can also have managed policies attached to it. To list the managed policies that are attached to a role, use ListAttachedRolePolicies. For more information about policies, see Managed policies and inline policies in the IAM User Guide. You can paginate the results using the MaxItems and Marker parameters. If there are no inline policies embedded with the specified role, the operation returns an empty list.
   */
  listRolePolicies(callback?: (err: AWSError, data: IAM.Types.ListRolePoliciesResponse) => void): Request<IAM.Types.ListRolePoliciesResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified role. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  listRoleTags(params: IAM.Types.ListRoleTagsRequest, callback?: (err: AWSError, data: IAM.Types.ListRoleTagsResponse) => void): Request<IAM.Types.ListRoleTagsResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified role. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  listRoleTags(callback?: (err: AWSError, data: IAM.Types.ListRoleTagsResponse) => void): Request<IAM.Types.ListRoleTagsResponse, AWSError>;
  /**
   * Lists the IAM roles that have the specified path prefix. If there are none, the operation returns an empty list. For more information about roles, see IAM roles in the IAM User Guide.  IAM resource-listing operations return a subset of the available attributes for the resource. This operation does not return the following attributes, even though they are an attribute of the returned object:   PermissionsBoundary   RoleLastUsed   Tags   To view all of the information for a role, see GetRole.  You can paginate the results using the MaxItems and Marker parameters.
   */
  listRoles(params: IAM.Types.ListRolesRequest, callback?: (err: AWSError, data: IAM.Types.ListRolesResponse) => void): Request<IAM.Types.ListRolesResponse, AWSError>;
  /**
   * Lists the IAM roles that have the specified path prefix. If there are none, the operation returns an empty list. For more information about roles, see IAM roles in the IAM User Guide.  IAM resource-listing operations return a subset of the available attributes for the resource. This operation does not return the following attributes, even though they are an attribute of the returned object:   PermissionsBoundary   RoleLastUsed   Tags   To view all of the information for a role, see GetRole.  You can paginate the results using the MaxItems and Marker parameters.
   */
  listRoles(callback?: (err: AWSError, data: IAM.Types.ListRolesResponse) => void): Request<IAM.Types.ListRolesResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified Security Assertion Markup Language (SAML) identity provider. The returned list of tags is sorted by tag key. For more information, see About SAML 2.0-based federation. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  listSAMLProviderTags(params: IAM.Types.ListSAMLProviderTagsRequest, callback?: (err: AWSError, data: IAM.Types.ListSAMLProviderTagsResponse) => void): Request<IAM.Types.ListSAMLProviderTagsResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified Security Assertion Markup Language (SAML) identity provider. The returned list of tags is sorted by tag key. For more information, see About SAML 2.0-based federation. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  listSAMLProviderTags(callback?: (err: AWSError, data: IAM.Types.ListSAMLProviderTagsResponse) => void): Request<IAM.Types.ListSAMLProviderTagsResponse, AWSError>;
  /**
   * Lists the SAML provider resource objects defined in IAM in the account. IAM resource-listing operations return a subset of the available attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for a SAML provider, see GetSAMLProvider.   This operation requires Signature Version 4. 
   */
  listSAMLProviders(params: IAM.Types.ListSAMLProvidersRequest, callback?: (err: AWSError, data: IAM.Types.ListSAMLProvidersResponse) => void): Request<IAM.Types.ListSAMLProvidersResponse, AWSError>;
  /**
   * Lists the SAML provider resource objects defined in IAM in the account. IAM resource-listing operations return a subset of the available attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for a SAML provider, see GetSAMLProvider.   This operation requires Signature Version 4. 
   */
  listSAMLProviders(callback?: (err: AWSError, data: IAM.Types.ListSAMLProvidersResponse) => void): Request<IAM.Types.ListSAMLProvidersResponse, AWSError>;
  /**
   * Returns information about the SSH public keys associated with the specified IAM user. If none exists, the operation returns an empty list. The SSH public keys returned by this operation are used only for authenticating the IAM user to an CodeCommit repository. For more information about using SSH keys to authenticate to an CodeCommit repository, see Set up CodeCommit for SSH connections in the CodeCommit User Guide. Although each user is limited to a small number of keys, you can still paginate the results using the MaxItems and Marker parameters.
   */
  listSSHPublicKeys(params: IAM.Types.ListSSHPublicKeysRequest, callback?: (err: AWSError, data: IAM.Types.ListSSHPublicKeysResponse) => void): Request<IAM.Types.ListSSHPublicKeysResponse, AWSError>;
  /**
   * Returns information about the SSH public keys associated with the specified IAM user. If none exists, the operation returns an empty list. The SSH public keys returned by this operation are used only for authenticating the IAM user to an CodeCommit repository. For more information about using SSH keys to authenticate to an CodeCommit repository, see Set up CodeCommit for SSH connections in the CodeCommit User Guide. Although each user is limited to a small number of keys, you can still paginate the results using the MaxItems and Marker parameters.
   */
  listSSHPublicKeys(callback?: (err: AWSError, data: IAM.Types.ListSSHPublicKeysResponse) => void): Request<IAM.Types.ListSSHPublicKeysResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified IAM server certificate. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.  For certificates in a Region supported by Certificate Manager (ACM), we recommend that you don't use IAM server certificates. Instead, use ACM to provision, manage, and deploy your server certificates. For more information about IAM server certificates, Working with server certificates in the IAM User Guide. 
   */
  listServerCertificateTags(params: IAM.Types.ListServerCertificateTagsRequest, callback?: (err: AWSError, data: IAM.Types.ListServerCertificateTagsResponse) => void): Request<IAM.Types.ListServerCertificateTagsResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified IAM server certificate. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.  For certificates in a Region supported by Certificate Manager (ACM), we recommend that you don't use IAM server certificates. Instead, use ACM to provision, manage, and deploy your server certificates. For more information about IAM server certificates, Working with server certificates in the IAM User Guide. 
   */
  listServerCertificateTags(callback?: (err: AWSError, data: IAM.Types.ListServerCertificateTagsResponse) => void): Request<IAM.Types.ListServerCertificateTagsResponse, AWSError>;
  /**
   * Lists the server certificates stored in IAM that have the specified path prefix. If none exist, the operation returns an empty list.  You can paginate the results using the MaxItems and Marker parameters. For more information about working with server certificates, see Working with server certificates in the IAM User Guide. This topic also includes a list of Amazon Web Services services that can use the server certificates that you manage with IAM.  IAM resource-listing operations return a subset of the available attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for a servercertificate, see GetServerCertificate. 
   */
  listServerCertificates(params: IAM.Types.ListServerCertificatesRequest, callback?: (err: AWSError, data: IAM.Types.ListServerCertificatesResponse) => void): Request<IAM.Types.ListServerCertificatesResponse, AWSError>;
  /**
   * Lists the server certificates stored in IAM that have the specified path prefix. If none exist, the operation returns an empty list.  You can paginate the results using the MaxItems and Marker parameters. For more information about working with server certificates, see Working with server certificates in the IAM User Guide. This topic also includes a list of Amazon Web Services services that can use the server certificates that you manage with IAM.  IAM resource-listing operations return a subset of the available attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for a servercertificate, see GetServerCertificate. 
   */
  listServerCertificates(callback?: (err: AWSError, data: IAM.Types.ListServerCertificatesResponse) => void): Request<IAM.Types.ListServerCertificatesResponse, AWSError>;
  /**
   * Returns information about the service-specific credentials associated with the specified IAM user. If none exists, the operation returns an empty list. The service-specific credentials returned by this operation are used only for authenticating the IAM user to a specific service. For more information about using service-specific credentials to authenticate to an Amazon Web Services service, see Set up service-specific credentials in the CodeCommit User Guide.
   */
  listServiceSpecificCredentials(params: IAM.Types.ListServiceSpecificCredentialsRequest, callback?: (err: AWSError, data: IAM.Types.ListServiceSpecificCredentialsResponse) => void): Request<IAM.Types.ListServiceSpecificCredentialsResponse, AWSError>;
  /**
   * Returns information about the service-specific credentials associated with the specified IAM user. If none exists, the operation returns an empty list. The service-specific credentials returned by this operation are used only for authenticating the IAM user to a specific service. For more information about using service-specific credentials to authenticate to an Amazon Web Services service, see Set up service-specific credentials in the CodeCommit User Guide.
   */
  listServiceSpecificCredentials(callback?: (err: AWSError, data: IAM.Types.ListServiceSpecificCredentialsResponse) => void): Request<IAM.Types.ListServiceSpecificCredentialsResponse, AWSError>;
  /**
   * Returns information about the signing certificates associated with the specified IAM user. If none exists, the operation returns an empty list. Although each user is limited to a small number of signing certificates, you can still paginate the results using the MaxItems and Marker parameters. If the UserName field is not specified, the user name is determined implicitly based on the Amazon Web Services access key ID used to sign the request for this operation. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated users.
   */
  listSigningCertificates(params: IAM.Types.ListSigningCertificatesRequest, callback?: (err: AWSError, data: IAM.Types.ListSigningCertificatesResponse) => void): Request<IAM.Types.ListSigningCertificatesResponse, AWSError>;
  /**
   * Returns information about the signing certificates associated with the specified IAM user. If none exists, the operation returns an empty list. Although each user is limited to a small number of signing certificates, you can still paginate the results using the MaxItems and Marker parameters. If the UserName field is not specified, the user name is determined implicitly based on the Amazon Web Services access key ID used to sign the request for this operation. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated users.
   */
  listSigningCertificates(callback?: (err: AWSError, data: IAM.Types.ListSigningCertificatesResponse) => void): Request<IAM.Types.ListSigningCertificatesResponse, AWSError>;
  /**
   * Lists the names of the inline policies embedded in the specified IAM user. An IAM user can also have managed policies attached to it. To list the managed policies that are attached to a user, use ListAttachedUserPolicies. For more information about policies, see Managed policies and inline policies in the IAM User Guide. You can paginate the results using the MaxItems and Marker parameters. If there are no inline policies embedded with the specified user, the operation returns an empty list.
   */
  listUserPolicies(params: IAM.Types.ListUserPoliciesRequest, callback?: (err: AWSError, data: IAM.Types.ListUserPoliciesResponse) => void): Request<IAM.Types.ListUserPoliciesResponse, AWSError>;
  /**
   * Lists the names of the inline policies embedded in the specified IAM user. An IAM user can also have managed policies attached to it. To list the managed policies that are attached to a user, use ListAttachedUserPolicies. For more information about policies, see Managed policies and inline policies in the IAM User Guide. You can paginate the results using the MaxItems and Marker parameters. If there are no inline policies embedded with the specified user, the operation returns an empty list.
   */
  listUserPolicies(callback?: (err: AWSError, data: IAM.Types.ListUserPoliciesResponse) => void): Request<IAM.Types.ListUserPoliciesResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified IAM user. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  listUserTags(params: IAM.Types.ListUserTagsRequest, callback?: (err: AWSError, data: IAM.Types.ListUserTagsResponse) => void): Request<IAM.Types.ListUserTagsResponse, AWSError>;
  /**
   * Lists the tags that are attached to the specified IAM user. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  listUserTags(callback?: (err: AWSError, data: IAM.Types.ListUserTagsResponse) => void): Request<IAM.Types.ListUserTagsResponse, AWSError>;
  /**
   * Lists the IAM users that have the specified path prefix. If no path prefix is specified, the operation returns all users in the Amazon Web Services account. If there are none, the operation returns an empty list.  IAM resource-listing operations return a subset of the available attributes for the resource. This operation does not return the following attributes, even though they are an attribute of the returned object:   PermissionsBoundary   Tags   To view all of the information for a user, see GetUser.  You can paginate the results using the MaxItems and Marker parameters.
   */
  listUsers(params: IAM.Types.ListUsersRequest, callback?: (err: AWSError, data: IAM.Types.ListUsersResponse) => void): Request<IAM.Types.ListUsersResponse, AWSError>;
  /**
   * Lists the IAM users that have the specified path prefix. If no path prefix is specified, the operation returns all users in the Amazon Web Services account. If there are none, the operation returns an empty list.  IAM resource-listing operations return a subset of the available attributes for the resource. This operation does not return the following attributes, even though they are an attribute of the returned object:   PermissionsBoundary   Tags   To view all of the information for a user, see GetUser.  You can paginate the results using the MaxItems and Marker parameters.
   */
  listUsers(callback?: (err: AWSError, data: IAM.Types.ListUsersResponse) => void): Request<IAM.Types.ListUsersResponse, AWSError>;
  /**
   * Lists the virtual MFA devices defined in the Amazon Web Services account by assignment status. If you do not specify an assignment status, the operation returns a list of all virtual MFA devices. Assignment status can be Assigned, Unassigned, or Any.  IAM resource-listing operations return a subset of the available attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view tag information for a virtual MFA device, see ListMFADeviceTags.  You can paginate the results using the MaxItems and Marker parameters.
   */
  listVirtualMFADevices(params: IAM.Types.ListVirtualMFADevicesRequest, callback?: (err: AWSError, data: IAM.Types.ListVirtualMFADevicesResponse) => void): Request<IAM.Types.ListVirtualMFADevicesResponse, AWSError>;
  /**
   * Lists the virtual MFA devices defined in the Amazon Web Services account by assignment status. If you do not specify an assignment status, the operation returns a list of all virtual MFA devices. Assignment status can be Assigned, Unassigned, or Any.  IAM resource-listing operations return a subset of the available attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view tag information for a virtual MFA device, see ListMFADeviceTags.  You can paginate the results using the MaxItems and Marker parameters.
   */
  listVirtualMFADevices(callback?: (err: AWSError, data: IAM.Types.ListVirtualMFADevicesResponse) => void): Request<IAM.Types.ListVirtualMFADevicesResponse, AWSError>;
  /**
   * Adds or updates an inline policy document that is embedded in the specified IAM group. A user can also have managed policies attached to it. To attach a managed policy to a group, use  AttachGroupPolicy . To create a new managed policy, use  CreatePolicy . For information about policies, see Managed policies and inline policies in the IAM User Guide. For information about the maximum number of inline policies that you can embed in a group, see IAM and STS quotas in the IAM User Guide.  Because policy documents can be large, you should use POST rather than GET when calling PutGroupPolicy. For general information about using the Query API with IAM, see Making query requests in the IAM User Guide. 
   */
  putGroupPolicy(params: IAM.Types.PutGroupPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates an inline policy document that is embedded in the specified IAM group. A user can also have managed policies attached to it. To attach a managed policy to a group, use  AttachGroupPolicy . To create a new managed policy, use  CreatePolicy . For information about policies, see Managed policies and inline policies in the IAM User Guide. For information about the maximum number of inline policies that you can embed in a group, see IAM and STS quotas in the IAM User Guide.  Because policy documents can be large, you should use POST rather than GET when calling PutGroupPolicy. For general information about using the Query API with IAM, see Making query requests in the IAM User Guide. 
   */
  putGroupPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates the policy that is specified as the IAM role's permissions boundary. You can use an Amazon Web Services managed policy or a customer managed policy to set the boundary for a role. Use the boundary to control the maximum permissions that the role can have. Setting a permissions boundary is an advanced feature that can affect the permissions for the role. You cannot set the boundary for a service-linked role.  Policies used as permissions boundaries do not provide permissions. You must also attach a permissions policy to the role. To learn how the effective permissions for a role are evaluated, see IAM JSON policy evaluation logic in the IAM User Guide.  
   */
  putRolePermissionsBoundary(params: IAM.Types.PutRolePermissionsBoundaryRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates the policy that is specified as the IAM role's permissions boundary. You can use an Amazon Web Services managed policy or a customer managed policy to set the boundary for a role. Use the boundary to control the maximum permissions that the role can have. Setting a permissions boundary is an advanced feature that can affect the permissions for the role. You cannot set the boundary for a service-linked role.  Policies used as permissions boundaries do not provide permissions. You must also attach a permissions policy to the role. To learn how the effective permissions for a role are evaluated, see IAM JSON policy evaluation logic in the IAM User Guide.  
   */
  putRolePermissionsBoundary(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates an inline policy document that is embedded in the specified IAM role. When you embed an inline policy in a role, the inline policy is used as part of the role's access (permissions) policy. The role's trust policy is created at the same time as the role, using  CreateRole . You can update a role's trust policy using  UpdateAssumeRolePolicy . For more information about roles, see IAM roles in the IAM User Guide. A role can also have a managed policy attached to it. To attach a managed policy to a role, use  AttachRolePolicy . To create a new managed policy, use  CreatePolicy . For information about policies, see Managed policies and inline policies in the IAM User Guide. For information about the maximum number of inline policies that you can embed with a role, see IAM and STS quotas in the IAM User Guide.  Because policy documents can be large, you should use POST rather than GET when calling PutRolePolicy. For general information about using the Query API with IAM, see Making query requests in the IAM User Guide. 
   */
  putRolePolicy(params: IAM.Types.PutRolePolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates an inline policy document that is embedded in the specified IAM role. When you embed an inline policy in a role, the inline policy is used as part of the role's access (permissions) policy. The role's trust policy is created at the same time as the role, using  CreateRole . You can update a role's trust policy using  UpdateAssumeRolePolicy . For more information about roles, see IAM roles in the IAM User Guide. A role can also have a managed policy attached to it. To attach a managed policy to a role, use  AttachRolePolicy . To create a new managed policy, use  CreatePolicy . For information about policies, see Managed policies and inline policies in the IAM User Guide. For information about the maximum number of inline policies that you can embed with a role, see IAM and STS quotas in the IAM User Guide.  Because policy documents can be large, you should use POST rather than GET when calling PutRolePolicy. For general information about using the Query API with IAM, see Making query requests in the IAM User Guide. 
   */
  putRolePolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates the policy that is specified as the IAM user's permissions boundary. You can use an Amazon Web Services managed policy or a customer managed policy to set the boundary for a user. Use the boundary to control the maximum permissions that the user can have. Setting a permissions boundary is an advanced feature that can affect the permissions for the user.  Policies that are used as permissions boundaries do not provide permissions. You must also attach a permissions policy to the user. To learn how the effective permissions for a user are evaluated, see IAM JSON policy evaluation logic in the IAM User Guide.  
   */
  putUserPermissionsBoundary(params: IAM.Types.PutUserPermissionsBoundaryRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates the policy that is specified as the IAM user's permissions boundary. You can use an Amazon Web Services managed policy or a customer managed policy to set the boundary for a user. Use the boundary to control the maximum permissions that the user can have. Setting a permissions boundary is an advanced feature that can affect the permissions for the user.  Policies that are used as permissions boundaries do not provide permissions. You must also attach a permissions policy to the user. To learn how the effective permissions for a user are evaluated, see IAM JSON policy evaluation logic in the IAM User Guide.  
   */
  putUserPermissionsBoundary(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates an inline policy document that is embedded in the specified IAM user. An IAM user can also have a managed policy attached to it. To attach a managed policy to a user, use  AttachUserPolicy . To create a new managed policy, use  CreatePolicy . For information about policies, see Managed policies and inline policies in the IAM User Guide. For information about the maximum number of inline policies that you can embed in a user, see IAM and STS quotas in the IAM User Guide.  Because policy documents can be large, you should use POST rather than GET when calling PutUserPolicy. For general information about using the Query API with IAM, see Making query requests in the IAM User Guide. 
   */
  putUserPolicy(params: IAM.Types.PutUserPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates an inline policy document that is embedded in the specified IAM user. An IAM user can also have a managed policy attached to it. To attach a managed policy to a user, use  AttachUserPolicy . To create a new managed policy, use  CreatePolicy . For information about policies, see Managed policies and inline policies in the IAM User Guide. For information about the maximum number of inline policies that you can embed in a user, see IAM and STS quotas in the IAM User Guide.  Because policy documents can be large, you should use POST rather than GET when calling PutUserPolicy. For general information about using the Query API with IAM, see Making query requests in the IAM User Guide. 
   */
  putUserPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified client ID (also known as audience) from the list of client IDs registered for the specified IAM OpenID Connect (OIDC) provider resource object. This operation is idempotent; it does not fail or return an error if you try to remove a client ID that does not exist.
   */
  removeClientIDFromOpenIDConnectProvider(params: IAM.Types.RemoveClientIDFromOpenIDConnectProviderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified client ID (also known as audience) from the list of client IDs registered for the specified IAM OpenID Connect (OIDC) provider resource object. This operation is idempotent; it does not fail or return an error if you try to remove a client ID that does not exist.
   */
  removeClientIDFromOpenIDConnectProvider(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified IAM role from the specified EC2 instance profile.  Make sure that you do not have any Amazon EC2 instances running with the role you are about to remove from the instance profile. Removing a role from an instance profile that is associated with a running instance might break any applications running on the instance.   For more information about roles, see IAM roles in the IAM User Guide. For more information about instance profiles, see Using instance profiles in the IAM User Guide.
   */
  removeRoleFromInstanceProfile(params: IAM.Types.RemoveRoleFromInstanceProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified IAM role from the specified EC2 instance profile.  Make sure that you do not have any Amazon EC2 instances running with the role you are about to remove from the instance profile. Removing a role from an instance profile that is associated with a running instance might break any applications running on the instance.   For more information about roles, see IAM roles in the IAM User Guide. For more information about instance profiles, see Using instance profiles in the IAM User Guide.
   */
  removeRoleFromInstanceProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified user from the specified group.
   */
  removeUserFromGroup(params: IAM.Types.RemoveUserFromGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified user from the specified group.
   */
  removeUserFromGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Resets the password for a service-specific credential. The new password is Amazon Web Services generated and cryptographically strong. It cannot be configured by the user. Resetting the password immediately invalidates the previous password associated with this user.
   */
  resetServiceSpecificCredential(params: IAM.Types.ResetServiceSpecificCredentialRequest, callback?: (err: AWSError, data: IAM.Types.ResetServiceSpecificCredentialResponse) => void): Request<IAM.Types.ResetServiceSpecificCredentialResponse, AWSError>;
  /**
   * Resets the password for a service-specific credential. The new password is Amazon Web Services generated and cryptographically strong. It cannot be configured by the user. Resetting the password immediately invalidates the previous password associated with this user.
   */
  resetServiceSpecificCredential(callback?: (err: AWSError, data: IAM.Types.ResetServiceSpecificCredentialResponse) => void): Request<IAM.Types.ResetServiceSpecificCredentialResponse, AWSError>;
  /**
   * Synchronizes the specified MFA device with its IAM resource object on the Amazon Web Services servers. For more information about creating and working with virtual MFA devices, see Using a virtual MFA device in the IAM User Guide.
   */
  resyncMFADevice(params: IAM.Types.ResyncMFADeviceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Synchronizes the specified MFA device with its IAM resource object on the Amazon Web Services servers. For more information about creating and working with virtual MFA devices, see Using a virtual MFA device in the IAM User Guide.
   */
  resyncMFADevice(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the specified version of the specified policy as the policy's default (operative) version. This operation affects all users, groups, and roles that the policy is attached to. To list the users, groups, and roles that the policy is attached to, use ListEntitiesForPolicy. For information about managed policies, see Managed policies and inline policies in the IAM User Guide.
   */
  setDefaultPolicyVersion(params: IAM.Types.SetDefaultPolicyVersionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the specified version of the specified policy as the policy's default (operative) version. This operation affects all users, groups, and roles that the policy is attached to. To list the users, groups, and roles that the policy is attached to, use ListEntitiesForPolicy. For information about managed policies, see Managed policies and inline policies in the IAM User Guide.
   */
  setDefaultPolicyVersion(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the specified version of the global endpoint token as the token version used for the Amazon Web Services account. By default, Security Token Service (STS) is available as a global service, and all STS requests go to a single endpoint at https://sts.amazonaws.com. Amazon Web Services recommends using Regional STS endpoints to reduce latency, build in redundancy, and increase session token availability. For information about Regional endpoints for STS, see Security Token Service endpoints and quotas in the Amazon Web Services General Reference. If you make an STS call to the global endpoint, the resulting session tokens might be valid in some Regions but not others. It depends on the version that is set in this operation. Version 1 tokens are valid only in Amazon Web Services Regions that are available by default. These tokens do not work in manually enabled Regions, such as Asia Pacific (Hong Kong). Version 2 tokens are valid in all Regions. However, version 2 tokens are longer and might affect systems where you temporarily store tokens. For information, see Activating and deactivating STS in an Amazon Web Services Region in the IAM User Guide. To view the current session token version, see the GlobalEndpointTokenVersion entry in the response of the GetAccountSummary operation.
   */
  setSecurityTokenServicePreferences(params: IAM.Types.SetSecurityTokenServicePreferencesRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the specified version of the global endpoint token as the token version used for the Amazon Web Services account. By default, Security Token Service (STS) is available as a global service, and all STS requests go to a single endpoint at https://sts.amazonaws.com. Amazon Web Services recommends using Regional STS endpoints to reduce latency, build in redundancy, and increase session token availability. For information about Regional endpoints for STS, see Security Token Service endpoints and quotas in the Amazon Web Services General Reference. If you make an STS call to the global endpoint, the resulting session tokens might be valid in some Regions but not others. It depends on the version that is set in this operation. Version 1 tokens are valid only in Amazon Web Services Regions that are available by default. These tokens do not work in manually enabled Regions, such as Asia Pacific (Hong Kong). Version 2 tokens are valid in all Regions. However, version 2 tokens are longer and might affect systems where you temporarily store tokens. For information, see Activating and deactivating STS in an Amazon Web Services Region in the IAM User Guide. To view the current session token version, see the GlobalEndpointTokenVersion entry in the response of the GetAccountSummary operation.
   */
  setSecurityTokenServicePreferences(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Simulate how a set of IAM policies and optionally a resource-based policy works with a list of API operations and Amazon Web Services resources to determine the policies' effective permissions. The policies are provided as strings. The simulation does not perform the API operations; it only checks the authorization to determine if the simulated policies allow or deny the operations. You can simulate resources that don't exist in your account. If you want to simulate existing policies that are attached to an IAM user, group, or role, use SimulatePrincipalPolicy instead. Context keys are variables that are maintained by Amazon Web Services and its services and which provide details about the context of an API query request. You can use the Condition element of an IAM policy to evaluate context keys. To get the list of context keys that the policies require for correct simulation, use GetContextKeysForCustomPolicy. If the output is long, you can use MaxItems and Marker parameters to paginate the results.  The IAM policy simulator evaluates statements in the identity-based policy and the inputs that you provide during simulation. The policy simulator results can differ from your live Amazon Web Services environment. We recommend that you check your policies against your live Amazon Web Services environment after testing using the policy simulator to confirm that you have the desired results. For more information about using the policy simulator, see Testing IAM policies with the IAM policy simulator in the IAM User Guide. 
   */
  simulateCustomPolicy(params: IAM.Types.SimulateCustomPolicyRequest, callback?: (err: AWSError, data: IAM.Types.SimulatePolicyResponse) => void): Request<IAM.Types.SimulatePolicyResponse, AWSError>;
  /**
   * Simulate how a set of IAM policies and optionally a resource-based policy works with a list of API operations and Amazon Web Services resources to determine the policies' effective permissions. The policies are provided as strings. The simulation does not perform the API operations; it only checks the authorization to determine if the simulated policies allow or deny the operations. You can simulate resources that don't exist in your account. If you want to simulate existing policies that are attached to an IAM user, group, or role, use SimulatePrincipalPolicy instead. Context keys are variables that are maintained by Amazon Web Services and its services and which provide details about the context of an API query request. You can use the Condition element of an IAM policy to evaluate context keys. To get the list of context keys that the policies require for correct simulation, use GetContextKeysForCustomPolicy. If the output is long, you can use MaxItems and Marker parameters to paginate the results.  The IAM policy simulator evaluates statements in the identity-based policy and the inputs that you provide during simulation. The policy simulator results can differ from your live Amazon Web Services environment. We recommend that you check your policies against your live Amazon Web Services environment after testing using the policy simulator to confirm that you have the desired results. For more information about using the policy simulator, see Testing IAM policies with the IAM policy simulator in the IAM User Guide. 
   */
  simulateCustomPolicy(callback?: (err: AWSError, data: IAM.Types.SimulatePolicyResponse) => void): Request<IAM.Types.SimulatePolicyResponse, AWSError>;
  /**
   * Simulate how a set of IAM policies attached to an IAM entity works with a list of API operations and Amazon Web Services resources to determine the policies' effective permissions. The entity can be an IAM user, group, or role. If you specify a user, then the simulation also includes all of the policies that are attached to groups that the user belongs to. You can simulate resources that don't exist in your account. You can optionally include a list of one or more additional policies specified as strings to include in the simulation. If you want to simulate only policies specified as strings, use SimulateCustomPolicy instead. You can also optionally include one resource-based policy to be evaluated with each of the resources included in the simulation for IAM users only. The simulation does not perform the API operations; it only checks the authorization to determine if the simulated policies allow or deny the operations.  Note: This operation discloses information about the permissions granted to other users. If you do not want users to see other user's permissions, then consider allowing them to use SimulateCustomPolicy instead. Context keys are variables maintained by Amazon Web Services and its services that provide details about the context of an API query request. You can use the Condition element of an IAM policy to evaluate context keys. To get the list of context keys that the policies require for correct simulation, use GetContextKeysForPrincipalPolicy. If the output is long, you can use the MaxItems and Marker parameters to paginate the results.  The IAM policy simulator evaluates statements in the identity-based policy and the inputs that you provide during simulation. The policy simulator results can differ from your live Amazon Web Services environment. We recommend that you check your policies against your live Amazon Web Services environment after testing using the policy simulator to confirm that you have the desired results. For more information about using the policy simulator, see Testing IAM policies with the IAM policy simulator in the IAM User Guide. 
   */
  simulatePrincipalPolicy(params: IAM.Types.SimulatePrincipalPolicyRequest, callback?: (err: AWSError, data: IAM.Types.SimulatePolicyResponse) => void): Request<IAM.Types.SimulatePolicyResponse, AWSError>;
  /**
   * Simulate how a set of IAM policies attached to an IAM entity works with a list of API operations and Amazon Web Services resources to determine the policies' effective permissions. The entity can be an IAM user, group, or role. If you specify a user, then the simulation also includes all of the policies that are attached to groups that the user belongs to. You can simulate resources that don't exist in your account. You can optionally include a list of one or more additional policies specified as strings to include in the simulation. If you want to simulate only policies specified as strings, use SimulateCustomPolicy instead. You can also optionally include one resource-based policy to be evaluated with each of the resources included in the simulation for IAM users only. The simulation does not perform the API operations; it only checks the authorization to determine if the simulated policies allow or deny the operations.  Note: This operation discloses information about the permissions granted to other users. If you do not want users to see other user's permissions, then consider allowing them to use SimulateCustomPolicy instead. Context keys are variables maintained by Amazon Web Services and its services that provide details about the context of an API query request. You can use the Condition element of an IAM policy to evaluate context keys. To get the list of context keys that the policies require for correct simulation, use GetContextKeysForPrincipalPolicy. If the output is long, you can use the MaxItems and Marker parameters to paginate the results.  The IAM policy simulator evaluates statements in the identity-based policy and the inputs that you provide during simulation. The policy simulator results can differ from your live Amazon Web Services environment. We recommend that you check your policies against your live Amazon Web Services environment after testing using the policy simulator to confirm that you have the desired results. For more information about using the policy simulator, see Testing IAM policies with the IAM policy simulator in the IAM User Guide. 
   */
  simulatePrincipalPolicy(callback?: (err: AWSError, data: IAM.Types.SimulatePolicyResponse) => void): Request<IAM.Types.SimulatePolicyResponse, AWSError>;
  /**
   * Adds one or more tags to an IAM instance profile. If a tag with the same key name already exists, then that tag is overwritten with the new value. Each tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM user-based and resource-based policies. You can use tags to restrict access to only an IAM instance profile that has a specified tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.   
   */
  tagInstanceProfile(params: IAM.Types.TagInstanceProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to an IAM instance profile. If a tag with the same key name already exists, then that tag is overwritten with the new value. Each tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM user-based and resource-based policies. You can use tags to restrict access to only an IAM instance profile that has a specified tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.   
   */
  tagInstanceProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to an IAM virtual multi-factor authentication (MFA) device. If a tag with the same key name already exists, then that tag is overwritten with the new value. A tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM user-based and resource-based policies. You can use tags to restrict access to only an IAM virtual MFA device that has a specified tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.   
   */
  tagMFADevice(params: IAM.Types.TagMFADeviceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to an IAM virtual multi-factor authentication (MFA) device. If a tag with the same key name already exists, then that tag is overwritten with the new value. A tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM user-based and resource-based policies. You can use tags to restrict access to only an IAM virtual MFA device that has a specified tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.   
   */
  tagMFADevice(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to an OpenID Connect (OIDC)-compatible identity provider. For more information about these providers, see About web identity federation. If a tag with the same key name already exists, then that tag is overwritten with the new value. A tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM identity-based and resource-based policies. You can use tags to restrict access to only an OIDC provider that has a specified tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.   
   */
  tagOpenIDConnectProvider(params: IAM.Types.TagOpenIDConnectProviderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to an OpenID Connect (OIDC)-compatible identity provider. For more information about these providers, see About web identity federation. If a tag with the same key name already exists, then that tag is overwritten with the new value. A tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM identity-based and resource-based policies. You can use tags to restrict access to only an OIDC provider that has a specified tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.   
   */
  tagOpenIDConnectProvider(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to an IAM customer managed policy. If a tag with the same key name already exists, then that tag is overwritten with the new value. A tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM user-based and resource-based policies. You can use tags to restrict access to only an IAM customer managed policy that has a specified tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.   
   */
  tagPolicy(params: IAM.Types.TagPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to an IAM customer managed policy. If a tag with the same key name already exists, then that tag is overwritten with the new value. A tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM user-based and resource-based policies. You can use tags to restrict access to only an IAM customer managed policy that has a specified tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.   
   */
  tagPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to an IAM role. The role can be a regular role or a service-linked role. If a tag with the same key name already exists, then that tag is overwritten with the new value. A tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM user-based and resource-based policies. You can use tags to restrict access to only an IAM role that has a specified tag attached. You can also restrict access to only those resources that have a certain tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.    Cost allocation - Use tags to help track which individuals and teams are using which Amazon Web Services resources.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.    For more information about tagging, see Tagging IAM identities in the IAM User Guide.
   */
  tagRole(params: IAM.Types.TagRoleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to an IAM role. The role can be a regular role or a service-linked role. If a tag with the same key name already exists, then that tag is overwritten with the new value. A tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM user-based and resource-based policies. You can use tags to restrict access to only an IAM role that has a specified tag attached. You can also restrict access to only those resources that have a certain tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.    Cost allocation - Use tags to help track which individuals and teams are using which Amazon Web Services resources.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.    For more information about tagging, see Tagging IAM identities in the IAM User Guide.
   */
  tagRole(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to a Security Assertion Markup Language (SAML) identity provider. For more information about these providers, see About SAML 2.0-based federation . If a tag with the same key name already exists, then that tag is overwritten with the new value. A tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM user-based and resource-based policies. You can use tags to restrict access to only a SAML identity provider that has a specified tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.   
   */
  tagSAMLProvider(params: IAM.Types.TagSAMLProviderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to a Security Assertion Markup Language (SAML) identity provider. For more information about these providers, see About SAML 2.0-based federation . If a tag with the same key name already exists, then that tag is overwritten with the new value. A tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM user-based and resource-based policies. You can use tags to restrict access to only a SAML identity provider that has a specified tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.   
   */
  tagSAMLProvider(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to an IAM server certificate. If a tag with the same key name already exists, then that tag is overwritten with the new value.  For certificates in a Region supported by Certificate Manager (ACM), we recommend that you don't use IAM server certificates. Instead, use ACM to provision, manage, and deploy your server certificates. For more information about IAM server certificates, Working with server certificates in the IAM User Guide.  A tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM user-based and resource-based policies. You can use tags to restrict access to only a server certificate that has a specified tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.    Cost allocation - Use tags to help track which individuals and teams are using which Amazon Web Services resources.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.   
   */
  tagServerCertificate(params: IAM.Types.TagServerCertificateRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to an IAM server certificate. If a tag with the same key name already exists, then that tag is overwritten with the new value.  For certificates in a Region supported by Certificate Manager (ACM), we recommend that you don't use IAM server certificates. Instead, use ACM to provision, manage, and deploy your server certificates. For more information about IAM server certificates, Working with server certificates in the IAM User Guide.  A tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM user-based and resource-based policies. You can use tags to restrict access to only a server certificate that has a specified tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.    Cost allocation - Use tags to help track which individuals and teams are using which Amazon Web Services resources.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.   
   */
  tagServerCertificate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to an IAM user. If a tag with the same key name already exists, then that tag is overwritten with the new value. A tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM identity-based and resource-based policies. You can use tags to restrict access to only an IAM requesting user that has a specified tag attached. You can also restrict access to only those resources that have a certain tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.    Cost allocation - Use tags to help track which individuals and teams are using which Amazon Web Services resources.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.    For more information about tagging, see Tagging IAM identities in the IAM User Guide.
   */
  tagUser(params: IAM.Types.TagUserRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to an IAM user. If a tag with the same key name already exists, then that tag is overwritten with the new value. A tag consists of a key name and an associated value. By assigning tags to your resources, you can do the following:    Administrative grouping and discovery - Attach tags to resources to aid in organization and search. For example, you could search for all resources with the key name Project and the value MyImportantProject. Or search for all resources with the key name Cost Center and the value 41200.     Access control - Include tags in IAM identity-based and resource-based policies. You can use tags to restrict access to only an IAM requesting user that has a specified tag attached. You can also restrict access to only those resources that have a certain tag attached. For examples of policies that show how to use tags to control access, see Control access using IAM tags in the IAM User Guide.    Cost allocation - Use tags to help track which individuals and teams are using which Amazon Web Services resources.      If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the IAM User Guide.   Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code.    For more information about tagging, see Tagging IAM identities in the IAM User Guide.
   */
  tagUser(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the IAM instance profile. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  untagInstanceProfile(params: IAM.Types.UntagInstanceProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the IAM instance profile. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  untagInstanceProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the IAM virtual multi-factor authentication (MFA) device. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  untagMFADevice(params: IAM.Types.UntagMFADeviceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the IAM virtual multi-factor authentication (MFA) device. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  untagMFADevice(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the specified OpenID Connect (OIDC)-compatible identity provider in IAM. For more information about OIDC providers, see About web identity federation. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  untagOpenIDConnectProvider(params: IAM.Types.UntagOpenIDConnectProviderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the specified OpenID Connect (OIDC)-compatible identity provider in IAM. For more information about OIDC providers, see About web identity federation. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  untagOpenIDConnectProvider(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the customer managed policy. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  untagPolicy(params: IAM.Types.UntagPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the customer managed policy. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  untagPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the role. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  untagRole(params: IAM.Types.UntagRoleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the role. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  untagRole(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the specified Security Assertion Markup Language (SAML) identity provider in IAM. For more information about these providers, see About web identity federation. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  untagSAMLProvider(params: IAM.Types.UntagSAMLProviderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the specified Security Assertion Markup Language (SAML) identity provider in IAM. For more information about these providers, see About web identity federation. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  untagSAMLProvider(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the IAM server certificate. For more information about tagging, see Tagging IAM resources in the IAM User Guide.  For certificates in a Region supported by Certificate Manager (ACM), we recommend that you don't use IAM server certificates. Instead, use ACM to provision, manage, and deploy your server certificates. For more information about IAM server certificates, Working with server certificates in the IAM User Guide. 
   */
  untagServerCertificate(params: IAM.Types.UntagServerCertificateRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the IAM server certificate. For more information about tagging, see Tagging IAM resources in the IAM User Guide.  For certificates in a Region supported by Certificate Manager (ACM), we recommend that you don't use IAM server certificates. Instead, use ACM to provision, manage, and deploy your server certificates. For more information about IAM server certificates, Working with server certificates in the IAM User Guide. 
   */
  untagServerCertificate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the user. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  untagUser(params: IAM.Types.UntagUserRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the user. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
   */
  untagUser(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the status of the specified access key from Active to Inactive, or vice versa. This operation can be used to disable a user's key as part of a key rotation workflow. If the UserName is not specified, the user name is determined implicitly based on the Amazon Web Services access key ID used to sign the request. If a temporary access key is used, then UserName is required. If a long-term key is assigned to the user, then UserName is not required. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated users. For information about rotating keys, see Managing keys and certificates in the IAM User Guide.
   */
  updateAccessKey(params: IAM.Types.UpdateAccessKeyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the status of the specified access key from Active to Inactive, or vice versa. This operation can be used to disable a user's key as part of a key rotation workflow. If the UserName is not specified, the user name is determined implicitly based on the Amazon Web Services access key ID used to sign the request. If a temporary access key is used, then UserName is required. If a long-term key is assigned to the user, then UserName is not required. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated users. For information about rotating keys, see Managing keys and certificates in the IAM User Guide.
   */
  updateAccessKey(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the password policy settings for the Amazon Web Services account.  This operation does not support partial updates. No parameters are required, but if you do not specify a parameter, that parameter's value reverts to its default value. See the Request Parameters section for each parameter's default value. Also note that some parameters do not allow the default parameter to be explicitly set. Instead, to invoke the default value, do not include that parameter when you invoke the operation.   For more information about using a password policy, see Managing an IAM password policy in the IAM User Guide.
   */
  updateAccountPasswordPolicy(params: IAM.Types.UpdateAccountPasswordPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the password policy settings for the Amazon Web Services account.  This operation does not support partial updates. No parameters are required, but if you do not specify a parameter, that parameter's value reverts to its default value. See the Request Parameters section for each parameter's default value. Also note that some parameters do not allow the default parameter to be explicitly set. Instead, to invoke the default value, do not include that parameter when you invoke the operation.   For more information about using a password policy, see Managing an IAM password policy in the IAM User Guide.
   */
  updateAccountPasswordPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the policy that grants an IAM entity permission to assume a role. This is typically referred to as the "role trust policy". For more information about roles, see Using roles to delegate permissions and federate identities.
   */
  updateAssumeRolePolicy(params: IAM.Types.UpdateAssumeRolePolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the policy that grants an IAM entity permission to assume a role. This is typically referred to as the "role trust policy". For more information about roles, see Using roles to delegate permissions and federate identities.
   */
  updateAssumeRolePolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the name and/or the path of the specified IAM group.   You should understand the implications of changing a group's path or name. For more information, see Renaming users and groups in the IAM User Guide.   The person making the request (the principal), must have permission to change the role group with the old name and the new name. For example, to change the group named Managers to MGRs, the principal must have a policy that allows them to update both groups. If the principal has permission to update the Managers group, but not the MGRs group, then the update fails. For more information about permissions, see Access management.  
   */
  updateGroup(params: IAM.Types.UpdateGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the name and/or the path of the specified IAM group.   You should understand the implications of changing a group's path or name. For more information, see Renaming users and groups in the IAM User Guide.   The person making the request (the principal), must have permission to change the role group with the old name and the new name. For example, to change the group named Managers to MGRs, the principal must have a policy that allows them to update both groups. If the principal has permission to update the Managers group, but not the MGRs group, then the update fails. For more information about permissions, see Access management.  
   */
  updateGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the password for the specified IAM user. You can use the CLI, the Amazon Web Services API, or the Users page in the IAM console to change the password for any IAM user. Use ChangePassword to change your own password in the My Security Credentials page in the Amazon Web Services Management Console. For more information about modifying passwords, see Managing passwords in the IAM User Guide.
   */
  updateLoginProfile(params: IAM.Types.UpdateLoginProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the password for the specified IAM user. You can use the CLI, the Amazon Web Services API, or the Users page in the IAM console to change the password for any IAM user. Use ChangePassword to change your own password in the My Security Credentials page in the Amazon Web Services Management Console. For more information about modifying passwords, see Managing passwords in the IAM User Guide.
   */
  updateLoginProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Replaces the existing list of server certificate thumbprints associated with an OpenID Connect (OIDC) provider resource object with a new list of thumbprints. The list that you pass with this operation completely replaces the existing list of thumbprints. (The lists are not merged.) Typically, you need to update a thumbprint only when the identity provider certificate changes, which occurs rarely. However, if the provider's certificate does change, any attempt to assume an IAM role that specifies the OIDC provider as a principal fails until the certificate thumbprint is updated.  Amazon Web Services secures communication with some OIDC identity providers (IdPs) through our library of trusted root certificate authorities (CAs) instead of using a certificate thumbprint to verify your IdP server certificate. These OIDC IdPs include Auth0, GitHub, Google, and those that use an Amazon S3 bucket to host a JSON Web Key Set (JWKS) endpoint. In these cases, your legacy thumbprint remains in your configuration, but is no longer used for validation.   Trust for the OIDC provider is derived from the provider certificate and is validated by the thumbprint. Therefore, it is best to limit access to the UpdateOpenIDConnectProviderThumbprint operation to highly privileged users. 
   */
  updateOpenIDConnectProviderThumbprint(params: IAM.Types.UpdateOpenIDConnectProviderThumbprintRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Replaces the existing list of server certificate thumbprints associated with an OpenID Connect (OIDC) provider resource object with a new list of thumbprints. The list that you pass with this operation completely replaces the existing list of thumbprints. (The lists are not merged.) Typically, you need to update a thumbprint only when the identity provider certificate changes, which occurs rarely. However, if the provider's certificate does change, any attempt to assume an IAM role that specifies the OIDC provider as a principal fails until the certificate thumbprint is updated.  Amazon Web Services secures communication with some OIDC identity providers (IdPs) through our library of trusted root certificate authorities (CAs) instead of using a certificate thumbprint to verify your IdP server certificate. These OIDC IdPs include Auth0, GitHub, Google, and those that use an Amazon S3 bucket to host a JSON Web Key Set (JWKS) endpoint. In these cases, your legacy thumbprint remains in your configuration, but is no longer used for validation.   Trust for the OIDC provider is derived from the provider certificate and is validated by the thumbprint. Therefore, it is best to limit access to the UpdateOpenIDConnectProviderThumbprint operation to highly privileged users. 
   */
  updateOpenIDConnectProviderThumbprint(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the description or maximum session duration setting of a role.
   */
  updateRole(params: IAM.Types.UpdateRoleRequest, callback?: (err: AWSError, data: IAM.Types.UpdateRoleResponse) => void): Request<IAM.Types.UpdateRoleResponse, AWSError>;
  /**
   * Updates the description or maximum session duration setting of a role.
   */
  updateRole(callback?: (err: AWSError, data: IAM.Types.UpdateRoleResponse) => void): Request<IAM.Types.UpdateRoleResponse, AWSError>;
  /**
   * Use UpdateRole instead. Modifies only the description of a role. This operation performs the same function as the Description parameter in the UpdateRole operation.
   */
  updateRoleDescription(params: IAM.Types.UpdateRoleDescriptionRequest, callback?: (err: AWSError, data: IAM.Types.UpdateRoleDescriptionResponse) => void): Request<IAM.Types.UpdateRoleDescriptionResponse, AWSError>;
  /**
   * Use UpdateRole instead. Modifies only the description of a role. This operation performs the same function as the Description parameter in the UpdateRole operation.
   */
  updateRoleDescription(callback?: (err: AWSError, data: IAM.Types.UpdateRoleDescriptionResponse) => void): Request<IAM.Types.UpdateRoleDescriptionResponse, AWSError>;
  /**
   * Updates the metadata document for an existing SAML provider resource object.  This operation requires Signature Version 4. 
   */
  updateSAMLProvider(params: IAM.Types.UpdateSAMLProviderRequest, callback?: (err: AWSError, data: IAM.Types.UpdateSAMLProviderResponse) => void): Request<IAM.Types.UpdateSAMLProviderResponse, AWSError>;
  /**
   * Updates the metadata document for an existing SAML provider resource object.  This operation requires Signature Version 4. 
   */
  updateSAMLProvider(callback?: (err: AWSError, data: IAM.Types.UpdateSAMLProviderResponse) => void): Request<IAM.Types.UpdateSAMLProviderResponse, AWSError>;
  /**
   * Sets the status of an IAM user's SSH public key to active or inactive. SSH public keys that are inactive cannot be used for authentication. This operation can be used to disable a user's SSH public key as part of a key rotation work flow. The SSH public key affected by this operation is used only for authenticating the associated IAM user to an CodeCommit repository. For more information about using SSH keys to authenticate to an CodeCommit repository, see Set up CodeCommit for SSH connections in the CodeCommit User Guide.
   */
  updateSSHPublicKey(params: IAM.Types.UpdateSSHPublicKeyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the status of an IAM user's SSH public key to active or inactive. SSH public keys that are inactive cannot be used for authentication. This operation can be used to disable a user's SSH public key as part of a key rotation work flow. The SSH public key affected by this operation is used only for authenticating the associated IAM user to an CodeCommit repository. For more information about using SSH keys to authenticate to an CodeCommit repository, see Set up CodeCommit for SSH connections in the CodeCommit User Guide.
   */
  updateSSHPublicKey(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the name and/or the path of the specified server certificate stored in IAM. For more information about working with server certificates, see Working with server certificates in the IAM User Guide. This topic also includes a list of Amazon Web Services services that can use the server certificates that you manage with IAM.  You should understand the implications of changing a server certificate's path or name. For more information, see Renaming a server certificate in the IAM User Guide.   The person making the request (the principal), must have permission to change the server certificate with the old name and the new name. For example, to change the certificate named ProductionCert to ProdCert, the principal must have a policy that allows them to update both certificates. If the principal has permission to update the ProductionCert group, but not the ProdCert certificate, then the update fails. For more information about permissions, see Access management in the IAM User Guide. 
   */
  updateServerCertificate(params: IAM.Types.UpdateServerCertificateRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the name and/or the path of the specified server certificate stored in IAM. For more information about working with server certificates, see Working with server certificates in the IAM User Guide. This topic also includes a list of Amazon Web Services services that can use the server certificates that you manage with IAM.  You should understand the implications of changing a server certificate's path or name. For more information, see Renaming a server certificate in the IAM User Guide.   The person making the request (the principal), must have permission to change the server certificate with the old name and the new name. For example, to change the certificate named ProductionCert to ProdCert, the principal must have a policy that allows them to update both certificates. If the principal has permission to update the ProductionCert group, but not the ProdCert certificate, then the update fails. For more information about permissions, see Access management in the IAM User Guide. 
   */
  updateServerCertificate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the status of a service-specific credential to Active or Inactive. Service-specific credentials that are inactive cannot be used for authentication to the service. This operation can be used to disable a user's service-specific credential as part of a credential rotation work flow.
   */
  updateServiceSpecificCredential(params: IAM.Types.UpdateServiceSpecificCredentialRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the status of a service-specific credential to Active or Inactive. Service-specific credentials that are inactive cannot be used for authentication to the service. This operation can be used to disable a user's service-specific credential as part of a credential rotation work flow.
   */
  updateServiceSpecificCredential(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the status of the specified user signing certificate from active to disabled, or vice versa. This operation can be used to disable an IAM user's signing certificate as part of a certificate rotation work flow. If the UserName field is not specified, the user name is determined implicitly based on the Amazon Web Services access key ID used to sign the request. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated users.
   */
  updateSigningCertificate(params: IAM.Types.UpdateSigningCertificateRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the status of the specified user signing certificate from active to disabled, or vice versa. This operation can be used to disable an IAM user's signing certificate as part of a certificate rotation work flow. If the UserName field is not specified, the user name is determined implicitly based on the Amazon Web Services access key ID used to sign the request. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated users.
   */
  updateSigningCertificate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the name and/or the path of the specified IAM user.   You should understand the implications of changing an IAM user's path or name. For more information, see Renaming an IAM user and Renaming an IAM group in the IAM User Guide.    To change a user name, the requester must have appropriate permissions on both the source object and the target object. For example, to change Bob to Robert, the entity making the request must have permission on Bob and Robert, or must have permission on all (*). For more information about permissions, see Permissions and policies.  
   */
  updateUser(params: IAM.Types.UpdateUserRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the name and/or the path of the specified IAM user.   You should understand the implications of changing an IAM user's path or name. For more information, see Renaming an IAM user and Renaming an IAM group in the IAM User Guide.    To change a user name, the requester must have appropriate permissions on both the source object and the target object. For example, to change Bob to Robert, the entity making the request must have permission on Bob and Robert, or must have permission on all (*). For more information about permissions, see Permissions and policies.  
   */
  updateUser(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Uploads an SSH public key and associates it with the specified IAM user. The SSH public key uploaded by this operation can be used only for authenticating the associated IAM user to an CodeCommit repository. For more information about using SSH keys to authenticate to an CodeCommit repository, see Set up CodeCommit for SSH connections in the CodeCommit User Guide.
   */
  uploadSSHPublicKey(params: IAM.Types.UploadSSHPublicKeyRequest, callback?: (err: AWSError, data: IAM.Types.UploadSSHPublicKeyResponse) => void): Request<IAM.Types.UploadSSHPublicKeyResponse, AWSError>;
  /**
   * Uploads an SSH public key and associates it with the specified IAM user. The SSH public key uploaded by this operation can be used only for authenticating the associated IAM user to an CodeCommit repository. For more information about using SSH keys to authenticate to an CodeCommit repository, see Set up CodeCommit for SSH connections in the CodeCommit User Guide.
   */
  uploadSSHPublicKey(callback?: (err: AWSError, data: IAM.Types.UploadSSHPublicKeyResponse) => void): Request<IAM.Types.UploadSSHPublicKeyResponse, AWSError>;
  /**
   * Uploads a server certificate entity for the Amazon Web Services account. The server certificate entity includes a public key certificate, a private key, and an optional certificate chain, which should all be PEM-encoded. We recommend that you use Certificate Manager to provision, manage, and deploy your server certificates. With ACM you can request a certificate, deploy it to Amazon Web Services resources, and let ACM handle certificate renewals for you. Certificates provided by ACM are free. For more information about using ACM, see the Certificate Manager User Guide. For more information about working with server certificates, see Working with server certificates in the IAM User Guide. This topic includes a list of Amazon Web Services services that can use the server certificates that you manage with IAM. For information about the number of server certificates you can upload, see IAM and STS quotas in the IAM User Guide.  Because the body of the public key certificate, private key, and the certificate chain can be large, you should use POST rather than GET when calling UploadServerCertificate. For information about setting up signatures and authorization through the API, see Signing Amazon Web Services API requests in the Amazon Web Services General Reference. For general information about using the Query API with IAM, see Calling the API by making HTTP query requests in the IAM User Guide. 
   */
  uploadServerCertificate(params: IAM.Types.UploadServerCertificateRequest, callback?: (err: AWSError, data: IAM.Types.UploadServerCertificateResponse) => void): Request<IAM.Types.UploadServerCertificateResponse, AWSError>;
  /**
   * Uploads a server certificate entity for the Amazon Web Services account. The server certificate entity includes a public key certificate, a private key, and an optional certificate chain, which should all be PEM-encoded. We recommend that you use Certificate Manager to provision, manage, and deploy your server certificates. With ACM you can request a certificate, deploy it to Amazon Web Services resources, and let ACM handle certificate renewals for you. Certificates provided by ACM are free. For more information about using ACM, see the Certificate Manager User Guide. For more information about working with server certificates, see Working with server certificates in the IAM User Guide. This topic includes a list of Amazon Web Services services that can use the server certificates that you manage with IAM. For information about the number of server certificates you can upload, see IAM and STS quotas in the IAM User Guide.  Because the body of the public key certificate, private key, and the certificate chain can be large, you should use POST rather than GET when calling UploadServerCertificate. For information about setting up signatures and authorization through the API, see Signing Amazon Web Services API requests in the Amazon Web Services General Reference. For general information about using the Query API with IAM, see Calling the API by making HTTP query requests in the IAM User Guide. 
   */
  uploadServerCertificate(callback?: (err: AWSError, data: IAM.Types.UploadServerCertificateResponse) => void): Request<IAM.Types.UploadServerCertificateResponse, AWSError>;
  /**
   * Uploads an X.509 signing certificate and associates it with the specified IAM user. Some Amazon Web Services services require you to use certificates to validate requests that are signed with a corresponding private key. When you upload the certificate, its default status is Active. For information about when you would use an X.509 signing certificate, see Managing server certificates in IAM in the IAM User Guide. If the UserName is not specified, the IAM user name is determined implicitly based on the Amazon Web Services access key ID used to sign the request. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated users.  Because the body of an X.509 certificate can be large, you should use POST rather than GET when calling UploadSigningCertificate. For information about setting up signatures and authorization through the API, see Signing Amazon Web Services API requests in the Amazon Web Services General Reference. For general information about using the Query API with IAM, see Making query requests in the IAM User Guide. 
   */
  uploadSigningCertificate(params: IAM.Types.UploadSigningCertificateRequest, callback?: (err: AWSError, data: IAM.Types.UploadSigningCertificateResponse) => void): Request<IAM.Types.UploadSigningCertificateResponse, AWSError>;
  /**
   * Uploads an X.509 signing certificate and associates it with the specified IAM user. Some Amazon Web Services services require you to use certificates to validate requests that are signed with a corresponding private key. When you upload the certificate, its default status is Active. For information about when you would use an X.509 signing certificate, see Managing server certificates in IAM in the IAM User Guide. If the UserName is not specified, the IAM user name is determined implicitly based on the Amazon Web Services access key ID used to sign the request. This operation works for access keys under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated users.  Because the body of an X.509 certificate can be large, you should use POST rather than GET when calling UploadSigningCertificate. For information about setting up signatures and authorization through the API, see Signing Amazon Web Services API requests in the Amazon Web Services General Reference. For general information about using the Query API with IAM, see Making query requests in the IAM User Guide. 
   */
  uploadSigningCertificate(callback?: (err: AWSError, data: IAM.Types.UploadSigningCertificateResponse) => void): Request<IAM.Types.UploadSigningCertificateResponse, AWSError>;
  /**
   * Waits for the instanceProfileExists state by periodically calling the underlying IAM.getInstanceProfileoperation every 1 seconds (at most 40 times).
   */
  waitFor(state: "instanceProfileExists", params: IAM.Types.GetInstanceProfileRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: IAM.Types.GetInstanceProfileResponse) => void): Request<IAM.Types.GetInstanceProfileResponse, AWSError>;
  /**
   * Waits for the instanceProfileExists state by periodically calling the underlying IAM.getInstanceProfileoperation every 1 seconds (at most 40 times).
   */
  waitFor(state: "instanceProfileExists", callback?: (err: AWSError, data: IAM.Types.GetInstanceProfileResponse) => void): Request<IAM.Types.GetInstanceProfileResponse, AWSError>;
  /**
   * Waits for the userExists state by periodically calling the underlying IAM.getUseroperation every 1 seconds (at most 20 times).
   */
  waitFor(state: "userExists", params: IAM.Types.GetUserRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: IAM.Types.GetUserResponse) => void): Request<IAM.Types.GetUserResponse, AWSError>;
  /**
   * Waits for the userExists state by periodically calling the underlying IAM.getUseroperation every 1 seconds (at most 20 times).
   */
  waitFor(state: "userExists", callback?: (err: AWSError, data: IAM.Types.GetUserResponse) => void): Request<IAM.Types.GetUserResponse, AWSError>;
  /**
   * Waits for the roleExists state by periodically calling the underlying IAM.getRoleoperation every 1 seconds (at most 20 times).
   */
  waitFor(state: "roleExists", params: IAM.Types.GetRoleRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: IAM.Types.GetRoleResponse) => void): Request<IAM.Types.GetRoleResponse, AWSError>;
  /**
   * Waits for the roleExists state by periodically calling the underlying IAM.getRoleoperation every 1 seconds (at most 20 times).
   */
  waitFor(state: "roleExists", callback?: (err: AWSError, data: IAM.Types.GetRoleResponse) => void): Request<IAM.Types.GetRoleResponse, AWSError>;
  /**
   * Waits for the policyExists state by periodically calling the underlying IAM.getPolicyoperation every 1 seconds (at most 20 times).
   */
  waitFor(state: "policyExists", params: IAM.Types.GetPolicyRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: IAM.Types.GetPolicyResponse) => void): Request<IAM.Types.GetPolicyResponse, AWSError>;
  /**
   * Waits for the policyExists state by periodically calling the underlying IAM.getPolicyoperation every 1 seconds (at most 20 times).
   */
  waitFor(state: "policyExists", callback?: (err: AWSError, data: IAM.Types.GetPolicyResponse) => void): Request<IAM.Types.GetPolicyResponse, AWSError>;
}
declare namespace IAM {
  export type AccessAdvisorUsageGranularityType = "SERVICE_LEVEL"|"ACTION_LEVEL"|string;
  export interface AccessDetail {
    /**
     * The name of the service in which access was attempted.
     */
    ServiceName: serviceNameType;
    /**
     * The namespace of the service in which access was attempted. To learn the service namespace of a service, see Actions, resources, and condition keys for Amazon Web Services services in the Service Authorization Reference. Choose the name of the service to view details for that service. In the first paragraph, find the service prefix. For example, (service prefix: a4b). For more information about service namespaces, see Amazon Web Services service namespaces in the Amazon Web Services General Reference.
     */
    ServiceNamespace: serviceNamespaceType;
    /**
     * The Region where the last service access attempt occurred. This field is null if no principals in the reported Organizations entity attempted to access the service within the tracking period.
     */
    Region?: stringType;
    /**
     * The path of the Organizations entity (root, organizational unit, or account) from which an authenticated principal last attempted to access the service. Amazon Web Services does not report unauthenticated requests. This field is null if no principals (IAM users, IAM roles, or root user) in the reported Organizations entity attempted to access the service within the tracking period.
     */
    EntityPath?: organizationsEntityPathType;
    /**
     * The date and time, in ISO 8601 date-time format, when an authenticated principal most recently attempted to access the service. Amazon Web Services does not report unauthenticated requests. This field is null if no principals in the reported Organizations entity attempted to access the service within the tracking period.
     */
    LastAuthenticatedTime?: dateType;
    /**
     * The number of accounts with authenticated principals (root user, IAM users, and IAM roles) that attempted to access the service in the tracking period.
     */
    TotalAuthenticatedEntities?: integerType;
  }
  export type AccessDetails = AccessDetail[];
  export interface AccessKey {
    /**
     * The name of the IAM user that the access key is associated with.
     */
    UserName: userNameType;
    /**
     * The ID for this access key.
     */
    AccessKeyId: accessKeyIdType;
    /**
     * The status of the access key. Active means that the key is valid for API calls, while Inactive means it is not. 
     */
    Status: statusType;
    /**
     * The secret key used to sign requests.
     */
    SecretAccessKey: accessKeySecretType;
    /**
     * The date when the access key was created.
     */
    CreateDate?: dateType;
  }
  export interface AccessKeyLastUsed {
    /**
     * The date and time, in ISO 8601 date-time format, when the access key was most recently used. This field is null in the following situations:   The user does not have an access key.   An access key exists but has not been used since IAM began tracking this information.   There is no sign-in data associated with the user.  
     */
    LastUsedDate: dateType;
    /**
     * The name of the Amazon Web Services service with which this access key was most recently used. The value of this field is "N/A" in the following situations:   The user does not have an access key.   An access key exists but has not been used since IAM started tracking this information.   There is no sign-in data associated with the user.  
     */
    ServiceName: stringType;
    /**
     * The Amazon Web Services Region where this access key was most recently used. The value for this field is "N/A" in the following situations:   The user does not have an access key.   An access key exists but has not been used since IAM began tracking this information.   There is no sign-in data associated with the user.   For more information about Amazon Web Services Regions, see Regions and endpoints in the Amazon Web Services General Reference.
     */
    Region: stringType;
  }
  export interface AccessKeyMetadata {
    /**
     * The name of the IAM user that the key is associated with.
     */
    UserName?: userNameType;
    /**
     * The ID for this access key.
     */
    AccessKeyId?: accessKeyIdType;
    /**
     * The status of the access key. Active means that the key is valid for API calls; Inactive means it is not.
     */
    Status?: statusType;
    /**
     * The date when the access key was created.
     */
    CreateDate?: dateType;
  }
  export type ActionNameListType = ActionNameType[];
  export type ActionNameType = string;
  export interface AddClientIDToOpenIDConnectProviderRequest {
    /**
     * The Amazon Resource Name (ARN) of the IAM OpenID Connect (OIDC) provider resource to add the client ID to. You can get a list of OIDC provider ARNs by using the ListOpenIDConnectProviders operation.
     */
    OpenIDConnectProviderArn: arnType;
    /**
     * The client ID (also known as audience) to add to the IAM OpenID Connect provider resource.
     */
    ClientID: clientIDType;
  }
  export interface AddRoleToInstanceProfileRequest {
    /**
     * The name of the instance profile to update. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    InstanceProfileName: instanceProfileNameType;
    /**
     * The name of the role to add. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
  }
  export interface AddUserToGroupRequest {
    /**
     * The name of the group to update. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    GroupName: groupNameType;
    /**
     * The name of the user to add. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: existingUserNameType;
  }
  export type ArnListType = arnType[];
  export interface AttachGroupPolicyRequest {
    /**
     * The name (friendly name, not ARN) of the group to attach the policy to. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    GroupName: groupNameType;
    /**
     * The Amazon Resource Name (ARN) of the IAM policy you want to attach. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicyArn: arnType;
  }
  export interface AttachRolePolicyRequest {
    /**
     * The name (friendly name, not ARN) of the role to attach the policy to. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
    /**
     * The Amazon Resource Name (ARN) of the IAM policy you want to attach. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicyArn: arnType;
  }
  export interface AttachUserPolicyRequest {
    /**
     * The name (friendly name, not ARN) of the IAM user to attach the policy to. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: userNameType;
    /**
     * The Amazon Resource Name (ARN) of the IAM policy you want to attach. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicyArn: arnType;
  }
  export interface AttachedPermissionsBoundary {
    /**
     *  The permissions boundary usage type that indicates what type of IAM resource is used as the permissions boundary for an entity. This data type can only have a value of Policy.
     */
    PermissionsBoundaryType?: PermissionsBoundaryAttachmentType;
    /**
     *  The ARN of the policy used to set the permissions boundary for the user or role.
     */
    PermissionsBoundaryArn?: arnType;
  }
  export interface AttachedPolicy {
    /**
     * The friendly name of the attached policy.
     */
    PolicyName?: policyNameType;
    PolicyArn?: arnType;
  }
  export type BootstrapDatum = Buffer|Uint8Array|Blob|string;
  export type CertificationKeyType = string;
  export type CertificationMapType = {[key: string]: CertificationValueType};
  export type CertificationValueType = string;
  export interface ChangePasswordRequest {
    /**
     * The IAM user's current password.
     */
    OldPassword: passwordType;
    /**
     * The new password. The new password must conform to the Amazon Web Services account's password policy, if one exists. The regex pattern that is used to validate this parameter is a string of characters. That string can include almost any printable ASCII character from the space (\u0020) through the end of the ASCII character range (\u00FF). You can also include the tab (\u0009), line feed (\u000A), and carriage return (\u000D) characters. Any of these characters are valid in a password. However, many tools, such as the Amazon Web Services Management Console, might restrict the ability to type certain characters because they have special meaning within that tool.
     */
    NewPassword: passwordType;
  }
  export type ColumnNumber = number;
  export interface ContextEntry {
    /**
     * The full name of a condition context key, including the service prefix. For example, aws:SourceIp or s3:VersionId.
     */
    ContextKeyName?: ContextKeyNameType;
    /**
     * The value (or values, if the condition context key supports multiple values) to provide to the simulation when the key is referenced by a Condition element in an input policy.
     */
    ContextKeyValues?: ContextKeyValueListType;
    /**
     * The data type of the value (or values) specified in the ContextKeyValues parameter.
     */
    ContextKeyType?: ContextKeyTypeEnum;
  }
  export type ContextEntryListType = ContextEntry[];
  export type ContextKeyNameType = string;
  export type ContextKeyNamesResultListType = ContextKeyNameType[];
  export type ContextKeyTypeEnum = "string"|"stringList"|"numeric"|"numericList"|"boolean"|"booleanList"|"ip"|"ipList"|"binary"|"binaryList"|"date"|"dateList"|string;
  export type ContextKeyValueListType = ContextKeyValueType[];
  export type ContextKeyValueType = string;
  export interface CreateAccessKeyRequest {
    /**
     * The name of the IAM user that the new key will belong to. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName?: existingUserNameType;
  }
  export interface CreateAccessKeyResponse {
    /**
     * A structure with details about the access key.
     */
    AccessKey: AccessKey;
  }
  export interface CreateAccountAliasRequest {
    /**
     * The account alias to create. This parameter allows (through its regex pattern) a string of characters consisting of lowercase letters, digits, and dashes. You cannot start or finish with a dash, nor can you have two dashes in a row.
     */
    AccountAlias: accountAliasType;
  }
  export interface CreateGroupRequest {
    /**
     *  The path to the group. For more information about paths, see IAM identifiers in the IAM User Guide. This parameter is optional. If it is not included, it defaults to a slash (/). This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    Path?: pathType;
    /**
     * The name of the group to create. Do not include the path in this value. IAM user, group, role, and policy names must be unique within the account. Names are not distinguished by case. For example, you cannot create resources named both "MyResource" and "myresource".
     */
    GroupName: groupNameType;
  }
  export interface CreateGroupResponse {
    /**
     * A structure containing details about the new group.
     */
    Group: Group;
  }
  export interface CreateInstanceProfileRequest {
    /**
     * The name of the instance profile to create. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    InstanceProfileName: instanceProfileNameType;
    /**
     *  The path to the instance profile. For more information about paths, see IAM Identifiers in the IAM User Guide. This parameter is optional. If it is not included, it defaults to a slash (/). This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    Path?: pathType;
    /**
     * A list of tags that you want to attach to the newly created IAM instance profile. Each tag consists of a key name and an associated value. For more information about tagging, see Tagging IAM resources in the IAM User Guide.  If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. 
     */
    Tags?: tagListType;
  }
  export interface CreateInstanceProfileResponse {
    /**
     * A structure containing details about the new instance profile.
     */
    InstanceProfile: InstanceProfile;
  }
  export interface CreateLoginProfileRequest {
    /**
     * The name of the IAM user to create a password for. The user must already exist. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: userNameType;
    /**
     * The new password for the user. The regex pattern that is used to validate this parameter is a string of characters. That string can include almost any printable ASCII character from the space (\u0020) through the end of the ASCII character range (\u00FF). You can also include the tab (\u0009), line feed (\u000A), and carriage return (\u000D) characters. Any of these characters are valid in a password. However, many tools, such as the Amazon Web Services Management Console, might restrict the ability to type certain characters because they have special meaning within that tool.
     */
    Password: passwordType;
    /**
     * Specifies whether the user is required to set a new password on next sign-in.
     */
    PasswordResetRequired?: booleanType;
  }
  export interface CreateLoginProfileResponse {
    /**
     * A structure containing the user name and password create date.
     */
    LoginProfile: LoginProfile;
  }
  export interface CreateOpenIDConnectProviderRequest {
    /**
     * The URL of the identity provider. The URL must begin with https:// and should correspond to the iss claim in the provider's OpenID Connect ID tokens. Per the OIDC standard, path components are allowed but query parameters are not. Typically the URL consists of only a hostname, like https://server.example.org or https://example.com. The URL should not contain a port number.  You cannot register the same provider multiple times in a single Amazon Web Services account. If you try to submit a URL that has already been used for an OpenID Connect provider in the Amazon Web Services account, you will get an error.
     */
    Url: OpenIDConnectProviderUrlType;
    /**
     * Provides a list of client IDs, also known as audiences. When a mobile or web app registers with an OpenID Connect provider, they establish a value that identifies the application. This is the value that's sent as the client_id parameter on OAuth requests. You can register multiple client IDs with the same provider. For example, you might have multiple applications that use the same OIDC provider. You cannot register more than 100 client IDs with a single IAM OIDC provider. There is no defined format for a client ID. The CreateOpenIDConnectProviderRequest operation accepts client IDs up to 255 characters long.
     */
    ClientIDList?: clientIDListType;
    /**
     * A list of server certificate thumbprints for the OpenID Connect (OIDC) identity provider's server certificates. Typically this list includes only one entry. However, IAM lets you have up to five thumbprints for an OIDC provider. This lets you maintain multiple thumbprints if the identity provider is rotating certificates. The server certificate thumbprint is the hex-encoded SHA-1 hash value of the X.509 certificate used by the domain where the OpenID Connect provider makes its keys available. It is always a 40-character string. You must provide at least one thumbprint when creating an IAM OIDC provider. For example, assume that the OIDC provider is server.example.com and the provider stores its keys at https://keys.server.example.com/openid-connect. In that case, the thumbprint string would be the hex-encoded SHA-1 hash value of the certificate used by https://keys.server.example.com.  For more information about obtaining the OIDC provider thumbprint, see Obtaining the thumbprint for an OpenID Connect provider in the IAM user Guide.
     */
    ThumbprintList: thumbprintListType;
    /**
     * A list of tags that you want to attach to the new IAM OpenID Connect (OIDC) provider. Each tag consists of a key name and an associated value. For more information about tagging, see Tagging IAM resources in the IAM User Guide.  If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. 
     */
    Tags?: tagListType;
  }
  export interface CreateOpenIDConnectProviderResponse {
    /**
     * The Amazon Resource Name (ARN) of the new IAM OpenID Connect provider that is created. For more information, see OpenIDConnectProviderListEntry. 
     */
    OpenIDConnectProviderArn?: arnType;
    /**
     * A list of tags that are attached to the new IAM OIDC provider. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
     */
    Tags?: tagListType;
  }
  export interface CreatePolicyRequest {
    /**
     * The friendly name of the policy. IAM user, group, role, and policy names must be unique within the account. Names are not distinguished by case. For example, you cannot create resources named both "MyResource" and "myresource".
     */
    PolicyName: policyNameType;
    /**
     * The path for the policy. For more information about paths, see IAM identifiers in the IAM User Guide. This parameter is optional. If it is not included, it defaults to a slash (/). This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.  You cannot use an asterisk (*) in the path name. 
     */
    Path?: policyPathType;
    /**
     * The JSON policy document that you want to use as the content for the new policy. You must provide policies in JSON format in IAM. However, for CloudFormation templates formatted in YAML, you can provide the policy in JSON or YAML format. CloudFormation always converts a YAML policy to JSON format before submitting it to IAM. The maximum length of the policy document that you can pass in this operation, including whitespace, is listed below. To view the maximum character counts of a managed policy with no whitespaces, see IAM and STS character quotas. To learn more about JSON policy grammar, see Grammar of the IAM JSON policy language in the IAM User Guide.  The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    PolicyDocument: policyDocumentType;
    /**
     * A friendly description of the policy. Typically used to store information about the permissions defined in the policy. For example, "Grants access to production DynamoDB tables." The policy description is immutable. After a value is assigned, it cannot be changed.
     */
    Description?: policyDescriptionType;
    /**
     * A list of tags that you want to attach to the new IAM customer managed policy. Each tag consists of a key name and an associated value. For more information about tagging, see Tagging IAM resources in the IAM User Guide.  If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. 
     */
    Tags?: tagListType;
  }
  export interface CreatePolicyResponse {
    /**
     * A structure containing details about the new policy.
     */
    Policy?: Policy;
  }
  export interface CreatePolicyVersionRequest {
    /**
     * The Amazon Resource Name (ARN) of the IAM policy to which you want to add a new version. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicyArn: arnType;
    /**
     * The JSON policy document that you want to use as the content for this new version of the policy. You must provide policies in JSON format in IAM. However, for CloudFormation templates formatted in YAML, you can provide the policy in JSON or YAML format. CloudFormation always converts a YAML policy to JSON format before submitting it to IAM. The maximum length of the policy document that you can pass in this operation, including whitespace, is listed below. To view the maximum character counts of a managed policy with no whitespaces, see IAM and STS character quotas. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    PolicyDocument: policyDocumentType;
    /**
     * Specifies whether to set this version as the policy's default version. When this parameter is true, the new policy version becomes the operative version. That is, it becomes the version that is in effect for the IAM users, groups, and roles that the policy is attached to. For more information about managed policy versions, see Versioning for managed policies in the IAM User Guide.
     */
    SetAsDefault?: booleanType;
  }
  export interface CreatePolicyVersionResponse {
    /**
     * A structure containing details about the new policy version.
     */
    PolicyVersion?: PolicyVersion;
  }
  export interface CreateRoleRequest {
    /**
     *  The path to the role. For more information about paths, see IAM Identifiers in the IAM User Guide. This parameter is optional. If it is not included, it defaults to a slash (/). This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    Path?: pathType;
    /**
     * The name of the role to create. IAM user, group, role, and policy names must be unique within the account. Names are not distinguished by case. For example, you cannot create resources named both "MyResource" and "myresource". This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
    /**
     * The trust relationship policy document that grants an entity permission to assume the role. In IAM, you must provide a JSON policy that has been converted to a string. However, for CloudFormation templates formatted in YAML, you can provide the policy in JSON or YAML format. CloudFormation always converts a YAML policy to JSON format before submitting it to IAM. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)    Upon success, the response includes the same trust policy in JSON format.
     */
    AssumeRolePolicyDocument: policyDocumentType;
    /**
     * A description of the role.
     */
    Description?: roleDescriptionType;
    /**
     * The maximum session duration (in seconds) that you want to set for the specified role. If you do not specify a value for this setting, the default value of one hour is applied. This setting can have a value from 1 hour to 12 hours. Anyone who assumes the role from the CLI or API can use the DurationSeconds API parameter or the duration-seconds CLI parameter to request a longer session. The MaxSessionDuration setting determines the maximum duration that can be requested using the DurationSeconds parameter. If users don't specify a value for the DurationSeconds parameter, their security credentials are valid for one hour by default. This applies when you use the AssumeRole* API operations or the assume-role* CLI operations but does not apply when you use those operations to create a console URL. For more information, see Using IAM roles in the IAM User Guide.
     */
    MaxSessionDuration?: roleMaxSessionDurationType;
    /**
     * The ARN of the managed policy that is used to set the permissions boundary for the role. A permissions boundary policy defines the maximum permissions that identity-based policies can grant to an entity, but does not grant permissions. Permissions boundaries do not define the maximum permissions that a resource-based policy can grant to an entity. To learn more, see Permissions boundaries for IAM entities in the IAM User Guide. For more information about policy types, see Policy types  in the IAM User Guide.
     */
    PermissionsBoundary?: arnType;
    /**
     * A list of tags that you want to attach to the new role. Each tag consists of a key name and an associated value. For more information about tagging, see Tagging IAM resources in the IAM User Guide.  If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. 
     */
    Tags?: tagListType;
  }
  export interface CreateRoleResponse {
    /**
     * A structure containing details about the new role.
     */
    Role: Role;
  }
  export interface CreateSAMLProviderRequest {
    /**
     * An XML document generated by an identity provider (IdP) that supports SAML 2.0. The document includes the issuer's name, expiration information, and keys that can be used to validate the SAML authentication response (assertions) that are received from the IdP. You must generate the metadata document using the identity management software that is used as your organization's IdP. For more information, see About SAML 2.0-based federation in the IAM User Guide 
     */
    SAMLMetadataDocument: SAMLMetadataDocumentType;
    /**
     * The name of the provider to create. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    Name: SAMLProviderNameType;
    /**
     * A list of tags that you want to attach to the new IAM SAML provider. Each tag consists of a key name and an associated value. For more information about tagging, see Tagging IAM resources in the IAM User Guide.  If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. 
     */
    Tags?: tagListType;
  }
  export interface CreateSAMLProviderResponse {
    /**
     * The Amazon Resource Name (ARN) of the new SAML provider resource in IAM.
     */
    SAMLProviderArn?: arnType;
    /**
     * A list of tags that are attached to the new IAM SAML provider. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
     */
    Tags?: tagListType;
  }
  export interface CreateServiceLinkedRoleRequest {
    /**
     * The service principal for the Amazon Web Services service to which this role is attached. You use a string similar to a URL but without the http:// in front. For example: elasticbeanstalk.amazonaws.com.  Service principals are unique and case-sensitive. To find the exact service principal for your service-linked role, see Amazon Web Services services that work with IAM in the IAM User Guide. Look for the services that have Yes in the Service-Linked Role column. Choose the Yes link to view the service-linked role documentation for that service.
     */
    AWSServiceName: groupNameType;
    /**
     * The description of the role.
     */
    Description?: roleDescriptionType;
    /**
     *  A string that you provide, which is combined with the service-provided prefix to form the complete role name. If you make multiple requests for the same service, then you must supply a different CustomSuffix for each request. Otherwise the request fails with a duplicate role name error. For example, you could add -1 or -debug to the suffix. Some services do not support the CustomSuffix parameter. If you provide an optional suffix and the operation fails, try the operation again without the suffix.
     */
    CustomSuffix?: customSuffixType;
  }
  export interface CreateServiceLinkedRoleResponse {
    /**
     * A Role object that contains details about the newly created role.
     */
    Role?: Role;
  }
  export interface CreateServiceSpecificCredentialRequest {
    /**
     * The name of the IAM user that is to be associated with the credentials. The new service-specific credentials have the same permissions as the associated user except that they can be used only to access the specified service. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: userNameType;
    /**
     * The name of the Amazon Web Services service that is to be associated with the credentials. The service you specify here is the only service that can be accessed using these credentials.
     */
    ServiceName: serviceName;
  }
  export interface CreateServiceSpecificCredentialResponse {
    /**
     * A structure that contains information about the newly created service-specific credential.  This is the only time that the password for this credential set is available. It cannot be recovered later. Instead, you must reset the password with ResetServiceSpecificCredential. 
     */
    ServiceSpecificCredential?: ServiceSpecificCredential;
  }
  export interface CreateUserRequest {
    /**
     *  The path for the user name. For more information about paths, see IAM identifiers in the IAM User Guide. This parameter is optional. If it is not included, it defaults to a slash (/). This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    Path?: pathType;
    /**
     * The name of the user to create. IAM user, group, role, and policy names must be unique within the account. Names are not distinguished by case. For example, you cannot create resources named both "MyResource" and "myresource".
     */
    UserName: userNameType;
    /**
     * The ARN of the managed policy that is used to set the permissions boundary for the user. A permissions boundary policy defines the maximum permissions that identity-based policies can grant to an entity, but does not grant permissions. Permissions boundaries do not define the maximum permissions that a resource-based policy can grant to an entity. To learn more, see Permissions boundaries for IAM entities in the IAM User Guide. For more information about policy types, see Policy types  in the IAM User Guide.
     */
    PermissionsBoundary?: arnType;
    /**
     * A list of tags that you want to attach to the new user. Each tag consists of a key name and an associated value. For more information about tagging, see Tagging IAM resources in the IAM User Guide.  If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. 
     */
    Tags?: tagListType;
  }
  export interface CreateUserResponse {
    /**
     * A structure with details about the new IAM user.
     */
    User?: User;
  }
  export interface CreateVirtualMFADeviceRequest {
    /**
     *  The path for the virtual MFA device. For more information about paths, see IAM identifiers in the IAM User Guide. This parameter is optional. If it is not included, it defaults to a slash (/). This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    Path?: pathType;
    /**
     * The name of the virtual MFA device, which must be unique. Use with path to uniquely identify a virtual MFA device. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    VirtualMFADeviceName: virtualMFADeviceName;
    /**
     * A list of tags that you want to attach to the new IAM virtual MFA device. Each tag consists of a key name and an associated value. For more information about tagging, see Tagging IAM resources in the IAM User Guide.  If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. 
     */
    Tags?: tagListType;
  }
  export interface CreateVirtualMFADeviceResponse {
    /**
     * A structure containing details about the new virtual MFA device.
     */
    VirtualMFADevice: VirtualMFADevice;
  }
  export interface DeactivateMFADeviceRequest {
    /**
     * The name of the user whose MFA device you want to deactivate. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: existingUserNameType;
    /**
     * The serial number that uniquely identifies the MFA device. For virtual MFA devices, the serial number is the device ARN. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: =,.@:/-
     */
    SerialNumber: serialNumberType;
  }
  export interface DeleteAccessKeyRequest {
    /**
     * The name of the user whose access key pair you want to delete. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName?: existingUserNameType;
    /**
     * The access key ID for the access key ID and secret access key you want to delete. This parameter allows (through its regex pattern) a string of characters that can consist of any upper or lowercased letter or digit.
     */
    AccessKeyId: accessKeyIdType;
  }
  export interface DeleteAccountAliasRequest {
    /**
     * The name of the account alias to delete. This parameter allows (through its regex pattern) a string of characters consisting of lowercase letters, digits, and dashes. You cannot start or finish with a dash, nor can you have two dashes in a row.
     */
    AccountAlias: accountAliasType;
  }
  export interface DeleteGroupPolicyRequest {
    /**
     * The name (friendly name, not ARN) identifying the group that the policy is embedded in. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    GroupName: groupNameType;
    /**
     * The name identifying the policy document to delete. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    PolicyName: policyNameType;
  }
  export interface DeleteGroupRequest {
    /**
     * The name of the IAM group to delete. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    GroupName: groupNameType;
  }
  export interface DeleteInstanceProfileRequest {
    /**
     * The name of the instance profile to delete. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    InstanceProfileName: instanceProfileNameType;
  }
  export interface DeleteLoginProfileRequest {
    /**
     * The name of the user whose password you want to delete. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: userNameType;
  }
  export interface DeleteOpenIDConnectProviderRequest {
    /**
     * The Amazon Resource Name (ARN) of the IAM OpenID Connect provider resource object to delete. You can get a list of OpenID Connect provider resource ARNs by using the ListOpenIDConnectProviders operation.
     */
    OpenIDConnectProviderArn: arnType;
  }
  export interface DeletePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the IAM policy you want to delete. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicyArn: arnType;
  }
  export interface DeletePolicyVersionRequest {
    /**
     * The Amazon Resource Name (ARN) of the IAM policy from which you want to delete a version. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicyArn: arnType;
    /**
     * The policy version to delete. This parameter allows (through its regex pattern) a string of characters that consists of the lowercase letter 'v' followed by one or two digits, and optionally followed by a period '.' and a string of letters and digits. For more information about managed policy versions, see Versioning for managed policies in the IAM User Guide.
     */
    VersionId: policyVersionIdType;
  }
  export interface DeleteRolePermissionsBoundaryRequest {
    /**
     * The name (friendly name, not ARN) of the IAM role from which you want to remove the permissions boundary.
     */
    RoleName: roleNameType;
  }
  export interface DeleteRolePolicyRequest {
    /**
     * The name (friendly name, not ARN) identifying the role that the policy is embedded in. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
    /**
     * The name of the inline policy to delete from the specified IAM role. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    PolicyName: policyNameType;
  }
  export interface DeleteRoleRequest {
    /**
     * The name of the role to delete. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
  }
  export interface DeleteSAMLProviderRequest {
    /**
     * The Amazon Resource Name (ARN) of the SAML provider to delete.
     */
    SAMLProviderArn: arnType;
  }
  export interface DeleteSSHPublicKeyRequest {
    /**
     * The name of the IAM user associated with the SSH public key. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: userNameType;
    /**
     * The unique identifier for the SSH public key. This parameter allows (through its regex pattern) a string of characters that can consist of any upper or lowercased letter or digit.
     */
    SSHPublicKeyId: publicKeyIdType;
  }
  export interface DeleteServerCertificateRequest {
    /**
     * The name of the server certificate you want to delete. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    ServerCertificateName: serverCertificateNameType;
  }
  export interface DeleteServiceLinkedRoleRequest {
    /**
     * The name of the service-linked role to be deleted.
     */
    RoleName: roleNameType;
  }
  export interface DeleteServiceLinkedRoleResponse {
    /**
     * The deletion task identifier that you can use to check the status of the deletion. This identifier is returned in the format task/aws-service-role/&lt;service-principal-name&gt;/&lt;role-name&gt;/&lt;task-uuid&gt;.
     */
    DeletionTaskId: DeletionTaskIdType;
  }
  export interface DeleteServiceSpecificCredentialRequest {
    /**
     * The name of the IAM user associated with the service-specific credential. If this value is not specified, then the operation assumes the user whose credentials are used to call the operation. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName?: userNameType;
    /**
     * The unique identifier of the service-specific credential. You can get this value by calling ListServiceSpecificCredentials. This parameter allows (through its regex pattern) a string of characters that can consist of any upper or lowercased letter or digit.
     */
    ServiceSpecificCredentialId: serviceSpecificCredentialId;
  }
  export interface DeleteSigningCertificateRequest {
    /**
     * The name of the user the signing certificate belongs to. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName?: existingUserNameType;
    /**
     * The ID of the signing certificate to delete. The format of this parameter, as described by its regex pattern, is a string of characters that can be upper- or lower-cased letters or digits.
     */
    CertificateId: certificateIdType;
  }
  export interface DeleteUserPermissionsBoundaryRequest {
    /**
     * The name (friendly name, not ARN) of the IAM user from which you want to remove the permissions boundary.
     */
    UserName: userNameType;
  }
  export interface DeleteUserPolicyRequest {
    /**
     * The name (friendly name, not ARN) identifying the user that the policy is embedded in. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: existingUserNameType;
    /**
     * The name identifying the policy document to delete. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    PolicyName: policyNameType;
  }
  export interface DeleteUserRequest {
    /**
     * The name of the user to delete. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: existingUserNameType;
  }
  export interface DeleteVirtualMFADeviceRequest {
    /**
     * The serial number that uniquely identifies the MFA device. For virtual MFA devices, the serial number is the same as the ARN. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: =,.@:/-
     */
    SerialNumber: serialNumberType;
  }
  export interface DeletionTaskFailureReasonType {
    /**
     * A short description of the reason that the service-linked role deletion failed.
     */
    Reason?: ReasonType;
    /**
     * A list of objects that contains details about the service-linked role deletion failure, if that information is returned by the service. If the service-linked role has active sessions or if any resources that were used by the role have not been deleted from the linked service, the role can't be deleted. This parameter includes a list of the resources that are associated with the role and the Region in which the resources are being used.
     */
    RoleUsageList?: RoleUsageListType;
  }
  export type DeletionTaskIdType = string;
  export type DeletionTaskStatusType = "SUCCEEDED"|"IN_PROGRESS"|"FAILED"|"NOT_STARTED"|string;
  export interface DetachGroupPolicyRequest {
    /**
     * The name (friendly name, not ARN) of the IAM group to detach the policy from. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    GroupName: groupNameType;
    /**
     * The Amazon Resource Name (ARN) of the IAM policy you want to detach. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicyArn: arnType;
  }
  export interface DetachRolePolicyRequest {
    /**
     * The name (friendly name, not ARN) of the IAM role to detach the policy from. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
    /**
     * The Amazon Resource Name (ARN) of the IAM policy you want to detach. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicyArn: arnType;
  }
  export interface DetachUserPolicyRequest {
    /**
     * The name (friendly name, not ARN) of the IAM user to detach the policy from. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: userNameType;
    /**
     * The Amazon Resource Name (ARN) of the IAM policy you want to detach. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicyArn: arnType;
  }
  export interface EnableMFADeviceRequest {
    /**
     * The name of the IAM user for whom you want to enable the MFA device. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: existingUserNameType;
    /**
     * The serial number that uniquely identifies the MFA device. For virtual MFA devices, the serial number is the device ARN. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: =,.@:/-
     */
    SerialNumber: serialNumberType;
    /**
     * An authentication code emitted by the device.  The format for this parameter is a string of six digits.  Submit your request immediately after generating the authentication codes. If you generate the codes and then wait too long to submit the request, the MFA device successfully associates with the user but the MFA device becomes out of sync. This happens because time-based one-time passwords (TOTP) expire after a short period of time. If this happens, you can resync the device. 
     */
    AuthenticationCode1: authenticationCodeType;
    /**
     * A subsequent authentication code emitted by the device. The format for this parameter is a string of six digits.  Submit your request immediately after generating the authentication codes. If you generate the codes and then wait too long to submit the request, the MFA device successfully associates with the user but the MFA device becomes out of sync. This happens because time-based one-time passwords (TOTP) expire after a short period of time. If this happens, you can resync the device. 
     */
    AuthenticationCode2: authenticationCodeType;
  }
  export interface EntityDetails {
    /**
     * The EntityInfo object that contains details about the entity (user or role).
     */
    EntityInfo: EntityInfo;
    /**
     * The date and time, in ISO 8601 date-time format, when the authenticated entity last attempted to access Amazon Web Services. Amazon Web Services does not report unauthenticated requests. This field is null if no IAM entities attempted to access the service within the tracking period.
     */
    LastAuthenticated?: dateType;
  }
  export interface EntityInfo {
    Arn: arnType;
    /**
     * The name of the entity (user or role).
     */
    Name: userNameType;
    /**
     * The type of entity (user or role).
     */
    Type: policyOwnerEntityType;
    /**
     * The identifier of the entity (user or role).
     */
    Id: idType;
    /**
     * The path to the entity (user or role). For more information about paths, see IAM identifiers in the IAM User Guide. 
     */
    Path?: pathType;
  }
  export type EntityType = "User"|"Role"|"Group"|"LocalManagedPolicy"|"AWSManagedPolicy"|string;
  export interface ErrorDetails {
    /**
     * Detailed information about the reason that the operation failed.
     */
    Message: stringType;
    /**
     * The error code associated with the operation failure.
     */
    Code: stringType;
  }
  export type EvalDecisionDetailsType = {[key: string]: PolicyEvaluationDecisionType};
  export type EvalDecisionSourceType = string;
  export interface EvaluationResult {
    /**
     * The name of the API operation tested on the indicated resource.
     */
    EvalActionName: ActionNameType;
    /**
     * The ARN of the resource that the indicated API operation was tested on.
     */
    EvalResourceName?: ResourceNameType;
    /**
     * The result of the simulation.
     */
    EvalDecision: PolicyEvaluationDecisionType;
    /**
     * A list of the statements in the input policies that determine the result for this scenario. Remember that even if multiple statements allow the operation on the resource, if only one statement denies that operation, then the explicit deny overrides any allow. In addition, the deny statement is the only entry included in the result.
     */
    MatchedStatements?: StatementListType;
    /**
     * A list of context keys that are required by the included input policies but that were not provided by one of the input parameters. This list is used when the resource in a simulation is "*", either explicitly, or when the ResourceArns parameter blank. If you include a list of resources, then any missing context values are instead included under the ResourceSpecificResults section. To discover the context keys used by a set of policies, you can call GetContextKeysForCustomPolicy or GetContextKeysForPrincipalPolicy.
     */
    MissingContextValues?: ContextKeyNamesResultListType;
    /**
     * A structure that details how Organizations and its service control policies affect the results of the simulation. Only applies if the simulated user's account is part of an organization.
     */
    OrganizationsDecisionDetail?: OrganizationsDecisionDetail;
    /**
     * Contains information about the effect that a permissions boundary has on a policy simulation when the boundary is applied to an IAM entity.
     */
    PermissionsBoundaryDecisionDetail?: PermissionsBoundaryDecisionDetail;
    /**
     * Additional details about the results of the cross-account evaluation decision. This parameter is populated for only cross-account simulations. It contains a brief summary of how each policy type contributes to the final evaluation decision. If the simulation evaluates policies within the same account and includes a resource ARN, then the parameter is present but the response is empty. If the simulation evaluates policies within the same account and specifies all resources (*), then the parameter is not returned. When you make a cross-account request, Amazon Web Services evaluates the request in the trusting account and the trusted account. The request is allowed only if both evaluations return true. For more information about how policies are evaluated, see Evaluating policies within a single account. If an Organizations SCP included in the evaluation denies access, the simulation ends. In this case, policy evaluation does not proceed any further and this parameter is not returned.
     */
    EvalDecisionDetails?: EvalDecisionDetailsType;
    /**
     * The individual results of the simulation of the API operation specified in EvalActionName on each resource.
     */
    ResourceSpecificResults?: ResourceSpecificResultListType;
  }
  export type EvaluationResultsListType = EvaluationResult[];
  export interface GenerateCredentialReportResponse {
    /**
     * Information about the state of the credential report.
     */
    State?: ReportStateType;
    /**
     * Information about the credential report.
     */
    Description?: ReportStateDescriptionType;
  }
  export interface GenerateOrganizationsAccessReportRequest {
    /**
     * The path of the Organizations entity (root, OU, or account). You can build an entity path using the known structure of your organization. For example, assume that your account ID is 123456789012 and its parent OU ID is ou-rge0-awsabcde. The organization root ID is r-f6g7h8i9j0example and your organization ID is o-a1b2c3d4e5. Your entity path is o-a1b2c3d4e5/r-f6g7h8i9j0example/ou-rge0-awsabcde/123456789012.
     */
    EntityPath: organizationsEntityPathType;
    /**
     * The identifier of the Organizations service control policy (SCP). This parameter is optional. This ID is used to generate information about when an account principal that is limited by the SCP attempted to access an Amazon Web Services service.
     */
    OrganizationsPolicyId?: organizationsPolicyIdType;
  }
  export interface GenerateOrganizationsAccessReportResponse {
    /**
     * The job identifier that you can use in the GetOrganizationsAccessReport operation.
     */
    JobId?: jobIDType;
  }
  export interface GenerateServiceLastAccessedDetailsRequest {
    /**
     * The ARN of the IAM resource (user, group, role, or managed policy) used to generate information about when the resource was last used in an attempt to access an Amazon Web Services service.
     */
    Arn: arnType;
    /**
     * The level of detail that you want to generate. You can specify whether you want to generate information about the last attempt to access services or actions. If you specify service-level granularity, this operation generates only service data. If you specify action-level granularity, it generates service and action data. If you don't include this optional parameter, the operation generates service data.
     */
    Granularity?: AccessAdvisorUsageGranularityType;
  }
  export interface GenerateServiceLastAccessedDetailsResponse {
    /**
     * The JobId that you can use in the GetServiceLastAccessedDetails or GetServiceLastAccessedDetailsWithEntities operations. The JobId returned by GenerateServiceLastAccessedDetail must be used by the same role within a session, or by the same user when used to call GetServiceLastAccessedDetail.
     */
    JobId?: jobIDType;
  }
  export interface GetAccessKeyLastUsedRequest {
    /**
     * The identifier of an access key. This parameter allows (through its regex pattern) a string of characters that can consist of any upper or lowercased letter or digit.
     */
    AccessKeyId: accessKeyIdType;
  }
  export interface GetAccessKeyLastUsedResponse {
    /**
     * The name of the IAM user that owns this access key. 
     */
    UserName?: existingUserNameType;
    /**
     * Contains information about the last time the access key was used.
     */
    AccessKeyLastUsed?: AccessKeyLastUsed;
  }
  export interface GetAccountAuthorizationDetailsRequest {
    /**
     * A list of entity types used to filter the results. Only the entities that match the types you specify are included in the output. Use the value LocalManagedPolicy to include customer managed policies. The format for this parameter is a comma-separated (if more than one) list of strings. Each string value in the list must be one of the valid values listed below.
     */
    Filter?: entityListType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
  }
  export interface GetAccountAuthorizationDetailsResponse {
    /**
     * A list containing information about IAM users.
     */
    UserDetailList?: userDetailListType;
    /**
     * A list containing information about IAM groups.
     */
    GroupDetailList?: groupDetailListType;
    /**
     * A list containing information about IAM roles.
     */
    RoleDetailList?: roleDetailListType;
    /**
     * A list containing information about managed policies.
     */
    Policies?: ManagedPolicyDetailListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface GetAccountPasswordPolicyResponse {
    /**
     * A structure that contains details about the account's password policy.
     */
    PasswordPolicy: PasswordPolicy;
  }
  export interface GetAccountSummaryResponse {
    /**
     * A set of key–value pairs containing information about IAM entity usage and IAM quotas.
     */
    SummaryMap?: summaryMapType;
  }
  export interface GetContextKeysForCustomPolicyRequest {
    /**
     * A list of policies for which you want the list of context keys referenced in those policies. Each document is specified as a string containing the complete, valid JSON text of an IAM policy. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    PolicyInputList: SimulationPolicyListType;
  }
  export interface GetContextKeysForPolicyResponse {
    /**
     * The list of context keys that are referenced in the input policies.
     */
    ContextKeyNames?: ContextKeyNamesResultListType;
  }
  export interface GetContextKeysForPrincipalPolicyRequest {
    /**
     * The ARN of a user, group, or role whose policies contain the context keys that you want listed. If you specify a user, the list includes context keys that are found in all policies that are attached to the user. The list also includes all groups that the user is a member of. If you pick a group or a role, then it includes only those context keys that are found in policies attached to that entity. Note that all parameters are shown in unencoded form here for clarity, but must be URL encoded to be included as a part of a real HTML request. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicySourceArn: arnType;
    /**
     * An optional list of additional policies for which you want the list of context keys that are referenced. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    PolicyInputList?: SimulationPolicyListType;
  }
  export interface GetCredentialReportResponse {
    /**
     * Contains the credential report. The report is Base64-encoded.
     */
    Content?: ReportContentType;
    /**
     * The format (MIME type) of the credential report.
     */
    ReportFormat?: ReportFormatType;
    /**
     *  The date and time when the credential report was created, in ISO 8601 date-time format.
     */
    GeneratedTime?: dateType;
  }
  export interface GetGroupPolicyRequest {
    /**
     * The name of the group the policy is associated with. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    GroupName: groupNameType;
    /**
     * The name of the policy document to get. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    PolicyName: policyNameType;
  }
  export interface GetGroupPolicyResponse {
    /**
     * The group the policy is associated with.
     */
    GroupName: groupNameType;
    /**
     * The name of the policy.
     */
    PolicyName: policyNameType;
    /**
     * The policy document. IAM stores policies in JSON format. However, resources that were created using CloudFormation templates can be formatted in YAML. CloudFormation always converts a YAML policy to JSON format before submitting it to IAM.
     */
    PolicyDocument: policyDocumentType;
  }
  export interface GetGroupRequest {
    /**
     * The name of the group. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    GroupName: groupNameType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface GetGroupResponse {
    /**
     * A structure that contains details about the group.
     */
    Group: Group;
    /**
     * A list of users in the group.
     */
    Users: userListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface GetInstanceProfileRequest {
    /**
     * The name of the instance profile to get information about. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    InstanceProfileName: instanceProfileNameType;
  }
  export interface GetInstanceProfileResponse {
    /**
     * A structure containing details about the instance profile.
     */
    InstanceProfile: InstanceProfile;
  }
  export interface GetLoginProfileRequest {
    /**
     * The name of the user whose login profile you want to retrieve. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: userNameType;
  }
  export interface GetLoginProfileResponse {
    /**
     * A structure containing the user name and the profile creation date for the user.
     */
    LoginProfile: LoginProfile;
  }
  export interface GetMFADeviceRequest {
    /**
     * Serial number that uniquely identifies the MFA device. For this API, we only accept FIDO security key ARNs.
     */
    SerialNumber: serialNumberType;
    /**
     * The friendly name identifying the user.
     */
    UserName?: userNameType;
  }
  export interface GetMFADeviceResponse {
    /**
     * The friendly name identifying the user.
     */
    UserName?: userNameType;
    /**
     * Serial number that uniquely identifies the MFA device. For this API, we only accept FIDO security key ARNs.
     */
    SerialNumber: serialNumberType;
    /**
     * The date that a specified user's MFA device was first enabled.
     */
    EnableDate?: dateType;
    /**
     * The certifications of a specified user's MFA device. We currently provide FIPS-140-2, FIPS-140-3, and FIDO certification levels obtained from  FIDO Alliance Metadata Service (MDS).
     */
    Certifications?: CertificationMapType;
  }
  export interface GetOpenIDConnectProviderRequest {
    /**
     * The Amazon Resource Name (ARN) of the OIDC provider resource object in IAM to get information for. You can get a list of OIDC provider resource ARNs by using the ListOpenIDConnectProviders operation. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    OpenIDConnectProviderArn: arnType;
  }
  export interface GetOpenIDConnectProviderResponse {
    /**
     * The URL that the IAM OIDC provider resource object is associated with. For more information, see CreateOpenIDConnectProvider.
     */
    Url?: OpenIDConnectProviderUrlType;
    /**
     * A list of client IDs (also known as audiences) that are associated with the specified IAM OIDC provider resource object. For more information, see CreateOpenIDConnectProvider.
     */
    ClientIDList?: clientIDListType;
    /**
     * A list of certificate thumbprints that are associated with the specified IAM OIDC provider resource object. For more information, see CreateOpenIDConnectProvider. 
     */
    ThumbprintList?: thumbprintListType;
    /**
     * The date and time when the IAM OIDC provider resource object was created in the Amazon Web Services account.
     */
    CreateDate?: dateType;
    /**
     * A list of tags that are attached to the specified IAM OIDC provider. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
     */
    Tags?: tagListType;
  }
  export interface GetOrganizationsAccessReportRequest {
    /**
     * The identifier of the request generated by the GenerateOrganizationsAccessReport operation.
     */
    JobId: jobIDType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * The key that is used to sort the results. If you choose the namespace key, the results are returned in alphabetical order. If you choose the time key, the results are sorted numerically by the date and time.
     */
    SortKey?: sortKeyType;
  }
  export interface GetOrganizationsAccessReportResponse {
    /**
     * The status of the job.
     */
    JobStatus: jobStatusType;
    /**
     * The date and time, in ISO 8601 date-time format, when the report job was created.
     */
    JobCreationDate: dateType;
    /**
     * The date and time, in ISO 8601 date-time format, when the generated report job was completed or failed. This field is null if the job is still in progress, as indicated by a job status value of IN_PROGRESS.
     */
    JobCompletionDate?: dateType;
    /**
     * The number of services that the applicable SCPs allow account principals to access.
     */
    NumberOfServicesAccessible?: integerType;
    /**
     * The number of services that account principals are allowed but did not attempt to access.
     */
    NumberOfServicesNotAccessed?: integerType;
    /**
     * An object that contains details about the most recent attempt to access the service.
     */
    AccessDetails?: AccessDetails;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: markerType;
    ErrorDetails?: ErrorDetails;
  }
  export interface GetPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the managed policy that you want information about. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicyArn: arnType;
  }
  export interface GetPolicyResponse {
    /**
     * A structure containing details about the policy.
     */
    Policy?: Policy;
  }
  export interface GetPolicyVersionRequest {
    /**
     * The Amazon Resource Name (ARN) of the managed policy that you want information about. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicyArn: arnType;
    /**
     * Identifies the policy version to retrieve. This parameter allows (through its regex pattern) a string of characters that consists of the lowercase letter 'v' followed by one or two digits, and optionally followed by a period '.' and a string of letters and digits.
     */
    VersionId: policyVersionIdType;
  }
  export interface GetPolicyVersionResponse {
    /**
     * A structure containing details about the policy version.
     */
    PolicyVersion?: PolicyVersion;
  }
  export interface GetRolePolicyRequest {
    /**
     * The name of the role associated with the policy. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
    /**
     * The name of the policy document to get. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    PolicyName: policyNameType;
  }
  export interface GetRolePolicyResponse {
    /**
     * The role the policy is associated with.
     */
    RoleName: roleNameType;
    /**
     * The name of the policy.
     */
    PolicyName: policyNameType;
    /**
     * The policy document. IAM stores policies in JSON format. However, resources that were created using CloudFormation templates can be formatted in YAML. CloudFormation always converts a YAML policy to JSON format before submitting it to IAM.
     */
    PolicyDocument: policyDocumentType;
  }
  export interface GetRoleRequest {
    /**
     * The name of the IAM role to get information about. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
  }
  export interface GetRoleResponse {
    /**
     * A structure containing details about the IAM role.
     */
    Role: Role;
  }
  export interface GetSAMLProviderRequest {
    /**
     * The Amazon Resource Name (ARN) of the SAML provider resource object in IAM to get information about. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    SAMLProviderArn: arnType;
  }
  export interface GetSAMLProviderResponse {
    /**
     * The XML metadata document that includes information about an identity provider.
     */
    SAMLMetadataDocument?: SAMLMetadataDocumentType;
    /**
     * The date and time when the SAML provider was created.
     */
    CreateDate?: dateType;
    /**
     * The expiration date and time for the SAML provider.
     */
    ValidUntil?: dateType;
    /**
     * A list of tags that are attached to the specified IAM SAML provider. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
     */
    Tags?: tagListType;
  }
  export interface GetSSHPublicKeyRequest {
    /**
     * The name of the IAM user associated with the SSH public key. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: userNameType;
    /**
     * The unique identifier for the SSH public key. This parameter allows (through its regex pattern) a string of characters that can consist of any upper or lowercased letter or digit.
     */
    SSHPublicKeyId: publicKeyIdType;
    /**
     * Specifies the public key encoding format to use in the response. To retrieve the public key in ssh-rsa format, use SSH. To retrieve the public key in PEM format, use PEM.
     */
    Encoding: encodingType;
  }
  export interface GetSSHPublicKeyResponse {
    /**
     * A structure containing details about the SSH public key.
     */
    SSHPublicKey?: SSHPublicKey;
  }
  export interface GetServerCertificateRequest {
    /**
     * The name of the server certificate you want to retrieve information about. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    ServerCertificateName: serverCertificateNameType;
  }
  export interface GetServerCertificateResponse {
    /**
     * A structure containing details about the server certificate.
     */
    ServerCertificate: ServerCertificate;
  }
  export interface GetServiceLastAccessedDetailsRequest {
    /**
     * The ID of the request generated by the GenerateServiceLastAccessedDetails operation. The JobId returned by GenerateServiceLastAccessedDetail must be used by the same role within a session, or by the same user when used to call GetServiceLastAccessedDetail.
     */
    JobId: jobIDType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
  }
  export interface GetServiceLastAccessedDetailsResponse {
    /**
     * The status of the job.
     */
    JobStatus: jobStatusType;
    /**
     * The type of job. Service jobs return information about when each service was last accessed. Action jobs also include information about when tracked actions within the service were last accessed.
     */
    JobType?: AccessAdvisorUsageGranularityType;
    /**
     * The date and time, in ISO 8601 date-time format, when the report job was created.
     */
    JobCreationDate: dateType;
    /**
     *  A ServiceLastAccessed object that contains details about the most recent attempt to access the service.
     */
    ServicesLastAccessed: ServicesLastAccessed;
    /**
     * The date and time, in ISO 8601 date-time format, when the generated report job was completed or failed. This field is null if the job is still in progress, as indicated by a job status value of IN_PROGRESS.
     */
    JobCompletionDate: dateType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
    /**
     * An object that contains details about the reason the operation failed.
     */
    Error?: ErrorDetails;
  }
  export interface GetServiceLastAccessedDetailsWithEntitiesRequest {
    /**
     * The ID of the request generated by the GenerateServiceLastAccessedDetails operation.
     */
    JobId: jobIDType;
    /**
     * The service namespace for an Amazon Web Services service. Provide the service namespace to learn when the IAM entity last attempted to access the specified service. To learn the service namespace for a service, see Actions, resources, and condition keys for Amazon Web Services services in the IAM User Guide. Choose the name of the service to view details for that service. In the first paragraph, find the service prefix. For example, (service prefix: a4b). For more information about service namespaces, see Amazon Web Services service namespaces in the Amazon Web Services General Reference.
     */
    ServiceNamespace: serviceNamespaceType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
  }
  export interface GetServiceLastAccessedDetailsWithEntitiesResponse {
    /**
     * The status of the job.
     */
    JobStatus: jobStatusType;
    /**
     * The date and time, in ISO 8601 date-time format, when the report job was created.
     */
    JobCreationDate: dateType;
    /**
     * The date and time, in ISO 8601 date-time format, when the generated report job was completed or failed. This field is null if the job is still in progress, as indicated by a job status value of IN_PROGRESS.
     */
    JobCompletionDate: dateType;
    /**
     * An EntityDetailsList object that contains details about when an IAM entity (user or role) used group or policy permissions in an attempt to access the specified Amazon Web Services service.
     */
    EntityDetailsList: entityDetailsListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
    /**
     * An object that contains details about the reason the operation failed.
     */
    Error?: ErrorDetails;
  }
  export interface GetServiceLinkedRoleDeletionStatusRequest {
    /**
     * The deletion task identifier. This identifier is returned by the DeleteServiceLinkedRole operation in the format task/aws-service-role/&lt;service-principal-name&gt;/&lt;role-name&gt;/&lt;task-uuid&gt;.
     */
    DeletionTaskId: DeletionTaskIdType;
  }
  export interface GetServiceLinkedRoleDeletionStatusResponse {
    /**
     * The status of the deletion.
     */
    Status: DeletionTaskStatusType;
    /**
     * An object that contains details about the reason the deletion failed.
     */
    Reason?: DeletionTaskFailureReasonType;
  }
  export interface GetUserPolicyRequest {
    /**
     * The name of the user who the policy is associated with. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: existingUserNameType;
    /**
     * The name of the policy document to get. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    PolicyName: policyNameType;
  }
  export interface GetUserPolicyResponse {
    /**
     * The user the policy is associated with.
     */
    UserName: existingUserNameType;
    /**
     * The name of the policy.
     */
    PolicyName: policyNameType;
    /**
     * The policy document. IAM stores policies in JSON format. However, resources that were created using CloudFormation templates can be formatted in YAML. CloudFormation always converts a YAML policy to JSON format before submitting it to IAM.
     */
    PolicyDocument: policyDocumentType;
  }
  export interface GetUserRequest {
    /**
     * The name of the user to get information about. This parameter is optional. If it is not included, it defaults to the user making the request. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName?: existingUserNameType;
  }
  export interface GetUserResponse {
    /**
     * A structure containing details about the IAM user.  Due to a service issue, password last used data does not include password use from May 3, 2018 22:50 PDT to May 23, 2018 14:08 PDT. This affects last sign-in dates shown in the IAM console and password last used dates in the IAM credential report, and returned by this operation. If users signed in during the affected time, the password last used date that is returned is the date the user last signed in before May 3, 2018. For users that signed in after May 23, 2018 14:08 PDT, the returned password last used date is accurate. You can use password last used information to identify unused credentials for deletion. For example, you might delete users who did not sign in to Amazon Web Services in the last 90 days. In cases like this, we recommend that you adjust your evaluation window to include dates after May 23, 2018. Alternatively, if your users use access keys to access Amazon Web Services programmatically you can refer to access key last used information because it is accurate for all dates.  
     */
    User: User;
  }
  export interface Group {
    /**
     * The path to the group. For more information about paths, see IAM identifiers in the IAM User Guide. 
     */
    Path: pathType;
    /**
     * The friendly name that identifies the group.
     */
    GroupName: groupNameType;
    /**
     *  The stable and unique string identifying the group. For more information about IDs, see IAM identifiers in the IAM User Guide. 
     */
    GroupId: idType;
    /**
     *  The Amazon Resource Name (ARN) specifying the group. For more information about ARNs and how to use them in policies, see IAM identifiers in the IAM User Guide. 
     */
    Arn: arnType;
    /**
     * The date and time, in ISO 8601 date-time format, when the group was created.
     */
    CreateDate: dateType;
  }
  export interface GroupDetail {
    /**
     * The path to the group. For more information about paths, see IAM identifiers in the IAM User Guide.
     */
    Path?: pathType;
    /**
     * The friendly name that identifies the group.
     */
    GroupName?: groupNameType;
    /**
     * The stable and unique string identifying the group. For more information about IDs, see IAM identifiers in the IAM User Guide.
     */
    GroupId?: idType;
    Arn?: arnType;
    /**
     * The date and time, in ISO 8601 date-time format, when the group was created.
     */
    CreateDate?: dateType;
    /**
     * A list of the inline policies embedded in the group.
     */
    GroupPolicyList?: policyDetailListType;
    /**
     * A list of the managed policies attached to the group.
     */
    AttachedManagedPolicies?: attachedPoliciesListType;
  }
  export interface InstanceProfile {
    /**
     *  The path to the instance profile. For more information about paths, see IAM identifiers in the IAM User Guide. 
     */
    Path: pathType;
    /**
     * The name identifying the instance profile.
     */
    InstanceProfileName: instanceProfileNameType;
    /**
     *  The stable and unique string identifying the instance profile. For more information about IDs, see IAM identifiers in the IAM User Guide. 
     */
    InstanceProfileId: idType;
    /**
     *  The Amazon Resource Name (ARN) specifying the instance profile. For more information about ARNs and how to use them in policies, see IAM identifiers in the IAM User Guide. 
     */
    Arn: arnType;
    /**
     * The date when the instance profile was created.
     */
    CreateDate: dateType;
    /**
     * The role associated with the instance profile.
     */
    Roles: roleListType;
    /**
     * A list of tags that are attached to the instance profile. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
     */
    Tags?: tagListType;
  }
  export type LineNumber = number;
  export interface ListAccessKeysRequest {
    /**
     * The name of the user. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName?: existingUserNameType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListAccessKeysResponse {
    /**
     * A list of objects containing metadata about the access keys.
     */
    AccessKeyMetadata: accessKeyMetadataListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListAccountAliasesRequest {
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListAccountAliasesResponse {
    /**
     * A list of aliases associated with the account. Amazon Web Services supports only one alias per account.
     */
    AccountAliases: accountAliasListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListAttachedGroupPoliciesRequest {
    /**
     * The name (friendly name, not ARN) of the group to list attached policies for. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    GroupName: groupNameType;
    /**
     * The path prefix for filtering the results. This parameter is optional. If it is not included, it defaults to a slash (/), listing all policies. This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    PathPrefix?: policyPathType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListAttachedGroupPoliciesResponse {
    /**
     * A list of the attached policies.
     */
    AttachedPolicies?: attachedPoliciesListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListAttachedRolePoliciesRequest {
    /**
     * The name (friendly name, not ARN) of the role to list attached policies for. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
    /**
     * The path prefix for filtering the results. This parameter is optional. If it is not included, it defaults to a slash (/), listing all policies. This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    PathPrefix?: policyPathType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListAttachedRolePoliciesResponse {
    /**
     * A list of the attached policies.
     */
    AttachedPolicies?: attachedPoliciesListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListAttachedUserPoliciesRequest {
    /**
     * The name (friendly name, not ARN) of the user to list attached policies for. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: userNameType;
    /**
     * The path prefix for filtering the results. This parameter is optional. If it is not included, it defaults to a slash (/), listing all policies. This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    PathPrefix?: policyPathType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListAttachedUserPoliciesResponse {
    /**
     * A list of the attached policies.
     */
    AttachedPolicies?: attachedPoliciesListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListEntitiesForPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the IAM policy for which you want the versions. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicyArn: arnType;
    /**
     * The entity type to use for filtering the results. For example, when EntityFilter is Role, only the roles that are attached to the specified policy are returned. This parameter is optional. If it is not included, all attached entities (users, groups, and roles) are returned. The argument for this parameter must be one of the valid values listed below.
     */
    EntityFilter?: EntityType;
    /**
     * The path prefix for filtering the results. This parameter is optional. If it is not included, it defaults to a slash (/), listing all entities. This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    PathPrefix?: pathType;
    /**
     * The policy usage method to use for filtering the results. To list only permissions policies, set PolicyUsageFilter to PermissionsPolicy. To list only the policies used to set permissions boundaries, set the value to PermissionsBoundary. This parameter is optional. If it is not included, all policies are returned. 
     */
    PolicyUsageFilter?: PolicyUsageType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListEntitiesForPolicyResponse {
    /**
     * A list of IAM groups that the policy is attached to.
     */
    PolicyGroups?: PolicyGroupListType;
    /**
     * A list of IAM users that the policy is attached to.
     */
    PolicyUsers?: PolicyUserListType;
    /**
     * A list of IAM roles that the policy is attached to.
     */
    PolicyRoles?: PolicyRoleListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListGroupPoliciesRequest {
    /**
     * The name of the group to list policies for. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    GroupName: groupNameType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListGroupPoliciesResponse {
    /**
     * A list of policy names. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    PolicyNames: policyNameListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListGroupsForUserRequest {
    /**
     * The name of the user to list groups for. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: existingUserNameType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListGroupsForUserResponse {
    /**
     * A list of groups.
     */
    Groups: groupListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListGroupsRequest {
    /**
     *  The path prefix for filtering the results. For example, the prefix /division_abc/subdivision_xyz/ gets all groups whose path starts with /division_abc/subdivision_xyz/. This parameter is optional. If it is not included, it defaults to a slash (/), listing all groups. This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    PathPrefix?: pathPrefixType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListGroupsResponse {
    /**
     * A list of groups.
     */
    Groups: groupListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListInstanceProfileTagsRequest {
    /**
     * The name of the IAM instance profile whose tags you want to see. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    InstanceProfileName: instanceProfileNameType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListInstanceProfileTagsResponse {
    /**
     * The list of tags that are currently attached to the IAM instance profile. Each tag consists of a key name and an associated value. If no tags are attached to the specified resource, the response contains an empty list.
     */
    Tags: tagListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListInstanceProfilesForRoleRequest {
    /**
     * The name of the role to list instance profiles for. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListInstanceProfilesForRoleResponse {
    /**
     * A list of instance profiles.
     */
    InstanceProfiles: instanceProfileListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListInstanceProfilesRequest {
    /**
     *  The path prefix for filtering the results. For example, the prefix /application_abc/component_xyz/ gets all instance profiles whose path starts with /application_abc/component_xyz/. This parameter is optional. If it is not included, it defaults to a slash (/), listing all instance profiles. This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    PathPrefix?: pathPrefixType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListInstanceProfilesResponse {
    /**
     * A list of instance profiles.
     */
    InstanceProfiles: instanceProfileListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListMFADeviceTagsRequest {
    /**
     * The unique identifier for the IAM virtual MFA device whose tags you want to see. For virtual MFA devices, the serial number is the same as the ARN. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    SerialNumber: serialNumberType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListMFADeviceTagsResponse {
    /**
     * The list of tags that are currently attached to the virtual MFA device. Each tag consists of a key name and an associated value. If no tags are attached to the specified resource, the response contains an empty list.
     */
    Tags: tagListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListMFADevicesRequest {
    /**
     * The name of the user whose MFA devices you want to list. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName?: existingUserNameType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListMFADevicesResponse {
    /**
     * A list of MFA devices.
     */
    MFADevices: mfaDeviceListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListOpenIDConnectProviderTagsRequest {
    /**
     * The ARN of the OpenID Connect (OIDC) identity provider whose tags you want to see. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    OpenIDConnectProviderArn: arnType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListOpenIDConnectProviderTagsResponse {
    /**
     * The list of tags that are currently attached to the OpenID Connect (OIDC) identity provider. Each tag consists of a key name and an associated value. If no tags are attached to the specified resource, the response contains an empty list.
     */
    Tags: tagListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListOpenIDConnectProvidersRequest {
  }
  export interface ListOpenIDConnectProvidersResponse {
    /**
     * The list of IAM OIDC provider resource objects defined in the Amazon Web Services account.
     */
    OpenIDConnectProviderList?: OpenIDConnectProviderListType;
  }
  export interface ListPoliciesGrantingServiceAccessEntry {
    /**
     * The namespace of the service that was accessed. To learn the service namespace of a service, see Actions, resources, and condition keys for Amazon Web Services services in the Service Authorization Reference. Choose the name of the service to view details for that service. In the first paragraph, find the service prefix. For example, (service prefix: a4b). For more information about service namespaces, see Amazon Web Services service namespaces in the Amazon Web Services General Reference.
     */
    ServiceNamespace?: serviceNamespaceType;
    /**
     * The PoliciesGrantingServiceAccess object that contains details about the policy.
     */
    Policies?: policyGrantingServiceAccessListType;
  }
  export interface ListPoliciesGrantingServiceAccessRequest {
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * The ARN of the IAM identity (user, group, or role) whose policies you want to list.
     */
    Arn: arnType;
    /**
     * The service namespace for the Amazon Web Services services whose policies you want to list. To learn the service namespace for a service, see Actions, resources, and condition keys for Amazon Web Services services in the IAM User Guide. Choose the name of the service to view details for that service. In the first paragraph, find the service prefix. For example, (service prefix: a4b). For more information about service namespaces, see Amazon Web Services service namespaces in the Amazon Web Services General Reference.
     */
    ServiceNamespaces: serviceNamespaceListType;
  }
  export interface ListPoliciesGrantingServiceAccessResponse {
    /**
     * A ListPoliciesGrantingServiceAccess object that contains details about the permissions policies attached to the specified identity (user, group, or role).
     */
    PoliciesGrantingServiceAccess: listPolicyGrantingServiceAccessResponseListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListPoliciesRequest {
    /**
     * The scope to use for filtering the results. To list only Amazon Web Services managed policies, set Scope to AWS. To list only the customer managed policies in your Amazon Web Services account, set Scope to Local. This parameter is optional. If it is not included, or if it is set to All, all policies are returned.
     */
    Scope?: policyScopeType;
    /**
     * A flag to filter the results to only the attached policies. When OnlyAttached is true, the returned list contains only the policies that are attached to an IAM user, group, or role. When OnlyAttached is false, or when the parameter is not included, all policies are returned.
     */
    OnlyAttached?: booleanType;
    /**
     * The path prefix for filtering the results. This parameter is optional. If it is not included, it defaults to a slash (/), listing all policies. This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    PathPrefix?: policyPathType;
    /**
     * The policy usage method to use for filtering the results. To list only permissions policies, set PolicyUsageFilter to PermissionsPolicy. To list only the policies used to set permissions boundaries, set the value to PermissionsBoundary. This parameter is optional. If it is not included, all policies are returned. 
     */
    PolicyUsageFilter?: PolicyUsageType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListPoliciesResponse {
    /**
     * A list of policies.
     */
    Policies?: policyListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListPolicyTagsRequest {
    /**
     * The ARN of the IAM customer managed policy whose tags you want to see. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    PolicyArn: arnType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListPolicyTagsResponse {
    /**
     * The list of tags that are currently attached to the IAM customer managed policy. Each tag consists of a key name and an associated value. If no tags are attached to the specified resource, the response contains an empty list.
     */
    Tags: tagListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListPolicyVersionsRequest {
    /**
     * The Amazon Resource Name (ARN) of the IAM policy for which you want the versions. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicyArn: arnType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListPolicyVersionsResponse {
    /**
     * A list of policy versions. For more information about managed policy versions, see Versioning for managed policies in the IAM User Guide.
     */
    Versions?: policyDocumentVersionListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListRolePoliciesRequest {
    /**
     * The name of the role to list policies for. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListRolePoliciesResponse {
    /**
     * A list of policy names.
     */
    PolicyNames: policyNameListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListRoleTagsRequest {
    /**
     * The name of the IAM role for which you want to see the list of tags. This parameter accepts (through its regex pattern) a string of characters that consist of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListRoleTagsResponse {
    /**
     * The list of tags that are currently attached to the role. Each tag consists of a key name and an associated value. If no tags are attached to the specified resource, the response contains an empty list.
     */
    Tags: tagListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListRolesRequest {
    /**
     *  The path prefix for filtering the results. For example, the prefix /application_abc/component_xyz/ gets all roles whose path starts with /application_abc/component_xyz/. This parameter is optional. If it is not included, it defaults to a slash (/), listing all roles. This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    PathPrefix?: pathPrefixType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListRolesResponse {
    /**
     * A list of roles.
     */
    Roles: roleListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListSAMLProviderTagsRequest {
    /**
     * The ARN of the Security Assertion Markup Language (SAML) identity provider whose tags you want to see. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    SAMLProviderArn: arnType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListSAMLProviderTagsResponse {
    /**
     * The list of tags that are currently attached to the Security Assertion Markup Language (SAML) identity provider. Each tag consists of a key name and an associated value. If no tags are attached to the specified resource, the response contains an empty list.
     */
    Tags: tagListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListSAMLProvidersRequest {
  }
  export interface ListSAMLProvidersResponse {
    /**
     * The list of SAML provider resource objects defined in IAM for this Amazon Web Services account.
     */
    SAMLProviderList?: SAMLProviderListType;
  }
  export interface ListSSHPublicKeysRequest {
    /**
     * The name of the IAM user to list SSH public keys for. If none is specified, the UserName field is determined implicitly based on the Amazon Web Services access key used to sign the request. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName?: userNameType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListSSHPublicKeysResponse {
    /**
     * A list of the SSH public keys assigned to IAM user.
     */
    SSHPublicKeys?: SSHPublicKeyListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListServerCertificateTagsRequest {
    /**
     * The name of the IAM server certificate whose tags you want to see. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    ServerCertificateName: serverCertificateNameType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListServerCertificateTagsResponse {
    /**
     * The list of tags that are currently attached to the IAM server certificate. Each tag consists of a key name and an associated value. If no tags are attached to the specified resource, the response contains an empty list.
     */
    Tags: tagListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListServerCertificatesRequest {
    /**
     *  The path prefix for filtering the results. For example: /company/servercerts would get all server certificates for which the path starts with /company/servercerts. This parameter is optional. If it is not included, it defaults to a slash (/), listing all server certificates. This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    PathPrefix?: pathPrefixType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListServerCertificatesResponse {
    /**
     * A list of server certificates.
     */
    ServerCertificateMetadataList: serverCertificateMetadataListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListServiceSpecificCredentialsRequest {
    /**
     * The name of the user whose service-specific credentials you want information about. If this value is not specified, then the operation assumes the user whose credentials are used to call the operation. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName?: userNameType;
    /**
     * Filters the returned results to only those for the specified Amazon Web Services service. If not specified, then Amazon Web Services returns service-specific credentials for all services.
     */
    ServiceName?: serviceName;
  }
  export interface ListServiceSpecificCredentialsResponse {
    /**
     * A list of structures that each contain details about a service-specific credential.
     */
    ServiceSpecificCredentials?: ServiceSpecificCredentialsListType;
  }
  export interface ListSigningCertificatesRequest {
    /**
     * The name of the IAM user whose signing certificates you want to examine. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName?: existingUserNameType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListSigningCertificatesResponse {
    /**
     * A list of the user's signing certificate information.
     */
    Certificates: certificateListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListUserPoliciesRequest {
    /**
     * The name of the user to list policies for. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: existingUserNameType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListUserPoliciesResponse {
    /**
     * A list of policy names.
     */
    PolicyNames: policyNameListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListUserTagsRequest {
    /**
     * The name of the IAM user whose tags you want to see. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: existingUserNameType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListUserTagsResponse {
    /**
     * The list of tags that are currently attached to the user. Each tag consists of a key name and an associated value. If no tags are attached to the specified resource, the response contains an empty list.
     */
    Tags: tagListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListUsersRequest {
    /**
     *  The path prefix for filtering the results. For example: /division_abc/subdivision_xyz/, which would get all user names whose path starts with /division_abc/subdivision_xyz/. This parameter is optional. If it is not included, it defaults to a slash (/), listing all user names. This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    PathPrefix?: pathPrefixType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListUsersResponse {
    /**
     * A list of users.
     */
    Users: userListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface ListVirtualMFADevicesRequest {
    /**
     *  The status (Unassigned or Assigned) of the devices to list. If you do not specify an AssignmentStatus, the operation defaults to Any, which lists both assigned and unassigned virtual MFA devices.,
     */
    AssignmentStatus?: assignmentStatusType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
  }
  export interface ListVirtualMFADevicesResponse {
    /**
     *  The list of virtual MFA devices in the current account that match the AssignmentStatus value that was passed in the request.
     */
    VirtualMFADevices: virtualMFADeviceListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface LoginProfile {
    /**
     * The name of the user, which can be used for signing in to the Amazon Web Services Management Console.
     */
    UserName: userNameType;
    /**
     * The date when the password for the user was created.
     */
    CreateDate: dateType;
    /**
     * Specifies whether the user is required to set a new password on next sign-in.
     */
    PasswordResetRequired?: booleanType;
  }
  export interface MFADevice {
    /**
     * The user with whom the MFA device is associated.
     */
    UserName: userNameType;
    /**
     * The serial number that uniquely identifies the MFA device. For virtual MFA devices, the serial number is the device ARN.
     */
    SerialNumber: serialNumberType;
    /**
     * The date when the MFA device was enabled for the user.
     */
    EnableDate: dateType;
  }
  export interface ManagedPolicyDetail {
    /**
     * The friendly name (not ARN) identifying the policy.
     */
    PolicyName?: policyNameType;
    /**
     * The stable and unique string identifying the policy. For more information about IDs, see IAM identifiers in the IAM User Guide.
     */
    PolicyId?: idType;
    Arn?: arnType;
    /**
     * The path to the policy. For more information about paths, see IAM identifiers in the IAM User Guide.
     */
    Path?: policyPathType;
    /**
     * The identifier for the version of the policy that is set as the default (operative) version. For more information about policy versions, see Versioning for managed policies in the IAM User Guide. 
     */
    DefaultVersionId?: policyVersionIdType;
    /**
     * The number of principal entities (users, groups, and roles) that the policy is attached to.
     */
    AttachmentCount?: attachmentCountType;
    /**
     * The number of entities (users and roles) for which the policy is used as the permissions boundary.  For more information about permissions boundaries, see Permissions boundaries for IAM identities  in the IAM User Guide.
     */
    PermissionsBoundaryUsageCount?: attachmentCountType;
    /**
     * Specifies whether the policy can be attached to an IAM user, group, or role.
     */
    IsAttachable?: booleanType;
    /**
     * A friendly description of the policy.
     */
    Description?: policyDescriptionType;
    /**
     * The date and time, in ISO 8601 date-time format, when the policy was created.
     */
    CreateDate?: dateType;
    /**
     * The date and time, in ISO 8601 date-time format, when the policy was last updated. When a policy has only one version, this field contains the date and time when the policy was created. When a policy has more than one version, this field contains the date and time when the most recent policy version was created.
     */
    UpdateDate?: dateType;
    /**
     * A list containing information about the versions of the policy.
     */
    PolicyVersionList?: policyDocumentVersionListType;
  }
  export type ManagedPolicyDetailListType = ManagedPolicyDetail[];
  export interface OpenIDConnectProviderListEntry {
    Arn?: arnType;
  }
  export type OpenIDConnectProviderListType = OpenIDConnectProviderListEntry[];
  export type OpenIDConnectProviderUrlType = string;
  export interface OrganizationsDecisionDetail {
    /**
     * Specifies whether the simulated operation is allowed by the Organizations service control policies that impact the simulated user's account.
     */
    AllowedByOrganizations?: booleanType;
  }
  export interface PasswordPolicy {
    /**
     * Minimum length to require for IAM user passwords.
     */
    MinimumPasswordLength?: minimumPasswordLengthType;
    /**
     * Specifies whether IAM user passwords must contain at least one of the following symbols: ! @ # $ % ^ &amp; * ( ) _ + - = [ ] { } | '
     */
    RequireSymbols?: booleanType;
    /**
     * Specifies whether IAM user passwords must contain at least one numeric character (0 to 9).
     */
    RequireNumbers?: booleanType;
    /**
     * Specifies whether IAM user passwords must contain at least one uppercase character (A to Z).
     */
    RequireUppercaseCharacters?: booleanType;
    /**
     * Specifies whether IAM user passwords must contain at least one lowercase character (a to z).
     */
    RequireLowercaseCharacters?: booleanType;
    /**
     * Specifies whether IAM users are allowed to change their own password. Gives IAM users permissions to iam:ChangePassword for only their user and to the iam:GetAccountPasswordPolicy action. This option does not attach a permissions policy to each user, rather the permissions are applied at the account-level for all users by IAM.
     */
    AllowUsersToChangePassword?: booleanType;
    /**
     * Indicates whether passwords in the account expire. Returns true if MaxPasswordAge contains a value greater than 0. Returns false if MaxPasswordAge is 0 or not present.
     */
    ExpirePasswords?: booleanType;
    /**
     * The number of days that an IAM user password is valid.
     */
    MaxPasswordAge?: maxPasswordAgeType;
    /**
     * Specifies the number of previous passwords that IAM users are prevented from reusing.
     */
    PasswordReusePrevention?: passwordReusePreventionType;
    /**
     * Specifies whether IAM users are prevented from setting a new password via the Amazon Web Services Management Console after their password has expired. The IAM user cannot access the console until an administrator resets the password. IAM users with iam:ChangePassword permission and active access keys can reset their own expired console password using the CLI or API.
     */
    HardExpiry?: booleanObjectType;
  }
  export type PermissionsBoundaryAttachmentType = "PermissionsBoundaryPolicy"|string;
  export interface PermissionsBoundaryDecisionDetail {
    /**
     * Specifies whether an action is allowed by a permissions boundary that is applied to an IAM entity (user or role). A value of true means that the permissions boundary does not deny the action. This means that the policy includes an Allow statement that matches the request. In this case, if an identity-based policy also allows the action, the request is allowed. A value of false means that either the requested action is not allowed (implicitly denied) or that the action is explicitly denied by the permissions boundary. In both of these cases, the action is not allowed, regardless of the identity-based policy.
     */
    AllowedByPermissionsBoundary?: booleanType;
  }
  export interface Policy {
    /**
     * The friendly name (not ARN) identifying the policy.
     */
    PolicyName?: policyNameType;
    /**
     * The stable and unique string identifying the policy. For more information about IDs, see IAM identifiers in the IAM User Guide.
     */
    PolicyId?: idType;
    Arn?: arnType;
    /**
     * The path to the policy. For more information about paths, see IAM identifiers in the IAM User Guide.
     */
    Path?: policyPathType;
    /**
     * The identifier for the version of the policy that is set as the default version.
     */
    DefaultVersionId?: policyVersionIdType;
    /**
     * The number of entities (users, groups, and roles) that the policy is attached to.
     */
    AttachmentCount?: attachmentCountType;
    /**
     * The number of entities (users and roles) for which the policy is used to set the permissions boundary.  For more information about permissions boundaries, see Permissions boundaries for IAM identities  in the IAM User Guide.
     */
    PermissionsBoundaryUsageCount?: attachmentCountType;
    /**
     * Specifies whether the policy can be attached to an IAM user, group, or role.
     */
    IsAttachable?: booleanType;
    /**
     * A friendly description of the policy. This element is included in the response to the GetPolicy operation. It is not included in the response to the ListPolicies operation. 
     */
    Description?: policyDescriptionType;
    /**
     * The date and time, in ISO 8601 date-time format, when the policy was created.
     */
    CreateDate?: dateType;
    /**
     * The date and time, in ISO 8601 date-time format, when the policy was last updated. When a policy has only one version, this field contains the date and time when the policy was created. When a policy has more than one version, this field contains the date and time when the most recent policy version was created.
     */
    UpdateDate?: dateType;
    /**
     * A list of tags that are attached to the instance profile. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
     */
    Tags?: tagListType;
  }
  export interface PolicyDetail {
    /**
     * The name of the policy.
     */
    PolicyName?: policyNameType;
    /**
     * The policy document.
     */
    PolicyDocument?: policyDocumentType;
  }
  export type PolicyEvaluationDecisionType = "allowed"|"explicitDeny"|"implicitDeny"|string;
  export interface PolicyGrantingServiceAccess {
    /**
     * The policy name.
     */
    PolicyName: policyNameType;
    /**
     * The policy type. For more information about these policy types, see Managed policies and inline policies in the IAM User Guide.
     */
    PolicyType: policyType;
    PolicyArn?: arnType;
    /**
     * The type of entity (user or role) that used the policy to access the service to which the inline policy is attached. This field is null for managed policies. For more information about these policy types, see Managed policies and inline policies in the IAM User Guide.
     */
    EntityType?: policyOwnerEntityType;
    /**
     * The name of the entity (user or role) to which the inline policy is attached. This field is null for managed policies. For more information about these policy types, see Managed policies and inline policies in the IAM User Guide.
     */
    EntityName?: entityNameType;
  }
  export interface PolicyGroup {
    /**
     * The name (friendly name, not ARN) identifying the group.
     */
    GroupName?: groupNameType;
    /**
     * The stable and unique string identifying the group. For more information about IDs, see IAM identifiers in the IAM User Guide.
     */
    GroupId?: idType;
  }
  export type PolicyGroupListType = PolicyGroup[];
  export type PolicyIdentifierType = string;
  export interface PolicyRole {
    /**
     * The name (friendly name, not ARN) identifying the role.
     */
    RoleName?: roleNameType;
    /**
     * The stable and unique string identifying the role. For more information about IDs, see IAM identifiers in the IAM User Guide.
     */
    RoleId?: idType;
  }
  export type PolicyRoleListType = PolicyRole[];
  export type PolicySourceType = "user"|"group"|"role"|"aws-managed"|"user-managed"|"resource"|"none"|string;
  export type PolicyUsageType = "PermissionsPolicy"|"PermissionsBoundary"|string;
  export interface PolicyUser {
    /**
     * The name (friendly name, not ARN) identifying the user.
     */
    UserName?: userNameType;
    /**
     * The stable and unique string identifying the user. For more information about IDs, see IAM identifiers in the IAM User Guide.
     */
    UserId?: idType;
  }
  export type PolicyUserListType = PolicyUser[];
  export interface PolicyVersion {
    /**
     * The policy document. The policy document is returned in the response to the GetPolicyVersion and GetAccountAuthorizationDetails operations. It is not returned in the response to the CreatePolicyVersion or ListPolicyVersions operations.  The policy document returned in this structure is URL-encoded compliant with RFC 3986. You can use a URL decoding method to convert the policy back to plain JSON text. For example, if you use Java, you can use the decode method of the java.net.URLDecoder utility class in the Java SDK. Other languages and SDKs provide similar functionality.
     */
    Document?: policyDocumentType;
    /**
     * The identifier for the policy version. Policy version identifiers always begin with v (always lowercase). When a policy is created, the first policy version is v1. 
     */
    VersionId?: policyVersionIdType;
    /**
     * Specifies whether the policy version is set as the policy's default version.
     */
    IsDefaultVersion?: booleanType;
    /**
     * The date and time, in ISO 8601 date-time format, when the policy version was created.
     */
    CreateDate?: dateType;
  }
  export interface Position {
    /**
     * The line containing the specified position in the document.
     */
    Line?: LineNumber;
    /**
     * The column in the line containing the specified position in the document.
     */
    Column?: ColumnNumber;
  }
  export interface PutGroupPolicyRequest {
    /**
     * The name of the group to associate the policy with. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-.
     */
    GroupName: groupNameType;
    /**
     * The name of the policy document. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    PolicyName: policyNameType;
    /**
     * The policy document. You must provide policies in JSON format in IAM. However, for CloudFormation templates formatted in YAML, you can provide the policy in JSON or YAML format. CloudFormation always converts a YAML policy to JSON format before submitting it to IAM. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    PolicyDocument: policyDocumentType;
  }
  export interface PutRolePermissionsBoundaryRequest {
    /**
     * The name (friendly name, not ARN) of the IAM role for which you want to set the permissions boundary.
     */
    RoleName: roleNameType;
    /**
     * The ARN of the managed policy that is used to set the permissions boundary for the role. A permissions boundary policy defines the maximum permissions that identity-based policies can grant to an entity, but does not grant permissions. Permissions boundaries do not define the maximum permissions that a resource-based policy can grant to an entity. To learn more, see Permissions boundaries for IAM entities in the IAM User Guide. For more information about policy types, see Policy types  in the IAM User Guide.
     */
    PermissionsBoundary: arnType;
  }
  export interface PutRolePolicyRequest {
    /**
     * The name of the role to associate the policy with. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
    /**
     * The name of the policy document. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    PolicyName: policyNameType;
    /**
     * The policy document. You must provide policies in JSON format in IAM. However, for CloudFormation templates formatted in YAML, you can provide the policy in JSON or YAML format. CloudFormation always converts a YAML policy to JSON format before submitting it to IAM. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    PolicyDocument: policyDocumentType;
  }
  export interface PutUserPermissionsBoundaryRequest {
    /**
     * The name (friendly name, not ARN) of the IAM user for which you want to set the permissions boundary.
     */
    UserName: userNameType;
    /**
     * The ARN of the managed policy that is used to set the permissions boundary for the user. A permissions boundary policy defines the maximum permissions that identity-based policies can grant to an entity, but does not grant permissions. Permissions boundaries do not define the maximum permissions that a resource-based policy can grant to an entity. To learn more, see Permissions boundaries for IAM entities in the IAM User Guide. For more information about policy types, see Policy types  in the IAM User Guide.
     */
    PermissionsBoundary: arnType;
  }
  export interface PutUserPolicyRequest {
    /**
     * The name of the user to associate the policy with. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: existingUserNameType;
    /**
     * The name of the policy document. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    PolicyName: policyNameType;
    /**
     * The policy document. You must provide policies in JSON format in IAM. However, for CloudFormation templates formatted in YAML, you can provide the policy in JSON or YAML format. CloudFormation always converts a YAML policy to JSON format before submitting it to IAM. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    PolicyDocument: policyDocumentType;
  }
  export type ReasonType = string;
  export type RegionNameType = string;
  export interface RemoveClientIDFromOpenIDConnectProviderRequest {
    /**
     * The Amazon Resource Name (ARN) of the IAM OIDC provider resource to remove the client ID from. You can get a list of OIDC provider ARNs by using the ListOpenIDConnectProviders operation. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    OpenIDConnectProviderArn: arnType;
    /**
     * The client ID (also known as audience) to remove from the IAM OIDC provider resource. For more information about client IDs, see CreateOpenIDConnectProvider.
     */
    ClientID: clientIDType;
  }
  export interface RemoveRoleFromInstanceProfileRequest {
    /**
     * The name of the instance profile to update. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    InstanceProfileName: instanceProfileNameType;
    /**
     * The name of the role to remove. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
  }
  export interface RemoveUserFromGroupRequest {
    /**
     * The name of the group to update. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    GroupName: groupNameType;
    /**
     * The name of the user to remove. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: existingUserNameType;
  }
  export type ReportContentType = Buffer|Uint8Array|Blob|string;
  export type ReportFormatType = "text/csv"|string;
  export type ReportStateDescriptionType = string;
  export type ReportStateType = "STARTED"|"INPROGRESS"|"COMPLETE"|string;
  export interface ResetServiceSpecificCredentialRequest {
    /**
     * The name of the IAM user associated with the service-specific credential. If this value is not specified, then the operation assumes the user whose credentials are used to call the operation. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName?: userNameType;
    /**
     * The unique identifier of the service-specific credential. This parameter allows (through its regex pattern) a string of characters that can consist of any upper or lowercased letter or digit.
     */
    ServiceSpecificCredentialId: serviceSpecificCredentialId;
  }
  export interface ResetServiceSpecificCredentialResponse {
    /**
     * A structure with details about the updated service-specific credential, including the new password.  This is the only time that you can access the password. You cannot recover the password later, but you can reset it again. 
     */
    ServiceSpecificCredential?: ServiceSpecificCredential;
  }
  export type ResourceHandlingOptionType = string;
  export type ResourceNameListType = ResourceNameType[];
  export type ResourceNameType = string;
  export interface ResourceSpecificResult {
    /**
     * The name of the simulated resource, in Amazon Resource Name (ARN) format.
     */
    EvalResourceName: ResourceNameType;
    /**
     * The result of the simulation of the simulated API operation on the resource specified in EvalResourceName.
     */
    EvalResourceDecision: PolicyEvaluationDecisionType;
    /**
     * A list of the statements in the input policies that determine the result for this part of the simulation. Remember that even if multiple statements allow the operation on the resource, if any statement denies that operation, then the explicit deny overrides any allow. In addition, the deny statement is the only entry included in the result.
     */
    MatchedStatements?: StatementListType;
    /**
     * A list of context keys that are required by the included input policies but that were not provided by one of the input parameters. This list is used when a list of ARNs is included in the ResourceArns parameter instead of "*". If you do not specify individual resources, by setting ResourceArns to "*" or by not including the ResourceArns parameter, then any missing context values are instead included under the EvaluationResults section. To discover the context keys used by a set of policies, you can call GetContextKeysForCustomPolicy or GetContextKeysForPrincipalPolicy.
     */
    MissingContextValues?: ContextKeyNamesResultListType;
    /**
     * Additional details about the results of the evaluation decision on a single resource. This parameter is returned only for cross-account simulations. This parameter explains how each policy type contributes to the resource-specific evaluation decision.
     */
    EvalDecisionDetails?: EvalDecisionDetailsType;
    /**
     * Contains information about the effect that a permissions boundary has on a policy simulation when that boundary is applied to an IAM entity.
     */
    PermissionsBoundaryDecisionDetail?: PermissionsBoundaryDecisionDetail;
  }
  export type ResourceSpecificResultListType = ResourceSpecificResult[];
  export interface ResyncMFADeviceRequest {
    /**
     * The name of the user whose MFA device you want to resynchronize. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: existingUserNameType;
    /**
     * Serial number that uniquely identifies the MFA device. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    SerialNumber: serialNumberType;
    /**
     * An authentication code emitted by the device. The format for this parameter is a sequence of six digits.
     */
    AuthenticationCode1: authenticationCodeType;
    /**
     * A subsequent authentication code emitted by the device. The format for this parameter is a sequence of six digits.
     */
    AuthenticationCode2: authenticationCodeType;
  }
  export interface Role {
    /**
     *  The path to the role. For more information about paths, see IAM identifiers in the IAM User Guide. 
     */
    Path: pathType;
    /**
     * The friendly name that identifies the role.
     */
    RoleName: roleNameType;
    /**
     *  The stable and unique string identifying the role. For more information about IDs, see IAM identifiers in the IAM User Guide. 
     */
    RoleId: idType;
    /**
     *  The Amazon Resource Name (ARN) specifying the role. For more information about ARNs and how to use them in policies, see IAM identifiers in the IAM User Guide guide. 
     */
    Arn: arnType;
    /**
     * The date and time, in ISO 8601 date-time format, when the role was created.
     */
    CreateDate: dateType;
    /**
     * The policy that grants an entity permission to assume the role.
     */
    AssumeRolePolicyDocument?: policyDocumentType;
    /**
     * A description of the role that you provide.
     */
    Description?: roleDescriptionType;
    /**
     * The maximum session duration (in seconds) for the specified role. Anyone who uses the CLI, or API to assume the role can specify the duration using the optional DurationSeconds API parameter or duration-seconds CLI parameter.
     */
    MaxSessionDuration?: roleMaxSessionDurationType;
    /**
     * The ARN of the policy used to set the permissions boundary for the role. For more information about permissions boundaries, see Permissions boundaries for IAM identities  in the IAM User Guide.
     */
    PermissionsBoundary?: AttachedPermissionsBoundary;
    /**
     * A list of tags that are attached to the role. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
     */
    Tags?: tagListType;
    /**
     * Contains information about the last time that an IAM role was used. This includes the date and time and the Region in which the role was last used. Activity is only reported for the trailing 400 days. This period can be shorter if your Region began supporting these features within the last year. The role might have been used more than 400 days ago. For more information, see Regions where data is tracked in the IAM user Guide.
     */
    RoleLastUsed?: RoleLastUsed;
  }
  export interface RoleDetail {
    /**
     * The path to the role. For more information about paths, see IAM identifiers in the IAM User Guide.
     */
    Path?: pathType;
    /**
     * The friendly name that identifies the role.
     */
    RoleName?: roleNameType;
    /**
     * The stable and unique string identifying the role. For more information about IDs, see IAM identifiers in the IAM User Guide.
     */
    RoleId?: idType;
    Arn?: arnType;
    /**
     * The date and time, in ISO 8601 date-time format, when the role was created.
     */
    CreateDate?: dateType;
    /**
     * The trust policy that grants permission to assume the role.
     */
    AssumeRolePolicyDocument?: policyDocumentType;
    /**
     * A list of instance profiles that contain this role.
     */
    InstanceProfileList?: instanceProfileListType;
    /**
     * A list of inline policies embedded in the role. These policies are the role's access (permissions) policies.
     */
    RolePolicyList?: policyDetailListType;
    /**
     * A list of managed policies attached to the role. These policies are the role's access (permissions) policies.
     */
    AttachedManagedPolicies?: attachedPoliciesListType;
    /**
     * The ARN of the policy used to set the permissions boundary for the role. For more information about permissions boundaries, see Permissions boundaries for IAM identities  in the IAM User Guide.
     */
    PermissionsBoundary?: AttachedPermissionsBoundary;
    /**
     * A list of tags that are attached to the role. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
     */
    Tags?: tagListType;
    /**
     * Contains information about the last time that an IAM role was used. This includes the date and time and the Region in which the role was last used. Activity is only reported for the trailing 400 days. This period can be shorter if your Region began supporting these features within the last year. The role might have been used more than 400 days ago. For more information, see Regions where data is tracked in the IAM User Guide.
     */
    RoleLastUsed?: RoleLastUsed;
  }
  export interface RoleLastUsed {
    /**
     * The date and time, in ISO 8601 date-time format that the role was last used. This field is null if the role has not been used within the IAM tracking period. For more information about the tracking period, see Regions where data is tracked in the IAM User Guide. 
     */
    LastUsedDate?: dateType;
    /**
     * The name of the Amazon Web Services Region in which the role was last used.
     */
    Region?: stringType;
  }
  export type RoleUsageListType = RoleUsageType[];
  export interface RoleUsageType {
    /**
     * The name of the Region where the service-linked role is being used.
     */
    Region?: RegionNameType;
    /**
     * The name of the resource that is using the service-linked role.
     */
    Resources?: ArnListType;
  }
  export type SAMLMetadataDocumentType = string;
  export interface SAMLProviderListEntry {
    /**
     * The Amazon Resource Name (ARN) of the SAML provider.
     */
    Arn?: arnType;
    /**
     * The expiration date and time for the SAML provider.
     */
    ValidUntil?: dateType;
    /**
     * The date and time when the SAML provider was created.
     */
    CreateDate?: dateType;
  }
  export type SAMLProviderListType = SAMLProviderListEntry[];
  export type SAMLProviderNameType = string;
  export interface SSHPublicKey {
    /**
     * The name of the IAM user associated with the SSH public key.
     */
    UserName: userNameType;
    /**
     * The unique identifier for the SSH public key.
     */
    SSHPublicKeyId: publicKeyIdType;
    /**
     * The MD5 message digest of the SSH public key.
     */
    Fingerprint: publicKeyFingerprintType;
    /**
     * The SSH public key.
     */
    SSHPublicKeyBody: publicKeyMaterialType;
    /**
     * The status of the SSH public key. Active means that the key can be used for authentication with an CodeCommit repository. Inactive means that the key cannot be used.
     */
    Status: statusType;
    /**
     * The date and time, in ISO 8601 date-time format, when the SSH public key was uploaded.
     */
    UploadDate?: dateType;
  }
  export type SSHPublicKeyListType = SSHPublicKeyMetadata[];
  export interface SSHPublicKeyMetadata {
    /**
     * The name of the IAM user associated with the SSH public key.
     */
    UserName: userNameType;
    /**
     * The unique identifier for the SSH public key.
     */
    SSHPublicKeyId: publicKeyIdType;
    /**
     * The status of the SSH public key. Active means that the key can be used for authentication with an CodeCommit repository. Inactive means that the key cannot be used.
     */
    Status: statusType;
    /**
     * The date and time, in ISO 8601 date-time format, when the SSH public key was uploaded.
     */
    UploadDate: dateType;
  }
  export interface ServerCertificate {
    /**
     * The meta information of the server certificate, such as its name, path, ID, and ARN.
     */
    ServerCertificateMetadata: ServerCertificateMetadata;
    /**
     * The contents of the public key certificate.
     */
    CertificateBody: certificateBodyType;
    /**
     * The contents of the public key certificate chain.
     */
    CertificateChain?: certificateChainType;
    /**
     * A list of tags that are attached to the server certificate. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
     */
    Tags?: tagListType;
  }
  export interface ServerCertificateMetadata {
    /**
     *  The path to the server certificate. For more information about paths, see IAM identifiers in the IAM User Guide. 
     */
    Path: pathType;
    /**
     * The name that identifies the server certificate.
     */
    ServerCertificateName: serverCertificateNameType;
    /**
     *  The stable and unique string identifying the server certificate. For more information about IDs, see IAM identifiers in the IAM User Guide. 
     */
    ServerCertificateId: idType;
    /**
     *  The Amazon Resource Name (ARN) specifying the server certificate. For more information about ARNs and how to use them in policies, see IAM identifiers in the IAM User Guide. 
     */
    Arn: arnType;
    /**
     * The date when the server certificate was uploaded.
     */
    UploadDate?: dateType;
    /**
     * The date on which the certificate is set to expire.
     */
    Expiration?: dateType;
  }
  export interface ServiceLastAccessed {
    /**
     * The name of the service in which access was attempted.
     */
    ServiceName: serviceNameType;
    /**
     * The date and time, in ISO 8601 date-time format, when an authenticated entity most recently attempted to access the service. Amazon Web Services does not report unauthenticated requests. This field is null if no IAM entities attempted to access the service within the tracking period.
     */
    LastAuthenticated?: dateType;
    /**
     * The namespace of the service in which access was attempted. To learn the service namespace of a service, see Actions, resources, and condition keys for Amazon Web Services services in the Service Authorization Reference. Choose the name of the service to view details for that service. In the first paragraph, find the service prefix. For example, (service prefix: a4b). For more information about service namespaces, see Amazon Web Services Service Namespaces in the Amazon Web Services General Reference.
     */
    ServiceNamespace: serviceNamespaceType;
    /**
     * The ARN of the authenticated entity (user or role) that last attempted to access the service. Amazon Web Services does not report unauthenticated requests. This field is null if no IAM entities attempted to access the service within the tracking period.
     */
    LastAuthenticatedEntity?: arnType;
    /**
     * The Region from which the authenticated entity (user or role) last attempted to access the service. Amazon Web Services does not report unauthenticated requests. This field is null if no IAM entities attempted to access the service within the tracking period.
     */
    LastAuthenticatedRegion?: stringType;
    /**
     * The total number of authenticated principals (root user, IAM users, or IAM roles) that have attempted to access the service. This field is null if no principals attempted to access the service within the tracking period.
     */
    TotalAuthenticatedEntities?: integerType;
    /**
     * An object that contains details about the most recent attempt to access a tracked action within the service. This field is null if there no tracked actions or if the principal did not use the tracked actions within the tracking period. This field is also null if the report was generated at the service level and not the action level. For more information, see the Granularity field in GenerateServiceLastAccessedDetails.
     */
    TrackedActionsLastAccessed?: TrackedActionsLastAccessed;
  }
  export interface ServiceSpecificCredential {
    /**
     * The date and time, in ISO 8601 date-time format, when the service-specific credential were created.
     */
    CreateDate: dateType;
    /**
     * The name of the service associated with the service-specific credential.
     */
    ServiceName: serviceName;
    /**
     * The generated user name for the service-specific credential. This value is generated by combining the IAM user's name combined with the ID number of the Amazon Web Services account, as in jane-at-123456789012, for example. This value cannot be configured by the user.
     */
    ServiceUserName: serviceUserName;
    /**
     * The generated password for the service-specific credential.
     */
    ServicePassword: servicePassword;
    /**
     * The unique identifier for the service-specific credential.
     */
    ServiceSpecificCredentialId: serviceSpecificCredentialId;
    /**
     * The name of the IAM user associated with the service-specific credential.
     */
    UserName: userNameType;
    /**
     * The status of the service-specific credential. Active means that the key is valid for API calls, while Inactive means it is not.
     */
    Status: statusType;
  }
  export interface ServiceSpecificCredentialMetadata {
    /**
     * The name of the IAM user associated with the service-specific credential.
     */
    UserName: userNameType;
    /**
     * The status of the service-specific credential. Active means that the key is valid for API calls, while Inactive means it is not.
     */
    Status: statusType;
    /**
     * The generated user name for the service-specific credential.
     */
    ServiceUserName: serviceUserName;
    /**
     * The date and time, in ISO 8601 date-time format, when the service-specific credential were created.
     */
    CreateDate: dateType;
    /**
     * The unique identifier for the service-specific credential.
     */
    ServiceSpecificCredentialId: serviceSpecificCredentialId;
    /**
     * The name of the service associated with the service-specific credential.
     */
    ServiceName: serviceName;
  }
  export type ServiceSpecificCredentialsListType = ServiceSpecificCredentialMetadata[];
  export type ServicesLastAccessed = ServiceLastAccessed[];
  export interface SetDefaultPolicyVersionRequest {
    /**
     * The Amazon Resource Name (ARN) of the IAM policy whose default version you want to set. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicyArn: arnType;
    /**
     * The version of the policy to set as the default (operative) version. For more information about managed policy versions, see Versioning for managed policies in the IAM User Guide.
     */
    VersionId: policyVersionIdType;
  }
  export interface SetSecurityTokenServicePreferencesRequest {
    /**
     * The version of the global endpoint token. Version 1 tokens are valid only in Amazon Web Services Regions that are available by default. These tokens do not work in manually enabled Regions, such as Asia Pacific (Hong Kong). Version 2 tokens are valid in all Regions. However, version 2 tokens are longer and might affect systems where you temporarily store tokens. For information, see Activating and deactivating STS in an Amazon Web Services Region in the IAM User Guide.
     */
    GlobalEndpointTokenVersion: globalEndpointTokenVersion;
  }
  export interface SigningCertificate {
    /**
     * The name of the user the signing certificate is associated with.
     */
    UserName: userNameType;
    /**
     * The ID for the signing certificate.
     */
    CertificateId: certificateIdType;
    /**
     * The contents of the signing certificate.
     */
    CertificateBody: certificateBodyType;
    /**
     * The status of the signing certificate. Active means that the key is valid for API calls, while Inactive means it is not.
     */
    Status: statusType;
    /**
     * The date when the signing certificate was uploaded.
     */
    UploadDate?: dateType;
  }
  export interface SimulateCustomPolicyRequest {
    /**
     * A list of policy documents to include in the simulation. Each document is specified as a string containing the complete, valid JSON text of an IAM policy. Do not include any resource-based policies in this parameter. Any resource-based policy must be submitted with the ResourcePolicy parameter. The policies cannot be "scope-down" policies, such as you could include in a call to GetFederationToken or one of the AssumeRole API operations. In other words, do not use policies designed to restrict what a user can do while using the temporary credentials. The maximum length of the policy document that you can pass in this operation, including whitespace, is listed below. To view the maximum character counts of a managed policy with no whitespaces, see IAM and STS character quotas. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    PolicyInputList: SimulationPolicyListType;
    /**
     * The IAM permissions boundary policy to simulate. The permissions boundary sets the maximum permissions that an IAM entity can have. You can input only one permissions boundary when you pass a policy to this operation. For more information about permissions boundaries, see Permissions boundaries for IAM entities in the IAM User Guide. The policy input is specified as a string that contains the complete, valid JSON text of a permissions boundary policy. The maximum length of the policy document that you can pass in this operation, including whitespace, is listed below. To view the maximum character counts of a managed policy with no whitespaces, see IAM and STS character quotas. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    PermissionsBoundaryPolicyInputList?: SimulationPolicyListType;
    /**
     * A list of names of API operations to evaluate in the simulation. Each operation is evaluated against each resource. Each operation must include the service identifier, such as iam:CreateUser. This operation does not support using wildcards (*) in an action name.
     */
    ActionNames: ActionNameListType;
    /**
     * A list of ARNs of Amazon Web Services resources to include in the simulation. If this parameter is not provided, then the value defaults to * (all resources). Each API in the ActionNames parameter is evaluated for each resource in this list. The simulation determines the access result (allowed or denied) of each combination and reports it in the response. You can simulate resources that don't exist in your account. The simulation does not automatically retrieve policies for the specified resources. If you want to include a resource policy in the simulation, then you must include the policy as a string in the ResourcePolicy parameter. If you include a ResourcePolicy, then it must be applicable to all of the resources included in the simulation or you receive an invalid input error. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.  Simulation of resource-based policies isn't supported for IAM roles. 
     */
    ResourceArns?: ResourceNameListType;
    /**
     * A resource-based policy to include in the simulation provided as a string. Each resource in the simulation is treated as if it had this policy attached. You can include only one resource-based policy in a simulation. The maximum length of the policy document that you can pass in this operation, including whitespace, is listed below. To view the maximum character counts of a managed policy with no whitespaces, see IAM and STS character quotas. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)    Simulation of resource-based policies isn't supported for IAM roles. 
     */
    ResourcePolicy?: policyDocumentType;
    /**
     * An ARN representing the Amazon Web Services account ID that specifies the owner of any simulated resource that does not identify its owner in the resource ARN. Examples of resource ARNs include an S3 bucket or object. If ResourceOwner is specified, it is also used as the account owner of any ResourcePolicy included in the simulation. If the ResourceOwner parameter is not specified, then the owner of the resources and the resource policy defaults to the account of the identity provided in CallerArn. This parameter is required only if you specify a resource-based policy and account that owns the resource is different from the account that owns the simulated calling user CallerArn. The ARN for an account uses the following syntax: arn:aws:iam::AWS-account-ID:root. For example, to represent the account with the 112233445566 ID, use the following ARN: arn:aws:iam::112233445566-ID:root. 
     */
    ResourceOwner?: ResourceNameType;
    /**
     * The ARN of the IAM user that you want to use as the simulated caller of the API operations. CallerArn is required if you include a ResourcePolicy so that the policy's Principal element has a value to use in evaluating the policy. You can specify only the ARN of an IAM user. You cannot specify the ARN of an assumed role, federated user, or a service principal.
     */
    CallerArn?: ResourceNameType;
    /**
     * A list of context keys and corresponding values for the simulation to use. Whenever a context key is evaluated in one of the simulated IAM permissions policies, the corresponding value is supplied.
     */
    ContextEntries?: ContextEntryListType;
    /**
     * Specifies the type of simulation to run. Different API operations that support resource-based policies require different combinations of resources. By specifying the type of simulation to run, you enable the policy simulator to enforce the presence of the required resources to ensure reliable simulation results. If your simulation does not match one of the following scenarios, then you can omit this parameter. The following list shows each of the supported scenario values and the resources that you must define to run the simulation. Each of the EC2 scenarios requires that you specify instance, image, and security group resources. If your scenario includes an EBS volume, then you must specify that volume as a resource. If the EC2 scenario includes VPC, then you must supply the network interface resource. If it includes an IP subnet, then you must specify the subnet resource. For more information on the EC2 scenario options, see Supported platforms in the Amazon EC2 User Guide.    EC2-VPC-InstanceStore  instance, image, security group, network interface    EC2-VPC-InstanceStore-Subnet  instance, image, security group, network interface, subnet    EC2-VPC-EBS  instance, image, security group, network interface, volume    EC2-VPC-EBS-Subnet  instance, image, security group, network interface, subnet, volume  
     */
    ResourceHandlingOption?: ResourceHandlingOptionType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
  }
  export interface SimulatePolicyResponse {
    /**
     * The results of the simulation.
     */
    EvaluationResults?: EvaluationResultsListType;
    /**
     * A flag that indicates whether there are more items to return. If your results were truncated, you can make a subsequent pagination request using the Marker request parameter to retrieve more items. Note that IAM might return fewer than the MaxItems number of results even when there are more results available. We recommend that you check IsTruncated after every call to ensure that you receive all your results.
     */
    IsTruncated?: booleanType;
    /**
     * When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.
     */
    Marker?: responseMarkerType;
  }
  export interface SimulatePrincipalPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of a user, group, or role whose policies you want to include in the simulation. If you specify a user, group, or role, the simulation includes all policies that are associated with that entity. If you specify a user, the simulation also includes all policies that are attached to any groups the user belongs to. The maximum length of the policy document that you can pass in this operation, including whitespace, is listed below. To view the maximum character counts of a managed policy with no whitespaces, see IAM and STS character quotas. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    PolicySourceArn: arnType;
    /**
     * An optional list of additional policy documents to include in the simulation. Each document is specified as a string containing the complete, valid JSON text of an IAM policy. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    PolicyInputList?: SimulationPolicyListType;
    /**
     * The IAM permissions boundary policy to simulate. The permissions boundary sets the maximum permissions that the entity can have. You can input only one permissions boundary when you pass a policy to this operation. An IAM entity can only have one permissions boundary in effect at a time. For example, if a permissions boundary is attached to an entity and you pass in a different permissions boundary policy using this parameter, then the new permissions boundary policy is used for the simulation. For more information about permissions boundaries, see Permissions boundaries for IAM entities in the IAM User Guide. The policy input is specified as a string containing the complete, valid JSON text of a permissions boundary policy. The maximum length of the policy document that you can pass in this operation, including whitespace, is listed below. To view the maximum character counts of a managed policy with no whitespaces, see IAM and STS character quotas. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    PermissionsBoundaryPolicyInputList?: SimulationPolicyListType;
    /**
     * A list of names of API operations to evaluate in the simulation. Each operation is evaluated for each resource. Each operation must include the service identifier, such as iam:CreateUser.
     */
    ActionNames: ActionNameListType;
    /**
     * A list of ARNs of Amazon Web Services resources to include in the simulation. If this parameter is not provided, then the value defaults to * (all resources). Each API in the ActionNames parameter is evaluated for each resource in this list. The simulation determines the access result (allowed or denied) of each combination and reports it in the response. You can simulate resources that don't exist in your account. The simulation does not automatically retrieve policies for the specified resources. If you want to include a resource policy in the simulation, then you must include the policy as a string in the ResourcePolicy parameter. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.  Simulation of resource-based policies isn't supported for IAM roles. 
     */
    ResourceArns?: ResourceNameListType;
    /**
     * A resource-based policy to include in the simulation provided as a string. Each resource in the simulation is treated as if it had this policy attached. You can include only one resource-based policy in a simulation. The maximum length of the policy document that you can pass in this operation, including whitespace, is listed below. To view the maximum character counts of a managed policy with no whitespaces, see IAM and STS character quotas. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)    Simulation of resource-based policies isn't supported for IAM roles. 
     */
    ResourcePolicy?: policyDocumentType;
    /**
     * An Amazon Web Services account ID that specifies the owner of any simulated resource that does not identify its owner in the resource ARN. Examples of resource ARNs include an S3 bucket or object. If ResourceOwner is specified, it is also used as the account owner of any ResourcePolicy included in the simulation. If the ResourceOwner parameter is not specified, then the owner of the resources and the resource policy defaults to the account of the identity provided in CallerArn. This parameter is required only if you specify a resource-based policy and account that owns the resource is different from the account that owns the simulated calling user CallerArn.
     */
    ResourceOwner?: ResourceNameType;
    /**
     * The ARN of the IAM user that you want to specify as the simulated caller of the API operations. If you do not specify a CallerArn, it defaults to the ARN of the user that you specify in PolicySourceArn, if you specified a user. If you include both a PolicySourceArn (for example, arn:aws:iam::123456789012:user/David) and a CallerArn (for example, arn:aws:iam::123456789012:user/Bob), the result is that you simulate calling the API operations as Bob, as if Bob had David's policies. You can specify only the ARN of an IAM user. You cannot specify the ARN of an assumed role, federated user, or a service principal.  CallerArn is required if you include a ResourcePolicy and the PolicySourceArn is not the ARN for an IAM user. This is required so that the resource-based policy's Principal element has a value to use in evaluating the policy. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    CallerArn?: ResourceNameType;
    /**
     * A list of context keys and corresponding values for the simulation to use. Whenever a context key is evaluated in one of the simulated IAM permissions policies, the corresponding value is supplied.
     */
    ContextEntries?: ContextEntryListType;
    /**
     * Specifies the type of simulation to run. Different API operations that support resource-based policies require different combinations of resources. By specifying the type of simulation to run, you enable the policy simulator to enforce the presence of the required resources to ensure reliable simulation results. If your simulation does not match one of the following scenarios, then you can omit this parameter. The following list shows each of the supported scenario values and the resources that you must define to run the simulation. Each of the EC2 scenarios requires that you specify instance, image, and security group resources. If your scenario includes an EBS volume, then you must specify that volume as a resource. If the EC2 scenario includes VPC, then you must supply the network interface resource. If it includes an IP subnet, then you must specify the subnet resource. For more information on the EC2 scenario options, see Supported platforms in the Amazon EC2 User Guide.    EC2-VPC-InstanceStore  instance, image, security group, network interface    EC2-VPC-InstanceStore-Subnet  instance, image, security group, network interface, subnet    EC2-VPC-EBS  instance, image, security group, network interface, volume    EC2-VPC-EBS-Subnet  instance, image, security group, network interface, subnet, volume  
     */
    ResourceHandlingOption?: ResourceHandlingOptionType;
    /**
     * Use this only when paginating results to indicate the maximum number of items you want in the response. If additional items exist beyond the maximum you specify, the IsTruncated response element is true. If you do not include this parameter, the number of items defaults to 100. Note that IAM might return fewer results, even when there are more results available. In that case, the IsTruncated response element returns true, and Marker contains a value to include in the subsequent call that tells the service where to continue from.
     */
    MaxItems?: maxItemsType;
    /**
     * Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated. Set it to the value of the Marker element in the response that you received to indicate where the next call should start.
     */
    Marker?: markerType;
  }
  export type SimulationPolicyListType = policyDocumentType[];
  export interface Statement {
    /**
     * The identifier of the policy that was provided as an input.
     */
    SourcePolicyId?: PolicyIdentifierType;
    /**
     * The type of the policy.
     */
    SourcePolicyType?: PolicySourceType;
    /**
     * The row and column of the beginning of the Statement in an IAM policy.
     */
    StartPosition?: Position;
    /**
     * The row and column of the end of a Statement in an IAM policy.
     */
    EndPosition?: Position;
  }
  export type StatementListType = Statement[];
  export interface Tag {
    /**
     * The key name that can be used to look up or retrieve the associated value. For example, Department or Cost Center are common choices.
     */
    Key: tagKeyType;
    /**
     * The value associated with this tag. For example, tags with a key name of Department could have values such as Human Resources, Accounting, and Support. Tags with a key name of Cost Center might have values that consist of the number associated with the different cost centers in your company. Typically, many resources have tags with the same key name but with different values.  Amazon Web Services always interprets the tag Value as a single string. If you need to store an array, you can store comma-separated values in the string. However, you must interpret the value in your code. 
     */
    Value: tagValueType;
  }
  export interface TagInstanceProfileRequest {
    /**
     * The name of the IAM instance profile to which you want to add tags. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    InstanceProfileName: instanceProfileNameType;
    /**
     * The list of tags that you want to attach to the IAM instance profile. Each tag consists of a key name and an associated value.
     */
    Tags: tagListType;
  }
  export interface TagMFADeviceRequest {
    /**
     * The unique identifier for the IAM virtual MFA device to which you want to add tags. For virtual MFA devices, the serial number is the same as the ARN. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    SerialNumber: serialNumberType;
    /**
     * The list of tags that you want to attach to the IAM virtual MFA device. Each tag consists of a key name and an associated value.
     */
    Tags: tagListType;
  }
  export interface TagOpenIDConnectProviderRequest {
    /**
     * The ARN of the OIDC identity provider in IAM to which you want to add tags. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    OpenIDConnectProviderArn: arnType;
    /**
     * The list of tags that you want to attach to the OIDC identity provider in IAM. Each tag consists of a key name and an associated value.
     */
    Tags: tagListType;
  }
  export interface TagPolicyRequest {
    /**
     * The ARN of the IAM customer managed policy to which you want to add tags. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    PolicyArn: arnType;
    /**
     * The list of tags that you want to attach to the IAM customer managed policy. Each tag consists of a key name and an associated value.
     */
    Tags: tagListType;
  }
  export interface TagRoleRequest {
    /**
     * The name of the IAM role to which you want to add tags. This parameter accepts (through its regex pattern) a string of characters that consist of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
    /**
     * The list of tags that you want to attach to the IAM role. Each tag consists of a key name and an associated value.
     */
    Tags: tagListType;
  }
  export interface TagSAMLProviderRequest {
    /**
     * The ARN of the SAML identity provider in IAM to which you want to add tags. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    SAMLProviderArn: arnType;
    /**
     * The list of tags that you want to attach to the SAML identity provider in IAM. Each tag consists of a key name and an associated value.
     */
    Tags: tagListType;
  }
  export interface TagServerCertificateRequest {
    /**
     * The name of the IAM server certificate to which you want to add tags. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    ServerCertificateName: serverCertificateNameType;
    /**
     * The list of tags that you want to attach to the IAM server certificate. Each tag consists of a key name and an associated value.
     */
    Tags: tagListType;
  }
  export interface TagUserRequest {
    /**
     * The name of the IAM user to which you want to add tags. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: existingUserNameType;
    /**
     * The list of tags that you want to attach to the IAM user. Each tag consists of a key name and an associated value.
     */
    Tags: tagListType;
  }
  export interface TrackedActionLastAccessed {
    /**
     * The name of the tracked action to which access was attempted. Tracked actions are actions that report activity to IAM.
     */
    ActionName?: stringType;
    LastAccessedEntity?: arnType;
    /**
     * The date and time, in ISO 8601 date-time format, when an authenticated entity most recently attempted to access the tracked service. Amazon Web Services does not report unauthenticated requests. This field is null if no IAM entities attempted to access the service within the tracking period.
     */
    LastAccessedTime?: dateType;
    /**
     * The Region from which the authenticated entity (user or role) last attempted to access the tracked action. Amazon Web Services does not report unauthenticated requests. This field is null if no IAM entities attempted to access the service within the tracking period.
     */
    LastAccessedRegion?: stringType;
  }
  export type TrackedActionsLastAccessed = TrackedActionLastAccessed[];
  export interface UntagInstanceProfileRequest {
    /**
     * The name of the IAM instance profile from which you want to remove tags. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    InstanceProfileName: instanceProfileNameType;
    /**
     * A list of key names as a simple array of strings. The tags with matching keys are removed from the specified instance profile.
     */
    TagKeys: tagKeyListType;
  }
  export interface UntagMFADeviceRequest {
    /**
     * The unique identifier for the IAM virtual MFA device from which you want to remove tags. For virtual MFA devices, the serial number is the same as the ARN. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    SerialNumber: serialNumberType;
    /**
     * A list of key names as a simple array of strings. The tags with matching keys are removed from the specified instance profile.
     */
    TagKeys: tagKeyListType;
  }
  export interface UntagOpenIDConnectProviderRequest {
    /**
     * The ARN of the OIDC provider in IAM from which you want to remove tags. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    OpenIDConnectProviderArn: arnType;
    /**
     * A list of key names as a simple array of strings. The tags with matching keys are removed from the specified OIDC provider.
     */
    TagKeys: tagKeyListType;
  }
  export interface UntagPolicyRequest {
    /**
     * The ARN of the IAM customer managed policy from which you want to remove tags. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    PolicyArn: arnType;
    /**
     * A list of key names as a simple array of strings. The tags with matching keys are removed from the specified policy.
     */
    TagKeys: tagKeyListType;
  }
  export interface UntagRoleRequest {
    /**
     * The name of the IAM role from which you want to remove tags. This parameter accepts (through its regex pattern) a string of characters that consist of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
    /**
     * A list of key names as a simple array of strings. The tags with matching keys are removed from the specified role.
     */
    TagKeys: tagKeyListType;
  }
  export interface UntagSAMLProviderRequest {
    /**
     * The ARN of the SAML identity provider in IAM from which you want to remove tags. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    SAMLProviderArn: arnType;
    /**
     * A list of key names as a simple array of strings. The tags with matching keys are removed from the specified SAML identity provider.
     */
    TagKeys: tagKeyListType;
  }
  export interface UntagServerCertificateRequest {
    /**
     * The name of the IAM server certificate from which you want to remove tags. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    ServerCertificateName: serverCertificateNameType;
    /**
     * A list of key names as a simple array of strings. The tags with matching keys are removed from the specified IAM server certificate.
     */
    TagKeys: tagKeyListType;
  }
  export interface UntagUserRequest {
    /**
     * The name of the IAM user from which you want to remove tags. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: existingUserNameType;
    /**
     * A list of key names as a simple array of strings. The tags with matching keys are removed from the specified user.
     */
    TagKeys: tagKeyListType;
  }
  export interface UpdateAccessKeyRequest {
    /**
     * The name of the user whose key you want to update. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName?: existingUserNameType;
    /**
     * The access key ID of the secret access key you want to update. This parameter allows (through its regex pattern) a string of characters that can consist of any upper or lowercased letter or digit.
     */
    AccessKeyId: accessKeyIdType;
    /**
     *  The status you want to assign to the secret access key. Active means that the key can be used for programmatic calls to Amazon Web Services, while Inactive means that the key cannot be used.
     */
    Status: statusType;
  }
  export interface UpdateAccountPasswordPolicyRequest {
    /**
     * The minimum number of characters allowed in an IAM user password. If you do not specify a value for this parameter, then the operation uses the default value of 6.
     */
    MinimumPasswordLength?: minimumPasswordLengthType;
    /**
     * Specifies whether IAM user passwords must contain at least one of the following non-alphanumeric characters: ! @ # $ % ^ &amp; * ( ) _ + - = [ ] { } | ' If you do not specify a value for this parameter, then the operation uses the default value of false. The result is that passwords do not require at least one symbol character.
     */
    RequireSymbols?: booleanType;
    /**
     * Specifies whether IAM user passwords must contain at least one numeric character (0 to 9). If you do not specify a value for this parameter, then the operation uses the default value of false. The result is that passwords do not require at least one numeric character.
     */
    RequireNumbers?: booleanType;
    /**
     * Specifies whether IAM user passwords must contain at least one uppercase character from the ISO basic Latin alphabet (A to Z). If you do not specify a value for this parameter, then the operation uses the default value of false. The result is that passwords do not require at least one uppercase character.
     */
    RequireUppercaseCharacters?: booleanType;
    /**
     * Specifies whether IAM user passwords must contain at least one lowercase character from the ISO basic Latin alphabet (a to z). If you do not specify a value for this parameter, then the operation uses the default value of false. The result is that passwords do not require at least one lowercase character.
     */
    RequireLowercaseCharacters?: booleanType;
    /**
     *  Allows all IAM users in your account to use the Amazon Web Services Management Console to change their own passwords. For more information, see Permitting IAM users to change their own passwords in the IAM User Guide. If you do not specify a value for this parameter, then the operation uses the default value of false. The result is that IAM users in the account do not automatically have permissions to change their own password.
     */
    AllowUsersToChangePassword?: booleanType;
    /**
     * The number of days that an IAM user password is valid. If you do not specify a value for this parameter, then the operation uses the default value of 0. The result is that IAM user passwords never expire.
     */
    MaxPasswordAge?: maxPasswordAgeType;
    /**
     * Specifies the number of previous passwords that IAM users are prevented from reusing. If you do not specify a value for this parameter, then the operation uses the default value of 0. The result is that IAM users are not prevented from reusing previous passwords.
     */
    PasswordReusePrevention?: passwordReusePreventionType;
    /**
     *  Prevents IAM users who are accessing the account via the Amazon Web Services Management Console from setting a new console password after their password has expired. The IAM user cannot access the console until an administrator resets the password. If you do not specify a value for this parameter, then the operation uses the default value of false. The result is that IAM users can change their passwords after they expire and continue to sign in as the user.   In the Amazon Web Services Management Console, the custom password policy option Allow users to change their own password gives IAM users permissions to iam:ChangePassword for only their user and to the iam:GetAccountPasswordPolicy action. This option does not attach a permissions policy to each user, rather the permissions are applied at the account-level for all users by IAM. IAM users with iam:ChangePassword permission and active access keys can reset their own expired console password using the CLI or API. 
     */
    HardExpiry?: booleanObjectType;
  }
  export interface UpdateAssumeRolePolicyRequest {
    /**
     * The name of the role to update with the new policy. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    RoleName: roleNameType;
    /**
     * The policy that grants an entity permission to assume the role. You must provide policies in JSON format in IAM. However, for CloudFormation templates formatted in YAML, you can provide the policy in JSON or YAML format. CloudFormation always converts a YAML policy to JSON format before submitting it to IAM. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    PolicyDocument: policyDocumentType;
  }
  export interface UpdateGroupRequest {
    /**
     * Name of the IAM group to update. If you're changing the name of the group, this is the original name. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    GroupName: groupNameType;
    /**
     * New path for the IAM group. Only include this if changing the group's path. This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    NewPath?: pathType;
    /**
     * New name for the IAM group. Only include this if changing the group's name. IAM user, group, role, and policy names must be unique within the account. Names are not distinguished by case. For example, you cannot create resources named both "MyResource" and "myresource".
     */
    NewGroupName?: groupNameType;
  }
  export interface UpdateLoginProfileRequest {
    /**
     * The name of the user whose password you want to update. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: userNameType;
    /**
     * The new password for the specified IAM user. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)   However, the format can be further restricted by the account administrator by setting a password policy on the Amazon Web Services account. For more information, see UpdateAccountPasswordPolicy.
     */
    Password?: passwordType;
    /**
     * Allows this new password to be used only once by requiring the specified IAM user to set a new password on next sign-in.
     */
    PasswordResetRequired?: booleanObjectType;
  }
  export interface UpdateOpenIDConnectProviderThumbprintRequest {
    /**
     * The Amazon Resource Name (ARN) of the IAM OIDC provider resource object for which you want to update the thumbprint. You can get a list of OIDC provider ARNs by using the ListOpenIDConnectProviders operation. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    OpenIDConnectProviderArn: arnType;
    /**
     * A list of certificate thumbprints that are associated with the specified IAM OpenID Connect provider. For more information, see CreateOpenIDConnectProvider. 
     */
    ThumbprintList: thumbprintListType;
  }
  export interface UpdateRoleDescriptionRequest {
    /**
     * The name of the role that you want to modify.
     */
    RoleName: roleNameType;
    /**
     * The new description that you want to apply to the specified role.
     */
    Description: roleDescriptionType;
  }
  export interface UpdateRoleDescriptionResponse {
    /**
     * A structure that contains details about the modified role.
     */
    Role?: Role;
  }
  export interface UpdateRoleRequest {
    /**
     * The name of the role that you want to modify.
     */
    RoleName: roleNameType;
    /**
     * The new description that you want to apply to the specified role.
     */
    Description?: roleDescriptionType;
    /**
     * The maximum session duration (in seconds) that you want to set for the specified role. If you do not specify a value for this setting, the default value of one hour is applied. This setting can have a value from 1 hour to 12 hours. Anyone who assumes the role from the CLI or API can use the DurationSeconds API parameter or the duration-seconds CLI parameter to request a longer session. The MaxSessionDuration setting determines the maximum duration that can be requested using the DurationSeconds parameter. If users don't specify a value for the DurationSeconds parameter, their security credentials are valid for one hour by default. This applies when you use the AssumeRole* API operations or the assume-role* CLI operations but does not apply when you use those operations to create a console URL. For more information, see Using IAM roles in the IAM User Guide.
     */
    MaxSessionDuration?: roleMaxSessionDurationType;
  }
  export interface UpdateRoleResponse {
  }
  export interface UpdateSAMLProviderRequest {
    /**
     * An XML document generated by an identity provider (IdP) that supports SAML 2.0. The document includes the issuer's name, expiration information, and keys that can be used to validate the SAML authentication response (assertions) that are received from the IdP. You must generate the metadata document using the identity management software that is used as your organization's IdP.
     */
    SAMLMetadataDocument: SAMLMetadataDocumentType;
    /**
     * The Amazon Resource Name (ARN) of the SAML provider to update. For more information about ARNs, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    SAMLProviderArn: arnType;
  }
  export interface UpdateSAMLProviderResponse {
    /**
     * The Amazon Resource Name (ARN) of the SAML provider that was updated.
     */
    SAMLProviderArn?: arnType;
  }
  export interface UpdateSSHPublicKeyRequest {
    /**
     * The name of the IAM user associated with the SSH public key. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: userNameType;
    /**
     * The unique identifier for the SSH public key. This parameter allows (through its regex pattern) a string of characters that can consist of any upper or lowercased letter or digit.
     */
    SSHPublicKeyId: publicKeyIdType;
    /**
     * The status to assign to the SSH public key. Active means that the key can be used for authentication with an CodeCommit repository. Inactive means that the key cannot be used.
     */
    Status: statusType;
  }
  export interface UpdateServerCertificateRequest {
    /**
     * The name of the server certificate that you want to update. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    ServerCertificateName: serverCertificateNameType;
    /**
     * The new path for the server certificate. Include this only if you are updating the server certificate's path. This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    NewPath?: pathType;
    /**
     * The new name for the server certificate. Include this only if you are updating the server certificate's name. The name of the certificate cannot contain any spaces. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    NewServerCertificateName?: serverCertificateNameType;
  }
  export interface UpdateServiceSpecificCredentialRequest {
    /**
     * The name of the IAM user associated with the service-specific credential. If you do not specify this value, then the operation assumes the user whose credentials are used to call the operation. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName?: userNameType;
    /**
     * The unique identifier of the service-specific credential. This parameter allows (through its regex pattern) a string of characters that can consist of any upper or lowercased letter or digit.
     */
    ServiceSpecificCredentialId: serviceSpecificCredentialId;
    /**
     * The status to be assigned to the service-specific credential.
     */
    Status: statusType;
  }
  export interface UpdateSigningCertificateRequest {
    /**
     * The name of the IAM user the signing certificate belongs to. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName?: existingUserNameType;
    /**
     * The ID of the signing certificate you want to update. This parameter allows (through its regex pattern) a string of characters that can consist of any upper or lowercased letter or digit.
     */
    CertificateId: certificateIdType;
    /**
     *  The status you want to assign to the certificate. Active means that the certificate can be used for programmatic calls to Amazon Web Services Inactive means that the certificate cannot be used.
     */
    Status: statusType;
  }
  export interface UpdateUserRequest {
    /**
     * Name of the user to update. If you're changing the name of the user, this is the original user name. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: existingUserNameType;
    /**
     * New path for the IAM user. Include this parameter only if you're changing the user's path. This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.
     */
    NewPath?: pathType;
    /**
     * New name for the user. Include this parameter only if you're changing the user's name. IAM user, group, role, and policy names must be unique within the account. Names are not distinguished by case. For example, you cannot create resources named both "MyResource" and "myresource".
     */
    NewUserName?: userNameType;
  }
  export interface UploadSSHPublicKeyRequest {
    /**
     * The name of the IAM user to associate the SSH public key with. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName: userNameType;
    /**
     * The SSH public key. The public key must be encoded in ssh-rsa format or PEM format. The minimum bit-length of the public key is 2048 bits. For example, you can generate a 2048-bit key, and the resulting PEM file is 1679 bytes long. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    SSHPublicKeyBody: publicKeyMaterialType;
  }
  export interface UploadSSHPublicKeyResponse {
    /**
     * Contains information about the SSH public key.
     */
    SSHPublicKey?: SSHPublicKey;
  }
  export interface UploadServerCertificateRequest {
    /**
     * The path for the server certificate. For more information about paths, see IAM identifiers in the IAM User Guide. This parameter is optional. If it is not included, it defaults to a slash (/). This parameter allows (through its regex pattern) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F), including most punctuation characters, digits, and upper and lowercased letters.   If you are uploading a server certificate specifically for use with Amazon CloudFront distributions, you must specify a path using the path parameter. The path must begin with /cloudfront and must include a trailing slash (for example, /cloudfront/test/). 
     */
    Path?: pathType;
    /**
     * The name for the server certificate. Do not include the path in this value. The name of the certificate cannot contain any spaces. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    ServerCertificateName: serverCertificateNameType;
    /**
     * The contents of the public key certificate in PEM-encoded format. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    CertificateBody: certificateBodyType;
    /**
     * The contents of the private key in PEM-encoded format. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    PrivateKey: privateKeyType;
    /**
     * The contents of the certificate chain. This is typically a concatenation of the PEM-encoded public key certificates of the chain. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    CertificateChain?: certificateChainType;
    /**
     * A list of tags that you want to attach to the new IAM server certificate resource. Each tag consists of a key name and an associated value. For more information about tagging, see Tagging IAM resources in the IAM User Guide.  If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created. 
     */
    Tags?: tagListType;
  }
  export interface UploadServerCertificateResponse {
    /**
     * The meta information of the uploaded server certificate without its certificate body, certificate chain, and private key.
     */
    ServerCertificateMetadata?: ServerCertificateMetadata;
    /**
     * A list of tags that are attached to the new IAM server certificate. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
     */
    Tags?: tagListType;
  }
  export interface UploadSigningCertificateRequest {
    /**
     * The name of the user the signing certificate is for. This parameter allows (through its regex pattern) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
     */
    UserName?: existingUserNameType;
    /**
     * The contents of the signing certificate. The regex pattern used to validate this parameter is a string of characters consisting of the following:   Any printable ASCII character ranging from the space character (\u0020) through the end of the ASCII character range   The printable characters in the Basic Latin and Latin-1 Supplement character set (through \u00FF)   The special characters tab (\u0009), line feed (\u000A), and carriage return (\u000D)  
     */
    CertificateBody: certificateBodyType;
  }
  export interface UploadSigningCertificateResponse {
    /**
     * Information about the certificate.
     */
    Certificate: SigningCertificate;
  }
  export interface User {
    /**
     * The path to the user. For more information about paths, see IAM identifiers in the IAM User Guide. The ARN of the policy used to set the permissions boundary for the user.
     */
    Path: pathType;
    /**
     * The friendly name identifying the user.
     */
    UserName: userNameType;
    /**
     * The stable and unique string identifying the user. For more information about IDs, see IAM identifiers in the IAM User Guide.
     */
    UserId: idType;
    /**
     * The Amazon Resource Name (ARN) that identifies the user. For more information about ARNs and how to use ARNs in policies, see IAM Identifiers in the IAM User Guide. 
     */
    Arn: arnType;
    /**
     * The date and time, in ISO 8601 date-time format, when the user was created.
     */
    CreateDate: dateType;
    /**
     * The date and time, in ISO 8601 date-time format, when the user's password was last used to sign in to an Amazon Web Services website. For a list of Amazon Web Services websites that capture a user's last sign-in time, see the Credential reports topic in the IAM User Guide. If a password is used more than once in a five-minute span, only the first use is returned in this field. If the field is null (no value), then it indicates that they never signed in with a password. This can be because:   The user never had a password.   A password exists but has not been used since IAM started tracking this information on October 20, 2014.   A null value does not mean that the user never had a password. Also, if the user does not currently have a password but had one in the past, then this field contains the date and time the most recent password was used. This value is returned only in the GetUser and ListUsers operations. 
     */
    PasswordLastUsed?: dateType;
    /**
     * For more information about permissions boundaries, see Permissions boundaries for IAM identities  in the IAM User Guide.
     */
    PermissionsBoundary?: AttachedPermissionsBoundary;
    /**
     * A list of tags that are associated with the user. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
     */
    Tags?: tagListType;
  }
  export interface UserDetail {
    /**
     * The path to the user. For more information about paths, see IAM identifiers in the IAM User Guide.
     */
    Path?: pathType;
    /**
     * The friendly name identifying the user.
     */
    UserName?: userNameType;
    /**
     * The stable and unique string identifying the user. For more information about IDs, see IAM identifiers in the IAM User Guide.
     */
    UserId?: idType;
    Arn?: arnType;
    /**
     * The date and time, in ISO 8601 date-time format, when the user was created.
     */
    CreateDate?: dateType;
    /**
     * A list of the inline policies embedded in the user.
     */
    UserPolicyList?: policyDetailListType;
    /**
     * A list of IAM groups that the user is in.
     */
    GroupList?: groupNameListType;
    /**
     * A list of the managed policies attached to the user.
     */
    AttachedManagedPolicies?: attachedPoliciesListType;
    /**
     * The ARN of the policy used to set the permissions boundary for the user. For more information about permissions boundaries, see Permissions boundaries for IAM identities  in the IAM User Guide.
     */
    PermissionsBoundary?: AttachedPermissionsBoundary;
    /**
     * A list of tags that are associated with the user. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
     */
    Tags?: tagListType;
  }
  export interface VirtualMFADevice {
    /**
     * The serial number associated with VirtualMFADevice.
     */
    SerialNumber: serialNumberType;
    /**
     *  The base32 seed defined as specified in RFC3548. The Base32StringSeed is base32-encoded. 
     */
    Base32StringSeed?: BootstrapDatum;
    /**
     *  A QR code PNG image that encodes otpauth://totp/$virtualMFADeviceName@$AccountName?secret=$Base32String where $virtualMFADeviceName is one of the create call arguments. AccountName is the user name if set (otherwise, the account ID otherwise), and Base32String is the seed in base32 format. The Base32String value is base64-encoded. 
     */
    QRCodePNG?: BootstrapDatum;
    /**
     * The IAM user associated with this virtual MFA device.
     */
    User?: User;
    /**
     * The date and time on which the virtual MFA device was enabled.
     */
    EnableDate?: dateType;
    /**
     * A list of tags that are attached to the virtual MFA device. For more information about tagging, see Tagging IAM resources in the IAM User Guide.
     */
    Tags?: tagListType;
  }
  export type accessKeyIdType = string;
  export type accessKeyMetadataListType = AccessKeyMetadata[];
  export type accessKeySecretType = string;
  export type accountAliasListType = accountAliasType[];
  export type accountAliasType = string;
  export type arnType = string;
  export type assignmentStatusType = "Assigned"|"Unassigned"|"Any"|string;
  export type attachedPoliciesListType = AttachedPolicy[];
  export type attachmentCountType = number;
  export type authenticationCodeType = string;
  export type booleanObjectType = boolean;
  export type booleanType = boolean;
  export type certificateBodyType = string;
  export type certificateChainType = string;
  export type certificateIdType = string;
  export type certificateListType = SigningCertificate[];
  export type clientIDListType = clientIDType[];
  export type clientIDType = string;
  export type customSuffixType = string;
  export type dateType = Date;
  export type encodingType = "SSH"|"PEM"|string;
  export type entityDetailsListType = EntityDetails[];
  export type entityListType = EntityType[];
  export type entityNameType = string;
  export type existingUserNameType = string;
  export type globalEndpointTokenVersion = "v1Token"|"v2Token"|string;
  export type groupDetailListType = GroupDetail[];
  export type groupListType = Group[];
  export type groupNameListType = groupNameType[];
  export type groupNameType = string;
  export type idType = string;
  export type instanceProfileListType = InstanceProfile[];
  export type instanceProfileNameType = string;
  export type integerType = number;
  export type jobIDType = string;
  export type jobStatusType = "IN_PROGRESS"|"COMPLETED"|"FAILED"|string;
  export type listPolicyGrantingServiceAccessResponseListType = ListPoliciesGrantingServiceAccessEntry[];
  export type markerType = string;
  export type maxItemsType = number;
  export type maxPasswordAgeType = number;
  export type mfaDeviceListType = MFADevice[];
  export type minimumPasswordLengthType = number;
  export type organizationsEntityPathType = string;
  export type organizationsPolicyIdType = string;
  export type passwordReusePreventionType = number;
  export type passwordType = string;
  export type pathPrefixType = string;
  export type pathType = string;
  export type policyDescriptionType = string;
  export type policyDetailListType = PolicyDetail[];
  export type policyDocumentType = string;
  export type policyDocumentVersionListType = PolicyVersion[];
  export type policyGrantingServiceAccessListType = PolicyGrantingServiceAccess[];
  export type policyListType = Policy[];
  export type policyNameListType = policyNameType[];
  export type policyNameType = string;
  export type policyOwnerEntityType = "USER"|"ROLE"|"GROUP"|string;
  export type policyPathType = string;
  export type policyScopeType = "All"|"AWS"|"Local"|string;
  export type policyType = "INLINE"|"MANAGED"|string;
  export type policyVersionIdType = string;
  export type privateKeyType = string;
  export type publicKeyFingerprintType = string;
  export type publicKeyIdType = string;
  export type publicKeyMaterialType = string;
  export type responseMarkerType = string;
  export type roleDescriptionType = string;
  export type roleDetailListType = RoleDetail[];
  export type roleListType = Role[];
  export type roleMaxSessionDurationType = number;
  export type roleNameType = string;
  export type serialNumberType = string;
  export type serverCertificateMetadataListType = ServerCertificateMetadata[];
  export type serverCertificateNameType = string;
  export type serviceName = string;
  export type serviceNameType = string;
  export type serviceNamespaceListType = serviceNamespaceType[];
  export type serviceNamespaceType = string;
  export type servicePassword = string;
  export type serviceSpecificCredentialId = string;
  export type serviceUserName = string;
  export type sortKeyType = "SERVICE_NAMESPACE_ASCENDING"|"SERVICE_NAMESPACE_DESCENDING"|"LAST_AUTHENTICATED_TIME_ASCENDING"|"LAST_AUTHENTICATED_TIME_DESCENDING"|string;
  export type statusType = "Active"|"Inactive"|string;
  export type stringType = string;
  export type summaryKeyType = "Users"|"UsersQuota"|"Groups"|"GroupsQuota"|"ServerCertificates"|"ServerCertificatesQuota"|"UserPolicySizeQuota"|"GroupPolicySizeQuota"|"GroupsPerUserQuota"|"SigningCertificatesPerUserQuota"|"AccessKeysPerUserQuota"|"MFADevices"|"MFADevicesInUse"|"AccountMFAEnabled"|"AccountAccessKeysPresent"|"AccountSigningCertificatesPresent"|"AttachedPoliciesPerGroupQuota"|"AttachedPoliciesPerRoleQuota"|"AttachedPoliciesPerUserQuota"|"Policies"|"PoliciesQuota"|"PolicySizeQuota"|"PolicyVersionsInUse"|"PolicyVersionsInUseQuota"|"VersionsPerPolicyQuota"|"GlobalEndpointTokenVersion"|string;
  export type summaryMapType = {[key: string]: summaryValueType};
  export type summaryValueType = number;
  export type tagKeyListType = tagKeyType[];
  export type tagKeyType = string;
  export type tagListType = Tag[];
  export type tagValueType = string;
  export type thumbprintListType = thumbprintType[];
  export type thumbprintType = string;
  export type userDetailListType = UserDetail[];
  export type userListType = User[];
  export type userNameType = string;
  export type virtualMFADeviceListType = VirtualMFADevice[];
  export type virtualMFADeviceName = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2010-05-08"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IAM client.
   */
  export import Types = IAM;
}
export = IAM;
