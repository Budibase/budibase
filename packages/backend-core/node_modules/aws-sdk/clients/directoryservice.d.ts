import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class DirectoryService extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: DirectoryService.Types.ClientConfiguration)
  config: Config & DirectoryService.Types.ClientConfiguration;
  /**
   * Accepts a directory sharing request that was sent from the directory owner account.
   */
  acceptSharedDirectory(params: DirectoryService.Types.AcceptSharedDirectoryRequest, callback?: (err: AWSError, data: DirectoryService.Types.AcceptSharedDirectoryResult) => void): Request<DirectoryService.Types.AcceptSharedDirectoryResult, AWSError>;
  /**
   * Accepts a directory sharing request that was sent from the directory owner account.
   */
  acceptSharedDirectory(callback?: (err: AWSError, data: DirectoryService.Types.AcceptSharedDirectoryResult) => void): Request<DirectoryService.Types.AcceptSharedDirectoryResult, AWSError>;
  /**
   * If the DNS server for your self-managed domain uses a publicly addressable IP address, you must add a CIDR address block to correctly route traffic to and from your Microsoft AD on Amazon Web Services. AddIpRoutes adds this address block. You can also use AddIpRoutes to facilitate routing traffic that uses public IP ranges from your Microsoft AD on Amazon Web Services to a peer VPC.  Before you call AddIpRoutes, ensure that all of the required permissions have been explicitly granted through a policy. For details about what permissions are required to run the AddIpRoutes operation, see Directory Service API Permissions: Actions, Resources, and Conditions Reference.
   */
  addIpRoutes(params: DirectoryService.Types.AddIpRoutesRequest, callback?: (err: AWSError, data: DirectoryService.Types.AddIpRoutesResult) => void): Request<DirectoryService.Types.AddIpRoutesResult, AWSError>;
  /**
   * If the DNS server for your self-managed domain uses a publicly addressable IP address, you must add a CIDR address block to correctly route traffic to and from your Microsoft AD on Amazon Web Services. AddIpRoutes adds this address block. You can also use AddIpRoutes to facilitate routing traffic that uses public IP ranges from your Microsoft AD on Amazon Web Services to a peer VPC.  Before you call AddIpRoutes, ensure that all of the required permissions have been explicitly granted through a policy. For details about what permissions are required to run the AddIpRoutes operation, see Directory Service API Permissions: Actions, Resources, and Conditions Reference.
   */
  addIpRoutes(callback?: (err: AWSError, data: DirectoryService.Types.AddIpRoutesResult) => void): Request<DirectoryService.Types.AddIpRoutesResult, AWSError>;
  /**
   * Adds two domain controllers in the specified Region for the specified directory.
   */
  addRegion(params: DirectoryService.Types.AddRegionRequest, callback?: (err: AWSError, data: DirectoryService.Types.AddRegionResult) => void): Request<DirectoryService.Types.AddRegionResult, AWSError>;
  /**
   * Adds two domain controllers in the specified Region for the specified directory.
   */
  addRegion(callback?: (err: AWSError, data: DirectoryService.Types.AddRegionResult) => void): Request<DirectoryService.Types.AddRegionResult, AWSError>;
  /**
   * Adds or overwrites one or more tags for the specified directory. Each directory can have a maximum of 50 tags. Each tag consists of a key and optional value. Tag keys must be unique to each resource.
   */
  addTagsToResource(params: DirectoryService.Types.AddTagsToResourceRequest, callback?: (err: AWSError, data: DirectoryService.Types.AddTagsToResourceResult) => void): Request<DirectoryService.Types.AddTagsToResourceResult, AWSError>;
  /**
   * Adds or overwrites one or more tags for the specified directory. Each directory can have a maximum of 50 tags. Each tag consists of a key and optional value. Tag keys must be unique to each resource.
   */
  addTagsToResource(callback?: (err: AWSError, data: DirectoryService.Types.AddTagsToResourceResult) => void): Request<DirectoryService.Types.AddTagsToResourceResult, AWSError>;
  /**
   * Cancels an in-progress schema extension to a Microsoft AD directory. Once a schema extension has started replicating to all domain controllers, the task can no longer be canceled. A schema extension can be canceled during any of the following states; Initializing, CreatingSnapshot, and UpdatingSchema.
   */
  cancelSchemaExtension(params: DirectoryService.Types.CancelSchemaExtensionRequest, callback?: (err: AWSError, data: DirectoryService.Types.CancelSchemaExtensionResult) => void): Request<DirectoryService.Types.CancelSchemaExtensionResult, AWSError>;
  /**
   * Cancels an in-progress schema extension to a Microsoft AD directory. Once a schema extension has started replicating to all domain controllers, the task can no longer be canceled. A schema extension can be canceled during any of the following states; Initializing, CreatingSnapshot, and UpdatingSchema.
   */
  cancelSchemaExtension(callback?: (err: AWSError, data: DirectoryService.Types.CancelSchemaExtensionResult) => void): Request<DirectoryService.Types.CancelSchemaExtensionResult, AWSError>;
  /**
   * Creates an AD Connector to connect to a self-managed directory. Before you call ConnectDirectory, ensure that all of the required permissions have been explicitly granted through a policy. For details about what permissions are required to run the ConnectDirectory operation, see Directory Service API Permissions: Actions, Resources, and Conditions Reference.
   */
  connectDirectory(params: DirectoryService.Types.ConnectDirectoryRequest, callback?: (err: AWSError, data: DirectoryService.Types.ConnectDirectoryResult) => void): Request<DirectoryService.Types.ConnectDirectoryResult, AWSError>;
  /**
   * Creates an AD Connector to connect to a self-managed directory. Before you call ConnectDirectory, ensure that all of the required permissions have been explicitly granted through a policy. For details about what permissions are required to run the ConnectDirectory operation, see Directory Service API Permissions: Actions, Resources, and Conditions Reference.
   */
  connectDirectory(callback?: (err: AWSError, data: DirectoryService.Types.ConnectDirectoryResult) => void): Request<DirectoryService.Types.ConnectDirectoryResult, AWSError>;
  /**
   * Creates an alias for a directory and assigns the alias to the directory. The alias is used to construct the access URL for the directory, such as http://&lt;alias&gt;.awsapps.com.  After an alias has been created, it cannot be deleted or reused, so this operation should only be used when absolutely necessary. 
   */
  createAlias(params: DirectoryService.Types.CreateAliasRequest, callback?: (err: AWSError, data: DirectoryService.Types.CreateAliasResult) => void): Request<DirectoryService.Types.CreateAliasResult, AWSError>;
  /**
   * Creates an alias for a directory and assigns the alias to the directory. The alias is used to construct the access URL for the directory, such as http://&lt;alias&gt;.awsapps.com.  After an alias has been created, it cannot be deleted or reused, so this operation should only be used when absolutely necessary. 
   */
  createAlias(callback?: (err: AWSError, data: DirectoryService.Types.CreateAliasResult) => void): Request<DirectoryService.Types.CreateAliasResult, AWSError>;
  /**
   * Creates an Active Directory computer object in the specified directory.
   */
  createComputer(params: DirectoryService.Types.CreateComputerRequest, callback?: (err: AWSError, data: DirectoryService.Types.CreateComputerResult) => void): Request<DirectoryService.Types.CreateComputerResult, AWSError>;
  /**
   * Creates an Active Directory computer object in the specified directory.
   */
  createComputer(callback?: (err: AWSError, data: DirectoryService.Types.CreateComputerResult) => void): Request<DirectoryService.Types.CreateComputerResult, AWSError>;
  /**
   * Creates a conditional forwarder associated with your Amazon Web Services directory. Conditional forwarders are required in order to set up a trust relationship with another domain. The conditional forwarder points to the trusted domain.
   */
  createConditionalForwarder(params: DirectoryService.Types.CreateConditionalForwarderRequest, callback?: (err: AWSError, data: DirectoryService.Types.CreateConditionalForwarderResult) => void): Request<DirectoryService.Types.CreateConditionalForwarderResult, AWSError>;
  /**
   * Creates a conditional forwarder associated with your Amazon Web Services directory. Conditional forwarders are required in order to set up a trust relationship with another domain. The conditional forwarder points to the trusted domain.
   */
  createConditionalForwarder(callback?: (err: AWSError, data: DirectoryService.Types.CreateConditionalForwarderResult) => void): Request<DirectoryService.Types.CreateConditionalForwarderResult, AWSError>;
  /**
   * Creates a Simple AD directory. For more information, see Simple Active Directory in the Directory Service Admin Guide. Before you call CreateDirectory, ensure that all of the required permissions have been explicitly granted through a policy. For details about what permissions are required to run the CreateDirectory operation, see Directory Service API Permissions: Actions, Resources, and Conditions Reference.
   */
  createDirectory(params: DirectoryService.Types.CreateDirectoryRequest, callback?: (err: AWSError, data: DirectoryService.Types.CreateDirectoryResult) => void): Request<DirectoryService.Types.CreateDirectoryResult, AWSError>;
  /**
   * Creates a Simple AD directory. For more information, see Simple Active Directory in the Directory Service Admin Guide. Before you call CreateDirectory, ensure that all of the required permissions have been explicitly granted through a policy. For details about what permissions are required to run the CreateDirectory operation, see Directory Service API Permissions: Actions, Resources, and Conditions Reference.
   */
  createDirectory(callback?: (err: AWSError, data: DirectoryService.Types.CreateDirectoryResult) => void): Request<DirectoryService.Types.CreateDirectoryResult, AWSError>;
  /**
   * Creates a subscription to forward real-time Directory Service domain controller security logs to the specified Amazon CloudWatch log group in your Amazon Web Services account.
   */
  createLogSubscription(params: DirectoryService.Types.CreateLogSubscriptionRequest, callback?: (err: AWSError, data: DirectoryService.Types.CreateLogSubscriptionResult) => void): Request<DirectoryService.Types.CreateLogSubscriptionResult, AWSError>;
  /**
   * Creates a subscription to forward real-time Directory Service domain controller security logs to the specified Amazon CloudWatch log group in your Amazon Web Services account.
   */
  createLogSubscription(callback?: (err: AWSError, data: DirectoryService.Types.CreateLogSubscriptionResult) => void): Request<DirectoryService.Types.CreateLogSubscriptionResult, AWSError>;
  /**
   * Creates a Microsoft AD directory in the Amazon Web Services Cloud. For more information, see Managed Microsoft AD in the Directory Service Admin Guide. Before you call CreateMicrosoftAD, ensure that all of the required permissions have been explicitly granted through a policy. For details about what permissions are required to run the CreateMicrosoftAD operation, see Directory Service API Permissions: Actions, Resources, and Conditions Reference.
   */
  createMicrosoftAD(params: DirectoryService.Types.CreateMicrosoftADRequest, callback?: (err: AWSError, data: DirectoryService.Types.CreateMicrosoftADResult) => void): Request<DirectoryService.Types.CreateMicrosoftADResult, AWSError>;
  /**
   * Creates a Microsoft AD directory in the Amazon Web Services Cloud. For more information, see Managed Microsoft AD in the Directory Service Admin Guide. Before you call CreateMicrosoftAD, ensure that all of the required permissions have been explicitly granted through a policy. For details about what permissions are required to run the CreateMicrosoftAD operation, see Directory Service API Permissions: Actions, Resources, and Conditions Reference.
   */
  createMicrosoftAD(callback?: (err: AWSError, data: DirectoryService.Types.CreateMicrosoftADResult) => void): Request<DirectoryService.Types.CreateMicrosoftADResult, AWSError>;
  /**
   * Creates a snapshot of a Simple AD or Microsoft AD directory in the Amazon Web Services cloud.  You cannot take snapshots of AD Connector directories. 
   */
  createSnapshot(params: DirectoryService.Types.CreateSnapshotRequest, callback?: (err: AWSError, data: DirectoryService.Types.CreateSnapshotResult) => void): Request<DirectoryService.Types.CreateSnapshotResult, AWSError>;
  /**
   * Creates a snapshot of a Simple AD or Microsoft AD directory in the Amazon Web Services cloud.  You cannot take snapshots of AD Connector directories. 
   */
  createSnapshot(callback?: (err: AWSError, data: DirectoryService.Types.CreateSnapshotResult) => void): Request<DirectoryService.Types.CreateSnapshotResult, AWSError>;
  /**
   * Directory Service for Microsoft Active Directory allows you to configure trust relationships. For example, you can establish a trust between your Managed Microsoft AD directory, and your existing self-managed Microsoft Active Directory. This would allow you to provide users and groups access to resources in either domain, with a single set of credentials. This action initiates the creation of the Amazon Web Services side of a trust relationship between an Managed Microsoft AD directory and an external domain. You can create either a forest trust or an external trust.
   */
  createTrust(params: DirectoryService.Types.CreateTrustRequest, callback?: (err: AWSError, data: DirectoryService.Types.CreateTrustResult) => void): Request<DirectoryService.Types.CreateTrustResult, AWSError>;
  /**
   * Directory Service for Microsoft Active Directory allows you to configure trust relationships. For example, you can establish a trust between your Managed Microsoft AD directory, and your existing self-managed Microsoft Active Directory. This would allow you to provide users and groups access to resources in either domain, with a single set of credentials. This action initiates the creation of the Amazon Web Services side of a trust relationship between an Managed Microsoft AD directory and an external domain. You can create either a forest trust or an external trust.
   */
  createTrust(callback?: (err: AWSError, data: DirectoryService.Types.CreateTrustResult) => void): Request<DirectoryService.Types.CreateTrustResult, AWSError>;
  /**
   * Deletes a conditional forwarder that has been set up for your Amazon Web Services directory.
   */
  deleteConditionalForwarder(params: DirectoryService.Types.DeleteConditionalForwarderRequest, callback?: (err: AWSError, data: DirectoryService.Types.DeleteConditionalForwarderResult) => void): Request<DirectoryService.Types.DeleteConditionalForwarderResult, AWSError>;
  /**
   * Deletes a conditional forwarder that has been set up for your Amazon Web Services directory.
   */
  deleteConditionalForwarder(callback?: (err: AWSError, data: DirectoryService.Types.DeleteConditionalForwarderResult) => void): Request<DirectoryService.Types.DeleteConditionalForwarderResult, AWSError>;
  /**
   * Deletes an Directory Service directory. Before you call DeleteDirectory, ensure that all of the required permissions have been explicitly granted through a policy. For details about what permissions are required to run the DeleteDirectory operation, see Directory Service API Permissions: Actions, Resources, and Conditions Reference.
   */
  deleteDirectory(params: DirectoryService.Types.DeleteDirectoryRequest, callback?: (err: AWSError, data: DirectoryService.Types.DeleteDirectoryResult) => void): Request<DirectoryService.Types.DeleteDirectoryResult, AWSError>;
  /**
   * Deletes an Directory Service directory. Before you call DeleteDirectory, ensure that all of the required permissions have been explicitly granted through a policy. For details about what permissions are required to run the DeleteDirectory operation, see Directory Service API Permissions: Actions, Resources, and Conditions Reference.
   */
  deleteDirectory(callback?: (err: AWSError, data: DirectoryService.Types.DeleteDirectoryResult) => void): Request<DirectoryService.Types.DeleteDirectoryResult, AWSError>;
  /**
   * Deletes the specified log subscription.
   */
  deleteLogSubscription(params: DirectoryService.Types.DeleteLogSubscriptionRequest, callback?: (err: AWSError, data: DirectoryService.Types.DeleteLogSubscriptionResult) => void): Request<DirectoryService.Types.DeleteLogSubscriptionResult, AWSError>;
  /**
   * Deletes the specified log subscription.
   */
  deleteLogSubscription(callback?: (err: AWSError, data: DirectoryService.Types.DeleteLogSubscriptionResult) => void): Request<DirectoryService.Types.DeleteLogSubscriptionResult, AWSError>;
  /**
   * Deletes a directory snapshot.
   */
  deleteSnapshot(params: DirectoryService.Types.DeleteSnapshotRequest, callback?: (err: AWSError, data: DirectoryService.Types.DeleteSnapshotResult) => void): Request<DirectoryService.Types.DeleteSnapshotResult, AWSError>;
  /**
   * Deletes a directory snapshot.
   */
  deleteSnapshot(callback?: (err: AWSError, data: DirectoryService.Types.DeleteSnapshotResult) => void): Request<DirectoryService.Types.DeleteSnapshotResult, AWSError>;
  /**
   * Deletes an existing trust relationship between your Managed Microsoft AD directory and an external domain.
   */
  deleteTrust(params: DirectoryService.Types.DeleteTrustRequest, callback?: (err: AWSError, data: DirectoryService.Types.DeleteTrustResult) => void): Request<DirectoryService.Types.DeleteTrustResult, AWSError>;
  /**
   * Deletes an existing trust relationship between your Managed Microsoft AD directory and an external domain.
   */
  deleteTrust(callback?: (err: AWSError, data: DirectoryService.Types.DeleteTrustResult) => void): Request<DirectoryService.Types.DeleteTrustResult, AWSError>;
  /**
   * Deletes from the system the certificate that was registered for secure LDAP or client certificate authentication.
   */
  deregisterCertificate(params: DirectoryService.Types.DeregisterCertificateRequest, callback?: (err: AWSError, data: DirectoryService.Types.DeregisterCertificateResult) => void): Request<DirectoryService.Types.DeregisterCertificateResult, AWSError>;
  /**
   * Deletes from the system the certificate that was registered for secure LDAP or client certificate authentication.
   */
  deregisterCertificate(callback?: (err: AWSError, data: DirectoryService.Types.DeregisterCertificateResult) => void): Request<DirectoryService.Types.DeregisterCertificateResult, AWSError>;
  /**
   * Removes the specified directory as a publisher to the specified Amazon SNS topic.
   */
  deregisterEventTopic(params: DirectoryService.Types.DeregisterEventTopicRequest, callback?: (err: AWSError, data: DirectoryService.Types.DeregisterEventTopicResult) => void): Request<DirectoryService.Types.DeregisterEventTopicResult, AWSError>;
  /**
   * Removes the specified directory as a publisher to the specified Amazon SNS topic.
   */
  deregisterEventTopic(callback?: (err: AWSError, data: DirectoryService.Types.DeregisterEventTopicResult) => void): Request<DirectoryService.Types.DeregisterEventTopicResult, AWSError>;
  /**
   * Displays information about the certificate registered for secure LDAP or client certificate authentication.
   */
  describeCertificate(params: DirectoryService.Types.DescribeCertificateRequest, callback?: (err: AWSError, data: DirectoryService.Types.DescribeCertificateResult) => void): Request<DirectoryService.Types.DescribeCertificateResult, AWSError>;
  /**
   * Displays information about the certificate registered for secure LDAP or client certificate authentication.
   */
  describeCertificate(callback?: (err: AWSError, data: DirectoryService.Types.DescribeCertificateResult) => void): Request<DirectoryService.Types.DescribeCertificateResult, AWSError>;
  /**
   * Retrieves information about the type of client authentication for the specified directory, if the type is specified. If no type is specified, information about all client authentication types that are supported for the specified directory is retrieved. Currently, only SmartCard is supported. 
   */
  describeClientAuthenticationSettings(params: DirectoryService.Types.DescribeClientAuthenticationSettingsRequest, callback?: (err: AWSError, data: DirectoryService.Types.DescribeClientAuthenticationSettingsResult) => void): Request<DirectoryService.Types.DescribeClientAuthenticationSettingsResult, AWSError>;
  /**
   * Retrieves information about the type of client authentication for the specified directory, if the type is specified. If no type is specified, information about all client authentication types that are supported for the specified directory is retrieved. Currently, only SmartCard is supported. 
   */
  describeClientAuthenticationSettings(callback?: (err: AWSError, data: DirectoryService.Types.DescribeClientAuthenticationSettingsResult) => void): Request<DirectoryService.Types.DescribeClientAuthenticationSettingsResult, AWSError>;
  /**
   * Obtains information about the conditional forwarders for this account. If no input parameters are provided for RemoteDomainNames, this request describes all conditional forwarders for the specified directory ID.
   */
  describeConditionalForwarders(params: DirectoryService.Types.DescribeConditionalForwardersRequest, callback?: (err: AWSError, data: DirectoryService.Types.DescribeConditionalForwardersResult) => void): Request<DirectoryService.Types.DescribeConditionalForwardersResult, AWSError>;
  /**
   * Obtains information about the conditional forwarders for this account. If no input parameters are provided for RemoteDomainNames, this request describes all conditional forwarders for the specified directory ID.
   */
  describeConditionalForwarders(callback?: (err: AWSError, data: DirectoryService.Types.DescribeConditionalForwardersResult) => void): Request<DirectoryService.Types.DescribeConditionalForwardersResult, AWSError>;
  /**
   * Obtains information about the directories that belong to this account. You can retrieve information about specific directories by passing the directory identifiers in the DirectoryIds parameter. Otherwise, all directories that belong to the current account are returned. This operation supports pagination with the use of the NextToken request and response parameters. If more results are available, the DescribeDirectoriesResult.NextToken member contains a token that you pass in the next call to DescribeDirectories to retrieve the next set of items. You can also specify a maximum number of return results with the Limit parameter.
   */
  describeDirectories(params: DirectoryService.Types.DescribeDirectoriesRequest, callback?: (err: AWSError, data: DirectoryService.Types.DescribeDirectoriesResult) => void): Request<DirectoryService.Types.DescribeDirectoriesResult, AWSError>;
  /**
   * Obtains information about the directories that belong to this account. You can retrieve information about specific directories by passing the directory identifiers in the DirectoryIds parameter. Otherwise, all directories that belong to the current account are returned. This operation supports pagination with the use of the NextToken request and response parameters. If more results are available, the DescribeDirectoriesResult.NextToken member contains a token that you pass in the next call to DescribeDirectories to retrieve the next set of items. You can also specify a maximum number of return results with the Limit parameter.
   */
  describeDirectories(callback?: (err: AWSError, data: DirectoryService.Types.DescribeDirectoriesResult) => void): Request<DirectoryService.Types.DescribeDirectoriesResult, AWSError>;
  /**
   * Provides information about any domain controllers in your directory.
   */
  describeDomainControllers(params: DirectoryService.Types.DescribeDomainControllersRequest, callback?: (err: AWSError, data: DirectoryService.Types.DescribeDomainControllersResult) => void): Request<DirectoryService.Types.DescribeDomainControllersResult, AWSError>;
  /**
   * Provides information about any domain controllers in your directory.
   */
  describeDomainControllers(callback?: (err: AWSError, data: DirectoryService.Types.DescribeDomainControllersResult) => void): Request<DirectoryService.Types.DescribeDomainControllersResult, AWSError>;
  /**
   * Obtains information about which Amazon SNS topics receive status messages from the specified directory. If no input parameters are provided, such as DirectoryId or TopicName, this request describes all of the associations in the account.
   */
  describeEventTopics(params: DirectoryService.Types.DescribeEventTopicsRequest, callback?: (err: AWSError, data: DirectoryService.Types.DescribeEventTopicsResult) => void): Request<DirectoryService.Types.DescribeEventTopicsResult, AWSError>;
  /**
   * Obtains information about which Amazon SNS topics receive status messages from the specified directory. If no input parameters are provided, such as DirectoryId or TopicName, this request describes all of the associations in the account.
   */
  describeEventTopics(callback?: (err: AWSError, data: DirectoryService.Types.DescribeEventTopicsResult) => void): Request<DirectoryService.Types.DescribeEventTopicsResult, AWSError>;
  /**
   * Describes the status of LDAP security for the specified directory.
   */
  describeLDAPSSettings(params: DirectoryService.Types.DescribeLDAPSSettingsRequest, callback?: (err: AWSError, data: DirectoryService.Types.DescribeLDAPSSettingsResult) => void): Request<DirectoryService.Types.DescribeLDAPSSettingsResult, AWSError>;
  /**
   * Describes the status of LDAP security for the specified directory.
   */
  describeLDAPSSettings(callback?: (err: AWSError, data: DirectoryService.Types.DescribeLDAPSSettingsResult) => void): Request<DirectoryService.Types.DescribeLDAPSSettingsResult, AWSError>;
  /**
   * Provides information about the Regions that are configured for multi-Region replication.
   */
  describeRegions(params: DirectoryService.Types.DescribeRegionsRequest, callback?: (err: AWSError, data: DirectoryService.Types.DescribeRegionsResult) => void): Request<DirectoryService.Types.DescribeRegionsResult, AWSError>;
  /**
   * Provides information about the Regions that are configured for multi-Region replication.
   */
  describeRegions(callback?: (err: AWSError, data: DirectoryService.Types.DescribeRegionsResult) => void): Request<DirectoryService.Types.DescribeRegionsResult, AWSError>;
  /**
   * Returns the shared directories in your account. 
   */
  describeSharedDirectories(params: DirectoryService.Types.DescribeSharedDirectoriesRequest, callback?: (err: AWSError, data: DirectoryService.Types.DescribeSharedDirectoriesResult) => void): Request<DirectoryService.Types.DescribeSharedDirectoriesResult, AWSError>;
  /**
   * Returns the shared directories in your account. 
   */
  describeSharedDirectories(callback?: (err: AWSError, data: DirectoryService.Types.DescribeSharedDirectoriesResult) => void): Request<DirectoryService.Types.DescribeSharedDirectoriesResult, AWSError>;
  /**
   * Obtains information about the directory snapshots that belong to this account. This operation supports pagination with the use of the NextToken request and response parameters. If more results are available, the DescribeSnapshots.NextToken member contains a token that you pass in the next call to DescribeSnapshots to retrieve the next set of items. You can also specify a maximum number of return results with the Limit parameter.
   */
  describeSnapshots(params: DirectoryService.Types.DescribeSnapshotsRequest, callback?: (err: AWSError, data: DirectoryService.Types.DescribeSnapshotsResult) => void): Request<DirectoryService.Types.DescribeSnapshotsResult, AWSError>;
  /**
   * Obtains information about the directory snapshots that belong to this account. This operation supports pagination with the use of the NextToken request and response parameters. If more results are available, the DescribeSnapshots.NextToken member contains a token that you pass in the next call to DescribeSnapshots to retrieve the next set of items. You can also specify a maximum number of return results with the Limit parameter.
   */
  describeSnapshots(callback?: (err: AWSError, data: DirectoryService.Types.DescribeSnapshotsResult) => void): Request<DirectoryService.Types.DescribeSnapshotsResult, AWSError>;
  /**
   * Obtains information about the trust relationships for this account. If no input parameters are provided, such as DirectoryId or TrustIds, this request describes all the trust relationships belonging to the account.
   */
  describeTrusts(params: DirectoryService.Types.DescribeTrustsRequest, callback?: (err: AWSError, data: DirectoryService.Types.DescribeTrustsResult) => void): Request<DirectoryService.Types.DescribeTrustsResult, AWSError>;
  /**
   * Obtains information about the trust relationships for this account. If no input parameters are provided, such as DirectoryId or TrustIds, this request describes all the trust relationships belonging to the account.
   */
  describeTrusts(callback?: (err: AWSError, data: DirectoryService.Types.DescribeTrustsResult) => void): Request<DirectoryService.Types.DescribeTrustsResult, AWSError>;
  /**
   * Disables alternative client authentication methods for the specified directory. 
   */
  disableClientAuthentication(params: DirectoryService.Types.DisableClientAuthenticationRequest, callback?: (err: AWSError, data: DirectoryService.Types.DisableClientAuthenticationResult) => void): Request<DirectoryService.Types.DisableClientAuthenticationResult, AWSError>;
  /**
   * Disables alternative client authentication methods for the specified directory. 
   */
  disableClientAuthentication(callback?: (err: AWSError, data: DirectoryService.Types.DisableClientAuthenticationResult) => void): Request<DirectoryService.Types.DisableClientAuthenticationResult, AWSError>;
  /**
   * Deactivates LDAP secure calls for the specified directory.
   */
  disableLDAPS(params: DirectoryService.Types.DisableLDAPSRequest, callback?: (err: AWSError, data: DirectoryService.Types.DisableLDAPSResult) => void): Request<DirectoryService.Types.DisableLDAPSResult, AWSError>;
  /**
   * Deactivates LDAP secure calls for the specified directory.
   */
  disableLDAPS(callback?: (err: AWSError, data: DirectoryService.Types.DisableLDAPSResult) => void): Request<DirectoryService.Types.DisableLDAPSResult, AWSError>;
  /**
   * Disables multi-factor authentication (MFA) with the Remote Authentication Dial In User Service (RADIUS) server for an AD Connector or Microsoft AD directory.
   */
  disableRadius(params: DirectoryService.Types.DisableRadiusRequest, callback?: (err: AWSError, data: DirectoryService.Types.DisableRadiusResult) => void): Request<DirectoryService.Types.DisableRadiusResult, AWSError>;
  /**
   * Disables multi-factor authentication (MFA) with the Remote Authentication Dial In User Service (RADIUS) server for an AD Connector or Microsoft AD directory.
   */
  disableRadius(callback?: (err: AWSError, data: DirectoryService.Types.DisableRadiusResult) => void): Request<DirectoryService.Types.DisableRadiusResult, AWSError>;
  /**
   * Disables single-sign on for a directory.
   */
  disableSso(params: DirectoryService.Types.DisableSsoRequest, callback?: (err: AWSError, data: DirectoryService.Types.DisableSsoResult) => void): Request<DirectoryService.Types.DisableSsoResult, AWSError>;
  /**
   * Disables single-sign on for a directory.
   */
  disableSso(callback?: (err: AWSError, data: DirectoryService.Types.DisableSsoResult) => void): Request<DirectoryService.Types.DisableSsoResult, AWSError>;
  /**
   * Enables alternative client authentication methods for the specified directory.
   */
  enableClientAuthentication(params: DirectoryService.Types.EnableClientAuthenticationRequest, callback?: (err: AWSError, data: DirectoryService.Types.EnableClientAuthenticationResult) => void): Request<DirectoryService.Types.EnableClientAuthenticationResult, AWSError>;
  /**
   * Enables alternative client authentication methods for the specified directory.
   */
  enableClientAuthentication(callback?: (err: AWSError, data: DirectoryService.Types.EnableClientAuthenticationResult) => void): Request<DirectoryService.Types.EnableClientAuthenticationResult, AWSError>;
  /**
   * Activates the switch for the specific directory to always use LDAP secure calls.
   */
  enableLDAPS(params: DirectoryService.Types.EnableLDAPSRequest, callback?: (err: AWSError, data: DirectoryService.Types.EnableLDAPSResult) => void): Request<DirectoryService.Types.EnableLDAPSResult, AWSError>;
  /**
   * Activates the switch for the specific directory to always use LDAP secure calls.
   */
  enableLDAPS(callback?: (err: AWSError, data: DirectoryService.Types.EnableLDAPSResult) => void): Request<DirectoryService.Types.EnableLDAPSResult, AWSError>;
  /**
   * Enables multi-factor authentication (MFA) with the Remote Authentication Dial In User Service (RADIUS) server for an AD Connector or Microsoft AD directory.
   */
  enableRadius(params: DirectoryService.Types.EnableRadiusRequest, callback?: (err: AWSError, data: DirectoryService.Types.EnableRadiusResult) => void): Request<DirectoryService.Types.EnableRadiusResult, AWSError>;
  /**
   * Enables multi-factor authentication (MFA) with the Remote Authentication Dial In User Service (RADIUS) server for an AD Connector or Microsoft AD directory.
   */
  enableRadius(callback?: (err: AWSError, data: DirectoryService.Types.EnableRadiusResult) => void): Request<DirectoryService.Types.EnableRadiusResult, AWSError>;
  /**
   * Enables single sign-on for a directory. Single sign-on allows users in your directory to access certain Amazon Web Services services from a computer joined to the directory without having to enter their credentials separately.
   */
  enableSso(params: DirectoryService.Types.EnableSsoRequest, callback?: (err: AWSError, data: DirectoryService.Types.EnableSsoResult) => void): Request<DirectoryService.Types.EnableSsoResult, AWSError>;
  /**
   * Enables single sign-on for a directory. Single sign-on allows users in your directory to access certain Amazon Web Services services from a computer joined to the directory without having to enter their credentials separately.
   */
  enableSso(callback?: (err: AWSError, data: DirectoryService.Types.EnableSsoResult) => void): Request<DirectoryService.Types.EnableSsoResult, AWSError>;
  /**
   * Obtains directory limit information for the current Region.
   */
  getDirectoryLimits(params: DirectoryService.Types.GetDirectoryLimitsRequest, callback?: (err: AWSError, data: DirectoryService.Types.GetDirectoryLimitsResult) => void): Request<DirectoryService.Types.GetDirectoryLimitsResult, AWSError>;
  /**
   * Obtains directory limit information for the current Region.
   */
  getDirectoryLimits(callback?: (err: AWSError, data: DirectoryService.Types.GetDirectoryLimitsResult) => void): Request<DirectoryService.Types.GetDirectoryLimitsResult, AWSError>;
  /**
   * Obtains the manual snapshot limits for a directory.
   */
  getSnapshotLimits(params: DirectoryService.Types.GetSnapshotLimitsRequest, callback?: (err: AWSError, data: DirectoryService.Types.GetSnapshotLimitsResult) => void): Request<DirectoryService.Types.GetSnapshotLimitsResult, AWSError>;
  /**
   * Obtains the manual snapshot limits for a directory.
   */
  getSnapshotLimits(callback?: (err: AWSError, data: DirectoryService.Types.GetSnapshotLimitsResult) => void): Request<DirectoryService.Types.GetSnapshotLimitsResult, AWSError>;
  /**
   * For the specified directory, lists all the certificates registered for a secure LDAP or client certificate authentication.
   */
  listCertificates(params: DirectoryService.Types.ListCertificatesRequest, callback?: (err: AWSError, data: DirectoryService.Types.ListCertificatesResult) => void): Request<DirectoryService.Types.ListCertificatesResult, AWSError>;
  /**
   * For the specified directory, lists all the certificates registered for a secure LDAP or client certificate authentication.
   */
  listCertificates(callback?: (err: AWSError, data: DirectoryService.Types.ListCertificatesResult) => void): Request<DirectoryService.Types.ListCertificatesResult, AWSError>;
  /**
   * Lists the address blocks that you have added to a directory.
   */
  listIpRoutes(params: DirectoryService.Types.ListIpRoutesRequest, callback?: (err: AWSError, data: DirectoryService.Types.ListIpRoutesResult) => void): Request<DirectoryService.Types.ListIpRoutesResult, AWSError>;
  /**
   * Lists the address blocks that you have added to a directory.
   */
  listIpRoutes(callback?: (err: AWSError, data: DirectoryService.Types.ListIpRoutesResult) => void): Request<DirectoryService.Types.ListIpRoutesResult, AWSError>;
  /**
   * Lists the active log subscriptions for the Amazon Web Services account.
   */
  listLogSubscriptions(params: DirectoryService.Types.ListLogSubscriptionsRequest, callback?: (err: AWSError, data: DirectoryService.Types.ListLogSubscriptionsResult) => void): Request<DirectoryService.Types.ListLogSubscriptionsResult, AWSError>;
  /**
   * Lists the active log subscriptions for the Amazon Web Services account.
   */
  listLogSubscriptions(callback?: (err: AWSError, data: DirectoryService.Types.ListLogSubscriptionsResult) => void): Request<DirectoryService.Types.ListLogSubscriptionsResult, AWSError>;
  /**
   * Lists all schema extensions applied to a Microsoft AD Directory.
   */
  listSchemaExtensions(params: DirectoryService.Types.ListSchemaExtensionsRequest, callback?: (err: AWSError, data: DirectoryService.Types.ListSchemaExtensionsResult) => void): Request<DirectoryService.Types.ListSchemaExtensionsResult, AWSError>;
  /**
   * Lists all schema extensions applied to a Microsoft AD Directory.
   */
  listSchemaExtensions(callback?: (err: AWSError, data: DirectoryService.Types.ListSchemaExtensionsResult) => void): Request<DirectoryService.Types.ListSchemaExtensionsResult, AWSError>;
  /**
   * Lists all tags on a directory.
   */
  listTagsForResource(params: DirectoryService.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: DirectoryService.Types.ListTagsForResourceResult) => void): Request<DirectoryService.Types.ListTagsForResourceResult, AWSError>;
  /**
   * Lists all tags on a directory.
   */
  listTagsForResource(callback?: (err: AWSError, data: DirectoryService.Types.ListTagsForResourceResult) => void): Request<DirectoryService.Types.ListTagsForResourceResult, AWSError>;
  /**
   * Registers a certificate for a secure LDAP or client certificate authentication.
   */
  registerCertificate(params: DirectoryService.Types.RegisterCertificateRequest, callback?: (err: AWSError, data: DirectoryService.Types.RegisterCertificateResult) => void): Request<DirectoryService.Types.RegisterCertificateResult, AWSError>;
  /**
   * Registers a certificate for a secure LDAP or client certificate authentication.
   */
  registerCertificate(callback?: (err: AWSError, data: DirectoryService.Types.RegisterCertificateResult) => void): Request<DirectoryService.Types.RegisterCertificateResult, AWSError>;
  /**
   * Associates a directory with an Amazon SNS topic. This establishes the directory as a publisher to the specified Amazon SNS topic. You can then receive email or text (SMS) messages when the status of your directory changes. You get notified if your directory goes from an Active status to an Impaired or Inoperable status. You also receive a notification when the directory returns to an Active status.
   */
  registerEventTopic(params: DirectoryService.Types.RegisterEventTopicRequest, callback?: (err: AWSError, data: DirectoryService.Types.RegisterEventTopicResult) => void): Request<DirectoryService.Types.RegisterEventTopicResult, AWSError>;
  /**
   * Associates a directory with an Amazon SNS topic. This establishes the directory as a publisher to the specified Amazon SNS topic. You can then receive email or text (SMS) messages when the status of your directory changes. You get notified if your directory goes from an Active status to an Impaired or Inoperable status. You also receive a notification when the directory returns to an Active status.
   */
  registerEventTopic(callback?: (err: AWSError, data: DirectoryService.Types.RegisterEventTopicResult) => void): Request<DirectoryService.Types.RegisterEventTopicResult, AWSError>;
  /**
   * Rejects a directory sharing request that was sent from the directory owner account.
   */
  rejectSharedDirectory(params: DirectoryService.Types.RejectSharedDirectoryRequest, callback?: (err: AWSError, data: DirectoryService.Types.RejectSharedDirectoryResult) => void): Request<DirectoryService.Types.RejectSharedDirectoryResult, AWSError>;
  /**
   * Rejects a directory sharing request that was sent from the directory owner account.
   */
  rejectSharedDirectory(callback?: (err: AWSError, data: DirectoryService.Types.RejectSharedDirectoryResult) => void): Request<DirectoryService.Types.RejectSharedDirectoryResult, AWSError>;
  /**
   * Removes IP address blocks from a directory.
   */
  removeIpRoutes(params: DirectoryService.Types.RemoveIpRoutesRequest, callback?: (err: AWSError, data: DirectoryService.Types.RemoveIpRoutesResult) => void): Request<DirectoryService.Types.RemoveIpRoutesResult, AWSError>;
  /**
   * Removes IP address blocks from a directory.
   */
  removeIpRoutes(callback?: (err: AWSError, data: DirectoryService.Types.RemoveIpRoutesResult) => void): Request<DirectoryService.Types.RemoveIpRoutesResult, AWSError>;
  /**
   * Stops all replication and removes the domain controllers from the specified Region. You cannot remove the primary Region with this operation. Instead, use the DeleteDirectory API.
   */
  removeRegion(params: DirectoryService.Types.RemoveRegionRequest, callback?: (err: AWSError, data: DirectoryService.Types.RemoveRegionResult) => void): Request<DirectoryService.Types.RemoveRegionResult, AWSError>;
  /**
   * Stops all replication and removes the domain controllers from the specified Region. You cannot remove the primary Region with this operation. Instead, use the DeleteDirectory API.
   */
  removeRegion(callback?: (err: AWSError, data: DirectoryService.Types.RemoveRegionResult) => void): Request<DirectoryService.Types.RemoveRegionResult, AWSError>;
  /**
   * Removes tags from a directory.
   */
  removeTagsFromResource(params: DirectoryService.Types.RemoveTagsFromResourceRequest, callback?: (err: AWSError, data: DirectoryService.Types.RemoveTagsFromResourceResult) => void): Request<DirectoryService.Types.RemoveTagsFromResourceResult, AWSError>;
  /**
   * Removes tags from a directory.
   */
  removeTagsFromResource(callback?: (err: AWSError, data: DirectoryService.Types.RemoveTagsFromResourceResult) => void): Request<DirectoryService.Types.RemoveTagsFromResourceResult, AWSError>;
  /**
   * Resets the password for any user in your Managed Microsoft AD or Simple AD directory. You can reset the password for any user in your directory with the following exceptions:   For Simple AD, you cannot reset the password for any user that is a member of either the Domain Admins or Enterprise Admins group except for the administrator user.   For Managed Microsoft AD, you can only reset the password for a user that is in an OU based off of the NetBIOS name that you typed when you created your directory. For example, you cannot reset the password for a user in the Amazon Web Services Reserved OU. For more information about the OU structure for an Managed Microsoft AD directory, see What Gets Created in the Directory Service Administration Guide.  
   */
  resetUserPassword(params: DirectoryService.Types.ResetUserPasswordRequest, callback?: (err: AWSError, data: DirectoryService.Types.ResetUserPasswordResult) => void): Request<DirectoryService.Types.ResetUserPasswordResult, AWSError>;
  /**
   * Resets the password for any user in your Managed Microsoft AD or Simple AD directory. You can reset the password for any user in your directory with the following exceptions:   For Simple AD, you cannot reset the password for any user that is a member of either the Domain Admins or Enterprise Admins group except for the administrator user.   For Managed Microsoft AD, you can only reset the password for a user that is in an OU based off of the NetBIOS name that you typed when you created your directory. For example, you cannot reset the password for a user in the Amazon Web Services Reserved OU. For more information about the OU structure for an Managed Microsoft AD directory, see What Gets Created in the Directory Service Administration Guide.  
   */
  resetUserPassword(callback?: (err: AWSError, data: DirectoryService.Types.ResetUserPasswordResult) => void): Request<DirectoryService.Types.ResetUserPasswordResult, AWSError>;
  /**
   * Restores a directory using an existing directory snapshot. When you restore a directory from a snapshot, any changes made to the directory after the snapshot date are overwritten. This action returns as soon as the restore operation is initiated. You can monitor the progress of the restore operation by calling the DescribeDirectories operation with the directory identifier. When the DirectoryDescription.Stage value changes to Active, the restore operation is complete.
   */
  restoreFromSnapshot(params: DirectoryService.Types.RestoreFromSnapshotRequest, callback?: (err: AWSError, data: DirectoryService.Types.RestoreFromSnapshotResult) => void): Request<DirectoryService.Types.RestoreFromSnapshotResult, AWSError>;
  /**
   * Restores a directory using an existing directory snapshot. When you restore a directory from a snapshot, any changes made to the directory after the snapshot date are overwritten. This action returns as soon as the restore operation is initiated. You can monitor the progress of the restore operation by calling the DescribeDirectories operation with the directory identifier. When the DirectoryDescription.Stage value changes to Active, the restore operation is complete.
   */
  restoreFromSnapshot(callback?: (err: AWSError, data: DirectoryService.Types.RestoreFromSnapshotResult) => void): Request<DirectoryService.Types.RestoreFromSnapshotResult, AWSError>;
  /**
   * Shares a specified directory (DirectoryId) in your Amazon Web Services account (directory owner) with another Amazon Web Services account (directory consumer). With this operation you can use your directory from any Amazon Web Services account and from any Amazon VPC within an Amazon Web Services Region. When you share your Managed Microsoft AD directory, Directory Service creates a shared directory in the directory consumer account. This shared directory contains the metadata to provide access to the directory within the directory owner account. The shared directory is visible in all VPCs in the directory consumer account. The ShareMethod parameter determines whether the specified directory can be shared between Amazon Web Services accounts inside the same Amazon Web Services organization (ORGANIZATIONS). It also determines whether you can share the directory with any other Amazon Web Services account either inside or outside of the organization (HANDSHAKE). The ShareNotes parameter is only used when HANDSHAKE is called, which sends a directory sharing request to the directory consumer. 
   */
  shareDirectory(params: DirectoryService.Types.ShareDirectoryRequest, callback?: (err: AWSError, data: DirectoryService.Types.ShareDirectoryResult) => void): Request<DirectoryService.Types.ShareDirectoryResult, AWSError>;
  /**
   * Shares a specified directory (DirectoryId) in your Amazon Web Services account (directory owner) with another Amazon Web Services account (directory consumer). With this operation you can use your directory from any Amazon Web Services account and from any Amazon VPC within an Amazon Web Services Region. When you share your Managed Microsoft AD directory, Directory Service creates a shared directory in the directory consumer account. This shared directory contains the metadata to provide access to the directory within the directory owner account. The shared directory is visible in all VPCs in the directory consumer account. The ShareMethod parameter determines whether the specified directory can be shared between Amazon Web Services accounts inside the same Amazon Web Services organization (ORGANIZATIONS). It also determines whether you can share the directory with any other Amazon Web Services account either inside or outside of the organization (HANDSHAKE). The ShareNotes parameter is only used when HANDSHAKE is called, which sends a directory sharing request to the directory consumer. 
   */
  shareDirectory(callback?: (err: AWSError, data: DirectoryService.Types.ShareDirectoryResult) => void): Request<DirectoryService.Types.ShareDirectoryResult, AWSError>;
  /**
   * Applies a schema extension to a Microsoft AD directory.
   */
  startSchemaExtension(params: DirectoryService.Types.StartSchemaExtensionRequest, callback?: (err: AWSError, data: DirectoryService.Types.StartSchemaExtensionResult) => void): Request<DirectoryService.Types.StartSchemaExtensionResult, AWSError>;
  /**
   * Applies a schema extension to a Microsoft AD directory.
   */
  startSchemaExtension(callback?: (err: AWSError, data: DirectoryService.Types.StartSchemaExtensionResult) => void): Request<DirectoryService.Types.StartSchemaExtensionResult, AWSError>;
  /**
   * Stops the directory sharing between the directory owner and consumer accounts. 
   */
  unshareDirectory(params: DirectoryService.Types.UnshareDirectoryRequest, callback?: (err: AWSError, data: DirectoryService.Types.UnshareDirectoryResult) => void): Request<DirectoryService.Types.UnshareDirectoryResult, AWSError>;
  /**
   * Stops the directory sharing between the directory owner and consumer accounts. 
   */
  unshareDirectory(callback?: (err: AWSError, data: DirectoryService.Types.UnshareDirectoryResult) => void): Request<DirectoryService.Types.UnshareDirectoryResult, AWSError>;
  /**
   * Updates a conditional forwarder that has been set up for your Amazon Web Services directory.
   */
  updateConditionalForwarder(params: DirectoryService.Types.UpdateConditionalForwarderRequest, callback?: (err: AWSError, data: DirectoryService.Types.UpdateConditionalForwarderResult) => void): Request<DirectoryService.Types.UpdateConditionalForwarderResult, AWSError>;
  /**
   * Updates a conditional forwarder that has been set up for your Amazon Web Services directory.
   */
  updateConditionalForwarder(callback?: (err: AWSError, data: DirectoryService.Types.UpdateConditionalForwarderResult) => void): Request<DirectoryService.Types.UpdateConditionalForwarderResult, AWSError>;
  /**
   * Adds or removes domain controllers to or from the directory. Based on the difference between current value and new value (provided through this API call), domain controllers will be added or removed. It may take up to 45 minutes for any new domain controllers to become fully active once the requested number of domain controllers is updated. During this time, you cannot make another update request.
   */
  updateNumberOfDomainControllers(params: DirectoryService.Types.UpdateNumberOfDomainControllersRequest, callback?: (err: AWSError, data: DirectoryService.Types.UpdateNumberOfDomainControllersResult) => void): Request<DirectoryService.Types.UpdateNumberOfDomainControllersResult, AWSError>;
  /**
   * Adds or removes domain controllers to or from the directory. Based on the difference between current value and new value (provided through this API call), domain controllers will be added or removed. It may take up to 45 minutes for any new domain controllers to become fully active once the requested number of domain controllers is updated. During this time, you cannot make another update request.
   */
  updateNumberOfDomainControllers(callback?: (err: AWSError, data: DirectoryService.Types.UpdateNumberOfDomainControllersResult) => void): Request<DirectoryService.Types.UpdateNumberOfDomainControllersResult, AWSError>;
  /**
   * Updates the Remote Authentication Dial In User Service (RADIUS) server information for an AD Connector or Microsoft AD directory.
   */
  updateRadius(params: DirectoryService.Types.UpdateRadiusRequest, callback?: (err: AWSError, data: DirectoryService.Types.UpdateRadiusResult) => void): Request<DirectoryService.Types.UpdateRadiusResult, AWSError>;
  /**
   * Updates the Remote Authentication Dial In User Service (RADIUS) server information for an AD Connector or Microsoft AD directory.
   */
  updateRadius(callback?: (err: AWSError, data: DirectoryService.Types.UpdateRadiusResult) => void): Request<DirectoryService.Types.UpdateRadiusResult, AWSError>;
  /**
   * Updates the trust that has been set up between your Managed Microsoft AD directory and an self-managed Active Directory.
   */
  updateTrust(params: DirectoryService.Types.UpdateTrustRequest, callback?: (err: AWSError, data: DirectoryService.Types.UpdateTrustResult) => void): Request<DirectoryService.Types.UpdateTrustResult, AWSError>;
  /**
   * Updates the trust that has been set up between your Managed Microsoft AD directory and an self-managed Active Directory.
   */
  updateTrust(callback?: (err: AWSError, data: DirectoryService.Types.UpdateTrustResult) => void): Request<DirectoryService.Types.UpdateTrustResult, AWSError>;
  /**
   * Directory Service for Microsoft Active Directory allows you to configure and verify trust relationships. This action verifies a trust relationship between your Managed Microsoft AD directory and an external domain.
   */
  verifyTrust(params: DirectoryService.Types.VerifyTrustRequest, callback?: (err: AWSError, data: DirectoryService.Types.VerifyTrustResult) => void): Request<DirectoryService.Types.VerifyTrustResult, AWSError>;
  /**
   * Directory Service for Microsoft Active Directory allows you to configure and verify trust relationships. This action verifies a trust relationship between your Managed Microsoft AD directory and an external domain.
   */
  verifyTrust(callback?: (err: AWSError, data: DirectoryService.Types.VerifyTrustResult) => void): Request<DirectoryService.Types.VerifyTrustResult, AWSError>;
}
declare namespace DirectoryService {
  export interface AcceptSharedDirectoryRequest {
    /**
     * Identifier of the shared directory in the directory consumer account. This identifier is different for each directory owner account. 
     */
    SharedDirectoryId: DirectoryId;
  }
  export interface AcceptSharedDirectoryResult {
    /**
     * The shared directory in the directory consumer account.
     */
    SharedDirectory?: SharedDirectory;
  }
  export type AccessUrl = string;
  export interface AddIpRoutesRequest {
    /**
     * Identifier (ID) of the directory to which to add the address block.
     */
    DirectoryId: DirectoryId;
    /**
     * IP address blocks, using CIDR format, of the traffic to route. This is often the IP address block of the DNS server used for your self-managed domain.
     */
    IpRoutes: IpRoutes;
    /**
     * If set to true, updates the inbound and outbound rules of the security group that has the description: "Amazon Web Services created security group for directory ID directory controllers." Following are the new rules:  Inbound:   Type: Custom UDP Rule, Protocol: UDP, Range: 88, Source: 0.0.0.0/0   Type: Custom UDP Rule, Protocol: UDP, Range: 123, Source: 0.0.0.0/0   Type: Custom UDP Rule, Protocol: UDP, Range: 138, Source: 0.0.0.0/0   Type: Custom UDP Rule, Protocol: UDP, Range: 389, Source: 0.0.0.0/0   Type: Custom UDP Rule, Protocol: UDP, Range: 464, Source: 0.0.0.0/0   Type: Custom UDP Rule, Protocol: UDP, Range: 445, Source: 0.0.0.0/0   Type: Custom TCP Rule, Protocol: TCP, Range: 88, Source: 0.0.0.0/0   Type: Custom TCP Rule, Protocol: TCP, Range: 135, Source: 0.0.0.0/0   Type: Custom TCP Rule, Protocol: TCP, Range: 445, Source: 0.0.0.0/0   Type: Custom TCP Rule, Protocol: TCP, Range: 464, Source: 0.0.0.0/0   Type: Custom TCP Rule, Protocol: TCP, Range: 636, Source: 0.0.0.0/0   Type: Custom TCP Rule, Protocol: TCP, Range: 1024-65535, Source: 0.0.0.0/0   Type: Custom TCP Rule, Protocol: TCP, Range: 3268-33269, Source: 0.0.0.0/0   Type: DNS (UDP), Protocol: UDP, Range: 53, Source: 0.0.0.0/0   Type: DNS (TCP), Protocol: TCP, Range: 53, Source: 0.0.0.0/0   Type: LDAP, Protocol: TCP, Range: 389, Source: 0.0.0.0/0   Type: All ICMP, Protocol: All, Range: N/A, Source: 0.0.0.0/0    Outbound:   Type: All traffic, Protocol: All, Range: All, Destination: 0.0.0.0/0   These security rules impact an internal network interface that is not exposed publicly.
     */
    UpdateSecurityGroupForDirectoryControllers?: UpdateSecurityGroupForDirectoryControllers;
  }
  export interface AddIpRoutesResult {
  }
  export interface AddRegionRequest {
    /**
     * The identifier of the directory to which you want to add Region replication.
     */
    DirectoryId: DirectoryId;
    /**
     * The name of the Region where you want to add domain controllers for replication. For example, us-east-1.
     */
    RegionName: RegionName;
    VPCSettings: DirectoryVpcSettings;
  }
  export interface AddRegionResult {
  }
  export interface AddTagsToResourceRequest {
    /**
     * Identifier (ID) for the directory to which to add the tag.
     */
    ResourceId: ResourceId;
    /**
     * The tags to be assigned to the directory.
     */
    Tags: Tags;
  }
  export interface AddTagsToResourceResult {
  }
  export type AddedDateTime = Date;
  export type AdditionalRegions = RegionName[];
  export type AliasName = string;
  export interface Attribute {
    /**
     * The name of the attribute.
     */
    Name?: AttributeName;
    /**
     * The value of the attribute.
     */
    Value?: AttributeValue;
  }
  export type AttributeName = string;
  export type AttributeValue = string;
  export type Attributes = Attribute[];
  export type AvailabilityZone = string;
  export type AvailabilityZones = AvailabilityZone[];
  export interface CancelSchemaExtensionRequest {
    /**
     * The identifier of the directory whose schema extension will be canceled.
     */
    DirectoryId: DirectoryId;
    /**
     * The identifier of the schema extension that will be canceled.
     */
    SchemaExtensionId: SchemaExtensionId;
  }
  export interface CancelSchemaExtensionResult {
  }
  export interface Certificate {
    /**
     * The identifier of the certificate.
     */
    CertificateId?: CertificateId;
    /**
     * The state of the certificate.
     */
    State?: CertificateState;
    /**
     * Describes a state change for the certificate.
     */
    StateReason?: CertificateStateReason;
    /**
     * The common name for the certificate.
     */
    CommonName?: CertificateCN;
    /**
     * The date and time that the certificate was registered.
     */
    RegisteredDateTime?: CertificateRegisteredDateTime;
    /**
     * The date and time when the certificate will expire.
     */
    ExpiryDateTime?: CertificateExpiryDateTime;
    /**
     * The function that the registered certificate performs. Valid values include ClientLDAPS or ClientCertAuth. The default value is ClientLDAPS.
     */
    Type?: CertificateType;
    /**
     * A ClientCertAuthSettings object that contains client certificate authentication settings.
     */
    ClientCertAuthSettings?: ClientCertAuthSettings;
  }
  export type CertificateCN = string;
  export type CertificateData = string;
  export type CertificateExpiryDateTime = Date;
  export type CertificateId = string;
  export interface CertificateInfo {
    /**
     * The identifier of the certificate.
     */
    CertificateId?: CertificateId;
    /**
     * The common name for the certificate.
     */
    CommonName?: CertificateCN;
    /**
     * The state of the certificate.
     */
    State?: CertificateState;
    /**
     * The date and time when the certificate will expire.
     */
    ExpiryDateTime?: CertificateExpiryDateTime;
    /**
     * The function that the registered certificate performs. Valid values include ClientLDAPS or ClientCertAuth. The default value is ClientLDAPS.
     */
    Type?: CertificateType;
  }
  export type CertificateRegisteredDateTime = Date;
  export type CertificateState = "Registering"|"Registered"|"RegisterFailed"|"Deregistering"|"Deregistered"|"DeregisterFailed"|string;
  export type CertificateStateReason = string;
  export type CertificateType = "ClientCertAuth"|"ClientLDAPS"|string;
  export type CertificatesInfo = CertificateInfo[];
  export type CidrIp = string;
  export type CidrIps = CidrIp[];
  export interface ClientAuthenticationSettingInfo {
    /**
     * The type of client authentication for the specified directory. If no type is specified, a list of all client authentication types that are supported for the directory is retrieved. 
     */
    Type?: ClientAuthenticationType;
    /**
     * Whether the client authentication type is enabled or disabled for the specified directory.
     */
    Status?: ClientAuthenticationStatus;
    /**
     * The date and time when the status of the client authentication type was last updated.
     */
    LastUpdatedDateTime?: LastUpdatedDateTime;
  }
  export type ClientAuthenticationSettingsInfo = ClientAuthenticationSettingInfo[];
  export type ClientAuthenticationStatus = "Enabled"|"Disabled"|string;
  export type ClientAuthenticationType = "SmartCard"|string;
  export interface ClientCertAuthSettings {
    /**
     * Specifies the URL of the default OCSP server used to check for revocation status. A secondary value to any OCSP address found in the AIA extension of the user certificate.
     */
    OCSPUrl?: OCSPUrl;
  }
  export type CloudOnlyDirectoriesLimitReached = boolean;
  export interface Computer {
    /**
     * The identifier of the computer.
     */
    ComputerId?: SID;
    /**
     * The computer name.
     */
    ComputerName?: ComputerName;
    /**
     * An array of Attribute objects containing the LDAP attributes that belong to the computer account.
     */
    ComputerAttributes?: Attributes;
  }
  export type ComputerName = string;
  export type ComputerPassword = string;
  export interface ConditionalForwarder {
    /**
     * The fully qualified domain name (FQDN) of the remote domains pointed to by the conditional forwarder.
     */
    RemoteDomainName?: RemoteDomainName;
    /**
     * The IP addresses of the remote DNS server associated with RemoteDomainName. This is the IP address of the DNS server that your conditional forwarder points to.
     */
    DnsIpAddrs?: DnsIpAddrs;
    /**
     * The replication scope of the conditional forwarder. The only allowed value is Domain, which will replicate the conditional forwarder to all of the domain controllers for your Amazon Web Services directory.
     */
    ReplicationScope?: ReplicationScope;
  }
  export type ConditionalForwarders = ConditionalForwarder[];
  export interface ConnectDirectoryRequest {
    /**
     * The fully qualified name of your self-managed directory, such as corp.example.com.
     */
    Name: DirectoryName;
    /**
     * The NetBIOS name of your self-managed directory, such as CORP.
     */
    ShortName?: DirectoryShortName;
    /**
     * The password for your self-managed user account.
     */
    Password: ConnectPassword;
    /**
     * A description for the directory.
     */
    Description?: Description;
    /**
     * The size of the directory.
     */
    Size: DirectorySize;
    /**
     * A DirectoryConnectSettings object that contains additional information for the operation.
     */
    ConnectSettings: DirectoryConnectSettings;
    /**
     * The tags to be assigned to AD Connector.
     */
    Tags?: Tags;
  }
  export interface ConnectDirectoryResult {
    /**
     * The identifier of the new directory.
     */
    DirectoryId?: DirectoryId;
  }
  export type ConnectPassword = string;
  export type ConnectedDirectoriesLimitReached = boolean;
  export interface CreateAliasRequest {
    /**
     * The identifier of the directory for which to create the alias.
     */
    DirectoryId: DirectoryId;
    /**
     * The requested alias. The alias must be unique amongst all aliases in Amazon Web Services. This operation throws an EntityAlreadyExistsException error if the alias already exists.
     */
    Alias: AliasName;
  }
  export interface CreateAliasResult {
    /**
     * The identifier of the directory.
     */
    DirectoryId?: DirectoryId;
    /**
     * The alias for the directory.
     */
    Alias?: AliasName;
  }
  export interface CreateComputerRequest {
    /**
     * The identifier of the directory in which to create the computer account.
     */
    DirectoryId: DirectoryId;
    /**
     * The name of the computer account.
     */
    ComputerName: ComputerName;
    /**
     * A one-time password that is used to join the computer to the directory. You should generate a random, strong password to use for this parameter.
     */
    Password: ComputerPassword;
    /**
     * The fully-qualified distinguished name of the organizational unit to place the computer account in.
     */
    OrganizationalUnitDistinguishedName?: OrganizationalUnitDN;
    /**
     * An array of Attribute objects that contain any LDAP attributes to apply to the computer account.
     */
    ComputerAttributes?: Attributes;
  }
  export interface CreateComputerResult {
    /**
     * A Computer object that represents the computer account.
     */
    Computer?: Computer;
  }
  export interface CreateConditionalForwarderRequest {
    /**
     * The directory ID of the Amazon Web Services directory for which you are creating the conditional forwarder.
     */
    DirectoryId: DirectoryId;
    /**
     * The fully qualified domain name (FQDN) of the remote domain with which you will set up a trust relationship.
     */
    RemoteDomainName: RemoteDomainName;
    /**
     * The IP addresses of the remote DNS server associated with RemoteDomainName.
     */
    DnsIpAddrs: DnsIpAddrs;
  }
  export interface CreateConditionalForwarderResult {
  }
  export interface CreateDirectoryRequest {
    /**
     * The fully qualified name for the directory, such as corp.example.com.
     */
    Name: DirectoryName;
    /**
     * The NetBIOS name of the directory, such as CORP.
     */
    ShortName?: DirectoryShortName;
    /**
     * The password for the directory administrator. The directory creation process creates a directory administrator account with the user name Administrator and this password. If you need to change the password for the administrator account, you can use the ResetUserPassword API call. The regex pattern for this string is made up of the following conditions:   Length (?=^.{8,64}$) – Must be between 8 and 64 characters   AND any 3 of the following password complexity rules required by Active Directory:   Numbers and upper case and lowercase (?=.*\d)(?=.*[A-Z])(?=.*[a-z])   Numbers and special characters and lower case (?=.*\d)(?=.*[^A-Za-z0-9\s])(?=.*[a-z])   Special characters and upper case and lower case (?=.*[^A-Za-z0-9\s])(?=.*[A-Z])(?=.*[a-z])   Numbers and upper case and special characters (?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9\s])   For additional information about how Active Directory passwords are enforced, see Password must meet complexity requirements on the Microsoft website.
     */
    Password: Password;
    /**
     * A description for the directory.
     */
    Description?: Description;
    /**
     * The size of the directory.
     */
    Size: DirectorySize;
    /**
     * A DirectoryVpcSettings object that contains additional information for the operation.
     */
    VpcSettings?: DirectoryVpcSettings;
    /**
     * The tags to be assigned to the Simple AD directory.
     */
    Tags?: Tags;
  }
  export interface CreateDirectoryResult {
    /**
     * The identifier of the directory that was created.
     */
    DirectoryId?: DirectoryId;
  }
  export interface CreateLogSubscriptionRequest {
    /**
     * Identifier of the directory to which you want to subscribe and receive real-time logs to your specified CloudWatch log group.
     */
    DirectoryId: DirectoryId;
    /**
     * The name of the CloudWatch log group where the real-time domain controller logs are forwarded.
     */
    LogGroupName: LogGroupName;
  }
  export interface CreateLogSubscriptionResult {
  }
  export interface CreateMicrosoftADRequest {
    /**
     * The fully qualified domain name for the Managed Microsoft AD directory, such as corp.example.com. This name will resolve inside your VPC only. It does not need to be publicly resolvable.
     */
    Name: DirectoryName;
    /**
     * The NetBIOS name for your domain, such as CORP. If you don't specify a NetBIOS name, it will default to the first part of your directory DNS. For example, CORP for the directory DNS corp.example.com. 
     */
    ShortName?: DirectoryShortName;
    /**
     * The password for the default administrative user named Admin. If you need to change the password for the administrator account, you can use the ResetUserPassword API call.
     */
    Password: Password;
    /**
     * A description for the directory. This label will appear on the Amazon Web Services console Directory Details page after the directory is created.
     */
    Description?: Description;
    /**
     * Contains VPC information for the CreateDirectory or CreateMicrosoftAD operation.
     */
    VpcSettings: DirectoryVpcSettings;
    /**
     * Managed Microsoft AD is available in two editions: Standard and Enterprise. Enterprise is the default.
     */
    Edition?: DirectoryEdition;
    /**
     * The tags to be assigned to the Managed Microsoft AD directory.
     */
    Tags?: Tags;
  }
  export interface CreateMicrosoftADResult {
    /**
     * The identifier of the directory that was created.
     */
    DirectoryId?: DirectoryId;
  }
  export type CreateSnapshotBeforeSchemaExtension = boolean;
  export interface CreateSnapshotRequest {
    /**
     * The identifier of the directory of which to take a snapshot.
     */
    DirectoryId: DirectoryId;
    /**
     * The descriptive name to apply to the snapshot.
     */
    Name?: SnapshotName;
  }
  export interface CreateSnapshotResult {
    /**
     * The identifier of the snapshot that was created.
     */
    SnapshotId?: SnapshotId;
  }
  export interface CreateTrustRequest {
    /**
     * The Directory ID of the Managed Microsoft AD directory for which to establish the trust relationship.
     */
    DirectoryId: DirectoryId;
    /**
     * The Fully Qualified Domain Name (FQDN) of the external domain for which to create the trust relationship.
     */
    RemoteDomainName: RemoteDomainName;
    /**
     * The trust password. The must be the same password that was used when creating the trust relationship on the external domain.
     */
    TrustPassword: TrustPassword;
    /**
     * The direction of the trust relationship.
     */
    TrustDirection: TrustDirection;
    /**
     * The trust relationship type. Forest is the default.
     */
    TrustType?: TrustType;
    /**
     * The IP addresses of the remote DNS server associated with RemoteDomainName.
     */
    ConditionalForwarderIpAddrs?: DnsIpAddrs;
    /**
     * Optional parameter to enable selective authentication for the trust.
     */
    SelectiveAuth?: SelectiveAuth;
  }
  export interface CreateTrustResult {
    /**
     * A unique identifier for the trust relationship that was created.
     */
    TrustId?: TrustId;
  }
  export type CreatedDateTime = Date;
  export type CustomerId = string;
  export type CustomerUserName = string;
  export type DeleteAssociatedConditionalForwarder = boolean;
  export interface DeleteConditionalForwarderRequest {
    /**
     * The directory ID for which you are deleting the conditional forwarder.
     */
    DirectoryId: DirectoryId;
    /**
     * The fully qualified domain name (FQDN) of the remote domain with which you are deleting the conditional forwarder.
     */
    RemoteDomainName: RemoteDomainName;
  }
  export interface DeleteConditionalForwarderResult {
  }
  export interface DeleteDirectoryRequest {
    /**
     * The identifier of the directory to delete.
     */
    DirectoryId: DirectoryId;
  }
  export interface DeleteDirectoryResult {
    /**
     * The directory identifier.
     */
    DirectoryId?: DirectoryId;
  }
  export interface DeleteLogSubscriptionRequest {
    /**
     * Identifier of the directory whose log subscription you want to delete.
     */
    DirectoryId: DirectoryId;
  }
  export interface DeleteLogSubscriptionResult {
  }
  export interface DeleteSnapshotRequest {
    /**
     * The identifier of the directory snapshot to be deleted.
     */
    SnapshotId: SnapshotId;
  }
  export interface DeleteSnapshotResult {
    /**
     * The identifier of the directory snapshot that was deleted.
     */
    SnapshotId?: SnapshotId;
  }
  export interface DeleteTrustRequest {
    /**
     * The Trust ID of the trust relationship to be deleted.
     */
    TrustId: TrustId;
    /**
     * Delete a conditional forwarder as part of a DeleteTrustRequest.
     */
    DeleteAssociatedConditionalForwarder?: DeleteAssociatedConditionalForwarder;
  }
  export interface DeleteTrustResult {
    /**
     * The Trust ID of the trust relationship that was deleted.
     */
    TrustId?: TrustId;
  }
  export interface DeregisterCertificateRequest {
    /**
     * The identifier of the directory.
     */
    DirectoryId: DirectoryId;
    /**
     * The identifier of the certificate.
     */
    CertificateId: CertificateId;
  }
  export interface DeregisterCertificateResult {
  }
  export interface DeregisterEventTopicRequest {
    /**
     * The Directory ID to remove as a publisher. This directory will no longer send messages to the specified Amazon SNS topic.
     */
    DirectoryId: DirectoryId;
    /**
     * The name of the Amazon SNS topic from which to remove the directory as a publisher.
     */
    TopicName: TopicName;
  }
  export interface DeregisterEventTopicResult {
  }
  export interface DescribeCertificateRequest {
    /**
     * The identifier of the directory.
     */
    DirectoryId: DirectoryId;
    /**
     * The identifier of the certificate.
     */
    CertificateId: CertificateId;
  }
  export interface DescribeCertificateResult {
    /**
     * Information about the certificate, including registered date time, certificate state, the reason for the state, expiration date time, and certificate common name.
     */
    Certificate?: Certificate;
  }
  export interface DescribeClientAuthenticationSettingsRequest {
    /**
     * The identifier of the directory for which to retrieve information.
     */
    DirectoryId: DirectoryId;
    /**
     * The type of client authentication for which to retrieve information. If no type is specified, a list of all client authentication types that are supported for the specified directory is retrieved.
     */
    Type?: ClientAuthenticationType;
    /**
     * The DescribeClientAuthenticationSettingsResult.NextToken value from a previous call to DescribeClientAuthenticationSettings. Pass null if this is the first call.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of items to return. If this value is zero, the maximum number of items is specified by the limitations of the operation. 
     */
    Limit?: PageLimit;
  }
  export interface DescribeClientAuthenticationSettingsResult {
    /**
     * Information about the type of client authentication for the specified directory. The following information is retrieved: The date and time when the status of the client authentication type was last updated, whether the client authentication type is enabled or disabled, and the type of client authentication.
     */
    ClientAuthenticationSettingsInfo?: ClientAuthenticationSettingsInfo;
    /**
     * The next token used to retrieve the client authentication settings if the number of setting types exceeds page limit and there is another page.
     */
    NextToken?: NextToken;
  }
  export interface DescribeConditionalForwardersRequest {
    /**
     * The directory ID for which to get the list of associated conditional forwarders.
     */
    DirectoryId: DirectoryId;
    /**
     * The fully qualified domain names (FQDN) of the remote domains for which to get the list of associated conditional forwarders. If this member is null, all conditional forwarders are returned.
     */
    RemoteDomainNames?: RemoteDomainNames;
  }
  export interface DescribeConditionalForwardersResult {
    /**
     * The list of conditional forwarders that have been created.
     */
    ConditionalForwarders?: ConditionalForwarders;
  }
  export interface DescribeDirectoriesRequest {
    /**
     * A list of identifiers of the directories for which to obtain the information. If this member is null, all directories that belong to the current account are returned. An empty list results in an InvalidParameterException being thrown.
     */
    DirectoryIds?: DirectoryIds;
    /**
     * The DescribeDirectoriesResult.NextToken value from a previous call to DescribeDirectories. Pass null if this is the first call.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of items to return. If this value is zero, the maximum number of items is specified by the limitations of the operation.
     */
    Limit?: Limit;
  }
  export interface DescribeDirectoriesResult {
    /**
     * The list of DirectoryDescription objects that were retrieved. It is possible that this list contains less than the number of items specified in the Limit member of the request. This occurs if there are less than the requested number of items left to retrieve, or if the limitations of the operation have been exceeded.
     */
    DirectoryDescriptions?: DirectoryDescriptions;
    /**
     * If not null, more results are available. Pass this value for the NextToken parameter in a subsequent call to DescribeDirectories to retrieve the next set of items.
     */
    NextToken?: NextToken;
  }
  export interface DescribeDomainControllersRequest {
    /**
     * Identifier of the directory for which to retrieve the domain controller information.
     */
    DirectoryId: DirectoryId;
    /**
     * A list of identifiers for the domain controllers whose information will be provided.
     */
    DomainControllerIds?: DomainControllerIds;
    /**
     * The DescribeDomainControllers.NextToken value from a previous call to DescribeDomainControllers. Pass null if this is the first call. 
     */
    NextToken?: NextToken;
    /**
     * The maximum number of items to return.
     */
    Limit?: Limit;
  }
  export interface DescribeDomainControllersResult {
    /**
     * List of the DomainController objects that were retrieved.
     */
    DomainControllers?: DomainControllers;
    /**
     * If not null, more results are available. Pass this value for the NextToken parameter in a subsequent call to DescribeDomainControllers retrieve the next set of items.
     */
    NextToken?: NextToken;
  }
  export interface DescribeEventTopicsRequest {
    /**
     * The Directory ID for which to get the list of associated Amazon SNS topics. If this member is null, associations for all Directory IDs are returned.
     */
    DirectoryId?: DirectoryId;
    /**
     * A list of Amazon SNS topic names for which to obtain the information. If this member is null, all associations for the specified Directory ID are returned. An empty list results in an InvalidParameterException being thrown.
     */
    TopicNames?: TopicNames;
  }
  export interface DescribeEventTopicsResult {
    /**
     * A list of Amazon SNS topic names that receive status messages from the specified Directory ID.
     */
    EventTopics?: EventTopics;
  }
  export interface DescribeLDAPSSettingsRequest {
    /**
     * The identifier of the directory.
     */
    DirectoryId: DirectoryId;
    /**
     * The type of LDAP security to enable. Currently only the value Client is supported.
     */
    Type?: LDAPSType;
    /**
     * The type of next token used for pagination.
     */
    NextToken?: NextToken;
    /**
     * Specifies the number of items that should be displayed on one page.
     */
    Limit?: PageLimit;
  }
  export interface DescribeLDAPSSettingsResult {
    /**
     * Information about LDAP security for the specified directory, including status of enablement, state last updated date time, and the reason for the state.
     */
    LDAPSSettingsInfo?: LDAPSSettingsInfo;
    /**
     * The next token used to retrieve the LDAPS settings if the number of setting types exceeds page limit and there is another page.
     */
    NextToken?: NextToken;
  }
  export interface DescribeRegionsRequest {
    /**
     * The identifier of the directory.
     */
    DirectoryId: DirectoryId;
    /**
     * The name of the Region. For example, us-east-1.
     */
    RegionName?: RegionName;
    /**
     * The DescribeRegionsResult.NextToken value from a previous call to DescribeRegions. Pass null if this is the first call.
     */
    NextToken?: NextToken;
  }
  export interface DescribeRegionsResult {
    /**
     * List of Region information related to the directory for each replicated Region.
     */
    RegionsDescription?: RegionsDescription;
    /**
     * If not null, more results are available. Pass this value for the NextToken parameter in a subsequent call to DescribeRegions to retrieve the next set of items.
     */
    NextToken?: NextToken;
  }
  export interface DescribeSharedDirectoriesRequest {
    /**
     * Returns the identifier of the directory in the directory owner account. 
     */
    OwnerDirectoryId: DirectoryId;
    /**
     * A list of identifiers of all shared directories in your account. 
     */
    SharedDirectoryIds?: DirectoryIds;
    /**
     * The DescribeSharedDirectoriesResult.NextToken value from a previous call to DescribeSharedDirectories. Pass null if this is the first call. 
     */
    NextToken?: NextToken;
    /**
     * The number of shared directories to return in the response object.
     */
    Limit?: Limit;
  }
  export interface DescribeSharedDirectoriesResult {
    /**
     * A list of all shared directories in your account.
     */
    SharedDirectories?: SharedDirectories;
    /**
     * If not null, token that indicates that more results are available. Pass this value for the NextToken parameter in a subsequent call to DescribeSharedDirectories to retrieve the next set of items.
     */
    NextToken?: NextToken;
  }
  export interface DescribeSnapshotsRequest {
    /**
     * The identifier of the directory for which to retrieve snapshot information.
     */
    DirectoryId?: DirectoryId;
    /**
     * A list of identifiers of the snapshots to obtain the information for. If this member is null or empty, all snapshots are returned using the Limit and NextToken members.
     */
    SnapshotIds?: SnapshotIds;
    /**
     * The DescribeSnapshotsResult.NextToken value from a previous call to DescribeSnapshots. Pass null if this is the first call.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of objects to return.
     */
    Limit?: Limit;
  }
  export interface DescribeSnapshotsResult {
    /**
     * The list of Snapshot objects that were retrieved. It is possible that this list contains less than the number of items specified in the Limit member of the request. This occurs if there are less than the requested number of items left to retrieve, or if the limitations of the operation have been exceeded.
     */
    Snapshots?: Snapshots;
    /**
     * If not null, more results are available. Pass this value in the NextToken member of a subsequent call to DescribeSnapshots.
     */
    NextToken?: NextToken;
  }
  export interface DescribeTrustsRequest {
    /**
     * The Directory ID of the Amazon Web Services directory that is a part of the requested trust relationship.
     */
    DirectoryId?: DirectoryId;
    /**
     * A list of identifiers of the trust relationships for which to obtain the information. If this member is null, all trust relationships that belong to the current account are returned. An empty list results in an InvalidParameterException being thrown.
     */
    TrustIds?: TrustIds;
    /**
     * The DescribeTrustsResult.NextToken value from a previous call to DescribeTrusts. Pass null if this is the first call.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of objects to return.
     */
    Limit?: Limit;
  }
  export interface DescribeTrustsResult {
    /**
     * The list of Trust objects that were retrieved. It is possible that this list contains less than the number of items specified in the Limit member of the request. This occurs if there are less than the requested number of items left to retrieve, or if the limitations of the operation have been exceeded.
     */
    Trusts?: Trusts;
    /**
     * If not null, more results are available. Pass this value for the NextToken parameter in a subsequent call to DescribeTrusts to retrieve the next set of items.
     */
    NextToken?: NextToken;
  }
  export type Description = string;
  export type DesiredNumberOfDomainControllers = number;
  export interface DirectoryConnectSettings {
    /**
     * The identifier of the VPC in which the AD Connector is created.
     */
    VpcId: VpcId;
    /**
     * A list of subnet identifiers in the VPC in which the AD Connector is created.
     */
    SubnetIds: SubnetIds;
    /**
     * A list of one or more IP addresses of DNS servers or domain controllers in your self-managed directory.
     */
    CustomerDnsIps: DnsIpAddrs;
    /**
     * The user name of an account in your self-managed directory that is used to connect to the directory. This account must have the following permissions:   Read users and groups   Create computer objects   Join computers to the domain  
     */
    CustomerUserName: UserName;
  }
  export interface DirectoryConnectSettingsDescription {
    /**
     * The identifier of the VPC that the AD Connector is in.
     */
    VpcId?: VpcId;
    /**
     * A list of subnet identifiers in the VPC that the AD Connector is in.
     */
    SubnetIds?: SubnetIds;
    /**
     * The user name of the service account in your self-managed directory.
     */
    CustomerUserName?: UserName;
    /**
     * The security group identifier for the AD Connector directory.
     */
    SecurityGroupId?: SecurityGroupId;
    /**
     * A list of the Availability Zones that the directory is in.
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * The IP addresses of the AD Connector servers.
     */
    ConnectIps?: IpAddrs;
  }
  export interface DirectoryDescription {
    /**
     * The directory identifier.
     */
    DirectoryId?: DirectoryId;
    /**
     * The fully qualified name of the directory.
     */
    Name?: DirectoryName;
    /**
     * The short name of the directory.
     */
    ShortName?: DirectoryShortName;
    /**
     * The directory size.
     */
    Size?: DirectorySize;
    /**
     * The edition associated with this directory.
     */
    Edition?: DirectoryEdition;
    /**
     * The alias for the directory. If no alias has been created for the directory, the alias is the directory identifier, such as d-XXXXXXXXXX.
     */
    Alias?: AliasName;
    /**
     * The access URL for the directory, such as http://&lt;alias&gt;.awsapps.com. If no alias has been created for the directory, &lt;alias&gt; is the directory identifier, such as d-XXXXXXXXXX.
     */
    AccessUrl?: AccessUrl;
    /**
     * The description for the directory.
     */
    Description?: Description;
    /**
     * The IP addresses of the DNS servers for the directory. For a Simple AD or Microsoft AD directory, these are the IP addresses of the Simple AD or Microsoft AD directory servers. For an AD Connector directory, these are the IP addresses of the DNS servers or domain controllers in your self-managed directory to which the AD Connector is connected.
     */
    DnsIpAddrs?: DnsIpAddrs;
    /**
     * The current stage of the directory.
     */
    Stage?: DirectoryStage;
    /**
     * Current directory status of the shared Managed Microsoft AD directory.
     */
    ShareStatus?: ShareStatus;
    /**
     * The method used when sharing a directory to determine whether the directory should be shared within your Amazon Web Services organization (ORGANIZATIONS) or with any Amazon Web Services account by sending a shared directory request (HANDSHAKE).
     */
    ShareMethod?: ShareMethod;
    /**
     * A directory share request that is sent by the directory owner to the directory consumer. The request includes a typed message to help the directory consumer administrator determine whether to approve or reject the share invitation.
     */
    ShareNotes?: Notes;
    /**
     * Specifies when the directory was created.
     */
    LaunchTime?: LaunchTime;
    /**
     * The date and time that the stage was last updated.
     */
    StageLastUpdatedDateTime?: LastUpdatedDateTime;
    /**
     * The directory size.
     */
    Type?: DirectoryType;
    /**
     * A DirectoryVpcSettingsDescription object that contains additional information about a directory. This member is only present if the directory is a Simple AD or Managed Microsoft AD directory.
     */
    VpcSettings?: DirectoryVpcSettingsDescription;
    /**
     * A DirectoryConnectSettingsDescription object that contains additional information about an AD Connector directory. This member is only present if the directory is an AD Connector directory.
     */
    ConnectSettings?: DirectoryConnectSettingsDescription;
    /**
     * A RadiusSettings object that contains information about the RADIUS server configured for this directory.
     */
    RadiusSettings?: RadiusSettings;
    /**
     * The status of the RADIUS MFA server connection.
     */
    RadiusStatus?: RadiusStatus;
    /**
     * Additional information about the directory stage.
     */
    StageReason?: StageReason;
    /**
     * Indicates if single sign-on is enabled for the directory. For more information, see EnableSso and DisableSso.
     */
    SsoEnabled?: SsoEnabled;
    /**
     * The desired number of domain controllers in the directory if the directory is Microsoft AD.
     */
    DesiredNumberOfDomainControllers?: DesiredNumberOfDomainControllers;
    /**
     * Describes the Managed Microsoft AD directory in the directory owner account.
     */
    OwnerDirectoryDescription?: OwnerDirectoryDescription;
    /**
     * Lists the Regions where the directory has replicated.
     */
    RegionsInfo?: RegionsInfo;
  }
  export type DirectoryDescriptions = DirectoryDescription[];
  export type DirectoryEdition = "Enterprise"|"Standard"|string;
  export type DirectoryId = string;
  export type DirectoryIds = DirectoryId[];
  export interface DirectoryLimits {
    /**
     * The maximum number of cloud directories allowed in the Region.
     */
    CloudOnlyDirectoriesLimit?: Limit;
    /**
     * The current number of cloud directories in the Region.
     */
    CloudOnlyDirectoriesCurrentCount?: Limit;
    /**
     * Indicates if the cloud directory limit has been reached.
     */
    CloudOnlyDirectoriesLimitReached?: CloudOnlyDirectoriesLimitReached;
    /**
     * The maximum number of Managed Microsoft AD directories allowed in the region.
     */
    CloudOnlyMicrosoftADLimit?: Limit;
    /**
     * The current number of Managed Microsoft AD directories in the region.
     */
    CloudOnlyMicrosoftADCurrentCount?: Limit;
    /**
     * Indicates if the Managed Microsoft AD directory limit has been reached.
     */
    CloudOnlyMicrosoftADLimitReached?: CloudOnlyDirectoriesLimitReached;
    /**
     * The maximum number of connected directories allowed in the Region.
     */
    ConnectedDirectoriesLimit?: Limit;
    /**
     * The current number of connected directories in the Region.
     */
    ConnectedDirectoriesCurrentCount?: Limit;
    /**
     * Indicates if the connected directory limit has been reached.
     */
    ConnectedDirectoriesLimitReached?: ConnectedDirectoriesLimitReached;
  }
  export type DirectoryName = string;
  export type DirectoryShortName = string;
  export type DirectorySize = "Small"|"Large"|string;
  export type DirectoryStage = "Requested"|"Creating"|"Created"|"Active"|"Inoperable"|"Impaired"|"Restoring"|"RestoreFailed"|"Deleting"|"Deleted"|"Failed"|string;
  export type DirectoryType = "SimpleAD"|"ADConnector"|"MicrosoftAD"|"SharedMicrosoftAD"|string;
  export interface DirectoryVpcSettings {
    /**
     * The identifier of the VPC in which to create the directory.
     */
    VpcId: VpcId;
    /**
     * The identifiers of the subnets for the directory servers. The two subnets must be in different Availability Zones. Directory Service creates a directory server and a DNS server in each of these subnets.
     */
    SubnetIds: SubnetIds;
  }
  export interface DirectoryVpcSettingsDescription {
    /**
     * The identifier of the VPC that the directory is in.
     */
    VpcId?: VpcId;
    /**
     * The identifiers of the subnets for the directory servers.
     */
    SubnetIds?: SubnetIds;
    /**
     * The domain controller security group identifier for the directory.
     */
    SecurityGroupId?: SecurityGroupId;
    /**
     * The list of Availability Zones that the directory is in.
     */
    AvailabilityZones?: AvailabilityZones;
  }
  export interface DisableClientAuthenticationRequest {
    /**
     * The identifier of the directory 
     */
    DirectoryId: DirectoryId;
    /**
     * The type of client authentication to disable. Currently, only the parameter, SmartCard is supported.
     */
    Type: ClientAuthenticationType;
  }
  export interface DisableClientAuthenticationResult {
  }
  export interface DisableLDAPSRequest {
    /**
     * The identifier of the directory.
     */
    DirectoryId: DirectoryId;
    /**
     * The type of LDAP security to enable. Currently only the value Client is supported.
     */
    Type: LDAPSType;
  }
  export interface DisableLDAPSResult {
  }
  export interface DisableRadiusRequest {
    /**
     * The identifier of the directory for which to disable MFA.
     */
    DirectoryId: DirectoryId;
  }
  export interface DisableRadiusResult {
  }
  export interface DisableSsoRequest {
    /**
     * The identifier of the directory for which to disable single-sign on.
     */
    DirectoryId: DirectoryId;
    /**
     * The username of an alternate account to use to disable single-sign on. This is only used for AD Connector directories. This account must have privileges to remove a service principal name. If the AD Connector service account does not have privileges to remove a service principal name, you can specify an alternate account with the UserName and Password parameters. These credentials are only used to disable single sign-on and are not stored by the service. The AD Connector service account is not changed.
     */
    UserName?: UserName;
    /**
     * The password of an alternate account to use to disable single-sign on. This is only used for AD Connector directories. For more information, see the UserName parameter.
     */
    Password?: ConnectPassword;
  }
  export interface DisableSsoResult {
  }
  export type DnsIpAddrs = IpAddr[];
  export interface DomainController {
    /**
     * Identifier of the directory where the domain controller resides.
     */
    DirectoryId?: DirectoryId;
    /**
     * Identifies a specific domain controller in the directory.
     */
    DomainControllerId?: DomainControllerId;
    /**
     * The IP address of the domain controller.
     */
    DnsIpAddr?: IpAddr;
    /**
     * The identifier of the VPC that contains the domain controller.
     */
    VpcId?: VpcId;
    /**
     * Identifier of the subnet in the VPC that contains the domain controller.
     */
    SubnetId?: SubnetId;
    /**
     * The Availability Zone where the domain controller is located.
     */
    AvailabilityZone?: AvailabilityZone;
    /**
     * The status of the domain controller.
     */
    Status?: DomainControllerStatus;
    /**
     * A description of the domain controller state.
     */
    StatusReason?: DomainControllerStatusReason;
    /**
     * Specifies when the domain controller was created.
     */
    LaunchTime?: LaunchTime;
    /**
     * The date and time that the status was last updated.
     */
    StatusLastUpdatedDateTime?: LastUpdatedDateTime;
  }
  export type DomainControllerId = string;
  export type DomainControllerIds = DomainControllerId[];
  export type DomainControllerStatus = "Creating"|"Active"|"Impaired"|"Restoring"|"Deleting"|"Deleted"|"Failed"|string;
  export type DomainControllerStatusReason = string;
  export type DomainControllers = DomainController[];
  export interface EnableClientAuthenticationRequest {
    /**
     * The identifier of the specified directory. 
     */
    DirectoryId: DirectoryId;
    /**
     * The type of client authentication to enable. Currently only the value SmartCard is supported. Smart card authentication in AD Connector requires that you enable Kerberos Constrained Delegation for the Service User to the LDAP service in your self-managed AD. 
     */
    Type: ClientAuthenticationType;
  }
  export interface EnableClientAuthenticationResult {
  }
  export interface EnableLDAPSRequest {
    /**
     * The identifier of the directory.
     */
    DirectoryId: DirectoryId;
    /**
     * The type of LDAP security to enable. Currently only the value Client is supported.
     */
    Type: LDAPSType;
  }
  export interface EnableLDAPSResult {
  }
  export interface EnableRadiusRequest {
    /**
     * The identifier of the directory for which to enable MFA.
     */
    DirectoryId: DirectoryId;
    /**
     * A RadiusSettings object that contains information about the RADIUS server.
     */
    RadiusSettings: RadiusSettings;
  }
  export interface EnableRadiusResult {
  }
  export interface EnableSsoRequest {
    /**
     * The identifier of the directory for which to enable single-sign on.
     */
    DirectoryId: DirectoryId;
    /**
     * The username of an alternate account to use to enable single-sign on. This is only used for AD Connector directories. This account must have privileges to add a service principal name. If the AD Connector service account does not have privileges to add a service principal name, you can specify an alternate account with the UserName and Password parameters. These credentials are only used to enable single sign-on and are not stored by the service. The AD Connector service account is not changed.
     */
    UserName?: UserName;
    /**
     * The password of an alternate account to use to enable single-sign on. This is only used for AD Connector directories. For more information, see the UserName parameter.
     */
    Password?: ConnectPassword;
  }
  export interface EnableSsoResult {
  }
  export type EndDateTime = Date;
  export interface EventTopic {
    /**
     * The Directory ID of an Directory Service directory that will publish status messages to an Amazon SNS topic.
     */
    DirectoryId?: DirectoryId;
    /**
     * The name of an Amazon SNS topic the receives status messages from the directory.
     */
    TopicName?: TopicName;
    /**
     * The Amazon SNS topic ARN (Amazon Resource Name).
     */
    TopicArn?: TopicArn;
    /**
     * The date and time of when you associated your directory with the Amazon SNS topic.
     */
    CreatedDateTime?: CreatedDateTime;
    /**
     * The topic registration status.
     */
    Status?: TopicStatus;
  }
  export type EventTopics = EventTopic[];
  export interface GetDirectoryLimitsRequest {
  }
  export interface GetDirectoryLimitsResult {
    /**
     * A DirectoryLimits object that contains the directory limits for the current Region.
     */
    DirectoryLimits?: DirectoryLimits;
  }
  export interface GetSnapshotLimitsRequest {
    /**
     * Contains the identifier of the directory to obtain the limits for.
     */
    DirectoryId: DirectoryId;
  }
  export interface GetSnapshotLimitsResult {
    /**
     * A SnapshotLimits object that contains the manual snapshot limits for the specified directory.
     */
    SnapshotLimits?: SnapshotLimits;
  }
  export type IpAddr = string;
  export type IpAddrs = IpAddr[];
  export interface IpRoute {
    /**
     * IP address block using CIDR format, for example 10.0.0.0/24. This is often the address block of the DNS server used for your self-managed domain. For a single IP address use a CIDR address block with /32. For example 10.0.0.0/32.
     */
    CidrIp?: CidrIp;
    /**
     * Description of the address block.
     */
    Description?: Description;
  }
  export interface IpRouteInfo {
    /**
     * Identifier (ID) of the directory associated with the IP addresses.
     */
    DirectoryId?: DirectoryId;
    /**
     * IP address block in the IpRoute.
     */
    CidrIp?: CidrIp;
    /**
     * The status of the IP address block.
     */
    IpRouteStatusMsg?: IpRouteStatusMsg;
    /**
     * The date and time the address block was added to the directory.
     */
    AddedDateTime?: AddedDateTime;
    /**
     * The reason for the IpRouteStatusMsg.
     */
    IpRouteStatusReason?: IpRouteStatusReason;
    /**
     * Description of the IpRouteInfo.
     */
    Description?: Description;
  }
  export type IpRouteStatusMsg = "Adding"|"Added"|"Removing"|"Removed"|"AddFailed"|"RemoveFailed"|string;
  export type IpRouteStatusReason = string;
  export type IpRoutes = IpRoute[];
  export type IpRoutesInfo = IpRouteInfo[];
  export interface LDAPSSettingInfo {
    /**
     * The state of the LDAPS settings.
     */
    LDAPSStatus?: LDAPSStatus;
    /**
     * Describes a state change for LDAPS.
     */
    LDAPSStatusReason?: LDAPSStatusReason;
    /**
     * The date and time when the LDAPS settings were last updated.
     */
    LastUpdatedDateTime?: LastUpdatedDateTime;
  }
  export type LDAPSSettingsInfo = LDAPSSettingInfo[];
  export type LDAPSStatus = "Enabling"|"Enabled"|"EnableFailed"|"Disabled"|string;
  export type LDAPSStatusReason = string;
  export type LDAPSType = "Client"|string;
  export type LastUpdatedDateTime = Date;
  export type LaunchTime = Date;
  export type LdifContent = string;
  export type Limit = number;
  export interface ListCertificatesRequest {
    /**
     * The identifier of the directory.
     */
    DirectoryId: DirectoryId;
    /**
     * A token for requesting another page of certificates if the NextToken response element indicates that more certificates are available. Use the value of the returned NextToken element in your request until the token comes back as null. Pass null if this is the first call.
     */
    NextToken?: NextToken;
    /**
     * The number of items that should show up on one page
     */
    Limit?: PageLimit;
  }
  export interface ListCertificatesResult {
    /**
     * Indicates whether another page of certificates is available when the number of available certificates exceeds the page limit.
     */
    NextToken?: NextToken;
    /**
     * A list of certificates with basic details including certificate ID, certificate common name, certificate state.
     */
    CertificatesInfo?: CertificatesInfo;
  }
  export interface ListIpRoutesRequest {
    /**
     * Identifier (ID) of the directory for which you want to retrieve the IP addresses.
     */
    DirectoryId: DirectoryId;
    /**
     * The ListIpRoutes.NextToken value from a previous call to ListIpRoutes. Pass null if this is the first call.
     */
    NextToken?: NextToken;
    /**
     * Maximum number of items to return. If this value is zero, the maximum number of items is specified by the limitations of the operation.
     */
    Limit?: Limit;
  }
  export interface ListIpRoutesResult {
    /**
     * A list of IpRoutes.
     */
    IpRoutesInfo?: IpRoutesInfo;
    /**
     * If not null, more results are available. Pass this value for the NextToken parameter in a subsequent call to ListIpRoutes to retrieve the next set of items.
     */
    NextToken?: NextToken;
  }
  export interface ListLogSubscriptionsRequest {
    /**
     * If a DirectoryID is provided, lists only the log subscription associated with that directory. If no DirectoryId is provided, lists all log subscriptions associated with your Amazon Web Services account. If there are no log subscriptions for the Amazon Web Services account or the directory, an empty list will be returned.
     */
    DirectoryId?: DirectoryId;
    /**
     * The token for the next set of items to return.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of items returned.
     */
    Limit?: Limit;
  }
  export interface ListLogSubscriptionsResult {
    /**
     * A list of active LogSubscription objects for calling the Amazon Web Services account.
     */
    LogSubscriptions?: LogSubscriptions;
    /**
     * The token for the next set of items to return.
     */
    NextToken?: NextToken;
  }
  export interface ListSchemaExtensionsRequest {
    /**
     * The identifier of the directory from which to retrieve the schema extension information.
     */
    DirectoryId: DirectoryId;
    /**
     * The ListSchemaExtensions.NextToken value from a previous call to ListSchemaExtensions. Pass null if this is the first call.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of items to return.
     */
    Limit?: Limit;
  }
  export interface ListSchemaExtensionsResult {
    /**
     * Information about the schema extensions applied to the directory.
     */
    SchemaExtensionsInfo?: SchemaExtensionsInfo;
    /**
     * If not null, more results are available. Pass this value for the NextToken parameter in a subsequent call to ListSchemaExtensions to retrieve the next set of items.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * Identifier (ID) of the directory for which you want to retrieve tags.
     */
    ResourceId: ResourceId;
    /**
     * Reserved for future use.
     */
    NextToken?: NextToken;
    /**
     * Reserved for future use.
     */
    Limit?: Limit;
  }
  export interface ListTagsForResourceResult {
    /**
     * List of tags returned by the ListTagsForResource operation.
     */
    Tags?: Tags;
    /**
     * Reserved for future use.
     */
    NextToken?: NextToken;
  }
  export type LogGroupName = string;
  export interface LogSubscription {
    /**
     * Identifier (ID) of the directory that you want to associate with the log subscription.
     */
    DirectoryId?: DirectoryId;
    /**
     * The name of the log group.
     */
    LogGroupName?: LogGroupName;
    /**
     * The date and time that the log subscription was created.
     */
    SubscriptionCreatedDateTime?: SubscriptionCreatedDateTime;
  }
  export type LogSubscriptions = LogSubscription[];
  export type ManualSnapshotsLimitReached = boolean;
  export type NextToken = string;
  export type Notes = string;
  export type OCSPUrl = string;
  export type OrganizationalUnitDN = string;
  export interface OwnerDirectoryDescription {
    /**
     * Identifier of the Managed Microsoft AD directory in the directory owner account.
     */
    DirectoryId?: DirectoryId;
    /**
     * Identifier of the directory owner account.
     */
    AccountId?: CustomerId;
    /**
     * IP address of the directory’s domain controllers.
     */
    DnsIpAddrs?: DnsIpAddrs;
    /**
     * Information about the VPC settings for the directory.
     */
    VpcSettings?: DirectoryVpcSettingsDescription;
    /**
     * A RadiusSettings object that contains information about the RADIUS server.
     */
    RadiusSettings?: RadiusSettings;
    /**
     * Information about the status of the RADIUS server.
     */
    RadiusStatus?: RadiusStatus;
  }
  export type PageLimit = number;
  export type Password = string;
  export type PortNumber = number;
  export type RadiusAuthenticationProtocol = "PAP"|"CHAP"|"MS-CHAPv1"|"MS-CHAPv2"|string;
  export type RadiusDisplayLabel = string;
  export type RadiusRetries = number;
  export interface RadiusSettings {
    /**
     * An array of strings that contains the fully qualified domain name (FQDN) or IP addresses of the RADIUS server endpoints, or the FQDN or IP addresses of your RADIUS server load balancer.
     */
    RadiusServers?: Servers;
    /**
     * The port that your RADIUS server is using for communications. Your self-managed network must allow inbound traffic over this port from the Directory Service servers.
     */
    RadiusPort?: PortNumber;
    /**
     * The amount of time, in seconds, to wait for the RADIUS server to respond.
     */
    RadiusTimeout?: RadiusTimeout;
    /**
     * The maximum number of times that communication with the RADIUS server is attempted.
     */
    RadiusRetries?: RadiusRetries;
    /**
     * Required for enabling RADIUS on the directory.
     */
    SharedSecret?: RadiusSharedSecret;
    /**
     * The protocol specified for your RADIUS endpoints.
     */
    AuthenticationProtocol?: RadiusAuthenticationProtocol;
    /**
     * Not currently used.
     */
    DisplayLabel?: RadiusDisplayLabel;
    /**
     * Not currently used.
     */
    UseSameUsername?: UseSameUsername;
  }
  export type RadiusSharedSecret = string;
  export type RadiusStatus = "Creating"|"Completed"|"Failed"|string;
  export type RadiusTimeout = number;
  export interface RegionDescription {
    /**
     * The identifier of the directory.
     */
    DirectoryId?: DirectoryId;
    /**
     * The name of the Region. For example, us-east-1.
     */
    RegionName?: RegionName;
    /**
     * Specifies whether the Region is the primary Region or an additional Region.
     */
    RegionType?: RegionType;
    /**
     * The status of the replication process for the specified Region.
     */
    Status?: DirectoryStage;
    VpcSettings?: DirectoryVpcSettings;
    /**
     * The desired number of domain controllers in the specified Region for the specified directory.
     */
    DesiredNumberOfDomainControllers?: DesiredNumberOfDomainControllers;
    /**
     * Specifies when the Region replication began.
     */
    LaunchTime?: LaunchTime;
    /**
     * The date and time that the Region status was last updated.
     */
    StatusLastUpdatedDateTime?: StateLastUpdatedDateTime;
    /**
     * The date and time that the Region description was last updated.
     */
    LastUpdatedDateTime?: LastUpdatedDateTime;
  }
  export type RegionName = string;
  export type RegionType = "Primary"|"Additional"|string;
  export type RegionsDescription = RegionDescription[];
  export interface RegionsInfo {
    /**
     * The Region where the Managed Microsoft AD directory was originally created.
     */
    PrimaryRegion?: RegionName;
    /**
     * Lists the Regions where the directory has been replicated, excluding the primary Region.
     */
    AdditionalRegions?: AdditionalRegions;
  }
  export interface RegisterCertificateRequest {
    /**
     * The identifier of the directory.
     */
    DirectoryId: DirectoryId;
    /**
     * The certificate PEM string that needs to be registered.
     */
    CertificateData: CertificateData;
    /**
     * The function that the registered certificate performs. Valid values include ClientLDAPS or ClientCertAuth. The default value is ClientLDAPS.
     */
    Type?: CertificateType;
    /**
     * A ClientCertAuthSettings object that contains client certificate authentication settings.
     */
    ClientCertAuthSettings?: ClientCertAuthSettings;
  }
  export interface RegisterCertificateResult {
    /**
     * The identifier of the certificate.
     */
    CertificateId?: CertificateId;
  }
  export interface RegisterEventTopicRequest {
    /**
     * The Directory ID that will publish status messages to the Amazon SNS topic.
     */
    DirectoryId: DirectoryId;
    /**
     * The Amazon SNS topic name to which the directory will publish status messages. This Amazon SNS topic must be in the same region as the specified Directory ID.
     */
    TopicName: TopicName;
  }
  export interface RegisterEventTopicResult {
  }
  export interface RejectSharedDirectoryRequest {
    /**
     * Identifier of the shared directory in the directory consumer account. This identifier is different for each directory owner account.
     */
    SharedDirectoryId: DirectoryId;
  }
  export interface RejectSharedDirectoryResult {
    /**
     * Identifier of the shared directory in the directory consumer account.
     */
    SharedDirectoryId?: DirectoryId;
  }
  export type RemoteDomainName = string;
  export type RemoteDomainNames = RemoteDomainName[];
  export interface RemoveIpRoutesRequest {
    /**
     * Identifier (ID) of the directory from which you want to remove the IP addresses.
     */
    DirectoryId: DirectoryId;
    /**
     * IP address blocks that you want to remove.
     */
    CidrIps: CidrIps;
  }
  export interface RemoveIpRoutesResult {
  }
  export interface RemoveRegionRequest {
    /**
     * The identifier of the directory for which you want to remove Region replication.
     */
    DirectoryId: DirectoryId;
  }
  export interface RemoveRegionResult {
  }
  export interface RemoveTagsFromResourceRequest {
    /**
     * Identifier (ID) of the directory from which to remove the tag.
     */
    ResourceId: ResourceId;
    /**
     * The tag key (name) of the tag to be removed.
     */
    TagKeys: TagKeys;
  }
  export interface RemoveTagsFromResourceResult {
  }
  export type ReplicationScope = "Domain"|string;
  export type RequestId = string;
  export interface ResetUserPasswordRequest {
    /**
     * Identifier of the Managed Microsoft AD or Simple AD directory in which the user resides.
     */
    DirectoryId: DirectoryId;
    /**
     * The user name of the user whose password will be reset.
     */
    UserName: CustomerUserName;
    /**
     * The new password that will be reset.
     */
    NewPassword: UserPassword;
  }
  export interface ResetUserPasswordResult {
  }
  export type ResourceId = string;
  export interface RestoreFromSnapshotRequest {
    /**
     * The identifier of the snapshot to restore from.
     */
    SnapshotId: SnapshotId;
  }
  export interface RestoreFromSnapshotResult {
  }
  export type SID = string;
  export type SchemaExtensionId = string;
  export interface SchemaExtensionInfo {
    /**
     * The identifier of the directory to which the schema extension is applied.
     */
    DirectoryId?: DirectoryId;
    /**
     * The identifier of the schema extension.
     */
    SchemaExtensionId?: SchemaExtensionId;
    /**
     * A description of the schema extension.
     */
    Description?: Description;
    /**
     * The current status of the schema extension.
     */
    SchemaExtensionStatus?: SchemaExtensionStatus;
    /**
     * The reason for the SchemaExtensionStatus.
     */
    SchemaExtensionStatusReason?: SchemaExtensionStatusReason;
    /**
     * The date and time that the schema extension started being applied to the directory.
     */
    StartDateTime?: StartDateTime;
    /**
     * The date and time that the schema extension was completed.
     */
    EndDateTime?: EndDateTime;
  }
  export type SchemaExtensionStatus = "Initializing"|"CreatingSnapshot"|"UpdatingSchema"|"Replicating"|"CancelInProgress"|"RollbackInProgress"|"Cancelled"|"Failed"|"Completed"|string;
  export type SchemaExtensionStatusReason = string;
  export type SchemaExtensionsInfo = SchemaExtensionInfo[];
  export type SecurityGroupId = string;
  export type SelectiveAuth = "Enabled"|"Disabled"|string;
  export type Server = string;
  export type Servers = Server[];
  export interface ShareDirectoryRequest {
    /**
     * Identifier of the Managed Microsoft AD directory that you want to share with other Amazon Web Services accounts.
     */
    DirectoryId: DirectoryId;
    /**
     * A directory share request that is sent by the directory owner to the directory consumer. The request includes a typed message to help the directory consumer administrator determine whether to approve or reject the share invitation.
     */
    ShareNotes?: Notes;
    /**
     * Identifier for the directory consumer account with whom the directory is to be shared.
     */
    ShareTarget: ShareTarget;
    /**
     * The method used when sharing a directory to determine whether the directory should be shared within your Amazon Web Services organization (ORGANIZATIONS) or with any Amazon Web Services account by sending a directory sharing request (HANDSHAKE).
     */
    ShareMethod: ShareMethod;
  }
  export interface ShareDirectoryResult {
    /**
     * Identifier of the directory that is stored in the directory consumer account that is shared from the specified directory (DirectoryId).
     */
    SharedDirectoryId?: DirectoryId;
  }
  export type ShareMethod = "ORGANIZATIONS"|"HANDSHAKE"|string;
  export type ShareStatus = "Shared"|"PendingAcceptance"|"Rejected"|"Rejecting"|"RejectFailed"|"Sharing"|"ShareFailed"|"Deleted"|"Deleting"|string;
  export interface ShareTarget {
    /**
     * Identifier of the directory consumer account.
     */
    Id: TargetId;
    /**
     * Type of identifier to be used in the Id field.
     */
    Type: TargetType;
  }
  export type SharedDirectories = SharedDirectory[];
  export interface SharedDirectory {
    /**
     * Identifier of the directory owner account, which contains the directory that has been shared to the consumer account.
     */
    OwnerAccountId?: CustomerId;
    /**
     * Identifier of the directory in the directory owner account. 
     */
    OwnerDirectoryId?: DirectoryId;
    /**
     * The method used when sharing a directory to determine whether the directory should be shared within your Amazon Web Services organization (ORGANIZATIONS) or with any Amazon Web Services account by sending a shared directory request (HANDSHAKE).
     */
    ShareMethod?: ShareMethod;
    /**
     * Identifier of the directory consumer account that has access to the shared directory (OwnerDirectoryId) in the directory owner account.
     */
    SharedAccountId?: CustomerId;
    /**
     * Identifier of the shared directory in the directory consumer account. This identifier is different for each directory owner account.
     */
    SharedDirectoryId?: DirectoryId;
    /**
     * Current directory status of the shared Managed Microsoft AD directory.
     */
    ShareStatus?: ShareStatus;
    /**
     * A directory share request that is sent by the directory owner to the directory consumer. The request includes a typed message to help the directory consumer administrator determine whether to approve or reject the share invitation.
     */
    ShareNotes?: Notes;
    /**
     * The date and time that the shared directory was created.
     */
    CreatedDateTime?: CreatedDateTime;
    /**
     * The date and time that the shared directory was last updated.
     */
    LastUpdatedDateTime?: LastUpdatedDateTime;
  }
  export interface Snapshot {
    /**
     * The directory identifier.
     */
    DirectoryId?: DirectoryId;
    /**
     * The snapshot identifier.
     */
    SnapshotId?: SnapshotId;
    /**
     * The snapshot type.
     */
    Type?: SnapshotType;
    /**
     * The descriptive name of the snapshot.
     */
    Name?: SnapshotName;
    /**
     * The snapshot status.
     */
    Status?: SnapshotStatus;
    /**
     * The date and time that the snapshot was taken.
     */
    StartTime?: StartTime;
  }
  export type SnapshotId = string;
  export type SnapshotIds = SnapshotId[];
  export interface SnapshotLimits {
    /**
     * The maximum number of manual snapshots allowed.
     */
    ManualSnapshotsLimit?: Limit;
    /**
     * The current number of manual snapshots of the directory.
     */
    ManualSnapshotsCurrentCount?: Limit;
    /**
     * Indicates if the manual snapshot limit has been reached.
     */
    ManualSnapshotsLimitReached?: ManualSnapshotsLimitReached;
  }
  export type SnapshotName = string;
  export type SnapshotStatus = "Creating"|"Completed"|"Failed"|string;
  export type SnapshotType = "Auto"|"Manual"|string;
  export type Snapshots = Snapshot[];
  export type SsoEnabled = boolean;
  export type StageReason = string;
  export type StartDateTime = Date;
  export interface StartSchemaExtensionRequest {
    /**
     * The identifier of the directory for which the schema extension will be applied to.
     */
    DirectoryId: DirectoryId;
    /**
     * If true, creates a snapshot of the directory before applying the schema extension.
     */
    CreateSnapshotBeforeSchemaExtension: CreateSnapshotBeforeSchemaExtension;
    /**
     * The LDIF file represented as a string. To construct the LdifContent string, precede each line as it would be formatted in an ldif file with \n. See the example request below for more details. The file size can be no larger than 1MB.
     */
    LdifContent: LdifContent;
    /**
     * A description of the schema extension.
     */
    Description: Description;
  }
  export interface StartSchemaExtensionResult {
    /**
     * The identifier of the schema extension that will be applied.
     */
    SchemaExtensionId?: SchemaExtensionId;
  }
  export type StartTime = Date;
  export type StateLastUpdatedDateTime = Date;
  export type SubnetId = string;
  export type SubnetIds = SubnetId[];
  export type SubscriptionCreatedDateTime = Date;
  export interface Tag {
    /**
     * Required name of the tag. The string value can be Unicode characters and cannot be prefixed with "aws:". The string can contain only the set of Unicode letters, digits, white-space, '_', '.', '/', '=', '+', '-' (Java regex: "^([\\p{L}\\p{Z}\\p{N}_.:/=+\\-]*)$").
     */
    Key: TagKey;
    /**
     * The optional value of the tag. The string value can be Unicode characters. The string can contain only the set of Unicode letters, digits, white-space, '_', '.', '/', '=', '+', '-' (Java regex: "^([\\p{L}\\p{Z}\\p{N}_.:/=+\\-]*)$").
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export type TagValue = string;
  export type Tags = Tag[];
  export type TargetId = string;
  export type TargetType = "ACCOUNT"|string;
  export type TopicArn = string;
  export type TopicName = string;
  export type TopicNames = TopicName[];
  export type TopicStatus = "Registered"|"Topic not found"|"Failed"|"Deleted"|string;
  export interface Trust {
    /**
     * The Directory ID of the Amazon Web Services directory involved in the trust relationship.
     */
    DirectoryId?: DirectoryId;
    /**
     * The unique ID of the trust relationship.
     */
    TrustId?: TrustId;
    /**
     * The Fully Qualified Domain Name (FQDN) of the external domain involved in the trust relationship.
     */
    RemoteDomainName?: RemoteDomainName;
    /**
     * The trust relationship type. Forest is the default.
     */
    TrustType?: TrustType;
    /**
     * The trust relationship direction.
     */
    TrustDirection?: TrustDirection;
    /**
     * The trust relationship state.
     */
    TrustState?: TrustState;
    /**
     * The date and time that the trust relationship was created.
     */
    CreatedDateTime?: CreatedDateTime;
    /**
     * The date and time that the trust relationship was last updated.
     */
    LastUpdatedDateTime?: LastUpdatedDateTime;
    /**
     * The date and time that the TrustState was last updated.
     */
    StateLastUpdatedDateTime?: StateLastUpdatedDateTime;
    /**
     * The reason for the TrustState.
     */
    TrustStateReason?: TrustStateReason;
    /**
     * Current state of selective authentication for the trust.
     */
    SelectiveAuth?: SelectiveAuth;
  }
  export type TrustDirection = "One-Way: Outgoing"|"One-Way: Incoming"|"Two-Way"|string;
  export type TrustId = string;
  export type TrustIds = TrustId[];
  export type TrustPassword = string;
  export type TrustState = "Creating"|"Created"|"Verifying"|"VerifyFailed"|"Verified"|"Updating"|"UpdateFailed"|"Updated"|"Deleting"|"Deleted"|"Failed"|string;
  export type TrustStateReason = string;
  export type TrustType = "Forest"|"External"|string;
  export type Trusts = Trust[];
  export interface UnshareDirectoryRequest {
    /**
     * The identifier of the Managed Microsoft AD directory that you want to stop sharing.
     */
    DirectoryId: DirectoryId;
    /**
     * Identifier for the directory consumer account with whom the directory has to be unshared.
     */
    UnshareTarget: UnshareTarget;
  }
  export interface UnshareDirectoryResult {
    /**
     * Identifier of the directory stored in the directory consumer account that is to be unshared from the specified directory (DirectoryId).
     */
    SharedDirectoryId?: DirectoryId;
  }
  export interface UnshareTarget {
    /**
     * Identifier of the directory consumer account.
     */
    Id: TargetId;
    /**
     * Type of identifier to be used in the Id field.
     */
    Type: TargetType;
  }
  export interface UpdateConditionalForwarderRequest {
    /**
     * The directory ID of the Amazon Web Services directory for which to update the conditional forwarder.
     */
    DirectoryId: DirectoryId;
    /**
     * The fully qualified domain name (FQDN) of the remote domain with which you will set up a trust relationship.
     */
    RemoteDomainName: RemoteDomainName;
    /**
     * The updated IP addresses of the remote DNS server associated with the conditional forwarder.
     */
    DnsIpAddrs: DnsIpAddrs;
  }
  export interface UpdateConditionalForwarderResult {
  }
  export interface UpdateNumberOfDomainControllersRequest {
    /**
     * Identifier of the directory to which the domain controllers will be added or removed.
     */
    DirectoryId: DirectoryId;
    /**
     * The number of domain controllers desired in the directory.
     */
    DesiredNumber: DesiredNumberOfDomainControllers;
  }
  export interface UpdateNumberOfDomainControllersResult {
  }
  export interface UpdateRadiusRequest {
    /**
     * The identifier of the directory for which to update the RADIUS server information.
     */
    DirectoryId: DirectoryId;
    /**
     * A RadiusSettings object that contains information about the RADIUS server.
     */
    RadiusSettings: RadiusSettings;
  }
  export interface UpdateRadiusResult {
  }
  export type UpdateSecurityGroupForDirectoryControllers = boolean;
  export interface UpdateTrustRequest {
    /**
     * Identifier of the trust relationship.
     */
    TrustId: TrustId;
    /**
     * Updates selective authentication for the trust.
     */
    SelectiveAuth?: SelectiveAuth;
  }
  export interface UpdateTrustResult {
    RequestId?: RequestId;
    /**
     * Identifier of the trust relationship.
     */
    TrustId?: TrustId;
  }
  export type UseSameUsername = boolean;
  export type UserName = string;
  export type UserPassword = string;
  export interface VerifyTrustRequest {
    /**
     * The unique Trust ID of the trust relationship to verify.
     */
    TrustId: TrustId;
  }
  export interface VerifyTrustResult {
    /**
     * The unique Trust ID of the trust relationship that was verified.
     */
    TrustId?: TrustId;
  }
  export type VpcId = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2015-04-16"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the DirectoryService client.
   */
  export import Types = DirectoryService;
}
export = DirectoryService;
