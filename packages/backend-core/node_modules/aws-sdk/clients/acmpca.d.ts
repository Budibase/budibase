import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ACMPCA extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ACMPCA.Types.ClientConfiguration)
  config: Config & ACMPCA.Types.ClientConfiguration;
  /**
   * Creates a root or subordinate private certificate authority (CA). You must specify the CA configuration, an optional configuration for Online Certificate Status Protocol (OCSP) and/or a certificate revocation list (CRL), the CA type, and an optional idempotency token to avoid accidental creation of multiple CAs. The CA configuration specifies the name of the algorithm and key size to be used to create the CA private key, the type of signing algorithm that the CA uses, and X.500 subject information. The OCSP configuration can optionally specify a custom URL for the OCSP responder. The CRL configuration specifies the CRL expiration period in days (the validity period of the CRL), the Amazon S3 bucket that will contain the CRL, and a CNAME alias for the S3 bucket that is included in certificates issued by the CA. If successful, this action returns the Amazon Resource Name (ARN) of the CA. ACM Private CA assets that are stored in Amazon S3 can be protected with encryption. For more information, see Encrypting Your CRLs.  Both PCA and the IAM principal must have permission to write to the S3 bucket that you specify. If the IAM principal making the call does not have permission to write to the bucket, then an exception is thrown. For more information, see Configure Access to ACM Private CA. 
   */
  createCertificateAuthority(params: ACMPCA.Types.CreateCertificateAuthorityRequest, callback?: (err: AWSError, data: ACMPCA.Types.CreateCertificateAuthorityResponse) => void): Request<ACMPCA.Types.CreateCertificateAuthorityResponse, AWSError>;
  /**
   * Creates a root or subordinate private certificate authority (CA). You must specify the CA configuration, an optional configuration for Online Certificate Status Protocol (OCSP) and/or a certificate revocation list (CRL), the CA type, and an optional idempotency token to avoid accidental creation of multiple CAs. The CA configuration specifies the name of the algorithm and key size to be used to create the CA private key, the type of signing algorithm that the CA uses, and X.500 subject information. The OCSP configuration can optionally specify a custom URL for the OCSP responder. The CRL configuration specifies the CRL expiration period in days (the validity period of the CRL), the Amazon S3 bucket that will contain the CRL, and a CNAME alias for the S3 bucket that is included in certificates issued by the CA. If successful, this action returns the Amazon Resource Name (ARN) of the CA. ACM Private CA assets that are stored in Amazon S3 can be protected with encryption. For more information, see Encrypting Your CRLs.  Both PCA and the IAM principal must have permission to write to the S3 bucket that you specify. If the IAM principal making the call does not have permission to write to the bucket, then an exception is thrown. For more information, see Configure Access to ACM Private CA. 
   */
  createCertificateAuthority(callback?: (err: AWSError, data: ACMPCA.Types.CreateCertificateAuthorityResponse) => void): Request<ACMPCA.Types.CreateCertificateAuthorityResponse, AWSError>;
  /**
   * Creates an audit report that lists every time that your CA private key is used. The report is saved in the Amazon S3 bucket that you specify on input. The IssueCertificate and RevokeCertificate actions use the private key.   Both PCA and the IAM principal must have permission to write to the S3 bucket that you specify. If the IAM principal making the call does not have permission to write to the bucket, then an exception is thrown. For more information, see Configure Access to ACM Private CA.  ACM Private CA assets that are stored in Amazon S3 can be protected with encryption. For more information, see Encrypting Your Audit Reports.
   */
  createCertificateAuthorityAuditReport(params: ACMPCA.Types.CreateCertificateAuthorityAuditReportRequest, callback?: (err: AWSError, data: ACMPCA.Types.CreateCertificateAuthorityAuditReportResponse) => void): Request<ACMPCA.Types.CreateCertificateAuthorityAuditReportResponse, AWSError>;
  /**
   * Creates an audit report that lists every time that your CA private key is used. The report is saved in the Amazon S3 bucket that you specify on input. The IssueCertificate and RevokeCertificate actions use the private key.   Both PCA and the IAM principal must have permission to write to the S3 bucket that you specify. If the IAM principal making the call does not have permission to write to the bucket, then an exception is thrown. For more information, see Configure Access to ACM Private CA.  ACM Private CA assets that are stored in Amazon S3 can be protected with encryption. For more information, see Encrypting Your Audit Reports.
   */
  createCertificateAuthorityAuditReport(callback?: (err: AWSError, data: ACMPCA.Types.CreateCertificateAuthorityAuditReportResponse) => void): Request<ACMPCA.Types.CreateCertificateAuthorityAuditReportResponse, AWSError>;
  /**
   * Grants one or more permissions on a private CA to the AWS Certificate Manager (ACM) service principal (acm.amazonaws.com). These permissions allow ACM to issue and renew ACM certificates that reside in the same AWS account as the CA. You can list current permissions with the ListPermissions action and revoke them with the DeletePermission action.  About Permissions    If the private CA and the certificates it issues reside in the same account, you can use CreatePermission to grant permissions for ACM to carry out automatic certificate renewals.   For automatic certificate renewal to succeed, the ACM service principal needs permissions to create, retrieve, and list certificates.   If the private CA and the ACM certificates reside in different accounts, then permissions cannot be used to enable automatic renewals. Instead, the ACM certificate owner must set up a resource-based policy to enable cross-account issuance and renewals. For more information, see Using a Resource Based Policy with ACM Private CA.  
   */
  createPermission(params: ACMPCA.Types.CreatePermissionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Grants one or more permissions on a private CA to the AWS Certificate Manager (ACM) service principal (acm.amazonaws.com). These permissions allow ACM to issue and renew ACM certificates that reside in the same AWS account as the CA. You can list current permissions with the ListPermissions action and revoke them with the DeletePermission action.  About Permissions    If the private CA and the certificates it issues reside in the same account, you can use CreatePermission to grant permissions for ACM to carry out automatic certificate renewals.   For automatic certificate renewal to succeed, the ACM service principal needs permissions to create, retrieve, and list certificates.   If the private CA and the ACM certificates reside in different accounts, then permissions cannot be used to enable automatic renewals. Instead, the ACM certificate owner must set up a resource-based policy to enable cross-account issuance and renewals. For more information, see Using a Resource Based Policy with ACM Private CA.  
   */
  createPermission(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a private certificate authority (CA). You must provide the Amazon Resource Name (ARN) of the private CA that you want to delete. You can find the ARN by calling the ListCertificateAuthorities action.   Deleting a CA will invalidate other CAs and certificates below it in your CA hierarchy.  Before you can delete a CA that you have created and activated, you must disable it. To do this, call the UpdateCertificateAuthority action and set the CertificateAuthorityStatus parameter to DISABLED.  Additionally, you can delete a CA if you are waiting for it to be created (that is, the status of the CA is CREATING). You can also delete it if the CA has been created but you haven't yet imported the signed certificate into ACM Private CA (that is, the status of the CA is PENDING_CERTIFICATE).  When you successfully call DeleteCertificateAuthority, the CA's status changes to DELETED. However, the CA won't be permanently deleted until the restoration period has passed. By default, if you do not set the PermanentDeletionTimeInDays parameter, the CA remains restorable for 30 days. You can set the parameter from 7 to 30 days. The DescribeCertificateAuthority action returns the time remaining in the restoration window of a private CA in the DELETED state. To restore an eligible CA, call the RestoreCertificateAuthority action.
   */
  deleteCertificateAuthority(params: ACMPCA.Types.DeleteCertificateAuthorityRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a private certificate authority (CA). You must provide the Amazon Resource Name (ARN) of the private CA that you want to delete. You can find the ARN by calling the ListCertificateAuthorities action.   Deleting a CA will invalidate other CAs and certificates below it in your CA hierarchy.  Before you can delete a CA that you have created and activated, you must disable it. To do this, call the UpdateCertificateAuthority action and set the CertificateAuthorityStatus parameter to DISABLED.  Additionally, you can delete a CA if you are waiting for it to be created (that is, the status of the CA is CREATING). You can also delete it if the CA has been created but you haven't yet imported the signed certificate into ACM Private CA (that is, the status of the CA is PENDING_CERTIFICATE).  When you successfully call DeleteCertificateAuthority, the CA's status changes to DELETED. However, the CA won't be permanently deleted until the restoration period has passed. By default, if you do not set the PermanentDeletionTimeInDays parameter, the CA remains restorable for 30 days. You can set the parameter from 7 to 30 days. The DescribeCertificateAuthority action returns the time remaining in the restoration window of a private CA in the DELETED state. To restore an eligible CA, call the RestoreCertificateAuthority action.
   */
  deleteCertificateAuthority(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Revokes permissions on a private CA granted to the AWS Certificate Manager (ACM) service principal (acm.amazonaws.com).  These permissions allow ACM to issue and renew ACM certificates that reside in the same AWS account as the CA. If you revoke these permissions, ACM will no longer renew the affected certificates automatically. Permissions can be granted with the CreatePermission action and listed with the ListPermissions action.   About Permissions    If the private CA and the certificates it issues reside in the same account, you can use CreatePermission to grant permissions for ACM to carry out automatic certificate renewals.   For automatic certificate renewal to succeed, the ACM service principal needs permissions to create, retrieve, and list certificates.   If the private CA and the ACM certificates reside in different accounts, then permissions cannot be used to enable automatic renewals. Instead, the ACM certificate owner must set up a resource-based policy to enable cross-account issuance and renewals. For more information, see Using a Resource Based Policy with ACM Private CA.  
   */
  deletePermission(params: ACMPCA.Types.DeletePermissionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Revokes permissions on a private CA granted to the AWS Certificate Manager (ACM) service principal (acm.amazonaws.com).  These permissions allow ACM to issue and renew ACM certificates that reside in the same AWS account as the CA. If you revoke these permissions, ACM will no longer renew the affected certificates automatically. Permissions can be granted with the CreatePermission action and listed with the ListPermissions action.   About Permissions    If the private CA and the certificates it issues reside in the same account, you can use CreatePermission to grant permissions for ACM to carry out automatic certificate renewals.   For automatic certificate renewal to succeed, the ACM service principal needs permissions to create, retrieve, and list certificates.   If the private CA and the ACM certificates reside in different accounts, then permissions cannot be used to enable automatic renewals. Instead, the ACM certificate owner must set up a resource-based policy to enable cross-account issuance and renewals. For more information, see Using a Resource Based Policy with ACM Private CA.  
   */
  deletePermission(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the resource-based policy attached to a private CA. Deletion will remove any access that the policy has granted. If there is no policy attached to the private CA, this action will return successful. If you delete a policy that was applied through AWS Resource Access Manager (RAM), the CA will be removed from all shares in which it was included.  The AWS Certificate Manager Service Linked Role that the policy supports is not affected when you delete the policy.  The current policy can be shown with GetPolicy and updated with PutPolicy.  About Policies    A policy grants access on a private CA to an AWS customer account, to AWS Organizations, or to an AWS Organizations unit. Policies are under the control of a CA administrator. For more information, see Using a Resource Based Policy with ACM Private CA.   A policy permits a user of AWS Certificate Manager (ACM) to issue ACM certificates signed by a CA in another account.   For ACM to manage automatic renewal of these certificates, the ACM user must configure a Service Linked Role (SLR). The SLR allows the ACM service to assume the identity of the user, subject to confirmation against the ACM Private CA policy. For more information, see Using a Service Linked Role with ACM.   Updates made in AWS Resource Manager (RAM) are reflected in policies. For more information, see Attach a Policy for Cross-Account Access.  
   */
  deletePolicy(params: ACMPCA.Types.DeletePolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the resource-based policy attached to a private CA. Deletion will remove any access that the policy has granted. If there is no policy attached to the private CA, this action will return successful. If you delete a policy that was applied through AWS Resource Access Manager (RAM), the CA will be removed from all shares in which it was included.  The AWS Certificate Manager Service Linked Role that the policy supports is not affected when you delete the policy.  The current policy can be shown with GetPolicy and updated with PutPolicy.  About Policies    A policy grants access on a private CA to an AWS customer account, to AWS Organizations, or to an AWS Organizations unit. Policies are under the control of a CA administrator. For more information, see Using a Resource Based Policy with ACM Private CA.   A policy permits a user of AWS Certificate Manager (ACM) to issue ACM certificates signed by a CA in another account.   For ACM to manage automatic renewal of these certificates, the ACM user must configure a Service Linked Role (SLR). The SLR allows the ACM service to assume the identity of the user, subject to confirmation against the ACM Private CA policy. For more information, see Using a Service Linked Role with ACM.   Updates made in AWS Resource Manager (RAM) are reflected in policies. For more information, see Attach a Policy for Cross-Account Access.  
   */
  deletePolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Lists information about your private certificate authority (CA) or one that has been shared with you. You specify the private CA on input by its ARN (Amazon Resource Name). The output contains the status of your CA. This can be any of the following:     CREATING - ACM Private CA is creating your private certificate authority.    PENDING_CERTIFICATE - The certificate is pending. You must use your ACM Private CA-hosted or on-premises root or subordinate CA to sign your private CA CSR and then import it into PCA.     ACTIVE - Your private CA is active.    DISABLED - Your private CA has been disabled.    EXPIRED - Your private CA certificate has expired.    FAILED - Your private CA has failed. Your CA can fail because of problems such a network outage or back-end AWS failure or other errors. A failed CA can never return to the pending state. You must create a new CA.     DELETED - Your private CA is within the restoration period, after which it is permanently deleted. The length of time remaining in the CA's restoration period is also included in this action's output.  
   */
  describeCertificateAuthority(params: ACMPCA.Types.DescribeCertificateAuthorityRequest, callback?: (err: AWSError, data: ACMPCA.Types.DescribeCertificateAuthorityResponse) => void): Request<ACMPCA.Types.DescribeCertificateAuthorityResponse, AWSError>;
  /**
   * Lists information about your private certificate authority (CA) or one that has been shared with you. You specify the private CA on input by its ARN (Amazon Resource Name). The output contains the status of your CA. This can be any of the following:     CREATING - ACM Private CA is creating your private certificate authority.    PENDING_CERTIFICATE - The certificate is pending. You must use your ACM Private CA-hosted or on-premises root or subordinate CA to sign your private CA CSR and then import it into PCA.     ACTIVE - Your private CA is active.    DISABLED - Your private CA has been disabled.    EXPIRED - Your private CA certificate has expired.    FAILED - Your private CA has failed. Your CA can fail because of problems such a network outage or back-end AWS failure or other errors. A failed CA can never return to the pending state. You must create a new CA.     DELETED - Your private CA is within the restoration period, after which it is permanently deleted. The length of time remaining in the CA's restoration period is also included in this action's output.  
   */
  describeCertificateAuthority(callback?: (err: AWSError, data: ACMPCA.Types.DescribeCertificateAuthorityResponse) => void): Request<ACMPCA.Types.DescribeCertificateAuthorityResponse, AWSError>;
  /**
   * Lists information about a specific audit report created by calling the CreateCertificateAuthorityAuditReport action. Audit information is created every time the certificate authority (CA) private key is used. The private key is used when you call the IssueCertificate action or the RevokeCertificate action. 
   */
  describeCertificateAuthorityAuditReport(params: ACMPCA.Types.DescribeCertificateAuthorityAuditReportRequest, callback?: (err: AWSError, data: ACMPCA.Types.DescribeCertificateAuthorityAuditReportResponse) => void): Request<ACMPCA.Types.DescribeCertificateAuthorityAuditReportResponse, AWSError>;
  /**
   * Lists information about a specific audit report created by calling the CreateCertificateAuthorityAuditReport action. Audit information is created every time the certificate authority (CA) private key is used. The private key is used when you call the IssueCertificate action or the RevokeCertificate action. 
   */
  describeCertificateAuthorityAuditReport(callback?: (err: AWSError, data: ACMPCA.Types.DescribeCertificateAuthorityAuditReportResponse) => void): Request<ACMPCA.Types.DescribeCertificateAuthorityAuditReportResponse, AWSError>;
  /**
   * Retrieves a certificate from your private CA or one that has been shared with you. The ARN of the certificate is returned when you call the IssueCertificate action. You must specify both the ARN of your private CA and the ARN of the issued certificate when calling the GetCertificate action. You can retrieve the certificate if it is in the ISSUED state. You can call the CreateCertificateAuthorityAuditReport action to create a report that contains information about all of the certificates issued and revoked by your private CA. 
   */
  getCertificate(params: ACMPCA.Types.GetCertificateRequest, callback?: (err: AWSError, data: ACMPCA.Types.GetCertificateResponse) => void): Request<ACMPCA.Types.GetCertificateResponse, AWSError>;
  /**
   * Retrieves a certificate from your private CA or one that has been shared with you. The ARN of the certificate is returned when you call the IssueCertificate action. You must specify both the ARN of your private CA and the ARN of the issued certificate when calling the GetCertificate action. You can retrieve the certificate if it is in the ISSUED state. You can call the CreateCertificateAuthorityAuditReport action to create a report that contains information about all of the certificates issued and revoked by your private CA. 
   */
  getCertificate(callback?: (err: AWSError, data: ACMPCA.Types.GetCertificateResponse) => void): Request<ACMPCA.Types.GetCertificateResponse, AWSError>;
  /**
   * Retrieves the certificate and certificate chain for your private certificate authority (CA) or one that has been shared with you. Both the certificate and the chain are base64 PEM-encoded. The chain does not include the CA certificate. Each certificate in the chain signs the one before it. 
   */
  getCertificateAuthorityCertificate(params: ACMPCA.Types.GetCertificateAuthorityCertificateRequest, callback?: (err: AWSError, data: ACMPCA.Types.GetCertificateAuthorityCertificateResponse) => void): Request<ACMPCA.Types.GetCertificateAuthorityCertificateResponse, AWSError>;
  /**
   * Retrieves the certificate and certificate chain for your private certificate authority (CA) or one that has been shared with you. Both the certificate and the chain are base64 PEM-encoded. The chain does not include the CA certificate. Each certificate in the chain signs the one before it. 
   */
  getCertificateAuthorityCertificate(callback?: (err: AWSError, data: ACMPCA.Types.GetCertificateAuthorityCertificateResponse) => void): Request<ACMPCA.Types.GetCertificateAuthorityCertificateResponse, AWSError>;
  /**
   * Retrieves the certificate signing request (CSR) for your private certificate authority (CA). The CSR is created when you call the CreateCertificateAuthority action. Sign the CSR with your ACM Private CA-hosted or on-premises root or subordinate CA. Then import the signed certificate back into ACM Private CA by calling the ImportCertificateAuthorityCertificate action. The CSR is returned as a base64 PEM-encoded string. 
   */
  getCertificateAuthorityCsr(params: ACMPCA.Types.GetCertificateAuthorityCsrRequest, callback?: (err: AWSError, data: ACMPCA.Types.GetCertificateAuthorityCsrResponse) => void): Request<ACMPCA.Types.GetCertificateAuthorityCsrResponse, AWSError>;
  /**
   * Retrieves the certificate signing request (CSR) for your private certificate authority (CA). The CSR is created when you call the CreateCertificateAuthority action. Sign the CSR with your ACM Private CA-hosted or on-premises root or subordinate CA. Then import the signed certificate back into ACM Private CA by calling the ImportCertificateAuthorityCertificate action. The CSR is returned as a base64 PEM-encoded string. 
   */
  getCertificateAuthorityCsr(callback?: (err: AWSError, data: ACMPCA.Types.GetCertificateAuthorityCsrResponse) => void): Request<ACMPCA.Types.GetCertificateAuthorityCsrResponse, AWSError>;
  /**
   * Retrieves the resource-based policy attached to a private CA. If either the private CA resource or the policy cannot be found, this action returns a ResourceNotFoundException.  The policy can be attached or updated with PutPolicy and removed with DeletePolicy.  About Policies    A policy grants access on a private CA to an AWS customer account, to AWS Organizations, or to an AWS Organizations unit. Policies are under the control of a CA administrator. For more information, see Using a Resource Based Policy with ACM Private CA.   A policy permits a user of AWS Certificate Manager (ACM) to issue ACM certificates signed by a CA in another account.   For ACM to manage automatic renewal of these certificates, the ACM user must configure a Service Linked Role (SLR). The SLR allows the ACM service to assume the identity of the user, subject to confirmation against the ACM Private CA policy. For more information, see Using a Service Linked Role with ACM.   Updates made in AWS Resource Manager (RAM) are reflected in policies. For more information, see Attach a Policy for Cross-Account Access.  
   */
  getPolicy(params: ACMPCA.Types.GetPolicyRequest, callback?: (err: AWSError, data: ACMPCA.Types.GetPolicyResponse) => void): Request<ACMPCA.Types.GetPolicyResponse, AWSError>;
  /**
   * Retrieves the resource-based policy attached to a private CA. If either the private CA resource or the policy cannot be found, this action returns a ResourceNotFoundException.  The policy can be attached or updated with PutPolicy and removed with DeletePolicy.  About Policies    A policy grants access on a private CA to an AWS customer account, to AWS Organizations, or to an AWS Organizations unit. Policies are under the control of a CA administrator. For more information, see Using a Resource Based Policy with ACM Private CA.   A policy permits a user of AWS Certificate Manager (ACM) to issue ACM certificates signed by a CA in another account.   For ACM to manage automatic renewal of these certificates, the ACM user must configure a Service Linked Role (SLR). The SLR allows the ACM service to assume the identity of the user, subject to confirmation against the ACM Private CA policy. For more information, see Using a Service Linked Role with ACM.   Updates made in AWS Resource Manager (RAM) are reflected in policies. For more information, see Attach a Policy for Cross-Account Access.  
   */
  getPolicy(callback?: (err: AWSError, data: ACMPCA.Types.GetPolicyResponse) => void): Request<ACMPCA.Types.GetPolicyResponse, AWSError>;
  /**
   * Imports a signed private CA certificate into ACM Private CA. This action is used when you are using a chain of trust whose root is located outside ACM Private CA. Before you can call this action, the following preparations must in place:   In ACM Private CA, call the CreateCertificateAuthority action to create the private CA that you plan to back with the imported certificate.   Call the GetCertificateAuthorityCsr action to generate a certificate signing request (CSR).   Sign the CSR using a root or intermediate CA hosted by either an on-premises PKI hierarchy or by a commercial CA.   Create a certificate chain and copy the signed certificate and the certificate chain to your working directory.   ACM Private CA supports three scenarios for installing a CA certificate:   Installing a certificate for a root CA hosted by ACM Private CA.   Installing a subordinate CA certificate whose parent authority is hosted by ACM Private CA.   Installing a subordinate CA certificate whose parent authority is externally hosted.   The following additional requirements apply when you import a CA certificate.   Only a self-signed certificate can be imported as a root CA.   A self-signed certificate cannot be imported as a subordinate CA.   Your certificate chain must not include the private CA certificate that you are importing.   Your root CA must be the last certificate in your chain. The subordinate certificate, if any, that your root CA signed must be next to last. The subordinate certificate signed by the preceding subordinate CA must come next, and so on until your chain is built.    The chain must be PEM-encoded.   The maximum allowed size of a certificate is 32 KB.   The maximum allowed size of a certificate chain is 2 MB.    Enforcement of Critical Constraints  ACM Private CA allows the following extensions to be marked critical in the imported CA certificate or chain.   Basic constraints (must be marked critical)   Subject alternative names   Key usage   Extended key usage   Authority key identifier   Subject key identifier   Issuer alternative name   Subject directory attributes   Subject information access   Certificate policies   Policy mappings   Inhibit anyPolicy   ACM Private CA rejects the following extensions when they are marked critical in an imported CA certificate or chain.   Name constraints   Policy constraints   CRL distribution points   Authority information access   Freshest CRL   Any other extension  
   */
  importCertificateAuthorityCertificate(params: ACMPCA.Types.ImportCertificateAuthorityCertificateRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Imports a signed private CA certificate into ACM Private CA. This action is used when you are using a chain of trust whose root is located outside ACM Private CA. Before you can call this action, the following preparations must in place:   In ACM Private CA, call the CreateCertificateAuthority action to create the private CA that you plan to back with the imported certificate.   Call the GetCertificateAuthorityCsr action to generate a certificate signing request (CSR).   Sign the CSR using a root or intermediate CA hosted by either an on-premises PKI hierarchy or by a commercial CA.   Create a certificate chain and copy the signed certificate and the certificate chain to your working directory.   ACM Private CA supports three scenarios for installing a CA certificate:   Installing a certificate for a root CA hosted by ACM Private CA.   Installing a subordinate CA certificate whose parent authority is hosted by ACM Private CA.   Installing a subordinate CA certificate whose parent authority is externally hosted.   The following additional requirements apply when you import a CA certificate.   Only a self-signed certificate can be imported as a root CA.   A self-signed certificate cannot be imported as a subordinate CA.   Your certificate chain must not include the private CA certificate that you are importing.   Your root CA must be the last certificate in your chain. The subordinate certificate, if any, that your root CA signed must be next to last. The subordinate certificate signed by the preceding subordinate CA must come next, and so on until your chain is built.    The chain must be PEM-encoded.   The maximum allowed size of a certificate is 32 KB.   The maximum allowed size of a certificate chain is 2 MB.    Enforcement of Critical Constraints  ACM Private CA allows the following extensions to be marked critical in the imported CA certificate or chain.   Basic constraints (must be marked critical)   Subject alternative names   Key usage   Extended key usage   Authority key identifier   Subject key identifier   Issuer alternative name   Subject directory attributes   Subject information access   Certificate policies   Policy mappings   Inhibit anyPolicy   ACM Private CA rejects the following extensions when they are marked critical in an imported CA certificate or chain.   Name constraints   Policy constraints   CRL distribution points   Authority information access   Freshest CRL   Any other extension  
   */
  importCertificateAuthorityCertificate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Uses your private certificate authority (CA), or one that has been shared with you, to issue a client certificate. This action returns the Amazon Resource Name (ARN) of the certificate. You can retrieve the certificate by calling the GetCertificate action and specifying the ARN.   You cannot use the ACM ListCertificateAuthorities action to retrieve the ARNs of the certificates that you issue by using ACM Private CA. 
   */
  issueCertificate(params: ACMPCA.Types.IssueCertificateRequest, callback?: (err: AWSError, data: ACMPCA.Types.IssueCertificateResponse) => void): Request<ACMPCA.Types.IssueCertificateResponse, AWSError>;
  /**
   * Uses your private certificate authority (CA), or one that has been shared with you, to issue a client certificate. This action returns the Amazon Resource Name (ARN) of the certificate. You can retrieve the certificate by calling the GetCertificate action and specifying the ARN.   You cannot use the ACM ListCertificateAuthorities action to retrieve the ARNs of the certificates that you issue by using ACM Private CA. 
   */
  issueCertificate(callback?: (err: AWSError, data: ACMPCA.Types.IssueCertificateResponse) => void): Request<ACMPCA.Types.IssueCertificateResponse, AWSError>;
  /**
   * Lists the private certificate authorities that you created by using the CreateCertificateAuthority action.
   */
  listCertificateAuthorities(params: ACMPCA.Types.ListCertificateAuthoritiesRequest, callback?: (err: AWSError, data: ACMPCA.Types.ListCertificateAuthoritiesResponse) => void): Request<ACMPCA.Types.ListCertificateAuthoritiesResponse, AWSError>;
  /**
   * Lists the private certificate authorities that you created by using the CreateCertificateAuthority action.
   */
  listCertificateAuthorities(callback?: (err: AWSError, data: ACMPCA.Types.ListCertificateAuthoritiesResponse) => void): Request<ACMPCA.Types.ListCertificateAuthoritiesResponse, AWSError>;
  /**
   * List all permissions on a private CA, if any, granted to the AWS Certificate Manager (ACM) service principal (acm.amazonaws.com).  These permissions allow ACM to issue and renew ACM certificates that reside in the same AWS account as the CA.  Permissions can be granted with the CreatePermission action and revoked with the DeletePermission action.  About Permissions    If the private CA and the certificates it issues reside in the same account, you can use CreatePermission to grant permissions for ACM to carry out automatic certificate renewals.   For automatic certificate renewal to succeed, the ACM service principal needs permissions to create, retrieve, and list certificates.   If the private CA and the ACM certificates reside in different accounts, then permissions cannot be used to enable automatic renewals. Instead, the ACM certificate owner must set up a resource-based policy to enable cross-account issuance and renewals. For more information, see Using a Resource Based Policy with ACM Private CA.  
   */
  listPermissions(params: ACMPCA.Types.ListPermissionsRequest, callback?: (err: AWSError, data: ACMPCA.Types.ListPermissionsResponse) => void): Request<ACMPCA.Types.ListPermissionsResponse, AWSError>;
  /**
   * List all permissions on a private CA, if any, granted to the AWS Certificate Manager (ACM) service principal (acm.amazonaws.com).  These permissions allow ACM to issue and renew ACM certificates that reside in the same AWS account as the CA.  Permissions can be granted with the CreatePermission action and revoked with the DeletePermission action.  About Permissions    If the private CA and the certificates it issues reside in the same account, you can use CreatePermission to grant permissions for ACM to carry out automatic certificate renewals.   For automatic certificate renewal to succeed, the ACM service principal needs permissions to create, retrieve, and list certificates.   If the private CA and the ACM certificates reside in different accounts, then permissions cannot be used to enable automatic renewals. Instead, the ACM certificate owner must set up a resource-based policy to enable cross-account issuance and renewals. For more information, see Using a Resource Based Policy with ACM Private CA.  
   */
  listPermissions(callback?: (err: AWSError, data: ACMPCA.Types.ListPermissionsResponse) => void): Request<ACMPCA.Types.ListPermissionsResponse, AWSError>;
  /**
   * Lists the tags, if any, that are associated with your private CA or one that has been shared with you. Tags are labels that you can use to identify and organize your CAs. Each tag consists of a key and an optional value. Call the TagCertificateAuthority action to add one or more tags to your CA. Call the UntagCertificateAuthority action to remove tags. 
   */
  listTags(params: ACMPCA.Types.ListTagsRequest, callback?: (err: AWSError, data: ACMPCA.Types.ListTagsResponse) => void): Request<ACMPCA.Types.ListTagsResponse, AWSError>;
  /**
   * Lists the tags, if any, that are associated with your private CA or one that has been shared with you. Tags are labels that you can use to identify and organize your CAs. Each tag consists of a key and an optional value. Call the TagCertificateAuthority action to add one or more tags to your CA. Call the UntagCertificateAuthority action to remove tags. 
   */
  listTags(callback?: (err: AWSError, data: ACMPCA.Types.ListTagsResponse) => void): Request<ACMPCA.Types.ListTagsResponse, AWSError>;
  /**
   * Attaches a resource-based policy to a private CA.  A policy can also be applied by sharing a private CA through AWS Resource Access Manager (RAM). For more information, see Attach a Policy for Cross-Account Access. The policy can be displayed with GetPolicy and removed with DeletePolicy.  About Policies    A policy grants access on a private CA to an AWS customer account, to AWS Organizations, or to an AWS Organizations unit. Policies are under the control of a CA administrator. For more information, see Using a Resource Based Policy with ACM Private CA.   A policy permits a user of AWS Certificate Manager (ACM) to issue ACM certificates signed by a CA in another account.   For ACM to manage automatic renewal of these certificates, the ACM user must configure a Service Linked Role (SLR). The SLR allows the ACM service to assume the identity of the user, subject to confirmation against the ACM Private CA policy. For more information, see Using a Service Linked Role with ACM.   Updates made in AWS Resource Manager (RAM) are reflected in policies. For more information, see Attach a Policy for Cross-Account Access.  
   */
  putPolicy(params: ACMPCA.Types.PutPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches a resource-based policy to a private CA.  A policy can also be applied by sharing a private CA through AWS Resource Access Manager (RAM). For more information, see Attach a Policy for Cross-Account Access. The policy can be displayed with GetPolicy and removed with DeletePolicy.  About Policies    A policy grants access on a private CA to an AWS customer account, to AWS Organizations, or to an AWS Organizations unit. Policies are under the control of a CA administrator. For more information, see Using a Resource Based Policy with ACM Private CA.   A policy permits a user of AWS Certificate Manager (ACM) to issue ACM certificates signed by a CA in another account.   For ACM to manage automatic renewal of these certificates, the ACM user must configure a Service Linked Role (SLR). The SLR allows the ACM service to assume the identity of the user, subject to confirmation against the ACM Private CA policy. For more information, see Using a Service Linked Role with ACM.   Updates made in AWS Resource Manager (RAM) are reflected in policies. For more information, see Attach a Policy for Cross-Account Access.  
   */
  putPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Restores a certificate authority (CA) that is in the DELETED state. You can restore a CA during the period that you defined in the PermanentDeletionTimeInDays parameter of the DeleteCertificateAuthority action. Currently, you can specify 7 to 30 days. If you did not specify a PermanentDeletionTimeInDays value, by default you can restore the CA at any time in a 30 day period. You can check the time remaining in the restoration period of a private CA in the DELETED state by calling the DescribeCertificateAuthority or ListCertificateAuthorities actions. The status of a restored CA is set to its pre-deletion status when the RestoreCertificateAuthority action returns. To change its status to ACTIVE, call the UpdateCertificateAuthority action. If the private CA was in the PENDING_CERTIFICATE state at deletion, you must use the ImportCertificateAuthorityCertificate action to import a certificate authority into the private CA before it can be activated. You cannot restore a CA after the restoration period has ended.
   */
  restoreCertificateAuthority(params: ACMPCA.Types.RestoreCertificateAuthorityRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Restores a certificate authority (CA) that is in the DELETED state. You can restore a CA during the period that you defined in the PermanentDeletionTimeInDays parameter of the DeleteCertificateAuthority action. Currently, you can specify 7 to 30 days. If you did not specify a PermanentDeletionTimeInDays value, by default you can restore the CA at any time in a 30 day period. You can check the time remaining in the restoration period of a private CA in the DELETED state by calling the DescribeCertificateAuthority or ListCertificateAuthorities actions. The status of a restored CA is set to its pre-deletion status when the RestoreCertificateAuthority action returns. To change its status to ACTIVE, call the UpdateCertificateAuthority action. If the private CA was in the PENDING_CERTIFICATE state at deletion, you must use the ImportCertificateAuthorityCertificate action to import a certificate authority into the private CA before it can be activated. You cannot restore a CA after the restoration period has ended.
   */
  restoreCertificateAuthority(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Revokes a certificate that was issued inside ACM Private CA. If you enable a certificate revocation list (CRL) when you create or update your private CA, information about the revoked certificates will be included in the CRL. ACM Private CA writes the CRL to an S3 bucket that you specify. A CRL is typically updated approximately 30 minutes after a certificate is revoked. If for any reason the CRL update fails, ACM Private CA attempts makes further attempts every 15 minutes. With Amazon CloudWatch, you can create alarms for the metrics CRLGenerated and MisconfiguredCRLBucket. For more information, see Supported CloudWatch Metrics.  Both PCA and the IAM principal must have permission to write to the S3 bucket that you specify. If the IAM principal making the call does not have permission to write to the bucket, then an exception is thrown. For more information, see Configure Access to ACM Private CA.  ACM Private CA also writes revocation information to the audit report. For more information, see CreateCertificateAuthorityAuditReport.  You cannot revoke a root CA self-signed certificate. 
   */
  revokeCertificate(params: ACMPCA.Types.RevokeCertificateRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Revokes a certificate that was issued inside ACM Private CA. If you enable a certificate revocation list (CRL) when you create or update your private CA, information about the revoked certificates will be included in the CRL. ACM Private CA writes the CRL to an S3 bucket that you specify. A CRL is typically updated approximately 30 minutes after a certificate is revoked. If for any reason the CRL update fails, ACM Private CA attempts makes further attempts every 15 minutes. With Amazon CloudWatch, you can create alarms for the metrics CRLGenerated and MisconfiguredCRLBucket. For more information, see Supported CloudWatch Metrics.  Both PCA and the IAM principal must have permission to write to the S3 bucket that you specify. If the IAM principal making the call does not have permission to write to the bucket, then an exception is thrown. For more information, see Configure Access to ACM Private CA.  ACM Private CA also writes revocation information to the audit report. For more information, see CreateCertificateAuthorityAuditReport.  You cannot revoke a root CA self-signed certificate. 
   */
  revokeCertificate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to your private CA. Tags are labels that you can use to identify and organize your AWS resources. Each tag consists of a key and an optional value. You specify the private CA on input by its Amazon Resource Name (ARN). You specify the tag by using a key-value pair. You can apply a tag to just one private CA if you want to identify a specific characteristic of that CA, or you can apply the same tag to multiple private CAs if you want to filter for a common relationship among those CAs. To remove one or more tags, use the UntagCertificateAuthority action. Call the ListTags action to see what tags are associated with your CA. 
   */
  tagCertificateAuthority(params: ACMPCA.Types.TagCertificateAuthorityRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to your private CA. Tags are labels that you can use to identify and organize your AWS resources. Each tag consists of a key and an optional value. You specify the private CA on input by its Amazon Resource Name (ARN). You specify the tag by using a key-value pair. You can apply a tag to just one private CA if you want to identify a specific characteristic of that CA, or you can apply the same tag to multiple private CAs if you want to filter for a common relationship among those CAs. To remove one or more tags, use the UntagCertificateAuthority action. Call the ListTags action to see what tags are associated with your CA. 
   */
  tagCertificateAuthority(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove one or more tags from your private CA. A tag consists of a key-value pair. If you do not specify the value portion of the tag when calling this action, the tag will be removed regardless of value. If you specify a value, the tag is removed only if it is associated with the specified value. To add tags to a private CA, use the TagCertificateAuthority. Call the ListTags action to see what tags are associated with your CA. 
   */
  untagCertificateAuthority(params: ACMPCA.Types.UntagCertificateAuthorityRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove one or more tags from your private CA. A tag consists of a key-value pair. If you do not specify the value portion of the tag when calling this action, the tag will be removed regardless of value. If you specify a value, the tag is removed only if it is associated with the specified value. To add tags to a private CA, use the TagCertificateAuthority. Call the ListTags action to see what tags are associated with your CA. 
   */
  untagCertificateAuthority(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the status or configuration of a private certificate authority (CA). Your private CA must be in the ACTIVE or DISABLED state before you can update it. You can disable a private CA that is in the ACTIVE state or make a CA that is in the DISABLED state active again.  Both PCA and the IAM principal must have permission to write to the S3 bucket that you specify. If the IAM principal making the call does not have permission to write to the bucket, then an exception is thrown. For more information, see Configure Access to ACM Private CA. 
   */
  updateCertificateAuthority(params: ACMPCA.Types.UpdateCertificateAuthorityRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the status or configuration of a private certificate authority (CA). Your private CA must be in the ACTIVE or DISABLED state before you can update it. You can disable a private CA that is in the ACTIVE state or make a CA that is in the DISABLED state active again.  Both PCA and the IAM principal must have permission to write to the S3 bucket that you specify. If the IAM principal making the call does not have permission to write to the bucket, then an exception is thrown. For more information, see Configure Access to ACM Private CA. 
   */
  updateCertificateAuthority(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Waits for the certificateAuthorityCSRCreated state by periodically calling the underlying ACMPCA.getCertificateAuthorityCsroperation every 3 seconds (at most 60 times). Wait until a Certificate Authority CSR is created
   */
  waitFor(state: "certificateAuthorityCSRCreated", params: ACMPCA.Types.GetCertificateAuthorityCsrRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: ACMPCA.Types.GetCertificateAuthorityCsrResponse) => void): Request<ACMPCA.Types.GetCertificateAuthorityCsrResponse, AWSError>;
  /**
   * Waits for the certificateAuthorityCSRCreated state by periodically calling the underlying ACMPCA.getCertificateAuthorityCsroperation every 3 seconds (at most 60 times). Wait until a Certificate Authority CSR is created
   */
  waitFor(state: "certificateAuthorityCSRCreated", callback?: (err: AWSError, data: ACMPCA.Types.GetCertificateAuthorityCsrResponse) => void): Request<ACMPCA.Types.GetCertificateAuthorityCsrResponse, AWSError>;
  /**
   * Waits for the certificateIssued state by periodically calling the underlying ACMPCA.getCertificateoperation every 3 seconds (at most 60 times). Wait until a certificate is issued
   */
  waitFor(state: "certificateIssued", params: ACMPCA.Types.GetCertificateRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: ACMPCA.Types.GetCertificateResponse) => void): Request<ACMPCA.Types.GetCertificateResponse, AWSError>;
  /**
   * Waits for the certificateIssued state by periodically calling the underlying ACMPCA.getCertificateoperation every 3 seconds (at most 60 times). Wait until a certificate is issued
   */
  waitFor(state: "certificateIssued", callback?: (err: AWSError, data: ACMPCA.Types.GetCertificateResponse) => void): Request<ACMPCA.Types.GetCertificateResponse, AWSError>;
  /**
   * Waits for the auditReportCreated state by periodically calling the underlying ACMPCA.describeCertificateAuthorityAuditReportoperation every 3 seconds (at most 60 times). Wait until a Audit Report is created
   */
  waitFor(state: "auditReportCreated", params: ACMPCA.Types.DescribeCertificateAuthorityAuditReportRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: ACMPCA.Types.DescribeCertificateAuthorityAuditReportResponse) => void): Request<ACMPCA.Types.DescribeCertificateAuthorityAuditReportResponse, AWSError>;
  /**
   * Waits for the auditReportCreated state by periodically calling the underlying ACMPCA.describeCertificateAuthorityAuditReportoperation every 3 seconds (at most 60 times). Wait until a Audit Report is created
   */
  waitFor(state: "auditReportCreated", callback?: (err: AWSError, data: ACMPCA.Types.DescribeCertificateAuthorityAuditReportResponse) => void): Request<ACMPCA.Types.DescribeCertificateAuthorityAuditReportResponse, AWSError>;
}
declare namespace ACMPCA {
  export type ASN1PrintableString64 = string;
  export interface ASN1Subject {
    /**
     * Two-digit code that specifies the country in which the certificate subject located.
     */
    Country?: CountryCodeString;
    /**
     * Legal name of the organization with which the certificate subject is affiliated. 
     */
    Organization?: String64;
    /**
     * A subdivision or unit of the organization (such as sales or finance) with which the certificate subject is affiliated.
     */
    OrganizationalUnit?: String64;
    /**
     * Disambiguating information for the certificate subject.
     */
    DistinguishedNameQualifier?: ASN1PrintableString64;
    /**
     * State in which the subject of the certificate is located.
     */
    State?: String128;
    /**
     * For CA and end-entity certificates in a private PKI, the common name (CN) can be any string within the length limit.  Note: In publicly trusted certificates, the common name must be a fully qualified domain name (FQDN) associated with the certificate subject.
     */
    CommonName?: String64;
    /**
     * The certificate serial number.
     */
    SerialNumber?: ASN1PrintableString64;
    /**
     * The locality (such as a city or town) in which the certificate subject is located.
     */
    Locality?: String128;
    /**
     * A title such as Mr. or Ms., which is pre-pended to the name to refer formally to the certificate subject.
     */
    Title?: String64;
    /**
     * Family name. In the US and the UK, for example, the surname of an individual is ordered last. In Asian cultures the surname is typically ordered first.
     */
    Surname?: String40;
    /**
     * First name.
     */
    GivenName?: String16;
    /**
     * Concatenation that typically contains the first letter of the GivenName, the first letter of the middle name if one exists, and the first letter of the Surname.
     */
    Initials?: String5;
    /**
     * Typically a shortened version of a longer GivenName. For example, Jonathan is often shortened to John. Elizabeth is often shortened to Beth, Liz, or Eliza.
     */
    Pseudonym?: String128;
    /**
     * Typically a qualifier appended to the name of an individual. Examples include Jr. for junior, Sr. for senior, and III for third.
     */
    GenerationQualifier?: String3;
  }
  export type AWSPolicy = string;
  export interface AccessDescription {
    /**
     * The type and format of AccessDescription information.
     */
    AccessMethod: AccessMethod;
    /**
     * The location of AccessDescription information.
     */
    AccessLocation: GeneralName;
  }
  export type AccessDescriptionList = AccessDescription[];
  export interface AccessMethod {
    /**
     * An object identifier (OID) specifying the AccessMethod. The OID must satisfy the regular expression shown below. For more information, see NIST's definition of Object Identifier (OID).
     */
    CustomObjectIdentifier?: CustomObjectIdentifier;
    /**
     * Specifies the AccessMethod.
     */
    AccessMethodType?: AccessMethodType;
  }
  export type AccessMethodType = "CA_REPOSITORY"|"RESOURCE_PKI_MANIFEST"|"RESOURCE_PKI_NOTIFY"|string;
  export type AccountId = string;
  export type ActionList = ActionType[];
  export type ActionType = "IssueCertificate"|"GetCertificate"|"ListPermissions"|string;
  export interface ApiPassthrough {
    /**
     * Specifies X.509 extension information for a certificate.
     */
    Extensions?: Extensions;
    Subject?: ASN1Subject;
  }
  export type Arn = string;
  export type AuditReportId = string;
  export type AuditReportResponseFormat = "JSON"|"CSV"|string;
  export type AuditReportStatus = "CREATING"|"SUCCESS"|"FAILED"|string;
  export type Boolean = boolean;
  export type CertificateAuthorities = CertificateAuthority[];
  export interface CertificateAuthority {
    /**
     * Amazon Resource Name (ARN) for your private certificate authority (CA). The format is  12345678-1234-1234-1234-123456789012 .
     */
    Arn?: Arn;
    /**
     * The AWS account ID that owns the certificate authority.
     */
    OwnerAccount?: AccountId;
    /**
     * Date and time at which your private CA was created.
     */
    CreatedAt?: TStamp;
    /**
     * Date and time at which your private CA was last updated.
     */
    LastStateChangeAt?: TStamp;
    /**
     * Type of your private CA.
     */
    Type?: CertificateAuthorityType;
    /**
     * Serial number of your private CA.
     */
    Serial?: String;
    /**
     * Status of your private CA.
     */
    Status?: CertificateAuthorityStatus;
    /**
     * Date and time before which your private CA certificate is not valid.
     */
    NotBefore?: TStamp;
    /**
     * Date and time after which your private CA certificate is not valid.
     */
    NotAfter?: TStamp;
    /**
     * Reason the request to create your private CA failed.
     */
    FailureReason?: FailureReason;
    /**
     * Your private CA configuration.
     */
    CertificateAuthorityConfiguration?: CertificateAuthorityConfiguration;
    /**
     * Information about the Online Certificate Status Protocol (OCSP) configuration or certificate revocation list (CRL) created and maintained by your private CA. 
     */
    RevocationConfiguration?: RevocationConfiguration;
    /**
     * The period during which a deleted CA can be restored. For more information, see the PermanentDeletionTimeInDays parameter of the DeleteCertificateAuthorityRequest action. 
     */
    RestorableUntil?: TStamp;
    /**
     * Defines a cryptographic key management compliance standard used for handling CA keys.  Default: FIPS_140_2_LEVEL_3_OR_HIGHER Note: AWS Region ap-northeast-3 supports only FIPS_140_2_LEVEL_2_OR_HIGHER. You must explicitly specify this parameter and value when creating a CA in that Region. Specifying a different value (or no value) results in an InvalidArgsException with the message "A certificate authority cannot be created in this region with the specified security standard."
     */
    KeyStorageSecurityStandard?: KeyStorageSecurityStandard;
  }
  export interface CertificateAuthorityConfiguration {
    /**
     * Type of the public key algorithm and size, in bits, of the key pair that your CA creates when it issues a certificate. When you create a subordinate CA, you must use a key algorithm supported by the parent CA.
     */
    KeyAlgorithm: KeyAlgorithm;
    /**
     * Name of the algorithm your private CA uses to sign certificate requests. This parameter should not be confused with the SigningAlgorithm parameter used to sign certificates when they are issued.
     */
    SigningAlgorithm: SigningAlgorithm;
    /**
     * Structure that contains X.500 distinguished name information for your private CA.
     */
    Subject: ASN1Subject;
    /**
     * Specifies information to be added to the extension section of the certificate signing request (CSR).
     */
    CsrExtensions?: CsrExtensions;
  }
  export type CertificateAuthorityStatus = "CREATING"|"PENDING_CERTIFICATE"|"ACTIVE"|"DELETED"|"DISABLED"|"EXPIRED"|"FAILED"|string;
  export type CertificateAuthorityType = "ROOT"|"SUBORDINATE"|string;
  export type CertificateBody = string;
  export type CertificateBodyBlob = Buffer|Uint8Array|Blob|string;
  export type CertificateChain = string;
  export type CertificateChainBlob = Buffer|Uint8Array|Blob|string;
  export type CertificatePolicyList = PolicyInformation[];
  export type CountryCodeString = string;
  export interface CreateCertificateAuthorityAuditReportRequest {
    /**
     * The Amazon Resource Name (ARN) of the CA to be audited. This is of the form:  arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012 .
     */
    CertificateAuthorityArn: Arn;
    /**
     * The name of the S3 bucket that will contain the audit report.
     */
    S3BucketName: S3BucketName;
    /**
     * The format in which to create the report. This can be either JSON or CSV.
     */
    AuditReportResponseFormat: AuditReportResponseFormat;
  }
  export interface CreateCertificateAuthorityAuditReportResponse {
    /**
     * An alphanumeric string that contains a report identifier.
     */
    AuditReportId?: AuditReportId;
    /**
     * The key that uniquely identifies the report file in your S3 bucket.
     */
    S3Key?: S3Key;
  }
  export interface CreateCertificateAuthorityRequest {
    /**
     * Name and bit size of the private key algorithm, the name of the signing algorithm, and X.500 certificate subject information.
     */
    CertificateAuthorityConfiguration: CertificateAuthorityConfiguration;
    /**
     * Contains information to enable Online Certificate Status Protocol (OCSP) support, to enable a certificate revocation list (CRL), to enable both, or to enable neither. The default is for both certificate validation mechanisms to be disabled. For more information, see the OcspConfiguration and CrlConfiguration types.
     */
    RevocationConfiguration?: RevocationConfiguration;
    /**
     * The type of the certificate authority.
     */
    CertificateAuthorityType: CertificateAuthorityType;
    /**
     * Custom string that can be used to distinguish between calls to the CreateCertificateAuthority action. Idempotency tokens for CreateCertificateAuthority time out after five minutes. Therefore, if you call CreateCertificateAuthority multiple times with the same idempotency token within five minutes, ACM Private CA recognizes that you are requesting only certificate authority and will issue only one. If you change the idempotency token for each call, PCA recognizes that you are requesting multiple certificate authorities.
     */
    IdempotencyToken?: IdempotencyToken;
    /**
     * Specifies a cryptographic key management compliance standard used for handling CA keys. Default: FIPS_140_2_LEVEL_3_OR_HIGHER Note: FIPS_140_2_LEVEL_3_OR_HIGHER is not supported in Region ap-northeast-3. When creating a CA in the ap-northeast-3, you must provide FIPS_140_2_LEVEL_2_OR_HIGHER as the argument for KeyStorageSecurityStandard. Failure to do this results in an InvalidArgsException with the message, "A certificate authority cannot be created in this region with the specified security standard."
     */
    KeyStorageSecurityStandard?: KeyStorageSecurityStandard;
    /**
     * Key-value pairs that will be attached to the new private CA. You can associate up to 50 tags with a private CA. For information using tags with IAM to manage permissions, see Controlling Access Using IAM Tags.
     */
    Tags?: TagList;
  }
  export interface CreateCertificateAuthorityResponse {
    /**
     * If successful, the Amazon Resource Name (ARN) of the certificate authority (CA). This is of the form:   arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012 . 
     */
    CertificateAuthorityArn?: Arn;
  }
  export interface CreatePermissionRequest {
    /**
     * The Amazon Resource Name (ARN) of the CA that grants the permissions. You can find the ARN by calling the ListCertificateAuthorities action. This must have the following form:   arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012 . 
     */
    CertificateAuthorityArn: Arn;
    /**
     * The AWS service or identity that receives the permission. At this time, the only valid principal is acm.amazonaws.com.
     */
    Principal: Principal;
    /**
     * The ID of the calling account.
     */
    SourceAccount?: AccountId;
    /**
     * The actions that the specified AWS service principal can use. These include IssueCertificate, GetCertificate, and ListPermissions.
     */
    Actions: ActionList;
  }
  export interface CrlConfiguration {
    /**
     * Boolean value that specifies whether certificate revocation lists (CRLs) are enabled. You can use this value to enable certificate revocation for a new CA when you call the CreateCertificateAuthority action or for an existing CA when you call the UpdateCertificateAuthority action. 
     */
    Enabled: Boolean;
    /**
     * Validity period of the CRL in days.
     */
    ExpirationInDays?: Integer1To5000;
    /**
     * Name inserted into the certificate CRL Distribution Points extension that enables the use of an alias for the CRL distribution point. Use this value if you don't want the name of your S3 bucket to be public.
     */
    CustomCname?: String253;
    /**
     * Name of the S3 bucket that contains the CRL. If you do not provide a value for the CustomCname argument, the name of your S3 bucket is placed into the CRL Distribution Points extension of the issued certificate. You can change the name of your bucket by calling the UpdateCertificateAuthority operation. You must specify a bucket policy that allows ACM Private CA to write the CRL to your bucket.
     */
    S3BucketName?: String3To255;
    /**
     * Determines whether the CRL will be publicly readable or privately held in the CRL Amazon S3 bucket. If you choose PUBLIC_READ, the CRL will be accessible over the public internet. If you choose BUCKET_OWNER_FULL_CONTROL, only the owner of the CRL S3 bucket can access the CRL, and your PKI clients may need an alternative method of access.  If no value is specified, the default is PUBLIC_READ.  Note: This default can cause CA creation to fail in some circumstances. If you have have enabled the Block Public Access (BPA) feature in your S3 account, then you must specify the value of this parameter as BUCKET_OWNER_FULL_CONTROL, and not doing so results in an error. If you have disabled BPA in S3, then you can specify either BUCKET_OWNER_FULL_CONTROL or PUBLIC_READ as the value. For more information, see Blocking public access to the S3 bucket.
     */
    S3ObjectAcl?: S3ObjectAcl;
  }
  export type CsrBlob = Buffer|Uint8Array|Blob|string;
  export type CsrBody = string;
  export interface CsrExtensions {
    /**
     * Indicates the purpose of the certificate and of the key contained in the certificate.
     */
    KeyUsage?: KeyUsage;
    /**
     * For CA certificates, provides a path to additional information pertaining to the CA, such as revocation and policy. For more information, see Subject Information Access in RFC 5280.
     */
    SubjectInformationAccess?: AccessDescriptionList;
  }
  export type CustomObjectIdentifier = string;
  export interface DeleteCertificateAuthorityRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateCertificateAuthority. This must have the following form:   arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012 . 
     */
    CertificateAuthorityArn: Arn;
    /**
     * The number of days to make a CA restorable after it has been deleted. This can be anywhere from 7 to 30 days, with 30 being the default.
     */
    PermanentDeletionTimeInDays?: PermanentDeletionTimeInDays;
  }
  export interface DeletePermissionRequest {
    /**
     * The Amazon Resource Number (ARN) of the private CA that issued the permissions. You can find the CA's ARN by calling the ListCertificateAuthorities action. This must have the following form:   arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012 . 
     */
    CertificateAuthorityArn: Arn;
    /**
     * The AWS service or identity that will have its CA permissions revoked. At this time, the only valid service principal is acm.amazonaws.com 
     */
    Principal: Principal;
    /**
     * The AWS account that calls this action.
     */
    SourceAccount?: AccountId;
  }
  export interface DeletePolicyRequest {
    /**
     * The Amazon Resource Number (ARN) of the private CA that will have its policy deleted. You can find the CA's ARN by calling the ListCertificateAuthorities action. The ARN value must have the form arn:aws:acm-pca:region:account:certificate-authority/01234567-89ab-cdef-0123-0123456789ab. 
     */
    ResourceArn: Arn;
  }
  export interface DescribeCertificateAuthorityAuditReportRequest {
    /**
     * The Amazon Resource Name (ARN) of the private CA. This must be of the form:  arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012 . 
     */
    CertificateAuthorityArn: Arn;
    /**
     * The report ID returned by calling the CreateCertificateAuthorityAuditReport action.
     */
    AuditReportId: AuditReportId;
  }
  export interface DescribeCertificateAuthorityAuditReportResponse {
    /**
     * Specifies whether report creation is in progress, has succeeded, or has failed.
     */
    AuditReportStatus?: AuditReportStatus;
    /**
     * Name of the S3 bucket that contains the report.
     */
    S3BucketName?: S3BucketName;
    /**
     * S3 key that uniquely identifies the report file in your S3 bucket.
     */
    S3Key?: S3Key;
    /**
     * The date and time at which the report was created.
     */
    CreatedAt?: TStamp;
  }
  export interface DescribeCertificateAuthorityRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateCertificateAuthority. This must be of the form:   arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012 . 
     */
    CertificateAuthorityArn: Arn;
  }
  export interface DescribeCertificateAuthorityResponse {
    /**
     * A CertificateAuthority structure that contains information about your private CA.
     */
    CertificateAuthority?: CertificateAuthority;
  }
  export interface EdiPartyName {
    /**
     * Specifies the party name.
     */
    PartyName: String256;
    /**
     * Specifies the name assigner.
     */
    NameAssigner?: String256;
  }
  export interface ExtendedKeyUsage {
    /**
     * Specifies a standard ExtendedKeyUsage as defined as in RFC 5280.
     */
    ExtendedKeyUsageType?: ExtendedKeyUsageType;
    /**
     * Specifies a custom ExtendedKeyUsage with an object identifier (OID).
     */
    ExtendedKeyUsageObjectIdentifier?: CustomObjectIdentifier;
  }
  export type ExtendedKeyUsageList = ExtendedKeyUsage[];
  export type ExtendedKeyUsageType = "SERVER_AUTH"|"CLIENT_AUTH"|"CODE_SIGNING"|"EMAIL_PROTECTION"|"TIME_STAMPING"|"OCSP_SIGNING"|"SMART_CARD_LOGIN"|"DOCUMENT_SIGNING"|"CERTIFICATE_TRANSPARENCY"|string;
  export interface Extensions {
    /**
     * Contains a sequence of one or more policy information terms, each of which consists of an object identifier (OID) and optional qualifiers. For more information, see NIST's definition of Object Identifier (OID). In an end-entity certificate, these terms indicate the policy under which the certificate was issued and the purposes for which it may be used. In a CA certificate, these terms limit the set of policies for certification paths that include this certificate.
     */
    CertificatePolicies?: CertificatePolicyList;
    /**
     * Specifies additional purposes for which the certified public key may be used other than basic purposes indicated in the KeyUsage extension.
     */
    ExtendedKeyUsage?: ExtendedKeyUsageList;
    KeyUsage?: KeyUsage;
    /**
     * The subject alternative name extension allows identities to be bound to the subject of the certificate. These identities may be included in addition to or in place of the identity in the subject field of the certificate.
     */
    SubjectAlternativeNames?: GeneralNameList;
  }
  export type FailureReason = "REQUEST_TIMED_OUT"|"UNSUPPORTED_ALGORITHM"|"OTHER"|string;
  export interface GeneralName {
    /**
     * Represents GeneralName using an OtherName object.
     */
    OtherName?: OtherName;
    /**
     * Represents GeneralName as an RFC 822 email address.
     */
    Rfc822Name?: String256;
    /**
     * Represents GeneralName as a DNS name.
     */
    DnsName?: String253;
    DirectoryName?: ASN1Subject;
    /**
     * Represents GeneralName as an EdiPartyName object.
     */
    EdiPartyName?: EdiPartyName;
    /**
     * Represents GeneralName as a URI.
     */
    UniformResourceIdentifier?: String253;
    /**
     * Represents GeneralName as an IPv4 or IPv6 address.
     */
    IpAddress?: String39;
    /**
     *  Represents GeneralName as an object identifier (OID).
     */
    RegisteredId?: CustomObjectIdentifier;
  }
  export type GeneralNameList = GeneralName[];
  export interface GetCertificateAuthorityCertificateRequest {
    /**
     * The Amazon Resource Name (ARN) of your private CA. This is of the form:  arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012 . 
     */
    CertificateAuthorityArn: Arn;
  }
  export interface GetCertificateAuthorityCertificateResponse {
    /**
     * Base64-encoded certificate authority (CA) certificate.
     */
    Certificate?: CertificateBody;
    /**
     * Base64-encoded certificate chain that includes any intermediate certificates and chains up to root certificate that you used to sign your private CA certificate. The chain does not include your private CA certificate. If this is a root CA, the value will be null.
     */
    CertificateChain?: CertificateChain;
  }
  export interface GetCertificateAuthorityCsrRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called the CreateCertificateAuthority action. This must be of the form:   arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012  
     */
    CertificateAuthorityArn: Arn;
  }
  export interface GetCertificateAuthorityCsrResponse {
    /**
     * The base64 PEM-encoded certificate signing request (CSR) for your private CA certificate.
     */
    Csr?: CsrBody;
  }
  export interface GetCertificateRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateCertificateAuthority. This must be of the form:   arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012 . 
     */
    CertificateAuthorityArn: Arn;
    /**
     * The ARN of the issued certificate. The ARN contains the certificate serial number and must be in the following form:   arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012/certificate/286535153982981100925020015808220737245  
     */
    CertificateArn: Arn;
  }
  export interface GetCertificateResponse {
    /**
     * The base64 PEM-encoded certificate specified by the CertificateArn parameter.
     */
    Certificate?: CertificateBody;
    /**
     * The base64 PEM-encoded certificate chain that chains up to the root CA certificate that you used to sign your private CA certificate. 
     */
    CertificateChain?: CertificateChain;
  }
  export interface GetPolicyRequest {
    /**
     * The Amazon Resource Number (ARN) of the private CA that will have its policy retrieved. You can find the CA's ARN by calling the ListCertificateAuthorities action. 
     */
    ResourceArn: Arn;
  }
  export interface GetPolicyResponse {
    /**
     * The policy attached to the private CA as a JSON document.
     */
    Policy?: AWSPolicy;
  }
  export type IdempotencyToken = string;
  export interface ImportCertificateAuthorityCertificateRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateCertificateAuthority. This must be of the form:   arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012  
     */
    CertificateAuthorityArn: Arn;
    /**
     * The PEM-encoded certificate for a private CA. This may be a self-signed certificate in the case of a root CA, or it may be signed by another CA that you control.
     */
    Certificate: CertificateBodyBlob;
    /**
     * A PEM-encoded file that contains all of your certificates, other than the certificate you're importing, chaining up to your root CA. Your ACM Private CA-hosted or on-premises root certificate is the last in the chain, and each certificate in the chain signs the one preceding.  This parameter must be supplied when you import a subordinate CA. When you import a root CA, there is no chain.
     */
    CertificateChain?: CertificateChainBlob;
  }
  export type Integer1To5000 = number;
  export interface IssueCertificateRequest {
    /**
     * Specifies X.509 certificate information to be included in the issued certificate. An APIPassthrough or APICSRPassthrough template variant must be selected, or else this parameter is ignored. For more information about using these templates, see Understanding Certificate Templates. If conflicting or duplicate certificate information is supplied during certificate issuance, ACM Private CA applies order of operation rules to determine what information is used.
     */
    ApiPassthrough?: ApiPassthrough;
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateCertificateAuthority. This must be of the form:  arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012  
     */
    CertificateAuthorityArn: Arn;
    /**
     * The certificate signing request (CSR) for the certificate you want to issue. As an example, you can use the following OpenSSL command to create the CSR and a 2048 bit RSA private key.   openssl req -new -newkey rsa:2048 -days 365 -keyout private/test_cert_priv_key.pem -out csr/test_cert_.csr  If you have a configuration file, you can then use the following OpenSSL command. The usr_cert block in the configuration file contains your X509 version 3 extensions.   openssl req -new -config openssl_rsa.cnf -extensions usr_cert -newkey rsa:2048 -days -365 -keyout private/test_cert_priv_key.pem -out csr/test_cert_.csr  Note: A CSR must provide either a subject name or a subject alternative name or the request will be rejected. 
     */
    Csr: CsrBlob;
    /**
     * The name of the algorithm that will be used to sign the certificate to be issued.  This parameter should not be confused with the SigningAlgorithm parameter used to sign a CSR in the CreateCertificateAuthority action.
     */
    SigningAlgorithm: SigningAlgorithm;
    /**
     * Specifies a custom configuration template to use when issuing a certificate. If this parameter is not provided, ACM Private CA defaults to the EndEntityCertificate/V1 template. For CA certificates, you should choose the shortest path length that meets your needs. The path length is indicated by the PathLenN portion of the ARN, where N is the CA depth. Note: The CA depth configured on a subordinate CA certificate must not exceed the limit set by its parents in the CA hierarchy. For a list of TemplateArn values supported by ACM Private CA, see Understanding Certificate Templates.
     */
    TemplateArn?: Arn;
    /**
     * Information describing the end of the validity period of the certificate. This parameter sets the “Not After” date for the certificate. Certificate validity is the period of time during which a certificate is valid. Validity can be expressed as an explicit date and time when the certificate expires, or as a span of time after issuance, stated in days, months, or years. For more information, see Validity in RFC 5280.  This value is unaffected when ValidityNotBefore is also specified. For example, if Validity is set to 20 days in the future, the certificate will expire 20 days from issuance time regardless of the ValidityNotBefore value. The end of the validity period configured on a certificate must not exceed the limit set on its parents in the CA hierarchy.
     */
    Validity: Validity;
    /**
     * Information describing the start of the validity period of the certificate. This parameter sets the “Not Before" date for the certificate. By default, when issuing a certificate, ACM Private CA sets the "Not Before" date to the issuance time minus 60 minutes. This compensates for clock inconsistencies across computer systems. The ValidityNotBefore parameter can be used to customize the “Not Before” value.  Unlike the Validity parameter, the ValidityNotBefore parameter is optional. The ValidityNotBefore value is expressed as an explicit date and time, using the Validity type value ABSOLUTE. For more information, see Validity in this API reference and Validity in RFC 5280.
     */
    ValidityNotBefore?: Validity;
    /**
     * Alphanumeric string that can be used to distinguish between calls to the IssueCertificate action. Idempotency tokens for IssueCertificate time out after one minute. Therefore, if you call IssueCertificate multiple times with the same idempotency token within one minute, ACM Private CA recognizes that you are requesting only one certificate and will issue only one. If you change the idempotency token for each call, PCA recognizes that you are requesting multiple certificates.
     */
    IdempotencyToken?: IdempotencyToken;
  }
  export interface IssueCertificateResponse {
    /**
     * The Amazon Resource Name (ARN) of the issued certificate and the certificate serial number. This is of the form:  arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012/certificate/286535153982981100925020015808220737245  
     */
    CertificateArn?: Arn;
  }
  export type KeyAlgorithm = "RSA_2048"|"RSA_4096"|"EC_prime256v1"|"EC_secp384r1"|string;
  export type KeyStorageSecurityStandard = "FIPS_140_2_LEVEL_2_OR_HIGHER"|"FIPS_140_2_LEVEL_3_OR_HIGHER"|string;
  export interface KeyUsage {
    /**
     *  Key can be used for digital signing.
     */
    DigitalSignature?: Boolean;
    /**
     * Key can be used for non-repudiation.
     */
    NonRepudiation?: Boolean;
    /**
     * Key can be used to encipher data.
     */
    KeyEncipherment?: Boolean;
    /**
     * Key can be used to decipher data.
     */
    DataEncipherment?: Boolean;
    /**
     * Key can be used in a key-agreement protocol.
     */
    KeyAgreement?: Boolean;
    /**
     * Key can be used to sign certificates.
     */
    KeyCertSign?: Boolean;
    /**
     * Key can be used to sign CRLs.
     */
    CRLSign?: Boolean;
    /**
     * Key can be used only to encipher data.
     */
    EncipherOnly?: Boolean;
    /**
     * Key can be used only to decipher data.
     */
    DecipherOnly?: Boolean;
  }
  export interface ListCertificateAuthoritiesRequest {
    /**
     * Use this parameter when paginating results in a subsequent request after you receive a response with truncated results. Set it to the value of the NextToken parameter from the response you just received.
     */
    NextToken?: NextToken;
    /**
     * Use this parameter when paginating results to specify the maximum number of items to return in the response on each page. If additional items exist beyond the number you specify, the NextToken element is sent in the response. Use this NextToken value in a subsequent request to retrieve additional items.
     */
    MaxResults?: MaxResults;
    /**
     * Use this parameter to filter the returned set of certificate authorities based on their owner. The default is SELF.
     */
    ResourceOwner?: ResourceOwner;
  }
  export interface ListCertificateAuthoritiesResponse {
    /**
     * Summary information about each certificate authority you have created.
     */
    CertificateAuthorities?: CertificateAuthorities;
    /**
     * When the list is truncated, this value is present and should be used for the NextToken parameter in a subsequent pagination request.
     */
    NextToken?: NextToken;
  }
  export interface ListPermissionsRequest {
    /**
     * The Amazon Resource Number (ARN) of the private CA to inspect. You can find the ARN by calling the ListCertificateAuthorities action. This must be of the form: arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012 You can get a private CA's ARN by running the ListCertificateAuthorities action.
     */
    CertificateAuthorityArn: Arn;
    /**
     * When paginating results, use this parameter in a subsequent request after you receive a response with truncated results. Set it to the value of NextToken from the response you just received.
     */
    NextToken?: NextToken;
    /**
     * When paginating results, use this parameter to specify the maximum number of items to return in the response. If additional items exist beyond the number you specify, the NextToken element is sent in the response. Use this NextToken value in a subsequent request to retrieve additional items.
     */
    MaxResults?: MaxResults;
  }
  export interface ListPermissionsResponse {
    /**
     * Summary information about each permission assigned by the specified private CA, including the action enabled, the policy provided, and the time of creation.
     */
    Permissions?: PermissionList;
    /**
     * When the list is truncated, this value is present and should be used for the NextToken parameter in a subsequent pagination request. 
     */
    NextToken?: NextToken;
  }
  export interface ListTagsRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called the CreateCertificateAuthority action. This must be of the form:   arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012  
     */
    CertificateAuthorityArn: Arn;
    /**
     * Use this parameter when paginating results in a subsequent request after you receive a response with truncated results. Set it to the value of NextToken from the response you just received.
     */
    NextToken?: NextToken;
    /**
     * Use this parameter when paginating results to specify the maximum number of items to return in the response. If additional items exist beyond the number you specify, the NextToken element is sent in the response. Use this NextToken value in a subsequent request to retrieve additional items.
     */
    MaxResults?: MaxResults;
  }
  export interface ListTagsResponse {
    /**
     * The tags associated with your private CA.
     */
    Tags?: TagList;
    /**
     * When the list is truncated, this value is present and should be used for the NextToken parameter in a subsequent pagination request. 
     */
    NextToken?: NextToken;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export interface OcspConfiguration {
    /**
     * Flag enabling use of the Online Certificate Status Protocol (OCSP) for validating certificate revocation status.
     */
    Enabled: Boolean;
    /**
     * By default, ACM Private CA injects an AWS domain into certificates being validated by the Online Certificate Status Protocol (OCSP). A customer can alternatively use this object to define a CNAME specifying a customized OCSP domain. Note: The value of the CNAME must not include a protocol prefix such as "http://" or "https://". For more information, see Customizing Online Certificate Status Protocol (OCSP)  in the AWS Certificate Manager Private Certificate Authority (PCA) User Guide.
     */
    OcspCustomCname?: String253;
  }
  export interface OtherName {
    /**
     * Specifies an OID. 
     */
    TypeId: CustomObjectIdentifier;
    /**
     * Specifies an OID value.
     */
    Value: String256;
  }
  export type PermanentDeletionTimeInDays = number;
  export interface Permission {
    /**
     * The Amazon Resource Number (ARN) of the private CA from which the permission was issued.
     */
    CertificateAuthorityArn?: Arn;
    /**
     * The time at which the permission was created.
     */
    CreatedAt?: TStamp;
    /**
     * The AWS service or entity that holds the permission. At this time, the only valid principal is acm.amazonaws.com.
     */
    Principal?: Principal;
    /**
     * The ID of the account that assigned the permission.
     */
    SourceAccount?: AccountId;
    /**
     * The private CA actions that can be performed by the designated AWS service.
     */
    Actions?: ActionList;
    /**
     * The name of the policy that is associated with the permission.
     */
    Policy?: AWSPolicy;
  }
  export type PermissionList = Permission[];
  export interface PolicyInformation {
    /**
     * Specifies the object identifier (OID) of the certificate policy under which the certificate was issued. For more information, see NIST's definition of Object Identifier (OID).
     */
    CertPolicyId: CustomObjectIdentifier;
    /**
     * Modifies the given CertPolicyId with a qualifier. ACM Private CA supports the certification practice statement (CPS) qualifier.
     */
    PolicyQualifiers?: PolicyQualifierInfoList;
  }
  export type PolicyQualifierId = "CPS"|string;
  export interface PolicyQualifierInfo {
    /**
     * Identifies the qualifier modifying a CertPolicyId.
     */
    PolicyQualifierId: PolicyQualifierId;
    /**
     * Defines the qualifier type. ACM Private CA supports the use of a URI for a CPS qualifier in this field.
     */
    Qualifier: Qualifier;
  }
  export type PolicyQualifierInfoList = PolicyQualifierInfo[];
  export type PositiveLong = number;
  export type Principal = string;
  export interface PutPolicyRequest {
    /**
     * The Amazon Resource Number (ARN) of the private CA to associate with the policy. The ARN of the CA can be found by calling the ListCertificateAuthorities action. 
     */
    ResourceArn: Arn;
    /**
     * The path and file name of a JSON-formatted IAM policy to attach to the specified private CA resource. If this policy does not contain all required statements or if it includes any statement that is not allowed, the PutPolicy action returns an InvalidPolicyException. For information about IAM policy and statement structure, see Overview of JSON Policies.
     */
    Policy: AWSPolicy;
  }
  export interface Qualifier {
    /**
     * Contains a pointer to a certification practice statement (CPS) published by the CA.
     */
    CpsUri: String256;
  }
  export type ResourceOwner = "SELF"|"OTHER_ACCOUNTS"|string;
  export interface RestoreCertificateAuthorityRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called the CreateCertificateAuthority action. This must be of the form:   arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012  
     */
    CertificateAuthorityArn: Arn;
  }
  export interface RevocationConfiguration {
    /**
     * Configuration of the certificate revocation list (CRL), if any, maintained by your private CA. A CRL is typically updated approximately 30 minutes after a certificate is revoked. If for any reason a CRL update fails, ACM Private CA makes further attempts every 15 minutes.
     */
    CrlConfiguration?: CrlConfiguration;
    /**
     * Configuration of Online Certificate Status Protocol (OCSP) support, if any, maintained by your private CA. When you revoke a certificate, OCSP responses may take up to 60 minutes to reflect the new status.
     */
    OcspConfiguration?: OcspConfiguration;
  }
  export type RevocationReason = "UNSPECIFIED"|"KEY_COMPROMISE"|"CERTIFICATE_AUTHORITY_COMPROMISE"|"AFFILIATION_CHANGED"|"SUPERSEDED"|"CESSATION_OF_OPERATION"|"PRIVILEGE_WITHDRAWN"|"A_A_COMPROMISE"|string;
  export interface RevokeCertificateRequest {
    /**
     * Amazon Resource Name (ARN) of the private CA that issued the certificate to be revoked. This must be of the form:  arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012  
     */
    CertificateAuthorityArn: Arn;
    /**
     * Serial number of the certificate to be revoked. This must be in hexadecimal format. You can retrieve the serial number by calling GetCertificate with the Amazon Resource Name (ARN) of the certificate you want and the ARN of your private CA. The GetCertificate action retrieves the certificate in the PEM format. You can use the following OpenSSL command to list the certificate in text format and copy the hexadecimal serial number.   openssl x509 -in file_path -text -noout  You can also copy the serial number from the console or use the DescribeCertificate action in the AWS Certificate Manager API Reference. 
     */
    CertificateSerial: String128;
    /**
     * Specifies why you revoked the certificate.
     */
    RevocationReason: RevocationReason;
  }
  export type S3BucketName = string;
  export type S3Key = string;
  export type S3ObjectAcl = "PUBLIC_READ"|"BUCKET_OWNER_FULL_CONTROL"|string;
  export type SigningAlgorithm = "SHA256WITHECDSA"|"SHA384WITHECDSA"|"SHA512WITHECDSA"|"SHA256WITHRSA"|"SHA384WITHRSA"|"SHA512WITHRSA"|string;
  export type String = string;
  export type String128 = string;
  export type String16 = string;
  export type String253 = string;
  export type String256 = string;
  export type String3 = string;
  export type String39 = string;
  export type String3To255 = string;
  export type String40 = string;
  export type String5 = string;
  export type String64 = string;
  export type TStamp = Date;
  export interface Tag {
    /**
     * Key (name) of the tag.
     */
    Key: TagKey;
    /**
     * Value of the tag.
     */
    Value?: TagValue;
  }
  export interface TagCertificateAuthorityRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateCertificateAuthority. This must be of the form:   arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012  
     */
    CertificateAuthorityArn: Arn;
    /**
     * List of tags to be associated with the CA.
     */
    Tags: TagList;
  }
  export type TagKey = string;
  export type TagList = Tag[];
  export type TagValue = string;
  export interface UntagCertificateAuthorityRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateCertificateAuthority. This must be of the form:   arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012  
     */
    CertificateAuthorityArn: Arn;
    /**
     * List of tags to be removed from the CA.
     */
    Tags: TagList;
  }
  export interface UpdateCertificateAuthorityRequest {
    /**
     * Amazon Resource Name (ARN) of the private CA that issued the certificate to be revoked. This must be of the form:  arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012  
     */
    CertificateAuthorityArn: Arn;
    /**
     * Contains information to enable Online Certificate Status Protocol (OCSP) support, to enable a certificate revocation list (CRL), to enable both, or to enable neither. If this parameter is not supplied, existing capibilites remain unchanged. For more information, see the OcspConfiguration and CrlConfiguration types.
     */
    RevocationConfiguration?: RevocationConfiguration;
    /**
     * Status of your private CA.
     */
    Status?: CertificateAuthorityStatus;
  }
  export interface Validity {
    /**
     * A long integer interpreted according to the value of Type, below.
     */
    Value: PositiveLong;
    /**
     * Determines how ACM Private CA interprets the Value parameter, an integer. Supported validity types include those listed below. Type definitions with values include a sample input value and the resulting output.   END_DATE: The specific date and time when the certificate will expire, expressed using UTCTime (YYMMDDHHMMSS) or GeneralizedTime (YYYYMMDDHHMMSS) format. When UTCTime is used, if the year field (YY) is greater than or equal to 50, the year is interpreted as 19YY. If the year field is less than 50, the year is interpreted as 20YY.   Sample input value: 491231235959 (UTCTime format)   Output expiration date/time: 12/31/2049 23:59:59    ABSOLUTE: The specific date and time when the validity of a certificate will start or expire, expressed in seconds since the Unix Epoch.    Sample input value: 2524608000   Output expiration date/time: 01/01/2050 00:00:00    DAYS, MONTHS, YEARS: The relative time from the moment of issuance until the certificate will expire, expressed in days, months, or years.  Example if DAYS, issued on 10/12/2020 at 12:34:54 UTC:   Sample input value: 90   Output expiration date: 01/10/2020 12:34:54 UTC   The minimum validity duration for a certificate using relative time (DAYS) is one day. The minimum validity for a certificate using absolute time (ABSOLUTE or END_DATE) is one second.
     */
    Type: ValidityPeriodType;
  }
  export type ValidityPeriodType = "END_DATE"|"ABSOLUTE"|"DAYS"|"MONTHS"|"YEARS"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-08-22"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ACMPCA client.
   */
  export import Types = ACMPCA;
}
export = ACMPCA;
