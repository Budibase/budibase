import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class KMS extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: KMS.Types.ClientConfiguration)
  config: Config & KMS.Types.ClientConfiguration;
  /**
   * Cancels the deletion of a KMS key. When this operation succeeds, the key state of the KMS key is Disabled. To enable the KMS key, use EnableKey.  For more information about scheduling and canceling deletion of a KMS key, see Deleting KMS keys in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:CancelKeyDeletion (key policy)  Related operations: ScheduleKeyDeletion 
   */
  cancelKeyDeletion(params: KMS.Types.CancelKeyDeletionRequest, callback?: (err: AWSError, data: KMS.Types.CancelKeyDeletionResponse) => void): Request<KMS.Types.CancelKeyDeletionResponse, AWSError>;
  /**
   * Cancels the deletion of a KMS key. When this operation succeeds, the key state of the KMS key is Disabled. To enable the KMS key, use EnableKey.  For more information about scheduling and canceling deletion of a KMS key, see Deleting KMS keys in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:CancelKeyDeletion (key policy)  Related operations: ScheduleKeyDeletion 
   */
  cancelKeyDeletion(callback?: (err: AWSError, data: KMS.Types.CancelKeyDeletionResponse) => void): Request<KMS.Types.CancelKeyDeletionResponse, AWSError>;
  /**
   * Connects or reconnects a custom key store to its associated CloudHSM cluster. The custom key store must be connected before you can create KMS keys in the key store or use the KMS keys it contains. You can disconnect and reconnect a custom key store at any time. To connect a custom key store, its associated CloudHSM cluster must have at least one active HSM. To get the number of active HSMs in a cluster, use the DescribeClusters operation. To add HSMs to the cluster, use the CreateHsm operation. Also, the  kmsuser crypto user (CU) must not be logged into the cluster. This prevents KMS from using this account to log in. The connection process can take an extended amount of time to complete; up to 20 minutes. This operation starts the connection process, but it does not wait for it to complete. When it succeeds, this operation quickly returns an HTTP 200 response and a JSON object with no properties. However, this response does not indicate that the custom key store is connected. To get the connection state of the custom key store, use the DescribeCustomKeyStores operation. During the connection process, KMS finds the CloudHSM cluster that is associated with the custom key store, creates the connection infrastructure, connects to the cluster, logs into the CloudHSM client as the kmsuser CU, and rotates its password. The ConnectCustomKeyStore operation might fail for various reasons. To find the reason, use the DescribeCustomKeyStores operation and see the ConnectionErrorCode in the response. For help interpreting the ConnectionErrorCode, see CustomKeyStoresListEntry. To fix the failure, use the DisconnectCustomKeyStore operation to disconnect the custom key store, correct the error, use the UpdateCustomKeyStore operation if necessary, and then use ConnectCustomKeyStore again. If you are having trouble connecting or disconnecting a custom key store, see Troubleshooting a Custom Key Store in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.  Required permissions: kms:ConnectCustomKeyStore (IAM policy)  Related operations     CreateCustomKeyStore     DeleteCustomKeyStore     DescribeCustomKeyStores     DisconnectCustomKeyStore     UpdateCustomKeyStore   
   */
  connectCustomKeyStore(params: KMS.Types.ConnectCustomKeyStoreRequest, callback?: (err: AWSError, data: KMS.Types.ConnectCustomKeyStoreResponse) => void): Request<KMS.Types.ConnectCustomKeyStoreResponse, AWSError>;
  /**
   * Connects or reconnects a custom key store to its associated CloudHSM cluster. The custom key store must be connected before you can create KMS keys in the key store or use the KMS keys it contains. You can disconnect and reconnect a custom key store at any time. To connect a custom key store, its associated CloudHSM cluster must have at least one active HSM. To get the number of active HSMs in a cluster, use the DescribeClusters operation. To add HSMs to the cluster, use the CreateHsm operation. Also, the  kmsuser crypto user (CU) must not be logged into the cluster. This prevents KMS from using this account to log in. The connection process can take an extended amount of time to complete; up to 20 minutes. This operation starts the connection process, but it does not wait for it to complete. When it succeeds, this operation quickly returns an HTTP 200 response and a JSON object with no properties. However, this response does not indicate that the custom key store is connected. To get the connection state of the custom key store, use the DescribeCustomKeyStores operation. During the connection process, KMS finds the CloudHSM cluster that is associated with the custom key store, creates the connection infrastructure, connects to the cluster, logs into the CloudHSM client as the kmsuser CU, and rotates its password. The ConnectCustomKeyStore operation might fail for various reasons. To find the reason, use the DescribeCustomKeyStores operation and see the ConnectionErrorCode in the response. For help interpreting the ConnectionErrorCode, see CustomKeyStoresListEntry. To fix the failure, use the DisconnectCustomKeyStore operation to disconnect the custom key store, correct the error, use the UpdateCustomKeyStore operation if necessary, and then use ConnectCustomKeyStore again. If you are having trouble connecting or disconnecting a custom key store, see Troubleshooting a Custom Key Store in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.  Required permissions: kms:ConnectCustomKeyStore (IAM policy)  Related operations     CreateCustomKeyStore     DeleteCustomKeyStore     DescribeCustomKeyStores     DisconnectCustomKeyStore     UpdateCustomKeyStore   
   */
  connectCustomKeyStore(callback?: (err: AWSError, data: KMS.Types.ConnectCustomKeyStoreResponse) => void): Request<KMS.Types.ConnectCustomKeyStoreResponse, AWSError>;
  /**
   * Creates a friendly name for a KMS key.   Adding, deleting, or updating an alias can allow or deny permission to the KMS key. For details, see Using ABAC in KMS in the Key Management Service Developer Guide.  You can use an alias to identify a KMS key in the KMS console, in the DescribeKey operation and in cryptographic operations, such as Encrypt and GenerateDataKey. You can also change the KMS key that's associated with the alias (UpdateAlias) or delete the alias (DeleteAlias) at any time. These operations don't affect the underlying KMS key.  You can associate the alias with any customer managed key in the same Amazon Web Services Region. Each alias is associated with only one KMS key at a time, but a KMS key can have multiple aliases. A valid KMS key is required. You can't create an alias without a KMS key. The alias must be unique in the account and Region, but you can have aliases with the same name in different Regions. For detailed information about aliases, see Using aliases in the Key Management Service Developer Guide. This operation does not return a response. To get the alias that you created, use the ListAliases operation. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on an alias in a different Amazon Web Services account.  Required permissions     kms:CreateAlias on the alias (IAM policy).    kms:CreateAlias on the KMS key (key policy).   For details, see Controlling access to aliases in the Key Management Service Developer Guide.  Related operations:     DeleteAlias     ListAliases     UpdateAlias   
   */
  createAlias(params: KMS.Types.CreateAliasRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a friendly name for a KMS key.   Adding, deleting, or updating an alias can allow or deny permission to the KMS key. For details, see Using ABAC in KMS in the Key Management Service Developer Guide.  You can use an alias to identify a KMS key in the KMS console, in the DescribeKey operation and in cryptographic operations, such as Encrypt and GenerateDataKey. You can also change the KMS key that's associated with the alias (UpdateAlias) or delete the alias (DeleteAlias) at any time. These operations don't affect the underlying KMS key.  You can associate the alias with any customer managed key in the same Amazon Web Services Region. Each alias is associated with only one KMS key at a time, but a KMS key can have multiple aliases. A valid KMS key is required. You can't create an alias without a KMS key. The alias must be unique in the account and Region, but you can have aliases with the same name in different Regions. For detailed information about aliases, see Using aliases in the Key Management Service Developer Guide. This operation does not return a response. To get the alias that you created, use the ListAliases operation. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on an alias in a different Amazon Web Services account.  Required permissions     kms:CreateAlias on the alias (IAM policy).    kms:CreateAlias on the KMS key (key policy).   For details, see Controlling access to aliases in the Key Management Service Developer Guide.  Related operations:     DeleteAlias     ListAliases     UpdateAlias   
   */
  createAlias(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a custom key store that is associated with an CloudHSM cluster that you own and manage. This operation is part of the Custom Key Store feature feature in KMS, which combines the convenience and extensive integration of KMS with the isolation and control of a single-tenant key store. Before you create the custom key store, you must assemble the required elements, including an CloudHSM cluster that fulfills the requirements for a custom key store. For details about the required elements, see Assemble the Prerequisites in the Key Management Service Developer Guide. When the operation completes successfully, it returns the ID of the new custom key store. Before you can use your new custom key store, you need to use the ConnectCustomKeyStore operation to connect the new key store to its CloudHSM cluster. Even if you are not going to use your custom key store immediately, you might want to connect it to verify that all settings are correct and then disconnect it until you are ready to use it. For help with failures, see Troubleshooting a Custom Key Store in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.  Required permissions: kms:CreateCustomKeyStore (IAM policy).  Related operations:     ConnectCustomKeyStore     DeleteCustomKeyStore     DescribeCustomKeyStores     DisconnectCustomKeyStore     UpdateCustomKeyStore   
   */
  createCustomKeyStore(params: KMS.Types.CreateCustomKeyStoreRequest, callback?: (err: AWSError, data: KMS.Types.CreateCustomKeyStoreResponse) => void): Request<KMS.Types.CreateCustomKeyStoreResponse, AWSError>;
  /**
   * Creates a custom key store that is associated with an CloudHSM cluster that you own and manage. This operation is part of the Custom Key Store feature feature in KMS, which combines the convenience and extensive integration of KMS with the isolation and control of a single-tenant key store. Before you create the custom key store, you must assemble the required elements, including an CloudHSM cluster that fulfills the requirements for a custom key store. For details about the required elements, see Assemble the Prerequisites in the Key Management Service Developer Guide. When the operation completes successfully, it returns the ID of the new custom key store. Before you can use your new custom key store, you need to use the ConnectCustomKeyStore operation to connect the new key store to its CloudHSM cluster. Even if you are not going to use your custom key store immediately, you might want to connect it to verify that all settings are correct and then disconnect it until you are ready to use it. For help with failures, see Troubleshooting a Custom Key Store in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.  Required permissions: kms:CreateCustomKeyStore (IAM policy).  Related operations:     ConnectCustomKeyStore     DeleteCustomKeyStore     DescribeCustomKeyStores     DisconnectCustomKeyStore     UpdateCustomKeyStore   
   */
  createCustomKeyStore(callback?: (err: AWSError, data: KMS.Types.CreateCustomKeyStoreResponse) => void): Request<KMS.Types.CreateCustomKeyStoreResponse, AWSError>;
  /**
   * Adds a grant to a KMS key.  A grant is a policy instrument that allows Amazon Web Services principals to use KMS keys in cryptographic operations. It also can allow them to view a KMS key (DescribeKey) and create and manage grants. When authorizing access to a KMS key, grants are considered along with key policies and IAM policies. Grants are often used for temporary permissions because you can create one, use its permissions, and delete it without changing your key policies or IAM policies.  For detailed information about grants, including grant terminology, see Using grants in the  Key Management Service Developer Guide . For examples of working with grants in several programming languages, see Programming grants.  The CreateGrant operation returns a GrantToken and a GrantId.   When you create, retire, or revoke a grant, there might be a brief delay, usually less than five minutes, until the grant is available throughout KMS. This state is known as eventual consistency. Once the grant has achieved eventual consistency, the grantee principal can use the permissions in the grant without identifying the grant.  However, to use the permissions in the grant immediately, use the GrantToken that CreateGrant returns. For details, see Using a grant token in the  Key Management Service Developer Guide .   The CreateGrant operation also returns a GrantId. You can use the GrantId and a key identifier to identify the grant in the RetireGrant and RevokeGrant operations. To find the grant ID, use the ListGrants or ListRetirableGrants operations.   The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation on a KMS key in a different Amazon Web Services account, specify the key ARN in the value of the KeyId parameter.   Required permissions: kms:CreateGrant (key policy)  Related operations:     ListGrants     ListRetirableGrants     RetireGrant     RevokeGrant   
   */
  createGrant(params: KMS.Types.CreateGrantRequest, callback?: (err: AWSError, data: KMS.Types.CreateGrantResponse) => void): Request<KMS.Types.CreateGrantResponse, AWSError>;
  /**
   * Adds a grant to a KMS key.  A grant is a policy instrument that allows Amazon Web Services principals to use KMS keys in cryptographic operations. It also can allow them to view a KMS key (DescribeKey) and create and manage grants. When authorizing access to a KMS key, grants are considered along with key policies and IAM policies. Grants are often used for temporary permissions because you can create one, use its permissions, and delete it without changing your key policies or IAM policies.  For detailed information about grants, including grant terminology, see Using grants in the  Key Management Service Developer Guide . For examples of working with grants in several programming languages, see Programming grants.  The CreateGrant operation returns a GrantToken and a GrantId.   When you create, retire, or revoke a grant, there might be a brief delay, usually less than five minutes, until the grant is available throughout KMS. This state is known as eventual consistency. Once the grant has achieved eventual consistency, the grantee principal can use the permissions in the grant without identifying the grant.  However, to use the permissions in the grant immediately, use the GrantToken that CreateGrant returns. For details, see Using a grant token in the  Key Management Service Developer Guide .   The CreateGrant operation also returns a GrantId. You can use the GrantId and a key identifier to identify the grant in the RetireGrant and RevokeGrant operations. To find the grant ID, use the ListGrants or ListRetirableGrants operations.   The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation on a KMS key in a different Amazon Web Services account, specify the key ARN in the value of the KeyId parameter.   Required permissions: kms:CreateGrant (key policy)  Related operations:     ListGrants     ListRetirableGrants     RetireGrant     RevokeGrant   
   */
  createGrant(callback?: (err: AWSError, data: KMS.Types.CreateGrantResponse) => void): Request<KMS.Types.CreateGrantResponse, AWSError>;
  /**
   * Creates a unique customer managed KMS key in your Amazon Web Services account and Region.  KMS is replacing the term customer master key (CMK) with KMS key and KMS key. The concept has not changed. To prevent breaking changes, KMS is keeping some variations of this term.  You can use the CreateKey operation to create symmetric or asymmetric KMS keys.    Symmetric KMS keys contain a 256-bit symmetric key that never leaves KMS unencrypted. To use the KMS key, you must call KMS. You can use a symmetric KMS key to encrypt and decrypt small amounts of data, but they are typically used to generate data keys and data keys pairs. For details, see GenerateDataKey and GenerateDataKeyPair.    Asymmetric KMS keys can contain an RSA key pair or an Elliptic Curve (ECC) key pair. The private key in an asymmetric KMS key never leaves KMS unencrypted. However, you can use the GetPublicKey operation to download the public key so it can be used outside of KMS. KMS keys with RSA key pairs can be used to encrypt or decrypt data or sign and verify messages (but not both). KMS keys with ECC key pairs can be used only to sign and verify messages.   For information about symmetric and asymmetric KMS keys, see Using Symmetric and Asymmetric KMS keys in the Key Management Service Developer Guide. To create different types of KMS keys, use the following guidance:  Asymmetric KMS keys  To create an asymmetric KMS key, use the KeySpec parameter to specify the type of key material in the KMS key. Then, use the KeyUsage parameter to determine whether the KMS key will be used to encrypt and decrypt or sign and verify. You can't change these properties after the KMS key is created.    Symmetric KMS keys  When creating a symmetric KMS key, you don't need to specify the KeySpec or KeyUsage parameters. The default value for KeySpec, SYMMETRIC_DEFAULT, and the default value for KeyUsage, ENCRYPT_DECRYPT, are the only valid values for symmetric KMS keys.     Multi-Region primary keys Imported key material  To create a multi-Region primary key in the local Amazon Web Services Region, use the MultiRegion parameter with a value of True. To create a multi-Region replica key, that is, a KMS key with the same key ID and key material as a primary key, but in a different Amazon Web Services Region, use the ReplicateKey operation. To change a replica key to a primary key, and its primary key to a replica key, use the UpdatePrimaryRegion operation. This operation supports multi-Region keys, an KMS feature that lets you create multiple interoperable KMS keys in different Amazon Web Services Regions. Because these KMS keys have the same key ID, key material, and other metadata, you can use them interchangeably to encrypt data in one Amazon Web Services Region and decrypt it in a different Amazon Web Services Region without re-encrypting the data or making a cross-Region call. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide. You can create symmetric and asymmetric multi-Region keys and multi-Region keys with imported key material. You cannot create multi-Region keys in a custom key store.     To import your own key material, begin by creating a symmetric KMS key with no key material. To do this, use the Origin parameter of CreateKey with a value of EXTERNAL. Next, use GetParametersForImport operation to get a public key and import token, and use the public key to encrypt your key material. Then, use ImportKeyMaterial with your import token to import the key material. For step-by-step instructions, see Importing Key Material in the  Key Management Service Developer Guide . You cannot import the key material into an asymmetric KMS key. To create a multi-Region primary key with imported key material, use the Origin parameter of CreateKey with a value of EXTERNAL and the MultiRegion parameter with a value of True. To create replicas of the multi-Region primary key, use the ReplicateKey operation. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide.    Custom key store  To create a symmetric KMS key in a custom key store, use the CustomKeyStoreId parameter to specify the custom key store. You must also use the Origin parameter with a value of AWS_CLOUDHSM. The CloudHSM cluster that is associated with the custom key store must have at least two active HSMs in different Availability Zones in the Amazon Web Services Region.  You cannot create an asymmetric KMS key in a custom key store. For information about custom key stores in KMS see Using Custom Key Stores in the  Key Management Service Developer Guide .    Cross-account use: No. You cannot use this operation to create a KMS key in a different Amazon Web Services account.  Required permissions: kms:CreateKey (IAM policy). To use the Tags parameter, kms:TagResource (IAM policy). For examples and information about related permissions, see Allow a user to create KMS keys in the Key Management Service Developer Guide.  Related operations:     DescribeKey     ListKeys     ScheduleKeyDeletion   
   */
  createKey(params: KMS.Types.CreateKeyRequest, callback?: (err: AWSError, data: KMS.Types.CreateKeyResponse) => void): Request<KMS.Types.CreateKeyResponse, AWSError>;
  /**
   * Creates a unique customer managed KMS key in your Amazon Web Services account and Region.  KMS is replacing the term customer master key (CMK) with KMS key and KMS key. The concept has not changed. To prevent breaking changes, KMS is keeping some variations of this term.  You can use the CreateKey operation to create symmetric or asymmetric KMS keys.    Symmetric KMS keys contain a 256-bit symmetric key that never leaves KMS unencrypted. To use the KMS key, you must call KMS. You can use a symmetric KMS key to encrypt and decrypt small amounts of data, but they are typically used to generate data keys and data keys pairs. For details, see GenerateDataKey and GenerateDataKeyPair.    Asymmetric KMS keys can contain an RSA key pair or an Elliptic Curve (ECC) key pair. The private key in an asymmetric KMS key never leaves KMS unencrypted. However, you can use the GetPublicKey operation to download the public key so it can be used outside of KMS. KMS keys with RSA key pairs can be used to encrypt or decrypt data or sign and verify messages (but not both). KMS keys with ECC key pairs can be used only to sign and verify messages.   For information about symmetric and asymmetric KMS keys, see Using Symmetric and Asymmetric KMS keys in the Key Management Service Developer Guide. To create different types of KMS keys, use the following guidance:  Asymmetric KMS keys  To create an asymmetric KMS key, use the KeySpec parameter to specify the type of key material in the KMS key. Then, use the KeyUsage parameter to determine whether the KMS key will be used to encrypt and decrypt or sign and verify. You can't change these properties after the KMS key is created.    Symmetric KMS keys  When creating a symmetric KMS key, you don't need to specify the KeySpec or KeyUsage parameters. The default value for KeySpec, SYMMETRIC_DEFAULT, and the default value for KeyUsage, ENCRYPT_DECRYPT, are the only valid values for symmetric KMS keys.     Multi-Region primary keys Imported key material  To create a multi-Region primary key in the local Amazon Web Services Region, use the MultiRegion parameter with a value of True. To create a multi-Region replica key, that is, a KMS key with the same key ID and key material as a primary key, but in a different Amazon Web Services Region, use the ReplicateKey operation. To change a replica key to a primary key, and its primary key to a replica key, use the UpdatePrimaryRegion operation. This operation supports multi-Region keys, an KMS feature that lets you create multiple interoperable KMS keys in different Amazon Web Services Regions. Because these KMS keys have the same key ID, key material, and other metadata, you can use them interchangeably to encrypt data in one Amazon Web Services Region and decrypt it in a different Amazon Web Services Region without re-encrypting the data or making a cross-Region call. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide. You can create symmetric and asymmetric multi-Region keys and multi-Region keys with imported key material. You cannot create multi-Region keys in a custom key store.     To import your own key material, begin by creating a symmetric KMS key with no key material. To do this, use the Origin parameter of CreateKey with a value of EXTERNAL. Next, use GetParametersForImport operation to get a public key and import token, and use the public key to encrypt your key material. Then, use ImportKeyMaterial with your import token to import the key material. For step-by-step instructions, see Importing Key Material in the  Key Management Service Developer Guide . You cannot import the key material into an asymmetric KMS key. To create a multi-Region primary key with imported key material, use the Origin parameter of CreateKey with a value of EXTERNAL and the MultiRegion parameter with a value of True. To create replicas of the multi-Region primary key, use the ReplicateKey operation. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide.    Custom key store  To create a symmetric KMS key in a custom key store, use the CustomKeyStoreId parameter to specify the custom key store. You must also use the Origin parameter with a value of AWS_CLOUDHSM. The CloudHSM cluster that is associated with the custom key store must have at least two active HSMs in different Availability Zones in the Amazon Web Services Region.  You cannot create an asymmetric KMS key in a custom key store. For information about custom key stores in KMS see Using Custom Key Stores in the  Key Management Service Developer Guide .    Cross-account use: No. You cannot use this operation to create a KMS key in a different Amazon Web Services account.  Required permissions: kms:CreateKey (IAM policy). To use the Tags parameter, kms:TagResource (IAM policy). For examples and information about related permissions, see Allow a user to create KMS keys in the Key Management Service Developer Guide.  Related operations:     DescribeKey     ListKeys     ScheduleKeyDeletion   
   */
  createKey(callback?: (err: AWSError, data: KMS.Types.CreateKeyResponse) => void): Request<KMS.Types.CreateKeyResponse, AWSError>;
  /**
   * Decrypts ciphertext that was encrypted by a KMS key using any of the following operations:    Encrypt     GenerateDataKey     GenerateDataKeyPair     GenerateDataKeyWithoutPlaintext     GenerateDataKeyPairWithoutPlaintext    You can use this operation to decrypt ciphertext that was encrypted under a symmetric or asymmetric KMS key. When the KMS key is asymmetric, you must specify the KMS key and the encryption algorithm that was used to encrypt the ciphertext. For information about symmetric and asymmetric KMS keys, see Using Symmetric and Asymmetric KMS keys in the Key Management Service Developer Guide. The Decrypt operation also decrypts ciphertext that was encrypted outside of KMS by the public key in an KMS asymmetric KMS key. However, it cannot decrypt ciphertext produced by other libraries, such as the Amazon Web Services Encryption SDK or Amazon S3 client-side encryption. These libraries return a ciphertext format that is incompatible with KMS. If the ciphertext was encrypted under a symmetric KMS key, the KeyId parameter is optional. KMS can get this information from metadata that it adds to the symmetric ciphertext blob. This feature adds durability to your implementation by ensuring that authorized users can decrypt ciphertext decades after it was encrypted, even if they've lost track of the key ID. However, specifying the KMS key is always recommended as a best practice. When you use the KeyId parameter to specify a KMS key, KMS only uses the KMS key you specify. If the ciphertext was encrypted under a different KMS key, the Decrypt operation fails. This practice ensures that you use the KMS key that you intend. Whenever possible, use key policies to give users permission to call the Decrypt operation on a particular KMS key, instead of using IAM policies. Otherwise, you might create an IAM user policy that gives the user Decrypt permission on all KMS keys. This user could decrypt ciphertext that was encrypted by KMS keys in other accounts if the key policy for the cross-account KMS key permits it. If you must use an IAM policy for Decrypt permissions, limit the user to particular KMS keys or particular trusted accounts. For details, see Best practices for IAM policies in the Key Management Service Developer Guide. Applications in Amazon Web Services Nitro Enclaves can call this operation by using the Amazon Web Services Nitro Enclaves Development Kit. For information about the supporting parameters, see How Amazon Web Services Nitro Enclaves use KMS in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.   Required permissions: kms:Decrypt (key policy)  Related operations:     Encrypt     GenerateDataKey     GenerateDataKeyPair     ReEncrypt   
   */
  decrypt(params: KMS.Types.DecryptRequest, callback?: (err: AWSError, data: KMS.Types.DecryptResponse) => void): Request<KMS.Types.DecryptResponse, AWSError>;
  /**
   * Decrypts ciphertext that was encrypted by a KMS key using any of the following operations:    Encrypt     GenerateDataKey     GenerateDataKeyPair     GenerateDataKeyWithoutPlaintext     GenerateDataKeyPairWithoutPlaintext    You can use this operation to decrypt ciphertext that was encrypted under a symmetric or asymmetric KMS key. When the KMS key is asymmetric, you must specify the KMS key and the encryption algorithm that was used to encrypt the ciphertext. For information about symmetric and asymmetric KMS keys, see Using Symmetric and Asymmetric KMS keys in the Key Management Service Developer Guide. The Decrypt operation also decrypts ciphertext that was encrypted outside of KMS by the public key in an KMS asymmetric KMS key. However, it cannot decrypt ciphertext produced by other libraries, such as the Amazon Web Services Encryption SDK or Amazon S3 client-side encryption. These libraries return a ciphertext format that is incompatible with KMS. If the ciphertext was encrypted under a symmetric KMS key, the KeyId parameter is optional. KMS can get this information from metadata that it adds to the symmetric ciphertext blob. This feature adds durability to your implementation by ensuring that authorized users can decrypt ciphertext decades after it was encrypted, even if they've lost track of the key ID. However, specifying the KMS key is always recommended as a best practice. When you use the KeyId parameter to specify a KMS key, KMS only uses the KMS key you specify. If the ciphertext was encrypted under a different KMS key, the Decrypt operation fails. This practice ensures that you use the KMS key that you intend. Whenever possible, use key policies to give users permission to call the Decrypt operation on a particular KMS key, instead of using IAM policies. Otherwise, you might create an IAM user policy that gives the user Decrypt permission on all KMS keys. This user could decrypt ciphertext that was encrypted by KMS keys in other accounts if the key policy for the cross-account KMS key permits it. If you must use an IAM policy for Decrypt permissions, limit the user to particular KMS keys or particular trusted accounts. For details, see Best practices for IAM policies in the Key Management Service Developer Guide. Applications in Amazon Web Services Nitro Enclaves can call this operation by using the Amazon Web Services Nitro Enclaves Development Kit. For information about the supporting parameters, see How Amazon Web Services Nitro Enclaves use KMS in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.   Required permissions: kms:Decrypt (key policy)  Related operations:     Encrypt     GenerateDataKey     GenerateDataKeyPair     ReEncrypt   
   */
  decrypt(callback?: (err: AWSError, data: KMS.Types.DecryptResponse) => void): Request<KMS.Types.DecryptResponse, AWSError>;
  /**
   * Deletes the specified alias.   Adding, deleting, or updating an alias can allow or deny permission to the KMS key. For details, see Using ABAC in KMS in the Key Management Service Developer Guide.  Because an alias is not a property of a KMS key, you can delete and change the aliases of a KMS key without affecting the KMS key. Also, aliases do not appear in the response from the DescribeKey operation. To get the aliases of all KMS keys, use the ListAliases operation.  Each KMS key can have multiple aliases. To change the alias of a KMS key, use DeleteAlias to delete the current alias and CreateAlias to create a new alias. To associate an existing alias with a different KMS key, call UpdateAlias.  Cross-account use: No. You cannot perform this operation on an alias in a different Amazon Web Services account.  Required permissions     kms:DeleteAlias on the alias (IAM policy).    kms:DeleteAlias on the KMS key (key policy).   For details, see Controlling access to aliases in the Key Management Service Developer Guide.  Related operations:     CreateAlias     ListAliases     UpdateAlias   
   */
  deleteAlias(params: KMS.Types.DeleteAliasRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified alias.   Adding, deleting, or updating an alias can allow or deny permission to the KMS key. For details, see Using ABAC in KMS in the Key Management Service Developer Guide.  Because an alias is not a property of a KMS key, you can delete and change the aliases of a KMS key without affecting the KMS key. Also, aliases do not appear in the response from the DescribeKey operation. To get the aliases of all KMS keys, use the ListAliases operation.  Each KMS key can have multiple aliases. To change the alias of a KMS key, use DeleteAlias to delete the current alias and CreateAlias to create a new alias. To associate an existing alias with a different KMS key, call UpdateAlias.  Cross-account use: No. You cannot perform this operation on an alias in a different Amazon Web Services account.  Required permissions     kms:DeleteAlias on the alias (IAM policy).    kms:DeleteAlias on the KMS key (key policy).   For details, see Controlling access to aliases in the Key Management Service Developer Guide.  Related operations:     CreateAlias     ListAliases     UpdateAlias   
   */
  deleteAlias(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a custom key store. This operation does not delete the CloudHSM cluster that is associated with the custom key store, or affect any users or keys in the cluster. The custom key store that you delete cannot contain any KMS KMS keys. Before deleting the key store, verify that you will never need to use any of the KMS keys in the key store for any cryptographic operations. Then, use ScheduleKeyDeletion to delete the KMS keys from the key store. When the scheduled waiting period expires, the ScheduleKeyDeletion operation deletes the KMS keys. Then it makes a best effort to delete the key material from the associated cluster. However, you might need to manually delete the orphaned key material from the cluster and its backups. After all KMS keys are deleted from KMS, use DisconnectCustomKeyStore to disconnect the key store from KMS. Then, you can delete the custom key store. Instead of deleting the custom key store, consider using DisconnectCustomKeyStore to disconnect it from KMS. While the key store is disconnected, you cannot create or use the KMS keys in the key store. But, you do not need to delete KMS keys and you can reconnect a disconnected custom key store at any time. If the operation succeeds, it returns a JSON object with no properties. This operation is part of the Custom Key Store feature feature in KMS, which combines the convenience and extensive integration of KMS with the isolation and control of a single-tenant key store.  Cross-account use: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.  Required permissions: kms:DeleteCustomKeyStore (IAM policy)  Related operations:     ConnectCustomKeyStore     CreateCustomKeyStore     DescribeCustomKeyStores     DisconnectCustomKeyStore     UpdateCustomKeyStore   
   */
  deleteCustomKeyStore(params: KMS.Types.DeleteCustomKeyStoreRequest, callback?: (err: AWSError, data: KMS.Types.DeleteCustomKeyStoreResponse) => void): Request<KMS.Types.DeleteCustomKeyStoreResponse, AWSError>;
  /**
   * Deletes a custom key store. This operation does not delete the CloudHSM cluster that is associated with the custom key store, or affect any users or keys in the cluster. The custom key store that you delete cannot contain any KMS KMS keys. Before deleting the key store, verify that you will never need to use any of the KMS keys in the key store for any cryptographic operations. Then, use ScheduleKeyDeletion to delete the KMS keys from the key store. When the scheduled waiting period expires, the ScheduleKeyDeletion operation deletes the KMS keys. Then it makes a best effort to delete the key material from the associated cluster. However, you might need to manually delete the orphaned key material from the cluster and its backups. After all KMS keys are deleted from KMS, use DisconnectCustomKeyStore to disconnect the key store from KMS. Then, you can delete the custom key store. Instead of deleting the custom key store, consider using DisconnectCustomKeyStore to disconnect it from KMS. While the key store is disconnected, you cannot create or use the KMS keys in the key store. But, you do not need to delete KMS keys and you can reconnect a disconnected custom key store at any time. If the operation succeeds, it returns a JSON object with no properties. This operation is part of the Custom Key Store feature feature in KMS, which combines the convenience and extensive integration of KMS with the isolation and control of a single-tenant key store.  Cross-account use: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.  Required permissions: kms:DeleteCustomKeyStore (IAM policy)  Related operations:     ConnectCustomKeyStore     CreateCustomKeyStore     DescribeCustomKeyStores     DisconnectCustomKeyStore     UpdateCustomKeyStore   
   */
  deleteCustomKeyStore(callback?: (err: AWSError, data: KMS.Types.DeleteCustomKeyStoreResponse) => void): Request<KMS.Types.DeleteCustomKeyStoreResponse, AWSError>;
  /**
   * Deletes key material that you previously imported. This operation makes the specified KMS key unusable. For more information about importing key material into KMS, see Importing Key Material in the Key Management Service Developer Guide.  When the specified KMS key is in the PendingDeletion state, this operation does not change the KMS key's state. Otherwise, it changes the KMS key's state to PendingImport. After you delete key material, you can use ImportKeyMaterial to reimport the same key material into the KMS key. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:DeleteImportedKeyMaterial (key policy)  Related operations:     GetParametersForImport     ImportKeyMaterial   
   */
  deleteImportedKeyMaterial(params: KMS.Types.DeleteImportedKeyMaterialRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes key material that you previously imported. This operation makes the specified KMS key unusable. For more information about importing key material into KMS, see Importing Key Material in the Key Management Service Developer Guide.  When the specified KMS key is in the PendingDeletion state, this operation does not change the KMS key's state. Otherwise, it changes the KMS key's state to PendingImport. After you delete key material, you can use ImportKeyMaterial to reimport the same key material into the KMS key. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:DeleteImportedKeyMaterial (key policy)  Related operations:     GetParametersForImport     ImportKeyMaterial   
   */
  deleteImportedKeyMaterial(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets information about custom key stores in the account and Region. This operation is part of the Custom Key Store feature feature in KMS, which combines the convenience and extensive integration of KMS with the isolation and control of a single-tenant key store. By default, this operation returns information about all custom key stores in the account and Region. To get only information about a particular custom key store, use either the CustomKeyStoreName or CustomKeyStoreId parameter (but not both). To determine whether the custom key store is connected to its CloudHSM cluster, use the ConnectionState element in the response. If an attempt to connect the custom key store failed, the ConnectionState value is FAILED and the ConnectionErrorCode element in the response indicates the cause of the failure. For help interpreting the ConnectionErrorCode, see CustomKeyStoresListEntry. Custom key stores have a DISCONNECTED connection state if the key store has never been connected or you use the DisconnectCustomKeyStore operation to disconnect it. If your custom key store state is CONNECTED but you are having trouble using it, make sure that its associated CloudHSM cluster is active and contains the minimum number of HSMs required for the operation, if any.  For help repairing your custom key store, see the Troubleshooting Custom Key Stores topic in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.  Required permissions: kms:DescribeCustomKeyStores (IAM policy)  Related operations:     ConnectCustomKeyStore     CreateCustomKeyStore     DeleteCustomKeyStore     DisconnectCustomKeyStore     UpdateCustomKeyStore   
   */
  describeCustomKeyStores(params: KMS.Types.DescribeCustomKeyStoresRequest, callback?: (err: AWSError, data: KMS.Types.DescribeCustomKeyStoresResponse) => void): Request<KMS.Types.DescribeCustomKeyStoresResponse, AWSError>;
  /**
   * Gets information about custom key stores in the account and Region. This operation is part of the Custom Key Store feature feature in KMS, which combines the convenience and extensive integration of KMS with the isolation and control of a single-tenant key store. By default, this operation returns information about all custom key stores in the account and Region. To get only information about a particular custom key store, use either the CustomKeyStoreName or CustomKeyStoreId parameter (but not both). To determine whether the custom key store is connected to its CloudHSM cluster, use the ConnectionState element in the response. If an attempt to connect the custom key store failed, the ConnectionState value is FAILED and the ConnectionErrorCode element in the response indicates the cause of the failure. For help interpreting the ConnectionErrorCode, see CustomKeyStoresListEntry. Custom key stores have a DISCONNECTED connection state if the key store has never been connected or you use the DisconnectCustomKeyStore operation to disconnect it. If your custom key store state is CONNECTED but you are having trouble using it, make sure that its associated CloudHSM cluster is active and contains the minimum number of HSMs required for the operation, if any.  For help repairing your custom key store, see the Troubleshooting Custom Key Stores topic in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.  Required permissions: kms:DescribeCustomKeyStores (IAM policy)  Related operations:     ConnectCustomKeyStore     CreateCustomKeyStore     DeleteCustomKeyStore     DisconnectCustomKeyStore     UpdateCustomKeyStore   
   */
  describeCustomKeyStores(callback?: (err: AWSError, data: KMS.Types.DescribeCustomKeyStoresResponse) => void): Request<KMS.Types.DescribeCustomKeyStoresResponse, AWSError>;
  /**
   * Provides detailed information about a KMS key. You can run DescribeKey on a customer managed key or an Amazon Web Services managed key. This detailed information includes the key ARN, creation date (and deletion date, if applicable), the key state, and the origin and expiration date (if any) of the key material. It includes fields, like KeySpec, that help you distinguish symmetric from asymmetric KMS keys. It also provides information that is particularly important to asymmetric keys, such as the key usage (encryption or signing) and the encryption algorithms or signing algorithms that the KMS key supports. For KMS keys in custom key stores, it includes information about the custom key store, such as the key store ID and the CloudHSM cluster ID. For multi-Region keys, it displays the primary key and all related replica keys.   DescribeKey does not return the following information:   Aliases associated with the KMS key. To get this information, use ListAliases.   Whether automatic key rotation is enabled on the KMS key. To get this information, use GetKeyRotationStatus. Also, some key states prevent a KMS key from being automatically rotated. For details, see How Automatic Key Rotation Works in Key Management Service Developer Guide.   Tags on the KMS key. To get this information, use ListResourceTags.   Key policies and grants on the KMS key. To get this information, use GetKeyPolicy and ListGrants.   If you call the DescribeKey operation on a predefined Amazon Web Services alias, that is, an Amazon Web Services alias with no key ID, KMS creates an Amazon Web Services managed key. Then, it associates the alias with the new KMS key, and returns the KeyId and Arn of the new KMS key in the response.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:DescribeKey (key policy)  Related operations:     GetKeyPolicy     GetKeyRotationStatus     ListAliases     ListGrants     ListKeys     ListResourceTags     ListRetirableGrants   
   */
  describeKey(params: KMS.Types.DescribeKeyRequest, callback?: (err: AWSError, data: KMS.Types.DescribeKeyResponse) => void): Request<KMS.Types.DescribeKeyResponse, AWSError>;
  /**
   * Provides detailed information about a KMS key. You can run DescribeKey on a customer managed key or an Amazon Web Services managed key. This detailed information includes the key ARN, creation date (and deletion date, if applicable), the key state, and the origin and expiration date (if any) of the key material. It includes fields, like KeySpec, that help you distinguish symmetric from asymmetric KMS keys. It also provides information that is particularly important to asymmetric keys, such as the key usage (encryption or signing) and the encryption algorithms or signing algorithms that the KMS key supports. For KMS keys in custom key stores, it includes information about the custom key store, such as the key store ID and the CloudHSM cluster ID. For multi-Region keys, it displays the primary key and all related replica keys.   DescribeKey does not return the following information:   Aliases associated with the KMS key. To get this information, use ListAliases.   Whether automatic key rotation is enabled on the KMS key. To get this information, use GetKeyRotationStatus. Also, some key states prevent a KMS key from being automatically rotated. For details, see How Automatic Key Rotation Works in Key Management Service Developer Guide.   Tags on the KMS key. To get this information, use ListResourceTags.   Key policies and grants on the KMS key. To get this information, use GetKeyPolicy and ListGrants.   If you call the DescribeKey operation on a predefined Amazon Web Services alias, that is, an Amazon Web Services alias with no key ID, KMS creates an Amazon Web Services managed key. Then, it associates the alias with the new KMS key, and returns the KeyId and Arn of the new KMS key in the response.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:DescribeKey (key policy)  Related operations:     GetKeyPolicy     GetKeyRotationStatus     ListAliases     ListGrants     ListKeys     ListResourceTags     ListRetirableGrants   
   */
  describeKey(callback?: (err: AWSError, data: KMS.Types.DescribeKeyResponse) => void): Request<KMS.Types.DescribeKeyResponse, AWSError>;
  /**
   * Sets the state of a KMS key to disabled. This change temporarily prevents use of the KMS key for cryptographic operations.  For more information about how key state affects the use of a KMS key, see Key state: Effect on your KMS key in the  Key Management Service Developer Guide . The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:DisableKey (key policy)  Related operations: EnableKey 
   */
  disableKey(params: KMS.Types.DisableKeyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the state of a KMS key to disabled. This change temporarily prevents use of the KMS key for cryptographic operations.  For more information about how key state affects the use of a KMS key, see Key state: Effect on your KMS key in the  Key Management Service Developer Guide . The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:DisableKey (key policy)  Related operations: EnableKey 
   */
  disableKey(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disables automatic rotation of the key material for the specified symmetric KMS key.  You cannot enable automatic rotation of asymmetric KMS keys, KMS keys with imported key material, or KMS keys in a custom key store. To enable or disable automatic rotation of a set of related multi-Region keys, set the property on the primary key.  The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:DisableKeyRotation (key policy)  Related operations:     EnableKeyRotation     GetKeyRotationStatus   
   */
  disableKeyRotation(params: KMS.Types.DisableKeyRotationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disables automatic rotation of the key material for the specified symmetric KMS key.  You cannot enable automatic rotation of asymmetric KMS keys, KMS keys with imported key material, or KMS keys in a custom key store. To enable or disable automatic rotation of a set of related multi-Region keys, set the property on the primary key.  The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:DisableKeyRotation (key policy)  Related operations:     EnableKeyRotation     GetKeyRotationStatus   
   */
  disableKeyRotation(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disconnects the custom key store from its associated CloudHSM cluster. While a custom key store is disconnected, you can manage the custom key store and its KMS keys, but you cannot create or use KMS keys in the custom key store. You can reconnect the custom key store at any time.  While a custom key store is disconnected, all attempts to create KMS keys in the custom key store or to use existing KMS keys in cryptographic operations will fail. This action can prevent users from storing and accessing sensitive data.   To find the connection state of a custom key store, use the DescribeCustomKeyStores operation. To reconnect a custom key store, use the ConnectCustomKeyStore operation. If the operation succeeds, it returns a JSON object with no properties. This operation is part of the Custom Key Store feature feature in KMS, which combines the convenience and extensive integration of KMS with the isolation and control of a single-tenant key store.  Cross-account use: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.  Required permissions: kms:DisconnectCustomKeyStore (IAM policy)  Related operations:     ConnectCustomKeyStore     CreateCustomKeyStore     DeleteCustomKeyStore     DescribeCustomKeyStores     UpdateCustomKeyStore   
   */
  disconnectCustomKeyStore(params: KMS.Types.DisconnectCustomKeyStoreRequest, callback?: (err: AWSError, data: KMS.Types.DisconnectCustomKeyStoreResponse) => void): Request<KMS.Types.DisconnectCustomKeyStoreResponse, AWSError>;
  /**
   * Disconnects the custom key store from its associated CloudHSM cluster. While a custom key store is disconnected, you can manage the custom key store and its KMS keys, but you cannot create or use KMS keys in the custom key store. You can reconnect the custom key store at any time.  While a custom key store is disconnected, all attempts to create KMS keys in the custom key store or to use existing KMS keys in cryptographic operations will fail. This action can prevent users from storing and accessing sensitive data.   To find the connection state of a custom key store, use the DescribeCustomKeyStores operation. To reconnect a custom key store, use the ConnectCustomKeyStore operation. If the operation succeeds, it returns a JSON object with no properties. This operation is part of the Custom Key Store feature feature in KMS, which combines the convenience and extensive integration of KMS with the isolation and control of a single-tenant key store.  Cross-account use: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.  Required permissions: kms:DisconnectCustomKeyStore (IAM policy)  Related operations:     ConnectCustomKeyStore     CreateCustomKeyStore     DeleteCustomKeyStore     DescribeCustomKeyStores     UpdateCustomKeyStore   
   */
  disconnectCustomKeyStore(callback?: (err: AWSError, data: KMS.Types.DisconnectCustomKeyStoreResponse) => void): Request<KMS.Types.DisconnectCustomKeyStoreResponse, AWSError>;
  /**
   * Sets the key state of a KMS key to enabled. This allows you to use the KMS key for cryptographic operations.  The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:EnableKey (key policy)  Related operations: DisableKey 
   */
  enableKey(params: KMS.Types.EnableKeyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the key state of a KMS key to enabled. This allows you to use the KMS key for cryptographic operations.  The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:EnableKey (key policy)  Related operations: DisableKey 
   */
  enableKey(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables automatic rotation of the key material for the specified symmetric KMS key. You cannot enable automatic rotation of asymmetric KMS keys, KMS keys with imported key material, or KMS keys in a custom key store. To enable or disable automatic rotation of a set of related multi-Region keys, set the property on the primary key. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:EnableKeyRotation (key policy)  Related operations:     DisableKeyRotation     GetKeyRotationStatus   
   */
  enableKeyRotation(params: KMS.Types.EnableKeyRotationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables automatic rotation of the key material for the specified symmetric KMS key. You cannot enable automatic rotation of asymmetric KMS keys, KMS keys with imported key material, or KMS keys in a custom key store. To enable or disable automatic rotation of a set of related multi-Region keys, set the property on the primary key. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:EnableKeyRotation (key policy)  Related operations:     DisableKeyRotation     GetKeyRotationStatus   
   */
  enableKeyRotation(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Encrypts plaintext into ciphertext by using a KMS key. The Encrypt operation has two primary use cases:   You can encrypt small amounts of arbitrary data, such as a personal identifier or database password, or other sensitive information.    You can use the Encrypt operation to move encrypted data from one Amazon Web Services Region to another. For example, in Region A, generate a data key and use the plaintext key to encrypt your data. Then, in Region A, use the Encrypt operation to encrypt the plaintext data key under a KMS key in Region B. Now, you can move the encrypted data and the encrypted data key to Region B. When necessary, you can decrypt the encrypted data key and the encrypted data entirely within in Region B.   You don't need to use the Encrypt operation to encrypt a data key. The GenerateDataKey and GenerateDataKeyPair operations return a plaintext data key and an encrypted copy of that data key. When you encrypt data, you must specify a symmetric or asymmetric KMS key to use in the encryption operation. The KMS key must have a KeyUsage value of ENCRYPT_DECRYPT. To find the KeyUsage of a KMS key, use the DescribeKey operation.  If you use a symmetric KMS key, you can use an encryption context to add additional security to your encryption operation. If you specify an EncryptionContext when encrypting data, you must specify the same encryption context (a case-sensitive exact match) when decrypting the data. Otherwise, the request to decrypt fails with an InvalidCiphertextException. For more information, see Encryption Context in the Key Management Service Developer Guide. If you specify an asymmetric KMS key, you must also specify the encryption algorithm. The algorithm must be compatible with the KMS key type.  When you use an asymmetric KMS key to encrypt or reencrypt data, be sure to record the KMS key and encryption algorithm that you choose. You will be required to provide the same KMS key and encryption algorithm when you decrypt the data. If the KMS key and algorithm do not match the values used to encrypt the data, the decrypt operation fails. You are not required to supply the key ID and encryption algorithm when you decrypt with symmetric KMS keys because KMS stores this information in the ciphertext blob. KMS cannot store metadata in ciphertext generated with asymmetric keys. The standard format for asymmetric key ciphertext does not include configurable fields.  The maximum size of the data that you can encrypt varies with the type of KMS key and the encryption algorithm that you choose.   Symmetric KMS keys    SYMMETRIC_DEFAULT: 4096 bytes      RSA_2048     RSAES_OAEP_SHA_1: 214 bytes    RSAES_OAEP_SHA_256: 190 bytes      RSA_3072     RSAES_OAEP_SHA_1: 342 bytes    RSAES_OAEP_SHA_256: 318 bytes      RSA_4096     RSAES_OAEP_SHA_1: 470 bytes    RSAES_OAEP_SHA_256: 446 bytes     The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:Encrypt (key policy)  Related operations:     Decrypt     GenerateDataKey     GenerateDataKeyPair   
   */
  encrypt(params: KMS.Types.EncryptRequest, callback?: (err: AWSError, data: KMS.Types.EncryptResponse) => void): Request<KMS.Types.EncryptResponse, AWSError>;
  /**
   * Encrypts plaintext into ciphertext by using a KMS key. The Encrypt operation has two primary use cases:   You can encrypt small amounts of arbitrary data, such as a personal identifier or database password, or other sensitive information.    You can use the Encrypt operation to move encrypted data from one Amazon Web Services Region to another. For example, in Region A, generate a data key and use the plaintext key to encrypt your data. Then, in Region A, use the Encrypt operation to encrypt the plaintext data key under a KMS key in Region B. Now, you can move the encrypted data and the encrypted data key to Region B. When necessary, you can decrypt the encrypted data key and the encrypted data entirely within in Region B.   You don't need to use the Encrypt operation to encrypt a data key. The GenerateDataKey and GenerateDataKeyPair operations return a plaintext data key and an encrypted copy of that data key. When you encrypt data, you must specify a symmetric or asymmetric KMS key to use in the encryption operation. The KMS key must have a KeyUsage value of ENCRYPT_DECRYPT. To find the KeyUsage of a KMS key, use the DescribeKey operation.  If you use a symmetric KMS key, you can use an encryption context to add additional security to your encryption operation. If you specify an EncryptionContext when encrypting data, you must specify the same encryption context (a case-sensitive exact match) when decrypting the data. Otherwise, the request to decrypt fails with an InvalidCiphertextException. For more information, see Encryption Context in the Key Management Service Developer Guide. If you specify an asymmetric KMS key, you must also specify the encryption algorithm. The algorithm must be compatible with the KMS key type.  When you use an asymmetric KMS key to encrypt or reencrypt data, be sure to record the KMS key and encryption algorithm that you choose. You will be required to provide the same KMS key and encryption algorithm when you decrypt the data. If the KMS key and algorithm do not match the values used to encrypt the data, the decrypt operation fails. You are not required to supply the key ID and encryption algorithm when you decrypt with symmetric KMS keys because KMS stores this information in the ciphertext blob. KMS cannot store metadata in ciphertext generated with asymmetric keys. The standard format for asymmetric key ciphertext does not include configurable fields.  The maximum size of the data that you can encrypt varies with the type of KMS key and the encryption algorithm that you choose.   Symmetric KMS keys    SYMMETRIC_DEFAULT: 4096 bytes      RSA_2048     RSAES_OAEP_SHA_1: 214 bytes    RSAES_OAEP_SHA_256: 190 bytes      RSA_3072     RSAES_OAEP_SHA_1: 342 bytes    RSAES_OAEP_SHA_256: 318 bytes      RSA_4096     RSAES_OAEP_SHA_1: 470 bytes    RSAES_OAEP_SHA_256: 446 bytes     The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:Encrypt (key policy)  Related operations:     Decrypt     GenerateDataKey     GenerateDataKeyPair   
   */
  encrypt(callback?: (err: AWSError, data: KMS.Types.EncryptResponse) => void): Request<KMS.Types.EncryptResponse, AWSError>;
  /**
   * Generates a unique symmetric data key for client-side encryption. This operation returns a plaintext copy of the data key and a copy that is encrypted under a KMS key that you specify. You can use the plaintext key to encrypt your data outside of KMS and store the encrypted data key with the encrypted data.  GenerateDataKey returns a unique data key for each request. The bytes in the plaintext key are not related to the caller or the KMS key. To generate a data key, specify the symmetric KMS key that will be used to encrypt the data key. You cannot use an asymmetric KMS key to generate data keys. To get the type of your KMS key, use the DescribeKey operation. You must also specify the length of the data key. Use either the KeySpec or NumberOfBytes parameters (but not both). For 128-bit and 256-bit data keys, use the KeySpec parameter.  To get only an encrypted copy of the data key, use GenerateDataKeyWithoutPlaintext. To generate an asymmetric data key pair, use the GenerateDataKeyPair or GenerateDataKeyPairWithoutPlaintext operation. To get a cryptographically secure random byte string, use GenerateRandom. You can use the optional encryption context to add additional security to the encryption operation. If you specify an EncryptionContext, you must specify the same encryption context (a case-sensitive exact match) when decrypting the encrypted data key. Otherwise, the request to decrypt fails with an InvalidCiphertextException. For more information, see Encryption Context in the Key Management Service Developer Guide. Applications in Amazon Web Services Nitro Enclaves can call this operation by using the Amazon Web Services Nitro Enclaves Development Kit. For information about the supporting parameters, see How Amazon Web Services Nitro Enclaves use KMS in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  How to use your data key  We recommend that you use the following pattern to encrypt data locally in your application. You can write your own code or use a client-side encryption library, such as the Amazon Web Services Encryption SDK, the Amazon DynamoDB Encryption Client, or Amazon S3 client-side encryption to do these tasks for you. To encrypt data outside of KMS:   Use the GenerateDataKey operation to get a data key.   Use the plaintext data key (in the Plaintext field of the response) to encrypt your data outside of KMS. Then erase the plaintext data key from memory.   Store the encrypted data key (in the CiphertextBlob field of the response) with the encrypted data.   To decrypt data outside of KMS:   Use the Decrypt operation to decrypt the encrypted data key. The operation returns a plaintext copy of the data key.   Use the plaintext data key to decrypt data outside of KMS, then erase the plaintext data key from memory.    Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:GenerateDataKey (key policy)  Related operations:     Decrypt     Encrypt     GenerateDataKeyPair     GenerateDataKeyPairWithoutPlaintext     GenerateDataKeyWithoutPlaintext   
   */
  generateDataKey(params: KMS.Types.GenerateDataKeyRequest, callback?: (err: AWSError, data: KMS.Types.GenerateDataKeyResponse) => void): Request<KMS.Types.GenerateDataKeyResponse, AWSError>;
  /**
   * Generates a unique symmetric data key for client-side encryption. This operation returns a plaintext copy of the data key and a copy that is encrypted under a KMS key that you specify. You can use the plaintext key to encrypt your data outside of KMS and store the encrypted data key with the encrypted data.  GenerateDataKey returns a unique data key for each request. The bytes in the plaintext key are not related to the caller or the KMS key. To generate a data key, specify the symmetric KMS key that will be used to encrypt the data key. You cannot use an asymmetric KMS key to generate data keys. To get the type of your KMS key, use the DescribeKey operation. You must also specify the length of the data key. Use either the KeySpec or NumberOfBytes parameters (but not both). For 128-bit and 256-bit data keys, use the KeySpec parameter.  To get only an encrypted copy of the data key, use GenerateDataKeyWithoutPlaintext. To generate an asymmetric data key pair, use the GenerateDataKeyPair or GenerateDataKeyPairWithoutPlaintext operation. To get a cryptographically secure random byte string, use GenerateRandom. You can use the optional encryption context to add additional security to the encryption operation. If you specify an EncryptionContext, you must specify the same encryption context (a case-sensitive exact match) when decrypting the encrypted data key. Otherwise, the request to decrypt fails with an InvalidCiphertextException. For more information, see Encryption Context in the Key Management Service Developer Guide. Applications in Amazon Web Services Nitro Enclaves can call this operation by using the Amazon Web Services Nitro Enclaves Development Kit. For information about the supporting parameters, see How Amazon Web Services Nitro Enclaves use KMS in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  How to use your data key  We recommend that you use the following pattern to encrypt data locally in your application. You can write your own code or use a client-side encryption library, such as the Amazon Web Services Encryption SDK, the Amazon DynamoDB Encryption Client, or Amazon S3 client-side encryption to do these tasks for you. To encrypt data outside of KMS:   Use the GenerateDataKey operation to get a data key.   Use the plaintext data key (in the Plaintext field of the response) to encrypt your data outside of KMS. Then erase the plaintext data key from memory.   Store the encrypted data key (in the CiphertextBlob field of the response) with the encrypted data.   To decrypt data outside of KMS:   Use the Decrypt operation to decrypt the encrypted data key. The operation returns a plaintext copy of the data key.   Use the plaintext data key to decrypt data outside of KMS, then erase the plaintext data key from memory.    Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:GenerateDataKey (key policy)  Related operations:     Decrypt     Encrypt     GenerateDataKeyPair     GenerateDataKeyPairWithoutPlaintext     GenerateDataKeyWithoutPlaintext   
   */
  generateDataKey(callback?: (err: AWSError, data: KMS.Types.GenerateDataKeyResponse) => void): Request<KMS.Types.GenerateDataKeyResponse, AWSError>;
  /**
   * Generates a unique asymmetric data key pair. The GenerateDataKeyPair operation returns a plaintext public key, a plaintext private key, and a copy of the private key that is encrypted under the symmetric KMS key you specify. You can use the data key pair to perform asymmetric cryptography and implement digital signatures outside of KMS. You can use the public key that GenerateDataKeyPair returns to encrypt data or verify a signature outside of KMS. Then, store the encrypted private key with the data. When you are ready to decrypt data or sign a message, you can use the Decrypt operation to decrypt the encrypted private key. To generate a data key pair, you must specify a symmetric KMS key to encrypt the private key in a data key pair. You cannot use an asymmetric KMS key or a KMS key in a custom key store. To get the type and origin of your KMS key, use the DescribeKey operation.  Use the KeyPairSpec parameter to choose an RSA or Elliptic Curve (ECC) data key pair. KMS recommends that your use ECC key pairs for signing, and use RSA key pairs for either encryption or signing, but not both. However, KMS cannot enforce any restrictions on the use of data key pairs outside of KMS. If you are using the data key pair to encrypt data, or for any operation where you don't immediately need a private key, consider using the GenerateDataKeyPairWithoutPlaintext operation. GenerateDataKeyPairWithoutPlaintext returns a plaintext public key and an encrypted private key, but omits the plaintext private key that you need only to decrypt ciphertext or sign a message. Later, when you need to decrypt the data or sign a message, use the Decrypt operation to decrypt the encrypted private key in the data key pair.  GenerateDataKeyPair returns a unique data key pair for each request. The bytes in the keys are not related to the caller or the KMS key that is used to encrypt the private key. The public key is a DER-encoded X.509 SubjectPublicKeyInfo, as specified in RFC 5280. The private key is a DER-encoded PKCS8 PrivateKeyInfo, as specified in RFC 5958. You can use the optional encryption context to add additional security to the encryption operation. If you specify an EncryptionContext, you must specify the same encryption context (a case-sensitive exact match) when decrypting the encrypted data key. Otherwise, the request to decrypt fails with an InvalidCiphertextException. For more information, see Encryption Context in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:GenerateDataKeyPair (key policy)  Related operations:     Decrypt     Encrypt     GenerateDataKey     GenerateDataKeyPairWithoutPlaintext     GenerateDataKeyWithoutPlaintext   
   */
  generateDataKeyPair(params: KMS.Types.GenerateDataKeyPairRequest, callback?: (err: AWSError, data: KMS.Types.GenerateDataKeyPairResponse) => void): Request<KMS.Types.GenerateDataKeyPairResponse, AWSError>;
  /**
   * Generates a unique asymmetric data key pair. The GenerateDataKeyPair operation returns a plaintext public key, a plaintext private key, and a copy of the private key that is encrypted under the symmetric KMS key you specify. You can use the data key pair to perform asymmetric cryptography and implement digital signatures outside of KMS. You can use the public key that GenerateDataKeyPair returns to encrypt data or verify a signature outside of KMS. Then, store the encrypted private key with the data. When you are ready to decrypt data or sign a message, you can use the Decrypt operation to decrypt the encrypted private key. To generate a data key pair, you must specify a symmetric KMS key to encrypt the private key in a data key pair. You cannot use an asymmetric KMS key or a KMS key in a custom key store. To get the type and origin of your KMS key, use the DescribeKey operation.  Use the KeyPairSpec parameter to choose an RSA or Elliptic Curve (ECC) data key pair. KMS recommends that your use ECC key pairs for signing, and use RSA key pairs for either encryption or signing, but not both. However, KMS cannot enforce any restrictions on the use of data key pairs outside of KMS. If you are using the data key pair to encrypt data, or for any operation where you don't immediately need a private key, consider using the GenerateDataKeyPairWithoutPlaintext operation. GenerateDataKeyPairWithoutPlaintext returns a plaintext public key and an encrypted private key, but omits the plaintext private key that you need only to decrypt ciphertext or sign a message. Later, when you need to decrypt the data or sign a message, use the Decrypt operation to decrypt the encrypted private key in the data key pair.  GenerateDataKeyPair returns a unique data key pair for each request. The bytes in the keys are not related to the caller or the KMS key that is used to encrypt the private key. The public key is a DER-encoded X.509 SubjectPublicKeyInfo, as specified in RFC 5280. The private key is a DER-encoded PKCS8 PrivateKeyInfo, as specified in RFC 5958. You can use the optional encryption context to add additional security to the encryption operation. If you specify an EncryptionContext, you must specify the same encryption context (a case-sensitive exact match) when decrypting the encrypted data key. Otherwise, the request to decrypt fails with an InvalidCiphertextException. For more information, see Encryption Context in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:GenerateDataKeyPair (key policy)  Related operations:     Decrypt     Encrypt     GenerateDataKey     GenerateDataKeyPairWithoutPlaintext     GenerateDataKeyWithoutPlaintext   
   */
  generateDataKeyPair(callback?: (err: AWSError, data: KMS.Types.GenerateDataKeyPairResponse) => void): Request<KMS.Types.GenerateDataKeyPairResponse, AWSError>;
  /**
   * Generates a unique asymmetric data key pair. The GenerateDataKeyPairWithoutPlaintext operation returns a plaintext public key and a copy of the private key that is encrypted under the symmetric KMS key you specify. Unlike GenerateDataKeyPair, this operation does not return a plaintext private key.  You can use the public key that GenerateDataKeyPairWithoutPlaintext returns to encrypt data or verify a signature outside of KMS. Then, store the encrypted private key with the data. When you are ready to decrypt data or sign a message, you can use the Decrypt operation to decrypt the encrypted private key. To generate a data key pair, you must specify a symmetric KMS key to encrypt the private key in a data key pair. You cannot use an asymmetric KMS key or a KMS key in a custom key store. To get the type and origin of your KMS key, use the DescribeKey operation.  Use the KeyPairSpec parameter to choose an RSA or Elliptic Curve (ECC) data key pair. KMS recommends that your use ECC key pairs for signing, and use RSA key pairs for either encryption or signing, but not both. However, KMS cannot enforce any restrictions on the use of data key pairs outside of KMS.  GenerateDataKeyPairWithoutPlaintext returns a unique data key pair for each request. The bytes in the key are not related to the caller or KMS key that is used to encrypt the private key. The public key is a DER-encoded X.509 SubjectPublicKeyInfo, as specified in RFC 5280. You can use the optional encryption context to add additional security to the encryption operation. If you specify an EncryptionContext, you must specify the same encryption context (a case-sensitive exact match) when decrypting the encrypted data key. Otherwise, the request to decrypt fails with an InvalidCiphertextException. For more information, see Encryption Context in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:GenerateDataKeyPairWithoutPlaintext (key policy)  Related operations:     Decrypt     Encrypt     GenerateDataKey     GenerateDataKeyPair     GenerateDataKeyWithoutPlaintext   
   */
  generateDataKeyPairWithoutPlaintext(params: KMS.Types.GenerateDataKeyPairWithoutPlaintextRequest, callback?: (err: AWSError, data: KMS.Types.GenerateDataKeyPairWithoutPlaintextResponse) => void): Request<KMS.Types.GenerateDataKeyPairWithoutPlaintextResponse, AWSError>;
  /**
   * Generates a unique asymmetric data key pair. The GenerateDataKeyPairWithoutPlaintext operation returns a plaintext public key and a copy of the private key that is encrypted under the symmetric KMS key you specify. Unlike GenerateDataKeyPair, this operation does not return a plaintext private key.  You can use the public key that GenerateDataKeyPairWithoutPlaintext returns to encrypt data or verify a signature outside of KMS. Then, store the encrypted private key with the data. When you are ready to decrypt data or sign a message, you can use the Decrypt operation to decrypt the encrypted private key. To generate a data key pair, you must specify a symmetric KMS key to encrypt the private key in a data key pair. You cannot use an asymmetric KMS key or a KMS key in a custom key store. To get the type and origin of your KMS key, use the DescribeKey operation.  Use the KeyPairSpec parameter to choose an RSA or Elliptic Curve (ECC) data key pair. KMS recommends that your use ECC key pairs for signing, and use RSA key pairs for either encryption or signing, but not both. However, KMS cannot enforce any restrictions on the use of data key pairs outside of KMS.  GenerateDataKeyPairWithoutPlaintext returns a unique data key pair for each request. The bytes in the key are not related to the caller or KMS key that is used to encrypt the private key. The public key is a DER-encoded X.509 SubjectPublicKeyInfo, as specified in RFC 5280. You can use the optional encryption context to add additional security to the encryption operation. If you specify an EncryptionContext, you must specify the same encryption context (a case-sensitive exact match) when decrypting the encrypted data key. Otherwise, the request to decrypt fails with an InvalidCiphertextException. For more information, see Encryption Context in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:GenerateDataKeyPairWithoutPlaintext (key policy)  Related operations:     Decrypt     Encrypt     GenerateDataKey     GenerateDataKeyPair     GenerateDataKeyWithoutPlaintext   
   */
  generateDataKeyPairWithoutPlaintext(callback?: (err: AWSError, data: KMS.Types.GenerateDataKeyPairWithoutPlaintextResponse) => void): Request<KMS.Types.GenerateDataKeyPairWithoutPlaintextResponse, AWSError>;
  /**
   * Generates a unique symmetric data key. This operation returns a data key that is encrypted under a KMS key that you specify. To request an asymmetric data key pair, use the GenerateDataKeyPair or GenerateDataKeyPairWithoutPlaintext operations.  GenerateDataKeyWithoutPlaintext is identical to the GenerateDataKey operation except that returns only the encrypted copy of the data key. This operation is useful for systems that need to encrypt data at some point, but not immediately. When you need to encrypt the data, you call the Decrypt operation on the encrypted copy of the key.  It's also useful in distributed systems with different levels of trust. For example, you might store encrypted data in containers. One component of your system creates new containers and stores an encrypted data key with each container. Then, a different component puts the data into the containers. That component first decrypts the data key, uses the plaintext data key to encrypt data, puts the encrypted data into the container, and then destroys the plaintext data key. In this system, the component that creates the containers never sees the plaintext data key.  GenerateDataKeyWithoutPlaintext returns a unique data key for each request. The bytes in the keys are not related to the caller or KMS key that is used to encrypt the private key. To generate a data key, you must specify the symmetric KMS key that is used to encrypt the data key. You cannot use an asymmetric KMS key to generate a data key. To get the type of your KMS key, use the DescribeKey operation. If the operation succeeds, you will find the encrypted copy of the data key in the CiphertextBlob field. You can use the optional encryption context to add additional security to the encryption operation. If you specify an EncryptionContext, you must specify the same encryption context (a case-sensitive exact match) when decrypting the encrypted data key. Otherwise, the request to decrypt fails with an InvalidCiphertextException. For more information, see Encryption Context in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:GenerateDataKeyWithoutPlaintext (key policy)  Related operations:     Decrypt     Encrypt     GenerateDataKey     GenerateDataKeyPair     GenerateDataKeyPairWithoutPlaintext   
   */
  generateDataKeyWithoutPlaintext(params: KMS.Types.GenerateDataKeyWithoutPlaintextRequest, callback?: (err: AWSError, data: KMS.Types.GenerateDataKeyWithoutPlaintextResponse) => void): Request<KMS.Types.GenerateDataKeyWithoutPlaintextResponse, AWSError>;
  /**
   * Generates a unique symmetric data key. This operation returns a data key that is encrypted under a KMS key that you specify. To request an asymmetric data key pair, use the GenerateDataKeyPair or GenerateDataKeyPairWithoutPlaintext operations.  GenerateDataKeyWithoutPlaintext is identical to the GenerateDataKey operation except that returns only the encrypted copy of the data key. This operation is useful for systems that need to encrypt data at some point, but not immediately. When you need to encrypt the data, you call the Decrypt operation on the encrypted copy of the key.  It's also useful in distributed systems with different levels of trust. For example, you might store encrypted data in containers. One component of your system creates new containers and stores an encrypted data key with each container. Then, a different component puts the data into the containers. That component first decrypts the data key, uses the plaintext data key to encrypt data, puts the encrypted data into the container, and then destroys the plaintext data key. In this system, the component that creates the containers never sees the plaintext data key.  GenerateDataKeyWithoutPlaintext returns a unique data key for each request. The bytes in the keys are not related to the caller or KMS key that is used to encrypt the private key. To generate a data key, you must specify the symmetric KMS key that is used to encrypt the data key. You cannot use an asymmetric KMS key to generate a data key. To get the type of your KMS key, use the DescribeKey operation. If the operation succeeds, you will find the encrypted copy of the data key in the CiphertextBlob field. You can use the optional encryption context to add additional security to the encryption operation. If you specify an EncryptionContext, you must specify the same encryption context (a case-sensitive exact match) when decrypting the encrypted data key. Otherwise, the request to decrypt fails with an InvalidCiphertextException. For more information, see Encryption Context in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:GenerateDataKeyWithoutPlaintext (key policy)  Related operations:     Decrypt     Encrypt     GenerateDataKey     GenerateDataKeyPair     GenerateDataKeyPairWithoutPlaintext   
   */
  generateDataKeyWithoutPlaintext(callback?: (err: AWSError, data: KMS.Types.GenerateDataKeyWithoutPlaintextResponse) => void): Request<KMS.Types.GenerateDataKeyWithoutPlaintextResponse, AWSError>;
  /**
   * Returns a random byte string that is cryptographically secure. By default, the random byte string is generated in KMS. To generate the byte string in the CloudHSM cluster that is associated with a custom key store, specify the custom key store ID. Applications in Amazon Web Services Nitro Enclaves can call this operation by using the Amazon Web Services Nitro Enclaves Development Kit. For information about the supporting parameters, see How Amazon Web Services Nitro Enclaves use KMS in the Key Management Service Developer Guide. For more information about entropy and random number generation, see Key Management Service Cryptographic Details.  Required permissions: kms:GenerateRandom (IAM policy)
   */
  generateRandom(params: KMS.Types.GenerateRandomRequest, callback?: (err: AWSError, data: KMS.Types.GenerateRandomResponse) => void): Request<KMS.Types.GenerateRandomResponse, AWSError>;
  /**
   * Returns a random byte string that is cryptographically secure. By default, the random byte string is generated in KMS. To generate the byte string in the CloudHSM cluster that is associated with a custom key store, specify the custom key store ID. Applications in Amazon Web Services Nitro Enclaves can call this operation by using the Amazon Web Services Nitro Enclaves Development Kit. For information about the supporting parameters, see How Amazon Web Services Nitro Enclaves use KMS in the Key Management Service Developer Guide. For more information about entropy and random number generation, see Key Management Service Cryptographic Details.  Required permissions: kms:GenerateRandom (IAM policy)
   */
  generateRandom(callback?: (err: AWSError, data: KMS.Types.GenerateRandomResponse) => void): Request<KMS.Types.GenerateRandomResponse, AWSError>;
  /**
   * Gets a key policy attached to the specified KMS key.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:GetKeyPolicy (key policy)  Related operations: PutKeyPolicy 
   */
  getKeyPolicy(params: KMS.Types.GetKeyPolicyRequest, callback?: (err: AWSError, data: KMS.Types.GetKeyPolicyResponse) => void): Request<KMS.Types.GetKeyPolicyResponse, AWSError>;
  /**
   * Gets a key policy attached to the specified KMS key.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:GetKeyPolicy (key policy)  Related operations: PutKeyPolicy 
   */
  getKeyPolicy(callback?: (err: AWSError, data: KMS.Types.GetKeyPolicyResponse) => void): Request<KMS.Types.GetKeyPolicyResponse, AWSError>;
  /**
   * Gets a Boolean value that indicates whether automatic rotation of the key material is enabled for the specified KMS key. You cannot enable automatic rotation of asymmetric KMS keys, KMS keys with imported key material, or KMS keys in a custom key store. To enable or disable automatic rotation of a set of related multi-Region keys, set the property on the primary key. The key rotation status for these KMS keys is always false. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.   Disabled: The key rotation status does not change when you disable a KMS key. However, while the KMS key is disabled, KMS does not rotate the key material.   Pending deletion: While a KMS key is pending deletion, its key rotation status is false and KMS does not rotate the key material. If you cancel the deletion, the original key rotation status is restored.    Cross-account use: Yes. To perform this operation on a KMS key in a different Amazon Web Services account, specify the key ARN in the value of the KeyId parameter.  Required permissions: kms:GetKeyRotationStatus (key policy)  Related operations:     DisableKeyRotation     EnableKeyRotation   
   */
  getKeyRotationStatus(params: KMS.Types.GetKeyRotationStatusRequest, callback?: (err: AWSError, data: KMS.Types.GetKeyRotationStatusResponse) => void): Request<KMS.Types.GetKeyRotationStatusResponse, AWSError>;
  /**
   * Gets a Boolean value that indicates whether automatic rotation of the key material is enabled for the specified KMS key. You cannot enable automatic rotation of asymmetric KMS keys, KMS keys with imported key material, or KMS keys in a custom key store. To enable or disable automatic rotation of a set of related multi-Region keys, set the property on the primary key. The key rotation status for these KMS keys is always false. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.   Disabled: The key rotation status does not change when you disable a KMS key. However, while the KMS key is disabled, KMS does not rotate the key material.   Pending deletion: While a KMS key is pending deletion, its key rotation status is false and KMS does not rotate the key material. If you cancel the deletion, the original key rotation status is restored.    Cross-account use: Yes. To perform this operation on a KMS key in a different Amazon Web Services account, specify the key ARN in the value of the KeyId parameter.  Required permissions: kms:GetKeyRotationStatus (key policy)  Related operations:     DisableKeyRotation     EnableKeyRotation   
   */
  getKeyRotationStatus(callback?: (err: AWSError, data: KMS.Types.GetKeyRotationStatusResponse) => void): Request<KMS.Types.GetKeyRotationStatusResponse, AWSError>;
  /**
   * Returns the items you need to import key material into a symmetric, customer managed KMS key. For more information about importing key material into KMS, see Importing Key Material in the Key Management Service Developer Guide. This operation returns a public key and an import token. Use the public key to encrypt the symmetric key material. Store the import token to send with a subsequent ImportKeyMaterial request. You must specify the key ID of the symmetric KMS key into which you will import key material. This KMS key's Origin must be EXTERNAL. You must also specify the wrapping algorithm and type of wrapping key (public key) that you will use to encrypt the key material. You cannot perform this operation on an asymmetric KMS key or on any KMS key in a different Amazon Web Services account. To import key material, you must use the public key and import token from the same response. These items are valid for 24 hours. The expiration date and time appear in the GetParametersForImport response. You cannot use an expired token in an ImportKeyMaterial request. If your key and token expire, send another GetParametersForImport request. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:GetParametersForImport (key policy)  Related operations:     ImportKeyMaterial     DeleteImportedKeyMaterial   
   */
  getParametersForImport(params: KMS.Types.GetParametersForImportRequest, callback?: (err: AWSError, data: KMS.Types.GetParametersForImportResponse) => void): Request<KMS.Types.GetParametersForImportResponse, AWSError>;
  /**
   * Returns the items you need to import key material into a symmetric, customer managed KMS key. For more information about importing key material into KMS, see Importing Key Material in the Key Management Service Developer Guide. This operation returns a public key and an import token. Use the public key to encrypt the symmetric key material. Store the import token to send with a subsequent ImportKeyMaterial request. You must specify the key ID of the symmetric KMS key into which you will import key material. This KMS key's Origin must be EXTERNAL. You must also specify the wrapping algorithm and type of wrapping key (public key) that you will use to encrypt the key material. You cannot perform this operation on an asymmetric KMS key or on any KMS key in a different Amazon Web Services account. To import key material, you must use the public key and import token from the same response. These items are valid for 24 hours. The expiration date and time appear in the GetParametersForImport response. You cannot use an expired token in an ImportKeyMaterial request. If your key and token expire, send another GetParametersForImport request. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:GetParametersForImport (key policy)  Related operations:     ImportKeyMaterial     DeleteImportedKeyMaterial   
   */
  getParametersForImport(callback?: (err: AWSError, data: KMS.Types.GetParametersForImportResponse) => void): Request<KMS.Types.GetParametersForImportResponse, AWSError>;
  /**
   * Returns the public key of an asymmetric KMS key. Unlike the private key of a asymmetric KMS key, which never leaves KMS unencrypted, callers with kms:GetPublicKey permission can download the public key of an asymmetric KMS key. You can share the public key to allow others to encrypt messages and verify signatures outside of KMS. For information about symmetric and asymmetric KMS keys, see Using Symmetric and Asymmetric KMS keys in the Key Management Service Developer Guide. You do not need to download the public key. Instead, you can use the public key within KMS by calling the Encrypt, ReEncrypt, or Verify operations with the identifier of an asymmetric KMS key. When you use the public key within KMS, you benefit from the authentication, authorization, and logging that are part of every KMS operation. You also reduce of risk of encrypting data that cannot be decrypted. These features are not effective outside of KMS. For details, see Special Considerations for Downloading Public Keys. To help you use the public key safely outside of KMS, GetPublicKey returns important information about the public key in the response, including:    KeySpec: The type of key material in the public key, such as RSA_4096 or ECC_NIST_P521.    KeyUsage: Whether the key is used for encryption or signing.    EncryptionAlgorithms or SigningAlgorithms: A list of the encryption algorithms or the signing algorithms for the key.   Although KMS cannot enforce these restrictions on external operations, it is crucial that you use this information to prevent the public key from being used improperly. For example, you can prevent a public signing key from being used encrypt data, or prevent a public key from being used with an encryption algorithm that is not supported by KMS. You can also avoid errors, such as using the wrong signing algorithm in a verification operation. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:GetPublicKey (key policy)  Related operations: CreateKey 
   */
  getPublicKey(params: KMS.Types.GetPublicKeyRequest, callback?: (err: AWSError, data: KMS.Types.GetPublicKeyResponse) => void): Request<KMS.Types.GetPublicKeyResponse, AWSError>;
  /**
   * Returns the public key of an asymmetric KMS key. Unlike the private key of a asymmetric KMS key, which never leaves KMS unencrypted, callers with kms:GetPublicKey permission can download the public key of an asymmetric KMS key. You can share the public key to allow others to encrypt messages and verify signatures outside of KMS. For information about symmetric and asymmetric KMS keys, see Using Symmetric and Asymmetric KMS keys in the Key Management Service Developer Guide. You do not need to download the public key. Instead, you can use the public key within KMS by calling the Encrypt, ReEncrypt, or Verify operations with the identifier of an asymmetric KMS key. When you use the public key within KMS, you benefit from the authentication, authorization, and logging that are part of every KMS operation. You also reduce of risk of encrypting data that cannot be decrypted. These features are not effective outside of KMS. For details, see Special Considerations for Downloading Public Keys. To help you use the public key safely outside of KMS, GetPublicKey returns important information about the public key in the response, including:    KeySpec: The type of key material in the public key, such as RSA_4096 or ECC_NIST_P521.    KeyUsage: Whether the key is used for encryption or signing.    EncryptionAlgorithms or SigningAlgorithms: A list of the encryption algorithms or the signing algorithms for the key.   Although KMS cannot enforce these restrictions on external operations, it is crucial that you use this information to prevent the public key from being used improperly. For example, you can prevent a public signing key from being used encrypt data, or prevent a public key from being used with an encryption algorithm that is not supported by KMS. You can also avoid errors, such as using the wrong signing algorithm in a verification operation. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:GetPublicKey (key policy)  Related operations: CreateKey 
   */
  getPublicKey(callback?: (err: AWSError, data: KMS.Types.GetPublicKeyResponse) => void): Request<KMS.Types.GetPublicKeyResponse, AWSError>;
  /**
   * Imports key material into an existing symmetric KMS KMS key that was created without key material. After you successfully import key material into a KMS key, you can reimport the same key material into that KMS key, but you cannot import different key material.  You cannot perform this operation on an asymmetric KMS key or on any KMS key in a different Amazon Web Services account. For more information about creating KMS keys with no key material and then importing key material, see Importing Key Material in the Key Management Service Developer Guide. Before using this operation, call GetParametersForImport. Its response includes a public key and an import token. Use the public key to encrypt the key material. Then, submit the import token from the same GetParametersForImport response. When calling this operation, you must specify the following values:   The key ID or key ARN of a KMS key with no key material. Its Origin must be EXTERNAL. To create a KMS key with no key material, call CreateKey and set the value of its Origin parameter to EXTERNAL. To get the Origin of a KMS key, call DescribeKey.)   The encrypted key material. To get the public key to encrypt the key material, call GetParametersForImport.   The import token that GetParametersForImport returned. You must use a public key and token from the same GetParametersForImport response.   Whether the key material expires and if so, when. If you set an expiration date, KMS deletes the key material from the KMS key on the specified date, and the KMS key becomes unusable. To use the KMS key again, you must reimport the same key material. The only way to change an expiration date is by reimporting the same key material and specifying a new expiration date.    When this operation is successful, the key state of the KMS key changes from PendingImport to Enabled, and you can use the KMS key. If this operation fails, use the exception to help determine the problem. If the error is related to the key material, the import token, or wrapping key, use GetParametersForImport to get a new public key and import token for the KMS key and repeat the import procedure. For help, see How To Import Key Material in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:ImportKeyMaterial (key policy)  Related operations:     DeleteImportedKeyMaterial     GetParametersForImport   
   */
  importKeyMaterial(params: KMS.Types.ImportKeyMaterialRequest, callback?: (err: AWSError, data: KMS.Types.ImportKeyMaterialResponse) => void): Request<KMS.Types.ImportKeyMaterialResponse, AWSError>;
  /**
   * Imports key material into an existing symmetric KMS KMS key that was created without key material. After you successfully import key material into a KMS key, you can reimport the same key material into that KMS key, but you cannot import different key material.  You cannot perform this operation on an asymmetric KMS key or on any KMS key in a different Amazon Web Services account. For more information about creating KMS keys with no key material and then importing key material, see Importing Key Material in the Key Management Service Developer Guide. Before using this operation, call GetParametersForImport. Its response includes a public key and an import token. Use the public key to encrypt the key material. Then, submit the import token from the same GetParametersForImport response. When calling this operation, you must specify the following values:   The key ID or key ARN of a KMS key with no key material. Its Origin must be EXTERNAL. To create a KMS key with no key material, call CreateKey and set the value of its Origin parameter to EXTERNAL. To get the Origin of a KMS key, call DescribeKey.)   The encrypted key material. To get the public key to encrypt the key material, call GetParametersForImport.   The import token that GetParametersForImport returned. You must use a public key and token from the same GetParametersForImport response.   Whether the key material expires and if so, when. If you set an expiration date, KMS deletes the key material from the KMS key on the specified date, and the KMS key becomes unusable. To use the KMS key again, you must reimport the same key material. The only way to change an expiration date is by reimporting the same key material and specifying a new expiration date.    When this operation is successful, the key state of the KMS key changes from PendingImport to Enabled, and you can use the KMS key. If this operation fails, use the exception to help determine the problem. If the error is related to the key material, the import token, or wrapping key, use GetParametersForImport to get a new public key and import token for the KMS key and repeat the import procedure. For help, see How To Import Key Material in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:ImportKeyMaterial (key policy)  Related operations:     DeleteImportedKeyMaterial     GetParametersForImport   
   */
  importKeyMaterial(callback?: (err: AWSError, data: KMS.Types.ImportKeyMaterialResponse) => void): Request<KMS.Types.ImportKeyMaterialResponse, AWSError>;
  /**
   * Gets a list of aliases in the caller's Amazon Web Services account and region. For more information about aliases, see CreateAlias. By default, the ListAliases operation returns all aliases in the account and region. To get only the aliases associated with a particular KMS key, use the KeyId parameter. The ListAliases response can include aliases that you created and associated with your customer managed keys, and aliases that Amazon Web Services created and associated with Amazon Web Services managed keys in your account. You can recognize Amazon Web Services aliases because their names have the format aws/&lt;service-name&gt;, such as aws/dynamodb. The response might also include aliases that have no TargetKeyId field. These are predefined aliases that Amazon Web Services has created but has not yet associated with a KMS key. Aliases that Amazon Web Services creates in your account, including predefined aliases, do not count against your KMS aliases quota.  Cross-account use: No. ListAliases does not return aliases in other Amazon Web Services accounts.  Required permissions: kms:ListAliases (IAM policy) For details, see Controlling access to aliases in the Key Management Service Developer Guide.  Related operations:     CreateAlias     DeleteAlias     UpdateAlias   
   */
  listAliases(params: KMS.Types.ListAliasesRequest, callback?: (err: AWSError, data: KMS.Types.ListAliasesResponse) => void): Request<KMS.Types.ListAliasesResponse, AWSError>;
  /**
   * Gets a list of aliases in the caller's Amazon Web Services account and region. For more information about aliases, see CreateAlias. By default, the ListAliases operation returns all aliases in the account and region. To get only the aliases associated with a particular KMS key, use the KeyId parameter. The ListAliases response can include aliases that you created and associated with your customer managed keys, and aliases that Amazon Web Services created and associated with Amazon Web Services managed keys in your account. You can recognize Amazon Web Services aliases because their names have the format aws/&lt;service-name&gt;, such as aws/dynamodb. The response might also include aliases that have no TargetKeyId field. These are predefined aliases that Amazon Web Services has created but has not yet associated with a KMS key. Aliases that Amazon Web Services creates in your account, including predefined aliases, do not count against your KMS aliases quota.  Cross-account use: No. ListAliases does not return aliases in other Amazon Web Services accounts.  Required permissions: kms:ListAliases (IAM policy) For details, see Controlling access to aliases in the Key Management Service Developer Guide.  Related operations:     CreateAlias     DeleteAlias     UpdateAlias   
   */
  listAliases(callback?: (err: AWSError, data: KMS.Types.ListAliasesResponse) => void): Request<KMS.Types.ListAliasesResponse, AWSError>;
  /**
   * Gets a list of all grants for the specified KMS key.  You must specify the KMS key in all requests. You can filter the grant list by grant ID or grantee principal. For detailed information about grants, including grant terminology, see Using grants in the  Key Management Service Developer Guide . For examples of working with grants in several programming languages, see Programming grants.   The GranteePrincipal field in the ListGrants response usually contains the user or role designated as the grantee principal in the grant. However, when the grantee principal in the grant is an Amazon Web Services service, the GranteePrincipal field contains the service principal, which might represent several different grantee principals.   Cross-account use: Yes. To perform this operation on a KMS key in a different Amazon Web Services account, specify the key ARN in the value of the KeyId parameter.  Required permissions: kms:ListGrants (key policy)  Related operations:     CreateGrant     ListRetirableGrants     RetireGrant     RevokeGrant   
   */
  listGrants(params: KMS.Types.ListGrantsRequest, callback?: (err: AWSError, data: KMS.Types.ListGrantsResponse) => void): Request<KMS.Types.ListGrantsResponse, AWSError>;
  /**
   * Gets a list of all grants for the specified KMS key.  You must specify the KMS key in all requests. You can filter the grant list by grant ID or grantee principal. For detailed information about grants, including grant terminology, see Using grants in the  Key Management Service Developer Guide . For examples of working with grants in several programming languages, see Programming grants.   The GranteePrincipal field in the ListGrants response usually contains the user or role designated as the grantee principal in the grant. However, when the grantee principal in the grant is an Amazon Web Services service, the GranteePrincipal field contains the service principal, which might represent several different grantee principals.   Cross-account use: Yes. To perform this operation on a KMS key in a different Amazon Web Services account, specify the key ARN in the value of the KeyId parameter.  Required permissions: kms:ListGrants (key policy)  Related operations:     CreateGrant     ListRetirableGrants     RetireGrant     RevokeGrant   
   */
  listGrants(callback?: (err: AWSError, data: KMS.Types.ListGrantsResponse) => void): Request<KMS.Types.ListGrantsResponse, AWSError>;
  /**
   * Gets the names of the key policies that are attached to a KMS key. This operation is designed to get policy names that you can use in a GetKeyPolicy operation. However, the only valid policy name is default.   Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:ListKeyPolicies (key policy)  Related operations:     GetKeyPolicy     PutKeyPolicy   
   */
  listKeyPolicies(params: KMS.Types.ListKeyPoliciesRequest, callback?: (err: AWSError, data: KMS.Types.ListKeyPoliciesResponse) => void): Request<KMS.Types.ListKeyPoliciesResponse, AWSError>;
  /**
   * Gets the names of the key policies that are attached to a KMS key. This operation is designed to get policy names that you can use in a GetKeyPolicy operation. However, the only valid policy name is default.   Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:ListKeyPolicies (key policy)  Related operations:     GetKeyPolicy     PutKeyPolicy   
   */
  listKeyPolicies(callback?: (err: AWSError, data: KMS.Types.ListKeyPoliciesResponse) => void): Request<KMS.Types.ListKeyPoliciesResponse, AWSError>;
  /**
   * Gets a list of all KMS keys in the caller's Amazon Web Services account and Region.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:ListKeys (IAM policy)  Related operations:     CreateKey     DescribeKey     ListAliases     ListResourceTags   
   */
  listKeys(params: KMS.Types.ListKeysRequest, callback?: (err: AWSError, data: KMS.Types.ListKeysResponse) => void): Request<KMS.Types.ListKeysResponse, AWSError>;
  /**
   * Gets a list of all KMS keys in the caller's Amazon Web Services account and Region.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:ListKeys (IAM policy)  Related operations:     CreateKey     DescribeKey     ListAliases     ListResourceTags   
   */
  listKeys(callback?: (err: AWSError, data: KMS.Types.ListKeysResponse) => void): Request<KMS.Types.ListKeysResponse, AWSError>;
  /**
   * Returns all tags on the specified KMS key. For general information about tags, including the format and syntax, see Tagging Amazon Web Services resources in the Amazon Web Services General Reference. For information about using tags in KMS, see Tagging keys.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:ListResourceTags (key policy)  Related operations:     CreateKey     ReplicateKey     TagResource     UntagResource   
   */
  listResourceTags(params: KMS.Types.ListResourceTagsRequest, callback?: (err: AWSError, data: KMS.Types.ListResourceTagsResponse) => void): Request<KMS.Types.ListResourceTagsResponse, AWSError>;
  /**
   * Returns all tags on the specified KMS key. For general information about tags, including the format and syntax, see Tagging Amazon Web Services resources in the Amazon Web Services General Reference. For information about using tags in KMS, see Tagging keys.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:ListResourceTags (key policy)  Related operations:     CreateKey     ReplicateKey     TagResource     UntagResource   
   */
  listResourceTags(callback?: (err: AWSError, data: KMS.Types.ListResourceTagsResponse) => void): Request<KMS.Types.ListResourceTagsResponse, AWSError>;
  /**
   * Returns information about all grants in the Amazon Web Services account and Region that have the specified retiring principal.  You can specify any principal in your Amazon Web Services account. The grants that are returned include grants for KMS keys in your Amazon Web Services account and other Amazon Web Services accounts. You might use this operation to determine which grants you may retire. To retire a grant, use the RetireGrant operation. For detailed information about grants, including grant terminology, see Using grants in the  Key Management Service Developer Guide . For examples of working with grants in several programming languages, see Programming grants.   Cross-account use: You must specify a principal in your Amazon Web Services account. However, this operation can return grants in any Amazon Web Services account. You do not need kms:ListRetirableGrants permission (or any other additional permission) in any Amazon Web Services account other than your own.  Required permissions: kms:ListRetirableGrants (IAM policy) in your Amazon Web Services account.  Related operations:     CreateGrant     ListGrants     RetireGrant     RevokeGrant   
   */
  listRetirableGrants(params: KMS.Types.ListRetirableGrantsRequest, callback?: (err: AWSError, data: KMS.Types.ListGrantsResponse) => void): Request<KMS.Types.ListGrantsResponse, AWSError>;
  /**
   * Returns information about all grants in the Amazon Web Services account and Region that have the specified retiring principal.  You can specify any principal in your Amazon Web Services account. The grants that are returned include grants for KMS keys in your Amazon Web Services account and other Amazon Web Services accounts. You might use this operation to determine which grants you may retire. To retire a grant, use the RetireGrant operation. For detailed information about grants, including grant terminology, see Using grants in the  Key Management Service Developer Guide . For examples of working with grants in several programming languages, see Programming grants.   Cross-account use: You must specify a principal in your Amazon Web Services account. However, this operation can return grants in any Amazon Web Services account. You do not need kms:ListRetirableGrants permission (or any other additional permission) in any Amazon Web Services account other than your own.  Required permissions: kms:ListRetirableGrants (IAM policy) in your Amazon Web Services account.  Related operations:     CreateGrant     ListGrants     RetireGrant     RevokeGrant   
   */
  listRetirableGrants(callback?: (err: AWSError, data: KMS.Types.ListGrantsResponse) => void): Request<KMS.Types.ListGrantsResponse, AWSError>;
  /**
   * Attaches a key policy to the specified KMS key.  For more information about key policies, see Key Policies in the Key Management Service Developer Guide. For help writing and formatting a JSON policy document, see the IAM JSON Policy Reference in the  Identity and Access Management User Guide . For examples of adding a key policy in multiple programming languages, see Setting a key policy in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:PutKeyPolicy (key policy)  Related operations: GetKeyPolicy 
   */
  putKeyPolicy(params: KMS.Types.PutKeyPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches a key policy to the specified KMS key.  For more information about key policies, see Key Policies in the Key Management Service Developer Guide. For help writing and formatting a JSON policy document, see the IAM JSON Policy Reference in the  Identity and Access Management User Guide . For examples of adding a key policy in multiple programming languages, see Setting a key policy in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:PutKeyPolicy (key policy)  Related operations: GetKeyPolicy 
   */
  putKeyPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Decrypts ciphertext and then reencrypts it entirely within KMS. You can use this operation to change the KMS key under which data is encrypted, such as when you manually rotate a KMS key or change the KMS key that protects a ciphertext. You can also use it to reencrypt ciphertext under the same KMS key, such as to change the encryption context of a ciphertext. The ReEncrypt operation can decrypt ciphertext that was encrypted by using an KMS KMS key in an KMS operation, such as Encrypt or GenerateDataKey. It can also decrypt ciphertext that was encrypted by using the public key of an asymmetric KMS key outside of KMS. However, it cannot decrypt ciphertext produced by other libraries, such as the Amazon Web Services Encryption SDK or Amazon S3 client-side encryption. These libraries return a ciphertext format that is incompatible with KMS. When you use the ReEncrypt operation, you need to provide information for the decrypt operation and the subsequent encrypt operation.   If your ciphertext was encrypted under an asymmetric KMS key, you must use the SourceKeyId parameter to identify the KMS key that encrypted the ciphertext. You must also supply the encryption algorithm that was used. This information is required to decrypt the data.   If your ciphertext was encrypted under a symmetric KMS key, the SourceKeyId parameter is optional. KMS can get this information from metadata that it adds to the symmetric ciphertext blob. This feature adds durability to your implementation by ensuring that authorized users can decrypt ciphertext decades after it was encrypted, even if they've lost track of the key ID. However, specifying the source KMS key is always recommended as a best practice. When you use the SourceKeyId parameter to specify a KMS key, KMS uses only the KMS key you specify. If the ciphertext was encrypted under a different KMS key, the ReEncrypt operation fails. This practice ensures that you use the KMS key that you intend.   To reencrypt the data, you must use the DestinationKeyId parameter specify the KMS key that re-encrypts the data after it is decrypted. You can select a symmetric or asymmetric KMS key. If the destination KMS key is an asymmetric KMS key, you must also provide the encryption algorithm. The algorithm that you choose must be compatible with the KMS key.  When you use an asymmetric KMS key to encrypt or reencrypt data, be sure to record the KMS key and encryption algorithm that you choose. You will be required to provide the same KMS key and encryption algorithm when you decrypt the data. If the KMS key and algorithm do not match the values used to encrypt the data, the decrypt operation fails. You are not required to supply the key ID and encryption algorithm when you decrypt with symmetric KMS keys because KMS stores this information in the ciphertext blob. KMS cannot store metadata in ciphertext generated with asymmetric keys. The standard format for asymmetric key ciphertext does not include configurable fields.    The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. The source KMS key and destination KMS key can be in different Amazon Web Services accounts. Either or both KMS keys can be in a different account than the caller. To specify a KMS key in a different account, you must use its key ARN or alias ARN.  Required permissions:    kms:ReEncryptFrom permission on the source KMS key (key policy)    kms:ReEncryptTo permission on the destination KMS key (key policy)   To permit reencryption from or to a KMS key, include the "kms:ReEncrypt*" permission in your key policy. This permission is automatically included in the key policy when you use the console to create a KMS key. But you must include it manually when you create a KMS key programmatically or when you use the PutKeyPolicy operation to set a key policy.  Related operations:     Decrypt     Encrypt     GenerateDataKey     GenerateDataKeyPair   
   */
  reEncrypt(params: KMS.Types.ReEncryptRequest, callback?: (err: AWSError, data: KMS.Types.ReEncryptResponse) => void): Request<KMS.Types.ReEncryptResponse, AWSError>;
  /**
   * Decrypts ciphertext and then reencrypts it entirely within KMS. You can use this operation to change the KMS key under which data is encrypted, such as when you manually rotate a KMS key or change the KMS key that protects a ciphertext. You can also use it to reencrypt ciphertext under the same KMS key, such as to change the encryption context of a ciphertext. The ReEncrypt operation can decrypt ciphertext that was encrypted by using an KMS KMS key in an KMS operation, such as Encrypt or GenerateDataKey. It can also decrypt ciphertext that was encrypted by using the public key of an asymmetric KMS key outside of KMS. However, it cannot decrypt ciphertext produced by other libraries, such as the Amazon Web Services Encryption SDK or Amazon S3 client-side encryption. These libraries return a ciphertext format that is incompatible with KMS. When you use the ReEncrypt operation, you need to provide information for the decrypt operation and the subsequent encrypt operation.   If your ciphertext was encrypted under an asymmetric KMS key, you must use the SourceKeyId parameter to identify the KMS key that encrypted the ciphertext. You must also supply the encryption algorithm that was used. This information is required to decrypt the data.   If your ciphertext was encrypted under a symmetric KMS key, the SourceKeyId parameter is optional. KMS can get this information from metadata that it adds to the symmetric ciphertext blob. This feature adds durability to your implementation by ensuring that authorized users can decrypt ciphertext decades after it was encrypted, even if they've lost track of the key ID. However, specifying the source KMS key is always recommended as a best practice. When you use the SourceKeyId parameter to specify a KMS key, KMS uses only the KMS key you specify. If the ciphertext was encrypted under a different KMS key, the ReEncrypt operation fails. This practice ensures that you use the KMS key that you intend.   To reencrypt the data, you must use the DestinationKeyId parameter specify the KMS key that re-encrypts the data after it is decrypted. You can select a symmetric or asymmetric KMS key. If the destination KMS key is an asymmetric KMS key, you must also provide the encryption algorithm. The algorithm that you choose must be compatible with the KMS key.  When you use an asymmetric KMS key to encrypt or reencrypt data, be sure to record the KMS key and encryption algorithm that you choose. You will be required to provide the same KMS key and encryption algorithm when you decrypt the data. If the KMS key and algorithm do not match the values used to encrypt the data, the decrypt operation fails. You are not required to supply the key ID and encryption algorithm when you decrypt with symmetric KMS keys because KMS stores this information in the ciphertext blob. KMS cannot store metadata in ciphertext generated with asymmetric keys. The standard format for asymmetric key ciphertext does not include configurable fields.    The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. The source KMS key and destination KMS key can be in different Amazon Web Services accounts. Either or both KMS keys can be in a different account than the caller. To specify a KMS key in a different account, you must use its key ARN or alias ARN.  Required permissions:    kms:ReEncryptFrom permission on the source KMS key (key policy)    kms:ReEncryptTo permission on the destination KMS key (key policy)   To permit reencryption from or to a KMS key, include the "kms:ReEncrypt*" permission in your key policy. This permission is automatically included in the key policy when you use the console to create a KMS key. But you must include it manually when you create a KMS key programmatically or when you use the PutKeyPolicy operation to set a key policy.  Related operations:     Decrypt     Encrypt     GenerateDataKey     GenerateDataKeyPair   
   */
  reEncrypt(callback?: (err: AWSError, data: KMS.Types.ReEncryptResponse) => void): Request<KMS.Types.ReEncryptResponse, AWSError>;
  /**
   * Replicates a multi-Region key into the specified Region. This operation creates a multi-Region replica key based on a multi-Region primary key in a different Region of the same Amazon Web Services partition. You can create multiple replicas of a primary key, but each must be in a different Region. To create a multi-Region primary key, use the CreateKey operation. This operation supports multi-Region keys, an KMS feature that lets you create multiple interoperable KMS keys in different Amazon Web Services Regions. Because these KMS keys have the same key ID, key material, and other metadata, you can use them interchangeably to encrypt data in one Amazon Web Services Region and decrypt it in a different Amazon Web Services Region without re-encrypting the data or making a cross-Region call. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide. A replica key is a fully-functional KMS key that can be used independently of its primary and peer replica keys. A primary key and its replica keys share properties that make them interoperable. They have the same key ID and key material. They also have the same key spec, key usage, key material origin, and automatic key rotation status. KMS automatically synchronizes these shared properties among related multi-Region keys. All other properties of a replica key can differ, including its key policy, tags, aliases, and key state. KMS pricing and quotas for KMS keys apply to each primary key and replica key. When this operation completes, the new replica key has a transient key state of Creating. This key state changes to Enabled (or PendingImport) after a few seconds when the process of creating the new replica key is complete. While the key state is Creating, you can manage key, but you cannot yet use it in cryptographic operations. If you are creating and using the replica key programmatically, retry on KMSInvalidStateException or call DescribeKey to check its KeyState value before using it. For details about the Creating key state, see Key state: Effect on your KMS key in the Key Management Service Developer Guide. The CloudTrail log of a ReplicateKey operation records a ReplicateKey operation in the primary key's Region and a CreateKey operation in the replica key's Region. If you replicate a multi-Region primary key with imported key material, the replica key is created with no key material. You must import the same key material that you imported into the primary key. For details, see Importing key material into multi-Region keys in the Key Management Service Developer Guide. To convert a replica key to a primary key, use the UpdatePrimaryRegion operation.   ReplicateKey uses different default values for the KeyPolicy and Tags parameters than those used in the KMS console. For details, see the parameter descriptions.   Cross-account use: No. You cannot use this operation to create a replica key in a different Amazon Web Services account.   Required permissions:     kms:ReplicateKey on the primary key (in the primary key's Region). Include this permission in the primary key's key policy.    kms:CreateKey in an IAM policy in the replica Region.   To use the Tags parameter, kms:TagResource in an IAM policy in the replica Region.    Related operations     CreateKey     UpdatePrimaryRegion   
   */
  replicateKey(params: KMS.Types.ReplicateKeyRequest, callback?: (err: AWSError, data: KMS.Types.ReplicateKeyResponse) => void): Request<KMS.Types.ReplicateKeyResponse, AWSError>;
  /**
   * Replicates a multi-Region key into the specified Region. This operation creates a multi-Region replica key based on a multi-Region primary key in a different Region of the same Amazon Web Services partition. You can create multiple replicas of a primary key, but each must be in a different Region. To create a multi-Region primary key, use the CreateKey operation. This operation supports multi-Region keys, an KMS feature that lets you create multiple interoperable KMS keys in different Amazon Web Services Regions. Because these KMS keys have the same key ID, key material, and other metadata, you can use them interchangeably to encrypt data in one Amazon Web Services Region and decrypt it in a different Amazon Web Services Region without re-encrypting the data or making a cross-Region call. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide. A replica key is a fully-functional KMS key that can be used independently of its primary and peer replica keys. A primary key and its replica keys share properties that make them interoperable. They have the same key ID and key material. They also have the same key spec, key usage, key material origin, and automatic key rotation status. KMS automatically synchronizes these shared properties among related multi-Region keys. All other properties of a replica key can differ, including its key policy, tags, aliases, and key state. KMS pricing and quotas for KMS keys apply to each primary key and replica key. When this operation completes, the new replica key has a transient key state of Creating. This key state changes to Enabled (or PendingImport) after a few seconds when the process of creating the new replica key is complete. While the key state is Creating, you can manage key, but you cannot yet use it in cryptographic operations. If you are creating and using the replica key programmatically, retry on KMSInvalidStateException or call DescribeKey to check its KeyState value before using it. For details about the Creating key state, see Key state: Effect on your KMS key in the Key Management Service Developer Guide. The CloudTrail log of a ReplicateKey operation records a ReplicateKey operation in the primary key's Region and a CreateKey operation in the replica key's Region. If you replicate a multi-Region primary key with imported key material, the replica key is created with no key material. You must import the same key material that you imported into the primary key. For details, see Importing key material into multi-Region keys in the Key Management Service Developer Guide. To convert a replica key to a primary key, use the UpdatePrimaryRegion operation.   ReplicateKey uses different default values for the KeyPolicy and Tags parameters than those used in the KMS console. For details, see the parameter descriptions.   Cross-account use: No. You cannot use this operation to create a replica key in a different Amazon Web Services account.   Required permissions:     kms:ReplicateKey on the primary key (in the primary key's Region). Include this permission in the primary key's key policy.    kms:CreateKey in an IAM policy in the replica Region.   To use the Tags parameter, kms:TagResource in an IAM policy in the replica Region.    Related operations     CreateKey     UpdatePrimaryRegion   
   */
  replicateKey(callback?: (err: AWSError, data: KMS.Types.ReplicateKeyResponse) => void): Request<KMS.Types.ReplicateKeyResponse, AWSError>;
  /**
   * Deletes a grant. Typically, you retire a grant when you no longer need its permissions. To identify the grant to retire, use a grant token, or both the grant ID and a key identifier (key ID or key ARN) of the KMS key. The CreateGrant operation returns both values. This operation can be called by the retiring principal for a grant, by the grantee principal if the grant allows the RetireGrant operation, and by the Amazon Web Services account (root user) in which the grant is created. It can also be called by principals to whom permission for retiring a grant is delegated. For details, see Retiring and revoking grants in the Key Management Service Developer Guide. For detailed information about grants, including grant terminology, see Using grants in the  Key Management Service Developer Guide . For examples of working with grants in several programming languages, see Programming grants.   Cross-account use: Yes. You can retire a grant on a KMS key in a different Amazon Web Services account.  Required permissions::Permission to retire a grant is determined primarily by the grant. For details, see Retiring and revoking grants in the Key Management Service Developer Guide.  Related operations:     CreateGrant     ListGrants     ListRetirableGrants     RevokeGrant   
   */
  retireGrant(params: KMS.Types.RetireGrantRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a grant. Typically, you retire a grant when you no longer need its permissions. To identify the grant to retire, use a grant token, or both the grant ID and a key identifier (key ID or key ARN) of the KMS key. The CreateGrant operation returns both values. This operation can be called by the retiring principal for a grant, by the grantee principal if the grant allows the RetireGrant operation, and by the Amazon Web Services account (root user) in which the grant is created. It can also be called by principals to whom permission for retiring a grant is delegated. For details, see Retiring and revoking grants in the Key Management Service Developer Guide. For detailed information about grants, including grant terminology, see Using grants in the  Key Management Service Developer Guide . For examples of working with grants in several programming languages, see Programming grants.   Cross-account use: Yes. You can retire a grant on a KMS key in a different Amazon Web Services account.  Required permissions::Permission to retire a grant is determined primarily by the grant. For details, see Retiring and revoking grants in the Key Management Service Developer Guide.  Related operations:     CreateGrant     ListGrants     ListRetirableGrants     RevokeGrant   
   */
  retireGrant(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified grant. You revoke a grant to terminate the permissions that the grant allows. For more information, see Retiring and revoking grants in the  Key Management Service Developer Guide . When you create, retire, or revoke a grant, there might be a brief delay, usually less than five minutes, until the grant is available throughout KMS. This state is known as eventual consistency. For details, see Eventual consistency in the  Key Management Service Developer Guide .  For detailed information about grants, including grant terminology, see Using grants in the  Key Management Service Developer Guide . For examples of working with grants in several programming languages, see Programming grants.   Cross-account use: Yes. To perform this operation on a KMS key in a different Amazon Web Services account, specify the key ARN in the value of the KeyId parameter.  Required permissions: kms:RevokeGrant (key policy).  Related operations:     CreateGrant     ListGrants     ListRetirableGrants     RetireGrant   
   */
  revokeGrant(params: KMS.Types.RevokeGrantRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified grant. You revoke a grant to terminate the permissions that the grant allows. For more information, see Retiring and revoking grants in the  Key Management Service Developer Guide . When you create, retire, or revoke a grant, there might be a brief delay, usually less than five minutes, until the grant is available throughout KMS. This state is known as eventual consistency. For details, see Eventual consistency in the  Key Management Service Developer Guide .  For detailed information about grants, including grant terminology, see Using grants in the  Key Management Service Developer Guide . For examples of working with grants in several programming languages, see Programming grants.   Cross-account use: Yes. To perform this operation on a KMS key in a different Amazon Web Services account, specify the key ARN in the value of the KeyId parameter.  Required permissions: kms:RevokeGrant (key policy).  Related operations:     CreateGrant     ListGrants     ListRetirableGrants     RetireGrant   
   */
  revokeGrant(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Schedules the deletion of a KMS key. By default, KMS applies a waiting period of 30 days, but you can specify a waiting period of 7-30 days. When this operation is successful, the key state of the KMS key changes to PendingDeletion and the key can't be used in any cryptographic operations. It remains in this state for the duration of the waiting period. Before the waiting period ends, you can use CancelKeyDeletion to cancel the deletion of the KMS key. After the waiting period ends, KMS deletes the KMS key, its key material, and all KMS data associated with it, including all aliases that refer to it.  Deleting a KMS key is a destructive and potentially dangerous operation. When a KMS key is deleted, all data that was encrypted under the KMS key is unrecoverable. (The only exception is a multi-Region replica key.) To prevent the use of a KMS key without deleting it, use DisableKey.   If you schedule deletion of a KMS key from a custom key store, when the waiting period expires, ScheduleKeyDeletion deletes the KMS key from KMS. Then KMS makes a best effort to delete the key material from the associated CloudHSM cluster. However, you might need to manually delete the orphaned key material from the cluster and its backups. You can schedule the deletion of a multi-Region primary key and its replica keys at any time. However, KMS will not delete a multi-Region primary key with existing replica keys. If you schedule the deletion of a primary key with replicas, its key state changes to PendingReplicaDeletion and it cannot be replicated or used in cryptographic operations. This status can continue indefinitely. When the last of its replicas keys is deleted (not just scheduled), the key state of the primary key changes to PendingDeletion and its waiting period (PendingWindowInDays) begins. For details, see Deleting multi-Region keys in the Key Management Service Developer Guide.  For more information about scheduling a KMS key for deletion, see Deleting KMS keys in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:ScheduleKeyDeletion (key policy)  Related operations     CancelKeyDeletion     DisableKey   
   */
  scheduleKeyDeletion(params: KMS.Types.ScheduleKeyDeletionRequest, callback?: (err: AWSError, data: KMS.Types.ScheduleKeyDeletionResponse) => void): Request<KMS.Types.ScheduleKeyDeletionResponse, AWSError>;
  /**
   * Schedules the deletion of a KMS key. By default, KMS applies a waiting period of 30 days, but you can specify a waiting period of 7-30 days. When this operation is successful, the key state of the KMS key changes to PendingDeletion and the key can't be used in any cryptographic operations. It remains in this state for the duration of the waiting period. Before the waiting period ends, you can use CancelKeyDeletion to cancel the deletion of the KMS key. After the waiting period ends, KMS deletes the KMS key, its key material, and all KMS data associated with it, including all aliases that refer to it.  Deleting a KMS key is a destructive and potentially dangerous operation. When a KMS key is deleted, all data that was encrypted under the KMS key is unrecoverable. (The only exception is a multi-Region replica key.) To prevent the use of a KMS key without deleting it, use DisableKey.   If you schedule deletion of a KMS key from a custom key store, when the waiting period expires, ScheduleKeyDeletion deletes the KMS key from KMS. Then KMS makes a best effort to delete the key material from the associated CloudHSM cluster. However, you might need to manually delete the orphaned key material from the cluster and its backups. You can schedule the deletion of a multi-Region primary key and its replica keys at any time. However, KMS will not delete a multi-Region primary key with existing replica keys. If you schedule the deletion of a primary key with replicas, its key state changes to PendingReplicaDeletion and it cannot be replicated or used in cryptographic operations. This status can continue indefinitely. When the last of its replicas keys is deleted (not just scheduled), the key state of the primary key changes to PendingDeletion and its waiting period (PendingWindowInDays) begins. For details, see Deleting multi-Region keys in the Key Management Service Developer Guide.  For more information about scheduling a KMS key for deletion, see Deleting KMS keys in the Key Management Service Developer Guide. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:ScheduleKeyDeletion (key policy)  Related operations     CancelKeyDeletion     DisableKey   
   */
  scheduleKeyDeletion(callback?: (err: AWSError, data: KMS.Types.ScheduleKeyDeletionResponse) => void): Request<KMS.Types.ScheduleKeyDeletionResponse, AWSError>;
  /**
   * Creates a digital signature for a message or message digest by using the private key in an asymmetric KMS key. To verify the signature, use the Verify operation, or use the public key in the same asymmetric KMS key outside of KMS. For information about symmetric and asymmetric KMS keys, see Using Symmetric and Asymmetric KMS keys in the Key Management Service Developer Guide. Digital signatures are generated and verified by using asymmetric key pair, such as an RSA or ECC pair that is represented by an asymmetric KMS key. The key owner (or an authorized user) uses their private key to sign a message. Anyone with the public key can verify that the message was signed with that particular private key and that the message hasn't changed since it was signed.  To use the Sign operation, provide the following information:   Use the KeyId parameter to identify an asymmetric KMS key with a KeyUsage value of SIGN_VERIFY. To get the KeyUsage value of a KMS key, use the DescribeKey operation. The caller must have kms:Sign permission on the KMS key.   Use the Message parameter to specify the message or message digest to sign. You can submit messages of up to 4096 bytes. To sign a larger message, generate a hash digest of the message, and then provide the hash digest in the Message parameter. To indicate whether the message is a full message or a digest, use the MessageType parameter.   Choose a signing algorithm that is compatible with the KMS key.     When signing a message, be sure to record the KMS key and the signing algorithm. This information is required to verify the signature.  To verify the signature that this operation generates, use the Verify operation. Or use the GetPublicKey operation to download the public key and then use the public key to verify the signature outside of KMS.  The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:Sign (key policy)  Related operations: Verify 
   */
  sign(params: KMS.Types.SignRequest, callback?: (err: AWSError, data: KMS.Types.SignResponse) => void): Request<KMS.Types.SignResponse, AWSError>;
  /**
   * Creates a digital signature for a message or message digest by using the private key in an asymmetric KMS key. To verify the signature, use the Verify operation, or use the public key in the same asymmetric KMS key outside of KMS. For information about symmetric and asymmetric KMS keys, see Using Symmetric and Asymmetric KMS keys in the Key Management Service Developer Guide. Digital signatures are generated and verified by using asymmetric key pair, such as an RSA or ECC pair that is represented by an asymmetric KMS key. The key owner (or an authorized user) uses their private key to sign a message. Anyone with the public key can verify that the message was signed with that particular private key and that the message hasn't changed since it was signed.  To use the Sign operation, provide the following information:   Use the KeyId parameter to identify an asymmetric KMS key with a KeyUsage value of SIGN_VERIFY. To get the KeyUsage value of a KMS key, use the DescribeKey operation. The caller must have kms:Sign permission on the KMS key.   Use the Message parameter to specify the message or message digest to sign. You can submit messages of up to 4096 bytes. To sign a larger message, generate a hash digest of the message, and then provide the hash digest in the Message parameter. To indicate whether the message is a full message or a digest, use the MessageType parameter.   Choose a signing algorithm that is compatible with the KMS key.     When signing a message, be sure to record the KMS key and the signing algorithm. This information is required to verify the signature.  To verify the signature that this operation generates, use the Verify operation. Or use the GetPublicKey operation to download the public key and then use the public key to verify the signature outside of KMS.  The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.  Required permissions: kms:Sign (key policy)  Related operations: Verify 
   */
  sign(callback?: (err: AWSError, data: KMS.Types.SignResponse) => void): Request<KMS.Types.SignResponse, AWSError>;
  /**
   * Adds or edits tags on a customer managed key.  Tagging or untagging a KMS key can allow or deny permission to the KMS key. For details, see Using ABAC in KMS in the Key Management Service Developer Guide.  Each tag consists of a tag key and a tag value, both of which are case-sensitive strings. The tag value can be an empty (null) string. To add a tag, specify a new tag key and a tag value. To edit a tag, specify an existing tag key and a new tag value. You can use this operation to tag a customer managed key, but you cannot tag an Amazon Web Services managed key, an Amazon Web Services owned key, a custom key store, or an alias. You can also add tags to a KMS key while creating it (CreateKey) or replicating it (ReplicateKey). For information about using tags in KMS, see Tagging keys. For general information about tags, including the format and syntax, see Tagging Amazon Web Services resources in the Amazon Web Services General Reference.  The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.   Required permissions: kms:TagResource (key policy)  Related operations     CreateKey     ListResourceTags     ReplicateKey     UntagResource   
   */
  tagResource(params: KMS.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or edits tags on a customer managed key.  Tagging or untagging a KMS key can allow or deny permission to the KMS key. For details, see Using ABAC in KMS in the Key Management Service Developer Guide.  Each tag consists of a tag key and a tag value, both of which are case-sensitive strings. The tag value can be an empty (null) string. To add a tag, specify a new tag key and a tag value. To edit a tag, specify an existing tag key and a new tag value. You can use this operation to tag a customer managed key, but you cannot tag an Amazon Web Services managed key, an Amazon Web Services owned key, a custom key store, or an alias. You can also add tags to a KMS key while creating it (CreateKey) or replicating it (ReplicateKey). For information about using tags in KMS, see Tagging keys. For general information about tags, including the format and syntax, see Tagging Amazon Web Services resources in the Amazon Web Services General Reference.  The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.   Required permissions: kms:TagResource (key policy)  Related operations     CreateKey     ListResourceTags     ReplicateKey     UntagResource   
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes tags from a customer managed key. To delete a tag, specify the tag key and the KMS key.  Tagging or untagging a KMS key can allow or deny permission to the KMS key. For details, see Using ABAC in KMS in the Key Management Service Developer Guide.  When it succeeds, the UntagResource operation doesn't return any output. Also, if the specified tag key isn't found on the KMS key, it doesn't throw an exception or return a response. To confirm that the operation worked, use the ListResourceTags operation. For information about using tags in KMS, see Tagging keys. For general information about tags, including the format and syntax, see Tagging Amazon Web Services resources in the Amazon Web Services General Reference.  The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:UntagResource (key policy)  Related operations     CreateKey     ListResourceTags     ReplicateKey     TagResource   
   */
  untagResource(params: KMS.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes tags from a customer managed key. To delete a tag, specify the tag key and the KMS key.  Tagging or untagging a KMS key can allow or deny permission to the KMS key. For details, see Using ABAC in KMS in the Key Management Service Developer Guide.  When it succeeds, the UntagResource operation doesn't return any output. Also, if the specified tag key isn't found on the KMS key, it doesn't throw an exception or return a response. To confirm that the operation worked, use the ListResourceTags operation. For information about using tags in KMS, see Tagging keys. For general information about tags, including the format and syntax, see Tagging Amazon Web Services resources in the Amazon Web Services General Reference.  The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.  Required permissions: kms:UntagResource (key policy)  Related operations     CreateKey     ListResourceTags     ReplicateKey     TagResource   
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates an existing KMS alias with a different KMS key. Each alias is associated with only one KMS key at a time, although a KMS key can have multiple aliases. The alias and the KMS key must be in the same Amazon Web Services account and Region.  Adding, deleting, or updating an alias can allow or deny permission to the KMS key. For details, see Using ABAC in KMS in the Key Management Service Developer Guide.  The current and new KMS key must be the same type (both symmetric or both asymmetric), and they must have the same key usage (ENCRYPT_DECRYPT or SIGN_VERIFY). This restriction prevents errors in code that uses aliases. If you must assign an alias to a different type of KMS key, use DeleteAlias to delete the old alias and CreateAlias to create a new alias. You cannot use UpdateAlias to change an alias name. To change an alias name, use DeleteAlias to delete the old alias and CreateAlias to create a new alias. Because an alias is not a property of a KMS key, you can create, update, and delete the aliases of a KMS key without affecting the KMS key. Also, aliases do not appear in the response from the DescribeKey operation. To get the aliases of all KMS keys in the account, use the ListAliases operation.  The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.   Required permissions     kms:UpdateAlias on the alias (IAM policy).    kms:UpdateAlias on the current KMS key (key policy).    kms:UpdateAlias on the new KMS key (key policy).   For details, see Controlling access to aliases in the Key Management Service Developer Guide.  Related operations:     CreateAlias     DeleteAlias     ListAliases   
   */
  updateAlias(params: KMS.Types.UpdateAliasRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates an existing KMS alias with a different KMS key. Each alias is associated with only one KMS key at a time, although a KMS key can have multiple aliases. The alias and the KMS key must be in the same Amazon Web Services account and Region.  Adding, deleting, or updating an alias can allow or deny permission to the KMS key. For details, see Using ABAC in KMS in the Key Management Service Developer Guide.  The current and new KMS key must be the same type (both symmetric or both asymmetric), and they must have the same key usage (ENCRYPT_DECRYPT or SIGN_VERIFY). This restriction prevents errors in code that uses aliases. If you must assign an alias to a different type of KMS key, use DeleteAlias to delete the old alias and CreateAlias to create a new alias. You cannot use UpdateAlias to change an alias name. To change an alias name, use DeleteAlias to delete the old alias and CreateAlias to create a new alias. Because an alias is not a property of a KMS key, you can create, update, and delete the aliases of a KMS key without affecting the KMS key. Also, aliases do not appear in the response from the DescribeKey operation. To get the aliases of all KMS keys in the account, use the ListAliases operation.  The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.   Required permissions     kms:UpdateAlias on the alias (IAM policy).    kms:UpdateAlias on the current KMS key (key policy).    kms:UpdateAlias on the new KMS key (key policy).   For details, see Controlling access to aliases in the Key Management Service Developer Guide.  Related operations:     CreateAlias     DeleteAlias     ListAliases   
   */
  updateAlias(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the properties of a custom key store. Use the CustomKeyStoreId parameter to identify the custom key store you want to edit. Use the remaining parameters to change the properties of the custom key store. You can only update a custom key store that is disconnected. To disconnect the custom key store, use DisconnectCustomKeyStore. To reconnect the custom key store after the update completes, use ConnectCustomKeyStore. To find the connection state of a custom key store, use the DescribeCustomKeyStores operation. The CustomKeyStoreId parameter is required in all commands. Use the other parameters of UpdateCustomKeyStore to edit your key store settings.   Use the NewCustomKeyStoreName parameter to change the friendly name of the custom key store to the value that you specify.     Use the KeyStorePassword parameter tell KMS the current password of the  kmsuser crypto user (CU) in the associated CloudHSM cluster. You can use this parameter to fix connection failures that occur when KMS cannot log into the associated cluster because the kmsuser password has changed. This value does not change the password in the CloudHSM cluster.     Use the CloudHsmClusterId parameter to associate the custom key store with a different, but related, CloudHSM cluster. You can use this parameter to repair a custom key store if its CloudHSM cluster becomes corrupted or is deleted, or when you need to create or restore a cluster from a backup.    If the operation succeeds, it returns a JSON object with no properties. This operation is part of the Custom Key Store feature feature in KMS, which combines the convenience and extensive integration of KMS with the isolation and control of a single-tenant key store.  Cross-account use: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.   Required permissions: kms:UpdateCustomKeyStore (IAM policy)  Related operations:     ConnectCustomKeyStore     CreateCustomKeyStore     DeleteCustomKeyStore     DescribeCustomKeyStores     DisconnectCustomKeyStore   
   */
  updateCustomKeyStore(params: KMS.Types.UpdateCustomKeyStoreRequest, callback?: (err: AWSError, data: KMS.Types.UpdateCustomKeyStoreResponse) => void): Request<KMS.Types.UpdateCustomKeyStoreResponse, AWSError>;
  /**
   * Changes the properties of a custom key store. Use the CustomKeyStoreId parameter to identify the custom key store you want to edit. Use the remaining parameters to change the properties of the custom key store. You can only update a custom key store that is disconnected. To disconnect the custom key store, use DisconnectCustomKeyStore. To reconnect the custom key store after the update completes, use ConnectCustomKeyStore. To find the connection state of a custom key store, use the DescribeCustomKeyStores operation. The CustomKeyStoreId parameter is required in all commands. Use the other parameters of UpdateCustomKeyStore to edit your key store settings.   Use the NewCustomKeyStoreName parameter to change the friendly name of the custom key store to the value that you specify.     Use the KeyStorePassword parameter tell KMS the current password of the  kmsuser crypto user (CU) in the associated CloudHSM cluster. You can use this parameter to fix connection failures that occur when KMS cannot log into the associated cluster because the kmsuser password has changed. This value does not change the password in the CloudHSM cluster.     Use the CloudHsmClusterId parameter to associate the custom key store with a different, but related, CloudHSM cluster. You can use this parameter to repair a custom key store if its CloudHSM cluster becomes corrupted or is deleted, or when you need to create or restore a cluster from a backup.    If the operation succeeds, it returns a JSON object with no properties. This operation is part of the Custom Key Store feature feature in KMS, which combines the convenience and extensive integration of KMS with the isolation and control of a single-tenant key store.  Cross-account use: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.   Required permissions: kms:UpdateCustomKeyStore (IAM policy)  Related operations:     ConnectCustomKeyStore     CreateCustomKeyStore     DeleteCustomKeyStore     DescribeCustomKeyStores     DisconnectCustomKeyStore   
   */
  updateCustomKeyStore(callback?: (err: AWSError, data: KMS.Types.UpdateCustomKeyStoreResponse) => void): Request<KMS.Types.UpdateCustomKeyStoreResponse, AWSError>;
  /**
   * Updates the description of a KMS key. To see the description of a KMS key, use DescribeKey.  The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.   Required permissions: kms:UpdateKeyDescription (key policy)  Related operations     CreateKey     DescribeKey   
   */
  updateKeyDescription(params: KMS.Types.UpdateKeyDescriptionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the description of a KMS key. To see the description of a KMS key, use DescribeKey.  The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.   Required permissions: kms:UpdateKeyDescription (key policy)  Related operations     CreateKey     DescribeKey   
   */
  updateKeyDescription(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the primary key of a multi-Region key.  This operation changes the replica key in the specified Region to a primary key and changes the former primary key to a replica key. For example, suppose you have a primary key in us-east-1 and a replica key in eu-west-2. If you run UpdatePrimaryRegion with a PrimaryRegion value of eu-west-2, the primary key is now the key in eu-west-2, and the key in us-east-1 becomes a replica key. For details, see Updating the primary Region in the Key Management Service Developer Guide. This operation supports multi-Region keys, an KMS feature that lets you create multiple interoperable KMS keys in different Amazon Web Services Regions. Because these KMS keys have the same key ID, key material, and other metadata, you can use them interchangeably to encrypt data in one Amazon Web Services Region and decrypt it in a different Amazon Web Services Region without re-encrypting the data or making a cross-Region call. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide. The primary key of a multi-Region key is the source for properties that are always shared by primary and replica keys, including the key material, key ID, key spec, key usage, key material origin, and automatic key rotation. It's the only key that can be replicated. You cannot delete the primary key until all replica keys are deleted. The key ID and primary Region that you specify uniquely identify the replica key that will become the primary key. The primary Region must already have a replica key. This operation does not create a KMS key in the specified Region. To find the replica keys, use the DescribeKey operation on the primary key or any replica key. To create a replica key, use the ReplicateKey operation. You can run this operation while using the affected multi-Region keys in cryptographic operations. This operation should not delay, interrupt, or cause failures in cryptographic operations.  Even after this operation completes, the process of updating the primary Region might still be in progress for a few more seconds. Operations such as DescribeKey might display both the old and new primary keys as replicas. The old and new primary keys have a transient key state of Updating. The original key state is restored when the update is complete. While the key state is Updating, you can use the keys in cryptographic operations, but you cannot replicate the new primary key or perform certain management operations, such as enabling or disabling these keys. For details about the Updating key state, see Key state: Effect on your KMS key in the Key Management Service Developer Guide. This operation does not return any output. To verify that primary key is changed, use the DescribeKey operation.  Cross-account use: No. You cannot use this operation in a different Amazon Web Services account.   Required permissions:     kms:UpdatePrimaryRegion on the current primary key (in the primary key's Region). Include this permission primary key's key policy.    kms:UpdatePrimaryRegion on the current replica key (in the replica key's Region). Include this permission in the replica key's key policy.    Related operations     CreateKey     ReplicateKey   
   */
  updatePrimaryRegion(params: KMS.Types.UpdatePrimaryRegionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the primary key of a multi-Region key.  This operation changes the replica key in the specified Region to a primary key and changes the former primary key to a replica key. For example, suppose you have a primary key in us-east-1 and a replica key in eu-west-2. If you run UpdatePrimaryRegion with a PrimaryRegion value of eu-west-2, the primary key is now the key in eu-west-2, and the key in us-east-1 becomes a replica key. For details, see Updating the primary Region in the Key Management Service Developer Guide. This operation supports multi-Region keys, an KMS feature that lets you create multiple interoperable KMS keys in different Amazon Web Services Regions. Because these KMS keys have the same key ID, key material, and other metadata, you can use them interchangeably to encrypt data in one Amazon Web Services Region and decrypt it in a different Amazon Web Services Region without re-encrypting the data or making a cross-Region call. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide. The primary key of a multi-Region key is the source for properties that are always shared by primary and replica keys, including the key material, key ID, key spec, key usage, key material origin, and automatic key rotation. It's the only key that can be replicated. You cannot delete the primary key until all replica keys are deleted. The key ID and primary Region that you specify uniquely identify the replica key that will become the primary key. The primary Region must already have a replica key. This operation does not create a KMS key in the specified Region. To find the replica keys, use the DescribeKey operation on the primary key or any replica key. To create a replica key, use the ReplicateKey operation. You can run this operation while using the affected multi-Region keys in cryptographic operations. This operation should not delay, interrupt, or cause failures in cryptographic operations.  Even after this operation completes, the process of updating the primary Region might still be in progress for a few more seconds. Operations such as DescribeKey might display both the old and new primary keys as replicas. The old and new primary keys have a transient key state of Updating. The original key state is restored when the update is complete. While the key state is Updating, you can use the keys in cryptographic operations, but you cannot replicate the new primary key or perform certain management operations, such as enabling or disabling these keys. For details about the Updating key state, see Key state: Effect on your KMS key in the Key Management Service Developer Guide. This operation does not return any output. To verify that primary key is changed, use the DescribeKey operation.  Cross-account use: No. You cannot use this operation in a different Amazon Web Services account.   Required permissions:     kms:UpdatePrimaryRegion on the current primary key (in the primary key's Region). Include this permission primary key's key policy.    kms:UpdatePrimaryRegion on the current replica key (in the replica key's Region). Include this permission in the replica key's key policy.    Related operations     CreateKey     ReplicateKey   
   */
  updatePrimaryRegion(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Verifies a digital signature that was generated by the Sign operation.   Verification confirms that an authorized user signed the message with the specified KMS key and signing algorithm, and the message hasn't changed since it was signed. If the signature is verified, the value of the SignatureValid field in the response is True. If the signature verification fails, the Verify operation fails with an KMSInvalidSignatureException exception. A digital signature is generated by using the private key in an asymmetric KMS key. The signature is verified by using the public key in the same asymmetric KMS key. For information about symmetric and asymmetric KMS keys, see Using Symmetric and Asymmetric KMS keys in the Key Management Service Developer Guide. To verify a digital signature, you can use the Verify operation. Specify the same asymmetric KMS key, message, and signing algorithm that were used to produce the signature. You can also verify the digital signature by using the public key of the KMS key outside of KMS. Use the GetPublicKey operation to download the public key in the asymmetric KMS key and then use the public key to verify the signature outside of KMS. The advantage of using the Verify operation is that it is performed within KMS. As a result, it's easy to call, the operation is performed within the FIPS boundary, it is logged in CloudTrail, and you can use key policy and IAM policy to determine who is authorized to use the KMS key to verify signatures. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.   Required permissions: kms:Verify (key policy)  Related operations: Sign 
   */
  verify(params: KMS.Types.VerifyRequest, callback?: (err: AWSError, data: KMS.Types.VerifyResponse) => void): Request<KMS.Types.VerifyResponse, AWSError>;
  /**
   * Verifies a digital signature that was generated by the Sign operation.   Verification confirms that an authorized user signed the message with the specified KMS key and signing algorithm, and the message hasn't changed since it was signed. If the signature is verified, the value of the SignatureValid field in the response is True. If the signature verification fails, the Verify operation fails with an KMSInvalidSignatureException exception. A digital signature is generated by using the private key in an asymmetric KMS key. The signature is verified by using the public key in the same asymmetric KMS key. For information about symmetric and asymmetric KMS keys, see Using Symmetric and Asymmetric KMS keys in the Key Management Service Developer Guide. To verify a digital signature, you can use the Verify operation. Specify the same asymmetric KMS key, message, and signing algorithm that were used to produce the signature. You can also verify the digital signature by using the public key of the KMS key outside of KMS. Use the GetPublicKey operation to download the public key in the asymmetric KMS key and then use the public key to verify the signature outside of KMS. The advantage of using the Verify operation is that it is performed within KMS. As a result, it's easy to call, the operation is performed within the FIPS boundary, it is logged in CloudTrail, and you can use key policy and IAM policy to determine who is authorized to use the KMS key to verify signatures. The KMS key that you use for this operation must be in a compatible key state. For details, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.  Cross-account use: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify the key ARN or alias ARN in the value of the KeyId parameter.   Required permissions: kms:Verify (key policy)  Related operations: Sign 
   */
  verify(callback?: (err: AWSError, data: KMS.Types.VerifyResponse) => void): Request<KMS.Types.VerifyResponse, AWSError>;
}
declare namespace KMS {
  export type AWSAccountIdType = string;
  export type AlgorithmSpec = "RSAES_PKCS1_V1_5"|"RSAES_OAEP_SHA_1"|"RSAES_OAEP_SHA_256"|string;
  export type AliasList = AliasListEntry[];
  export interface AliasListEntry {
    /**
     * String that contains the alias. This value begins with alias/.
     */
    AliasName?: AliasNameType;
    /**
     * String that contains the key ARN.
     */
    AliasArn?: ArnType;
    /**
     * String that contains the key identifier of the KMS key associated with the alias.
     */
    TargetKeyId?: KeyIdType;
    /**
     * Date and time that the alias was most recently created in the account and Region. Formatted as Unix time.
     */
    CreationDate?: DateType;
    /**
     * Date and time that the alias was most recently associated with a KMS key in the account and Region. Formatted as Unix time.
     */
    LastUpdatedDate?: DateType;
  }
  export type AliasNameType = string;
  export type ArnType = string;
  export type BooleanType = boolean;
  export interface CancelKeyDeletionRequest {
    /**
     * Identifies the KMS key whose deletion is being canceled. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
  }
  export interface CancelKeyDeletionResponse {
    /**
     * The Amazon Resource Name (key ARN) of the KMS key whose deletion is canceled.
     */
    KeyId?: KeyIdType;
  }
  export type CiphertextType = Buffer|Uint8Array|Blob|string;
  export type CloudHsmClusterIdType = string;
  export interface ConnectCustomKeyStoreRequest {
    /**
     * Enter the key store ID of the custom key store that you want to connect. To find the ID of a custom key store, use the DescribeCustomKeyStores operation.
     */
    CustomKeyStoreId: CustomKeyStoreIdType;
  }
  export interface ConnectCustomKeyStoreResponse {
  }
  export type ConnectionErrorCodeType = "INVALID_CREDENTIALS"|"CLUSTER_NOT_FOUND"|"NETWORK_ERRORS"|"INTERNAL_ERROR"|"INSUFFICIENT_CLOUDHSM_HSMS"|"USER_LOCKED_OUT"|"USER_NOT_FOUND"|"USER_LOGGED_IN"|"SUBNET_NOT_FOUND"|string;
  export type ConnectionStateType = "CONNECTED"|"CONNECTING"|"FAILED"|"DISCONNECTED"|"DISCONNECTING"|string;
  export interface CreateAliasRequest {
    /**
     * Specifies the alias name. This value must begin with alias/ followed by a name, such as alias/ExampleAlias.  The AliasName value must be string of 1-256 characters. It can contain only alphanumeric characters, forward slashes (/), underscores (_), and dashes (-). The alias name cannot begin with alias/aws/. The alias/aws/ prefix is reserved for Amazon Web Services managed keys.
     */
    AliasName: AliasNameType;
    /**
     * Associates the alias with the specified customer managed key. The KMS key must be in the same Amazon Web Services Region.  A valid key ID is required. If you supply a null or empty string value, this operation returns an error. For help finding the key ID and ARN, see Finding the Key ID and ARN in the  Key Management Service Developer Guide . Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    TargetKeyId: KeyIdType;
  }
  export interface CreateCustomKeyStoreRequest {
    /**
     * Specifies a friendly name for the custom key store. The name must be unique in your Amazon Web Services account.
     */
    CustomKeyStoreName: CustomKeyStoreNameType;
    /**
     * Identifies the CloudHSM cluster for the custom key store. Enter the cluster ID of any active CloudHSM cluster that is not already associated with a custom key store. To find the cluster ID, use the DescribeClusters operation.
     */
    CloudHsmClusterId: CloudHsmClusterIdType;
    /**
     * Enter the content of the trust anchor certificate for the cluster. This is the content of the customerCA.crt file that you created when you initialized the cluster.
     */
    TrustAnchorCertificate: TrustAnchorCertificateType;
    /**
     * Enter the password of the  kmsuser crypto user (CU) account in the specified CloudHSM cluster. KMS logs into the cluster as this user to manage key material on your behalf. The password must be a string of 7 to 32 characters. Its value is case sensitive. This parameter tells KMS the kmsuser account password; it does not change the password in the CloudHSM cluster.
     */
    KeyStorePassword: KeyStorePasswordType;
  }
  export interface CreateCustomKeyStoreResponse {
    /**
     * A unique identifier for the new custom key store.
     */
    CustomKeyStoreId?: CustomKeyStoreIdType;
  }
  export interface CreateGrantRequest {
    /**
     * Identifies the KMS key for the grant. The grant gives principals permission to use this KMS key. Specify the key ID or key ARN of the KMS key. To specify a KMS key in a different Amazon Web Services account, you must use the key ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
    /**
     * The identity that gets the permissions specified in the grant. To specify the principal, use the Amazon Resource Name (ARN) of an Amazon Web Services principal. Valid Amazon Web Services principals include Amazon Web Services accounts (root), IAM users, IAM roles, federated users, and assumed role users. For examples of the ARN syntax to use for specifying a principal, see Amazon Web Services Identity and Access Management (IAM) in the Example ARNs section of the Amazon Web Services General Reference.
     */
    GranteePrincipal: PrincipalIdType;
    /**
     * The principal that has permission to use the RetireGrant operation to retire the grant.  To specify the principal, use the Amazon Resource Name (ARN) of an Amazon Web Services principal. Valid Amazon Web Services principals include Amazon Web Services accounts (root), IAM users, federated users, and assumed role users. For examples of the ARN syntax to use for specifying a principal, see Amazon Web Services Identity and Access Management (IAM) in the Example ARNs section of the Amazon Web Services General Reference. The grant determines the retiring principal. Other principals might have permission to retire the grant or revoke the grant. For details, see RevokeGrant and Retiring and revoking grants in the Key Management Service Developer Guide. 
     */
    RetiringPrincipal?: PrincipalIdType;
    /**
     * A list of operations that the grant permits.  The operation must be supported on the KMS key. For example, you cannot create a grant for a symmetric KMS key that allows the Sign operation, or a grant for an asymmetric KMS key that allows the GenerateDataKey operation. If you try, KMS returns a ValidationError exception. For details, see Grant operations in the Key Management Service Developer Guide.
     */
    Operations: GrantOperationList;
    /**
     * Specifies a grant constraint.  KMS supports the EncryptionContextEquals and EncryptionContextSubset grant constraints. Each constraint value can include up to 8 encryption context pairs. The encryption context value in each constraint cannot exceed 384 characters. These grant constraints allow the permissions in the grant only when the encryption context in the request matches (EncryptionContextEquals) or includes (EncryptionContextSubset) the encryption context specified in this structure. For information about grant constraints, see Using grant constraints in the Key Management Service Developer Guide. For more information about encryption context, see Encryption Context in the  Key Management Service Developer Guide .  The encryption context grant constraints are supported only on operations that include an encryption context. You cannot use an encryption context grant constraint for cryptographic operations with asymmetric KMS keys or for management operations, such as DescribeKey or RetireGrant.
     */
    Constraints?: GrantConstraints;
    /**
     * A list of grant tokens.  Use a grant token when your permission to call this operation comes from a new grant that has not yet achieved eventual consistency. For more information, see Grant token and Using a grant token in the Key Management Service Developer Guide.
     */
    GrantTokens?: GrantTokenList;
    /**
     * A friendly name for the grant. Use this value to prevent the unintended creation of duplicate grants when retrying this request. When this value is absent, all CreateGrant requests result in a new grant with a unique GrantId even if all the supplied parameters are identical. This can result in unintended duplicates when you retry the CreateGrant request. When this value is present, you can retry a CreateGrant request with identical parameters; if the grant already exists, the original GrantId is returned without creating a new grant. Note that the returned grant token is unique with every CreateGrant request, even when a duplicate GrantId is returned. All grant tokens for the same grant ID can be used interchangeably.
     */
    Name?: GrantNameType;
  }
  export interface CreateGrantResponse {
    /**
     * The grant token. Use a grant token when your permission to call this operation comes from a new grant that has not yet achieved eventual consistency. For more information, see Grant token and Using a grant token in the Key Management Service Developer Guide.
     */
    GrantToken?: GrantTokenType;
    /**
     * The unique identifier for the grant. You can use the GrantId in a ListGrants, RetireGrant, or RevokeGrant operation.
     */
    GrantId?: GrantIdType;
  }
  export interface CreateKeyRequest {
    /**
     * The key policy to attach to the KMS key. If you provide a key policy, it must meet the following criteria:   If you don't set BypassPolicyLockoutSafetyCheck to true, the key policy must allow the principal that is making the CreateKey request to make a subsequent PutKeyPolicy request on the KMS key. This reduces the risk that the KMS key becomes unmanageable. For more information, refer to the scenario in the Default Key Policy section of the  Key Management Service Developer Guide .   Each statement in the key policy must contain one or more principals. The principals in the key policy must exist and be visible to KMS. When you create a new Amazon Web Services principal (for example, an IAM user or role), you might need to enforce a delay before including the new principal in a key policy because the new principal might not be immediately visible to KMS. For more information, see Changes that I make are not always immediately visible in the Amazon Web Services Identity and Access Management User Guide.   If you do not provide a key policy, KMS attaches a default key policy to the KMS key. For more information, see Default Key Policy in the Key Management Service Developer Guide.  The key policy size quota is 32 kilobytes (32768 bytes). For help writing and formatting a JSON policy document, see the IAM JSON Policy Reference in the  Identity and Access Management User Guide .
     */
    Policy?: PolicyType;
    /**
     * A description of the KMS key. Use a description that helps you decide whether the KMS key is appropriate for a task. The default value is an empty string (no description). To set or change the description after the key is created, use UpdateKeyDescription.
     */
    Description?: DescriptionType;
    /**
     * Determines the cryptographic operations for which you can use the KMS key. The default value is ENCRYPT_DECRYPT. This parameter is required only for asymmetric KMS keys. You can't change the KeyUsage value after the KMS key is created. Select only one valid value.   For symmetric KMS keys, omit the parameter or specify ENCRYPT_DECRYPT.   For asymmetric KMS keys with RSA key material, specify ENCRYPT_DECRYPT or SIGN_VERIFY.   For asymmetric KMS keys with ECC key material, specify SIGN_VERIFY.  
     */
    KeyUsage?: KeyUsageType;
    /**
     * Instead, use the KeySpec parameter. The KeySpec and CustomerMasterKeySpec parameters work the same way. Only the names differ. We recommend that you use KeySpec parameter in your code. However, to avoid breaking changes, KMS will support both parameters.
     */
    CustomerMasterKeySpec?: CustomerMasterKeySpec;
    /**
     * Specifies the type of KMS key to create. The default value, SYMMETRIC_DEFAULT, creates a KMS key with a 256-bit symmetric key for encryption and decryption. For help choosing a key spec for your KMS key, see How to Choose Your KMS key Configuration in the  Key Management Service Developer Guide . The KeySpec determines whether the KMS key contains a symmetric key or an asymmetric key pair. It also determines the encryption algorithms or signing algorithms that the KMS key supports. You can't change the KeySpec after the KMS key is created. To further restrict the algorithms that can be used with the KMS key, use a condition key in its key policy or IAM policy. For more information, see kms:EncryptionAlgorithm or kms:Signing Algorithm in the  Key Management Service Developer Guide .   Amazon Web Services services that are integrated with KMS use symmetric KMS keys to protect your data. These services do not support asymmetric KMS keys. For help determining whether a KMS key is symmetric or asymmetric, see Identifying Symmetric and Asymmetric KMS keys in the Key Management Service Developer Guide.  KMS supports the following key specs for KMS keys:   Symmetric key (default)    SYMMETRIC_DEFAULT (AES-256-GCM)     Asymmetric RSA key pairs    RSA_2048     RSA_3072     RSA_4096      Asymmetric NIST-recommended elliptic curve key pairs    ECC_NIST_P256 (secp256r1)    ECC_NIST_P384 (secp384r1)    ECC_NIST_P521 (secp521r1)     Other asymmetric elliptic curve key pairs    ECC_SECG_P256K1 (secp256k1), commonly used for cryptocurrencies.    
     */
    KeySpec?: KeySpec;
    /**
     * The source of the key material for the KMS key. You cannot change the origin after you create the KMS key. The default is AWS_KMS, which means that KMS creates the key material. To create a KMS key with no key material (for imported key material), set the value to EXTERNAL. For more information about importing key material into KMS, see Importing Key Material in the Key Management Service Developer Guide. This value is valid only for symmetric KMS keys. To create a KMS key in an KMS custom key store and create its key material in the associated CloudHSM cluster, set this value to AWS_CLOUDHSM. You must also use the CustomKeyStoreId parameter to identify the custom key store. This value is valid only for symmetric KMS keys.
     */
    Origin?: OriginType;
    /**
     * Creates the KMS key in the specified custom key store and the key material in its associated CloudHSM cluster. To create a KMS key in a custom key store, you must also specify the Origin parameter with a value of AWS_CLOUDHSM. The CloudHSM cluster that is associated with the custom key store must have at least two active HSMs, each in a different Availability Zone in the Region. This parameter is valid only for symmetric KMS keys and regional KMS keys. You cannot create an asymmetric KMS key or a multi-Region key in a custom key store. To find the ID of a custom key store, use the DescribeCustomKeyStores operation. The response includes the custom key store ID and the ID of the CloudHSM cluster. This operation is part of the Custom Key Store feature feature in KMS, which combines the convenience and extensive integration of KMS with the isolation and control of a single-tenant key store.
     */
    CustomKeyStoreId?: CustomKeyStoreIdType;
    /**
     * A flag to indicate whether to bypass the key policy lockout safety check.  Setting this value to true increases the risk that the KMS key becomes unmanageable. Do not set this value to true indiscriminately. For more information, refer to the scenario in the Default Key Policy section in the  Key Management Service Developer Guide .  Use this parameter only when you include a policy in the request and you intend to prevent the principal that is making the request from making a subsequent PutKeyPolicy request on the KMS key. The default value is false.
     */
    BypassPolicyLockoutSafetyCheck?: BooleanType;
    /**
     * Assigns one or more tags to the KMS key. Use this parameter to tag the KMS key when it is created. To tag an existing KMS key, use the TagResource operation.  Tagging or untagging a KMS key can allow or deny permission to the KMS key. For details, see Using ABAC in KMS in the Key Management Service Developer Guide.  To use this parameter, you must have kms:TagResource permission in an IAM policy. Each tag consists of a tag key and a tag value. Both the tag key and the tag value are required, but the tag value can be an empty (null) string. You cannot have more than one tag on a KMS key with the same tag key. If you specify an existing tag key with a different tag value, KMS replaces the current tag value with the specified one. When you add tags to an Amazon Web Services resource, Amazon Web Services generates a cost allocation report with usage and costs aggregated by tags. Tags can also be used to control access to a KMS key. For details, see Tagging Keys.
     */
    Tags?: TagList;
    /**
     * Creates a multi-Region primary key that you can replicate into other Amazon Web Services Regions. You cannot change this value after you create the KMS key.  For a multi-Region key, set this parameter to True. For a single-Region KMS key, omit this parameter or set it to False. The default value is False. This operation supports multi-Region keys, an KMS feature that lets you create multiple interoperable KMS keys in different Amazon Web Services Regions. Because these KMS keys have the same key ID, key material, and other metadata, you can use them interchangeably to encrypt data in one Amazon Web Services Region and decrypt it in a different Amazon Web Services Region without re-encrypting the data or making a cross-Region call. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide. This value creates a primary key, not a replica. To create a replica key, use the ReplicateKey operation.  You can create a symmetric or asymmetric multi-Region key, and you can create a multi-Region key with imported key material. However, you cannot create a multi-Region key in a custom key store.
     */
    MultiRegion?: NullableBooleanType;
  }
  export interface CreateKeyResponse {
    /**
     * Metadata associated with the KMS key.
     */
    KeyMetadata?: KeyMetadata;
  }
  export type CustomKeyStoreIdType = string;
  export type CustomKeyStoreNameType = string;
  export type CustomKeyStoresList = CustomKeyStoresListEntry[];
  export interface CustomKeyStoresListEntry {
    /**
     * A unique identifier for the custom key store.
     */
    CustomKeyStoreId?: CustomKeyStoreIdType;
    /**
     * The user-specified friendly name for the custom key store.
     */
    CustomKeyStoreName?: CustomKeyStoreNameType;
    /**
     * A unique identifier for the CloudHSM cluster that is associated with the custom key store.
     */
    CloudHsmClusterId?: CloudHsmClusterIdType;
    /**
     * The trust anchor certificate of the associated CloudHSM cluster. When you initialize the cluster, you create this certificate and save it in the customerCA.crt file.
     */
    TrustAnchorCertificate?: TrustAnchorCertificateType;
    /**
     * Indicates whether the custom key store is connected to its CloudHSM cluster. You can create and use KMS keys in your custom key stores only when its connection state is CONNECTED. The value is DISCONNECTED if the key store has never been connected or you use the DisconnectCustomKeyStore operation to disconnect it. If the value is CONNECTED but you are having trouble using the custom key store, make sure that its associated CloudHSM cluster is active and contains at least one active HSM. A value of FAILED indicates that an attempt to connect was unsuccessful. The ConnectionErrorCode field in the response indicates the cause of the failure. For help resolving a connection failure, see Troubleshooting a Custom Key Store in the Key Management Service Developer Guide.
     */
    ConnectionState?: ConnectionStateType;
    /**
     * Describes the connection error. This field appears in the response only when the ConnectionState is FAILED. For help resolving these errors, see How to Fix a Connection Failure in Key Management Service Developer Guide. Valid values are:    CLUSTER_NOT_FOUND - KMS cannot find the CloudHSM cluster with the specified cluster ID.    INSUFFICIENT_CLOUDHSM_HSMS - The associated CloudHSM cluster does not contain any active HSMs. To connect a custom key store to its CloudHSM cluster, the cluster must contain at least one active HSM.    INTERNAL_ERROR - KMS could not complete the request due to an internal error. Retry the request. For ConnectCustomKeyStore requests, disconnect the custom key store before trying to connect again.    INVALID_CREDENTIALS - KMS does not have the correct password for the kmsuser crypto user in the CloudHSM cluster. Before you can connect your custom key store to its CloudHSM cluster, you must change the kmsuser account password and update the key store password value for the custom key store.    NETWORK_ERRORS - Network errors are preventing KMS from connecting to the custom key store.    SUBNET_NOT_FOUND - A subnet in the CloudHSM cluster configuration was deleted. If KMS cannot find all of the subnets in the cluster configuration, attempts to connect the custom key store to the CloudHSM cluster fail. To fix this error, create a cluster from a recent backup and associate it with your custom key store. (This process creates a new cluster configuration with a VPC and private subnets.) For details, see How to Fix a Connection Failure in the Key Management Service Developer Guide.    USER_LOCKED_OUT - The kmsuser CU account is locked out of the associated CloudHSM cluster due to too many failed password attempts. Before you can connect your custom key store to its CloudHSM cluster, you must change the kmsuser account password and update the key store password value for the custom key store.    USER_LOGGED_IN - The kmsuser CU account is logged into the the associated CloudHSM cluster. This prevents KMS from rotating the kmsuser account password and logging into the cluster. Before you can connect your custom key store to its CloudHSM cluster, you must log the kmsuser CU out of the cluster. If you changed the kmsuser password to log into the cluster, you must also and update the key store password value for the custom key store. For help, see How to Log Out and Reconnect in the Key Management Service Developer Guide.    USER_NOT_FOUND - KMS cannot find a kmsuser CU account in the associated CloudHSM cluster. Before you can connect your custom key store to its CloudHSM cluster, you must create a kmsuser CU account in the cluster, and then update the key store password value for the custom key store.  
     */
    ConnectionErrorCode?: ConnectionErrorCodeType;
    /**
     * The date and time when the custom key store was created.
     */
    CreationDate?: DateType;
  }
  export type CustomerMasterKeySpec = "RSA_2048"|"RSA_3072"|"RSA_4096"|"ECC_NIST_P256"|"ECC_NIST_P384"|"ECC_NIST_P521"|"ECC_SECG_P256K1"|"SYMMETRIC_DEFAULT"|string;
  export type DataKeyPairSpec = "RSA_2048"|"RSA_3072"|"RSA_4096"|"ECC_NIST_P256"|"ECC_NIST_P384"|"ECC_NIST_P521"|"ECC_SECG_P256K1"|string;
  export type DataKeySpec = "AES_256"|"AES_128"|string;
  export type DateType = Date;
  export interface DecryptRequest {
    /**
     * Ciphertext to be decrypted. The blob includes metadata.
     */
    CiphertextBlob: CiphertextType;
    /**
     * Specifies the encryption context to use when decrypting the data. An encryption context is valid only for cryptographic operations with a symmetric KMS key. The standard asymmetric encryption algorithms that KMS uses do not support an encryption context. An encryption context is a collection of non-secret key-value pairs that represents additional authenticated data. When you use an encryption context to encrypt data, you must specify the same (an exact case-sensitive match) encryption context to decrypt the data. An encryption context is optional when encrypting with a symmetric KMS key, but it is highly recommended. For more information, see Encryption Context in the Key Management Service Developer Guide.
     */
    EncryptionContext?: EncryptionContextType;
    /**
     * A list of grant tokens.  Use a grant token when your permission to call this operation comes from a new grant that has not yet achieved eventual consistency. For more information, see Grant token and Using a grant token in the Key Management Service Developer Guide.
     */
    GrantTokens?: GrantTokenList;
    /**
     * Specifies the KMS key that KMS uses to decrypt the ciphertext. Enter a key ID of the KMS key that was used to encrypt the ciphertext.  This parameter is required only when the ciphertext was encrypted under an asymmetric KMS key. If you used a symmetric KMS key, KMS can get the KMS key from metadata that it adds to the symmetric ciphertext blob. However, it is always recommended as a best practice. This practice ensures that you use the KMS key that you intend. To specify a KMS key, use its key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix it with "alias/". To specify a KMS key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey. To get the alias name and alias ARN, use ListAliases.
     */
    KeyId?: KeyIdType;
    /**
     * Specifies the encryption algorithm that will be used to decrypt the ciphertext. Specify the same algorithm that was used to encrypt the data. If you specify a different algorithm, the Decrypt operation fails. This parameter is required only when the ciphertext was encrypted under an asymmetric KMS key. The default value, SYMMETRIC_DEFAULT, represents the only supported algorithm that is valid for symmetric KMS keys.
     */
    EncryptionAlgorithm?: EncryptionAlgorithmSpec;
  }
  export interface DecryptResponse {
    /**
     * The Amazon Resource Name (key ARN) of the KMS key that was used to decrypt the ciphertext.
     */
    KeyId?: KeyIdType;
    /**
     * Decrypted plaintext data. When you use the HTTP API or the Amazon Web Services CLI, the value is Base64-encoded. Otherwise, it is not Base64-encoded.
     */
    Plaintext?: PlaintextType;
    /**
     * The encryption algorithm that was used to decrypt the ciphertext.
     */
    EncryptionAlgorithm?: EncryptionAlgorithmSpec;
  }
  export interface DeleteAliasRequest {
    /**
     * The alias to be deleted. The alias name must begin with alias/ followed by the alias name, such as alias/ExampleAlias.
     */
    AliasName: AliasNameType;
  }
  export interface DeleteCustomKeyStoreRequest {
    /**
     * Enter the ID of the custom key store you want to delete. To find the ID of a custom key store, use the DescribeCustomKeyStores operation.
     */
    CustomKeyStoreId: CustomKeyStoreIdType;
  }
  export interface DeleteCustomKeyStoreResponse {
  }
  export interface DeleteImportedKeyMaterialRequest {
    /**
     * Identifies the KMS key from which you are deleting imported key material. The Origin of the KMS key must be EXTERNAL. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
  }
  export interface DescribeCustomKeyStoresRequest {
    /**
     * Gets only information about the specified custom key store. Enter the key store ID. By default, this operation gets information about all custom key stores in the account and Region. To limit the output to a particular custom key store, you can use either the CustomKeyStoreId or CustomKeyStoreName parameter, but not both.
     */
    CustomKeyStoreId?: CustomKeyStoreIdType;
    /**
     * Gets only information about the specified custom key store. Enter the friendly name of the custom key store. By default, this operation gets information about all custom key stores in the account and Region. To limit the output to a particular custom key store, you can use either the CustomKeyStoreId or CustomKeyStoreName parameter, but not both.
     */
    CustomKeyStoreName?: CustomKeyStoreNameType;
    /**
     * Use this parameter to specify the maximum number of items to return. When this value is present, KMS does not return more than the specified number of items, but it might return fewer.
     */
    Limit?: LimitType;
    /**
     * Use this parameter in a subsequent request after you receive a response with truncated results. Set it to the value of NextMarker from the truncated response you just received.
     */
    Marker?: MarkerType;
  }
  export interface DescribeCustomKeyStoresResponse {
    /**
     * Contains metadata about each custom key store.
     */
    CustomKeyStores?: CustomKeyStoresList;
    /**
     * When Truncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent request.
     */
    NextMarker?: MarkerType;
    /**
     * A flag that indicates whether there are more items in the list. When this value is true, the list in this response is truncated. To get more items, pass the value of the NextMarker element in thisresponse to the Marker parameter in a subsequent request.
     */
    Truncated?: BooleanType;
  }
  export interface DescribeKeyRequest {
    /**
     * Describes the specified KMS key.  If you specify a predefined Amazon Web Services alias (an Amazon Web Services alias with no key ID), KMS associates the alias with an Amazon Web Services managed key and returns its KeyId and Arn in the response. To specify a KMS key, use its key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix it with "alias/". To specify a KMS key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey. To get the alias name and alias ARN, use ListAliases.
     */
    KeyId: KeyIdType;
    /**
     * A list of grant tokens. Use a grant token when your permission to call this operation comes from a new grant that has not yet achieved eventual consistency. For more information, see Grant token and Using a grant token in the Key Management Service Developer Guide.
     */
    GrantTokens?: GrantTokenList;
  }
  export interface DescribeKeyResponse {
    /**
     * Metadata associated with the key.
     */
    KeyMetadata?: KeyMetadata;
  }
  export type DescriptionType = string;
  export interface DisableKeyRequest {
    /**
     * Identifies the KMS key to disable. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
  }
  export interface DisableKeyRotationRequest {
    /**
     * Identifies a symmetric KMS key. You cannot enable or disable automatic rotation of asymmetric KMS keys, KMS keys with imported key material, or KMS keys in a custom key store. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
  }
  export interface DisconnectCustomKeyStoreRequest {
    /**
     * Enter the ID of the custom key store you want to disconnect. To find the ID of a custom key store, use the DescribeCustomKeyStores operation.
     */
    CustomKeyStoreId: CustomKeyStoreIdType;
  }
  export interface DisconnectCustomKeyStoreResponse {
  }
  export interface EnableKeyRequest {
    /**
     * Identifies the KMS key to enable. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
  }
  export interface EnableKeyRotationRequest {
    /**
     * Identifies a symmetric KMS key. You cannot enable automatic rotation of asymmetric KMS keys, KMS keys with imported key material, or KMS keys in a custom key store. To enable or disable automatic rotation of a set of related multi-Region keys, set the property on the primary key. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
  }
  export interface EncryptRequest {
    /**
     * Identifies the KMS key to use in the encryption operation. To specify a KMS key, use its key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix it with "alias/". To specify a KMS key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey. To get the alias name and alias ARN, use ListAliases.
     */
    KeyId: KeyIdType;
    /**
     * Data to be encrypted.
     */
    Plaintext: PlaintextType;
    /**
     * Specifies the encryption context that will be used to encrypt the data. An encryption context is valid only for cryptographic operations with a symmetric KMS key. The standard asymmetric encryption algorithms that KMS uses do not support an encryption context.  An encryption context is a collection of non-secret key-value pairs that represents additional authenticated data. When you use an encryption context to encrypt data, you must specify the same (an exact case-sensitive match) encryption context to decrypt the data. An encryption context is optional when encrypting with a symmetric KMS key, but it is highly recommended. For more information, see Encryption Context in the Key Management Service Developer Guide.
     */
    EncryptionContext?: EncryptionContextType;
    /**
     * A list of grant tokens. Use a grant token when your permission to call this operation comes from a new grant that has not yet achieved eventual consistency. For more information, see Grant token and Using a grant token in the Key Management Service Developer Guide.
     */
    GrantTokens?: GrantTokenList;
    /**
     * Specifies the encryption algorithm that KMS will use to encrypt the plaintext message. The algorithm must be compatible with the KMS key that you specify. This parameter is required only for asymmetric KMS keys. The default value, SYMMETRIC_DEFAULT, is the algorithm used for symmetric KMS keys. If you are using an asymmetric KMS key, we recommend RSAES_OAEP_SHA_256.
     */
    EncryptionAlgorithm?: EncryptionAlgorithmSpec;
  }
  export interface EncryptResponse {
    /**
     * The encrypted plaintext. When you use the HTTP API or the Amazon Web Services CLI, the value is Base64-encoded. Otherwise, it is not Base64-encoded.
     */
    CiphertextBlob?: CiphertextType;
    /**
     * The Amazon Resource Name (key ARN) of the KMS key that was used to encrypt the plaintext.
     */
    KeyId?: KeyIdType;
    /**
     * The encryption algorithm that was used to encrypt the plaintext.
     */
    EncryptionAlgorithm?: EncryptionAlgorithmSpec;
  }
  export type EncryptionAlgorithmSpec = "SYMMETRIC_DEFAULT"|"RSAES_OAEP_SHA_1"|"RSAES_OAEP_SHA_256"|string;
  export type EncryptionAlgorithmSpecList = EncryptionAlgorithmSpec[];
  export type EncryptionContextKey = string;
  export type EncryptionContextType = {[key: string]: EncryptionContextValue};
  export type EncryptionContextValue = string;
  export type ExpirationModelType = "KEY_MATERIAL_EXPIRES"|"KEY_MATERIAL_DOES_NOT_EXPIRE"|string;
  export interface GenerateDataKeyPairRequest {
    /**
     * Specifies the encryption context that will be used when encrypting the private key in the data key pair. An encryption context is a collection of non-secret key-value pairs that represents additional authenticated data. When you use an encryption context to encrypt data, you must specify the same (an exact case-sensitive match) encryption context to decrypt the data. An encryption context is optional when encrypting with a symmetric KMS key, but it is highly recommended. For more information, see Encryption Context in the Key Management Service Developer Guide.
     */
    EncryptionContext?: EncryptionContextType;
    /**
     * Specifies the symmetric KMS key that encrypts the private key in the data key pair. You cannot specify an asymmetric KMS key or a KMS key in a custom key store. To get the type and origin of your KMS key, use the DescribeKey operation. To specify a KMS key, use its key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix it with "alias/". To specify a KMS key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey. To get the alias name and alias ARN, use ListAliases.
     */
    KeyId: KeyIdType;
    /**
     * Determines the type of data key pair that is generated.  The KMS rule that restricts the use of asymmetric RSA KMS keys to encrypt and decrypt or to sign and verify (but not both), and the rule that permits you to use ECC KMS keys only to sign and verify, are not effective on data key pairs, which are used outside of KMS.
     */
    KeyPairSpec: DataKeyPairSpec;
    /**
     * A list of grant tokens. Use a grant token when your permission to call this operation comes from a new grant that has not yet achieved eventual consistency. For more information, see Grant token and Using a grant token in the Key Management Service Developer Guide.
     */
    GrantTokens?: GrantTokenList;
  }
  export interface GenerateDataKeyPairResponse {
    /**
     * The encrypted copy of the private key. When you use the HTTP API or the Amazon Web Services CLI, the value is Base64-encoded. Otherwise, it is not Base64-encoded.
     */
    PrivateKeyCiphertextBlob?: CiphertextType;
    /**
     * The plaintext copy of the private key. When you use the HTTP API or the Amazon Web Services CLI, the value is Base64-encoded. Otherwise, it is not Base64-encoded.
     */
    PrivateKeyPlaintext?: PlaintextType;
    /**
     * The public key (in plaintext).
     */
    PublicKey?: PublicKeyType;
    /**
     * The Amazon Resource Name (key ARN) of the KMS key that encrypted the private key.
     */
    KeyId?: KeyIdType;
    /**
     * The type of data key pair that was generated.
     */
    KeyPairSpec?: DataKeyPairSpec;
  }
  export interface GenerateDataKeyPairWithoutPlaintextRequest {
    /**
     * Specifies the encryption context that will be used when encrypting the private key in the data key pair. An encryption context is a collection of non-secret key-value pairs that represents additional authenticated data. When you use an encryption context to encrypt data, you must specify the same (an exact case-sensitive match) encryption context to decrypt the data. An encryption context is optional when encrypting with a symmetric KMS key, but it is highly recommended. For more information, see Encryption Context in the Key Management Service Developer Guide.
     */
    EncryptionContext?: EncryptionContextType;
    /**
     * Specifies the KMS key that encrypts the private key in the data key pair. You must specify a symmetric KMS key. You cannot use an asymmetric KMS key or a KMS key in a custom key store. To get the type and origin of your KMS key, use the DescribeKey operation.  To specify a KMS key, use its key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix it with "alias/". To specify a KMS key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey. To get the alias name and alias ARN, use ListAliases.
     */
    KeyId: KeyIdType;
    /**
     * Determines the type of data key pair that is generated. The KMS rule that restricts the use of asymmetric RSA KMS keys to encrypt and decrypt or to sign and verify (but not both), and the rule that permits you to use ECC KMS keys only to sign and verify, are not effective on data key pairs, which are used outside of KMS.
     */
    KeyPairSpec: DataKeyPairSpec;
    /**
     * A list of grant tokens. Use a grant token when your permission to call this operation comes from a new grant that has not yet achieved eventual consistency. For more information, see Grant token and Using a grant token in the Key Management Service Developer Guide.
     */
    GrantTokens?: GrantTokenList;
  }
  export interface GenerateDataKeyPairWithoutPlaintextResponse {
    /**
     * The encrypted copy of the private key. When you use the HTTP API or the Amazon Web Services CLI, the value is Base64-encoded. Otherwise, it is not Base64-encoded.
     */
    PrivateKeyCiphertextBlob?: CiphertextType;
    /**
     * The public key (in plaintext).
     */
    PublicKey?: PublicKeyType;
    /**
     * The Amazon Resource Name (key ARN) of the KMS key that encrypted the private key.
     */
    KeyId?: KeyIdType;
    /**
     * The type of data key pair that was generated.
     */
    KeyPairSpec?: DataKeyPairSpec;
  }
  export interface GenerateDataKeyRequest {
    /**
     * Identifies the symmetric KMS key that encrypts the data key. To specify a KMS key, use its key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix it with "alias/". To specify a KMS key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey. To get the alias name and alias ARN, use ListAliases.
     */
    KeyId: KeyIdType;
    /**
     * Specifies the encryption context that will be used when encrypting the data key. An encryption context is a collection of non-secret key-value pairs that represents additional authenticated data. When you use an encryption context to encrypt data, you must specify the same (an exact case-sensitive match) encryption context to decrypt the data. An encryption context is optional when encrypting with a symmetric KMS key, but it is highly recommended. For more information, see Encryption Context in the Key Management Service Developer Guide.
     */
    EncryptionContext?: EncryptionContextType;
    /**
     * Specifies the length of the data key in bytes. For example, use the value 64 to generate a 512-bit data key (64 bytes is 512 bits). For 128-bit (16-byte) and 256-bit (32-byte) data keys, use the KeySpec parameter. You must specify either the KeySpec or the NumberOfBytes parameter (but not both) in every GenerateDataKey request.
     */
    NumberOfBytes?: NumberOfBytesType;
    /**
     * Specifies the length of the data key. Use AES_128 to generate a 128-bit symmetric key, or AES_256 to generate a 256-bit symmetric key. You must specify either the KeySpec or the NumberOfBytes parameter (but not both) in every GenerateDataKey request.
     */
    KeySpec?: DataKeySpec;
    /**
     * A list of grant tokens. Use a grant token when your permission to call this operation comes from a new grant that has not yet achieved eventual consistency. For more information, see Grant token and Using a grant token in the Key Management Service Developer Guide.
     */
    GrantTokens?: GrantTokenList;
  }
  export interface GenerateDataKeyResponse {
    /**
     * The encrypted copy of the data key. When you use the HTTP API or the Amazon Web Services CLI, the value is Base64-encoded. Otherwise, it is not Base64-encoded.
     */
    CiphertextBlob?: CiphertextType;
    /**
     * The plaintext data key. When you use the HTTP API or the Amazon Web Services CLI, the value is Base64-encoded. Otherwise, it is not Base64-encoded. Use this data key to encrypt your data outside of KMS. Then, remove it from memory as soon as possible.
     */
    Plaintext?: PlaintextType;
    /**
     * The Amazon Resource Name (key ARN) of the KMS key that encrypted the data key.
     */
    KeyId?: KeyIdType;
  }
  export interface GenerateDataKeyWithoutPlaintextRequest {
    /**
     * The identifier of the symmetric KMS key that encrypts the data key. To specify a KMS key, use its key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix it with "alias/". To specify a KMS key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey. To get the alias name and alias ARN, use ListAliases.
     */
    KeyId: KeyIdType;
    /**
     * Specifies the encryption context that will be used when encrypting the data key. An encryption context is a collection of non-secret key-value pairs that represents additional authenticated data. When you use an encryption context to encrypt data, you must specify the same (an exact case-sensitive match) encryption context to decrypt the data. An encryption context is optional when encrypting with a symmetric KMS key, but it is highly recommended. For more information, see Encryption Context in the Key Management Service Developer Guide.
     */
    EncryptionContext?: EncryptionContextType;
    /**
     * The length of the data key. Use AES_128 to generate a 128-bit symmetric key, or AES_256 to generate a 256-bit symmetric key.
     */
    KeySpec?: DataKeySpec;
    /**
     * The length of the data key in bytes. For example, use the value 64 to generate a 512-bit data key (64 bytes is 512 bits). For common key lengths (128-bit and 256-bit symmetric keys), we recommend that you use the KeySpec field instead of this one.
     */
    NumberOfBytes?: NumberOfBytesType;
    /**
     * A list of grant tokens. Use a grant token when your permission to call this operation comes from a new grant that has not yet achieved eventual consistency. For more information, see Grant token and Using a grant token in the Key Management Service Developer Guide.
     */
    GrantTokens?: GrantTokenList;
  }
  export interface GenerateDataKeyWithoutPlaintextResponse {
    /**
     * The encrypted data key. When you use the HTTP API or the Amazon Web Services CLI, the value is Base64-encoded. Otherwise, it is not Base64-encoded.
     */
    CiphertextBlob?: CiphertextType;
    /**
     * The Amazon Resource Name (key ARN) of the KMS key that encrypted the data key.
     */
    KeyId?: KeyIdType;
  }
  export interface GenerateRandomRequest {
    /**
     * The length of the byte string.
     */
    NumberOfBytes?: NumberOfBytesType;
    /**
     * Generates the random byte string in the CloudHSM cluster that is associated with the specified custom key store. To find the ID of a custom key store, use the DescribeCustomKeyStores operation.
     */
    CustomKeyStoreId?: CustomKeyStoreIdType;
  }
  export interface GenerateRandomResponse {
    /**
     * The random byte string. When you use the HTTP API or the Amazon Web Services CLI, the value is Base64-encoded. Otherwise, it is not Base64-encoded.
     */
    Plaintext?: PlaintextType;
  }
  export interface GetKeyPolicyRequest {
    /**
     * Gets the key policy for the specified KMS key. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
    /**
     * Specifies the name of the key policy. The only valid name is default. To get the names of key policies, use ListKeyPolicies.
     */
    PolicyName: PolicyNameType;
  }
  export interface GetKeyPolicyResponse {
    /**
     * A key policy document in JSON format.
     */
    Policy?: PolicyType;
  }
  export interface GetKeyRotationStatusRequest {
    /**
     * Gets the rotation status for the specified KMS key. Specify the key ID or key ARN of the KMS key. To specify a KMS key in a different Amazon Web Services account, you must use the key ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
  }
  export interface GetKeyRotationStatusResponse {
    /**
     * A Boolean value that specifies whether key rotation is enabled.
     */
    KeyRotationEnabled?: BooleanType;
  }
  export interface GetParametersForImportRequest {
    /**
     * The identifier of the symmetric KMS key into which you will import key material. The Origin of the KMS key must be EXTERNAL. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
    /**
     * The algorithm you will use to encrypt the key material before importing it with ImportKeyMaterial. For more information, see Encrypt the Key Material in the Key Management Service Developer Guide.
     */
    WrappingAlgorithm: AlgorithmSpec;
    /**
     * The type of wrapping key (public key) to return in the response. Only 2048-bit RSA public keys are supported.
     */
    WrappingKeySpec: WrappingKeySpec;
  }
  export interface GetParametersForImportResponse {
    /**
     * The Amazon Resource Name (key ARN) of the KMS key to use in a subsequent ImportKeyMaterial request. This is the same KMS key specified in the GetParametersForImport request.
     */
    KeyId?: KeyIdType;
    /**
     * The import token to send in a subsequent ImportKeyMaterial request.
     */
    ImportToken?: CiphertextType;
    /**
     * The public key to use to encrypt the key material before importing it with ImportKeyMaterial.
     */
    PublicKey?: PlaintextType;
    /**
     * The time at which the import token and public key are no longer valid. After this time, you cannot use them to make an ImportKeyMaterial request and you must send another GetParametersForImport request to get new ones.
     */
    ParametersValidTo?: DateType;
  }
  export interface GetPublicKeyRequest {
    /**
     * Identifies the asymmetric KMS key that includes the public key. To specify a KMS key, use its key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix it with "alias/". To specify a KMS key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey. To get the alias name and alias ARN, use ListAliases.
     */
    KeyId: KeyIdType;
    /**
     * A list of grant tokens. Use a grant token when your permission to call this operation comes from a new grant that has not yet achieved eventual consistency. For more information, see Grant token and Using a grant token in the Key Management Service Developer Guide.
     */
    GrantTokens?: GrantTokenList;
  }
  export interface GetPublicKeyResponse {
    /**
     * The Amazon Resource Name (key ARN) of the asymmetric KMS key from which the public key was downloaded.
     */
    KeyId?: KeyIdType;
    /**
     * The exported public key.  The value is a DER-encoded X.509 public key, also known as SubjectPublicKeyInfo (SPKI), as defined in RFC 5280. When you use the HTTP API or the Amazon Web Services CLI, the value is Base64-encoded. Otherwise, it is not Base64-encoded. 
     */
    PublicKey?: PublicKeyType;
    /**
     * Instead, use the KeySpec field in the GetPublicKey response. The KeySpec and CustomerMasterKeySpec fields have the same value. We recommend that you use the KeySpec field in your code. However, to avoid breaking changes, KMS will support both fields.
     */
    CustomerMasterKeySpec?: CustomerMasterKeySpec;
    /**
     * The type of the of the public key that was downloaded.
     */
    KeySpec?: KeySpec;
    /**
     * The permitted use of the public key. Valid values are ENCRYPT_DECRYPT or SIGN_VERIFY.  This information is critical. If a public key with SIGN_VERIFY key usage encrypts data outside of KMS, the ciphertext cannot be decrypted. 
     */
    KeyUsage?: KeyUsageType;
    /**
     * The encryption algorithms that KMS supports for this key.  This information is critical. If a public key encrypts data outside of KMS by using an unsupported encryption algorithm, the ciphertext cannot be decrypted.  This field appears in the response only when the KeyUsage of the public key is ENCRYPT_DECRYPT.
     */
    EncryptionAlgorithms?: EncryptionAlgorithmSpecList;
    /**
     * The signing algorithms that KMS supports for this key. This field appears in the response only when the KeyUsage of the public key is SIGN_VERIFY.
     */
    SigningAlgorithms?: SigningAlgorithmSpecList;
  }
  export interface GrantConstraints {
    /**
     * A list of key-value pairs that must be included in the encryption context of the cryptographic operation request. The grant allows the cryptographic operation only when the encryption context in the request includes the key-value pairs specified in this constraint, although it can include additional key-value pairs.
     */
    EncryptionContextSubset?: EncryptionContextType;
    /**
     * A list of key-value pairs that must match the encryption context in the cryptographic operation request. The grant allows the operation only when the encryption context in the request is the same as the encryption context specified in this constraint.
     */
    EncryptionContextEquals?: EncryptionContextType;
  }
  export type GrantIdType = string;
  export type GrantList = GrantListEntry[];
  export interface GrantListEntry {
    /**
     * The unique identifier for the KMS key to which the grant applies.
     */
    KeyId?: KeyIdType;
    /**
     * The unique identifier for the grant.
     */
    GrantId?: GrantIdType;
    /**
     * The friendly name that identifies the grant. If a name was provided in the CreateGrant request, that name is returned. Otherwise this value is null.
     */
    Name?: GrantNameType;
    /**
     * The date and time when the grant was created.
     */
    CreationDate?: DateType;
    /**
     * The identity that gets the permissions in the grant. The GranteePrincipal field in the ListGrants response usually contains the user or role designated as the grantee principal in the grant. However, when the grantee principal in the grant is an Amazon Web Services service, the GranteePrincipal field contains the service principal, which might represent several different grantee principals.
     */
    GranteePrincipal?: PrincipalIdType;
    /**
     * The principal that can retire the grant.
     */
    RetiringPrincipal?: PrincipalIdType;
    /**
     * The Amazon Web Services account under which the grant was issued.
     */
    IssuingAccount?: PrincipalIdType;
    /**
     * The list of operations permitted by the grant.
     */
    Operations?: GrantOperationList;
    /**
     * A list of key-value pairs that must be present in the encryption context of certain subsequent operations that the grant allows.
     */
    Constraints?: GrantConstraints;
  }
  export type GrantNameType = string;
  export type GrantOperation = "Decrypt"|"Encrypt"|"GenerateDataKey"|"GenerateDataKeyWithoutPlaintext"|"ReEncryptFrom"|"ReEncryptTo"|"Sign"|"Verify"|"GetPublicKey"|"CreateGrant"|"RetireGrant"|"DescribeKey"|"GenerateDataKeyPair"|"GenerateDataKeyPairWithoutPlaintext"|string;
  export type GrantOperationList = GrantOperation[];
  export type GrantTokenList = GrantTokenType[];
  export type GrantTokenType = string;
  export interface ImportKeyMaterialRequest {
    /**
     * The identifier of the symmetric KMS key that receives the imported key material. The KMS key's Origin must be EXTERNAL. This must be the same KMS key specified in the KeyID parameter of the corresponding GetParametersForImport request. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
    /**
     * The import token that you received in the response to a previous GetParametersForImport request. It must be from the same response that contained the public key that you used to encrypt the key material.
     */
    ImportToken: CiphertextType;
    /**
     * The encrypted key material to import. The key material must be encrypted with the public wrapping key that GetParametersForImport returned, using the wrapping algorithm that you specified in the same GetParametersForImport request.
     */
    EncryptedKeyMaterial: CiphertextType;
    /**
     * The time at which the imported key material expires. When the key material expires, KMS deletes the key material and the KMS key becomes unusable. You must omit this parameter when the ExpirationModel parameter is set to KEY_MATERIAL_DOES_NOT_EXPIRE. Otherwise it is required.
     */
    ValidTo?: DateType;
    /**
     * Specifies whether the key material expires. The default is KEY_MATERIAL_EXPIRES, in which case you must include the ValidTo parameter. When this parameter is set to KEY_MATERIAL_DOES_NOT_EXPIRE, you must omit the ValidTo parameter.
     */
    ExpirationModel?: ExpirationModelType;
  }
  export interface ImportKeyMaterialResponse {
  }
  export type KeyIdType = string;
  export type KeyList = KeyListEntry[];
  export interface KeyListEntry {
    /**
     * Unique identifier of the key.
     */
    KeyId?: KeyIdType;
    /**
     * ARN of the key.
     */
    KeyArn?: ArnType;
  }
  export type KeyManagerType = "AWS"|"CUSTOMER"|string;
  export interface KeyMetadata {
    /**
     * The twelve-digit account ID of the Amazon Web Services account that owns the KMS key.
     */
    AWSAccountId?: AWSAccountIdType;
    /**
     * The globally unique identifier for the KMS key.
     */
    KeyId: KeyIdType;
    /**
     * The Amazon Resource Name (ARN) of the KMS key. For examples, see Key Management Service (KMS) in the Example ARNs section of the Amazon Web Services General Reference.
     */
    Arn?: ArnType;
    /**
     * The date and time when the KMS key was created.
     */
    CreationDate?: DateType;
    /**
     * Specifies whether the KMS key is enabled. When KeyState is Enabled this value is true, otherwise it is false.
     */
    Enabled?: BooleanType;
    /**
     * The description of the KMS key.
     */
    Description?: DescriptionType;
    /**
     * The cryptographic operations for which you can use the KMS key.
     */
    KeyUsage?: KeyUsageType;
    /**
     * The current status of the KMS key. For more information about how key state affects the use of a KMS key, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.
     */
    KeyState?: KeyState;
    /**
     * The date and time after which KMS deletes this KMS key. This value is present only when the KMS key is scheduled for deletion, that is, when its KeyState is PendingDeletion. When the primary key in a multi-Region key is scheduled for deletion but still has replica keys, its key state is PendingReplicaDeletion and the length of its waiting period is displayed in the PendingDeletionWindowInDays field.
     */
    DeletionDate?: DateType;
    /**
     * The time at which the imported key material expires. When the key material expires, KMS deletes the key material and the KMS key becomes unusable. This value is present only for KMS keys whose Origin is EXTERNAL and whose ExpirationModel is KEY_MATERIAL_EXPIRES, otherwise this value is omitted.
     */
    ValidTo?: DateType;
    /**
     * The source of the key material for the KMS key. When this value is AWS_KMS, KMS created the key material. When this value is EXTERNAL, the key material was imported or the KMS key doesn't have any key material. When this value is AWS_CLOUDHSM, the key material was created in the CloudHSM cluster associated with a custom key store.
     */
    Origin?: OriginType;
    /**
     * A unique identifier for the custom key store that contains the KMS key. This value is present only when the KMS key is created in a custom key store.
     */
    CustomKeyStoreId?: CustomKeyStoreIdType;
    /**
     * The cluster ID of the CloudHSM cluster that contains the key material for the KMS key. When you create a KMS key in a custom key store, KMS creates the key material for the KMS key in the associated CloudHSM cluster. This value is present only when the KMS key is created in a custom key store.
     */
    CloudHsmClusterId?: CloudHsmClusterIdType;
    /**
     * Specifies whether the KMS key's key material expires. This value is present only when Origin is EXTERNAL, otherwise this value is omitted.
     */
    ExpirationModel?: ExpirationModelType;
    /**
     * The manager of the KMS key. KMS keys in your Amazon Web Services account are either customer managed or Amazon Web Services managed. For more information about the difference, see KMS keys in the Key Management Service Developer Guide.
     */
    KeyManager?: KeyManagerType;
    /**
     * Instead, use the KeySpec field. The KeySpec and CustomerMasterKeySpec fields have the same value. We recommend that you use the KeySpec field in your code. However, to avoid breaking changes, KMS will support both fields.
     */
    CustomerMasterKeySpec?: CustomerMasterKeySpec;
    /**
     * Describes the type of key material in the KMS key.
     */
    KeySpec?: KeySpec;
    /**
     * The encryption algorithms that the KMS key supports. You cannot use the KMS key with other encryption algorithms within KMS. This value is present only when the KeyUsage of the KMS key is ENCRYPT_DECRYPT.
     */
    EncryptionAlgorithms?: EncryptionAlgorithmSpecList;
    /**
     * The signing algorithms that the KMS key supports. You cannot use the KMS key with other signing algorithms within KMS. This field appears only when the KeyUsage of the KMS key is SIGN_VERIFY.
     */
    SigningAlgorithms?: SigningAlgorithmSpecList;
    /**
     * Indicates whether the KMS key is a multi-Region (True) or regional (False) key. This value is True for multi-Region primary and replica keys and False for regional KMS keys. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide.
     */
    MultiRegion?: NullableBooleanType;
    /**
     * Lists the primary and replica keys in same multi-Region key. This field is present only when the value of the MultiRegion field is True. For more information about any listed KMS key, use the DescribeKey operation.    MultiRegionKeyType indicates whether the KMS key is a PRIMARY or REPLICA key.    PrimaryKey displays the key ARN and Region of the primary key. This field displays the current KMS key if it is the primary key.    ReplicaKeys displays the key ARNs and Regions of all replica keys. This field includes the current KMS key if it is a replica key.  
     */
    MultiRegionConfiguration?: MultiRegionConfiguration;
    /**
     * The waiting period before the primary key in a multi-Region key is deleted. This waiting period begins when the last of its replica keys is deleted. This value is present only when the KeyState of the KMS key is PendingReplicaDeletion. That indicates that the KMS key is the primary key in a multi-Region key, it is scheduled for deletion, and it still has existing replica keys. When a single-Region KMS key or a multi-Region replica key is scheduled for deletion, its deletion date is displayed in the DeletionDate field. However, when the primary key in a multi-Region key is scheduled for deletion, its waiting period doesn't begin until all of its replica keys are deleted. This value displays that waiting period. When the last replica key in the multi-Region key is deleted, the KeyState of the scheduled primary key changes from PendingReplicaDeletion to PendingDeletion and the deletion date appears in the DeletionDate field.
     */
    PendingDeletionWindowInDays?: PendingWindowInDaysType;
  }
  export type KeySpec = "RSA_2048"|"RSA_3072"|"RSA_4096"|"ECC_NIST_P256"|"ECC_NIST_P384"|"ECC_NIST_P521"|"ECC_SECG_P256K1"|"SYMMETRIC_DEFAULT"|string;
  export type KeyState = "Creating"|"Enabled"|"Disabled"|"PendingDeletion"|"PendingImport"|"PendingReplicaDeletion"|"Unavailable"|"Updating"|string;
  export type KeyStorePasswordType = string;
  export type KeyUsageType = "SIGN_VERIFY"|"ENCRYPT_DECRYPT"|string;
  export type LimitType = number;
  export interface ListAliasesRequest {
    /**
     * Lists only aliases that are associated with the specified KMS key. Enter a KMS key in your Amazon Web Services account.  This parameter is optional. If you omit it, ListAliases returns all aliases in the account and Region. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId?: KeyIdType;
    /**
     * Use this parameter to specify the maximum number of items to return. When this value is present, KMS does not return more than the specified number of items, but it might return fewer. This value is optional. If you include a value, it must be between 1 and 100, inclusive. If you do not include a value, it defaults to 50.
     */
    Limit?: LimitType;
    /**
     * Use this parameter in a subsequent request after you receive a response with truncated results. Set it to the value of NextMarker from the truncated response you just received.
     */
    Marker?: MarkerType;
  }
  export interface ListAliasesResponse {
    /**
     * A list of aliases.
     */
    Aliases?: AliasList;
    /**
     * When Truncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent request.
     */
    NextMarker?: MarkerType;
    /**
     * A flag that indicates whether there are more items in the list. When this value is true, the list in this response is truncated. To get more items, pass the value of the NextMarker element in thisresponse to the Marker parameter in a subsequent request.
     */
    Truncated?: BooleanType;
  }
  export interface ListGrantsRequest {
    /**
     * Use this parameter to specify the maximum number of items to return. When this value is present, KMS does not return more than the specified number of items, but it might return fewer. This value is optional. If you include a value, it must be between 1 and 100, inclusive. If you do not include a value, it defaults to 50.
     */
    Limit?: LimitType;
    /**
     * Use this parameter in a subsequent request after you receive a response with truncated results. Set it to the value of NextMarker from the truncated response you just received.
     */
    Marker?: MarkerType;
    /**
     * Returns only grants for the specified KMS key. This parameter is required. Specify the key ID or key ARN of the KMS key. To specify a KMS key in a different Amazon Web Services account, you must use the key ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
    /**
     * Returns only the grant with the specified grant ID. The grant ID uniquely identifies the grant. 
     */
    GrantId?: GrantIdType;
    /**
     * Returns only grants where the specified principal is the grantee principal for the grant.
     */
    GranteePrincipal?: PrincipalIdType;
  }
  export interface ListGrantsResponse {
    /**
     * A list of grants.
     */
    Grants?: GrantList;
    /**
     * When Truncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent request.
     */
    NextMarker?: MarkerType;
    /**
     * A flag that indicates whether there are more items in the list. When this value is true, the list in this response is truncated. To get more items, pass the value of the NextMarker element in thisresponse to the Marker parameter in a subsequent request.
     */
    Truncated?: BooleanType;
  }
  export interface ListKeyPoliciesRequest {
    /**
     * Gets the names of key policies for the specified KMS key. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
    /**
     * Use this parameter to specify the maximum number of items to return. When this value is present, KMS does not return more than the specified number of items, but it might return fewer. This value is optional. If you include a value, it must be between 1 and 1000, inclusive. If you do not include a value, it defaults to 100. Only one policy can be attached to a key.
     */
    Limit?: LimitType;
    /**
     * Use this parameter in a subsequent request after you receive a response with truncated results. Set it to the value of NextMarker from the truncated response you just received.
     */
    Marker?: MarkerType;
  }
  export interface ListKeyPoliciesResponse {
    /**
     * A list of key policy names. The only valid value is default.
     */
    PolicyNames?: PolicyNameList;
    /**
     * When Truncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent request.
     */
    NextMarker?: MarkerType;
    /**
     * A flag that indicates whether there are more items in the list. When this value is true, the list in this response is truncated. To get more items, pass the value of the NextMarker element in thisresponse to the Marker parameter in a subsequent request.
     */
    Truncated?: BooleanType;
  }
  export interface ListKeysRequest {
    /**
     * Use this parameter to specify the maximum number of items to return. When this value is present, KMS does not return more than the specified number of items, but it might return fewer. This value is optional. If you include a value, it must be between 1 and 1000, inclusive. If you do not include a value, it defaults to 100.
     */
    Limit?: LimitType;
    /**
     * Use this parameter in a subsequent request after you receive a response with truncated results. Set it to the value of NextMarker from the truncated response you just received.
     */
    Marker?: MarkerType;
  }
  export interface ListKeysResponse {
    /**
     * A list of KMS keys.
     */
    Keys?: KeyList;
    /**
     * When Truncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent request.
     */
    NextMarker?: MarkerType;
    /**
     * A flag that indicates whether there are more items in the list. When this value is true, the list in this response is truncated. To get more items, pass the value of the NextMarker element in thisresponse to the Marker parameter in a subsequent request.
     */
    Truncated?: BooleanType;
  }
  export interface ListResourceTagsRequest {
    /**
     * Gets tags on the specified KMS key. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
    /**
     * Use this parameter to specify the maximum number of items to return. When this value is present, KMS does not return more than the specified number of items, but it might return fewer. This value is optional. If you include a value, it must be between 1 and 50, inclusive. If you do not include a value, it defaults to 50.
     */
    Limit?: LimitType;
    /**
     * Use this parameter in a subsequent request after you receive a response with truncated results. Set it to the value of NextMarker from the truncated response you just received. Do not attempt to construct this value. Use only the value of NextMarker from the truncated response you just received.
     */
    Marker?: MarkerType;
  }
  export interface ListResourceTagsResponse {
    /**
     * A list of tags. Each tag consists of a tag key and a tag value.  Tagging or untagging a KMS key can allow or deny permission to the KMS key. For details, see Using ABAC in KMS in the Key Management Service Developer Guide. 
     */
    Tags?: TagList;
    /**
     * When Truncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent request. Do not assume or infer any information from this value.
     */
    NextMarker?: MarkerType;
    /**
     * A flag that indicates whether there are more items in the list. When this value is true, the list in this response is truncated. To get more items, pass the value of the NextMarker element in thisresponse to the Marker parameter in a subsequent request.
     */
    Truncated?: BooleanType;
  }
  export interface ListRetirableGrantsRequest {
    /**
     * Use this parameter to specify the maximum number of items to return. When this value is present, KMS does not return more than the specified number of items, but it might return fewer. This value is optional. If you include a value, it must be between 1 and 100, inclusive. If you do not include a value, it defaults to 50.
     */
    Limit?: LimitType;
    /**
     * Use this parameter in a subsequent request after you receive a response with truncated results. Set it to the value of NextMarker from the truncated response you just received.
     */
    Marker?: MarkerType;
    /**
     * The retiring principal for which to list grants. Enter a principal in your Amazon Web Services account. To specify the retiring principal, use the Amazon Resource Name (ARN) of an Amazon Web Services principal. Valid Amazon Web Services principals include Amazon Web Services accounts (root), IAM users, federated users, and assumed role users. For examples of the ARN syntax for specifying a principal, see Amazon Web Services Identity and Access Management (IAM) in the Example ARNs section of the Amazon Web Services General Reference.
     */
    RetiringPrincipal: PrincipalIdType;
  }
  export type MarkerType = string;
  export type MessageType = "RAW"|"DIGEST"|string;
  export interface MultiRegionConfiguration {
    /**
     * Indicates whether the KMS key is a PRIMARY or REPLICA key.
     */
    MultiRegionKeyType?: MultiRegionKeyType;
    /**
     * Displays the key ARN and Region of the primary key. This field includes the current KMS key if it is the primary key.
     */
    PrimaryKey?: MultiRegionKey;
    /**
     * displays the key ARNs and Regions of all replica keys. This field includes the current KMS key if it is a replica key.
     */
    ReplicaKeys?: MultiRegionKeyList;
  }
  export interface MultiRegionKey {
    /**
     * Displays the key ARN of a primary or replica key of a multi-Region key.
     */
    Arn?: ArnType;
    /**
     * Displays the Amazon Web Services Region of a primary or replica key in a multi-Region key.
     */
    Region?: RegionType;
  }
  export type MultiRegionKeyList = MultiRegionKey[];
  export type MultiRegionKeyType = "PRIMARY"|"REPLICA"|string;
  export type NullableBooleanType = boolean;
  export type NumberOfBytesType = number;
  export type OriginType = "AWS_KMS"|"EXTERNAL"|"AWS_CLOUDHSM"|string;
  export type PendingWindowInDaysType = number;
  export type PlaintextType = Buffer|Uint8Array|Blob|string;
  export type PolicyNameList = PolicyNameType[];
  export type PolicyNameType = string;
  export type PolicyType = string;
  export type PrincipalIdType = string;
  export type PublicKeyType = Buffer|Uint8Array|Blob|string;
  export interface PutKeyPolicyRequest {
    /**
     * Sets the key policy on the specified KMS key. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
    /**
     * The name of the key policy. The only valid value is default.
     */
    PolicyName: PolicyNameType;
    /**
     * The key policy to attach to the KMS key. The key policy must meet the following criteria:   If you don't set BypassPolicyLockoutSafetyCheck to true, the key policy must allow the principal that is making the PutKeyPolicy request to make a subsequent PutKeyPolicy request on the KMS key. This reduces the risk that the KMS key becomes unmanageable. For more information, refer to the scenario in the Default Key Policy section of the Key Management Service Developer Guide.   Each statement in the key policy must contain one or more principals. The principals in the key policy must exist and be visible to KMS. When you create a new Amazon Web Services principal (for example, an IAM user or role), you might need to enforce a delay before including the new principal in a key policy because the new principal might not be immediately visible to KMS. For more information, see Changes that I make are not always immediately visible in the Amazon Web Services Identity and Access Management User Guide.   The key policy cannot exceed 32 kilobytes (32768 bytes). For more information, see Resource Quotas in the Key Management Service Developer Guide.
     */
    Policy: PolicyType;
    /**
     * A flag to indicate whether to bypass the key policy lockout safety check.  Setting this value to true increases the risk that the KMS key becomes unmanageable. Do not set this value to true indiscriminately. For more information, refer to the scenario in the Default Key Policy section in the Key Management Service Developer Guide.  Use this parameter only when you intend to prevent the principal that is making the request from making a subsequent PutKeyPolicy request on the KMS key. The default value is false.
     */
    BypassPolicyLockoutSafetyCheck?: BooleanType;
  }
  export interface ReEncryptRequest {
    /**
     * Ciphertext of the data to reencrypt.
     */
    CiphertextBlob: CiphertextType;
    /**
     * Specifies the encryption context to use to decrypt the ciphertext. Enter the same encryption context that was used to encrypt the ciphertext. An encryption context is a collection of non-secret key-value pairs that represents additional authenticated data. When you use an encryption context to encrypt data, you must specify the same (an exact case-sensitive match) encryption context to decrypt the data. An encryption context is optional when encrypting with a symmetric KMS key, but it is highly recommended. For more information, see Encryption Context in the Key Management Service Developer Guide.
     */
    SourceEncryptionContext?: EncryptionContextType;
    /**
     * Specifies the KMS key that KMS will use to decrypt the ciphertext before it is re-encrypted. Enter a key ID of the KMS key that was used to encrypt the ciphertext. This parameter is required only when the ciphertext was encrypted under an asymmetric KMS key. If you used a symmetric KMS key, KMS can get the KMS key from metadata that it adds to the symmetric ciphertext blob. However, it is always recommended as a best practice. This practice ensures that you use the KMS key that you intend. To specify a KMS key, use its key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix it with "alias/". To specify a KMS key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey. To get the alias name and alias ARN, use ListAliases.
     */
    SourceKeyId?: KeyIdType;
    /**
     * A unique identifier for the KMS key that is used to reencrypt the data. Specify a symmetric or asymmetric KMS key with a KeyUsage value of ENCRYPT_DECRYPT. To find the KeyUsage value of a KMS key, use the DescribeKey operation. To specify a KMS key, use its key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix it with "alias/". To specify a KMS key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey. To get the alias name and alias ARN, use ListAliases.
     */
    DestinationKeyId: KeyIdType;
    /**
     * Specifies that encryption context to use when the reencrypting the data. A destination encryption context is valid only when the destination KMS key is a symmetric KMS key. The standard ciphertext format for asymmetric KMS keys does not include fields for metadata. An encryption context is a collection of non-secret key-value pairs that represents additional authenticated data. When you use an encryption context to encrypt data, you must specify the same (an exact case-sensitive match) encryption context to decrypt the data. An encryption context is optional when encrypting with a symmetric KMS key, but it is highly recommended. For more information, see Encryption Context in the Key Management Service Developer Guide.
     */
    DestinationEncryptionContext?: EncryptionContextType;
    /**
     * Specifies the encryption algorithm that KMS will use to decrypt the ciphertext before it is reencrypted. The default value, SYMMETRIC_DEFAULT, represents the algorithm used for symmetric KMS keys. Specify the same algorithm that was used to encrypt the ciphertext. If you specify a different algorithm, the decrypt attempt fails. This parameter is required only when the ciphertext was encrypted under an asymmetric KMS key.
     */
    SourceEncryptionAlgorithm?: EncryptionAlgorithmSpec;
    /**
     * Specifies the encryption algorithm that KMS will use to reecrypt the data after it has decrypted it. The default value, SYMMETRIC_DEFAULT, represents the encryption algorithm used for symmetric KMS keys. This parameter is required only when the destination KMS key is an asymmetric KMS key.
     */
    DestinationEncryptionAlgorithm?: EncryptionAlgorithmSpec;
    /**
     * A list of grant tokens. Use a grant token when your permission to call this operation comes from a new grant that has not yet achieved eventual consistency. For more information, see Grant token and Using a grant token in the Key Management Service Developer Guide.
     */
    GrantTokens?: GrantTokenList;
  }
  export interface ReEncryptResponse {
    /**
     * The reencrypted data. When you use the HTTP API or the Amazon Web Services CLI, the value is Base64-encoded. Otherwise, it is not Base64-encoded.
     */
    CiphertextBlob?: CiphertextType;
    /**
     * Unique identifier of the KMS key used to originally encrypt the data.
     */
    SourceKeyId?: KeyIdType;
    /**
     * The Amazon Resource Name (key ARN) of the KMS key that was used to reencrypt the data.
     */
    KeyId?: KeyIdType;
    /**
     * The encryption algorithm that was used to decrypt the ciphertext before it was reencrypted.
     */
    SourceEncryptionAlgorithm?: EncryptionAlgorithmSpec;
    /**
     * The encryption algorithm that was used to reencrypt the data.
     */
    DestinationEncryptionAlgorithm?: EncryptionAlgorithmSpec;
  }
  export type RegionType = string;
  export interface ReplicateKeyRequest {
    /**
     * Identifies the multi-Region primary key that is being replicated. To determine whether a KMS key is a multi-Region primary key, use the DescribeKey operation to check the value of the MultiRegionKeyType property. Specify the key ID or key ARN of a multi-Region primary key. For example:   Key ID: mrk-1234abcd12ab34cd56ef1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/mrk-1234abcd12ab34cd56ef1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
    /**
     * The Region ID of the Amazon Web Services Region for this replica key.  Enter the Region ID, such as us-east-1 or ap-southeast-2. For a list of Amazon Web Services Regions in which KMS is supported, see KMS service endpoints in the Amazon Web Services General Reference. The replica must be in a different Amazon Web Services Region than its primary key and other replicas of that primary key, but in the same Amazon Web Services partition. KMS must be available in the replica Region. If the Region is not enabled by default, the Amazon Web Services account must be enabled in the Region.  For information about Amazon Web Services partitions, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference. For information about enabling and disabling Regions, see Enabling a Region and Disabling a Region in the Amazon Web Services General Reference.
     */
    ReplicaRegion: RegionType;
    /**
     * The key policy to attach to the KMS key. This parameter is optional. If you do not provide a key policy, KMS attaches the default key policy to the KMS key. The key policy is not a shared property of multi-Region keys. You can specify the same key policy or a different key policy for each key in a set of related multi-Region keys. KMS does not synchronize this property. If you provide a key policy, it must meet the following criteria:   If you don't set BypassPolicyLockoutSafetyCheck to true, the key policy must give the caller kms:PutKeyPolicy permission on the replica key. This reduces the risk that the KMS key becomes unmanageable. For more information, refer to the scenario in the Default Key Policy section of the  Key Management Service Developer Guide .   Each statement in the key policy must contain one or more principals. The principals in the key policy must exist and be visible to KMS. When you create a new Amazon Web Services principal (for example, an IAM user or role), you might need to enforce a delay before including the new principal in a key policy because the new principal might not be immediately visible to KMS. For more information, see Changes that I make are not always immediately visible in the  Identity and Access Management User Guide .   The key policy size quota is 32 kilobytes (32768 bytes).  
     */
    Policy?: PolicyType;
    /**
     * A flag to indicate whether to bypass the key policy lockout safety check.  Setting this value to true increases the risk that the KMS key becomes unmanageable. Do not set this value to true indiscriminately. For more information, refer to the scenario in the Default Key Policy section in the Key Management Service Developer Guide.  Use this parameter only when you intend to prevent the principal that is making the request from making a subsequent PutKeyPolicy request on the KMS key. The default value is false.
     */
    BypassPolicyLockoutSafetyCheck?: BooleanType;
    /**
     * A description of the KMS key. The default value is an empty string (no description). The description is not a shared property of multi-Region keys. You can specify the same description or a different description for each key in a set of related multi-Region keys. KMS does not synchronize this property.
     */
    Description?: DescriptionType;
    /**
     * Assigns one or more tags to the replica key. Use this parameter to tag the KMS key when it is created. To tag an existing KMS key, use the TagResource operation.  Tagging or untagging a KMS key can allow or deny permission to the KMS key. For details, see Using ABAC in KMS in the Key Management Service Developer Guide.  To use this parameter, you must have kms:TagResource permission in an IAM policy. Tags are not a shared property of multi-Region keys. You can specify the same tags or different tags for each key in a set of related multi-Region keys. KMS does not synchronize this property. Each tag consists of a tag key and a tag value. Both the tag key and the tag value are required, but the tag value can be an empty (null) string. You cannot have more than one tag on a KMS key with the same tag key. If you specify an existing tag key with a different tag value, KMS replaces the current tag value with the specified one. When you add tags to an Amazon Web Services resource, Amazon Web Services generates a cost allocation report with usage and costs aggregated by tags. Tags can also be used to control access to a KMS key. For details, see Tagging Keys.
     */
    Tags?: TagList;
  }
  export interface ReplicateKeyResponse {
    /**
     * Displays details about the new replica key, including its Amazon Resource Name (key ARN) and key state. It also includes the ARN and Amazon Web Services Region of its primary key and other replica keys.
     */
    ReplicaKeyMetadata?: KeyMetadata;
    /**
     * The key policy of the new replica key. The value is a key policy document in JSON format.
     */
    ReplicaPolicy?: PolicyType;
    /**
     * The tags on the new replica key. The value is a list of tag key and tag value pairs.
     */
    ReplicaTags?: TagList;
  }
  export interface RetireGrantRequest {
    /**
     * Identifies the grant to be retired. You can use a grant token to identify a new grant even before it has achieved eventual consistency. Only the CreateGrant operation returns a grant token. For details, see Grant token and Eventual consistency in the Key Management Service Developer Guide.
     */
    GrantToken?: GrantTokenType;
    /**
     * The key ARN KMS key associated with the grant. To find the key ARN, use the ListKeys operation. For example: arn:aws:kms:us-east-2:444455556666:key/1234abcd-12ab-34cd-56ef-1234567890ab 
     */
    KeyId?: KeyIdType;
    /**
     * Identifies the grant to retire. To get the grant ID, use CreateGrant, ListGrants, or ListRetirableGrants.   Grant ID Example - 0123456789012345678901234567890123456789012345678901234567890123  
     */
    GrantId?: GrantIdType;
  }
  export interface RevokeGrantRequest {
    /**
     * A unique identifier for the KMS key associated with the grant. To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey. Specify the key ID or key ARN of the KMS key. To specify a KMS key in a different Amazon Web Services account, you must use the key ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
    /**
     * Identifies the grant to revoke. To get the grant ID, use CreateGrant, ListGrants, or ListRetirableGrants.
     */
    GrantId: GrantIdType;
  }
  export interface ScheduleKeyDeletionRequest {
    /**
     * The unique identifier of the KMS key to delete. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
    /**
     * The waiting period, specified in number of days. After the waiting period ends, KMS deletes the KMS key. If the KMS key is a multi-Region primary key with replicas, the waiting period begins when the last of its replica keys is deleted. Otherwise, the waiting period begins immediately. This value is optional. If you include a value, it must be between 7 and 30, inclusive. If you do not include a value, it defaults to 30.
     */
    PendingWindowInDays?: PendingWindowInDaysType;
  }
  export interface ScheduleKeyDeletionResponse {
    /**
     * The Amazon Resource Name (key ARN) of the KMS key whose deletion is scheduled.
     */
    KeyId?: KeyIdType;
    /**
     * The date and time after which KMS deletes the KMS key. If the KMS key is a multi-Region primary key with replica keys, this field does not appear. The deletion date for the primary key isn't known until its last replica key is deleted.
     */
    DeletionDate?: DateType;
    /**
     * The current status of the KMS key. For more information about how key state affects the use of a KMS key, see Key state: Effect on your KMS key in the Key Management Service Developer Guide.
     */
    KeyState?: KeyState;
    /**
     * The waiting period before the KMS key is deleted.  If the KMS key is a multi-Region primary key with replicas, the waiting period begins when the last of its replica keys is deleted. Otherwise, the waiting period begins immediately.
     */
    PendingWindowInDays?: PendingWindowInDaysType;
  }
  export interface SignRequest {
    /**
     * Identifies an asymmetric KMS key. KMS uses the private key in the asymmetric KMS key to sign the message. The KeyUsage type of the KMS key must be SIGN_VERIFY. To find the KeyUsage of a KMS key, use the DescribeKey operation. To specify a KMS key, use its key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix it with "alias/". To specify a KMS key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey. To get the alias name and alias ARN, use ListAliases.
     */
    KeyId: KeyIdType;
    /**
     * Specifies the message or message digest to sign. Messages can be 0-4096 bytes. To sign a larger message, provide the message digest. If you provide a message, KMS generates a hash digest of the message and then signs it.
     */
    Message: PlaintextType;
    /**
     * Tells KMS whether the value of the Message parameter is a message or message digest. The default value, RAW, indicates a message. To indicate a message digest, enter DIGEST.
     */
    MessageType?: MessageType;
    /**
     * A list of grant tokens. Use a grant token when your permission to call this operation comes from a new grant that has not yet achieved eventual consistency. For more information, see Grant token and Using a grant token in the Key Management Service Developer Guide.
     */
    GrantTokens?: GrantTokenList;
    /**
     * Specifies the signing algorithm to use when signing the message.  Choose an algorithm that is compatible with the type and size of the specified asymmetric KMS key.
     */
    SigningAlgorithm: SigningAlgorithmSpec;
  }
  export interface SignResponse {
    /**
     * The Amazon Resource Name (key ARN) of the asymmetric KMS key that was used to sign the message.
     */
    KeyId?: KeyIdType;
    /**
     * The cryptographic signature that was generated for the message.    When used with the supported RSA signing algorithms, the encoding of this value is defined by PKCS #1 in RFC 8017.   When used with the ECDSA_SHA_256, ECDSA_SHA_384, or ECDSA_SHA_512 signing algorithms, this value is a DER-encoded object as defined by ANS X9.62–2005 and RFC 3279 Section 2.2.3. This is the most commonly used signature format and is appropriate for most uses.    When you use the HTTP API or the Amazon Web Services CLI, the value is Base64-encoded. Otherwise, it is not Base64-encoded.
     */
    Signature?: CiphertextType;
    /**
     * The signing algorithm that was used to sign the message.
     */
    SigningAlgorithm?: SigningAlgorithmSpec;
  }
  export type SigningAlgorithmSpec = "RSASSA_PSS_SHA_256"|"RSASSA_PSS_SHA_384"|"RSASSA_PSS_SHA_512"|"RSASSA_PKCS1_V1_5_SHA_256"|"RSASSA_PKCS1_V1_5_SHA_384"|"RSASSA_PKCS1_V1_5_SHA_512"|"ECDSA_SHA_256"|"ECDSA_SHA_384"|"ECDSA_SHA_512"|string;
  export type SigningAlgorithmSpecList = SigningAlgorithmSpec[];
  export interface Tag {
    /**
     * The key of the tag.
     */
    TagKey: TagKeyType;
    /**
     * The value of the tag.
     */
    TagValue: TagValueType;
  }
  export type TagKeyList = TagKeyType[];
  export type TagKeyType = string;
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * Identifies a customer managed key in the account and Region. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
    /**
     * One or more tags.  Each tag consists of a tag key and a tag value. The tag value can be an empty (null) string.  You cannot have more than one tag on a KMS key with the same tag key. If you specify an existing tag key with a different tag value, KMS replaces the current tag value with the specified one.
     */
    Tags: TagList;
  }
  export type TagValueType = string;
  export type TrustAnchorCertificateType = string;
  export interface UntagResourceRequest {
    /**
     * Identifies the KMS key from which you are removing tags. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
    /**
     * One or more tag keys. Specify only the tag keys, not the tag values.
     */
    TagKeys: TagKeyList;
  }
  export interface UpdateAliasRequest {
    /**
     * Identifies the alias that is changing its KMS key. This value must begin with alias/ followed by the alias name, such as alias/ExampleAlias. You cannot use UpdateAlias to change the alias name.
     */
    AliasName: AliasNameType;
    /**
     * Identifies the customer managed key to associate with the alias. You don't have permission to associate an alias with an Amazon Web Services managed key. The KMS key must be in the same Amazon Web Services account and Region as the alias. Also, the new target KMS key must be the same type as the current target KMS key (both symmetric or both asymmetric) and they must have the same key usage.  Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey. To verify that the alias is mapped to the correct KMS key, use ListAliases.
     */
    TargetKeyId: KeyIdType;
  }
  export interface UpdateCustomKeyStoreRequest {
    /**
     * Identifies the custom key store that you want to update. Enter the ID of the custom key store. To find the ID of a custom key store, use the DescribeCustomKeyStores operation.
     */
    CustomKeyStoreId: CustomKeyStoreIdType;
    /**
     * Changes the friendly name of the custom key store to the value that you specify. The custom key store name must be unique in the Amazon Web Services account.
     */
    NewCustomKeyStoreName?: CustomKeyStoreNameType;
    /**
     * Enter the current password of the kmsuser crypto user (CU) in the CloudHSM cluster that is associated with the custom key store. This parameter tells KMS the current password of the kmsuser crypto user (CU). It does not set or change the password of any users in the CloudHSM cluster.
     */
    KeyStorePassword?: KeyStorePasswordType;
    /**
     * Associates the custom key store with a related CloudHSM cluster.  Enter the cluster ID of the cluster that you used to create the custom key store or a cluster that shares a backup history and has the same cluster certificate as the original cluster. You cannot use this parameter to associate a custom key store with an unrelated cluster. In addition, the replacement cluster must fulfill the requirements for a cluster associated with a custom key store. To view the cluster certificate of a cluster, use the DescribeClusters operation.
     */
    CloudHsmClusterId?: CloudHsmClusterIdType;
  }
  export interface UpdateCustomKeyStoreResponse {
  }
  export interface UpdateKeyDescriptionRequest {
    /**
     * Updates the description of the specified KMS key. Specify the key ID or key ARN of the KMS key. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
    /**
     * New description for the KMS key.
     */
    Description: DescriptionType;
  }
  export interface UpdatePrimaryRegionRequest {
    /**
     * Identifies the current primary key. When the operation completes, this KMS key will be a replica key. Specify the key ID or key ARN of a multi-Region primary key. For example:   Key ID: mrk-1234abcd12ab34cd56ef1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/mrk-1234abcd12ab34cd56ef1234567890ab    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey.
     */
    KeyId: KeyIdType;
    /**
     * The Amazon Web Services Region of the new primary key. Enter the Region ID, such as us-east-1 or ap-southeast-2. There must be an existing replica key in this Region.  When the operation completes, the multi-Region key in this Region will be the primary key.
     */
    PrimaryRegion: RegionType;
  }
  export interface VerifyRequest {
    /**
     * Identifies the asymmetric KMS key that will be used to verify the signature. This must be the same KMS key that was used to generate the signature. If you specify a different KMS key, the signature verification fails. To specify a KMS key, use its key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix it with "alias/". To specify a KMS key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias    To get the key ID and key ARN for a KMS key, use ListKeys or DescribeKey. To get the alias name and alias ARN, use ListAliases.
     */
    KeyId: KeyIdType;
    /**
     * Specifies the message that was signed. You can submit a raw message of up to 4096 bytes, or a hash digest of the message. If you submit a digest, use the MessageType parameter with a value of DIGEST. If the message specified here is different from the message that was signed, the signature verification fails. A message and its hash digest are considered to be the same message.
     */
    Message: PlaintextType;
    /**
     * Tells KMS whether the value of the Message parameter is a message or message digest. The default value, RAW, indicates a message. To indicate a message digest, enter DIGEST.  Use the DIGEST value only when the value of the Message parameter is a message digest. If you use the DIGEST value with a raw message, the security of the verification operation can be compromised. 
     */
    MessageType?: MessageType;
    /**
     * The signature that the Sign operation generated.
     */
    Signature: CiphertextType;
    /**
     * The signing algorithm that was used to sign the message. If you submit a different algorithm, the signature verification fails.
     */
    SigningAlgorithm: SigningAlgorithmSpec;
    /**
     * A list of grant tokens. Use a grant token when your permission to call this operation comes from a new grant that has not yet achieved eventual consistency. For more information, see Grant token and Using a grant token in the Key Management Service Developer Guide.
     */
    GrantTokens?: GrantTokenList;
  }
  export interface VerifyResponse {
    /**
     * The Amazon Resource Name (key ARN) of the asymmetric KMS key that was used to verify the signature.
     */
    KeyId?: KeyIdType;
    /**
     * A Boolean value that indicates whether the signature was verified. A value of True indicates that the Signature was produced by signing the Message with the specified KeyID and SigningAlgorithm. If the signature is not verified, the Verify operation fails with a KMSInvalidSignatureException exception. 
     */
    SignatureValid?: BooleanType;
    /**
     * The signing algorithm that was used to verify the signature.
     */
    SigningAlgorithm?: SigningAlgorithmSpec;
  }
  export type WrappingKeySpec = "RSA_2048"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2014-11-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the KMS client.
   */
  export import Types = KMS;
}
export = KMS;
