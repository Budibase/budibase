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
   * Turns off automatic rotation, and if a rotation is currently in progress, cancels the rotation. If you cancel a rotation in progress, it can leave the VersionStage labels in an unexpected state. You might need to remove the staging label AWSPENDING from the partially created version. You also need to determine whether to roll back to the previous version of the secret by moving the staging label AWSCURRENT to the version that has AWSPENDING. To determine which version has a specific staging label, call ListSecretVersionIds. Then use UpdateSecretVersionStage to change staging labels. For more information, see How rotation works. To turn on automatic rotation again, call RotateSecret. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:CancelRotateSecret. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  cancelRotateSecret(params: SecretsManager.Types.CancelRotateSecretRequest, callback?: (err: AWSError, data: SecretsManager.Types.CancelRotateSecretResponse) => void): Request<SecretsManager.Types.CancelRotateSecretResponse, AWSError>;
  /**
   * Turns off automatic rotation, and if a rotation is currently in progress, cancels the rotation. If you cancel a rotation in progress, it can leave the VersionStage labels in an unexpected state. You might need to remove the staging label AWSPENDING from the partially created version. You also need to determine whether to roll back to the previous version of the secret by moving the staging label AWSCURRENT to the version that has AWSPENDING. To determine which version has a specific staging label, call ListSecretVersionIds. Then use UpdateSecretVersionStage to change staging labels. For more information, see How rotation works. To turn on automatic rotation again, call RotateSecret. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:CancelRotateSecret. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  cancelRotateSecret(callback?: (err: AWSError, data: SecretsManager.Types.CancelRotateSecretResponse) => void): Request<SecretsManager.Types.CancelRotateSecretResponse, AWSError>;
  /**
   * Creates a new secret. A secret can be a password, a set of credentials such as a user name and password, an OAuth token, or other secret information that you store in an encrypted form in Secrets Manager. The secret also includes the connection information to access a database or other service, which Secrets Manager doesn't encrypt. A secret in Secrets Manager consists of both the protected secret data and the important information needed to manage the secret. For secrets that use managed rotation, you need to create the secret through the managing service. For more information, see Secrets Manager secrets managed by other Amazon Web Services services.  For information about creating a secret in the console, see Create a secret. To create a secret, you can provide the secret value to be encrypted in either the SecretString parameter or the SecretBinary parameter, but not both. If you include SecretString or SecretBinary then Secrets Manager creates an initial secret version and automatically attaches the staging label AWSCURRENT to it. For database credentials you want to rotate, for Secrets Manager to be able to rotate the secret, you must make sure the JSON you store in the SecretString matches the JSON structure of a database secret. If you don't specify an KMS encryption key, Secrets Manager uses the Amazon Web Services managed key aws/secretsmanager. If this key doesn't already exist in your account, then Secrets Manager creates it for you automatically. All users and roles in the Amazon Web Services account automatically have access to use aws/secretsmanager. Creating aws/secretsmanager can result in a one-time significant delay in returning the result. If the secret is in a different Amazon Web Services account from the credentials calling the API, then you can't use aws/secretsmanager to encrypt the secret, and you must create and use a customer managed KMS key.  Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters except SecretBinary or SecretString because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:CreateSecret. If you include tags in the secret, you also need secretsmanager:TagResource. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager.  To encrypt the secret with a KMS key other than aws/secretsmanager, you need kms:GenerateDataKey and kms:Decrypt permission to the key. 
   */
  createSecret(params: SecretsManager.Types.CreateSecretRequest, callback?: (err: AWSError, data: SecretsManager.Types.CreateSecretResponse) => void): Request<SecretsManager.Types.CreateSecretResponse, AWSError>;
  /**
   * Creates a new secret. A secret can be a password, a set of credentials such as a user name and password, an OAuth token, or other secret information that you store in an encrypted form in Secrets Manager. The secret also includes the connection information to access a database or other service, which Secrets Manager doesn't encrypt. A secret in Secrets Manager consists of both the protected secret data and the important information needed to manage the secret. For secrets that use managed rotation, you need to create the secret through the managing service. For more information, see Secrets Manager secrets managed by other Amazon Web Services services.  For information about creating a secret in the console, see Create a secret. To create a secret, you can provide the secret value to be encrypted in either the SecretString parameter or the SecretBinary parameter, but not both. If you include SecretString or SecretBinary then Secrets Manager creates an initial secret version and automatically attaches the staging label AWSCURRENT to it. For database credentials you want to rotate, for Secrets Manager to be able to rotate the secret, you must make sure the JSON you store in the SecretString matches the JSON structure of a database secret. If you don't specify an KMS encryption key, Secrets Manager uses the Amazon Web Services managed key aws/secretsmanager. If this key doesn't already exist in your account, then Secrets Manager creates it for you automatically. All users and roles in the Amazon Web Services account automatically have access to use aws/secretsmanager. Creating aws/secretsmanager can result in a one-time significant delay in returning the result. If the secret is in a different Amazon Web Services account from the credentials calling the API, then you can't use aws/secretsmanager to encrypt the secret, and you must create and use a customer managed KMS key.  Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters except SecretBinary or SecretString because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:CreateSecret. If you include tags in the secret, you also need secretsmanager:TagResource. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager.  To encrypt the secret with a KMS key other than aws/secretsmanager, you need kms:GenerateDataKey and kms:Decrypt permission to the key. 
   */
  createSecret(callback?: (err: AWSError, data: SecretsManager.Types.CreateSecretResponse) => void): Request<SecretsManager.Types.CreateSecretResponse, AWSError>;
  /**
   * Deletes the resource-based permission policy attached to the secret. To attach a policy to a secret, use PutResourcePolicy. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:DeleteResourcePolicy. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  deleteResourcePolicy(params: SecretsManager.Types.DeleteResourcePolicyRequest, callback?: (err: AWSError, data: SecretsManager.Types.DeleteResourcePolicyResponse) => void): Request<SecretsManager.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes the resource-based permission policy attached to the secret. To attach a policy to a secret, use PutResourcePolicy. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:DeleteResourcePolicy. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  deleteResourcePolicy(callback?: (err: AWSError, data: SecretsManager.Types.DeleteResourcePolicyResponse) => void): Request<SecretsManager.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes a secret and all of its versions. You can specify a recovery window during which you can restore the secret. The minimum recovery window is 7 days. The default recovery window is 30 days. Secrets Manager attaches a DeletionDate stamp to the secret that specifies the end of the recovery window. At the end of the recovery window, Secrets Manager deletes the secret permanently. You can't delete a primary secret that is replicated to other Regions. You must first delete the replicas using RemoveRegionsFromReplication, and then delete the primary secret. When you delete a replica, it is deleted immediately. You can't directly delete a version of a secret. Instead, you remove all staging labels from the version using UpdateSecretVersionStage. This marks the version as deprecated, and then Secrets Manager can automatically delete the version in the background. To determine whether an application still uses a secret, you can create an Amazon CloudWatch alarm to alert you to any attempts to access a secret during the recovery window. For more information, see  Monitor secrets scheduled for deletion. Secrets Manager performs the permanent secret deletion at the end of the waiting period as a background task with low priority. There is no guarantee of a specific time after the recovery window for the permanent delete to occur. At any time before recovery window ends, you can use RestoreSecret to remove the DeletionDate and cancel the deletion of the secret. When a secret is scheduled for deletion, you cannot retrieve the secret value. You must first cancel the deletion with RestoreSecret and then you can retrieve the secret. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:DeleteSecret. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  deleteSecret(params: SecretsManager.Types.DeleteSecretRequest, callback?: (err: AWSError, data: SecretsManager.Types.DeleteSecretResponse) => void): Request<SecretsManager.Types.DeleteSecretResponse, AWSError>;
  /**
   * Deletes a secret and all of its versions. You can specify a recovery window during which you can restore the secret. The minimum recovery window is 7 days. The default recovery window is 30 days. Secrets Manager attaches a DeletionDate stamp to the secret that specifies the end of the recovery window. At the end of the recovery window, Secrets Manager deletes the secret permanently. You can't delete a primary secret that is replicated to other Regions. You must first delete the replicas using RemoveRegionsFromReplication, and then delete the primary secret. When you delete a replica, it is deleted immediately. You can't directly delete a version of a secret. Instead, you remove all staging labels from the version using UpdateSecretVersionStage. This marks the version as deprecated, and then Secrets Manager can automatically delete the version in the background. To determine whether an application still uses a secret, you can create an Amazon CloudWatch alarm to alert you to any attempts to access a secret during the recovery window. For more information, see  Monitor secrets scheduled for deletion. Secrets Manager performs the permanent secret deletion at the end of the waiting period as a background task with low priority. There is no guarantee of a specific time after the recovery window for the permanent delete to occur. At any time before recovery window ends, you can use RestoreSecret to remove the DeletionDate and cancel the deletion of the secret. When a secret is scheduled for deletion, you cannot retrieve the secret value. You must first cancel the deletion with RestoreSecret and then you can retrieve the secret. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:DeleteSecret. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  deleteSecret(callback?: (err: AWSError, data: SecretsManager.Types.DeleteSecretResponse) => void): Request<SecretsManager.Types.DeleteSecretResponse, AWSError>;
  /**
   * Retrieves the details of a secret. It does not include the encrypted secret value. Secrets Manager only returns fields that have a value in the response.  Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:DescribeSecret. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  describeSecret(params: SecretsManager.Types.DescribeSecretRequest, callback?: (err: AWSError, data: SecretsManager.Types.DescribeSecretResponse) => void): Request<SecretsManager.Types.DescribeSecretResponse, AWSError>;
  /**
   * Retrieves the details of a secret. It does not include the encrypted secret value. Secrets Manager only returns fields that have a value in the response.  Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:DescribeSecret. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  describeSecret(callback?: (err: AWSError, data: SecretsManager.Types.DescribeSecretResponse) => void): Request<SecretsManager.Types.DescribeSecretResponse, AWSError>;
  /**
   * Generates a random password. We recommend that you specify the maximum length and include every character type that the system you are generating a password for can support. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:GetRandomPassword. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  getRandomPassword(params: SecretsManager.Types.GetRandomPasswordRequest, callback?: (err: AWSError, data: SecretsManager.Types.GetRandomPasswordResponse) => void): Request<SecretsManager.Types.GetRandomPasswordResponse, AWSError>;
  /**
   * Generates a random password. We recommend that you specify the maximum length and include every character type that the system you are generating a password for can support. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:GetRandomPassword. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  getRandomPassword(callback?: (err: AWSError, data: SecretsManager.Types.GetRandomPasswordResponse) => void): Request<SecretsManager.Types.GetRandomPasswordResponse, AWSError>;
  /**
   * Retrieves the JSON text of the resource-based policy document attached to the secret. For more information about permissions policies attached to a secret, see Permissions policies attached to a secret. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:GetResourcePolicy. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  getResourcePolicy(params: SecretsManager.Types.GetResourcePolicyRequest, callback?: (err: AWSError, data: SecretsManager.Types.GetResourcePolicyResponse) => void): Request<SecretsManager.Types.GetResourcePolicyResponse, AWSError>;
  /**
   * Retrieves the JSON text of the resource-based policy document attached to the secret. For more information about permissions policies attached to a secret, see Permissions policies attached to a secret. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:GetResourcePolicy. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  getResourcePolicy(callback?: (err: AWSError, data: SecretsManager.Types.GetResourcePolicyResponse) => void): Request<SecretsManager.Types.GetResourcePolicyResponse, AWSError>;
  /**
   * Retrieves the contents of the encrypted fields SecretString or SecretBinary from the specified version of a secret, whichever contains content. We recommend that you cache your secret values by using client-side caching. Caching secrets improves speed and reduces your costs. For more information, see Cache secrets for your applications. To retrieve the previous version of a secret, use VersionStage and specify AWSPREVIOUS. To revert to the previous version of a secret, call UpdateSecretVersionStage. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:GetSecretValue. If the secret is encrypted using a customer-managed key instead of the Amazon Web Services managed key aws/secretsmanager, then you also need kms:Decrypt permissions for that key. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  getSecretValue(params: SecretsManager.Types.GetSecretValueRequest, callback?: (err: AWSError, data: SecretsManager.Types.GetSecretValueResponse) => void): Request<SecretsManager.Types.GetSecretValueResponse, AWSError>;
  /**
   * Retrieves the contents of the encrypted fields SecretString or SecretBinary from the specified version of a secret, whichever contains content. We recommend that you cache your secret values by using client-side caching. Caching secrets improves speed and reduces your costs. For more information, see Cache secrets for your applications. To retrieve the previous version of a secret, use VersionStage and specify AWSPREVIOUS. To revert to the previous version of a secret, call UpdateSecretVersionStage. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:GetSecretValue. If the secret is encrypted using a customer-managed key instead of the Amazon Web Services managed key aws/secretsmanager, then you also need kms:Decrypt permissions for that key. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  getSecretValue(callback?: (err: AWSError, data: SecretsManager.Types.GetSecretValueResponse) => void): Request<SecretsManager.Types.GetSecretValueResponse, AWSError>;
  /**
   * Lists the versions of a secret. Secrets Manager uses staging labels to indicate the different versions of a secret. For more information, see  Secrets Manager concepts: Versions. To list the secrets in the account, use ListSecrets. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:ListSecretVersionIds. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  listSecretVersionIds(params: SecretsManager.Types.ListSecretVersionIdsRequest, callback?: (err: AWSError, data: SecretsManager.Types.ListSecretVersionIdsResponse) => void): Request<SecretsManager.Types.ListSecretVersionIdsResponse, AWSError>;
  /**
   * Lists the versions of a secret. Secrets Manager uses staging labels to indicate the different versions of a secret. For more information, see  Secrets Manager concepts: Versions. To list the secrets in the account, use ListSecrets. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:ListSecretVersionIds. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  listSecretVersionIds(callback?: (err: AWSError, data: SecretsManager.Types.ListSecretVersionIdsResponse) => void): Request<SecretsManager.Types.ListSecretVersionIdsResponse, AWSError>;
  /**
   * Lists the secrets that are stored by Secrets Manager in the Amazon Web Services account, not including secrets that are marked for deletion. To see secrets marked for deletion, use the Secrets Manager console. ListSecrets is eventually consistent, however it might not reflect changes from the last five minutes. To get the latest information for a specific secret, use DescribeSecret. To list the versions of a secret, use ListSecretVersionIds. To get the secret value from SecretString or SecretBinary, call GetSecretValue. For information about finding secrets in the console, see Find secrets in Secrets Manager. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:ListSecrets. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  listSecrets(params: SecretsManager.Types.ListSecretsRequest, callback?: (err: AWSError, data: SecretsManager.Types.ListSecretsResponse) => void): Request<SecretsManager.Types.ListSecretsResponse, AWSError>;
  /**
   * Lists the secrets that are stored by Secrets Manager in the Amazon Web Services account, not including secrets that are marked for deletion. To see secrets marked for deletion, use the Secrets Manager console. ListSecrets is eventually consistent, however it might not reflect changes from the last five minutes. To get the latest information for a specific secret, use DescribeSecret. To list the versions of a secret, use ListSecretVersionIds. To get the secret value from SecretString or SecretBinary, call GetSecretValue. For information about finding secrets in the console, see Find secrets in Secrets Manager. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:ListSecrets. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  listSecrets(callback?: (err: AWSError, data: SecretsManager.Types.ListSecretsResponse) => void): Request<SecretsManager.Types.ListSecretsResponse, AWSError>;
  /**
   * Attaches a resource-based permission policy to a secret. A resource-based policy is optional. For more information, see Authentication and access control for Secrets Manager  For information about attaching a policy in the console, see Attach a permissions policy to a secret. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:PutResourcePolicy. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  putResourcePolicy(params: SecretsManager.Types.PutResourcePolicyRequest, callback?: (err: AWSError, data: SecretsManager.Types.PutResourcePolicyResponse) => void): Request<SecretsManager.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Attaches a resource-based permission policy to a secret. A resource-based policy is optional. For more information, see Authentication and access control for Secrets Manager  For information about attaching a policy in the console, see Attach a permissions policy to a secret. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:PutResourcePolicy. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  putResourcePolicy(callback?: (err: AWSError, data: SecretsManager.Types.PutResourcePolicyResponse) => void): Request<SecretsManager.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Creates a new version with a new encrypted secret value and attaches it to the secret. The version can contain a new SecretString value or a new SecretBinary value.  We recommend you avoid calling PutSecretValue at a sustained rate of more than once every 10 minutes. When you update the secret value, Secrets Manager creates a new version of the secret. Secrets Manager removes outdated versions when there are more than 100, but it does not remove versions created less than 24 hours ago. If you call PutSecretValue more than once every 10 minutes, you create more versions than Secrets Manager removes, and you will reach the quota for secret versions. You can specify the staging labels to attach to the new version in VersionStages. If you don't include VersionStages, then Secrets Manager automatically moves the staging label AWSCURRENT to this version. If this operation creates the first version for the secret, then Secrets Manager automatically attaches the staging label AWSCURRENT to it. If this operation moves the staging label AWSCURRENT from another version to this version, then Secrets Manager also automatically moves the staging label AWSPREVIOUS to the version that AWSCURRENT was removed from. This operation is idempotent. If you call this operation with a ClientRequestToken that matches an existing version's VersionId, and you specify the same secret data, the operation succeeds but does nothing. However, if the secret data is different, then the operation fails because you can't modify an existing version; you can only create new ones. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters except SecretBinary or SecretString because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:PutSecretValue. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  putSecretValue(params: SecretsManager.Types.PutSecretValueRequest, callback?: (err: AWSError, data: SecretsManager.Types.PutSecretValueResponse) => void): Request<SecretsManager.Types.PutSecretValueResponse, AWSError>;
  /**
   * Creates a new version with a new encrypted secret value and attaches it to the secret. The version can contain a new SecretString value or a new SecretBinary value.  We recommend you avoid calling PutSecretValue at a sustained rate of more than once every 10 minutes. When you update the secret value, Secrets Manager creates a new version of the secret. Secrets Manager removes outdated versions when there are more than 100, but it does not remove versions created less than 24 hours ago. If you call PutSecretValue more than once every 10 minutes, you create more versions than Secrets Manager removes, and you will reach the quota for secret versions. You can specify the staging labels to attach to the new version in VersionStages. If you don't include VersionStages, then Secrets Manager automatically moves the staging label AWSCURRENT to this version. If this operation creates the first version for the secret, then Secrets Manager automatically attaches the staging label AWSCURRENT to it. If this operation moves the staging label AWSCURRENT from another version to this version, then Secrets Manager also automatically moves the staging label AWSPREVIOUS to the version that AWSCURRENT was removed from. This operation is idempotent. If you call this operation with a ClientRequestToken that matches an existing version's VersionId, and you specify the same secret data, the operation succeeds but does nothing. However, if the secret data is different, then the operation fails because you can't modify an existing version; you can only create new ones. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters except SecretBinary or SecretString because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:PutSecretValue. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  putSecretValue(callback?: (err: AWSError, data: SecretsManager.Types.PutSecretValueResponse) => void): Request<SecretsManager.Types.PutSecretValueResponse, AWSError>;
  /**
   * For a secret that is replicated to other Regions, deletes the secret replicas from the Regions you specify. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:RemoveRegionsFromReplication. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  removeRegionsFromReplication(params: SecretsManager.Types.RemoveRegionsFromReplicationRequest, callback?: (err: AWSError, data: SecretsManager.Types.RemoveRegionsFromReplicationResponse) => void): Request<SecretsManager.Types.RemoveRegionsFromReplicationResponse, AWSError>;
  /**
   * For a secret that is replicated to other Regions, deletes the secret replicas from the Regions you specify. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:RemoveRegionsFromReplication. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  removeRegionsFromReplication(callback?: (err: AWSError, data: SecretsManager.Types.RemoveRegionsFromReplicationResponse) => void): Request<SecretsManager.Types.RemoveRegionsFromReplicationResponse, AWSError>;
  /**
   * Replicates the secret to a new Regions. See Multi-Region secrets. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:ReplicateSecretToRegions. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  replicateSecretToRegions(params: SecretsManager.Types.ReplicateSecretToRegionsRequest, callback?: (err: AWSError, data: SecretsManager.Types.ReplicateSecretToRegionsResponse) => void): Request<SecretsManager.Types.ReplicateSecretToRegionsResponse, AWSError>;
  /**
   * Replicates the secret to a new Regions. See Multi-Region secrets. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:ReplicateSecretToRegions. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  replicateSecretToRegions(callback?: (err: AWSError, data: SecretsManager.Types.ReplicateSecretToRegionsResponse) => void): Request<SecretsManager.Types.ReplicateSecretToRegionsResponse, AWSError>;
  /**
   * Cancels the scheduled deletion of a secret by removing the DeletedDate time stamp. You can access a secret again after it has been restored. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:RestoreSecret. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  restoreSecret(params: SecretsManager.Types.RestoreSecretRequest, callback?: (err: AWSError, data: SecretsManager.Types.RestoreSecretResponse) => void): Request<SecretsManager.Types.RestoreSecretResponse, AWSError>;
  /**
   * Cancels the scheduled deletion of a secret by removing the DeletedDate time stamp. You can access a secret again after it has been restored. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:RestoreSecret. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  restoreSecret(callback?: (err: AWSError, data: SecretsManager.Types.RestoreSecretResponse) => void): Request<SecretsManager.Types.RestoreSecretResponse, AWSError>;
  /**
   * Configures and starts the asynchronous process of rotating the secret. For information about rotation, see Rotate secrets in the Secrets Manager User Guide. If you include the configuration parameters, the operation sets the values for the secret and then immediately starts a rotation. If you don't include the configuration parameters, the operation starts a rotation with the values already stored in the secret.  When rotation is successful, the AWSPENDING staging label might be attached to the same version as the AWSCURRENT version, or it might not be attached to any version. If the AWSPENDING staging label is present but not attached to the same version as AWSCURRENT, then any later invocation of RotateSecret assumes that a previous rotation request is still in progress and returns an error. When rotation is unsuccessful, the AWSPENDING staging label might be attached to an empty secret version. For more information, see Troubleshoot rotation in the Secrets Manager User Guide. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:RotateSecret. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. You also need lambda:InvokeFunction permissions on the rotation function. For more information, see  Permissions for rotation.
   */
  rotateSecret(params: SecretsManager.Types.RotateSecretRequest, callback?: (err: AWSError, data: SecretsManager.Types.RotateSecretResponse) => void): Request<SecretsManager.Types.RotateSecretResponse, AWSError>;
  /**
   * Configures and starts the asynchronous process of rotating the secret. For information about rotation, see Rotate secrets in the Secrets Manager User Guide. If you include the configuration parameters, the operation sets the values for the secret and then immediately starts a rotation. If you don't include the configuration parameters, the operation starts a rotation with the values already stored in the secret.  When rotation is successful, the AWSPENDING staging label might be attached to the same version as the AWSCURRENT version, or it might not be attached to any version. If the AWSPENDING staging label is present but not attached to the same version as AWSCURRENT, then any later invocation of RotateSecret assumes that a previous rotation request is still in progress and returns an error. When rotation is unsuccessful, the AWSPENDING staging label might be attached to an empty secret version. For more information, see Troubleshoot rotation in the Secrets Manager User Guide. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:RotateSecret. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. You also need lambda:InvokeFunction permissions on the rotation function. For more information, see  Permissions for rotation.
   */
  rotateSecret(callback?: (err: AWSError, data: SecretsManager.Types.RotateSecretResponse) => void): Request<SecretsManager.Types.RotateSecretResponse, AWSError>;
  /**
   * Removes the link between the replica secret and the primary secret and promotes the replica to a primary secret in the replica Region. You must call this operation from the Region in which you want to promote the replica to a primary secret. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:StopReplicationToReplica. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  stopReplicationToReplica(params: SecretsManager.Types.StopReplicationToReplicaRequest, callback?: (err: AWSError, data: SecretsManager.Types.StopReplicationToReplicaResponse) => void): Request<SecretsManager.Types.StopReplicationToReplicaResponse, AWSError>;
  /**
   * Removes the link between the replica secret and the primary secret and promotes the replica to a primary secret in the replica Region. You must call this operation from the Region in which you want to promote the replica to a primary secret. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:StopReplicationToReplica. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  stopReplicationToReplica(callback?: (err: AWSError, data: SecretsManager.Types.StopReplicationToReplicaResponse) => void): Request<SecretsManager.Types.StopReplicationToReplicaResponse, AWSError>;
  /**
   * Attaches tags to a secret. Tags consist of a key name and a value. Tags are part of the secret's metadata. They are not associated with specific versions of the secret. This operation appends tags to the existing list of tags. The following restrictions apply to tags:   Maximum number of tags per secret: 50   Maximum key length: 127 Unicode characters in UTF-8   Maximum value length: 255 Unicode characters in UTF-8   Tag keys and values are case sensitive.   Do not use the aws: prefix in your tag names or values because Amazon Web Services reserves it for Amazon Web Services use. You can't edit or delete tag names or values with this prefix. Tags with this prefix do not count against your tags per secret limit.   If you use your tagging schema across multiple services and resources, other services might have restrictions on allowed characters. Generally allowed characters: letters, spaces, and numbers representable in UTF-8, plus the following special characters: + - = . _ : / @.    If you use tags as part of your security strategy, then adding or removing a tag can change permissions. If successfully completing this operation would result in you losing your permissions for this secret, then the operation is blocked and returns an Access Denied error.  Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:TagResource. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  tagResource(params: SecretsManager.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches tags to a secret. Tags consist of a key name and a value. Tags are part of the secret's metadata. They are not associated with specific versions of the secret. This operation appends tags to the existing list of tags. The following restrictions apply to tags:   Maximum number of tags per secret: 50   Maximum key length: 127 Unicode characters in UTF-8   Maximum value length: 255 Unicode characters in UTF-8   Tag keys and values are case sensitive.   Do not use the aws: prefix in your tag names or values because Amazon Web Services reserves it for Amazon Web Services use. You can't edit or delete tag names or values with this prefix. Tags with this prefix do not count against your tags per secret limit.   If you use your tagging schema across multiple services and resources, other services might have restrictions on allowed characters. Generally allowed characters: letters, spaces, and numbers representable in UTF-8, plus the following special characters: + - = . _ : / @.    If you use tags as part of your security strategy, then adding or removing a tag can change permissions. If successfully completing this operation would result in you losing your permissions for this secret, then the operation is blocked and returns an Access Denied error.  Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:TagResource. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes specific tags from a secret. This operation is idempotent. If a requested tag is not attached to the secret, no error is returned and the secret metadata is unchanged.  If you use tags as part of your security strategy, then removing a tag can change permissions. If successfully completing this operation would result in you losing your permissions for this secret, then the operation is blocked and returns an Access Denied error.  Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:UntagResource. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  untagResource(params: SecretsManager.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes specific tags from a secret. This operation is idempotent. If a requested tag is not attached to the secret, no error is returned and the secret metadata is unchanged.  If you use tags as part of your security strategy, then removing a tag can change permissions. If successfully completing this operation would result in you losing your permissions for this secret, then the operation is blocked and returns an Access Denied error.  Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:UntagResource. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Modifies the details of a secret, including metadata and the secret value. To change the secret value, you can also use PutSecretValue. To change the rotation configuration of a secret, use RotateSecret instead. To change a secret so that it is managed by another service, you need to recreate the secret in that service. See Secrets Manager secrets managed by other Amazon Web Services services. We recommend you avoid calling UpdateSecret at a sustained rate of more than once every 10 minutes. When you call UpdateSecret to update the secret value, Secrets Manager creates a new version of the secret. Secrets Manager removes outdated versions when there are more than 100, but it does not remove versions created less than 24 hours ago. If you update the secret value more than once every 10 minutes, you create more versions than Secrets Manager removes, and you will reach the quota for secret versions. If you include SecretString or SecretBinary to create a new secret version, Secrets Manager automatically moves the staging label AWSCURRENT to the new version. Then it attaches the label AWSPREVIOUS to the version that AWSCURRENT was removed from. If you call this operation with a ClientRequestToken that matches an existing version's VersionId, the operation results in an error. You can't modify an existing version, you can only create a new version. To remove a version, remove all staging labels from it. See UpdateSecretVersionStage. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters except SecretBinary or SecretString because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:UpdateSecret. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. If you use a customer managed key, you must also have kms:GenerateDataKey, kms:Encrypt, and kms:Decrypt permissions on the key. If you change the KMS key and you don't have kms:Encrypt permission to the new key, Secrets Manager does not re-ecrypt existing secret versions with the new key. For more information, see  Secret encryption and decryption.
   */
  updateSecret(params: SecretsManager.Types.UpdateSecretRequest, callback?: (err: AWSError, data: SecretsManager.Types.UpdateSecretResponse) => void): Request<SecretsManager.Types.UpdateSecretResponse, AWSError>;
  /**
   * Modifies the details of a secret, including metadata and the secret value. To change the secret value, you can also use PutSecretValue. To change the rotation configuration of a secret, use RotateSecret instead. To change a secret so that it is managed by another service, you need to recreate the secret in that service. See Secrets Manager secrets managed by other Amazon Web Services services. We recommend you avoid calling UpdateSecret at a sustained rate of more than once every 10 minutes. When you call UpdateSecret to update the secret value, Secrets Manager creates a new version of the secret. Secrets Manager removes outdated versions when there are more than 100, but it does not remove versions created less than 24 hours ago. If you update the secret value more than once every 10 minutes, you create more versions than Secrets Manager removes, and you will reach the quota for secret versions. If you include SecretString or SecretBinary to create a new secret version, Secrets Manager automatically moves the staging label AWSCURRENT to the new version. Then it attaches the label AWSPREVIOUS to the version that AWSCURRENT was removed from. If you call this operation with a ClientRequestToken that matches an existing version's VersionId, the operation results in an error. You can't modify an existing version, you can only create a new version. To remove a version, remove all staging labels from it. See UpdateSecretVersionStage. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters except SecretBinary or SecretString because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:UpdateSecret. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. If you use a customer managed key, you must also have kms:GenerateDataKey, kms:Encrypt, and kms:Decrypt permissions on the key. If you change the KMS key and you don't have kms:Encrypt permission to the new key, Secrets Manager does not re-ecrypt existing secret versions with the new key. For more information, see  Secret encryption and decryption.
   */
  updateSecret(callback?: (err: AWSError, data: SecretsManager.Types.UpdateSecretResponse) => void): Request<SecretsManager.Types.UpdateSecretResponse, AWSError>;
  /**
   * Modifies the staging labels attached to a version of a secret. Secrets Manager uses staging labels to track a version as it progresses through the secret rotation process. Each staging label can be attached to only one version at a time. To add a staging label to a version when it is already attached to another version, Secrets Manager first removes it from the other version first and then attaches it to this one. For more information about versions and staging labels, see Concepts: Version.  The staging labels that you specify in the VersionStage parameter are added to the existing list of staging labels for the version.  You can move the AWSCURRENT staging label to this version by including it in this call.  Whenever you move AWSCURRENT, Secrets Manager automatically moves the label AWSPREVIOUS to the version that AWSCURRENT was removed from.  If this action results in the last label being removed from a version, then the version is considered to be 'deprecated' and can be deleted by Secrets Manager. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:UpdateSecretVersionStage. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  updateSecretVersionStage(params: SecretsManager.Types.UpdateSecretVersionStageRequest, callback?: (err: AWSError, data: SecretsManager.Types.UpdateSecretVersionStageResponse) => void): Request<SecretsManager.Types.UpdateSecretVersionStageResponse, AWSError>;
  /**
   * Modifies the staging labels attached to a version of a secret. Secrets Manager uses staging labels to track a version as it progresses through the secret rotation process. Each staging label can be attached to only one version at a time. To add a staging label to a version when it is already attached to another version, Secrets Manager first removes it from the other version first and then attaches it to this one. For more information about versions and staging labels, see Concepts: Version.  The staging labels that you specify in the VersionStage parameter are added to the existing list of staging labels for the version.  You can move the AWSCURRENT staging label to this version by including it in this call.  Whenever you move AWSCURRENT, Secrets Manager automatically moves the label AWSPREVIOUS to the version that AWSCURRENT was removed from.  If this action results in the last label being removed from a version, then the version is considered to be 'deprecated' and can be deleted by Secrets Manager. Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:UpdateSecretVersionStage. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  updateSecretVersionStage(callback?: (err: AWSError, data: SecretsManager.Types.UpdateSecretVersionStageResponse) => void): Request<SecretsManager.Types.UpdateSecretVersionStageResponse, AWSError>;
  /**
   * Validates that a resource policy does not grant a wide range of principals access to your secret. A resource-based policy is optional for secrets. The API performs three checks when validating the policy:   Sends a call to Zelkova, an automated reasoning engine, to ensure your resource policy does not allow broad access to your secret, for example policies that use a wildcard for the principal.   Checks for correct syntax in a policy.   Verifies the policy does not lock out a caller.   Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:ValidateResourcePolicy and secretsmanager:PutResourcePolicy. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  validateResourcePolicy(params: SecretsManager.Types.ValidateResourcePolicyRequest, callback?: (err: AWSError, data: SecretsManager.Types.ValidateResourcePolicyResponse) => void): Request<SecretsManager.Types.ValidateResourcePolicyResponse, AWSError>;
  /**
   * Validates that a resource policy does not grant a wide range of principals access to your secret. A resource-based policy is optional for secrets. The API performs three checks when validating the policy:   Sends a call to Zelkova, an automated reasoning engine, to ensure your resource policy does not allow broad access to your secret, for example policies that use a wildcard for the principal.   Checks for correct syntax in a policy.   Verifies the policy does not lock out a caller.   Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.  Required permissions:  secretsmanager:ValidateResourcePolicy and secretsmanager:PutResourcePolicy. For more information, see  IAM policy actions for Secrets Manager and Authentication and access control in Secrets Manager. 
   */
  validateResourcePolicy(callback?: (err: AWSError, data: SecretsManager.Types.ValidateResourcePolicyResponse) => void): Request<SecretsManager.Types.ValidateResourcePolicyResponse, AWSError>;
}
declare namespace SecretsManager {
  export type AddReplicaRegionListType = ReplicaRegionType[];
  export type AutomaticallyRotateAfterDaysType = number;
  export type BooleanType = boolean;
  export interface CancelRotateSecretRequest {
    /**
     * The ARN or name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN. See Finding a secret from a partial ARN.
     */
    SecretId: SecretIdType;
  }
  export interface CancelRotateSecretResponse {
    /**
     * The ARN of the secret.
     */
    ARN?: SecretARNType;
    /**
     * The name of the secret.
     */
    Name?: SecretNameType;
    /**
     * The unique identifier of the version of the secret created during the rotation. This version might not be complete, and should be evaluated for possible deletion. We recommend that you remove the VersionStage value AWSPENDING from this version so that Secrets Manager can delete it. Failing to clean up a cancelled rotation can block you from starting future rotations.
     */
    VersionId?: SecretVersionIdType;
  }
  export type ClientRequestTokenType = string;
  export interface CreateSecretRequest {
    /**
     * The name of the new secret. The secret name can contain ASCII letters, numbers, and the following characters: /_+=.@- Do not end your secret name with a hyphen followed by six characters. If you do so, you risk confusion and unexpected results when searching for a secret by partial ARN. Secrets Manager automatically adds a hyphen and six random characters after the secret name at the end of the ARN.
     */
    Name: NameType;
    /**
     * If you include SecretString or SecretBinary, then Secrets Manager creates an initial version for the secret, and this parameter specifies the unique identifier for the new version.   If you use the Amazon Web Services CLI or one of the Amazon Web Services SDKs to call this operation, then you can leave this parameter empty. The CLI or SDK generates a random UUID for you and includes it as the value for this parameter in the request. If you don't use the SDK and instead generate a raw HTTP request to the Secrets Manager service endpoint, then you must generate a ClientRequestToken yourself for the new version and include the value in the request.  This value helps ensure idempotency. Secrets Manager uses this value to prevent the accidental creation of duplicate versions if there are failures and retries during a rotation. We recommend that you generate a UUID-type value to ensure uniqueness of your versions within the specified secret.    If the ClientRequestToken value isn't already associated with a version of the secret then a new version of the secret is created.    If a version with this value already exists and the version SecretString and SecretBinary values are the same as those in the request, then the request is ignored.   If a version with this value already exists and that version's SecretString and SecretBinary values are different from those in the request, then the request fails because you cannot modify an existing version. Instead, use PutSecretValue to create a new version.   This value becomes the VersionId of the new version.
     */
    ClientRequestToken?: ClientRequestTokenType;
    /**
     * The description of the secret.
     */
    Description?: DescriptionType;
    /**
     * The ARN, key ID, or alias of the KMS key that Secrets Manager uses to encrypt the secret value in the secret. An alias is always prefixed by alias/, for example alias/aws/secretsmanager. For more information, see About aliases. To use a KMS key in a different account, use the key ARN or the alias ARN. If you don't specify this value, then Secrets Manager uses the key aws/secretsmanager. If that key doesn't yet exist, then Secrets Manager creates it for you automatically the first time it encrypts the secret value. If the secret is in a different Amazon Web Services account from the credentials calling the API, then you can't use aws/secretsmanager to encrypt the secret, and you must create and use a customer managed KMS key. 
     */
    KmsKeyId?: KmsKeyIdType;
    /**
     * The binary data to encrypt and store in the new version of the secret. We recommend that you store your binary data in a file and then pass the contents of the file as a parameter. Either SecretString or SecretBinary must have a value, but not both. This parameter is not available in the Secrets Manager console.
     */
    SecretBinary?: SecretBinaryType;
    /**
     * The text data to encrypt and store in this new version of the secret. We recommend you use a JSON structure of key/value pairs for your secret value. Either SecretString or SecretBinary must have a value, but not both. If you create a secret by using the Secrets Manager console then Secrets Manager puts the protected secret text in only the SecretString parameter. The Secrets Manager console stores the information as a JSON structure of key/value pairs that a Lambda rotation function can parse.
     */
    SecretString?: SecretStringType;
    /**
     * A list of tags to attach to the secret. Each tag is a key and value pair of strings in a JSON text string, for example:  [{"Key":"CostCenter","Value":"12345"},{"Key":"environment","Value":"production"}]  Secrets Manager tag key names are case sensitive. A tag with the key "ABC" is a different tag from one with key "abc". If you check tags in permissions policies as part of your security strategy, then adding or removing a tag can change permissions. If the completion of this operation would result in you losing your permissions for this secret, then Secrets Manager blocks the operation and returns an Access Denied error. For more information, see Control access to secrets using tags and Limit access to identities with tags that match secrets' tags. For information about how to format a JSON parameter for the various command line tool environments, see Using JSON for Parameters. If your command-line tool or SDK requires quotation marks around the parameter, you should use single quotes to avoid confusion with the double quotes required in the JSON text. The following restrictions apply to tags:   Maximum number of tags per secret: 50   Maximum key length: 127 Unicode characters in UTF-8   Maximum value length: 255 Unicode characters in UTF-8   Tag keys and values are case sensitive.   Do not use the aws: prefix in your tag names or values because Amazon Web Services reserves it for Amazon Web Services use. You can't edit or delete tag names or values with this prefix. Tags with this prefix do not count against your tags per secret limit.   If you use your tagging schema across multiple services and resources, other services might have restrictions on allowed characters. Generally allowed characters: letters, spaces, and numbers representable in UTF-8, plus the following special characters: + - = . _ : / @.  
     */
    Tags?: TagListType;
    /**
     * A list of Regions and KMS keys to replicate secrets.
     */
    AddReplicaRegions?: AddReplicaRegionListType;
    /**
     * Specifies whether to overwrite a secret with the same name in the destination Region. By default, secrets aren't overwritten.
     */
    ForceOverwriteReplicaSecret?: BooleanType;
  }
  export interface CreateSecretResponse {
    /**
     * The ARN of the new secret. The ARN includes the name of the secret followed by six random characters. This ensures that if you create a new secret with the same name as a deleted secret, then users with access to the old secret don't get access to the new secret because the ARNs are different.
     */
    ARN?: SecretARNType;
    /**
     * The name of the new secret.
     */
    Name?: SecretNameType;
    /**
     * The unique identifier associated with the version of the new secret.
     */
    VersionId?: SecretVersionIdType;
    /**
     * A list of the replicas of this secret and their status:    Failed, which indicates that the replica was not created.    InProgress, which indicates that Secrets Manager is in the process of creating the replica.    InSync, which indicates that the replica was created.  
     */
    ReplicationStatus?: ReplicationStatusListType;
  }
  export type CreatedDateType = Date;
  export interface DeleteResourcePolicyRequest {
    /**
     * The ARN or name of the secret to delete the attached resource-based policy for. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN. See Finding a secret from a partial ARN.
     */
    SecretId: SecretIdType;
  }
  export interface DeleteResourcePolicyResponse {
    /**
     * The ARN of the secret that the resource-based policy was deleted for.
     */
    ARN?: SecretARNType;
    /**
     * The name of the secret that the resource-based policy was deleted for.
     */
    Name?: NameType;
  }
  export interface DeleteSecretRequest {
    /**
     * The ARN or name of the secret to delete. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN. See Finding a secret from a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * The number of days from 7 to 30 that Secrets Manager waits before permanently deleting the secret. You can't use both this parameter and ForceDeleteWithoutRecovery in the same call. If you don't use either, then by default Secrets Manager uses a 30 day recovery window.
     */
    RecoveryWindowInDays?: RecoveryWindowInDaysType;
    /**
     * Specifies whether to delete the secret without any recovery window. You can't use both this parameter and RecoveryWindowInDays in the same call. If you don't use either, then by default Secrets Manager uses a 30 day recovery window. Secrets Manager performs the actual deletion with an asynchronous background process, so there might be a short delay before the secret is permanently deleted. If you delete a secret and then immediately create a secret with the same name, use appropriate back off and retry logic. If you forcibly delete an already deleted or nonexistent secret, the operation does not return ResourceNotFoundException.  Use this parameter with caution. This parameter causes the operation to skip the normal recovery window before the permanent deletion that Secrets Manager would normally impose with the RecoveryWindowInDays parameter. If you delete a secret with the ForceDeleteWithoutRecovery parameter, then you have no opportunity to recover the secret. You lose the secret permanently. 
     */
    ForceDeleteWithoutRecovery?: BooleanType;
  }
  export interface DeleteSecretResponse {
    /**
     * The ARN of the secret.
     */
    ARN?: SecretARNType;
    /**
     * The name of the secret.
     */
    Name?: SecretNameType;
    /**
     * The date and time after which this secret Secrets Manager can permanently delete this secret, and it can no longer be restored. This value is the date and time of the delete request plus the number of days in RecoveryWindowInDays.
     */
    DeletionDate?: DeletionDateType;
  }
  export type DeletedDateType = Date;
  export type DeletionDateType = Date;
  export interface DescribeSecretRequest {
    /**
     * The ARN or name of the secret.  For an ARN, we recommend that you specify a complete ARN rather than a partial ARN. See Finding a secret from a partial ARN.
     */
    SecretId: SecretIdType;
  }
  export interface DescribeSecretResponse {
    /**
     * The ARN of the secret.
     */
    ARN?: SecretARNType;
    /**
     * The name of the secret.
     */
    Name?: SecretNameType;
    /**
     * The description of the secret.
     */
    Description?: DescriptionType;
    /**
     * The key ID or alias ARN of the KMS key that Secrets Manager uses to encrypt the secret value. If the secret is encrypted with the Amazon Web Services managed key aws/secretsmanager, this field is omitted. Secrets created using the console use an KMS key ID.
     */
    KmsKeyId?: KmsKeyIdType;
    /**
     * Specifies whether automatic rotation is turned on for this secret. To turn on rotation, use RotateSecret. To turn off rotation, use CancelRotateSecret.
     */
    RotationEnabled?: RotationEnabledType;
    /**
     * The ARN of the Lambda function that Secrets Manager invokes to rotate the secret. 
     */
    RotationLambdaARN?: RotationLambdaARNType;
    /**
     * The rotation schedule and Lambda function for this secret. If the secret previously had rotation turned on, but it is now turned off, this field shows the previous rotation schedule and rotation function. If the secret never had rotation turned on, this field is omitted.
     */
    RotationRules?: RotationRulesType;
    /**
     * The last date and time that Secrets Manager rotated the secret. If the secret isn't configured for rotation, Secrets Manager returns null.
     */
    LastRotatedDate?: LastRotatedDateType;
    /**
     * The last date and time that this secret was modified in any way.
     */
    LastChangedDate?: LastChangedDateType;
    /**
     * The date that the secret was last accessed in the Region. This field is omitted if the secret has never been retrieved in the Region.
     */
    LastAccessedDate?: LastAccessedDateType;
    /**
     * The date the secret is scheduled for deletion. If it is not scheduled for deletion, this field is omitted. When you delete a secret, Secrets Manager requires a recovery window of at least 7 days before deleting the secret. Some time after the deleted date, Secrets Manager deletes the secret, including all of its versions. If a secret is scheduled for deletion, then its details, including the encrypted secret value, is not accessible. To cancel a scheduled deletion and restore access to the secret, use RestoreSecret.
     */
    DeletedDate?: DeletedDateType;
    /**
     * The next rotation is scheduled to occur on or before this date. If the secret isn't configured for rotation, Secrets Manager returns null.
     */
    NextRotationDate?: NextRotationDateType;
    /**
     * The list of tags attached to the secret. To add tags to a secret, use TagResource. To remove tags, use UntagResource.
     */
    Tags?: TagListType;
    /**
     * A list of the versions of the secret that have staging labels attached. Versions that don't have staging labels are considered deprecated and Secrets Manager can delete them. Secrets Manager uses staging labels to indicate the status of a secret version during rotation. The three staging labels for rotation are:     AWSCURRENT, which indicates the current version of the secret.    AWSPENDING, which indicates the version of the secret that contains new secret information that will become the next current version when rotation finishes. During rotation, Secrets Manager creates an AWSPENDING version ID before creating the new secret version. To check if a secret version exists, call GetSecretValue.    AWSPREVIOUS, which indicates the previous current version of the secret. You can use this as the last known good version.   For more information about rotation and staging labels, see How rotation works.
     */
    VersionIdsToStages?: SecretVersionsToStagesMapType;
    /**
     * The ID of the service that created this secret. For more information, see Secrets managed by other Amazon Web Services services.
     */
    OwningService?: OwningServiceType;
    /**
     * The date the secret was created.
     */
    CreatedDate?: TimestampType;
    /**
     * The Region the secret is in. If a secret is replicated to other Regions, the replicas are listed in ReplicationStatus. 
     */
    PrimaryRegion?: RegionType;
    /**
     * A list of the replicas of this secret and their status:     Failed, which indicates that the replica was not created.    InProgress, which indicates that Secrets Manager is in the process of creating the replica.    InSync, which indicates that the replica was created.  
     */
    ReplicationStatus?: ReplicationStatusListType;
  }
  export type DescriptionType = string;
  export type DurationType = string;
  export type ErrorMessage = string;
  export type ExcludeCharactersType = string;
  export type ExcludeLowercaseType = boolean;
  export type ExcludeNumbersType = boolean;
  export type ExcludePunctuationType = boolean;
  export type ExcludeUppercaseType = boolean;
  export interface Filter {
    /**
     * The following are keys you can use:    description: Prefix match, not case-sensitive.    name: Prefix match, case-sensitive.    tag-key: Prefix match, case-sensitive.    tag-value: Prefix match, case-sensitive.    primary-region: Prefix match, case-sensitive.    owning-service: Prefix match, case-sensitive.    all: Breaks the filter value string into words and then searches all attributes for matches. Not case-sensitive.  
     */
    Key?: FilterNameStringType;
    /**
     * The keyword to filter for. You can prefix your search value with an exclamation mark (!) in order to perform negation filters. 
     */
    Values?: FilterValuesStringList;
  }
  export type FilterNameStringType = "description"|"name"|"tag-key"|"tag-value"|"primary-region"|"owning-service"|"all"|string;
  export type FilterValueStringType = string;
  export type FilterValuesStringList = FilterValueStringType[];
  export type FiltersListType = Filter[];
  export interface GetRandomPasswordRequest {
    /**
     * The length of the password. If you don't include this parameter, the default length is 32 characters.
     */
    PasswordLength?: PasswordLengthType;
    /**
     * A string of the characters that you don't want in the password.
     */
    ExcludeCharacters?: ExcludeCharactersType;
    /**
     * Specifies whether to exclude numbers from the password. If you don't include this switch, the password can contain numbers.
     */
    ExcludeNumbers?: ExcludeNumbersType;
    /**
     * Specifies whether to exclude the following punctuation characters from the password: ! " # $ % &amp; ' ( ) * + , - . / : ; &lt; = &gt; ? @ [ \ ] ^ _ ` { | } ~. If you don't include this switch, the password can contain punctuation.
     */
    ExcludePunctuation?: ExcludePunctuationType;
    /**
     * Specifies whether to exclude uppercase letters from the password. If you don't include this switch, the password can contain uppercase letters.
     */
    ExcludeUppercase?: ExcludeUppercaseType;
    /**
     * Specifies whether to exclude lowercase letters from the password. If you don't include this switch, the password can contain lowercase letters.
     */
    ExcludeLowercase?: ExcludeLowercaseType;
    /**
     * Specifies whether to include the space character. If you include this switch, the password can contain space characters.
     */
    IncludeSpace?: IncludeSpaceType;
    /**
     * Specifies whether to include at least one upper and lowercase letter, one number, and one punctuation. If you don't include this switch, the password contains at least one of every character type.
     */
    RequireEachIncludedType?: RequireEachIncludedTypeType;
  }
  export interface GetRandomPasswordResponse {
    /**
     * A string with the password.
     */
    RandomPassword?: RandomPasswordType;
  }
  export interface GetResourcePolicyRequest {
    /**
     * The ARN or name of the secret to retrieve the attached resource-based policy for. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN. See Finding a secret from a partial ARN.
     */
    SecretId: SecretIdType;
  }
  export interface GetResourcePolicyResponse {
    /**
     * The ARN of the secret that the resource-based policy was retrieved for.
     */
    ARN?: SecretARNType;
    /**
     * The name of the secret that the resource-based policy was retrieved for.
     */
    Name?: NameType;
    /**
     * A JSON-formatted string that contains the permissions policy attached to the secret. For more information about permissions policies, see Authentication and access control for Secrets Manager.
     */
    ResourcePolicy?: NonEmptyResourcePolicyType;
  }
  export interface GetSecretValueRequest {
    /**
     * The ARN or name of the secret to retrieve. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN. See Finding a secret from a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * The unique identifier of the version of the secret to retrieve. If you include both this parameter and VersionStage, the two parameters must refer to the same secret version. If you don't specify either a VersionStage or VersionId, then Secrets Manager returns the AWSCURRENT version. This value is typically a UUID-type value with 32 hexadecimal digits.
     */
    VersionId?: SecretVersionIdType;
    /**
     * The staging label of the version of the secret to retrieve.  Secrets Manager uses staging labels to keep track of different versions during the rotation process. If you include both this parameter and VersionId, the two parameters must refer to the same secret version. If you don't specify either a VersionStage or VersionId, Secrets Manager returns the AWSCURRENT version.
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
     * The decrypted secret value, if the secret value was originally provided as binary data in the form of a byte array. The response parameter represents the binary data as a base64-encoded string. If the secret was created by using the Secrets Manager console, or if the secret value was originally provided as a string, then this field is omitted. The secret value appears in SecretString instead.
     */
    SecretBinary?: SecretBinaryType;
    /**
     * The decrypted secret value, if the secret value was originally provided as a string or through the Secrets Manager console. If this secret was created by using the console, then Secrets Manager stores the information as a JSON structure of key/value pairs. 
     */
    SecretString?: SecretStringType;
    /**
     * A list of all of the staging labels currently attached to this version of the secret.
     */
    VersionStages?: SecretVersionStagesType;
    /**
     * The date and time that this version of the secret was created. If you don't specify which version in VersionId or VersionStage, then Secrets Manager uses the AWSCURRENT version.
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
     * The ARN or name of the secret whose versions you want to list. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN. See Finding a secret from a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * The number of results to include in the response. If there are more results available, in the response, Secrets Manager includes NextToken. To get the next results, call ListSecretVersionIds again with the value from NextToken. 
     */
    MaxResults?: MaxResultsType;
    /**
     * A token that indicates where the output should continue from, if a previous call did not show all results. To get the next results, call ListSecretVersionIds again with this value.
     */
    NextToken?: NextTokenType;
    /**
     * Specifies whether to include versions of secrets that don't have any staging labels attached to them. Versions without staging labels are considered deprecated and are subject to deletion by Secrets Manager. By default, versions without staging labels aren't included.
     */
    IncludeDeprecated?: BooleanType;
  }
  export interface ListSecretVersionIdsResponse {
    /**
     * A list of the versions of the secret.
     */
    Versions?: SecretVersionsListType;
    /**
     * Secrets Manager includes this value if there's more output available than what is included in the current response. This can occur even when the response includes no values at all, such as when you ask for a filtered view of a long list. To get the next results, call ListSecretVersionIds again with this value. 
     */
    NextToken?: NextTokenType;
    /**
     * The ARN of the secret.
     */
    ARN?: SecretARNType;
    /**
     * The name of the secret.
     */
    Name?: SecretNameType;
  }
  export interface ListSecretsRequest {
    /**
     * Specifies whether to include secrets scheduled for deletion. By default, secrets scheduled for deletion aren't included.
     */
    IncludePlannedDeletion?: BooleanType;
    /**
     * The number of results to include in the response. If there are more results available, in the response, Secrets Manager includes NextToken. To get the next results, call ListSecrets again with the value from NextToken.
     */
    MaxResults?: MaxResultsType;
    /**
     * A token that indicates where the output should continue from, if a previous call did not show all results. To get the next results, call ListSecrets again with this value.
     */
    NextToken?: NextTokenType;
    /**
     * The filters to apply to the list of secrets.
     */
    Filters?: FiltersListType;
    /**
     * Secrets are listed by CreatedDate. 
     */
    SortOrder?: SortOrderType;
  }
  export interface ListSecretsResponse {
    /**
     * A list of the secrets in the account.
     */
    SecretList?: SecretListType;
    /**
     * Secrets Manager includes this value if there's more output available than what is included in the current response. This can occur even when the response includes no values at all, such as when you ask for a filtered view of a long list. To get the next results, call ListSecrets again with this value.
     */
    NextToken?: NextTokenType;
  }
  export type MaxResultsType = number;
  export type NameType = string;
  export type NextRotationDateType = Date;
  export type NextTokenType = string;
  export type NonEmptyResourcePolicyType = string;
  export type OwningServiceType = string;
  export type PasswordLengthType = number;
  export interface PutResourcePolicyRequest {
    /**
     * The ARN or name of the secret to attach the resource-based policy. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN. See Finding a secret from a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * A JSON-formatted string for an Amazon Web Services resource-based policy. For example policies, see Permissions policy examples.
     */
    ResourcePolicy: NonEmptyResourcePolicyType;
    /**
     * Specifies whether to block resource-based policies that allow broad access to the secret, for example those that use a wildcard for the principal. By default, public policies aren't blocked.
     */
    BlockPublicPolicy?: BooleanType;
  }
  export interface PutResourcePolicyResponse {
    /**
     * The ARN of the secret.
     */
    ARN?: SecretARNType;
    /**
     * The name of the secret.
     */
    Name?: NameType;
  }
  export interface PutSecretValueRequest {
    /**
     * The ARN or name of the secret to add a new version to. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN. See Finding a secret from a partial ARN. If the secret doesn't already exist, use CreateSecret instead.
     */
    SecretId: SecretIdType;
    /**
     * A unique identifier for the new version of the secret.   If you use the Amazon Web Services CLI or one of the Amazon Web Services SDKs to call this operation, then you can leave this parameter empty because they generate a random UUID for you. If you don't use the SDK and instead generate a raw HTTP request to the Secrets Manager service endpoint, then you must generate a ClientRequestToken yourself for new versions and include that value in the request.   This value helps ensure idempotency. Secrets Manager uses this value to prevent the accidental creation of duplicate versions if there are failures and retries during the Lambda rotation function processing. We recommend that you generate a UUID-type value to ensure uniqueness within the specified secret.    If the ClientRequestToken value isn't already associated with a version of the secret then a new version of the secret is created.    If a version with this value already exists and that version's SecretString or SecretBinary values are the same as those in the request then the request is ignored. The operation is idempotent.    If a version with this value already exists and the version of the SecretString and SecretBinary values are different from those in the request, then the request fails because you can't modify a secret version. You can only create new versions to store new secret values.   This value becomes the VersionId of the new version.
     */
    ClientRequestToken?: ClientRequestTokenType;
    /**
     * The binary data to encrypt and store in the new version of the secret. To use this parameter in the command-line tools, we recommend that you store your binary data in a file and then pass the contents of the file as a parameter.  You must include SecretBinary or SecretString, but not both. You can't access this value from the Secrets Manager console.
     */
    SecretBinary?: SecretBinaryType;
    /**
     * The text to encrypt and store in the new version of the secret.  You must include SecretBinary or SecretString, but not both. We recommend you create the secret string as JSON key/value pairs, as shown in the example.
     */
    SecretString?: SecretStringType;
    /**
     * A list of staging labels to attach to this version of the secret. Secrets Manager uses staging labels to track versions of a secret through the rotation process. If you specify a staging label that's already associated with a different version of the same secret, then Secrets Manager removes the label from the other version and attaches it to this version. If you specify AWSCURRENT, and it is already attached to another version, then Secrets Manager also moves the staging label AWSPREVIOUS to the version that AWSCURRENT was removed from. If you don't include VersionStages, then Secrets Manager automatically moves the staging label AWSCURRENT to this version.
     */
    VersionStages?: SecretVersionStagesType;
  }
  export interface PutSecretValueResponse {
    /**
     * The ARN of the secret.
     */
    ARN?: SecretARNType;
    /**
     * The name of the secret.
     */
    Name?: SecretNameType;
    /**
     * The unique identifier of the version of the secret.
     */
    VersionId?: SecretVersionIdType;
    /**
     * The list of staging labels that are currently attached to this version of the secret. Secrets Manager uses staging labels to track a version as it progresses through the secret rotation process.
     */
    VersionStages?: SecretVersionStagesType;
  }
  export type RandomPasswordType = string;
  export type RecoveryWindowInDaysType = number;
  export type RegionType = string;
  export interface RemoveRegionsFromReplicationRequest {
    /**
     * The ARN or name of the secret.
     */
    SecretId: SecretIdType;
    /**
     * The Regions of the replicas to remove.
     */
    RemoveReplicaRegions: RemoveReplicaRegionListType;
  }
  export interface RemoveRegionsFromReplicationResponse {
    /**
     * The ARN of the primary secret.
     */
    ARN?: SecretARNType;
    /**
     * The status of replicas for this secret after you remove Regions.
     */
    ReplicationStatus?: ReplicationStatusListType;
  }
  export type RemoveReplicaRegionListType = RegionType[];
  export interface ReplicaRegionType {
    /**
     * A Region code. For a list of Region codes, see Name and code of Regions.
     */
    Region?: RegionType;
    /**
     * The ARN, key ID, or alias of the KMS key to encrypt the secret. If you don't include this field, Secrets Manager uses aws/secretsmanager.
     */
    KmsKeyId?: KmsKeyIdType;
  }
  export interface ReplicateSecretToRegionsRequest {
    /**
     * The ARN or name of the secret to replicate.
     */
    SecretId: SecretIdType;
    /**
     * A list of Regions in which to replicate the secret.
     */
    AddReplicaRegions: AddReplicaRegionListType;
    /**
     * Specifies whether to overwrite a secret with the same name in the destination Region. By default, secrets aren't overwritten.
     */
    ForceOverwriteReplicaSecret?: BooleanType;
  }
  export interface ReplicateSecretToRegionsResponse {
    /**
     * The ARN of the primary secret.
     */
    ARN?: SecretARNType;
    /**
     * The status of replication.
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
     * The date that the secret was last accessed in the Region. This field is omitted if the secret has never been retrieved in the Region.
     */
    LastAccessedDate?: LastAccessedDateType;
  }
  export type RequireEachIncludedTypeType = boolean;
  export interface RestoreSecretRequest {
    /**
     * The ARN or name of the secret to restore. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN. See Finding a secret from a partial ARN.
     */
    SecretId: SecretIdType;
  }
  export interface RestoreSecretResponse {
    /**
     * The ARN of the secret that was restored.
     */
    ARN?: SecretARNType;
    /**
     * The name of the secret that was restored.
     */
    Name?: SecretNameType;
  }
  export interface RotateSecretRequest {
    /**
     * The ARN or name of the secret to rotate. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN. See Finding a secret from a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * A unique identifier for the new version of the secret that helps ensure idempotency. Secrets Manager uses this value to prevent the accidental creation of duplicate versions if there are failures and retries during rotation. This value becomes the VersionId of the new version. If you use the Amazon Web Services CLI or one of the Amazon Web Services SDK to call this operation, then you can leave this parameter empty. The CLI or SDK generates a random UUID for you and includes that in the request for this parameter. If you don't use the SDK and instead generate a raw HTTP request to the Secrets Manager service endpoint, then you must generate a ClientRequestToken yourself for new versions and include that value in the request. You only need to specify this value if you implement your own retry logic and you want to ensure that Secrets Manager doesn't attempt to create a secret version twice. We recommend that you generate a UUID-type value to ensure uniqueness within the specified secret. 
     */
    ClientRequestToken?: ClientRequestTokenType;
    /**
     * For secrets that use a Lambda rotation function to rotate, the ARN of the Lambda rotation function.  For secrets that use managed rotation, omit this field. For more information, see Managed rotation in the Secrets Manager User Guide.
     */
    RotationLambdaARN?: RotationLambdaARNType;
    /**
     * A structure that defines the rotation configuration for this secret.
     */
    RotationRules?: RotationRulesType;
    /**
     * Specifies whether to rotate the secret immediately or wait until the next scheduled rotation window. The rotation schedule is defined in RotateSecretRequest$RotationRules. For secrets that use a Lambda rotation function to rotate, if you don't immediately rotate the secret, Secrets Manager tests the rotation configuration by running the  testSecret step of the Lambda rotation function. The test creates an AWSPENDING version of the secret and then removes it. By default, Secrets Manager rotates the secret immediately.
     */
    RotateImmediately?: BooleanType;
  }
  export interface RotateSecretResponse {
    /**
     * The ARN of the secret.
     */
    ARN?: SecretARNType;
    /**
     * The name of the secret.
     */
    Name?: SecretNameType;
    /**
     * The ID of the new version of the secret.
     */
    VersionId?: SecretVersionIdType;
  }
  export type RotationEnabledType = boolean;
  export type RotationLambdaARNType = string;
  export interface RotationRulesType {
    /**
     * The number of days between rotations of the secret. You can use this value to check that your secret meets your compliance guidelines for how often secrets must be rotated. If you use this field to set the rotation schedule, Secrets Manager calculates the next rotation date based on the previous rotation. Manually updating the secret value by calling PutSecretValue or UpdateSecret is considered a valid rotation. In DescribeSecret and ListSecrets, this value is calculated from the rotation schedule after every successful rotation. In RotateSecret, you can set the rotation schedule in RotationRules with AutomaticallyAfterDays or ScheduleExpression, but not both. To set a rotation schedule in hours, use ScheduleExpression.
     */
    AutomaticallyAfterDays?: AutomaticallyRotateAfterDaysType;
    /**
     * The length of the rotation window in hours, for example 3h for a three hour window. Secrets Manager rotates your secret at any time during this window. The window must not extend into the next rotation window or the next UTC day. The window starts according to the ScheduleExpression. If you don't specify a Duration, for a ScheduleExpression in hours, the window automatically closes after one hour. For a ScheduleExpression in days, the window automatically closes at the end of the UTC day. For more information, including examples, see Schedule expressions in Secrets Manager rotation in the Secrets Manager Users Guide.
     */
    Duration?: DurationType;
    /**
     * A cron() or rate() expression that defines the schedule for rotating your secret. Secrets Manager rotation schedules use UTC time zone. Secrets Manager rotates your secret any time during a rotation window. Secrets Manager rate() expressions represent the interval in hours or days that you want to rotate your secret, for example rate(12 hours) or rate(10 days). You can rotate a secret as often as every four hours. If you use a rate() expression, the rotation window starts at midnight. For a rate in hours, the default rotation window closes after one hour. For a rate in days, the default rotation window closes at the end of the day. You can set the Duration to change the rotation window. The rotation window must not extend into the next UTC day or into the next rotation window. You can use a cron() expression to create a rotation schedule that is more detailed than a rotation interval. For more information, including examples, see Schedule expressions in Secrets Manager rotation in the Secrets Manager Users Guide. For a cron expression that represents a schedule in hours, the default rotation window closes after one hour. For a cron expression that represents a schedule in days, the default rotation window closes at the end of the day. You can set the Duration to change the rotation window. The rotation window must not extend into the next UTC day or into the next rotation window.
     */
    ScheduleExpression?: ScheduleExpressionType;
  }
  export type ScheduleExpressionType = string;
  export type SecretARNType = string;
  export type SecretBinaryType = Buffer|Uint8Array|Blob|string;
  export type SecretIdType = string;
  export interface SecretListEntry {
    /**
     * The Amazon Resource Name (ARN) of the secret.
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
     * The ARN of the KMS key that Secrets Manager uses to encrypt the secret value. If the secret is encrypted with the Amazon Web Services managed key aws/secretsmanager, this field is omitted.
     */
    KmsKeyId?: KmsKeyIdType;
    /**
     * Indicates whether automatic, scheduled rotation is enabled for this secret.
     */
    RotationEnabled?: RotationEnabledType;
    /**
     * The ARN of an Amazon Web Services Lambda function invoked by Secrets Manager to rotate and expire the secret either automatically per the schedule or manually by a call to  RotateSecret .
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
     * The date that the secret was last accessed in the Region. This field is omitted if the secret has never been retrieved in the Region.
     */
    LastAccessedDate?: LastAccessedDateType;
    /**
     * The date and time the deletion of the secret occurred. Not present on active secrets. The secret can be recovered until the number of days in the recovery window has passed, as specified in the RecoveryWindowInDays parameter of the  DeleteSecret  operation.
     */
    DeletedDate?: DeletedDateType;
    /**
     * The next rotation is scheduled to occur on or before this date. If the secret isn't configured for rotation, Secrets Manager returns null.
     */
    NextRotationDate?: NextRotationDateType;
    /**
     * The list of user-defined tags associated with the secret. To add tags to a secret, use  TagResource . To remove tags, use  UntagResource .
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
     * The ARN of the primary secret. 
     */
    SecretId: SecretIdType;
  }
  export interface StopReplicationToReplicaResponse {
    /**
     * The ARN of the promoted secret. The ARN is the same as the original primary secret except the Region is changed.
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
     * The identifier for the secret to attach tags to. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN. See Finding a secret from a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * The tags to attach to the secret as a JSON text string argument. Each element in the list consists of a Key and a Value. For storing multiple values, we recommend that you use a JSON text string argument and specify key/value pairs. For more information, see Specifying parameter values for the Amazon Web Services CLI in the Amazon Web Services CLI User Guide.
     */
    Tags: TagListType;
  }
  export type TagValueType = string;
  export type TimestampType = Date;
  export interface UntagResourceRequest {
    /**
     * The ARN or name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN. See Finding a secret from a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * A list of tag key names to remove from the secret. You don't specify the value. Both the key and its associated value are removed. This parameter requires a JSON text string argument. For storing multiple values, we recommend that you use a JSON text string argument and specify key/value pairs. For more information, see Specifying parameter values for the Amazon Web Services CLI in the Amazon Web Services CLI User Guide.
     */
    TagKeys: TagKeyListType;
  }
  export interface UpdateSecretRequest {
    /**
     * The ARN or name of the secret. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN. See Finding a secret from a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * If you include SecretString or SecretBinary, then Secrets Manager creates a new version for the secret, and this parameter specifies the unique identifier for the new version.  If you use the Amazon Web Services CLI or one of the Amazon Web Services SDKs to call this operation, then you can leave this parameter empty. The CLI or SDK generates a random UUID for you and includes it as the value for this parameter in the request. If you don't use the SDK and instead generate a raw HTTP request to the Secrets Manager service endpoint, then you must generate a ClientRequestToken yourself for the new version and include the value in the request.  This value becomes the VersionId of the new version.
     */
    ClientRequestToken?: ClientRequestTokenType;
    /**
     * The description of the secret.
     */
    Description?: DescriptionType;
    /**
     * The ARN, key ID, or alias of the KMS key that Secrets Manager uses to encrypt new secret versions as well as any existing versions with the staging labels AWSCURRENT, AWSPENDING, or AWSPREVIOUS. If you don't have kms:Encrypt permission to the new key, Secrets Manager does not re-ecrypt existing secret versions with the new key. For more information about versions and staging labels, see Concepts: Version. A key alias is always prefixed by alias/, for example alias/aws/secretsmanager. For more information, see About aliases. If you set this to an empty string, Secrets Manager uses the Amazon Web Services managed key aws/secretsmanager. If this key doesn't already exist in your account, then Secrets Manager creates it for you automatically. All users and roles in the Amazon Web Services account automatically have access to use aws/secretsmanager. Creating aws/secretsmanager can result in a one-time significant delay in returning the result.   You can only use the Amazon Web Services managed key aws/secretsmanager if you call this operation using credentials from the same Amazon Web Services account that owns the secret. If the secret is in a different account, then you must use a customer managed key and provide the ARN of that KMS key in this field. The user making the call must have permissions to both the secret and the KMS key in their respective accounts. 
     */
    KmsKeyId?: KmsKeyIdType;
    /**
     * The binary data to encrypt and store in the new version of the secret. We recommend that you store your binary data in a file and then pass the contents of the file as a parameter.  Either SecretBinary or SecretString must have a value, but not both. You can't access this parameter in the Secrets Manager console.
     */
    SecretBinary?: SecretBinaryType;
    /**
     * The text data to encrypt and store in the new version of the secret. We recommend you use a JSON structure of key/value pairs for your secret value.  Either SecretBinary or SecretString must have a value, but not both. 
     */
    SecretString?: SecretStringType;
  }
  export interface UpdateSecretResponse {
    /**
     * The ARN of the secret that was updated.
     */
    ARN?: SecretARNType;
    /**
     * The name of the secret that was updated.
     */
    Name?: SecretNameType;
    /**
     * If Secrets Manager created a new version of the secret during this operation, then VersionId contains the unique identifier of the new version.
     */
    VersionId?: SecretVersionIdType;
  }
  export interface UpdateSecretVersionStageRequest {
    /**
     * The ARN or the name of the secret with the version and staging labelsto modify. For an ARN, we recommend that you specify a complete ARN rather than a partial ARN. See Finding a secret from a partial ARN.
     */
    SecretId: SecretIdType;
    /**
     * The staging label to add to this version.
     */
    VersionStage: SecretVersionStageType;
    /**
     * The ID of the version that the staging label is to be removed from. If the staging label you are trying to attach to one version is already attached to a different version, then you must include this parameter and specify the version that the label is to be removed from. If the label is attached and you either do not specify this parameter, or the version ID does not match, then the operation fails.
     */
    RemoveFromVersionId?: SecretVersionIdType;
    /**
     * The ID of the version to add the staging label to. To remove a label from a version, then do not specify this parameter. If the staging label is already attached to a different version of the secret, then you must also specify the RemoveFromVersionId parameter. 
     */
    MoveToVersionId?: SecretVersionIdType;
  }
  export interface UpdateSecretVersionStageResponse {
    /**
     * The ARN of the secret that was updated.
     */
    ARN?: SecretARNType;
    /**
     * The name of the secret that was updated.
     */
    Name?: SecretNameType;
  }
  export interface ValidateResourcePolicyRequest {
    /**
     * This field is reserved for internal use.
     */
    SecretId?: SecretIdType;
    /**
     * A JSON-formatted string that contains an Amazon Web Services resource-based policy. The policy in the string identifies who can access or manage this secret and its versions. For example policies, see Permissions policy examples.
     */
    ResourcePolicy: NonEmptyResourcePolicyType;
  }
  export interface ValidateResourcePolicyResponse {
    /**
     * True if your policy passes validation, otherwise false.
     */
    PolicyValidationPassed?: BooleanType;
    /**
     * Validation errors if your policy didn't pass validation.
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
