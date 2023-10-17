import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Transfer extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Transfer.Types.ClientConfiguration)
  config: Config & Transfer.Types.ClientConfiguration;
  /**
   * Used by administrators to choose which groups in the directory should have access to upload and download files over the enabled protocols using Transfer Family. For example, a Microsoft Active Directory might contain 50,000 users, but only a small fraction might need the ability to transfer files to the server. An administrator can use CreateAccess to limit the access to the correct set of users who need this ability.
   */
  createAccess(params: Transfer.Types.CreateAccessRequest, callback?: (err: AWSError, data: Transfer.Types.CreateAccessResponse) => void): Request<Transfer.Types.CreateAccessResponse, AWSError>;
  /**
   * Used by administrators to choose which groups in the directory should have access to upload and download files over the enabled protocols using Transfer Family. For example, a Microsoft Active Directory might contain 50,000 users, but only a small fraction might need the ability to transfer files to the server. An administrator can use CreateAccess to limit the access to the correct set of users who need this ability.
   */
  createAccess(callback?: (err: AWSError, data: Transfer.Types.CreateAccessResponse) => void): Request<Transfer.Types.CreateAccessResponse, AWSError>;
  /**
   * Creates an agreement. An agreement is a bilateral trading partner agreement, or partnership, between an Transfer Family server and an AS2 process. The agreement defines the file and message transfer relationship between the server and the AS2 process. To define an agreement, Transfer Family combines a server, local profile, partner profile, certificate, and other attributes. The partner is identified with the PartnerProfileId, and the AS2 process is identified with the LocalProfileId.
   */
  createAgreement(params: Transfer.Types.CreateAgreementRequest, callback?: (err: AWSError, data: Transfer.Types.CreateAgreementResponse) => void): Request<Transfer.Types.CreateAgreementResponse, AWSError>;
  /**
   * Creates an agreement. An agreement is a bilateral trading partner agreement, or partnership, between an Transfer Family server and an AS2 process. The agreement defines the file and message transfer relationship between the server and the AS2 process. To define an agreement, Transfer Family combines a server, local profile, partner profile, certificate, and other attributes. The partner is identified with the PartnerProfileId, and the AS2 process is identified with the LocalProfileId.
   */
  createAgreement(callback?: (err: AWSError, data: Transfer.Types.CreateAgreementResponse) => void): Request<Transfer.Types.CreateAgreementResponse, AWSError>;
  /**
   * Creates the connector, which captures the parameters for a connection for the AS2 or SFTP protocol. For AS2, the connector is required for sending files to an externally hosted AS2 server. For SFTP, the connector is required when sending files to an SFTP server or receiving files from an SFTP server. For more details about connectors, see Create AS2 connectors and Create SFTP connectors.  You must specify exactly one configuration object: either for AS2 (As2Config) or SFTP (SftpConfig). 
   */
  createConnector(params: Transfer.Types.CreateConnectorRequest, callback?: (err: AWSError, data: Transfer.Types.CreateConnectorResponse) => void): Request<Transfer.Types.CreateConnectorResponse, AWSError>;
  /**
   * Creates the connector, which captures the parameters for a connection for the AS2 or SFTP protocol. For AS2, the connector is required for sending files to an externally hosted AS2 server. For SFTP, the connector is required when sending files to an SFTP server or receiving files from an SFTP server. For more details about connectors, see Create AS2 connectors and Create SFTP connectors.  You must specify exactly one configuration object: either for AS2 (As2Config) or SFTP (SftpConfig). 
   */
  createConnector(callback?: (err: AWSError, data: Transfer.Types.CreateConnectorResponse) => void): Request<Transfer.Types.CreateConnectorResponse, AWSError>;
  /**
   * Creates the local or partner profile to use for AS2 transfers.
   */
  createProfile(params: Transfer.Types.CreateProfileRequest, callback?: (err: AWSError, data: Transfer.Types.CreateProfileResponse) => void): Request<Transfer.Types.CreateProfileResponse, AWSError>;
  /**
   * Creates the local or partner profile to use for AS2 transfers.
   */
  createProfile(callback?: (err: AWSError, data: Transfer.Types.CreateProfileResponse) => void): Request<Transfer.Types.CreateProfileResponse, AWSError>;
  /**
   * Instantiates an auto-scaling virtual server based on the selected file transfer protocol in Amazon Web Services. When you make updates to your file transfer protocol-enabled server or when you work with users, use the service-generated ServerId property that is assigned to the newly created server.
   */
  createServer(params: Transfer.Types.CreateServerRequest, callback?: (err: AWSError, data: Transfer.Types.CreateServerResponse) => void): Request<Transfer.Types.CreateServerResponse, AWSError>;
  /**
   * Instantiates an auto-scaling virtual server based on the selected file transfer protocol in Amazon Web Services. When you make updates to your file transfer protocol-enabled server or when you work with users, use the service-generated ServerId property that is assigned to the newly created server.
   */
  createServer(callback?: (err: AWSError, data: Transfer.Types.CreateServerResponse) => void): Request<Transfer.Types.CreateServerResponse, AWSError>;
  /**
   * Creates a user and associates them with an existing file transfer protocol-enabled server. You can only create and associate users with servers that have the IdentityProviderType set to SERVICE_MANAGED. Using parameters for CreateUser, you can specify the user name, set the home directory, store the user's public key, and assign the user's Identity and Access Management (IAM) role. You can also optionally add a session policy, and assign metadata with tags that can be used to group and search for users.
   */
  createUser(params: Transfer.Types.CreateUserRequest, callback?: (err: AWSError, data: Transfer.Types.CreateUserResponse) => void): Request<Transfer.Types.CreateUserResponse, AWSError>;
  /**
   * Creates a user and associates them with an existing file transfer protocol-enabled server. You can only create and associate users with servers that have the IdentityProviderType set to SERVICE_MANAGED. Using parameters for CreateUser, you can specify the user name, set the home directory, store the user's public key, and assign the user's Identity and Access Management (IAM) role. You can also optionally add a session policy, and assign metadata with tags that can be used to group and search for users.
   */
  createUser(callback?: (err: AWSError, data: Transfer.Types.CreateUserResponse) => void): Request<Transfer.Types.CreateUserResponse, AWSError>;
  /**
   *  Allows you to create a workflow with specified steps and step details the workflow invokes after file transfer completes. After creating a workflow, you can associate the workflow created with any transfer servers by specifying the workflow-details field in CreateServer and UpdateServer operations. 
   */
  createWorkflow(params: Transfer.Types.CreateWorkflowRequest, callback?: (err: AWSError, data: Transfer.Types.CreateWorkflowResponse) => void): Request<Transfer.Types.CreateWorkflowResponse, AWSError>;
  /**
   *  Allows you to create a workflow with specified steps and step details the workflow invokes after file transfer completes. After creating a workflow, you can associate the workflow created with any transfer servers by specifying the workflow-details field in CreateServer and UpdateServer operations. 
   */
  createWorkflow(callback?: (err: AWSError, data: Transfer.Types.CreateWorkflowResponse) => void): Request<Transfer.Types.CreateWorkflowResponse, AWSError>;
  /**
   * Allows you to delete the access specified in the ServerID and ExternalID parameters.
   */
  deleteAccess(params: Transfer.Types.DeleteAccessRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Allows you to delete the access specified in the ServerID and ExternalID parameters.
   */
  deleteAccess(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete the agreement that's specified in the provided AgreementId.
   */
  deleteAgreement(params: Transfer.Types.DeleteAgreementRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete the agreement that's specified in the provided AgreementId.
   */
  deleteAgreement(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the certificate that's specified in the CertificateId parameter.
   */
  deleteCertificate(params: Transfer.Types.DeleteCertificateRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the certificate that's specified in the CertificateId parameter.
   */
  deleteCertificate(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the connector that's specified in the provided ConnectorId.
   */
  deleteConnector(params: Transfer.Types.DeleteConnectorRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the connector that's specified in the provided ConnectorId.
   */
  deleteConnector(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the host key that's specified in the HostKeyId parameter.
   */
  deleteHostKey(params: Transfer.Types.DeleteHostKeyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the host key that's specified in the HostKeyId parameter.
   */
  deleteHostKey(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the profile that's specified in the ProfileId parameter.
   */
  deleteProfile(params: Transfer.Types.DeleteProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the profile that's specified in the ProfileId parameter.
   */
  deleteProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the file transfer protocol-enabled server that you specify. No response returns from this operation.
   */
  deleteServer(params: Transfer.Types.DeleteServerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the file transfer protocol-enabled server that you specify. No response returns from this operation.
   */
  deleteServer(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a user's Secure Shell (SSH) public key.
   */
  deleteSshPublicKey(params: Transfer.Types.DeleteSshPublicKeyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a user's Secure Shell (SSH) public key.
   */
  deleteSshPublicKey(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the user belonging to a file transfer protocol-enabled server you specify. No response returns from this operation.  When you delete a user from a server, the user's information is lost. 
   */
  deleteUser(params: Transfer.Types.DeleteUserRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the user belonging to a file transfer protocol-enabled server you specify. No response returns from this operation.  When you delete a user from a server, the user's information is lost. 
   */
  deleteUser(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified workflow.
   */
  deleteWorkflow(params: Transfer.Types.DeleteWorkflowRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified workflow.
   */
  deleteWorkflow(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Describes the access that is assigned to the specific file transfer protocol-enabled server, as identified by its ServerId property and its ExternalId. The response from this call returns the properties of the access that is associated with the ServerId value that was specified.
   */
  describeAccess(params: Transfer.Types.DescribeAccessRequest, callback?: (err: AWSError, data: Transfer.Types.DescribeAccessResponse) => void): Request<Transfer.Types.DescribeAccessResponse, AWSError>;
  /**
   * Describes the access that is assigned to the specific file transfer protocol-enabled server, as identified by its ServerId property and its ExternalId. The response from this call returns the properties of the access that is associated with the ServerId value that was specified.
   */
  describeAccess(callback?: (err: AWSError, data: Transfer.Types.DescribeAccessResponse) => void): Request<Transfer.Types.DescribeAccessResponse, AWSError>;
  /**
   * Describes the agreement that's identified by the AgreementId.
   */
  describeAgreement(params: Transfer.Types.DescribeAgreementRequest, callback?: (err: AWSError, data: Transfer.Types.DescribeAgreementResponse) => void): Request<Transfer.Types.DescribeAgreementResponse, AWSError>;
  /**
   * Describes the agreement that's identified by the AgreementId.
   */
  describeAgreement(callback?: (err: AWSError, data: Transfer.Types.DescribeAgreementResponse) => void): Request<Transfer.Types.DescribeAgreementResponse, AWSError>;
  /**
   * Describes the certificate that's identified by the CertificateId.
   */
  describeCertificate(params: Transfer.Types.DescribeCertificateRequest, callback?: (err: AWSError, data: Transfer.Types.DescribeCertificateResponse) => void): Request<Transfer.Types.DescribeCertificateResponse, AWSError>;
  /**
   * Describes the certificate that's identified by the CertificateId.
   */
  describeCertificate(callback?: (err: AWSError, data: Transfer.Types.DescribeCertificateResponse) => void): Request<Transfer.Types.DescribeCertificateResponse, AWSError>;
  /**
   * Describes the connector that's identified by the ConnectorId. 
   */
  describeConnector(params: Transfer.Types.DescribeConnectorRequest, callback?: (err: AWSError, data: Transfer.Types.DescribeConnectorResponse) => void): Request<Transfer.Types.DescribeConnectorResponse, AWSError>;
  /**
   * Describes the connector that's identified by the ConnectorId. 
   */
  describeConnector(callback?: (err: AWSError, data: Transfer.Types.DescribeConnectorResponse) => void): Request<Transfer.Types.DescribeConnectorResponse, AWSError>;
  /**
   * You can use DescribeExecution to check the details of the execution of the specified workflow.  This API call only returns details for in-progress workflows.  If you provide an ID for an execution that is not in progress, or if the execution doesn't match the specified workflow ID, you receive a ResourceNotFound exception. 
   */
  describeExecution(params: Transfer.Types.DescribeExecutionRequest, callback?: (err: AWSError, data: Transfer.Types.DescribeExecutionResponse) => void): Request<Transfer.Types.DescribeExecutionResponse, AWSError>;
  /**
   * You can use DescribeExecution to check the details of the execution of the specified workflow.  This API call only returns details for in-progress workflows.  If you provide an ID for an execution that is not in progress, or if the execution doesn't match the specified workflow ID, you receive a ResourceNotFound exception. 
   */
  describeExecution(callback?: (err: AWSError, data: Transfer.Types.DescribeExecutionResponse) => void): Request<Transfer.Types.DescribeExecutionResponse, AWSError>;
  /**
   * Returns the details of the host key that's specified by the HostKeyId and ServerId.
   */
  describeHostKey(params: Transfer.Types.DescribeHostKeyRequest, callback?: (err: AWSError, data: Transfer.Types.DescribeHostKeyResponse) => void): Request<Transfer.Types.DescribeHostKeyResponse, AWSError>;
  /**
   * Returns the details of the host key that's specified by the HostKeyId and ServerId.
   */
  describeHostKey(callback?: (err: AWSError, data: Transfer.Types.DescribeHostKeyResponse) => void): Request<Transfer.Types.DescribeHostKeyResponse, AWSError>;
  /**
   * Returns the details of the profile that's specified by the ProfileId.
   */
  describeProfile(params: Transfer.Types.DescribeProfileRequest, callback?: (err: AWSError, data: Transfer.Types.DescribeProfileResponse) => void): Request<Transfer.Types.DescribeProfileResponse, AWSError>;
  /**
   * Returns the details of the profile that's specified by the ProfileId.
   */
  describeProfile(callback?: (err: AWSError, data: Transfer.Types.DescribeProfileResponse) => void): Request<Transfer.Types.DescribeProfileResponse, AWSError>;
  /**
   * Describes the security policy that is attached to your file transfer protocol-enabled server. The response contains a description of the security policy's properties. For more information about security policies, see Working with security policies.
   */
  describeSecurityPolicy(params: Transfer.Types.DescribeSecurityPolicyRequest, callback?: (err: AWSError, data: Transfer.Types.DescribeSecurityPolicyResponse) => void): Request<Transfer.Types.DescribeSecurityPolicyResponse, AWSError>;
  /**
   * Describes the security policy that is attached to your file transfer protocol-enabled server. The response contains a description of the security policy's properties. For more information about security policies, see Working with security policies.
   */
  describeSecurityPolicy(callback?: (err: AWSError, data: Transfer.Types.DescribeSecurityPolicyResponse) => void): Request<Transfer.Types.DescribeSecurityPolicyResponse, AWSError>;
  /**
   * Describes a file transfer protocol-enabled server that you specify by passing the ServerId parameter. The response contains a description of a server's properties. When you set EndpointType to VPC, the response will contain the EndpointDetails.
   */
  describeServer(params: Transfer.Types.DescribeServerRequest, callback?: (err: AWSError, data: Transfer.Types.DescribeServerResponse) => void): Request<Transfer.Types.DescribeServerResponse, AWSError>;
  /**
   * Describes a file transfer protocol-enabled server that you specify by passing the ServerId parameter. The response contains a description of a server's properties. When you set EndpointType to VPC, the response will contain the EndpointDetails.
   */
  describeServer(callback?: (err: AWSError, data: Transfer.Types.DescribeServerResponse) => void): Request<Transfer.Types.DescribeServerResponse, AWSError>;
  /**
   * Describes the user assigned to the specific file transfer protocol-enabled server, as identified by its ServerId property. The response from this call returns the properties of the user associated with the ServerId value that was specified.
   */
  describeUser(params: Transfer.Types.DescribeUserRequest, callback?: (err: AWSError, data: Transfer.Types.DescribeUserResponse) => void): Request<Transfer.Types.DescribeUserResponse, AWSError>;
  /**
   * Describes the user assigned to the specific file transfer protocol-enabled server, as identified by its ServerId property. The response from this call returns the properties of the user associated with the ServerId value that was specified.
   */
  describeUser(callback?: (err: AWSError, data: Transfer.Types.DescribeUserResponse) => void): Request<Transfer.Types.DescribeUserResponse, AWSError>;
  /**
   * Describes the specified workflow.
   */
  describeWorkflow(params: Transfer.Types.DescribeWorkflowRequest, callback?: (err: AWSError, data: Transfer.Types.DescribeWorkflowResponse) => void): Request<Transfer.Types.DescribeWorkflowResponse, AWSError>;
  /**
   * Describes the specified workflow.
   */
  describeWorkflow(callback?: (err: AWSError, data: Transfer.Types.DescribeWorkflowResponse) => void): Request<Transfer.Types.DescribeWorkflowResponse, AWSError>;
  /**
   * Imports the signing and encryption certificates that you need to create local (AS2) profiles and partner profiles.
   */
  importCertificate(params: Transfer.Types.ImportCertificateRequest, callback?: (err: AWSError, data: Transfer.Types.ImportCertificateResponse) => void): Request<Transfer.Types.ImportCertificateResponse, AWSError>;
  /**
   * Imports the signing and encryption certificates that you need to create local (AS2) profiles and partner profiles.
   */
  importCertificate(callback?: (err: AWSError, data: Transfer.Types.ImportCertificateResponse) => void): Request<Transfer.Types.ImportCertificateResponse, AWSError>;
  /**
   * Adds a host key to the server that's specified by the ServerId parameter.
   */
  importHostKey(params: Transfer.Types.ImportHostKeyRequest, callback?: (err: AWSError, data: Transfer.Types.ImportHostKeyResponse) => void): Request<Transfer.Types.ImportHostKeyResponse, AWSError>;
  /**
   * Adds a host key to the server that's specified by the ServerId parameter.
   */
  importHostKey(callback?: (err: AWSError, data: Transfer.Types.ImportHostKeyResponse) => void): Request<Transfer.Types.ImportHostKeyResponse, AWSError>;
  /**
   * Adds a Secure Shell (SSH) public key to a Transfer Family user identified by a UserName value assigned to the specific file transfer protocol-enabled server, identified by ServerId. The response returns the UserName value, the ServerId value, and the name of the SshPublicKeyId.
   */
  importSshPublicKey(params: Transfer.Types.ImportSshPublicKeyRequest, callback?: (err: AWSError, data: Transfer.Types.ImportSshPublicKeyResponse) => void): Request<Transfer.Types.ImportSshPublicKeyResponse, AWSError>;
  /**
   * Adds a Secure Shell (SSH) public key to a Transfer Family user identified by a UserName value assigned to the specific file transfer protocol-enabled server, identified by ServerId. The response returns the UserName value, the ServerId value, and the name of the SshPublicKeyId.
   */
  importSshPublicKey(callback?: (err: AWSError, data: Transfer.Types.ImportSshPublicKeyResponse) => void): Request<Transfer.Types.ImportSshPublicKeyResponse, AWSError>;
  /**
   * Lists the details for all the accesses you have on your server.
   */
  listAccesses(params: Transfer.Types.ListAccessesRequest, callback?: (err: AWSError, data: Transfer.Types.ListAccessesResponse) => void): Request<Transfer.Types.ListAccessesResponse, AWSError>;
  /**
   * Lists the details for all the accesses you have on your server.
   */
  listAccesses(callback?: (err: AWSError, data: Transfer.Types.ListAccessesResponse) => void): Request<Transfer.Types.ListAccessesResponse, AWSError>;
  /**
   * Returns a list of the agreements for the server that's identified by the ServerId that you supply. If you want to limit the results to a certain number, supply a value for the MaxResults parameter. If you ran the command previously and received a value for NextToken, you can supply that value to continue listing agreements from where you left off.
   */
  listAgreements(params: Transfer.Types.ListAgreementsRequest, callback?: (err: AWSError, data: Transfer.Types.ListAgreementsResponse) => void): Request<Transfer.Types.ListAgreementsResponse, AWSError>;
  /**
   * Returns a list of the agreements for the server that's identified by the ServerId that you supply. If you want to limit the results to a certain number, supply a value for the MaxResults parameter. If you ran the command previously and received a value for NextToken, you can supply that value to continue listing agreements from where you left off.
   */
  listAgreements(callback?: (err: AWSError, data: Transfer.Types.ListAgreementsResponse) => void): Request<Transfer.Types.ListAgreementsResponse, AWSError>;
  /**
   * Returns a list of the current certificates that have been imported into Transfer Family. If you want to limit the results to a certain number, supply a value for the MaxResults parameter. If you ran the command previously and received a value for the NextToken parameter, you can supply that value to continue listing certificates from where you left off.
   */
  listCertificates(params: Transfer.Types.ListCertificatesRequest, callback?: (err: AWSError, data: Transfer.Types.ListCertificatesResponse) => void): Request<Transfer.Types.ListCertificatesResponse, AWSError>;
  /**
   * Returns a list of the current certificates that have been imported into Transfer Family. If you want to limit the results to a certain number, supply a value for the MaxResults parameter. If you ran the command previously and received a value for the NextToken parameter, you can supply that value to continue listing certificates from where you left off.
   */
  listCertificates(callback?: (err: AWSError, data: Transfer.Types.ListCertificatesResponse) => void): Request<Transfer.Types.ListCertificatesResponse, AWSError>;
  /**
   * Lists the connectors for the specified Region.
   */
  listConnectors(params: Transfer.Types.ListConnectorsRequest, callback?: (err: AWSError, data: Transfer.Types.ListConnectorsResponse) => void): Request<Transfer.Types.ListConnectorsResponse, AWSError>;
  /**
   * Lists the connectors for the specified Region.
   */
  listConnectors(callback?: (err: AWSError, data: Transfer.Types.ListConnectorsResponse) => void): Request<Transfer.Types.ListConnectorsResponse, AWSError>;
  /**
   * Lists all in-progress executions for the specified workflow.  If the specified workflow ID cannot be found, ListExecutions returns a ResourceNotFound exception. 
   */
  listExecutions(params: Transfer.Types.ListExecutionsRequest, callback?: (err: AWSError, data: Transfer.Types.ListExecutionsResponse) => void): Request<Transfer.Types.ListExecutionsResponse, AWSError>;
  /**
   * Lists all in-progress executions for the specified workflow.  If the specified workflow ID cannot be found, ListExecutions returns a ResourceNotFound exception. 
   */
  listExecutions(callback?: (err: AWSError, data: Transfer.Types.ListExecutionsResponse) => void): Request<Transfer.Types.ListExecutionsResponse, AWSError>;
  /**
   * Returns a list of host keys for the server that's specified by the ServerId parameter.
   */
  listHostKeys(params: Transfer.Types.ListHostKeysRequest, callback?: (err: AWSError, data: Transfer.Types.ListHostKeysResponse) => void): Request<Transfer.Types.ListHostKeysResponse, AWSError>;
  /**
   * Returns a list of host keys for the server that's specified by the ServerId parameter.
   */
  listHostKeys(callback?: (err: AWSError, data: Transfer.Types.ListHostKeysResponse) => void): Request<Transfer.Types.ListHostKeysResponse, AWSError>;
  /**
   * Returns a list of the profiles for your system. If you want to limit the results to a certain number, supply a value for the MaxResults parameter. If you ran the command previously and received a value for NextToken, you can supply that value to continue listing profiles from where you left off.
   */
  listProfiles(params: Transfer.Types.ListProfilesRequest, callback?: (err: AWSError, data: Transfer.Types.ListProfilesResponse) => void): Request<Transfer.Types.ListProfilesResponse, AWSError>;
  /**
   * Returns a list of the profiles for your system. If you want to limit the results to a certain number, supply a value for the MaxResults parameter. If you ran the command previously and received a value for NextToken, you can supply that value to continue listing profiles from where you left off.
   */
  listProfiles(callback?: (err: AWSError, data: Transfer.Types.ListProfilesResponse) => void): Request<Transfer.Types.ListProfilesResponse, AWSError>;
  /**
   * Lists the security policies that are attached to your file transfer protocol-enabled servers.
   */
  listSecurityPolicies(params: Transfer.Types.ListSecurityPoliciesRequest, callback?: (err: AWSError, data: Transfer.Types.ListSecurityPoliciesResponse) => void): Request<Transfer.Types.ListSecurityPoliciesResponse, AWSError>;
  /**
   * Lists the security policies that are attached to your file transfer protocol-enabled servers.
   */
  listSecurityPolicies(callback?: (err: AWSError, data: Transfer.Types.ListSecurityPoliciesResponse) => void): Request<Transfer.Types.ListSecurityPoliciesResponse, AWSError>;
  /**
   * Lists the file transfer protocol-enabled servers that are associated with your Amazon Web Services account.
   */
  listServers(params: Transfer.Types.ListServersRequest, callback?: (err: AWSError, data: Transfer.Types.ListServersResponse) => void): Request<Transfer.Types.ListServersResponse, AWSError>;
  /**
   * Lists the file transfer protocol-enabled servers that are associated with your Amazon Web Services account.
   */
  listServers(callback?: (err: AWSError, data: Transfer.Types.ListServersResponse) => void): Request<Transfer.Types.ListServersResponse, AWSError>;
  /**
   * Lists all of the tags associated with the Amazon Resource Name (ARN) that you specify. The resource can be a user, server, or role.
   */
  listTagsForResource(params: Transfer.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Transfer.Types.ListTagsForResourceResponse) => void): Request<Transfer.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all of the tags associated with the Amazon Resource Name (ARN) that you specify. The resource can be a user, server, or role.
   */
  listTagsForResource(callback?: (err: AWSError, data: Transfer.Types.ListTagsForResourceResponse) => void): Request<Transfer.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the users for a file transfer protocol-enabled server that you specify by passing the ServerId parameter.
   */
  listUsers(params: Transfer.Types.ListUsersRequest, callback?: (err: AWSError, data: Transfer.Types.ListUsersResponse) => void): Request<Transfer.Types.ListUsersResponse, AWSError>;
  /**
   * Lists the users for a file transfer protocol-enabled server that you specify by passing the ServerId parameter.
   */
  listUsers(callback?: (err: AWSError, data: Transfer.Types.ListUsersResponse) => void): Request<Transfer.Types.ListUsersResponse, AWSError>;
  /**
   * Lists all workflows associated with your Amazon Web Services account for your current region.
   */
  listWorkflows(params: Transfer.Types.ListWorkflowsRequest, callback?: (err: AWSError, data: Transfer.Types.ListWorkflowsResponse) => void): Request<Transfer.Types.ListWorkflowsResponse, AWSError>;
  /**
   * Lists all workflows associated with your Amazon Web Services account for your current region.
   */
  listWorkflows(callback?: (err: AWSError, data: Transfer.Types.ListWorkflowsResponse) => void): Request<Transfer.Types.ListWorkflowsResponse, AWSError>;
  /**
   * Sends a callback for asynchronous custom steps.  The ExecutionId, WorkflowId, and Token are passed to the target resource during execution of a custom step of a workflow. You must include those with their callback as well as providing a status. 
   */
  sendWorkflowStepState(params: Transfer.Types.SendWorkflowStepStateRequest, callback?: (err: AWSError, data: Transfer.Types.SendWorkflowStepStateResponse) => void): Request<Transfer.Types.SendWorkflowStepStateResponse, AWSError>;
  /**
   * Sends a callback for asynchronous custom steps.  The ExecutionId, WorkflowId, and Token are passed to the target resource during execution of a custom step of a workflow. You must include those with their callback as well as providing a status. 
   */
  sendWorkflowStepState(callback?: (err: AWSError, data: Transfer.Types.SendWorkflowStepStateResponse) => void): Request<Transfer.Types.SendWorkflowStepStateResponse, AWSError>;
  /**
   * Begins a file transfer between local Amazon Web Services storage and a remote AS2 or SFTP server.   For an AS2 connector, you specify the ConnectorId and one or more SendFilePaths to identify the files you want to transfer.   For an SFTP connector, the file transfer can be either outbound or inbound. In both cases, you specify the ConnectorId. Depending on the direction of the transfer, you also specify the following items:   If you are transferring file from a partner's SFTP server to Amazon Web Services storage, you specify one or more RetreiveFilePaths to identify the files you want to transfer, and a LocalDirectoryPath to specify the destination folder.   If you are transferring file to a partner's SFTP server from Amazon Web Services storage, you specify one or more SendFilePaths to identify the files you want to transfer, and a RemoteDirectoryPath to specify the destination folder.    
   */
  startFileTransfer(params: Transfer.Types.StartFileTransferRequest, callback?: (err: AWSError, data: Transfer.Types.StartFileTransferResponse) => void): Request<Transfer.Types.StartFileTransferResponse, AWSError>;
  /**
   * Begins a file transfer between local Amazon Web Services storage and a remote AS2 or SFTP server.   For an AS2 connector, you specify the ConnectorId and one or more SendFilePaths to identify the files you want to transfer.   For an SFTP connector, the file transfer can be either outbound or inbound. In both cases, you specify the ConnectorId. Depending on the direction of the transfer, you also specify the following items:   If you are transferring file from a partner's SFTP server to Amazon Web Services storage, you specify one or more RetreiveFilePaths to identify the files you want to transfer, and a LocalDirectoryPath to specify the destination folder.   If you are transferring file to a partner's SFTP server from Amazon Web Services storage, you specify one or more SendFilePaths to identify the files you want to transfer, and a RemoteDirectoryPath to specify the destination folder.    
   */
  startFileTransfer(callback?: (err: AWSError, data: Transfer.Types.StartFileTransferResponse) => void): Request<Transfer.Types.StartFileTransferResponse, AWSError>;
  /**
   * Changes the state of a file transfer protocol-enabled server from OFFLINE to ONLINE. It has no impact on a server that is already ONLINE. An ONLINE server can accept and process file transfer jobs. The state of STARTING indicates that the server is in an intermediate state, either not fully able to respond, or not fully online. The values of START_FAILED can indicate an error condition. No response is returned from this call.
   */
  startServer(params: Transfer.Types.StartServerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the state of a file transfer protocol-enabled server from OFFLINE to ONLINE. It has no impact on a server that is already ONLINE. An ONLINE server can accept and process file transfer jobs. The state of STARTING indicates that the server is in an intermediate state, either not fully able to respond, or not fully online. The values of START_FAILED can indicate an error condition. No response is returned from this call.
   */
  startServer(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the state of a file transfer protocol-enabled server from ONLINE to OFFLINE. An OFFLINE server cannot accept and process file transfer jobs. Information tied to your server, such as server and user properties, are not affected by stopping your server.  Stopping the server does not reduce or impact your file transfer protocol endpoint billing; you must delete the server to stop being billed.  The state of STOPPING indicates that the server is in an intermediate state, either not fully able to respond, or not fully offline. The values of STOP_FAILED can indicate an error condition. No response is returned from this call.
   */
  stopServer(params: Transfer.Types.StopServerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the state of a file transfer protocol-enabled server from ONLINE to OFFLINE. An OFFLINE server cannot accept and process file transfer jobs. Information tied to your server, such as server and user properties, are not affected by stopping your server.  Stopping the server does not reduce or impact your file transfer protocol endpoint billing; you must delete the server to stop being billed.  The state of STOPPING indicates that the server is in an intermediate state, either not fully able to respond, or not fully offline. The values of STOP_FAILED can indicate an error condition. No response is returned from this call.
   */
  stopServer(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches a key-value pair to a resource, as identified by its Amazon Resource Name (ARN). Resources are users, servers, roles, and other entities. There is no response returned from this call.
   */
  tagResource(params: Transfer.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches a key-value pair to a resource, as identified by its Amazon Resource Name (ARN). Resources are users, servers, roles, and other entities. There is no response returned from this call.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Tests whether your SFTP connector is set up successfully. We highly recommend that you call this operation to test your ability to transfer files between local Amazon Web Services storage and a trading partner's SFTP server.
   */
  testConnection(params: Transfer.Types.TestConnectionRequest, callback?: (err: AWSError, data: Transfer.Types.TestConnectionResponse) => void): Request<Transfer.Types.TestConnectionResponse, AWSError>;
  /**
   * Tests whether your SFTP connector is set up successfully. We highly recommend that you call this operation to test your ability to transfer files between local Amazon Web Services storage and a trading partner's SFTP server.
   */
  testConnection(callback?: (err: AWSError, data: Transfer.Types.TestConnectionResponse) => void): Request<Transfer.Types.TestConnectionResponse, AWSError>;
  /**
   * If the IdentityProviderType of a file transfer protocol-enabled server is AWS_DIRECTORY_SERVICE or API_Gateway, tests whether your identity provider is set up successfully. We highly recommend that you call this operation to test your authentication method as soon as you create your server. By doing so, you can troubleshoot issues with the identity provider integration to ensure that your users can successfully use the service.  The ServerId and UserName parameters are required. The ServerProtocol, SourceIp, and UserPassword are all optional.  Note the following:    You cannot use TestIdentityProvider if the IdentityProviderType of your server is SERVICE_MANAGED.    TestIdentityProvider does not work with keys: it only accepts passwords.    TestIdentityProvider can test the password operation for a custom Identity Provider that handles keys and passwords.    If you provide any incorrect values for any parameters, the Response field is empty.     If you provide a server ID for a server that uses service-managed users, you get an error:    An error occurred (InvalidRequestException) when calling the TestIdentityProvider operation: s-server-ID not configured for external auth      If you enter a Server ID for the --server-id parameter that does not identify an actual Transfer server, you receive the following error:   An error occurred (ResourceNotFoundException) when calling the TestIdentityProvider operation: Unknown server.  It is possible your sever is in a different region. You can specify a region by adding the following: --region region-code, such as --region us-east-2 to specify a server in US East (Ohio).  
   */
  testIdentityProvider(params: Transfer.Types.TestIdentityProviderRequest, callback?: (err: AWSError, data: Transfer.Types.TestIdentityProviderResponse) => void): Request<Transfer.Types.TestIdentityProviderResponse, AWSError>;
  /**
   * If the IdentityProviderType of a file transfer protocol-enabled server is AWS_DIRECTORY_SERVICE or API_Gateway, tests whether your identity provider is set up successfully. We highly recommend that you call this operation to test your authentication method as soon as you create your server. By doing so, you can troubleshoot issues with the identity provider integration to ensure that your users can successfully use the service.  The ServerId and UserName parameters are required. The ServerProtocol, SourceIp, and UserPassword are all optional.  Note the following:    You cannot use TestIdentityProvider if the IdentityProviderType of your server is SERVICE_MANAGED.    TestIdentityProvider does not work with keys: it only accepts passwords.    TestIdentityProvider can test the password operation for a custom Identity Provider that handles keys and passwords.    If you provide any incorrect values for any parameters, the Response field is empty.     If you provide a server ID for a server that uses service-managed users, you get an error:    An error occurred (InvalidRequestException) when calling the TestIdentityProvider operation: s-server-ID not configured for external auth      If you enter a Server ID for the --server-id parameter that does not identify an actual Transfer server, you receive the following error:   An error occurred (ResourceNotFoundException) when calling the TestIdentityProvider operation: Unknown server.  It is possible your sever is in a different region. You can specify a region by adding the following: --region region-code, such as --region us-east-2 to specify a server in US East (Ohio).  
   */
  testIdentityProvider(callback?: (err: AWSError, data: Transfer.Types.TestIdentityProviderResponse) => void): Request<Transfer.Types.TestIdentityProviderResponse, AWSError>;
  /**
   * Detaches a key-value pair from a resource, as identified by its Amazon Resource Name (ARN). Resources are users, servers, roles, and other entities. No response is returned from this call.
   */
  untagResource(params: Transfer.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Detaches a key-value pair from a resource, as identified by its Amazon Resource Name (ARN). Resources are users, servers, roles, and other entities. No response is returned from this call.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Allows you to update parameters for the access specified in the ServerID and ExternalID parameters.
   */
  updateAccess(params: Transfer.Types.UpdateAccessRequest, callback?: (err: AWSError, data: Transfer.Types.UpdateAccessResponse) => void): Request<Transfer.Types.UpdateAccessResponse, AWSError>;
  /**
   * Allows you to update parameters for the access specified in the ServerID and ExternalID parameters.
   */
  updateAccess(callback?: (err: AWSError, data: Transfer.Types.UpdateAccessResponse) => void): Request<Transfer.Types.UpdateAccessResponse, AWSError>;
  /**
   * Updates some of the parameters for an existing agreement. Provide the AgreementId and the ServerId for the agreement that you want to update, along with the new values for the parameters to update.
   */
  updateAgreement(params: Transfer.Types.UpdateAgreementRequest, callback?: (err: AWSError, data: Transfer.Types.UpdateAgreementResponse) => void): Request<Transfer.Types.UpdateAgreementResponse, AWSError>;
  /**
   * Updates some of the parameters for an existing agreement. Provide the AgreementId and the ServerId for the agreement that you want to update, along with the new values for the parameters to update.
   */
  updateAgreement(callback?: (err: AWSError, data: Transfer.Types.UpdateAgreementResponse) => void): Request<Transfer.Types.UpdateAgreementResponse, AWSError>;
  /**
   * Updates the active and inactive dates for a certificate.
   */
  updateCertificate(params: Transfer.Types.UpdateCertificateRequest, callback?: (err: AWSError, data: Transfer.Types.UpdateCertificateResponse) => void): Request<Transfer.Types.UpdateCertificateResponse, AWSError>;
  /**
   * Updates the active and inactive dates for a certificate.
   */
  updateCertificate(callback?: (err: AWSError, data: Transfer.Types.UpdateCertificateResponse) => void): Request<Transfer.Types.UpdateCertificateResponse, AWSError>;
  /**
   * Updates some of the parameters for an existing connector. Provide the ConnectorId for the connector that you want to update, along with the new values for the parameters to update.
   */
  updateConnector(params: Transfer.Types.UpdateConnectorRequest, callback?: (err: AWSError, data: Transfer.Types.UpdateConnectorResponse) => void): Request<Transfer.Types.UpdateConnectorResponse, AWSError>;
  /**
   * Updates some of the parameters for an existing connector. Provide the ConnectorId for the connector that you want to update, along with the new values for the parameters to update.
   */
  updateConnector(callback?: (err: AWSError, data: Transfer.Types.UpdateConnectorResponse) => void): Request<Transfer.Types.UpdateConnectorResponse, AWSError>;
  /**
   * Updates the description for the host key that's specified by the ServerId and HostKeyId parameters.
   */
  updateHostKey(params: Transfer.Types.UpdateHostKeyRequest, callback?: (err: AWSError, data: Transfer.Types.UpdateHostKeyResponse) => void): Request<Transfer.Types.UpdateHostKeyResponse, AWSError>;
  /**
   * Updates the description for the host key that's specified by the ServerId and HostKeyId parameters.
   */
  updateHostKey(callback?: (err: AWSError, data: Transfer.Types.UpdateHostKeyResponse) => void): Request<Transfer.Types.UpdateHostKeyResponse, AWSError>;
  /**
   * Updates some of the parameters for an existing profile. Provide the ProfileId for the profile that you want to update, along with the new values for the parameters to update.
   */
  updateProfile(params: Transfer.Types.UpdateProfileRequest, callback?: (err: AWSError, data: Transfer.Types.UpdateProfileResponse) => void): Request<Transfer.Types.UpdateProfileResponse, AWSError>;
  /**
   * Updates some of the parameters for an existing profile. Provide the ProfileId for the profile that you want to update, along with the new values for the parameters to update.
   */
  updateProfile(callback?: (err: AWSError, data: Transfer.Types.UpdateProfileResponse) => void): Request<Transfer.Types.UpdateProfileResponse, AWSError>;
  /**
   * Updates the file transfer protocol-enabled server's properties after that server has been created. The UpdateServer call returns the ServerId of the server you updated.
   */
  updateServer(params: Transfer.Types.UpdateServerRequest, callback?: (err: AWSError, data: Transfer.Types.UpdateServerResponse) => void): Request<Transfer.Types.UpdateServerResponse, AWSError>;
  /**
   * Updates the file transfer protocol-enabled server's properties after that server has been created. The UpdateServer call returns the ServerId of the server you updated.
   */
  updateServer(callback?: (err: AWSError, data: Transfer.Types.UpdateServerResponse) => void): Request<Transfer.Types.UpdateServerResponse, AWSError>;
  /**
   * Assigns new properties to a user. Parameters you pass modify any or all of the following: the home directory, role, and policy for the UserName and ServerId you specify. The response returns the ServerId and the UserName for the updated user.
   */
  updateUser(params: Transfer.Types.UpdateUserRequest, callback?: (err: AWSError, data: Transfer.Types.UpdateUserResponse) => void): Request<Transfer.Types.UpdateUserResponse, AWSError>;
  /**
   * Assigns new properties to a user. Parameters you pass modify any or all of the following: the home directory, role, and policy for the UserName and ServerId you specify. The response returns the ServerId and the UserName for the updated user.
   */
  updateUser(callback?: (err: AWSError, data: Transfer.Types.UpdateUserResponse) => void): Request<Transfer.Types.UpdateUserResponse, AWSError>;
  /**
   * Waits for the serverOffline state by periodically calling the underlying Transfer.describeServeroperation every 30 seconds (at most 120 times).
   */
  waitFor(state: "serverOffline", params: Transfer.Types.DescribeServerRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Transfer.Types.DescribeServerResponse) => void): Request<Transfer.Types.DescribeServerResponse, AWSError>;
  /**
   * Waits for the serverOffline state by periodically calling the underlying Transfer.describeServeroperation every 30 seconds (at most 120 times).
   */
  waitFor(state: "serverOffline", callback?: (err: AWSError, data: Transfer.Types.DescribeServerResponse) => void): Request<Transfer.Types.DescribeServerResponse, AWSError>;
  /**
   * Waits for the serverOnline state by periodically calling the underlying Transfer.describeServeroperation every 30 seconds (at most 120 times).
   */
  waitFor(state: "serverOnline", params: Transfer.Types.DescribeServerRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Transfer.Types.DescribeServerResponse) => void): Request<Transfer.Types.DescribeServerResponse, AWSError>;
  /**
   * Waits for the serverOnline state by periodically calling the underlying Transfer.describeServeroperation every 30 seconds (at most 120 times).
   */
  waitFor(state: "serverOnline", callback?: (err: AWSError, data: Transfer.Types.DescribeServerResponse) => void): Request<Transfer.Types.DescribeServerResponse, AWSError>;
}
declare namespace Transfer {
  export type AddressAllocationId = string;
  export type AddressAllocationIds = AddressAllocationId[];
  export type AgreementId = string;
  export type AgreementStatusType = "ACTIVE"|"INACTIVE"|string;
  export type Arn = string;
  export interface As2ConnectorConfig {
    /**
     * A unique identifier for the AS2 local profile.
     */
    LocalProfileId?: ProfileId;
    /**
     * A unique identifier for the partner profile for the connector.
     */
    PartnerProfileId?: ProfileId;
    /**
     * Used as the Subject HTTP header attribute in AS2 messages that are being sent with the connector.
     */
    MessageSubject?: MessageSubject;
    /**
     * Specifies whether the AS2 file is compressed.
     */
    Compression?: CompressionEnum;
    /**
     * The algorithm that is used to encrypt the file.  You can only specify NONE if the URL for your connector uses HTTPS. This ensures that no traffic is sent in clear text. 
     */
    EncryptionAlgorithm?: EncryptionAlg;
    /**
     * The algorithm that is used to sign the AS2 messages sent with the connector.
     */
    SigningAlgorithm?: SigningAlg;
    /**
     * The signing algorithm for the MDN response.  If set to DEFAULT (or not set at all), the value for SigningAlgorithm is used. 
     */
    MdnSigningAlgorithm?: MdnSigningAlg;
    /**
     * Used for outbound requests (from an Transfer Family server to a partner AS2 server) to determine whether the partner response for transfers is synchronous or asynchronous. Specify either of the following values:    SYNC: The system expects a synchronous MDN response, confirming that the file was transferred successfully (or not).    NONE: Specifies that no MDN response is required.  
     */
    MdnResponse?: MdnResponse;
    /**
     * Provides Basic authentication support to the AS2 Connectors API. To use Basic authentication, you must provide the name or Amazon Resource Name (ARN) of a secret in Secrets Manager. The default value for this parameter is null, which indicates that Basic authentication is not enabled for the connector. If the connector should use Basic authentication, the secret needs to be in the following format:  { "Username": "user-name", "Password": "user-password" }  Replace user-name and user-password with the credentials for the actual user that is being authenticated. Note the following:   You are storing these credentials in Secrets Manager, not passing them directly into this API.   If you are using the API, SDKs, or CloudFormation to configure your connector, then you must create the secret before you can enable Basic authentication. However, if you are using the Amazon Web Services management console, you can have the system create the secret for you.   If you have previously enabled Basic authentication for a connector, you can disable it by using the UpdateConnector API call. For example, if you are using the CLI, you can run the following command to remove Basic authentication:  update-connector --connector-id my-connector-id --as2-config 'BasicAuthSecretId=""' 
     */
    BasicAuthSecretId?: As2ConnectorSecretId;
  }
  export type As2ConnectorSecretId = string;
  export type As2Id = string;
  export type As2Transport = "HTTP"|string;
  export type As2Transports = As2Transport[];
  export type CallbackToken = string;
  export type CertDate = Date;
  export type CertSerial = string;
  export type Certificate = string;
  export type CertificateBodyType = string;
  export type CertificateChainType = string;
  export type CertificateId = string;
  export type CertificateIds = CertificateId[];
  export type CertificateStatusType = "ACTIVE"|"PENDING_ROTATION"|"INACTIVE"|string;
  export type CertificateType = "CERTIFICATE"|"CERTIFICATE_WITH_PRIVATE_KEY"|string;
  export type CertificateUsageType = "SIGNING"|"ENCRYPTION"|string;
  export type CompressionEnum = "ZLIB"|"DISABLED"|string;
  export type ConnectorId = string;
  export interface CopyStepDetails {
    /**
     * The name of the step, used as an identifier.
     */
    Name?: WorkflowStepName;
    /**
     * Specifies the location for the file being copied. Use ${Transfer:UserName} or ${Transfer:UploadDate} in this field to parametrize the destination prefix by username or uploaded date.   Set the value of DestinationFileLocation to ${Transfer:UserName} to copy uploaded files to an Amazon S3 bucket that is prefixed with the name of the Transfer Family user that uploaded the file.   Set the value of DestinationFileLocation to ${Transfer:UploadDate} to copy uploaded files to an Amazon S3 bucket that is prefixed with the date of the upload.  The system resolves UploadDate to a date format of YYYY-MM-DD, based on the date the file is uploaded in UTC.   
     */
    DestinationFileLocation?: InputFileLocation;
    /**
     * A flag that indicates whether to overwrite an existing file of the same name. The default is FALSE. If the workflow is processing a file that has the same name as an existing file, the behavior is as follows:   If OverwriteExisting is TRUE, the existing file is replaced with the file being processed.   If OverwriteExisting is FALSE, nothing happens, and the workflow processing stops.  
     */
    OverwriteExisting?: OverwriteExisting;
    /**
     * Specifies which file to use as input to the workflow step: either the output from the previous step, or the originally uploaded file for the workflow.   To use the previous file as the input, enter ${previous.file}. In this case, this workflow step uses the output file from the previous workflow step as input. This is the default value.   To use the originally uploaded file location as input for this step, enter ${original.file}.  
     */
    SourceFileLocation?: SourceFileLocation;
  }
  export interface CreateAccessRequest {
    /**
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.  The HomeDirectory parameter is only used if HomeDirectoryType is set to LOGICAL. 
     */
    HomeDirectory?: HomeDirectory;
    /**
     * The type of landing directory (folder) that you want your users' home directory to be when they log in to the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or Amazon EFS path as is in their file transfer protocol clients. If you set it to LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or Amazon EFS paths visible to your users.  If HomeDirectoryType is LOGICAL, you must provide mappings, using the HomeDirectoryMappings parameter. If, on the other hand, HomeDirectoryType is PATH, you provide an absolute path using the HomeDirectory parameter. You cannot have both HomeDirectory and HomeDirectoryMappings in your template. 
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * Logical directory mappings that specify what Amazon S3 or Amazon EFS paths and keys should be visible to your user and how you want to make them visible. You must specify the Entry and Target pair, where Entry shows how the path is made visible and Target is the actual Amazon S3 or Amazon EFS path. If you only specify a target, it is displayed as is. You also must ensure that your Identity and Access Management (IAM) role provides access to paths in Target. This value can be set only when HomeDirectoryType is set to LOGICAL. The following is an Entry and Target pair example.  [ { "Entry": "/directory1", "Target": "/bucket_name/home/mydirectory" } ]  In most cases, you can use this value instead of the session policy to lock down your user to the designated home directory ("chroot"). To do this, you can set Entry to / and set Target to the HomeDirectory parameter value. The following is an Entry and Target pair example for chroot.  [ { "Entry": "/", "Target": "/bucket_name/home/mydirectory" } ] 
     */
    HomeDirectoryMappings?: HomeDirectoryMappings;
    /**
     * A session policy for your user so that you can use the same Identity and Access Management (IAM) role across multiple users. This policy scopes down a user's access to portions of their Amazon S3 bucket. Variables that you can use inside this policy include ${Transfer:UserName}, ${Transfer:HomeDirectory}, and ${Transfer:HomeBucket}.  This policy applies only when the domain of ServerId is Amazon S3. Amazon EFS does not use session policies. For session policies, Transfer Family stores the policy as a JSON blob, instead of the Amazon Resource Name (ARN) of the policy. You save the policy as a JSON blob and pass it in the Policy argument. For an example of a session policy, see Example session policy. For more information, see AssumeRole in the Security Token Service API Reference. 
     */
    Policy?: Policy;
    PosixProfile?: PosixProfile;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that controls your users' access to your Amazon S3 bucket or Amazon EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or Amazon EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
     */
    Role: Role;
    /**
     * A system-assigned unique identifier for a server instance. This is the specific server that you added your user to.
     */
    ServerId: ServerId;
    /**
     * A unique identifier that is required to identify specific groups within your directory. The users of the group that you associate have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Transfer Family. If you know the group name, you can view the SID values by running the following command using Windows PowerShell.  Get-ADGroup -Filter {samAccountName -like "YourGroupName*"} -Properties * | Select SamAccountName,ObjectSid  In that command, replace YourGroupName with the name of your Active Directory group. The regular expression used to validate this parameter is a string of characters consisting of uppercase and lowercase alphanumeric characters with no spaces. You can also include underscores or any of the following characters: =,.@:/-
     */
    ExternalId: ExternalId;
  }
  export interface CreateAccessResponse {
    /**
     * The identifier of the server that the user is attached to.
     */
    ServerId: ServerId;
    /**
     * The external identifier of the group whose users have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Transfer Family.
     */
    ExternalId: ExternalId;
  }
  export interface CreateAgreementRequest {
    /**
     * A name or short description to identify the agreement. 
     */
    Description?: Description;
    /**
     * A system-assigned unique identifier for a server instance. This is the specific server that the agreement uses.
     */
    ServerId: ServerId;
    /**
     * A unique identifier for the AS2 local profile.
     */
    LocalProfileId: ProfileId;
    /**
     * A unique identifier for the partner profile used in the agreement.
     */
    PartnerProfileId: ProfileId;
    /**
     * The landing directory (folder) for files transferred by using the AS2 protocol. A BaseDirectory example is /DOC-EXAMPLE-BUCKET/home/mydirectory.
     */
    BaseDirectory: HomeDirectory;
    /**
     * Connectors are used to send files using either the AS2 or SFTP protocol. For the access role, provide the Amazon Resource Name (ARN) of the Identity and Access Management role to use.  For AS2 connectors  With AS2, you can send files by calling StartFileTransfer and specifying the file paths in the request parameter, SendFilePaths. We use the file’s parent directory (for example, for --send-file-paths /bucket/dir/file.txt, parent directory is /bucket/dir/) to temporarily store a processed AS2 message file, store the MDN when we receive them from the partner, and write a final JSON file containing relevant metadata of the transmission. So, the AccessRole needs to provide read and write access to the parent directory of the file location used in the StartFileTransfer request. Additionally, you need to provide read and write access to the parent directory of the files that you intend to send with StartFileTransfer. If you are using Basic authentication for your AS2 connector, the access role requires the secretsmanager:GetSecretValue permission for the secret. If the secret is encrypted using a customer-managed key instead of the Amazon Web Services managed key in Secrets Manager, then the role also needs the kms:Decrypt permission for that key.  For SFTP connectors  Make sure that the access role provides read and write access to the parent directory of the file location that's used in the StartFileTransfer request. Additionally, make sure that the role provides secretsmanager:GetSecretValue permission to Secrets Manager.
     */
    AccessRole: Role;
    /**
     * The status of the agreement. The agreement can be either ACTIVE or INACTIVE.
     */
    Status?: AgreementStatusType;
    /**
     * Key-value pairs that can be used to group and search for agreements.
     */
    Tags?: Tags;
  }
  export interface CreateAgreementResponse {
    /**
     * The unique identifier for the agreement. Use this ID for deleting, or updating an agreement, as well as in any other API calls that require that you specify the agreement ID.
     */
    AgreementId: AgreementId;
  }
  export interface CreateConnectorRequest {
    /**
     * The URL of the partner's AS2 or SFTP endpoint.
     */
    Url: Url;
    /**
     * A structure that contains the parameters for an AS2 connector object.
     */
    As2Config?: As2ConnectorConfig;
    /**
     * Connectors are used to send files using either the AS2 or SFTP protocol. For the access role, provide the Amazon Resource Name (ARN) of the Identity and Access Management role to use.  For AS2 connectors  With AS2, you can send files by calling StartFileTransfer and specifying the file paths in the request parameter, SendFilePaths. We use the file’s parent directory (for example, for --send-file-paths /bucket/dir/file.txt, parent directory is /bucket/dir/) to temporarily store a processed AS2 message file, store the MDN when we receive them from the partner, and write a final JSON file containing relevant metadata of the transmission. So, the AccessRole needs to provide read and write access to the parent directory of the file location used in the StartFileTransfer request. Additionally, you need to provide read and write access to the parent directory of the files that you intend to send with StartFileTransfer. If you are using Basic authentication for your AS2 connector, the access role requires the secretsmanager:GetSecretValue permission for the secret. If the secret is encrypted using a customer-managed key instead of the Amazon Web Services managed key in Secrets Manager, then the role also needs the kms:Decrypt permission for that key.  For SFTP connectors  Make sure that the access role provides read and write access to the parent directory of the file location that's used in the StartFileTransfer request. Additionally, make sure that the role provides secretsmanager:GetSecretValue permission to Secrets Manager.
     */
    AccessRole: Role;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that allows a connector to turn on CloudWatch logging for Amazon S3 events. When set, you can view connector activity in your CloudWatch logs.
     */
    LoggingRole?: Role;
    /**
     * Key-value pairs that can be used to group and search for connectors. Tags are metadata attached to connectors for any purpose.
     */
    Tags?: Tags;
    /**
     * A structure that contains the parameters for an SFTP connector object.
     */
    SftpConfig?: SftpConnectorConfig;
  }
  export interface CreateConnectorResponse {
    /**
     * The unique identifier for the connector, returned after the API call succeeds.
     */
    ConnectorId: ConnectorId;
  }
  export interface CreateProfileRequest {
    /**
     * The As2Id is the AS2-name, as defined in the RFC 4130. For inbound transfers, this is the AS2-From header for the AS2 messages sent from the partner. For outbound connectors, this is the AS2-To header for the AS2 messages sent to the partner using the StartFileTransfer API operation. This ID cannot include spaces.
     */
    As2Id: As2Id;
    /**
     * Determines the type of profile to create:   Specify LOCAL to create a local profile. A local profile represents the AS2-enabled Transfer Family server organization or party.   Specify PARTNER to create a partner profile. A partner profile represents a remote organization, external to Transfer Family.  
     */
    ProfileType: ProfileType;
    /**
     * An array of identifiers for the imported certificates. You use this identifier for working with profiles and partner profiles.
     */
    CertificateIds?: CertificateIds;
    /**
     * Key-value pairs that can be used to group and search for AS2 profiles.
     */
    Tags?: Tags;
  }
  export interface CreateProfileResponse {
    /**
     * The unique identifier for the AS2 profile, returned after the API call succeeds.
     */
    ProfileId: ProfileId;
  }
  export interface CreateServerRequest {
    /**
     * The Amazon Resource Name (ARN) of the Certificate Manager (ACM) certificate. Required when Protocols is set to FTPS. To request a new public certificate, see Request a public certificate in the Certificate Manager User Guide. To import an existing certificate into ACM, see Importing certificates into ACM in the Certificate Manager User Guide. To request a private certificate to use FTPS through private IP addresses, see Request a private certificate in the Certificate Manager User Guide. Certificates with the following cryptographic algorithms and key sizes are supported:   2048-bit RSA (RSA_2048)   4096-bit RSA (RSA_4096)   Elliptic Prime Curve 256 bit (EC_prime256v1)   Elliptic Prime Curve 384 bit (EC_secp384r1)   Elliptic Prime Curve 521 bit (EC_secp521r1)    The certificate must be a valid SSL/TLS X.509 version 3 certificate with FQDN or IP address specified and information about the issuer. 
     */
    Certificate?: Certificate;
    /**
     * The domain of the storage system that is used for file transfers. There are two domains available: Amazon Simple Storage Service (Amazon S3) and Amazon Elastic File System (Amazon EFS). The default value is S3.  After the server is created, the domain cannot be changed. 
     */
    Domain?: Domain;
    /**
     * The virtual private cloud (VPC) endpoint settings that are configured for your server. When you host your endpoint within your VPC, you can make your endpoint accessible only to resources within your VPC, or you can attach Elastic IP addresses and make your endpoint accessible to clients over the internet. Your VPC's default security groups are automatically assigned to your endpoint.
     */
    EndpointDetails?: EndpointDetails;
    /**
     * The type of endpoint that you want your server to use. You can choose to make your server's endpoint publicly accessible (PUBLIC) or host it inside your VPC. With an endpoint that is hosted in a VPC, you can restrict access to your server and resources only within your VPC or choose to make it internet facing by attaching Elastic IP addresses directly to it.   After May 19, 2021, you won't be able to create a server using EndpointType=VPC_ENDPOINT in your Amazon Web Services account if your account hasn't already done so before May 19, 2021. If you have already created servers with EndpointType=VPC_ENDPOINT in your Amazon Web Services account on or before May 19, 2021, you will not be affected. After this date, use EndpointType=VPC. For more information, see https://docs.aws.amazon.com/transfer/latest/userguide/create-server-in-vpc.html#deprecate-vpc-endpoint. It is recommended that you use VPC as the EndpointType. With this endpoint type, you have the option to directly associate up to three Elastic IPv4 addresses (BYO IP included) with your server's endpoint and use VPC security groups to restrict traffic by the client's public IP address. This is not possible with EndpointType set to VPC_ENDPOINT. 
     */
    EndpointType?: EndpointType;
    /**
     * The RSA, ECDSA, or ED25519 private key to use for your SFTP-enabled server. You can add multiple host keys, in case you want to rotate keys, or have a set of active keys that use different algorithms. Use the following command to generate an RSA 2048 bit key with no passphrase:  ssh-keygen -t rsa -b 2048 -N "" -m PEM -f my-new-server-key. Use a minimum value of 2048 for the -b option. You can create a stronger key by using 3072 or 4096. Use the following command to generate an ECDSA 256 bit key with no passphrase:  ssh-keygen -t ecdsa -b 256 -N "" -m PEM -f my-new-server-key. Valid values for the -b option for ECDSA are 256, 384, and 521. Use the following command to generate an ED25519 key with no passphrase:  ssh-keygen -t ed25519 -N "" -f my-new-server-key. For all of these commands, you can replace my-new-server-key with a string of your choice.  If you aren't planning to migrate existing users from an existing SFTP-enabled server to a new server, don't update the host key. Accidentally changing a server's host key can be disruptive.  For more information, see Manage host keys for your SFTP-enabled server in the Transfer Family User Guide.
     */
    HostKey?: HostKey;
    /**
     * Required when IdentityProviderType is set to AWS_DIRECTORY_SERVICE, Amazon Web Services_LAMBDA or API_GATEWAY. Accepts an array containing all of the information required to use a directory in AWS_DIRECTORY_SERVICE or invoke a customer-supplied authentication API, including the API Gateway URL. Not required when IdentityProviderType is set to SERVICE_MANAGED.
     */
    IdentityProviderDetails?: IdentityProviderDetails;
    /**
     * The mode of authentication for a server. The default value is SERVICE_MANAGED, which allows you to store and access user credentials within the Transfer Family service. Use AWS_DIRECTORY_SERVICE to provide access to Active Directory groups in Directory Service for Microsoft Active Directory or Microsoft Active Directory in your on-premises environment or in Amazon Web Services using AD Connector. This option also requires you to provide a Directory ID by using the IdentityProviderDetails parameter. Use the API_GATEWAY value to integrate with an identity provider of your choosing. The API_GATEWAY setting requires you to provide an Amazon API Gateway endpoint URL to call for authentication by using the IdentityProviderDetails parameter. Use the AWS_LAMBDA value to directly use an Lambda function as your identity provider. If you choose this value, you must specify the ARN for the Lambda function in the Function parameter for the IdentityProviderDetails data type.
     */
    IdentityProviderType?: IdentityProviderType;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that allows a server to turn on Amazon CloudWatch logging for Amazon S3 or Amazon EFSevents. When set, you can view user activity in your CloudWatch logs.
     */
    LoggingRole?: Role;
    /**
     * Specifies a string to display when users connect to a server. This string is displayed after the user authenticates.  The SFTP protocol does not support post-authentication display banners. 
     */
    PostAuthenticationLoginBanner?: PostAuthenticationLoginBanner;
    /**
     * Specifies a string to display when users connect to a server. This string is displayed before the user authenticates. For example, the following banner displays details about using the system:  This system is for the use of authorized users only. Individuals using this computer system without authority, or in excess of their authority, are subject to having all of their activities on this system monitored and recorded by system personnel. 
     */
    PreAuthenticationLoginBanner?: PreAuthenticationLoginBanner;
    /**
     * Specifies the file transfer protocol or protocols over which your file transfer protocol client can connect to your server's endpoint. The available protocols are:    SFTP (Secure Shell (SSH) File Transfer Protocol): File transfer over SSH    FTPS (File Transfer Protocol Secure): File transfer with TLS encryption    FTP (File Transfer Protocol): Unencrypted file transfer    AS2 (Applicability Statement 2): used for transporting structured business-to-business data      If you select FTPS, you must choose a certificate stored in Certificate Manager (ACM) which is used to identify your server when clients connect to it over FTPS.   If Protocol includes either FTP or FTPS, then the EndpointType must be VPC and the IdentityProviderType must be either AWS_DIRECTORY_SERVICE, AWS_LAMBDA, or API_GATEWAY.   If Protocol includes FTP, then AddressAllocationIds cannot be associated.   If Protocol is set only to SFTP, the EndpointType can be set to PUBLIC and the IdentityProviderType can be set any of the supported identity types: SERVICE_MANAGED, AWS_DIRECTORY_SERVICE, AWS_LAMBDA, or API_GATEWAY.   If Protocol includes AS2, then the EndpointType must be VPC, and domain must be Amazon S3.   
     */
    Protocols?: Protocols;
    /**
     * The protocol settings that are configured for your server.    To indicate passive mode (for FTP and FTPS protocols), use the PassiveIp parameter. Enter a single dotted-quad IPv4 address, such as the external IP address of a firewall, router, or load balancer.    To ignore the error that is generated when the client attempts to use the SETSTAT command on a file that you are uploading to an Amazon S3 bucket, use the SetStatOption parameter. To have the Transfer Family server ignore the SETSTAT command and upload files without needing to make any changes to your SFTP client, set the value to ENABLE_NO_OP. If you set the SetStatOption parameter to ENABLE_NO_OP, Transfer Family generates a log entry to Amazon CloudWatch Logs, so that you can determine when the client is making a SETSTAT call.   To determine whether your Transfer Family server resumes recent, negotiated sessions through a unique session ID, use the TlsSessionResumptionMode parameter.    As2Transports indicates the transport method for the AS2 messages. Currently, only HTTP is supported.  
     */
    ProtocolDetails?: ProtocolDetails;
    /**
     * Specifies the name of the security policy that is attached to the server.
     */
    SecurityPolicyName?: SecurityPolicyName;
    /**
     * Key-value pairs that can be used to group and search for servers.
     */
    Tags?: Tags;
    /**
     * Specifies the workflow ID for the workflow to assign and the execution role that's used for executing the workflow. In addition to a workflow to execute when a file is uploaded completely, WorkflowDetails can also contain a workflow ID (and execution role) for a workflow to execute on partial upload. A partial upload occurs when the server session disconnects while the file is still being uploaded.
     */
    WorkflowDetails?: WorkflowDetails;
    /**
     * Specifies the log groups to which your server logs are sent. To specify a log group, you must provide the ARN for an existing log group. In this case, the format of the log group is as follows:  arn:aws:logs:region-name:amazon-account-id:log-group:log-group-name:*  For example, arn:aws:logs:us-east-1:111122223333:log-group:mytestgroup:*  If you have previously specified a log group for a server, you can clear it, and in effect turn off structured logging, by providing an empty value for this parameter in an update-server call. For example:  update-server --server-id s-1234567890abcdef0 --structured-log-destinations 
     */
    StructuredLogDestinations?: StructuredLogDestinations;
  }
  export interface CreateServerResponse {
    /**
     * The service-assigned identifier of the server that is created.
     */
    ServerId: ServerId;
  }
  export interface CreateUserRequest {
    /**
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.  The HomeDirectory parameter is only used if HomeDirectoryType is set to LOGICAL. 
     */
    HomeDirectory?: HomeDirectory;
    /**
     * The type of landing directory (folder) that you want your users' home directory to be when they log in to the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or Amazon EFS path as is in their file transfer protocol clients. If you set it to LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or Amazon EFS paths visible to your users.  If HomeDirectoryType is LOGICAL, you must provide mappings, using the HomeDirectoryMappings parameter. If, on the other hand, HomeDirectoryType is PATH, you provide an absolute path using the HomeDirectory parameter. You cannot have both HomeDirectory and HomeDirectoryMappings in your template. 
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * Logical directory mappings that specify what Amazon S3 or Amazon EFS paths and keys should be visible to your user and how you want to make them visible. You must specify the Entry and Target pair, where Entry shows how the path is made visible and Target is the actual Amazon S3 or Amazon EFS path. If you only specify a target, it is displayed as is. You also must ensure that your Identity and Access Management (IAM) role provides access to paths in Target. This value can be set only when HomeDirectoryType is set to LOGICAL. The following is an Entry and Target pair example.  [ { "Entry": "/directory1", "Target": "/bucket_name/home/mydirectory" } ]  In most cases, you can use this value instead of the session policy to lock your user down to the designated home directory ("chroot"). To do this, you can set Entry to / and set Target to the value the user should see for their home directory when they log in. The following is an Entry and Target pair example for chroot.  [ { "Entry": "/", "Target": "/bucket_name/home/mydirectory" } ] 
     */
    HomeDirectoryMappings?: HomeDirectoryMappings;
    /**
     * A session policy for your user so that you can use the same Identity and Access Management (IAM) role across multiple users. This policy scopes down a user's access to portions of their Amazon S3 bucket. Variables that you can use inside this policy include ${Transfer:UserName}, ${Transfer:HomeDirectory}, and ${Transfer:HomeBucket}.  This policy applies only when the domain of ServerId is Amazon S3. Amazon EFS does not use session policies. For session policies, Transfer Family stores the policy as a JSON blob, instead of the Amazon Resource Name (ARN) of the policy. You save the policy as a JSON blob and pass it in the Policy argument. For an example of a session policy, see Example session policy. For more information, see AssumeRole in the Amazon Web Services Security Token Service API Reference. 
     */
    Policy?: Policy;
    /**
     * Specifies the full POSIX identity, including user ID (Uid), group ID (Gid), and any secondary groups IDs (SecondaryGids), that controls your users' access to your Amazon EFS file systems. The POSIX permissions that are set on files and directories in Amazon EFS determine the level of access your users get when transferring files into and out of your Amazon EFS file systems.
     */
    PosixProfile?: PosixProfile;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that controls your users' access to your Amazon S3 bucket or Amazon EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or Amazon EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
     */
    Role: Role;
    /**
     * A system-assigned unique identifier for a server instance. This is the specific server that you added your user to.
     */
    ServerId: ServerId;
    /**
     * The public portion of the Secure Shell (SSH) key used to authenticate the user to the server. The three standard SSH public key format elements are &lt;key type&gt;, &lt;body base64&gt;, and an optional &lt;comment&gt;, with spaces between each element. Transfer Family accepts RSA, ECDSA, and ED25519 keys.   For RSA keys, the key type is ssh-rsa.   For ED25519 keys, the key type is ssh-ed25519.   For ECDSA keys, the key type is either ecdsa-sha2-nistp256, ecdsa-sha2-nistp384, or ecdsa-sha2-nistp521, depending on the size of the key you generated.  
     */
    SshPublicKeyBody?: SshPublicKeyBody;
    /**
     * Key-value pairs that can be used to group and search for users. Tags are metadata attached to users for any purpose.
     */
    Tags?: Tags;
    /**
     * A unique string that identifies a user and is associated with a ServerId. This user name must be a minimum of 3 and a maximum of 100 characters long. The following are valid characters: a-z, A-Z, 0-9, underscore '_', hyphen '-', period '.', and at sign '@'. The user name can't start with a hyphen, period, or at sign.
     */
    UserName: UserName;
  }
  export interface CreateUserResponse {
    /**
     * The identifier of the server that the user is attached to.
     */
    ServerId: ServerId;
    /**
     * A unique string that identifies a Transfer Family user.
     */
    UserName: UserName;
  }
  export interface CreateWorkflowRequest {
    /**
     * A textual description for the workflow.
     */
    Description?: WorkflowDescription;
    /**
     * Specifies the details for the steps that are in the specified workflow.  The TYPE specifies which of the following actions is being taken for this step.      COPY  - Copy the file to another location.     CUSTOM  - Perform a custom step with an Lambda function target.     DECRYPT  - Decrypt a file that was encrypted before it was uploaded.     DELETE  - Delete the file.     TAG  - Add a tag to the file.     Currently, copying and tagging are supported only on S3.    For file location, you specify either the Amazon S3 bucket and key, or the Amazon EFS file system ID and path. 
     */
    Steps: WorkflowSteps;
    /**
     * Specifies the steps (actions) to take if errors are encountered during execution of the workflow.  For custom steps, the Lambda function needs to send FAILURE to the call back API to kick off the exception steps. Additionally, if the Lambda does not send SUCCESS before it times out, the exception steps are executed. 
     */
    OnExceptionSteps?: WorkflowSteps;
    /**
     * Key-value pairs that can be used to group and search for workflows. Tags are metadata attached to workflows for any purpose.
     */
    Tags?: Tags;
  }
  export interface CreateWorkflowResponse {
    /**
     * A unique identifier for the workflow.
     */
    WorkflowId: WorkflowId;
  }
  export interface CustomStepDetails {
    /**
     * The name of the step, used as an identifier.
     */
    Name?: WorkflowStepName;
    /**
     * The ARN for the Lambda function that is being called.
     */
    Target?: CustomStepTarget;
    /**
     * Timeout, in seconds, for the step.
     */
    TimeoutSeconds?: CustomStepTimeoutSeconds;
    /**
     * Specifies which file to use as input to the workflow step: either the output from the previous step, or the originally uploaded file for the workflow.   To use the previous file as the input, enter ${previous.file}. In this case, this workflow step uses the output file from the previous workflow step as input. This is the default value.   To use the originally uploaded file location as input for this step, enter ${original.file}.  
     */
    SourceFileLocation?: SourceFileLocation;
  }
  export type CustomStepStatus = "SUCCESS"|"FAILURE"|string;
  export type CustomStepTarget = string;
  export type CustomStepTimeoutSeconds = number;
  export type DateImported = Date;
  export interface DecryptStepDetails {
    /**
     * The name of the step, used as an identifier.
     */
    Name?: WorkflowStepName;
    /**
     * The type of encryption used. Currently, this value must be PGP.
     */
    Type: EncryptionType;
    /**
     * Specifies which file to use as input to the workflow step: either the output from the previous step, or the originally uploaded file for the workflow.   To use the previous file as the input, enter ${previous.file}. In this case, this workflow step uses the output file from the previous workflow step as input. This is the default value.   To use the originally uploaded file location as input for this step, enter ${original.file}.  
     */
    SourceFileLocation?: SourceFileLocation;
    /**
     * A flag that indicates whether to overwrite an existing file of the same name. The default is FALSE. If the workflow is processing a file that has the same name as an existing file, the behavior is as follows:   If OverwriteExisting is TRUE, the existing file is replaced with the file being processed.   If OverwriteExisting is FALSE, nothing happens, and the workflow processing stops.  
     */
    OverwriteExisting?: OverwriteExisting;
    /**
     * Specifies the location for the file being decrypted. Use ${Transfer:UserName} or ${Transfer:UploadDate} in this field to parametrize the destination prefix by username or uploaded date.   Set the value of DestinationFileLocation to ${Transfer:UserName} to decrypt uploaded files to an Amazon S3 bucket that is prefixed with the name of the Transfer Family user that uploaded the file.   Set the value of DestinationFileLocation to ${Transfer:UploadDate} to decrypt uploaded files to an Amazon S3 bucket that is prefixed with the date of the upload.  The system resolves UploadDate to a date format of YYYY-MM-DD, based on the date the file is uploaded in UTC.   
     */
    DestinationFileLocation: InputFileLocation;
  }
  export interface DeleteAccessRequest {
    /**
     * A system-assigned unique identifier for a server that has this user assigned.
     */
    ServerId: ServerId;
    /**
     * A unique identifier that is required to identify specific groups within your directory. The users of the group that you associate have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Transfer Family. If you know the group name, you can view the SID values by running the following command using Windows PowerShell.  Get-ADGroup -Filter {samAccountName -like "YourGroupName*"} -Properties * | Select SamAccountName,ObjectSid  In that command, replace YourGroupName with the name of your Active Directory group. The regular expression used to validate this parameter is a string of characters consisting of uppercase and lowercase alphanumeric characters with no spaces. You can also include underscores or any of the following characters: =,.@:/-
     */
    ExternalId: ExternalId;
  }
  export interface DeleteAgreementRequest {
    /**
     * A unique identifier for the agreement. This identifier is returned when you create an agreement.
     */
    AgreementId: AgreementId;
    /**
     * The server identifier associated with the agreement that you are deleting.
     */
    ServerId: ServerId;
  }
  export interface DeleteCertificateRequest {
    /**
     * The identifier of the certificate object that you are deleting.
     */
    CertificateId: CertificateId;
  }
  export interface DeleteConnectorRequest {
    /**
     * The unique identifier for the connector.
     */
    ConnectorId: ConnectorId;
  }
  export interface DeleteHostKeyRequest {
    /**
     * The identifier of the server that contains the host key that you are deleting.
     */
    ServerId: ServerId;
    /**
     * The identifier of the host key that you are deleting.
     */
    HostKeyId: HostKeyId;
  }
  export interface DeleteProfileRequest {
    /**
     * The identifier of the profile that you are deleting.
     */
    ProfileId: ProfileId;
  }
  export interface DeleteServerRequest {
    /**
     * A unique system-assigned identifier for a server instance.
     */
    ServerId: ServerId;
  }
  export interface DeleteSshPublicKeyRequest {
    /**
     * A system-assigned unique identifier for a file transfer protocol-enabled server instance that has the user assigned to it.
     */
    ServerId: ServerId;
    /**
     * A unique identifier used to reference your user's specific SSH key.
     */
    SshPublicKeyId: SshPublicKeyId;
    /**
     * A unique string that identifies a user whose public key is being deleted.
     */
    UserName: UserName;
  }
  export interface DeleteStepDetails {
    /**
     * The name of the step, used as an identifier.
     */
    Name?: WorkflowStepName;
    /**
     * Specifies which file to use as input to the workflow step: either the output from the previous step, or the originally uploaded file for the workflow.   To use the previous file as the input, enter ${previous.file}. In this case, this workflow step uses the output file from the previous workflow step as input. This is the default value.   To use the originally uploaded file location as input for this step, enter ${original.file}.  
     */
    SourceFileLocation?: SourceFileLocation;
  }
  export interface DeleteUserRequest {
    /**
     * A system-assigned unique identifier for a server instance that has the user assigned to it.
     */
    ServerId: ServerId;
    /**
     * A unique string that identifies a user that is being deleted from a server.
     */
    UserName: UserName;
  }
  export interface DeleteWorkflowRequest {
    /**
     * A unique identifier for the workflow.
     */
    WorkflowId: WorkflowId;
  }
  export interface DescribeAccessRequest {
    /**
     * A system-assigned unique identifier for a server that has this access assigned.
     */
    ServerId: ServerId;
    /**
     * A unique identifier that is required to identify specific groups within your directory. The users of the group that you associate have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Transfer Family. If you know the group name, you can view the SID values by running the following command using Windows PowerShell.  Get-ADGroup -Filter {samAccountName -like "YourGroupName*"} -Properties * | Select SamAccountName,ObjectSid  In that command, replace YourGroupName with the name of your Active Directory group. The regular expression used to validate this parameter is a string of characters consisting of uppercase and lowercase alphanumeric characters with no spaces. You can also include underscores or any of the following characters: =,.@:/-
     */
    ExternalId: ExternalId;
  }
  export interface DescribeAccessResponse {
    /**
     * A system-assigned unique identifier for a server that has this access assigned.
     */
    ServerId: ServerId;
    /**
     * The external identifier of the server that the access is attached to.
     */
    Access: DescribedAccess;
  }
  export interface DescribeAgreementRequest {
    /**
     * A unique identifier for the agreement. This identifier is returned when you create an agreement.
     */
    AgreementId: AgreementId;
    /**
     * The server identifier that's associated with the agreement.
     */
    ServerId: ServerId;
  }
  export interface DescribeAgreementResponse {
    /**
     * The details for the specified agreement, returned as a DescribedAgreement object.
     */
    Agreement: DescribedAgreement;
  }
  export interface DescribeCertificateRequest {
    /**
     * An array of identifiers for the imported certificates. You use this identifier for working with profiles and partner profiles.
     */
    CertificateId: CertificateId;
  }
  export interface DescribeCertificateResponse {
    /**
     * The details for the specified certificate, returned as an object.
     */
    Certificate: DescribedCertificate;
  }
  export interface DescribeConnectorRequest {
    /**
     * The unique identifier for the connector.
     */
    ConnectorId: ConnectorId;
  }
  export interface DescribeConnectorResponse {
    /**
     * The structure that contains the details of the connector.
     */
    Connector: DescribedConnector;
  }
  export interface DescribeExecutionRequest {
    /**
     * A unique identifier for the execution of a workflow.
     */
    ExecutionId: ExecutionId;
    /**
     * A unique identifier for the workflow.
     */
    WorkflowId: WorkflowId;
  }
  export interface DescribeExecutionResponse {
    /**
     * A unique identifier for the workflow.
     */
    WorkflowId: WorkflowId;
    /**
     * The structure that contains the details of the workflow' execution.
     */
    Execution: DescribedExecution;
  }
  export interface DescribeHostKeyRequest {
    /**
     * The identifier of the server that contains the host key that you want described.
     */
    ServerId: ServerId;
    /**
     * The identifier of the host key that you want described.
     */
    HostKeyId: HostKeyId;
  }
  export interface DescribeHostKeyResponse {
    /**
     * Returns the details for the specified host key.
     */
    HostKey: DescribedHostKey;
  }
  export interface DescribeProfileRequest {
    /**
     * The identifier of the profile that you want described.
     */
    ProfileId: ProfileId;
  }
  export interface DescribeProfileResponse {
    /**
     * The details of the specified profile, returned as an object.
     */
    Profile: DescribedProfile;
  }
  export interface DescribeSecurityPolicyRequest {
    /**
     * Specifies the name of the security policy that is attached to the server.
     */
    SecurityPolicyName: SecurityPolicyName;
  }
  export interface DescribeSecurityPolicyResponse {
    /**
     * An array containing the properties of the security policy.
     */
    SecurityPolicy: DescribedSecurityPolicy;
  }
  export interface DescribeServerRequest {
    /**
     * A system-assigned unique identifier for a server.
     */
    ServerId: ServerId;
  }
  export interface DescribeServerResponse {
    /**
     * An array containing the properties of a server with the ServerID you specified.
     */
    Server: DescribedServer;
  }
  export interface DescribeUserRequest {
    /**
     * A system-assigned unique identifier for a server that has this user assigned.
     */
    ServerId: ServerId;
    /**
     * The name of the user assigned to one or more servers. User names are part of the sign-in credentials to use the Transfer Family service and perform file transfer tasks.
     */
    UserName: UserName;
  }
  export interface DescribeUserResponse {
    /**
     * A system-assigned unique identifier for a server that has this user assigned.
     */
    ServerId: ServerId;
    /**
     * An array containing the properties of the Transfer Family user for the ServerID value that you specified.
     */
    User: DescribedUser;
  }
  export interface DescribeWorkflowRequest {
    /**
     * A unique identifier for the workflow.
     */
    WorkflowId: WorkflowId;
  }
  export interface DescribeWorkflowResponse {
    /**
     * The structure that contains the details of the workflow.
     */
    Workflow: DescribedWorkflow;
  }
  export interface DescribedAccess {
    /**
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.  The HomeDirectory parameter is only used if HomeDirectoryType is set to LOGICAL. 
     */
    HomeDirectory?: HomeDirectory;
    /**
     * Logical directory mappings that specify what Amazon S3 or Amazon EFS paths and keys should be visible to your user and how you want to make them visible. You must specify the Entry and Target pair, where Entry shows how the path is made visible and Target is the actual Amazon S3 or Amazon EFS path. If you only specify a target, it is displayed as is. You also must ensure that your Identity and Access Management (IAM) role provides access to paths in Target. This value can be set only when HomeDirectoryType is set to LOGICAL. In most cases, you can use this value instead of the session policy to lock down the associated access to the designated home directory ("chroot"). To do this, you can set Entry to '/' and set Target to the HomeDirectory parameter value.
     */
    HomeDirectoryMappings?: HomeDirectoryMappings;
    /**
     * The type of landing directory (folder) that you want your users' home directory to be when they log in to the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or Amazon EFS path as is in their file transfer protocol clients. If you set it to LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or Amazon EFS paths visible to your users.  If HomeDirectoryType is LOGICAL, you must provide mappings, using the HomeDirectoryMappings parameter. If, on the other hand, HomeDirectoryType is PATH, you provide an absolute path using the HomeDirectory parameter. You cannot have both HomeDirectory and HomeDirectoryMappings in your template. 
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * A session policy for your user so that you can use the same Identity and Access Management (IAM) role across multiple users. This policy scopes down a user's access to portions of their Amazon S3 bucket. Variables that you can use inside this policy include ${Transfer:UserName}, ${Transfer:HomeDirectory}, and ${Transfer:HomeBucket}.
     */
    Policy?: Policy;
    PosixProfile?: PosixProfile;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that controls your users' access to your Amazon S3 bucket or Amazon EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or Amazon EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
     */
    Role?: Role;
    /**
     * A unique identifier that is required to identify specific groups within your directory. The users of the group that you associate have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Transfer Family. If you know the group name, you can view the SID values by running the following command using Windows PowerShell.  Get-ADGroup -Filter {samAccountName -like "YourGroupName*"} -Properties * | Select SamAccountName,ObjectSid  In that command, replace YourGroupName with the name of your Active Directory group. The regular expression used to validate this parameter is a string of characters consisting of uppercase and lowercase alphanumeric characters with no spaces. You can also include underscores or any of the following characters: =,.@:/-
     */
    ExternalId?: ExternalId;
  }
  export interface DescribedAgreement {
    /**
     * The unique Amazon Resource Name (ARN) for the agreement.
     */
    Arn: Arn;
    /**
     * A unique identifier for the agreement. This identifier is returned when you create an agreement.
     */
    AgreementId?: AgreementId;
    /**
     * The name or short description that's used to identify the agreement.
     */
    Description?: Description;
    /**
     * The current status of the agreement, either ACTIVE or INACTIVE.
     */
    Status?: AgreementStatusType;
    /**
     * A system-assigned unique identifier for a server instance. This identifier indicates the specific server that the agreement uses.
     */
    ServerId?: ServerId;
    /**
     * A unique identifier for the AS2 local profile.
     */
    LocalProfileId?: ProfileId;
    /**
     * A unique identifier for the partner profile used in the agreement.
     */
    PartnerProfileId?: ProfileId;
    /**
     * The landing directory (folder) for files that are transferred by using the AS2 protocol.
     */
    BaseDirectory?: HomeDirectory;
    /**
     * Connectors are used to send files using either the AS2 or SFTP protocol. For the access role, provide the Amazon Resource Name (ARN) of the Identity and Access Management role to use.  For AS2 connectors  With AS2, you can send files by calling StartFileTransfer and specifying the file paths in the request parameter, SendFilePaths. We use the file’s parent directory (for example, for --send-file-paths /bucket/dir/file.txt, parent directory is /bucket/dir/) to temporarily store a processed AS2 message file, store the MDN when we receive them from the partner, and write a final JSON file containing relevant metadata of the transmission. So, the AccessRole needs to provide read and write access to the parent directory of the file location used in the StartFileTransfer request. Additionally, you need to provide read and write access to the parent directory of the files that you intend to send with StartFileTransfer. If you are using Basic authentication for your AS2 connector, the access role requires the secretsmanager:GetSecretValue permission for the secret. If the secret is encrypted using a customer-managed key instead of the Amazon Web Services managed key in Secrets Manager, then the role also needs the kms:Decrypt permission for that key.  For SFTP connectors  Make sure that the access role provides read and write access to the parent directory of the file location that's used in the StartFileTransfer request. Additionally, make sure that the role provides secretsmanager:GetSecretValue permission to Secrets Manager.
     */
    AccessRole?: Role;
    /**
     * Key-value pairs that can be used to group and search for agreements.
     */
    Tags?: Tags;
  }
  export interface DescribedCertificate {
    /**
     * The unique Amazon Resource Name (ARN) for the certificate.
     */
    Arn: Arn;
    /**
     * An array of identifiers for the imported certificates. You use this identifier for working with profiles and partner profiles.
     */
    CertificateId?: CertificateId;
    /**
     * Specifies whether this certificate is used for signing or encryption.
     */
    Usage?: CertificateUsageType;
    /**
     * The certificate can be either ACTIVE, PENDING_ROTATION, or INACTIVE. PENDING_ROTATION means that this certificate will replace the current certificate when it expires.
     */
    Status?: CertificateStatusType;
    /**
     * The file name for the certificate.
     */
    Certificate?: CertificateBodyType;
    /**
     * The list of certificates that make up the chain for the certificate.
     */
    CertificateChain?: CertificateChainType;
    /**
     * An optional date that specifies when the certificate becomes active.
     */
    ActiveDate?: CertDate;
    /**
     * An optional date that specifies when the certificate becomes inactive.
     */
    InactiveDate?: CertDate;
    /**
     * The serial number for the certificate.
     */
    Serial?: CertSerial;
    /**
     * The earliest date that the certificate is valid.
     */
    NotBeforeDate?: CertDate;
    /**
     * The final date that the certificate is valid.
     */
    NotAfterDate?: CertDate;
    /**
     * If a private key has been specified for the certificate, its type is CERTIFICATE_WITH_PRIVATE_KEY. If there is no private key, the type is CERTIFICATE.
     */
    Type?: CertificateType;
    /**
     * The name or description that's used to identity the certificate. 
     */
    Description?: Description;
    /**
     * Key-value pairs that can be used to group and search for certificates.
     */
    Tags?: Tags;
  }
  export interface DescribedConnector {
    /**
     * The unique Amazon Resource Name (ARN) for the connector.
     */
    Arn: Arn;
    /**
     * The unique identifier for the connector.
     */
    ConnectorId?: ConnectorId;
    /**
     * The URL of the partner's AS2 or SFTP endpoint.
     */
    Url?: Url;
    /**
     * A structure that contains the parameters for an AS2 connector object.
     */
    As2Config?: As2ConnectorConfig;
    /**
     * Connectors are used to send files using either the AS2 or SFTP protocol. For the access role, provide the Amazon Resource Name (ARN) of the Identity and Access Management role to use.  For AS2 connectors  With AS2, you can send files by calling StartFileTransfer and specifying the file paths in the request parameter, SendFilePaths. We use the file’s parent directory (for example, for --send-file-paths /bucket/dir/file.txt, parent directory is /bucket/dir/) to temporarily store a processed AS2 message file, store the MDN when we receive them from the partner, and write a final JSON file containing relevant metadata of the transmission. So, the AccessRole needs to provide read and write access to the parent directory of the file location used in the StartFileTransfer request. Additionally, you need to provide read and write access to the parent directory of the files that you intend to send with StartFileTransfer. If you are using Basic authentication for your AS2 connector, the access role requires the secretsmanager:GetSecretValue permission for the secret. If the secret is encrypted using a customer-managed key instead of the Amazon Web Services managed key in Secrets Manager, then the role also needs the kms:Decrypt permission for that key.  For SFTP connectors  Make sure that the access role provides read and write access to the parent directory of the file location that's used in the StartFileTransfer request. Additionally, make sure that the role provides secretsmanager:GetSecretValue permission to Secrets Manager.
     */
    AccessRole?: Role;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that allows a connector to turn on CloudWatch logging for Amazon S3 events. When set, you can view connector activity in your CloudWatch logs.
     */
    LoggingRole?: Role;
    /**
     * Key-value pairs that can be used to group and search for connectors.
     */
    Tags?: Tags;
    /**
     * A structure that contains the parameters for an SFTP connector object.
     */
    SftpConfig?: SftpConnectorConfig;
  }
  export interface DescribedExecution {
    /**
     * A unique identifier for the execution of a workflow.
     */
    ExecutionId?: ExecutionId;
    /**
     * A structure that describes the Amazon S3 or EFS file location. This is the file location when the execution begins: if the file is being copied, this is the initial (as opposed to destination) file location.
     */
    InitialFileLocation?: FileLocation;
    /**
     * A container object for the session details that are associated with a workflow.
     */
    ServiceMetadata?: ServiceMetadata;
    /**
     * The IAM role associated with the execution.
     */
    ExecutionRole?: Role;
    /**
     * The IAM logging role associated with the execution.
     */
    LoggingConfiguration?: LoggingConfiguration;
    PosixProfile?: PosixProfile;
    /**
     * The status is one of the execution. Can be in progress, completed, exception encountered, or handling the exception. 
     */
    Status?: ExecutionStatus;
    /**
     * A structure that describes the execution results. This includes a list of the steps along with the details of each step, error type and message (if any), and the OnExceptionSteps structure.
     */
    Results?: ExecutionResults;
  }
  export interface DescribedHostKey {
    /**
     * The unique Amazon Resource Name (ARN) for the host key.
     */
    Arn: Arn;
    /**
     * A unique identifier for the host key.
     */
    HostKeyId?: HostKeyId;
    /**
     * The public key fingerprint, which is a short sequence of bytes used to identify the longer public key.
     */
    HostKeyFingerprint?: HostKeyFingerprint;
    /**
     * The text description for this host key.
     */
    Description?: HostKeyDescription;
    /**
     * The encryption algorithm that is used for the host key. The Type parameter is specified by using one of the following values:    ssh-rsa     ssh-ed25519     ecdsa-sha2-nistp256     ecdsa-sha2-nistp384     ecdsa-sha2-nistp521   
     */
    Type?: HostKeyType;
    /**
     * The date on which the host key was added to the server.
     */
    DateImported?: DateImported;
    /**
     * Key-value pairs that can be used to group and search for host keys.
     */
    Tags?: Tags;
  }
  export interface DescribedProfile {
    /**
     * The unique Amazon Resource Name (ARN) for the profile.
     */
    Arn: Arn;
    /**
     * A unique identifier for the local or partner AS2 profile.
     */
    ProfileId?: ProfileId;
    /**
     * Indicates whether to list only LOCAL type profiles or only PARTNER type profiles. If not supplied in the request, the command lists all types of profiles.
     */
    ProfileType?: ProfileType;
    /**
     * The As2Id is the AS2-name, as defined in the RFC 4130. For inbound transfers, this is the AS2-From header for the AS2 messages sent from the partner. For outbound connectors, this is the AS2-To header for the AS2 messages sent to the partner using the StartFileTransfer API operation. This ID cannot include spaces.
     */
    As2Id?: As2Id;
    /**
     * An array of identifiers for the imported certificates. You use this identifier for working with profiles and partner profiles.
     */
    CertificateIds?: CertificateIds;
    /**
     * Key-value pairs that can be used to group and search for profiles.
     */
    Tags?: Tags;
  }
  export interface DescribedSecurityPolicy {
    /**
     * Specifies whether this policy enables Federal Information Processing Standards (FIPS).
     */
    Fips?: Fips;
    /**
     * Specifies the name of the security policy that is attached to the server.
     */
    SecurityPolicyName: SecurityPolicyName;
    /**
     * Specifies the enabled Secure Shell (SSH) cipher encryption algorithms in the security policy that is attached to the server.
     */
    SshCiphers?: SecurityPolicyOptions;
    /**
     * Specifies the enabled SSH key exchange (KEX) encryption algorithms in the security policy that is attached to the server.
     */
    SshKexs?: SecurityPolicyOptions;
    /**
     * Specifies the enabled SSH message authentication code (MAC) encryption algorithms in the security policy that is attached to the server.
     */
    SshMacs?: SecurityPolicyOptions;
    /**
     * Specifies the enabled Transport Layer Security (TLS) cipher encryption algorithms in the security policy that is attached to the server.
     */
    TlsCiphers?: SecurityPolicyOptions;
  }
  export interface DescribedServer {
    /**
     * Specifies the unique Amazon Resource Name (ARN) of the server.
     */
    Arn: Arn;
    /**
     * Specifies the ARN of the Amazon Web ServicesCertificate Manager (ACM) certificate. Required when Protocols is set to FTPS.
     */
    Certificate?: Certificate;
    /**
     * The protocol settings that are configured for your server.    To indicate passive mode (for FTP and FTPS protocols), use the PassiveIp parameter. Enter a single dotted-quad IPv4 address, such as the external IP address of a firewall, router, or load balancer.    To ignore the error that is generated when the client attempts to use the SETSTAT command on a file that you are uploading to an Amazon S3 bucket, use the SetStatOption parameter. To have the Transfer Family server ignore the SETSTAT command and upload files without needing to make any changes to your SFTP client, set the value to ENABLE_NO_OP. If you set the SetStatOption parameter to ENABLE_NO_OP, Transfer Family generates a log entry to Amazon CloudWatch Logs, so that you can determine when the client is making a SETSTAT call.   To determine whether your Transfer Family server resumes recent, negotiated sessions through a unique session ID, use the TlsSessionResumptionMode parameter.    As2Transports indicates the transport method for the AS2 messages. Currently, only HTTP is supported.  
     */
    ProtocolDetails?: ProtocolDetails;
    /**
     * Specifies the domain of the storage system that is used for file transfers.
     */
    Domain?: Domain;
    /**
     * The virtual private cloud (VPC) endpoint settings that are configured for your server. When you host your endpoint within your VPC, you can make your endpoint accessible only to resources within your VPC, or you can attach Elastic IP addresses and make your endpoint accessible to clients over the internet. Your VPC's default security groups are automatically assigned to your endpoint.
     */
    EndpointDetails?: EndpointDetails;
    /**
     * Defines the type of endpoint that your server is connected to. If your server is connected to a VPC endpoint, your server isn't accessible over the public internet.
     */
    EndpointType?: EndpointType;
    /**
     * Specifies the Base64-encoded SHA256 fingerprint of the server's host key. This value is equivalent to the output of the ssh-keygen -l -f my-new-server-key command.
     */
    HostKeyFingerprint?: HostKeyFingerprint;
    /**
     * Specifies information to call a customer-supplied authentication API. This field is not populated when the IdentityProviderType of a server is AWS_DIRECTORY_SERVICE or SERVICE_MANAGED.
     */
    IdentityProviderDetails?: IdentityProviderDetails;
    /**
     * The mode of authentication for a server. The default value is SERVICE_MANAGED, which allows you to store and access user credentials within the Transfer Family service. Use AWS_DIRECTORY_SERVICE to provide access to Active Directory groups in Directory Service for Microsoft Active Directory or Microsoft Active Directory in your on-premises environment or in Amazon Web Services using AD Connector. This option also requires you to provide a Directory ID by using the IdentityProviderDetails parameter. Use the API_GATEWAY value to integrate with an identity provider of your choosing. The API_GATEWAY setting requires you to provide an Amazon API Gateway endpoint URL to call for authentication by using the IdentityProviderDetails parameter. Use the AWS_LAMBDA value to directly use an Lambda function as your identity provider. If you choose this value, you must specify the ARN for the Lambda function in the Function parameter for the IdentityProviderDetails data type.
     */
    IdentityProviderType?: IdentityProviderType;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that allows a server to turn on Amazon CloudWatch logging for Amazon S3 or Amazon EFSevents. When set, you can view user activity in your CloudWatch logs.
     */
    LoggingRole?: Role;
    /**
     * Specifies a string to display when users connect to a server. This string is displayed after the user authenticates.  The SFTP protocol does not support post-authentication display banners. 
     */
    PostAuthenticationLoginBanner?: PostAuthenticationLoginBanner;
    /**
     * Specifies a string to display when users connect to a server. This string is displayed before the user authenticates. For example, the following banner displays details about using the system:  This system is for the use of authorized users only. Individuals using this computer system without authority, or in excess of their authority, are subject to having all of their activities on this system monitored and recorded by system personnel. 
     */
    PreAuthenticationLoginBanner?: PreAuthenticationLoginBanner;
    /**
     * Specifies the file transfer protocol or protocols over which your file transfer protocol client can connect to your server's endpoint. The available protocols are:    SFTP (Secure Shell (SSH) File Transfer Protocol): File transfer over SSH    FTPS (File Transfer Protocol Secure): File transfer with TLS encryption    FTP (File Transfer Protocol): Unencrypted file transfer    AS2 (Applicability Statement 2): used for transporting structured business-to-business data      If you select FTPS, you must choose a certificate stored in Certificate Manager (ACM) which is used to identify your server when clients connect to it over FTPS.   If Protocol includes either FTP or FTPS, then the EndpointType must be VPC and the IdentityProviderType must be either AWS_DIRECTORY_SERVICE, AWS_LAMBDA, or API_GATEWAY.   If Protocol includes FTP, then AddressAllocationIds cannot be associated.   If Protocol is set only to SFTP, the EndpointType can be set to PUBLIC and the IdentityProviderType can be set any of the supported identity types: SERVICE_MANAGED, AWS_DIRECTORY_SERVICE, AWS_LAMBDA, or API_GATEWAY.   If Protocol includes AS2, then the EndpointType must be VPC, and domain must be Amazon S3.   
     */
    Protocols?: Protocols;
    /**
     * Specifies the name of the security policy that is attached to the server.
     */
    SecurityPolicyName?: SecurityPolicyName;
    /**
     * Specifies the unique system-assigned identifier for a server that you instantiate.
     */
    ServerId?: ServerId;
    /**
     * The condition of the server that was described. A value of ONLINE indicates that the server can accept jobs and transfer files. A State value of OFFLINE means that the server cannot perform file transfer operations. The states of STARTING and STOPPING indicate that the server is in an intermediate state, either not fully able to respond, or not fully offline. The values of START_FAILED or STOP_FAILED can indicate an error condition.
     */
    State?: State;
    /**
     * Specifies the key-value pairs that you can use to search for and group servers that were assigned to the server that was described.
     */
    Tags?: Tags;
    /**
     * Specifies the number of users that are assigned to a server you specified with the ServerId.
     */
    UserCount?: UserCount;
    /**
     * Specifies the workflow ID for the workflow to assign and the execution role that's used for executing the workflow. In addition to a workflow to execute when a file is uploaded completely, WorkflowDetails can also contain a workflow ID (and execution role) for a workflow to execute on partial upload. A partial upload occurs when the server session disconnects while the file is still being uploaded.
     */
    WorkflowDetails?: WorkflowDetails;
    /**
     * Specifies the log groups to which your server logs are sent. To specify a log group, you must provide the ARN for an existing log group. In this case, the format of the log group is as follows:  arn:aws:logs:region-name:amazon-account-id:log-group:log-group-name:*  For example, arn:aws:logs:us-east-1:111122223333:log-group:mytestgroup:*  If you have previously specified a log group for a server, you can clear it, and in effect turn off structured logging, by providing an empty value for this parameter in an update-server call. For example:  update-server --server-id s-1234567890abcdef0 --structured-log-destinations 
     */
    StructuredLogDestinations?: StructuredLogDestinations;
  }
  export interface DescribedUser {
    /**
     * Specifies the unique Amazon Resource Name (ARN) for the user that was requested to be described.
     */
    Arn: Arn;
    /**
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.  The HomeDirectory parameter is only used if HomeDirectoryType is set to LOGICAL. 
     */
    HomeDirectory?: HomeDirectory;
    /**
     * Logical directory mappings that specify what Amazon S3 or Amazon EFS paths and keys should be visible to your user and how you want to make them visible. You must specify the Entry and Target pair, where Entry shows how the path is made visible and Target is the actual Amazon S3 or Amazon EFS path. If you only specify a target, it is displayed as is. You also must ensure that your Identity and Access Management (IAM) role provides access to paths in Target. This value can be set only when HomeDirectoryType is set to LOGICAL. In most cases, you can use this value instead of the session policy to lock your user down to the designated home directory ("chroot"). To do this, you can set Entry to '/' and set Target to the HomeDirectory parameter value.
     */
    HomeDirectoryMappings?: HomeDirectoryMappings;
    /**
     * The type of landing directory (folder) that you want your users' home directory to be when they log in to the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or Amazon EFS path as is in their file transfer protocol clients. If you set it to LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or Amazon EFS paths visible to your users.  If HomeDirectoryType is LOGICAL, you must provide mappings, using the HomeDirectoryMappings parameter. If, on the other hand, HomeDirectoryType is PATH, you provide an absolute path using the HomeDirectory parameter. You cannot have both HomeDirectory and HomeDirectoryMappings in your template. 
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * A session policy for your user so that you can use the same Identity and Access Management (IAM) role across multiple users. This policy scopes down a user's access to portions of their Amazon S3 bucket. Variables that you can use inside this policy include ${Transfer:UserName}, ${Transfer:HomeDirectory}, and ${Transfer:HomeBucket}.
     */
    Policy?: Policy;
    /**
     * Specifies the full POSIX identity, including user ID (Uid), group ID (Gid), and any secondary groups IDs (SecondaryGids), that controls your users' access to your Amazon Elastic File System (Amazon EFS) file systems. The POSIX permissions that are set on files and directories in your file system determine the level of access your users get when transferring files into and out of your Amazon EFS file systems.
     */
    PosixProfile?: PosixProfile;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that controls your users' access to your Amazon S3 bucket or Amazon EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or Amazon EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
     */
    Role?: Role;
    /**
     * Specifies the public key portion of the Secure Shell (SSH) keys stored for the described user.
     */
    SshPublicKeys?: SshPublicKeys;
    /**
     * Specifies the key-value pairs for the user requested. Tag can be used to search for and group users for a variety of purposes.
     */
    Tags?: Tags;
    /**
     * Specifies the name of the user that was requested to be described. User names are used for authentication purposes. This is the string that will be used by your user when they log in to your server.
     */
    UserName?: UserName;
  }
  export interface DescribedWorkflow {
    /**
     * Specifies the unique Amazon Resource Name (ARN) for the workflow.
     */
    Arn: Arn;
    /**
     * Specifies the text description for the workflow.
     */
    Description?: WorkflowDescription;
    /**
     * Specifies the details for the steps that are in the specified workflow.
     */
    Steps?: WorkflowSteps;
    /**
     * Specifies the steps (actions) to take if errors are encountered during execution of the workflow.
     */
    OnExceptionSteps?: WorkflowSteps;
    /**
     * A unique identifier for the workflow.
     */
    WorkflowId?: WorkflowId;
    /**
     * Key-value pairs that can be used to group and search for workflows. Tags are metadata attached to workflows for any purpose.
     */
    Tags?: Tags;
  }
  export type Description = string;
  export type DirectoryId = string;
  export type Domain = "S3"|"EFS"|string;
  export interface EfsFileLocation {
    /**
     * The identifier of the file system, assigned by Amazon EFS.
     */
    FileSystemId?: EfsFileSystemId;
    /**
     * The pathname for the folder being used by a workflow.
     */
    Path?: EfsPath;
  }
  export type EfsFileSystemId = string;
  export type EfsPath = string;
  export type EncryptionAlg = "AES128_CBC"|"AES192_CBC"|"AES256_CBC"|"NONE"|string;
  export type EncryptionType = "PGP"|string;
  export interface EndpointDetails {
    /**
     * A list of address allocation IDs that are required to attach an Elastic IP address to your server's endpoint.  This property can only be set when EndpointType is set to VPC and it is only valid in the UpdateServer API. 
     */
    AddressAllocationIds?: AddressAllocationIds;
    /**
     * A list of subnet IDs that are required to host your server endpoint in your VPC.  This property can only be set when EndpointType is set to VPC. 
     */
    SubnetIds?: SubnetIds;
    /**
     * The identifier of the VPC endpoint.  This property can only be set when EndpointType is set to VPC_ENDPOINT. For more information, see https://docs.aws.amazon.com/transfer/latest/userguide/create-server-in-vpc.html#deprecate-vpc-endpoint. 
     */
    VpcEndpointId?: VpcEndpointId;
    /**
     * The VPC identifier of the VPC in which a server's endpoint will be hosted.  This property can only be set when EndpointType is set to VPC. 
     */
    VpcId?: VpcId;
    /**
     * A list of security groups IDs that are available to attach to your server's endpoint.  This property can only be set when EndpointType is set to VPC. You can edit the SecurityGroupIds property in the UpdateServer API only if you are changing the EndpointType from PUBLIC or VPC_ENDPOINT to VPC. To change security groups associated with your server's VPC endpoint after creation, use the Amazon EC2 ModifyVpcEndpoint API. 
     */
    SecurityGroupIds?: SecurityGroupIds;
  }
  export type EndpointType = "PUBLIC"|"VPC"|"VPC_ENDPOINT"|string;
  export interface ExecutionError {
    /**
     * Specifies the error type.    ALREADY_EXISTS: occurs for a copy step, if the overwrite option is not selected and a file with the same name already exists in the target location.    BAD_REQUEST: a general bad request: for example, a step that attempts to tag an EFS file returns BAD_REQUEST, as only S3 files can be tagged.    CUSTOM_STEP_FAILED: occurs when the custom step provided a callback that indicates failure.    INTERNAL_SERVER_ERROR: a catch-all error that can occur for a variety of reasons.    NOT_FOUND: occurs when a requested entity, for example a source file for a copy step, does not exist.    PERMISSION_DENIED: occurs if your policy does not contain the correct permissions to complete one or more of the steps in the workflow.    TIMEOUT: occurs when the execution times out.   You can set the TimeoutSeconds for a custom step, anywhere from 1 second to 1800 seconds (30 minutes).      THROTTLED: occurs if you exceed the new execution refill rate of one workflow per second.  
     */
    Type: ExecutionErrorType;
    /**
     * Specifies the descriptive message that corresponds to the ErrorType.
     */
    Message: ExecutionErrorMessage;
  }
  export type ExecutionErrorMessage = string;
  export type ExecutionErrorType = "PERMISSION_DENIED"|"CUSTOM_STEP_FAILED"|"THROTTLED"|"ALREADY_EXISTS"|"NOT_FOUND"|"BAD_REQUEST"|"TIMEOUT"|"INTERNAL_SERVER_ERROR"|string;
  export type ExecutionId = string;
  export interface ExecutionResults {
    /**
     * Specifies the details for the steps that are in the specified workflow.
     */
    Steps?: ExecutionStepResults;
    /**
     * Specifies the steps (actions) to take if errors are encountered during execution of the workflow.
     */
    OnExceptionSteps?: ExecutionStepResults;
  }
  export type ExecutionStatus = "IN_PROGRESS"|"COMPLETED"|"EXCEPTION"|"HANDLING_EXCEPTION"|string;
  export interface ExecutionStepResult {
    /**
     * One of the available step types.     COPY  - Copy the file to another location.     CUSTOM  - Perform a custom step with an Lambda function target.     DECRYPT  - Decrypt a file that was encrypted before it was uploaded.     DELETE  - Delete the file.     TAG  - Add a tag to the file.  
     */
    StepType?: WorkflowStepType;
    /**
     * The values for the key/value pair applied as a tag to the file. Only applicable if the step type is TAG.
     */
    Outputs?: StepResultOutputsJson;
    /**
     * Specifies the details for an error, if it occurred during execution of the specified workflow step.
     */
    Error?: ExecutionError;
  }
  export type ExecutionStepResults = ExecutionStepResult[];
  export type ExternalId = string;
  export interface FileLocation {
    /**
     * Specifies the S3 details for the file being used, such as bucket, ETag, and so forth.
     */
    S3FileLocation?: S3FileLocation;
    /**
     * Specifies the Amazon EFS identifier and the path for the file being used.
     */
    EfsFileLocation?: EfsFileLocation;
  }
  export type FilePath = string;
  export type FilePaths = FilePath[];
  export type Fips = boolean;
  export type Function = string;
  export type HomeDirectory = string;
  export interface HomeDirectoryMapEntry {
    /**
     * Represents an entry for HomeDirectoryMappings.
     */
    Entry: MapEntry;
    /**
     * Represents the map target that is used in a HomeDirectorymapEntry.
     */
    Target: MapTarget;
  }
  export type HomeDirectoryMappings = HomeDirectoryMapEntry[];
  export type HomeDirectoryType = "PATH"|"LOGICAL"|string;
  export type HostKey = string;
  export type HostKeyDescription = string;
  export type HostKeyFingerprint = string;
  export type HostKeyId = string;
  export type HostKeyType = string;
  export interface IdentityProviderDetails {
    /**
     * Provides the location of the service endpoint used to authenticate users.
     */
    Url?: Url;
    /**
     * This parameter is only applicable if your IdentityProviderType is API_GATEWAY. Provides the type of InvocationRole used to authenticate the user account.
     */
    InvocationRole?: Role;
    /**
     * The identifier of the Directory Service directory that you want to stop sharing.
     */
    DirectoryId?: DirectoryId;
    /**
     * The ARN for a Lambda function to use for the Identity provider.
     */
    Function?: Function;
    /**
     * For SFTP-enabled servers, and for custom identity providers only, you can specify whether to authenticate using a password, SSH key pair, or both.    PASSWORD - users must provide their password to connect.    PUBLIC_KEY - users must provide their private key to connect.    PUBLIC_KEY_OR_PASSWORD - users can authenticate with either their password or their key. This is the default value.    PUBLIC_KEY_AND_PASSWORD - users must provide both their private key and their password to connect. The server checks the key first, and then if the key is valid, the system prompts for a password. If the private key provided does not match the public key that is stored, authentication fails.  
     */
    SftpAuthenticationMethods?: SftpAuthenticationMethods;
  }
  export type IdentityProviderType = "SERVICE_MANAGED"|"API_GATEWAY"|"AWS_DIRECTORY_SERVICE"|"AWS_LAMBDA"|string;
  export interface ImportCertificateRequest {
    /**
     * Specifies whether this certificate is used for signing or encryption.
     */
    Usage: CertificateUsageType;
    /**
     *   For the CLI, provide a file path for a certificate in URI format. For example, --certificate file://encryption-cert.pem. Alternatively, you can provide the raw content.   For the SDK, specify the raw content of a certificate file. For example, --certificate "`cat encryption-cert.pem`".  
     */
    Certificate: CertificateBodyType;
    /**
     * An optional list of certificates that make up the chain for the certificate that's being imported.
     */
    CertificateChain?: CertificateChainType;
    /**
     *   For the CLI, provide a file path for a private key in URI format.For example, --private-key file://encryption-key.pem. Alternatively, you can provide the raw content of the private key file.   For the SDK, specify the raw content of a private key file. For example, --private-key "`cat encryption-key.pem`"   
     */
    PrivateKey?: PrivateKeyType;
    /**
     * An optional date that specifies when the certificate becomes active.
     */
    ActiveDate?: CertDate;
    /**
     * An optional date that specifies when the certificate becomes inactive.
     */
    InactiveDate?: CertDate;
    /**
     * A short description that helps identify the certificate. 
     */
    Description?: Description;
    /**
     * Key-value pairs that can be used to group and search for certificates.
     */
    Tags?: Tags;
  }
  export interface ImportCertificateResponse {
    /**
     * An array of identifiers for the imported certificates. You use this identifier for working with profiles and partner profiles.
     */
    CertificateId: CertificateId;
  }
  export interface ImportHostKeyRequest {
    /**
     * The identifier of the server that contains the host key that you are importing.
     */
    ServerId: ServerId;
    /**
     * The private key portion of an SSH key pair. Transfer Family accepts RSA, ECDSA, and ED25519 keys.
     */
    HostKeyBody: HostKey;
    /**
     * The text description that identifies this host key.
     */
    Description?: HostKeyDescription;
    /**
     * Key-value pairs that can be used to group and search for host keys.
     */
    Tags?: Tags;
  }
  export interface ImportHostKeyResponse {
    /**
     * Returns the server identifier that contains the imported key.
     */
    ServerId: ServerId;
    /**
     * Returns the host key identifier for the imported key.
     */
    HostKeyId: HostKeyId;
  }
  export interface ImportSshPublicKeyRequest {
    /**
     * A system-assigned unique identifier for a server.
     */
    ServerId: ServerId;
    /**
     * The public key portion of an SSH key pair. Transfer Family accepts RSA, ECDSA, and ED25519 keys.
     */
    SshPublicKeyBody: SshPublicKeyBody;
    /**
     * The name of the Transfer Family user that is assigned to one or more servers.
     */
    UserName: UserName;
  }
  export interface ImportSshPublicKeyResponse {
    /**
     * A system-assigned unique identifier for a server.
     */
    ServerId: ServerId;
    /**
     * The name given to a public key by the system that was imported.
     */
    SshPublicKeyId: SshPublicKeyId;
    /**
     * A user name assigned to the ServerID value that you specified.
     */
    UserName: UserName;
  }
  export interface InputFileLocation {
    /**
     * Specifies the details for the Amazon S3 file that's being copied or decrypted.
     */
    S3FileLocation?: S3InputFileLocation;
    /**
     * Specifies the details for the Amazon Elastic File System (Amazon EFS) file that's being decrypted.
     */
    EfsFileLocation?: EfsFileLocation;
  }
  export interface ListAccessesRequest {
    /**
     * Specifies the maximum number of access SIDs to return.
     */
    MaxResults?: MaxResults;
    /**
     * When you can get additional results from the ListAccesses call, a NextToken parameter is returned in the output. You can then pass in a subsequent command to the NextToken parameter to continue listing additional accesses.
     */
    NextToken?: NextToken;
    /**
     * A system-assigned unique identifier for a server that has users assigned to it.
     */
    ServerId: ServerId;
  }
  export interface ListAccessesResponse {
    /**
     * When you can get additional results from the ListAccesses call, a NextToken parameter is returned in the output. You can then pass in a subsequent command to the NextToken parameter to continue listing additional accesses.
     */
    NextToken?: NextToken;
    /**
     * A system-assigned unique identifier for a server that has users assigned to it.
     */
    ServerId: ServerId;
    /**
     * Returns the accesses and their properties for the ServerId value that you specify.
     */
    Accesses: ListedAccesses;
  }
  export interface ListAgreementsRequest {
    /**
     * The maximum number of agreements to return.
     */
    MaxResults?: MaxResults;
    /**
     * When you can get additional results from the ListAgreements call, a NextToken parameter is returned in the output. You can then pass in a subsequent command to the NextToken parameter to continue listing additional agreements.
     */
    NextToken?: NextToken;
    /**
     * The identifier of the server for which you want a list of agreements.
     */
    ServerId: ServerId;
  }
  export interface ListAgreementsResponse {
    /**
     * Returns a token that you can use to call ListAgreements again and receive additional results, if there are any.
     */
    NextToken?: NextToken;
    /**
     * Returns an array, where each item contains the details of an agreement.
     */
    Agreements: ListedAgreements;
  }
  export interface ListCertificatesRequest {
    /**
     * The maximum number of certificates to return.
     */
    MaxResults?: MaxResults;
    /**
     * When you can get additional results from the ListCertificates call, a NextToken parameter is returned in the output. You can then pass in a subsequent command to the NextToken parameter to continue listing additional certificates.
     */
    NextToken?: NextToken;
  }
  export interface ListCertificatesResponse {
    /**
     * Returns the next token, which you can use to list the next certificate.
     */
    NextToken?: NextToken;
    /**
     * Returns an array of the certificates that are specified in the ListCertificates call.
     */
    Certificates: ListedCertificates;
  }
  export interface ListConnectorsRequest {
    /**
     * The maximum number of connectors to return.
     */
    MaxResults?: MaxResults;
    /**
     * When you can get additional results from the ListConnectors call, a NextToken parameter is returned in the output. You can then pass in a subsequent command to the NextToken parameter to continue listing additional connectors.
     */
    NextToken?: NextToken;
  }
  export interface ListConnectorsResponse {
    /**
     * Returns a token that you can use to call ListConnectors again and receive additional results, if there are any.
     */
    NextToken?: NextToken;
    /**
     * Returns an array, where each item contains the details of a connector.
     */
    Connectors: ListedConnectors;
  }
  export interface ListExecutionsRequest {
    /**
     * Specifies the maximum number of executions to return.
     */
    MaxResults?: MaxResults;
    /**
     *  ListExecutions returns the NextToken parameter in the output. You can then pass the NextToken parameter in a subsequent command to continue listing additional executions.  This is useful for pagination, for instance. If you have 100 executions for a workflow, you might only want to list first 10. If so, call the API by specifying the max-results:   aws transfer list-executions --max-results 10   This returns details for the first 10 executions, as well as the pointer (NextToken) to the eleventh execution. You can now call the API again, supplying the NextToken value you received:   aws transfer list-executions --max-results 10 --next-token $somePointerReturnedFromPreviousListResult   This call returns the next 10 executions, the 11th through the 20th. You can then repeat the call until the details for all 100 executions have been returned. 
     */
    NextToken?: NextToken;
    /**
     * A unique identifier for the workflow.
     */
    WorkflowId: WorkflowId;
  }
  export interface ListExecutionsResponse {
    /**
     *  ListExecutions returns the NextToken parameter in the output. You can then pass the NextToken parameter in a subsequent command to continue listing additional executions.
     */
    NextToken?: NextToken;
    /**
     * A unique identifier for the workflow.
     */
    WorkflowId: WorkflowId;
    /**
     * Returns the details for each execution, in a ListedExecution array.
     */
    Executions: ListedExecutions;
  }
  export interface ListHostKeysRequest {
    /**
     * The maximum number of host keys to return.
     */
    MaxResults?: MaxResults;
    /**
     * When there are additional results that were not returned, a NextToken parameter is returned. You can use that value for a subsequent call to ListHostKeys to continue listing results.
     */
    NextToken?: NextToken;
    /**
     * The identifier of the server that contains the host keys that you want to view.
     */
    ServerId: ServerId;
  }
  export interface ListHostKeysResponse {
    /**
     * Returns a token that you can use to call ListHostKeys again and receive additional results, if there are any.
     */
    NextToken?: NextToken;
    /**
     * Returns the server identifier that contains the listed host keys.
     */
    ServerId: ServerId;
    /**
     * Returns an array, where each item contains the details of a host key.
     */
    HostKeys: ListedHostKeys;
  }
  export interface ListProfilesRequest {
    /**
     * The maximum number of profiles to return.
     */
    MaxResults?: MaxResults;
    /**
     * When there are additional results that were not returned, a NextToken parameter is returned. You can use that value for a subsequent call to ListProfiles to continue listing results.
     */
    NextToken?: NextToken;
    /**
     * Indicates whether to list only LOCAL type profiles or only PARTNER type profiles. If not supplied in the request, the command lists all types of profiles.
     */
    ProfileType?: ProfileType;
  }
  export interface ListProfilesResponse {
    /**
     * Returns a token that you can use to call ListProfiles again and receive additional results, if there are any.
     */
    NextToken?: NextToken;
    /**
     * Returns an array, where each item contains the details of a profile.
     */
    Profiles: ListedProfiles;
  }
  export interface ListSecurityPoliciesRequest {
    /**
     * Specifies the number of security policies to return as a response to the ListSecurityPolicies query.
     */
    MaxResults?: MaxResults;
    /**
     * When additional results are obtained from the ListSecurityPolicies command, a NextToken parameter is returned in the output. You can then pass the NextToken parameter in a subsequent command to continue listing additional security policies.
     */
    NextToken?: NextToken;
  }
  export interface ListSecurityPoliciesResponse {
    /**
     * When you can get additional results from the ListSecurityPolicies operation, a NextToken parameter is returned in the output. In a following command, you can pass in the NextToken parameter to continue listing security policies.
     */
    NextToken?: NextToken;
    /**
     * An array of security policies that were listed.
     */
    SecurityPolicyNames: SecurityPolicyNames;
  }
  export interface ListServersRequest {
    /**
     * Specifies the number of servers to return as a response to the ListServers query.
     */
    MaxResults?: MaxResults;
    /**
     * When additional results are obtained from the ListServers command, a NextToken parameter is returned in the output. You can then pass the NextToken parameter in a subsequent command to continue listing additional servers.
     */
    NextToken?: NextToken;
  }
  export interface ListServersResponse {
    /**
     * When you can get additional results from the ListServers operation, a NextToken parameter is returned in the output. In a following command, you can pass in the NextToken parameter to continue listing additional servers.
     */
    NextToken?: NextToken;
    /**
     * An array of servers that were listed.
     */
    Servers: ListedServers;
  }
  export interface ListTagsForResourceRequest {
    /**
     * Requests the tags associated with a particular Amazon Resource Name (ARN). An ARN is an identifier for a specific Amazon Web Services resource, such as a server, user, or role.
     */
    Arn: Arn;
    /**
     * Specifies the number of tags to return as a response to the ListTagsForResource request.
     */
    MaxResults?: MaxResults;
    /**
     * When you request additional results from the ListTagsForResource operation, a NextToken parameter is returned in the input. You can then pass in a subsequent command to the NextToken parameter to continue listing additional tags.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The ARN you specified to list the tags of.
     */
    Arn?: Arn;
    /**
     * When you can get additional results from the ListTagsForResource call, a NextToken parameter is returned in the output. You can then pass in a subsequent command to the NextToken parameter to continue listing additional tags.
     */
    NextToken?: NextToken;
    /**
     * Key-value pairs that are assigned to a resource, usually for the purpose of grouping and searching for items. Tags are metadata that you define.
     */
    Tags?: Tags;
  }
  export interface ListUsersRequest {
    /**
     * Specifies the number of users to return as a response to the ListUsers request.
     */
    MaxResults?: MaxResults;
    /**
     * If there are additional results from the ListUsers call, a NextToken parameter is returned in the output. You can then pass the NextToken to a subsequent ListUsers command, to continue listing additional users.
     */
    NextToken?: NextToken;
    /**
     * A system-assigned unique identifier for a server that has users assigned to it.
     */
    ServerId: ServerId;
  }
  export interface ListUsersResponse {
    /**
     * When you can get additional results from the ListUsers call, a NextToken parameter is returned in the output. You can then pass in a subsequent command to the NextToken parameter to continue listing additional users.
     */
    NextToken?: NextToken;
    /**
     * A system-assigned unique identifier for a server that the users are assigned to.
     */
    ServerId: ServerId;
    /**
     * Returns the Transfer Family users and their properties for the ServerId value that you specify.
     */
    Users: ListedUsers;
  }
  export interface ListWorkflowsRequest {
    /**
     * Specifies the maximum number of workflows to return.
     */
    MaxResults?: MaxResults;
    /**
     *  ListWorkflows returns the NextToken parameter in the output. You can then pass the NextToken parameter in a subsequent command to continue listing additional workflows.
     */
    NextToken?: NextToken;
  }
  export interface ListWorkflowsResponse {
    /**
     *  ListWorkflows returns the NextToken parameter in the output. You can then pass the NextToken parameter in a subsequent command to continue listing additional workflows.
     */
    NextToken?: NextToken;
    /**
     * Returns the Arn, WorkflowId, and Description for each workflow.
     */
    Workflows: ListedWorkflows;
  }
  export interface ListedAccess {
    /**
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.  The HomeDirectory parameter is only used if HomeDirectoryType is set to LOGICAL. 
     */
    HomeDirectory?: HomeDirectory;
    /**
     * The type of landing directory (folder) that you want your users' home directory to be when they log in to the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or Amazon EFS path as is in their file transfer protocol clients. If you set it to LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or Amazon EFS paths visible to your users.  If HomeDirectoryType is LOGICAL, you must provide mappings, using the HomeDirectoryMappings parameter. If, on the other hand, HomeDirectoryType is PATH, you provide an absolute path using the HomeDirectory parameter. You cannot have both HomeDirectory and HomeDirectoryMappings in your template. 
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that controls your users' access to your Amazon S3 bucket or Amazon EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or Amazon EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
     */
    Role?: Role;
    /**
     * A unique identifier that is required to identify specific groups within your directory. The users of the group that you associate have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Transfer Family. If you know the group name, you can view the SID values by running the following command using Windows PowerShell.  Get-ADGroup -Filter {samAccountName -like "YourGroupName*"} -Properties * | Select SamAccountName,ObjectSid  In that command, replace YourGroupName with the name of your Active Directory group. The regular expression used to validate this parameter is a string of characters consisting of uppercase and lowercase alphanumeric characters with no spaces. You can also include underscores or any of the following characters: =,.@:/-
     */
    ExternalId?: ExternalId;
  }
  export type ListedAccesses = ListedAccess[];
  export interface ListedAgreement {
    /**
     * The Amazon Resource Name (ARN) of the specified agreement.
     */
    Arn?: Arn;
    /**
     * A unique identifier for the agreement. This identifier is returned when you create an agreement.
     */
    AgreementId?: AgreementId;
    /**
     * The current description for the agreement. You can change it by calling the UpdateAgreement operation and providing a new description. 
     */
    Description?: Description;
    /**
     * The agreement can be either ACTIVE or INACTIVE.
     */
    Status?: AgreementStatusType;
    /**
     * The unique identifier for the agreement.
     */
    ServerId?: ServerId;
    /**
     * A unique identifier for the AS2 local profile.
     */
    LocalProfileId?: ProfileId;
    /**
     * A unique identifier for the partner profile.
     */
    PartnerProfileId?: ProfileId;
  }
  export type ListedAgreements = ListedAgreement[];
  export interface ListedCertificate {
    /**
     * The Amazon Resource Name (ARN) of the specified certificate.
     */
    Arn?: Arn;
    /**
     * An array of identifiers for the imported certificates. You use this identifier for working with profiles and partner profiles.
     */
    CertificateId?: CertificateId;
    /**
     * Specifies whether this certificate is used for signing or encryption.
     */
    Usage?: CertificateUsageType;
    /**
     * The certificate can be either ACTIVE, PENDING_ROTATION, or INACTIVE. PENDING_ROTATION means that this certificate will replace the current certificate when it expires.
     */
    Status?: CertificateStatusType;
    /**
     * An optional date that specifies when the certificate becomes active.
     */
    ActiveDate?: CertDate;
    /**
     * An optional date that specifies when the certificate becomes inactive.
     */
    InactiveDate?: CertDate;
    /**
     * The type for the certificate. If a private key has been specified for the certificate, its type is CERTIFICATE_WITH_PRIVATE_KEY. If there is no private key, the type is CERTIFICATE.
     */
    Type?: CertificateType;
    /**
     * The name or short description that's used to identify the certificate.
     */
    Description?: Description;
  }
  export type ListedCertificates = ListedCertificate[];
  export interface ListedConnector {
    /**
     * The Amazon Resource Name (ARN) of the specified connector.
     */
    Arn?: Arn;
    /**
     * The unique identifier for the connector.
     */
    ConnectorId?: ConnectorId;
    /**
     * The URL of the partner's AS2 or SFTP endpoint.
     */
    Url?: Url;
  }
  export type ListedConnectors = ListedConnector[];
  export interface ListedExecution {
    /**
     * A unique identifier for the execution of a workflow.
     */
    ExecutionId?: ExecutionId;
    /**
     * A structure that describes the Amazon S3 or EFS file location. This is the file location when the execution begins: if the file is being copied, this is the initial (as opposed to destination) file location.
     */
    InitialFileLocation?: FileLocation;
    /**
     * A container object for the session details that are associated with a workflow.
     */
    ServiceMetadata?: ServiceMetadata;
    /**
     * The status is one of the execution. Can be in progress, completed, exception encountered, or handling the exception.
     */
    Status?: ExecutionStatus;
  }
  export type ListedExecutions = ListedExecution[];
  export interface ListedHostKey {
    /**
     * The unique Amazon Resource Name (ARN) of the host key.
     */
    Arn: Arn;
    /**
     * A unique identifier for the host key.
     */
    HostKeyId?: HostKeyId;
    /**
     * The public key fingerprint, which is a short sequence of bytes used to identify the longer public key.
     */
    Fingerprint?: HostKeyFingerprint;
    /**
     * The current description for the host key. You can change it by calling the UpdateHostKey operation and providing a new description.
     */
    Description?: HostKeyDescription;
    /**
     * The encryption algorithm that is used for the host key. The Type parameter is specified by using one of the following values:    ssh-rsa     ssh-ed25519     ecdsa-sha2-nistp256     ecdsa-sha2-nistp384     ecdsa-sha2-nistp521   
     */
    Type?: HostKeyType;
    /**
     * The date on which the host key was added to the server.
     */
    DateImported?: DateImported;
  }
  export type ListedHostKeys = ListedHostKey[];
  export interface ListedProfile {
    /**
     * The Amazon Resource Name (ARN) of the specified profile.
     */
    Arn?: Arn;
    /**
     * A unique identifier for the local or partner AS2 profile.
     */
    ProfileId?: ProfileId;
    /**
     * The As2Id is the AS2-name, as defined in the RFC 4130. For inbound transfers, this is the AS2-From header for the AS2 messages sent from the partner. For outbound connectors, this is the AS2-To header for the AS2 messages sent to the partner using the StartFileTransfer API operation. This ID cannot include spaces.
     */
    As2Id?: As2Id;
    /**
     * Indicates whether to list only LOCAL type profiles or only PARTNER type profiles. If not supplied in the request, the command lists all types of profiles.
     */
    ProfileType?: ProfileType;
  }
  export type ListedProfiles = ListedProfile[];
  export interface ListedServer {
    /**
     * Specifies the unique Amazon Resource Name (ARN) for a server to be listed.
     */
    Arn: Arn;
    /**
     * Specifies the domain of the storage system that is used for file transfers.
     */
    Domain?: Domain;
    /**
     * The mode of authentication for a server. The default value is SERVICE_MANAGED, which allows you to store and access user credentials within the Transfer Family service. Use AWS_DIRECTORY_SERVICE to provide access to Active Directory groups in Directory Service for Microsoft Active Directory or Microsoft Active Directory in your on-premises environment or in Amazon Web Services using AD Connector. This option also requires you to provide a Directory ID by using the IdentityProviderDetails parameter. Use the API_GATEWAY value to integrate with an identity provider of your choosing. The API_GATEWAY setting requires you to provide an Amazon API Gateway endpoint URL to call for authentication by using the IdentityProviderDetails parameter. Use the AWS_LAMBDA value to directly use an Lambda function as your identity provider. If you choose this value, you must specify the ARN for the Lambda function in the Function parameter for the IdentityProviderDetails data type.
     */
    IdentityProviderType?: IdentityProviderType;
    /**
     * Specifies the type of VPC endpoint that your server is connected to. If your server is connected to a VPC endpoint, your server isn't accessible over the public internet.
     */
    EndpointType?: EndpointType;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that allows a server to turn on Amazon CloudWatch logging for Amazon S3 or Amazon EFSevents. When set, you can view user activity in your CloudWatch logs.
     */
    LoggingRole?: Role;
    /**
     * Specifies the unique system assigned identifier for the servers that were listed.
     */
    ServerId?: ServerId;
    /**
     * The condition of the server that was described. A value of ONLINE indicates that the server can accept jobs and transfer files. A State value of OFFLINE means that the server cannot perform file transfer operations. The states of STARTING and STOPPING indicate that the server is in an intermediate state, either not fully able to respond, or not fully offline. The values of START_FAILED or STOP_FAILED can indicate an error condition.
     */
    State?: State;
    /**
     * Specifies the number of users that are assigned to a server you specified with the ServerId.
     */
    UserCount?: UserCount;
  }
  export type ListedServers = ListedServer[];
  export interface ListedUser {
    /**
     * Provides the unique Amazon Resource Name (ARN) for the user that you want to learn about.
     */
    Arn: Arn;
    /**
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.  The HomeDirectory parameter is only used if HomeDirectoryType is set to LOGICAL. 
     */
    HomeDirectory?: HomeDirectory;
    /**
     * The type of landing directory (folder) that you want your users' home directory to be when they log in to the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or Amazon EFS path as is in their file transfer protocol clients. If you set it to LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or Amazon EFS paths visible to your users.  If HomeDirectoryType is LOGICAL, you must provide mappings, using the HomeDirectoryMappings parameter. If, on the other hand, HomeDirectoryType is PATH, you provide an absolute path using the HomeDirectory parameter. You cannot have both HomeDirectory and HomeDirectoryMappings in your template. 
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that controls your users' access to your Amazon S3 bucket or Amazon EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or Amazon EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.  The IAM role that controls your users' access to your Amazon S3 bucket for servers with Domain=S3, or your EFS file system for servers with Domain=EFS.  The policies attached to this role determine the level of access you want to provide your users when transferring files into and out of your S3 buckets or EFS file systems. 
     */
    Role?: Role;
    /**
     * Specifies the number of SSH public keys stored for the user you specified.
     */
    SshPublicKeyCount?: SshPublicKeyCount;
    /**
     * Specifies the name of the user whose ARN was specified. User names are used for authentication purposes.
     */
    UserName?: UserName;
  }
  export type ListedUsers = ListedUser[];
  export interface ListedWorkflow {
    /**
     * A unique identifier for the workflow.
     */
    WorkflowId?: WorkflowId;
    /**
     * Specifies the text description for the workflow.
     */
    Description?: WorkflowDescription;
    /**
     * Specifies the unique Amazon Resource Name (ARN) for the workflow.
     */
    Arn?: Arn;
  }
  export type ListedWorkflows = ListedWorkflow[];
  export type LogGroupName = string;
  export interface LoggingConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that allows a server to turn on Amazon CloudWatch logging for Amazon S3 or Amazon EFSevents. When set, you can view user activity in your CloudWatch logs.
     */
    LoggingRole?: Role;
    /**
     * The name of the CloudWatch logging group for the Transfer Family server to which this workflow belongs.
     */
    LogGroupName?: LogGroupName;
  }
  export type MapEntry = string;
  export type MapTarget = string;
  export type MaxResults = number;
  export type MdnResponse = "SYNC"|"NONE"|string;
  export type MdnSigningAlg = "SHA256"|"SHA384"|"SHA512"|"SHA1"|"NONE"|"DEFAULT"|string;
  export type Message = string;
  export type MessageSubject = string;
  export type NextToken = string;
  export type NullableRole = string;
  export type OnPartialUploadWorkflowDetails = WorkflowDetail[];
  export type OnUploadWorkflowDetails = WorkflowDetail[];
  export type OverwriteExisting = "TRUE"|"FALSE"|string;
  export type PassiveIp = string;
  export type Policy = string;
  export type PosixId = number;
  export interface PosixProfile {
    /**
     * The POSIX user ID used for all EFS operations by this user.
     */
    Uid: PosixId;
    /**
     * The POSIX group ID used for all EFS operations by this user.
     */
    Gid: PosixId;
    /**
     * The secondary POSIX group IDs used for all EFS operations by this user.
     */
    SecondaryGids?: SecondaryGids;
  }
  export type PostAuthenticationLoginBanner = string;
  export type PreAuthenticationLoginBanner = string;
  export type PrivateKeyType = string;
  export type ProfileId = string;
  export type ProfileType = "LOCAL"|"PARTNER"|string;
  export type Protocol = "SFTP"|"FTP"|"FTPS"|"AS2"|string;
  export interface ProtocolDetails {
    /**
     *  Indicates passive mode, for FTP and FTPS protocols. Enter a single IPv4 address, such as the public IP address of a firewall, router, or load balancer. For example:   aws transfer update-server --protocol-details PassiveIp=0.0.0.0  Replace 0.0.0.0 in the example above with the actual IP address you want to use.   If you change the PassiveIp value, you must stop and then restart your Transfer Family server for the change to take effect. For details on using passive mode (PASV) in a NAT environment, see Configuring your FTPS server behind a firewall or NAT with Transfer Family.    Special values  The AUTO and 0.0.0.0 are special values for the PassiveIp parameter. The value PassiveIp=AUTO is assigned by default to FTP and FTPS type servers. In this case, the server automatically responds with one of the endpoint IPs within the PASV response. PassiveIp=0.0.0.0 has a more unique application for its usage. For example, if you have a High Availability (HA) Network Load Balancer (NLB) environment, where you have 3 subnets, you can only specify a single IP address using the PassiveIp parameter. This reduces the effectiveness of having High Availability. In this case, you can specify PassiveIp=0.0.0.0. This tells the client to use the same IP address as the Control connection and utilize all AZs for their connections. Note, however, that not all FTP clients support the PassiveIp=0.0.0.0 response. FileZilla and WinSCP do support it. If you are using other clients, check to see if your client supports the PassiveIp=0.0.0.0 response.
     */
    PassiveIp?: PassiveIp;
    /**
     * A property used with Transfer Family servers that use the FTPS protocol. TLS Session Resumption provides a mechanism to resume or share a negotiated secret key between the control and data connection for an FTPS session. TlsSessionResumptionMode determines whether or not the server resumes recent, negotiated sessions through a unique session ID. This property is available during CreateServer and UpdateServer calls. If a TlsSessionResumptionMode value is not specified during CreateServer, it is set to ENFORCED by default.    DISABLED: the server does not process TLS session resumption client requests and creates a new TLS session for each request.     ENABLED: the server processes and accepts clients that are performing TLS session resumption. The server doesn't reject client data connections that do not perform the TLS session resumption client processing.    ENFORCED: the server processes and accepts clients that are performing TLS session resumption. The server rejects client data connections that do not perform the TLS session resumption client processing. Before you set the value to ENFORCED, test your clients.  Not all FTPS clients perform TLS session resumption. So, if you choose to enforce TLS session resumption, you prevent any connections from FTPS clients that don't perform the protocol negotiation. To determine whether or not you can use the ENFORCED value, you need to test your clients.   
     */
    TlsSessionResumptionMode?: TlsSessionResumptionMode;
    /**
     * Use the SetStatOption to ignore the error that is generated when the client attempts to use SETSTAT on a file you are uploading to an S3 bucket. Some SFTP file transfer clients can attempt to change the attributes of remote files, including timestamp and permissions, using commands, such as SETSTAT when uploading the file. However, these commands are not compatible with object storage systems, such as Amazon S3. Due to this incompatibility, file uploads from these clients can result in errors even when the file is otherwise successfully uploaded. Set the value to ENABLE_NO_OP to have the Transfer Family server ignore the SETSTAT command, and upload files without needing to make any changes to your SFTP client. While the SetStatOption ENABLE_NO_OP setting ignores the error, it does generate a log entry in Amazon CloudWatch Logs, so you can determine when the client is making a SETSTAT call.  If you want to preserve the original timestamp for your file, and modify other file attributes using SETSTAT, you can use Amazon EFS as backend storage with Transfer Family. 
     */
    SetStatOption?: SetStatOption;
    /**
     * Indicates the transport method for the AS2 messages. Currently, only HTTP is supported.
     */
    As2Transports?: As2Transports;
  }
  export type Protocols = Protocol[];
  export type Response = string;
  export type Role = string;
  export type S3Bucket = string;
  export type S3Etag = string;
  export interface S3FileLocation {
    /**
     * Specifies the S3 bucket that contains the file being used.
     */
    Bucket?: S3Bucket;
    /**
     * The name assigned to the file when it was created in Amazon S3. You use the object key to retrieve the object.
     */
    Key?: S3Key;
    /**
     * Specifies the file version.
     */
    VersionId?: S3VersionId;
    /**
     * The entity tag is a hash of the object. The ETag reflects changes only to the contents of an object, not its metadata.
     */
    Etag?: S3Etag;
  }
  export interface S3InputFileLocation {
    /**
     * Specifies the S3 bucket for the customer input file.
     */
    Bucket?: S3Bucket;
    /**
     * The name assigned to the file when it was created in Amazon S3. You use the object key to retrieve the object.
     */
    Key?: S3Key;
  }
  export type S3Key = string;
  export interface S3Tag {
    /**
     * The name assigned to the tag that you create.
     */
    Key: S3TagKey;
    /**
     * The value that corresponds to the key.
     */
    Value: S3TagValue;
  }
  export type S3TagKey = string;
  export type S3TagValue = string;
  export type S3Tags = S3Tag[];
  export type S3VersionId = string;
  export type SecondaryGids = PosixId[];
  export type SecretId = string;
  export type SecurityGroupId = string;
  export type SecurityGroupIds = SecurityGroupId[];
  export type SecurityPolicyName = string;
  export type SecurityPolicyNames = SecurityPolicyName[];
  export type SecurityPolicyOption = string;
  export type SecurityPolicyOptions = SecurityPolicyOption[];
  export interface SendWorkflowStepStateRequest {
    /**
     * A unique identifier for the workflow.
     */
    WorkflowId: WorkflowId;
    /**
     * A unique identifier for the execution of a workflow.
     */
    ExecutionId: ExecutionId;
    /**
     * Used to distinguish between multiple callbacks for multiple Lambda steps within the same execution.
     */
    Token: CallbackToken;
    /**
     * Indicates whether the specified step succeeded or failed.
     */
    Status: CustomStepStatus;
  }
  export interface SendWorkflowStepStateResponse {
  }
  export type ServerId = string;
  export interface ServiceMetadata {
    /**
     * The Server ID (ServerId), Session ID (SessionId) and user (UserName) make up the UserDetails.
     */
    UserDetails: UserDetails;
  }
  export type SessionId = string;
  export type SetStatOption = "DEFAULT"|"ENABLE_NO_OP"|string;
  export type SftpAuthenticationMethods = "PASSWORD"|"PUBLIC_KEY"|"PUBLIC_KEY_OR_PASSWORD"|"PUBLIC_KEY_AND_PASSWORD"|string;
  export interface SftpConnectorConfig {
    /**
     * The identifier for the secret (in Amazon Web Services Secrets Manager) that contains the SFTP user's private key, password, or both. The identifier can be either the Amazon Resource Name (ARN) or the name of the secret.
     */
    UserSecretId?: SecretId;
    /**
     * The public portion of the host key, or keys, that are used to identify the external server to which you are connecting. You can use the ssh-keyscan command against the SFTP server to retrieve the necessary key. The three standard SSH public key format elements are &lt;key type&gt;, &lt;body base64&gt;, and an optional &lt;comment&gt;, with spaces between each element. Specify only the &lt;key type&gt; and &lt;body base64&gt;: do not enter the &lt;comment&gt; portion of the key. For the trusted host key, Transfer Family accepts RSA and ECDSA keys.   For RSA keys, the &lt;key type&gt; string is ssh-rsa.   For ECDSA keys, the &lt;key type&gt; string is either ecdsa-sha2-nistp256, ecdsa-sha2-nistp384, or ecdsa-sha2-nistp521, depending on the size of the key you generated.  
     */
    TrustedHostKeys?: SftpConnectorTrustedHostKeyList;
  }
  export type SftpConnectorTrustedHostKey = string;
  export type SftpConnectorTrustedHostKeyList = SftpConnectorTrustedHostKey[];
  export type SigningAlg = "SHA256"|"SHA384"|"SHA512"|"SHA1"|"NONE"|string;
  export type SourceFileLocation = string;
  export type SourceIp = string;
  export interface SshPublicKey {
    /**
     * Specifies the date that the public key was added to the Transfer Family user.
     */
    DateImported: DateImported;
    /**
     * Specifies the content of the SSH public key as specified by the PublicKeyId. Transfer Family accepts RSA, ECDSA, and ED25519 keys.
     */
    SshPublicKeyBody: SshPublicKeyBody;
    /**
     * Specifies the SshPublicKeyId parameter contains the identifier of the public key.
     */
    SshPublicKeyId: SshPublicKeyId;
  }
  export type SshPublicKeyBody = string;
  export type SshPublicKeyCount = number;
  export type SshPublicKeyId = string;
  export type SshPublicKeys = SshPublicKey[];
  export interface StartFileTransferRequest {
    /**
     * The unique identifier for the connector.
     */
    ConnectorId: ConnectorId;
    /**
     * One or more source paths for the Amazon S3 storage. Each string represents a source file path for one outbound file transfer. For example,  DOC-EXAMPLE-BUCKET/myfile.txt .  Replace  DOC-EXAMPLE-BUCKET  with one of your actual buckets. 
     */
    SendFilePaths?: FilePaths;
    /**
     * One or more source paths for the partner's SFTP server. Each string represents a source file path for one inbound file transfer.
     */
    RetrieveFilePaths?: FilePaths;
    /**
     * For an inbound transfer, the LocaDirectoryPath specifies the destination for one or more files that are transferred from the partner's SFTP server.
     */
    LocalDirectoryPath?: FilePath;
    /**
     * For an outbound transfer, the RemoteDirectoryPath specifies the destination for one or more files that are transferred to the partner's SFTP server. If you don't specify a RemoteDirectoryPath, the destination for transferred files is the SFTP user's home directory.
     */
    RemoteDirectoryPath?: FilePath;
  }
  export interface StartFileTransferResponse {
    /**
     * Returns the unique identifier for the file transfer.
     */
    TransferId: TransferId;
  }
  export interface StartServerRequest {
    /**
     * A system-assigned unique identifier for a server that you start.
     */
    ServerId: ServerId;
  }
  export type State = "OFFLINE"|"ONLINE"|"STARTING"|"STOPPING"|"START_FAILED"|"STOP_FAILED"|string;
  export type Status = string;
  export type StatusCode = number;
  export type StepResultOutputsJson = string;
  export interface StopServerRequest {
    /**
     * A system-assigned unique identifier for a server that you stopped.
     */
    ServerId: ServerId;
  }
  export type StructuredLogDestinations = Arn[];
  export type SubnetId = string;
  export type SubnetIds = SubnetId[];
  export interface Tag {
    /**
     * The name assigned to the tag that you create.
     */
    Key: TagKey;
    /**
     * Contains one or more values that you assigned to the key name you create.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export interface TagResourceRequest {
    /**
     * An Amazon Resource Name (ARN) for a specific Amazon Web Services resource, such as a server, user, or role.
     */
    Arn: Arn;
    /**
     * Key-value pairs assigned to ARNs that you can use to group and search for resources by type. You can attach this metadata to resources (servers, users, workflows, and so on) for any purpose.
     */
    Tags: Tags;
  }
  export interface TagStepDetails {
    /**
     * The name of the step, used as an identifier.
     */
    Name?: WorkflowStepName;
    /**
     * Array that contains from 1 to 10 key/value pairs.
     */
    Tags?: S3Tags;
    /**
     * Specifies which file to use as input to the workflow step: either the output from the previous step, or the originally uploaded file for the workflow.   To use the previous file as the input, enter ${previous.file}. In this case, this workflow step uses the output file from the previous workflow step as input. This is the default value.   To use the originally uploaded file location as input for this step, enter ${original.file}.  
     */
    SourceFileLocation?: SourceFileLocation;
  }
  export type TagValue = string;
  export type Tags = Tag[];
  export interface TestConnectionRequest {
    /**
     * The unique identifier for the connector.
     */
    ConnectorId: ConnectorId;
  }
  export interface TestConnectionResponse {
    /**
     * Returns the identifier of the connector object that you are testing.
     */
    ConnectorId?: ConnectorId;
    /**
     * Returns OK for successful test, or ERROR if the test fails.
     */
    Status?: Status;
    /**
     * Returns Connection succeeded if the test is successful. Or, returns a descriptive error message if the test fails. The following list provides troubleshooting details, depending on the error message that you receive.   Verify that your secret name aligns with the one in Transfer Role permissions.   Verify the server URL in the connector configuration , and verify that the login credentials work successfully outside of the connector.   Verify that the secret exists and is formatted correctly.   Verify that the trusted host key in the connector configuration matches the ssh-keyscan output.  
     */
    StatusMessage?: Message;
  }
  export interface TestIdentityProviderRequest {
    /**
     * A system-assigned identifier for a specific server. That server's user authentication method is tested with a user name and password.
     */
    ServerId: ServerId;
    /**
     * The type of file transfer protocol to be tested. The available protocols are:   Secure Shell (SSH) File Transfer Protocol (SFTP)   File Transfer Protocol Secure (FTPS)   File Transfer Protocol (FTP)   Applicability Statement 2 (AS2)  
     */
    ServerProtocol?: Protocol;
    /**
     * The source IP address of the account to be tested.
     */
    SourceIp?: SourceIp;
    /**
     * The name of the account to be tested.
     */
    UserName: UserName;
    /**
     * The password of the account to be tested.
     */
    UserPassword?: UserPassword;
  }
  export interface TestIdentityProviderResponse {
    /**
     * The response that is returned from your API Gateway or your Lambda function.
     */
    Response?: Response;
    /**
     * The HTTP status code that is the response from your API Gateway or your Lambda function.
     */
    StatusCode: StatusCode;
    /**
     * A message that indicates whether the test was successful or not.  If an empty string is returned, the most likely cause is that the authentication failed due to an incorrect username or password. 
     */
    Message?: Message;
    /**
     * The endpoint of the service used to authenticate a user.
     */
    Url: Url;
  }
  export type TlsSessionResumptionMode = "DISABLED"|"ENABLED"|"ENFORCED"|string;
  export type TransferId = string;
  export interface UntagResourceRequest {
    /**
     * The value of the resource that will have the tag removed. An Amazon Resource Name (ARN) is an identifier for a specific Amazon Web Services resource, such as a server, user, or role.
     */
    Arn: Arn;
    /**
     * TagKeys are key-value pairs assigned to ARNs that can be used to group and search for resources by type. This metadata can be attached to resources for any purpose.
     */
    TagKeys: TagKeys;
  }
  export interface UpdateAccessRequest {
    /**
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.  The HomeDirectory parameter is only used if HomeDirectoryType is set to LOGICAL. 
     */
    HomeDirectory?: HomeDirectory;
    /**
     * The type of landing directory (folder) that you want your users' home directory to be when they log in to the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or Amazon EFS path as is in their file transfer protocol clients. If you set it to LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or Amazon EFS paths visible to your users.  If HomeDirectoryType is LOGICAL, you must provide mappings, using the HomeDirectoryMappings parameter. If, on the other hand, HomeDirectoryType is PATH, you provide an absolute path using the HomeDirectory parameter. You cannot have both HomeDirectory and HomeDirectoryMappings in your template. 
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * Logical directory mappings that specify what Amazon S3 or Amazon EFS paths and keys should be visible to your user and how you want to make them visible. You must specify the Entry and Target pair, where Entry shows how the path is made visible and Target is the actual Amazon S3 or Amazon EFS path. If you only specify a target, it is displayed as is. You also must ensure that your Identity and Access Management (IAM) role provides access to paths in Target. This value can be set only when HomeDirectoryType is set to LOGICAL. The following is an Entry and Target pair example.  [ { "Entry": "/directory1", "Target": "/bucket_name/home/mydirectory" } ]  In most cases, you can use this value instead of the session policy to lock down your user to the designated home directory ("chroot"). To do this, you can set Entry to / and set Target to the HomeDirectory parameter value. The following is an Entry and Target pair example for chroot.  [ { "Entry": "/", "Target": "/bucket_name/home/mydirectory" } ] 
     */
    HomeDirectoryMappings?: HomeDirectoryMappings;
    /**
     * A session policy for your user so that you can use the same Identity and Access Management (IAM) role across multiple users. This policy scopes down a user's access to portions of their Amazon S3 bucket. Variables that you can use inside this policy include ${Transfer:UserName}, ${Transfer:HomeDirectory}, and ${Transfer:HomeBucket}.  This policy applies only when the domain of ServerId is Amazon S3. Amazon EFS does not use session policies. For session policies, Transfer Family stores the policy as a JSON blob, instead of the Amazon Resource Name (ARN) of the policy. You save the policy as a JSON blob and pass it in the Policy argument. For an example of a session policy, see Example session policy. For more information, see AssumeRole in the Amazon Web ServicesSecurity Token Service API Reference. 
     */
    Policy?: Policy;
    PosixProfile?: PosixProfile;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that controls your users' access to your Amazon S3 bucket or Amazon EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or Amazon EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
     */
    Role?: Role;
    /**
     * A system-assigned unique identifier for a server instance. This is the specific server that you added your user to.
     */
    ServerId: ServerId;
    /**
     * A unique identifier that is required to identify specific groups within your directory. The users of the group that you associate have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Transfer Family. If you know the group name, you can view the SID values by running the following command using Windows PowerShell.  Get-ADGroup -Filter {samAccountName -like "YourGroupName*"} -Properties * | Select SamAccountName,ObjectSid  In that command, replace YourGroupName with the name of your Active Directory group. The regular expression used to validate this parameter is a string of characters consisting of uppercase and lowercase alphanumeric characters with no spaces. You can also include underscores or any of the following characters: =,.@:/-
     */
    ExternalId: ExternalId;
  }
  export interface UpdateAccessResponse {
    /**
     * The identifier of the server that the user is attached to.
     */
    ServerId: ServerId;
    /**
     * The external identifier of the group whose users have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Amazon Web ServicesTransfer Family.
     */
    ExternalId: ExternalId;
  }
  export interface UpdateAgreementRequest {
    /**
     * A unique identifier for the agreement. This identifier is returned when you create an agreement.
     */
    AgreementId: AgreementId;
    /**
     * A system-assigned unique identifier for a server instance. This is the specific server that the agreement uses.
     */
    ServerId: ServerId;
    /**
     * To replace the existing description, provide a short description for the agreement. 
     */
    Description?: Description;
    /**
     * You can update the status for the agreement, either activating an inactive agreement or the reverse.
     */
    Status?: AgreementStatusType;
    /**
     * A unique identifier for the AS2 local profile. To change the local profile identifier, provide a new value here.
     */
    LocalProfileId?: ProfileId;
    /**
     * A unique identifier for the partner profile. To change the partner profile identifier, provide a new value here.
     */
    PartnerProfileId?: ProfileId;
    /**
     * To change the landing directory (folder) for files that are transferred, provide the bucket folder that you want to use; for example, /DOC-EXAMPLE-BUCKET/home/mydirectory .
     */
    BaseDirectory?: HomeDirectory;
    /**
     * Connectors are used to send files using either the AS2 or SFTP protocol. For the access role, provide the Amazon Resource Name (ARN) of the Identity and Access Management role to use.  For AS2 connectors  With AS2, you can send files by calling StartFileTransfer and specifying the file paths in the request parameter, SendFilePaths. We use the file’s parent directory (for example, for --send-file-paths /bucket/dir/file.txt, parent directory is /bucket/dir/) to temporarily store a processed AS2 message file, store the MDN when we receive them from the partner, and write a final JSON file containing relevant metadata of the transmission. So, the AccessRole needs to provide read and write access to the parent directory of the file location used in the StartFileTransfer request. Additionally, you need to provide read and write access to the parent directory of the files that you intend to send with StartFileTransfer. If you are using Basic authentication for your AS2 connector, the access role requires the secretsmanager:GetSecretValue permission for the secret. If the secret is encrypted using a customer-managed key instead of the Amazon Web Services managed key in Secrets Manager, then the role also needs the kms:Decrypt permission for that key.  For SFTP connectors  Make sure that the access role provides read and write access to the parent directory of the file location that's used in the StartFileTransfer request. Additionally, make sure that the role provides secretsmanager:GetSecretValue permission to Secrets Manager.
     */
    AccessRole?: Role;
  }
  export interface UpdateAgreementResponse {
    /**
     * A unique identifier for the agreement. This identifier is returned when you create an agreement.
     */
    AgreementId: AgreementId;
  }
  export interface UpdateCertificateRequest {
    /**
     * The identifier of the certificate object that you are updating.
     */
    CertificateId: CertificateId;
    /**
     * An optional date that specifies when the certificate becomes active.
     */
    ActiveDate?: CertDate;
    /**
     * An optional date that specifies when the certificate becomes inactive.
     */
    InactiveDate?: CertDate;
    /**
     * A short description to help identify the certificate.
     */
    Description?: Description;
  }
  export interface UpdateCertificateResponse {
    /**
     * Returns the identifier of the certificate object that you are updating.
     */
    CertificateId: CertificateId;
  }
  export interface UpdateConnectorRequest {
    /**
     * The unique identifier for the connector.
     */
    ConnectorId: ConnectorId;
    /**
     * The URL of the partner's AS2 or SFTP endpoint.
     */
    Url?: Url;
    /**
     * A structure that contains the parameters for an AS2 connector object.
     */
    As2Config?: As2ConnectorConfig;
    /**
     * Connectors are used to send files using either the AS2 or SFTP protocol. For the access role, provide the Amazon Resource Name (ARN) of the Identity and Access Management role to use.  For AS2 connectors  With AS2, you can send files by calling StartFileTransfer and specifying the file paths in the request parameter, SendFilePaths. We use the file’s parent directory (for example, for --send-file-paths /bucket/dir/file.txt, parent directory is /bucket/dir/) to temporarily store a processed AS2 message file, store the MDN when we receive them from the partner, and write a final JSON file containing relevant metadata of the transmission. So, the AccessRole needs to provide read and write access to the parent directory of the file location used in the StartFileTransfer request. Additionally, you need to provide read and write access to the parent directory of the files that you intend to send with StartFileTransfer. If you are using Basic authentication for your AS2 connector, the access role requires the secretsmanager:GetSecretValue permission for the secret. If the secret is encrypted using a customer-managed key instead of the Amazon Web Services managed key in Secrets Manager, then the role also needs the kms:Decrypt permission for that key.  For SFTP connectors  Make sure that the access role provides read and write access to the parent directory of the file location that's used in the StartFileTransfer request. Additionally, make sure that the role provides secretsmanager:GetSecretValue permission to Secrets Manager.
     */
    AccessRole?: Role;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that allows a connector to turn on CloudWatch logging for Amazon S3 events. When set, you can view connector activity in your CloudWatch logs.
     */
    LoggingRole?: Role;
    /**
     * A structure that contains the parameters for an SFTP connector object.
     */
    SftpConfig?: SftpConnectorConfig;
  }
  export interface UpdateConnectorResponse {
    /**
     * Returns the identifier of the connector object that you are updating.
     */
    ConnectorId: ConnectorId;
  }
  export interface UpdateHostKeyRequest {
    /**
     * The identifier of the server that contains the host key that you are updating.
     */
    ServerId: ServerId;
    /**
     * The identifier of the host key that you are updating.
     */
    HostKeyId: HostKeyId;
    /**
     * An updated description for the host key.
     */
    Description: HostKeyDescription;
  }
  export interface UpdateHostKeyResponse {
    /**
     * Returns the server identifier for the server that contains the updated host key.
     */
    ServerId: ServerId;
    /**
     * Returns the host key identifier for the updated host key.
     */
    HostKeyId: HostKeyId;
  }
  export interface UpdateProfileRequest {
    /**
     * The identifier of the profile object that you are updating.
     */
    ProfileId: ProfileId;
    /**
     * An array of identifiers for the imported certificates. You use this identifier for working with profiles and partner profiles.
     */
    CertificateIds?: CertificateIds;
  }
  export interface UpdateProfileResponse {
    /**
     * Returns the identifier for the profile that's being updated.
     */
    ProfileId: ProfileId;
  }
  export interface UpdateServerRequest {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Web ServicesCertificate Manager (ACM) certificate. Required when Protocols is set to FTPS. To request a new public certificate, see Request a public certificate in the  Amazon Web ServicesCertificate Manager User Guide. To import an existing certificate into ACM, see Importing certificates into ACM in the  Amazon Web ServicesCertificate Manager User Guide. To request a private certificate to use FTPS through private IP addresses, see Request a private certificate in the  Amazon Web ServicesCertificate Manager User Guide. Certificates with the following cryptographic algorithms and key sizes are supported:   2048-bit RSA (RSA_2048)   4096-bit RSA (RSA_4096)   Elliptic Prime Curve 256 bit (EC_prime256v1)   Elliptic Prime Curve 384 bit (EC_secp384r1)   Elliptic Prime Curve 521 bit (EC_secp521r1)    The certificate must be a valid SSL/TLS X.509 version 3 certificate with FQDN or IP address specified and information about the issuer. 
     */
    Certificate?: Certificate;
    /**
     * The protocol settings that are configured for your server.    To indicate passive mode (for FTP and FTPS protocols), use the PassiveIp parameter. Enter a single dotted-quad IPv4 address, such as the external IP address of a firewall, router, or load balancer.    To ignore the error that is generated when the client attempts to use the SETSTAT command on a file that you are uploading to an Amazon S3 bucket, use the SetStatOption parameter. To have the Transfer Family server ignore the SETSTAT command and upload files without needing to make any changes to your SFTP client, set the value to ENABLE_NO_OP. If you set the SetStatOption parameter to ENABLE_NO_OP, Transfer Family generates a log entry to Amazon CloudWatch Logs, so that you can determine when the client is making a SETSTAT call.   To determine whether your Transfer Family server resumes recent, negotiated sessions through a unique session ID, use the TlsSessionResumptionMode parameter.    As2Transports indicates the transport method for the AS2 messages. Currently, only HTTP is supported.  
     */
    ProtocolDetails?: ProtocolDetails;
    /**
     * The virtual private cloud (VPC) endpoint settings that are configured for your server. When you host your endpoint within your VPC, you can make your endpoint accessible only to resources within your VPC, or you can attach Elastic IP addresses and make your endpoint accessible to clients over the internet. Your VPC's default security groups are automatically assigned to your endpoint.
     */
    EndpointDetails?: EndpointDetails;
    /**
     * The type of endpoint that you want your server to use. You can choose to make your server's endpoint publicly accessible (PUBLIC) or host it inside your VPC. With an endpoint that is hosted in a VPC, you can restrict access to your server and resources only within your VPC or choose to make it internet facing by attaching Elastic IP addresses directly to it.   After May 19, 2021, you won't be able to create a server using EndpointType=VPC_ENDPOINT in your Amazon Web Servicesaccount if your account hasn't already done so before May 19, 2021. If you have already created servers with EndpointType=VPC_ENDPOINT in your Amazon Web Servicesaccount on or before May 19, 2021, you will not be affected. After this date, use EndpointType=VPC. For more information, see https://docs.aws.amazon.com/transfer/latest/userguide/create-server-in-vpc.html#deprecate-vpc-endpoint. It is recommended that you use VPC as the EndpointType. With this endpoint type, you have the option to directly associate up to three Elastic IPv4 addresses (BYO IP included) with your server's endpoint and use VPC security groups to restrict traffic by the client's public IP address. This is not possible with EndpointType set to VPC_ENDPOINT. 
     */
    EndpointType?: EndpointType;
    /**
     * The RSA, ECDSA, or ED25519 private key to use for your SFTP-enabled server. You can add multiple host keys, in case you want to rotate keys, or have a set of active keys that use different algorithms. Use the following command to generate an RSA 2048 bit key with no passphrase:  ssh-keygen -t rsa -b 2048 -N "" -m PEM -f my-new-server-key. Use a minimum value of 2048 for the -b option. You can create a stronger key by using 3072 or 4096. Use the following command to generate an ECDSA 256 bit key with no passphrase:  ssh-keygen -t ecdsa -b 256 -N "" -m PEM -f my-new-server-key. Valid values for the -b option for ECDSA are 256, 384, and 521. Use the following command to generate an ED25519 key with no passphrase:  ssh-keygen -t ed25519 -N "" -f my-new-server-key. For all of these commands, you can replace my-new-server-key with a string of your choice.  If you aren't planning to migrate existing users from an existing SFTP-enabled server to a new server, don't update the host key. Accidentally changing a server's host key can be disruptive.  For more information, see Manage host keys for your SFTP-enabled server in the Transfer Family User Guide.
     */
    HostKey?: HostKey;
    /**
     * An array containing all of the information required to call a customer's authentication API method.
     */
    IdentityProviderDetails?: IdentityProviderDetails;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that allows a server to turn on Amazon CloudWatch logging for Amazon S3 or Amazon EFSevents. When set, you can view user activity in your CloudWatch logs.
     */
    LoggingRole?: NullableRole;
    /**
     * Specifies a string to display when users connect to a server. This string is displayed after the user authenticates.  The SFTP protocol does not support post-authentication display banners. 
     */
    PostAuthenticationLoginBanner?: PostAuthenticationLoginBanner;
    /**
     * Specifies a string to display when users connect to a server. This string is displayed before the user authenticates. For example, the following banner displays details about using the system:  This system is for the use of authorized users only. Individuals using this computer system without authority, or in excess of their authority, are subject to having all of their activities on this system monitored and recorded by system personnel. 
     */
    PreAuthenticationLoginBanner?: PreAuthenticationLoginBanner;
    /**
     * Specifies the file transfer protocol or protocols over which your file transfer protocol client can connect to your server's endpoint. The available protocols are:    SFTP (Secure Shell (SSH) File Transfer Protocol): File transfer over SSH    FTPS (File Transfer Protocol Secure): File transfer with TLS encryption    FTP (File Transfer Protocol): Unencrypted file transfer    AS2 (Applicability Statement 2): used for transporting structured business-to-business data      If you select FTPS, you must choose a certificate stored in Certificate Manager (ACM) which is used to identify your server when clients connect to it over FTPS.   If Protocol includes either FTP or FTPS, then the EndpointType must be VPC and the IdentityProviderType must be either AWS_DIRECTORY_SERVICE, AWS_LAMBDA, or API_GATEWAY.   If Protocol includes FTP, then AddressAllocationIds cannot be associated.   If Protocol is set only to SFTP, the EndpointType can be set to PUBLIC and the IdentityProviderType can be set any of the supported identity types: SERVICE_MANAGED, AWS_DIRECTORY_SERVICE, AWS_LAMBDA, or API_GATEWAY.   If Protocol includes AS2, then the EndpointType must be VPC, and domain must be Amazon S3.   
     */
    Protocols?: Protocols;
    /**
     * Specifies the name of the security policy that is attached to the server.
     */
    SecurityPolicyName?: SecurityPolicyName;
    /**
     * A system-assigned unique identifier for a server instance that the Transfer Family user is assigned to.
     */
    ServerId: ServerId;
    /**
     * Specifies the workflow ID for the workflow to assign and the execution role that's used for executing the workflow. In addition to a workflow to execute when a file is uploaded completely, WorkflowDetails can also contain a workflow ID (and execution role) for a workflow to execute on partial upload. A partial upload occurs when the server session disconnects while the file is still being uploaded. To remove an associated workflow from a server, you can provide an empty OnUpload object, as in the following example.  aws transfer update-server --server-id s-01234567890abcdef --workflow-details '{"OnUpload":[]}' 
     */
    WorkflowDetails?: WorkflowDetails;
    /**
     * Specifies the log groups to which your server logs are sent. To specify a log group, you must provide the ARN for an existing log group. In this case, the format of the log group is as follows:  arn:aws:logs:region-name:amazon-account-id:log-group:log-group-name:*  For example, arn:aws:logs:us-east-1:111122223333:log-group:mytestgroup:*  If you have previously specified a log group for a server, you can clear it, and in effect turn off structured logging, by providing an empty value for this parameter in an update-server call. For example:  update-server --server-id s-1234567890abcdef0 --structured-log-destinations 
     */
    StructuredLogDestinations?: StructuredLogDestinations;
  }
  export interface UpdateServerResponse {
    /**
     * A system-assigned unique identifier for a server that the Transfer Family user is assigned to.
     */
    ServerId: ServerId;
  }
  export interface UpdateUserRequest {
    /**
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.  The HomeDirectory parameter is only used if HomeDirectoryType is set to LOGICAL. 
     */
    HomeDirectory?: HomeDirectory;
    /**
     * The type of landing directory (folder) that you want your users' home directory to be when they log in to the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or Amazon EFS path as is in their file transfer protocol clients. If you set it to LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or Amazon EFS paths visible to your users.  If HomeDirectoryType is LOGICAL, you must provide mappings, using the HomeDirectoryMappings parameter. If, on the other hand, HomeDirectoryType is PATH, you provide an absolute path using the HomeDirectory parameter. You cannot have both HomeDirectory and HomeDirectoryMappings in your template. 
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * Logical directory mappings that specify what Amazon S3 or Amazon EFS paths and keys should be visible to your user and how you want to make them visible. You must specify the Entry and Target pair, where Entry shows how the path is made visible and Target is the actual Amazon S3 or Amazon EFS path. If you only specify a target, it is displayed as is. You also must ensure that your Identity and Access Management (IAM) role provides access to paths in Target. This value can be set only when HomeDirectoryType is set to LOGICAL. The following is an Entry and Target pair example.  [ { "Entry": "/directory1", "Target": "/bucket_name/home/mydirectory" } ]  In most cases, you can use this value instead of the session policy to lock down your user to the designated home directory ("chroot"). To do this, you can set Entry to '/' and set Target to the HomeDirectory parameter value. The following is an Entry and Target pair example for chroot.  [ { "Entry": "/", "Target": "/bucket_name/home/mydirectory" } ] 
     */
    HomeDirectoryMappings?: HomeDirectoryMappings;
    /**
     * A session policy for your user so that you can use the same Identity and Access Management (IAM) role across multiple users. This policy scopes down a user's access to portions of their Amazon S3 bucket. Variables that you can use inside this policy include ${Transfer:UserName}, ${Transfer:HomeDirectory}, and ${Transfer:HomeBucket}.  This policy applies only when the domain of ServerId is Amazon S3. Amazon EFS does not use session policies. For session policies, Transfer Family stores the policy as a JSON blob, instead of the Amazon Resource Name (ARN) of the policy. You save the policy as a JSON blob and pass it in the Policy argument. For an example of a session policy, see Creating a session policy. For more information, see AssumeRole in the Amazon Web Services Security Token Service API Reference. 
     */
    Policy?: Policy;
    /**
     * Specifies the full POSIX identity, including user ID (Uid), group ID (Gid), and any secondary groups IDs (SecondaryGids), that controls your users' access to your Amazon Elastic File Systems (Amazon EFS). The POSIX permissions that are set on files and directories in your file system determines the level of access your users get when transferring files into and out of your Amazon EFS file systems.
     */
    PosixProfile?: PosixProfile;
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role that controls your users' access to your Amazon S3 bucket or Amazon EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or Amazon EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
     */
    Role?: Role;
    /**
     * A system-assigned unique identifier for a Transfer Family server instance that the user is assigned to.
     */
    ServerId: ServerId;
    /**
     * A unique string that identifies a user and is associated with a server as specified by the ServerId. This user name must be a minimum of 3 and a maximum of 100 characters long. The following are valid characters: a-z, A-Z, 0-9, underscore '_', hyphen '-', period '.', and at sign '@'. The user name can't start with a hyphen, period, or at sign.
     */
    UserName: UserName;
  }
  export interface UpdateUserResponse {
    /**
     * A system-assigned unique identifier for a Transfer Family server instance that the account is assigned to.
     */
    ServerId: ServerId;
    /**
     * The unique identifier for a user that is assigned to a server instance that was specified in the request.
     */
    UserName: UserName;
  }
  export type Url = string;
  export type UserCount = number;
  export interface UserDetails {
    /**
     * A unique string that identifies a Transfer Family user associated with a server.
     */
    UserName: UserName;
    /**
     * The system-assigned unique identifier for a Transfer server instance. 
     */
    ServerId: ServerId;
    /**
     * The system-assigned unique identifier for a session that corresponds to the workflow.
     */
    SessionId?: SessionId;
  }
  export type UserName = string;
  export type UserPassword = string;
  export type VpcEndpointId = string;
  export type VpcId = string;
  export type WorkflowDescription = string;
  export interface WorkflowDetail {
    /**
     * A unique identifier for the workflow.
     */
    WorkflowId: WorkflowId;
    /**
     * Includes the necessary permissions for S3, EFS, and Lambda operations that Transfer can assume, so that all workflow steps can operate on the required resources
     */
    ExecutionRole: Role;
  }
  export interface WorkflowDetails {
    /**
     * A trigger that starts a workflow: the workflow begins to execute after a file is uploaded. To remove an associated workflow from a server, you can provide an empty OnUpload object, as in the following example.  aws transfer update-server --server-id s-01234567890abcdef --workflow-details '{"OnUpload":[]}' 
     */
    OnUpload?: OnUploadWorkflowDetails;
    /**
     * A trigger that starts a workflow if a file is only partially uploaded. You can attach a workflow to a server that executes whenever there is a partial upload. A partial upload occurs when a file is open when the session disconnects.
     */
    OnPartialUpload?: OnPartialUploadWorkflowDetails;
  }
  export type WorkflowId = string;
  export interface WorkflowStep {
    /**
     *  Currently, the following step types are supported.      COPY  - Copy the file to another location.     CUSTOM  - Perform a custom step with an Lambda function target.     DECRYPT  - Decrypt a file that was encrypted before it was uploaded.     DELETE  - Delete the file.     TAG  - Add a tag to the file.  
     */
    Type?: WorkflowStepType;
    /**
     * Details for a step that performs a file copy.  Consists of the following values:    A description   An Amazon S3 location for the destination of the file copy.   A flag that indicates whether to overwrite an existing file of the same name. The default is FALSE.  
     */
    CopyStepDetails?: CopyStepDetails;
    /**
     * Details for a step that invokes an Lambda function. Consists of the Lambda function's name, target, and timeout (in seconds). 
     */
    CustomStepDetails?: CustomStepDetails;
    /**
     * Details for a step that deletes the file.
     */
    DeleteStepDetails?: DeleteStepDetails;
    /**
     * Details for a step that creates one or more tags. You specify one or more tags. Each tag contains a key-value pair.
     */
    TagStepDetails?: TagStepDetails;
    /**
     * Details for a step that decrypts an encrypted file. Consists of the following values:   A descriptive name   An Amazon S3 or Amazon Elastic File System (Amazon EFS) location for the source file to decrypt.   An S3 or Amazon EFS location for the destination of the file decryption.   A flag that indicates whether to overwrite an existing file of the same name. The default is FALSE.   The type of encryption that's used. Currently, only PGP encryption is supported.  
     */
    DecryptStepDetails?: DecryptStepDetails;
  }
  export type WorkflowStepName = string;
  export type WorkflowStepType = "COPY"|"CUSTOM"|"TAG"|"DELETE"|"DECRYPT"|string;
  export type WorkflowSteps = WorkflowStep[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-11-05"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Transfer client.
   */
  export import Types = Transfer;
}
export = Transfer;
