import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SecretsManager extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SecretsManager.Types.ClientConfiguration)
  config: Config & SecretsManager.Types.ClientConfiguration;
  /**
   * Disables automatic scheduled rotation and cancels the rotation of a secret if currently in progress. To re-enable scheduled rotation, call RotateSecret with AutomaticallyRotateAfterDays set to a value greater than 0. This immediately rotates your secret and then enables the automatic schedule.  If you cancel a rotation while in progress, it can leave the VersionStage labels in an unexpected state. Depending on the step of the rotation in progress, you might need to remove the staging label AWSPENDING from the partially created version, specified by the VersionId response value. You should also evaluate the partially rotated new version to see if it should be deleted, which you can do by removing all staging labels from the new version VersionStage field.  To successfully start a rotation, the staging label AWSPENDING must be in one of the following states:   Not attached to any version at all   Attached to the same version as the staging label AWSCURRENT    If the staging label AWSPENDING attached to a different version than the version with AWSCURRENT then the attempt to rotate fails.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:CancelRotateSecret    Related operations    To configure rotation for a secret or to manually trigger a rotation, use RotateSecret.   To get the rotation configuration details for a secret, use DescribeSecret.   To list all of the currently available secrets, use ListSecrets.   To list all of the versions currently associated with a secret, use ListSecretVersionIds.  
   */
  cancelRotateSecret(params: SecretsManager.Types.CancelRotateSecretRequest, callback?: (err: AWSError, data: SecretsManager.Types.CancelRotateSecretResponse) => void): Request<SecretsManager.Types.CancelRotateSecretResponse, AWSError>;
  /**
   * Disables automatic scheduled rotation and cancels the rotation of a secret if currently in progress. To re-enable scheduled rotation, call RotateSecret with AutomaticallyRotateAfterDays set to a value greater than 0. This immediately rotates your secret and then enables the automatic schedule.  If you cancel a rotation while in progress, it can leave the VersionStage labels in an unexpected state. Depending on the step of the rotation in progress, you might need to remove the staging label AWSPENDING from the partially created version, specified by the VersionId response value. You should also evaluate the partially rotated new version to see if it should be deleted, which you can do by removing all staging labels from the new version VersionStage field.  To successfully start a rotation, the staging label AWSPENDING must be in one of the following states:   Not attached to any version at all   Attached to the same version as the staging label AWSCURRENT    If the staging label AWSPENDING attached to a different version than the version with AWSCURRENT then the attempt to rotate fails.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:CancelRotateSecret    Related operations    To configure rotation for a secret or to manually trigger a rotation, use RotateSecret.   To get the rotation configuration details for a secret, use DescribeSecret.   To list all of the currently available secrets, use ListSecrets.   To list all of the versions currently associated with a secret, use ListSecretVersionIds.  
   */
  cancelRotateSecret(callback?: (err: AWSError, data: SecretsManager.Types.CancelRotateSecretResponse) => void): Request<SecretsManager.Types.CancelRotateSecretResponse, AWSError>;
  /**
   * Creates a new secret. A secret in Secrets Manager consists of both the protected secret data and the important information needed to manage the secret. Secrets Manager stores the encrypted secret data in one of a collection of "versions" associated with the secret. Each version contains a copy of the encrypted secret data. Each version is associated with one or more "staging labels" that identify where the version is in the rotation cycle. The SecretVersionsToStages field of the secret contains the mapping of staging labels to the active versions of the secret. Versions without a staging label are considered deprecated and not included in the list. You provide the secret data to be encrypted by putting text in either the SecretString parameter or binary data in the SecretBinary parameter, but not both. If you include SecretString or SecretBinary then Secrets Manager also creates an initial secret version and automatically attaches the staging label AWSCURRENT to the new version.    If you call an operation to encrypt or decrypt the SecretString or SecretBinary for a secret in the same account as the calling user and that secret doesn't specify a Amazon Web Services KMS encryption key, Secrets Manager uses the account's default Amazon Web Services managed customer master key (CMK) with the alias aws/secretsmanager. If this key doesn't already exist in your account then Secrets Manager creates it for you automatically. All users and roles in the same Amazon Web Services account automatically have access to use the default CMK. Note that if an Secrets Manager API call results in Amazon Web Services creating the account's Amazon Web Services-managed CMK, it can result in a one-time significant delay in returning the result.   If the secret resides in a different Amazon Web Services account from the credentials calling an API that requires encryption or decryption of the secret value then you must create and use a custom Amazon Web Services KMS CMK because you can't access the default CMK for the account using credentials from a different Amazon Web Services account. Store the ARN of the CMK in the secret when you create the secret or when you update it by including it in the KMSKeyId. If you call an API that must encrypt or decrypt SecretString or SecretBinary using credentials from a different account then the Amazon Web Services KMS key policy must grant cross-account access to that other account's user or role for both the kms:GenerateDataKey and kms:Decrypt operations.       Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:CreateSecret   kms:GenerateDataKey - needed only if you use a customer-managed Amazon Web Services KMS key to encrypt the secret. You do not need this permission to use the account default Amazon Web Services managed CMK for Secrets Manager.   kms:Decrypt - needed only if you use a customer-managed Amazon Web Services KMS key to encrypt the secret. You do not need this permission to use the account default Amazon Web Services managed CMK for Secrets Manager.   secretsmanager:TagResource - needed only if you include the Tags parameter.     Related operations    To delete a secret, use DeleteSecret.   To modify an existing secret, use UpdateSecret.   To create a new version of a secret, use PutSecretValue.   To retrieve the encrypted secure string and secure binary values, use GetSecretValue.   To retrieve all other details for a secret, use DescribeSecret. This does not include the encrypted secure string and secure binary values.   To retrieve the list of secret versions associated with the current secret, use DescribeSecret and examine the SecretVersionsToStages response value.  
   */
  createSecret(params: SecretsManager.Types.CreateSecretRequest, callback?: (err: AWSError, data: SecretsManager.Types.CreateSecretResponse) => void): Request<SecretsManager.Types.CreateSecretResponse, AWSError>;
  /**
   * Creates a new secret. A secret in Secrets Manager consists of both the protected secret data and the important information needed to manage the secret. Secrets Manager stores the encrypted secret data in one of a collection of "versions" associated with the secret. Each version contains a copy of the encrypted secret data. Each version is associated with one or more "staging labels" that identify where the version is in the rotation cycle. The SecretVersionsToStages field of the secret contains the mapping of staging labels to the active versions of the secret. Versions without a staging label are considered deprecated and not included in the list. You provide the secret data to be encrypted by putting text in either the SecretString parameter or binary data in the SecretBinary parameter, but not both. If you include SecretString or SecretBinary then Secrets Manager also creates an initial secret version and automatically attaches the staging label AWSCURRENT to the new version.    If you call an operation to encrypt or decrypt the SecretString or SecretBinary for a secret in the same account as the calling user and that secret doesn't specify a Amazon Web Services KMS encryption key, Secrets Manager uses the account's default Amazon Web Services managed customer master key (CMK) with the alias aws/secretsmanager. If this key doesn't already exist in your account then Secrets Manager creates it for you automatically. All users and roles in the same Amazon Web Services account automatically have access to use the default CMK. Note that if an Secrets Manager API call results in Amazon Web Services creating the account's Amazon Web Services-managed CMK, it can result in a one-time significant delay in returning the result.   If the secret resides in a different Amazon Web Services account from the credentials calling an API that requires encryption or decryption of the secret value then you must create and use a custom Amazon Web Services KMS CMK because you can't access the default CMK for the account using credentials from a different Amazon Web Services account. Store the ARN of the CMK in the secret when you create the secret or when you update it by including it in the KMSKeyId. If you call an API that must encrypt or decrypt SecretString or SecretBinary using credentials from a different account then the Amazon Web Services KMS key policy must grant cross-account access to that other account's user or role for both the kms:GenerateDataKey and kms:Decrypt operations.       Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:CreateSecret   kms:GenerateDataKey - needed only if you use a customer-managed Amazon Web Services KMS key to encrypt the secret. You do not need this permission to use the account default Amazon Web Services managed CMK for Secrets Manager.   kms:Decrypt - needed only if you use a customer-managed Amazon Web Services KMS key to encrypt the secret. You do not need this permission to use the account default Amazon Web Services managed CMK for Secrets Manager.   secretsmanager:TagResource - needed only if you include the Tags parameter.     Related operations    To delete a secret, use DeleteSecret.   To modify an existing secret, use UpdateSecret.   To create a new version of a secret, use PutSecretValue.   To retrieve the encrypted secure string and secure binary values, use GetSecretValue.   To retrieve all other details for a secret, use DescribeSecret. This does not include the encrypted secure string and secure binary values.   To retrieve the list of secret versions associated with the current secret, use DescribeSecret and examine the SecretVersionsToStages response value.  
   */
  createSecret(callback?: (err: AWSError, data: SecretsManager.Types.CreateSecretResponse) => void): Request<SecretsManager.Types.CreateSecretResponse, AWSError>;
  /**
   * Deletes the resource-based permission policy attached to the secret.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:DeleteResourcePolicy    Related operations    To attach a resource policy to a secret, use PutResourcePolicy.   To retrieve the current resource-based policy attached to a secret, use GetResourcePolicy.   To list all of the currently available secrets, use ListSecrets.  
   */
  deleteResourcePolicy(params: SecretsManager.Types.DeleteResourcePolicyRequest, callback?: (err: AWSError, data: SecretsManager.Types.DeleteResourcePolicyResponse) => void): Request<SecretsManager.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes the resource-based permission policy attached to the secret.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:DeleteResourcePolicy    Related operations    To attach a resource policy to a secret, use PutResourcePolicy.   To retrieve the current resource-based policy attached to a secret, use GetResourcePolicy.   To list all of the currently available secrets, use ListSecrets.  
   */
  deleteResourcePolicy(callback?: (err: AWSError, data: SecretsManager.Types.DeleteResourcePolicyResponse) => void): Request<SecretsManager.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes an entire secret and all of the versions. You can optionally include a recovery window during which you can restore the secret. If you don't specify a recovery window value, the operation defaults to 30 days. Secrets Manager attaches a DeletionDate stamp to the secret that specifies the end of the recovery window. At the end of the recovery window, Secrets Manager deletes the secret permanently. At any time before recovery window ends, you can use RestoreSecret to remove the DeletionDate and cancel the deletion of the secret. You cannot access the encrypted secret information in any secret scheduled for deletion. If you need to access that information, you must cancel the deletion with RestoreSecret and then retrieve the information.    There is no explicit operation to delete a version of a secret. Instead, remove all staging labels from the VersionStage field of a version. That marks the version as deprecated and allows Secrets Manager to delete it as needed. Versions without any staging labels do not show up in ListSecretVersionIds unless you specify IncludeDeprecated.   The permanent secret deletion at the end of the waiting period is performed as a background task with low priority. There is no guarantee of a specific time after the recovery window for the actual delete operation to occur.     Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:DeleteSecret    Related operations    To create a secret, use CreateSecret.   To cancel deletion of a version of a secret before the recovery window has expired, use RestoreSecret.  
   */
  deleteSecret(params: SecretsManager.Types.DeleteSecretRequest, callback?: (err: AWSError, data: SecretsManager.Types.DeleteSecretResponse) => void): Request<SecretsManager.Types.DeleteSecretResponse, AWSError>;
  /**
   * Deletes an entire secret and all of the versions. You can optionally include a recovery window during which you can restore the secret. If you don't specify a recovery window value, the operation defaults to 30 days. Secrets Manager attaches a DeletionDate stamp to the secret that specifies the end of the recovery window. At the end of the recovery window, Secrets Manager deletes the secret permanently. At any time before recovery window ends, you can use RestoreSecret to remove the DeletionDate and cancel the deletion of the secret. You cannot access the encrypted secret information in any secret scheduled for deletion. If you need to access that information, you must cancel the deletion with RestoreSecret and then retrieve the information.    There is no explicit operation to delete a version of a secret. Instead, remove all staging labels from the VersionStage field of a version. That marks the version as deprecated and allows Secrets Manager to delete it as needed. Versions without any staging labels do not show up in ListSecretVersionIds unless you specify IncludeDeprecated.   The permanent secret deletion at the end of the waiting period is performed as a background task with low priority. There is no guarantee of a specific time after the recovery window for the actual delete operation to occur.     Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:DeleteSecret    Related operations    To create a secret, use CreateSecret.   To cancel deletion of a version of a secret before the recovery window has expired, use RestoreSecret.  
   */
  deleteSecret(callback?: (err: AWSError, data: SecretsManager.Types.DeleteSecretResponse) => void): Request<SecretsManager.Types.DeleteSecretResponse, AWSError>;
  /**
   * Retrieves the details of a secret. It does not include the encrypted fields. Secrets Manager only returns fields populated with a value in the response.   Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:DescribeSecret    Related operations    To create a secret, use CreateSecret.   To modify a secret, use UpdateSecret.   To retrieve the encrypted secret information in a version of the secret, use GetSecretValue.   To list all of the secrets in the Amazon Web Services account, use ListSecrets.  
   */
  describeSecret(params: SecretsManager.Types.DescribeSecretRequest, callback?: (err: AWSError, data: SecretsManager.Types.DescribeSecretResponse) => void): Request<SecretsManager.Types.DescribeSecretResponse, AWSError>;
  /**
   * Retrieves the details of a secret. It does not include the encrypted fields. Secrets Manager only returns fields populated with a value in the response.   Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:DescribeSecret    Related operations    To create a secret, use CreateSecret.   To modify a secret, use UpdateSecret.   To retrieve the encrypted secret information in a version of the secret, use GetSecretValue.   To list all of the secrets in the Amazon Web Services account, use ListSecrets.  
   */
  describeSecret(callback?: (err: AWSError, data: SecretsManager.Types.DescribeSecretResponse) => void): Request<SecretsManager.Types.DescribeSecretResponse, AWSError>;
  /**
   * Generates a random password of the specified complexity. This operation is intended for use in the Lambda rotation function. Per best practice, we recommend that you specify the maximum length and include every character type that the system you are generating a password for can support.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:GetRandomPassword  
   */
  getRandomPassword(params: SecretsManager.Types.GetRandomPasswordRequest, callback?: (err: AWSError, data: SecretsManager.Types.GetRandomPasswordResponse) => void): Request<SecretsManager.Types.GetRandomPasswordResponse, AWSError>;
  /**
   * Generates a random password of the specified complexity. This operation is intended for use in the Lambda rotation function. Per best practice, we recommend that you specify the maximum length and include every character type that the system you are generating a password for can support.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:GetRandomPassword  
   */
  getRandomPassword(callback?: (err: AWSError, data: SecretsManager.Types.GetRandomPasswordResponse) => void): Request<SecretsManager.Types.GetRandomPasswordResponse, AWSError>;
  /**
   * Retrieves the JSON text of the resource-based policy document attached to the specified secret. The JSON request string input and response output displays formatted code with white space and line breaks for better readability. Submit your input as a single line JSON string.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:GetResourcePolicy    Related operations    To attach a resource policy to a secret, use PutResourcePolicy.   To delete the resource-based policy attached to a secret, use DeleteResourcePolicy.   To list all of the currently available secrets, use ListSecrets.  
   */
  getResourcePolicy(params: SecretsManager.Types.GetResourcePolicyRequest, callback?: (err: AWSError, data: SecretsManager.Types.GetResourcePolicyResponse) => void): Request<SecretsManager.Types.GetResourcePolicyResponse, AWSError>;
  /**
   * Retrieves the JSON text of the resource-based policy document attached to the specified secret. The JSON request string input and response output displays formatted code with white space and line breaks for better readability. Submit your input as a single line JSON string.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:GetResourcePolicy    Related operations    To attach a resource policy to a secret, use PutResourcePolicy.   To delete the resource-based policy attached to a secret, use DeleteResourcePolicy.   To list all of the currently available secrets, use ListSecrets.  
   */
  getResourcePolicy(callback?: (err: AWSError, data: SecretsManager.Types.GetResourcePolicyResponse) => void): Request<SecretsManager.Types.GetResourcePolicyResponse, AWSError>;
  /**
   * Retrieves the contents of the encrypted fields SecretString or SecretBinary from the specified version of a secret, whichever contains content.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:GetSecretValue   kms:Decrypt - required only if you use a customer-managed Amazon Web Services KMS key to encrypt the secret. You do not need this permission to use the account's default Amazon Web Services managed CMK for Secrets Manager.    Related operations    To create a new version of the secret with different encrypted information, use PutSecretValue.   To retrieve the non-encrypted details for the secret, use DescribeSecret.  
   */
  getSecretValue(params: SecretsManager.Types.GetSecretValueRequest, callback?: (err: AWSError, data: SecretsManager.Types.GetSecretValueResponse) => void): Request<SecretsManager.Types.GetSecretValueResponse, AWSError>;
  /**
   * Retrieves the contents of the encrypted fields SecretString or SecretBinary from the specified version of a secret, whichever contains content.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:GetSecretValue   kms:Decrypt - required only if you use a customer-managed Amazon Web Services KMS key to encrypt the secret. You do not need this permission to use the account's default Amazon Web Services managed CMK for Secrets Manager.    Related operations    To create a new version of the secret with different encrypted information, use PutSecretValue.   To retrieve the non-encrypted details for the secret, use DescribeSecret.  
   */
  getSecretValue(callback?: (err: AWSError, data: SecretsManager.Types.GetSecretValueResponse) => void): Request<SecretsManager.Types.GetSecretValueResponse, AWSError>;
  /**
   * Lists all of the versions attached to the specified secret. The output does not include the SecretString or SecretBinary fields. By default, the list includes only versions that have at least one staging label in VersionStage attached.  Always check the NextToken response parameter when calling any of the List* operations. These operations can occasionally return an empty or shorter than expected list of results even when there more results become available. When this happens, the NextToken response parameter contains a value to pass to the next call to the same API to request the next part of the list.   Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:ListSecretVersionIds    Related operations    To list the secrets in an account, use ListSecrets.  
   */
  listSecretVersionIds(params: SecretsManager.Types.ListSecretVersionIdsRequest, callback?: (err: AWSError, data: SecretsManager.Types.ListSecretVersionIdsResponse) => void): Request<SecretsManager.Types.ListSecretVersionIdsResponse, AWSError>;
  /**
   * Lists all of the versions attached to the specified secret. The output does not include the SecretString or SecretBinary fields. By default, the list includes only versions that have at least one staging label in VersionStage attached.  Always check the NextToken response parameter when calling any of the List* operations. These operations can occasionally return an empty or shorter than expected list of results even when there more results become available. When this happens, the NextToken response parameter contains a value to pass to the next call to the same API to request the next part of the list.   Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:ListSecretVersionIds    Related operations    To list the secrets in an account, use ListSecrets.  
   */
  listSecretVersionIds(callback?: (err: AWSError, data: SecretsManager.Types.ListSecretVersionIdsResponse) => void): Request<SecretsManager.Types.ListSecretVersionIdsResponse, AWSError>;
  /**
   * Lists all of the secrets that are stored by Secrets Manager in the Amazon Web Services account. To list the versions currently stored for a specific secret, use ListSecretVersionIds. The encrypted fields SecretString and SecretBinary are not included in the output. To get that information, call the GetSecretValue operation.  Always check the NextToken response parameter when calling any of the List* operations. These operations can occasionally return an empty or shorter than expected list of results even when there more results become available. When this happens, the NextToken response parameter contains a value to pass to the next call to the same API to request the next part of the list.   Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:ListSecrets    Related operations    To list the versions attached to a secret, use ListSecretVersionIds.  
   */
  listSecrets(params: SecretsManager.Types.ListSecretsRequest, callback?: (err: AWSError, data: SecretsManager.Types.ListSecretsResponse) => void): Request<SecretsManager.Types.ListSecretsResponse, AWSError>;
  /**
   * Lists all of the secrets that are stored by Secrets Manager in the Amazon Web Services account. To list the versions currently stored for a specific secret, use ListSecretVersionIds. The encrypted fields SecretString and SecretBinary are not included in the output. To get that information, call the GetSecretValue operation.  Always check the NextToken response parameter when calling any of the List* operations. These operations can occasionally return an empty or shorter than expected list of results even when there more results become available. When this happens, the NextToken response parameter contains a value to pass to the next call to the same API to request the next part of the list.   Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:ListSecrets    Related operations    To list the versions attached to a secret, use ListSecretVersionIds.  
   */
  listSecrets(callback?: (err: AWSError, data: SecretsManager.Types.ListSecretsResponse) => void): Request<SecretsManager.Types.ListSecretsResponse, AWSError>;
  /**
   * Attaches the contents of the specified resource-based permission policy to a secret. A resource-based policy is optional. Alternatively, you can use IAM identity-based policies that specify the secret's Amazon Resource Name (ARN) in the policy statement's Resources element. You can also use a combination of both identity-based and resource-based policies. The affected users and roles receive the permissions that are permitted by all of the relevant policies. For more information, see Using Resource-Based Policies for Amazon Web Services Secrets Manager. For the complete description of the Amazon Web Services policy syntax and grammar, see IAM JSON Policy Reference in the IAM User Guide.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:PutResourcePolicy    Related operations    To retrieve the resource policy attached to a secret, use GetResourcePolicy.   To delete the resource-based policy attached to a secret, use DeleteResourcePolicy.   To list all of the currently available secrets, use ListSecrets.  
   */
  putResourcePolicy(params: SecretsManager.Types.PutResourcePolicyRequest, callback?: (err: AWSError, data: SecretsManager.Types.PutResourcePolicyResponse) => void): Request<SecretsManager.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Attaches the contents of the specified resource-based permission policy to a secret. A resource-based policy is optional. Alternatively, you can use IAM identity-based policies that specify the secret's Amazon Resource Name (ARN) in the policy statement's Resources element. You can also use a combination of both identity-based and resource-based policies. The affected users and roles receive the permissions that are permitted by all of the relevant policies. For more information, see Using Resource-Based Policies for Amazon Web Services Secrets Manager. For the complete description of the Amazon Web Services policy syntax and grammar, see IAM JSON Policy Reference in the IAM User Guide.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:PutResourcePolicy    Related operations    To retrieve the resource policy attached to a secret, use GetResourcePolicy.   To delete the resource-based policy attached to a secret, use DeleteResourcePolicy.   To list all of the currently available secrets, use ListSecrets.  
   */
  putResourcePolicy(callback?: (err: AWSError, data: SecretsManager.Types.PutResourcePolicyResponse) => void): Request<SecretsManager.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Stores a new encrypted secret value in the specified secret. To do this, the operation creates a new version and attaches it to the secret. The version can contain a new SecretString value or a new SecretBinary value. You can also specify the staging labels that are initially attached to the new version. We recommend you avoid calling PutSecretValue at a sustained rate of more than once every 10 minutes. When you update the secret value, Secrets Manager creates a new version of the secret. Secrets Manager removes outdated versions when there are more than 100, but it does not remove versions created less than 24 hours ago. If you call PutSecretValue more than once every 10 minutes, you create more versions than Secrets Manager removes, and you will reach the quota for secret versions.   If this operation creates the first version for the secret then Secrets Manager automatically attaches the staging label AWSCURRENT to the new version.   If you do not specify a value for VersionStages then Secrets Manager automatically moves the staging label AWSCURRENT to this new version.   If this operation moves the staging label AWSCURRENT from another version to this version, then Secrets Manager also automatically moves the staging label AWSPREVIOUS to the version that AWSCURRENT was removed from.   This operation is idempotent. If a version with a VersionId with the same value as the ClientRequestToken parameter already exists and you specify the same secret data, the operation succeeds but does nothing. However, if the secret data is different, then the operation fails because you cannot modify an existing version; you can only create new ones.      If you call an operation to encrypt or decrypt the SecretString or SecretBinary for a secret in the same account as the calling user and that secret doesn't specify a Amazon Web Services KMS encryption key, Secrets Manager uses the account's default Amazon Web Services managed customer master key (CMK) with the alias aws/secretsmanager. If this key doesn't already exist in your account then Secrets Manager creates it for you automatically. All users and roles in the same Amazon Web Services account automatically have access to use the default CMK. Note that if an Secrets Manager API call results in Amazon Web Services creating the account's Amazon Web Services-managed CMK, it can result in a one-time significant delay in returning the result.   If the secret resides in a different Amazon Web Services account from the credentials calling an API that requires encryption or decryption of the secret value then you must create and use a custom Amazon Web Services KMS CMK because you can't access the default CMK for the account using credentials from a different Amazon Web Services account. Store the ARN of the CMK in the secret when you create the secret or when you update it by including it in the KMSKeyId. If you call an API that must encrypt or decrypt SecretString or SecretBinary using credentials from a different account then the Amazon Web Services KMS key policy must grant cross-account access to that other account's user or role for both the kms:GenerateDataKey and kms:Decrypt operations.     Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:PutSecretValue   kms:GenerateDataKey - needed only if you use a customer-managed Amazon Web Services KMS key to encrypt the secret. You do not need this permission to use the account's default Amazon Web Services managed CMK for Secrets Manager.    Related operations    To retrieve the encrypted value you store in the version of a secret, use GetSecretValue.   To create a secret, use CreateSecret.   To get the details for a secret, use DescribeSecret.   To list the versions attached to a secret, use ListSecretVersionIds.  
   */
  putSecretValue(params: SecretsManager.Types.PutSecretValueRequest, callback?: (err: AWSError, data: SecretsManager.Types.PutSecretValueResponse) => void): Request<SecretsManager.Types.PutSecretValueResponse, AWSError>;
  /**
   * Stores a new encrypted secret value in the specified secret. To do this, the operation creates a new version and attaches it to the secret. The version can contain a new SecretString value or a new SecretBinary value. You can also specify the staging labels that are initially attached to the new version. We recommend you avoid calling PutSecretValue at a sustained rate of more than once every 10 minutes. When you update the secret value, Secrets Manager creates a new version of the secret. Secrets Manager removes outdated versions when there are more than 100, but it does not remove versions created less than 24 hours ago. If you call PutSecretValue more than once every 10 minutes, you create more versions than Secrets Manager removes, and you will reach the quota for secret versions.   If this operation creates the first version for the secret then Secrets Manager automatically attaches the staging label AWSCURRENT to the new version.   If you do not specify a value for VersionStages then Secrets Manager automatically moves the staging label AWSCURRENT to this new version.   If this operation moves the staging label AWSCURRENT from another version to this version, then Secrets Manager also automatically moves the staging label AWSPREVIOUS to the version that AWSCURRENT was removed from.   This operation is idempotent. If a version with a VersionId with the same value as the ClientRequestToken parameter already exists and you specify the same secret data, the operation succeeds but does nothing. However, if the secret data is different, then the operation fails because you cannot modify an existing version; you can only create new ones.      If you call an operation to encrypt or decrypt the SecretString or SecretBinary for a secret in the same account as the calling user and that secret doesn't specify a Amazon Web Services KMS encryption key, Secrets Manager uses the account's default Amazon Web Services managed customer master key (CMK) with the alias aws/secretsmanager. If this key doesn't already exist in your account then Secrets Manager creates it for you automatically. All users and roles in the same Amazon Web Services account automatically have access to use the default CMK. Note that if an Secrets Manager API call results in Amazon Web Services creating the account's Amazon Web Services-managed CMK, it can result in a one-time significant delay in returning the result.   If the secret resides in a different Amazon Web Services account from the credentials calling an API that requires encryption or decryption of the secret value then you must create and use a custom Amazon Web Services KMS CMK because you can't access the default CMK for the account using credentials from a different Amazon Web Services account. Store the ARN of the CMK in the secret when you create the secret or when you update it by including it in the KMSKeyId. If you call an API that must encrypt or decrypt SecretString or SecretBinary using credentials from a different account then the Amazon Web Services KMS key policy must grant cross-account access to that other account's user or role for both the kms:GenerateDataKey and kms:Decrypt operations.     Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:PutSecretValue   kms:GenerateDataKey - needed only if you use a customer-managed Amazon Web Services KMS key to encrypt the secret. You do not need this permission to use the account's default Amazon Web Services managed CMK for Secrets Manager.    Related operations    To retrieve the encrypted value you store in the version of a secret, use GetSecretValue.   To create a secret, use CreateSecret.   To get the details for a secret, use DescribeSecret.   To list the versions attached to a secret, use ListSecretVersionIds.  
   */
  putSecretValue(callback?: (err: AWSError, data: SecretsManager.Types.PutSecretValueResponse) => void): Request<SecretsManager.Types.PutSecretValueResponse, AWSError>;
  /**
   * Remove regions from replication.
   */
  removeRegionsFromReplication(params: SecretsManager.Types.RemoveRegionsFromReplicationRequest, callback?: (err: AWSError, data: SecretsManager.Types.RemoveRegionsFromReplicationResponse) => void): Request<SecretsManager.Types.RemoveRegionsFromReplicationResponse, AWSError>;
  /**
   * Remove regions from replication.
   */
  removeRegionsFromReplication(callback?: (err: AWSError, data: SecretsManager.Types.RemoveRegionsFromReplicationResponse) => void): Request<SecretsManager.Types.RemoveRegionsFromReplicationResponse, AWSError>;
  /**
   * Converts an existing secret to a multi-Region secret and begins replication the secret to a list of new regions. 
   */
  replicateSecretToRegions(params: SecretsManager.Types.ReplicateSecretToRegionsRequest, callback?: (err: AWSError, data: SecretsManager.Types.ReplicateSecretToRegionsResponse) => void): Request<SecretsManager.Types.ReplicateSecretToRegionsResponse, AWSError>;
  /**
   * Converts an existing secret to a multi-Region secret and begins replication the secret to a list of new regions. 
   */
  replicateSecretToRegions(callback?: (err: AWSError, data: SecretsManager.Types.ReplicateSecretToRegionsResponse) => void): Request<SecretsManager.Types.ReplicateSecretToRegionsResponse, AWSError>;
  /**
   * Cancels the scheduled deletion of a secret by removing the DeletedDate time stamp. This makes the secret accessible to query once again.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:RestoreSecret    Related operations    To delete a secret, use DeleteSecret.  
   */
  restoreSecret(params: SecretsManager.Types.RestoreSecretRequest, callback?: (err: AWSError, data: SecretsManager.Types.RestoreSecretResponse) => void): Request<SecretsManager.Types.RestoreSecretResponse, AWSError>;
  /**
   * Cancels the scheduled deletion of a secret by removing the DeletedDate time stamp. This makes the secret accessible to query once again.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:RestoreSecret    Related operations    To delete a secret, use DeleteSecret.  
   */
  restoreSecret(callback?: (err: AWSError, data: SecretsManager.Types.RestoreSecretResponse) => void): Request<SecretsManager.Types.RestoreSecretResponse, AWSError>;
  /**
   * Configures and starts the asynchronous process of rotating this secret. If you include the configuration parameters, the operation sets those values for the secret and then immediately starts a rotation. If you do not include the configuration parameters, the operation starts a rotation with the values already stored in the secret. After the rotation completes, the protected service and its clients all use the new version of the secret.  This required configuration information includes the ARN of an Amazon Web Services Lambda function and optionally, the time between scheduled rotations. The Lambda rotation function creates a new version of the secret and creates or updates the credentials on the protected service to match. After testing the new credentials, the function marks the new secret with the staging label AWSCURRENT so that your clients all immediately begin to use the new version. For more information about rotating secrets and how to configure a Lambda function to rotate the secrets for your protected service, see Rotating Secrets in Amazon Web Services Secrets Manager in the Amazon Web Services Secrets Manager User Guide. Secrets Manager schedules the next rotation when the previous one completes. Secrets Manager schedules the date by adding the rotation interval (number of days) to the actual date of the last rotation. The service chooses the hour within that 24-hour date window randomly. The minute is also chosen somewhat randomly, but weighted towards the top of the hour and influenced by a variety of factors that help distribute load. The rotation function must end with the versions of the secret in one of two states:   The AWSPENDING and AWSCURRENT staging labels are attached to the same version of the secret, or   The AWSPENDING staging label is not attached to any version of the secret.   If the AWSPENDING staging label is present but not attached to the same version as AWSCURRENT then any later invocation of RotateSecret assumes that a previous rotation request is still in progress and returns an error.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:RotateSecret   lambda:InvokeFunction (on the function specified in the secret's metadata)    Related operations    To list the secrets in your account, use ListSecrets.   To get the details for a version of a secret, use DescribeSecret.   To create a new version of a secret, use CreateSecret.   To attach staging labels to or remove staging labels from a version of a secret, use UpdateSecretVersionStage.  
   */
  rotateSecret(params: SecretsManager.Types.RotateSecretRequest, callback?: (err: AWSError, data: SecretsManager.Types.RotateSecretResponse) => void): Request<SecretsManager.Types.RotateSecretResponse, AWSError>;
  /**
   * Configures and starts the asynchronous process of rotating this secret. If you include the configuration parameters, the operation sets those values for the secret and then immediately starts a rotation. If you do not include the configuration parameters, the operation starts a rotation with the values already stored in the secret. After the rotation completes, the protected service and its clients all use the new version of the secret.  This required configuration information includes the ARN of an Amazon Web Services Lambda function and optionally, the time between scheduled rotations. The Lambda rotation function creates a new version of the secret and creates or updates the credentials on the protected service to match. After testing the new credentials, the function marks the new secret with the staging label AWSCURRENT so that your clients all immediately begin to use the new version. For more information about rotating secrets and how to configure a Lambda function to rotate the secrets for your protected service, see Rotating Secrets in Amazon Web Services Secrets Manager in the Amazon Web Services Secrets Manager User Guide. Secrets Manager schedules the next rotation when the previous one completes. Secrets Manager schedules the date by adding the rotation interval (number of days) to the actual date of the last rotation. The service chooses the hour within that 24-hour date window randomly. The minute is also chosen somewhat randomly, but weighted towards the top of the hour and influenced by a variety of factors that help distribute load. The rotation function must end with the versions of the secret in one of two states:   The AWSPENDING and AWSCURRENT staging labels are attached to the same version of the secret, or   The AWSPENDING staging label is not attached to any version of the secret.   If the AWSPENDING staging label is present but not attached to the same version as AWSCURRENT then any later invocation of RotateSecret assumes that a previous rotation request is still in progress and returns an error.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:RotateSecret   lambda:InvokeFunction (on the function specified in the secret's metadata)    Related operations    To list the secrets in your account, use ListSecrets.   To get the details for a version of a secret, use DescribeSecret.   To create a new version of a secret, use CreateSecret.   To attach staging labels to or remove staging labels from a version of a secret, use UpdateSecretVersionStage.  
   */
  rotateSecret(callback?: (err: AWSError, data: SecretsManager.Types.RotateSecretResponse) => void): Request<SecretsManager.Types.RotateSecretResponse, AWSError>;
  /**
   * Removes the secret from replication and promotes the secret to a regional secret in the replica Region.
   */
  stopReplicationToReplica(params: SecretsManager.Types.StopReplicationToReplicaRequest, callback?: (err: AWSError, data: SecretsManager.Types.StopReplicationToReplicaResponse) => void): Request<SecretsManager.Types.StopReplicationToReplicaResponse, AWSError>;
  /**
   * Removes the secret from replication and promotes the secret to a regional secret in the replica Region.
   */
  stopReplicationToReplica(callback?: (err: AWSError, data: SecretsManager.Types.StopReplicationToReplicaResponse) => void): Request<SecretsManager.Types.StopReplicationToReplicaResponse, AWSError>;
  /**
   * Attaches one or more tags, each consisting of a key name and a value, to the specified secret. Tags are part of the secret's overall metadata, and are not associated with any specific version of the secret. This operation only appends tags to the existing list of tags. To remove tags, you must use UntagResource. The following basic restrictions apply to tags:   Maximum number of tags per secret—50   Maximum key length—127 Unicode characters in UTF-8   Maximum value length—255 Unicode characters in UTF-8   Tag keys and values are case sensitive.   Do not use the aws: prefix in your tag names or values because Amazon Web Services reserves it for Amazon Web Services use. You can't edit or delete tag names or values with this prefix. Tags with this prefix do not count against your tags per secret limit.   If you use your tagging schema across multiple services and resources, remember other services might have restrictions on allowed characters. Generally allowed characters: letters, spaces, and numbers representable in UTF-8, plus the following special characters: + - = . _ : / @.    If you use tags as part of your security strategy, then adding or removing a tag can change permissions. If successfully completing this operation would result in you losing your permissions for this secret, then the operation is blocked and returns an Access Denied error.   Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:TagResource    Related operations    To remove one or more tags from the collection attached to a secret, use UntagResource.   To view the list of tags attached to a secret, use DescribeSecret.  
   */
  tagResource(params: SecretsManager.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches one or more tags, each consisting of a key name and a value, to the specified secret. Tags are part of the secret's overall metadata, and are not associated with any specific version of the secret. This operation only appends tags to the existing list of tags. To remove tags, you must use UntagResource. The following basic restrictions apply to tags:   Maximum number of tags per secret—50   Maximum key length—127 Unicode characters in UTF-8   Maximum value length—255 Unicode characters in UTF-8   Tag keys and values are case sensitive.   Do not use the aws: prefix in your tag names or values because Amazon Web Services reserves it for Amazon Web Services use. You can't edit or delete tag names or values with this prefix. Tags with this prefix do not count against your tags per secret limit.   If you use your tagging schema across multiple services and resources, remember other services might have restrictions on allowed characters. Generally allowed characters: letters, spaces, and numbers representable in UTF-8, plus the following special characters: + - = . _ : / @.    If you use tags as part of your security strategy, then adding or removing a tag can change permissions. If successfully completing this operation would result in you losing your permissions for this secret, then the operation is blocked and returns an Access Denied error.   Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:TagResource    Related operations    To remove one or more tags from the collection attached to a secret, use UntagResource.   To view the list of tags attached to a secret, use DescribeSecret.  
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes one or more tags from the specified secret. This operation is idempotent. If a requested tag is not attached to the secret, no error is returned and the secret metadata is unchanged.  If you use tags as part of your security strategy, then removing a tag can change permissions. If successfully completing this operation would result in you losing your permissions for this secret, then the operation is blocked and returns an Access Denied error.   Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:UntagResource    Related operations    To add one or more tags to the collection attached to a secret, use TagResource.   To view the list of tags attached to a secret, use DescribeSecret.  
   */
  untagResource(params: SecretsManager.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes one or more tags from the specified secret. This operation is idempotent. If a requested tag is not attached to the secret, no error is returned and the secret metadata is unchanged.  If you use tags as part of your security strategy, then removing a tag can change permissions. If successfully completing this operation would result in you losing your permissions for this secret, then the operation is blocked and returns an Access Denied error.   Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:UntagResource    Related operations    To add one or more tags to the collection attached to a secret, use TagResource.   To view the list of tags attached to a secret, use DescribeSecret.  
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Modifies many of the details of the specified secret.  To change the secret value, you can also use PutSecretValue. To change the rotation configuration of a secret, use RotateSecret instead. We recommend you avoid calling UpdateSecret at a sustained rate of more than once every 10 minutes. When you call UpdateSecret to update the secret value, Secrets Manager creates a new version of the secret. Secrets Manager removes outdated versions when there are more than 100, but it does not remove versions created less than 24 hours ago. If you update the secret value more than once every 10 minutes, you create more versions than Secrets Manager removes, and you will reach the quota for secret versions.  The Secrets Manager console uses only the SecretString parameter and therefore limits you to encrypting and storing only a text string. To encrypt and store binary data as part of the version of a secret, you must use either the Amazon Web Services CLI or one of the Amazon Web Services SDKs.    If a version with a VersionId with the same value as the ClientRequestToken parameter already exists, the operation results in an error. You cannot modify an existing version, you can only create a new version.   If you include SecretString or SecretBinary to create a new secret version, Secrets Manager automatically attaches the staging label AWSCURRENT to the new version.       If you call an operation to encrypt or decrypt the SecretString or SecretBinary for a secret in the same account as the calling user and that secret doesn't specify a Amazon Web Services KMS encryption key, Secrets Manager uses the account's default Amazon Web Services managed customer master key (CMK) with the alias aws/secretsmanager. If this key doesn't already exist in your account then Secrets Manager creates it for you automatically. All users and roles in the same Amazon Web Services account automatically have access to use the default CMK. Note that if an Secrets Manager API call results in Amazon Web Services creating the account's Amazon Web Services-managed CMK, it can result in a one-time significant delay in returning the result.   If the secret resides in a different Amazon Web Services account from the credentials calling an API that requires encryption or decryption of the secret value then you must create and use a custom Amazon Web Services KMS CMK because you can't access the default CMK for the account using credentials from a different Amazon Web Services account. Store the ARN of the CMK in the secret when you create the secret or when you update it by including it in the KMSKeyId. If you call an API that must encrypt or decrypt SecretString or SecretBinary using credentials from a different account then the Amazon Web Services KMS key policy must grant cross-account access to that other account's user or role for both the kms:GenerateDataKey and kms:Decrypt operations.     Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:UpdateSecret   kms:GenerateDataKey - needed only if you use a custom Amazon Web Services KMS key to encrypt the secret. You do not need this permission to use the account's Amazon Web Services managed CMK for Secrets Manager.   kms:Decrypt - needed only if you use a custom Amazon Web Services KMS key to encrypt the secret. You do not need this permission to use the account's Amazon Web Services managed CMK for Secrets Manager.    Related operations    To create a new secret, use CreateSecret.   To add only a new version to an existing secret, use PutSecretValue.   To get the details for a secret, use DescribeSecret.   To list the versions contained in a secret, use ListSecretVersionIds.  
   */
  updateSecret(params: SecretsManager.Types.UpdateSecretRequest, callback?: (err: AWSError, data: SecretsManager.Types.UpdateSecretResponse) => void): Request<SecretsManager.Types.UpdateSecretResponse, AWSError>;
  /**
   * Modifies many of the details of the specified secret.  To change the secret value, you can also use PutSecretValue. To change the rotation configuration of a secret, use RotateSecret instead. We recommend you avoid calling UpdateSecret at a sustained rate of more than once every 10 minutes. When you call UpdateSecret to update the secret value, Secrets Manager creates a new version of the secret. Secrets Manager removes outdated versions when there are more than 100, but it does not remove versions created less than 24 hours ago. If you update the secret value more than once every 10 minutes, you create more versions than Secrets Manager removes, and you will reach the quota for secret versions.  The Secrets Manager console uses only the SecretString parameter and therefore limits you to encrypting and storing only a text string. To encrypt and store binary data as part of the version of a secret, you must use either the Amazon Web Services CLI or one of the Amazon Web Services SDKs.    If a version with a VersionId with the same value as the ClientRequestToken parameter already exists, the operation results in an error. You cannot modify an existing version, you can only create a new version.   If you include SecretString or SecretBinary to create a new secret version, Secrets Manager automatically attaches the staging label AWSCURRENT to the new version.       If you call an operation to encrypt or decrypt the SecretString or SecretBinary for a secret in the same account as the calling user and that secret doesn't specify a Amazon Web Services KMS encryption key, Secrets Manager uses the account's default Amazon Web Services managed customer master key (CMK) with the alias aws/secretsmanager. If this key doesn't already exist in your account then Secrets Manager creates it for you automatically. All users and roles in the same Amazon Web Services account automatically have access to use the default CMK. Note that if an Secrets Manager API call results in Amazon Web Services creating the account's Amazon Web Services-managed CMK, it can result in a one-time significant delay in returning the result.   If the secret resides in a different Amazon Web Services account from the credentials calling an API that requires encryption or decryption of the secret value then you must create and use a custom Amazon Web Services KMS CMK because you can't access the default CMK for the account using credentials from a different Amazon Web Services account. Store the ARN of the CMK in the secret when you create the secret or when you update it by including it in the KMSKeyId. If you call an API that must encrypt or decrypt SecretString or SecretBinary using credentials from a different account then the Amazon Web Services KMS key policy must grant cross-account access to that other account's user or role for both the kms:GenerateDataKey and kms:Decrypt operations.     Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:UpdateSecret   kms:GenerateDataKey - needed only if you use a custom Amazon Web Services KMS key to encrypt the secret. You do not need this permission to use the account's Amazon Web Services managed CMK for Secrets Manager.   kms:Decrypt - needed only if you use a custom Amazon Web Services KMS key to encrypt the secret. You do not need this permission to use the account's Amazon Web Services managed CMK for Secrets Manager.    Related operations    To create a new secret, use CreateSecret.   To add only a new version to an existing secret, use PutSecretValue.   To get the details for a secret, use DescribeSecret.   To list the versions contained in a secret, use ListSecretVersionIds.  
   */
  updateSecret(callback?: (err: AWSError, data: SecretsManager.Types.UpdateSecretResponse) => void): Request<SecretsManager.Types.UpdateSecretResponse, AWSError>;
  /**
   * Modifies the staging labels attached to a version of a secret. Staging labels are used to track a version as it progresses through the secret rotation process. You can attach a staging label to only one version of a secret at a time. If a staging label to be added is already attached to another version, then it is moved--removed from the other version first and then attached to this one. For more information about staging labels, see Staging Labels in the Amazon Web Services Secrets Manager User Guide.  The staging labels that you specify in the VersionStage parameter are added to the existing list of staging labels--they don't replace it. You can move the AWSCURRENT staging label to this version by including it in this call.  Whenever you move AWSCURRENT, Secrets Manager automatically moves the label AWSPREVIOUS to the version that AWSCURRENT was removed from.  If this action results in the last label being removed from a version, then the version is considered to be 'deprecated' and can be deleted by Secrets Manager.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:UpdateSecretVersionStage    Related operations    To get the list of staging labels that are currently associated with a version of a secret, use  DescribeSecret  and examine the SecretVersionsToStages response value.   
   */
  updateSecretVersionStage(params: SecretsManager.Types.UpdateSecretVersionStageRequest, callback?: (err: AWSError, data: SecretsManager.Types.UpdateSecretVersionStageResponse) => void): Request<SecretsManager.Types.UpdateSecretVersionStageResponse, AWSError>;
  /**
   * Modifies the staging labels attached to a version of a secret. Staging labels are used to track a version as it progresses through the secret rotation process. You can attach a staging label to only one version of a secret at a time. If a staging label to be added is already attached to another version, then it is moved--removed from the other version first and then attached to this one. For more information about staging labels, see Staging Labels in the Amazon Web Services Secrets Manager User Guide.  The staging labels that you specify in the VersionStage parameter are added to the existing list of staging labels--they don't replace it. You can move the AWSCURRENT staging label to this version by including it in this call.  Whenever you move AWSCURRENT, Secrets Manager automatically moves the label AWSPREVIOUS to the version that AWSCURRENT was removed from.  If this action results in the last label being removed from a version, then the version is considered to be 'deprecated' and can be deleted by Secrets Manager.  Minimum permissions  To run this command, you must have the following permissions:   secretsmanager:UpdateSecretVersionStage    Related operations    To get the list of staging labels that are currently associated with a version of a secret, use  DescribeSecret  and examine the SecretVersionsToStages response value.   
   */
  updateSecretVersionStage(callback?: (err: AWSError, data: SecretsManager.Types.UpdateSecretVersionStageResponse) => void): Request<SecretsManager.Types.UpdateSecretVersionStageResponse, AWSError>;
  /**
   * Validates that the resource policy does not grant a wide range of IAM principals access to your secret. The JSON request string input and response output displays formatted code with white space and line breaks for better readability. Submit your input as a single line JSON string. A resource-based policy is optional for secrets. The API performs three checks when validating the secret:   Sends a call to Zelkova, an automated reasoning engine, to ensure your Resource Policy does not allow broad access to your secret.   Checks for correct syntax in a policy.   Verifies the policy does not lock out a caller.    Minimum Permissions  You must have the permissions required to access the following APIs:    secretsmanager:PutResourcePolicy     secretsmanager:ValidateResourcePolicy   
   */
  validateResourcePolicy(params: SecretsManager.Types.ValidateResourcePolicyRequest, callback?: (err: AWSError, data: SecretsManager.Types.ValidateResourcePolicyResponse) => void): Request<SecretsManager.Types.ValidateResourcePolicyResponse, AWSError>;
  /**
   * Validates that the resource policy does not grant a wide range of IAM principals access to your secret. The JSON request string input and response output displays formatted code with white space and line breaks for better readability. Submit your input as a single line JSON string. A resource-based policy is optional for secrets. The API performs three checks when validating the secret:   Sends a call to Zelkova, an automated reasoning engine, to ensure your Resource Policy does not allow broad access to your secret.   Checks for correct syntax in a policy.   Verifies the policy does not lock out a caller.    Minimum Permissions  You must have the permissions required to access the following APIs:    secretsmanager:PutResourcePolicy     secretsmanager:ValidateResourcePolicy   
   */
  validateResourcePolicy(callback?: (err: AWSError, data: SecretsManager.Types.ValidateResourcePolicyResponse) => void): Request<SecretsManager.Types.ValidateResourcePolicyResponse, AWSError>;
}
declare namespace SecretsManager {
  export type AddReplicaRegionListType = ReplicaRegionType[];
  export type AutomaticallyRotateAfterDaysType = number;
  export type BooleanType = boolean;
  export interface CancelRotateSecretRequest {
    /**
     * Specifies the secret to cancel a rotation request. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId: SecretIdType;
  }
  export interface CancelRotateSecretResponse {
    /**
     * The ARN of the secret for which rotation was canceled.
     */
    ARN?: SecretARNType;
    /**
     * The friendly name of the secret for which rotation was canceled.
     */
    Name?: SecretNameType;
    /**
     * The unique identifier of the version of the secret created during the rotation. This version might not be complete, and should be evaluated for possible deletion. At the very least, you should remove the VersionStage value AWSPENDING to enable this version to be deleted. Failing to clean up a cancelled rotation can block you from successfully starting future rotations.
     */
    VersionId?: SecretVersionIdType;
  }
  export type ClientRequestTokenType = string;
  export interface CreateSecretRequest {
    /**
     * Specifies the friendly name of the new secret. The secret name must be ASCII letters, digits, or the following characters : /_+=.@-  Do not end your secret name with a hyphen followed by six characters. If you do so, you risk confusion and unexpected results when searching for a secret by partial ARN. Secrets Manager automatically adds a hyphen and six random characters at the end of the ARN. 
     */
    Name: NameType;
    /**
     * (Optional) If you include SecretString or SecretBinary, then an initial version is created as part of the secret, and this parameter specifies a unique identifier for the new version.   If you use the Amazon Web Services CLI or one of the Amazon Web Services SDK to call this operation, then you can leave this parameter empty. The CLI or SDK generates a random UUID for you and includes it as the value for this parameter in the request. If you don't use the SDK and instead generate a raw HTTP request to the Secrets Manager service endpoint, then you must generate a ClientRequestToken yourself for the new version and include the value in the request.  This value helps ensure idempotency. Secrets Manager uses this value to prevent the accidental creation of duplicate versions if there are failures and retries during a rotation. We recommend that you generate a UUID-type value to ensure uniqueness of your versions within the specified secret.    If the ClientRequestToken value isn't already associated with a version of the secret then a new version of the secret is created.    If a version with this value already exists and the version SecretString and SecretBinary values are the same as those in the request, then the request is ignored.   If a version with this value already exists and that version's SecretString and SecretBinary values are different from those in the request, then the request fails because you cannot modify an existing version. Instead, use PutSecretValue to create a new version.   This value becomes the VersionId of the new version.
     */
    ClientRequestToken?: ClientRequestTokenType;
    /**
     * (Optional) Specifies a user-provided description of the secret.
     */
    Description?: DescriptionType;
    /**
     * (Optional) Specifies the ARN, Key ID, or alias of the Amazon Web Services KMS customer master key (CMK) to be used to encrypt the SecretString or SecretBinary values in the versions stored in this secret. You can specify any of the supported ways to identify a Amazon Web Services KMS key ID. If you need to reference a CMK in a different account, you can use only the key ARN or the alias ARN. If you don't specify this value, then Secrets Manager defaults to using the Amazon Web Services account's default CMK (the one named aws/secretsmanager). If a Amazon Web Services KMS CMK with that name doesn't yet exist, then Secrets Manager creates it for you automatically the first time it needs to encrypt a version's SecretString or SecretBinary fields.  You can use the account default CMK to encrypt and decrypt only if you call this operation using credentials from the same account that owns the secret. If the secret resides in a different account, then you must create a custom CMK and specify the ARN in this field.  
     */
    KmsKeyId?: KmsKeyIdType;
    /**
     * (Optional) Specifies binary data that you want to encrypt and store in the new version of the secret. To use this parameter in the command-line tools, we recommend that you store your binary data in a file and then use the appropriate technique for your tool to pass the contents of the file as a parameter. Either SecretString or SecretBinary must have a value, but not both. They cannot both be empty. This parameter is not available using the Secrets Manager console. It can be accessed only by using the Amazon Web Services CLI or one of the Amazon Web Services SDKs.
     */
    SecretBinary?: SecretBinaryType;
    /**
     * (Optional) Specifies text data that you want to encrypt and store in this new version of the secret. Either SecretString or SecretBinary must have a value, but not both. They cannot both be empty. If you create a secret by using the Secrets Manager console then Secrets Manager puts the protected secret text in only the SecretString parameter. The Secrets Manager console stores the information as a JSON structure of key/value pairs that the Lambda rotation function knows how to parse. For storing multiple values, we recommend that you use a JSON text string argument and specify key/value pairs. For more information, see Specifying parameter values for the Amazon Web Services CLI in the Amazon Web Services CLI User Guide.
     */
    SecretString?: SecretStringType;
    /**
     * (Optional) Specifies a list of user-defined tags that are attached to the secret. Each tag is a "Key" and "Value" pair of strings. This operation only appends tags to the existing list of tags. To remove tags, you must use UntagResource.    Secrets Manager tag key names are case sensitive. A tag with the key "ABC" is a different tag from one with key "abc".   If you check tags in IAM policy Condition elements as part of your security strategy, then adding or removing a tag can change permissions. If the successful completion of this operation would result in you losing your permissions for this secret, then this operation is blocked and returns an Access Denied error.    This parameter requires a JSON text string argument. For information on how to format a JSON parameter for the various command line tool environments, see Using JSON for Parameters in the CLI User Guide. For example:  [{"Key":"CostCenter","Value":"12345"},{"Key":"environment","Value":"production"}]  If your command-line tool or SDK requires quotation marks around the parameter, you should use single quotes to avoid confusion with the double quotes required in the JSON text.  The following basic restrictions apply to tags:   Maximum number of tags per secret—50   Maximum key length—127 Unicode characters in UTF-8   Maximum value length—255 Unicode characters in UTF-8   Tag keys and values are case sensitive.   Do not use the aws: prefix in your tag names or values because Amazon Web Services reserves it for Amazon Web Services use. You can't edit or delete tag names or values with this prefix. Tags with this prefix do not count against your tags per secret limit.   If you use your tagging schema across multiple services and resources, remember other services might have restrictions on allowed characters. Generally allowed characters: letters, spaces, and numbers representable in UTF-8, plus the following special characters: + - = . _ : / @.  
     */
    Tags?: TagListType;
    /**
     * (Optional) Add a list of regions to replicate secrets. Secrets Manager replicates the KMSKeyID objects to the list of regions specified in the parameter.
     */
    AddReplicaRegions?: AddReplicaRegionListType;
    /**
     * (Optional) If set, the replication overwrites a secret with the same name in the destination region.
     */
    ForceOverwriteReplicaSecret?: BooleanType;
  }
  export interface CreateSecretResponse {
    /**
     * The Amazon Resource Name (ARN) of the secret that you just created.  Secrets Manager automatically adds several random characters to the name at the end of the ARN when you initially create a secret. This affects only the ARN and not the actual friendly name. This ensures that if you create a new secret with the same name as an old secret that you previously deleted, then users with access to the old secret don't automatically get access to the new secret because the ARNs are different. 
     */
    ARN?: SecretARNType;
    /**
     * The friendly name of the secret that you just created.
     */
    Name?: SecretNameType;
    /**
     * The unique identifier associated with the version of the secret you just created.
     */
    VersionId?: SecretVersionIdType;
    /**
     * Describes a list of replication status objects as InProgress, Failed or InSync.
     */
    ReplicationStatus?: ReplicationStatusListType;
  }
  export type CreatedDateType = Date;
  export interface DeleteResourcePolicyRequest {
    /**
     * Specifies the secret that you want to delete the attached resource-based policy for. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId: SecretIdType;
  }
  export interface DeleteResourcePolicyResponse {
    /**
     * The ARN of the secret that the resource-based policy was deleted for.
     */
    ARN?: SecretARNType;
    /**
     * The friendly name of the secret that the resource-based policy was deleted for.
     */
    Name?: NameType;
  }
  export interface DeleteSecretRequest {
    /**
     * Specifies the secret to delete. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * (Optional) Specifies the number of days that Secrets Manager waits before Secrets Manager can delete the secret. You can't use both this parameter and the ForceDeleteWithoutRecovery parameter in the same API call. This value can range from 7 to 30 days with a default value of 30.
     */
    RecoveryWindowInDays?: RecoveryWindowInDaysType;
    /**
     * (Optional) Specifies that the secret is to be deleted without any recovery window. You can't use both this parameter and the RecoveryWindowInDays parameter in the same API call. An asynchronous background process performs the actual deletion, so there can be a short delay before the operation completes. If you write code to delete and then immediately recreate a secret with the same name, ensure that your code includes appropriate back off and retry logic.  Use this parameter with caution. This parameter causes the operation to skip the normal waiting period before the permanent deletion that Amazon Web Services would normally impose with the RecoveryWindowInDays parameter. If you delete a secret with the ForceDeleteWithouRecovery parameter, then you have no opportunity to recover the secret. You lose the secret permanently.   If you use this parameter and include a previously deleted or nonexistent secret, the operation does not return the error ResourceNotFoundException in order to correctly handle retries. 
     */
    ForceDeleteWithoutRecovery?: BooleanType;
  }
  export interface DeleteSecretResponse {
    /**
     * The ARN of the secret that is now scheduled for deletion.
     */
    ARN?: SecretARNType;
    /**
     * The friendly name of the secret currently scheduled for deletion.
     */
    Name?: SecretNameType;
    /**
     * The date and time after which this secret can be deleted by Secrets Manager and can no longer be restored. This value is the date and time of the delete request plus the number of days specified in RecoveryWindowInDays.
     */
    DeletionDate?: DeletionDateType;
  }
  export type DeletedDateType = Date;
  export type DeletionDateType = Date;
  export interface DescribeSecretRequest {
    /**
     * The identifier of the secret whose details you want to retrieve. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId: SecretIdType;
  }
  export interface DescribeSecretResponse {
    /**
     * The ARN of the secret.
     */
    ARN?: SecretARNType;
    /**
     * The user-provided friendly name of the secret.
     */
    Name?: SecretNameType;
    /**
     * The user-provided description of the secret.
     */
    Description?: DescriptionType;
    /**
     * The ARN or alias of the Amazon Web Services KMS customer master key (CMK) that's used to encrypt the SecretString or SecretBinary fields in each version of the secret. If you don't provide a key, then Secrets Manager defaults to encrypting the secret fields with the default Amazon Web Services KMS CMK (the one named awssecretsmanager) for this account.
     */
    KmsKeyId?: KmsKeyIdType;
    /**
     * Specifies whether automatic rotation is enabled for this secret. To enable rotation, use RotateSecret with AutomaticallyRotateAfterDays set to a value greater than 0. To disable rotation, use CancelRotateSecret.
     */
    RotationEnabled?: RotationEnabledType;
    /**
     * The ARN of a Lambda function that's invoked by Secrets Manager to rotate the secret either automatically per the schedule or manually by a call to RotateSecret.
     */
    RotationLambdaARN?: RotationLambdaARNType;
    /**
     * A structure with the rotation configuration for this secret. This field is only populated if rotation is configured.
     */
    RotationRules?: RotationRulesType;
    /**
     * The last date and time that the rotation process for this secret was invoked. The most recent date and time that the Secrets Manager rotation process successfully completed. If the secret doesn't rotate, Secrets Manager returns a null value.
     */
    LastRotatedDate?: LastRotatedDateType;
    /**
     * The last date and time that this secret was modified in any way.
     */
    LastChangedDate?: LastChangedDateType;
    /**
     * The last date that this secret was accessed. This value is truncated to midnight of the date and therefore shows only the date, not the time.
     */
    LastAccessedDate?: LastAccessedDateType;
    /**
     * This value exists if the secret is scheduled for deletion. Some time after the specified date and time, Secrets Manager deletes the secret and all of its versions. If a secret is scheduled for deletion, then its details, including the encrypted secret information, is not accessible. To cancel a scheduled deletion and restore access, use RestoreSecret.
     */
    DeletedDate?: DeletedDateType;
    /**
     * The list of user-defined tags that are associated with the secret. To add tags to a secret, use TagResource. To remove tags, use UntagResource.
     */
    Tags?: TagListType;
    /**
     * A list of all of the currently assigned VersionStage staging labels and the VersionId that each is attached to. Staging labels are used to keep track of the different versions during the rotation process.  A version that does not have any staging labels attached is considered deprecated and subject to deletion. Such versions are not included in this list. 
     */
    VersionIdsToStages?: SecretVersionsToStagesMapType;
    /**
     * Returns the name of the service that created this secret.
     */
    OwningService?: OwningServiceType;
    /**
     * The date you created the secret.
     */
    CreatedDate?: TimestampType;
    /**
     * Specifies the primary region for secret replication. 
     */
    PrimaryRegion?: RegionType;
    /**
     * Describes a list of replication status objects as InProgress, Failed or InSync.P 
     */
    ReplicationStatus?: ReplicationStatusListType;
  }
  export type DescriptionType = string;
  export type ErrorMessage = string;
  export type ExcludeCharactersType = string;
  export type ExcludeLowercaseType = boolean;
  export type ExcludeNumbersType = boolean;
  export type ExcludePunctuationType = boolean;
  export type ExcludeUppercaseType = boolean;
  export interface Filter {
    /**
     * Filters your list of secrets by a specific key.
     */
    Key?: FilterNameStringType;
    /**
     * Filters your list of secrets by a specific value. You can prefix your search value with an exclamation mark (!) in order to perform negation filters. 
     */
    Values?: FilterValuesStringList;
  }
  export type FilterNameStringType = "description"|"name"|"tag-key"|"tag-value"|"primary-region"|"all"|string;
  export type FilterValueStringType = string;
  export type FilterValuesStringList = FilterValueStringType[];
  export type FiltersListType = Filter[];
  export interface GetRandomPasswordRequest {
    /**
     * The desired length of the generated password. The default value if you do not include this parameter is 32 characters.
     */
    PasswordLength?: PasswordLengthType;
    /**
     * A string that includes characters that should not be included in the generated password. The default is that all characters from the included sets can be used.
     */
    ExcludeCharacters?: ExcludeCharactersType;
    /**
     * Specifies that the generated password should not include digits. The default if you do not include this switch parameter is that digits can be included.
     */
    ExcludeNumbers?: ExcludeNumbersType;
    /**
     * Specifies that the generated password should not include punctuation characters. The default if you do not include this switch parameter is that punctuation characters can be included. The following are the punctuation characters that can be included in the generated password if you don't explicitly exclude them with ExcludeCharacters or ExcludePunctuation:  ! " # $ % &amp; ' ( ) * + , - . / : ; &lt; = &gt; ? @ [ \ ] ^ _ ` { | } ~ 
     */
    ExcludePunctuation?: ExcludePunctuationType;
    /**
     * Specifies that the generated password should not include uppercase letters. The default if you do not include this switch parameter is that uppercase letters can be included.
     */
    ExcludeUppercase?: ExcludeUppercaseType;
    /**
     * Specifies that the generated password should not include lowercase letters. The default if you do not include this switch parameter is that lowercase letters can be included.
     */
    ExcludeLowercase?: ExcludeLowercaseType;
    /**
     * Specifies that the generated password can include the space character. The default if you do not include this switch parameter is that the space character is not included.
     */
    IncludeSpace?: IncludeSpaceType;
    /**
     * A boolean value that specifies whether the generated password must include at least one of every allowed character type. The default value is True and the operation requires at least one of every character type.
     */
    RequireEachIncludedType?: RequireEachIncludedTypeType;
  }
  export interface GetRandomPasswordResponse {
    /**
     * A string with the generated password.
     */
    RandomPassword?: RandomPasswordType;
  }
  export interface GetResourcePolicyRequest {
    /**
     * Specifies the secret that you want to retrieve the attached resource-based policy for. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId: SecretIdType;
  }
  export interface GetResourcePolicyResponse {
    /**
     * The ARN of the secret that the resource-based policy was retrieved for.
     */
    ARN?: SecretARNType;
    /**
     * The friendly name of the secret that the resource-based policy was retrieved for.
     */
    Name?: NameType;
    /**
     * A JSON-formatted string that describes the permissions that are associated with the attached secret. These permissions are combined with any permissions that are associated with the user or role that attempts to access this secret. The combined permissions specify who can access the secret and what actions they can perform. For more information, see Authentication and Access Control for Amazon Web Services Secrets Manager in the Amazon Web Services Secrets Manager User Guide.
     */
    ResourcePolicy?: NonEmptyResourcePolicyType;
  }
  export interface GetSecretValueRequest {
    /**
     * Specifies the secret containing the version that you want to retrieve. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * Specifies the unique identifier of the version of the secret that you want to retrieve. If you specify both this parameter and VersionStage, the two parameters must refer to the same secret version. If you don't specify either a VersionStage or VersionId then the default is to perform the operation on the version with the VersionStage value of AWSCURRENT. This value is typically a UUID-type value with 32 hexadecimal digits.
     */
    VersionId?: SecretVersionIdType;
    /**
     * Specifies the secret version that you want to retrieve by the staging label attached to the version. Staging labels are used to keep track of different versions during the rotation process. If you specify both this parameter and VersionId, the two parameters must refer to the same secret version . If you don't specify either a VersionStage or VersionId, then the default is to perform the operation on the version with the VersionStage value of AWSCURRENT.
     */
    VersionStage?: SecretVersionStageType;
  }
  export interface GetSecretValueResponse {
    /**
     * The ARN of the secret.
     */
    ARN?: SecretARNType;
    /**
     * The friendly name of the secret.
     */
    Name?: SecretNameType;
    /**
     * The unique identifier of this version of the secret.
     */
    VersionId?: SecretVersionIdType;
    /**
     * The decrypted part of the protected secret information that was originally provided as binary data in the form of a byte array. The response parameter represents the binary data as a base64-encoded string. This parameter is not used if the secret is created by the Secrets Manager console. If you store custom information in this field of the secret, then you must code your Lambda rotation function to parse and interpret whatever you store in the SecretString or SecretBinary fields.
     */
    SecretBinary?: SecretBinaryType;
    /**
     * The decrypted part of the protected secret information that was originally provided as a string. If you create this secret by using the Secrets Manager console then only the SecretString parameter contains data. Secrets Manager stores the information as a JSON structure of key/value pairs that the Lambda rotation function knows how to parse. If you store custom information in the secret by using the CreateSecret, UpdateSecret, or PutSecretValue API operations instead of the Secrets Manager console, or by using the Other secret type in the console, then you must code your Lambda rotation function to parse and interpret those values.
     */
    SecretString?: SecretStringType;
    /**
     * A list of all of the staging labels currently attached to this version of the secret.
     */
    VersionStages?: SecretVersionStagesType;
    /**
     * The date and time that this version of the secret was created.
     */
    CreatedDate?: CreatedDateType;
  }
  export type IncludeSpaceType = boolean;
  export type KmsKeyIdListType = KmsKeyIdType[];
  export type KmsKeyIdType = string;
  export type LastAccessedDateType = Date;
  export type LastChangedDateType = Date;
  export type LastRotatedDateType = Date;
  export interface ListSecretVersionIdsRequest {
    /**
     * The identifier for the secret containing the versions you want to list. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * (Optional) Limits the number of results you want to include in the response. If you don't include this parameter, it defaults to a value that's specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (isn't null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Secrets Manager might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResultsType;
    /**
     * (Optional) Use this parameter in a request if you receive a NextToken response in a previous request indicating there's more output available. In a subsequent call, set it to the value of the previous call NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextTokenType;
    /**
     * (Optional) Specifies that you want the results to include versions that do not have any staging labels attached to them. Such versions are considered deprecated and are subject to deletion by Secrets Manager as needed.
     */
    IncludeDeprecated?: BooleanType;
  }
  export interface ListSecretVersionIdsResponse {
    /**
     * The list of the currently available versions of the specified secret.
     */
    Versions?: SecretVersionsListType;
    /**
     * If present in the response, this value indicates that there's more output available than included in the current response. This can occur even when the response includes no values at all, such as when you ask for a filtered view of a very long list. Use this value in the NextToken request parameter in a subsequent call to the operation to continue processing and get the next part of the output. You should repeat this until the NextToken response element comes back empty (as null).
     */
    NextToken?: NextTokenType;
    /**
     * The Amazon Resource Name (ARN) for the secret.  Secrets Manager automatically adds several random characters to the name at the end of the ARN when you initially create a secret. This affects only the ARN and not the actual friendly name. This ensures that if you create a new secret with the same name as an old secret that you previously deleted, then users with access to the old secret don't automatically get access to the new secret because the ARNs are different. 
     */
    ARN?: SecretARNType;
    /**
     * The friendly name of the secret.
     */
    Name?: SecretNameType;
  }
  export interface ListSecretsRequest {
    /**
     * (Optional) Limits the number of results you want to include in the response. If you don't include this parameter, it defaults to a value that's specific to the operation. If additional items exist beyond the maximum you specify, the NextToken response element is present and has a value (isn't null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results. Note that Secrets Manager might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results.
     */
    MaxResults?: MaxResultsType;
    /**
     * (Optional) Use this parameter in a request if you receive a NextToken response in a previous request indicating there's more output available. In a subsequent call, set it to the value of the previous call NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextTokenType;
    /**
     * Lists the secret request filters.
     */
    Filters?: FiltersListType;
    /**
     * Lists secrets in the requested order. 
     */
    SortOrder?: SortOrderType;
  }
  export interface ListSecretsResponse {
    /**
     * A list of the secrets in the account.
     */
    SecretList?: SecretListType;
    /**
     * If present in the response, this value indicates that there's more output available than included in the current response. This can occur even when the response includes no values at all, such as when you ask for a filtered view of a very long list. Use this value in the NextToken request parameter in a subsequent call to the operation to continue processing and get the next part of the output. You should repeat this until the NextToken response element comes back empty (as null).
     */
    NextToken?: NextTokenType;
  }
  export type MaxResultsType = number;
  export type NameType = string;
  export type NextTokenType = string;
  export type NonEmptyResourcePolicyType = string;
  export type OwningServiceType = string;
  export type PasswordLengthType = number;
  export interface PutResourcePolicyRequest {
    /**
     * Specifies the secret that you want to attach the resource-based policy. You can specify either the ARN or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * A JSON-formatted string constructed according to the grammar and syntax for an Amazon Web Services resource-based policy. The policy in the string identifies who can access or manage this secret and its versions. For information on how to format a JSON parameter for the various command line tool environments, see Using JSON for Parameters in the CLI User Guide.
     */
    ResourcePolicy: NonEmptyResourcePolicyType;
    /**
     * (Optional) If you set the parameter, BlockPublicPolicy to true, then you block resource-based policies that allow broad access to the secret.
     */
    BlockPublicPolicy?: BooleanType;
  }
  export interface PutResourcePolicyResponse {
    /**
     * The ARN of the secret retrieved by the resource-based policy.
     */
    ARN?: SecretARNType;
    /**
     * The friendly name of the secret retrieved by the resource-based policy.
     */
    Name?: NameType;
  }
  export interface PutSecretValueRequest {
    /**
     * Specifies the secret to which you want to add a new version. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. The secret must already exist. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * (Optional) Specifies a unique identifier for the new version of the secret.   If you use the Amazon Web Services CLI or one of the Amazon Web Services SDK to call this operation, then you can leave this parameter empty. The CLI or SDK generates a random UUID for you and includes that in the request. If you don't use the SDK and instead generate a raw HTTP request to the Secrets Manager service endpoint, then you must generate a ClientRequestToken yourself for new versions and include that value in the request.   This value helps ensure idempotency. Secrets Manager uses this value to prevent the accidental creation of duplicate versions if there are failures and retries during the Lambda rotation function's processing. We recommend that you generate a UUID-type value to ensure uniqueness within the specified secret.    If the ClientRequestToken value isn't already associated with a version of the secret then a new version of the secret is created.    If a version with this value already exists and that version's SecretString or SecretBinary values are the same as those in the request then the request is ignored (the operation is idempotent).    If a version with this value already exists and the version of the SecretString and SecretBinary values are different from those in the request then the request fails because you cannot modify an existing secret version. You can only create new versions to store new secret values.   This value becomes the VersionId of the new version.
     */
    ClientRequestToken?: ClientRequestTokenType;
    /**
     * (Optional) Specifies binary data that you want to encrypt and store in the new version of the secret. To use this parameter in the command-line tools, we recommend that you store your binary data in a file and then use the appropriate technique for your tool to pass the contents of the file as a parameter. Either SecretBinary or SecretString must have a value, but not both. They cannot both be empty. This parameter is not accessible if the secret using the Secrets Manager console. 
     */
    SecretBinary?: SecretBinaryType;
    /**
     * (Optional) Specifies text data that you want to encrypt and store in this new version of the secret. Either SecretString or SecretBinary must have a value, but not both. They cannot both be empty. If you create this secret by using the Secrets Manager console then Secrets Manager puts the protected secret text in only the SecretString parameter. The Secrets Manager console stores the information as a JSON structure of key/value pairs that the default Lambda rotation function knows how to parse. For storing multiple values, we recommend that you use a JSON text string argument and specify key/value pairs. For more information, see Specifying parameter values for the Amazon Web Services CLI in the Amazon Web Services CLI User Guide.
     */
    SecretString?: SecretStringType;
    /**
     * (Optional) Specifies a list of staging labels that are attached to this version of the secret. These staging labels are used to track the versions through the rotation process by the Lambda rotation function. A staging label must be unique to a single version of the secret. If you specify a staging label that's already associated with a different version of the same secret then that staging label is automatically removed from the other version and attached to this version. If you do not specify a value for VersionStages then Secrets Manager automatically moves the staging label AWSCURRENT to this new version.
     */
    VersionStages?: SecretVersionStagesType;
  }
  export interface PutSecretValueResponse {
    /**
     * The Amazon Resource Name (ARN) for the secret for which you just created a version.
     */
    ARN?: SecretARNType;
    /**
     * The friendly name of the secret for which you just created or updated a version.
     */
    Name?: SecretNameType;
    /**
     * The unique identifier of the version of the secret you just created or updated.
     */
    VersionId?: SecretVersionIdType;
    /**
     * The list of staging labels that are currently attached to this version of the secret. Staging labels are used to track a version as it progresses through the secret rotation process.
     */
    VersionStages?: SecretVersionStagesType;
  }
  export type RandomPasswordType = string;
  export type RecoveryWindowInDaysType = number;
  export type RegionType = string;
  export interface RemoveRegionsFromReplicationRequest {
    /**
     * Remove a secret by SecretId from replica Regions.
     */
    SecretId: SecretIdType;
    /**
     * Remove replication from specific Regions.
     */
    RemoveReplicaRegions: RemoveReplicaRegionListType;
  }
  export interface RemoveRegionsFromReplicationResponse {
    /**
     * The secret ARN removed from replication regions.
     */
    ARN?: SecretARNType;
    /**
     * Describes the remaining replication status after you remove regions from the replication list.
     */
    ReplicationStatus?: ReplicationStatusListType;
  }
  export type RemoveReplicaRegionListType = RegionType[];
  export interface ReplicaRegionType {
    /**
     * Describes a single instance of Region objects.
     */
    Region?: RegionType;
    /**
     * Can be an ARN, Key ID, or Alias. 
     */
    KmsKeyId?: KmsKeyIdType;
  }
  export interface ReplicateSecretToRegionsRequest {
    /**
     * Use the Secret Id to replicate a secret to regions.
     */
    SecretId: SecretIdType;
    /**
     * Add Regions to replicate the secret.
     */
    AddReplicaRegions: AddReplicaRegionListType;
    /**
     * (Optional) If set, Secrets Manager replication overwrites a secret with the same name in the destination region.
     */
    ForceOverwriteReplicaSecret?: BooleanType;
  }
  export interface ReplicateSecretToRegionsResponse {
    /**
     * Replicate a secret based on the ReplicaRegionType&gt; consisting of a Region(required) and a KMSKeyId (optional) which can be the ARN, KeyID, or Alias. 
     */
    ARN?: SecretARNType;
    /**
     * Describes the secret replication status as PENDING, SUCCESS or FAIL.
     */
    ReplicationStatus?: ReplicationStatusListType;
  }
  export type ReplicationStatusListType = ReplicationStatusType[];
  export interface ReplicationStatusType {
    /**
     * The Region where replication occurs.
     */
    Region?: RegionType;
    /**
     * Can be an ARN, Key ID, or Alias. 
     */
    KmsKeyId?: KmsKeyIdType;
    /**
     * The status can be InProgress, Failed, or InSync.
     */
    Status?: StatusType;
    /**
     * Status message such as "Secret with this name already exists in this region".
     */
    StatusMessage?: StatusMessageType;
    /**
     * The date that you last accessed the secret in the Region. 
     */
    LastAccessedDate?: LastAccessedDateType;
  }
  export type RequireEachIncludedTypeType = boolean;
  export interface RestoreSecretRequest {
    /**
     * Specifies the secret that you want to restore from a previously scheduled deletion. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId: SecretIdType;
  }
  export interface RestoreSecretResponse {
    /**
     * The ARN of the secret that was restored.
     */
    ARN?: SecretARNType;
    /**
     * The friendly name of the secret that was restored.
     */
    Name?: SecretNameType;
  }
  export interface RotateSecretRequest {
    /**
     * Specifies the secret that you want to rotate. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * (Optional) Specifies a unique identifier for the new version of the secret that helps ensure idempotency.  If you use the Amazon Web Services CLI or one of the Amazon Web Services SDK to call this operation, then you can leave this parameter empty. The CLI or SDK generates a random UUID for you and includes that in the request for this parameter. If you don't use the SDK and instead generate a raw HTTP request to the Secrets Manager service endpoint, then you must generate a ClientRequestToken yourself for new versions and include that value in the request. You only need to specify your own value if you implement your own retry logic and want to ensure that a given secret is not created twice. We recommend that you generate a UUID-type value to ensure uniqueness within the specified secret.  Secrets Manager uses this value to prevent the accidental creation of duplicate versions if there are failures and retries during the function's processing. This value becomes the VersionId of the new version.
     */
    ClientRequestToken?: ClientRequestTokenType;
    /**
     * (Optional) Specifies the ARN of the Lambda function that can rotate the secret.
     */
    RotationLambdaARN?: RotationLambdaARNType;
    /**
     * A structure that defines the rotation configuration for this secret.
     */
    RotationRules?: RotationRulesType;
  }
  export interface RotateSecretResponse {
    /**
     * The ARN of the secret.
     */
    ARN?: SecretARNType;
    /**
     * The friendly name of the secret.
     */
    Name?: SecretNameType;
    /**
     * The ID of the new version of the secret created by the rotation started by this request.
     */
    VersionId?: SecretVersionIdType;
  }
  export type RotationEnabledType = boolean;
  export type RotationLambdaARNType = string;
  export interface RotationRulesType {
    /**
     * Specifies the number of days between automatic scheduled rotations of the secret. Secrets Manager schedules the next rotation when the previous one is complete. Secrets Manager schedules the date by adding the rotation interval (number of days) to the actual date of the last rotation. The service chooses the hour within that 24-hour date window randomly. The minute is also chosen somewhat randomly, but weighted towards the top of the hour and influenced by a variety of factors that help distribute load.
     */
    AutomaticallyAfterDays?: AutomaticallyRotateAfterDaysType;
  }
  export type SecretARNType = string;
  export type SecretBinaryType = Buffer|Uint8Array|Blob|string;
  export type SecretIdType = string;
  export interface SecretListEntry {
    /**
     * The Amazon Resource Name (ARN) of the secret. For more information about ARNs in Secrets Manager, see Policy Resources in the Amazon Web Services Secrets Manager User Guide.
     */
    ARN?: SecretARNType;
    /**
     * The friendly name of the secret. You can use forward slashes in the name to represent a path hierarchy. For example, /prod/databases/dbserver1 could represent the secret for a server named dbserver1 in the folder databases in the folder prod. 
     */
    Name?: SecretNameType;
    /**
     * The user-provided description of the secret.
     */
    Description?: DescriptionType;
    /**
     * The ARN or alias of the Amazon Web Services KMS customer master key (CMK) used to encrypt the SecretString and SecretBinary fields in each version of the secret. If you don't provide a key, then Secrets Manager defaults to encrypting the secret fields with the default KMS CMK, the key named awssecretsmanager, for this account.
     */
    KmsKeyId?: KmsKeyIdType;
    /**
     * Indicates whether automatic, scheduled rotation is enabled for this secret.
     */
    RotationEnabled?: RotationEnabledType;
    /**
     * The ARN of an Amazon Web Services Lambda function invoked by Secrets Manager to rotate and expire the secret either automatically per the schedule or manually by a call to RotateSecret.
     */
    RotationLambdaARN?: RotationLambdaARNType;
    /**
     * A structure that defines the rotation configuration for the secret.
     */
    RotationRules?: RotationRulesType;
    /**
     * The most recent date and time that the Secrets Manager rotation process was successfully completed. This value is null if the secret hasn't ever rotated.
     */
    LastRotatedDate?: LastRotatedDateType;
    /**
     * The last date and time that this secret was modified in any way.
     */
    LastChangedDate?: LastChangedDateType;
    /**
     * The last date that this secret was accessed. This value is truncated to midnight of the date and therefore shows only the date, not the time.
     */
    LastAccessedDate?: LastAccessedDateType;
    /**
     * The date and time the deletion of the secret occurred. Not present on active secrets. The secret can be recovered until the number of days in the recovery window has passed, as specified in the RecoveryWindowInDays parameter of the DeleteSecret operation.
     */
    DeletedDate?: DeletedDateType;
    /**
     * The list of user-defined tags associated with the secret. To add tags to a secret, use TagResource. To remove tags, use UntagResource.
     */
    Tags?: TagListType;
    /**
     * A list of all of the currently assigned SecretVersionStage staging labels and the SecretVersionId attached to each one. Staging labels are used to keep track of the different versions during the rotation process.  A version that does not have any SecretVersionStage is considered deprecated and subject to deletion. Such versions are not included in this list. 
     */
    SecretVersionsToStages?: SecretVersionsToStagesMapType;
    /**
     * Returns the name of the service that created the secret.
     */
    OwningService?: OwningServiceType;
    /**
     * The date and time when a secret was created.
     */
    CreatedDate?: TimestampType;
    /**
     * The Region where Secrets Manager originated the secret.
     */
    PrimaryRegion?: RegionType;
  }
  export type SecretListType = SecretListEntry[];
  export type SecretNameType = string;
  export type SecretStringType = string;
  export type SecretVersionIdType = string;
  export type SecretVersionStageType = string;
  export type SecretVersionStagesType = SecretVersionStageType[];
  export interface SecretVersionsListEntry {
    /**
     * The unique version identifier of this version of the secret.
     */
    VersionId?: SecretVersionIdType;
    /**
     * An array of staging labels that are currently associated with this version of the secret.
     */
    VersionStages?: SecretVersionStagesType;
    /**
     * The date that this version of the secret was last accessed. Note that the resolution of this field is at the date level and does not include the time.
     */
    LastAccessedDate?: LastAccessedDateType;
    /**
     * The date and time this version of the secret was created.
     */
    CreatedDate?: CreatedDateType;
    /**
     * The KMS keys used to encrypt the secret version.
     */
    KmsKeyIds?: KmsKeyIdListType;
  }
  export type SecretVersionsListType = SecretVersionsListEntry[];
  export type SecretVersionsToStagesMapType = {[key: string]: SecretVersionStagesType};
  export type SortOrderType = "asc"|"desc"|string;
  export type StatusMessageType = string;
  export type StatusType = "InSync"|"Failed"|"InProgress"|string;
  export interface StopReplicationToReplicaRequest {
    /**
     * Response to StopReplicationToReplica of a secret, based on the SecretId.
     */
    SecretId: SecretIdType;
  }
  export interface StopReplicationToReplicaResponse {
    /**
     * Response StopReplicationToReplica of a secret, based on the ARN,.
     */
    ARN?: SecretARNType;
  }
  export interface Tag {
    /**
     * The key identifier, or name, of the tag.
     */
    Key?: TagKeyType;
    /**
     * The string value associated with the key of the tag.
     */
    Value?: TagValueType;
  }
  export type TagKeyListType = TagKeyType[];
  export type TagKeyType = string;
  export type TagListType = Tag[];
  export interface TagResourceRequest {
    /**
     * The identifier for the secret that you want to attach tags to. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * The tags to attach to the secret. Each element in the list consists of a Key and a Value. This parameter to the API requires a JSON text string argument. For storing multiple values, we recommend that you use a JSON text string argument and specify key/value pairs. For more information, see Specifying parameter values for the Amazon Web Services CLI in the Amazon Web Services CLI User Guide.
     */
    Tags: TagListType;
  }
  export type TagValueType = string;
  export type TimestampType = Date;
  export interface UntagResourceRequest {
    /**
     * The identifier for the secret that you want to remove tags from. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * A list of tag key names to remove from the secret. You don't specify the value. Both the key and its associated value are removed. This parameter to the API requires a JSON text string argument. For storing multiple values, we recommend that you use a JSON text string argument and specify key/value pairs. For more information, see Specifying parameter values for the Amazon Web Services CLI in the Amazon Web Services CLI User Guide.
     */
    TagKeys: TagKeyListType;
  }
  export interface UpdateSecretRequest {
    /**
     * Specifies the secret that you want to modify or to which you want to add a new version. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * (Optional) If you want to add a new version to the secret, this parameter specifies a unique identifier for the new version that helps ensure idempotency.  If you use the Amazon Web Services CLI or one of the Amazon Web Services SDK to call this operation, then you can leave this parameter empty. The CLI or SDK generates a random UUID for you and includes that in the request. If you don't use the SDK and instead generate a raw HTTP request to the Secrets Manager service endpoint, then you must generate a ClientRequestToken yourself for new versions and include that value in the request. You typically only need to interact with this value if you implement your own retry logic and want to ensure that a given secret is not created twice. We recommend that you generate a UUID-type value to ensure uniqueness within the specified secret.  Secrets Manager uses this value to prevent the accidental creation of duplicate versions if there are failures and retries during the Lambda rotation function's processing.   If the ClientRequestToken value isn't already associated with a version of the secret then a new version of the secret is created.    If a version with this value already exists and that version's SecretString and SecretBinary values are the same as those in the request then the request is ignored (the operation is idempotent).    If a version with this value already exists and that version's SecretString and SecretBinary values are different from the request then an error occurs because you cannot modify an existing secret value.   This value becomes the VersionId of the new version.
     */
    ClientRequestToken?: ClientRequestTokenType;
    /**
     * (Optional) Specifies an updated user-provided description of the secret.
     */
    Description?: DescriptionType;
    /**
     * (Optional) Specifies an updated ARN or alias of the Amazon Web Services KMS customer master key (CMK) that Secrets Manager uses to encrypt the protected text in new versions of this secret as well as any existing versions of this secret that have the staging labels AWSCURRENT, AWSPENDING, or AWSPREVIOUS. For more information about staging labels, see Staging Labels in the Amazon Web Services Secrets Manager User Guide.  You can only use the account's default CMK to encrypt and decrypt if you call this operation using credentials from the same account that owns the secret. If the secret is in a different account, then you must create a custom CMK and provide the ARN of that CMK in this field. The user making the call must have permissions to both the secret and the CMK in their respective accounts. 
     */
    KmsKeyId?: KmsKeyIdType;
    /**
     * (Optional) Specifies updated binary data that you want to encrypt and store in the new version of the secret. To use this parameter in the command-line tools, we recommend that you store your binary data in a file and then use the appropriate technique for your tool to pass the contents of the file as a parameter. Either SecretBinary or SecretString must have a value, but not both. They cannot both be empty. This parameter is not accessible using the Secrets Manager console.
     */
    SecretBinary?: SecretBinaryType;
    /**
     * (Optional) Specifies updated text data that you want to encrypt and store in this new version of the secret. Either SecretBinary or SecretString must have a value, but not both. They cannot both be empty. If you create this secret by using the Secrets Manager console then Secrets Manager puts the protected secret text in only the SecretString parameter. The Secrets Manager console stores the information as a JSON structure of key/value pairs that the default Lambda rotation function knows how to parse. For storing multiple values, we recommend that you use a JSON text string argument and specify key/value pairs. For more information, see Specifying parameter values for the Amazon Web Services CLI in the Amazon Web Services CLI User Guide.
     */
    SecretString?: SecretStringType;
  }
  export interface UpdateSecretResponse {
    /**
     * The ARN of the secret that was updated.  Secrets Manager automatically adds several random characters to the name at the end of the ARN when you initially create a secret. This affects only the ARN and not the actual friendly name. This ensures that if you create a new secret with the same name as an old secret that you previously deleted, then users with access to the old secret don't automatically get access to the new secret because the ARNs are different. 
     */
    ARN?: SecretARNType;
    /**
     * The friendly name of the secret that was updated.
     */
    Name?: SecretNameType;
    /**
     * If a new version of the secret was created by this operation, then VersionId contains the unique identifier of the new version.
     */
    VersionId?: SecretVersionIdType;
  }
  export interface UpdateSecretVersionStageRequest {
    /**
     * Specifies the secret with the version with the list of staging labels you want to modify. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * The staging label to add to this version.
     */
    VersionStage: SecretVersionStageType;
    /**
     * Specifies the secret version ID of the version that the staging label is to be removed from. If the staging label you are trying to attach to one version is already attached to a different version, then you must include this parameter and specify the version that the label is to be removed from. If the label is attached and you either do not specify this parameter, or the version ID does not match, then the operation fails.
     */
    RemoveFromVersionId?: SecretVersionIdType;
    /**
     * (Optional) The secret version ID that you want to add the staging label. If you want to remove a label from a version, then do not specify this parameter. If the staging label is already attached to a different version of the secret, then you must also specify the RemoveFromVersionId parameter. 
     */
    MoveToVersionId?: SecretVersionIdType;
  }
  export interface UpdateSecretVersionStageResponse {
    /**
     * The ARN of the secret with the modified staging label.
     */
    ARN?: SecretARNType;
    /**
     * The friendly name of the secret with the modified staging label.
     */
    Name?: SecretNameType;
  }
  export interface ValidateResourcePolicyRequest {
    /**
     *  (Optional) The identifier of the secret with the resource-based policy you want to validate. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
     */
    SecretId?: SecretIdType;
    /**
     * A JSON-formatted string constructed according to the grammar and syntax for an Amazon Web Services resource-based policy. The policy in the string identifies who can access or manage this secret and its versions. For information on how to format a JSON parameter for the various command line tool environments, see Using JSON for Parameters in the CLI User Guide.publi
     */
    ResourcePolicy: NonEmptyResourcePolicyType;
  }
  export interface ValidateResourcePolicyResponse {
    /**
     * Returns a message stating that your Reource Policy passed validation. 
     */
    PolicyValidationPassed?: BooleanType;
    /**
     * Returns an error message if your policy doesn't pass validatation.
     */
    ValidationErrors?: ValidationErrorsType;
  }
  export interface ValidationErrorsEntry {
    /**
     * Checks the name of the policy.
     */
    CheckName?: NameType;
    /**
     * Displays error messages if validation encounters problems during validation of the resource policy.
     */
    ErrorMessage?: ErrorMessage;
  }
  export type ValidationErrorsType = ValidationErrorsEntry[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-10-17"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SecretsManager client.
   */
  export import Types = SecretsManager;
}
export = SecretsManager;
