import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class PcaConnectorAd extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: PcaConnectorAd.Types.ClientConfiguration)
  config: Config & PcaConnectorAd.Types.ClientConfiguration;
  /**
   * Creates a connector between Amazon Web Services Private CA and an Active Directory. You must specify the private CA, directory ID, and security groups.
   */
  createConnector(params: PcaConnectorAd.Types.CreateConnectorRequest, callback?: (err: AWSError, data: PcaConnectorAd.Types.CreateConnectorResponse) => void): Request<PcaConnectorAd.Types.CreateConnectorResponse, AWSError>;
  /**
   * Creates a connector between Amazon Web Services Private CA and an Active Directory. You must specify the private CA, directory ID, and security groups.
   */
  createConnector(callback?: (err: AWSError, data: PcaConnectorAd.Types.CreateConnectorResponse) => void): Request<PcaConnectorAd.Types.CreateConnectorResponse, AWSError>;
  /**
   * Creates a directory registration that authorizes communication between Amazon Web Services Private CA and an Active Directory
   */
  createDirectoryRegistration(params: PcaConnectorAd.Types.CreateDirectoryRegistrationRequest, callback?: (err: AWSError, data: PcaConnectorAd.Types.CreateDirectoryRegistrationResponse) => void): Request<PcaConnectorAd.Types.CreateDirectoryRegistrationResponse, AWSError>;
  /**
   * Creates a directory registration that authorizes communication between Amazon Web Services Private CA and an Active Directory
   */
  createDirectoryRegistration(callback?: (err: AWSError, data: PcaConnectorAd.Types.CreateDirectoryRegistrationResponse) => void): Request<PcaConnectorAd.Types.CreateDirectoryRegistrationResponse, AWSError>;
  /**
   * Creates a service principal name (SPN) for the service account in Active Directory. Kerberos authentication uses SPNs to associate a service instance with a service sign-in account.
   */
  createServicePrincipalName(params: PcaConnectorAd.Types.CreateServicePrincipalNameRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a service principal name (SPN) for the service account in Active Directory. Kerberos authentication uses SPNs to associate a service instance with a service sign-in account.
   */
  createServicePrincipalName(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates an Active Directory compatible certificate template. The connectors issues certificates using these templates based on the requester’s Active Directory group membership.
   */
  createTemplate(params: PcaConnectorAd.Types.CreateTemplateRequest, callback?: (err: AWSError, data: PcaConnectorAd.Types.CreateTemplateResponse) => void): Request<PcaConnectorAd.Types.CreateTemplateResponse, AWSError>;
  /**
   * Creates an Active Directory compatible certificate template. The connectors issues certificates using these templates based on the requester’s Active Directory group membership.
   */
  createTemplate(callback?: (err: AWSError, data: PcaConnectorAd.Types.CreateTemplateResponse) => void): Request<PcaConnectorAd.Types.CreateTemplateResponse, AWSError>;
  /**
   * Create a group access control entry. Allow or deny Active Directory groups from enrolling and/or autoenrolling with the template based on the group security identifiers (SIDs).
   */
  createTemplateGroupAccessControlEntry(params: PcaConnectorAd.Types.CreateTemplateGroupAccessControlEntryRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Create a group access control entry. Allow or deny Active Directory groups from enrolling and/or autoenrolling with the template based on the group security identifiers (SIDs).
   */
  createTemplateGroupAccessControlEntry(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a connector for Active Directory. You must provide the Amazon Resource Name (ARN) of the connector that you want to delete. You can find the ARN by calling the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_ListConnectors action. Deleting a connector does not deregister your directory with Amazon Web Services Private CA. You can deregister your directory by calling the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_DeleteDirectoryRegistration action.
   */
  deleteConnector(params: PcaConnectorAd.Types.DeleteConnectorRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a connector for Active Directory. You must provide the Amazon Resource Name (ARN) of the connector that you want to delete. You can find the ARN by calling the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_ListConnectors action. Deleting a connector does not deregister your directory with Amazon Web Services Private CA. You can deregister your directory by calling the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_DeleteDirectoryRegistration action.
   */
  deleteConnector(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a directory registration. Deleting a directory registration deauthorizes Amazon Web Services Private CA with the directory. 
   */
  deleteDirectoryRegistration(params: PcaConnectorAd.Types.DeleteDirectoryRegistrationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a directory registration. Deleting a directory registration deauthorizes Amazon Web Services Private CA with the directory. 
   */
  deleteDirectoryRegistration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the service principal name (SPN) used by a connector to authenticate with your Active Directory.
   */
  deleteServicePrincipalName(params: PcaConnectorAd.Types.DeleteServicePrincipalNameRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the service principal name (SPN) used by a connector to authenticate with your Active Directory.
   */
  deleteServicePrincipalName(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a template. Certificates issued using the template are still valid until they are revoked or expired.
   */
  deleteTemplate(params: PcaConnectorAd.Types.DeleteTemplateRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a template. Certificates issued using the template are still valid until they are revoked or expired.
   */
  deleteTemplate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a group access control entry.
   */
  deleteTemplateGroupAccessControlEntry(params: PcaConnectorAd.Types.DeleteTemplateGroupAccessControlEntryRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a group access control entry.
   */
  deleteTemplateGroupAccessControlEntry(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Lists information about your connector. You specify the connector on input by its ARN (Amazon Resource Name). 
   */
  getConnector(params: PcaConnectorAd.Types.GetConnectorRequest, callback?: (err: AWSError, data: PcaConnectorAd.Types.GetConnectorResponse) => void): Request<PcaConnectorAd.Types.GetConnectorResponse, AWSError>;
  /**
   * Lists information about your connector. You specify the connector on input by its ARN (Amazon Resource Name). 
   */
  getConnector(callback?: (err: AWSError, data: PcaConnectorAd.Types.GetConnectorResponse) => void): Request<PcaConnectorAd.Types.GetConnectorResponse, AWSError>;
  /**
   * A structure that contains information about your directory registration.
   */
  getDirectoryRegistration(params: PcaConnectorAd.Types.GetDirectoryRegistrationRequest, callback?: (err: AWSError, data: PcaConnectorAd.Types.GetDirectoryRegistrationResponse) => void): Request<PcaConnectorAd.Types.GetDirectoryRegistrationResponse, AWSError>;
  /**
   * A structure that contains information about your directory registration.
   */
  getDirectoryRegistration(callback?: (err: AWSError, data: PcaConnectorAd.Types.GetDirectoryRegistrationResponse) => void): Request<PcaConnectorAd.Types.GetDirectoryRegistrationResponse, AWSError>;
  /**
   * Lists the service principal name that the connector uses to authenticate with Active Directory.
   */
  getServicePrincipalName(params: PcaConnectorAd.Types.GetServicePrincipalNameRequest, callback?: (err: AWSError, data: PcaConnectorAd.Types.GetServicePrincipalNameResponse) => void): Request<PcaConnectorAd.Types.GetServicePrincipalNameResponse, AWSError>;
  /**
   * Lists the service principal name that the connector uses to authenticate with Active Directory.
   */
  getServicePrincipalName(callback?: (err: AWSError, data: PcaConnectorAd.Types.GetServicePrincipalNameResponse) => void): Request<PcaConnectorAd.Types.GetServicePrincipalNameResponse, AWSError>;
  /**
   * Retrieves a certificate template that the connector uses to issue certificates from a private CA.
   */
  getTemplate(params: PcaConnectorAd.Types.GetTemplateRequest, callback?: (err: AWSError, data: PcaConnectorAd.Types.GetTemplateResponse) => void): Request<PcaConnectorAd.Types.GetTemplateResponse, AWSError>;
  /**
   * Retrieves a certificate template that the connector uses to issue certificates from a private CA.
   */
  getTemplate(callback?: (err: AWSError, data: PcaConnectorAd.Types.GetTemplateResponse) => void): Request<PcaConnectorAd.Types.GetTemplateResponse, AWSError>;
  /**
   * Retrieves the group access control entries for a template.
   */
  getTemplateGroupAccessControlEntry(params: PcaConnectorAd.Types.GetTemplateGroupAccessControlEntryRequest, callback?: (err: AWSError, data: PcaConnectorAd.Types.GetTemplateGroupAccessControlEntryResponse) => void): Request<PcaConnectorAd.Types.GetTemplateGroupAccessControlEntryResponse, AWSError>;
  /**
   * Retrieves the group access control entries for a template.
   */
  getTemplateGroupAccessControlEntry(callback?: (err: AWSError, data: PcaConnectorAd.Types.GetTemplateGroupAccessControlEntryResponse) => void): Request<PcaConnectorAd.Types.GetTemplateGroupAccessControlEntryResponse, AWSError>;
  /**
   * Lists the connectors that you created by using the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateConnector action.
   */
  listConnectors(params: PcaConnectorAd.Types.ListConnectorsRequest, callback?: (err: AWSError, data: PcaConnectorAd.Types.ListConnectorsResponse) => void): Request<PcaConnectorAd.Types.ListConnectorsResponse, AWSError>;
  /**
   * Lists the connectors that you created by using the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateConnector action.
   */
  listConnectors(callback?: (err: AWSError, data: PcaConnectorAd.Types.ListConnectorsResponse) => void): Request<PcaConnectorAd.Types.ListConnectorsResponse, AWSError>;
  /**
   * Lists the directory registrations that you created by using the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateDirectoryRegistration action.
   */
  listDirectoryRegistrations(params: PcaConnectorAd.Types.ListDirectoryRegistrationsRequest, callback?: (err: AWSError, data: PcaConnectorAd.Types.ListDirectoryRegistrationsResponse) => void): Request<PcaConnectorAd.Types.ListDirectoryRegistrationsResponse, AWSError>;
  /**
   * Lists the directory registrations that you created by using the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateDirectoryRegistration action.
   */
  listDirectoryRegistrations(callback?: (err: AWSError, data: PcaConnectorAd.Types.ListDirectoryRegistrationsResponse) => void): Request<PcaConnectorAd.Types.ListDirectoryRegistrationsResponse, AWSError>;
  /**
   * Lists the service principal names that the connector uses to authenticate with Active Directory.
   */
  listServicePrincipalNames(params: PcaConnectorAd.Types.ListServicePrincipalNamesRequest, callback?: (err: AWSError, data: PcaConnectorAd.Types.ListServicePrincipalNamesResponse) => void): Request<PcaConnectorAd.Types.ListServicePrincipalNamesResponse, AWSError>;
  /**
   * Lists the service principal names that the connector uses to authenticate with Active Directory.
   */
  listServicePrincipalNames(callback?: (err: AWSError, data: PcaConnectorAd.Types.ListServicePrincipalNamesResponse) => void): Request<PcaConnectorAd.Types.ListServicePrincipalNamesResponse, AWSError>;
  /**
   * Lists the tags, if any, that are associated with your resource. 
   */
  listTagsForResource(params: PcaConnectorAd.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: PcaConnectorAd.Types.ListTagsForResourceResponse) => void): Request<PcaConnectorAd.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags, if any, that are associated with your resource. 
   */
  listTagsForResource(callback?: (err: AWSError, data: PcaConnectorAd.Types.ListTagsForResourceResponse) => void): Request<PcaConnectorAd.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists group access control entries you created. 
   */
  listTemplateGroupAccessControlEntries(params: PcaConnectorAd.Types.ListTemplateGroupAccessControlEntriesRequest, callback?: (err: AWSError, data: PcaConnectorAd.Types.ListTemplateGroupAccessControlEntriesResponse) => void): Request<PcaConnectorAd.Types.ListTemplateGroupAccessControlEntriesResponse, AWSError>;
  /**
   * Lists group access control entries you created. 
   */
  listTemplateGroupAccessControlEntries(callback?: (err: AWSError, data: PcaConnectorAd.Types.ListTemplateGroupAccessControlEntriesResponse) => void): Request<PcaConnectorAd.Types.ListTemplateGroupAccessControlEntriesResponse, AWSError>;
  /**
   * Lists the templates, if any, that are associated with a connector.
   */
  listTemplates(params: PcaConnectorAd.Types.ListTemplatesRequest, callback?: (err: AWSError, data: PcaConnectorAd.Types.ListTemplatesResponse) => void): Request<PcaConnectorAd.Types.ListTemplatesResponse, AWSError>;
  /**
   * Lists the templates, if any, that are associated with a connector.
   */
  listTemplates(callback?: (err: AWSError, data: PcaConnectorAd.Types.ListTemplatesResponse) => void): Request<PcaConnectorAd.Types.ListTemplatesResponse, AWSError>;
  /**
   * Adds one or more tags to your resource.
   */
  tagResource(params: PcaConnectorAd.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags to your resource.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes one or more tags from your resource.
   */
  untagResource(params: PcaConnectorAd.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes one or more tags from your resource.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Update template configuration to define the information included in certificates.
   */
  updateTemplate(params: PcaConnectorAd.Types.UpdateTemplateRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Update template configuration to define the information included in certificates.
   */
  updateTemplate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Update a group access control entry you created using CreateTemplateGroupAccessControlEntry. 
   */
  updateTemplateGroupAccessControlEntry(params: PcaConnectorAd.Types.UpdateTemplateGroupAccessControlEntryRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Update a group access control entry you created using CreateTemplateGroupAccessControlEntry. 
   */
  updateTemplateGroupAccessControlEntry(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace PcaConnectorAd {
  export interface AccessControlEntry {
    /**
     * Permissions to allow or deny an Active Directory group to enroll or autoenroll certificates issued against a template.
     */
    AccessRights?: AccessRights;
    /**
     * The date and time that the Access Control Entry was created.
     */
    CreatedAt?: Timestamp;
    /**
     * Name of the Active Directory group. This name does not need to match the group name in Active Directory.
     */
    GroupDisplayName?: DisplayName;
    /**
     * Security identifier (SID) of the group object from Active Directory. The SID starts with "S-".
     */
    GroupSecurityIdentifier?: GroupSecurityIdentifier;
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateTemplate.
     */
    TemplateArn?: TemplateArn;
    /**
     * The date and time that the Access Control Entry was updated.
     */
    UpdatedAt?: Timestamp;
  }
  export type AccessControlEntryList = AccessControlEntrySummary[];
  export interface AccessControlEntrySummary {
    /**
     * Allow or deny an Active Directory group from enrolling and autoenrolling certificates issued against a template.
     */
    AccessRights?: AccessRights;
    /**
     * The date and time that the Access Control Entry was created.
     */
    CreatedAt?: Timestamp;
    /**
     * Name of the Active Directory group. This name does not need to match the group name in Active Directory.
     */
    GroupDisplayName?: DisplayName;
    /**
     * Security identifier (SID) of the group object from Active Directory. The SID starts with "S-".
     */
    GroupSecurityIdentifier?: GroupSecurityIdentifier;
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateTemplate. 
     */
    TemplateArn?: TemplateArn;
    /**
     * The date and time that the Access Control Entry was updated.
     */
    UpdatedAt?: Timestamp;
  }
  export type AccessRight = "ALLOW"|"DENY"|string;
  export interface AccessRights {
    /**
     * Allow or deny an Active Directory group from autoenrolling certificates issued against a template. The Active Directory group must be allowed to enroll to allow autoenrollment
     */
    AutoEnroll?: AccessRight;
    /**
     * Allow or deny an Active Directory group from enrolling certificates issued against a template.
     */
    Enroll?: AccessRight;
  }
  export interface ApplicationPolicies {
    /**
     * Marks the application policy extension as critical.
     */
    Critical?: Boolean;
    /**
     * Application policies describe what the certificate can be used for.
     */
    Policies: ApplicationPolicyList;
  }
  export interface ApplicationPolicy {
    /**
     * The object identifier (OID) of an application policy.
     */
    PolicyObjectIdentifier?: CustomObjectIdentifier;
    /**
     * The type of application policy
     */
    PolicyType?: ApplicationPolicyType;
  }
  export type ApplicationPolicyList = ApplicationPolicy[];
  export type ApplicationPolicyType = "ALL_APPLICATION_POLICIES"|"ANY_PURPOSE"|"ATTESTATION_IDENTITY_KEY_CERTIFICATE"|"CERTIFICATE_REQUEST_AGENT"|"CLIENT_AUTHENTICATION"|"CODE_SIGNING"|"CTL_USAGE"|"DIGITAL_RIGHTS"|"DIRECTORY_SERVICE_EMAIL_REPLICATION"|"DISALLOWED_LIST"|"DNS_SERVER_TRUST"|"DOCUMENT_ENCRYPTION"|"DOCUMENT_SIGNING"|"DYNAMIC_CODE_GENERATOR"|"EARLY_LAUNCH_ANTIMALWARE_DRIVER"|"EMBEDDED_WINDOWS_SYSTEM_COMPONENT_VERIFICATION"|"ENCLAVE"|"ENCRYPTING_FILE_SYSTEM"|"ENDORSEMENT_KEY_CERTIFICATE"|"FILE_RECOVERY"|"HAL_EXTENSION"|"IP_SECURITY_END_SYSTEM"|"IP_SECURITY_IKE_INTERMEDIATE"|"IP_SECURITY_TUNNEL_TERMINATION"|"IP_SECURITY_USER"|"ISOLATED_USER_MODE"|"KDC_AUTHENTICATION"|"KERNEL_MODE_CODE_SIGNING"|"KEY_PACK_LICENSES"|"KEY_RECOVERY"|"KEY_RECOVERY_AGENT"|"LICENSE_SERVER_VERIFICATION"|"LIFETIME_SIGNING"|"MICROSOFT_PUBLISHER"|"MICROSOFT_TIME_STAMPING"|"MICROSOFT_TRUST_LIST_SIGNING"|"OCSP_SIGNING"|"OEM_WINDOWS_SYSTEM_COMPONENT_VERIFICATION"|"PLATFORM_CERTIFICATE"|"PREVIEW_BUILD_SIGNING"|"PRIVATE_KEY_ARCHIVAL"|"PROTECTED_PROCESS_LIGHT_VERIFICATION"|"PROTECTED_PROCESS_VERIFICATION"|"QUALIFIED_SUBORDINATION"|"REVOKED_LIST_SIGNER"|"ROOT_PROGRAM_AUTO_UPDATE_CA_REVOCATION"|"ROOT_PROGRAM_AUTO_UPDATE_END_REVOCATION"|"ROOT_PROGRAM_NO_OSCP_FAILOVER_TO_CRL"|"ROOT_LIST_SIGNER"|"SECURE_EMAIL"|"SERVER_AUTHENTICATION"|"SMART_CARD_LOGIN"|"SPC_ENCRYPTED_DIGEST_RETRY_COUNT"|"SPC_RELAXED_PE_MARKER_CHECK"|"TIME_STAMPING"|"WINDOWS_HARDWARE_DRIVER_ATTESTED_VERIFICATION"|"WINDOWS_HARDWARE_DRIVER_EXTENDED_VERIFICATION"|"WINDOWS_HARDWARE_DRIVER_VERIFICATION"|"WINDOWS_HELLO_RECOVERY_KEY_ENCRYPTION"|"WINDOWS_KITS_COMPONENT"|"WINDOWS_RT_VERIFICATION"|"WINDOWS_SOFTWARE_EXTENSION_VERIFICATION"|"WINDOWS_STORE"|"WINDOWS_SYSTEM_COMPONENT_VERIFICATION"|"WINDOWS_TCB_COMPONENT"|"WINDOWS_THIRD_PARTY_APPLICATION_COMPONENT"|"WINDOWS_UPDATE"|string;
  export type Boolean = boolean;
  export type CertificateAuthorityArn = string;
  export interface CertificateValidity {
    /**
     * Renewal period is the period of time before certificate expiration when a new certificate will be requested.
     */
    RenewalPeriod: ValidityPeriod;
    /**
     * Information describing the end of the validity period of the certificate. This parameter sets the “Not After” date for the certificate. Certificate validity is the period of time during which a certificate is valid. Validity can be expressed as an explicit date and time when the certificate expires, or as a span of time after issuance, stated in days, months, or years. For more information, see Validity in RFC 5280. This value is unaffected when ValidityNotBefore is also specified. For example, if Validity is set to 20 days in the future, the certificate will expire 20 days from issuance time regardless of the ValidityNotBefore value.
     */
    ValidityPeriod: ValidityPeriod;
  }
  export type ClientCompatibilityV2 = "WINDOWS_SERVER_2003"|"WINDOWS_SERVER_2008"|"WINDOWS_SERVER_2008_R2"|"WINDOWS_SERVER_2012"|"WINDOWS_SERVER_2012_R2"|"WINDOWS_SERVER_2016"|string;
  export type ClientCompatibilityV3 = "WINDOWS_SERVER_2008"|"WINDOWS_SERVER_2008_R2"|"WINDOWS_SERVER_2012"|"WINDOWS_SERVER_2012_R2"|"WINDOWS_SERVER_2016"|string;
  export type ClientCompatibilityV4 = "WINDOWS_SERVER_2012"|"WINDOWS_SERVER_2012_R2"|"WINDOWS_SERVER_2016"|string;
  export type ClientToken = string;
  export interface Connector {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateConnector. 
     */
    Arn?: ConnectorArn;
    /**
     * The Amazon Resource Name (ARN) of the certificate authority being used. 
     */
    CertificateAuthorityArn?: CertificateAuthorityArn;
    /**
     * Certificate enrollment endpoint for Active Directory domain-joined objects reach out to when requesting certificates.
     */
    CertificateEnrollmentPolicyServerEndpoint?: String;
    /**
     * The date and time that the connector was created.
     */
    CreatedAt?: Timestamp;
    /**
     * The identifier of the Active Directory.
     */
    DirectoryId?: DirectoryId;
    /**
     * Status of the connector. Status can be creating, active, deleting, or failed.
     */
    Status?: ConnectorStatus;
    /**
     * Additional information about the connector status if the status is failed.
     */
    StatusReason?: ConnectorStatusReason;
    /**
     * The date and time that the connector was updated.
     */
    UpdatedAt?: Timestamp;
    /**
     * Information of the VPC and security group(s) used with the connector.
     */
    VpcInformation?: VpcInformation;
  }
  export type ConnectorArn = string;
  export type ConnectorList = ConnectorSummary[];
  export type ConnectorStatus = "CREATING"|"ACTIVE"|"DELETING"|"FAILED"|string;
  export type ConnectorStatusReason = "DIRECTORY_ACCESS_DENIED"|"INTERNAL_FAILURE"|"PRIVATECA_ACCESS_DENIED"|"PRIVATECA_RESOURCE_NOT_FOUND"|"SECURITY_GROUP_NOT_IN_VPC"|"VPC_ACCESS_DENIED"|"VPC_ENDPOINT_LIMIT_EXCEEDED"|"VPC_RESOURCE_NOT_FOUND"|string;
  export interface ConnectorSummary {
    /**
     *  The Amazon Resource Name (ARN) that was returned when you called CreateConnector.
     */
    Arn?: ConnectorArn;
    /**
     * The Amazon Resource Name (ARN) of the certificate authority being used.
     */
    CertificateAuthorityArn?: CertificateAuthorityArn;
    /**
     * Certificate enrollment endpoint for Active Directory domain-joined objects to request certificates.
     */
    CertificateEnrollmentPolicyServerEndpoint?: String;
    /**
     * The date and time that the connector was created.
     */
    CreatedAt?: Timestamp;
    /**
     * The identifier of the Active Directory.
     */
    DirectoryId?: DirectoryId;
    /**
     * Status of the connector. Status can be creating, active, deleting, or failed.
     */
    Status?: ConnectorStatus;
    /**
     * Additional information about the connector status if the status is failed.
     */
    StatusReason?: ConnectorStatusReason;
    /**
     * The date and time that the connector was updated.
     */
    UpdatedAt?: Timestamp;
    /**
     * Information of the VPC and security group(s) used with the connector.
     */
    VpcInformation?: VpcInformation;
  }
  export interface CreateConnectorRequest {
    /**
     *  The Amazon Resource Name (ARN) of the certificate authority being used.
     */
    CertificateAuthorityArn: CertificateAuthorityArn;
    /**
     * Idempotency token.
     */
    ClientToken?: ClientToken;
    /**
     * The identifier of the Active Directory.
     */
    DirectoryId: DirectoryId;
    /**
     * Metadata assigned to a connector consisting of a key-value pair.
     */
    Tags?: Tags;
    /**
     * Security group IDs that describe the inbound and outbound rules.
     */
    VpcInformation: VpcInformation;
  }
  export interface CreateConnectorResponse {
    /**
     * If successful, the Amazon Resource Name (ARN) of the connector for Active Directory.
     */
    ConnectorArn?: ConnectorArn;
  }
  export interface CreateDirectoryRegistrationRequest {
    /**
     * Idempotency token.
     */
    ClientToken?: ClientToken;
    /**
     *  The identifier of the Active Directory.
     */
    DirectoryId: DirectoryId;
    /**
     * Metadata assigned to a directory registration consisting of a key-value pair.
     */
    Tags?: Tags;
  }
  export interface CreateDirectoryRegistrationResponse {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateDirectoryRegistration.
     */
    DirectoryRegistrationArn?: DirectoryRegistrationArn;
  }
  export interface CreateServicePrincipalNameRequest {
    /**
     * Idempotency token.
     */
    ClientToken?: ClientToken;
    /**
     *  The Amazon Resource Name (ARN) that was returned when you called CreateConnector.
     */
    ConnectorArn: ConnectorArn;
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateDirectoryRegistration.
     */
    DirectoryRegistrationArn: DirectoryRegistrationArn;
  }
  export interface CreateTemplateGroupAccessControlEntryRequest {
    /**
     *  Allow or deny permissions for an Active Directory group to enroll or autoenroll certificates for a template.
     */
    AccessRights: AccessRights;
    /**
     * Idempotency token.
     */
    ClientToken?: ClientToken;
    /**
     * Name of the Active Directory group. This name does not need to match the group name in Active Directory.
     */
    GroupDisplayName: DisplayName;
    /**
     * Security identifier (SID) of the group object from Active Directory. The SID starts with "S-".
     */
    GroupSecurityIdentifier: GroupSecurityIdentifier;
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateTemplate.
     */
    TemplateArn: TemplateArn;
  }
  export interface CreateTemplateRequest {
    /**
     * Idempotency token.
     */
    ClientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateConnector.
     */
    ConnectorArn: ConnectorArn;
    /**
     * Template configuration to define the information included in certificates. Define certificate validity and renewal periods, certificate request handling and enrollment options, key usage extensions, application policies, and cryptography settings.
     */
    Definition: TemplateDefinition;
    /**
     * Name of the template. The template name must be unique.
     */
    Name: TemplateName;
    /**
     * Metadata assigned to a template consisting of a key-value pair.
     */
    Tags?: Tags;
  }
  export interface CreateTemplateResponse {
    /**
     * If successful, the Amazon Resource Name (ARN) of the template.
     */
    TemplateArn?: TemplateArn;
  }
  export type CryptoProvidersList = CryptoProvidersListMemberString[];
  export type CryptoProvidersListMemberString = string;
  export type CustomObjectIdentifier = string;
  export interface DeleteConnectorRequest {
    /**
     *  The Amazon Resource Name (ARN) that was returned when you called CreateConnector.
     */
    ConnectorArn: ConnectorArn;
  }
  export interface DeleteDirectoryRegistrationRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateDirectoryRegistration.
     */
    DirectoryRegistrationArn: DirectoryRegistrationArn;
  }
  export interface DeleteServicePrincipalNameRequest {
    /**
     *  The Amazon Resource Name (ARN) that was returned when you called CreateConnector.
     */
    ConnectorArn: ConnectorArn;
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateDirectoryRegistration.
     */
    DirectoryRegistrationArn: DirectoryRegistrationArn;
  }
  export interface DeleteTemplateGroupAccessControlEntryRequest {
    /**
     * Security identifier (SID) of the group object from Active Directory. The SID starts with "S-".
     */
    GroupSecurityIdentifier: GroupSecurityIdentifier;
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateTemplate.
     */
    TemplateArn: TemplateArn;
  }
  export interface DeleteTemplateRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateTemplate.
     */
    TemplateArn: TemplateArn;
  }
  export type DirectoryId = string;
  export interface DirectoryRegistration {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateDirectoryRegistration. 
     */
    Arn?: DirectoryRegistrationArn;
    /**
     * The date and time that the directory registration was created.
     */
    CreatedAt?: Timestamp;
    /**
     * The identifier of the Active Directory.
     */
    DirectoryId?: DirectoryId;
    /**
     * Status of the directory registration.
     */
    Status?: DirectoryRegistrationStatus;
    /**
     * Additional information about the directory registration status if the status is failed.
     */
    StatusReason?: DirectoryRegistrationStatusReason;
    /**
     * The date and time that the directory registration was updated.
     */
    UpdatedAt?: Timestamp;
  }
  export type DirectoryRegistrationArn = string;
  export type DirectoryRegistrationList = DirectoryRegistrationSummary[];
  export type DirectoryRegistrationStatus = "CREATING"|"ACTIVE"|"DELETING"|"FAILED"|string;
  export type DirectoryRegistrationStatusReason = "DIRECTORY_ACCESS_DENIED"|"DIRECTORY_RESOURCE_NOT_FOUND"|"DIRECTORY_NOT_ACTIVE"|"DIRECTORY_NOT_REACHABLE"|"DIRECTORY_TYPE_NOT_SUPPORTED"|"INTERNAL_FAILURE"|string;
  export interface DirectoryRegistrationSummary {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateDirectoryRegistration.
     */
    Arn?: DirectoryRegistrationArn;
    /**
     * The date and time that the directory registration was created.
     */
    CreatedAt?: Timestamp;
    /**
     * The identifier of the Active Directory.
     */
    DirectoryId?: DirectoryId;
    /**
     * Status of the directory registration.
     */
    Status?: DirectoryRegistrationStatus;
    /**
     * Additional information about the directory registration status if the status is failed.
     */
    StatusReason?: DirectoryRegistrationStatusReason;
    /**
     * The date and time that the directory registration was updated.
     */
    UpdatedAt?: Timestamp;
  }
  export type DisplayName = string;
  export interface EnrollmentFlagsV2 {
    /**
     * Allow renewal using the same key.
     */
    EnableKeyReuseOnNtTokenKeysetStorageFull?: Boolean;
    /**
     * Include symmetric algorithms allowed by the subject.
     */
    IncludeSymmetricAlgorithms?: Boolean;
    /**
     * This flag instructs the CA to not include the security extension szOID_NTDS_CA_SECURITY_EXT (OID:1.3.6.1.4.1.311.25.2), as specified in [MS-WCCE] sections 2.2.2.7.7.4 and 3.2.2.6.2.1.4.5.9, in the issued certificate. This addresses a Windows Kerberos elevation-of-privilege vulnerability.
     */
    NoSecurityExtension?: Boolean;
    /**
     * Delete expired or revoked certificates instead of archiving them.
     */
    RemoveInvalidCertificateFromPersonalStore?: Boolean;
    /**
     * Require user interaction when the subject is enrolled and the private key associated with the certificate is used.
     */
    UserInteractionRequired?: Boolean;
  }
  export interface EnrollmentFlagsV3 {
    /**
     * Allow renewal using the same key.
     */
    EnableKeyReuseOnNtTokenKeysetStorageFull?: Boolean;
    /**
     * Include symmetric algorithms allowed by the subject.
     */
    IncludeSymmetricAlgorithms?: Boolean;
    /**
     * This flag instructs the CA to not include the security extension szOID_NTDS_CA_SECURITY_EXT (OID:1.3.6.1.4.1.311.25.2), as specified in [MS-WCCE] sections 2.2.2.7.7.4 and 3.2.2.6.2.1.4.5.9, in the issued certificate. This addresses a Windows Kerberos elevation-of-privilege vulnerability.
     */
    NoSecurityExtension?: Boolean;
    /**
     * Delete expired or revoked certificates instead of archiving them.
     */
    RemoveInvalidCertificateFromPersonalStore?: Boolean;
    /**
     * Require user interaction when the subject is enrolled and the private key associated with the certificate is used.
     */
    UserInteractionRequired?: Boolean;
  }
  export interface EnrollmentFlagsV4 {
    /**
     * Allow renewal using the same key.
     */
    EnableKeyReuseOnNtTokenKeysetStorageFull?: Boolean;
    /**
     * Include symmetric algorithms allowed by the subject.
     */
    IncludeSymmetricAlgorithms?: Boolean;
    /**
     * This flag instructs the CA to not include the security extension szOID_NTDS_CA_SECURITY_EXT (OID:1.3.6.1.4.1.311.25.2), as specified in [MS-WCCE] sections 2.2.2.7.7.4 and 3.2.2.6.2.1.4.5.9, in the issued certificate. This addresses a Windows Kerberos elevation-of-privilege vulnerability.
     */
    NoSecurityExtension?: Boolean;
    /**
     * Delete expired or revoked certificates instead of archiving them.
     */
    RemoveInvalidCertificateFromPersonalStore?: Boolean;
    /**
     * Require user interaction when the subject is enrolled and the private key associated with the certificate is used.
     */
    UserInteractionRequired?: Boolean;
  }
  export interface ExtensionsV2 {
    /**
     * Application policies specify what the certificate is used for and its purpose. 
     */
    ApplicationPolicies?: ApplicationPolicies;
    /**
     * The key usage extension defines the purpose (e.g., encipherment, signature, certificate signing) of the key contained in the certificate.
     */
    KeyUsage: KeyUsage;
  }
  export interface ExtensionsV3 {
    /**
     * Application policies specify what the certificate is used for and its purpose.
     */
    ApplicationPolicies?: ApplicationPolicies;
    /**
     * The key usage extension defines the purpose (e.g., encipherment, signature, certificate signing) of the key contained in the certificate.
     */
    KeyUsage: KeyUsage;
  }
  export interface ExtensionsV4 {
    /**
     * Application policies specify what the certificate is used for and its purpose.
     */
    ApplicationPolicies?: ApplicationPolicies;
    /**
     * The key usage extension defines the purpose (e.g., encipherment, signature) of the key contained in the certificate.
     */
    KeyUsage: KeyUsage;
  }
  export interface GeneralFlagsV2 {
    /**
     * Allows certificate issuance using autoenrollment. Set to TRUE to allow autoenrollment.
     */
    AutoEnrollment?: Boolean;
    /**
     * Defines if the template is for machines or users. Set to TRUE if the template is for machines. Set to FALSE if the template is for users.
     */
    MachineType?: Boolean;
  }
  export interface GeneralFlagsV3 {
    /**
     * Allows certificate issuance using autoenrollment. Set to TRUE to allow autoenrollment.
     */
    AutoEnrollment?: Boolean;
    /**
     * Defines if the template is for machines or users. Set to TRUE if the template is for machines. Set to FALSE if the template is for users
     */
    MachineType?: Boolean;
  }
  export interface GeneralFlagsV4 {
    /**
     * Allows certificate issuance using autoenrollment. Set to TRUE to allow autoenrollment.
     */
    AutoEnrollment?: Boolean;
    /**
     * Defines if the template is for machines or users. Set to TRUE if the template is for machines. Set to FALSE if the template is for users
     */
    MachineType?: Boolean;
  }
  export interface GetConnectorRequest {
    /**
     *  The Amazon Resource Name (ARN) that was returned when you called CreateConnector.
     */
    ConnectorArn: ConnectorArn;
  }
  export interface GetConnectorResponse {
    /**
     * A structure that contains information about your connector.
     */
    Connector?: Connector;
  }
  export interface GetDirectoryRegistrationRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateDirectoryRegistration.
     */
    DirectoryRegistrationArn: DirectoryRegistrationArn;
  }
  export interface GetDirectoryRegistrationResponse {
    /**
     * The directory registration represents the authorization of the connector service with a directory.
     */
    DirectoryRegistration?: DirectoryRegistration;
  }
  export interface GetServicePrincipalNameRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateConnector.
     */
    ConnectorArn: ConnectorArn;
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateDirectoryRegistration.
     */
    DirectoryRegistrationArn: DirectoryRegistrationArn;
  }
  export interface GetServicePrincipalNameResponse {
    /**
     * The service principal name that the connector uses to authenticate with Active Directory.
     */
    ServicePrincipalName?: ServicePrincipalName;
  }
  export interface GetTemplateGroupAccessControlEntryRequest {
    /**
     * Security identifier (SID) of the group object from Active Directory. The SID starts with "S-".
     */
    GroupSecurityIdentifier: GroupSecurityIdentifier;
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateTemplate.
     */
    TemplateArn: TemplateArn;
  }
  export interface GetTemplateGroupAccessControlEntryResponse {
    /**
     * An access control entry allows or denies an Active Directory group from enrolling and/or autoenrolling with a template.
     */
    AccessControlEntry?: AccessControlEntry;
  }
  export interface GetTemplateRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateTemplate.
     */
    TemplateArn: TemplateArn;
  }
  export interface GetTemplateResponse {
    /**
     * A certificate template that the connector uses to issue certificates from a private CA.
     */
    Template?: Template;
  }
  export type GroupSecurityIdentifier = string;
  export type HashAlgorithm = "SHA256"|"SHA384"|"SHA512"|string;
  export type Integer = number;
  export type KeySpec = "KEY_EXCHANGE"|"SIGNATURE"|string;
  export interface KeyUsage {
    /**
     * Sets the key usage extension to critical.
     */
    Critical?: Boolean;
    /**
     * The key usage flags represent the purpose (e.g., encipherment, signature) of the key contained in the certificate.
     */
    UsageFlags: KeyUsageFlags;
  }
  export interface KeyUsageFlags {
    /**
     * DataEncipherment is asserted when the subject public key is used for directly enciphering raw user data without the use of an intermediate symmetric cipher.
     */
    DataEncipherment?: Boolean;
    /**
     * The digitalSignature is asserted when the subject public key is used for verifying digital signatures.
     */
    DigitalSignature?: Boolean;
    /**
     * KeyAgreement is asserted when the subject public key is used for key agreement.
     */
    KeyAgreement?: Boolean;
    /**
     * KeyEncipherment is asserted when the subject public key is used for enciphering private or secret keys, i.e., for key transport.
     */
    KeyEncipherment?: Boolean;
    /**
     * NonRepudiation is asserted when the subject public key is used to verify digital signatures.
     */
    NonRepudiation?: Boolean;
  }
  export interface KeyUsageProperty {
    /**
     * You can specify key usage for encryption, key agreement, and signature. You can use property flags or property type but not both. 
     */
    PropertyFlags?: KeyUsagePropertyFlags;
    /**
     * You can specify all key usages using property type ALL. You can use property type or property flags but not both. 
     */
    PropertyType?: KeyUsagePropertyType;
  }
  export interface KeyUsagePropertyFlags {
    /**
     * Allows key for encryption and decryption.
     */
    Decrypt?: Boolean;
    /**
     * Allows key exchange without encryption.
     */
    KeyAgreement?: Boolean;
    /**
     * Allow key use for digital signature.
     */
    Sign?: Boolean;
  }
  export type KeyUsagePropertyType = "ALL"|string;
  export interface ListConnectorsRequest {
    /**
     * Use this parameter when paginating results to specify the maximum number of items to return in the response on each page. If additional items exist beyond the number you specify, the NextToken element is sent in the response. Use this NextToken value in a subsequent request to retrieve additional items.
     */
    MaxResults?: MaxResults;
    /**
     * Use this parameter when paginating results in a subsequent request after you receive a response with truncated results. Set it to the value of the NextToken parameter from the response you just received.
     */
    NextToken?: NextToken;
  }
  export interface ListConnectorsResponse {
    /**
     * Summary information about each connector you have created.
     */
    Connectors?: ConnectorList;
    /**
     * Use this parameter when paginating results in a subsequent request after you receive a response with truncated results. Set it to the value of the NextToken parameter from the response you just received.
     */
    NextToken?: NextToken;
  }
  export interface ListDirectoryRegistrationsRequest {
    /**
     * Use this parameter when paginating results to specify the maximum number of items to return in the response on each page. If additional items exist beyond the number you specify, the NextToken element is sent in the response. Use this NextToken value in a subsequent request to retrieve additional items.
     */
    MaxResults?: MaxResults;
    /**
     * Use this parameter when paginating results in a subsequent request after you receive a response with truncated results. Set it to the value of the NextToken parameter from the response you just received.
     */
    NextToken?: NextToken;
  }
  export interface ListDirectoryRegistrationsResponse {
    /**
     * Summary information about each directory registration you have created.
     */
    DirectoryRegistrations?: DirectoryRegistrationList;
    /**
     * Use this parameter when paginating results in a subsequent request after you receive a response with truncated results. Set it to the value of the NextToken parameter from the response you just received.
     */
    NextToken?: NextToken;
  }
  export interface ListServicePrincipalNamesRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateDirectoryRegistration.
     */
    DirectoryRegistrationArn: DirectoryRegistrationArn;
    /**
     * Use this parameter when paginating results to specify the maximum number of items to return in the response on each page. If additional items exist beyond the number you specify, the NextToken element is sent in the response. Use this NextToken value in a subsequent request to retrieve additional items.
     */
    MaxResults?: MaxResults;
    /**
     * Use this parameter when paginating results in a subsequent request after you receive a response with truncated results. Set it to the value of the NextToken parameter from the response you just received.
     */
    NextToken?: NextToken;
  }
  export interface ListServicePrincipalNamesResponse {
    /**
     * Use this parameter when paginating results in a subsequent request after you receive a response with truncated results. Set it to the value of the NextToken parameter from the response you just received.
     */
    NextToken?: NextToken;
    /**
     * The service principal name, if any, that the connector uses to authenticate with Active Directory.
     */
    ServicePrincipalNames?: ServicePrincipalNameList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you created the resource. 
     */
    ResourceArn: String;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags, if any, that are associated with your resource.
     */
    Tags?: Tags;
  }
  export interface ListTemplateGroupAccessControlEntriesRequest {
    /**
     * Use this parameter when paginating results to specify the maximum number of items to return in the response on each page. If additional items exist beyond the number you specify, the NextToken element is sent in the response. Use this NextToken value in a subsequent request to retrieve additional items.
     */
    MaxResults?: MaxResults;
    /**
     * Use this parameter when paginating results in a subsequent request after you receive a response with truncated results. Set it to the value of the NextToken parameter from the response you just received.
     */
    NextToken?: NextToken;
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateTemplate.
     */
    TemplateArn: TemplateArn;
  }
  export interface ListTemplateGroupAccessControlEntriesResponse {
    /**
     * An access control entry grants or denies permission to an Active Directory group to enroll certificates for a template.
     */
    AccessControlEntries?: AccessControlEntryList;
    /**
     * Use this parameter when paginating results in a subsequent request after you receive a response with truncated results. Set it to the value of the NextToken parameter from the response you just received.
     */
    NextToken?: NextToken;
  }
  export interface ListTemplatesRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateConnector.
     */
    ConnectorArn: ConnectorArn;
    /**
     * Use this parameter when paginating results to specify the maximum number of items to return in the response on each page. If additional items exist beyond the number you specify, the NextToken element is sent in the response. Use this NextToken value in a subsequent request to retrieve additional items.
     */
    MaxResults?: MaxResults;
    /**
     * Use this parameter when paginating results in a subsequent request after you receive a response with truncated results. Set it to the value of the NextToken parameter from the response you just received.
     */
    NextToken?: NextToken;
  }
  export interface ListTemplatesResponse {
    /**
     * Use this parameter when paginating results in a subsequent request after you receive a response with truncated results. Set it to the value of the NextToken parameter from the response you just received.
     */
    NextToken?: NextToken;
    /**
     * Custom configuration templates used when issuing a certificate. 
     */
    Templates?: TemplateList;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export type PrivateKeyAlgorithm = "RSA"|"ECDH_P256"|"ECDH_P384"|"ECDH_P521"|string;
  export interface PrivateKeyAttributesV2 {
    /**
     * Defines the cryptographic providers used to generate the private key.
     */
    CryptoProviders?: CryptoProvidersList;
    /**
     * Defines the purpose of the private key. Set it to "KEY_EXCHANGE" or "SIGNATURE" value.
     */
    KeySpec: KeySpec;
    /**
     * Set the minimum key length of the private key.
     */
    MinimalKeyLength: PrivateKeyAttributesV2MinimalKeyLengthInteger;
  }
  export type PrivateKeyAttributesV2MinimalKeyLengthInteger = number;
  export interface PrivateKeyAttributesV3 {
    /**
     * Defines the algorithm used to generate the private key.
     */
    Algorithm: PrivateKeyAlgorithm;
    /**
     * Defines the cryptographic providers used to generate the private key.
     */
    CryptoProviders?: CryptoProvidersList;
    /**
     * Defines the purpose of the private key. Set it to "KEY_EXCHANGE" or "SIGNATURE" value.
     */
    KeySpec: KeySpec;
    /**
     * The key usage property defines the purpose of the private key contained in the certificate. You can specify specific purposes using property flags or all by using property type ALL.
     */
    KeyUsageProperty: KeyUsageProperty;
    /**
     * Set the minimum key length of the private key.
     */
    MinimalKeyLength: PrivateKeyAttributesV3MinimalKeyLengthInteger;
  }
  export type PrivateKeyAttributesV3MinimalKeyLengthInteger = number;
  export interface PrivateKeyAttributesV4 {
    /**
     * Defines the algorithm used to generate the private key.
     */
    Algorithm?: PrivateKeyAlgorithm;
    /**
     * Defines the cryptographic providers used to generate the private key.
     */
    CryptoProviders?: CryptoProvidersList;
    /**
     * Defines the purpose of the private key. Set it to "KEY_EXCHANGE" or "SIGNATURE" value.
     */
    KeySpec: KeySpec;
    /**
     * The key usage property defines the purpose of the private key contained in the certificate. You can specify specific purposes using property flags or all by using property type ALL.
     */
    KeyUsageProperty?: KeyUsageProperty;
    /**
     * Set the minimum key length of the private key.
     */
    MinimalKeyLength: PrivateKeyAttributesV4MinimalKeyLengthInteger;
  }
  export type PrivateKeyAttributesV4MinimalKeyLengthInteger = number;
  export interface PrivateKeyFlagsV2 {
    /**
     * Defines the minimum client compatibility.
     */
    ClientVersion: ClientCompatibilityV2;
    /**
     * Allows the private key to be exported.
     */
    ExportableKey?: Boolean;
    /**
     * Require user input when using the private key for enrollment.
     */
    StrongKeyProtectionRequired?: Boolean;
  }
  export interface PrivateKeyFlagsV3 {
    /**
     * Defines the minimum client compatibility.
     */
    ClientVersion: ClientCompatibilityV3;
    /**
     * Allows the private key to be exported.
     */
    ExportableKey?: Boolean;
    /**
     * Reguires the PKCS #1 v2.1 signature format for certificates. You should verify that your CA, objects, and applications can accept this signature format.
     */
    RequireAlternateSignatureAlgorithm?: Boolean;
    /**
     * Requirer user input when using the private key for enrollment.
     */
    StrongKeyProtectionRequired?: Boolean;
  }
  export interface PrivateKeyFlagsV4 {
    /**
     * Defines the minimum client compatibility.
     */
    ClientVersion: ClientCompatibilityV4;
    /**
     * Allows the private key to be exported.
     */
    ExportableKey?: Boolean;
    /**
     * Requires the PKCS #1 v2.1 signature format for certificates. You should verify that your CA, objects, and applications can accept this signature format.
     */
    RequireAlternateSignatureAlgorithm?: Boolean;
    /**
     * Renew certificate using the same private key.
     */
    RequireSameKeyRenewal?: Boolean;
    /**
     * Require user input when using the private key for enrollment.
     */
    StrongKeyProtectionRequired?: Boolean;
    /**
     * Specifies the cryptographic service provider category used to generate private keys. Set to TRUE to use Legacy Cryptographic Service Providers and FALSE to use Key Storage Providers.
     */
    UseLegacyProvider?: Boolean;
  }
  export type SecurityGroupId = string;
  export type SecurityGroupIdList = SecurityGroupId[];
  export interface ServicePrincipalName {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateConnector.html.
     */
    ConnectorArn?: ConnectorArn;
    /**
     * The date and time that the service principal name was created.
     */
    CreatedAt?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateDirectoryRegistration.
     */
    DirectoryRegistrationArn?: DirectoryRegistrationArn;
    /**
     * The status of a service principal name.
     */
    Status?: ServicePrincipalNameStatus;
    /**
     * Additional information for the status of a service principal name if the status is failed.
     */
    StatusReason?: ServicePrincipalNameStatusReason;
    /**
     * The date and time that the service principal name was updated.
     */
    UpdatedAt?: Timestamp;
  }
  export type ServicePrincipalNameList = ServicePrincipalNameSummary[];
  export type ServicePrincipalNameStatus = "CREATING"|"ACTIVE"|"DELETING"|"FAILED"|string;
  export type ServicePrincipalNameStatusReason = "DIRECTORY_ACCESS_DENIED"|"DIRECTORY_NOT_REACHABLE"|"DIRECTORY_RESOURCE_NOT_FOUND"|"SPN_EXISTS_ON_DIFFERENT_AD_OBJECT"|"INTERNAL_FAILURE"|string;
  export interface ServicePrincipalNameSummary {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateConnector.
     */
    ConnectorArn?: ConnectorArn;
    /**
     * The date and time that the service principal name was created.
     */
    CreatedAt?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateDirectoryRegistration.
     */
    DirectoryRegistrationArn?: DirectoryRegistrationArn;
    /**
     * The status of a service principal name.
     */
    Status?: ServicePrincipalNameStatus;
    /**
     * Additional information for the status of a service principal name if the status is failed.
     */
    StatusReason?: ServicePrincipalNameStatusReason;
    /**
     * Time when the service principal name was updated.
     */
    UpdatedAt?: Timestamp;
  }
  export type String = string;
  export interface SubjectNameFlagsV2 {
    /**
     * Include the common name in the subject name.
     */
    RequireCommonName?: Boolean;
    /**
     * Include the directory path in the subject name.
     */
    RequireDirectoryPath?: Boolean;
    /**
     * Include the DNS as common name in the subject name.
     */
    RequireDnsAsCn?: Boolean;
    /**
     * Include the subject's email in the subject name.
     */
    RequireEmail?: Boolean;
    /**
     * Include the globally unique identifier (GUID) in the subject alternate name.
     */
    SanRequireDirectoryGuid?: Boolean;
    /**
     * Include the DNS in the subject alternate name.
     */
    SanRequireDns?: Boolean;
    /**
     * Include the domain DNS in the subject alternate name.
     */
    SanRequireDomainDns?: Boolean;
    /**
     * Include the subject's email in the subject alternate name.
     */
    SanRequireEmail?: Boolean;
    /**
     * Include the service principal name (SPN) in the subject alternate name.
     */
    SanRequireSpn?: Boolean;
    /**
     * Include the user principal name (UPN) in the subject alternate name.
     */
    SanRequireUpn?: Boolean;
  }
  export interface SubjectNameFlagsV3 {
    /**
     * Include the common name in the subject name. 
     */
    RequireCommonName?: Boolean;
    /**
     * Include the directory path in the subject name.
     */
    RequireDirectoryPath?: Boolean;
    /**
     * Include the DNS as common name in the subject name.
     */
    RequireDnsAsCn?: Boolean;
    /**
     * Include the subject's email in the subject name.
     */
    RequireEmail?: Boolean;
    /**
     * Include the globally unique identifier (GUID) in the subject alternate name.
     */
    SanRequireDirectoryGuid?: Boolean;
    /**
     * Include the DNS in the subject alternate name.
     */
    SanRequireDns?: Boolean;
    /**
     * Include the domain DNS in the subject alternate name.
     */
    SanRequireDomainDns?: Boolean;
    /**
     * Include the subject's email in the subject alternate name.
     */
    SanRequireEmail?: Boolean;
    /**
     * Include the service principal name (SPN) in the subject alternate name.
     */
    SanRequireSpn?: Boolean;
    /**
     * Include the user principal name (UPN) in the subject alternate name.
     */
    SanRequireUpn?: Boolean;
  }
  export interface SubjectNameFlagsV4 {
    /**
     * Include the common name in the subject name.
     */
    RequireCommonName?: Boolean;
    /**
     * Include the directory path in the subject name.
     */
    RequireDirectoryPath?: Boolean;
    /**
     * Include the DNS as common name in the subject name.
     */
    RequireDnsAsCn?: Boolean;
    /**
     * Include the subject's email in the subject name.
     */
    RequireEmail?: Boolean;
    /**
     * Include the globally unique identifier (GUID) in the subject alternate name.
     */
    SanRequireDirectoryGuid?: Boolean;
    /**
     * Include the DNS in the subject alternate name.
     */
    SanRequireDns?: Boolean;
    /**
     * Include the domain DNS in the subject alternate name.
     */
    SanRequireDomainDns?: Boolean;
    /**
     * Include the subject's email in the subject alternate name.
     */
    SanRequireEmail?: Boolean;
    /**
     * Include the service principal name (SPN) in the subject alternate name.
     */
    SanRequireSpn?: Boolean;
    /**
     * Include the user principal name (UPN) in the subject alternate name.
     */
    SanRequireUpn?: Boolean;
  }
  export type TagKeyList = String[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you created the resource. 
     */
    ResourceArn: String;
    /**
     * Metadata assigned to a directory registration consisting of a key-value pair.
     */
    Tags: Tags;
  }
  export type Tags = {[key: string]: String};
  export interface Template {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateTemplate.
     */
    Arn?: TemplateArn;
    /**
     *  The Amazon Resource Name (ARN) that was returned when you called CreateConnector.
     */
    ConnectorArn?: ConnectorArn;
    /**
     * The date and time that the template was created.
     */
    CreatedAt?: Timestamp;
    /**
     * Template configuration to define the information included in certificates. Define certificate validity and renewal periods, certificate request handling and enrollment options, key usage extensions, application policies, and cryptography settings.
     */
    Definition?: TemplateDefinition;
    /**
     * Name of the templates. Template names must be unique.
     */
    Name?: TemplateName;
    /**
     * Object identifier of a template.
     */
    ObjectIdentifier?: CustomObjectIdentifier;
    /**
     * The template schema version. Template schema versions can be v2, v3, or v4. The template configuration options change based on the template schema version.
     */
    PolicySchema?: Integer;
    /**
     * The version of the template. Template updates will increment the minor revision. Re-enrolling all certificate holders will increment the major revision.
     */
    Revision?: TemplateRevision;
    /**
     * Status of the template. Status can be creating, active, deleting, or failed.
     */
    Status?: TemplateStatus;
    /**
     * The date and time that the template was updated.
     */
    UpdatedAt?: Timestamp;
  }
  export type TemplateArn = string;
  export interface TemplateDefinition {
    /**
     * Template configuration to define the information included in certificates. Define certificate validity and renewal periods, certificate request handling and enrollment options, key usage extensions, application policies, and cryptography settings.
     */
    TemplateV2?: TemplateV2;
    /**
     * Template configuration to define the information included in certificates. Define certificate validity and renewal periods, certificate request handling and enrollment options, key usage extensions, application policies, and cryptography settings.
     */
    TemplateV3?: TemplateV3;
    /**
     * Template configuration to define the information included in certificates. Define certificate validity and renewal periods, certificate request handling and enrollment options, key usage extensions, application policies, and cryptography settings.
     */
    TemplateV4?: TemplateV4;
  }
  export type TemplateList = TemplateSummary[];
  export type TemplateName = string;
  export type TemplateNameList = TemplateName[];
  export interface TemplateRevision {
    /**
     * The revision version of the template. Re-enrolling all certificate holders will increment the major revision.
     */
    MajorRevision: Integer;
    /**
     * The revision version of the template. Re-enrolling all certificate holders will increment the major revision.
     */
    MinorRevision: Integer;
  }
  export type TemplateStatus = "ACTIVE"|"DELETING"|string;
  export interface TemplateSummary {
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateTemplate.
     */
    Arn?: TemplateArn;
    /**
     *  The Amazon Resource Name (ARN) that was returned when you called CreateConnector.
     */
    ConnectorArn?: ConnectorArn;
    /**
     * The date and time that the template was created.
     */
    CreatedAt?: Timestamp;
    /**
     * Template configuration to define the information included in certificates. Define certificate validity and renewal periods, certificate request handling and enrollment options, key usage extensions, application policies, and cryptography settings.
     */
    Definition?: TemplateDefinition;
    /**
     * Name of the template. The template name must be unique.
     */
    Name?: TemplateName;
    /**
     * Object identifier of a template.
     */
    ObjectIdentifier?: CustomObjectIdentifier;
    /**
     * The template schema version. Template schema versions can be v2, v3, or v4. The template configuration options change based on the template schema version.
     */
    PolicySchema?: Integer;
    /**
     * The revision version of the template. Template updates will increment the minor revision. Re-enrolling all certificate holders will increment the major revision.
     */
    Revision?: TemplateRevision;
    /**
     * Status of the template. Status can be creating, active, deleting, or failed.
     */
    Status?: TemplateStatus;
    /**
     * The date and time that the template was updated.
     */
    UpdatedAt?: Timestamp;
  }
  export interface TemplateV2 {
    /**
     * Certificate validity describes the validity and renewal periods of a certificate.
     */
    CertificateValidity: CertificateValidity;
    /**
     * Enrollment flags describe the enrollment settings for certificates such as using the existing private key and deleting expired or revoked certificates.
     */
    EnrollmentFlags: EnrollmentFlagsV2;
    /**
     * Extensions describe the key usage extensions and application policies for a template.
     */
    Extensions: ExtensionsV2;
    /**
     * General flags describe whether the template is used for computers or users and if the template can be used with autoenrollment.
     */
    GeneralFlags: GeneralFlagsV2;
    /**
     * Private key attributes allow you to specify the minimal key length, key spec, and cryptographic providers for the private key of a certificate for v2 templates. V2 templates allow you to use Legacy Cryptographic Service Providers.
     */
    PrivateKeyAttributes: PrivateKeyAttributesV2;
    /**
     * Private key flags for v2 templates specify the client compatibility, if the private key can be exported, and if user input is required when using a private key. 
     */
    PrivateKeyFlags: PrivateKeyFlagsV2;
    /**
     * Subject name flags describe the subject name and subject alternate name that is included in a certificate.
     */
    SubjectNameFlags: SubjectNameFlagsV2;
    /**
     * List of templates in Active Directory that are superseded by this template.
     */
    SupersededTemplates?: TemplateNameList;
  }
  export interface TemplateV3 {
    /**
     * Certificate validity describes the validity and renewal periods of a certificate.
     */
    CertificateValidity: CertificateValidity;
    /**
     * Enrollment flags describe the enrollment settings for certificates such as using the existing private key and deleting expired or revoked certificates.
     */
    EnrollmentFlags: EnrollmentFlagsV3;
    /**
     * Extensions describe the key usage extensions and application policies for a template.
     */
    Extensions: ExtensionsV3;
    /**
     * General flags describe whether the template is used for computers or users and if the template can be used with autoenrollment.
     */
    GeneralFlags: GeneralFlagsV3;
    /**
     * Specifies the hash algorithm used to hash the private key.
     */
    HashAlgorithm: HashAlgorithm;
    /**
     * Private key attributes allow you to specify the algorithm, minimal key length, key spec, key usage, and cryptographic providers for the private key of a certificate for v3 templates. V3 templates allow you to use Key Storage Providers.
     */
    PrivateKeyAttributes: PrivateKeyAttributesV3;
    /**
     * Private key flags for v3 templates specify the client compatibility, if the private key can be exported, if user input is required when using a private key, and if an alternate signature algorithm should be used.
     */
    PrivateKeyFlags: PrivateKeyFlagsV3;
    /**
     * Subject name flags describe the subject name and subject alternate name that is included in a certificate.
     */
    SubjectNameFlags: SubjectNameFlagsV3;
    /**
     * List of templates in Active Directory that are superseded by this template.
     */
    SupersededTemplates?: TemplateNameList;
  }
  export interface TemplateV4 {
    /**
     * Certificate validity describes the validity and renewal periods of a certificate.
     */
    CertificateValidity: CertificateValidity;
    /**
     * Enrollment flags describe the enrollment settings for certificates using the existing private key and deleting expired or revoked certificates.
     */
    EnrollmentFlags: EnrollmentFlagsV4;
    /**
     * Extensions describe the key usage extensions and application policies for a template.
     */
    Extensions: ExtensionsV4;
    /**
     * General flags describe whether the template is used for computers or users and if the template can be used with autoenrollment.
     */
    GeneralFlags: GeneralFlagsV4;
    /**
     * Specifies the hash algorithm used to hash the private key. Hash algorithm can only be specified when using Key Storage Providers.
     */
    HashAlgorithm?: HashAlgorithm;
    /**
     * Private key attributes allow you to specify the minimal key length, key spec, key usage, and cryptographic providers for the private key of a certificate for v4 templates. V4 templates allow you to use either Key Storage Providers or Legacy Cryptographic Service Providers. You specify the cryptography provider category in private key flags.
     */
    PrivateKeyAttributes: PrivateKeyAttributesV4;
    /**
     * Private key flags for v4 templates specify the client compatibility, if the private key can be exported, if user input is required when using a private key, if an alternate signature algorithm should be used, and if certificates are renewed using the same private key.
     */
    PrivateKeyFlags: PrivateKeyFlagsV4;
    /**
     * Subject name flags describe the subject name and subject alternate name that is included in a certificate.
     */
    SubjectNameFlags: SubjectNameFlagsV4;
    /**
     * List of templates in Active Directory that are superseded by this template.
     */
    SupersededTemplates?: TemplateNameList;
  }
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that was returned when you created the resource.
     */
    ResourceArn: String;
    /**
     * Specifies a list of tag keys that you want to remove from the specified resources.
     */
    TagKeys: TagKeyList;
  }
  export interface UpdateTemplateGroupAccessControlEntryRequest {
    /**
     * Allow or deny permissions for an Active Directory group to enroll or autoenroll certificates for a template.
     */
    AccessRights?: AccessRights;
    /**
     * Name of the Active Directory group. This name does not need to match the group name in Active Directory.
     */
    GroupDisplayName?: DisplayName;
    /**
     * Security identifier (SID) of the group object from Active Directory. The SID starts with "S-".
     */
    GroupSecurityIdentifier: GroupSecurityIdentifier;
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateTemplate.
     */
    TemplateArn: TemplateArn;
  }
  export interface UpdateTemplateRequest {
    /**
     * Template configuration to define the information included in certificates. Define certificate validity and renewal periods, certificate request handling and enrollment options, key usage extensions, application policies, and cryptography settings.
     */
    Definition?: TemplateDefinition;
    /**
     * This setting allows the major version of a template to be increased automatically. All members of Active Directory groups that are allowed to enroll with a template will receive a new certificate issued using that template.
     */
    ReenrollAllCertificateHolders?: Boolean;
    /**
     * The Amazon Resource Name (ARN) that was returned when you called CreateTemplate.
     */
    TemplateArn: TemplateArn;
  }
  export interface ValidityPeriod {
    /**
     * The numeric value for the validity period.
     */
    Period: ValidityPeriodPeriodLong;
    /**
     * The unit of time. You can select hours, days, weeks, months, and years.
     */
    PeriodType: ValidityPeriodType;
  }
  export type ValidityPeriodPeriodLong = number;
  export type ValidityPeriodType = "HOURS"|"DAYS"|"WEEKS"|"MONTHS"|"YEARS"|string;
  export interface VpcInformation {
    /**
     * The security groups used with the connector. You can use a maximum of 4 security groups with a connector.
     */
    SecurityGroupIds: SecurityGroupIdList;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-05-10"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the PcaConnectorAd client.
   */
  export import Types = PcaConnectorAd;
}
export = PcaConnectorAd;
