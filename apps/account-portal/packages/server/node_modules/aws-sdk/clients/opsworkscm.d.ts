import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class OpsWorksCM extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: OpsWorksCM.Types.ClientConfiguration)
  config: Config & OpsWorksCM.Types.ClientConfiguration;
  /**
   *  Associates a new node with the server. For more information about how to disassociate a node, see DisassociateNode.  On a Chef server: This command is an alternative to knife bootstrap.  Example (Chef): aws opsworks-cm associate-node --server-name MyServer --node-name MyManagedNode --engine-attributes "Name=CHEF_ORGANIZATION,Value=default" "Name=CHEF_NODE_PUBLIC_KEY,Value=public-key-pem"   On a Puppet server, this command is an alternative to the puppet cert sign command that signs a Puppet node CSR.   Example (Puppet): aws opsworks-cm associate-node --server-name MyServer --node-name MyManagedNode --engine-attributes "Name=PUPPET_NODE_CSR,Value=csr-pem"   A node can can only be associated with servers that are in a HEALTHY state. Otherwise, an InvalidStateException is thrown. A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid. The AssociateNode API call can be integrated into Auto Scaling configurations, AWS Cloudformation templates, or the user data of a server's instance. 
   */
  associateNode(params: OpsWorksCM.Types.AssociateNodeRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.AssociateNodeResponse) => void): Request<OpsWorksCM.Types.AssociateNodeResponse, AWSError>;
  /**
   *  Associates a new node with the server. For more information about how to disassociate a node, see DisassociateNode.  On a Chef server: This command is an alternative to knife bootstrap.  Example (Chef): aws opsworks-cm associate-node --server-name MyServer --node-name MyManagedNode --engine-attributes "Name=CHEF_ORGANIZATION,Value=default" "Name=CHEF_NODE_PUBLIC_KEY,Value=public-key-pem"   On a Puppet server, this command is an alternative to the puppet cert sign command that signs a Puppet node CSR.   Example (Puppet): aws opsworks-cm associate-node --server-name MyServer --node-name MyManagedNode --engine-attributes "Name=PUPPET_NODE_CSR,Value=csr-pem"   A node can can only be associated with servers that are in a HEALTHY state. Otherwise, an InvalidStateException is thrown. A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid. The AssociateNode API call can be integrated into Auto Scaling configurations, AWS Cloudformation templates, or the user data of a server's instance. 
   */
  associateNode(callback?: (err: AWSError, data: OpsWorksCM.Types.AssociateNodeResponse) => void): Request<OpsWorksCM.Types.AssociateNodeResponse, AWSError>;
  /**
   *  Creates an application-level backup of a server. While the server is in the BACKING_UP state, the server cannot be changed, and no additional backup can be created.   Backups can be created for servers in RUNNING, HEALTHY, and UNHEALTHY states. By default, you can create a maximum of 50 manual backups.   This operation is asynchronous.   A LimitExceededException is thrown when the maximum number of manual backups is reached. An InvalidStateException is thrown when the server is not in any of the following states: RUNNING, HEALTHY, or UNHEALTHY. A ResourceNotFoundException is thrown when the server is not found. A ValidationException is thrown when parameters of the request are not valid. 
   */
  createBackup(params: OpsWorksCM.Types.CreateBackupRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.CreateBackupResponse) => void): Request<OpsWorksCM.Types.CreateBackupResponse, AWSError>;
  /**
   *  Creates an application-level backup of a server. While the server is in the BACKING_UP state, the server cannot be changed, and no additional backup can be created.   Backups can be created for servers in RUNNING, HEALTHY, and UNHEALTHY states. By default, you can create a maximum of 50 manual backups.   This operation is asynchronous.   A LimitExceededException is thrown when the maximum number of manual backups is reached. An InvalidStateException is thrown when the server is not in any of the following states: RUNNING, HEALTHY, or UNHEALTHY. A ResourceNotFoundException is thrown when the server is not found. A ValidationException is thrown when parameters of the request are not valid. 
   */
  createBackup(callback?: (err: AWSError, data: OpsWorksCM.Types.CreateBackupResponse) => void): Request<OpsWorksCM.Types.CreateBackupResponse, AWSError>;
  /**
   *  Creates and immedately starts a new server. The server is ready to use when it is in the HEALTHY state. By default, you can create a maximum of 10 servers.   This operation is asynchronous.   A LimitExceededException is thrown when you have created the maximum number of servers (10). A ResourceAlreadyExistsException is thrown when a server with the same name already exists in the account. A ResourceNotFoundException is thrown when you specify a backup ID that is not valid or is for a backup that does not exist. A ValidationException is thrown when parameters of the request are not valid.   If you do not specify a security group by adding the SecurityGroupIds parameter, AWS OpsWorks creates a new security group.   Chef Automate: The default security group opens the Chef server to the world on TCP port 443. If a KeyName is present, AWS OpsWorks enables SSH access. SSH is also open to the world on TCP port 22.   Puppet Enterprise: The default security group opens TCP ports 22, 443, 4433, 8140, 8142, 8143, and 8170. If a KeyName is present, AWS OpsWorks enables SSH access. SSH is also open to the world on TCP port 22.  By default, your server is accessible from any IP address. We recommend that you update your security group rules to allow access from known IP addresses and address ranges only. To edit security group rules, open Security Groups in the navigation pane of the EC2 management console.  To specify your own domain for a server, and provide your own self-signed or CA-signed certificate and private key, specify values for CustomDomain, CustomCertificate, and CustomPrivateKey.
   */
  createServer(params: OpsWorksCM.Types.CreateServerRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.CreateServerResponse) => void): Request<OpsWorksCM.Types.CreateServerResponse, AWSError>;
  /**
   *  Creates and immedately starts a new server. The server is ready to use when it is in the HEALTHY state. By default, you can create a maximum of 10 servers.   This operation is asynchronous.   A LimitExceededException is thrown when you have created the maximum number of servers (10). A ResourceAlreadyExistsException is thrown when a server with the same name already exists in the account. A ResourceNotFoundException is thrown when you specify a backup ID that is not valid or is for a backup that does not exist. A ValidationException is thrown when parameters of the request are not valid.   If you do not specify a security group by adding the SecurityGroupIds parameter, AWS OpsWorks creates a new security group.   Chef Automate: The default security group opens the Chef server to the world on TCP port 443. If a KeyName is present, AWS OpsWorks enables SSH access. SSH is also open to the world on TCP port 22.   Puppet Enterprise: The default security group opens TCP ports 22, 443, 4433, 8140, 8142, 8143, and 8170. If a KeyName is present, AWS OpsWorks enables SSH access. SSH is also open to the world on TCP port 22.  By default, your server is accessible from any IP address. We recommend that you update your security group rules to allow access from known IP addresses and address ranges only. To edit security group rules, open Security Groups in the navigation pane of the EC2 management console.  To specify your own domain for a server, and provide your own self-signed or CA-signed certificate and private key, specify values for CustomDomain, CustomCertificate, and CustomPrivateKey.
   */
  createServer(callback?: (err: AWSError, data: OpsWorksCM.Types.CreateServerResponse) => void): Request<OpsWorksCM.Types.CreateServerResponse, AWSError>;
  /**
   *  Deletes a backup. You can delete both manual and automated backups. This operation is asynchronous.   An InvalidStateException is thrown when a backup deletion is already in progress. A ResourceNotFoundException is thrown when the backup does not exist. A ValidationException is thrown when parameters of the request are not valid. 
   */
  deleteBackup(params: OpsWorksCM.Types.DeleteBackupRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.DeleteBackupResponse) => void): Request<OpsWorksCM.Types.DeleteBackupResponse, AWSError>;
  /**
   *  Deletes a backup. You can delete both manual and automated backups. This operation is asynchronous.   An InvalidStateException is thrown when a backup deletion is already in progress. A ResourceNotFoundException is thrown when the backup does not exist. A ValidationException is thrown when parameters of the request are not valid. 
   */
  deleteBackup(callback?: (err: AWSError, data: OpsWorksCM.Types.DeleteBackupResponse) => void): Request<OpsWorksCM.Types.DeleteBackupResponse, AWSError>;
  /**
   *  Deletes the server and the underlying AWS CloudFormation stacks (including the server's EC2 instance). When you run this command, the server state is updated to DELETING. After the server is deleted, it is no longer returned by DescribeServer requests. If the AWS CloudFormation stack cannot be deleted, the server cannot be deleted.   This operation is asynchronous.   An InvalidStateException is thrown when a server deletion is already in progress. A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid.   
   */
  deleteServer(params: OpsWorksCM.Types.DeleteServerRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.DeleteServerResponse) => void): Request<OpsWorksCM.Types.DeleteServerResponse, AWSError>;
  /**
   *  Deletes the server and the underlying AWS CloudFormation stacks (including the server's EC2 instance). When you run this command, the server state is updated to DELETING. After the server is deleted, it is no longer returned by DescribeServer requests. If the AWS CloudFormation stack cannot be deleted, the server cannot be deleted.   This operation is asynchronous.   An InvalidStateException is thrown when a server deletion is already in progress. A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid.   
   */
  deleteServer(callback?: (err: AWSError, data: OpsWorksCM.Types.DeleteServerResponse) => void): Request<OpsWorksCM.Types.DeleteServerResponse, AWSError>;
  /**
   *  Describes your OpsWorks-CM account attributes.   This operation is synchronous. 
   */
  describeAccountAttributes(params: OpsWorksCM.Types.DescribeAccountAttributesRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.DescribeAccountAttributesResponse) => void): Request<OpsWorksCM.Types.DescribeAccountAttributesResponse, AWSError>;
  /**
   *  Describes your OpsWorks-CM account attributes.   This operation is synchronous. 
   */
  describeAccountAttributes(callback?: (err: AWSError, data: OpsWorksCM.Types.DescribeAccountAttributesResponse) => void): Request<OpsWorksCM.Types.DescribeAccountAttributesResponse, AWSError>;
  /**
   *  Describes backups. The results are ordered by time, with newest backups first. If you do not specify a BackupId or ServerName, the command returns all backups.   This operation is synchronous.   A ResourceNotFoundException is thrown when the backup does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  describeBackups(params: OpsWorksCM.Types.DescribeBackupsRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.DescribeBackupsResponse) => void): Request<OpsWorksCM.Types.DescribeBackupsResponse, AWSError>;
  /**
   *  Describes backups. The results are ordered by time, with newest backups first. If you do not specify a BackupId or ServerName, the command returns all backups.   This operation is synchronous.   A ResourceNotFoundException is thrown when the backup does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  describeBackups(callback?: (err: AWSError, data: OpsWorksCM.Types.DescribeBackupsResponse) => void): Request<OpsWorksCM.Types.DescribeBackupsResponse, AWSError>;
  /**
   *  Describes events for a specified server. Results are ordered by time, with newest events first.   This operation is synchronous.   A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  describeEvents(params: OpsWorksCM.Types.DescribeEventsRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.DescribeEventsResponse) => void): Request<OpsWorksCM.Types.DescribeEventsResponse, AWSError>;
  /**
   *  Describes events for a specified server. Results are ordered by time, with newest events first.   This operation is synchronous.   A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  describeEvents(callback?: (err: AWSError, data: OpsWorksCM.Types.DescribeEventsResponse) => void): Request<OpsWorksCM.Types.DescribeEventsResponse, AWSError>;
  /**
   *  Returns the current status of an existing association or disassociation request.   A ResourceNotFoundException is thrown when no recent association or disassociation request with the specified token is found, or when the server does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  describeNodeAssociationStatus(params: OpsWorksCM.Types.DescribeNodeAssociationStatusRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.DescribeNodeAssociationStatusResponse) => void): Request<OpsWorksCM.Types.DescribeNodeAssociationStatusResponse, AWSError>;
  /**
   *  Returns the current status of an existing association or disassociation request.   A ResourceNotFoundException is thrown when no recent association or disassociation request with the specified token is found, or when the server does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  describeNodeAssociationStatus(callback?: (err: AWSError, data: OpsWorksCM.Types.DescribeNodeAssociationStatusResponse) => void): Request<OpsWorksCM.Types.DescribeNodeAssociationStatusResponse, AWSError>;
  /**
   *  Lists all configuration management servers that are identified with your account. Only the stored results from Amazon DynamoDB are returned. AWS OpsWorks CM does not query other services.   This operation is synchronous.   A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  describeServers(params: OpsWorksCM.Types.DescribeServersRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.DescribeServersResponse) => void): Request<OpsWorksCM.Types.DescribeServersResponse, AWSError>;
  /**
   *  Lists all configuration management servers that are identified with your account. Only the stored results from Amazon DynamoDB are returned. AWS OpsWorks CM does not query other services.   This operation is synchronous.   A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  describeServers(callback?: (err: AWSError, data: OpsWorksCM.Types.DescribeServersResponse) => void): Request<OpsWorksCM.Types.DescribeServersResponse, AWSError>;
  /**
   *  Disassociates a node from an AWS OpsWorks CM server, and removes the node from the server's managed nodes. After a node is disassociated, the node key pair is no longer valid for accessing the configuration manager's API. For more information about how to associate a node, see AssociateNode.  A node can can only be disassociated from a server that is in a HEALTHY state. Otherwise, an InvalidStateException is thrown. A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  disassociateNode(params: OpsWorksCM.Types.DisassociateNodeRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.DisassociateNodeResponse) => void): Request<OpsWorksCM.Types.DisassociateNodeResponse, AWSError>;
  /**
   *  Disassociates a node from an AWS OpsWorks CM server, and removes the node from the server's managed nodes. After a node is disassociated, the node key pair is no longer valid for accessing the configuration manager's API. For more information about how to associate a node, see AssociateNode.  A node can can only be disassociated from a server that is in a HEALTHY state. Otherwise, an InvalidStateException is thrown. A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  disassociateNode(callback?: (err: AWSError, data: OpsWorksCM.Types.DisassociateNodeResponse) => void): Request<OpsWorksCM.Types.DisassociateNodeResponse, AWSError>;
  /**
   *  Exports a specified server engine attribute as a base64-encoded string. For example, you can export user data that you can use in EC2 to associate nodes with a server.   This operation is synchronous.   A ValidationException is raised when parameters of the request are not valid. A ResourceNotFoundException is thrown when the server does not exist. An InvalidStateException is thrown when the server is in any of the following states: CREATING, TERMINATED, FAILED or DELETING. 
   */
  exportServerEngineAttribute(params: OpsWorksCM.Types.ExportServerEngineAttributeRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.ExportServerEngineAttributeResponse) => void): Request<OpsWorksCM.Types.ExportServerEngineAttributeResponse, AWSError>;
  /**
   *  Exports a specified server engine attribute as a base64-encoded string. For example, you can export user data that you can use in EC2 to associate nodes with a server.   This operation is synchronous.   A ValidationException is raised when parameters of the request are not valid. A ResourceNotFoundException is thrown when the server does not exist. An InvalidStateException is thrown when the server is in any of the following states: CREATING, TERMINATED, FAILED or DELETING. 
   */
  exportServerEngineAttribute(callback?: (err: AWSError, data: OpsWorksCM.Types.ExportServerEngineAttributeResponse) => void): Request<OpsWorksCM.Types.ExportServerEngineAttributeResponse, AWSError>;
  /**
   * Returns a list of tags that are applied to the specified AWS OpsWorks for Chef Automate or AWS OpsWorks for Puppet Enterprise servers or backups.
   */
  listTagsForResource(params: OpsWorksCM.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.ListTagsForResourceResponse) => void): Request<OpsWorksCM.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of tags that are applied to the specified AWS OpsWorks for Chef Automate or AWS OpsWorks for Puppet Enterprise servers or backups.
   */
  listTagsForResource(callback?: (err: AWSError, data: OpsWorksCM.Types.ListTagsForResourceResponse) => void): Request<OpsWorksCM.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Restores a backup to a server that is in a CONNECTION_LOST, HEALTHY, RUNNING, UNHEALTHY, or TERMINATED state. When you run RestoreServer, the server's EC2 instance is deleted, and a new EC2 instance is configured. RestoreServer maintains the existing server endpoint, so configuration management of the server's client devices (nodes) should continue to work.  Restoring from a backup is performed by creating a new EC2 instance. If restoration is successful, and the server is in a HEALTHY state, AWS OpsWorks CM switches traffic over to the new instance. After restoration is finished, the old EC2 instance is maintained in a Running or Stopped state, but is eventually terminated.  This operation is asynchronous.   An InvalidStateException is thrown when the server is not in a valid state. A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  restoreServer(params: OpsWorksCM.Types.RestoreServerRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.RestoreServerResponse) => void): Request<OpsWorksCM.Types.RestoreServerResponse, AWSError>;
  /**
   *  Restores a backup to a server that is in a CONNECTION_LOST, HEALTHY, RUNNING, UNHEALTHY, or TERMINATED state. When you run RestoreServer, the server's EC2 instance is deleted, and a new EC2 instance is configured. RestoreServer maintains the existing server endpoint, so configuration management of the server's client devices (nodes) should continue to work.  Restoring from a backup is performed by creating a new EC2 instance. If restoration is successful, and the server is in a HEALTHY state, AWS OpsWorks CM switches traffic over to the new instance. After restoration is finished, the old EC2 instance is maintained in a Running or Stopped state, but is eventually terminated.  This operation is asynchronous.   An InvalidStateException is thrown when the server is not in a valid state. A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  restoreServer(callback?: (err: AWSError, data: OpsWorksCM.Types.RestoreServerResponse) => void): Request<OpsWorksCM.Types.RestoreServerResponse, AWSError>;
  /**
   *  Manually starts server maintenance. This command can be useful if an earlier maintenance attempt failed, and the underlying cause of maintenance failure has been resolved. The server is in an UNDER_MAINTENANCE state while maintenance is in progress.   Maintenance can only be started on servers in HEALTHY and UNHEALTHY states. Otherwise, an InvalidStateException is thrown. A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  startMaintenance(params: OpsWorksCM.Types.StartMaintenanceRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.StartMaintenanceResponse) => void): Request<OpsWorksCM.Types.StartMaintenanceResponse, AWSError>;
  /**
   *  Manually starts server maintenance. This command can be useful if an earlier maintenance attempt failed, and the underlying cause of maintenance failure has been resolved. The server is in an UNDER_MAINTENANCE state while maintenance is in progress.   Maintenance can only be started on servers in HEALTHY and UNHEALTHY states. Otherwise, an InvalidStateException is thrown. A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  startMaintenance(callback?: (err: AWSError, data: OpsWorksCM.Types.StartMaintenanceResponse) => void): Request<OpsWorksCM.Types.StartMaintenanceResponse, AWSError>;
  /**
   * Applies tags to an AWS OpsWorks for Chef Automate or AWS OpsWorks for Puppet Enterprise server, or to server backups.
   */
  tagResource(params: OpsWorksCM.Types.TagResourceRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.TagResourceResponse) => void): Request<OpsWorksCM.Types.TagResourceResponse, AWSError>;
  /**
   * Applies tags to an AWS OpsWorks for Chef Automate or AWS OpsWorks for Puppet Enterprise server, or to server backups.
   */
  tagResource(callback?: (err: AWSError, data: OpsWorksCM.Types.TagResourceResponse) => void): Request<OpsWorksCM.Types.TagResourceResponse, AWSError>;
  /**
   * Removes specified tags from an AWS OpsWorks-CM server or backup.
   */
  untagResource(params: OpsWorksCM.Types.UntagResourceRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.UntagResourceResponse) => void): Request<OpsWorksCM.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes specified tags from an AWS OpsWorks-CM server or backup.
   */
  untagResource(callback?: (err: AWSError, data: OpsWorksCM.Types.UntagResourceResponse) => void): Request<OpsWorksCM.Types.UntagResourceResponse, AWSError>;
  /**
   *  Updates settings for a server.   This operation is synchronous. 
   */
  updateServer(params: OpsWorksCM.Types.UpdateServerRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.UpdateServerResponse) => void): Request<OpsWorksCM.Types.UpdateServerResponse, AWSError>;
  /**
   *  Updates settings for a server.   This operation is synchronous. 
   */
  updateServer(callback?: (err: AWSError, data: OpsWorksCM.Types.UpdateServerResponse) => void): Request<OpsWorksCM.Types.UpdateServerResponse, AWSError>;
  /**
   *  Updates engine-specific attributes on a specified server. The server enters the MODIFYING state when this operation is in progress. Only one update can occur at a time. You can use this command to reset a Chef server's public key (CHEF_PIVOTAL_KEY) or a Puppet server's admin password (PUPPET_ADMIN_PASSWORD).   This operation is asynchronous.   This operation can only be called for servers in HEALTHY or UNHEALTHY states. Otherwise, an InvalidStateException is raised. A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  updateServerEngineAttributes(params: OpsWorksCM.Types.UpdateServerEngineAttributesRequest, callback?: (err: AWSError, data: OpsWorksCM.Types.UpdateServerEngineAttributesResponse) => void): Request<OpsWorksCM.Types.UpdateServerEngineAttributesResponse, AWSError>;
  /**
   *  Updates engine-specific attributes on a specified server. The server enters the MODIFYING state when this operation is in progress. Only one update can occur at a time. You can use this command to reset a Chef server's public key (CHEF_PIVOTAL_KEY) or a Puppet server's admin password (PUPPET_ADMIN_PASSWORD).   This operation is asynchronous.   This operation can only be called for servers in HEALTHY or UNHEALTHY states. Otherwise, an InvalidStateException is raised. A ResourceNotFoundException is thrown when the server does not exist. A ValidationException is raised when parameters of the request are not valid. 
   */
  updateServerEngineAttributes(callback?: (err: AWSError, data: OpsWorksCM.Types.UpdateServerEngineAttributesResponse) => void): Request<OpsWorksCM.Types.UpdateServerEngineAttributesResponse, AWSError>;
  /**
   * Waits for the nodeAssociated state by periodically calling the underlying OpsWorksCM.describeNodeAssociationStatusoperation every 15 seconds (at most 15 times). Wait until node is associated or disassociated.
   */
  waitFor(state: "nodeAssociated", params: OpsWorksCM.Types.DescribeNodeAssociationStatusRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: OpsWorksCM.Types.DescribeNodeAssociationStatusResponse) => void): Request<OpsWorksCM.Types.DescribeNodeAssociationStatusResponse, AWSError>;
  /**
   * Waits for the nodeAssociated state by periodically calling the underlying OpsWorksCM.describeNodeAssociationStatusoperation every 15 seconds (at most 15 times). Wait until node is associated or disassociated.
   */
  waitFor(state: "nodeAssociated", callback?: (err: AWSError, data: OpsWorksCM.Types.DescribeNodeAssociationStatusResponse) => void): Request<OpsWorksCM.Types.DescribeNodeAssociationStatusResponse, AWSError>;
}
declare namespace OpsWorksCM {
  export type AWSOpsWorksCMResourceArn = string;
  export interface AccountAttribute {
    /**
     *  The attribute name. The following are supported attribute names.     ServerLimit: The number of current servers/maximum number of servers allowed. By default, you can have a maximum of 10 servers.     ManualBackupLimit: The number of current manual backups/maximum number of backups allowed. By default, you can have a maximum of 50 manual backups saved.   
     */
    Name?: String;
    /**
     *  The maximum allowed value. 
     */
    Maximum?: Integer;
    /**
     *  The current usage, such as the current number of servers that are associated with the account. 
     */
    Used?: Integer;
  }
  export type AccountAttributes = AccountAttribute[];
  export interface AssociateNodeRequest {
    /**
     * The name of the server with which to associate the node. 
     */
    ServerName: ServerName;
    /**
     * The name of the node. 
     */
    NodeName: NodeName;
    /**
     * Engine attributes used for associating the node.   Attributes accepted in a AssociateNode request for Chef     CHEF_ORGANIZATION: The Chef organization with which the node is associated. By default only one organization named default can exist.     CHEF_NODE_PUBLIC_KEY: A PEM-formatted public key. This key is required for the chef-client agent to access the Chef API.     Attributes accepted in a AssociateNode request for Puppet     PUPPET_NODE_CSR: A PEM-formatted certificate-signing request (CSR) that is created by the node.   
     */
    EngineAttributes: EngineAttributes;
  }
  export interface AssociateNodeResponse {
    /**
     * Contains a token which can be passed to the DescribeNodeAssociationStatus API call to get the status of the association request. 
     */
    NodeAssociationStatusToken?: NodeAssociationStatusToken;
  }
  export type AttributeName = string;
  export type AttributeValue = string;
  export interface Backup {
    /**
     * The ARN of the backup. 
     */
    BackupArn?: String;
    /**
     *  The generated ID of the backup. Example: myServerName-yyyyMMddHHmmssSSS 
     */
    BackupId?: BackupId;
    /**
     *  The backup type. Valid values are automated or manual. 
     */
    BackupType?: BackupType;
    /**
     *  The time stamp when the backup was created in the database. Example: 2016-07-29T13:38:47.520Z 
     */
    CreatedAt?: Timestamp;
    /**
     *  A user-provided description for a manual backup. This field is empty for automated backups. 
     */
    Description?: String;
    /**
     *  The engine type that is obtained from the server when the backup is created. 
     */
    Engine?: String;
    /**
     *  The engine model that is obtained from the server when the backup is created. 
     */
    EngineModel?: String;
    /**
     *  The engine version that is obtained from the server when the backup is created. 
     */
    EngineVersion?: String;
    /**
     *  The EC2 instance profile ARN that is obtained from the server when the backup is created. Because this value is stored, you are not required to provide the InstanceProfileArn again if you restore a backup. 
     */
    InstanceProfileArn?: String;
    /**
     *  The instance type that is obtained from the server when the backup is created. 
     */
    InstanceType?: String;
    /**
     *  The key pair that is obtained from the server when the backup is created. 
     */
    KeyPair?: String;
    /**
     *  The preferred backup period that is obtained from the server when the backup is created. 
     */
    PreferredBackupWindow?: TimeWindowDefinition;
    /**
     *  The preferred maintenance period that is obtained from the server when the backup is created. 
     */
    PreferredMaintenanceWindow?: TimeWindowDefinition;
    /**
     *  This field is deprecated and is no longer used. 
     */
    S3DataSize?: Integer;
    /**
     *  This field is deprecated and is no longer used. 
     */
    S3DataUrl?: String;
    /**
     *  The Amazon S3 URL of the backup's log file. 
     */
    S3LogUrl?: String;
    /**
     *  The security group IDs that are obtained from the server when the backup is created. 
     */
    SecurityGroupIds?: Strings;
    /**
     *  The name of the server from which the backup was made. 
     */
    ServerName?: ServerName;
    /**
     *  The service role ARN that is obtained from the server when the backup is created. 
     */
    ServiceRoleArn?: String;
    /**
     * The status of a backup while in progress. 
     */
    Status?: BackupStatus;
    /**
     *  An informational message about backup status. 
     */
    StatusDescription?: String;
    /**
     *  The subnet IDs that are obtained from the server when the backup is created. 
     */
    SubnetIds?: Strings;
    /**
     *  The version of AWS OpsWorks CM-specific tools that is obtained from the server when the backup is created. 
     */
    ToolsVersion?: String;
    /**
     *  The IAM user ARN of the requester for manual backups. This field is empty for automated backups. 
     */
    UserArn?: String;
  }
  export type BackupId = string;
  export type BackupRetentionCountDefinition = number;
  export type BackupStatus = "IN_PROGRESS"|"OK"|"FAILED"|"DELETING"|string;
  export type BackupType = "AUTOMATED"|"MANUAL"|string;
  export type Backups = Backup[];
  export type Boolean = boolean;
  export interface CreateBackupRequest {
    /**
     * The name of the server that you want to back up. 
     */
    ServerName: ServerName;
    /**
     *  A user-defined description of the backup. 
     */
    Description?: String;
    /**
     * A map that contains tag keys and tag values to attach to an AWS OpsWorks-CM server backup.   The key cannot be empty.   The key can be a maximum of 127 characters, and can contain only Unicode letters, numbers, or separators, or the following special characters: + - = . _ : /    The value can be a maximum 255 characters, and contain only Unicode letters, numbers, or separators, or the following special characters: + - = . _ : /    Leading and trailing white spaces are trimmed from both the key and value.   A maximum of 50 user-applied tags is allowed for tag-supported AWS OpsWorks-CM resources.  
     */
    Tags?: TagList;
  }
  export interface CreateBackupResponse {
    /**
     * Backup created by request.
     */
    Backup?: Backup;
  }
  export interface CreateServerRequest {
    /**
     *  Associate a public IP address with a server that you are launching. Valid values are true or false. The default value is true. 
     */
    AssociatePublicIpAddress?: Boolean;
    /**
     * An optional public endpoint of a server, such as https://aws.my-company.com. To access the server, create a CNAME DNS record in your preferred DNS service that points the custom domain to the endpoint that is generated when the server is created (the value of the CreateServer Endpoint attribute). You cannot access the server by using the generated Endpoint value if the server is using a custom domain. If you specify a custom domain, you must also specify values for CustomCertificate and CustomPrivateKey.
     */
    CustomDomain?: CustomDomain;
    /**
     * A PEM-formatted HTTPS certificate. The value can be be a single, self-signed certificate, or a certificate chain. If you specify a custom certificate, you must also specify values for CustomDomain and CustomPrivateKey. The following are requirements for the CustomCertificate value:   You can provide either a self-signed, custom certificate, or the full certificate chain.   The certificate must be a valid X509 certificate, or a certificate chain in PEM format.   The certificate must be valid at the time of upload. A certificate can't be used before its validity period begins (the certificate's NotBefore date), or after it expires (the certificate's NotAfter date).   The certificate’s common name or subject alternative names (SANs), if present, must match the value of CustomDomain.   The certificate must match the value of CustomPrivateKey.  
     */
    CustomCertificate?: CustomCertificate;
    /**
     * A private key in PEM format for connecting to the server by using HTTPS. The private key must not be encrypted; it cannot be protected by a password or passphrase. If you specify a custom private key, you must also specify values for CustomDomain and CustomCertificate.
     */
    CustomPrivateKey?: CustomPrivateKey;
    /**
     *  Enable or disable scheduled backups. Valid values are true or false. The default value is true. 
     */
    DisableAutomatedBackup?: Boolean;
    /**
     *  The configuration management engine to use. Valid values include ChefAutomate and Puppet. 
     */
    Engine: String;
    /**
     *  The engine model of the server. Valid values in this release include Monolithic for Puppet and Single for Chef. 
     */
    EngineModel?: String;
    /**
     *  The major release version of the engine that you want to use. For a Chef server, the valid value for EngineVersion is currently 2. For a Puppet server, valid values are 2019 or 2017. 
     */
    EngineVersion?: String;
    /**
     * Optional engine attributes on a specified server.   Attributes accepted in a Chef createServer request:     CHEF_AUTOMATE_PIVOTAL_KEY: A base64-encoded RSA public key. The corresponding private key is required to access the Chef API. When no CHEF_AUTOMATE_PIVOTAL_KEY is set, a private key is generated and returned in the response.     CHEF_AUTOMATE_ADMIN_PASSWORD: The password for the administrative user in the Chef Automate web-based dashboard. The password length is a minimum of eight characters, and a maximum of 32. The password can contain letters, numbers, and special characters (!/@#$%^&amp;+=_). The password must contain at least one lower case letter, one upper case letter, one number, and one special character. When no CHEF_AUTOMATE_ADMIN_PASSWORD is set, one is generated and returned in the response.    Attributes accepted in a Puppet createServer request:     PUPPET_ADMIN_PASSWORD: To work with the Puppet Enterprise console, a password must use ASCII characters.    PUPPET_R10K_REMOTE: The r10k remote is the URL of your control repository (for example, ssh://git@your.git-repo.com:user/control-repo.git). Specifying an r10k remote opens TCP port 8170.    PUPPET_R10K_PRIVATE_KEY: If you are using a private Git repository, add PUPPET_R10K_PRIVATE_KEY to specify a PEM-encoded private SSH key.  
     */
    EngineAttributes?: EngineAttributes;
    /**
     *  The number of automated backups that you want to keep. Whenever a new backup is created, AWS OpsWorks CM deletes the oldest backups if this number is exceeded. The default value is 1. 
     */
    BackupRetentionCount?: BackupRetentionCountDefinition;
    /**
     *  The name of the server. The server name must be unique within your AWS account, within each region. Server names must start with a letter; then letters, numbers, or hyphens (-) are allowed, up to a maximum of 40 characters. 
     */
    ServerName: ServerName;
    /**
     *  The ARN of the instance profile that your Amazon EC2 instances use. Although the AWS OpsWorks console typically creates the instance profile for you, if you are using API commands instead, run the service-role-creation.yaml AWS CloudFormation template, located at https://s3.amazonaws.com/opsworks-cm-us-east-1-prod-default-assets/misc/opsworks-cm-roles.yaml. This template creates a CloudFormation stack that includes the instance profile you need. 
     */
    InstanceProfileArn: InstanceProfileArn;
    /**
     *  The Amazon EC2 instance type to use. For example, m5.large. 
     */
    InstanceType: String;
    /**
     *  The Amazon EC2 key pair to set for the instance. This parameter is optional; if desired, you may specify this parameter to connect to your instances by using SSH. 
     */
    KeyPair?: KeyPair;
    /**
     *  The start time for a one-hour period each week during which AWS OpsWorks CM performs maintenance on the instance. Valid values must be specified in the following format: DDD:HH:MM. MM must be specified as 00. The specified time is in coordinated universal time (UTC). The default value is a random one-hour period on Tuesday, Wednesday, or Friday. See TimeWindowDefinition for more information.   Example: Mon:08:00, which represents a start time of every Monday at 08:00 UTC. (8:00 a.m.) 
     */
    PreferredMaintenanceWindow?: TimeWindowDefinition;
    /**
     *  The start time for a one-hour period during which AWS OpsWorks CM backs up application-level data on your server if automated backups are enabled. Valid values must be specified in one of the following formats:     HH:MM for daily backups    DDD:HH:MM for weekly backups    MM must be specified as 00. The specified time is in coordinated universal time (UTC). The default value is a random, daily start time.  Example: 08:00, which represents a daily start time of 08:00 UTC.  Example: Mon:08:00, which represents a start time of every Monday at 08:00 UTC. (8:00 a.m.)
     */
    PreferredBackupWindow?: TimeWindowDefinition;
    /**
     *  A list of security group IDs to attach to the Amazon EC2 instance. If you add this parameter, the specified security groups must be within the VPC that is specified by SubnetIds.   If you do not specify this parameter, AWS OpsWorks CM creates one new security group that uses TCP ports 22 and 443, open to 0.0.0.0/0 (everyone). 
     */
    SecurityGroupIds?: Strings;
    /**
     *  The service role that the AWS OpsWorks CM service backend uses to work with your account. Although the AWS OpsWorks management console typically creates the service role for you, if you are using the AWS CLI or API commands, run the service-role-creation.yaml AWS CloudFormation template, located at https://s3.amazonaws.com/opsworks-cm-us-east-1-prod-default-assets/misc/opsworks-cm-roles.yaml. This template creates a CloudFormation stack that includes the service role and instance profile that you need. 
     */
    ServiceRoleArn: ServiceRoleArn;
    /**
     *  The IDs of subnets in which to launch the server EC2 instance.   Amazon EC2-Classic customers: This field is required. All servers must run within a VPC. The VPC must have "Auto Assign Public IP" enabled.   EC2-VPC customers: This field is optional. If you do not specify subnet IDs, your EC2 instances are created in a default subnet that is selected by Amazon EC2. If you specify subnet IDs, the VPC must have "Auto Assign Public IP" enabled.  For more information about supported Amazon EC2 platforms, see Supported Platforms.
     */
    SubnetIds?: Strings;
    /**
     * A map that contains tag keys and tag values to attach to an AWS OpsWorks for Chef Automate or AWS OpsWorks for Puppet Enterprise server.   The key cannot be empty.   The key can be a maximum of 127 characters, and can contain only Unicode letters, numbers, or separators, or the following special characters: + - = . _ : / @    The value can be a maximum 255 characters, and contain only Unicode letters, numbers, or separators, or the following special characters: + - = . _ : / @    Leading and trailing white spaces are trimmed from both the key and value.   A maximum of 50 user-applied tags is allowed for any AWS OpsWorks-CM server.  
     */
    Tags?: TagList;
    /**
     *  If you specify this field, AWS OpsWorks CM creates the server by using the backup represented by BackupId. 
     */
    BackupId?: BackupId;
  }
  export interface CreateServerResponse {
    /**
     * The server that is created by the request. 
     */
    Server?: Server;
  }
  export type CustomCertificate = string;
  export type CustomDomain = string;
  export type CustomPrivateKey = string;
  export interface DeleteBackupRequest {
    /**
     * The ID of the backup to delete. Run the DescribeBackups command to get a list of backup IDs. Backup IDs are in the format ServerName-yyyyMMddHHmmssSSS. 
     */
    BackupId: BackupId;
  }
  export interface DeleteBackupResponse {
  }
  export interface DeleteServerRequest {
    /**
     * The ID of the server to delete.
     */
    ServerName: ServerName;
  }
  export interface DeleteServerResponse {
  }
  export interface DescribeAccountAttributesRequest {
  }
  export interface DescribeAccountAttributesResponse {
    /**
     *  The attributes that are currently set for the account. 
     */
    Attributes?: AccountAttributes;
  }
  export interface DescribeBackupsRequest {
    /**
     * Describes a single backup. 
     */
    BackupId?: BackupId;
    /**
     * Returns backups for the server with the specified ServerName. 
     */
    ServerName?: ServerName;
    /**
     * This is not currently implemented for DescribeBackups requests.
     */
    NextToken?: NextToken;
    /**
     * This is not currently implemented for DescribeBackups requests.
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeBackupsResponse {
    /**
     * Contains the response to a DescribeBackups request. 
     */
    Backups?: Backups;
    /**
     * This is not currently implemented for DescribeBackups requests.
     */
    NextToken?: String;
  }
  export interface DescribeEventsRequest {
    /**
     * The name of the server for which you want to view events.
     */
    ServerName: ServerName;
    /**
     * NextToken is a string that is returned in some command responses. It indicates that not all entries have been returned, and that you must run at least one more request to get remaining items. To get remaining results, call DescribeEvents again, and assign the token from the previous results as the value of the nextToken parameter. If there are no more results, the response object's nextToken parameter value is null. Setting a nextToken value that was not returned in your previous results causes an InvalidNextTokenException to occur. 
     */
    NextToken?: NextToken;
    /**
     * To receive a paginated response, use this parameter to specify the maximum number of results to be returned with a single call. If the number of available results exceeds this maximum, the response includes a NextToken value that you can assign to the NextToken request parameter to get the next set of results. 
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeEventsResponse {
    /**
     * Contains the response to a DescribeEvents request. 
     */
    ServerEvents?: ServerEvents;
    /**
     * NextToken is a string that is returned in some command responses. It indicates that not all entries have been returned, and that you must run at least one more request to get remaining items. To get remaining results, call DescribeEvents again, and assign the token from the previous results as the value of the nextToken parameter. If there are no more results, the response object's nextToken parameter value is null. Setting a nextToken value that was not returned in your previous results causes an InvalidNextTokenException to occur. 
     */
    NextToken?: String;
  }
  export interface DescribeNodeAssociationStatusRequest {
    /**
     * The token returned in either the AssociateNodeResponse or the DisassociateNodeResponse. 
     */
    NodeAssociationStatusToken: NodeAssociationStatusToken;
    /**
     * The name of the server from which to disassociate the node. 
     */
    ServerName: ServerName;
  }
  export interface DescribeNodeAssociationStatusResponse {
    /**
     * The status of the association or disassociation request.   Possible values:     SUCCESS: The association or disassociation succeeded.     FAILED: The association or disassociation failed.     IN_PROGRESS: The association or disassociation is still in progress.   
     */
    NodeAssociationStatus?: NodeAssociationStatus;
    /**
     * Attributes specific to the node association. In Puppet, the attibute PUPPET_NODE_CERT contains the signed certificate (the result of the CSR). 
     */
    EngineAttributes?: EngineAttributes;
  }
  export interface DescribeServersRequest {
    /**
     * Describes the server with the specified ServerName.
     */
    ServerName?: ServerName;
    /**
     * This is not currently implemented for DescribeServers requests. 
     */
    NextToken?: NextToken;
    /**
     * This is not currently implemented for DescribeServers requests. 
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeServersResponse {
    /**
     * Contains the response to a DescribeServers request.  For Chef Automate servers: If DescribeServersResponse$Servers$EngineAttributes includes CHEF_MAJOR_UPGRADE_AVAILABLE, you can upgrade the Chef Automate server to Chef Automate 2. To be eligible for upgrade, a server running Chef Automate 1 must have had at least one successful maintenance run after November 1, 2019.  For Puppet servers: DescribeServersResponse$Servers$EngineAttributes contains the following two responses:    PUPPET_API_CA_CERT, the PEM-encoded CA certificate that is used by the Puppet API over TCP port number 8140. The CA certificate is also used to sign node certificates.    PUPPET_API_CRL, a certificate revocation list. The certificate revocation list is for internal maintenance purposes only. For more information about the Puppet certificate revocation list, see Man Page: puppet certificate_revocation_list in the Puppet documentation.  
     */
    Servers?: Servers;
    /**
     * This is not currently implemented for DescribeServers requests. 
     */
    NextToken?: String;
  }
  export interface DisassociateNodeRequest {
    /**
     * The name of the server from which to disassociate the node. 
     */
    ServerName: ServerName;
    /**
     * The name of the client node. 
     */
    NodeName: NodeName;
    /**
     * Engine attributes that are used for disassociating the node. No attributes are required for Puppet.   Attributes required in a DisassociateNode request for Chef     CHEF_ORGANIZATION: The Chef organization with which the node was associated. By default only one organization named default can exist.   
     */
    EngineAttributes?: EngineAttributes;
  }
  export interface DisassociateNodeResponse {
    /**
     * Contains a token which can be passed to the DescribeNodeAssociationStatus API call to get the status of the disassociation request. 
     */
    NodeAssociationStatusToken?: NodeAssociationStatusToken;
  }
  export interface EngineAttribute {
    /**
     * The name of the engine attribute. 
     */
    Name?: EngineAttributeName;
    /**
     * The value of the engine attribute. 
     */
    Value?: EngineAttributeValue;
  }
  export type EngineAttributeName = string;
  export type EngineAttributeValue = string;
  export type EngineAttributes = EngineAttribute[];
  export interface ExportServerEngineAttributeRequest {
    /**
     * The name of the export attribute. Currently, the supported export attribute is Userdata. This exports a user data script that includes parameters and values provided in the InputAttributes list.
     */
    ExportAttributeName: String;
    /**
     * The name of the server from which you are exporting the attribute.
     */
    ServerName: ServerName;
    /**
     * The list of engine attributes. The list type is EngineAttribute. An EngineAttribute list item is a pair that includes an attribute name and its value. For the Userdata ExportAttributeName, the following are supported engine attribute names.    RunList In Chef, a list of roles or recipes that are run in the specified order. In Puppet, this parameter is ignored.    OrganizationName In Chef, an organization name. AWS OpsWorks for Chef Automate always creates the organization default. In Puppet, this parameter is ignored.    NodeEnvironment In Chef, a node environment (for example, development, staging, or one-box). In Puppet, this parameter is ignored.    NodeClientVersion In Chef, the version of the Chef engine (three numbers separated by dots, such as 13.8.5). If this attribute is empty, OpsWorks for Chef Automate uses the most current version. In Puppet, this parameter is ignored.  
     */
    InputAttributes?: EngineAttributes;
  }
  export interface ExportServerEngineAttributeResponse {
    /**
     * The requested engine attribute pair with attribute name and value.
     */
    EngineAttribute?: EngineAttribute;
    /**
     * The server name used in the request.
     */
    ServerName?: ServerName;
  }
  export type InstanceProfileArn = string;
  export type Integer = number;
  export type KeyPair = string;
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Number (ARN) of an AWS OpsWorks for Chef Automate or AWS OpsWorks for Puppet Enterprise server for which you want to show applied tags. For example, arn:aws:opsworks-cm:us-west-2:123456789012:server/test-owcm-server/EXAMPLE-66b0-4196-8274-d1a2bEXAMPLE.
     */
    ResourceArn: AWSOpsWorksCMResourceArn;
    /**
     * NextToken is a string that is returned in some command responses. It indicates that not all entries have been returned, and that you must run at least one more request to get remaining items. To get remaining results, call ListTagsForResource again, and assign the token from the previous results as the value of the nextToken parameter. If there are no more results, the response object's nextToken parameter value is null. Setting a nextToken value that was not returned in your previous results causes an InvalidNextTokenException to occur.
     */
    NextToken?: NextToken;
    /**
     * To receive a paginated response, use this parameter to specify the maximum number of results to be returned with a single call. If the number of available results exceeds this maximum, the response includes a NextToken value that you can assign to the NextToken request parameter to get the next set of results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Tags that have been applied to the resource.
     */
    Tags?: TagList;
    /**
     * A token that you can use as the value of NextToken in subsequent calls to the API to show more results.
     */
    NextToken?: NextToken;
  }
  export type MaintenanceStatus = "SUCCESS"|"FAILED"|string;
  export type MaxResults = number;
  export type NextToken = string;
  export type NodeAssociationStatus = "SUCCESS"|"FAILED"|"IN_PROGRESS"|string;
  export type NodeAssociationStatusToken = string;
  export type NodeName = string;
  export interface RestoreServerRequest {
    /**
     *  The ID of the backup that you want to use to restore a server. 
     */
    BackupId: BackupId;
    /**
     *  The name of the server that you want to restore. 
     */
    ServerName: ServerName;
    /**
     *  The type of instance to restore. Valid values must be specified in the following format: ^([cm][34]|t2).* For example, m5.large. Valid values are m5.large, r5.xlarge, and r5.2xlarge. If you do not specify this parameter, RestoreServer uses the instance type from the specified backup. 
     */
    InstanceType?: String;
    /**
     *  The name of the key pair to set on the new EC2 instance. This can be helpful if the administrator no longer has the SSH key. 
     */
    KeyPair?: KeyPair;
  }
  export interface RestoreServerResponse {
    Server?: Server;
  }
  export interface Server {
    /**
     * Associate a public IP address with a server that you are launching. 
     */
    AssociatePublicIpAddress?: Boolean;
    /**
     * The number of automated backups to keep. 
     */
    BackupRetentionCount?: Integer;
    /**
     * The name of the server. 
     */
    ServerName?: String;
    /**
     * Time stamp of server creation. Example 2016-07-29T13:38:47.520Z 
     */
    CreatedAt?: Timestamp;
    /**
     * The ARN of the CloudFormation stack that was used to create the server. 
     */
    CloudFormationStackArn?: String;
    /**
     * An optional public endpoint of a server, such as https://aws.my-company.com. You cannot access the server by using the Endpoint value if the server has a CustomDomain specified.
     */
    CustomDomain?: CustomDomain;
    /**
     * Disables automated backups. The number of stored backups is dependent on the value of PreferredBackupCount. 
     */
    DisableAutomatedBackup?: Boolean;
    /**
     *  A DNS name that can be used to access the engine. Example: myserver-asdfghjkl.us-east-1.opsworks.io. You cannot access the server by using the Endpoint value if the server has a CustomDomain specified. 
     */
    Endpoint?: String;
    /**
     * The engine type of the server. Valid values in this release include ChefAutomate and Puppet. 
     */
    Engine?: String;
    /**
     * The engine model of the server. Valid values in this release include Monolithic for Puppet and Single for Chef. 
     */
    EngineModel?: String;
    /**
     * The response of a createServer() request returns the master credential to access the server in EngineAttributes. These credentials are not stored by AWS OpsWorks CM; they are returned only as part of the result of createServer().   Attributes returned in a createServer response for Chef     CHEF_AUTOMATE_PIVOTAL_KEY: A base64-encoded RSA private key that is generated by AWS OpsWorks for Chef Automate. This private key is required to access the Chef API.    CHEF_STARTER_KIT: A base64-encoded ZIP file. The ZIP file contains a Chef starter kit, which includes a README, a configuration file, and the required RSA private key. Save this file, unzip it, and then change to the directory where you've unzipped the file contents. From this directory, you can run Knife commands.    Attributes returned in a createServer response for Puppet     PUPPET_STARTER_KIT: A base64-encoded ZIP file. The ZIP file contains a Puppet starter kit, including a README and a required private key. Save this file, unzip it, and then change to the directory where you've unzipped the file contents.    PUPPET_ADMIN_PASSWORD: An administrator password that you can use to sign in to the Puppet Enterprise console after the server is online.  
     */
    EngineAttributes?: EngineAttributes;
    /**
     * The engine version of the server. For a Chef server, the valid value for EngineVersion is currently 2. For a Puppet server, specify either 2019 or 2017. 
     */
    EngineVersion?: String;
    /**
     * The instance profile ARN of the server. 
     */
    InstanceProfileArn?: String;
    /**
     *  The instance type for the server, as specified in the CloudFormation stack. This might not be the same instance type that is shown in the EC2 console. 
     */
    InstanceType?: String;
    /**
     * The key pair associated with the server. 
     */
    KeyPair?: String;
    /**
     * The status of the most recent server maintenance run. Shows SUCCESS or FAILED. 
     */
    MaintenanceStatus?: MaintenanceStatus;
    /**
     * The preferred maintenance period specified for the server. 
     */
    PreferredMaintenanceWindow?: TimeWindowDefinition;
    /**
     * The preferred backup period specified for the server. 
     */
    PreferredBackupWindow?: TimeWindowDefinition;
    /**
     *  The security group IDs for the server, as specified in the CloudFormation stack. These might not be the same security groups that are shown in the EC2 console. 
     */
    SecurityGroupIds?: Strings;
    /**
     * The service role ARN used to create the server. 
     */
    ServiceRoleArn?: String;
    /**
     *  The server's status. This field displays the states of actions in progress, such as creating, running, or backing up the server, as well as the server's health state. 
     */
    Status?: ServerStatus;
    /**
     *  Depending on the server status, this field has either a human-readable message (such as a create or backup error), or an escaped block of JSON (used for health check results). 
     */
    StatusReason?: String;
    /**
     *  The subnet IDs specified in a CreateServer request. 
     */
    SubnetIds?: Strings;
    /**
     * The ARN of the server. 
     */
    ServerArn?: String;
  }
  export interface ServerEvent {
    /**
     * The time when the event occurred. 
     */
    CreatedAt?: Timestamp;
    /**
     * The name of the server on or for which the event occurred. 
     */
    ServerName?: String;
    /**
     * A human-readable informational or status message.
     */
    Message?: String;
    /**
     * The Amazon S3 URL of the event's log file.
     */
    LogUrl?: String;
  }
  export type ServerEvents = ServerEvent[];
  export type ServerName = string;
  export type ServerStatus = "BACKING_UP"|"CONNECTION_LOST"|"CREATING"|"DELETING"|"MODIFYING"|"FAILED"|"HEALTHY"|"RUNNING"|"RESTORING"|"SETUP"|"UNDER_MAINTENANCE"|"UNHEALTHY"|"TERMINATED"|string;
  export type Servers = Server[];
  export type ServiceRoleArn = string;
  export interface StartMaintenanceRequest {
    /**
     * The name of the server on which to run maintenance. 
     */
    ServerName: ServerName;
    /**
     * Engine attributes that are specific to the server on which you want to run maintenance.  Attributes accepted in a StartMaintenance request for Chef     CHEF_MAJOR_UPGRADE: If a Chef Automate server is eligible for upgrade to Chef Automate 2, add this engine attribute to a StartMaintenance request and set the value to true to upgrade the server to Chef Automate 2. For more information, see Upgrade an AWS OpsWorks for Chef Automate Server to Chef Automate 2.   
     */
    EngineAttributes?: EngineAttributes;
  }
  export interface StartMaintenanceResponse {
    /**
     * Contains the response to a StartMaintenance request. 
     */
    Server?: Server;
  }
  export type String = string;
  export type Strings = String[];
  export interface Tag {
    /**
     * A tag key, such as Stage or Name. A tag key cannot be empty. The key can be a maximum of 127 characters, and can contain only Unicode letters, numbers, or separators, or the following special characters: + - = . _ : / 
     */
    Key: TagKey;
    /**
     * An optional tag value, such as Production or test-owcm-server. The value can be a maximum of 255 characters, and contain only Unicode letters, numbers, or separators, or the following special characters: + - = . _ : / 
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Number (ARN) of a resource to which you want to apply tags. For example, arn:aws:opsworks-cm:us-west-2:123456789012:server/test-owcm-server/EXAMPLE-66b0-4196-8274-d1a2bEXAMPLE.
     */
    ResourceArn: AWSOpsWorksCMResourceArn;
    /**
     * A map that contains tag keys and tag values to attach to AWS OpsWorks-CM servers or backups.   The key cannot be empty.   The key can be a maximum of 127 characters, and can contain only Unicode letters, numbers, or separators, or the following special characters: + - = . _ : /    The value can be a maximum 255 characters, and contain only Unicode letters, numbers, or separators, or the following special characters: + - = . _ : /    Leading and trailing white spaces are trimmed from both the key and value.   A maximum of 50 user-applied tags is allowed for any AWS OpsWorks-CM server or backup.  
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TimeWindowDefinition = string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Number (ARN) of a resource from which you want to remove tags. For example, arn:aws:opsworks-cm:us-west-2:123456789012:server/test-owcm-server/EXAMPLE-66b0-4196-8274-d1a2bEXAMPLE.
     */
    ResourceArn: AWSOpsWorksCMResourceArn;
    /**
     * The keys of tags that you want to remove.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateServerEngineAttributesRequest {
    /**
     * The name of the server to update. 
     */
    ServerName: ServerName;
    /**
     * The name of the engine attribute to update. 
     */
    AttributeName: AttributeName;
    /**
     * The value to set for the attribute. 
     */
    AttributeValue?: AttributeValue;
  }
  export interface UpdateServerEngineAttributesResponse {
    /**
     * Contains the response to an UpdateServerEngineAttributes request. 
     */
    Server?: Server;
  }
  export interface UpdateServerRequest {
    /**
     * Setting DisableAutomatedBackup to true disables automated or scheduled backups. Automated backups are enabled by default. 
     */
    DisableAutomatedBackup?: Boolean;
    /**
     * Sets the number of automated backups that you want to keep. 
     */
    BackupRetentionCount?: Integer;
    /**
     * The name of the server to update. 
     */
    ServerName: ServerName;
    PreferredMaintenanceWindow?: TimeWindowDefinition;
    PreferredBackupWindow?: TimeWindowDefinition;
  }
  export interface UpdateServerResponse {
    /**
     * Contains the response to a UpdateServer request. 
     */
    Server?: Server;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-11-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the OpsWorksCM client.
   */
  export import Types = OpsWorksCM;
}
export = OpsWorksCM;
