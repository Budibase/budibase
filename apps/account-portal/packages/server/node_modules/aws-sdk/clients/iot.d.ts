import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Iot extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Iot.Types.ClientConfiguration)
  config: Config & Iot.Types.ClientConfiguration;
  /**
   * Accepts a pending certificate transfer. The default state of the certificate is INACTIVE. To check for pending certificate transfers, call ListCertificates to enumerate your certificates. Requires permission to access the AcceptCertificateTransfer action.
   */
  acceptCertificateTransfer(params: Iot.Types.AcceptCertificateTransferRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Accepts a pending certificate transfer. The default state of the certificate is INACTIVE. To check for pending certificate transfers, call ListCertificates to enumerate your certificates. Requires permission to access the AcceptCertificateTransfer action.
   */
  acceptCertificateTransfer(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds a thing to a billing group. Requires permission to access the AddThingToBillingGroup action.
   */
  addThingToBillingGroup(params: Iot.Types.AddThingToBillingGroupRequest, callback?: (err: AWSError, data: Iot.Types.AddThingToBillingGroupResponse) => void): Request<Iot.Types.AddThingToBillingGroupResponse, AWSError>;
  /**
   * Adds a thing to a billing group. Requires permission to access the AddThingToBillingGroup action.
   */
  addThingToBillingGroup(callback?: (err: AWSError, data: Iot.Types.AddThingToBillingGroupResponse) => void): Request<Iot.Types.AddThingToBillingGroupResponse, AWSError>;
  /**
   * Adds a thing to a thing group. Requires permission to access the AddThingToThingGroup action.
   */
  addThingToThingGroup(params: Iot.Types.AddThingToThingGroupRequest, callback?: (err: AWSError, data: Iot.Types.AddThingToThingGroupResponse) => void): Request<Iot.Types.AddThingToThingGroupResponse, AWSError>;
  /**
   * Adds a thing to a thing group. Requires permission to access the AddThingToThingGroup action.
   */
  addThingToThingGroup(callback?: (err: AWSError, data: Iot.Types.AddThingToThingGroupResponse) => void): Request<Iot.Types.AddThingToThingGroupResponse, AWSError>;
  /**
   * Associates a group with a continuous job. The following criteria must be met:    The job must have been created with the targetSelection field set to "CONTINUOUS".   The job status must currently be "IN_PROGRESS".   The total number of targets associated with a job must not exceed 100.   Requires permission to access the AssociateTargetsWithJob action.
   */
  associateTargetsWithJob(params: Iot.Types.AssociateTargetsWithJobRequest, callback?: (err: AWSError, data: Iot.Types.AssociateTargetsWithJobResponse) => void): Request<Iot.Types.AssociateTargetsWithJobResponse, AWSError>;
  /**
   * Associates a group with a continuous job. The following criteria must be met:    The job must have been created with the targetSelection field set to "CONTINUOUS".   The job status must currently be "IN_PROGRESS".   The total number of targets associated with a job must not exceed 100.   Requires permission to access the AssociateTargetsWithJob action.
   */
  associateTargetsWithJob(callback?: (err: AWSError, data: Iot.Types.AssociateTargetsWithJobResponse) => void): Request<Iot.Types.AssociateTargetsWithJobResponse, AWSError>;
  /**
   * Attaches the specified policy to the specified principal (certificate or other credential). Requires permission to access the AttachPolicy action.
   */
  attachPolicy(params: Iot.Types.AttachPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches the specified policy to the specified principal (certificate or other credential). Requires permission to access the AttachPolicy action.
   */
  attachPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches the specified policy to the specified principal (certificate or other credential).  Note: This action is deprecated and works as expected for backward compatibility, but we won't add enhancements. Use AttachPolicy instead. Requires permission to access the AttachPrincipalPolicy action.
   */
  attachPrincipalPolicy(params: Iot.Types.AttachPrincipalPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches the specified policy to the specified principal (certificate or other credential).  Note: This action is deprecated and works as expected for backward compatibility, but we won't add enhancements. Use AttachPolicy instead. Requires permission to access the AttachPrincipalPolicy action.
   */
  attachPrincipalPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates a Device Defender security profile with a thing group or this account. Each thing group or account can have up to five security profiles associated with it. Requires permission to access the AttachSecurityProfile action.
   */
  attachSecurityProfile(params: Iot.Types.AttachSecurityProfileRequest, callback?: (err: AWSError, data: Iot.Types.AttachSecurityProfileResponse) => void): Request<Iot.Types.AttachSecurityProfileResponse, AWSError>;
  /**
   * Associates a Device Defender security profile with a thing group or this account. Each thing group or account can have up to five security profiles associated with it. Requires permission to access the AttachSecurityProfile action.
   */
  attachSecurityProfile(callback?: (err: AWSError, data: Iot.Types.AttachSecurityProfileResponse) => void): Request<Iot.Types.AttachSecurityProfileResponse, AWSError>;
  /**
   * Attaches the specified principal to the specified thing. A principal can be X.509 certificates, Amazon Cognito identities or federated identities. Requires permission to access the AttachThingPrincipal action.
   */
  attachThingPrincipal(params: Iot.Types.AttachThingPrincipalRequest, callback?: (err: AWSError, data: Iot.Types.AttachThingPrincipalResponse) => void): Request<Iot.Types.AttachThingPrincipalResponse, AWSError>;
  /**
   * Attaches the specified principal to the specified thing. A principal can be X.509 certificates, Amazon Cognito identities or federated identities. Requires permission to access the AttachThingPrincipal action.
   */
  attachThingPrincipal(callback?: (err: AWSError, data: Iot.Types.AttachThingPrincipalResponse) => void): Request<Iot.Types.AttachThingPrincipalResponse, AWSError>;
  /**
   * Cancels a mitigation action task that is in progress. If the task is not in progress, an InvalidRequestException occurs. Requires permission to access the CancelAuditMitigationActionsTask action.
   */
  cancelAuditMitigationActionsTask(params: Iot.Types.CancelAuditMitigationActionsTaskRequest, callback?: (err: AWSError, data: Iot.Types.CancelAuditMitigationActionsTaskResponse) => void): Request<Iot.Types.CancelAuditMitigationActionsTaskResponse, AWSError>;
  /**
   * Cancels a mitigation action task that is in progress. If the task is not in progress, an InvalidRequestException occurs. Requires permission to access the CancelAuditMitigationActionsTask action.
   */
  cancelAuditMitigationActionsTask(callback?: (err: AWSError, data: Iot.Types.CancelAuditMitigationActionsTaskResponse) => void): Request<Iot.Types.CancelAuditMitigationActionsTaskResponse, AWSError>;
  /**
   * Cancels an audit that is in progress. The audit can be either scheduled or on demand. If the audit isn't in progress, an "InvalidRequestException" occurs. Requires permission to access the CancelAuditTask action.
   */
  cancelAuditTask(params: Iot.Types.CancelAuditTaskRequest, callback?: (err: AWSError, data: Iot.Types.CancelAuditTaskResponse) => void): Request<Iot.Types.CancelAuditTaskResponse, AWSError>;
  /**
   * Cancels an audit that is in progress. The audit can be either scheduled or on demand. If the audit isn't in progress, an "InvalidRequestException" occurs. Requires permission to access the CancelAuditTask action.
   */
  cancelAuditTask(callback?: (err: AWSError, data: Iot.Types.CancelAuditTaskResponse) => void): Request<Iot.Types.CancelAuditTaskResponse, AWSError>;
  /**
   * Cancels a pending transfer for the specified certificate.  Note Only the transfer source account can use this operation to cancel a transfer. (Transfer destinations can use RejectCertificateTransfer instead.) After transfer, IoT returns the certificate to the source account in the INACTIVE state. After the destination account has accepted the transfer, the transfer cannot be cancelled. After a certificate transfer is cancelled, the status of the certificate changes from PENDING_TRANSFER to INACTIVE. Requires permission to access the CancelCertificateTransfer action.
   */
  cancelCertificateTransfer(params: Iot.Types.CancelCertificateTransferRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Cancels a pending transfer for the specified certificate.  Note Only the transfer source account can use this operation to cancel a transfer. (Transfer destinations can use RejectCertificateTransfer instead.) After transfer, IoT returns the certificate to the source account in the INACTIVE state. After the destination account has accepted the transfer, the transfer cannot be cancelled. After a certificate transfer is cancelled, the status of the certificate changes from PENDING_TRANSFER to INACTIVE. Requires permission to access the CancelCertificateTransfer action.
   */
  cancelCertificateTransfer(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Cancels a Device Defender ML Detect mitigation action.  Requires permission to access the CancelDetectMitigationActionsTask action.
   */
  cancelDetectMitigationActionsTask(params: Iot.Types.CancelDetectMitigationActionsTaskRequest, callback?: (err: AWSError, data: Iot.Types.CancelDetectMitigationActionsTaskResponse) => void): Request<Iot.Types.CancelDetectMitigationActionsTaskResponse, AWSError>;
  /**
   *  Cancels a Device Defender ML Detect mitigation action.  Requires permission to access the CancelDetectMitigationActionsTask action.
   */
  cancelDetectMitigationActionsTask(callback?: (err: AWSError, data: Iot.Types.CancelDetectMitigationActionsTaskResponse) => void): Request<Iot.Types.CancelDetectMitigationActionsTaskResponse, AWSError>;
  /**
   * Cancels a job. Requires permission to access the CancelJob action.
   */
  cancelJob(params: Iot.Types.CancelJobRequest, callback?: (err: AWSError, data: Iot.Types.CancelJobResponse) => void): Request<Iot.Types.CancelJobResponse, AWSError>;
  /**
   * Cancels a job. Requires permission to access the CancelJob action.
   */
  cancelJob(callback?: (err: AWSError, data: Iot.Types.CancelJobResponse) => void): Request<Iot.Types.CancelJobResponse, AWSError>;
  /**
   * Cancels the execution of a job for a given thing. Requires permission to access the CancelJobExecution action.
   */
  cancelJobExecution(params: Iot.Types.CancelJobExecutionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Cancels the execution of a job for a given thing. Requires permission to access the CancelJobExecution action.
   */
  cancelJobExecution(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Clears the default authorizer. Requires permission to access the ClearDefaultAuthorizer action.
   */
  clearDefaultAuthorizer(params: Iot.Types.ClearDefaultAuthorizerRequest, callback?: (err: AWSError, data: Iot.Types.ClearDefaultAuthorizerResponse) => void): Request<Iot.Types.ClearDefaultAuthorizerResponse, AWSError>;
  /**
   * Clears the default authorizer. Requires permission to access the ClearDefaultAuthorizer action.
   */
  clearDefaultAuthorizer(callback?: (err: AWSError, data: Iot.Types.ClearDefaultAuthorizerResponse) => void): Request<Iot.Types.ClearDefaultAuthorizerResponse, AWSError>;
  /**
   * Confirms a topic rule destination. When you create a rule requiring a destination, IoT sends a confirmation message to the endpoint or base address you specify. The message includes a token which you pass back when calling ConfirmTopicRuleDestination to confirm that you own or have access to the endpoint. Requires permission to access the ConfirmTopicRuleDestination action.
   */
  confirmTopicRuleDestination(params: Iot.Types.ConfirmTopicRuleDestinationRequest, callback?: (err: AWSError, data: Iot.Types.ConfirmTopicRuleDestinationResponse) => void): Request<Iot.Types.ConfirmTopicRuleDestinationResponse, AWSError>;
  /**
   * Confirms a topic rule destination. When you create a rule requiring a destination, IoT sends a confirmation message to the endpoint or base address you specify. The message includes a token which you pass back when calling ConfirmTopicRuleDestination to confirm that you own or have access to the endpoint. Requires permission to access the ConfirmTopicRuleDestination action.
   */
  confirmTopicRuleDestination(callback?: (err: AWSError, data: Iot.Types.ConfirmTopicRuleDestinationResponse) => void): Request<Iot.Types.ConfirmTopicRuleDestinationResponse, AWSError>;
  /**
   *  Creates a Device Defender audit suppression.  Requires permission to access the CreateAuditSuppression action.
   */
  createAuditSuppression(params: Iot.Types.CreateAuditSuppressionRequest, callback?: (err: AWSError, data: Iot.Types.CreateAuditSuppressionResponse) => void): Request<Iot.Types.CreateAuditSuppressionResponse, AWSError>;
  /**
   *  Creates a Device Defender audit suppression.  Requires permission to access the CreateAuditSuppression action.
   */
  createAuditSuppression(callback?: (err: AWSError, data: Iot.Types.CreateAuditSuppressionResponse) => void): Request<Iot.Types.CreateAuditSuppressionResponse, AWSError>;
  /**
   * Creates an authorizer. Requires permission to access the CreateAuthorizer action.
   */
  createAuthorizer(params: Iot.Types.CreateAuthorizerRequest, callback?: (err: AWSError, data: Iot.Types.CreateAuthorizerResponse) => void): Request<Iot.Types.CreateAuthorizerResponse, AWSError>;
  /**
   * Creates an authorizer. Requires permission to access the CreateAuthorizer action.
   */
  createAuthorizer(callback?: (err: AWSError, data: Iot.Types.CreateAuthorizerResponse) => void): Request<Iot.Types.CreateAuthorizerResponse, AWSError>;
  /**
   * Creates a billing group. Requires permission to access the CreateBillingGroup action.
   */
  createBillingGroup(params: Iot.Types.CreateBillingGroupRequest, callback?: (err: AWSError, data: Iot.Types.CreateBillingGroupResponse) => void): Request<Iot.Types.CreateBillingGroupResponse, AWSError>;
  /**
   * Creates a billing group. Requires permission to access the CreateBillingGroup action.
   */
  createBillingGroup(callback?: (err: AWSError, data: Iot.Types.CreateBillingGroupResponse) => void): Request<Iot.Types.CreateBillingGroupResponse, AWSError>;
  /**
   * Creates an X.509 certificate using the specified certificate signing request.  Requires permission to access the CreateCertificateFromCsr action.   The CSR must include a public key that is either an RSA key with a length of at least 2048 bits or an ECC key from NIST P-256, NIST P-384, or NIST P-521 curves. For supported certificates, consult  Certificate signing algorithms supported by IoT.    Reusing the same certificate signing request (CSR) results in a distinct certificate.  You can create multiple certificates in a batch by creating a directory, copying multiple .csr files into that directory, and then specifying that directory on the command line. The following commands show how to create a batch of certificates given a batch of CSRs. In the following commands, we assume that a set of CSRs are located inside of the directory my-csr-directory: On Linux and OS X, the command is:   $ ls my-csr-directory/ | xargs -I {} aws iot create-certificate-from-csr --certificate-signing-request file://my-csr-directory/{}  This command lists all of the CSRs in my-csr-directory and pipes each CSR file name to the aws iot create-certificate-from-csr Amazon Web Services CLI command to create a certificate for the corresponding CSR.  You can also run the aws iot create-certificate-from-csr part of the command in parallel to speed up the certificate creation process:  $ ls my-csr-directory/ | xargs -P 10 -I {} aws iot create-certificate-from-csr --certificate-signing-request file://my-csr-directory/{}   On Windows PowerShell, the command to create certificates for all CSRs in my-csr-directory is:  &gt; ls -Name my-csr-directory | %{aws iot create-certificate-from-csr --certificate-signing-request file://my-csr-directory/$_}   On a Windows command prompt, the command to create certificates for all CSRs in my-csr-directory is:  &gt; forfiles /p my-csr-directory /c "cmd /c aws iot create-certificate-from-csr --certificate-signing-request file://@path"  
   */
  createCertificateFromCsr(params: Iot.Types.CreateCertificateFromCsrRequest, callback?: (err: AWSError, data: Iot.Types.CreateCertificateFromCsrResponse) => void): Request<Iot.Types.CreateCertificateFromCsrResponse, AWSError>;
  /**
   * Creates an X.509 certificate using the specified certificate signing request.  Requires permission to access the CreateCertificateFromCsr action.   The CSR must include a public key that is either an RSA key with a length of at least 2048 bits or an ECC key from NIST P-256, NIST P-384, or NIST P-521 curves. For supported certificates, consult  Certificate signing algorithms supported by IoT.    Reusing the same certificate signing request (CSR) results in a distinct certificate.  You can create multiple certificates in a batch by creating a directory, copying multiple .csr files into that directory, and then specifying that directory on the command line. The following commands show how to create a batch of certificates given a batch of CSRs. In the following commands, we assume that a set of CSRs are located inside of the directory my-csr-directory: On Linux and OS X, the command is:   $ ls my-csr-directory/ | xargs -I {} aws iot create-certificate-from-csr --certificate-signing-request file://my-csr-directory/{}  This command lists all of the CSRs in my-csr-directory and pipes each CSR file name to the aws iot create-certificate-from-csr Amazon Web Services CLI command to create a certificate for the corresponding CSR.  You can also run the aws iot create-certificate-from-csr part of the command in parallel to speed up the certificate creation process:  $ ls my-csr-directory/ | xargs -P 10 -I {} aws iot create-certificate-from-csr --certificate-signing-request file://my-csr-directory/{}   On Windows PowerShell, the command to create certificates for all CSRs in my-csr-directory is:  &gt; ls -Name my-csr-directory | %{aws iot create-certificate-from-csr --certificate-signing-request file://my-csr-directory/$_}   On a Windows command prompt, the command to create certificates for all CSRs in my-csr-directory is:  &gt; forfiles /p my-csr-directory /c "cmd /c aws iot create-certificate-from-csr --certificate-signing-request file://@path"  
   */
  createCertificateFromCsr(callback?: (err: AWSError, data: Iot.Types.CreateCertificateFromCsrResponse) => void): Request<Iot.Types.CreateCertificateFromCsrResponse, AWSError>;
  /**
   *  Use this API to define a Custom Metric published by your devices to Device Defender.  Requires permission to access the CreateCustomMetric action.
   */
  createCustomMetric(params: Iot.Types.CreateCustomMetricRequest, callback?: (err: AWSError, data: Iot.Types.CreateCustomMetricResponse) => void): Request<Iot.Types.CreateCustomMetricResponse, AWSError>;
  /**
   *  Use this API to define a Custom Metric published by your devices to Device Defender.  Requires permission to access the CreateCustomMetric action.
   */
  createCustomMetric(callback?: (err: AWSError, data: Iot.Types.CreateCustomMetricResponse) => void): Request<Iot.Types.CreateCustomMetricResponse, AWSError>;
  /**
   * Create a dimension that you can use to limit the scope of a metric used in a security profile for IoT Device Defender. For example, using a TOPIC_FILTER dimension, you can narrow down the scope of the metric only to MQTT topics whose name match the pattern specified in the dimension. Requires permission to access the CreateDimension action.
   */
  createDimension(params: Iot.Types.CreateDimensionRequest, callback?: (err: AWSError, data: Iot.Types.CreateDimensionResponse) => void): Request<Iot.Types.CreateDimensionResponse, AWSError>;
  /**
   * Create a dimension that you can use to limit the scope of a metric used in a security profile for IoT Device Defender. For example, using a TOPIC_FILTER dimension, you can narrow down the scope of the metric only to MQTT topics whose name match the pattern specified in the dimension. Requires permission to access the CreateDimension action.
   */
  createDimension(callback?: (err: AWSError, data: Iot.Types.CreateDimensionResponse) => void): Request<Iot.Types.CreateDimensionResponse, AWSError>;
  /**
   * Creates a domain configuration. Requires permission to access the CreateDomainConfiguration action.
   */
  createDomainConfiguration(params: Iot.Types.CreateDomainConfigurationRequest, callback?: (err: AWSError, data: Iot.Types.CreateDomainConfigurationResponse) => void): Request<Iot.Types.CreateDomainConfigurationResponse, AWSError>;
  /**
   * Creates a domain configuration. Requires permission to access the CreateDomainConfiguration action.
   */
  createDomainConfiguration(callback?: (err: AWSError, data: Iot.Types.CreateDomainConfigurationResponse) => void): Request<Iot.Types.CreateDomainConfigurationResponse, AWSError>;
  /**
   * Creates a dynamic thing group. Requires permission to access the CreateDynamicThingGroup action.
   */
  createDynamicThingGroup(params: Iot.Types.CreateDynamicThingGroupRequest, callback?: (err: AWSError, data: Iot.Types.CreateDynamicThingGroupResponse) => void): Request<Iot.Types.CreateDynamicThingGroupResponse, AWSError>;
  /**
   * Creates a dynamic thing group. Requires permission to access the CreateDynamicThingGroup action.
   */
  createDynamicThingGroup(callback?: (err: AWSError, data: Iot.Types.CreateDynamicThingGroupResponse) => void): Request<Iot.Types.CreateDynamicThingGroupResponse, AWSError>;
  /**
   * Creates a fleet metric. Requires permission to access the CreateFleetMetric action.
   */
  createFleetMetric(params: Iot.Types.CreateFleetMetricRequest, callback?: (err: AWSError, data: Iot.Types.CreateFleetMetricResponse) => void): Request<Iot.Types.CreateFleetMetricResponse, AWSError>;
  /**
   * Creates a fleet metric. Requires permission to access the CreateFleetMetric action.
   */
  createFleetMetric(callback?: (err: AWSError, data: Iot.Types.CreateFleetMetricResponse) => void): Request<Iot.Types.CreateFleetMetricResponse, AWSError>;
  /**
   * Creates a job. Requires permission to access the CreateJob action.
   */
  createJob(params: Iot.Types.CreateJobRequest, callback?: (err: AWSError, data: Iot.Types.CreateJobResponse) => void): Request<Iot.Types.CreateJobResponse, AWSError>;
  /**
   * Creates a job. Requires permission to access the CreateJob action.
   */
  createJob(callback?: (err: AWSError, data: Iot.Types.CreateJobResponse) => void): Request<Iot.Types.CreateJobResponse, AWSError>;
  /**
   * Creates a job template. Requires permission to access the CreateJobTemplate action.
   */
  createJobTemplate(params: Iot.Types.CreateJobTemplateRequest, callback?: (err: AWSError, data: Iot.Types.CreateJobTemplateResponse) => void): Request<Iot.Types.CreateJobTemplateResponse, AWSError>;
  /**
   * Creates a job template. Requires permission to access the CreateJobTemplate action.
   */
  createJobTemplate(callback?: (err: AWSError, data: Iot.Types.CreateJobTemplateResponse) => void): Request<Iot.Types.CreateJobTemplateResponse, AWSError>;
  /**
   * Creates a 2048-bit RSA key pair and issues an X.509 certificate using the issued public key. You can also call CreateKeysAndCertificate over MQTT from a device, for more information, see Provisioning MQTT API.  Note This is the only time IoT issues the private key for this certificate, so it is important to keep it in a secure location. Requires permission to access the CreateKeysAndCertificate action.
   */
  createKeysAndCertificate(params: Iot.Types.CreateKeysAndCertificateRequest, callback?: (err: AWSError, data: Iot.Types.CreateKeysAndCertificateResponse) => void): Request<Iot.Types.CreateKeysAndCertificateResponse, AWSError>;
  /**
   * Creates a 2048-bit RSA key pair and issues an X.509 certificate using the issued public key. You can also call CreateKeysAndCertificate over MQTT from a device, for more information, see Provisioning MQTT API.  Note This is the only time IoT issues the private key for this certificate, so it is important to keep it in a secure location. Requires permission to access the CreateKeysAndCertificate action.
   */
  createKeysAndCertificate(callback?: (err: AWSError, data: Iot.Types.CreateKeysAndCertificateResponse) => void): Request<Iot.Types.CreateKeysAndCertificateResponse, AWSError>;
  /**
   * Defines an action that can be applied to audit findings by using StartAuditMitigationActionsTask. Only certain types of mitigation actions can be applied to specific check names. For more information, see Mitigation actions. Each mitigation action can apply only one type of change. Requires permission to access the CreateMitigationAction action.
   */
  createMitigationAction(params: Iot.Types.CreateMitigationActionRequest, callback?: (err: AWSError, data: Iot.Types.CreateMitigationActionResponse) => void): Request<Iot.Types.CreateMitigationActionResponse, AWSError>;
  /**
   * Defines an action that can be applied to audit findings by using StartAuditMitigationActionsTask. Only certain types of mitigation actions can be applied to specific check names. For more information, see Mitigation actions. Each mitigation action can apply only one type of change. Requires permission to access the CreateMitigationAction action.
   */
  createMitigationAction(callback?: (err: AWSError, data: Iot.Types.CreateMitigationActionResponse) => void): Request<Iot.Types.CreateMitigationActionResponse, AWSError>;
  /**
   * Creates an IoT OTA update on a target group of things or groups. Requires permission to access the CreateOTAUpdate action.
   */
  createOTAUpdate(params: Iot.Types.CreateOTAUpdateRequest, callback?: (err: AWSError, data: Iot.Types.CreateOTAUpdateResponse) => void): Request<Iot.Types.CreateOTAUpdateResponse, AWSError>;
  /**
   * Creates an IoT OTA update on a target group of things or groups. Requires permission to access the CreateOTAUpdate action.
   */
  createOTAUpdate(callback?: (err: AWSError, data: Iot.Types.CreateOTAUpdateResponse) => void): Request<Iot.Types.CreateOTAUpdateResponse, AWSError>;
  /**
   * Creates an IoT software package that can be deployed to your fleet. Requires permission to access the CreatePackage and GetIndexingConfiguration actions.
   */
  createPackage(params: Iot.Types.CreatePackageRequest, callback?: (err: AWSError, data: Iot.Types.CreatePackageResponse) => void): Request<Iot.Types.CreatePackageResponse, AWSError>;
  /**
   * Creates an IoT software package that can be deployed to your fleet. Requires permission to access the CreatePackage and GetIndexingConfiguration actions.
   */
  createPackage(callback?: (err: AWSError, data: Iot.Types.CreatePackageResponse) => void): Request<Iot.Types.CreatePackageResponse, AWSError>;
  /**
   * Creates a new version for an existing IoT software package. Requires permission to access the CreatePackageVersion and GetIndexingConfiguration actions.
   */
  createPackageVersion(params: Iot.Types.CreatePackageVersionRequest, callback?: (err: AWSError, data: Iot.Types.CreatePackageVersionResponse) => void): Request<Iot.Types.CreatePackageVersionResponse, AWSError>;
  /**
   * Creates a new version for an existing IoT software package. Requires permission to access the CreatePackageVersion and GetIndexingConfiguration actions.
   */
  createPackageVersion(callback?: (err: AWSError, data: Iot.Types.CreatePackageVersionResponse) => void): Request<Iot.Types.CreatePackageVersionResponse, AWSError>;
  /**
   * Creates an IoT policy. The created policy is the default version for the policy. This operation creates a policy version with a version identifier of 1 and sets 1 as the policy's default version. Requires permission to access the CreatePolicy action.
   */
  createPolicy(params: Iot.Types.CreatePolicyRequest, callback?: (err: AWSError, data: Iot.Types.CreatePolicyResponse) => void): Request<Iot.Types.CreatePolicyResponse, AWSError>;
  /**
   * Creates an IoT policy. The created policy is the default version for the policy. This operation creates a policy version with a version identifier of 1 and sets 1 as the policy's default version. Requires permission to access the CreatePolicy action.
   */
  createPolicy(callback?: (err: AWSError, data: Iot.Types.CreatePolicyResponse) => void): Request<Iot.Types.CreatePolicyResponse, AWSError>;
  /**
   * Creates a new version of the specified IoT policy. To update a policy, create a new policy version. A managed policy can have up to five versions. If the policy has five versions, you must use DeletePolicyVersion to delete an existing version before you create a new one. Optionally, you can set the new version as the policy's default version. The default version is the operative version (that is, the version that is in effect for the certificates to which the policy is attached). Requires permission to access the CreatePolicyVersion action.
   */
  createPolicyVersion(params: Iot.Types.CreatePolicyVersionRequest, callback?: (err: AWSError, data: Iot.Types.CreatePolicyVersionResponse) => void): Request<Iot.Types.CreatePolicyVersionResponse, AWSError>;
  /**
   * Creates a new version of the specified IoT policy. To update a policy, create a new policy version. A managed policy can have up to five versions. If the policy has five versions, you must use DeletePolicyVersion to delete an existing version before you create a new one. Optionally, you can set the new version as the policy's default version. The default version is the operative version (that is, the version that is in effect for the certificates to which the policy is attached). Requires permission to access the CreatePolicyVersion action.
   */
  createPolicyVersion(callback?: (err: AWSError, data: Iot.Types.CreatePolicyVersionResponse) => void): Request<Iot.Types.CreatePolicyVersionResponse, AWSError>;
  /**
   * Creates a provisioning claim. Requires permission to access the CreateProvisioningClaim action.
   */
  createProvisioningClaim(params: Iot.Types.CreateProvisioningClaimRequest, callback?: (err: AWSError, data: Iot.Types.CreateProvisioningClaimResponse) => void): Request<Iot.Types.CreateProvisioningClaimResponse, AWSError>;
  /**
   * Creates a provisioning claim. Requires permission to access the CreateProvisioningClaim action.
   */
  createProvisioningClaim(callback?: (err: AWSError, data: Iot.Types.CreateProvisioningClaimResponse) => void): Request<Iot.Types.CreateProvisioningClaimResponse, AWSError>;
  /**
   * Creates a provisioning template. Requires permission to access the CreateProvisioningTemplate action.
   */
  createProvisioningTemplate(params: Iot.Types.CreateProvisioningTemplateRequest, callback?: (err: AWSError, data: Iot.Types.CreateProvisioningTemplateResponse) => void): Request<Iot.Types.CreateProvisioningTemplateResponse, AWSError>;
  /**
   * Creates a provisioning template. Requires permission to access the CreateProvisioningTemplate action.
   */
  createProvisioningTemplate(callback?: (err: AWSError, data: Iot.Types.CreateProvisioningTemplateResponse) => void): Request<Iot.Types.CreateProvisioningTemplateResponse, AWSError>;
  /**
   * Creates a new version of a provisioning template. Requires permission to access the CreateProvisioningTemplateVersion action.
   */
  createProvisioningTemplateVersion(params: Iot.Types.CreateProvisioningTemplateVersionRequest, callback?: (err: AWSError, data: Iot.Types.CreateProvisioningTemplateVersionResponse) => void): Request<Iot.Types.CreateProvisioningTemplateVersionResponse, AWSError>;
  /**
   * Creates a new version of a provisioning template. Requires permission to access the CreateProvisioningTemplateVersion action.
   */
  createProvisioningTemplateVersion(callback?: (err: AWSError, data: Iot.Types.CreateProvisioningTemplateVersionResponse) => void): Request<Iot.Types.CreateProvisioningTemplateVersionResponse, AWSError>;
  /**
   * Creates a role alias. Requires permission to access the CreateRoleAlias action.
   */
  createRoleAlias(params: Iot.Types.CreateRoleAliasRequest, callback?: (err: AWSError, data: Iot.Types.CreateRoleAliasResponse) => void): Request<Iot.Types.CreateRoleAliasResponse, AWSError>;
  /**
   * Creates a role alias. Requires permission to access the CreateRoleAlias action.
   */
  createRoleAlias(callback?: (err: AWSError, data: Iot.Types.CreateRoleAliasResponse) => void): Request<Iot.Types.CreateRoleAliasResponse, AWSError>;
  /**
   * Creates a scheduled audit that is run at a specified time interval. Requires permission to access the CreateScheduledAudit action.
   */
  createScheduledAudit(params: Iot.Types.CreateScheduledAuditRequest, callback?: (err: AWSError, data: Iot.Types.CreateScheduledAuditResponse) => void): Request<Iot.Types.CreateScheduledAuditResponse, AWSError>;
  /**
   * Creates a scheduled audit that is run at a specified time interval. Requires permission to access the CreateScheduledAudit action.
   */
  createScheduledAudit(callback?: (err: AWSError, data: Iot.Types.CreateScheduledAuditResponse) => void): Request<Iot.Types.CreateScheduledAuditResponse, AWSError>;
  /**
   * Creates a Device Defender security profile. Requires permission to access the CreateSecurityProfile action.
   */
  createSecurityProfile(params: Iot.Types.CreateSecurityProfileRequest, callback?: (err: AWSError, data: Iot.Types.CreateSecurityProfileResponse) => void): Request<Iot.Types.CreateSecurityProfileResponse, AWSError>;
  /**
   * Creates a Device Defender security profile. Requires permission to access the CreateSecurityProfile action.
   */
  createSecurityProfile(callback?: (err: AWSError, data: Iot.Types.CreateSecurityProfileResponse) => void): Request<Iot.Types.CreateSecurityProfileResponse, AWSError>;
  /**
   * Creates a stream for delivering one or more large files in chunks over MQTT. A stream transports data bytes in chunks or blocks packaged as MQTT messages from a source like S3. You can have one or more files associated with a stream. Requires permission to access the CreateStream action.
   */
  createStream(params: Iot.Types.CreateStreamRequest, callback?: (err: AWSError, data: Iot.Types.CreateStreamResponse) => void): Request<Iot.Types.CreateStreamResponse, AWSError>;
  /**
   * Creates a stream for delivering one or more large files in chunks over MQTT. A stream transports data bytes in chunks or blocks packaged as MQTT messages from a source like S3. You can have one or more files associated with a stream. Requires permission to access the CreateStream action.
   */
  createStream(callback?: (err: AWSError, data: Iot.Types.CreateStreamResponse) => void): Request<Iot.Types.CreateStreamResponse, AWSError>;
  /**
   * Creates a thing record in the registry. If this call is made multiple times using the same thing name and configuration, the call will succeed. If this call is made with the same thing name but different configuration a ResourceAlreadyExistsException is thrown.  This is a control plane operation. See Authorization for information about authorizing control plane actions.  Requires permission to access the CreateThing action.
   */
  createThing(params: Iot.Types.CreateThingRequest, callback?: (err: AWSError, data: Iot.Types.CreateThingResponse) => void): Request<Iot.Types.CreateThingResponse, AWSError>;
  /**
   * Creates a thing record in the registry. If this call is made multiple times using the same thing name and configuration, the call will succeed. If this call is made with the same thing name but different configuration a ResourceAlreadyExistsException is thrown.  This is a control plane operation. See Authorization for information about authorizing control plane actions.  Requires permission to access the CreateThing action.
   */
  createThing(callback?: (err: AWSError, data: Iot.Types.CreateThingResponse) => void): Request<Iot.Types.CreateThingResponse, AWSError>;
  /**
   * Create a thing group.  This is a control plane operation. See Authorization for information about authorizing control plane actions.  Requires permission to access the CreateThingGroup action.
   */
  createThingGroup(params: Iot.Types.CreateThingGroupRequest, callback?: (err: AWSError, data: Iot.Types.CreateThingGroupResponse) => void): Request<Iot.Types.CreateThingGroupResponse, AWSError>;
  /**
   * Create a thing group.  This is a control plane operation. See Authorization for information about authorizing control plane actions.  Requires permission to access the CreateThingGroup action.
   */
  createThingGroup(callback?: (err: AWSError, data: Iot.Types.CreateThingGroupResponse) => void): Request<Iot.Types.CreateThingGroupResponse, AWSError>;
  /**
   * Creates a new thing type. Requires permission to access the CreateThingType action.
   */
  createThingType(params: Iot.Types.CreateThingTypeRequest, callback?: (err: AWSError, data: Iot.Types.CreateThingTypeResponse) => void): Request<Iot.Types.CreateThingTypeResponse, AWSError>;
  /**
   * Creates a new thing type. Requires permission to access the CreateThingType action.
   */
  createThingType(callback?: (err: AWSError, data: Iot.Types.CreateThingTypeResponse) => void): Request<Iot.Types.CreateThingTypeResponse, AWSError>;
  /**
   * Creates a rule. Creating rules is an administrator-level action. Any user who has permission to create rules will be able to access data processed by the rule. Requires permission to access the CreateTopicRule action.
   */
  createTopicRule(params: Iot.Types.CreateTopicRuleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a rule. Creating rules is an administrator-level action. Any user who has permission to create rules will be able to access data processed by the rule. Requires permission to access the CreateTopicRule action.
   */
  createTopicRule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a topic rule destination. The destination must be confirmed prior to use. Requires permission to access the CreateTopicRuleDestination action.
   */
  createTopicRuleDestination(params: Iot.Types.CreateTopicRuleDestinationRequest, callback?: (err: AWSError, data: Iot.Types.CreateTopicRuleDestinationResponse) => void): Request<Iot.Types.CreateTopicRuleDestinationResponse, AWSError>;
  /**
   * Creates a topic rule destination. The destination must be confirmed prior to use. Requires permission to access the CreateTopicRuleDestination action.
   */
  createTopicRuleDestination(callback?: (err: AWSError, data: Iot.Types.CreateTopicRuleDestinationResponse) => void): Request<Iot.Types.CreateTopicRuleDestinationResponse, AWSError>;
  /**
   * Restores the default settings for Device Defender audits for this account. Any configuration data you entered is deleted and all audit checks are reset to disabled.  Requires permission to access the DeleteAccountAuditConfiguration action.
   */
  deleteAccountAuditConfiguration(params: Iot.Types.DeleteAccountAuditConfigurationRequest, callback?: (err: AWSError, data: Iot.Types.DeleteAccountAuditConfigurationResponse) => void): Request<Iot.Types.DeleteAccountAuditConfigurationResponse, AWSError>;
  /**
   * Restores the default settings for Device Defender audits for this account. Any configuration data you entered is deleted and all audit checks are reset to disabled.  Requires permission to access the DeleteAccountAuditConfiguration action.
   */
  deleteAccountAuditConfiguration(callback?: (err: AWSError, data: Iot.Types.DeleteAccountAuditConfigurationResponse) => void): Request<Iot.Types.DeleteAccountAuditConfigurationResponse, AWSError>;
  /**
   *  Deletes a Device Defender audit suppression.  Requires permission to access the DeleteAuditSuppression action.
   */
  deleteAuditSuppression(params: Iot.Types.DeleteAuditSuppressionRequest, callback?: (err: AWSError, data: Iot.Types.DeleteAuditSuppressionResponse) => void): Request<Iot.Types.DeleteAuditSuppressionResponse, AWSError>;
  /**
   *  Deletes a Device Defender audit suppression.  Requires permission to access the DeleteAuditSuppression action.
   */
  deleteAuditSuppression(callback?: (err: AWSError, data: Iot.Types.DeleteAuditSuppressionResponse) => void): Request<Iot.Types.DeleteAuditSuppressionResponse, AWSError>;
  /**
   * Deletes an authorizer. Requires permission to access the DeleteAuthorizer action.
   */
  deleteAuthorizer(params: Iot.Types.DeleteAuthorizerRequest, callback?: (err: AWSError, data: Iot.Types.DeleteAuthorizerResponse) => void): Request<Iot.Types.DeleteAuthorizerResponse, AWSError>;
  /**
   * Deletes an authorizer. Requires permission to access the DeleteAuthorizer action.
   */
  deleteAuthorizer(callback?: (err: AWSError, data: Iot.Types.DeleteAuthorizerResponse) => void): Request<Iot.Types.DeleteAuthorizerResponse, AWSError>;
  /**
   * Deletes the billing group. Requires permission to access the DeleteBillingGroup action.
   */
  deleteBillingGroup(params: Iot.Types.DeleteBillingGroupRequest, callback?: (err: AWSError, data: Iot.Types.DeleteBillingGroupResponse) => void): Request<Iot.Types.DeleteBillingGroupResponse, AWSError>;
  /**
   * Deletes the billing group. Requires permission to access the DeleteBillingGroup action.
   */
  deleteBillingGroup(callback?: (err: AWSError, data: Iot.Types.DeleteBillingGroupResponse) => void): Request<Iot.Types.DeleteBillingGroupResponse, AWSError>;
  /**
   * Deletes a registered CA certificate. Requires permission to access the DeleteCACertificate action.
   */
  deleteCACertificate(params: Iot.Types.DeleteCACertificateRequest, callback?: (err: AWSError, data: Iot.Types.DeleteCACertificateResponse) => void): Request<Iot.Types.DeleteCACertificateResponse, AWSError>;
  /**
   * Deletes a registered CA certificate. Requires permission to access the DeleteCACertificate action.
   */
  deleteCACertificate(callback?: (err: AWSError, data: Iot.Types.DeleteCACertificateResponse) => void): Request<Iot.Types.DeleteCACertificateResponse, AWSError>;
  /**
   * Deletes the specified certificate. A certificate cannot be deleted if it has a policy or IoT thing attached to it or if its status is set to ACTIVE. To delete a certificate, first use the DetachPolicy action to detach all policies. Next, use the UpdateCertificate action to set the certificate to the INACTIVE status. Requires permission to access the DeleteCertificate action.
   */
  deleteCertificate(params: Iot.Types.DeleteCertificateRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified certificate. A certificate cannot be deleted if it has a policy or IoT thing attached to it or if its status is set to ACTIVE. To delete a certificate, first use the DetachPolicy action to detach all policies. Next, use the UpdateCertificate action to set the certificate to the INACTIVE status. Requires permission to access the DeleteCertificate action.
   */
  deleteCertificate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Deletes a Device Defender detect custom metric.  Requires permission to access the DeleteCustomMetric action.  Before you can delete a custom metric, you must first remove the custom metric from all security profiles it's a part of. The security profile associated with the custom metric can be found using the ListSecurityProfiles API with metricName set to your custom metric name. 
   */
  deleteCustomMetric(params: Iot.Types.DeleteCustomMetricRequest, callback?: (err: AWSError, data: Iot.Types.DeleteCustomMetricResponse) => void): Request<Iot.Types.DeleteCustomMetricResponse, AWSError>;
  /**
   *  Deletes a Device Defender detect custom metric.  Requires permission to access the DeleteCustomMetric action.  Before you can delete a custom metric, you must first remove the custom metric from all security profiles it's a part of. The security profile associated with the custom metric can be found using the ListSecurityProfiles API with metricName set to your custom metric name. 
   */
  deleteCustomMetric(callback?: (err: AWSError, data: Iot.Types.DeleteCustomMetricResponse) => void): Request<Iot.Types.DeleteCustomMetricResponse, AWSError>;
  /**
   * Removes the specified dimension from your Amazon Web Services accounts. Requires permission to access the DeleteDimension action.
   */
  deleteDimension(params: Iot.Types.DeleteDimensionRequest, callback?: (err: AWSError, data: Iot.Types.DeleteDimensionResponse) => void): Request<Iot.Types.DeleteDimensionResponse, AWSError>;
  /**
   * Removes the specified dimension from your Amazon Web Services accounts. Requires permission to access the DeleteDimension action.
   */
  deleteDimension(callback?: (err: AWSError, data: Iot.Types.DeleteDimensionResponse) => void): Request<Iot.Types.DeleteDimensionResponse, AWSError>;
  /**
   * Deletes the specified domain configuration. Requires permission to access the DeleteDomainConfiguration action.
   */
  deleteDomainConfiguration(params: Iot.Types.DeleteDomainConfigurationRequest, callback?: (err: AWSError, data: Iot.Types.DeleteDomainConfigurationResponse) => void): Request<Iot.Types.DeleteDomainConfigurationResponse, AWSError>;
  /**
   * Deletes the specified domain configuration. Requires permission to access the DeleteDomainConfiguration action.
   */
  deleteDomainConfiguration(callback?: (err: AWSError, data: Iot.Types.DeleteDomainConfigurationResponse) => void): Request<Iot.Types.DeleteDomainConfigurationResponse, AWSError>;
  /**
   * Deletes a dynamic thing group. Requires permission to access the DeleteDynamicThingGroup action.
   */
  deleteDynamicThingGroup(params: Iot.Types.DeleteDynamicThingGroupRequest, callback?: (err: AWSError, data: Iot.Types.DeleteDynamicThingGroupResponse) => void): Request<Iot.Types.DeleteDynamicThingGroupResponse, AWSError>;
  /**
   * Deletes a dynamic thing group. Requires permission to access the DeleteDynamicThingGroup action.
   */
  deleteDynamicThingGroup(callback?: (err: AWSError, data: Iot.Types.DeleteDynamicThingGroupResponse) => void): Request<Iot.Types.DeleteDynamicThingGroupResponse, AWSError>;
  /**
   * Deletes the specified fleet metric. Returns successfully with no error if the deletion is successful or you specify a fleet metric that doesn't exist. Requires permission to access the DeleteFleetMetric action.
   */
  deleteFleetMetric(params: Iot.Types.DeleteFleetMetricRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified fleet metric. Returns successfully with no error if the deletion is successful or you specify a fleet metric that doesn't exist. Requires permission to access the DeleteFleetMetric action.
   */
  deleteFleetMetric(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a job and its related job executions. Deleting a job may take time, depending on the number of job executions created for the job and various other factors. While the job is being deleted, the status of the job will be shown as "DELETION_IN_PROGRESS". Attempting to delete or cancel a job whose status is already "DELETION_IN_PROGRESS" will result in an error. Only 10 jobs may have status "DELETION_IN_PROGRESS" at the same time, or a LimitExceededException will occur. Requires permission to access the DeleteJob action.
   */
  deleteJob(params: Iot.Types.DeleteJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a job and its related job executions. Deleting a job may take time, depending on the number of job executions created for the job and various other factors. While the job is being deleted, the status of the job will be shown as "DELETION_IN_PROGRESS". Attempting to delete or cancel a job whose status is already "DELETION_IN_PROGRESS" will result in an error. Only 10 jobs may have status "DELETION_IN_PROGRESS" at the same time, or a LimitExceededException will occur. Requires permission to access the DeleteJob action.
   */
  deleteJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a job execution. Requires permission to access the DeleteJobExecution action.
   */
  deleteJobExecution(params: Iot.Types.DeleteJobExecutionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a job execution. Requires permission to access the DeleteJobExecution action.
   */
  deleteJobExecution(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified job template.
   */
  deleteJobTemplate(params: Iot.Types.DeleteJobTemplateRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified job template.
   */
  deleteJobTemplate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a defined mitigation action from your Amazon Web Services accounts. Requires permission to access the DeleteMitigationAction action.
   */
  deleteMitigationAction(params: Iot.Types.DeleteMitigationActionRequest, callback?: (err: AWSError, data: Iot.Types.DeleteMitigationActionResponse) => void): Request<Iot.Types.DeleteMitigationActionResponse, AWSError>;
  /**
   * Deletes a defined mitigation action from your Amazon Web Services accounts. Requires permission to access the DeleteMitigationAction action.
   */
  deleteMitigationAction(callback?: (err: AWSError, data: Iot.Types.DeleteMitigationActionResponse) => void): Request<Iot.Types.DeleteMitigationActionResponse, AWSError>;
  /**
   * Delete an OTA update. Requires permission to access the DeleteOTAUpdate action.
   */
  deleteOTAUpdate(params: Iot.Types.DeleteOTAUpdateRequest, callback?: (err: AWSError, data: Iot.Types.DeleteOTAUpdateResponse) => void): Request<Iot.Types.DeleteOTAUpdateResponse, AWSError>;
  /**
   * Delete an OTA update. Requires permission to access the DeleteOTAUpdate action.
   */
  deleteOTAUpdate(callback?: (err: AWSError, data: Iot.Types.DeleteOTAUpdateResponse) => void): Request<Iot.Types.DeleteOTAUpdateResponse, AWSError>;
  /**
   * Deletes a specific version from a software package.  Note: All package versions must be deleted before deleting the software package. Requires permission to access the DeletePackageVersion action.
   */
  deletePackage(params: Iot.Types.DeletePackageRequest, callback?: (err: AWSError, data: Iot.Types.DeletePackageResponse) => void): Request<Iot.Types.DeletePackageResponse, AWSError>;
  /**
   * Deletes a specific version from a software package.  Note: All package versions must be deleted before deleting the software package. Requires permission to access the DeletePackageVersion action.
   */
  deletePackage(callback?: (err: AWSError, data: Iot.Types.DeletePackageResponse) => void): Request<Iot.Types.DeletePackageResponse, AWSError>;
  /**
   * Deletes a specific version from a software package.  Note: If a package version is designated as default, you must remove the designation from the software package using the UpdatePackage action.
   */
  deletePackageVersion(params: Iot.Types.DeletePackageVersionRequest, callback?: (err: AWSError, data: Iot.Types.DeletePackageVersionResponse) => void): Request<Iot.Types.DeletePackageVersionResponse, AWSError>;
  /**
   * Deletes a specific version from a software package.  Note: If a package version is designated as default, you must remove the designation from the software package using the UpdatePackage action.
   */
  deletePackageVersion(callback?: (err: AWSError, data: Iot.Types.DeletePackageVersionResponse) => void): Request<Iot.Types.DeletePackageVersionResponse, AWSError>;
  /**
   * Deletes the specified policy. A policy cannot be deleted if it has non-default versions or it is attached to any certificate. To delete a policy, use the DeletePolicyVersion action to delete all non-default versions of the policy; use the DetachPolicy action to detach the policy from any certificate; and then use the DeletePolicy action to delete the policy. When a policy is deleted using DeletePolicy, its default version is deleted with it.  Because of the distributed nature of Amazon Web Services, it can take up to five minutes after a policy is detached before it's ready to be deleted.  Requires permission to access the DeletePolicy action.
   */
  deletePolicy(params: Iot.Types.DeletePolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified policy. A policy cannot be deleted if it has non-default versions or it is attached to any certificate. To delete a policy, use the DeletePolicyVersion action to delete all non-default versions of the policy; use the DetachPolicy action to detach the policy from any certificate; and then use the DeletePolicy action to delete the policy. When a policy is deleted using DeletePolicy, its default version is deleted with it.  Because of the distributed nature of Amazon Web Services, it can take up to five minutes after a policy is detached before it's ready to be deleted.  Requires permission to access the DeletePolicy action.
   */
  deletePolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified version of the specified policy. You cannot delete the default version of a policy using this action. To delete the default version of a policy, use DeletePolicy. To find out which version of a policy is marked as the default version, use ListPolicyVersions. Requires permission to access the DeletePolicyVersion action.
   */
  deletePolicyVersion(params: Iot.Types.DeletePolicyVersionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified version of the specified policy. You cannot delete the default version of a policy using this action. To delete the default version of a policy, use DeletePolicy. To find out which version of a policy is marked as the default version, use ListPolicyVersions. Requires permission to access the DeletePolicyVersion action.
   */
  deletePolicyVersion(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a provisioning template. Requires permission to access the DeleteProvisioningTemplate action.
   */
  deleteProvisioningTemplate(params: Iot.Types.DeleteProvisioningTemplateRequest, callback?: (err: AWSError, data: Iot.Types.DeleteProvisioningTemplateResponse) => void): Request<Iot.Types.DeleteProvisioningTemplateResponse, AWSError>;
  /**
   * Deletes a provisioning template. Requires permission to access the DeleteProvisioningTemplate action.
   */
  deleteProvisioningTemplate(callback?: (err: AWSError, data: Iot.Types.DeleteProvisioningTemplateResponse) => void): Request<Iot.Types.DeleteProvisioningTemplateResponse, AWSError>;
  /**
   * Deletes a provisioning template version. Requires permission to access the DeleteProvisioningTemplateVersion action.
   */
  deleteProvisioningTemplateVersion(params: Iot.Types.DeleteProvisioningTemplateVersionRequest, callback?: (err: AWSError, data: Iot.Types.DeleteProvisioningTemplateVersionResponse) => void): Request<Iot.Types.DeleteProvisioningTemplateVersionResponse, AWSError>;
  /**
   * Deletes a provisioning template version. Requires permission to access the DeleteProvisioningTemplateVersion action.
   */
  deleteProvisioningTemplateVersion(callback?: (err: AWSError, data: Iot.Types.DeleteProvisioningTemplateVersionResponse) => void): Request<Iot.Types.DeleteProvisioningTemplateVersionResponse, AWSError>;
  /**
   * Deletes a CA certificate registration code. Requires permission to access the DeleteRegistrationCode action.
   */
  deleteRegistrationCode(params: Iot.Types.DeleteRegistrationCodeRequest, callback?: (err: AWSError, data: Iot.Types.DeleteRegistrationCodeResponse) => void): Request<Iot.Types.DeleteRegistrationCodeResponse, AWSError>;
  /**
   * Deletes a CA certificate registration code. Requires permission to access the DeleteRegistrationCode action.
   */
  deleteRegistrationCode(callback?: (err: AWSError, data: Iot.Types.DeleteRegistrationCodeResponse) => void): Request<Iot.Types.DeleteRegistrationCodeResponse, AWSError>;
  /**
   * Deletes a role alias Requires permission to access the DeleteRoleAlias action.
   */
  deleteRoleAlias(params: Iot.Types.DeleteRoleAliasRequest, callback?: (err: AWSError, data: Iot.Types.DeleteRoleAliasResponse) => void): Request<Iot.Types.DeleteRoleAliasResponse, AWSError>;
  /**
   * Deletes a role alias Requires permission to access the DeleteRoleAlias action.
   */
  deleteRoleAlias(callback?: (err: AWSError, data: Iot.Types.DeleteRoleAliasResponse) => void): Request<Iot.Types.DeleteRoleAliasResponse, AWSError>;
  /**
   * Deletes a scheduled audit. Requires permission to access the DeleteScheduledAudit action.
   */
  deleteScheduledAudit(params: Iot.Types.DeleteScheduledAuditRequest, callback?: (err: AWSError, data: Iot.Types.DeleteScheduledAuditResponse) => void): Request<Iot.Types.DeleteScheduledAuditResponse, AWSError>;
  /**
   * Deletes a scheduled audit. Requires permission to access the DeleteScheduledAudit action.
   */
  deleteScheduledAudit(callback?: (err: AWSError, data: Iot.Types.DeleteScheduledAuditResponse) => void): Request<Iot.Types.DeleteScheduledAuditResponse, AWSError>;
  /**
   * Deletes a Device Defender security profile. Requires permission to access the DeleteSecurityProfile action.
   */
  deleteSecurityProfile(params: Iot.Types.DeleteSecurityProfileRequest, callback?: (err: AWSError, data: Iot.Types.DeleteSecurityProfileResponse) => void): Request<Iot.Types.DeleteSecurityProfileResponse, AWSError>;
  /**
   * Deletes a Device Defender security profile. Requires permission to access the DeleteSecurityProfile action.
   */
  deleteSecurityProfile(callback?: (err: AWSError, data: Iot.Types.DeleteSecurityProfileResponse) => void): Request<Iot.Types.DeleteSecurityProfileResponse, AWSError>;
  /**
   * Deletes a stream. Requires permission to access the DeleteStream action.
   */
  deleteStream(params: Iot.Types.DeleteStreamRequest, callback?: (err: AWSError, data: Iot.Types.DeleteStreamResponse) => void): Request<Iot.Types.DeleteStreamResponse, AWSError>;
  /**
   * Deletes a stream. Requires permission to access the DeleteStream action.
   */
  deleteStream(callback?: (err: AWSError, data: Iot.Types.DeleteStreamResponse) => void): Request<Iot.Types.DeleteStreamResponse, AWSError>;
  /**
   * Deletes the specified thing. Returns successfully with no error if the deletion is successful or you specify a thing that doesn't exist. Requires permission to access the DeleteThing action.
   */
  deleteThing(params: Iot.Types.DeleteThingRequest, callback?: (err: AWSError, data: Iot.Types.DeleteThingResponse) => void): Request<Iot.Types.DeleteThingResponse, AWSError>;
  /**
   * Deletes the specified thing. Returns successfully with no error if the deletion is successful or you specify a thing that doesn't exist. Requires permission to access the DeleteThing action.
   */
  deleteThing(callback?: (err: AWSError, data: Iot.Types.DeleteThingResponse) => void): Request<Iot.Types.DeleteThingResponse, AWSError>;
  /**
   * Deletes a thing group. Requires permission to access the DeleteThingGroup action.
   */
  deleteThingGroup(params: Iot.Types.DeleteThingGroupRequest, callback?: (err: AWSError, data: Iot.Types.DeleteThingGroupResponse) => void): Request<Iot.Types.DeleteThingGroupResponse, AWSError>;
  /**
   * Deletes a thing group. Requires permission to access the DeleteThingGroup action.
   */
  deleteThingGroup(callback?: (err: AWSError, data: Iot.Types.DeleteThingGroupResponse) => void): Request<Iot.Types.DeleteThingGroupResponse, AWSError>;
  /**
   * Deletes the specified thing type. You cannot delete a thing type if it has things associated with it. To delete a thing type, first mark it as deprecated by calling DeprecateThingType, then remove any associated things by calling UpdateThing to change the thing type on any associated thing, and finally use DeleteThingType to delete the thing type. Requires permission to access the DeleteThingType action.
   */
  deleteThingType(params: Iot.Types.DeleteThingTypeRequest, callback?: (err: AWSError, data: Iot.Types.DeleteThingTypeResponse) => void): Request<Iot.Types.DeleteThingTypeResponse, AWSError>;
  /**
   * Deletes the specified thing type. You cannot delete a thing type if it has things associated with it. To delete a thing type, first mark it as deprecated by calling DeprecateThingType, then remove any associated things by calling UpdateThing to change the thing type on any associated thing, and finally use DeleteThingType to delete the thing type. Requires permission to access the DeleteThingType action.
   */
  deleteThingType(callback?: (err: AWSError, data: Iot.Types.DeleteThingTypeResponse) => void): Request<Iot.Types.DeleteThingTypeResponse, AWSError>;
  /**
   * Deletes the rule. Requires permission to access the DeleteTopicRule action.
   */
  deleteTopicRule(params: Iot.Types.DeleteTopicRuleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the rule. Requires permission to access the DeleteTopicRule action.
   */
  deleteTopicRule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a topic rule destination. Requires permission to access the DeleteTopicRuleDestination action.
   */
  deleteTopicRuleDestination(params: Iot.Types.DeleteTopicRuleDestinationRequest, callback?: (err: AWSError, data: Iot.Types.DeleteTopicRuleDestinationResponse) => void): Request<Iot.Types.DeleteTopicRuleDestinationResponse, AWSError>;
  /**
   * Deletes a topic rule destination. Requires permission to access the DeleteTopicRuleDestination action.
   */
  deleteTopicRuleDestination(callback?: (err: AWSError, data: Iot.Types.DeleteTopicRuleDestinationResponse) => void): Request<Iot.Types.DeleteTopicRuleDestinationResponse, AWSError>;
  /**
   * Deletes a logging level. Requires permission to access the DeleteV2LoggingLevel action.
   */
  deleteV2LoggingLevel(params: Iot.Types.DeleteV2LoggingLevelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a logging level. Requires permission to access the DeleteV2LoggingLevel action.
   */
  deleteV2LoggingLevel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deprecates a thing type. You can not associate new things with deprecated thing type. Requires permission to access the DeprecateThingType action.
   */
  deprecateThingType(params: Iot.Types.DeprecateThingTypeRequest, callback?: (err: AWSError, data: Iot.Types.DeprecateThingTypeResponse) => void): Request<Iot.Types.DeprecateThingTypeResponse, AWSError>;
  /**
   * Deprecates a thing type. You can not associate new things with deprecated thing type. Requires permission to access the DeprecateThingType action.
   */
  deprecateThingType(callback?: (err: AWSError, data: Iot.Types.DeprecateThingTypeResponse) => void): Request<Iot.Types.DeprecateThingTypeResponse, AWSError>;
  /**
   * Gets information about the Device Defender audit settings for this account. Settings include how audit notifications are sent and which audit checks are enabled or disabled. Requires permission to access the DescribeAccountAuditConfiguration action.
   */
  describeAccountAuditConfiguration(params: Iot.Types.DescribeAccountAuditConfigurationRequest, callback?: (err: AWSError, data: Iot.Types.DescribeAccountAuditConfigurationResponse) => void): Request<Iot.Types.DescribeAccountAuditConfigurationResponse, AWSError>;
  /**
   * Gets information about the Device Defender audit settings for this account. Settings include how audit notifications are sent and which audit checks are enabled or disabled. Requires permission to access the DescribeAccountAuditConfiguration action.
   */
  describeAccountAuditConfiguration(callback?: (err: AWSError, data: Iot.Types.DescribeAccountAuditConfigurationResponse) => void): Request<Iot.Types.DescribeAccountAuditConfigurationResponse, AWSError>;
  /**
   * Gets information about a single audit finding. Properties include the reason for noncompliance, the severity of the issue, and the start time when the audit that returned the finding. Requires permission to access the DescribeAuditFinding action.
   */
  describeAuditFinding(params: Iot.Types.DescribeAuditFindingRequest, callback?: (err: AWSError, data: Iot.Types.DescribeAuditFindingResponse) => void): Request<Iot.Types.DescribeAuditFindingResponse, AWSError>;
  /**
   * Gets information about a single audit finding. Properties include the reason for noncompliance, the severity of the issue, and the start time when the audit that returned the finding. Requires permission to access the DescribeAuditFinding action.
   */
  describeAuditFinding(callback?: (err: AWSError, data: Iot.Types.DescribeAuditFindingResponse) => void): Request<Iot.Types.DescribeAuditFindingResponse, AWSError>;
  /**
   * Gets information about an audit mitigation task that is used to apply mitigation actions to a set of audit findings. Properties include the actions being applied, the audit checks to which they're being applied, the task status, and aggregated task statistics.
   */
  describeAuditMitigationActionsTask(params: Iot.Types.DescribeAuditMitigationActionsTaskRequest, callback?: (err: AWSError, data: Iot.Types.DescribeAuditMitigationActionsTaskResponse) => void): Request<Iot.Types.DescribeAuditMitigationActionsTaskResponse, AWSError>;
  /**
   * Gets information about an audit mitigation task that is used to apply mitigation actions to a set of audit findings. Properties include the actions being applied, the audit checks to which they're being applied, the task status, and aggregated task statistics.
   */
  describeAuditMitigationActionsTask(callback?: (err: AWSError, data: Iot.Types.DescribeAuditMitigationActionsTaskResponse) => void): Request<Iot.Types.DescribeAuditMitigationActionsTaskResponse, AWSError>;
  /**
   *  Gets information about a Device Defender audit suppression. 
   */
  describeAuditSuppression(params: Iot.Types.DescribeAuditSuppressionRequest, callback?: (err: AWSError, data: Iot.Types.DescribeAuditSuppressionResponse) => void): Request<Iot.Types.DescribeAuditSuppressionResponse, AWSError>;
  /**
   *  Gets information about a Device Defender audit suppression. 
   */
  describeAuditSuppression(callback?: (err: AWSError, data: Iot.Types.DescribeAuditSuppressionResponse) => void): Request<Iot.Types.DescribeAuditSuppressionResponse, AWSError>;
  /**
   * Gets information about a Device Defender audit. Requires permission to access the DescribeAuditTask action.
   */
  describeAuditTask(params: Iot.Types.DescribeAuditTaskRequest, callback?: (err: AWSError, data: Iot.Types.DescribeAuditTaskResponse) => void): Request<Iot.Types.DescribeAuditTaskResponse, AWSError>;
  /**
   * Gets information about a Device Defender audit. Requires permission to access the DescribeAuditTask action.
   */
  describeAuditTask(callback?: (err: AWSError, data: Iot.Types.DescribeAuditTaskResponse) => void): Request<Iot.Types.DescribeAuditTaskResponse, AWSError>;
  /**
   * Describes an authorizer. Requires permission to access the DescribeAuthorizer action.
   */
  describeAuthorizer(params: Iot.Types.DescribeAuthorizerRequest, callback?: (err: AWSError, data: Iot.Types.DescribeAuthorizerResponse) => void): Request<Iot.Types.DescribeAuthorizerResponse, AWSError>;
  /**
   * Describes an authorizer. Requires permission to access the DescribeAuthorizer action.
   */
  describeAuthorizer(callback?: (err: AWSError, data: Iot.Types.DescribeAuthorizerResponse) => void): Request<Iot.Types.DescribeAuthorizerResponse, AWSError>;
  /**
   * Returns information about a billing group. Requires permission to access the DescribeBillingGroup action.
   */
  describeBillingGroup(params: Iot.Types.DescribeBillingGroupRequest, callback?: (err: AWSError, data: Iot.Types.DescribeBillingGroupResponse) => void): Request<Iot.Types.DescribeBillingGroupResponse, AWSError>;
  /**
   * Returns information about a billing group. Requires permission to access the DescribeBillingGroup action.
   */
  describeBillingGroup(callback?: (err: AWSError, data: Iot.Types.DescribeBillingGroupResponse) => void): Request<Iot.Types.DescribeBillingGroupResponse, AWSError>;
  /**
   * Describes a registered CA certificate. Requires permission to access the DescribeCACertificate action.
   */
  describeCACertificate(params: Iot.Types.DescribeCACertificateRequest, callback?: (err: AWSError, data: Iot.Types.DescribeCACertificateResponse) => void): Request<Iot.Types.DescribeCACertificateResponse, AWSError>;
  /**
   * Describes a registered CA certificate. Requires permission to access the DescribeCACertificate action.
   */
  describeCACertificate(callback?: (err: AWSError, data: Iot.Types.DescribeCACertificateResponse) => void): Request<Iot.Types.DescribeCACertificateResponse, AWSError>;
  /**
   * Gets information about the specified certificate. Requires permission to access the DescribeCertificate action.
   */
  describeCertificate(params: Iot.Types.DescribeCertificateRequest, callback?: (err: AWSError, data: Iot.Types.DescribeCertificateResponse) => void): Request<Iot.Types.DescribeCertificateResponse, AWSError>;
  /**
   * Gets information about the specified certificate. Requires permission to access the DescribeCertificate action.
   */
  describeCertificate(callback?: (err: AWSError, data: Iot.Types.DescribeCertificateResponse) => void): Request<Iot.Types.DescribeCertificateResponse, AWSError>;
  /**
   *  Gets information about a Device Defender detect custom metric.  Requires permission to access the DescribeCustomMetric action.
   */
  describeCustomMetric(params: Iot.Types.DescribeCustomMetricRequest, callback?: (err: AWSError, data: Iot.Types.DescribeCustomMetricResponse) => void): Request<Iot.Types.DescribeCustomMetricResponse, AWSError>;
  /**
   *  Gets information about a Device Defender detect custom metric.  Requires permission to access the DescribeCustomMetric action.
   */
  describeCustomMetric(callback?: (err: AWSError, data: Iot.Types.DescribeCustomMetricResponse) => void): Request<Iot.Types.DescribeCustomMetricResponse, AWSError>;
  /**
   * Describes the default authorizer. Requires permission to access the DescribeDefaultAuthorizer action.
   */
  describeDefaultAuthorizer(params: Iot.Types.DescribeDefaultAuthorizerRequest, callback?: (err: AWSError, data: Iot.Types.DescribeDefaultAuthorizerResponse) => void): Request<Iot.Types.DescribeDefaultAuthorizerResponse, AWSError>;
  /**
   * Describes the default authorizer. Requires permission to access the DescribeDefaultAuthorizer action.
   */
  describeDefaultAuthorizer(callback?: (err: AWSError, data: Iot.Types.DescribeDefaultAuthorizerResponse) => void): Request<Iot.Types.DescribeDefaultAuthorizerResponse, AWSError>;
  /**
   *  Gets information about a Device Defender ML Detect mitigation action.  Requires permission to access the DescribeDetectMitigationActionsTask action.
   */
  describeDetectMitigationActionsTask(params: Iot.Types.DescribeDetectMitigationActionsTaskRequest, callback?: (err: AWSError, data: Iot.Types.DescribeDetectMitigationActionsTaskResponse) => void): Request<Iot.Types.DescribeDetectMitigationActionsTaskResponse, AWSError>;
  /**
   *  Gets information about a Device Defender ML Detect mitigation action.  Requires permission to access the DescribeDetectMitigationActionsTask action.
   */
  describeDetectMitigationActionsTask(callback?: (err: AWSError, data: Iot.Types.DescribeDetectMitigationActionsTaskResponse) => void): Request<Iot.Types.DescribeDetectMitigationActionsTaskResponse, AWSError>;
  /**
   * Provides details about a dimension that is defined in your Amazon Web Services accounts. Requires permission to access the DescribeDimension action.
   */
  describeDimension(params: Iot.Types.DescribeDimensionRequest, callback?: (err: AWSError, data: Iot.Types.DescribeDimensionResponse) => void): Request<Iot.Types.DescribeDimensionResponse, AWSError>;
  /**
   * Provides details about a dimension that is defined in your Amazon Web Services accounts. Requires permission to access the DescribeDimension action.
   */
  describeDimension(callback?: (err: AWSError, data: Iot.Types.DescribeDimensionResponse) => void): Request<Iot.Types.DescribeDimensionResponse, AWSError>;
  /**
   * Gets summary information about a domain configuration. Requires permission to access the DescribeDomainConfiguration action.
   */
  describeDomainConfiguration(params: Iot.Types.DescribeDomainConfigurationRequest, callback?: (err: AWSError, data: Iot.Types.DescribeDomainConfigurationResponse) => void): Request<Iot.Types.DescribeDomainConfigurationResponse, AWSError>;
  /**
   * Gets summary information about a domain configuration. Requires permission to access the DescribeDomainConfiguration action.
   */
  describeDomainConfiguration(callback?: (err: AWSError, data: Iot.Types.DescribeDomainConfigurationResponse) => void): Request<Iot.Types.DescribeDomainConfigurationResponse, AWSError>;
  /**
   * Returns a unique endpoint specific to the Amazon Web Services account making the call. Requires permission to access the DescribeEndpoint action.
   */
  describeEndpoint(params: Iot.Types.DescribeEndpointRequest, callback?: (err: AWSError, data: Iot.Types.DescribeEndpointResponse) => void): Request<Iot.Types.DescribeEndpointResponse, AWSError>;
  /**
   * Returns a unique endpoint specific to the Amazon Web Services account making the call. Requires permission to access the DescribeEndpoint action.
   */
  describeEndpoint(callback?: (err: AWSError, data: Iot.Types.DescribeEndpointResponse) => void): Request<Iot.Types.DescribeEndpointResponse, AWSError>;
  /**
   * Describes event configurations. Requires permission to access the DescribeEventConfigurations action.
   */
  describeEventConfigurations(params: Iot.Types.DescribeEventConfigurationsRequest, callback?: (err: AWSError, data: Iot.Types.DescribeEventConfigurationsResponse) => void): Request<Iot.Types.DescribeEventConfigurationsResponse, AWSError>;
  /**
   * Describes event configurations. Requires permission to access the DescribeEventConfigurations action.
   */
  describeEventConfigurations(callback?: (err: AWSError, data: Iot.Types.DescribeEventConfigurationsResponse) => void): Request<Iot.Types.DescribeEventConfigurationsResponse, AWSError>;
  /**
   * Gets information about the specified fleet metric. Requires permission to access the DescribeFleetMetric action.
   */
  describeFleetMetric(params: Iot.Types.DescribeFleetMetricRequest, callback?: (err: AWSError, data: Iot.Types.DescribeFleetMetricResponse) => void): Request<Iot.Types.DescribeFleetMetricResponse, AWSError>;
  /**
   * Gets information about the specified fleet metric. Requires permission to access the DescribeFleetMetric action.
   */
  describeFleetMetric(callback?: (err: AWSError, data: Iot.Types.DescribeFleetMetricResponse) => void): Request<Iot.Types.DescribeFleetMetricResponse, AWSError>;
  /**
   * Describes a search index. Requires permission to access the DescribeIndex action.
   */
  describeIndex(params: Iot.Types.DescribeIndexRequest, callback?: (err: AWSError, data: Iot.Types.DescribeIndexResponse) => void): Request<Iot.Types.DescribeIndexResponse, AWSError>;
  /**
   * Describes a search index. Requires permission to access the DescribeIndex action.
   */
  describeIndex(callback?: (err: AWSError, data: Iot.Types.DescribeIndexResponse) => void): Request<Iot.Types.DescribeIndexResponse, AWSError>;
  /**
   * Describes a job. Requires permission to access the DescribeJob action.
   */
  describeJob(params: Iot.Types.DescribeJobRequest, callback?: (err: AWSError, data: Iot.Types.DescribeJobResponse) => void): Request<Iot.Types.DescribeJobResponse, AWSError>;
  /**
   * Describes a job. Requires permission to access the DescribeJob action.
   */
  describeJob(callback?: (err: AWSError, data: Iot.Types.DescribeJobResponse) => void): Request<Iot.Types.DescribeJobResponse, AWSError>;
  /**
   * Describes a job execution. Requires permission to access the DescribeJobExecution action.
   */
  describeJobExecution(params: Iot.Types.DescribeJobExecutionRequest, callback?: (err: AWSError, data: Iot.Types.DescribeJobExecutionResponse) => void): Request<Iot.Types.DescribeJobExecutionResponse, AWSError>;
  /**
   * Describes a job execution. Requires permission to access the DescribeJobExecution action.
   */
  describeJobExecution(callback?: (err: AWSError, data: Iot.Types.DescribeJobExecutionResponse) => void): Request<Iot.Types.DescribeJobExecutionResponse, AWSError>;
  /**
   * Returns information about a job template.
   */
  describeJobTemplate(params: Iot.Types.DescribeJobTemplateRequest, callback?: (err: AWSError, data: Iot.Types.DescribeJobTemplateResponse) => void): Request<Iot.Types.DescribeJobTemplateResponse, AWSError>;
  /**
   * Returns information about a job template.
   */
  describeJobTemplate(callback?: (err: AWSError, data: Iot.Types.DescribeJobTemplateResponse) => void): Request<Iot.Types.DescribeJobTemplateResponse, AWSError>;
  /**
   * View details of a managed job template.
   */
  describeManagedJobTemplate(params: Iot.Types.DescribeManagedJobTemplateRequest, callback?: (err: AWSError, data: Iot.Types.DescribeManagedJobTemplateResponse) => void): Request<Iot.Types.DescribeManagedJobTemplateResponse, AWSError>;
  /**
   * View details of a managed job template.
   */
  describeManagedJobTemplate(callback?: (err: AWSError, data: Iot.Types.DescribeManagedJobTemplateResponse) => void): Request<Iot.Types.DescribeManagedJobTemplateResponse, AWSError>;
  /**
   * Gets information about a mitigation action. Requires permission to access the DescribeMitigationAction action.
   */
  describeMitigationAction(params: Iot.Types.DescribeMitigationActionRequest, callback?: (err: AWSError, data: Iot.Types.DescribeMitigationActionResponse) => void): Request<Iot.Types.DescribeMitigationActionResponse, AWSError>;
  /**
   * Gets information about a mitigation action. Requires permission to access the DescribeMitigationAction action.
   */
  describeMitigationAction(callback?: (err: AWSError, data: Iot.Types.DescribeMitigationActionResponse) => void): Request<Iot.Types.DescribeMitigationActionResponse, AWSError>;
  /**
   * Returns information about a provisioning template. Requires permission to access the DescribeProvisioningTemplate action.
   */
  describeProvisioningTemplate(params: Iot.Types.DescribeProvisioningTemplateRequest, callback?: (err: AWSError, data: Iot.Types.DescribeProvisioningTemplateResponse) => void): Request<Iot.Types.DescribeProvisioningTemplateResponse, AWSError>;
  /**
   * Returns information about a provisioning template. Requires permission to access the DescribeProvisioningTemplate action.
   */
  describeProvisioningTemplate(callback?: (err: AWSError, data: Iot.Types.DescribeProvisioningTemplateResponse) => void): Request<Iot.Types.DescribeProvisioningTemplateResponse, AWSError>;
  /**
   * Returns information about a provisioning template version. Requires permission to access the DescribeProvisioningTemplateVersion action.
   */
  describeProvisioningTemplateVersion(params: Iot.Types.DescribeProvisioningTemplateVersionRequest, callback?: (err: AWSError, data: Iot.Types.DescribeProvisioningTemplateVersionResponse) => void): Request<Iot.Types.DescribeProvisioningTemplateVersionResponse, AWSError>;
  /**
   * Returns information about a provisioning template version. Requires permission to access the DescribeProvisioningTemplateVersion action.
   */
  describeProvisioningTemplateVersion(callback?: (err: AWSError, data: Iot.Types.DescribeProvisioningTemplateVersionResponse) => void): Request<Iot.Types.DescribeProvisioningTemplateVersionResponse, AWSError>;
  /**
   * Describes a role alias. Requires permission to access the DescribeRoleAlias action.
   */
  describeRoleAlias(params: Iot.Types.DescribeRoleAliasRequest, callback?: (err: AWSError, data: Iot.Types.DescribeRoleAliasResponse) => void): Request<Iot.Types.DescribeRoleAliasResponse, AWSError>;
  /**
   * Describes a role alias. Requires permission to access the DescribeRoleAlias action.
   */
  describeRoleAlias(callback?: (err: AWSError, data: Iot.Types.DescribeRoleAliasResponse) => void): Request<Iot.Types.DescribeRoleAliasResponse, AWSError>;
  /**
   * Gets information about a scheduled audit. Requires permission to access the DescribeScheduledAudit action.
   */
  describeScheduledAudit(params: Iot.Types.DescribeScheduledAuditRequest, callback?: (err: AWSError, data: Iot.Types.DescribeScheduledAuditResponse) => void): Request<Iot.Types.DescribeScheduledAuditResponse, AWSError>;
  /**
   * Gets information about a scheduled audit. Requires permission to access the DescribeScheduledAudit action.
   */
  describeScheduledAudit(callback?: (err: AWSError, data: Iot.Types.DescribeScheduledAuditResponse) => void): Request<Iot.Types.DescribeScheduledAuditResponse, AWSError>;
  /**
   * Gets information about a Device Defender security profile. Requires permission to access the DescribeSecurityProfile action.
   */
  describeSecurityProfile(params: Iot.Types.DescribeSecurityProfileRequest, callback?: (err: AWSError, data: Iot.Types.DescribeSecurityProfileResponse) => void): Request<Iot.Types.DescribeSecurityProfileResponse, AWSError>;
  /**
   * Gets information about a Device Defender security profile. Requires permission to access the DescribeSecurityProfile action.
   */
  describeSecurityProfile(callback?: (err: AWSError, data: Iot.Types.DescribeSecurityProfileResponse) => void): Request<Iot.Types.DescribeSecurityProfileResponse, AWSError>;
  /**
   * Gets information about a stream. Requires permission to access the DescribeStream action.
   */
  describeStream(params: Iot.Types.DescribeStreamRequest, callback?: (err: AWSError, data: Iot.Types.DescribeStreamResponse) => void): Request<Iot.Types.DescribeStreamResponse, AWSError>;
  /**
   * Gets information about a stream. Requires permission to access the DescribeStream action.
   */
  describeStream(callback?: (err: AWSError, data: Iot.Types.DescribeStreamResponse) => void): Request<Iot.Types.DescribeStreamResponse, AWSError>;
  /**
   * Gets information about the specified thing. Requires permission to access the DescribeThing action.
   */
  describeThing(params: Iot.Types.DescribeThingRequest, callback?: (err: AWSError, data: Iot.Types.DescribeThingResponse) => void): Request<Iot.Types.DescribeThingResponse, AWSError>;
  /**
   * Gets information about the specified thing. Requires permission to access the DescribeThing action.
   */
  describeThing(callback?: (err: AWSError, data: Iot.Types.DescribeThingResponse) => void): Request<Iot.Types.DescribeThingResponse, AWSError>;
  /**
   * Describe a thing group. Requires permission to access the DescribeThingGroup action.
   */
  describeThingGroup(params: Iot.Types.DescribeThingGroupRequest, callback?: (err: AWSError, data: Iot.Types.DescribeThingGroupResponse) => void): Request<Iot.Types.DescribeThingGroupResponse, AWSError>;
  /**
   * Describe a thing group. Requires permission to access the DescribeThingGroup action.
   */
  describeThingGroup(callback?: (err: AWSError, data: Iot.Types.DescribeThingGroupResponse) => void): Request<Iot.Types.DescribeThingGroupResponse, AWSError>;
  /**
   * Describes a bulk thing provisioning task. Requires permission to access the DescribeThingRegistrationTask action.
   */
  describeThingRegistrationTask(params: Iot.Types.DescribeThingRegistrationTaskRequest, callback?: (err: AWSError, data: Iot.Types.DescribeThingRegistrationTaskResponse) => void): Request<Iot.Types.DescribeThingRegistrationTaskResponse, AWSError>;
  /**
   * Describes a bulk thing provisioning task. Requires permission to access the DescribeThingRegistrationTask action.
   */
  describeThingRegistrationTask(callback?: (err: AWSError, data: Iot.Types.DescribeThingRegistrationTaskResponse) => void): Request<Iot.Types.DescribeThingRegistrationTaskResponse, AWSError>;
  /**
   * Gets information about the specified thing type. Requires permission to access the DescribeThingType action.
   */
  describeThingType(params: Iot.Types.DescribeThingTypeRequest, callback?: (err: AWSError, data: Iot.Types.DescribeThingTypeResponse) => void): Request<Iot.Types.DescribeThingTypeResponse, AWSError>;
  /**
   * Gets information about the specified thing type. Requires permission to access the DescribeThingType action.
   */
  describeThingType(callback?: (err: AWSError, data: Iot.Types.DescribeThingTypeResponse) => void): Request<Iot.Types.DescribeThingTypeResponse, AWSError>;
  /**
   * Detaches a policy from the specified target.  Because of the distributed nature of Amazon Web Services, it can take up to five minutes after a policy is detached before it's ready to be deleted.  Requires permission to access the DetachPolicy action.
   */
  detachPolicy(params: Iot.Types.DetachPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Detaches a policy from the specified target.  Because of the distributed nature of Amazon Web Services, it can take up to five minutes after a policy is detached before it's ready to be deleted.  Requires permission to access the DetachPolicy action.
   */
  detachPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified policy from the specified certificate.  Note: This action is deprecated and works as expected for backward compatibility, but we won't add enhancements. Use DetachPolicy instead. Requires permission to access the DetachPrincipalPolicy action.
   */
  detachPrincipalPolicy(params: Iot.Types.DetachPrincipalPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified policy from the specified certificate.  Note: This action is deprecated and works as expected for backward compatibility, but we won't add enhancements. Use DetachPolicy instead. Requires permission to access the DetachPrincipalPolicy action.
   */
  detachPrincipalPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociates a Device Defender security profile from a thing group or from this account. Requires permission to access the DetachSecurityProfile action.
   */
  detachSecurityProfile(params: Iot.Types.DetachSecurityProfileRequest, callback?: (err: AWSError, data: Iot.Types.DetachSecurityProfileResponse) => void): Request<Iot.Types.DetachSecurityProfileResponse, AWSError>;
  /**
   * Disassociates a Device Defender security profile from a thing group or from this account. Requires permission to access the DetachSecurityProfile action.
   */
  detachSecurityProfile(callback?: (err: AWSError, data: Iot.Types.DetachSecurityProfileResponse) => void): Request<Iot.Types.DetachSecurityProfileResponse, AWSError>;
  /**
   * Detaches the specified principal from the specified thing. A principal can be X.509 certificates, IAM users, groups, and roles, Amazon Cognito identities or federated identities.  This call is asynchronous. It might take several seconds for the detachment to propagate.  Requires permission to access the DetachThingPrincipal action.
   */
  detachThingPrincipal(params: Iot.Types.DetachThingPrincipalRequest, callback?: (err: AWSError, data: Iot.Types.DetachThingPrincipalResponse) => void): Request<Iot.Types.DetachThingPrincipalResponse, AWSError>;
  /**
   * Detaches the specified principal from the specified thing. A principal can be X.509 certificates, IAM users, groups, and roles, Amazon Cognito identities or federated identities.  This call is asynchronous. It might take several seconds for the detachment to propagate.  Requires permission to access the DetachThingPrincipal action.
   */
  detachThingPrincipal(callback?: (err: AWSError, data: Iot.Types.DetachThingPrincipalResponse) => void): Request<Iot.Types.DetachThingPrincipalResponse, AWSError>;
  /**
   * Disables the rule. Requires permission to access the DisableTopicRule action.
   */
  disableTopicRule(params: Iot.Types.DisableTopicRuleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disables the rule. Requires permission to access the DisableTopicRule action.
   */
  disableTopicRule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables the rule. Requires permission to access the EnableTopicRule action.
   */
  enableTopicRule(params: Iot.Types.EnableTopicRuleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables the rule. Requires permission to access the EnableTopicRule action.
   */
  enableTopicRule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Returns a Device Defender's ML Detect Security Profile training model's status.  Requires permission to access the GetBehaviorModelTrainingSummaries action.
   */
  getBehaviorModelTrainingSummaries(params: Iot.Types.GetBehaviorModelTrainingSummariesRequest, callback?: (err: AWSError, data: Iot.Types.GetBehaviorModelTrainingSummariesResponse) => void): Request<Iot.Types.GetBehaviorModelTrainingSummariesResponse, AWSError>;
  /**
   *  Returns a Device Defender's ML Detect Security Profile training model's status.  Requires permission to access the GetBehaviorModelTrainingSummaries action.
   */
  getBehaviorModelTrainingSummaries(callback?: (err: AWSError, data: Iot.Types.GetBehaviorModelTrainingSummariesResponse) => void): Request<Iot.Types.GetBehaviorModelTrainingSummariesResponse, AWSError>;
  /**
   * Aggregates on indexed data with search queries pertaining to particular fields.  Requires permission to access the GetBucketsAggregation action.
   */
  getBucketsAggregation(params: Iot.Types.GetBucketsAggregationRequest, callback?: (err: AWSError, data: Iot.Types.GetBucketsAggregationResponse) => void): Request<Iot.Types.GetBucketsAggregationResponse, AWSError>;
  /**
   * Aggregates on indexed data with search queries pertaining to particular fields.  Requires permission to access the GetBucketsAggregation action.
   */
  getBucketsAggregation(callback?: (err: AWSError, data: Iot.Types.GetBucketsAggregationResponse) => void): Request<Iot.Types.GetBucketsAggregationResponse, AWSError>;
  /**
   * Returns the approximate count of unique values that match the query. Requires permission to access the GetCardinality action.
   */
  getCardinality(params: Iot.Types.GetCardinalityRequest, callback?: (err: AWSError, data: Iot.Types.GetCardinalityResponse) => void): Request<Iot.Types.GetCardinalityResponse, AWSError>;
  /**
   * Returns the approximate count of unique values that match the query. Requires permission to access the GetCardinality action.
   */
  getCardinality(callback?: (err: AWSError, data: Iot.Types.GetCardinalityResponse) => void): Request<Iot.Types.GetCardinalityResponse, AWSError>;
  /**
   * Gets a list of the policies that have an effect on the authorization behavior of the specified device when it connects to the IoT device gateway. Requires permission to access the GetEffectivePolicies action.
   */
  getEffectivePolicies(params: Iot.Types.GetEffectivePoliciesRequest, callback?: (err: AWSError, data: Iot.Types.GetEffectivePoliciesResponse) => void): Request<Iot.Types.GetEffectivePoliciesResponse, AWSError>;
  /**
   * Gets a list of the policies that have an effect on the authorization behavior of the specified device when it connects to the IoT device gateway. Requires permission to access the GetEffectivePolicies action.
   */
  getEffectivePolicies(callback?: (err: AWSError, data: Iot.Types.GetEffectivePoliciesResponse) => void): Request<Iot.Types.GetEffectivePoliciesResponse, AWSError>;
  /**
   * Gets the indexing configuration. Requires permission to access the GetIndexingConfiguration action.
   */
  getIndexingConfiguration(params: Iot.Types.GetIndexingConfigurationRequest, callback?: (err: AWSError, data: Iot.Types.GetIndexingConfigurationResponse) => void): Request<Iot.Types.GetIndexingConfigurationResponse, AWSError>;
  /**
   * Gets the indexing configuration. Requires permission to access the GetIndexingConfiguration action.
   */
  getIndexingConfiguration(callback?: (err: AWSError, data: Iot.Types.GetIndexingConfigurationResponse) => void): Request<Iot.Types.GetIndexingConfigurationResponse, AWSError>;
  /**
   * Gets a job document. Requires permission to access the GetJobDocument action.
   */
  getJobDocument(params: Iot.Types.GetJobDocumentRequest, callback?: (err: AWSError, data: Iot.Types.GetJobDocumentResponse) => void): Request<Iot.Types.GetJobDocumentResponse, AWSError>;
  /**
   * Gets a job document. Requires permission to access the GetJobDocument action.
   */
  getJobDocument(callback?: (err: AWSError, data: Iot.Types.GetJobDocumentResponse) => void): Request<Iot.Types.GetJobDocumentResponse, AWSError>;
  /**
   * Gets the logging options. NOTE: use of this command is not recommended. Use GetV2LoggingOptions instead. Requires permission to access the GetLoggingOptions action.
   */
  getLoggingOptions(params: Iot.Types.GetLoggingOptionsRequest, callback?: (err: AWSError, data: Iot.Types.GetLoggingOptionsResponse) => void): Request<Iot.Types.GetLoggingOptionsResponse, AWSError>;
  /**
   * Gets the logging options. NOTE: use of this command is not recommended. Use GetV2LoggingOptions instead. Requires permission to access the GetLoggingOptions action.
   */
  getLoggingOptions(callback?: (err: AWSError, data: Iot.Types.GetLoggingOptionsResponse) => void): Request<Iot.Types.GetLoggingOptionsResponse, AWSError>;
  /**
   * Gets an OTA update. Requires permission to access the GetOTAUpdate action.
   */
  getOTAUpdate(params: Iot.Types.GetOTAUpdateRequest, callback?: (err: AWSError, data: Iot.Types.GetOTAUpdateResponse) => void): Request<Iot.Types.GetOTAUpdateResponse, AWSError>;
  /**
   * Gets an OTA update. Requires permission to access the GetOTAUpdate action.
   */
  getOTAUpdate(callback?: (err: AWSError, data: Iot.Types.GetOTAUpdateResponse) => void): Request<Iot.Types.GetOTAUpdateResponse, AWSError>;
  /**
   * Gets information about the specified software package. Requires permission to access the GetPackage action.
   */
  getPackage(params: Iot.Types.GetPackageRequest, callback?: (err: AWSError, data: Iot.Types.GetPackageResponse) => void): Request<Iot.Types.GetPackageResponse, AWSError>;
  /**
   * Gets information about the specified software package. Requires permission to access the GetPackage action.
   */
  getPackage(callback?: (err: AWSError, data: Iot.Types.GetPackageResponse) => void): Request<Iot.Types.GetPackageResponse, AWSError>;
  /**
   * Gets information about the specified software package's configuration. Requires permission to access the GetPackageConfiguration action.
   */
  getPackageConfiguration(params: Iot.Types.GetPackageConfigurationRequest, callback?: (err: AWSError, data: Iot.Types.GetPackageConfigurationResponse) => void): Request<Iot.Types.GetPackageConfigurationResponse, AWSError>;
  /**
   * Gets information about the specified software package's configuration. Requires permission to access the GetPackageConfiguration action.
   */
  getPackageConfiguration(callback?: (err: AWSError, data: Iot.Types.GetPackageConfigurationResponse) => void): Request<Iot.Types.GetPackageConfigurationResponse, AWSError>;
  /**
   * Gets information about the specified package version.  Requires permission to access the GetPackageVersion action.
   */
  getPackageVersion(params: Iot.Types.GetPackageVersionRequest, callback?: (err: AWSError, data: Iot.Types.GetPackageVersionResponse) => void): Request<Iot.Types.GetPackageVersionResponse, AWSError>;
  /**
   * Gets information about the specified package version.  Requires permission to access the GetPackageVersion action.
   */
  getPackageVersion(callback?: (err: AWSError, data: Iot.Types.GetPackageVersionResponse) => void): Request<Iot.Types.GetPackageVersionResponse, AWSError>;
  /**
   * Groups the aggregated values that match the query into percentile groupings. The default percentile groupings are: 1,5,25,50,75,95,99, although you can specify your own when you call GetPercentiles. This function returns a value for each percentile group specified (or the default percentile groupings). The percentile group "1" contains the aggregated field value that occurs in approximately one percent of the values that match the query. The percentile group "5" contains the aggregated field value that occurs in approximately five percent of the values that match the query, and so on. The result is an approximation, the more values that match the query, the more accurate the percentile values. Requires permission to access the GetPercentiles action.
   */
  getPercentiles(params: Iot.Types.GetPercentilesRequest, callback?: (err: AWSError, data: Iot.Types.GetPercentilesResponse) => void): Request<Iot.Types.GetPercentilesResponse, AWSError>;
  /**
   * Groups the aggregated values that match the query into percentile groupings. The default percentile groupings are: 1,5,25,50,75,95,99, although you can specify your own when you call GetPercentiles. This function returns a value for each percentile group specified (or the default percentile groupings). The percentile group "1" contains the aggregated field value that occurs in approximately one percent of the values that match the query. The percentile group "5" contains the aggregated field value that occurs in approximately five percent of the values that match the query, and so on. The result is an approximation, the more values that match the query, the more accurate the percentile values. Requires permission to access the GetPercentiles action.
   */
  getPercentiles(callback?: (err: AWSError, data: Iot.Types.GetPercentilesResponse) => void): Request<Iot.Types.GetPercentilesResponse, AWSError>;
  /**
   * Gets information about the specified policy with the policy document of the default version. Requires permission to access the GetPolicy action.
   */
  getPolicy(params: Iot.Types.GetPolicyRequest, callback?: (err: AWSError, data: Iot.Types.GetPolicyResponse) => void): Request<Iot.Types.GetPolicyResponse, AWSError>;
  /**
   * Gets information about the specified policy with the policy document of the default version. Requires permission to access the GetPolicy action.
   */
  getPolicy(callback?: (err: AWSError, data: Iot.Types.GetPolicyResponse) => void): Request<Iot.Types.GetPolicyResponse, AWSError>;
  /**
   * Gets information about the specified policy version. Requires permission to access the GetPolicyVersion action.
   */
  getPolicyVersion(params: Iot.Types.GetPolicyVersionRequest, callback?: (err: AWSError, data: Iot.Types.GetPolicyVersionResponse) => void): Request<Iot.Types.GetPolicyVersionResponse, AWSError>;
  /**
   * Gets information about the specified policy version. Requires permission to access the GetPolicyVersion action.
   */
  getPolicyVersion(callback?: (err: AWSError, data: Iot.Types.GetPolicyVersionResponse) => void): Request<Iot.Types.GetPolicyVersionResponse, AWSError>;
  /**
   * Gets a registration code used to register a CA certificate with IoT. Requires permission to access the GetRegistrationCode action.
   */
  getRegistrationCode(params: Iot.Types.GetRegistrationCodeRequest, callback?: (err: AWSError, data: Iot.Types.GetRegistrationCodeResponse) => void): Request<Iot.Types.GetRegistrationCodeResponse, AWSError>;
  /**
   * Gets a registration code used to register a CA certificate with IoT. Requires permission to access the GetRegistrationCode action.
   */
  getRegistrationCode(callback?: (err: AWSError, data: Iot.Types.GetRegistrationCodeResponse) => void): Request<Iot.Types.GetRegistrationCodeResponse, AWSError>;
  /**
   * Returns the count, average, sum, minimum, maximum, sum of squares, variance, and standard deviation for the specified aggregated field. If the aggregation field is of type String, only the count statistic is returned. Requires permission to access the GetStatistics action.
   */
  getStatistics(params: Iot.Types.GetStatisticsRequest, callback?: (err: AWSError, data: Iot.Types.GetStatisticsResponse) => void): Request<Iot.Types.GetStatisticsResponse, AWSError>;
  /**
   * Returns the count, average, sum, minimum, maximum, sum of squares, variance, and standard deviation for the specified aggregated field. If the aggregation field is of type String, only the count statistic is returned. Requires permission to access the GetStatistics action.
   */
  getStatistics(callback?: (err: AWSError, data: Iot.Types.GetStatisticsResponse) => void): Request<Iot.Types.GetStatisticsResponse, AWSError>;
  /**
   * Gets information about the rule. Requires permission to access the GetTopicRule action.
   */
  getTopicRule(params: Iot.Types.GetTopicRuleRequest, callback?: (err: AWSError, data: Iot.Types.GetTopicRuleResponse) => void): Request<Iot.Types.GetTopicRuleResponse, AWSError>;
  /**
   * Gets information about the rule. Requires permission to access the GetTopicRule action.
   */
  getTopicRule(callback?: (err: AWSError, data: Iot.Types.GetTopicRuleResponse) => void): Request<Iot.Types.GetTopicRuleResponse, AWSError>;
  /**
   * Gets information about a topic rule destination. Requires permission to access the GetTopicRuleDestination action.
   */
  getTopicRuleDestination(params: Iot.Types.GetTopicRuleDestinationRequest, callback?: (err: AWSError, data: Iot.Types.GetTopicRuleDestinationResponse) => void): Request<Iot.Types.GetTopicRuleDestinationResponse, AWSError>;
  /**
   * Gets information about a topic rule destination. Requires permission to access the GetTopicRuleDestination action.
   */
  getTopicRuleDestination(callback?: (err: AWSError, data: Iot.Types.GetTopicRuleDestinationResponse) => void): Request<Iot.Types.GetTopicRuleDestinationResponse, AWSError>;
  /**
   * Gets the fine grained logging options. Requires permission to access the GetV2LoggingOptions action.
   */
  getV2LoggingOptions(params: Iot.Types.GetV2LoggingOptionsRequest, callback?: (err: AWSError, data: Iot.Types.GetV2LoggingOptionsResponse) => void): Request<Iot.Types.GetV2LoggingOptionsResponse, AWSError>;
  /**
   * Gets the fine grained logging options. Requires permission to access the GetV2LoggingOptions action.
   */
  getV2LoggingOptions(callback?: (err: AWSError, data: Iot.Types.GetV2LoggingOptionsResponse) => void): Request<Iot.Types.GetV2LoggingOptionsResponse, AWSError>;
  /**
   * Lists the active violations for a given Device Defender security profile. Requires permission to access the ListActiveViolations action.
   */
  listActiveViolations(params: Iot.Types.ListActiveViolationsRequest, callback?: (err: AWSError, data: Iot.Types.ListActiveViolationsResponse) => void): Request<Iot.Types.ListActiveViolationsResponse, AWSError>;
  /**
   * Lists the active violations for a given Device Defender security profile. Requires permission to access the ListActiveViolations action.
   */
  listActiveViolations(callback?: (err: AWSError, data: Iot.Types.ListActiveViolationsResponse) => void): Request<Iot.Types.ListActiveViolationsResponse, AWSError>;
  /**
   * Lists the policies attached to the specified thing group. Requires permission to access the ListAttachedPolicies action.
   */
  listAttachedPolicies(params: Iot.Types.ListAttachedPoliciesRequest, callback?: (err: AWSError, data: Iot.Types.ListAttachedPoliciesResponse) => void): Request<Iot.Types.ListAttachedPoliciesResponse, AWSError>;
  /**
   * Lists the policies attached to the specified thing group. Requires permission to access the ListAttachedPolicies action.
   */
  listAttachedPolicies(callback?: (err: AWSError, data: Iot.Types.ListAttachedPoliciesResponse) => void): Request<Iot.Types.ListAttachedPoliciesResponse, AWSError>;
  /**
   * Lists the findings (results) of a Device Defender audit or of the audits performed during a specified time period. (Findings are retained for 90 days.) Requires permission to access the ListAuditFindings action.
   */
  listAuditFindings(params: Iot.Types.ListAuditFindingsRequest, callback?: (err: AWSError, data: Iot.Types.ListAuditFindingsResponse) => void): Request<Iot.Types.ListAuditFindingsResponse, AWSError>;
  /**
   * Lists the findings (results) of a Device Defender audit or of the audits performed during a specified time period. (Findings are retained for 90 days.) Requires permission to access the ListAuditFindings action.
   */
  listAuditFindings(callback?: (err: AWSError, data: Iot.Types.ListAuditFindingsResponse) => void): Request<Iot.Types.ListAuditFindingsResponse, AWSError>;
  /**
   * Gets the status of audit mitigation action tasks that were executed. Requires permission to access the ListAuditMitigationActionsExecutions action.
   */
  listAuditMitigationActionsExecutions(params: Iot.Types.ListAuditMitigationActionsExecutionsRequest, callback?: (err: AWSError, data: Iot.Types.ListAuditMitigationActionsExecutionsResponse) => void): Request<Iot.Types.ListAuditMitigationActionsExecutionsResponse, AWSError>;
  /**
   * Gets the status of audit mitigation action tasks that were executed. Requires permission to access the ListAuditMitigationActionsExecutions action.
   */
  listAuditMitigationActionsExecutions(callback?: (err: AWSError, data: Iot.Types.ListAuditMitigationActionsExecutionsResponse) => void): Request<Iot.Types.ListAuditMitigationActionsExecutionsResponse, AWSError>;
  /**
   * Gets a list of audit mitigation action tasks that match the specified filters. Requires permission to access the ListAuditMitigationActionsTasks action.
   */
  listAuditMitigationActionsTasks(params: Iot.Types.ListAuditMitigationActionsTasksRequest, callback?: (err: AWSError, data: Iot.Types.ListAuditMitigationActionsTasksResponse) => void): Request<Iot.Types.ListAuditMitigationActionsTasksResponse, AWSError>;
  /**
   * Gets a list of audit mitigation action tasks that match the specified filters. Requires permission to access the ListAuditMitigationActionsTasks action.
   */
  listAuditMitigationActionsTasks(callback?: (err: AWSError, data: Iot.Types.ListAuditMitigationActionsTasksResponse) => void): Request<Iot.Types.ListAuditMitigationActionsTasksResponse, AWSError>;
  /**
   *  Lists your Device Defender audit listings.  Requires permission to access the ListAuditSuppressions action.
   */
  listAuditSuppressions(params: Iot.Types.ListAuditSuppressionsRequest, callback?: (err: AWSError, data: Iot.Types.ListAuditSuppressionsResponse) => void): Request<Iot.Types.ListAuditSuppressionsResponse, AWSError>;
  /**
   *  Lists your Device Defender audit listings.  Requires permission to access the ListAuditSuppressions action.
   */
  listAuditSuppressions(callback?: (err: AWSError, data: Iot.Types.ListAuditSuppressionsResponse) => void): Request<Iot.Types.ListAuditSuppressionsResponse, AWSError>;
  /**
   * Lists the Device Defender audits that have been performed during a given time period. Requires permission to access the ListAuditTasks action.
   */
  listAuditTasks(params: Iot.Types.ListAuditTasksRequest, callback?: (err: AWSError, data: Iot.Types.ListAuditTasksResponse) => void): Request<Iot.Types.ListAuditTasksResponse, AWSError>;
  /**
   * Lists the Device Defender audits that have been performed during a given time period. Requires permission to access the ListAuditTasks action.
   */
  listAuditTasks(callback?: (err: AWSError, data: Iot.Types.ListAuditTasksResponse) => void): Request<Iot.Types.ListAuditTasksResponse, AWSError>;
  /**
   * Lists the authorizers registered in your account. Requires permission to access the ListAuthorizers action.
   */
  listAuthorizers(params: Iot.Types.ListAuthorizersRequest, callback?: (err: AWSError, data: Iot.Types.ListAuthorizersResponse) => void): Request<Iot.Types.ListAuthorizersResponse, AWSError>;
  /**
   * Lists the authorizers registered in your account. Requires permission to access the ListAuthorizers action.
   */
  listAuthorizers(callback?: (err: AWSError, data: Iot.Types.ListAuthorizersResponse) => void): Request<Iot.Types.ListAuthorizersResponse, AWSError>;
  /**
   * Lists the billing groups you have created. Requires permission to access the ListBillingGroups action.
   */
  listBillingGroups(params: Iot.Types.ListBillingGroupsRequest, callback?: (err: AWSError, data: Iot.Types.ListBillingGroupsResponse) => void): Request<Iot.Types.ListBillingGroupsResponse, AWSError>;
  /**
   * Lists the billing groups you have created. Requires permission to access the ListBillingGroups action.
   */
  listBillingGroups(callback?: (err: AWSError, data: Iot.Types.ListBillingGroupsResponse) => void): Request<Iot.Types.ListBillingGroupsResponse, AWSError>;
  /**
   * Lists the CA certificates registered for your Amazon Web Services account. The results are paginated with a default page size of 25. You can use the returned marker to retrieve additional results. Requires permission to access the ListCACertificates action.
   */
  listCACertificates(params: Iot.Types.ListCACertificatesRequest, callback?: (err: AWSError, data: Iot.Types.ListCACertificatesResponse) => void): Request<Iot.Types.ListCACertificatesResponse, AWSError>;
  /**
   * Lists the CA certificates registered for your Amazon Web Services account. The results are paginated with a default page size of 25. You can use the returned marker to retrieve additional results. Requires permission to access the ListCACertificates action.
   */
  listCACertificates(callback?: (err: AWSError, data: Iot.Types.ListCACertificatesResponse) => void): Request<Iot.Types.ListCACertificatesResponse, AWSError>;
  /**
   * Lists the certificates registered in your Amazon Web Services account. The results are paginated with a default page size of 25. You can use the returned marker to retrieve additional results. Requires permission to access the ListCertificates action.
   */
  listCertificates(params: Iot.Types.ListCertificatesRequest, callback?: (err: AWSError, data: Iot.Types.ListCertificatesResponse) => void): Request<Iot.Types.ListCertificatesResponse, AWSError>;
  /**
   * Lists the certificates registered in your Amazon Web Services account. The results are paginated with a default page size of 25. You can use the returned marker to retrieve additional results. Requires permission to access the ListCertificates action.
   */
  listCertificates(callback?: (err: AWSError, data: Iot.Types.ListCertificatesResponse) => void): Request<Iot.Types.ListCertificatesResponse, AWSError>;
  /**
   * List the device certificates signed by the specified CA certificate. Requires permission to access the ListCertificatesByCA action.
   */
  listCertificatesByCA(params: Iot.Types.ListCertificatesByCARequest, callback?: (err: AWSError, data: Iot.Types.ListCertificatesByCAResponse) => void): Request<Iot.Types.ListCertificatesByCAResponse, AWSError>;
  /**
   * List the device certificates signed by the specified CA certificate. Requires permission to access the ListCertificatesByCA action.
   */
  listCertificatesByCA(callback?: (err: AWSError, data: Iot.Types.ListCertificatesByCAResponse) => void): Request<Iot.Types.ListCertificatesByCAResponse, AWSError>;
  /**
   *  Lists your Device Defender detect custom metrics.  Requires permission to access the ListCustomMetrics action.
   */
  listCustomMetrics(params: Iot.Types.ListCustomMetricsRequest, callback?: (err: AWSError, data: Iot.Types.ListCustomMetricsResponse) => void): Request<Iot.Types.ListCustomMetricsResponse, AWSError>;
  /**
   *  Lists your Device Defender detect custom metrics.  Requires permission to access the ListCustomMetrics action.
   */
  listCustomMetrics(callback?: (err: AWSError, data: Iot.Types.ListCustomMetricsResponse) => void): Request<Iot.Types.ListCustomMetricsResponse, AWSError>;
  /**
   *  Lists mitigation actions executions for a Device Defender ML Detect Security Profile.  Requires permission to access the ListDetectMitigationActionsExecutions action.
   */
  listDetectMitigationActionsExecutions(params: Iot.Types.ListDetectMitigationActionsExecutionsRequest, callback?: (err: AWSError, data: Iot.Types.ListDetectMitigationActionsExecutionsResponse) => void): Request<Iot.Types.ListDetectMitigationActionsExecutionsResponse, AWSError>;
  /**
   *  Lists mitigation actions executions for a Device Defender ML Detect Security Profile.  Requires permission to access the ListDetectMitigationActionsExecutions action.
   */
  listDetectMitigationActionsExecutions(callback?: (err: AWSError, data: Iot.Types.ListDetectMitigationActionsExecutionsResponse) => void): Request<Iot.Types.ListDetectMitigationActionsExecutionsResponse, AWSError>;
  /**
   *  List of Device Defender ML Detect mitigation actions tasks.  Requires permission to access the ListDetectMitigationActionsTasks action.
   */
  listDetectMitigationActionsTasks(params: Iot.Types.ListDetectMitigationActionsTasksRequest, callback?: (err: AWSError, data: Iot.Types.ListDetectMitigationActionsTasksResponse) => void): Request<Iot.Types.ListDetectMitigationActionsTasksResponse, AWSError>;
  /**
   *  List of Device Defender ML Detect mitigation actions tasks.  Requires permission to access the ListDetectMitigationActionsTasks action.
   */
  listDetectMitigationActionsTasks(callback?: (err: AWSError, data: Iot.Types.ListDetectMitigationActionsTasksResponse) => void): Request<Iot.Types.ListDetectMitigationActionsTasksResponse, AWSError>;
  /**
   * List the set of dimensions that are defined for your Amazon Web Services accounts. Requires permission to access the ListDimensions action.
   */
  listDimensions(params: Iot.Types.ListDimensionsRequest, callback?: (err: AWSError, data: Iot.Types.ListDimensionsResponse) => void): Request<Iot.Types.ListDimensionsResponse, AWSError>;
  /**
   * List the set of dimensions that are defined for your Amazon Web Services accounts. Requires permission to access the ListDimensions action.
   */
  listDimensions(callback?: (err: AWSError, data: Iot.Types.ListDimensionsResponse) => void): Request<Iot.Types.ListDimensionsResponse, AWSError>;
  /**
   * Gets a list of domain configurations for the user. This list is sorted alphabetically by domain configuration name. Requires permission to access the ListDomainConfigurations action.
   */
  listDomainConfigurations(params: Iot.Types.ListDomainConfigurationsRequest, callback?: (err: AWSError, data: Iot.Types.ListDomainConfigurationsResponse) => void): Request<Iot.Types.ListDomainConfigurationsResponse, AWSError>;
  /**
   * Gets a list of domain configurations for the user. This list is sorted alphabetically by domain configuration name. Requires permission to access the ListDomainConfigurations action.
   */
  listDomainConfigurations(callback?: (err: AWSError, data: Iot.Types.ListDomainConfigurationsResponse) => void): Request<Iot.Types.ListDomainConfigurationsResponse, AWSError>;
  /**
   * Lists all your fleet metrics.  Requires permission to access the ListFleetMetrics action.
   */
  listFleetMetrics(params: Iot.Types.ListFleetMetricsRequest, callback?: (err: AWSError, data: Iot.Types.ListFleetMetricsResponse) => void): Request<Iot.Types.ListFleetMetricsResponse, AWSError>;
  /**
   * Lists all your fleet metrics.  Requires permission to access the ListFleetMetrics action.
   */
  listFleetMetrics(callback?: (err: AWSError, data: Iot.Types.ListFleetMetricsResponse) => void): Request<Iot.Types.ListFleetMetricsResponse, AWSError>;
  /**
   * Lists the search indices. Requires permission to access the ListIndices action.
   */
  listIndices(params: Iot.Types.ListIndicesRequest, callback?: (err: AWSError, data: Iot.Types.ListIndicesResponse) => void): Request<Iot.Types.ListIndicesResponse, AWSError>;
  /**
   * Lists the search indices. Requires permission to access the ListIndices action.
   */
  listIndices(callback?: (err: AWSError, data: Iot.Types.ListIndicesResponse) => void): Request<Iot.Types.ListIndicesResponse, AWSError>;
  /**
   * Lists the job executions for a job. Requires permission to access the ListJobExecutionsForJob action.
   */
  listJobExecutionsForJob(params: Iot.Types.ListJobExecutionsForJobRequest, callback?: (err: AWSError, data: Iot.Types.ListJobExecutionsForJobResponse) => void): Request<Iot.Types.ListJobExecutionsForJobResponse, AWSError>;
  /**
   * Lists the job executions for a job. Requires permission to access the ListJobExecutionsForJob action.
   */
  listJobExecutionsForJob(callback?: (err: AWSError, data: Iot.Types.ListJobExecutionsForJobResponse) => void): Request<Iot.Types.ListJobExecutionsForJobResponse, AWSError>;
  /**
   * Lists the job executions for the specified thing. Requires permission to access the ListJobExecutionsForThing action.
   */
  listJobExecutionsForThing(params: Iot.Types.ListJobExecutionsForThingRequest, callback?: (err: AWSError, data: Iot.Types.ListJobExecutionsForThingResponse) => void): Request<Iot.Types.ListJobExecutionsForThingResponse, AWSError>;
  /**
   * Lists the job executions for the specified thing. Requires permission to access the ListJobExecutionsForThing action.
   */
  listJobExecutionsForThing(callback?: (err: AWSError, data: Iot.Types.ListJobExecutionsForThingResponse) => void): Request<Iot.Types.ListJobExecutionsForThingResponse, AWSError>;
  /**
   * Returns a list of job templates. Requires permission to access the ListJobTemplates action.
   */
  listJobTemplates(params: Iot.Types.ListJobTemplatesRequest, callback?: (err: AWSError, data: Iot.Types.ListJobTemplatesResponse) => void): Request<Iot.Types.ListJobTemplatesResponse, AWSError>;
  /**
   * Returns a list of job templates. Requires permission to access the ListJobTemplates action.
   */
  listJobTemplates(callback?: (err: AWSError, data: Iot.Types.ListJobTemplatesResponse) => void): Request<Iot.Types.ListJobTemplatesResponse, AWSError>;
  /**
   * Lists jobs. Requires permission to access the ListJobs action.
   */
  listJobs(params: Iot.Types.ListJobsRequest, callback?: (err: AWSError, data: Iot.Types.ListJobsResponse) => void): Request<Iot.Types.ListJobsResponse, AWSError>;
  /**
   * Lists jobs. Requires permission to access the ListJobs action.
   */
  listJobs(callback?: (err: AWSError, data: Iot.Types.ListJobsResponse) => void): Request<Iot.Types.ListJobsResponse, AWSError>;
  /**
   * Returns a list of managed job templates.
   */
  listManagedJobTemplates(params: Iot.Types.ListManagedJobTemplatesRequest, callback?: (err: AWSError, data: Iot.Types.ListManagedJobTemplatesResponse) => void): Request<Iot.Types.ListManagedJobTemplatesResponse, AWSError>;
  /**
   * Returns a list of managed job templates.
   */
  listManagedJobTemplates(callback?: (err: AWSError, data: Iot.Types.ListManagedJobTemplatesResponse) => void): Request<Iot.Types.ListManagedJobTemplatesResponse, AWSError>;
  /**
   * Lists the values reported for an IoT Device Defender metric (device-side metric, cloud-side metric, or custom metric) by the given thing during the specified time period.
   */
  listMetricValues(params: Iot.Types.ListMetricValuesRequest, callback?: (err: AWSError, data: Iot.Types.ListMetricValuesResponse) => void): Request<Iot.Types.ListMetricValuesResponse, AWSError>;
  /**
   * Lists the values reported for an IoT Device Defender metric (device-side metric, cloud-side metric, or custom metric) by the given thing during the specified time period.
   */
  listMetricValues(callback?: (err: AWSError, data: Iot.Types.ListMetricValuesResponse) => void): Request<Iot.Types.ListMetricValuesResponse, AWSError>;
  /**
   * Gets a list of all mitigation actions that match the specified filter criteria. Requires permission to access the ListMitigationActions action.
   */
  listMitigationActions(params: Iot.Types.ListMitigationActionsRequest, callback?: (err: AWSError, data: Iot.Types.ListMitigationActionsResponse) => void): Request<Iot.Types.ListMitigationActionsResponse, AWSError>;
  /**
   * Gets a list of all mitigation actions that match the specified filter criteria. Requires permission to access the ListMitigationActions action.
   */
  listMitigationActions(callback?: (err: AWSError, data: Iot.Types.ListMitigationActionsResponse) => void): Request<Iot.Types.ListMitigationActionsResponse, AWSError>;
  /**
   * Lists OTA updates. Requires permission to access the ListOTAUpdates action.
   */
  listOTAUpdates(params: Iot.Types.ListOTAUpdatesRequest, callback?: (err: AWSError, data: Iot.Types.ListOTAUpdatesResponse) => void): Request<Iot.Types.ListOTAUpdatesResponse, AWSError>;
  /**
   * Lists OTA updates. Requires permission to access the ListOTAUpdates action.
   */
  listOTAUpdates(callback?: (err: AWSError, data: Iot.Types.ListOTAUpdatesResponse) => void): Request<Iot.Types.ListOTAUpdatesResponse, AWSError>;
  /**
   * Lists certificates that are being transferred but not yet accepted. Requires permission to access the ListOutgoingCertificates action.
   */
  listOutgoingCertificates(params: Iot.Types.ListOutgoingCertificatesRequest, callback?: (err: AWSError, data: Iot.Types.ListOutgoingCertificatesResponse) => void): Request<Iot.Types.ListOutgoingCertificatesResponse, AWSError>;
  /**
   * Lists certificates that are being transferred but not yet accepted. Requires permission to access the ListOutgoingCertificates action.
   */
  listOutgoingCertificates(callback?: (err: AWSError, data: Iot.Types.ListOutgoingCertificatesResponse) => void): Request<Iot.Types.ListOutgoingCertificatesResponse, AWSError>;
  /**
   * Lists the software package versions associated to the account. Requires permission to access the ListPackageVersions action.
   */
  listPackageVersions(params: Iot.Types.ListPackageVersionsRequest, callback?: (err: AWSError, data: Iot.Types.ListPackageVersionsResponse) => void): Request<Iot.Types.ListPackageVersionsResponse, AWSError>;
  /**
   * Lists the software package versions associated to the account. Requires permission to access the ListPackageVersions action.
   */
  listPackageVersions(callback?: (err: AWSError, data: Iot.Types.ListPackageVersionsResponse) => void): Request<Iot.Types.ListPackageVersionsResponse, AWSError>;
  /**
   * Lists the software packages associated to the account. Requires permission to access the ListPackages action.
   */
  listPackages(params: Iot.Types.ListPackagesRequest, callback?: (err: AWSError, data: Iot.Types.ListPackagesResponse) => void): Request<Iot.Types.ListPackagesResponse, AWSError>;
  /**
   * Lists the software packages associated to the account. Requires permission to access the ListPackages action.
   */
  listPackages(callback?: (err: AWSError, data: Iot.Types.ListPackagesResponse) => void): Request<Iot.Types.ListPackagesResponse, AWSError>;
  /**
   * Lists your policies. Requires permission to access the ListPolicies action.
   */
  listPolicies(params: Iot.Types.ListPoliciesRequest, callback?: (err: AWSError, data: Iot.Types.ListPoliciesResponse) => void): Request<Iot.Types.ListPoliciesResponse, AWSError>;
  /**
   * Lists your policies. Requires permission to access the ListPolicies action.
   */
  listPolicies(callback?: (err: AWSError, data: Iot.Types.ListPoliciesResponse) => void): Request<Iot.Types.ListPoliciesResponse, AWSError>;
  /**
   * Lists the principals associated with the specified policy.  Note: This action is deprecated and works as expected for backward compatibility, but we won't add enhancements. Use ListTargetsForPolicy instead. Requires permission to access the ListPolicyPrincipals action.
   */
  listPolicyPrincipals(params: Iot.Types.ListPolicyPrincipalsRequest, callback?: (err: AWSError, data: Iot.Types.ListPolicyPrincipalsResponse) => void): Request<Iot.Types.ListPolicyPrincipalsResponse, AWSError>;
  /**
   * Lists the principals associated with the specified policy.  Note: This action is deprecated and works as expected for backward compatibility, but we won't add enhancements. Use ListTargetsForPolicy instead. Requires permission to access the ListPolicyPrincipals action.
   */
  listPolicyPrincipals(callback?: (err: AWSError, data: Iot.Types.ListPolicyPrincipalsResponse) => void): Request<Iot.Types.ListPolicyPrincipalsResponse, AWSError>;
  /**
   * Lists the versions of the specified policy and identifies the default version. Requires permission to access the ListPolicyVersions action.
   */
  listPolicyVersions(params: Iot.Types.ListPolicyVersionsRequest, callback?: (err: AWSError, data: Iot.Types.ListPolicyVersionsResponse) => void): Request<Iot.Types.ListPolicyVersionsResponse, AWSError>;
  /**
   * Lists the versions of the specified policy and identifies the default version. Requires permission to access the ListPolicyVersions action.
   */
  listPolicyVersions(callback?: (err: AWSError, data: Iot.Types.ListPolicyVersionsResponse) => void): Request<Iot.Types.ListPolicyVersionsResponse, AWSError>;
  /**
   * Lists the policies attached to the specified principal. If you use an Cognito identity, the ID must be in AmazonCognito Identity format.  Note: This action is deprecated and works as expected for backward compatibility, but we won't add enhancements. Use ListAttachedPolicies instead. Requires permission to access the ListPrincipalPolicies action.
   */
  listPrincipalPolicies(params: Iot.Types.ListPrincipalPoliciesRequest, callback?: (err: AWSError, data: Iot.Types.ListPrincipalPoliciesResponse) => void): Request<Iot.Types.ListPrincipalPoliciesResponse, AWSError>;
  /**
   * Lists the policies attached to the specified principal. If you use an Cognito identity, the ID must be in AmazonCognito Identity format.  Note: This action is deprecated and works as expected for backward compatibility, but we won't add enhancements. Use ListAttachedPolicies instead. Requires permission to access the ListPrincipalPolicies action.
   */
  listPrincipalPolicies(callback?: (err: AWSError, data: Iot.Types.ListPrincipalPoliciesResponse) => void): Request<Iot.Types.ListPrincipalPoliciesResponse, AWSError>;
  /**
   * Lists the things associated with the specified principal. A principal can be X.509 certificates, IAM users, groups, and roles, Amazon Cognito identities or federated identities.  Requires permission to access the ListPrincipalThings action.
   */
  listPrincipalThings(params: Iot.Types.ListPrincipalThingsRequest, callback?: (err: AWSError, data: Iot.Types.ListPrincipalThingsResponse) => void): Request<Iot.Types.ListPrincipalThingsResponse, AWSError>;
  /**
   * Lists the things associated with the specified principal. A principal can be X.509 certificates, IAM users, groups, and roles, Amazon Cognito identities or federated identities.  Requires permission to access the ListPrincipalThings action.
   */
  listPrincipalThings(callback?: (err: AWSError, data: Iot.Types.ListPrincipalThingsResponse) => void): Request<Iot.Types.ListPrincipalThingsResponse, AWSError>;
  /**
   * A list of provisioning template versions. Requires permission to access the ListProvisioningTemplateVersions action.
   */
  listProvisioningTemplateVersions(params: Iot.Types.ListProvisioningTemplateVersionsRequest, callback?: (err: AWSError, data: Iot.Types.ListProvisioningTemplateVersionsResponse) => void): Request<Iot.Types.ListProvisioningTemplateVersionsResponse, AWSError>;
  /**
   * A list of provisioning template versions. Requires permission to access the ListProvisioningTemplateVersions action.
   */
  listProvisioningTemplateVersions(callback?: (err: AWSError, data: Iot.Types.ListProvisioningTemplateVersionsResponse) => void): Request<Iot.Types.ListProvisioningTemplateVersionsResponse, AWSError>;
  /**
   * Lists the provisioning templates in your Amazon Web Services account. Requires permission to access the ListProvisioningTemplates action.
   */
  listProvisioningTemplates(params: Iot.Types.ListProvisioningTemplatesRequest, callback?: (err: AWSError, data: Iot.Types.ListProvisioningTemplatesResponse) => void): Request<Iot.Types.ListProvisioningTemplatesResponse, AWSError>;
  /**
   * Lists the provisioning templates in your Amazon Web Services account. Requires permission to access the ListProvisioningTemplates action.
   */
  listProvisioningTemplates(callback?: (err: AWSError, data: Iot.Types.ListProvisioningTemplatesResponse) => void): Request<Iot.Types.ListProvisioningTemplatesResponse, AWSError>;
  /**
   * The related resources of an Audit finding. The following resources can be returned from calling this API:   DEVICE_CERTIFICATE   CA_CERTIFICATE   IOT_POLICY   COGNITO_IDENTITY_POOL   CLIENT_ID   ACCOUNT_SETTINGS   ROLE_ALIAS   IAM_ROLE   ISSUER_CERTIFICATE    This API is similar to DescribeAuditFinding's RelatedResources but provides pagination and is not limited to 10 resources. When calling DescribeAuditFinding for the intermediate CA revoked for active device certificates check, RelatedResources will not be populated. You must use this API, ListRelatedResourcesForAuditFinding, to list the certificates. 
   */
  listRelatedResourcesForAuditFinding(params: Iot.Types.ListRelatedResourcesForAuditFindingRequest, callback?: (err: AWSError, data: Iot.Types.ListRelatedResourcesForAuditFindingResponse) => void): Request<Iot.Types.ListRelatedResourcesForAuditFindingResponse, AWSError>;
  /**
   * The related resources of an Audit finding. The following resources can be returned from calling this API:   DEVICE_CERTIFICATE   CA_CERTIFICATE   IOT_POLICY   COGNITO_IDENTITY_POOL   CLIENT_ID   ACCOUNT_SETTINGS   ROLE_ALIAS   IAM_ROLE   ISSUER_CERTIFICATE    This API is similar to DescribeAuditFinding's RelatedResources but provides pagination and is not limited to 10 resources. When calling DescribeAuditFinding for the intermediate CA revoked for active device certificates check, RelatedResources will not be populated. You must use this API, ListRelatedResourcesForAuditFinding, to list the certificates. 
   */
  listRelatedResourcesForAuditFinding(callback?: (err: AWSError, data: Iot.Types.ListRelatedResourcesForAuditFindingResponse) => void): Request<Iot.Types.ListRelatedResourcesForAuditFindingResponse, AWSError>;
  /**
   * Lists the role aliases registered in your account. Requires permission to access the ListRoleAliases action.
   */
  listRoleAliases(params: Iot.Types.ListRoleAliasesRequest, callback?: (err: AWSError, data: Iot.Types.ListRoleAliasesResponse) => void): Request<Iot.Types.ListRoleAliasesResponse, AWSError>;
  /**
   * Lists the role aliases registered in your account. Requires permission to access the ListRoleAliases action.
   */
  listRoleAliases(callback?: (err: AWSError, data: Iot.Types.ListRoleAliasesResponse) => void): Request<Iot.Types.ListRoleAliasesResponse, AWSError>;
  /**
   * Lists all of your scheduled audits. Requires permission to access the ListScheduledAudits action.
   */
  listScheduledAudits(params: Iot.Types.ListScheduledAuditsRequest, callback?: (err: AWSError, data: Iot.Types.ListScheduledAuditsResponse) => void): Request<Iot.Types.ListScheduledAuditsResponse, AWSError>;
  /**
   * Lists all of your scheduled audits. Requires permission to access the ListScheduledAudits action.
   */
  listScheduledAudits(callback?: (err: AWSError, data: Iot.Types.ListScheduledAuditsResponse) => void): Request<Iot.Types.ListScheduledAuditsResponse, AWSError>;
  /**
   * Lists the Device Defender security profiles you've created. You can filter security profiles by dimension or custom metric. Requires permission to access the ListSecurityProfiles action.   dimensionName and metricName cannot be used in the same request. 
   */
  listSecurityProfiles(params: Iot.Types.ListSecurityProfilesRequest, callback?: (err: AWSError, data: Iot.Types.ListSecurityProfilesResponse) => void): Request<Iot.Types.ListSecurityProfilesResponse, AWSError>;
  /**
   * Lists the Device Defender security profiles you've created. You can filter security profiles by dimension or custom metric. Requires permission to access the ListSecurityProfiles action.   dimensionName and metricName cannot be used in the same request. 
   */
  listSecurityProfiles(callback?: (err: AWSError, data: Iot.Types.ListSecurityProfilesResponse) => void): Request<Iot.Types.ListSecurityProfilesResponse, AWSError>;
  /**
   * Lists the Device Defender security profiles attached to a target (thing group). Requires permission to access the ListSecurityProfilesForTarget action.
   */
  listSecurityProfilesForTarget(params: Iot.Types.ListSecurityProfilesForTargetRequest, callback?: (err: AWSError, data: Iot.Types.ListSecurityProfilesForTargetResponse) => void): Request<Iot.Types.ListSecurityProfilesForTargetResponse, AWSError>;
  /**
   * Lists the Device Defender security profiles attached to a target (thing group). Requires permission to access the ListSecurityProfilesForTarget action.
   */
  listSecurityProfilesForTarget(callback?: (err: AWSError, data: Iot.Types.ListSecurityProfilesForTargetResponse) => void): Request<Iot.Types.ListSecurityProfilesForTargetResponse, AWSError>;
  /**
   * Lists all of the streams in your Amazon Web Services account. Requires permission to access the ListStreams action.
   */
  listStreams(params: Iot.Types.ListStreamsRequest, callback?: (err: AWSError, data: Iot.Types.ListStreamsResponse) => void): Request<Iot.Types.ListStreamsResponse, AWSError>;
  /**
   * Lists all of the streams in your Amazon Web Services account. Requires permission to access the ListStreams action.
   */
  listStreams(callback?: (err: AWSError, data: Iot.Types.ListStreamsResponse) => void): Request<Iot.Types.ListStreamsResponse, AWSError>;
  /**
   * Lists the tags (metadata) you have assigned to the resource. Requires permission to access the ListTagsForResource action.
   */
  listTagsForResource(params: Iot.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Iot.Types.ListTagsForResourceResponse) => void): Request<Iot.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags (metadata) you have assigned to the resource. Requires permission to access the ListTagsForResource action.
   */
  listTagsForResource(callback?: (err: AWSError, data: Iot.Types.ListTagsForResourceResponse) => void): Request<Iot.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List targets for the specified policy. Requires permission to access the ListTargetsForPolicy action.
   */
  listTargetsForPolicy(params: Iot.Types.ListTargetsForPolicyRequest, callback?: (err: AWSError, data: Iot.Types.ListTargetsForPolicyResponse) => void): Request<Iot.Types.ListTargetsForPolicyResponse, AWSError>;
  /**
   * List targets for the specified policy. Requires permission to access the ListTargetsForPolicy action.
   */
  listTargetsForPolicy(callback?: (err: AWSError, data: Iot.Types.ListTargetsForPolicyResponse) => void): Request<Iot.Types.ListTargetsForPolicyResponse, AWSError>;
  /**
   * Lists the targets (thing groups) associated with a given Device Defender security profile. Requires permission to access the ListTargetsForSecurityProfile action.
   */
  listTargetsForSecurityProfile(params: Iot.Types.ListTargetsForSecurityProfileRequest, callback?: (err: AWSError, data: Iot.Types.ListTargetsForSecurityProfileResponse) => void): Request<Iot.Types.ListTargetsForSecurityProfileResponse, AWSError>;
  /**
   * Lists the targets (thing groups) associated with a given Device Defender security profile. Requires permission to access the ListTargetsForSecurityProfile action.
   */
  listTargetsForSecurityProfile(callback?: (err: AWSError, data: Iot.Types.ListTargetsForSecurityProfileResponse) => void): Request<Iot.Types.ListTargetsForSecurityProfileResponse, AWSError>;
  /**
   * List the thing groups in your account. Requires permission to access the ListThingGroups action.
   */
  listThingGroups(params: Iot.Types.ListThingGroupsRequest, callback?: (err: AWSError, data: Iot.Types.ListThingGroupsResponse) => void): Request<Iot.Types.ListThingGroupsResponse, AWSError>;
  /**
   * List the thing groups in your account. Requires permission to access the ListThingGroups action.
   */
  listThingGroups(callback?: (err: AWSError, data: Iot.Types.ListThingGroupsResponse) => void): Request<Iot.Types.ListThingGroupsResponse, AWSError>;
  /**
   * List the thing groups to which the specified thing belongs. Requires permission to access the ListThingGroupsForThing action.
   */
  listThingGroupsForThing(params: Iot.Types.ListThingGroupsForThingRequest, callback?: (err: AWSError, data: Iot.Types.ListThingGroupsForThingResponse) => void): Request<Iot.Types.ListThingGroupsForThingResponse, AWSError>;
  /**
   * List the thing groups to which the specified thing belongs. Requires permission to access the ListThingGroupsForThing action.
   */
  listThingGroupsForThing(callback?: (err: AWSError, data: Iot.Types.ListThingGroupsForThingResponse) => void): Request<Iot.Types.ListThingGroupsForThingResponse, AWSError>;
  /**
   * Lists the principals associated with the specified thing. A principal can be X.509 certificates, IAM users, groups, and roles, Amazon Cognito identities or federated identities. Requires permission to access the ListThingPrincipals action.
   */
  listThingPrincipals(params: Iot.Types.ListThingPrincipalsRequest, callback?: (err: AWSError, data: Iot.Types.ListThingPrincipalsResponse) => void): Request<Iot.Types.ListThingPrincipalsResponse, AWSError>;
  /**
   * Lists the principals associated with the specified thing. A principal can be X.509 certificates, IAM users, groups, and roles, Amazon Cognito identities or federated identities. Requires permission to access the ListThingPrincipals action.
   */
  listThingPrincipals(callback?: (err: AWSError, data: Iot.Types.ListThingPrincipalsResponse) => void): Request<Iot.Types.ListThingPrincipalsResponse, AWSError>;
  /**
   * Information about the thing registration tasks.
   */
  listThingRegistrationTaskReports(params: Iot.Types.ListThingRegistrationTaskReportsRequest, callback?: (err: AWSError, data: Iot.Types.ListThingRegistrationTaskReportsResponse) => void): Request<Iot.Types.ListThingRegistrationTaskReportsResponse, AWSError>;
  /**
   * Information about the thing registration tasks.
   */
  listThingRegistrationTaskReports(callback?: (err: AWSError, data: Iot.Types.ListThingRegistrationTaskReportsResponse) => void): Request<Iot.Types.ListThingRegistrationTaskReportsResponse, AWSError>;
  /**
   * List bulk thing provisioning tasks. Requires permission to access the ListThingRegistrationTasks action.
   */
  listThingRegistrationTasks(params: Iot.Types.ListThingRegistrationTasksRequest, callback?: (err: AWSError, data: Iot.Types.ListThingRegistrationTasksResponse) => void): Request<Iot.Types.ListThingRegistrationTasksResponse, AWSError>;
  /**
   * List bulk thing provisioning tasks. Requires permission to access the ListThingRegistrationTasks action.
   */
  listThingRegistrationTasks(callback?: (err: AWSError, data: Iot.Types.ListThingRegistrationTasksResponse) => void): Request<Iot.Types.ListThingRegistrationTasksResponse, AWSError>;
  /**
   * Lists the existing thing types. Requires permission to access the ListThingTypes action.
   */
  listThingTypes(params: Iot.Types.ListThingTypesRequest, callback?: (err: AWSError, data: Iot.Types.ListThingTypesResponse) => void): Request<Iot.Types.ListThingTypesResponse, AWSError>;
  /**
   * Lists the existing thing types. Requires permission to access the ListThingTypes action.
   */
  listThingTypes(callback?: (err: AWSError, data: Iot.Types.ListThingTypesResponse) => void): Request<Iot.Types.ListThingTypesResponse, AWSError>;
  /**
   * Lists your things. Use the attributeName and attributeValue parameters to filter your things. For example, calling ListThings with attributeName=Color and attributeValue=Red retrieves all things in the registry that contain an attribute Color with the value Red. For more information, see List Things from the Amazon Web Services IoT Core Developer Guide. Requires permission to access the ListThings action.  You will not be charged for calling this API if an Access denied error is returned. You will also not be charged if no attributes or pagination token was provided in request and no pagination token and no results were returned. 
   */
  listThings(params: Iot.Types.ListThingsRequest, callback?: (err: AWSError, data: Iot.Types.ListThingsResponse) => void): Request<Iot.Types.ListThingsResponse, AWSError>;
  /**
   * Lists your things. Use the attributeName and attributeValue parameters to filter your things. For example, calling ListThings with attributeName=Color and attributeValue=Red retrieves all things in the registry that contain an attribute Color with the value Red. For more information, see List Things from the Amazon Web Services IoT Core Developer Guide. Requires permission to access the ListThings action.  You will not be charged for calling this API if an Access denied error is returned. You will also not be charged if no attributes or pagination token was provided in request and no pagination token and no results were returned. 
   */
  listThings(callback?: (err: AWSError, data: Iot.Types.ListThingsResponse) => void): Request<Iot.Types.ListThingsResponse, AWSError>;
  /**
   * Lists the things you have added to the given billing group. Requires permission to access the ListThingsInBillingGroup action.
   */
  listThingsInBillingGroup(params: Iot.Types.ListThingsInBillingGroupRequest, callback?: (err: AWSError, data: Iot.Types.ListThingsInBillingGroupResponse) => void): Request<Iot.Types.ListThingsInBillingGroupResponse, AWSError>;
  /**
   * Lists the things you have added to the given billing group. Requires permission to access the ListThingsInBillingGroup action.
   */
  listThingsInBillingGroup(callback?: (err: AWSError, data: Iot.Types.ListThingsInBillingGroupResponse) => void): Request<Iot.Types.ListThingsInBillingGroupResponse, AWSError>;
  /**
   * Lists the things in the specified group. Requires permission to access the ListThingsInThingGroup action.
   */
  listThingsInThingGroup(params: Iot.Types.ListThingsInThingGroupRequest, callback?: (err: AWSError, data: Iot.Types.ListThingsInThingGroupResponse) => void): Request<Iot.Types.ListThingsInThingGroupResponse, AWSError>;
  /**
   * Lists the things in the specified group. Requires permission to access the ListThingsInThingGroup action.
   */
  listThingsInThingGroup(callback?: (err: AWSError, data: Iot.Types.ListThingsInThingGroupResponse) => void): Request<Iot.Types.ListThingsInThingGroupResponse, AWSError>;
  /**
   * Lists all the topic rule destinations in your Amazon Web Services account. Requires permission to access the ListTopicRuleDestinations action.
   */
  listTopicRuleDestinations(params: Iot.Types.ListTopicRuleDestinationsRequest, callback?: (err: AWSError, data: Iot.Types.ListTopicRuleDestinationsResponse) => void): Request<Iot.Types.ListTopicRuleDestinationsResponse, AWSError>;
  /**
   * Lists all the topic rule destinations in your Amazon Web Services account. Requires permission to access the ListTopicRuleDestinations action.
   */
  listTopicRuleDestinations(callback?: (err: AWSError, data: Iot.Types.ListTopicRuleDestinationsResponse) => void): Request<Iot.Types.ListTopicRuleDestinationsResponse, AWSError>;
  /**
   * Lists the rules for the specific topic. Requires permission to access the ListTopicRules action.
   */
  listTopicRules(params: Iot.Types.ListTopicRulesRequest, callback?: (err: AWSError, data: Iot.Types.ListTopicRulesResponse) => void): Request<Iot.Types.ListTopicRulesResponse, AWSError>;
  /**
   * Lists the rules for the specific topic. Requires permission to access the ListTopicRules action.
   */
  listTopicRules(callback?: (err: AWSError, data: Iot.Types.ListTopicRulesResponse) => void): Request<Iot.Types.ListTopicRulesResponse, AWSError>;
  /**
   * Lists logging levels. Requires permission to access the ListV2LoggingLevels action.
   */
  listV2LoggingLevels(params: Iot.Types.ListV2LoggingLevelsRequest, callback?: (err: AWSError, data: Iot.Types.ListV2LoggingLevelsResponse) => void): Request<Iot.Types.ListV2LoggingLevelsResponse, AWSError>;
  /**
   * Lists logging levels. Requires permission to access the ListV2LoggingLevels action.
   */
  listV2LoggingLevels(callback?: (err: AWSError, data: Iot.Types.ListV2LoggingLevelsResponse) => void): Request<Iot.Types.ListV2LoggingLevelsResponse, AWSError>;
  /**
   * Lists the Device Defender security profile violations discovered during the given time period. You can use filters to limit the results to those alerts issued for a particular security profile, behavior, or thing (device). Requires permission to access the ListViolationEvents action.
   */
  listViolationEvents(params: Iot.Types.ListViolationEventsRequest, callback?: (err: AWSError, data: Iot.Types.ListViolationEventsResponse) => void): Request<Iot.Types.ListViolationEventsResponse, AWSError>;
  /**
   * Lists the Device Defender security profile violations discovered during the given time period. You can use filters to limit the results to those alerts issued for a particular security profile, behavior, or thing (device). Requires permission to access the ListViolationEvents action.
   */
  listViolationEvents(callback?: (err: AWSError, data: Iot.Types.ListViolationEventsResponse) => void): Request<Iot.Types.ListViolationEventsResponse, AWSError>;
  /**
   * Set a verification state and provide a description of that verification state on a violation (detect alarm).
   */
  putVerificationStateOnViolation(params: Iot.Types.PutVerificationStateOnViolationRequest, callback?: (err: AWSError, data: Iot.Types.PutVerificationStateOnViolationResponse) => void): Request<Iot.Types.PutVerificationStateOnViolationResponse, AWSError>;
  /**
   * Set a verification state and provide a description of that verification state on a violation (detect alarm).
   */
  putVerificationStateOnViolation(callback?: (err: AWSError, data: Iot.Types.PutVerificationStateOnViolationResponse) => void): Request<Iot.Types.PutVerificationStateOnViolationResponse, AWSError>;
  /**
   * Registers a CA certificate with Amazon Web Services IoT Core. There is no limit to the number of CA certificates you can register in your Amazon Web Services account. You can register up to 10 CA certificates with the same CA subject field per Amazon Web Services account. Requires permission to access the RegisterCACertificate action.
   */
  registerCACertificate(params: Iot.Types.RegisterCACertificateRequest, callback?: (err: AWSError, data: Iot.Types.RegisterCACertificateResponse) => void): Request<Iot.Types.RegisterCACertificateResponse, AWSError>;
  /**
   * Registers a CA certificate with Amazon Web Services IoT Core. There is no limit to the number of CA certificates you can register in your Amazon Web Services account. You can register up to 10 CA certificates with the same CA subject field per Amazon Web Services account. Requires permission to access the RegisterCACertificate action.
   */
  registerCACertificate(callback?: (err: AWSError, data: Iot.Types.RegisterCACertificateResponse) => void): Request<Iot.Types.RegisterCACertificateResponse, AWSError>;
  /**
   * Registers a device certificate with IoT in the same certificate mode as the signing CA. If you have more than one CA certificate that has the same subject field, you must specify the CA certificate that was used to sign the device certificate being registered. Requires permission to access the RegisterCertificate action.
   */
  registerCertificate(params: Iot.Types.RegisterCertificateRequest, callback?: (err: AWSError, data: Iot.Types.RegisterCertificateResponse) => void): Request<Iot.Types.RegisterCertificateResponse, AWSError>;
  /**
   * Registers a device certificate with IoT in the same certificate mode as the signing CA. If you have more than one CA certificate that has the same subject field, you must specify the CA certificate that was used to sign the device certificate being registered. Requires permission to access the RegisterCertificate action.
   */
  registerCertificate(callback?: (err: AWSError, data: Iot.Types.RegisterCertificateResponse) => void): Request<Iot.Types.RegisterCertificateResponse, AWSError>;
  /**
   * Register a certificate that does not have a certificate authority (CA). For supported certificates, consult  Certificate signing algorithms supported by IoT. 
   */
  registerCertificateWithoutCA(params: Iot.Types.RegisterCertificateWithoutCARequest, callback?: (err: AWSError, data: Iot.Types.RegisterCertificateWithoutCAResponse) => void): Request<Iot.Types.RegisterCertificateWithoutCAResponse, AWSError>;
  /**
   * Register a certificate that does not have a certificate authority (CA). For supported certificates, consult  Certificate signing algorithms supported by IoT. 
   */
  registerCertificateWithoutCA(callback?: (err: AWSError, data: Iot.Types.RegisterCertificateWithoutCAResponse) => void): Request<Iot.Types.RegisterCertificateWithoutCAResponse, AWSError>;
  /**
   * Provisions a thing in the device registry. RegisterThing calls other IoT control plane APIs. These calls might exceed your account level  IoT Throttling Limits and cause throttle errors. Please contact Amazon Web Services Customer Support to raise your throttling limits if necessary. Requires permission to access the RegisterThing action.
   */
  registerThing(params: Iot.Types.RegisterThingRequest, callback?: (err: AWSError, data: Iot.Types.RegisterThingResponse) => void): Request<Iot.Types.RegisterThingResponse, AWSError>;
  /**
   * Provisions a thing in the device registry. RegisterThing calls other IoT control plane APIs. These calls might exceed your account level  IoT Throttling Limits and cause throttle errors. Please contact Amazon Web Services Customer Support to raise your throttling limits if necessary. Requires permission to access the RegisterThing action.
   */
  registerThing(callback?: (err: AWSError, data: Iot.Types.RegisterThingResponse) => void): Request<Iot.Types.RegisterThingResponse, AWSError>;
  /**
   * Rejects a pending certificate transfer. After IoT rejects a certificate transfer, the certificate status changes from PENDING_TRANSFER to INACTIVE. To check for pending certificate transfers, call ListCertificates to enumerate your certificates. This operation can only be called by the transfer destination. After it is called, the certificate will be returned to the source's account in the INACTIVE state. Requires permission to access the RejectCertificateTransfer action.
   */
  rejectCertificateTransfer(params: Iot.Types.RejectCertificateTransferRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Rejects a pending certificate transfer. After IoT rejects a certificate transfer, the certificate status changes from PENDING_TRANSFER to INACTIVE. To check for pending certificate transfers, call ListCertificates to enumerate your certificates. This operation can only be called by the transfer destination. After it is called, the certificate will be returned to the source's account in the INACTIVE state. Requires permission to access the RejectCertificateTransfer action.
   */
  rejectCertificateTransfer(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the given thing from the billing group. Requires permission to access the RemoveThingFromBillingGroup action.  This call is asynchronous. It might take several seconds for the detachment to propagate. 
   */
  removeThingFromBillingGroup(params: Iot.Types.RemoveThingFromBillingGroupRequest, callback?: (err: AWSError, data: Iot.Types.RemoveThingFromBillingGroupResponse) => void): Request<Iot.Types.RemoveThingFromBillingGroupResponse, AWSError>;
  /**
   * Removes the given thing from the billing group. Requires permission to access the RemoveThingFromBillingGroup action.  This call is asynchronous. It might take several seconds for the detachment to propagate. 
   */
  removeThingFromBillingGroup(callback?: (err: AWSError, data: Iot.Types.RemoveThingFromBillingGroupResponse) => void): Request<Iot.Types.RemoveThingFromBillingGroupResponse, AWSError>;
  /**
   * Remove the specified thing from the specified group. You must specify either a thingGroupArn or a thingGroupName to identify the thing group and either a thingArn or a thingName to identify the thing to remove from the thing group.  Requires permission to access the RemoveThingFromThingGroup action.
   */
  removeThingFromThingGroup(params: Iot.Types.RemoveThingFromThingGroupRequest, callback?: (err: AWSError, data: Iot.Types.RemoveThingFromThingGroupResponse) => void): Request<Iot.Types.RemoveThingFromThingGroupResponse, AWSError>;
  /**
   * Remove the specified thing from the specified group. You must specify either a thingGroupArn or a thingGroupName to identify the thing group and either a thingArn or a thingName to identify the thing to remove from the thing group.  Requires permission to access the RemoveThingFromThingGroup action.
   */
  removeThingFromThingGroup(callback?: (err: AWSError, data: Iot.Types.RemoveThingFromThingGroupResponse) => void): Request<Iot.Types.RemoveThingFromThingGroupResponse, AWSError>;
  /**
   * Replaces the rule. You must specify all parameters for the new rule. Creating rules is an administrator-level action. Any user who has permission to create rules will be able to access data processed by the rule. Requires permission to access the ReplaceTopicRule action.
   */
  replaceTopicRule(params: Iot.Types.ReplaceTopicRuleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Replaces the rule. You must specify all parameters for the new rule. Creating rules is an administrator-level action. Any user who has permission to create rules will be able to access data processed by the rule. Requires permission to access the ReplaceTopicRule action.
   */
  replaceTopicRule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * The query search index. Requires permission to access the SearchIndex action.
   */
  searchIndex(params: Iot.Types.SearchIndexRequest, callback?: (err: AWSError, data: Iot.Types.SearchIndexResponse) => void): Request<Iot.Types.SearchIndexResponse, AWSError>;
  /**
   * The query search index. Requires permission to access the SearchIndex action.
   */
  searchIndex(callback?: (err: AWSError, data: Iot.Types.SearchIndexResponse) => void): Request<Iot.Types.SearchIndexResponse, AWSError>;
  /**
   * Sets the default authorizer. This will be used if a websocket connection is made without specifying an authorizer. Requires permission to access the SetDefaultAuthorizer action.
   */
  setDefaultAuthorizer(params: Iot.Types.SetDefaultAuthorizerRequest, callback?: (err: AWSError, data: Iot.Types.SetDefaultAuthorizerResponse) => void): Request<Iot.Types.SetDefaultAuthorizerResponse, AWSError>;
  /**
   * Sets the default authorizer. This will be used if a websocket connection is made without specifying an authorizer. Requires permission to access the SetDefaultAuthorizer action.
   */
  setDefaultAuthorizer(callback?: (err: AWSError, data: Iot.Types.SetDefaultAuthorizerResponse) => void): Request<Iot.Types.SetDefaultAuthorizerResponse, AWSError>;
  /**
   * Sets the specified version of the specified policy as the policy's default (operative) version. This action affects all certificates to which the policy is attached. To list the principals the policy is attached to, use the ListPrincipalPolicies action. Requires permission to access the SetDefaultPolicyVersion action.
   */
  setDefaultPolicyVersion(params: Iot.Types.SetDefaultPolicyVersionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the specified version of the specified policy as the policy's default (operative) version. This action affects all certificates to which the policy is attached. To list the principals the policy is attached to, use the ListPrincipalPolicies action. Requires permission to access the SetDefaultPolicyVersion action.
   */
  setDefaultPolicyVersion(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the logging options. NOTE: use of this command is not recommended. Use SetV2LoggingOptions instead. Requires permission to access the SetLoggingOptions action.
   */
  setLoggingOptions(params: Iot.Types.SetLoggingOptionsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the logging options. NOTE: use of this command is not recommended. Use SetV2LoggingOptions instead. Requires permission to access the SetLoggingOptions action.
   */
  setLoggingOptions(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the logging level. Requires permission to access the SetV2LoggingLevel action.
   */
  setV2LoggingLevel(params: Iot.Types.SetV2LoggingLevelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the logging level. Requires permission to access the SetV2LoggingLevel action.
   */
  setV2LoggingLevel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the logging options for the V2 logging service. Requires permission to access the SetV2LoggingOptions action.
   */
  setV2LoggingOptions(params: Iot.Types.SetV2LoggingOptionsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the logging options for the V2 logging service. Requires permission to access the SetV2LoggingOptions action.
   */
  setV2LoggingOptions(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Starts a task that applies a set of mitigation actions to the specified target. Requires permission to access the StartAuditMitigationActionsTask action.
   */
  startAuditMitigationActionsTask(params: Iot.Types.StartAuditMitigationActionsTaskRequest, callback?: (err: AWSError, data: Iot.Types.StartAuditMitigationActionsTaskResponse) => void): Request<Iot.Types.StartAuditMitigationActionsTaskResponse, AWSError>;
  /**
   * Starts a task that applies a set of mitigation actions to the specified target. Requires permission to access the StartAuditMitigationActionsTask action.
   */
  startAuditMitigationActionsTask(callback?: (err: AWSError, data: Iot.Types.StartAuditMitigationActionsTaskResponse) => void): Request<Iot.Types.StartAuditMitigationActionsTaskResponse, AWSError>;
  /**
   *  Starts a Device Defender ML Detect mitigation actions task.  Requires permission to access the StartDetectMitigationActionsTask action.
   */
  startDetectMitigationActionsTask(params: Iot.Types.StartDetectMitigationActionsTaskRequest, callback?: (err: AWSError, data: Iot.Types.StartDetectMitigationActionsTaskResponse) => void): Request<Iot.Types.StartDetectMitigationActionsTaskResponse, AWSError>;
  /**
   *  Starts a Device Defender ML Detect mitigation actions task.  Requires permission to access the StartDetectMitigationActionsTask action.
   */
  startDetectMitigationActionsTask(callback?: (err: AWSError, data: Iot.Types.StartDetectMitigationActionsTaskResponse) => void): Request<Iot.Types.StartDetectMitigationActionsTaskResponse, AWSError>;
  /**
   * Starts an on-demand Device Defender audit. Requires permission to access the StartOnDemandAuditTask action.
   */
  startOnDemandAuditTask(params: Iot.Types.StartOnDemandAuditTaskRequest, callback?: (err: AWSError, data: Iot.Types.StartOnDemandAuditTaskResponse) => void): Request<Iot.Types.StartOnDemandAuditTaskResponse, AWSError>;
  /**
   * Starts an on-demand Device Defender audit. Requires permission to access the StartOnDemandAuditTask action.
   */
  startOnDemandAuditTask(callback?: (err: AWSError, data: Iot.Types.StartOnDemandAuditTaskResponse) => void): Request<Iot.Types.StartOnDemandAuditTaskResponse, AWSError>;
  /**
   * Creates a bulk thing provisioning task. Requires permission to access the StartThingRegistrationTask action.
   */
  startThingRegistrationTask(params: Iot.Types.StartThingRegistrationTaskRequest, callback?: (err: AWSError, data: Iot.Types.StartThingRegistrationTaskResponse) => void): Request<Iot.Types.StartThingRegistrationTaskResponse, AWSError>;
  /**
   * Creates a bulk thing provisioning task. Requires permission to access the StartThingRegistrationTask action.
   */
  startThingRegistrationTask(callback?: (err: AWSError, data: Iot.Types.StartThingRegistrationTaskResponse) => void): Request<Iot.Types.StartThingRegistrationTaskResponse, AWSError>;
  /**
   * Cancels a bulk thing provisioning task. Requires permission to access the StopThingRegistrationTask action.
   */
  stopThingRegistrationTask(params: Iot.Types.StopThingRegistrationTaskRequest, callback?: (err: AWSError, data: Iot.Types.StopThingRegistrationTaskResponse) => void): Request<Iot.Types.StopThingRegistrationTaskResponse, AWSError>;
  /**
   * Cancels a bulk thing provisioning task. Requires permission to access the StopThingRegistrationTask action.
   */
  stopThingRegistrationTask(callback?: (err: AWSError, data: Iot.Types.StopThingRegistrationTaskResponse) => void): Request<Iot.Types.StopThingRegistrationTaskResponse, AWSError>;
  /**
   * Adds to or modifies the tags of the given resource. Tags are metadata which can be used to manage a resource. Requires permission to access the TagResource action.
   */
  tagResource(params: Iot.Types.TagResourceRequest, callback?: (err: AWSError, data: Iot.Types.TagResourceResponse) => void): Request<Iot.Types.TagResourceResponse, AWSError>;
  /**
   * Adds to or modifies the tags of the given resource. Tags are metadata which can be used to manage a resource. Requires permission to access the TagResource action.
   */
  tagResource(callback?: (err: AWSError, data: Iot.Types.TagResourceResponse) => void): Request<Iot.Types.TagResourceResponse, AWSError>;
  /**
   * Tests if a specified principal is authorized to perform an IoT action on a specified resource. Use this to test and debug the authorization behavior of devices that connect to the IoT device gateway. Requires permission to access the TestAuthorization action.
   */
  testAuthorization(params: Iot.Types.TestAuthorizationRequest, callback?: (err: AWSError, data: Iot.Types.TestAuthorizationResponse) => void): Request<Iot.Types.TestAuthorizationResponse, AWSError>;
  /**
   * Tests if a specified principal is authorized to perform an IoT action on a specified resource. Use this to test and debug the authorization behavior of devices that connect to the IoT device gateway. Requires permission to access the TestAuthorization action.
   */
  testAuthorization(callback?: (err: AWSError, data: Iot.Types.TestAuthorizationResponse) => void): Request<Iot.Types.TestAuthorizationResponse, AWSError>;
  /**
   * Tests a custom authorization behavior by invoking a specified custom authorizer. Use this to test and debug the custom authorization behavior of devices that connect to the IoT device gateway. Requires permission to access the TestInvokeAuthorizer action.
   */
  testInvokeAuthorizer(params: Iot.Types.TestInvokeAuthorizerRequest, callback?: (err: AWSError, data: Iot.Types.TestInvokeAuthorizerResponse) => void): Request<Iot.Types.TestInvokeAuthorizerResponse, AWSError>;
  /**
   * Tests a custom authorization behavior by invoking a specified custom authorizer. Use this to test and debug the custom authorization behavior of devices that connect to the IoT device gateway. Requires permission to access the TestInvokeAuthorizer action.
   */
  testInvokeAuthorizer(callback?: (err: AWSError, data: Iot.Types.TestInvokeAuthorizerResponse) => void): Request<Iot.Types.TestInvokeAuthorizerResponse, AWSError>;
  /**
   * Transfers the specified certificate to the specified Amazon Web Services account. Requires permission to access the TransferCertificate action. You can cancel the transfer until it is acknowledged by the recipient. No notification is sent to the transfer destination's account. It is up to the caller to notify the transfer target. The certificate being transferred must not be in the ACTIVE state. You can use the UpdateCertificate action to deactivate it. The certificate must not have any policies attached to it. You can use the DetachPolicy action to detach them.
   */
  transferCertificate(params: Iot.Types.TransferCertificateRequest, callback?: (err: AWSError, data: Iot.Types.TransferCertificateResponse) => void): Request<Iot.Types.TransferCertificateResponse, AWSError>;
  /**
   * Transfers the specified certificate to the specified Amazon Web Services account. Requires permission to access the TransferCertificate action. You can cancel the transfer until it is acknowledged by the recipient. No notification is sent to the transfer destination's account. It is up to the caller to notify the transfer target. The certificate being transferred must not be in the ACTIVE state. You can use the UpdateCertificate action to deactivate it. The certificate must not have any policies attached to it. You can use the DetachPolicy action to detach them.
   */
  transferCertificate(callback?: (err: AWSError, data: Iot.Types.TransferCertificateResponse) => void): Request<Iot.Types.TransferCertificateResponse, AWSError>;
  /**
   * Removes the given tags (metadata) from the resource. Requires permission to access the UntagResource action.
   */
  untagResource(params: Iot.Types.UntagResourceRequest, callback?: (err: AWSError, data: Iot.Types.UntagResourceResponse) => void): Request<Iot.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the given tags (metadata) from the resource. Requires permission to access the UntagResource action.
   */
  untagResource(callback?: (err: AWSError, data: Iot.Types.UntagResourceResponse) => void): Request<Iot.Types.UntagResourceResponse, AWSError>;
  /**
   * Configures or reconfigures the Device Defender audit settings for this account. Settings include how audit notifications are sent and which audit checks are enabled or disabled. Requires permission to access the UpdateAccountAuditConfiguration action.
   */
  updateAccountAuditConfiguration(params: Iot.Types.UpdateAccountAuditConfigurationRequest, callback?: (err: AWSError, data: Iot.Types.UpdateAccountAuditConfigurationResponse) => void): Request<Iot.Types.UpdateAccountAuditConfigurationResponse, AWSError>;
  /**
   * Configures or reconfigures the Device Defender audit settings for this account. Settings include how audit notifications are sent and which audit checks are enabled or disabled. Requires permission to access the UpdateAccountAuditConfiguration action.
   */
  updateAccountAuditConfiguration(callback?: (err: AWSError, data: Iot.Types.UpdateAccountAuditConfigurationResponse) => void): Request<Iot.Types.UpdateAccountAuditConfigurationResponse, AWSError>;
  /**
   *  Updates a Device Defender audit suppression. 
   */
  updateAuditSuppression(params: Iot.Types.UpdateAuditSuppressionRequest, callback?: (err: AWSError, data: Iot.Types.UpdateAuditSuppressionResponse) => void): Request<Iot.Types.UpdateAuditSuppressionResponse, AWSError>;
  /**
   *  Updates a Device Defender audit suppression. 
   */
  updateAuditSuppression(callback?: (err: AWSError, data: Iot.Types.UpdateAuditSuppressionResponse) => void): Request<Iot.Types.UpdateAuditSuppressionResponse, AWSError>;
  /**
   * Updates an authorizer. Requires permission to access the UpdateAuthorizer action.
   */
  updateAuthorizer(params: Iot.Types.UpdateAuthorizerRequest, callback?: (err: AWSError, data: Iot.Types.UpdateAuthorizerResponse) => void): Request<Iot.Types.UpdateAuthorizerResponse, AWSError>;
  /**
   * Updates an authorizer. Requires permission to access the UpdateAuthorizer action.
   */
  updateAuthorizer(callback?: (err: AWSError, data: Iot.Types.UpdateAuthorizerResponse) => void): Request<Iot.Types.UpdateAuthorizerResponse, AWSError>;
  /**
   * Updates information about the billing group. Requires permission to access the UpdateBillingGroup action.
   */
  updateBillingGroup(params: Iot.Types.UpdateBillingGroupRequest, callback?: (err: AWSError, data: Iot.Types.UpdateBillingGroupResponse) => void): Request<Iot.Types.UpdateBillingGroupResponse, AWSError>;
  /**
   * Updates information about the billing group. Requires permission to access the UpdateBillingGroup action.
   */
  updateBillingGroup(callback?: (err: AWSError, data: Iot.Types.UpdateBillingGroupResponse) => void): Request<Iot.Types.UpdateBillingGroupResponse, AWSError>;
  /**
   * Updates a registered CA certificate. Requires permission to access the UpdateCACertificate action.
   */
  updateCACertificate(params: Iot.Types.UpdateCACertificateRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a registered CA certificate. Requires permission to access the UpdateCACertificate action.
   */
  updateCACertificate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the status of the specified certificate. This operation is idempotent. Requires permission to access the UpdateCertificate action. Certificates must be in the ACTIVE state to authenticate devices that use a certificate to connect to IoT. Within a few minutes of updating a certificate from the ACTIVE state to any other state, IoT disconnects all devices that used that certificate to connect. Devices cannot use a certificate that is not in the ACTIVE state to reconnect.
   */
  updateCertificate(params: Iot.Types.UpdateCertificateRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the status of the specified certificate. This operation is idempotent. Requires permission to access the UpdateCertificate action. Certificates must be in the ACTIVE state to authenticate devices that use a certificate to connect to IoT. Within a few minutes of updating a certificate from the ACTIVE state to any other state, IoT disconnects all devices that used that certificate to connect. Devices cannot use a certificate that is not in the ACTIVE state to reconnect.
   */
  updateCertificate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a Device Defender detect custom metric.  Requires permission to access the UpdateCustomMetric action.
   */
  updateCustomMetric(params: Iot.Types.UpdateCustomMetricRequest, callback?: (err: AWSError, data: Iot.Types.UpdateCustomMetricResponse) => void): Request<Iot.Types.UpdateCustomMetricResponse, AWSError>;
  /**
   * Updates a Device Defender detect custom metric.  Requires permission to access the UpdateCustomMetric action.
   */
  updateCustomMetric(callback?: (err: AWSError, data: Iot.Types.UpdateCustomMetricResponse) => void): Request<Iot.Types.UpdateCustomMetricResponse, AWSError>;
  /**
   * Updates the definition for a dimension. You cannot change the type of a dimension after it is created (you can delete it and recreate it). Requires permission to access the UpdateDimension action.
   */
  updateDimension(params: Iot.Types.UpdateDimensionRequest, callback?: (err: AWSError, data: Iot.Types.UpdateDimensionResponse) => void): Request<Iot.Types.UpdateDimensionResponse, AWSError>;
  /**
   * Updates the definition for a dimension. You cannot change the type of a dimension after it is created (you can delete it and recreate it). Requires permission to access the UpdateDimension action.
   */
  updateDimension(callback?: (err: AWSError, data: Iot.Types.UpdateDimensionResponse) => void): Request<Iot.Types.UpdateDimensionResponse, AWSError>;
  /**
   * Updates values stored in the domain configuration. Domain configurations for default endpoints can't be updated. Requires permission to access the UpdateDomainConfiguration action.
   */
  updateDomainConfiguration(params: Iot.Types.UpdateDomainConfigurationRequest, callback?: (err: AWSError, data: Iot.Types.UpdateDomainConfigurationResponse) => void): Request<Iot.Types.UpdateDomainConfigurationResponse, AWSError>;
  /**
   * Updates values stored in the domain configuration. Domain configurations for default endpoints can't be updated. Requires permission to access the UpdateDomainConfiguration action.
   */
  updateDomainConfiguration(callback?: (err: AWSError, data: Iot.Types.UpdateDomainConfigurationResponse) => void): Request<Iot.Types.UpdateDomainConfigurationResponse, AWSError>;
  /**
   * Updates a dynamic thing group. Requires permission to access the UpdateDynamicThingGroup action.
   */
  updateDynamicThingGroup(params: Iot.Types.UpdateDynamicThingGroupRequest, callback?: (err: AWSError, data: Iot.Types.UpdateDynamicThingGroupResponse) => void): Request<Iot.Types.UpdateDynamicThingGroupResponse, AWSError>;
  /**
   * Updates a dynamic thing group. Requires permission to access the UpdateDynamicThingGroup action.
   */
  updateDynamicThingGroup(callback?: (err: AWSError, data: Iot.Types.UpdateDynamicThingGroupResponse) => void): Request<Iot.Types.UpdateDynamicThingGroupResponse, AWSError>;
  /**
   * Updates the event configurations. Requires permission to access the UpdateEventConfigurations action.
   */
  updateEventConfigurations(params: Iot.Types.UpdateEventConfigurationsRequest, callback?: (err: AWSError, data: Iot.Types.UpdateEventConfigurationsResponse) => void): Request<Iot.Types.UpdateEventConfigurationsResponse, AWSError>;
  /**
   * Updates the event configurations. Requires permission to access the UpdateEventConfigurations action.
   */
  updateEventConfigurations(callback?: (err: AWSError, data: Iot.Types.UpdateEventConfigurationsResponse) => void): Request<Iot.Types.UpdateEventConfigurationsResponse, AWSError>;
  /**
   * Updates the data for a fleet metric. Requires permission to access the UpdateFleetMetric action.
   */
  updateFleetMetric(params: Iot.Types.UpdateFleetMetricRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the data for a fleet metric. Requires permission to access the UpdateFleetMetric action.
   */
  updateFleetMetric(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the search configuration. Requires permission to access the UpdateIndexingConfiguration action.
   */
  updateIndexingConfiguration(params: Iot.Types.UpdateIndexingConfigurationRequest, callback?: (err: AWSError, data: Iot.Types.UpdateIndexingConfigurationResponse) => void): Request<Iot.Types.UpdateIndexingConfigurationResponse, AWSError>;
  /**
   * Updates the search configuration. Requires permission to access the UpdateIndexingConfiguration action.
   */
  updateIndexingConfiguration(callback?: (err: AWSError, data: Iot.Types.UpdateIndexingConfigurationResponse) => void): Request<Iot.Types.UpdateIndexingConfigurationResponse, AWSError>;
  /**
   * Updates supported fields of the specified job. Requires permission to access the UpdateJob action.
   */
  updateJob(params: Iot.Types.UpdateJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates supported fields of the specified job. Requires permission to access the UpdateJob action.
   */
  updateJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the definition for the specified mitigation action. Requires permission to access the UpdateMitigationAction action.
   */
  updateMitigationAction(params: Iot.Types.UpdateMitigationActionRequest, callback?: (err: AWSError, data: Iot.Types.UpdateMitigationActionResponse) => void): Request<Iot.Types.UpdateMitigationActionResponse, AWSError>;
  /**
   * Updates the definition for the specified mitigation action. Requires permission to access the UpdateMitigationAction action.
   */
  updateMitigationAction(callback?: (err: AWSError, data: Iot.Types.UpdateMitigationActionResponse) => void): Request<Iot.Types.UpdateMitigationActionResponse, AWSError>;
  /**
   * Updates the supported fields for a specific software package. Requires permission to access the UpdatePackage and GetIndexingConfiguration actions.
   */
  updatePackage(params: Iot.Types.UpdatePackageRequest, callback?: (err: AWSError, data: Iot.Types.UpdatePackageResponse) => void): Request<Iot.Types.UpdatePackageResponse, AWSError>;
  /**
   * Updates the supported fields for a specific software package. Requires permission to access the UpdatePackage and GetIndexingConfiguration actions.
   */
  updatePackage(callback?: (err: AWSError, data: Iot.Types.UpdatePackageResponse) => void): Request<Iot.Types.UpdatePackageResponse, AWSError>;
  /**
   * Updates the software package configuration. Requires permission to access the UpdatePackageConfiguration and iam:PassRole actions.
   */
  updatePackageConfiguration(params: Iot.Types.UpdatePackageConfigurationRequest, callback?: (err: AWSError, data: Iot.Types.UpdatePackageConfigurationResponse) => void): Request<Iot.Types.UpdatePackageConfigurationResponse, AWSError>;
  /**
   * Updates the software package configuration. Requires permission to access the UpdatePackageConfiguration and iam:PassRole actions.
   */
  updatePackageConfiguration(callback?: (err: AWSError, data: Iot.Types.UpdatePackageConfigurationResponse) => void): Request<Iot.Types.UpdatePackageConfigurationResponse, AWSError>;
  /**
   * Updates the supported fields for a specific package version. Requires permission to access the UpdatePackageVersion and GetIndexingConfiguration actions.
   */
  updatePackageVersion(params: Iot.Types.UpdatePackageVersionRequest, callback?: (err: AWSError, data: Iot.Types.UpdatePackageVersionResponse) => void): Request<Iot.Types.UpdatePackageVersionResponse, AWSError>;
  /**
   * Updates the supported fields for a specific package version. Requires permission to access the UpdatePackageVersion and GetIndexingConfiguration actions.
   */
  updatePackageVersion(callback?: (err: AWSError, data: Iot.Types.UpdatePackageVersionResponse) => void): Request<Iot.Types.UpdatePackageVersionResponse, AWSError>;
  /**
   * Updates a provisioning template. Requires permission to access the UpdateProvisioningTemplate action.
   */
  updateProvisioningTemplate(params: Iot.Types.UpdateProvisioningTemplateRequest, callback?: (err: AWSError, data: Iot.Types.UpdateProvisioningTemplateResponse) => void): Request<Iot.Types.UpdateProvisioningTemplateResponse, AWSError>;
  /**
   * Updates a provisioning template. Requires permission to access the UpdateProvisioningTemplate action.
   */
  updateProvisioningTemplate(callback?: (err: AWSError, data: Iot.Types.UpdateProvisioningTemplateResponse) => void): Request<Iot.Types.UpdateProvisioningTemplateResponse, AWSError>;
  /**
   * Updates a role alias. Requires permission to access the UpdateRoleAlias action.
   */
  updateRoleAlias(params: Iot.Types.UpdateRoleAliasRequest, callback?: (err: AWSError, data: Iot.Types.UpdateRoleAliasResponse) => void): Request<Iot.Types.UpdateRoleAliasResponse, AWSError>;
  /**
   * Updates a role alias. Requires permission to access the UpdateRoleAlias action.
   */
  updateRoleAlias(callback?: (err: AWSError, data: Iot.Types.UpdateRoleAliasResponse) => void): Request<Iot.Types.UpdateRoleAliasResponse, AWSError>;
  /**
   * Updates a scheduled audit, including which checks are performed and how often the audit takes place. Requires permission to access the UpdateScheduledAudit action.
   */
  updateScheduledAudit(params: Iot.Types.UpdateScheduledAuditRequest, callback?: (err: AWSError, data: Iot.Types.UpdateScheduledAuditResponse) => void): Request<Iot.Types.UpdateScheduledAuditResponse, AWSError>;
  /**
   * Updates a scheduled audit, including which checks are performed and how often the audit takes place. Requires permission to access the UpdateScheduledAudit action.
   */
  updateScheduledAudit(callback?: (err: AWSError, data: Iot.Types.UpdateScheduledAuditResponse) => void): Request<Iot.Types.UpdateScheduledAuditResponse, AWSError>;
  /**
   * Updates a Device Defender security profile. Requires permission to access the UpdateSecurityProfile action.
   */
  updateSecurityProfile(params: Iot.Types.UpdateSecurityProfileRequest, callback?: (err: AWSError, data: Iot.Types.UpdateSecurityProfileResponse) => void): Request<Iot.Types.UpdateSecurityProfileResponse, AWSError>;
  /**
   * Updates a Device Defender security profile. Requires permission to access the UpdateSecurityProfile action.
   */
  updateSecurityProfile(callback?: (err: AWSError, data: Iot.Types.UpdateSecurityProfileResponse) => void): Request<Iot.Types.UpdateSecurityProfileResponse, AWSError>;
  /**
   * Updates an existing stream. The stream version will be incremented by one. Requires permission to access the UpdateStream action.
   */
  updateStream(params: Iot.Types.UpdateStreamRequest, callback?: (err: AWSError, data: Iot.Types.UpdateStreamResponse) => void): Request<Iot.Types.UpdateStreamResponse, AWSError>;
  /**
   * Updates an existing stream. The stream version will be incremented by one. Requires permission to access the UpdateStream action.
   */
  updateStream(callback?: (err: AWSError, data: Iot.Types.UpdateStreamResponse) => void): Request<Iot.Types.UpdateStreamResponse, AWSError>;
  /**
   * Updates the data for a thing. Requires permission to access the UpdateThing action.
   */
  updateThing(params: Iot.Types.UpdateThingRequest, callback?: (err: AWSError, data: Iot.Types.UpdateThingResponse) => void): Request<Iot.Types.UpdateThingResponse, AWSError>;
  /**
   * Updates the data for a thing. Requires permission to access the UpdateThing action.
   */
  updateThing(callback?: (err: AWSError, data: Iot.Types.UpdateThingResponse) => void): Request<Iot.Types.UpdateThingResponse, AWSError>;
  /**
   * Update a thing group. Requires permission to access the UpdateThingGroup action.
   */
  updateThingGroup(params: Iot.Types.UpdateThingGroupRequest, callback?: (err: AWSError, data: Iot.Types.UpdateThingGroupResponse) => void): Request<Iot.Types.UpdateThingGroupResponse, AWSError>;
  /**
   * Update a thing group. Requires permission to access the UpdateThingGroup action.
   */
  updateThingGroup(callback?: (err: AWSError, data: Iot.Types.UpdateThingGroupResponse) => void): Request<Iot.Types.UpdateThingGroupResponse, AWSError>;
  /**
   * Updates the groups to which the thing belongs. Requires permission to access the UpdateThingGroupsForThing action.
   */
  updateThingGroupsForThing(params: Iot.Types.UpdateThingGroupsForThingRequest, callback?: (err: AWSError, data: Iot.Types.UpdateThingGroupsForThingResponse) => void): Request<Iot.Types.UpdateThingGroupsForThingResponse, AWSError>;
  /**
   * Updates the groups to which the thing belongs. Requires permission to access the UpdateThingGroupsForThing action.
   */
  updateThingGroupsForThing(callback?: (err: AWSError, data: Iot.Types.UpdateThingGroupsForThingResponse) => void): Request<Iot.Types.UpdateThingGroupsForThingResponse, AWSError>;
  /**
   * Updates a topic rule destination. You use this to change the status, endpoint URL, or confirmation URL of the destination. Requires permission to access the UpdateTopicRuleDestination action.
   */
  updateTopicRuleDestination(params: Iot.Types.UpdateTopicRuleDestinationRequest, callback?: (err: AWSError, data: Iot.Types.UpdateTopicRuleDestinationResponse) => void): Request<Iot.Types.UpdateTopicRuleDestinationResponse, AWSError>;
  /**
   * Updates a topic rule destination. You use this to change the status, endpoint URL, or confirmation URL of the destination. Requires permission to access the UpdateTopicRuleDestination action.
   */
  updateTopicRuleDestination(callback?: (err: AWSError, data: Iot.Types.UpdateTopicRuleDestinationResponse) => void): Request<Iot.Types.UpdateTopicRuleDestinationResponse, AWSError>;
  /**
   * Validates a Device Defender security profile behaviors specification. Requires permission to access the ValidateSecurityProfileBehaviors action.
   */
  validateSecurityProfileBehaviors(params: Iot.Types.ValidateSecurityProfileBehaviorsRequest, callback?: (err: AWSError, data: Iot.Types.ValidateSecurityProfileBehaviorsResponse) => void): Request<Iot.Types.ValidateSecurityProfileBehaviorsResponse, AWSError>;
  /**
   * Validates a Device Defender security profile behaviors specification. Requires permission to access the ValidateSecurityProfileBehaviors action.
   */
  validateSecurityProfileBehaviors(callback?: (err: AWSError, data: Iot.Types.ValidateSecurityProfileBehaviorsResponse) => void): Request<Iot.Types.ValidateSecurityProfileBehaviorsResponse, AWSError>;
}
declare namespace Iot {
  export type AbortAction = "CANCEL"|string;
  export interface AbortConfig {
    /**
     * The list of criteria that determine when and how to abort the job.
     */
    criteriaList: AbortCriteriaList;
  }
  export interface AbortCriteria {
    /**
     * The type of job execution failures that can initiate a job abort.
     */
    failureType: JobExecutionFailureType;
    /**
     * The type of job action to take to initiate the job abort.
     */
    action: AbortAction;
    /**
     * The minimum percentage of job execution failures that must occur to initiate the job abort. Amazon Web Services IoT Core supports up to two digits after the decimal (for example, 10.9 and 10.99, but not 10.999).
     */
    thresholdPercentage: AbortThresholdPercentage;
    /**
     * The minimum number of things which must receive job execution notifications before the job can be aborted.
     */
    minNumberOfExecutedThings: MinimumNumberOfExecutedThings;
  }
  export type AbortCriteriaList = AbortCriteria[];
  export type AbortThresholdPercentage = number;
  export interface AcceptCertificateTransferRequest {
    /**
     * The ID of the certificate. (The last part of the certificate ARN contains the certificate ID.)
     */
    certificateId: CertificateId;
    /**
     * Specifies whether the certificate is active.
     */
    setAsActive?: SetAsActive;
  }
  export type AcmCertificateArn = string;
  export interface Action {
    /**
     * Write to a DynamoDB table.
     */
    dynamoDB?: DynamoDBAction;
    /**
     * Write to a DynamoDB table. This is a new version of the DynamoDB action. It allows you to write each attribute in an MQTT message payload into a separate DynamoDB column.
     */
    dynamoDBv2?: DynamoDBv2Action;
    /**
     * Invoke a Lambda function.
     */
    lambda?: LambdaAction;
    /**
     * Publish to an Amazon SNS topic.
     */
    sns?: SnsAction;
    /**
     * Publish to an Amazon SQS queue.
     */
    sqs?: SqsAction;
    /**
     * Write data to an Amazon Kinesis stream.
     */
    kinesis?: KinesisAction;
    /**
     * Publish to another MQTT topic.
     */
    republish?: RepublishAction;
    /**
     * Write to an Amazon S3 bucket.
     */
    s3?: S3Action;
    /**
     * Write to an Amazon Kinesis Firehose stream.
     */
    firehose?: FirehoseAction;
    /**
     * Capture a CloudWatch metric.
     */
    cloudwatchMetric?: CloudwatchMetricAction;
    /**
     * Change the state of a CloudWatch alarm.
     */
    cloudwatchAlarm?: CloudwatchAlarmAction;
    /**
     * Send data to CloudWatch Logs.
     */
    cloudwatchLogs?: CloudwatchLogsAction;
    /**
     * Write data to an Amazon OpenSearch Service domain.  The Elasticsearch action can only be used by existing rule actions. To create a new rule action or to update an existing rule action, use the OpenSearch rule action instead. For more information, see OpenSearchAction. 
     */
    elasticsearch?: ElasticsearchAction;
    /**
     * Send a message to a Salesforce IoT Cloud Input Stream.
     */
    salesforce?: SalesforceAction;
    /**
     * Sends message data to an IoT Analytics channel.
     */
    iotAnalytics?: IotAnalyticsAction;
    /**
     * Sends an input to an IoT Events detector.
     */
    iotEvents?: IotEventsAction;
    /**
     * Sends data from the MQTT message that triggered the rule to IoT SiteWise asset properties.
     */
    iotSiteWise?: IotSiteWiseAction;
    /**
     * Starts execution of a Step Functions state machine.
     */
    stepFunctions?: StepFunctionsAction;
    /**
     * The Timestream rule action writes attributes (measures) from an MQTT message into an Amazon Timestream table. For more information, see the Timestream topic rule action documentation.
     */
    timestream?: TimestreamAction;
    /**
     * Send data to an HTTPS endpoint.
     */
    http?: HttpAction;
    /**
     * Send messages to an Amazon Managed Streaming for Apache Kafka (Amazon MSK) or self-managed Apache Kafka cluster.
     */
    kafka?: KafkaAction;
    /**
     * Write data to an Amazon OpenSearch Service domain.
     */
    openSearch?: OpenSearchAction;
    /**
     * The Amazon Location Service rule action sends device location updates from an MQTT message to an Amazon Location tracker resource.
     */
    location?: LocationAction;
  }
  export type ActionList = Action[];
  export type ActionType = "PUBLISH"|"SUBSCRIBE"|"RECEIVE"|"CONNECT"|string;
  export interface ActiveViolation {
    /**
     * The ID of the active violation.
     */
    violationId?: ViolationId;
    /**
     * The name of the thing responsible for the active violation.
     */
    thingName?: DeviceDefenderThingName;
    /**
     * The security profile with the behavior is in violation.
     */
    securityProfileName?: SecurityProfileName;
    /**
     * The behavior that is being violated.
     */
    behavior?: Behavior;
    /**
     * The value of the metric (the measurement) that caused the most recent violation.
     */
    lastViolationValue?: MetricValue;
    /**
     *  The details of a violation event. 
     */
    violationEventAdditionalInfo?: ViolationEventAdditionalInfo;
    /**
     * The verification state of the violation (detect alarm).
     */
    verificationState?: VerificationState;
    /**
     * The description of the verification state of the violation.
     */
    verificationStateDescription?: VerificationStateDescription;
    /**
     * The time the most recent violation occurred.
     */
    lastViolationTime?: Timestamp;
    /**
     * The time the violation started.
     */
    violationStartTime?: Timestamp;
  }
  export type ActiveViolations = ActiveViolation[];
  export interface AddThingToBillingGroupRequest {
    /**
     * The name of the billing group.  This call is asynchronous. It might take several seconds for the detachment to propagate. 
     */
    billingGroupName?: BillingGroupName;
    /**
     * The ARN of the billing group.
     */
    billingGroupArn?: BillingGroupArn;
    /**
     * The name of the thing to be added to the billing group.
     */
    thingName?: ThingName;
    /**
     * The ARN of the thing to be added to the billing group.
     */
    thingArn?: ThingArn;
  }
  export interface AddThingToBillingGroupResponse {
  }
  export interface AddThingToThingGroupRequest {
    /**
     * The name of the group to which you are adding a thing.
     */
    thingGroupName?: ThingGroupName;
    /**
     * The ARN of the group to which you are adding a thing.
     */
    thingGroupArn?: ThingGroupArn;
    /**
     * The name of the thing to add to a group.
     */
    thingName?: ThingName;
    /**
     * The ARN of the thing to add to a group.
     */
    thingArn?: ThingArn;
    /**
     * Override dynamic thing groups with static thing groups when 10-group limit is reached. If a thing belongs to 10 thing groups, and one or more of those groups are dynamic thing groups, adding a thing to a static group removes the thing from the last dynamic group.
     */
    overrideDynamicGroups?: OverrideDynamicGroups;
  }
  export interface AddThingToThingGroupResponse {
  }
  export interface AddThingsToThingGroupParams {
    /**
     * The list of groups to which you want to add the things that triggered the mitigation action. You can add a thing to a maximum of 10 groups, but you can't add a thing to more than one group in the same hierarchy.
     */
    thingGroupNames: ThingGroupNames;
    /**
     * Specifies if this mitigation action can move the things that triggered the mitigation action even if they are part of one or more dynamic thing groups.
     */
    overrideDynamicGroups?: NullableBoolean;
  }
  export type AdditionalMetricsToRetainList = BehaviorMetric[];
  export type AdditionalMetricsToRetainV2List = MetricToRetain[];
  export type AdditionalParameterMap = {[key: string]: Value};
  export type AggregationField = string;
  export interface AggregationType {
    /**
     * The name of the aggregation type.
     */
    name: AggregationTypeName;
    /**
     * A list of the values of aggregation types.
     */
    values?: AggregationTypeValues;
  }
  export type AggregationTypeName = "Statistics"|"Percentiles"|"Cardinality"|string;
  export type AggregationTypeValue = string;
  export type AggregationTypeValues = AggregationTypeValue[];
  export type AlarmName = string;
  export interface AlertTarget {
    /**
     * The Amazon Resource Name (ARN) of the notification target to which alerts are sent.
     */
    alertTargetArn: AlertTargetArn;
    /**
     * The ARN of the role that grants permission to send alerts to the notification target.
     */
    roleArn: RoleArn;
  }
  export type AlertTargetArn = string;
  export type AlertTargetType = "SNS"|string;
  export type AlertTargets = {[key: string]: AlertTarget};
  export type AllowAuthorizerOverride = boolean;
  export type AllowAutoRegistration = boolean;
  export interface Allowed {
    /**
     * A list of policies that allowed the authentication.
     */
    policies?: Policies;
  }
  export type ApproximateSecondsBeforeTimedOut = number;
  export type AscendingOrder = boolean;
  export type AssetId = string;
  export type AssetPropertyAlias = string;
  export type AssetPropertyBooleanValue = string;
  export type AssetPropertyDoubleValue = string;
  export type AssetPropertyEntryId = string;
  export type AssetPropertyId = string;
  export type AssetPropertyIntegerValue = string;
  export type AssetPropertyOffsetInNanos = string;
  export type AssetPropertyQuality = string;
  export type AssetPropertyStringValue = string;
  export type AssetPropertyTimeInSeconds = string;
  export interface AssetPropertyTimestamp {
    /**
     * A string that contains the time in seconds since epoch. Accepts substitution templates.
     */
    timeInSeconds: AssetPropertyTimeInSeconds;
    /**
     * Optional. A string that contains the nanosecond time offset. Accepts substitution templates.
     */
    offsetInNanos?: AssetPropertyOffsetInNanos;
  }
  export interface AssetPropertyValue {
    /**
     * The value of the asset property.
     */
    value: AssetPropertyVariant;
    /**
     * The asset property value timestamp.
     */
    timestamp: AssetPropertyTimestamp;
    /**
     * Optional. A string that describes the quality of the value. Accepts substitution templates. Must be GOOD, BAD, or UNCERTAIN.
     */
    quality?: AssetPropertyQuality;
  }
  export type AssetPropertyValueList = AssetPropertyValue[];
  export interface AssetPropertyVariant {
    /**
     * Optional. The string value of the value entry. Accepts substitution templates.
     */
    stringValue?: AssetPropertyStringValue;
    /**
     * Optional. A string that contains the integer value of the value entry. Accepts substitution templates.
     */
    integerValue?: AssetPropertyIntegerValue;
    /**
     * Optional. A string that contains the double value of the value entry. Accepts substitution templates.
     */
    doubleValue?: AssetPropertyDoubleValue;
    /**
     * Optional. A string that contains the boolean value (true or false) of the value entry. Accepts substitution templates.
     */
    booleanValue?: AssetPropertyBooleanValue;
  }
  export interface AssociateTargetsWithJobRequest {
    /**
     * A list of thing group ARNs that define the targets of the job.
     */
    targets: JobTargets;
    /**
     * The unique identifier you assigned to this job when it was created.
     */
    jobId: JobId;
    /**
     * An optional comment string describing why the job was associated with the targets.
     */
    comment?: Comment;
    /**
     * The namespace used to indicate that a job is a customer-managed job. When you specify a value for this parameter, Amazon Web Services IoT Core sends jobs notifications to MQTT topics that contain the value in the following format.  $aws/things/THING_NAME/jobs/JOB_ID/notify-namespace-NAMESPACE_ID/   The namespaceId feature is in public preview. 
     */
    namespaceId?: NamespaceId;
  }
  export interface AssociateTargetsWithJobResponse {
    /**
     * An ARN identifying the job.
     */
    jobArn?: JobArn;
    /**
     * The unique identifier you assigned to this job when it was created.
     */
    jobId?: JobId;
    /**
     * A short text description of the job.
     */
    description?: JobDescription;
  }
  export interface AttachPolicyRequest {
    /**
     * The name of the policy to attach.
     */
    policyName: PolicyName;
    /**
     * The identity to which the policy is attached. For example, a thing group or a certificate.
     */
    target: PolicyTarget;
  }
  export interface AttachPrincipalPolicyRequest {
    /**
     * The policy name.
     */
    policyName: PolicyName;
    /**
     * The principal, which can be a certificate ARN (as returned from the CreateCertificate operation) or an Amazon Cognito ID.
     */
    principal: Principal;
  }
  export interface AttachSecurityProfileRequest {
    /**
     * The security profile that is attached.
     */
    securityProfileName: SecurityProfileName;
    /**
     * The ARN of the target (thing group) to which the security profile is attached.
     */
    securityProfileTargetArn: SecurityProfileTargetArn;
  }
  export interface AttachSecurityProfileResponse {
  }
  export interface AttachThingPrincipalRequest {
    /**
     * The name of the thing.
     */
    thingName: ThingName;
    /**
     * The principal, which can be a certificate ARN (as returned from the CreateCertificate operation) or an Amazon Cognito ID.
     */
    principal: Principal;
  }
  export interface AttachThingPrincipalResponse {
  }
  export type AttributeKey = string;
  export type AttributeName = string;
  export interface AttributePayload {
    /**
     * A JSON string containing up to three key-value pair in JSON format. For example:  {\"attributes\":{\"string1\":\"string2\"}} 
     */
    attributes?: Attributes;
    /**
     * Specifies whether the list of attributes provided in the AttributePayload is merged with the attributes stored in the registry, instead of overwriting them. To remove an attribute, call UpdateThing with an empty attribute value.  The merge attribute is only valid when calling UpdateThing or UpdateThingGroup. 
     */
    merge?: Flag;
  }
  export type AttributeValue = string;
  export type Attributes = {[key: string]: AttributeValue};
  export type AttributesMap = {[key: string]: Value};
  export interface AuditCheckConfiguration {
    /**
     * True if this audit check is enabled for this account.
     */
    enabled?: Enabled;
  }
  export type AuditCheckConfigurations = {[key: string]: AuditCheckConfiguration};
  export interface AuditCheckDetails {
    /**
     * The completion status of this check. One of "IN_PROGRESS", "WAITING_FOR_DATA_COLLECTION", "CANCELED", "COMPLETED_COMPLIANT", "COMPLETED_NON_COMPLIANT", or "FAILED".
     */
    checkRunStatus?: AuditCheckRunStatus;
    /**
     * True if the check is complete and found all resources compliant.
     */
    checkCompliant?: CheckCompliant;
    /**
     * The number of resources on which the check was performed.
     */
    totalResourcesCount?: TotalResourcesCount;
    /**
     * The number of resources that were found noncompliant during the check.
     */
    nonCompliantResourcesCount?: NonCompliantResourcesCount;
    /**
     *  Describes how many of the non-compliant resources created during the evaluation of an audit check were marked as suppressed. 
     */
    suppressedNonCompliantResourcesCount?: SuppressedNonCompliantResourcesCount;
    /**
     * The code of any error encountered when this check is performed during this audit. One of "INSUFFICIENT_PERMISSIONS" or "AUDIT_CHECK_DISABLED".
     */
    errorCode?: ErrorCode;
    /**
     * The message associated with any error encountered when this check is performed during this audit.
     */
    message?: ErrorMessage;
  }
  export type AuditCheckName = string;
  export type AuditCheckRunStatus = "IN_PROGRESS"|"WAITING_FOR_DATA_COLLECTION"|"CANCELED"|"COMPLETED_COMPLIANT"|"COMPLETED_NON_COMPLIANT"|"FAILED"|string;
  export type AuditCheckToActionsMapping = {[key: string]: MitigationActionNameList};
  export type AuditCheckToReasonCodeFilter = {[key: string]: ReasonForNonComplianceCodes};
  export type AuditDescription = string;
  export type AuditDetails = {[key: string]: AuditCheckDetails};
  export interface AuditFinding {
    /**
     * A unique identifier for this set of audit findings. This identifier is used to apply mitigation tasks to one or more sets of findings.
     */
    findingId?: FindingId;
    /**
     * The ID of the audit that generated this result (finding).
     */
    taskId?: AuditTaskId;
    /**
     * The audit check that generated this result.
     */
    checkName?: AuditCheckName;
    /**
     * The time the audit started.
     */
    taskStartTime?: Timestamp;
    /**
     * The time the result (finding) was discovered.
     */
    findingTime?: Timestamp;
    /**
     * The severity of the result (finding).
     */
    severity?: AuditFindingSeverity;
    /**
     * The resource that was found to be noncompliant with the audit check.
     */
    nonCompliantResource?: NonCompliantResource;
    /**
     * The list of related resources.
     */
    relatedResources?: RelatedResources;
    /**
     * The reason the resource was noncompliant.
     */
    reasonForNonCompliance?: ReasonForNonCompliance;
    /**
     * A code that indicates the reason that the resource was noncompliant.
     */
    reasonForNonComplianceCode?: ReasonForNonComplianceCode;
    /**
     *  Indicates whether the audit finding was suppressed or not during reporting. 
     */
    isSuppressed?: IsSuppressed;
  }
  export type AuditFindingSeverity = "CRITICAL"|"HIGH"|"MEDIUM"|"LOW"|string;
  export type AuditFindings = AuditFinding[];
  export type AuditFrequency = "DAILY"|"WEEKLY"|"BIWEEKLY"|"MONTHLY"|string;
  export interface AuditMitigationActionExecutionMetadata {
    /**
     * The unique identifier for the task that applies the mitigation action.
     */
    taskId?: MitigationActionsTaskId;
    /**
     * The unique identifier for the findings to which the task and associated mitigation action are applied.
     */
    findingId?: FindingId;
    /**
     * The friendly name of the mitigation action being applied by the task.
     */
    actionName?: MitigationActionName;
    /**
     * The unique identifier for the mitigation action being applied by the task.
     */
    actionId?: MitigationActionId;
    /**
     * The current status of the task being executed.
     */
    status?: AuditMitigationActionsExecutionStatus;
    /**
     * The date and time when the task was started.
     */
    startTime?: Timestamp;
    /**
     * The date and time when the task was completed or canceled. Blank if the task is still running.
     */
    endTime?: Timestamp;
    /**
     * If an error occurred, the code that indicates which type of error occurred.
     */
    errorCode?: ErrorCode;
    /**
     * If an error occurred, a message that describes the error.
     */
    message?: ErrorMessage;
  }
  export type AuditMitigationActionExecutionMetadataList = AuditMitigationActionExecutionMetadata[];
  export type AuditMitigationActionsExecutionStatus = "IN_PROGRESS"|"COMPLETED"|"FAILED"|"CANCELED"|"SKIPPED"|"PENDING"|string;
  export interface AuditMitigationActionsTaskMetadata {
    /**
     * The unique identifier for the task.
     */
    taskId?: MitigationActionsTaskId;
    /**
     * The time at which the audit mitigation actions task was started.
     */
    startTime?: Timestamp;
    /**
     * The current state of the audit mitigation actions task.
     */
    taskStatus?: AuditMitigationActionsTaskStatus;
  }
  export type AuditMitigationActionsTaskMetadataList = AuditMitigationActionsTaskMetadata[];
  export type AuditMitigationActionsTaskStatistics = {[key: string]: TaskStatisticsForAuditCheck};
  export type AuditMitigationActionsTaskStatus = "IN_PROGRESS"|"COMPLETED"|"FAILED"|"CANCELED"|string;
  export interface AuditMitigationActionsTaskTarget {
    /**
     * If the task will apply a mitigation action to findings from a specific audit, this value uniquely identifies the audit.
     */
    auditTaskId?: AuditTaskId;
    /**
     * If the task will apply a mitigation action to one or more listed findings, this value uniquely identifies those findings.
     */
    findingIds?: FindingIds;
    /**
     * Specifies a filter in the form of an audit check and set of reason codes that identify the findings from the audit to which the audit mitigation actions task apply.
     */
    auditCheckToReasonCodeFilter?: AuditCheckToReasonCodeFilter;
  }
  export interface AuditNotificationTarget {
    /**
     * The ARN of the target (SNS topic) to which audit notifications are sent.
     */
    targetArn?: TargetArn;
    /**
     * The ARN of the role that grants permission to send notifications to the target.
     */
    roleArn?: RoleArn;
    /**
     * True if notifications to the target are enabled.
     */
    enabled?: Enabled;
  }
  export type AuditNotificationTargetConfigurations = {[key: string]: AuditNotificationTarget};
  export type AuditNotificationType = "SNS"|string;
  export interface AuditSuppression {
    checkName: AuditCheckName;
    resourceIdentifier: ResourceIdentifier;
    /**
     *  The expiration date (epoch timestamp in seconds) that you want the suppression to adhere to. 
     */
    expirationDate?: Timestamp;
    /**
     *  Indicates whether a suppression should exist indefinitely or not. 
     */
    suppressIndefinitely?: SuppressIndefinitely;
    /**
     *  The description of the audit suppression. 
     */
    description?: AuditDescription;
  }
  export type AuditSuppressionList = AuditSuppression[];
  export type AuditTaskId = string;
  export interface AuditTaskMetadata {
    /**
     * The ID of this audit.
     */
    taskId?: AuditTaskId;
    /**
     * The status of this audit. One of "IN_PROGRESS", "COMPLETED", "FAILED", or "CANCELED".
     */
    taskStatus?: AuditTaskStatus;
    /**
     * The type of this audit. One of "ON_DEMAND_AUDIT_TASK" or "SCHEDULED_AUDIT_TASK".
     */
    taskType?: AuditTaskType;
  }
  export type AuditTaskMetadataList = AuditTaskMetadata[];
  export type AuditTaskStatus = "IN_PROGRESS"|"COMPLETED"|"FAILED"|"CANCELED"|string;
  export type AuditTaskType = "ON_DEMAND_AUDIT_TASK"|"SCHEDULED_AUDIT_TASK"|string;
  export type AuthDecision = "ALLOWED"|"EXPLICIT_DENY"|"IMPLICIT_DENY"|string;
  export interface AuthInfo {
    /**
     * The type of action for which the principal is being authorized.
     */
    actionType?: ActionType;
    /**
     * The resources for which the principal is being authorized to perform the specified action.
     */
    resources: Resources;
  }
  export type AuthInfos = AuthInfo[];
  export interface AuthResult {
    /**
     * Authorization information.
     */
    authInfo?: AuthInfo;
    /**
     * The policies and statements that allowed the specified action.
     */
    allowed?: Allowed;
    /**
     * The policies and statements that denied the specified action.
     */
    denied?: Denied;
    /**
     * The final authorization decision of this scenario. Multiple statements are taken into account when determining the authorization decision. An explicit deny statement can override multiple allow statements.
     */
    authDecision?: AuthDecision;
    /**
     * Contains any missing context values found while evaluating policy.
     */
    missingContextValues?: MissingContextValues;
  }
  export type AuthResults = AuthResult[];
  export type AuthorizerArn = string;
  export interface AuthorizerConfig {
    /**
     * The name of the authorization service for a domain configuration.
     */
    defaultAuthorizerName?: AuthorizerName;
    /**
     * A Boolean that specifies whether the domain configuration's authorization service can be overridden.
     */
    allowAuthorizerOverride?: AllowAuthorizerOverride;
  }
  export interface AuthorizerDescription {
    /**
     * The authorizer name.
     */
    authorizerName?: AuthorizerName;
    /**
     * The authorizer ARN.
     */
    authorizerArn?: AuthorizerArn;
    /**
     * The authorizer's Lambda function ARN.
     */
    authorizerFunctionArn?: AuthorizerFunctionArn;
    /**
     * The key used to extract the token from the HTTP headers.
     */
    tokenKeyName?: TokenKeyName;
    /**
     * The public keys used to validate the token signature returned by your custom authentication service.
     */
    tokenSigningPublicKeys?: PublicKeyMap;
    /**
     * The status of the authorizer.
     */
    status?: AuthorizerStatus;
    /**
     * The UNIX timestamp of when the authorizer was created.
     */
    creationDate?: DateType;
    /**
     * The UNIX timestamp of when the authorizer was last updated.
     */
    lastModifiedDate?: DateType;
    /**
     * Specifies whether IoT validates the token signature in an authorization request.
     */
    signingDisabled?: BooleanKey;
    /**
     * When true, the result from the authorizer’s Lambda function is cached for the time specified in refreshAfterInSeconds. The cached result is used while the device reuses the same HTTP connection.
     */
    enableCachingForHttp?: EnableCachingForHttp;
  }
  export type AuthorizerFunctionArn = string;
  export type AuthorizerName = string;
  export type AuthorizerStatus = "ACTIVE"|"INACTIVE"|string;
  export interface AuthorizerSummary {
    /**
     * The authorizer name.
     */
    authorizerName?: AuthorizerName;
    /**
     * The authorizer ARN.
     */
    authorizerArn?: AuthorizerArn;
  }
  export type Authorizers = AuthorizerSummary[];
  export type AutoRegistrationStatus = "ENABLE"|"DISABLE"|string;
  export type Average = number;
  export type AwsAccountId = string;
  export type AwsArn = string;
  export type AwsIotJobArn = string;
  export type AwsIotJobId = string;
  export type AwsIotSqlVersion = string;
  export interface AwsJobAbortConfig {
    /**
     * The list of criteria that determine when and how to abort the job.
     */
    abortCriteriaList: AwsJobAbortCriteriaList;
  }
  export interface AwsJobAbortCriteria {
    /**
     * The type of job execution failures that can initiate a job abort.
     */
    failureType: AwsJobAbortCriteriaFailureType;
    /**
     * The type of job action to take to initiate the job abort.
     */
    action: AwsJobAbortCriteriaAbortAction;
    /**
     * The minimum percentage of job execution failures that must occur to initiate the job abort. Amazon Web Services IoT Core supports up to two digits after the decimal (for example, 10.9 and 10.99, but not 10.999).
     */
    thresholdPercentage: AwsJobAbortCriteriaAbortThresholdPercentage;
    /**
     * The minimum number of things which must receive job execution notifications before the job can be aborted.
     */
    minNumberOfExecutedThings: AwsJobAbortCriteriaMinimumNumberOfExecutedThings;
  }
  export type AwsJobAbortCriteriaAbortAction = "CANCEL"|string;
  export type AwsJobAbortCriteriaAbortThresholdPercentage = number;
  export type AwsJobAbortCriteriaFailureType = "FAILED"|"REJECTED"|"TIMED_OUT"|"ALL"|string;
  export type AwsJobAbortCriteriaList = AwsJobAbortCriteria[];
  export type AwsJobAbortCriteriaMinimumNumberOfExecutedThings = number;
  export interface AwsJobExecutionsRolloutConfig {
    /**
     * The maximum number of OTA update job executions started per minute.
     */
    maximumPerMinute?: MaximumPerMinute;
    /**
     * The rate of increase for a job rollout. This parameter allows you to define an exponential rate increase for a job rollout.
     */
    exponentialRate?: AwsJobExponentialRolloutRate;
  }
  export interface AwsJobExponentialRolloutRate {
    /**
     * The minimum number of things that will be notified of a pending job, per minute, at the start of the job rollout. This is the initial rate of the rollout.
     */
    baseRatePerMinute: AwsJobRolloutRatePerMinute;
    /**
     * The rate of increase for a job rollout. The number of things notified is multiplied by this factor.
     */
    incrementFactor: AwsJobRolloutIncrementFactor;
    /**
     * The criteria to initiate the increase in rate of rollout for a job. Amazon Web Services IoT Core supports up to one digit after the decimal (for example, 1.5, but not 1.55).
     */
    rateIncreaseCriteria: AwsJobRateIncreaseCriteria;
  }
  export interface AwsJobPresignedUrlConfig {
    /**
     * How long (in seconds) pre-signed URLs are valid. Valid values are 60 - 3600, the default value is 1800 seconds. Pre-signed URLs are generated when a request for the job document is received.
     */
    expiresInSec?: ExpiresInSeconds;
  }
  export interface AwsJobRateIncreaseCriteria {
    /**
     * When this number of things have been notified, it will initiate an increase in the rollout rate.
     */
    numberOfNotifiedThings?: AwsJobRateIncreaseCriteriaNumberOfThings;
    /**
     * When this number of things have succeeded in their job execution, it will initiate an increase in the rollout rate.
     */
    numberOfSucceededThings?: AwsJobRateIncreaseCriteriaNumberOfThings;
  }
  export type AwsJobRateIncreaseCriteriaNumberOfThings = number;
  export type AwsJobRolloutIncrementFactor = number;
  export type AwsJobRolloutRatePerMinute = number;
  export interface AwsJobTimeoutConfig {
    /**
     * Specifies the amount of time, in minutes, this device has to finish execution of this job. The timeout interval can be anywhere between 1 minute and 7 days (1 to 10080 minutes). The in progress timer can't be updated and will apply to all job executions for the job. Whenever a job execution remains in the IN_PROGRESS status for longer than this interval, the job execution will fail and switch to the terminal TIMED_OUT status.
     */
    inProgressTimeoutInMinutes?: AwsJobTimeoutInProgressTimeoutInMinutes;
  }
  export type AwsJobTimeoutInProgressTimeoutInMinutes = number;
  export type BatchMode = boolean;
  export interface Behavior {
    /**
     * The name you've given to the behavior.
     */
    name: BehaviorName;
    /**
     * What is measured by the behavior.
     */
    metric?: BehaviorMetric;
    /**
     * The dimension for a metric in your behavior. For example, using a TOPIC_FILTER dimension, you can narrow down the scope of the metric to only MQTT topics where the name matches the pattern specified in the dimension. This can't be used with custom metrics.
     */
    metricDimension?: MetricDimension;
    /**
     * The criteria that determine if a device is behaving normally in regard to the metric.  In the IoT console, you can choose to be sent an alert through Amazon SNS when IoT Device Defender detects that a device is behaving anomalously. 
     */
    criteria?: BehaviorCriteria;
    /**
     *  Suppresses alerts. 
     */
    suppressAlerts?: SuppressAlerts;
  }
  export interface BehaviorCriteria {
    /**
     * The operator that relates the thing measured (metric) to the criteria (containing a value or statisticalThreshold). Valid operators include:    string-list: in-set and not-in-set     number-list: in-set and not-in-set     ip-address-list: in-cidr-set and not-in-cidr-set     number: less-than, less-than-equals, greater-than, and greater-than-equals   
     */
    comparisonOperator?: ComparisonOperator;
    /**
     * The value to be compared with the metric.
     */
    value?: MetricValue;
    /**
     * Use this to specify the time duration over which the behavior is evaluated, for those criteria that have a time dimension (for example, NUM_MESSAGES_SENT). For a statisticalThreshhold metric comparison, measurements from all devices are accumulated over this time duration before being used to calculate percentiles, and later, measurements from an individual device are also accumulated over this time duration before being given a percentile rank. Cannot be used with list-based metric datatypes.
     */
    durationSeconds?: DurationSeconds;
    /**
     * If a device is in violation of the behavior for the specified number of consecutive datapoints, an alarm occurs. If not specified, the default is 1.
     */
    consecutiveDatapointsToAlarm?: ConsecutiveDatapointsToAlarm;
    /**
     * If an alarm has occurred and the offending device is no longer in violation of the behavior for the specified number of consecutive datapoints, the alarm is cleared. If not specified, the default is 1.
     */
    consecutiveDatapointsToClear?: ConsecutiveDatapointsToClear;
    /**
     * A statistical ranking (percentile)that indicates a threshold value by which a behavior is determined to be in compliance or in violation of the behavior.
     */
    statisticalThreshold?: StatisticalThreshold;
    /**
     *  The configuration of an ML Detect 
     */
    mlDetectionConfig?: MachineLearningDetectionConfig;
  }
  export type BehaviorCriteriaType = "STATIC"|"STATISTICAL"|"MACHINE_LEARNING"|string;
  export type BehaviorMetric = string;
  export type BehaviorModelTrainingSummaries = BehaviorModelTrainingSummary[];
  export interface BehaviorModelTrainingSummary {
    /**
     *  The name of the security profile. 
     */
    securityProfileName?: SecurityProfileName;
    /**
     *  The name of the behavior. 
     */
    behaviorName?: BehaviorName;
    /**
     *  The date a training model started collecting data. 
     */
    trainingDataCollectionStartDate?: Timestamp;
    /**
     *  The status of the behavior model. 
     */
    modelStatus?: ModelStatus;
    /**
     *  The percentage of datapoints collected. 
     */
    datapointsCollectionPercentage?: DataCollectionPercentage;
    /**
     *  The date the model was last refreshed. 
     */
    lastModelRefreshDate?: Timestamp;
  }
  export type BehaviorName = string;
  export type Behaviors = Behavior[];
  export type BillingGroupArn = string;
  export type BillingGroupDescription = string;
  export type BillingGroupId = string;
  export interface BillingGroupMetadata {
    /**
     * The date the billing group was created.
     */
    creationDate?: CreationDate;
  }
  export type BillingGroupName = string;
  export type BillingGroupNameAndArnList = GroupNameAndArn[];
  export interface BillingGroupProperties {
    /**
     * The description of the billing group.
     */
    billingGroupDescription?: BillingGroupDescription;
  }
  export type Boolean = boolean;
  export type BooleanKey = boolean;
  export type BooleanWrapperObject = boolean;
  export interface Bucket {
    /**
     * The value counted for the particular bucket.
     */
    keyValue?: BucketKeyValue;
    /**
     * The number of documents that have the value counted for the particular bucket.
     */
    count?: Count;
  }
  export type BucketKeyValue = string;
  export type BucketName = string;
  export type Buckets = Bucket[];
  export interface BucketsAggregationType {
    /**
     * Performs an aggregation that will return a list of buckets. The list of buckets is a ranked list of the number of occurrences of an aggregation field value.
     */
    termsAggregation?: TermsAggregation;
  }
  export interface CACertificate {
    /**
     * The ARN of the CA certificate.
     */
    certificateArn?: CertificateArn;
    /**
     * The ID of the CA certificate.
     */
    certificateId?: CertificateId;
    /**
     * The status of the CA certificate. The status value REGISTER_INACTIVE is deprecated and should not be used.
     */
    status?: CACertificateStatus;
    /**
     * The date the CA certificate was created.
     */
    creationDate?: DateType;
  }
  export interface CACertificateDescription {
    /**
     * The CA certificate ARN.
     */
    certificateArn?: CertificateArn;
    /**
     * The CA certificate ID.
     */
    certificateId?: CertificateId;
    /**
     * The status of a CA certificate.
     */
    status?: CACertificateStatus;
    /**
     * The CA certificate data, in PEM format.
     */
    certificatePem?: CertificatePem;
    /**
     * The owner of the CA certificate.
     */
    ownedBy?: AwsAccountId;
    /**
     * The date the CA certificate was created.
     */
    creationDate?: DateType;
    /**
     * Whether the CA certificate configured for auto registration of device certificates. Valid values are "ENABLE" and "DISABLE"
     */
    autoRegistrationStatus?: AutoRegistrationStatus;
    /**
     * The date the CA certificate was last modified.
     */
    lastModifiedDate?: DateType;
    /**
     * The customer version of the CA certificate.
     */
    customerVersion?: CustomerVersion;
    /**
     * The generation ID of the CA certificate.
     */
    generationId?: GenerationId;
    /**
     * When the CA certificate is valid.
     */
    validity?: CertificateValidity;
    /**
     * The mode of the CA.  All the device certificates that are registered using this CA will be registered in the same mode as the CA. For more information about certificate mode for device certificates, see certificate mode.
     */
    certificateMode?: CertificateMode;
  }
  export type CACertificateStatus = "ACTIVE"|"INACTIVE"|string;
  export type CACertificateUpdateAction = "DEACTIVATE"|string;
  export type CACertificates = CACertificate[];
  export interface CancelAuditMitigationActionsTaskRequest {
    /**
     * The unique identifier for the task that you want to cancel. 
     */
    taskId: MitigationActionsTaskId;
  }
  export interface CancelAuditMitigationActionsTaskResponse {
  }
  export interface CancelAuditTaskRequest {
    /**
     * The ID of the audit you want to cancel. You can only cancel an audit that is "IN_PROGRESS".
     */
    taskId: AuditTaskId;
  }
  export interface CancelAuditTaskResponse {
  }
  export interface CancelCertificateTransferRequest {
    /**
     * The ID of the certificate. (The last part of the certificate ARN contains the certificate ID.)
     */
    certificateId: CertificateId;
  }
  export interface CancelDetectMitigationActionsTaskRequest {
    /**
     *  The unique identifier of the task. 
     */
    taskId: MitigationActionsTaskId;
  }
  export interface CancelDetectMitigationActionsTaskResponse {
  }
  export interface CancelJobExecutionRequest {
    /**
     * The ID of the job to be canceled.
     */
    jobId: JobId;
    /**
     * The name of the thing whose execution of the job will be canceled.
     */
    thingName: ThingName;
    /**
     * (Optional) If true the job execution will be canceled if it has status IN_PROGRESS or QUEUED, otherwise the job execution will be canceled only if it has status QUEUED. If you attempt to cancel a job execution that is IN_PROGRESS, and you do not set force to true, then an InvalidStateTransitionException will be thrown. The default is false. Canceling a job execution which is "IN_PROGRESS", will cause the device to be unable to update the job execution status. Use caution and ensure that the device is able to recover to a valid state.
     */
    force?: ForceFlag;
    /**
     * (Optional) The expected current version of the job execution. Each time you update the job execution, its version is incremented. If the version of the job execution stored in Jobs does not match, the update is rejected with a VersionMismatch error, and an ErrorResponse that contains the current job execution status data is returned. (This makes it unnecessary to perform a separate DescribeJobExecution request in order to obtain the job execution status data.)
     */
    expectedVersion?: ExpectedVersion;
    /**
     * A collection of name/value pairs that describe the status of the job execution. If not specified, the statusDetails are unchanged. You can specify at most 10 name/value pairs.
     */
    statusDetails?: DetailsMap;
  }
  export interface CancelJobRequest {
    /**
     * The unique identifier you assigned to this job when it was created.
     */
    jobId: JobId;
    /**
     * (Optional)A reason code string that explains why the job was canceled.
     */
    reasonCode?: ReasonCode;
    /**
     * An optional comment string describing why the job was canceled.
     */
    comment?: Comment;
    /**
     * (Optional) If true job executions with status "IN_PROGRESS" and "QUEUED" are canceled, otherwise only job executions with status "QUEUED" are canceled. The default is false. Canceling a job which is "IN_PROGRESS", will cause a device which is executing the job to be unable to update the job execution status. Use caution and ensure that each device executing a job which is canceled is able to recover to a valid state.
     */
    force?: ForceFlag;
  }
  export interface CancelJobResponse {
    /**
     * The job ARN.
     */
    jobArn?: JobArn;
    /**
     * The unique identifier you assigned to this job when it was created.
     */
    jobId?: JobId;
    /**
     * A short text description of the job.
     */
    description?: JobDescription;
  }
  export type CanceledChecksCount = number;
  export type CanceledFindingsCount = number;
  export type CanceledThings = number;
  export type CannedAccessControlList = "private"|"public-read"|"public-read-write"|"aws-exec-read"|"authenticated-read"|"bucket-owner-read"|"bucket-owner-full-control"|"log-delivery-write"|string;
  export interface Certificate {
    /**
     * The ARN of the certificate.
     */
    certificateArn?: CertificateArn;
    /**
     * The ID of the certificate. (The last part of the certificate ARN contains the certificate ID.)
     */
    certificateId?: CertificateId;
    /**
     * The status of the certificate. The status value REGISTER_INACTIVE is deprecated and should not be used.
     */
    status?: CertificateStatus;
    /**
     * The mode of the certificate.  DEFAULT: A certificate in DEFAULT mode is either generated by Amazon Web Services IoT Core or registered with an issuer certificate authority (CA) in DEFAULT mode. Devices with certificates in DEFAULT mode aren't required to send the Server Name Indication (SNI) extension when connecting to Amazon Web Services IoT Core. However, to use features such as custom domains and VPC endpoints, we recommend that you use the SNI extension when connecting to Amazon Web Services IoT Core.  SNI_ONLY: A certificate in SNI_ONLY mode is registered without an issuer CA. Devices with certificates in SNI_ONLY mode must send the SNI extension when connecting to Amazon Web Services IoT Core. 
     */
    certificateMode?: CertificateMode;
    /**
     * The date and time the certificate was created.
     */
    creationDate?: DateType;
  }
  export type CertificateArn = string;
  export interface CertificateDescription {
    /**
     * The ARN of the certificate.
     */
    certificateArn?: CertificateArn;
    /**
     * The ID of the certificate.
     */
    certificateId?: CertificateId;
    /**
     * The certificate ID of the CA certificate used to sign this certificate.
     */
    caCertificateId?: CertificateId;
    /**
     * The status of the certificate.
     */
    status?: CertificateStatus;
    /**
     * The certificate data, in PEM format.
     */
    certificatePem?: CertificatePem;
    /**
     * The ID of the Amazon Web Services account that owns the certificate.
     */
    ownedBy?: AwsAccountId;
    /**
     * The ID of the Amazon Web Services account of the previous owner of the certificate.
     */
    previousOwnedBy?: AwsAccountId;
    /**
     * The date and time the certificate was created.
     */
    creationDate?: DateType;
    /**
     * The date and time the certificate was last modified.
     */
    lastModifiedDate?: DateType;
    /**
     * The customer version of the certificate.
     */
    customerVersion?: CustomerVersion;
    /**
     * The transfer data.
     */
    transferData?: TransferData;
    /**
     * The generation ID of the certificate.
     */
    generationId?: GenerationId;
    /**
     * When the certificate is valid.
     */
    validity?: CertificateValidity;
    /**
     * The mode of the certificate.  DEFAULT: A certificate in DEFAULT mode is either generated by Amazon Web Services IoT Core or registered with an issuer certificate authority (CA) in DEFAULT mode. Devices with certificates in DEFAULT mode aren't required to send the Server Name Indication (SNI) extension when connecting to Amazon Web Services IoT Core. However, to use features such as custom domains and VPC endpoints, we recommend that you use the SNI extension when connecting to Amazon Web Services IoT Core.  SNI_ONLY: A certificate in SNI_ONLY mode is registered without an issuer CA. Devices with certificates in SNI_ONLY mode must send the SNI extension when connecting to Amazon Web Services IoT Core.  For more information about the value for SNI extension, see Transport security in IoT.
     */
    certificateMode?: CertificateMode;
  }
  export type CertificateId = string;
  export type CertificateMode = "DEFAULT"|"SNI_ONLY"|string;
  export type CertificateName = string;
  export type CertificatePathOnDevice = string;
  export type CertificatePem = string;
  export type CertificateSigningRequest = string;
  export type CertificateStatus = "ACTIVE"|"INACTIVE"|"REVOKED"|"PENDING_TRANSFER"|"REGISTER_INACTIVE"|"PENDING_ACTIVATION"|string;
  export interface CertificateValidity {
    /**
     * The certificate is not valid before this date.
     */
    notBefore?: DateType;
    /**
     * The certificate is not valid after this date.
     */
    notAfter?: DateType;
  }
  export type Certificates = Certificate[];
  export type ChannelName = string;
  export type CheckCompliant = boolean;
  export type Cidr = string;
  export type Cidrs = Cidr[];
  export interface ClearDefaultAuthorizerRequest {
  }
  export interface ClearDefaultAuthorizerResponse {
  }
  export type ClientId = string;
  export type ClientProperties = {[key: string]: String};
  export type ClientRequestToken = string;
  export type ClientToken = string;
  export interface CloudwatchAlarmAction {
    /**
     * The IAM role that allows access to the CloudWatch alarm.
     */
    roleArn: AwsArn;
    /**
     * The CloudWatch alarm name.
     */
    alarmName: AlarmName;
    /**
     * The reason for the alarm change.
     */
    stateReason: StateReason;
    /**
     * The value of the alarm state. Acceptable values are: OK, ALARM, INSUFFICIENT_DATA.
     */
    stateValue: StateValue;
  }
  export interface CloudwatchLogsAction {
    /**
     * The IAM role that allows access to the CloudWatch log.
     */
    roleArn: AwsArn;
    /**
     * The CloudWatch log group to which the action sends data.
     */
    logGroupName: LogGroupName;
    /**
     * Indicates whether batches of log records will be extracted and uploaded into CloudWatch. Values include true or false (default).
     */
    batchMode?: BatchMode;
  }
  export interface CloudwatchMetricAction {
    /**
     * The IAM role that allows access to the CloudWatch metric.
     */
    roleArn: AwsArn;
    /**
     * The CloudWatch metric namespace name.
     */
    metricNamespace: String;
    /**
     * The CloudWatch metric name.
     */
    metricName: String;
    /**
     * The CloudWatch metric value.
     */
    metricValue: String;
    /**
     * The metric unit supported by CloudWatch.
     */
    metricUnit: String;
    /**
     * An optional Unix timestamp.
     */
    metricTimestamp?: String;
  }
  export type Code = string;
  export interface CodeSigning {
    /**
     * The ID of the AWSSignerJob which was created to sign the file.
     */
    awsSignerJobId?: SigningJobId;
    /**
     * Describes the code-signing job.
     */
    startSigningJobParameter?: StartSigningJobParameter;
    /**
     * A custom method for code signing a file.
     */
    customCodeSigning?: CustomCodeSigning;
  }
  export interface CodeSigningCertificateChain {
    /**
     * The name of the certificate.
     */
    certificateName?: CertificateName;
    /**
     * A base64 encoded binary representation of the code signing certificate chain.
     */
    inlineDocument?: InlineDocument;
  }
  export interface CodeSigningSignature {
    /**
     * A base64 encoded binary representation of the code signing signature.
     */
    inlineDocument?: Signature;
  }
  export type CognitoIdentityPoolId = string;
  export type Comment = string;
  export type ComparisonOperator = "less-than"|"less-than-equals"|"greater-than"|"greater-than-equals"|"in-cidr-set"|"not-in-cidr-set"|"in-port-set"|"not-in-port-set"|"in-set"|"not-in-set"|string;
  export type CompliantChecksCount = number;
  export type ConfidenceLevel = "LOW"|"MEDIUM"|"HIGH"|string;
  export interface Configuration {
    /**
     * True to enable the configuration.
     */
    Enabled?: Enabled;
  }
  export interface ConfirmTopicRuleDestinationRequest {
    /**
     * The token used to confirm ownership or access to the topic rule confirmation URL.
     */
    confirmationToken: ConfirmationToken;
  }
  export interface ConfirmTopicRuleDestinationResponse {
  }
  export type ConfirmationToken = string;
  export type ConnectivityTimestamp = number;
  export type ConsecutiveDatapointsToAlarm = number;
  export type ConsecutiveDatapointsToClear = number;
  export type ContentType = string;
  export type CorrelationData = string;
  export type Count = number;
  export interface CreateAuditSuppressionRequest {
    checkName: AuditCheckName;
    resourceIdentifier: ResourceIdentifier;
    /**
     *  The epoch timestamp in seconds at which this suppression expires. 
     */
    expirationDate?: Timestamp;
    /**
     *  Indicates whether a suppression should exist indefinitely or not. 
     */
    suppressIndefinitely?: SuppressIndefinitely;
    /**
     *  The description of the audit suppression. 
     */
    description?: AuditDescription;
    /**
     *  Each audit supression must have a unique client request token. If you try to create a new audit suppression with the same token as one that already exists, an exception occurs. If you omit this value, Amazon Web Services SDKs will automatically generate a unique client request.
     */
    clientRequestToken: ClientRequestToken;
  }
  export interface CreateAuditSuppressionResponse {
  }
  export interface CreateAuthorizerRequest {
    /**
     * The authorizer name.
     */
    authorizerName: AuthorizerName;
    /**
     * The ARN of the authorizer's Lambda function.
     */
    authorizerFunctionArn: AuthorizerFunctionArn;
    /**
     * The name of the token key used to extract the token from the HTTP headers.
     */
    tokenKeyName?: TokenKeyName;
    /**
     * The public keys used to verify the digital signature returned by your custom authentication service.
     */
    tokenSigningPublicKeys?: PublicKeyMap;
    /**
     * The status of the create authorizer request.
     */
    status?: AuthorizerStatus;
    /**
     * Metadata which can be used to manage the custom authorizer.  For URI Request parameters use format: ...key1=value1&amp;key2=value2... For the CLI command-line parameter use format: &amp;&amp;tags "key1=value1&amp;key2=value2..." For the cli-input-json file use format: "tags": "key1=value1&amp;key2=value2..." 
     */
    tags?: TagList;
    /**
     * Specifies whether IoT validates the token signature in an authorization request.
     */
    signingDisabled?: BooleanKey;
    /**
     * When true, the result from the authorizer’s Lambda function is cached for clients that use persistent HTTP connections. The results are cached for the time specified by the Lambda function in refreshAfterInSeconds. This value does not affect authorization of clients that use MQTT connections. The default value is false.
     */
    enableCachingForHttp?: EnableCachingForHttp;
  }
  export interface CreateAuthorizerResponse {
    /**
     * The authorizer's name.
     */
    authorizerName?: AuthorizerName;
    /**
     * The authorizer ARN.
     */
    authorizerArn?: AuthorizerArn;
  }
  export interface CreateBillingGroupRequest {
    /**
     * The name you wish to give to the billing group.
     */
    billingGroupName: BillingGroupName;
    /**
     * The properties of the billing group.
     */
    billingGroupProperties?: BillingGroupProperties;
    /**
     * Metadata which can be used to manage the billing group.
     */
    tags?: TagList;
  }
  export interface CreateBillingGroupResponse {
    /**
     * The name you gave to the billing group.
     */
    billingGroupName?: BillingGroupName;
    /**
     * The ARN of the billing group.
     */
    billingGroupArn?: BillingGroupArn;
    /**
     * The ID of the billing group.
     */
    billingGroupId?: BillingGroupId;
  }
  export interface CreateCertificateFromCsrRequest {
    /**
     * The certificate signing request (CSR).
     */
    certificateSigningRequest: CertificateSigningRequest;
    /**
     * Specifies whether the certificate is active.
     */
    setAsActive?: SetAsActive;
  }
  export interface CreateCertificateFromCsrResponse {
    /**
     * The Amazon Resource Name (ARN) of the certificate. You can use the ARN as a principal for policy operations.
     */
    certificateArn?: CertificateArn;
    /**
     * The ID of the certificate. Certificate management operations only take a certificateId.
     */
    certificateId?: CertificateId;
    /**
     * The certificate data, in PEM format.
     */
    certificatePem?: CertificatePem;
  }
  export interface CreateCustomMetricRequest {
    /**
     *  The name of the custom metric. This will be used in the metric report submitted from the device/thing. The name can't begin with aws:. You can't change the name after you define it.
     */
    metricName: MetricName;
    /**
     *  The friendly name in the console for the custom metric. This name doesn't have to be unique. Don't use this name as the metric identifier in the device metric report. You can update the friendly name after you define it.
     */
    displayName?: CustomMetricDisplayName;
    /**
     *  The type of the custom metric.   The type number only takes a single metric value as an input, but when you submit the metrics value in the DeviceMetrics report, you must pass it as an array with a single value. 
     */
    metricType: CustomMetricType;
    /**
     *  Metadata that can be used to manage the custom metric. 
     */
    tags?: TagList;
    /**
     * Each custom metric must have a unique client request token. If you try to create a new custom metric that already exists with a different token, an exception occurs. If you omit this value, Amazon Web Services SDKs will automatically generate a unique client request. 
     */
    clientRequestToken: ClientRequestToken;
  }
  export interface CreateCustomMetricResponse {
    /**
     *  The name of the custom metric to be used in the metric report. 
     */
    metricName?: MetricName;
    /**
     *  The Amazon Resource Number (ARN) of the custom metric. For example, arn:aws-partition:iot:region:accountId:custommetric/metricName  
     */
    metricArn?: CustomMetricArn;
  }
  export interface CreateDimensionRequest {
    /**
     * A unique identifier for the dimension. Choose something that describes the type and value to make it easy to remember what it does.
     */
    name: DimensionName;
    /**
     * Specifies the type of dimension. Supported types: TOPIC_FILTER. 
     */
    type: DimensionType;
    /**
     * Specifies the value or list of values for the dimension. For TOPIC_FILTER dimensions, this is a pattern used to match the MQTT topic (for example, "admin/#").
     */
    stringValues: DimensionStringValues;
    /**
     * Metadata that can be used to manage the dimension.
     */
    tags?: TagList;
    /**
     * Each dimension must have a unique client request token. If you try to create a new dimension with the same token as a dimension that already exists, an exception occurs. If you omit this value, Amazon Web Services SDKs will automatically generate a unique client request.
     */
    clientRequestToken: ClientRequestToken;
  }
  export interface CreateDimensionResponse {
    /**
     * A unique identifier for the dimension.
     */
    name?: DimensionName;
    /**
     * The Amazon Resource Name (ARN) of the created dimension.
     */
    arn?: DimensionArn;
  }
  export interface CreateDomainConfigurationRequest {
    /**
     * The name of the domain configuration. This value must be unique to a region.
     */
    domainConfigurationName: DomainConfigurationName;
    /**
     * The name of the domain.
     */
    domainName?: DomainName;
    /**
     * The ARNs of the certificates that IoT passes to the device during the TLS handshake. Currently you can specify only one certificate ARN. This value is not required for Amazon Web Services-managed domains.
     */
    serverCertificateArns?: ServerCertificateArns;
    /**
     * The certificate used to validate the server certificate and prove domain name ownership. This certificate must be signed by a public certificate authority. This value is not required for Amazon Web Services-managed domains.
     */
    validationCertificateArn?: AcmCertificateArn;
    /**
     * An object that specifies the authorization service for a domain.
     */
    authorizerConfig?: AuthorizerConfig;
    /**
     * The type of service delivered by the endpoint.  Amazon Web Services IoT Core currently supports only the DATA service type. 
     */
    serviceType?: ServiceType;
    /**
     * Metadata which can be used to manage the domain configuration.  For URI Request parameters use format: ...key1=value1&amp;key2=value2... For the CLI command-line parameter use format: &amp;&amp;tags "key1=value1&amp;key2=value2..." For the cli-input-json file use format: "tags": "key1=value1&amp;key2=value2..." 
     */
    tags?: TagList;
    /**
     * An object that specifies the TLS configuration for a domain.
     */
    tlsConfig?: TlsConfig;
  }
  export interface CreateDomainConfigurationResponse {
    /**
     * The name of the domain configuration.
     */
    domainConfigurationName?: DomainConfigurationName;
    /**
     * The ARN of the domain configuration.
     */
    domainConfigurationArn?: DomainConfigurationArn;
  }
  export interface CreateDynamicThingGroupRequest {
    /**
     * The dynamic thing group name to create.
     */
    thingGroupName: ThingGroupName;
    /**
     * The dynamic thing group properties.
     */
    thingGroupProperties?: ThingGroupProperties;
    /**
     * The dynamic thing group index name.  Currently one index is supported: AWS_Things. 
     */
    indexName?: IndexName;
    /**
     * The dynamic thing group search query string. See Query Syntax for information about query string syntax.
     */
    queryString: QueryString;
    /**
     * The dynamic thing group query version.  Currently one query version is supported: "2017-09-30". If not specified, the query version defaults to this value. 
     */
    queryVersion?: QueryVersion;
    /**
     * Metadata which can be used to manage the dynamic thing group.
     */
    tags?: TagList;
  }
  export interface CreateDynamicThingGroupResponse {
    /**
     * The dynamic thing group name.
     */
    thingGroupName?: ThingGroupName;
    /**
     * The dynamic thing group ARN.
     */
    thingGroupArn?: ThingGroupArn;
    /**
     * The dynamic thing group ID.
     */
    thingGroupId?: ThingGroupId;
    /**
     * The dynamic thing group index name.
     */
    indexName?: IndexName;
    /**
     * The dynamic thing group search query string.
     */
    queryString?: QueryString;
    /**
     * The dynamic thing group query version.
     */
    queryVersion?: QueryVersion;
  }
  export interface CreateFleetMetricRequest {
    /**
     * The name of the fleet metric to create.
     */
    metricName: FleetMetricName;
    /**
     * The search query string.
     */
    queryString: QueryString;
    /**
     * The type of the aggregation query.
     */
    aggregationType: AggregationType;
    /**
     * The time in seconds between fleet metric emissions. Range [60(1 min), 86400(1 day)] and must be multiple of 60.
     */
    period: FleetMetricPeriod;
    /**
     * The field to aggregate.
     */
    aggregationField: AggregationField;
    /**
     * The fleet metric description.
     */
    description?: FleetMetricDescription;
    /**
     * The query version.
     */
    queryVersion?: QueryVersion;
    /**
     * The name of the index to search.
     */
    indexName?: IndexName;
    /**
     * Used to support unit transformation such as milliseconds to seconds. The unit must be supported by CW metric. Default to null.
     */
    unit?: FleetMetricUnit;
    /**
     * Metadata, which can be used to manage the fleet metric.
     */
    tags?: TagList;
  }
  export interface CreateFleetMetricResponse {
    /**
     * The name of the fleet metric to create.
     */
    metricName?: FleetMetricName;
    /**
     * The Amazon Resource Name (ARN) of the new fleet metric.
     */
    metricArn?: FleetMetricArn;
  }
  export interface CreateJobRequest {
    /**
     * A job identifier which must be unique for your Amazon Web Services account. We recommend using a UUID. Alpha-numeric characters, "-" and "_" are valid for use here.
     */
    jobId: JobId;
    /**
     * A list of things and thing groups to which the job should be sent.
     */
    targets: JobTargets;
    /**
     * An S3 link, or S3 object URL, to the job document. The link is an Amazon S3 object URL and is required if you don't specify a value for document. For example, --document-source https://s3.region-code.amazonaws.com/example-firmware/device-firmware.1.0  For more information, see Methods for accessing a bucket.
     */
    documentSource?: JobDocumentSource;
    /**
     * The job document. Required if you don't specify a value for documentSource.
     */
    document?: JobDocument;
    /**
     * A short text description of the job.
     */
    description?: JobDescription;
    /**
     * Configuration information for pre-signed S3 URLs.
     */
    presignedUrlConfig?: PresignedUrlConfig;
    /**
     * Specifies whether the job will continue to run (CONTINUOUS), or will be complete after all those things specified as targets have completed the job (SNAPSHOT). If continuous, the job may also be run on a thing when a change is detected in a target. For example, a job will run on a thing when the thing is added to a target group, even after the job was completed by all things originally in the group.  We recommend that you use continuous jobs instead of snapshot jobs for dynamic thing group targets. By using continuous jobs, devices that join the group receive the job execution even after the job has been created. 
     */
    targetSelection?: TargetSelection;
    /**
     * Allows you to create a staged rollout of the job.
     */
    jobExecutionsRolloutConfig?: JobExecutionsRolloutConfig;
    /**
     * Allows you to create the criteria to abort a job.
     */
    abortConfig?: AbortConfig;
    /**
     * Specifies the amount of time each device has to finish its execution of the job. The timer is started when the job execution status is set to IN_PROGRESS. If the job execution status is not set to another terminal state before the time expires, it will be automatically set to TIMED_OUT.
     */
    timeoutConfig?: TimeoutConfig;
    /**
     * Metadata which can be used to manage the job.
     */
    tags?: TagList;
    /**
     * The namespace used to indicate that a job is a customer-managed job. When you specify a value for this parameter, Amazon Web Services IoT Core sends jobs notifications to MQTT topics that contain the value in the following format.  $aws/things/THING_NAME/jobs/JOB_ID/notify-namespace-NAMESPACE_ID/   The namespaceId feature is in public preview. 
     */
    namespaceId?: NamespaceId;
    /**
     * The ARN of the job template used to create the job.
     */
    jobTemplateArn?: JobTemplateArn;
    /**
     * Allows you to create the criteria to retry a job.
     */
    jobExecutionsRetryConfig?: JobExecutionsRetryConfig;
    /**
     * Parameters of an Amazon Web Services managed template that you can specify to create the job document.   documentParameters can only be used when creating jobs from Amazon Web Services managed templates. This parameter can't be used with custom job templates or to create jobs from them. 
     */
    documentParameters?: ParameterMap;
    /**
     * The configuration that allows you to schedule a job for a future date and time in addition to specifying the end behavior for each job execution.
     */
    schedulingConfig?: SchedulingConfig;
    /**
     * The package version Amazon Resource Names (ARNs) that are installed on the device when the job successfully completes.   Note:The following Length Constraints relates to a single string. Up to five strings are allowed.
     */
    destinationPackageVersions?: DestinationPackageVersions;
  }
  export interface CreateJobResponse {
    /**
     * The job ARN.
     */
    jobArn?: JobArn;
    /**
     * The unique identifier you assigned to this job.
     */
    jobId?: JobId;
    /**
     * The job description.
     */
    description?: JobDescription;
  }
  export interface CreateJobTemplateRequest {
    /**
     * A unique identifier for the job template. We recommend using a UUID. Alpha-numeric characters, "-", and "_" are valid for use here.
     */
    jobTemplateId: JobTemplateId;
    /**
     * The ARN of the job to use as the basis for the job template.
     */
    jobArn?: JobArn;
    /**
     * An S3 link, or S3 object URL, to the job document. The link is an Amazon S3 object URL and is required if you don't specify a value for document. For example, --document-source https://s3.region-code.amazonaws.com/example-firmware/device-firmware.1.0  For more information, see Methods for accessing a bucket.
     */
    documentSource?: JobDocumentSource;
    /**
     * The job document. Required if you don't specify a value for documentSource.
     */
    document?: JobDocument;
    /**
     * A description of the job document.
     */
    description: JobDescription;
    presignedUrlConfig?: PresignedUrlConfig;
    jobExecutionsRolloutConfig?: JobExecutionsRolloutConfig;
    abortConfig?: AbortConfig;
    timeoutConfig?: TimeoutConfig;
    /**
     * Metadata that can be used to manage the job template.
     */
    tags?: TagList;
    /**
     * Allows you to create the criteria to retry a job.
     */
    jobExecutionsRetryConfig?: JobExecutionsRetryConfig;
    /**
     * Allows you to configure an optional maintenance window for the rollout of a job document to all devices in the target group for a job.
     */
    maintenanceWindows?: MaintenanceWindows;
    /**
     * The package version Amazon Resource Names (ARNs) that are installed on the device when the job successfully completes.   Note:The following Length Constraints relates to a single string. Up to five strings are allowed.
     */
    destinationPackageVersions?: DestinationPackageVersions;
  }
  export interface CreateJobTemplateResponse {
    /**
     * The ARN of the job template.
     */
    jobTemplateArn?: JobTemplateArn;
    /**
     * The unique identifier of the job template.
     */
    jobTemplateId?: JobTemplateId;
  }
  export interface CreateKeysAndCertificateRequest {
    /**
     * Specifies whether the certificate is active.
     */
    setAsActive?: SetAsActive;
  }
  export interface CreateKeysAndCertificateResponse {
    /**
     * The ARN of the certificate.
     */
    certificateArn?: CertificateArn;
    /**
     * The ID of the certificate. IoT issues a default subject name for the certificate (for example, IoT Certificate).
     */
    certificateId?: CertificateId;
    /**
     * The certificate data, in PEM format.
     */
    certificatePem?: CertificatePem;
    /**
     * The generated key pair.
     */
    keyPair?: KeyPair;
  }
  export interface CreateMitigationActionRequest {
    /**
     * A friendly name for the action. Choose a friendly name that accurately describes the action (for example, EnableLoggingAction).
     */
    actionName: MitigationActionName;
    /**
     * The ARN of the IAM role that is used to apply the mitigation action.
     */
    roleArn: RoleArn;
    /**
     * Defines the type of action and the parameters for that action.
     */
    actionParams: MitigationActionParams;
    /**
     * Metadata that can be used to manage the mitigation action.
     */
    tags?: TagList;
  }
  export interface CreateMitigationActionResponse {
    /**
     * The ARN for the new mitigation action.
     */
    actionArn?: MitigationActionArn;
    /**
     * A unique identifier for the new mitigation action.
     */
    actionId?: MitigationActionId;
  }
  export interface CreateOTAUpdateRequest {
    /**
     * The ID of the OTA update to be created.
     */
    otaUpdateId: OTAUpdateId;
    /**
     * The description of the OTA update.
     */
    description?: OTAUpdateDescription;
    /**
     * The devices targeted to receive OTA updates.
     */
    targets: Targets;
    /**
     * The protocol used to transfer the OTA update image. Valid values are [HTTP], [MQTT], [HTTP, MQTT]. When both HTTP and MQTT are specified, the target device can choose the protocol.
     */
    protocols?: Protocols;
    /**
     * Specifies whether the update will continue to run (CONTINUOUS), or will be complete after all the things specified as targets have completed the update (SNAPSHOT). If continuous, the update may also be run on a thing when a change is detected in a target. For example, an update will run on a thing when the thing is added to a target group, even after the update was completed by all things originally in the group. Valid values: CONTINUOUS | SNAPSHOT.
     */
    targetSelection?: TargetSelection;
    /**
     * Configuration for the rollout of OTA updates.
     */
    awsJobExecutionsRolloutConfig?: AwsJobExecutionsRolloutConfig;
    /**
     * Configuration information for pre-signed URLs.
     */
    awsJobPresignedUrlConfig?: AwsJobPresignedUrlConfig;
    /**
     * The criteria that determine when and how a job abort takes place.
     */
    awsJobAbortConfig?: AwsJobAbortConfig;
    /**
     * Specifies the amount of time each device has to finish its execution of the job. A timer is started when the job execution status is set to IN_PROGRESS. If the job execution status is not set to another terminal state before the timer expires, it will be automatically set to TIMED_OUT.
     */
    awsJobTimeoutConfig?: AwsJobTimeoutConfig;
    /**
     * The files to be streamed by the OTA update.
     */
    files: OTAUpdateFiles;
    /**
     * The IAM role that grants Amazon Web Services IoT Core access to the Amazon S3, IoT jobs and Amazon Web Services Code Signing resources to create an OTA update job.
     */
    roleArn: RoleArn;
    /**
     * A list of additional OTA update parameters, which are name-value pairs. They won't be sent to devices as a part of the Job document.
     */
    additionalParameters?: AdditionalParameterMap;
    /**
     * Metadata which can be used to manage updates.
     */
    tags?: TagList;
  }
  export interface CreateOTAUpdateResponse {
    /**
     * The OTA update ID.
     */
    otaUpdateId?: OTAUpdateId;
    /**
     * The IoT job ID associated with the OTA update.
     */
    awsIotJobId?: AwsIotJobId;
    /**
     * The OTA update ARN.
     */
    otaUpdateArn?: OTAUpdateArn;
    /**
     * The IoT job ARN associated with the OTA update.
     */
    awsIotJobArn?: AwsIotJobArn;
    /**
     * The OTA update status.
     */
    otaUpdateStatus?: OTAUpdateStatus;
  }
  export interface CreatePackageRequest {
    /**
     * The name of the new software package.
     */
    packageName: PackageName;
    /**
     * A summary of the package being created. This can be used to outline the package's contents or purpose.
     */
    description?: ResourceDescription;
    /**
     * Metadata that can be used to manage the package.
     */
    tags?: TagMap;
    /**
     * A unique case-sensitive identifier that you can provide to ensure the idempotency of the request. Don't reuse this client token if a new idempotent request is required.
     */
    clientToken?: ClientToken;
  }
  export interface CreatePackageResponse {
    /**
     * The name of the software package.
     */
    packageName?: PackageName;
    /**
     * The Amazon Resource Name (ARN) for the package.
     */
    packageArn?: PackageArn;
    /**
     * The package description.
     */
    description?: ResourceDescription;
  }
  export interface CreatePackageVersionRequest {
    /**
     * The name of the associated software package.
     */
    packageName: PackageName;
    /**
     * The name of the new package version.
     */
    versionName: VersionName;
    /**
     * A summary of the package version being created. This can be used to outline the package's contents or purpose.
     */
    description?: ResourceDescription;
    /**
     * Metadata that can be used to define a package version’s configuration. For example, the S3 file location, configuration options that are being sent to the device or fleet. The combined size of all the attributes on a package version is limited to 3KB.
     */
    attributes?: ResourceAttributes;
    /**
     * Metadata that can be used to manage the package version.
     */
    tags?: TagMap;
    /**
     * A unique case-sensitive identifier that you can provide to ensure the idempotency of the request. Don't reuse this client token if a new idempotent request is required.
     */
    clientToken?: ClientToken;
  }
  export interface CreatePackageVersionResponse {
    /**
     * The Amazon Resource Name (ARN) for the package.
     */
    packageVersionArn?: PackageVersionArn;
    /**
     * The name of the associated software package.
     */
    packageName?: PackageName;
    /**
     * The name of the new package version.
     */
    versionName?: VersionName;
    /**
     * The package version description.
     */
    description?: ResourceDescription;
    /**
     * Metadata that were added to the package version that can be used to define a package version’s configuration.
     */
    attributes?: ResourceAttributes;
    /**
     * The status of the package version. For more information, see Package version lifecycle.
     */
    status?: PackageVersionStatus;
    /**
     * Error reason for a package version failure during creation or update.
     */
    errorReason?: PackageVersionErrorReason;
  }
  export interface CreatePolicyRequest {
    /**
     * The policy name.
     */
    policyName: PolicyName;
    /**
     * The JSON document that describes the policy. policyDocument must have a minimum length of 1, with a maximum length of 2048, excluding whitespace.
     */
    policyDocument: PolicyDocument;
    /**
     * Metadata which can be used to manage the policy.  For URI Request parameters use format: ...key1=value1&amp;key2=value2... For the CLI command-line parameter use format: &amp;&amp;tags "key1=value1&amp;key2=value2..." For the cli-input-json file use format: "tags": "key1=value1&amp;key2=value2..." 
     */
    tags?: TagList;
  }
  export interface CreatePolicyResponse {
    /**
     * The policy name.
     */
    policyName?: PolicyName;
    /**
     * The policy ARN.
     */
    policyArn?: PolicyArn;
    /**
     * The JSON document that describes the policy.
     */
    policyDocument?: PolicyDocument;
    /**
     * The policy version ID.
     */
    policyVersionId?: PolicyVersionId;
  }
  export interface CreatePolicyVersionRequest {
    /**
     * The policy name.
     */
    policyName: PolicyName;
    /**
     * The JSON document that describes the policy. Minimum length of 1. Maximum length of 2048, excluding whitespace.
     */
    policyDocument: PolicyDocument;
    /**
     * Specifies whether the policy version is set as the default. When this parameter is true, the new policy version becomes the operative version (that is, the version that is in effect for the certificates to which the policy is attached).
     */
    setAsDefault?: SetAsDefault;
  }
  export interface CreatePolicyVersionResponse {
    /**
     * The policy ARN.
     */
    policyArn?: PolicyArn;
    /**
     * The JSON document that describes the policy.
     */
    policyDocument?: PolicyDocument;
    /**
     * The policy version ID.
     */
    policyVersionId?: PolicyVersionId;
    /**
     * Specifies whether the policy version is the default.
     */
    isDefaultVersion?: IsDefaultVersion;
  }
  export interface CreateProvisioningClaimRequest {
    /**
     * The name of the provisioning template to use.
     */
    templateName: TemplateName;
  }
  export interface CreateProvisioningClaimResponse {
    /**
     * The ID of the certificate.
     */
    certificateId?: CertificateId;
    /**
     * The provisioning claim certificate.
     */
    certificatePem?: CertificatePem;
    /**
     * The provisioning claim key pair.
     */
    keyPair?: KeyPair;
    /**
     * The provisioning claim expiration time.
     */
    expiration?: DateType;
  }
  export interface CreateProvisioningTemplateRequest {
    /**
     * The name of the provisioning template.
     */
    templateName: TemplateName;
    /**
     * The description of the provisioning template.
     */
    description?: TemplateDescription;
    /**
     * The JSON formatted contents of the provisioning template.
     */
    templateBody: TemplateBody;
    /**
     * True to enable the provisioning template, otherwise false.
     */
    enabled?: Enabled;
    /**
     * The role ARN for the role associated with the provisioning template. This IoT role grants permission to provision a device.
     */
    provisioningRoleArn: RoleArn;
    /**
     * Creates a pre-provisioning hook template. Only supports template of type FLEET_PROVISIONING. For more information about provisioning template types, see type.
     */
    preProvisioningHook?: ProvisioningHook;
    /**
     * Metadata which can be used to manage the provisioning template.  For URI Request parameters use format: ...key1=value1&amp;key2=value2... For the CLI command-line parameter use format: &amp;&amp;tags "key1=value1&amp;key2=value2..." For the cli-input-json file use format: "tags": "key1=value1&amp;key2=value2..." 
     */
    tags?: TagList;
    /**
     * The type you define in a provisioning template. You can create a template with only one type. You can't change the template type after its creation. The default value is FLEET_PROVISIONING. For more information about provisioning template, see: Provisioning template. 
     */
    type?: TemplateType;
  }
  export interface CreateProvisioningTemplateResponse {
    /**
     * The ARN that identifies the provisioning template.
     */
    templateArn?: TemplateArn;
    /**
     * The name of the provisioning template.
     */
    templateName?: TemplateName;
    /**
     * The default version of the provisioning template.
     */
    defaultVersionId?: TemplateVersionId;
  }
  export interface CreateProvisioningTemplateVersionRequest {
    /**
     * The name of the provisioning template.
     */
    templateName: TemplateName;
    /**
     * The JSON formatted contents of the provisioning template.
     */
    templateBody: TemplateBody;
    /**
     * Sets a fleet provision template version as the default version.
     */
    setAsDefault?: SetAsDefault;
  }
  export interface CreateProvisioningTemplateVersionResponse {
    /**
     * The ARN that identifies the provisioning template.
     */
    templateArn?: TemplateArn;
    /**
     * The name of the provisioning template.
     */
    templateName?: TemplateName;
    /**
     * The version of the provisioning template.
     */
    versionId?: TemplateVersionId;
    /**
     * True if the provisioning template version is the default version, otherwise false.
     */
    isDefaultVersion?: IsDefaultVersion;
  }
  export interface CreateRoleAliasRequest {
    /**
     * The role alias that points to a role ARN. This allows you to change the role without having to update the device.
     */
    roleAlias: RoleAlias;
    /**
     * The role ARN.
     */
    roleArn: RoleArn;
    /**
     * How long (in seconds) the credentials will be valid. The default value is 3,600 seconds. This value must be less than or equal to the maximum session duration of the IAM role that the role alias references.
     */
    credentialDurationSeconds?: CredentialDurationSeconds;
    /**
     * Metadata which can be used to manage the role alias.  For URI Request parameters use format: ...key1=value1&amp;key2=value2... For the CLI command-line parameter use format: &amp;&amp;tags "key1=value1&amp;key2=value2..." For the cli-input-json file use format: "tags": "key1=value1&amp;key2=value2..." 
     */
    tags?: TagList;
  }
  export interface CreateRoleAliasResponse {
    /**
     * The role alias.
     */
    roleAlias?: RoleAlias;
    /**
     * The role alias ARN.
     */
    roleAliasArn?: RoleAliasArn;
  }
  export interface CreateScheduledAuditRequest {
    /**
     * How often the scheduled audit takes place, either DAILY, WEEKLY, BIWEEKLY or MONTHLY. The start time of each audit is determined by the system.
     */
    frequency: AuditFrequency;
    /**
     * The day of the month on which the scheduled audit takes place. This can be "1" through "31" or "LAST". This field is required if the "frequency" parameter is set to MONTHLY. If days 29 to 31 are specified, and the month doesn't have that many days, the audit takes place on the LAST day of the month.
     */
    dayOfMonth?: DayOfMonth;
    /**
     * The day of the week on which the scheduled audit takes place, either SUN, MON, TUE, WED, THU, FRI, or SAT. This field is required if the frequency parameter is set to WEEKLY or BIWEEKLY.
     */
    dayOfWeek?: DayOfWeek;
    /**
     * Which checks are performed during the scheduled audit. Checks must be enabled for your account. (Use DescribeAccountAuditConfiguration to see the list of all checks, including those that are enabled or use UpdateAccountAuditConfiguration to select which checks are enabled.)
     */
    targetCheckNames: TargetAuditCheckNames;
    /**
     * The name you want to give to the scheduled audit. (Max. 128 chars)
     */
    scheduledAuditName: ScheduledAuditName;
    /**
     * Metadata that can be used to manage the scheduled audit.
     */
    tags?: TagList;
  }
  export interface CreateScheduledAuditResponse {
    /**
     * The ARN of the scheduled audit.
     */
    scheduledAuditArn?: ScheduledAuditArn;
  }
  export interface CreateSecurityProfileRequest {
    /**
     * The name you are giving to the security profile.
     */
    securityProfileName: SecurityProfileName;
    /**
     * A description of the security profile.
     */
    securityProfileDescription?: SecurityProfileDescription;
    /**
     * Specifies the behaviors that, when violated by a device (thing), cause an alert.
     */
    behaviors?: Behaviors;
    /**
     * Specifies the destinations to which alerts are sent. (Alerts are always sent to the console.) Alerts are generated when a device (thing) violates a behavior.
     */
    alertTargets?: AlertTargets;
    /**
     *  Please use CreateSecurityProfileRequest$additionalMetricsToRetainV2 instead.  A list of metrics whose data is retained (stored). By default, data is retained for any metric used in the profile's behaviors, but it is also retained for any metric specified here. Can be used with custom metrics; cannot be used with dimensions.
     */
    additionalMetricsToRetain?: AdditionalMetricsToRetainList;
    /**
     * A list of metrics whose data is retained (stored). By default, data is retained for any metric used in the profile's behaviors, but it is also retained for any metric specified here. Can be used with custom metrics; cannot be used with dimensions.
     */
    additionalMetricsToRetainV2?: AdditionalMetricsToRetainV2List;
    /**
     * Metadata that can be used to manage the security profile.
     */
    tags?: TagList;
  }
  export interface CreateSecurityProfileResponse {
    /**
     * The name you gave to the security profile.
     */
    securityProfileName?: SecurityProfileName;
    /**
     * The ARN of the security profile.
     */
    securityProfileArn?: SecurityProfileArn;
  }
  export interface CreateStreamRequest {
    /**
     * The stream ID.
     */
    streamId: StreamId;
    /**
     * A description of the stream.
     */
    description?: StreamDescription;
    /**
     * The files to stream.
     */
    files: StreamFiles;
    /**
     * An IAM role that allows the IoT service principal to access your S3 files.
     */
    roleArn: RoleArn;
    /**
     * Metadata which can be used to manage streams.
     */
    tags?: TagList;
  }
  export interface CreateStreamResponse {
    /**
     * The stream ID.
     */
    streamId?: StreamId;
    /**
     * The stream ARN.
     */
    streamArn?: StreamArn;
    /**
     * A description of the stream.
     */
    description?: StreamDescription;
    /**
     * The version of the stream.
     */
    streamVersion?: StreamVersion;
  }
  export interface CreateThingGroupRequest {
    /**
     * The thing group name to create.
     */
    thingGroupName: ThingGroupName;
    /**
     * The name of the parent thing group.
     */
    parentGroupName?: ThingGroupName;
    /**
     * The thing group properties.
     */
    thingGroupProperties?: ThingGroupProperties;
    /**
     * Metadata which can be used to manage the thing group.
     */
    tags?: TagList;
  }
  export interface CreateThingGroupResponse {
    /**
     * The thing group name.
     */
    thingGroupName?: ThingGroupName;
    /**
     * The thing group ARN.
     */
    thingGroupArn?: ThingGroupArn;
    /**
     * The thing group ID.
     */
    thingGroupId?: ThingGroupId;
  }
  export interface CreateThingRequest {
    /**
     * The name of the thing to create. You can't change a thing's name after you create it. To change a thing's name, you must create a new thing, give it the new name, and then delete the old thing.
     */
    thingName: ThingName;
    /**
     * The name of the thing type associated with the new thing.
     */
    thingTypeName?: ThingTypeName;
    /**
     * The attribute payload, which consists of up to three name/value pairs in a JSON document. For example:  {\"attributes\":{\"string1\":\"string2\"}} 
     */
    attributePayload?: AttributePayload;
    /**
     * The name of the billing group the thing will be added to.
     */
    billingGroupName?: BillingGroupName;
  }
  export interface CreateThingResponse {
    /**
     * The name of the new thing.
     */
    thingName?: ThingName;
    /**
     * The ARN of the new thing.
     */
    thingArn?: ThingArn;
    /**
     * The thing ID.
     */
    thingId?: ThingId;
  }
  export interface CreateThingTypeRequest {
    /**
     * The name of the thing type.
     */
    thingTypeName: ThingTypeName;
    /**
     * The ThingTypeProperties for the thing type to create. It contains information about the new thing type including a description, and a list of searchable thing attribute names.
     */
    thingTypeProperties?: ThingTypeProperties;
    /**
     * Metadata which can be used to manage the thing type.
     */
    tags?: TagList;
  }
  export interface CreateThingTypeResponse {
    /**
     * The name of the thing type.
     */
    thingTypeName?: ThingTypeName;
    /**
     * The Amazon Resource Name (ARN) of the thing type.
     */
    thingTypeArn?: ThingTypeArn;
    /**
     * The thing type ID.
     */
    thingTypeId?: ThingTypeId;
  }
  export interface CreateTopicRuleDestinationRequest {
    /**
     * The topic rule destination configuration.
     */
    destinationConfiguration: TopicRuleDestinationConfiguration;
  }
  export interface CreateTopicRuleDestinationResponse {
    /**
     * The topic rule destination.
     */
    topicRuleDestination?: TopicRuleDestination;
  }
  export interface CreateTopicRuleRequest {
    /**
     * The name of the rule.
     */
    ruleName: RuleName;
    /**
     * The rule payload.
     */
    topicRulePayload: TopicRulePayload;
    /**
     * Metadata which can be used to manage the topic rule.  For URI Request parameters use format: ...key1=value1&amp;key2=value2... For the CLI command-line parameter use format: --tags "key1=value1&amp;key2=value2..." For the cli-input-json file use format: "tags": "key1=value1&amp;key2=value2..." 
     */
    tags?: String;
  }
  export type CreatedAtDate = Date;
  export type CreationDate = Date;
  export type CredentialDurationSeconds = number;
  export type CronExpression = string;
  export interface CustomCodeSigning {
    /**
     * The signature for the file.
     */
    signature?: CodeSigningSignature;
    /**
     * The certificate chain.
     */
    certificateChain?: CodeSigningCertificateChain;
    /**
     * The hash algorithm used to code sign the file. You can use a string as the algorithm name if the target over-the-air (OTA) update devices are able to verify the signature that was generated using the same signature algorithm. For example, FreeRTOS uses SHA256 or SHA1, so you can pass either of them based on which was used for generating the signature.
     */
    hashAlgorithm?: HashAlgorithm;
    /**
     * The signature algorithm used to code sign the file. You can use a string as the algorithm name if the target over-the-air (OTA) update devices are able to verify the signature that was generated using the same signature algorithm. For example, FreeRTOS uses ECDSA or RSA, so you can pass either of them based on which was used for generating the signature.
     */
    signatureAlgorithm?: SignatureAlgorithm;
  }
  export type CustomMetricArn = string;
  export type CustomMetricDisplayName = string;
  export type CustomMetricType = "string-list"|"ip-address-list"|"number-list"|"number"|string;
  export type CustomerVersion = number;
  export type DataCollectionPercentage = number;
  export type DateType = Date;
  export type DayOfMonth = string;
  export type DayOfWeek = "SUN"|"MON"|"TUE"|"WED"|"THU"|"FRI"|"SAT"|string;
  export interface DeleteAccountAuditConfigurationRequest {
    /**
     * If true, all scheduled audits are deleted.
     */
    deleteScheduledAudits?: DeleteScheduledAudits;
  }
  export interface DeleteAccountAuditConfigurationResponse {
  }
  export type DeleteAdditionalMetricsToRetain = boolean;
  export type DeleteAlertTargets = boolean;
  export interface DeleteAuditSuppressionRequest {
    checkName: AuditCheckName;
    resourceIdentifier: ResourceIdentifier;
  }
  export interface DeleteAuditSuppressionResponse {
  }
  export interface DeleteAuthorizerRequest {
    /**
     * The name of the authorizer to delete.
     */
    authorizerName: AuthorizerName;
  }
  export interface DeleteAuthorizerResponse {
  }
  export type DeleteBehaviors = boolean;
  export interface DeleteBillingGroupRequest {
    /**
     * The name of the billing group.
     */
    billingGroupName: BillingGroupName;
    /**
     * The expected version of the billing group. If the version of the billing group does not match the expected version specified in the request, the DeleteBillingGroup request is rejected with a VersionConflictException.
     */
    expectedVersion?: OptionalVersion;
  }
  export interface DeleteBillingGroupResponse {
  }
  export interface DeleteCACertificateRequest {
    /**
     * The ID of the certificate to delete. (The last part of the certificate ARN contains the certificate ID.)
     */
    certificateId: CertificateId;
  }
  export interface DeleteCACertificateResponse {
  }
  export interface DeleteCertificateRequest {
    /**
     * The ID of the certificate. (The last part of the certificate ARN contains the certificate ID.)
     */
    certificateId: CertificateId;
    /**
     * Forces the deletion of a certificate if it is inactive and is not attached to an IoT thing.
     */
    forceDelete?: ForceDelete;
  }
  export interface DeleteCustomMetricRequest {
    /**
     *  The name of the custom metric. 
     */
    metricName: MetricName;
  }
  export interface DeleteCustomMetricResponse {
  }
  export interface DeleteDimensionRequest {
    /**
     * The unique identifier for the dimension that you want to delete.
     */
    name: DimensionName;
  }
  export interface DeleteDimensionResponse {
  }
  export interface DeleteDomainConfigurationRequest {
    /**
     * The name of the domain configuration to be deleted.
     */
    domainConfigurationName: DomainConfigurationName;
  }
  export interface DeleteDomainConfigurationResponse {
  }
  export interface DeleteDynamicThingGroupRequest {
    /**
     * The name of the dynamic thing group to delete.
     */
    thingGroupName: ThingGroupName;
    /**
     * The expected version of the dynamic thing group to delete.
     */
    expectedVersion?: OptionalVersion;
  }
  export interface DeleteDynamicThingGroupResponse {
  }
  export interface DeleteFleetMetricRequest {
    /**
     * The name of the fleet metric to delete.
     */
    metricName: FleetMetricName;
    /**
     * The expected version of the fleet metric to delete.
     */
    expectedVersion?: OptionalVersion;
  }
  export interface DeleteJobExecutionRequest {
    /**
     * The ID of the job whose execution on a particular device will be deleted.
     */
    jobId: JobId;
    /**
     * The name of the thing whose job execution will be deleted.
     */
    thingName: ThingName;
    /**
     * The ID of the job execution to be deleted. The executionNumber refers to the execution of a particular job on a particular device. Note that once a job execution is deleted, the executionNumber may be reused by IoT, so be sure you get and use the correct value here.
     */
    executionNumber: ExecutionNumber;
    /**
     * (Optional) When true, you can delete a job execution which is "IN_PROGRESS". Otherwise, you can only delete a job execution which is in a terminal state ("SUCCEEDED", "FAILED", "REJECTED", "REMOVED" or "CANCELED") or an exception will occur. The default is false.  Deleting a job execution which is "IN_PROGRESS", will cause the device to be unable to access job information or update the job execution status. Use caution and ensure that the device is able to recover to a valid state. 
     */
    force?: ForceFlag;
    /**
     * The namespace used to indicate that a job is a customer-managed job. When you specify a value for this parameter, Amazon Web Services IoT Core sends jobs notifications to MQTT topics that contain the value in the following format.  $aws/things/THING_NAME/jobs/JOB_ID/notify-namespace-NAMESPACE_ID/   The namespaceId feature is in public preview. 
     */
    namespaceId?: NamespaceId;
  }
  export interface DeleteJobRequest {
    /**
     * The ID of the job to be deleted. After a job deletion is completed, you may reuse this jobId when you create a new job. However, this is not recommended, and you must ensure that your devices are not using the jobId to refer to the deleted job.
     */
    jobId: JobId;
    /**
     * (Optional) When true, you can delete a job which is "IN_PROGRESS". Otherwise, you can only delete a job which is in a terminal state ("COMPLETED" or "CANCELED") or an exception will occur. The default is false.  Deleting a job which is "IN_PROGRESS", will cause a device which is executing the job to be unable to access job information or update the job execution status. Use caution and ensure that each device executing a job which is deleted is able to recover to a valid state. 
     */
    force?: ForceFlag;
    /**
     * The namespace used to indicate that a job is a customer-managed job. When you specify a value for this parameter, Amazon Web Services IoT Core sends jobs notifications to MQTT topics that contain the value in the following format.  $aws/things/THING_NAME/jobs/JOB_ID/notify-namespace-NAMESPACE_ID/   The namespaceId feature is in public preview. 
     */
    namespaceId?: NamespaceId;
  }
  export interface DeleteJobTemplateRequest {
    /**
     * The unique identifier of the job template to delete.
     */
    jobTemplateId: JobTemplateId;
  }
  export interface DeleteMitigationActionRequest {
    /**
     * The name of the mitigation action that you want to delete.
     */
    actionName: MitigationActionName;
  }
  export interface DeleteMitigationActionResponse {
  }
  export interface DeleteOTAUpdateRequest {
    /**
     * The ID of the OTA update to delete.
     */
    otaUpdateId: OTAUpdateId;
    /**
     * When true, the stream created by the OTAUpdate process is deleted when the OTA update is deleted. Ignored if the stream specified in the OTAUpdate is supplied by the user.
     */
    deleteStream?: DeleteStream;
    /**
     * When true, deletes the IoT job created by the OTAUpdate process even if it is "IN_PROGRESS". Otherwise, if the job is not in a terminal state ("COMPLETED" or "CANCELED") an exception will occur. The default is false.
     */
    forceDeleteAWSJob?: ForceDeleteAWSJob;
  }
  export interface DeleteOTAUpdateResponse {
  }
  export interface DeletePackageRequest {
    /**
     * The name of the target software package.
     */
    packageName: PackageName;
    /**
     * A unique case-sensitive identifier that you can provide to ensure the idempotency of the request. Don't reuse this client token if a new idempotent request is required.
     */
    clientToken?: ClientToken;
  }
  export interface DeletePackageResponse {
  }
  export interface DeletePackageVersionRequest {
    /**
     * The name of the associated software package.
     */
    packageName: PackageName;
    /**
     * The name of the target package version.
     */
    versionName: VersionName;
    /**
     * A unique case-sensitive identifier that you can provide to ensure the idempotency of the request. Don't reuse this client token if a new idempotent request is required.
     */
    clientToken?: ClientToken;
  }
  export interface DeletePackageVersionResponse {
  }
  export interface DeletePolicyRequest {
    /**
     * The name of the policy to delete.
     */
    policyName: PolicyName;
  }
  export interface DeletePolicyVersionRequest {
    /**
     * The name of the policy.
     */
    policyName: PolicyName;
    /**
     * The policy version ID.
     */
    policyVersionId: PolicyVersionId;
  }
  export interface DeleteProvisioningTemplateRequest {
    /**
     * The name of the fleet provision template to delete.
     */
    templateName: TemplateName;
  }
  export interface DeleteProvisioningTemplateResponse {
  }
  export interface DeleteProvisioningTemplateVersionRequest {
    /**
     * The name of the provisioning template version to delete.
     */
    templateName: TemplateName;
    /**
     * The provisioning template version ID to delete.
     */
    versionId: TemplateVersionId;
  }
  export interface DeleteProvisioningTemplateVersionResponse {
  }
  export interface DeleteRegistrationCodeRequest {
  }
  export interface DeleteRegistrationCodeResponse {
  }
  export interface DeleteRoleAliasRequest {
    /**
     * The role alias to delete.
     */
    roleAlias: RoleAlias;
  }
  export interface DeleteRoleAliasResponse {
  }
  export interface DeleteScheduledAuditRequest {
    /**
     * The name of the scheduled audit you want to delete.
     */
    scheduledAuditName: ScheduledAuditName;
  }
  export interface DeleteScheduledAuditResponse {
  }
  export type DeleteScheduledAudits = boolean;
  export interface DeleteSecurityProfileRequest {
    /**
     * The name of the security profile to be deleted.
     */
    securityProfileName: SecurityProfileName;
    /**
     * The expected version of the security profile. A new version is generated whenever the security profile is updated. If you specify a value that is different from the actual version, a VersionConflictException is thrown.
     */
    expectedVersion?: OptionalVersion;
  }
  export interface DeleteSecurityProfileResponse {
  }
  export type DeleteStream = boolean;
  export interface DeleteStreamRequest {
    /**
     * The stream ID.
     */
    streamId: StreamId;
  }
  export interface DeleteStreamResponse {
  }
  export interface DeleteThingGroupRequest {
    /**
     * The name of the thing group to delete.
     */
    thingGroupName: ThingGroupName;
    /**
     * The expected version of the thing group to delete.
     */
    expectedVersion?: OptionalVersion;
  }
  export interface DeleteThingGroupResponse {
  }
  export interface DeleteThingRequest {
    /**
     * The name of the thing to delete.
     */
    thingName: ThingName;
    /**
     * The expected version of the thing record in the registry. If the version of the record in the registry does not match the expected version specified in the request, the DeleteThing request is rejected with a VersionConflictException.
     */
    expectedVersion?: OptionalVersion;
  }
  export interface DeleteThingResponse {
  }
  export interface DeleteThingTypeRequest {
    /**
     * The name of the thing type.
     */
    thingTypeName: ThingTypeName;
  }
  export interface DeleteThingTypeResponse {
  }
  export interface DeleteTopicRuleDestinationRequest {
    /**
     * The ARN of the topic rule destination to delete.
     */
    arn: AwsArn;
  }
  export interface DeleteTopicRuleDestinationResponse {
  }
  export interface DeleteTopicRuleRequest {
    /**
     * The name of the rule.
     */
    ruleName: RuleName;
  }
  export interface DeleteV2LoggingLevelRequest {
    /**
     * The type of resource for which you are configuring logging. Must be THING_Group.
     */
    targetType: LogTargetType;
    /**
     * The name of the resource for which you are configuring logging.
     */
    targetName: LogTargetName;
  }
  export type DeliveryStreamName = string;
  export interface Denied {
    /**
     * Information that implicitly denies the authorization. When a policy doesn't explicitly deny or allow an action on a resource it is considered an implicit deny.
     */
    implicitDeny?: ImplicitDeny;
    /**
     * Information that explicitly denies the authorization. 
     */
    explicitDeny?: ExplicitDeny;
  }
  export interface DeprecateThingTypeRequest {
    /**
     * The name of the thing type to deprecate.
     */
    thingTypeName: ThingTypeName;
    /**
     * Whether to undeprecate a deprecated thing type. If true, the thing type will not be deprecated anymore and you can associate it with things.
     */
    undoDeprecate?: UndoDeprecate;
  }
  export interface DeprecateThingTypeResponse {
  }
  export type DeprecationDate = Date;
  export interface DescribeAccountAuditConfigurationRequest {
  }
  export interface DescribeAccountAuditConfigurationResponse {
    /**
     * The ARN of the role that grants permission to IoT to access information about your devices, policies, certificates, and other items as required when performing an audit. On the first call to UpdateAccountAuditConfiguration, this parameter is required.
     */
    roleArn?: RoleArn;
    /**
     * Information about the targets to which audit notifications are sent for this account.
     */
    auditNotificationTargetConfigurations?: AuditNotificationTargetConfigurations;
    /**
     * Which audit checks are enabled and disabled for this account.
     */
    auditCheckConfigurations?: AuditCheckConfigurations;
  }
  export interface DescribeAuditFindingRequest {
    /**
     * A unique identifier for a single audit finding. You can use this identifier to apply mitigation actions to the finding.
     */
    findingId: FindingId;
  }
  export interface DescribeAuditFindingResponse {
    finding?: AuditFinding;
  }
  export interface DescribeAuditMitigationActionsTaskRequest {
    /**
     * The unique identifier for the audit mitigation task.
     */
    taskId: MitigationActionsTaskId;
  }
  export interface DescribeAuditMitigationActionsTaskResponse {
    /**
     * The current status of the task.
     */
    taskStatus?: AuditMitigationActionsTaskStatus;
    /**
     * The date and time when the task was started.
     */
    startTime?: Timestamp;
    /**
     * The date and time when the task was completed or canceled.
     */
    endTime?: Timestamp;
    /**
     * Aggregate counts of the results when the mitigation tasks were applied to the findings for this audit mitigation actions task.
     */
    taskStatistics?: AuditMitigationActionsTaskStatistics;
    /**
     * Identifies the findings to which the mitigation actions are applied. This can be by audit checks, by audit task, or a set of findings.
     */
    target?: AuditMitigationActionsTaskTarget;
    /**
     * Specifies the mitigation actions that should be applied to specific audit checks.
     */
    auditCheckToActionsMapping?: AuditCheckToActionsMapping;
    /**
     * Specifies the mitigation actions and their parameters that are applied as part of this task.
     */
    actionsDefinition?: MitigationActionList;
  }
  export interface DescribeAuditSuppressionRequest {
    checkName: AuditCheckName;
    resourceIdentifier: ResourceIdentifier;
  }
  export interface DescribeAuditSuppressionResponse {
    checkName?: AuditCheckName;
    resourceIdentifier?: ResourceIdentifier;
    /**
     *  The epoch timestamp in seconds at which this suppression expires. 
     */
    expirationDate?: Timestamp;
    /**
     *  Indicates whether a suppression should exist indefinitely or not. 
     */
    suppressIndefinitely?: SuppressIndefinitely;
    /**
     *  The description of the audit suppression. 
     */
    description?: AuditDescription;
  }
  export interface DescribeAuditTaskRequest {
    /**
     * The ID of the audit whose information you want to get.
     */
    taskId: AuditTaskId;
  }
  export interface DescribeAuditTaskResponse {
    /**
     * The status of the audit: one of "IN_PROGRESS", "COMPLETED", "FAILED", or "CANCELED".
     */
    taskStatus?: AuditTaskStatus;
    /**
     * The type of audit: "ON_DEMAND_AUDIT_TASK" or "SCHEDULED_AUDIT_TASK".
     */
    taskType?: AuditTaskType;
    /**
     * The time the audit started.
     */
    taskStartTime?: Timestamp;
    /**
     * Statistical information about the audit.
     */
    taskStatistics?: TaskStatistics;
    /**
     * The name of the scheduled audit (only if the audit was a scheduled audit).
     */
    scheduledAuditName?: ScheduledAuditName;
    /**
     * Detailed information about each check performed during this audit.
     */
    auditDetails?: AuditDetails;
  }
  export interface DescribeAuthorizerRequest {
    /**
     * The name of the authorizer to describe.
     */
    authorizerName: AuthorizerName;
  }
  export interface DescribeAuthorizerResponse {
    /**
     * The authorizer description.
     */
    authorizerDescription?: AuthorizerDescription;
  }
  export interface DescribeBillingGroupRequest {
    /**
     * The name of the billing group.
     */
    billingGroupName: BillingGroupName;
  }
  export interface DescribeBillingGroupResponse {
    /**
     * The name of the billing group.
     */
    billingGroupName?: BillingGroupName;
    /**
     * The ID of the billing group.
     */
    billingGroupId?: BillingGroupId;
    /**
     * The ARN of the billing group.
     */
    billingGroupArn?: BillingGroupArn;
    /**
     * The version of the billing group.
     */
    version?: Version;
    /**
     * The properties of the billing group.
     */
    billingGroupProperties?: BillingGroupProperties;
    /**
     * Additional information about the billing group.
     */
    billingGroupMetadata?: BillingGroupMetadata;
  }
  export interface DescribeCACertificateRequest {
    /**
     * The CA certificate identifier.
     */
    certificateId: CertificateId;
  }
  export interface DescribeCACertificateResponse {
    /**
     * The CA certificate description.
     */
    certificateDescription?: CACertificateDescription;
    /**
     * Information about the registration configuration.
     */
    registrationConfig?: RegistrationConfig;
  }
  export interface DescribeCertificateRequest {
    /**
     * The ID of the certificate. (The last part of the certificate ARN contains the certificate ID.)
     */
    certificateId: CertificateId;
  }
  export interface DescribeCertificateResponse {
    /**
     * The description of the certificate.
     */
    certificateDescription?: CertificateDescription;
  }
  export interface DescribeCustomMetricRequest {
    /**
     *  The name of the custom metric. 
     */
    metricName: MetricName;
  }
  export interface DescribeCustomMetricResponse {
    /**
     *  The name of the custom metric. 
     */
    metricName?: MetricName;
    /**
     *  The Amazon Resource Number (ARN) of the custom metric. 
     */
    metricArn?: CustomMetricArn;
    /**
     *  The type of the custom metric.   The type number only takes a single metric value as an input, but while submitting the metrics value in the DeviceMetrics report, it must be passed as an array with a single value. 
     */
    metricType?: CustomMetricType;
    /**
     *  Field represents a friendly name in the console for the custom metric; doesn't have to be unique. Don't use this name as the metric identifier in the device metric report. Can be updated. 
     */
    displayName?: CustomMetricDisplayName;
    /**
     *  The creation date of the custom metric in milliseconds since epoch. 
     */
    creationDate?: Timestamp;
    /**
     *  The time the custom metric was last modified in milliseconds since epoch. 
     */
    lastModifiedDate?: Timestamp;
  }
  export interface DescribeDefaultAuthorizerRequest {
  }
  export interface DescribeDefaultAuthorizerResponse {
    /**
     * The default authorizer's description.
     */
    authorizerDescription?: AuthorizerDescription;
  }
  export interface DescribeDetectMitigationActionsTaskRequest {
    /**
     *  The unique identifier of the task. 
     */
    taskId: MitigationActionsTaskId;
  }
  export interface DescribeDetectMitigationActionsTaskResponse {
    /**
     *  The description of a task. 
     */
    taskSummary?: DetectMitigationActionsTaskSummary;
  }
  export interface DescribeDimensionRequest {
    /**
     * The unique identifier for the dimension.
     */
    name: DimensionName;
  }
  export interface DescribeDimensionResponse {
    /**
     * The unique identifier for the dimension.
     */
    name?: DimensionName;
    /**
     * The Amazon Resource Name (ARN) for the dimension.
     */
    arn?: DimensionArn;
    /**
     * The type of the dimension.
     */
    type?: DimensionType;
    /**
     * The value or list of values used to scope the dimension. For example, for topic filters, this is the pattern used to match the MQTT topic name.
     */
    stringValues?: DimensionStringValues;
    /**
     * The date the dimension was created.
     */
    creationDate?: Timestamp;
    /**
     * The date the dimension was last modified.
     */
    lastModifiedDate?: Timestamp;
  }
  export interface DescribeDomainConfigurationRequest {
    /**
     * The name of the domain configuration.
     */
    domainConfigurationName: ReservedDomainConfigurationName;
  }
  export interface DescribeDomainConfigurationResponse {
    /**
     * The name of the domain configuration.
     */
    domainConfigurationName?: ReservedDomainConfigurationName;
    /**
     * The ARN of the domain configuration.
     */
    domainConfigurationArn?: DomainConfigurationArn;
    /**
     * The name of the domain.
     */
    domainName?: DomainName;
    /**
     * A list containing summary information about the server certificate included in the domain configuration.
     */
    serverCertificates?: ServerCertificates;
    /**
     * An object that specifies the authorization service for a domain.
     */
    authorizerConfig?: AuthorizerConfig;
    /**
     * A Boolean value that specifies the current state of the domain configuration.
     */
    domainConfigurationStatus?: DomainConfigurationStatus;
    /**
     * The type of service delivered by the endpoint.
     */
    serviceType?: ServiceType;
    /**
     * The type of the domain.
     */
    domainType?: DomainType;
    /**
     * The date and time the domain configuration's status was last changed.
     */
    lastStatusChangeDate?: DateType;
    /**
     * An object that specifies the TLS configuration for a domain.
     */
    tlsConfig?: TlsConfig;
  }
  export interface DescribeEndpointRequest {
    /**
     * The endpoint type. Valid endpoint types include:    iot:Data - Returns a VeriSign signed data endpoint.      iot:Data-ATS - Returns an ATS signed data endpoint.      iot:CredentialProvider - Returns an IoT credentials provider API endpoint.      iot:Jobs - Returns an IoT device management Jobs API endpoint.   We strongly recommend that customers use the newer iot:Data-ATS endpoint type to avoid issues related to the widespread distrust of Symantec certificate authorities. ATS Signed Certificates are more secure and are trusted by most popular browsers.
     */
    endpointType?: EndpointType;
  }
  export interface DescribeEndpointResponse {
    /**
     * The endpoint. The format of the endpoint is as follows: identifier.iot.region.amazonaws.com.
     */
    endpointAddress?: EndpointAddress;
  }
  export interface DescribeEventConfigurationsRequest {
  }
  export interface DescribeEventConfigurationsResponse {
    /**
     * The event configurations.
     */
    eventConfigurations?: EventConfigurations;
    /**
     * The creation date of the event configuration.
     */
    creationDate?: CreationDate;
    /**
     * The date the event configurations were last modified.
     */
    lastModifiedDate?: LastModifiedDate;
  }
  export interface DescribeFleetMetricRequest {
    /**
     * The name of the fleet metric to describe.
     */
    metricName: FleetMetricName;
  }
  export interface DescribeFleetMetricResponse {
    /**
     * The name of the fleet metric to describe.
     */
    metricName?: FleetMetricName;
    /**
     * The search query string.
     */
    queryString?: QueryString;
    /**
     * The type of the aggregation query.
     */
    aggregationType?: AggregationType;
    /**
     * The time in seconds between fleet metric emissions. Range [60(1 min), 86400(1 day)] and must be multiple of 60.
     */
    period?: FleetMetricPeriod;
    /**
     * The field to aggregate.
     */
    aggregationField?: AggregationField;
    /**
     * The fleet metric description.
     */
    description?: FleetMetricDescription;
    /**
     * The query version.
     */
    queryVersion?: QueryVersion;
    /**
     * The name of the index to search.
     */
    indexName?: IndexName;
    /**
     * The date when the fleet metric is created.
     */
    creationDate?: CreationDate;
    /**
     * The date when the fleet metric is last modified.
     */
    lastModifiedDate?: LastModifiedDate;
    /**
     * Used to support unit transformation such as milliseconds to seconds. The unit must be supported by CW metric.
     */
    unit?: FleetMetricUnit;
    /**
     * The version of the fleet metric.
     */
    version?: Version;
    /**
     * The ARN of the fleet metric to describe.
     */
    metricArn?: FleetMetricArn;
  }
  export interface DescribeIndexRequest {
    /**
     * The index name.
     */
    indexName: IndexName;
  }
  export interface DescribeIndexResponse {
    /**
     * The index name.
     */
    indexName?: IndexName;
    /**
     * The index status.
     */
    indexStatus?: IndexStatus;
    /**
     * Contains a value that specifies the type of indexing performed. Valid values are:   REGISTRY – Your thing index contains only registry data.   REGISTRY_AND_SHADOW - Your thing index contains registry data and shadow data.   REGISTRY_AND_CONNECTIVITY_STATUS - Your thing index contains registry data and thing connectivity status data.   REGISTRY_AND_SHADOW_AND_CONNECTIVITY_STATUS - Your thing index contains registry data, shadow data, and thing connectivity status data.   MULTI_INDEXING_MODE - Your thing index contains multiple data sources. For more information, see GetIndexingConfiguration.  
     */
    schema?: IndexSchema;
  }
  export interface DescribeJobExecutionRequest {
    /**
     * The unique identifier you assigned to this job when it was created.
     */
    jobId: JobId;
    /**
     * The name of the thing on which the job execution is running.
     */
    thingName: ThingName;
    /**
     * A string (consisting of the digits "0" through "9" which is used to specify a particular job execution on a particular device.
     */
    executionNumber?: ExecutionNumber;
  }
  export interface DescribeJobExecutionResponse {
    /**
     * Information about the job execution.
     */
    execution?: JobExecution;
  }
  export interface DescribeJobRequest {
    /**
     * The unique identifier you assigned to this job when it was created.
     */
    jobId: JobId;
  }
  export interface DescribeJobResponse {
    /**
     * An S3 link to the job document.
     */
    documentSource?: JobDocumentSource;
    /**
     * Information about the job.
     */
    job?: Job;
  }
  export interface DescribeJobTemplateRequest {
    /**
     * The unique identifier of the job template.
     */
    jobTemplateId: JobTemplateId;
  }
  export interface DescribeJobTemplateResponse {
    /**
     * The ARN of the job template.
     */
    jobTemplateArn?: JobTemplateArn;
    /**
     * The unique identifier of the job template.
     */
    jobTemplateId?: JobTemplateId;
    /**
     * A description of the job template.
     */
    description?: JobDescription;
    /**
     * An S3 link to the job document.
     */
    documentSource?: JobDocumentSource;
    /**
     * The job document.
     */
    document?: JobDocument;
    /**
     * The time, in seconds since the epoch, when the job template was created.
     */
    createdAt?: DateType;
    presignedUrlConfig?: PresignedUrlConfig;
    jobExecutionsRolloutConfig?: JobExecutionsRolloutConfig;
    abortConfig?: AbortConfig;
    timeoutConfig?: TimeoutConfig;
    /**
     * The configuration that determines how many retries are allowed for each failure type for a job.
     */
    jobExecutionsRetryConfig?: JobExecutionsRetryConfig;
    /**
     * Allows you to configure an optional maintenance window for the rollout of a job document to all devices in the target group for a job.
     */
    maintenanceWindows?: MaintenanceWindows;
    /**
     * The package version Amazon Resource Names (ARNs) that are installed on the device when the job successfully completes.   Note:The following Length Constraints relates to a single string. Up to five strings are allowed.
     */
    destinationPackageVersions?: DestinationPackageVersions;
  }
  export interface DescribeManagedJobTemplateRequest {
    /**
     * The unique name of a managed job template, which is required.
     */
    templateName: ManagedJobTemplateName;
    /**
     * An optional parameter to specify version of a managed template. If not specified, the pre-defined default version is returned.
     */
    templateVersion?: ManagedTemplateVersion;
  }
  export interface DescribeManagedJobTemplateResponse {
    /**
     * The unique name of a managed template, such as AWS-Reboot.
     */
    templateName?: ManagedJobTemplateName;
    /**
     * The unique Amazon Resource Name (ARN) of the managed template.
     */
    templateArn?: JobTemplateArn;
    /**
     * The unique description of a managed template.
     */
    description?: JobDescription;
    /**
     * The version for a managed template.
     */
    templateVersion?: ManagedTemplateVersion;
    /**
     * A list of environments that are supported with the managed job template.
     */
    environments?: Environments;
    /**
     * A map of key-value pairs that you can use as guidance to specify the inputs for creating a job from a managed template.   documentParameters can only be used when creating jobs from Amazon Web Services managed templates. This parameter can't be used with custom job templates or to create jobs from them. 
     */
    documentParameters?: DocumentParameters;
    /**
     * The document schema for a managed job template.
     */
    document?: JobDocument;
  }
  export interface DescribeMitigationActionRequest {
    /**
     * The friendly name that uniquely identifies the mitigation action.
     */
    actionName: MitigationActionName;
  }
  export interface DescribeMitigationActionResponse {
    /**
     * The friendly name that uniquely identifies the mitigation action.
     */
    actionName?: MitigationActionName;
    /**
     * The type of mitigation action.
     */
    actionType?: MitigationActionType;
    /**
     * The ARN that identifies this migration action.
     */
    actionArn?: MitigationActionArn;
    /**
     * A unique identifier for this action.
     */
    actionId?: MitigationActionId;
    /**
     * The ARN of the IAM role used to apply this action.
     */
    roleArn?: RoleArn;
    /**
     * Parameters that control how the mitigation action is applied, specific to the type of mitigation action.
     */
    actionParams?: MitigationActionParams;
    /**
     * The date and time when the mitigation action was added to your Amazon Web Services accounts.
     */
    creationDate?: Timestamp;
    /**
     * The date and time when the mitigation action was last changed.
     */
    lastModifiedDate?: Timestamp;
  }
  export interface DescribeProvisioningTemplateRequest {
    /**
     * The name of the provisioning template.
     */
    templateName: TemplateName;
  }
  export interface DescribeProvisioningTemplateResponse {
    /**
     * The ARN of the provisioning template.
     */
    templateArn?: TemplateArn;
    /**
     * The name of the provisioning template.
     */
    templateName?: TemplateName;
    /**
     * The description of the provisioning template.
     */
    description?: TemplateDescription;
    /**
     * The date when the provisioning template was created.
     */
    creationDate?: DateType;
    /**
     * The date when the provisioning template was last modified.
     */
    lastModifiedDate?: DateType;
    /**
     * The default fleet template version ID.
     */
    defaultVersionId?: TemplateVersionId;
    /**
     * The JSON formatted contents of the provisioning template.
     */
    templateBody?: TemplateBody;
    /**
     * True if the provisioning template is enabled, otherwise false.
     */
    enabled?: Enabled;
    /**
     * The ARN of the role associated with the provisioning template. This IoT role grants permission to provision a device.
     */
    provisioningRoleArn?: RoleArn;
    /**
     * Gets information about a pre-provisioned hook.
     */
    preProvisioningHook?: ProvisioningHook;
    /**
     * The type you define in a provisioning template. You can create a template with only one type. You can't change the template type after its creation. The default value is FLEET_PROVISIONING. For more information about provisioning template, see: Provisioning template. 
     */
    type?: TemplateType;
  }
  export interface DescribeProvisioningTemplateVersionRequest {
    /**
     * The template name.
     */
    templateName: TemplateName;
    /**
     * The provisioning template version ID.
     */
    versionId: TemplateVersionId;
  }
  export interface DescribeProvisioningTemplateVersionResponse {
    /**
     * The provisioning template version ID.
     */
    versionId?: TemplateVersionId;
    /**
     * The date when the provisioning template version was created.
     */
    creationDate?: DateType;
    /**
     * The JSON formatted contents of the provisioning template version.
     */
    templateBody?: TemplateBody;
    /**
     * True if the provisioning template version is the default version.
     */
    isDefaultVersion?: IsDefaultVersion;
  }
  export interface DescribeRoleAliasRequest {
    /**
     * The role alias to describe.
     */
    roleAlias: RoleAlias;
  }
  export interface DescribeRoleAliasResponse {
    /**
     * The role alias description.
     */
    roleAliasDescription?: RoleAliasDescription;
  }
  export interface DescribeScheduledAuditRequest {
    /**
     * The name of the scheduled audit whose information you want to get.
     */
    scheduledAuditName: ScheduledAuditName;
  }
  export interface DescribeScheduledAuditResponse {
    /**
     * How often the scheduled audit takes place, either one of DAILY, WEEKLY, BIWEEKLY, or MONTHLY. The start time of each audit is determined by the system.
     */
    frequency?: AuditFrequency;
    /**
     * The day of the month on which the scheduled audit takes place. This is will be 1 through 31 or LAST. If days 29-31 are specified, and the month does not have that many days, the audit takes place on the LAST day of the month.
     */
    dayOfMonth?: DayOfMonth;
    /**
     * The day of the week on which the scheduled audit takes place, either one of SUN, MON, TUE, WED, THU, FRI, or SAT.
     */
    dayOfWeek?: DayOfWeek;
    /**
     * Which checks are performed during the scheduled audit. Checks must be enabled for your account. (Use DescribeAccountAuditConfiguration to see the list of all checks, including those that are enabled or use UpdateAccountAuditConfiguration to select which checks are enabled.)
     */
    targetCheckNames?: TargetAuditCheckNames;
    /**
     * The name of the scheduled audit.
     */
    scheduledAuditName?: ScheduledAuditName;
    /**
     * The ARN of the scheduled audit.
     */
    scheduledAuditArn?: ScheduledAuditArn;
  }
  export interface DescribeSecurityProfileRequest {
    /**
     * The name of the security profile whose information you want to get.
     */
    securityProfileName: SecurityProfileName;
  }
  export interface DescribeSecurityProfileResponse {
    /**
     * The name of the security profile.
     */
    securityProfileName?: SecurityProfileName;
    /**
     * The ARN of the security profile.
     */
    securityProfileArn?: SecurityProfileArn;
    /**
     * A description of the security profile (associated with the security profile when it was created or updated).
     */
    securityProfileDescription?: SecurityProfileDescription;
    /**
     * Specifies the behaviors that, when violated by a device (thing), cause an alert.
     */
    behaviors?: Behaviors;
    /**
     * Where the alerts are sent. (Alerts are always sent to the console.)
     */
    alertTargets?: AlertTargets;
    /**
     *  Please use DescribeSecurityProfileResponse$additionalMetricsToRetainV2 instead.  A list of metrics whose data is retained (stored). By default, data is retained for any metric used in the profile's behaviors, but it is also retained for any metric specified here.
     */
    additionalMetricsToRetain?: AdditionalMetricsToRetainList;
    /**
     * A list of metrics whose data is retained (stored). By default, data is retained for any metric used in the profile's behaviors, but it is also retained for any metric specified here.
     */
    additionalMetricsToRetainV2?: AdditionalMetricsToRetainV2List;
    /**
     * The version of the security profile. A new version is generated whenever the security profile is updated.
     */
    version?: Version;
    /**
     * The time the security profile was created.
     */
    creationDate?: Timestamp;
    /**
     * The time the security profile was last modified.
     */
    lastModifiedDate?: Timestamp;
  }
  export interface DescribeStreamRequest {
    /**
     * The stream ID.
     */
    streamId: StreamId;
  }
  export interface DescribeStreamResponse {
    /**
     * Information about the stream.
     */
    streamInfo?: StreamInfo;
  }
  export interface DescribeThingGroupRequest {
    /**
     * The name of the thing group.
     */
    thingGroupName: ThingGroupName;
  }
  export interface DescribeThingGroupResponse {
    /**
     * The name of the thing group.
     */
    thingGroupName?: ThingGroupName;
    /**
     * The thing group ID.
     */
    thingGroupId?: ThingGroupId;
    /**
     * The thing group ARN.
     */
    thingGroupArn?: ThingGroupArn;
    /**
     * The version of the thing group.
     */
    version?: Version;
    /**
     * The thing group properties.
     */
    thingGroupProperties?: ThingGroupProperties;
    /**
     * Thing group metadata.
     */
    thingGroupMetadata?: ThingGroupMetadata;
    /**
     * The dynamic thing group index name.
     */
    indexName?: IndexName;
    /**
     * The dynamic thing group search query string.
     */
    queryString?: QueryString;
    /**
     * The dynamic thing group query version.
     */
    queryVersion?: QueryVersion;
    /**
     * The dynamic thing group status.
     */
    status?: DynamicGroupStatus;
  }
  export interface DescribeThingRegistrationTaskRequest {
    /**
     * The task ID.
     */
    taskId: TaskId;
  }
  export interface DescribeThingRegistrationTaskResponse {
    /**
     * The task ID.
     */
    taskId?: TaskId;
    /**
     * The task creation date.
     */
    creationDate?: CreationDate;
    /**
     * The date when the task was last modified.
     */
    lastModifiedDate?: LastModifiedDate;
    /**
     * The task's template.
     */
    templateBody?: TemplateBody;
    /**
     * The S3 bucket that contains the input file.
     */
    inputFileBucket?: RegistryS3BucketName;
    /**
     * The input file key.
     */
    inputFileKey?: RegistryS3KeyName;
    /**
     * The role ARN that grants access to the input file bucket.
     */
    roleArn?: RoleArn;
    /**
     * The status of the bulk thing provisioning task.
     */
    status?: Status;
    /**
     * The message.
     */
    message?: ErrorMessage;
    /**
     * The number of things successfully provisioned.
     */
    successCount?: Count;
    /**
     * The number of things that failed to be provisioned.
     */
    failureCount?: Count;
    /**
     * The progress of the bulk provisioning task expressed as a percentage.
     */
    percentageProgress?: Percentage;
  }
  export interface DescribeThingRequest {
    /**
     * The name of the thing.
     */
    thingName: ThingName;
  }
  export interface DescribeThingResponse {
    /**
     * The default MQTT client ID. For a typical device, the thing name is also used as the default MQTT client ID. Although we don’t require a mapping between a thing's registry name and its use of MQTT client IDs, certificates, or shadow state, we recommend that you choose a thing name and use it as the MQTT client ID for the registry and the Device Shadow service. This lets you better organize your IoT fleet without removing the flexibility of the underlying device certificate model or shadows.
     */
    defaultClientId?: ClientId;
    /**
     * The name of the thing.
     */
    thingName?: ThingName;
    /**
     * The ID of the thing to describe.
     */
    thingId?: ThingId;
    /**
     * The ARN of the thing to describe.
     */
    thingArn?: ThingArn;
    /**
     * The thing type name.
     */
    thingTypeName?: ThingTypeName;
    /**
     * The thing attributes.
     */
    attributes?: Attributes;
    /**
     * The current version of the thing record in the registry.  To avoid unintentional changes to the information in the registry, you can pass the version information in the expectedVersion parameter of the UpdateThing and DeleteThing calls. 
     */
    version?: Version;
    /**
     * The name of the billing group the thing belongs to.
     */
    billingGroupName?: BillingGroupName;
  }
  export interface DescribeThingTypeRequest {
    /**
     * The name of the thing type.
     */
    thingTypeName: ThingTypeName;
  }
  export interface DescribeThingTypeResponse {
    /**
     * The name of the thing type.
     */
    thingTypeName?: ThingTypeName;
    /**
     * The thing type ID.
     */
    thingTypeId?: ThingTypeId;
    /**
     * The thing type ARN.
     */
    thingTypeArn?: ThingTypeArn;
    /**
     * The ThingTypeProperties contains information about the thing type including description, and a list of searchable thing attribute names.
     */
    thingTypeProperties?: ThingTypeProperties;
    /**
     * The ThingTypeMetadata contains additional information about the thing type including: creation date and time, a value indicating whether the thing type is deprecated, and a date and time when it was deprecated.
     */
    thingTypeMetadata?: ThingTypeMetadata;
  }
  export type Description = string;
  export interface Destination {
    /**
     * Describes the location in S3 of the updated firmware.
     */
    s3Destination?: S3Destination;
  }
  export type DestinationPackageVersions = PackageVersionArn[];
  export interface DetachPolicyRequest {
    /**
     * The policy to detach.
     */
    policyName: PolicyName;
    /**
     * The target from which the policy will be detached.
     */
    target: PolicyTarget;
  }
  export interface DetachPrincipalPolicyRequest {
    /**
     * The name of the policy to detach.
     */
    policyName: PolicyName;
    /**
     * The principal. Valid principals are CertificateArn (arn:aws:iot:region:accountId:cert/certificateId), thingGroupArn (arn:aws:iot:region:accountId:thinggroup/groupName) and CognitoId (region:id).
     */
    principal: Principal;
  }
  export interface DetachSecurityProfileRequest {
    /**
     * The security profile that is detached.
     */
    securityProfileName: SecurityProfileName;
    /**
     * The ARN of the thing group from which the security profile is detached.
     */
    securityProfileTargetArn: SecurityProfileTargetArn;
  }
  export interface DetachSecurityProfileResponse {
  }
  export interface DetachThingPrincipalRequest {
    /**
     * The name of the thing.
     */
    thingName: ThingName;
    /**
     * If the principal is a certificate, this value must be ARN of the certificate. If the principal is an Amazon Cognito identity, this value must be the ID of the Amazon Cognito identity.
     */
    principal: Principal;
  }
  export interface DetachThingPrincipalResponse {
  }
  export type DetailsKey = string;
  export type DetailsMap = {[key: string]: DetailsValue};
  export type DetailsValue = string;
  export interface DetectMitigationActionExecution {
    /**
     *  The unique identifier of the task. 
     */
    taskId?: MitigationActionsTaskId;
    /**
     *  The unique identifier of the violation. 
     */
    violationId?: ViolationId;
    /**
     *  The friendly name that uniquely identifies the mitigation action. 
     */
    actionName?: MitigationActionName;
    /**
     *  The name of the thing. 
     */
    thingName?: DeviceDefenderThingName;
    /**
     *  The date a mitigation action was started. 
     */
    executionStartDate?: Timestamp;
    /**
     *  The date a mitigation action ended. 
     */
    executionEndDate?: Timestamp;
    /**
     *  The status of a mitigation action. 
     */
    status?: DetectMitigationActionExecutionStatus;
    /**
     *  The error code of a mitigation action. 
     */
    errorCode?: DetectMitigationActionExecutionErrorCode;
    /**
     *  The message of a mitigation action. 
     */
    message?: ErrorMessage;
  }
  export type DetectMitigationActionExecutionErrorCode = string;
  export type DetectMitigationActionExecutionList = DetectMitigationActionExecution[];
  export type DetectMitigationActionExecutionStatus = "IN_PROGRESS"|"SUCCESSFUL"|"FAILED"|"SKIPPED"|string;
  export interface DetectMitigationActionsTaskStatistics {
    /**
     *  The actions that were performed. 
     */
    actionsExecuted?: GenericLongValue;
    /**
     *  The actions that were skipped. 
     */
    actionsSkipped?: GenericLongValue;
    /**
     *  The actions that failed. 
     */
    actionsFailed?: GenericLongValue;
  }
  export type DetectMitigationActionsTaskStatus = "IN_PROGRESS"|"SUCCESSFUL"|"FAILED"|"CANCELED"|string;
  export interface DetectMitigationActionsTaskSummary {
    /**
     *  The unique identifier of the task. 
     */
    taskId?: MitigationActionsTaskId;
    /**
     *  The status of the task. 
     */
    taskStatus?: DetectMitigationActionsTaskStatus;
    /**
     *  The date the task started. 
     */
    taskStartTime?: Timestamp;
    /**
     *  The date the task ended. 
     */
    taskEndTime?: Timestamp;
    /**
     *  Specifies the ML Detect findings to which the mitigation actions are applied. 
     */
    target?: DetectMitigationActionsTaskTarget;
    /**
     *  Specifies the time period of which violation events occurred between. 
     */
    violationEventOccurrenceRange?: ViolationEventOccurrenceRange;
    /**
     *  Includes only active violations. 
     */
    onlyActiveViolationsIncluded?: PrimitiveBoolean;
    /**
     *  Includes suppressed alerts. 
     */
    suppressedAlertsIncluded?: PrimitiveBoolean;
    /**
     *  The definition of the actions. 
     */
    actionsDefinition?: MitigationActionList;
    /**
     *  The statistics of a mitigation action task. 
     */
    taskStatistics?: DetectMitigationActionsTaskStatistics;
  }
  export type DetectMitigationActionsTaskSummaryList = DetectMitigationActionsTaskSummary[];
  export interface DetectMitigationActionsTaskTarget {
    /**
     *  The unique identifiers of the violations. 
     */
    violationIds?: TargetViolationIdsForDetectMitigationActions;
    /**
     *  The name of the security profile. 
     */
    securityProfileName?: SecurityProfileName;
    /**
     *  The name of the behavior. 
     */
    behaviorName?: BehaviorName;
  }
  export type DetectMitigationActionsToExecuteList = MitigationActionName[];
  export type DeviceCertificateUpdateAction = "DEACTIVATE"|string;
  export type DeviceDefenderIndexingMode = "OFF"|"VIOLATIONS"|string;
  export type DeviceDefenderThingName = string;
  export type DimensionArn = string;
  export type DimensionName = string;
  export type DimensionNames = DimensionName[];
  export type DimensionStringValue = string;
  export type DimensionStringValues = DimensionStringValue[];
  export type DimensionType = "TOPIC_FILTER"|string;
  export type DimensionValueOperator = "IN"|"NOT_IN"|string;
  export type DisableAllLogs = boolean;
  export interface DisableTopicRuleRequest {
    /**
     * The name of the rule to disable.
     */
    ruleName: RuleName;
  }
  export type DisconnectReason = string;
  export interface DocumentParameter {
    /**
     * Key of the map field containing the patterns that need to be replaced in a managed template job document schema.
     */
    key?: ParameterKey;
    /**
     * Description of the map field containing the patterns that need to be replaced in a managed template job document schema.
     */
    description?: JobDescription;
    /**
     * A regular expression of the patterns that need to be replaced in a managed template job document schema.
     */
    regex?: Regex;
    /**
     * An example illustrating a pattern that need to be replaced in a managed template job document schema.
     */
    example?: Example;
    /**
     * Specifies whether a pattern that needs to be replaced in a managed template job document schema is optional or required.
     */
    optional?: Optional;
  }
  export type DocumentParameters = DocumentParameter[];
  export type DomainConfigurationArn = string;
  export type DomainConfigurationName = string;
  export type DomainConfigurationStatus = "ENABLED"|"DISABLED"|string;
  export interface DomainConfigurationSummary {
    /**
     * The name of the domain configuration. This value must be unique to a region.
     */
    domainConfigurationName?: ReservedDomainConfigurationName;
    /**
     * The ARN of the domain configuration.
     */
    domainConfigurationArn?: DomainConfigurationArn;
    /**
     * The type of service delivered by the endpoint.
     */
    serviceType?: ServiceType;
  }
  export type DomainConfigurations = DomainConfigurationSummary[];
  export type DomainName = string;
  export type DomainType = "ENDPOINT"|"AWS_MANAGED"|"CUSTOMER_MANAGED"|string;
  export type DurationInMinutes = number;
  export type DurationSeconds = number;
  export type DynamicGroupStatus = "ACTIVE"|"BUILDING"|"REBUILDING"|string;
  export interface DynamoDBAction {
    /**
     * The name of the DynamoDB table.
     */
    tableName: TableName;
    /**
     * The ARN of the IAM role that grants access to the DynamoDB table.
     */
    roleArn: AwsArn;
    /**
     * The type of operation to be performed. This follows the substitution template, so it can be ${operation}, but the substitution must result in one of the following: INSERT, UPDATE, or DELETE.
     */
    operation?: DynamoOperation;
    /**
     * The hash key name.
     */
    hashKeyField: HashKeyField;
    /**
     * The hash key value.
     */
    hashKeyValue: HashKeyValue;
    /**
     * The hash key type. Valid values are "STRING" or "NUMBER"
     */
    hashKeyType?: DynamoKeyType;
    /**
     * The range key name.
     */
    rangeKeyField?: RangeKeyField;
    /**
     * The range key value.
     */
    rangeKeyValue?: RangeKeyValue;
    /**
     * The range key type. Valid values are "STRING" or "NUMBER"
     */
    rangeKeyType?: DynamoKeyType;
    /**
     * The action payload. This name can be customized.
     */
    payloadField?: PayloadField;
  }
  export interface DynamoDBv2Action {
    /**
     * The ARN of the IAM role that grants access to the DynamoDB table.
     */
    roleArn: AwsArn;
    /**
     * Specifies the DynamoDB table to which the message data will be written. For example:  { "dynamoDBv2": { "roleArn": "aws:iam:12341251:my-role" "putItem": { "tableName": "my-table" } } }  Each attribute in the message payload will be written to a separate column in the DynamoDB database.
     */
    putItem: PutItemInput;
  }
  export type DynamoKeyType = "STRING"|"NUMBER"|string;
  export type DynamoOperation = string;
  export type EffectivePolicies = EffectivePolicy[];
  export interface EffectivePolicy {
    /**
     * The policy name.
     */
    policyName?: PolicyName;
    /**
     * The policy ARN.
     */
    policyArn?: PolicyArn;
    /**
     * The IAM policy document.
     */
    policyDocument?: PolicyDocument;
  }
  export interface ElasticsearchAction {
    /**
     * The IAM role ARN that has access to OpenSearch.
     */
    roleArn: AwsArn;
    /**
     * The endpoint of your OpenSearch domain.
     */
    endpoint: ElasticsearchEndpoint;
    /**
     * The index where you want to store your data.
     */
    index: ElasticsearchIndex;
    /**
     * The type of document you are storing.
     */
    type: ElasticsearchType;
    /**
     * The unique identifier for the document you are storing.
     */
    id: ElasticsearchId;
  }
  export type ElasticsearchEndpoint = string;
  export type ElasticsearchId = string;
  export type ElasticsearchIndex = string;
  export type ElasticsearchType = string;
  export type EnableCachingForHttp = boolean;
  export interface EnableIoTLoggingParams {
    /**
     * The Amazon Resource Name (ARN) of the IAM role used for logging.
     */
    roleArnForLogging: RoleArn;
    /**
     * Specifies the type of information to be logged.
     */
    logLevel: LogLevel;
  }
  export interface EnableTopicRuleRequest {
    /**
     * The name of the topic rule to enable.
     */
    ruleName: RuleName;
  }
  export type Enabled = boolean;
  export type EnabledBoolean = boolean;
  export type EndpointAddress = string;
  export type EndpointType = string;
  export type Environment = string;
  export type Environments = Environment[];
  export type ErrorCode = string;
  export interface ErrorInfo {
    /**
     * The error code.
     */
    code?: Code;
    /**
     * The error message.
     */
    message?: OTAUpdateErrorMessage;
  }
  export type ErrorMessage = string;
  export type EvaluationStatistic = string;
  export type EventConfigurations = {[key: string]: Configuration};
  export type EventType = "THING"|"THING_GROUP"|"THING_TYPE"|"THING_GROUP_MEMBERSHIP"|"THING_GROUP_HIERARCHY"|"THING_TYPE_ASSOCIATION"|"JOB"|"JOB_EXECUTION"|"POLICY"|"CERTIFICATE"|"CA_CERTIFICATE"|string;
  export type Example = string;
  export type ExecutionNamePrefix = string;
  export type ExecutionNumber = number;
  export type ExpectedVersion = number;
  export type ExpiresInSec = number;
  export type ExpiresInSeconds = number;
  export interface ExplicitDeny {
    /**
     * The policies that denied the authorization.
     */
    policies?: Policies;
  }
  export interface ExponentialRolloutRate {
    /**
     * The minimum number of things that will be notified of a pending job, per minute at the start of job rollout. This parameter allows you to define the initial rate of rollout.
     */
    baseRatePerMinute: RolloutRatePerMinute;
    /**
     * The exponential factor to increase the rate of rollout for a job. Amazon Web Services IoT Core supports up to one digit after the decimal (for example, 1.5, but not 1.55).
     */
    incrementFactor: IncrementFactor;
    /**
     * The criteria to initiate the increase in rate of rollout for a job.
     */
    rateIncreaseCriteria: RateIncreaseCriteria;
  }
  export type FailedChecksCount = number;
  export type FailedFindingsCount = number;
  export type FailedThings = number;
  export interface Field {
    /**
     * The name of the field.
     */
    name?: FieldName;
    /**
     * The data type of the field.
     */
    type?: FieldType;
  }
  export type FieldName = string;
  export type FieldType = "Number"|"String"|"Boolean"|string;
  export type Fields = Field[];
  export type FileId = number;
  export interface FileLocation {
    /**
     * The stream that contains the OTA update.
     */
    stream?: Stream;
    /**
     * The location of the updated firmware in S3.
     */
    s3Location?: S3Location;
  }
  export type FileName = string;
  export type FileType = number;
  export type FindingId = string;
  export type FindingIds = FindingId[];
  export interface FirehoseAction {
    /**
     * The IAM role that grants access to the Amazon Kinesis Firehose stream.
     */
    roleArn: AwsArn;
    /**
     * The delivery stream name.
     */
    deliveryStreamName: DeliveryStreamName;
    /**
     * A character separator that will be used to separate records written to the Firehose stream. Valid values are: '\n' (newline), '\t' (tab), '\r\n' (Windows newline), ',' (comma).
     */
    separator?: FirehoseSeparator;
    /**
     * Whether to deliver the Kinesis Data Firehose stream as a batch by using  PutRecordBatch . The default value is false. When batchMode is true and the rule's SQL statement evaluates to an Array, each Array element forms one record in the  PutRecordBatch  request. The resulting array can't have more than 500 records.
     */
    batchMode?: BatchMode;
  }
  export type FirehoseSeparator = string;
  export type Flag = boolean;
  export type FleetMetricArn = string;
  export type FleetMetricDescription = string;
  export type FleetMetricName = string;
  export interface FleetMetricNameAndArn {
    /**
     * The fleet metric name.
     */
    metricName?: FleetMetricName;
    /**
     * The fleet metric ARN.
     */
    metricArn?: FleetMetricArn;
  }
  export type FleetMetricNameAndArnList = FleetMetricNameAndArn[];
  export type FleetMetricPeriod = number;
  export type FleetMetricUnit = "Seconds"|"Microseconds"|"Milliseconds"|"Bytes"|"Kilobytes"|"Megabytes"|"Gigabytes"|"Terabytes"|"Bits"|"Kilobits"|"Megabits"|"Gigabits"|"Terabits"|"Percent"|"Count"|"Bytes/Second"|"Kilobytes/Second"|"Megabytes/Second"|"Gigabytes/Second"|"Terabytes/Second"|"Bits/Second"|"Kilobits/Second"|"Megabits/Second"|"Gigabits/Second"|"Terabits/Second"|"Count/Second"|"None"|string;
  export type ForceDelete = boolean;
  export type ForceDeleteAWSJob = boolean;
  export type ForceFlag = boolean;
  export type Forced = boolean;
  export type FunctionArn = string;
  export type GenerationId = string;
  export type GenericLongValue = number;
  export interface GetBehaviorModelTrainingSummariesRequest {
    /**
     *  The name of the security profile. 
     */
    securityProfileName?: SecurityProfileName;
    /**
     *  The maximum number of results to return at one time. The default is 10. 
     */
    maxResults?: TinyMaxResults;
    /**
     *  The token for the next set of results. 
     */
    nextToken?: NextToken;
  }
  export interface GetBehaviorModelTrainingSummariesResponse {
    /**
     *  A list of all ML Detect behaviors and their model status for a given Security Profile. 
     */
    summaries?: BehaviorModelTrainingSummaries;
    /**
     *  A token that can be used to retrieve the next set of results, or null if there are no additional results. 
     */
    nextToken?: NextToken;
  }
  export interface GetBucketsAggregationRequest {
    /**
     * The name of the index to search.
     */
    indexName?: IndexName;
    /**
     * The search query string.
     */
    queryString: QueryString;
    /**
     * The aggregation field.
     */
    aggregationField: AggregationField;
    /**
     * The version of the query.
     */
    queryVersion?: QueryVersion;
    /**
     * The basic control of the response shape and the bucket aggregation type to perform. 
     */
    bucketsAggregationType: BucketsAggregationType;
  }
  export interface GetBucketsAggregationResponse {
    /**
     * The total number of things that fit the query string criteria.
     */
    totalCount?: Count;
    /**
     * The main part of the response with a list of buckets. Each bucket contains a keyValue and a count.  keyValue: The aggregation field value counted for the particular bucket.  count: The number of documents that have that value.
     */
    buckets?: Buckets;
  }
  export interface GetCardinalityRequest {
    /**
     * The name of the index to search.
     */
    indexName?: IndexName;
    /**
     * The search query string.
     */
    queryString: QueryString;
    /**
     * The field to aggregate.
     */
    aggregationField?: AggregationField;
    /**
     * The query version.
     */
    queryVersion?: QueryVersion;
  }
  export interface GetCardinalityResponse {
    /**
     * The approximate count of unique values that match the query.
     */
    cardinality?: Count;
  }
  export interface GetEffectivePoliciesRequest {
    /**
     * The principal. Valid principals are CertificateArn (arn:aws:iot:region:accountId:cert/certificateId), thingGroupArn (arn:aws:iot:region:accountId:thinggroup/groupName) and CognitoId (region:id).
     */
    principal?: Principal;
    /**
     * The Cognito identity pool ID.
     */
    cognitoIdentityPoolId?: CognitoIdentityPoolId;
    /**
     * The thing name.
     */
    thingName?: ThingName;
  }
  export interface GetEffectivePoliciesResponse {
    /**
     * The effective policies.
     */
    effectivePolicies?: EffectivePolicies;
  }
  export interface GetIndexingConfigurationRequest {
  }
  export interface GetIndexingConfigurationResponse {
    /**
     * Thing indexing configuration.
     */
    thingIndexingConfiguration?: ThingIndexingConfiguration;
    /**
     * The index configuration.
     */
    thingGroupIndexingConfiguration?: ThingGroupIndexingConfiguration;
  }
  export interface GetJobDocumentRequest {
    /**
     * The unique identifier you assigned to this job when it was created.
     */
    jobId: JobId;
  }
  export interface GetJobDocumentResponse {
    /**
     * The job document content.
     */
    document?: JobDocument;
  }
  export interface GetLoggingOptionsRequest {
  }
  export interface GetLoggingOptionsResponse {
    /**
     * The ARN of the IAM role that grants access.
     */
    roleArn?: AwsArn;
    /**
     * The logging level.
     */
    logLevel?: LogLevel;
  }
  export interface GetOTAUpdateRequest {
    /**
     * The OTA update ID.
     */
    otaUpdateId: OTAUpdateId;
  }
  export interface GetOTAUpdateResponse {
    /**
     * The OTA update info.
     */
    otaUpdateInfo?: OTAUpdateInfo;
  }
  export interface GetPackageConfigurationRequest {
  }
  export interface GetPackageConfigurationResponse {
    /**
     * The version that is associated to a specific job.
     */
    versionUpdateByJobsConfig?: VersionUpdateByJobsConfig;
  }
  export interface GetPackageRequest {
    /**
     * The name of the target software package.
     */
    packageName: PackageName;
  }
  export interface GetPackageResponse {
    /**
     * The name of the software package.
     */
    packageName?: PackageName;
    /**
     * The ARN for the package.
     */
    packageArn?: PackageArn;
    /**
     * The package description.
     */
    description?: ResourceDescription;
    /**
     * The name of the default package version.
     */
    defaultVersionName?: VersionName;
    /**
     * The date the package was created.
     */
    creationDate?: CreationDate;
    /**
     * The date when the package was last updated.
     */
    lastModifiedDate?: LastModifiedDate;
  }
  export interface GetPackageVersionRequest {
    /**
     * The name of the associated package.
     */
    packageName: PackageName;
    /**
     * The name of the target package version.
     */
    versionName: VersionName;
  }
  export interface GetPackageVersionResponse {
    /**
     * The ARN for the package version.
     */
    packageVersionArn?: PackageVersionArn;
    /**
     * The name of the software package.
     */
    packageName?: PackageName;
    /**
     * The name of the package version.
     */
    versionName?: VersionName;
    /**
     * The package version description.
     */
    description?: ResourceDescription;
    /**
     * Metadata that were added to the package version that can be used to define a package version’s configuration.
     */
    attributes?: ResourceAttributes;
    /**
     * The status associated to the package version. For more information, see Package version lifecycle.
     */
    status?: PackageVersionStatus;
    /**
     * Error reason for a package version failure during creation or update.
     */
    errorReason?: PackageVersionErrorReason;
    /**
     * The date when the package version was created.
     */
    creationDate?: CreationDate;
    /**
     * The date when the package version was last updated.
     */
    lastModifiedDate?: LastModifiedDate;
  }
  export interface GetPercentilesRequest {
    /**
     * The name of the index to search.
     */
    indexName?: IndexName;
    /**
     * The search query string.
     */
    queryString: QueryString;
    /**
     * The field to aggregate.
     */
    aggregationField?: AggregationField;
    /**
     * The query version.
     */
    queryVersion?: QueryVersion;
    /**
     * The percentile groups returned.
     */
    percents?: PercentList;
  }
  export interface GetPercentilesResponse {
    /**
     * The percentile values of the aggregated fields.
     */
    percentiles?: Percentiles;
  }
  export interface GetPolicyRequest {
    /**
     * The name of the policy.
     */
    policyName: PolicyName;
  }
  export interface GetPolicyResponse {
    /**
     * The policy name.
     */
    policyName?: PolicyName;
    /**
     * The policy ARN.
     */
    policyArn?: PolicyArn;
    /**
     * The JSON document that describes the policy.
     */
    policyDocument?: PolicyDocument;
    /**
     * The default policy version ID.
     */
    defaultVersionId?: PolicyVersionId;
    /**
     * The date the policy was created.
     */
    creationDate?: DateType;
    /**
     * The date the policy was last modified.
     */
    lastModifiedDate?: DateType;
    /**
     * The generation ID of the policy.
     */
    generationId?: GenerationId;
  }
  export interface GetPolicyVersionRequest {
    /**
     * The name of the policy.
     */
    policyName: PolicyName;
    /**
     * The policy version ID.
     */
    policyVersionId: PolicyVersionId;
  }
  export interface GetPolicyVersionResponse {
    /**
     * The policy ARN.
     */
    policyArn?: PolicyArn;
    /**
     * The policy name.
     */
    policyName?: PolicyName;
    /**
     * The JSON document that describes the policy.
     */
    policyDocument?: PolicyDocument;
    /**
     * The policy version ID.
     */
    policyVersionId?: PolicyVersionId;
    /**
     * Specifies whether the policy version is the default.
     */
    isDefaultVersion?: IsDefaultVersion;
    /**
     * The date the policy was created.
     */
    creationDate?: DateType;
    /**
     * The date the policy was last modified.
     */
    lastModifiedDate?: DateType;
    /**
     * The generation ID of the policy version.
     */
    generationId?: GenerationId;
  }
  export interface GetRegistrationCodeRequest {
  }
  export interface GetRegistrationCodeResponse {
    /**
     * The CA certificate registration code.
     */
    registrationCode?: RegistrationCode;
  }
  export interface GetStatisticsRequest {
    /**
     * The name of the index to search. The default value is AWS_Things.
     */
    indexName?: IndexName;
    /**
     * The query used to search. You can specify "*" for the query string to get the count of all indexed things in your Amazon Web Services account.
     */
    queryString: QueryString;
    /**
     * The aggregation field name.
     */
    aggregationField?: AggregationField;
    /**
     * The version of the query used to search.
     */
    queryVersion?: QueryVersion;
  }
  export interface GetStatisticsResponse {
    /**
     * The statistics returned by the Fleet Indexing service based on the query and aggregation field.
     */
    statistics?: Statistics;
  }
  export interface GetTopicRuleDestinationRequest {
    /**
     * The ARN of the topic rule destination.
     */
    arn: AwsArn;
  }
  export interface GetTopicRuleDestinationResponse {
    /**
     * The topic rule destination.
     */
    topicRuleDestination?: TopicRuleDestination;
  }
  export interface GetTopicRuleRequest {
    /**
     * The name of the rule.
     */
    ruleName: RuleName;
  }
  export interface GetTopicRuleResponse {
    /**
     * The rule ARN.
     */
    ruleArn?: RuleArn;
    /**
     * The rule.
     */
    rule?: TopicRule;
  }
  export interface GetV2LoggingOptionsRequest {
  }
  export interface GetV2LoggingOptionsResponse {
    /**
     * The IAM role ARN IoT uses to write to your CloudWatch logs.
     */
    roleArn?: AwsArn;
    /**
     * The default log level.
     */
    defaultLogLevel?: LogLevel;
    /**
     * Disables all logs.
     */
    disableAllLogs?: DisableAllLogs;
  }
  export interface GroupNameAndArn {
    /**
     * The group name.
     */
    groupName?: ThingGroupName;
    /**
     * The group ARN.
     */
    groupArn?: ThingGroupArn;
  }
  export type HashAlgorithm = string;
  export type HashKeyField = string;
  export type HashKeyValue = string;
  export type HeaderKey = string;
  export type HeaderList = HttpActionHeader[];
  export type HeaderValue = string;
  export interface HttpAction {
    /**
     * The endpoint URL. If substitution templates are used in the URL, you must also specify a confirmationUrl. If this is a new destination, a new TopicRuleDestination is created if possible.
     */
    url: Url;
    /**
     * The URL to which IoT sends a confirmation message. The value of the confirmation URL must be a prefix of the endpoint URL. If you do not specify a confirmation URL IoT uses the endpoint URL as the confirmation URL. If you use substitution templates in the confirmationUrl, you must create and enable topic rule destinations that match each possible value of the substitution template before traffic is allowed to your endpoint URL.
     */
    confirmationUrl?: Url;
    /**
     * The HTTP headers to send with the message data.
     */
    headers?: HeaderList;
    /**
     * The authentication method to use when sending data to an HTTPS endpoint.
     */
    auth?: HttpAuthorization;
  }
  export interface HttpActionHeader {
    /**
     * The HTTP header key.
     */
    key: HeaderKey;
    /**
     * The HTTP header value. Substitution templates are supported.
     */
    value: HeaderValue;
  }
  export interface HttpAuthorization {
    /**
     * Use Sig V4 authorization. For more information, see Signature Version 4 Signing Process.
     */
    sigv4?: SigV4Authorization;
  }
  export interface HttpContext {
    /**
     * The header keys and values in an HTTP authorization request.
     */
    headers?: HttpHeaders;
    /**
     * The query string keys and values in an HTTP authorization request.
     */
    queryString?: HttpQueryString;
  }
  export type HttpHeaderName = string;
  export type HttpHeaderValue = string;
  export type HttpHeaders = {[key: string]: HttpHeaderValue};
  export type HttpQueryString = string;
  export interface HttpUrlDestinationConfiguration {
    /**
     * The URL IoT uses to confirm ownership of or access to the topic rule destination URL.
     */
    confirmationUrl: Url;
  }
  export interface HttpUrlDestinationProperties {
    /**
     * The URL used to confirm the HTTP topic rule destination URL.
     */
    confirmationUrl?: Url;
  }
  export interface HttpUrlDestinationSummary {
    /**
     * The URL used to confirm ownership of or access to the HTTP topic rule destination URL.
     */
    confirmationUrl?: Url;
  }
  export interface ImplicitDeny {
    /**
     * Policies that don't contain a matching allow or deny statement for the specified action on the specified resource. 
     */
    policies?: Policies;
  }
  export type InProgressChecksCount = number;
  export type InProgressThings = number;
  export type InProgressTimeoutInMinutes = number;
  export type IncrementFactor = number;
  export type IndexName = string;
  export type IndexNamesList = IndexName[];
  export type IndexSchema = string;
  export type IndexStatus = "ACTIVE"|"BUILDING"|"REBUILDING"|string;
  export interface IndexingFilter {
    /**
     * The shadow names that you select to index. The default maximum number of shadow names for indexing is 10. To increase the limit, see Amazon Web Services IoT Device Management Quotas in the Amazon Web Services General Reference. 
     */
    namedShadowNames?: NamedShadowNamesFilter;
  }
  export type InlineDocument = string;
  export type InputName = string;
  export interface IotAnalyticsAction {
    /**
     * (deprecated) The ARN of the IoT Analytics channel to which message data will be sent.
     */
    channelArn?: AwsArn;
    /**
     * The name of the IoT Analytics channel to which message data will be sent.
     */
    channelName?: ChannelName;
    /**
     * Whether to process the action as a batch. The default value is false. When batchMode is true and the rule SQL statement evaluates to an Array, each Array element is delivered as a separate message when passed by  BatchPutMessage  to the IoT Analytics channel. The resulting array can't have more than 100 messages.
     */
    batchMode?: BatchMode;
    /**
     * The ARN of the role which has a policy that grants IoT Analytics permission to send message data via IoT Analytics (iotanalytics:BatchPutMessage).
     */
    roleArn?: AwsArn;
  }
  export interface IotEventsAction {
    /**
     * The name of the IoT Events input.
     */
    inputName: InputName;
    /**
     * The ID of the message. The default messageId is a new UUID value. When batchMode is true, you can't specify a messageId--a new UUID value will be assigned. Assign a value to this property to ensure that only one input (message) with a given messageId will be processed by an IoT Events detector.
     */
    messageId?: MessageId;
    /**
     * Whether to process the event actions as a batch. The default value is false. When batchMode is true, you can't specify a messageId.  When batchMode is true and the rule SQL statement evaluates to an Array, each Array element is treated as a separate message when it's sent to IoT Events by calling  BatchPutMessage . The resulting array can't have more than 10 messages.
     */
    batchMode?: BatchMode;
    /**
     * The ARN of the role that grants IoT permission to send an input to an IoT Events detector. ("Action":"iotevents:BatchPutMessage").
     */
    roleArn: AwsArn;
  }
  export interface IotSiteWiseAction {
    /**
     * A list of asset property value entries.
     */
    putAssetPropertyValueEntries: PutAssetPropertyValueEntryList;
    /**
     * The ARN of the role that grants IoT permission to send an asset property value to IoT SiteWise. ("Action": "iotsitewise:BatchPutAssetPropertyValue"). The trust policy can restrict access to specific asset hierarchy paths.
     */
    roleArn: AwsArn;
  }
  export type IsAuthenticated = boolean;
  export type IsDefaultVersion = boolean;
  export type IsDisabled = boolean;
  export type IsSuppressed = boolean;
  export interface IssuerCertificateIdentifier {
    /**
     * The subject of the issuer certificate.
     */
    issuerCertificateSubject?: IssuerCertificateSubject;
    /**
     * The issuer ID.
     */
    issuerId?: IssuerId;
    /**
     * The issuer certificate serial number.
     */
    issuerCertificateSerialNumber?: IssuerCertificateSerialNumber;
  }
  export type IssuerCertificateSerialNumber = string;
  export type IssuerCertificateSubject = string;
  export type IssuerId = string;
  export interface Job {
    /**
     * An ARN identifying the job with format "arn:aws:iot:region:account:job/jobId".
     */
    jobArn?: JobArn;
    /**
     * The unique identifier you assigned to this job when it was created.
     */
    jobId?: JobId;
    /**
     * Specifies whether the job will continue to run (CONTINUOUS), or will be complete after all those things specified as targets have completed the job (SNAPSHOT). If continuous, the job may also be run on a thing when a change is detected in a target. For example, a job will run on a device when the thing representing the device is added to a target group, even after the job was completed by all things originally in the group.   We recommend that you use continuous jobs instead of snapshot jobs for dynamic thing group targets. By using continuous jobs, devices that join the group receive the job execution even after the job has been created. 
     */
    targetSelection?: TargetSelection;
    /**
     * The status of the job, one of IN_PROGRESS, CANCELED, DELETION_IN_PROGRESS or COMPLETED. 
     */
    status?: JobStatus;
    /**
     * Will be true if the job was canceled with the optional force parameter set to true.
     */
    forceCanceled?: Forced;
    /**
     * If the job was updated, provides the reason code for the update.
     */
    reasonCode?: ReasonCode;
    /**
     * If the job was updated, describes the reason for the update.
     */
    comment?: Comment;
    /**
     * A list of IoT things and thing groups to which the job should be sent.
     */
    targets?: JobTargets;
    /**
     * A short text description of the job.
     */
    description?: JobDescription;
    /**
     * Configuration for pre-signed S3 URLs.
     */
    presignedUrlConfig?: PresignedUrlConfig;
    /**
     * Allows you to create a staged rollout of a job.
     */
    jobExecutionsRolloutConfig?: JobExecutionsRolloutConfig;
    /**
     * Configuration for criteria to abort the job.
     */
    abortConfig?: AbortConfig;
    /**
     * The time, in seconds since the epoch, when the job was created.
     */
    createdAt?: DateType;
    /**
     * The time, in seconds since the epoch, when the job was last updated.
     */
    lastUpdatedAt?: DateType;
    /**
     * The time, in seconds since the epoch, when the job was completed.
     */
    completedAt?: DateType;
    /**
     * Details about the job process.
     */
    jobProcessDetails?: JobProcessDetails;
    /**
     * Specifies the amount of time each device has to finish its execution of the job. A timer is started when the job execution status is set to IN_PROGRESS. If the job execution status is not set to another terminal state before the timer expires, it will be automatically set to TIMED_OUT.
     */
    timeoutConfig?: TimeoutConfig;
    /**
     * The namespace used to indicate that a job is a customer-managed job. When you specify a value for this parameter, Amazon Web Services IoT Core sends jobs notifications to MQTT topics that contain the value in the following format.  $aws/things/THING_NAME/jobs/JOB_ID/notify-namespace-NAMESPACE_ID/   The namespaceId feature is in public preview. 
     */
    namespaceId?: NamespaceId;
    /**
     * The ARN of the job template used to create the job.
     */
    jobTemplateArn?: JobTemplateArn;
    /**
     * The configuration for the criteria to retry the job.
     */
    jobExecutionsRetryConfig?: JobExecutionsRetryConfig;
    /**
     * A key-value map that pairs the patterns that need to be replaced in a managed template job document schema. You can use the description of each key as a guidance to specify the inputs during runtime when creating a job.   documentParameters can only be used when creating jobs from Amazon Web Services managed templates. This parameter can't be used with custom job templates or to create jobs from them. 
     */
    documentParameters?: ParameterMap;
    /**
     * Indicates whether a job is concurrent. Will be true when a job is rolling out new job executions or canceling previously created executions, otherwise false.
     */
    isConcurrent?: BooleanWrapperObject;
    /**
     * The configuration that allows you to schedule a job for a future date and time in addition to specifying the end behavior for each job execution.
     */
    schedulingConfig?: SchedulingConfig;
    /**
     * Displays the next seven maintenance window occurrences and their start times.
     */
    scheduledJobRollouts?: ScheduledJobRolloutList;
    /**
     * The package version Amazon Resource Names (ARNs) that are installed on the device when the job successfully completes.   Note:The following Length Constraints relates to a single string. Up to five strings are allowed.
     */
    destinationPackageVersions?: DestinationPackageVersions;
  }
  export type JobArn = string;
  export type JobDescription = string;
  export type JobDocument = string;
  export type JobDocumentSource = string;
  export type JobEndBehavior = "STOP_ROLLOUT"|"CANCEL"|"FORCE_CANCEL"|string;
  export interface JobExecution {
    /**
     * The unique identifier you assigned to the job when it was created.
     */
    jobId?: JobId;
    /**
     * The status of the job execution (IN_PROGRESS, QUEUED, FAILED, SUCCEEDED, TIMED_OUT, CANCELED, or REJECTED).
     */
    status?: JobExecutionStatus;
    /**
     * Will be true if the job execution was canceled with the optional force parameter set to true.
     */
    forceCanceled?: Forced;
    /**
     * A collection of name/value pairs that describe the status of the job execution.
     */
    statusDetails?: JobExecutionStatusDetails;
    /**
     * The ARN of the thing on which the job execution is running.
     */
    thingArn?: ThingArn;
    /**
     * The time, in seconds since the epoch, when the job execution was queued.
     */
    queuedAt?: DateType;
    /**
     * The time, in seconds since the epoch, when the job execution started.
     */
    startedAt?: DateType;
    /**
     * The time, in seconds since the epoch, when the job execution was last updated.
     */
    lastUpdatedAt?: DateType;
    /**
     * A string (consisting of the digits "0" through "9") which identifies this particular job execution on this particular device. It can be used in commands which return or update job execution information. 
     */
    executionNumber?: ExecutionNumber;
    /**
     * The version of the job execution. Job execution versions are incremented each time they are updated by a device.
     */
    versionNumber?: VersionNumber;
    /**
     * The estimated number of seconds that remain before the job execution status will be changed to TIMED_OUT. The timeout interval can be anywhere between 1 minute and 7 days (1 to 10080 minutes). The actual job execution timeout can occur up to 60 seconds later than the estimated duration. This value will not be included if the job execution has reached a terminal status.
     */
    approximateSecondsBeforeTimedOut?: ApproximateSecondsBeforeTimedOut;
  }
  export type JobExecutionFailureType = "FAILED"|"REJECTED"|"TIMED_OUT"|"ALL"|string;
  export type JobExecutionStatus = "QUEUED"|"IN_PROGRESS"|"SUCCEEDED"|"FAILED"|"TIMED_OUT"|"REJECTED"|"REMOVED"|"CANCELED"|string;
  export interface JobExecutionStatusDetails {
    /**
     * The job execution status.
     */
    detailsMap?: DetailsMap;
  }
  export interface JobExecutionSummary {
    /**
     * The status of the job execution.
     */
    status?: JobExecutionStatus;
    /**
     * The time, in seconds since the epoch, when the job execution was queued.
     */
    queuedAt?: DateType;
    /**
     * The time, in seconds since the epoch, when the job execution started.
     */
    startedAt?: DateType;
    /**
     * The time, in seconds since the epoch, when the job execution was last updated.
     */
    lastUpdatedAt?: DateType;
    /**
     * A string (consisting of the digits "0" through "9") which identifies this particular job execution on this particular device. It can be used later in commands which return or update job execution information.
     */
    executionNumber?: ExecutionNumber;
    /**
     * The number that indicates how many retry attempts have been completed for this job on this device.
     */
    retryAttempt?: RetryAttempt;
  }
  export interface JobExecutionSummaryForJob {
    /**
     * The ARN of the thing on which the job execution is running.
     */
    thingArn?: ThingArn;
    /**
     * Contains a subset of information about a job execution.
     */
    jobExecutionSummary?: JobExecutionSummary;
  }
  export type JobExecutionSummaryForJobList = JobExecutionSummaryForJob[];
  export interface JobExecutionSummaryForThing {
    /**
     * The unique identifier you assigned to this job when it was created.
     */
    jobId?: JobId;
    /**
     * Contains a subset of information about a job execution.
     */
    jobExecutionSummary?: JobExecutionSummary;
  }
  export type JobExecutionSummaryForThingList = JobExecutionSummaryForThing[];
  export interface JobExecutionsRetryConfig {
    /**
     * The list of criteria that determines how many retries are allowed for each failure type for a job.
     */
    criteriaList: RetryCriteriaList;
  }
  export interface JobExecutionsRolloutConfig {
    /**
     * The maximum number of things that will be notified of a pending job, per minute. This parameter allows you to create a staged rollout.
     */
    maximumPerMinute?: MaxJobExecutionsPerMin;
    /**
     * The rate of increase for a job rollout. This parameter allows you to define an exponential rate for a job rollout.
     */
    exponentialRate?: ExponentialRolloutRate;
  }
  export type JobId = string;
  export interface JobProcessDetails {
    /**
     * The target devices to which the job execution is being rolled out. This value will be null after the job execution has finished rolling out to all the target devices.
     */
    processingTargets?: ProcessingTargetNameList;
    /**
     * The number of things that cancelled the job.
     */
    numberOfCanceledThings?: CanceledThings;
    /**
     * The number of things which successfully completed the job.
     */
    numberOfSucceededThings?: SucceededThings;
    /**
     * The number of things that failed executing the job.
     */
    numberOfFailedThings?: FailedThings;
    /**
     * The number of things that rejected the job.
     */
    numberOfRejectedThings?: RejectedThings;
    /**
     * The number of things that are awaiting execution of the job.
     */
    numberOfQueuedThings?: QueuedThings;
    /**
     * The number of things currently executing the job.
     */
    numberOfInProgressThings?: InProgressThings;
    /**
     * The number of things that are no longer scheduled to execute the job because they have been deleted or have been removed from the group that was a target of the job.
     */
    numberOfRemovedThings?: RemovedThings;
    /**
     * The number of things whose job execution status is TIMED_OUT.
     */
    numberOfTimedOutThings?: TimedOutThings;
  }
  export type JobStatus = "IN_PROGRESS"|"CANCELED"|"COMPLETED"|"DELETION_IN_PROGRESS"|"SCHEDULED"|string;
  export interface JobSummary {
    /**
     * The job ARN.
     */
    jobArn?: JobArn;
    /**
     * The unique identifier you assigned to this job when it was created.
     */
    jobId?: JobId;
    /**
     * The ID of the thing group.
     */
    thingGroupId?: ThingGroupId;
    /**
     * Specifies whether the job will continue to run (CONTINUOUS), or will be complete after all those things specified as targets have completed the job (SNAPSHOT). If continuous, the job may also be run on a thing when a change is detected in a target. For example, a job will run on a thing when the thing is added to a target group, even after the job was completed by all things originally in the group.  We recommend that you use continuous jobs instead of snapshot jobs for dynamic thing group targets. By using continuous jobs, devices that join the group receive the job execution even after the job has been created. 
     */
    targetSelection?: TargetSelection;
    /**
     * The job summary status.
     */
    status?: JobStatus;
    /**
     * The time, in seconds since the epoch, when the job was created.
     */
    createdAt?: DateType;
    /**
     * The time, in seconds since the epoch, when the job was last updated.
     */
    lastUpdatedAt?: DateType;
    /**
     * The time, in seconds since the epoch, when the job completed.
     */
    completedAt?: DateType;
    /**
     * Indicates whether a job is concurrent. Will be true when a job is rolling out new job executions or canceling previously created executions, otherwise false.
     */
    isConcurrent?: BooleanWrapperObject;
  }
  export type JobSummaryList = JobSummary[];
  export type JobTargets = TargetArn[];
  export type JobTemplateArn = string;
  export type JobTemplateId = string;
  export interface JobTemplateSummary {
    /**
     * The ARN of the job template.
     */
    jobTemplateArn?: JobTemplateArn;
    /**
     * The unique identifier of the job template.
     */
    jobTemplateId?: JobTemplateId;
    /**
     * A description of the job template.
     */
    description?: JobDescription;
    /**
     * The time, in seconds since the epoch, when the job template was created.
     */
    createdAt?: DateType;
  }
  export type JobTemplateSummaryList = JobTemplateSummary[];
  export type JsonDocument = string;
  export interface KafkaAction {
    /**
     * The ARN of Kafka action's VPC TopicRuleDestination.
     */
    destinationArn: AwsArn;
    /**
     * The Kafka topic for messages to be sent to the Kafka broker.
     */
    topic: String;
    /**
     * The Kafka message key.
     */
    key?: String;
    /**
     * The Kafka message partition.
     */
    partition?: String;
    /**
     * Properties of the Apache Kafka producer client.
     */
    clientProperties: ClientProperties;
    /**
     * The list of Kafka headers that you specify.
     */
    headers?: KafkaHeaders;
  }
  export interface KafkaActionHeader {
    /**
     * The key of the Kafka header.
     */
    key: KafkaHeaderKey;
    /**
     * The value of the Kafka header.
     */
    value: KafkaHeaderValue;
  }
  export type KafkaHeaderKey = string;
  export type KafkaHeaderValue = string;
  export type KafkaHeaders = KafkaActionHeader[];
  export type Key = string;
  export type KeyName = string;
  export interface KeyPair {
    /**
     * The public key.
     */
    PublicKey?: PublicKey;
    /**
     * The private key.
     */
    PrivateKey?: PrivateKey;
  }
  export type KeyValue = string;
  export interface KinesisAction {
    /**
     * The ARN of the IAM role that grants access to the Amazon Kinesis stream.
     */
    roleArn: AwsArn;
    /**
     * The name of the Amazon Kinesis stream.
     */
    streamName: StreamName;
    /**
     * The partition key.
     */
    partitionKey?: PartitionKey;
  }
  export interface LambdaAction {
    /**
     * The ARN of the Lambda function.
     */
    functionArn: FunctionArn;
  }
  export type LaserMaxResults = number;
  export type LastModifiedDate = Date;
  export type LastUpdatedAtDate = Date;
  export interface ListActiveViolationsRequest {
    /**
     * The name of the thing whose active violations are listed.
     */
    thingName?: DeviceDefenderThingName;
    /**
     * The name of the Device Defender security profile for which violations are listed.
     */
    securityProfileName?: SecurityProfileName;
    /**
     *  The criteria for a behavior. 
     */
    behaviorCriteriaType?: BehaviorCriteriaType;
    /**
     *  A list of all suppressed alerts. 
     */
    listSuppressedAlerts?: ListSuppressedAlerts;
    /**
     * The verification state of the violation (detect alarm).
     */
    verificationState?: VerificationState;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: MaxResults;
  }
  export interface ListActiveViolationsResponse {
    /**
     * The list of active violations.
     */
    activeViolations?: ActiveViolations;
    /**
     * A token that can be used to retrieve the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListAttachedPoliciesRequest {
    /**
     * The group or principal for which the policies will be listed. Valid principals are CertificateArn (arn:aws:iot:region:accountId:cert/certificateId), thingGroupArn (arn:aws:iot:region:accountId:thinggroup/groupName) and CognitoId (region:id).
     */
    target: PolicyTarget;
    /**
     * When true, recursively list attached policies.
     */
    recursive?: Recursive;
    /**
     * The token to retrieve the next set of results.
     */
    marker?: Marker;
    /**
     * The maximum number of results to be returned per request.
     */
    pageSize?: PageSize;
  }
  export interface ListAttachedPoliciesResponse {
    /**
     * The policies.
     */
    policies?: Policies;
    /**
     * The token to retrieve the next set of results, or ``null`` if there are no more results.
     */
    nextMarker?: Marker;
  }
  export interface ListAuditFindingsRequest {
    /**
     * A filter to limit results to the audit with the specified ID. You must specify either the taskId or the startTime and endTime, but not both.
     */
    taskId?: AuditTaskId;
    /**
     * A filter to limit results to the findings for the specified audit check.
     */
    checkName?: AuditCheckName;
    /**
     * Information identifying the noncompliant resource.
     */
    resourceIdentifier?: ResourceIdentifier;
    /**
     * The maximum number of results to return at one time. The default is 25.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * A filter to limit results to those found after the specified time. You must specify either the startTime and endTime or the taskId, but not both.
     */
    startTime?: Timestamp;
    /**
     * A filter to limit results to those found before the specified time. You must specify either the startTime and endTime or the taskId, but not both.
     */
    endTime?: Timestamp;
    /**
     *  Boolean flag indicating whether only the suppressed findings or the unsuppressed findings should be listed. If this parameter isn't provided, the response will list both suppressed and unsuppressed findings. 
     */
    listSuppressedFindings?: ListSuppressedFindings;
  }
  export interface ListAuditFindingsResponse {
    /**
     * The findings (results) of the audit.
     */
    findings?: AuditFindings;
    /**
     * A token that can be used to retrieve the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListAuditMitigationActionsExecutionsRequest {
    /**
     * Specify this filter to limit results to actions for a specific audit mitigation actions task.
     */
    taskId: MitigationActionsTaskId;
    /**
     * Specify this filter to limit results to those with a specific status.
     */
    actionStatus?: AuditMitigationActionsExecutionStatus;
    /**
     * Specify this filter to limit results to those that were applied to a specific audit finding.
     */
    findingId: FindingId;
    /**
     * The maximum number of results to return at one time. The default is 25.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAuditMitigationActionsExecutionsResponse {
    /**
     * A set of task execution results based on the input parameters. Details include the mitigation action applied, start time, and task status.
     */
    actionsExecutions?: AuditMitigationActionExecutionMetadataList;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAuditMitigationActionsTasksRequest {
    /**
     * Specify this filter to limit results to tasks that were applied to results for a specific audit.
     */
    auditTaskId?: AuditTaskId;
    /**
     * Specify this filter to limit results to tasks that were applied to a specific audit finding.
     */
    findingId?: FindingId;
    /**
     * Specify this filter to limit results to tasks that are in a specific state.
     */
    taskStatus?: AuditMitigationActionsTaskStatus;
    /**
     * The maximum number of results to return at one time. The default is 25.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * Specify this filter to limit results to tasks that began on or after a specific date and time.
     */
    startTime: Timestamp;
    /**
     * Specify this filter to limit results to tasks that were completed or canceled on or before a specific date and time.
     */
    endTime: Timestamp;
  }
  export interface ListAuditMitigationActionsTasksResponse {
    /**
     * The collection of audit mitigation tasks that matched the filter criteria.
     */
    tasks?: AuditMitigationActionsTaskMetadataList;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAuditSuppressionsRequest {
    checkName?: AuditCheckName;
    resourceIdentifier?: ResourceIdentifier;
    /**
     *  Determines whether suppressions are listed in ascending order by expiration date or not. If parameter isn't provided, ascendingOrder=true. 
     */
    ascendingOrder?: AscendingOrder;
    /**
     *  The token for the next set of results. 
     */
    nextToken?: NextToken;
    /**
     *  The maximum number of results to return at one time. The default is 25. 
     */
    maxResults?: MaxResults;
  }
  export interface ListAuditSuppressionsResponse {
    /**
     *  List of audit suppressions. 
     */
    suppressions?: AuditSuppressionList;
    /**
     *  A token that can be used to retrieve the next set of results, or null if there are no additional results. 
     */
    nextToken?: NextToken;
  }
  export interface ListAuditTasksRequest {
    /**
     * The beginning of the time period. Audit information is retained for a limited time (90 days). Requesting a start time prior to what is retained results in an "InvalidRequestException".
     */
    startTime: Timestamp;
    /**
     * The end of the time period.
     */
    endTime: Timestamp;
    /**
     * A filter to limit the output to the specified type of audit: can be one of "ON_DEMAND_AUDIT_TASK" or "SCHEDULED__AUDIT_TASK".
     */
    taskType?: AuditTaskType;
    /**
     * A filter to limit the output to audits with the specified completion status: can be one of "IN_PROGRESS", "COMPLETED", "FAILED", or "CANCELED".
     */
    taskStatus?: AuditTaskStatus;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time. The default is 25.
     */
    maxResults?: MaxResults;
  }
  export interface ListAuditTasksResponse {
    /**
     * The audits that were performed during the specified time period.
     */
    tasks?: AuditTaskMetadataList;
    /**
     * A token that can be used to retrieve the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListAuthorizersRequest {
    /**
     * The maximum number of results to return at one time.
     */
    pageSize?: PageSize;
    /**
     * A marker used to get the next set of results.
     */
    marker?: Marker;
    /**
     * Return the list of authorizers in ascending alphabetical order.
     */
    ascendingOrder?: AscendingOrder;
    /**
     * The status of the list authorizers request.
     */
    status?: AuthorizerStatus;
  }
  export interface ListAuthorizersResponse {
    /**
     * The authorizers.
     */
    authorizers?: Authorizers;
    /**
     * A marker used to get the next set of results.
     */
    nextMarker?: Marker;
  }
  export interface ListBillingGroupsRequest {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return per request.
     */
    maxResults?: RegistryMaxResults;
    /**
     * Limit the results to billing groups whose names have the given prefix.
     */
    namePrefixFilter?: BillingGroupName;
  }
  export interface ListBillingGroupsResponse {
    /**
     * The list of billing groups.
     */
    billingGroups?: BillingGroupNameAndArnList;
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListCACertificatesRequest {
    /**
     * The result page size.
     */
    pageSize?: PageSize;
    /**
     * The marker for the next set of results.
     */
    marker?: Marker;
    /**
     * Determines the order of the results.
     */
    ascendingOrder?: AscendingOrder;
    /**
     * The name of the provisioning template.
     */
    templateName?: TemplateName;
  }
  export interface ListCACertificatesResponse {
    /**
     * The CA certificates registered in your Amazon Web Services account.
     */
    certificates?: CACertificates;
    /**
     * The current position within the list of CA certificates.
     */
    nextMarker?: Marker;
  }
  export interface ListCertificatesByCARequest {
    /**
     * The ID of the CA certificate. This operation will list all registered device certificate that were signed by this CA certificate.
     */
    caCertificateId: CertificateId;
    /**
     * The result page size.
     */
    pageSize?: PageSize;
    /**
     * The marker for the next set of results.
     */
    marker?: Marker;
    /**
     * Specifies the order for results. If True, the results are returned in ascending order, based on the creation date.
     */
    ascendingOrder?: AscendingOrder;
  }
  export interface ListCertificatesByCAResponse {
    /**
     * The device certificates signed by the specified CA certificate.
     */
    certificates?: Certificates;
    /**
     * The marker for the next set of results, or null if there are no additional results.
     */
    nextMarker?: Marker;
  }
  export interface ListCertificatesRequest {
    /**
     * The result page size.
     */
    pageSize?: PageSize;
    /**
     * The marker for the next set of results.
     */
    marker?: Marker;
    /**
     * Specifies the order for results. If True, the results are returned in ascending order, based on the creation date.
     */
    ascendingOrder?: AscendingOrder;
  }
  export interface ListCertificatesResponse {
    /**
     * The descriptions of the certificates.
     */
    certificates?: Certificates;
    /**
     * The marker for the next set of results, or null if there are no additional results.
     */
    nextMarker?: Marker;
  }
  export interface ListCustomMetricsRequest {
    /**
     *  The token for the next set of results. 
     */
    nextToken?: NextToken;
    /**
     *  The maximum number of results to return at one time. The default is 25. 
     */
    maxResults?: MaxResults;
  }
  export interface ListCustomMetricsResponse {
    /**
     *  The name of the custom metric. 
     */
    metricNames?: MetricNames;
    /**
     *  A token that can be used to retrieve the next set of results, or null if there are no additional results. 
     */
    nextToken?: NextToken;
  }
  export interface ListDetectMitigationActionsExecutionsRequest {
    /**
     *  The unique identifier of the task. 
     */
    taskId?: MitigationActionsTaskId;
    /**
     *  The unique identifier of the violation. 
     */
    violationId?: ViolationId;
    /**
     *  The name of the thing whose mitigation actions are listed. 
     */
    thingName?: DeviceDefenderThingName;
    /**
     *  A filter to limit results to those found after the specified time. You must specify either the startTime and endTime or the taskId, but not both. 
     */
    startTime?: Timestamp;
    /**
     *  The end of the time period for which ML Detect mitigation actions executions are returned. 
     */
    endTime?: Timestamp;
    /**
     *  The maximum number of results to return at one time. The default is 25. 
     */
    maxResults?: MaxResults;
    /**
     *  The token for the next set of results. 
     */
    nextToken?: NextToken;
  }
  export interface ListDetectMitigationActionsExecutionsResponse {
    /**
     *  List of actions executions. 
     */
    actionsExecutions?: DetectMitigationActionExecutionList;
    /**
     *  A token that can be used to retrieve the next set of results, or null if there are no additional results. 
     */
    nextToken?: NextToken;
  }
  export interface ListDetectMitigationActionsTasksRequest {
    /**
     * The maximum number of results to return at one time. The default is 25.
     */
    maxResults?: MaxResults;
    /**
     *  The token for the next set of results. 
     */
    nextToken?: NextToken;
    /**
     *  A filter to limit results to those found after the specified time. You must specify either the startTime and endTime or the taskId, but not both. 
     */
    startTime: Timestamp;
    /**
     *  The end of the time period for which ML Detect mitigation actions tasks are returned. 
     */
    endTime: Timestamp;
  }
  export interface ListDetectMitigationActionsTasksResponse {
    /**
     *  The collection of ML Detect mitigation tasks that matched the filter criteria. 
     */
    tasks?: DetectMitigationActionsTaskSummaryList;
    /**
     *  A token that can be used to retrieve the next set of results, or null if there are no additional results. 
     */
    nextToken?: NextToken;
  }
  export interface ListDimensionsRequest {
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to retrieve at one time.
     */
    maxResults?: MaxResults;
  }
  export interface ListDimensionsResponse {
    /**
     * A list of the names of the defined dimensions. Use DescribeDimension to get details for a dimension.
     */
    dimensionNames?: DimensionNames;
    /**
     * A token that can be used to retrieve the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListDomainConfigurationsRequest {
    /**
     * The marker for the next set of results.
     */
    marker?: Marker;
    /**
     * The result page size.
     */
    pageSize?: PageSize;
    /**
     * The type of service delivered by the endpoint.
     */
    serviceType?: ServiceType;
  }
  export interface ListDomainConfigurationsResponse {
    /**
     * A list of objects that contain summary information about the user's domain configurations.
     */
    domainConfigurations?: DomainConfigurations;
    /**
     * The marker for the next set of results.
     */
    nextMarker?: Marker;
  }
  export interface ListFleetMetricsRequest {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in this operation.
     */
    maxResults?: MaxResults;
  }
  export interface ListFleetMetricsResponse {
    /**
     * The list of fleet metrics objects.
     */
    fleetMetrics?: FleetMetricNameAndArnList;
    /**
     * The token for the next set of results. Will not be returned if the operation has returned all results.
     */
    nextToken?: NextToken;
  }
  export interface ListIndicesRequest {
    /**
     * The token used to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: QueryMaxResults;
  }
  export interface ListIndicesResponse {
    /**
     * The index names.
     */
    indexNames?: IndexNamesList;
    /**
     * The token used to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListJobExecutionsForJobRequest {
    /**
     * The unique identifier you assigned to this job when it was created.
     */
    jobId: JobId;
    /**
     * The status of the job.
     */
    status?: JobExecutionStatus;
    /**
     * The maximum number of results to be returned per request.
     */
    maxResults?: LaserMaxResults;
    /**
     * The token to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListJobExecutionsForJobResponse {
    /**
     * A list of job execution summaries.
     */
    executionSummaries?: JobExecutionSummaryForJobList;
    /**
     * The token for the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListJobExecutionsForThingRequest {
    /**
     * The thing name.
     */
    thingName: ThingName;
    /**
     * An optional filter that lets you search for jobs that have the specified status.
     */
    status?: JobExecutionStatus;
    /**
     * The namespace used to indicate that a job is a customer-managed job. When you specify a value for this parameter, Amazon Web Services IoT Core sends jobs notifications to MQTT topics that contain the value in the following format.  $aws/things/THING_NAME/jobs/JOB_ID/notify-namespace-NAMESPACE_ID/   The namespaceId feature is in public preview. 
     */
    namespaceId?: NamespaceId;
    /**
     * The maximum number of results to be returned per request.
     */
    maxResults?: LaserMaxResults;
    /**
     * The token to retrieve the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The unique identifier you assigned to this job when it was created.
     */
    jobId?: JobId;
  }
  export interface ListJobExecutionsForThingResponse {
    /**
     * A list of job execution summaries.
     */
    executionSummaries?: JobExecutionSummaryForThingList;
    /**
     * The token for the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListJobTemplatesRequest {
    /**
     * The maximum number of results to return in the list.
     */
    maxResults?: LaserMaxResults;
    /**
     * The token to use to return the next set of results in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListJobTemplatesResponse {
    /**
     * A list of objects that contain information about the job templates.
     */
    jobTemplates?: JobTemplateSummaryList;
    /**
     * The token for the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListJobsRequest {
    /**
     * An optional filter that lets you search for jobs that have the specified status.
     */
    status?: JobStatus;
    /**
     * Specifies whether the job will continue to run (CONTINUOUS), or will be complete after all those things specified as targets have completed the job (SNAPSHOT). If continuous, the job may also be run on a thing when a change is detected in a target. For example, a job will run on a thing when the thing is added to a target group, even after the job was completed by all things originally in the group.   We recommend that you use continuous jobs instead of snapshot jobs for dynamic thing group targets. By using continuous jobs, devices that join the group receive the job execution even after the job has been created. 
     */
    targetSelection?: TargetSelection;
    /**
     * The maximum number of results to return per request.
     */
    maxResults?: LaserMaxResults;
    /**
     * The token to retrieve the next set of results.
     */
    nextToken?: NextToken;
    /**
     * A filter that limits the returned jobs to those for the specified group.
     */
    thingGroupName?: ThingGroupName;
    /**
     * A filter that limits the returned jobs to those for the specified group.
     */
    thingGroupId?: ThingGroupId;
    /**
     * The namespace used to indicate that a job is a customer-managed job. When you specify a value for this parameter, Amazon Web Services IoT Core sends jobs notifications to MQTT topics that contain the value in the following format.  $aws/things/THING_NAME/jobs/JOB_ID/notify-namespace-NAMESPACE_ID/   The namespaceId feature is in public preview. 
     */
    namespaceId?: NamespaceId;
  }
  export interface ListJobsResponse {
    /**
     * A list of jobs.
     */
    jobs?: JobSummaryList;
    /**
     * The token for the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListManagedJobTemplatesRequest {
    /**
     * An optional parameter for template name. If specified, only the versions of the managed job templates that have the specified template name will be returned.
     */
    templateName?: ManagedJobTemplateName;
    /**
     * Maximum number of entries that can be returned.
     */
    maxResults?: LaserMaxResults;
    /**
     * The token to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListManagedJobTemplatesResponse {
    /**
     * A list of managed job templates that are returned.
     */
    managedJobTemplates?: ManagedJobTemplatesSummaryList;
    /**
     * The token to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListMetricValuesRequest {
    /**
     * The name of the thing for which security profile metric values are returned.
     */
    thingName: DeviceDefenderThingName;
    /**
     * The name of the security profile metric for which values are returned.
     */
    metricName: BehaviorMetric;
    /**
     * The dimension name.
     */
    dimensionName?: DimensionName;
    /**
     * The dimension value operator.
     */
    dimensionValueOperator?: DimensionValueOperator;
    /**
     * The start of the time period for which metric values are returned.
     */
    startTime: Timestamp;
    /**
     * The end of the time period for which metric values are returned.
     */
    endTime: Timestamp;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListMetricValuesResponse {
    /**
     * The data the thing reports for the metric during the specified time period.
     */
    metricDatumList?: MetricDatumList;
    /**
     * A token that can be used to retrieve the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListMitigationActionsRequest {
    /**
     * Specify a value to limit the result to mitigation actions with a specific action type.
     */
    actionType?: MitigationActionType;
    /**
     * The maximum number of results to return at one time. The default is 25.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListMitigationActionsResponse {
    /**
     * A set of actions that matched the specified filter criteria.
     */
    actionIdentifiers?: MitigationActionIdentifierList;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListOTAUpdatesRequest {
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: MaxResults;
    /**
     * A token used to retrieve the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The OTA update job status.
     */
    otaUpdateStatus?: OTAUpdateStatus;
  }
  export interface ListOTAUpdatesResponse {
    /**
     * A list of OTA update jobs.
     */
    otaUpdates?: OTAUpdatesSummary;
    /**
     * A token to use to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListOutgoingCertificatesRequest {
    /**
     * The result page size.
     */
    pageSize?: PageSize;
    /**
     * The marker for the next set of results.
     */
    marker?: Marker;
    /**
     * Specifies the order for results. If True, the results are returned in ascending order, based on the creation date.
     */
    ascendingOrder?: AscendingOrder;
  }
  export interface ListOutgoingCertificatesResponse {
    /**
     * The certificates that are being transferred but not yet accepted.
     */
    outgoingCertificates?: OutgoingCertificates;
    /**
     * The marker for the next set of results.
     */
    nextMarker?: Marker;
  }
  export interface ListPackageVersionsRequest {
    /**
     * The name of the target software package.
     */
    packageName: PackageName;
    /**
     * The status of the package version. For more information, see Package version lifecycle.
     */
    status?: PackageVersionStatus;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: PackageCatalogMaxResults;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListPackageVersionsResponse {
    /**
     * Lists the package versions associated to the package.
     */
    packageVersionSummaries?: PackageVersionSummaryList;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListPackagesRequest {
    /**
     * The maximum number of results returned at one time.
     */
    maxResults?: PackageCatalogMaxResults;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListPackagesResponse {
    /**
     * The software package summary.
     */
    packageSummaries?: PackageSummaryList;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListPoliciesRequest {
    /**
     * The marker for the next set of results.
     */
    marker?: Marker;
    /**
     * The result page size.
     */
    pageSize?: PageSize;
    /**
     * Specifies the order for results. If true, the results are returned in ascending creation order.
     */
    ascendingOrder?: AscendingOrder;
  }
  export interface ListPoliciesResponse {
    /**
     * The descriptions of the policies.
     */
    policies?: Policies;
    /**
     * The marker for the next set of results, or null if there are no additional results.
     */
    nextMarker?: Marker;
  }
  export interface ListPolicyPrincipalsRequest {
    /**
     * The policy name.
     */
    policyName: PolicyName;
    /**
     * The marker for the next set of results.
     */
    marker?: Marker;
    /**
     * The result page size.
     */
    pageSize?: PageSize;
    /**
     * Specifies the order for results. If true, the results are returned in ascending creation order.
     */
    ascendingOrder?: AscendingOrder;
  }
  export interface ListPolicyPrincipalsResponse {
    /**
     * The descriptions of the principals.
     */
    principals?: Principals;
    /**
     * The marker for the next set of results, or null if there are no additional results.
     */
    nextMarker?: Marker;
  }
  export interface ListPolicyVersionsRequest {
    /**
     * The policy name.
     */
    policyName: PolicyName;
  }
  export interface ListPolicyVersionsResponse {
    /**
     * The policy versions.
     */
    policyVersions?: PolicyVersions;
  }
  export interface ListPrincipalPoliciesRequest {
    /**
     * The principal. Valid principals are CertificateArn (arn:aws:iot:region:accountId:cert/certificateId), thingGroupArn (arn:aws:iot:region:accountId:thinggroup/groupName) and CognitoId (region:id).
     */
    principal: Principal;
    /**
     * The marker for the next set of results.
     */
    marker?: Marker;
    /**
     * The result page size.
     */
    pageSize?: PageSize;
    /**
     * Specifies the order for results. If true, results are returned in ascending creation order.
     */
    ascendingOrder?: AscendingOrder;
  }
  export interface ListPrincipalPoliciesResponse {
    /**
     * The policies.
     */
    policies?: Policies;
    /**
     * The marker for the next set of results, or null if there are no additional results.
     */
    nextMarker?: Marker;
  }
  export interface ListPrincipalThingsRequest {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in this operation.
     */
    maxResults?: RegistryMaxResults;
    /**
     * The principal.
     */
    principal: Principal;
  }
  export interface ListPrincipalThingsResponse {
    /**
     * The things.
     */
    things?: ThingNameList;
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListProvisioningTemplateVersionsRequest {
    /**
     * The name of the provisioning template.
     */
    templateName: TemplateName;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: MaxResults;
    /**
     * A token to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListProvisioningTemplateVersionsResponse {
    /**
     * The list of provisioning template versions.
     */
    versions?: ProvisioningTemplateVersionListing;
    /**
     * A token to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListProvisioningTemplatesRequest {
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: MaxResults;
    /**
     * A token to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListProvisioningTemplatesResponse {
    /**
     * A list of provisioning templates
     */
    templates?: ProvisioningTemplateListing;
    /**
     * A token to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListRelatedResourcesForAuditFindingRequest {
    /**
     * The finding Id.
     */
    findingId: FindingId;
    /**
     * A token that can be used to retrieve the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: MaxResults;
  }
  export interface ListRelatedResourcesForAuditFindingResponse {
    /**
     * The related resources.
     */
    relatedResources?: RelatedResources;
    /**
     * A token that can be used to retrieve the next set of results, or null for the first API call.
     */
    nextToken?: NextToken;
  }
  export interface ListRoleAliasesRequest {
    /**
     * The maximum number of results to return at one time.
     */
    pageSize?: PageSize;
    /**
     * A marker used to get the next set of results.
     */
    marker?: Marker;
    /**
     * Return the list of role aliases in ascending alphabetical order.
     */
    ascendingOrder?: AscendingOrder;
  }
  export interface ListRoleAliasesResponse {
    /**
     * The role aliases.
     */
    roleAliases?: RoleAliases;
    /**
     * A marker used to get the next set of results.
     */
    nextMarker?: Marker;
  }
  export interface ListScheduledAuditsRequest {
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time. The default is 25.
     */
    maxResults?: MaxResults;
  }
  export interface ListScheduledAuditsResponse {
    /**
     * The list of scheduled audits.
     */
    scheduledAudits?: ScheduledAuditMetadataList;
    /**
     * A token that can be used to retrieve the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListSecurityProfilesForTargetRequest {
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: MaxResults;
    /**
     * If true, return child groups too.
     */
    recursive?: Recursive;
    /**
     * The ARN of the target (thing group) whose attached security profiles you want to get.
     */
    securityProfileTargetArn: SecurityProfileTargetArn;
  }
  export interface ListSecurityProfilesForTargetResponse {
    /**
     * A list of security profiles and their associated targets.
     */
    securityProfileTargetMappings?: SecurityProfileTargetMappings;
    /**
     * A token that can be used to retrieve the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListSecurityProfilesRequest {
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: MaxResults;
    /**
     * A filter to limit results to the security profiles that use the defined dimension. Cannot be used with metricName 
     */
    dimensionName?: DimensionName;
    /**
     *  The name of the custom metric. Cannot be used with dimensionName. 
     */
    metricName?: MetricName;
  }
  export interface ListSecurityProfilesResponse {
    /**
     * A list of security profile identifiers (names and ARNs).
     */
    securityProfileIdentifiers?: SecurityProfileIdentifiers;
    /**
     * A token that can be used to retrieve the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListStreamsRequest {
    /**
     * The maximum number of results to return at a time.
     */
    maxResults?: MaxResults;
    /**
     * A token used to get the next set of results.
     */
    nextToken?: NextToken;
    /**
     * Set to true to return the list of streams in ascending order.
     */
    ascendingOrder?: AscendingOrder;
  }
  export interface ListStreamsResponse {
    /**
     * A list of streams.
     */
    streams?: StreamsSummary;
    /**
     * A token used to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export type ListSuppressedAlerts = boolean;
  export type ListSuppressedFindings = boolean;
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: ResourceArn;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The list of tags assigned to the resource.
     */
    tags?: TagList;
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListTargetsForPolicyRequest {
    /**
     * The policy name.
     */
    policyName: PolicyName;
    /**
     * A marker used to get the next set of results.
     */
    marker?: Marker;
    /**
     * The maximum number of results to return at one time.
     */
    pageSize?: PageSize;
  }
  export interface ListTargetsForPolicyResponse {
    /**
     * The policy targets.
     */
    targets?: PolicyTargets;
    /**
     * A marker used to get the next set of results.
     */
    nextMarker?: Marker;
  }
  export interface ListTargetsForSecurityProfileRequest {
    /**
     * The security profile.
     */
    securityProfileName: SecurityProfileName;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: MaxResults;
  }
  export interface ListTargetsForSecurityProfileResponse {
    /**
     * The thing groups to which the security profile is attached.
     */
    securityProfileTargets?: SecurityProfileTargets;
    /**
     * A token that can be used to retrieve the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListThingGroupsForThingRequest {
    /**
     * The thing name.
     */
    thingName: ThingName;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: RegistryMaxResults;
  }
  export interface ListThingGroupsForThingResponse {
    /**
     * The thing groups.
     */
    thingGroups?: ThingGroupNameAndArnList;
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListThingGroupsRequest {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: RegistryMaxResults;
    /**
     * A filter that limits the results to those with the specified parent group.
     */
    parentGroup?: ThingGroupName;
    /**
     * A filter that limits the results to those with the specified name prefix.
     */
    namePrefixFilter?: ThingGroupName;
    /**
     * If true, return child groups as well.
     */
    recursive?: RecursiveWithoutDefault;
  }
  export interface ListThingGroupsResponse {
    /**
     * The thing groups.
     */
    thingGroups?: ThingGroupNameAndArnList;
    /**
     * The token to use to get the next set of results. Will not be returned if operation has returned all results.
     */
    nextToken?: NextToken;
  }
  export interface ListThingPrincipalsRequest {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in this operation.
     */
    maxResults?: RegistryMaxResults;
    /**
     * The name of the thing.
     */
    thingName: ThingName;
  }
  export interface ListThingPrincipalsResponse {
    /**
     * The principals associated with the thing.
     */
    principals?: Principals;
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListThingRegistrationTaskReportsRequest {
    /**
     * The id of the task.
     */
    taskId: TaskId;
    /**
     * The type of task report.
     */
    reportType: ReportType;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return per request.
     */
    maxResults?: RegistryMaxResults;
  }
  export interface ListThingRegistrationTaskReportsResponse {
    /**
     * Links to the task resources.
     */
    resourceLinks?: S3FileUrlList;
    /**
     * The type of task report.
     */
    reportType?: ReportType;
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListThingRegistrationTasksRequest {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: RegistryMaxResults;
    /**
     * The status of the bulk thing provisioning task.
     */
    status?: Status;
  }
  export interface ListThingRegistrationTasksResponse {
    /**
     * A list of bulk thing provisioning task IDs.
     */
    taskIds?: TaskIdList;
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListThingTypesRequest {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in this operation.
     */
    maxResults?: RegistryMaxResults;
    /**
     * The name of the thing type.
     */
    thingTypeName?: ThingTypeName;
  }
  export interface ListThingTypesResponse {
    /**
     * The thing types.
     */
    thingTypes?: ThingTypeList;
    /**
     * The token for the next set of results. Will not be returned if operation has returned all results.
     */
    nextToken?: NextToken;
  }
  export interface ListThingsInBillingGroupRequest {
    /**
     * The name of the billing group.
     */
    billingGroupName: BillingGroupName;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return per request.
     */
    maxResults?: RegistryMaxResults;
  }
  export interface ListThingsInBillingGroupResponse {
    /**
     * A list of things in the billing group.
     */
    things?: ThingNameList;
    /**
     * The token to use to get the next set of results. Will not be returned if operation has returned all results.
     */
    nextToken?: NextToken;
  }
  export interface ListThingsInThingGroupRequest {
    /**
     * The thing group name.
     */
    thingGroupName: ThingGroupName;
    /**
     * When true, list things in this thing group and in all child groups as well.
     */
    recursive?: Recursive;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: RegistryMaxResults;
  }
  export interface ListThingsInThingGroupResponse {
    /**
     * The things in the specified thing group.
     */
    things?: ThingNameList;
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListThingsRequest {
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return in this operation.
     */
    maxResults?: RegistryMaxResults;
    /**
     * The attribute name used to search for things.
     */
    attributeName?: AttributeName;
    /**
     * The attribute value used to search for things.
     */
    attributeValue?: AttributeValue;
    /**
     * The name of the thing type used to search for things.
     */
    thingTypeName?: ThingTypeName;
    /**
     * When true, the action returns the thing resources with attribute values that start with the attributeValue provided. When false, or not present, the action returns only the thing resources with attribute values that match the entire attributeValue provided. 
     */
    usePrefixAttributeValue?: usePrefixAttributeValue;
  }
  export interface ListThingsResponse {
    /**
     * The things.
     */
    things?: ThingAttributeList;
    /**
     * The token to use to get the next set of results. Will not be returned if operation has returned all results.
     */
    nextToken?: NextToken;
  }
  export interface ListTopicRuleDestinationsRequest {
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: TopicRuleDestinationMaxResults;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTopicRuleDestinationsResponse {
    /**
     * Information about a topic rule destination.
     */
    destinationSummaries?: TopicRuleDestinationSummaries;
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListTopicRulesRequest {
    /**
     * The topic.
     */
    topic?: Topic;
    /**
     * The maximum number of results to return.
     */
    maxResults?: TopicRuleMaxResults;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
    /**
     * Specifies whether the rule is disabled.
     */
    ruleDisabled?: IsDisabled;
  }
  export interface ListTopicRulesResponse {
    /**
     * The rules.
     */
    rules?: TopicRuleList;
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListV2LoggingLevelsRequest {
    /**
     * The type of resource for which you are configuring logging. Must be THING_Group.
     */
    targetType?: LogTargetType;
    /**
     * To retrieve the next set of results, the nextToken value from a previous response; otherwise null to receive the first set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: SkyfallMaxResults;
  }
  export interface ListV2LoggingLevelsResponse {
    /**
     * The logging configuration for a target.
     */
    logTargetConfigurations?: LogTargetConfigurations;
    /**
     * The token to use to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface ListViolationEventsRequest {
    /**
     * The start time for the alerts to be listed.
     */
    startTime: Timestamp;
    /**
     * The end time for the alerts to be listed.
     */
    endTime: Timestamp;
    /**
     * A filter to limit results to those alerts caused by the specified thing.
     */
    thingName?: DeviceDefenderThingName;
    /**
     * A filter to limit results to those alerts generated by the specified security profile.
     */
    securityProfileName?: SecurityProfileName;
    /**
     *  The criteria for a behavior. 
     */
    behaviorCriteriaType?: BehaviorCriteriaType;
    /**
     *  A list of all suppressed alerts. 
     */
    listSuppressedAlerts?: ListSuppressedAlerts;
    /**
     * The verification state of the violation (detect alarm).
     */
    verificationState?: VerificationState;
    /**
     * The token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: MaxResults;
  }
  export interface ListViolationEventsResponse {
    /**
     * The security profile violation alerts issued for this account during the given time period, potentially filtered by security profile, behavior violated, or thing (device) violating.
     */
    violationEvents?: ViolationEvents;
    /**
     * A token that can be used to retrieve the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
  }
  export interface LocationAction {
    /**
     * The IAM role that grants permission to write to the Amazon Location resource.
     */
    roleArn: AwsArn;
    /**
     * The name of the tracker resource in Amazon Location in which the location is updated.
     */
    trackerName: String;
    /**
     * The unique ID of the device providing the location data.
     */
    deviceId: String;
    /**
     * The time that the location data was sampled. The default value is the time the MQTT message was processed.
     */
    timestamp?: LocationTimestamp;
    /**
     * A string that evaluates to a double value that represents the latitude of the device's location.
     */
    latitude: String;
    /**
     * A string that evaluates to a double value that represents the longitude of the device's location.
     */
    longitude: String;
  }
  export interface LocationTimestamp {
    /**
     * An expression that returns a long epoch time value.
     */
    value: String;
    /**
     * The precision of the timestamp value that results from the expression described in value. Valid values: SECONDS | MILLISECONDS | MICROSECONDS | NANOSECONDS. The default is MILLISECONDS.
     */
    unit?: String;
  }
  export type LogGroupName = string;
  export type LogLevel = "DEBUG"|"INFO"|"ERROR"|"WARN"|"DISABLED"|string;
  export interface LogTarget {
    /**
     * The target type.
     */
    targetType: LogTargetType;
    /**
     * The target name.
     */
    targetName?: LogTargetName;
  }
  export interface LogTargetConfiguration {
    /**
     * A log target
     */
    logTarget?: LogTarget;
    /**
     * The logging level.
     */
    logLevel?: LogLevel;
  }
  export type LogTargetConfigurations = LogTargetConfiguration[];
  export type LogTargetName = string;
  export type LogTargetType = "DEFAULT"|"THING_GROUP"|"CLIENT_ID"|"SOURCE_IP"|"PRINCIPAL_ID"|"EVENT_TYPE"|"DEVICE_DEFENDER"|string;
  export interface LoggingOptionsPayload {
    /**
     * The ARN of the IAM role that grants access.
     */
    roleArn: AwsArn;
    /**
     * The log level.
     */
    logLevel?: LogLevel;
  }
  export interface MachineLearningDetectionConfig {
    /**
     *  The sensitivity of anomalous behavior evaluation. Can be Low, Medium, or High. 
     */
    confidenceLevel: ConfidenceLevel;
  }
  export interface MaintenanceWindow {
    /**
     * Displays the start time of the next maintenance window.
     */
    startTime: CronExpression;
    /**
     * Displays the duration of the next maintenance window.
     */
    durationInMinutes: DurationInMinutes;
  }
  export type MaintenanceWindows = MaintenanceWindow[];
  export type ManagedJobTemplateName = string;
  export interface ManagedJobTemplateSummary {
    /**
     * The Amazon Resource Name (ARN) for a managed template.
     */
    templateArn?: JobTemplateArn;
    /**
     * The unique Name for a managed template.
     */
    templateName?: ManagedJobTemplateName;
    /**
     * The description for a managed template.
     */
    description?: JobDescription;
    /**
     * A list of environments that are supported with the managed job template.
     */
    environments?: Environments;
    /**
     * The version for a managed template.
     */
    templateVersion?: ManagedTemplateVersion;
  }
  export type ManagedJobTemplatesSummaryList = ManagedJobTemplateSummary[];
  export type ManagedTemplateVersion = string;
  export type Marker = string;
  export type MaxBuckets = number;
  export type MaxJobExecutionsPerMin = number;
  export type MaxResults = number;
  export type Maximum = number;
  export type MaximumPerMinute = number;
  export type Message = string;
  export type MessageExpiry = string;
  export type MessageFormat = "RAW"|"JSON"|string;
  export type MessageId = string;
  export interface MetricDatum {
    /**
     * The time the metric value was reported.
     */
    timestamp?: Timestamp;
    /**
     * The value reported for the metric.
     */
    value?: MetricValue;
  }
  export type MetricDatumList = MetricDatum[];
  export interface MetricDimension {
    /**
     * A unique identifier for the dimension.
     */
    dimensionName: DimensionName;
    /**
     * Defines how the dimensionValues of a dimension are interpreted. For example, for dimension type TOPIC_FILTER, the IN operator, a message will be counted only if its topic matches one of the topic filters. With NOT_IN operator, a message will be counted only if it doesn't match any of the topic filters. The operator is optional: if it's not provided (is null), it will be interpreted as IN.
     */
    operator?: DimensionValueOperator;
  }
  export type MetricName = string;
  export type MetricNames = MetricName[];
  export interface MetricToRetain {
    /**
     * What is measured by the behavior.
     */
    metric: BehaviorMetric;
    /**
     * The dimension of a metric. This can't be used with custom metrics.
     */
    metricDimension?: MetricDimension;
  }
  export interface MetricValue {
    /**
     * If the comparisonOperator calls for a numeric value, use this to specify that numeric value to be compared with the metric.
     */
    count?: UnsignedLong;
    /**
     * If the comparisonOperator calls for a set of CIDRs, use this to specify that set to be compared with the metric.
     */
    cidrs?: Cidrs;
    /**
     * If the comparisonOperator calls for a set of ports, use this to specify that set to be compared with the metric.
     */
    ports?: Ports;
    /**
     *  The numeral value of a metric. 
     */
    number?: Number;
    /**
     *  The numeral values of a metric. 
     */
    numbers?: NumberList;
    /**
     *  The string values of a metric. 
     */
    strings?: StringList;
  }
  export type Minimum = number;
  export type MinimumNumberOfExecutedThings = number;
  export type MissingContextValue = string;
  export type MissingContextValues = MissingContextValue[];
  export interface MitigationAction {
    /**
     * A user-friendly name for the mitigation action.
     */
    name?: MitigationActionName;
    /**
     * A unique identifier for the mitigation action.
     */
    id?: MitigationActionId;
    /**
     * The IAM role ARN used to apply this mitigation action.
     */
    roleArn?: RoleArn;
    /**
     * The set of parameters for this mitigation action. The parameters vary, depending on the kind of action you apply.
     */
    actionParams?: MitigationActionParams;
  }
  export type MitigationActionArn = string;
  export type MitigationActionId = string;
  export interface MitigationActionIdentifier {
    /**
     * The friendly name of the mitigation action.
     */
    actionName?: MitigationActionName;
    /**
     * The IAM role ARN used to apply this mitigation action.
     */
    actionArn?: MitigationActionArn;
    /**
     * The date when this mitigation action was created.
     */
    creationDate?: Timestamp;
  }
  export type MitigationActionIdentifierList = MitigationActionIdentifier[];
  export type MitigationActionList = MitigationAction[];
  export type MitigationActionName = string;
  export type MitigationActionNameList = MitigationActionName[];
  export interface MitigationActionParams {
    /**
     * Parameters to define a mitigation action that changes the state of the device certificate to inactive.
     */
    updateDeviceCertificateParams?: UpdateDeviceCertificateParams;
    /**
     * Parameters to define a mitigation action that changes the state of the CA certificate to inactive.
     */
    updateCACertificateParams?: UpdateCACertificateParams;
    /**
     * Parameters to define a mitigation action that moves devices associated with a certificate to one or more specified thing groups, typically for quarantine.
     */
    addThingsToThingGroupParams?: AddThingsToThingGroupParams;
    /**
     * Parameters to define a mitigation action that adds a blank policy to restrict permissions.
     */
    replaceDefaultPolicyVersionParams?: ReplaceDefaultPolicyVersionParams;
    /**
     * Parameters to define a mitigation action that enables Amazon Web Services IoT Core logging at a specified level of detail.
     */
    enableIoTLoggingParams?: EnableIoTLoggingParams;
    /**
     * Parameters to define a mitigation action that publishes findings to Amazon Simple Notification Service (Amazon SNS. You can implement your own custom actions in response to the Amazon SNS messages.
     */
    publishFindingToSnsParams?: PublishFindingToSnsParams;
  }
  export type MitigationActionType = "UPDATE_DEVICE_CERTIFICATE"|"UPDATE_CA_CERTIFICATE"|"ADD_THINGS_TO_THING_GROUP"|"REPLACE_DEFAULT_POLICY_VERSION"|"ENABLE_IOT_LOGGING"|"PUBLISH_FINDING_TO_SNS"|string;
  export type MitigationActionsTaskId = string;
  export type ModelStatus = "PENDING_BUILD"|"ACTIVE"|"EXPIRED"|string;
  export type MqttClientId = string;
  export interface MqttContext {
    /**
     * The value of the username key in an MQTT authorization request.
     */
    username?: MqttUsername;
    /**
     * The value of the password key in an MQTT authorization request.
     */
    password?: MqttPassword;
    /**
     * The value of the clientId key in an MQTT authorization request.
     */
    clientId?: MqttClientId;
  }
  export interface MqttHeaders {
    /**
     * An Enum string value that indicates whether the payload is formatted as UTF-8. Valid values are UNSPECIFIED_BYTES and UTF8_DATA. For more information, see  Payload Format Indicator from the MQTT Version 5.0 specification. Supports substitution templates.
     */
    payloadFormatIndicator?: PayloadFormatIndicator;
    /**
     * A UTF-8 encoded string that describes the content of the publishing message. For more information, see  Content Type from the MQTT Version 5.0 specification. Supports substitution templates.
     */
    contentType?: ContentType;
    /**
     * A UTF-8 encoded string that's used as the topic name for a response message. The response topic is used to describe the topic which the receiver should publish to as part of the request-response flow. The topic must not contain wildcard characters. For more information, see  Response Topic from the MQTT Version 5.0 specification. Supports substitution templates.
     */
    responseTopic?: ResponseTopic;
    /**
     * The base64-encoded binary data used by the sender of the request message to identify which request the response message is for when it's received. For more information, see  Correlation Data from the MQTT Version 5.0 specification.   This binary data must be based64-encoded.   Supports substitution templates.
     */
    correlationData?: CorrelationData;
    /**
     * A user-defined integer value that will persist a message at the message broker for a specified amount of time to ensure that the message will expire if it's no longer relevant to the subscriber. The value of messageExpiry represents the number of seconds before it expires. For more information about the limits of messageExpiry, see Amazon Web Services IoT Core message broker and protocol limits and quotas  from the Amazon Web Services Reference Guide. Supports substitution templates.
     */
    messageExpiry?: MessageExpiry;
    /**
     * An array of key-value pairs that you define in the MQTT5 header.
     */
    userProperties?: UserProperties;
  }
  export type MqttPassword = Buffer|Uint8Array|Blob|string;
  export type MqttUsername = string;
  export type NamedShadowIndexingMode = "OFF"|"ON"|string;
  export type NamedShadowNamesFilter = ShadowName[];
  export type NamespaceId = string;
  export type NextToken = string;
  export type NonCompliantChecksCount = number;
  export interface NonCompliantResource {
    /**
     * The type of the noncompliant resource.
     */
    resourceType?: ResourceType;
    /**
     * Information that identifies the noncompliant resource.
     */
    resourceIdentifier?: ResourceIdentifier;
    /**
     * Other information about the noncompliant resource.
     */
    additionalInfo?: StringMap;
  }
  export type NonCompliantResourcesCount = number;
  export type NullableBoolean = boolean;
  export type Number = number;
  export type NumberList = Number[];
  export type NumberOfRetries = number;
  export type NumberOfThings = number;
  export type OTAUpdateArn = string;
  export type OTAUpdateDescription = string;
  export type OTAUpdateErrorMessage = string;
  export interface OTAUpdateFile {
    /**
     * The name of the file.
     */
    fileName?: FileName;
    /**
     * An integer value you can include in the job document to allow your devices to identify the type of file received from the cloud.
     */
    fileType?: FileType;
    /**
     * The file version.
     */
    fileVersion?: OTAUpdateFileVersion;
    /**
     * The location of the updated firmware.
     */
    fileLocation?: FileLocation;
    /**
     * The code signing method of the file.
     */
    codeSigning?: CodeSigning;
    /**
     * A list of name-attribute pairs. They won't be sent to devices as a part of the Job document.
     */
    attributes?: AttributesMap;
  }
  export type OTAUpdateFileVersion = string;
  export type OTAUpdateFiles = OTAUpdateFile[];
  export type OTAUpdateId = string;
  export interface OTAUpdateInfo {
    /**
     * The OTA update ID.
     */
    otaUpdateId?: OTAUpdateId;
    /**
     * The OTA update ARN.
     */
    otaUpdateArn?: OTAUpdateArn;
    /**
     * The date when the OTA update was created.
     */
    creationDate?: DateType;
    /**
     * The date when the OTA update was last updated.
     */
    lastModifiedDate?: DateType;
    /**
     * A description of the OTA update.
     */
    description?: OTAUpdateDescription;
    /**
     * The targets of the OTA update.
     */
    targets?: Targets;
    /**
     * The protocol used to transfer the OTA update image. Valid values are [HTTP], [MQTT], [HTTP, MQTT]. When both HTTP and MQTT are specified, the target device can choose the protocol.
     */
    protocols?: Protocols;
    /**
     * Configuration for the rollout of OTA updates.
     */
    awsJobExecutionsRolloutConfig?: AwsJobExecutionsRolloutConfig;
    /**
     * Configuration information for pre-signed URLs. Valid when protocols contains HTTP.
     */
    awsJobPresignedUrlConfig?: AwsJobPresignedUrlConfig;
    /**
     * Specifies whether the OTA update will continue to run (CONTINUOUS), or will be complete after all those things specified as targets have completed the OTA update (SNAPSHOT). If continuous, the OTA update may also be run on a thing when a change is detected in a target. For example, an OTA update will run on a thing when the thing is added to a target group, even after the OTA update was completed by all things originally in the group. 
     */
    targetSelection?: TargetSelection;
    /**
     * A list of files associated with the OTA update.
     */
    otaUpdateFiles?: OTAUpdateFiles;
    /**
     * The status of the OTA update.
     */
    otaUpdateStatus?: OTAUpdateStatus;
    /**
     * The IoT job ID associated with the OTA update.
     */
    awsIotJobId?: AwsIotJobId;
    /**
     * The IoT job ARN associated with the OTA update.
     */
    awsIotJobArn?: AwsIotJobArn;
    /**
     * Error information associated with the OTA update.
     */
    errorInfo?: ErrorInfo;
    /**
     * A collection of name/value pairs
     */
    additionalParameters?: AdditionalParameterMap;
  }
  export type OTAUpdateStatus = "CREATE_PENDING"|"CREATE_IN_PROGRESS"|"CREATE_COMPLETE"|"CREATE_FAILED"|"DELETE_IN_PROGRESS"|"DELETE_FAILED"|string;
  export interface OTAUpdateSummary {
    /**
     * The OTA update ID.
     */
    otaUpdateId?: OTAUpdateId;
    /**
     * The OTA update ARN.
     */
    otaUpdateArn?: OTAUpdateArn;
    /**
     * The date when the OTA update was created.
     */
    creationDate?: DateType;
  }
  export type OTAUpdatesSummary = OTAUpdateSummary[];
  export interface OpenSearchAction {
    /**
     * The IAM role ARN that has access to OpenSearch.
     */
    roleArn: AwsArn;
    /**
     * The endpoint of your OpenSearch domain.
     */
    endpoint: ElasticsearchEndpoint;
    /**
     * The OpenSearch index where you want to store your data.
     */
    index: ElasticsearchIndex;
    /**
     * The type of document you are storing.
     */
    type: ElasticsearchType;
    /**
     * The unique identifier for the document you are storing.
     */
    id: ElasticsearchId;
  }
  export type Optional = boolean;
  export type OptionalVersion = number;
  export interface OutgoingCertificate {
    /**
     * The certificate ARN.
     */
    certificateArn?: CertificateArn;
    /**
     * The certificate ID.
     */
    certificateId?: CertificateId;
    /**
     * The Amazon Web Services account to which the transfer was made.
     */
    transferredTo?: AwsAccountId;
    /**
     * The date the transfer was initiated.
     */
    transferDate?: DateType;
    /**
     * The transfer message.
     */
    transferMessage?: Message;
    /**
     * The certificate creation date.
     */
    creationDate?: DateType;
  }
  export type OutgoingCertificates = OutgoingCertificate[];
  export type OverrideDynamicGroups = boolean;
  export type PackageArn = string;
  export type PackageCatalogMaxResults = number;
  export type PackageName = string;
  export interface PackageSummary {
    /**
     * The name for the target software package.
     */
    packageName?: PackageName;
    /**
     * The name of the default package version.
     */
    defaultVersionName?: VersionName;
    /**
     * The date that the package was created.
     */
    creationDate?: CreationDate;
    /**
     * The date that the package was last updated.
     */
    lastModifiedDate?: LastModifiedDate;
  }
  export type PackageSummaryList = PackageSummary[];
  export type PackageVersionAction = "PUBLISH"|"DEPRECATE"|string;
  export type PackageVersionArn = string;
  export type PackageVersionErrorReason = string;
  export type PackageVersionStatus = "DRAFT"|"PUBLISHED"|"DEPRECATED"|string;
  export interface PackageVersionSummary {
    /**
     * The name of the associated software package.
     */
    packageName?: PackageName;
    /**
     * The name of the target package version.
     */
    versionName?: VersionName;
    /**
     * The status of the package version. For more information, see Package version lifecycle.
     */
    status?: PackageVersionStatus;
    /**
     * The date that the package version was created.
     */
    creationDate?: CreationDate;
    /**
     * The date that the package version was last updated.
     */
    lastModifiedDate?: LastModifiedDate;
  }
  export type PackageVersionSummaryList = PackageVersionSummary[];
  export type PageSize = number;
  export type Parameter = string;
  export type ParameterKey = string;
  export type ParameterMap = {[key: string]: ParameterValue};
  export type ParameterValue = string;
  export type Parameters = {[key: string]: Value};
  export type PartitionKey = string;
  export type PayloadField = string;
  export type PayloadFormatIndicator = string;
  export type PayloadVersion = string;
  export type Percent = number;
  export type PercentList = Percent[];
  export interface PercentPair {
    /**
     * The percentile.
     */
    percent?: Percent;
    /**
     * The value of the percentile.
     */
    value?: PercentValue;
  }
  export type PercentValue = number;
  export type Percentage = number;
  export type Percentiles = PercentPair[];
  export type Platform = string;
  export type Policies = Policy[];
  export interface Policy {
    /**
     * The policy name.
     */
    policyName?: PolicyName;
    /**
     * The policy ARN.
     */
    policyArn?: PolicyArn;
  }
  export type PolicyArn = string;
  export type PolicyDocument = string;
  export type PolicyDocuments = PolicyDocument[];
  export type PolicyName = string;
  export type PolicyNames = PolicyName[];
  export type PolicyTarget = string;
  export type PolicyTargets = PolicyTarget[];
  export type PolicyTemplateName = "BLANK_POLICY"|string;
  export interface PolicyVersion {
    /**
     * The policy version ID.
     */
    versionId?: PolicyVersionId;
    /**
     * Specifies whether the policy version is the default.
     */
    isDefaultVersion?: IsDefaultVersion;
    /**
     * The date and time the policy was created.
     */
    createDate?: DateType;
  }
  export type PolicyVersionId = string;
  export interface PolicyVersionIdentifier {
    /**
     * The name of the policy.
     */
    policyName?: PolicyName;
    /**
     * The ID of the version of the policy associated with the resource.
     */
    policyVersionId?: PolicyVersionId;
  }
  export type PolicyVersions = PolicyVersion[];
  export type Port = number;
  export type Ports = Port[];
  export type Prefix = string;
  export interface PresignedUrlConfig {
    /**
     * The ARN of an IAM role that grants permission to download files from the S3 bucket where the job data/updates are stored. The role must also grant permission for IoT to download the files.  For information about addressing the confused deputy problem, see cross-service confused deputy prevention in the Amazon Web Services IoT Core developer guide. 
     */
    roleArn?: RoleArn;
    /**
     * How long (in seconds) pre-signed URLs are valid. Valid values are 60 - 3600, the default value is 3600 seconds. Pre-signed URLs are generated when Jobs receives an MQTT request for the job document.
     */
    expiresInSec?: ExpiresInSec;
  }
  export type PrimitiveBoolean = boolean;
  export type Principal = string;
  export type PrincipalArn = string;
  export type PrincipalId = string;
  export type Principals = PrincipalArn[];
  export type PrivateKey = string;
  export type ProcessingTargetName = string;
  export type ProcessingTargetNameList = ProcessingTargetName[];
  export type Protocol = "MQTT"|"HTTP"|string;
  export type Protocols = Protocol[];
  export interface ProvisioningHook {
    /**
     * The payload that was sent to the target function.  Note: Only Lambda functions are currently supported.
     */
    payloadVersion?: PayloadVersion;
    /**
     * The ARN of the target function.  Note: Only Lambda functions are currently supported.
     */
    targetArn: TargetArn;
  }
  export type ProvisioningTemplateListing = ProvisioningTemplateSummary[];
  export interface ProvisioningTemplateSummary {
    /**
     * The ARN of the provisioning template.
     */
    templateArn?: TemplateArn;
    /**
     * The name of the provisioning template.
     */
    templateName?: TemplateName;
    /**
     * The description of the provisioning template.
     */
    description?: TemplateDescription;
    /**
     * The date when the provisioning template summary was created.
     */
    creationDate?: DateType;
    /**
     * The date when the provisioning template summary was last modified.
     */
    lastModifiedDate?: DateType;
    /**
     * True if the fleet provision template is enabled, otherwise false.
     */
    enabled?: Enabled;
    /**
     * The type you define in a provisioning template. You can create a template with only one type. You can't change the template type after its creation. The default value is FLEET_PROVISIONING. For more information about provisioning template, see: Provisioning template. 
     */
    type?: TemplateType;
  }
  export type ProvisioningTemplateVersionListing = ProvisioningTemplateVersionSummary[];
  export interface ProvisioningTemplateVersionSummary {
    /**
     * The ID of the fleet provisioning template version.
     */
    versionId?: TemplateVersionId;
    /**
     * The date when the provisioning template version was created
     */
    creationDate?: DateType;
    /**
     * True if the provisioning template version is the default version, otherwise false.
     */
    isDefaultVersion?: IsDefaultVersion;
  }
  export type PublicKey = string;
  export type PublicKeyMap = {[key: string]: KeyValue};
  export interface PublishFindingToSnsParams {
    /**
     * The ARN of the topic to which you want to publish the findings.
     */
    topicArn: SnsTopicArn;
  }
  export interface PutAssetPropertyValueEntry {
    /**
     * Optional. A unique identifier for this entry that you can define to better track which message caused an error in case of failure. Accepts substitution templates. Defaults to a new UUID.
     */
    entryId?: AssetPropertyEntryId;
    /**
     * The ID of the IoT SiteWise asset. You must specify either a propertyAlias or both an aliasId and a propertyId. Accepts substitution templates.
     */
    assetId?: AssetId;
    /**
     * The ID of the asset's property. You must specify either a propertyAlias or both an aliasId and a propertyId. Accepts substitution templates.
     */
    propertyId?: AssetPropertyId;
    /**
     * The name of the property alias associated with your asset property. You must specify either a propertyAlias or both an aliasId and a propertyId. Accepts substitution templates.
     */
    propertyAlias?: AssetPropertyAlias;
    /**
     * A list of property values to insert that each contain timestamp, quality, and value (TQV) information.
     */
    propertyValues: AssetPropertyValueList;
  }
  export type PutAssetPropertyValueEntryList = PutAssetPropertyValueEntry[];
  export interface PutItemInput {
    /**
     * The table where the message data will be written.
     */
    tableName: TableName;
  }
  export interface PutVerificationStateOnViolationRequest {
    /**
     * The violation ID.
     */
    violationId: ViolationId;
    /**
     * The verification state of the violation.
     */
    verificationState: VerificationState;
    /**
     * The description of the verification state of the violation (detect alarm).
     */
    verificationStateDescription?: VerificationStateDescription;
  }
  export interface PutVerificationStateOnViolationResponse {
  }
  export type Qos = number;
  export type QueryMaxResults = number;
  export type QueryString = string;
  export type QueryVersion = string;
  export type QueueUrl = string;
  export type QueuedThings = number;
  export type RangeKeyField = string;
  export type RangeKeyValue = string;
  export interface RateIncreaseCriteria {
    /**
     * The threshold for number of notified things that will initiate the increase in rate of rollout.
     */
    numberOfNotifiedThings?: NumberOfThings;
    /**
     * The threshold for number of succeeded things that will initiate the increase in rate of rollout.
     */
    numberOfSucceededThings?: NumberOfThings;
  }
  export type ReasonCode = string;
  export type ReasonForNonCompliance = string;
  export type ReasonForNonComplianceCode = string;
  export type ReasonForNonComplianceCodes = ReasonForNonComplianceCode[];
  export type Recursive = boolean;
  export type RecursiveWithoutDefault = boolean;
  export type Regex = string;
  export interface RegisterCACertificateRequest {
    /**
     * The CA certificate.
     */
    caCertificate: CertificatePem;
    /**
     * The private key verification certificate. If certificateMode is SNI_ONLY, the verificationCertificate field must be empty. If certificateMode is DEFAULT or not provided, the verificationCertificate field must not be empty. 
     */
    verificationCertificate?: CertificatePem;
    /**
     * A boolean value that specifies if the CA certificate is set to active. Valid values: ACTIVE | INACTIVE 
     */
    setAsActive?: SetAsActive;
    /**
     * Allows this CA certificate to be used for auto registration of device certificates.
     */
    allowAutoRegistration?: AllowAutoRegistration;
    /**
     * Information about the registration configuration.
     */
    registrationConfig?: RegistrationConfig;
    /**
     * Metadata which can be used to manage the CA certificate.  For URI Request parameters use format: ...key1=value1&amp;key2=value2... For the CLI command-line parameter use format: &amp;&amp;tags "key1=value1&amp;key2=value2..." For the cli-input-json file use format: "tags": "key1=value1&amp;key2=value2..." 
     */
    tags?: TagList;
    /**
     * Describes the certificate mode in which the Certificate Authority (CA) will be registered. If the verificationCertificate field is not provided, set certificateMode to be SNI_ONLY. If the verificationCertificate field is provided, set certificateMode to be DEFAULT. When certificateMode is not provided, it defaults to DEFAULT. All the device certificates that are registered using this CA will be registered in the same certificate mode as the CA. For more information about certificate mode for device certificates, see  certificate mode. 
     */
    certificateMode?: CertificateMode;
  }
  export interface RegisterCACertificateResponse {
    /**
     * The CA certificate ARN.
     */
    certificateArn?: CertificateArn;
    /**
     * The CA certificate identifier.
     */
    certificateId?: CertificateId;
  }
  export interface RegisterCertificateRequest {
    /**
     * The certificate data, in PEM format.
     */
    certificatePem: CertificatePem;
    /**
     * The CA certificate used to sign the device certificate being registered.
     */
    caCertificatePem?: CertificatePem;
    /**
     * A boolean value that specifies if the certificate is set to active. Valid values: ACTIVE | INACTIVE 
     */
    setAsActive?: SetAsActiveFlag;
    /**
     * The status of the register certificate request. Valid values that you can use include ACTIVE, INACTIVE, and REVOKED.
     */
    status?: CertificateStatus;
  }
  export interface RegisterCertificateResponse {
    /**
     * The certificate ARN.
     */
    certificateArn?: CertificateArn;
    /**
     * The certificate identifier.
     */
    certificateId?: CertificateId;
  }
  export interface RegisterCertificateWithoutCARequest {
    /**
     * The certificate data, in PEM format.
     */
    certificatePem: CertificatePem;
    /**
     * The status of the register certificate request.
     */
    status?: CertificateStatus;
  }
  export interface RegisterCertificateWithoutCAResponse {
    /**
     * The Amazon Resource Name (ARN) of the registered certificate.
     */
    certificateArn?: CertificateArn;
    /**
     * The ID of the registered certificate. (The last part of the certificate ARN contains the certificate ID.
     */
    certificateId?: CertificateId;
  }
  export interface RegisterThingRequest {
    /**
     * The provisioning template. See Provisioning Devices That Have Device Certificates for more information.
     */
    templateBody: TemplateBody;
    /**
     * The parameters for provisioning a thing. See Provisioning Templates for more information.
     */
    parameters?: Parameters;
  }
  export interface RegisterThingResponse {
    /**
     * The certificate data, in PEM format.
     */
    certificatePem?: CertificatePem;
    /**
     * ARNs for the generated resources.
     */
    resourceArns?: ResourceArns;
  }
  export type RegistrationCode = string;
  export interface RegistrationConfig {
    /**
     * The template body.
     */
    templateBody?: TemplateBody;
    /**
     * The ARN of the role.
     */
    roleArn?: RoleArn;
    /**
     * The name of the provisioning template.
     */
    templateName?: TemplateName;
  }
  export type RegistryMaxResults = number;
  export type RegistryS3BucketName = string;
  export type RegistryS3KeyName = string;
  export interface RejectCertificateTransferRequest {
    /**
     * The ID of the certificate. (The last part of the certificate ARN contains the certificate ID.)
     */
    certificateId: CertificateId;
    /**
     * The reason the certificate transfer was rejected.
     */
    rejectReason?: Message;
  }
  export type RejectedThings = number;
  export interface RelatedResource {
    /**
     * The type of resource.
     */
    resourceType?: ResourceType;
    /**
     * Information that identifies the resource.
     */
    resourceIdentifier?: ResourceIdentifier;
    /**
     * Other information about the resource.
     */
    additionalInfo?: StringMap;
  }
  export type RelatedResources = RelatedResource[];
  export type RemoveAuthorizerConfig = boolean;
  export type RemoveAutoRegistration = boolean;
  export type RemoveHook = boolean;
  export interface RemoveThingFromBillingGroupRequest {
    /**
     * The name of the billing group.
     */
    billingGroupName?: BillingGroupName;
    /**
     * The ARN of the billing group.
     */
    billingGroupArn?: BillingGroupArn;
    /**
     * The name of the thing to be removed from the billing group.
     */
    thingName?: ThingName;
    /**
     * The ARN of the thing to be removed from the billing group.
     */
    thingArn?: ThingArn;
  }
  export interface RemoveThingFromBillingGroupResponse {
  }
  export interface RemoveThingFromThingGroupRequest {
    /**
     * The group name.
     */
    thingGroupName?: ThingGroupName;
    /**
     * The group ARN.
     */
    thingGroupArn?: ThingGroupArn;
    /**
     * The name of the thing to remove from the group.
     */
    thingName?: ThingName;
    /**
     * The ARN of the thing to remove from the group.
     */
    thingArn?: ThingArn;
  }
  export interface RemoveThingFromThingGroupResponse {
  }
  export type RemoveThingType = boolean;
  export type RemovedThings = number;
  export interface ReplaceDefaultPolicyVersionParams {
    /**
     * The name of the template to be applied. The only supported value is BLANK_POLICY.
     */
    templateName: PolicyTemplateName;
  }
  export interface ReplaceTopicRuleRequest {
    /**
     * The name of the rule.
     */
    ruleName: RuleName;
    /**
     * The rule payload.
     */
    topicRulePayload: TopicRulePayload;
  }
  export type ReportType = "ERRORS"|"RESULTS"|string;
  export interface RepublishAction {
    /**
     * The ARN of the IAM role that grants access.
     */
    roleArn: AwsArn;
    /**
     * The name of the MQTT topic.
     */
    topic: TopicPattern;
    /**
     * The Quality of Service (QoS) level to use when republishing messages. The default value is 0.
     */
    qos?: Qos;
    /**
     * MQTT Version 5.0 headers information. For more information, see  MQTT from the Amazon Web Services IoT Core Developer Guide.
     */
    headers?: MqttHeaders;
  }
  export type ReservedDomainConfigurationName = string;
  export type Resource = string;
  export type ResourceArn = string;
  export type ResourceArns = {[key: string]: ResourceArn};
  export type ResourceAttributeKey = string;
  export type ResourceAttributeValue = string;
  export type ResourceAttributes = {[key: string]: ResourceAttributeValue};
  export type ResourceDescription = string;
  export interface ResourceIdentifier {
    /**
     * The ID of the certificate attached to the resource.
     */
    deviceCertificateId?: CertificateId;
    /**
     * The ID of the CA certificate used to authorize the certificate.
     */
    caCertificateId?: CertificateId;
    /**
     * The ID of the Amazon Cognito identity pool.
     */
    cognitoIdentityPoolId?: CognitoIdentityPoolId;
    /**
     * The client ID.
     */
    clientId?: ClientId;
    /**
     * The version of the policy associated with the resource.
     */
    policyVersionIdentifier?: PolicyVersionIdentifier;
    /**
     * The account with which the resource is associated.
     */
    account?: AwsAccountId;
    /**
     * The ARN of the IAM role that has overly permissive actions.
     */
    iamRoleArn?: RoleArn;
    /**
     * The ARN of the role alias that has overly permissive actions.
     */
    roleAliasArn?: RoleAliasArn;
    /**
     * The issuer certificate identifier.
     */
    issuerCertificateIdentifier?: IssuerCertificateIdentifier;
    /**
     * The ARN of the identified device certificate.
     */
    deviceCertificateArn?: CertificateArn;
  }
  export type ResourceLogicalId = string;
  export type ResourceType = "DEVICE_CERTIFICATE"|"CA_CERTIFICATE"|"IOT_POLICY"|"COGNITO_IDENTITY_POOL"|"CLIENT_ID"|"ACCOUNT_SETTINGS"|"ROLE_ALIAS"|"IAM_ROLE"|"ISSUER_CERTIFICATE"|string;
  export type Resources = Resource[];
  export type ResponseTopic = string;
  export type RetryAttempt = number;
  export interface RetryCriteria {
    /**
     * The type of job execution failures that can initiate a job retry.
     */
    failureType: RetryableFailureType;
    /**
     * The number of retries allowed for a failure type for the job.
     */
    numberOfRetries: NumberOfRetries;
  }
  export type RetryCriteriaList = RetryCriteria[];
  export type RetryableFailureType = "FAILED"|"TIMED_OUT"|"ALL"|string;
  export type RoleAlias = string;
  export type RoleAliasArn = string;
  export interface RoleAliasDescription {
    /**
     * The role alias.
     */
    roleAlias?: RoleAlias;
    /**
     * The ARN of the role alias.
     */
    roleAliasArn?: RoleAliasArn;
    /**
     * The role ARN.
     */
    roleArn?: RoleArn;
    /**
     * The role alias owner.
     */
    owner?: AwsAccountId;
    /**
     * The number of seconds for which the credential is valid.
     */
    credentialDurationSeconds?: CredentialDurationSeconds;
    /**
     * The UNIX timestamp of when the role alias was created.
     */
    creationDate?: DateType;
    /**
     * The UNIX timestamp of when the role alias was last modified.
     */
    lastModifiedDate?: DateType;
  }
  export type RoleAliases = RoleAlias[];
  export type RoleArn = string;
  export type RolloutRatePerMinute = number;
  export type RuleArn = string;
  export type RuleName = string;
  export interface S3Action {
    /**
     * The ARN of the IAM role that grants access.
     */
    roleArn: AwsArn;
    /**
     * The Amazon S3 bucket.
     */
    bucketName: BucketName;
    /**
     * The object key. For more information, see Actions, resources, and condition keys for Amazon S3.
     */
    key: Key;
    /**
     * The Amazon S3 canned ACL that controls access to the object identified by the object key. For more information, see S3 canned ACLs.
     */
    cannedAcl?: CannedAccessControlList;
  }
  export type S3Bucket = string;
  export interface S3Destination {
    /**
     * The S3 bucket that contains the updated firmware.
     */
    bucket?: S3Bucket;
    /**
     * The S3 prefix.
     */
    prefix?: Prefix;
  }
  export type S3FileUrl = string;
  export type S3FileUrlList = S3FileUrl[];
  export type S3Key = string;
  export interface S3Location {
    /**
     * The S3 bucket.
     */
    bucket?: S3Bucket;
    /**
     * The S3 key.
     */
    key?: S3Key;
    /**
     * The S3 bucket version.
     */
    version?: S3Version;
  }
  export type S3Version = string;
  export type SQL = string;
  export interface SalesforceAction {
    /**
     * The token used to authenticate access to the Salesforce IoT Cloud Input Stream. The token is available from the Salesforce IoT Cloud platform after creation of the Input Stream.
     */
    token: SalesforceToken;
    /**
     * The URL exposed by the Salesforce IoT Cloud Input Stream. The URL is available from the Salesforce IoT Cloud platform after creation of the Input Stream.
     */
    url: SalesforceEndpoint;
  }
  export type SalesforceEndpoint = string;
  export type SalesforceToken = string;
  export type ScheduledAuditArn = string;
  export interface ScheduledAuditMetadata {
    /**
     * The name of the scheduled audit.
     */
    scheduledAuditName?: ScheduledAuditName;
    /**
     * The ARN of the scheduled audit.
     */
    scheduledAuditArn?: ScheduledAuditArn;
    /**
     * How often the scheduled audit occurs.
     */
    frequency?: AuditFrequency;
    /**
     * The day of the month on which the scheduled audit is run (if the frequency is "MONTHLY"). If days 29-31 are specified, and the month does not have that many days, the audit takes place on the "LAST" day of the month.
     */
    dayOfMonth?: DayOfMonth;
    /**
     * The day of the week on which the scheduled audit is run (if the frequency is "WEEKLY" or "BIWEEKLY").
     */
    dayOfWeek?: DayOfWeek;
  }
  export type ScheduledAuditMetadataList = ScheduledAuditMetadata[];
  export type ScheduledAuditName = string;
  export interface ScheduledJobRollout {
    /**
     * Displays the start times of the next seven maintenance window occurrences.
     */
    startTime?: StringDateTime;
  }
  export type ScheduledJobRolloutList = ScheduledJobRollout[];
  export interface SchedulingConfig {
    /**
     * The time a job will begin rollout of the job document to all devices in the target group for a job. The startTime can be scheduled up to a year in advance and must be scheduled a minimum of thirty minutes from the current time. The date and time format for the startTime is YYYY-MM-DD for the date and HH:MM for the time. For more information on the syntax for startTime when using an API command or the Command Line Interface, see Timestamp.
     */
    startTime?: StringDateTime;
    /**
     * The time a job will stop rollout of the job document to all devices in the target group for a job. The endTime must take place no later than two years from the current time and be scheduled a minimum of thirty minutes from the current time. The minimum duration between startTime and endTime is thirty minutes. The maximum duration between startTime and endTime is two years. The date and time format for the endTime is YYYY-MM-DD for the date and HH:MM for the time. For more information on the syntax for endTime when using an API command or the Command Line Interface, see Timestamp.
     */
    endTime?: StringDateTime;
    /**
     * Specifies the end behavior for all job executions after a job reaches the selected endTime. If endTime is not selected when creating the job, then endBehavior does not apply.
     */
    endBehavior?: JobEndBehavior;
    /**
     * An optional configuration within the SchedulingConfig to setup a recurring maintenance window with a predetermined start time and duration for the rollout of a job document to all devices in a target group for a job.
     */
    maintenanceWindows?: MaintenanceWindows;
  }
  export interface SearchIndexRequest {
    /**
     * The search index name.
     */
    indexName?: IndexName;
    /**
     * The search query string. For more information about the search query syntax, see Query syntax.
     */
    queryString: QueryString;
    /**
     * The token used to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of results to return at one time.
     */
    maxResults?: QueryMaxResults;
    /**
     * The query version.
     */
    queryVersion?: QueryVersion;
  }
  export interface SearchIndexResponse {
    /**
     * The token used to get the next set of results, or null if there are no additional results.
     */
    nextToken?: NextToken;
    /**
     * The things that match the search query.
     */
    things?: ThingDocumentList;
    /**
     * The thing groups that match the search query.
     */
    thingGroups?: ThingGroupDocumentList;
  }
  export type SearchableAttributes = AttributeName[];
  export type Seconds = number;
  export type SecurityGroupId = string;
  export type SecurityGroupList = SecurityGroupId[];
  export type SecurityPolicy = string;
  export type SecurityProfileArn = string;
  export type SecurityProfileDescription = string;
  export interface SecurityProfileIdentifier {
    /**
     * The name you've given to the security profile.
     */
    name: SecurityProfileName;
    /**
     * The ARN of the security profile.
     */
    arn: SecurityProfileArn;
  }
  export type SecurityProfileIdentifiers = SecurityProfileIdentifier[];
  export type SecurityProfileName = string;
  export interface SecurityProfileTarget {
    /**
     * The ARN of the security profile.
     */
    arn: SecurityProfileTargetArn;
  }
  export type SecurityProfileTargetArn = string;
  export interface SecurityProfileTargetMapping {
    /**
     * Information that identifies the security profile.
     */
    securityProfileIdentifier?: SecurityProfileIdentifier;
    /**
     * Information about the target (thing group) associated with the security profile.
     */
    target?: SecurityProfileTarget;
  }
  export type SecurityProfileTargetMappings = SecurityProfileTargetMapping[];
  export type SecurityProfileTargets = SecurityProfileTarget[];
  export type ServerCertificateArns = AcmCertificateArn[];
  export type ServerCertificateStatus = "INVALID"|"VALID"|string;
  export type ServerCertificateStatusDetail = string;
  export interface ServerCertificateSummary {
    /**
     * The ARN of the server certificate.
     */
    serverCertificateArn?: AcmCertificateArn;
    /**
     * The status of the server certificate.
     */
    serverCertificateStatus?: ServerCertificateStatus;
    /**
     * Details that explain the status of the server certificate.
     */
    serverCertificateStatusDetail?: ServerCertificateStatusDetail;
  }
  export type ServerCertificates = ServerCertificateSummary[];
  export type ServerName = string;
  export type ServiceName = string;
  export type ServiceType = "DATA"|"CREDENTIAL_PROVIDER"|"JOBS"|string;
  export type SetAsActive = boolean;
  export type SetAsActiveFlag = boolean;
  export type SetAsDefault = boolean;
  export interface SetDefaultAuthorizerRequest {
    /**
     * The authorizer name.
     */
    authorizerName: AuthorizerName;
  }
  export interface SetDefaultAuthorizerResponse {
    /**
     * The authorizer name.
     */
    authorizerName?: AuthorizerName;
    /**
     * The authorizer ARN.
     */
    authorizerArn?: AuthorizerArn;
  }
  export interface SetDefaultPolicyVersionRequest {
    /**
     * The policy name.
     */
    policyName: PolicyName;
    /**
     * The policy version ID.
     */
    policyVersionId: PolicyVersionId;
  }
  export interface SetLoggingOptionsRequest {
    /**
     * The logging options payload.
     */
    loggingOptionsPayload: LoggingOptionsPayload;
  }
  export interface SetV2LoggingLevelRequest {
    /**
     * The log target.
     */
    logTarget: LogTarget;
    /**
     * The log level.
     */
    logLevel: LogLevel;
  }
  export interface SetV2LoggingOptionsRequest {
    /**
     * The ARN of the role that allows IoT to write to Cloudwatch logs.
     */
    roleArn?: AwsArn;
    /**
     * The default logging level.
     */
    defaultLogLevel?: LogLevel;
    /**
     * If true all logs are disabled. The default is false.
     */
    disableAllLogs?: DisableAllLogs;
  }
  export type ShadowName = string;
  export interface SigV4Authorization {
    /**
     * The signing region.
     */
    signingRegion: SigningRegion;
    /**
     * The service name to use while signing with Sig V4.
     */
    serviceName: ServiceName;
    /**
     * The ARN of the signing role.
     */
    roleArn: AwsArn;
  }
  export type Signature = Buffer|Uint8Array|Blob|string;
  export type SignatureAlgorithm = string;
  export type SigningJobId = string;
  export type SigningProfileName = string;
  export interface SigningProfileParameter {
    /**
     * Certificate ARN.
     */
    certificateArn?: CertificateArn;
    /**
     * The hardware platform of your device.
     */
    platform?: Platform;
    /**
     * The location of the code-signing certificate on your device.
     */
    certificatePathOnDevice?: CertificatePathOnDevice;
  }
  export type SigningRegion = string;
  export type SkippedFindingsCount = number;
  export type SkyfallMaxResults = number;
  export interface SnsAction {
    /**
     * The ARN of the SNS topic.
     */
    targetArn: AwsArn;
    /**
     * The ARN of the IAM role that grants access.
     */
    roleArn: AwsArn;
    /**
     * (Optional) The message format of the message to publish. Accepted values are "JSON" and "RAW". The default value of the attribute is "RAW". SNS uses this setting to determine if the payload should be parsed and relevant platform-specific bits of the payload should be extracted. To read more about SNS message formats, see https://docs.aws.amazon.com/sns/latest/dg/json-formats.html refer to their official documentation.
     */
    messageFormat?: MessageFormat;
  }
  export type SnsTopicArn = string;
  export interface SqsAction {
    /**
     * The ARN of the IAM role that grants access.
     */
    roleArn: AwsArn;
    /**
     * The URL of the Amazon SQS queue.
     */
    queueUrl: QueueUrl;
    /**
     * Specifies whether to use Base64 encoding.
     */
    useBase64?: UseBase64;
  }
  export interface StartAuditMitigationActionsTaskRequest {
    /**
     * A unique identifier for the task. You can use this identifier to check the status of the task or to cancel it.
     */
    taskId: MitigationActionsTaskId;
    /**
     * Specifies the audit findings to which the mitigation actions are applied. You can apply them to a type of audit check, to all findings from an audit, or to a specific set of findings.
     */
    target: AuditMitigationActionsTaskTarget;
    /**
     * For an audit check, specifies which mitigation actions to apply. Those actions must be defined in your Amazon Web Services accounts.
     */
    auditCheckToActionsMapping: AuditCheckToActionsMapping;
    /**
     * Each audit mitigation task must have a unique client request token. If you try to start a new task with the same token as a task that already exists, an exception occurs. If you omit this value, a unique client request token is generated automatically.
     */
    clientRequestToken: ClientRequestToken;
  }
  export interface StartAuditMitigationActionsTaskResponse {
    /**
     * The unique identifier for the audit mitigation task. This matches the taskId that you specified in the request.
     */
    taskId?: MitigationActionsTaskId;
  }
  export interface StartDetectMitigationActionsTaskRequest {
    /**
     *  The unique identifier of the task. 
     */
    taskId: MitigationActionsTaskId;
    /**
     *  Specifies the ML Detect findings to which the mitigation actions are applied. 
     */
    target: DetectMitigationActionsTaskTarget;
    /**
     *  The actions to be performed when a device has unexpected behavior. 
     */
    actions: DetectMitigationActionsToExecuteList;
    /**
     *  Specifies the time period of which violation events occurred between. 
     */
    violationEventOccurrenceRange?: ViolationEventOccurrenceRange;
    /**
     *  Specifies to list only active violations. 
     */
    includeOnlyActiveViolations?: NullableBoolean;
    /**
     *  Specifies to include suppressed alerts. 
     */
    includeSuppressedAlerts?: NullableBoolean;
    /**
     *  Each mitigation action task must have a unique client request token. If you try to create a new task with the same token as a task that already exists, an exception occurs. If you omit this value, Amazon Web Services SDKs will automatically generate a unique client request. 
     */
    clientRequestToken: ClientRequestToken;
  }
  export interface StartDetectMitigationActionsTaskResponse {
    /**
     *  The unique identifier of the task. 
     */
    taskId?: MitigationActionsTaskId;
  }
  export interface StartOnDemandAuditTaskRequest {
    /**
     * Which checks are performed during the audit. The checks you specify must be enabled for your account or an exception occurs. Use DescribeAccountAuditConfiguration to see the list of all checks, including those that are enabled or UpdateAccountAuditConfiguration to select which checks are enabled.
     */
    targetCheckNames: TargetAuditCheckNames;
  }
  export interface StartOnDemandAuditTaskResponse {
    /**
     * The ID of the on-demand audit you started.
     */
    taskId?: AuditTaskId;
  }
  export interface StartSigningJobParameter {
    /**
     * Describes the code-signing profile.
     */
    signingProfileParameter?: SigningProfileParameter;
    /**
     * The code-signing profile name.
     */
    signingProfileName?: SigningProfileName;
    /**
     * The location to write the code-signed file.
     */
    destination?: Destination;
  }
  export interface StartThingRegistrationTaskRequest {
    /**
     * The provisioning template.
     */
    templateBody: TemplateBody;
    /**
     * The S3 bucket that contains the input file.
     */
    inputFileBucket: RegistryS3BucketName;
    /**
     * The name of input file within the S3 bucket. This file contains a newline delimited JSON file. Each line contains the parameter values to provision one device (thing).
     */
    inputFileKey: RegistryS3KeyName;
    /**
     * The IAM role ARN that grants permission the input file.
     */
    roleArn: RoleArn;
  }
  export interface StartThingRegistrationTaskResponse {
    /**
     * The bulk thing provisioning task ID.
     */
    taskId?: TaskId;
  }
  export type StateMachineName = string;
  export type StateReason = string;
  export type StateValue = string;
  export interface StatisticalThreshold {
    /**
     * The percentile that resolves to a threshold value by which compliance with a behavior is determined. Metrics are collected over the specified period (durationSeconds) from all reporting devices in your account and statistical ranks are calculated. Then, the measurements from a device are collected over the same period. If the accumulated measurements from the device fall above or below (comparisonOperator) the value associated with the percentile specified, then the device is considered to be in compliance with the behavior, otherwise a violation occurs.
     */
    statistic?: EvaluationStatistic;
  }
  export interface Statistics {
    /**
     * The count of things that match the query string criteria and contain a valid aggregation field value.
     */
    count?: Count;
    /**
     * The average of the aggregated field values.
     */
    average?: Average;
    /**
     * The sum of the aggregated field values.
     */
    sum?: Sum;
    /**
     * The minimum aggregated field value.
     */
    minimum?: Minimum;
    /**
     * The maximum aggregated field value.
     */
    maximum?: Maximum;
    /**
     * The sum of the squares of the aggregated field values.
     */
    sumOfSquares?: SumOfSquares;
    /**
     * The variance of the aggregated field values.
     */
    variance?: Variance;
    /**
     * The standard deviation of the aggregated field values.
     */
    stdDeviation?: StdDeviation;
  }
  export type Status = "InProgress"|"Completed"|"Failed"|"Cancelled"|"Cancelling"|string;
  export type StdDeviation = number;
  export interface StepFunctionsAction {
    /**
     * (Optional) A name will be given to the state machine execution consisting of this prefix followed by a UUID. Step Functions automatically creates a unique name for each state machine execution if one is not provided.
     */
    executionNamePrefix?: ExecutionNamePrefix;
    /**
     * The name of the Step Functions state machine whose execution will be started.
     */
    stateMachineName: StateMachineName;
    /**
     * The ARN of the role that grants IoT permission to start execution of a state machine ("Action":"states:StartExecution").
     */
    roleArn: AwsArn;
  }
  export interface StopThingRegistrationTaskRequest {
    /**
     * The bulk thing provisioning task ID.
     */
    taskId: TaskId;
  }
  export interface StopThingRegistrationTaskResponse {
  }
  export interface Stream {
    /**
     * The stream ID.
     */
    streamId?: StreamId;
    /**
     * The ID of a file associated with a stream.
     */
    fileId?: FileId;
  }
  export type StreamArn = string;
  export type StreamDescription = string;
  export interface StreamFile {
    /**
     * The file ID.
     */
    fileId?: FileId;
    /**
     * The location of the file in S3.
     */
    s3Location?: S3Location;
  }
  export type StreamFiles = StreamFile[];
  export type StreamId = string;
  export interface StreamInfo {
    /**
     * The stream ID.
     */
    streamId?: StreamId;
    /**
     * The stream ARN.
     */
    streamArn?: StreamArn;
    /**
     * The stream version.
     */
    streamVersion?: StreamVersion;
    /**
     * The description of the stream.
     */
    description?: StreamDescription;
    /**
     * The files to stream.
     */
    files?: StreamFiles;
    /**
     * The date when the stream was created.
     */
    createdAt?: DateType;
    /**
     * The date when the stream was last updated.
     */
    lastUpdatedAt?: DateType;
    /**
     * An IAM role IoT assumes to access your S3 files.
     */
    roleArn?: RoleArn;
  }
  export type StreamName = string;
  export interface StreamSummary {
    /**
     * The stream ID.
     */
    streamId?: StreamId;
    /**
     * The stream ARN.
     */
    streamArn?: StreamArn;
    /**
     * The stream version.
     */
    streamVersion?: StreamVersion;
    /**
     * A description of the stream.
     */
    description?: StreamDescription;
  }
  export type StreamVersion = number;
  export type StreamsSummary = StreamSummary[];
  export type String = string;
  export type StringDateTime = string;
  export type StringList = stringValue[];
  export type StringMap = {[key: string]: String};
  export type SubnetId = string;
  export type SubnetIdList = SubnetId[];
  export type SucceededFindingsCount = number;
  export type SucceededThings = number;
  export type Sum = number;
  export type SumOfSquares = number;
  export type SuppressAlerts = boolean;
  export type SuppressIndefinitely = boolean;
  export type SuppressedNonCompliantResourcesCount = number;
  export type TableName = string;
  export interface Tag {
    /**
     * The tag's key.
     */
    Key: TagKey;
    /**
     * The tag's value.
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: ResourceArn;
    /**
     * The new or modified tags for the resource.
     */
    tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Target = string;
  export type TargetArn = string;
  export type TargetAuditCheckNames = AuditCheckName[];
  export type TargetSelection = "CONTINUOUS"|"SNAPSHOT"|string;
  export type TargetViolationIdsForDetectMitigationActions = ViolationId[];
  export type Targets = Target[];
  export type TaskId = string;
  export type TaskIdList = TaskId[];
  export interface TaskStatistics {
    /**
     * The number of checks in this audit.
     */
    totalChecks?: TotalChecksCount;
    /**
     * The number of checks in progress.
     */
    inProgressChecks?: InProgressChecksCount;
    /**
     * The number of checks waiting for data collection.
     */
    waitingForDataCollectionChecks?: WaitingForDataCollectionChecksCount;
    /**
     * The number of checks that found compliant resources.
     */
    compliantChecks?: CompliantChecksCount;
    /**
     * The number of checks that found noncompliant resources.
     */
    nonCompliantChecks?: NonCompliantChecksCount;
    /**
     * The number of checks.
     */
    failedChecks?: FailedChecksCount;
    /**
     * The number of checks that did not run because the audit was canceled.
     */
    canceledChecks?: CanceledChecksCount;
  }
  export interface TaskStatisticsForAuditCheck {
    /**
     * The total number of findings to which a task is being applied.
     */
    totalFindingsCount?: TotalFindingsCount;
    /**
     * The number of findings for which at least one of the actions failed when applied.
     */
    failedFindingsCount?: FailedFindingsCount;
    /**
     * The number of findings for which all mitigation actions succeeded when applied.
     */
    succeededFindingsCount?: SucceededFindingsCount;
    /**
     * The number of findings skipped because of filter conditions provided in the parameters to the command.
     */
    skippedFindingsCount?: SkippedFindingsCount;
    /**
     * The number of findings to which the mitigation action task was canceled when applied.
     */
    canceledFindingsCount?: CanceledFindingsCount;
  }
  export type TemplateArn = string;
  export type TemplateBody = string;
  export type TemplateDescription = string;
  export type TemplateName = string;
  export type TemplateType = "FLEET_PROVISIONING"|"JITP"|string;
  export type TemplateVersionId = number;
  export interface TermsAggregation {
    /**
     * The number of buckets to return in the response. Default to 10.
     */
    maxBuckets?: MaxBuckets;
  }
  export interface TestAuthorizationRequest {
    /**
     * The principal. Valid principals are CertificateArn (arn:aws:iot:region:accountId:cert/certificateId), thingGroupArn (arn:aws:iot:region:accountId:thinggroup/groupName) and CognitoId (region:id).
     */
    principal?: Principal;
    /**
     * The Cognito identity pool ID.
     */
    cognitoIdentityPoolId?: CognitoIdentityPoolId;
    /**
     * A list of authorization info objects. Simulating authorization will create a response for each authInfo object in the list.
     */
    authInfos: AuthInfos;
    /**
     * The MQTT client ID.
     */
    clientId?: ClientId;
    /**
     * When testing custom authorization, the policies specified here are treated as if they are attached to the principal being authorized.
     */
    policyNamesToAdd?: PolicyNames;
    /**
     * When testing custom authorization, the policies specified here are treated as if they are not attached to the principal being authorized.
     */
    policyNamesToSkip?: PolicyNames;
  }
  export interface TestAuthorizationResponse {
    /**
     * The authentication results.
     */
    authResults?: AuthResults;
  }
  export interface TestInvokeAuthorizerRequest {
    /**
     * The custom authorizer name.
     */
    authorizerName: AuthorizerName;
    /**
     * The token returned by your custom authentication service.
     */
    token?: Token;
    /**
     * The signature made with the token and your custom authentication service's private key. This value must be Base-64-encoded.
     */
    tokenSignature?: TokenSignature;
    /**
     * Specifies a test HTTP authorization request.
     */
    httpContext?: HttpContext;
    /**
     * Specifies a test MQTT authorization request.
     */
    mqttContext?: MqttContext;
    /**
     * Specifies a test TLS authorization request.
     */
    tlsContext?: TlsContext;
  }
  export interface TestInvokeAuthorizerResponse {
    /**
     * True if the token is authenticated, otherwise false.
     */
    isAuthenticated?: IsAuthenticated;
    /**
     * The principal ID.
     */
    principalId?: PrincipalId;
    /**
     * IAM policy documents.
     */
    policyDocuments?: PolicyDocuments;
    /**
     * The number of seconds after which the temporary credentials are refreshed.
     */
    refreshAfterInSeconds?: Seconds;
    /**
     * The number of seconds after which the connection is terminated.
     */
    disconnectAfterInSeconds?: Seconds;
  }
  export type ThingArn = string;
  export interface ThingAttribute {
    /**
     * The name of the thing.
     */
    thingName?: ThingName;
    /**
     * The name of the thing type, if the thing has been associated with a type.
     */
    thingTypeName?: ThingTypeName;
    /**
     * The thing ARN.
     */
    thingArn?: ThingArn;
    /**
     * A list of thing attributes which are name-value pairs.
     */
    attributes?: Attributes;
    /**
     * The version of the thing record in the registry.
     */
    version?: Version;
  }
  export type ThingAttributeList = ThingAttribute[];
  export interface ThingConnectivity {
    /**
     * True if the thing is connected to the Amazon Web Services IoT Core service; false if it is not connected.
     */
    connected?: Boolean;
    /**
     * The epoch time (in milliseconds) when the thing last connected or disconnected. If the thing has been disconnected for approximately an hour, the time value might be missing.
     */
    timestamp?: ConnectivityTimestamp;
    /**
     * The reason why the client is disconnected. If the thing has been disconnected for approximately an hour, the disconnectReason value might be missing.
     */
    disconnectReason?: DisconnectReason;
  }
  export type ThingConnectivityIndexingMode = "OFF"|"STATUS"|string;
  export interface ThingDocument {
    /**
     * The thing name.
     */
    thingName?: ThingName;
    /**
     * The thing ID.
     */
    thingId?: ThingId;
    /**
     * The thing type name.
     */
    thingTypeName?: ThingTypeName;
    /**
     * Thing group names.
     */
    thingGroupNames?: ThingGroupNameList;
    /**
     * The attributes.
     */
    attributes?: Attributes;
    /**
     * The unnamed shadow and named shadow. For more information about shadows, see IoT Device Shadow service. 
     */
    shadow?: JsonDocument;
    /**
     * Contains Device Defender data. For more information about Device Defender, see Device Defender. 
     */
    deviceDefender?: JsonDocument;
    /**
     * Indicates whether the thing is connected to the Amazon Web Services IoT Core service.
     */
    connectivity?: ThingConnectivity;
  }
  export type ThingDocumentList = ThingDocument[];
  export type ThingGroupArn = string;
  export type ThingGroupDescription = string;
  export interface ThingGroupDocument {
    /**
     * The thing group name.
     */
    thingGroupName?: ThingGroupName;
    /**
     * The thing group ID.
     */
    thingGroupId?: ThingGroupId;
    /**
     * The thing group description.
     */
    thingGroupDescription?: ThingGroupDescription;
    /**
     * The thing group attributes.
     */
    attributes?: Attributes;
    /**
     * Parent group names.
     */
    parentGroupNames?: ThingGroupNameList;
  }
  export type ThingGroupDocumentList = ThingGroupDocument[];
  export type ThingGroupId = string;
  export interface ThingGroupIndexingConfiguration {
    /**
     * Thing group indexing mode.
     */
    thingGroupIndexingMode: ThingGroupIndexingMode;
    /**
     * Contains fields that are indexed and whose types are already known by the Fleet Indexing service. This is an optional field. For more information, see Managed fields in the Amazon Web Services IoT Core Developer Guide.
     */
    managedFields?: Fields;
    /**
     * A list of thing group fields to index. This list cannot contain any managed fields. Use the GetIndexingConfiguration API to get a list of managed fields. Contains custom field names and their data type.
     */
    customFields?: Fields;
  }
  export type ThingGroupIndexingMode = "OFF"|"ON"|string;
  export type ThingGroupList = ThingGroupName[];
  export interface ThingGroupMetadata {
    /**
     * The parent thing group name.
     */
    parentGroupName?: ThingGroupName;
    /**
     * The root parent thing group.
     */
    rootToParentThingGroups?: ThingGroupNameAndArnList;
    /**
     * The UNIX timestamp of when the thing group was created.
     */
    creationDate?: CreationDate;
  }
  export type ThingGroupName = string;
  export type ThingGroupNameAndArnList = GroupNameAndArn[];
  export type ThingGroupNameList = ThingGroupName[];
  export type ThingGroupNames = ThingGroupName[];
  export interface ThingGroupProperties {
    /**
     * The thing group description.
     */
    thingGroupDescription?: ThingGroupDescription;
    /**
     * The thing group attributes in JSON format.
     */
    attributePayload?: AttributePayload;
  }
  export type ThingId = string;
  export interface ThingIndexingConfiguration {
    /**
     * Thing indexing mode. Valid values are:   REGISTRY – Your thing index contains registry data only.   REGISTRY_AND_SHADOW - Your thing index contains registry and shadow data.   OFF - Thing indexing is disabled.  
     */
    thingIndexingMode: ThingIndexingMode;
    /**
     * Thing connectivity indexing mode. Valid values are:    STATUS – Your thing index contains connectivity status. To enable thing connectivity indexing, thingIndexMode must not be set to OFF.   OFF - Thing connectivity status indexing is disabled.  
     */
    thingConnectivityIndexingMode?: ThingConnectivityIndexingMode;
    /**
     * Device Defender indexing mode. Valid values are:   VIOLATIONS – Your thing index contains Device Defender violations. To enable Device Defender indexing, deviceDefenderIndexingMode must not be set to OFF.   OFF - Device Defender indexing is disabled.   For more information about Device Defender violations, see Device Defender Detect. 
     */
    deviceDefenderIndexingMode?: DeviceDefenderIndexingMode;
    /**
     * Named shadow indexing mode. Valid values are:   ON – Your thing index contains named shadow. To enable thing named shadow indexing, namedShadowIndexingMode must not be set to OFF.   OFF - Named shadow indexing is disabled.   For more information about Shadows, see IoT Device Shadow service. 
     */
    namedShadowIndexingMode?: NamedShadowIndexingMode;
    /**
     * Contains fields that are indexed and whose types are already known by the Fleet Indexing service.
     */
    managedFields?: Fields;
    /**
     * Contains custom field names and their data type.
     */
    customFields?: Fields;
    /**
     * Provides additional filters for specific data sources. Named shadow is the only data source that currently supports and requires a filter. To add named shadows to your fleet indexing configuration, set namedShadowIndexingMode to be ON and specify your shadow names in filter.
     */
    filter?: IndexingFilter;
  }
  export type ThingIndexingMode = "OFF"|"REGISTRY"|"REGISTRY_AND_SHADOW"|string;
  export type ThingName = string;
  export type ThingNameList = ThingName[];
  export type ThingTypeArn = string;
  export interface ThingTypeDefinition {
    /**
     * The name of the thing type.
     */
    thingTypeName?: ThingTypeName;
    /**
     * The thing type ARN.
     */
    thingTypeArn?: ThingTypeArn;
    /**
     * The ThingTypeProperties for the thing type.
     */
    thingTypeProperties?: ThingTypeProperties;
    /**
     * The ThingTypeMetadata contains additional information about the thing type including: creation date and time, a value indicating whether the thing type is deprecated, and a date and time when it was deprecated.
     */
    thingTypeMetadata?: ThingTypeMetadata;
  }
  export type ThingTypeDescription = string;
  export type ThingTypeId = string;
  export type ThingTypeList = ThingTypeDefinition[];
  export interface ThingTypeMetadata {
    /**
     * Whether the thing type is deprecated. If true, no new things could be associated with this type.
     */
    deprecated?: Boolean;
    /**
     * The date and time when the thing type was deprecated.
     */
    deprecationDate?: DeprecationDate;
    /**
     * The date and time when the thing type was created.
     */
    creationDate?: CreationDate;
  }
  export type ThingTypeName = string;
  export interface ThingTypeProperties {
    /**
     * The description of the thing type.
     */
    thingTypeDescription?: ThingTypeDescription;
    /**
     * A list of searchable thing attribute names.
     */
    searchableAttributes?: SearchableAttributes;
  }
  export type TimedOutThings = number;
  export interface TimeoutConfig {
    /**
     * Specifies the amount of time, in minutes, this device has to finish execution of this job. The timeout interval can be anywhere between 1 minute and 7 days (1 to 10080 minutes). The in progress timer can't be updated and will apply to all job executions for the job. Whenever a job execution remains in the IN_PROGRESS status for longer than this interval, the job execution will fail and switch to the terminal TIMED_OUT status.
     */
    inProgressTimeoutInMinutes?: InProgressTimeoutInMinutes;
  }
  export type Timestamp = Date;
  export interface TimestreamAction {
    /**
     * The ARN of the role that grants permission to write to the Amazon Timestream database table.
     */
    roleArn: AwsArn;
    /**
     * The name of an Amazon Timestream database.
     */
    databaseName: TimestreamDatabaseName;
    /**
     * The name of the database table into which to write the measure records.
     */
    tableName: TimestreamTableName;
    /**
     * Metadata attributes of the time series that are written in each measure record.
     */
    dimensions: TimestreamDimensionList;
    /**
     * Specifies an application-defined value to replace the default value assigned to the Timestream record's timestamp in the time column. You can use this property to specify the value and the precision of the Timestream record's timestamp. You can specify a value from the message payload or a value computed by a substitution template. If omitted, the topic rule action assigns the timestamp, in milliseconds, at the time it processed the rule. 
     */
    timestamp?: TimestreamTimestamp;
  }
  export type TimestreamDatabaseName = string;
  export interface TimestreamDimension {
    /**
     * The metadata dimension name. This is the name of the column in the Amazon Timestream database table record. Dimensions cannot be named: measure_name, measure_value, or time. These names are reserved. Dimension names cannot start with ts_ or measure_value and they cannot contain the colon (:) character.
     */
    name: TimestreamDimensionName;
    /**
     * The value to write in this column of the database record.
     */
    value: TimestreamDimensionValue;
  }
  export type TimestreamDimensionList = TimestreamDimension[];
  export type TimestreamDimensionName = string;
  export type TimestreamDimensionValue = string;
  export type TimestreamTableName = string;
  export interface TimestreamTimestamp {
    /**
     * An expression that returns a long epoch time value.
     */
    value: TimestreamTimestampValue;
    /**
     * The precision of the timestamp value that results from the expression described in value. Valid values: SECONDS | MILLISECONDS | MICROSECONDS | NANOSECONDS. The default is MILLISECONDS.
     */
    unit: TimestreamTimestampUnit;
  }
  export type TimestreamTimestampUnit = string;
  export type TimestreamTimestampValue = string;
  export type TinyMaxResults = number;
  export interface TlsConfig {
    /**
     * The security policy for a domain configuration. For more information, see Security policies  in the Amazon Web Services IoT Core developer guide.
     */
    securityPolicy?: SecurityPolicy;
  }
  export interface TlsContext {
    /**
     * The value of the serverName key in a TLS authorization request.
     */
    serverName?: ServerName;
  }
  export type Token = string;
  export type TokenKeyName = string;
  export type TokenSignature = string;
  export type Topic = string;
  export type TopicPattern = string;
  export interface TopicRule {
    /**
     * The name of the rule.
     */
    ruleName?: RuleName;
    /**
     * The SQL statement used to query the topic. When using a SQL query with multiple lines, be sure to escape the newline characters.
     */
    sql?: SQL;
    /**
     * The description of the rule.
     */
    description?: Description;
    /**
     * The date and time the rule was created.
     */
    createdAt?: CreatedAtDate;
    /**
     * The actions associated with the rule.
     */
    actions?: ActionList;
    /**
     * Specifies whether the rule is disabled.
     */
    ruleDisabled?: IsDisabled;
    /**
     * The version of the SQL rules engine to use when evaluating the rule.
     */
    awsIotSqlVersion?: AwsIotSqlVersion;
    /**
     * The action to perform when an error occurs.
     */
    errorAction?: Action;
  }
  export interface TopicRuleDestination {
    /**
     * The topic rule destination URL.
     */
    arn?: AwsArn;
    /**
     * The status of the topic rule destination. Valid values are:  IN_PROGRESS  A topic rule destination was created but has not been confirmed. You can set status to IN_PROGRESS by calling UpdateTopicRuleDestination. Calling UpdateTopicRuleDestination causes a new confirmation challenge to be sent to your confirmation endpoint.  ENABLED  Confirmation was completed, and traffic to this destination is allowed. You can set status to DISABLED by calling UpdateTopicRuleDestination.  DISABLED  Confirmation was completed, and traffic to this destination is not allowed. You can set status to ENABLED by calling UpdateTopicRuleDestination.  ERROR  Confirmation could not be completed, for example if the confirmation timed out. You can call GetTopicRuleDestination for details about the error. You can set status to IN_PROGRESS by calling UpdateTopicRuleDestination. Calling UpdateTopicRuleDestination causes a new confirmation challenge to be sent to your confirmation endpoint.  
     */
    status?: TopicRuleDestinationStatus;
    /**
     * The date and time when the topic rule destination was created.
     */
    createdAt?: CreatedAtDate;
    /**
     * The date and time when the topic rule destination was last updated.
     */
    lastUpdatedAt?: LastUpdatedAtDate;
    /**
     * Additional details or reason why the topic rule destination is in the current status.
     */
    statusReason?: String;
    /**
     * Properties of the HTTP URL.
     */
    httpUrlProperties?: HttpUrlDestinationProperties;
    /**
     * Properties of the virtual private cloud (VPC) connection.
     */
    vpcProperties?: VpcDestinationProperties;
  }
  export interface TopicRuleDestinationConfiguration {
    /**
     * Configuration of the HTTP URL.
     */
    httpUrlConfiguration?: HttpUrlDestinationConfiguration;
    /**
     * Configuration of the virtual private cloud (VPC) connection.
     */
    vpcConfiguration?: VpcDestinationConfiguration;
  }
  export type TopicRuleDestinationMaxResults = number;
  export type TopicRuleDestinationStatus = "ENABLED"|"IN_PROGRESS"|"DISABLED"|"ERROR"|"DELETING"|string;
  export type TopicRuleDestinationSummaries = TopicRuleDestinationSummary[];
  export interface TopicRuleDestinationSummary {
    /**
     * The topic rule destination ARN.
     */
    arn?: AwsArn;
    /**
     * The status of the topic rule destination. Valid values are:  IN_PROGRESS  A topic rule destination was created but has not been confirmed. You can set status to IN_PROGRESS by calling UpdateTopicRuleDestination. Calling UpdateTopicRuleDestination causes a new confirmation challenge to be sent to your confirmation endpoint.  ENABLED  Confirmation was completed, and traffic to this destination is allowed. You can set status to DISABLED by calling UpdateTopicRuleDestination.  DISABLED  Confirmation was completed, and traffic to this destination is not allowed. You can set status to ENABLED by calling UpdateTopicRuleDestination.  ERROR  Confirmation could not be completed, for example if the confirmation timed out. You can call GetTopicRuleDestination for details about the error. You can set status to IN_PROGRESS by calling UpdateTopicRuleDestination. Calling UpdateTopicRuleDestination causes a new confirmation challenge to be sent to your confirmation endpoint.  
     */
    status?: TopicRuleDestinationStatus;
    /**
     * The date and time when the topic rule destination was created.
     */
    createdAt?: CreatedAtDate;
    /**
     * The date and time when the topic rule destination was last updated.
     */
    lastUpdatedAt?: LastUpdatedAtDate;
    /**
     * The reason the topic rule destination is in the current status.
     */
    statusReason?: String;
    /**
     * Information about the HTTP URL.
     */
    httpUrlSummary?: HttpUrlDestinationSummary;
    /**
     * Information about the virtual private cloud (VPC) connection.
     */
    vpcDestinationSummary?: VpcDestinationSummary;
  }
  export type TopicRuleList = TopicRuleListItem[];
  export interface TopicRuleListItem {
    /**
     * The rule ARN.
     */
    ruleArn?: RuleArn;
    /**
     * The name of the rule.
     */
    ruleName?: RuleName;
    /**
     * The pattern for the topic names that apply.
     */
    topicPattern?: TopicPattern;
    /**
     * The date and time the rule was created.
     */
    createdAt?: CreatedAtDate;
    /**
     * Specifies whether the rule is disabled.
     */
    ruleDisabled?: IsDisabled;
  }
  export type TopicRuleMaxResults = number;
  export interface TopicRulePayload {
    /**
     * The SQL statement used to query the topic. For more information, see IoT SQL Reference in the IoT Developer Guide.
     */
    sql: SQL;
    /**
     * The description of the rule.
     */
    description?: Description;
    /**
     * The actions associated with the rule.
     */
    actions: ActionList;
    /**
     * Specifies whether the rule is disabled.
     */
    ruleDisabled?: IsDisabled;
    /**
     * The version of the SQL rules engine to use when evaluating the rule.
     */
    awsIotSqlVersion?: AwsIotSqlVersion;
    /**
     * The action to take when an error occurs.
     */
    errorAction?: Action;
  }
  export type TotalChecksCount = number;
  export type TotalFindingsCount = number;
  export type TotalResourcesCount = number;
  export interface TransferCertificateRequest {
    /**
     * The ID of the certificate. (The last part of the certificate ARN contains the certificate ID.)
     */
    certificateId: CertificateId;
    /**
     * The Amazon Web Services account.
     */
    targetAwsAccount: AwsAccountId;
    /**
     * The transfer message.
     */
    transferMessage?: Message;
  }
  export interface TransferCertificateResponse {
    /**
     * The ARN of the certificate.
     */
    transferredCertificateArn?: CertificateArn;
  }
  export interface TransferData {
    /**
     * The transfer message.
     */
    transferMessage?: Message;
    /**
     * The reason why the transfer was rejected.
     */
    rejectReason?: Message;
    /**
     * The date the transfer took place.
     */
    transferDate?: DateType;
    /**
     * The date the transfer was accepted.
     */
    acceptDate?: DateType;
    /**
     * The date the transfer was rejected.
     */
    rejectDate?: DateType;
  }
  export type UndoDeprecate = boolean;
  export type UnsetDefaultVersion = boolean;
  export type UnsignedLong = number;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: ResourceArn;
    /**
     * A list of the keys of the tags to be removed from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAccountAuditConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the role that grants permission to IoT to access information about your devices, policies, certificates, and other items as required when performing an audit.
     */
    roleArn?: RoleArn;
    /**
     * Information about the targets to which audit notifications are sent.
     */
    auditNotificationTargetConfigurations?: AuditNotificationTargetConfigurations;
    /**
     * Specifies which audit checks are enabled and disabled for this account. Use DescribeAccountAuditConfiguration to see the list of all checks, including those that are currently enabled. Some data collection might start immediately when certain checks are enabled. When a check is disabled, any data collected so far in relation to the check is deleted. You cannot disable a check if it's used by any scheduled audit. You must first delete the check from the scheduled audit or delete the scheduled audit itself. On the first call to UpdateAccountAuditConfiguration, this parameter is required and must specify at least one enabled check.
     */
    auditCheckConfigurations?: AuditCheckConfigurations;
  }
  export interface UpdateAccountAuditConfigurationResponse {
  }
  export interface UpdateAuditSuppressionRequest {
    checkName: AuditCheckName;
    resourceIdentifier: ResourceIdentifier;
    /**
     *  The expiration date (epoch timestamp in seconds) that you want the suppression to adhere to. 
     */
    expirationDate?: Timestamp;
    /**
     *  Indicates whether a suppression should exist indefinitely or not. 
     */
    suppressIndefinitely?: SuppressIndefinitely;
    /**
     *  The description of the audit suppression. 
     */
    description?: AuditDescription;
  }
  export interface UpdateAuditSuppressionResponse {
  }
  export interface UpdateAuthorizerRequest {
    /**
     * The authorizer name.
     */
    authorizerName: AuthorizerName;
    /**
     * The ARN of the authorizer's Lambda function.
     */
    authorizerFunctionArn?: AuthorizerFunctionArn;
    /**
     * The key used to extract the token from the HTTP headers. 
     */
    tokenKeyName?: TokenKeyName;
    /**
     * The public keys used to verify the token signature.
     */
    tokenSigningPublicKeys?: PublicKeyMap;
    /**
     * The status of the update authorizer request.
     */
    status?: AuthorizerStatus;
    /**
     * When true, the result from the authorizer’s Lambda function is cached for the time specified in refreshAfterInSeconds. The cached result is used while the device reuses the same HTTP connection.
     */
    enableCachingForHttp?: EnableCachingForHttp;
  }
  export interface UpdateAuthorizerResponse {
    /**
     * The authorizer name.
     */
    authorizerName?: AuthorizerName;
    /**
     * The authorizer ARN.
     */
    authorizerArn?: AuthorizerArn;
  }
  export interface UpdateBillingGroupRequest {
    /**
     * The name of the billing group.
     */
    billingGroupName: BillingGroupName;
    /**
     * The properties of the billing group.
     */
    billingGroupProperties: BillingGroupProperties;
    /**
     * The expected version of the billing group. If the version of the billing group does not match the expected version specified in the request, the UpdateBillingGroup request is rejected with a VersionConflictException.
     */
    expectedVersion?: OptionalVersion;
  }
  export interface UpdateBillingGroupResponse {
    /**
     * The latest version of the billing group.
     */
    version?: Version;
  }
  export interface UpdateCACertificateParams {
    /**
     * The action that you want to apply to the CA certificate. The only supported value is DEACTIVATE.
     */
    action: CACertificateUpdateAction;
  }
  export interface UpdateCACertificateRequest {
    /**
     * The CA certificate identifier.
     */
    certificateId: CertificateId;
    /**
     * The updated status of the CA certificate.  Note: The status value REGISTER_INACTIVE is deprecated and should not be used.
     */
    newStatus?: CACertificateStatus;
    /**
     * The new value for the auto registration status. Valid values are: "ENABLE" or "DISABLE".
     */
    newAutoRegistrationStatus?: AutoRegistrationStatus;
    /**
     * Information about the registration configuration.
     */
    registrationConfig?: RegistrationConfig;
    /**
     * If true, removes auto registration.
     */
    removeAutoRegistration?: RemoveAutoRegistration;
  }
  export interface UpdateCertificateRequest {
    /**
     * The ID of the certificate. (The last part of the certificate ARN contains the certificate ID.)
     */
    certificateId: CertificateId;
    /**
     * The new status.  Note: Setting the status to PENDING_TRANSFER or PENDING_ACTIVATION will result in an exception being thrown. PENDING_TRANSFER and PENDING_ACTIVATION are statuses used internally by IoT. They are not intended for developer use.  Note: The status value REGISTER_INACTIVE is deprecated and should not be used.
     */
    newStatus: CertificateStatus;
  }
  export interface UpdateCustomMetricRequest {
    /**
     *  The name of the custom metric. Cannot be updated. 
     */
    metricName: MetricName;
    /**
     *  Field represents a friendly name in the console for the custom metric, it doesn't have to be unique. Don't use this name as the metric identifier in the device metric report. Can be updated. 
     */
    displayName: CustomMetricDisplayName;
  }
  export interface UpdateCustomMetricResponse {
    /**
     *  The name of the custom metric. 
     */
    metricName?: MetricName;
    /**
     *  The Amazon Resource Number (ARN) of the custom metric. 
     */
    metricArn?: CustomMetricArn;
    /**
     *  The type of the custom metric.   The type number only takes a single metric value as an input, but while submitting the metrics value in the DeviceMetrics report, it must be passed as an array with a single value. 
     */
    metricType?: CustomMetricType;
    /**
     *  A friendly name in the console for the custom metric 
     */
    displayName?: CustomMetricDisplayName;
    /**
     *  The creation date of the custom metric in milliseconds since epoch. 
     */
    creationDate?: Timestamp;
    /**
     *  The time the custom metric was last modified in milliseconds since epoch. 
     */
    lastModifiedDate?: Timestamp;
  }
  export interface UpdateDeviceCertificateParams {
    /**
     * The action that you want to apply to the device certificate. The only supported value is DEACTIVATE.
     */
    action: DeviceCertificateUpdateAction;
  }
  export interface UpdateDimensionRequest {
    /**
     * A unique identifier for the dimension. Choose something that describes the type and value to make it easy to remember what it does.
     */
    name: DimensionName;
    /**
     * Specifies the value or list of values for the dimension. For TOPIC_FILTER dimensions, this is a pattern used to match the MQTT topic (for example, "admin/#").
     */
    stringValues: DimensionStringValues;
  }
  export interface UpdateDimensionResponse {
    /**
     * A unique identifier for the dimension.
     */
    name?: DimensionName;
    /**
     * The Amazon Resource Name (ARN)of the created dimension.
     */
    arn?: DimensionArn;
    /**
     * The type of the dimension.
     */
    type?: DimensionType;
    /**
     * The value or list of values used to scope the dimension. For example, for topic filters, this is the pattern used to match the MQTT topic name.
     */
    stringValues?: DimensionStringValues;
    /**
     * The date and time, in milliseconds since epoch, when the dimension was initially created.
     */
    creationDate?: Timestamp;
    /**
     * The date and time, in milliseconds since epoch, when the dimension was most recently updated.
     */
    lastModifiedDate?: Timestamp;
  }
  export interface UpdateDomainConfigurationRequest {
    /**
     * The name of the domain configuration to be updated.
     */
    domainConfigurationName: ReservedDomainConfigurationName;
    /**
     * An object that specifies the authorization service for a domain.
     */
    authorizerConfig?: AuthorizerConfig;
    /**
     * The status to which the domain configuration should be updated.
     */
    domainConfigurationStatus?: DomainConfigurationStatus;
    /**
     * Removes the authorization configuration from a domain.
     */
    removeAuthorizerConfig?: RemoveAuthorizerConfig;
    /**
     * An object that specifies the TLS configuration for a domain.
     */
    tlsConfig?: TlsConfig;
  }
  export interface UpdateDomainConfigurationResponse {
    /**
     * The name of the domain configuration that was updated.
     */
    domainConfigurationName?: ReservedDomainConfigurationName;
    /**
     * The ARN of the domain configuration that was updated.
     */
    domainConfigurationArn?: DomainConfigurationArn;
  }
  export interface UpdateDynamicThingGroupRequest {
    /**
     * The name of the dynamic thing group to update.
     */
    thingGroupName: ThingGroupName;
    /**
     * The dynamic thing group properties to update.
     */
    thingGroupProperties: ThingGroupProperties;
    /**
     * The expected version of the dynamic thing group to update.
     */
    expectedVersion?: OptionalVersion;
    /**
     * The dynamic thing group index to update.  Currently one index is supported: AWS_Things. 
     */
    indexName?: IndexName;
    /**
     * The dynamic thing group search query string to update.
     */
    queryString?: QueryString;
    /**
     * The dynamic thing group query version to update.  Currently one query version is supported: "2017-09-30". If not specified, the query version defaults to this value. 
     */
    queryVersion?: QueryVersion;
  }
  export interface UpdateDynamicThingGroupResponse {
    /**
     * The dynamic thing group version.
     */
    version?: Version;
  }
  export interface UpdateEventConfigurationsRequest {
    /**
     * The new event configuration values.
     */
    eventConfigurations?: EventConfigurations;
  }
  export interface UpdateEventConfigurationsResponse {
  }
  export interface UpdateFleetMetricRequest {
    /**
     * The name of the fleet metric to update.
     */
    metricName: FleetMetricName;
    /**
     * The search query string.
     */
    queryString?: QueryString;
    /**
     * The type of the aggregation query.
     */
    aggregationType?: AggregationType;
    /**
     * The time in seconds between fleet metric emissions. Range [60(1 min), 86400(1 day)] and must be multiple of 60.
     */
    period?: FleetMetricPeriod;
    /**
     * The field to aggregate.
     */
    aggregationField?: AggregationField;
    /**
     * The description of the fleet metric.
     */
    description?: FleetMetricDescription;
    /**
     * The version of the query.
     */
    queryVersion?: QueryVersion;
    /**
     * The name of the index to search.
     */
    indexName: IndexName;
    /**
     * Used to support unit transformation such as milliseconds to seconds. The unit must be supported by CW metric.
     */
    unit?: FleetMetricUnit;
    /**
     * The expected version of the fleet metric record in the registry.
     */
    expectedVersion?: OptionalVersion;
  }
  export interface UpdateIndexingConfigurationRequest {
    /**
     * Thing indexing configuration.
     */
    thingIndexingConfiguration?: ThingIndexingConfiguration;
    /**
     * Thing group indexing configuration.
     */
    thingGroupIndexingConfiguration?: ThingGroupIndexingConfiguration;
  }
  export interface UpdateIndexingConfigurationResponse {
  }
  export interface UpdateJobRequest {
    /**
     * The ID of the job to be updated.
     */
    jobId: JobId;
    /**
     * A short text description of the job.
     */
    description?: JobDescription;
    /**
     * Configuration information for pre-signed S3 URLs.
     */
    presignedUrlConfig?: PresignedUrlConfig;
    /**
     * Allows you to create a staged rollout of the job.
     */
    jobExecutionsRolloutConfig?: JobExecutionsRolloutConfig;
    /**
     * Allows you to create criteria to abort a job.
     */
    abortConfig?: AbortConfig;
    /**
     * Specifies the amount of time each device has to finish its execution of the job. The timer is started when the job execution status is set to IN_PROGRESS. If the job execution status is not set to another terminal state before the time expires, it will be automatically set to TIMED_OUT. 
     */
    timeoutConfig?: TimeoutConfig;
    /**
     * The namespace used to indicate that a job is a customer-managed job. When you specify a value for this parameter, Amazon Web Services IoT Core sends jobs notifications to MQTT topics that contain the value in the following format.  $aws/things/THING_NAME/jobs/JOB_ID/notify-namespace-NAMESPACE_ID/   The namespaceId feature is in public preview. 
     */
    namespaceId?: NamespaceId;
    /**
     * Allows you to create the criteria to retry a job.
     */
    jobExecutionsRetryConfig?: JobExecutionsRetryConfig;
  }
  export interface UpdateMitigationActionRequest {
    /**
     * The friendly name for the mitigation action. You cannot change the name by using UpdateMitigationAction. Instead, you must delete and recreate the mitigation action with the new name.
     */
    actionName: MitigationActionName;
    /**
     * The ARN of the IAM role that is used to apply the mitigation action.
     */
    roleArn?: RoleArn;
    /**
     * Defines the type of action and the parameters for that action.
     */
    actionParams?: MitigationActionParams;
  }
  export interface UpdateMitigationActionResponse {
    /**
     * The ARN for the new mitigation action.
     */
    actionArn?: MitigationActionArn;
    /**
     * A unique identifier for the mitigation action.
     */
    actionId?: MitigationActionId;
  }
  export interface UpdatePackageConfigurationRequest {
    /**
     * Configuration to manage job's package version reporting. This updates the thing's reserved named shadow that the job targets.
     */
    versionUpdateByJobsConfig?: VersionUpdateByJobsConfig;
    /**
     * A unique case-sensitive identifier that you can provide to ensure the idempotency of the request. Don't reuse this client token if a new idempotent request is required.
     */
    clientToken?: ClientToken;
  }
  export interface UpdatePackageConfigurationResponse {
  }
  export interface UpdatePackageRequest {
    /**
     * The name of the target software package.
     */
    packageName: PackageName;
    /**
     * The package description.
     */
    description?: ResourceDescription;
    /**
     * The name of the default package version.  Note: You cannot name a defaultVersion and set unsetDefaultVersion equal to true at the same time.
     */
    defaultVersionName?: VersionName;
    /**
     * Indicates whether you want to remove the named default package version from the software package. Set as true to remove the default package version.   Note: You cannot name a defaultVersion and set unsetDefaultVersion equal to true at the same time.
     */
    unsetDefaultVersion?: UnsetDefaultVersion;
    /**
     * A unique case-sensitive identifier that you can provide to ensure the idempotency of the request. Don't reuse this client token if a new idempotent request is required.
     */
    clientToken?: ClientToken;
  }
  export interface UpdatePackageResponse {
  }
  export interface UpdatePackageVersionRequest {
    /**
     * The name of the associated software package.
     */
    packageName: PackageName;
    /**
     * The name of the target package version.
     */
    versionName: VersionName;
    /**
     * The package version description.
     */
    description?: ResourceDescription;
    /**
     * Metadata that can be used to define a package version’s configuration. For example, the Amazon S3 file location, configuration options that are being sent to the device or fleet.   Note: Attributes can be updated only when the package version is in a draft state. The combined size of all the attributes on a package version is limited to 3KB.
     */
    attributes?: ResourceAttributes;
    /**
     * The status that the package version should be assigned. For more information, see Package version lifecycle.
     */
    action?: PackageVersionAction;
    /**
     * A unique case-sensitive identifier that you can provide to ensure the idempotency of the request. Don't reuse this client token if a new idempotent request is required.
     */
    clientToken?: ClientToken;
  }
  export interface UpdatePackageVersionResponse {
  }
  export interface UpdateProvisioningTemplateRequest {
    /**
     * The name of the provisioning template.
     */
    templateName: TemplateName;
    /**
     * The description of the provisioning template.
     */
    description?: TemplateDescription;
    /**
     * True to enable the provisioning template, otherwise false.
     */
    enabled?: Enabled;
    /**
     * The ID of the default provisioning template version.
     */
    defaultVersionId?: TemplateVersionId;
    /**
     * The ARN of the role associated with the provisioning template. This IoT role grants permission to provision a device.
     */
    provisioningRoleArn?: RoleArn;
    /**
     * Updates the pre-provisioning hook template. Only supports template of type FLEET_PROVISIONING. For more information about provisioning template types, see type.
     */
    preProvisioningHook?: ProvisioningHook;
    /**
     * Removes pre-provisioning hook template.
     */
    removePreProvisioningHook?: RemoveHook;
  }
  export interface UpdateProvisioningTemplateResponse {
  }
  export interface UpdateRoleAliasRequest {
    /**
     * The role alias to update.
     */
    roleAlias: RoleAlias;
    /**
     * The role ARN.
     */
    roleArn?: RoleArn;
    /**
     * The number of seconds the credential will be valid. This value must be less than or equal to the maximum session duration of the IAM role that the role alias references.
     */
    credentialDurationSeconds?: CredentialDurationSeconds;
  }
  export interface UpdateRoleAliasResponse {
    /**
     * The role alias.
     */
    roleAlias?: RoleAlias;
    /**
     * The role alias ARN.
     */
    roleAliasArn?: RoleAliasArn;
  }
  export interface UpdateScheduledAuditRequest {
    /**
     * How often the scheduled audit takes place, either DAILY, WEEKLY, BIWEEKLY, or MONTHLY. The start time of each audit is determined by the system.
     */
    frequency?: AuditFrequency;
    /**
     * The day of the month on which the scheduled audit takes place. This can be 1 through 31 or LAST. This field is required if the frequency parameter is set to MONTHLY. If days 29-31 are specified, and the month does not have that many days, the audit takes place on the "LAST" day of the month.
     */
    dayOfMonth?: DayOfMonth;
    /**
     * The day of the week on which the scheduled audit takes place. This can be one of SUN, MON, TUE, WED, THU, FRI, or SAT. This field is required if the "frequency" parameter is set to WEEKLY or BIWEEKLY.
     */
    dayOfWeek?: DayOfWeek;
    /**
     * Which checks are performed during the scheduled audit. Checks must be enabled for your account. (Use DescribeAccountAuditConfiguration to see the list of all checks, including those that are enabled or use UpdateAccountAuditConfiguration to select which checks are enabled.)
     */
    targetCheckNames?: TargetAuditCheckNames;
    /**
     * The name of the scheduled audit. (Max. 128 chars)
     */
    scheduledAuditName: ScheduledAuditName;
  }
  export interface UpdateScheduledAuditResponse {
    /**
     * The ARN of the scheduled audit.
     */
    scheduledAuditArn?: ScheduledAuditArn;
  }
  export interface UpdateSecurityProfileRequest {
    /**
     * The name of the security profile you want to update.
     */
    securityProfileName: SecurityProfileName;
    /**
     * A description of the security profile.
     */
    securityProfileDescription?: SecurityProfileDescription;
    /**
     * Specifies the behaviors that, when violated by a device (thing), cause an alert.
     */
    behaviors?: Behaviors;
    /**
     * Where the alerts are sent. (Alerts are always sent to the console.)
     */
    alertTargets?: AlertTargets;
    /**
     *  Please use UpdateSecurityProfileRequest$additionalMetricsToRetainV2 instead.  A list of metrics whose data is retained (stored). By default, data is retained for any metric used in the profile's behaviors, but it is also retained for any metric specified here. Can be used with custom metrics; cannot be used with dimensions.
     */
    additionalMetricsToRetain?: AdditionalMetricsToRetainList;
    /**
     * A list of metrics whose data is retained (stored). By default, data is retained for any metric used in the profile's behaviors, but it is also retained for any metric specified here. Can be used with custom metrics; cannot be used with dimensions.
     */
    additionalMetricsToRetainV2?: AdditionalMetricsToRetainV2List;
    /**
     * If true, delete all behaviors defined for this security profile. If any behaviors are defined in the current invocation, an exception occurs.
     */
    deleteBehaviors?: DeleteBehaviors;
    /**
     * If true, delete all alertTargets defined for this security profile. If any alertTargets are defined in the current invocation, an exception occurs.
     */
    deleteAlertTargets?: DeleteAlertTargets;
    /**
     * If true, delete all additionalMetricsToRetain defined for this security profile. If any additionalMetricsToRetain are defined in the current invocation, an exception occurs.
     */
    deleteAdditionalMetricsToRetain?: DeleteAdditionalMetricsToRetain;
    /**
     * The expected version of the security profile. A new version is generated whenever the security profile is updated. If you specify a value that is different from the actual version, a VersionConflictException is thrown.
     */
    expectedVersion?: OptionalVersion;
  }
  export interface UpdateSecurityProfileResponse {
    /**
     * The name of the security profile that was updated.
     */
    securityProfileName?: SecurityProfileName;
    /**
     * The ARN of the security profile that was updated.
     */
    securityProfileArn?: SecurityProfileArn;
    /**
     * The description of the security profile.
     */
    securityProfileDescription?: SecurityProfileDescription;
    /**
     * Specifies the behaviors that, when violated by a device (thing), cause an alert.
     */
    behaviors?: Behaviors;
    /**
     * Where the alerts are sent. (Alerts are always sent to the console.)
     */
    alertTargets?: AlertTargets;
    /**
     *  Please use UpdateSecurityProfileResponse$additionalMetricsToRetainV2 instead.  A list of metrics whose data is retained (stored). By default, data is retained for any metric used in the security profile's behaviors, but it is also retained for any metric specified here.
     */
    additionalMetricsToRetain?: AdditionalMetricsToRetainList;
    /**
     * A list of metrics whose data is retained (stored). By default, data is retained for any metric used in the profile's behaviors, but it is also retained for any metric specified here. Can be used with custom metrics; cannot be used with dimensions.
     */
    additionalMetricsToRetainV2?: AdditionalMetricsToRetainV2List;
    /**
     * The updated version of the security profile.
     */
    version?: Version;
    /**
     * The time the security profile was created.
     */
    creationDate?: Timestamp;
    /**
     * The time the security profile was last modified.
     */
    lastModifiedDate?: Timestamp;
  }
  export interface UpdateStreamRequest {
    /**
     * The stream ID.
     */
    streamId: StreamId;
    /**
     * The description of the stream.
     */
    description?: StreamDescription;
    /**
     * The files associated with the stream.
     */
    files?: StreamFiles;
    /**
     * An IAM role that allows the IoT service principal assumes to access your S3 files.
     */
    roleArn?: RoleArn;
  }
  export interface UpdateStreamResponse {
    /**
     * The stream ID.
     */
    streamId?: StreamId;
    /**
     * The stream ARN.
     */
    streamArn?: StreamArn;
    /**
     * A description of the stream.
     */
    description?: StreamDescription;
    /**
     * The stream version.
     */
    streamVersion?: StreamVersion;
  }
  export interface UpdateThingGroupRequest {
    /**
     * The thing group to update.
     */
    thingGroupName: ThingGroupName;
    /**
     * The thing group properties.
     */
    thingGroupProperties: ThingGroupProperties;
    /**
     * The expected version of the thing group. If this does not match the version of the thing group being updated, the update will fail.
     */
    expectedVersion?: OptionalVersion;
  }
  export interface UpdateThingGroupResponse {
    /**
     * The version of the updated thing group.
     */
    version?: Version;
  }
  export interface UpdateThingGroupsForThingRequest {
    /**
     * The thing whose group memberships will be updated.
     */
    thingName?: ThingName;
    /**
     * The groups to which the thing will be added.
     */
    thingGroupsToAdd?: ThingGroupList;
    /**
     * The groups from which the thing will be removed.
     */
    thingGroupsToRemove?: ThingGroupList;
    /**
     * Override dynamic thing groups with static thing groups when 10-group limit is reached. If a thing belongs to 10 thing groups, and one or more of those groups are dynamic thing groups, adding a thing to a static group removes the thing from the last dynamic group.
     */
    overrideDynamicGroups?: OverrideDynamicGroups;
  }
  export interface UpdateThingGroupsForThingResponse {
  }
  export interface UpdateThingRequest {
    /**
     * The name of the thing to update. You can't change a thing's name. To change a thing's name, you must create a new thing, give it the new name, and then delete the old thing.
     */
    thingName: ThingName;
    /**
     * The name of the thing type.
     */
    thingTypeName?: ThingTypeName;
    /**
     * A list of thing attributes, a JSON string containing name-value pairs. For example:  {\"attributes\":{\"name1\":\"value2\"}}  This data is used to add new attributes or update existing attributes.
     */
    attributePayload?: AttributePayload;
    /**
     * The expected version of the thing record in the registry. If the version of the record in the registry does not match the expected version specified in the request, the UpdateThing request is rejected with a VersionConflictException.
     */
    expectedVersion?: OptionalVersion;
    /**
     * Remove a thing type association. If true, the association is removed.
     */
    removeThingType?: RemoveThingType;
  }
  export interface UpdateThingResponse {
  }
  export interface UpdateTopicRuleDestinationRequest {
    /**
     * The ARN of the topic rule destination.
     */
    arn: AwsArn;
    /**
     * The status of the topic rule destination. Valid values are:  IN_PROGRESS  A topic rule destination was created but has not been confirmed. You can set status to IN_PROGRESS by calling UpdateTopicRuleDestination. Calling UpdateTopicRuleDestination causes a new confirmation challenge to be sent to your confirmation endpoint.  ENABLED  Confirmation was completed, and traffic to this destination is allowed. You can set status to DISABLED by calling UpdateTopicRuleDestination.  DISABLED  Confirmation was completed, and traffic to this destination is not allowed. You can set status to ENABLED by calling UpdateTopicRuleDestination.  ERROR  Confirmation could not be completed, for example if the confirmation timed out. You can call GetTopicRuleDestination for details about the error. You can set status to IN_PROGRESS by calling UpdateTopicRuleDestination. Calling UpdateTopicRuleDestination causes a new confirmation challenge to be sent to your confirmation endpoint.  
     */
    status: TopicRuleDestinationStatus;
  }
  export interface UpdateTopicRuleDestinationResponse {
  }
  export type Url = string;
  export type UseBase64 = boolean;
  export type UserProperties = UserProperty[];
  export interface UserProperty {
    /**
     * A key to be specified in UserProperty.
     */
    key: UserPropertyKey;
    /**
     * A value to be specified in UserProperty.
     */
    value: UserPropertyValue;
  }
  export type UserPropertyKey = string;
  export type UserPropertyValue = string;
  export type Valid = boolean;
  export interface ValidateSecurityProfileBehaviorsRequest {
    /**
     * Specifies the behaviors that, when violated by a device (thing), cause an alert.
     */
    behaviors: Behaviors;
  }
  export interface ValidateSecurityProfileBehaviorsResponse {
    /**
     * True if the behaviors were valid.
     */
    valid?: Valid;
    /**
     * The list of any errors found in the behaviors.
     */
    validationErrors?: ValidationErrors;
  }
  export interface ValidationError {
    /**
     * The description of an error found in the behaviors.
     */
    errorMessage?: ErrorMessage;
  }
  export type ValidationErrors = ValidationError[];
  export type Value = string;
  export type Variance = number;
  export type VerificationState = "FALSE_POSITIVE"|"BENIGN_POSITIVE"|"TRUE_POSITIVE"|"UNKNOWN"|string;
  export type VerificationStateDescription = string;
  export type Version = number;
  export type VersionName = string;
  export type VersionNumber = number;
  export interface VersionUpdateByJobsConfig {
    /**
     * Indicates whether the Job is enabled or not.
     */
    enabled?: EnabledBoolean;
    /**
     * The Amazon Resource Name (ARN) of the role that grants permission to the IoT jobs service to update the reserved named shadow when the job successfully completes.
     */
    roleArn?: RoleArn;
  }
  export interface ViolationEvent {
    /**
     * The ID of the violation event.
     */
    violationId?: ViolationId;
    /**
     * The name of the thing responsible for the violation event.
     */
    thingName?: DeviceDefenderThingName;
    /**
     * The name of the security profile whose behavior was violated.
     */
    securityProfileName?: SecurityProfileName;
    /**
     * The behavior that was violated.
     */
    behavior?: Behavior;
    /**
     * The value of the metric (the measurement).
     */
    metricValue?: MetricValue;
    /**
     *  The details of a violation event. 
     */
    violationEventAdditionalInfo?: ViolationEventAdditionalInfo;
    /**
     * The type of violation event.
     */
    violationEventType?: ViolationEventType;
    /**
     * The verification state of the violation (detect alarm).
     */
    verificationState?: VerificationState;
    /**
     * The description of the verification state of the violation.
     */
    verificationStateDescription?: VerificationStateDescription;
    /**
     * The time the violation event occurred.
     */
    violationEventTime?: Timestamp;
  }
  export interface ViolationEventAdditionalInfo {
    /**
     *  The sensitivity of anomalous behavior evaluation. Can be Low, Medium, or High. 
     */
    confidenceLevel?: ConfidenceLevel;
  }
  export interface ViolationEventOccurrenceRange {
    /**
     *  The start date and time of a time period in which violation events occurred. 
     */
    startTime: Timestamp;
    /**
     *  The end date and time of a time period in which violation events occurred. 
     */
    endTime: Timestamp;
  }
  export type ViolationEventType = "in-alarm"|"alarm-cleared"|"alarm-invalidated"|string;
  export type ViolationEvents = ViolationEvent[];
  export type ViolationId = string;
  export interface VpcDestinationConfiguration {
    /**
     * The subnet IDs of the VPC destination.
     */
    subnetIds: SubnetIdList;
    /**
     * The security groups of the VPC destination.
     */
    securityGroups?: SecurityGroupList;
    /**
     * The ID of the VPC.
     */
    vpcId: VpcId;
    /**
     * The ARN of a role that has permission to create and attach to elastic network interfaces (ENIs).
     */
    roleArn: AwsArn;
  }
  export interface VpcDestinationProperties {
    /**
     * The subnet IDs of the VPC destination.
     */
    subnetIds?: SubnetIdList;
    /**
     * The security groups of the VPC destination.
     */
    securityGroups?: SecurityGroupList;
    /**
     * The ID of the VPC.
     */
    vpcId?: VpcId;
    /**
     * The ARN of a role that has permission to create and attach to elastic network interfaces (ENIs).
     */
    roleArn?: AwsArn;
  }
  export interface VpcDestinationSummary {
    /**
     * The subnet IDs of the VPC destination.
     */
    subnetIds?: SubnetIdList;
    /**
     * The security groups of the VPC destination.
     */
    securityGroups?: SecurityGroupList;
    /**
     * The ID of the VPC.
     */
    vpcId?: VpcId;
    /**
     * The ARN of a role that has permission to create and attach to elastic network interfaces (ENIs).
     */
    roleArn?: AwsArn;
  }
  export type VpcId = string;
  export type WaitingForDataCollectionChecksCount = number;
  export type stringValue = string;
  export type usePrefixAttributeValue = boolean;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2015-05-28"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Iot client.
   */
  export import Types = Iot;
}
export = Iot;
