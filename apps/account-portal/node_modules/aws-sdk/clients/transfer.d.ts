import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
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
   * Used by administrators to choose which groups in the directory should have access to upload and download files over the enabled protocols using Amazon Web Services Transfer Family. For example, a Microsoft Active Directory might contain 50,000 users, but only a small fraction might need the ability to transfer files to the server. An administrator can use CreateAccess to limit the access to the correct set of users who need this ability.
   */
  createAccess(params: Transfer.Types.CreateAccessRequest, callback?: (err: AWSError, data: Transfer.Types.CreateAccessResponse) => void): Request<Transfer.Types.CreateAccessResponse, AWSError>;
  /**
   * Used by administrators to choose which groups in the directory should have access to upload and download files over the enabled protocols using Amazon Web Services Transfer Family. For example, a Microsoft Active Directory might contain 50,000 users, but only a small fraction might need the ability to transfer files to the server. An administrator can use CreateAccess to limit the access to the correct set of users who need this ability.
   */
  createAccess(callback?: (err: AWSError, data: Transfer.Types.CreateAccessResponse) => void): Request<Transfer.Types.CreateAccessResponse, AWSError>;
  /**
   * Instantiates an auto-scaling virtual server based on the selected file transfer protocol in Amazon Web Services. When you make updates to your file transfer protocol-enabled server or when you work with users, use the service-generated ServerId property that is assigned to the newly created server.
   */
  createServer(params: Transfer.Types.CreateServerRequest, callback?: (err: AWSError, data: Transfer.Types.CreateServerResponse) => void): Request<Transfer.Types.CreateServerResponse, AWSError>;
  /**
   * Instantiates an auto-scaling virtual server based on the selected file transfer protocol in Amazon Web Services. When you make updates to your file transfer protocol-enabled server or when you work with users, use the service-generated ServerId property that is assigned to the newly created server.
   */
  createServer(callback?: (err: AWSError, data: Transfer.Types.CreateServerResponse) => void): Request<Transfer.Types.CreateServerResponse, AWSError>;
  /**
   * Creates a user and associates them with an existing file transfer protocol-enabled server. You can only create and associate users with servers that have the IdentityProviderType set to SERVICE_MANAGED. Using parameters for CreateUser, you can specify the user name, set the home directory, store the user's public key, and assign the user's Amazon Web Services Identity and Access Management (IAM) role. You can also optionally add a session policy, and assign metadata with tags that can be used to group and search for users.
   */
  createUser(params: Transfer.Types.CreateUserRequest, callback?: (err: AWSError, data: Transfer.Types.CreateUserResponse) => void): Request<Transfer.Types.CreateUserResponse, AWSError>;
  /**
   * Creates a user and associates them with an existing file transfer protocol-enabled server. You can only create and associate users with servers that have the IdentityProviderType set to SERVICE_MANAGED. Using parameters for CreateUser, you can specify the user name, set the home directory, store the user's public key, and assign the user's Amazon Web Services Identity and Access Management (IAM) role. You can also optionally add a session policy, and assign metadata with tags that can be used to group and search for users.
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
   * Describes the access that is assigned to the specific file transfer protocol-enabled server, as identified by its ServerId property and its ExternalID. The response from this call returns the properties of the access that is associated with the ServerId value that was specified.
   */
  describeAccess(params: Transfer.Types.DescribeAccessRequest, callback?: (err: AWSError, data: Transfer.Types.DescribeAccessResponse) => void): Request<Transfer.Types.DescribeAccessResponse, AWSError>;
  /**
   * Describes the access that is assigned to the specific file transfer protocol-enabled server, as identified by its ServerId property and its ExternalID. The response from this call returns the properties of the access that is associated with the ServerId value that was specified.
   */
  describeAccess(callback?: (err: AWSError, data: Transfer.Types.DescribeAccessResponse) => void): Request<Transfer.Types.DescribeAccessResponse, AWSError>;
  /**
   * You can use DescribeExecution to check the details of the execution of the specified workflow.
   */
  describeExecution(params: Transfer.Types.DescribeExecutionRequest, callback?: (err: AWSError, data: Transfer.Types.DescribeExecutionResponse) => void): Request<Transfer.Types.DescribeExecutionResponse, AWSError>;
  /**
   * You can use DescribeExecution to check the details of the execution of the specified workflow.
   */
  describeExecution(callback?: (err: AWSError, data: Transfer.Types.DescribeExecutionResponse) => void): Request<Transfer.Types.DescribeExecutionResponse, AWSError>;
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
   * Adds a Secure Shell (SSH) public key to a user account identified by a UserName value assigned to the specific file transfer protocol-enabled server, identified by ServerId. The response returns the UserName value, the ServerId value, and the name of the SshPublicKeyId.
   */
  importSshPublicKey(params: Transfer.Types.ImportSshPublicKeyRequest, callback?: (err: AWSError, data: Transfer.Types.ImportSshPublicKeyResponse) => void): Request<Transfer.Types.ImportSshPublicKeyResponse, AWSError>;
  /**
   * Adds a Secure Shell (SSH) public key to a user account identified by a UserName value assigned to the specific file transfer protocol-enabled server, identified by ServerId. The response returns the UserName value, the ServerId value, and the name of the SshPublicKeyId.
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
   * Lists all executions for the specified workflow.
   */
  listExecutions(params: Transfer.Types.ListExecutionsRequest, callback?: (err: AWSError, data: Transfer.Types.ListExecutionsResponse) => void): Request<Transfer.Types.ListExecutionsResponse, AWSError>;
  /**
   * Lists all executions for the specified workflow.
   */
  listExecutions(callback?: (err: AWSError, data: Transfer.Types.ListExecutionsResponse) => void): Request<Transfer.Types.ListExecutionsResponse, AWSError>;
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
   * Lists all of your workflows.
   */
  listWorkflows(params: Transfer.Types.ListWorkflowsRequest, callback?: (err: AWSError, data: Transfer.Types.ListWorkflowsResponse) => void): Request<Transfer.Types.ListWorkflowsResponse, AWSError>;
  /**
   * Lists all of your workflows.
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
   * Changes the state of a file transfer protocol-enabled server from OFFLINE to ONLINE. It has no impact on a server that is already ONLINE. An ONLINE server can accept and process file transfer jobs. The state of STARTING indicates that the server is in an intermediate state, either not fully able to respond, or not fully online. The values of START_FAILED can indicate an error condition. No response is returned from this call.
   */
  startServer(params: Transfer.Types.StartServerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the state of a file transfer protocol-enabled server from OFFLINE to ONLINE. It has no impact on a server that is already ONLINE. An ONLINE server can accept and process file transfer jobs. The state of STARTING indicates that the server is in an intermediate state, either not fully able to respond, or not fully online. The values of START_FAILED can indicate an error condition. No response is returned from this call.
   */
  startServer(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the state of a file transfer protocol-enabled server from ONLINE to OFFLINE. An OFFLINE server cannot accept and process file transfer jobs. Information tied to your server, such as server and user properties, are not affected by stopping your server.  Stopping the server will not reduce or impact your file transfer protocol endpoint billing; you must delete the server to stop being billed.  The state of STOPPING indicates that the server is in an intermediate state, either not fully able to respond, or not fully offline. The values of STOP_FAILED can indicate an error condition. No response is returned from this call.
   */
  stopServer(params: Transfer.Types.StopServerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the state of a file transfer protocol-enabled server from ONLINE to OFFLINE. An OFFLINE server cannot accept and process file transfer jobs. Information tied to your server, such as server and user properties, are not affected by stopping your server.  Stopping the server will not reduce or impact your file transfer protocol endpoint billing; you must delete the server to stop being billed.  The state of STOPPING indicates that the server is in an intermediate state, either not fully able to respond, or not fully offline. The values of STOP_FAILED can indicate an error condition. No response is returned from this call.
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
   * If the IdentityProviderType of a file transfer protocol-enabled server is AWS_DIRECTORY_SERVICE or API_Gateway, tests whether your identity provider is set up successfully. We highly recommend that you call this operation to test your authentication method as soon as you create your server. By doing so, you can troubleshoot issues with the identity provider integration to ensure that your users can successfully use the service.  The ServerId and UserName parameters are required. The ServerProtocol, SourceIp, and UserPassword are all optional.    You cannot use TestIdentityProvider if the IdentityProviderType of your server is SERVICE_MANAGED.      If you provide any incorrect values for any parameters, the Response field is empty.     If you provide a server ID for a server that uses service-managed users, you get an error:    An error occurred (InvalidRequestException) when calling the TestIdentityProvider operation: s-server-ID not configured for external auth      If you enter a Server ID for the --server-id parameter that does not identify an actual Transfer server, you receive the following error:   An error occurred (ResourceNotFoundException) when calling the TestIdentityProvider operation: Unknown server   
   */
  testIdentityProvider(params: Transfer.Types.TestIdentityProviderRequest, callback?: (err: AWSError, data: Transfer.Types.TestIdentityProviderResponse) => void): Request<Transfer.Types.TestIdentityProviderResponse, AWSError>;
  /**
   * If the IdentityProviderType of a file transfer protocol-enabled server is AWS_DIRECTORY_SERVICE or API_Gateway, tests whether your identity provider is set up successfully. We highly recommend that you call this operation to test your authentication method as soon as you create your server. By doing so, you can troubleshoot issues with the identity provider integration to ensure that your users can successfully use the service.  The ServerId and UserName parameters are required. The ServerProtocol, SourceIp, and UserPassword are all optional.    You cannot use TestIdentityProvider if the IdentityProviderType of your server is SERVICE_MANAGED.      If you provide any incorrect values for any parameters, the Response field is empty.     If you provide a server ID for a server that uses service-managed users, you get an error:    An error occurred (InvalidRequestException) when calling the TestIdentityProvider operation: s-server-ID not configured for external auth      If you enter a Server ID for the --server-id parameter that does not identify an actual Transfer server, you receive the following error:   An error occurred (ResourceNotFoundException) when calling the TestIdentityProvider operation: Unknown server   
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
}
declare namespace Transfer {
  export type AddressAllocationId = string;
  export type AddressAllocationIds = AddressAllocationId[];
  export type Arn = string;
  export type CallbackToken = string;
  export type Certificate = string;
  export interface CopyStepDetails {
    /**
     * The name of the step, used as an identifier.
     */
    Name?: WorkflowStepName;
    DestinationFileLocation?: InputFileLocation;
    /**
     * A flag that indicates whether or not to overwrite an existing file of the same name. The default is FALSE.
     */
    OverwriteExisting?: OverwriteExisting;
  }
  export interface CreateAccessRequest {
    /**
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.
     */
    HomeDirectory?: HomeDirectory;
    /**
     * The type of landing directory (folder) you want your users' home directory to be when they log into the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or EFS paths as is in their file transfer protocol clients. If you set it LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or EFS paths visible to your users.
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * Logical directory mappings that specify what Amazon S3 or Amazon EFS paths and keys should be visible to your user and how you want to make them visible. You must specify the Entry and Target pair, where Entry shows how the path is made visible and Target is the actual Amazon S3 or Amazon EFS path. If you only specify a target, it is displayed as is. You also must ensure that your Amazon Web Services Identity and Access Management (IAM) role provides access to paths in Target. This value can only be set when HomeDirectoryType is set to LOGICAL. The following is an Entry and Target pair example.  [ { "Entry": "/directory1", "Target": "/bucket_name/home/mydirectory" } ]  In most cases, you can use this value instead of the session policy to lock down your user to the designated home directory ("chroot"). To do this, you can set Entry to / and set Target to the HomeDirectory parameter value. The following is an Entry and Target pair example for chroot.  [ { "Entry:": "/", "Target": "/bucket_name/home/mydirectory" } ]   If the target of a logical directory entry does not exist in Amazon S3 or EFS, the entry is ignored. As a workaround, you can use the Amazon S3 API or EFS API to create 0 byte objects as place holders for your directory. If using the CLI, use the s3api or efsapi call instead of s3 or efs so you can use the put-object operation. For example, you use the following: aws s3api put-object --bucket bucketname --key path/to/folder/. Make sure that the end of the key name ends in a / for it to be considered a folder. 
     */
    HomeDirectoryMappings?: HomeDirectoryMappings;
    /**
     * A session policy for your user so that you can use the same IAM role across multiple users. This policy scopes down user access to portions of their Amazon S3 bucket. Variables that you can use inside this policy include ${Transfer:UserName}, ${Transfer:HomeDirectory}, and ${Transfer:HomeBucket}.  This only applies when the domain of ServerId is S3. EFS does not use session policies. For session policies, Amazon Web Services Transfer Family stores the policy as a JSON blob, instead of the Amazon Resource Name (ARN) of the policy. You save the policy as a JSON blob and pass it in the Policy argument. For an example of a session policy, see Example session policy. For more information, see AssumeRole in the Amazon Web Services Security Token Service API Reference. 
     */
    Policy?: Policy;
    PosixProfile?: PosixProfile;
    /**
     * Specifies the Amazon Resource Name (ARN) of the IAM role that controls your users' access to your Amazon S3 bucket or EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
     */
    Role: Role;
    /**
     * A system-assigned unique identifier for a server instance. This is the specific server that you added your user to.
     */
    ServerId: ServerId;
    /**
     * A unique identifier that is required to identify specific groups within your directory. The users of the group that you associate have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Amazon Web Services Transfer Family. If you know the group name, you can view the SID values by running the following command using Windows PowerShell.  Get-ADGroup -Filter {samAccountName -like "YourGroupName*"} -Properties * | Select SamAccountName,ObjectSid  In that command, replace YourGroupName with the name of your Active Directory group. The regex used to validate this parameter is a string of characters consisting of uppercase and lowercase alphanumeric characters with no spaces. You can also include underscores or any of the following characters: =,.@:/-
     */
    ExternalId: ExternalId;
  }
  export interface CreateAccessResponse {
    /**
     * The ID of the server that the user is attached to.
     */
    ServerId: ServerId;
    /**
     * The external ID of the group whose users have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Amazon Web Services Transfer Family.
     */
    ExternalId: ExternalId;
  }
  export interface CreateServerRequest {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Web Services Certificate Manager (ACM) certificate. Required when Protocols is set to FTPS. To request a new public certificate, see Request a public certificate in the  Amazon Web Services Certificate Manager User Guide. To import an existing certificate into ACM, see Importing certificates into ACM in the  Amazon Web Services Certificate Manager User Guide. To request a private certificate to use FTPS through private IP addresses, see Request a private certificate in the  Amazon Web Services Certificate Manager User Guide. Certificates with the following cryptographic algorithms and key sizes are supported:   2048-bit RSA (RSA_2048)   4096-bit RSA (RSA_4096)   Elliptic Prime Curve 256 bit (EC_prime256v1)   Elliptic Prime Curve 384 bit (EC_secp384r1)   Elliptic Prime Curve 521 bit (EC_secp521r1)    The certificate must be a valid SSL/TLS X.509 version 3 certificate with FQDN or IP address specified and information about the issuer. 
     */
    Certificate?: Certificate;
    /**
     * The domain of the storage system that is used for file transfers. There are two domains available: Amazon Simple Storage Service (Amazon S3) and Amazon Elastic File System (Amazon EFS). The default value is S3.  After the server is created, the domain cannot be changed. 
     */
    Domain?: Domain;
    /**
     * The virtual private cloud (VPC) endpoint settings that are configured for your server. When you host your endpoint within your VPC, you can make it accessible only to resources within your VPC, or you can attach Elastic IP addresses and make it accessible to clients over the internet. Your VPC's default security groups are automatically assigned to your endpoint.
     */
    EndpointDetails?: EndpointDetails;
    /**
     * The type of endpoint that you want your server to use. You can choose to make your server's endpoint publicly accessible (PUBLIC) or host it inside your VPC. With an endpoint that is hosted in a VPC, you can restrict access to your server and resources only within your VPC or choose to make it internet facing by attaching Elastic IP addresses directly to it.   After May 19, 2021, you won't be able to create a server using EndpointType=VPC_ENDPOINT in your Amazon Web Services account if your account hasn't already done so before May 19, 2021. If you have already created servers with EndpointType=VPC_ENDPOINT in your Amazon Web Services account on or before May 19, 2021, you will not be affected. After this date, use EndpointType=VPC. For more information, see https://docs.aws.amazon.com/transfer/latest/userguide/create-server-in-vpc.html#deprecate-vpc-endpoint. It is recommended that you use VPC as the EndpointType. With this endpoint type, you have the option to directly associate up to three Elastic IPv4 addresses (BYO IP included) with your server's endpoint and use VPC security groups to restrict traffic by the client's public IP address. This is not possible with EndpointType set to VPC_ENDPOINT. 
     */
    EndpointType?: EndpointType;
    /**
     * The RSA private key as generated by the ssh-keygen -N "" -m PEM -f my-new-server-key command.  If you aren't planning to migrate existing users from an existing SFTP-enabled server to a new server, don't update the host key. Accidentally changing a server's host key can be disruptive.  For more information, see Change the host key for your SFTP-enabled server in the Amazon Web Services Transfer Family User Guide.
     */
    HostKey?: HostKey;
    /**
     * Required when IdentityProviderType is set to AWS_DIRECTORY_SERVICE or API_GATEWAY. Accepts an array containing all of the information required to use a directory in AWS_DIRECTORY_SERVICE or invoke a customer-supplied authentication API, including the API Gateway URL. Not required when IdentityProviderType is set to SERVICE_MANAGED.
     */
    IdentityProviderDetails?: IdentityProviderDetails;
    /**
     * Specifies the mode of authentication for a server. The default value is SERVICE_MANAGED, which allows you to store and access user credentials within the Amazon Web Services Transfer Family service. Use AWS_DIRECTORY_SERVICE to provide access to Active Directory groups in Amazon Web Services Managed Active Directory or Microsoft Active Directory in your on-premises environment or in Amazon Web Services using AD Connectors. This option also requires you to provide a Directory ID using the IdentityProviderDetails parameter. Use the API_GATEWAY value to integrate with an identity provider of your choosing. The API_GATEWAY setting requires you to provide an API Gateway endpoint URL to call for authentication using the IdentityProviderDetails parameter.
     */
    IdentityProviderType?: IdentityProviderType;
    /**
     * Specifies the Amazon Resource Name (ARN) of the Amazon Web Services Identity and Access Management (IAM) role that allows a server to turn on Amazon CloudWatch logging for Amazon S3 or Amazon EFS events. When set, user activity can be viewed in your CloudWatch logs.
     */
    LoggingRole?: Role;
    /**
     * Specifies the file transfer protocol or protocols over which your file transfer protocol client can connect to your server's endpoint. The available protocols are:    SFTP (Secure Shell (SSH) File Transfer Protocol): File transfer over SSH    FTPS (File Transfer Protocol Secure): File transfer with TLS encryption    FTP (File Transfer Protocol): Unencrypted file transfer    If you select FTPS, you must choose a certificate stored in Amazon Web Services Certificate Manager (ACM) which is used to identify your server when clients connect to it over FTPS. If Protocol includes either FTP or FTPS, then the EndpointType must be VPC and the IdentityProviderType must be AWS_DIRECTORY_SERVICE or API_GATEWAY. If Protocol includes FTP, then AddressAllocationIds cannot be associated. If Protocol is set only to SFTP, the EndpointType can be set to PUBLIC and the IdentityProviderType can be set to SERVICE_MANAGED. 
     */
    Protocols?: Protocols;
    /**
     * Specifies the name of the security policy that is attached to the server.
     */
    SecurityPolicyName?: SecurityPolicyName;
    /**
     * Key-value pairs that can be used to group and search for servers.
     */
    Tags?: Tags;
    /**
     * Specifies the workflow ID for the workflow to assign and the execution role used for executing the workflow.
     */
    WorkflowDetails?: WorkflowDetails;
  }
  export interface CreateServerResponse {
    /**
     * The service-assigned ID of the server that is created.
     */
    ServerId: ServerId;
  }
  export interface CreateUserRequest {
    /**
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.
     */
    HomeDirectory?: HomeDirectory;
    /**
     * The type of landing directory (folder) you want your users' home directory to be when they log into the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or EFS paths as is in their file transfer protocol clients. If you set it LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or EFS paths visible to your users.
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * Logical directory mappings that specify what Amazon S3 or Amazon EFS paths and keys should be visible to your user and how you want to make them visible. You must specify the Entry and Target pair, where Entry shows how the path is made visible and Target is the actual Amazon S3 or Amazon EFS path. If you only specify a target, it is displayed as is. You also must ensure that your Amazon Web Services Identity and Access Management (IAM) role provides access to paths in Target. This value can only be set when HomeDirectoryType is set to LOGICAL. The following is an Entry and Target pair example.  [ { "Entry": "/directory1", "Target": "/bucket_name/home/mydirectory" } ]  In most cases, you can use this value instead of the session policy to lock your user down to the designated home directory ("chroot"). To do this, you can set Entry to / and set Target to the HomeDirectory parameter value. The following is an Entry and Target pair example for chroot.  [ { "Entry:": "/", "Target": "/bucket_name/home/mydirectory" } ]   If the target of a logical directory entry does not exist in Amazon S3 or EFS, the entry is ignored. As a workaround, you can use the Amazon S3 API or EFS API to create 0 byte objects as place holders for your directory. If using the CLI, use the s3api or efsapi call instead of s3 or efs so you can use the put-object operation. For example, you use the following: aws s3api put-object --bucket bucketname --key path/to/folder/. Make sure that the end of the key name ends in a / for it to be considered a folder. 
     */
    HomeDirectoryMappings?: HomeDirectoryMappings;
    /**
     * A session policy for your user so that you can use the same IAM role across multiple users. This policy scopes down user access to portions of their Amazon S3 bucket. Variables that you can use inside this policy include ${Transfer:UserName}, ${Transfer:HomeDirectory}, and ${Transfer:HomeBucket}.  This only applies when the domain of ServerId is S3. EFS does not use session policies. For session policies, Amazon Web Services Transfer Family stores the policy as a JSON blob, instead of the Amazon Resource Name (ARN) of the policy. You save the policy as a JSON blob and pass it in the Policy argument. For an example of a session policy, see Example session policy. For more information, see AssumeRole in the Amazon Web Services Security Token Service API Reference. 
     */
    Policy?: Policy;
    /**
     * Specifies the full POSIX identity, including user ID (Uid), group ID (Gid), and any secondary groups IDs (SecondaryGids), that controls your users' access to your Amazon EFS file systems. The POSIX permissions that are set on files and directories in Amazon EFS determine the level of access your users get when transferring files into and out of your Amazon EFS file systems.
     */
    PosixProfile?: PosixProfile;
    /**
     * Specifies the Amazon Resource Name (ARN) of the IAM role that controls your users' access to your Amazon S3 bucket or EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
     */
    Role: Role;
    /**
     * A system-assigned unique identifier for a server instance. This is the specific server that you added your user to.
     */
    ServerId: ServerId;
    /**
     * The public portion of the Secure Shell (SSH) key used to authenticate the user to the server.
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
     * The ID of the server that the user is attached to.
     */
    ServerId: ServerId;
    /**
     * A unique string that identifies a user account associated with a server.
     */
    UserName: UserName;
  }
  export interface CreateWorkflowRequest {
    /**
     * A textual description for the workflow.
     */
    Description?: WorkflowDescription;
    /**
     * Specifies the details for the steps that are in the specified workflow.  The TYPE specifies which of the following actions is being taken for this step.     Copy: copy the file to another location    Custom: custom step with a lambda target    Delete: delete the file    Tag: add a tag to the file     Currently, copying and tagging are supported only on S3.    For file location, you specify either the S3 bucket and key, or the EFS filesystem ID and path. 
     */
    Steps: WorkflowSteps;
    /**
     * Specifies the steps (actions) to take if errors are encountered during execution of the workflow.  For custom steps, the lambda function needs to send FAILURE to the call back API to kick off the exception steps. Additionally, if the lambda does not send SUCCESS before it times out, the exception steps are executed. 
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
     * The ARN for the lambda function that is being called.
     */
    Target?: CustomStepTarget;
    /**
     * Timeout, in seconds, for the step.
     */
    TimeoutSeconds?: CustomStepTimeoutSeconds;
  }
  export type CustomStepStatus = "SUCCESS"|"FAILURE"|string;
  export type CustomStepTarget = string;
  export type CustomStepTimeoutSeconds = number;
  export type DateImported = Date;
  export interface DeleteAccessRequest {
    /**
     * A system-assigned unique identifier for a server that has this user assigned.
     */
    ServerId: ServerId;
    /**
     * A unique identifier that is required to identify specific groups within your directory. The users of the group that you associate have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Amazon Web Services Transfer Family. If you know the group name, you can view the SID values by running the following command using Windows PowerShell.  Get-ADGroup -Filter {samAccountName -like "YourGroupName*"} -Properties * | Select SamAccountName,ObjectSid  In that command, replace YourGroupName with the name of your Active Directory group. The regex used to validate this parameter is a string of characters consisting of uppercase and lowercase alphanumeric characters with no spaces. You can also include underscores or any of the following characters: =,.@:/-
     */
    ExternalId: ExternalId;
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
     * A unique identifier that is required to identify specific groups within your directory. The users of the group that you associate have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Amazon Web Services Transfer Family. If you know the group name, you can view the SID values by running the following command using Windows PowerShell.  Get-ADGroup -Filter {samAccountName -like "YourGroupName*"} -Properties * | Select SamAccountName,ObjectSid  In that command, replace YourGroupName with the name of your Active Directory group. The regex used to validate this parameter is a string of characters consisting of uppercase and lowercase alphanumeric characters with no spaces. You can also include underscores or any of the following characters: =,.@:/-
     */
    ExternalId: ExternalId;
  }
  export interface DescribeAccessResponse {
    /**
     * A system-assigned unique identifier for a server that has this access assigned.
     */
    ServerId: ServerId;
    /**
     * The external ID of the server that the access is attached to.
     */
    Access: DescribedAccess;
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
     * The name of the user assigned to one or more servers. User names are part of the sign-in credentials to use the Amazon Web Services Transfer Family service and perform file transfer tasks.
     */
    UserName: UserName;
  }
  export interface DescribeUserResponse {
    /**
     * A system-assigned unique identifier for a server that has this user assigned.
     */
    ServerId: ServerId;
    /**
     * An array containing the properties of the user account for the ServerID value that you specified.
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
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.
     */
    HomeDirectory?: HomeDirectory;
    /**
     * Logical directory mappings that specify what Amazon S3 or Amazon EFS paths and keys should be visible to your user and how you want to make them visible. You must specify the Entry and Target pair, where Entry shows how the path is made visible and Target is the actual Amazon S3 or Amazon EFS path. If you only specify a target, it is displayed as is. You also must ensure that your Amazon Web Services Identity and Access Management (IAM) role provides access to paths in Target. This value can only be set when HomeDirectoryType is set to LOGICAL. In most cases, you can use this value instead of the session policy to lock down the associated access to the designated home directory ("chroot"). To do this, you can set Entry to '/' and set Target to the HomeDirectory parameter value.
     */
    HomeDirectoryMappings?: HomeDirectoryMappings;
    /**
     * The type of landing directory (folder) you want your users' home directory to be when they log into the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or EFS paths as is in their file transfer protocol clients. If you set it LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or EFS paths visible to your users.
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * A session policy for your user so that you can use the same IAM role across multiple users. This policy scopes down user access to portions of their Amazon S3 bucket. Variables that you can use inside this policy include ${Transfer:UserName}, ${Transfer:HomeDirectory}, and ${Transfer:HomeBucket}.
     */
    Policy?: Policy;
    PosixProfile?: PosixProfile;
    /**
     * Specifies the Amazon Resource Name (ARN) of the IAM role that controls your users' access to your Amazon S3 bucket or EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
     */
    Role?: Role;
    /**
     * A unique identifier that is required to identify specific groups within your directory. The users of the group that you associate have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Amazon Web Services Transfer Family. If you know the group name, you can view the SID values by running the following command using Windows PowerShell.  Get-ADGroup -Filter {samAccountName -like "YourGroupName*"} -Properties * | Select SamAccountName,ObjectSid  In that command, replace YourGroupName with the name of your Active Directory group. The regex used to validate this parameter is a string of characters consisting of uppercase and lowercase alphanumeric characters with no spaces. You can also include underscores or any of the following characters: =,.@:/-
     */
    ExternalId?: ExternalId;
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
     * A container object for the session details associated with a workflow.
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
     *  The protocol settings that are configured for your server.   Use the PassiveIp parameter to indicate passive mode. Enter a single dotted-quad IPv4 address, such as the external IP address of a firewall, router, or load balancer. 
     */
    ProtocolDetails?: ProtocolDetails;
    /**
     * Specifies the domain of the storage system that is used for file transfers.
     */
    Domain?: Domain;
    /**
     * The virtual private cloud (VPC) endpoint settings that are configured for your server. When you host your endpoint within your VPC, you can make it accessible only to resources within your VPC, or you can attach Elastic IP addresses and make it accessible to clients over the internet. Your VPC's default security groups are automatically assigned to your endpoint.
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
     * Specifies the mode of authentication for a server. The default value is SERVICE_MANAGED, which allows you to store and access user credentials within the Amazon Web Services Transfer Family service. Use AWS_DIRECTORY_SERVICE to provide access to Active Directory groups in Amazon Web Services Managed Active Directory or Microsoft Active Directory in your on-premises environment or in Amazon Web Services using AD Connectors. This option also requires you to provide a Directory ID using the IdentityProviderDetails parameter. Use the API_GATEWAY value to integrate with an identity provider of your choosing. The API_GATEWAY setting requires you to provide an API Gateway endpoint URL to call for authentication using the IdentityProviderDetails parameter.
     */
    IdentityProviderType?: IdentityProviderType;
    /**
     * Specifies the Amazon Resource Name (ARN) of the Amazon Web Services Identity and Access Management (IAM) role that allows a server to turn on Amazon CloudWatch logging for Amazon S3 or Amazon EFS events. When set, user activity can be viewed in your CloudWatch logs.
     */
    LoggingRole?: Role;
    /**
     * Specifies the file transfer protocol or protocols over which your file transfer protocol client can connect to your server's endpoint. The available protocols are:    SFTP (Secure Shell (SSH) File Transfer Protocol): File transfer over SSH    FTPS (File Transfer Protocol Secure): File transfer with TLS encryption    FTP (File Transfer Protocol): Unencrypted file transfer  
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
     * Specifies the condition of a server for the server that was described. A value of ONLINE indicates that the server can accept jobs and transfer files. A State value of OFFLINE means that the server cannot perform file transfer operations. The states of STARTING and STOPPING indicate that the server is in an intermediate state, either not fully able to respond, or not fully offline. The values of START_FAILED or STOP_FAILED can indicate an error condition.
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
     * Specifies the workflow ID for the workflow to assign and the execution role used for executing the workflow.
     */
    WorkflowDetails?: WorkflowDetails;
  }
  export interface DescribedUser {
    /**
     * Specifies the unique Amazon Resource Name (ARN) for the user that was requested to be described.
     */
    Arn: Arn;
    /**
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.
     */
    HomeDirectory?: HomeDirectory;
    /**
     * Logical directory mappings that specify what Amazon S3 or Amazon EFS paths and keys should be visible to your user and how you want to make them visible. You must specify the Entry and Target pair, where Entry shows how the path is made visible and Target is the actual Amazon S3 or Amazon EFS path. If you only specify a target, it is displayed as is. You also must ensure that your Amazon Web Services Identity and Access Management (IAM) role provides access to paths in Target. This value can only be set when HomeDirectoryType is set to LOGICAL. In most cases, you can use this value instead of the session policy to lock your user down to the designated home directory ("chroot"). To do this, you can set Entry to '/' and set Target to the HomeDirectory parameter value.
     */
    HomeDirectoryMappings?: HomeDirectoryMappings;
    /**
     * The type of landing directory (folder) you want your users' home directory to be when they log into the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or EFS paths as is in their file transfer protocol clients. If you set it LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or EFS paths visible to your users.
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * A session policy for your user so that you can use the same IAM role across multiple users. This policy scopes down user access to portions of their Amazon S3 bucket. Variables that you can use inside this policy include ${Transfer:UserName}, ${Transfer:HomeDirectory}, and ${Transfer:HomeBucket}.
     */
    Policy?: Policy;
    /**
     * Specifies the full POSIX identity, including user ID (Uid), group ID (Gid), and any secondary groups IDs (SecondaryGids), that controls your users' access to your Amazon Elastic File System (Amazon EFS) file systems. The POSIX permissions that are set on files and directories in your file system determine the level of access your users get when transferring files into and out of your Amazon EFS file systems.
     */
    PosixProfile?: PosixProfile;
    /**
     * Specifies the Amazon Resource Name (ARN) of the IAM role that controls your users' access to your Amazon S3 bucket or EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
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
  export type DirectoryId = string;
  export type Domain = "S3"|"EFS"|string;
  export interface EfsFileLocation {
    /**
     * The ID of the file system, assigned by Amazon EFS.
     */
    FileSystemId?: EfsFileSystemId;
    /**
     * The pathname for the folder being used by a workflow.
     */
    Path?: EfsPath;
  }
  export type EfsFileSystemId = string;
  export type EfsPath = string;
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
     * The ID of the VPC endpoint.  This property can only be set when EndpointType is set to VPC_ENDPOINT. For more information, see https://docs.aws.amazon.com/transfer/latest/userguide/create-server-in-vpc.html#deprecate-vpc-endpoint. 
     */
    VpcEndpointId?: VpcEndpointId;
    /**
     * The VPC ID of the VPC in which a server's endpoint will be hosted.  This property can only be set when EndpointType is set to VPC. 
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
     * Specifies the error type: currently, the only valid value is PERMISSION_DENIED, which occurs if your policy does not contain the correct permissions to complete one or more of the steps in the workflow.
     */
    Type: ExecutionErrorType;
    /**
     * Specifies the descriptive message that corresponds to the ErrorType.
     */
    Message: ExecutionErrorMessage;
  }
  export type ExecutionErrorMessage = string;
  export type ExecutionErrorType = "PERMISSION_DENIED"|string;
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
     * One of the available step types.    Copy: copy the file to another location    Custom: custom step with a lambda target    Delete: delete the file    Tag: add a tag to the file  
     */
    StepType?: WorkflowStepType;
    /**
     * The values for the key/value pair applied as a tag to the file. Only applicable if the step type is TAG.
     */
    Outputs?: StepResultOutputsJson;
    /**
     * Specifies the details for an error, if it occurred during execution of the specified workfow step.
     */
    Error?: ExecutionError;
  }
  export type ExecutionStepResults = ExecutionStepResult[];
  export type ExternalId = string;
  export interface FileLocation {
    /**
     * Specifies the S3 details for the file being used, such as bucket, Etag, and so forth.
     */
    S3FileLocation?: S3FileLocation;
    /**
     * Specifies the Amazon EFS ID and the path for the file being used.
     */
    EfsFileLocation?: EfsFileLocation;
  }
  export type Fips = boolean;
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
  export type HostKeyFingerprint = string;
  export interface IdentityProviderDetails {
    /**
     * Provides the location of the service endpoint used to authenticate users.
     */
    Url?: Url;
    /**
     * Provides the type of InvocationRole used to authenticate the user account.
     */
    InvocationRole?: Role;
    /**
     * The identifier of the Amazon Web ServicesDirectory Service directory that you want to stop sharing.
     */
    DirectoryId?: DirectoryId;
  }
  export type IdentityProviderType = "SERVICE_MANAGED"|"API_GATEWAY"|"AWS_DIRECTORY_SERVICE"|string;
  export interface ImportSshPublicKeyRequest {
    /**
     * A system-assigned unique identifier for a server.
     */
    ServerId: ServerId;
    /**
     * The public key portion of an SSH key pair.
     */
    SshPublicKeyBody: SshPublicKeyBody;
    /**
     * The name of the user account that is assigned to one or more servers.
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
     * Specifies the details for the S3 file being copied.
     */
    S3FileLocation?: S3InputFileLocation;
    /**
     * Reserved for future use.
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
  export interface ListExecutionsRequest {
    /**
     * Specifies the aximum number of executions to return.
     */
    MaxResults?: MaxResults;
    /**
     *  ListExecutions returns the NextToken parameter in the output. You can then pass the NextToken parameter in a subsequent command to continue listing additional executions.  This is useful for pagination, for instance. If you have 100 executions for a workflow, you might only want to list first 10. If so, callthe API by specifing the max-results:   aws transfer list-executions --max-results 10   This returns details for the first 10 executions, as well as the pointer (NextToken) to the eleventh execution. You can now call the API again, suppling the NextToken value you received:   aws transfer list-executions --max-results 10 --next-token $somePointerReturnedFromPreviousListResult   This call returns the next 10 executions, the 11th through the 20th. You can then repeat the call until the details for all 100 executions have been returned. 
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
     * Returns the details for each execution.    NextToken: returned from a call to several APIs, you can use pass it to a subsequent command to continue listing additional executions.    StartTime: timestamp indicating when the execution began.    Executions: details of the execution, including the execution ID, initial file location, and Service metadata.    Status: one of the following values: IN_PROGRESS, COMPLETED, EXCEPTION, HANDLING_EXEPTION.   
     */
    Executions: ListedExecutions;
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
     * When you can get additional results from the ListUsers call, a NextToken parameter is returned in the output. You can then pass in a subsequent command to the NextToken parameter to continue listing additional users.
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
     * Returns the user accounts and their properties for the ServerId value that you specify.
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
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.
     */
    HomeDirectory?: HomeDirectory;
    /**
     * The type of landing directory (folder) you want your users' home directory to be when they log into the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or EFS paths as is in their file transfer protocol clients. If you set it LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or EFS paths visible to your users.
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * Specifies the Amazon Resource Name (ARN) of the IAM role that controls your users' access to your Amazon S3 bucket or EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
     */
    Role?: Role;
    /**
     * A unique identifier that is required to identify specific groups within your directory. The users of the group that you associate have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Amazon Web Services Transfer Family. If you know the group name, you can view the SID values by running the following command using Windows PowerShell.  Get-ADGroup -Filter {samAccountName -like "YourGroupName*"} -Properties * | Select SamAccountName,ObjectSid  In that command, replace YourGroupName with the name of your Active Directory group. The regex used to validate this parameter is a string of characters consisting of uppercase and lowercase alphanumeric characters with no spaces. You can also include underscores or any of the following characters: =,.@:/-
     */
    ExternalId?: ExternalId;
  }
  export type ListedAccesses = ListedAccess[];
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
     * A container object for the session details associated with a workflow.
     */
    ServiceMetadata?: ServiceMetadata;
    /**
     * The status is one of the execution. Can be in progress, completed, exception encountered, or handling the exception.
     */
    Status?: ExecutionStatus;
  }
  export type ListedExecutions = ListedExecution[];
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
     * Specifies the mode of authentication for a server. The default value is SERVICE_MANAGED, which allows you to store and access user credentials within the Amazon Web Services Transfer Family service. Use AWS_DIRECTORY_SERVICE to provide access to Active Directory groups in Amazon Web Services Managed Active Directory or Microsoft Active Directory in your on-premises environment or in Amazon Web Services using AD Connectors. This option also requires you to provide a Directory ID using the IdentityProviderDetails parameter. Use the API_GATEWAY value to integrate with an identity provider of your choosing. The API_GATEWAY setting requires you to provide an API Gateway endpoint URL to call for authentication using the IdentityProviderDetails parameter.
     */
    IdentityProviderType?: IdentityProviderType;
    /**
     * Specifies the type of VPC endpoint that your server is connected to. If your server is connected to a VPC endpoint, your server isn't accessible over the public internet.
     */
    EndpointType?: EndpointType;
    /**
     * Specifies the Amazon Resource Name (ARN) of the Amazon Web Services Identity and Access Management (IAM) role that allows a server to turn on Amazon CloudWatch logging for Amazon S3 or Amazon EFS events. When set, user activity can be viewed in your CloudWatch logs.
     */
    LoggingRole?: Role;
    /**
     * Specifies the unique system assigned identifier for the servers that were listed.
     */
    ServerId?: ServerId;
    /**
     * Specifies the condition of a server for the server that was described. A value of ONLINE indicates that the server can accept jobs and transfer files. A State value of OFFLINE means that the server cannot perform file transfer operations. The states of STARTING and STOPPING indicate that the server is in an intermediate state, either not fully able to respond, or not fully offline. The values of START_FAILED or STOP_FAILED can indicate an error condition.
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
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.
     */
    HomeDirectory?: HomeDirectory;
    /**
     * The type of landing directory (folder) you want your users' home directory to be when they log into the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or EFS paths as is in their file transfer protocol clients. If you set it LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or EFS paths visible to your users.
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * Specifies the Amazon Resource Name (ARN) of the IAM role that controls your users' access to your Amazon S3 bucket or EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.  The IAM role that controls your users' access to your Amazon S3 bucket for servers with Domain=S3, or your EFS file system for servers with Domain=EFS.  The policies attached to this role determine the level of access you want to provide your users when transferring files into and out of your S3 buckets or EFS file systems. 
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
     * Specifies the Amazon Resource Name (ARN) of the Amazon Web Services Identity and Access Management (IAM) role that allows a server to turn on Amazon CloudWatch logging for Amazon S3 or Amazon EFS events. When set, user activity can be viewed in your CloudWatch logs.
     */
    LoggingRole?: Role;
    /**
     * The name of the CloudWatch logging group for the Amazon Web Services Transfer server to which this workflow belongs.
     */
    LogGroupName?: LogGroupName;
  }
  export type MapEntry = string;
  export type MapTarget = string;
  export type MaxResults = number;
  export type Message = string;
  export type NextToken = string;
  export type NullableRole = string;
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
  export type Protocol = "SFTP"|"FTP"|"FTPS"|string;
  export interface ProtocolDetails {
    /**
     *  Indicates passive mode, for FTP and FTPS protocols. Enter a single dotted-quad IPv4 address, such as the external IP address of a firewall, router, or load balancer. For example:    aws transfer update-server --protocol-details PassiveIp=0.0.0.0   Replace  0.0.0.0  in the example above with the actual IP address you want to use.   If you change the PassiveIp value, you must stop and then restart your Transfer server for the change to take effect. For details on using Passive IP (PASV) in a NAT environment, see Configuring your FTPS server behind a firewall or NAT with Amazon Web Services Transfer Family.  
     */
    PassiveIp?: PassiveIp;
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
     * The name assigned to the file when it was created in S3. You use the object key to retrieve the object.
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
     * The name assigned to the file when it was created in S3. You use the object key to retrieve the object.
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
  export type SourceIp = string;
  export interface SshPublicKey {
    /**
     * Specifies the date that the public key was added to the user account.
     */
    DateImported: DateImported;
    /**
     * Specifies the content of the SSH public key as specified by the PublicKeyId.
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
  export interface StartServerRequest {
    /**
     * A system-assigned unique identifier for a server that you start.
     */
    ServerId: ServerId;
  }
  export type State = "OFFLINE"|"ONLINE"|"STARTING"|"STOPPING"|"START_FAILED"|"STOP_FAILED"|string;
  export type StatusCode = number;
  export type StepResultOutputsJson = string;
  export interface StopServerRequest {
    /**
     * A system-assigned unique identifier for a server that you stopped.
     */
    ServerId: ServerId;
  }
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
     * Key-value pairs assigned to ARNs that you can use to group and search for resources by type. You can attach this metadata to user accounts for any purpose.
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
  }
  export type TagValue = string;
  export type Tags = Tag[];
  export interface TestIdentityProviderRequest {
    /**
     * A system-assigned identifier for a specific server. That server's user authentication method is tested with a user name and password.
     */
    ServerId: ServerId;
    /**
     * The type of file transfer protocol to be tested. The available protocols are:   Secure Shell (SSH) File Transfer Protocol (SFTP)   File Transfer Protocol Secure (FTPS)   File Transfer Protocol (FTP)  
     */
    ServerProtocol?: Protocol;
    /**
     * The source IP address of the user account to be tested.
     */
    SourceIp?: SourceIp;
    /**
     * The name of the user account to be tested.
     */
    UserName: UserName;
    /**
     * The password of the user account to be tested.
     */
    UserPassword?: UserPassword;
  }
  export interface TestIdentityProviderResponse {
    /**
     * The response that is returned from your API Gateway.
     */
    Response?: Response;
    /**
     * The HTTP status code that is the response from your API Gateway.
     */
    StatusCode: StatusCode;
    /**
     * A message that indicates whether the test was successful or not.
     */
    Message?: Message;
    /**
     * The endpoint of the service used to authenticate a user.
     */
    Url: Url;
  }
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
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.
     */
    HomeDirectory?: HomeDirectory;
    /**
     * The type of landing directory (folder) you want your users' home directory to be when they log into the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or EFS paths as is in their file transfer protocol clients. If you set it LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or EFS paths visible to your users.
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * Logical directory mappings that specify what Amazon S3 or Amazon EFS paths and keys should be visible to your user and how you want to make them visible. You must specify the Entry and Target pair, where Entry shows how the path is made visible and Target is the actual Amazon S3 or Amazon EFS path. If you only specify a target, it is displayed as is. You also must ensure that your Amazon Web Services Identity and Access Management (IAM) role provides access to paths in Target. This value can only be set when HomeDirectoryType is set to LOGICAL. The following is an Entry and Target pair example.  [ { "Entry": "/directory1", "Target": "/bucket_name/home/mydirectory" } ]  In most cases, you can use this value instead of the session policy to lock down your user to the designated home directory ("chroot"). To do this, you can set Entry to / and set Target to the HomeDirectory parameter value. The following is an Entry and Target pair example for chroot.  [ { "Entry:": "/", "Target": "/bucket_name/home/mydirectory" } ]   If the target of a logical directory entry does not exist in Amazon S3 or EFS, the entry is ignored. As a workaround, you can use the Amazon S3 API or EFS API to create 0 byte objects as place holders for your directory. If using the CLI, use the s3api or efsapi call instead of s3 or efs so you can use the put-object operation. For example, you use the following: aws s3api put-object --bucket bucketname --key path/to/folder/. Make sure that the end of the key name ends in a / for it to be considered a folder. 
     */
    HomeDirectoryMappings?: HomeDirectoryMappings;
    /**
     * A session policy for your user so that you can use the same IAM role across multiple users. This policy scopes down user access to portions of their Amazon S3 bucket. Variables that you can use inside this policy include ${Transfer:UserName}, ${Transfer:HomeDirectory}, and ${Transfer:HomeBucket}.  This only applies when the domain of ServerId is S3. EFS does not use session policies. For session policies, Amazon Web Services Transfer Family stores the policy as a JSON blob, instead of the Amazon Resource Name (ARN) of the policy. You save the policy as a JSON blob and pass it in the Policy argument. For an example of a session policy, see Example session policy. For more information, see AssumeRole in the Amazon Web ServicesSecurity Token Service API Reference. 
     */
    Policy?: Policy;
    PosixProfile?: PosixProfile;
    /**
     * Specifies the Amazon Resource Name (ARN) of the IAM role that controls your users' access to your Amazon S3 bucket or EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
     */
    Role?: Role;
    /**
     * A system-assigned unique identifier for a server instance. This is the specific server that you added your user to.
     */
    ServerId: ServerId;
    /**
     * A unique identifier that is required to identify specific groups within your directory. The users of the group that you associate have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Amazon Web Services Transfer Family. If you know the group name, you can view the SID values by running the following command using Windows PowerShell.  Get-ADGroup -Filter {samAccountName -like "YourGroupName*"} -Properties * | Select SamAccountName,ObjectSid  In that command, replace YourGroupName with the name of your Active Directory group. The regex used to validate this parameter is a string of characters consisting of uppercase and lowercase alphanumeric characters with no spaces. You can also include underscores or any of the following characters: =,.@:/-
     */
    ExternalId: ExternalId;
  }
  export interface UpdateAccessResponse {
    /**
     * The ID of the server that the user is attached to.
     */
    ServerId: ServerId;
    /**
     * The external ID of the group whose users have access to your Amazon S3 or Amazon EFS resources over the enabled protocols using Amazon Web ServicesTransfer Family.
     */
    ExternalId: ExternalId;
  }
  export interface UpdateServerRequest {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Web ServicesCertificate Manager (ACM) certificate. Required when Protocols is set to FTPS. To request a new public certificate, see Request a public certificate in the  Amazon Web ServicesCertificate Manager User Guide. To import an existing certificate into ACM, see Importing certificates into ACM in the  Amazon Web ServicesCertificate Manager User Guide. To request a private certificate to use FTPS through private IP addresses, see Request a private certificate in the  Amazon Web ServicesCertificate Manager User Guide. Certificates with the following cryptographic algorithms and key sizes are supported:   2048-bit RSA (RSA_2048)   4096-bit RSA (RSA_4096)   Elliptic Prime Curve 256 bit (EC_prime256v1)   Elliptic Prime Curve 384 bit (EC_secp384r1)   Elliptic Prime Curve 521 bit (EC_secp521r1)    The certificate must be a valid SSL/TLS X.509 version 3 certificate with FQDN or IP address specified and information about the issuer. 
     */
    Certificate?: Certificate;
    /**
     *  The protocol settings that are configured for your server.   Use the PassiveIp parameter to indicate passive mode (for FTP and FTPS protocols). Enter a single dotted-quad IPv4 address, such as the external IP address of a firewall, router, or load balancer. 
     */
    ProtocolDetails?: ProtocolDetails;
    /**
     * The virtual private cloud (VPC) endpoint settings that are configured for your server. When you host your endpoint within your VPC, you can make it accessible only to resources within your VPC, or you can attach Elastic IP addresses and make it accessible to clients over the internet. Your VPC's default security groups are automatically assigned to your endpoint.
     */
    EndpointDetails?: EndpointDetails;
    /**
     * The type of endpoint that you want your server to use. You can choose to make your server's endpoint publicly accessible (PUBLIC) or host it inside your VPC. With an endpoint that is hosted in a VPC, you can restrict access to your server and resources only within your VPC or choose to make it internet facing by attaching Elastic IP addresses directly to it.   After May 19, 2021, you won't be able to create a server using EndpointType=VPC_ENDPOINT in your Amazon Web Servicesaccount if your account hasn't already done so before May 19, 2021. If you have already created servers with EndpointType=VPC_ENDPOINT in your Amazon Web Servicesaccount on or before May 19, 2021, you will not be affected. After this date, use EndpointType=VPC. For more information, see https://docs.aws.amazon.com/transfer/latest/userguide/create-server-in-vpc.html#deprecate-vpc-endpoint. It is recommended that you use VPC as the EndpointType. With this endpoint type, you have the option to directly associate up to three Elastic IPv4 addresses (BYO IP included) with your server's endpoint and use VPC security groups to restrict traffic by the client's public IP address. This is not possible with EndpointType set to VPC_ENDPOINT. 
     */
    EndpointType?: EndpointType;
    /**
     * The RSA private key as generated by ssh-keygen -N "" -m PEM -f my-new-server-key.  If you aren't planning to migrate existing users from an existing server to a new server, don't update the host key. Accidentally changing a server's host key can be disruptive.  For more information, see Change the host key for your SFTP-enabled server in the Amazon Web ServicesTransfer Family User Guide.
     */
    HostKey?: HostKey;
    /**
     * An array containing all of the information required to call a customer's authentication API method.
     */
    IdentityProviderDetails?: IdentityProviderDetails;
    /**
     * Specifies the Amazon Resource Name (ARN) of the Amazon Web Services Identity and Access Management (IAM) role that allows a server to turn on Amazon CloudWatch logging for Amazon S3 or Amazon EFS events. When set, user activity can be viewed in your CloudWatch logs.
     */
    LoggingRole?: NullableRole;
    /**
     * Specifies the file transfer protocol or protocols over which your file transfer protocol client can connect to your server's endpoint. The available protocols are:   Secure Shell (SSH) File Transfer Protocol (SFTP): File transfer over SSH   File Transfer Protocol Secure (FTPS): File transfer with TLS encryption   File Transfer Protocol (FTP): Unencrypted file transfer    If you select FTPS, you must choose a certificate stored in Amazon Web ServicesCertificate Manager (ACM) which will be used to identify your server when clients connect to it over FTPS. If Protocol includes either FTP or FTPS, then the EndpointType must be VPC and the IdentityProviderType must be AWS_DIRECTORY_SERVICE or API_GATEWAY. If Protocol includes FTP, then AddressAllocationIds cannot be associated. If Protocol is set only to SFTP, the EndpointType can be set to PUBLIC and the IdentityProviderType can be set to SERVICE_MANAGED. 
     */
    Protocols?: Protocols;
    /**
     * Specifies the name of the security policy that is attached to the server.
     */
    SecurityPolicyName?: SecurityPolicyName;
    /**
     * A system-assigned unique identifier for a server instance that the user account is assigned to.
     */
    ServerId: ServerId;
    /**
     * Specifies the workflow ID for the workflow to assign and the execution role used for executing the workflow.
     */
    WorkflowDetails?: WorkflowDetails;
  }
  export interface UpdateServerResponse {
    /**
     * A system-assigned unique identifier for a server that the user account is assigned to.
     */
    ServerId: ServerId;
  }
  export interface UpdateUserRequest {
    /**
     * The landing directory (folder) for a user when they log in to the server using the client. A HomeDirectory example is /bucket_name/home/mydirectory.
     */
    HomeDirectory?: HomeDirectory;
    /**
     * The type of landing directory (folder) you want your users' home directory to be when they log into the server. If you set it to PATH, the user will see the absolute Amazon S3 bucket or EFS paths as is in their file transfer protocol clients. If you set it LOGICAL, you need to provide mappings in the HomeDirectoryMappings for how you want to make Amazon S3 or EFS paths visible to your users.
     */
    HomeDirectoryType?: HomeDirectoryType;
    /**
     * Logical directory mappings that specify what Amazon S3 or Amazon EFS paths and keys should be visible to your user and how you want to make them visible. You must specify the Entry and Target pair, where Entry shows how the path is made visible and Target is the actual Amazon S3 or Amazon EFS path. If you only specify a target, it is displayed as is. You also must ensure that your Amazon Web Services Identity and Access Management (IAM) role provides access to paths in Target. This value can only be set when HomeDirectoryType is set to LOGICAL. The following is an Entry and Target pair example.  [ { "Entry": "/directory1", "Target": "/bucket_name/home/mydirectory" } ]  In most cases, you can use this value instead of the session policy to lock down your user to the designated home directory ("chroot"). To do this, you can set Entry to '/' and set Target to the HomeDirectory parameter value. The following is an Entry and Target pair example for chroot.  [ { "Entry:": "/", "Target": "/bucket_name/home/mydirectory" } ]   If the target of a logical directory entry does not exist in Amazon S3 or EFS, the entry is ignored. As a workaround, you can use the Amazon S3 API or EFS API to create 0 byte objects as place holders for your directory. If using the CLI, use the s3api or efsapi call instead of s3 or efs so you can use the put-object operation. For example, you use the following: aws s3api put-object --bucket bucketname --key path/to/folder/. Make sure that the end of the key name ends in a / for it to be considered a folder. 
     */
    HomeDirectoryMappings?: HomeDirectoryMappings;
    /**
     * A session policy for your user so that you can use the same IAM role across multiple users. This policy scopes down user access to portions of their Amazon S3 bucket. Variables that you can use inside this policy include ${Transfer:UserName}, ${Transfer:HomeDirectory}, and ${Transfer:HomeBucket}.  This only applies when the domain of ServerId is S3. EFS does not use session policies. For session policies, Amazon Web Services Transfer Family stores the policy as a JSON blob, instead of the Amazon Resource Name (ARN) of the policy. You save the policy as a JSON blob and pass it in the Policy argument. For an example of a session policy, see Creating a session policy. For more information, see AssumeRole in the Amazon Web Services Security Token Service API Reference. 
     */
    Policy?: Policy;
    /**
     * Specifies the full POSIX identity, including user ID (Uid), group ID (Gid), and any secondary groups IDs (SecondaryGids), that controls your users' access to your Amazon Elastic File Systems (Amazon EFS). The POSIX permissions that are set on files and directories in your file system determines the level of access your users get when transferring files into and out of your Amazon EFS file systems.
     */
    PosixProfile?: PosixProfile;
    /**
     * Specifies the Amazon Resource Name (ARN) of the IAM role that controls your users' access to your Amazon S3 bucket or EFS file system. The policies attached to this role determine the level of access that you want to provide your users when transferring files into and out of your Amazon S3 bucket or EFS file system. The IAM role should also contain a trust relationship that allows the server to access your resources when servicing your users' transfer requests.
     */
    Role?: Role;
    /**
     * A system-assigned unique identifier for a server instance that the user account is assigned to.
     */
    ServerId: ServerId;
    /**
     * A unique string that identifies a user and is associated with a server as specified by the ServerId. This user name must be a minimum of 3 and a maximum of 100 characters long. The following are valid characters: a-z, A-Z, 0-9, underscore '_', hyphen '-', period '.', and at sign '@'. The user name can't start with a hyphen, period, or at sign.
     */
    UserName: UserName;
  }
  export interface UpdateUserResponse {
    /**
     * A system-assigned unique identifier for a server instance that the user account is assigned to.
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
     * A unique string that identifies a user account associated with a server.
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
     * A trigger that starts a workflow: the workflow begins to execute after a file is uploaded.
     */
    OnUpload: OnUploadWorkflowDetails;
  }
  export type WorkflowId = string;
  export interface WorkflowStep {
    /**
     *  Currently, the following step types are supported.     Copy: copy the file to another location    Custom: custom step with a lambda target    Delete: delete the file    Tag: add a tag to the file  
     */
    Type?: WorkflowStepType;
    /**
     * Details for a step that performs a file copy.  Consists of the following values:    A description   An S3 location for the destination of the file copy.   A flag that indicates whether or not to overwrite an existing file of the same name. The default is FALSE.  
     */
    CopyStepDetails?: CopyStepDetails;
    /**
     * Details for a step that invokes a lambda function.  Consists of the lambda function name, target, and timeout (in seconds). 
     */
    CustomStepDetails?: CustomStepDetails;
    /**
     * Details for a step that deletes the file.
     */
    DeleteStepDetails?: DeleteStepDetails;
    /**
     * Details for a step that creates one or more tags. You specify one or more tags: each tag contains a key/value pair.
     */
    TagStepDetails?: TagStepDetails;
  }
  export type WorkflowStepName = string;
  export type WorkflowStepType = "COPY"|"CUSTOM"|"TAG"|"DELETE"|string;
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
