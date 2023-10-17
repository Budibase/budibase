import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class PaymentCryptographyData extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: PaymentCryptographyData.Types.ClientConfiguration)
  config: Config & PaymentCryptographyData.Types.ClientConfiguration;
  /**
   * Decrypts ciphertext data to plaintext using symmetric, asymmetric, or DUKPT data encryption key. For more information, see Decrypt data in the Amazon Web Services Payment Cryptography User Guide. You can use an encryption key generated within Amazon Web Services Payment Cryptography, or you can import your own encryption key by calling ImportKey. For this operation, the key must have KeyModesOfUse set to Decrypt. In asymmetric decryption, Amazon Web Services Payment Cryptography decrypts the ciphertext using the private component of the asymmetric encryption key pair. For data encryption outside of Amazon Web Services Payment Cryptography, you can export the public component of the asymmetric key pair by calling GetPublicCertificate. For symmetric and DUKPT decryption, Amazon Web Services Payment Cryptography supports TDES and AES algorithms. For asymmetric decryption, Amazon Web Services Payment Cryptography supports RSA. When you use DUKPT, for TDES algorithm, the ciphertext data length must be a multiple of 16 bytes. For AES algorithm, the ciphertext data length must be a multiple of 32 bytes. For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     EncryptData     GetPublicCertificate     ImportKey   
   */
  decryptData(params: PaymentCryptographyData.Types.DecryptDataInput, callback?: (err: AWSError, data: PaymentCryptographyData.Types.DecryptDataOutput) => void): Request<PaymentCryptographyData.Types.DecryptDataOutput, AWSError>;
  /**
   * Decrypts ciphertext data to plaintext using symmetric, asymmetric, or DUKPT data encryption key. For more information, see Decrypt data in the Amazon Web Services Payment Cryptography User Guide. You can use an encryption key generated within Amazon Web Services Payment Cryptography, or you can import your own encryption key by calling ImportKey. For this operation, the key must have KeyModesOfUse set to Decrypt. In asymmetric decryption, Amazon Web Services Payment Cryptography decrypts the ciphertext using the private component of the asymmetric encryption key pair. For data encryption outside of Amazon Web Services Payment Cryptography, you can export the public component of the asymmetric key pair by calling GetPublicCertificate. For symmetric and DUKPT decryption, Amazon Web Services Payment Cryptography supports TDES and AES algorithms. For asymmetric decryption, Amazon Web Services Payment Cryptography supports RSA. When you use DUKPT, for TDES algorithm, the ciphertext data length must be a multiple of 16 bytes. For AES algorithm, the ciphertext data length must be a multiple of 32 bytes. For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     EncryptData     GetPublicCertificate     ImportKey   
   */
  decryptData(callback?: (err: AWSError, data: PaymentCryptographyData.Types.DecryptDataOutput) => void): Request<PaymentCryptographyData.Types.DecryptDataOutput, AWSError>;
  /**
   * Encrypts plaintext data to ciphertext using symmetric, asymmetric, or DUKPT data encryption key. For more information, see Encrypt data in the Amazon Web Services Payment Cryptography User Guide. You can generate an encryption key within Amazon Web Services Payment Cryptography by calling CreateKey. You can import your own encryption key by calling ImportKey. For this operation, the key must have KeyModesOfUse set to Encrypt. In asymmetric encryption, plaintext is encrypted using public component. You can import the public component of an asymmetric key pair created outside Amazon Web Services Payment Cryptography by calling ImportKey).  for symmetric and DUKPT encryption, Amazon Web Services Payment Cryptography supports TDES and AES algorithms. For asymmetric encryption, Amazon Web Services Payment Cryptography supports RSA. To encrypt using DUKPT, you must already have a DUKPT key in your account with KeyModesOfUse set to DeriveKey, or you can generate a new DUKPT key by calling CreateKey. For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     DecryptData     GetPublicCertificate     ImportKey     ReEncryptData   
   */
  encryptData(params: PaymentCryptographyData.Types.EncryptDataInput, callback?: (err: AWSError, data: PaymentCryptographyData.Types.EncryptDataOutput) => void): Request<PaymentCryptographyData.Types.EncryptDataOutput, AWSError>;
  /**
   * Encrypts plaintext data to ciphertext using symmetric, asymmetric, or DUKPT data encryption key. For more information, see Encrypt data in the Amazon Web Services Payment Cryptography User Guide. You can generate an encryption key within Amazon Web Services Payment Cryptography by calling CreateKey. You can import your own encryption key by calling ImportKey. For this operation, the key must have KeyModesOfUse set to Encrypt. In asymmetric encryption, plaintext is encrypted using public component. You can import the public component of an asymmetric key pair created outside Amazon Web Services Payment Cryptography by calling ImportKey).  for symmetric and DUKPT encryption, Amazon Web Services Payment Cryptography supports TDES and AES algorithms. For asymmetric encryption, Amazon Web Services Payment Cryptography supports RSA. To encrypt using DUKPT, you must already have a DUKPT key in your account with KeyModesOfUse set to DeriveKey, or you can generate a new DUKPT key by calling CreateKey. For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     DecryptData     GetPublicCertificate     ImportKey     ReEncryptData   
   */
  encryptData(callback?: (err: AWSError, data: PaymentCryptographyData.Types.EncryptDataOutput) => void): Request<PaymentCryptographyData.Types.EncryptDataOutput, AWSError>;
  /**
   * Generates card-related validation data using algorithms such as Card Verification Values (CVV/CVV2), Dynamic Card Verification Values (dCVV/dCVV2), or Card Security Codes (CSC). For more information, see Generate card data in the Amazon Web Services Payment Cryptography User Guide. This operation generates a CVV or CSC value that is printed on a payment credit or debit card during card production. The CVV or CSC, PAN (Primary Account Number) and expiration date of the card are required to check its validity during transaction processing. To begin this operation, a CVK (Card Verification Key) encryption key is required. You can use CreateKey or ImportKey to establish a CVK within Amazon Web Services Payment Cryptography. The KeyModesOfUse should be set to Generate and Verify for a CVK encryption key.  For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     ImportKey     VerifyCardValidationData   
   */
  generateCardValidationData(params: PaymentCryptographyData.Types.GenerateCardValidationDataInput, callback?: (err: AWSError, data: PaymentCryptographyData.Types.GenerateCardValidationDataOutput) => void): Request<PaymentCryptographyData.Types.GenerateCardValidationDataOutput, AWSError>;
  /**
   * Generates card-related validation data using algorithms such as Card Verification Values (CVV/CVV2), Dynamic Card Verification Values (dCVV/dCVV2), or Card Security Codes (CSC). For more information, see Generate card data in the Amazon Web Services Payment Cryptography User Guide. This operation generates a CVV or CSC value that is printed on a payment credit or debit card during card production. The CVV or CSC, PAN (Primary Account Number) and expiration date of the card are required to check its validity during transaction processing. To begin this operation, a CVK (Card Verification Key) encryption key is required. You can use CreateKey or ImportKey to establish a CVK within Amazon Web Services Payment Cryptography. The KeyModesOfUse should be set to Generate and Verify for a CVK encryption key.  For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     ImportKey     VerifyCardValidationData   
   */
  generateCardValidationData(callback?: (err: AWSError, data: PaymentCryptographyData.Types.GenerateCardValidationDataOutput) => void): Request<PaymentCryptographyData.Types.GenerateCardValidationDataOutput, AWSError>;
  /**
   * Generates a Message Authentication Code (MAC) cryptogram within Amazon Web Services Payment Cryptography.  You can use this operation when keys won't be shared but mutual data is present on both ends for validation. In this case, known data values are used to generate a MAC on both ends for comparision without sending or receiving data in ciphertext or plaintext. You can use this operation to generate a DUPKT, HMAC or EMV MAC by setting generation attributes and algorithm to the associated values. The MAC generation encryption key must have valid values for KeyUsage such as TR31_M7_HMAC_KEY for HMAC generation, and they key must have KeyModesOfUse set to Generate and Verify. For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     VerifyMac   
   */
  generateMac(params: PaymentCryptographyData.Types.GenerateMacInput, callback?: (err: AWSError, data: PaymentCryptographyData.Types.GenerateMacOutput) => void): Request<PaymentCryptographyData.Types.GenerateMacOutput, AWSError>;
  /**
   * Generates a Message Authentication Code (MAC) cryptogram within Amazon Web Services Payment Cryptography.  You can use this operation when keys won't be shared but mutual data is present on both ends for validation. In this case, known data values are used to generate a MAC on both ends for comparision without sending or receiving data in ciphertext or plaintext. You can use this operation to generate a DUPKT, HMAC or EMV MAC by setting generation attributes and algorithm to the associated values. The MAC generation encryption key must have valid values for KeyUsage such as TR31_M7_HMAC_KEY for HMAC generation, and they key must have KeyModesOfUse set to Generate and Verify. For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     VerifyMac   
   */
  generateMac(callback?: (err: AWSError, data: PaymentCryptographyData.Types.GenerateMacOutput) => void): Request<PaymentCryptographyData.Types.GenerateMacOutput, AWSError>;
  /**
   * Generates pin-related data such as PIN, PIN Verification Value (PVV), PIN Block, and PIN Offset during new card issuance or reissuance. For more information, see Generate PIN data in the Amazon Web Services Payment Cryptography User Guide. PIN data is never transmitted in clear to or from Amazon Web Services Payment Cryptography. This operation generates PIN, PVV, or PIN Offset and then encrypts it using Pin Encryption Key (PEK) to create an EncryptedPinBlock for transmission from Amazon Web Services Payment Cryptography. This operation uses a separate Pin Verification Key (PVK) for VISA PVV generation.  For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     GenerateCardValidationData     TranslatePinData     VerifyPinData   
   */
  generatePinData(params: PaymentCryptographyData.Types.GeneratePinDataInput, callback?: (err: AWSError, data: PaymentCryptographyData.Types.GeneratePinDataOutput) => void): Request<PaymentCryptographyData.Types.GeneratePinDataOutput, AWSError>;
  /**
   * Generates pin-related data such as PIN, PIN Verification Value (PVV), PIN Block, and PIN Offset during new card issuance or reissuance. For more information, see Generate PIN data in the Amazon Web Services Payment Cryptography User Guide. PIN data is never transmitted in clear to or from Amazon Web Services Payment Cryptography. This operation generates PIN, PVV, or PIN Offset and then encrypts it using Pin Encryption Key (PEK) to create an EncryptedPinBlock for transmission from Amazon Web Services Payment Cryptography. This operation uses a separate Pin Verification Key (PVK) for VISA PVV generation.  For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     GenerateCardValidationData     TranslatePinData     VerifyPinData   
   */
  generatePinData(callback?: (err: AWSError, data: PaymentCryptographyData.Types.GeneratePinDataOutput) => void): Request<PaymentCryptographyData.Types.GeneratePinDataOutput, AWSError>;
  /**
   * Re-encrypt ciphertext using DUKPT, Symmetric and Asymmetric Data Encryption Keys.  You can either generate an encryption key within Amazon Web Services Payment Cryptography by calling CreateKey or import your own encryption key by calling ImportKey. The KeyArn for use with this operation must be in a compatible key state with KeyModesOfUse set to Encrypt. In asymmetric encryption, ciphertext is encrypted using public component (imported by calling ImportKey) of the asymmetric key pair created outside of Amazon Web Services Payment Cryptography.  For symmetric and DUKPT encryption, Amazon Web Services Payment Cryptography supports TDES and AES algorithms. For asymmetric encryption, Amazon Web Services Payment Cryptography supports RSA. To encrypt using DUKPT, a DUKPT key must already exist within your account with KeyModesOfUse set to DeriveKey or a new DUKPT can be generated by calling CreateKey. For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     DecryptData     EncryptData     GetPublicCertificate     ImportKey   
   */
  reEncryptData(params: PaymentCryptographyData.Types.ReEncryptDataInput, callback?: (err: AWSError, data: PaymentCryptographyData.Types.ReEncryptDataOutput) => void): Request<PaymentCryptographyData.Types.ReEncryptDataOutput, AWSError>;
  /**
   * Re-encrypt ciphertext using DUKPT, Symmetric and Asymmetric Data Encryption Keys.  You can either generate an encryption key within Amazon Web Services Payment Cryptography by calling CreateKey or import your own encryption key by calling ImportKey. The KeyArn for use with this operation must be in a compatible key state with KeyModesOfUse set to Encrypt. In asymmetric encryption, ciphertext is encrypted using public component (imported by calling ImportKey) of the asymmetric key pair created outside of Amazon Web Services Payment Cryptography.  For symmetric and DUKPT encryption, Amazon Web Services Payment Cryptography supports TDES and AES algorithms. For asymmetric encryption, Amazon Web Services Payment Cryptography supports RSA. To encrypt using DUKPT, a DUKPT key must already exist within your account with KeyModesOfUse set to DeriveKey or a new DUKPT can be generated by calling CreateKey. For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     DecryptData     EncryptData     GetPublicCertificate     ImportKey   
   */
  reEncryptData(callback?: (err: AWSError, data: PaymentCryptographyData.Types.ReEncryptDataOutput) => void): Request<PaymentCryptographyData.Types.ReEncryptDataOutput, AWSError>;
  /**
   * Translates encrypted PIN block from and to ISO 9564 formats 0,1,3,4. For more information, see Translate PIN data in the Amazon Web Services Payment Cryptography User Guide. PIN block translation involves changing the encrytion of PIN block from one encryption key to another encryption key and changing PIN block format from one to another without PIN block data leaving Amazon Web Services Payment Cryptography. The encryption key transformation can be from PEK (Pin Encryption Key) to BDK (Base Derivation Key) for DUKPT or from BDK for DUKPT to PEK. Amazon Web Services Payment Cryptography supports TDES and AES key derivation type for DUKPT tranlations. You can use this operation for P2PE (Point to Point Encryption) use cases where the encryption keys should change but the processing system either does not need to, or is not permitted to, decrypt the data. The allowed combinations of PIN block format translations are guided by PCI. It is important to note that not all encrypted PIN block formats (example, format 1) require PAN (Primary Account Number) as input. And as such, PIN block format that requires PAN (example, formats 0,3,4) cannot be translated to a format (format 1) that does not require a PAN for generation.  For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.  At this time, Amazon Web Services Payment Cryptography does not support translations to PIN format 4.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     GeneratePinData     VerifyPinData   
   */
  translatePinData(params: PaymentCryptographyData.Types.TranslatePinDataInput, callback?: (err: AWSError, data: PaymentCryptographyData.Types.TranslatePinDataOutput) => void): Request<PaymentCryptographyData.Types.TranslatePinDataOutput, AWSError>;
  /**
   * Translates encrypted PIN block from and to ISO 9564 formats 0,1,3,4. For more information, see Translate PIN data in the Amazon Web Services Payment Cryptography User Guide. PIN block translation involves changing the encrytion of PIN block from one encryption key to another encryption key and changing PIN block format from one to another without PIN block data leaving Amazon Web Services Payment Cryptography. The encryption key transformation can be from PEK (Pin Encryption Key) to BDK (Base Derivation Key) for DUKPT or from BDK for DUKPT to PEK. Amazon Web Services Payment Cryptography supports TDES and AES key derivation type for DUKPT tranlations. You can use this operation for P2PE (Point to Point Encryption) use cases where the encryption keys should change but the processing system either does not need to, or is not permitted to, decrypt the data. The allowed combinations of PIN block format translations are guided by PCI. It is important to note that not all encrypted PIN block formats (example, format 1) require PAN (Primary Account Number) as input. And as such, PIN block format that requires PAN (example, formats 0,3,4) cannot be translated to a format (format 1) that does not require a PAN for generation.  For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.  At this time, Amazon Web Services Payment Cryptography does not support translations to PIN format 4.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     GeneratePinData     VerifyPinData   
   */
  translatePinData(callback?: (err: AWSError, data: PaymentCryptographyData.Types.TranslatePinDataOutput) => void): Request<PaymentCryptographyData.Types.TranslatePinDataOutput, AWSError>;
  /**
   * Verifies Authorization Request Cryptogram (ARQC) for a EMV chip payment card authorization. For more information, see Verify auth request cryptogram in the Amazon Web Services Payment Cryptography User Guide. ARQC generation is done outside of Amazon Web Services Payment Cryptography and is typically generated on a point of sale terminal for an EMV chip card to obtain payment authorization during transaction time. For ARQC verification, you must first import the ARQC generated outside of Amazon Web Services Payment Cryptography by calling ImportKey. This operation uses the imported ARQC and an major encryption key (DUKPT) created by calling CreateKey to either provide a boolean ARQC verification result or provide an APRC (Authorization Response Cryptogram) response using Method 1 or Method 2. The ARPC_METHOD_1 uses AuthResponseCode to generate ARPC and ARPC_METHOD_2 uses CardStatusUpdate to generate ARPC.  For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     VerifyCardValidationData     VerifyPinData   
   */
  verifyAuthRequestCryptogram(params: PaymentCryptographyData.Types.VerifyAuthRequestCryptogramInput, callback?: (err: AWSError, data: PaymentCryptographyData.Types.VerifyAuthRequestCryptogramOutput) => void): Request<PaymentCryptographyData.Types.VerifyAuthRequestCryptogramOutput, AWSError>;
  /**
   * Verifies Authorization Request Cryptogram (ARQC) for a EMV chip payment card authorization. For more information, see Verify auth request cryptogram in the Amazon Web Services Payment Cryptography User Guide. ARQC generation is done outside of Amazon Web Services Payment Cryptography and is typically generated on a point of sale terminal for an EMV chip card to obtain payment authorization during transaction time. For ARQC verification, you must first import the ARQC generated outside of Amazon Web Services Payment Cryptography by calling ImportKey. This operation uses the imported ARQC and an major encryption key (DUKPT) created by calling CreateKey to either provide a boolean ARQC verification result or provide an APRC (Authorization Response Cryptogram) response using Method 1 or Method 2. The ARPC_METHOD_1 uses AuthResponseCode to generate ARPC and ARPC_METHOD_2 uses CardStatusUpdate to generate ARPC.  For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.  Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     VerifyCardValidationData     VerifyPinData   
   */
  verifyAuthRequestCryptogram(callback?: (err: AWSError, data: PaymentCryptographyData.Types.VerifyAuthRequestCryptogramOutput) => void): Request<PaymentCryptographyData.Types.VerifyAuthRequestCryptogramOutput, AWSError>;
  /**
   * Verifies card-related validation data using algorithms such as Card Verification Values (CVV/CVV2), Dynamic Card Verification Values (dCVV/dCVV2) and Card Security Codes (CSC). For more information, see Verify card data in the Amazon Web Services Payment Cryptography User Guide. This operation validates the CVV or CSC codes that is printed on a payment credit or debit card during card payment transaction. The input values are typically provided as part of an inbound transaction to an issuer or supporting platform partner. Amazon Web Services Payment Cryptography uses CVV or CSC, PAN (Primary Account Number) and expiration date of the card to check its validity during transaction processing. In this operation, the CVK (Card Verification Key) encryption key for use with card data verification is same as the one in used for GenerateCardValidationData.  For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     GenerateCardValidationData     VerifyAuthRequestCryptogram     VerifyPinData   
   */
  verifyCardValidationData(params: PaymentCryptographyData.Types.VerifyCardValidationDataInput, callback?: (err: AWSError, data: PaymentCryptographyData.Types.VerifyCardValidationDataOutput) => void): Request<PaymentCryptographyData.Types.VerifyCardValidationDataOutput, AWSError>;
  /**
   * Verifies card-related validation data using algorithms such as Card Verification Values (CVV/CVV2), Dynamic Card Verification Values (dCVV/dCVV2) and Card Security Codes (CSC). For more information, see Verify card data in the Amazon Web Services Payment Cryptography User Guide. This operation validates the CVV or CSC codes that is printed on a payment credit or debit card during card payment transaction. The input values are typically provided as part of an inbound transaction to an issuer or supporting platform partner. Amazon Web Services Payment Cryptography uses CVV or CSC, PAN (Primary Account Number) and expiration date of the card to check its validity during transaction processing. In this operation, the CVK (Card Verification Key) encryption key for use with card data verification is same as the one in used for GenerateCardValidationData.  For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     GenerateCardValidationData     VerifyAuthRequestCryptogram     VerifyPinData   
   */
  verifyCardValidationData(callback?: (err: AWSError, data: PaymentCryptographyData.Types.VerifyCardValidationDataOutput) => void): Request<PaymentCryptographyData.Types.VerifyCardValidationDataOutput, AWSError>;
  /**
   * Verifies a Message Authentication Code (MAC).  You can use this operation when keys won't be shared but mutual data is present on both ends for validation. In this case, known data values are used to generate a MAC on both ends for verification without sending or receiving data in ciphertext or plaintext. You can use this operation to verify a DUPKT, HMAC or EMV MAC by setting generation attributes and algorithm to the associated values. Use the same encryption key for MAC verification as you use for GenerateMac.  For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     GenerateMac   
   */
  verifyMac(params: PaymentCryptographyData.Types.VerifyMacInput, callback?: (err: AWSError, data: PaymentCryptographyData.Types.VerifyMacOutput) => void): Request<PaymentCryptographyData.Types.VerifyMacOutput, AWSError>;
  /**
   * Verifies a Message Authentication Code (MAC).  You can use this operation when keys won't be shared but mutual data is present on both ends for validation. In this case, known data values are used to generate a MAC on both ends for verification without sending or receiving data in ciphertext or plaintext. You can use this operation to verify a DUPKT, HMAC or EMV MAC by setting generation attributes and algorithm to the associated values. Use the same encryption key for MAC verification as you use for GenerateMac.  For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     GenerateMac   
   */
  verifyMac(callback?: (err: AWSError, data: PaymentCryptographyData.Types.VerifyMacOutput) => void): Request<PaymentCryptographyData.Types.VerifyMacOutput, AWSError>;
  /**
   * Verifies pin-related data such as PIN and PIN Offset using algorithms including VISA PVV and IBM3624. For more information, see Verify PIN data in the Amazon Web Services Payment Cryptography User Guide. This operation verifies PIN data for user payment card. A card holder PIN data is never transmitted in clear to or from Amazon Web Services Payment Cryptography. This operation uses PIN Verification Key (PVK) for PIN or PIN Offset generation and then encrypts it using PIN Encryption Key (PEK) to create an EncryptedPinBlock for transmission from Amazon Web Services Payment Cryptography.  For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     GeneratePinData     TranslatePinData   
   */
  verifyPinData(params: PaymentCryptographyData.Types.VerifyPinDataInput, callback?: (err: AWSError, data: PaymentCryptographyData.Types.VerifyPinDataOutput) => void): Request<PaymentCryptographyData.Types.VerifyPinDataOutput, AWSError>;
  /**
   * Verifies pin-related data such as PIN and PIN Offset using algorithms including VISA PVV and IBM3624. For more information, see Verify PIN data in the Amazon Web Services Payment Cryptography User Guide. This operation verifies PIN data for user payment card. A card holder PIN data is never transmitted in clear to or from Amazon Web Services Payment Cryptography. This operation uses PIN Verification Key (PVK) for PIN or PIN Offset generation and then encrypts it using PIN Encryption Key (PEK) to create an EncryptedPinBlock for transmission from Amazon Web Services Payment Cryptography.  For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the Amazon Web Services Payment Cryptography User Guide.   Cross-account use: This operation can't be used across different Amazon Web Services accounts.  Related operations:     GeneratePinData     TranslatePinData   
   */
  verifyPinData(callback?: (err: AWSError, data: PaymentCryptographyData.Types.VerifyPinDataOutput) => void): Request<PaymentCryptographyData.Types.VerifyPinDataOutput, AWSError>;
}
declare namespace PaymentCryptographyData {
  export interface AmexCardSecurityCodeVersion1 {
    /**
     * The expiry date of a payment card.
     */
    CardExpiryDate: NumberLengthEquals4;
  }
  export interface AmexCardSecurityCodeVersion2 {
    /**
     * The expiry date of a payment card.
     */
    CardExpiryDate: NumberLengthEquals4;
    /**
     * The service code of the AMEX payment card. This is different from the Card Security Code (CSC).
     */
    ServiceCode: NumberLengthEquals3;
  }
  export interface AsymmetricEncryptionAttributes {
    /**
     * The padding to be included with the data.
     */
    PaddingType?: PaddingType;
  }
  export interface CardGenerationAttributes {
    AmexCardSecurityCodeVersion1?: AmexCardSecurityCodeVersion1;
    /**
     * Card data parameters that are required to generate a Card Security Code (CSC2) for an AMEX payment card.
     */
    AmexCardSecurityCodeVersion2?: AmexCardSecurityCodeVersion2;
    /**
     * Card data parameters that are required to generate a cardholder verification value for the payment card.
     */
    CardHolderVerificationValue?: CardHolderVerificationValue;
    /**
     * Card data parameters that are required to generate Card Verification Value (CVV) for the payment card.
     */
    CardVerificationValue1?: CardVerificationValue1;
    /**
     * Card data parameters that are required to generate Card Verification Value (CVV2) for the payment card.
     */
    CardVerificationValue2?: CardVerificationValue2;
    /**
     * Card data parameters that are required to generate CDynamic Card Verification Code (dCVC) for the payment card.
     */
    DynamicCardVerificationCode?: DynamicCardVerificationCode;
    /**
     * Card data parameters that are required to generate CDynamic Card Verification Value (dCVV) for the payment card.
     */
    DynamicCardVerificationValue?: DynamicCardVerificationValue;
  }
  export interface CardHolderVerificationValue {
    /**
     * The transaction counter value that comes from a point of sale terminal.
     */
    ApplicationTransactionCounter: HexLengthBetween2And4;
    /**
     * A number that identifies and differentiates payment cards with the same Primary Account Number (PAN).
     */
    PanSequenceNumber: HexLengthEquals2;
    /**
     * A random number generated by the issuer.
     */
    UnpredictableNumber: HexLengthBetween2And8;
  }
  export interface CardVerificationAttributes {
    AmexCardSecurityCodeVersion1?: AmexCardSecurityCodeVersion1;
    /**
     * Card data parameters that are required to verify a Card Security Code (CSC2) for an AMEX payment card.
     */
    AmexCardSecurityCodeVersion2?: AmexCardSecurityCodeVersion2;
    /**
     * Card data parameters that are required to verify a cardholder verification value for the payment card.
     */
    CardHolderVerificationValue?: CardHolderVerificationValue;
    /**
     * Card data parameters that are required to verify Card Verification Value (CVV) for the payment card.
     */
    CardVerificationValue1?: CardVerificationValue1;
    /**
     * Card data parameters that are required to verify Card Verification Value (CVV2) for the payment card.
     */
    CardVerificationValue2?: CardVerificationValue2;
    /**
     * Card data parameters that are required to verify CDynamic Card Verification Code (dCVC) for the payment card.
     */
    DiscoverDynamicCardVerificationCode?: DiscoverDynamicCardVerificationCode;
    /**
     * Card data parameters that are required to verify CDynamic Card Verification Code (dCVC) for the payment card.
     */
    DynamicCardVerificationCode?: DynamicCardVerificationCode;
    /**
     * Card data parameters that are required to verify CDynamic Card Verification Value (dCVV) for the payment card.
     */
    DynamicCardVerificationValue?: DynamicCardVerificationValue;
  }
  export interface CardVerificationValue1 {
    /**
     * The expiry date of a payment card.
     */
    CardExpiryDate: NumberLengthEquals4;
    /**
     * The service code of the payment card. This is different from Card Security Code (CSC).
     */
    ServiceCode: NumberLengthEquals3;
  }
  export interface CardVerificationValue2 {
    /**
     * The expiry date of a payment card.
     */
    CardExpiryDate: NumberLengthEquals4;
  }
  export interface CryptogramAuthResponse {
    /**
     * Parameters that are required for ARPC response generation using method1 after ARQC verification is successful.
     */
    ArpcMethod1?: CryptogramVerificationArpcMethod1;
    /**
     * Parameters that are required for ARPC response generation using method2 after ARQC verification is successful.
     */
    ArpcMethod2?: CryptogramVerificationArpcMethod2;
  }
  export interface CryptogramVerificationArpcMethod1 {
    /**
     * The auth code used to calculate APRC after ARQC verification is successful. This is the same auth code used for ARQC generation outside of Amazon Web Services Payment Cryptography.
     */
    AuthResponseCode: HexLengthEquals4;
  }
  export interface CryptogramVerificationArpcMethod2 {
    /**
     * The data indicating whether the issuer approves or declines an online transaction using an EMV chip card.
     */
    CardStatusUpdate: HexLengthEquals8;
    /**
     * The proprietary authentication data used by issuer for communication during online transaction using an EMV chip card.
     */
    ProprietaryAuthenticationData?: HexLengthBetween1And16;
  }
  export interface DecryptDataInput {
    /**
     * The ciphertext to decrypt.
     */
    CipherText: HexEvenLengthBetween16And4096;
    /**
     * The encryption key type and attributes for ciphertext decryption.
     */
    DecryptionAttributes: EncryptionDecryptionAttributes;
    /**
     * The keyARN of the encryption key that Amazon Web Services Payment Cryptography uses for ciphertext decryption.
     */
    KeyIdentifier: KeyArnOrKeyAliasType;
  }
  export interface DecryptDataOutput {
    /**
     * The keyARN of the encryption key that Amazon Web Services Payment Cryptography uses for ciphertext decryption.
     */
    KeyArn: KeyArn;
    /**
     * The key check value (KCV) of the encryption key. The KCV is used to check if all parties holding a given key have the same key or to detect that a key has changed. Amazon Web Services Payment Cryptography calculates the KCV by using standard algorithms, typically by encrypting 8 or 16 bytes or "00" or "01" and then truncating the result to the first 3 bytes, or 6 hex digits, of the resulting cryptogram.
     */
    KeyCheckValue: KeyCheckValue;
    /**
     * The decrypted plaintext data.
     */
    PlainText: HexEvenLengthBetween16And4096;
  }
  export interface DiscoverDynamicCardVerificationCode {
    /**
     * The transaction counter value that comes from the terminal.
     */
    ApplicationTransactionCounter: HexLengthBetween2And4;
    /**
     * The expiry date of a payment card.
     */
    CardExpiryDate: NumberLengthEquals4;
    /**
     * A random number that is generated by the issuer.
     */
    UnpredictableNumber: HexLengthBetween2And8;
  }
  export interface DukptAttributes {
    /**
     * The key type derived using DUKPT from a Base Derivation Key (BDK) and Key Serial Number (KSN). This must be less than or equal to the strength of the BDK. For example, you can't use AES_128 as a derivation type for a BDK of AES_128 or TDES_2KEY.
     */
    DukptDerivationType: DukptDerivationType;
    /**
     * The unique identifier known as Key Serial Number (KSN) that comes from an encrypting device using DUKPT encryption method. The KSN is derived from the encrypting device unique identifier and an internal transaction counter.
     */
    KeySerialNumber: HexLengthBetween10And24;
  }
  export interface DukptDerivationAttributes {
    /**
     * The key type derived using DUKPT from a Base Derivation Key (BDK) and Key Serial Number (KSN). This must be less than or equal to the strength of the BDK. For example, you can't use AES_128 as a derivation type for a BDK of AES_128 or TDES_2KEY 
     */
    DukptKeyDerivationType?: DukptDerivationType;
    /**
     * The type of use of DUKPT, which can be for incoming data decryption, outgoing data encryption, or both.
     */
    DukptKeyVariant?: DukptKeyVariant;
    /**
     * The unique identifier known as Key Serial Number (KSN) that comes from an encrypting device using DUKPT encryption method. The KSN is derived from the encrypting device unique identifier and an internal transaction counter.
     */
    KeySerialNumber: HexLengthBetween10And24;
  }
  export type DukptDerivationType = "TDES_2KEY"|"TDES_3KEY"|"AES_128"|"AES_192"|"AES_256"|string;
  export interface DukptEncryptionAttributes {
    /**
     * The key type encrypted using DUKPT from a Base Derivation Key (BDK) and Key Serial Number (KSN). This must be less than or equal to the strength of the BDK. For example, you can't use AES_128 as a derivation type for a BDK of AES_128 or TDES_2KEY 
     */
    DukptKeyDerivationType?: DukptDerivationType;
    /**
     * The type of use of DUKPT, which can be incoming data decryption, outgoing data encryption, or both.
     */
    DukptKeyVariant?: DukptKeyVariant;
    /**
     * An input to cryptographic primitive used to provide the intial state. Typically the InitializationVector must have a random or psuedo-random value, but sometimes it only needs to be unpredictable or unique. If you don't provide a value, Amazon Web Services Payment Cryptography generates a random value.
     */
    InitializationVector?: HexLength16Or32;
    /**
     * The unique identifier known as Key Serial Number (KSN) that comes from an encrypting device using DUKPT encryption method. The KSN is derived from the encrypting device unique identifier and an internal transaction counter.
     */
    KeySerialNumber: HexLengthBetween10And24;
    /**
     * The block cipher mode of operation. Block ciphers are designed to encrypt a block of data of fixed size, for example, 128 bits. The size of the input block is usually same as the size of the encrypted output block, while the key length can be different. A mode of operation describes how to repeatedly apply a cipher's single-block operation to securely transform amounts of data larger than a block. The default is CBC.
     */
    Mode?: DukptEncryptionMode;
  }
  export type DukptEncryptionMode = "ECB"|"CBC"|string;
  export type DukptKeyVariant = "BIDIRECTIONAL"|"REQUEST"|"RESPONSE"|string;
  export interface DynamicCardVerificationCode {
    /**
     * The transaction counter value that comes from the terminal.
     */
    ApplicationTransactionCounter: HexLengthBetween2And4;
    /**
     * A number that identifies and differentiates payment cards with the same Primary Account Number (PAN).
     */
    PanSequenceNumber: HexLengthEquals2;
    /**
     * The data on the two tracks of magnetic cards used for financial transactions. This includes the cardholder name, PAN, expiration date, bank ID (BIN) and several other numbers the issuing bank uses to validate the data received.
     */
    TrackData: HexLengthBetween2And160;
    /**
     * A random number generated by the issuer.
     */
    UnpredictableNumber: HexLengthBetween2And8;
  }
  export interface DynamicCardVerificationValue {
    /**
     * The transaction counter value that comes from the terminal.
     */
    ApplicationTransactionCounter: HexLengthBetween2And4;
    /**
     * The expiry date of a payment card.
     */
    CardExpiryDate: NumberLengthEquals4;
    /**
     * A number that identifies and differentiates payment cards with the same Primary Account Number (PAN).
     */
    PanSequenceNumber: HexLengthEquals2;
    /**
     * The service code of the payment card. This is different from Card Security Code (CSC).
     */
    ServiceCode: NumberLengthEquals3;
  }
  export interface EncryptDataInput {
    /**
     * The encryption key type and attributes for plaintext encryption.
     */
    EncryptionAttributes: EncryptionDecryptionAttributes;
    /**
     * The keyARN of the encryption key that Amazon Web Services Payment Cryptography uses for plaintext encryption.
     */
    KeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The plaintext to be encrypted.
     */
    PlainText: HexEvenLengthBetween16And4064;
  }
  export interface EncryptDataOutput {
    /**
     * The encrypted ciphertext.
     */
    CipherText: HexEvenLengthBetween16And4096;
    /**
     * The keyARN of the encryption key that Amazon Web Services Payment Cryptography uses for plaintext encryption.
     */
    KeyArn: KeyArn;
    /**
     * The key check value (KCV) of the encryption key. The KCV is used to check if all parties holding a given key have the same key or to detect that a key has changed. Amazon Web Services Payment Cryptography calculates the KCV by using standard algorithms, typically by encrypting 8 or 16 bytes or "00" or "01" and then truncating the result to the first 3 bytes, or 6 hex digits, of the resulting cryptogram.
     */
    KeyCheckValue?: KeyCheckValue;
  }
  export interface EncryptionDecryptionAttributes {
    Asymmetric?: AsymmetricEncryptionAttributes;
    Dukpt?: DukptEncryptionAttributes;
    /**
     * Parameters that are required to perform encryption and decryption using symmetric keys.
     */
    Symmetric?: SymmetricEncryptionAttributes;
  }
  export type EncryptionMode = "ECB"|"CBC"|"CFB"|"CFB1"|"CFB8"|"CFB64"|"CFB128"|"OFB"|string;
  export interface GenerateCardValidationDataInput {
    /**
     * The algorithm for generating CVV or CSC values for the card within Amazon Web Services Payment Cryptography.
     */
    GenerationAttributes: CardGenerationAttributes;
    /**
     * The keyARN of the CVK encryption key that Amazon Web Services Payment Cryptography uses to generate card data.
     */
    KeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The Primary Account Number (PAN), a unique identifier for a payment credit or debit card that associates the card with a specific account holder.
     */
    PrimaryAccountNumber: NumberLengthBetween12And19;
    /**
     * The length of the CVV or CSC to be generated. The default value is 3.
     */
    ValidationDataLength?: IntegerRangeBetween3And5Type;
  }
  export interface GenerateCardValidationDataOutput {
    /**
     * The keyARN of the CVK encryption key that Amazon Web Services Payment Cryptography uses to generate CVV or CSC.
     */
    KeyArn: KeyArn;
    /**
     * The key check value (KCV) of the encryption key. The KCV is used to check if all parties holding a given key have the same key or to detect that a key has changed. Amazon Web Services Payment Cryptography calculates the KCV by using standard algorithms, typically by encrypting 8 or 16 bytes or "00" or "01" and then truncating the result to the first 3 bytes, or 6 hex digits, of the resulting cryptogram.
     */
    KeyCheckValue: KeyCheckValue;
    /**
     * The CVV or CSC value that Amazon Web Services Payment Cryptography generates for the card.
     */
    ValidationData: NumberLengthBetween3And5;
  }
  export interface GenerateMacInput {
    /**
     * The attributes and data values to use for MAC generation within Amazon Web Services Payment Cryptography.
     */
    GenerationAttributes: MacAttributes;
    /**
     * The keyARN of the MAC generation encryption key.
     */
    KeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The length of a MAC under generation.
     */
    MacLength?: IntegerRangeBetween4And16;
    /**
     * The data for which a MAC is under generation.
     */
    MessageData: HexEvenLengthBetween2And4096;
  }
  export interface GenerateMacOutput {
    /**
     * The keyARN of the encryption key that Amazon Web Services Payment Cryptography uses for MAC generation.
     */
    KeyArn: KeyArn;
    /**
     * The key check value (KCV) of the encryption key. The KCV is used to check if all parties holding a given key have the same key or to detect that a key has changed. Amazon Web Services Payment Cryptography calculates the KCV by using standard algorithms, typically by encrypting 8 or 16 bytes or "00" or "01" and then truncating the result to the first 3 bytes, or 6 hex digits, of the resulting cryptogram.
     */
    KeyCheckValue: KeyCheckValue;
    /**
     * The MAC cryptogram generated within Amazon Web Services Payment Cryptography.
     */
    Mac: HexLengthBetween4And128;
  }
  export interface GeneratePinDataInput {
    /**
     * The keyARN of the PEK that Amazon Web Services Payment Cryptography uses to encrypt the PIN Block.
     */
    EncryptionKeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The attributes and values to use for PIN, PVV, or PIN Offset generation.
     */
    GenerationAttributes: PinGenerationAttributes;
    /**
     * The keyARN of the PEK that Amazon Web Services Payment Cryptography uses for pin data generation.
     */
    GenerationKeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The PIN encoding format for pin data generation as specified in ISO 9564. Amazon Web Services Payment Cryptography supports ISO_Format_0 and ISO_Format_3. The ISO_Format_0 PIN block format is equivalent to the ANSI X9.8, VISA-1, and ECI-1 PIN block formats. It is similar to a VISA-4 PIN block format. It supports a PIN from 4 to 12 digits in length. The ISO_Format_3 PIN block format is the same as ISO_Format_0 except that the fill digits are random values from 10 to 15.
     */
    PinBlockFormat: PinBlockFormatForPinData;
    /**
     * The length of PIN under generation.
     */
    PinDataLength?: IntegerRangeBetween4And12;
    /**
     * The Primary Account Number (PAN), a unique identifier for a payment credit or debit card that associates the card with a specific account holder.
     */
    PrimaryAccountNumber: NumberLengthBetween12And19;
  }
  export interface GeneratePinDataOutput {
    /**
     * The PIN block encrypted under PEK from Amazon Web Services Payment Cryptography. The encrypted PIN block is a composite of PAN (Primary Account Number) and PIN (Personal Identification Number), generated in accordance with ISO 9564 standard.
     */
    EncryptedPinBlock: HexLengthBetween16And32;
    /**
     * The keyARN of the PEK that Amazon Web Services Payment Cryptography uses for encrypted pin block generation.
     */
    EncryptionKeyArn: KeyArn;
    /**
     * The key check value (KCV) of the encryption key. The KCV is used to check if all parties holding a given key have the same key or to detect that a key has changed. Amazon Web Services Payment Cryptography calculates the KCV by using standard algorithms, typically by encrypting 8 or 16 bytes or "00" or "01" and then truncating the result to the first 3 bytes, or 6 hex digits, of the resulting cryptogram.
     */
    EncryptionKeyCheckValue: KeyCheckValue;
    /**
     * The keyARN of the pin data generation key that Amazon Web Services Payment Cryptography uses for PIN, PVV or PIN Offset generation.
     */
    GenerationKeyArn: KeyArn;
    /**
     * The key check value (KCV) of the encryption key. The KCV is used to check if all parties holding a given key have the same key or to detect that a key has changed. Amazon Web Services Payment Cryptography calculates the KCV by using standard algorithms, typically by encrypting 8 or 16 bytes or "00" or "01" and then truncating the result to the first 3 bytes, or 6 hex digits, of the resulting cryptogram.
     */
    GenerationKeyCheckValue: KeyCheckValue;
    /**
     * The attributes and values Amazon Web Services Payment Cryptography uses for pin data generation.
     */
    PinData: PinData;
  }
  export type HexEvenLengthBetween16And32 = string;
  export type HexEvenLengthBetween16And4064 = string;
  export type HexEvenLengthBetween16And4096 = string;
  export type HexEvenLengthBetween2And4096 = string;
  export type HexEvenLengthBetween4And128 = string;
  export type HexLength16Or32 = string;
  export type HexLengthBetween10And24 = string;
  export type HexLengthBetween16And32 = string;
  export type HexLengthBetween1And16 = string;
  export type HexLengthBetween2And1024 = string;
  export type HexLengthBetween2And160 = string;
  export type HexLengthBetween2And4 = string;
  export type HexLengthBetween2And8 = string;
  export type HexLengthBetween4And128 = string;
  export type HexLengthEquals1 = string;
  export type HexLengthEquals16 = string;
  export type HexLengthEquals2 = string;
  export type HexLengthEquals4 = string;
  export type HexLengthEquals8 = string;
  export interface Ibm3624NaturalPin {
    /**
     * The decimalization table to use for IBM 3624 PIN algorithm. The table is used to convert the algorithm intermediate result from hexadecimal characters to decimal.
     */
    DecimalizationTable: NumberLengthEquals16;
    /**
     * The unique data for cardholder identification.
     */
    PinValidationData: NumberLengthBetween4And16;
    /**
     * The padding character for validation data.
     */
    PinValidationDataPadCharacter: HexLengthEquals1;
  }
  export interface Ibm3624PinFromOffset {
    /**
     * The decimalization table to use for IBM 3624 PIN algorithm. The table is used to convert the algorithm intermediate result from hexadecimal characters to decimal.
     */
    DecimalizationTable: NumberLengthEquals16;
    /**
     * The PIN offset value.
     */
    PinOffset: NumberLengthBetween4And12;
    /**
     * The unique data for cardholder identification.
     */
    PinValidationData: NumberLengthBetween4And16;
    /**
     * The padding character for validation data.
     */
    PinValidationDataPadCharacter: HexLengthEquals1;
  }
  export interface Ibm3624PinOffset {
    /**
     * The decimalization table to use for IBM 3624 PIN algorithm. The table is used to convert the algorithm intermediate result from hexadecimal characters to decimal.
     */
    DecimalizationTable: NumberLengthEquals16;
    /**
     * The encrypted PIN block data. According to ISO 9564 standard, a PIN Block is an encoded representation of a payment card Personal Account Number (PAN) and the cardholder Personal Identification Number (PIN).
     */
    EncryptedPinBlock: HexLengthBetween16And32;
    /**
     * The unique data for cardholder identification.
     */
    PinValidationData: NumberLengthBetween4And16;
    /**
     * The padding character for validation data.
     */
    PinValidationDataPadCharacter: HexLengthEquals1;
  }
  export interface Ibm3624PinVerification {
    /**
     * The decimalization table to use for IBM 3624 PIN algorithm. The table is used to convert the algorithm intermediate result from hexadecimal characters to decimal.
     */
    DecimalizationTable: NumberLengthEquals16;
    /**
     * The PIN offset value.
     */
    PinOffset: NumberLengthBetween4And12;
    /**
     * The unique data for cardholder identification.
     */
    PinValidationData: NumberLengthBetween4And16;
    /**
     * The padding character for validation data.
     */
    PinValidationDataPadCharacter: HexLengthEquals1;
  }
  export interface Ibm3624RandomPin {
    /**
     * The decimalization table to use for IBM 3624 PIN algorithm. The table is used to convert the algorithm intermediate result from hexadecimal characters to decimal.
     */
    DecimalizationTable: NumberLengthEquals16;
    /**
     * The unique data for cardholder identification.
     */
    PinValidationData: NumberLengthBetween4And16;
    /**
     * The padding character for validation data.
     */
    PinValidationDataPadCharacter: HexLengthEquals1;
  }
  export type IntegerRangeBetween0And9 = number;
  export type IntegerRangeBetween3And5Type = number;
  export type IntegerRangeBetween4And12 = number;
  export type IntegerRangeBetween4And16 = number;
  export type KeyArn = string;
  export type KeyArnOrKeyAliasType = string;
  export type KeyCheckValue = string;
  export type MacAlgorithm = "ISO9797_ALGORITHM1"|"ISO9797_ALGORITHM3"|"CMAC"|"HMAC_SHA224"|"HMAC_SHA256"|"HMAC_SHA384"|"HMAC_SHA512"|string;
  export interface MacAlgorithmDukpt {
    /**
     * The key type derived using DUKPT from a Base Derivation Key (BDK) and Key Serial Number (KSN). This must be less than or equal to the strength of the BDK. For example, you can't use AES_128 as a derivation type for a BDK of AES_128 or TDES_2KEY.
     */
    DukptDerivationType?: DukptDerivationType;
    /**
     * The type of use of DUKPT, which can be MAC generation, MAC verification, or both.
     */
    DukptKeyVariant: DukptKeyVariant;
    /**
     * The unique identifier known as Key Serial Number (KSN) that comes from an encrypting device using DUKPT encryption method. The KSN is derived from the encrypting device unique identifier and an internal transaction counter.
     */
    KeySerialNumber: HexLengthBetween10And24;
  }
  export interface MacAlgorithmEmv {
    /**
     * The method to use when deriving the master key for EMV MAC generation or verification.
     */
    MajorKeyDerivationMode: MajorKeyDerivationMode;
    /**
     * A number that identifies and differentiates payment cards with the same Primary Account Number (PAN).
     */
    PanSequenceNumber: HexLengthEquals2;
    /**
     * The Primary Account Number (PAN), a unique identifier for a payment credit or debit card and associates the card to a specific account holder.
     */
    PrimaryAccountNumber: NumberLengthBetween12And19;
    /**
     * The method of deriving a session key for EMV MAC generation or verification.
     */
    SessionKeyDerivationMode: SessionKeyDerivationMode;
    /**
     * Parameters that are required to generate session key for EMV generation and verification.
     */
    SessionKeyDerivationValue: SessionKeyDerivationValue;
  }
  export interface MacAttributes {
    /**
     * The encryption algorithm for MAC generation or verification.
     */
    Algorithm?: MacAlgorithm;
    /**
     * Parameters that are required for MAC generation or verification using DUKPT CMAC algorithm.
     */
    DukptCmac?: MacAlgorithmDukpt;
    /**
     * Parameters that are required for MAC generation or verification using DUKPT ISO 9797 algorithm1.
     */
    DukptIso9797Algorithm1?: MacAlgorithmDukpt;
    /**
     * Parameters that are required for MAC generation or verification using DUKPT ISO 9797 algorithm2.
     */
    DukptIso9797Algorithm3?: MacAlgorithmDukpt;
    /**
     * Parameters that are required for MAC generation or verification using EMV MAC algorithm.
     */
    EmvMac?: MacAlgorithmEmv;
  }
  export type MajorKeyDerivationMode = "EMV_OPTION_A"|"EMV_OPTION_B"|string;
  export type NumberLengthBetween12And19 = string;
  export type NumberLengthBetween3And5 = string;
  export type NumberLengthBetween4And12 = string;
  export type NumberLengthBetween4And16 = string;
  export type NumberLengthEquals16 = string;
  export type NumberLengthEquals3 = string;
  export type NumberLengthEquals4 = string;
  export type PaddingType = "PKCS1"|"OAEP_SHA1"|"OAEP_SHA256"|"OAEP_SHA512"|string;
  export type PinBlockFormatForPinData = "ISO_FORMAT_0"|"ISO_FORMAT_3"|string;
  export interface PinData {
    /**
     * The PIN offset value.
     */
    PinOffset?: NumberLengthBetween4And12;
    /**
     * The unique data to identify a cardholder. In most cases, this is the same as cardholder's Primary Account Number (PAN). If a value is not provided, it defaults to PAN.
     */
    VerificationValue?: NumberLengthBetween4And12;
  }
  export interface PinGenerationAttributes {
    /**
     * Parameters that are required to generate or verify Ibm3624 natural PIN.
     */
    Ibm3624NaturalPin?: Ibm3624NaturalPin;
    /**
     * Parameters that are required to generate or verify Ibm3624 PIN from offset PIN.
     */
    Ibm3624PinFromOffset?: Ibm3624PinFromOffset;
    /**
     * Parameters that are required to generate or verify Ibm3624 PIN offset PIN.
     */
    Ibm3624PinOffset?: Ibm3624PinOffset;
    /**
     * Parameters that are required to generate or verify Ibm3624 random PIN.
     */
    Ibm3624RandomPin?: Ibm3624RandomPin;
    /**
     * Parameters that are required to generate or verify Visa PIN.
     */
    VisaPin?: VisaPin;
    /**
     * Parameters that are required to generate or verify Visa PIN Verification Value (PVV).
     */
    VisaPinVerificationValue?: VisaPinVerificationValue;
  }
  export interface PinVerificationAttributes {
    /**
     * Parameters that are required to generate or verify Ibm3624 PIN.
     */
    Ibm3624Pin?: Ibm3624PinVerification;
    /**
     * Parameters that are required to generate or verify Visa PIN.
     */
    VisaPin?: VisaPinVerification;
  }
  export interface ReEncryptDataInput {
    /**
     * Ciphertext to be encrypted. The minimum allowed length is 16 bytes and maximum allowed length is 4096 bytes.
     */
    CipherText: HexEvenLengthBetween16And4096;
    /**
     * The attributes and values for incoming ciphertext.
     */
    IncomingEncryptionAttributes: ReEncryptionAttributes;
    /**
     * The keyARN of the encryption key of incoming ciphertext data.
     */
    IncomingKeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The attributes and values for outgoing ciphertext data after encryption by Amazon Web Services Payment Cryptography.
     */
    OutgoingEncryptionAttributes: ReEncryptionAttributes;
    /**
     * The keyARN of the encryption key of outgoing ciphertext data after encryption by Amazon Web Services Payment Cryptography.
     */
    OutgoingKeyIdentifier: KeyArnOrKeyAliasType;
  }
  export interface ReEncryptDataOutput {
    /**
     * The encrypted ciphertext.
     */
    CipherText: HexEvenLengthBetween16And4096;
    /**
     * The keyARN (Amazon Resource Name) of the encryption key that Amazon Web Services Payment Cryptography uses for plaintext encryption.
     */
    KeyArn: KeyArn;
    /**
     * The key check value (KCV) of the encryption key. The KCV is used to check if all parties holding a given key have the same key or to detect that a key has changed. Amazon Web Services Payment Cryptography calculates the KCV by using standard algorithms, typically by encrypting 8 or 16 bytes or "00" or "01" and then truncating the result to the first 3 bytes, or 6 hex digits, of the resulting cryptogram.
     */
    KeyCheckValue: KeyCheckValue;
  }
  export interface ReEncryptionAttributes {
    Dukpt?: DukptEncryptionAttributes;
    /**
     * Parameters that are required to encrypt data using symmetric keys.
     */
    Symmetric?: SymmetricEncryptionAttributes;
  }
  export interface SessionKeyAmex {
    /**
     * A number that identifies and differentiates payment cards with the same Primary Account Number (PAN).
     */
    PanSequenceNumber: HexLengthEquals2;
    /**
     * The Primary Account Number (PAN) of the cardholder. A PAN is a unique identifier for a payment credit or debit card and associates the card to a specific account holder.
     */
    PrimaryAccountNumber: NumberLengthBetween12And19;
  }
  export interface SessionKeyDerivation {
    /**
     * Parameters to derive session key for an Amex payment card for ARQC verification.
     */
    Amex?: SessionKeyAmex;
    /**
     * Parameters to derive session key for an Emv2000 payment card for ARQC verification.
     */
    Emv2000?: SessionKeyEmv2000;
    /**
     * Parameters to derive session key for an Emv common payment card for ARQC verification.
     */
    EmvCommon?: SessionKeyEmvCommon;
    /**
     * Parameters to derive session key for a Mastercard payment card for ARQC verification.
     */
    Mastercard?: SessionKeyMastercard;
    /**
     * Parameters to derive session key for a Visa payment cardfor ARQC verification.
     */
    Visa?: SessionKeyVisa;
  }
  export type SessionKeyDerivationMode = "EMV_COMMON_SESSION_KEY"|"EMV2000"|"AMEX"|"MASTERCARD_SESSION_KEY"|"VISA"|string;
  export interface SessionKeyDerivationValue {
    /**
     * The cryptogram provided by the terminal during transaction processing.
     */
    ApplicationCryptogram?: HexLengthEquals16;
    /**
     * The transaction counter that is provided by the terminal during transaction processing.
     */
    ApplicationTransactionCounter?: HexLengthBetween2And4;
  }
  export interface SessionKeyEmv2000 {
    /**
     * The transaction counter that is provided by the terminal during transaction processing.
     */
    ApplicationTransactionCounter: HexLengthBetween2And4;
    /**
     * A number that identifies and differentiates payment cards with the same Primary Account Number (PAN).
     */
    PanSequenceNumber: HexLengthEquals2;
    /**
     * The Primary Account Number (PAN) of the cardholder. A PAN is a unique identifier for a payment credit or debit card and associates the card to a specific account holder.
     */
    PrimaryAccountNumber: NumberLengthBetween12And19;
  }
  export interface SessionKeyEmvCommon {
    /**
     * The transaction counter that is provided by the terminal during transaction processing.
     */
    ApplicationTransactionCounter: HexLengthBetween2And4;
    /**
     * A number that identifies and differentiates payment cards with the same Primary Account Number (PAN).
     */
    PanSequenceNumber: HexLengthEquals2;
    /**
     * The Primary Account Number (PAN) of the cardholder. A PAN is a unique identifier for a payment credit or debit card and associates the card to a specific account holder.
     */
    PrimaryAccountNumber: NumberLengthBetween12And19;
  }
  export interface SessionKeyMastercard {
    /**
     * The transaction counter that is provided by the terminal during transaction processing.
     */
    ApplicationTransactionCounter: HexLengthBetween2And4;
    /**
     * A number that identifies and differentiates payment cards with the same Primary Account Number (PAN).
     */
    PanSequenceNumber: HexLengthEquals2;
    /**
     * The Primary Account Number (PAN) of the cardholder. A PAN is a unique identifier for a payment credit or debit card and associates the card to a specific account holder.
     */
    PrimaryAccountNumber: NumberLengthBetween12And19;
    /**
     * A random number generated by the issuer.
     */
    UnpredictableNumber: HexLengthBetween2And8;
  }
  export interface SessionKeyVisa {
    /**
     * A number that identifies and differentiates payment cards with the same Primary Account Number (PAN).
     */
    PanSequenceNumber: HexLengthEquals2;
    /**
     * The Primary Account Number (PAN) of the cardholder. A PAN is a unique identifier for a payment credit or debit card and associates the card to a specific account holder.
     */
    PrimaryAccountNumber: NumberLengthBetween12And19;
  }
  export interface SymmetricEncryptionAttributes {
    /**
     * An input to cryptographic primitive used to provide the intial state. The InitializationVector is typically required have a random or psuedo-random value, but sometimes it only needs to be unpredictable or unique. If a value is not provided, Amazon Web Services Payment Cryptography generates a random value.
     */
    InitializationVector?: HexLength16Or32;
    /**
     * The block cipher mode of operation. Block ciphers are designed to encrypt a block of data of fixed size (for example, 128 bits). The size of the input block is usually same as the size of the encrypted output block, while the key length can be different. A mode of operation describes how to repeatedly apply a cipher's single-block operation to securely transform amounts of data larger than a block.
     */
    Mode: EncryptionMode;
    /**
     * The padding to be included with the data.
     */
    PaddingType?: PaddingType;
  }
  export interface TranslatePinDataInput {
    /**
     * The encrypted PIN block data that Amazon Web Services Payment Cryptography translates.
     */
    EncryptedPinBlock: HexEvenLengthBetween16And32;
    /**
     * The attributes and values to use for incoming DUKPT encryption key for PIN block tranlation.
     */
    IncomingDukptAttributes?: DukptDerivationAttributes;
    /**
     * The keyARN of the encryption key under which incoming PIN block data is encrypted. This key type can be PEK or BDK.
     */
    IncomingKeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The format of the incoming PIN block data for tranlation within Amazon Web Services Payment Cryptography.
     */
    IncomingTranslationAttributes: TranslationIsoFormats;
    /**
     * The attributes and values to use for outgoing DUKPT encryption key after PIN block translation.
     */
    OutgoingDukptAttributes?: DukptDerivationAttributes;
    /**
     * The keyARN of the encryption key for encrypting outgoing PIN block data. This key type can be PEK or BDK.
     */
    OutgoingKeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The format of the outgoing PIN block data after tranlation by Amazon Web Services Payment Cryptography.
     */
    OutgoingTranslationAttributes: TranslationIsoFormats;
  }
  export interface TranslatePinDataOutput {
    /**
     * The keyARN of the encryption key that Amazon Web Services Payment Cryptography uses to encrypt outgoing PIN block data after translation.
     */
    KeyArn: KeyArn;
    /**
     * The key check value (KCV) of the encryption key. The KCV is used to check if all parties holding a given key have the same key or to detect that a key has changed. Amazon Web Services Payment Cryptography calculates the KCV by using standard algorithms, typically by encrypting 8 or 16 bytes or "00" or "01" and then truncating the result to the first 3 bytes, or 6 hex digits, of the resulting cryptogram.
     */
    KeyCheckValue: KeyCheckValue;
    /**
     * The ougoing encrypted PIN block data after tranlation.
     */
    PinBlock: HexLengthBetween16And32;
  }
  export interface TranslationIsoFormats {
    /**
     * Parameters that are required for ISO9564 PIN format 0 tranlation.
     */
    IsoFormat0?: TranslationPinDataIsoFormat034;
    /**
     * Parameters that are required for ISO9564 PIN format 1 tranlation.
     */
    IsoFormat1?: TranslationPinDataIsoFormat1;
    /**
     * Parameters that are required for ISO9564 PIN format 3 tranlation.
     */
    IsoFormat3?: TranslationPinDataIsoFormat034;
    /**
     * Parameters that are required for ISO9564 PIN format 4 tranlation.
     */
    IsoFormat4?: TranslationPinDataIsoFormat034;
  }
  export interface TranslationPinDataIsoFormat034 {
    /**
     * The Primary Account Number (PAN) of the cardholder. A PAN is a unique identifier for a payment credit or debit card and associates the card to a specific account holder.
     */
    PrimaryAccountNumber: NumberLengthBetween12And19;
  }
  export interface TranslationPinDataIsoFormat1 {
  }
  export interface VerifyAuthRequestCryptogramInput {
    /**
     * The auth request cryptogram imported into Amazon Web Services Payment Cryptography for ARQC verification using a major encryption key and transaction data.
     */
    AuthRequestCryptogram: HexLengthEquals16;
    /**
     * The attributes and values for auth request cryptogram verification. These parameters are required in case using ARPC Method 1 or Method 2 for ARQC verification.
     */
    AuthResponseAttributes?: CryptogramAuthResponse;
    /**
     * The keyARN of the major encryption key that Amazon Web Services Payment Cryptography uses for ARQC verification.
     */
    KeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The method to use when deriving the major encryption key for ARQC verification within Amazon Web Services Payment Cryptography. The same key derivation mode was used for ARQC generation outside of Amazon Web Services Payment Cryptography.
     */
    MajorKeyDerivationMode: MajorKeyDerivationMode;
    /**
     * The attributes and values to use for deriving a session key for ARQC verification within Amazon Web Services Payment Cryptography. The same attributes were used for ARQC generation outside of Amazon Web Services Payment Cryptography.
     */
    SessionKeyDerivationAttributes: SessionKeyDerivation;
    /**
     * The transaction data that Amazon Web Services Payment Cryptography uses for ARQC verification. The same transaction is used for ARQC generation outside of Amazon Web Services Payment Cryptography.
     */
    TransactionData: HexLengthBetween2And1024;
  }
  export interface VerifyAuthRequestCryptogramOutput {
    /**
     * The result for ARQC verification or ARPC generation within Amazon Web Services Payment Cryptography.
     */
    AuthResponseValue?: HexLengthBetween1And16;
    /**
     * The keyARN of the major encryption key that Amazon Web Services Payment Cryptography uses for ARQC verification.
     */
    KeyArn: KeyArn;
    /**
     * The key check value (KCV) of the encryption key. The KCV is used to check if all parties holding a given key have the same key or to detect that a key has changed. Amazon Web Services Payment Cryptography calculates the KCV by using standard algorithms, typically by encrypting 8 or 16 bytes or "00" or "01" and then truncating the result to the first 3 bytes, or 6 hex digits, of the resulting cryptogram.
     */
    KeyCheckValue: KeyCheckValue;
  }
  export interface VerifyCardValidationDataInput {
    /**
     * The keyARN of the CVK encryption key that Amazon Web Services Payment Cryptography uses to verify card data.
     */
    KeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The Primary Account Number (PAN), a unique identifier for a payment credit or debit card that associates the card with a specific account holder.
     */
    PrimaryAccountNumber: NumberLengthBetween12And19;
    /**
     * The CVV or CSC value for use for card data verification within Amazon Web Services Payment Cryptography.
     */
    ValidationData: NumberLengthBetween3And5;
    /**
     * The algorithm to use for verification of card data within Amazon Web Services Payment Cryptography.
     */
    VerificationAttributes: CardVerificationAttributes;
  }
  export interface VerifyCardValidationDataOutput {
    /**
     * The keyARN of the CVK encryption key that Amazon Web Services Payment Cryptography uses to verify CVV or CSC.
     */
    KeyArn: KeyArn;
    /**
     * The key check value (KCV) of the encryption key. The KCV is used to check if all parties holding a given key have the same key or to detect that a key has changed. Amazon Web Services Payment Cryptography calculates the KCV by using standard algorithms, typically by encrypting 8 or 16 bytes or "00" or "01" and then truncating the result to the first 3 bytes, or 6 hex digits, of the resulting cryptogram.
     */
    KeyCheckValue: KeyCheckValue;
  }
  export interface VerifyMacInput {
    /**
     * The keyARN of the encryption key that Amazon Web Services Payment Cryptography uses to verify MAC data.
     */
    KeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The MAC being verified.
     */
    Mac: HexEvenLengthBetween4And128;
    /**
     * The length of the MAC.
     */
    MacLength?: IntegerRangeBetween4And16;
    /**
     * The data on for which MAC is under verification.
     */
    MessageData: HexEvenLengthBetween2And4096;
    /**
     * The attributes and data values to use for MAC verification within Amazon Web Services Payment Cryptography.
     */
    VerificationAttributes: MacAttributes;
  }
  export interface VerifyMacOutput {
    /**
     * The keyARN of the encryption key that Amazon Web Services Payment Cryptography uses for MAC verification.
     */
    KeyArn: KeyArn;
    /**
     * The key check value (KCV) of the encryption key. The KCV is used to check if all parties holding a given key have the same key or to detect that a key has changed. Amazon Web Services Payment Cryptography calculates the KCV by using standard algorithms, typically by encrypting 8 or 16 bytes or "00" or "01" and then truncating the result to the first 3 bytes, or 6 hex digits, of the resulting cryptogram.
     */
    KeyCheckValue: KeyCheckValue;
  }
  export interface VerifyPinDataInput {
    /**
     * The attributes and values for the DUKPT encrypted PIN block data.
     */
    DukptAttributes?: DukptAttributes;
    /**
     * The encrypted PIN block data that Amazon Web Services Payment Cryptography verifies.
     */
    EncryptedPinBlock: HexLengthBetween16And32;
    /**
     * The keyARN of the encryption key under which the PIN block data is encrypted. This key type can be PEK or BDK.
     */
    EncryptionKeyIdentifier: KeyArnOrKeyAliasType;
    /**
     * The PIN encoding format for pin data generation as specified in ISO 9564. Amazon Web Services Payment Cryptography supports ISO_Format_0 and ISO_Format_3. The ISO_Format_0 PIN block format is equivalent to the ANSI X9.8, VISA-1, and ECI-1 PIN block formats. It is similar to a VISA-4 PIN block format. It supports a PIN from 4 to 12 digits in length. The ISO_Format_3 PIN block format is the same as ISO_Format_0 except that the fill digits are random values from 10 to 15.
     */
    PinBlockFormat: PinBlockFormatForPinData;
    /**
     * The length of PIN being verified.
     */
    PinDataLength?: IntegerRangeBetween4And12;
    /**
     * The Primary Account Number (PAN), a unique identifier for a payment credit or debit card that associates the card with a specific account holder.
     */
    PrimaryAccountNumber: NumberLengthBetween12And19;
    /**
     * The attributes and values for PIN data verification.
     */
    VerificationAttributes: PinVerificationAttributes;
    /**
     * The keyARN of the PIN verification key.
     */
    VerificationKeyIdentifier: KeyArnOrKeyAliasType;
  }
  export interface VerifyPinDataOutput {
    /**
     * The keyARN of the PEK that Amazon Web Services Payment Cryptography uses for encrypted pin block generation.
     */
    EncryptionKeyArn: KeyArn;
    /**
     * The key check value (KCV) of the encryption key. The KCV is used to check if all parties holding a given key have the same key or to detect that a key has changed. Amazon Web Services Payment Cryptography calculates the KCV by using standard algorithms, typically by encrypting 8 or 16 bytes or "00" or "01" and then truncating the result to the first 3 bytes, or 6 hex digits, of the resulting cryptogram.
     */
    EncryptionKeyCheckValue: KeyCheckValue;
    /**
     * The keyARN of the PIN encryption key that Amazon Web Services Payment Cryptography uses for PIN or PIN Offset verification.
     */
    VerificationKeyArn: KeyArn;
    /**
     * The key check value (KCV) of the encryption key. The KCV is used to check if all parties holding a given key have the same key or to detect that a key has changed. Amazon Web Services Payment Cryptography calculates the KCV by using standard algorithms, typically by encrypting 8 or 16 bytes or "00" or "01" and then truncating the result to the first 3 bytes, or 6 hex digits, of the resulting cryptogram.
     */
    VerificationKeyCheckValue: KeyCheckValue;
  }
  export interface VisaPin {
    /**
     * The value for PIN verification index. It is used in the Visa PIN algorithm to calculate the PVV (PIN Verification Value).
     */
    PinVerificationKeyIndex: IntegerRangeBetween0And9;
  }
  export interface VisaPinVerification {
    /**
     * The value for PIN verification index. It is used in the Visa PIN algorithm to calculate the PVV (PIN Verification Value).
     */
    PinVerificationKeyIndex: IntegerRangeBetween0And9;
    /**
     * Parameters that are required to generate or verify Visa PVV (PIN Verification Value).
     */
    VerificationValue: NumberLengthBetween4And12;
  }
  export interface VisaPinVerificationValue {
    /**
     * The encrypted PIN block data to verify.
     */
    EncryptedPinBlock: HexLengthBetween16And32;
    /**
     * The value for PIN verification index. It is used in the Visa PIN algorithm to calculate the PVV (PIN Verification Value).
     */
    PinVerificationKeyIndex: IntegerRangeBetween0And9;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-02-03"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the PaymentCryptographyData client.
   */
  export import Types = PaymentCryptographyData;
}
export = PaymentCryptographyData;
