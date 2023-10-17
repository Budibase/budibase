import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class PaymentCryptography extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: PaymentCryptography.Types.ClientConfiguration)
  config: Config & PaymentCryptography.Types.ClientConfiguration;
  /**
   * Creates an alias, or a friendly name, for an Amazon Web Services Payment Cryptography key. You can use an alias to identify a key in the console and when you call cryptographic operations such as EncryptData or DecryptData. You can associate the alias with any key in the same Amazon Web Services Region. Each alias is associated with only one key at a time, but a key can have multiple aliases. You can't create an alias without a key. The alias must be unique in the account and Amazon Web Services Region, but you can create another alias with the same name in a different Amazon Web Services Region. To change the key that's associated with the alias, call UpdateAlias. To delete the alias, call DeleteAlias. These operations don't affect the underlying key. To get the alias that you created, call ListAliases.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     DeleteAlias     GetAlias     ListAliases     UpdateAlias   
   */
  createAlias(params: PaymentCryptography.Types.CreateAliasInput, callback?: (err: AWSError, data: PaymentCryptography.Types.CreateAliasOutput) => void): Request<PaymentCryptography.Types.CreateAliasOutput, AWSError>;
  /**
   * Creates an alias, or a friendly name, for an Amazon Web Services Payment Cryptography key. You can use an alias to identify a key in the console and when you call cryptographic operations such as EncryptData or DecryptData. You can associate the alias with any key in the same Amazon Web Services Region. Each alias is associated with only one key at a time, but a key can have multiple aliases. You can't create an alias without a key. The alias must be unique in the account and Amazon Web Services Region, but you can create another alias with the same name in a different Amazon Web Services Region. To change the key that's associated with the alias, call UpdateAlias. To delete the alias, call DeleteAlias. These operations don't affect the underlying key. To get the alias that you created, call ListAliases.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     DeleteAlias     GetAlias     ListAliases     UpdateAlias   
   */
  createAlias(callback?: (err: AWSError, data: PaymentCryptography.Types.CreateAliasOutput) => void): Request<PaymentCryptography.Types.CreateAliasOutput, AWSError>;
  /**
   * Creates an Amazon Web Services Payment Cryptography key, a logical representation of a cryptographic key, that is unique in your account and Amazon Web Services Region. You use keys for cryptographic functions such as encryption and decryption.  In addition to the key material used in cryptographic operations, an Amazon Web Services Payment Cryptography key includes metadata such as the key ARN, key usage, key origin, creation date, description, and key state. When you create a key, you specify both immutable and mutable data about the key. The immutable data contains key attributes that defines the scope and cryptographic operations that you can perform using the key, for example key class (example: SYMMETRIC_KEY), key algorithm (example: TDES_2KEY), key usage (example: TR31_P0_PIN_ENCRYPTION_KEY) and key modes of use (example: Encrypt). For information about valid combinations of key attributes, see Understanding key attributes in the Amazon Web Services Payment Cryptography User Guide. The mutable data contained within a key includes usage timestamp and key deletion timestamp and can be modified after creation. Amazon Web Services Payment Cryptography binds key attributes to keys using key blocks when you store or export them. Amazon Web Services Payment Cryptography stores the key contents wrapped and never stores or transmits them in the clear.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     DeleteKey     GetKey     ListKeys   
   */
  createKey(params: PaymentCryptography.Types.CreateKeyInput, callback?: (err: AWSError, data: PaymentCryptography.Types.CreateKeyOutput) => void): Request<PaymentCryptography.Types.CreateKeyOutput, AWSError>;
  /**
   * Creates an Amazon Web Services Payment Cryptography key, a logical representation of a cryptographic key, that is unique in your account and Amazon Web Services Region. You use keys for cryptographic functions such as encryption and decryption.  In addition to the key material used in cryptographic operations, an Amazon Web Services Payment Cryptography key includes metadata such as the key ARN, key usage, key origin, creation date, description, and key state. When you create a key, you specify both immutable and mutable data about the key. The immutable data contains key attributes that defines the scope and cryptographic operations that you can perform using the key, for example key class (example: SYMMETRIC_KEY), key algorithm (example: TDES_2KEY), key usage (example: TR31_P0_PIN_ENCRYPTION_KEY) and key modes of use (example: Encrypt). For information about valid combinations of key attributes, see Understanding key attributes in the Amazon Web Services Payment Cryptography User Guide. The mutable data contained within a key includes usage timestamp and key deletion timestamp and can be modified after creation. Amazon Web Services Payment Cryptography binds key attributes to keys using key blocks when you store or export them. Amazon Web Services Payment Cryptography stores the key contents wrapped and never stores or transmits them in the clear.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     DeleteKey     GetKey     ListKeys   
   */
  createKey(callback?: (err: AWSError, data: PaymentCryptography.Types.CreateKeyOutput) => void): Request<PaymentCryptography.Types.CreateKeyOutput, AWSError>;
  /**
   * Deletes the alias, but doesn't affect the underlying key. Each key can have multiple aliases. To get the aliases of all keys, use the ListAliases operation. To change the alias of a key, first use DeleteAlias to delete the current alias and then use CreateAlias to create a new alias. To associate an existing alias with a different key, call UpdateAlias.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     CreateAlias     GetAlias     ListAliases     UpdateAlias   
   */
  deleteAlias(params: PaymentCryptography.Types.DeleteAliasInput, callback?: (err: AWSError, data: PaymentCryptography.Types.DeleteAliasOutput) => void): Request<PaymentCryptography.Types.DeleteAliasOutput, AWSError>;
  /**
   * Deletes the alias, but doesn't affect the underlying key. Each key can have multiple aliases. To get the aliases of all keys, use the ListAliases operation. To change the alias of a key, first use DeleteAlias to delete the current alias and then use CreateAlias to create a new alias. To associate an existing alias with a different key, call UpdateAlias.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     CreateAlias     GetAlias     ListAliases     UpdateAlias   
   */
  deleteAlias(callback?: (err: AWSError, data: PaymentCryptography.Types.DeleteAliasOutput) => void): Request<PaymentCryptography.Types.DeleteAliasOutput, AWSError>;
  /**
   * Deletes the key material and all metadata associated with Amazon Web Services Payment Cryptography key. Key deletion is irreversible. After a key is deleted, you can't perform cryptographic operations using the key. For example, you can't decrypt data that was encrypted by a deleted Amazon Web Services Payment Cryptography key, and the data may become unrecoverable. Because key deletion is destructive, Amazon Web Services Payment Cryptography has a safety mechanism to prevent accidental deletion of a key. When you call this operation, Amazon Web Services Payment Cryptography disables the specified key but doesn't delete it until after a waiting period. The default waiting period is 7 days. To set a different waiting period, set DeleteKeyInDays. During the waiting period, the KeyState is DELETE_PENDING. After the key is deleted, the KeyState is DELETE_COMPLETE. If you delete key material, you can use ImportKey to reimport the same key material into the Amazon Web Services Payment Cryptography key. You should delete a key only when you are sure that you don't need to use it anymore and no other parties are utilizing this key. If you aren't sure, consider deactivating it instead by calling StopKeyUsage.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     RestoreKey     StartKeyUsage     StopKeyUsage   
   */
  deleteKey(params: PaymentCryptography.Types.DeleteKeyInput, callback?: (err: AWSError, data: PaymentCryptography.Types.DeleteKeyOutput) => void): Request<PaymentCryptography.Types.DeleteKeyOutput, AWSError>;
  /**
   * Deletes the key material and all metadata associated with Amazon Web Services Payment Cryptography key. Key deletion is irreversible. After a key is deleted, you can't perform cryptographic operations using the key. For example, you can't decrypt data that was encrypted by a deleted Amazon Web Services Payment Cryptography key, and the data may become unrecoverable. Because key deletion is destructive, Amazon Web Services Payment Cryptography has a safety mechanism to prevent accidental deletion of a key. When you call this operation, Amazon Web Services Payment Cryptography disables the specified key but doesn't delete it until after a waiting period. The default waiting period is 7 days. To set a different waiting period, set DeleteKeyInDays. During the waiting period, the KeyState is DELETE_PENDING. After the key is deleted, the KeyState is DELETE_COMPLETE. If you delete key material, you can use ImportKey to reimport the same key material into the Amazon Web Services Payment Cryptography key. You should delete a key only when you are sure that you don't need to use it anymore and no other parties are utilizing this key. If you aren't sure, consider deactivating it instead by calling StopKeyUsage.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     RestoreKey     StartKeyUsage     StopKeyUsage   
   */
  deleteKey(callback?: (err: AWSError, data: PaymentCryptography.Types.DeleteKeyOutput) => void): Request<PaymentCryptography.Types.DeleteKeyOutput, AWSError>;
  /**
   * Exports a key from Amazon Web Services Payment Cryptography using either ANSI X9 TR-34 or TR-31 key export standard. Amazon Web Services Payment Cryptography simplifies main or root key exchange process by eliminating the need of a paper-based key exchange process. It takes a modern and secure approach based of the ANSI X9 TR-34 key exchange standard. You can use ExportKey to export main or root keys such as KEK (Key Encryption Key), using asymmetric key exchange technique following ANSI X9 TR-34 standard. The ANSI X9 TR-34 standard uses asymmetric keys to establishes bi-directional trust between the two parties exchanging keys. After which you can export working keys using the ANSI X9 TR-31 symmetric key exchange standard as mandated by PCI PIN. Using this operation, you can share your Amazon Web Services Payment Cryptography generated keys with other service partners to perform cryptographic operations outside of Amazon Web Services Payment Cryptography   TR-34 key export  Amazon Web Services Payment Cryptography uses TR-34 asymmetric key exchange standard to export main keys such as KEK. In TR-34 terminology, the sending party of the key is called Key Distribution Host (KDH) and the receiving party of the key is called Key Receiving Host (KRH). In key export process, KDH is Amazon Web Services Payment Cryptography which initiates key export. KRH is the user receiving the key. Before you initiate TR-34 key export, you must obtain an export token by calling GetParametersForExport. This operation also returns the signing key certificate that KDH uses to sign the wrapped key to generate a TR-34 wrapped key block. The export token expires after 7 days. Set the following parameters:  CertificateAuthorityPublicKeyIdentifier  The KeyARN of the certificate chain that will sign the wrapping key certificate. This must exist within Amazon Web Services Payment Cryptography before you initiate TR-34 key export. If it does not exist, you can import it by calling ImportKey for RootCertificatePublicKey.  ExportToken  Obtained from KDH by calling GetParametersForExport.  WrappingKeyCertificate  Amazon Web Services Payment Cryptography uses this to wrap the key under export.   When this operation is successful, Amazon Web Services Payment Cryptography returns the TR-34 wrapped key block.   TR-31 key export  Amazon Web Services Payment Cryptography uses TR-31 symmetric key exchange standard to export working keys. In TR-31, you must use a main key such as KEK to encrypt or wrap the key under export. To establish a KEK, you can use CreateKey or ImportKey. When this operation is successful, Amazon Web Services Payment Cryptography returns a TR-31 wrapped key block.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     GetParametersForExport     ImportKey   
   */
  exportKey(params: PaymentCryptography.Types.ExportKeyInput, callback?: (err: AWSError, data: PaymentCryptography.Types.ExportKeyOutput) => void): Request<PaymentCryptography.Types.ExportKeyOutput, AWSError>;
  /**
   * Exports a key from Amazon Web Services Payment Cryptography using either ANSI X9 TR-34 or TR-31 key export standard. Amazon Web Services Payment Cryptography simplifies main or root key exchange process by eliminating the need of a paper-based key exchange process. It takes a modern and secure approach based of the ANSI X9 TR-34 key exchange standard. You can use ExportKey to export main or root keys such as KEK (Key Encryption Key), using asymmetric key exchange technique following ANSI X9 TR-34 standard. The ANSI X9 TR-34 standard uses asymmetric keys to establishes bi-directional trust between the two parties exchanging keys. After which you can export working keys using the ANSI X9 TR-31 symmetric key exchange standard as mandated by PCI PIN. Using this operation, you can share your Amazon Web Services Payment Cryptography generated keys with other service partners to perform cryptographic operations outside of Amazon Web Services Payment Cryptography   TR-34 key export  Amazon Web Services Payment Cryptography uses TR-34 asymmetric key exchange standard to export main keys such as KEK. In TR-34 terminology, the sending party of the key is called Key Distribution Host (KDH) and the receiving party of the key is called Key Receiving Host (KRH). In key export process, KDH is Amazon Web Services Payment Cryptography which initiates key export. KRH is the user receiving the key. Before you initiate TR-34 key export, you must obtain an export token by calling GetParametersForExport. This operation also returns the signing key certificate that KDH uses to sign the wrapped key to generate a TR-34 wrapped key block. The export token expires after 7 days. Set the following parameters:  CertificateAuthorityPublicKeyIdentifier  The KeyARN of the certificate chain that will sign the wrapping key certificate. This must exist within Amazon Web Services Payment Cryptography before you initiate TR-34 key export. If it does not exist, you can import it by calling ImportKey for RootCertificatePublicKey.  ExportToken  Obtained from KDH by calling GetParametersForExport.  WrappingKeyCertificate  Amazon Web Services Payment Cryptography uses this to wrap the key under export.   When this operation is successful, Amazon Web Services Payment Cryptography returns the TR-34 wrapped key block.   TR-31 key export  Amazon Web Services Payment Cryptography uses TR-31 symmetric key exchange standard to export working keys. In TR-31, you must use a main key such as KEK to encrypt or wrap the key under export. To establish a KEK, you can use CreateKey or ImportKey. When this operation is successful, Amazon Web Services Payment Cryptography returns a TR-31 wrapped key block.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     GetParametersForExport     ImportKey   
   */
  exportKey(callback?: (err: AWSError, data: PaymentCryptography.Types.ExportKeyOutput) => void): Request<PaymentCryptography.Types.ExportKeyOutput, AWSError>;
  /**
   * Gets the Amazon Web Services Payment Cryptography key associated with the alias.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     CreateAlias     DeleteAlias     ListAliases     UpdateAlias   
   */
  getAlias(params: PaymentCryptography.Types.GetAliasInput, callback?: (err: AWSError, data: PaymentCryptography.Types.GetAliasOutput) => void): Request<PaymentCryptography.Types.GetAliasOutput, AWSError>;
  /**
   * Gets the Amazon Web Services Payment Cryptography key associated with the alias.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     CreateAlias     DeleteAlias     ListAliases     UpdateAlias   
   */
  getAlias(callback?: (err: AWSError, data: PaymentCryptography.Types.GetAliasOutput) => void): Request<PaymentCryptography.Types.GetAliasOutput, AWSError>;
  /**
   * Gets the key material for an Amazon Web Services Payment Cryptography key, including the immutable and mutable data specified when the key was created.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     CreateKey     DeleteKey     ListKeys   
   */
  getKey(params: PaymentCryptography.Types.GetKeyInput, callback?: (err: AWSError, data: PaymentCryptography.Types.GetKeyOutput) => void): Request<PaymentCryptography.Types.GetKeyOutput, AWSError>;
  /**
   * Gets the key material for an Amazon Web Services Payment Cryptography key, including the immutable and mutable data specified when the key was created.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     CreateKey     DeleteKey     ListKeys   
   */
  getKey(callback?: (err: AWSError, data: PaymentCryptography.Types.GetKeyOutput) => void): Request<PaymentCryptography.Types.GetKeyOutput, AWSError>;
  /**
   * Gets the export token and the signing key certificate to initiate a TR-34 key export from Amazon Web Services Payment Cryptography. The signing key certificate signs the wrapped key under export within the TR-34 key payload. The export token and signing key certificate must be in place and operational before calling ExportKey. The export token expires in 7 days. You can use the same export token to export multiple keys from your service account.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     ExportKey     GetParametersForImport   
   */
  getParametersForExport(params: PaymentCryptography.Types.GetParametersForExportInput, callback?: (err: AWSError, data: PaymentCryptography.Types.GetParametersForExportOutput) => void): Request<PaymentCryptography.Types.GetParametersForExportOutput, AWSError>;
  /**
   * Gets the export token and the signing key certificate to initiate a TR-34 key export from Amazon Web Services Payment Cryptography. The signing key certificate signs the wrapped key under export within the TR-34 key payload. The export token and signing key certificate must be in place and operational before calling ExportKey. The export token expires in 7 days. You can use the same export token to export multiple keys from your service account.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     ExportKey     GetParametersForImport   
   */
  getParametersForExport(callback?: (err: AWSError, data: PaymentCryptography.Types.GetParametersForExportOutput) => void): Request<PaymentCryptography.Types.GetParametersForExportOutput, AWSError>;
  /**
   * Gets the import token and the wrapping key certificate to initiate a TR-34 key import into Amazon Web Services Payment Cryptography. The wrapping key certificate wraps the key under import within the TR-34 key payload. The import token and wrapping key certificate must be in place and operational before calling ImportKey. The import token expires in 7 days. The same import token can be used to import multiple keys into your service account.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     GetParametersForExport     ImportKey   
   */
  getParametersForImport(params: PaymentCryptography.Types.GetParametersForImportInput, callback?: (err: AWSError, data: PaymentCryptography.Types.GetParametersForImportOutput) => void): Request<PaymentCryptography.Types.GetParametersForImportOutput, AWSError>;
  /**
   * Gets the import token and the wrapping key certificate to initiate a TR-34 key import into Amazon Web Services Payment Cryptography. The wrapping key certificate wraps the key under import within the TR-34 key payload. The import token and wrapping key certificate must be in place and operational before calling ImportKey. The import token expires in 7 days. The same import token can be used to import multiple keys into your service account.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     GetParametersForExport     ImportKey   
   */
  getParametersForImport(callback?: (err: AWSError, data: PaymentCryptography.Types.GetParametersForImportOutput) => void): Request<PaymentCryptography.Types.GetParametersForImportOutput, AWSError>;
  /**
   * Gets the public key certificate of the asymmetric key pair that exists within Amazon Web Services Payment Cryptography. Unlike the private key of an asymmetric key, which never leaves Amazon Web Services Payment Cryptography unencrypted, callers with GetPublicKeyCertificate permission can download the public key certificate of the asymmetric key. You can share the public key certificate to allow others to encrypt messages and verify signatures outside of Amazon Web Services Payment Cryptography  Cross-account use: This operation can't be used across different Amazon Web Services accounts.
   */
  getPublicKeyCertificate(params: PaymentCryptography.Types.GetPublicKeyCertificateInput, callback?: (err: AWSError, data: PaymentCryptography.Types.GetPublicKeyCertificateOutput) => void): Request<PaymentCryptography.Types.GetPublicKeyCertificateOutput, AWSError>;
  /**
   * Gets the public key certificate of the asymmetric key pair that exists within Amazon Web Services Payment Cryptography. Unlike the private key of an asymmetric key, which never leaves Amazon Web Services Payment Cryptography unencrypted, callers with GetPublicKeyCertificate permission can download the public key certificate of the asymmetric key. You can share the public key certificate to allow others to encrypt messages and verify signatures outside of Amazon Web Services Payment Cryptography  Cross-account use: This operation can't be used across different Amazon Web Services accounts.
   */
  getPublicKeyCertificate(callback?: (err: AWSError, data: PaymentCryptography.Types.GetPublicKeyCertificateOutput) => void): Request<PaymentCryptography.Types.GetPublicKeyCertificateOutput, AWSError>;
  /**
   * Imports keys and public key certificates into Amazon Web Services Payment Cryptography. Amazon Web Services Payment Cryptography simplifies main or root key exchange process by eliminating the need of a paper-based key exchange process. It takes a modern and secure approach based of the ANSI X9 TR-34 key exchange standard.  You can use ImportKey to import main or root keys such as KEK (Key Encryption Key) using asymmetric key exchange technique following the ANSI X9 TR-34 standard. The ANSI X9 TR-34 standard uses asymmetric keys to establishes bi-directional trust between the two parties exchanging keys.  After you have imported a main or root key, you can import working keys to perform various cryptographic operations within Amazon Web Services Payment Cryptography using the ANSI X9 TR-31 symmetric key exchange standard as mandated by PCI PIN. You can also import a root public key certificate, a self-signed certificate used to sign other public key certificates, or a trusted public key certificate under an already established root public key certificate.   To import a public root key certificate  Using this operation, you can import the public component (in PEM cerificate format) of your private root key. You can use the imported public root key certificate for digital signatures, for example signing wrapping key or signing key in TR-34, within your Amazon Web Services Payment Cryptography account.  Set the following parameters:    KeyMaterial: RootCertificatePublicKey     KeyClass: PUBLIC_KEY     KeyModesOfUse: Verify     KeyUsage: TR31_S0_ASYMMETRIC_KEY_FOR_DIGITAL_SIGNATURE     PublicKeyCertificate: The certificate authority used to sign the root public key certificate.    To import a trusted public key certificate  The root public key certificate must be in place and operational before you import a trusted public key certificate. Set the following parameters:    KeyMaterial: TrustedCertificatePublicKey     CertificateAuthorityPublicKeyIdentifier: KeyArn of the RootCertificatePublicKey.    KeyModesOfUse and KeyUsage: Corresponding to the cryptographic operations such as wrap, sign, or encrypt that you will allow the trusted public key certificate to perform.    PublicKeyCertificate: The certificate authority used to sign the trusted public key certificate.    Import main keys  Amazon Web Services Payment Cryptography uses TR-34 asymmetric key exchange standard to import main keys such as KEK. In TR-34 terminology, the sending party of the key is called Key Distribution Host (KDH) and the receiving party of the key is called Key Receiving Host (KRH). During the key import process, KDH is the user who initiates the key import and KRH is Amazon Web Services Payment Cryptography who receives the key. Before initiating TR-34 key import, you must obtain an import token by calling GetParametersForImport. This operation also returns the wrapping key certificate that KDH uses wrap key under import to generate a TR-34 wrapped key block. The import token expires after 7 days. Set the following parameters:    CertificateAuthorityPublicKeyIdentifier: The KeyArn of the certificate chain that will sign the signing key certificate and should exist within Amazon Web Services Payment Cryptography before initiating TR-34 key import. If it does not exist, you can import it by calling by calling ImportKey for RootCertificatePublicKey.    ImportToken: Obtained from KRH by calling GetParametersForImport.    WrappedKeyBlock: The TR-34 wrapped key block from KDH. It contains the KDH key under import, wrapped with KRH provided wrapping key certificate and signed by the KDH private signing key. This TR-34 key block is generated by the KDH Hardware Security Module (HSM) outside of Amazon Web Services Payment Cryptography.    SigningKeyCertificate: The public component of the private key that signed the KDH TR-34 wrapped key block. In PEM certificate format.    TR-34 is intended primarily to exchange 3DES keys. Your ability to export AES-128 and larger AES keys may be dependent on your source system.   Import working keys  Amazon Web Services Payment Cryptography uses TR-31 symmetric key exchange standard to import working keys. A KEK must be established within Amazon Web Services Payment Cryptography by using TR-34 key import. To initiate a TR-31 key import, set the following parameters:    WrappedKeyBlock: The key under import and encrypted using KEK. The TR-31 key block generated by your HSM outside of Amazon Web Services Payment Cryptography.     WrappingKeyIdentifier: The KeyArn of the KEK that Amazon Web Services Payment Cryptography uses to decrypt or unwrap the key under import.    Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     ExportKey     GetParametersForImport   
   */
  importKey(params: PaymentCryptography.Types.ImportKeyInput, callback?: (err: AWSError, data: PaymentCryptography.Types.ImportKeyOutput) => void): Request<PaymentCryptography.Types.ImportKeyOutput, AWSError>;
  /**
   * Imports keys and public key certificates into Amazon Web Services Payment Cryptography. Amazon Web Services Payment Cryptography simplifies main or root key exchange process by eliminating the need of a paper-based key exchange process. It takes a modern and secure approach based of the ANSI X9 TR-34 key exchange standard.  You can use ImportKey to import main or root keys such as KEK (Key Encryption Key) using asymmetric key exchange technique following the ANSI X9 TR-34 standard. The ANSI X9 TR-34 standard uses asymmetric keys to establishes bi-directional trust between the two parties exchanging keys.  After you have imported a main or root key, you can import working keys to perform various cryptographic operations within Amazon Web Services Payment Cryptography using the ANSI X9 TR-31 symmetric key exchange standard as mandated by PCI PIN. You can also import a root public key certificate, a self-signed certificate used to sign other public key certificates, or a trusted public key certificate under an already established root public key certificate.   To import a public root key certificate  Using this operation, you can import the public component (in PEM cerificate format) of your private root key. You can use the imported public root key certificate for digital signatures, for example signing wrapping key or signing key in TR-34, within your Amazon Web Services Payment Cryptography account.  Set the following parameters:    KeyMaterial: RootCertificatePublicKey     KeyClass: PUBLIC_KEY     KeyModesOfUse: Verify     KeyUsage: TR31_S0_ASYMMETRIC_KEY_FOR_DIGITAL_SIGNATURE     PublicKeyCertificate: The certificate authority used to sign the root public key certificate.    To import a trusted public key certificate  The root public key certificate must be in place and operational before you import a trusted public key certificate. Set the following parameters:    KeyMaterial: TrustedCertificatePublicKey     CertificateAuthorityPublicKeyIdentifier: KeyArn of the RootCertificatePublicKey.    KeyModesOfUse and KeyUsage: Corresponding to the cryptographic operations such as wrap, sign, or encrypt that you will allow the trusted public key certificate to perform.    PublicKeyCertificate: The certificate authority used to sign the trusted public key certificate.    Import main keys  Amazon Web Services Payment Cryptography uses TR-34 asymmetric key exchange standard to import main keys such as KEK. In TR-34 terminology, the sending party of the key is called Key Distribution Host (KDH) and the receiving party of the key is called Key Receiving Host (KRH). During the key import process, KDH is the user who initiates the key import and KRH is Amazon Web Services Payment Cryptography who receives the key. Before initiating TR-34 key import, you must obtain an import token by calling GetParametersForImport. This operation also returns the wrapping key certificate that KDH uses wrap key under import to generate a TR-34 wrapped key block. The import token expires after 7 days. Set the following parameters:    CertificateAuthorityPublicKeyIdentifier: The KeyArn of the certificate chain that will sign the signing key certificate and should exist within Amazon Web Services Payment Cryptography before initiating TR-34 key import. If it does not exist, you can import it by calling by calling ImportKey for RootCertificatePublicKey.    ImportToken: Obtained from KRH by calling GetParametersForImport.    WrappedKeyBlock: The TR-34 wrapped key block from KDH. It contains the KDH key under import, wrapped with KRH provided wrapping key certificate and signed by the KDH private signing key. This TR-34 key block is generated by the KDH Hardware Security Module (HSM) outside of Amazon Web Services Payment Cryptography.    SigningKeyCertificate: The public component of the private key that signed the KDH TR-34 wrapped key block. In PEM certificate format.    TR-34 is intended primarily to exchange 3DES keys. Your ability to export AES-128 and larger AES keys may be dependent on your source system.   Import working keys  Amazon Web Services Payment Cryptography uses TR-31 symmetric key exchange standard to import working keys. A KEK must be established within Amazon Web Services Payment Cryptography by using TR-34 key import. To initiate a TR-31 key import, set the following parameters:    WrappedKeyBlock: The key under import and encrypted using KEK. The TR-31 key block generated by your HSM outside of Amazon Web Services Payment Cryptography.     WrappingKeyIdentifier: The KeyArn of the KEK that Amazon Web Services Payment Cryptography uses to decrypt or unwrap the key under import.    Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     ExportKey     GetParametersForImport   
   */
  importKey(callback?: (err: AWSError, data: PaymentCryptography.Types.ImportKeyOutput) => void): Request<PaymentCryptography.Types.ImportKeyOutput, AWSError>;
  /**
   * Lists the aliases for all keys in the caller's Amazon Web Services account and Amazon Web Services Region. You can filter the list of aliases. For more information, see Using aliases in the Amazon Web Services Payment Cryptography User Guide. This is a paginated operation, which means that each response might contain only a subset of all the aliases. When the response contains only a subset of aliases, it includes a NextToken value. Use this value in a subsequent ListAliases request to get more aliases. When you receive a response with no NextToken (or an empty or null value), that means there are no more aliases to get.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     CreateAlias     DeleteAlias     GetAlias     UpdateAlias   
   */
  listAliases(params: PaymentCryptography.Types.ListAliasesInput, callback?: (err: AWSError, data: PaymentCryptography.Types.ListAliasesOutput) => void): Request<PaymentCryptography.Types.ListAliasesOutput, AWSError>;
  /**
   * Lists the aliases for all keys in the caller's Amazon Web Services account and Amazon Web Services Region. You can filter the list of aliases. For more information, see Using aliases in the Amazon Web Services Payment Cryptography User Guide. This is a paginated operation, which means that each response might contain only a subset of all the aliases. When the response contains only a subset of aliases, it includes a NextToken value. Use this value in a subsequent ListAliases request to get more aliases. When you receive a response with no NextToken (or an empty or null value), that means there are no more aliases to get.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     CreateAlias     DeleteAlias     GetAlias     UpdateAlias   
   */
  listAliases(callback?: (err: AWSError, data: PaymentCryptography.Types.ListAliasesOutput) => void): Request<PaymentCryptography.Types.ListAliasesOutput, AWSError>;
  /**
   * Lists the keys in the caller's Amazon Web Services account and Amazon Web Services Region. You can filter the list of keys. This is a paginated operation, which means that each response might contain only a subset of all the keys. When the response contains only a subset of keys, it includes a NextToken value. Use this value in a subsequent ListKeys request to get more keys. When you receive a response with no NextToken (or an empty or null value), that means there are no more keys to get.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     CreateKey     DeleteKey     GetKey   
   */
  listKeys(params: PaymentCryptography.Types.ListKeysInput, callback?: (err: AWSError, data: PaymentCryptography.Types.ListKeysOutput) => void): Request<PaymentCryptography.Types.ListKeysOutput, AWSError>;
  /**
   * Lists the keys in the caller's Amazon Web Services account and Amazon Web Services Region. You can filter the list of keys. This is a paginated operation, which means that each response might contain only a subset of all the keys. When the response contains only a subset of keys, it includes a NextToken value. Use this value in a subsequent ListKeys request to get more keys. When you receive a response with no NextToken (or an empty or null value), that means there are no more keys to get.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     CreateKey     DeleteKey     GetKey   
   */
  listKeys(callback?: (err: AWSError, data: PaymentCryptography.Types.ListKeysOutput) => void): Request<PaymentCryptography.Types.ListKeysOutput, AWSError>;
  /**
   * Lists the tags for an Amazon Web Services resource. This is a paginated operation, which means that each response might contain only a subset of all the tags. When the response contains only a subset of tags, it includes a NextToken value. Use this value in a subsequent ListTagsForResource request to get more tags. When you receive a response with no NextToken (or an empty or null value), that means there are no more tags to get.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     TagResource     UntagResource   
   */
  listTagsForResource(params: PaymentCryptography.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: PaymentCryptography.Types.ListTagsForResourceOutput) => void): Request<PaymentCryptography.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Lists the tags for an Amazon Web Services resource. This is a paginated operation, which means that each response might contain only a subset of all the tags. When the response contains only a subset of tags, it includes a NextToken value. Use this value in a subsequent ListTagsForResource request to get more tags. When you receive a response with no NextToken (or an empty or null value), that means there are no more tags to get.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     TagResource     UntagResource   
   */
  listTagsForResource(callback?: (err: AWSError, data: PaymentCryptography.Types.ListTagsForResourceOutput) => void): Request<PaymentCryptography.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Cancels a scheduled key deletion during the waiting period. Use this operation to restore a Key that is scheduled for deletion. During the waiting period, the KeyState is DELETE_PENDING and deletePendingTimestamp contains the date and time after which the Key will be deleted. After Key is restored, the KeyState is CREATE_COMPLETE, and the value for deletePendingTimestamp is removed.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     DeleteKey     StartKeyUsage     StopKeyUsage   
   */
  restoreKey(params: PaymentCryptography.Types.RestoreKeyInput, callback?: (err: AWSError, data: PaymentCryptography.Types.RestoreKeyOutput) => void): Request<PaymentCryptography.Types.RestoreKeyOutput, AWSError>;
  /**
   * Cancels a scheduled key deletion during the waiting period. Use this operation to restore a Key that is scheduled for deletion. During the waiting period, the KeyState is DELETE_PENDING and deletePendingTimestamp contains the date and time after which the Key will be deleted. After Key is restored, the KeyState is CREATE_COMPLETE, and the value for deletePendingTimestamp is removed.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     DeleteKey     StartKeyUsage     StopKeyUsage   
   */
  restoreKey(callback?: (err: AWSError, data: PaymentCryptography.Types.RestoreKeyOutput) => void): Request<PaymentCryptography.Types.RestoreKeyOutput, AWSError>;
  /**
   * Enables an Amazon Web Services Payment Cryptography key, which makes it active for cryptographic operations within Amazon Web Services Payment Cryptography  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     StopKeyUsage   
   */
  startKeyUsage(params: PaymentCryptography.Types.StartKeyUsageInput, callback?: (err: AWSError, data: PaymentCryptography.Types.StartKeyUsageOutput) => void): Request<PaymentCryptography.Types.StartKeyUsageOutput, AWSError>;
  /**
   * Enables an Amazon Web Services Payment Cryptography key, which makes it active for cryptographic operations within Amazon Web Services Payment Cryptography  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     StopKeyUsage   
   */
  startKeyUsage(callback?: (err: AWSError, data: PaymentCryptography.Types.StartKeyUsageOutput) => void): Request<PaymentCryptography.Types.StartKeyUsageOutput, AWSError>;
  /**
   * Disables an Amazon Web Services Payment Cryptography key, which makes it inactive within Amazon Web Services Payment Cryptography. You can use this operation instead of DeleteKey to deactivate a key. You can enable the key in the future by calling StartKeyUsage.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     DeleteKey     StartKeyUsage   
   */
  stopKeyUsage(params: PaymentCryptography.Types.StopKeyUsageInput, callback?: (err: AWSError, data: PaymentCryptography.Types.StopKeyUsageOutput) => void): Request<PaymentCryptography.Types.StopKeyUsageOutput, AWSError>;
  /**
   * Disables an Amazon Web Services Payment Cryptography key, which makes it inactive within Amazon Web Services Payment Cryptography. You can use this operation instead of DeleteKey to deactivate a key. You can enable the key in the future by calling StartKeyUsage.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     DeleteKey     StartKeyUsage   
   */
  stopKeyUsage(callback?: (err: AWSError, data: PaymentCryptography.Types.StopKeyUsageOutput) => void): Request<PaymentCryptography.Types.StopKeyUsageOutput, AWSError>;
  /**
   * Adds or edits tags on an Amazon Web Services Payment Cryptography key.  Tagging or untagging an Amazon Web Services Payment Cryptography key can allow or deny permission to the key.  Each tag consists of a tag key and a tag value, both of which are case-sensitive strings. The tag value can be an empty (null) string. To add a tag, specify a new tag key and a tag value. To edit a tag, specify an existing tag key and a new tag value. You can also add tags to an Amazon Web Services Payment Cryptography key when you create it with CreateKey.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     ListTagsForResource     UntagResource   
   */
  tagResource(params: PaymentCryptography.Types.TagResourceInput, callback?: (err: AWSError, data: PaymentCryptography.Types.TagResourceOutput) => void): Request<PaymentCryptography.Types.TagResourceOutput, AWSError>;
  /**
   * Adds or edits tags on an Amazon Web Services Payment Cryptography key.  Tagging or untagging an Amazon Web Services Payment Cryptography key can allow or deny permission to the key.  Each tag consists of a tag key and a tag value, both of which are case-sensitive strings. The tag value can be an empty (null) string. To add a tag, specify a new tag key and a tag value. To edit a tag, specify an existing tag key and a new tag value. You can also add tags to an Amazon Web Services Payment Cryptography key when you create it with CreateKey.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     ListTagsForResource     UntagResource   
   */
  tagResource(callback?: (err: AWSError, data: PaymentCryptography.Types.TagResourceOutput) => void): Request<PaymentCryptography.Types.TagResourceOutput, AWSError>;
  /**
   * Deletes a tag from an Amazon Web Services Payment Cryptography key.  Tagging or untagging an Amazon Web Services Payment Cryptography key can allow or deny permission to the key.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     ListTagsForResource     TagResource   
   */
  untagResource(params: PaymentCryptography.Types.UntagResourceInput, callback?: (err: AWSError, data: PaymentCryptography.Types.UntagResourceOutput) => void): Request<PaymentCryptography.Types.UntagResourceOutput, AWSError>;
  /**
   * Deletes a tag from an Amazon Web Services Payment Cryptography key.  Tagging or untagging an Amazon Web Services Payment Cryptography key can allow or deny permission to the key.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     ListTagsForResource     TagResource   
   */
  untagResource(callback?: (err: AWSError, data: PaymentCryptography.Types.UntagResourceOutput) => void): Request<PaymentCryptography.Types.UntagResourceOutput, AWSError>;
  /**
   * Associates an existing Amazon Web Services Payment Cryptography alias with a different key. Each alias is associated with only one Amazon Web Services Payment Cryptography key at a time, although a key can have multiple aliases. The alias and the Amazon Web Services Payment Cryptography key must be in the same Amazon Web Services account and Amazon Web Services Region  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     CreateAlias     DeleteAlias     GetAlias     ListAliases   
   */
  updateAlias(params: PaymentCryptography.Types.UpdateAliasInput, callback?: (err: AWSError, data: PaymentCryptography.Types.UpdateAliasOutput) => void): Request<PaymentCryptography.Types.UpdateAliasOutput, AWSError>;
  /**
   * Associates an existing Amazon Web Services Payment Cryptography alias with a different key. Each alias is associated with only one Amazon Web Services Payment Cryptography key at a time, although a key can have multiple aliases. The alias and the Amazon Web Services Payment Cryptography key must be in the same Amazon Web Services account and Amazon Web Services Region  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     CreateAlias     DeleteAlias     GetAlias     ListAliases   
   */
  updateAlias(callback?: (err: AWSError, data: PaymentCryptography.Types.UpdateAliasOutput) => void): Request<PaymentCryptography.Types.UpdateAliasOutput, AWSError>;
}
declare namespace PaymentCryptography {
  export interface Alias {
    /**
     * A friendly name that you can use to refer to a key. The value must begin with alias/.  Do not include confidential or sensitive information in this field. This field may be displayed in plaintext in CloudTrail logs and other output. 
     */
    AliasName: AliasName;
    /**
     * The KeyARN of the key associated with the alias.
     */
    KeyArn?: KeyArn;
  }
  export type AliasName = string;
  export type Aliases = Alias[];
  export type Boolean = boolean;
  export type CertificateType = string;
  export interface CreateAliasInput {
    /**
     * A friendly name that you can use to refer a key. An alias must begin with alias/ followed by a name, for example alias/ExampleAlias. It can contain only alphanumeric characters, forward slashes (/), underscores (_), and dashes (-).  Don't include confidential or sensitive information in this field. This field may be displayed in plaintext in CloudTrail logs and other output. 
     */
    AliasName: AliasName;
    /**
     * The KeyARN of the key to associate with the alias.
     */
    KeyArn?: KeyArn;
  }
  export interface CreateAliasOutput {
    /**
     * The alias for the key.
     */
    Alias: Alias;
  }
  export interface CreateKeyInput {
    /**
     * Specifies whether to enable the key. If the key is enabled, it is activated for use within the service. If the key not enabled, then it is created but not activated. The default value is enabled.
     */
    Enabled?: Boolean;
    /**
     * Specifies whether the key is exportable from the service.
     */
    Exportable: Boolean;
    /**
     * The role of the key, the algorithm it supports, and the cryptographic operations allowed with the key. This data is immutable after the key is created.
     */
    KeyAttributes: KeyAttributes;
    /**
     * The algorithm that Amazon Web Services Payment Cryptography uses to calculate the key check value (KCV) for DES and AES keys. For DES key, the KCV is computed by encrypting 8 bytes, each with value '00', with the key to be checked and retaining the 3 highest order bytes of the encrypted result. For AES key, the KCV is computed by encrypting 8 bytes, each with value '01', with the key to be checked and retaining the 3 highest order bytes of the encrypted result.
     */
    KeyCheckValueAlgorithm?: KeyCheckValueAlgorithm;
    /**
     * The tags to attach to the key. Each tag consists of a tag key and a tag value. Both the tag key and the tag value are required, but the tag value can be an empty (null) string. You can't have more than one tag on an Amazon Web Services Payment Cryptography key with the same tag key.  To use this parameter, you must have TagResource permission.  Don't include confidential or sensitive information in this field. This field may be displayed in plaintext in CloudTrail logs and other output.   Tagging or untagging an Amazon Web Services Payment Cryptography key can allow or deny permission to the key. 
     */
    Tags?: Tags;
  }
  export interface CreateKeyOutput {
    /**
     * The key material that contains all the key attributes.
     */
    Key: Key;
  }
  export interface DeleteAliasInput {
    /**
     * A friendly name that you can use to refer Amazon Web Services Payment Cryptography key. This value must begin with alias/ followed by a name, such as alias/ExampleAlias.
     */
    AliasName: AliasName;
  }
  export interface DeleteAliasOutput {
  }
  export interface DeleteKeyInput {
    /**
     * The waiting period for key deletion. The default value is seven days.
     */
    DeleteKeyInDays?: DeleteKeyInputDeleteKeyInDaysInteger;
    /**
     * The KeyARN of the key that is scheduled for deletion.
     */
    KeyIdentifier: KeyArnOrKeyAliasType;
  }
  export type DeleteKeyInputDeleteKeyInDaysInteger = number;
  export interface DeleteKeyOutput {
    /**
     * The KeyARN of the key that is scheduled for deletion.
     */
    Key: Key;
  }
  export interface ExportKeyInput {
    /**
     * The KeyARN of the key under export from Amazon Web Services Payment Cryptography.
     */
    ExportKeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The key block format type, for example, TR-34 or TR-31, to use during key material export.
     */
    KeyMaterial: ExportKeyMaterial;
  }
  export interface ExportKeyMaterial {
    /**
     * Parameter information for key material export using TR-31 standard.
     */
    Tr31KeyBlock?: ExportTr31KeyBlock;
    /**
     * Parameter information for key material export using TR-34 standard.
     */
    Tr34KeyBlock?: ExportTr34KeyBlock;
  }
  export interface ExportKeyOutput {
    /**
     * The key material under export as a TR-34 or TR-31 wrapped key block.
     */
    WrappedKey?: WrappedKey;
  }
  export type ExportTokenId = string;
  export interface ExportTr31KeyBlock {
    /**
     * The KeyARN of the the wrapping key. This key encrypts or wraps the key under export for TR-31 key block generation.
     */
    WrappingKeyIdentifier: KeyArnOrKeyAliasType;
  }
  export interface ExportTr34KeyBlock {
    /**
     * The KeyARN of the certificate chain that signs the wrapping key certificate during TR-34 key export.
     */
    CertificateAuthorityPublicKeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The export token to initiate key export from Amazon Web Services Payment Cryptography. It also contains the signing key certificate that will sign the wrapped key during TR-34 key block generation. Call GetParametersForExport to receive an export token. It expires after 7 days. You can use the same export token to export multiple keys from the same service account.
     */
    ExportToken: ExportTokenId;
    /**
     * The format of key block that Amazon Web Services Payment Cryptography will use during key export.
     */
    KeyBlockFormat: Tr34KeyBlockFormat;
    /**
     * A random number value that is unique to the TR-34 key block generated using 2 pass. The operation will fail, if a random nonce value is not provided for a TR-34 key block generated using 2 pass.
     */
    RandomNonce?: HexLength16;
    /**
     * The KeyARN of the wrapping key certificate. Amazon Web Services Payment Cryptography uses this certificate to wrap the key under export.
     */
    WrappingKeyCertificate: CertificateType;
  }
  export interface GetAliasInput {
    /**
     * The alias of the Amazon Web Services Payment Cryptography key.
     */
    AliasName: AliasName;
  }
  export interface GetAliasOutput {
    /**
     * The alias of the Amazon Web Services Payment Cryptography key.
     */
    Alias: Alias;
  }
  export interface GetKeyInput {
    /**
     * The KeyARN of the Amazon Web Services Payment Cryptography key.
     */
    KeyIdentifier: KeyArnOrKeyAliasType;
  }
  export interface GetKeyOutput {
    /**
     * The key material, including the immutable and mutable data for the key.
     */
    Key: Key;
  }
  export interface GetParametersForExportInput {
    /**
     * The key block format type (for example, TR-34 or TR-31) to use during key material export. Export token is only required for a TR-34 key export, TR34_KEY_BLOCK. Export token is not required for TR-31 key export.
     */
    KeyMaterialType: KeyMaterialType;
    /**
     * The signing key algorithm to generate a signing key certificate. This certificate signs the wrapped key under export within the TR-34 key block cryptogram. RSA_2048 is the only signing key algorithm allowed.
     */
    SigningKeyAlgorithm: KeyAlgorithm;
  }
  export interface GetParametersForExportOutput {
    /**
     * The export token to initiate key export from Amazon Web Services Payment Cryptography. The export token expires after 7 days. You can use the same export token to export multiple keys from the same service account.
     */
    ExportToken: ExportTokenId;
    /**
     * The validity period of the export token.
     */
    ParametersValidUntilTimestamp: Timestamp;
    /**
     * The algorithm of the signing key certificate for use in TR-34 key block generation. RSA_2048 is the only signing key algorithm allowed.
     */
    SigningKeyAlgorithm: KeyAlgorithm;
    /**
     * The signing key certificate of the public key for signature within the TR-34 key block cryptogram. The certificate expires after 7 days.
     */
    SigningKeyCertificate: CertificateType;
    /**
     * The certificate chain that signed the signing key certificate. This is the root certificate authority (CA) within your service account.
     */
    SigningKeyCertificateChain: CertificateType;
  }
  export interface GetParametersForImportInput {
    /**
     * The key block format type such as TR-34 or TR-31 to use during key material import. Import token is only required for TR-34 key import TR34_KEY_BLOCK. Import token is not required for TR-31 key import.
     */
    KeyMaterialType: KeyMaterialType;
    /**
     * The wrapping key algorithm to generate a wrapping key certificate. This certificate wraps the key under import within the TR-34 key block cryptogram. RSA_2048 is the only wrapping key algorithm allowed.
     */
    WrappingKeyAlgorithm: KeyAlgorithm;
  }
  export interface GetParametersForImportOutput {
    /**
     * The import token to initiate key import into Amazon Web Services Payment Cryptography. The import token expires after 7 days. You can use the same import token to import multiple keys to the same service account.
     */
    ImportToken: ImportTokenId;
    /**
     * The validity period of the import token.
     */
    ParametersValidUntilTimestamp: Timestamp;
    /**
     * The algorithm of the wrapping key for use within TR-34 key block. RSA_2048 is the only wrapping key algorithm allowed.
     */
    WrappingKeyAlgorithm: KeyAlgorithm;
    /**
     * The wrapping key certificate of the wrapping key for use within the TR-34 key block. The certificate expires in 7 days.
     */
    WrappingKeyCertificate: CertificateType;
    /**
     * The Amazon Web Services Payment Cryptography certificate chain that signed the wrapping key certificate. This is the root certificate authority (CA) within your service account.
     */
    WrappingKeyCertificateChain: CertificateType;
  }
  export interface GetPublicKeyCertificateInput {
    /**
     * The KeyARN of the asymmetric key pair.
     */
    KeyIdentifier: KeyArnOrKeyAliasType;
  }
  export interface GetPublicKeyCertificateOutput {
    /**
     * The public key component of the asymmetric key pair in a certificate (PEM) format. It is signed by the root certificate authority (CA) within your service account. The certificate expires in 90 days.
     */
    KeyCertificate: CertificateType;
    /**
     * The certificate chain that signed the public key certificate of the asymmetric key pair. This is the root certificate authority (CA) within your service account.
     */
    KeyCertificateChain: CertificateType;
  }
  export type HexLength16 = string;
  export interface ImportKeyInput {
    /**
     * Specifies whether import key is enabled.
     */
    Enabled?: Boolean;
    /**
     * The algorithm that Amazon Web Services Payment Cryptography uses to calculate the key check value (KCV) for DES and AES keys. For DES key, the KCV is computed by encrypting 8 bytes, each with value '00', with the key to be checked and retaining the 3 highest order bytes of the encrypted result. For AES key, the KCV is computed by encrypting 8 bytes, each with value '01', with the key to be checked and retaining the 3 highest order bytes of the encrypted result.
     */
    KeyCheckValueAlgorithm?: KeyCheckValueAlgorithm;
    /**
     * The key or public key certificate type to use during key material import, for example TR-34 or RootCertificatePublicKey.
     */
    KeyMaterial: ImportKeyMaterial;
    /**
     * The tags to attach to the key. Each tag consists of a tag key and a tag value. Both the tag key and the tag value are required, but the tag value can be an empty (null) string. You can't have more than one tag on an Amazon Web Services Payment Cryptography key with the same tag key.  You can't have more than one tag on an Amazon Web Services Payment Cryptography key with the same tag key. If you specify an existing tag key with a different tag value, Amazon Web Services Payment Cryptography replaces the current tag value with the specified one. To use this parameter, you must have TagResource permission.  Don't include confidential or sensitive information in this field. This field may be displayed in plaintext in CloudTrail logs and other output.   Tagging or untagging an Amazon Web Services Payment Cryptography key can allow or deny permission to the key. 
     */
    Tags?: Tags;
  }
  export interface ImportKeyMaterial {
    /**
     * Parameter information for root public key certificate import.
     */
    RootCertificatePublicKey?: RootCertificatePublicKey;
    /**
     * Parameter information for key material import using TR-31 standard.
     */
    Tr31KeyBlock?: ImportTr31KeyBlock;
    /**
     * Parameter information for key material import using TR-34 standard.
     */
    Tr34KeyBlock?: ImportTr34KeyBlock;
    /**
     * Parameter information for trusted public key certificate import.
     */
    TrustedCertificatePublicKey?: TrustedCertificatePublicKey;
  }
  export interface ImportKeyOutput {
    /**
     * The KeyARN of the key material imported within Amazon Web Services Payment Cryptography.
     */
    Key: Key;
  }
  export type ImportTokenId = string;
  export interface ImportTr31KeyBlock {
    /**
     * The TR-34 wrapped key block to import.
     */
    WrappedKeyBlock: Tr31WrappedKeyBlock;
    /**
     * The KeyARN of the key that will decrypt or unwrap a TR-31 key block during import.
     */
    WrappingKeyIdentifier: KeyArnOrKeyAliasType;
  }
  export interface ImportTr34KeyBlock {
    /**
     * The KeyARN of the certificate chain that signs the signing key certificate during TR-34 key import.
     */
    CertificateAuthorityPublicKeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The import token that initiates key import into Amazon Web Services Payment Cryptography. It expires after 7 days. You can use the same import token to import multiple keys to the same service account.
     */
    ImportToken: ImportTokenId;
    /**
     * The key block format to use during key import. The only value allowed is X9_TR34_2012.
     */
    KeyBlockFormat: Tr34KeyBlockFormat;
    /**
     * A random number value that is unique to the TR-34 key block generated using 2 pass. The operation will fail, if a random nonce value is not provided for a TR-34 key block generated using 2 pass.
     */
    RandomNonce?: HexLength16;
    /**
     * The public key component in PEM certificate format of the private key that signs the KDH TR-34 wrapped key block.
     */
    SigningKeyCertificate: CertificateType;
    /**
     * The TR-34 wrapped key block to import.
     */
    WrappedKeyBlock: Tr34WrappedKeyBlock;
  }
  export interface Key {
    /**
     * The date and time when the key was created.
     */
    CreateTimestamp: Timestamp;
    /**
     * The date and time after which Amazon Web Services Payment Cryptography will delete the key. This value is present only when KeyState is DELETE_PENDING and the key is scheduled for deletion.
     */
    DeletePendingTimestamp?: Timestamp;
    /**
     * The date and time after which Amazon Web Services Payment Cryptography will delete the key. This value is present only when when the KeyState is DELETE_COMPLETE and the Amazon Web Services Payment Cryptography key is deleted.
     */
    DeleteTimestamp?: Timestamp;
    /**
     * Specifies whether the key is enabled. 
     */
    Enabled: Boolean;
    /**
     * Specifies whether the key is exportable. This data is immutable after the key is created.
     */
    Exportable: Boolean;
    /**
     * The Amazon Resource Name (ARN) of the key.
     */
    KeyArn: KeyArn;
    /**
     * The role of the key, the algorithm it supports, and the cryptographic operations allowed with the key. This data is immutable after the key is created.
     */
    KeyAttributes: KeyAttributes;
    /**
     * The key check value (KCV) is used to check if all parties holding a given key have the same key or to detect that a key has changed. Amazon Web Services Payment Cryptography calculates the KCV by using standard algorithms, typically by encrypting 8 or 16 bytes or "00" or "01" and then truncating the result to the first 3 bytes, or 6 hex digits, of the resulting cryptogram.
     */
    KeyCheckValue: KeyCheckValue;
    /**
     * The algorithm used for calculating key check value (KCV) for DES and AES keys. For a DES key, Amazon Web Services Payment Cryptography computes the KCV by encrypting 8 bytes, each with value '00', with the key to be checked and retaining the 3 highest order bytes of the encrypted result. For an AES key, Amazon Web Services Payment Cryptography computes the KCV by encrypting 8 bytes, each with value '01', with the key to be checked and retaining the 3 highest order bytes of the encrypted result.
     */
    KeyCheckValueAlgorithm: KeyCheckValueAlgorithm;
    /**
     * The source of the key material. For keys created within Amazon Web Services Payment Cryptography, the value is AWS_PAYMENT_CRYPTOGRAPHY. For keys imported into Amazon Web Services Payment Cryptography, the value is EXTERNAL.
     */
    KeyOrigin: KeyOrigin;
    /**
     * The state of key that is being created or deleted.
     */
    KeyState: KeyState;
    /**
     * The date and time after which Amazon Web Services Payment Cryptography will start using the key material for cryptographic operations.
     */
    UsageStartTimestamp?: Timestamp;
    /**
     * The date and time after which Amazon Web Services Payment Cryptography will stop using the key material for cryptographic operations.
     */
    UsageStopTimestamp?: Timestamp;
  }
  export type KeyAlgorithm = "TDES_2KEY"|"TDES_3KEY"|"AES_128"|"AES_192"|"AES_256"|"RSA_2048"|"RSA_3072"|"RSA_4096"|string;
  export type KeyArn = string;
  export type KeyArnOrKeyAliasType = string;
  export interface KeyAttributes {
    /**
     * The key algorithm to be use during creation of an Amazon Web Services Payment Cryptography key. For symmetric keys, Amazon Web Services Payment Cryptography supports AES and TDES algorithms. For asymmetric keys, Amazon Web Services Payment Cryptography supports RSA and ECC_NIST algorithms.
     */
    KeyAlgorithm: KeyAlgorithm;
    /**
     * The type of Amazon Web Services Payment Cryptography key to create, which determines the classiﬁcation of the cryptographic method and whether Amazon Web Services Payment Cryptography key contains a symmetric key or an asymmetric key pair.
     */
    KeyClass: KeyClass;
    /**
     * The list of cryptographic operations that you can perform using the key.
     */
    KeyModesOfUse: KeyModesOfUse;
    /**
     * The cryptographic usage of an Amazon Web Services Payment Cryptography key as deﬁned in section A.5.2 of the TR-31 spec.
     */
    KeyUsage: KeyUsage;
  }
  export type KeyCheckValue = string;
  export type KeyCheckValueAlgorithm = "CMAC"|"ANSI_X9_24"|string;
  export type KeyClass = "SYMMETRIC_KEY"|"ASYMMETRIC_KEY_PAIR"|"PRIVATE_KEY"|"PUBLIC_KEY"|string;
  export type KeyMaterial = string;
  export type KeyMaterialType = "TR34_KEY_BLOCK"|"TR31_KEY_BLOCK"|"ROOT_PUBLIC_KEY_CERTIFICATE"|"TRUSTED_PUBLIC_KEY_CERTIFICATE"|string;
  export interface KeyModesOfUse {
    /**
     * Speciﬁes whether an Amazon Web Services Payment Cryptography key can be used to decrypt data.
     */
    Decrypt?: PrimitiveBoolean;
    /**
     * Speciﬁes whether an Amazon Web Services Payment Cryptography key can be used to derive new keys.
     */
    DeriveKey?: PrimitiveBoolean;
    /**
     * Speciﬁes whether an Amazon Web Services Payment Cryptography key can be used to encrypt data.
     */
    Encrypt?: PrimitiveBoolean;
    /**
     * Speciﬁes whether an Amazon Web Services Payment Cryptography key can be used to generate and verify other card and PIN verification keys.
     */
    Generate?: PrimitiveBoolean;
    /**
     * Speciﬁes whether an Amazon Web Services Payment Cryptography key has no special restrictions other than the restrictions implied by KeyUsage.
     */
    NoRestrictions?: PrimitiveBoolean;
    /**
     * Speciﬁes whether an Amazon Web Services Payment Cryptography key can be used for signing.
     */
    Sign?: PrimitiveBoolean;
    /**
     * Speciﬁes whether an Amazon Web Services Payment Cryptography key can be used to unwrap other keys.
     */
    Unwrap?: PrimitiveBoolean;
    /**
     * Speciﬁes whether an Amazon Web Services Payment Cryptography key can be used to verify signatures.
     */
    Verify?: PrimitiveBoolean;
    /**
     * Speciﬁes whether an Amazon Web Services Payment Cryptography key can be used to wrap other keys.
     */
    Wrap?: PrimitiveBoolean;
  }
  export type KeyOrigin = "EXTERNAL"|"AWS_PAYMENT_CRYPTOGRAPHY"|string;
  export type KeyState = "CREATE_IN_PROGRESS"|"CREATE_COMPLETE"|"DELETE_PENDING"|"DELETE_COMPLETE"|string;
  export interface KeySummary {
    /**
     * Specifies whether the key is enabled. 
     */
    Enabled: Boolean;
    /**
     * Specifies whether the key is exportable. This data is immutable after the key is created.
     */
    Exportable: Boolean;
    /**
     * The Amazon Resource Name (ARN) of the key.
     */
    KeyArn: KeyArn;
    /**
     * The role of the key, the algorithm it supports, and the cryptographic operations allowed with the key. This data is immutable after the key is created.
     */
    KeyAttributes: KeyAttributes;
    /**
     * The key check value (KCV) is used to check if all parties holding a given key have the same key or to detect that a key has changed. Amazon Web Services Payment Cryptography calculates the KCV by using standard algorithms, typically by encrypting 8 or 16 bytes or "00" or "01" and then truncating the result to the first 3 bytes, or 6 hex digits, of the resulting cryptogram.
     */
    KeyCheckValue: KeyCheckValue;
    /**
     * The state of an Amazon Web Services Payment Cryptography that is being created or deleted.
     */
    KeyState: KeyState;
  }
  export type KeySummaryList = KeySummary[];
  export type KeyUsage = "TR31_B0_BASE_DERIVATION_KEY"|"TR31_C0_CARD_VERIFICATION_KEY"|"TR31_D0_SYMMETRIC_DATA_ENCRYPTION_KEY"|"TR31_D1_ASYMMETRIC_KEY_FOR_DATA_ENCRYPTION"|"TR31_E0_EMV_MKEY_APP_CRYPTOGRAMS"|"TR31_E1_EMV_MKEY_CONFIDENTIALITY"|"TR31_E2_EMV_MKEY_INTEGRITY"|"TR31_E4_EMV_MKEY_DYNAMIC_NUMBERS"|"TR31_E5_EMV_MKEY_CARD_PERSONALIZATION"|"TR31_E6_EMV_MKEY_OTHER"|"TR31_K0_KEY_ENCRYPTION_KEY"|"TR31_K1_KEY_BLOCK_PROTECTION_KEY"|"TR31_K3_ASYMMETRIC_KEY_FOR_KEY_AGREEMENT"|"TR31_M3_ISO_9797_3_MAC_KEY"|"TR31_M6_ISO_9797_5_CMAC_KEY"|"TR31_M7_HMAC_KEY"|"TR31_P0_PIN_ENCRYPTION_KEY"|"TR31_P1_PIN_GENERATION_KEY"|"TR31_S0_ASYMMETRIC_KEY_FOR_DIGITAL_SIGNATURE"|"TR31_V1_IBM3624_PIN_VERIFICATION_KEY"|"TR31_V2_VISA_PIN_VERIFICATION_KEY"|"TR31_K2_TR34_ASYMMETRIC_KEY"|string;
  export interface ListAliasesInput {
    /**
     * Use this parameter to specify the maximum number of items to return. When this value is present, Amazon Web Services Payment Cryptography does not return more than the specified number of items, but it might return fewer. This value is optional. If you include a value, it must be between 1 and 100, inclusive. If you do not include a value, it defaults to 50.
     */
    MaxResults?: MaxResults;
    /**
     * Use this parameter in a subsequent request after you receive a response with truncated results. Set it to the value of NextToken from the truncated response you just received.
     */
    NextToken?: NextToken;
  }
  export interface ListAliasesOutput {
    /**
     * The list of aliases. Each alias describes the KeyArn contained within.
     */
    Aliases: Aliases;
    /**
     * The token for the next set of results, or an empty or null value if there are no more results.
     */
    NextToken?: NextToken;
  }
  export interface ListKeysInput {
    /**
     * The key state of the keys you want to list.
     */
    KeyState?: KeyState;
    /**
     * Use this parameter to specify the maximum number of items to return. When this value is present, Amazon Web Services Payment Cryptography does not return more than the specified number of items, but it might return fewer.
     */
    MaxResults?: MaxResults;
    /**
     * Use this parameter in a subsequent request after you receive a response with truncated results. Set it to the value of NextToken from the truncated response you just received.
     */
    NextToken?: NextToken;
  }
  export interface ListKeysOutput {
    /**
     * The list of keys created within the caller's Amazon Web Services account and Amazon Web Services Region.
     */
    Keys: KeySummaryList;
    /**
     * The token for the next set of results, or an empty or null value if there are no more results.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceInput {
    /**
     * Use this parameter to specify the maximum number of items to return. When this value is present, Amazon Web Services Payment Cryptography does not return more than the specified number of items, but it might return fewer.
     */
    MaxResults?: MaxResults;
    /**
     * Use this parameter in a subsequent request after you receive a response with truncated results. Set it to the value of NextToken from the truncated response you just received.
     */
    NextToken?: NextToken;
    /**
     * The KeyARN of the key whose tags you are getting.
     */
    ResourceArn: ResourceArn;
  }
  export interface ListTagsForResourceOutput {
    /**
     * The token for the next set of results, or an empty or null value if there are no more results.
     */
    NextToken?: NextToken;
    /**
     * The list of tags associated with a ResourceArn. Each tag will list the key-value pair contained within that tag.
     */
    Tags: Tags;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export type PrimitiveBoolean = boolean;
  export type ResourceArn = string;
  export interface RestoreKeyInput {
    /**
     * The KeyARN of the key to be restored within Amazon Web Services Payment Cryptography.
     */
    KeyIdentifier: KeyArnOrKeyAliasType;
  }
  export interface RestoreKeyOutput {
    /**
     * The key material of the restored key. The KeyState will change to CREATE_COMPLETE and value for DeletePendingTimestamp gets removed. 
     */
    Key: Key;
  }
  export interface RootCertificatePublicKey {
    /**
     * The role of the key, the algorithm it supports, and the cryptographic operations allowed with the key. This data is immutable after the root public key is imported.
     */
    KeyAttributes: KeyAttributes;
    /**
     * Parameter information for root public key certificate import.
     */
    PublicKeyCertificate: CertificateType;
  }
  export interface StartKeyUsageInput {
    /**
     * The KeyArn of the key.
     */
    KeyIdentifier: KeyArnOrKeyAliasType;
  }
  export interface StartKeyUsageOutput {
    /**
     * The KeyARN of the Amazon Web Services Payment Cryptography key activated for use.
     */
    Key: Key;
  }
  export interface StopKeyUsageInput {
    /**
     * The KeyArn of the key.
     */
    KeyIdentifier: KeyArnOrKeyAliasType;
  }
  export interface StopKeyUsageOutput {
    /**
     * The KeyARN of the key.
     */
    Key: Key;
  }
  export interface Tag {
    /**
     * The key of the tag.
     */
    Key: TagKey;
    /**
     * The value of the tag.
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export interface TagResourceInput {
    /**
     * The KeyARN of the key whose tags are being updated.
     */
    ResourceArn: ResourceArn;
    /**
     * One or more tags. Each tag consists of a tag key and a tag value. The tag value can be an empty (null) string. You can't have more than one tag on an Amazon Web Services Payment Cryptography key with the same tag key. If you specify an existing tag key with a different tag value, Amazon Web Services Payment Cryptography replaces the current tag value with the new one.  Don't include confidential or sensitive information in this field. This field may be displayed in plaintext in CloudTrail logs and other output.  To use this parameter, you must have TagResource permission in an IAM policy.  Don't include confidential or sensitive information in this field. This field may be displayed in plaintext in CloudTrail logs and other output. 
     */
    Tags: Tags;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
  export type Tags = Tag[];
  export type Timestamp = Date;
  export type Tr31WrappedKeyBlock = string;
  export type Tr34KeyBlockFormat = "X9_TR34_2012"|string;
  export type Tr34WrappedKeyBlock = string;
  export interface TrustedCertificatePublicKey {
    /**
     * The KeyARN of the root public key certificate or certificate chain that signs the trusted public key certificate import.
     */
    CertificateAuthorityPublicKeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The role of the key, the algorithm it supports, and the cryptographic operations allowed with the key. This data is immutable after a trusted public key is imported.
     */
    KeyAttributes: KeyAttributes;
    /**
     * Parameter information for trusted public key certificate import.
     */
    PublicKeyCertificate: CertificateType;
  }
  export interface UntagResourceInput {
    /**
     * The KeyARN of the key whose tags are being removed.
     */
    ResourceArn: ResourceArn;
    /**
     * One or more tag keys. Don't include the tag values. If the Amazon Web Services Payment Cryptography key doesn't have the specified tag key, Amazon Web Services Payment Cryptography doesn't throw an exception or return a response. To confirm that the operation succeeded, use the ListTagsForResource operation.
     */
    TagKeys: TagKeys;
  }
  export interface UntagResourceOutput {
  }
  export interface UpdateAliasInput {
    /**
     * The alias whose associated key is changing.
     */
    AliasName: AliasName;
    /**
     * The KeyARN for the key that you are updating or removing from the alias.
     */
    KeyArn?: KeyArn;
  }
  export interface UpdateAliasOutput {
    /**
     * The alias name.
     */
    Alias: Alias;
  }
  export interface WrappedKey {
    /**
     * Parameter information for generating a wrapped key using TR-31 or TR-34 standard.
     */
    KeyMaterial: KeyMaterial;
    /**
     * The key block format of a wrapped key.
     */
    WrappedKeyMaterialFormat: WrappedKeyMaterialFormat;
    /**
     * The KeyARN of the wrapped key.
     */
    WrappingKeyArn: KeyArn;
  }
  export type WrappedKeyMaterialFormat = "KEY_CRYPTOGRAM"|"TR31_KEY_BLOCK"|"TR34_KEY_BLOCK"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-09-14"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the PaymentCryptography client.
   */
  export import Types = PaymentCryptography;
}
export = PaymentCryptography;
